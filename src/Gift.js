// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// class Gift {
//     constructor(scene, camera, renderer) {
//         this.scene = scene;
//         this.camera = camera;
//         this.renderer = renderer;
//         this.gifts = [];
//         this.originalColors = new Map();
//     }

//     load() {
//         return new Promise((resolve, reject) => {
//             const gltfLoader = new GLTFLoader();

//             const positions = [
//                 { x: -2, z: 2 }, // Position 1: Behind the tree
//                 { x: -2, z: -2 }, // Position 2: Behind the tree
//                 { x: 2, z: 2.2 } // Position 3: In front of the tree
//             ];

//             let loadedCount = 0;

//             for (let i = 0; i < positions.length; i++) {
//                 gltfLoader.load(
//                     '/models/gifts/simple_presents.glb',
//                     (gltf) => {
//                         gltf.scene.scale.set(0.7, 0.7, 0.7); // Adjust the scale as needed

//                         // Set position and rotation
//                         const position = positions[i];
//                         gltf.scene.position.set(position.x, 0, position.z);
//                         gltf.scene.rotation.y = 0; // No rotation

//                         // Store original colors
//                         gltf.scene.traverse((child) => {
//                             if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
//                                 this.originalColors.set(child, child.material.color.clone());
//                             }
//                         });

//                         this.scene.add(gltf.scene);

//                         this.gifts.push(gltf.scene);

//                         loadedCount++;
//                         if (loadedCount === positions.length) {
//                             // Resolve the promise after all gift models are loaded
//                             resolve();
//                         }
//                     },
//                     undefined,
//                     (error) => {
//                         console.error('An error happened while loading the gift model:', error);
//                         reject(error);
//                     }
//                 );
//             }

//             // Add event listener for clicks
//             this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
//         });
//     }

//     onClick(event) {
//         const mouse = new THREE.Vector2();
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//         const raycaster = new THREE.Raycaster();
//         raycaster.setFromCamera(mouse, this.camera);

//         for (const gift of this.gifts) {
//             const intersects = raycaster.intersectObject(gift, true);
//             if (intersects.length > 0) {
//                 this.toggleGiftColor(gift);
//                 break;
//             }
//         }
//     }

//     toggleGiftColor(gift) {
//         gift.traverse((child) => {
//             if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
//                 const originalColor = this.originalColors.get(child);
//                 if (child.material.color.equals(originalColor)) {
//                     // Invert the color
//                     child.material.color.setRGB(1 - originalColor.r, 1 - originalColor.g, 1 - originalColor.b);
//                 } else {
//                     // Restore the original color
//                     child.material.color.copy(originalColor);
//                 }
//             }
//         });
//     }

//     update(deltaTime) {
//         // No need to update anything for the color change effect
//     }
// }

// export default Gift;

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Gift {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.gifts = [];
        this.originalColors = new Map();
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

                        // Store original colors
                        gltf.scene.traverse((child) => {
                            if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
                                this.originalColors.set(child, child.material.color.clone());
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
                this.toggleGiftColor(gift);
                break;
            }
        }
    }

    toggleGiftColor(gift) {
        gift.traverse((child) => {
            if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
                const originalColor = this.originalColors.get(child);
                if (child.material.color.equals(originalColor)) {
                    // Apply random color multiplied by the inverse of the original color
                    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
                    child.material.color.setRGB(
                        (1 - originalColor.r) * randomColor.r,
                        (1 - originalColor.g) * randomColor.g,
                        (1 - originalColor.b) * randomColor.b
                    );
                } else {
                    // Restore the original color
                    child.material.color.copy(originalColor);
                }
            }
        });
    }

    update(deltaTime) {
        // No need to update anything for the color change effect
    }
}

export default Gift;