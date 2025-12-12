import { Color } from 'three';

const PALETTE = [
  new Color("#ff0000"), // Red
  new Color("#ffd700"), // Gold
  new Color("#c0c0c0"), // Silver
  new Color("#ffffff"), // White
  new Color("#00ff00"), // Green
];

function getRandomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

export function createToonShader() {
  return {
    uniforms: {
      color1: { value: getRandomColor() },
      color2: { value: getRandomColor() },
      color3: { value: getRandomColor() },
      color4: { value: getRandomColor() },
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

      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform vec3 color4;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        float stripe = mod(vPosition.y * 10.0, 2.0);
        vec3 color = mix(color1, color2, step(1.0, stripe));
        stripe = mod(vPosition.y * 10.0 + 1.0, 2.0);
        color = mix(color, color3, step(1.0, stripe));
        stripe = mod(vPosition.y * 10.0 + 2.0, 2.0);
        color = mix(color, color4, step(1.0, stripe));

        gl_FragColor = vec4(color, 1.0);
      }`,
  };
}