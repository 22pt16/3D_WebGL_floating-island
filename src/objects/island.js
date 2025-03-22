import * as THREE from 'three';

// 🏝️ Create Floating Island
export function createIsland() {
  const geometry = new THREE.BoxGeometry(5, 1, 5);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00, // Green
    roughness: 0.5,
    metalness: 0.1,
  });

  const island = new THREE.Mesh(geometry, material);
  island.position.y = 0.5; // Lift it a bit above the ground
  return island;
}
