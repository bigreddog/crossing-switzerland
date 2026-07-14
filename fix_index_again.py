import re

content = open("index.html", "r").read()

leaflet_swiss_code = """
    <!-- Leaflet Fullscreen CSS -->
    <link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' rel='stylesheet' />
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
</head>
"""

content = content.replace('<!-- Custom CSS -->\n    <link rel="stylesheet" href="style.css">\n</head>', leaflet_swiss_code.strip())

leaflet_js_code = """
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <!-- Leaflet Fullscreen JS -->
    <script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js'></script>
    <!-- Leaflet Swiss -->
    <script src="https://unpkg.com/leaflet-tilelayer-swiss@2.3.0/dist/leaflet-tilelayer-swiss.umd.js"></script>
"""

content = content.replace('<!-- Leaflet JS -->\n    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>', leaflet_js_code.strip())

with open("index.html", "w") as f:
    f.write(content)
