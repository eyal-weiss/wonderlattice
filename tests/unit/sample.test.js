import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const { city, frame, frameShare, neighbourhoods, oddestHood, survey, standardError, summary, rng, HOODS, METHODS } =
  globalThis.Wonderlattice.models.sample;

/** Run `times` surveys of size n with one method and summarise them against the true share. */
function repeat(town, method, n, times, seed, hood = 0) {
  const list = frame(town, method, hood),
    random = rng(seed);
  const estimates = Array.from({ length: times }, () => survey(town, list, n, random).estimate);
  return { list, ...summary(estimates, town.share) };
}

test('a city is fully determined by its seed, and its true share is counted exactly', () => {
  const a = city(44),
    b = city(44),
    c = city(45);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.likes, c.likes);
  assert.equal(a.size, a.cols * a.rows);
  assert.equal(a.hoods, HOODS);
  let orange = 0;
  for (const x of a.likes) {
    assert.ok(x === 0 || x === 1);
    orange += x;
  }
  assert.equal(a.orange, orange);
  assert.equal(a.share, orange / a.size);
  // The neighbourhoods partition the city, and their shares average back to the whole.
  const hoods = neighbourhoods(a);
  assert.equal(
    hoods.reduce((t, h) => t + h.size, 0),
    a.size,
  );
  const weighted = hoods.reduce((t, h) => t + h.share * h.size, 0) / a.size;
  assert.ok(Math.abs(weighted - a.share) < 1e-12);
  for (const h of hoods) assert.ok(h.size > 80, `every neighbourhood has residents (${h.size})`);
});

test('preferences cluster by neighbourhood', () => {
  // Neighbourhood shares vary far more than coin flips alone would make them.
  for (const seed of [1, 44, 2026]) {
    const town = city(seed),
      hoods = neighbourhoods(town);
    const spread = Math.sqrt(hoods.reduce((t, h) => t + (h.share - town.share) ** 2, 0) / hoods.length);
    const coinFlips = Math.sqrt((town.share * (1 - town.share)) / (town.size / hoods.length));
    assert.ok(spread > 4 * coinFlips, `seed ${seed}: spread ${spread} vs ${coinFlips}`);
  }
  const town = city(44),
    odd = oddestHood(town);
  const gaps = neighbourhoods(town).map((h) => Math.abs(h.share - town.share));
  assert.equal(gaps[odd], Math.max(...gaps));
});

test('frames: the whole city, one neighbourhood, or whoever answers', () => {
  const town = city(44);
  assert.equal(frame(town, 'random').length, town.size);
  assert.equal(frameShare(town, frame(town, 'random')), town.share);
  const hoods = neighbourhoods(town);
  for (let k = 0; k < HOODS; k++) {
    const list = frame(town, 'hood', k);
    assert.equal(list.length, hoods[k].size);
    assert.ok(list.every((i) => town.hood[i] === k));
    assert.equal(frameShare(town, list), hoods[k].share);
  }
  const volunteers = frame(town, 'volunteer');
  assert.ok(volunteers.every((i) => town.answers[i] === 1));
  // Orange fans reply more readily, so the people who answer lean orange.
  assert.ok(frameShare(town, volunteers) > town.share + 0.1);
  assert.ok(volunteers.length >= 1000, 'enough people answer for a survey of 1000');
  assert.deepEqual(METHODS, ['random', 'hood', 'volunteer']);
});

test('a survey asks distinct residents from its frame, and all of them when the frame is small', () => {
  const town = city(7),
    random = rng(3);
  const list = frame(town, 'hood', 2);
  const { asked, estimate } = survey(town, list, 50, random);
  assert.equal(asked.length, 50);
  assert.equal(new Set(asked).size, 50);
  const inFrame = new Set(list);
  assert.ok(asked.every((i) => inFrame.has(i)));
  assert.equal(estimate, asked.reduce((t, i) => t + town.likes[i], 0) / 50);
  // Asking more people than live there asks everyone, and always gets the neighbourhood's share.
  const all = survey(town, list, 5000, random);
  assert.equal(all.asked.length, list.length);
  assert.equal(all.estimate, frameShare(town, list));
  // The same generator state gives the same survey.
  assert.deepEqual(survey(town, list, 30, rng(9)), survey(town, list, 30, rng(9)));
});

