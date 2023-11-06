const DEFAULT_SNAKE_LENGTH = 1;
const DEFAULT_SNAKE_SPEED = 1;
const DEFAULT_SNAKE_X = 0;
const DEFAULT_SNAKE_Y = 0;
const MAX_DIR_CHANGE_QUEUE_LENGTH = 5;

const GLOBAL_SCALE = 20;

const INIT_LENGTH = 50;


class Snake {
  constructor(x,y, length, speed) {
    if (x === undefined) {
      x = DEFAULT_SNAKE_X;
    }
    if (y === undefined) {
      y = DEFAULT_SNAKE_Y;
    }
    if (length === undefined) {
      length = DEFAULT_SNAKE_LENGTH;
    }
    if (speed === undefined) {
      speed = DEFAULT_SNAKE_SPEED;
    }
    this.x = x;
    this.y = y;
    this.length = length;
    this.speed = speed;
    
    this.xspeed = 0;
    this.yspeed = 0;
    this.dirChangeQueue = [];
    this.scale = GLOBAL_SCALE;
    
    this.body = [];
    this.growing = false;
    
    
    this.dir(1,0);
  }
  
  dir(x,y) {
    
    let prevX = this.xspeed;
    let prevY = this.yspeed;
    
    if (this.dirChangeQueue.length > 0) {
      let prevVec = this.dirChangeQueue[this.dirChangeQueue.length-1];
      prevX = prevVec.x;
      prevY = prevVec.y;
    }
    // push the direction change onto the direction queue, cap it at 5
    if ((x != 0 && abs(prevX) === abs(x)) || (y != 0 && abs(prevY) == abs(-y))) {
      // Don't allow the snake to double back on itself
      return;
    }
    this.dirChangeQueue.push(createVector(x,y));
    while (this.dirChangeQueue.length > MAX_DIR_CHANGE_QUEUE_LENGTH) {
      this.dirChangeQueue.shift();
    }
  }
  
  updateDir() {
    print(this.dirChangeQueue);
    let x;
    let y;
    do {
      if (this.dirChangeQueue.length == 0) {
        return;
      }
      let newSpeedVec = this.dirChangeQueue.shift();
      x = newSpeedVec.x;
      y = newSpeedVec.y;
    } while ((x != 0 && abs(this.xspeed) === abs(x)) || (y != 0 && abs(this.yspeed) == abs(-y)));
    this.xspeed = x;
    this.yspeed = y;
    
  }
  
  update() {
    this.body.push(createVector(this.x, this.y));
    this.growing = true;
    while (this.body.length > this.length-1) {
      this.body.shift();
      this.growing = false;
    }
    this.updateDir();
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    
    if (this.x < 0) {
      this.x = (width / GLOBAL_SCALE)-1;
    } else if (this.x > (width/GLOBAL_SCALE)-1) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = (height / GLOBAL_SCALE)-1;
    } else if (this.y > (height/ GLOBAL_SCALE)-1) {
      this.y = 0;
    }
  }
  
  eat(food) {
    if (this.x === food.x && this.y === food.y) {
      this.length += 1;
      print("eat");
      return true;
    } 
    return false;
  }
  
  contains(p) {
    return this.bodyContains(p) || (this.x == p.x && this.y == p.y);
  }
  
  bodyContains(p) {
    for (let b of this.body) {
      if (b.equals(p)) {
        return true
      }
    }
    return false;
    
  }
  
  isDead() {
    if (!this.growing && this.body.length == this.length-1 && this.bodyContains(createVector(this.x, this.y))) {
      return true;
    }
  }
  
  draw() {
    push();
    fill(67, 222, 109);    
    for (let b of this.body) {
      rect(b.x*this.scale, b.y*this.scale, this.scale, this.scale);
    }
    // fill(255);
    
    rect(this.x*this.scale,this.y*this.scale, this.scale, this.scale);
    
    push();
    // draw tongue
    let tongueLength = 10;
    let tongueWidth = 4;
    translate(this.x*this.scale, this.y*this.scale);
    let tPos = createVector(this.scale, (this.scale/2)-tongueWidth/2);
    let tSize = createVector(tongueLength, tongueWidth);
    if (this.xspeed < 0) {
      tPos = createVector(0, (this.scale/2)-tongueWidth/2);
      tSize.x = -tSize.x;
    } else if (this.yspeed != 0) {
      tSize = createVector(tongueWidth, tongueLength);
      if (this.yspeed > 0) {
        tPos = createVector((this.scale/2)-tongueWidth/2, this.scale);
      } else {
        tPos = createVector((this.scale/2)-tongueWidth/2, 0);
        tSize.y = -tSize.y;
      }
    }
    fill("red");
    rect(tPos.x, tPos.y, tSize.x, tSize.y);
    
    
    pop();
    
    pop();
  }
}


