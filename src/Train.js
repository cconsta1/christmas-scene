import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

class Train {
    constructor(scene) {
        this.scene = scene
        this.mixer = null
        this.train = null
        this.radius = 4
        this.isAnimating = false
        this.elapsedTime = 0

        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')

        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(
            '/models/train/back_to_the_future_train_-_steam_locomotive.glb',
            (gltf) => {
                gltf.scene.scale.set(0.5, 0.5, 0.5)
                this.scene.add(gltf.scene)

                this.train = gltf.scene

                this.mixer = new THREE.AnimationMixer(gltf.scene)
                if (gltf.animations.length > 0) {
                    const action = this.mixer.clipAction(gltf.animations[0])
                    action.play()
                }

                // Set initial static position
                const initialAngle = 0 // Adjust initial angle as needed
                this.train.position.x = this.radius * Math.cos(initialAngle)
                this.train.position.z = this.radius * Math.sin(initialAngle)
                this.train.rotation.y = -initialAngle - Math.PI / 2
            }
        )
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating
    }

    move(deltaTime) {
        if (this.train && this.isAnimating) {
            this.elapsedTime += deltaTime
            const angle = this.elapsedTime * 1.0
            this.train.position.x = this.radius * Math.cos(angle)
            this.train.position.z = this.radius * Math.sin(angle)
            this.train.rotation.y = -angle - Math.PI / 2
        }
    }

    update(deltaTime) {
        if (this.mixer && this.isAnimating) {
            this.mixer.update(deltaTime)
        }
    }
}

export default Train