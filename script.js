// Data from roadbook PDF
const sectionData = [
    {
        section: 1,
        startEnd: "Bad Ragaz - Rüti GL",
        distance: 68.5,
        elevationGain: 5158,
        elevationLoss: 5050,
        cutoff: "MONDAY 20/07, 09h00",
        aidStations: [
            { name: "Pizolhütte", type: "Standard", km: 12.1 },
            { name: "Alpramin", type: "Standard", km: 34.8 },
            { name: "Obererbs", type: "Standard", km: 52.9 },
            { name: "Rüti GL", type: "Base Camp", km: 68.5 }
        ]
    },
    {
        section: 2,
        startEnd: "Rüti GL - Altdorf",
        distance: 41.2,
        elevationGain: 1934,
        elevationLoss: 2090,
        cutoff: "TUESDAY 21/07, 03h00",
        aidStations: [
            { name: "Klausen", type: "Standard", km: 89.2 },
            { name: "Altdorf", type: "Base Camp", km: 109.7 }
        ]
    },
    {
        section: 3,
        startEnd: "Altdorf - Engelberg",
        distance: 29.8,
        elevationGain: 1932,
        elevationLoss: 1388,
        cutoff: "-",
        aidStations: [
            { name: "Blackenalp", type: "Standard", km: 127.1 },
            { name: "Engelberg", type: "Standard", km: 139.5 }
        ]
    },
    {
        section: 4,
        startEnd: "Engelberg - Meiringen",
        distance: 36.3,
        elevationGain: 1868,
        elevationLoss: 2275,
        cutoff: "WEDNESDAY 22/07, 08h00",
        aidStations: [
            { name: "Melchsee-Frutt", type: "Standard", km: 158.4 },
            { name: "Meiringen", type: "Base Camp", km: 175.8 }
        ]
    },
    {
        section: 5,
        startEnd: "Meiringen - Grindelwald",
        distance: 19.0,
        elevationGain: 1440,
        elevationLoss: 819,
        cutoff: "-",
        aidStations: [
            { name: "Grindelwald", type: "Standard", km: 194.8 }
        ]
    },
    {
        section: 6,
        startEnd: "Grindelwald - Lauterbrunnen",
        distance: 24.5,
        elevationGain: 1344,
        elevationLoss: 1247,
        cutoff: "THURSDAY 23/07, 03h00",
        aidStations: [
            { name: "Lauterbrunnen", type: "Base Camp", km: 219.3 }
        ]
    },
    {
        section: 7,
        startEnd: "Lauterbrunnen - Adelboden",
        distance: 55.6,
        elevationGain: 4362,
        elevationLoss: 3822,
        cutoff: "FRIDAY 24/07, 06h00",
        aidStations: [
            { name: "Gspaltenhornhütte", type: "Self-Service", km: 238.7 },
            { name: "Kandersteg", type: "Standard", km: 258.0 },
            { name: "Adelboden", type: "Base Camp", km: 275.0 }
        ]
    },
    {
        section: 8,
        startEnd: "Adelboden - Les Diablerets",
        distance: 60.1,
        elevationGain: 3579,
        elevationLoss: 3587,
        cutoff: "SATURDAY 25/07, 11h00",
        aidStations: [
            { name: "Iffigenalp", type: "Standard", km: 295.4 },
            { name: "Gsteig", type: "Self-Service", km: 320.0 },
            { name: "Les Diablerets", type: "Base Camp", km: 335.0 }
        ]
    },
    {
        section: 9,
        startEnd: "Les Diablerets - Le Sépey",
        distance: 14.5,
        elevationGain: 736,
        elevationLoss: 1094,
        cutoff: "-",
        aidStations: [
            { name: "Le Sépey", type: "Standard", km: 349.5 }
        ]
    },
    {
        section: 10,
        startEnd: "Le Sépey - Montreux",
        distance: 36.3,
        elevationGain: 2638,
        elevationLoss: 3235,
        cutoff: "SUNDAY 26/07, 16h00",
        aidStations: [
            { name: "Luan", type: "Standard", km: 362.0 },
            { name: "Col de Chaude", type: "Standard", km: 378.0 },
            { name: "Montreux", type: "Finish", km: 394.0 }
        ]
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
        enrichSectionDataWithGPX();
        populateTable();
        renderElevationChart();

    } catch (error) {
        console.error("Error loading GPX:", error);
    }
}

function enrichSectionDataWithGPX() {
    sectionData.forEach(section => {
        section.aidStations.forEach(station => {
            // Find closest GPX point
            let closest = gpxData[0];
            let minDiff = Math.abs(station.km - closest.dist);
            for (let i = 1; i < gpxData.length; i++) {
                let diff = Math.abs(station.km - gpxData[i].dist);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = gpxData[i];
                }
            }
            station.ele = closest.ele;
        });
    });
}

