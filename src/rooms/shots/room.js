/* Room · Two players, three leaderboards: Simpson's paradox on a basketball court. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const { compare } = W.models.shotMix;
  const t = W.text('shots');

  // Fixed skill: how often each player makes a shot of each type. The visitor
  // controls how many shots of each type are taken, not how skilled anyone is.
  const RATES = { aCloseRate: 0.9, aFarRate: 0.4, bCloseRate: 0.8, bFarRate: 0.3 };

  /** Merge the visitor's attempt counts with the fixed rates, ready for the model. */
  function fullSettings(s) {
    return {
      ...RATES,
      aCloseAttempts: s.aClose,
      aFarAttempts: s.aFar,
      bCloseAttempts: s.bClose,
      bFarAttempts: s.bFar,
    };
  }

  /** Words broken into lines no wider than maxWidth, for text drawn on the canvas. */
  function wrap(ctx, text, maxWidth) {
    const lines = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    return line ? [...lines, line] : lines;
  }

  // A half court in feet: the hoop near the top, the key, and the three-point arc (NBA proportions).
  const COURT = { width: 50, depth: 33, hoop: 5.25, key: 16, keyDepth: 19, arc: 23.75, corner: 22 };

  /** A repeatable pseudo-random number in [0, 1) for shot `i` of a player and range, so dots stay put. */
  function jitter(player, range, i, k) {
    const x = Math.sin((player * 7919 + range * 104729 + i * 1299709 + k * 15485863) * 0.000123) * 43758.5453;
    return x - Math.floor(x);
  }

  /** Where one shot lands, in feet from the hoop: close ones in the key, far ones just beyond the arc. */
  function spot(player, range, i) {
    const u = jitter(player, range, i, 1),
      v = jitter(player, range, i, 2);
    if (range === 0) {
      const r = 1.5 + Math.sqrt(u) * 6.5,
        angle = (v - 0.5) * Math.PI * 1.1;
      return [Math.sin(angle) * r, Math.cos(angle) * r];
    }
    const r = COURT.arc + 1 + u * 2.6,
      angle = (v - 0.5) * Math.PI * 0.86;
    const y = Math.min(COURT.depth - COURT.hoop - 0.8, Math.cos(angle) * r);
    return [Math.max(-23.5, Math.min(23.5, Math.sin(angle) * r)), y];
  }

  /** The court with every shot as a dot (filled when made), so the mix of shots is visible at a glance. */
  function drawCourt(ctx, box, a, b, small) {
    const scale = Math.min(box.w / (COURT.width + 2), (box.h - small * 3.8) / (COURT.depth + 1));
    const w = COURT.width * scale,
      d = COURT.depth * scale;
    const ox = box.x + (box.w - w) / 2,
      oy = box.y + 2;
    const hx = ox + w / 2,
      hy = oy + COURT.hoop * scale;
    const at = ([x, y]) => [hx + x * scale, hy + y * scale];

    ctx.fillStyle = '#141b24';
    ctx.fillRect(ox, oy, w, d);
    ctx.strokeStyle = '#3a4756';
    ctx.lineWidth = Math.max(1, scale * 0.18);
    ctx.strokeRect(ox, oy, w, d);
    ctx.strokeRect(hx - (COURT.key / 2) * scale, oy, COURT.key * scale, COURT.keyDepth * scale);
    ctx.beginPath();
    ctx.arc(hx, oy + COURT.keyDepth * scale, 6 * scale, 0, Math.PI);
    ctx.stroke();
    // The three-point line: straight in the corners, then the arc.
    const cornerY = Math.sqrt(COURT.arc ** 2 - COURT.corner ** 2);
    const edge = Math.atan2(cornerY, COURT.corner);
    ctx.beginPath();
    ctx.moveTo(hx - COURT.corner * scale, oy);
    ctx.lineTo(hx - COURT.corner * scale, hy + cornerY * scale);
    ctx.arc(hx, hy, COURT.arc * scale, Math.PI - edge, edge, true);
    ctx.lineTo(hx + COURT.corner * scale, oy);
    ctx.stroke();
    // Backboard and hoop.
    ctx.strokeStyle = '#c9d6df';
    ctx.beginPath();
    ctx.moveTo(hx - 3 * scale, hy - 1.25 * scale);
    ctx.lineTo(hx + 3 * scale, hy - 1.25 * scale);
    ctx.stroke();
    ctx.strokeStyle = '#f08a4b';
    ctx.lineWidth = Math.max(1.5, scale * 0.25);
    ctx.beginPath();
    ctx.arc(hx, hy, 0.75 * scale, 0, Math.PI * 2);
    ctx.stroke();

    // Dots: one per shot, or one per few shots when there are many, so the court stays readable.
    const most = Math.max(a.closeAttempts + a.farAttempts, b.closeAttempts + b.farAttempts, 1);
    const perDot = Math.max(1, Math.ceil(most / 40));
    const radius = Math.max(2, Math.min(5, scale * 0.55));
    [
      [a, '#f7c998'],
      [b, '#b4eed3'],
    ].forEach(([p, colour], player) => {
      [
        [p.closeAttempts, p.closeMakes],
        [p.farAttempts, p.farMakes],
      ].forEach(([tries, makes], range) => {
        const dots = tries ? Math.max(1, Math.round(tries / perDot)) : 0;
        const made = Math.round((dots * makes) / Math.max(tries, 1));
        for (let i = 0; i < dots; i++) {
          const [x, y] = at(spot(player, range, i));
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          if (i < made) {
            ctx.fillStyle = colour;
            ctx.fill();
          } else {
            ctx.strokeStyle = colour;
            ctx.lineWidth = Math.max(1, radius * 0.4);
            ctx.globalAlpha = 0.75;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
    });

    // Zone names, quietly: close at the foot of the key, far in the empty corner beyond the arc.
    ctx.font = `600 ${small - 1}px system-ui`;
    ctx.fillStyle = '#7d8a9a';
    ctx.textAlign = 'center';
    ctx.fillText(t.closeLabel, hx, oy + COURT.keyDepth * scale - small * 0.45);
    ctx.textAlign = 'left';
    ctx.fillText(t.farLabel, ox + small * 0.5, oy + d - small * 0.5);
    // What a dot means, wrapped to the court's width.
    ctx.font = `${small - 1}px system-ui`;
    ctx.fillStyle = '#98aab7';
    ctx.textAlign = 'center';
    const legend = `● ${t.legend.made}   ○ ${t.legend.missed}   ·   ${t.legend.perDot(perDot)}`;
    wrap(ctx, legend, box.w).forEach((line, i) =>
      ctx.fillText(line, box.x + box.w / 2, oy + d + small * (1.5 + 1.25 * i)),
    );
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    const { a, b } = compare(fullSettings(s));
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'alphabetic';

    const both = (pa, pb, makesA, triesA, makesB, triesB) => ({
      aPct: pa,
      bPct: pb,
      aVal: t.makesOf(makesA, triesA),
      bVal: t.makesOf(makesB, triesB),
    });
    const groups = [
      {
        label: t.closeLabel,
        ...both(a.closePct, b.closePct, a.closeMakes, a.closeAttempts, b.closeMakes, b.closeAttempts),
      },
      { label: t.farLabel, ...both(a.farPct, b.farPct, a.farMakes, a.farAttempts, b.farMakes, b.farAttempts) },
      {
        label: t.overallLabel,
        overall: true,
        ...both(
          a.overallPct,
          b.overallPct,
          a.closeMakes + a.farMakes,
          a.closeAttempts + a.farAttempts,
          b.closeMakes + b.farMakes,
          b.closeAttempts + b.farAttempts,
        ),
      },
    ];

    // The court beside the leaderboards on wide, short canvases (phones), above them otherwise.
    const small = Math.round(Math.min(13, Math.max(10, Math.min(width, height) / 32)));
    const pad = Math.max(10, Math.min(width, height) * 0.035);
    if (width > height * 1.15) {
      const courtW = Math.min(width * 0.46, (height - 2 * pad) * 1.45);
      drawCourt(ctx, { x: pad, y: pad, w: courtW, h: height - 2 * pad }, a, b, small);
      drawBoards(ctx, { x: courtW + pad, y: 0, w: width - courtW - pad, h: height }, groups);
    } else {
      const courtH = Math.max(150, height * 0.44);
      drawCourt(ctx, { x: pad, y: pad, w: width - 2 * pad, h: courtH }, a, b, small);
      drawBoards(ctx, { x: 0, y: courtH + pad, w: width, h: height - courtH - pad }, groups);
    }
  }

  /** The three leaderboards inside `box`. Sizes follow the box. When the full layout (a label line above each bar) doesn't fit, as on
    // phones, each player gets one line instead: a short tag, the bar, and the percentage. */
  function drawBoards(ctx, box, groups) {
    const { w: width, h: height } = box;
    ctx.save();
    ctx.translate(box.x, box.y);
    const pad = Math.max(12, Math.min(width, height) * 0.05);
    const small = Math.round(Math.min(13, Math.max(11, width / 48)));
    ctx.font = `${small - 1}px system-ui`;
    const fullWidth = width - 2 * pad;
    const caption = wrap(ctx, t.labels.caption, fullWidth);
    const captionH = caption.length * (small + 3) + 6;
    const fullNeed = 2 * pad + captionH + 3 * (small + 8 + 2 * (small + 16));
    const compact = height < fullNeed;
    const showCaption = !compact || height - 2 * pad - 3 * (small + 6 + 2 * (small + 6)) >= captionH;
    const unit = (height - 2 * pad - (showCaption ? captionH : 0)) / 3; // heading, then two bars
    const barH = compact ? Math.max(6, Math.min(small + 2, unit * 0.2)) : Math.max(6, Math.min(22, unit * 0.16));
    const gap = Math.max(3, unit * (compact ? 0.05 : 0.06));
    ctx.font = `700 ${small + 1}px system-ui`;
    const tagW = compact ? Math.max(ctx.measureText(t.short.a).width, ctx.measureText(t.short.b).width) + 8 : 0;
    const pctW = compact ? ctx.measureText(t.percent(1)).width + 8 : 0;
    const barX = pad + tagW,
      barW = fullWidth - tagW - pctW;

    groups.forEach((g, i) => {
      let y = pad + i * unit;
      ctx.textAlign = 'left';
      ctx.fillStyle = g.overall ? '#f4f5e9' : '#c9d6df';
      ctx.font = `${g.overall ? 700 : 600} ${small + (compact ? 1 : 2)}px system-ui`;
      ctx.fillText(g.label, pad, y + small + 1);
      y += small + (compact ? 5 : 2 + gap * 1.5);
      for (const [who, tag, pct, val, colour] of [
        [t.players.a, t.short.a, g.aPct, g.aVal, '#f7c998'],
        [t.players.b, t.short.b, g.bPct, g.bVal, '#b4eed3'],
      ]) {
        const leads = pct > (who === t.players.a ? g.bPct : g.aPct);
        const h = g.overall ? barH * 1.3 : barH;
        const percentFont = `${leads ? 700 : 400} ${small + 1}px system-ui`;
        if (compact) {
          const mid = y + h / 2 + small * 0.36;
          ctx.font = `700 ${small}px system-ui`;
          ctx.fillStyle = colour;
          ctx.textAlign = 'left';
          ctx.fillText(tag, pad, mid);
          ctx.font = percentFont;
          ctx.fillStyle = leads ? '#f4f5e9' : '#8795a8';
          ctx.textAlign = 'right';
          ctx.fillText(t.percent(pct), pad + fullWidth, mid);
        } else {
          ctx.font = `${small}px system-ui`;
          ctx.fillStyle = '#aebbc6';
          ctx.textAlign = 'left';
          ctx.fillText(`${who} · ${val}`, pad, y + small);
          ctx.font = percentFont;
          ctx.fillStyle = leads ? '#f4f5e9' : '#8795a8';
          ctx.textAlign = 'right';
          ctx.fillText(t.percent(pct), pad + fullWidth, y + small);
          y += small + 4;
        }
        ctx.fillStyle = '#1d2832';
        ctx.fillRect(barX, y, barW, h);
        ctx.fillStyle = colour;
        ctx.globalAlpha = leads ? 1 : 0.55;
        ctx.fillRect(barX, y, barW * pct, h);
        ctx.globalAlpha = 1;
        y += h + gap;
      }
    });

    if (showCaption) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#98aab7';
      ctx.font = `${small - 1}px system-ui`;
      caption.forEach((line, i) => ctx.fillText(line, width / 2, height - pad - captionH + 6 + (i + 1) * (small + 3)));
    }
    ctx.restore();
  }

  /** The verdict text: who leads overall, and whether that's a reversal from both individual categories. */
  function outcome(s) {
    const { a, b } = compare(fullSettings(s));
    const aWinsBoth = a.closePct > b.closePct && a.farPct > b.farPct;
    const bWinsBoth = b.closePct > a.closePct && b.farPct > a.farPct;
    let verdict;
    if (a.overallPct === b.overallPct) verdict = t.verdict.tied;
    else if (a.overallPct > b.overallPct) verdict = bWinsBoth ? t.verdict.reversal(t.players.b) : t.verdict.aWins;
    else verdict = aWinsBoth ? t.verdict.reversal(t.players.a) : t.verdict.bWins;
    return { a, b, verdict };
  }

  function announce(s) {
    W.announce(outcome(s).verdict);
  }

  function readouts(s) {
    const { verdict } = outcome(s);
    $('scene-status').textContent = verdict;
  }

  W.defineRoom({
    id: 'shots',
    symbol: '≠',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    added: '2026-09-26',
    tagline: t.tagline,
    accent: { background: '#2a2721', border: '#f0c98e', color: '#f7dfb3' },

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
    connection: { ...t.connection, go: 'sample' },

    defaults: { aClose: 10, aFar: 900, bClose: 900, bFar: 10 },
    previewSettings: { aClose: 10, aFar: 900, bClose: 900, bFar: 10 },
    ranges: {
      aClose: [0, 1000, 'integer'],
      aFar: [0, 1000, 'integer'],
      bClose: [0, 1000, 'integer'],
      bFar: [0, 1000, 'integer'],
    },
    defaultPreset: 2, // the opening mix is the extreme one
    presets: [
      { settings: { aClose: 500, aFar: 500, bClose: 500, bFar: 500 } },
      { settings: { aClose: 100, aFar: 500, bClose: 500, bFar: 100 } },
      { settings: { aClose: 10, aFar: 900, bClose: 900, bFar: 10 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        color: '#f0c98e',
        sketch: { hairStyle: 'short', hair: '#4a3b2a', skin: '#e8b98c', backdrop: '#2a2721' },
      },
      {
        ...t.guests[1],
        bio: 'Yule',
        color: '#b4eed3',
        sketch: { hairStyle: 'short', hair: '#2a2220', skin: '#f0cba9', backdrop: '#25352c' },
      },
    ],

    insight: t.insight,

    still: true,

    controls: (s, stage) =>
      stage.slider('aClose', `${t.players.a} · ${t.closeLabel}`, 0, 1000, 10, s.aClose, '', t.attemptsHint) +
      stage.slider('aFar', `${t.players.a} · ${t.farLabel}`, 0, 1000, 10, s.aFar, '', t.attemptsHint) +
      stage.slider('bClose', `${t.players.b} · ${t.closeLabel}`, 0, 1000, 10, s.bClose, '', t.attemptsHint) +
      stage.slider('bFar', `${t.players.b} · ${t.farLabel}`, 0, 1000, 10, s.bFar, '', t.attemptsHint),

    bindControls(panel, s) {
      ['c-aClose', 'c-aFar', 'c-bClose', 'c-bFar'].forEach((id) => $(id).addEventListener('change', () => announce(s)));
    },
    readouts,
    draw,
    action(s, stage) {
      // "Split into close and far" swaps each player's attempts between the two
      // categories, so the visitor can watch the leaderboard flip in front of them.
      [s.aClose, s.aFar] = [s.aFar, s.aClose];
      [s.bClose, s.bFar] = [s.bFar, s.bClose];
      stage.refresh();
      stage.draw();
      announce(s);
    },
    reset(s, stage) {
      Object.assign(s, { aClose: 10, aFar: 900, bClose: 900, bFar: 10 });
      ['aClose', 'aFar', 'bClose', 'bFar'].forEach((key) => {
        const input = $('c-' + key);
        if (input) input.value = s[key];
        const out = $('v-' + key);
        if (out) out.textContent = s[key];
      });
      announce(s);
    },
  });
})();
