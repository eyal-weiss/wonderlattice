import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const storm = globalThis.Wonderloom.models.storm;
const { CODES, PICTURES, PIXELS, BLOCKS } = storm;
const NONE = 0,
  REPEAT = 1,
  PARITY = 2,
  HAMMING = 3;

/** All sixteen 4-bit messages. */
const messages = Array.from({ length: 16 }, (_, m) => [3, 2, 1, 0].map((k) => (m >> k) & 1));
const flip = (bits, i) => bits.map((b, k) => (k === i ? b ^ 1 : b));
const block = (index, data) => {
  const code = CODES[index];
  return { code, word: code.encode(data) };
};

test('every code round-trips every message, and a whole picture, with no storm', () => {
  for (let index = 0; index < CODES.length; index++) {
    for (const data of messages) {
      const { code, word } = block(index, data);
      assert.equal(word.length, code.n);
      assert.deepEqual(code.decode(word).data, data);
      assert.equal(code.decode(word).bad, false);
    }
    for (const picture of Object.values(PICTURES)) {
      const sent = storm.encode(index, picture);
      assert.equal(sent.length, storm.bitsSent(index));
      assert.deepEqual(storm.decode(index, sent).pixels, [...picture]);
      const calm = storm.transmit(picture, index, 0, 42);
      assert.equal(calm.flips, 0);
      assert.equal(calm.wrongCount, 0);
    }
  }
});

test('Hamming corrects every single flip in every position of every message', () => {
  for (const data of messages) {
    const { code, word } = block(HAMMING, data);
    assert.equal(storm.syndrome(word), 0);
    for (let i = 0; i < 7; i++) {
      const received = flip(word, i);
      // The syndrome names the flipped position, counted from 1.
      assert.equal(storm.syndrome(received), i + 1);
      assert.deepEqual(code.decode(received).data, data, `message ${data} flipped at ${i + 1}`);
    }
  }
});

test('two flips in one Hamming block are beyond its promise', () => {
  const { code, word } = block(HAMMING, [1, 0, 1, 1]);
  for (let i = 0; i < 7; i++)
    for (let j = i + 1; j < 7; j++) {
      const received = flip(flip(word, i), j);
      const s = storm.syndrome(received);
      assert.ok(s !== 0 && s !== i + 1 && s !== j + 1, 'the syndrome points at a third position');
      assert.ok(code.decode(received).syndrome === s);
    }
});

test('a parity bit detects every single flip but repairs nothing', () => {
  for (const data of messages) {
    const { code, word } = block(PARITY, data);
    for (let i = 0; i < 5; i++) {
      const result = code.decode(flip(word, i));
      assert.equal(result.bad, true);
      assert.deepEqual(result.data, flip(word, i).slice(0, 4));
    }
    // Two flips cancel out and hide.
    assert.equal(code.decode(flip(flip(word, 0), 3)).bad, false);
  }
});

test('three copies fix one flip in every triple, but not two', () => {
  for (const data of messages) {
    const { code, word } = block(REPEAT, data);
    for (let i = 0; i < 12; i++) assert.deepEqual(code.decode(flip(word, i)).data, data);
    // One flip in each of the four triples at once is still fine.
    assert.deepEqual(code.decode([0, 4, 8, 11].reduce(flip, word)).data, data);
    const twice = code.decode(flip(flip(word, 0), 1)).data;
    assert.equal(twice[0], data[0] ^ 1);
  }
});

test('overhead: nothing, 8 extra bits per 4, 1 per 4, and 3 per 4', () => {
  assert.deepEqual(
    CODES.map((_, i) => storm.overhead(i)),
    [0, 2, 0.25, 0.75],
  );
  assert.deepEqual(
    CODES.map((_, i) => storm.bitsSent(i)),
    [64, 192, 80, 112],
  );
  assert.equal(BLOCKS * 4, PIXELS);
  assert.throws(() => storm.overhead(4), RangeError);
});

