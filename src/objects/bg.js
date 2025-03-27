// Import Three.js
import * as THREE from 'three';

// 🌌 === SETUP GRADIENT BACKGROUND + SUN ===
export function setupBackground(scene) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 🎨 GRADIENT BACKGROUND (Sky to Deep Blue for Day)
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createDayBackground(ctx, canvas);

  // 🌌 APPLY AS TEXTURE BACKGROUND
  const texture = new THREE.CanvasTexture(canvas);
  scene.background = texture;

  // 🌞 === CREATE SUN AND MOON ===
  createSun(scene);
}

// 🌞 === CREATE SUN AND MOON ===
let sun, moon, sunLight, ambientLight, isDay = true;

// 🌞 === SUN CREATION ===
function createSun(scene) {
  const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xFDB813, // Warm Sun Color
    emissive: 0xffa500, // Glow from inside
    emissiveIntensity: 2,
    roughness: 0.2,
    metalness: 0.4,
  });

  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 30, -60); // Set Sun's Position

  // 💡 Sunlight Simulation
  sunLight = new THREE.PointLight(0xffddaa, 2.5, 600);
  sunLight.position.copy(sun.position);

  // 🌥️ Soft Ambient Light for Day
  ambientLight = new THREE.AmbientLight(0xfff0e0, 0.5);

  scene.add(sun);
  scene.add(sunLight);
  scene.add(ambientLight);

  // 🌙 === CREATE MOON ===
  createMoon(scene);
}


// 🌙 === CREATE GLOWING MOON WITH DYNAMIC GLOW EFFECT ===
function createMoon(scene) {
  // 🌕 Main Moon Geometry
  const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
  const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Bright white moon
    emissive: 0xaaaaff, // Soft blue glow effect
    emissiveIntensity: 1.5, // Moon glow intensity
    roughness: 0.2,
    metalness: 0.1,
  });

  // 🌕 Main Moon Mesh
  moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(0, 30, -60);
  moon.visible = false; // Hide initially
  scene.add(moon);

  // ✨ === CREATE GLOW TEXTURE FROM CANVAS ===
  const glowTexture = createMoonGlowTexture(); // Generate texture dynamically
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0.7, // Soft opacity for realistic glow
    blending: THREE.AdditiveBlending, // Enhance glow
  });

  // 🔥 === GLOW SPRITE AS AURA AROUND MOON ===
  const glowSprite = new THREE.Sprite(glowMaterial);
  glowSprite.scale.set(20, 20, 1); // Slightly larger than moon
  moon.add(glowSprite); // Add glow to follow moon rotation
}

// ✨ === CREATE CANVAS-BASED GLOW TEXTURE ===
function createMoonGlowTexture() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = 256; // High-res glow
  canvas.width = size;
  canvas.height = size;

  // 🎨 Radial Gradient like the Original
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  gradient.addColorStop(0, '#ffffe0'); // Soft yellow-white center
  gradient.addColorStop(0.5, '#aaaaff'); // Cool glow at mid
  gradient.addColorStop(1, 'transparent'); // Fades out at edges

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 📸 Create Texture from Canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}




// 🌗 === TOGGLE DAY AND NIGHT MODE ===
export function toggleSunMoon(scene) {
  isDay = !isDay;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (isDay) {
    // 🌞 Switch to Day Mode
    sun.visible = true;
    moon.visible = false;
    sunLight.intensity = 2.5;
    ambientLight.intensity = 0.5;
    createDayBackground(ctx, canvas);
  } else {
    // 🌙 Switch to Night Mode
    sun.visible = false;
    moon.visible = true;
    sunLight.intensity = 1.2; // Dimmer glow for moonlight
    ambientLight.intensity = 0.2; // Less ambient for night
    createNightBackground(ctx, canvas);

    document.getElementById('toggleButton').innerHTML = 'Switch to Day 🌞';

  }

  // 🌌 Update Background Texture
  const texture = new THREE.CanvasTexture(canvas);
  scene.background = texture;
}

// 🎨 === DAY BACKGROUND ===
function createDayBackground(ctx, canvas) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB'); // Sky Blue
  gradient.addColorStop(1, '#1E90FF'); // Deep Blue
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 🌌 === NIGHT BACKGROUND WITH MOON GRADIENT ===
function createNightBackground(ctx, canvas) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0c1445'); // Deep Space Blue
  gradient.addColorStop(1, '#000033'); // Midnight Dark Blue

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✨ Add Stars for Extra Realism
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

}

// 📏 === HANDLE WINDOW RESIZE ===
export function handleResize(scene, renderer, camera) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
