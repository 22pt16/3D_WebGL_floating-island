import * as THREE from 'three';

// ☁️ === LOAD CLOUD TEXTURE ===
const cloudTexture = new THREE.TextureLoader().load('/clouds.png'); // ✅ Correct PNG path

// 🌥️ === CREATE NATURAL CLOUDS ===
export function createClouds(scene, clouds) {
  const cloudMaterial = new THREE.SpriteMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.85, // Soft and fluffy clouds
    depthWrite: false, // Avoids overlapping weirdness
  });

  // 🎲 === MULTIPLE CLOUD LAYERS ===
  const cloudLayers = 3; // More layers for natural height depth
  const cloudsPerLayer = 10; // 10 clouds per layer

  for (let j = 0; j < cloudLayers; j++) {
    for (let i = 0; i < cloudsPerLayer; i++) {
      const cloud = new THREE.Sprite(cloudMaterial);

      // 🌫️ RANDOM SCATTERING OF CLOUDS
      cloud.scale.set(
        randomize(10, 14, true), // Width variation
        randomize(7, 10, true), // Height variation
        1
      );

      // 🎈 POSITION CLOUDS ACROSS LAYERS
      cloud.position.set(
        Math.random() * 80 - 40, // X range (-40 to 40)
        randomize(12 + j * 5, 25 + j * 5, true), // Vary height per layer
        Math.random() * 80 - 40 // Z range (-40 to 40)
      );

      // 💫 RANDOM ROTATION FOR VARIETY
      cloud.rotation.z = Math.random() * Math.PI * 2;

      // ADD TO SCENE AND ARRAY
      scene.add(cloud);
      clouds.push(cloud);

      // 🎁 RANDOM FLOATING SPEED
      cloud.userData.speedX = (Math.random() - 0.5) * 0.02; // Slow left-right drift
      cloud.userData.speedY = (Math.random() - 0.5) * 0.01; // Gentle up-down bobbing
    }
  }
}

// 🎥 === ANIMATE FLOATY CLOUDS ===
export function animateClouds(clouds) {
  clouds.forEach((cloud) => {
    cloud.position.x += cloud.userData.speedX;
    cloud.position.y += cloud.userData.speedY;

    // 🌥️ BOUNDARY RESET FOR NATURAL LOOP
    if (cloud.position.x > 50) cloud.position.x = -50;
    if (cloud.position.x < -50) cloud.position.x = 50;
    if (cloud.position.y > 40) cloud.position.y = 20;
    if (cloud.position.y < 10) cloud.position.y = 20;
  });
}

// 🎲 === RANDOMIZER FUNCTION ===
const randomize = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;
  return float ? val : Math.floor(val);
};
