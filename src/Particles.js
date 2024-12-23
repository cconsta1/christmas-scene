import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import { SnowParticleShader } from './SnowParticleShader.js';

class Particles {
    constructor(scene) {
        this.scene = scene;
        this.particleSystem = null;
    }

    load() {
        return new Promise((resolve) => {
            const particleCount = 100000;

            // Create geometry and positions for the particle system
            const particles = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
                particlePositions[i * 3] = (Math.random() - 0.5) * 20;
                particlePositions[i * 3 + 1] = Math.random() * 20;
                particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            }
            particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

            // Create the material using the SnowParticleShader
            const particleMaterial = new ShaderMaterial({
                vertexShader: SnowParticleShader.vertexShader,
                fragmentShader: SnowParticleShader.fragmentShader,
                uniforms: {
                    color: { value: new THREE.Color(0xffffff) },
                    size: { value: 0.1 },
                    scale: { value: window.innerHeight / 2 }
                },
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            this.particleSystem = new THREE.Points(particles, particleMaterial);
            this.scene.add(this.particleSystem);

            console.log('Particles loaded');
            resolve();
        });
    }

    update(deltaTime) {
        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] -= deltaTime * 0.5;
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 20;
            }
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
}

export default Particles;