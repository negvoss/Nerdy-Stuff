const supportedLanguages = [];

window.onload = function() {
  const params = getURLParams();
  if (params.reason) {
    let msg;
    switch(params.reason) {
      case "install":
      msg = "Welcome to QuizKlip!";
      break;
      case "update":
      msg = "QuizKlip Version Updated!\nQuizKlip's interface has changed a lot. For suggestions on how to improve QuizKlip's interface, please submit a review for QuizKlip on the Chrome Web Store.\nClip away!";
    }
    setTimeout(function() {
      alert(msg);
    },500);
  }

  let supportedLanguagesText = "Supported Languages: ";
  for (let i = 0; i < supportedLanguages.length; i++) {
    supportedLanguagesText += supportedLanguages[i];
    if (i != supportedLanguages.length - 1) {
      supportedLanguagesText += ", ";
    }
  }
  document.getElementById("supportedLanguages").textContent = supportedLanguagesText;
}

const loadJSON = function(url,callback) {
   const xobj = new XMLHttpRequest();
   xobj.overrideMimeType("application/json");
   xobj.open('GET', url, true);
   xobj.onreadystatechange = function() {
     if (xobj.readyState == 4 && xobj.status == "200") {
       callback(JSON.parse(xobj.responseText));
     }
   }
   xobj.send(null);
}

loadJSON(chrome.extension.getURL("languageInfo.json"),function(data) {
  if (data) {
    for (key of Object.keys(data.langCodes)) {
      supportedLanguages.push(key);
    }
  }
});

const getURLParams = function() {
  let urlParams = {};
  location.href.replace(
    new RegExp("([^?=&]+)(=([^&]*))?","g"),
    function($0, $1, $2, $3) {
      urlParams[$1] = $3;
    }
  );
  return urlParams;
}
