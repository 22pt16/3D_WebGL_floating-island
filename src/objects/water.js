import * as THREE from "three";

// === LOAD WATER TEXTURE ===
const loader = new THREE.TextureLoader();
const waterTexture = loader.load("./water.jpg"); // Add a realistic water texture
waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping; // Tiling

// === CREATE WATER LAYER ===
export function createWaterOnIsland() {
    const waterGeo = new THREE.CircleGeometry(3.8, 25); // Circle for pond, radius 4.5
    const waterMaterial = new THREE.MeshStandardMaterial({
      map: waterTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });

  const water = new THREE.Mesh(waterGeo, waterMaterial);
  water.rotation.x = -Math.PI / 2; // Horizontal plane
  water.position.y = 7.2; // Slightly above terrain

  // === Animate Water Flow ===
  water.material.map.wrapS = THREE.RepeatWrapping;
  water.material.map.wrapT = THREE.RepeatWrapping;

  return water;
}

// === CREATE WATERFALLS ===
export function createWaterfalls() {
    const waterfallGroup = new THREE.Group();
  
    for (let i = 0; i < 2; i++) {
      const waterfallGeo = new THREE.PlaneGeometry(1.2, 6);
      const waterfallMaterial = new THREE.MeshStandardMaterial({
        map: waterTexture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
  
      const waterfall = new THREE.Mesh(waterfallGeo, waterfallMaterial);
  
      // Positioning waterfalls on opposite sides
      const positionOffset = i === 0 ? 5 : -5;
      waterfall.position.set(positionOffset, -1.5, 1.5);
      waterfall.rotation.y = Math.PI / 4; // Slight tilt for realism
  
      waterfallGroup.add(waterfall);
    }
  
    return waterfallGroup;
  }
  


// === CREATE ROCK BORDER AROUND POND (NO TEXTURE) ===
export function createRockBorder(water) {
    const rockGroup = new THREE.Group(); // Group for all rocks
    const numRocks = 20; // Number of rocks around the pond
    const radius = 7;
  
    for (let i = 0; i < numRocks; i++) {
      // Small random rock sizes
      const rockSize = Math.random() * 0.4 + 0.2; // Vary between 0.2 and 0.6
      const geoRock = new THREE.SphereGeometry(rockSize, 10, 10);
  
      const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x9c9c9c, // Neutral stone color (greyish)
        roughness: 0.8, // More matte, less shiny
        metalness: 0.2, // Slight reflective feel
        flatShading: true, // Low poly for a more organic feel
      });
  
      const rock = new THREE.Mesh(geoRock, rockMaterial);
  
      // Positioning rocks around the pond
      const angle = (i / 20) * Math.PI * 2; // Full circular spread
      const radius = 4; // Just outside the pond radius
  
      rock.position.set(
        Math.cos(angle) * radius + Math.random() * 0.2 - 0.1, // Random jitter for natural feel
        0, // Slightly below water level
        Math.sin(angle) * radius + Math.random() * 0.2 - 0.1
      );
  
      rockGroup.rotation.x = -Math.PI / 2;
      rockGroup.add(rock);
      
    }
  
    // Add rock border around pond
    water.add(rockGroup);
  }
  
  