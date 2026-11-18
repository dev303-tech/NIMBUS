import { describe, it, expect, beforeEach } from 'vitest';
import { useAqiStore } from '../store/useAqiStore';
import { MOCK_CITIES } from '../services/openMeteoApi';

describe('useAqiStore State & Action Suite', () => {
  beforeEach(() => {
    useAqiStore.setState({
      data: MOCK_CITIES.london,
      isLoading: false,
      error: null,
      devAqiOverride: null,
      activePollutant: 'pm25',
      activePersona: 'runner',
      forecastScrubIndex: 0,
    });
  });

  it('initializes with default London telemetry', () => {
    const state = useAqiStore.getState();
    expect(state.data.cityName).toBe('London');
    expect(state.getEffectiveAqi()).toBe(MOCK_CITIES.london.aqi);
    expect(state.activePollutant).toBe('pm25');
    expect(state.activePersona).toBe('runner');
  });

  it('correctly calculates pollution normalization between 0.0 and 1.0', () => {
    const store = useAqiStore.getState();
    
    expect(store.getPollutionNorm()).toBeCloseTo(68 / 300, 2);

    store.setDevAqiOverride(30);
    expect(useAqiStore.getState().getPollutionNorm()).toBeCloseTo(0.1, 2);

    store.setDevAqiOverride(400);
    expect(useAqiStore.getState().getPollutionNorm()).toBe(1.0);

    store.setDevAqiOverride(0);
    expect(useAqiStore.getState().getPollutionNorm()).toBe(0.0);
  });

  it('updates active pollutant correctly', () => {
    const store = useAqiStore.getState();
    store.setActivePollutant('no2');
    expect(useAqiStore.getState().activePollutant).toBe('no2');

    store.setActivePollutant('o3');
    expect(useAqiStore.getState().activePollutant).toBe('o3');
  });

  it('updates active user persona profile', () => {
    const store = useAqiStore.getState();
    store.setActivePersona('asthma');
    expect(useAqiStore.getState().activePersona).toBe('asthma');

    store.setActivePersona('cyclist');
    expect(useAqiStore.getState().activePersona).toBe('cyclist');
  });

  it('updates forecast timeline scrub index', () => {
    const store = useAqiStore.getState();
    store.setForecastScrubIndex(14);
    expect(useAqiStore.getState().forecastScrubIndex).toBe(14);
  });

  it('loads preset mock cities seamlessly', () => {
    const store = useAqiStore.getState();
    store.loadMockCity('tokyo');
    expect(useAqiStore.getState().data.cityName).toBe('Tokyo');
    expect(useAqiStore.getState().getEffectiveAqi()).toBe(MOCK_CITIES.tokyo.aqi);

    store.loadMockCity('delhi');
    expect(useAqiStore.getState().data.cityName).toBe('New Delhi');
    expect(useAqiStore.getState().getEffectiveAqi()).toBe(MOCK_CITIES.delhi.aqi);
  });

  it('handles adding and removing comparison cities (capped to 3 nodes)', () => {
    const store = useAqiStore.getState();

    store.addComparisonCity({
      name: 'Oslo',
      country: 'Norway',
      aqi: 18,
      pm2_5: 3.2,
      status: 'Pristine Arctic Air',
      color: '#A0D2EB',
    });

    // Capped at 3 maximum visible 3D columns
    expect(useAqiStore.getState().comparisonCities.length).toBeLessThanOrEqual(3);
    expect(useAqiStore.getState().comparisonCities.some(c => c.name === 'Oslo')).toBe(true);

    store.removeComparisonCity('Oslo');
    expect(useAqiStore.getState().comparisonCities.some(c => c.name === 'Oslo')).toBe(false);
  });
});
