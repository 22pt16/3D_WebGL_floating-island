// Import Three.js
import * as THREE from 'three';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Floating Island (Basic Box for now)
const geometry = new THREE.BoxGeometry(5, 1, 5);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const island = new THREE.Mesh(geometry, material);
island.position.y = 0.5;
scene.add(island);

// Add Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// Position Camera
camera.position.z = 10;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  island.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
