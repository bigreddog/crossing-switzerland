import re

content = open("script.js", "r").read()

luan_cutoff_code = """
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
"""

content = re.sub(r'section: 10,[\s\S]*?aidStations: \[\s*\{ name: "Luan", type: "Standard", km: 366\.0 \},\s*\{ name: "Col de Chaude", type: "Standard", km: 378\.0 \},\s*\{ name: "Montreux", type: "Finish", km: 398\.0 \}\s*\]', luan_cutoff_code.strip(), content)

with open("script.js", "w") as f:
    f.write(content)
