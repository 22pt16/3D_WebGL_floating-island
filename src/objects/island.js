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

// 🏝️ === CREATE FLOATING ISLAND ===
export function createIsland() {
  const islandGroup = new THREE.Group();

  // --- 🟤 Ground (Earth Part)
  const geoGround = new THREE.CylinderGeometry(9, 3, 13, 12, 5);
  jitter(geoGround, 0.85);
  geoGround.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -0.5, 0)); // ✅ Corrected translate
  const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x664e31, flatShading: true });
  const earth = new THREE.Mesh(geoGround, earthMaterial);
  islandGroup.add(earth);

  // --- 🌿 Green Top Layer
  const geoGreen = new THREE.CylinderGeometry(8.5, 6, 7.5, 50, 2);
  jitter(geoGreen, 0.3);
  geoGreen.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 3.1, 0)); // ✅ Corrected translate
  const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x379351, flatShading: true });
  const green = new THREE.Mesh(geoGreen, greenMaterial);
  islandGroup.add(green);

  // --- 🪨 Add Small Rocks Around the Island
  for (let i = 0; i < 30; i++) {
    const geoRock = new THREE.DodecahedronGeometry(randomize(0.6, 1.5), 0);
    const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x9eaeac });
    const rock = new THREE.Mesh(geoRock, stoneMaterial);

    rock.position.set(randomize(-5, 5.5, true), 
                      randomize(-5, 2, true),
                      randomize(-2, 2, true));

    // Random rotation for realism
    rock.rotation.x = randomize(0, Math.PI, true);
    rock.rotation.y = randomize(0, Math.PI, true);
    rock.rotation.z = randomize(0, Math.PI, true);

    rock.scale.set(randomize(0.8, 1.2, true), 
                  randomize(0.5, 3, true), 1);
    islandGroup.add(rock);

  }
    // 🌱 Add Bushes and Grass on Top
    console.log("🌱 Adding Bushes and Grass!");
    addBushesAndGrass(islandGroup);


  // 🔥 === SHADOW SUPPORT ===
  islandGroup.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  islandGroup.scale.set(1.5, 1.1, 1.5); // Scale up by 1.5x
  islandGroup.position.y = -5.2; // Lower the island slightly
  return islandGroup;
}

// 🌱 === ADD BUSHES AND GRASS ===
const addBushesAndGrass = (islandGroup) => {
  const bushMaterial = new THREE.MeshLambertMaterial({ color: 0x4c9c2e }); // Natural Green

  for (let i = 0; i < 50; i++) {
    const bushSize = randomize(0.4, 0.9, true);
    const geoBush = new THREE.SphereGeometry(bushSize, 6, 6); // Spherical bushes
    const bush = new THREE.Mesh(geoBush, bushMaterial);

    // Randomize bush position on top layer
    const angle = Math.random() * Math.PI * 2;
    const radius = randomize(3.2, 6.8, true);
    bush.position.set(
      Math.cos(angle) * radius,
      7 + Math.random() * 0.2, // Slight variation in height
      Math.sin(angle) * radius
    );

    bush.rotation.y = Math.random() * Math.PI;
    bush.scale.set(bushSize * 2, bushSize * 3, bushSize * 2); // Bigger bush!
    islandGroup.add(bush);
    console.log(`🌱 Bush #${i + 1} Added at:`, bush.position);

  }
  
};
