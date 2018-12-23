var board = [];
var squareWidth = 30;
var cols = 11;
var rows = 19;
var black = 0;


function setup() {
  createCanvas(1000,800);
  background(255);
  stroke(0);
  strokeWeight(2);
  translate(200,200);

  for (var i = 0; i < cols; i++) {
    board[i] = [];
    var offset = random(-70,70);


    for (var j = 0; j < rows; j++) {
      black = abs(black-1);
      board[i].push(new Square(j,i,255*black));
      board[i][j].x += offset;
      board[i][j].show();
    }
  }
}
