import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chapter1Stratosphere } from '../components/chapters/Chapter1Stratosphere';
import { Chapter2CloudDeck } from '../components/chapters/Chapter2CloudDeck';
import { Chapter4TheCity } from '../components/chapters/Chapter4TheCity';
import { Chapter5TheForecast } from '../components/chapters/Chapter5TheForecast';
import { Chapter7StreetLevel } from '../components/chapters/Chapter7StreetLevel';
import { useScrollStore } from '../store/useScrollStore';
import { useAqiStore } from '../store/useAqiStore';
import { MOCK_CITIES } from '../services/openMeteoApi';

describe('Story Chapters Render & Interaction Suites', () => {
  beforeEach(() => {
    useAqiStore.setState({
      data: MOCK_CITIES.london,
      devAqiOverride: null,
      activePersona: 'runner',
      activePollutant: 'pm25',
    });
    useScrollStore.getState().setProgress(0);
  });

  describe('Chapter1Stratosphere', () => {
    it('renders hero title and stratospheric sounding data', () => {
      render(<Chapter1Stratosphere />);
      expect(screen.getByText('NIMBUS')).toBeTruthy();
      expect(screen.getByText(/STRATOSPHERIC SOUNDING/i)).toBeTruthy();
      expect(screen.getByText(/RAYLEIGH SCATTERING DOMINANT/i)).toBeTruthy();
    });
  });

  describe('Chapter2CloudDeck', () => {
    it('renders city title and volumetric condensation deck banner', () => {
      useScrollStore.setState({ chapter: 2 });
      render(<Chapter2CloudDeck />);
      expect(screen.getByText('London')).toBeTruthy();
      expect(screen.getByText(/VOLUMETRIC CONDENSATION DECK/i)).toBeTruthy();
    });
  });

  describe('Chapter4TheCity', () => {
    it('renders urban canyon, CleanPath navigation, and microclimates', () => {
      render(<Chapter4TheCity />);
      expect(screen.getByText(/The Urban Canyon/i)).toBeTruthy();
      expect(screen.getByText(/CLEANPATH™ NAVIGATION/i)).toBeTruthy();
      expect(screen.getByText(/Transit Canyon/i)).toBeTruthy();
    });
  });

  describe('Chapter5TheForecast', () => {
    it('renders diurnal cycle scrubber and 48-hour forecast timeline', () => {
      render(<Chapter5TheForecast />);
      expect(screen.getByText(/The 48-Hour Arc/i)).toBeTruthy();
      expect(screen.getByText(/PROJECTED TIMELINE/i)).toBeTruthy();
    });
  });

  describe('Chapter7StreetLevel', () => {
    it('renders comparative ground columns and dossier share CTA', () => {
      render(<Chapter7StreetLevel onOpenPoster={() => {}} />);
      expect(screen.getByText(/Street Level Horizon/i)).toBeTruthy();
      expect(screen.getByText(/3D Comparative Air Column Array/i)).toBeTruthy();
      expect(screen.getByText(/Generate Air Dossier Poster/i)).toBeTruthy();
    });
  });
});
