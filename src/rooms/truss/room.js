/* Room · The stubborn triangle: a bridge of bars and pins that folds until it's braced, and the force in every bar. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.truss;
  const t = W.text('truss');
  const reduced = W.prefersReducedMotion();

  const SPEED = 0.9; // the truck's speed, in squares a second
  const PARK = 0.8; // where the truck waits, in squares beyond each end of the bridge
  const WAIT = 0.6; // seconds it waits before driving back
  const FALL_LIMIT = 0.8; // a falling bridge stops once a joint has moved this far (in squares)
  const FALL_LONGEST = 2.5; // or after this many seconds, if it can only sag
  const HOLD = 2.4; // seconds a fallen bridge lies there before it springs back
  const SPRING = 0.35; // seconds to spring back up
  const BRACE_EVERY = 0.45; // seconds between the opening's diagonals
  const WOBBLE = 0.12; // how far a floppy bridge sways on its own (in squares)
  const WOBBLE_PERIOD = 1.8;
  const ROAD = 7; // the road runs this many pixels above the top joints
  const COLOURS = {
    squeezed: '#4f8fe6',
    stretched: '#e8604f',
    nothing: '#6b7684',
    steel: '#b4c0cc',
    ghost: '#3b4a5c',
    rigid: '#7fd18b',
    floppy: '#f0a04b',
  };

  // The bridge as the room shows it: rebuilt whenever the frame (settings.panels and settings.bars) changes.
  let n = 0,
    mask = -1,
    order = [], // the bars' places, in the order they were put in
    info = null, // what the model says about the frame
    list = [], // every place a bar can go
    bars = [], // the bars, as [a, b] joint pairs, in `order`
    spare = new Set(),
    rest = [], // the joints on the pegboard
    pose = [], // where the joints are now (moved when the bridge sways or falls)
    lengths = [],
    holdFast = []; // the pin, the roller, and any peg with no bar on it
  // Motion.
  let phase = 'stand', // 'stand', 'fall', 'down' (fallen) or 'spring' (back up)
    phaseTime = 0,
    fallSpeed = 0,
    going = null, // the way a falling bridge is going
    from = null, // the fallen pose, while springing back
    swayClock = 0,
    pulse = 0, // a glow when the bridge locks
    demo = null, // the opening's bracing, once the bridge of squares has fallen
    foldTold = false;
  const truck = { x: -PARK, dir: 1, wait: 0 };
  // Input and words.
  let layout = null,
    hover = -1, // the place under the mouse
    aim = null, // the keyboard's place
    pending = -1, // the place a press started on, switched when the press ends as a tap
    grabbed = false, // dragging the truck
    base = null, // what "Start again" goes back to
    told = '',
    shown = '';

  // ------------------------------------------------------------- the frame

  /** Rebuild the bridge when the frame has changed. Places the bridge doesn't have (from a link) are dropped. */
  function prepare(s) {
    const room = 2 ** (5 * s.panels + 1);
    if (s.bars >= room) s.bars %= room;
    if (s.panels === n && s.bars === mask) return;
    const resized = s.panels !== n;
    n = s.panels;
    mask = s.bars;
    list = M.places(n);
    const now = M.barsOf(n, mask);
    order = resized ? now : [...order.filter((i) => M.has(mask, i)), ...now.filter((i) => !order.includes(i))];
    info = M.analyse(n, mask, order);
    foldTold = false;
    spare = new Set(info.spare);
    bars = order.map((i) => [list[i].a, list[i].b]);
    rest = M.joints(n);
    lengths = M.lengths(rest, bars);
    const used = new Set(bars.flat());
    holdFast = [...M.held(n)];
    for (let i = 0; i <= n; i++)
      if (!used.has(M.bottom(n, i))) holdFast.push(2 * M.bottom(n, i), 2 * M.bottom(n, i) + 1);
    standUp();
    truck.x = clamp(truck.x, -PARK, n + PARK);
  }

  /** Forget the order bars went in: a frame from a link, a preset or a fresh start, in its own order. */
  function fresh(s) {
    n = 0;
    mask = -1;
    prepare(s);
  }

  function standUp() {
    pose = rest.map((p) => [...p]);
    phase = 'stand';
    phaseTime = 0;
    going = null;
    from = null;
  }

  const onBridge = () => truck.x >= 0 && truck.x <= n;
  const sceneName = () => (demo ? t.sceneNames.bracing : t.sceneNames[M.nameOf(n, mask) || 'own']);
  /** The panels with no diagonal at all. */
  const unbraced = () => [...Array(n).keys()].filter((k) => !M.has(mask, M.rise(n, k)) && !M.has(mask, M.fall(n, k)));
  /** A panel's diagonal in a Pratt truss: falling towards the middle. */
  const prattDiagonal = (k) => (k < n / 2 ? M.fall(n, k) : M.rise(n, k));

  /** The force in every bar for the truck where it is, or null (floppy, or nothing on the bridge). */
  function forces() {
    if (!info.rigid || !onBridge()) return null;
    return M.forces(rest, bars, M.held(n), M.truckLoads(n, truck.x))?.tension ?? null;
  }

  // ---------------------------------------------------------------- motion

  /** What leans on the bridge: the truck where the road meets the joints, a little weight, a nudge its way. */
  function push(sideways) {
    const f = M.truckLoads(n, truck.x);
    const used = new Set(bars.flat());
    for (let j = 0; j < rest.length; j++) {
      if (!used.has(j)) continue;
      f[2 * j] += sideways * truck.dir;
      f[2 * j + 1] -= 0.15;
    }
    return f;
  }

  /** How far the joint that has moved most has gone, in squares. */
  const moved = () => Math.max(...pose.map((p, j) => Math.hypot(p[0] - rest[j][0], p[1] - rest[j][1])));

  /** One frame of a floppy bridge: it sways, or falls under the truck, lies there, and springs back. */
  function moveBridge(dt, s) {
    if (info.rigid) return;
    if (phase === 'stand') {
      if (onBridge()) {
        phase = 'fall';
        phaseTime = 0;
        fallSpeed = 0.5;
      } else if (!demo) {
        // On its own a floppy bridge sways gently, back and forth along the way a sideways nudge moves it,
        // found afresh from the pegboard each frame so it never drifts.
        swayClock += dt;
        const target = WOBBLE * Math.sin((2 * Math.PI * swayClock) / WOBBLE_PERIOD);
        pose = rest.map((p) => [...p]);
        const nudge = rest.flatMap(() => [Math.sign(target), 0]);
        if (target) M.follow(pose, bars, lengths, holdFast, nudge, Math.abs(target), 3);
      }
    }
    if (phase === 'fall') {
      phaseTime += dt;
      fallSpeed = Math.min(3.2, fallSpeed + 4 * dt);
      going = M.follow(pose, bars, lengths, holdFast, push(0.1), fallSpeed * dt, 1, going);
      if (!going || moved() >= FALL_LIMIT || phaseTime >= FALL_LONGEST) {
        phase = 'down';
        phaseTime = 0;
        // Said once for each set of bars, not every time the truck tries again.
        if (!foldTold) W.announce(t.folded);
        foldTold = true;
      }
    } else if (phase === 'down') {
      phaseTime += dt;
      if (phaseTime >= (s.auto ? 1.3 : HOLD)) {
        phase = 'spring';
        phaseTime = 0;
        from = pose.map((p) => [...p]);
      }
    } else if (phase === 'spring') {
      phaseTime += dt;
      const k = Math.min(1, phaseTime / SPRING),
        e = 1 - (1 - k) ** 3;
      pose = from.map((p, j) => [p[0] + (rest[j][0] - p[0]) * e, p[1] + (rest[j][1] - p[1]) * e]);
      if (k >= 1) {
        standUp();
        // The truck is back where it set off, to try again (or, in the opening, to wait while the bridge is braced).
        truck.x = truck.dir > 0 ? -PARK : n + PARK;
        truck.wait = WAIT;
        if (s.auto) demo = { clock: 0 };
      }
    }
  }

  function moveTruck(dt) {
    if (grabbed || phase !== 'stand' || demo) return;
    if (truck.wait > 0) {
      truck.wait -= dt;
      return;
    }
    truck.x += truck.dir * SPEED * dt;
    if (truck.x >= n + PARK || truck.x <= -PARK) {
      truck.x = clamp(truck.x, -PARK, n + PARK);
      truck.dir = -truck.dir;
      truck.wait = WAIT;
    }
  }

  /** The opening: after the bridge of squares falls, its diagonals go in one by one, and then the truck drives on. */
  function brace(dt, s, stage) {
    demo.clock += dt;
    if (demo.clock < BRACE_EVERY) return;
    demo.clock = 0;
    const k = unbraced()[0];
    if (k === undefined) {
      demo = null;
      s.auto = false;
      truck.wait = 0.5;
      return;
    }
    s.bars = M.toggle(s.bars, prattDiagonal(k));
    prepare(s);
    if (info.rigid) pulse = 1;
    stage.sync();
  }

  /**
   * With reduced motion nothing moves by itself, so a floppy bridge with the truck on it is shown already fallen.
   */
  function still(s) {
    if (!reduced || W.stage.playing || info.rigid || !onBridge()) return;
    for (let k = 0; k < 400 && phase !== 'down'; k++) moveBridge(1 / 30, s);
  }

  /** The truck at its starting place, the bridge standing; with reduced motion, the truck stands in the middle. */
  function startScene(s) {
    standUp();
    swayClock = 0;
    demo = null;
    pulse = 0;
    truck.dir = 1;
    truck.x = reduced ? n / 2 : -PARK;
    truck.wait = reduced ? 0 : 0.6;
    still(s);
  }

  // --------------------------------------------------------------- layout

  /**
   * Where the bridge goes: centred, with room on each bank for the truck to wait, the road a little below the words
   * at the top, and the river below. On a desktop the whole bridge stays above the fold; a tall picture also gets
   * the square and the triangle underneath.
   */
  function measure(width, height, panels, picture = false) {
    const narrow = width < 600;
    const band = picture ? 0 : narrow ? 42 : 68;
    const across = picture && width > height * 1.4 ? height : width; // the map's picture crops to its middle square
    // A picture has no truck waiting on the banks, so the bridge fills more of it.
    const P = picture
      ? Math.min(across / (panels + 0.9), (height - 8) / 2.1)
      : Math.max(24, Math.min(140, across / (panels + 2.3), (height - band - 8) / 2.6));
    const x0 = (width - panels * P) / 2;
    const own = band + 0.5 * P + ROAD + 2.04 * P; // the scene's own height, from the top to the river's far bank
    const roomy = !picture && !narrow && height - own >= 210;
    // Without the square and the triangle below, the scene spreads down the picture and the river reaches the bottom.
    const road = picture
      ? (height - 1.9 * P) / 2 + 0.4 * P
      : band + 0.5 * P + (roomy ? 0 : Math.max(0, (height - own) * 0.3));
    const yt = road + ROAD,
      yb = yt + P;
    const river = yb + 0.72 * P;
    const bottom = roomy || picture ? river + 0.32 * P : height;
    const primer = roomy ? { x: 14, y: bottom + 22, w: width - 28, h: Math.min(230, height - bottom - 36) } : null;
    return { narrow, band, P, x0, road, yt, yb, river, bottom, primer, width, height };
  }

  /** A joint's place on the canvas (the model's y points up). */
  const screen = (L, [x, y]) => [L.x0 + x * L.P, L.yb - y * L.P];

  /** Where the truck is drawn, and its tilt: on a bank, or on the road over the bridge's top joints as they are. */
  function truckSpot(L, x, joints) {
    if (x < 0 || x > n) return { x: L.x0 + x * L.P, y: L.road, angle: 0 };
    const k = Math.min(Math.floor(x), n - 1),
      f = x - k;
    const [ax, ay] = screen(L, joints[M.top(n, k)]),
      [bx, by] = screen(L, joints[M.top(n, k + 1)]);
    return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f - ROAD, angle: Math.atan2(by - ay, bx - ax) };
  }

  const truckLength = (L) => Math.min(0.62 * L.P, 66);

  /** Distance from a point to a segment. */
  function toSegment(px, py, [ax, ay], [bx, by]) {
    const dx = bx - ax,
      dy = by - ay;
    const k = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    return Math.hypot(px - ax - k * dx, py - ay - k * dy);
  }

  /** The place under a canvas point (0 to 1 across), or −1. */
  function placeAt(p, stage) {
    if (!layout) return -1;
    const px = p.x * stage.width,
      py = p.y * stage.height;
    let best = -1,
      nearest = Math.max(10, 0.16 * layout.P);
    list.forEach((place, i) => {
      const d = toSegment(px, py, screen(layout, pose[place.a]), screen(layout, pose[place.b]));
      if (d < nearest) [best, nearest] = [i, d];
    });
    return best;
  }

  /** Is a canvas point on the truck? */
  function onTruck(p, stage) {
    if (!layout) return false;
    const spot = truckSpot(layout, truck.x, pose);
    const L = truckLength(layout);
    return (
      Math.abs(p.x * stage.width - spot.x) < L / 2 + 8 &&
      Math.abs(p.y * stage.height - (spot.y - L * 0.22)) < L * 0.3 + 10
    );
  }

  /** From the keyboard's place, the nearest place in an arrow's direction (screen directions: down is +y). */
  function nextPlace(dx, dy) {
    const middle = (i) => {
      const { a, b } = list[i];
      return [(rest[a][0] + rest[b][0]) / 2, -(rest[a][1] + rest[b][1]) / 2];
    };
    if (aim === null || aim >= list.length) {
      // The first press lands on a diagonal near the middle, if there is one place to land on.
      const centre = [n / 2 - 0.5, -0.5];
      aim = 0;
      list.forEach((_, i) => {
        const [x, y] = middle(i),
          [ax, ay] = middle(aim);
        if (Math.hypot(x - centre[0], y - centre[1]) < Math.hypot(ax - centre[0], ay - centre[1])) aim = i;
      });
      return;
    }
    const [x0, y0] = middle(aim);
    let best = aim,
      score = Infinity;
    list.forEach((_, i) => {
      const [x, y] = middle(i);
      const along = (x - x0) * dx + (y - y0) * dy,
        across = Math.abs((x - x0) * dy - (y - y0) * dx);
      if (along < 0.2) return;
      const s = along + 2 * across;
      if (s < score) [best, score] = [i, s];
    });
    aim = best;
  }

  // -------------------------------------------------------------- drawing

  function draw(ctx, s, stage) {
    prepare(s);
    const { width, height } = stage;
    layout = measure(width, height, n);
    const tension = s.forces ? forces() : null;
    scene(ctx, layout, { joints: pose, tension, truckX: truck.x, dir: truck.dir, marks: true });
    words(ctx, layout, s);
    if (layout.primer) primer(ctx, layout.primer, stage.clock);
    const panelKey = $('truss-key');
    if (panelKey && panelKey.hidden !== !layout.narrow) panelKey.hidden = !layout.narrow;
    report(s, tension);
  }

  /** The banks, the river, the bridge and the truck. */
  function scene(ctx, L, { joints, tension, truckX, dir, marks }) {
    const { width, height, P, x0 } = L;
    const sky = ctx.createLinearGradient(0, 0, 0, L.bottom);
    sky.addColorStop(0, '#0a0e15');
    sky.addColorStop(1, '#101a28');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, L.primer ? L.bottom : height);
    pegboard(ctx, L);
    // The river, between the banks.
    ctx.fillStyle = '#0f2236';
    ctx.fillRect(0, L.river, width, L.bottom - L.river);
    ctx.strokeStyle = 'rgba(143, 184, 240, 0.25)';
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 3; k++) {
      const y = L.river + (k + 1) * ((L.bottom - L.river) / 4);
      ctx.beginPath();
      for (let x = x0 - P; x <= x0 + (n + 1) * P; x += 6) ctx.lineTo(x, y + Math.sin(x / 9 + k * 2) * 1.5);
      ctx.stroke();
    }
    banks(ctx, L);
    // The road on each bank, and over the bridge's top joints.
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4b5868';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, L.road);
    ctx.lineTo(x0 - 0.12 * P, L.road);
    ctx.moveTo(x0 + n * P + 0.12 * P, L.road);
    ctx.lineTo(width, L.road);
    ctx.stroke();
    // Places with no bar: faint dashes, to tap.
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = COLOURS.ghost;
    list.forEach((place, i) => {
      if (M.has(mask, i)) return;
      line(ctx, screen(L, joints[place.a]), screen(L, joints[place.b]));
    });
    ctx.setLineDash([]);
    if (marks) highlights(ctx, L, joints);
    barsOf(ctx, L, joints, tension, marks);
    // The road over the bridge.
    ctx.strokeStyle = '#5a6878';
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const [x, y] = screen(L, joints[M.top(n, i)]);
      ctx.lineTo(x, y - ROAD);
    }
    ctx.stroke();
    ctx.lineCap = 'butt';
    supports(ctx, L, joints);
    pins(ctx, L, joints);
    if (pulse > 0) {
      ctx.strokeStyle = `rgba(127, 209, 139, ${0.6 * pulse})`;
      ctx.lineWidth = 3;
      const pad = 10 + (1 - pulse) * 14;
      ctx.strokeRect(x0 - pad, L.yt - pad, n * P + 2 * pad, P + 2 * pad);
    }
    const spot = truckSpot(L, truckX, joints);
    drawTruck(ctx, spot, truckLength(L), dir);
  }

  /** A faint pegboard behind the bridge: a hole at every half square. */
  function pegboard(ctx, L) {
    ctx.fillStyle = '#1a2431';
    const step = L.P / 2;
    for (let x = L.x0 - step; x <= L.x0 + n * L.P + step + 1; x += step)
      for (let y = L.yb + step; y >= L.yt - step - 1; y -= step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, 2 * Math.PI);
        ctx.fill();
      }
  }

  /** The two banks, each with a ledge for the bridge to stand on. */
  function banks(ctx, L) {
    const { P, x0 } = L;
    const ledge = L.yb + 0.17 * P;
    const right = x0 + n * P;
    ctx.fillStyle = '#1a2330';
    ctx.strokeStyle = '#34465c';
    ctx.lineWidth = 2;
    for (const side of [-1, 1]) {
      const edge = side < 0 ? x0 : right;
      const at = (dx) => edge - side * dx; // dx > 0: under the bridge
      ctx.beginPath();
      ctx.moveTo(side < 0 ? 0 : L.width, L.road);
      ctx.lineTo(at(-0.12 * P), L.road);
      ctx.lineTo(at(-0.12 * P), ledge);
      ctx.lineTo(at(0.16 * P), ledge);
      ctx.lineTo(at(0.22 * P), L.river);
      ctx.lineTo(at(0.42 * P), L.bottom);
      ctx.lineTo(side < 0 ? 0 : L.width, L.bottom);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(side < 0 ? 0 : L.width, L.road);
      ctx.lineTo(at(-0.12 * P), L.road);
      ctx.lineTo(at(-0.12 * P), ledge);
      ctx.lineTo(at(0.16 * P), ledge);
      ctx.lineTo(at(0.22 * P), L.river);
      ctx.stroke();
    }
  }

  function line(ctx, [ax, ay], [bx, by]) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  /** The bars: steel, or coloured by what they carry, thicker for more; spare bars dashed; the busiest labelled. */
  function barsOf(ctx, L, joints, tension, labels) {
    let busiest = -1;
    if (tension) tension.forEach((v, k) => (busiest < 0 || Math.abs(v) > Math.abs(tension[busiest])) && (busiest = k));
    const scale = Math.max(0.6, L.P / 120);
    order.forEach((i, k) => {
      const place = list[i];
      const a = screen(L, joints[place.a]),
        b = screen(L, joints[place.b]);
      let colour = COLOURS.steel,
        width = 4.5 * scale;
      if (tension) {
        const v = tension[k];
        if (Math.abs(v) < M.QUIET) [colour, width] = [COLOURS.nothing, 2.5 * scale];
        else
          [colour, width] = [
            v < 0 ? COLOURS.squeezed : COLOURS.stretched,
            (2.5 + 8 * Math.min(Math.abs(v), 1.6)) * scale,
          ];
      }
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      if (spare.has(i)) ctx.setLineDash([7 * scale, 6 * scale]);
      line(ctx, a, b);
      ctx.setLineDash([]);
    });
    if (!tension || !labels) return;
    // "0" on the bars that carry nothing, and the busiest bar's load in truck weights: numbers, so left to right
    // on every page.
    ctx.font = `600 ${L.narrow ? 10 : 12}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'ltr';
    order.forEach((i, k) => {
      const v = tension[k];
      if (Math.abs(v) >= M.QUIET && k !== busiest) return;
      const place = list[i];
      const [ax, ay] = screen(L, joints[place.a]),
        [bx, by] = screen(L, joints[place.b]);
      const x = (ax + bx) / 2,
        y = (ay + by) / 2;
      const text = k === busiest ? t.times(number(Math.abs(v))) : number(0);
      const w = ctx.measureText(text).width + 8;
      ctx.fillStyle = k === busiest ? '#f3dca6' : '#0a0e15';
      roundRect(ctx, x - w / 2, y - 8, w, 16, 8);
      ctx.fill();
      ctx.fillStyle = k === busiest ? '#1d2230' : '#98aab7';
      ctx.fillText(text, x, y + 0.5);
    });
    ctx.textBaseline = 'alphabetic';
    ctx.direction = 'inherit';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /** The place under the mouse, and the keyboard's, as a soft glow. */
  function highlights(ctx, L, joints) {
    for (const [i, colour] of [
      [hover, 'rgba(255, 255, 255, 0.28)'],
      [aim ?? -1, 'rgba(240, 196, 60, 0.6)'],
    ]) {
      if (i < 0 || i >= list.length) continue;
      ctx.strokeStyle = colour;
      ctx.lineWidth = Math.max(12, 0.13 * L.P);
      ctx.lineCap = 'round';
      line(ctx, screen(L, joints[list[i].a]), screen(L, joints[list[i].b]));
    }
  }

  function pins(ctx, L, joints) {
    const r = clamp(L.P * 0.045, 3, 5.5);
    const used = new Set(bars.flat());
    joints.forEach((p, j) => {
      const [x, y] = screen(L, p);
      ctx.beginPath();
      ctx.arc(x, y, used.has(j) ? r : r * 0.6, 0, 2 * Math.PI);
      ctx.fillStyle = '#0a0e15';
      ctx.fill();
      ctx.strokeStyle = used.has(j) ? '#e8eef5' : '#4a586a';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  /** The pin (a triangle) under the left end and the roller (a triangle on wheels) under the right. */
  function supports(ctx, L, joints) {
    const h = 0.17 * L.P,
      w = 0.11 * L.P;
    ctx.fillStyle = '#8a96a3';
    for (const right of [false, true]) {
      // The roller rolls along its ledge with its joint.
      const [x, y] = screen(L, (right ? joints : rest)[M.bottom(n, right ? n : 0)]);
      const top = y + 3,
        foot = right ? y + h * 0.62 : y + h;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x - w, foot);
      ctx.lineTo(x + w, foot);
      ctx.closePath();
      ctx.fill();
      if (right)
        for (const dx of [-w * 0.55, w * 0.55]) {
          ctx.beginPath();
          ctx.arc(x + dx, foot + (y + h - foot) / 2, (y + h - foot) / 2, 0, 2 * Math.PI);
          ctx.fill();
        }
    }
  }

  /** A toy truck: a yellow cab at the front, a pale box behind, two wheels. */
  function drawTruck(ctx, { x, y, angle }, length, dir) {
    const h = length * 0.42,
      wheel = length * 0.11;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(dir, 1);
    ctx.fillStyle = '#d9dee5';
    roundRect(ctx, -length / 2, -h - wheel * 0.6, length * 0.66, h, 3);
    ctx.fill();
    ctx.fillStyle = '#f2c94c';
    roundRect(ctx, length * 0.18, -h * 0.78 - wheel * 0.6, length * 0.32, h * 0.78, 4);
    ctx.fill();
    ctx.fillStyle = '#9fd0f0';
    ctx.fillRect(length * 0.32, -h * 0.68 - wheel * 0.6, length * 0.13, h * 0.3);
    for (const wx of [-length * 0.3, length * 0.32]) {
      ctx.beginPath();
      ctx.arc(wx, -wheel, wheel, 0, 2 * Math.PI);
      ctx.fillStyle = '#1b222c';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(wx, -wheel, wheel * 0.45, 0, 2 * Math.PI);
      ctx.fillStyle = '#8a96a3';
      ctx.fill();
    }
    ctx.restore();
  }

  /** The verdict and Maxwell's count at the top; on wider screens, the colour key on the right. */
  function words(ctx, L, s) {
    const pad = 12;
    const small = L.narrow;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${small ? 11 : 12}px system-ui, sans-serif`;
    const word = info.rigid ? t.verdict.rigid : t.verdict.floppy;
    const w = ctx.measureText(word).width + 16,
      h = small ? 18 : 22;
    ctx.fillStyle = info.rigid ? 'rgba(127, 209, 139, 0.18)' : 'rgba(240, 160, 75, 0.18)';
    roundRect(ctx, pad, pad, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = info.rigid ? COLOURS.rigid : COLOURS.floppy;
    ctx.fillText(word, pad + 8, pad + h / 2 + 0.5);
    ctx.font = `500 ${small ? 13 : 15}px system-ui, sans-serif`;
    ctx.fillStyle = '#e8eef5';
    const right = small ? L.width - pad : L.width - 300;
    ctx.fillText(reason(), pad + w + 8, pad + h / 2 + 0.5, right - pad - w - 8);
    ctx.font = `400 ${small ? 11 : 13}px system-ui, sans-serif`;
    ctx.fillStyle = '#98aab7';
    ctx.fillText(t.count(info.joints, info.needed, info.bars), pad, pad + h + (small ? 11 : 16), right - pad);
    ctx.textBaseline = 'alphabetic';
    if (!small && s.forces) key(ctx, L.width - 288, pad);
  }

  /** Why the bridge is rigid or floppy, in a few words. */
  function reason() {
    if (info.rigid) return t.reason.rigid(info.bars - info.needed);
    if (info.verdict === 'short') return t.reason.short(info.needed - info.bars);
    return t.reason.spread;
  }

  /** What the colours mean. */
  function key(ctx, x, y) {
    const items = [
      ['squeezed', COLOURS.squeezed, false],
      ['stretched', COLOURS.stretched, false],
      ['nothing', COLOURS.nothing, false],
      ['spare', COLOURS.steel, true],
    ];
    ctx.font = '400 12px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    items.forEach(([name, colour, dashed], k) => {
      const cx = x + (k % 2) * 144,
        cy = y + 9 + Math.floor(k / 2) * 22;
      ctx.strokeStyle = colour;
      ctx.lineWidth = name === 'nothing' ? 2.5 : 5;
      ctx.lineCap = 'round';
      if (dashed) ctx.setLineDash([5, 5]);
      line(ctx, [cx, cy], [cx + 18, cy]);
      ctx.setLineDash([]);
      ctx.fillStyle = '#dfe7ef';
      ctx.fillText(t.key[name], cx + 26, cy + 0.5, 112);
    });
    ctx.lineCap = 'butt';
    ctx.textBaseline = 'alphabetic';
  }

  /** On tall pictures: a square that keeps folding beside a triangle that won't, with Maxwell's count for each. */
  function primer(ctx, box, clock) {
    ctx.fillStyle = '#0e141d';
    roundRect(ctx, box.x, box.y, box.w, box.h, 10);
    ctx.fill();
    ctx.strokeStyle = '#1f2a38';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = '#98aab7';
    ctx.fillText(t.primer.title, box.x + 16, box.y + 24);
    const side = Math.max(40, Math.min(100, box.h - 110));
    const lean = reduced ? 0.45 : 0.45 * (0.5 - 0.5 * Math.cos((2 * Math.PI * clock) / 3.2));
    const baseY = box.y + 44 + side;
    const half = box.w / 2;
    // The square: its top slides over, its sides lean, every bar keeps its length.
    const sx = box.x + half / 2 - side / 2;
    const dx = side * Math.sin(lean),
      dy = side * Math.cos(lean);
    const square = [
      [sx, baseY],
      [sx + side, baseY],
      [sx + side + dx, baseY - dy],
      [sx + dx, baseY - dy],
    ];
    const triangle = [
      [box.x + half + half / 2 - side / 2, baseY],
      [box.x + half + half / 2 + side / 2, baseY],
      [box.x + half + half / 2, baseY - side * 0.87],
    ];
    for (const shape of [square, triangle]) {
      ctx.strokeStyle = COLOURS.steel;
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      shape.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.stroke();
      for (const [x, y] of shape) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#0a0e15';
        ctx.fill();
        ctx.strokeStyle = '#e8eef5';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      // A hand's push on the top, from the left.
      const [tx, ty] = shape[shape.length - 1];
      arrow(ctx, tx - 34, ty, tx - 8, ty);
    }
    ctx.lineJoin = 'miter';
    ctx.textAlign = 'center';
    for (const [x, title, count] of [
      [box.x + half / 2, t.primer.square, t.primer.squareCount],
      [box.x + half + half / 2, t.primer.triangle, t.primer.triangleCount],
    ]) {
      ctx.font = '600 14px system-ui, sans-serif';
      ctx.fillStyle = '#e8eef5';
      ctx.fillText(title, x, baseY + 30, half - 24);
      ctx.font = '400 12px system-ui, sans-serif';
      ctx.fillStyle = '#98aab7';
      ctx.fillText(count, x, baseY + 50, half - 24);
    }
    ctx.textAlign = 'left';
  }

  function arrow(ctx, x0, y0, x1, y1) {
    ctx.strokeStyle = '#f0c43c';
    ctx.fillStyle = '#f0c43c';
    ctx.lineWidth = 2.5;
    line(ctx, [x0, y0], [x1 - 6, y1]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 8, y1 - 5);
    ctx.lineTo(x1 - 8, y1 + 5);
    ctx.closePath();
    ctx.fill();
  }

  const number = (v) =>
    new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: v < 10 ? 2 : 1, useGrouping: false }).format(
      Math.round(v * 100) / 100,
    );

  /** The home map's picture: a Pratt truss with the truck on it, every bar coloured. */
  function preview(ctx, width, height) {
    const s = { panels: 4, bars: M.pattern(4, 'pratt') };
    prepare(s);
    const L = measure(width, height, n, true);
    const tension = M.forces(rest, bars, M.held(n), M.truckLoads(n, 1.5)).tension;
    scene(ctx, L, { joints: rest, tension, truckX: 1.5, dir: 1, marks: false });
  }

  // ------------------------------------------------------------- the words

  /** The status line, the scene's name, the button's label, and the panel's readout, when they change. */
  function report(s, tension) {
    const status = info.rigid
      ? t.status.rigid(info.bars - info.needed)
      : info.verdict === 'short'
        ? t.status.short(info.needed - info.bars)
        : t.status.spread;
    if ($('scene-status').textContent !== status) $('scene-status').textContent = status;
    if ($('scene-name').textContent !== sceneName()) $('scene-name').textContent = sceneName();
    const action = unbraced().length ? t.actionBrace : t.actionUnbrace;
    if ($('scene-action').textContent !== action) $('scene-action').textContent = action;
    // Read out once when the bridge locks or comes loose, not at every bar.
    const state = info.rigid ? 'rigid' : 'floppy';
    if (told && state !== told && W.stage.isShowing(room)) W.announce(info.rigid ? t.locked : status);
    told = state;
    const box = $('truss-readout');
    if (!box) return;
    const r = t.readout;
    let html = `<div class="truss-big"><span>${t.readout.have(info.bars, info.needed)}</span><strong class="${info.rigid ? 'is-rigid' : 'is-floppy'}">${info.rigid ? t.verdict.rigid : t.verdict.floppy}</strong></div>`;
    html += `<p>${r.count(info.joints, 2 * info.joints, info.needed, info.bars)}</p>`;
    if (!info.rigid) html += `<p>${info.verdict === 'short' ? r.short(info.needed - info.bars) : r.spread}</p>`;
    else if (s.forces && !tension) html += `<p>${r.ashore}</p>`;
    else if (s.forces) {
      const most = Math.max(...tension.map(Math.abs));
      const busiest = number(most) === number(1) ? r.busiestSame : r.busiest(number(most));
      html += `<p>${busiest} ${r.nothing(tension.filter((v) => Math.abs(v) < M.QUIET).length)}</p>`;
    }
    if (info.spare.length) html += `<p>${r.spare(info.spare.length)}</p>`;
    if (html !== shown) {
      shown = html;
      box.innerHTML = html;
    }
  }

  // ---------------------------------------------------------------- input

  /** Put a bar in, or take it out. */
  function flip(i, s, stage) {
    if (i < 0) return;
    s.bars = M.toggle(s.bars, i);
    s.auto = false;
    demo = null;
    stage.setChosen(-1);
    prepare(s);
    still(s);
    stage.sync();
    stage.draw();
  }

  /** The panel's key, for phones, where the picture has no room for it. */
  function panelKey() {
    const swatch = (colour, dashed, thin) =>
      `<svg viewBox="0 0 22 10" aria-hidden="true"><path d="M2 5h18" stroke="${colour}" stroke-width="${thin ? 2.5 : 5}" stroke-linecap="round"${dashed ? ' stroke-dasharray="4 4"' : ''}/></svg>`;
    return (
      '<div class="truss-key wide" id="truss-key" hidden><ul>' +
      `<li>${swatch(COLOURS.squeezed)}${t.key.squeezed}</li>` +
      `<li>${swatch(COLOURS.stretched)}${t.key.stretched}</li>` +
      `<li>${swatch(COLOURS.nothing, false, true)}${t.key.nothing}</li>` +
      `<li>${swatch(COLOURS.steel, true)}${t.key.spare}</li></ul></div>`
    );
  }

  // ----------------------------------------------------------------- room

  const SQUARES = M.pattern(4, 'squares');
  const presetSettings = [
    { panels: 4, bars: SQUARES, auto: false },
    { panels: 4, bars: M.pattern(4, 'pratt'), auto: false },
    { panels: 4, bars: M.pattern(4, 'counted'), auto: false },
  ];
  const badges = ['□', '◿', '?'];

  const room = W.defineRoom({
    id: 'truss',
    symbol: '△',
    theme: 'engineering',
    added: '2026-10-04',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#1b2433', border: '#e8604f', color: '#f6c3b8' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames.squares,
    tip: t.tip,
    actionLabel: t.actionBrace,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'arch' },

    defaults: { panels: 4, bars: SQUARES, auto: true, forces: true },
    ranges: { panels: [M.MIN_PANELS, M.MAX_PANELS, 'integer'], bars: [0, 2 ** 31 - 1, 'integer'] },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Maxwell',
        color: '#8fb8f0',
        sketch: { hairStyle: 'curly', hair: '#3a2c22', skin: '#efcfb0', beard: 'full', backdrop: '#1a2233' },
      },
      {
        ...t.guests[1],
        bio: 'Geiringer',
        color: '#e8a0c0',
        sketch: { hairStyle: 'bun', hair: '#4a3328', skin: '#f0d0b4', brows: 'soft', backdrop: '#2a1f2a' },
      },
      {
        ...t.guests[2],
        color: '#f2c94c',
        sketch: { hairStyle: 'receding', hair: '#d8d4cc', skin: '#ecc9a8', beard: 'full', backdrop: '#262418' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('panels', t.panels, M.MIN_PANELS, M.MAX_PANELS, 1, s.panels, '', t.panelsHint) +
      stage.check('forces', t.forces, s.forces) +
      '<div class="wide readout truss-readout" id="truss-readout"></div>' +
      panelKey(),

    bindControls(panel) {
      shown = '';
      // The stage stores the tick; the key and readout follow it.
      panel.querySelector('[data-check="forces"]').addEventListener('change', () => (shown = ''));
    },

    enter(s, stage) {
      aim = null;
      hover = -1;
      pending = -1;
      grabbed = false;
      told = '';
      // A frame from a shared link or a saved moment stays put; otherwise the opening plays.
      if (s.auto && s.bars !== M.pattern(s.panels, 'squares')) s.auto = false;
      fresh(s);
      base = { panels: s.panels, bars: s.bars, auto: s.auto };
      startScene(s);
      stage.draw();
    },

    step(dt, s, stage) {
      prepare(s);
      pulse = Math.max(0, pulse - dt / 0.9);
      if (demo) brace(dt, s, stage);
      moveTruck(dt);
      moveBridge(dt, s);
    },

    draw,
    preview,

    /** Brace every square with one diagonal, or, once they all have one, take the diagonals out. */
    action(s, stage) {
      const open = unbraced();
      if (open.length) for (const k of open) s.bars = M.toggle(s.bars, prattDiagonal(k));
      else
        for (let k = 0; k < n; k++)
          for (const i of [M.rise(n, k), M.fall(n, k)]) if (M.has(s.bars, i)) s.bars = M.toggle(s.bars, i);
      s.auto = false;
      demo = null;
      stage.setChosen(-1);
      prepare(s);
      still(s);
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      const resized = s.panels !== base.panels;
      Object.assign(s, base);
      fresh(s);
      startScene(s);
      if (resized) stage.refresh();
      stage.sync();
      stage.draw();
    },
    onPreset(s) {
      fresh(s);
      base = { panels: s.panels, bars: s.bars, auto: s.auto };
      startScene(s);
    },
    onInput(s) {
      // More or fewer squares: the same kind of bridge, longer or shorter.
      if (s.panels !== n) s.bars = M.resize(n, mask, s.panels);
      s.auto = false;
      demo = null;
      prepare(s);
      if (reduced) truck.x = n / 2; // with reduced motion the truck stands in the middle
      still(s);
    },

    pointer: {
      // A finger on the truck drags it; anywhere else it taps bars, or scrolls the page.
      drag: (p, s, stage) => onTruck(p, stage),
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        grabbed = onTruck(p, stage);
        pending = grabbed ? -1 : placeAt(p, stage);
      },
      move(p, { mouse, dragging }, s, stage) {
        if (grabbed && dragging) {
          truck.x = clamp((p.x * stage.width - layout.x0) / layout.P, -PARK, n + PARK);
          if (!stage.playing) {
            still(s);
            stage.draw();
          }
          return;
        }
        if (dragging && pending >= 0 && placeAt(p, stage) !== pending) pending = -1; // a drag, not a tap
        const before = hover;
        hover = mouse && !dragging ? placeAt(p, stage) : -1;
        if (hover !== before && !stage.playing) stage.draw();
      },
      up(e) {
        if (grabbed) {
          grabbed = false;
          truck.wait = Math.max(truck.wait, 0.5);
          return;
        }
        // A press that ends where it began switches its place; a scroll or a cancelled gesture doesn't.
        const i = pending;
        pending = -1;
        if (e?.type === 'pointerup' && i >= 0) flip(i, W.stage.settingsFor('truss'), W.stage);
      },
      leave() {
        hover = -1;
      },
      escape: () => (aim = null),
      arrow(dx, dy) {
        nextPlace(dx, dy);
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        if (aim === null) nextPlace(0, 0);
        flip(aim, s, stage);
        return true;
      },
    },
  });
})();
