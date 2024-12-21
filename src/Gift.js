import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Gift {
    constructor(scene, camera, renderer, onGiftClick) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.gifts = [];
        this.onGiftClick = onGiftClick;

        const gltfLoader = new GLTFLoader();

        const positions = [
            { x: -2, z: 2 }, // Position 1: Behind the tree
            { x: -2, z: -2 }, // Position 2: Behind the tree
            { x: 2.5, z: -2.5 } // Position 3: In front of the tree
        ];

        for (let i = 0; i < positions.length; i++) {
            gltfLoader.load(
                '/models/gifts/simple_presents.glb',
                (gltf) => {
                    // console.log('Gift loaded:', gltf.scene);
                    gltf.scene.scale.set(1.5, 1.5, 1.5); // Adjust the scale as needed

                    // Set position and rotation
                    const position = positions[i];
                    gltf.scene.position.set(position.x, 0, position.z);
                    gltf.scene.rotation.y = 0; // No rotation

                    this.scene.add(gltf.scene);

                    this.gifts.push(gltf.scene);

                    // Add event listener for clicks
                    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the gift model:', error);
                }
            );
        }
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
                this.onGiftClick();
                break;
            }
        }
    }
}

export default Gift;