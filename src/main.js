// Import Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

// Create Floating Island (Box for now)
const geometry = new THREE.BoxGeometry(5, 1, 5);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00, // Green
  roughness: 0.5, // Slightly shiny
  metalness: 0.1, // A bit of reflection
});
const island = new THREE.Mesh(geometry, material);
island.position.y = 0.5;
scene.add(island);

// Add Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// 🌟 Add Ambient Light for Uniform Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Color, Intensity
scene.add(ambientLight);

// Position Camera
camera.position.set(10, 10, 20);

// 🕹️ Add Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 5; // Minimum zoom in
controls.maxDistance = 50; // Maximum zoom out
controls.maxPolarAngle = Math.PI / 2; // Restrict rotation to above

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls per frame
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
