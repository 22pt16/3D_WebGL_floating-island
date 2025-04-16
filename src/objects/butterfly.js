import * as THREE from "three";

// === UTILITY FUNCTIONS ===
const randomize = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;
  return float ? val : Math.floor(val);
};


// === CREATE REALISTIC BUTTERFLY WING SHAPE ===
const createWingShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.4, 0.6, 1.0, 1.0, 1.2, 0.8);
  shape.bezierCurveTo(0.8, 0.3, 0.9, 0.1, 0.8, 0);
  shape.bezierCurveTo(0.7, -0.1, 0.5, -0.2, 0.3, -0.1);
  shape.bezierCurveTo(0.1, 0, 0, 0, 0, 0);
  return shape;
};

//  === ADD COLORS TO BUTTERFLIES ===
export const addButterfliesToIsland = (islandGroup) => {
  const butterflyGroup = new THREE.Group();
  const colors = [0xff6347, 0xffa500, 0xffff00, 0x32cd32, 0x4169e1, 0x9370DB, 0xFF69B4, 0x00FFFF]; // Expanded color palette

  for (let i = 0; i < 25; i++) {
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    const wingPattern = Math.random() > 0.5 ? color1 : color2;

    // === CREATE BUTTERFLY BODY ===
    const bodyGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3c2f2f });
    const body = new THREE.Mesh(bodyGeo, bodyMat);

    // === CREATE REALISTIC WINGS ===
    const wingShape = createWingShape();
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.03,// The distance to extrude the shape along the z-axis
      bevelEnabled: false,
      steps: 1
    });
    
    // Create gradient texture for wings
    const createWingTexture = (baseColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${(baseColor >> 16) + 20}, 100%, 70%)`);
      gradient.addColorStop(1, `hsl(${(baseColor >> 16)}, 100%, 50%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some wing patterns
      if (Math.random() > 0.3) {
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(150, 150, 50, 100, 0, 0, Math.PI * 2);//design in wings
        ctx.stroke();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      return new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        roughness: 0.7,
        metalness: 0.1
      });
    };

    const wingLeft = new THREE.Mesh(wingGeo, createWingTexture(color1));
    const wingRight = new THREE.Mesh(wingGeo, createWingTexture(color2));

    // Mirror the right wing
    wingRight.scale.x = -1;

    // === POSITION WINGS ===
    wingLeft.position.set(-0.3, 0, 0);
    wingRight.position.set(0.3, 0, 0);
    wingLeft.rotation.z = Math.PI / 8;
    wingRight.rotation.z = -Math.PI / 8;

    // === CREATE BUTTERFLY GROUP ===
    const butterfly = new THREE.Group();
    butterfly.add(body);
    butterfly.add(wingLeft);
    butterfly.add(wingRight);

    
    // === RANDOM POSITION AND HEIGHT ===
    const angle = Math.random() * Math.PI * 2;
    const radius = randomize(10, 24, true);
    butterfly.position.set(
      Math.cos(angle) * radius,
      8 + Math.random() * 2,
      Math.sin(angle) * radius
    );

    butterfly.scale.set(0.8, 0.8, 0.6);
    butterfly.userData = {
      ...butterfly.userData,
      angle,
      radius,
      speed: Math.random() * 0.01 + 0.005,
      heightOffset: Math.random() * 1.5,
      flightRadius: radius + Math.random() * 2,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: Math.random() * 0.02 + 0.01,
      targetHeight: 8 + Math.random() * 3,
      targetRadius: radius,
      smoothFactor: 0.1,
      spiralFactor: Math.random() * 0.5 + 0.5,
      verticalOscillation: Math.random() * 0.5 + 0.5
    };

    butterflyGroup.add(butterfly);
  }

  islandGroup.add(butterflyGroup);
  animateButterflies(butterflyGroup);
};

// === ANIMATE BUTTERFLY WINGS AND SMOOTH MOVEMENT ===
export const animateButterflies = (butterflyGroup) => {
  const clock = new THREE.Clock();
  const windDirection = new THREE.Vector3(
    Math.random() * 0.1 - 0.05,
    0,
    Math.random() * 0.1 - 0.05
  );

  function updateButterflies() {
    const time = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Slowly change wind direction over time
    windDirection.x += (Math.random() - 0.5) * 0.01;
    windDirection.z += (Math.random() - 0.5) * 0.01;
    windDirection.normalize().multiplyScalar(0.08);

    butterflyGroup.children.forEach((butterfly) => {
      const { userData } = butterfly;
      
      //  Update wing flapping with more natural motion
      userData.wingPhase += userData.wingSpeed;
      const wingAngle = Math.sin(userData.wingPhase) * 0.5;
      
      butterfly.children[1].rotation.z = wingAngle + Math.PI/8;
      butterfly.children[2].rotation.z = -wingAngle - Math.PI/8;

      //  Smooth circular orbit with wind influence
      userData.angle += userData.speed * delta;
      
      // Calculate target position with wind effect
      const targetX = Math.cos(userData.angle) * userData.flightRadius + windDirection.x;
      const targetZ = Math.sin(userData.angle) * userData.flightRadius + windDirection.z;
      
      // Smoothly transition to target position
      butterfly.position.x += (targetX - butterfly.position.x) * userData.smoothFactor;
      butterfly.position.z += (targetZ - butterfly.position.z) * userData.smoothFactor;

      // Vertical movement with smooth transitions
      const heightVariation = Math.sin(time * userData.verticalOscillation + userData.heightOffset) * 0.8;
      const targetY = userData.targetHeight + heightVariation;
      butterfly.position.y += (targetY - butterfly.position.y) * userData.smoothFactor;

      //  Spiral motion with occasional direction changes
      if (Math.random() < 0.005) {
        userData.flightRadius += (Math.random() - 0.5) * 0.5;
        userData.flightRadius = Math.max(1, Math.min(15, userData.flightRadius));
      }

      //  Randomly change target height for more organic movement
      if (Math.random() < 0.01) {
        userData.targetHeight = 8 + Math.random() * 3;
      }

      //  Update particle trail
      if (userData.trail) {
        // Shift all particles back
        const positions = userData.trailPositions;
        for (let i = positions.length - 1; i >= 3; i--) {
          positions[i] = positions[i - 3];
        }
        
        // Add new particle at current position
        positions[0] = butterfly.position.x;
        positions[1] = butterfly.position.y;
        positions[2] = butterfly.position.z;
        
        userData.trail.geometry.attributes.position.needsUpdate = true;
      }

      //  Face the direction of movement
      const lookAtPos = new THREE.Vector3(
        butterfly.position.x + Math.cos(userData.angle),
        butterfly.position.y,
        butterfly.position.z + Math.sin(userData.angle)
      );
      butterfly.lookAt(lookAtPos);
      butterfly.rotation.x = Math.PI/8; // 22.5 degree upward tilt
      // Add banking effect based on turn direction
      const turnDirection = Math.sin(userData.angle * 2);
      butterfly.rotation.z = turnDirection * 0.3; // Lean into turns

      const turnIntensity = Math.cos(userData.angle * 2) * 0.2;
        butterfly.rotation.z = turnIntensity;
    });

    requestAnimationFrame(updateButterflies);
  }

  updateButterflies();
};