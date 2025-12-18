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
                        // Play animation if it exists, but keep it subtle or just let it be
                        // this.action.play(); 
                    }

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
        audioLoader.load('audio/Happy_Little_Elves_Audionautix.mp3', (buffer) => {
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
                // Default everything to pine-green tree shading
                child.material = treeShaderMaterial;

                // Try to detect ornament meshes robustly (names vary across exports)
                const name = (child.name || '').toLowerCase();
                let maxDim = Infinity;

                if (child.geometry) {
                    if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
                    if (child.geometry.boundingBox) {
                        const size = new THREE.Vector3();
                        child.geometry.boundingBox.getSize(size);
                        maxDim = Math.max(size.x, size.y, size.z);
                    }
                }

                const isOrnament =
                    name.startsWith('sphere') ||
                    name.includes('ornament') ||
                    name.includes('bauble') ||
                    name.includes('ball') ||
                    maxDim < 0.35;

                if (isOrnament) {
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

    update(deltaTime) {
        if (this.mixer && this.isAnimating) {
            this.mixer.update(deltaTime);
        }
    }
}

export default ChristmasTree;