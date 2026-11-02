// Sends ONE clearly identified real test through the form, then queries Resend delivery status.
// Run explicitly; this is not part of the automated test suite.
const { chromium } = require(require('node:path').join(require('node:os').tmpdir(), 'nc-elec-qa/node_modules/playwright'));
const { Resend } = require('resend');
const { loadEnvConfig } = require('@next/env');
const fs = require('node:fs');
loadEnvConfig(process.cwd());

(async () => {
  const recipient = 'ncelec@outlook.fr';
  if (process.env.CONTACT_EMAIL !== recipient) throw new Error('The configured recipient does not match the authorized test recipient.');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.goto((process.env.CONTACT_TEST_URL || 'http://localhost:3000') + '/?demande=rendez-vous#contact', { waitUntil: 'networkidle' });
    await page.locator('#name').fill('TEST NC’ELEC — client fictif');
    await page.locator('#phone').fill('0600000000');
    await page.locator('#email').fill('client-fictif@example.com');
    await page.locator('#projectType').selectOption('Maintenance');
    await page.locator('#message').fill('ENVOI DE TEST TECHNIQUE — NE PAS TRAITER COMME UNE DEMANDE CLIENT. Toutes les coordonnées ci-dessus sont fictives. Vérification du formulaire NC’ELEC : nom, téléphone, e-mail, projet, message et demande de rendez-vous. Aucun rendez-vous à réserver.');
    const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/contact') && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
    const response = await responsePromise;
    const body = await response.json();
    const report = { checkedAt: new Date().toISOString(), recipient, httpStatus: response.status(), response: body, delivery: null };
    if (body.id) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      for (let attempt = 0; attempt < 4; attempt++) {
        const { data, error } = await resend.emails.get(body.id);
        report.delivery = error ? { error: error.name, message: error.message } : { id: data.id, last_event: data.last_event, subject: data.subject, to: data.to, reply_to: data.reply_to, allFieldsPresent: ['Nom :', 'Téléphone :', 'Adresse e-mail :', 'Type de projet :', 'Description du projet :', 'Nature de la demande : rendez-vous'].every(label => data.text?.includes(label)) };
        if (error || data.last_event === 'delivered' || data.last_event === 'bounced') break;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    fs.mkdirSync('artifacts/preview', { recursive: true });
    fs.writeFileSync('artifacts/preview/resend-test.json', JSON.stringify(report, null, 2));
    await page.locator('#contact').screenshot({ path: 'artifacts/preview/contact-test-reel.png' });
    console.log(JSON.stringify(report, null, 2));
    if (!response.ok()) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error.name + ': ' + error.message); process.exitCode = 1; });
