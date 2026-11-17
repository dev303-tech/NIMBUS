import { create } from 'zustand';
import { AirQualityData, PollutantId, UserPersona, CityComparison } from '../types/aqi';
import { MOCK_CITIES, fetchLiveAirQuality } from '../services/openMeteoApi';

interface AqiState {
  data: AirQualityData;
  isLoading: boolean;
  error: string | null;
  devAqiOverride: number | null;
  activePollutant: PollutantId;
  activePersona: UserPersona;
  forecastScrubIndex: number;
  comparisonCities: CityComparison[];

  // Computed values
  getEffectiveAqi: () => number;
  getPollutionNorm: () => number; // 0.0 to 1.0

  // Actions
  setDevAqiOverride: (val: number | null) => void;
  setActivePollutant: (id: PollutantId) => void;
  setActivePersona: (p: UserPersona) => void;
  setForecastScrubIndex: (idx: number) => void;
  loadCity: (lat: number, lon: number, name: string, country?: string) => Promise<void>;
  loadMockCity: (key: string) => void;
  addComparisonCity: (city: CityComparison) => void;
  removeComparisonCity: (name: string) => void;
}

const DEFAULT_COMPARISONS: CityComparison[] = [
  { name: 'Reykjavik', country: 'Iceland', aqi: 14, pm2_5: 2.8, status: 'Pristine Arctic Air', color: '#8DA9C4' },
  { name: 'Tokyo', country: 'Japan', aqi: 28, pm2_5: 6.8, status: 'Pristine Maritime Air', color: '#5296D5' },
  { name: 'London', country: 'UK', aqi: 68, pm2_5: 16.4, status: 'Moderate Transmittance', color: '#B8A882' },
  { name: 'New Delhi', country: 'India', aqi: 278, pm2_5: 182.4, status: 'Severe Particulate Occlusion', color: '#A0381E' },
];

export const useAqiStore = create<AqiState>((set, get) => ({
  data: MOCK_CITIES.london,
  isLoading: false,
  error: null,
  devAqiOverride: null,
  activePollutant: 'pm25',
  activePersona: 'runner',
  forecastScrubIndex: 0,
  comparisonCities: DEFAULT_COMPARISONS,

  getEffectiveAqi: () => {
    const { devAqiOverride, data } = get();
    return devAqiOverride !== null ? devAqiOverride : data.aqi;
  },

  getPollutionNorm: () => {
    const aqi = get().getEffectiveAqi();
    // Normalize: 0 = pristine (0-30), 1 = severe pollution (300+)
    return Math.min(1.0, Math.max(0.0, aqi / 300));
  },

  setDevAqiOverride: (val) => set({ devAqiOverride: val }),
  setActivePollutant: (id) => set({ activePollutant: id }),
  setActivePersona: (p) => set({ activePersona: p }),
  setForecastScrubIndex: (idx) => set({ forecastScrubIndex: idx }),

  loadCity: async (lat, lon, name, country = '') => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchLiveAirQuality(lat, lon, name, country);
      set({ data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch telemetry', isLoading: false });
    }
  },

  loadMockCity: (key: string) => {
    const city = MOCK_CITIES[key] || MOCK_CITIES.london;
    set({ data: city, devAqiOverride: null });
  },

  addComparisonCity: (city) => {
    const current = get().comparisonCities;
    if (current.find(c => c.name.toLowerCase() === city.name.toLowerCase())) return;
    set({ comparisonCities: [...current.slice(-2), city] });
  },

  removeComparisonCity: (name) => {
    set({ comparisonCities: get().comparisonCities.filter(c => c.name !== name) });
  }
}));
