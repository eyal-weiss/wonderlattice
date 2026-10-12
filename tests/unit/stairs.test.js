import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.stairs;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} ≈ ${b}`);
/** A tone as the set it sounds: its partials sorted by frequency. */
const set = (pos, width) => M.partials(pos, width).sort((a, b) => a.frequency - b.frequency);

// The numbers below were recomputed independently, in Python, from C1 = 440 Hz × 2^(−45/12) and the raised cosine
// L(x) = ½(1 − cos(2π(x − (4 − w/2))/w)) over a bell w octaves wide centred on x = 4.

test('the partials: eight tones an octave apart, from C1 up, loudest at C5', () => {
  near(M.LOWEST, 32.70319566257483);
  near(M.LOWEST * 2 ** M.CENTRE, 523.2511306011972);
  const tone = set(0);
  assert.equal(tone.length, 8);
  tone.slice(1).forEach((p, i) => near(p.frequency / tone[i].frequency, 2));
  const levels = [0, 0.146447, 0.5, 0.853553, 1, 0.853553, 0.5, 0.146447];
  tone.forEach((p, i) => near(p.level, levels[i], 1e-6));
  // F♯, six steps up: every tone half an octave higher, louder near the middle.
  const sharp = [0.0381, 0.3087, 0.6913, 0.9619, 0.9619, 0.6913, 0.3087, 0.0381];
  set(6).forEach((p, i) => near(p.level, sharp[i], 1e-3));
});

test('twelve steps up, the tone is exactly the one it started from, for any width of the curve', () => {
  for (const width of [8, 5, 3.5, 2, 1])
    for (const pos of [0, 0.3, 5, 7.25, 11.9, -4, 100]) {
      const a = set(pos, width),
        b = set(pos + 12, width);
      a.forEach((p, i) => {
        near(b[i].frequency, p.frequency);
        near(b[i].level, p.level, 1e-12);
      });
    }
});

test('one step multiplies every tone by the twelfth root of two (except one that wraps round, silently)', () => {
  const before = M.partials(3),
    after = M.partials(4);
  before.forEach((p, j) => near(after[j].frequency / p.frequency, 2 ** (1 / 12)));
  // Step 11 to 12: the top voice goes back to the bottom, where the curve is silent.
  const top = M.partials(11)[7],
    wrapped = M.partials(12)[7];
  near(wrapped.x, 0);
  assert.equal(wrapped.level, 0);
  assert.ok(top.x > 7.9);
  near(top.level, M.loudness(8 - 1 / 12), 1e-12);
});

test('the curve is silent at both ends, symmetric, and loudest in the middle', () => {
  assert.equal(M.loudness(0), 0);
  assert.equal(M.loudness(8), 0);
  near(M.loudness(4), 1);
  near(M.loudness(2.3), 0.6167226819279525, 1e-12);
  near(M.loudness(5.7), 0.6167226819279525, 1e-12);
  for (const width of [1, 2.5, 6]) {
    assert.equal(M.loudness(4 - width / 2, width), 0);
    assert.equal(M.loudness(4 + width / 2, width), 0);
    assert.equal(M.loudness(4 - width / 2 - 0.01, width), 0);
  }
});

test('the whole sound keeps its strength: under a curve a whole number of octaves wide, the levels add up to half its width', () => {
  for (const width of [2, 3, 4, 8])
    for (let i = 0; i < 84; i++) {
      const total = M.partials(i / 7, width).reduce((sum, p) => sum + p.level, 0);
      near(total, width / 2, 1e-12);
      near(total / M.strength(width), width / 2 / Math.max(1, width / 2));
    }
});

test('with the curve one octave wide, never more than one tone sounds at a time', () => {
  for (let i = 0; i < 13 * 12; i++) {
    const sounding = M.partials(i / 13, 1).filter((p) => p.level > 1e-12);
    assert.ok(sounding.length <= 1, `position ${i / 13}`);
  }
  // One tone climbs half an octave to the top of the curve and fades out; the next to sound is an octave below it.
  assert.equal(M.loudest(0, 1), 4);
  assert.equal(M.loudest(5, 1), 4);
  assert.equal(M.loudest(6, 1), -1); // both at the curve's edges: a moment of silence
  assert.equal(M.loudest(7, 1), 3);
  near(M.partials(7, 1)[3].frequency * 2, M.partials(5, 1)[4].frequency * 2 ** (2 / 12));
});

test('the notes go round a circle of twelve, and a tritone pair sits opposite', () => {
  assert.equal(M.chroma(0), 0);
  assert.equal(M.chroma(13), 1);
  assert.equal(M.chroma(-1), 11);
  near(M.chroma(25.5), 1.5);
  assert.deepEqual(M.tritone(0), [0, 6]);
  assert.deepEqual(M.tritone(9), [9, 3]);
  for (let a = 0; a < 12; a++) {
    const [x, y] = M.tritone(a);
    assert.equal((y - x + 12) % 12, 6); // six steps up …
    assert.equal((x - y + 12) % 12, 6); // … and six steps down
  }
});
