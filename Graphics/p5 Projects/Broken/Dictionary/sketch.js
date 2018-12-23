var inp;

function setup() {
  noCanvas();
  inp = createInput("Dictionary Box");
  var url = "https://od-api.oxforddictionaries.com/api/v1/7cbd3c90f3357c1591c9f13a1a62a4a1";
  loadJSON(url,gotData,"jsonp");
}

function gotData(data) {
  console.log(data);
}
