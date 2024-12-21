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
- **Snow Particle Shader**: Used for the snow particles to simulate falling snow.
- **Ghibli Shader**: Used for Ghibli-style effects.
- **Toon Shader**: Used for cartoon-like effects.
- **Text Shader**: Used for the festive text.

### Particles
- **Snow Particles**: Simulate falling snow in the scene.

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run the following commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:5173
npm run dev

# Build for production in the dist/ directory (for Vercel deployment you don't need this necessarily as you can just connect to your GitHub account and have Vercel compile things for you)
npm run build
```

## Usage
- **Interactive Controls**: Use the mouse to orbit around the scene.
- **Toggle Animation**: Click on the Christmas tree to toggle the train and tree animations.
- **Audio**: The scene includes background music that plays when the tree is clicked.

## File Structure
- **src/**
  - **App.js**: Main application file that initializes the scene, camera, renderer, and controls.
  - **main.js**: Entry point of the application. It creates an instance of the `App` class.
  - **index.html**: HTML file that includes the canvas element for rendering the scene.
  - **style.css**: CSS file for styling the HTML elements.
  - **script.js**: Additional JavaScript file for any custom scripts.
  - **Train.js**: Class for loading and animating the train model.
  - **Floor.js**: Class for creating the floor platform with a snow shader.
  - **Lights.js**: Class for adding lights to the scene.
  - **Particles.js**: Class for creating snow particles.
  - **ChristmasTree.js**: Class for creating the interactive Christmas tree.
  - **Text.js**: Class for displaying festive text.
  - **AnimatedLights.js**: Class for animating lights around the Christmas tree.
  - **Skybox.js**: Class for creating the skybox with a gradient shader.
  - **SkyboxShader.js**: Shader for the skybox gradient effect.
  - **SnowShader.js**: Shader for the snow effect on the floor.
  - **SnowParticleShader.js**: Shader for the snow particles.
  - **GhibliShader.js**: Shader for Ghibli-style effects.
  - **ToonShader.js**: Shader for cartoon-like effects.
  - **TextShader.js**: Shader for the festive text.

## Entry Point
The entry point of the application is `main.js`. It creates an instance of the `App` class, which sets up the scene, camera, renderer, and controls.

```javascript
import App from './App.js';

const app = new App();
```

## Classes and Shaders
- **App.js**: Initializes the scene, camera, renderer, and controls. It also manages the animation loop and event listeners.
- **Train.js**: Loads and animates the train model.
- **Floor.js**: Creates the floor platform with a snow shader.
- **Lights.js**: Adds various lights to the scene.
- **Particles.js**: Creates snow particles using the `SnowParticleShader`.
- **ChristmasTree.js**: Creates an interactive Christmas tree with lights.
- **Text.js**: Displays festive text using the `TextShader`.
- **AnimatedLights.js**: Animates lights around the Christmas tree.
- **Skybox.js**: Creates a skybox with a gradient shader using the `SkyboxShader`.
- **SkyboxShader.js**: Defines the shader for the skybox gradient effect.
- **SnowShader.js**: Defines the shader for the snow effect on the floor.
- **SnowParticleShader.js**: Defines the shader for the snow particles.
- **GhibliShader.js**: Defines the shader for Ghibli-style effects.
- **ToonShader.js**: Defines the shader for cartoon-like effects.
- **TextShader.js**: Defines the shader for the festive text.

## Summary
This `README.md` provides a comprehensive overview of the project, including its features, setup instructions, usage, file structure, entry point, and details about the classes and shaders used. This will help users understand the features of the project and how to set it up. If you encounter any issues or need further assistance, please let me know!