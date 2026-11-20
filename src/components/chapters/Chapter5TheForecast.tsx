import React from 'react';
import { useAqiStore } from '../../store/useAqiStore';
import { Sparkles, AlertTriangle, Clock } from 'lucide-react';

export const Chapter5TheForecast: React.FC = () => {
  const data = useAqiStore((s) => s.data);
  const forecastScrubIndex = useAqiStore((s) => s.forecastScrubIndex);
  const setForecastScrubIndex = useAqiStore((s) => s.setForecastScrubIndex);

  const forecast = data.forecast || [];
  const currentScrub = forecast[forecastScrubIndex] ||
    forecast[0] || {
      hourLabel: '12:00',
      aqi: 50,
      pm2_5: 12,
      o3: 35,
    };

  return (
    <section
      id="the-forecast"
      className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-20 py-24 select-none"
    >
      <div className="max-w-6xl">
        <div className="font-tech text-xs tracking-widest text-[#8E99A8] uppercase mb-3 flex items-center gap-2">
          <span>ZONE 05 // 800 FT</span>
          <span>•</span>
          <span className="text-[#E8A858]">48-HOUR CELESTIAL & POLLUTION ARC</span>
        </div>

        <h2 className="font-display text-4xl md:text-7xl font-light text-white tracking-tight leading-none mb-4">
          The 48-Hour Arc
        </h2>

        <p className="font-tech text-sm text-[#C8D1DC] leading-relaxed max-w-xl mb-8">
          Time is mapped across the horizon. Scrubbing below drives the 3D sun across the celestial
          sphere, updating atmospheric scattering and photochemical haze in real time.
        </p>

        {/* Current Scrubbed Focus Card */}
        <div className="atmospheric-plate border border-white/15 p-6 mb-6 font-tech max-w-2xl">
          <div className="flex items-center justify-between hairline-b pb-3 mb-4">
            <div className="flex items-center gap-2 text-white">
              <Clock size={14} className="text-[#E8A858]" />
              <span className="font-bold text-sm tracking-wide">
                PROJECTED TIMELINE: {currentScrub.hourLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {currentScrub.isGoldenWindow && (
                <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5">
                  <Sparkles size={10} />
                  GOLDEN VENTILATION WINDOW
                </span>
              )}
              {currentScrub.isHazardWindow && (
                <span className="flex items-center gap-1 text-[10px] text-[#E05318] bg-[#E05318]/10 border border-[#E05318]/30 px-2 py-0.5">
                  <AlertTriangle size={10} />
                  PEAK INVERSION STAGNATION
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] text-[#8E99A8] uppercase">FORECAST AQI</div>
              <div className="text-3xl font-display font-light text-[#E8A858] mt-0.5">
                {currentScrub.aqi}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8E99A8] uppercase">PM₂.₅ CONC.</div>
              <div className="text-2xl font-tech font-bold text-white mt-1">
                {currentScrub.pm2_5}{' '}
                <span className="text-xs font-normal text-[#8E99A8]">µg/m³</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8E99A8] uppercase">TROPOSPHERIC O₃</div>
              <div className="text-2xl font-tech font-bold text-[#8DA9C4] mt-1">
                {currentScrub.o3} <span className="text-xs font-normal text-[#8E99A8]">µg/m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* 48-Hour Horizontal Timeline Scrubber */}
        <div className="atmospheric-plate p-4 border border-white/10 font-tech">
          <div className="flex justify-between text-[10px] text-[#8E99A8] uppercase mb-2">
            <span>SCRUB 48-HOUR SOLAR TRAJECTORY</span>
            <span>{forecastScrubIndex}h / 48h AHEAD</span>
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(1, forecast.length - 1)}
            value={forecastScrubIndex}
            onChange={(e) => setForecastScrubIndex(parseInt(e.target.value, 10))}
            className="w-full dev-slider mb-4 cursor-pointer"
          />

          {/* Timeline Bar Ticks */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 text-center">
            {forecast.slice(0, 24).map((f, i) => {
              const isSelected = i === forecastScrubIndex;
              let barColor = '#8DA9C4';
              if (f.aqi > 150) barColor = '#A0381E';
              else if (f.aqi > 100) barColor = '#E05318';
              else if (f.aqi > 50) barColor = '#B8A882';

              return (
                <button
                  key={i}
                  onClick={() => setForecastScrubIndex(i)}
                  className={`p-1.5 border transition-all cursor-pointer flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-[#E8A858] bg-[#E8A858]/15'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-[9px] text-[#8E99A8]">{f.hourLabel}</span>
                  <div className="w-full h-1.5 my-1" style={{ backgroundColor: barColor }} />
                  <span className="text-[10px] font-bold text-white">{f.aqi}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
