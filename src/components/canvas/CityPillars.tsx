import React from 'react';
import { Html } from '@react-three/drei';
import { useAqiStore } from '../../store/useAqiStore';
import { useScrollStore } from '../../store/useScrollStore';

export const CityPillars: React.FC = () => {
  const chapter = useScrollStore((s) => s.chapter);
  const comparisonCities = useAqiStore((s) => s.comparisonCities);

  if (chapter < 6) return null;

  return (
    <group position={[0, 0, -8]}>
      {comparisonCities.map((city, idx) => {
        // Arrange along an arc in front of street level camera
        const count = comparisonCities.length;
        const spacing = 4.2;
        const xPos = (idx - (count - 1) / 2) * spacing;
        const zPos = -Math.abs(xPos) * 0.3;

        // Height corresponds to AQI (clamped)
        const height = Math.max(1.8, Math.min(10.0, (city.aqi / 300) * 8.5 + 1.5));
        const yPos = height / 2;

        // Color based on AQI
        let color = '#8DA9C4'; // Clean
        let opacity = 0.45;
        if (city.aqi > 200) {
          color = '#A0381E'; // Severe
          opacity = 0.85;
        } else if (city.aqi > 100) {
          color = '#C87832'; // Moderate/Unhealthy
          opacity = 0.65;
        } else if (city.aqi > 50) {
          color = '#B8A882';
          opacity = 0.55;
        }

        return (
          <group key={city.name} position={[xPos, 0, zPos]}>
            {/* 3D Translucent Air Cylinder Column */}
            <mesh position={[0, yPos, 0]}>
              <cylinderGeometry args={[0.7, 0.7, height, 32]} />
              <meshStandardMaterial
                color={color}
                transparent
                opacity={opacity}
                roughness={0.2}
                metalness={0.1}
                wireframe={false}
              />
            </mesh>

            {/* Glowing Base Disk */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.0, 32]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>

            {/* Label floating above the air pillar */}
            <Html position={[0, height + 0.8, 0]} center distanceFactor={22}>
              <div className="font-tech text-center pointer-events-none select-none min-w-[120px]">
                <div className="atmospheric-plate px-2 py-1 border border-white/10 text-[10px] shadow-lg">
                  <div className="font-semibold text-white tracking-wide">{city.name}</div>
                  <div className="text-[9px] font-mono mt-0.5" style={{ color }}>
                    AQI {city.aqi} • {city.pm2_5} µg
                  </div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
