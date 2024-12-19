import * as THREE from 'three'

class AnimatedLights {
    constructor(scene, tree) {
        this.scene = scene
        this.tree = tree
        this.lights = []
        this.numLights = 5 // Number of lights around the tree

        // Create multiple point lights with different colors
        for (let i = 0; i < this.numLights; i++) {
            const color = new THREE.Color(`hsl(${(i / this.numLights) * 360}, 100%, 50%)`)
            const angle = (i / this.numLights) * Math.PI * 2
            const position = new THREE.Vector3(Math.cos(angle) * 1.5, 1 + Math.random() * 2, Math.sin(angle) * 1.5)
            this.addLight(color, position)
        }
    }

    addLight(color, position) {
        const pointLight = new THREE.PointLight(color, 1, 5)
        pointLight.position.copy(position)
        this.scene.add(pointLight)
        this.lights.push(pointLight)
    }

    update(elapsedTime) {
        // Animate the lights around the tree
        this.lights.forEach((light, index) => {
            const angle = (index / this.numLights) * Math.PI * 2 + elapsedTime * 0.5
            light.position.x = Math.cos(angle) * 1.5
            light.position.z = Math.sin(angle) * 1.5
            light.position.y = 1 + Math.sin(elapsedTime * 2 + index) * 0.5
        })
    }
}

export default AnimatedLights