import React, { useState, useMemo } from 'react';
import { Mission, btnCyan, useCompleteOnce, shuffled } from './common.jsx';

/* =========================================================================
   2-0  REAL-WORLD EVENT SORTER
   ========================================================================= */
const SORT_CARDS = [
  { id: 'a', emoji: '🎲', text: 'Roll a 9 on a standard six-sided game die', short: 'Roll a 9', bucket: 'impossible',
    why: 'A standard die only shows 1 to 6, so rolling a 9 has 0 favourable outcomes. P = 0.' },
  { id: 'b', emoji: '🏀', text: 'Drop a basketball on Earth and watch it fall downward', short: 'Basketball falls down', bucket: 'certain',
    why: 'Gravity acts on all objects. Falling downward always happens. P = 1.' },
  { id: 'c', emoji: '🪙', text: 'Flip a coin for kickoff at a soccer match and land on Heads', short: 'Soccer kickoff heads', bucket: 'possible',
    why: 'Heads is 1 of 2 equal outcomes. P = 1/2 = 0.5 (Even chance).' },
  { id: 'd', emoji: '📅', text: 'Pick a student whose birthday falls on February 30th', short: 'Birthday Feb 30', bucket: 'impossible',
    why: 'February never has 30 days, so this event has 0 possible outcomes. P = 0.' },
  { id: 'e', emoji: '🎲', text: 'Roll a number less than 7 on a standard game die', short: 'Roll less than 7', bucket: 'certain',
    why: 'All six faces (1, 2, 3, 4, 5, 6) are less than 7. P = 6/6 = 1.' },
  { id: 'f', emoji: '🍎', text: 'Draw a red apple from a grocery basket with 3 red & 2 green apples', short: 'Red apple (3 red + 2 green)', bucket: 'possible',
    why: '3 of the 5 apples are red. P = 3/5 = 0.60, between 0 and 1.' }
];

const BUCKETS = [
  { key: 'impossible', label: 'Impossible', sub: 'P = 0 (0%)', icon: '🚫', cls: 'border-rose-400/60 bg-rose-500/10', head: 'text-rose-300' },
  { key: 'possible', label: 'Possible', sub: '0 < P < 1', icon: '🤔', cls: 'border-amber-400/60 bg-amber-500/10', head: 'text-amber-300' },
  { key: 'certain', label: 'Certain', sub: 'P = 1 (100%)', icon: '✅', cls: 'border-emerald-400/60 bg-emerald-500/10', head: 'text-emerald-300' }
];

