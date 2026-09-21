import React, { useState, useEffect, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { simulateActivityIntro, simulateActivityDone } from '../utils/narration.js';
import { SIM_STATIONS, SIM_ACTIVITY_TEXT } from '../utils/lessonText.js';
import { BagImpossible, WheelCertain, AlmostCertainTrap } from '../components/sim/Station1.jsx';
import { EventSorter, LinePin, MythBuster } from '../components/sim/Station2.jsx';
import { MysteryBagCase, TwoDiceGrid, ComplementCipher } from '../components/sim/Station3.jsx';

/* 3 stations x 3 activities. Station 1 builds the idea, Station 2 lets the
   learner try it themselves, Station 3 solves like a detective. */
const ACTIVITY_COMPONENTS = {
  1: [BagImpossible, WheelCertain, AlmostCertainTrap],
  2: [EventSorter, LinePin, MythBuster],
  3: [MysteryBagCase, TwoDiceGrid, ComplementCipher]
};

export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);
  const [doneMap, setDoneMap] = useState({});
  const doneRef = useRef({});

  const key = `${station}-${actIdx}`;
  const currentActivity = SIM_ACTIVITY_TEXT[key];
  const ActivityComponent = ACTIVITY_COMPONENTS[station][actIdx];

  // Narrate the activity instructions whenever the activity changes
  useEffect(() => {
    narrate(simulateActivityIntro(station, actIdx), !muted);
    return () => stopNarration();
  }, [station, actIdx, muted]);

  const handleComplete = () => {
    if (doneRef.current[key]) return;
    doneRef.current[key] = true;
    setDoneMap(d => ({ ...d, [key]: true }));
    narrate(simulateActivityDone(station, actIdx), !muted);
  };

  const stationDone = s => [0, 1, 2].every(a => doneMap[`${s}-${a}`]);

  const nextActivity = () => {
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else if (station < 3) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(2);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Simulation Stations Glass Card Container */}
      <div className="sim-card w-full max-w-6xl max-h-[92vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="w-24 h-2 bg-cyan-400 rounded-full mb-2 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <h2 className="sim-title font-display font-900 text-2xl sm:text-3xl text-white flex items-center gap-3 mb-2.5 shrink-0">
          <span className="text-3xl sm:text-4xl">🧪</span>
          <span>Simulation Stations</span>
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 shrink-0">
            <div className="flex flex-col gap-3">
              {SIM_STATIONS.map(st => (
                <button
                  key={st.id}
                  onClick={() => {
                    setStation(st.id);
                    setActIdx(0);
                  }}
                  className={`p-3.5 sm:p-4.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    station === st.id
                      ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.02]'
                      : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${
                      station === st.id ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                    }`}>
                      {st.icon}
                    </div>
                    <div>
                      <p className="font-display font-900 text-base sm:text-xl leading-tight">{st.name}</p>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-300 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                  <span className="text-lg">{stationDone(st.id) ? '✅' : '🔓'}</span>
                </button>
              ))}
            </div>

            {/* Bottom Left CTA Button */}
            <button
              onClick={onNext}
              className="btn-gold font-display font-900 text-base sm:text-xl py-3.5 px-6 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition mt-1 w-full flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase!</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Simulation Box */}
          <div className="md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 justify-between">
              {/* Header Row */}
              <div className="sim-head flex items-center justify-between gap-3 border-b border-white/15 pb-2.5 mb-2.5 shrink-0">
                <h3 className="font-display font-900 text-xl sm:text-2xl text-cyan-300 flex items-center gap-2.5 leading-tight">
                  <span className="text-2xl sm:text-3xl">{currentActivity.icon}</span>
                  <span>{currentActivity.title}</span>
                </h3>
                <span className="font-display font-900 text-xs sm:text-sm text-slate-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/15 whitespace-nowrap">
                  {doneMap[key] ? '✓ Done · ' : ''}Activity {actIdx + 1} of 3
                </span>
              </div>

              {/* Activity Description */}
              <p className="sim-desc text-slate-100 text-sm sm:text-lg leading-snug font-extrabold mb-2.5 shrink-0">
                {currentActivity.desc}
              </p>

              {/* Interactive Activity Panel (remounts for every activity) */}
              <div className="flex flex-col items-center gap-2.5 bg-[#1e1342]/95 border-2 border-cyan-400/40 sim-panel rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto thin-scroll">
                <ActivityComponent key={key} onComplete={handleComplete} />
              </div>
            </div>

            {/* Bottom Activity Step Buttons */}
            <div className="sim-nav flex items-center justify-between border-t border-white/15 pt-3 mt-2.5 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/25 text-white font-display font-900 text-sm sm:text-lg px-6 py-2.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Activity
              </button>

              <button
                onClick={nextActivity}
                className="btn-gold text-sm sm:text-lg font-900 px-7 sm:px-9 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice Phase' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
