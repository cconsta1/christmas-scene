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

## Using `script.js` Without a Loading Screen

If you want to use the spaghetti code in `script.js` without a loading screen, follow these steps:

1. **Comment Out the Loading Screen HTML**: Open `index.html` and comment out the section marked as `<!-- Loading screen start -->` to `<!-- Loading screen end -->`.
2. **Replace `main.js` with `script.js`**: In `index.html`, replace the script reference to `main.js` with `script.js`.

### Example:
#### `index.html`
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>❄️ 3D Christmas ⛄</title>
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <!-- Remove or comment out the loading screen -->
    <!-- <div id="loading-screen">
        <div class="scene">
            <div class="word">
                <div class="letter__wrap" style="--index: 0;">
                    <div class="letter">
                        <div class="letter__panel">L</div>
                        <div class="letter__panel">L</div>
                        <div class="letter__panel">L</div>
                        <div class="letter__panel">L</div>
                        <div class="letter__panel">L</div>
                    </div>
                </div>
                <div class="letter__wrap" style="--index: 1;">
                    <div class="letter">
                        <div class="letter__panel">O</div>
                        <div class="letter__panel">O</div>
                        <div class="letter__panel">O</div>
                        <div class="letter__panel">O</div>
                        <div class="letter__panel">O</div>
                    </div>
                </div>
                <div class="letter__wrap" style="--index: 2;">
                    <div class="letter">
                        <div class="letter__panel">A</div>
                        <div class="letter__panel">A</div>
                        <div class="letter__panel">A</div>
                        <div class="letter__panel">A</div>
                        <div class="letter__panel">A</div>
                    </div>
                </div>
                <div class="letter__wrap" style="--index: 3;">
                    <div class="letter">
                        <div class="letter__panel">D</div>
                        <div class="letter__panel">D</div>
                        <div class="letter__panel">D</div>
                        <div class="letter__panel">D</div>
                        <div class="letter__panel">D</div>
                    </div>
                </div>
                <div class="letter__wrap" style="--index: 4;">
                    <div class="letter">
                        <div class="letter__panel">I</div>
                        <div class="letter__panel">I</div>
                        <div class="letter__panel">I</div>
                        <div class="letter__panel">I</div>
                        <div class="letter__panel">I</div>
                    </div>
                </div>
                <div class="letter__wrap" style="--index: 5;">
                    <div class="letter">
                        <div class="letter__panel">N</div>
                        <div class="letter__panel">N</div>
                        <div class="letter__panel">N</div>
                        <div class="letter__panel">N</div>
                        <div class="letter__panel">N</div>
                    </div>
                </div>
                <div class="letter__wrap" style="--index: 6;">
                    <div class="letter">
                        <div class="letter__panel">G</div>
                        <div class="letter__panel">G</div>
                        <div class="letter__panel">G</div>
                        <div class="letter__panel">G</div>
                        <div class="letter__panel">G</div>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <canvas class="webgl"></canvas>
    <script type="module" src="./script.js"></script>
</body>

</html>
```

## File Structure
- **src/**
  - **App.js**: Main application file that initializes the scene, camera, renderer, and controls.
  - **main.js**: Entry point of the application. It creates an instance of the `App` class.
  - **index.html**: HTML file that includes the canvas element for rendering the scene.
  - **style.css**: CSS file for styling the HTML elements.
  - **script.js**: Additional JavaScript file for any custom scripts. This is a quick stripped version of the project used for experimentation (basically it's spaghetti code).
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


## Acknowledgments

### Snowflake Icon
- **Source**: [Osckar on Pixabay](https://creazilla.com/)
- **Published by**: Creazilla
- **License**: Public Domain (CC0). Free for editorial, educational, commercial, and/or personal projects. No attribution required. More info.

### Model Attributions
- **Train Model**: [Source and License Information]
- **Christmas Tree Model**: [Source and License Information]
- **Other Models**: [Source and License Information]

### Flippy Loader
- **Author**: [Jhey Tompkins](https://github.com/jh3y)
- **Demo and Code**: [Flippy Loader](https://codepen.io/jh3y/pen/VwLQZOY)
- **Made with**: HTML (Pug) / CSS (Stylus)
- **License**: MIT License