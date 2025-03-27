import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Load Unicorn Model and Animate It
export function createUnicorn(scene) {
    const loader = new GLTFLoader();
    loader.load('/models/unicorn.glb', (gltf) => {
        const unicorn = gltf.scene;
        unicorn.scale.set(2, 2, 2);
        unicorn.position.set(50, 10, 0); // Start Position
        scene.add(unicorn);

        let angle = 0;
        const radius = 50; // Flying radius
        const speed = 0.01; // Flying speed

        function animateUnicorn() {
            angle += speed;
            unicorn.position.x = radius * Math.cos(angle);
            unicorn.position.z = radius * Math.sin(angle);
            unicorn.position.y = 10 + Math.sin(angle * 2) * 5; // Slight vertical movement
            unicorn.rotation.y = Math.PI / 2 - angle; // Rotate to face direction
            requestAnimationFrame(animateUnicorn);
        }

        animateUnicorn();
    }, undefined, (error) => {
        console.error('Error loading unicorn model:', error);
    });
}
