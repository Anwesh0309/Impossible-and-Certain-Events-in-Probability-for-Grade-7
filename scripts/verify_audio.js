/* =========================================================================
   scripts/verify_audio.js — PARITY CHECK
   1. Every narrated line in src/utils/narration.js must exist in the
      `phrases` array of scripts/generate_audio.js (same text AND style).
   2. Every entry in audioMap.js must point to an existing .mp3 file.
   Usage:  npm run verify-audio
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const { getAllNarrationSegments } = await import(pathToFileURL(path.join(ROOT, 'src', 'utils', 'narration.js')).href);
const { audioMap } = await import(pathToFileURL(path.join(ROOT, 'src', 'utils', 'audioMap.js')).href);

// Pull the phrases array out of generate_audio.js without running it
const src = fs.readFileSync(path.join(__dirname, 'generate_audio.js'), 'utf8');
const block = src.match(/const phrases = \[([\s\S]*?)\n\];/)[1];
const phrases = new Function(`return [${block}];`)();
const key = p => `${p.style}::${p.text}`;
const phraseKeys = new Set(phrases.map(key));

const segments = getAllNarrationSegments();
const missing = segments.filter(s => !phraseKeys.has(key(s)));
const narrationKeys = new Set(segments.map(key));
const unused = phrases.filter(p => !narrationKeys.has(key(p)));

let problems = 0;
if (missing.length) {
  problems += missing.length;
  console.error(`✗ ${missing.length} narrated line(s) missing from generate_audio.js phrases:`);
  missing.forEach(m => console.error(`   - (${m.style}) ${m.text}`));
}
if (unused.length) {
  console.warn(`! ${unused.length} phrase(s) in generate_audio.js are no longer narrated:`);
  unused.forEach(u => console.warn(`   - (${u.style}) ${u.text.slice(0, 70)}`));
}

const audioDir = path.join(ROOT, 'public', 'assets', 'audio');
const mapped = Object.entries(audioMap);
const absent = mapped.filter(([, file]) => !fs.existsSync(path.join(audioDir, path.basename(file))));
if (absent.length) {
  problems += absent.length;
  console.error(`✗ ${absent.length} audioMap entr${absent.length > 1 ? 'ies' : 'y'} point to a missing mp3.`);
}

console.log(`Narrated lines: ${segments.length} · phrases: ${phrases.length} · mapped to mp3: ${mapped.length}`);
if (!problems) console.log('✓ Narration, phrases and audio files are in sync.');
process.exit(problems ? 1 : 0);
