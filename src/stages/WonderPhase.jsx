import React, { useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate } from '../utils/audio.js';
import { wonderNarration } from '../utils/narration.js';
import { WONDER } from '../utils/lessonText.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    narrate(wonderNarration(), !muted);
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-3xl max-h-[92vh] glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto p-6 sm:p-9 overflow-hidden">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder mb-3 shrink-0" />

        <div className="flex items-center gap-2.5 mb-3 shrink-0">
          <span className="text-3xl sm:text-4xl">🔍</span>
          <span className="text-purple-300 font-display font-900 text-sm sm:text-lg tracking-wider uppercase">
            Phase 1: Wonder &amp; Curiosity
          </span>
        </div>

        <h2 className="text-main-heading text-purple-200 mb-4 max-w-2xl text-3xl sm:text-5xl font-900 leading-tight shrink-0">
          {WONDER.title}
        </h2>

        {/* Feature Stat Box */}
        <div className="w-full bg-[#1e143c]/90 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-8 mb-5 flex flex-col items-center shadow-2xl shrink-0">
          <div className="text-number text-amber-300 text-5xl sm:text-7xl mb-2 font-900 drop-shadow-md">
            {WONDER.stat}
          </div>
          <p className="text-slate-100 text-lg sm:text-2xl leading-relaxed font-extrabold max-w-2xl">
            {WONDER.paragraph}
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-4 bg-[#14082c]/90 border-2 border-purple-500/40 rounded-full px-7 py-3 mb-6 shadow-xl shrink-0">
          <div className="w-11 h-11 rounded-full bg-purple-500/40 text-purple-200 flex items-center justify-center font-bold text-2xl shrink-0">
            🤖
          </div>
          <p className="text-slate-200 text-base sm:text-xl font-extrabold">
            {WONDER.question}
          </p>
        </div>

        <button onClick={onNext} className="btn-gold text-lg sm:text-2xl px-10 py-4 flex items-center gap-3 shrink-0 shadow-2xl hover:scale-105">
          <span>Explore the Story</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
