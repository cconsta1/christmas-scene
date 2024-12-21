import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ShaderMaterial } from 'three'
import { GhibliShader } from './GhibliShader.js'
import { createToonShader } from './ToonShader.js'

class ChristmasTree {
    constructor(scene, camera, renderer, onTreeClick) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.mixer = null
        this.tree = null
        this.onTreeClick = onTreeClick
        this.isAnimating = false

        const gltfLoader = new GLTFLoader()

        gltfLoader.load(
            '/models/christmas-tree/christmas_tree_2.glb',
            (gltf) => {
                gltf.scene.scale.set(0.5, 0.5, 0.5) // Adjust the scale as needed
                gltf.scene.position.set(0, 0, 0) // Position the tree in the middle of the floor
                this.scene.add(gltf.scene)

                this.tree = gltf.scene

                // Apply custom shaders
                this.applyShaders(this.tree)

                // Animation
                this.mixer = new THREE.AnimationMixer(gltf.scene)
                if (gltf.animations.length > 0) {
                    this.action = this.mixer.clipAction(gltf.animations[0])
                    this.action.paused = true // Start with the animation paused
                }

                // Add event listener for clicks
                this.renderer.domElement.addEventListener('click', this.onClick.bind(this))
            }
        )
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
                    // Apply GhibliShader to the tree
                    child.material = treeShaderMaterial;
                } else if (child.name.startsWith('Sphere')) {
                    // Apply a new ToonShader to each decoration
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
        const mouse = new THREE.Vector2()
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, this.camera)

        const intersects = raycaster.intersectObject(this.tree, true)
        if (intersects.length > 0) {
            this.onTreeClick()
        }
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating
        if (this.isAnimating) {
            this.action.paused = false
            this.action.play()
        } else {
            this.action.paused = true
        }
    }

    update(deltaTime) {
        if (this.mixer && this.isAnimating) {
            this.mixer.update(deltaTime)
        }
    }
}

export default ChristmasTree