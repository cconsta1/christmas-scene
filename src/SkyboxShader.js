import * as THREE from 'three';

export const SkyboxShader = {
  uniforms: {
    topColor: { value: new THREE.Color(0x87CEEB) }, // Light blue color
    bottomColor: { value: new THREE.Color(0xFFFFFF) }, // White color
    offset: { value: 33 },
    exponent: { value: 0.6 }
  },
  vertexShader: /* glsl */ `
    varying vec3 vWorldPosition;

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;

    varying vec3 vWorldPosition;

    void main() {
      float h = normalize(vWorldPosition + offset).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }`,
};