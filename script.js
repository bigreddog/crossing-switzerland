// Data from roadbook PDF
const sectionData = [
    {
        section: 1,
        startEnd: "Bad Ragaz - Rüti GL",
        distance: 68.5,
        elevationGain: 5158,
        elevationLoss: 5050,
        cutoff: "MONDAY 20/07, 09h00",
        aidStations: "Pizolhütte (Standard), Alpramin (Standard), Obererbs (Standard), Rüti GL (Base Camp)"
    },
    {
        section: 2,
        startEnd: "Rüti GL - Altdorf",
        distance: 41.2,
        elevationGain: 1934,
        elevationLoss: 2090,
        cutoff: "TUESDAY 21/07, 03h00",
        aidStations: "Klausen (Standard), Altdorf (Base Camp)"
    },
    {
        section: 3,
        startEnd: "Altdorf - Engelberg",
        distance: 29.8,
        elevationGain: 1932,
        elevationLoss: 1388,
        cutoff: "-",
        aidStations: "Blackenalp (Standard), Engelberg (Standard)"
    },
    {
        section: 4,
        startEnd: "Engelberg - Meiringen",
        distance: 36.3,
        elevationGain: 1868,
        elevationLoss: 2275,
        cutoff: "WEDNESDAY 22/07, 08h00",
        aidStations: "Melchsee-Frutt (Standard), Meiringen (Base Camp)"
    },
    {
        section: 5,
        startEnd: "Meiringen - Grindelwald",
        distance: 19.0,
        elevationGain: 1440,
        elevationLoss: 819,
        cutoff: "-",
        aidStations: "Grindelwald (Standard)"
    },
    {
        section: 6,
        startEnd: "Grindelwald - Lauterbrunnen",
        distance: 24.5,
        elevationGain: 1344,
        elevationLoss: 1247,
        cutoff: "THURSDAY 23/07, 03h00",
        aidStations: "Lauterbrunnen (Base Camp)"
    },
    {
        section: 7,
        startEnd: "Lauterbrunnen - Adelboden",
        distance: 55.6,
        elevationGain: 4362,
        elevationLoss: 3822,
        cutoff: "FRIDAY 24/07, 06h00",
        aidStations: "Gspaltenhornhütte (Self-Service), Kandersteg (Standard), Adelboden (Base Camp)"
    },
    {
        section: 8,
        startEnd: "Adelboden - Les Diablerets",
        distance: 60.1,
        elevationGain: 3579,
        elevationLoss: 3587,
        cutoff: "SATURDAY 25/07, 11h00",
        aidStations: "Iffigenalp (Standard), Gsteig (Self-Service), Les Diablerets (Base Camp)"
    },
    {
        section: 9,
        startEnd: "Les Diablerets - Le Sépey",
        distance: 14.5,
        elevationGain: 736,
        elevationLoss: 1094,
        cutoff: "-",
        aidStations: "Le Sépey (Standard)"
    },
    {
        section: 10,
        startEnd: "Le Sépey - Montreux",
        distance: 36.3,
        elevationGain: 2638,
        elevationLoss: 3235,
        cutoff: "SUNDAY 26/07, 16h00",
        aidStations: "Luan (Standard), Col de Chaude (Standard), Montreux (Finish)"
    }
];

// Calculate Haversine distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

let map;
let gpxData = [];

// Initialize Map
function initMap() {
    map = L.map('map').setView([46.8, 8.2], 8); // Center of Switzerland

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    loadGPX();
}

async function loadGPX() {
    try {
        const response = await fetch('CROSSING SWITZERLAND 2026.gpx');
        const text = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const trkpts = xmlDoc.getElementsByTagName("trkpt");

        let latlngs = [];
        let cumulativeDistance = 0;

        for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute("lat"));
            const lon = parseFloat(trkpts[i].getAttribute("lon"));
            const eleNode = trkpts[i].getElementsByTagName("ele")[0];
            const ele = eleNode ? parseFloat(eleNode.textContent) : 0;

            if (i > 0) {
                const prevLat = parseFloat(trkpts[i-1].getAttribute("lat"));
                const prevLon = parseFloat(trkpts[i-1].getAttribute("lon"));
                cumulativeDistance += calculateDistance(prevLat, prevLon, lat, lon);
            }

            latlngs.push([lat, lon]);
            gpxData.push({
                lat: lat,
                lon: lon,
                ele: ele,
                dist: cumulativeDistance
            });
        }

        // Draw route on map
        const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());

        addAidStationMarkers();
        renderElevationChart();

    } catch (error) {
        console.error("Error loading GPX:", error);
    }
}