function renderElevationChart() {
    // Simplify data to prevent browser lag (e.g., take every 10th point)
    const sampledData = gpxData.filter((_, index) => index % 10 === 0);

    const distances = sampledData.map(d => d.dist.toFixed(1));
    const elevations = sampledData.map(d => d.ele);

    // Calculate section boundaries for the chart
    let cumulativeBoundary = 0;
    const verticalLines = sectionData.map(s => {
        cumulativeBoundary += s.distance;
        return cumulativeBoundary;
    });

    // Custom plugin to draw vertical lines
    const verticalLinePlugin = {
        id: 'verticalLines',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;

            ctx.save();
            ctx.strokeStyle = 'rgba(255, 99, 132, 0.8)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            let sectionIndex = 1;
            verticalLines.forEach(km => {
                // Find matching index in labels
                const labelIndex = distances.findIndex(d => parseFloat(d) >= km);
                if (labelIndex !== -1) {
                    const x = xAxis.getPixelForTick(labelIndex);

                    ctx.beginPath();
                    ctx.moveTo(x, yAxis.top);
                    ctx.lineTo(x, yAxis.bottom);
                    ctx.stroke();

                    // Draw Section label
                    ctx.fillStyle = 'rgba(255, 99, 132, 0.8)';
                    ctx.textAlign = 'center';
                    ctx.fillText(`S${sectionIndex}`, x - 10, yAxis.top + 15);
                }
                sectionIndex++;
            });
            ctx.restore();
        }
    };

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
        plugins: [verticalLinePlugin],
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
    tableBody.innerHTML = '';

    let cumulativeDistance = 0;

    sectionData.forEach((section, index) => {
        cumulativeDistance += section.distance;
        const sectionId = `section-${section.section}`;

        const row = document.createElement("tr");
        row.className = "section-row";
        row.id = `${sectionId}-row`;
        row.onclick = () => toggleSection(sectionId);

        row.innerHTML = `
            <td>
                <span class="expand-icon">▶</span>
                Section ${section.section}: ${section.startEnd}
            </td>
            <td>${section.distance.toFixed(1)}</td>
            <td>${cumulativeDistance.toFixed(1)}</td>
            <td>${section.elevationGain}</td>
            <td>${section.elevationLoss}</td>
            <td>${section.cutoff}</td>
            <td class="est-elapsed" data-km="${cumulativeDistance}">-</td>
            <td class="est-tod" data-km="${cumulativeDistance}">-</td>
        `;
        tableBody.appendChild(row);

        // Add Aid Stations
        let prevKm = index === 0 ? 0 : sectionData[index-1].aidStations[sectionData[index-1].aidStations.length-1].km;

        section.aidStations.forEach(station => {
            const stationDist = station.km - prevKm;
            prevKm = station.km;

            const stRow = document.createElement("tr");
            stRow.className = `station-row ${sectionId}`;

            stRow.innerHTML = `
                <td class="station-cell">↳ ${station.name} (${station.type}) - ${Math.round(station.ele)}m</td>
                <td>${stationDist.toFixed(1)}</td>
                <td>${station.km.toFixed(1)}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="est-elapsed" data-km="${station.km}">-</td>
                <td class="est-tod" data-km="${station.km}">-</td>
            `;
            tableBody.appendChild(stRow);
        });
    });

    calculateTimes(); // Initial calculation
}

function toggleSection(sectionId) {
    const rows = document.querySelectorAll(`.${sectionId}`);
    // Use closest section-row instead of exact onclick match which might be parsed differently
    const sectionRow = document.querySelector(`#${sectionId}-row`);

    rows.forEach(row => {
        row.classList.toggle('visible');
    });
    if (sectionRow) {
        sectionRow.classList.toggle('expanded');
    }
}

function initCalculator() {
    const targetInput = document.getElementById('target-time');
    targetInput.addEventListener('input', calculateTimes);
}

function calculateTimes() {
    const targetHours = parseFloat(document.getElementById('target-time').value);
    if (isNaN(targetHours) || targetHours <= 0) return;

    const totalDist = 394.0;
    const c = 1.2; // Fatigue factor
    const startDate = new Date(2026, 6, 19, 8, 0); // Sunday 19 July 2026, 08:00

    // Update all elapsed time cells
    document.querySelectorAll('.est-elapsed').forEach(cell => {
        const km = parseFloat(cell.getAttribute('data-km'));
        if (km === 0) return;

        // Riegel formula
        const t_x = targetHours * Math.pow((km / totalDist), c);

        const hours = Math.floor(t_x);
        const minutes = Math.round((t_x - hours) * 60);
        cell.textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    });

    // Update all Time of Day cells
    document.querySelectorAll('.est-tod').forEach(cell => {
        const km = parseFloat(cell.getAttribute('data-km'));
        if (km === 0) return;

        const t_x = targetHours * Math.pow((km / totalDist), c);

        const arrivalDate = new Date(startDate.getTime() + t_x * 3600000);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[arrivalDate.getDay()];
        const hrs = arrivalDate.getHours().toString().padStart(2, '0');
        const mins = arrivalDate.getMinutes().toString().padStart(2, '0');

        cell.textContent = `${dayName} ${hrs}:${mins}`;
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    populateTable();
    initCalculator();
});
