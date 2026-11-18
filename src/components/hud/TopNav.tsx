import React, { useState } from 'react';
import { Volume2, VolumeX, Search, Sliders, RefreshCw, Compass } from 'lucide-react';
import { useAqiStore } from '../../store/useAqiStore';
import { audioEngine } from '../../services/audioSynth';

interface TopNavProps {
  onOpenSearch: () => void;
  onToggleDev: () => void;
  isDevOpen: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSearch, onToggleDev, isDevOpen }) => {
  const data = useAqiStore((s) => s.data);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);
  const devAqiOverride = useAqiStore((s) => s.devAqiOverride);
  const isLoading = useAqiStore((s) => s.isLoading);
  const aqi = getEffectiveAqi();

  const [isAudioActive, setIsAudioActive] = useState(false);

  const toggleSound = () => {
    const active = audioEngine.toggle();
    setIsAudioActive(active);
  };

  // Color mapping for AQI chip
  let aqiColor = '#8DA9C4'; // Clean
  if (aqi > 200) aqiColor = '#A0381E'; // Severe
  else if (aqi > 100) aqiColor = '#C87832'; // Moderate/Unhealthy
  else if (aqi > 50) aqiColor = '#B8A882';

  return (
    <header role="banner" aria-label="NIMBUS Global Telemetry & Navigation" className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
      {/* Brand & Telemetry Chip */}
      <div className="flex items-center gap-5 pointer-events-auto">
        <a href="#stratosphere" aria-label="NIMBUS Homepage and Start of Descent" className="group flex items-center gap-2.5 text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A858] rounded">
          <span className="font-display text-2xl font-light tracking-[0.22em] text-white group-hover:text-[#E8A858] transition-colors">
            NIMBUS
          </span>
          <span className="text-[9px] font-tech text-[#8E99A8] px-1.5 py-0.5 border border-white/10 uppercase tracking-widest hidden sm:inline-block">
            Atmospheric Descent
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-3 text-[10px] font-tech text-[#8E99A8] hairline-l pl-5">
          <span>LAT {data.latitude.toFixed(2)}°</span>
          <span>LON {data.longitude.toFixed(2)}°</span>
          {data.isOfflineMock && (
            <span className="text-[#C87832] bg-[#C87832]/10 px-1 border border-[#C87832]/30">
              SIMULATED TELEMETRY
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 pointer-events-auto" role="toolbar" aria-label="Environmental controls">
        {/* City Selector Button */}
        <button
          onClick={onOpenSearch}
          aria-label={`Current location: ${data.cityName}, ${data.country}. Click to change coordinate location.`}
          className="atmospheric-plate px-3.5 py-1.5 flex items-center gap-2 text-xs font-tech text-white hover:border-[#E8A858]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A858] transition-all cursor-pointer group"
          title="Change location"
        >
          <Search size={12} className="text-[#8E99A8] group-hover:text-[#E8A858] transition-colors" aria-hidden="true" />
          <span className="font-medium text-xs tracking-wide">
            {data.cityName}
            {data.country ? `, ${data.country}` : ''}
          </span>
          {isLoading && <RefreshCw size={11} className="animate-spin text-[#8E99A8]" aria-hidden="true" />}
        </button>

        {/* Live AQI Badge */}
        <div 
          className="atmospheric-plate px-3 py-1.5 flex items-center gap-2 text-xs font-tech border border-white/10"
          role="status"
          aria-live="polite"
          aria-label={`Live Air Quality Index: ${aqi}`}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} aria-hidden="true" />
          <span className="text-[#8E99A8] text-[10px] tracking-wider uppercase">AQI</span>
          <span className="font-bold text-sm tracking-tight text-white">{aqi}</span>
          {devAqiOverride !== null && (
            <span className="text-[9px] text-[#E8A858] uppercase tracking-tighter">[DEV]</span>
          )}
        </div>

        {/* Ambient Sound Toggle */}
        <button
          onClick={toggleSound}
          aria-label={isAudioActive ? 'Mute procedural atmospheric sound' : 'Enable procedural atmospheric wind and pollution drone'}
          aria-pressed={isAudioActive}
          className={`atmospheric-plate p-2 text-xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A858] transition-all cursor-pointer ${
            isAudioActive
              ? 'border-[#E8A858] text-[#E8A858] bg-[#E8A858]/10'
              : 'border-white/10 text-[#8E99A8] hover:text-white'
          }`}
          title={isAudioActive ? 'Mute atmospheric sound' : 'Enable procedural atmospheric audio'}
        >
          {isAudioActive ? <Volume2 size={14} aria-hidden="true" /> : <VolumeX size={14} aria-hidden="true" />}
        </button>

        {/* Dev AQI Scrubber Toggle */}
        <button
          onClick={onToggleDev}
          aria-label="Toggle developer atmospheric pollution mapper slider"
          aria-expanded={isDevOpen}
          className={`atmospheric-plate p-2 text-xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A858] transition-all cursor-pointer ${
            isDevOpen
              ? 'border-[#E8A858] text-[#E8A858]'
              : 'border-white/10 text-[#8E99A8] hover:text-white'
          }`}
          title="Toggle AQI Dev Preview Scrubber"
        >
          <Sliders size={14} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
