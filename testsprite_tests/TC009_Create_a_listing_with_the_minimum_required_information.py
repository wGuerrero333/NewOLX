import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )
        context = await browser.new_context()
        context.set_default_timeout(15000)
        page = await context.new_page()
        # -> navigate
        await page.goto("http://localhost:3000/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Navigate to the listing form page at /formVenta.html
        await page.goto("http://localhost:3000/formVenta.html")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the product title field (index 486) with a unique title.
        # text input name="titulo"
        elem = page.locator("xpath=/html/body/div/form/input").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Prueba Ropa - \u00fanico 20260514-27C7")
        
        # -> Fill the product title field (index 486) with a unique title.
        # name="descripcion"
        elem = page.locator("xpath=/html/body/div/form/textarea").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Chaqueta de segunda mano en buen estado. Poco uso, sin da\u00f1os visibles. Color azul marino, talla M.")
        
        # -> Fill the product title field (index 486) with a unique title.
        # number input name="precio"
        elem = page.locator("xpath=/html/body/div/form/input[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("19.99")
        
        # -> Fill the product title field (index 486) with a unique title.
        # name="ubicacion"
        elem = page.locator("xpath=/html/body/div/form/textarea[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Madrid, Espa\u00f1a")
        
        # -> Final action — this is where the agent failed
        # Error observed by agent: File path test-image.jpg is not available. To fix: The user must add this file path to the available_file_paths parameter when creating the Agent. Example: Agent(task="...", llm=llm, browser=browser, 
        # file input name="imagen"
        elem = page.locator("xpath=/html/body/div/form/input[3]").nth(0)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/test-image.jpg")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/test-image.jpg")
        
        # --> Test blocked (AST guard fallback)
        raise AssertionError("Test blocked during agent run: " + "TEST BLOCKED The test could not be completed because the required product image file is not available to upload. Observations: - The file referenced for upload is not present in the environment (no available file paths). - The Imagen input shows 'File Selected: None'. - Upload and final submit cannot be verified without providing the image file.")
        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    