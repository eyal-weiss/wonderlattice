/*
 * A tile that fills the world · the mathematics of Escher-style tiles.
 *
 * A tile starts as a square or a regular hexagon. Some of its edges are free: the visitor bends them. Every other edge
 * is a copy of a free edge, moved by a symmetry of the tiling (a slide, or a turn about a corner), so a bump on one
 * edge is always matched by a dent on its partner, and copies of the tile fit together with no gaps or overlaps.
 * The same symmetries, applied again and again, lay the tiles down across the plane.
 *
 * Four rules are offered, four of the 17 wallpaper groups: p1 on squares and on hexagons (slides), p4 on squares
 * (quarter turns about two corners) and p3 on hexagons (third turns about alternate corners).
 * https://en.wikipedia.org/wiki/Wallpaper_group
 *
 * Pure functions, no DOM. Maps are affine: [a, b, c, d, e, f] sends (x, y) to (a x + c y + e, b x + d y + f).
 */
(() => {
  'use strict';

  const CONTROLS = 3; // control points on each free edge, at a quarter, a half and three quarters of the way
  const SPOTS = [0.25, 0.5, 0.75];
  const LIMITS = { along: 0.2, across: 0.45 }; // how far a control point may move, in edge lengths

  // ---------- affine maps ----------

  const IDENTITY = [1, 0, 0, 1, 0, 0];
  const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  /** m ∘ n: first n, then m. */
  const compose = (m, n) => [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
  function invert(m) {
    const det = m[0] * m[3] - m[1] * m[2];
    const a = m[3] / det,
      b = -m[1] / det,
      c = -m[2] / det,
      d = m[0] / det;
    return [a, b, c, d, -(a * m[4] + c * m[5]), -(b * m[4] + d * m[5])];
  }
  const translation = ([x, y]) => [1, 0, 0, 1, x, y];
  function rotation([cx, cy], degrees) {
    const r = (degrees * Math.PI) / 180,
      cos = Math.cos(r),
      sin = Math.sin(r);
    return [cos, sin, -sin, cos, cx - cos * cx + sin * cy, cy - sin * cx - cos * cy];
  }
  const round = (v) => Math.round(v * 1000) / 1000;
  const near = (p, q, eps = 1e-9) => Math.abs(p[0] - q[0]) < eps && Math.abs(p[1] - q[1]) < eps;

  // ---------- the rules ----------

  const SQUARE = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const HEXAGON = Array.from({ length: 6 }, (_, i) => {
    const r = (i * Math.PI) / 3;
    return [Math.cos(r) * 0.62, Math.sin(r) * 0.62]; // about the same area as the unit square
  });

  /*
   * Each rule lists its corners and, for each edge (corner i to corner i + 1), either the free edge it is or the free
   * edge it copies and how: by a slide, or by a turn about a given corner. The exact map is solved below from the
   * corners, so the rules stay readable.
   */
  const SPECS = [
    {
      id: 'square-slide',
      corners: SQUARE,
      edges: [{ free: 0 }, { copy: 1, by: 'slide' }, { copy: 0, by: 'slide' }, { free: 1 }],
      colours: 2,
    },
    {
      id: 'square-turn',
      corners: SQUARE,
      // Quarter turns about corner 0 and corner 2.
      edges: [{ free: 0 }, { copy: 1, by: 'turn', about: 2 }, { free: 1 }, { copy: 0, by: 'turn', about: 0 }],
      colours: 4,
    },
    {
      id: 'hexagon-slide',
      corners: HEXAGON,
      edges: [
        { free: 0 },
        { free: 1 },
        { free: 2 },
        { copy: 0, by: 'slide' },
        { copy: 1, by: 'slide' },
        { copy: 2, by: 'slide' },
      ],
      colours: 3,
    },
    {
      id: 'hexagon-turn',
      corners: HEXAGON,
      // Third turns about corners 0, 2 and 4.
      edges: [
        { free: 0 },
        { copy: 1, by: 'turn', about: 2 },
        { free: 1 },
        { copy: 2, by: 'turn', about: 4 },
        { free: 2 },
        { copy: 0, by: 'turn', about: 0 },
      ],
      colours: 3,
    },
  ];

  /** Solve each copy edge's map: the slide or turn that carries its free edge onto it, and whether it runs backwards. */
  function build(spec) {
    const n = spec.corners.length;
    const ends = (i) => [spec.corners[i], spec.corners[(i + 1) % n]];
    const free = [];
    spec.edges.forEach((e, i) => {
      if ('free' in e) free[e.free] = { from: ends(i)[0], to: ends(i)[1], edge: i };
    });
    const edges = spec.edges.map((e, i) => {
      if ('free' in e) return { free: e.free, map: IDENTITY, reversed: false };
      const [start, end] = ends(i),
        f = free[e.copy];
      const candidates =
        e.by === 'slide'
          ? [
              translation([start[0] - f.from[0], start[1] - f.from[1]]),
              translation([end[0] - f.from[0], end[1] - f.from[1]]),
            ]
          : [90, -90, 120, -120, 180].map((deg) => rotation(spec.corners[e.about], deg));
      for (const map of candidates) {
        const a = apply(map, f.from),
          b = apply(map, f.to);
        if (near(a, start) && near(b, end)) return { free: e.copy, map, reversed: false };
        if (near(a, end) && near(b, start)) return { free: e.copy, map, reversed: true };
      }
      throw new Error(`${spec.id}: no ${e.by} carries free edge ${e.copy} onto edge ${i}`);
    });
    // The neighbour across a copy edge is the tile moved by that edge's map; across the free edge, by its inverse.
    const generators = edges.filter((e) => e.map !== IDENTITY).map((e) => e.map);
    return { ...spec, free, edges, generators, freeCount: free.length };
  }

  const RULES = SPECS.map(build);

  // ---------- curves ----------

  // ---------- settings: each free edge's three control points packed into one whole number ----------

  /*
   * Shared links and the trail keep only a few plain numbers per room, so each free edge is one integer: its three
   * control points, each offset in steps of 0.01 edge lengths (41 steps along, 91 across, so 3731 per point).
   */
  const EDGE_KEYS = ['edgeA', 'edgeB', 'edgeC'];
  const STEP = 0.01;
  const ALONG = Math.round(LIMITS.along / STEP),
    ACROSS = Math.round(LIMITS.across / STEP);
  const PER_POINT = (2 * ALONG + 1) * (2 * ACROSS + 1);
  const EDGE_MAX = PER_POINT ** CONTROLS - 1;

  /** One whole number for a free edge's three [along, across] offsets (clamped to the limits, rounded to the step). */
  function encodeEdge(points) {
    const clamp = (v, n) => Math.max(-n, Math.min(n, Math.round(v / STEP)));
    return points.reduce((code, [along, across]) => {
      const point = (clamp(along, ALONG) + ALONG) * (2 * ACROSS + 1) + (clamp(across, ACROSS) + ACROSS);
      return code * PER_POINT + point;
    }, 0);
  }

  /** The three [along, across] offsets back from their number. */
  function decodeEdge(code) {
    let n = Math.max(0, Math.min(EDGE_MAX, Math.round(Number.isFinite(code) ? code : FLAT)));
    const points = [];
    for (let j = 0; j < CONTROLS; j++) {
      const point = n % PER_POINT;
      n = Math.floor(n / PER_POINT);
      const across = (point % (2 * ACROSS + 1)) - ACROSS,
        along = Math.floor(point / (2 * ACROSS + 1)) - ALONG;
      points.unshift([round(along * STEP), round(across * STEP)]);
    }
    return points;
  }

  /** The number for a straight edge. */
  const FLAT = (() => {
    const point = ALONG * (2 * ACROSS + 1) + ACROSS;
    return (point * PER_POINT + point) * PER_POINT + point;
  })();

  /** The offsets of free edge k's control points: [[along, across], …]. */
  function offsets(s, k) {
    return decodeEdge(s[EDGE_KEYS[k]] ?? FLAT);
  }

  /** Where a control point sits: `along` shifts it along the edge, `across` pushes it to the left of travel. */
  function controlPoint(f, j, [along, across]) {
    const dx = f.to[0] - f.from[0],
      dy = f.to[1] - f.from[1],
      t = SPOTS[j] + along;
    return [f.from[0] + t * dx - across * dy, f.from[1] + t * dy + across * dx];
  }

  /** The inverse: the offsets that put control point j of free edge f at point p (clamped to the limits). */
  function offsetsFor(f, j, [px, py]) {
    const dx = f.to[0] - f.from[0],
      dy = f.to[1] - f.from[1],
      len2 = dx * dx + dy * dy,
      rx = px - f.from[0],
      ry = py - f.from[1];
    const along = (rx * dx + ry * dy) / len2 - SPOTS[j],
      across = (-rx * dy + ry * dx) / len2;
    const clamp = (v, limit) => Math.max(-limit, Math.min(limit, v));
    return [clamp(along, LIMITS.along), clamp(across, LIMITS.across)];
  }

  /** A smooth curve (Catmull–Rom) through the edge's ends and its control points, as a list of points. */
  function curve(f, offs, perSpan = 10) {
    const pts = [f.from, ...offs.map((o, j) => controlPoint(f, j, o)), f.to];
    const out = [f.from];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let step = 1; step <= perSpan; step++) {
        const t = step / perSpan,
          t2 = t * t,
          t3 = t2 * t;
        const at = (k) =>
          0.5 *
          (2 * p1[k] +
            (-p0[k] + p2[k]) * t +
            (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
            (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
        out.push([at(0), at(1)]);
      }
    }
    out[out.length - 1] = f.to; // exactly the corner, so copies meet it exactly
    return out;
  }

  /** Each edge of the tile as a list of points running corner i → corner i + 1. */
  function edgeCurves(rule, s, perSpan) {
    const free = rule.free.map((f, k) => curve(f, offsets(s, k), perSpan));
    return rule.edges.map((e) => {
      const pts = free[e.free].map((p) => apply(e.map, p));
      return e.reversed ? pts.reverse() : pts;
    });
  }

  /** The tile's whole outline, a closed list of points (the first point is not repeated at the end). */
  function outline(rule, s, perSpan) {
    return edgeCurves(rule, s, perSpan).flatMap((pts) => pts.slice(0, -1));
  }

  /** Signed area of a closed outline (shoelace formula); positive when it runs anticlockwise. */
  function area(pts) {
    let sum = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i],
        [x2, y2] = pts[(i + 1) % pts.length];
      sum += x1 * y2 - x2 * y1;
    }
    return sum / 2;
  }

  function centroid(corners) {
    const n = corners.length;
    return [corners.reduce((a, p) => a + p[0], 0) / n, corners.reduce((a, p) => a + p[1], 0) / n];
  }

  // ---------- the tiling ----------

  /**
   * Copies of the tile covering a box around the first tile's centre (in tile units): each with its map, and a colour
   * that differs from every neighbour's. The colour is the orientation for turning rules, and the position in the
   * lattice for sliding rules; both change by a fixed step across every edge.
   */
  function tiling(rule, radius, limit = 600) {
    const centre = centroid(rule.corners);
    const key = (m) => {
      const [x, y] = apply(m, centre);
      return `${Math.round(x * 1000)},${Math.round(y * 1000)}`;
    };
    const moves = rule.generators.flatMap((g) => [g, invert(g)]);
    const tiles = [{ map: IDENTITY, colour: 0 }];
    const seen = new Set([key(IDENTITY)]);
    for (let i = 0; i < tiles.length && tiles.length < limit; i++) {
      const { map } = tiles[i];
      for (const move of moves) {
        // A neighbour: move the tile across one of its own edges (the move acts in the tile's own frame).
        const next = compose(map, move);
        const [x, y] = apply(next, centre);
        if (Math.abs(x - centre[0]) > radius || Math.abs(y - centre[1]) > radius) continue;
        const k = key(next);
        if (seen.has(k)) continue;
        seen.add(k);
        tiles.push({ map: next, colour: colourOf(rule, next) });
      }
    }
    return tiles;
  }

  /** A colour index, from 0 to rule.colours − 1, that neighbouring tiles never share. */
  function colourOf(rule, map) {
    const mod = (v, m) => ((v % m) + m) % m;
    if (rule.id === 'square-turn' || rule.id === 'hexagon-turn') {
      // The tile's orientation: every neighbour is turned by one step (a quarter or a third of a turn).
      const step = rule.id === 'square-turn' ? 90 : 120;
      return mod(Math.round(Math.atan2(map[1], map[0]) / ((step * Math.PI) / 180)), rule.colours);
    }
    // Slides: the position in the lattice. Squares alternate like a chessboard; hexagons need three colours.
    const [x, y] = [map[4], map[5]];
    if (rule.id === 'square-slide') return mod(Math.round(x) + Math.round(y), 2);
    // The lattice of hexagon slides is spanned by the slides that carry edge 0 onto edge 3 and edge 1 onto edge 4.
    const a = [rule.corners[4][0] - rule.corners[0][0], rule.corners[4][1] - rule.corners[0][1]];
    const b = [rule.corners[5][0] - rule.corners[1][0], rule.corners[5][1] - rule.corners[1][1]];
    const det = a[0] * b[1] - a[1] * b[0];
    const i = Math.round((x * b[1] - y * b[0]) / det),
      j = Math.round((a[0] * y - a[1] * x) / det);
    return mod(i + 2 * j, 3);
  }

  // ---------- handles ----------

  /** Every draggable point on the first tile: each control point, on its free edge and on the edge that copies it. */
  function handles(rule, s) {
    const out = [];
    rule.free.forEach((f, k) => {
      offsets(s, k).forEach((o, j) => {
        const p = controlPoint(f, j, o);
        out.push({ free: k, spot: j, point: p, copy: false });
        rule.edges.forEach((e) => {
          if (e.free === k && e.map !== IDENTITY)
            out.push({ free: k, spot: j, point: apply(e.map, p), copy: true, map: e.map });
        });
      });
    });
    return out;
  }

  /** New settings values after dragging handle h of settings s to point p (in tile units). */
  function moveHandle(rule, s, h, p) {
    const onFree = h.copy ? apply(invert(h.map), p) : p;
    const points = offsets(s, h.free);
    points[h.spot] = offsetsFor(rule.free[h.free], h.spot, onFree);
    return { [EDGE_KEYS[h.free]]: encodeEdge(points) };
  }

  Wonderlattice.models.tiles = Object.freeze({
    RULES,
    CONTROLS,
    LIMITS,
    EDGE_KEYS,
    EDGE_MAX,
    FLAT,
    STEP,
    encodeEdge,
    decodeEdge,
    IDENTITY,
    apply,
    compose,
    invert,
    offsets,
    controlPoint,
    offsetsFor,
    curve,
    edgeCurves,
    outline,
    area,
    centroid,
    tiling,
    colourOf,
    handles,
    moveHandle,
  });
})();
