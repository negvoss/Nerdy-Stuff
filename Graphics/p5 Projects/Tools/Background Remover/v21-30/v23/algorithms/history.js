var hist = []; // history of images
var histIndex = -1; // index of history (starts at -1 because there are no images to start)
var undoButton;
var redoButton;

function setupHistoryJS() {
  undoButton = select("#undoButton");
  redoButton = select("#redoButton");
  undoButton.mousePressed(undo);
  redoButton.mousePressed(redo);
}

function undo() {
  if (histIndex > 0) {
    histIndex--;
    img = hist[histIndex].get();
    img.loadPixels();
    if (img.width != hist[histIndex + 1].get().width || img.height != hist[histIndex + 1].get().height) {
      drawImage(true);
    } else {
      drawImage(false);
    }
  }
}

function redo() {
  if (histIndex < hist.length - 1) {
    histIndex++;
    img = hist[histIndex].get();
    img.loadPixels();
    if (img.width != hist[histIndex - 1].get().width || img.height != hist[histIndex - 1].get().height) {
      drawImage(true);
    } else {
      drawImage(false);
    }
  }
}

function saveHistory(img) {
  if (hist.length >= 50) { // max slots in history array
    hist.splice(0,1);
  } else {
    histIndex++;
  }
  hist[histIndex] = img.get();
  hist[histIndex].loadPixels();
  drawImage(false);

  if (histIndex < hist.length) {
    for (var i = histIndex + 1; i < hist.length; i++) {
      hist.splice(i,1);
    }
  }
}
