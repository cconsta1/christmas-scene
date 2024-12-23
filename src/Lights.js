import * as THREE from 'three';

class Lights {
    constructor(scene) {
        this.scene = scene;
    }

    load() {
        return new Promise((resolve) => {
            const ambientLight = new THREE.AmbientLight(0x404040, 5); // Soft white light with high intensity
            this.scene.add(ambientLight);

            const positions = [
                { x: 5, y: 10, z: 7.5 },
                { x: -5, y: 10, z: 7.5 },
                { x: 5, y: 10, z: -7.5 },
                { x: -5, y: 10, z: -7.5 }
            ];

            positions.forEach(position => {
                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(position.x, position.y, position.z);
                directionalLight.castShadow = true;
                directionalLight.shadow.camera.near = 0.1;
                directionalLight.shadow.camera.far = 25;
                directionalLight.shadow.camera.left = -10;
                directionalLight.shadow.camera.right = 10;
                directionalLight.shadow.camera.top = 10;
                directionalLight.shadow.camera.bottom = -10;
                directionalLight.shadow.mapSize.width = 1024;
                directionalLight.shadow.mapSize.height = 1024;
                this.scene.add(directionalLight);
            });

            resolve();
        });
    }
}

export default Lights;