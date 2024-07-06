// Initialize the map
var myMap = L.map('map', {
    center: [39.1, -94.6], // Centers map on Kansas City
    zoom: 5
});

// Add a base layer (tile layer) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a marker cluster group
var markers = L.markerClusterGroup();

// Define the URL for your GeoJSON data
var url = "/sourcedata"; // Air Force Bases JSON
var url1 = "/sourcedata1"; // USA UFO Sightings CSV

// Function to sample data
function sampleData(data, sampleSize) {
    if (data.length <= sampleSize) return data;
    var sampled = [];
    for (var i = 0; i < sampleSize; i++) {
        var index = Math.floor(Math.random() * data.length);
        sampled.push(data[index]);
        data.splice(index, 1);
    }
    return sampled;
}

// To add custom UFO marker
var ufoIcon = L.icon({
    iconUrl: '../static/mattsufo.png',
    iconSize: [32, 32]
})

// To add custom Air Force Base marker
var airforceIcon = L.icon({
    iconUrl: '../static/usaf2.png',
    iconSize: [48, 32]
})

// Fetch the JSON data for all US Air Force Bases
d3.json(url).then(data => {
    console.log(data);
    // Loop through the data and add markers
    data.forEach(item => {
        var lat = item.latitude;  // Adjust property name if different
        var lon = item.longitude; // Adjust property name if different
        
        // Create tooltip content
        var tooltipContent = `
            <strong>Name:<strong> ${item.name}<br>
            <strong>Unit:<strong> ${item.host_wing_or_primary_unit}<br>
            <strong>City:<strong> ${item.location}<br>
            <strong>State:<strong> ${item.state_or_area}<br>
        `;

        L.marker([lat, lon], {icon: airforceIcon}).addTo(myMap)
            .bindTooltip(tooltipContent); // To add tooltip content
    });
        
    // Adjust map view to fit all markers
    // var bounds = L.latLngBounds(data.map(item => [item.latitude, item.longitude]));
    // myMap.fitBounds(bounds);
})
.catch(error => console.error('Error fetching data:', error));

// Fetch the JSON data all UFO sightings
d3.json(url1).then(data => {
    console.log(data);

    // Define sample size
    var sampleSize = 1000;

    // Sample the data due to the large dataset
    var sampledData = sampleData(data, sampleSize);  // Adjust sample size as needed

    // Loop through the data and add markers
    sampledData.forEach(item => {
        var lat = item.Lat;  // Adjust property name if different
        var lon = item.Lng; // Adjust property name if different

        // Create tooltip content
        var tooltipContent = `
            <strong>Date:<strong> ${item.OCCURRED_DATE}<br>
            <strong>City:<strong> ${item.CITY}<br>
            <strong>State:<strong> ${item.STATE}<br>
            <strong>Year:<strong> ${item.YEAR}<br>
        `;
            
        var marker = L.marker([lat, lon], {icon: ufoIcon}).bindTooltip(tooltipContent);
        markers.addLayer(marker);
    });

    // Add the marker cluster group to the map
    myMap.addLayer(markers);
        
    // Adjust map view to fit all markers
    // var bounds = markers.getBounds();
    // myMap.fitBounds(bounds);
})
.catch(error => console.error('Error fetching data:', error));