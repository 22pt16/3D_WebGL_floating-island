import * as THREE from 'three';

// ☁️ === Create Floating Clouds ===
export function createClouds(scene) {
  const cloudTexture = new THREE.TextureLoader().load('/public/clouds.jpg');

  const cloudGeometry = new THREE.PlaneGeometry(20, 10); // Large cloud shape
  const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.8,
    depthWrite: false, // No shadow blocking
  });

  const clouds = [];
  for (let i = 0; i < 5; i++) {
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.position.set(
      Math.random() * 60 - 30, // Random X (-30 to 30)
      Math.random() * 10 + 15, // Y (Height)
      Math.random() * 50 - 25 // Random Z (-25 to 25)
    );
    cloud.rotation.y = Math.random() * Math.PI; // Random Rotation
    scene.add(cloud);
    clouds.push(cloud);
  }
  return clouds;
}

// 🎥 === Animate Floating Clouds ===
export function animateClouds(clouds) {
  clouds.forEach((cloud) => {
    cloud.position.x += 0.02; // Slight movement to the right
    if (cloud.position.x > 30) {
      cloud.position.x = -30; // Loop around
    }
  });
}
