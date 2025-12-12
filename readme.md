# Atmospheric Christmas Scene

A professional, cinematic 3D Christmas scene built with Three.js. This project focuses on high-quality lighting, composition, and atmosphere to create a cozy winter night environment.

## Features

- **Cinematic Lighting**: A carefully tuned night scene with moonlight, ambient skylight, and warm accent lights.
- **Post-Processing**: Unreal Bloom effect for a magical, glowing atmosphere.
- **Custom Shaders**:
  - **Snow Shader**: Procedural snow material with subtle gloss and texture.
  - **Skybox Shader**: Deep night sky gradient.
  - **Ghibli/Toon Shaders**: Stylized rendering for the Christmas tree and ornaments.
  - **Fireflies Shader**: Animated glowing particles.
- **Particle Systems**: 
  - Optimized snow with wind simulation.
  - Floating fireflies/magic dust.
- **Performance**:
  - Efficient asset loading.
  - Optimized shadow maps and lighting.
  - ACES Filmic Tone Mapping for realistic color reproduction.
- **Camera**: Cinematic camera framing with subtle auto-rotation.

## Tech Stack

- **Three.js**: Latest version for 3D rendering.
- **Vite**: Fast development server and bundler.
- **GLSL**: Custom shaders for unique visual effects.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Controls

- **Orbit**: Left click + drag to rotate around the scene.
- **Zoom**: Scroll to zoom in/out (constrained to keep the view above ground).

## License

MIT
