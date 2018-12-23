let urlToCite;
let submitURL;

window.onload = function() {
  urlToCite = document.getElementById("urlToCite");
  submitURL = document.getElementById("submitURL");
  submitURL.onclick = function() {
    search(urlToCite.value);
  }
}

const search = function(url) {
  console.log(url);
}
