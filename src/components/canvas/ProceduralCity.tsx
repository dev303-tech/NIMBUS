import React, { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAqiStore } from '../../store/useAqiStore';
import { useScrollStore } from '../../store/useScrollStore';

interface DistrictPoint {
  id: string;
  name: string;
  type: string;
  pos: [number, number, number];
  aqiDelta: number;
  pm25Delta: number;
  primaryEmission: string;
}

const DISTRICTS: DistrictPoint[] = [
  {
    id: 'financial',
    name: 'Metropolitan Core & Transit Canyon',
    type: 'Urban Arterial',
    pos: [0, 24, 0],
    aqiDelta: +18,
    pm25Delta: +12.4,
    primaryEmission: 'Traffic NO2 & Diesel Soot',
  },
  {
    id: 'port',
    name: 'Maritime Terminal & Harbor',
    type: 'Coastal Bay',
    pos: [-35, 14, -20],
    aqiDelta: -14,
    pm25Delta: -8.2,
    primaryEmission: 'Marine Bunker Fuel & Sea Salt',
  },
  {
    id: 'industrial',
    name: 'East Freight & Logistics Corridor',
    type: 'Industrial Basin',
    pos: [32, 18, -30],
    aqiDelta: +36,
    pm25Delta: +28.5,
    primaryEmission: 'Stationary Combustion & Tyre Abrasion',
  },
  {
    id: 'park',
    name: 'Highland Botanical Canopy',
    type: 'Green Lung',
    pos: [-22, 16, 25],
    aqiDelta: -26,
    pm25Delta: -16.1,
    primaryEmission: 'Biogenic VOCs (Active Deposition)',
  },
];

