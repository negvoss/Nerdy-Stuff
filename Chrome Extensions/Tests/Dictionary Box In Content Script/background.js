const dictPage = document.createElement("html");
document.body.appendChild(dictPage);

const get = function(url,callback) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    callback(request.responseText);
  }
  request.open("GET",url,true);
  request.send();
}

chrome.runtime.onMessage.addListener(function(msg) {
  switch(msg.messageType) {
    case "search":
    get("http://www.wordreference.com/enes/" + trim(msg.term),function(data) {
      dictPage.innerHTML = data;
      const terms = [];
      if (document.getElementsByClassName("WRD").length > 0) {
        for (row of document.getElementsByClassName("WRD")[0].children[0].children) {
          if (row.className == "even" || row.className == "odd") {
            if (row.id) {
              const fromWord = trim(row.children[0].children[0].childNodes[0].textContent);
              const toWord = trim(row.children[2].childNodes[0].textContent);
              let term;
              if (fromWord != "" && toWord != "")  {
                term = {
                  fromWord:fromWord,
                  toWord:toWord
                };
                if (!includes(terms,term)) terms.push(term);
                if (terms.length == 5) break;
              }
            }
          }
        }
      }
      const msg = {
        messageType:"searchResults",
        terms:terms
      };
      chrome.tabs.query({},function(tabs) {
        for (tab of tabs) {
          chrome.tabs.sendMessage(tab.id,msg);
        }
      });
    });
  }
});

const trim = function(word) {
  return word.replace(",","").replace(";","").replace(/\s/,"").replace(/\t/,"").trim();
}

const includes = function(terms,termToCheck) {
  for (term of terms) {
    if (term.fromWord == termToCheck.fromWord && term.toWord == termToCheck.toWord) return true;
  }
  return false;
}
