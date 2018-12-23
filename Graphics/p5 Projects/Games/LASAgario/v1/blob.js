function Blob(x,y,m) {
  this.x = x;
  this.y = y;
  this.m = m;
  this.r = sqrt(this.m/PI);

  this.xdiff;
  this.ydiff;
  this.dir;

  this.speed;

  this.projectedMass = this.m;
  this.toGrow = 0;
  this.inc = 0;

  this.ejectDistance = 0;
  this.ejectHeading;

  this.update = function() {
    this.r = sqrt(this.m/PI);
    this.speed = pow(1.0001,-1*(this.m - 45445)) + 15; //https://www.desmos.com/calculator/q1blvxsttk

    this.xdiff = mouseX - (this.x - xCenter + width/2);
    this.ydiff = mouseY - (this.y - yCenter + height/2);

    this.dir = createVector(this.speed*this.xdiff/5000,this.speed*this.ydiff/5000);
    this.dir.limit(this.speed/20);
  }

  this.eat = function() {
    for (var i = 0; i < food.length; i++) {
      var current = food[i];
      if (dist(this.x,this.y,current.x,current.y) + current.r < this.r + current.r) {
        this.projectedMass += current.m;
        this.toGrow = this.projectedMass - this.m;
        this.inc = this.toGrow/60;
        food.splice(i,1);
        food.push(new Food(random(leftBound,rightBound),random(topBound,botBound)));
        return;
      }
    }
  }

  this.grow = function() {
    if (this.toGrow > 0) {
      this.m += this.inc;
      this.toGrow -= this.inc;
    } else {
      this.toGrow = 0;
      this.projectedMass = this.m;
      this.m = round(this.m);
    }
  }

  this.move = function() {
    var requestDir = this.dir;
    var moveDir;
    var zVectors = [];

    for (var i = 0; i < blobs.length; i++) {
      var other = blobs[i];
      if (other != this) {
        if (dist(this.x,this.y,other.x,other.y) < this.r + other.r) { // collide
          var a = requestDir;
          var b = createVector(this.x - other.x,this.y - other.y);
          var angle = p5.Vector.angleBetween(a,b);
          if (angle > PI/2 && angle < 3*PI) {
            var bUnit = b; // Normalized below.
            var w = bUnit.normalize().mult(p5.Vector.dot(a,b)/b.mag());
            var z = p5.Vector.sub(a,w);
            z.limit(this.speed/20);

            zVectors.push(z);
          }
        }
      }
    }
    if (zVectors.length == 0) { // no collisions
      moveDir = requestDir;
    } else {
      var xTotal = 0;
      var yTotal = 0;
      for (var i = 0; i < zVectors.length; i++) {
        var current = zVectors[i];
        xTotal += current.x;
        yTotal += current.y;
      }
      var z = createVector(xTotal/zVectors.length,yTotal/zVectors.length);

      moveDir = z;
    }
    this.x += moveDir.x;
    this.y += moveDir.y;

    if (this.ejectDistance > 0) {
      var xMove = cos(this.ejectHeading)*12;
      var yMove = sin(this.ejectHeading)*12;
      this.x += xMove;
      this.y += yMove;
      this.ejectDistance -= sqrt(pow(xMove,2) + pow(yMove,2));
    } else {
      this.ejectDistance = 0;
    }
  }

  this.show = function() {
    noStroke();
    fill(255);
    ellipse(this.x - xCenter + width/2,this.y - yCenter + height/2,this.r*2);
  }

  this.split = function() {
    if (this.m >= 3500 && blobs.length <= 16) {
      var blobToEject = new Blob(this.x,this.y,this.m/2);
      blobToEject.ejectDistance = sqrt(this.r)*32;
      blobToEject.ejectHeading = this.dir.heading();

      blobs.push(blobToEject);

      this.m = this.m/2;
    }
  }
}




/*

if (blobs.length > 1) {
  var zVectors = [];
  for (var i = 0; i < blobs.length; i++) {
    var other = blobs[i];
    if (other != this) {
      if (dist(this.x,this.y,other.x,other.y) < this.r + other.r) {
        var a = this.dir;
        var b = createVector(this.x - other.x,this.y - other.y);

        var angle = p5.Vector.angleBetween(a,b);
        if (angle > PI/2 && angle < 3*PI) {
          var bUnit = b; // Normalized below.
          var w = bUnit.normalize().mult(p5.Vector.dot(a,b)/b.mag());
          var z = p5.Vector.sub(a,w);
          z.limit(this.speed/20);

          stroke(0,255,0);
          strokeWeight(4);

          zVectors.push(z);
        } else {
          this.x += this.dir.x;
          this.y += this.dir.y;
        }
      } else {
        this.x += this.dir.x;
        this.y += this.dir.y;
      }
    }
  }
  var xTotal = 0;
  var yTotal = 0;
  for (var i = 0; i < zVectors.length; i++) {
    var current = zVectors[i];
    xTotal += current.x;
    yTotal += current.y;
  }
  var z = createVector(xTotal/zVectors.length,yTotal/zVectors.length);

  this.x += z.x;
  this.y += z.y;
} else {
  this.x += this.dir.x;
  this.y += this.dir.y;
}

if (this.ejectDistance > 0) {
  var xMove = cos(this.ejectHeading)*12;
  var yMove = sin(this.ejectHeading)*12;
  this.x += xMove;
  this.y += yMove;
  this.ejectDistance -= sqrt(pow(xMove,2) + pow(yMove,2));
} else {
  this.ejectDistance = 0;
}

*/












// line(
//   this.x - xCenter + width/2,
//   this.y - yCenter + height/2,
//   z.x*50 + this.x - xCenter + width/2,
//   z.y*50 + this.y - yCenter + height/2
// );
// stroke(255,0,0);
// line(
//   this.x - xCenter + width/2,
//   this.y - yCenter + height/2,
//   a.x*50 + this.x - xCenter + width/2,
//   a.y*50 + this.y - yCenter + height/2
// );
// stroke(0,0,255);
// line(
//   other.x - xCenter + width/2,
//   other.y - yCenter + height/2,
//   b.x*50 + other.x - xCenter + width/2,
//   b.y*50 + other.y - yCenter + height/2
// );
// stroke(255,255,0);
// line(
//   other.x - xCenter + width/2,
//   other.y - yCenter + height/2,
//   w.x*50 + other.x - xCenter + width/2,
//   w.y*50 + other.y - yCenter + height/2
// );
