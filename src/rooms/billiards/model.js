/*
 * The table that forgets · billiards in an ellipse and in a stadium. Pure functions, no DOM.
 * A ball rolls in straight lines and bounces off the rail with equal angles. Lengths are in units of half the
 * table's height.
 *   The ellipse x²/4 + y² = 1 has its foci at (±√3, 0). A path through one focus bounces through the other, and
 *   every path stays tangent to one confocal ellipse or hyperbola, its caustic: the product of the ball's angular
 *   momenta about the two foci never changes (the table is integrable, as Birkhoff showed).
 *   The stadium is a rectangle capped by two semicircles of radius 1. Its paths are chaotic (Bunimovich, 1979):
 *   two nearly identical shots separate exponentially, bounce by bounce.
 */
(() => {
  'use strict';

  /** The ellipse's semi-axes, and the distance from its centre to each focus. */
  const A = 2,
    B = 1;
  const FOCUS = Math.sqrt(A * A - B * B);
  /** How far off the twin is launched: 0.001°, in radians. */
  const TWIN = (0.001 * Math.PI) / 180;
  /** Twins count as parted once they are this far apart: a twentieth of the table's height. */
  const PARTED = 0.1;
  /** The pocket's radius, when there is one. */
  const POCKET = 0.12;
  const EPS = 1e-9;

  const ellipse = () => ({ kind: 'ellipse', a: A, b: B, focus: FOCUS, halfWidth: A, halfHeight: B });

  /** A stadium whose straight sides are `flat` times the table's height long (0 is a circle). */
  function stadium(flat) {
    const half = Math.max(0, flat);
    return { kind: 'stadium', half, radius: 1, halfWidth: half + 1, halfHeight: 1 };
  }

  /** Is (x, y) on the table, at least `margin` from the rail? */
  function inside(table, x, y, margin = 0) {
    if (table.kind === 'ellipse') {
      const a = table.a - margin,
        b = table.b - margin;
      return (x * x) / (a * a) + (y * y) / (b * b) < 1;
    }
    const r = table.radius - margin,
      over = Math.max(0, Math.abs(x) - table.half);
    return Math.abs(y) < r && over * over + y * y < r * r;
  }

  /**
   * The point at (u, v) in the table's own proportions (−1 to 1 across its width and height), pulled in towards
   * the centre if that is off the table or too close to the rail.
   */
  function place(table, u, v, margin = 0.04) {
    const x = u * table.halfWidth,
      y = v * table.halfHeight;
    if (inside(table, x, y, margin)) return { x, y };
    let lo = 0,
      hi = 1;
    for (let i = 0; i < 40; i++) {
      const k = (lo + hi) / 2;
      if (inside(table, k * x, k * y, margin)) lo = k;
      else hi = k;
    }
    return { x: lo * x, y: lo * y };
  }

  /** Where a ball at (x, y) moving along (dx, dy) next meets the rail: the distance, the point and the normal. */
  function hitEllipse(e, x, y, dx, dy) {
    const ia = 1 / (e.a * e.a),
      ib = 1 / (e.b * e.b);
    const qa = dx * dx * ia + dy * dy * ib,
      qb = 2 * (x * dx * ia + y * dy * ib),
      qc = x * x * ia + y * y * ib - 1;
    // The two roots have opposite signs (the ball is inside), or one is zero (it's on the rail). This way of
    // finding them avoids subtracting nearly equal numbers.
    const q = -0.5 * (qb + (qb < 0 ? -1 : 1) * Math.sqrt(Math.max(0, qb * qb - 4 * qa * qc)));
    const t = Math.max(q / qa, q ? qc / q : 0);
    let hx = x + t * dx,
      hy = y + t * dy;
    const k = Math.sqrt(hx * hx * ia + hy * hy * ib); // put the point exactly on the rail
    hx /= k;
    hy /= k;
    const nx = hx * ia,
      ny = hy * ib,
      n = Math.hypot(nx, ny);
    return { t, x: hx, y: hy, nx: nx / n, ny: ny / n };
  }

  function hitStadium(s, x, y, dx, dy) {
    const r = s.radius,
      h = s.half;
    let best = null;
    const consider = (t, hx, hy, nx, ny) => {
      if (t > EPS && (!best || t < best.t)) best = { t, x: hx, y: hy, nx, ny };
    };
    // The straight sides, y = ±r for |x| ≤ half. The small allowance keeps a bounce exactly at a join from
    // slipping between the side and the curve; the two agree there, since the stadium has no corners.
    if (dy) {
      const side = dy > 0 ? r : -r,
        t = (side - y) / dy,
        hx = x + t * dx;
      if (Math.abs(hx) <= h + 1e-12) consider(t, Math.max(-h, Math.min(h, hx)), side, 0, Math.sign(side));
    }
    // The round ends: a circle about (±half, 0), where the path leaves it on the outer side.
    for (const end of [1, -1]) {
      const cx = end * h,
        ox = x - cx,
        b = ox * dx + y * dy,
        c = ox * ox + y * y - r * r,
        disc = b * b - c;
      if (disc < 0) continue;
      const t = -b + Math.sqrt(disc);
      const px = x + t * dx - cx,
        py = y + t * dy;
      if (end * px < -1e-12) continue;
      const n = Math.hypot(px, py);
      consider(t, cx + (r * px) / n, (r * py) / n, px / n, py / n);
    }
    // Never expected; if rounding ever loses the rail, send the ball straight back rather than through it.
    return best ?? { t: 0, x, y, nx: -dx, ny: -dy };
  }

  const hit = (table, x, y, dx, dy) =>
    table.kind === 'ellipse' ? hitEllipse(table, x, y, dx, dy) : hitStadium(table, x, y, dx, dy);

  /** A ball at (x, y), shot at `angle` (radians, anticlockwise from the right). */
  function launch(table, x, y, angle) {
    const ball = { x, y, dx: Math.cos(angle), dy: Math.sin(angle), bounces: 0, travelled: 0, sunk: false };
    ball.next = hit(table, x, y, ball.dx, ball.dy);
    ball.left = ball.next.t;
    return ball;
  }

  /** A shot and its twin, launched 0.001° apart from the same spot. */
  const twins = (table, x, y, angle) => [launch(table, x, y, angle), launch(table, x, y, angle + TWIN)];

  /**
   * How far along a straight run from (x, y) the ball first comes within the pocket, or −1 if it doesn't within
   * `length`.
   */
  function reaches(x, y, dx, dy, length, pocket) {
    const ox = pocket.x - x,
      oy = pocket.y - y;
    const along = ox * dx + oy * dy,
      aside = ox * ox + oy * oy - along * along,
      r2 = pocket.r * pocket.r;
    if (aside > r2) return -1;
    const half = Math.sqrt(r2 - aside);
    if (along + half < 0 || along - half > length) return -1;
    return Math.max(0, along - half);
  }

  /**
   * Roll the ball on by `distance`, bouncing as it goes. `visit(x, y)` hears each bounce, in order; a ball that
   * reaches the pocket stops there, sunk.
   */
  function advance(table, ball, distance, { visit, pocket } = {}) {
    let left = distance,
      guard = 0;
    while (left > 0 && !ball.sunk && guard++ < 100000) {
      if (pocket) {
        const f = reaches(ball.x, ball.y, ball.dx, ball.dy, Math.min(left, ball.left), pocket);
        if (f >= 0) {
          ball.x += f * ball.dx;
          ball.y += f * ball.dy;
          ball.travelled += f;
          ball.sunk = true;
          break;
        }
      }
      if (ball.left > left) {
        ball.x += left * ball.dx;
        ball.y += left * ball.dy;
        ball.left -= left;
        ball.travelled += left;
        break;
      }
      left -= ball.left;
      ball.travelled += ball.left;
      const h = ball.next;
      ball.x = h.x;
      ball.y = h.y;
      // Equal angles: reflect the direction in the rail's normal.
      const dot = ball.dx * h.nx + ball.dy * h.ny,
        dx = ball.dx - 2 * dot * h.nx,
        dy = ball.dy - 2 * dot * h.ny,
        n = Math.hypot(dx, dy);
      ball.dx = dx / n;
      ball.dy = dy / n;
      ball.bounces++;
      visit?.(ball.x, ball.y);
      ball.next = hit(table, ball.x, ball.y, ball.dx, ball.dy);
      ball.left = ball.next.t;
    }
    return ball;
  }

  const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

  /** The two foci of the ellipse. */
  const foci = (e) => [
    { x: -e.focus, y: 0 },
    { x: e.focus, y: 0 },
  ];

  /**
   * The ellipse's conserved quantity: the product of the ball's angular momenta about the two foci (per unit
   * mass and speed). It stays the same at every bounce.
   */
  function momenta(e, ball) {
    const l1 = (ball.x + e.focus) * ball.dy - ball.y * ball.dx,
      l2 = (ball.x - e.focus) * ball.dy - ball.y * ball.dx;
    return l1 * l2;
  }

  /**
   * The curve every run of the path touches, from the conserved product k: a confocal ellipse with semi-axes
   * √(c² + k) and √k when k > 0; a confocal hyperbola x²/(c² + k) − y²/(−k) = 1 when k < 0; and, when k = 0,
   * no curve: the path runs through the foci.
   */
  function caustic(e, k) {
    if (Math.abs(k) < 1e-9) return { kind: 'foci' };
    const a = Math.sqrt(Math.max(0, e.focus * e.focus + k));
    return k > 0 ? { kind: 'ellipse', a, b: Math.sqrt(k) } : { kind: 'hyperbola', a, b: Math.sqrt(-k) };
  }

  Wonderlattice.models.billiards = {
    TWIN,
    PARTED,
    POCKET,
    ellipse,
    stadium,
    inside,
    place,
    hit,
    launch,
    twins,
    reaches,
    advance,
    distance,
    foci,
    momenta,
    caustic,
  };
})();
