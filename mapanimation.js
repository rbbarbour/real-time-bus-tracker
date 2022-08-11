mapboxgl.accessToken = 'pk.eyJ1IjoicmJiYXJib3VyIiwiYSI6ImNsNmpvdzc2cjB1NTAzanBydDA0OGZqYnEifQ.D-B92ZbnXji4q1Xr9jst6A';

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-95.3667,29.7465],
  zoom: 10,
});

// This is the marker instance.  Location won't be defined until the user clicks the button.
let marker = new mapboxgl.Marker()

const legend = document.getElementById('legend'); //Tells the user what bus number is being tracked
var busNumber;
var routeNumber;
var timeoutID = null

async function getBusNumber(){
    const url = "https://api.transitiq.com/ODataService.svc/Vehicles?subscription-key=fd56697ccf1a4564b9ef4357a92a98e9'";
	const response = await fetch(url);
	const json     = await response.json();
    let i = Math.round(100*Math.random());
    busNumber = json.value[i].VehicleId;
    routeNumber = json.value[i].RouteName;
    //console.log('getBusNumber: ' + busNumber);
    legend.innerHTML = "You are now tracking bus number " + busNumber + ", currently running route " + routeNumber;
    map.setCenter([json.value[i].Longitude, json.value[i].Latitude]);
    if(timeoutID) {clearTimeout(timeoutID); console.log("Previous setTimeout cleared");};
    run()
}

async function run() {
    // get bus data
    //console.log('run: ' + busNumber);
	const locations = await getBusLocations();
	//console.log(new Date());
	marker.setLngLat(locations)
    marker.addTo(map)
    console.log(locations)

	// timer    
	timeoutID = setTimeout(run, 5000)
}

// Request bus data from MBTA
async function getBusLocations() {
	const url = "https://api.transitiq.com/ODataService.svc/Vehicles?subscription-key=fd56697ccf1a4564b9ef4357a92a98e9'";
	const response = await fetch(url);
	const json     = await response.json();
    //console.log('getBusLocations: ' + busNumber)
    for (let i = 0; i < json.value.length; i++) {
        if(json.value[i].VehicleId == busNumber) {
            console.log("line: " + i + ", vehicleid: " + json.value[i].VehicleId + ', route: ' + json.value[i].RouteName);
            const location = [json.value[i].Longitude, json.value[i].Latitude];
            return location;
        }
    }
}