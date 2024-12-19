import * as THREE from 'three'

class Lights {
    constructor(scene) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 10.8)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.camera.far = 15
        directionalLight.shadow.camera.left = -7
        directionalLight.shadow.camera.top = 7
        directionalLight.shadow.camera.right = 7
        directionalLight.shadow.camera.bottom = -7
        directionalLight.position.set(-5, 5, 0)
        scene.add(directionalLight)

        // Add colorful lights
        this.addPointLight(scene, 0xff0000, new THREE.Vector3(2, 2, 2))
        this.addPointLight(scene, 0x00ff00, new THREE.Vector3(-2, 2, -2))
        this.addPointLight(scene, 0x0000ff, new THREE.Vector3(2, 2, -2))
        this.addPointLight(scene, 0xffff00, new THREE.Vector3(-2, 2, 2))
    }

    addPointLight(scene, color, position) {
        const pointLight = new THREE.PointLight(color, 1, 10)
        pointLight.position.copy(position)
        scene.add(pointLight)
    }
}

export default Lights