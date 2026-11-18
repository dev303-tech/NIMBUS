import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateAqiCategory,
  MOCK_CITIES,
  searchCities,
  fetchLiveAirQuality,
} from '../services/openMeteoApi';

describe('OpenMeteo API & Environmental Algorithms', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('calculateAqiCategory', () => {
    it('categorizes pristine air (AQI <= 50)', () => {
      const cat = calculateAqiCategory(35);
      expect(cat.label).toBe('Pristine Atmospheric Envelope');
      expect(cat.description).toContain('Exceptional solar transmittance');
    });

    it('categorizes moderate air (51 <= AQI <= 100)', () => {
      const cat = calculateAqiCategory(75);
      expect(cat.label).toBe('Moderate Transmittance');
      expect(cat.description).toContain('Acceptable air quality');
    });

    it('categorizes thermal inversion haze (101 <= AQI <= 150)', () => {
      const cat = calculateAqiCategory(125);
      expect(cat.label).toBe('Thermal Inversion Haze');
      expect(cat.description).toContain('sensitive individuals');
    });

    it('categorizes combustion smog (151 <= AQI <= 200)', () => {
      const cat = calculateAqiCategory(180);
      expect(cat.label).toBe('Combustion Smog');
      expect(cat.description).toContain('Unhealthy for all groups');
    });

    it('categorizes severe particulate occlusion (201 <= AQI <= 300)', () => {
      const cat = calculateAqiCategory(260);
      expect(cat.label).toBe('Severe Particulate Occlusion');
      expect(cat.description).toContain('Very unhealthy');
    });

    it('categorizes hazardous atmospheric density (AQI > 300)', () => {
      const cat = calculateAqiCategory(380);
      expect(cat.label).toBe('Hazardous Atmospheric Density');
      expect(cat.description).toContain('Emergency health conditions');
    });
  });

  describe('MOCK_CITIES data integrity', () => {
    it('contains all required major metropolitan nodes with complete telemetry', () => {
      const cities = ['tokyo', 'london', 'losangeles', 'delhi'];
      cities.forEach((cityKey) => {
        const city = MOCK_CITIES[cityKey];
        expect(city).toBeDefined();
        expect(city.cityName).toBeTruthy();
        expect(city.country).toBeTruthy();
        expect(city.aqi).toBeGreaterThan(0);
        expect(city.pm2_5).toBeGreaterThan(0);
        expect(city.pm10).toBeGreaterThan(0);
        expect(city.no2).toBeGreaterThan(0);
        expect(city.o3).toBeGreaterThan(0);
        expect(city.forecast.length).toBe(48);
      });
    });

    it('generates 48-hour forecasts with valid hourly timeline data', () => {
      const tokyo = MOCK_CITIES.tokyo;
      expect(tokyo.forecast.length).toBe(48);
      expect(tokyo.forecast[0].hourLabel).toMatch(/^\d{2}:00$/);
      expect(tokyo.forecast[0].aqi).toBeGreaterThan(0);
    });
  });

  describe('searchCities', () => {
    it('returns empty array on short queries', async () => {
      const res = await searchCities('a');
      expect(res).toEqual([]);
    });

    it('handles city queries gracefully with fallback', async () => {
      const results = await searchCities('London');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('fetchLiveAirQuality with network interception', () => {
    it('falls back to offline mock dataset when network errors occur', async () => {
      const globalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network disconnected'));

      const data = await fetchLiveAirQuality(35.6762, 139.6503, 'Tokyo');
      expect(data).toBeDefined();
      expect(data.cityName).toBe('Tokyo');

      globalThis.fetch = globalFetch;
    });
  });
});
