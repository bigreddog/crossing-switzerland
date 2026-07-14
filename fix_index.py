import re

content = open("index.html", "r").read()

leaflet_swiss_code = """
    <!-- Leaflet Swiss -->
    <script src="https://unpkg.com/leaflet-tilelayer-swiss@2.3.0/dist/leaflet-tilelayer-swiss.umd.js" integrity="sha384-NpbI1zQ55F7lC/qWXXn4oB7l+jLzR4uL3/l8XyY11Y5l0E7+4lU/BfF3hG/Z3+7+" crossorigin=""></script>
"""

content = content.replace('<!-- Chart.js -->', leaflet_swiss_code.strip() + '\n    <!-- Chart.js -->')

with open("index.html", "w") as f:
    f.write(content)
