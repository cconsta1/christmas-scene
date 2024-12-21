import { Color } from 'three';

export const TextShader = {
  uniforms: {
    color: { value: new Color("#8B0000") }, // Dark Red
  },
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normal;
      vPosition = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform vec3 color;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      float brightness = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0));
      vec3 finalColor = color * (0.8 + 0.2 * brightness); // Make it slightly brighter

      gl_FragColor = vec4(finalColor, 1.0);
    }`,
};