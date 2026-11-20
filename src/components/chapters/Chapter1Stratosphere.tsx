import React from 'react';
import { ArrowDown, Radio } from 'lucide-react';

export const Chapter1Stratosphere: React.FC = () => {
  return (
    <section
      id="stratosphere"
      className="relative min-h-screen w-full flex flex-col justify-between p-8 md:p-16 select-none pt-28"
    >
      {/* Top Stratospheric Telemetry Bar */}
      <div className="flex justify-between items-start pt-6">
        <div className="font-tech text-xs space-y-1 text-[#8E99A8]">
          <div className="flex items-center gap-2 text-white">
            <Radio size={12} className="text-[#8DA9C4] animate-pulse" />
            <span className="tracking-widest uppercase">STRATOSPHERIC SOUNDING</span>
          </div>
          <div className="text-[10px] tracking-wider">PRESSURE: 228 hPa // TEMP: -56.5°C</div>
          <div className="text-[10px] tracking-wider">TROPOPAUSE BOUNDARY LAYER: 11,200 M</div>
        </div>

        <div className="hidden sm:block text-right font-tech text-xs text-[#8E99A8] space-y-1">
          <div className="text-white tracking-widest uppercase">OPTICAL EXTINCTION</div>
          <div className="text-[10px] tracking-wider text-[#8DA9C4]">
            RAYLEIGH SCATTERING DOMINANT
          </div>
          <div className="text-[10px] tracking-wider">AEROSOL OPTICAL DEPTH: 0.04</div>
        </div>
      </div>

      {/* Massive Editorial Wordmark */}
      <div className="max-w-6xl my-auto">
        <div className="overflow-hidden">
          <h1 className="font-display text-7xl sm:text-9xl md:text-[13vw] font-extralight tracking-[-0.04em] text-white leading-none">
            NIMBUS
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 pt-6 hairline-t mt-6">
          <p className="font-display-italic text-2xl md:text-3xl text-[#EEF2F6]/90 max-w-xl font-light">
            The Descent through Earth&apos;s atmospheric envelope.
          </p>
          <div className="font-tech text-xs text-[#8E99A8] max-w-sm leading-relaxed">
            The sky itself is the data visualization. As you descend from 35,000 feet to street
            level, witness how particulate pollution transforms optical transmittance, solar
            scattering, and urban breathing corridors.
          </div>
        </div>
      </div>

      {/* Scroll to Descend Prompt */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
            <ArrowDown size={14} className="text-[#E8A858]" />
          </div>
          <span className="font-tech text-xs tracking-widest uppercase text-white font-medium">
            Scroll to Descend
          </span>
        </div>

        <div className="font-tech text-[10px] text-[#8E99A8] tracking-widest uppercase">
          ZONE 01 // 35,000 FT
        </div>
      </div>
    </section>
  );
};
