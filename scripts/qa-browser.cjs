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
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1100, height: 900 }, { width: 1024, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).click();
      assert(await page.locator('.carousel-slide').nth(1).isVisible(), 'Next shows the second project');
      assert.equal(await page.locator('.comparison-image:visible').count(), 1, 'Only the current comparison is visible');
      await page.waitForFunction(() => [...document.querySelectorAll('.carousel-slide:not([hidden]) img')].every(image => image.complete && image.naturalWidth > 0));
      await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).click();
      assert(await page.locator('.carousel-slide').first().isVisible(), 'Previous returns to the first project');
      for (const id of ['services', 'realisations', 'a-propos', 'zone-intervention', 'contact']) {
        await page.locator('#' + id).scrollIntoViewIfNeeded();
      }
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, images: [...document.images].map(image => ({ src: new URL(image.currentSrc).pathname, loaded: image.naturalWidth > 0 })), font: getComputedStyle(document.body).fontFamily }));
      assert(layout.scroll <= layout.width, 'Horizontal overflow at ' + viewport.width);
      assert.equal(await page.locator('.service-card').count(), 6);
      assert.equal(await page.locator('.comparison-image').count(), 2);
      assert.equal(await page.locator('h1').count(), 1);
      assert.match(await page.locator('h1').innerText(), /Seine-et-Marne/);
      assert.match(await page.locator('.hero-photo img').getAttribute('src'), /artisan-electricien/);
      const navigation = await page.locator('.site-header').boundingBox();
      if (viewport.width >= 1100) {
        const content = await page.locator('main').boundingBox();
        assert(content.x >= navigation.width, 'Content clears the desktop sidebar');
      } else assert(navigation.width === viewport.width, 'Compact full-width tablet/mobile header');
      const desktopMenu = page.locator('.desktop-nav');
      assert.equal(await desktopMenu.locator('.nav-group').count(), 3);
      assert.equal(await desktopMenu.locator('.nav-icon').count(), 7);
      assert.equal(await desktopMenu.locator('a[href*="instagram.com"]').getAttribute('href'), 'https://www.instagram.com/nc_elec/');
      assert.equal(await desktopMenu.locator('a[href*="instagram.com"]').getAttribute('target'), '_blank');
      if (viewport.width === 1440) {
        for (const label of ['Accueil', 'Savoir-faire', 'Réalisations', 'Notre démarche', 'Zone d’intervention', 'Nous contacter']) {
          const link = desktopMenu.getByRole('link', { name: label, exact: true });
          await link.click();
          await page.waitForFunction(href => document.querySelector('.desktop-nav a[aria-current="location"]')?.getAttribute('href') === href, await link.getAttribute('href'));
        }
        await desktopMenu.getByRole('link', { name: 'Réalisations', exact: true }).click();
        await page.waitForFunction(() => document.querySelector('.desktop-nav a[aria-current="location"]')?.getAttribute('href') === '#realisations');
        await page.locator('.site-header').screenshot({ path: output + '/navigation-desktop.png' });
        report.checks.push('Navigation: three icon groups, all six anchors, active section follows navigation, Instagram opens the supplied account in a new tab');
      }
      assert.equal(await page.locator('.carousel-slide:not([hidden])').count(), 1, 'One carousel slide at every viewport');
      await page.locator('#services').screenshot({ path: output + '/prestations-' + viewport.width + '.png', style: '.site-header { visibility: hidden; }' });
      await page.locator('#realisations').screenshot({ path: output + '/realisations-' + viewport.width + '.png', style: '.site-header { visibility: hidden; }' });
      await page.locator('#zone-intervention').scrollIntoViewIfNeeded();
      const area = page.locator('#zone-intervention');
      assert.match(await area.innerText(), /Coulommiers/);
      assert.match(await area.innerText(), /Île-de-France/);
      assert.match(await area.innerText(), /cas par cas/);
      await area.locator('img.leaflet-tile-loaded').first().waitFor({ timeout: 20000 });
      await area.getByTitle('Centre de Coulommiers').waitFor();
      await page.waitForFunction(() => {
        const tiles = [...document.querySelectorAll('.area-map img.leaflet-tile')];
        return tiles.length > 0 && tiles.every(image => image.complete && image.naturalWidth > 0);
      });
      await area.screenshot({ path: output + '/zone-' + viewport.width + '.png', style: '.site-header { visibility: hidden; }' });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: output + '/accueil-' + viewport.width + '.png' });
      await page.screenshot({ path: output + '/' + viewport.width + '.png', fullPage: true });
      if (viewport.width === 1440) {
        await area.getByTitle('Agrandir la carte').click();
        await page.waitForFunction(() => [...document.querySelectorAll('.area-map img.leaflet-tile-loaded')].some(image => image.src.includes('/11/')));
        await area.getByTitle('Réduire la carte').click();
        await area.getByRole('link', { name: 'Envoyer mon adresse', exact: true }).click();
        assert.equal(new URL(page.url()).hash, '#contact', 'Area CTA opens the contact form');
        assert.equal(await page.locator('#requestType').inputValue(), 'devis');
        report.checks.push('Area: real OpenStreetMap tiles loaded, Coulommiers and conditional Île-de-France coverage shown, CTA opens the existing form');
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
        await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).click();
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
        await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).click();
        assert(await page.locator('.carousel-slide').first().isVisible(), 'Next loops back to the first project');
        assert(Math.abs(Number(await range.inputValue()) - 70) < 1, 'Comparison position survives slide changes');
        await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).click();
        assert(await page.locator('.carousel-slide').nth(1).isVisible(), 'Previous loops to the last project');
        assert(Math.abs(Number(await secondRange.inputValue()) - 69) < 1, 'Each project keeps its comparison position');
        await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).focus();
        await page.keyboard.press('Enter');
        assert(await page.locator('.carousel-slide').first().isVisible(), 'Other-project link works from the keyboard');
        assert(await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).evaluate(button => button === document.activeElement), 'Project change preserves keyboard focus');
        await page.locator('.comparison-figure').first().screenshot({ path: output + '/comparateur.png' });
        report.checks.push('Other-project link: switch both ways, keyboard focus preserved and comparison positions independent; comparison keyboard, endpoints and drag');
        await page.getByRole('link', { name: 'Échangeons sur votre projet', exact: true }).click();
        assert.equal(await page.locator('#requestType').inputValue(), 'rendez-vous');
        const targetTop = await page.locator('#contact').evaluate(element => element.getBoundingClientRect().top);
        assert(targetTop >= 0, 'Contact title must remain in view beside the sidebar');
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
        await page.locator('#services').getByRole('link', { name: 'Éclairage', exact: true }).click();
        assert.equal(await page.locator('#projectType').inputValue(), 'Éclairage', 'Service link prefills the project');
        assert.equal(await page.locator('#requestType').inputValue(), 'devis');
        report.checks.push('Form: appointment intent, validation, preserved input on error, single submission, honest success message (provider responses mocked)');
        await page.locator('#contact').screenshot({ path: output + '/contact.png' });
      } else if (viewport.width < 1100) {
        const toggle = page.getByRole('button', { name: 'Ouvrir le menu' });
        await toggle.click();
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        await toggle.click();
        await page.locator('#mobile-navigation').getByRole('link', { name: 'Savoir-faire', exact: true }).click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        const top = await page.locator('#services').evaluate(element => element.getBoundingClientRect().top);
        assert(top >= navigation.height, 'Anchor clears the compact header');
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
    assert(await page.locator('.carousel-slide').first().isVisible(), 'Comparison drag does not change the project');
    const beforeScroll = await page.evaluate(() => scrollY);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 10; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 15 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(350);
    assert(await page.evaluate(() => scrollY) > beforeScroll + 30, 'Vertical scrolling over comparator');
    // Let the native touch-scroll inertia settle before tapping a control above the image.
    await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).scrollIntoViewIfNeeded();
    await page.evaluate(() => new Promise(resolve => {
      let previous = scrollY, stable = 0;
      const settle = () => {
        stable = previous === scrollY ? stable + 1 : 0;
        previous = scrollY;
        if (stable >= 6) resolve();
        else requestAnimationFrame(settle);
      };
      requestAnimationFrame(settle);
    }));
    await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).tap();
    await page.locator('.carousel-slide').nth(1).waitFor({ state: 'visible', timeout: 5000 });
    assert(await page.locator('.carousel-slide').nth(1).isVisible(), 'Touch navigation changes the project');
    assert.equal(await page.locator('.comparison-controls input').nth(1).inputValue(), '50');
    await page.getByRole('button', { name: 'Voir l’autre réalisation', exact: true }).tap();
    await page.locator('.carousel-slide').first().waitFor({ state: 'visible', timeout: 5000 });
    assert(Number(await page.locator('.comparison-controls input').first().inputValue()) > 60, 'Touch navigation preserves the comparison');
    report.checks.push('Mobile: menu, horizontal touch drag and vertical scrolling over comparator');
    await touch.close();
    const motion = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    const motionPage = await motion.newPage();
    await motionPage.goto(base, { waitUntil: 'networkidle' });
    // Verify a real viewport change after the map has already initialized.
    for (const width of [1440, 390, 1024, 1440]) {
      await motionPage.setViewportSize({ width, height: 900 });
      await motionPage.locator('.area-map').scrollIntoViewIfNeeded();
      await motionPage.waitForFunction(() => {
        const frame = document.querySelector('.area-map');
        const canvas = document.querySelector('.area-map-canvas');
        const marker = document.querySelector('.area-city-marker');
        if (!frame || !canvas || !marker) return false;
        const outer = frame.getBoundingClientRect(), inner = canvas.getBoundingClientRect(), pin = marker.getBoundingClientRect();
        if (Math.abs(inner.width - (outer.width - 2)) > 2 || Math.abs(inner.height - (outer.height - 2)) > 2) return false;
        if (Math.abs((pin.left + pin.width / 2) - (inner.left + inner.width / 2)) > 3 || Math.abs((pin.top + pin.height / 2) - (inner.top + inner.height / 2)) > 3) return false;
        const tiles = [...canvas.querySelectorAll('img.leaflet-tile-loaded')].filter(image => image.complete && image.naturalWidth > 0).map(image => image.getBoundingClientRect());
        return [[10, 10], [inner.width - 10, 10], [10, inner.height - 10], [inner.width - 10, inner.height - 10]].every(([x, y]) => tiles.some(tile => tile.left <= inner.left + x && tile.right >= inner.left + x && tile.top <= inner.top + y && tile.bottom >= inner.top + y));
      }, null, { timeout: 20000 });
      await motionPage.locator('.area-map').screenshot({ path: output + '/carte-redimensionnee-' + width + '.png' });
    }
    report.checks.push('Map resizing: full tile coverage and centred marker when changing between desktop, mobile and tablet without reloading');
    for (const viewport of [{ width: 1100, height: 600 }, { width: 1366, height: 720 }, { width: 1440, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
      await motionPage.setViewportSize(viewport);
      await motionPage.waitForFunction(() => {
        const sidebar = document.querySelector('.site-header');
        const cta = document.querySelector('.header-cta').getBoundingClientRect();
        const links = [...document.querySelectorAll('.desktop-nav .nav-link')];
        return sidebar.scrollHeight <= sidebar.clientHeight + 1 && cta.bottom <= innerHeight && links.every(link => {
          const bounds = link.getBoundingClientRect();
          return bounds.top >= 0 && bounds.bottom <= innerHeight;
        });
      }, null, { timeout: 5000 });
      await motionPage.locator('.site-header').screenshot({ path: output + '/navigation-hauteur-' + viewport.height + '.png' });
    }
    report.checks.push('Sidebar: logo, all navigation links, Instagram, phone and quote button fit without scrolling at heights 600, 720, 768, 900 and 1080px');
    await motionPage.setViewportSize({ width: 1440, height: 900 });
    await motionPage.goto(base, { waitUntil: 'networkidle' });
    const contrasts = await motionPage.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const canvas = document.createElement('canvas').getContext('2d');
      const luminance = token => {
        canvas.fillStyle = styles.getPropertyValue(token).trim();
        canvas.fillRect(0, 0, 1, 1);
        const rgb = Array.from(canvas.getImageData(0, 0, 1, 1).data).slice(0, 3).map(value => {
          const channel = value / 255;
          return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
        });
        return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
      };
      return [
        ['--muted', '--surface'], ['--muted', '--color-off-white'], ['--muted', '--blue-tint'],
        ['--color-primary-blue', '--surface'], ['--color-primary-blue', '--blue-tint'],
        ['--on-dark-muted', '--color-dark-navy'], ['--color-off-white', '--color-dark-navy'],
        ['--color-dark-navy', '--color-electric-yellow'],
      ].map(([text, background]) => {
        const a = luminance(text), b = luminance(background);
        return { text, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
      });
    });
    contrasts.forEach(pair => assert(pair.ratio >= 4.5, `Text contrast ${pair.text} on ${pair.background}: ${pair.ratio}`));
    report.contrasts = contrasts;
    assert(await motionPage.locator('.reveal-pending').count() > 0, 'Below-fold sections are prepared for scroll reveals');
    await motionPage.locator('#contact').scrollIntoViewIfNeeded();
    await motionPage.waitForFunction(() => !document.querySelector('#contact').classList.contains('reveal-pending'));
    await motionPage.emulateMedia({ reducedMotion: 'reduce' });
    await motionPage.waitForFunction(() => document.querySelectorAll('.reveal-pending').length === 0);
    assert.equal(await motionPage.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior), 'auto');
    report.checks.push('Motion: scroll reveals work; live reduced-motion preference reveals all content and disables smooth scrolling');
    await motion.close();
    assert.deepEqual(report.errors, [], 'No unexpected browser errors');
    fs.writeFileSync(output + '/browser-report.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
