import React, { useState, useRef, useEffect } from 'react';
import { Marble, MarbleBag, Wheel, ProbReadout, PALETTE } from '../ProbVisuals.jsx';
import { Mission, Tally, Stepper, btnCyan, btnGhost, useCompleteOnce, pickRandom } from './common.jsx';

const drawFrom = counts => {
  const bag = Object.entries(counts).flatMap(([c, n]) => Array(n).fill(c));
  return bag.length ? pickRandom(bag) : null;
};

/* =========================================================================
   1-0  SCHOOL CARNIVAL RAFFLE — MAKE IT IMPOSSIBLE
   ========================================================================= */
export function BagImpossible({ onComplete }) {
  const [counts, setCounts] = useState({ red: 4, blue: 3, green: 2 });
  const [tally, setTally] = useState({ red: 0, blue: 0, green: 0 });
  const [drawn, setDrawn] = useState(null);
  const [drawKey, setDrawKey] = useState(0);

  const total = counts.red + counts.blue + counts.green;
  const drawnTotal = tally.red + tally.blue + tally.green;
  const impossible = counts.blue === 0 && total > 0;
  const tested = impossible && drawnTotal >= 5;
  const MAX_TOTAL = 14;

  useCompleteOnce(tested, onComplete);

  const change = (color, delta) => {
    setCounts(c => ({ ...c, [color]: Math.max(0, c[color] + delta) }));
    setTally({ red: 0, blue: 0, green: 0 });
    setDrawn(null);
  };

  const draw = times => {
    if (!total) return;
    const add = { red: 0, blue: 0, green: 0 };
    let last = null;
    for (let i = 0; i < times; i++) { last = drawFrom(counts); add[last]++; }
    setTally(t => ({ red: t.red + add.red, blue: t.blue + add.blue, green: t.green + add.green }));
    setDrawn(last);
    setDrawKey(k => k + 1);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">🎟️ <strong className="text-amber-300">School Carnival Raffle:</strong> Drawing Counterfeit Blue Token</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 3 & 6</span>
      </div>

      <Mission
        done={tested}
        text={impossible ? `Blue tokens removed! Draw at least 5 times to confirm P(blue) = 0 (${Math.min(drawnTotal, 5)}/5).` : 'Goal: Make P(blue token) = 0 by removing every blue token from the raffle box.'}
        doneText="Mission complete! Zero blue tokens in the box means drawing blue is IMPOSSIBLE (P = 0)."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full items-start">
        {/* Left: Raffle Box & Steppers */}
        <div className="flex flex-col items-center gap-2 bg-[#13082b]/80 border border-purple-400/25 rounded-2xl p-3">
          <p className="text-xs font-extrabold text-slate-200 text-center">🎟️ Raffle Box Contents ({total} tokens total)</p>
          <MarbleBag counts={counts} size={24} favColors={['blue']} minHeight={75} label="Raffle Box" />
          <div className="flex gap-2 w-full items-center justify-center flex-wrap mt-1">
            <Stepper color="red" name="Red (Winner)" value={counts.red} onMinus={() => change('red', -1)} onPlus={() => change('red', 1)} disablePlus={total >= MAX_TOTAL} />
            <Stepper color="blue" name="Blue (Fake)" value={counts.blue} onMinus={() => change('blue', -1)} onPlus={() => change('blue', 1)} disablePlus={total >= MAX_TOTAL} />
            <Stepper color="green" name="Green (Bonus)" value={counts.green} onMinus={() => change('green', -1)} onPlus={() => change('green', 1)} disablePlus={total >= MAX_TOTAL} />
          </div>
        </div>

        {/* Right: Live Probability Readout & Draw Trials */}
        <div className="flex flex-col gap-2 items-center bg-[#13082b]/80 border border-cyan-400/25 rounded-2xl p-3">
          {total > 0
            ? <ProbReadout eventLabel="draw a BLUE token" symbol="P(blue)" fav={counts.blue} total={total} compact />
            : <div className="w-full text-center text-amber-200 font-extrabold text-sm bg-[#14082c] rounded-xl p-3 border border-amber-400/30">The raffle box is empty! Add some tokens.</div>}

          <div className="flex items-center gap-2 w-full justify-center">
            <button className={btnCyan} onClick={() => draw(1)} disabled={!total}>🎲 Draw 1 Token</button>
            <button className={btnCyan} onClick={() => draw(10)} disabled={!total}>⚡ Draw 10× Tokens</button>
            <button className={btnGhost} onClick={() => { setTally({ red: 0, blue: 0, green: 0 }); setDrawn(null); }}>Reset</button>
          </div>

          <div className="flex items-center gap-2 w-full min-h-[34px]">
            <Tally items={[{ color: 'red', n: tally.red }, { color: 'blue', n: tally.blue }, { color: 'green', n: tally.green }]} label="Carnival Draws" />
            {drawn && <span key={drawKey} className="animate-pop"><Marble color={drawn} size={30} glow /></span>}
          </div>

          {impossible && drawnTotal >= 1 && (
            <div className="w-full bg-emerald-500/15 border border-emerald-400/50 rounded-xl px-3 py-2 text-center text-emerald-200 text-xs font-extrabold leading-snug">
              ✨ Blue appeared <span className="text-amber-300 font-black">{tally.blue}</span> times in {drawnTotal} draws! Zero favourable outcomes means P = 0/total = 0.
            </div>
          )}
          {!impossible && tally.blue > 0 && (
            <div className="w-full bg-amber-500/15 border border-amber-400/50 rounded-xl px-3 py-2 text-center text-amber-200 text-xs font-extrabold leading-snug">
              ⚠️ Blue appeared {tally.blue}×! Because P(blue) &gt; 0, it is still possible. Tap − on Blue to make it 0!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   1-1  FESTIVAL LUCKY SPIN — MAKE IT CERTAIN
   ========================================================================= */
const WHEEL_COLORS = ['gold', 'purple', 'cyan'];

export function WheelCertain({ onComplete }) {
  const [wedges, setWedges] = useState(['gold', 'purple', 'cyan', 'gold', 'purple', 'cyan', 'gold', 'purple']);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [tally, setTally] = useState({ gold: 0, purple: 0, cyan: 0 });
  const [last, setLast] = useState(null);
  const timer = useRef(null);
  const rotRef = useRef(0);

  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  const n = wedges.length;
  const count = c => wedges.filter(w => w === c).length;
  const gold = count('gold');
  const spins = tally.gold + tally.purple + tally.cyan;
  const certain = gold === n;
  const tested = certain && spins >= 3;
  useCompleteOnce(tested, onComplete);

  const recolor = i => {
    if (spinning) return;
    setWedges(w => w.map((c, idx) => (idx === i ? WHEEL_COLORS[(WHEEL_COLORS.indexOf(c) + 1) % 3] : c)));
    setTally({ gold: 0, purple: 0, cyan: 0 });
    setLast(null);
  };

  const spin = () => {
    if (spinning) return;
    const k = Math.floor(Math.random() * n);
    const step = 360 / n;
    const center = (k + 0.5) * step;
    const cur = rotRef.current;
    const delta = 360 * 4 + ((((-center - cur) % 360) + 360) % 360);
    const next = cur + delta;
    rotRef.current = next;
    setRotation(next);
    setSpinning(true);
    timer.current = setTimeout(() => {
      setSpinning(false);
      setLast(wedges[k]);
      setTally(t => ({ ...t, [wedges[k]]: t[wedges[k]] + 1 }));
    }, 2700);
  };

  const spinMany = () => {
    if (spinning) return;
    const add = { gold: 0, purple: 0, cyan: 0 };
    for (let i = 0; i < 10; i++) add[wedges[Math.floor(Math.random() * n)]]++;
    setTally(t => ({ gold: t.gold + add.gold, purple: t.purple + add.purple, cyan: t.cyan + add.cyan }));
    setLast(null);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">🎡 <strong className="text-amber-300">Festival Wheel Game:</strong> Landing on Grand Gold Prize</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 4</span>
      </div>

      <Mission
        done={tested}
        text={certain ? `All 8 sections are GOLD! Spin at least 3 times to test P(gold) = 1 (${Math.min(spins, 3)}/3).` : 'Goal: Make P(gold prize) = 1 (100% Certain) by changing all 8 wheel sections to gold.'}
        doneText="Mission complete! Every outcome is gold, so landing on gold is 100% CERTAIN (P = 8/8 = 1)."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full items-center">
        {/* Left: Wheel */}
        <div className="flex flex-col items-center gap-1.5 bg-[#13082b]/80 border border-purple-400/25 rounded-2xl p-3">
          <div style={{ width: 'clamp(130px, 25vh, 190px)', height: 'clamp(135px, 26.3vh, 200px)' }}>
            <Wheel wedges={wedges} size="100%" rotation={rotation} transitionMs={spinning ? 2700 : 0} onWedgeClick={recolor} />
          </div>
          <p className="text-[11px] font-extrabold text-slate-300 text-center">Tap any slice to cycle: 🟡 gold → 🟣 purple → 🔷 cyan</p>
        </div>

        {/* Right: Readout & Spin buttons */}
        <div className="flex flex-col gap-2 items-center bg-[#13082b]/80 border border-cyan-400/25 rounded-2xl p-3">
          <ProbReadout eventLabel="wheel lands on GOLD PRIZE" symbol="P(gold)" fav={gold} total={n} compact />
          <div className="flex items-center gap-2 w-full justify-center">
            <button className={btnCyan} onClick={spin} disabled={spinning}>{spinning ? 'Spinning…' : '🎡 Spin Wheel'}</button>
            <button className={btnCyan} onClick={spinMany} disabled={spinning}>⚡ Spin 10× Fast</button>
            <button className={btnGhost} onClick={() => { setTally({ gold: 0, purple: 0, cyan: 0 }); setLast(null); }} disabled={spinning}>Reset</button>
          </div>
          <Tally label="Wheel Spins" items={[{ color: 'gold', n: tally.gold }, { color: 'purple', n: tally.purple }, { color: 'cyan', n: tally.cyan }]} />
          {certain ? (
            <div className="w-full bg-emerald-500/15 border border-emerald-400/50 rounded-xl px-3 py-1.5 text-center text-emerald-200 text-xs font-extrabold leading-snug">
              ✨ Bonus Fact: With all 8 slices gold, P(purple) = 0 and P(cyan) = 0. Purple and cyan are now IMPOSSIBLE!
            </div>
          ) : last ? (
            <p className="text-xs font-extrabold text-slate-200 text-center">Last spin landed on: <span className="capitalize text-amber-300 font-black">{last}</span>.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   1-2  FACTORY QUALITY CHECK — THE 99% TRAP
   ========================================================================= */
export function AlmostCertainTrap({ onComplete }) {
  const START = { red: 15, blue: 1 }; // red = working, blue = defect
  const [counts, setCounts] = useState(START);
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);
  const [autoRuns, setAutoRuns] = useState(0);
  const timer = useRef(null);
  const countsRef = useRef(counts);
  countsRef.current = counts;

  useEffect(() => () => timer.current && clearInterval(timer.current), []);

  const total = counts.red + counts.blue;
  const certain = counts.blue === 0 && total > 0;
  const blueSeen = history.filter(h => h === 'blue').length;
  useCompleteOnce(certain && autoRuns >= 1, onComplete);

  const autoDraw = () => {
    if (running || !total) return;
    setRunning(true);
    setHistory([]);
    let i = 0;
    timer.current = setInterval(() => {
      const c = drawFrom(countsRef.current);
      setHistory(h => [...h, c]);
      i++;
      if (i >= 25) {
        clearInterval(timer.current);
        setRunning(false);
        setAutoRuns(r => r + 1);
      }
    }, 70);
  };

  const removeMarble = color => {
    if (running) return;
    setCounts(c => ({ ...c, [color]: Math.max(0, c[color] - 1) }));
    setHistory([]);
  };

  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    setCounts(START);
    setHistory([]);
    setAutoRuns(0);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Real World Context Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#10072b] border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs font-extrabold text-cyan-200">
        <span className="flex items-center gap-1.5">📱 <strong className="text-amber-300">Smartphone Factory QC:</strong> 15 Working Phones vs 1 Defect</span>
        <span className="bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full text-[11px] border border-purple-400/30">Story Link: Slide 6 & 7</span>
      </div>

      <Mission
        done={certain && autoRuns >= 1}
        text={
          certain
            ? 'Defective phone removed! Run Auto-Inspect 25 to verify 100% certainty (P = 15/15 = 1).'
            : autoRuns === 0
              ? 'Step 1: Click Auto-Inspect 25 to test 25 phone shipments and see if the single defect appears.'
              : 'Step 2: Tap the blue defect phone in the batch to remove it and make working phones 100% CERTAIN!'
        }
        doneText="Mission complete! With zero defect phones in the batch, drawing a working phone is 100% CERTAIN."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full items-start">
        {/* Left: Batch Box */}
        <div className="flex flex-col items-center gap-2 bg-[#13082b]/80 border border-purple-400/25 rounded-2xl p-3">
          <MarbleBag counts={counts} size={22} minHeight={75} onMarbleClick={color => color === 'blue' && removeMarble('blue')} favColors={['red']} label="Factory Batch Box" />
          <p className="text-xs font-extrabold text-slate-200 text-center">
            {counts.blue > 0 ? '🔴 15 Working Phones · 🔵 1 Defect Phone (Tap blue to remove it!)' : '🔴 15 Working Phones · 0 Defect Phones'}
          </p>
        </div>

        {/* Right: Inspection log & probability readout */}
        <div className="flex flex-col gap-2 items-center bg-[#13082b]/80 border border-cyan-400/25 rounded-2xl p-3">
          <ProbReadout eventLabel="inspect a WORKING phone" symbol="P(working)" fav={counts.red} total={total} compact />
          <div className="flex items-center gap-2 w-full justify-center">
            <button className={btnCyan} onClick={autoDraw} disabled={running}>{running ? 'Inspecting…' : '⚡ Auto-Inspect 25'}</button>
            <button className={btnGhost} onClick={reset}>↺ Reset Batch</button>
          </div>

          <div className="w-full bg-[#14082c] border border-white/15 rounded-xl px-2.5 py-1.5 min-h-[42px]">
            <div className="flex flex-wrap gap-1 items-center">
              {history.length === 0 && <span className="text-[11px] font-extrabold text-slate-400">25 inspection test results will appear here…</span>}
              {history.map((h, i) => <Marble key={i} color={h} size={15} glow={h === 'blue'} title={h === 'blue' ? 'DEFECT PHONE!' : 'Working phone'} />)}
            </div>
          </div>

          {history.length === 25 && !certain && (
            <div className="w-full bg-amber-500/15 border border-amber-400/50 rounded-xl px-3 py-1.5 text-center text-amber-200 text-xs font-extrabold leading-snug">
              {blueSeen > 0
                ? `⚠️ Defect popped up ${blueSeen} time${blueSeen > 1 ? 's' : ''}! Any probability under 1.0 (even 93.75%) means defects CAN still happen!`
                : 'No defects in this batch of 25, but because P < 1, defects are still possible! Tap blue to remove it.'}
            </div>
          )}
          {history.length === 25 && certain && (
            <div className="w-full bg-emerald-500/15 border border-emerald-400/50 rounded-xl px-3 py-1.5 text-center text-emerald-200 text-xs font-extrabold leading-snug">
              ✨ 25 out of 25 working phones! When P = 1.0 (100%), success is guaranteed every time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

