let snake0;
let snake1;

function setup() {
  createCanvas(windowWidth,windowHeight);
  snake0 = new Snake(0);
  snake1 = new Snake(1);
}

function draw() {
  background(0);
  snake0.update();
  snake1.update();
  snake0.show();
  snake1.show();
}

function keyPressed() {
  if (key == "A") {
    snake0.direction *= -1;
    snake0.angle += PI;
    snake0.centerX = snake0.x - snake0.centerX + snake0.x;
    snake0.centerY = snake0.y - snake0.centerY + snake0.y;
  }
  if (key == "L") {
    snake1.direction *= -1;
    snake1.angle += PI;
    snake1.centerX = snake1.x - snake1.centerX + snake1.x;
    snake1.centerY = snake1.y - snake1.centerY + snake1.y;
  }
}

function keyReleased() {
  if (key == "A") {
    snake0.direction *= -1;
    snake0.angle += PI;
    snake0.centerX = snake0.x - snake0.centerX + snake0.x;
    snake0.centerY = snake0.y - snake0.centerY + snake0.y;
  }
  if (key == "L") {
    snake1.direction *= -1;
    snake1.angle += PI;
    snake1.centerX = snake1.x - snake1.centerX + snake1.x;
    snake1.centerY = snake1.y - snake1.centerY + snake1.y;
  }
}
