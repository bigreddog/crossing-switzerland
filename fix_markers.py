import re

content = open("script.js", "r").read()

marker_code = """
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
"""

content = re.sub(r'L\.marker\(\[closestPoint\.lat, closestPoint\.lon\]\)\s*\.addTo\(map\)\s*\.bindPopup\(`<b>\$\{station\.name\}<\/b><br>Km: \$\{station\.km\}`\);', marker_code, content)

# update aidStations array to reflect correct name for "Alp Ramin" so it matches sectionData
content = content.replace('{ name: "Alpramin", km: 34.8 }', '{ name: "Alp Ramin", km: 34.8 }')

with open("script.js", "w") as f:
    f.write(content)
