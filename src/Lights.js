import * as THREE from 'three'

class Lights {
    constructor(scene) {
        const ambientLight = new THREE.AmbientLight(0x404040, 1) // Soft white light
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 10, 7.5)
        directionalLight.castShadow = true
        directionalLight.shadow.camera.near = 0.1
        directionalLight.shadow.camera.far = 25
        directionalLight.shadow.camera.left = -10
        directionalLight.shadow.camera.right = 10
        directionalLight.shadow.camera.top = 10
        directionalLight.shadow.camera.bottom = -10
        directionalLight.shadow.mapSize.width = 1024
        directionalLight.shadow.mapSize.height = 1024
        scene.add(directionalLight)
    }
}

export default Lights