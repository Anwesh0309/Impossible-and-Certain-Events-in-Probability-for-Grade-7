import React, { useState, useMemo } from 'react';
import { MarbleBag, StatusBadge, DieFace } from '../ProbVisuals.jsx';
import { probMatches, fracText } from '../../mathData.js';
import { Mission, btnCyan, btnGhost, useCompleteOnce } from './common.jsx';

/* =========================================================================
   3-0  SCHOOL CANTEEN MYSTERY HAMPER CASE FILE
   ========================================================================= */
const CASE_BAG = { red: 5, blue: 4, green: 3 };
const CASE_ROWS = [
  { id: 'yellow', label: 'P(draw a YELLOW banana from the hamper)', fav: 0, total: 12, hint: 'How many yellow bananas are in this fruit hamper?', why: 'There are 0 yellow bananas in the hamper, so P = 0/12 = 0. IMPOSSIBLE!' },
  { id: 'any', label: 'P(draw a RED, BLUE or GREEN fruit)', fav: 12, total: 12, hint: 'Is every single one of the 12 fruits red, blue or green?', why: 'All 12 fruits are red, blue or green, so P = 12/12 = 1. CERTAIN!' },
  { id: 'notred', label: 'P(draw a fruit that is NOT red)', fav: 7, total: 12, hint: 'Count the blue plums and green pears: 4 + 3 = 7', why: '4 blue + 3 green = 7 non-red fruits out of 12. P = 7/12 ≈ 0.58 (58%). Possible!' }
];

