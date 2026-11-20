import React, { useEffect, useState } from 'react';
import { useScrollStore } from '../../store/useScrollStore';

export const IntroLoader: React.FC = () => {
  const [percent, setPercent] = useState(0);
  const [stage, setStage] = useState('CALIBRATING RAYLEIGH SCATTERING RATIOS...');
  const [isVisible, setIsVisible] = useState(true);
  const setIntroComplete = useScrollStore((s) => s.setIntroComplete);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setIntroComplete(true);
          }, 350);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next > 30 && next < 60) {
          setStage('SYNCHRONIZING OPEN-METEO TELEMETRY...');
        } else if (next >= 60 && next < 85) {
          setStage('INITIALIZING GPU PARTICULATE INVERSION...');
        } else if (next >= 85) {
          setStage('ATMOSPHERIC DESCENT VECTOR LOCKED.');
        }

        return Math.min(100, next);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [setIntroComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-8 bg-[#050B14] font-tech text-[#EEF2F6] transition-opacity duration-700 pointer-events-none ${
        percent >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center text-[10px] tracking-widest text-[#8E99A8]">
        <span>NIMBUS // SYSTEM PROTOCOL</span>
        <span>INITIALIZING 3D WORLD</span>
      </div>

      {/* Center Wordmark & Countup */}
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h1 className="font-display text-5xl md:text-7xl font-extralight tracking-[0.2em] text-white">
          NIMBUS
        </h1>
        <div className="text-xs uppercase tracking-widest text-[#8DA9C4]">
          Urban Air Quality Assistant
        </div>
        <div className="font-mono text-3xl font-light text-[#E8A858] pt-2">{percent}%</div>
      </div>

      {/* Bottom Progress Bar & Stage */}
      <div className="w-full max-w-md mx-auto space-y-2">
        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#E8A858] transition-all duration-75 shadow-[0_0_8px_#E8A858]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#8E99A8]">
          <span>{stage}</span>
          <span>35,000 FT</span>
        </div>
      </div>
    </div>
  );
};
