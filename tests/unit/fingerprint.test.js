import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const F = globalThis.Wonderloom.models.fingerprint;
const grid = F.createGrid();
const WHORL = 0,
  LOOP = 1,
  ARCH = 2,
  OWN = 3;

/** Grow a preset until the room would call it finished. */
function grow(pattern, lead, { scale = 0.55, twin = 0, seeds = [] } = {}) {
  const sim = F.createSim(grid, F.sitesFor(grid, pattern, lead, seeds, twin), scale);
  while (!F.finished(sim)) F.advance(sim, 50);
  return sim;
}
const grown = { whorl: grow(WHORL, 3), loop: grow(LOOP, 3), arch: grow(ARCH, 13) };

/** Cells outside the fingertip that the boundary copies into (the "ghosts"). */
const ghosts = new Set();
for (let g = 0; g < grid.ghosts.length; g += 2) ghosts.add(grid.ghosts[g]);

test('the fingertip is a symmetric, rounded shape, and its outline matches the grid', () => {
  const { W, H, mask } = grid;
  assert.ok(grid.count > W * H * 0.6 && grid.count < W * H * 0.9);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) assert.equal(mask[y * W + x], mask[y * W + (W - 1 - x)], `row ${y} symmetric`);
  // Narrow at the tip, widest in the middle, a little narrower at the crease.
  const width = (y) => mask.slice(y * W, (y + 1) * W).reduce((s, m) => s + m, 0);
  assert.ok(width(grid.top + 2) < width(Math.round(H / 2)) / 3);
  assert.ok(width(grid.bottom) < width(Math.round(H / 2)));
  for (const p of F.outline()) assert.ok(p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
  assert.equal(F.inside(grid, 0.5, 0.5), true);
  assert.equal(F.inside(grid, 0.02, 0.05), false);
  assert.equal(F.seedSite(grid, 0.01, 0.01, 0), null);
});

test('left alone, the even state stays exactly even: ridges need a starting site', () => {
  const sim = F.createSim(grid, [], 0.55);
  F.advance(sim, 300);
  assert.ok(sim.a.every((v) => v === 0) && sim.h.every((v) => v === 0));
  // A site that has not started yet changes nothing either.
  const later = F.createSim(grid, F.sitesFor(grid, WHORL, 16), 0.55);
  later.sites = later.sites.filter((s) => s.start > 0);
  F.advance(later, 300);
  assert.ok(later.a.every((v) => v === 0));
  assert.equal(F.coverage(later), 0);
});

test('both signals stay finite and bounded while ridges grow', () => {
  for (const [name, sim] of Object.entries(grown)) {
    let most = 0;
    for (let c = 0; c < sim.a.length; c++) {
      assert.ok(Number.isFinite(sim.a[c]) && Number.isFinite(sim.h[c]), `${name} finite`);
      most = Math.max(most, Math.abs(sim.a[c]), Math.abs(sim.h[c]));
    }
    assert.ok(most > 0.2 && most < 1, `${name} amplitude ${most}`);
  }
});

test('nothing grows outside the fingertip', () => {
  for (const sim of Object.values(grown)) {
    for (let c = 0; c < sim.a.length; c++) {
      if (grid.mask[c]) continue;
      assert.equal(sim.born[c], -1);
      if (!ghosts.has(c)) assert.ok(sim.a[c] === 0 && sim.h[c] === 0, `cell ${c} stays empty`);
    }
  }
});

test('a step is deterministic, and a twin differs only by tiny details', () => {
  const run = (twin) => F.advance(F.createSim(grid, F.sitesFor(grid, LOOP, 3, [], twin), 0.55), 700);
  const one = run(4),
    again = run(4),
    twin = run(5);
  assert.deepEqual(one.a, again.a);
  assert.deepEqual(one.h, again.h);
  assert.notDeepEqual(one.a, twin.a);
  // Same plan, so the same kind of pattern.
  assert.equal(F.classify(grow(WHORL, 3, { twin: 7 })).type, 'whorl');
});

test('ridges spread outward from the sites until they cover the fingertip', () => {
  const sim = F.createSim(grid, F.sitesFor(grid, WHORL, 3), 0.55);
  let last = 0;
  const seen = [];
  for (let k = 0; k < 12; k++) {
    F.advance(sim, 100);
    const now = F.coverage(sim);
    assert.ok(now >= last, 'coverage never shrinks');
    seen.push(now);
    last = now;
  }
  assert.ok(seen[0] > 0 && seen[0] < 0.05, `starts small: ${seen[0]}`);
  assert.ok(seen[4] > seen[1] * 3, 'and grows');
  for (const sim of Object.values(grown)) assert.ok(F.coverage(sim) > 0.97);
  // Cells near the pad's centre join before cells near the rim.
  const at = (x, y) => sim.born[Math.round(y * grid.H) * grid.W + Math.round(x * grid.W)];
  assert.ok(at(0.5, 0.45) < at(0.5, 0.25) && at(0.5, 0.45) < at(0.2, 0.45));
});