export const ProceduralCity: React.FC = () => {
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);
  const chapter = useScrollStore((s) => s.chapter);
  const progress = useScrollStore((s) => s.progress);
  const [activeDistrict, setActiveDistrict] = useState<DistrictPoint | null>(null);

  // Smooth altitude reveal: hide city when in upper stratosphere (progress < 0.2)
  const cityOpacity = Math.max(0, Math.min(1, (progress - 0.2) / 0.15));

  // Generate stylized low-poly buildings on a grid with architectural luminescence
  const buildings = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      size: [number, number, number];
      color: string;
      emissive: string;
      hasSpire?: boolean;
    }> = [];

    const gridSize = 12;
    const spacing = 7.0;
    const offset = (gridSize * spacing) / 2;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        if (x === 5 || x === 6 || z === 5 || z === 6) continue;

        const posX = x * spacing - offset + (Math.random() - 0.5) * 2;
        const posZ = z * spacing - offset + (Math.random() - 0.5) * 2;
        const distFromCenter = Math.sqrt(posX * posX + posZ * posZ);

        const maxH = Math.max(5, 38 - distFromCenter * 0.65 + (Math.random() - 0.5) * 14);
        const w = 3.6 + Math.random() * 2.2;
        const d = 3.6 + Math.random() * 2.2;

        const slateGreys = ['#151C26', '#1A2330', '#202B3B', '#121720'];
        const col = slateGreys[Math.floor(Math.random() * slateGreys.length)];

        const hasWindows = Math.random() > 0.45;
        const emissiveCol = hasWindows ? '#B8C7D9' : '#000000';

        list.push({
          pos: [posX, maxH / 2, posZ],
          size: [w, maxH, d],
          color: col,
          emissive: emissiveCol,
          hasSpire: maxH > 26 && Math.random() > 0.5,
        });
      }
    }
    return list;
  }, []);

  // Traffic Photon Streams (Headlights & Taillights flowing along urban roads)
  const trafficVehicles = useMemo(() => {
    const list: Array<{
      axis: 'x' | 'z';
      offset: number;
      lane: number;
      speed: number;
      progress: number;
      isHeadlight: boolean;
    }> = [];

    const roadOffsets = [-7.0, 0, 7.0, -21.0, 21.0];
    for (let i = 0; i < 240; i++) {
      const axis = Math.random() > 0.5 ? 'x' : 'z';
      const road = roadOffsets[Math.floor(Math.random() * roadOffsets.length)];
      const isHeadlight = Math.random() > 0.5;
      const lane = isHeadlight ? 0.7 : -0.7;
      list.push({
        axis,
        offset: road,
        lane,
        speed: (0.12 + Math.random() * 0.15) * (isHeadlight ? 1 : -1),
        progress: Math.random() * 120 - 60,
        isHeadlight,
      });
    }
    return list;
  }, []);

  const { headlightGeo, taillightGeo } = useMemo(() => {
    const hPos = new Float32Array(120 * 3);
    const tPos = new Float32Array(120 * 3);
    const hGeo = new THREE.BufferGeometry();
    const tGeo = new THREE.BufferGeometry();
    hGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
    tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
    return { headlightGeo: hGeo, taillightGeo: tGeo };
  }, []);

  // Traffic & Industrial Emission Plumes
  const plumeParticles = useMemo(() => {
    const list: Array<{ x: number; y: number; z: number; speed: number; phase: number }> = [];
    const roots: Array<[number, number]> = [[32, -30], [0, 0], [15, -12], [-20, 15]];
    for (let i = 0; i < 400; i++) {
      const root = roots[i % roots.length];
      list.push({
        x: root[0] + (Math.random() - 0.5) * 8,
        y: Math.random() * 32,
        z: root[1] + (Math.random() - 0.5) * 8,
        speed: 0.18 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return list;
  }, []);

  const plumesRef = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posArray = new Float32Array(plumeParticles.length * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    return geo;
  }, [plumeParticles]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Update Plumes
    const posAttr = plumesRef.getAttribute('position') as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    for (let i = 0; i < plumeParticles.length; i++) {
      const p = plumeParticles[i];
      let y = (p.y + time * p.speed * 8.5) % 36.0;
      const x = p.x + Math.sin(time + p.phase) * 1.8 + (y * 0.22);
      const z = p.z + Math.cos(time + p.phase) * 1.4;
      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }
    posAttr.needsUpdate = true;

    // 2. Update Traffic Photon Streams
    const hArr = (headlightGeo.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
    const tArr = (taillightGeo.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
    let hIdx = 0;
    let tIdx = 0;

    for (let i = 0; i < trafficVehicles.length; i++) {
      const v = trafficVehicles[i];
      let pos = (v.progress + time * v.speed * 24.0) % 120.0;
      if (pos < -60) pos += 120;
      if (pos > 60) pos -= 120;

      let x = 0, y = 0.4, z = 0;
      if (v.axis === 'x') {
        x = pos;
        z = v.offset + v.lane;
      } else {
        x = v.offset + v.lane;
        z = pos;
      }

      if (v.isHeadlight && hIdx < 120) {
        hArr[hIdx * 3] = x;
        hArr[hIdx * 3 + 1] = y;
        hArr[hIdx * 3 + 2] = z;
        hIdx++;
      } else if (!v.isHeadlight && tIdx < 120) {
        tArr[tIdx * 3] = x;
        tArr[tIdx * 3 + 1] = y;
        tArr[tIdx * 3 + 2] = z;
        tIdx++;
      }
    }

    (headlightGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (taillightGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  });

  const baseAqi = getEffectiveAqi();
  const pollutionNorm = getPollutionNorm();

  if (cityOpacity <= 0.01) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Infinite Atmospheric Radial Ground Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[900, 64]} />
        <meshStandardMaterial
          color="#060A10"
          roughness={0.95}
          metalness={0.05}
          transparent
          opacity={cityOpacity * 0.98}
        />
      </mesh>

      {/* Buildings Mesh */}
      {buildings.map((b, idx) => (
        <group key={idx} position={b.pos}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.65}
              metalness={0.3}
              emissive={b.emissive}
              emissiveIntensity={0.12}
              transparent
              opacity={cityOpacity}
            />
          </mesh>

          {b.hasSpire && (
            <mesh position={[0, b.size[1] / 2 + 3.5, 0]}>
              <cylinderGeometry args={[0.08, 0.2, 7, 8]} />
              <meshBasicMaterial color="#E8A858" transparent opacity={cityOpacity} />
            </mesh>
          )}
        </group>
      ))}

      {/* Moving Traffic Headlights (Warm Ivory Photon Stream) */}
      <points geometry={headlightGeo}>
        <pointsMaterial
          size={1.1}
          color="#FFF8E7"
          transparent
          opacity={0.85 * cityOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Moving Traffic Taillights (Crimson Photon Stream) */}
      <points geometry={taillightGeo}>
        <pointsMaterial
          size={1.0}
          color="#FF3333"
          transparent
          opacity={0.9 * cityOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Emission Plumes */}
      <points geometry={plumesRef}>
        <pointsMaterial
          size={0.8}
          color={pollutionNorm > 0.4 ? '#D35400' : '#8DA9C4'}
          transparent
          opacity={0.55 * (0.3 + pollutionNorm * 0.7) * cityOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* District Hotspot Interactive Markers (Active in Chapters 4-7) */}
      {chapter >= 4 &&
        DISTRICTS.map((district) => {
          const districtAqi = Math.max(10, Math.round(baseAqi + district.aqiDelta));
          const isSelected = activeDistrict?.id === district.id;

          return (
            <group key={district.id} position={district.pos}>
              {/* Pulsing Beacon Ring */}
              <mesh
                onClick={() => setActiveDistrict(isSelected ? null : district)}
                onPointerOver={() => setActiveDistrict(district)}
                cursor="pointer"
              >
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshBasicMaterial
                  color={district.aqiDelta > 0 ? '#E05318' : '#5296D5'}
                  wireframe
                />
              </mesh>

              {/* District HTML Tooltip */}
              <Html distanceFactor={45} position={[0, 2.8, 0]} center>
                <div
                  className={`pointer-events-auto transition-all duration-300 font-tech ${
                    isSelected
                      ? 'scale-100 opacity-100'
                      : 'scale-90 opacity-80 hover:opacity-100 hover:scale-95'
                  }`}
                  onClick={() => setActiveDistrict(isSelected ? null : district)}
                >
                  <div className="atmospheric-plate px-3 py-2 rounded-none border border-white/10 text-xs min-w-[190px] shadow-2xl cursor-pointer">
                    <div className="flex items-center justify-between gap-3 hairline-b pb-1.5 mb-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#8E99A8]">
                        {district.type}
                      </span>
                      <span
                        className={`font-semibold text-xs px-1.5 py-0.5 ${
                          districtAqi > 100
                            ? 'bg-[#E05318]/20 text-[#E05318]'
                            : 'bg-[#5296D5]/20 text-[#8DA9C4]'
                        }`}
                      >
                        AQI {districtAqi}
                      </span>
                    </div>

                    <div className="font-medium text-[#EEF2F6] text-xs leading-tight mb-1">
                      {district.name}
                    </div>

                    {isSelected && (
                      <div className="mt-2 text-[10px] text-[#A6B2C0] space-y-1 hairline-t pt-1.5">
                        <div className="flex justify-between">
                          <span>Local Dispersion:</span>
                          <span className={district.aqiDelta > 0 ? 'text-[#E05318]' : 'text-[#5296D5]'}>
                            {district.aqiDelta > 0 ? `+${district.aqiDelta}` : district.aqiDelta} AQI
                          </span>
                        </div>
                        <div className="text-[9px] text-[#8E99A8] italic">
                          {district.primaryEmission}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Html>
            </group>
          );
        })}
    </group>
  );
};