test('the random generator and the storm are deterministic', () => {
  const a = storm.rng(123),
    b = storm.rng(123),
    c = storm.rng(124);
  const first = Array.from({ length: 20 }, a);
  assert.deepEqual(first, Array.from({ length: 20 }, b));
  assert.notDeepEqual(first, Array.from({ length: 20 }, c));
  assert.ok(first.every((x) => x >= 0 && x < 1));
  const picture = PICTURES.smile;
  assert.deepEqual(storm.transmit(picture, HAMMING, 0.1, 7), storm.transmit(picture, HAMMING, 0.1, 7));
  // Raising the storm with the same seed only adds flips.
  const light = storm.channel(storm.encode(REPEAT, picture), 0.05, 99).flipped;
  const heavy = storm.channel(storm.encode(REPEAT, picture), 0.15, 99).flipped;
  assert.ok(light.every((f, i) => !f || heavy[i]));
  assert.ok(heavy.filter(Boolean).length > light.filter(Boolean).length);
  assert.equal(storm.channel(storm.encode(NONE, picture), 1, 5).flipped.every(Boolean), true);
  assert.throws(() => storm.channel([0], 1.5, 1), RangeError);
});

test('the storm flips about p of the bits', () => {
  const bits = new Array(100000).fill(0);
  const flips = storm.channel(bits, 0.1, 2024).flipped.filter(Boolean).length;
  assert.ok(Math.abs(flips / bits.length - 0.1) < 0.005, `${flips} flips`);
});

test('transmit reports repaired, wrong, and known-bad pixels honestly', () => {
  for (let seed = 1; seed <= 200; seed++) {
    for (let index = 0; index < CODES.length; index++) {
      const r = storm.transmit(PICTURES.heart, index, 0.08, seed);
      assert.equal(r.wrongCount, r.pixels.filter((p, i) => p !== PICTURES.heart[i]).length);
      assert.ok(r.repaired.every((fixed, i) => !(fixed && r.wrong[i])));
      if (index === NONE || index === PARITY) assert.equal(r.repairedCount, 0);
      if (index !== PARITY) assert.equal(r.badCount, 0);
      if (index === NONE) assert.equal(r.wrongCount, r.flips);
      // Hamming: a block with at most one flip always arrives whole.
      if (index === HAMMING)
        for (let b = 0; b < BLOCKS; b++) {
          const flips = r.flipped.slice(7 * b, 7 * b + 7).filter(Boolean).length;
          if (flips <= 1) assert.ok(r.wrong.slice(4 * b, 4 * b + 4).every((w) => !w));
        }
    }
  }
  assert.throws(() => storm.transmit([0, 1], HAMMING, 0.1, 1), RangeError);
});

test('expected damage matches the closed forms and shows each code’s breaking point', () => {
  for (const p of [0, 0.01, 0.04, 0.1, 0.2]) {
    assert.ok(Math.abs(storm.expectedWrong(NONE, p) - 64 * p) < 1e-9);
    assert.ok(Math.abs(storm.expectedWrong(PARITY, p) - 64 * p) < 1e-9);
    assert.ok(Math.abs(storm.expectedWrong(REPEAT, p) - 64 * (3 * p * p - 2 * p ** 3)) < 1e-9);
  }
  // Hamming fails only when two or more of seven bits flip, so its damage grows like p².
  assert.equal(storm.expectedWrong(HAMMING, 0), 0);
  assert.ok(storm.expectedWrong(HAMMING, 0.001) / storm.expectedWrong(NONE, 0.001) < 0.01);
  assert.ok(storm.expectedWrong(HAMMING, 0.04) < storm.expectedWrong(NONE, 0.04) / 3);
  // Near a 20% storm it barely helps, and a little beyond it hurts.
  assert.ok(storm.expectedWrong(HAMMING, 0.2) < storm.expectedWrong(NONE, 0.2));
  assert.ok(storm.expectedWrong(HAMMING, 0.25) > storm.expectedWrong(NONE, 0.25));
  // A Monte Carlo check of the exact sum.
  let wrong = 0;
  for (let seed = 1; seed <= 3000; seed++) wrong += storm.transmit(PICTURES.invader, HAMMING, 0.1, seed).wrongCount;
  assert.ok(Math.abs(wrong / 3000 - storm.expectedWrong(HAMMING, 0.1)) < 0.25);
});

test('pictures pack into two whole numbers for links and unpack unchanged', () => {
  for (const picture of Object.values(PICTURES)) {
    const { top, bottom } = storm.pack(picture);
    assert.ok(Number.isInteger(top) && top >= 0 && top < 2 ** 32);
    assert.ok(Number.isInteger(bottom) && bottom >= 0 && bottom < 2 ** 32);
    assert.deepEqual(storm.unpack(top, bottom), [...picture]);
  }
  const full = new Array(PIXELS).fill(1);
  assert.deepEqual(storm.pack(full), { top: 2 ** 32 - 1, bottom: 2 ** 32 - 1 });
  assert.deepEqual(storm.unpack(0, 1), [...new Array(PIXELS - 1).fill(0), 1]);
});
