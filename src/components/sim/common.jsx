import React, { useEffect, useRef } from 'react';
import { Marble } from '../ProbVisuals.jsx';

/* Shared building blocks for the nine simulation activities */

export const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Fires onComplete exactly once, the first time `condition` becomes true */
export function useCompleteOnce(condition, onComplete) {
  const fired = useRef(false);
  useEffect(() => {
    if (condition && !fired.current) {
      fired.current = true;
      if (onComplete) onComplete();
    }
  }, [condition]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function Mission({ done, text, doneText }) {
  return (
    <div
      className={`w-full rounded-xl px-3 py-1.5 text-xs sm:text-sm font-extrabold flex items-center gap-2 border shrink-0 transition-colors ${
        done
          ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
          : 'bg-amber-400/10 border-amber-400/40 text-amber-200'
      }`}
    >
      <span className="text-base">{done ? '✅' : '🎯'}</span>
      <span className="leading-tight">{done ? doneText : text}</span>
    </div>
  );
}

export const btnCyan =
  'bg-cyan-500/25 hover:bg-cyan-500/40 border-2 border-cyan-400/60 text-cyan-100 font-display font-900 text-xs sm:text-sm px-3.5 py-1.5 rounded-full cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed';
export const btnGhost =
  'bg-white/10 hover:bg-white/20 border border-white/25 text-slate-100 font-display font-900 text-xs sm:text-sm px-3 py-1.5 rounded-full cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed';

/** Little tally of draws: [{ color, n }] */
export function Tally({ items, label = 'Draws so far' }) {
  const total = items.reduce((s, i) => s + i.n, 0);
  return (
    <div className="w-full flex items-center gap-2 flex-wrap bg-[#14082c] border border-white/15 rounded-xl px-3 py-1.5">
      <span className="text-[11px] sm:text-xs font-extrabold text-slate-300">{label}: {total}</span>
      {items.map(i => (
        <span key={i.color} className="inline-flex items-center gap-1 text-xs font-black text-white bg-white/10 rounded-full pl-1 pr-2 py-0.5">
          <Marble color={i.color} size={14} />
          {i.n}
        </span>
      ))}
    </div>
  );
}

export function Stepper({ color, name, value, onMinus, onPlus, disablePlus }) {
  return (
    <div className="flex items-center gap-1 bg-[#14082c] border border-white/15 rounded-xl px-1.5 py-1">
      <Marble color={color} size={16} />
      <button onClick={onMinus} disabled={value <= 0} aria-label={`Remove a ${name} marble`}
              className="w-6 h-6 rounded-full bg-rose-500/30 hover:bg-rose-500/55 border border-rose-400/60 text-white font-black text-sm leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition">−</button>
      <span className="w-5 text-center font-display font-900 text-white text-base">{value}</span>
      <button onClick={onPlus} disabled={disablePlus} aria-label={`Add a ${name} marble`}
              className="w-6 h-6 rounded-full bg-emerald-500/30 hover:bg-emerald-500/55 border border-emerald-400/60 text-white font-black text-sm leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition">+</button>
    </div>
  );
}
