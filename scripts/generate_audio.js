/* =========================================================================
   scripts/generate_audio.js — OFFLINE AUDIO GENERATION (ElevenLabs "Alice")

   Pre-generates a static .mp3 for every narrated line so playback has zero
   latency on low-end devices, then writes src/utils/audioMap.js.

   Usage:   npm run generate-audio            (skips files that already exist)
            npm run generate-audio -- --force (re-generate everything)

   Needs the env variable VITE_ELEVENLABS_API_KEY (read from .env.local).
   Content policy: ONLY paragraph text and questions. NEVER titles/headings.
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const MAP_FILE = path.join(ROOT, 'src', 'utils', 'audioMap.js');

/* ---- Voice profile ---- */
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';       // Alice — Clear, Engaging Educator
const MODEL_ID = 'eleven_multilingual_v2';
const API_BASE = process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io';
const RATE_LIMIT_MS = 500;

/* ---- Voice settings by style (copied from numberbound) ---- */
const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }
};

/* ---- Phrases: exact text + intended style (paragraphs & questions ONLY) ---- */
const phrases = [
  { text: "Leo and Emma are playing a board game. Emma needs to roll a 7, but a standard die only shows the numbers 1 to 6. She could roll all day and a 7 would show up exactly 0 times. Yet she is 100 percent sure to roll a number from 1 to 6!", style: "statement" },
  { text: "How can we use numbers to measure events that never happen and events that always happen?", style: "question" },
  { text: "Will it rain tomorrow? Will your team win? Will a coin land on heads? Every day we talk about chance using words like never, maybe, and always. Probability is the part of maths that measures how likely an event is to happen, using numbers.", style: "statement" },
  { text: "Each possible result of rolling a die is an outcome. All the outcomes together form the sample space: 1, 2, 3, 4, 5, and 6. An event is a group of outcomes we care about, like an even number. Its probability is favourable outcomes divided by total outcomes.", style: "emphasis" },
  { text: "An event is impossible when it has no favourable outcomes, so it can never happen. Rolling a 7 on a standard die is impossible because 7 is not in the sample space. Its probability is 0 out of 6, which equals 0.", style: "emphasis" },
  { text: "An event is certain when every outcome is favourable, so it always happens. Rolling a number less than 7 on a standard die is certain, because 1, 2, 3, 4, 5, and 6 are all less than 7. Its probability is 6 out of 6, which equals 1.", style: "celebration" },
  { text: "Every probability lives between 0 and 1. Zero means impossible and one means certain. Everything in between is possible but not certain: unlikely near 0, an even chance at one half, and likely near 1. We can write a probability as a fraction, a decimal, or a percentage.", style: "statement" },
  { text: "The same event can be impossible, possible, or certain, depending on the bag. Drawing a red marble from a bag with only red marbles is certain. Add one blue marble and it becomes likely, but no longer certain. Take away every red marble and it becomes impossible.", style: "emphasis" },
  { text: "Every event A has an opposite partner, not A, which means A does not happen. Together they cover every outcome, so their probabilities add up to 1. If an event is certain, its opposite is impossible. If an event is impossible, its opposite is certain.", style: "instruction" },
  { text: "Awesome job! You have learned that impossible events have probability 0, certain events have probability 1, and every other event sits in between. Now step into the lab to build bags, sort events, and solve probability cases!", style: "celebration" },
  { text: "Leo and Emma are setting up the School Carnival Raffle prize box. Adjust the tokens using the plus and minus buttons so that drawing a Counterfeit Blue Token becomes impossible (P = 0), then test it with draws!", style: "instruction" },
  { text: "Mission complete! With zero blue tokens in the raffle box, drawing blue is impossible.", style: "celebration" },
  { text: "At the Festival Lucky Wheel, players spin for prizes. Tap sections to change their colours so that landing on the GRAND GOLD PRIZE becomes certain (P = 1), then test your wheel!", style: "instruction" },
  { text: "Mission complete! Every section is gold, so landing on gold is 100 percent certain.", style: "celebration" },
  { text: "A smartphone factory batch has 15 working phones and 1 glitchy phone. Run 25 test draws to see real-world defect risk, then remove the glitchy phone to make 100% success certain!", style: "instruction" },
  { text: "Mission complete! With only working phones left in the batch, a working phone is certain.", style: "celebration" },
  { text: "Read each real-world scenario from science and daily life. Tap a card then tap the correct box: Impossible (P = 0), Possible (0 < P < 1), or Certain (P = 1)!", style: "instruction" },
  { text: "Sorted! You mastered real-world impossible, possible, and certain events.", style: "celebration" },
  { text: "Every real-world event lives on the probability line from 0 to 1. Match each everyday event card to its exact slot on the probability line!", style: "instruction" },
  { text: "Perfect! Every real-world event is pinned at its exact spot on the probability line.", style: "celebration" },
  { text: "People often get probability wrong in real life! Read each real-world statement, decide if it is a FACT or a FIB, and bust common probability myths!", style: "instruction" },
  { text: "MythBuster champion! You know the true facts of real-world probability.", style: "celebration" },
  { text: "Detective Zara is inspecting a school fruit hamper with 5 Red Apples, 4 Blue Plums, and 3 Green Pears (12 total). Type each probability as a fraction, decimal, or percentage!", style: "instruction" },
  { text: "Case closed! Outstanding detective work on the school canteen hamper.", style: "celebration" },
  { text: "In a board game tournament, rolling two fair dice determines player moves. Tap every grid outcome matching each target sum and analyze the probabilities!", style: "instruction" },
  { text: "Tournament grid mastered! You calculated every two-dice outcome perfectly.", style: "celebration" },
  { text: "Every real-world event A has an opposite partner (not A), and P(A) + P(not A) = 1. Calculate the probability of the opposite event to crack each cipher!", style: "instruction" },
  { text: "Cipher cracked! Real-world opposite partners always add up to 1.", style: "celebration" },
  { text: "Correct! Excellent probability thinking!", style: "celebration" },
  { text: "Yes! That is exactly right!", style: "celebration" },
  { text: "Brilliant! You nailed it!", style: "celebration" },
  { text: "Not quite! Check the rule and try the next one.", style: "encouragement" },
  { text: "Oops! Every mistake helps you learn.", style: "encouragement" },
  { text: "No worries! Let's practice some more. Try again to master this world!", style: "encouragement" },
  { text: "What did you learn about impossible and certain events? Explain it to Robo with an example!", style: "thinking" },
  { text: "Outstanding reflection! Lesson complete!", style: "celebration" },
  { text: "Congratulations! You've mastered impossible events, certain events, and the probability line from 0 to 1!", style: "statement" }
];

