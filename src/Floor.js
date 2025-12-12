import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import { SnowShader } from './SnowShader.js';

class Floor {
    constructor(scene) {
        this.scene = scene;
    }

    load() {
        return new Promise((resolve) => {
            // Create a high-resolution plane for realistic snow displacement
            const floorSize = 40; 
            const segments = 256;
            const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize, segments, segments);
            
            // Rotate to be flat on the ground
            floorGeometry.rotateX(-Math.PI / 2);

            // Create the material using the SnowShader
            this.material = new ShaderMaterial({
                vertexShader: SnowShader.vertexShader,
                fragmentShader: SnowShader.fragmentShader,
                uniforms: THREE.UniformsUtils.clone(SnowShader.uniforms),
                side: THREE.DoubleSide
            });

            // Create the mesh
            const floor = new THREE.Mesh(floorGeometry, this.material);
            floor.receiveShadow = true;
            floor.position.y = -0.5; // Lower slightly to allow for displacement height
            this.scene.add(floor);

            console.log('Floor loaded');
            resolve();
        });
    }

    update(camera) {
        if (this.material) {
            this.material.uniforms.viewVector.value.copy(camera.position);
        }
    }
}

export default Floor;