function renderElevationChart() {
    // Simplify data to prevent browser lag (e.g., take every 10th point)
    const sampledData = gpxData.filter((_, index) => index % 10 === 0);

    const distances = sampledData.map(d => d.dist.toFixed(1));
    const elevations = sampledData.map(d => d.ele);

    const ctx = document.getElementById('elevationChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: distances,
            datasets: [{
                label: 'Elevation (m)',
                data: elevations,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Distance (km)'
                    },
                    ticks: {
                        maxTicksLimit: 20
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Elevation (m)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Elevation: ${context.parsed.y} m`;
                        }
                    }
                }
            }
        }
    });
}

function addAidStationMarkers() {
    // We try to place aid stations along the route based on distance.
    aidStations.forEach(station => {
        // Find closest point in GPX data by distance
        let closestPoint = gpxData[0];
        let minDiff = Math.abs(station.km - closestPoint.dist);

        for (let i = 1; i < gpxData.length; i++) {
            let diff = Math.abs(station.km - gpxData[i].dist);
            if (diff < minDiff) {
                minDiff = diff;
                closestPoint = gpxData[i];
            }
        }

        L.marker([closestPoint.lat, closestPoint.lon])
            .addTo(map)
            .bindPopup(`<b>${station.name}</b><br>Km: ${station.km}`);
    });
}

const aidStations = [
    { name: "Pizolhütte", km: 12.1 },
    { name: "Alpramin", km: 34.8 },
    { name: "Obererbs", km: 52.9 },
    { name: "Rüti GL", km: 68.5 },
    { name: "Klausen", km: 89.2 },
    { name: "Altdorf", km: 109.7 },
    { name: "Blackenalp", km: 127.1 },
    { name: "Engelberg", km: 139.5 },
    { name: "Melchsee-Frutt", km: 158.4 },
    { name: "Meiringen", km: 175.8 },
    { name: "Grindelwald", km: 194.8 },
    { name: "Lauterbrunnen", km: 219.3 },
    { name: "Gspaltenhornhütte", km: 238.7 },
    { name: "Kandersteg", km: 258.0 },
    { name: "Adelboden", km: 275.0 },
    { name: "Iffigenalp", km: 295.4 },
    { name: "Gsteig", km: 320.0 },
    { name: "Les Diablerets", km: 335.0 },
    { name: "Le Sépey", km: 349.5 },
    { name: "Luan", km: 362.0 },
    { name: "Col de Chaude", km: 378.0 },
    { name: "Montreux", km: 394.0 } // Estimated final distance
];

function populateTable() {
    const tableBody = document.querySelector("#summaryTable tbody");
    let cumulativeDistance = 0;

    sectionData.forEach(section => {
        cumulativeDistance += section.distance;
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${section.section}</td>
            <td>${section.startEnd}</td>
            <td>${section.distance.toFixed(1)}</td>
            <td>${cumulativeDistance.toFixed(1)}</td>
            <td>${section.elevationGain}</td>
            <td>${section.elevationLoss}</td>
            <td>${section.cutoff}</td>
            <td>${section.aidStations}</td>
        `;
        tableBody.appendChild(row);
    });
}

function initCalculator() {
    const calcBtn = document.getElementById('calc-btn');
    calcBtn.addEventListener('click', () => {
        const d1 = parseFloat(document.getElementById('d1').value);
        const t1 = parseFloat(document.getElementById('t1').value);
        const d2 = parseFloat(document.getElementById('d2').value);

        if (isNaN(d1) || isNaN(t1) || isNaN(d2) || d1 <= 0 || t1 <= 0) {
            alert("Please enter valid positive numbers for known distance and time.");
            return;
        }

        // Riegel's formula with fatigue factor of 1.2
        const c = 1.2;
        const t2 = t1 * Math.pow((d2 / d1), c);

        const hours = Math.floor(t2);
        const minutes = Math.round((t2 - hours) * 60);

        document.getElementById('projected-time').textContent = `${hours} hours and ${minutes} minutes`;
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    populateTable();
    initCalculator();
});
