import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const FireShader = {
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            float intensity = pow(1.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 10.0);
            vec3 fireColor = vec3(1.0, 0.5, 0.0); // Fire color
            vec3 glow = fireColor * intensity;
            vec3 reflection = vec3(1.0) * pow(max(dot(reflect(normalize(vPosition), vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 5.0);
            gl_FragColor = vec4(glow + reflection, 1.0);
        }
    `
};

class Train {
    constructor(scene) {
        this.scene = scene;
        this.mixer = null;
        this.train = null;
        this.radius = 3.8;
        this.isAnimating = false; // Set to false to start static
        this.isLit = false;
        this.elapsedTime = 0;
        this.originalMaterials = [];
    }

    load() {
        return new Promise((resolve, reject) => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/draco/');

            const gltfLoader = new GLTFLoader();
            gltfLoader.setDRACOLoader(dracoLoader);

            gltfLoader.load(
                '/models/train/back_to_the_future_train_-_steam_locomotive.glb',
                (gltf) => {
                    gltf.scene.scale.set(0.3, 0.3, 0.3);
                    this.scene.add(gltf.scene);

                    this.train = gltf.scene;

                    this.train.traverse((child) => {
                        if (child.isMesh) {
                            this.originalMaterials.push(child.material); // Store original materials
                            child.name = `train-${child.name}`; // Add prefix to mesh names
                        }
                    });

                    this.mixer = new THREE.AnimationMixer(gltf.scene);
                    if (gltf.animations.length > 0) {
                        const filteredTracks = gltf.animations[0].tracks.filter(track => {
                            const trackName = track.name.split('.')[0];
                            return this.train.getObjectByName(trackName) !== undefined;
                        });
                        const filteredClip = new THREE.AnimationClip(gltf.animations[0].name, gltf.animations[0].duration, filteredTracks);
                        this.action = this.mixer.clipAction(filteredClip);
                        this.action.play();
                        this.action.paused = true; // Pause the animation initially
                    }

                    const initialAngle = 0;
                    this.train.position.x = this.radius * Math.cos(initialAngle);
                    this.train.position.z = this.radius * Math.sin(initialAngle);
                    this.train.rotation.y = -initialAngle - Math.PI / 2;
                    this.train.position.y = 0.01;

                    console.log('Train loaded');
                    resolve();
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the train model:', error);
                    reject(error);
                }
            );
        });
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        console.log('Toggling animation:', this.isAnimating);
        if (this.isAnimating) {
            console.log('Playing animation');
            this.action.paused = false;
            this.action.play();
        } else {
            console.log('Pausing animation');
            this.action.paused = true;
        }
    }

    toggleLights() {
        this.isLit = !this.isLit;
        console.log('Toggling lights:', this.isLit);
        const fireMaterial = new THREE.ShaderMaterial({
            vertexShader: FireShader.vertexShader,
            fragmentShader: FireShader.fragmentShader
        });
        let materialIndex = 0;
        this.train.traverse((child) => {
            if (child.isMesh) {
                if (this.isLit) {
                    child.material = fireMaterial; // Apply fire shader material
                } else {
                    child.material = this.originalMaterials[materialIndex]; // Revert to original material
                    materialIndex++;
                }
            }
        });
    }

    move(deltaTime) {
        if (this.train && this.isAnimating) {
            this.elapsedTime += deltaTime;
            const angle = this.elapsedTime * 0.60;
            this.train.position.x = this.radius * Math.cos(angle);
            this.train.position.z = this.radius * Math.sin(angle);
            this.train.rotation.y = -angle - Math.PI / 2;
        }
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        this.move(deltaTime);
    }

    onClick(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.scene.camera);

        const intersects = raycaster.intersectObjects(this.train.children, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.name === 'train-Object_28') {
                console.log('Clicked on the train light');
                object.material = new THREE.ShaderMaterial({
                    vertexShader: FireShader.vertexShader,
                    fragmentShader: FireShader.fragmentShader
                }); // Apply fire shader material
            }
        }
    }
}

export default Train;