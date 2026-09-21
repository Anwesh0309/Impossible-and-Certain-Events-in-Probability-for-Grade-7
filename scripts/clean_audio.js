/* =========================================================================
   scripts/clean_audio.js — AUDIO CLEANUP
   Imports src/utils/audioMap.js to learn which .mp3 files are still
   referenced, then deletes every other .mp3 in public/assets/audio/.
   Usage:  npm run clean-audio            (delete orphans)
           npm run clean-audio -- --dry   (only list them)
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const dry = process.argv.includes('--dry');

const { audioMap } = await import(pathToFileURL(path.join(ROOT, 'src', 'utils', 'audioMap.js')).href);
const referenced = new Set(Object.values(audioMap).map(p => path.basename(p)));

if (!fs.existsSync(AUDIO_DIR)) {
  console.log('No audio folder yet — nothing to clean.');
  process.exit(0);
}

let removed = 0;
for (const file of fs.readdirSync(AUDIO_DIR)) {
  if (!file.toLowerCase().endsWith('.mp3')) continue;
  if (referenced.has(file)) continue;
  if (dry) {
    console.log(`would delete  ${file}`);
  } else {
    fs.unlinkSync(path.join(AUDIO_DIR, file));
    console.log(`deleted       ${file}`);
  }
  removed++;
}
console.log(removed ? `\n${dry ? 'Orphans found' : 'Removed'}: ${removed}` : 'Audio folder is clean.');
