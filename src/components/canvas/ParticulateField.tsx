import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { particleVertexShader, particleFragmentShader } from '../../shaders/particlePollutant.glsl';
import { useAqiStore } from '../../store/useAqiStore';
import { useScrollStore } from '../../store/useScrollStore';

const PARTICLE_COUNT = 10000;

export const ParticulateField: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, raycaster } = useThree();

  const activePollutant = useAqiStore((s) => s.activePollutant);
  const getPollutionNorm = useAqiStore((s) => s.getPollutionNorm);
  const mouseNorm = useScrollStore((s) => s.mouseNorm);
  const progress = useScrollStore((s) => s.progress);

  const { dummy, instanceData } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const types = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);

    // Color definitions for pollutants
    const palette = [
      new THREE.Color('#9E5A2A'), // PM2.5: fine dark amber soot
      new THREE.Color('#C9A066'), // PM10: dusty sand / mineral
      new THREE.Color('#E05318'), // NO2: combustion orange
      new THREE.Color('#4DA8DA'), // O3: tropospheric ozone cyan
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute types: 35% PM2.5, 25% PM10, 25% NO2, 15% O3
      let typeIdx = 0;
      const rand = Math.random();
      if (rand < 0.35) typeIdx = 0;
      else if (rand < 0.60) typeIdx = 1;
      else if (rand < 0.85) typeIdx = 2;
      else typeIdx = 3;

      types[i] = typeIdx;

      // Color
      const col = palette[typeIdx];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Spatial distribution: concentrated in the boundary inversion layer & altitude envelope (y: 15 to 190)
      const radius = 6 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = 12 + Math.random() * 175;

      dummy.position.set(x, y, z);
      dummy.updateMatrix();

      // Scales by type
      const baseSizes = [0.42, 0.75, 0.52, 0.46];
      scales[i] = baseSizes[typeIdx] * (0.8 + Math.random() * 0.4);

      // Velocities
      velocities[i * 3] = (Math.random() - 0.5) * 1.8;
      velocities[i * 3 + 1] = 0.4 + Math.random() * 0.8;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }

    return { dummy, instanceData: { types, colors, velocities, scales } };
  }, []);

  // Initialize instances
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 6 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      dummy.position.set(Math.cos(theta) * radius, 12 + Math.random() * 175, Math.sin(theta) * radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPollution: { value: 0.2 },
    uActivePollutant: { value: 0 },
    uMousePos: { value: new THREE.Vector3(0, 0, 0) },
    uAltitude: { value: 1.0 },
  }), []);

  // Map active pollutant string to float index
  const activePollutantCode = useMemo(() => {
    switch (activePollutant) {
      case 'pm25': return 1.0;
      case 'pm10': return 2.0;
      case 'no2': return 3.0;
      case 'o3': return 4.0;
      default: return 0.0;
    }
  }, [activePollutant]);

  useFrame((state, delta) => {
    if (!matRef.current) return;

    const time = state.clock.getElapsedTime();
    matRef.current.uniforms.uTime.value = time;
    matRef.current.uniforms.uPollution.value = getPollutionNorm();
    matRef.current.uniforms.uActivePollutant.value = activePollutantCode;
    matRef.current.uniforms.uAltitude.value = Math.max(0.0, 1.0 - progress);

    // Approximate mouse world intersection for repulsion
    raycaster.setFromCamera(new THREE.Vector2(mouseNorm.x, mouseNorm.y), camera);
    const mouseWorld = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(40));
    matRef.current.uniforms.uMousePos.value.copy(mouseWorld);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute
          attach="attributes-aPollutantType"
          args={[instanceData.types, 1]}
        />
        <instancedBufferAttribute
          attach="attributes-aColor"
          args={[instanceData.colors, 3]}
        />
        <instancedBufferAttribute
          attach="attributes-aVelocity"
          args={[instanceData.velocities, 3]}
        />
        <instancedBufferAttribute
          attach="attributes-aBaseScale"
          args={[instanceData.scales, 1]}
        />
      </planeGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};
