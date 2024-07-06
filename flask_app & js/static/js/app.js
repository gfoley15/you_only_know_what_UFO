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

// Connect to Flask API
var url = "/sourcedata"; // Air Force Bases JSON
var apiUrl = "/sourcedata1"; // USA UFO Sightings

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
    iconUrl: '../static/f35.png',
    iconSize: [48, 32]
})

// Fetch the JSON data for all US Air Force Bases
d3.json(url).then(data => {

    // Loop through the data and add markers
    data.forEach(item => {
        var lat = item.latitude;
        var lon = item.longitude;
        
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
})

// Fetch the JSON data all UFO sightings
d3.json(apiUrl).then(response => {

    // The data is nested under 'data.sightings'
    const data = response.data.sightings;

    // Define sample size
    var sampleSize = 1000;

    // Sample the data due to the large dataset
    var sampledData = sampleData(data, sampleSize);  // Adjust sample size as needed

    // Loop through the data and add markers
    sampledData.forEach(item => {
        var lat = item.Lat;
        var lon = item.Lng;

        // Create tooltip content
        var tooltipContent = `
            <strong>Date:<strong> ${item.OCCURRED_DATE}<br>
            <strong>Location:<strong> ${item.CITYSTATE}<br>
            <strong>Shape:<strong> ${item.SHAPE}<br>
            <strong>Summary:<strong> ${item.SUMMARY}<br>
        `;
            
        var marker = L.marker([lat, lon], {icon: ufoIcon}).bindTooltip(tooltipContent);
        
        // Add marker to cluster group
        markers.addLayer(marker);
    });

    // Add the marker cluster group to the map
    myMap.addLayer(markers);
})

function createBarCharts() {
    document.addEventListener('DOMContentLoaded', function() {
        d3.json('/sourcedata1')
            .then(data => {
                let sightings = data.data.sightings;
                
                let stateCounts = {};
                let shapeCounts = {};

                sightings.forEach(sighting => {
                    // Count sightings by state
                    if (sighting.STATE in stateCounts) {
                        stateCounts[sighting.STATE]++;
                    } else {
                        stateCounts[sighting.STATE] = 1;
                    }

                    // Count sightings by shape
                    if (sighting.SHAPE in shapeCounts) {
                        shapeCounts[sighting.SHAPE]++;
                    } else {
                        shapeCounts[sighting.SHAPE] = 1;
                    }
                });

                // Convert stateCounts to an array of { state, count } objects
                let stateData = Object.keys(stateCounts).map(state => ({ state, count: stateCounts[state] }));

                // Sort stateData by count in descending order and take top 10
                stateData.sort((a, b) => b.count - a.count);
                stateData = stateData.slice(0, 10);

                // Extract labels and data for states chart
                let stateLabels = stateData.map(item => item.state);
                let stateCountsSorted = stateData.map(item => item.count);

                // Convert shapeCounts to an array of { shape, count } objects
                let shapeData = Object.keys(shapeCounts).map(shape => ({ shape, count: shapeCounts[shape] }));

                // Sort shapeData by count in descending order and take top 10
                shapeData.sort((a, b) => b.count - a.count);
                shapeData = shapeData.slice(0, 10);

                // Extract labels and data for shapes chart
                let shapeLabels = shapeData.map(item => item.shape);
                let shapeCountsSorted = shapeData.map(item => item.count);

                // Chart for sightings by state
                let countbyState = document.getElementById('sightingsByState').getContext('2d');
                new Chart(countbyState, {
                    type: 'bar',
                    data: {
                        labels: stateLabels,
                        datasets: [{
                            label: '# of Sightings',
                            data: stateCountsSorted,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                maxBarThickness: 100
                            }
                        }
                    }
                });

                // Chart for sightings by shape
                let countbyShape = document.getElementById('sightingsByShape').getContext('2d');
                new Chart(countbyShape, {
                    type: 'bar',
                    data: {
                        labels: shapeLabels,
                        datasets: [{
                            label: '# of Sightings',
                            data: shapeCountsSorted,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                maxBarThickness: 100
                            }
                        }
                    }
                });
            });
    });
}

// Call the function to create the bar charts
createBarCharts();
