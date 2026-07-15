import fitz # PyMuPDF
import re

doc = fitz.open('Roadbook 2026 (A5 ENGLISH)-compressed.pdf')

for page in doc:
    text = page.get_text()
    if "TIME LIMIT" in text or re.search(r'\d+,\d+\s*KM\s*¦|\d+\s*KM\s*¦', text) or "KM ¦" in text or "KM" in text and "SECTION" in text:
        print("PAGE", page.number)
        print(text[:400])
