import { Color } from 'three';

export const MagicalTextShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new Color("#ffd700") }, // Gold
    uColor2: { value: new Color("#ff8c00") }, // Dark Orange/Gold
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      // Vertical gradient
      vec3 color = mix(uColor2, uColor1, vUv.y);

      // Moving shine effect
      float shine = smoothstep(0.4, 0.6, sin(vUv.x * 5.0 + uTime * 2.0 + vUv.y * 2.0));
      color += vec3(shine) * 0.5;

      gl_FragColor = vec4(color, 1.0);
    }`,
};
