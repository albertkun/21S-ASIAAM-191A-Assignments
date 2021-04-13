// JavaScript const variable declaration
const map = L.map('map').setView([34.0709, -118.444], 2);

// Leaflet tile layer, i.e. the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//JavaScript let variable declaration to create a marker
/*
let marker = L.marker([38.562771,-121.493695]).addTo(map)
		.bindPopup('Math Sciences 4328 aka the Technology Sandbox<br> is the lab where I work in ')
		.openPopup();
*/
fetch("js/map.geojson")
.then(response => {
    return response.json();
})
.then(data =>{
    // Basic Leaflet method to add GeoJSON data
    L.geoJSON(data, myLayerOptions)
    .bindPopup(function (layer) {
        return layer.feature.properties.place;
    }).addTo(map);
});

function customMarker (feature, latlng) {
    return L.circleMarker(latlng, { color: feature.properties.color })
  }
  
  // create an options object
  let myLayerOptions = {
    pointToLayer: createCustomIcon
  }
function createCustomIcon (feature, latlng) {
  let myIcon = L.icon({
    iconUrl: './my-icon.png',
    //shadowUrl: './my-icon.png',
    iconSize:     [25, 25], // width and height of the image in pixels
    //shadowSize:   [35, 20], // width, height of optional shadow image
    iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
    //shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  })
  return L.marker(latlng, { icon: myIcon })
}