import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Train from './Train.js'
import Floor from './Floor.js'
import Lights from './Lights.js'
import Particles from './Particles.js'
import ChristmasTree from './ChristmasTree.js'
import AnimatedLights from './AnimatedLights.js'

class App {
    constructor() {
        if (App.instance) {
            return App.instance
        }
        App.instance = this

        this.gui = new GUI()
        this.canvas = document.querySelector('canvas.webgl')
        this.scene = new THREE.Scene()
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.initCamera()
        this.initRenderer()
        this.initControls()
        this.initEventListeners()

        this.train = new Train(this.scene)
        this.floor = new Floor(this.scene)
        this.lights = new Lights(this.scene)
        this.particles = new Particles(this.scene)
        this.christmasTree = new ChristmasTree(this.scene, this.camera, this.renderer, this.onTreeClick.bind(this))
        // this.animatedLights = new AnimatedLights(this.scene)

        this.initAudio()

        this.clock = new THREE.Clock()
        this.previousTime = 0

        this.animate()
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(2, 2, 2)
        this.scene.add(this.camera)
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        })
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.target.set(0, 0.75, 0)
        this.controls.enableDamping = true
    }

    initEventListeners() {
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight

            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()

            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }

    initAudio() {
        const listener = new THREE.AudioListener()
        this.camera.add(listener)

        const sound = new THREE.Audio(listener)
        const audioLoader = new THREE.AudioLoader()
        audioLoader.load('/audio/jingle_bells.mp3', (buffer) => { // Replace with the path to your audio file
            sound.setBuffer(buffer)
            sound.setLoop(true)
            sound.setVolume(0.5)
            sound.play()
        })
    }

    onTreeClick() {
        this.train.toggleAnimation()
        this.christmasTree.toggleAnimation()
    }

    animate() {
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this.train.update(deltaTime)
        this.train.move(deltaTime)
        this.particles.update(deltaTime)
        this.christmasTree.update(deltaTime)
        // this.animatedLights.update(elapsedTime)

        this.controls.update()
        this.renderer.render(this.scene, this.camera)

        requestAnimationFrame(() => this.animate())
    }
}

export default App