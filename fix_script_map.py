import re

content = open("script.js", "r").read()

map_code = """
function initMap() {
    map = L.map('map', {
        crs: L.CRS.EPSG3857 // or L.CRS.EPSG2056 depending on how leaflet-tilelayer-swiss works by default, but it handles it internally usually. Let's just use normal first.
    }).setView([46.8, 8.2], 8); // Center of Switzerland

    // Base maps
    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const swissTopo = L.tileLayer.swiss({
        format: 'jpeg',
        maxNativeZoom: 18
    });

    // Add Swiss Topo as default
    swissTopo.addTo(map);

    const baseMaps = {
        "Swiss Topo (Swisstopo)": swissTopo,
        "OpenStreetMap": openStreetMap
    };

    L.control.layers(baseMaps).addTo(map);
"""

content = re.sub(r'function initMap\(\) \{[\s\S]*?\}\)\.addTo\(map\);', map_code.strip(), content)

with open("script.js", "w") as f:
    f.write(content)
