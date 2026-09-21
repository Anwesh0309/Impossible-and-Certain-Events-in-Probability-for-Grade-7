/* =========================================================================
   NARRATION SCRIPTS — maps application phases to their audio scripts.
   Only PARAGRAPH text and QUESTIONS are narrated — NEVER titles/headings.
   Every string comes from lessonText.js, the same module the UI renders,
   so narration stays in 1:1 strict parity with the on-screen text.
   ========================================================================= */
import { say, ask, cheer, emphasize, think, celebrate, instruct, encourage } from './audio.js';
import {
  WONDER,
  STORY_SLIDES,
  SIM_ACTIVITY_TEXT,
  SIM_DONE_LINES,
  PRACTICE_CORRECT_LINES,
  PRACTICE_WRONG_LINES,
  PRACTICE_GAME_OVER,
  REFLECT,
  CELEBRATION
} from './lessonText.js';

const VOICE_HELPERS = {
  statement: say,
  question: ask,
  celebration: cheer,
  emphasis: emphasize,
  thinking: think,
  instruction: instruct,
  encouragement: encourage
};

/* Phase 1: Wonder */
export function wonderNarration() {
  return [say(WONDER.paragraph), ask(WONDER.question)];
}

/* Phase 2: Story (one narration per slide) */
export function getStoryNarration(slideIndex) {
  const slide = STORY_SLIDES[slideIndex];
  if (!slide) return [];
  const helper = VOICE_HELPERS[slide.voice] || say;
  return [helper(slide.body)];
}

/* Phase 3: Simulate — one intro per activity, plus a completion cheer */
export function simulateActivityIntro(station, actIdx) {
  const t = SIM_ACTIVITY_TEXT[`${station}-${actIdx}`];
  return t ? [instruct(t.desc)] : [];
}
export function simulateActivityDone(station, actIdx) {
  const line = SIM_DONE_LINES[`${station}-${actIdx}`];
  return line ? [celebrate(line)] : [];
}
// Named per-station entry points (first activity of each station)
export const simulateStation1Intro = () => simulateActivityIntro(1, 0);
export const simulateStation2Intro = () => simulateActivityIntro(2, 0);
export const simulateStation3Intro = () => simulateActivityIntro(3, 0);

/* Phase 4: Practice feedback (fixed lines) */
export function practiceCorrectNarration(n = 0) {
  return [cheer(PRACTICE_CORRECT_LINES[n % PRACTICE_CORRECT_LINES.length])];
}
export function practiceWrongNarration(n = 0) {
  return [encourage(PRACTICE_WRONG_LINES[n % PRACTICE_WRONG_LINES.length])];
}
export function practiceGameOverNarration() {
  return [encourage(PRACTICE_GAME_OVER)];
}

/* Phase 5: Reflect */
export function reflectQuestionNarration() {
  return [think(REFLECT.question)];
}
export function celebrationNarration() {
  return [celebrate(CELEBRATION.cheer), say(CELEBRATION.paragraph)];
}

/* Every narrated segment in the lesson (used by scripts/verify_audio.js) */
export function getAllNarrationSegments() {
  const all = [...wonderNarration()];
  STORY_SLIDES.forEach((_, i) => all.push(...getStoryNarration(i)));
  Object.keys(SIM_ACTIVITY_TEXT).forEach(key => {
    const [s, a] = key.split('-').map(Number);
    all.push(...simulateActivityIntro(s, a), ...simulateActivityDone(s, a));
  });
  PRACTICE_CORRECT_LINES.forEach((_, i) => all.push(...practiceCorrectNarration(i)));
  PRACTICE_WRONG_LINES.forEach((_, i) => all.push(...practiceWrongNarration(i)));
  all.push(...practiceGameOverNarration(), ...reflectQuestionNarration(), ...celebrationNarration());
  return all;
}