test('the head start delays the other sites by about that many ridges', () => {
  for (const lead of [0, 4, 10]) {
    const sites = F.sitesFor(grid, WHORL, lead);
    const pad = sites.find((s) => s.role === 'pad'),
      tip = sites.find((s) => s.role === 'tip'),
      crease = sites.find((s) => s.role === 'crease');
    assert.equal(pad.start, 0);
    assert.ok(Math.abs(tip.start - lead * F.STEPS_PER_RIDGE) <= lead * F.STEPS_PER_RIDGE * 0.07 + 1);
    assert.equal(tip.start, crease.start);
  }
  // Arches have no pad site; your own pattern starts only once you add a point.
  assert.ok(!F.sitesFor(grid, ARCH, 13).some((s) => s.role === 'pad'));
  assert.equal(F.sitesFor(grid, OWN, 3).length, 0);
  const own = F.sitesFor(grid, OWN, 3, [{ x: 0.4, y: 0.4, start: 0 }]);
  assert.deepEqual(own.map((s) => s.role).sort(), ['crease', 'tip', 'yours']);
});

/** Distance between ridges along a vertical line through the flat ridges of the arch. */
function period(sim) {
  const x = Math.round(grid.W / 2),
    from = Math.round(grid.H * 0.6),
    to = Math.round(grid.H * 0.95);
  const crossings = [];
  for (let y = from; y < to; y++) {
    const a = sim.a[y * grid.W + x],
      b = sim.a[(y + 1) * grid.W + x];
    if (a <= 0 && b > 0) crossings.push(y + a / (a - b));
  }
  return (crossings.at(-1) - crossings[0]) / (crossings.length - 1);
}

test('stripes form, with the spacing the equations predict', () => {
  const sim = grown.arch;
  let mean = 0,
    square = 0;
  for (let c = 0; c < sim.a.length; c++)
    if (grid.mask[c]) {
      mean += sim.a[c];
      square += sim.a[c] ** 2;
    }
  mean /= grid.count;
  assert.ok(square / grid.count - mean * mean > 0.02, 'the variance rose from zero');
  const measured = period(sim);
  assert.ok(Math.abs(measured / F.wavelength(0.55) - 1) < 0.15, `period ${measured} vs ${F.wavelength(0.55)}`);
  // Wider spacing, wider stripes.
  assert.ok(period(grow(ARCH, 13, { scale: 1 })) > measured * 1.2);
});

test('the three presets grow a whorl, a loop, and an arch, with the expected triradii', () => {
  const whorl = F.classify(grown.whorl),
    loop = F.classify(grown.loop),
    arch = F.classify(grown.arch);
  assert.equal(whorl.type, 'whorl');
  assert.equal(whorl.deltas.length, 2);
  assert.equal(loop.type, 'loop');
  assert.equal(loop.deltas.length, 1);
  assert.equal(arch.type, 'arch');
  assert.equal(arch.deltas.length, 0);
  // A whorl's triradii sit one on each side, below its centre.
  const [left, right] = [...whorl.deltas].sort((p, q) => p.x - q.x);
  assert.ok(left.x < 0.4 && right.x > 0.6 && left.y > 0.45 && right.y > 0.45);
});

test('a point of your own grows rings around itself', () => {
  const sim = grow(OWN, 6, { seeds: [{ x: 0.5, y: 0.4, start: 0 }] });
  assert.equal(F.classify(sim).type, 'whorl');
  assert.ok(F.finished(sim));
});

/** Advance one step at a time until finished, as the room does. */
function finish(sim) {
  while (!F.finished(sim)) F.advance(sim, 1);
  return sim;
}

test('a point planted after the fingertip is covered replays exactly from the settings', () => {
  // Live: grow a whorl until it is covered, then plant a point, rebuilding the sites as the room does.
  const live = F.createSim(grid, F.sitesFor(grid, WHORL, 3, [], 2), 0.55);
  while (live.fullAt < 0) F.advance(live, 1);
  F.advance(live, 200);
  const seeds = [{ x: 0.5, y: 0.3, start: live.steps }];
  live.sites = F.sitesFor(grid, WHORL, 3, seeds, 2);
  finish(live);
  // Replay: the same settings from scratch, as a shared link, a trail visit, or "Start again" would.
  const replay = finish(F.createSim(grid, F.sitesFor(grid, WHORL, 3, seeds, 2), 0.55));
  assert.ok(live.steps > seeds[0].start + 1000, 'the late point gets time to settle');
  assert.equal(replay.steps, live.steps);
  assert.deepEqual(replay.a, live.a);
  assert.deepEqual(replay.h, live.h);
});

test('points off the fingertip start nothing', () => {
  const off = [{ x: 0, y: 0, start: 0 }];
  assert.equal(F.sitesFor(grid, OWN, 3, off).length, 0);
  assert.deepEqual(
    F.sitesFor(grid, WHORL, 3, off).map((s) => s.role),
    F.sitesFor(grid, WHORL, 3).map((s) => s.role),
  );
});