export function EventSorter({ onComplete }) {
  const cards = useMemo(() => shuffled(SORT_CARDS), []);
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [shakeId, setShakeId] = useState(null);

  const doneCount = Object.keys(placed).length;
  const allDone = doneCount === SORT_CARDS.length;
  useCompleteOnce(allDone, onComplete);

  const place = (cardId, bucketKey) => {
    const card = SORT_CARDS.find(c => c.id === cardId);
    if (!card || placed[cardId]) return;
    if (card.bucket === bucketKey) {
      setPlaced(p => ({ ...p, [cardId]: bucketKey }));
      setFeedback({ ok: true, text: `✅ Correct! ${card.why}` });
      setSelected(null);
    } else {
      setFeedback({ ok: false, text: `Not quite. ${card.why}` });
      setShakeId(cardId);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  const remaining = cards.filter(c => !placed[c.id]);

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">🌍 <strong className="text-amber-300">Real-World Everyday Life:</strong> Classifying Events</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 1, 3 & 4</span>
      </div>

      <Mission done={allDone} text={`Sort all 6 real-world event cards (${doneCount}/6). Tap a card, then tap its box.`} doneText="All 6 real-world events sorted! You mastered impossible, possible, and certain events." />

      {/* Card pool */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 w-full">
        {remaining.map(c => (
          <button
            key={c.id}
            draggable
            onDragStart={e => { e.dataTransfer.setData('text/plain', c.id); setSelected(c.id); }}
            onClick={() => setSelected(s => (s === c.id ? null : c.id))}
            className={`text-left rounded-xl px-2 py-1.5 border-2 text-[10.5px] sm:text-[11px] font-extrabold leading-tight flex items-center gap-1.5 cursor-grab transition ${
              selected === c.id ? 'bg-cyan-500/25 border-cyan-300 text-white shadow-[0_0_14px_rgba(56,189,248,0.6)] scale-[1.03]' : 'bg-[#14082c] border-white/20 text-slate-100 hover:border-cyan-400/60'
            } ${shakeId === c.id ? 'animate-shake' : ''}`}
          >
            <span className="text-base shrink-0">{c.emoji}</span>
            <span>{c.text}</span>
          </button>
        ))}
        {remaining.length === 0 && <div className="col-span-full text-center text-emerald-200 font-display font-900 text-sm py-2">🎉 Every real-world event is in its correct box!</div>}
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {BUCKETS.map(b => (
          <div
            key={b.key}
            onClick={() => selected && place(selected, b.key)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); place(e.dataTransfer.getData('text/plain') || selected, b.key); }}
            className={`rounded-xl border-2 border-dashed px-2 py-1.5 min-h-[80px] flex flex-col gap-1 transition ${b.cls} ${selected ? 'cursor-pointer hover:brightness-125 animate-soft-pulse' : ''}`}
          >
            <div className={`flex items-center justify-between font-display font-900 text-xs sm:text-sm ${b.head}`}>
              <span>{b.icon} {b.label}</span>
              <span className="text-[10px] text-slate-300">{b.sub}</span>
            </div>
            {SORT_CARDS.filter(c => placed[c.id] === b.key).map(c => (
              <span key={c.id} className="text-[10px] sm:text-[11px] font-extrabold text-white bg-white/15 rounded-md px-1.5 py-0.5 leading-tight animate-pop flex items-center gap-1">
                <span>{c.emoji}</span>
                <span>{c.short}</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className={`w-full rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-extrabold leading-snug min-h-[32px] border ${
        !feedback ? 'border-white/10 text-slate-400 bg-[#14082c]' : feedback.ok ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100' : 'border-rose-400/50 bg-rose-500/10 text-rose-100'
      }`}>
        {feedback ? feedback.text : 'Hint: Count favourable outcomes ÷ total outcomes to test if P = 0, P = 1, or between 0 and 1!'}
      </div>
    </div>
  );
}

/* =========================================================================
   2-1  REAL-LIFE PROBABILITY LINE PIN
   ========================================================================= */
const SLOTS = [
  { v: 0, t: '0', dec: '0', pct: '0%', word: 'Impossible' },
  { v: 1, t: '¼', dec: '0.25', pct: '25%', word: 'Unlikely' },
  { v: 2, t: '½', dec: '0.5', pct: '50%', word: 'Even chance' },
  { v: 3, t: '¾', dec: '0.75', pct: '75%', word: 'Likely' },
  { v: 4, t: '1', dec: '1', pct: '100%', word: 'Certain' }
];

const PIN_CARDS = [
  { id: 'p0', slot: 0, emoji: '🦈', text: 'Catching a ocean shark in a freshwater village pond', short: 'Shark in farm pond',
    why: 'Freshwater ponds contain 0 ocean sharks. P = 0/total = 0 (Impossible).' },
  { id: 'p1', slot: 1, emoji: '🎯', text: 'Guessing the right answer on a 4-choice multiple choice question', short: '4-choice test guess',
    why: '1 out of 4 options is correct. P = 1/4 = 0.25 = 25% (Unlikely).' },
  { id: 'p2', slot: 2, emoji: '🪙', text: 'Flipping a fair coin to decide who chooses the movie', short: 'Coin flip choice',
    why: '1 of 2 equal outcomes is favorable. P = 1/2 = 0.50 = 50% (Even Chance).' },
  { id: 'p3', slot: 3, emoji: '🍓', text: 'Picking a strawberry from a bowl with 3 strawberries and 1 blueberry', short: '3 strawberries + 1 blueberry',
    why: '3 of the 4 fruits are strawberries. P = 3/4 = 0.75 = 75% (Likely).' },
  { id: 'p4', slot: 4, emoji: '📅', text: 'A standard calendar week containing exactly 7 days', short: 'Week has 7 days',
    why: 'Every calendar week has 7 days. P = 7/7 = 1 = 100% (Certain).' }
];

export function LinePin({ onComplete }) {
  const cards = useMemo(() => shuffled(PIN_CARDS), []);
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({}); // slot -> cardId
  const [feedback, setFeedback] = useState(null);
  const [shakeSlot, setShakeSlot] = useState(null);

  const placedIds = Object.values(placed);
  const allDone = placedIds.length === PIN_CARDS.length;
  useCompleteOnce(allDone, onComplete);

  const tapSlot = slot => {
    if (!selected || placed[slot] !== undefined) return;
    const card = PIN_CARDS.find(c => c.id === selected);
    if (card.slot === slot) {
      setPlaced(p => ({ ...p, [slot]: card.id }));
      setFeedback({ ok: true, text: `✅ Pinned! ${card.why}` });
      setSelected(null);
    } else {
      setFeedback({ ok: false, text: `Not quite. ${card.why}` });
      setShakeSlot(slot);
      setTimeout(() => setShakeSlot(null), 500);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">📍 <strong className="text-amber-300">The Probability Scale:</strong> 0 to 1 Spectrum</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 5</span>
      </div>

      <Mission done={allDone} text={`Pin all 5 real-world events on the line (${placedIds.length}/5). Tap a card, then tap its spot.`} doneText="Perfect! Every real-world event is pinned at its exact spot on the probability line." />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
        {cards.filter(c => !placedIds.includes(c.id)).map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(s => (s === c.id ? null : c.id))}
            className={`text-left rounded-xl px-2 py-1.5 border-2 text-[10px] font-extrabold leading-tight cursor-pointer transition ${
              selected === c.id ? 'bg-cyan-500/25 border-cyan-300 text-white shadow-[0_0_14px_rgba(56,189,248,0.6)] scale-[1.04]' : 'bg-[#14082c] border-white/20 text-slate-100 hover:border-cyan-400/60'
            }`}
          >
            <span className="text-base mr-1">{c.emoji}</span>{c.text}
          </button>
        ))}
        {allDone && <div className="col-span-full text-center text-emerald-200 font-display font-900 text-sm py-2">🎉 The entire probability line is filled in!</div>}
      </div>

      {/* The probability line with 5 pin slots */}
      <div className="w-full bg-[#14082c] border border-cyan-400/30 rounded-2xl px-3 pt-2 pb-2">
        <div className="h-3.5 rounded-full border border-white/25 mb-1.5"
             style={{ background: 'linear-gradient(90deg,#f43f5e 0%,#fb923c 25%,#facc15 50%,#2dd4bf 75%,#4ade80 100%)' }} />
        <div className="grid grid-cols-5 gap-1.5">
          {SLOTS.map(s => {
            const card = PIN_CARDS.find(c => c.id === placed[s.v]);
            return (
              <button
                key={s.v}
                onClick={() => tapSlot(s.v)}
                className={`rounded-xl border-2 flex flex-col items-center px-1 py-1 min-h-[82px] transition ${
                  card ? 'border-emerald-400/60 bg-emerald-500/10 cursor-default'
                    : selected ? 'border-dashed border-cyan-300/80 bg-cyan-500/10 cursor-pointer hover:brightness-125 animate-soft-pulse' : 'border-dashed border-white/20 bg-white/5 cursor-default'
                } ${shakeSlot === s.v ? 'animate-shake' : ''}`}
              >
                <span className="font-display font-900 text-white text-base sm:text-lg leading-none">{s.t}</span>
                <span className="text-[10px] font-extrabold text-slate-300 leading-tight">{s.dec} · {s.pct}</span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-cyan-200 leading-tight">{s.word}</span>
                {card && <span className="mt-0.5 text-[9.5px] sm:text-[10px] font-extrabold text-white bg-white/15 rounded-md px-1 py-0.5 leading-tight animate-pop text-center">{card.emoji} {card.short}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`w-full rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-extrabold leading-snug min-h-[32px] border ${
        !feedback ? 'border-white/10 text-slate-400 bg-[#14082c]' : feedback.ok ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100' : 'border-rose-400/50 bg-rose-500/10 text-rose-100'
      }`}>
        {feedback ? feedback.text : 'Hint: Calculate P = favourable ÷ total, then match fraction (3/4), decimal (0.75) & percentage (75%).'}
      </div>
    </div>
  );
}

/* =========================================================================
   2-2  REAL-WORLD MYTH BUSTER — FACT OR FIB?
   ========================================================================= */
const MYTHS = [
  { text: 'An impossible event has a probability of 0 (P = 0).', fact: true, why: 'Correct! Zero favourable outcomes out of total outcomes means P = 0.' },
  { text: 'If it rained for 5 days in a row, it is IMPOSSIBLE for it to rain on the 6th day.', fact: false, why: 'False! Rain probability depends on cloud conditions, not past streak luck.' },
  { text: 'A probability can be 1.5 if an event is extremely likely.', fact: false, why: 'False! Probabilities NEVER go above 1.0 (100%). Certain events are exactly 1.' },
  { text: 'If P(Event) = 1, then that event happens every single time.', fact: true, why: 'Correct! P = 1 means every single outcome is favourable, so it is 100% certain.' },
  { text: 'An event with probability 0.99 (99%) is 100% certain to happen.', fact: false, why: 'False! 99% is very likely, but there is still a 1% chance (0.01) it will not happen!' },
  { text: 'Removing all defective items from a shipment makes getting a good item 100% certain.', fact: true, why: 'Correct! When only good items remain, P(good) = total/total = 1.' }
];

export function MythBuster({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null); // true = chose FACT
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  useCompleteOnce(finished, onComplete);

  const m = MYTHS[idx];
  const answered = answer !== null;
  const correct = answered && answer === m.fact;

  const choose = isFact => {
    if (answered) return;
    setAnswer(isFact);
    if (isFact === m.fact) setScore(s => s + 1);
  };
  const next = () => {
    if (idx < MYTHS.length - 1) { setIdx(i => i + 1); setAnswer(null); }
    else setFinished(true);
  };

  if (finished) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-4 text-center">
        <span className="text-5xl animate-bounce">🏅</span>
        <h4 className="font-display font-900 text-2xl text-emerald-300">MythBuster Score: {score} / {MYTHS.length}</h4>
        <p className="text-sm sm:text-base font-extrabold text-slate-100 max-w-md leading-snug">
          Remember: Impossible is P = 0, Certain is P = 1, and every probability stays between 0 and 1!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">💡 <strong className="text-amber-300">Everyday Misconception Check:</strong> Fact or Fib?</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 5 & 7</span>
      </div>

      <Mission done={false} text={`Bust the myths! Statement ${idx + 1} of ${MYTHS.length} · Current Score: ${score}`} doneText="" />
      
      <div className="w-full bg-[#0c0520] border-2 border-purple-400/40 rounded-2xl px-4 py-3 text-center">
        <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">Is this Real-World Statement Fact or Fib?</span>
        <p className="font-display font-900 text-white text-base sm:text-lg leading-snug mt-1">“{m.text}”</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {[true, false].map(isFact => {
          const chosen = answered && answer === isFact;
          const isRight = answered && m.fact === isFact;
          return (
            <button
              key={String(isFact)}
              disabled={answered}
              onClick={() => choose(isFact)}
              className={`py-3 rounded-2xl border-2 font-display font-900 text-base sm:text-lg cursor-pointer transition disabled:cursor-default ${
                !answered
                  ? (isFact ? 'bg-emerald-600/25 border-emerald-400/60 text-emerald-100 hover:bg-emerald-600/40' : 'bg-rose-600/25 border-rose-400/60 text-rose-100 hover:bg-rose-600/40')
                  : isRight ? 'bg-emerald-600 border-emerald-200 text-white shadow-[0_0_18px_rgba(52,211,153,0.6)]'
                  : chosen ? 'bg-rose-600 border-rose-200 text-white animate-shake' : 'opacity-35 border-white/10 text-slate-400'
              }`}
            >
              {isFact ? '✅ FACT' : '🚫 FIB'}
            </button>
          );
        })}
      </div>

      <div className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-extrabold leading-snug min-h-[46px] border flex items-center justify-between gap-3 ${
        !answered ? 'border-white/10 text-slate-400 bg-[#14082c]' : correct ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100' : 'border-rose-400/50 bg-rose-500/10 text-rose-100'
      }`}>
        <span>{answered ? `${correct ? '🎉 ' : '🤔 '}${m.why}` : 'Read the real-world probability claim carefully, then choose FACT or FIB.'}</span>
        {answered && <button className={btnCyan} onClick={next}>{idx < MYTHS.length - 1 ? 'Next Statement →' : 'Finish MythBuster ✓'}</button>}
      </div>
    </div>
  );
}