export function MysteryBagCase({ onComplete }) {
  const [vals, setVals] = useState({ yellow: '', any: '', notred: '' });
  const [status, setStatus] = useState({}); // id -> 'ok' | 'bad'
  const [showHints, setShowHints] = useState(false);

  const allOk = CASE_ROWS.every(r => status[r.id] === 'ok');
  useCompleteOnce(allOk, onComplete);

  const check = () => {
    const next = {};
    CASE_ROWS.forEach(r => {
      next[r.id] = probMatches(vals[r.id], r.fav, r.total) ? 'ok' : 'bad';
    });
    setStatus(next);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">🧺 <strong className="text-amber-300">School Canteen Hamper:</strong> 5 Red Apples · 4 Blue Plums · 3 Green Pears</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 2, 3 & 4</span>
      </div>

      <Mission done={allOk} text="Crack all 3 hamper clues! Type answers as a fraction (7/12), decimal (0.58) or percent (58%)." doneText="Case closed! Great detective work on the school canteen hamper." />

      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] gap-3 w-full items-start">
        <div className="flex flex-col items-center gap-1.5 bg-[#13082b]/80 border border-purple-400/25 rounded-2xl p-3">
          <MarbleBag counts={CASE_BAG} size={24} minHeight={86} label="School Hamper Box" />
          <span className="text-[11px] font-extrabold text-slate-200 text-center">🍎 5 Red · 🫐 4 Blue · 🍐 3 Green = 12 Fruits Total</span>
        </div>

        <div className="flex flex-col gap-2">
          {CASE_ROWS.map(r => (
            <div key={r.id} className={`rounded-xl border-2 px-3 py-2 transition ${
              status[r.id] === 'ok' ? 'border-emerald-400/60 bg-emerald-500/10' : status[r.id] === 'bad' ? 'border-rose-400/60 bg-rose-500/10' : 'border-white/15 bg-[#14082c]'
            }`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-100 flex-1 min-w-[150px] leading-tight">🔎 {r.label}</span>
                <input
                  value={vals[r.id]}
                  disabled={status[r.id] === 'ok'}
                  onChange={e => { setVals(v => ({ ...v, [r.id]: e.target.value })); setStatus(s => ({ ...s, [r.id]: undefined })); }}
                  onKeyDown={e => e.key === 'Enter' && check()}
                  placeholder="e.g. 7/12 or 0.58"
                  inputMode="text"
                  className="w-28 bg-[#0c0520] border-2 border-purple-400/40 rounded-lg px-2 py-1 text-sm font-black text-white text-center outline-none focus:border-cyan-400"
                />
                {status[r.id] === 'ok' && <StatusBadge fav={r.fav} total={r.total} />}
              </div>
              {status[r.id] === 'ok' && <p className="text-[11px] font-extrabold text-emerald-200 mt-1 leading-tight">{r.why}</p>}
              {(status[r.id] === 'bad' || showHints) && status[r.id] !== 'ok' && (
                <p className="text-[11px] font-extrabold text-amber-200 mt-1 leading-tight">💡 {r.hint}</p>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2 mt-0.5">
            <button className={btnCyan} onClick={check} disabled={allOk}>Check Case Clues 🔍</button>
            <button className={btnGhost} onClick={() => setShowHints(h => !h)}>💡 {showHints ? 'Hide' : 'Show'} Hints</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3-1  BOARD GAME TWO-DICE TOURNAMENT
   ========================================================================= */
const ROUNDS = [
  { text: 'the two-dice sum is 13', pred: (a, b) => a + b === 13, tip: 'The max roll is 6 + 6 = 12, so no two-dice sum can equal 13! P = 0/36 = 0.' },
  { text: 'the two-dice sum is less than 13', pred: (a, b) => a + b < 13, tip: 'Since max sum is 12, EVERY one of the 36 outcomes is less than 13! P = 36/36 = 1.' },
  { text: 'the two-dice sum is 7', pred: (a, b) => a + b === 7, tip: 'Look along the diagonal: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1 (6 favourable out of 36).' }
];
const CELLS = [];
for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) CELLS.push([a, b]);

export function TwoDiceGrid({ onComplete }) {
  const [round, setRound] = useState(0);
  const [sel, setSel] = useState(() => new Set());
  const [result, setResult] = useState(null); // { ok, wrong:Set, missed:Set }
  const [solved, setSolved] = useState([]);

  const r = ROUNDS[round];
  const truth = useMemo(() => new Set(CELLS.map(([a, b], i) => (r.pred(a, b) ? i : -1)).filter(i => i >= 0)), [round]); // eslint-disable-line
  const allSolved = solved.length === ROUNDS.length;
  useCompleteOnce(allSolved, onComplete);
  const roundSolved = solved.includes(round);

  const toggle = i => {
    if (roundSolved) return;
    setResult(null);
    setSel(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const check = () => {
    const wrong = new Set([...sel].filter(i => !truth.has(i)));
    const missed = new Set([...truth].filter(i => !sel.has(i)));
    const ok = wrong.size === 0 && missed.size === 0;
    setResult({ ok, wrong, missed });
    if (ok) setSolved(s => (s.includes(round) ? s : [...s, round]));
  };

  const nextRound = () => {
    if (round < ROUNDS.length - 1) { setRound(x => x + 1); setSel(new Set()); setResult(null); }
  };

  const fav = truth.size;
  const cellStyle = { width: 'clamp(24px, 3.7vh, 34px)', height: 'clamp(24px, 3.7vh, 34px)' };

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">🎲 <strong className="text-amber-300">Board Game Championship:</strong> Rolling Two Dice for Moves</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 2, 3 & 4</span>
      </div>

      <Mission done={allSolved} text={`Round ${round + 1} of 3 · Target Event: ${r.text}`} doneText="Board Game Tournament Grid Mastered! You counted every 2-dice outcome perfectly." />

      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 w-full items-center">
        {/* grid */}
        <div className="flex flex-col items-center gap-1 justify-self-center">
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `auto repeat(6, ${cellStyle.width})` }}>
            <span />
            {[1, 2, 3, 4, 5, 6].map(n => <span key={`h${n}`} className="text-center text-[11px] font-black text-cyan-300">{n}</span>)}
            {[1, 2, 3, 4, 5, 6].map(a => (
              <React.Fragment key={`row${a}`}>
                <span className="text-[11px] font-black text-cyan-300 pr-1 flex items-center">{a}</span>
                {[1, 2, 3, 4, 5, 6].map(b => {
                  const i = (a - 1) * 6 + (b - 1);
                  const on = sel.has(i);
                  const isWrong = result && result.wrong.has(i);
                  const isMissed = result && result.missed.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggle(i)}
                      style={cellStyle}
                      className={`rounded-md text-[11px] font-black transition cursor-pointer border-2 ${
                        isWrong ? 'bg-rose-500/70 border-rose-200 text-white animate-shake'
                        : isMissed ? 'bg-amber-400/20 border-amber-300 text-amber-100 animate-soft-pulse'
                        : on ? 'bg-amber-300 border-amber-100 text-slate-900 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                        : 'bg-[#1e1342] border-cyan-400/30 text-slate-200 hover:border-cyan-300'
                      }`}
                    >
                      {a + b}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="flex flex-col gap-2 items-stretch">
          <div className="bg-[#14082c] border border-cyan-400/30 rounded-xl px-3 py-2">
            <p className="text-[11px] sm:text-xs font-extrabold text-slate-300">Target Event: <span className="text-white font-black">{r.text}</span></p>
            <p className="text-[10.5px] font-extrabold text-slate-400 mt-0.5 flex items-center gap-1"><DieFace value={1} size={14} /> Die 1 across top · Die 2 down side (36 total outcomes)</p>
            <p className="text-[11px] sm:text-xs font-extrabold text-slate-300 mt-0.5">Selected Squares: <span className="text-amber-300 font-black">{sel.size}</span> of 36</p>
          </div>

          {result && !result.ok && (
            <div className="text-[11px] sm:text-xs font-extrabold text-rose-200 leading-snug bg-rose-500/10 border border-rose-400/40 rounded-xl px-3 py-1.5">
              Not quite! {result.wrong.size > 0 && `${result.wrong.size} red square${result.wrong.size > 1 ? 's do' : ' does'}n't match. `}
              {result.missed.size > 0 && `${result.missed.size} glowing square${result.missed.size > 1 ? 's are' : ' is'} missing. `}
              💡 {r.tip}
            </div>
          )}

          {(roundSolved || (result && result.ok)) && (
            <div className="bg-emerald-500/10 border border-emerald-400/50 rounded-xl px-3 py-2 flex flex-col gap-1">
              <p className="font-display font-900 text-amber-300 text-sm sm:text-base">P = {fav}/36 {fav === 0 ? '= 0 (0%)' : fav === 36 ? '= 1 (100%)' : `= ${fracText(fav, 36)}`}</p>
              <StatusBadge fav={fav} total={36} />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <button className={btnCyan} onClick={check} disabled={roundSolved}>Check My Grid ✓</button>
            <button className={btnGhost} onClick={() => { setSel(new Set(CELLS.map((_, i) => i))); setResult(null); }} disabled={roundSolved}>Select All 36</button>
            <button className={btnGhost} onClick={() => { setSel(new Set()); setResult(null); }} disabled={roundSolved}>Clear All</button>
            {roundSolved && round < ROUNDS.length - 1 && <button className={btnCyan} onClick={nextRound}>Next Round →</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3-2  WEATHER & SPORTS OPPOSITE PARTNER CIPHER
   ========================================================================= */
const CIPHERS = [
  { story: 'Emma rolls a 7 on a standard game die.', a: [0, 1], not: [1, 1], pA: '0', hint: 'P(not A) = 1 − 0', why: 'P(not A) = 1 − 0 = 1. The opposite of an impossible event is 100% CERTAIN!' },
  { story: 'A coin flip lands on Heads or Tails at kickoff.', a: [1, 1], not: [0, 1], pA: '1', hint: 'P(not A) = 1 − 1', why: 'P(not A) = 1 − 1 = 0. The opposite of a certain event is IMPOSSIBLE!' },
  { story: 'School basketball player free-throw scoring rate.', a: [3, 8], not: [5, 8], pA: '3/8', hint: 'Think 8/8 − 3/8', why: 'P(Missing free-throw) = 1 − 3/8 = 5/8 (or 0.625 / 62.5%).' },
  { story: 'Weather channel forecast for rain tomorrow.', a: [35, 100], not: [65, 100], pA: '0.35', hint: 'P(No Rain) = 1 − 0.35', why: 'P(No Rain) = 1 − 0.35 = 0.65 (or 65%). Opposite partners total 1.0!' }
];

export function ComplementCipher({ onComplete }) {
  const [round, setRound] = useState(0);
  const [val, setVal] = useState('');
  const [state, setState] = useState(null); // null | 'bad' | 'ok'
  const [solved, setSolved] = useState([]);

  const c = CIPHERS[round];
  const allSolved = solved.length === CIPHERS.length;
  useCompleteOnce(allSolved, onComplete);
  const roundSolved = solved.includes(round);
  const pa = c.a[0] / c.a[1];

  const check = () => {
    if (probMatches(val, c.not[0], c.not[1])) {
      setState('ok');
      setSolved(s => (s.includes(round) ? s : [...s, round]));
    } else setState('bad');
  };
  const next = () => { setRound(r => r + 1); setVal(''); setState(null); };

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">🔐 <strong className="text-amber-300">Weather & Sports Complement Rule:</strong> P(A) + P(not A) = 1</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 7</span>
      </div>

      <Mission done={allSolved} text={`Cipher ${round + 1} of ${CIPHERS.length}: Calculate P(not A) using P(A) + P(not A) = 1.`} doneText="Cipher cracked! Real-world opposite partners always add up to 1." />

      <div className="w-full bg-[#0c0520] border-2 border-purple-400/40 rounded-2xl px-4 py-3 text-center">
        <p className="font-display font-900 text-white text-sm sm:text-base leading-snug">
          Real-World Scenario: {c.story} <span className="text-amber-300 font-black">P(Event A) = {c.pA}</span>
        </p>
        <p className="text-xs sm:text-sm font-extrabold text-cyan-200 mt-1">What is P(Not A)?</p>
      </div>

      {/* Unit bar split into A and not A */}
      <div className="w-full">
        <div className="flex w-full h-10 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
          {pa > 0 && (
            <div className="flex items-center justify-center bg-amber-400 text-slate-900 font-display font-900 text-xs sm:text-sm transition-all duration-500" style={{ width: `${pa * 100}%` }}>
              {pa >= 0.15 ? `A = ${c.pA}` : ''}
            </div>
          )}
          {pa < 1 && (
            <div className={`flex items-center justify-center font-display font-900 text-xs sm:text-sm transition-all duration-500 ${state === 'ok' || roundSolved ? 'bg-cyan-400 text-slate-900' : 'bg-[#2a1a5c] text-cyan-200'}`} style={{ width: `${(1 - pa) * 100}%` }}>
              not A = {state === 'ok' || roundSolved ? c.pA === '0.35' ? '0.65 (65%)' : fracText(c.not[0], c.not[1]) : '?'}
            </div>
          )}
        </div>
        <div className="flex justify-between text-[11px] font-extrabold text-slate-300 mt-1"><span>0</span><span>Whole Unit Bar = Total Probability = 1.0 (100%)</span><span>1</span></div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="font-display font-900 text-white text-sm sm:text-base">P(Not A) =</span>
        <input
          value={val}
          disabled={roundSolved}
          onChange={e => { setVal(e.target.value); setState(null); }}
          onKeyDown={e => e.key === 'Enter' && !roundSolved && check()}
          placeholder="e.g. 5/8 or 0.65 or 65%"
          className="w-48 bg-[#0c0520] border-2 border-purple-400/40 rounded-lg px-2 py-1.5 text-sm font-black text-white text-center outline-none focus:border-cyan-400"
        />
        <button className={btnCyan} onClick={check} disabled={roundSolved || !val.trim()}>Crack Cipher 🔐</button>
        {roundSolved && round < CIPHERS.length - 1 && <button className={btnCyan} onClick={next}>Next Cipher →</button>}
      </div>

      <div className={`w-full rounded-xl px-3 py-2 text-[11px] sm:text-xs font-extrabold leading-snug min-h-[38px] border flex items-center justify-between gap-2 ${
        state === 'ok' || roundSolved ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100'
        : state === 'bad' ? 'border-rose-400/50 bg-rose-500/10 text-rose-100' : 'border-white/10 text-slate-400 bg-[#14082c]'
      }`}>
        <span>
          {state === 'ok' || roundSolved ? `🎉 ${c.why}` : state === 'bad' ? `Not quite. 💡 ${c.hint}` : 'Remember: P(A) + P(not A) = 1 whole.'}
        </span>
        {(state === 'ok' || roundSolved) && <StatusBadge fav={c.not[0]} total={c.not[1]} />}
      </div>
    </div>
  );
}

