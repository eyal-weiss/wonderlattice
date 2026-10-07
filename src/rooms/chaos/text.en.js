/* Random jumps, perfect triangle · visitor-facing words (English). */
Wonderlattice.defineText('chaos', 'en', {
  eyebrow: 'THE CHAOS GAME',
  name: 'Random jumps, perfect triangle',
  tagline:
    'Jump halfway to a corner picked at random, again and again, and a flawless fractal appears out of the noise.',
  title: 'Random jumps, perfect triangle.',
  subtitle:
    'A dot jumps halfway to a corner picked at random, again and again. Tap to start it somewhere else, or drag a corner.',
  field: 'Chance · Fractals · Repeated maps',
  sceneLabel: 'The chaos game',
  tip: 'Tap to start the dot there · Drag a corner to reshape the game · Enter makes one jump',
  actionLabel: 'One jump',
  canvasLabel:
    'The corners of a shape, and the dots left by a point that jumps part of the way towards a corner picked at random, again and again.',
  panelEyebrow: 'Change the game',
  whyLabel: 'Why does chance draw a perfect shape?',
  nudge:
    'Try four corners: plain fog. Then tick “Never the same corner twice” and watch a fractal come out of the fog.',
  connection: {
    html: '<strong>Two kinds of chaos.</strong> Here “chaos” is only the game’s name: start anywhere, and the same shape appears. In Weather twins, the smallest difference grows into a different future.',
    label: 'Weather twins',
  },

  presets: [
    { name: 'Three corners', note: 'Holes inside holes, and not one dot lands in them.' },
    { name: 'Four corners', note: 'Plain fog: the dots go everywhere.' },
    { name: 'Four, and a rule', note: 'Never the same corner twice: a fractal in the fog.' },
    { name: 'Five corners', note: 'Jump 61.8% of the way: five copies that just touch.' },
    { name: 'Barnsley’s fern', note: 'Four rules, each with its own chance.' },
  ],
  yourOwn: 'Your own game',

  corners: 'Corners',
  jump: 'How far each jump goes',
  jumpHint: 'The share of the way to the corner.',
  rule: 'Never the same corner twice in a row',
  fern: 'Grow Barnsley’s fern instead',

  // Drawn on the picture.
  jumps: (n, count) => `${n} ${count === 1 ? 'jump' : 'jumps'}`,
  caption: (percent, rule) =>
    rule
      ? `Each jump: ${percent}% of the way to a random corner, never the same one twice`
      : `Each jump: ${percent}% of the way to a random corner`,
  fernCaption: 'Each jump: one of four rules, picked by chance',

  // Over the picture, and read out once the picture settles.
  holeStatus: (n, none) => (none ? 'Dots in the middle hole: not one' : `Dots in the middle hole: ${n}`),
  jumpStatus: (n) => `Jumps so far: ${n}`,
  settled: (n) => `The picture has settled after ${n} jumps.`,

  guests: [
    {
      name: 'Wacław Sierpiński',
      note: 'In 1915 he described this triangle with holes inside holes. It was a curiosity then; now a die draws it in seconds.',
    },
    {
      name: 'Michael Barnsley',
      note: 'He gave the chaos game its name in the 1980s, and showed that a handful of rules like these can grow a fern.',
    },
  ],

  insight: {
    title: 'Why does chance draw a perfect shape?',
    html: `<p>Each jump follows one of three rules: halve your distance to corner A, to B or to C. Each rule shrinks the whole triangle onto a half-size copy at its corner. The three copies cover the triangle except for a hole in the middle, and each copy holds three smaller copies with a hole in their middle, and so on for ever. That is the <em>Sierpiński triangle</em>, the one shape made of exactly three half-size copies of itself. Each dot takes the colour of the corner it last jumped towards, so you can see the copies.</p>
<p>A dot on the shape always jumps to another point on the shape, into the copy at the chosen corner, so it can never land in a hole. A dot that starts anywhere else halves its distance to the shape with every jump, and after twenty jumps it is closer than a pixel. The first twenty jumps aren’t kept for that reason. The die decides only the order in which the dot visits the shape. The shape itself is fixed by the rules.</p>
<h3>Fog, and a rule that clears it</h3>
<p>Four half-size squares fill a square exactly, with nothing left over, so with four corners the dot goes everywhere: fog. Now forbid the same corner twice in a row. To land in the quarter-size square at a corner, the last two jumps must both have gone to that corner, so those squares stay empty, and so do the corners of every smaller copy: holes at every size. With the rule each jump depends on the one before, so this is no longer the plain game, but the same reasoning still draws its shape.</p>
<h3>Not the chaos of the weather</h3>
<p>“The chaos game” is Michael Barnsley’s name for it, and nothing here is chaotic in the scientist’s sense: start the dot anywhere, with other random numbers, and the same picture appears. The random numbers come from the computer’s generator, which follows a fixed recipe; they aren’t truly random, but they are random enough for this. The picture is made of a finite number of dots on a grid of pixels, so it can only approximate a shape with detail at every size.</p>
<details><summary>The mathematics, if you want it</summary><p>Each rule is a <em>contraction</em>: it brings any two points closer together. John Hutchinson proved in 1981 that any finite set of contractions has exactly one nonempty closed and bounded set that is the union of its own images, the <em>attractor</em> of this <em>iterated function system</em>. Michael Barnsley and Stephen Demko showed in 1985 that choosing the rules at random draws it: with probability 1 the dot comes close to every part of it. For a regular shape with n corners, the copies just touch when the dot keeps (3 − √5)/2 ≈ 38.2% of its distance with five corners, and a third with six. The Sierpiński triangle’s dimension is log 3 / log 2 ≈ 1.585: halve the size and you need three times as many pieces, not four. The square with the rule has the same dimension, for the same reason. The fern is four affine rules, chosen 1%, 85%, 7% and 7% of the time: one draws the stem, one the rest of the fern a size smaller, and two the lowest leaflets on each side, each a small copy of the whole fern.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Chaos_game" target="_blank" rel="noopener">Chaos game (Wikipedia)</a><a class="source-link" href="https://mathworld.wolfram.com/ChaosGame.html" target="_blank" rel="noopener">Chaos game (MathWorld)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle" target="_blank" rel="noopener">Sierpiński triangle (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barnsley_fern" target="_blank" rel="noopener">Barnsley fern (Wikipedia)</a><a class="source-link" href="https://doi.org/10.1512/iumj.1981.30.30055" target="_blank" rel="noopener">Hutchinson, Fractals and self similarity (1981)</a><a class="source-link" href="https://doi.org/10.1098/rspa.1985.0057" target="_blank" rel="noopener">Barnsley and Demko, Iterated function systems (1985)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Sierpinski/" target="_blank" rel="noopener">Wacław Sierpiński (MacTutor)</a></div>`,
  },
});
