import React from 'react';
import { STATUS, probStatus, statusCaption } from '../mathData.js';

/* =========================================================================
   SHARED PROBABILITY VISUALS
   Marble, MarbleBag, DieFace, Wheel, ProbMeter, StatusBadge, ProbReadout
   ========================================================================= */

export const PALETTE = {
  red:    { a: '#fecaca', b: '#ef4444', c: '#7f1d1d', emoji: '🔴' },
  blue:   { a: '#bfdbfe', b: '#3b82f6', c: '#1e3a8a', emoji: '🔵' },
  green:  { a: '#bbf7d0', b: '#22c55e', c: '#14532d', emoji: '🟢' },
  yellow: { a: '#fef9c3', b: '#facc15', c: '#854d0e', emoji: '🟡' },
  purple: { a: '#e9d5ff', b: '#a855f7', c: '#581c87', emoji: '🟣' },
  orange: { a: '#fed7aa', b: '#f97316', c: '#7c2d12', emoji: '🟠' },
  gold:   { a: '#fef9c3', b: '#facc15', c: '#854d0e', emoji: '🟡' },
  cyan:   { a: '#cffafe', b: '#22d3ee', c: '#155e75', emoji: '🔷' }
};

/** Format a probability as the fraction, decimal and percent the learner sees */
export function probParts(fav, total) {
  const v = total > 0 ? fav / total : 0;
  const dec = Number(v.toFixed(2));
  return {
    value: v,
    frac: `${fav}/${total}`,
    dec: String(dec),
    pct: `${Math.round(v * 100)}%`,
    exact: fav === 0 ? '0' : fav === total ? '1' : null
  };
}

/* ------------------------------------------------------------------ */
/* Marble                                                              */
/* ------------------------------------------------------------------ */
export function Marble({ color = 'red', size = 26, dim = false, glow = false, onClick, title, className = '' }) {
  const c = PALETTE[color] || PALETTE.red;
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      onClick={onClick}
      title={title}
      className={`inline-block rounded-full shrink-0 transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-125' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 28%, ${c.a} 0%, ${c.b} 45%, ${c.c} 100%)`,
        boxShadow: glow
          ? `0 0 14px 3px ${c.b}, inset -3px -4px 6px rgba(0,0,0,.35)`
          : 'inset -3px -4px 6px rgba(0,0,0,.35), 0 2px 5px rgba(0,0,0,.45)',
        opacity: dim ? 0.28 : 1,
        border: 'none',
        padding: 0
      }}
    />
  );
}

