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
            const particleCount = 6000;

            // Create geometry and positions for the particle system
            const particles = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            const particleScales = new Float32Array(particleCount);
            for (let i = 0; i < particleCount; i++) {
                particlePositions[i * 3] = (Math.random() - 0.5) * 20;
                particlePositions[i * 3 + 1] = Math.random() * 20;
                particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

                // Bigger, more cartoonish flakes
                particleScales[i] = 0.7 + Math.random() * 1.6;
            }
            particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            particles.setAttribute('aScale', new THREE.BufferAttribute(particleScales, 1));

            // Create the material using the SnowParticleShader
            const particleMaterial = new ShaderMaterial({
                vertexShader: SnowParticleShader.vertexShader,
                fragmentShader: SnowParticleShader.fragmentShader,
                uniforms: {
                    color: { value: new THREE.Color('#fff3ef') }, // Warm off-white
                    size: { value: 0.16 * window.devicePixelRatio },
                    scale: { value: window.innerHeight / 2 }
                },
                transparent: true,
                depthWrite: false,
                blending: THREE.NormalBlending // Better for snow
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
            // Fall down
            positions[i * 3 + 1] -= deltaTime * 0.42;
            
            // Wind effect (drift slightly in X and Z)
            positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.6) * deltaTime * 0.25;
            positions[i * 3 + 2] += Math.cos(positions[i * 3 + 1] * 0.35) * deltaTime * 0.14;

            // Reset if below ground
            if (positions[i * 3 + 1] < -0.2) {
                positions[i * 3 + 1] = 15;
                positions[i * 3] = (Math.random() - 0.5) * 20;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            }
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
}

export default Particles;