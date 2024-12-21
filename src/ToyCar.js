import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ToyCar {
    constructor(scene, camera, renderer, onCarClick, tree) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.cars = [];
        this.onCarClick = onCarClick;
        this.tree = tree;

        const gltfLoader = new GLTFLoader();

        const positions = [
            { x: 0, z: 2 }, // In front of the tree
            { x: 0, z: -2 }, // Behind the tree
            { x: 2, z: 0 } // To the side of the tree
        ];

        for (let i = 0; i < 3; i++) {
            gltfLoader.load(
                '/models/car/low_poly_car_classic_coupe.glb',
                (gltf) => {
                    gltf.scene.scale.set(0.5, 0.5, 0.5); // Adjust the scale as needed

                    // Set position and rotation
                    const position = positions[i];
                    gltf.scene.position.set(position.x, 0, position.z);
                    gltf.scene.rotation.y = Math.random() * Math.PI * 2; // Random rotation

                    this.scene.add(gltf.scene);

                    // Animation
                    const mixer = new THREE.AnimationMixer(gltf.scene);
                    let action = null;
                    if (gltf.animations.length > 0) {
                        action = mixer.clipAction(gltf.animations[0]);
                        action.paused = true; // Start with the animation paused
                    }

                    this.cars.push({ scene: gltf.scene, mixer: mixer, action: action });

                    // Add event listener for clicks
                    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the car model:', error);
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

        for (const car of this.cars) {
            const intersects = raycaster.intersectObject(car.scene, true);
            if (intersects.length > 0) {
                this.onCarClick(car);
                break;
            }
        }
    }

    playCarAnimation(car) {
        if (car.action) {
            car.action.paused = !car.action.paused;
            if (!car.action.paused) {
                car.action.play();
            }
        }
    }

    update(deltaTime) {
        for (const car of this.cars) {
            if (car.mixer) {
                car.mixer.update(deltaTime);
            }
        }
    }
}

export default ToyCar;