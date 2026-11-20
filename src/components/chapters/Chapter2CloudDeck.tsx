import React, { useEffect, useState } from 'react';
import { useAqiStore } from '../../store/useAqiStore';
import { useScrollStore } from '../../store/useScrollStore';
import { Wind, CloudRain, Eye } from 'lucide-react';

export const Chapter2CloudDeck: React.FC = () => {
  const data = useAqiStore((s) => s.data);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);
  const chapter = useScrollStore((s) => s.chapter);
  const targetAqi = getEffectiveAqi();

  const [displayAqi, setDisplayAqi] = useState(0);

  // Animated ticker when entering Chapter 2
  useEffect(() => {
    if (chapter >= 2) {
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      const animateTicker = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease out expo
        const ease = 1 - Math.pow(2, -10 * progress);
        const current = Math.round(start + (targetAqi - start) * ease);
        setDisplayAqi(current);

        if (progress < 1) {
          requestAnimationFrame(animateTicker);
        }
      };

      requestAnimationFrame(animateTicker);
    }
  }, [chapter, targetAqi]);

  let statusColor = '#8DA9C4';
  if (targetAqi > 200) statusColor = '#A0381E';
  else if (targetAqi > 100) statusColor = '#C87832';
  else if (targetAqi > 50) statusColor = '#B8A882';

  return (
    <section
      id="cloud-deck"
      className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-20 py-24 select-none"
    >
      <div className="max-w-5xl">
        <div className="font-tech text-xs tracking-widest text-[#8E99A8] uppercase mb-3 flex items-center gap-2">
          <span>ZONE 02 // 18,000 FT</span>
          <span>•</span>
          <span className="text-[#8DA9C4]">VOLUMETRIC CONDENSATION DECK</span>
        </div>

        {/* City Title */}
        <div className="overflow-hidden">
          <h2 className="font-display text-5xl md:text-8xl font-light text-white tracking-tight leading-none mb-6">
            {data.cityName}
          </h2>
        </div>

        {/* Massive AQI Number Ticker & Diagnosis */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline pt-4 hairline-t">
          <div className="md:col-span-5 flex items-baseline gap-4">
            <span
              className="font-display text-8xl md:text-[11vw] font-extralight tracking-tighter leading-none"
              style={{ color: statusColor }}
            >
              {displayAqi}
            </span>
            <div className="font-tech space-y-0.5">
              <div className="text-xs uppercase tracking-widest text-white font-semibold">
                US AQI
              </div>
              <div className="text-[10px] text-[#8E99A8]">INDEX RANGE 0–500</div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div>
              <span
                className="inline-block px-2.5 py-1 text-xs font-tech tracking-wider uppercase font-semibold border mb-2"
                style={{
                  borderColor: statusColor,
                  color: statusColor,
                  backgroundColor: `${statusColor}15`,
                }}
              >
                {data.statusLabel}
              </span>
              <p className="font-tech text-sm text-[#EEF2F6] leading-relaxed max-w-lg">
                {data.statusDescription}
              </p>
            </div>

            {/* Cloud and Visibility Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-3 hairline-t text-xs font-tech text-[#8E99A8]">
              <div className="flex items-center gap-2">
                <Eye size={13} className="text-[#8DA9C4]" />
                <span>
                  VISIBILITY:{' '}
                  <strong className="text-white">
                    {targetAqi < 50 ? '> 25 KM' : targetAqi < 150 ? '8.5 KM' : '2.1 KM'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind size={13} className="text-[#8DA9C4]" />
                <span>
                  WIND: <strong className="text-white">{data.windSpeed ?? 3.4} M/S</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain size={13} className="text-[#8DA9C4]" />
                <span>
                  HUMIDITY: <strong className="text-white">{data.humidity ?? 55}%</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
