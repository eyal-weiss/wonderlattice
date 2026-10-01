/* Room · The triangle with three right angles: a triangle on a ball, and an arrow carried round it. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const G = W.models.globe;
  const t = W.text('globe');
  const reduced = W.prefersReducedMotion();
  const DEG = G.DEG;

  const GOLD = '#ffc75a',
    PALE = '#ffe3a6',
    MINT = '#6fe3c4',
    SKY = '#c9d6e3';
  const LAP = 7.5, // seconds to walk round, shared between the sides by their lengths
    PAUSE = 0.55, // seconds at each corner, where the path turns and the arrow doesn't
    HOLD = 3.8, // seconds at home, showing the turn, before walking round again
    FOOTPRINTS = 16; // arrows left behind on the way round
  const KEYS = ['a', 'b', 'c'];
  // The size slider runs from 8 to 100; the triangle's corners then sit 85° × (value / 100)² from its centre.
  const SMALLEST = 8,
    LARGEST = 85;

  // ---------- the triangle ----------

  const cornersOf = (s) => KEYS.map((k) => G.vec(s[k + 'Lat'], s[k + 'Lon']));
  const round3 = (x) => Math.round(x * 1000) / 1000;
  function store(s, tri) {
    tri.forEach((p, i) => {
      const [lat, lon] = G.latLon(p);
      s[KEYS[i] + 'Lat'] = round3(lat);
      s[KEYS[i] + 'Lon'] = round3(lon);
    });
    return s;
  }

  /** Everything the picture and the readouts say about the triangle in the settings. */
  function measure(s) {
    const tri = cornersOf(s);
    const angles = G.angles(tri).map((a) => a / DEG);
    const extra = G.excess(tri) / DEG;
    const digits = extra >= 10 ? 0 : extra >= 1 ? 1 : 2; // enough decimals to show the extra of a small triangle
    const circle = G.circle(tri);
    const walk = G.walk(tri);
    return {
      tri,
      angles,
      extra,
      digits,
      rounded: G.roundParts(angles, digits),
      share: G.share(tri),
      walk,
      turned: G.homeTurn(walk) / DEG,
      centre: circle?.centre ?? null,
      radius: circle?.radius ?? 0,
      shortest: Math.min(...walk.legs.map((l) => l.length)),
    };
  }

  const number = (x, digits) =>
    x.toLocaleString(W.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const degrees = (x, digits) => t.degrees(number(x, digits));
  const percent = (share) => t.percent((share * 100).toLocaleString(W.numberLocale, { maximumSignificantDigits: 3 }));
  const sumLine = (m) =>
    t.sum(
      m.rounded.parts.map((x) => degrees(x, m.digits)),
      degrees(m.rounded.total, m.digits),
    );
  // The extra and the turn, rounded like the sum, so 270° shows 90° more, never 89.9°.
  const extraText = (m) => degrees(m.rounded.total - 180, m.digits);
  // The turn is the extra, up to whole turns: a nearly flat triangle's arrow turns 0.01°, never 359.99°.
  const turnText = (m) => degrees(Math.max(0, m.turned - 360 * Math.round((m.turned - m.extra) / 360)), m.digits);

  const sizeValue = (radius) => clamp(Math.round(100 * Math.sqrt(radius / DEG / LARGEST)), SMALLEST, 100);
  const sizeRadius = (value) => LARGEST * (value / 100) ** 2 * DEG;

  // ---------- the view ----------

  // The point of the ball facing us (latitude, longitude, in degrees), and how close we are (1: the whole ball).
  const camera = { lat: 30, lon: 45, zoom: 1 };
  let target = null, // where the view glides to after a new size or preset
    swaying = true, // the ball rocks gently until someone turns it
    swayTime = 0,
    keepView = false; // a saved moment brings its own view

  const wrap = (lon) => ((((lon + 180) % 360) + 360) % 360) - 180;
  /** How close to come so a triangle of this size fills a good part of the picture. */
  const zoomFor = (radius) => clamp(0.42 / Math.sin(Math.max(radius, 1e-4)), 1, 40);
  /** The view with the ball's gentle rocking, which fades as the view comes closer. */
  const shown = () => ({
    ...camera,
    lon: camera.lon + (swaying && !reduced ? (12 / camera.zoom ** 2) * Math.sin((TAU * swayTime) / 26) : 0),
  });
  /** Start rocking again, from the middle of the swing, so the view doesn't jump. */
  function rock() {
    swaying = true;
    swayTime = 0;
  }
  /** Stop rocking, keeping the ball where the rocking had got to. */
  function settle() {
    camera.lon = wrap(shown().lon);
    swaying = false;
    target = null;
  }
  /** Glide to a view (or jump, when paused or with reduced motion). */
  function go(view, jump) {
    target = { lat: clamp(view.lat, -89, 89), lon: wrap(view.lon), zoom: clamp(view.zoom, 1, 40) };
    if (jump || reduced) {
      Object.assign(camera, target);
      target = null;
    }
  }
  function glide(dt) {
    if (!target) return;
    const k = 1 - Math.exp(-dt * 5);
    camera.lat += (target.lat - camera.lat) * k;
    camera.lon = wrap(camera.lon + wrap(target.lon - camera.lon) * k);
    camera.zoom = Math.exp(Math.log(camera.zoom) + (Math.log(target.zoom) - Math.log(camera.zoom)) * k);
    const close =
      Math.abs(target.lat - camera.lat) + Math.abs(wrap(target.lon - camera.lon)) < 0.01 / camera.zoom &&
      Math.abs(Math.log(target.zoom / camera.zoom)) < 0.002;
    if (close) {
      Object.assign(camera, target);
      target = null;
    }
  }

  /**
   * Where things go. A tall picture may show only its top at first, so the ball sits high, sized so a triangle
   * facing us fits above the fold, and its lower half may run off. Below it, when there's room, the chart.
   * On a narrow picture the second line of words moves to the bottom.
   */
  function layout(width, height) {
    const narrow = width < 560;
    const top = narrow ? 42 : 66,
      bottom = narrow ? 48 : 30;
    const seen = Math.min(height, Math.max(0.58 * width, 300)); // the part of the picture likely on screen
    // On a narrow picture, a little more room above the ball, for the label of the corner at the top.
    const base = Math.max(30, Math.min(width / 2 - 12, (seen - top - bottom) / (narrow ? 1.6 : 1.45)));
    const cy = top + 0.88 * base + (narrow ? 22 : 6);
    const below = cy + base + 18;
    const chartWidth = Math.min(width - 96, 520);
    const chart =
      height - below >= 190 && chartWidth > 200
        ? { x: (width - chartWidth) / 2 + 20, y: below + 34, w: chartWidth, h: Math.min(200, height - below - 90) }
        : null;
    return {
      cx: width / 2,
      cy,
      base,
      narrow,
      words: width - 28,
      caption: narrow ? seen - 12 : 76, // the walk's news: at the bottom on a narrow picture, else under the words
      chart,
      // With a chart below, the ball stays above it, however close the view comes.
      floor: chart ? below - 6 : height,
    };
  }

  /** A camera looking at the ball: screen centre, radius in pixels, and the directions out of, across and up it. */
  function viewFor(cx, cy, base, cam, width, height) {
    const la = cam.lat * DEG,
      lo = cam.lon * DEG;
    const R = base * cam.zoom;
    // How far from the facing point the picture reaches, as an angle: 90° when the whole ball is in sight.
    const far =
      Math.max(
        Math.hypot(cx, cy),
        Math.hypot(width - cx, cy),
        Math.hypot(cx, height - cy),
        Math.hypot(width - cx, height - cy),
      ) + 2;
    return {
      cx,
      cy,
      R,
      out: [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)],
      across: [-Math.sin(lo), Math.cos(lo), 0],
      up: [-Math.sin(la) * Math.cos(lo), -Math.sin(la) * Math.sin(lo), Math.cos(la)],
      reach: far >= R ? 90 : Math.asin(far / R) / DEG,
      lat: cam.lat,
      lon: cam.lon,
    };
  }
  const currentView = (stage) => {
    const L = layout(stage.width, stage.height);
    return { ...viewFor(L.cx, L.cy, L.base, shown(), stage.width, stage.height), floor: L.floor };
  };

  /** Screen position of a point of the ball; z > 0 on the side facing us. */
  const project = (p, v) => ({
    x: v.cx + v.R * G.dot(p, v.across),
    y: v.cy - v.R * G.dot(p, v.up),
    z: G.dot(p, v.out),
  });
  /** The point of the ball under a screen position (on its edge, if the position is off the ball). */
  function unproject(x, y, v) {
    let a = (x - v.cx) / v.R,
      b = (v.cy - y) / v.R;
    const r = Math.hypot(a, b);
    if (r > 1) {
      a /= r;
      b /= r;
    }
    const c = Math.sqrt(Math.max(0, 1 - a * a - b * b));
    return G.unit([0, 1, 2].map((i) => a * v.across[i] + b * v.up[i] + c * v.out[i]));
  }

  // ---------- drawing ----------

  /** A line on the ball, drawn only where it faces us. */
  function trace(ctx, v, at, n) {
    ctx.beginPath();
    let pen = false;
    for (let i = 0; i <= n; i++) {
      const q = project(at(i / n), v);
      if (q.z < 0) {
        pen = false;
        continue;
      }
      if (pen) ctx.lineTo(q.x, q.y);
      else ctx.moveTo(q.x, q.y);
      pen = true;
    }
    ctx.stroke();
  }

  function drawBall(ctx, v) {
    const g = ctx.createRadialGradient(v.cx - v.R * 0.35, v.cy - v.R * 0.4, v.R * 0.05, v.cx, v.cy, v.R);
    g.addColorStop(0, '#26496f');
    g.addColorStop(1, '#0b1726');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(v.cx, v.cy, v.R, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(160, 200, 240, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const GRID = [30, 15, 10, 5, 2, 1, 0.5];
  /** Meridians and parallels, finer as the view comes closer, and only those in sight. */
  function drawGrid(ctx, v) {
    const step = GRID.find((g) => v.R * g * DEG <= 170) ?? 0.5;
    const window = Math.min(90, v.reach + step) * DEG,
      cosW = Math.cos(window);
    const sin0 = Math.sin(v.lat * DEG),
      cos0 = Math.cos(v.lat * DEG);
    const n = Math.ceil((2 * Math.min(180, v.reach + step)) / Math.min(step / 6, v.reach / 40));
    ctx.lineWidth = 1;
    for (let i = 1; i < 180 / step; i++) {
      const lat = -90 + i * step,
        la = lat * DEG;
      if (Math.abs(lat - v.lat) * DEG > window) continue;
      // The stretch of this parallel within sight: cos(distance) ≥ cos(window).
      const k = (cosW - Math.sin(la) * sin0) / (Math.cos(la) * cos0);
      if (k >= 1) continue;
      const half = k <= -1 ? 180 : Math.acos(k) / DEG;
      ctx.strokeStyle = lat === 0 ? 'rgba(175, 215, 250, 0.5)' : 'rgba(150, 190, 235, 0.2)';
      trace(ctx, v, (f) => G.vec(lat, v.lon + (2 * f - 1) * half), n);
    }
    ctx.strokeStyle = 'rgba(150, 190, 235, 0.2)';
    const lo = Math.max(-90, v.lat - v.reach - step),
      hi = Math.min(90, v.lat + v.reach + step);
    for (let i = 0; i < 360 / step; i++) {
      const lon = -180 + i * step;
      // The nearest this meridian comes to the facing point.
      const B = cos0 * Math.cos((lon - v.lon) * DEG);
      if ((B >= 0 ? Math.hypot(sin0, B) : Math.abs(sin0)) < cosW) continue;
      trace(ctx, v, (f) => G.vec(lo + (hi - lo) * f, lon), n);
    }
  }

  /** Points round the triangle, anticlockwise seen from outside (the order it's walked in). */
  function outline(m) {
    const pts = [];
    for (const leg of m.walk.legs) {
      const n = Math.max(24, Math.ceil(leg.length / (1.5 * DEG)));
      for (let i = 0; i < n; i++) pts.push(G.along(leg.from, leg.to, i / n));
    }
    return pts;
  }

  /** Where a stretch from p (in front) to q (behind) crosses the edge of the ball as we see it. */
  function crossing(p, q, v) {
    const zp = G.dot(p, v.out),
      zq = G.dot(q, v.out);
    const f = zp / (zp - zq);
    const c = [0, 1, 2].map((i) => p[i] + f * (q[i] - p[i]));
    const z = G.dot(c, v.out);
    return G.unit([0, 1, 2].map((i) => c[i] - z * v.out[i]));
  }
  const edgeAngle = (c, v) => Math.atan2(G.dot(c, v.up), G.dot(c, v.across));

  /**
   * The part of the triangle facing us, as a path: its outline where it's in front, joined along the edge of the
   * ball where it passes behind. Going anticlockwise, each stretch of edge runs anticlockwise too.
   */
  function regionPath(ctx, pts, v) {
    const z = pts.map((p) => G.dot(p, v.out));
    const n = pts.length;
    ctx.beginPath();
    if (z.every((x) => x >= 0)) {
      pts.forEach((p, i) => {
        const q = project(p, v);
        if (i) ctx.lineTo(q.x, q.y);
        else ctx.moveTo(q.x, q.y);
      });
      ctx.closePath();
      return true;
    }
    const start = z.findIndex((x, i) => x < 0 && z[(i + 1) % n] >= 0);
    if (start < 0) return false; // all of it behind
    const along = (from, to) => {
      let a = to;
      while (a < from) a += TAU;
      const step = Math.min(3 * DEG, 20 / v.R);
      for (let x = from; x < a; x += step) ctx.lineTo(v.cx + v.R * Math.cos(x), v.cy - v.R * Math.sin(x));
    };
    let exit = null,
      first = null;
    for (let k = 1; k <= n; k++) {
      const i = (start + k) % n,
        prev = (i - 1 + n) % n;
      if (z[i] >= 0 && z[prev] < 0) {
        const c = crossing(pts[i], pts[prev], v),
          q = project(c, v);
        if (first === null) {
          first = edgeAngle(c, v);
          ctx.moveTo(q.x, q.y);
        } else {
          along(exit, edgeAngle(c, v));
          ctx.lineTo(q.x, q.y);
        }
      }
      if (z[i] >= 0) {
        const q = project(pts[i], v);
        ctx.lineTo(q.x, q.y);
      } else if (z[prev] >= 0) {
        const c = crossing(pts[prev], pts[i], v),
          q = project(c, v);
        ctx.lineTo(q.x, q.y);
        exit = edgeAngle(c, v);
      }
    }
    along(exit, first);
    ctx.closePath();
    return true;
  }

  function drawTriangle(ctx, v, m) {
    const pts = outline(m);
    if (regionPath(ctx, pts, v)) {
      ctx.fillStyle = 'rgba(255, 196, 92, 0.24)';
      ctx.fill();
    }
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    trace(ctx, v, (f) => pts[Math.round(f * pts.length) % pts.length], pts.length);
  }

  /** Text with a dark rim, readable over the ball and its lines. */
  function label(ctx, text, x, y, colour) {
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(10, 14, 21, 0.85)';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = colour;
    ctx.fillText(text, x, y);
  }

  /**
   * Where the starting corner's label goes, as a direction from its first side: the middle of the widest gap
   * between the two sides, the arrow that sets off (in the middle of the angle), the arrow that comes home, and the
   * label of its turn, so none of them covers it.
   */
  function startLabel(alpha, turned) {
    const taken = [0, alpha, alpha / 2, alpha / 2 + turned, alpha / 2 + turned / 2]
      .map((a) => ((a % TAU) + TAU) % TAU)
      .sort((a, b) => a - b);
    let best = 0,
      at = 0;
    taken.forEach((a, j) => {
      const next = j + 1 < taken.length ? taken[j + 1] : taken[0] + TAU;
      if (next - a > best) {
        best = next - a;
        at = a + best / 2;
      }
    });
    return at;
  }

  /** Each corner's angle: an arc (a small square for a right angle) and, when there's room, its size. */
  function drawAngles(ctx, v, m, words) {
    const w = m.walk;
    const rho = Math.min(0.3 * m.shortest, 20 / v.R);
    const roomy = Math.sin(m.radius) * v.R > 70;
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    w.corners.forEach((p, k) => {
      if (G.dot(p, v.out) < 0.02) return;
      ctx.strokeStyle = PALE; // again for each corner: a label's rim changes the stroke
      ctx.lineWidth = 1.5;
      const i = w.order[k];
      const first = G.heading(p, w.corners[(k + 1) % 3]);
      const toward = (a) => G.rotate(p, first, a);
      const alpha = m.angles[i] * DEG;
      if (Math.abs(m.angles[i] - 90) < 0.05) {
        const corners = [
          G.travel(p, toward(0), rho),
          G.travel(p, toward(alpha / 2), rho * Math.SQRT2),
          G.travel(p, toward(alpha), rho),
        ];
        trace(ctx, v, (f) => corners[Math.round(f * 2)], 2);
      } else trace(ctx, v, (f) => G.travel(p, toward(f * alpha), rho), 16);
      if (!words || !roomy) return;
      const q = project(G.travel(p, toward(k ? alpha / 2 : startLabel(alpha, m.turned * DEG)), rho * 2.4), v);
      label(ctx, degrees(m.rounded.parts[i], m.digits), q.x, q.y, PALE);
    });
  }

  /** The corners you can drag, numbered when the keyboard is in use. */
  function drawHandles(ctx, v, m) {
    const mid = m.centre ? project(m.centre, v) : null;
    m.tri.forEach((p, i) => {
      const q = project(p, v);
      if (q.z < 0) return;
      if (picked === i) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 12, 0, TAU);
        ctx.stroke();
      }
      ctx.fillStyle = '#fff4d6';
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(q.x, q.y, hover === i || grab?.corner === i ? 8 : 6.5, 0, TAU);
      ctx.fill();
      ctx.stroke();
      if (keyboard && mid) {
        const dx = q.x - mid.x,
          dy = q.y - mid.y,
          d = Math.hypot(dx, dy) || 1;
        ctx.font = '700 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        label(ctx, t.corner(i + 1), q.x + (dx / d) * 22, q.y + (dy / d) * 22, '#ffffff');
      }
    });
  }

  /** An arrow lying on the ball, from p in direction dir, `size` long (an angle), with its head drawn flat. */
  function drawArrow(ctx, v, p, dir, size, colour, width, dashed) {
    const pts = [];
    for (let i = 0; i <= 8; i++) pts.push(project(G.travel(p, dir, (size * i) / 8), v));
    if (pts[0].z < 0 || pts[8].z < 0) return;
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;
    ctx.lineWidth = width;
    ctx.setLineDash(dashed ? [4, 3] : []);
    ctx.beginPath();
    pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
    ctx.stroke();
    ctx.setLineDash([]);
    const tip = pts[8],
      back = pts[6];
    const a = Math.atan2(tip.y - back.y, tip.x - back.x),
      head = 4 + width * 2;
    ctx.beginPath();
    ctx.moveTo(tip.x + Math.cos(a) * 2, tip.y + Math.sin(a) * 2);
    ctx.lineTo(tip.x - Math.cos(a - 0.45) * head, tip.y - Math.sin(a - 0.45) * head);
    ctx.lineTo(tip.x - Math.cos(a + 0.45) * head, tip.y - Math.sin(a + 0.45) * head);
    ctx.closePath();
    ctx.fill();
  }

  /** How long each side takes to walk: its share of the lap by length, and never less than 0.9 seconds. */
  const legTimes = (w) => w.legs.map((l) => Math.max(0.9, (LAP * l.length) / w.perimeter));
  const ease = (f) => f * f * (3 - 2 * f);

  /** Where the walk is, `time` seconds after it set off: the distance walked, and whether it's home. */
  function where(w, time) {
    const times = legTimes(w);
    let left = time;
    for (let k = 0; k < 3; k++) {
      const leg = w.legs[k];
      if (left < times[k]) return { s: leg.start + leg.length * ease(left / times[k]) };
      left -= times[k];
      if (left < PAUSE && k < 2) return { s: leg.start + leg.length };
      if (k < 2) left -= PAUSE;
    }
    return { s: w.perimeter, home: true, over: left >= PAUSE + HOLD };
  }

  /** The walker, the arrows it has left behind, and at home, how far its arrow has turned. */
  function drawWalk(ctx, v, m, at, words) {
    const w = m.walk;
    const size = Math.min(0.32 * m.shortest, 38 / v.R);
    for (let k = 1; k < FOOTPRINTS; k++) {
      const s = (w.perimeter * k) / FOOTPRINTS;
      if (s > at.s) break;
      const a = G.arrowAt(w, s);
      drawArrow(ctx, v, a.position, a.arrow, size * 0.8, 'rgba(111, 227, 196, 0.45)', 1.5);
    }
    const first = G.arrowAt(w, 0);
    drawArrow(ctx, v, first.position, first.arrow, size, 'rgba(255, 255, 255, 0.85)', 2, true);
    const now = G.arrowAt(w, at.s);
    if (at.home) {
      // The turn, as an arc from the arrow that set off to the arrow that came home.
      const turned = m.turned * DEG;
      ctx.strokeStyle = MINT;
      ctx.lineWidth = 1.5;
      trace(ctx, v, (f) => G.travel(first.position, G.rotate(first.position, first.arrow, f * turned), size * 0.7), 24);
      if (words) {
        const q = project(G.travel(first.position, G.rotate(first.position, first.arrow, turned / 2), size * 1.35), v);
        ctx.font = '700 14px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (q.z > 0) label(ctx, turnText(m), q.x, q.y, MINT);
      }
    }
    drawArrow(ctx, v, now.position, now.arrow, size, MINT, 3);
    const q = project(now.position, v);
    if (q.z >= 0) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0a0e15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 4.5, 0, TAU);
      ctx.fill();
      ctx.stroke();
    }
  }

  /** The ball and everything on it. */
  function paint(ctx, v, m, words) {
    drawBall(ctx, v);
    drawGrid(ctx, v);
    drawTriangle(ctx, v, m);
    drawAngles(ctx, v, m, words);
  }

  function walkNow(m) {
    return reduced ? { s: m.walk.perimeter, home: true } : where(m.walk, lap.time);
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.direction = 'ltr'; // the picture and its sums keep their direction on right-to-left pages too
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const L = layout(width, height);
    const v = viewFor(L.cx, L.cy, L.base, shown(), width, height);
    const m = measure(s);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, L.floor);
    ctx.clip();
    paint(ctx, v, m, true);
    const walking = !movingCorner();
    const at = walkNow(m);
    if (walking) drawWalk(ctx, v, m, at, true);
    drawHandles(ctx, v, m);
    ctx.restore();

    // The surprise, in words: the angle sum, and how far past 180° it is.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const line = sumLine(m),
      largest = L.narrow ? 20 : 22;
    ctx.font = `700 ${largest}px system-ui, sans-serif`;
    const fit = Math.min(largest, Math.floor((largest * L.words) / ctx.measureText(line).width));
    ctx.font = `700 ${Math.max(13, fit)}px system-ui, sans-serif`;
    label(ctx, line, 14, L.narrow ? 28 : 32, '#f5f1e6');
    ctx.font = '600 14px system-ui, sans-serif';
    label(ctx, t.more(extraText(m)), 14, L.narrow ? L.caption - 20 : 54, GOLD);

    ctx.font = '13px system-ui, sans-serif';
    const caption = !walking ? '' : at.home ? t.home(turnText(m)) : t.walking;
    label(ctx, caption, 14, L.caption, at.home ? MINT : SKY);
    if (camera.zoom > 1.5) {
      const zoom = t.zoomed(Math.round(camera.zoom).toLocaleString(W.numberLocale));
      ctx.textAlign = 'right';
      // Top right, or on a narrow picture beside the walk's news if it fits, else just above it.
      const clash = 14 + ctx.measureText(caption).width + 16 + ctx.measureText(zoom).width > width - 14;
      label(ctx, zoom, width - 14, !L.narrow ? 32 : clash ? L.caption - 40 : L.caption, SKY);
    }
    if (L.chart) drawChart(ctx, L.chart, m);
  }

  // Every triangle made in this visit, as its share of the ball and its extra: they all fall on one line.
  const tried = [];
  function remember(m) {
    const last = tried[tried.length - 1];
    if (last && Math.abs(last.share - m.share) < 0.002 && Math.abs(last.extra - m.extra) < 1) return;
    tried.push({ share: m.share, extra: m.extra });
    if (tried.length > 80) tried.shift();
  }

  /** The chart under the ball: extra against share of the ball, the line extra = share × 720°, and the dots. */
  function drawChart(ctx, box, m) {
    const X = (share) => box.x + (share / 0.5) * box.w,
      Y = (extra) => box.y + box.h - (extra / 360) * box.h;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.font = '600 14px system-ui, sans-serif';
    label(ctx, t.chart.title, box.x - 20, box.y - 16, '#f5f1e6');
    ctx.strokeStyle = 'rgba(160, 190, 220, 0.3)';
    ctx.lineWidth = 1;
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#a9b6c3';
    for (const f of [0, 0.5, 1]) {
      const x = box.x + f * box.w,
        y = box.y + box.h - f * box.h;
      ctx.beginPath();
      ctx.moveTo(box.x, y);
      ctx.lineTo(box.x + box.w, y);
      ctx.moveTo(x, box.y);
      ctx.lineTo(x, box.y + box.h);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(t.degrees(number(360 * f, 0)), box.x - 6, y + 4);
      ctx.textAlign = 'center';
      ctx.fillText(t.percent(number(50 * f, 0)), x, box.y + box.h + 16);
    }
    ctx.fillText(t.chart.across, box.x + box.w / 2, box.y + box.h + 34);
    ctx.save();
    ctx.translate(box.x - 42, box.y + box.h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(t.chart.up, 0, 0);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255, 199, 90, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    ctx.lineTo(X(0.5), Y(360));
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 227, 166, 0.55)';
    for (const p of tried) {
      ctx.beginPath();
      ctx.arc(X(p.share), Y(p.extra), 3, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = GOLD;
    ctx.strokeStyle = '#0a0e15';
    ctx.beginPath();
    ctx.arc(X(m.share), Y(m.extra), 6, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }

  function preview(ctx, width, height) {
    ctx.direction = 'ltr';
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const m = measure(presetSettings[0]);
    const v = viewFor(width / 2, height / 2, height * 0.44, VIEWS[0], width, height);
    paint(ctx, v, m, false);
    drawWalk(ctx, v, m, { s: m.walk.perimeter, home: true }, false);
  }

  // ---------- the walk and the controls ----------

  const lap = { time: 0, home: false, told: false }; // time into this walk; home: it has come home at least once
  let grab = null, // { corner } or { ball } while dragging
    hover = -1, // the corner under the mouse
    picked = -1, // the corner the arrow keys move
    keyboard = false, // number the corners while the keyboard is in use
    shape = null; // while sliding the size: the centre and directions of the corners, kept exact
  const movingCorner = () => grab?.corner !== undefined;

  function restartWalk() {
    lap.time = 0;
    lap.home = reduced;
    lap.told = false;
  }

  function changed(stage) {
    remember(measure(stage.settingsFor('globe')));
    restartWalk();
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
  }

  function step(dt, s, stage) {
    swayTime += dt;
    glide(dt);
    if (reduced || movingCorner()) return;
    lap.time += dt;
    const m = measure(s);
    const at = where(m.walk, lap.time);
    if (at.home && !lap.home) {
      lap.home = true;
      stage.sync();
    }
    if (at.home && !lap.told) {
      lap.told = true;
      W.announce(t.cameHome(turnText(m), degrees(m.rounded.total, m.digits)));
    }
    if (at.over) lap.time = 0; // and round again
  }

  const presetIndex = (s) =>
    presetSettings.findIndex((p) => KEYS.every((k) => p[k + 'Lat'] === s[k + 'Lat'] && p[k + 'Lon'] === s[k + 'Lon']));

  /** The view that suits a triangle: its preset's, or looking straight at it from close enough to see it well. */
  function fitView(s) {
    const i = presetIndex(s);
    if (i >= 0) return VIEWS[i];
    const m = measure(s);
    if (!m.centre) return camera;
    const [lat, lon] = G.latLon(m.centre);
    return { lat, lon, zoom: zoomFor(m.radius) };
  }

  function controls(s) {
    const m = measure(s);
    return (
      `<div class="control wide"><label for="globe-size">${t.size}<output id="globe-size-value" aria-live="off">${t.shareOf(percent(m.share))}</output></label>` +
      `<input id="globe-size" type="range" min="${SMALLEST}" max="100" step="1" value="${sizeValue(m.radius)}">` +
      `<p>${t.sizeHint}</p></div>` +
      // Not a live region: it is rebuilt on every change. The walk's result is announced when it comes home.
      '<div class="wide readout globe-readout" id="globe-readout"></div>'
    );
  }

  function bindControls(panel, s, stage) {
    const slider = $('globe-size');
    slider.addEventListener('input', () => {
      if (!shape) {
        const c = G.circle(cornersOf(s));
        if (!c) return;
        shape = { centre: c.centre, directions: cornersOf(s).map((p) => G.heading(c.centre, p)) };
      }
      const radius = sizeRadius(Number(slider.value));
      store(
        s,
        shape.directions.map((d) => G.travel(shape.centre, d, radius)),
      );
      const zoom = zoomFor(radius);
      if (zoom > 1.05) {
        const [lat, lon] = G.latLon(shape.centre);
        go({ lat, lon, zoom }, !stage.playing);
      } else go({ ...camera, zoom: 1 }, !stage.playing);
      swaying = swaying && zoom <= 1.05;
      changed(stage);
    });
    // Anything else that changes the triangle starts a new shape for the slider.
    slider.addEventListener('change', () => (shape = null));
  }

  function readouts(s) {
    const m = measure(s);
    $('scene-status').textContent = t.status(degrees(m.rounded.total, m.digits));
    const i = presetIndex(s);
    $('scene-name').textContent = i >= 0 ? t.presets[i].name : t.yourOwn;
    const slider = $('globe-size');
    if (slider) {
      if (!shape) slider.value = sizeValue(m.radius); // not while it is being slid
      const text = t.shareOf(percent(m.share));
      $('globe-size-value').textContent = text;
      slider.setAttribute('aria-valuetext', text);
    }
    const box = $('globe-readout');
    if (!box) return;
    const row = (name, value) => `<span>${name}</span><strong>${value}</strong>`;
    box.innerHTML =
      `<div class="globe-sum"><span>${t.readout.angles}</span><strong>${sumLine(m)}</strong></div>` +
      '<div class="globe-rows">' +
      row(t.readout.extra, extraText(m)) +
      row(t.readout.share, percent(m.share)) +
      row(t.readout.turned, lap.home ? turnText(m) : t.onItsWay) +
      `</div><p class="globe-rule">${t.rule(percent(m.share), extraText(m))}</p>`;
  }

  // ---------- the room ----------

  const octant = [G.vec(90, 0), G.vec(0, 0), G.vec(0, 90)];
  const tilt = Math.atan(Math.SQRT1_2) / DEG; // 35.26°: the latitude of a cube's corner, and of the octant's middle
  const presetSettings = [
    octant,
    [G.vec(tilt, 45), G.vec(-tilt, -45), G.vec(-tilt, 135)],
    G.resize(octant, 2 * DEG),
  ].map((tri) => store({}, tri));
  const VIEWS = [
    { lat: 30, lon: 45, zoom: 1 },
    { lat: -tilt, lon: 45, zoom: 1 },
    { lat: tilt, lon: 45, zoom: zoomFor(2 * DEG) },
  ];
  const badges = ['270°', '360°', '≈180°'];
  const range = {};
  for (const k of KEYS) {
    range[k + 'Lat'] = [-90, 90];
    range[k + 'Lon'] = [-180, 180];
  }

  /** The corner near a screen position, or −1. */
  function cornerNear(x, y, v, s) {
    let best = -1,
      bestD = 24;
    cornersOf(s).forEach((p, i) => {
      const q = project(p, v);
      const d = Math.hypot(q.x - x, q.y - y);
      if (q.z >= 0 && q.y < v.floor && d < bestD) {
        best = i;
        bestD = d;
      }
    });
    return best;
  }
  const onBall = (x, y, v) => y < v.floor && Math.hypot(x - v.cx, y - v.cy) <= v.R;

  W.defineRoom({
    id: 'globe',
    symbol: '◬',
    theme: 'shape',
    added: '2026-09-30',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#1c2a3d', border: GOLD, color: PALE },

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

    // The three corners, as latitude and longitude in degrees.
    defaults: { ...presetSettings[0] },
    ranges: range,
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Girard_Albert',
        color: GOLD,
        sketch: {
          hairStyle: 'long',
          hair: '#3a2a1f',
          skin: '#edcba9',
          beard: 'goatee',
          moustache: true,
          backdrop: '#2a2a3d',
        },
      },
      {
        ...t.guests[1],
        bio: 'Gauss',
        color: '#9fc4ec',
        sketch: { hairStyle: 'short', hair: '#e4e0d8', skin: '#f0cfb2', brows: 'bold', backdrop: '#1d2b3c' },
      },
      {
        ...t.guests[2],
        bio: 'Levi-Civita',
        color: MINT,
        sketch: {
          hairStyle: 'receding',
          hair: '#2d2622',
          skin: '#eac4a2',
          beard: 'short',
          moustache: true,
          glasses: 'round',
          backdrop: '#1c3330',
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
      if (!G.usable(cornersOf(s))) Object.assign(s, presetSettings[0]);
      shape = null;
      grab = null;
      picked = -1;
      restartWalk();
      if (!keepView) {
        go(fitView(s), true);
        if (camera.zoom <= 1.05) rock();
        else swaying = false;
      }
      keepView = false;
      remember(measure(s));
      stage.sync();
    },
    onPreset(s, stage) {
      shape = null;
      remember(measure(s));
      restartWalk();
      go(fitView(s), !stage.playing);
      rock();
    },
    action(s, stage) {
      restartWalk();
      stage.sync();
      stage.draw();
      if (reduced) {
        const m = measure(s);
        W.announce(t.cameHome(turnText(m), degrees(m.rounded.total, m.digits)));
      }
    },
    reset(s, stage) {
      restartWalk();
      go(fitView(s), !stage.playing);
      rock();
      stage.sync();
    },

    pointer: {
      // Touches on the ball turn it or move a corner; elsewhere they scroll the page.
      drag(p, s, stage) {
        const v = currentView(stage),
          x = p.x * stage.width,
          y = p.y * stage.height;
        return cornerNear(x, y, v, s) >= 0 || onBall(x, y, v);
      },
      down(p, s, stage) {
        keyboard = false;
        const v = currentView(stage),
          x = p.x * stage.width,
          y = p.y * stage.height;
        const i = cornerNear(x, y, v, s);
        if (i >= 0) {
          grab = { corner: i };
          picked = -1;
          shape = null;
        } else if (onBall(x, y, v)) {
          grab = { ball: true };
          settle();
        }
        stage.draw();
      },
      move(p, { dragging, dx, dy, mouse }, s, stage) {
        const v = currentView(stage),
          x = p.x * stage.width,
          y = p.y * stage.height;
        const canvas = $('scene-canvas');
        if (mouse && !dragging) {
          const was = hover;
          hover = cornerNear(x, y, v, s);
          canvas.classList.toggle('globe-corner', hover >= 0);
          canvas.classList.toggle('globe-ball', hover < 0 && onBall(x, y, v));
          if (was !== hover) stage.draw();
        }
        if (!dragging || !grab) return;
        if (grab.ball) {
          camera.lon = wrap(camera.lon - dx / v.R / DEG);
          camera.lat = clamp(camera.lat + dy / v.R / DEG, -89, 89);
          stage.draw();
          return;
        }
        const tri = cornersOf(s);
        tri[grab.corner] = unproject(x, y, v);
        if (!G.usable(tri)) return;
        store(s, tri);
        changed(stage);
      },
      up() {
        const s = W.stage.settingsFor('globe');
        if (movingCorner() && s) {
          restartWalk();
          // A triangle made much bigger or smaller: come closer or step back to see it.
          const view = fitView(s);
          if (Math.abs(Math.log(view.zoom / camera.zoom)) > 0.2) {
            settle();
            go(view, !W.stage.playing);
          }
        }
        grab = null;
        W.stage.draw();
      },
      leave() {
        hover = -1;
        $('scene-canvas').classList.remove('globe-corner', 'globe-ball');
      },
      escape() {
        if (picked < 0) return;
        picked = -1;
        W.announce(t.letGo);
        W.stage.draw();
      },
      /** The arrow keys move the picked corner, or turn the ball. */
      arrow(dx, dy, s, stage) {
        keyboard = true;
        const v = currentView(stage);
        if (picked >= 0) {
          const tri = cornersOf(s),
            p = tri[picked],
            k = 10 / v.R;
          const q = G.unit([0, 1, 2].map((i) => p[i] + k * (dx * v.across[i] - dy * v.up[i])));
          tri[picked] = q;
          if (G.dot(q, v.out) <= 0.02 || !G.usable(tri)) return;
          shape = null;
          store(s, tri);
          changed(stage);
          return;
        }
        settle();
        camera.lon = wrap(camera.lon - (dx * 8) / camera.zoom);
        camera.lat = clamp(camera.lat + (dy * 8) / camera.zoom, -89, 89);
      },
      key(e, s, stage) {
        const n = ['Digit1', 'Digit2', 'Digit3'].includes(e.code) ? Number(e.code.slice(5)) : Number(e.key);
        if (n >= 1 && n <= 3) {
          keyboard = true;
          picked = n - 1;
          W.announce(t.picked(n));
          return true;
        }
        if (e.key === 'Enter') {
          restartWalk();
          stage.sync();
          return true;
        }
        return false;
      },
    },

    extraSettings: () => ({ viewLat: camera.lat, viewLon: camera.lon, viewZoom: camera.zoom }),
    restore(saved) {
      const ok = (x) => typeof x === 'number' && Number.isFinite(x);
      if (!ok(saved.viewLat) || !ok(saved.viewLon) || !ok(saved.viewZoom)) return;
      go({ lat: saved.viewLat, lon: saved.viewLon, zoom: saved.viewZoom }, true);
      swaying = false;
      keepView = true;
    },
  });
})();
