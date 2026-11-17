import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { AtmosphereSky } from './AtmosphereSky';
import { VolumetricClouds } from './VolumetricClouds';
import { VolumetricGodRays } from './VolumetricGodRays';
import { ParticulateField } from './ParticulateField';
import { ProceduralCity } from './ProceduralCity';
import { CityPillars } from './CityPillars';
import { useAqiStore } from '../../store/useAqiStore';

export const SceneContainer: React.FC = () => {
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);
  const pollutionNorm = getPollutionNorm();

  // Sun light color shifts from warm golden to dull copper/orange
  const sunLightColor = pollutionNorm > 0.5 ? '#E06D3B' : '#FFF4D6';
  const sunIntensity = 2.2 - pollutionNorm * 1.2;

  // Postprocessing chromatic aberration and bloom intensity scale with pollution
  const bloomIntensity = 0.5 + pollutionNorm * 0.6;
  const chromaOffset = new THREE.Vector2(
    0.001 + pollutionNorm * 0.002,
    0.001 + pollutionNorm * 0.002
  );

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0">
      <Canvas
        camera={{ position: [0, 270, 150], fov: 62, near: 0.1, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <AtmosphereSky />
          <VolumetricClouds />
          <VolumetricGodRays />
          <ParticulateField />
          <ProceduralCity />
          <CityPillars />

          {/* Lighting */}
          <ambientLight intensity={0.55 - pollutionNorm * 0.25} color="#8DA9C4" />
          <directionalLight
            position={[220, 380, -450]}
            intensity={sunIntensity}
            color={sunLightColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Post-Processing Pipeline */}
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.35}
              intensity={bloomIntensity}
            />
            <ChromaticAberration
              offset={chromaOffset}
              radialModulation={true}
              modulationOffset={0.35}
            />
            <Vignette
              eskil={false}
              offset={0.15}
              darkness={0.6 + pollutionNorm * 0.2}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
