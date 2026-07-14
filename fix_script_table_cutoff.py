import re

content = open("script.js", "r").read()

table_row_code = """
            stRow.innerHTML = `
                <td class="station-cell">↳ ${station.name} (${station.type}) - ${Math.round(station.ele)}m</td>
                <td>${stationDist.toFixed(1)}</td>
                <td>${station.km.toFixed(1)}</td>
                <td>${station.segGain}</td>
                <td>${station.segLoss}</td>
                <td>${station.cutoff || '-'}</td>
                <td class="est-section" data-km="${station.km}" data-prev-km="${tempPrevKm}">-</td>
                <td class="est-elapsed" data-km="${station.km}">-</td>
                <td class="est-tod" data-km="${station.km}">-</td>
"""

content = re.sub(r'stRow\.innerHTML = `[\s\S]*?<td class="est-tod" data-km="\$\{station\.km\}">-<\/td>', table_row_code.strip(), content)

with open("script.js", "w") as f:
    f.write(content)
