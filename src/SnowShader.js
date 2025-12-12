import { Color, Vector3 } from 'three';

export const SnowShader = {
  uniforms: {
    color: { value: new Color("#dbeeff") }, // Cool white/blue snow
    lightPosition: { value: new Color("#F5F5F5") }, // Light Gray
    viewVector: { value: new Vector3() }
  },
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vDisplacement;

    // Simple noise function
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
        }
        return v;
    }

    void main() {
      vNormal = normal;
      vPosition = position;
      
      // Calculate displacement
      float displacement = fbm(position.xz * 0.5) * 1.5; // Large drifts
      displacement += fbm(position.xz * 2.0) * 0.2; // Small details
      
      // Flatten the center area for the tree and gifts
      float dist = length(position.xz);
      float flatten = smoothstep(1.0, 4.0, dist);
      displacement *= flatten;

      vDisplacement = displacement;

      vec3 displacedPosition = position + vec3(0.0, displacement, 0.0);
      vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);
      vWorldPosition = worldPosition.xyz;

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }`,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform vec3 color;
    uniform vec3 viewVector;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vDisplacement;

    // Simple pseudo-random function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Calculate normal from derivatives for realistic lighting on displaced mesh
      vec3 fdx = dFdx(vWorldPosition);
      vec3 fdy = dFdy(vWorldPosition);
      vec3 normal = normalize(cross(fdx, fdy));

      // Basic lighting
      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
      float brightness = max(0.0, dot(normal, lightDir));
      
      // Ambient occlusion based on displacement (valleys are darker)
      float ao = smoothstep(-0.5, 1.0, vDisplacement);

      // Sparkles
      vec3 viewDir = normalize(viewVector - vWorldPosition);
      
      // Create a grid for sparkles
      float scale = 30.0; 
      vec2 grid = floor(vWorldPosition.xz * scale);
      float noise = random(grid);
      
      // View dependent sparkle intensity
      float sparkle = 0.0;
      if (noise > 0.92) { 
          vec3 sparkleDir = normalize(vec3(random(grid), 1.0, random(grid + 1.0)));
          float spec = max(0.0, dot(reflect(-viewDir, normal), sparkleDir));
          sparkle = pow(spec, 30.0) * 2.5; 
      }

      // Color variation: Blueish shadows, warm highlights
      vec3 shadowColor = vec3(0.7, 0.8, 0.95) * color;
      vec3 highlightColor = vec3(1.0, 1.0, 0.95) * color;
      
      vec3 finalColor = mix(shadowColor, highlightColor, brightness);
      finalColor *= (0.8 + 0.2 * ao); // Apply AO
      finalColor += vec3(sparkle);

      // Distance fog (simple fade to black/background at edges)
      float dist = length(vWorldPosition.xz);
      float fogFactor = smoothstep(15.0, 20.0, dist);
      finalColor = mix(finalColor, vec3(0.02, 0.02, 0.06), fogFactor); // Fade to dark blue

      gl_FragColor = vec4(finalColor, 1.0);
    }`,
};