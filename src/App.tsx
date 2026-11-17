import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { SceneContainer } from './components/canvas/SceneContainer';
import { TopNav } from './components/hud/TopNav';
import { AltitudeMeter } from './components/hud/AltitudeMeter';
import { DevAqiSlider } from './components/hud/DevAqiSlider';
import { CitySearchModal } from './components/overlays/CitySearchModal';
import { AirPosterModal } from './components/overlays/AirPosterModal';
import { IntroLoader } from './components/overlays/IntroLoader';

// Chapters
import { Chapter1Stratosphere } from './components/chapters/Chapter1Stratosphere';
import { Chapter2CloudDeck } from './components/chapters/Chapter2CloudDeck';
import { Chapter3TheLayer } from './components/chapters/Chapter3TheLayer';
import { Chapter4TheCity } from './components/chapters/Chapter4TheCity';
import { Chapter5TheForecast } from './components/chapters/Chapter5TheForecast';
import { Chapter6YourAir } from './components/chapters/Chapter6YourAir';
import { Chapter7StreetLevel } from './components/chapters/Chapter7StreetLevel';

import { useScrollStore } from './store/useScrollStore';
import { useAqiStore } from './store/useAqiStore';
import { audioEngine } from './services/audioSynth';

export const App: React.FC = () => {
  const setProgress = useScrollStore((s) => s.setProgress);
  const setScrollVelocity = useScrollStore((s) => s.setScrollVelocity);
  const setMouseNorm = useScrollStore((s) => s.setMouseNorm);
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isDevOpen, setIsDevOpen] = useState(false);

  const setDevAqiOverride = useAqiStore((s) => s.setDevAqiOverride);

  // Expose store handle on window for automated verification and testing
  useEffect(() => {
    (window as any).__nimbus = {
      setAqi: (val: number | null) => setDevAqiOverride(val),
      openDev: () => setIsDevOpen(true),
    };
  }, [setDevAqiOverride]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    const handleScroll = (e?: any) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const p = totalScroll > 0 ? scrollY / totalScroll : 0;
      setProgress(p);

      const velocity = e?.velocity || 0;
      setScrollVelocity(velocity);

      // Modulate audio engine
      const pollution = getPollutionNorm();
      const altitude = Math.max(0, 1 - p);
      audioEngine.updateParameters(pollution, altitude);
      if (Math.abs(velocity) > 0.5) {
        audioEngine.onScrollVelocity(velocity);
      }
    };

    lenis.on('scroll', handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Initial check
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [setProgress, getPollutionNorm]);

  // Track Mouse for 3D Camera Parallax and Particle Repulsion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouseNorm(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMouseNorm]);

  return (
    <div className="relative min-h-screen w-full bg-[#050B14] text-[#EEF2F6] overflow-x-hidden selection:bg-[#E8A858] selection:text-[#050B14]">
      {/* Intro Loader Animation */}
      <IntroLoader />

      {/* Subtle Atmospheric Film Grain */}
      <div className="film-grain" />

      {/* 3D WebGL Canvas Layer (Fixed Background) */}
      <SceneContainer />

      {/* Fixed In-World HUD Elements */}
      <TopNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleDev={() => setIsDevOpen(!isDevOpen)}
        isDevOpen={isDevOpen}
      />
      <AltitudeMeter />
      <DevAqiSlider isOpen={isDevOpen} onClose={() => setIsDevOpen(false)} />

      {/* Overlays / Modals */}
      <CitySearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AirPosterModal isOpen={isPosterOpen} onClose={() => setIsPosterOpen(false)} />

      {/* Scrollable Storyboard DOM Chapters (7 Pinned / Scrubbed Stages) */}
      <main className="relative z-10 w-full pointer-events-auto">
        <Chapter1Stratosphere />
        <Chapter2CloudDeck />
        <Chapter3TheLayer />
        <Chapter4TheCity />
        <Chapter5TheForecast />
        <Chapter6YourAir />
        <Chapter7StreetLevel onOpenPoster={() => setIsPosterOpen(true)} />
      </main>
    </div>
  );
};
export default App;
