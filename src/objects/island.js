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
  const geoGround = new THREE.CylinderGeometry(7, 2, 9, 12, 5);
  jitter(geoGround, 0.6);
  geoGround.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -0.5, 0)); // ✅ Corrected translate
  const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x664e31, flatShading: true });
  const earth = new THREE.Mesh(geoGround, earthMaterial);
  islandGroup.add(earth);

  // --- 🌿 Green Top Layer
  const geoGreen = new THREE.CylinderGeometry(7.4, 5.5, 3.7, 30, 2);
  jitter(geoGreen, 0.2);
  geoGreen.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 3.1, 0)); // ✅ Corrected translate
  const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x379351, flatShading: true });
  const green = new THREE.Mesh(geoGreen, greenMaterial);
  islandGroup.add(green);

  // --- 🪨 Add Small Rocks Around the Island
  for (let i = 0; i < 5; i++) {
    const geoRock = new THREE.DodecahedronGeometry(randomize(0.5, 1.5), 0);
    const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x9eaeac });
    const rock = new THREE.Mesh(geoRock, stoneMaterial);
    rock.position.set(randomize(-5, 5, true), randomize(-4, -1, true), randomize(-2, 2, true));
    rock.scale.set(randomize(0.8, 1.2, true), randomize(0.5, 3, true), 1);
    islandGroup.add(rock);
  }

  // --- ☁️ Add Floating Clouds
  const cloudGeo = new THREE.SphereGeometry(2, 6, 6);
  jitter(cloudGeo, 0.2);
  const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xdef9ff, transparent: true, opacity: 0.8 });
  const cloud1 = new THREE.Mesh(cloudGeo, cloudMaterial);
  cloud1.position.set(-5, 8, -4.6);
  islandGroup.add(cloud1);

  const cloud2 = cloud1.clone();
  cloud2.position.set(6, -9, 4);
  cloud2.scale.set(1.2, 1.2, 1.2);
  islandGroup.add(cloud2);

  // 🔥 === SHADOW SUPPORT ===
  islandGroup.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  islandGroup.position.y = -5.6; // ✅ Lower the island slightly
  return islandGroup;
}
