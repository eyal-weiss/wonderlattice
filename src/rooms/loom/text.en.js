/* The mathematical loom · visitor-facing words (English). */
Wonderloom.defineText('loom', 'en', {
  eyebrow: 'WEAVING',
  name: 'The mathematical loom',
  tagline: 'Flip one square in a tiny grid of yes and no, and the whole cloth changes.',
  title: 'The mathematical loom.',
  subtitle: 'Choose which threads rise. Watch cloth grow from a grid of yes and no.',
  field: 'Weaving · Binary patterns · Repetition',
  sceneLabel: 'A four-shaft loom',
  sceneName: 'Cloth from a draft',
  tip: 'Left: the draft · Right: its cloth · Click the tie-up to change it, or use its squares in the panel',
  tipStacked: 'Top: the draft · Below: its cloth · Click the tie-up, or use its squares in the panel',
  actionLabel: 'Surprise me',
  canvasLabel:
    'A weaving draft beside the cloth it produces. Change the tie-up by clicking it here, or with its squares in the panel.',
  panelEyebrow: 'Set up the loom',
  whyLabel: 'How does a grid make cloth?',
  nudge: 'Start with “Twill”, then switch one square of the tie-up. Every row woven with that pedal changes at once.',
  connection: {
    html: '<strong>One small rule, repeated everywhere.</strong> The tie-up decides every crossing in the cloth. In “A mind of many”, small rules between neighbours shape a whole crowd.',
    label: 'Visit “A mind of many”',
  },

  presets: [
    { name: 'Plain weave', note: 'Over one, under one.' },
    { name: 'Twill', note: 'A diagonal, like denim.' },
    { name: 'Houndstooth', note: 'Twill plus four dark, four light.' },
    { name: 'Stripes, not checks', note: 'Alternate the colours both ways.' },
    { name: 'Bird’s eye', note: 'Point it both ways: tiny diamonds.' },
    { name: 'Chevron', note: 'Turn the twill back on itself.' },
  ],

  tieup: 'Which threads lift for each pedal (the tie-up)',
  tieupHint:
    'Each shaft is a frame holding some of the lengthwise threads. A lit square means that pedal lifts that shaft.',
  tieupCell: (pedal, shaft) => `Pedal ${pedal} lifts shaft ${shaft}`,
  treadleLabel: (n) => `Pedal ${n}`,
  shaftLabel: (n) => `Shaft ${n}`,
  threading: 'Thread order',
  treadling: 'Pedal order',
  orders: ['Straight', 'Point', 'Broken', 'Doubled'],
  warpColours: 'Long threads',
  weftColours: 'Cross threads',
  colourOrders: ['All dark', '4 and 4', 'Alternating', '2 and 2', 'All light'],
  palette: 'Yarn',
  palettes: ['Indigo & cream', 'Madder & gold', 'Forest & linen', 'Night & silver'],

  repeat: (across, down) =>
    across === 1 && down === 1 ? 'One colour all over' : `Repeats every ${across} × ${down} threads`,
  float: (n) =>
    n === Infinity
      ? 'A thread never interlaces here. This cloth would fall apart.'
      : n === 1
        ? 'Every thread goes over one, under one: a firm cloth.'
        : n <= 3
          ? `Threads float over up to ${n} others: a softer, drapier cloth.`
          : `Floats of ${n} threads: long and loose, easy to snag.`,
  labels: { draft: 'DRAFT', cloth: 'CLOTH' },

  guests: [
    {
      name: 'Ada Lovelace',
      note: 'She described how Babbage’s engine, steered by punched cards like a Jacquard loom, could weave patterns of algebra.',
    },
  ],

  insight: {
    title: 'A grid that weaves.',
    html: `<p>Every cloth here comes from three short lists. The <em>threading</em> says which of four shafts each lengthwise (warp) thread passes through. The <em>tie-up</em> says which shafts each pedal (a treadle) lifts. The <em>treadling</em> says which pedal is pressed for each crosswise (weft) pass. Wherever a lifted warp thread crosses the weft, the warp shows on top.</p>
<div class="insight-visual">cloth = treadling × tie-up × threading, a product of grids of 0s and 1s</div>
<h3>Small change, whole cloth</h3>
<p>Switch one square of the tie-up and every pass woven with that pedal changes at once. Weavers design on paper this way: the grid on the left of the picture is a real weaving draft.</p>
<h3>Colour is a second pattern</h3>
<p>Colour the threads too, and the weave and the colour order combine. A 2/2 twill with four dark and four light threads each way makes houndstooth. Plain weave with alternating colours makes stripes, not the check you might expect.</p>
<h3>Floats hold cloth together</h3>
<p>A thread that passes over several others without interlacing is a float. Short floats make firm cloth; long floats make it soft and easy to snag. A thread that never interlaces makes no cloth at all.</p>
<details><summary>The mathematics, if you want it</summary><p>Write the threading as a grid H (warp thread j sits on shaft s), the tie-up as U (treadle t lifts shaft s), and the treadling as T (pass i uses treadle t). The cloth is D = T · U · Hᵀ, with Boolean arithmetic, where 1 + 1 = 1. Because the three lists repeat, so does the cloth: its repeat divides the least common multiple of the list lengths and colour orders.</p><p>This loom has four shafts and four treadles, like many table and floor looms. Real cloth also depends on yarn, spacing, and tension, which this picture leaves out.</p></details>
<div class="sources"><a class="source-link" href="https://www.tandfonline.com/doi/abs/10.1080/0025570X.1980.11976845" target="_blank" rel="noopener">Satins and twills: the geometry of fabrics (Grünbaum &amp; Shephard)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Houndstooth" target="_blank" rel="noopener">How houndstooth is woven</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/" target="_blank" rel="noopener">Ada Lovelace and the Jacquard loom</a></div>`,
  },
});
