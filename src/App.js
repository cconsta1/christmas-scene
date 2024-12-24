import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Santa from './Santa.js';
import Lights from './Lights.js';
import Snowman from './Snowman.js';
import ToyCar from './ToyCar.js';
import Gift from './Gift.js';
import ChristmasTree from './ChristmasTree.js';
import Train from './Train.js';
import Floor from './Floor.js';
import Skybox from './Skybox.js';
import Particles from './Particles.js';
import Text from './Text.js';

class App {
    constructor() {
        if (App.instance) {
            return App.instance;
        }
        App.instance = this;

        this.canvas = document.querySelector('canvas.webgl');
        this.scene = new THREE.Scene();
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.initCamera();
        this.initRenderer();
        this.initControls();
        this.initEventListeners();

        this.lights = new Lights(this.scene);
        this.santa = new Santa(this.scene, this.camera, this.renderer);
        this.snowman = new Snowman(this.scene, this.camera, this.renderer, this.onSnowmanClick.bind(this));
        this.toyCar = new ToyCar(this.scene, this.camera, this.renderer, this.onCarClick.bind(this), this.santa.santa);
        this.gift = new Gift(this.scene, this.camera, this.renderer);
        this.christmasTree = new ChristmasTree(this.scene, this.camera, this.renderer);
        this.train = new Train(this.scene);
        this.floor = new Floor(this.scene);
        this.skybox = new Skybox(this.scene);
        this.particles = new Particles(this.scene);
        this.text = new Text(this.scene);
        this.loadAssets().then(() => {
            this.onAssetsLoaded();
        });

        this.clock = new THREE.Clock();
        this.previousTime = 0;

        this.animate();
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(5, 5, 5); // Pull the camera back to ensure the whole scene is visible
        this.scene.add(this.camera);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0.75, 0);
        this.controls.enableDamping = true;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 10; // Ensure the camera doesn't get outside the skybox
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minAzimuthAngle = -Math.PI / 2; // Set the min azimuthal angle
        this.controls.maxAzimuthAngle = Math.PI / 2; // Set the max azimuthal angle
        this.controls.dampingFactor = 0.1;
        this.controls.enablePan = false;
    }

    initEventListeners() {
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
    }

    loadAssets() {
        return Promise.all([
            this.lights.load(),
            this.santa.load(),
            this.snowman.load(),
            this.toyCar.load(),
            this.gift.load(),
            this.christmasTree.load(),
            this.train.load(),
            this.floor.load(),
            this.skybox.load(),
            this.particles.load(),
            this.text.load()
        ]);
    }

    onClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects([
            this.santa.santa,
            ...this.snowman.snowmen.map(snowman => snowman.scene),
            ...this.toyCar.getCarMeshes(),
            ...this.gift.gifts,
            this.christmasTree.tree,
            this.train.train,
            this.text.textMesh
        ].filter(Boolean), true);

        console.log('Intersections:', intersects);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            console.log('Intersected object:', intersectedObject);
            if (intersectedObject === this.santa.santa) {
                console.log('Santa clicked');
                this.santa.lightUp();
            } else {
                const snowman = this.snowman.snowmen.find(snowman => snowman.scene === intersectedObject);
                if (snowman) {
                    console.log('Snowman clicked');
                    this.snowman.playAnimation(snowman);
                } else {
                    const car = this.toyCar.getCarByMesh(intersectedObject);
                    if (car) {
                        console.log('Car clicked');
                        this.toyCar.playCarAnimation(car);
                    } else {
                        const gift = this.gift.gifts.find(gift => gift === intersectedObject);
                        if (gift) {
                            console.log('Gift clicked');
                            this.gift.toggleGiftMaterial(gift);
                        } else if (intersectedObject === this.christmasTree.tree) {
                            console.log('Christmas tree clicked');
                            this.christmasTree.toggleAnimation();
                        } else if (intersectedObject.name.startsWith('train-')) {
                            console.log('Train clicked');
                            this.train.toggleAnimation();
                            this.train.toggleLights();
                        } else if (intersectedObject === this.text.textMesh) {
                            console.log('Text clicked');
                            this.text.handleClick();
                        }
                    }
                }
            }
        } else {
            console.log('No intersections');
        }
    }

    onSnowmanClick(snowman) {
        this.snowman.playAnimation(snowman);
    }

    onCarClick(car) {
        this.toyCar.playCarAnimation(car);
    }

    onAssetsLoaded() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
    }

    animate() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;

        if (this.santa) {
            this.santa.update(deltaTime);
        }

        if (this.snowman) {
            this.snowman.update(deltaTime);
        }

        if (this.toyCar) {
            this.toyCar.update(deltaTime);
        }

        if (this.gift) {
            this.gift.update(deltaTime);
        }

        if (this.christmasTree) {
            this.christmasTree.update(deltaTime);
        }

        if (this.train) {
            this.train.update(deltaTime);
        }

        if (this.particles) {
            this.particles.update(deltaTime);
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => this.animate());
    }
}

export default App;