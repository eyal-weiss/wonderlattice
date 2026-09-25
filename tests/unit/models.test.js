import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const { motion, waves, flock, ribbon } = globalThis.Wonderlattice.models;
const TAU = Math.PI * 2;
const close = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

test('motion: the pen returns to its start after exactly one period', () => {
  for (const k of [-5, 2.5, -3, -3.8, 1.03, -2.25, 0, 7.77, -10]) {
    for (const r of [10, 42, 85]) {
      const s = { k, r, p: 45 };
      const start = motion.position(0, s),
        end = motion.position(motion.period(s), s);
      assert.ok(close(start.x, end.x, 1e-6) && close(start.y, end.y, 1e-6), `k=${k} r=${r}`);
    }
  }
});

test('motion: period counts outer turns in lowest terms', () => {
  const turns = (k) => Math.round(motion.period({ k }) / TAU);
  assert.equal(turns(-5), 1);
  assert.equal(turns(2.5), 2);
  assert.equal(turns(-3.8), 5);
  assert.equal(turns(1.03), 100);
  assert.equal(turns(-2.25), 4);
  assert.equal(motion.gcd(0, 100), 100);
});

test('motion: the pen stays inside the unit circle and the elbow on the inner circle', () => {
  const s = { k: -3.8, r: 48, p: 90 };
  for (let v = 0; v < motion.period(s); v += 0.37) {
    const q = motion.position(v, s);
    assert.ok(Math.hypot(q.x, q.y) <= 1 + 1e-12);
    assert.ok(close(Math.hypot(q.ax, q.ay), 1 - s.r / 100));
  }
});

test('motion: ink colours are valid rgb strings for every palette', () => {
  for (let palette = 0; palette < motion.palettes.length; palette++) {
    for (const v of [0, 1, 10, 100, -3]) assert.match(motion.color(v, palette), /^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/);
  }
});

test('waves: the combined wave is the sum, and opposite phases cancel', () => {
  const s = { ratio: 1.5, phase: 30 };
  for (const x of [0, 0.13, 0.5, 0.91]) {
    const sum = waves.wavePoint(x, 0, s, 2) + waves.wavePoint(x, 1, s, 2);
    assert.ok(close(waves.wavePoint(x, 2, s, 2), sum));
  }
  const silence = { ratio: 1, phase: 180 };
  for (const x of [0, 0.2, 0.77]) assert.ok(close(waves.wavePoint(x, 2, silence, 1.3), 0, 1e-12));
  assert.ok(close(waves.beat({ f: 220, ratio: 1.02 }), 4.4));
});

test('flock: birds keep unit speed, wrap around the torus, and agreement stays in [0, 1]', () => {
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  let birds = flock.seed(80, random);
  const s = { align: 1.2, cohesion: 0.6, separate: 1.5, attract: true };
  let order = 0;
  for (let i = 0; i < 60; i++)
    ({ birds, order } = flock.step(birds, s, 1 / 30, 16 / 9, i % 2 ? { x: 0.5, y: 0.5 } : null));
  assert.equal(birds.length, 80);
  for (const b of birds) {
    assert.ok(b.x >= 0 && b.x < 1 && b.y >= 0 && b.y < 1);
    assert.ok(close(Math.hypot(b.vx, b.vy), 1, 1e-9));
  }
  assert.ok(order >= 0 && order <= 1 + 1e-12);
});

test('flock: strong alignment brings the flock into agreement', () => {
  let seed = 3;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  let birds = flock.seed(60, random),
    order = 0;
  const s = { align: 2, cohesion: 1.2, separate: 0.5, attract: true };
  for (let i = 0; i < 900; i++) ({ birds, order } = flock.step(birds, s, 1 / 30, 1, null));
  assert.ok(order > 0.9, `agreement ${order}`);
});

test('flock: torus offsets take the short way around', () => {
  assert.ok(close(flock.delta(0.9), -0.1));
  assert.ok(close(flock.delta(-0.8), 0.2));
  assert.equal(flock.wrap(1.25), 0.25);
  assert.ok(close(flock.wrap(-0.25), 0.75));
});

test('ribbon: odd twists join each edge to the other edge; even twists join each edge to itself', () => {
  for (const u of [0, 0.4, 2.2]) {
    for (const v of [-0.4, 0.1, 0.46]) {
      const mobius = ribbon.surface(u + TAU, v, 1),
        flipped = ribbon.surface(u, -v, 1);
      assert.ok(close(mobius.x, flipped.x) && close(mobius.y, flipped.y) && close(mobius.z, flipped.z));
      for (const n of [0, 2]) {
        const a = ribbon.surface(u + TAU, v, n),
          b = ribbon.surface(u, v, n);
        assert.ok(close(a.x, b.x) && close(a.y, b.y) && close(a.z, b.z));
      }
    }
  }
});

test('ribbon: projection keeps the centre fixed and recedes with depth', () => {
  const view = { rx: 0, ry: 0, cx: 100, cy: 50, scale: 10 };
  assert.deepEqual(ribbon.project({ x: 0, y: 0, z: 0 }, view), { x: 100, y: 50, z: 0 });
  const near = ribbon.project({ x: 1, y: 0, z: 0 }, { ...view, rx: -0.3 });
  assert.ok(near.x > 100);
});
