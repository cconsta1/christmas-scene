import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import { SnowShader } from './SnowShader.js';

class Floor {
    constructor(scene) {
        this.scene = scene;
    }

    load() {
        return new Promise((resolve) => {
            // Create the box geometry for the platform with a thinner height
            const floorSize = 20; // Match the skybox size
            const floorGeometry = new THREE.BoxGeometry(floorSize, 0.2, floorSize);

            // Create the material using the SnowShader
            const floorMaterial = new ShaderMaterial({
                vertexShader: SnowShader.vertexShader,
                fragmentShader: SnowShader.fragmentShader,
                uniforms: THREE.UniformsUtils.clone(SnowShader.uniforms)
            });

            // Create the mesh
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.receiveShadow = true;
            floor.position.y = -0.1; // Adjust the position to make it look like a platform
            this.scene.add(floor);

            console.log('Floor loaded');
            resolve();
        });
    }
}

export default Floor;