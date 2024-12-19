import * as THREE from 'three'

class Particles {
    constructor(scene) {
        const particleCount = 30000
        const particles = new THREE.BufferGeometry()
        const particlePositions = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 20
            particlePositions[i * 3 + 1] = Math.random() * 20
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20
        }

        particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

        const textureLoader = new THREE.TextureLoader()
        const snowflakeTexture = textureLoader.load('/textures/snowflake.png')

        const particleMaterial = new THREE.PointsMaterial({
            map: snowflakeTexture,
            transparent: true,
            alphaTest: 0.5,
            size: 0.05,
            sizeAttenuation: true
        })

        this.particleSystem = new THREE.Points(particles, particleMaterial)
        scene.add(this.particleSystem)
    }

    update(deltaTime) {
        const positions = this.particleSystem.geometry.attributes.position.array
        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] -= deltaTime * 0.5
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 20
            }
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true
    }
}

export default Particles