let s;
let food;
let paused;
let winLength;
let gameOver;
let win;

function setup() {
  createCanvas(600, 600);
  frameRate(10);
  s = new Snake();
  // s.length = 10;
  moveFood();
  
  winLength = (this.width/GLOBAL_SCALE) * (this.height/GLOBAL_SCALE);
  // winLength = 5;
  paused = true;
  gameOver = false;
  win = false;
}

function draw() {
  globalUpdate();
  
  background(220);  
  drawScore();
  s.draw();
  drawFood();
  if (paused) {
    drawPause();
  }
}

function globalUpdate() {
  if (!paused) {
    s.update();
    print(`snake=(${s.x}, ${s.y}) | food=(${food.x}, ${food.y})`);
    if (s.length == winLength) {
      endGame(true);
    } else if (s.isDead()) {
      endGame(false);
    }
    if (s.eat(food)) {
      moveFood();
    }
  }
}

function endGame(withWin) {
  win = withWin;
  gameOver = true;
  paused = true;
}

function keyPressed() {
  if (!paused) {
    if (keyCode === UP_ARROW) {
      s.dir(0,-1);
    } else if (keyCode === DOWN_ARROW) {
      s.dir(0,1);
    } else if (keyCode === LEFT_ARROW) {
      s.dir(-1,0);
    } else if (keyCode === RIGHT_ARROW) {
      s.dir(1,0);
    }
  }
  if (!gameOver && keyCode === ENTER) {
    paused = !paused;
  }
}

function drawScore() {
  push();
  textSize(32);
  fill("black");
  text(`Score: ${s.length-1}`, 16,height-16);
}

function drawPause() {
  push();
  fill(100,255/2);
  rect(0,0,width,height);

  if (gameOver) {
    push();
    textSize(32);
    if (win) {
      fill("green");
      text("WIN!!!", 230, 64);
    } else {
      fill("red")
      text("GAME OVER", 150, 64);
    }
    pop();
  } else {
    textSize(32);
    fill("red");
    text("PAUSED", 230, 64);
  }
  
  pop();
}

function drawFood() {
  push();
  fill(255,0, 200);
  rect(food.x*GLOBAL_SCALE, food.y*GLOBAL_SCALE, GLOBAL_SCALE, GLOBAL_SCALE);
  
  pop();
}

function moveFood() {
  let prevLoc = food;
  if (!prevLoc) {
    prevLoc = createVector(-1,-1);
  }
  let newLoc;
  // let tempX = 0;
  // let tempY = 0;
  do {
    newLoc = generateGridLocation();
    /*
    if (++tempX > width/GLOBAL_SCALE) {
      tempX = 0;
      if (++tempY > height/GLOBAL_SCALE) {
        tempY = 0;
      }
    }
    let newLoc = createVector(tempX, tempY);
    */
    print(`newLoc=(${newLoc.x},${newLoc.y})`);
  } while(newLoc.equals(prevLoc) || s.contains(newLoc));
  food = newLoc;
}

function generateGridLocation() {
  
  let cols = width / GLOBAL_SCALE;
  let rows = height / GLOBAL_SCALE;
  let fCol;
  let fRow;
  
  fCol = floor(random(cols));
  fRow = floor(random(rows));
  print(`fCol=${fCol} | fRow=${fRow} | cols=${cols} | rows=${rows}`);
  return createVector(fCol, fRow);
}

