/* A seed for an infinite landscape · visitor-facing words (English). */
Wonderlattice.defineText('julia', 'en', {
  eyebrow: 'FRACTALS',
  name: 'A seed for an infinite landscape',
  tagline: 'One rule, repeated, draws endless coastlines. Move the seed and watch them change.',
  title: 'A seed for an infinite landscape.',
  subtitle:
    'One tiny rule, repeated: square a number and add a seed. Drag the seed and an endless landscape changes shape.',
  field: 'Complex numbers · Repetition · Fractals',
  sceneLabel: 'One rule · z → z² + c',
  tip: 'Drag the seed on the small map, or use the arrow keys · Tap the big picture to follow one point’s journey',
  actionLabel: 'Walk the edge',
  canvasLabel:
    'A large Julia set for the rule z → z² + c, and a small map of seeds, the Mandelbrot set, with the chosen seed marked.',
  panelEyebrow: 'Choose a seed',
  whyLabel: 'How can one rule draw all this?',
  nudge:
    'Drag the seed out of the dark shape on the small map. The landscape shatters into dust. Bring it back inside, and it is one piece again.',
  connection: {
    html: '<strong>Complex numbers can move a whole plane.</strong> Here one small rule is repeated again and again; in the next room, a single function bends the plane in one go.',
    label: 'Bend the plane',
  },

  presets: [
    { name: 'Rabbit', note: 'Three ears, turning round and round.' },
    { name: 'Dendrite', note: 'Branches with no room inside.' },
    { name: 'San Marco', note: 'A basilica and its reflection.' },
    { name: 'Siegel disc', note: 'Points circle a hidden centre forever.' },
    { name: 'Dust', note: 'Outside the map: a cloud of specks.' },
  ],
  yourOwn: 'Your own landscape',

  labels: {
    julia: 'The landscape of this seed',
    map: 'The map of seeds',
  },
  seed: (z) => `c = ${z}`,
  onePiece: 'One piece',
  dust: 'Dust',
  status: (inside) => (inside ? 'Seed inside the map: one piece' : 'Seed outside the map: dust'),

  re: 'Seed, across',
  im: 'Seed, up',
  reHint: 'The real part of c.',
  imHint: 'The imaginary part of c.',
  journey: 'Show one point’s journey',

  readout: {
    seed: 'The seed',
    landscape: 'The landscape',
    journey: 'One point’s journey',
  },
  landscape: (inside) =>
    inside
      ? 'One connected piece: the seed is inside the dark shape on the map.'
      : 'Dust: the seed is outside the dark shape, so the landscape falls apart into specks.',
  orbitHint: 'Tap the big picture to follow one point.',
  escapes: (n) => `It flies away after ${n} ${n === 1 ? 'step' : 'steps'}.`,
  stays: (n) => `It stays trapped: still near the centre after ${n} steps.`,

  guests: [
    {
      name: 'Gaston Julia',
      note: 'In 1918, with no computer at all, he studied what repeating a rule does to every point of the plane.',
    },
    {
      name: 'Benoit Mandelbrot',
      note: 'In 1980 his computer pictures made the map of seeds famous. He also coined the word “fractal”.',
    },
  ],

  insight: {
    title: 'How can one rule draw all this?',
    html: `<p>Pick a seed c. Start from a point z, square it and add c, then do the same again and again. Some starting points run off to infinity; others stay trapped near the centre forever. The glowing coastline in the big picture is the border between the two: the <em>Julia set</em> of c. The colours show how long each point hesitates near the coast before it flies away.</p>
<div class="insight-visual">z → z² + c → (z² + c)² + c → …</div>
<h3>The map of seeds</h3>
<p>Every point of the small map is a seed. It is dark when the journey that starts at 0 stays trapped. That dark shape is the <em>Mandelbrot set</em>, and it works as a catalogue: for every seed inside it, the landscape is one connected piece, and for every seed outside it, the landscape falls apart into dust.</p>
<h3>Infinitely detailed, drawn approximately</h3>
<p>Look closely at any coastline and there is more coastline: the rabbit’s ears have ears. So these pictures can only be approximations. Here each point is followed for at most 200 steps (fewer while the seed moves), which means a point that would escape later is drawn as trapped, and the finest threads can be missing or blurred.</p>
<details><summary>The mathematics, if you want it</summary><p>Write f(z) = z² + c. Once |z| &gt; 2 and |z| ≥ |c|, the journey is certain to grow without bound, so the computer can stop there. The points that never escape form the filled Julia set, and its boundary is the Julia set. The colours use a smooth escape count, n + 1 − log₂(ln |z|), which removes stripes. Gaston Julia and Pierre Fatou showed in 1918–1919 that the Julia set is connected exactly when the journey of 0 stays bounded, and is dust otherwise. So the Mandelbrot set, first drawn by Robert Brooks and Peter Matelski in 1978 and made famous by Benoit Mandelbrot’s pictures in 1980, is the set of seeds with a connected landscape. Heinz-Otto Peitgen and Peter Richter’s book <em>The Beauty of Fractals</em> (1986) brought these pictures to a wide audience.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Julia_set" target="_blank" rel="noopener">Julia set (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mandelbrot_set" target="_blank" rel="noopener">Mandelbrot set (Wikipedia)</a><a class="source-link" href="https://doi.org/10.1007/978-3-642-61717-1" target="_blank" rel="noopener">Peitgen and Richter, The Beauty of Fractals (1986)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Julia/" target="_blank" rel="noopener">Gaston Julia (MacTutor)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Mandelbrot/" target="_blank" rel="noopener">Benoit Mandelbrot (MacTutor)</a></div>`,
  },
});
