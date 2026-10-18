/* Room · The straight road that looks bent: the shortest way between two places, on a globe and three flat maps. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.maps;
  const t = W.text('maps');
  const reduced = W.prefersReducedMotion();
  const DEG = M.DEG;

  const MINT = '#6fe3c4',
    GOLD = '#ffc75a',
    PINK = '#ff9ec0',
    LILAC = '#c9b8ff',
    INK = '#f5f1e6';
  const SPACE = '#070b12',
    OCEAN = '#0d1c2e',
    LAND = '#2d4638',
    SHORE = 'rgba(178, 218, 188, 0.6)',
    GRID = 'rgba(150, 190, 235, 0.16)',
    EQUATOR = 'rgba(175, 215, 250, 0.34)';
  const FLIGHT = 6, // seconds the plane on the longer route takes
    REST = 2.8, // seconds both planes wait at the end before flying again
    MORPH = 1.4, // seconds to turn one map into another
    TRIP = 2.6; // seconds Greenland takes to slide to Africa
  const STICKER = 6 * DEG; // a sticker's radius on the Earth: 667 km
  const MOST = 24; // stickers dropped by hand, at most
  const TOP = 82, // Mercator's map shows 82°S to 82°N…
    EDGE = 85; // …and stops at 85°: nearer the poles it runs off to infinity
  const PIN_LAT = 80; // pins stay on Mercator's map
  const GNOMONIC_CAP = Math.cos(80 * DEG); // the gnomonic map shows places less than 80° from its middle
  const MERCATOR = 0,
    GLOBE = 1,
    GNOMONIC = 2,
    EQUAL = 3;
  const isFlat = (i) => i === MERCATOR || i === EQUAL;
  const ease = (f) => f * f * (3 - 2 * f);

  // ---------- the world, ready to draw ----------

  /** Longitudes carried on from one point to the next, so a line never jumps across a flat map. */
  function carried(points) {
    const out = [points[0].slice()];
    for (let i = 1; i < points.length; i++)
      out.push([points[i][0], out[i - 1][1] + M.wrap(points[i][1] - points[i - 1][1])]);
    return out;
  }
  const span = (points) => {
    const lons = points.map((p) => p[1]);
    return [Math.min(...lons), Math.max(...lons)];
  };

  /** A shape on the Earth ([lat, lon] points, anticlockwise), with what each kind of map needs to draw it. */
  function shapeOf(points) {
    const flat = carried(points);
    const [lo, hi] = span(flat);
    return { ring: points, vecs: points.map((p) => M.vec(...p)), flat, lo, hi };
  }

  const LAND_RINGS = M.land.map((r) => {
    const n = r.points.length;
    const flat = M.flatRing(r.points);
    const [lo, hi] = span(flat);
    const last = flat[n - 1];
    return {
      lake: r.lake,
      vecs: r.points.map((p) => M.vec(...p)),
      flat,
      lo,
      hi,
      // The shore, as a line back to its start, and the steps along ±180°, where Natural Earth cut a shore in two.
      shore: [...flat.slice(0, n), [r.points[0][0], last[1] + M.wrap(r.points[0][1] - last[1])]],
      seam: r.points.map((p, i) => Math.abs(p[1]) === 180 && Math.abs(r.points[(i + 1) % n][1]) === 180),
    };
  });

  /** Lines of latitude and longitude every 30°, as points every 3°. */
  const line = (n, at) => Array.from({ length: n + 1 }, (_, i) => at(i / n));
  const PARALLELS = [-60, -30, 0, 30, 60].map((lat) => ({
    lat,
    points: line(120, (f) => [lat, -180 + 360 * f]),
  }));
  const MERIDIANS = Array.from({ length: 12 }, (_, i) => line(60, (f) => [-89 + 178 * f, -180 + 30 * i]));
  const GRID_LINES = [
    ...PARALLELS.map((p) => ({ equator: p.lat === 0, points: p.points, vecs: p.points.map((q) => M.vec(...q)) })),
    ...MERIDIANS.map((points) => ({ equator: false, points, vecs: points.map((q) => M.vec(...q)) })),
  ];

  const GREENLAND = M.land[M.GREENLAND].points;
  /** Greenland's middle: where the shape is held when it moves. */
  const HOME = M.latLon(
    GREENLAND.map((p) => M.vec(...p)).reduce((sum, v) => [sum[0] + v[0], sum[1] + v[1], sum[2] + v[2]], [0, 0, 0]),
  ).map((x) => Math.round(x * 10) / 10);

  /** A round sticker at a place. */
  const sticker = (centre) => ({ centre, ...shapeOf(M.circle(centre, STICKER, 36)) });
  const GRID_PLACES = [];
  for (const [row, lat] of [-60, -30, 0, 30, 60].entries())
    for (let lon = row % 2 ? -180 : -165; lon < 180; lon += 30) GRID_PLACES.push([lat, lon]);

  // ---------- the route ----------

  let routeCache = null;
  /** Both routes between the pins: lengths, points along each, and the arc's farthest point from the equator. */
  function route(s) {
    const key = `${s.aLat},${s.aLon},${s.bLat},${s.bLon}`;
    if (routeCache?.key === key) return routeCache;
    const a = [s.aLat, s.aLon],
      b = [s.bLat, s.bLon];
    const arc = M.greatCircle(a, b) * M.RADIUS,
      rhumb = M.rhumb(a, b).length * M.RADIUS;
    const far = M.farthest(a, b);
    const N = 180;
    const arcPoints = carried(line(N, (f) => M.greatCircleAt(a, b, f)));
    const rhumbPoints = line(N, (f) => M.rhumbAt(a, b, f));
    routeCache = {
      key,
      a,
      b,
      arc,
      rhumb,
      saved: rhumb - arc,
      same: rhumb - arc < 0.5,
      // Named only when it is well beyond both ends.
      peak: far && Math.abs(far[0]) > Math.max(Math.abs(a[0]), Math.abs(b[0])) + 2 ? far : null,
      arcPoints,
      rhumbPoints,
      arcVecs: arcPoints.map((p) => M.vec(...p)),
      rhumbVecs: rhumbPoints.map((p) => M.vec(...p)),
      arcSpan: span(arcPoints),
      rhumbSpan: span(rhumbPoints),
    };
    return routeCache;
  }

  const number = (x, digits = 0) =>
    x.toLocaleString(W.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  /** A distance, to the nearest 10 km. */
  const km = (x) => t.km(number(Math.round(x / 10) * 10));
  const latitude = (lat) => (lat >= 0 ? t.north : t.south)(number(Math.abs(lat)));
  /** How many times bigger something is drawn: one decimal below 10, whole numbers above. */
  const times = (x) => t.times(number(x, x < 9.95 && Math.abs(x - Math.round(x)) > 0.05 ? 1 : 0));

  const pinOf = (s, which) => [s[which + 'Lat'], s[which + 'Lon']];
  const cityAt = (p) =>
    Object.keys(M.CITIES).find(
      (k) => Math.abs(M.CITIES[k][0] - p[0]) < 0.05 && Math.abs(M.wrap(M.CITIES[k][1] - p[1])) < 0.05,
    );

  // ---------- where the picture looks ----------

  // The place in the middle of the picture (the flat maps use only its longitude), and where it's gliding to.
  const camera = { lat: 50, lon: -160 };
  let target = null;
  // How far the pins sit from the middle on the gnomonic map, which sets its scale (and the scale it glides to).
  let reach = [1, 1],
    reachTarget = null;

  /** Look at the middle of the route, gliding there (or jumping, when paused or with reduced motion). */
  function aim(s, jump) {
    const [lat, lon] = M.greatCircleAt(pinOf(s, 'a'), pinOf(s, 'b'), 0.5);
    target = { lat: clamp(lat, -80, 80), lon };
    const f = M.frame(target.lat, target.lon);
    reachTarget = [0.15, 0.15];
    for (const p of [pinOf(s, 'a'), pinOf(s, 'b')]) {
      const l = M.local(M.vec(...p), f);
      if (l[2] < GNOMONIC_CAP) continue;
      const g = M.gnomonic(l);
      reachTarget = [Math.max(reachTarget[0], Math.abs(g[0])), Math.max(reachTarget[1], Math.abs(g[1]))];
    }
    if (jump || reduced) {
      Object.assign(camera, target);
      reach = reachTarget;
      target = reachTarget = null;
    }
  }
  function glide(dt) {
    const k = 1 - Math.exp(-dt * 4);
    if (target) {
      camera.lat += (target.lat - camera.lat) * k;
      camera.lon = M.wrap(camera.lon + M.wrap(target.lon - camera.lon) * k);
      if (Math.abs(target.lat - camera.lat) + Math.abs(M.wrap(target.lon - camera.lon)) < 0.01) {
        Object.assign(camera, target);
        target = null;
      }
    }
    if (reachTarget) {
      reach = reach.map((r, i) => Math.exp(Math.log(r) + (Math.log(reachTarget[i]) - Math.log(r)) * k));
      if (Math.abs(Math.log(reach[0] / reachTarget[0])) + Math.abs(Math.log(reach[1] / reachTarget[1])) < 0.002) {
        reach = reachTarget;
        reachTarget = null;
      }
    }
  }

  /**
   * How view i shows the world in a picture this size, under a strip `top` pixels tall for the words, from the
   * camera: where places go, and the way back.
   */
  function viewOf(i, width, height, top) {
    const below = height - top;
    const cx = width / 2,
      cy = top + below / 2;
    if (isFlat(i)) {
      const F = i === MERCATOR ? M.FLAT.mercator : M.FLAT.equalArea;
      const edge = i === MERCATOR ? EDGE : 90;
      const k = below / 2 / F.y(i === MERCATOR ? TOP : 90); // pixels per unit of the map
      const perDeg = k * F.xScale * DEG;
      return {
        i,
        flat: true,
        width,
        height,
        top,
        F,
        k,
        lon: camera.lon,
        perDeg,
        period: 360 * perDeg,
        x: (lon) => cx + (lon - camera.lon) * perDeg,
        y: (lat) => cy - k * F.y(clamp(lat, -edge, edge)),
        back(x, y) {
          const v = (cy - y) / k;
          if (Math.abs(v) > F.y(edge)) return null;
          return [F.lat(v), M.wrap(camera.lon + (x - cx) / perDeg)];
        },
      };
    }
    const f = M.frame(camera.lat, camera.lon);
    if (i === GLOBE) {
      const R = Math.min(width, below) / 2 - 8;
      return {
        i,
        flat: false,
        width,
        height,
        top,
        f,
        k: 0,
        R,
        cx,
        cy,
        edge: R,
        xy: (l) => [cx + R * l[0], cy - R * l[1]],
        back(x, y) {
          const a = (x - cx) / R,
            b = (cy - y) / R;
          if (a * a + b * b > 1) return null;
          return M.latLon(M.global([a, b, Math.sqrt(1 - a * a - b * b)], f));
        },
      };
    }
    // The gnomonic map, scaled so both pins fit, but never so close that it shows only a small patch.
    const R = Math.min((width / 2 - 60) / reach[0], (below / 2 - 60) / reach[1], 0.75 * Math.min(width, below));
    return {
      i,
      flat: false,
      width,
      height,
      top,
      f,
      k: GNOMONIC_CAP,
      R,
      cx,
      cy,
      edge: R * Math.tan(Math.acos(GNOMONIC_CAP)),
      xy: (l) => [cx + (R * l[0]) / l[2], cy - (R * l[1]) / l[2]],
      back(x, y) {
        const u = M.unit([(x - cx) / R, (cy - y) / R, 1]);
        return u[2] < GNOMONIC_CAP ? null : M.latLon(M.global(u, f));
      },
    };
  }

  /** The longitude shifts (multiples of 360°) at which something spanning lo…hi shows on a flat map. */
  function copies(v, lo, hi) {
    const left = v.lon - v.width / 2 / v.perDeg - 1,
      right = v.lon + v.width / 2 / v.perDeg + 1;
    const out = [];
    for (let m = Math.floor((left - hi) / 360); m <= Math.ceil((right - lo) / 360); m++)
      if (hi + 360 * m >= left && lo + 360 * m <= right) out.push(360 * m);
    return out;
  }

  /** Where a place appears: each copy of it on a flat map, or one spot on the globe and the gnomonic map (if seen). */
  function spots(v, p) {
    if (v.flat) return copies(v, p[1], p[1]).map((off) => [v.x(p[1] + off), v.y(p[0])]);
    const l = M.local(M.vec(...p), v.f);
    return l[2] < v.k + 1e-6 ? [] : [v.xy(l)];
  }

  // ---------- drawing ----------

  /** Adds [lat, lon] points to a path on a flat map, shifted by `off` degrees; `skip(i)` leaves out step i. */
  function flatLine(path, v, points, off, closed, skip) {
    const n = points.length;
    let pen = false;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      if (skip?.(i)) {
        pen = false;
        continue;
      }
      const p = points[i],
        q = points[(i + 1) % n];
      if (!pen) path.moveTo(v.x(p[1] + off), v.y(p[0]));
      path.lineTo(v.x(q[1] + off), v.y(q[0]));
      pen = true;
    }
  }
  function flatRing(path, v, points, off) {
    points.forEach(([lat, lon], i) => {
      if (i) path.lineTo(v.x(lon + off), v.y(lat));
      else path.moveTo(v.x(lon + off), v.y(lat));
    });
    path.closePath();
  }

  /** Adds the part of a ring (vectors, land on its left) in view to a path, closed along the edge of the view. */
  function capRing(path, v, vecs, lake) {
    const ring = vecs.map((p) => M.local(p, v.f));
    if (lake) ring.reverse();
    for (const loop of M.clip(ring, v.k)) {
      if (lake) loop.reverse();
      loop.forEach((l, i) => {
        const [x, y] = v.xy(l);
        if (i) path.lineTo(x, y);
        else path.moveTo(x, y);
      });
      path.closePath();
    }
  }

  /** Adds a line (vectors) to a path where it's in view, cut cleanly at the edge; `skip(i)` leaves out step i. */
  function capLine(path, v, vecs, closed, skip) {
    const n = vecs.length;
    const ls = vecs.map((p) => M.local(p, v.f));
    let pen = false;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p = ls[i],
        q = ls[(i + 1) % n];
      const pIn = p[2] >= v.k,
        qIn = q[2] >= v.k;
      if ((!pIn && !qIn) || skip?.(i)) {
        pen = false;
        continue;
      }
      let a = p,
        b = q;
      if (!pIn || !qIn) {
        const f = (p[2] - v.k) / (p[2] - q[2]);
        const c = M.toRim([p[0] + f * (q[0] - p[0]), p[1] + f * (q[1] - p[1]), v.k], v.k);
        if (pIn) b = c;
        else a = c;
      }
      const [ax, ay] = v.xy(a),
        [bx, by] = v.xy(b);
      if (!pen || !pIn) path.moveTo(ax, ay);
      path.lineTo(bx, by);
      pen = qIn;
    }
  }

  /** A shape's outline as a path, in every copy on a flat map, or cut to the view. */
  function shapePath(v, shape) {
    const path = new Path2D();
    if (v.flat) for (const off of copies(v, shape.lo, shape.hi)) flatRing(path, v, shape.flat, off);
    else capRing(path, v, shape.vecs, false);
    return path;
  }

  /** The sea, and the dark around the globe or the gnomonic map's edge. */
  function paintBack(ctx, v) {
    if (v.flat) {
      ctx.fillStyle = OCEAN;
      ctx.fillRect(0, 0, v.width, v.height);
      return;
    }
    ctx.fillStyle = SPACE;
    ctx.fillRect(0, 0, v.width, v.height);
    const g = ctx.createRadialGradient(v.cx - v.R * 0.3, v.cy - v.R * 0.35, v.R * 0.05, v.cx, v.cy, v.edge);
    g.addColorStop(0, v.i === GLOBE ? '#1b3756' : OCEAN);
    g.addColorStop(1, v.i === GLOBE ? '#0a1626' : OCEAN);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(v.cx, v.cy, v.edge, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(160, 200, 240, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawGrid(ctx, v) {
    const grid = new Path2D(),
      equator = new Path2D();
    if (v.flat) {
      for (const p of PARALLELS) {
        const path = p.lat === 0 ? equator : grid;
        path.moveTo(0, v.y(p.lat));
        path.lineTo(v.width, v.y(p.lat));
      }
      for (const off of copies(v, -180, 150))
        for (let lon = -180; lon < 180; lon += 30) {
          grid.moveTo(v.x(lon + off), 0);
          grid.lineTo(v.x(lon + off), v.height);
        }
    } else for (const g of GRID_LINES) capLine(g.equator ? equator : grid, v, g.vecs, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = GRID;
    ctx.stroke(grid);
    ctx.strokeStyle = EQUATOR;
    ctx.stroke(equator);
  }

  function drawLand(ctx, v) {
    const fill = new Path2D(),
      shore = new Path2D();
    for (const r of LAND_RINGS) {
      if (v.flat) {
        const base = 360 * Math.round((r.flat[0][1] - v.lon) / 360);
        for (const off of copies(v, r.lo - base, r.hi - base)) {
          flatRing(fill, v, r.flat, off - base);
          flatLine(shore, v, r.shore, off - base, false, (i) => r.seam[i]);
        }
      } else {
        capRing(fill, v, r.vecs, r.lake);
        capLine(shore, v, r.vecs, true, (i) => r.seam[i]);
      }
    }
    ctx.fillStyle = LAND;
    ctx.fill(fill);
    ctx.strokeStyle = SHORE;
    ctx.lineWidth = 0.8;
    ctx.stroke(shore);
  }

  /** How many times bigger than at the map's true-to-scale place (the equator, or the middle) a place is drawn. */
  function scaleAt(v, p) {
    if (v.i === MERCATOR) return M.mercatorArea(p[0]);
    if (v.i === EQUAL) return 1;
    if (v.i === GNOMONIC) return M.gnomonicArea(M.distance(M.vec(...p), v.f.out));
    return null;
  }

  /** How many times bigger than true scale a shape is drawn: its area on the map over its area on the Earth. */
  function drawnScale(v, shape) {
    if (v.i === GLOBE) return null;
    let xy;
    if (v.flat) xy = shape.flat.map(([lat, lon]) => [lon * DEG * v.F.xScale, v.F.y(lat)]);
    else {
      const ls = shape.vecs.map((p) => M.local(p, v.f));
      if (ls.some((l) => l[2] < v.k)) return null;
      xy = ls.map(M.gnomonic);
    }
    return Math.abs(M.flatArea(xy)) / M.area(shape.ring);
  }

  /** Text with a dark rim, readable over the map. */
  function label(ctx, text, x, y, colour) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(8, 12, 20, 0.88)';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = colour;
    ctx.fillText(text, x, y);
  }

  /** The stickers, each with how many times bigger than true scale this map draws it, where there's room. */
  function drawStickers(ctx, v, s) {
    const all = [...(s.stickers ? grid : []), ...dots];
    if (!all.length) return;
    const paths = all.map((d) => shapePath(v, d));
    ctx.fillStyle = 'rgba(255, 158, 192, 0.3)';
    ctx.strokeStyle = PINK;
    ctx.lineWidth = 1.3;
    for (const p of paths) {
      ctx.fill(p);
      ctx.stroke(p);
    }
    if (v.i === GLOBE) return;
    ctx.font = '700 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const across = v.flat ? v.k * STICKER : v.R * Math.tan(STICKER);
    for (const d of all) {
      const factor = scaleAt(v, d.centre);
      if (Math.sqrt(factor) * across < 15) continue;
      for (const [x, y] of spots(v, d.centre)) label(ctx, times(factor), x, y, '#ffe3ee');
    }
  }

  /** The copy of Greenland, which can be dragged about, and how many times too big this map draws it. */
  function drawGreenland(ctx, v, s) {
    if (!s.stickers) return;
    const shape = greenland(s);
    const path = shapePath(v, shape);
    ctx.fillStyle = 'rgba(201, 184, 255, 0.36)';
    ctx.fill(path);
    ctx.strokeStyle = LILAC;
    ctx.lineWidth = 1.6;
    ctx.stroke(path);
    const factor = drawnScale(v, shape);
    ctx.font = '700 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = factor === null ? t.greenlandName : t.greenlandLabel(times(factor));
    const half = ctx.measureText(text).width / 2 + 4;
    // Kept inside the picture, even when Greenland is at its edge.
    for (const [x, y] of spots(v, shape.at))
      if (x > -half && x < v.width + half)
        label(ctx, text, clamp(x, half, v.width - half), clamp(y, v.top + 10, v.height - 10), '#ece6ff');
  }

  /** The dashed compass line and the glowing shortest route, in every copy on a flat map. */
  function drawRoutes(ctx, v, r) {
    const arc = new Path2D(),
      rhumb = new Path2D();
    if (v.flat) {
      for (const off of copies(v, ...r.arcSpan)) flatLine(arc, v, r.arcPoints, off, false);
      for (const off of copies(v, ...r.rhumbSpan)) flatLine(rhumb, v, r.rhumbPoints, off, false);
    } else {
      capLine(arc, v, r.arcVecs, false);
      capLine(rhumb, v, r.rhumbVecs, false);
    }
    strokeRoutes(ctx, arc, rhumb);
  }
  function strokeRoutes(ctx, arc, rhumb) {
    ctx.lineCap = 'round';
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2.2;
    ctx.stroke(rhumb);
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(111, 227, 196, 0.22)';
    ctx.lineWidth = 9;
    ctx.stroke(arc);
    ctx.strokeStyle = MINT;
    ctx.lineWidth = 2.6;
    ctx.stroke(arc);
  }

  /** The farthest the shortest route goes from the equator, marked where it's well beyond both ends. */
  function drawPeak(ctx, v, r) {
    if (!r.peak) return;
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = r.peak[0] > 0 ? 'bottom' : 'top';
    for (const [x, y] of spots(v, r.peak)) {
      ctx.fillStyle = MINT;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, TAU);
      ctx.fill();
      label(ctx, latitude(r.peak[0]), x, y + (r.peak[0] > 0 ? -8 : 8), MINT);
    }
  }

  /** A little plane at a screen spot, nose along `angle`. */
  function plane(ctx, x, y, angle, colour) {
    const half = [
      [10, 0],
      [4, -1.7],
      [0.5, -9],
      [-2.5, -9],
      [-1, -1.8],
      [-6.5, -1.6],
      [-8.5, -5],
      [-10, -5],
      [-9, 0],
    ];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    half.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    for (let i = half.length - 2; i > 0; i--) ctx.lineTo(half[i][0], -half[i][1]);
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(8, 12, 20, 0.9)';
    ctx.stroke();
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.restore();
  }

  /** The point a fraction f along a line of points, as [lat, lon] (longitudes carried on). */
  function at(points, f) {
    const x = clamp(f, 0, 1) * (points.length - 1);
    const i = Math.min(points.length - 2, Math.floor(x)),
      g = x - i;
    const p = points[i],
      q = points[i + 1];
    return [p[0] + g * (q[0] - p[0]), p[1] + g * (q[1] - p[1])];
  }
  /** Where a point along a line appears, and which way the line runs there. */
  function headingOn(v, points, f) {
    const ahead = f < 0.995;
    const p = at(points, ahead ? f : f - 0.005),
      q = at(points, ahead ? f + 0.005 : f);
    const here = at(points, f);
    if (v.flat)
      return copies(v, here[1], here[1]).map((off) => {
        const x = v.x(here[1] + off),
          y = v.y(here[0]);
        return [x, y, Math.atan2(v.y(q[0]) - v.y(p[0]), v.x(q[1]) - v.x(p[1]))];
      });
    const lh = M.local(M.vec(...here), v.f);
    if (lh[2] < v.k) return [];
    const a = v.xy(M.local(M.vec(...p), v.f)),
      b = v.xy(M.local(M.vec(...q), v.f));
    return [[...v.xy(lh), Math.atan2(b[1] - a[1], b[0] - a[0])]];
  }

  /** The two planes, flying at the same speed: how far along each route each one is now. */
  function flights(r) {
    if (reduced || race.time <= 0) return null;
    const flown = (race.time / FLIGHT) * r.rhumb; // km so far
    return { arc: Math.min(1, flown / r.arc), rhumb: Math.min(1, flown / r.rhumb) };
  }

  function drawPlanes(ctx, v, r) {
    const f = flights(r);
    if (!f || grab?.pin) return;
    for (const [x, y, a] of headingOn(v, r.rhumbPoints, f.rhumb)) plane(ctx, x, y, a, GOLD);
    for (const [x, y, a] of headingOn(v, r.arcPoints, f.arc)) plane(ctx, x, y, a, MINT);
  }

  /** The pins, with their cities' names, and numbered while the keyboard moves them. */
  function drawPins(ctx, v, s, named = true) {
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    for (const which of ['a', 'b']) {
      const p = pinOf(s, which);
      const city = cityAt(p);
      const name = !named ? '' : keyboard ? t.pin(which === 'a' ? 1 : 2) : city ? t.cities[city] : '';
      for (const [x, y] of spots(v, p)) {
        if (picked === which) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 13, 0, TAU);
          ctx.stroke();
        }
        ctx.fillStyle = INK;
        ctx.strokeStyle = '#0a0e15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, hover === which || grab?.pin === which ? 8 : 6.5, 0, TAU);
        ctx.stroke();
        ctx.fill();
        if (!name) continue;
        // The name on the side away from the other pin, so it doesn't sit on the routes, unless it would run off.
        const other = spots(v, pinOf(s, which === 'a' ? 'b' : 'a'))[0];
        const wide = ctx.measureText(name).width + 16;
        let right = !other || other[0] <= x;
        if (right && x + wide > v.width) right = false;
        else if (!right && x - wide < 0) right = true;
        ctx.textAlign = right ? 'left' : 'right';
        label(ctx, name, x + (right ? 12 : -12), y - 12, INK);
      }
    }
  }

  function drawScene(ctx, v, s) {
    paintBack(ctx, v);
    drawGrid(ctx, v);
    drawLand(ctx, v);
    drawStickers(ctx, v, s);
    drawGreenland(ctx, v, s);
    const r = route(s);
    drawRoutes(ctx, v, r);
    drawPeak(ctx, v, r);
    drawPlanes(ctx, v, r);
    drawPins(ctx, v, s);
  }

  // ---------- one map turning into another ----------

  /** Where a place sits in a view during a morph, and whether it's in view (if not, it waits at the edge). */
  function place(v, p, ll, m) {
    if (v.flat) return [v.x(v.lon + M.wrap(ll[1] - v.lon) + 360 * m), v.y(ll[0]), true];
    let l = M.local(p, v.f);
    const seen = l[2] >= v.k;
    if (!seen) l = M.toRim(l, v.k);
    return [...v.xy(l), seen];
  }

  /** Adds a line part way between two views to three paths: seen in both, in the first only, in the second only. */
  function morphLine(paths, A, B, e, vecs, points, closed, m = 0, skip) {
    const n = points.length;
    const pa = points.map((ll, i) => place(A, vecs[i], ll, m)),
      pb = points.map((ll, i) => place(B, vecs[i], ll, m));
    const jump = (P, v, i, j) => v.flat && Math.abs(P[i][0] - P[j][0]) > v.period / 2;
    const xy = (i) => [pa[i][0] + (pb[i][0] - pa[i][0]) * e, pa[i][1] + (pb[i][1] - pa[i][1]) * e];
    let last = null; // the path the step before went into, so an unbroken line stays one line (and keeps its dashes)
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const j = (i + 1) % n;
      const inA = pa[i][2] && pa[j][2],
        inB = pb[i][2] && pb[j][2];
      if (skip?.(i) || jump(pa, A, i, j) || jump(pb, B, i, j) || (!inA && !inB)) {
        last = null;
        continue;
      }
      const path = inA && inB ? paths.both : inA ? paths.a : paths.b;
      if (path !== last) path.moveTo(...xy(i));
      path.lineTo(...xy(j));
      last = path;
    }
  }

  function strokeMorph(ctx, paths, e, style) {
    for (const [path, alpha] of [
      [paths.both, 1],
      [paths.a, 1 - e],
      [paths.b, e],
    ]) {
      ctx.globalAlpha = alpha;
      style(path);
    }
    ctx.globalAlpha = 1;
  }
  const three = () => ({ both: new Path2D(), a: new Path2D(), b: new Path2D() });

  /** The picture part way from view A to view B: each fades, while the shores, lines and routes travel across. */
  function drawMorph(ctx, A, B, e, s) {
    ctx.fillStyle = SPACE;
    ctx.fillRect(0, 0, A.width, A.height);
    for (const [v, alpha] of [
      [A, 1 - e],
      [B, e],
    ]) {
      ctx.globalAlpha = alpha;
      paintBack(ctx, v);
      ctx.globalAlpha = alpha * alpha;
      drawLand(ctx, v);
    }
    ctx.globalAlpha = 1;
    const ms = A.flat && B.flat ? [-1, 0, 1] : [0];
    const shores = three(),
      grids = three(),
      pinks = three(),
      lilac = three(),
      arc = three(),
      rhumb = three();
    for (const m of ms) {
      for (const r of LAND_RINGS)
        morphLine(shores, A, B, e, r.vecs, r.shore.slice(0, r.vecs.length), true, m, (i) => r.seam[i]);
      for (const g of GRID_LINES) morphLine(grids, A, B, e, g.vecs, g.points, false, m);
      for (const d of [...(s.stickers ? grid : []), ...dots]) morphLine(pinks, A, B, e, d.vecs, d.ring, true, m);
      if (s.stickers) {
        const g = greenland(s);
        morphLine(lilac, A, B, e, g.vecs, g.ring, true, m);
      }
      const r = route(s);
      morphLine(arc, A, B, e, r.arcVecs, r.arcPoints, false, m);
      morphLine(rhumb, A, B, e, r.rhumbVecs, r.rhumbPoints, false, m);
    }
    ctx.lineWidth = 1;
    strokeMorph(ctx, grids, e, (p) => {
      ctx.strokeStyle = GRID;
      ctx.stroke(p);
    });
    strokeMorph(ctx, shores, e, (p) => {
      ctx.strokeStyle = SHORE;
      ctx.lineWidth = 0.9;
      ctx.stroke(p);
    });
    strokeMorph(ctx, pinks, e, (p) => {
      ctx.strokeStyle = PINK;
      ctx.lineWidth = 1.3;
      ctx.stroke(p);
    });
    strokeMorph(ctx, lilac, e, (p) => {
      ctx.strokeStyle = LILAC;
      ctx.lineWidth = 1.6;
      ctx.stroke(p);
    });
    for (const k of ['both', 'a', 'b']) {
      ctx.globalAlpha = k === 'both' ? 1 : k === 'a' ? 1 - e : e;
      strokeRoutes(ctx, arc[k], rhumb[k]);
    }
    ctx.globalAlpha = 1;
    // The pins travel too.
    for (const which of ['a', 'b']) {
      const p = pinOf(s, which);
      for (const m of ms) {
        const a = place(A, M.vec(...p), p, m),
          b = place(B, M.vec(...p), p, m);
        ctx.globalAlpha = a[2] && b[2] ? 1 : a[2] ? 1 - e : b[2] ? e : 0;
        ctx.fillStyle = INK;
        ctx.strokeStyle = '#0a0e15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, 6.5, 0, TAU);
        ctx.stroke();
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ---------- the words in the picture ----------

  /** Words broken into lines no wider than `width`. */
  function lines(ctx, text, width) {
    const all = [];
    let row = '';
    for (const word of text.split(' ')) {
      const next = row ? `${row} ${word}` : word;
      if (row && ctx.measureText(next).width > width) {
        all.push(row);
        row = word;
      } else row = next;
    }
    return row ? [...all, row] : all;
  }

  /** What the race says now. */
  function raceNews(r) {
    if (r.same) return t.same;
    const f = flights(r);
    if (!f) return t.saves(km(r.saved), t.percent(number((100 * r.saved) / r.rhumb)));
    return f.arc < 1 ? t.flying : t.first(km(r.saved));
  }

  /** The strip above the map, saying what this map keeps straight: its lines of words, and its height. */
  function band(ctx, view, width) {
    // A narrow picture keeps its height for the map: the panel says the same under the choice of map.
    if (width < 560) return { rows: [], narrow: true, top: 0 };
    ctx.font = '700 16px system-ui, sans-serif';
    const rows = lines(ctx, t.truths[view], width - 28);
    return { rows, narrow: false, top: 18 + rows.length * 21 };
  }
  /** The view the picture shows now, under its strip of words. */
  const shown = (i, stage) => viewOf(i, stage.width, stage.height, band(stage.ctx, i, stage.width).top);

  /** At the top, what this map keeps straight; at the bottom, a key to the two routes and how the race went. */
  function drawWords(ctx, s, b, width, height) {
    const rtl = document.documentElement.dir === 'rtl';
    ctx.direction = rtl ? 'rtl' : 'ltr';
    ctx.textAlign = rtl ? 'right' : 'left';
    ctx.textBaseline = 'alphabetic';
    const x0 = rtl ? width - 14 : 14;
    ctx.fillStyle = SPACE;
    ctx.fillRect(0, 0, width, b.top);
    ctx.font = '700 16px system-ui, sans-serif';
    b.rows.forEach((row, i) => label(ctx, row, x0, 26 + i * 21, INK));

    const r = route(s);
    const size = b.narrow ? 12 : 14,
      gap = b.narrow ? 17 : 21,
      sample = 28; // the length of line drawn before each route's words
    ctx.font = `600 ${size}px system-ui, sans-serif`;
    const rows = [
      { text: t.key.arc(km(r.arc)), colour: MINT, dash: [] },
      { text: t.key.rhumb(km(r.rhumb)), colour: GOLD, dash: [6, 4] },
      { text: raceNews(r), colour: INK },
    ];
    const indent = (row) => (row.dash ? sample + 8 : 0);
    const wide = Math.max(...rows.map((row) => ctx.measureText(row.text).width + indent(row)));
    const boxW = Math.min(width - 16, wide + 20),
      boxH = rows.length * gap + 12;
    const bx = rtl ? width - 8 - boxW : 8,
      by = height - 8 - boxH;
    ctx.fillStyle = 'rgba(8, 12, 20, 0.74)';
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 8);
    ctx.fill();
    // Each row from the side the page's language starts on: the line's sample, then its words.
    const start = rtl ? bx + boxW - 10 : bx + 10,
      sign = rtl ? -1 : 1;
    rows.forEach((row, i) => {
      const y = by + 6 + gap * (i + 0.72);
      if (row.dash) {
        ctx.strokeStyle = row.colour;
        ctx.lineWidth = 2.4;
        ctx.setLineDash(row.dash);
        ctx.beginPath();
        ctx.moveTo(start, y - size * 0.35);
        ctx.lineTo(start + sign * sample, y - size * 0.35);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle = row.colour;
      ctx.fillText(row.text, start + sign * indent(row), y, boxW - 20 - indent(row));
    });
    ctx.direction = 'ltr';
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    const b = band(ctx, morph ? morph.to : s.view, width);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, b.top, width, height - b.top);
    ctx.clip();
    if (morph) {
      const e = ease(Math.min(1, morph.time / MORPH));
      drawMorph(ctx, viewOf(morph.from, width, height, b.top), viewOf(morph.to, width, height, b.top), e, s);
    } else drawScene(ctx, viewOf(s.view, width, height, b.top), s);
    ctx.restore();
    drawWords(ctx, s, b, width, height);
  }

  function preview(ctx, width, height) {
    const s = { ...presetSettings[0], view: MERCATOR, stickers: false };
    const before = [{ ...camera }, target, reach, reachTarget]; // the home map may draw this while the room is open
    aim(s, true);
    ctx.fillStyle = OCEAN;
    ctx.fillRect(0, 0, width, height);
    const v = viewOf(MERCATOR, width, height, 0);
    drawGrid(ctx, v);
    drawLand(ctx, v);
    drawRoutes(ctx, v, route(s));
    drawPins(ctx, v, s, width >= 400); // the map's small picture has no room for names
    Object.assign(camera, before[0]);
    [, target, reach, reachTarget] = before;
  }

  // ---------- the stickers and Greenland ----------

  let grid = GRID_PLACES.map(sticker), // the stickers all over the world, which can be moved
    dots = []; // stickers dropped by hand
  let trip = null; // { time, to } while Greenland slides to Africa

  let greenCache = null;
  /** The copy of Greenland where it is now (part way there, while it slides). */
  function greenland(s) {
    let to = [s.gLat, s.gLon];
    if (trip) {
      const f = ease(Math.min(1, trip.time / TRIP));
      to = [HOME[0] + (to[0] - HOME[0]) * f, HOME[1] + M.wrap(to[1] - HOME[1]) * f];
    }
    const key = to.join(',');
    if (greenCache?.key !== key) greenCache = { key, at: to, ...shapeOf(M.move(GREENLAND, HOME, to)) };
    return greenCache;
  }

  function drop(p, stage) {
    dots.push(sticker([clamp(p[0], -75, 75), p[1]]));
    if (dots.length > MOST) dots.shift();
    const v = shown(stageView(stage), stage);
    const factor = scaleAt(v, p);
    W.announce(factor === null ? t.droppedGlobe : t.dropped(latitude(p[0]), times(factor)));
  }

  // ---------- the race, the morph and the panel ----------

  const race = { time: 0, told: false };
  let morph = null; // { from, to, time } while one map turns into another
  let grab = null, // what the pointer holds: { pin }, { sticker }, { greenland } or { world }
    hover = null, // the pin under the mouse
    picked = null, // the pin the arrow keys move
    keyboard = false; // number the pins while the keyboard is in use
  const stageView = (stage) => stage.settingsFor('maps').view;

  function restartRace(fresh) {
    race.time = 0;
    if (fresh) race.told = false;
  }

  function step(dt, s, stage) {
    glide(dt);
    if (morph && (morph.time += dt) >= MORPH) {
      morph = null;
      stage.sync();
    }
    if (trip && (trip.time += dt) >= TRIP) {
      trip = null;
      stage.sync();
    }
    if (grab?.pin) return;
    race.time += dt;
    const r = route(s);
    if (!race.told && !r.same && (race.time / FLIGHT) * r.rhumb >= r.arc) {
      race.told = true;
      W.announce(t.first(km(r.saved)));
      stage.sync();
    }
    if (race.time >= FLIGHT + REST) restartRace();
  }

  const C = M.CITIES;
  const between = (a, b) => ({ aLat: a[0], aLon: a[1], bLat: b[0], bLon: b[1] });
  const presetSettings = [
    { ...between(C.newYork, C.tokyo), stickers: false, gLat: HOME[0], gLon: HOME[1] },
    { ...between(C.madrid, C.beijing), stickers: false, gLat: HOME[0], gLon: HOME[1] },
    // Greenland moved onto the middle of Africa, on the equator by Lake Victoria.
    { ...between(C.london, C.losAngeles), stickers: true, gLat: 0, gLon: 30 },
  ];
  const badges = ['✈', '40°', '×14'];
  const same = (x, y) => Math.abs(x - y) < 1e-6;
  // Where the copy of Greenland waits doesn't matter while the stickers are hidden.
  const presetIndex = (s) =>
    presetSettings.findIndex((p) =>
      Object.keys(p).every((k) =>
        typeof p[k] === 'boolean' ? p[k] === s[k] : same(p[k], s[k]) || (k[0] === 'g' && !p.stickers && !s.stickers),
      ),
    );

  /** After the route changes: a fresh race, and the panel says so. */
  function changed(s, stage) {
    restartRace(true);
    stage.setChosen(presetIndex(s));
    stage.sync();
    stage.draw();
  }

  function setView(i, s, stage) {
    if (i === s.view) return;
    morph = !reduced && stage.playing ? { from: s.view, to: i, time: 0 } : null;
    s.view = i;
    stage.sync();
    stage.draw();
  }

  function controls(s, stage) {
    return (
      `<div class="control wide"><span class="maps-label" id="maps-view-label">${t.viewLabel}</span>` +
      `<div class="segment" role="group" aria-labelledby="maps-view-label">` +
      t.views
        .map((name, i) => `<button type="button" data-view="${i}" aria-pressed="${i === s.view}">${name}</button>`)
        .join('') +
      `</div><p id="maps-view-hint">${t.viewHints[s.view]}</p></div>` +
      // Not a live region: it is rebuilt on every change. The race's result is announced once instead.
      '<div class="wide readout maps-readout" id="maps-readout"></div>' +
      `<div class="control wide">${stage.check('stickers', t.stickers, s.stickers)}<p>${t.stickersHint}</p></div>`
    );
  }

  function bindControls(panel, s, stage) {
    panel
      .querySelectorAll('[data-view]')
      .forEach((b) => b.addEventListener('click', () => setView(Number(b.dataset.view), s, stage)));
    panel.querySelector('[data-check="stickers"]').addEventListener('change', () => {
      grid = GRID_PLACES.map(sticker);
      trip = null;
      stage.setChosen(presetIndex(s));
      stage.sync();
    });
  }

  function readouts(s, stage) {
    const r = route(s);
    $('scene-status').textContent = t.status(km(r.arc));
    const i = presetIndex(s);
    $('scene-name').textContent = i >= 0 ? t.presets[i].name : t.yourOwn;
    document
      .querySelectorAll('#scene-controls [data-view]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.view) === s.view));
    const hint = $('maps-view-hint');
    if (hint) hint.textContent = t.viewHints[s.view];
    const box = $('maps-readout');
    if (!box) return;
    const row = (name, value) => `<span>${name}</span><strong>${value}</strong>`;
    const percent = t.percent(number((100 * r.saved) / r.rhumb));
    let rule = r.same ? t.same : t.rule(percent);
    if (r.peak) rule += ' ' + t.reaches(latitude(r.peak[0]));
    let green = '';
    if (s.stickers) {
      const factor = drawnScale(shown(s.view, stage), greenland(s));
      const drawn = factor === null ? t.atTrueSize : t.trueSize(times(factor));
      green =
        `<div class="maps-rows">${row(t.readout.greenland, drawn)}</div>` +
        `<p class="maps-rule">${t.stickerRules[s.view]}</p>`;
    }
    box.innerHTML =
      '<div class="maps-rows">' +
      row(t.readout.arc, km(r.arc)) +
      row(t.readout.rhumb, km(r.rhumb)) +
      `</div><p class="maps-rule">${rule}</p>${green}`;
  }

  // ---------- the pointer and the keys ----------

  const currentView = (stage) => shown(stageView(stage), stage);
  const near = (spotsList, x, y, d) => spotsList.some(([px, py]) => Math.hypot(px - x, py - y) < d);

  function pinNear(v, s, x, y) {
    return ['a', 'b'].find((w) => near(spots(v, pinOf(s, w)), x, y, 22)) ?? null;
  }
  /** Whether a place is inside a shape on the Earth: the shape winds round it. */
  const inside = (shape, p) => {
    const f = M.frame(...p);
    return M.winding(shape.vecs.map((q) => M.local(q, f))) > 0;
  };
  /** What the pointer is over: a pin, a sticker, Greenland, the world, or nothing. */
  function hit(v, s, x, y) {
    const pin = pinNear(v, s, x, y);
    if (pin) return { pin };
    const p = v.back(x, y);
    if (!p) return null;
    const dot = [...dots].reverse().find((d) => M.distance(M.vec(...d.centre), M.vec(...p)) < STICKER);
    if (dot) return { sticker: dot };
    if (s.stickers && inside(greenland(s), p)) return { greenland: true };
    if (s.stickers) {
      const g = grid.find((d) => M.distance(M.vec(...d.centre), M.vec(...p)) < STICKER);
      if (g) return { sticker: g };
    }
    return { world: true };
  }

  /** Moves a shape's middle by the pointer's step on the Earth, from place p to place q. */
  const shift = (centre, p, q) => [clamp(centre[0] + q[0] - p[0], -75, 78), M.wrap(centre[1] + M.wrap(q[1] - p[1]))];
  const round2 = (x) => Math.round(x * 100) / 100;

  W.defineRoom({
    id: 'maps',
    symbol: '✈',
    theme: 'shape',
    added: '2026-10-18',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#132a2a', border: MINT, color: '#c9f6e9' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.presets[0].name,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'plane' },

    // The pins (latitude and longitude), the map, the stickers, and where the copy of Greenland is.
    defaults: { ...presetSettings[0], view: MERCATOR },
    ranges: {
      aLat: [-PIN_LAT, PIN_LAT],
      aLon: [-180, 180],
      bLat: [-PIN_LAT, PIN_LAT],
      bLon: [-180, 180],
      view: [0, 3, 'integer'],
      gLat: [-75, 78],
      gLon: [-180, 180],
    },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Mercator_Gerardus',
        color: GOLD,
        sketch: {
          hairStyle: 'receding',
          hair: '#8f8a84',
          skin: '#ecc9a5',
          beard: 'full',
          moustache: true,
          backdrop: '#2b2a3a',
        },
      },
      {
        ...t.guests[1],
        bio: 'Nunes',
        color: '#9fc4ec',
        sketch: {
          hairStyle: 'short',
          hair: '#2e2620',
          skin: '#e2b98f',
          beard: 'full',
          brows: 'bold',
          backdrop: '#1d2b3c',
        },
      },
      {
        ...t.guests[2],
        color: PINK,
        sketch: {
          hairStyle: 'swept',
          hair: '#4a3a2e',
          skin: '#f0cfb2',
          beard: 'short',
          moustache: true,
          backdrop: '#3a2230',
        },
      },
    ],
    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    step,
    preview,

    enter(s, stage) {
      if (!M.usable(pinOf(s, 'a'), pinOf(s, 'b'))) Object.assign(s, presetSettings[0]);
      morph = trip = null;
      grab = null;
      picked = null;
      restartRace(true);
      aim(s, true);
      stage.sync();
    },
    onPreset(s, stage) {
      grid = GRID_PLACES.map(sticker);
      restartRace(true);
      aim(s, !stage.playing);
      const away = M.distance(M.vec(s.gLat, s.gLon), M.vec(...HOME)) > 1e-6;
      trip = s.stickers && away && !reduced && stage.playing ? { time: 0 } : null;
    },
    action(s, stage) {
      restartRace();
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      dots = [];
      grid = GRID_PLACES.map(sticker);
      trip = null;
      restartRace();
      aim(s, !stage.playing);
      stage.sync();
    },

    pointer: {
      // Touches on a pin, a sticker or the globe move them; elsewhere they scroll the page.
      drag(p, s, stage) {
        const v = currentView(stage);
        const h = hit(v, s, p.x * stage.width, p.y * stage.height);
        return !!h && (!h.world || !v.flat);
      },
      down(p, s, stage) {
        if (morph) return;
        keyboard = false;
        const v = currentView(stage),
          x = p.x * stage.width,
          y = p.y * stage.height;
        const h = hit(v, s, x, y);
        grab = h && { ...h, x, y, at: v.back(x, y), moved: 0 };
        if (grab?.pin) picked = null;
        if (grab?.greenland) trip = null;
        stage.draw();
      },
      move(p, { dragging, dx, dy, mouse }, s, stage) {
        const v = currentView(stage),
          x = p.x * stage.width,
          y = p.y * stage.height;
        const canvas = $('scene-canvas');
        if (mouse && !dragging) {
          const h = hit(v, s, x, y);
          const was = hover;
          hover = h?.pin ?? null;
          canvas.classList.toggle('maps-grab', !!h && !h.world);
          canvas.classList.toggle('maps-move', !!h?.world);
          if (was !== hover) stage.draw();
        }
        if (!dragging || !grab || morph) return;
        grab.moved += Math.abs(dx) + Math.abs(dy);
        const q = v.back(x, y);
        if (grab.pin) {
          if (!q) return;
          const there = [clamp(q[0], -PIN_LAT, PIN_LAT), q[1]];
          if (!M.usable(there, pinOf(s, grab.pin === 'a' ? 'b' : 'a'))) return;
          s[grab.pin + 'Lat'] = round2(there[0]);
          s[grab.pin + 'Lon'] = round2(there[1]);
          changed(s, stage);
          return;
        }
        if (grab.sticker || grab.greenland) {
          if (!q || !grab.at) return;
          if (grab.sticker) {
            const d = grab.sticker;
            Object.assign(d, sticker(shift(d.centre, grab.at, q)));
          } else {
            const [lat, lon] = shift([s.gLat, s.gLon], grab.at, q);
            s.gLat = round2(lat);
            s.gLon = round2(lon);
            stage.setChosen(presetIndex(s));
            stage.sync();
          }
          grab.at = q;
          stage.draw();
          return;
        }
        // The world itself: a flat map slides sideways, the globe and the gnomonic map turn.
        target = null;
        if (v.flat) camera.lon = M.wrap(camera.lon - dx / v.perDeg);
        else {
          camera.lon = M.wrap(camera.lon - dx / v.R / DEG / Math.max(0.2, Math.cos(camera.lat * DEG)));
          camera.lat = clamp(camera.lat + dy / v.R / DEG, -85, 85);
        }
        stage.draw();
      },
      up(e) {
        const stage = W.stage,
          s = stage.settingsFor('maps');
        if (grab?.pin && s) {
          restartRace(true);
          aim(s, !stage.playing);
        }
        if (grab?.world && grab.moved < 6 && grab.at && e?.type === 'pointerup' && s) {
          drop(grab.at, stage);
          stage.sync();
        }
        grab = null;
        stage.draw();
      },
      leave() {
        hover = null;
        $('scene-canvas').classList.remove('maps-grab', 'maps-move');
      },
      escape() {
        if (!picked) return;
        picked = null;
        W.announce(t.letGo);
        W.stage.draw();
      },
      /** The arrow keys move the picked pin a degree at a time, or turn the world. */
      arrow(dx, dy, s, stage) {
        keyboard = true;
        if (picked) {
          const there = [clamp(s[picked + 'Lat'] - dy, -PIN_LAT, PIN_LAT), M.wrap(s[picked + 'Lon'] + dx)];
          if (!M.usable(there, pinOf(s, picked === 'a' ? 'b' : 'a'))) return;
          s[picked + 'Lat'] = round2(there[0]);
          s[picked + 'Lon'] = round2(there[1]);
          changed(s, stage);
          aim(s, !stage.playing);
          return;
        }
        target = null;
        camera.lon = M.wrap(camera.lon + dx * 10);
        camera.lat = clamp(camera.lat - dy * 10, -85, 85);
      },
      key(e, s, stage) {
        if (e.key === '1' || e.key === '2') {
          keyboard = true;
          picked = e.key === '1' ? 'a' : 'b';
          W.announce(t.picked(e.key));
          return true;
        }
        if (e.key === 'Enter') {
          restartRace();
          stage.sync();
          return true;
        }
        return false;
      },
    },

    // Stickers dropped by hand, as latitude, longitude, latitude, longitude…
    extraSettings: () =>
      dots.length ? { dots: dots.flatMap((d) => d.centre.map((x) => Math.round(x * 10) / 10)) } : {},
    restore(saved) {
      const list = saved.dots;
      if (!Array.isArray(list) || list.length % 2) return;
      dots = [];
      for (let i = 0; i + 1 < list.length && dots.length < MOST; i += 2) {
        const [lat, lon] = [list[i], list[i + 1]];
        if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 75 && Math.abs(lon) <= 180)
          dots.push(sticker([lat, lon]));
      }
    },
  });
})();
