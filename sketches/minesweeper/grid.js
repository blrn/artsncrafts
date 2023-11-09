class Grid {
  constructor(xNum, yNum, numMines, gridWidth, gridHeight) {
    print(xNum, yNum);
    this.xNum = xNum;
    this.yNum = yNum;
    this.numMines = numMines;
    this.gridWidth = gridWidth || width;
    this.gridHeight = gridHeight || height;
    
    this.cells = [];
    this.gameStarted = false;
    
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
  
  revealSurrounding(x, y) {
    let c = this.cells[x][y];
    print(`revealSurrounding(${x}, ${y}) | c.superRevealed=${c.revealedSurrounding}`)
    
    if (c.revealed && c.num > 0) {
      let numFlags = this.getNumSurroundingFlags(x,y);
      if (c.num == numFlags) {
        if (c.revealedSurrounding) {
          return;
        }
        c.revealedSurrounding = true;
        // we can reveal all non flagged cells surrounding the cell using the handleClick method so if a mine is revealed it ends the game
        for (let nCell of this.getSurroundingCells(x,y)) {
          if (nCell.cell.flagged) {
            continue;
          }
          
          // nCell.cell.reveal();
          this.handleClick(nCell.x, nCell.y);
        }
      }
    }
  }
  
  handleClick(col, row) {
    let x = col;
    let y = row;
    
    if (x >= 0 && y >= 0 && x < this.xNum && y < this.yNum) {
      if (!this.gameStarted) {
        let regenCount = 0;
        while (this.cells[x][y].mine || this.cells[x][y].num > 0) {
          this.initialize();
          regenCount++;
          if (regenCount % 500 == 0) {
            print(`regenCount=${regenCount}`);
          }
          if (regenCount > 1E5) {
            break;
          }
        }
        print(`map regenerated ${regenCount} times`);
        this.gameStarted = true;
      }
      if (this.cells[x][y].revealed) {
        this.revealSurrounding(x,y);
        return;
      }
      if (this.cells[x][y].flagged) {
        return;
      }
      this.cells[x][y].reveal();
    }
    if (!this.cells[x][y].mine && this.cells[x][y].num == 0) {
      if (x > 0) {
        if (!this.cells[x-1][y].revealed) {
          this.handleClick(x-1,y);
        }
        if (y > 0) {
          if (!this.cells[x-1][y-1].revealed) {
            this.handleClick(x-1,y-1);
          }
        }
      }
      if (y > 0) {
        if (!this.cells[x][y-1].revealed) {
          this.handleClick(x,y-1);
        }
        if (x+1 < this.xNum) {
          if (!this.cells[x+1][y-1].revealed) {
            this.handleClick(x+1,y-1);
          }
        }
      }
      if (x+1 < this.xNum) {
        if (!this.cells[x+1][y].revealed) {
          this.handleClick(x+1,y);
        }

        if (y+1 < this.yNum) {
          if (!this.cells[x+1][y+1].revealed) {
            this.handleClick(x+1,y+1);
          }  
        }
      }
      if (y+1 < this.yNum) {
        if (!this.cells[x][y+1].revealed) {
          this.handleClick(x,y+1);
        }
        if (x > 0) {
          if (!this.cells[x-1][y+1].revealed) {
            this.handleClick(x-1,y+1);
          }
        }
      }
    }
  }
  
  handleClickRaw(clickX,clickY) {
    let x = floor(clickX / this.cellWidth);
    let y = floor(clickY / this.cellWidth);
    this.handleClick(x,y);
    
  }
  
  getSurroundingCells(x,y) {
    // returns a list of objects of the form {x: col, y: row, cell: cell object}
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    let localCells = []

    for (const [dx, dy] of offsets) {
      const newX = x + dx;
      const newY = y + dy;

      // Check if the new coordinates are within bounds
      if (newX >= 0 && newX < this.xNum && newY >= 0 && newY < this.yNum) {
        let o = {
          x: newX,
          y: newY,
          cell: this.cells[newX][newY]
        };
        localCells.push(o);
      }
    }
    return localCells;
    
  }
  
    
  getSurroundingMines(x, y) {
    const mines = [];

    // Define the relative coordinates of adjacent cells
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of offsets) {
      const newX = x + dx;
      const newY = y + dy;

      // Check if the new coordinates are within bounds
      if (newX >= 0 && newX < this.xNum && newY >= 0 && newY < this.yNum) {
        if (this.cells[newX][newY].mine) {
          mines.push(this.cells[newX][newY]);
        }
      }
    }

    return mines;
  }
  
  
  getNumSurroundingMines(col, row) {
    return this.getSurroundingMines().length;
  }
  
  
  getSurroundingFlags(x,y) {
    const flags = [];

    // Define the relative coordinates of adjacent cells
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of offsets) {
      const newX = x + dx;
      const newY = y + dy;

      // Check if the new coordinates are within bounds
      if (newX >= 0 && newX < this.xNum && newY >= 0 && newY < this.yNum) {
        if (this.cells[newX][newY].flagged) {
          flags.push(this.cells[newX][newY]);
        }
      }
    }

    return flags;
  }
  
  getNumSurroundingFlags(col, row) {
    return this.getSurroundingFlags(col, row).length;
  }
  
  
  
  handleDoubleClick(col, row) {
    let x = col;
    let y = row;
    if (x >= 0 && y >= 0 && x < this.xNum && y < this.yNum) {
      if (!this.cells[x][y].revealed) {
        return;
      }
      let mines = this.getSurroundingMines(x,y);
      
      
    }
  }
  
  handleDoubleClickRaw(clickX, clickY) {
    let x = floor(clickX / this.cellWidth);
    let y = floor(clickY / this.cellWidth);
    this.handleDoubleClick(x,y);
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