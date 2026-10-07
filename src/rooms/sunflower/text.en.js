/* The sunflower's secret angle · visitor-facing words (English). */
Wonderlattice.defineText('sunflower', 'en', {
  eyebrow: 'GOLDEN ANGLE',
  name: 'The sunflower’s secret angle',
  tagline: 'Turn a little, drop a seed, repeat. Only one angle makes a sunflower.',
  title: 'The sunflower’s secret angle.',
  subtitle:
    'Each seed is turned a little from the last. Change the turn by a tenth of a degree and the sunflower falls apart.',
  field: 'Number theory · Phyllotaxis · Plants',
  sceneLabel: 'One turn · a thousand seeds',
  sceneName: 'The flower head',
  tip: 'Tap the flower to count its arms · ← → turn by 0.01°, ↑ ↓ by 0.1°',
  actionLabel: 'Grow it again',
  canvasLabel:
    'A sunflower head of a thousand seeds. Each seed is turned by the same angle from the one before, a little further out.',
  panelEyebrow: 'One angle, many flowers',
  whyLabel: 'Why does one angle make a sunflower?',
  nudge:
    'Find an angle that makes straight spokes, then change it by 0.01°. How many arms appear? Are they Fibonacci numbers?',
  connection: {
    html: '<strong>Alan Turing, again.</strong> He wondered how growing things make their patterns. In Grow a fingerprint, his chemistry lays down the ridges.',
    label: 'Grow a fingerprint',
  },

  presets: [
    { name: 'A sunflower', note: 'The golden angle.', badge: '137.5°' },
    { name: 'A tenth of a degree more', note: 'Gaps open between the arms.', badge: '137.6°' },
    { name: 'Three eighths of a turn', note: 'Eight straight spokes.', badge: '135°' },
  ],

  angle: 'Turn between seeds',
  nudgeGroup: 'Change the turn a little',
  // The buttons under the slider, given the step already written as the page writes numbers ("0.01°").
  more: (step) => `${step} more`,
  less: (step) => `${step} less`,
  arms: 'Show the arms, and count them',

  // The status line: what the eye sees near the rim (or where the visitor tapped). Counts are whole numbers.
  status: {
    growing: (seeds) => `Growing: ${seeds} seeds`,
    spokes: (q) => (q === 1 ? 'One straight line' : `${q} straight spokes`),
    gaps: (q) => `Gaps open between ${q} curved arms`,
    packed: (a, b) => `Packed tight: ${a} arms one way, ${b} the other`,
  },

  // Words drawn on the canvas: keep them short.
  labels: {
    degrees: (value) => `${value}°`, // the turn, already written as the page writes numbers
    golden: 'the golden angle',
    ofTurn: (p, q) => `${p}/${q} of a turn`,
    fibonacci: 'Fibonacci numbers',
  },

  guests: [
    {
      name: 'Leonardo of Pisa (Fibonacci)',
      note: 'In 1202 his book of calculation asked how fast rabbits breed. The answer, 1, 1, 2, 3, 5, 8, 13…, now carries his nickname.',
    },
    {
      name: 'Alan Turing',
      note: 'In his last years he worked on why plants set their leaves and seeds in Fibonacci spirals. In 2012, his centenary, the public grew sunflowers to test it.',
    },
  ],

  insight: {
    title: 'Why does one angle make a sunflower?',
    html: `<p>Each new seed is turned by the same angle from the one before and sits a little further out. If that turn is a simple fraction of a full turn, say 3/8, then every eighth seed lands on the same line from the centre: eight spokes, with empty wedges between them. A turn <em>close</em> to 3/8 bends those spokes into eight curved arms, with gaps between them.</p>
<div class="insight-visual">a turn of p/q → q spokes · close to p/q → q curved arms</div>
<h3>The angle that avoids every fraction</h3>
<p>To fill the head with no gaps, the turn has to stay away from every simple fraction. The golden angle, 360°/φ² ≈ 137.508° (φ = 1.618…, the golden ratio), does this better than any other: fractions approximate φ more slowly than any other number. Its best approximations are 1/3, 2/5, 3/8, 5/13, 8/21, 13/34 of a turn: ratios of Fibonacci numbers. That is why the two families of arms you can count are neighbouring Fibonacci numbers, 13 and 21 near the middle, 55 and 89 near the rim of a thousand seeds.</p>
<h3>Real sunflowers</h3>
<p>Plants aren’t this tidy. In the <em>Turing’s Sunflowers</em> citizen-science study of 657 flower heads, 565 of the 768 spiral counts were Fibonacci numbers, and 67 more had a related Fibonacci structure. The rest didn’t, and counts one less than a Fibonacci number turned up surprisingly often. Some heads had no clear spirals at all.</p>
<h3>What this model leaves out</h3>
<p>The model is told the angle; it doesn’t explain why a plant uses it. In a real flower head new buds form where a hormone, auxin, gathers, and each bud draws it away from its surroundings, so the next one forms elsewhere. Stéphane Douady and Yves Couder dropped magnetised droplets one after another onto oil, where they repel each other: each new drop settles as far as it can from the last ones, and at the right pace the golden angle appears by itself.</p>
<details><summary>The mathematics, if you want it</summary><p>A turn of 0.381966… has the continued fraction 1/(2 + 1/(1 + 1/(1 + …))), all 1s after the 2: no continued fraction closes in more slowly. Its best fractions, the convergents, are F<sub>k</sub>/F<sub>k+2</sub>: 1/3, 2/5, 3/8, 5/13… The nearest neighbours of a seed are a Fibonacci number of seeds before or after it, and that number grows roughly in step with the distance from the centre. Exactly 137.5° is 55/144 of a turn, so it makes 144 spokes, though only once there are a few thousand seeds.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1016/0025-5564(79)90080-4" target="_blank" rel="noopener">H. Vogel, A better way to construct the sunflower head (1979)</a><a class="source-link" href="https://doi.org/10.1098/rsos.160091" target="_blank" rel="noopener">J. Swinton, E. Ochu et al., Turing’s Sunflowers (2016)</a><a class="source-link" href="https://doi.org/10.1103/PhysRevLett.68.2098" target="_blank" rel="noopener">S. Douady, Y. Couder, Phyllotaxis as a self-organised growth process (1992)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Golden_angle" target="_blank" rel="noopener">Golden angle</a></div>`,
  },
});
