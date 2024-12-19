import * as THREE from 'three'

class Track {
    constructor(scene, radius = 4, tubeRadius = 0.05, radialSegments = 8, tubularSegments = 100, trackSpacing = 0.2) {
        this.scene = scene

        const createTrack = (offset) => {
            const curve = new THREE.Curve()
            curve.getPoint = function (t) {
                const angle = t * Math.PI * 2
                return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius + offset)
            }

            const geometry = new THREE.TubeGeometry(curve, tubularSegments, tubeRadius, radialSegments, true)
            const material = new THREE.MeshStandardMaterial({ color: 0x000000 })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.receiveShadow = true
            mesh.castShadow = true

            this.scene.add(mesh)
        }

        // Create two parallel tracks
        createTrack(trackSpacing / 2)
        createTrack(-trackSpacing / 2)
    }
}

export default Track