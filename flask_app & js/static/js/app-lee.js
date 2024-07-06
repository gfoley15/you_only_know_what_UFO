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

// Declare global variable for sample data
var globalSampledData;

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

// Initialize the dashboard at start up
function init() {
    d3.json(apiUrl).then(response => {
        const data = response.data.sightings;

        // Define sample size and sample the data
        var sampleSize = 1000;
        globalSampledData = sampleData(data, sampleSize);

        // Get unique cities
        let cities = [...new Set(globalSampledData.map(item => item.CITY))].sort();

        // Populate the dropdown menu
        let dropdownMenu = d3.select("#City");
        
        // Add a default option
        dropdownMenu.append("option")
            .text("Select a city")
            .property("value", "");

        // Add cities to the dropdown menu
        cities.forEach(city => {
            dropdownMenu.append("option")
                .text(city)
                .property("value", city);
        });

        // Build the initial map
        buildMap(sampledData);
    })
}

function buildMap(data, selectedCity) {
    
    // Clear existing markers
    markers.clearLayers();

    // Loop through the data and create markers
    data.forEach(item => {
        var lat = item.Lat;
        var lon = item.Lng;
        
        // Create tooltip content
        var tooltipContent = `
            <strong>Date:</strong> ${item.OCCURRED_DATE}<br>
            <strong>Location:</strong> ${item.CITYSTATE}<br>
            <strong>Shape:</strong> ${item.SHAPE}<br>
        `;
            
        var marker = L.marker([lat, lon], {icon: ufoIcon}).bindTooltip(tooltipContent);
        markers.addLayer(marker);
    });

    // Add the marker cluster group to the map
    myMap.addLayer(markers);

    // Fit the map to show all markers
    var group = L.featureGroup(markers.getLayers());
    // myMap.fitBounds(group.getBounds());
    if (selectedCity && selectedCity !== "Select a city") {
        // If a city is selected, zoom in more
        myMap.fitBounds(group.getBounds(), { maxZoom: 10 });
    } else {
        // If no city is selected, use a wider view
        myMap.fitBounds(group.getBounds(), { maxZoom: 5 });
    } 
}

function optionChanged(selectedCity) {
    d3.json(apiUrl).then(response => {
        const data = response.data.sightings;
        var sampleSize = 1000;
        var sampledData = sampleData(data, sampleSize);

        // Filter data for the selected city
        let filteredData = selectedCity !== "Select a city" ? 
            globalSampledData.filter(item => item.CITY === selectedCity) : 
            globalSampledData;

        // Update map
        buildMap(filteredData, selectedCity);

        // Update sighting details
        updateSightingDetails(selectedCity, filteredData);
    })
}

function updateSightingDetails(city, data) {
    // Use d3 to select the panel with id of `#sighting-details`
    let panel = d3.select("#sighting-details");
    
    // Use `.html("") to clear any existing metadata
    panel.html("");

    if (city !== "Select a city" && data.length > 0) {
        // Get the first sighting for the selected city (assuming it's the most recent)
        let sighting = data[0];

        // Create an object with the metadata we want to display
        let metadata = {
            "Number of Sightings": data.length,
            "City": city,
            "State": sighting.STATE,
            "Country": sighting.COUNTRY,
            "Date": sighting.OCCURRED_DATE,
            "Shape": sighting.SHAPE,
            "Summary": sighting.SUMMARY
        };

        // Object.entries() to get key-value pairs
        let entries = Object.entries(metadata);

        // Inside a loop, use d3 to append new tags for each key-value in the metadata
        entries.forEach(([key, value]) => {
            // Append a h5 child element for each key-value pair
            panel.append("h5").text(`${key}: ${value}`);
        });

        // Log the entries array
        console.log(entries);
    } else {
        // If no city is selected or no data available
        panel.append("h5").text("Select a city to see details");
    }
}

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

// Call init() to initialize the dashboard
init();