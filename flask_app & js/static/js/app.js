// Connect to Flask API
let apiUrl = "/sourcedata1";

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
