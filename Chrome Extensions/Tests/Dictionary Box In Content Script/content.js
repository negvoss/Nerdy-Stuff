let mouseX = 0;
let mouseY = 0;

window.addEventListener("mouseup",function(e) {
  if (e.button == 0 && e.ctrlKey) {
    const s = window.getSelection();
    s.modify("extend","backward","word");
    const b = s.toString();
    s.modify("extend","forward","word");
    const a = s.toString();
    s.modify("move","forward","character");
    const term = (b + a).trim();
    if (term.length > 0) {
      const msg = {
        messageType:"search",
        term:term
      }
      chrome.runtime.sendMessage(msg);
    }
  }
  if (!clickedOnBox(e)) {
    clearDefinitionBox();
  }
});

chrome.runtime.onMessage.addListener(function(msg) {
  switch(msg.messageType) {
    case "searchResults":
    createDefinitionBox(msg.terms);
  }
});

const createDefinitionBox = function(terms) {
  clearDefinitionBox();
  const definitionBox = document.createElement("div");
  definitionBox.id = "definitionBox";
  definitionBox.style.border = "solid";
  definitionBox.style.backgroundColor = "orange";
  definitionBox.style.padding = "15px";
  definitionBox.style.width = "350px";
  definitionBox.style.position = "absolute";
  definitionBox.style.left = mouseX + "px";
  definitionBox.style.top = mouseY + 25 + "px";
  document.body.appendChild(definitionBox);
  if (terms.length > 0) {
    for (term of terms) {
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      const from = document.createElement("span");
      from.textContent = term.fromWord;
      const to = document.createElement("span");
      to.textContent = term.toWord;
      to.style.float = "right";
      definitionBox.appendChild(checkBox);
      definitionBox.appendChild(from);
      definitionBox.appendChild(to);
      const newLine = document.createElement("br");
      definitionBox.appendChild(newLine);
    }
    const addTermsP = document.createElement("p");
    addTermsP.align = "center";
    const addTerms = document.createElement("button");
    addTerms.textContent = "Clip Terms";
    addTerms.title = "Clip Terms";
    addTerms.onclick = function() {
      console.log("clipped");
    }
    addTermsP.appendChild(addTerms);
    definitionBox.appendChild(addTermsP);
  } else {
    const noResultsMsg = document.createElement("p");
    noResultsMsg.textContent = "No Results.";
    noResultsMsg.align = "center";
    definitionBox.appendChild(noResultsMsg);
  }
}

const clearDefinitionBox = function() {
  const box = document.getElementById("definitionBox");
  if (box) {
    box.parentNode.removeChild(box);
  }
}

const clickedOnBox = function(e) {
  const box = document.getElementById("definitionBox");
  if (box) {
    let target = e.target;
    while (target.parentNode) {
      if (target == box) return true;
      target = target.parentNode;
    }
    return false;
  }
}

window.addEventListener("mousemove",function(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
});
