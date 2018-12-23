var grid = [];
var cols = 10;
var rows = 10;
var cellWidth = 65;
var particles = [];



function setup() {
  createCanvas(cols*cellWidth + 1,rows*cellWidth + 1);
  createGrid();
}

function draw() {
  frameRate(30);
	background(255,4);

  createParticles(50);
  updateCells();
  //showCells();
  showParticles();
}



function createGrid() {
  for (var i = 0; i < cols; i++) {
    grid[i] = [];
    for (var j = 0; j < rows; j++) {
      grid[i][j] = (new Cell(i,j,1,map(i,0,cols,0,TWO_PI) + map(j,0,rows,0,TWO_PI)));
    }
  }
}

function createParticles(count) {
  for (var i = 0; i < count; i++) {
    particles.push(new Particle(random(width),random(height)));
  }
}

function showParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var current = particles[i];
    if (current.pos.x < 10 || current.pos.x > width - 10 || current.pos.y < 10 || current.pos.y > height - 10)
      particles.splice(i,1);

    current.show();
    current.update();
  }
}


function updateCells() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].update();
    }
  }
}

function showCells() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}


// function mouseDragged() {
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     particles.push(new Particle(mouseX,mouseY));
//   }
// }
