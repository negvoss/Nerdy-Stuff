let token;

const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const redirectUrl = "https://quizlet.com/authorize?response_type=code&client_id=XznwJH3w5h&scope=write_set&state=" + randomString(15);
function setup() {
  noCanvas();
  const params = getURLParams();
  if (params.code) {
    const postUrl = "https://api.quizlet.com/oauth/token";
    const postData = {
      client_id:"XznwJH3w5h",
      client_secret:"ZX4uBcnqbB2RXYzBaDxHGV",
      grant_type:"authorization_code",
      code:params.code
    };
    httpPost(postUrl,"jsonp",postData,function(data) {
      token = data.access_token;
      listTerms();
    });
  }
  document.getElementById("requestAuthorization").onclick = function() {
    location.replace(redirectUrl);
  }
}

function listTerms() {
  const postUrl = "https://api.quizlet.com/2.0/sets/249428849/terms";
  const postData = {
    term:"test",
    definition:"testing123",
    //client_id:"XznwJH3w5h"
    //client_secret:"ZX4uBcnqbB2RXYzBaDxHGV"
    Authorization:"Bearer " + token
  };
  var method = "POST";

  // You REALLY want shouldBeAsync = true.
  // Otherwise, it'll block ALL execution waiting for server response.
  var shouldBeAsync = true;

  var request = new XMLHttpRequest();

  // Before we send anything, we first have to say what we will do when the
  // server responds. This seems backwards (say how we'll respond before we send
  // the request? huh?), but that's how Javascript works.
  // This function attached to the XMLHttpRequest "onload" property specifies how
  // the HTTP response will be handled.
  request.onload = function () {
    console.log(request);

     // Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
     // object declared above is available in this function even though this function
     // executes long after the request is sent and long after this function is
     // instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
     // applications.

     // You can get all kinds of information about the HTTP response.
     var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
     var data = request.responseText; // Returned data, e.g., an HTML document.
  }

  request.open(method, postUrl, shouldBeAsync);
  request.setRequestHeader("Authorization", "Bearer " + token);
  request.setRequestHeader("Access-Control-Allow-Origin", "*");
  // Or... whatever

  // Actually sends the request to the server.
  request.send(postData);
}

function randomString(len) {
  let text = "";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random()*possible.length));
  }
  return text;
}
