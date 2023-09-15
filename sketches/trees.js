new p5();

let angleSliderDiv;
let lengthSliderDiv;
let meanSliderDiv;
let stdDevSliderDiv;

let angleSlider;
let lengthSlider;
let meanSlider;
let stdDevSlider;

let lastAngle;
let lastLength;
let lastMean;
let lastStdDev;

const minLength = 4;

let greenColor;
let brownColor;

function createSliders() {
  angleSliderDiv = createDiv('Angle');
  angleSlider = createSlider(0,TWO_PI, PI/4, 0.01);
  angleSlider.parent = angleSliderDiv;
  
  lengthSliderDiv = createDiv('Length');
  lengthSlider = createSlider(0, 100, 50, 1);
  lengthSlider.parent = lengthSliderDiv;
  
  meanSliderDiv = createDiv('Mean');
  meanSlider = createSlider(0.1, 0.9, 0.5, 0.01);
  meanSlider.parent = meanSliderDiv;
  
  stdDevSliderDiv = createDiv('Std Dev.');
  stdDevSlider = createSlider(0, 0.5, 0.1, 0.01);
  stdDevSlider.parent = stdDevSliderDiv;
}

function setup() {
  createCanvas(400, 400);
  createSliders();
  
  greenColor = color(42,126,25);
  // brownColor = color(107, 73, 43);
  brownColor = color(227, 132, 0);
  
}

function needsUpdate() {
  let cAngle = angleSlider.value();
  let cLength = lengthSlider.value();
  let cMean = meanSlider.value();
  let cStdDev = stdDevSlider.value();
  
  return cAngle != lastAngle || cLength != lastLength || cMean != lastMean || cStdDev != lastStdDev;
}

function draw() {
  if (needsUpdate()){
    lastAngle = angleSlider.value();
    lastLength = lengthSlider.value();
    lastMean = meanSlider.value();
    lastStdDev = stdDevSlider.value();
    background(255);
    angle = angleSlider.value();
    stroke(255);
    strokeWeight(2);
    drawInfoText();
    translate(width*0.5, height);
    branch(lengthSlider.value()*getLengthFactor());
  }
}

function drawInfoText() {
  let angleStr = "Angle: " + angle;
  let lenStr = "Length: " + lengthSlider.value();
  let meanStr = "Mean: " + meanSlider.value();
  let stdDevStr = "StdDev: " + stdDevSlider.value();
  push();
  textSize(16);
  fill(255, 255, 255);
  text(angleStr, 5, 15);
  text(lenStr,5,30);
  text(meanStr, 5, 45);
  text(stdDevStr, 5, 60);
  pop();
}

function branch(len) {
  let branchColor = getColor(len);
  stroke(branchColor);
  line(0,0,0, -len);
  translate(0, -len);
  if (len > minLength) {
    push();
    rotate(angle);
    let lenFactor = getLengthFactor();
    branch(len*lenFactor);
    pop();
    push();
    rotate(-angle);
    lenFactor = getLengthFactor();
    branch(len*lenFactor);
    pop();
  }
}

function getColor(branchLen) {
  if (branchLen < minLength) {
    // TODO: make it the full green color
    return greenColor;
  }
  // else calculate using a linear gradiant where the value is based off the following percent calculation
  // we take how far the current branch is from the min length as a percentage of the max distance
  let percent = (branchLen-minLength) / (lengthSlider.value()-minLength);
  let c = lerpColor(greenColor, brownColor, percent);
  return c;
}

function getLengthFactor() {
  let mean = meanSlider.value();
  let std = stdDevSlider.value();
  return randomGaussian(mean,std);
}