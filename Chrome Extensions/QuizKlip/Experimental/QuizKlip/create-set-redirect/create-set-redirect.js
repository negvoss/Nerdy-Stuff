const backgroundPage = chrome.extension.getBackgroundPage();
const basicCode = backgroundPage.basicCode;
let languageInfo;

const loadJSON = function(url,callback) {
   const xobj = new XMLHttpRequest();
   xobj.overrideMimeType("application/json");
   xobj.open("GET", url, true);
   xobj.onreadystatechange = function() {
     if (xobj.readyState == 4 && xobj.status == "200") {
       callback(JSON.parse(xobj.responseText));
     }
   }
   xobj.send(null);
}

loadJSON(chrome.extension.getURL("languageInfo.json"),function(data) {
  languageInfo = data;
  if (params.code && params.state == backgroundPage.state) {
    // add terms to list from background page
    for (term of backgroundPage.selectedTerms) {
      quizletTerms.push(term.term);
      quizletDefinitions.push(term.definition);
    }
    getAuthCode();
  } else {
    success = false;
    updateTimer(3,null);
  }
});

const getFromCode = function(language) {
  return languageInfo.langCodes[language.from];
}
const getToCode = function(language) {
  return languageInfo.langCodes[language.to];
}
