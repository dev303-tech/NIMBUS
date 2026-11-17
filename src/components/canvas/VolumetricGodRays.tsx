import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAqiStore } from '../../store/useAqiStore';
import { useScrollStore } from '../../store/useScrollStore';

const godRayVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const godRayFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPollution;
  uniform float uAltitude;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    // Angular variation creating distinct light beams (crepuscular shafts)
    float angle = atan(vWorldPosition.x, vWorldPosition.z);
    float beamNoise = sin(angle * 14.0 + uTime * 0.15) * 0.5 + 0.5;
    beamNoise += sin(angle * 32.0 - uTime * 0.08) * 0.25;

    // Longitudinal falloff along cone length
    float lengthFalloff = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.55, vUv.y);

    // Cross-beam soft falloff
    float beamSoftness = pow(beamNoise, 2.0);

    // Pristine solar gold vs Smog amber
    vec3 cleanRayColor = vec3(1.0, 0.94, 0.82);
    vec3 smogRayColor = vec3(0.92, 0.58, 0.28);
    vec3 rayColor = mix(cleanRayColor, smogRayColor, uPollution * 0.85);

    // Fade out at ground level and in deep stratosphere
    float altVisibility = smoothstep(0.0, 0.3, uAltitude) * smoothstep(1.0, 0.6, uAltitude);
    float alpha = lengthFalloff * beamSoftness * 0.35 * altVisibility * (1.0 - uPollution * 0.4);

    if (alpha <= 0.005) discard;

    gl_FragColor = vec4(rayColor, alpha);
  }
`;

export const VolumetricGodRays: React.FC = () => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);
  const progress = useScrollStore((s) => s.progress);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPollution: { value: 0.2 },
    uAltitude: { value: 1.0 },
  }), []);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    matRef.current.uniforms.uPollution.value = getPollutionNorm();
    matRef.current.uniforms.uAltitude.value = Math.max(0, 1.0 - progress);
  });

  return (
    <mesh position={[180, 220, -320]} rotation={[0.45, 0.2, 0.1]}>
      {/* Tall volumetric light cone streaming down through clouds */}
      <cylinderGeometry args={[25, 220, 480, 48, 1, true]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={godRayVertexShader}
        fragmentShader={godRayFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
