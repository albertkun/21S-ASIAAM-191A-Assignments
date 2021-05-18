const map = L.map('map').setView([50.0709, -118.444],3);

let Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
Stadia_Outdoors.addTo(map);
/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/

let url = "https://spreadsheets.google.com/feeds/list/1DRsjFLb-HJa1iecarSGr7amTSdKMPjLwfBKPf_h1gnc/ox2e4ua/public/values?alt=json"
fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
        //console.log(data);
        processData(data);
})

const answer = {
    lat:"34.0689",
    lng:"-118.4452"
};

let closest = {
    lat:"-9999999999",
    lng:"-9999999999"
};

let nearest_marker = L.featureGroup();
let far_marker = L.featureGroup();

let layers = {
    "closest marker": nearest_marker,
    "far marker": far_marker
}
L.control.layers(null,layers).addTo(map);

let circleOptions = {
    radius: 6   ,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

function calculateDistance(lat, lng){
    return ((answer.lat - lat)**2 + (answer.lng - lng)**2)**(1/2)
}

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })

    const myNewDiv = document.getElementById('contents')
    myNewDiv.appendChild(newButton); //this adds the button to our page.
}

function addMarker(data){
    // console.log(data)
    // these are the names of our fields in the google sheets:
    distance = calculateDistance(data.whatisuclalatitude, data.whatisuclalongitude);
    loc = `${data.whatisuclalatitude}` + "," + `${data.whatisuclalongitude}`;
    
    // this marker becomes the closest
    console.log(data.whatisuclalatitude, data.whatisuclalongitude, distance, calculateDistance(closest.lat, closest.lng))
    if (distance < calculateDistance(closest.lat, closest.lng)){
        closest.lat = data.whatisuclalatitude;
        closest.lng = data.whatisuclalongitude;
        circleOptions.fillColor = "green";
        nearest_marker.addLayer(L.circleMarker([data.whatisuclalatitude,data.whatisuclalongitude], circleOptions).bindPopup(`<h2>${loc}</h2>`));
        console.log("yes")
    }
    else{
        circleOptions.fillColor = "red";
        far_marker.addLayer(L.circleMarker([data.whatisuclalatitude,data.whatisuclalongitude],circleOptions).bindPopup(`<h2>${loc}</h2>`))
        console.log("no")
    }
    createButtons(data.whatisuclalatitude, data.whatisuclalongitude, loc)
    return data.timestamp
}

function processData(theData){
    const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
    const rows = theData.feed.entry // this is the weird Google Sheet API format we will be removing
    // we start a for..of.. loop here 
    for(const row of rows) { 
        const formattedRow = {}
        for(const key in row) {
        // time to get rid of the weird gsx$ format...
        if(key.startsWith("gsx$")) {
                formattedRow[key.replace("gsx$", "")] = row[key].$t
        }
        }
        // add the clean data
        formattedData.push(formattedRow)
    }
    // lets see what the data looks like when its clean!
    console.log(formattedData)
    // we can actually add functions here too
    formattedData.forEach(addMarker)
    nearest_marker.addTo(map);
    far_marker.addTo(map);
    let allLayers = L.featureGroup([nearest_marker,far_marker]);
    //map.fitBounds(allLayers.getBounds());     
}