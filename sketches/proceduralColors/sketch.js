
const SHAPE_ELLIPSE = "ellipse";
const SHAPE_TRIANGLE = "triangle";
const SHAPE_RECT = "rect";
const frameR = 30;

let color1Values = [0, 0, 0];
let color2Values = [0, 0, 0];
let newButton;
let color1;
let color2;


function initializeColors() {
  color1Values = [random(100), random(100), random(100)];
  color2Values = [0,0,0];
  for (let i = 0; i < color1Values.length;i++) {
    let v = random(100);
    while (abs(color1Values[i] - v) <= 20) {
      v = random(100);
    }
    color2Values[i] = v;
  }

  color1 = color(color1Values[0], color1Values[1], color1Values[2]);
  color2 = color(color2Values[0], color2Values[1], color2Values[2]);
}
function changeColors() {
  print("rotateColors");
  color1 = color2;
  color1Values = [...color2Values];
  print(`color1values: ${color1Values}`);
  for (let i = 0; i < color1Values.length;i++) {
    color2Values[i] = random(100);
    let count = 0;
    while (abs(color1Values[i] - color2Values[i]) <= 20) {
      print(abs(color1Values[i] - color2Values[i]));
      color2Values[i] = random(100);
      if (++count > 100) {
        break;
      }
    }
  }
  print(`color1values: ${color1Values}`);
  print(`color2values: ${color2Values}`);

  color2 = color(color2Values[0], color2Values[1], color2Values[2]);
}

function rotateColors() {
  if (random(1) > 0.5) {
    color1Values = color1Values
        .map((v) => random(1)>0.5? v + random(-2, 2) : v)
        .map((v) => v <=0? 0: v > 100? 100: v);
    print(`color1change: ${color1Values}`);
    color1 = color(color1Values[0], color1Values[1], color1Values[2]);
  }
  else if (random(1) > 0.5 || true) {
    color2Values = color2Values
        .map((v) => random(1)>0.5? v + random(-2, 2) : v)
        .map((v) => v <=0? 0: v > 100? 100: v);
    color2 = color(color2Values[0], color2Values[1], color2Values[2]);
    print(`color2change: ${color2Values}`);
  }

}
function setup() {
  noiseSeed(random(100000));
  createCanvas(400, 400);
  colorMode(HSB, 100);
  newButton = createButton("New");
  newButton.mouseClicked(() => {
    noiseSeed(random(100000));
    changeColors();
  });
  initializeColors();
  frameRate(frameR);
  background(220);
  noStroke();
}

function draw() {
  rotateColors();
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(10, 40);
    let noiseValue = noise(x * 0.01, y * 0.01);
    let shape = random([SHAPE_ELLIPSE, SHAPE_TRIANGLE, SHAPE_RECT]);
    let fillColor;
    if (hue(color1) - hue(color2) > hue(color2) - hue(color1)) {
      fillColor = lerpColor(color1, color2, noiseValue);
    } else {
      fillColor = lerpColor(color2, color1, noiseValue);
    }
    fill(fillColor);
    if (shape === SHAPE_ELLIPSE) {
      ellipse(x, y, size, size);
    } else if (shape === SHAPE_TRIANGLE) {
      triangle(x, y, x + size, y, x + size / 2, y + size);
    } else if (shape === SHAPE_RECT) {
        rect(x, y, size, size);
    }
  }
}
