// Import Three.js
import * as THREE from 'three';


// 🌌 === SETUP GRADIENT BACKGROUND + SUN ===
function setupBackground(scene) {
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

// 🌌 === ADD NEBULA CLOUDS FOR NIGHT MODE ===
function addNebula(scene) {
  const nebulaTexture = new THREE.TextureLoader().load('./nebula.png');
  const nebulaMaterial = new THREE.SpriteMaterial({
    map: nebulaTexture,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < 5; i++) {
    const nebula = new THREE.Sprite(nebulaMaterial);
    nebula.position.set(
      randomize(-50, 50, true),
      randomize(30, 50, true),
      randomize(-80, -100, true)
    );
    nebula.scale.set(randomize(40, 60, true), randomize(40, 60, true), 1);

    scene.add(nebula);
    animateNebula(nebula);
  }
}

// 🌌 === ANIMATE NEBULA SWIRLING ===
function animateNebula(nebula) {
  function moveNebula() {
    nebula.position.x += Math.sin(Date.now() * 0.0001) * 0.02;
    nebula.position.y += Math.cos(Date.now() * 0.0001) * 0.02;
    requestAnimationFrame(moveNebula);
  }
  moveNebula();
}

// ⛈️ === ADD LIGHTNING EFFECT DURING STORMS ===
function createLightning(scene) {
  const lightningGeo = new THREE.PlaneGeometry(20, 100);
  const lightningMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  });

  const lightning = new THREE.Mesh(lightningGeo, lightningMat);
  lightning.position.set(0, 50, -80);
  scene.add(lightning);

  function flashLightning() {
    if (Math.random() > 0.98) {
      lightning.material.opacity = 0.8;
      setTimeout(() => {
        lightning.material.opacity = 0;
      }, 100);
    }
    requestAnimationFrame(flashLightning);
  }
  flashLightning();
}

// 🌠 === ADD SHOOTING STARS ===
function createShootingStar(scene) {
  const starGeo = new THREE.PlaneGeometry(0.5, 0.5);
  const starMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });

  const star = new THREE.Mesh(starGeo, starMat);
  resetStarPosition(star);
  scene.add(star);

  function moveStar() {
    star.position.y -= 0.5;
    star.position.x -= 0.2;
    star.material.opacity -= 0.01;

    if (star.position.y < -30 || star.material.opacity <= 0) {
      resetStarPosition(star);
    }
    requestAnimationFrame(moveStar);
  }
  moveStar();
}

// 🌠 === RESET STAR POSITION FOR RANDOM SHOOTING ===
function resetStarPosition(star) {
  star.position.set(randomize(-50, 50, true), randomize(30, 70, true), randomize(-80, -100, true));
  star.material.opacity = 0.8;
}

// 🌊 === ADD OCEAN REFLECTION EFFECT ===
function createOcean(scene) {
  const waterGeo = new THREE.PlaneGeometry(250, 250, 80, 50);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x1e90ff,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    roughness: 0.1,
    metalness: 0.9,
  });

  const ocean = new THREE.Mesh(waterGeo, waterMat);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -5;
  scene.add(ocean);

  animateOcean(ocean);
}
// 🌊 === ANIMATE OCEAN WAVE MOTION ===
function animateOcean(ocean) {
  const position = ocean.geometry.attributes.position;
  const waveHeight = 0.5;

  function updateWaves() {
    const time = Date.now() * 0.0005;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z =
        Math.sin(x * 0.1 + time) * waveHeight +
        Math.cos(y * 0.1 + time) * waveHeight;

      position.setZ(i, z);
    }

    position.needsUpdate = true; // ✅ Update vertices
    requestAnimationFrame(updateWaves);
  }
  updateWaves();
}



// 🌗 === TOGGLE DAY AND NIGHT MODE ===
function toggleSunMoon(scene) {
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
function handleResize(scene, renderer, camera) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Export all background functions
export {
  setupBackground,
  handleResize,
  toggleSunMoon,
  addNebula,
  createShootingStar,
  createLightning,
  createOcean,
};
