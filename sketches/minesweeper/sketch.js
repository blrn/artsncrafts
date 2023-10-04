let grid;
let restartButton;
let widthInput;
let heightInput;


class Cell {
  constructor(x, y, width, mine, revealed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.num = 0;
    this.flagged = false;
    
    if (mine === undefined) {
      this.mine = false;
    } else {
      this.mine = mine;
    }
    
    if (revealed === undefined) {
      this.revealed = false
    } else {
      this.revealed = revealed;
    }
  }
  
  reveal() {
    this.revealed = true;
  }   
  
  toggleFlag() {
    print("flag");
    this.flagged = !this.flagged;
  }
  
  draw() {
    const mineDiameter = this.width * 0.8;
    push();
    if (this.flagged) {
      fill("indianred")
    } else if (this.revealed && this.mine) {
      fill("red");
    } else if (this.revealed) {
      fill("white");
    } else {
      fill("lightgray");
    }
    rect(this.x, this.y, this.width, this.width);
    pop();
    
    if (this.num > 0 && !this.mine && this.revealed) {
      push();
      fill("red");
      textSize(this.width*0.8);
      text(`${this.num}`, this.x+this.width/4,this.y+(this.width*0.7));
      pop();
    } 
  }
  
  
}

class Grid {
  constructor(xNum, yNum, numMines, gridWidth, gridHeight) {
    print(xNum, yNum);
    this.xNum = xNum;
    this.yNum = yNum;
    this.numMines = numMines;
    this.gridWidth = gridWidth || width;
    this.gridHeight = gridHeight || height;
    
    this.cells = [];
    
    this.initialize();
  }
  
  get cellWidth() {
    return min(this.gridWidth / this.xNum, this.gridHeight/this.yNum);
  }
  
  initialize() {
    let cWidth = this.cellWidth;
    this.cells = [];
    for (let x = 0; x < this.xNum; x++) {
      let col = [];
      for (let y = 0; y < this.yNum; y++) {
        col.push(new Cell(x*cWidth, y*cWidth, cWidth));
      }
      this.cells.push(col);
    }
    
    // pick the mines
    let cNumMines = 0;
    while (cNumMines < this.numMines) {
      let mineX = floor(random(this.xNum));
      let mineY = floor(random(this.yNum));
      print(this.cells);
      print(mineX);
      print(mineY);
      if (!this.cells[mineX][mineY].mine) {
        this.cells[mineX][mineY].mine = true;
        cNumMines++;
      }
    }
    
    // set the numbers for cells
    for (let x = 0; x < this.xNum; x++) {
      for (let y = 0; y < this.yNum; y++) {
        if (this.cells[x][y].mine) {
          continue;
        }
        let num = 0;
        if (x > 0) {
          num += this.cells[x-1][y].mine ? 1: 0;
          if (y > 0) {
            num += this.cells[x-1][y-1].mine ? 1 : 0;
          }
        }
        if (y > 0) {
          num += this.cells[x][y-1].mine?1:0;
          if (x+1 < this.xNum) {
            num += this.cells[x+1][y-1].mine?1:0;
          }
        }
        if (x+1 < this.xNum) {
          num += this.cells[x+1][y].mine? 1:0;
          
          if (y+1 < this.yNum) {
            num += this.cells[x+1][y+1].mine?1:0;
          }
        }
        if (y+1 < this.yNum) {
          num += this.cells[x][y+1].mine? 1:0;
          if (x > 0) {
            num += this.cells[x-1][y+1].mine? 1: 0;
          }
        }
        this.cells[x][y].num = num;
      }
    }
  }
  draw() {
    for (let col of this.cells) {
      for (let cell of col) {
        cell.draw();
      }
    }
  }
  
  handleClick(col, row) {
    let x = col;
    let y = row;
    if (x >= 0 && y >= 0 && x < this.xNum && y < this.yNum) {
      if (this.cells[x][y].revealed) {
        return;
      }
      if (this.cells[x][y].flagged) {
        return;
      }
      this.cells[x][y].reveal();
    }
    if (!this.cells[x][y].mine && this.cells[x][y].num == 0) {
      if (x > 0) {
        this.handleClick(x-1,y);
        if (y > 0) {
          this.handleClick(x-1,y-1);
        }
      }
      if (y > 0) {
        this.handleClick(x,y-1);
        if (x+1 < this.xNum) {
          this.handleClick(x+1,y-1);
        }
      }
      if (x+1 < this.xNum) {
        this.handleClick(x+1,y);

        if (y+1 < this.yNum) {
          this.handleClick(x+1,y+1);
        }
      }
      if (y+1 < this.yNum) {
        this.handleClick(x,y+1);
        if (x > 0) {
          this.handleClick(x-1,y+1);
        }
      }
    }
  }
  
  handleClickRaw(clickX,clickY) {
    let x = floor(clickX / this.cellWidth);
    let y = floor(clickY / this.cellWidth);
    this.handleClick(x,y);
    
  }
  
  handleRightClick(col, row) {
    let x = col;
    let y = row;
    print("right click", x,y);
    
    if (x >= 0 && y >= 0 && x < this.xNum && y < this.yNum) {
      let cell = this.cells[x][y];
      if (!cell.revealed) {
        cell.toggleFlag();
      }
    }
    
    

  }
  
  handleRightClickRaw(clickX, clickY) {
    let x = floor(clickX / this.cellWidth);
    let y = floor(clickY / this.cellWidth);
    this.handleRightClick(x,y);
  }
}

function mouseClicked(ev) {
  let clickX = ev.clientX;
  let clickY = ev.clientY;
  
  if (clickX >= 0 && clickY >= 0 && clickX < grid.gridWidth && clickY < grid.gridHeight) {
    grid.handleClickRaw(ev.clientX, ev.clientY);
  } else {
    print("click outside of grid");
  }
  ev.preventDefault();
}

function mouseRightClicked(ev) {
  grid.handleRightClickRaw(ev.clientX,ev.clientY);
}

function reset() {
  print(heightInput.value(), typeof heightInput.value())
  let numCellsX = parseInt(widthInput.value());
  let numCellsY = parseInt(heightInput.value());
  print("numCellsX", numCellsX);
  let cellWidth = min(width / numCellsX, height / numCellsY);
  grid = new Grid(numCellsX,numCellsY,15);
  grid.draw();
}

function restartButtonClicked() {
  print("restart button clicked")
  reset();
}

function setup() {
  createCanvas(400, 400);
  restartButton = createButton("New Game!");
  restartButton.mouseClicked(restartButtonClicked);
  let widthInputDiv = createDiv("Width:");
  widthInput = createInput(10, "number");
  widthInput.parent = widthInputDiv;
  
  let heightInputDiv = createDiv("Height:");
  heightInput = createInput(10, "number");
  heightInput.parent = heightInputDiv;
  
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      mouseRightClicked(e);
      
    });
  }
  reset();
}

function draw() {
  background(220);
  grid.draw();
}