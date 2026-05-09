from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Error: {err}"))
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)
    browser.close()
