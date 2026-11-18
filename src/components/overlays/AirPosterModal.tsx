import React, { useState } from 'react';
import { X, Download, Copy, Check, Share2 } from 'lucide-react';
import { useAqiStore } from '../../store/useAqiStore';

interface AirPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirPosterModal: React.FC<AirPosterModalProps> = ({ isOpen, onClose }) => {
  const data = useAqiStore((s) => s.data);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const aqi = getEffectiveAqi();

  const handleCopyText = () => {
    const text = `NIMBUS ATMOSPHERIC TELEMETRY: ${data.cityName.toUpperCase()}
AQI: ${aqi} (${data.statusLabel})
PM2.5: ${data.pm2_5} µg/m³ | PM10: ${data.pm10} µg/m³
NO2: ${data.no2} µg/m³ | O3: ${data.o3} µg/m³
Captured via NIMBUS — Continuous 3D Atmospheric Descent.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMock = () => {
    // Generate simple SVG data URL to download
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100" fill="#050B14">
      <rect width="800" height="1100" fill="#050B14"/>
      <rect x="40" y="40" width="720" height="1020" fill="none" stroke="#253244" stroke-width="1.5"/>
      <text x="70" y="100" fill="#8E99A8" font-family="monospace" font-size="14" letter-spacing="4">NIMBUS // ATMOSPHERIC DESCENT</text>
      <text x="70" y="180" fill="#EEF2F6" font-family="serif" font-size="52" font-weight="300">${data.cityName.toUpperCase()}</text>
      <text x="70" y="220" fill="#8DA9C4" font-family="monospace" font-size="14">${data.country} • ${new Date().toLocaleDateString()}</text>
      <line x1="70" y1="260" x2="730" y2="260" stroke="#253244" stroke-width="1"/>
      <text x="70" y="440" fill="#E8A858" font-family="serif" font-size="160" font-weight="200">${aqi}</text>
      <text x="70" y="490" fill="#EEF2F6" font-family="monospace" font-size="20" letter-spacing="1">US AIR QUALITY INDEX</text>
      <text x="70" y="530" fill="#8E99A8" font-family="monospace" font-size="14">${data.statusLabel}</text>
      <line x1="70" y1="580" x2="730" y2="580" stroke="#253244" stroke-width="1"/>
      <text x="70" y="640" fill="#8E99A8" font-family="monospace" font-size="13">PARTICULATE DENSITIES</text>
      <text x="70" y="680" fill="#EEF2F6" font-family="monospace" font-size="16">PM2.5: ${data.pm2_5} µg/m³</text>
      <text x="270" y="680" fill="#EEF2F6" font-family="monospace" font-size="16">PM10: ${data.pm10} µg/m³</text>
      <text x="470" y="680" fill="#EEF2F6" font-family="monospace" font-size="16">NO2: ${data.no2} µg/m³</text>
      <text x="70" y="730" fill="#8E99A8" font-family="monospace" font-size="12">LAT ${data.latitude}° LON ${data.longitude}°</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NIMBUS-${data.cityName}-AQI-${aqi}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="poster-modal-title"
    >
      <div className="w-full max-w-md atmospheric-plate border border-white/20 p-6 shadow-2xl font-tech">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between hairline-b pb-3 mb-5">
          <div className="flex items-center gap-2 text-xs text-[#E8A858]">
            <Share2 size={14} aria-hidden="true" />
            <h2 id="poster-modal-title" className="uppercase tracking-widest font-semibold text-xs text-[#E8A858]">
              AIR DOSSIER ARTIFACT
            </h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close air dossier artifact modal"
            className="text-[#8E99A8] hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E8A858] p-1 rounded"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Poster Canvas Preview */}
        <div className="bg-[#050B14] border border-white/10 p-6 relative overflow-hidden mb-5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[9px] text-[#8E99A8] uppercase tracking-widest mb-1">
                ATMOSPHERIC SOUNDING
              </div>
              <h3 className="font-display text-3xl font-light text-white tracking-wide">
                {data.cityName}
              </h3>
              <p className="text-[10px] text-[#8DA9C4] mt-0.5">{data.country}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#8E99A8] font-mono">
                {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>

          {/* Huge AQI Display */}
          <div className="my-6">
            <div className="font-display text-7xl font-extralight text-[#E8A858] tracking-tighter leading-none">
              {aqi}
            </div>
            <div className="text-xs uppercase tracking-wider text-white font-medium mt-2">
              {data.statusLabel}
            </div>
            <div className="text-[10px] text-[#8E99A8] mt-1 leading-relaxed">
              {data.statusDescription}
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 hairline-t text-[10px]">
            <div>
              <span className="text-[#8E99A8]">PM2.5 (FINE):</span>
              <span className="text-white font-bold ml-1.5">{data.pm2_5} µg/m³</span>
            </div>
            <div>
              <span className="text-[#8E99A8]">PM10 (COARSE):</span>
              <span className="text-white font-bold ml-1.5">{data.pm10} µg/m³</span>
            </div>
            <div>
              <span className="text-[#8E99A8]">NITROGEN NO2:</span>
              <span className="text-white font-bold ml-1.5">{data.no2} µg/m³</span>
            </div>
            <div>
              <span className="text-[#8E99A8]">OZONE O3:</span>
              <span className="text-white font-bold ml-1.5">{data.o3} µg/m³</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadMock}
            className="flex-1 py-2.5 px-3 bg-[#E8A858] hover:bg-[#d89748] text-[#050B14] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Download Poster (SVG)</span>
          </button>
          <button
            onClick={handleCopyText}
            className="py-2.5 px-4 border border-white/20 hover:border-white/50 text-white text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
