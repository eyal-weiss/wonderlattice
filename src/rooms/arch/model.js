/*
 * Hang it, flip it, build it · a hanging chain, the same shape turned over as an arch of stones, and whether an
 * arch of any shape stands.
 * A chain hangs in pure tension. Turned upside down, every force reverses, and the same shape is in pure compression:
 * Hooke's rule of 1675, "as hangs the flexible line, so but inverted will stand the rigid arch". An arch of loose
 * stones stands if a line of thrust (the path of the forces, the hanging shape for its own loads) fits inside the
 * stones at every joint: the safe theorem of masonry, with no tension, no crushing and no sliding (Heyman). If none
 * fits, joints open as hinges, and four hinges make a mechanism that falls.
 * https://en.wikipedia.org/wiki/Catenary · https://en.wikipedia.org/wiki/Catenary_arch
 * Pure functions, no DOM. Points are [x, y] with y up. Weights are in "beads": each bead of the chain weighs 1.
 */
(() => {
  'use strict';

  const STONES = 21; // stones in the arch made from the chain, two links each
  const LINKS = 2 * STONES; // the chain's links; it has LINKS − 1 beads between its pegs
  const TOWER = 4; // one weight on the chain, or one storey of a tower on the arch, in beads
  const ROAD = 120; // the road's weight, in beads for each unit of length along it (the chain weighs about 27)
  const GRAVITY = 9.8; // in world units (the default span is 1) per second squared

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1]];
  const len = (a) => Math.hypot(a[0], a[1]);
  const perp = (a) => [-a[1], a[0]];
  const rotate = (p, angle) => [
    p[0] * Math.cos(angle) - p[1] * Math.sin(angle),
    p[0] * Math.sin(angle) + p[1] * Math.cos(angle),
  ];

  // ---------- the hanging chain ----------

  /** Each bead's weight: 1, plus the towers hung on the middle bead of each stone, plus its share of a road. */
  function beadWeights(towers, points = null, road = false) {
    const w = Array.from({ length: LINKS - 1 }, () => 1);
    towers.forEach((k, j) => {
      if (k) w[2 * j] += k * TOWER;
    });
    if (road && points)
      for (let i = 0; i < w.length; i++) w[i] += (ROAD * Math.abs(points[i + 2][0] - points[i][0])) / 2;
    return w;
  }

  /** The chain from a and b with given tension: where its links go when the horizontal pull is H and it leaves a
   * with vertical pull Y0. Returns the points, and how each moves with H and Y0. */
  function lay(a, step, weights, H, Y0) {
    const points = [a];
    let p = a,
      Y = Y0,
      dH = [0, 0],
      dY = [0, 0];
    for (let k = 0; k < LINKS; k++) {
      if (k) Y += weights[k - 1];
      const r = Math.hypot(H, Y),
        r3 = r * r * r;
      p = [p[0] + (step * H) / r, p[1] + (step * Y) / r];
      points.push(p);
      dH = [dH[0] + (step * Y * Y) / r3, dH[1] - (step * H * Y) / r3];
      dY = [dY[0] - (step * H * Y) / r3, dY[1] + (step * H * H) / r3];
    }
    return { points, dH, dY };
  }

  /**
   * The chain at rest: links of equal length between pegs a and b, each bead pulled down by its weight. Newton's
   * method on the horizontal pull H and the vertical pull Y0 at a, until the last link ends at b.
   */
  function hangOnce(a, b, length, weights, guess) {
    const step = length / LINKS;
    const total = weights.reduce((s, w) => s + w, 0);
    let H, Y0;
    if (guess) ({ H, Y0 } = guess);
    else {
      // A start from the smooth catenary: sqrt(L² − dy²) = 2c·sinh(dx / 2c), with H = c times the weight per length.
      const dx = b[0] - a[0],
        dy = b[1] - a[1];
      const target = Math.sqrt(Math.max(length * length - dy * dy, dx * dx * 1.0001)) / dx;
      let lo = 1e-3,
        hi = 1e3;
      for (let i = 0; i < 80; i++) {
        const c = Math.sqrt(lo * hi);
        if (((2 * c) / dx) * Math.sinh(dx / (2 * c)) > target) lo = c;
        else hi = c;
      }
      H = (Math.sqrt(lo * hi) * total) / length;
      Y0 = -total / 2 + (H * dy) / dx;
    }
    for (let iter = 0; iter < 100; iter++) {
      const { points, dH, dY } = lay(a, step, weights, H, Y0);
      const end = points[LINKS];
      const fx = end[0] - b[0],
        fy = end[1] - b[1];
      if (Math.hypot(fx, fy) < 1e-12 * (1 + length)) return { points, H, Y0 };
      const det = dH[0] * dY[1] - dY[0] * dH[1];
      if (!Number.isFinite(det) || Math.abs(det) < 1e-300) break;
      let sH = -(fx * dY[1] - dY[0] * fy) / det,
        sY = -(dH[0] * fy - fx * dH[1]) / det;
      // Keep the pull positive, and take smaller steps if a full one makes things worse.
      let t = 1;
      while (H + t * sH <= H * 0.2) t /= 2;
      const before = Math.hypot(fx, fy);
      for (let k = 0; k < 30; k++) {
        const e = lay(a, step, weights, H + t * sH, Y0 + t * sY).points[LINKS];
        if (Math.hypot(e[0] - b[0], e[1] - b[1]) < before) break;
        t /= 2;
      }
      H += t * sH;
      Y0 += t * sY;
    }
    const { points } = lay(a, step, weights, H, Y0);
    const end = points[LINKS];
    return Math.hypot(end[0] - b[0], end[1] - b[1]) < 1e-7 ? { points, H, Y0 } : null;
  }

  /**
   * The chain at rest with its towers and, if asked, a road hung from it. Heavy towers are added a little at a time,
   * so Newton's method always starts close; a road's weight depends on the chain's shape, so it is found by repeating.
   */
  function hang(a, b, length, towers = [], road = false) {
    const heavy = towers.some((k) => k > 0);
    const stages = heavy || road ? 6 : 1;
    let rest = null;
    for (let s = 1; s <= stages; s++) {
      const shared = towers.map((k) => (k * s) / stages);
      for (let r = 0; r < (road ? 12 : 1); r++) {
        const weights = beadWeights(shared, rest?.points, road && rest !== null);
        const next = hangOnce(a, b, length, weights, rest) ?? hangOnce(a, b, length, weights, null);
        if (!next) return rest;
        rest = { ...next, weights };
      }
    }
    return rest;
  }

  /** A chain to move: beads with positions now and a moment ago (Verlet), hung between two fixed pegs. */
  function chain(points) {
    return { points: points.map((p) => p.slice()), before: points.map((p) => p.slice()) };
  }

  /**
   * One step of the moving chain: gravity, a little damping, then each link pulled back to its length, the lighter
   * bead moving more. At rest this is the same balance of weights and pulls as hang().
   */
  function relax(c, a, b, length, weights, dt, damping = 0.985, passes = 24) {
    const p = c.points,
      q = c.before,
      n = p.length - 1,
      step = length / LINKS;
    p[0] = a.slice();
    p[n] = b.slice();
    for (let i = 1; i < n; i++) {
      const vx = (p[i][0] - q[i][0]) * damping,
        vy = (p[i][1] - q[i][1]) * damping;
      q[i] = p[i].slice();
      p[i] = [p[i][0] + vx, p[i][1] + vy - GRAVITY * dt * dt];
    }
    const inverse = (i) => (i === 0 || i === n ? 0 : 1 / weights[i - 1]);
    for (let pass = 0; pass < passes; pass++) {
      const forward = pass % 2 === 0;
      for (let k = 0; k < n; k++) {
        const i = forward ? k : n - 1 - k;
        const d = sub(p[i + 1], p[i]),
          l = len(d) || 1e-12;
        const wi = inverse(i),
          wj = inverse(i + 1);
        if (wi + wj === 0) continue;
        const f = (l - step) / l / (wi + wj);
        p[i] = add(p[i], d, f * wi);
        p[i + 1] = add(p[i + 1], d, -f * wj);
      }
    }
    return c;
  }

  // ---------- the smooth curves, for checking and for overlays ----------

  /** The catenary y = c·cosh(x / c) − c through (±span/2, 0) with a given length (y up from the lowest point). */
  function catenary(span, length) {
    let lo = 1e-4,
      hi = 1e4;
    for (let i = 0; i < 100; i++) {
      const c = Math.sqrt(lo * hi);
      if (2 * c * Math.sinh(span / (2 * c)) > length) lo = c;
      else hi = c;
    }
    const c = Math.sqrt(lo * hi);
    return { c, sag: c * Math.cosh(span / (2 * c)) - c, y: (x) => c * Math.cosh(x / c) - c };
  }

  // ---------- arches: stones along a curve ----------

  /**
   * Stones along a centreline, from the left foot to the right: joints at the given points, square to the curve,
   * `thickness` deep. Each stone is the four-sided block between two joints. The outward side is to the left of
   * the direction of travel (above, at the crown). `ends` can give the curve's direction at the two feet.
   */
  function stones(line, joints, thickness, ends = null) {
    const at = joints.map((k, i) => {
      const prev = line[Math.max(0, k - 1)],
        next = line[Math.min(line.length - 1, k + 1)];
      const t = ends && i === 0 ? ends[0] : ends && i === joints.length - 1 ? ends[1] : sub(next, prev),
        l = len(t) || 1;
      const tangent = [t[0] / l, t[1] / l],
        normal = perp(tangent),
        c = line[k];
      return {
        c,
        tangent,
        normal,
        inner: add(c, normal, -thickness / 2),
        outer: add(c, normal, thickness / 2),
      };
    });
    const blocks = [];
    for (let j = 0; j + 1 < at.length; j++) {
      const corners = [at[j].inner, at[j + 1].inner, at[j + 1].outer, at[j].outer];
      blocks.push({ corners, ...polygon(corners), middle: line[Math.round((joints[j] + joints[j + 1]) / 2)] });
    }
    return { joints: at, blocks, thickness };
  }

  /** Area and centroid of a simple polygon. */
  function polygon(corners) {
    let area = 0,
      cx = 0,
      cy = 0;
    corners.forEach((p, i) => {
      const q = corners[(i + 1) % corners.length];
      const cr = p[0] * q[1] - q[0] * p[1];
      area += cr;
      cx += (p[0] + q[0]) * cr;
      cy += (p[1] + q[1]) * cr;
    });
    area /= 2;
    return { area: Math.abs(area), centroid: [cx / (6 * area), cy / (6 * area)] };
  }

  /** The arch made by turning the hanging chain over, about the line half-way between its lowest point and the
   * higher peg, so the arch fills the same band; its joints fall at every other bead. */
  function flipLevel(points) {
    const low = Math.min(...points.map((p) => p[1])),
      high = Math.max(points[0][1], points[points.length - 1][1]);
    return (low + high) / 2;
  }
  const flipped = (points, level) => points.map(([x, y]) => [x, 2 * level - y]);

  function chainArch(points, thickness, towers = [], road = false) {
    const level = flipLevel(points);
    const line = flipped(points, level);
    const arch = stones(
      line,
      Array.from({ length: STONES + 1 }, (_, j) => 2 * j),
      thickness,
    );
    arch.level = level;
    arch.line = line;
    arch.loads = loadsOf(arch, towers, road ? line : null);
    return arch;
  }

  /**
   * The loads on an arch, stone by stone: each stone's own weight at its centroid (a stone as long as two links weighs
   * two beads, as the chain did), each storey of a tower on the stone's middle, and a road's weight on its posts.
   */
  function loadsOf(arch, towers = [], road = null) {
    const loads = [];
    const step = arch.joints.length > 1 ? len(sub(arch.joints[1].c, arch.joints[0].c)) : 1;
    arch.blocks.forEach((b, j) => {
      loads.push({ block: j, x: b.centroid[0], y: b.centroid[1], w: (2 * b.area) / (arch.thickness * step) });
      if (towers[j]) {
        const top = b.middle;
        loads.push({ block: j, x: top[0], y: top[1] + arch.thickness, w: towers[j] * TOWER });
      }
    });
    if (road) {
      // A post at every bead between the feet carries its share of the road, as its hanger did.
      for (let i = 1; i < road.length - 1; i++) {
        const w = (ROAD * Math.abs(road[i + 1][0] - road[i - 1][0])) / 2;
        const block = Math.min(arch.blocks.length - 1, Math.floor((i - 0.5) / 2));
        loads.push({ block, x: road[i][0], y: road[i][1], w, post: true });
      }
    }
    loads.sort((p, q) => p.block - q.block || p.x - q.x);
    return loads;
  }

  // ---------- arch shapes for the comparison ----------

  /** Arch shapes as a distance from the middle of the base in each direction φ (0 = right foot, π = left foot). */
  const shapes = {
    semicircle: () => 0.5,
    pointed: (phi) => {
      const c = Math.abs(Math.cos(phi));
      return (-c + Math.sqrt(c * c + 3)) / 2; // two arcs as wide as the span, each centred on the far foot
    },
    flat: (phi) => {
      const rise = 0.25,
        c = (0.25 - rise * rise) / (2 * rise),
        r = rise + c;
      const s = Math.sin(phi);
      return -c * s + Math.sqrt(c * c * s * s + r * r - c * c); // a segment of a circle through both feet
    },
  };

  const DOTS = 9; // a drawn arch's dots, at φ = 0, π/8, … π
  const dotAngle = (k) => ((DOTS - 1 - k) * Math.PI) / (DOTS - 1); // dot 0 is at the left foot

  /** A smooth curve through the dots' distances, in φ (Catmull–Rom, with the ends' slopes from their neighbours). */
  function drawnShape(radii) {
    const n = radii.length;
    return (phi) => {
      const u = ((Math.PI - phi) / Math.PI) * (n - 1);
      const i = Math.max(0, Math.min(n - 2, Math.floor(u))),
        f = u - i;
      const r = (k) => radii[Math.max(0, Math.min(n - 1, k))];
      const p0 = i === 0 ? 2 * r(0) - r(1) : r(i - 1),
        p3 = i + 2 >= n ? 2 * r(n - 1) - r(n - 2) : r(i + 2);
      const p1 = r(i),
        p2 = r(i + 1);
      return (
        0.5 *
        (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f)
      );
    };
  }

  /** A shape's centreline from the left foot to the right, evenly spaced along its length. */
  function centreline(shape, count) {
    const dense = [];
    for (let k = 0; k <= 720; k++) {
      const phi = Math.PI - (k * Math.PI) / 720,
        r = Math.max(0.02, shape(phi));
      dense.push([r * Math.cos(phi), r * Math.sin(phi)]);
    }
    const along = [0];
    for (let k = 1; k < dense.length; k++) along.push(along[k - 1] + len(sub(dense[k], dense[k - 1])));
    const total = along[along.length - 1];
    const line = [];
    let k = 0;
    for (let i = 0; i <= count; i++) {
      const s = (i * total) / count;
      while (k < dense.length - 2 && along[k + 1] < s) k++;
      const f = (s - along[k]) / (along[k + 1] - along[k] || 1);
      line.push([dense[k][0] + f * (dense[k + 1][0] - dense[k][0]), dense[k][1] + f * (dense[k + 1][1] - dense[k][1])]);
    }
    return { line, total };
  }

  /** An arch of a shape: an odd number of stones (one at the crown) about `stone` long, each two links of line. */
  function shapeArch(shape, thickness, stone = 0.075) {
    const { total } = centreline(shape, 8);
    let count = Math.max(7, Math.min(41, Math.round(total / stone)));
    if (count % 2 === 0) count += 1;
    const { line } = centreline(shape, 2 * count);
    const point = (phi) => [shape(phi) * Math.cos(phi), shape(phi) * Math.sin(phi)];
    const e = 1e-5;
    const ends = [sub(point(Math.PI - e), point(Math.PI)), sub(point(0), point(e))];
    const arch = stones(
      line,
      Array.from({ length: count + 1 }, (_, j) => 2 * j),
      thickness,
      ends,
    );
    arch.line = line;
    arch.loads = loadsOf(arch);
    return arch;
  }

  // ---------- the line of thrust ----------

  /**
   * Prefix sums of the loads before each joint: the weight S_j and its moment T_j = Σ x·w, with the weights scaled
   * to add up to 1 (the shape of a thrust line doesn't depend on the scale).
   */
  function sums(arch) {
    const total = arch.loads.reduce((s, l) => s + l.w, 0) || 1;
    const S = [0],
      T = [0];
    let k = 0;
    for (let j = 0; j < arch.blocks.length; j++) {
      let s = S[j],
        t = T[j];
      while (k < arch.loads.length && arch.loads[k].block === j) {
        s += arch.loads[k].w / total;
        t += (arch.loads[k].x * arch.loads[k].w) / total;
        k++;
      }
      S.push(s);
      T.push(t);
    }
    return { S, T, total };
  }

  function golden(f, lo, hi, iterations) {
    const g = (Math.sqrt(5) - 1) / 2;
    let x1 = hi - g * (hi - lo),
      x2 = lo + g * (hi - lo),
      f1 = f(x1),
      f2 = f(x2);
    for (let i = 0; i < iterations; i++) {
      if (f1 < f2) {
        lo = x1;
        x1 = x2;
        f1 = f2;
        x2 = lo + g * (hi - lo);
        f2 = f(x2);
      } else {
        hi = x2;
        x2 = x1;
        f2 = f1;
        x1 = hi - g * (hi - lo);
        f1 = f(x1);
      }
    }
    return f1 > f2 ? { x: x1, value: f1 } : { x: x2, value: f2 };
  }

  /**
   * The line of thrust that stays furthest inside the stones. Across joint j the force is (H, V − S_j·W): every
   * line of thrust is set by three numbers, u = 1/H, a = V/H and b (where it crosses the first joint), and at joint j
   * it is the straight line y = (a − u·S_j)·x − (b − u·T_j). It fits if, at every joint, it passes between the inner
   * and outer corners. The room maximises the smallest gap, as a share of the stones' thickness (measured across the
   * joint), which is a concave problem: nested golden-section searches find its top. A gap below 0 means no line of
   * thrust fits, so the arch can't stand.
   */
  function thrust(arch, rough = false) {
    const { S, T } = sums(arch);
    const J = arch.joints,
      n = J.length,
      d = arch.thickness;
    const A = new Float64Array(n),
      B = new Float64Array(n),
      k = new Float64Array(n);
    // For given u and a, the best b: each inner corner needs b ≤ A_j, each outer corner b ≥ B_j, and the gaps
    // k_j·(A_j − b) and k_j·(b − B_j) fall and rise with b, so the best b is where the smallest of each kind tie.
    function bestB(u, a) {
      let lo = Infinity,
        hi = -Infinity;
      for (let j = 0; j < n; j++) {
        const slope = a - u * S[j],
          shift = u * T[j];
        A[j] = slope * J[j].inner[0] + shift - J[j].inner[1];
        B[j] = slope * J[j].outer[0] + shift - J[j].outer[1];
        lo = Math.min(lo, A[j], B[j]);
        hi = Math.max(hi, A[j], B[j]);
      }
      lo -= 1;
      hi += 1;
      let down = 0,
        up = 0;
      for (let i = 0; i < (rough ? 34 : 52); i++) {
        const mid = (lo + hi) / 2;
        down = Infinity;
        up = Infinity;
        for (let j = 0; j < n; j++) {
          down = Math.min(down, k[j] * (A[j] - mid));
          up = Math.min(up, k[j] * (mid - B[j]));
        }
        if (up < down) lo = mid;
        else hi = mid;
      }
      return { b: (lo + hi) / 2, value: Math.min(down, up) };
    }
    const iterations = rough ? 28 : 42;
    const solve = () => {
      const overA = (u) => golden((a) => bestB(u, a).value, -u - 20, 2 * u + 20, iterations);
      const ru = golden((u) => overA(u).value, 0, 400, iterations);
      const a = overA(ru.x).x;
      return { u: ru.x, a, ...bestB(ru.x, a) };
    };
    // A gap is first measured square to the arch (|t_x|: a line along the arch, measured upright, then turned); then
    // once more square to the line found, so the gap is the share of each joint between the line and a corner.
    for (let j = 0; j < n; j++) k[j] = Math.max(Math.abs(J[j].tangent[0]), 0.05) / d;
    let best = solve(),
      fits = best.value >= -1e-9;
    if (!rough) {
      for (let j = 0; j < n; j++) {
        const slope = best.a - best.u * S[j];
        const across = J[j].normal[1] - slope * J[j].normal[0];
        k[j] = 1 / (d * Math.max(across, 0.05));
      }
      // Whether some line fits doesn't depend on how the gaps are measured; only which line is best does.
      best = solve();
      fits = fits || best.value >= -1e-9;
    }
    const path = thrustPath(arch, best, S, T);
    // How far inside the line stays, as the smallest share of a joint between it and a corner (below 0: outside).
    const inside = Math.min(...path.crossings.map((c) => Math.min(c.share, 1 - c.share)));
    return { u: best.u, a: best.a, b: best.b, margin: best.value, inside, fits, path };
  }

  /**
   * Where a line of thrust crosses each joint (as a share of the way from its inner corner to its outer one; outside
   * 0…1 it misses the stones there), and its corners in between, under each load.
   */
  function thrustPath(arch, { u, a, b }, S = sums(arch).S, T = sums(arch).T) {
    const J = arch.joints;
    const { total } = sums(arch);
    const crossings = J.map((j, i) => {
      const slope = a - u * S[i],
        shift = b - u * T[i];
      const gi = slope * j.inner[0] - shift - j.inner[1],
        ge = slope * j.outer[0] - shift - j.outer[1];
      const share = Math.abs(gi - ge) < 1e-15 ? 0.5 : gi / (gi - ge);
      return { share, point: add(j.inner, sub(j.outer, j.inner), share) };
    });
    const points = [];
    let k = 0;
    for (let i = 0; i < J.length; i++) {
      points.push({ point: crossings[i].point, joint: i, share: crossings[i].share });
      if (i === J.length - 1) break;
      let slope = a - u * S[i],
        shift = b - u * T[i];
      while (k < arch.loads.length && arch.loads[k].block === i) {
        const { x, w } = arch.loads[k];
        points.push({ point: [x, slope * x - shift], joint: -1 });
        slope -= (u * w) / total;
        shift -= (u * x * w) / total;
        k++;
      }
    }
    return { crossings, points };
  }

  // ---------- the collapse ----------

  /**
   * How an arch that can't stand falls: four joints open as hinges, at the inner or outer corner, and the three
   * pieces between them move as a linkage. For every choice of four joints and corners, the room checks that each
   * hinge opens (no stone pushes into its neighbour) and how fast the weights go down; it keeps the fastest fall for
   * the motion's size (a falling weight per unit of the speed of the stones). A thrust line fits inside exactly when
   * no hinge pattern lets the weights go down, so this is also a check on thrust().
   */
  function mechanism(arch) {
    const J = arch.joints,
      n = J.length,
      blocks = arch.blocks.length;
    // Hinge corners: [0] inner, [1] outer.
    const hx = [Float64Array.from(J, (j) => j.inner[0]), Float64Array.from(J, (j) => j.outer[0])],
      hy = [Float64Array.from(J, (j) => j.inner[1]), Float64Array.from(J, (j) => j.outer[1])];
    // Running totals of the loads before each joint: weight, and its first and second moments.
    const W = new Float64Array(blocks + 1),
      X = new Float64Array(blocks + 1),
      Y = new Float64Array(blocks + 1),
      Q = new Float64Array(blocks + 1);
    let k0 = 0;
    for (let b = 0; b < blocks; b++) {
      W[b + 1] = W[b];
      X[b + 1] = X[b];
      Y[b + 1] = Y[b];
      Q[b + 1] = Q[b];
      for (; k0 < arch.loads.length && arch.loads[k0].block === b; k0++) {
        const { x, y, w } = arch.loads[k0];
        W[b + 1] += w;
        X[b + 1] += w * x;
        Y[b + 1] += w * y;
        Q[b + 1] += w * (x * x + y * y);
      }
    }
    // Sum of m·|v|² for a piece turning at ω about (px, py).
    const spin = (a, b, px, py, omega) =>
      omega *
      omega *
      (Q[b] - Q[a] - 2 * (px * (X[b] - X[a]) + py * (Y[b] - Y[a])) + (px * px + py * py) * (W[b] - W[a]));
    // A hinge at an outer corner opens when its turn has the motion's sense, at an inner corner the other sense.
    const opens = (turn, side, dir) => turn !== 0 && turn > 0 === (side === 1 ? dir > 0 : dir < 0);
    let best = null;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        for (let k = j + 1; k < n; k++)
          for (let l = k + 1; l < n; l++)
            for (let sides = 0; sides < 16; sides++) {
              const s0 = sides & 1,
                s1 = (sides >> 1) & 1,
                s2 = (sides >> 2) & 1,
                s3 = (sides >> 3) & 1;
              const Ax = hx[s0][i],
                Ay = hy[s0][i],
                Bx = hx[s1][j],
                By = hy[s1][j],
                Cx = hx[s2][k],
                Cy = hy[s2][k],
                Dx = hx[s3][l],
                Dy = hy[s3][l];
              // Piece 1 turns about A at 1; piece 3 about D at ω3; piece 2 keeps B and C joined:
              // ω3·perp(C − D) − ω2·perp(C − B) = perp(B − A).
              const px = -(Cy - Dy),
                py = Cx - Dx,
                qx = Cy - By,
                qy = -(Cx - Bx),
                rx = -(By - Ay),
                ry = Bx - Ax;
              const det = px * qy - py * qx;
              if (Math.abs(det) < 1e-12) continue;
              const w3 = (rx * qy - ry * qx) / det,
                w2 = (px * ry - py * rx) / det;
              // Each hinge must open: at an outer corner the piece beyond turns anticlockwise relative to the one
              // before, at an inner corner clockwise. Both senses of the motion are tried.
              const t1 = w2 - 1,
                t2 = w3 - w2,
                t3 = -w3;
              const dir = s0 ? 1 : -1; // the first hinge's turn is +1, so it sets the motion's sense
              if (!opens(t1, s1, dir) || !opens(t2, s2, dir) || !opens(t3, s3, dir)) continue;
              // The weights' rate of fall: v_y at x is ω·(x − pivot x), plus piece 2's share of B's speed.
              const fall =
                dir *
                (X[j] -
                  X[i] -
                  Ax * (W[j] - W[i]) +
                  ry * (W[k] - W[j]) +
                  w2 * (X[k] - X[j] - Bx * (W[k] - W[j])) +
                  w3 * (X[l] - X[k] - Dx * (W[l] - W[k])));
              if (fall >= 0) continue;
              const m2 = W[k] - W[j],
                ax = X[k] - X[j] - Bx * m2,
                ay = Y[k] - Y[j] - By * m2;
              const speed =
                spin(i, j, Ax, Ay, 1) +
                spin(k, l, Dx, Dy, w3) +
                (rx * rx + ry * ry) * m2 +
                2 * w2 * (rx * -ay + ry * ax) +
                spin(j, k, Bx, By, w2);
              const rate = fall / Math.sqrt(Math.max(speed, 1e-18));
              if (!best || rate < best.rate)
                best = {
                  joints: [i, j, k, l],
                  sides: [s0, s1, s2, s3],
                  dir,
                  rate,
                  turns: [dir, t1 * dir, t2 * dir, t3 * dir],
                };
            }
    return best;
  }

  /**
   * The fall, step by step: piece 1 turns about its hinge, piece 3 about its own, and piece 2 keeps them joined (a
   * four-bar linkage). It stops when a stone reaches the ground, or the linkage can't move further.
   */
  function fall(arch, mech, ground, stepSize = 0.01, most = 2.2) {
    const [i, j, k, l] = mech.joints;
    const pt = (q, side) => (side ? arch.joints[q].outer : arch.joints[q].inner);
    const A = pt(i, mech.sides[0]),
      B0 = pt(j, mech.sides[1]),
      C0 = pt(k, mech.sides[2]),
      D = pt(l, mech.sides[3]);
    const bc = len(sub(C0, B0)),
      cd = len(sub(C0, D));
    const angle = (v) => Math.atan2(v[1], v[0]);
    const pieces = [
      { from: i, to: j },
      { from: j, to: k },
      { from: k, to: l },
    ];
    const poses = [{ angle: 0, moves: [identity(), identity(), identity()] }];
    let C = C0;
    for (let alpha = stepSize; alpha <= most + 1e-9; alpha += stepSize) {
      const phi = mech.dir * alpha;
      const B = add(A, rotate(sub(B0, A), phi));
      // Where piece 2's far hinge can be: the circles about B and D meet, nearest to where it was.
      const dBD = len(sub(D, B));
      if (dBD > bc + cd || dBD < Math.abs(bc - cd) || dBD < 1e-12) break;
      const along = (bc * bc - cd * cd + dBD * dBD) / (2 * dBD),
        h = Math.sqrt(Math.max(0, bc * bc - along * along));
      const e = [(D[0] - B[0]) / dBD, (D[1] - B[1]) / dBD];
      const mid = add(B, e, along);
      const options = [add(mid, perp(e), h), add(mid, perp(e), -h)];
      const next = len(sub(options[0], C)) <= len(sub(options[1], C)) ? options[0] : options[1];
      if (len(sub(next, C)) > 0.2 * bc) break; // the linkage jumped: it has reached its limit
      C = next;
      const moves = [
        about(A, phi),
        { pivot: B0, to: B, angle: angle(sub(C, B)) - angle(sub(C0, B0)) },
        about(D, angle(sub(C, D)) - angle(sub(C0, D))),
      ];
      const lowest = Math.min(
        ...pieces.flatMap((piece, p) =>
          arch.blocks.slice(piece.from, piece.to).flatMap((b) => b.corners.map((c) => move(moves[p], c)[1])),
        ),
      );
      poses.push({ angle: alpha, moves });
      if (lowest < ground - 1e-6) break;
    }
    return { pieces, poses };
  }

  const identity = () => ({ pivot: [0, 0], to: [0, 0], angle: 0 });
  const about = (p, angle) => ({ pivot: p, to: p, angle });
  /** Where a point of a piece goes: turned about the piece's pivot, which itself moves to `to`. */
  const move = (m, p) => add(m.to, rotate(sub(p, m.pivot), m.angle));

  /** Which piece of a fall a stone belongs to, or −1 if it stays put. */
  const pieceOf = (falling, block) => falling.pieces.findIndex((p) => block >= p.from && block < p.to);

  /** A tidy summary of an arch's verdict, for readouts and tests. */
  function verdict(arch) {
    const line = thrust(arch);
    return { fits: line.fits, margin: line.margin, line, mechanism: line.fits ? null : mechanism(arch) };
  }

  Wonderlattice.models.arch = Object.freeze({
    STONES,
    LINKS,
    TOWER,
    ROAD,
    GRAVITY,
    DOTS,
    dotAngle,
    beadWeights,
    hang,
    chain,
    relax,
    catenary,
    stones,
    polygon,
    flipLevel,
    flipped,
    chainArch,
    loadsOf,
    shapes,
    drawnShape,
    centreline,
    shapeArch,
    thrust,
    thrustPath,
    mechanism,
    fall,
    move,
    pieceOf,
    verdict,
  });
})();
