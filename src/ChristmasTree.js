import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ShaderMaterial } from 'three';
import { GhibliShader } from './GhibliShader.js';
import { createToonShader } from './ToonShader.js';
import Star from './Star.js';

class ChristmasTree {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.mixer = null;
        this.tree = null;
        this.isAnimating = false;

        this.initAudio();
    }

    load() {
        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();

            gltfLoader.load(
                '/models/christmas-tree/christmas_tree_2.glb',
                (gltf) => {
                    gltf.scene.scale.set(0.8, 0.8, 0.8);
                    gltf.scene.position.set(0, 0, 0);
                    this.scene.add(gltf.scene);

                    this.tree = gltf.scene;

                    this.applyShaders(this.tree);

                    this.star = new Star(this.scene, this.tree);

                    this.mixer = new THREE.AnimationMixer(gltf.scene);
                    if (gltf.animations.length > 0) {
                        this.action = this.mixer.clipAction(gltf.animations[0]);
                        this.action.paused = true;
                    }

                    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));

                    // Resolve the promise after the tree model is loaded
                    resolve();
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the Christmas tree model:', error);
                    reject(error);
                }
            );
        });
    }

    initAudio() {
        const listener = new THREE.AudioListener();
        this.camera.add(listener);

        this.sound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('audio/The_Waitresses_Christmas_Wrapping.mp3', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(0.5);
        });
    }

    applyShaders(object) {
        const treeShaderMaterial = new ShaderMaterial({
            vertexShader: GhibliShader.vertexShader,
            fragmentShader: GhibliShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone(GhibliShader.uniforms)
        });

        object.traverse((child) => {
            if (child.isMesh) {
                if (child.name === 'model_default_0') {
                    child.material = treeShaderMaterial;
                } else if (child.name.startsWith('Sphere')) {
                    const toonShader = createToonShader();
                    const decorationShaderMaterial = new ShaderMaterial({
                        vertexShader: toonShader.vertexShader,
                        fragmentShader: toonShader.fragmentShader,
                        uniforms: THREE.UniformsUtils.clone(toonShader.uniforms)
                    });
                    child.material = decorationShaderMaterial;
                }
            }
        });
    }

    onClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObject(this.tree, true);
        if (intersects.length > 0) {
            this.toggleAnimation();
            if (this.sound.isPlaying) {
                this.sound.pause();
            } else {
                this.sound.play();
            }
        }
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        if (this.isAnimating) {
            this.action.paused = false;
            this.action.play();
        } else {
            this.action.paused = true;
        }
    }

    update(deltaTime) {
        if (this.mixer && this.isAnimating) {
            this.mixer.update(deltaTime);
        }
    }
}

export default ChristmasTree;