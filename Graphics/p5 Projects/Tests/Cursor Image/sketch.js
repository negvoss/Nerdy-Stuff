var c;
var toolSwapper;

function setup() {
  c = createCanvas(400,400);
  c.elt.style.cursor = 'url("cursors/magic_wand.cur"), auto';
  toolSwapper = select("#toolSwapper");
  toolSwapper.changed(function() {
    switch(toolSwapper.value()) {
      case "Magic Wand":
        c.elt.style.cursor = 'url("cursors/magic_wand.cur"), auto';
        break;
      case "Eraser":
        c.elt.style.cursor = 'url("cursors/eraser.cur"), auto';
        break;
      case "Brush":
        c.elt.style.cursor = 'url("cursors/brush.cur"), auto';
        break;
      case "Zoom In":
        c.elt.style.cursor = 'url("cursors/zoom_in.cur"), auto';
        break;
      case "Zoom Out":
        c.elt.style.cursor = 'url("cursors/zoom_out.cur"), auto';
        break;
    }
  });
}

function draw() {
  background(51);
}
