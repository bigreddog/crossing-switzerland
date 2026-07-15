// Data from roadbook PDF
const sectionData = [
    {
        section: 1,
        startEnd: "Bad Ragaz - Rüti GL",
        distance: 78.5,
        elevationGain: 5357,
        elevationLoss: 5248,
        cutoff: "MONDAY 20/07, 11h00",
        aidStations: [
            { name: "Pizolhütte", type: "Standard", km: 12.1 },
            { name: "Weisstannen", type: "Standard", km: 30.0 },
            { name: "Alp Ramin", type: "Standard", km: 45.0 },
            { name: "Obererbs", type: "Standard", km: 63.1 },
            { name: "Rüti GL", type: "Base Camp", km: 78.8 }
        ]
    },
    {
        section: 2,
        startEnd: "Rüti GL - Altdorf",
        distance: 41.2,
        elevationGain: 1934,
        elevationLoss: 2090,
        cutoff: "TUESDAY 21/07, 05h00",
        aidStations: [
            { name: "Klausen", type: "Standard", km: 89.2 },
            { name: "Altdorf", type: "Base Camp", km: 120.0 }
        ]
    },
    {
        section: 3,
        startEnd: "Altdorf - Engelberg",
        distance: 30.0,
        elevationGain: 1929,
        elevationLoss: 1388,
        cutoff: "-",
        aidStations: [
            { name: "Blackenalp", type: "Standard", km: 127.1 },
            { name: "Engelberg", type: "Standard", km: 150.0 }
        ]
    },
    {
        section: 4,
        startEnd: "Engelberg - Meiringen",
        distance: 36.2,
        elevationGain: 1934,
        elevationLoss: 2275,
        cutoff: "WEDNESDAY 22/07, 10h00",
        aidStations: [
            { name: "Melchsee-Frutt", type: "Standard", km: 168.7 },
            { name: "Meiringen", type: "Base Camp", km: 186.2 }
        ]
    },
    {
        section: 5,
        startEnd: "Meiringen - Grindelwald",
        distance: 19.5,
        elevationGain: 1450,
        elevationLoss: 819,
        cutoff: "-",
        aidStations: [
            { name: "Grindelwald", type: "Standard", km: 205.7 }
        ]
    },
    {
        section: 6,
        startEnd: "Grindelwald - Lauterbrunnen",
        distance: 24.1,
        elevationGain: 1347,
        elevationLoss: 1247,
        cutoff: "THURSDAY 23/07, 05h00",
        aidStations: [
            { name: "Lauterbrunnen", type: "Base Camp", km: 229.0 }
        ]
    },
    {
        section: 7,
        startEnd: "Lauterbrunnen - Adelboden",
        distance: 55.7,
        elevationGain: 4361,
        elevationLoss: 3822,
        cutoff: "FRIDAY 24/07, 08h00",
        aidStations: [
            { name: "Gspaltenhornhütte", type: "Self-Service", km: 238.7 },
            { name: "Kandersteg", type: "Standard", km: 258.0 },
            { name: "Adelboden", type: "Base Camp", km: 285.5 }
        ]
    },
    {
        section: 8,
        startEnd: "Adelboden - Les Diablerets",
        distance: 60.1,
        elevationGain: 3579,
        elevationLoss: 3587,
        cutoff: "SATURDAY 25/07, 12h00",
        aidStations: [
            { name: "Iffigenalp", type: "Standard", km: 295.4 },
            { name: "Gsteig", type: "Self-Service", km: 320.0 },
            { name: "Les Diablerets", type: "Base Camp", km: 343.0 }
        ]
    },
    {
        section: 9,
        startEnd: "Les Diablerets - Le Sépey",
        distance: 10.9,
        elevationGain: 464,
        elevationLoss: 826,
        cutoff: "-",
        aidStations: [
            { name: "Le Sépey", type: "Standard", km: 354.4 }
        ]
    },
    {
        section: 10,
        startEnd: "Le Sépey - Montreux",
        distance: 44.2,
        elevationGain: 2643,
        elevationLoss: 3233,
        cutoff: "SUNDAY 26/07, 16h00",
        aidStations: [
            { name: "Luan", type: "Standard", km: 366.0, cutoff: "SUNDAY 26/07, 03h00" },
            { name: "Col de Chaude", type: "Standard", km: 378.0 },
            { name: "Montreux", type: "Finish", km: 398.0 }
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
    map = L.map('map', {
        crs: L.CRS.EPSG3857, // or L.CRS.EPSG2056 depending on how leaflet-tilelayer-swiss works by default, but it handles it internally usually. Let's just use normal first.
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([46.8, 8.2], 8); // Center of Switzerland

    // Base maps
    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const swissTopo = L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', {
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>',
        minZoom: 2,
        maxZoom: 18,
        bounds: [[45.398181, 5.715944], [48.230651, 10.951754]]
    });

    // Add Swiss Topo as default
    swissTopo.addTo(map);

    const baseMaps = {
        "Swiss Topo (Swisstopo)": swissTopo,
        "OpenStreetMap": openStreetMap
    };

    L.control.layers(baseMaps).addTo(map);

    // Custom "Locate Me" Control
    let locateActive = false;
    let locateWatchId = null;

    L.Control.Locate = L.Control.extend({
        onAdd: function(map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

            container.style.backgroundColor = 'white';
            container.style.width = '30px';
            container.style.height = '30px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.cursor = 'pointer';
            container.title = "Toggle Location Tracking";
            container.innerHTML = "📍";

            container.onclick = function(){
                if (!locateActive) {
                    locateActive = true;
                    container.style.backgroundColor = '#ecf0f1'; // highlight when active
                    map.locate({setView: true, maxZoom: 14, watch: true});
                } else {
                    locateActive = false;
                    container.style.backgroundColor = 'white';
                    map.stopLocate();
                    if (userMarker) {
                        map.removeLayer(userMarker);
                        map.removeLayer(userCircle);
                        userMarker = null;
                        userCircle = null;
                    }
                }
            }
            return container;
        }
    });

    map.addControl(new L.Control.Locate({position: 'topleft'}));

    // Geolocation Event Handlers
    let userMarker, userCircle;

    map.on('locationfound', function(e) {
        const radius = e.accuracy / 2;

        if (userMarker) {
            map.removeLayer(userMarker);
            map.removeLayer(userCircle);
        }

        userMarker = L.marker(e.latlng).addTo(map)
            .bindPopup(`You are within ${radius.toFixed(0)} meters from this point`).openPopup();

        userCircle = L.circle(e.latlng, radius).addTo(map);
    });

    map.on('locationerror', function(e) {
        if (locateActive) {
            alert("Geolocation access failed or was denied.");
            locateActive = false;
            map.stopLocate();
        }
    });

    loadGPX();
}

async function loadGPX() {
    try {
        const response = await fetch('CROSSING SWITZERLAND 2026 (1).gpx');
        const text = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const trkpts = xmlDoc.getElementsByTagName("trkpt");

        let latlngs = [];
        let cumulativeDistance = 0;
        let cumGain = 0;
        let cumLoss = 0;

        for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute("lat"));
            const lon = parseFloat(trkpts[i].getAttribute("lon"));
            const eleNode = trkpts[i].getElementsByTagName("ele")[0];
            const ele = eleNode ? parseFloat(eleNode.textContent) : 0;

            if (i > 0) {
                const prevLat = parseFloat(trkpts[i-1].getAttribute("lat"));
                const prevLon = parseFloat(trkpts[i-1].getAttribute("lon"));
                cumulativeDistance += calculateDistance(prevLat, prevLon, lat, lon);

                const prevEleNode = trkpts[i-1].getElementsByTagName("ele")[0];
                const prevEle = prevEleNode ? parseFloat(prevEleNode.textContent) : 0;

                if (ele > prevEle) {
                    cumGain += (ele - prevEle);
                } else if (ele < prevEle) {
                    cumLoss += (prevEle - ele);
                }
            }

            latlngs.push([lat, lon]);
            gpxData.push({
                lat: lat,
                lon: lon,
                ele: ele,
                dist: cumulativeDistance,
                cumGain: cumGain,
                cumLoss: cumLoss
            });
        }

        // Draw route on map
        const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());

        addAidStationMarkers();
        enrichSectionDataWithGPX();
        populateTable();
        renderElevationChart();
        populateClimbsTable();

    } catch (error) {
        console.error("Error loading GPX:", error);
    }
}

