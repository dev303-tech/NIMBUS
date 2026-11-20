import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../../store/useScrollStore';

export const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const progress = useScrollStore((s) => s.progress);
  const mouseNorm = useScrollStore((s) => s.mouseNorm);
  const scrollVelocity = useScrollStore((s) => s.scrollVelocity);
  const targetFov = useScrollStore((s) => s.fov);

  // Spline points for camera flight path aligned to story chapters
  const pathSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 270, 150), // Ch 1: Stratosphere (p = 0.00)
        new THREE.Vector3(0, 152, 92), // Ch 2: Cloud Deck (p = 0.17)
        new THREE.Vector3(12, 62, 46), // Ch 3: The Layer (p = 0.35)
        new THREE.Vector3(-4, 22, 22), // Ch 4: The City (p = 0.52)
        new THREE.Vector3(6, 12, 16), // Ch 5: Forecast (p = 0.68)
        new THREE.Vector3(3, 6, 12), // Ch 6: Your Air (p = 0.83)
        new THREE.Vector3(0, 2.2, 9.5), // Ch 7: Street Level (p = 1.00)
      ],
      false,
      'catmullrom',
      0.5
    );
  }, []);

  // Spline points for camera focal target
  const targetSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 230, 0), // Ch 1 lookahead
        new THREE.Vector3(0, 122, 0), // Ch 2 cloud core
        new THREE.Vector3(0, 38, 0), // Ch 3 inversion layer
        new THREE.Vector3(0, 14, -8), // Ch 4 skyline center
        new THREE.Vector3(0, 8, -6), // Ch 5 solar horizon
        new THREE.Vector3(0, 5, -8), // Ch 6 rooftop raking light
        new THREE.Vector3(0, 14, -18), // Ch 7 street looking up
      ],
      false,
      'catmullrom',
      0.5
    );
  }, []);

  const currentPos = useRef(new THREE.Vector3(0, 270, 150));
  const currentTarget = useRef(new THREE.Vector3(0, 230, 0));
  const smoothedProgress = useRef(0);
  const currentBank = useRef(0);

  useFrame((state, delta) => {
    // Scrub smoothing with inertia
    smoothedProgress.current += (progress - smoothedProgress.current) * Math.min(1.0, delta * 7.0);
    const p = Math.max(0, Math.min(0.999, smoothedProgress.current));

    const targetPos = pathSpline.getPointAt(p);
    const lookTarget = targetSpline.getPointAt(p);
    const tangent = pathSpline.getTangentAt(p);

    // Apply subtle mouse parallax
    const parallaxX = mouseNorm.x * (3.5 * (1 - p * 0.6));
    const parallaxY = -mouseNorm.y * (2.5 * (1 - p * 0.6));
    targetPos.x += parallaxX;
    targetPos.y += parallaxY;

    // Atmospheric turbulence jitter when penetrating clouds (p: 0.14 to 0.28)
    if (p > 0.14 && p < 0.28) {
      const time = state.clock.getElapsedTime();
      const turbulence = Math.sin(time * 28.0) * 0.18 * (1.0 - Math.abs((p - 0.21) / 0.07));
      targetPos.x += turbulence;
      targetPos.y += turbulence * 0.6;
    }

    // Velocity pitch & rush response
    const velocityPitch = Math.max(-2.5, Math.min(2.5, scrollVelocity * 0.008));
    lookTarget.y -= velocityPitch;

    // Camera inertia lerp
    currentPos.current.lerp(targetPos, Math.min(1.0, delta * 8.5));
    currentTarget.current.lerp(lookTarget, Math.min(1.0, delta * 8.5));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);

    // Dynamic Cinematic Aircraft Banking into Spline Curvature
    const targetBank = -tangent.x * 0.45 + mouseNorm.x * 0.08;
    currentBank.current += (targetBank - currentBank.current) * Math.min(1.0, delta * 5.0);
    camera.rotation.z = currentBank.current;

    // Dynamic FOV Interpolation
    const perspCamera = camera as THREE.PerspectiveCamera;
    if (perspCamera.isPerspectiveCamera) {
      if (Math.abs(perspCamera.fov - targetFov) > 0.1) {
        perspCamera.fov += (targetFov - perspCamera.fov) * Math.min(1.0, delta * 4.0);
        perspCamera.updateProjectionMatrix();
      }
    }
  });

  return null;
};
