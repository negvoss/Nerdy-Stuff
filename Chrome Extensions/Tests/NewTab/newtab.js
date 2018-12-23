window.onload = function() {
  if (chrome.extension.getBackgroundPage().mode == 0) {
    const img = document.createElement("img");
    img.src = "https://picsum.photos/" + window.innerWidth + "/" + window.innerHeight + "/?random";
    document.body.innerHTML = "";
    document.body.appendChild(img);
  }
}

window.onkeydown = function(e) {
  if (e.key == "*") {
    chrome.runtime.sendMessage({
      mode:(chrome.extension.getBackgroundPage().mode + 1)%2
    });
  }
}
