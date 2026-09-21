/* =========================================================================
   MATH DATA & PROCEDURAL QUESTION GENERATOR
   Procedurally generates unbounded, non-repeating Grade 7 questions on
   IMPOSSIBLE and CERTAIN events (probability 0 and 1), the probability
   line, sample spaces and complementary events.
   ========================================================================= */

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Dice Dungeon",         icon: "🎲", range: "Q1–10",   difficulty: 1, themes: ["die"],                                   archetypes: ["classify", "prob_value"] },
  { id: 1, name: "Marble Mountain",      icon: "🔮", range: "Q11–20",  difficulty: 1, themes: ["bag"],                                   archetypes: ["classify", "make_change"] },
  { id: 2, name: "Coin Cavern",          icon: "🪙", range: "Q21–30",  difficulty: 2, themes: ["coin"],                                  archetypes: ["classify", "prob_value", "complement"] },
  { id: 3, name: "Spinner Speedway",     icon: "🎡", range: "Q31–40",  difficulty: 2, themes: ["spinner"],                               archetypes: ["classify", "prob_value", "line_read"] },
  { id: 4, name: "Card Castle",          icon: "🃏", range: "Q41–50",  difficulty: 3, themes: ["cards", "tokens"],                       archetypes: ["classify", "prob_value", "valid_prob"] },
  { id: 5, name: "Calendar Tower",       icon: "📅", range: "Q51–60",  difficulty: 3, themes: ["calendar", "letters"],                   archetypes: ["classify", "prob_value", "myth"] },
  { id: 6, name: "Candy Jar Jungle",     icon: "🍬", range: "Q61–70",  difficulty: 3, themes: ["candy"],                                 archetypes: ["make_change", "complement", "classify", "prob_value"] },
  { id: 7, name: "Probability Line Peak",icon: "📏", range: "Q71–80",  difficulty: 4, themes: ["abstract"],                              archetypes: ["line_read", "valid_prob", "complement", "myth"] },
  { id: 8, name: "Two-Dice Galaxy",      icon: "🚀", range: "Q81–90",  difficulty: 4, themes: ["twodice"],                               archetypes: ["classify", "prob_value", "complement"] },
  { id: 9, name: "Grand Master Vault",   icon: "🏆", range: "Q91–100", difficulty: 4, themes: ["die", "bag", "coin", "spinner", "cards", "tokens", "calendar", "letters", "candy", "twodice"],
                                                                                              archetypes: ["classify", "prob_value", "complement", "make_change", "valid_prob", "line_read", "myth"] }
];

/* ---------------------------------------------------------------------- */
/* Small helpers                                                          */
/* ---------------------------------------------------------------------- */
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

export function reduce(n, d) {
  if (n === 0) return [0, 1];
  const g = gcd(n, d);
  return [n / g, d / g];
}

/** Text of a fraction n/d in simplest form: 0, 1, 3 or 3/8 */
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

const sameFraction = (a, b) => a[0] * b[1] === b[0] * a[1];

