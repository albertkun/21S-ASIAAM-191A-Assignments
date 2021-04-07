let map = L.map('map').setView([34.0709, -118.444], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker = L.marker([34.0709, -118.444]).addTo(map)
		.bindPopup('Math Sciences 4328 aka the Technology Sandbox<br> is the lab where I work in ')
		.openPopup();

// L.geoJSON(ca_counties).addTo(map);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        layer.bindPopup("<h3>"+feature.properties.name+"<br>Pop_density: "+feature.properties.POP_DENSIT+"</h1>");
		console.log(feature.properties)
    }
}

L.geoJSON(ca_counties, {
    onEachFeature: onEachFeature
}).addTo(map);