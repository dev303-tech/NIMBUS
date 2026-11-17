import { AirQualityData, HourlyForecast } from '../types/aqi';

export function calculateAqiCategory(aqi: number): { label: string; description: string } {
  if (aqi <= 50) {
    return {
      label: 'Pristine Atmospheric Envelope',
      description: 'Exceptional solar transmittance. Minimal aerosol scattering. Ideal respiratory conditions across all altitudes.',
    };
  } else if (aqi <= 100) {
    return {
      label: 'Moderate Transmittance',
      description: 'Acceptable air quality. Faint microscopic condensation layer visible at lower atmospheric boundary layer.',
    };
  } else if (aqi <= 150) {
    return {
      label: 'Thermal Inversion Haze',
      description: 'Unhealthy for sensitive individuals. Elevated fine aerosol particulate concentration trapped under warmer air.',
    };
  } else if (aqi <= 200) {
    return {
      label: 'Combustion Smog',
      description: 'Unhealthy for all groups. Significant photochemical oxidants and secondary organic aerosol scattering.',
    };
  } else if (aqi <= 300) {
    return {
      label: 'Severe Particulate Occlusion',
      description: 'Very unhealthy. Sun disk dims to dull terracotta disc. Intense alveolar penetration risks.',
    };
  } else {
    return {
      label: 'Hazardous Atmospheric Density',
      description: 'Emergency health conditions. Deep umber sky opacity. Ambient air reaches toxic saturation.',
    };
  }
}

export const MOCK_CITIES: Record<string, AirQualityData> = {
  tokyo: {
    cityName: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timestamp: new Date().toISOString(),
    aqi: 28,
    europeanAqi: 22,
    pm2_5: 6.8,
    pm10: 14.2,
    no2: 18.5,
    o3: 42.1,
    so2: 3.2,
    co: 280,
    temperature: 18,
    humidity: 52,
    windSpeed: 4.2,
    statusLabel: 'Pristine Atmospheric Envelope',
    statusDescription: 'Crystal clear maritime air blowing off the Pacific. Pristine high-altitude visibility with crisp cumulus clouds.',
    forecast: generateMockForecast(28),
    isOfflineMock: true,
  },
  london: {
    cityName: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timestamp: new Date().toISOString(),
    aqi: 68,
    europeanAqi: 54,
    pm2_5: 16.4,
    pm10: 24.8,
    no2: 32.1,
    o3: 38.6,
    so2: 5.1,
    co: 410,
    temperature: 14,
    humidity: 68,
    windSpeed: 3.1,
    statusLabel: 'Moderate Transmittance',
    statusDescription: 'Slight urban haze trapped beneath marine stratus layer. Normal ventilation in open park corridors.',
    forecast: generateMockForecast(68),
    isOfflineMock: true,
  },
  losangeles: {
    cityName: 'Los Angeles',
    country: 'United States',
    latitude: 34.0522,
    longitude: -118.2437,
    timestamp: new Date().toISOString(),
    aqi: 134,
    europeanAqi: 82,
    pm2_5: 48.9,
    pm10: 72.1,
    no2: 58.4,
    o3: 88.2,
    so2: 8.4,
    co: 620,
    temperature: 26,
    humidity: 38,
    windSpeed: 2.0,
    statusLabel: 'Thermal Inversion Haze',
    statusDescription: 'Warm air layer capping the LA basin basin, concentrating vehicular emissions and ozone precursor compounds.',
    forecast: generateMockForecast(134),
    isOfflineMock: true,
  },
  delhi: {
    cityName: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timestamp: new Date().toISOString(),
    aqi: 278,
    europeanAqi: 160,
    pm2_5: 182.4,
    pm10: 310.2,
    no2: 94.6,
    o3: 65.4,
    so2: 24.8,
    co: 1450,
    temperature: 29,
    humidity: 62,
    windSpeed: 1.1,
    statusLabel: 'Severe Particulate Occlusion',
    statusDescription: 'Heavy winter inversion trapping agrarian smoke and vehicular particulate. Dense bronze particulate sky.',
    forecast: generateMockForecast(278),
    isOfflineMock: true,
  }
};

