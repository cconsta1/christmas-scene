import * as THREE from 'three';
import { SkyboxShader } from './SkyboxShader.js';

class Skybox {
    constructor(scene) {
        this.scene = scene;
    }

    load() {
        return new Promise((resolve) => {
            const skyboxSize = 20;  
            const skyboxGeometry = new THREE.BoxGeometry(skyboxSize, skyboxSize, skyboxSize);
            const skyboxMaterial = new THREE.ShaderMaterial({
                vertexShader: SkyboxShader.vertexShader,
                fragmentShader: SkyboxShader.fragmentShader,
                uniforms: THREE.UniformsUtils.clone(SkyboxShader.uniforms),
                side: THREE.BackSide
            });

            const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
            this.scene.add(skybox);

            console.log('Skybox loaded');
            resolve();
        });
    }
}

export default Skybox;