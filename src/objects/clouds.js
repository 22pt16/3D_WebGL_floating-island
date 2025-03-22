import * as THREE from 'three';

// ☁️ === ANIMATE CLOUDS RANDOMLY ===
export function animateClouds(clouds) {
  clouds.forEach((cloud) => {
    cloud.position.x += cloud.userData.speedX; // Horizontal movement
    cloud.position.y += cloud.userData.speedY; // Vertical wobble
    cloud.position.z += cloud.userData.speedZ; // Slight depth movement

    // 🌥️ === BOUNDARY RESET ===
    if (cloud.position.x > 50) {
      cloud.position.x = -50; // Reset to the left after crossing right
    }
    if (cloud.position.z > 50) {
      cloud.position.z = -50; // Reset depth if out of bounds
    }
    if (cloud.position.y > 25) {
      cloud.position.y = 10; // Prevent clouds from flying too high
    }
    if (cloud.position.y < 5) {
      cloud.position.y = 10; // Prevent clouds from going too low
    }
  });
}

// 🌥️ === CREATE CLOUDS AND ADD TO SCENE ===
export function createClouds(scene, clouds) {
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xd6f5ff, // White clouds for realism
    transparent: true,
    opacity: 0.4, // Slight transparency for soft feel
    depthWrite: false, // Avoid blocking island or other objects
  });

  const cloudGeometry = new THREE.SphereGeometry(2.5, 12, 12); // Slightly larger and softer spheres

  // 🌫️ === CREATE MULTIPLE CLOUDS ===
  for (let i = 0; i < 12; i++) {
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.position.set(
      Math.random() * 50 - 25, // X-axis random range (-25 to 25)
      Math.random() * 20 + 15, // Height range 
      Math.random() * 50 - 25 // Z-axis random range (-25 to 25)
    );
    cloud.scale.set(1.5, 1, 1.5); // Slightly stretched for a natural shape
    scene.add(cloud);
    clouds.push(cloud);

    // 🎈 === RANDOM SPEED FOR NATURAL FLOATING ===
    cloud.userData.speedX = (Math.random() - 0.5) * 0.03; // Random horizontal speed
    cloud.userData.speedY = (Math.random() - 0.5) * 0.01; // Random vertical wobble
    cloud.userData.speedZ = (Math.random() - 0.5) * 0.02; // Slight depth movement
  }
}
