/* =========================================================================
   LESSON TEXT — single source of truth for everything that is NARRATED.
   The UI components import these strings for on-screen text, and
   src/utils/narration.js imports the very same strings for audio, so the
   spoken words are always in 1:1 parity with what the learner reads.

   Content policy: only PARAGRAPH text and QUESTIONS are narrated.
   Titles, headings and section labels are NEVER narrated.
   ========================================================================= */

/* ---------- Phase 1: Wonder ---------- */
export const WONDER = {
  title: "Can You Roll a 7 on a Normal Die?",
  stat: "0 Chances in 6!",
  paragraph:
    "Leo and Emma are playing a board game. Emma needs to roll a 7, but a standard die only shows the numbers 1 to 6. She could roll all day and a 7 would show up exactly 0 times. Yet she is 100 percent sure to roll a number from 1 to 6!",
  question:
    "How can we use numbers to measure events that never happen and events that always happen?"
};

/* ---------- Phase 2: Story (8 slides) ---------- */
export const STORY_SLIDES = [
  {
    id: 1,
    title: "Chance Is Everywhere!",
    image: "/assets/images/slide1.png",
    voice: "statement",
    body:
      "Will it rain tomorrow? Will your team win? Will a coin land on heads? Every day we talk about chance using words like never, maybe, and always. Probability is the part of maths that measures how likely an event is to happen, using numbers.",
    quote: "Probability measures how likely an event is to happen.",
    bubble: "Let's turn words like never and always into numbers!"
  },
  {
    id: 2,
    title: "Outcomes, Events & the Sample Space",
    image: "/assets/images/slide2.png",
    voice: "emphasis",
    body:
      "Each possible result of rolling a die is an outcome. All the outcomes together form the sample space: 1, 2, 3, 4, 5, and 6. An event is a group of outcomes we care about, like an even number. Its probability is favourable outcomes divided by total outcomes.",
    quote: "P(E) = favourable outcomes ÷ total outcomes",
    bubble: "Count the outcomes we want, then divide by all the outcomes!"
  },
  {
    id: 3,
    title: "Impossible Events: Probability 0",
    image: "/assets/images/slide3.png",
    voice: "emphasis",
    body:
      "An event is impossible when it has no favourable outcomes, so it can never happen. Rolling a 7 on a standard die is impossible because 7 is not in the sample space. Its probability is 0 out of 6, which equals 0.",
    quote: "Impossible event → P(E) = 0",
    bubble: "Zero favourable outcomes means it can NEVER happen!"
  },
  {
    id: 4,
    title: "Certain Events: Probability 1",
    image: "/assets/images/slide4.png",
    voice: "celebration",
    body:
      "An event is certain when every outcome is favourable, so it always happens. Rolling a number less than 7 on a standard die is certain, because 1, 2, 3, 4, 5, and 6 are all less than 7. Its probability is 6 out of 6, which equals 1.",
    quote: "Certain event → P(E) = 1",
    bubble: "Every outcome is favourable, so it ALWAYS happens!"
  },
  {
    id: 5,
    title: "The Probability Line: 0 to 1",
    image: "/assets/images/slide5.png",
    voice: "statement",
    body:
      "Every probability lives between 0 and 1. Zero means impossible and one means certain. Everything in between is possible but not certain: unlikely near 0, an even chance at one half, and likely near 1. We can write a probability as a fraction, a decimal, or a percentage.",
    quote: "0 ≤ P(E) ≤ 1 — never below 0, never above 1",
    bubble: "A probability can never be negative or bigger than 1!"
  },
  {
    id: 6,
    title: "The Sample Space Decides!",
    image: "/assets/images/slide6.svg",
    voice: "emphasis",
    body:
      "The same event can be impossible, possible, or certain, depending on the bag. Drawing a red marble from a bag with only red marbles is certain. Add one blue marble and it becomes likely, but no longer certain. Take away every red marble and it becomes impossible.",
    quote: "Change the bag → change the probability!",
    bubble: "Watch out! Even one blue marble makes red NOT certain!"
  },
  {
    id: 7,
    title: "Opposite Partners",
    image: "/assets/images/slide7.svg",
    voice: "instruction",
    body:
      "Every event A has an opposite partner, not A, which means A does not happen. Together they cover every outcome, so their probabilities add up to 1. If an event is certain, its opposite is impossible. If an event is impossible, its opposite is certain.",
    quote: "P(A) + P(not A) = 1  →  P(not A) = 1 − P(A)",
    bubble: "Certain and impossible are perfect opposite partners!"
  },
  {
    id: 8,
    title: "Step Into the Simulation Lab!",
    image: "/assets/images/slide8.svg",
    voice: "celebration",
    body:
      "Awesome job! You have learned that impossible events have probability 0, certain events have probability 1, and every other event sits in between. Now step into the lab to build bags, sort events, and solve probability cases!",
    quote: "Ready to test your chance-detective skills?",
    bubble: "Click below to enter the interactive lab!"
  }
];

