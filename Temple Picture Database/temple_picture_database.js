const config = {
  apiKey:"AIzaSyDvHgyLy-7b3k8l7mD0OLORmz0xaPepRqc",
  authDomain:"temple-image-database.firebaseapp.com",
  databaseURL:"https://temple-image-database.firebaseio.com",
  projectId:"temple-image-database",
  storageBucket:"",
  messagingSenderId:"379190310786"
};
firebase.initializeApp(config);
const database = firebase.database();
const ref = database.ref("images");
window.onload = function() {
  let img = document.getElementById("img");
  const fileInput = document.getElementById("fileInput");
  const reader = new FileReader();
  fileInput.addEventListener("change",function() {
    reader.onload = function() {
      submitImage.disabled = false;
    }
    const file = fileInput.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
  });
  const submitImage = document.getElementById("submit");
  submitImage.onclick = function() {
    const data = {
      name:document.getElementById("name").value,
      data:reader.result
    };
    const key = ref.push(data).key;
    ref.orderByKey().equalTo(key).on("value",showResults);
  }
  searchName.addEventListener("keyup",function(e) {
    if (e.keyCode == 13) {
      const searchName = document.getElementById("searchName");
      ref.orderByChild("name").equalTo(searchName.value).on("value",showResults);
    }
  });
}

const showResults = function(data) {
  for (let i = document.getElementsByClassName("result").length - 1; i >= 0; i--) {
    const result = document.getElementsByClassName("result")[i];
    result.parentNode.removeChild(result);
  }
  let results = data.val();
  if (results) {
    for (key of Object.keys(results)) {
      const result = document.createElement("div");
      result.className = "result";
      const name = document.createElement("span");
      name.textContent = results[key].name + ": ";
      result.appendChild(name);
      const img = document.createElement("img");
      img.width = 400;
      img.src = results[key].data;
      result.appendChild(img);
      document.body.appendChild(result);
    }
  } else {
    const result = document.createElement("div");
    result.style.fontSize = "40px";
    result.className = "result";
    result.textContent = "No results.";
    document.body.appendChild(result);
  }
}