function enrichSectionDataWithGPX() {
    // Determine exact start of section 1 (distance 0)
    let prevCumGain = 0;
    let prevCumLoss = 0;

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

            // Segment gain/loss since last station (or race start)
            station.segGain = Math.max(0, Math.round(closest.cumGain - prevCumGain));
            station.segLoss = Math.max(0, Math.round(closest.cumLoss - prevCumLoss));

            prevCumGain = closest.cumGain;
            prevCumLoss = closest.cumLoss;
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


    const chartData = distances.map((dist, index) => ({
        x: parseFloat(dist),
        y: elevations[index]
    }));

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
                const x = xAxis.getPixelForValue(km);

                ctx.beginPath();
                ctx.moveTo(x, yAxis.top);
                ctx.lineTo(x, yAxis.bottom);
                ctx.stroke();

                ctx.fillStyle = 'rgba(255, 99, 132, 0.8)';
                ctx.textAlign = 'center';
                ctx.fillText(`S${sectionIndex}`, x - 10, yAxis.top + 15);

                sectionIndex++;
            });
            ctx.restore();
        }
    };

    const ctx = document.getElementById('elevationChart').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                type: 'line',
                label: 'Elevation (m)',
                data: chartData,
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
                    type: 'linear',
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
                            return `Dist: ${context.parsed.x} km, Ele: ${context.parsed.y} m`;
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


        let markerColor = 'blue';
        let type = 'Standard';

        // Find if it's a base camp from sectionData
        for (let s of sectionData) {
            for (let a of s.aidStations) {
                if (a.name === station.name) {
                    type = a.type;
                    if (a.type === 'Base Camp') {
                        markerColor = 'red';
                    }
                    break;
                }
            }
        }

        const myIcon = L.icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`,
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        L.marker([closestPoint.lat, closestPoint.lon], {icon: myIcon})
            .addTo(map)
            .bindPopup(`<b>${station.name}</b><br>Km: ${station.km}<br>Type: ${type}`);

    });
}

const aidStations = [
    { name: "Pizolhütte", km: 12.1 },
    { name: "Weisstannen", km: 30.0 },
    { name: "Alp Ramin", km: 45.0 },
    { name: "Obererbs", km: 63.1 },
    { name: "Rüti GL", km: 78.8 },
    { name: "Klausen", km: 89.2 },
    { name: "Altdorf", km: 120.0 },
    { name: "Blackenalp", km: 127.1 },
    { name: "Engelberg", km: 150.0 },
    { name: "Melchsee-Frutt", km: 168.7 },
    { name: "Meiringen", km: 186.2 },
    { name: "Grindelwald", km: 205.7 },
    { name: "Lauterbrunnen", km: 229.0 },
    { name: "Gspaltenhornhütte", km: 238.7 },
    { name: "Kandersteg", km: 258.0 },
    { name: "Adelboden", km: 285.5 },
    { name: "Iffigenalp", km: 295.4 },
    { name: "Gsteig", km: 320.0 },
    { name: "Les Diablerets", km: 343.0 },
    { name: "Le Sépey", km: 354.4 },
    { name: "Luan", km: 366.0 },
    { name: "Col de Chaude", km: 378.0 },
    { name: "Montreux", km: 398.0 } // Estimated final distance
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

        // Start of section distance for section time calculations
        const sectionStartKm = cumulativeDistance - section.distance;

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
            <td class="est-section" data-km="${cumulativeDistance}" data-prev-km="${sectionStartKm}">-</td>
            <td class="est-elapsed" data-km="${cumulativeDistance}">-</td>
            <td class="est-tod" data-km="${cumulativeDistance}">-</td>
        `;
        tableBody.appendChild(row);

        // Add Aid Stations
        let prevKm = index === 0 ? 0 : sectionData[index-1].aidStations[sectionData[index-1].aidStations.length-1].km;

        section.aidStations.forEach(station => {
            const stationDist = station.km - prevKm;
            const tempPrevKm = prevKm;
            prevKm = station.km;

            const stRow = document.createElement("tr");
            stRow.className = `station-row ${sectionId}`;

            stRow.innerHTML = `
                <td class="station-cell">↳ ${station.name} (${station.type}) - ${Math.round(station.ele)}m</td>
                <td>${stationDist.toFixed(1)}</td>
                <td>${station.km.toFixed(1)}</td>
                <td>${station.segGain}</td>
                <td>${station.segLoss}</td>
                <td>${station.cutoff || '-'}</td>
                <td class="est-section" data-km="${station.km}" data-prev-km="${tempPrevKm}">-</td>
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

    // Load from local storage if available
    const savedTime = localStorage.getItem('raceTargetTime');
    if (savedTime) {
        targetInput.value = savedTime;
    }

    targetInput.addEventListener('input', (e) => {
        localStorage.setItem('raceTargetTime', e.target.value);
        calculateTimes();
    });
}

function calculateTimes() {
    const targetHours = parseFloat(document.getElementById('target-time').value);
    if (isNaN(targetHours) || targetHours <= 0) return;

    const totalDist = 394.0;
    const c = 1.2; // Fatigue factor
    const startDate = new Date(2026, 6, 19, 8, 0); // Sunday 19 July 2026, 08:00

    // Update all section time cells
    document.querySelectorAll('.est-section').forEach(cell => {
        const km = parseFloat(cell.getAttribute('data-km'));
        const prevKm = parseFloat(cell.getAttribute('data-prev-km'));
        if (km === 0 || isNaN(prevKm)) return;

        const t_x_current = targetHours * Math.pow((km / totalDist), c);
        const t_x_prev = targetHours * Math.pow((prevKm / totalDist), c);
        const t_diff = t_x_current - t_x_prev;

        const hours = Math.floor(t_diff);
        const minutes = Math.round((t_diff - hours) * 60);
        cell.textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    });

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

function populateClimbsTable() {
    const climbsTableBody = document.getElementById("climbs-table-body");
    if (!climbsTableBody) return;
    climbsTableBody.innerHTML = '';

    if (!gpxData || gpxData.length === 0) return;

    let currentSectionIdx = 0;
    let sectionStartDist = 0;
    let nextSectionDist = sectionData[0].distance;

    // Minimum elevation change to consider a "major" climb/descent
    const ELE_THRESHOLD = 50;

    // A prominence-based approach to group continuous climbs/descents
    // We allow counter-elevation up to a certain threshold before breaking a segment.
    const COUNTER_ELE_THRESHOLD = 30; // 30m of counter-elevation breaks a segment

    let rawSegments = [];

    let currentSegType = null; // "Climb" or "Descent"
    let startIdx = 0;
    let extremeIdx = 0; // The index of the highest/lowest point seen in the current segment

    for (let i = 1; i < gpxData.length; i++) {
        let currentEle = gpxData[i].ele;
        let extremeEle = gpxData[extremeIdx].ele;
        let eleDiffFromExtreme = currentEle - extremeEle;

        if (currentSegType === null) {
            let initialDiff = currentEle - gpxData[0].ele;
            if (initialDiff > 0) {
                currentSegType = "Climb";
            } else if (initialDiff < 0) {
                currentSegType = "Descent";
            }
            extremeIdx = i;
            continue;
        }

        if (currentSegType === "Climb") {
            if (currentEle > extremeEle) {
                extremeIdx = i; // New peak
            } else if (eleDiffFromExtreme < -COUNTER_ELE_THRESHOLD) {
                // Break segment at extremeIdx
                rawSegments.push({ type: "Climb", startIdx: startIdx, endIdx: extremeIdx });
                currentSegType = "Descent";
                startIdx = extremeIdx;
                extremeIdx = i;
            }
        } else if (currentSegType === "Descent") {
            if (currentEle < extremeEle) {
                extremeIdx = i; // New valley
            } else if (eleDiffFromExtreme > COUNTER_ELE_THRESHOLD) {
                // Break segment at extremeIdx
                rawSegments.push({ type: "Descent", startIdx: startIdx, endIdx: extremeIdx });
                currentSegType = "Climb";
                startIdx = extremeIdx;
                extremeIdx = i;
            }
        }
    }

    if (startIdx < gpxData.length - 1) {
        let eleChange = gpxData[gpxData.length - 1].ele - gpxData[startIdx].ele;
        let finalType = eleChange > 0 ? "Climb" : "Descent";
        rawSegments.push({ type: finalType, startIdx: startIdx, endIdx: gpxData.length - 1 });
    }

    // Process rawSegments and split at section boundaries
    let segments = [];

    // Get cumulative boundaries
    let boundaries = [];
    let cumul = 0;
    for (let i = 0; i < sectionData.length; i++) {
        cumul += sectionData[i].distance;
        boundaries.push({ section: sectionData[i].section, limit: cumul });
    }

    rawSegments.forEach(rawSeg => {
        let segStartDist = gpxData[rawSeg.startIdx].dist;
        let segEndDist = gpxData[rawSeg.endIdx].dist;

        // Find which boundaries fall inside this segment
        let splitPoints = [rawSeg.startIdx];

        for (let b of boundaries) {
            if (b.limit > segStartDist + 0.1 && b.limit < segEndDist - 0.1) {
                // Find the closest index to this boundary
                let closestIdx = rawSeg.startIdx;
                let minDiff = Math.abs(gpxData[closestIdx].dist - b.limit);
                for (let k = rawSeg.startIdx + 1; k <= rawSeg.endIdx; k++) {
                    let diff = Math.abs(gpxData[k].dist - b.limit);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIdx = k;
                    }
                }
                if (!splitPoints.includes(closestIdx)) {
                    splitPoints.push(closestIdx);
                }
            }
        }

        if (!splitPoints.includes(rawSeg.endIdx)) {
            splitPoints.push(rawSeg.endIdx);
        }

        splitPoints.sort((a, b) => a - b);

        for (let j = 0; j < splitPoints.length - 1; j++) {
            let sIdx = splitPoints[j];
            let eIdx = splitPoints[j+1];

            let startPoint = gpxData[sIdx];
            let endPoint = gpxData[eIdx];

            let length = endPoint.dist - startPoint.dist;
            let eleChange = endPoint.ele - startPoint.ele;

            if (length > 0.1 && Math.abs(eleChange) >= ELE_THRESHOLD) {
                segments.push({
                    type: rawSeg.type,
                    startDist: startPoint.dist,
                    length: length,
                    eleChange: eleChange,
                    avgGrade: (Math.abs(eleChange) / (length * 1000)) * 100,
                    sectionName: getSectionForDist((startPoint.dist + endPoint.dist) / 2)
                });
            }
        }
    });

    let currentRenderSection = "";
    segments.forEach(seg => {
        if (seg.sectionName !== currentRenderSection) {
            currentRenderSection = seg.sectionName;

            // Default first section expanded, others collapsed
            const isFirstSection = (currentRenderSection === getSectionForDist(0));

            let sectionRow = document.createElement("tr");
            sectionRow.className = "section-header-row climb-section-header";
            sectionRow.style.cursor = "pointer";
            sectionRow.style.backgroundColor = "#ecf0f1";

            // Find section details for the name
            let secDetails = sectionData.find(s => s.section == currentRenderSection);
            let sectionDisplayName = secDetails ? `Section ${secDetails.section}: ${secDetails.startEnd}` : `Section ${currentRenderSection}`;

            sectionRow.innerHTML = `
                <td colspan="5" style="text-align: left; font-weight: bold;">
                    ${sectionDisplayName}
                    <span class="toggle-icon" style="float: right;">${isFirstSection ? '▼' : '▶'}</span>
                </td>
            `;
            climbsTableBody.appendChild(sectionRow);

            // Add click listener for expansion
            sectionRow.addEventListener('click', function() {
                let currentIsExpanded = this.querySelector('.toggle-icon').textContent === '▼';
                let nextRows = [];
                let curr = this.nextElementSibling;
                while (curr && !curr.classList.contains('climb-section-header')) {
                    nextRows.push(curr);
                    curr = curr.nextElementSibling;
                }

                if (currentIsExpanded) {
                    this.querySelector('.toggle-icon').textContent = '▶';
                    nextRows.forEach(row => row.style.display = 'none');
                } else {
                    this.querySelector('.toggle-icon').textContent = '▼';
                    nextRows.forEach(row => row.style.display = '');
                }
            });
        }

        const row = document.createElement("tr");
        row.className = "climb-row";

        const isFirstSectionRow = (seg.sectionName === getSectionForDist(0));
        if (!isFirstSectionRow) {
            row.style.display = 'none'; // Collapse non-first sections by default
        }

        row.innerHTML = `
            <td>${seg.type === "Climb" ? "↗ Climb" : "↘ Descent"}</td>
            <td>${seg.startDist.toFixed(1)}</td>
            <td>${seg.length.toFixed(1)}</td>
            <td style="color: ${seg.type === 'Climb' ? '#27ae60' : '#c0392b'}; font-weight: bold;">
                ${seg.eleChange > 0 ? '+' : ''}${Math.round(seg.eleChange)}
            </td>
            <td>${seg.avgGrade.toFixed(1)}%</td>
        `;
        climbsTableBody.appendChild(row);
    });
}

function getSectionForDist(dist) {
    let cumul = 0;
    for (let i = 0; i < sectionData.length; i++) {
        cumul += sectionData[i].distance;
        if (dist <= cumul + 0.1) { // 0.1 buffer for float precision
            return sectionData[i].section;
        }
    }
    return sectionData[sectionData.length - 1].section; // default to last section if somehow over
}


// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initCalculator();
    // populateClimbsTable is called inside initMap -> parseGPX -> parseGPXData since we need gpxData loaded
});

// ==========================================
// PWA & Offline Map Downloading Logic
// ==========================================

function updateNetworkStatus() {
    const statusEl = document.getElementById('network-status');
    if (navigator.onLine) {
        statusEl.textContent = '● Online';
        statusEl.className = 'online';
    } else {
        statusEl.textContent = '● Offline';
        statusEl.className = 'offline';
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

// Convert lat/lon to slippy map tile X/Y
function lon2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }
function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }

async function downloadMapTiles() {
    if (!gpxData || gpxData.length === 0) {
        alert("Route data not loaded yet. Please wait.");
        return;
    }

    const btn = document.getElementById('download-map-btn');
    const progressContainer = document.getElementById('download-progress-container');
    const progressBar = document.getElementById('download-progress-bar');
    const statusText = document.getElementById('download-status-text');

    btn.disabled = true;
    progressContainer.style.display = 'block';

    // Zoom levels to cache
    const zoomLevels = [12, 13, 14, 15];
    const tilesToFetch = new Set(); // Use Set to avoid duplicates

    statusText.textContent = "Calculating required tiles...";

    // Calculate required tiles along the route
    zoomLevels.forEach(z => {
        // Sample points to reduce calculation time, route points are dense
        for (let i = 0; i < gpxData.length; i += 10) {
            let pt = gpxData[i];
            let tx = lon2tile(pt.lon, z);
            let ty = lat2tile(pt.lat, z);

            // Add tile and a 1-tile buffer around it
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    tilesToFetch.add(`${z}/${tx + dx}/${ty + dy}`);
                }
            }
        }
    });

    const tilesArray = Array.from(tilesToFetch);
    const totalTiles = tilesArray.length;
    let downloaded = 0;

    statusText.textContent = `Downloading ${totalTiles} tiles...`;

    // Open the cache where SW expects map tiles
    const cache = await caches.open('map-tiles-cache');

    const BATCH_SIZE = 5; // Download 5 tiles concurrently to avoid overwhelming browser/network

    for (let i = 0; i < totalTiles; i += BATCH_SIZE) {
        const batch = tilesArray.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (tileCoord) => {
            const [z, x, y] = tileCoord.split('/');
            const tileUrl = `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/${z}/${x}/${y}.jpeg`;

            try {
                // Check if already cached
                const response = await cache.match(tileUrl);
                if (!response) {
                    await cache.add(tileUrl);
                }
            } catch (err) {
                console.warn(`Failed to cache tile ${tileUrl}`, err);
            }

            downloaded++;
        }));

        // Update UI
        let progress = (downloaded / totalTiles) * 100;
        progressBar.style.width = `${progress}%`;
        statusText.textContent = `Downloaded ${downloaded} / ${totalTiles} tiles (${Math.round(progress)}%)`;
    }

    statusText.textContent = "Download complete! Map is ready for offline use.";
    btn.disabled = false;
    setTimeout(() => {
        progressContainer.style.display = 'none';
        btn.innerText = 'Update Offline Map';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to download button
    document.getElementById('download-map-btn').addEventListener('click', downloadMapTiles);
});

// ==========================================
