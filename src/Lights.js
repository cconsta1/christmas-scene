import * as THREE from 'three';

class Lights {
    constructor(scene) {
        this.scene = scene;
    }

    load() {
        return new Promise((resolve) => {
            // Ambient light - Cool blue night tint
            const ambientLight = new THREE.AmbientLight(0x1a234d, 0.5);
            this.scene.add(ambientLight);

            // Moonlight - Directional light with shadows
            const moonLight = new THREE.DirectionalLight(0xcceeff, 1.5);
            moonLight.position.set(5, 10, 5);
            moonLight.castShadow = true;
            
            // Optimize shadow map
            moonLight.shadow.mapSize.width = 2048;
            moonLight.shadow.mapSize.height = 2048;
            moonLight.shadow.camera.near = 0.1;
            moonLight.shadow.camera.far = 30;
            moonLight.shadow.camera.left = -10;
            moonLight.shadow.camera.right = 10;
            moonLight.shadow.camera.top = 10;
            moonLight.shadow.camera.bottom = -10;
            moonLight.shadow.bias = -0.0005;
            
            this.scene.add(moonLight);

            // Warm glow from the tree area
            const treeLight = new THREE.PointLight(0xffaa33, 2, 10);
            treeLight.position.set(0, 2, 0);
            this.scene.add(treeLight);

            // Backlight/Rim light for separation
            const rimLight = new THREE.SpotLight(0x4d66cc, 2);
            rimLight.position.set(-5, 5, -5);
            rimLight.lookAt(0, 0, 0);
            this.scene.add(rimLight);

            resolve();
        });
    }
}

export default Lights;