import * as THREE from 'three';

// 🎲 === UTILITY FUNCTIONS ===
const randomize = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;
  return float ? val : Math.floor(val);
};

const jitter = (geo, per) => {
  const pos = geo.attributes.position;
  const count = pos.count;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i) + (Math.random() - 0.5) * per;
    const y = pos.getY(i) + (Math.random() - 0.5) * per;
    const z = pos.getZ(i) + (Math.random() - 0.5) * per;

    pos.setXYZ(i, x, y, z);
  }

  pos.needsUpdate = true;
};

// ⛰️ === CREATE SNOW-CAPPED MOUNTAINS ===
export function createMountains(scene) {
  const mountainGroup = new THREE.Group();

  for (let i = 0; i < 8; i++) {
    // --- 🪨 Base Mountain Geometry
    const mountainHeight = randomize(5, 12, true);
    const geoMountain = new THREE.ConeGeometry(
      randomize(2.5, 4, true), // Base radius
      mountainHeight,
      20 + randomize(4, 10) // Jittered for more realism
    );

    // Jitter vertices for irregular shape
    jitter(geoMountain, 0.5);

    const mountainMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b7765, // Rocky brown
      flatShading: true,
    });

    const mountain = new THREE.Mesh(geoMountain, mountainMaterial);

    // --- ❄️ Snow Cap (Layered Top)
    const geoSnow = new THREE.ConeGeometry(
      mountainHeight * 0.35, // Slightly larger to blend over mountain
      mountainHeight * 0.4, // Cap height proportional to mountain
      15 + randomize(2, 5) // Higher segments for smooth blending
    );

    // Jitter vertices for organic, melting effect
    jitter(geoSnow, 0.2);

    const snowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Bright snow
      emissive: 0xe0ffff, // Soft glow on snow
      emissiveIntensity: 0.4,
      flatShading: true,
    });

    const snowCap = new THREE.Mesh(geoSnow, snowMaterial);

    snowCap.scale.set(1.25, 1.1, 1.25); // ✅ Slightly larger for overlap
    snowCap.position.set(0, mountainHeight * 0.55 - 0.5, 0); // ✅ Lower snow cap a bit
    

    // --- ⛰️ Positioning Mountains Randomly Around Island
    const angle = Math.random() * Math.PI * 2;
    const radius = randomize(9, 13, true);
    mountain.position.set(
      Math.cos(angle) * radius,
      7.5, // Raise to be above land layer
      Math.sin(angle) * radius
    );

    mountain.rotation.y = Math.random() * Math.PI; // Random rotation
    snowCap.rotation.y = mountain.rotation.y;

    // Add snow cap on mountain
    mountain.add(snowCap);

    // Add to mountain group
    mountainGroup.add(mountain);
  }

  // 🔥 === SHADOW SUPPORT ===
  mountainGroup.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  return mountainGroup;
}
