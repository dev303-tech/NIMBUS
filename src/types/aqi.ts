export interface HourlyForecast {
  time: string;
  hourLabel: string;
  aqi: number;
  pm2_5: number;
  o3: number;
  isGoldenWindow?: boolean;
  isHazardWindow?: boolean;
}

export interface AirQualityData {
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  aqi: number; // US AQI (0 - 500)
  europeanAqi: number;
  pm2_5: number; // µg/m³
  pm10: number; // µg/m³
  no2: number; // µg/m³
  o3: number; // µg/m³
  so2: number; // µg/m³
  co: number; // µg/m³
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  statusLabel: string;
  statusDescription: string;
  forecast: HourlyForecast[];
  isOfflineMock?: boolean;
}

export type PollutantId = 'pm25' | 'pm10' | 'no2' | 'o3';

export interface PollutantDetail {
  id: PollutantId;
  name: string;
  formula: string;
  sizeLabel: string;
  colorHex: string;
  colorVec: [number, number, number];
  particleSize: number;
  sources: string;
  pathology: string;
  whoLimit: number; // 24h mean limit
  unit: string;
}

export type UserPersona = 'runner' | 'asthma' | 'child' | 'senior' | 'cyclist' | 'commuter';

export interface PersonaPrescription {
  persona: UserPersona;
  title: string;
  verdict: 'Go' | 'Careful' | 'Stay in';
  verdictColor: string;
  maskRecommendation: string;
  optimalWindow: string;
  reasoning: string;
  actionChecklist: string[];
}

export interface CityComparison {
  name: string;
  country: string;
  aqi: number;
  pm2_5: number;
  status: string;
  color: string;
}