/* ---------- Phase 3: Simulate (3 stations x 3 activities) ---------- */
export const SIM_STATIONS = [
  { id: 1, icon: "🎒", name: "Station 1: Chance Builder", sub: "Build real-world setups & watch P" },
  { id: 2, icon: "🧭", name: "Station 2: Event Explorer", sub: "Sort, pin & bust real-life myths" },
  { id: 3, icon: "🕵️", name: "Station 3: Case Solver", sub: "Solve real-world probability files" }
];

export const SIM_ACTIVITY_TEXT = {
  "1-0": {
    icon: "🎟️",
    title: "Activity 1: School Carnival Raffle — Make It Impossible",
    desc:
      "Leo and Emma are setting up the School Carnival Raffle prize box. Adjust the tokens using the plus and minus buttons so that drawing a Counterfeit Blue Token becomes impossible (P = 0), then test it with draws!"
  },
  "1-1": {
    icon: "🎡",
    title: "Activity 2: Festival Lucky Spin — Make It Certain",
    desc:
      "At the Festival Lucky Wheel, players spin for prizes. Tap sections to change their colours so that landing on the GRAND GOLD PRIZE becomes certain (P = 1), then test your wheel!"
  },
  "1-2": {
    icon: "📱",
    title: "Activity 3: Factory Quality Check — The 99% Trap",
    desc:
      "A smartphone factory batch has 15 working phones and 1 glitchy phone. Run 25 test draws to see real-world defect risk, then remove the glitchy phone to make 100% success certain!"
  },
  "2-0": {
    icon: "🌍",
    title: "Activity 1: Real-World Event Sorter",
    desc:
      "Read each real-world scenario from science and daily life. Tap a card then tap the correct box: Impossible (P = 0), Possible (0 < P < 1), or Certain (P = 1)!"
  },
  "2-1": {
    icon: "📍",
    title: "Activity 2: Real-Life Probability Line Pin",
    desc:
      "Every real-world event lives on the probability line from 0 to 1. Match each everyday event card to its exact slot on the probability line!"
  },
  "2-2": {
    icon: "💡",
    title: "Activity 3: Real-World MythBuster",
    desc:
      "People often get probability wrong in real life! Read each real-world statement, decide if it is a FACT or a FIB, and bust common probability myths!"
  },
  "3-0": {
    icon: "🔎",
    title: "Activity 1: School Canteen Mystery Hamper",
    desc:
      "Detective Zara is inspecting a school fruit hamper with 5 Red Apples, 4 Blue Plums, and 3 Green Pears (12 total). Type each probability as a fraction, decimal, or percentage!"
  },
  "3-1": {
    icon: "🎲",
    title: "Activity 2: Board Game Two-Dice Tournament",
    desc:
      "In a board game tournament, rolling two fair dice determines player moves. Tap every grid outcome matching each target sum and analyze the probabilities!"
  },
  "3-2": {
    icon: "🔐",
    title: "Activity 3: Weather & Sports Opposite Partner Cipher",
    desc:
      "Every real-world event A has an opposite partner (not A), and P(A) + P(not A) = 1. Calculate the probability of the opposite event to crack each cipher!"
  }
};

/* Fixed celebration lines spoken when an activity is completed */
export const SIM_DONE_LINES = {
  "1-0": "Mission complete! With zero blue tokens in the raffle box, drawing blue is impossible.",
  "1-1": "Mission complete! Every section is gold, so landing on gold is 100 percent certain.",
  "1-2": "Mission complete! With only working phones left in the batch, a working phone is certain.",
  "2-0": "Sorted! You mastered real-world impossible, possible, and certain events.",
  "2-1": "Perfect! Every real-world event is pinned at its exact spot on the probability line.",
  "2-2": "MythBuster champion! You know the true facts of real-world probability.",
  "3-0": "Case closed! Outstanding detective work on the school canteen hamper.",
  "3-1": "Tournament grid mastered! You calculated every two-dice outcome perfectly.",
  "3-2": "Cipher cracked! Real-world opposite partners always add up to 1."
};

/* ---------- Phase 4: Practice feedback (fixed lines) ---------- */
export const PRACTICE_CORRECT_LINES = [
  "Correct! Excellent probability thinking!",
  "Yes! That is exactly right!",
  "Brilliant! You nailed it!"
];
export const PRACTICE_WRONG_LINES = [
  "Not quite! Check the rule and try the next one.",
  "Oops! Every mistake helps you learn."
];
export const PRACTICE_GAME_OVER =
  "No worries! Let's practice some more. Try again to master this world!";

/* ---------- Phase 5: Reflect ---------- */
export const REFLECT = {
  question:
    "What did you learn about impossible and certain events? Explain it to Robo with an example!",
  placeholder: "Dear Robo, an impossible event is..."
};

export const CELEBRATION = {
  badge: "Grade 7 Math Mastered!",
  title: "Probability Quest Complete!",
  cheer: "Outstanding reflection! Lesson complete!",
  paragraph:
    "Congratulations! You've mastered impossible events, certain events, and the probability line from 0 to 1!"
};
