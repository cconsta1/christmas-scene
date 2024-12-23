import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createToonShader } from './ToonShader.js';

class Gift {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.gifts = [];
    }

    load() {
        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();

            const positions = [
                { x: -2, z: 2 }, // Position 1: Behind the tree
                { x: -2, z: -2 }, // Position 2: Behind the tree
                { x: 2, z: 2.2 } // Position 3: In front of the tree
            ];

            let loadedCount = 0;

            for (let i = 0; i < positions.length; i++) {
                gltfLoader.load(
                    '/models/gifts/simple_presents.glb',
                    (gltf) => {
                        gltf.scene.scale.set(0.7, 0.7, 0.7); // Adjust the scale as needed

                        // Set position and rotation
                        const position = positions[i];
                        gltf.scene.position.set(position.x, 0, position.z);
                        gltf.scene.rotation.y = 0; // No rotation

                        // Store original materials
                        gltf.scene.traverse((child) => {
                            if (child.isMesh) {
                                child.userData.originalMaterial = child.material;
                            }
                        });

                        this.scene.add(gltf.scene);

                        this.gifts.push(gltf.scene);

                        loadedCount++;
                        if (loadedCount === positions.length) {
                            // Resolve the promise after all gift models are loaded
                            resolve();
                        }
                    },
                    undefined,
                    (error) => {
                        console.error('An error happened while loading the gift model:', error);
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

        for (const gift of this.gifts) {
            const intersects = raycaster.intersectObject(gift, true);
            if (intersects.length > 0) {
                this.toggleGiftMaterial(gift);
                break;
            }
        }
    }

    toggleGiftMaterial(gift) {
        gift.traverse((child) => {
            if (child.isMesh) {
                if (child.material === child.userData.originalMaterial) {
                    const toonShader = createToonShader();
                    child.material = new THREE.ShaderMaterial({
                        vertexShader: toonShader.vertexShader,
                        fragmentShader: toonShader.fragmentShader,
                        uniforms: THREE.UniformsUtils.clone(toonShader.uniforms),
                    });
                } else {
                    child.material = child.userData.originalMaterial;
                }
            }
        });
    }

    update(deltaTime) {
        // No need to update anything for the material change effect
    }
}

export default Gift;