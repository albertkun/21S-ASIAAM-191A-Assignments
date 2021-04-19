let zoomLevel = 5;
const mapCenter = [40,-100];

const map = L.map('map').setView(mapCenter, zoomLevel);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// adding markers
/*
let work = L.marker([34.0709, -118.444]).addTo(map)
		.bindPopup('Where I work on campus')

let home = L.marker([37.7409, -122.484]).addTo(map)
		.bindPopup('Where I currently am')

let random = L.marker([39.7409, -122.484]).addTo(map)
		.bindPopup('Third Point')
*/

function addMarker(lat, lng, message, title){
    let newMessage = "NOTICE: " + message;
    console.log(newMessage);
    L.marker([lat, lng]).addTo(map).bindPopup(title);
    createButton(lat,lng,title);
    L.marker([lat, lng]).bindPopup("<img src=./pic/chuck.jpg")
    return newMessage;
}

function createButton(lat,lng,title){
    const newButton = document.createElement("button");
    newButton.id = "button"+title;
    newButton.innerHTML = title;
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
        //appendLogo(lat,lng,title);
    })
    newButton.addEventListener('mouseover', function(){
        appendLogo(lat,lng,title);
    })
    document.body.prepend(newButton);
}

function appendLogo(lat, lng, title){
    let url = null;
    switch(title){
        case 'Chuck E Berry': url = './pic/chuck.jpg';
            break;
        case 'Kurt Cobain': url = './pic/kurt.jpg';
            break;
        case 'Jimi Hendrix': url = './pic/jimi.jpg';
            break;
        case 'Slash': url = './pic/slash.jpg';
            break;
        case 'Eddie Van Halen': url = './pic/eddie.jpg';
            break;
    }
    /*var myIcon = L.icon({
        iconUrl: url,
        iconSize: [100, 100],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });
    L.marker([lat, lng], {icon: myIcon}).addTo(map);
    */
    var popup = L.popup()
    .setLatLng([lat, lng])
    .setContent('<img src=' + url + ' width=100 height=100/><p>' + title +'</p>')
    .openOn(map);
}

addMarker(52.3,4.9, "1", "Eddie Van Halen");
addMarker(51.5,-0.11, "1", "Slash");
addMarker(38.6,-90, "1", "Chuck E Berry");
addMarker(46.9,-123, "2", "Kurt Cobain");
addMarker(47.6,-122.33, "3","Jimi Hendrix");