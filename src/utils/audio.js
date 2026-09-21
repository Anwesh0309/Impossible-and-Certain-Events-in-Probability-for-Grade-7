/* =========================================================================
   AUDIO ENGINE — ElevenLabs "Alice" narration pipeline
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2

   Resolution order for every spoken segment:
     1. Pre-generated static mp3  (audioMap[text])          -> zero latency
     2. Dynamic ElevenLabs request (proxy or direct API)    -> cached in memory
                                                              + Cache Storage
     3. Browser speechSynthesis                              -> last-resort fallback

   Queue management: narrate(segments) plays segments one after another.
   A queue token prevents overlap; stopNarration() halts everything at once.
   Preloading: while segment i plays, segment i+1 is already being fetched.
   ========================================================================= */
import { audioMap } from './audioMap.js';

/* ---- Environment (works in Vite, esbuild bundles and plain Node) ---- */
const ENV =
  typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const API_KEY = ENV.VITE_ELEVENLABS_API_KEY || '';
const API_BASE = ENV.VITE_ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io';
const PROXY_URL = ENV.VITE_ELEVENLABS_PROXY_URL || '/api/elevenlabs';

/* ---- Voice profile ---- */
export const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
export const MODEL_ID = 'eleven_multilingual_v2';

/* ---- Voice settings by style (copied from numberbound) ---- */
export const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }
};

/* Browser-voice tuning, only used if ElevenLabs is unavailable */
const BROWSER_TTS = {
  celebration:   { rate: 1.06, pitch: 1.2 },
  encouragement: { rate: 1.0,  pitch: 1.1 },
  question:      { rate: 0.98, pitch: 1.08 },
  emphasis:      { rate: 0.95, pitch: 1.05 },
  thinking:      { rate: 0.9,  pitch: 0.95 },
  statement:     { rate: 1.0,  pitch: 1.0 },
  instruction:   { rate: 1.0,  pitch: 1.0 }
};

export let audioMuted = false;

/* ---- Segment helpers: create styled narration segments ---- */
export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'celebration' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });
export const instruct = text => ({ text, style: 'instruction' });
export const encourage = text => ({ text, style: 'encouragement' });

/* =========================================================================
   Dynamic generation (fallback for text that is not pre-generated)
   ========================================================================= */
const urlCache = new Map();          // "style::text" -> Promise<string|null>
let dynamicDisabled = false;         // set after an auth / quota failure
const CACHE_NAME = 'elevenlabs-narration-v1';

function hashKey(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function cacheRequestFor(text, style) {
  const id = hashKey(`${VOICE_ID}|${MODEL_ID}|${style}|${text}`);
  return new Request(`https://narration.local/${id}`);
}

async function readPersisted(text, style) {
  try {
    if (typeof caches === 'undefined') return null;
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(cacheRequestFor(text, style));
    return hit ? await hit.blob() : null;
  } catch (e) {
    return null;
  }
}

async function writePersisted(text, style, blob) {
  try {
    if (typeof caches === 'undefined') return;
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      cacheRequestFor(text, style),
      new Response(blob, { headers: { 'Content-Type': 'audio/mpeg' } })
    );
  } catch (e) {
    /* persistence is best-effort */
  }
}

