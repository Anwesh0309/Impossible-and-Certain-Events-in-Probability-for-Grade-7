# Impossible & Certain Events — Grade 7 Maths (MOE)

An interactive probability lesson built with **Vite + React 18 + Tailwind CSS 3** (same architecture, UI, colours and
voice system as the *Circumference Quest* module).

**Learning journey:** Wonder → Story (8 slides) → Simulate (3 stations × 3 activities) → Practice (10 game worlds) → Reflect.

## Run it

```bash
npm install          # only if node_modules is missing
npm run dev          # http://localhost:5173
npm run build        # production build into dist/
```

## Simulation stations

| Station | Idea | Activities |
|---|---|---|
| 1 · Chance Builder 🎒 | Build it and watch P change | Marble Bag (make blue impossible) · Prize Wheel (make gold certain) · The Almost-Certain Trap |
| 2 · Event Explorer 🧭 | Try it yourself | Event Sorter · Probability Line Pin · Myth Buster |
| 3 · Case Solver 🕵️ | Work it out like a detective | Mystery Bag Case File · Two-Dice Grid Detective · Opposite Partner Cipher |

## Practice worlds

Dice Dungeon · Marble Mountain · Coin Cavern · Spinner Speedway · Card Castle · Calendar Tower · Candy Jar Jungle ·
Probability Line Peak · Two-Dice Galaxy · Grand Master Vault. Questions are generated procedurally by `src/mathData.js`
(3 lives per world, 4/10 correct unlocks the next world, 1–3 stars).

## Voice narration

See **AUDIO_PIPELINE.md**. Quick start: `npm run generate-audio` once (needs internet) to pre-generate every line.
Until then, lines are fetched live from ElevenLabs (using `.env.local`) and cached, with the browser voice as a fallback.

## Project structure

```
src/
  App.jsx                 phase state machine
  mathData.js             practice-question generator + probability helpers
  components/             TopNav, ProbVisuals (marbles, dice, wheel, meter), ProbDiagram, sim/ (9 activities)
  stages/                 Intro, Wonder, Story, Simulate, Practice, Reflect
  utils/                  lessonText, narration, audio, audioMap
scripts/                  generate_audio.js, clean_audio.js, verify_audio.js
public/assets/images/     slide1–8.png (story illustrations)
public/assets/audio/      generated mp3s
```
