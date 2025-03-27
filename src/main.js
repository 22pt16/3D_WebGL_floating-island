// Import Three.js and OrbitControls
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import Modules
import { setupBackground, handleResize, toggleSunMoon } from './objects/bg.js';
import { createIsland } from './objects/island.js';
import { createClouds, animateClouds } from './objects/clouds.js';
import { Unicorn } from './objects/unicorn.js';
import { createMountains } from './objects/mountains.js';



// 🎨 === INITIAL SETUP ===
// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 🎮 === ORBIT CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera rotation
controls.dampingFactor = 0.1;
controls.minDistance = 2; // Min Zoom-out distance
controls.maxDistance = 150; // Max FAR Zoom-out distance
controls.maxPolarAngle = Math.PI / 2; // Lock rotation to prevent looking below
camera.position.set(35, 10, 18); // Closer to the island for a better view

// 💡 === LIGHT SETUP ===
// Directional Light for Sunlight Effect
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10).normalize();
scene.add(light);

// Ambient Light for Uniform Illumination
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// 🌌 === BACKGROUND SETUP ===
setupBackground(scene);
handleResize(scene, renderer, camera);

// 🏝️ === ADD FLOATING ISLAND ===
const island = createIsland();
scene.add(island);
if (island) {
  console.log('✅ Island loaded successfully!');
} else {
  console.error('❌ Island failed to load!');
}


// 🌄 === ADD MOUNTAINS AROUND THE ISLAND ===
const mountains = createMountains(scene);
scene.add(mountains);
console.log('🏔️ Mountains added:', mountains);

// 🦄 === ADD UNICORN ===
const unicorn = new Unicorn();
unicorn.addToScene(scene);
unicorn.animateOrbit();
unicorn.updateUnicornFlight();

// ☁️ === ADD CLOUDS ===
let clouds = []; // Array to hold cloud meshes
createClouds(scene, clouds); // Create cloud objects and push to array

// 🎥 === ANIMATION LOOP ===
function animateMain() {
  requestAnimationFrame(animateMain);
  controls.update(); // Smooth camera control
  animateClouds(clouds); // Animate cloud movement
  renderer.render(scene, camera);
}
animateMain(); // Start animation loop

// 📏 === HANDLE WINDOW RESIZE ===
handleResize(scene, renderer, camera);


// 🎮 === ADD EVENT LISTENER FOR TOGGLE BUTTON
document.getElementById('toggleButton').addEventListener('click', () => {
  toggleSunMoon(scene);
});
