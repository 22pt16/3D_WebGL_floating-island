import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// 🌌 === SETUP GRADIENT BACKGROUND + SUN ===
export function setupBackground(scene, renderer, camera) {
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

  // 🌞 === CREATE SUN WITH BLOOM GLOW ===
  const sunGroup = new THREE.Group();

  // 🌟 ICOSAHEDRON FOR SUN (Soft glowing sun)
  const sunGeometry = new THREE.IcosahedronGeometry(6, 15); // Smooth glowing sun
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xFDB813, // Warm Sun Color
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(10, 35, -70); // Sun higher and slightly back
  sun.layers.set(1); // Required for bloom effect
  sunGroup.add(sun);
  scene.add(sunGroup);

  // 🌟 === ADD BLOOM EFFECT FOR SUN ===
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // Bloom intensity
    0.4, // Bloom radius
    0.85 // Glow threshold
  );
  bloomPass.threshold = 0;
  bloomPass.strength = 2; // 🌞 Strong glow effect
  bloomPass.radius = 0;

  // 🎥 === CREATE BLOOM COMPOSER
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.renderToScreen = true;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  // 💡 STORE FOR TOGGLE AND RENDERING
  scene.userData.sunGroup = sunGroup;
  scene.userData.bloomComposer = bloomComposer;

  // 🌙 === CREATE MOON FOR NIGHT MODE ===
  createMoon(scene);
}

// 🌙 === CREATE MOON FOR NIGHT MODE ===
function createMoon(scene) {
  const moonGroup = new THREE.Group();

  // 🌕 MAIN MOON SPHERE WITH SMOOTH SHADING
  const moonGeometry = new THREE.SphereGeometry(5.8, 32, 32);
  const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xdcdcdc, // Pale grayish moonlight
    emissive: 0x808080, // Dim moon glow
    emissiveIntensity: 0.3,
    roughness: 0.8, // Rougher surface for moon craters
    metalness: 0, // No metallic effect
  });

  const moon = new THREE.Mesh(moonGeometry, moonMaterial);

  // 🌚 DIMMER MOONLIGHT FOR NIGHT MODE
  const moonlight = new THREE.PointLight(0xd3d3d3, 0.8, 200);
  moonlight.position.set(-20, 45, -80); // Opposite sun's position

  // 🌙 POSITION MOON
  moon.position.copy(moonlight.position);

  // ADD TO GROUP
  moonGroup.add(moon);
  moonGroup.add(moonlight);
  scene.add(moonGroup);

  // 💡 STORE FOR TOGGLE
  scene.userData.moonGroup = moonGroup;
  moonGroup.visible = false; // Hide Moon initially
}

// 🌗 === TOGGLE SUN AND MOON ===
export function toggleSunMoon(scene) {
  const sunGroup = scene.userData.sunGroup;
  const moonGroup = scene.userData.moonGroup;

  // 🌞 Switch Sun OFF, Moon ON
  if (sunGroup.visible) {
    sunGroup.visible = false;
    moonGroup.visible = true;
  }
  // 🌙 Switch Moon OFF, Sun ON
  else {
    sunGroup.visible = true;
    moonGroup.visible = false;
  }
}

// 🎥 === ANIMATION LOOP ===
export function animate(scene, renderer, camera) {
  requestAnimationFrame(() => animate(scene, renderer, camera));

  // 🌞 RENDER WITH BLOOM FOR SUN
  if (scene.userData.bloomComposer) {
    camera.layers.set(1);
    scene.userData.bloomComposer.render();
  } else {
    renderer.render(scene, camera);
  }
}

// 📏 === HANDLE WINDOW RESIZE ===
export function handleResize(scene, renderer, camera) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 🌟 Update bloom composer size
    if (scene.userData.bloomComposer) {
      scene.userData.bloomComposer.setSize(window.innerWidth, window.innerHeight);
    }
  });
}

// 🎮 === ADD EVENT LISTENER FOR TOGGLE ON CLICK
window.addEventListener('click', () => toggleSunMoon(scene));
