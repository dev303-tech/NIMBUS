import React, { useState } from 'react';
import { Building2, Navigation, Compass, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { useAqiStore } from '../../store/useAqiStore';

export const Chapter4TheCity: React.FC = () => {
  const data = useAqiStore((s) => s.data);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);
  const baseAqi = getEffectiveAqi();
  const basePm25 = data.pm2_5 || (baseAqi * 0.45);

  const [selectedRoute, setSelectedRoute] = useState<'arterial' | 'cleanpath'>('cleanpath');

  // Route exposure factors
  // Arterial Canyon: 1.25x concentration (trapped vehicle exhaust)
  // CleanPath: 0.52x concentration (tree foliar deposition and maritime ventilation)
  const arterialPm25 = Math.round(basePm25 * 1.25 * 10) / 10;
  const cleanPathPm25 = Math.round(basePm25 * 0.52 * 10) / 10;

  // Inhaled particulate mass calculation (30 min transit at 55 L/min ventilation rate)
  // Inhaled PM2.5 (µg) = Conc (µg/m³) * (55 L/min * 1e-3 m³/L) * 30 min = Conc * 1.65
  const arterialInhaledUg = Math.round(arterialPm25 * 1.65);
  const cleanPathInhaledUg = Math.round(cleanPathPm25 * 1.65);
  const avoidedUg = arterialInhaledUg - cleanPathInhaledUg;
  const avoidedPercent = Math.round(((arterialInhaledUg - cleanPathInhaledUg) / arterialInhaledUg) * 100);

  // Berkeley Earth metric: ~22 µg/m³ 24h exposure ≈ 1 cigarette ≈ ~400 µg total inhaled mass
  const avoidedCigarettes = (avoidedUg / 400).toFixed(2);

  return (
    <section
      id="the-city"
      className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-20 py-24 select-none"
    >
      <div className="max-w-6xl">
        <div className="font-tech text-xs tracking-widest text-[#8E99A8] uppercase mb-3 flex items-center gap-2">
          <span>ZONE 04 // 1,800 FT</span>
          <span>•</span>
          <span className="text-[#8DA9C4]">URBAN BOUNDARY LAYER & CLEANPATH™ NAVIGATION</span>
        </div>

        <h2 className="font-display text-4xl md:text-7xl font-light text-white tracking-tight leading-none mb-6">
          The Urban Canyon
        </h2>

        <p className="font-tech text-sm text-[#C8D1DC] leading-relaxed max-w-2xl mb-8">
          Beneath the inversion ceiling, vertical skyscrapers restrict aerodynamic ventilation. Traffic emissions and industrial plumes become trapped in closed vortex loops, causing microclimate AQI fluctuations of up to <strong className="text-[#E8A858]">±40 points</strong> between districts.
        </p>

        {/* Microclimate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-tech mb-8">
          <div className="atmospheric-plate p-4 border border-white/10 hover:border-[#E05318]/50 transition-all">
            <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider mb-1">
              DISTRICT 01 // ARTERIAL
            </div>
            <div className="font-semibold text-white text-xs mb-2">Transit Canyon</div>
            <div className="text-xl font-bold text-[#E05318] mb-1">
              AQI {Math.round(baseAqi + 18)}
            </div>
            <div className="text-[10px] text-[#8E99A8] leading-tight">
              Diesel exhaust vortex trapped between high-rise curtain walls. High NO₂ spikes.
            </div>
          </div>

          <div className="atmospheric-plate p-4 border border-white/10 hover:border-[#E05318]/50 transition-all">
            <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider mb-1">
              DISTRICT 02 // LOGISTICS
            </div>
            <div className="font-semibold text-white text-xs mb-2">Industrial Basin</div>
            <div className="text-xl font-bold text-[#E05318] mb-1">
              AQI {Math.round(baseAqi + 36)}
            </div>
            <div className="text-[10px] text-[#8E99A8] leading-tight">
              Stationary combustion plumes and heavy freight tyre abrasion. Dense PM₂.₅.
            </div>
          </div>

          <div className="atmospheric-plate p-4 border border-white/10 hover:border-[#5296D5]/50 transition-all">
            <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider mb-1">
              DISTRICT 03 // WATERFRONT
            </div>
            <div className="font-semibold text-white text-xs mb-2">Maritime Harbor</div>
            <div className="text-xl font-bold text-[#5296D5] mb-1">
              AQI {Math.max(12, Math.round(baseAqi - 14))}
            </div>
            <div className="text-[10px] text-[#8E99A8] leading-tight">
              Marine boundary breeze flushes ground particulates. Moderated solar heating.
            </div>
          </div>

          <div className="atmospheric-plate p-4 border border-white/10 hover:border-[#5296D5]/50 transition-all">
            <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider mb-1">
              DISTRICT 04 // PARKWAY
            </div>
            <div className="font-semibold text-white text-xs mb-2">Botanical Canopy</div>
            <div className="text-xl font-bold text-[#5296D5] mb-1">
              AQI {Math.max(10, Math.round(baseAqi - 26))}
            </div>
            <div className="text-[10px] text-[#8E99A8] leading-tight">
              Urban tree foliar deposition absorbs coarse particulates, dropping local exposure.
            </div>
          </div>
        </div>

        {/* CleanPath™ Inhalation Interactive Dossier */}
        <div className="atmospheric-plate border border-[#E8A858]/30 p-6 max-w-4xl shadow-2xl font-tech mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 hairline-b pb-3 mb-5">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-[#E8A858]" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                CleanPath™ Inhalation Physics Co-Pilot
              </span>
            </div>
            <div className="text-[10px] text-[#8DA9C4]">
              30 MIN PEDESTRIAN / CYCLIST EXPOSURE MODEL
            </div>
          </div>

          {/* Route Selector Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setSelectedRoute('arterial')}
              className={`p-3 text-left border transition-all cursor-pointer ${
                selectedRoute === 'arterial'
                  ? 'border-[#E05318] bg-[#E05318]/15 text-white'
                  : 'border-white/10 text-[#8E99A8] hover:border-white/30'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs uppercase tracking-wider">Route A: Arterial Canyon</span>
                <span className="text-[#E05318] font-bold text-xs">+{Math.round((arterialPm25 / basePm25 - 1) * 100)}% Smog</span>
              </div>
              <div className="text-[10px] text-[#8E99A8] mt-1">
                Direct motor corridor. Trapped NO₂ and diesel particulate vortex.
              </div>
              <div className="mt-2 text-lg font-mono font-bold text-white">
                {arterialInhaledUg} µg <span className="text-xs font-normal text-[#8E99A8]">PM₂.₅ Inhaled</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedRoute('cleanpath')}
              className={`p-3 text-left border transition-all cursor-pointer ${
                selectedRoute === 'cleanpath'
                  ? 'border-green-400 bg-green-500/15 text-white'
                  : 'border-white/10 text-[#8E99A8] hover:border-white/30'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  Route B: CleanPath™ Eco-Corridor
                </span>
                <span className="text-green-400 font-bold text-xs">-{avoidedPercent}% Toxic Load</span>
              </div>
              <div className="text-[10px] text-[#8E99A8] mt-1">
                Parkway & waterfront greenway. Natural foliar vegetative filtration.
              </div>
              <div className="mt-2 text-lg font-mono font-bold text-green-400">
                {cleanPathInhaledUg} µg <span className="text-xs font-normal text-[#8E99A8]">PM₂.₅ Inhaled</span>
              </div>
            </button>
          </div>

          {/* CleanPath Comparative Payoff */}
          <div className="p-3 bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#8E99A8] text-[10px] uppercase block">PULMONARY EXPOSURE AVOIDED:</span>
              <span className="text-sm font-bold text-white font-mono">
                -{avoidedUg} µg PM₂.₅ Inhaled Mass
              </span>
              <span className="text-[10px] text-green-400 ml-2">
                (≈ {avoidedCigarettes} active cigarettes avoided / Berkeley Earth)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-[#8E99A8] uppercase block">VENTILATION CALCULATION:</span>
              <span className="text-[10px] font-mono text-[#8DA9C4]">
                55 L/min × 30 min = 1,650 L Ambient Air
              </span>
            </div>
          </div>
        </div>

        {/* Interaction Prompt */}
        <div className="flex items-center gap-2 text-xs font-tech text-[#8DA9C4]">
          <Building2 size={14} className="text-[#E8A858]" />
          <span>Click any 3D district beacon in the skyline above to inspect local telemetry.</span>
        </div>
      </div>
    </section>
  );
};
