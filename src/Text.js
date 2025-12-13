import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { ShaderMaterial } from 'three';
import { MagicalTextShader } from './MagicalTextShader.js';

class Text {
    constructor(scene) {
        this.scene = scene;
        this.textMesh = null;
    }

    load() {
        return new Promise((resolve) => {
            const fontLoader = new FontLoader();
            fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
                const textGeometry = new TextGeometry('Merry Christmas', {
                    font: font,
                    size: 0.8,
                    depth: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                });

                textGeometry.center();

                // Create magical shader material
                const textMaterial = new ShaderMaterial({
                    vertexShader: MagicalTextShader.vertexShader,
                    fragmentShader: MagicalTextShader.fragmentShader,
                    uniforms: THREE.UniformsUtils.clone(MagicalTextShader.uniforms),
                    transparent: true
                });

                this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
                this.textMesh.position.set(0, 4, 0); // Position above the tree
                this.textMesh.castShadow = true;
                this.scene.add(this.textMesh);

                console.log('Text loaded');
                resolve();
            });
        });
    }

    update(elapsedTime) {
        if (this.textMesh) {
            // Gentle floating animation
            this.textMesh.position.y = 4 + Math.sin(elapsedTime * 0.5) * 0.2;
            // Subtle rotation
            this.textMesh.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1;
            
            // Update shader uniform
            if (this.textMesh.material.uniforms) {
                this.textMesh.material.uniforms.uTime.value = elapsedTime;
            }
        }
    }
}

export default Text;