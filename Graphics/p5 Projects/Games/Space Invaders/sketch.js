var player;
var rows = [];
var bullets = [];

var shipWidth = 70
var shipHeight = 25;
var bulletWidth = 10

var moveSpeed = 8;
var bulletSpeed = 10;

var invaderCount = 10;
var oscillations = 8;




function setup() {
  createCanvas(window.displayWidth,window.innerHeight);
  rectMode(CENTER);
  textAlign(CENTER);

  createPlayer();
  createInvaders();
}


function draw() {
  background(51,200);
  update();
  showHealth();
  if (frameCount%180 == 0) {
    player.cooldown = true;
  }
}


































function createPlayer() {
  player = {
    x:width/2,
    y:height - 30,
    health:100,
    cooldown:true,
    show:function() {
      noStroke();
      fill(0,255,0);
      rect(this.x,this.y - shipHeight/2,shipWidth,50);
    },
    move:function() {
      if (keyIsDown(RIGHT_ARROW) && this.x + shipWidth/2 <= width) this.x += moveSpeed;
      if (keyIsDown(LEFT_ARROW) && this.x - shipWidth/2 >= 0) this.x -= moveSpeed;
    },
    shoot:function() {
      bullets.push(new Bullet(this.x,this.y - shipHeight,"player"));
    }
  };
}

function createInvaders() {
  for (var i = 0; i < 5; i++) {
    rows.push(new Row(width/(invaderCount + 2),30*i + 60));
    rows[i].createInvaders();
  }
}

function hitInvaders() {
  for (var i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].type == "player") {
      for (var j = 0; j < rows.length; j++) {
        for (var k = 0; k < rows[j].invaders.length; k++) {
          if (bullets[i].x >= rows[j].invaders[k].x - shipWidth/2 && bullets[i].x <= rows[j].invaders[k].x + shipWidth/2 && bullets[i].y >= rows[j].invaders[k].y - shipHeight/2 && bullets[i].y <= rows[j].invaders[k].y + shipHeight/2) {
            rows[j].invaders.splice(k,1);
            bullets.splice(i,1);
            return;
          }
        }
      }
    }
  }
}

function hitPlayer() {
  for (var i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].type == "invader") {
      if (bullets[i].x >= player.x - shipWidth/2 && bullets[i].x <= player.x + shipWidth/2 && bullets[i].y >= player.y - shipHeight/2 && bullets[i].y <= player.y + shipHeight/2) {
        player.health -= 20;
        bullets.splice(i,1);
        return;
      }
    }
  }
}

function showHealth() {
  noStroke();
  fill(255-player.health*2.5,player.health*2.5,0);
  rectMode(CORNER);
  rect(0,height - 25,player.health*2,25);
  stroke(255);
  noFill();
  rect(0,height - 25,200,25);
  rectMode(CENTER);
}


function update() {
  player.show();
  player.move();

  for (var i = 0; i < rows.length; i++) {
    rows[i].update();
    rows[i].show();
    rows[i].move();
  }

  for (var i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].move();
  }
  hitInvaders();
  hitPlayer();

  if (player.health <= 0) {
    noStroke();
    fill(200);
    textSize(200);
    background(51);
    text("YOU DIED",width/2,height/2);
    noLoop();
  }
}




function keyPressed() {
  if (player.cooldown && key == " ") {
    player.shoot();
    player.cooldown = false;
  }
}
































//
