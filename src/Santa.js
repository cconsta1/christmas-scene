import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Santa {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.santa = null;
        this.mixer = null;
        this.pointLight = null;
    }

    load() {
        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();

            gltfLoader.load(
                '/models/santa/jolly_santa.glb',
                (gltf) => {
                    gltf.scene.scale.set(25, 25, 25); // Adjust the scale as needed

                    // Set position and rotation
                    gltf.scene.position.set(2.5, 0.1, 1.2); // Move Santa out of the way

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
                child.material.emissive.setHex(0x0000ff); // Set emissive color to blue
                child.material.emissiveIntensity = 2; // Increase emissive intensity
            }
        });

        // Add a point light to illuminate Santa
        if (!this.pointLight) {
            this.pointLight = new THREE.PointLight(0x0000ff, 2, 50);
            this.pointLight.position.set(this.santa.position.x, this.santa.position.y + 5, this.santa.position.z);
            this.scene.add(this.pointLight);
        }

        setTimeout(() => {
            this.santa.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive.setHex(0x000000); // Reset emissive color
                    child.material.emissiveIntensity = 0; // Reset emissive intensity
                }
            });

            // Remove the point light
            if (this.pointLight) {
                this.scene.remove(this.pointLight);
                this.pointLight = null;
            }
        }, 1000); // Reset after 1 second
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}

export default Santa;