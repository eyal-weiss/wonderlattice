import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.billiards;

// The room's opening shot, and the numbers below, were computed independently in Python (exact intersections in
// double precision, the stadium's rounding checked against 60-digit arithmetic with mpmath).
const START = { x: -1, y: -0.75 },
  AIM = (9 * Math.PI) / 180;
const E = M.ellipse(),
  S = M.stadium(1);

/** Roll a shot and its twin together in small steps until they are PARTED apart; where and after how many bounces. */
function parting(table, limit = 200, step = 0.001) {
  const [a, b] = M.twins(table, START.x, START.y, AIM);
  for (let n = 1; n * step <= limit; n++) {
    M.advance(table, a, step);
    M.advance(table, b, step);
    if (M.distance(a, b) > M.PARTED) return { travelled: n * step, bounces: a.bounces };
  }
  return null;
}

function gapAfter(table, travelled) {
  const [a, b] = M.twins(table, START.x, START.y, AIM);
  M.advance(table, a, travelled);
  M.advance(table, b, travelled);
  return M.distance(a, b);
}

test('billiards: exact bounces match an independent calculation', () => {
  const e = M.advance(E, M.launch(E, START.x, START.y, AIM), 50);
  assert.equal(e.bounces, 23);
  assert.ok(Math.abs(e.x - 0.5825685169087771) < 1e-9 && Math.abs(e.y - 0.6951877338718755) < 1e-9, `${e.x}, ${e.y}`);
  const s = M.advance(S, M.launch(S, START.x, START.y, AIM), 10);
  assert.equal(s.bounces, 4);
  assert.ok(Math.abs(s.x + 0.8398710684984494) < 1e-9 && Math.abs(s.y - 0.6371435784280153) < 1e-9, `${s.x}, ${s.y}`);
});

test('billiards: balls stay on the table, at unit speed, for tens of thousands of bounces', () => {
  for (const table of [E, S, M.stadium(0), M.stadium(0.05), M.stadium(2)]) {
    const ball = M.launch(table, 0.1, 0.2, 1.234);
    let worst = 0;
    M.advance(table, ball, 60000, {
      visit: (x, y) => {
        if (M.inside(table, x, y, 1e-9)) worst = Math.max(worst, 1);
        else if (!M.inside(table, x, y, -1e-9)) worst = Math.max(worst, 2);
      },
    });
    assert.equal(worst, 0, `${table.kind} ${table.half ?? ''}: every bounce is on the rail`);
    assert.ok(ball.bounces > 15000, `${ball.bounces} bounces`);
    assert.ok(Math.abs(Math.hypot(ball.dx, ball.dy) - 1) < 1e-12);
    assert.ok(Math.abs(ball.travelled - 60000) < 1e-6);
  }
});

test('billiards: a shot through one focus of the ellipse bounces through the other', () => {
  const [f1, f2] = M.foci(E);
  for (let i = 0; i < 24; i++) {
    const ball = M.launch(E, f1.x, f1.y, (i + 0.5) * ((2 * Math.PI) / 24));
    M.advance(E, ball, ball.left + 1e-9); // just past the first bounce
    // The distance from the second focus to the line the ball now follows.
    const off = Math.abs((f2.x - ball.x) * ball.dy - (f2.y - ball.y) * ball.dx);
    assert.ok(off < 1e-12, `direction ${i}: misses the focus by ${off}`);
  }
});

test('billiards: with a pocket at one focus, every shot from the other goes in after at most one bounce', () => {
  const [f1, f2] = M.foci(E);
  const pocket = { ...f2, r: M.POCKET };
  for (let i = 0; i < 36; i++) {
    const ball = M.advance(E, M.launch(E, f1.x, f1.y, i * 0.17453), 100, { pocket });
    assert.ok(ball.sunk && ball.bounces <= 1, `direction ${i}: ${ball.bounces} bounces`);
    assert.ok(M.distance(ball, f2) <= M.POCKET + 1e-12);
  }
  // Straight at the pocket, it goes in without a bounce. A shot whose caustic hugs the rail never comes near it:
  // it stays outside an ellipse whose ends are √3.81 − √3 ≈ 0.22 beyond the focus.
  assert.equal(M.advance(E, M.launch(E, f1.x, f1.y, 0), 10, { pocket }).bounces, 0);
  assert.equal(M.advance(E, M.launch(E, 0, -0.9, 0), 5000, { pocket }).sunk, false);
});

test('billiards: the ellipse keeps one number fixed, so the path never crosses its caustic', () => {
  const ball = M.launch(E, START.x, START.y, AIM);
  const k = M.momenta(E, ball);
  assert.ok(Math.abs(k - 0.268028415721955) < 1e-12, `${k}`);
  const c = M.caustic(E, k);
  assert.equal(c.kind, 'ellipse');
  assert.ok(Math.abs(c.a - 1.8077689055081003) < 1e-12 && Math.abs(c.b - 0.5177146083721754) < 1e-12);
  let drift = 0,
    closest = Infinity;
  M.advance(E, ball, 20000, { visit: () => (drift = Math.max(drift, Math.abs(M.momenta(E, ball) - k))) });
  assert.ok(drift < 1e-10, `the product drifts by ${drift} over ${ball.bounces} bounces`);
  // Sample the path: it stays outside the caustic ellipse (its equation is at least 1 there).
  const again = M.launch(E, START.x, START.y, AIM);
  for (let n = 0; n < 50000; n++) {
    M.advance(E, again, 0.1);
    closest = Math.min(closest, (again.x * again.x) / (c.a * c.a) + (again.y * again.y) / (c.b * c.b));
  }
  assert.ok(closest > 1 - 1e-9 && closest < 1.001, `closest approach ${closest}`);
  // Through the foci there is no caustic; between them, a hyperbola.
  assert.equal(M.caustic(E, M.momenta(E, M.launch(E, -Math.sqrt(3), 0, 1))).kind, 'foci');
  assert.equal(M.caustic(E, M.momenta(E, M.launch(E, 0, 0, 1))).kind, 'hyperbola');
});

