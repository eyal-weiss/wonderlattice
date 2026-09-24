/* Room · The tempting shortcut: Braess's paradox on a four-node road network. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $ } = W;
  const { equilibrium } = W.models.traffic;

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
      seg(a, b, '#344552', 10);
    seg(north, south, shortcut ? '#4e6673' : '#41505c', 10, !shortcut);
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
            t = distance / lengths[i];
          ctx.save();
          ctx.translate(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t);
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
    node(start, 'S');
    node(north, 'A');
    node(south, 'B');
    node(end, 'T');
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a7c7c5';
    ctx.font = '12px system-ui';
    ctx.fillText('congestion', width * 0.2, height * 0.24);
    ctx.fillText('45 min', width * 0.69, height * 0.23);
    ctx.fillText('45 min', width * 0.2, height * 0.88);
    ctx.fillText('congestion', width * 0.7, height * 0.88);
    ctx.fillStyle = shortcut ? '#e2ccff' : '#9ba8ad';
    ctx.fillText(shortcut ? '0 min' : 'closed', width * 0.43 + 40, height * 0.54);
    ctx.fillStyle = '#98aab7';
    ctx.font = '11px system-ui';
    ctx.fillText('S → T · everyone chooses their fastest route', width * 0.5, height * 0.975);
  }

  function readouts(s) {
    const f = equilibrium(s.demand, s.shortcut),
      diff = f.time - f.baseline,
      time = Number(f.time.toFixed(1)),
      baseline = Number(f.baseline.toFixed(1));
    $('scene-status').textContent = (s.shortcut ? 'Shortcut open · ' : 'Shortcut closed · ') + time + ' min now';
    $('scene-action').textContent = s.shortcut ? 'Close the shortcut' : 'Open the shortcut';
    const verdict = !s.shortcut
      ? 'Open the shortcut to reveal the new travel time.'
      : Math.abs(diff) < 0.05
        ? 'The new road leaves the trip time unchanged.'
        : diff > 0
          ? '↑ ' + Number(diff.toFixed(1)) + ' minutes slower for everyone.'
          : '↓ ' + Number((-diff).toFixed(1)) + ' minutes faster for everyone.';
    $('traffic-result').innerHTML =
      '<div class="traffic-compare">' +
      `<div class="traffic-time ${!s.shortcut ? 'active' : ''}"><span>Before</span><strong>${baseline}<small> min</small></strong></div>` +
      '<span class="traffic-arrow" aria-hidden="true">→</span>' +
      `<div class="traffic-time ${s.shortcut ? 'active' : ''}"><span>After opening</span><strong>${s.shortcut ? time : '?'}<small> min</small></strong></div>` +
      `</div><p class="traffic-verdict">${verdict}</p>`;
  }

  W.defineRoom({
    id: 'traffic',
    symbol: '↗',
    eyebrow: 'NETWORKS · CHOICES',
    name: 'The tempting shortcut',
    theme: 'signals',
    tagline: 'A new road that makes every driver slower.',
    accent: { background: '#242b30', border: '#a9e3d2', color: '#c5f5e4' },

    title: 'The tempting shortcut.',
    subtitle: 'A new road looks like a gift. Open it and see what happens.',
    field: 'Networks · Game theory · A little surprise',
    sceneLabel: 'One city · Many private choices',
    sceneName: 'The city crossing',
    tip: 'Moving markers show proportions of traffic, not individual cars',
    actionLabel: 'Open the shortcut',
    canvasLabel: 'A directed road network. Open or close the middle shortcut, and vary the number of drivers.',
    panelEyebrow: 'Change one road',
    whyLabel: 'How could that happen?',
    nudge: 'Start with 4,000 drivers. Open the shortcut. Then try much lighter traffic. Is the road always a bad idea?',
    connection: {
      html: '<strong>Simple rules, unexpected result.</strong> The flock makes a pattern from local interactions. Here, each driver choosing a fast route can make the whole trip slower.',
      go: 'flock',
      label: 'Follow another crowd',
    },

    defaults: { demand: 4000, shortcut: false },
    previewSettings: { shortcut: true },
    ranges: { demand: [1000, 10000] },
    defaultPreset: 1,
    presets: [
      {
        name: 'Quiet roads',
        note: 'The shortcut might help.',
        badge: '1k',
        settings: { demand: 1000, shortcut: false },
      },
      { name: 'A crowded city', note: 'Try the surprise.', badge: '4k', settings: { demand: 4000, shortcut: false } },
      {
        name: 'Rush hour',
        note: 'Can the shortcut stop mattering?',
        badge: '10k',
        settings: { demand: 10000, shortcut: false },
      },
    ],

    guests: [
      {
        name: 'John von Neumann',
        note: 'Traffic is a game of choices, and a clever move can surprise everybody.',
        bio: 'Von_Neumann',
        image: 'vonneumann.jpg',
        source: 'HD.3F.191_(11239892036).jpg',
        color: '#acd9c2',
        frame: [95, -15, -18],
      },
      {
        name: 'John Nash',
        note: 'Here, no driver can improve alone, even while everyone is slower.',
        bio: 'Nash',
        image: 'nash.jpg',
        source: 'John_Forbes_Nash_(1928-2015)_portrait.jpg',
        color: '#d5b9ec',
        frame: [120, -30, -28],
      },
    ],

    insight: {
      title: 'Why can a new road slow everyone down?',
      html: `<p>With 4,000 drivers and no shortcut, traffic splits evenly between the upper and lower routes. Each trip takes 65 minutes. Open the zero-minute link between A and B, and each driver sees a reason to use it. Everyone takes S → A → B → T, and each trip takes 80 minutes.</p>
<div class="insight-visual">A shortcut can change people’s choices, and their choices change congestion.</div>
<h3>Try a quieter city</h3>
<p>Move the demand slider toward 1,000. The shortcut now helps. At very high demand it goes unused. The paradox happens only over part of the range.</p>
<h3>What this model assumes</h3>
<p>Drivers choose a fastest route for themselves. Their combined decisions settle into an equilibrium where no driver can save time by switching alone. This is a simplified, directed network with a free shortcut and travel times that depend only on traffic flow. The moving dots show route proportions, not simulated individual decisions or a prediction for an actual city.</p>
<details><summary>The mathematics, if you want it</summary><p>The congestible edges cost x/100 minutes, where x is the number of drivers using that edge. The other two edges each cost 45 minutes; the A → B shortcut costs zero. Without it, travel time is 45 + D/200 for D drivers. At D = 4,000 this is 65 minutes. With it, the equilibrium uses the middle route and costs 2D/100 = 80 minutes.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explore Braess’s paradox (Easley &amp; Kleinberg)</a></div>`,
    },

    controls: (s, stage) =>
      stage.slider('demand', 'Drivers crossing the city', 1000, 10000, 100, s.demand, '', 'How crowded is the city?') +
      '<div class="wide readout traffic-result" id="traffic-result" role="status"></div>',

    readouts,
    draw,
    action(s, stage) {
      s.shortcut = !s.shortcut;
      stage.refresh();
      stage.draw();
    },
  });
})();
