const scale = 20;
const dxoff = 0.1;
const baseY = 300;


let yoff = 0;
let dyoff = 0.0005;

let seed1,seed2,seed3;

function setup() {
  createCanvas(400, 400);
  seed1 = random(0,100);
  seed2 = random(100,200);
  seed3 = random(200,300);
  

}

function draw() {
  background("#e9ad83");
  fill("#D5C5EC");
  noStroke();
  drawMountains(baseY, 120,10, seed1);
  fill("#AD83E9");
  drawMountains(baseY+40, 100,5, seed2);
  fill("#633b9c");
  drawMountains(baseY+50, 100,2, seed3);
  yoff += dyoff;
}

function drawMountains(baseY, maxHeight, xScale, seed) {
  beginShape();
  
  if (maxHeight === undefined) {
    maxHeight = baseY / 2;
  }
  
  if (maxHeight < 0) {
    maxHeight = -maxHeight;
  }
  if (seed === undefined) {
    seed = 0;
  }
  
  let rows = ceil(width / scale);
  
  let dxoff = (xScale/width * 5);
  let xoff = seed;
  
  let lastX = 0;
  let x = 0;
  while(lastX < width) {
    // let n = noise(x/width * 5, seed);
    let n = noise(xoff, yoff);
    let yNoise = map(n,0,1,-maxHeight, 0);
    let y = baseY + yNoise;
    
    vertex(x, y);
    lastX = x;
    x += xScale;
    xoff += dxoff;
  }
  vertex(width,height);
  vertex(0, height);
  endShape();
}