async function requestElevenLabs(text, style) {
  const voice_settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
  let res;

  if (API_KEY) {
    // Direct request to the ElevenLabs text-to-speech API
    res = await fetch(
      `${API_BASE}/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg'
        },
        body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings })
      }
    );
  } else {
    // No key in the bundle: use a server-side proxy at /api/elevenlabs
    res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_id: VOICE_ID, model_id: MODEL_ID, voice_settings })
    });
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 402) dynamicDisabled = true;
    throw new Error(`ElevenLabs request failed (${res.status})`);
  }
  const type = res.headers.get('content-type') || '';
  if (!type.includes('audio')) throw new Error('ElevenLabs proxy returned non-audio content');
  return res.blob();
}

/**
 * Resolve the playable URL for a piece of text.
 * 1) static asset from audioMap  2) dynamic ElevenLabs  (null => use browser voice)
 */
export function getAudioUrl(text, style = 'statement', { skipStatic = false } = {}) {
  if (!text) return Promise.resolve(null);
  if (!skipStatic && audioMap[text]) return Promise.resolve(audioMap[text]);
  if (dynamicDisabled) return Promise.resolve(null);

  const key = `${style}::${text}`;
  if (urlCache.has(key)) return urlCache.get(key);

  const job = (async () => {
    try {
      let blob = await readPersisted(text, style);
      if (!blob) {
        blob = await requestElevenLabs(text, style);
        writePersisted(text, style, blob);
      }
      return URL.createObjectURL(blob);
    } catch (err) {
      urlCache.delete(key);
      if (typeof console !== 'undefined') console.warn('[audio] dynamic narration unavailable:', err.message);
      return null;
    }
  })();

  urlCache.set(key, job);
  return job;
}

/** Warm the cache for segments that will be needed soon. */
export function preloadSegments(segments) {
  const list = Array.isArray(segments) ? segments : [segments];
  list.forEach(seg => {
    if (seg && seg.text) getAudioUrl(seg.text, seg.style);
  });
}

/* =========================================================================
   Playback
   ========================================================================= */
let currentQueue = 0;
let currentAudioElement = null;
let resolveCurrent = null;

function releaseCurrent() {
  if (currentAudioElement) {
    try { currentAudioElement.pause(); } catch (e) {}
    currentAudioElement = null;
  }
  if (resolveCurrent) {
    const r = resolveCurrent;
    resolveCurrent = null;
    r();
  }
}

function playUrl(url) {
  return new Promise(resolve => {
    try {
      const audio = new Audio(url);
      currentAudioElement = audio;
      resolveCurrent = resolve;
      const done = () => {
        if (currentAudioElement === audio) currentAudioElement = null;
        if (resolveCurrent === resolve) resolveCurrent = null;
        resolve(true);
      };
      audio.onended = done;
      audio.onerror = () => {
        if (currentAudioElement === audio) currentAudioElement = null;
        if (resolveCurrent === resolve) resolveCurrent = null;
        resolve(false);
      };
      const p = audio.play();
      if (p && p.catch) {
        p.catch(() => {
          if (currentAudioElement === audio) currentAudioElement = null;
          if (resolveCurrent === resolve) resolveCurrent = null;
          resolve(false);
        });
      }
    } catch (e) {
      resolve(false);
    }
  });
}

let ttsVoice = null;
function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { ttsVoice = pickVoice(); };
  ttsVoice = pickVoice();
}

function browserSpeech(seg) {
  return new Promise(resolve => {
    if (audioMuted || typeof window === 'undefined' || !('speechSynthesis' in window) || !seg.text) {
      return resolve();
    }
    const cfg = BROWSER_TTS[seg.style] || BROWSER_TTS.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.volume = 1;
    utter.onend = resolve;
    utter.onerror = resolve;
    window.speechSynthesis.speak(utter);
  });
}

export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

/**
 * Play a list of segments sequentially.
 * narrate(segments, autoplay)  — autoplay=false (or muted) is a no-op.
 */
export async function narrate(segments, autoplay = true) {
  if (!autoplay || audioMuted) return;
  stopNarration();
  const myQueue = ++currentQueue;
  const list = (Array.isArray(segments) ? segments : [segments]).filter(s => s && s.text);

  // Eagerly start fetching the first two segments
  if (list[0]) getAudioUrl(list[0].text, list[0].style);

  for (let i = 0; i < list.length; i++) {
    if (myQueue !== currentQueue || audioMuted) return;
    const seg = list[i];

    // Preload the next segment while this one plays
    if (list[i + 1]) getAudioUrl(list[i + 1].text, list[i + 1].style);

    const url = await getAudioUrl(seg.text, seg.style);
    if (myQueue !== currentQueue || audioMuted) return;

    let played = false;
    if (url) played = await playUrl(url);
    if (myQueue !== currentQueue || audioMuted) return;

    if (!played) {
      // A static file may be missing/corrupt: try a dynamic ElevenLabs render once
      if (url && audioMap[seg.text]) {
        const dyn = await getAudioUrl(seg.text, seg.style, { skipStatic: true });
        if (myQueue !== currentQueue || audioMuted) return;
        if (dyn) played = await playUrl(dyn);
        if (myQueue !== currentQueue || audioMuted) return;
      }
      if (!played) await browserSpeech(seg);
    }
  }
}

export function stopNarration() {
  currentQueue++;
  releaseCurrent();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
