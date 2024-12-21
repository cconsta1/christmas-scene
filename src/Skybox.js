import * as THREE from 'three';
import { SkyboxShader } from './SkyboxShader.js';

class Skybox {
    constructor(scene) {
        const skyboxGeometry = new THREE.BoxGeometry(50, 50, 50); // Adjusted size
        const skyboxMaterial = new THREE.ShaderMaterial({
            vertexShader: SkyboxShader.vertexShader,
            fragmentShader: SkyboxShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone(SkyboxShader.uniforms),
            side: THREE.BackSide
        });

        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        scene.add(skybox);
    }
}

export default Skybox;