import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Santa {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.santa = null;

        const gltfLoader = new GLTFLoader();

        gltfLoader.load(
            '/models/santa/jolly_santa.glb',
            (gltf) => {
                gltf.scene.scale.set(15, 15, 15); // Adjust the scale as needed

                // Set position and rotation
                gltf.scene.position.set(3.5, 0.1, 3.5); // Position Santa away from the tree
                gltf.scene.rotation.y = Math.random() * Math.PI * 2; // Random rotation

                this.scene.add(gltf.scene);

                // Store the Santa model
                this.santa = gltf.scene;

                // Add event listener for clicks
                this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
            },
            undefined,
            (error) => {
                console.error('An error happened while loading the Santa model:', error);
            }
        );
    }

    onClick(event) {
        console.log('Canvas clicked'); // Debugging log

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        if (this.santa) {
            const intersects = raycaster.intersectObject(this.santa, true);
            if (intersects.length > 0) {
                console.log('Santa clicked'); // Debugging log
                this.showMessage();
            } else {
                console.log('Santa not clicked'); // Debugging log
            }
        }
    }

    showMessage() {
        console.log('Showing message'); // Debugging log

        const messageCanvas = document.createElement('canvas');
        const context = messageCanvas.getContext('2d');
        context.font = 'Bold 20px Arial';
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(0, 0, 16, 8);
        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.fillText("You've been naughty!", 10, 40);

        const texture = new THREE.CanvasTexture(messageCanvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 1.25, 1); // Adjust the scale as needed
        sprite.position.set(0, 3, 0); // Position the label above Santa's head

        console.log('Adding sprite to Santa'); // Debugging log
        this.santa.add(sprite);

        setTimeout(() => {
            console.log('Removing sprite from Santa'); // Debugging log
            this.santa.remove(sprite);
        }, 3000); // Remove the message after 3 seconds
    }

    update(deltaTime) {
        // No need to update anything for the message
    }
}

export default Santa;