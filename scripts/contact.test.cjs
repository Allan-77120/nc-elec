const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { randomUUID } = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');

function compile(file, imports = {}, env = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: id => imports[id] ?? require(id), process: { env }, console: { error() {} }, Response, Request, Buffer, Map, Date, URL, ...globals });
  return exports;
}
const validation = compile('src/lib/contact.ts');
test('request IDs work on HTTP LAN origins without randomUUID', () => {
  const { webcrypto } = require('node:crypto');
  const { createRequestId } = compile('src/lib/request-id.ts', {}, {}, { crypto: { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) }, Uint8Array });
  const ids = new Set();
  for (let index = 0; index < 100; index++) {
    const id = createRequestId();
    assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    ids.add(id);
  }
  assert.equal(ids.size, 100);
});
test('request IDs also work with the native secure-context implementation', () => {
  const { createRequestId } = compile('src/lib/request-id.ts', {}, {}, { crypto: require('node:crypto').webcrypto });
  assert.match(createRequestId(), /^[0-9a-f-]{36}$/);
});
const valid = () => ({ name: 'Client fictif', phone: '+33 6 00 00 00 00', email: 'test@example.com', projectType: 'Maintenance', message: 'Demande fictive de maintenance électrique.', requestType: 'rendez-vous', website: '', requestId: randomUUID() });
function setup(behavior = 'success', configured = true) {
  const messages = [];
  class Resend {
    emails = { send: async (...args) => {
      messages.push(args);
      if (behavior === 'throw') throw new Error('network failure');
      return behavior === 'error' ? { error: { name: 'validation_error' }, data: null } : behavior === 'empty' ? { data: null, error: null } : { data: { id: 'test-id' }, error: null };
    } };
  }
  const env = configured ? { RESEND_API_KEY: 'fake-key-for-unit-tests', CONTACT_EMAIL: 'recipient@example.com', CONTACT_FROM_EMAIL: 'sender@example.com' } : {};
  const route = compile('src/app/api/contact/route.ts', { '@/lib/contact': validation, resend: { Resend } }, env);
  const send = (payload, headers = {}) => route.POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { host: 'localhost:3000', 'content-type': 'application/json', ...headers }, body: JSON.stringify(payload) }));
  return { ...route, messages, send };
}

test('valid input is normalized; names, phone, email, lengths and enums are checked', () => {
  const normalized = validation.validateContact({ ...valid(), name: '  Client fictif  ', email: 'TEST@EXAMPLE.COM' });
  assert.equal(normalized.data.name, 'Client fictif');
  assert.equal(normalized.data.email, 'test@example.com');
  for (const invalid of [null, [], { ...valid(), name: ' ' }, { ...valid(), name: 'a'.repeat(101) }, { ...valid(), name: 'Client\nInjected' }, { ...valid(), phone: 'abcdefghi' }, { ...valid(), phone: '123' }, { ...valid(), phone: '1'.repeat(16) }, { ...valid(), email: 'invalid@' }, { ...valid(), message: 'court' }, { ...valid(), message: 'a'.repeat(4001) }, { ...valid(), projectType: 'inconnu' }, { ...valid(), requestType: 'réservé' }, { ...valid(), requestId: 'invalid' }]) assert.equal(validation.validateContact(invalid).data, undefined);
});
test('invalid bodies and spam never report success or reach Resend', async () => {
  const { send, messages } = setup();
  for (const invalid of [null, [], {}, { ...valid(), website: 'https://spam.example' }, { ...valid(), phone: 'invalid' }]) {
    const response = await send(invalid);
    assert.equal(response.status, 400);
    assert.notEqual((await response.json()).success, true);
  }
  assert.equal(messages.length, 0);
});
test('origin, content type, malformed JSON and body size are guarded', async () => {
  const { send, POST, messages } = setup();
  assert.equal((await send(valid(), { origin: 'https://unrelated.example' })).status, 403);
  assert.equal((await send(valid(), { 'content-type': 'text/plain' })).status, 415);
  assert.equal((await send({ message: 'a'.repeat(25000) })).status, 413);
  assert.equal((await POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal(messages.length, 0);
});
test('only confirmed acceptance is success; recipient, reply-to, request kind and idempotency are passed', async () => {
  const { send, messages } = setup();
  const payload = valid();
  const response = await send(payload, { origin: 'http://localhost:3000' });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'accepted');
  const [mail, options] = messages[0];
  assert.equal(mail.to, 'recipient@example.com');
  assert.equal(mail.replyTo, payload.email);
  assert.equal(mail.subject, 'Nouvelle demande de rendez-vous — NC’ELEC');
  for (const field of ['name', 'phone', 'email', 'projectType', 'message']) assert(mail.text.includes(payload[field]));
  assert.equal(options.idempotencyKey, 'contact/' + payload.requestId);
});
test('missing configuration, rejected mail, empty acceptance and network errors fail honestly', async () => {
  for (const behavior of ['error', 'empty', 'throw']) {
    const response = await setup(behavior).send(valid());
    assert.equal(response.status, 502);
    assert.notEqual((await response.json()).success, true);
  }
  assert.equal((await setup('success', false).send(valid())).status, 503);
});
test('email and global process limits return 429 with Retry-After', async () => {
  const single = setup();
  for (let index = 0; index < 3; index++) assert.equal((await single.send(valid())).status, 200);
  const limited = await single.send(valid());
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '900');
  assert.equal(single.messages.length, 3);
  const global = setup();
  for (let index = 0; index < 60; index++) assert.equal((await global.send(null)).status, 400);
  assert.equal((await global.send(null)).status, 429);
});
