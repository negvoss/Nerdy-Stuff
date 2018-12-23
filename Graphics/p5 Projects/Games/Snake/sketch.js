var dimension = 50;
var w = 8;
var grid = new Array(dimension);
var s;
var twomoves;



function setup() {
  frameRate(20);
  width = w;
  createCanvas(dimension*width,dimension*width);
  width = w;
  for (var i = 0; i < dimension; i++) {
    grid[i] = new Array(dimension);
    for (var j = 0; j < dimension; j++) {
      grid[i][j] = new Cell(i,j,width);
    }
  }
  s = new Snake(round(random(dimension*1/3,dimension*2/3)),round(random(dimension*1/3,dimension*2/3)));
  createFood();
}




function draw() {
  background(0);
  for (var i = 0; i < dimension; i++) {
    for (var j = 0; j < dimension; j++) {
      grid[i][j].show();
    }
  }
  s.move();
  twomoves = false;
}




function keyPressed() {
  if (twomoves == false){
    twomoves = true;
    if (keyCode === UP_ARROW && s.dir[1] != 1) {
      s.dir = [0,-1];
    }
    else if (keyCode === DOWN_ARROW && s.dir[1] != -1) {
      s.dir = [0,1];
    }
    else if (keyCode === RIGHT_ARROW && s.dir[0] != -1) {
      s.dir = [1,0];
    }
    else if (keyCode === LEFT_ARROW && s.dir[0] != 1) {
      s.dir = [-1,0];
    }
  }
}

function createFood() {
  var x = floor(random(dimension));
  var y = floor(random(dimension));
  grid[x][y].food = true;
}
