import re

content = open("script.js", "r").read()

replacements = [
    ('{ name: "Altdorf", km: 109.7 }', '{ name: "Altdorf", km: 120.0 }'),
    ('{ name: "Engelberg", km: 139.5 }', '{ name: "Engelberg", km: 150.0 }'),
    ('{ name: "Melchsee-Frutt", km: 158.4 }', '{ name: "Melchsee-Frutt", km: 168.7 }'),
    ('{ name: "Meiringen", km: 175.8 }', '{ name: "Meiringen", km: 186.2 }'),
    ('{ name: "Grindelwald", km: 194.8 }', '{ name: "Grindelwald", km: 205.7 }'),
    ('{ name: "Lauterbrunnen", km: 219.3 }', '{ name: "Lauterbrunnen", km: 229.0 }'),
    ('{ name: "Adelboden", km: 275.0 }', '{ name: "Adelboden", km: 285.5 }'),
    ('{ name: "Les Diablerets", km: 335.0 }', '{ name: "Les Diablerets", km: 343.0 }'),
    ('{ name: "Le Sépey", km: 349.5 }', '{ name: "Le Sépey", km: 354.4 }'),
    ('{ name: "Luan", km: 362.0 }', '{ name: "Luan", km: 366.0 }'),
    ('{ name: "Montreux", km: 394.0 }', '{ name: "Montreux", km: 398.0 }'),
    ('{ name: "Rüti GL", km: 68.5 }', '{ name: "Rüti GL", km: 78.8 }')
]

for old, new in replacements:
    content = content.replace(old, new)

with open("script.js", "w") as f:
    f.write(content)
