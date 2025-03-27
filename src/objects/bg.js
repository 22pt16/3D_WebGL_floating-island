import * as THREE from 'three';

// 🌌 === SETUP GRADIENT BACKGROUND + SUN ===
export function setupBackground(scene) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 🎨 GRADIENT BACKGROUND (Sky to Deep Blue)
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB'); // Sky Blue
  gradient.addColorStop(1, '#1E90FF'); // Deep Blue
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🌌 APPLY AS TEXTURE BACKGROUND
  const texture = new THREE.CanvasTexture(canvas);
  scene.background = texture;

  // 🌞 === CREATE SIMPLE SUN ===
  createSun(scene);
}

// 🌞 === SIMPLE SUN CREATION ===
function createSun(scene) {
  // 🌟 Smooth Sphere Geometry
  const sunGeometry = new THREE.SphereGeometry(8, 32, 32);

  // 🌞 Standard Material for Better Light Interaction
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xFDB813, // Warm Sun Color (Orange-Yellow)
    emissive: 0xffa500, // Glowing from Inside
    emissiveIntensity: 2, // Strong inner glow
    roughness: 0.2, // Slightly less reflective for softer shading
    metalness: 0.4, // Slight metallic look for reflections
  });

  // 🌞 Create Sun Mesh
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 30, -60); // Set Sun's Position

  // 💡 Add a Point Light to Simulate Sunlight
  const sunLight = new THREE.PointLight(0xffddaa, 2.5, 600);
  sunLight.position.copy(sun.position);

   // 🌥️ Optional Ambient Light to Add Soft Shadows
   const ambientLight = new THREE.AmbientLight(0xfff0e0, 0.5); // Soft warm light

  // 🌞 Add to Scene
  scene.add(sun);
  scene.add(sunLight);
  scene.add(ambientLight);
}

// 📏 === HANDLE WINDOW RESIZE ===
export function handleResize(scene, renderer, camera) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
