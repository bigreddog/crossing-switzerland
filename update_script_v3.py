import re

new_sections = """const sectionData = [
    {
        section: 1,
        startEnd: "Bad Ragaz - Rüti GL",
        distance: 78.5,
        elevationGain: 5357,
        elevationLoss: 5248,
        cutoff: "MONDAY 20/07, 11h00",
        aidStations: [
            { name: "Pizolhütte", type: "Standard", km: 12.1 },
            { name: "Alp Ramin", type: "Standard", km: 34.8 },
            { name: "Obererbs", type: "Standard", km: 52.9 },
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
            { name: "Luan", type: "Standard", km: 366.0 },
            { name: "Col de Chaude", type: "Standard", km: 378.0 },
            { name: "Montreux", type: "Finish", km: 398.0 }
        ]
    }
];"""

with open("script.js", "r") as f:
    content = f.read()

content = re.sub(r'const sectionData = \[.*?\];', new_sections, content, flags=re.DOTALL)

with open("script.js", "w") as f:
    f.write(content)
