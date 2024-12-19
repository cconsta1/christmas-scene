import * as THREE from 'three'

class Floor {
    constructor(scene) {
        const textureLoader = new THREE.TextureLoader()

        const diffuseTexture = textureLoader.load('/textures/Snow_003_SD/Snow_003_COLOR.jpg')
        const normalTexture = textureLoader.load('/textures/Snow_003_SD/Snow_003_NORM.jpg')
        const displacementTexture = textureLoader.load('/textures/Snow_003_SD/Snow_003_DISP.png')
        const roughnessTexture = textureLoader.load('/textures/Snow_003_SD/Snow_003_ROUGH.jpg')
        const aoTexture = textureLoader.load('/textures/Snow_003_SD/Snow_003_OCC.jpg')

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10, 100, 100), // Increased segments for better displacement
            new THREE.MeshStandardMaterial({
                map: diffuseTexture,
                normalMap: normalTexture,
                displacementMap: displacementTexture,
                displacementScale: 0.001, // Adjust the scale as needed
                roughnessMap: roughnessTexture,
                aoMap: aoTexture,
                metalness: 0,
                roughness: 1
            })
        )
        floor.receiveShadow = true
        floor.rotation.x = -Math.PI * 0.5
        scene.add(floor)
    }
}

export default Floor