let lastSpeed = 0;
let yoff = 0
let dy = 0.03;

let resetBackground = true;

// function addSlider(variable, min, max, val, step, text)

function setup() {
  createCanvas(400, 400);
  background("purple");
  translate(width/2,height/2);
  let resetBackgroundBtn = createButton("reset drawing");
  addSlider("speed", 0, 0.1, dy, 0.01, "Speed: #");  
  addSlider("dx", 0, 1, 0.1, 0.05, "dx: #");   
  resetBackgroundBtn.mousePressed(()=>resetBackground=true);
  lastSpeed = vars["speed"];
}

function draw() {
  let startAngle = 0;
  let endAngle = 2*PI;
  let angleStep = 2*PI/100;
  let dx = vars["dx"];
  let speedChanged = lastSpeed != vars["speed"];
  if (speedChanged) {
    resetBackground = true;
    lastSpeed = vars["speed"];
    dy = vars["speed"];
    dx = vars["dx"];
  }
  
  if (resetBackground) {
    background("purple");
    resetBackground = false;
  }

  translate(width/2,height/2);
  stroke(255);
  fill("deeppink");
  strokeWeight(4);
  beginShape();
  let xoff = 0;
  for (let a = startAngle; a <= endAngle; a+=angleStep) {
    let n = noise(xoff, yoff);
    let rNoise = map(n, 0, 1, 50, 150);
    let r = eq(a)* rNoise;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x,y);
    xoff += dx;
    
  }
  endShape();
  yoff += dy;
  
}

function eq(theta) {
  let r = sin(2*theta);
  return r
}