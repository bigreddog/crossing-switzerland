import re

content = open("script.js", "r").read()

swiss_code = """
    // Base maps
    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const swissTopo = L.tileLayer.swiss({
        format: 'jpeg',
        maxNativeZoom: 18
    });
"""

fix_swiss_code = """
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
"""

content = content.replace(swiss_code, fix_swiss_code)

with open("script.js", "w") as f:
    f.write(content)
