import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Spaghetti code used when I started the project to experiment with things.
 */

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;
let train = null;

gltfLoader.load(
    '/models/train/back_to_the_future_train_-_steam_locomotive.glb',
    (gltf) => {
        gltf.scene.scale.set(0.5, 0.5, 0.5); // Adjust scale
        scene.add(gltf.scene);

        train = gltf.scene;

        console.log('Available animations:', gltf.animations);

        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene);
        if (gltf.animations.length > 0) {
            const action = mixer.clipAction(gltf.animations[0]); // Play the first animation
            action.play();
        }
    }
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
);
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.4); // Adjust light intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10.8); // Adjust light intensity
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = - 7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = - 7;
directionalLight.position.set(- 5, 5, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 2); // Adjust camera position
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0); // Adjust target
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Particles (Snow)
 */
const particleCount = 10000; // Adjust particle count
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 20; // Adjust position range
    particlePositions[i * 3 + 1] = Math.random() * 20; // Adjust position range
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20; // Adjust position range
}

particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

// Load snowflake texture
const textureLoader = new THREE.TextureLoader();
const snowflakeTexture = textureLoader.load('/sprites/snowflake.png'); // Replace with the path to your snowflake sprite

const particleMaterial = new THREE.PointsMaterial({
    map: snowflakeTexture,
    transparent: true,
    alphaTest: 0.5,
    size: 0.1,
    sizeAttenuation: true
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const radius = 4; // Adjust the radius as needed

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Model animation
    if (mixer) {
        mixer.update(deltaTime);
    }

    // Move train in a circle
    if (train) {
        const angle = elapsedTime * 1.0; // Adjust speed as needed
        train.position.x = radius * Math.cos(angle);
        train.position.z = radius * Math.sin(angle);
        train.rotation.y = -angle - Math.PI / 2; // Rotate the train to face the direction of movement
    }

    // Update particles (snow)
    const positions = particles.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= deltaTime * 0.5; // Adjust speed as needed
        if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 20;
        }
    }
    particles.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();