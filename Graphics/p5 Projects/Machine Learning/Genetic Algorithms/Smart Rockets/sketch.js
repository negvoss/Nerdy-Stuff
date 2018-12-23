var rockets = [];
var count = 0;
var generation = 1;
var lifeSpan = 600;
var target;
var barrierW;
var barrierH;
var barrierX;
var barrierY;


function setup() {
  createCanvas(windowWidth,windowHeight);
  for (var i = 0; i < 500; i++) {
    rockets[i] = new Rocket();
  }
  target = createVector(20,height/2);
  barrierW = width/2;
  barrierH = height/8;
  barrierX = width/2 - barrierW/2;
  barrierY = height/2 - barrierH/2;
}

function draw() {
  background(0);
  runGeneration();
  show();
}

function showTarget() {
  fill(255,0,0);
  noStroke();
  ellipse(target.x,target.y,50);
}

function showBarrier() {
  fill(200);
  stroke(255,0,0);
  strokeWeight(1.5);
  rect(barrierX,barrierY,barrierW,barrierH);
}

function showTimer() {
  textSize(30);
  textAlign(LEFT);
  fill(200);
  noStroke();
  text(lifeSpan - count,0,height - 10);
}

function showGenerationNumber() {
  textSize(30);
  textAlign(RIGHT);
  fill(200);
  noStroke();
  text("Generation " + generation,width,height - 10);
}

function runGeneration() {
  update();
  checkRestart();
}

function update() {
  for (var i = 0; i < rockets.length; i++) {
    rockets[i].update();
  }
}

function show() {
  showTarget();
  showBarrier();
  showTimer();
  showGenerationNumber();
  for (var i = 0; i < rockets.length; i++) {
    rockets[i].show();
  }
}

function checkRestart() {
  count++;
  var allFinished = true;
  for (var i = 0; i < rockets.length; i++) {
    if (!(rockets[i].crashed || rockets[i].success)) {
      allFinished = false;
      break;
    }
  }
  if (count == lifeSpan || allFinished) {
    reproduce();
    count = 0;
    generation++;
  }
}

function reproduce() {
  for (var i = 0; i < rockets.length; i++) {
    rockets[i].evaluateFitness();
  }
  var genePool = [];
  var totalFitness = 0;
  for (var i = 0; i < rockets.length; i++) {
    totalFitness += rockets[i].fitness;
  }
  for (var i = 0; i < rockets.length; i++) {
    var rank = rockets[i].fitness/totalFitness;
    for (var j = 0; j < round(rockets.length*rank); j++) {
      genePool.push(rockets[i].dna);
    }
  }
  for (var i = 0; i < rockets.length; i++) {
    rockets[i] = new Rocket(crossOver(random(genePool),random(genePool)));
  }
}

function crossOver(dna1,dna2) {
  var newDna = [];
  for (var i = 0; i < lifeSpan; i++) {
    if (random(1) >= 0.5) {
      newDna[i] = dna1[i];
    } else {
      newDna[i] = dna2[i];
    }
    if (random(1) < 0.01) {
      newDna[i] = p5.Vector.random2D().setMag(0.3); // mutation
    }
  }
  return newDna;
}

function keyPressed() {
  if (key == " ") { // skip generation
    while (count != 0) {
      runGeneration();
    }
  }
}
