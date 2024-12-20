import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            })

            // Center the text
            textGeometry.center()

            // Load the matcap texture
            const textureLoader = new THREE.TextureLoader()
            const matcapTexture = textureLoader.load('/textures/matcaps/045C5C_0DBDBD_049393_04A4A4.png')
            matcapTexture.colorSpace = THREE.SRGBColorSpace

            // Create the material
            const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

            // Create the mesh
            const textMesh = new THREE.Mesh(textGeometry, textMaterial)
            textMesh.position.set(1, 0.3, 0) // Adjust the position as needed
            textMesh.rotation.y = Math.PI * 0.5
            this.scene.add(textMesh)
        })
    }
}

export default Text