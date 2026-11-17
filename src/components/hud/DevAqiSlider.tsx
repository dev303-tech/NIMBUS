import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useAqiStore } from '../../store/useAqiStore';
import { calculateAqiCategory } from '../../services/openMeteoApi';

interface DevAqiSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevAqiSlider: React.FC<DevAqiSliderProps> = ({ isOpen, onClose }) => {
  const devAqiOverride = useAqiStore((s) => s.devAqiOverride);
  const setDevAqiOverride = useAqiStore((s) => s.setDevAqiOverride);
  const data = useAqiStore((s) => s.data);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);

  if (!isOpen) return null;

  const currentAqi = getEffectiveAqi();
  const pollutionNorm = getPollutionNorm();
  const { label } = calculateAqiCategory(currentAqi);

  const presets = [
    { label: 'Pristine', aqi: 28 },
    { label: 'Moderate', aqi: 75 },
    { label: 'Inversion', aqi: 130 },
    { label: 'Smog', aqi: 185 },
    { label: 'Severe', aqi: 280 },
    { label: 'Hazardous', aqi: 420 },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl atmospheric-plate border border-[#E8A858]/30 p-4 shadow-2xl font-tech pointer-events-auto">
      <div className="flex items-center justify-between hairline-b pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8A858] animate-ping" />
          <span className="text-xs uppercase tracking-widest text-[#E8A858] font-bold">
            DEV ATMOSPHERIC MAPPER
          </span>
          <span className="text-[10px] text-[#8E99A8]">
            uPollution: {pollutionNorm.toFixed(3)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {devAqiOverride !== null && (
            <button
              onClick={() => setDevAqiOverride(null)}
              className="flex items-center gap-1 text-[10px] text-[#8E99A8] hover:text-white transition-colors cursor-pointer"
              title="Reset to live API"
            >
              <RotateCcw size={10} />
              Reset Live
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[#8E99A8] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Slider Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-[#EEF2F6] font-medium">{label}</span>
          <span className="text-sm font-bold text-[#E8A858]">AQI {currentAqi}</span>
        </div>

        <input
          type="range"
          min="0"
          max="500"
          value={currentAqi}
          onChange={(e) => setDevAqiOverride(parseInt(e.target.value, 10))}
          className="w-full dev-slider cursor-pointer"
        />

        {/* Quick Presets */}
        <div className="flex items-center justify-between gap-1 pt-1">
          {presets.map((p) => (
            <button
              key={p.aqi}
              onClick={() => setDevAqiOverride(p.aqi)}
              className={`px-2 py-1 text-[9px] uppercase tracking-wider border transition-all cursor-pointer ${
                currentAqi === p.aqi
                  ? 'border-[#E8A858] bg-[#E8A858]/20 text-white font-bold'
                  : 'border-white/10 text-[#8E99A8] hover:border-white/30 hover:text-white'
              }`}
            >
              {p.label} ({p.aqi})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
