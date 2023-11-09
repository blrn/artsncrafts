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
    
    this.revealedSurrounding = false;
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