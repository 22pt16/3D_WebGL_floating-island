import * as THREE from "three";

// === LOAD TEXTURE ===
const loader = new THREE.TextureLoader();
const texture = loader.load("./texture.avif"); // Using the same texture

// === UTILITY FUNCTIONS ===
const randomize = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;
  return float ? val : Math.floor(val);
};

// === CREATE MOUNTAIN STRUCTURES ===
function createMountainsOnIsland(islandGroup) {
  const mountainGroup = new THREE.Group();

  for (let i = 0; i < 8; i++) {
    // --- 🪨 Mountain Geometry
    const mountainHeight = randomize(4, 8, true);
    const geoMountain = new THREE.ConeGeometry(
      randomize(.8, 2.8, true), // Base radius
      mountainHeight,
      30 // Smoother cone for a mountain shape
    );
    // === LOAD NEW TEXTURE FOR MOUNTAINS ===
    const rockTexture = loader.load("./mountain.jpg");

    // --- 🎨 Mountain Material
    const mountainMaterial = new THREE.MeshStandardMaterial({
      map: rockTexture, // Using the same texture
      flatShading: true,
    });

    const mountain = new THREE.Mesh(geoMountain, mountainMaterial);

    // --- ⛰️ Positioning Mountains Randomly
    const angle = Math.random() * Math.PI * 2; // Circular spread
    const radius = randomize(3, 6, true); // Distance from center
    mountain.position.set(
      Math.cos(angle) * radius,
      mountainHeight * 0.5 + 3.5, // Positioned properly on the island
      Math.sin(angle) * radius
    );

    mountain.rotation.y = Math.random() * Math.PI; // Random rotation
    mountainGroup.add(mountain);
  }

  islandGroup.add(mountainGroup);
}

// === CREATE FLOATING ISLAND WITH TEXTURED TOP ===
export function createIslandWithTexture() {
  const islandGroup = new THREE.Group();

  // === 🪨 Ground (Base Island) ===
  const geoGround = new THREE.CylinderGeometry(9, 3, 13, 12, 5);
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x664e31,
    flatShading: true,
  });
  const earth = new THREE.Mesh(geoGround, earthMaterial);
  islandGroup.add(earth);

  // === 🌿 Textured Top Layer ===
  const geoTop = new THREE.CylinderGeometry(8.5, 6, 7.5, 50, 2);
  const terrainMaterial = new THREE.MeshStandardMaterial({
    flatShading: true,
  });

  const terrain = new THREE.Mesh(geoTop, terrainMaterial);
  terrain.position.y = 3.2; // Positioned slightly above the island
  islandGroup.add(terrain);

  // === 🏔️ Add Mountains on the Island ===
  createMountainsOnIsland(islandGroup);

  // === POSITIONING & SCALING ===
  islandGroup.scale.set(1.5, 1.1, 1.5);
  islandGroup.position.y = -5.2;

  return islandGroup;
}
