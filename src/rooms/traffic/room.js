/* Room · The tempting shortcut: Braess's paradox on a four-node road network. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const { equilibrium } = W.models.traffic;
  const t = W.text('traffic');

  function draw(ctx, s, stage) {
    const { width, height, clock } = stage;
    const { demand, shortcut } = s;
    const flow = equilibrium(demand, shortcut);
    const start = [width * 0.12, height * 0.52],
      north = [width * 0.43, height * 0.22],
      south = [width * 0.43, height * 0.82],
      end = [width * 0.85, height * 0.52];
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const seg = (a, b, color, thickness, dashed = false) => {
      ctx.beginPath();
      ctx.moveTo(...a);
      ctx.lineTo(...b);
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.setLineDash(dashed ? [6, 8] : []);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    for (const [a, b] of [
      [start, north],
      [north, end],
      [start, south],
      [south, end],
    ])
      seg(a, b, '#566e7e', 10); // empty roads keep at least 3:1 against the night background
    seg(north, south, shortcut ? '#6a8595' : '#5d6b78', 10, !shortcut);
    const density = (x) => 2 + 7 * Math.sqrt(x / Math.max(demand, 1));
    if (flow.upper + flow.middle > 0) seg(start, north, '#b4eed3', density(flow.upper + flow.middle));
    if (flow.upper > 0) seg(north, end, '#f7c998', density(flow.upper));
    if (flow.lower > 0) seg(start, south, '#f7c998', density(flow.lower));
    if (flow.lower + flow.middle > 0) seg(south, end, '#b4eed3', density(flow.lower + flow.middle));
    if (shortcut && flow.middle > 0) seg(north, south, '#e2ccff', density(flow.middle));

    // Moving markers represent proportions of route flow, not individual cars.
    const routes = [
      { amount: flow.upper, path: [start, north, end], color: '#fbd4a9' },
      { amount: flow.lower, path: [start, south, end], color: '#fbd4a9' },
      { amount: flow.middle, path: [start, north, south, end], color: '#e2ccff' },
    ];
    for (const route of routes) {
      const count = Math.min(36, Math.round((route.amount / Math.max(demand, 1)) * 36));
      if (count < 1) continue;
      const lengths = route.path.slice(1).map((p, i) => Math.hypot(p[0] - route.path[i][0], p[1] - route.path[i][1]));
      const total = lengths.reduce((a, b) => a + b, 0);
      for (let n = 0; n < count; n++) {
        let distance = ((n / count + clock * 0.16) % 1) * total;
        for (let i = 0; i < lengths.length; i++) {
          if (distance > lengths[i]) {
            distance -= lengths[i];
            continue;
          }
          const p = route.path[i],
            q = route.path[i + 1],
            along = distance / lengths[i];
          ctx.save();
          ctx.translate(p[0] + (q[0] - p[0]) * along, p[1] + (q[1] - p[1]) * along);
          ctx.rotate(Math.atan2(q[1] - p[1], q[0] - p[0]));
          ctx.fillStyle = '#10202a';
          ctx.strokeStyle = '#f4fff2';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.roundRect(-6, -4, 12, 8, 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = route.color;
          ctx.fillRect(0, -2.5, 3, 5);
          ctx.restore();
          break;
        }
      }
    }
    const node = (p, name) => {
      ctx.fillStyle = '#172732';
      ctx.strokeStyle = '#b8e6d1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 16, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f4f5e9';
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px system-ui';
      ctx.fillText(name, p[0], p[1] + 4);
    };
    node(start, t.labels.nodes.start);
    node(north, t.labels.nodes.north);
    node(south, t.labels.nodes.south);
    node(end, t.labels.nodes.end);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a7c7c5';
    ctx.font = '12px system-ui';
    ctx.fillText(t.labels.congestion, width * 0.2, height * 0.24);
    ctx.fillText(t.labels.fixed, width * 0.69, height * 0.23);
    ctx.fillText(t.labels.fixed, width * 0.2, height * 0.88);
    ctx.fillText(t.labels.congestion, width * 0.7, height * 0.88);
    ctx.fillStyle = shortcut ? '#e2ccff' : '#9ba8ad';
    ctx.fillText(shortcut ? t.labels.shortcutOpen : t.labels.shortcutClosed, width * 0.43 + 40, height * 0.54);
    ctx.fillStyle = '#98aab7';
    ctx.font = '11px system-ui';
    ctx.fillText(t.labels.caption, width * 0.5, height * 0.975);
  }

  /** The travel times, and the verdict with its arrow (↑ slower, ↓ faster, or none). */
  function outcome(s) {
    const f = equilibrium(s.demand, s.shortcut),
      diff = f.time - f.baseline,
      time = Number(f.time.toFixed(1)),
      baseline = Number(f.baseline.toFixed(1));
    if (!s.shortcut) return { time, baseline, verdict: t.verdict.closed, arrow: '' };
    if (Math.abs(diff) < 0.05) return { time, baseline, verdict: t.verdict.same, arrow: '' };
    return diff > 0
      ? { time, baseline, verdict: t.verdict.slower(Number(diff.toFixed(1))), arrow: '↑' }
      : { time, baseline, verdict: t.verdict.faster(Number((-diff).toFixed(1))), arrow: '↓' };
  }

  /** Say the settled result once: the verdict with the shortcut open, the plain trip time with it closed. */
  function announce(s) {
    const { time, verdict } = outcome(s);
    W.announce(s.shortcut ? verdict : t.status(false, time));
  }

  function readouts(s) {
    const { time, baseline, verdict, arrow } = outcome(s);
    $('scene-status').textContent = t.status(s.shortcut, time);
    $('scene-action').textContent = s.shortcut ? t.close : t.open;
    // The shared slider readout shows plain digits; the room writes the demand the way the text does (4,000).
    if ($('v-demand')) $('v-demand').textContent = t.drivers(s.demand);
    $('traffic-result').innerHTML =
      '<div class="traffic-compare">' +
      `<div class="traffic-time ${!s.shortcut ? 'active' : ''}"><span>${t.before}</span><strong>${baseline}<small>${t.minutes}</small></strong></div>` +
      '<span class="traffic-arrow" aria-hidden="true">→</span>' +
      `<div class="traffic-time ${s.shortcut ? 'active' : ''}"><span>${t.after}</span><strong>${s.shortcut ? time : '?'}<small>${t.minutes}</small></strong></div>` +
      `</div><p class="traffic-verdict">${arrow ? `<span aria-hidden="true">${arrow}</span> ` : ''}${verdict}</p>`;
  }

  W.defineRoom({
    id: 'traffic',
    symbol: '⇄',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    tagline: t.tagline,
    accent: { background: '#242b30', border: '#a9e3d2', color: '#c5f5e4' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneName,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'flock' },

    defaults: { demand: 4000, shortcut: false },
    previewSettings: { shortcut: true },
    ranges: { demand: [1000, 10000] },
    defaultPreset: 1,
    presets: [
      { badge: '1k', settings: { demand: 1000, shortcut: false } },
      { badge: '4k', settings: { demand: 4000, shortcut: false } },
      { badge: '10k', settings: { demand: 10000, shortcut: false } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Von_Neumann',
        image: 'vonneumann.jpg',
        source: 'HD.3F.191_(11239892036).jpg',
        color: '#acd9c2',
        frame: [95, -15, -18],
      },
      {
        ...t.guests[1],
        bio: 'Nash',
        color: '#d5b9ec',
        // Nash in the 1950s: short, neat dark hair.
        sketch: { hairStyle: 'short', hair: '#2a2220', skin: '#f0cba9', backdrop: '#e4ddee' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('demand', t.demand, 1000, 10000, 100, s.demand, '', t.demandHint) +
      // Rebuilt on every change, so it is not a live region; the settled verdict is announced instead.
      '<div class="wide readout traffic-result" id="traffic-result"></div>',

    bindControls(panel, s) {
      // "change" fires when the slider is let go (or after each key step), not while it is dragged.
      $('c-demand').addEventListener('change', () => announce(s));
    },
    readouts,
    draw,
    action(s, stage) {
      s.shortcut = !s.shortcut;
      stage.refresh();
      stage.draw();
      announce(s);
    },
  });
})();
