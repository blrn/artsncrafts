const SEC_RAD_RATIO = 0.7;
const MIN_RAD_RATIO = 0.6;
const HOUR_RAD_RATIO = 0.4;
const TICK_RAD_RATIO = 0.8;
const HOUR_TICK_LEN_RATIO = 0.1;
const CLOCK_DIA_RATIO = 1.7;
const CLOCK_OUT_DIA_RATIO = 1.8;

let radius;

function setup() {
  createCanvas(400, 400);
  radius = min(width,height) / 2;
  frameRate(4);
}

function draw() {
  background(220);
  
  drawClock();  
}

function drawClock() {
  let s = second();
  let m = minute() + (s/60);
  let h = hour() + (m/60);
  
  let sAngle = map(s, 0, 60, 0, 2*PI) - PI;
  let mAngle = map(m + (second()/60), 0, 60, 0, 2*PI) - PI;
  let hAngle = map(h % 12, 0, 12, 0, 2*PI) - PI;
  
  
  push();
  noStroke();
  //fill(227, 118, 140);
  ellipseMode(CENTER);
  translate(width/2,height/2);
  fill("#DE617B");
  circle(0,0, CLOCK_OUT_DIA_RATIO*radius);
  fill("#D43858");
  circle(0,0, CLOCK_DIA_RATIO*radius);
  
  push();
  stroke(255);
  
  push();
  strokeWeight(1);
  rotate(sAngle);
  line(0,-20,0, SEC_RAD_RATIO * radius);
  pop();
  
  push()
  strokeWeight(2);
  rotate(mAngle);
  line(0,-20,0, MIN_RAD_RATIO * radius);
  pop();
  
  push();
  strokeWeight(4);
  rotate(hAngle);
  line(0,-20,0, HOUR_RAD_RATIO * radius);
  pop();
  pop();
  
  push();
  stroke(255);
  strokeWeight(5);
  let dAngle = 2*PI / 60;
  beginShape(POINTS);
  const hourTickLength = HOUR_TICK_LEN_RATIO * radius;
  for (let i = 0; i < 60; i++) {
    let a = dAngle * i;
    if (i%5 == 0) {
      push();
      rotate(a);
      line(TICK_RAD_RATIO*radius,0, (TICK_RAD_RATIO*radius)-hourTickLength,0);
      pop();
    }
    let x = cos(a) * TICK_RAD_RATIO * radius;
    let y = sin(a) * TICK_RAD_RATIO * radius;
    // print(`a=${a}=${round(degrees(a), 0)} | (${round(x,3)}, ${round(y,3)})`);
    vertex(x,y);
  }
  // for (let a = 0; a < 2*PI; a+=dAngle) {
  //   let x = cos(a) * TICK_RAD_RATIO * radius;
  //   let y = sin(a) * TICK_RAD_RATIO * radius;
  //   vertex(x,y);
  // }
  endShape();  
  dAngle = 2*PI / 12;
  beginShape(POINTS);
  strokeWeight
  for (let a = 0; a < 2*PI; a+=dAngle) {
    
  }
  pop();
  
  pop();
  
  
  
}