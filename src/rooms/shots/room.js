/* Room · Two players, three leaderboards: Simpson's paradox on a basketball court. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const { compare } = W.models.shotMix;
  const t = W.text('shotMix');

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

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    const { a, b } = compare(fullSettings(s));
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);

    const rows = [
      {
        label: t.closeLabel,
        aPct: a.closePct,
        bPct: b.closePct,
        aVal: t.makesOf(a.closeMakes, a.closeAttempts),
        bVal: t.makesOf(b.closeMakes, b.closeAttempts),
      },
      {
        label: t.farLabel,
        aPct: a.farPct,
        bPct: b.farPct,
        aVal: t.makesOf(a.farMakes, a.farAttempts),
        bVal: t.makesOf(b.farMakes, b.farAttempts),
      },
      {
        label: t.overallLabel,
        aPct: a.overallPct,
        bPct: b.overallPct,
        aVal: t.percent(a.overallPct),
        bVal: t.percent(b.overallPct),
      },
    ];

    const top = height * 0.12,
      rowH = (height * 0.8) / rows.length,
      barX = width * 0.34,
      barW = width * 0.56,
      barH = rowH * 0.22,
      labelGap = 16, // space between a label and the bar it names
      pairGap = rowH * 0.1; // space between Player A's block and Player B's block

    ctx.textAlign = 'left';

    rows.forEach((row, i) => {
      const y = top + i * rowH;
      ctx.fillStyle = '#c9d6df';
      ctx.font = '13px system-ui';
      ctx.fillText(row.label, width * 0.06, y + 6);

      // Player A's label, then bar, directly beneath it
      const aLabelY = y + rowH * 0.28;
      const aBarY = aLabelY + labelGap * 0.5;
      ctx.fillStyle = '#f4f5e9';
      ctx.font = '11px system-ui';
      ctx.fillText(`${t.players.a} · ${row.aVal} · ${t.percent(row.aPct)}`, barX, aLabelY);
      ctx.fillStyle = '#22303a';
      ctx.fillRect(barX, aBarY, barW, barH);
      ctx.fillStyle = '#f7c998';
      ctx.fillRect(barX, aBarY, barW * row.aPct, barH);

      // Player B's label, then bar, clearly below Player A's bar with a real gap
      const bLabelY = aBarY + barH + pairGap + labelGap * 0.5;
      const bBarY = bLabelY + labelGap * 0.5;
      ctx.fillStyle = '#f4f5e9';
      ctx.fillText(`${t.players.b} · ${row.bVal} · ${t.percent(row.bPct)}`, barX, bLabelY);
      ctx.fillStyle = '#22303a';
      ctx.fillRect(barX, bBarY, barW, barH);
      ctx.fillStyle = '#b4eed3';
      ctx.fillRect(barX, bBarY, barW * row.bPct, barH);
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#98aab7';
    ctx.font = '11px system-ui';
    ctx.fillText(t.labels.caption, width * 0.5, height * 0.97);
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
    defaultPreset: 1,
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
