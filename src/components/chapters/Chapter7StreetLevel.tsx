import React, { useState } from 'react';
import { useAqiStore } from '../../store/useAqiStore';
import { CityComparison } from '../../types/aqi';
import { Share2, Bell, Plus, Check, Trash2, ExternalLink } from 'lucide-react';

interface Chapter7Props {
  onOpenPoster: () => void;
}

const GLOBAL_BENCHMARKS: CityComparison[] = [
  { name: 'Reykjavik', country: 'Iceland', aqi: 14, pm2_5: 2.8, status: 'Pristine Arctic', color: '#8DA9C4' },
  { name: 'Tokyo', country: 'Japan', aqi: 28, pm2_5: 6.8, status: 'Pristine Maritime', color: '#5296D5' },
  { name: 'Zurich', country: 'Switzerland', aqi: 32, pm2_5: 7.2, status: 'Alpine Crisp', color: '#8DA9C4' },
  { name: 'London', country: 'UK', aqi: 68, pm2_5: 16.4, status: 'Moderate', color: '#B8A882' },
  { name: 'Los Angeles', country: 'USA', aqi: 134, pm2_5: 48.9, status: 'Inversion Haze', color: '#C87832' },
  { name: 'New Delhi', country: 'India', aqi: 278, pm2_5: 182.4, status: 'Severe Smog', color: '#A0381E' },
];

export const Chapter7StreetLevel: React.FC<Chapter7Props> = ({ onOpenPoster }) => {
  const comparisonCities = useAqiStore((s) => s.comparisonCities);
  const addComparisonCity = useAqiStore((s) => s.addComparisonCity);
  const removeComparisonCity = useAqiStore((s) => s.removeComparisonCity);
  const currentCity = useAqiStore((s) => s.data);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);

  const [alertSubscribed, setAlertSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setAlertSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
    }, 3000);
  };

  return (
    <section
      id="street-level"
      className="relative min-h-screen w-full flex flex-col justify-between px-8 md:px-20 py-24 select-none"
    >
      <div className="max-w-6xl">
        <div className="font-tech text-xs tracking-widest text-[#8E99A8] uppercase mb-3 flex items-center gap-2">
          <span>ZONE 07 // 0 M</span>
          <span>•</span>
          <span className="text-[#8DA9C4]">GROUND LEVEL INTERACTION & COMPARISON</span>
        </div>

        <h2 className="font-display text-4xl md:text-7xl font-light text-white tracking-tight leading-none mb-4">
          Street Level Horizon
        </h2>

        <p className="font-tech text-sm text-[#C8D1DC] leading-relaxed max-w-2xl mb-8">
          You have reached ground level. The floating translucent cylinders in the 3D scene directly model the ambient particulate volume and solar extinction of global metropolitan air columns.
        </p>

        {/* 3D Comparative Columns Manager */}
        <div className="atmospheric-plate border border-white/15 p-6 mb-8 font-tech max-w-4xl shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 hairline-b pb-3 mb-4">
            <div>
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                3D Comparative Air Column Array
              </span>
              <span className="text-[10px] text-[#8E99A8] ml-2">
                (Rendered in real-time 3D scene)
              </span>
            </div>
            <div className="text-[10px] text-[#8DA9C4]">
              {comparisonCities.length} / 4 COLUMNS ENGAGED
            </div>
          </div>

          {/* Active Columns in 3D scene */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {comparisonCities.map((c) => (
              <div
                key={c.name}
                className="p-3 border border-white/10 atmospheric-plate-subtle flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-white text-xs">{c.name}</span>
                  {comparisonCities.length > 2 && (
                    <button
                      onClick={() => removeComparisonCity(c.name)}
                      className="text-[#8E99A8] hover:text-red-400 p-0.5 cursor-pointer"
                      title="Remove column"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white font-mono">
                    AQI {c.aqi}
                  </span>
                  <span className="text-[9px] text-[#8E99A8]">{c.pm2_5} µg</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add quick benchmark buttons */}
          <div className="hairline-t pt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-[#8E99A8] uppercase tracking-wider mr-2">
              Add Benchmark:
            </span>
            {GLOBAL_BENCHMARKS.map((bench) => {
              const exists = comparisonCities.some((c) => c.name === bench.name);
              return (
                <button
                  key={bench.name}
                  onClick={() => addComparisonCity(bench)}
                  disabled={exists || comparisonCities.length >= 4}
                  className={`px-2 py-1 text-[10px] border flex items-center gap-1 transition-all cursor-pointer ${
                    exists
                      ? 'border-white/5 text-[#8E99A8]/40 cursor-not-allowed'
                      : 'border-white/15 text-[#8DA9C4] hover:border-[#E8A858] hover:text-white'
                  }`}
                >
                  <Plus size={9} />
                  <span>{bench.name} ({bench.aqi})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Closing Actions & CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl font-tech">
          {/* Share Poster Card */}
          <div className="atmospheric-plate border border-white/15 p-6 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider mb-1">
                EXPOSURE RECORD
              </div>
              <h3 className="font-display text-2xl font-light text-white mb-2">
                Export Atmospheric Dossier
              </h3>
              <p className="text-xs text-[#C8D1DC] leading-relaxed mb-4">
                Generate a high-resolution typographic Swiss art poster capturing today&apos;s real-time air quality metrics, particulate ratios, and coordinates.
              </p>
            </div>

            <button
              onClick={onOpenPoster}
              className="w-full py-3 px-4 bg-[#E8A858] hover:bg-[#d89748] text-[#050B14] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Share2 size={14} />
              <span>Generate Air Dossier Poster</span>
            </button>
          </div>

          {/* Inversion Alert Sign-up */}
          <div className="atmospheric-plate border border-white/15 p-6 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider mb-1">
                PREDICTIVE TELEMETRY
              </div>
              <h3 className="font-display text-2xl font-light text-white mb-2">
                Inversion Boundary Alert
              </h3>
              <p className="text-xs text-[#C8D1DC] leading-relaxed mb-4">
                Receive early morning push notifications whenever local thermal inversions trap ground particulates above WHO exposure limits.
              </p>
            </div>

            {alertSubscribed ? (
              <div className="p-3 bg-green-500/15 border border-green-500/30 text-green-400 text-xs flex items-center gap-2">
                <Check size={14} />
                <span>Atmospheric monitor beacon armed. Inversion alerts active.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="flex-1 bg-[#050B14]/80 border border-white/20 px-3 py-2 text-xs text-white placeholder-[#8E99A8] outline-none focus:border-[#E8A858]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-white/20 hover:border-white/50 text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Bell size={13} />
                  <span>Arm Alert</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Reference Standards */}
      <footer className="mt-16 pt-8 hairline-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-tech text-[#8E99A8]">
        <div>
          NIMBUS AIR INTELLIGENCE // CONTINUOUS 3D ATMOSPHERIC DESCENT
        </div>
        <div className="flex items-center gap-4">
          <span>DATA: OPEN-METEO CAMS / GFS</span>
          <span>•</span>
          <span>EPIDEMIOLOGY: WHO 2021 GUIDELINES</span>
          <span>•</span>
          <span>60 FPS WEBGL SHADER PIPELINE</span>
        </div>
      </footer>
    </section>
  );
};
