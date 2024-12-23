import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Santa {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.santa = null;
        this.mixer = null;
    }

    load() {
        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();

            gltfLoader.load(
                '/models/santa/jolly_santa.glb',
                (gltf) => {
                    gltf.scene.scale.set(15, 15, 15); // Adjust the scale as needed

                    // Set position and rotation
                    gltf.scene.position.set(0, 0.1, 3); // Move Santa to the center and a bit to the front
                    gltf.scene.rotation.y = Math.random() * Math.PI * 2; // Random rotation

                    this.scene.add(gltf.scene);

                    // Store the Santa model
                    this.santa = gltf.scene;

                    // Animation
                    this.mixer = new THREE.AnimationMixer(gltf.scene);
                    if (gltf.animations.length > 0) {
                        this.action = this.mixer.clipAction(gltf.animations[0]);
                        this.action.play();
                    }

                    // Add event listener for clicks
                    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));

                    resolve();
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the Santa model:', error);
                    reject(error);
                }
            );
        });
    }

    onClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        if (this.santa) {
            const intersects = raycaster.intersectObject(this.santa, true);
            if (intersects.length > 0) {
                this.lightUp();
            }
        }
    }

    lightUp() {
        this.santa.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive.setHex(0xff0000); // Set emissive color to red
                child.material.emissiveIntensity = 1; // Increase emissive intensity
            }
        });

        setTimeout(() => {
            this.santa.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive.setHex(0x000000); // Reset emissive color
                    child.material.emissiveIntensity = 0; // Reset emissive intensity
                }
            });
        }, 1000); // Reset after 1 second
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}

export default Santa;