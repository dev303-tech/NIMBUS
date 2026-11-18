import React from 'react';
import { useAqiStore } from '../../store/useAqiStore';
import { useScrollStore } from '../../store/useScrollStore';
import { calculateAqiCategory } from '../../services/openMeteoApi';

/**
 * AccessibleAtmosphericData provides a high-contrast, screen-reader-accessible
 * representation of all dynamic 3D telemetry and environmental data.
 * Complies with WCAG 2.1 AA (Guideline 1.1 Non-text Content & 1.3 Adaptable).
 */
export const AccessibleAtmosphericData: React.FC = () => {
  const data = useAqiStore((s) => s.data);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);
  const activePollutant = useAqiStore((s) => s.activePollutant);
  const activePersona = useAqiStore((s) => s.activePersona);
  const altitudeFt = useScrollStore((s) => s.altitudeFt);
  const altitudeM = useScrollStore((s) => s.altitudeM);
  const chapter = useScrollStore((s) => s.chapter);

  const aqi = getEffectiveAqi();
  const { label, description } = calculateAqiCategory(aqi);

  return (
    <section
      aria-label="Accessible Atmospheric Data & Live Telemetry Summary"
      className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-20 focus-within:left-6 focus-within:z-50 focus-within:bg-[#050B14] focus-within:p-6 focus-within:border focus-within:border-[#E8A858] focus-within:shadow-2xl focus-within:max-w-xl focus-within:text-white"
    >
      <h2>Atmospheric Telemetry for {data.cityName}, {data.country}</h2>
      
      <div aria-live="polite" aria-atomic="true">
        <p>Current Air Quality Index: <strong>{aqi}</strong> (Category: {label}).</p>
        <p>Environmental Summary: {description}</p>
        <p>Current Flight Altitude: {altitudeFt.toLocaleString()} feet ({altitudeM.toLocaleString()} meters), Story Chapter {chapter} of 7.</p>
      </div>

      <table className="w-full text-left border-collapse my-4" summary="Current pollutant concentrations and ambient levels">
        <caption className="font-bold mb-2">Atmospheric Pollutant Breakdown</caption>
        <thead>
          <tr>
            <th scope="col" className="border px-2 py-1">Pollutant</th>
            <th scope="col" className="border px-2 py-1">Concentration</th>
            <th scope="col" className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="border px-2 py-1">PM2.5 (Fine Respirable Particles)</th>
            <td className="border px-2 py-1">{data.pm2_5} µg/m³</td>
            <td className="border px-2 py-1">{activePollutant === 'pm25' ? 'Currently Focused' : 'Active'}</td>
          </tr>
          <tr>
            <th scope="row" className="border px-2 py-1">PM10 (Coarse Inhalable Particles)</th>
            <td className="border px-2 py-1">{data.pm10} µg/m³</td>
            <td className="border px-2 py-1">{activePollutant === 'pm10' ? 'Currently Focused' : 'Active'}</td>
          </tr>
          <tr>
            <th scope="row" className="border px-2 py-1">NO2 (Nitrogen Dioxide)</th>
            <td className="border px-2 py-1">{data.no2} µg/m³</td>
            <td className="border px-2 py-1">{activePollutant === 'no2' ? 'Currently Focused' : 'Active'}</td>
          </tr>
          <tr>
            <th scope="row" className="border px-2 py-1">O3 (Tropospheric Ozone)</th>
            <td className="border px-2 py-1">{data.o3} µg/m³</td>
            <td className="border px-2 py-1">{activePollutant === 'o3' ? 'Currently Focused' : 'Active'}</td>
          </tr>
          <tr>
            <th scope="row" className="border px-2 py-1">SO2 (Sulphur Dioxide)</th>
            <td className="border px-2 py-1">{data.so2} µg/m³</td>
            <td className="border px-2 py-1">Active</td>
          </tr>
          <tr>
            <th scope="row" className="border px-2 py-1">CO (Carbon Monoxide)</th>
            <td className="border px-2 py-1">{data.co} µg/m³</td>
            <td className="border px-2 py-1">Active</td>
          </tr>
        </tbody>
      </table>

      <div>
        <p>Active Physiological Profile: <strong>{activePersona}</strong>.</p>
        <p>Weather Baseline: {data.temperature}°C, {data.humidity}% Humidity, Wind Speed: {data.windSpeed} m/s.</p>
      </div>
    </section>
  );
};
