export const skyVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const skyFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPollution; // 0.0 (pristine) -> 1.0 (hazardous)
  uniform vec3 uSunPos;
  uniform float uAltitude; // 1.0 (stratosphere) -> 0.0 (ground)

  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vec3 rayDir = normalize(vWorldPosition);
    float elevation = clamp(rayDir.y, -0.2, 1.0);

    // Sun disc & atmospheric glow
    vec3 sunDir = normalize(uSunPos);
    float cosTheta = dot(rayDir, sunDir);
    float sunDisc = smoothstep(0.9985, 0.9997, cosTheta);
    float sunCorona = pow(max(0.0, cosTheta), 16.0) * 0.6;
    float sunGlow = pow(max(0.0, cosTheta), 4.0) * 0.3;

    // --- SKY GRADIENTS AS A FUNCTION OF POLLUTION & ALTITUDE ---

    // Pristine Sky (AQI 0 - 50)
    vec3 cleanZenith = mix(vec3(0.015, 0.035, 0.09), vec3(0.05, 0.15, 0.32), 1.0 - uAltitude * 0.7);
    vec3 cleanHorizon = vec3(0.55, 0.72, 0.88);
    vec3 cleanSun = vec3(1.0, 0.96, 0.85);

    // Moderate / Inversion Haze (AQI 100 - 150)
    vec3 modZenith = mix(vec3(0.05, 0.08, 0.14), vec3(0.18, 0.19, 0.22), 1.0 - uAltitude * 0.6);
    vec3 modHorizon = vec3(0.72, 0.62, 0.46);
    vec3 modSun = vec3(0.98, 0.78, 0.52);

    // Severe / Toxic Occlusion (AQI 250 - 400+)
    vec3 toxicZenith = mix(vec3(0.06, 0.03, 0.03), vec3(0.14, 0.08, 0.06), 1.0 - uAltitude * 0.5);
    vec3 toxicHorizon = vec3(0.42, 0.18, 0.08);
    vec3 toxicSun = vec3(0.92, 0.32, 0.12);

    // Interpolate palettes based on uPollution
    vec3 zenithColor;
    vec3 horizonColor;
    vec3 sunColor;

    if (uPollution < 0.4) {
      float t = uPollution / 0.4;
      zenithColor = mix(cleanZenith, modZenith, t);
      horizonColor = mix(cleanHorizon, modHorizon, t);
      sunColor = mix(cleanSun, modSun, t);
    } else {
      float t = (uPollution - 0.4) / 0.6;
      zenithColor = mix(modZenith, toxicZenith, t);
      horizonColor = mix(modHorizon, toxicHorizon, t);
      sunColor = mix(modSun, toxicSun, t);
    }

    // Atmospheric curve height falloff
    float curve = pow(max(0.0, 1.0 - elevation), 2.2);
    vec3 skyBase = mix(zenithColor, horizonColor, curve);

    // Sun extinction: when pollution is high, sun loses high-frequency intensity
    float sunIntensity = mix(1.8, 0.55, uPollution);
    vec3 sunEffect = (sunDisc * 2.5 + sunCorona * 1.2 + sunGlow) * sunColor * sunIntensity;

    // In deep space / stratosphere (high altitude), stars and deep void take over zenith
    if (uAltitude > 0.6 && elevation > 0.2) {
      float spaceDarken = (uAltitude - 0.6) / 0.4;
      skyBase *= mix(1.0, 0.25, spaceDarken * elevation);
    }

    vec3 finalColor = skyBase + sunEffect;

    // Atmospheric haze clamp
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
