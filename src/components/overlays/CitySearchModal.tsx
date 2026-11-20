import React, { useState } from 'react';
import { Search, MapPin, X, Navigation, Check } from 'lucide-react';
import { useAqiStore } from '../../store/useAqiStore';
import { searchCities, MOCK_CITIES } from '../../services/openMeteoApi';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    Array<{ name: string; country: string; latitude: number; longitude: number }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const loadCity = useAqiStore((s) => s.loadCity);
  const loadMockCity = useAqiStore((s) => s.loadMockCity);
  const currentCity = useAqiStore((s) => s.data.cityName);

  if (!isOpen) return null;

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const res = await searchCities(val);
    setResults(res);
    setIsSearching(false);
  };

  const handleSelectCity = async (c: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    await loadCity(c.latitude, c.longitude, c.name, c.country);
    onClose();
  };

  const handleSelectMock = (key: string) => {
    loadMockCity(key);
    onClose();
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await loadCity(pos.coords.latitude, pos.coords.longitude, 'Detected Location');
        onClose();
      },
      (err) => {
        setGeoError(`Location access denied (${err.message}). Showing global presets.`);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-search-title"
    >
      <div className="w-full max-w-lg atmospheric-plate border border-white/15 p-6 shadow-2xl font-tech">
        {/* Header */}
        <div className="flex items-center justify-between hairline-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#E8A858]" aria-hidden="true" />
            <h2
              id="city-search-title"
              className="font-display text-lg tracking-wide text-white font-normal"
            >
              Atmospheric Coordinate Select
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close coordinate selection modal"
            className="text-[#8E99A8] hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E8A858] p-1 rounded"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E99A8]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search world city (e.g. Paris, Tokyo, Zurich)..."
            aria-label="Search city by name"
            className="w-full bg-[#050B14]/80 border border-white/20 pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#8E99A8] outline-none focus:border-[#E8A858] focus-visible:ring-2 focus-visible:ring-[#E8A858] transition-colors"
            autoFocus
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8E99A8]">
              QUERYING...
            </span>
          )}
        </div>

        {/* Browser Geolocation Button */}
        <button
          onClick={handleGeolocation}
          className="w-full mb-4 px-3 py-2 border border-white/10 hover:border-[#E8A858]/50 flex items-center justify-center gap-2 text-xs text-[#8DA9C4] hover:text-white transition-colors cursor-pointer"
        >
          <Navigation size={12} />
          <span>Detect Ambient Coordinates (GPS Geolocation)</span>
        </button>

        {geoError && (
          <div className="text-[10px] text-[#E05318] mb-3 hairline-b pb-2">{geoError}</div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-4 max-h-48 overflow-y-auto space-y-1 hairline-b pb-3">
            <div className="text-[9px] uppercase tracking-wider text-[#8E99A8] mb-1">
              Search Results
            </div>
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelectCity(r)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center justify-between border border-transparent hover:border-white/10 transition-all cursor-pointer"
              >
                <span className="text-white font-medium">
                  {r.name}, <span className="text-[#8E99A8]">{r.country}</span>
                </span>
                <span className="text-[10px] text-[#8E99A8]">
                  {r.latitude.toFixed(1)}°, {r.longitude.toFixed(1)}°
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Global Atmosphere Presets */}
        <div>
          <div className="text-[9px] uppercase tracking-widest text-[#8E99A8] mb-2">
            Global Atmospheric Presets
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MOCK_CITIES).map(([key, city]) => {
              const isSelected = currentCity.toLowerCase() === city.cityName.toLowerCase();
              return (
                <button
                  key={key}
                  onClick={() => handleSelectMock(key)}
                  className={`p-2.5 text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#E8A858] bg-[#E8A858]/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">{city.cityName}</span>
                    {isSelected && <Check size={12} className="text-[#E8A858]" />}
                  </div>
                  <div className="text-[10px] text-[#8E99A8] mt-1 flex items-center justify-between">
                    <span>{city.country}</span>
                    <span className="font-bold text-white">AQI {city.aqi}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