/** A cloth bag full of marbles. counts = { red: 4, blue: 3 } */
export function MarbleBag({ counts, size = 26, favColors = null, onMarbleClick, minHeight = 96, label }) {
  const marbles = [];
  Object.entries(counts).forEach(([color, n]) => {
    for (let i = 0; i < n; i++) marbles.push({ color, key: `${color}-${i}` });
  });
  return (
    <div className="relative flex flex-col items-center w-full">
      {/* bag knot */}
      <div className="flex items-end gap-1 -mb-1 z-10">
        <div className="w-4 h-3 bg-amber-700 rounded-t-full rotate-[-20deg]" />
        <div className="w-5 h-4 bg-amber-600 rounded-md border border-amber-900/50" />
        <div className="w-4 h-3 bg-amber-700 rounded-t-full rotate-[20deg]" />
      </div>
      <div
        className="w-full max-w-[300px] rounded-[28px] rounded-t-[14px] border-[3px] border-amber-900/70 px-3 py-3 flex flex-wrap items-center justify-center content-center gap-1.5 shadow-[inset_0_-10px_22px_rgba(0,0,0,0.45)]"
        style={{ background: 'linear-gradient(180deg,#a16207 0%,#854d0e 55%,#5b3410 100%)', minHeight }}
      >
        {marbles.length === 0 && (
          <span className="text-amber-200/80 font-display text-sm">Empty bag</span>
        )}
        {marbles.map(m => (
          <Marble
            key={m.key}
            color={m.color}
            size={size}
            dim={favColors ? !favColors.includes(m.color) : false}
            glow={favColors ? favColors.includes(m.color) : false}
            onClick={onMarbleClick ? () => onMarbleClick(m.color) : undefined}
            title={onMarbleClick ? `Tap to remove this ${m.color} marble` : undefined}
          />
        ))}
      </div>
      {label && <span className="text-xs font-extrabold text-amber-200 mt-1">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Die face                                                            */
/* ------------------------------------------------------------------ */
const PIPS = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]
};

export function DieFace({ value, size = 44, state = 'normal', label }) {
  const pips = PIPS[value] || [];
  const isFav = state === 'fav';
  const dim = state === 'dim';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className="shrink-0 transition-all duration-300"
      style={{
        opacity: dim ? 0.3 : 1,
        filter: isFav ? 'drop-shadow(0 0 8px rgba(250,204,21,0.95))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
      }}
    >
      <defs>
        <linearGradient id={`dieg-${value}-${state}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isFav ? '#fef9c3' : '#ffffff'} />
          <stop offset="1" stopColor={isFav ? '#fde047' : '#cbd5e1'} />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="54" height="54" rx="12" fill={`url(#dieg-${value}-${state})`} stroke={isFav ? '#eab308' : '#64748b'} strokeWidth="2.5" />
      {value === 0 || label ? (
        <text x="30" y="40" textAnchor="middle" fontSize="28" fontWeight="900" fill="#1e1b4b" fontFamily="Fredoka One, Nunito, sans-serif">{label ?? value}</text>
      ) : (
        pips.map(([cx, cy], i) => (
          <circle key={i} cx={14 + cx * 16} cy={14 + cy * 16} r="5.2" fill="#1e1b4b" />
        ))
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Prize wheel                                                         */
/* ------------------------------------------------------------------ */
function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function Wheel({
  wedges,
  size = 200,
  rotation = 0,
  transitionMs = 0,
  onWedgeClick,
  favColors = null,
  showPointer = true
}) {
  const n = wedges.length;
  const step = 360 / n;
  return (
    <svg width={size} height={size} viewBox="0 0 200 210" className="shrink-0 drop-shadow-[0_0_20px_rgba(168,85,247,0.55)]">
      <g
        style={{
          transformOrigin: '100px 110px',
          transform: `rotate(${rotation}deg)`,
          transition: transitionMs ? `transform ${transitionMs}ms cubic-bezier(0.15, 0.7, 0.15, 1)` : 'none'
        }}
      >
        <circle cx="100" cy="110" r="96" fill="#1e1b4b" stroke="#facc15" strokeWidth="4" />
        {wedges.map((color, i) => {
          const c = PALETTE[color] || PALETTE.red;
          const [x1, y1] = polar(100, 110, 88, i * step);
          const [x2, y2] = polar(100, 110, 88, (i + 1) * step);
          const [tx, ty] = polar(100, 110, 60, (i + 0.5) * step);
          const dim = favColors ? !favColors.includes(color) : false;
          return (
            <g key={i} onClick={onWedgeClick ? () => onWedgeClick(i) : undefined} style={{ cursor: onWedgeClick ? 'pointer' : 'default' }}>
              <path
                d={`M100,110 L${x1},${y1} A88,88 0 ${step > 180 ? 1 : 0} 1 ${x2},${y2} Z`}
                fill={c.b}
                stroke="#0c0424"
                strokeWidth="2.5"
                opacity={dim ? 0.3 : 1}
              />
              <text x={tx} y={ty + 5} textAnchor="middle" fontSize="15" fontWeight="900" fill="#0c0424" opacity={dim ? 0.3 : 0.85}
                    fontFamily="Fredoka One, Nunito, sans-serif"
                    transform={`rotate(${(i + 0.5) * step}, ${tx}, ${ty})`}>
                {n <= 8 ? i + 1 : ''}
              </text>
            </g>
          );
        })}
        <circle cx="100" cy="110" r="13" fill="#facc15" stroke="#854d0e" strokeWidth="3" />
        <circle cx="100" cy="110" r="4" fill="#854d0e" />
      </g>
      {showPointer && (
        <polygon points="100,26 88,2 112,2" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Probability meter + status badge + readout                          */
/* ------------------------------------------------------------------ */
export function ProbMeter({ p = 0, showEnds = true, height = 12 }) {
  const clamped = Math.max(0, Math.min(1, p));
  return (
    <div className="w-full select-none">
      <div className="relative w-full" style={{ paddingTop: 20, paddingBottom: 2 }}>
        <div
          className="w-full rounded-full border border-white/25"
          style={{
            height,
            background: 'linear-gradient(90deg,#f43f5e 0%,#fb923c 25%,#facc15 50%,#2dd4bf 75%,#4ade80 100%)'
          }}
        />
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <span
            key={t}
            className="absolute bg-white/60"
            style={{ left: `${t * 100}%`, top: 20, width: 2, height: height + 4, transform: 'translateX(-1px)' }}
          />
        ))}
        {/* marker */}
        <div
          className="absolute transition-all duration-500 ease-out flex flex-col items-center"
          style={{ left: `${clamped * 100}%`, top: 0, transform: 'translateX(-50%)' }}
        >
          <span className="text-[11px] leading-none font-display font-900 text-amber-300 bg-[#0c0424] px-1.5 py-0.5 rounded-md border border-amber-400/60">
            {Number(clamped.toFixed(2))}
          </span>
          <span className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
        </div>
      </div>
      {showEnds && (
        <div className="flex justify-between text-[11px] sm:text-xs font-extrabold text-slate-300 mt-0.5">
          <span><span className="text-rose-300">0</span> Impossible</span>
          <span>½ Even chance</span>
          <span>Certain <span className="text-emerald-300">1</span></span>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ fav, total, className = '' }) {
  const st = probStatus(fav, total);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-display font-900 text-xs sm:text-sm border-2 ${st.bg} ${st.border} ${st.text} ${className}`}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: st.color, boxShadow: `0 0 8px ${st.color}` }} />
      {st.label}
    </span>
  );
}

/** Standard readout: P = fav/total = decimal = percent, meter, badge, caption */
export function ProbReadout({ eventLabel, symbol = 'P(E)', fav, total, compact = false }) {
  const parts = probParts(fav, total);
  const pLine = (
    <p className="font-display font-900 text-amber-300 text-base sm:text-lg leading-tight">
      {symbol} = {parts.frac}
      {parts.exact !== null && <> = {parts.exact}</>}
      {parts.exact === null && <span className="text-slate-300"> ≈ {parts.dec}</span>}
      <span className="text-cyan-300"> = {parts.pct}</span>
    </p>
  );
  return (
    <div className="w-full flex flex-col gap-1 bg-[#14082c] border border-cyan-400/30 rounded-xl px-3 py-2">
      {eventLabel && (
        <p className="text-[11px] sm:text-xs font-extrabold text-slate-300 leading-tight">
          Event: <span className="text-white font-black">{eventLabel}</span>
        </p>
      )}
      {compact ? (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {pLine}
          <StatusBadge fav={fav} total={total} className="!py-0.5" />
        </div>
      ) : pLine}
      <ProbMeter p={parts.value} />
      {!compact && (
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge fav={fav} total={total} />
          <span className="text-[11px] sm:text-xs font-extrabold text-slate-200 leading-tight flex-1 min-w-[140px]">
            {statusCaption(fav, total)}
          </span>
        </div>
      )}
    </div>
  );
}

export { STATUS };
