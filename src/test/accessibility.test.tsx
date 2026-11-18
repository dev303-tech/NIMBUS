import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccessibleAtmosphericData } from '../components/a11y/AccessibleAtmosphericData';
import { TopNav } from '../components/hud/TopNav';
import { CitySearchModal } from '../components/overlays/CitySearchModal';
import { AirPosterModal } from '../components/overlays/AirPosterModal';

describe('WCAG 2.1 AA Accessibility & Screen Reader Compliance', () => {
  describe('AccessibleAtmosphericData Component', () => {
    it('renders accessible live region for assistive technologies', () => {
      render(<AccessibleAtmosphericData />);
      
      const region = screen.getByRole('region', { name: /Accessible Atmospheric Data/i });
      expect(region).toBeTruthy();

      // Heading level 2 for logical document hierarchy
      expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
    });

    it('renders structured semantic table for pollutant concentrations', () => {
      render(<AccessibleAtmosphericData />);
      
      const table = screen.getByRole('table');
      expect(table).toBeTruthy();

      // Table caption present
      expect(screen.getByText('Atmospheric Pollutant Breakdown')).toBeTruthy();

      // Column headers present
      const colHeaders = screen.getAllByRole('columnheader');
      expect(colHeaders.length).toBe(3);

      // Row headers present for key pollutants
      const rowHeaders = screen.getAllByRole('rowheader');
      expect(rowHeaders.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('TopNav Landmark & Interactive Element Accessibility', () => {
    it('has banner role and descriptive accessible labels for all buttons', () => {
      render(<TopNav onOpenSearch={() => {}} onToggleDev={() => {}} isDevOpen={false} />);
      
      expect(screen.getByRole('banner')).toBeTruthy();

      // Check accessible names on interactive buttons
      const searchBtn = screen.getByRole('button', { name: /Current location:/i });
      expect(searchBtn).toBeTruthy();

      const soundBtn = screen.getByRole('button', { name: /atmospheric wind|atmospheric sound/i });
      expect(soundBtn).toBeTruthy();

      const devBtn = screen.getByRole('button', { name: /Toggle developer atmospheric/i });
      expect(devBtn).toBeTruthy();
    });

    it('includes live status indicator for real-time AQI updates', () => {
      render(<TopNav onOpenSearch={() => {}} onToggleDev={() => {}} isDevOpen={false} />);
      
      const liveAqi = screen.getByRole('status');
      expect(liveAqi).toBeTruthy();
      expect(liveAqi.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('Modal Dialog WCAG Compliance', () => {
    it('CitySearchModal has dialog role, aria-modal, and accessible labelling', () => {
      render(<CitySearchModal isOpen={true} onClose={() => {}} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.getAttribute('aria-labelledby')).toBe('city-search-title');

      const input = screen.getByRole('textbox', { name: /Search city by name/i });
      expect(input).toBeTruthy();

      const closeBtn = screen.getByRole('button', { name: /Close coordinate selection/i });
      expect(closeBtn).toBeTruthy();
    });

    it('AirPosterModal has dialog role, aria-modal, and accessible labelling', () => {
      render(<AirPosterModal isOpen={true} onClose={() => {}} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.getAttribute('aria-labelledby')).toBe('poster-modal-title');

      const closeBtn = screen.getByRole('button', { name: /Close air dossier/i });
      expect(closeBtn).toBeTruthy();
    });
  });
});
