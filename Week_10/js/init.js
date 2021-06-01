/* NOTE:
data.locationlat <- access users' location latitude
data.locationlong <- access users' location longitude
data.resourcelat <- access user reported resource location latitude
data.resourcelong <- access user reported resource location longitude
*/
var pulsingIcon = L.icon.pulse({iconSize:[20,20], color: 'blue', fillColor: 'blue'});

const map = L.map('map').setView([34.0709, -118.444], 5);

const url = "https://spreadsheets.google.com/feeds/list/1RFDPVCED6oKJYgqE04U2lJbO4oSF_ECeC3GcbaKvoZg/o5hgy6r/public/values?alt=json"

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch(url)
	.then(response => {
		return response.json();
		})
  .then(data =>{
    formatData(data)
  }
)

let feelingpositive = L.featureGroup();
let feelingneutral = L.featureGroup();
let feelingnegative = L.featureGroup();
let resourcearea = L.featureGroup();

let layers = {
  "Positive": feelingpositive,
  "Neutral": feelingneutral,
  "Negative": feelingnegative,
  "Resource Locations": resourcearea
}

L.control.layers(null,layers).addTo(map) 
  
function addMarker(data){
  let circleOptions = {
      radius: 4,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  }
  if(data.whichbestdescribeshowyouvebeenfeeling == "Positive"){
      circleOptions.fillColor = "green"
      feelingpositive.addLayer(L.circleMarker([data.locationlat,data.locationlong], circleOptions).
      bindPopup(`<h2>${data.whatcitydoyoulive}</h2>`))
  }
 if(data.whichbestdescribeshowyouvebeenfeeling =="Neutral"){
   circleOptions.fillColor = "yellow"
   feelingneutral.addLayer(L.circleMarker([data.locationlat,data.locationlong], circleOptions).
   bindPopup(`<h2>${data.whatcitydoyoulive}</h2>`))
 }
 if(data.whichbestdescribeshowyouvebeenfeeling =="Negative"){
  circleOptions.fillColor = "red"
  feelingnegative.addLayer(L.circleMarker([data.locationlat,data.locationlong], circleOptions).
  bindPopup(`<h2>${data.whatcitydoyoulive}</h2>`))
}
else{
  circleOptions.fillColor = "blue"
  resourcearea.addLayer(L.circleMarker([data.resourcelat,data.resourcelong], circleOptions).
  bindPopup('<h2>Physical Locations of Resources</h2>'))

  L.marker([data.resourcelat, data.resourcelong], {icon: pulsingIcon}).addTo(map);
}
  return data.timestamp
}


// Function to add stories by appending each user story
function addStories(data){
  
  // get rid of blank answer
  if (!data.describeyouremotionalsocialwellbeinginasmuchdetailasyouarecomfortablewith) return;
  
  const newDiv = document.createElement("div");
  newDiv.className = "stories";
  newDiv.innerHTML = "<b>My emotional well-being</b><br>👉";
  newDiv.innerHTML += data.describeyouremotionalsocialwellbeinginasmuchdetailasyouarecomfortablewith;
  newDiv.innerHTML += "<br><b>How I manage my emotional well-being</b><br>👉";
  newDiv.innerHTML += data['whatdoyoudotomanageyouremotionalwell-being'];

  if (data.whichcampusresourcesifanyhaveyoufoundhelpfulinmanagingyourmentalhealth){
    newDiv.innerHTML += "<br><b>Campus resources that I used</b><br>👉";
    newDiv.innerHTML += data['whichcampusresourcesifanyhaveyoufoundhelpfulinmanagingyourmentalhealth'];
  }

  const spaceForStories = document.getElementById('snapshot')
  spaceForStories.appendChild(newDiv);
}

function displayWellnessCount(data){
  var wellness = {};
  
  // count all wellness status
  for (var i in data){
    // store wellness data
    emotion = data[i]['whichbestdescribeshowyouvebeenfeeling'];
    if (emotion != ""){
      if (wellness[emotion] == null){
        wellness[emotion] = 0;
      }
      wellness[emotion] += 1;
    }
  }

  chartWellnessData = [];
  x_val = [];
  y_val = [];
  for (const [key, value] of Object.entries(wellness)) {
    x_val.push(key);
    y_val.push(value);
  }
  chartWellnessData['x'] = x_val;
  chartWellnessData['y'] = y_val;

  renderChart(chartWellnessData, "Emotional Wellness", "chartDiv");
}

function displayResourceCount(data){
  resource_dict = {}
  for (var i in data){
    // store wellness data
    resource = data[i]['whichcampusresourcesifanyhaveyoufoundhelpfulinmanagingyourmentalhealth'];
    resource_arr = resource.split(', ');
    
    // ignore blank data and "none"
    if (resource_arr.includes("none") || resource_arr.includes("None") || resource_arr.includes("")) {
      continue;
    }
    for (var j = 0; j < resource_arr.length; j++){
      if (resource_dict[resource_arr[j]] == null){
        resource_dict[resource_arr[j]] = 0;
      }
      resource_dict[resource_arr[j]] += 1;
    }
  }
  
  temp = {}
  temp['x'] = Object.keys(resource_dict);
  temp['y'] = Object.values(resource_dict);
  
  // console.log(temp)
  renderChart(temp, "Resources Count", "chartDiv");
}

var global_formatted_data;
function formatData(theData){
  const formattedData = [];
  const rows = theData.feed.entry;
  for(const row of rows) {
    const formattedRow = {}
    for(const key in row) {
      if(key.startsWith("gsx$")) {
            formattedRow[key.replace("gsx$", "")] = row[key].$t;
      }
    }
    formattedData.push(formattedRow);
  }
  console.log(formattedData);
  formattedData.forEach(addMarker);
  formattedData.forEach(addStories);

  global_formatted_data = formattedData; // store to global variable so data is used in graph

  // show markers
  feelingpositive.addTo(map)
  feelingneutral.addTo(map)
  feelingnegative.addTo(map)
  resourcearea.addTo(map)
  let allLayers = L.featureGroup([feelingpositive, feelingneutral, feelingnegative, resourcearea]);
  map.fitBounds(allLayers.getBounds())
}

// switch page between wellness and resources
function loadChart(page){
  document.getElementById('chartDiv').remove();
  if (page==0){
    displayWellnessCount(global_formatted_data);
  }
  else {
    displayResourceCount(global_formatted_data);
  }
}

// create chart
function renderChart(chartData, title, divID){
  // delete previous canvas and append a new one
  canvas = document.createElement('canvas');
  canvas.setAttribute("id",divID);
  parent = document.getElementsByClassName("modal-content")[0];
  parent.appendChild(canvas);

  // create a chart
  var xValues = chartData['x'];
  var yValues = chartData['y'];
  var barColors = ["red", "yellow","green", "blue", "purple", "orange", "black", "gray", "pink"];

  new Chart(divID, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      },
      legend: {
        display: false
      },
      title: {
          display: true,
          text: title,
      }
    }
  });
}

//--------------create modal-------------------//
// Get the modal
var modal = document.getElementById("reportModal");

// Get the button that opens the modal
var btn = document.getElementById("reportButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  loadChart(0);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}