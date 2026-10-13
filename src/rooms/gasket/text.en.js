/* Circles all the way down · visitor-facing words (English). */
Wonderlattice.defineText('gasket', 'en', {
  eyebrow: 'KISSING CIRCLES',
  name: 'Circles all the way down',
  tagline: 'Fill every gap with the biggest circle that fits, for ever, and every circle gets a whole number.',
  title: 'Circles all the way down.',
  subtitle:
    'Every gap gets the biggest circle that fits, for ever. The number in a circle is its bend, 1 ÷ its radius: always whole. Tap any circle.',
  field: 'Geometry · Whole numbers · Fractals',
  sceneLabel: 'Bend = 1 ÷ radius',
  tip: 'Tap a circle to see its rule · Drag a starting circle to resize it · Pinch, scroll, or + and −, to zoom · Enter picks a circle',
  actionLabel: 'Dive in',
  canvasLabel:
    'A big circle filled with smaller and smaller circles that touch each other, each with its bend written inside it.',
  panelEyebrow: 'Choose the starting circles',
  whyLabel: 'Why are they all whole numbers?',
  nudge:
    'Make one starting circle a little bigger, by dragging it or with its slider: the whole numbers turn into decimals. Then tap Halves to bring them back.',
  connection: {
    html: '<strong>Another picture with no bottom.</strong> Here one rule fills gaps with circles for ever; in the next room, one rule, repeated, draws coastlines that never end.',
    label: 'An infinite landscape',
  },

  presets: [
    { name: 'Halves', note: '−1, 2, 2, 3: two circles, each half as wide as the big one.' },
    { name: 'Thirds', note: '−2, 3, 6, 7: two thirds and one third of the width.' },
    { name: 'Quarters', note: '−3, 4, 12, 13: three quarters and one quarter.' },
    { name: 'Nudged', note: 'One circle a little bigger: not one whole number left.' },
  ],
  yourOwn: 'Your own circles',

  left: 'Left circle’s bend',
  right: 'Right circle’s bend',
  bendHint: 'A bigger bend is a smaller circle.',

  readout: {
    tapped: 'The circle you tapped',
    rule: 'Where its number comes from',
    all: 'All the bends drawn',
  },
  tapHint: 'Tap any circle, however small.',
  bend: (b) => `Bend ${b}`,
  outer: (b) => `Bend ${b}: the big circle curves the other way round the rest, so its bend counts as negative.`,
  ruleWords: 'Twice the bends of the three it touches (blue), minus the bend of the circle across from it (dashed).',
  whole: (n, low, high) => `Whole numbers, from ${low} to ${high}, in ${n} circles`,
  notWhole: (n) => `Not whole numbers: ${n} circles`,

  // Over the picture.
  status: (whole) => (whole ? 'Every bend a whole number' : 'Bends with decimals'),
  zoom: (x) => `×${x}`,
  bigCircle: 'Big circle',

  // Read out once, when a circle is tapped or a dive ends.
  told: (b, rule) => `Bend ${b}. ${rule}`,
  dived: (x, high) => `Magnified ${x} times. The biggest bend drawn is ${high}.`,

  guests: [
    {
      name: 'René Descartes',
      note: 'In 1643 he wrote to Princess Elisabeth about circles that touch, and gave the rule for their bends without saying how he found it.',
    },
    {
      name: 'Elisabeth of the Palatinate',
      note: 'She worked on the circle problem Descartes sent her in 1643. Her partial answers led him to the case of four touching circles.',
    },
    {
      name: 'Frederick Soddy',
      note: 'A chemist with a Nobel Prize, he found the rule again in 1936 and published it in the journal Nature as a poem, The Kiss Precise.',
    },
  ],

  insight: {
    title: 'Why are they all whole numbers?',
    html: `<p>Call 1 divided by a circle’s radius its <em>bend</em>: a small circle bends sharply, a big one gently. The big outside circle gets a negative bend, because it curves the other way round the circles inside it. Four circles that all touch each other then obey one rule, Descartes’s circle theorem:</p>
<div class="insight-visual">(b₁ + b₂ + b₃ + b₄)² = 2 × (b₁² + b₂² + b₃² + b₄²)</div>
<p>For the first four circles of Halves, −1, 2, 2 and 3: 6² = 36, and 2 × (1 + 4 + 4 + 9) = 36.</p>
<h3>Whole numbers in, whole numbers out</h3>
<p>Take three circles that touch each other. Exactly two circles touch all three, one on each side, and the rule is a quadratic equation for their bends. The two answers of a quadratic equation add up to a number you can read off its coefficients: here, twice the three bends. So once one of the two circles is known, the other has bend 2 × (b₁ + b₂ + b₃) − b₄. That is only doubling, adding and taking away. Every new circle fills a gap beside circles already there, so when the first four bends are whole numbers, every bend in the picture is a whole number too, however small the circle. A tap shows this for any circle: the three blue circles it touches, and the dashed one across from it.</p>
<p>It works only from whole numbers. Nudge a starting circle and the bends turn into decimals; only special starting circles, like the presets, give whole numbers everywhere. The centres follow the same rule, written as complex numbers and multiplied by their bends, which is how the picture is drawn.</p>
<h3>Drawn approximately</h3>
<p>The real gasket never ends: every gap holds infinitely many circles. The picture stops at circles about a pixel wide, and zooming in draws the next ones. Its fractal dimension is about 1.3057, between that of a curve (1) and that of a filled region (2).</p>
<details><summary>Which whole numbers? Still being discovered</summary><p>Not every whole number can appear. In Halves, every bend leaves a remainder of 2, 3, 6, 11, 14, 15, 18 or 23 when divided by 24. In a paper published in 2003, Ronald Graham, Jeffrey Lagarias, Colin Mallows, Allan Wilks and Catherine Yan conjectured that, in a gasket like this, every large enough number with an allowed remainder eventually appears: the local–global conjecture. In 2023 Summer Haag, a graduate student, and Clyde Kertzer, an undergraduate, working with Katherine Stange and James Rickards at the University of Colorado Boulder, showed that it is false: in many gaskets, whole families of allowed numbers never appear. The gasket that starts with −3, 5, 8 and 8, for example, has no square bend at all, although its remainders allow squares such as 36 and 144. Their paper was published in the <em>Annals of Mathematics</em> in 2024. That every bend is a whole number was never in doubt; which whole numbers appear is still being studied.</p></details>
<details><summary>Who found the rule</summary><p>René Descartes described it in 1643, in letters to Princess Elisabeth of the Palatinate, without saying how he found it. Jakob Steiner found it again in 1826, Philip Beecroft in 1842 and the chemist Frederick Soddy in 1936, who published it in <em>Nature</em> as a poem, <em>The Kiss Precise</em>. The gasket is named after Apollonius of Perga, who in the third century BC wrote a book, now lost, about circles touching three given ones. The earliest known description of the gasket itself is by Gottfried Leibniz, in 1706.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Descartes%27_theorem" target="_blank" rel="noopener">Descartes’ theorem (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Apollonian_gasket" target="_blank" rel="noopener">Apollonian gasket (Wikipedia)</a><a class="source-link" href="https://arxiv.org/abs/math/0101066" target="_blank" rel="noopener">Lagarias, Mallows and Wilks, Beyond the Descartes circle theorem (2002)</a><a class="source-link" href="https://arxiv.org/abs/math/0009113" target="_blank" rel="noopener">Graham, Lagarias, Mallows, Wilks and Yan, Apollonian circle packings: number theory (2003)</a><a class="source-link" href="https://arxiv.org/abs/2307.02749" target="_blank" rel="noopener">Haag, Kertzer, Rickards and Stange, The local-global conjecture for Apollonian circle packings is false (2024)</a><a class="source-link" href="https://www.quantamagazine.org/two-students-unravel-a-widely-believed-math-conjecture-20230810/" target="_blank" rel="noopener">Two students unravel a widely believed math conjecture (Quanta Magazine)</a><a class="source-link" href="https://doi.org/10.1038/1371021a0" target="_blank" rel="noopener">Soddy, The Kiss Precise (Nature, 1936)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/" target="_blank" rel="noopener">René Descartes (MacTutor)</a></div>`,
  },
});
