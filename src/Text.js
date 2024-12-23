import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { ShaderMaterial } from 'three';
import { TextShader } from './TextShader.js';

class Text {
    constructor(scene) {
        this.scene = scene;
        this.textMesh = null;
        this.isAnimating = false;
    }

    load() {
        return new Promise((resolve, reject) => {
            const fontLoader = new FontLoader();
            fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
                // Create the text geometry
                const textGeometry = new TextGeometry('Merry Christmas', {
                    font: font,
                    size: 0.5,
                    depth: 0.2, // Use .depth instead of .height
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                });

                // Center the text
                textGeometry.center();

                // Create the material using the TextShader
                const textMaterial = new ShaderMaterial({
                    vertexShader: TextShader.vertexShader,
                    fragmentShader: TextShader.fragmentShader,
                    uniforms: THREE.UniformsUtils.clone(TextShader.uniforms)
                });

                // Create the mesh
                this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
                this.textMesh.position.set(1, 0.3, 0); // Adjust the position as needed
                this.textMesh.rotation.y = Math.PI * 0.5;
                this.scene.add(this.textMesh);

                console.log('Text loaded');
                resolve();
            }, undefined, (error) => {
                console.error('An error happened while loading the font:', error);
                reject(error);
            });
        });
    }

    handleClick() {
        if (this.textMesh && !this.isAnimating) {
            this.isAnimating = true;
            const initialScale = this.textMesh.scale.clone();
            const targetScale = initialScale.clone().multiplyScalar(1.5);

            const duration = 0.5; // Duration of the animation in seconds
            const startTime = performance.now();

            const animate = (time) => {
                const elapsedTime = (time - startTime) / 1000;
                const progress = Math.min(elapsedTime / duration, 1);

                // Interpolate between the initial and target scale
                this.textMesh.scale.lerpVectors(initialScale, targetScale, progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Reverse the animation
                    const reverseStartTime = performance.now();
                    const reverseAnimate = (reverseTime) => {
                        const reverseElapsedTime = (reverseTime - reverseStartTime) / 1000;
                        const reverseProgress = Math.min(reverseElapsedTime / duration, 1);

                        // Interpolate back to the initial scale
                        this.textMesh.scale.lerpVectors(targetScale, initialScale, reverseProgress);

                        if (reverseProgress < 1) {
                            requestAnimationFrame(reverseAnimate);
                        } else {
                            this.isAnimating = false;
                        }
                    };
                    requestAnimationFrame(reverseAnimate);
                }
            };

            requestAnimationFrame(animate);
        }
    }
}

export default Text;