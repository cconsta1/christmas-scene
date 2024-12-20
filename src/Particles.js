import * as THREE from 'three'

class Particles {
    constructor(scene) {
        const particleCount = 50000 // Half the total particle count for each type

        // Create geometry and positions for the first particle system
        const particles1 = new THREE.BufferGeometry()
        const particlePositions1 = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            particlePositions1[i * 3] = (Math.random() - 0.5) * 20
            particlePositions1[i * 3 + 1] = Math.random() * 20
            particlePositions1[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
        particles1.setAttribute('position', new THREE.BufferAttribute(particlePositions1, 3))

        // Create geometry and positions for the second particle system
        const particles2 = new THREE.BufferGeometry()
        const particlePositions2 = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            particlePositions2[i * 3] = (Math.random() - 0.5) * 20
            particlePositions2[i * 3 + 1] = Math.random() * 20
            particlePositions2[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
        particles2.setAttribute('position', new THREE.BufferAttribute(particlePositions2, 3))

        const textureLoader = new THREE.TextureLoader()
        const snowflakeTexture1 = textureLoader.load('/sprites/snowflake1.png')
        const snowflakeTexture2 = textureLoader.load('/sprites/snowflake2.png')

        const particleMaterial1 = new THREE.PointsMaterial({
            map: snowflakeTexture1,
            transparent: true,
            alphaTest: 0.5,
            size: 0.1, // Increase the size of the particles
            sizeAttenuation: true,
            color: new THREE.Color(0xffffff), // Set the color to white
            opacity: 0.8, // Adjust the opacity for a shinier effect
            blending: THREE.AdditiveBlending, // Use additive blending for a shiny effect
            depthWrite: false // Disable depth write for better blending
        })

        const particleMaterial2 = new THREE.PointsMaterial({
            map: snowflakeTexture2,
            transparent: true,
            alphaTest: 0.5,
            size: 0.2, // Increase the size of the particles
            sizeAttenuation: true,
            color: new THREE.Color(0xadd8e6), // Light blue color
            opacity: 0.8, // Adjust the opacity for a shinier effect
            blending: THREE.AdditiveBlending, // Use additive blending for a shiny effect
            depthWrite: false // Disable depth write for better blending
        })

        this.particleSystem1 = new THREE.Points(particles1, particleMaterial1)
        this.particleSystem2 = new THREE.Points(particles2, particleMaterial2)
        scene.add(this.particleSystem1)
        scene.add(this.particleSystem2)
    }

    update(deltaTime) {
        const positions1 = this.particleSystem1.geometry.attributes.position.array
        for (let i = 0; i < positions1.length / 3; i++) {
            positions1[i * 3 + 1] -= deltaTime * 0.5
            if (positions1[i * 3 + 1] < 0) {
                positions1[i * 3 + 1] = 20
            }
        }
        this.particleSystem1.geometry.attributes.position.needsUpdate = true

        const positions2 = this.particleSystem2.geometry.attributes.position.array
        for (let i = 0; i < positions2.length / 3; i++) {
            positions2[i * 3 + 1] -= deltaTime * 0.5
            if (positions2[i * 3 + 1] < 0) {
                positions2[i * 3 + 1] = 20
            }
        }
        this.particleSystem2.geometry.attributes.position.needsUpdate = true
    }
}

export default Particles