/* ---------------------------------------------------------------------- */
function loadApiKey() {
  if (process.env.VITE_ELEVENLABS_API_KEY) return process.env.VITE_ELEVENLABS_API_KEY;
  for (const name of ['.env.local', '.env']) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    const match = fs.readFileSync(file, 'utf8').match(/^\s*VITE_ELEVENLABS_API_KEY\s*=\s*(.+?)\s*$/m);
    if (match) return match[1].replace(/^['"]|['"]$/g, '');
  }
  return '';
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .split('_')
    .slice(0, 6)
    .join('_');
}

// Deterministic short hash of everything that affects the audio, so an
// existing file is only reused when text, style, voice and model all match.
function shortHash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function synthesize(apiKey, text, style, attempt = 1) {
  const res = await fetch(
    `${API_BASE}/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement })
    }
  );
  if (res.status === 429 && attempt < 4) {
    await sleep(2000 * attempt);
    return synthesize(apiKey, text, style, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const force = process.argv.includes('--force');
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('Missing VITE_ELEVENLABS_API_KEY. Add it to .env.local first.');
    process.exit(1);
  }
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const map = {};
  let generated = 0, reused = 0, failed = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const id = shortHash(`${VOICE_ID}|${MODEL_ID}|${style}|${text}`);
    const filename = `audio_${slugify(text)}_${id}.mp3`;
    const filepath = path.join(AUDIO_DIR, filename);
    const label = `[${i + 1}/${phrases.length}] (${style}) ${text.slice(0, 56)}${text.length > 56 ? '…' : ''}`;

    if (!force && fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
      map[text] = `/assets/audio/${filename}`;
      reused++;
      console.log(`= ${label}`);
      continue;
    }

    try {
      const audio = await synthesize(apiKey, text, style);
      fs.writeFileSync(filepath, audio);
      map[text] = `/assets/audio/${filename}`;
      generated++;
      console.log(`✓ ${label}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${label}\n    ${err.message}`);
    }
    await sleep(RATE_LIMIT_MS);
  }

  // Automatically write src/utils/audioMap.js
  const body = Object.entries(map)
    .map(([text, file]) => `  ${JSON.stringify(text)}: ${JSON.stringify(file)}`)
    .join(',\n');
  const header = `/* =========================================================================
   AUDIO MAP — AUTO-GENERATED by scripts/generate_audio.js  (do not edit)
   Key:   the exact string of text to be spoken
   Value: relative path of the pre-generated .mp3 in public/assets/audio/
   ========================================================================= */
`;
  fs.writeFileSync(MAP_FILE, `${header}export const audioMap = {${body ? '\n' + body + '\n' : ''}};\n`);

  console.log(`\nDone. generated: ${generated}, reused: ${reused}, failed: ${failed}`);
  console.log(`audioMap.js now maps ${Object.keys(map).length}/${phrases.length} phrases.`);
  if (failed) process.exitCode = 1;
}

main();
