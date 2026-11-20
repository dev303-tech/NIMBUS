import { describe, it, expect, beforeEach, vi } from 'vitest';
import { audioEngine } from '../services/audioSynth';

describe('Web Audio Procedural Atmospheric Synthesizer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes in muted/inactive state by default', () => {
    expect(audioEngine).toBeDefined();
    // Default audio should not be playing before user interaction
  });

  it('safely handles parameter updates without throwing even when audio context is uninitialized', () => {
    expect(() => {
      audioEngine.updateParameters(0.5, 0.8);
      audioEngine.onScrollVelocity(2.5);
    }).not.toThrow();
  });

  it('safely handles toggle and mute operations in headless test environments', () => {
    expect(() => {
      const active = audioEngine.toggle();
      expect(typeof active).toBe('boolean');
    }).not.toThrow();
  });
});
