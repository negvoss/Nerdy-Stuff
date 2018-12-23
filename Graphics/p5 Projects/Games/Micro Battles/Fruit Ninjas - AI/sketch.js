let ninja0;
let ninja1;
let platforms;
const fruit = [];
const platformWidth = 200;

function setup() {
  createCanvas(windowWidth,windowHeight);
  platforms = [
    {
      x:width/2 - platformWidth/2,
      y:height - 150
    },
    {
      x:width/2 - platformWidth/2,
      y:150
    },
    {
      x:150,
      y:height/2
    },
    {
      x:width - 150 - platformWidth,
      y:height/2
    }
  ];
  ninja0 = new Ninja(0);
  ninja1 = new Ninja(1);
  ninja0.other = ninja1;
  ninja1.other = ninja0;
}

function draw() {
  background(0,100,200);
  for (platform of platforms) {
    stroke(100,20,20);
    strokeWeight(10);
    line(platform.x,platform.y,platform.x + platformWidth,platform.y);
  }
  ninja0.update();
  ninja1.update();
  ninja0.show();
  ninja1.show();

  stroke(0);
  fill(255,0,0);
  textSize(60);
  textAlign(LEFT);
  text(ninja0.score,30,60);
  fill(0,255,0);
  textAlign(RIGHT);
  text(ninja1.score,width - 30,60);

  if (ninja0.score >= 5) {
    stroke(0);
    fill(255,0,0);
    textSize(60);
    textAlign(CENTER);
    text("Red Wins!",width/2,200);
    noLoop();
  }
  if (ninja1.score >= 5) {
    stroke(0);
    fill(0,255,0);
    textSize(60);
    textAlign(CENTER);
    text("Green Wins!",width/2,200);
    noLoop();
  }

  if (frameCount%300 == 0) {
    spawnFruit(floor(random(3)) + floor(random(2)));
  }

  for (let i = fruit.length - 1; i >= 0; i--) {
    fruit[i].update();
    fruit[i].show();
    const perp0 = createVector(ninja0.handY - ninja0.swordY,ninja0.handX - ninja0.swordX).normalize().mult(fruitR);
    const anti0 = createVector(ninja0.handY - ninja0.swordY,ninja0.handX - ninja0.swordX).normalize().mult(-fruitR);
    if (ninja0.attacking && ((intersect(fruit[i].x,fruit[i].y,perp0.x + fruit[i].x,perp0.y + fruit[i].y,ninja0.handX,ninja0.handY,ninja0.swordX,ninja0.swordY) || intersect(fruit[i].x,fruit[i].y,anti0.x + fruit[i].x,anti0.y + fruit[i].y,ninja0.handX,ninja0.handY,ninja0.swordX,ninja0.swordY)) || dist(ninja0.swordX,ninja0.swordY,fruit[i].x,fruit[i].y) <= fruitR)) {
      if (fruit[i].bomb == 0) {
        if (dist(ninja0.x + ninjaWidth/2,ninja0.y + ninjaHeight/2,fruit[i].x,fruit[i].y) < 120) {
          ninja0.die();
        }
        if (dist(ninja1.x + ninjaWidth/2,ninja1.y + ninjaHeight/2,fruit[i].x,fruit[i].y) < 120) {
          ninja1.die();
        }
      } else {
        ninja0.score++;
      }
      fruit.splice(i,1);
      break;
    }
    const perp1 = createVector(ninja1.handY - ninja1.swordY,ninja1.handX - ninja1.swordX).normalize().mult(fruitR);
    const anti1 = createVector(ninja1.handY - ninja1.swordY,ninja1.handX - ninja1.swordX).normalize().mult(-fruitR);
    if (ninja1.attacking && ((intersect(fruit[i].x,fruit[i].y,perp1.x + fruit[i].x,perp1.y + fruit[i].y,ninja1.handX,ninja1.handY,ninja1.swordX,ninja1.swordY) || intersect(fruit[i].x,fruit[i].y,anti1.x + fruit[i].x,anti1.y + fruit[i].y,ninja1.handX,ninja1.handY,ninja1.swordX,ninja1.swordY)) || dist(ninja1.swordX,ninja1.swordY,fruit[i].x,fruit[i].y) <= fruitR)) {
      if (fruit[i].bomb == 0) {
        if (dist(ninja0.x + ninjaWidth/2,ninja0.y + ninjaHeight/2,fruit[i].x,fruit[i].y) < 120) {
          ninja0.die();
        }
        if (dist(ninja1.x + ninjaWidth/2,ninja1.y + ninjaHeight/2,fruit[i].x,fruit[i].y) < 120) {
          ninja1.die();
        }
      } else {
        ninja1.score++;
      }
      fruit.splice(i,1);
      break;
    }
    if (fruit[i].recoilTimer <= 0 && fruit[i].y < 10) {
      fruit.splice(i,1);
    }
  }
  if (random(1) < 0.02) {
    ninja1.act();
  }
  for (piece of fruit) {
    if (abs(piece.x - ninja1.x) < 100 && piece.y - ninja1.y < 120 && ninja1.secondJump) {
      ninja1.act();
    }
  }
}

const spawnFruit = function(count) {
  for (let i = 0; i < count; i++) {
    fruit.push(new Fruit(random(30,width - 30),random(200,height*3/4)));
  }
}

function keyPressed() {
  if (key == "A") {
    ninja0.act();
  }
}

const intersect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
	let a1, a2, b1, b2, c1, c2;
	let r1, r2 , r3, r4;
	let denom, offset, num;
	a1 = y2 - y1;
	b1 = x1 - x2;
	c1 = (x2 * y1) - (x1 * y2);
	r3 = ((a1 * x3) + (b1 * y3) + c1);
	r4 = ((a1 * x4) + (b1 * y4) + c1);
	if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)){
		return false;
	}
	a2 = y4 - y3;
	b2 = x3 - x4;
	c2 = (x4 * y3) - (x3 * y4);
	r1 = (a2 * x1) + (b2 * y1) + c2;
	r2 = (a2 * x2) + (b2 * y2) + c2;
	if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))){
		return false;
	}
	denom = (a1 * b2) - (a2 * b1);
	if (denom === 0) {
		return true;
	}
	return true;
}

const sameSign = (a, b) => (a * b) > 0;
