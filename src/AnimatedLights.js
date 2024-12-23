import * as THREE from 'three';

class AnimatedLights {
    constructor(scene) {
        this.scene = scene;
        this.lights = [];
        this.numLights = 3; // Number of lights around the scene

        // Create multiple point lights with different colors
        for (let i = 0; i < this.numLights; i++) {
            const color = new THREE.Color(`hsl(${(i / this.numLights) * 360}, 100%, 50%)`);
            const angle = (i / this.numLights) * Math.PI * 2;
            const position = new THREE.Vector3(Math.cos(angle) * 5, 5, Math.sin(angle) * 5);
            this.addLight(color, position);
        }
    }

    addLight(color, position) {
        const pointLight = new THREE.PointLight(color, 1, 10);
        pointLight.position.copy(position);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        this.scene.add(pointLight);
        this.lights.push(pointLight);
    }

    load() {
        return new Promise((resolve) => {
            console.log('Animated lights loaded');
            resolve();
        });
    }

    update(elapsedTime) {
        // Animate the lights around the scene
        this.lights.forEach((light, index) => {
            const angle = (index / this.numLights) * Math.PI * 2 + elapsedTime * 0.5;
            light.position.x = Math.cos(angle) * 5;
            light.position.z = Math.sin(angle) * 5;
            light.position.y = 5 + Math.sin(elapsedTime * 2 + index) * 0.5;
        });
    }
}

export default AnimatedLights;