export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPollution;
  uniform float uActivePollutant; // 0 = all visible, 1 = PM2.5, 2 = PM10, 3 = NO2, 4 = O3
  uniform vec3 uMousePos;
  uniform float uAltitude;

  attribute float aPollutantType;
  attribute vec3 aColor;
  attribute vec3 aVelocity;
  attribute float aBaseScale;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Instanced base position from instanceMatrix
    vec4 instancePos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec3 pos = instancePos.xyz;

    // Temporal jitter & Brownian drift
    float t = uTime * (0.4 + aPollutantType * 0.2);
    pos += sin(pos.yzx * 0.1 + t) * (aVelocity * 0.8);

    // Mouse repulsion force
    vec3 toMouse = pos - uMousePos;
    float dist = length(toMouse);
    if (dist < 40.0 && dist > 0.01) {
      float force = (1.0 - dist / 40.0) * 15.0;
      pos += normalize(toMouse) * force;
    }

    // Active pollutant highlighting logic
    float highlightFactor = 1.0;
    float alphaFactor = 1.0;

    if (uActivePollutant > 0.5) {
      float currentType = aPollutantType + 1.0; // 1, 2, 3, 4
      if (abs(currentType - uActivePollutant) < 0.2) {
        highlightFactor = 1.8;
        alphaFactor = 1.0;
      } else {
        highlightFactor = 0.5;
        alphaFactor = 0.15;
      }
    }

    // Pollution count & density scaling
    float densityScale = mix(0.4, 1.4, uPollution);
    float finalScale = aBaseScale * highlightFactor * densityScale;

    // Billboard quad positioning
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    mvPosition.xy += position.xy * finalScale;

    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor * (1.0 + (highlightFactor > 1.2 ? 0.6 : 0.0));
    vAlpha = alphaFactor * mix(0.3, 0.9, uPollution);
  }
`;

export const particleFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Circular soft particle sprite
    vec2 coord = gl_PointCoord - vec2(0.5);
    // If quad mesh geometry, uv distance from center
    float dist = length(coord);
    
    // Soft radial falloff
    float radial = smoothstep(0.5, 0.05, dist);
    if (radial <= 0.01) discard;

    gl_FragColor = vec4(vColor, radial * vAlpha);
  }
`;
