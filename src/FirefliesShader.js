export const FirefliesShader = {
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uSize;
  
      attribute float aScale;
  
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Add some movement
        modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
        modelPosition.x += cos(uTime + modelPosition.y * 100.0) * aScale * 0.1;
        modelPosition.z += sin(uTime + modelPosition.z * 100.0) * aScale * 0.1;
  
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
  
        gl_Position = projectionPosition;
        gl_PointSize = uSize * aScale * uPixelRatio;
        gl_PointSize *= (1.0 / - viewPosition.z);
      }`,
    fragmentShader: /* glsl */ `
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float strength = 0.05 / distanceToCenter - 0.1;
  
        gl_FragColor = vec4(1.0, 0.9, 0.4, strength);
      }`,
  };