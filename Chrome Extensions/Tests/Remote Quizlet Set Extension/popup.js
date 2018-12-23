const basicCode = "OW1IS213NnBWNDo3WVZWYnBtQVlKeFJSNXo0UXZicFZD";
window.onload = function() {
  document.getElementById("requestAuthorization").onclick = function() {
    window.open("https://quizlet.com/authorize?response_type=code&client_id=9mHKmw6pV4&scope=write_set&state=" + randomString(15));
    window.close();
  }
  const params = getURLParams();
  if (params.code) {
    const postData = {
      grant_type:"authorization_code",
      code:params.code,
      redirect_uri:chrome.extension.getURL("popup.html")
    };
    post("https://api.quizlet.com/oauth/token","Basic",basicCode,postData,function(data) {
      const title = "testSet123"
      const terms = ["hello","wassup"];
      const definitions = ["hello123","wassup123"];
      const lang_terms = "en";
      const lang_definitions = "en";
      createSet(data.access_token,title,terms,definitions,lang_terms,lang_definitions);
    });
  }
}

const createSet = function(token,title,terms,definitions,lang_terms,lang_definitions) {
  const postData = {
    title:title,
    terms:terms,
    definitions:definitions,
    lang_terms:lang_terms,
    lang_definitions:lang_definitions
  };
  post("https://api.quizlet.com/2.0/sets/","Bearer",token,postData,function(data) {
    console.log(data);
  });
}

const post = function(url,authType,authCode,postData,callback) {
  let request = new XMLHttpRequest();
  request.onload = function() {
    callback(JSON.parse(request.responseText));
  }
  request.open("POST",url,true);
  request.setRequestHeader("Authorization",authType + " " + authCode);
  request.setRequestHeader("Content-Type","application/json");
  request.send(JSON.stringify(postData));
}



const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const randomString = function(len) {
  let text = "";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random()*possible.length));
  }
  return text;
}

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
