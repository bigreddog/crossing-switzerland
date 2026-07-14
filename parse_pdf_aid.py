import fitz # PyMuPDF
doc = fitz.open('Roadbook 2026 (A5 ENGLISH)-compressed.pdf')
with open("roadbook_text_july.txt", "w") as f:
    for page in doc:
        f.write(page.get_text())
