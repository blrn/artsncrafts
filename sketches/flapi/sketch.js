const MinGap = 100;
const MaxGap = 200;
const ObstacleWidth = 100;
const ObstacleSpacing = 200;
const HorizontalSpeed = 5;
const FlapHeight = 5;
const GlobalAcceleration = 0.1;
const InitialSpacing = 400 * 2;

class Bird {
  
  constructor(initX, initY) {
    this.position = createVector(initX, initY);
    this.vertVel = 0;
    this.flapFrame = false;
  }
  
  update() {
    if (this.flapFrame) {
      this.flapFrame = false;
      this.position.y -= FlapHeight;
      this.vertVel = -15 * GlobalAcceleration;
    } else {
      this.vertVel += GlobalAcceleration;
      this.position.y += this.vertVel;
    }
  }
  
  flap() {
    this.flapFrame = true;
    this.position.y -= FlapHeight;
    this.vertVel = -3 * GlobalAcceleration;
  }
  
  updateHeight(newHeight) {
    this.position.y = newHeight;
  }
  
  draw() {
    push();
    fill("red");
    rect(this.position.x, this.position.y, 10, 10);
    pop();
  }
}

class Obstacle {
  
  constructor(topHeight, bottomHeight, x) {
    this.topHeight = topHeight;
    this.bottomHeight = bottomHeight;
    this.x = x;
    
  }
  
  move(amount) {
    this.x -= amount;
  }
  
  draw() {
    push();
    fill("purple");
    rect(this.x, 0, ObstacleWidth, this.topHeight);
    rect(this.x, height-this.bottomHeight, ObstacleWidth, this.bottomHeight);
    pop();
  }
}

let bird;

let obstacles;



function setup() {
  createCanvas(400, 400);
  bird = new Bird(50, 75);
  generateObstacles();
}

function draw() {
  background(220);
  updateWorld();
  drawObstacles();
  bird.draw(); 
}

function keyPressed(ev) {
  bird.flap();
}

function generateObstacles() {
  let numObstacles = min(1, width / (ObstacleWidth+ObstacleSpacing));
  obstacles = [];
  for (let i = 0; i<numObstacles;i++) {
    obstacles.push(generateObstacle(InitialSpacing+(i*(ObstacleWidth+ObstacleSpacing))));
  }
  print(obstacles)
}

function generateObstacle(x) {
  let topMaxHeight = 0.6 * height;
  let topHeight = random(topMaxHeight);
  
  let bottomMaxHeight = height - topHeight - MinGap;
  let bottomMinHeight = height - topHeight - MaxGap;
  let bottomHeight = random(bottomMinHeight,bottomMaxHeight);
  //let maxHeight = height - MinGap;
  //let h = random(maxHeight);
  return new Obstacle(topHeight, bottomHeight, x);
}

function drawObstacles() {
  for (let obs of obstacles) {
    obs.draw();
  }
  
}

function updateWorld() {
  for (let obs of obstacles) {
    obs.move(HorizontalSpeed);
  }
  if (obstacles[0].x + ObstacleWidth < 0) {
    obstacles.shift();
  }
  
  let lastObstacle = obstacles[obstacles.length-1];
  if (lastObstacle.x + ObstacleWidth + ObstacleSpacing < width) {
    obstacles.push(generateObstacle(lastObstacle.x+ObstacleWidth + ObstacleSpacing))
  }
  
  bird.update();
  
}