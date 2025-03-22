import * as THREE from 'three';

// 🌌 Setup Gradient Background and Optional Sun
export function setupBackground(scene) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Gradient Background
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB'); // Sky Blue
  gradient.addColorStop(1, '#1E90FF'); // Deep Blue
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply Gradient to Scene as Texture
  const texture = new THREE.CanvasTexture(canvas);
  scene.background = texture;

  // 🌞 Add a Basic Sun (Optional)
  const sunGeometry = new THREE.SphereGeometry(4.5, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700, // Golden Sun
    emissive: 0xffa500, // Glow
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(5, 10, -40);
  scene.add(sun);
}
