var particles = [];
var bu;
var bu2;
var s;
var inp;
var bcolor = 30;
var csize = 80;


function setup() {
  createCanvas(screen.width,screen.height);
  bu2 = createButton("CLEAR");
  bu = createButton("ADD PARTICLE");
  inp = createInput();
  s = createSlider(1,3,1);
  bu.mousePressed(newParticles);
  bu2.mousePressed(setb);
}

function draw() {
  //frameRate(s.value());
  translate(width/2,height/2);
  background(bcolor,20);
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].pos.mag() > csize){
      particles[i].show();
      particles[i].move();
    }
    else {
      particles.splice(i,1);
      //csize += 0.05
      newParticle();
    }
  }
}

function mouseDragged() {
  particles.push(new Particle(mouseX - width/2,mouseY - height/2))
}



function newParticle() {
  particles.push(new Particle(random(-width/2,width/2),random(-height/2,height/2)));
}


function newParticles() {
  for (var i = 0; i < inp.value(); i++) {
    newParticle();
  }
}



function setb() {
    background(bcolor);
    csize = 80;
    particles = [];
}































//
