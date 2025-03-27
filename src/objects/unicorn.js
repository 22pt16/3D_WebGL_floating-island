import * as THREE from 'three';
import gsap from 'gsap';

// Helpers
const degreesToRadians = (degrees) => {
	return degrees * (Math.PI / 180);
};

// Params
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const params = {
	rx: 0,
	ry: 0,
	headRotation: degreesToRadians(50),
	tailRotation: degreesToRadians(-15),
	tailColor: 0x792cb8
};

export class Unicorn {
    
    createHorn(headX, headY) {
        const geometry = new THREE.ConeGeometry(3, 12, 7);
        const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const horn = new THREE.Mesh(geometry, material);
                
        this.headGroup.add(horn);
                
        horn.position.x = headY - 1;
        horn.position.y = -3.5;
        horn.rotation.z = degreesToRadians(-90);
    }

    createEyes(headX, headY) {
        const material = new THREE.MeshLambertMaterial({ color: 0x242c38 });
        const geometry = new THREE.SphereGeometry(1.125, 12, 12);
        
        for (let i = 0; i < 2; i++) {
            const m = i % 2 === 0 ? -1 : 1;
            const eye = new THREE.Mesh(geometry, material);
            
            eye.position.x = 4.5;
            eye.position.z = headX * 0.5 * m;
            eye.position.y = headY * -0.5;
            
            this.headGroup.add(eye);
        }
    }

    createTail() {
        this.tailGroup = new THREE.Group();
        const material = this.purpleMaterial;  // Apply purple tail color

        let geometry = new THREE.SphereGeometry(2, 20, 20);
        let tail = new THREE.Mesh(geometry, material);
        tail.position.x = -7.5;
        this.tailGroup.add(tail);
                
        geometry = new THREE.SphereGeometry(2.8, 20, 20);
        tail = new THREE.Mesh(geometry, material);
        tail.position.set(-9, -0.5, -0.5);
        this.tailGroup.add(tail);
                
        geometry = new THREE.SphereGeometry(2.5, 20, 20);
        tail = new THREE.Mesh(geometry, material);
        tail.position.set(-9.5, -2.1, 0);
        this.tailGroup.add(tail);
                
        geometry = new THREE.SphereGeometry(2, 20, 20);
        tail = new THREE.Mesh(geometry, material);
        tail.position.set(-11, -2, -1.1);
        this.tailGroup.add(tail);
                
        geometry = new THREE.SphereGeometry(2, 20, 20);
        tail = new THREE.Mesh(geometry, material);
        tail.position.set(-10.5, -3.7, 0);
        this.tailGroup.add(tail);
                
        this.group.add(this.tailGroup);
        this.tailGroup.position.y = 3;
    }
            
    createEars(headX, headY) {
        const x = 1.5, y = 4;
        const geometry = new THREE.ConeGeometry(x, y, 32);
        
        for (let i = 0; i < 2; i++) {
            const m = i % 2 === 0 ? -1 : 1;
            const ear = new THREE.Mesh(geometry, this.pinkMaterial);
            
            this.headGroup.add(ear);
            
            ear.position.set(headX - (x * 0.5), 1.2, headX * 0.3 * m);
            ear.rotation.z = degreesToRadians(-30);
        }
    }    

    constructor() {
        this.group = new THREE.Group();
        this.orbitGroup = new THREE.Group(); // Parent group for orbit
        this.orbitGroup.add(this.group);
        // Define materials
        this.pinkMaterial = new THREE.MeshStandardMaterial({ color: 0xFF69B4}); // Pink for body, head, ears
        this.purpleMaterial = new THREE.MeshStandardMaterial({ color: 0x792CB8 }); // Purple for tail

        // Body
        const bodyX = 12, bodyY = 10;
        this.bodyGroup = new THREE.Group();
		
        const geometry = new THREE.BoxGeometry(bodyX, bodyY, bodyY);
        const bodyMain = new THREE.Mesh(geometry, this.pinkMaterial);
		
        this.bodyGroup.add(bodyMain);
        this.group.add(this.bodyGroup);
        this.group.scale.set(.15, .15, 0.15); // Adjust scale to make unicorn smaller

        // Head
        const headX = 8, headY = 12, headZ = 8;
        this.headGroup = new THREE.Group();
		
        const hgeometry = new THREE.BoxGeometry(headX, headY, headZ);
        this.headMain = new THREE.Mesh(hgeometry, this.pinkMaterial);
		
        this.headGroup.add(this.headMain);
        this.group.add(this.headGroup);
		
        this.headMain.position.set(headX * 0.5, headY * -0.5, 0);
		
        this.headGroup.position.set(4, 10, 0);
		
        // Neck
        const neckGeometry = new THREE.BoxGeometry(1.5, 4, 8);
        const neck = new THREE.Mesh(neckGeometry, this.pinkMaterial);
        this.headGroup.add(neck);
		
        neck.position.set(-0.75, -2, 0);
		
        this.createEyes(headX, headY);
        this.createEars(headX, headY);
        this.createHorn(headX, headY);

        // Legs
        this.legs = [];
		const { rt, rb, height } = {
			rt: 1.5,
			rb: 1,
			height: 5.3
		};
		
		const lgeometry = new THREE.CylinderGeometry(rt, rb, height, 32);
		
		for (let i = 0; i < 4; i++) {
			const group = new THREE.Group();
			const m = i % 2 === 0 ? -1 : 1;
			const legMesh = new THREE.Mesh(lgeometry, this.pinkMaterial);
			let posX = i > 1 ? bodyY * -0.5 + rt : bodyY * 0.5 - rt;
		
			legMesh.position.set(0, height * -0.5, height * 0.5 * m);
			
			group.add(legMesh);
			group.position.set(posX, bodyY * -0.5 + 0.5, bodyY * 0.08 * m);
			this.bodyGroup.add(group);
			this.legs.push(group);
		}
        
        // Tail
        this.createTail();
        
        // Wings (Optional)
        const wingGeometry = new THREE.PlaneGeometry(1, 0.5);
        const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const wingLeft = new THREE.Mesh(wingGeometry, wingMaterial);
        wingLeft.position.set(-0.8, 0.5, 0);
        wingLeft.rotation.y = Math.PI / 4;
        this.group.add(wingLeft);

        const wingRight = new THREE.Mesh(wingGeometry, wingMaterial);
        wingRight.position.set(0.8, 0.5, 0);
        wingRight.rotation.y = -Math.PI / 4;
        this.group.add(wingRight);

        // Initial position
        this.group.position.set(0, 3, 0);
    }

    addToScene(scene) {
        scene.add(this.group);
    }

    animateOrbit() {
        this.group.userData.speedX = (Math.random() - 0.5) * 0.1;  // Random forward/backward speed
        this.group.userData.speedY = (Math.random() - 0.5) * 0.05; // Random up/down wobble
        this.group.userData.speedZ = (Math.random() - 0.5) * 0.08; // Random sideways drift
      }
      
      updateUnicornFlight() {
        // 🌈 === UNICORN MOVEMENT ===
        this.group.position.x += this.group.userData.speedX;
        this.group.position.y += this.group.userData.speedY;
        this.group.position.z += this.group.userData.speedZ;
      
        // 🔄 === RESET POSITION IF OUT OF BOUNDS ===
        if (this.group.position.x > 50) this.group.position.x = -50;
        if (this.group.position.z > 50) this.group.position.z = -50;
        if (this.group.position.y > 30) this.group.position.y = 15;
        if (this.group.position.y < 10) this.group.position.y = 15;
      }
      
    
    
    
    
}