function generateMockForecast(baseAqi: number): HourlyForecast[] {
  const result: HourlyForecast[] = [];
  const now = new Date();
  let minAqi = 999;
  let maxAqi = -1;
  let minIdx = 0;
  let maxIdx = 0;

  for (let i = 0; i < 48; i++) {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    const hour = d.getHours();
    // Diurnal variation: worse in morning rush (8am) & evening inversion (8pm), cleaner in afternoon (2-4pm)
    const diurnalFactor = 1 + 0.35 * Math.sin(((hour - 2) / 24) * Math.PI * 2);
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 8;
    const aqi = Math.max(12, Math.round(baseAqi * diurnalFactor + noise));
    const pm2_5 = Math.round(aqi * 0.45 * 10) / 10;
    const o3 = Math.round((20 + (hour >= 11 && hour <= 17 ? 45 : 10)) * 10) / 10;

    if (aqi < minAqi) {
      minAqi = aqi;
      minIdx = i;
    }
    if (aqi > maxAqi) {
      maxAqi = aqi;
      maxIdx = i;
    }

    result.push({
      time: d.toISOString(),
      hourLabel: `${hour.toString().padStart(2, '0')}:00`,
      aqi,
      pm2_5,
      o3,
    });
  }

  if (result[minIdx]) result[minIdx].isGoldenWindow = true;
  if (result[maxIdx]) result[maxIdx].isHazardWindow = true;

  return result;
}

export async function fetchLiveAirQuality(lat: number, lon: number, cityName = 'Local Region', country = ''): Promise<AirQualityData> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5,ozone&timezone=auto&forecast_days=3`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const current = data.current || {};
    const aqi = Math.round(current.us_aqi ?? 45);
    const { label, description } = calculateAqiCategory(aqi);

    // Build hourly forecast from response
    const hourly = data.hourly || {};
    const times: string[] = hourly.time || [];
    const aqis: number[] = hourly.us_aqi || [];
    const pm25s: number[] = hourly.pm2_5 || [];
    const ozones: number[] = hourly.ozone || [];

    const forecast: HourlyForecast[] = [];
    let minAqi = 9999;
    let maxAqi = -1;
    let minIdx = -1;
    let maxIdx = -1;

    for (let i = 0; i < Math.min(48, times.length); i++) {
      const t = times[i];
      const d = new Date(t);
      const val = Math.round(aqis[i] ?? aqi);
      if (val < minAqi) { minAqi = val; minIdx = i; }
      if (val > maxAqi) { maxAqi = val; maxIdx = i; }
      forecast.push({
        time: t,
        hourLabel: `${d.getHours().toString().padStart(2, '0')}:00`,
        aqi: val,
        pm2_5: pm25s[i] ?? (val * 0.4),
        o3: ozones[i] ?? 30,
      });
    }

    if (minIdx >= 0 && forecast[minIdx]) forecast[minIdx].isGoldenWindow = true;
    if (maxIdx >= 0 && forecast[maxIdx]) forecast[maxIdx].isHazardWindow = true;

    return {
      cityName,
      country,
      latitude: lat,
      longitude: lon,
      timestamp: new Date().toISOString(),
      aqi,
      europeanAqi: Math.round(current.european_aqi ?? 30),
      pm2_5: Math.round((current.pm2_5 ?? 12) * 10) / 10,
      pm10: Math.round((current.pm10 ?? 22) * 10) / 10,
      no2: Math.round((current.nitrogen_dioxide ?? 25) * 10) / 10,
      o3: Math.round((current.ozone ?? 45) * 10) / 10,
      so2: Math.round((current.sulphur_dioxide ?? 4) * 10) / 10,
      co: Math.round(current.carbon_monoxide ?? 350),
      statusLabel: label,
      statusDescription: description,
      forecast: forecast.length > 0 ? forecast : generateMockForecast(aqi),
      isOfflineMock: false,
    };
  } catch (err) {
    console.warn('Live API fetch failed, utilizing realistic atmospheric model fallback:', err);
    // Graceful fallback to London or closest realistic state
    const fallback = { ...MOCK_CITIES.london, cityName, country, latitude: lat, longitude: lon };
    return fallback;
  }
}

export async function searchCities(query: string): Promise<Array<{ name: string; country: string; latitude: number; longitude: number }>> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      name: r.name,
      country: r.country || r.admin1 || '',
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  } catch (e) {
    return [];
  }
}
