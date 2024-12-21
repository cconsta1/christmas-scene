# Festive Three.js Scene

## Description
This project creates a festive scene using Three.js. The scene includes a train, a floor platform, animated lights, particles, a Christmas tree, text, and a skybox. The skybox is created using shaders to simulate a gradient sky effect.

### Features
- **Train**: A model of the "Back to the Future" steam locomotive that can be animated.
- **Floor**: A platform with a snow shader applied to it.
- **Lights**: Various lights to illuminate the scene.
- **Particles**: Snow particles falling in the scene.
- **Christmas Tree**: A Christmas tree with interactive lights.
- **Text**: Festive text displayed in the scene.
- **Animated Lights**: Lights that animate around the Christmas tree.
- **Skybox**: A gradient skybox created using shaders.

### Shaders
- **Snow Shader**: Applied to the floor to create a snow effect.
- **Skybox Shader**: Creates a gradient sky effect.
- **Tree Shader**: Used for the Christmas tree to enhance its appearance.

### Particles
- **Snow Particles**: Simulate falling snow in the scene.

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run the following commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build