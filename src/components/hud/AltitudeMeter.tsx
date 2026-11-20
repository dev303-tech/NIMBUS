import React from 'react';
import { useScrollStore } from '../../store/useScrollStore';

const ALTITUDE_ZONES = [
  { label: 'STRATOSPHERE', ft: 35000, m: 10668, chapter: 1, p: 0.0 },
  { label: 'CLOUD DECK', ft: 18000, m: 5486, chapter: 2, p: 0.17 },
  { label: 'THE LAYER', ft: 6500, m: 1981, chapter: 3, p: 0.35 },
  { label: 'THE CITY', ft: 1800, m: 548, chapter: 4, p: 0.52 },
  { label: 'THE FORECAST', ft: 800, m: 243, chapter: 5, p: 0.68 },
  { label: 'YOUR AIR', ft: 250, m: 76, chapter: 6, p: 0.83 },
  { label: 'STREET LEVEL', ft: 0, m: 0, chapter: 7, p: 0.98 },
];

export const AltitudeMeter: React.FC = () => {
  const altitudeFt = useScrollStore((s) => s.altitudeFt);
  const altitudeM = useScrollStore((s) => s.altitudeM);
  const currentChapter = useScrollStore((s) => s.chapter);
  const progress = useScrollStore((s) => s.progress);

  const scrollToProgress = (targetP: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetP * totalHeight,
      behavior: 'smooth',
    });
  };

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex flex-col items-end gap-3 select-none">
      {/* Current Digital Readout */}
      <div className="atmospheric-plate px-2.5 py-1.5 border border-white/10 text-right pointer-events-auto shadow-xl">
        <div className="text-[9px] font-tech text-[#8E99A8] uppercase tracking-wider">
          ALTITUDE ENVELOPE
        </div>
        <div className="font-tech font-bold text-sm tracking-tight text-white flex items-baseline justify-end gap-1.5">
          <span>{altitudeFt.toLocaleString()}</span>
          <span className="text-[10px] text-[#8E99A8] font-normal">FT</span>
        </div>
        <div className="text-[10px] font-tech text-[#8E99A8]">{altitudeM.toLocaleString()} M</div>
      </div>

      {/* Vertical Altitude Rail */}
      <div className="relative py-2 flex flex-col items-end gap-5 pointer-events-auto pr-1">
        {/* Continuous Hairline Track */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/10" />

        {/* Dynamic Progress Indicator Pill on Rail */}
        <div
          className="absolute right-[-2px] w-[5px] h-[18px] bg-[#E8A858] transition-all duration-75 shadow-[0_0_8px_#E8A858]"
          style={{ top: `${Math.min(95, Math.max(0, progress * 96))}%` }}
        />

        {/* Zone Markers */}
        {ALTITUDE_ZONES.map((zone) => {
          const isActive = currentChapter === zone.chapter;
          return (
            <button
              key={zone.chapter}
              onClick={() => scrollToProgress(zone.p)}
              className="group flex items-center gap-2 text-right transition-all cursor-pointer"
            >
              <div
                className={`text-[9px] font-tech tracking-wider uppercase transition-colors ${
                  isActive
                    ? 'text-[#E8A858] font-semibold scale-105'
                    : 'text-[#8E99A8]/70 hover:text-white'
                }`}
              >
                {zone.label}
              </div>
              <div
                className={`w-2 h-[1px] transition-all ${
                  isActive ? 'w-4 bg-[#E8A858]' : 'bg-white/20 group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
};
