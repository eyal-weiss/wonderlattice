// The feedback box's inbox (functions/api/feedback.js), with GitHub and Cloudflare's cache replaced by stand-ins.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost, issue, clean, MAX_LENGTH, REPO } from '../../functions/api/feedback.js';

const SITE = 'https://wonderlattice.com';
let filed; // the requests the function sent to GitHub
let github; // what GitHub answers

beforeEach(() => {
  filed = [];
  github = () => new Response('{}', { status: 201 });
  globalThis.fetch = async (url, init) => {
    filed.push({ url, init, body: JSON.parse(init.body) });
    return github();
  };
  delete globalThis.caches;
});

const send = (note, { headers = {}, env = { FEEDBACK_GITHUB_TOKEN: 'secret-token' }, raw } = {}) =>
  onRequestPost({
    request: new Request(`${SITE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE, ...headers },
      body: raw ?? JSON.stringify(note),
    }),
    env,
  });
const answer = async (response) => ({ status: response.status, ...(await response.json()) });

test('a message is filed as an issue in the private repository, with its page and language', async () => {
  const response = await send({ message: '  I loved the dice!  ', room: 'dice', place: 'explanation', lang: 'he' });
  assert.deepEqual(await answer(response), { status: 200, ok: true });
  assert.equal(filed.length, 1);
  const [{ url, init, body }] = filed;
  assert.equal(url, `https://api.github.com/repos/${REPO}/issues`);
  assert.equal(init.method, 'POST');
  assert.equal(init.headers.Authorization, 'Bearer secret-token');
  assert.ok(init.headers['User-Agent'], 'GitHub refuses requests without a User-Agent');
  assert.equal(body.title, 'Message from dice (he)');
  assert.match(body.body, /the explanation of “dice”/);
  assert.match(body.body, /Page language: he/);
  assert.match(body.body, /```text\nI loved the dice!\n```/);
});

test('a message from About says so, and which room it was opened in', async () => {
  await send({ message: 'Hello', room: 'loom', place: 'about', lang: 'en' });
  assert.equal(filed[0].body.title, 'Message from About (en)');
  assert.match(filed[0].body.body, /About \(opened in “loom”\)/);
});

test('the visitor’s words can’t mention, link or format anything on GitHub', () => {
  const words = 'Hi @octocat, see [this](https://x.example) ``` and ```` <b>bold</b>';
  const { title, body } = issue({ message: words, room: 'dice', place: 'explanation', lang: 'en' });
  assert.ok(!title.includes('@'), 'the title holds no visitor text');
  // The fence is longer than any run of backticks inside, so the words stay inside the code block.
  const fence = body.match(/^(`{3,})text$/m)[1];
  assert.equal(fence, '`````');
  const inside = body.split(`${fence}text\n`)[1].split(`\n${fence}`)[0];
  assert.equal(inside, words);
});

test('long lines are broken at spaces; a long word stays whole', () => {
  const words = `${'word '.repeat(40).trim()}\n${'x'.repeat(120)}`;
  const { body } = issue({ message: words, room: null, place: 'explanation', lang: 'en' });
  const inside = body.split('```text\n')[1].split('\n```')[0];
  assert.ok(inside.split('\n').every((line) => line.length <= 80 || !line.includes(' ')));
  assert.equal(inside.replace(/\n/g, ' ').replace(/ x+$/, ''), 'word '.repeat(40).trim());
  assert.ok(inside.endsWith('x'.repeat(120)));
});

test('invisible control characters are dropped and line breaks kept', () => {
  assert.equal(clean('a\r\nb\u0007c\td\u0000'), 'a\nbc\td');
  assert.equal(clean(42), '');
});

test('a filled-in trap is told all went well, and nothing is filed', async () => {
  assert.deepEqual(await answer(await send({ message: 'Buy now', trap: 'https://spam.example' })), {
    status: 200,
    ok: true,
  });
  assert.equal(filed.length, 0);
});

test('empty, missing and over-long messages are refused, and nothing is filed', async () => {
  assert.deepEqual(await answer(await send({ message: '   ' })), { status: 400, error: 'empty' });
  assert.deepEqual(await answer(await send({})), { status: 400, error: 'empty' });
  assert.deepEqual(await answer(await send({ message: 'é'.repeat(MAX_LENGTH + 1) })), {
    status: 413,
    error: 'too-long',
  });
  assert.deepEqual(await answer(await send(null, { raw: 'x'.repeat(20000) })), { status: 413, error: 'too-long' });
  assert.deepEqual(await answer(await send(null, { raw: '{not json' })), { status: 400, error: 'bad-request' });
  assert.deepEqual(await answer(await send(null, { raw: '"just a string"' })), { status: 400, error: 'bad-request' });
  assert.equal(filed.length, 0);
});

test('a full-length message in any script is accepted', async () => {
  assert.equal((await send({ message: 'ש'.repeat(MAX_LENGTH), lang: 'he' })).status, 200);
  assert.equal(filed.length, 1);
});

test('only the site itself may send, and only as JSON', async () => {
  assert.equal((await send({ message: 'Hi' }, { headers: { Origin: 'https://elsewhere.example' } })).status, 403);
  assert.equal((await send({ message: 'Hi' }, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal(filed.length, 0);
});

test('odd rooms and languages are not passed on', async () => {
  await send({ message: 'Hi', room: '<script>', place: 'somewhere', lang: 'english!' });
  assert.equal(filed[0].body.title, 'Message from an explanation (en)');
  assert.ok(!filed[0].body.body.includes('<script>'));
});

test('without a token, or when GitHub fails, the visitor hears it didn’t work, and nothing is echoed back', async () => {
  const words = 'My secret words';
  const quiet = console.error;
  console.error = () => {};
  try {
    let response = await send({ message: words }, { env: {} });
    assert.deepEqual(await answer(response), { status: 503, error: 'unavailable' });
    assert.equal(filed.length, 0);
    github = () => new Response('Bad credentials', { status: 401 });
    response = await send({ message: words });
    const text = await response.text();
    assert.equal(response.status, 502);
    assert.ok(!text.includes(words) && !text.includes('secret-token'));
    github = () => {
      throw new Error('offline');
    };
    assert.equal((await send({ message: words })).status, 502);
  } finally {
    console.error = quiet;
  }
});

test('one address may send five messages in ten minutes; others still can', async () => {
  const store = new Map();
  globalThis.caches = {
    default: {
      match: async (key) => (store.has(key.url) ? new Response(store.get(key.url)) : undefined),
      put: async (key, response) => void store.set(key.url, await response.text()),
    },
  };
  const from = (address) => ({ headers: { 'CF-Connecting-IP': address } });
  for (let i = 0; i < 5; i++) assert.equal((await send({ message: `Note ${i}` }, from('203.0.113.7'))).status, 200);
  assert.deepEqual(await answer(await send({ message: 'Sixth' }, from('203.0.113.7'))), {
    status: 429,
    error: 'too-many',
  });
  assert.equal((await send({ message: 'Hi' }, from('198.51.100.2'))).status, 200);
  assert.equal(filed.length, 6);
  // The address is only ever kept hashed.
  assert.ok([...store.keys()].every((key) => !key.includes('203.0.113.7')));
});

test('if the count itself fails, the message still goes through', async () => {
  globalThis.caches = {
    default: {
      match: async () => {
        throw new Error('no cache here');
      },
    },
  };
  assert.equal((await send({ message: 'Hi' })).status, 200);
});
