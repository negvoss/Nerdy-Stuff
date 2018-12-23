var fileSelect;
var dropZone;
var sav;

function setupFileJS() {
  fileSelect = createFileInput(handleFile).parent("fileInput");
  dropZone = select("#dropZone");
  dropZone.dragOver(highlight);
  dropZone.dragLeave(unhighlight);
  dropZone.drop(dropFile);
  sav = select("#sav");
  sav.mousePressed(saveImage);
}

function saveImage() {
  img.save("crop","png");
}

function highlight() {
  dropZone.elt.style.backgroundColor = "#666666";
}

function unhighlight() {
  dropZone.elt.style.backgroundColor = "";
}

function dropFile(file) {
  handleFile(file);
  unhighlight();
}

function handleFile(file) {
  img = loadImage(file.data,"Image failed to load properly",function() {
    img.loadPixels();
    saveHistory(img);
    setupZoomJS();
  });
}