test('the standard error formula, with and without the finite-population correction', () => {
  assert.equal(standardError(0.5, 100), 0.05);
  assert.equal(standardError(0.5, 1, 2400), 0.5);
  assert.equal(standardError(0.3, 2400, 2400), 0);
  assert.equal(standardError(0.3, 3000, 2400), 0);
  const corrected = standardError(0.4, 600, 2400),
    plain = standardError(0.4, 600);
  assert.ok(Math.abs(corrected / plain - Math.sqrt(1800 / 2399)) < 1e-12);
  // Four times the sample, half the wobble (when the city is large).
  assert.ok(Math.abs(standardError(0.4, 400) / standardError(0.4, 100) - 0.5) < 1e-12);
});

test('random samples are unbiased on average, and their spread matches the formula', () => {
  const town = city(44);
  for (const [n, seed] of [
    [10, 1],
    [50, 2],
    [250, 3],
    [1000, 4],
  ]) {
    const times = 4000;
    const r = repeat(town, 'random', n, times, seed);
    const se = standardError(town.share, n, town.size);
    // The average of 4000 estimates sits within four standard errors of that average.
    assert.ok(Math.abs(r.bias) < (4 * se) / Math.sqrt(times), `n=${n}: bias ${r.bias}`);
    // The spread of the estimates matches the formula within 6%.
    assert.ok(Math.abs(r.spread / se - 1) < 0.06, `n=${n}: spread ${r.spread} vs ${se}`);
  }
  // At n = 1000 of 2400, the finite-population correction matters, and the simulation agrees with it.
  const r = repeat(town, 'random', 1000, 4000, 5);
  const without = standardError(town.share, 1000);
  assert.ok(r.spread < 0.85 * without, `${r.spread} should be well under ${without}`);
});

test('biased methods keep their offset as n grows, while their spread shrinks', () => {
  const town = city(44);
  const hood = oddestHood(town);
  for (const method of ['hood', 'volunteer']) {
    const target = frameShare(town, frame(town, method, hood));
    const offset = target - town.share;
    assert.ok(Math.abs(offset) > 0.15, `${method}: a large offset (${offset})`);
    const small = repeat(town, method, 20, 3000, 11, hood),
      large = repeat(town, method, 1000, 3000, 12, hood);
    // Each method averages to its frame's share, at every sample size...
    // (3000 surveys of 20 average to within about 0.002 of it, so 0.01 is a generous margin.)
    for (const r of [small, large]) assert.ok(Math.abs(r.mean - target) < 0.01, `${method}: ${r.mean} vs ${target}`);
    // ...so the bias is the same with 20 people as with 1000.
    assert.ok(Math.abs(large.bias - small.bias) < 0.02, `${method}: ${small.bias} then ${large.bias}`);
    assert.ok(Math.abs(large.bias - offset) < 0.01);
    // More asking tightens the estimates around the wrong value.
    assert.ok(large.spread < small.spread / 3);
    assert.ok(large.error > 5 * large.spread, `${method}: confidently wrong`);
  }
  // A small random sample beats a huge biased one.
  const smallRandom = repeat(town, 'random', 50, 3000, 13);
  const hugeBiased = repeat(town, 'volunteer', 1000, 3000, 14);
  assert.ok(smallRandom.error < hugeBiased.error);
});

test('summary splits typical error into wobble and bias', () => {
  const s = summary([0.4, 0.5, 0.6], 0.45);
  assert.ok(Math.abs(s.mean - 0.5) < 1e-12);
  assert.ok(Math.abs(s.bias - 0.05) < 1e-12);
  assert.ok(Math.abs(s.error ** 2 - (s.spread ** 2 + s.bias ** 2)) < 1e-12);
  assert.equal(summary([], 0.5).count, 0);
});
