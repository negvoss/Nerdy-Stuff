var ball;
var p1;
var p2;
var score1 = 0;
var score2 = 0;



function setup() {
  createCanvas(screen.width,screen.height);
  noStroke();
  fill(255);


  ball = {
    x: 0,
    y: 0,
    xspeed: 0,
    yspeed: 0,
    update: function() {
      this.x += this.xspeed;
      this.y += this.yspeed;

      if (this.x < p1.x + 20) {
        if (this.y > p1.y && this.y < p1.y + p1.len) {
          this.xspeed *= -1;
        }
      }

      if (this.x > p2.x) {
        if (this.y > p2.y && this.y < p2.y + p2.len) {
          this.xspeed *= -1;
        }
      }

      if (this.x > width - 25) {
        score1++;
        this.reset();
      }

      if (this.x < 25) {
        score2++;
        this.reset();
      }


      if (this.y + this.yspeed > height || this.y + this.yspeed < 0) this.yspeed *= -1;
    },
    reset: function() {
      this.x = width/2;
      this.y = height/2;
      this.xspeed = 8;
      this.yspeed = random(-1,1);
      if (round(random(0,1)) == 1) this.xspeed *= -1;
    },

    show: function() {
      fill(255,255,0);
      ellipse(this.x,this.y,25,25);
    }
  };

  p1 = new Paddle(20);
  p2 = new Paddle(width - 40);


  ball.reset();

}

function draw() {

  background(51);


  ball.update();
  p1.update();
  p2.update();
  ball.show();
  p1.show();
  p2.show();


  textSize(80);
  fill(255,0,255);
  text(score1,width/2 - 180,100);
  text(score2,width/2 + 150,100);

  //if (frameCount % 120 == 0) {
    //var randLength = random(40,350);
    //p1.len = randLength;
    //p2.len = randLength
  //}


}



function Paddle(x) {
  this.len = 200;
  this.x = x;
  this.y = height/2 - this.len/2;
  this.yspeed = 0;
  this.update = function() {
    this.y += this.yspeed;
    if (this.y > height && this.yspeed > 0) {
      this.y = -this.len;
    }
    if (this.y + this.len < 0 && this.yspeed < 0) {
      this.y = height;
    }
  }
  this.show = function() {
    fill(0,255,0);
    rect(this.x,this.y,20,this.len);
  }
}



function keyPressed() {
  if (key == "W") p1.yspeed = -8;
  if (key == "S") p1.yspeed = 8;
  if (keyCode == UP_ARROW) p2.yspeed = -8;
  if (keyCode == DOWN_ARROW) p2.yspeed = 8;
}
































//
