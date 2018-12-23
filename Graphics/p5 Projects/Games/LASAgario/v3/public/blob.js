function Blob(x,y,m,c) {
  this.id = socket.id + "-" + idCounter.toString();
  idCounter++;

  this.x = x;
  this.y = y;
  this.m = m;
  this.col = c;
  this.r = sqrt(this.m/PI);
  
  var data = {
    id:this.id,
    x:this.x,
    y:this.y,
    m:this.m,
    rValue:this.col._getRed(),
    gValue:this.col._getGreen(),
    bValue:this.col._getBlue(),
    r:this.r
  }

  socket.emit("addBlob",data);


  this.convergeTime = this.m*0.5;
  this.countingDown = true;

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
    if (this.m < 1000) {
      this.m = 1000;
    }
    this.r = sqrt(this.m/PI);
    this.speed = pow(1.0001,-1*(this.m - 45445)) + 15; //https://www.desmos.com/calculator/q1blvxsttk

    this.xdiff = mouseX - (this.x - xCenter + width/2);
    this.ydiff = mouseY - (this.y - yCenter + height/2);

    this.dir = createVector(this.speed*this.xdiff/5000,this.speed*this.ydiff/5000);
    this.dir.limit(this.speed/20);

    if (this.convergeTime <= 0) {
      this.countingDown = false;
    }

    if (this.countingDown) {
      this.convergeTime--;
    } else {
      this.convergeTime = this.m*0.5;
    }

    var data = {
      id:this.id,
      x:this.x,
      y:this.y,
      m:this.m,
      r:this.r,
    }
    socket.emit("blobInfo",data);
  }

  this.eat = function() {
    for (var i = 0; i < food.length; i++) {
      var current = food[i];
      if (dist(this.x,this.y,current.x,current.y) < this.r) {
        this.projectedMass += current.m;
        this.toGrow = this.projectedMass - this.m;
        this.inc = this.toGrow/60;
        var data = {
          index:i
        }
        socket.emit("delFood",data);
        var data = {
          x:random(leftBound,rightBound),
          y:random(topBound,botBound),
          r:random(255),
          g:random(255),
          b:random(255)
        }
        socket.emit("createFood",data);
        return;
      }
    }
    for (var i = 0; i < blobs.length; i++) {
      var other = blobs[i];
      if (other != this) {
        if (!this.countingDown && !other.countingDown) {
          if (dist(this.x,this.y,other.x,other.y) < this.r*0.8) {
            this.projectedMass += other.m;
            this.toGrow = this.projectedMass - this.m;
            this.inc = this.toGrow/60;
            blobs.splice(i,1);

            var data = {
              id:other.id
            }
            socket.emit("blobDestroy",data);

            this.countingDown = true;
            return;
          }
        }
      }
    }
    for (var i = 0; i < otherClientBlobs.length; i++) {
      var other = otherClientBlobs[i];
      if (this.m > other.m * 1.2 && dist(this.x,this.y,other.x,other.y) < this.r*0.8) {
        this.projectedMass += other.m;
        this.toGrow = this.projectedMass - this.m;
        this.inc = this.toGrow/60;
        otherClientBlobs.splice(i,1);

        var data = {
          id:other.id
        }
        socket.emit("blobDestroy",data);
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
    var wVectors = [];

    for (var i = 0; i < blobs.length; i++) {
      var other = blobs[i];
      if (other != this) {
        if (dist(this.x,this.y,other.x,other.y) < this.r + other.r) { // collide
          if (this.countingDown || other.countingDown) {
            var a = requestDir;
            var b = createVector(this.x - other.x,this.y - other.y);
            var angle = p5.Vector.angleBetween(a,b);
            if (angle > PI/2 && angle < 3*PI) {
              var bUnit = b; // Normalized below.
              var gap = abs(dist(this.x,this.y,other.x,other.y) - (this.r + other.r));
              var w = bUnit.normalize().mult(p5.Vector.dot(a,b)/b.mag()*gap/10);

              wVectors.push(w);
            }
          }
        }
      }
    }
    if (wVectors.length == 0) { // no collisions
      moveDir = requestDir;
    } else {
      var xTotal = 0;
      var yTotal = 0;
      for (var i = 0; i < wVectors.length; i++) {
        var current = wVectors[i];
        xTotal += current.x;
        yTotal += current.y;
      }
      var z = p5.Vector.sub(requestDir,createVector(xTotal/wVectors.length,yTotal/wVectors.length));
      z.limit(this.speed/20);

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
    fill(this.col);
    ellipse(this.x - xCenter + width/2,this.y - yCenter + height/2,this.r*2);
  }

  this.split = function() {
    if (this.m >= 3500 && blobs.length <= 16) {
      var blobToEject = new Blob(this.x,this.y,this.m/2,this.col);
      blobToEject.ejectDistance = sqrt(this.r)*32;
      blobToEject.ejectHeading = this.dir.heading();

      blobs.push(blobToEject);

      this.m = this.m/2;
    }
  }
}
