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
    }

    load() {
        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();

            const positions = [
                { x: 0, z: 2 }, // In front of the tree
                { x: 0, z: -2 }, // Behind the tree
                { x: 2, z: 0 } // To the side of the tree
            ];

            let loadedCount = 0;

            gltfLoader.load(
                '/models/car/low_poly_car_classic_coupe.glb',
                (gltf) => {
                    for (let i = 0; i < positions.length; i++) {
                        const carClone = gltf.scene.clone();
                        carClone.scale.set(0.5, 0.5, 0.5); // Adjust the scale as needed

                        // Set position and rotation
                        const position = positions[i];
                        carClone.position.set(position.x, 0, position.z);
                        carClone.rotation.y = Math.random() * Math.PI * 2; // Random rotation

                        this.scene.add(carClone);

                        // Animation
                        const mixer = new THREE.AnimationMixer(carClone);
                        let action = null;
                        if (gltf.animations.length > 0) {
                            action = mixer.clipAction(gltf.animations[0]);
                            action.paused = true; // Start with the animation paused
                            action.loop = THREE.LoopOnce; // Play the animation only once
                            action.clampWhenFinished = true; // Keep the last frame when finished
                        }

                        this.cars.push({ scene: carClone, mixer: mixer, action: action });

                        loadedCount++;
                        if (loadedCount === positions.length) {
                            // Resolve the promise after all car models are cloned
                            resolve();
                        }
                    }
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the car model:', error);
                    reject(error);
                }
            );

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
            console.log('Playing animation for car:', car);
            car.action.reset(); // Reset the animation to the start
            car.action.paused = false;
            car.action.play();
        } else {
            console.log('No animation action found for car:', car);
        }
    }

    toggleLights() {
        // Maybe in the future
    }

    update(deltaTime) {
        for (const car of this.cars) {
            if (car.mixer) {
                car.mixer.update(deltaTime);
            }
        }
    }

    getCarMeshes() {
        const carMeshes = this.cars.map(car => car.scene);
        return carMeshes;
    }

    getCarByMesh(mesh) {
        console.log('Getting car by mesh:', mesh);
        while (mesh.parent && !this.cars.some(car => car.scene === mesh)) {
            mesh = mesh.parent;
        }
        const car = this.cars.find(car => car.scene === mesh);
        console.log('Found car:', car);
        return car;
    }
}

export default ToyCar;