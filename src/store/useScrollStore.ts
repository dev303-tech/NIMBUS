import { create } from 'zustand';

interface ScrollState {
  progress: number; // 0.0 to 1.0
  chapter: number; // 1 to 7
  altitudeFt: number; // 35000 to 0
  altitudeM: number; // 10668 to 0
  mouseNorm: { x: number; y: number }; // -1 to 1
  scrollVelocity: number;
  fov: number; // 65 down to 32
  isIntroComplete: boolean;

  setProgress: (p: number) => void;
  setScrollVelocity: (v: number) => void;
  setMouseNorm: (x: number, y: number) => void;
  setIntroComplete: (val: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  chapter: 1,
  altitudeFt: 35000,
  altitudeM: 10668,
  mouseNorm: { x: 0, y: 0 },
  scrollVelocity: 0,
  fov: 62,
  isIntroComplete: false,

  setProgress: (rawProgress) => {
    const p = Math.max(0, Math.min(1, rawProgress));
    const chapter = Math.min(7, Math.floor(p * 7) + 1);

    // Exact piece-wise altitude interpolation aligned to story chapters
    let altitudeFt = 35000;
    if (p < 0.18) {
      altitudeFt = Math.round(35000 - (p / 0.18) * (35000 - 18000));
    } else if (p < 0.35) {
      altitudeFt = Math.round(18000 - ((p - 0.18) / 0.17) * (18000 - 6500));
    } else if (p < 0.52) {
      altitudeFt = Math.round(6500 - ((p - 0.35) / 0.17) * (6500 - 1800));
    } else if (p < 0.68) {
      altitudeFt = Math.round(1800 - ((p - 0.52) / 0.16) * (1800 - 800));
    } else if (p < 0.83) {
      altitudeFt = Math.round(800 - ((p - 0.68) / 0.15) * (800 - 250));
    } else {
      altitudeFt = Math.round(Math.max(0, 250 - ((p - 0.83) / 0.17) * 250));
    }
    const altitudeM = Math.round(altitudeFt * 0.3048);

    // Dynamic Cinematic FOV Modulation:
    // Stratosphere: wide 62° -> Cloud deck: 50° -> City: 38° -> Street Level: 32° telephoto
    let fov = 62;
    if (p < 0.3) {
      fov = 62 - (p / 0.3) * 12; // 62 -> 50
    } else if (p < 0.7) {
      fov = 50 - ((p - 0.3) / 0.4) * 12; // 50 -> 38
    } else {
      fov = 38 - ((p - 0.7) / 0.3) * 6; // 38 -> 32
    }

    set({
      progress: p,
      chapter,
      altitudeFt,
      altitudeM,
      fov,
    });
  },

  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  setMouseNorm: (x, y) => set({ mouseNorm: { x, y } }),
  setIntroComplete: (val) => set({ isIntroComplete: val }),
}));
