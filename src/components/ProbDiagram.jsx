import React from 'react';
import { DieFace, MarbleBag, Wheel } from './ProbVisuals.jsx';

/* =========================================================================
   PROBABILITY DIAGRAM — the picture shown above each practice question.
   The SAMPLE SPACE is always visible; the favourable outcomes light up
   only after the learner answers (`revealed`), so the picture teaches
   without giving the answer away.
   ========================================================================= */

function ProbLine({ marker, label }) {
  const ticks = [
    { v: 0, t: '0', s: 'Impossible' },
    { v: 0.25, t: '¼', s: 'Unlikely' },
    { v: 0.5, t: '½', s: 'Even chance' },
    { v: 0.75, t: '¾', s: 'Likely' },
    { v: 1, t: '1', s: 'Certain' }
  ];
  return (
    <div className="pt-7 pb-1" style={{ width: 460, maxWidth: '92vw', padding: '26px 34px 0' }}>
      <div className="relative w-full h-3.5 rounded-full border border-white/30"
           style={{ background: 'linear-gradient(90deg,#f43f5e 0%,#fb923c 25%,#facc15 50%,#2dd4bf 75%,#4ade80 100%)' }}>
        {ticks.map(t => (
          <div key={t.v} className="absolute top-0 flex flex-col items-center" style={{ left: `${t.v * 100}%`, transform: 'translateX(-50%)' }}>
            <span className="w-0.5 h-5 bg-white/70" />
            <span className="font-display font-900 text-white text-sm mt-0.5">{t.t}</span>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-300 whitespace-nowrap">{t.s}</span>
          </div>
        ))}
        {marker != null && (
          <div className="absolute flex flex-col items-center" style={{ left: `${marker * 100}%`, top: -30, transform: 'translateX(-50%)' }}>
            <span className="text-xs font-display font-900 text-slate-950 bg-amber-300 px-2 py-0.5 rounded-md shadow-[0_0_12px_rgba(250,204,21,0.8)]">{label || 'P(E)'}</span>
            <span className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[10px] border-l-transparent border-r-transparent border-t-amber-300" />
          </div>
        )}
      </div>
      <div className="h-14" />
    </div>
  );
}

function Chip({ children, state }) {
  const cls =
    state === 'fav'
      ? 'bg-amber-300 text-slate-950 border-amber-100 shadow-[0_0_14px_rgba(250,204,21,0.85)] scale-110'
      : state === 'dim'
        ? 'bg-white/5 text-slate-500 border-white/10'
        : 'bg-[#1e1342] text-white border-cyan-400/50';
  return (
    <span className={`px-2.5 py-1 rounded-lg border-2 font-display font-900 text-sm sm:text-base transition-all duration-300 ${cls}`}>
      {children}
    </span>
  );
}

export function ProbDiagram({ diagramData, size = 150, revealed = false }) {
  if (!diagramData) return null;
  const d = diagramData;

  if (d.mode === 'die') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {d.faces.map(f => (
            <DieFace key={f} value={f} size={Math.round(size * 0.32)} state={revealed ? (d.favFaces.includes(f) ? 'fav' : 'dim') : 'normal'} />
          ))}
        </div>
        <span className="text-xs font-extrabold text-slate-300">Sample space of one die: 1, 2, 3, 4, 5, 6</span>
      </div>
    );
  }

  if (d.mode === 'bag') {
    return (
      <MarbleBag
        counts={d.counts}
        size={Math.max(20, Math.round(size * 0.17))}
        favColors={revealed ? d.favColors : null}
        minHeight={Math.round(size * 0.5)}
      />
    );
  }

  if (d.mode === 'spinner') {
    return (
      <Wheel
        wedges={d.wedges}
        size={Math.round(size * 0.8)}
        favColors={revealed ? d.favColors : null}
      />
    );
  }

  if (d.mode === 'coins') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-md">
          {d.outcomes.map(o => (
            <Chip key={o} state={revealed ? (d.favOutcomes.includes(o) ? 'fav' : 'dim') : 'normal'}>
              {o.split('').join(' ')}
            </Chip>
          ))}
        </div>
        <span className="text-xs font-extrabold text-slate-300">
          Sample space ({d.outcomes.length} outcomes) · H = heads, T = tails
        </span>
      </div>
    );
  }

  if (d.mode === 'tokens') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xl">
          {d.items.map((it, i) => (
            <Chip key={i} state={revealed ? (d.favIdx.includes(i) ? 'fav' : 'dim') : 'normal'}>{it}</Chip>
          ))}
        </div>
        <span className="text-xs font-extrabold text-slate-300">Sample space: {d.items.length} equally likely outcomes</span>
      </div>
    );
  }

  if (d.mode === 'cards') {
    const suits = [['♠', '#0f172a'], ['♥', '#dc2626'], ['♦', '#dc2626'], ['♣', '#0f172a']];
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end justify-center -space-x-3">
          {suits.map(([s, c], i) => (
            <div key={s} className="w-12 h-[68px] rounded-lg bg-white border-2 border-slate-300 shadow-lg flex items-center justify-center text-3xl font-black"
                 style={{ color: c, transform: `rotate(${(i - 1.5) * 9}deg) translateY(${Math.abs(i - 1.5) * 3}px)` }}>
              {s}
            </div>
          ))}
        </div>
        <span className="text-xs font-extrabold text-slate-300">Standard deck: 52 cards · 26 red · 26 black · 4 suits of 13</span>
      </div>
    );
  }

  if (d.mode === 'twodice') {
    return (
      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center gap-2">
          <DieFace value={3} size={Math.round(size * 0.3)} />
          <span className="font-display font-900 text-2xl text-amber-300">+</span>
          <DieFace value={4} size={Math.round(size * 0.3)} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="grid grid-cols-6 gap-[3px]">
            {d.grid.map((fav, i) => (
              <span key={i} className="w-3.5 h-3.5 rounded-[4px] transition-all duration-300"
                    style={{
                      background: revealed ? (fav ? '#facc15' : 'rgba(255,255,255,0.08)') : '#38bdf8',
                      boxShadow: revealed && fav ? '0 0 8px rgba(250,204,21,0.9)' : 'none'
                    }} />
            ))}
          </div>
          <span className="text-xs font-extrabold text-slate-300">36 outcomes</span>
        </div>
      </div>
    );
  }

  if (d.mode === 'line') {
    return <ProbLine marker={d.marker} label={d.label} />;
  }

  return null;
}
