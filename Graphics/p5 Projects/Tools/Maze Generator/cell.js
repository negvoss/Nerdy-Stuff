function Cell(col,row) {
  this.col = col;
  this.row = row;
  this.cellWidth = cellWidth;
  this.walls = [true,true,true,true];
  this.visited = false;

  this.show = function() {
    fill(180,0,230);
    noStroke();
    if (this === current) {
      rect(
        this.col*this.cellWidth,
        this.row*this.cellWidth,
        this.cellWidth,
        this.cellWidth
      );
    }


    stroke(0);
    //stroke(255,0,255);
    strokeWeight(3);

    if (this.walls[0]) { //top
      line(
  			this.col*this.cellWidth,
  			this.row*this.cellWidth,
  			this.col*this.cellWidth + this.cellWidth,
  			this.row*this.cellWidth
  		);
    }

    if (this.walls[1]) { //right
      line(
  			this.col*this.cellWidth + this.cellWidth,
  			this.row*this.cellWidth,
  			this.col*this.cellWidth + this.cellWidth,
  			this.row*this.cellWidth + this.cellWidth
  		);
    }

    if (this.walls[2]) { //bottom
      line(
  			this.col*this.cellWidth + this.cellWidth,
  			this.row*this.cellWidth + this.cellWidth,
  			this.col*this.cellWidth,
  			this.row*this.cellWidth + this.cellWidth
  		);
    }

    if (this.walls[3]) { //left
      line(
  			this.col*this.cellWidth,
  			this.row*this.cellWidth + this.cellWidth,
  			this.col*this.cellWidth,
  			this.row*this.cellWidth
  		);
    }
  }

  this.checkNeighbors = function() {
    this.neighbors = false;
    this.neighborsToCheck = [];
    this.neighborList = [];
    if (grid[this.col][this.row - 1] != undefined) {
      this.neighborsToCheck.push(grid[this.col][this.row - 1]);
    }
    if (grid[this.col][this.row + 1] != undefined) {
      this.neighborsToCheck.push(grid[this.col][this.row + 1]);
    }
    if (grid[this.col - 1] != undefined) {
      this.neighborsToCheck.push(grid[this.col - 1][this.row]);
    }
    if (grid[this.col + 1] != undefined) {
      this.neighborsToCheck.push(grid[this.col + 1][this.row]);
    }

    for (var i = 0; i < this.neighborsToCheck.length; i++) {
      if (!this.neighborsToCheck[i].visited) {
        this.neighbors = true;
        this.neighborList.push(this.neighborsToCheck[i]);
      }
    }
    return this.neighbors;
  }
  this.changeWalls = function(top,right,bottom,left) {
    if (top != null) this.walls[0] = top;
    if (right != null) this.walls[1] = right;
    if (bottom != null) this.walls[2] = bottom;
    if (left != null) this.walls[3] = left;
  }
}








































//
