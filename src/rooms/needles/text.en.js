/* Needles that know π · visitor-facing words (English). */
Wonderlattice.defineText('needles', 'en', {
  eyebrow: 'GEOMETRIC PROBABILITY',
  name: 'Needles that know π',
  tagline: 'Drop needles on floorboards and count how many land across a line. Out comes π.',
  title: 'Needles that know π.',
  subtitle: 'Needles rain onto a plank floor. Count the ones across a line, and π appears. Then bend them.',
  field: 'Probability · Buffon’s needle · Barbier’s noodle',
  sceneLabel: 'A plank floor · Needles at random',
  tip: 'The needles fall by themselves · Choose a shape, or rerun a famous lucky result',
  actionLabel: 'Throw again',
  canvasLabel:
    'Needles falling at random onto a floor of planks; those that land across a line between planks glow. Below, a chart of the estimate of π as the needles pile up.',
  panelEyebrow: 'Change the needles',
  whyLabel: 'Why does π appear?',
  nudge:
    'Try a ring as wide as a plank: it crosses exactly two lines every time. That one fact is the key to the whole puzzle.',
  connection: {
    html: '<strong>A ring as wide as a plank always crosses twice.</strong> So does every shape of constant width, which is why each one’s rim is π times its width.',
    label: 'Roll the shapes of constant width',
  },

  presets: [
    { name: 'Needles on planks', note: 'Count the crossings: π appears.', badge: 'π' },
    { name: 'Bend them', note: 'Same length, just as many crossings.', badge: '~' },
    { name: 'A lucky scientist', note: 'Rerun a result too good to be true.', badge: '1901' },
  ],

  shape: 'The shape',
  shapes: ['Needle', 'Zigzag', 'Noodle', 'Ring'],
  // What the picture shows, by shape (the last: Lazzarini's reruns).
  sceneNames: ['Straight needles', 'Zigzags', 'Noodles', 'Rings one plank wide', 'Lazzarini’s needles'],
  length: 'Length, as a share of a plank’s width',
  lucky: 'Rerun Lazzarini’s 1901 experiment, 3,408 needles at a time',

  status: {
    raining: (needles) => `${needles} needles so far`,
    done: (needles, pi) => `${needles} needles: π ≈ ${pi}`,
    rings: (rings) => `${rings} rings, 2 crossings each`,
    reruns: (runs) => `${runs} ${runs === 1 ? 'rerun' : 'reruns'} of 3,408 needles`,
  },

  readout: {
    guess: (pi) => `π ≈ ${pi}`,
    thrown: 'Needles thrown',
    across: 'Landed across a line',
    off: 'Off by',
    sameRule: 'Bent or straight: the same length crosses as many lines, on average.',
    rule: 'π ≈ 2 × length × needles ÷ crossings, with lengths in planks.',
    ring: 'Every ring crosses exactly 2 lines',
    rings: 'Rings thrown',
    ringRule:
      'A ring as wide as a plank is π planks round, so every π planks of length cross 2 lines, bent or straight.',
    typical: (miss) => `Typical miss: ${miss}`,
    reruns: 'Reruns',
    exact: 'Exactly 355/113, like Lazzarini',
    his: 'Lazzarini’s miss',
    luckyRule:
      'Half the reruns miss π by more than the typical miss. His needles and his count make 355/113 a possible answer, yet even so it comes up only about once in 70 runs.',
  },

  // Words drawn in the picture: short.
  labels: {
    tally: (needles, across) => `${needles} needles · ${across} across a line`,
    rings: (n) => `${n} rings`,
    guess: (pi) => `π ≈ ${pi}`,
    ring: '2 crossings, every time',
    chart: 'The guess, as needles pile up',
    typical: 'typical miss',
    pi: 'π',
    count: 'How many lines each ring crosses',
    every: 'every ring',
    run: (k) => `Rerun ${k}`,
    hits: (runs, exact) => `${runs} reruns · ${exact} gave 355/113`,
    reruns: 'Each dot: one rerun of 3,408 needles',
    his: 'Lazzarini, 1901',
  },

  announce: {
    done: (pi) => `A million needles: π ≈ ${pi}.`,
    ring: 'Every ring crosses exactly two lines.',
    lucky: (miss) => `Typical miss of a rerun: ${miss}. Lazzarini’s: 0.0000003.`,
  },

  guests: [
    {
      name: 'Georges-Louis Leclerc, Comte de Buffon',
      note: 'I asked how often a stick, tossed onto a floor of narrow boards, lands across a crack between them. I put the question in 1733 and printed the answer in 1777.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'In 1860 I noticed that the needle can be bent any way you like: as long as its length stays the same, it crosses the lines just as often on average.',
    },
  ],

  insight: {
    title: 'Why does π appear?',
    html: `<p>A needle as long as a plank is wide lands across a line with a chance of 2/π, about 64%. So after many throws, crossings ÷ needles ≈ 2/π, and π ≈ 2 × needles ÷ crossings. Shorter needles cross less often, in proportion to their length. Georges-Louis Leclerc, Comte de Buffon, posed the question in 1733 and published the answer in 1777.</p>
<div class="insight-visual">chance of a crossing = 2 × length ÷ (π × plank width)</div>
<h3>Bend the needle</h3>
<p>Cut a needle into short pieces. Each piece crosses lines, on average, in proportion to its length, wherever it sits in the needle, and averages add up even when the pieces move together. So any shape crosses, on average, a number of lines proportional to its length: bent, straight or curled. Joseph-Émile Barbier saw this in 1860. To find the constant, take a ring exactly as wide as a plank. Wherever it lands, it crosses exactly two lines. It is π planks round, so every π planks of length cross 2 lines on average: 2 × length ÷ π, the needle’s rule. The same trick shows that every shape of constant width, like the Reuleaux triangle, has a rim π times its width.</p>
<h3>Randomness measures slowly</h3>
<p>The guess wobbles less as needles pile up, but only like 1 ÷ √(number of needles): each extra correct digit costs about 100 times more needles. A million needles usually give π to two or three decimals.</p>
<h3>The lucky scientist</h3>
<p>In 1901 Mario Lazzarini reported 3,408 throws of needles 5/6 of a plank long. That gives π ≈ 355/113 = 3.1415929…, wrong only in the seventh decimal, when an experiment that size typically misses by a few hundredths. His choices make 355/113 one of the possible answers: it needs exactly 1,808 crossings, which an honest run gives about once in 70. And someone who throws in batches of 213 and stops the first time the count is right gets there within 3,408 throws more than one time in four. Lee Badger (1994) argued that the figures were very unlikely to come from an honest experiment; others think the article was meant as a joke. Either way, a result that is too good is evidence of something else.</p>
<h3>What this room simplifies</h3>
<p>The computer’s pseudo-random numbers stand in for real throws. They choose each needle’s direction without using π: a random point in a square, kept only if it falls inside the circle, gives every direction the same chance. The floor’s lines go on for ever, so a needle near the edge of the picture still counts. Real needles bounce, roll and land on each other, and real boards are never perfectly even.</p>
<details><summary>The mathematics, if you want it</summary><p>Lines are a distance t apart, and a needle of length l ≤ t lands with its middle a distance x from the nearest line (even between 0 and t/2) and at an angle θ to the lines (even between 0 and π/2). It crosses when x ≤ (l/2) sin θ, so P = (2/t)(2/π) ∫₀^{π/2} (l/2) sin θ dθ = 2l/(πt). With n needles and c crossings, π ≈ 2ln/(tc); its typical error is π√((1 − p)/(pn)) with p = 2l/(πt): 0.04 for 3,408 needles one plank long, 0.05 for Lazzarini’s. Lazzarini’s needle makes the estimate (5/3) × n/c, and 355/113 = (5/3) × 3,408/1,808. The room’s tests check, against a separate program: the crossing rate 2l/π for straight needles, zigzags and noodles; exactly two crossings for every ring; the typical errors above; and, for Lazzarini’s set-up, 1,808 crossings with a chance of 1.4%, and a median miss of 0.034. Buffon, “Essai d’arithmétique morale”, Histoire naturelle, Supplément 4 (1777). E. Barbier, J. Math. Pures Appl. (2) 5 (1860). L. Badger, “Lazzarini’s lucky approximation of π”, Mathematics Magazine 67 (1994).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_needle_problem" target="_blank" rel="noopener">Buffon’s needle problem (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_noodle" target="_blank" rel="noopener">Buffon’s noodle (Wikipedia)</a><a class="source-link" href="https://mathworld.wolfram.com/BuffonsNeedleProblem.html" target="_blank" rel="noopener">Buffon’s needle problem (MathWorld)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Buffon/" target="_blank" rel="noopener">Buffon (MacTutor)</a></div>`,
  },
});
