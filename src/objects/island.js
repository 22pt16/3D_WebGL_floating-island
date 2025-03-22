import * as THREE from 'three';

// 🎨 === CREATE REALISTIC FLOATING ISLAND ===
export function createIsland() {
  const islandGroup = new THREE.Group();

  // 🍃 === BASE TERRAIN ===
  const terrainGeometry = new THREE.PlaneGeometry(30, 30, 40, 40);
  const terrainMaterial = new THREE.MeshStandardMaterial({
    color: 0x4caf50, // Lush green color
    flatShading: true,
  });

  // Add randomness to the terrain for natural bumps
  const position = terrainGeometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i) + Math.random() * 2 - 1; // Add height variations
    position.setY(i, y);
  }
  terrainGeometry.computeVertexNormals();
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.y = 0;
  islandGroup.add(terrain);

  // 🏔️ === ADD MOUNTAIN PEAKS ===
  const peakMaterial = new THREE.MeshStandardMaterial({
    color: 0x8d6e63, // Rocky brown color
    flatShading: true,
  });

  // Create 3 peaks with different sizes
  const peaks = [
    { radius: 2, height: 10, position: [5, 5, 0] },
    { radius: 1.5, height: 8, position: [-5, 5, 3] },
    { radius: 1.8, height: 9, position: [2, 4, -5] },
  ];

  peaks.forEach((peak) => {
    const peakGeometry = new THREE.ConeGeometry(peak.radius, peak.height, 8);
    const peakMesh = new THREE.Mesh(peakGeometry, peakMaterial);
    peakMesh.position.set(...peak.position);
    peakMesh.position.y = peak.height / 2;
    islandGroup.add(peakMesh);
  });

  // 🌊 === ADD WATERFALL ===
  const waterfallGeometry = new THREE.PlaneGeometry(2, 8);
  const waterfallMaterial = new THREE.MeshBasicMaterial({
    color: 0x87CEFA, // Waterfall blue
    transparent: true,
    opacity: 0.7,
  });
  const waterfall = new THREE.Mesh(waterfallGeometry, waterfallMaterial);
  waterfall.position.set(0, -1, 8);
  waterfall.rotation.x = -Math.PI / 2;
  islandGroup.add(waterfall);

  // 🌱 === ADD GRASSY BASE ===
  const baseGeometry = new THREE.CylinderGeometry(12, 14, 3, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e2723, // Dark brown for base
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -3.5;
  islandGroup.add(base);

  // ✅ Return the complete island group
  return islandGroup;
}
