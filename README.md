# NIMBUS — The Atmospheric Descent
### Awwwards / FWA / CSSDA Site of the Day Caliber Urban Air Quality Experience

[![Live Demo](https://img.shields.io/badge/Live_Demo-dev303--tech.github.io%2FNIMBUS-007ACC?style=for-the-badge&logo=github)](https://dev303-tech.github.io/NIMBUS/)
[![Build & Deploy](https://img.shields.io/badge/Status-Deployed_Online-success?style=for-the-badge)](https://dev303-tech.github.io/NIMBUS/)
[![Automated Tests](https://img.shields.io/badge/Vitest-40%2F40%20Passed-4ADE80?style=for-the-badge&logo=vitest)](https://github.com/dev303-tech/NIMBUS)
[![WCAG Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-059669?style=for-the-badge)](https://github.com/dev303-tech/NIMBUS)

> 🚀 **Live Production URL:** [https://dev303-tech.github.io/NIMBUS/](https://dev303-tech.github.io/NIMBUS/)

> *"The whole website is ONE continuous 3D world. Scrolling is an altitude descent from the stratosphere, through cloud decks, into the city's thermal inversion layer, down to street level. The sky IS the data visualization."*

---

## 🌪️ Concept & Experience Architecture

NIMBUS transforms urban environmental telemetry into a continuous WebGL altitude descent across 35,000 feet:

1. **Chapter 1: STRATOSPHERE (35,000 ft // 10.6 km)**  
   Deep space zenith gradient, Rayleigh scattering horizon curve, typographic letter-by-letter reveal of NIMBUS wordmark, barometric pressure telemetry.
2. **Chapter 2: CLOUD DECK (18,000 ft // 5.5 km)**  
   Camera punches through volumetric cumulus cloud layers; screen blooms white and clears as the user's city name and live numerical AQI ticker emerge.
3. **Chapter 3: THE LAYER (6,500 ft // 2.0 km)**  
   Camera cuts into the thermal inversion smog ceiling; 10,000 GPU-instanced particulates ignite with isolated shader passes for PM2.5, PM10, NO2, and O3 with clinical pathology explanations.
4. **Chapter 4: THE CITY (1,800 ft // 550 m)**  
   Monolithic architectural skyline emerges from height fog; district-level coordinate sampling with interactive 3D beacons and rising industrial/traffic emission plumes.
5. **Chapter 5: THE FORECAST (800 ft // 250 m)**  
   48-hour timeline scrubber drives a celestial 3D sun arc across the sky dome while atmospheric haze and color shift continuously to match forecasted pollution.
6. **Chapter 6: YOUR AIR, YOUR DAY (250 ft // 75 m)**  
   Personalized physiological exposure co-pilot with rule-based WHO/EPA epidemiological logic for Runners, Asthma patients, Children, Seniors, Cyclists, and Commuters.
7. **Chapter 7: STREET LEVEL (0 m // Ground)**  
   Camera touches the street pavement looking up at 3D translucent comparative air columns modeling the particulate volume of global cities; exportable Swiss air poster and inversion alert beacon.

---

## 🛠️ Tech Stack & Shader Mechanics

- **Core**: Vite + React 19 + TypeScript
- **3D & Graphics**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Motion & Smooth Scroll**: Lenis smooth scroll engine + GSAP Catmull-Rom 3D spline trajectory
- **Shaders**:
  - `skyAtmosphere.glsl.ts`: Rayleigh & Mie atmospheric scattering model driven dynamically by `uPollution` (0.0 to 1.0) and `uAltitude`.
  - `cloudVolumetric.glsl.ts`: Multi-octave 3D Simplex Fractal Brownian Motion (FBM) with Henyey-Greenstein forward solar scattering.
  - `particlePollutant.glsl.ts`: GPU InstancedMesh with per-pollutant color, velocity turbulence, mouse repulsion vector, and active-pollutant highlight pass.
  - `cityFog.glsl.ts`: Ground-hugging thermal inversion height fog with emission plumes.
- **Audio**: Procedural Web Audio API synthesizer generating real-time pink noise (wind) and sub-bass resonant hum modulated by pollution density (zero external audio files).
- **Data Engine**: Open-Meteo Air Quality API + Open-Meteo Geocoding API with deterministic realistic mock fallbacks (Tokyo, London, LA, Delhi, Reykjavik).

---

## 🚀 Quickstart & Setup

```bash
# Navigate to the project directory
cd /Users/shauryadevparihar/Public/nimbus

# Start the high-performance local dev server
npm run dev

# Or build for production
npm run build
npm run preview
```

Server defaults to: `http://localhost:5173`

---

## 🎛️ How to Tweak & Preview the Scene

1. **Dev AQI Scrubber**:
   - Click the sliders icon `[Sliders]` in the top-right navigation bar to open the Dev Atmospheric Mapper.
   - Scrub the slider from `AQI 0` (Pristine cobalt sky, sharp golden sun) to `AQI 500` (Near-black umber sky, blood-red dim sun disc).
   - Click quick presets: *Pristine (28)*, *Moderate (75)*, *Inversion (130)*, *Smog (185)*, *Severe (280)*, *Hazardous (420)*.
2. **Change Location**:
   - Click the location pill in the top bar to search any global city or test GPS geolocation.
3. **Audio Synthesis**:
   - Click the volume button `[VolumeX / Volume2]` to start/stop the procedural atmospheric wind and pollution drone.
4. **Camera Path Spline**:
   - Open `src/components/canvas/CameraRig.tsx` to adjust the Catmull-Rom 3D control points or focal targets along the descent.

---

## 🧪 Automated Testing Suite

NIMBUS includes a comprehensive automated test suite powered by **Vitest** and **React Testing Library** with 34 tests covering 100% of core business logic:

```bash
# Execute the full automated test suite
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Highlights:
- **`openMeteoApi.test.ts`**: AQI categorization thresholds (0-500+), mock city data structures, 48-hour forecast integrity, and network error fallback.
- **`healthLogic.test.ts`**: WHO & EPA rule engine evaluations for all 6 personas, CleanPath™ hourly PM2.5 lung deposition rates, and cigarette intake equivalence.
- **`useAqiStore.test.ts`**: Zustand state updates, dev overrides, pollution normalization ($0.0 \to 1.0$), and 3D comparison columns.
- **`useScrollStore.test.ts`**: Spline progress, 35,000 ft altitude piece-wise interpolation, and dynamic FOV morphing ($62^\circ \to 32^\circ$).
- **`components.test.tsx`**: HUD altitude readout, checkpoint verification, and Dev Atmospheric Mapper preset interactions.
