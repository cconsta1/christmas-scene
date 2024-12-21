import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import { StarShader } from './StarShader.js';

class Star {
    constructor(scene, tree) {
        this.scene = scene;
        this.tree = tree;

        // Create the star geometry
        const starGeometry = new THREE.OctahedronGeometry(0.1, 0); // Smaller size

        // Uncomment the following line to use a tetrahedron shape instead
        // const starGeometry = new THREE.TetrahedronGeometry(0.1, 0); // Smaller size

        // Create the material using the StarShader
        const starMaterial = new ShaderMaterial({
            vertexShader: StarShader.vertexShader,
            fragmentShader: StarShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone(StarShader.uniforms),
        });

        // Create the star mesh
        this.star = new THREE.Mesh(starGeometry, starMaterial);

        // Position the star on top of the tree
        this.positionStar();

        // Add the star to the scene
        this.scene.add(this.star);
    }

    positionStar() {
        // Find the height of the tree
        const box = new THREE.Box3().setFromObject(this.tree);
        const treeHeight = box.max.y - box.min.y;

        // Position the star on top of the tree
        this.star.position.set(0, treeHeight + 0.1, 0); // Adjusted for taller tree
    }
}

export default Star;