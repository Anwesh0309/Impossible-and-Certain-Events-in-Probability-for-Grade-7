/* =========================================================================
   MATH DATA & PRACTICE QUESTION DATASET
   10 themed worlds x 10 curated Grade 7 practice questions with exact
   prompts, options, explanations (hints), and visual diagrams.
   ========================================================================= */

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Dice Dungeon",          icon: "🎲", range: "Q1–10",   difficulty: 1 },
  { id: 1, name: "Marble Mountain",       icon: "🔮", range: "Q11–20",  difficulty: 1 },
  { id: 2, name: "Coin Cavern",           icon: "🪙", range: "Q21–30",  difficulty: 2 },
  { id: 3, name: "Spinner Speedway",      icon: "🎡", range: "Q31–40",  difficulty: 2 },
  { id: 4, name: "Card Castle",           icon: "🃏", range: "Q41–50",  difficulty: 3 },
  { id: 5, name: "Calendar Tower",        icon: "📅", range: "Q51–60",  difficulty: 3 },
  { id: 6, name: "Candy Jar Jungle",      icon: "🍬", range: "Q61–70",  difficulty: 3 },
  { id: 7, name: "Probability Line Peak", icon: "📏", range: "Q71–80",  difficulty: 4 },
  { id: 8, name: "Two-Dice Galaxy",       icon: "🚀", range: "Q81–90",  difficulty: 4 },
  { id: 9, name: "Grand Master Vault",    icon: "🏆", range: "Q91–100", difficulty: 4 }
];