/* ---------------------------------------------------------------------- */
/* Probability vocabulary                                                 */
/* ---------------------------------------------------------------------- */
export const STATUS = {
  impossible: { key: "impossible", label: "Impossible",  color: "#f43f5e", text: "text-rose-300",    bg: "bg-rose-500/20",    border: "border-rose-400/60" },
  unlikely:   { key: "unlikely",   label: "Unlikely",    color: "#fb923c", text: "text-orange-300",  bg: "bg-orange-500/20",  border: "border-orange-400/60" },
  even:       { key: "even",       label: "Even chance", color: "#facc15", text: "text-yellow-300",  bg: "bg-yellow-500/20",  border: "border-yellow-400/60" },
  likely:     { key: "likely",     label: "Likely",      color: "#2dd4bf", text: "text-teal-300",    bg: "bg-teal-500/20",    border: "border-teal-400/60" },
  certain:    { key: "certain",    label: "Certain",     color: "#4ade80", text: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-400/60" }
};

/** Classify the probability fav/total on the 5-level probability line */
export function probStatus(fav, total) {
  if (total <= 0) return STATUS.impossible;
  if (fav <= 0) return STATUS.impossible;
  if (fav >= total) return STATUS.certain;
  const p2 = fav * 2;
  if (p2 === total) return STATUS.even;
  return p2 < total ? STATUS.unlikely : STATUS.likely;
}

/** One-sentence meaning of a probability status */
export function statusCaption(fav, total) {
  const s = probStatus(fav, total);
  if (s.key === "impossible") return "Impossible: there are 0 favourable outcomes, so it can NEVER happen.";
  if (s.key === "certain") return "Certain: every outcome is favourable, so it ALWAYS happens.";
  return "Possible but NOT certain: some outcomes are favourable, some are not.";
}

/** Read a learner's typed probability: "7/12", "0.58", "58%", "1", "0" */
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

/** True if the typed answer equals fav/total (exact fractions, tidy decimals, percents) */
export function probMatches(raw, fav, total) {
  const v = parseProbability(raw);
  if (v == null || Number.isNaN(v)) return false;
  const target = fav / total;
  return Math.abs(v - target) < 0.006;
}

/* ---------------------------------------------------------------------- */
/* Scenario factories                                                     */
/* Every scenario:  { setup, event, fav, total, diagram }                  */
/* ---------------------------------------------------------------------- */
const kindOf = (fav, total) => (fav === 0 ? "impossible" : fav === total ? "certain" : "mid");

function chooseKind(diff) {
  const r = Math.random();
  if (diff <= 1) return r < 0.5 ? "impossible" : "certain";
  if (diff <= 3) return r < 0.25 ? "impossible" : r < 0.5 ? "certain" : "mid";
  return r < 0.2 ? "impossible" : r < 0.4 ? "certain" : "mid";
}

/* ---- Die ---- */
const DIE_EVENTS = [
  ["rolling a 7", n => n === 7], ["rolling a 0", n => n === 0], ["rolling a 9", n => n === 9],
  ["rolling a number greater than 6", n => n > 6], ["rolling a number bigger than 10", n => n > 10],
  ["rolling a negative number", n => n < 0], ["rolling a number less than 1", n => n < 1],
  ["rolling a number less than 7", n => n < 7], ["rolling a whole number from 1 to 6", n => n >= 1 && n <= 6],
  ["rolling a number greater than 0", n => n > 0], ["rolling a number that is at most 6", n => n <= 6],
  ["rolling a number less than 10", n => n < 10],
  ["rolling an even number", n => n % 2 === 0], ["rolling an odd number", n => n % 2 === 1],
  ["rolling a 4", n => n === 4], ["rolling a number greater than 4", n => n > 4],
  ["rolling a prime number", n => [2, 3, 5].includes(n)], ["rolling a multiple of 3", n => n % 3 === 0],
  ["rolling a number less than 3", n => n < 3], ["rolling a number less than 6", n => n < 6],
  ["rolling a number that is at least 2", n => n >= 2]
];

function dieScenario(kind, name) {
  const faces = [1, 2, 3, 4, 5, 6];
  const list = DIE_EVENTS.map(([text, pred]) => ({ text, pred, total: 6, fav: faces.filter(pred).length }));
  const e = pick(list.filter(x => kindOf(x.fav, 6) === kind));
  return {
    setup: `${name} rolls a fair six-sided die.`,
    event: e.text, fav: e.fav, total: 6,
    diagram: { mode: "die", faces, favFaces: faces.filter(e.pred) }
  };
}

/* ---- Colour-based scenarios (bag, candy jar, spinner) ---- */
const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

function joinList(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
function joinOr(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}

function colorScenario(kind, unit /* 'marble' | 'candy' | 'spinner' */, name) {
  let counts = {};
  let event;
  let favColors;

  const many = () => {
    const cols = shuffle(COLORS).slice(0, randInt(2, 3));
    cols.forEach(c => (counts[c] = randInt(1, 4)));
    return cols;
  };

  if (kind === "impossible") {
    if (Math.random() < 0.7) {
      const cols = Math.random() < 0.5 ? many() : (() => { const c = pick(COLORS); counts[c] = randInt(2, 6); return [c]; })();
      const absent = pick(COLORS.filter(c => !cols.includes(c)));
      event = { type: "is", color: absent };
      favColors = [absent];
    } else {
      const c = pick(COLORS);
      counts[c] = randInt(2, 6);
      event = { type: "not", color: c };
      favColors = [];
    }
  } else if (kind === "certain") {
    const roll = Math.random();
    if (roll < 0.4) {
      const c = pick(COLORS);
      counts[c] = randInt(2, 7);
      event = { type: "is", color: c };
      favColors = [c];
    } else if (roll < 0.75) {
      const cols = many();
      event = { type: "any", colors: cols };
      favColors = cols;
    } else {
      const c = pick(COLORS);
      counts[c] = randInt(2, 6);
      const absent = pick(COLORS.filter(x => x !== c));
      event = { type: "not", color: absent };
      favColors = [c];
    }
  } else {
    const cols = many();
    const c = pick(cols);
    if (Math.random() < 0.7) {
      event = { type: "is", color: c };
      favColors = [c];
    } else {
      event = { type: "not", color: c };
      favColors = cols.filter(x => x !== c);
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const fav = favColors.reduce((s, c) => s + (counts[c] || 0), 0);
  const colsInBag = Object.keys(counts);
  const nounPl = unit === "candy" ? "candies" : "marbles";
  const noun = unit === "candy" ? "candy" : "marble";

  const desc = colsInBag.length === 1
    ? `${counts[colsInBag[0]]} ${colsInBag[0]} ${nounPl}`
    : `${joinList(colsInBag.map(c => `${counts[c]} ${c}`))} ${nounPl}`;

  let eventText;
  if (unit === "spinner") {
    if (event.type === "is") eventText = `landing on ${event.color}`;
    else if (event.type === "not") eventText = `landing on a section that is not ${event.color}`;
    else eventText = `landing on ${joinOr(event.colors)}`;
  } else {
    if (event.type === "is") eventText = `drawing a ${event.color} ${noun}`;
    else if (event.type === "not") eventText = `drawing a ${noun} that is not ${event.color}`;
    else eventText = `drawing a ${joinOr(event.colors)} ${noun}`;
  }

  if (unit === "spinner") {
    // Lay the sections out in a shuffled circle
    const wedges = shuffle(colsInBag.flatMap(c => Array(counts[c]).fill(c)));
    return {
      setup: colsInBag.length === 1
        ? `${name} spins a wheel with ${total} equal sections, all ${colsInBag[0]}.`
        : `${name} spins a wheel with ${total} equal sections: ${joinList(colsInBag.map(c => `${counts[c]} ${c}`))}.`,
      event: eventText, fav, total,
      diagram: { mode: "spinner", wedges, favColors }
    };
  }

  const inBagWord = unit === "candy" ? "jar" : "bag";
  return {
    setup: `${name}'s ${inBagWord} holds ${desc}. ${name} picks one without looking.`,
    event: eventText, fav, total,
    diagram: { mode: "bag", counts, favColors, unit }
  };
}

/* ---- Coins ---- */
function coinOutcomes(n) {
  let out = [""];
  for (let i = 0; i < n; i++) out = out.flatMap(o => [o + "H", o + "T"]);
  return out;
}
const COIN_EVENTS = {
  1: [
    ["the coin lands on heads", o => o === "H"], ["the coin lands on tails", o => o === "T"],
    ["the coin lands on heads or tails", o => o === "H" || o === "T"],
    ["the coin lands on both heads and tails at the same time", () => false]
  ],
  2: [
    ["both coins land on heads", o => o === "HH"], ["at least one coin lands on heads", o => o.includes("H")],
    ["exactly one coin lands on heads", o => (o.match(/H/g) || []).length === 1],
    ["three coins land on heads", () => false],
    ["at most 2 coins land on heads", () => true],
    ["the two coins land on the same side", o => o[0] === o[1]],
    ["there are 5 heads in total", () => false]
  ],
  3: [
    ["all three coins land on heads", o => o === "HHH"], ["at least one coin lands on tails", o => o.includes("T")],
    ["exactly two coins land on heads", o => (o.match(/H/g) || []).length === 2],
    ["four coins land on heads", () => false],
    ["at most 3 coins land on heads", () => true],
    ["there are more than 3 tails", () => false],
    ["at least one coin lands on heads or tails", () => true]
  ]
};

function coinScenario(kind, name, diff) {
  const n = diff <= 2 ? pick([1, 2]) : pick([2, 3]);
  const outcomes = coinOutcomes(n);
  const list = COIN_EVENTS[n].map(([text, pred]) => ({ text, pred, fav: outcomes.filter(pred).length }));
  let pool = list.filter(x => kindOf(x.fav, outcomes.length) === kind);
  if (!pool.length) pool = list;
  const e = pick(pool);
  const coinWord = n === 1 ? "a fair coin" : n === 2 ? "two fair coins" : "three fair coins";
  return {
    setup: `${name} flips ${coinWord}.`,
    event: e.text, fav: e.fav, total: outcomes.length,
    diagram: { mode: "coins", n, outcomes, favOutcomes: outcomes.filter(e.pred) }
  };
}

/* ---- Standard cards ---- */
const CARD_EVENTS = [
  ["the card has the number 15", 0], ["the card is a black heart", 0], ["the card is a red spade", 0],
  ["the card is red or black", 52], ["the card belongs to one of the four suits", 52],
  ["the card is a heart", 13], ["the card is a club", 13], ["the card is a red card", 26],
  ["the card is a black card", 26], ["the card is a heart or a diamond", 26], ["the card is a king", 4],
  ["the card is an ace", 4], ["the card is a face card (jack, queen or king)", 12]
];
function cardScenario(kind, name) {
  const list = CARD_EVENTS.map(([text, fav]) => ({ text, fav }));
  const pool = list.filter(x => kindOf(x.fav, 52) === kind);
  const e = pick(pool.length ? pool : list);
  return {
    setup: `${name} picks one card at random from a standard 52-card deck.`,
    event: e.text, fav: e.fav, total: 52,
    diagram: { mode: "cards" }
  };
}

/* ---- Number tokens & letter tiles ---- */
const TOKEN_SETS = [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9], [3, 6, 9, 12, 15], [5, 10, 15, 20, 25], [2, 4, 6, 8, 10, 12], [10, 20, 30, 40]];
const TOKEN_PREDS = [
  ["is even", n => n % 2 === 0], ["is odd", n => n % 2 === 1], ["is a multiple of 5", n => n % 5 === 0],
  ["is a multiple of 3", n => n % 3 === 0], ["is greater than 10", n => n > 10], ["is greater than 100", n => n > 100],
  ["is less than 50", n => n < 50], ["is less than 100", n => n < 100], ["is a prime number", n => [2, 3, 5, 7, 11].includes(n)],
  ["is a whole number", () => true], ["is a fraction between 0 and 1", () => false], ["is greater than 6", n => n > 6]
];
function numberScenario(kind, name) {
  for (let tries = 0; tries < 40; tries++) {
    const set = pick(TOKEN_SETS);
    const [text, pred] = pick(TOKEN_PREDS);
    const fav = set.filter(pred).length;
    if (kindOf(fav, set.length) !== kind) continue;
    return {
      setup: `Tokens numbered ${joinList(set.map(String))} are placed in a bag. ${name} picks one at random.`,
      event: `the number ${text}`, fav, total: set.length,
      diagram: { mode: "tokens", items: set.map(String), favIdx: set.map((n, i) => (pred(n) ? i : -1)).filter(i => i >= 0) }
    };
  }
  return numberScenario(kind === "impossible" ? "certain" : "impossible", name);
}

const WORDS = ["MATH", "SAMPLE", "EVENT", "CERTAIN", "MARBLE", "CHANCE", "OUTCOME", "RANDOM"];
const VOWELS = "AEIOU";
function letterScenario(kind, name) {
  for (let tries = 0; tries < 60; tries++) {
    const word = pick(WORDS);
    const letters = word.split("");
    const options = [
      ["the letter is a vowel", l => VOWELS.includes(l)],
      ["the letter is a consonant", l => !VOWELS.includes(l)],
      ["the letter is a letter of the alphabet", () => true],
      [`the letter is ${pick(["Z", "Q", "X", "J"])}`, null],
      [`the letter is ${pick(letters)}`, null]
    ];
    const [text, pred0] = pick(options);
    const pred = pred0 || (l => l === text.slice(-1));
    const fav = letters.filter(pred).length;
    if (kindOf(fav, letters.length) !== kind) continue;
    return {
      setup: `Letter tiles spelling the word ${word} are placed in a bag. ${name} picks one tile at random.`,
      event: text, fav, total: letters.length,
      diagram: { mode: "tokens", items: letters, favIdx: letters.map((l, i) => (pred(l) ? i : -1)).filter(i => i >= 0) }
    };
  }
  return letterScenario(kind === "impossible" ? "certain" : "impossible", name);
}

/* ---- Calendar ---- */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAY_EVENTS = [
  ["has the letter y in its name", d => d.toLowerCase().includes("y")],
  ["has fewer than 10 letters in its name", d => d.length < 10],
  ["has more than 9 letters in its name", d => d.length > 9],
  ["starts with the letter T", d => d.startsWith("T")],
  ["is a weekend day", d => d === "Saturday" || d === "Sunday"],
  ["comes after Friday", d => d === "Saturday" || d === "Sunday"]
];
const MONTH_EVENTS = [
  ["has 32 days", (m, i) => MONTH_DAYS[i] === 32],
  ["has fewer than 28 days", (m, i) => MONTH_DAYS[i] < 28],
  ["has fewer than 32 days", (m, i) => MONTH_DAYS[i] < 32],
  ["has 31 days", (m, i) => MONTH_DAYS[i] === 31],
  ["has 30 days", (m, i) => MONTH_DAYS[i] === 30],
  ["starts with the letter J", m => m.startsWith("J")],
  ["is in the first half of the year", (m, i) => i < 6]
];
function calendarScenario(kind, name) {
  for (let tries = 0; tries < 60; tries++) {
    const useDays = Math.random() < 0.5;
    const items = useDays ? DAYS : MONTHS;
    const [text, pred] = pick(useDays ? DAY_EVENTS : MONTH_EVENTS);
    const favIdx = items.map((x, i) => (pred(x, i) ? i : -1)).filter(i => i >= 0);
    if (kindOf(favIdx.length, items.length) !== kind) continue;
    return {
      setup: useDays
        ? `${name} picks a day of the week at random.`
        : `${name} picks a month of the year at random.`,
      event: `the ${useDays ? "day" : "month"} ${text}`, fav: favIdx.length, total: items.length,
      diagram: { mode: "tokens", items: items.map(x => x.slice(0, 3)), favIdx }
    };
  }
  return calendarScenario(kind === "impossible" ? "certain" : "impossible", name);
}

/* ---- Two dice ---- */
const TWO_DICE_EVENTS = [
  ["the sum is 13", (a, b) => a + b === 13], ["the sum is 1", (a, b) => a + b === 1],
  ["the product is 0", (a, b) => a * b === 0], ["the sum is more than 12", (a, b) => a + b > 12],
  ["the sum is less than 13", (a, b) => a + b < 13], ["the sum is at least 2", (a, b) => a + b >= 2],
  ["the product is at least 1", (a, b) => a * b >= 1], ["the sum is at most 12", (a, b) => a + b <= 12],
  ["the sum is 7", (a, b) => a + b === 7], ["the sum is 12", (a, b) => a + b === 12], ["the sum is 2", (a, b) => a + b === 2],
  ["the sum is greater than 10", (a, b) => a + b > 10], ["the sum is even", (a, b) => (a + b) % 2 === 0],
  ["the sum is a multiple of 5", (a, b) => (a + b) % 5 === 0], ["both dice show the same number", (a, b) => a === b],
  ["the sum is 6 or less", (a, b) => a + b <= 6]
];
function twoDiceScenario(kind, name) {
  const pairs = [];
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) pairs.push([a, b]);
  const list = TWO_DICE_EVENTS.map(([text, pred]) => ({ text, pred, fav: pairs.filter(([a, b]) => pred(a, b)).length }));
  const pool = list.filter(x => kindOf(x.fav, 36) === kind);
  const e = pick(pool.length ? pool : list);
  return {
    setup: `${name} rolls two fair six-sided dice and adds the numbers.`,
    event: e.text, fav: e.fav, total: 36,
    diagram: { mode: "twodice", grid: pairs.map(([a, b]) => e.pred(a, b)) }
  };
}

function makeScenario(theme, kind, name, diff) {
  switch (theme) {
    case "die": return dieScenario(kind, name);
    case "bag": return colorScenario(kind, "marble", name);
    case "candy": return colorScenario(kind, "candy", name);
    case "spinner": return colorScenario(kind, "spinner", name);
    case "coin": return coinScenario(kind, name, diff);
    case "cards": return cardScenario(kind, name);
    case "tokens": return numberScenario(kind, name);
    case "letters": return letterScenario(kind, name);
    case "calendar": return calendarScenario(kind, name);
    case "twodice": return twoDiceScenario(kind, name);
    default: return dieScenario(kind, name);
  }
}

/* ---------------------------------------------------------------------- */
/* Explanations & option builders                                          */
/* ---------------------------------------------------------------------- */
function explainProbability(fav, total) {
  const st = probStatus(fav, total);
  if (fav === 0) return `There are 0 favourable outcomes out of ${total}, so P = 0/${total} = 0. It can never happen, so it is impossible.`;
  if (fav === total) return `All ${total} outcomes are favourable, so P = ${total}/${total} = 1. It always happens, so it is certain.`;
  const red = fracText(fav, total);
  const same = red === `${fav}/${total}`;
  return `${fav} of the ${total} outcomes ${fav === 1 ? "is" : "are"} favourable, so P = ${fav}/${total}${same ? "" : ` = ${red}`}. That is between 0 and 1, so it is possible but not certain (${st.label.toLowerCase()}).`;
}

/** Decide ONE number style (fraction / decimal / percent) that suits every pair */
function styleFor(pairs, allowStyles) {
  const ok = [];
  if (allowStyles.includes("dec") && pairs.every(([n, d]) => decText(n, d) !== null)) ok.push("dec");
  if (allowStyles.includes("pct") && pairs.every(([n, d]) => pctText(n, d) !== null)) ok.push("pct");
  return ok.length && Math.random() < 0.6 ? pick(ok) : "frac";
}

function fmt(style, [n, d]) {
  return style === "dec" ? decText(n, d) : style === "pct" ? pctText(n, d) : fracText(n, d);
}

function finalize(correct, distractors) {
  const seen = new Set([correct]);
  const uniq = [];
  for (const d of distractors) {
    if (!seen.has(d)) { seen.add(d); uniq.push(d); }
  }
  const options = shuffle([correct, ...uniq.slice(0, 3)]);
  return { options, correctIndex: options.indexOf(correct) };
}

/**
 * Build 4 probability options (1 correct + 3 typical-mistake distractors).
 * `style` forces fraction / decimal / percent; otherwise it is chosen to suit all options.
 */
function probabilityOptions(fav, total, allowStyles, extra = [], forcedStyle = null) {
  const correct = [fav, total];
  const cand = [];
  const push = (n, d) => { if (d > 0 && n >= 0) cand.push([n, d]); };
  push(total - fav, total);                   // used the complement
  if (total - fav > 0) push(fav, total - fav); // odds instead of probability
  if (fav > 0) push(total, fav);               // upside-down fraction
  push(fav + 1, total);
  if (fav === 0) { push(1, total); push(1, 2); push(1, 1); }
  if (fav === total) { push(total - 1, total); push(1, 2); push(0, 1); }
  extra.forEach(([n, d]) => push(n, d));
  push(1, 2); push(1, 4); push(3, 4); push(1, 5); push(2, 5); push(1, 10);

  const usable = c => !forcedStyle || forcedStyle === "frac" || fmt(forcedStyle, c) !== null;
  const chosen = [];
  const all = [correct];
  for (const c of shuffle(cand.slice(0, 5)).concat(cand.slice(5))) {
    if (!usable(c) || all.some(x => sameFraction(x, c))) continue;
    all.push(c);
    chosen.push(c);
    if (chosen.length === 3) break;
  }
  const pairs = [correct, ...chosen];
  const style = forcedStyle || styleFor(pairs, allowStyles);
  const texts = pairs.map(pr => fmt(style, pr));
  return { ...finalize(texts[0], texts.slice(1)), style };
}

const LEVELS = ["Impossible", "Unlikely", "Even chance", "Likely", "Certain"];
function classifyOptions(fav, total) {
  const st = probStatus(fav, total).label;
  let others;
  if (st === "Impossible") others = ["Certain", "Unlikely", "Likely"];
  else if (st === "Certain") others = ["Impossible", "Likely", "Unlikely"];
  else {
    const rest = LEVELS.filter(l => l !== st && l !== "Impossible" && l !== "Certain");
    others = ["Impossible", "Certain", pick(rest)];
  }
  return finalize(st, others);
}

/* ---------------------------------------------------------------------- */
/* Question archetypes                                                    */
/* ---------------------------------------------------------------------- */
function qClassify(sc) {
  const { options, correctIndex } = classifyOptions(sc.fav, sc.total);
  return {
    prompt: `${sc.setup} How would you describe the event: ${sc.event}?`,
    options, correctIndex, diagramData: sc.diagram,
    explanation: explainProbability(sc.fav, sc.total),
    meta: { fav: sc.fav, total: sc.total }
  };
}

function qProbValue(sc, diff) {
  const styles = diff >= 4 ? ["dec", "pct"] : diff >= 3 ? ["dec"] : [];
  const { options, correctIndex } = probabilityOptions(sc.fav, sc.total, styles);
  return {
    prompt: `${sc.setup} What is the probability of the event: ${sc.event}?`,
    options, correctIndex, diagramData: sc.diagram,
    explanation: explainProbability(sc.fav, sc.total),
    meta: { fav: sc.fav, total: sc.total }
  };
}

function qComplement(sc, diff) {
  const f = sc.fav, t = sc.total;
  const compFav = t - f;
  const styles = diff >= 4 ? ["dec", "pct"] : diff >= 3 ? ["dec"] : [];
  const style = styleFor([[f, t], [compFav, t]], styles);
  const { options, correctIndex } = probabilityOptions(compFav, t, styles, [[f, t]], style);
  const pText = fmt(style, [f, t]);
  const cText = fmt(style, [compFav, t]);
  return {
    prompt: `${sc.setup} The event "${sc.event}" has probability ${pText}. What is the probability that it does NOT happen?`,
    options, correctIndex,
    diagramData: { mode: "line", marker: f / t, label: "P(E)" },
    explanation: `P(not E) = 1 − P(E) = 1 − ${pText} = ${cText}.${f === 0 ? " An impossible event has a certain opposite!" : f === t ? " A certain event has an impossible opposite!" : ""}`,
    meta: { fav: compFav, total: t }
  };
}

function qMakeChange(name, unit) {
  const noun = unit === "candy" ? "candy" : "marble";
  const nounPl = unit === "candy" ? "candies" : "marbles";
  const holder = unit === "candy" ? "jar" : "bag";
  const [c, o1, o2] = shuffle(COLORS).slice(0, 3);
  const goal = Math.random() < 0.5 ? "impossible" : "certain";
  const counts = goal === "impossible"
    ? { [c]: randInt(2, 4), [o1]: randInt(1, 4), [o2]: randInt(1, 3) }
    : { [c]: randInt(2, 4), [o1]: randInt(1, 3), [o2]: randInt(1, 3) };
  if (Math.random() < 0.35) delete counts[o2];
  if (goal === "certain" && !counts[o2] && counts[o1] < 2) counts[o1] = 2;
  const cols = Object.keys(counts);
  const others = cols.filter(x => x !== c);
  const nOthers = others.reduce((s, x) => s + counts[x], 0);
  const desc = joinList(cols.map(x => `${counts[x]} ${x}`));
  const prompt = `${name}'s ${holder} holds ${desc} ${nounPl}. Which change makes drawing a ${c} ${noun} ${goal}?`;

  let correct, wrongs;
  if (goal === "impossible") {
    correct = `Take out all ${counts[c]} ${c} ${nounPl}`;
    wrongs = [
      `Add 3 more ${c} ${nounPl}`,
      `Take out ${counts[c] - 1} of the ${c} ${nounPl}`,
      `Add 2 ${pick(others)} ${nounPl}`,
      `Take out all the ${pick(others)} ${nounPl}`
    ];
  } else {
    correct = `Take out every ${noun} that is not ${c}`;
    wrongs = [
      `Add 5 more ${c} ${nounPl}`,
      `Take out all but one of the ${nounPl} that are not ${c}`,
      `Take out all the ${c} ${nounPl}`,
      `Add 1 ${c} ${noun} and take out 1 ${pick(others)} ${noun}`
    ];
  }
  const { options, correctIndex } = finalize(correct, shuffle(wrongs));
  return {
    prompt, options, correctIndex,
    diagramData: { mode: "bag", counts, favColors: [c], unit },
    explanation: goal === "impossible"
      ? `Drawing ${c} is impossible only when there are 0 ${c} ${nounPl} left, so P(${c}) = 0.`
      : `Drawing ${c} is certain only when every ${noun} is ${c}, so P(${c}) = ${counts[c]}/${counts[c]} = 1. (Right now ${nOthers} ${nounPl} are not ${c}.)`
  };
}

const VALID_POOL = ["0", "1", "1/2", "3/4", "0.6", "0.05", "85%", "100%", "0%", "7/8", "2/5", "0.99", "1/3", "0.25", "5/6"];
const INVALID_POOL = ["1.2", "−0.3", "3/2", "150%", "−1/4", "5/4", "2", "110%", "−5%", "1.05", "7/6", "101%", "−1"];
function qValidProb(diff) {
  const cannot = Math.random() < 0.5;
  if (cannot) {
    const bad = pick(INVALID_POOL);
    const goods = shuffle(VALID_POOL).slice(0, 3);
    const { options, correctIndex } = finalize(bad, goods);
    return {
      prompt: "Which of these numbers can NOT be the probability of an event?",
      options, correctIndex, diagramData: { mode: "line", marker: null, label: "" },
      explanation: `${bad} is outside the range 0 to 1, and every probability must lie between 0 and 1.`
    };
  }
  const good = pick(VALID_POOL);
  const bads = shuffle(INVALID_POOL).slice(0, 3);
  const { options, correctIndex } = finalize(good, bads);
  return {
    prompt: "Which of these numbers COULD be the probability of an event?",
    options, correctIndex, diagramData: { mode: "line", marker: null, label: "" },
    explanation: `${good} lies between 0 and 1 (inclusive), so it can be a probability. The others fall below 0 or above 1.`
  };
}

const LINE_POINTS = [[0, 1], [1, 4], [1, 2], [3, 4], [1, 1], [1, 10], [9, 10], [1, 5], [4, 5]];
const TICK_POINTS = [[0, 1], [1, 4], [1, 2], [3, 4], [1, 1]];
function qLineRead(diff, name) {
  if (Math.random() < 0.5) {
    const [n, d] = pick(LINE_POINTS);
    const st = probStatus(n, d);
    const { options, correctIndex } = classifyOptions(n, d);
    return {
      prompt: "The arrow on the probability line shows P(E) for an event E. How would you describe E?",
      options, correctIndex, diagramData: { mode: "line", marker: n / d, label: "P(E)" },
      explanation: `The arrow is at ${fracText(n, d)}. ${n === 0 ? "0 means impossible." : n === d ? "1 means certain." : `That is between 0 and 1, so E is possible but not certain (${st.label.toLowerCase()}).`}`,
      meta: { fav: n, total: d }
    };
  }
  const [n, d] = pick(TICK_POINTS);
  const st = probStatus(n, d);
  const target = {
    impossible: "an impossible event", certain: "a certain event", even: "an event with an even chance",
    unlikely: "an unlikely event", likely: "a likely event"
  }[st.key];
  const { options, correctIndex } = probabilityOptions(n, d, ["dec", "pct"]);
  return {
    prompt: `${name} marks ${target} on the probability line. Which value is under the arrow?`,
    options, correctIndex, diagramData: { mode: "line", marker: n / d, label: "?" },
    explanation: `On the line from 0 to 1, ${target} sits at ${fracText(n, d)}.`,
    meta: { fav: n, total: d }
  };
}

const TRUE_MYTHS = [
  ["An impossible event has a probability of 0.", "An impossible event has no favourable outcomes, so P = 0."],
  ["A certain event has a probability of 1.", "Every outcome is favourable, so P = 1."],
  ["Every probability lies between 0 and 1, including 0 and 1.", "Probabilities can never be below 0 or above 1."],
  ["If P(A) = 1, then the opposite event has probability 0.", "P(not A) = 1 − P(A) = 0."],
  ["If P(A) = 0, then the opposite event is certain.", "P(not A) = 1 − 0 = 1."],
  ["An event with no favourable outcomes can never happen.", "No favourable outcomes means P = 0."],
  ["Taking every blue marble out of a bag makes drawing blue impossible.", "0 blue marbles means P(blue) = 0."],
  ["If every outcome in the sample space is favourable, the event is certain.", "All outcomes favourable means P = 1."],
  ["An event with probability 0.5 has an even chance of happening.", "0.5 is exactly halfway between impossible and certain."]
];
const FALSE_MYTHS = [
  ["A probability can be bigger than 1 if the event is very likely.", "No! 1 is the maximum, and it means certain."],
  ["An event with probability 0.99 is certain.", "Only P = 1 is certain. 0.99 is likely but not certain."],
  ["An unlikely event is the same as an impossible event.", "Unlikely events have P above 0, so they CAN happen."],
  ["A probability of −0.2 means an event is very unlikely.", "Probabilities can never be negative."],
  ["After 5 heads in a row, tails becomes impossible.", "Tails still has P = 1/2 on the next flip. It is never impossible."],
  ["A certain event has a probability of 0.", "A certain event has P = 1. It is impossible events that have P = 0."],
  ["P(A) and P(not A) always add up to 2.", "They always add up to 1."],
  ["Rolling a 6 on a fair die is impossible.", "6 is in the sample space, so P = 1/6, which is possible."],
  ["A bag with 5 red marbles and 1 blue marble makes red certain.", "The blue marble means red is likely but NOT certain."]
];
function qMyth() {
  const askTrue = Math.random() < 0.5;
  if (askTrue) {
    const t = pick(TRUE_MYTHS);
    const fs = shuffle(FALSE_MYTHS).slice(0, 3);
    const { options, correctIndex } = finalize(t[0], fs.map(x => x[0]));
    return { prompt: "Which statement about probability is TRUE?", options, correctIndex, diagramData: { mode: "line", marker: null, label: "" }, explanation: t[1] };
  }
  const f = pick(FALSE_MYTHS);
  const ts = shuffle(TRUE_MYTHS).slice(0, 3);
  const { options, correctIndex } = finalize(f[0], ts.map(x => x[0]));
  return { prompt: "Which statement about probability is FALSE?", options, correctIndex, diagramData: { mode: "line", marker: null, label: "" }, explanation: f[1] };
}

/* ---------------------------------------------------------------------- */
/* Public API                                                             */
/* ---------------------------------------------------------------------- */
function buildOne(world) {
  const name = pick(WESTERN_NAMES);
  const diff = world.difficulty;
  const archetype = pick(world.archetypes);
  const theme = pick(world.themes);
  const kind = chooseKind(diff);

  let q;
  switch (archetype) {
    case "classify": q = qClassify(makeScenario(theme, kind, name, diff)); break;
    case "prob_value": q = qProbValue(makeScenario(theme, kind, name, diff), diff); break;
    case "complement": q = qComplement(makeScenario(theme === "abstract" ? "die" : theme, kind, name, diff), diff); break;
    case "make_change": q = qMakeChange(name, theme === "candy" ? "candy" : "marble"); break;
    case "valid_prob": q = qValidProb(diff); break;
    case "line_read": q = qLineRead(diff, name); break;
    case "myth": q = qMyth(); break;
    default: q = qClassify(makeScenario("die", kind, name, diff));
  }
  return { world, name, archetype, ...q };
}

/**
 * Generate a procedural question for a given world.
 * `seen` (optional Set of prompts) keeps questions inside one run unique.
 */
export function makeQuestion(worldIndex = 0, seen = null) {
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  let q = buildOne(world);
  for (let tries = 0; seen && seen.has(q.prompt) && tries < 25; tries++) q = buildOne(world);
  if (seen) seen.add(q.prompt);
  return q;
}
