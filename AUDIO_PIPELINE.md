# Audio Narration Pipeline — ElevenLabs "Alice"

This module narrates its lesson text with the ElevenLabs voice **Alice — Clear, Engaging Educator**
(Voice ID `Xb7hH8MSUJpSbSDYk0k2`, model `eleven_multilingual_v2`).

## How playback works (`src/utils/audio.js`)

Every spoken segment is resolved in this order:

1. **Static mp3** — `audioMap[text]` points to a pre-generated file in `public/assets/audio/` (zero latency).
2. **Dynamic ElevenLabs request** — used when the text is not in `audioMap`.
   * With `VITE_ELEVENLABS_API_KEY` set: direct call to `https://api.elevenlabs.io/v1/text-to-speech/{voice}`.
   * Without a key: `POST /api/elevenlabs` (a server-side proxy you provide; body = `{ text, voice_id, model_id, voice_settings }`, response = `audio/mpeg`).
   * Results are cached in memory and in the browser's Cache Storage (`elevenlabs-narration-v1`), so a line is only billed once per browser.
3. **Browser `speechSynthesis`** — last-resort fallback if the network or key fails.

`narrate(segments, autoplay)` plays segments one after another. A queue token prevents overlap, `stopNarration()` halts everything, and while segment *i* plays, segment *i + 1* is already being fetched.

### Voice settings by style

| Style | stability | similarity_boost | style |
|---|---|---|---|
| celebration | 0.12 | 0.45 | 0.75 |
| encouragement | 0.16 | 0.50 | 0.65 |
| emphasis | 0.16 | 0.50 | 0.60 |
| question | 0.20 | 0.55 | 0.55 |
| statement / instruction | 0.20 | 0.55 | 0.50 |
| thinking | 0.24 | 0.60 | 0.35 |

All styles use `use_speaker_boost: true`.

## Content policy

* Only **paragraph text and questions** are narrated. **Titles, headings and labels are never narrated.**
* Narration text and on-screen text are in **strict 1:1 parity**. Both come from the same file, `src/utils/lessonText.js`
  (`narration.js` and the UI components import the same strings).

## Files

| File | Purpose |
|---|---|
| `src/utils/lessonText.js` | Single source of truth for every narrated string |
| `src/utils/narration.js` | Maps each phase to its audio script (`wonderNarration()`, `getStoryNarration(i)`, `simulateActivityIntro()` …) |
| `src/utils/audio.js` | The audio engine described above |
| `src/utils/audioMap.js` | **Auto-generated** map: exact text → mp3 path (empty until you run the generator) |
| `scripts/generate_audio.js` | Generates the mp3 files + writes `audioMap.js` |
| `scripts/clean_audio.js` | Deletes mp3 files that are no longer in `audioMap.js` |
| `scripts/verify_audio.js` | Checks narration ↔ `phrases` parity and that mapped files exist |
| `.env.local` | `VITE_ELEVENLABS_API_KEY=…` |

## Workflow

```bash
npm run generate-audio          # create mp3s for every line (skips files that already exist)
npm run generate-audio -- --force   # regenerate everything
npm run verify-audio            # parity check
npm run clean-audio             # delete orphaned mp3s   (add  -- --dry  to preview)
```

`generate_audio.js` rate-limits itself (500 ms between calls), retries on HTTP 429, names files
`audio_<first_words>_<hash>.mp3` (the hash covers text, style, voice and model, so any change re-renders the file),
and rewrites `src/utils/audioMap.js` automatically.

### Adding or changing a narrated line

1. Edit the text in `src/utils/lessonText.js` (the UI updates automatically).
2. Add/adjust the segment in `src/utils/narration.js` if it is a new line.
3. Update the `phrases` array in `scripts/generate_audio.js` so it has the same `text` and `style`.
4. `npm run verify-audio` → `npm run generate-audio` → `npm run clean-audio`.

## Security note

Vite inlines every `VITE_*` variable into the JavaScript bundle. For a **public deployment**, do not ship
the API key: remove it from `.env.local`, pre-generate the mp3s (`npm run generate-audio`), and (optionally) provide the
`/api/elevenlabs` proxy so any un-generated line is fetched server-side.
