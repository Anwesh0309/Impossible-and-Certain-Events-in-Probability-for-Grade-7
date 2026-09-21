import React, { useState, useEffect, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate, stopNarration, preloadSegments } from '../utils/audio.js';
import { getStoryNarration } from '../utils/narration.js';
import { STORY_SLIDES } from '../utils/lessonText.js';

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];

  // Keep the latest callback in a ref so re-renders of the parent never restart narration
  const slideChangeRef = useRef(onSlideChange);
  slideChangeRef.current = onSlideChange;

  useEffect(() => {
    if (slideChangeRef.current) slideChangeRef.current(slideIdx + 1, STORY_SLIDES.length);
  }, [slideIdx]);

  useEffect(() => {
    narrate(getStoryNarration(slideIdx), !muted);
    // warm up the next slide's narration while this one plays
    if (!muted && slideIdx < STORY_SLIDES.length - 1) preloadSegments(getStoryNarration(slideIdx + 1));
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Story Card with Maximum Visual Impact & Enlarged Image */}
      <div className="w-full max-w-6xl max-h-[90vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Left Column: Extra Large Image Illustration */}
        <div className="md:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 h-72 sm:h-[420px] md:h-[480px] lg:h-[510px] w-full bg-black/40 flex items-center justify-center shrink-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Column: Extra Large Typography & Callout Pills */}
        <div className="md:col-span-6 flex flex-col items-start text-left justify-center gap-4 overflow-y-auto max-h-full py-1">
          {/* Slide Title */}
          <h2 className="font-display font-900 text-3xl sm:text-4xl md:text-5xl text-amber-400 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-lg sm:text-2xl md:text-3xl leading-relaxed font-extrabold drop-shadow-sm">
            {slide.body}
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45] border-2 border-amber-400/60 rounded-2xl px-5 py-3 text-center text-amber-300 font-display font-900 text-base sm:text-xl md:text-2xl flex items-center justify-center gap-3 shadow-lg">
            <span className="shrink-0 text-2xl sm:text-3xl">✨</span>
            <span className="leading-snug">"{slide.quote}"</span>
            <span className="shrink-0 text-2xl sm:text-3xl">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-3.5 w-full mt-0.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shrink-0">
              🦁
            </div>
            <div className="bg-white text-[#0c031d] rounded-2xl px-6 py-3 font-display font-900 text-base sm:text-xl md:text-2xl shadow-xl flex-1 text-left leading-snug">
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-5xl flex items-center justify-between mt-2.5 z-20 shrink-0">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/30 text-white font-display font-900 text-lg sm:text-2xl px-8 sm:px-10 py-3 sm:py-3.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xl hover:scale-105"
        >
          ← Back
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-3">
          {STORY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === slideIdx
                  ? 'w-4.5 h-4.5 bg-amber-400 shadow-[0_0_18px_rgba(250,204,21,0.9)]'
                  : 'w-3.5 h-3.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold text-lg sm:text-2xl px-9 sm:px-11 py-3 sm:py-3.5 font-900 flex items-center gap-2 shadow-[0_0_35px_rgba(250,204,21,0.85)] hover:scale-105"
        >
          <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
