const clientId = "ecbd2cfc0f46540c8a58cb70c08173d48349cac37354ff0f42ef46c4f6986b7c";
const clientSecret = "ab242b4d8343f1c2a83b752c19f293ddde654d02fead513ed3d53488cdb7ac46";


window.onload = function() {
  if (!params.code) {
    window.location = "https://id.easybib.com/oauth/authorize?response_type=code&client_id=" + clientId;
  } else {
    const postData = {
      grant_type:"authorization_code",
      code:params.code,
      client_id:clientId,
      client_secret:clientSecret,
      redirect_uri:"localhost:8000"
    };
    console.log(postData);
    post("https://id.easybib.com/oauth/token",postData,function(data) {
      console.log(data);
    });
  }
}


const getURLParams = function() {
  const params = {};
  const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(m,key,value) {
    params[key] = value;
  });
  return params;
}

const params = getURLParams();

const post = function(url,postData,callback) {
  let request = new XMLHttpRequest();
  request.onload = function() {
    callback(JSON.parse(request.responseText));
  }
  request.open("POST",url,true);
  request.setRequestHeader("Authorization","Basic");
  request.setRequestHeader("Content-Type","application/json");
  request.send(JSON.stringify(postData));
}
