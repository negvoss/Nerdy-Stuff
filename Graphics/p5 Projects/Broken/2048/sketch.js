var grid = [];
var rows = 4;
var cols = 4;
var cellWidth = 140;


function setup() {
  createCanvas(cols*cellWidth + 4, rows*cellWidth + 4);
  background(200);
  createGrid();


  var t = new Tile(0,0,2);
  var t2 = new Tile(3,2,2);

}

function draw() {
  showCells();
}





function createGrid() {
  for (var i = 0; i < rows; i++) {
    grid[i] = [];
    for (var j = 0; j < cols; j++) {
      grid[i].push(new Cell(i,j));
    }
  }
}


function showCells() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j].show();
    }
  }
}


function keyPressed() {
  if (keyCode == UP_ARROW) move(0,-1);
  if (keyCode == RIGHT_ARROW) move(1,0);
  if (keyCode == DOWN_ARROW) move(0,1);
  if (keyCode == LEFT_ARROW) move(-1,0);
  addTile();
}


function move(x,y) {
  if (x == 0 && y == -1) {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (grid[i][j].occupant != undefined) {
          grid[i][j].occupant.move(x,y);
        }
      }
    }
  }

  if (x == 1 && y == 0) {
    for (var i = rows; i > 0; i--) {
      for (var j = 0; j < cols; j++) {
        if (grid[i][j].occupant != undefined) {
          grid[i][j].occupant.move(x,y);
        }
      }
    }
  }

  if (x == 0 && y == 1) {
    for (var i = 0; i < rows; i++) {
      for (var j = cols; j > 0; j--) {
        if (grid[i][j].occupant != undefined) {
          grid[i][j].occupant.move(x,y);
        }
      }
    }
  }

  if (x == -1 && y == 0) {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (grid[i][j].occupant != undefined) {
          grid[i][j].occupant.move(x,y);
        }
      }
    }
  }
}


function addTile() {
  var possibilities = [];

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (grid[i][j].occupant == undefined) {
        possibilities.push(grid[i][j]);
      }
    }
  }
  var spawnPoint = random(possibilities);
  grid[spawnPoint.col][spawnPoint.row].occupant = new Tile(spawnPoint.col,spawnPoint.row,2);
}
