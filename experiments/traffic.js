/*
 * Braess's paradox: a small, inspectable traffic model.
 * This classic four-node example comes from Easley & Kleinberg, chapter 8:
 * https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf
 * Loaded as a regular script so index.html also works when opened offline.
 */
(() => {
  'use strict';

  function equilibrium(demand, shortcut) {
    if (!Number.isFinite(demand) || demand < 0) throw new RangeError('Demand must be nonnegative');
    const baseline = 45 + demand / 200;
    if (!shortcut) {
      return { upper: demand / 2, lower: demand / 2, middle: 0, time: baseline, baseline };
    }
    // Wardrop equilibrium: every route carrying traffic is equally fast,
    // and no unused route is faster. Edge costs are x/100 or 45 minutes;
    // the directed A→B shortcut costs zero. Flows may be fractional.
    const outer = Math.max(0, Math.min(demand / 2, demand - 4500));
    const middle = demand - 2 * outer;
    const time = middle > 0 ? 2 * (demand - outer) / 100 : baseline;
    return { upper: outer, lower: outer, middle, time, baseline };
  }

  function draw(ctx, width, height, settings, clock) {
    const { demand, shortcut } = settings;
    const flow = equilibrium(demand, shortcut);
    const points = {
      start: [width * .12, height * .52],
      north: [width * .43, height * .22],
      south: [width * .43, height * .82],
      end: [width * .85, height * .52]
    };
    const { start, north, south, end } = points;
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
    const links = [[start, north], [north, end], [start, south], [south, end]];
    links.forEach(([a, b]) => seg(a, b, '#344552', 10));
    seg(north, south, shortcut ? '#4e6673' : '#41505c', 10, !shortcut);
    const density = x => 2 + 7 * Math.sqrt(x / Math.max(demand, 1));
    if (flow.upper + flow.middle > 0) seg(start, north, '#b4eed3', density(flow.upper + flow.middle));
    if (flow.upper > 0) seg(north, end, '#f7c998', density(flow.upper));
    if (flow.lower > 0) seg(start, south, '#f7c998', density(flow.lower));
    if (flow.lower + flow.middle > 0) seg(south, end, '#b4eed3', density(flow.lower + flow.middle));
    if (shortcut && flow.middle > 0) seg(north, south, '#e2ccff', density(flow.middle));

    // Moving dots represent proportions of route flow, not individual cars.
    const routes = [
      { amount: flow.upper, path: [start, north, end], color: '#fbd4a9' },
      { amount: flow.lower, path: [start, south, end], color: '#fbd4a9' },
      { amount: flow.middle, path: [start, north, south, end], color: '#e2ccff' }
    ];
    for (const route of routes) {
      const count = Math.min(16, Math.round(route.amount / Math.max(demand, 1) * 15));
      if (count < 1) continue;
      const lengths = route.path.slice(1).map((p, i) => Math.hypot(p[0] - route.path[i][0], p[1] - route.path[i][1]));
      const total = lengths.reduce((a, b) => a + b, 0);
      for (let n = 0; n < count; n++) {
        let distance = ((n / count + clock * .12) % 1) * total;
        for (let i = 0; i < lengths.length; i++) {
          if (distance > lengths[i]) { distance -= lengths[i]; continue; }
          const p = route.path[i], q = route.path[i + 1], t = distance / lengths[i];
          ctx.fillStyle = route.color;
          ctx.beginPath();
          ctx.arc(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, 2.5, 0, 2 * Math.PI);
          ctx.fill();
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
    node(start, 'S'); node(north, 'A'); node(south, 'B'); node(end, 'T');
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a7c7c5';
    ctx.font = '12px system-ui';
    ctx.fillText('congestion', width * .2, height * .24);
    ctx.fillText('45 min', width * .69, height * .23);
    ctx.fillText('45 min', width * .2, height * .88);
    ctx.fillText('congestion', width * .7, height * .88);
    ctx.fillStyle = shortcut ? '#e2ccff' : '#9ba8ad';
    ctx.fillText(shortcut ? '0 min' : 'closed', width * .43 + 40, height * .54);
    ctx.fillStyle = '#98aab7';
    ctx.font = '11px system-ui';
    ctx.fillText('S → T · everyone chooses their fastest route', width * .5, height * .975);
    return flow;
  }

  globalThis.WonderloomTraffic = Object.freeze({ equilibrium, draw });
})();
