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

// 🌙 === MOON CREATION (Fake Crescent Using Alpha Blending) ===
function createMoon(scene) {
  // 🌓 Main Moon Geometry (Sphere)
  const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
  const moonMaterial = new THREE.ShaderMaterial({
    uniforms: {
      crescentCenter: { value: new THREE.Vector2(0.2, 0.5) }, // Controls crescent position
      crescentRadius: { value: 0.4 }, // Controls crescent size
      glowColor: { value: new THREE.Color(0xdcdcdc) }, // Soft pale glow
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv; // Pass UV coordinates to fragment shader
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 crescentCenter;
      uniform float crescentRadius;
      uniform vec3 glowColor;
      varying vec2 vUv;

      void main() {
        float dist = distance(vUv, crescentCenter); // Distance from center
        float alpha = smoothstep(crescentRadius + 0.05, crescentRadius, dist); // Smooth edge
        gl_FragColor = vec4(glowColor, alpha); // Apply crescent glow with alpha
      }
    `,
    transparent: true, // Allows blending for crescent effect
  });

  moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(0, 30, -60);
  moon.visible = false; // Hide moon initially
  scene.add(moon);
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

  // 🌙 === ADD MOON GLOW EFFECT ===
  ctx.beginPath();
  const moonX = canvas.width * 0.7; // Moon to the right
  const moonY = canvas.height * 0.2; // Moon higher in the sky
  const moonRadius = 80;
  const moonGradient = ctx.createRadialGradient(
    moonX,
    moonY,
    0,
    moonX,
    moonY,
    moonRadius
  );

  moonGradient.addColorStop(0, '#ffffe0'); // Soft yellow-white glow
  moonGradient.addColorStop(0.5, '#aaaaff'); // Cool glow at mid
  moonGradient.addColorStop(1, 'transparent'); // Transparent at edges
  ctx.fillStyle = moonGradient;
  ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
  ctx.fill();
}

// 📏 === HANDLE WINDOW RESIZE ===
export function handleResize(scene, renderer, camera) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
