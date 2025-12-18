import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import Lights from './Lights.js';
import Gift from './Gift.js';
import ChristmasTree from './ChristmasTree.js';
import Floor from './Floor.js';
import Skybox from './Skybox.js';
import Particles from './Particles.js';
import Fireflies from './Fireflies.js';
import { PopArtShader } from './PopArtShader.js';

class App {
    constructor() {
        if (App.instance) {
            return App.instance;
        }
        App.instance = this;

        this.canvas = document.querySelector('canvas.webgl');
        this.scene = new THREE.Scene();
        // Add fog for atmosphere (deep indigo negative space)
        this.scene.fog = new THREE.FogExp2(0x06061b, 0.028);
        
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.initCamera();
        this.initRenderer();
        this.initPostProcessing();
        this.initControls();
        this.initEventListeners();

        this.lights = new Lights(this.scene);
        this.gift = new Gift(this.scene, this.camera, this.renderer);
        this.christmasTree = new ChristmasTree(this.scene, this.camera, this.renderer);
        this.floor = new Floor(this.scene);
        this.skybox = new Skybox(this.scene);
        this.particles = new Particles(this.scene);
        this.fireflies = new Fireflies(this.scene);
        this.popArtPass = null;
        
        this.loadAssets().then(() => {
            this.onAssetsLoaded();
        });

        this.clock = new THREE.Clock();
        this.previousTime = 0;

        this.animate();
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(0, 2, 12); // Cinematic framing
        this.scene.add(this.camera);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Tone mapping for better lighting
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.35;
    }

    initPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Pop-art stylization pass (posterize + halftone + slight RGB split)
        this.popArtPass = new ShaderPass(PopArtShader);
        this.popArtPass.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        this.composer.addPass(this.popArtPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        bloomPass.strength = 0.75; // Stronger bulb glow
        bloomPass.radius = 0.28; // Still fairly tight
        bloomPass.threshold = 0.78; // Catch emissive bulbs a bit more
        
        this.composer.addPass(bloomPass);

        // Vignette Shader
        const VignetteShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "offset": { value: 1.0 },
                "darkness": { value: 1.1 }
            },
            vertexShader: [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n"),
            fragmentShader: [
                "uniform float offset;",
                "uniform float darkness;",
                "uniform sampler2D tDiffuse;",
                "varying vec2 vUv;",
                "void main() {",
                "vec4 texel = texture2D( tDiffuse, vUv );",
                "vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );",
                "gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );",
                "}"
            ].join("\n")
        };

        const vignettePass = new ShaderPass(VignetteShader);
        this.composer.addPass(vignettePass);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1.5, 0); // Look at the tree center
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.02; // Smoother damping
        this.controls.minDistance = 5;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.3; // Slower, more cinematic rotation
    }

    initEventListeners() {
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            this.composer.setSize(this.sizes.width, this.sizes.height);
            this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            if (this.popArtPass?.material?.uniforms?.uResolution) {
                this.popArtPass.material.uniforms.uResolution.value.set(this.sizes.width, this.sizes.height);
            }
        });
    }

    loadAssets() {
        return Promise.all([
            this.lights.load(),
            this.gift.load(),
            this.christmasTree.load(),
            this.floor.load(),
            this.skybox.load(),
            this.particles.load(),
            this.fireflies.load()
        ]);
    }

    onAssetsLoaded() {
        const loadingScreen = document.getElementById('loading-screen');
        if(loadingScreen) loadingScreen.style.display = 'none';
    }

    animate() {
        const elapsedTime = this.clock.getElapsedTime();
        let deltaTime = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;

        // Cap deltaTime to prevent huge jumps (e.g. when tab is inactive)
        if (deltaTime > 0.1) deltaTime = 0.1;

        if (this.gift) {
            this.gift.update(deltaTime, elapsedTime);
        }

        if (this.christmasTree) {
            this.christmasTree.update(deltaTime);
        }

        if (this.particles) {
            this.particles.update(deltaTime);
        }

        if (this.fireflies) {
            this.fireflies.update(deltaTime, elapsedTime);
        }

        if (this.floor) {
            this.floor.update(this.camera);
        }

        if (this.popArtPass?.material?.uniforms?.uTime) {
            this.popArtPass.material.uniforms.uTime.value = elapsedTime;
        }

        this.controls.update();
        // this.renderer.render(this.scene, this.camera);
        this.composer.render();

        requestAnimationFrame(() => this.animate());
    }
}

export default App;