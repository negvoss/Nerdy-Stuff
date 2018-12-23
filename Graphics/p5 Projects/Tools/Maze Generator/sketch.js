var grid = [];
var cellWidth = 20;
var cols;
var rows;
var current;
var next;
var stack = [];
var newCell;
var c;





function setup() {
  //cols = round(screen.width/cellWidth);
  //rows = round(screen.height/cellWidth);

  cols = 15;
  rows = 15;








  var temp = cols;
  cols = rows;
  rows = temp;


  c = createCanvas(rows*cellWidth + 1,cols*cellWidth + 1);



  for (var i = 0; i < rows; i++) {
    grid[i] = [];
    for (var j = 0; j < cols; j++) {
      grid[i][j] = new Cell(i,j);
    }
  }
  current = grid[0][0];
  current.visited = true;

  current.changeWalls(false,null,null,false)
  grid[grid.length - 1][grid[0].length - 1].changeWalls(null,false,false,null);

}



function draw() {
  //frameRate(1);

	background(255);
  //background(51);


  if (current.checkNeighbors()) {
    next = current.neighborList[round(random(0,current.neighborList.length - 1))];
    stack.push(current);


    if (next.row > current.row) {
      current.changeWalls(null,null,false,null);
      next.changeWalls(false,null,null,null);
    }

    if (next.row < current.row) {
      current.changeWalls(false,null,null,null);
      next.changeWalls(null,null,false,null);
    }

    if (next.col > current.col) {
      current.changeWalls(null,false,null,null);
      next.changeWalls(null,null,null,false);
    }

    if (next.col < current.col) {
      current.changeWalls(null,null,null,false);
      next.changeWalls(null,false,null,null);
    }

    current = next;
    current.visited = true;


  } else if (stack.length != 0) {
    newCell = stack.pop();
    current = newCell;
  }


  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j].show();
    }
  }
}






function unVisitedCells() {
  var allVisited = true;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (!grid[i][j].visited) {
        allVisited = false;
      }
    }
  }
  return !allVisited;
}













































//
