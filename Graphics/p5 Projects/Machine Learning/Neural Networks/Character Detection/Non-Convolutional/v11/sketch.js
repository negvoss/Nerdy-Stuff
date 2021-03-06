let ref;

let currentImage;
let userAnswer;

let imageResolution = 15;

const possibleOutputs = ["0","1","2","3","4","5","/","\\","♡"];
const numI = Math.pow(imageResolution,2); // number of inputs
const numO = possibleOutputs.length; // number of outputs
const lR = 0.03; // learning rate

let currentlyTraining = false;
const currentAverage = [];

let nn;
let images = [];
let trainingData = [];

let frmRt;
function setup() {
  select("#characters").html("This program differentiates between the following characters: [" + possibleOutputs + "].");
  setupFirebase();
  createCanvas(200,200).parent("#canvasContainer");
  currentImage = get();
  currentImage.resize(imageResolution,imageResolution);
  currentImage.loadPixels();
  setupControls();
  nn = new NeuralNetwork(numI,10,10,numO,lR);
}

const feedBackRate = 2;
const repsPerFrame = 400;

let timing;
let timer;
const resetTimer = function() {
  timing = false;
  timer = frmRt;
}
const startTimer = function() {
  timing = true;
}
resetTimer();

function draw() {
  frmRt = frameRate();
  if (currentlyTraining) {
    train();
  }
  if (timing) {
    timer--;
    if (timer <= 0) {
      evaluate();
      resetTimer();
    }
  }
}


let px = null;
let py = null;
let currentlyDrawing;
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (!timing) background(255);
    currentlyDrawing = true;
    resetTimer();
    fill(0);
    noStroke();
    ellipse(mouseX,mouseY,width/imageResolution);
    px = mouseX;
    py = mouseY;
  }
}
function mouseDragged() {
  if (currentlyDrawing) {
    resetTimer();
    stroke(0);
    strokeWeight(width/imageResolution);
    line(mouseX,mouseY,px,py);
    px = mouseX;
    py = mouseY;
  }
}

function mouseReleased() {
  if (currentlyDrawing) {
    startTimer();
  }
}

const evaluate = function() {
  noSmooth();
  currentImage = get();
  currentImage.loadPixels();
  background(255);
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  for (let i = 0; i < currentImage.pixels.length; i += 4) {
    const x = (i/4)%currentImage.width;
    const y = ((i/4) - x)/currentImage.width;
    if (round(currentImage.pixels[i]/255) == 0) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX-minX < 2*width/imageResolution) {
    maxX += width/imageResolution;
    minX -= width/imageResolution;
    maxX = Math.min(maxX,width);
    minX = Math.max(minX,0);
  }
  if (maxY-minY < 2*height/imageResolution) {
    maxY += height/imageResolution;
    minY -= height/imageResolution;
    maxY = Math.min(maxY,height);
    minY = Math.max(minY,0);
  }
  currentImage = currentImage.get(minX,minY,maxX - minX,maxY - minY);
  currentImage.loadPixels();
  currentImage.resize(imageResolution,imageResolution);
  currentImage.updatePixels();
  image(currentImage,0,0,width,height);

  const input = new Matrix(numI,1);
  for (let i = 0; i < currentImage.pixels.length; i += 4) {
    input.matrix[i/4][0] = round(currentImage.pixels[i]/255);
  }
  const o = nn.feedForward(input);
  let result;
  let max = 0;
  let id;
  for (let i = 0; i < o.rows; i++) {
    if (o.matrix[i][0] > max) {
      max = o.matrix[i][0];
      id = i;
    }
  }
  result = possibleOutputs[id];
  select("#result").html("Result: " + result);
  px = null;
  py = null;
  currentlyDrawing = false;
}

const train = function() {
  for (let i = 0; i < repsPerFrame; i++) {
    nn.train();
    currentAverage.push(abs(nn.outputError.matrix[0][0]) + abs(nn.outputError.matrix[1][0]) + abs(nn.outputError.matrix[2][0]));
    if (currentAverage.length > repsPerFrame/feedBackRate) {
      currentAverage.splice(0,1);
    }
  }
  if (frameCount % round(60/feedBackRate) == 0) {
    let sum = 0;
    for (let j = 0; j < currentAverage.length; j++) {
      sum += currentAverage[j];
    }
    const roundedSum = round((10000*sum)/currentAverage.length)/100;
    select("#trainingError").html("Current Training Error: " + roundedSum + "%");
  }
}

const setupControls = function() {
  select("#defaultCanvas0").elt.style.border = "solid";
  const toggleTraining = select("#toggleTraining");
  toggleTraining.mousePressed(function() {
    currentlyTraining = !currentlyTraining;
    if (toggleTraining.html() == "Start Training") {
      toggleTraining.html("Stop Training");
    } else {
      toggleTraining.html("Start Training");
    }
  });
  select("#addToTraining").mousePressed(function() {
    ref.push({
      pixels:currentImage.pixels,
      output:Number(possibleOutputs.indexOf(userFeedback.value()))
    });
  });
  let userFeedback = select("#userFeedback");
  for (let i = 0; i < possibleOutputs.length; i++) {
    userFeedback.option(possibleOutputs[i]);
  }
}

const setupTrainingData = function() {
  for (let i = 0; i < images.length; i++) {
    const img = images[i].image;
    const input = new Matrix(numI,1);
    for (let j = 0; j < img.pixels.length; j += 4) {
      input.matrix[j/4][0] = round(img.pixels[j]/255);
    }
    const output = new Matrix(numO,1);
    output.matrix[images[i].output][0] = 1;
    trainingData.push({
      input:input,
      output:output
    });
  }
}

const setupFirebase = function() {
  const config = {
    apiKey: "AIzaSyBQXMJXzni2ALbPU18r245SeemD5HVcC84",
    authDomain: "character-recognition-f5124.firebaseapp.com",
    databaseURL: "https://character-recognition-f5124.firebaseio.com",
    projectId: "character-recognition-f5124",
    storageBucket: "",
    messagingSenderId: "91030421727"
  };
  firebase.initializeApp(config);
  const database = firebase.database();
  ref = database.ref("training");

  ref.on("value",function(data) {
    noSmooth();
    images = [];
    trainingData = [];
    data = data.val();
    if (data) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        const key = Object.keys(data)[i];
        const img = createImage(imageResolution,imageResolution);
        img.loadPixels();
        for (let j = 0; j < data[key].pixels.length; j++) {
          img.pixels[j] = data[key].pixels[j];
        }
        img.updatePixels();
        const output = data[key].output;
        images.push({
          image:img,
          output:output
        });
      }
    }
    setupTrainingData();
  },function(err) {
    console.log(err);
  });
}
