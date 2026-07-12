with open("script.js", "r") as f:
    content = f.read()

content = content.replace('{ name: "Grindelwald", type: "Base Camp", km: 205.7 }', '{ name: "Grindelwald", type: "Standard", km: 205.7 }')

with open("script.js", "w") as f:
    f.write(content)
