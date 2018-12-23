// initializing canvas and drawing context
let canvas;
let ctx;

// initializing sliders
let thetaIncrementSlider;
let radiusIncrementSlider;

// initializing canvas dimensions
let width;
let height;
let cx;
let cy;

// when DOM loads
window.onload = function() {
  // defining canvas and drawing context
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  // defining canvas dimensions
  width = canvas.width;
  height = canvas.height;
  cx = width/2;
  cy = height/2;

  // draw spirograph
  spirograph(15,0.5);

  // defining sliders
  thetaIncrementSlider = document.getElementById("thetaIncrement");
  thetaIncrementSlider.addEventListener("input",function() {
    spirograph(thetaIncrementSlider.value,radiusIncrementSlider.value);
  });

  radiusIncrementSlider = document.getElementById("radiusIncrement");
  radiusIncrementSlider.addEventListener("input",function() {
    spirograph(thetaIncrementSlider.value,radiusIncrementSlider.value);
  });

  draw();
}

// function to draw spirograph
const spirograph = function(thetaIncrement,radiusIncrement) {
  thetaIncrement = Number(thetaIncrement);
  radiusIncrement = Number(radiusIncrement);
  background("black");
  ctx.moveTo(cx,cy);
  theta = 0;
  r = width/2;
  x0 = width/2;
  y0 = 0;
  while(r > 0) {
    const x = r*Math.cos(theta*2*Math.PI/360);
    const y = r*Math.sin(theta*2*Math.PI/360);
    fill("hsl(" + r%360 + ",100%," + (100 - (50 + 50*(r/(width/2)))) + "%)");
    triangle(cx,cy,cx + x0,cy + y0,cx + x,cy + y);
    x0 = x;
    y0 = y;
    theta += thetaIncrement;
    r -= radiusIncrement;
  }
}

// fill color

const fill = function(color) {
  ctx.fillStyle = color;
}

const background = function(color) {
  ctx.fillStyle = color;
  ctx.moveTo(-1,-1);
  ctx.beginPath();
  ctx.lineTo(width + 1,-1);
  ctx.lineTo(width + 1,height + 1);
  ctx.lineTo(-1,height + 1);
  ctx.lineTo(-1,-1);
  ctx.closePath();
  ctx.fill();
}

const triangle = function(x0,y0,x1,y1,x2,y2) {
  ctx.moveTo(x0,y0);
  ctx.beginPath();
  ctx.lineTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.lineTo(x0,y0);
  ctx.fill();
}

let thetaDirection = 1;
let radiusDirection = 1;
const draw = function() {
  thetaIncrementSlider.value = Number(thetaIncrementSlider.value) + 0.1*thetaDirection;
  radiusIncrementSlider.value = Number(radiusIncrementSlider.value) + 0.01*radiusDirection;
  if ((Number(thetaIncrementSlider.value) >= Number(thetaIncrementSlider.max) && thetaDirection == 1) || (Number(thetaIncrementSlider.value) <= Number(thetaIncrementSlider.min) && thetaDirection == -1)) {
    thetaDirection *= -1;
  }
  if ((Number(radiusIncrementSlider.value) >= Number(radiusIncrementSlider.max) && radiusDirection == 1) || (Number(radiusIncrementSlider.value) <= Number(radiusIncrementSlider.min) && radiusDirection == -1)) {
    radiusDirection *= -1;
  }
  setTimeout(draw,16.66);
  spirograph(thetaIncrementSlider.value,radiusIncrementSlider.value);
}
