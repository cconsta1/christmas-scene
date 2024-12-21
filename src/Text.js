import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { ShaderMaterial } from 'three'
import { TextShader } from './TextShader.js'

class Text {
    constructor(scene) {
        this.scene = scene

        // Load the font
        const fontLoader = new FontLoader()
        fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            // Create the text geometry
            const textGeometry = new TextGeometry('Merry Christmas', {
                font: font,
                size: 0.5,
                depth: 0.2, // Use .depth instead of .height
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            })

            // Center the text
            textGeometry.center()

            // Create the material using the TextShader
            const textMaterial = new ShaderMaterial({
                vertexShader: TextShader.vertexShader,
                fragmentShader: TextShader.fragmentShader,
                uniforms: THREE.UniformsUtils.clone(TextShader.uniforms)
            })

            // Create the mesh
            const textMesh = new THREE.Mesh(textGeometry, textMaterial)
            textMesh.position.set(1, 0.3, 0) // Adjust the position as needed
            textMesh.rotation.y = Math.PI * 0.5
            this.scene.add(textMesh)
        })
    }
}

export default Text