import { describe, it, expect, beforeEach } from 'vitest';
import { useScrollStore } from '../store/useScrollStore';

describe('useScrollStore Trajectory & Altitude Calibration', () => {
  beforeEach(() => {
    useScrollStore.getState().setProgress(0);
    useScrollStore.setState({ scrollVelocity: 0, isIntroComplete: false });
  });

  it('initializes at the Stratosphere (35,000 ft, Chapter 1, 62° FOV)', () => {
    const state = useScrollStore.getState();
    expect(state.progress).toBe(0);
    expect(state.chapter).toBe(1);
    expect(state.altitudeFt).toBe(35000);
    expect(state.altitudeM).toBe(10668);
    expect(state.fov).toBe(62);
  });

  it('calibrates altitude transitions across story chapters', () => {
    const store = useScrollStore.getState();

    // Cloud deck entry (~0.18 progress)
    store.setProgress(0.18);
    expect(useScrollStore.getState().altitudeFt).toBeCloseTo(18000, -2);
    expect(useScrollStore.getState().chapter).toBe(2);

    // Smog layer (~0.35 progress)
    store.setProgress(0.35);
    expect(useScrollStore.getState().altitudeFt).toBeCloseTo(6500, -2);
    expect(useScrollStore.getState().chapter).toBe(3);

    // Urban skyline (~0.52 progress)
    store.setProgress(0.52);
    expect(useScrollStore.getState().altitudeFt).toBeCloseTo(18000 * 0.1, -2);
    expect(useScrollStore.getState().chapter).toBe(4);

    // Street level touchdown (1.0 progress)
    store.setProgress(1.0);
    expect(useScrollStore.getState().altitudeFt).toBe(0);
    expect(useScrollStore.getState().altitudeM).toBe(0);
    expect(useScrollStore.getState().chapter).toBe(7);
  });

  it('morphs FOV continuously from wide 62° down to telephoto 32°', () => {
    const store = useScrollStore.getState();

    store.setProgress(0);
    expect(useScrollStore.getState().fov).toBe(62);

    store.setProgress(0.3);
    expect(useScrollStore.getState().fov).toBeCloseTo(50, 1);

    store.setProgress(0.7);
    expect(useScrollStore.getState().fov).toBeCloseTo(38, 1);

    store.setProgress(1.0);
    expect(useScrollStore.getState().fov).toBeCloseTo(32, 1);
  });

  it('clamps progress strictly between 0.0 and 1.0', () => {
    const store = useScrollStore.getState();

    store.setProgress(-0.5);
    expect(useScrollStore.getState().progress).toBe(0);

    store.setProgress(1.5);
    expect(useScrollStore.getState().progress).toBe(1);
  });

  it('updates mouse normalization coordinates', () => {
    const store = useScrollStore.getState();
    store.setMouseNorm(0.45, -0.65);
    expect(useScrollStore.getState().mouseNorm).toEqual({ x: 0.45, y: -0.65 });
  });
});
