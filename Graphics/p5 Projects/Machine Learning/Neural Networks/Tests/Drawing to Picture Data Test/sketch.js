var px;
var py;

var training = [];

function setup() {
  createCanvas(8,8).parent("#canvasContainer");
  background(0);
  select("#clearBackground").mousePressed(function() {
    background(0);
  });
  select("#addToTraining").mousePressed(function() {
    loadPixels();
    var data = [];
    for (var i = 0; i < pixels.length; i += 4) {
      data.push(round((pixels[i] + pixels[i + 1] + pixels[i + 2])/765));
    }
    training.push({
      input:data,
      answer:Number(select("#number").value())
    });
    background(0);
    console.log("Added Data");
  });
  select("#saveTraining").mousePressed(function() {
    saveJSON(training,"training.json",true);
  });
}

function mouseDragged() {
  stroke(255);
  line(mouseX,mouseY,px,py,10);
  px = mouseX;
  py = mouseY;
}

function mouseReleased() {
  px = undefined;
  py = undefined;
}
