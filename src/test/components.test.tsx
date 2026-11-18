import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AltitudeMeter } from '../components/hud/AltitudeMeter';
import { DevAqiSlider } from '../components/hud/DevAqiSlider';
import { useScrollStore } from '../store/useScrollStore';
import { useAqiStore } from '../store/useAqiStore';

describe('HUD & UI Component Rendering Suites', () => {
  beforeEach(() => {
    useScrollStore.getState().setProgress(0);
    useAqiStore.setState({ devAqiOverride: null });
  });

  describe('AltitudeMeter', () => {
    it('renders current altitude metrics in feet and meters', () => {
      render(<AltitudeMeter />);
      expect(screen.getByText(/ALTITUDE ENVELOPE/i)).toBeTruthy();
      expect(screen.getByText('35,000')).toBeTruthy();
      expect(screen.getByText(/10,668 M/i)).toBeTruthy();
    });

    it('renders all 7 altitude checkpoint labels', () => {
      render(<AltitudeMeter />);
      const checkpoints = [
        'STRATOSPHERE',
        'CLOUD DECK',
        'THE LAYER',
        'THE CITY',
        'THE FORECAST',
        'YOUR AIR',
        'STREET LEVEL',
      ];
      checkpoints.forEach((cp) => {
        expect(screen.getByText(cp)).toBeTruthy();
      });
    });
  });

  describe('DevAqiSlider', () => {
    it('returns null when closed', () => {
      const { container } = render(<DevAqiSlider isOpen={false} onClose={() => {}} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders slider controls and atmospheric presets when opened', () => {
      render(<DevAqiSlider isOpen={true} onClose={() => {}} />);
      expect(screen.getByText(/DEV ATMOSPHERIC MAPPER/i)).toBeTruthy();
      expect(screen.getByText(/Pristine \(28\)/i)).toBeTruthy();
      expect(screen.getByText(/Hazardous \(420\)/i)).toBeTruthy();
    });

    it('triggers preset AQI selection when clicking preset buttons', () => {
      render(<DevAqiSlider isOpen={true} onClose={() => {}} />);
      const pristineBtn = screen.getByText(/Pristine \(28\)/i);
      fireEvent.click(pristineBtn);

      expect(useAqiStore.getState().devAqiOverride).toBe(28);
    });
  });
});
