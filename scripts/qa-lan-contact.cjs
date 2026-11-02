const { chromium } = require(require('node:path').join(require('node:os').tmpdir(), 'nc-elec-qa/node_modules/playwright'));
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    const resources = [];
    const consoleMessages = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) resources.push({ url: response.url(), status: response.status() }); });
    page.on('console', message => consoleMessages.push(message.type() + ': ' + message.text()));
    await page.goto('http://192.168.1.34:3000/#contact', { waitUntil: 'networkidle' });
    const context = await page.evaluate(() => ({ secure: isSecureContext, randomUUID: typeof crypto.randomUUID, getRandomValues: typeof crypto.getRandomValues }));
    await page.waitForFunction(() => Object.keys(document.querySelector('form')).some(key => key.startsWith('__reactProps$'))).catch(() => console.log(JSON.stringify({ consoleMessages, resources, scripts: 'Hydration timed out' })));
    let requests = 0;
    let payload;
    await page.route('**/api/contact', async route => {
      requests++;
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, status: 'accepted', id: 'lan-mock-only' }) });
    });
    await page.locator('#name').fill('TEST réseau local');
    await page.locator('#phone').fill('0600000000');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#projectType').selectOption('Installation électrique');
    await page.locator('#message').fill('Test simulé du formulaire sur le réseau local. Aucun e-mail réel.');
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
    await page.waitForTimeout(800);
    console.log(JSON.stringify({ context, requests, requestId: payload?.requestId, errors, resources, notices: await page.locator('.form-notice, .field-error').allTextContents(), fields: await page.locator('form').evaluate(form => [...new FormData(form).keys()]), url: page.url() }));
      assert.equal(requests, 1);
      assert.match(payload.requestId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      assert.deepEqual(errors, []);
      await page.getByRole('status').filter({ hasText: 'demande de devis' }).waitFor();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