/* ---------------------------------------------------------------------- */
/* Helper functions & vocabulary                                         */
/* ---------------------------------------------------------------------- */
export const STATUS = {
  impossible: { key: "impossible", label: "Impossible",  color: "#f43f5e", text: "text-rose-300",    bg: "bg-rose-500/20",    border: "border-rose-400/60" },
  unlikely:   { key: "unlikely",   label: "Unlikely",    color: "#fb923c", text: "text-orange-300",  bg: "bg-orange-500/20",  border: "border-orange-400/60" },
  even:       { key: "even",       label: "Even chance", color: "#facc15", text: "text-yellow-300",  bg: "bg-yellow-500/20",  border: "border-yellow-400/60" },
  likely:     { key: "likely",     label: "Likely",      color: "#2dd4bf", text: "text-teal-300",    bg: "bg-teal-500/20",    border: "border-teal-400/60" },
  certain:    { key: "certain",    label: "Certain",     color: "#4ade80", text: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-400/60" }
};

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

export function reduce(n, d) {
  if (n === 0) return [0, 1];
  const g = gcd(n, d);
  return [n / g, d / g];
}

export function fracText(n, d) {
  const [a, b] = reduce(n, d);
  if (a === 0) return "0";
  if (b === 1) return `${a}`;
  return `${a}/${b}`;
}

function isTerminating(d) {
  let x = d;
  while (x % 2 === 0) x /= 2;
  while (x % 5 === 0) x /= 5;
  return x === 1;
}

export function decText(n, d) {
  const [a, b] = reduce(n, d);
  if (!isTerminating(b)) return null;
  return String(Number((a / b).toFixed(4)));
}

export function pctText(n, d) {
  const [a, b] = reduce(n, d);
  if (!isTerminating(b)) return null;
  return `${Number(((a / b) * 100).toFixed(2))}%`;
}

export function probStatus(fav, total) {
  if (total <= 0) return STATUS.impossible;
  if (fav <= 0) return STATUS.impossible;
  if (fav >= total) return STATUS.certain;
  const p2 = fav * 2;
  if (p2 === total) return STATUS.even;
  return p2 < total ? STATUS.unlikely : STATUS.likely;
}

export function statusCaption(fav, total) {
  const s = probStatus(fav, total);
  if (s.key === "impossible") return "Impossible: there are 0 favourable outcomes, so it can NEVER happen.";
  if (s.key === "certain") return "Certain: every outcome is favourable, so it ALWAYS happens.";
  return "Possible but NOT certain: some outcomes are favourable, some are not.";
}

export function parseProbability(raw) {
  if (raw == null) return null;
  const s = String(raw).trim().replace(/\s+/g, "");
  if (!s) return null;
  if (/^-?\d+(\.\d+)?%$/.test(s)) return parseFloat(s) / 100;
  if (/^-?\d+\/\d+$/.test(s)) {
    const [n, d] = s.split("/").map(Number);
    return d === 0 ? null : n / d;
  }
  if (/^-?\d*\.?\d+$/.test(s)) return parseFloat(s);
  return null;
}

export function probMatches(raw, fav, total) {
  const v = parseProbability(raw);
  if (v == null || Number.isNaN(v)) return false;
  const target = fav / total;
  return Math.abs(v - target) < 0.006;
}

/* ---------------------------------------------------------------------- */
/* World Question Dataset                                                */
/* ---------------------------------------------------------------------- */
export const WORLD_QUESTIONS = {
  0: [
    {
      prompt: "Leo rolls a fair six-sided die. How would you describe the event: rolling a 7?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "There are 0 favourable outcomes out of 6, so P = 0/6 = 0. It can never happen, so it is impossible.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [] }
    },
    {
      prompt: "Emma rolls a fair six-sided die. What is the probability of rolling a number less than 7?",
      options: ["1", "0", "1/2", "5/6"],
      correctIndex: 0,
      explanation: "All 6 outcomes are favourable (1, 2, 3, 4, 5, 6), so P = 6/6 = 1. It always happens, so it is certain.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [1, 2, 3, 4, 5, 6] }
    },
    {
      prompt: "Alex rolls a fair six-sided die. What is the probability of rolling an even number?",
      options: ["1/2", "1/6", "2/3", "0"],
      correctIndex: 0,
      explanation: "3 of the 6 outcomes (2, 4, 6) are favourable, so P = 3/6 = 1/2.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [2, 4, 6] }
    },
    {
      prompt: "Chloe rolls a fair six-sided die. How would you describe the event: rolling a number greater than 0?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Every face 1 to 6 is greater than 0, so all 6 outcomes are favourable. P = 1, which means certain.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [1, 2, 3, 4, 5, 6] }
    },
    {
      prompt: "Noah rolls a fair six-sided die. What is the probability of rolling a 9?",
      options: ["0", "1/6", "1", "1/2"],
      correctIndex: 0,
      explanation: "A standard die has no face with 9. Favourable outcomes = 0, so P = 0. It is impossible.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [] }
    },
    {
      prompt: "Sophia rolls a fair six-sided die. What is the probability of rolling a prime number (2, 3, or 5)?",
      options: ["1/2", "1/3", "1/6", "2/3"],
      correctIndex: 0,
      explanation: "There are 3 prime numbers on a die (2, 3, 5) out of 6 faces, so P = 3/6 = 1/2.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [2, 3, 5] }
    },
    {
      prompt: "Mason rolls a fair six-sided die. The event rolling a 4 has probability 1/6. What is the probability that it does NOT happen?",
      options: ["5/6", "1/6", "0", "1"],
      correctIndex: 0,
      explanation: "P(not rolling 4) = 1 − P(rolling 4) = 1 − 1/6 = 5/6.",
      diagramData: { mode: "line", marker: 1 / 6, label: "P(E)" }
    },
    {
      prompt: "Ella rolls a fair six-sided die. How would you describe the event: rolling a negative number?",
      options: ["Impossible", "Unlikely", "Certain", "Likely"],
      correctIndex: 0,
      explanation: "Dice faces are positive whole numbers from 1 to 6. There are 0 negative faces, so P = 0, which is impossible.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [] }
    },
    {
      prompt: "James rolls a fair six-sided die. What is the probability of rolling a number less than 4?",
      options: ["1/2", "1/3", "2/3", "1/6"],
      correctIndex: 0,
      explanation: "Faces 1, 2, and 3 are less than 4, so 3 outcomes out of 6 are favourable. P = 3/6 = 1/2.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [1, 2, 3] }
    },
    {
      prompt: "Harper rolls a fair six-sided die. How would you describe the event: rolling a whole number from 1 to 6?",
      options: ["Certain", "Possible but not certain", "Impossible", "Unlikely"],
      correctIndex: 0,
      explanation: "Every outcome on a fair die is a whole number from 1 to 6. P = 6/6 = 1, so it is certain.",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [1, 2, 3, 4, 5, 6] }
    }
  ],

  1: [
    {
      prompt: "Maya's bag holds 5 red marbles and 0 blue marbles. How would you describe drawing a blue marble?",
      options: ["Impossible", "Certain", "Likely", "Unlikely"],
      correctIndex: 0,
      explanation: "There are 0 blue marbles in the bag, so P = 0. It can never happen, so it is impossible.",
      diagramData: { mode: "bag", counts: { red: 5 }, favColors: ["blue"], unit: "marble" }
    },
    {
      prompt: "Liam's bag holds 8 red marbles. What is the probability of drawing a red marble?",
      options: ["1", "0", "1/2", "7/8"],
      correctIndex: 0,
      explanation: "Every marble in the bag is red, so P = 8/8 = 1. It always happens, so it is certain.",
      diagramData: { mode: "bag", counts: { red: 8 }, favColors: ["red"], unit: "marble" }
    },
    {
      prompt: "Ethan's bag holds 3 red marbles and 3 blue marbles. What is the probability of drawing a red marble?",
      options: ["1/2", "1/3", "2/3", "1"],
      correctIndex: 0,
      explanation: "3 out of 6 marbles are red, so P = 3/6 = 1/2.",
      diagramData: { mode: "bag", counts: { red: 3, blue: 3 }, favColors: ["red"], unit: "marble" }
    },
    {
      prompt: "Charlotte's bag holds 4 green marbles and 2 yellow marbles. Which change makes drawing a green marble certain?",
      options: ["Take out every marble that is not green", "Add 3 more green marbles", "Take out 2 green marbles", "Add 1 yellow marble"],
      correctIndex: 0,
      explanation: "Drawing green is certain only when every marble in the bag is green. Take out every marble that is not green.",
      diagramData: { mode: "bag", counts: { green: 4, yellow: 2 }, favColors: ["green"], unit: "marble" }
    },
    {
      prompt: "Lucas's bag holds 6 blue marbles and 2 red marbles. Which change makes drawing a red marble impossible?",
      options: ["Take out all 2 red marbles", "Add 5 more blue marbles", "Take out 1 blue marble", "Add 2 red marbles"],
      correctIndex: 0,
      explanation: "Drawing red is impossible when there are 0 red marbles left in the bag. Take out all 2 red marbles.",
      diagramData: { mode: "bag", counts: { blue: 6, red: 2 }, favColors: ["red"], unit: "marble" }
    },
    {
      prompt: "Ava's bag holds 7 purple marbles. How would you describe drawing a yellow marble?",
      options: ["Impossible", "Unlikely", "Certain", "Likely"],
      correctIndex: 0,
      explanation: "There are 0 yellow marbles in the bag. P = 0, so it is impossible.",
      diagramData: { mode: "bag", counts: { purple: 7 }, favColors: ["yellow"], unit: "marble" }
    },
    {
      prompt: "Oliver's bag holds 2 red, 2 blue, 2 green, and 2 yellow marbles. What is the probability of drawing a blue marble?",
      options: ["1/4", "1/2", "1/8", "3/4"],
      correctIndex: 0,
      explanation: "2 blue marbles out of 8 total marbles gives P = 2/8 = 1/4.",
      diagramData: { mode: "bag", counts: { red: 2, blue: 2, green: 2, yellow: 2 }, favColors: ["blue"], unit: "marble" }
    },
    {
      prompt: "Mia's bag holds 10 red marbles and 0 green marbles. What is the probability of drawing a green marble?",
      options: ["0", "1/10", "1", "1/2"],
      correctIndex: 0,
      explanation: "0 green marbles out of 10 total marbles gives P = 0/10 = 0.",
      diagramData: { mode: "bag", counts: { red: 10 }, favColors: ["green"], unit: "marble" }
    },
    {
      prompt: "Logan's bag holds 4 red marbles and 4 blue marbles. The event drawing a red marble has probability 1/2. What is the probability of NOT drawing a red marble?",
      options: ["1/2", "0", "1", "1/4"],
      correctIndex: 0,
      explanation: "P(not red) = 1 − P(red) = 1 − 1/2 = 1/2.",
      diagramData: { mode: "line", marker: 1 / 2, label: "P(E)" }
    },
    {
      prompt: "Jack's bag holds 5 orange marbles. What is the probability of drawing an orange marble?",
      options: ["1", "0", "1/5", "4/5"],
      correctIndex: 0,
      explanation: "All 5 marbles are orange, so P = 5/5 = 1.",
      diagramData: { mode: "bag", counts: { orange: 5 }, favColors: ["orange"], unit: "marble" }
    }
  ],

  2: [
    {
      prompt: "Leo flips a fair coin. How would you describe the event: the coin lands on heads or tails?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "A coin must land on either heads or tails. All outcomes are favourable, so P = 1 (certain).",
      diagramData: { mode: "coins", n: 1, outcomes: ["H", "T"], favOutcomes: ["H", "T"] }
    },
    {
      prompt: "Emma flips a fair coin. What is the probability that the coin lands on both heads and tails at the same time?",
      options: ["0", "1/2", "1", "1/4"],
      correctIndex: 0,
      explanation: "A single coin flip cannot show both sides at once. Favourable outcomes = 0, so P = 0 (impossible).",
      diagramData: { mode: "coins", n: 1, outcomes: ["H", "T"], favOutcomes: [] }
    },
    {
      prompt: "Alex flips two fair coins. What is the probability that both coins land on heads?",
      options: ["1/4", "1/2", "3/4", "0"],
      correctIndex: 0,
      explanation: "The sample space is {HH, HT, TH, TT} (4 outcomes). Only HH is favourable, so P = 1/4.",
      diagramData: { mode: "coins", n: 2, outcomes: ["HH", "HT", "TH", "TT"], favOutcomes: ["HH"] }
    },
    {
      prompt: "Chloe flips two fair coins. How would you describe the event: three coins land on heads?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "Chloe only flipped 2 coins, so getting 3 heads is impossible (P = 0).",
      diagramData: { mode: "coins", n: 2, outcomes: ["HH", "HT", "TH", "TT"], favOutcomes: [] }
    },
    {
      prompt: "Noah flips a fair coin. What is the probability of landing on heads?",
      options: ["1/2", "1", "0", "1/4"],
      correctIndex: 0,
      explanation: "1 favourable outcome out of 2 possible outcomes (heads, tails), so P = 1/2.",
      diagramData: { mode: "coins", n: 1, outcomes: ["H", "T"], favOutcomes: ["H"] }
    },
    {
      prompt: "Sophia flips two fair coins. The event both coins land on heads has probability 1/4. What is the probability that both coins do NOT land on heads?",
      options: ["3/4", "1/4", "1/2", "0"],
      correctIndex: 0,
      explanation: "P(not HH) = 1 − 1/4 = 3/4.",
      diagramData: { mode: "line", marker: 1 / 4, label: "P(E)" }
    },
    {
      prompt: "Mason flips three fair coins. What is the probability that all three coins land on heads?",
      options: ["1/8", "1/4", "1/2", "3/8"],
      correctIndex: 0,
      explanation: "Sample space has 8 outcomes {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}. Only HHH is favourable, so P = 1/8.",
      diagramData: { mode: "coins", n: 3, outcomes: ["HHH", "HHT", "HTH", "HTT", "THH", "THT", "TTH", "TTT"], favOutcomes: ["HHH"] }
    },
    {
      prompt: "Harper flips two fair coins. How would you describe the event: at most 2 coins land on heads?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Since only 2 coins are flipped, the number of heads is always 0, 1, or 2. All outcomes match, so P = 1 (certain).",
      diagramData: { mode: "coins", n: 2, outcomes: ["HH", "HT", "TH", "TT"], favOutcomes: ["HH", "HT", "TH", "TT"] }
    },
    {
      prompt: "Ethan flips three fair coins. How would you describe the event: there are 5 heads in total?",
      options: ["Impossible", "Unlikely", "Certain", "Likely"],
      correctIndex: 0,
      explanation: "Only 3 coins were flipped, so getting 5 heads has 0 favourable outcomes (P = 0, impossible).",
      diagramData: { mode: "coins", n: 3, outcomes: ["HHH", "HHT", "HTH", "HTT", "THH", "THT", "TTH", "TTT"], favOutcomes: [] }
    },
    {
      prompt: "Liam flips two fair coins. What is the probability that at least one coin lands on heads?",
      options: ["3/4", "1/4", "1/2", "1"],
      correctIndex: 0,
      explanation: "Favourable outcomes are HH, HT, TH (3 out of 4), so P = 3/4.",
      diagramData: { mode: "coins", n: 2, outcomes: ["HH", "HT", "TH", "TT"], favOutcomes: ["HH", "HT", "TH"] }
    }
  ],

  3: [
    {
      prompt: "Maya spins a wheel with 6 equal sections, all gold. How would you describe landing on gold?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Every section is gold, so landing on gold has 6 out of 6 favourable outcomes. P = 1 (certain).",
      diagramData: { mode: "spinner", wedges: ["gold", "gold", "gold", "gold", "gold", "gold"], favColors: ["gold"] }
    },
    {
      prompt: "Lucas spins a wheel with 4 red sections and 4 blue sections. What is the probability of landing on yellow?",
      options: ["0", "1/2", "1/4", "1"],
      correctIndex: 0,
      explanation: "There are 0 yellow sections on the wheel, so P = 0 (impossible).",
      diagramData: { mode: "spinner", wedges: ["red", "red", "red", "red", "blue", "blue", "blue", "blue"], favColors: ["yellow"] }
    },
    {
      prompt: "Ava spins a wheel with 8 equal sections: 4 blue, 2 red, 2 green. What is the probability of landing on blue?",
      options: ["1/2", "1/4", "3/4", "1/8"],
      correctIndex: 0,
      explanation: "4 blue sections out of 8 total sections gives P = 4/8 = 1/2.",
      diagramData: { mode: "spinner", wedges: ["blue", "blue", "blue", "blue", "red", "red", "green", "green"], favColors: ["blue"] }
    },
    {
      prompt: "Oliver spins a wheel with 5 equal sections, all red. What is the probability of landing on blue?",
      options: ["0", "1/5", "1", "4/5"],
      correctIndex: 0,
      explanation: "0 blue sections out of 5 total sections gives P = 0 (impossible).",
      diagramData: { mode: "spinner", wedges: ["red", "red", "red", "red", "red"], favColors: ["blue"] }
    },
    {
      prompt: "Charlotte spins a wheel with 10 equal sections: 5 gold and 5 silver. What is the probability of landing on gold as a percentage?",
      options: ["50%", "100%", "0%", "25%"],
      correctIndex: 0,
      explanation: "5 out of 10 sections is 1/2, which equals 50%.",
      diagramData: { mode: "spinner", wedges: ["gold", "gold", "gold", "gold", "gold", "silver", "silver", "silver", "silver", "silver"], favColors: ["gold"] }
    },
    {
      prompt: "Noah spins a wheel with 4 equal sections: 1 red, 1 blue, 1 green, 1 yellow. What is the probability of landing on red?",
      options: ["1/4", "1/2", "3/4", "0"],
      correctIndex: 0,
      explanation: "1 favourable section out of 4 gives P = 1/4.",
      diagramData: { mode: "spinner", wedges: ["red", "blue", "green", "yellow"], favColors: ["red"] }
    },
    {
      prompt: "Mia spins a wheel with 6 equal sections, all purple. What is the probability of landing on purple as a decimal?",
      options: ["1", "0", "0.5", "0.6"],
      correctIndex: 0,
      explanation: "All 6 sections are purple, so P = 6/6 = 1.",
      diagramData: { mode: "spinner", wedges: ["purple", "purple", "purple", "purple", "purple", "purple"], favColors: ["purple"] }
    },
    {
      prompt: "Ethan spins a wheel with 8 equal sections: 2 red, 2 blue, 2 green, 2 yellow. The event landing on red has probability 1/4. What is the probability of NOT landing on red?",
      options: ["3/4", "1/4", "1/2", "1"],
      correctIndex: 0,
      explanation: "P(not red) = 1 − 1/4 = 3/4.",
      diagramData: { mode: "line", marker: 1 / 4, label: "P(E)" }
    },
    {
      prompt: "Harper spins a wheel with 12 equal sections: 6 red and 6 blue. How would you describe landing on red or blue?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Every section is either red or blue. All 12 outcomes are favourable, so P = 12/12 = 1 (certain).",
      diagramData: { mode: "spinner", wedges: ["red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue", "blue", "blue"], favColors: ["red", "blue"] }
    },
    {
      prompt: "Jack spins a wheel with 5 green sections. How would you describe landing on red?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "There are 0 red sections on the wheel, so P = 0 (impossible).",
      diagramData: { mode: "spinner", wedges: ["green", "green", "green", "green", "green"], favColors: ["red"] }
    }
  ],

  4: [
    {
      prompt: "Leo picks one card at random from a standard 52-card deck. How would you describe picking a card with the number 15?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "Standard playing cards only go up to King (10, Jack, Queen, King). There is no 15, so P = 0 (impossible).",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "Emma picks one card at random from a standard 52-card deck. How would you describe picking a red or black card?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Every card in a standard deck is either red (hearts/diamonds) or black (spades/clubs). P = 52/52 = 1 (certain).",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "Alex picks one card from a deck of 52 cards. What is the probability of picking a heart?",
      options: ["1/4", "1/2", "1/13", "1/52"],
      correctIndex: 0,
      explanation: "There are 13 hearts in a 52-card deck, so P = 13/52 = 1/4.",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "Chloe picks one card from a 52-card deck. What is the probability of picking an Ace?",
      options: ["1/13", "1/4", "1/52", "4/13"],
      correctIndex: 0,
      explanation: "There are 4 Aces in a deck of 52 cards, so P = 4/52 = 1/13.",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "Noah picks one card from a 52-card deck. How would you describe picking a black heart?",
      options: ["Impossible", "Unlikely", "Certain", "Likely"],
      correctIndex: 0,
      explanation: "All hearts in a standard deck are red. There are 0 black hearts, so P = 0 (impossible).",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "Sophia picks one card from a 52-card deck. What is the probability of picking a red card?",
      options: ["1/2", "1/4", "3/4", "1"],
      correctIndex: 0,
      explanation: "26 cards out of 52 are red (hearts and diamonds), so P = 26/52 = 1/2.",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "Mason picks one card from a 52-card deck. The event picking a red card has probability 1/2. What is the probability of NOT picking a red card?",
      options: ["1/2", "1/4", "0", "1"],
      correctIndex: 0,
      explanation: "P(not red) = 1 − 1/2 = 1/2.",
      diagramData: { mode: "line", marker: 1 / 2, label: "P(E)" }
    },
    {
      prompt: "Ella picks one card from a 52-card deck. How would you describe picking a card that belongs to one of the four suits?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Every card belongs to hearts, diamonds, clubs, or spades. P = 52/52 = 1 (certain).",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "James picks one card from a 52-card deck. What is the probability of picking a King?",
      options: ["1/13", "1/4", "1/52", "2/13"],
      correctIndex: 0,
      explanation: "There are 4 Kings in a deck of 52 cards, so P = 4/52 = 1/13.",
      diagramData: { mode: "cards" }
    },
    {
      prompt: "Harper picks one card from a 52-card deck. How would you describe picking a red spade?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "All spades are black. There are 0 red spades, so P = 0 (impossible).",
      diagramData: { mode: "cards" }
    }
  ],

  5: [
    {
      prompt: "Leo picks a month of the year at random. How would you describe picking a month with 32 days?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "No month in the calendar has 32 days (max is 31). Favourable outcomes = 0, so P = 0 (impossible).",
      diagramData: { mode: "tokens", items: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], favIdx: [] }
    },
    {
      prompt: "Emma picks a day of the week at random. How would you describe picking a day that has the letter y in its name?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday all end with y. All 7 outcomes match, so P = 1 (certain).",
      diagramData: { mode: "tokens", items: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], favIdx: [0, 1, 2, 3, 4, 5, 6] }
    },
    {
      prompt: "Alex picks a month of the year at random. How would you describe picking a month with fewer than 32 days?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "All 12 months have 28, 30, or 31 days, which are all fewer than 32. P = 12/12 = 1 (certain).",
      diagramData: { mode: "tokens", items: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], favIdx: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }
    },
    {
      prompt: "Chloe picks a day of the week at random. What is the probability of picking a weekend day (Saturday or Sunday)?",
      options: ["2/7", "5/7", "1/7", "3/7"],
      correctIndex: 0,
      explanation: "2 out of 7 days are weekend days, so P = 2/7.",
      diagramData: { mode: "tokens", items: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], favIdx: [5, 6] }
    },
    {
      prompt: "Noah picks a month of the year at random. How would you describe picking a month with fewer than 28 days?",
      options: ["Impossible", "Unlikely", "Certain", "Likely"],
      correctIndex: 0,
      explanation: "February has at least 28 days, so no month has fewer than 28 days. P = 0 (impossible).",
      diagramData: { mode: "tokens", items: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], favIdx: [] }
    },
    {
      prompt: "Sophia picks a day of the week at random. What is the probability of picking a day starting with the letter T?",
      options: ["2/7", "1/7", "3/7", "5/7"],
      correctIndex: 0,
      explanation: "Tuesday and Thursday start with T, so 2 out of 7 days match. P = 2/7.",
      diagramData: { mode: "tokens", items: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], favIdx: [1, 3] }
    },
    {
      prompt: "Mason picks a month of the year at random. What is the probability of picking a month starting with the letter J?",
      options: ["1/4", "1/2", "1/3", "1/6"],
      correctIndex: 0,
      explanation: "January, June, and July start with J. 3 out of 12 months match, so P = 3/12 = 1/4.",
      diagramData: { mode: "tokens", items: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], favIdx: [0, 5, 6] }
    },
    {
      prompt: "Ella picks a day of the week at random. The probability of picking a weekend day is 2/7. What is the probability of picking a weekday?",
      options: ["5/7", "2/7", "1/7", "1"],
      correctIndex: 0,
      explanation: "P(weekday) = 1 − P(weekend) = 1 − 2/7 = 5/7.",
      diagramData: { mode: "line", marker: 2 / 7, label: "P(E)" }
    },
    {
      prompt: "James picks a month of the year at random. What is the probability of picking a month in the first half of the year (January to June)?",
      options: ["1/2", "1/4", "3/4", "1"],
      correctIndex: 0,
      explanation: "6 out of 12 months are in the first half, so P = 6/12 = 1/2.",
      diagramData: { mode: "tokens", items: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], favIdx: [0, 1, 2, 3, 4, 5] }
    },
    {
      prompt: "Harper picks a day of the week at random. How would you describe picking a day with fewer than 10 letters in its name?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Wednesday (9 letters) is the longest day name. All 7 days have 9 or fewer letters, so P = 7/7 = 1 (certain).",
      diagramData: { mode: "tokens", items: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], favIdx: [0, 1, 2, 3, 4, 5, 6] }
    }
  ],

  6: [
    {
      prompt: "Maya's candy jar holds 6 red candies and 0 green candies. How would you describe drawing a green candy?",
      options: ["Impossible", "Certain", "Likely", "Unlikely"],
      correctIndex: 0,
      explanation: "There are 0 green candies in the jar, so P = 0. It is impossible.",
      diagramData: { mode: "bag", counts: { red: 6 }, favColors: ["green"], unit: "candy" }
    },
    {
      prompt: "Lucas's candy jar holds 10 chocolate candies. What is the probability of drawing a chocolate candy?",
      options: ["1", "0", "1/2", "9/10"],
      correctIndex: 0,
      explanation: "All 10 candies in the jar are chocolate, so P = 10/10 = 1 (certain).",
      diagramData: { mode: "bag", counts: { chocolate: 10 }, favColors: ["chocolate"], unit: "candy" }
    },
    {
      prompt: "Ava's candy jar holds 4 lemon, 4 strawberry, and 4 mint candies. What is the probability of drawing a lemon candy?",
      options: ["1/3", "1/4", "1/2", "2/3"],
      correctIndex: 0,
      explanation: "4 lemon candies out of 12 total candies gives P = 4/12 = 1/3.",
      diagramData: { mode: "bag", counts: { lemon: 4, strawberry: 4, mint: 4 }, favColors: ["lemon"], unit: "candy" }
    },
    {
      prompt: "Oliver's candy jar holds 5 apple candies and 5 grape candies. What is the probability of drawing an apple candy as a percentage?",
      options: ["50%", "100%", "0%", "25%"],
      correctIndex: 0,
      explanation: "5 out of 10 candies is 1/2, which equals 50%.",
      diagramData: { mode: "bag", counts: { apple: 5, grape: 5 }, favColors: ["apple"], unit: "candy" }
    },
    {
      prompt: "Charlotte's candy jar holds 3 red candies and 3 blue candies. Which change makes drawing a red candy certain?",
      options: ["Take out every candy that is not red", "Add 5 red candies", "Take out 2 red candies", "Add 1 blue candy"],
      correctIndex: 0,
      explanation: "Drawing red is certain only when every candy in the jar is red. Take out every candy that is not red.",
      diagramData: { mode: "bag", counts: { red: 3, blue: 3 }, favColors: ["red"], unit: "candy" }
    },
    {
      prompt: "Noah's candy jar holds 4 yellow candies and 2 blue candies. Which change makes drawing a blue candy impossible?",
      options: ["Take out all 2 blue candies", "Add 3 yellow candies", "Take out 1 yellow candy", "Add 2 blue candies"],
      correctIndex: 0,
      explanation: "Drawing blue is impossible when there are 0 blue candies left in the jar. Take out all 2 blue candies.",
      diagramData: { mode: "bag", counts: { yellow: 4, blue: 2 }, favColors: ["blue"], unit: "candy" }
    },
    {
      prompt: "Mia's candy jar holds 8 fruit chews. What is the probability of drawing a sour candy that is not in the jar?",
      options: ["0", "1/8", "1", "1/2"],
      correctIndex: 0,
      explanation: "Favourable outcomes = 0, so P = 0 (impossible).",
      diagramData: { mode: "bag", counts: { fruit_chews: 8 }, favColors: ["sour"], unit: "candy" }
    },
    {
      prompt: "Ethan's candy jar holds 5 red candies and 5 blue candies. The event drawing a red candy has probability 1/2. What is the probability of NOT drawing a red candy?",
      options: ["1/2", "0", "1", "1/4"],
      correctIndex: 0,
      explanation: "P(not red) = 1 − P(red) = 1 − 1/2 = 1/2.",
      diagramData: { mode: "line", marker: 1 / 2, label: "P(E)" }
    },
    {
      prompt: "Harper's candy jar holds 7 orange candies and 0 purple candies. What is the probability of drawing an orange candy as a decimal?",
      options: ["1", "0", "0.7", "0.5"],
      correctIndex: 0,
      explanation: "All 7 candies are orange, so P = 7/7 = 1.",
      diagramData: { mode: "bag", counts: { orange: 7 }, favColors: ["orange"], unit: "candy" }
    },
    {
      prompt: "Jack's candy jar holds 2 mints and 6 chocolates. What is the probability of drawing a mint?",
      options: ["1/4", "3/4", "1/2", "1/8"],
      correctIndex: 0,
      explanation: "2 mints out of 8 total candies gives P = 2/8 = 1/4.",
      diagramData: { mode: "bag", counts: { mint: 2, chocolate: 6 }, favColors: ["mint"], unit: "candy" }
    }
  ],

  7: [
    {
      prompt: "Which of these numbers can NOT be the probability of an event?",
      options: ["1.5", "0.5", "0.25", "0.8"],
      correctIndex: 0,
      explanation: "1.5 is greater than 1. Every probability must lie between 0 and 1.",
      diagramData: { mode: "line", marker: null, label: "" }
    },
    {
      prompt: "Which of these numbers COULD be the probability of an event?",
      options: ["0.75", "1.2", "−0.3", "150%"],
      correctIndex: 0,
      explanation: "0.75 lies between 0 and 1, so it can be a probability. The others fall below 0 or above 1.",
      diagramData: { mode: "line", marker: null, label: "" }
    },
    {
      prompt: "The arrow on the probability line is at 0. How would you describe the event?",
      options: ["Impossible", "Certain", "Even chance", "Likely"],
      correctIndex: 0,
      explanation: "0 on the probability line means the event is impossible.",
      diagramData: { mode: "line", marker: 0, label: "P(E)" }
    },
    {
      prompt: "The arrow on the probability line is at 1. How would you describe the event?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "1 on the probability line means the event is certain.",
      diagramData: { mode: "line", marker: 1, label: "P(E)" }
    },
    {
      prompt: "An arrow on the probability line points to 0.5. How would you describe the event?",
      options: ["Even chance", "Impossible", "Certain", "Unlikely"],
      correctIndex: 0,
      explanation: "0.5 is halfway between 0 and 1, which represents an even chance.",
      diagramData: { mode: "line", marker: 0.5, label: "P(E)" }
    },
    {
      prompt: "Which statement about probability is TRUE?",
      options: ["An impossible event has a probability of 0.", "A probability can be bigger than 1.", "An unlikely event has a probability of 0.", "P(A) and P(not A) add up to 2."],
      correctIndex: 0,
      explanation: "An impossible event has 0 favourable outcomes, so its probability is strictly 0.",
      diagramData: { mode: "line", marker: null, label: "" }
    },
    {
      prompt: "Which statement about probability is FALSE?",
      options: ["A probability can be bigger than 1 if an event is very likely.", "A certain event has a probability of 1.", "Every probability lies between 0 and 1.", "P(A) + P(not A) = 1."],
      correctIndex: 0,
      explanation: "No probability can be bigger than 1. 1 is the absolute maximum, meaning certain.",
      diagramData: { mode: "line", marker: null, label: "" }
    },
    {
      prompt: "If an event A has probability 0.3 on the probability line, what is the probability of the opposite event (not A)?",
      options: ["0.7", "0.3", "1.3", "0"],
      correctIndex: 0,
      explanation: "P(not A) = 1 − P(A) = 1 − 0.3 = 0.7.",
      diagramData: { mode: "line", marker: 0.3, label: "P(A)" }
    },
    {
      prompt: "Which of these numbers can NOT be a probability?",
      options: ["−0.2", "0", "1", "0.99"],
      correctIndex: 0,
      explanation: "−0.2 is negative. Probabilities can never be below 0.",
      diagramData: { mode: "line", marker: null, label: "" }
    },
    {
      prompt: "If an event is certain, where does it sit on the probability line from 0 to 1?",
      options: ["1", "0", "0.5", "0.9"],
      correctIndex: 0,
      explanation: "Certain events sit at exactly 1 (or 100%) on the probability line.",
      diagramData: { mode: "line", marker: 1, label: "Certain" }
    }
  ],

  8: [
    {
      prompt: "Leo rolls two fair six-sided dice and adds the numbers. How would you describe the event: the sum is 13?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "The maximum possible sum with two dice is 6 + 6 = 12. A sum of 13 has 0 outcomes, so P = 0 (impossible).",
      diagramData: { mode: "twodice", grid: Array(36).fill(false) }
    },
    {
      prompt: "Emma rolls two fair six-sided dice and adds the numbers. How would you describe the event: the sum is 1?",
      options: ["Impossible", "Certain", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "The minimum possible sum with two dice is 1 + 1 = 2. A sum of 1 is impossible (P = 0).",
      diagramData: { mode: "twodice", grid: Array(36).fill(false) }
    },
    {
      prompt: "Alex rolls two fair six-sided dice and adds the numbers. How would you describe the event: the sum is less than 13?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "Every pair of faces adds up to between 2 and 12, which are all less than 13. All 36 outcomes match, so P = 1 (certain).",
      diagramData: { mode: "twodice", grid: Array(36).fill(true) }
    },
    {
      prompt: "Chloe rolls two fair six-sided dice and multiplies the numbers. How would you describe the event: the product is 0?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "Dice faces are 1 to 6. No face is 0, so the product can never be 0. P = 0 (impossible).",
      diagramData: { mode: "twodice", grid: Array(36).fill(false) }
    },
    {
      prompt: "Noah rolls two fair six-sided dice and adds the numbers. What is the probability that the sum is 7?",
      options: ["1/6", "1/12", "7/36", "1/36"],
      correctIndex: 0,
      explanation: "There are 6 ways to get a sum of 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) out of 36 outcomes, so P = 6/36 = 1/6.",
      diagramData: { mode: "twodice", grid: Array(36).fill(false) }
    },
    {
      prompt: "Sophia rolls two fair six-sided dice and adds the numbers. How would you describe the event: the sum is at least 2?",
      options: ["Certain", "Impossible", "Unlikely", "Even chance"],
      correctIndex: 0,
      explanation: "The smallest sum is 1 + 1 = 2, so every outcome gives a sum of at least 2. P = 36/36 = 1 (certain).",
      diagramData: { mode: "twodice", grid: Array(36).fill(true) }
    },
    {
      prompt: "Mason rolls two fair six-sided dice. What is the probability that both dice show the same number (doubles)?",
      options: ["1/6", "1/36", "1/12", "1/2"],
      correctIndex: 0,
      explanation: "Doubles are (1,1), (2,2), (3,3), (4,4), (5,5), (6,6) (6 outcomes out of 36), so P = 6/36 = 1/6.",
      diagramData: { mode: "twodice", grid: Array(36).fill(false) }
    },
    {
      prompt: "Ella rolls two fair six-sided dice. The event rolling doubles has probability 1/6. What is the probability of NOT rolling doubles?",
      options: ["5/6", "1/6", "0", "1"],
      correctIndex: 0,
      explanation: "P(not doubles) = 1 − 1/6 = 5/6.",
      diagramData: { mode: "line", marker: 1 / 6, label: "P(E)" }
    },
    {
      prompt: "James rolls two fair six-sided dice and adds the numbers. What is the probability that the sum is 12?",
      options: ["1/36", "1/6", "1/12", "0"],
      correctIndex: 0,
      explanation: "Only (6,6) gives a sum of 12 (1 outcome out of 36), so P = 1/36.",
      diagramData: { mode: "twodice", grid: Array(36).fill(false) }
    },
    {
      prompt: "Harper rolls two fair six-sided dice and adds the numbers. How would you describe the event: the sum is more than 12?",
      options: ["Impossible", "Certain", "Unlikely", "Likely"],
      correctIndex: 0,
      explanation: "Maximum sum is 12. Favourable outcomes = 0, so P = 0 (impossible).",
      diagramData: { mode: "twodice", grid: Array(36).fill(false) }
    }
  ],

  9: [
    {
      prompt: "Detective Zara is inspecting a raffle box with 0 blue tokens and 10 red tokens. What is the probability of drawing a blue token?",
      options: ["0", "1", "1/10", "1/2"],
      correctIndex: 0,
      explanation: "0 blue tokens means P(blue) = 0. Drawing blue is impossible.",
      diagramData: { mode: "tokens", items: ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R"], favIdx: [] }
    },
    {
      prompt: "At the Festival Lucky Wheel, every section is gold. What is the probability of landing on gold?",
      options: ["1", "0", "1/2", "3/4"],
      correctIndex: 0,
      explanation: "All sections are gold, so P = 1. Landing on gold is certain.",
      diagramData: { mode: "spinner", wedges: ["gold", "gold", "gold", "gold", "gold", "gold"], favColors: ["gold"] }
    },
    {
      prompt: "A smartphone factory batch has 15 working phones and 0 glitchy phones. What is the probability of picking a working phone?",
      options: ["1", "0", "14/15", "1/15"],
      correctIndex: 0,
      explanation: "Every phone in the batch is working, so P = 15/15 = 1 (certain).",
      diagramData: { mode: "bag", counts: { working: 15 }, favColors: ["working"], unit: "phone" }
    },
    {
      prompt: "If P(Event A) = 0.8, what is the probability of the opposite event (not A)?",
      options: ["0.2", "0.8", "1.8", "0"],
      correctIndex: 0,
      explanation: "P(not A) = 1 − P(A) = 1 − 0.8 = 0.2.",
      diagramData: { mode: "line", marker: 0.8, label: "P(A)" }
    },
    {
      prompt: "Which value on the probability line represents an event that is impossible?",
      options: ["0", "1", "0.5", "0.1"],
      correctIndex: 0,
      explanation: "0 (or 0%) represents an impossible event.",
      diagramData: { mode: "line", marker: 0, label: "Impossible" }
    },
    {
      prompt: "Which value on the probability line represents an event that is certain?",
      options: ["1", "0", "0.5", "0.9"],
      correctIndex: 0,
      explanation: "1 (or 100%) represents a certain event.",
      diagramData: { mode: "line", marker: 1, label: "Certain" }
    },
    {
      prompt: "Leo rolls a fair six-sided die. What is the probability of rolling a number greater than 6?",
      options: ["0", "1/6", "1", "5/6"],
      correctIndex: 0,
      explanation: "Favourable outcomes = 0 out of 6, so P = 0 (impossible).",
      diagramData: { mode: "die", faces: [1, 2, 3, 4, 5, 6], favFaces: [] }
    },
    {
      prompt: "Maya has a bag with 4 red marbles and 4 blue marbles. What is the probability of drawing a red marble?",
      options: ["1/2", "1/4", "3/4", "1"],
      correctIndex: 0,
      explanation: "4 red marbles out of 8 total marbles gives P = 4/8 = 1/2.",
      diagramData: { mode: "bag", counts: { red: 4, blue: 4 }, favColors: ["red"], unit: "marble" }
    },
    {
      prompt: "Which statement about probability is TRUE?",
      options: ["Every probability lives between 0 and 1.", "A probability can be negative.", "Certain events have probability 0.", "Impossible events have probability 1."],
      correctIndex: 0,
      explanation: "Probabilities range strictly from 0 (impossible) to 1 (certain).",
      diagramData: { mode: "line", marker: null, label: "" }
    },
    {
      prompt: "You flip two fair coins. What is the probability of getting at least one head?",
      options: ["3/4", "1/4", "1/2", "1"],
      correctIndex: 0,
      explanation: "Favourable outcomes are HH, HT, TH (3 out of 4), so P = 3/4.",
      diagramData: { mode: "coins", n: 2, outcomes: ["HH", "HT", "TH", "TT"], favOutcomes: ["HH", "HT", "TH"] }
    }
  ]
};

export function makeQuestion(worldIndex = 0, seen = null) {
  const list = WORLD_QUESTIONS[worldIndex] || WORLD_QUESTIONS[0];
  let available = list.filter(q => !seen || !seen.has(q.prompt));
  if (available.length === 0) available = list;
  const q = available[Math.floor(Math.random() * available.length)];
  if (seen) seen.add(q.prompt);
  return { world: PRACTICE_WORLDS[worldIndex], ...q };
}
