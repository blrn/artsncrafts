let grid;
let restartButton;
let widthInput;
let heightInput;
let numMinesInput;





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

function doubleClicked(ev) {
  let clickX = ev.clientX;
  let clickY = ev.clientY;
  
  if (clickX >= 0 && clickY >= 0 && clickX < grid.gridWidth && clickY < grid.gridHeight) {
    grid.handleDoubleClickRaw(ev.clientX, ev.clientY);
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
  let numMines = parseInt(numMinesInput.value());
  print("numCellsX", numCellsX);
  let cellWidth = min(width / numCellsX, height / numCellsY);
  grid = new Grid(numCellsX,numCellsY,numMines);
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
  
  let numMinesDiv = createDiv("Number of Mines:");
  numMinesInput = createInput(15);
  
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