import * as messaging from "messaging";
import { settingsStorage } from "settings";

// Fetch Sleep Data from Fitbit Web API
function fetchSleepData(accessToken)  {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; //YYYY-MM-DD

  // Sleep API docs - https://dev.fitbit.com/reference/web-api/sleep/
  //fitbit https://api.fitbit.com/1.2/user/-/sleep/date/${todayDate}.json
  fetch('https://htn-food.firebaseio.com/suggested_food.json', {
    method: "GET",
    headers: {
    }
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log(" oh " + JSON.stringify(data));
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
    }
  })
  .catch(err => console.log('[FETCH]: ' + err));
}

// A user changes Settings
settingsStorage.onchange = evt => {
  if (evt.key === "oauth") {
    // Settings page sent us an oAuth token
    let data = JSON.parse(evt.newValue);
    fetchSleepData(data.access_token);
  }
};

// Restore previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key && key === "oauth") {
      // We already have an oauth token
      let data = JSON.parse(settingsStorage.getItem(key))
      fetchSleepData(data.access_token);
    }
  }
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  restoreSettings();
};

messaging.peerSocket.onmessage = evt => {
  // Am I Tired?
  console.log("companion recieved refresh ");
  fetchSleepData(0);

};
