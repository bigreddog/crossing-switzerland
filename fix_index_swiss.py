import re

content = open("index.html", "r").read()

content = content.replace('    <!-- Leaflet Swiss -->\n    <script src="https://unpkg.com/leaflet-tilelayer-swiss@2.3.0/dist/leaflet-tilelayer-swiss.umd.js"></script>', '')

with open("index.html", "w") as f:
    f.write(content)