test("billiards: Poncelet's porism: if one shot along a caustic closes after 4 bounces, all of them do", () => {
  // The diamond through the ends of both axes is a 4-bounce loop. Its caustic has k = b⁴ / (a² + b²) = 1/5.
  const k = 1 / 5;
  // Other shots along the same caustic: from points round the rail, the direction with the same k.
  for (const at of [0.3, 1.1, 2.0, 2.9, 4.4]) {
    const x = 2 * Math.cos(at),
      y = Math.sin(at);
    // Bisect for the inward direction whose product is k, on the side that turns anticlockwise.
    const inward = Math.atan2(-y / 1, -x / 4);
    let lo = inward,
      hi = inward + Math.PI / 2 - 1e-9;
    const f = (angle) => M.momenta(E, { x, y, dx: Math.cos(angle), dy: Math.sin(angle) }) - k;
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      if (Math.sign(f(mid)) === Math.sign(f(lo))) lo = mid;
      else hi = mid;
    }
    const ball = M.launch(E, x, y, lo);
    const start = { x, y, dx: ball.dx, dy: ball.dy };
    const corners = [];
    M.advance(E, ball, 1000, { visit: (px, py) => corners.length < 4 && corners.push({ x: px, y: py }) });
    assert.ok(M.distance(corners[3], start) < 1e-9, `from ${at}: the fourth bounce is back at the start`);
  }
});

test('billiards: the stadium separates twins within a dozen bounces; the ellipse keeps them together', () => {
  const s = parting(S);
  assert.equal(s.bounces, 10);
  assert.ok(Math.abs(s.travelled - 23.759) < 0.005, `stadium twins part after ${s.travelled}`);
  // A sliver of straight side (5% of the height) is enough.
  const sliver = parting(M.stadium(0.05));
  assert.equal(sliver.bounces, 17);
  assert.ok(Math.abs(sliver.travelled - 32.603) < 0.005, `sliver twins part after ${sliver.travelled}`);
  // The ellipse's twins, and a circle's, are still far closer than PARTED hundreds of bounces later.
  assert.ok(Math.abs(gapAfter(E, 100) - 0.0006890667834823084) < 1e-9);
  assert.ok(Math.abs(gapAfter(E, 400) - 0.005762544904871005) < 1e-9);
  assert.ok(Math.abs(gapAfter(M.stadium(0), 400) - 0.004357258584832191) < 1e-9);
  // They do part in the end: the independent calculation first finds them PARTED apart after 2,666 units, at
  // bounce 1,270 (sampled every half unit).
  const [a, b] = M.twins(E, START.x, START.y, AIM);
  let n = 0;
  while (M.distance(a, b) <= M.PARTED && n < 20000) {
    M.advance(E, a, 0.5);
    M.advance(E, b, 0.5);
    n++;
  }
  assert.equal(n * 0.5, 2666);
  assert.equal(a.bounces, 1270);
});

test('billiards: a rounding-sized nudge takes over the stadium, but not the ellipse', () => {
  // A nudge of 10⁻¹⁵, about the size of a rounding error, grows to PARTED within about 35 bounces here.
  const nudge = (table) => {
    const a = M.launch(table, START.x, START.y, AIM),
      b = M.launch(table, START.x + 1e-15, START.y, AIM);
    for (let n = 0; n < 4000; n++) {
      M.advance(table, a, 0.1);
      M.advance(table, b, 0.1);
      if (M.distance(a, b) > M.PARTED) return a.bounces;
    }
    return M.distance(a, b);
  };
  const bounces = nudge(S);
  assert.ok(bounces > 20 && bounces < 50, `stadium: parted after ${bounces} bounces`);
  assert.ok(nudge(E) < 1e-9, 'ellipse: still within a billionth after 400 units');
});

test('billiards: the stadium ball spreads evenly, as ergodicity says', () => {
  // Over a long run, the share of time spent between the straight sides approaches their share of the area.
  const ball = M.launch(S, START.x, START.y, AIM);
  let middle = 0;
  const samples = 200000;
  for (let n = 0; n < samples; n++) {
    M.advance(S, ball, 0.1);
    if (Math.abs(ball.x) < S.half) middle++;
  }
  const area = (4 * S.half) / (4 * S.half + Math.PI);
  assert.ok(Math.abs(middle / samples - area) < 0.02, `time share ${middle / samples}, area share ${area}`);
});

test('billiards: a start off the table is pulled back on', () => {
  for (const table of [E, S, M.stadium(0)]) {
    for (const [u, v] of [
      [1, 1],
      [-1, 0.99],
      [0.99, -1],
      [0, 1],
      [0.5, 0.2],
    ]) {
      const p = M.place(table, u, v);
      assert.ok(M.inside(table, p.x, p.y, 0.039), `${table.kind} (${u}, ${v}) → (${p.x}, ${p.y})`);
    }
    assert.deepEqual(M.place(table, 0.25, 0.25), { x: 0.25 * table.halfWidth, y: 0.25 });
  }
});
