import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cloudVertexShader, cloudFragmentShader } from '../../shaders/cloudVolumetric.glsl';
import { useAqiStore } from '../../store/useAqiStore';

export const VolumetricClouds: React.FC = () => {
  const { camera } = useThree();
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);

  const matRef1 = useRef<THREE.ShaderMaterial>(null);
  const matRef2 = useRef<THREE.ShaderMaterial>(null);

  const uniforms1 = useMemo(
    () => ({
      uTime: { value: 0 },
      uPollution: { value: 0.2 },
      uSunPos: { value: new THREE.Vector3(220, 380, -450) },
      uCameraPos: { value: new THREE.Vector3() },
      uCloudDensity: { value: 1.1 },
    }),
    []
  );

  const uniforms2 = useMemo(
    () => ({
      uTime: { value: 0 },
      uPollution: { value: 0.2 },
      uSunPos: { value: new THREE.Vector3(220, 380, -450) },
      uCameraPos: { value: new THREE.Vector3() },
      uCloudDensity: { value: 0.9 },
    }),
    []
  );

  useFrame((state, _delta) => {
    const time = state.clock.getElapsedTime();
    const pollution = getPollutionNorm();

    if (matRef1.current) {
      matRef1.current.uniforms.uTime.value = time;
      matRef1.current.uniforms.uPollution.value = pollution;
      matRef1.current.uniforms.uCameraPos.value.copy(camera.position);
    }

    if (matRef2.current) {
      matRef2.current.uniforms.uTime.value = time * 0.9 + 5.0;
      matRef2.current.uniforms.uPollution.value = pollution;
      matRef2.current.uniforms.uCameraPos.value.copy(camera.position);
    }
  });

  return (
    <group>
      {/* Upper Cloud Deck (Altitude ~ 155) */}
      <mesh position={[0, 155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[900, 900, 32, 32]} />
        <shaderMaterial
          ref={matRef1}
          vertexShader={cloudVertexShader}
          fragmentShader={cloudFragmentShader}
          uniforms={uniforms1}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mid Cloud Deck (Altitude ~ 138) */}
      <mesh position={[0, 138, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[750, 750, 32, 32]} />
        <shaderMaterial
          ref={matRef2}
          vertexShader={cloudVertexShader}
          fragmentShader={cloudFragmentShader}
          uniforms={uniforms2}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
