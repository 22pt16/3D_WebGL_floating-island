// Import Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import Modules
import {
  setupBackground,
  handleResize,
  toggleSunMoon,
  addNebula, 
  createShootingStar, 
  createLightning, 
  createOcean, 
} from './objects/bg.js';

import { createIsland } from './objects/island.js';
import { createClouds, animateClouds } from './objects/clouds.js';
import { Unicorn } from './objects/unicorn.js';
import { createIslandWithTexture } from './objects/mountains.js';
import { createWaterOnIsland, createWaterfalls, createRockBorder } from './objects/water.js';
import { addButterfliesToIsland } from "./objects/butterfly.js";


//INITIAL SETUP
//Scene, Camera, and Renderer
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

//ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //smooth camera rotation
controls.dampingFactor = 0.1;
controls.minDistance = 2; //min Zoom-out distance
controls.maxDistance = 150; //max FAR Zoom-out distance
controls.maxPolarAngle = Math.PI / 2; //limit vertical rotation
camera.position.set(35, 10, 18); //closer to the island for a better view

// LIGHT SETUP
// Directional Light for Sunlight Effect
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10).normalize();
light.castShadow = true; // Enable shadows for the light
scene.add(light);

// Ambient Light for Uniform Illumination
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// === BACKGROUND SETUP ===
setupBackground(scene);
handleResize(scene, renderer, camera);

//=== ADD FLOATING ISLAND ===
const island = createIsland();
scene.add(island);
if (island) {
  console.log('✅ Island loaded successfully!');
} else {
  console.error('❌ Island failed to load!');
}
//=== ADD OCEAN REFLECTION EFFECT ===
createOcean(scene);

// 🌄 === ADD MOUNTAINS AROUND THE ISLAND ===
const mountains = createIslandWithTexture();
//scene.add(mountains);
//console.log('🏔️ Mountains added:', mountains);


// 🌊 === ADD WATER AND WATERFALLS ===
const water = createWaterOnIsland();
island.add(water);

// 💎 Add Rock Border
createRockBorder(water);

const waterfalls = createWaterfalls();
island.add(waterfalls);

// 🦋 === ADD MAGICAL BUTTERFLIES ===
addButterfliesToIsland(island);



// ☁️ === ADD CLOUDS ===
let clouds = []; // Array to hold cloud meshes
createClouds(scene, clouds); // Create cloud objects and push to array

// 🎥 === ANIMATION LOOP ===
// Initialize time for delta calculation
let lastTime = performance.now();

function animateMain() {
  requestAnimationFrame(animateMain);

  // Calculate delta time
  const currentTime = performance.now();
  const delta = (currentTime - lastTime) / 1000; // Convert to seconds
  lastTime = currentTime;

  // Update controls
  controls.update(); // Smooth camera control

  // Animate clouds
  animateClouds(clouds); // Animate cloud movement

  

  // Render the scene
  renderer.render(scene, camera);

  // === ANIMATE WATER UV ===
  const elapsedTime = performance.now() * 0.0001; // Adjust speed
  water.material.map.offset.y = -elapsedTime * 0.5; // Flowing down
  waterfalls.children.forEach((wf) => {
    wf.material.map.offset.y = -elapsedTime * 0.8; // Faster for waterfall effect
  });

}
animateMain(); // Start animation loop

// 📏 === HANDLE WINDOW RESIZE ===
handleResize(scene, renderer, camera);

// 🎮 === ADD EVENT LISTENER FOR TOGGLE BUTTON ===
document.getElementById('toggleButton').addEventListener('click', () => {
  toggleSunMoon(scene);
});