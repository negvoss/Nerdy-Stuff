var circles = [];


function setup() {
  createCanvas(1500, 1500);


  /*for (var i = 0; i < 20; i++) {
      circles[i] = new Circle(Math.random()*600,Math.random()*600);
  }*/
}




function draw() {
  background(51);

  for (var i = 0; i < circles.length; i++) {
    var grow = true;
    for (var j = 0; j < circles.length; j++) {
      if (dist(circles[i].x,circles[i].y,circles[j].x,circles[j].y) < circles[i].radius + circles[j].radius && circles[i] != circles[j]) {
        grow = false;
      }
    }


    if (grow == true) {
      circles[i].grow();
    }

    circles[i].display();
  }
}



function mousePressed() {
  makeCircles()
}

function mouseDragged() {
  makeCircles()
}



function makeCircles() {
  openSpace = true;
  for (var i = 0; i < circles.length; i++) {
    circles[i].clicked();
    if (dist(circles[i].x,circles[i].y,mouseX,mouseY) < circles[i].radius) {
      openSpace = false;
    }
  }
  if (openSpace) {
    circles.push(new Circle(mouseX,mouseY));
  }
}






function keyPressed() {
  if (keyCode == 8){      //backspace
    circles.splice(random(0,circles.length),1);
  }
}
