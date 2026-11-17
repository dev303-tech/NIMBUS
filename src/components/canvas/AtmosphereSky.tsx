import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { skyVertexShader, skyFragmentShader } from '../../shaders/skyAtmosphere.glsl';
import { useAqiStore } from '../../store/useAqiStore';
import { useScrollStore } from '../../store/useScrollStore';

export const AtmosphereSky: React.FC = () => {
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);
  const forecastScrubIndex = useAqiStore((s) => s.forecastScrubIndex);
  const chapter = useScrollStore((s) => s.chapter);
  const progress = useScrollStore((s) => s.progress);

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const lerpedPollution = useRef(0.2);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPollution: { value: 0.2 },
    uSunPos: { value: new THREE.Vector3(200, 350, -400) },
    uAltitude: { value: 1.0 },
  }), []);

  useFrame((state, delta) => {
    if (!matRef.current) return;

    // Smoothly lerp pollution uniform
    const targetPollution = getPollutionNorm();
    lerpedPollution.current += (targetPollution - lerpedPollution.current) * Math.min(1.0, delta * 3.0);

    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    matRef.current.uniforms.uPollution.value = lerpedPollution.current;
    matRef.current.uniforms.uAltitude.value = Math.max(0.0, 1.0 - progress);

    // Calculate dynamic Sun Position
    if (chapter === 5) {
      const sunAngle = ((forecastScrubIndex / 48) * Math.PI) - Math.PI * 0.1;
      const sunX = Math.cos(sunAngle) * 500;
      const sunY = Math.sin(sunAngle) * 350 + 80;
      matRef.current.uniforms.uSunPos.value.set(sunX, sunY, -400);
    } else {
      matRef.current.uniforms.uSunPos.value.set(220, 380, -450);
    }
  });

  // Fade stars out as camera descends through altitude
  const starOpacity = Math.max(0, Math.min(1, (0.7 - progress) / 0.3));

  return (
    <group>
      {/* High-Altitude Stratospheric Cosmic Stars */}
      {starOpacity > 0.05 && (
        <group position={[0, 100, 0]}>
          <Stars
            radius={700}
            depth={150}
            count={2400}
            factor={4}
            saturation={0.3}
            fade
            speed={0.4}
          />
        </group>
      )}

      {/* Atmospheric Sky Dome */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[950, 48, 48]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={skyVertexShader}
          fragmentShader={skyFragmentShader}
          uniforms={uniforms}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
