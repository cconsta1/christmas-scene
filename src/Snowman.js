import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Snowman {
    constructor(scene, camera, renderer, onSnowmanClick) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.snowmen = [];
        this.onSnowmanClick = onSnowmanClick;
    }

    load() {
        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();

            const positions = [
                { x: -3.3, z: 3.3 }, // Position 1
                { x: 3.3, z: -3.3 }, // Position 2
                { x: -3.3, z: -3.3 } // Position 3
            ];

            let loadedCount = 0;

            for (let i = 0; i < positions.length; i++) {
                gltfLoader.load(
                    '/models/snowman/snow_man.glb',
                    (gltf) => {
                        gltf.scene.scale.set(0.1, 0.1, 0.1); // Adjust the scale as needed

                        // Set position and rotation
                        const position = positions[i];
                        gltf.scene.position.set(position.x, 0.1, position.z);
                        gltf.scene.rotation.y = Math.random() * Math.PI * 2; // Random rotation

                        this.scene.add(gltf.scene);

                        // Animation
                        const mixer = new THREE.AnimationMixer(gltf.scene);
                        if (gltf.animations.length > 0) {
                            const action = mixer.clipAction(gltf.animations[0]);
                            action.paused = true; // Start with the animation paused
                            action.loop = THREE.LoopOnce; // Play the animation only once
                            action.clampWhenFinished = true; // Keep the last frame when finished
                            this.snowmen.push({ scene: gltf.scene, mixer: mixer, action: action });
                        } else {
                            this.snowmen.push({ scene: gltf.scene, mixer: null, action: null });
                        }

                        loadedCount++;
                        if (loadedCount === positions.length) {
                            // Resolve the promise after all snowman models are loaded
                            resolve();
                        }
                    },
                    undefined,
                    (error) => {
                        console.error('An error happened while loading the snowman model:', error);
                        reject(error);
                    }
                );
            }

            // Add event listener for clicks
            this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
        });
    }

    onClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        for (const snowman of this.snowmen) {
            const intersects = raycaster.intersectObject(snowman.scene, true);
            if (intersects.length > 0) {
                this.onSnowmanClick(snowman);
                break;
            }
        }
    }

    playAnimation(snowman) {
        if (snowman.action) {
            snowman.action.reset(); // Reset the animation to the start
            snowman.action.paused = false;
            snowman.action.play();

            // Listen for the finished event on the mixer
            snowman.mixer.addEventListener('finished', () => {
                snowman.action.paused = true; // Pause the animation
            });
        }
    }

    update(deltaTime) {
        for (const snowman of this.snowmen) {
            if (snowman.mixer) {
                snowman.mixer.update(deltaTime);
            }
        }
    }
}

export default Snowman;