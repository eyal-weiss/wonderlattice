/* The shape hiding inside randomness · visitor-facing words (English). */
Wonderlattice.defineText('galton', 'en', {
  eyebrow: 'PROBABILITY',
  name: 'The shape hiding inside randomness',
  tagline: 'Every ball bounces left or right at random. Together they build the same bell every time.',
  title: 'The shape hiding inside randomness.',
  subtitle:
    'Each ball bounces left or right at random, yet the heap grows into the same bell every time. Then average a lopsided die.',
  field: 'Probability · Pascal’s triangle · The central limit theorem',
  canvasLabel:
    'A board of pegs. Balls fall from the top, bounce left or right at random at every peg, and pile up in bins at the bottom, under a bell-shaped curve. Below it, four more pours have made the same bell.',
  panelEyebrow: 'Left to chance',
  whyLabel: 'Why does randomness make a bell?',
  nudge:
    'Pour again: every ball takes a new path, and the heap still makes the same bell. Then design a lopsided die and watch its averages.',
  connection: {
    html: '<strong>Averages tame chance.</strong> In A spoonful of a city, a small random poll lands close to the truth for the same reason: averages of many random answers crowd into a narrow bell.',
    label: 'Take a spoonful of a city',
  },

  // The three things that fall: each has its own scene, tip and action.
  viewLabel: 'What falls',
  views: ['Balls on pegs', 'A lopsided die', 'A stubborn spinner'],
  scenes: [
    { label: 'Left or right at every peg', name: 'Balls on pegs' },
    { label: 'Your die, and averages of its throws', name: 'A lopsided die' },
    { label: 'A lamp spins and shines at a wall', name: 'A stubborn spinner' },
  ],
  tips: [
    'Arrow keys tilt the pegs · Pour again for new balls',
    'Drag the die’s bars to reshape it · Arrow keys pick a face and change it',
    'Each spin marks where the light lands · Spin again for new spins',
  ],
  actions: ['Pour again', 'Throw again', 'Spin again'],
  canvasLabels: [
    'A board of pegs. Balls fall from the top, bounce left or right at random at every peg, and pile up in bins at the bottom, under a bell-shaped curve. Below it, four more pours have made the same bell.',
    'A lopsided die drawn as six bars, and three heaps beside it: single throws, averages of 2 throws and averages of more throws, each with a bell-shaped curve over it.',
    'A lamp spins and shines at a wall; the heap of where single spins land and the heap of averages of several spins have the same shape.',
  ],

  presets: [
    { name: 'Balls on pegs', note: 'The same bell every time.', badge: '½' },
    { name: 'Tilt the pegs', note: 'The bell moves over.', badge: '¾' },
    { name: 'A lopsided die', note: 'Its averages turn into a bell.', badge: '1·6' },
  ],

  rows: 'Rows of pegs',
  tilt: 'Chance of bouncing right',
  tiltHint: 'At 50% every peg is fair. Tilt them, and the bell moves over.',
  throws: 'Throws in each average',
  dieHint: 'Drag the bars of the die in the picture to reshape it.',
  shapeLabel: 'Start from',
  shapes: ['Mostly 1s and 6s', 'A fair die', 'Mostly 6s'],
  spins: 'Spins in each average',
  spinHint: 'Averaging more spins doesn’t help: the spinner has no finite spread for the bell to need.',

  status: {
    pouring: (n) => `${n.toLocaleString('en')} ${n === 1 ? 'ball' : 'balls'} · left or right at random at every peg`,
    poured: (n) => `${n.toLocaleString('en')} balls · the same bell every time`,
    throwing: (n) => `${n.toLocaleString('en')} in each heap`,
    spinning: (n) => `${n.toLocaleString('en')} in each heap`,
  },
  announce: {
    poured: (n) => `${n.toLocaleString('en')} balls have landed, in the shape of the bell.`,
    die: (face, weight) => `Face ${face}: ${weight} of 10`,
  },

  labels: {
    bell: 'the bell',
    others: (pours, balls) => `${pours} more pours of ${balls.toLocaleString('en')} balls: the same bell`,
    yourDie: 'Your die · drag the bars',
    oneThrow: 'One throw',
    average: (n) => `Averages of ${n} throws`,
    oneSpin: 'One spin',
    averageSpins: (n) => `Averages of ${n} spins`,
    off: (n) => `${n.toLocaleString('en')} off the chart`,
    lamp: 'lamp',
    wall: 'wall',
  },

  guests: [
    {
      name: 'Abraham de Moivre',
      note: 'In 1733 I showed that the number of heads in thousands of coin tosses follows a smooth, bell-shaped curve.',
    },
    {
      name: 'Pierre-Simon Laplace',
      note: 'I showed that the bell reaches far beyond coins: averages of many kinds of random measurement crowd into it.',
    },
  ],

  insight: {
    title: 'Why does randomness make a bell?',
    html: `<p>Every ball makes the same kind of choice at each peg: left or right. To land at the far edge, it must go the same way every time, and only one path does that. To land in the middle, it needs as many lefts as rights, and hundreds of paths do. Counting the paths to each bin gives a row of Pascal’s triangle (1, 12, 66, 220, 495, 792, 924, … for twelve rows), and those counts make the bell. No single ball knows where it is going; the shape comes from counting.</p>
<div class="insight-visual">12 rows of pegs: 1 path to each edge, 924 paths to the middle, out of 4,096</div>
<h3>Averages make the same bell</h3>
<p>The die’s single throws keep its lopsided shape. Average two throws and a peak appears in the middle, with the odd shape still showing; average ten and the heap becomes more bell-like and narrower. This is the central limit theorem: averages of many independent throws, of almost any die, crowd into a bell around the die’s mean, and the bell narrows like 1/√n. Averages of 10 throws spread about √10, a little over 3 times, less than single throws.</p>
<h3>When it fails</h3>
<p>The theorem needs throws that don’t affect each other and whose spread is finite. The stubborn spinner breaks the second rule: a lamp that spins at random sometimes shines almost along the wall, so a few spins land enormously far away. Its averages are as wild as a single spin, however many you take. That spinner follows the Cauchy distribution, named after Augustin-Louis Cauchy.</p>
<h3>What this room simplifies</h3>
<p>The balls follow a random model, not physics: each peg is a coin toss, fair or tilted, independent of the others. Real boards are never perfectly fair, and real balls bounce and spin, so their heaps are rougher. Averages of 2 or 5 throws are closer to a bell, not exactly one.</p>
<details><summary>The mathematics, if you want it</summary><p>With n rows and a chance p of bouncing right, a ball lands in bin k (k bounces right) with chance C(n, k)·pᵏ·(1 − p)ⁿ⁻ᵏ, the binomial distribution, with mean np and spread √(np(1 − p)). Abraham de Moivre showed in 1733, and in the second edition of his <em>Doctrine of Chances</em> (1738), that for many tosses this is close to the normal curve; Pierre-Simon Laplace published a more general result in his <em>Théorie analytique des probabilités</em> (1812). Francis Galton designed the board, which he called the quincunx, for a lecture at the Royal Institution in 1874, and described it in <em>Natural Inheritance</em> (1889). The average of n Cauchy spins has exactly the same distribution as a single spin.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Galton_board" target="_blank" rel="noopener">Galton board</a><a class="source-link" href="https://en.wikipedia.org/wiki/De_Moivre%E2%80%93Laplace_theorem" target="_blank" rel="noopener">De Moivre–Laplace theorem</a><a class="source-link" href="https://en.wikipedia.org/wiki/Central_limit_theorem" target="_blank" rel="noopener">Central limit theorem</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cauchy_distribution" target="_blank" rel="noopener">Cauchy distribution</a></div>`,
  },
});
