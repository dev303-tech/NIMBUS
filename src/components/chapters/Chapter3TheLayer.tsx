import React from 'react';
import { useAqiStore } from '../../store/useAqiStore';
import { PollutantId } from '../../types/aqi';
import { Activity, ShieldAlert, Sparkles, Flame } from 'lucide-react';

interface PollutantCard {
  id: PollutantId;
  formula: string;
  name: string;
  diameter: string;
  color: string;
  source: string;
  pathology: string;
  whoLimit: string;
  currentValKey: 'pm2_5' | 'pm10' | 'no2' | 'o3';
}

const POLLUTANTS: PollutantCard[] = [
  {
    id: 'pm25',
    formula: 'PM₂.₅',
    name: 'Fine Combustion Particulates',
    diameter: '≤ 2.5 µm (1/30th hair width)',
    color: '#9E5A2A',
    source: 'Diesel tailpipes, industrial furnaces, biomass burning, coal power generation.',
    pathology: 'Bypasses nasal cilia and bronchial mucous membranes to lodge deep within pulmonary alveoli. Crosses the alveolar-capillary barrier into the bloodstream, triggering vascular endothelial inflammation.',
    whoLimit: '15 µg/m³ (24h limit)',
    currentValKey: 'pm2_5',
  },
  {
    id: 'pm10',
    formula: 'PM₁₀',
    name: 'Inhalable Coarse Aerosols',
    diameter: '≤ 10 µm',
    color: '#C9A066',
    source: 'Road tyre and brake lining abrasion, construction demolition, wind-borne mineral dust.',
    pathology: 'Deposits in the upper trachea and primary bronchi. Triggers acute bronchospasms, chronic cough, and exacerbates asthma and COPD flare-ups.',
    whoLimit: '45 µg/m³ (24h limit)',
    currentValKey: 'pm10',
  },
  {
    id: 'no2',
    formula: 'NO₂',
    name: 'Nitrogen Dioxide',
    diameter: 'Reactive Gas Molecule',
    color: '#E05318',
    source: 'High-temperature vehicular combustion, transit corridors, urban power generation.',
    pathology: 'Aggressive biological oxidant that corrodes airway epithelial cells, exacerbates pediatric airway inflammation, and suppresses immune resistance to lung infections.',
    whoLimit: '25 µg/m³ (24h limit)',
    currentValKey: 'no2',
  },
  {
    id: 'o3',
    formula: 'O₃',
    name: 'Tropospheric Ozone',
    diameter: 'Photochemical Oxidant',
    color: '#4DA8DA',
    source: 'Secondary photochemical smog formed when NOx and volatile organics react under intense UV solar radiation.',
    pathology: 'Acts as an internal caustic agent, chemically oxidizing alveolar lining fluid. Causes reduced lung capacity, acute chest tightness, and exercise-induced coughing.',
    whoLimit: '100 µg/m³ (8h limit)',
    currentValKey: 'o3',
  },
];

export const Chapter3TheLayer: React.FC = () => {
  const activePollutant = useAqiStore((s) => s.activePollutant);
  const setActivePollutant = useAqiStore((s) => s.setActivePollutant);
  const data = useAqiStore((s) => s.data);

  const activeCard = POLLUTANTS.find((p) => p.id === activePollutant) || POLLUTANTS[0];
  const currentValue = data[activeCard.currentValKey];

  return (
    <section
      id="the-layer"
      className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-20 py-24 select-none"
    >
      <div className="max-w-6xl">
        <div className="font-tech text-xs tracking-widest text-[#8E99A8] uppercase mb-3 flex items-center gap-2">
          <span>ZONE 03 // 6,500 FT</span>
          <span>•</span>
          <span className="text-[#E8A858]">THERMAL INVERSION PARTICULATE FIELD</span>
        </div>

        <h2 className="font-display text-4xl md:text-7xl font-light text-white tracking-tight leading-none mb-8">
          The Particle Anatomy
        </h2>

        {/* Pollutant Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {POLLUTANTS.map((p) => {
            const isSelected = activePollutant === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePollutant(p.id)}
                className={`atmospheric-plate px-4 py-3 border font-tech text-xs flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-white text-white bg-white/10 scale-105 shadow-xl'
                    : 'border-white/10 text-[#8E99A8] hover:border-white/30 hover:text-white'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="font-bold tracking-wider">{p.formula}</span>
                <span className="text-[10px] text-[#8E99A8] hidden sm:inline">
                  {p.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Pollutant Dossier Plate */}
        <div className="atmospheric-plate border border-white/15 p-8 max-w-4xl shadow-2xl font-tech">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 hairline-b pb-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: activeCard.color }}
                />
                <h3 className="font-display text-3xl font-normal text-white">
                  {activeCard.formula} — {activeCard.name}
                </h3>
              </div>
              <p className="text-xs text-[#8DA9C4] mt-1">{activeCard.diameter}</p>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider">
                CURRENT CONCENTRATION
              </div>
              <div className="text-2xl font-bold text-white flex items-baseline justify-end gap-1">
                <span>{currentValue}</span>
                <span className="text-xs text-[#8E99A8] font-normal">µg/m³</span>
              </div>
              <div className="text-[10px] text-[#8DA9C4]">WHO TARGET: {activeCard.whoLimit}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
            {/* Primary Sources */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-[11px]">
                <Flame size={14} className="text-[#E8A858]" />
                <span>Primary Emission Sources</span>
              </div>
              <p className="text-[#C8D1DC]">{activeCard.source}</p>
            </div>

            {/* Pulmonary & Vascular Pathology */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-[11px]">
                <ShieldAlert size={14} className="text-[#E05318]" />
                <span>Cellular & Pulmonary Impact</span>
              </div>
              <p className="text-[#C8D1DC]">{activeCard.pathology}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 hairline-t flex items-center justify-between text-[11px] text-[#8E99A8]">
            <span>3D PARTICULATE RENDERING: ISOLATED SHADER PASS ACTIVE</span>
            <span className="text-[#8DA9C4]">HOVER / MOVE CURSOR TO DEFLECT PARTICLES</span>
          </div>
        </div>
      </div>
    </section>
  );
};
