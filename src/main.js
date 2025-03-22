// Import Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import Modules
import { setupBackground } from './objects/bg.js';
import { createIsland } from './objects/island.js';
import { animateClouds } from './objects/clouds.js';

// 🎨 === INITIAL SETUP ===
// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🎮 === ORBIT CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera rotation
controls.dampingFactor = 0.1;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2; // Lock rotation to prevent looking below
camera.position.set(10, 15, 20);

// 💡 === LIGHT SETUP ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 5).normalize(); // Position light source
scene.add(light);

// Ambient Light for Uniform Illumination
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft global light
scene.add(ambientLight);

// 🌌 === BACKGROUND SETUP ===
setupBackground(scene);

// 🏝️ === ADD FLOATING ISLAND ===
const island = createIsland();
scene.add(island);

// ☁️ === CLOUD PLACEHOLDER ===
let clouds = []; // Empty array, add cloud logic later

// 🎥 === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls smoothly
  animateClouds(clouds); // Optional, for later cloud animations
  renderer.render(scene, camera);
}
animate();

// 🎯 === HANDLE WINDOW RESIZE ===
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
