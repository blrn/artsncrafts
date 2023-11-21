const numParticles = 2;
const gravConstant = 1;
const edgeCollisionEfficency = 0.8;
const particleCollisionEfficency = 0.5;

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.vel = createVector(0,0);
    this.acc = createVector(0, 0);
    this.radius = 8;  // Adjust the size as needed
    this.color = {r: random(100), g: random(255), b: random(255)};
    this.collisions = [];
  }

  update(particles) {
    for (let other of particles) {
      if (other !== this) {
        let force = p5.Vector.sub(other.pos, this.pos);
        let distanceSq = force.magSq();
        distanceSq = constrain(distanceSq, 25, 200); // Avoid division by zero
        let strength = gravConstant / distanceSq; // G (gravitational constant) = 5000
        force.setMag(strength);
        this.acc.add(force);
      }
    }

    // Update velocity and position
    this.vel.add(this.acc);    
    this.pos.add(this.vel);
    // this.edgeCollisions();

    // Reset acceleration
    this.acc.mult(0);
    this.collisions = [];
  }
  
  updateCollisions(particles) {
    
    for (let other of particles) {
      if (other == this) {
        continue;
      }
      if (this.collidesWith(other)) {
        print("collision");
        if (!this.collisions.includes(other) && !other.collisions.includes(this)) {
          print("doing collision");
          this.bounceOffOf(other);
          this.collisions.push(other);
          other.collisions.push(this);
        }
      }
    }
  }
  
  collidesWith(other) {
    let distance = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    return distance < this.radius + other.radius;
  }
  
  

  edgeCollisions() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -edgeCollisionEfficency;
    }

    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -edgeCollisionEfficency;
    }
  }

  bounceOffOf(other) {
    let normal = createVector(other.pos.x - this.pos.x, other.pos.y - this.pos.y).normalize();
    let relativeVelocity = p5.Vector.sub(other.vel, this.vel);
    let speedAlongNormal = relativeVelocity.dot(normal);

    // Check if particles are moving towards each other
    if (speedAlongNormal > 0) {
      let impulse = map(speedAlongNormal, 0, 100, 0.5, 0.9); // Adjust the bounce strength
      let impulseVector = p5.Vector.mult(normal, impulse);
      print(`speedAlongNormal=${speedAlongNormal} | impulse=${impulse} | impulseVector=<${impulseVector.x}, ${impulseVector.y}>`);
      print(`before this.vel=<${this.vel.x}, ${this.vel.y}>`);

      // Apply impulse to both particles
      this.vel.mult(impulseVector);
      print(`after this.vel=<${this.vel.x}, ${this.vel.y}>`);
      other.vel.mult(impulseVector);
    }
  }

  draw() {
    push();
    noStroke();
    fill(this.color.r, this.color.g, this.color.b);
    ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    pop();
  }
}

const particles = [];

let offsetX = 0;
let offsetY = 0;

function mouseDragged() {
  offsetX += mouseX - pmouseX;
  offsetY += mouseY - pmouseY;
  print(`offsetX=${offsetX} | offsetY=${offsetY}`);
}

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(220);
  push();
  translate(offsetX, offsetY);
  for (let p of particles) {
    p.updateCollisions(particles);
  }
  for (let p of particles) {
    p.update(particles);
  }
  
  for (let p of particles) {
    p.draw();
  }
  pop();
}