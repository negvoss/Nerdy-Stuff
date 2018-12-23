const setupFirebase = function() {
  const config = {
    apiKey: "AIzaSyBQXMJXzni2ALbPU18r245SeemD5HVcC84",
    authDomain: "character-recognition-f5124.firebaseapp.com",
    databaseURL: "https://character-recognition-f5124.firebaseio.com",
    projectId: "character-recognition-f5124",
    storageBucket: "",
    messagingSenderId: "91030421727"
  };
  firebase.initializeApp(config);
  const database = firebase.database();
  ref = database.ref("filters");

  ref.on("value",function(data) {
    filters = [];
    filterSelect.remove();
    filterSelect = createSelect().parent("#filterSelectContainer");
    data = data.val();
    if (data) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        const key = Object.keys(data)[i];
        let newFilter = {
          name:data[key].name,
          filter:data[key].filter
        };
        filters.push(newFilter);
        filterSelect.option(newFilter.name);
      }
      rawFilter = filters[0].filter;
      updateFilterBoxes();
      filterSelect.changed(function() {
        for (let i = 0; i < filters.length; i++) {
          if (filters[i].name == filterSelect.value()) {
            rawFilter = filters[i].filter;
          }
        }
        updateFilterBoxes();
      });
    }
  },function(err) {
    console.log(err);
  });
}
