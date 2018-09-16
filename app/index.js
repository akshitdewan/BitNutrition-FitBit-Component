import document from "document";
import * as messaging from "messaging";

let myImage = document.getElementById("myImage");
let array = [];
// Message is received from companion
messaging.peerSocket.onmessage = evt => {
  // Am I Tired?

  console.log("Fitbit app " + JSON.stringify(evt.data));
  let data = evt.data;
  array = [];
  for(let key in data) {
  	array.push(data[key]);
  }
  console.log(JSON.stringify(array));
  let percentage = 78;
  let numViewsToDisplay = Math.floor(percentage/20);
  console.log(numViewsToDisplay);
  
  //reset 
  for(let i = 1; i < 6; i++) {
  	let progressBar= document.getElementById("green" + i);
  	progressBar.style.display = "none";
  }

  //update using current percentage
  for(let i = 0; i < numViewsToDisplay; i++) {
  	let progressBar= document.getElementById("green" + i);
  	progressBar.style.display = "inline";
  }

  createVTList();
};


function createVTList() {
let mybutton = document.getElementById("mybutton");
mybutton.onactivate = function(evt) {
  console.log("refresh");
  messaging.peerSocket.send("refresh");
  // progressBar.style.backgroundColor = "red";
}

let VTList = document.getElementById("my-list");

let NUM_ELEMS = array.length;
console.log("number of elements " + NUM_ELEMS);
VTList.delegate = {
  getTileInfo: function(index) {
    return {
      type: "my-pool",
      value: "Menu item",
      index: array[index]
    };
  },		
  configureTile: function(tile, info) {
    if (info.type == "my-pool") {
      tile.getElementById("text").text = info.index.title;//`$‌{info.value} $‌{info.index}`;
      let touch = tile.getElementById("touch-me");
      touch.onclick = evt => {
        console.log(`touched: $‌{info.index}`);
      };
    }
  }
};

// VTList.length must be set AFTER VTList.delegate
VTList.length = NUM_ELEMS;

VTList.redraw();
}

createVTList();
