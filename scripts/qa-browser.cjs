const { chromium, devices } = require(require('node:path').join(require('node:os').tmpdir(), 'nc-elec-qa/node_modules/playwright'));
const assert = require('node:assert/strict');
const fs = require('node:fs');

const base = process.env.QA_URL || 'http://localhost:3000';
const output = 'artifacts/preview';
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { viewports: [], checks: [], errors: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const id of ['services', 'realisations', 'a-propos', 'avis', 'contact']) {
        await page.locator('#' + id).scrollIntoViewIfNeeded();
      }
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, images: [...document.images].map(image => ({ src: new URL(image.currentSrc).pathname, loaded: image.naturalWidth > 0 })), font: getComputedStyle(document.body).fontFamily }));
      assert(layout.scroll <= layout.width, 'Horizontal overflow at ' + viewport.width);
      assert.equal(await page.locator('.service-card').count(), 6);
      assert.equal(await page.locator('.comparison-image').count(), 2);
      const comparisons = await page.locator('.comparison-image').evaluateAll(elements => elements.map(element => { const box = element.getBoundingClientRect(); return { x: box.x, y: box.y }; }));
      if (viewport.width >= 768) assert(Math.abs(comparisons[0].y - comparisons[1].y) < 2, 'Both projects must be side by side');
      else assert(comparisons[1].y > comparisons[0].y, 'Projects must stack on mobile');
      await page.locator('#realisations').screenshot({ path: output + '/realisations-' + viewport.width + '.png', style: '.site-header { visibility: hidden; }' });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: output + '/' + viewport.width + '.png', fullPage: true });
      if (viewport.width === 1440) {
        await page.screenshot({ path: output + '/desktop-hero.png' });
        await page.locator('.comparison-image').first().scrollIntoViewIfNeeded();
        const range = page.locator('.comparison-controls input').first();
        await range.focus();
        await page.keyboard.press('ArrowRight');
        assert.equal(await range.inputValue(), '51');
        await page.keyboard.press('Home');
        assert.equal(await range.inputValue(), '0');
        await page.keyboard.press('End');
        assert.equal(await range.inputValue(), '100');
        await range.fill('50');
        const bounds = await page.locator('.comparison-image').first().boundingBox();
        await page.mouse.move(bounds.x + bounds.width * .2, bounds.y + bounds.height * .45);
        await page.mouse.down();
        assert.equal(await range.inputValue(), '50', 'No jump on first pointer contact');
        await page.mouse.move(bounds.x + bounds.width * .4, bounds.y + bounds.height * .45, { steps: 12 });
        await page.mouse.up();
        assert(Math.abs(Number(await range.inputValue()) - 70) < 1);
        const secondRange = page.locator('.comparison-controls input').nth(1);
        assert.equal(await secondRange.inputValue(), '50', 'First comparator must not change the second');
        await secondRange.focus();
        await page.keyboard.press('ArrowLeft');
        assert.equal(await secondRange.inputValue(), '49');
        assert(Math.abs(Number(await range.inputValue()) - 70) < 1, 'Second comparator must not change the first');
        const secondBounds = await page.locator('.comparison-image').nth(1).boundingBox();
        await page.mouse.move(secondBounds.x + secondBounds.width * .5, secondBounds.y + secondBounds.height * .5);
        await page.mouse.down();
        await page.mouse.move(secondBounds.x + secondBounds.width * .7, secondBounds.y + secondBounds.height * .5, { steps: 10 });
        await page.mouse.up();
        assert(Math.abs(Number(await secondRange.inputValue()) - 69) < 1, 'Second comparator supports drag');
        await page.locator('.comparison-figure').first().screenshot({ path: output + '/comparateur.png' });
        report.checks.push('Comparison: keyboard, endpoints, drag and no first-contact jump');
        await page.getByRole('link', { name: 'Échangeons sur votre projet', exact: true }).click();
        assert.equal(await page.locator('#requestType').inputValue(), 'rendez-vous');
        const targetTop = await page.locator('#contact').evaluate(element => element.getBoundingClientRect().top);
        assert(targetTop >= 108, 'Contact title must not be hidden behind header');
        await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
        assert(await page.locator('#name-error').isVisible());
        await page.locator('#name').fill('TEST VISUEL — ne pas traiter');
        await page.locator('#phone').fill('0600000000');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#projectType').selectOption('Maintenance');
        await page.locator('#message').fill('Données fictives pour vérifier le formulaire et ses erreurs.');
        const expectedConsoleCount = report.errors.length;
        await page.route('**/api/contact', route => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'Erreur de test simulée : saisies conservées.' }) }));
        await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
        await page.getByRole('alert').filter({ hasText: 'Erreur de test simulée' }).waitFor();
        assert.equal(await page.locator('#name').inputValue(), 'TEST VISUEL — ne pas traiter');
        // A deliberate HTTP 502 creates one expected browser resource error.
        report.errors.splice(expectedConsoleCount, report.errors.length - expectedConsoleCount);
        await page.unroute('**/api/contact');
        let requests = 0;
        await page.route('**/api/contact', async route => {
          requests += 1;
          await new Promise(resolve => setTimeout(resolve, 350));
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'accepted', id: 'mock-only' }) });
        });
        await page.getByRole('button', { name: 'Envoyer ma demande' }).evaluate(button => { button.click(); button.click(); });
        await page.getByRole('status').filter({ hasText: 'Aucun rendez-vous' }).waitFor();
        assert.equal(requests, 1, 'No duplicate request');
        assert.equal(await page.locator('#name').inputValue(), '');
        await page.unroute('**/api/contact');
        report.checks.push('Form: appointment intent, validation, preserved input on error, single submission, honest success message (provider responses mocked)');
        await page.locator('#contact').screenshot({ path: output + '/contact.png' });
      } else {
        const toggle = page.getByRole('button', { name: 'Ouvrir le menu' });
        await toggle.click();
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        await toggle.click();
        await page.locator('#mobile-navigation').getByRole('link', { name: 'Services', exact: true }).click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      }
      report.viewports.push(layout);
      await context.close();
    }
    const touch = await browser.newContext({ ...devices['Pixel 7'], reducedMotion: 'reduce' });
    const page = await touch.newPage();
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.comparison-image').first().scrollIntoViewIfNeeded();
    const box = await page.locator('.comparison-image').first().boundingBox();
    const cdp = await touch.newCDPSession(page);
    const x = box.x + box.width * .5;
    const y = Math.max(180, Math.min(550, box.y + box.height * .4));
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 10; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + step * 8, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert(Number(await page.locator('.comparison-controls input').first().inputValue()) > 60, 'Horizontal touch drag');
    const beforeScroll = await page.evaluate(() => scrollY);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 10; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 15 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(350);
    assert(await page.evaluate(() => scrollY) > beforeScroll + 30, 'Vertical scrolling over comparator');
    report.checks.push('Mobile: menu, horizontal touch drag and vertical scrolling over comparator');
    await touch.close();
    assert.deepEqual(report.errors, [], 'No unexpected browser errors');
    fs.writeFileSync(output + '/browser-report.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
