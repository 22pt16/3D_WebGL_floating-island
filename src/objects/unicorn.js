import * as THREE from 'three';
import gsap from 'gsap';

// Helper function to convert degrees to radians
const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

// Randomizer function for slight variations
const randomize = (min, max, float = false) => {
    const val = Math.random() * (max - min) + min;
    return float ? val : Math.floor(val);
};

export class Unicorn {
    constructor() {
        this.group = new THREE.Group();
        this.orbitGroup = new THREE.Group();
        this.orbitGroup.add(this.group);

        // Define materials
        this.whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.1,
        });
        this.blueMaterial = new THREE.MeshStandardMaterial({
            color: 0x00BFFF,
            roughness: 0.5,
            metalness: 0.1,
        });
        this.blackMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
        });
        this.purpleMaterial = new THREE.MeshStandardMaterial({
            color: 0x800080,
            roughness: 0.5,
            metalness: 0.1,
        });
        this.sparkleMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0x00BFFF,
            emissiveIntensity: 1,
            roughness: 0.2,
            metalness: 0.8,
        });
        this.reddishPinkMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF4040,
        });

        this.rainbowMaterials = [
            new THREE.MeshStandardMaterial({ color: 0xFF0000 }),
            new THREE.MeshStandardMaterial({ color: 0xFF4500 }),
            new THREE.MeshStandardMaterial({ color: 0xFFFF00 }),
            new THREE.MeshStandardMaterial({ color: 0x00FF00 }),
            new THREE.MeshStandardMaterial({ color: 0x0000FF }),
            new THREE.MeshStandardMaterial({ color: 0x800080 }),
        ];

        // Body
        const bodyGeometry = new THREE.SphereGeometry(4, 32, 32);
        bodyGeometry.scale(1.2, 0.8, 0.8);
        const body = new THREE.Mesh(bodyGeometry, this.whiteMaterial);
        this.group.add(body);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
        const neck = new THREE.Mesh(neckGeometry, this.whiteMaterial);
        neck.position.set(2, 2.5, 0);
        neck.rotation.z = degreesToRadians(-30);
        this.group.add(neck);

        // Head
        this.headGroup = new THREE.Group();
        const headGeometry = new THREE.SphereGeometry(2, 32, 32);
        headGeometry.scale(1.2, 1, 0.8);
        const head = new THREE.Mesh(headGeometry, this.whiteMaterial);
        this.headGroup.add(head);
        this.headGroup.position.set(3.5, 5, 0);
        this.headGroup.rotation.z = degreesToRadians(-30);
        this.group.add(this.headGroup);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        for (let i = 0; i < 2; i++) {
            const m = i % 2 === 0 ? -1 : 1;
            const eye = new THREE.Mesh(eyeGeometry, this.blackMaterial);
            eye.position.set(1, 0, 1 * m);
            this.headGroup.add(eye);

            for (let j = 0; j < 3; j++) {
                const sparkleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const sparkle = new THREE.Mesh(sparkleGeometry, this.sparkleMaterial);
                const angle = (j / 3) * Math.PI * 2;
                sparkle.position.set(
                    1 + Math.cos(angle) * 0.7,
                    Math.sin(angle) * 0.7,
                    1 * m
                );
                this.headGroup.add(sparkle);
            }
        }

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.4, 1, 32);
        for (let i = 0; i < 2; i++) {
            const m = i % 2 === 0 ? -1 : 1;
            const ear = new THREE.Mesh(earGeometry, this.whiteMaterial);
            ear.position.set(-0.5, 1.5, 0.8 * m);
            ear.rotation.z = degreesToRadians(-30);
            this.headGroup.add(ear);
        }

        // Horn
        const hornGeometry = new THREE.ConeGeometry(0.8, 5, 12);
        const horn = new THREE.Mesh(hornGeometry, this.blueMaterial);
        horn.position.set(0, 2, 0);
        horn.rotation.z = 0;
        this.headGroup.add(horn);

        // Mouth
        const mouthGeometry = new THREE.BufferGeometry();
        const mouthVertices = new Float32Array([
            1.2, -0.5, -0.5,
            1.3, -0.7, 0,
            1.2, -0.5, 0.5,
        ]);
        mouthGeometry.setAttribute('position', new THREE.BufferAttribute(mouthVertices, 3));
        const mouth = new THREE.Line(mouthGeometry, this.reddishPinkMaterial);
        this.headGroup.add(mouth);

        // Legs
        this.legs = [];
        const legGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
        const hoofGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 32);
        for (let i = 0; i < 4; i++) {
            const m = i % 2 === 0 ? -1 : 1;
            const leg = new THREE.Mesh(legGeometry, this.whiteMaterial);
            const hoof = new THREE.Mesh(hoofGeometry, this.purpleMaterial);
            const posX = i > 1 ? 2 : -2;
            leg.position.set(posX, -3, 1.5 * m);
            hoof.position.set(posX, -4.25, 1.5 * m);
            this.group.add(leg);
            this.group.add(hoof);
            this.legs.push(leg);
        }

        // Tail
        this.tailGroup = new THREE.Group();
        for (let i = 0; i < 6; i++) {
            const tailSize = randomize(0.5, 0.8, true);
            const tailGeometry = new THREE.SphereGeometry(tailSize, 16, 16);
            const tailSegment = new THREE.Mesh(tailGeometry, this.rainbowMaterials[i]);
            tailSegment.position.set(-5 - i * 1.2, -i * 0.5, 0);
            this.tailGroup.add(tailSegment);
        }
        this.group.add(this.tailGroup);

        // Mane
        this.maneGroup = new THREE.Group();
        for (let i = 0; i < 6; i++) {
            const maneSize = randomize(0.5, 0.8, true);
            const maneGeometry = new THREE.SphereGeometry(maneSize, 16, 16);
            const maneSegment = new THREE.Mesh(maneGeometry, this.rainbowMaterials[i]);
            maneSegment.position.set(2 - i * 0.8, 3.5 + i * 0.3, 0);
            this.maneGroup.add(maneSegment);
        }
        this.group.add(this.maneGroup);

        // Wings
        this.wings = [];
        this.wingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0.1,
        });
        this.createWings();

        // Fairy Dust Trail
        this.particleCount = 100;
        this.particles = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.particleCount * 3);
        this.particleLifetimes = new Float32Array(this.particleCount);
        this.particleOpacities = new Float32Array(this.particleCount);
        this.particleScales = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            this.particlePositions[i * 3] = 0;
            this.particlePositions[i * 3 + 1] = -100;
            this.particlePositions[i * 3 + 2] = 0;
            this.particleLifetimes[i] = 0;
            this.particleOpacities[i] = 0;
            this.particleScales[i] = 0;
        }

        this.particles.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        this.particles.setAttribute('opacity', new THREE.BufferAttribute(this.particleOpacities, 0.5));
        this.particles.setAttribute('scale', new THREE.BufferAttribute(this.particleScales, 1));

        this.particleMaterial = new THREE.PointsMaterial({
            color: 0xFFC0CB,
            size: 0.5,
            transparent: true,
            opacity: 0.5,
            vertexColors: false,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.particleSystem = new THREE.Points(this.particles, this.particleMaterial);
        this.orbitGroup.add(this.particleSystem);

        this.nextParticleIndex = 0;
        this.particleLifetime = 2;

        // Scale and position
        this.group.scale.set(0.5, 0.5, 0.5);
        this.group.position.set(0, 5, 0);

        // Rotate the group so the head faces forward (positive z-axis in world space)
        this.group.rotation.y = degreesToRadians(-90); // Rotate 90 degrees counterclockwise around y-axis

        // Enable shadows
        this.group.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        // Flight parameters for random movement
        this.velocity = new THREE.Vector3(
            randomize(-0.5, 0.5, true),
            randomize(-0.2, 0.2, true),
            randomize(-0.5, 0.5, true)
        ).normalize().multiplyScalar(2); // Initial speed of 2 units per second
        this.acceleration = new THREE.Vector3();
        this.maxSpeed = 2;
        this.steeringForce = 0.05;
        this.bounds = {
            x: { min: -50, max: 50 },
            y: { min: 5, max: 30 },
            z: { min: -50, max: 50 },
        };
        this.changeDirectionTimer = 0;
        this.changeDirectionInterval = 3; // Change direction every 3 seconds
    }

    createWings() {
        const wingGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 0, 0,
            0, 3, 0,
            6, 1, 0,
            0, 0, 0,
            6, 1, 0,
            4, -2, 0,
        ]);
        const indices = [
            0, 1, 2,
            3, 4, 5,
        ];
        wingGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        wingGeometry.setIndex(indices);
        wingGeometry.computeVertexNormals();

        for (let i = 0; i < 2; i++) {
            const wing = new THREE.Mesh(wingGeometry, this.wingMaterial);
            const m = i % 2 === 0 ? -1 : 1;
            wing.position.set(0, 1, 2.5 * m);
            wing.rotation.y = degreesToRadians(90 * m);
            this.group.add(wing);
            this.wings.push(wing);
        }

        this.animateWings();
    }

    animateWings() {
        this.wings.forEach((wing, index) => {
            const m = index % 2 === 0 ? -1 : 1;
            gsap.to(wing.rotation, {
                x: degreesToRadians(30 * m),
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.1,
            });
        });
    }

    addToScene(scene) {
        scene.add(this.orbitGroup);
    }

    animateOrbit() {
        // No longer needed for random flight, but kept for compatibility
    }

    updateUnicornFlight(delta) {
        // Update direction change timer
        this.changeDirectionTimer += delta;
        if (this.changeDirectionTimer >= this.changeDirectionInterval) {
            // Choose a new random target direction
            const targetDirection = new THREE.Vector3(
                randomize(-1, 1, true),
                randomize(-0.5, 0.5, true),
                randomize(-1, 1, true)
            ).normalize().multiplyScalar(this.maxSpeed);
            this.acceleration = targetDirection.sub(this.velocity).multiplyScalar(this.steeringForce);
            this.changeDirectionTimer = 0;
        }

        // Update velocity
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.velocity.clampLength(0, this.maxSpeed);

        // Update position
        const newPosition = this.group.position.clone().add(this.velocity.clone().multiplyScalar(delta));

        // Check boundaries and bounce back if needed
        if (newPosition.x < this.bounds.x.min) {
            newPosition.x = this.bounds.x.min;
            this.velocity.x *= -1;
        } else if (newPosition.x > this.bounds.x.max) {
            newPosition.x = this.bounds.x.max;
            this.velocity.x *= -1;
        }
        if (newPosition.y < this.bounds.y.min) {
            newPosition.y = this.bounds.y.min;
            this.velocity.y *= -1;
        } else if (newPosition.y > this.bounds.y.max) {
            newPosition.y = this.bounds.y.max;
            this.velocity.y *= -1;
        }
        if (newPosition.z < this.bounds.z.min) {
            newPosition.z = this.bounds.z.min;
            this.velocity.z *= -1;
        } else if (newPosition.z > this.bounds.z.max) {
            newPosition.z = this.bounds.z.max;
            this.velocity.z *= -1;
        }

        // Set the new position
        this.group.position.copy(newPosition);

        // Make the unicorn face the direction of movement
        const direction = this.velocity.clone().normalize();
        this.group.lookAt(this.group.position.clone().add(direction));

        // Update fairy dust trail
        this.updateFairyDust(delta);
    }

    updateFairyDust(delta) {
        if (Math.random() < 0.5) {
            const i = this.nextParticleIndex;
            const tailPosition = new THREE.Vector3(-5, 0, 0);
            const worldPosition = this.group.localToWorld(tailPosition.clone());
            this.particlePositions[i * 3] = worldPosition.x;
            this.particlePositions[i * 3 + 1] = worldPosition.y;
            this.particlePositions[i * 3 + 2] = worldPosition.z;
            this.particleLifetimes[i] = this.particleLifetime;
            this.particleOpacities[i] = 1;
            this.particleScales[i] = randomize(0.3, 0.5, true);
            this.nextParticleIndex = (this.nextParticleIndex + 1) % this.particleCount;
        }

        for (let i = 0; i < this.particleCount; i++) {
            if (this.particleLifetimes[i] > 0) {
                this.particleLifetimes[i] -= delta;
                if (this.particleLifetimes[i] <= 0) {
                    this.particlePositions[i * 3 + 1] = -100;
                    this.particleOpacities[i] = 0;
                    this.particleScales[i] = 0;
                } else {
                    const lifeFraction = this.particleLifetimes[i] / this.particleLifetime;
                    this.particleOpacities[i] = lifeFraction;
                    this.particleScales[i] = lifeFraction * randomize(0.3, 0.5, true);
                    this.particlePositions[i * 3 + 1] -= 0.1 * delta;
                }
            }
        }

        this.particles.attributes.position.needsUpdate = true;
        this.particles.attributes.opacity.needsUpdate = true;
        this.particles.attributes.scale.needsUpdate = true;
    }
}