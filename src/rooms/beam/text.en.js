/* The ruler on its edge · visitor-facing words (English). */
Wonderlattice.defineText('beam', 'en', {
  eyebrow: 'BEAMS',
  name: 'The ruler on its edge',
  tagline:
    'Stand a steel plank on its edge and it’s 36 times stiffer. Paint your own beam and find where the steel should go.',
  title: 'The ruler on its edge.',
  subtitle:
    'A steel beam with a weight in its middle, and its cross-section below. Turn it on its edge, or paint the 24 squares of steel anywhere, and watch the sag.',
  field: 'Second moment of area · Euler–Bernoulli beam theory · I-beams',
  sceneLabel: 'A steel beam and its cross-section',
  sceneNames: {
    plank: 'A flat plank',
    edge: 'On its edge',
    ibeam: 'An I-beam',
    own: 'Your own beam',
    none: 'No steel yet',
  },
  tip: 'Tap or drag across the squares to add or take away steel · Arrow keys move, Enter paints, Backspace undoes',
  actionLabel: 'Turn it 90°',
  canvasLabel:
    'A steel beam resting on two supports, with a 100 kg weight hanging from its middle, above a 12 by 12 grid of its cross-section. Tap or drag across the grid to add or take away squares of steel, or use the arrow keys and Enter.',
  panelEyebrow: 'Steel and shape',
  whyLabel: 'Why does the edge win?',
  nudge:
    'Can you beat the plank on its edge with the same 24 squares? Then cut the thin web that joins the top of your best beam to its bottom: how stiff are the two loose halves?',
  connection: {
    html: '<strong>Steel where it counts.</strong> A truss is a beam with most of its middle taken away: the bars along its top are squeezed, the bars along its bottom stretched, and triangles hold them together. See it in “The stubborn triangle”.',
    label: 'Visit “The stubborn triangle”',
  },

  presets: [
    { name: 'A flat plank', note: '12 cm wide and 2 cm thick, lying flat.' },
    { name: 'On its edge', note: 'The same plank, turned 90°.' },
    { name: 'An I-beam', note: 'Steel at the top and bottom, a thin web between.' },
  ],

  undo: 'Undo',
  clear: 'Clear',

  // Drawn in the picture: keep these short.
  picture: {
    caption: '3 m of steel, with 100 kg in the middle',
    drawn: (n) => `The sag is drawn ${n} times larger`,
    drawnShort: (n) => `Sag drawn ${n}× larger`,
    weight: '100 kg',
    sag: (mm) => `Sag ${mm} mm`,
    beyond: 'Sag over 10 cm',
    none: 'No steel',
    section: 'Cross-section',
    unit: '1 square = 1 cm',
    squares: (used, total) => `${used} of ${total} squares`,
    stiffness: 'Stiffness',
    times: (x) => `${x}× the flat plank`,
    timesShort: (x) => `${x}×`,
    chart: 'Same steel, different shapes: how stiff?',
    rows: { plank: 'Flat plank', edge: 'On its edge', ibeam: 'An I-beam', yours: 'Yours' },
    marks: { plank: 'Flat plank', edge: 'On its edge', best: 'Best with 24' },
    key: { squeezed: 'Squeezed', stretched: 'Stretched', axis: 'Neither' },
    loose: (k) => `${k} loose pieces: each bends on its own`,
    wobbly: 'Wobbly: it could tip over sideways',
    full: 'No steel left: tap a square to take it away',
    best: 'As stiff as 24 squares can be',
  },

  // The panel's readout and the status line.
  status: {
    sag: (mm) => `Sag ${mm} mm`,
    said: (mm, x) => `Sag ${mm} mm, ${x} times as stiff as the flat plank`,
    beyond: 'Sag over 10 cm',
    none: 'No steel',
  },
  readout: {
    sag: (mm) => `Sag ${mm} mm`,
    times: (x) => `${x}× the flat plank`,
    plank: 'The flat plank',
    used: (used, total) =>
      used === total ? `All ${total} squares of steel used.` : `${used} of ${total} squares of steel used.`,
    none: 'Paint some squares of steel in the grid.',
    beyond: 'Past 10 cm, the simple theory used here stops being reliable.',
    loose: (k) =>
      `${k} loose pieces: squares that don’t share an edge slide past one another, so each piece bends on its own.`,
    wobbly: 'Tall and thin: under the weight it could tip over, or twist sideways (a rule of thumb, see “Why”).',
    best: 'As stiff as 24 squares can be in this grid.',
  },

  guests: [
    {
      name: 'Galileo Galilei',
      note: 'In 1638 I wrote that a ruler standing on its edge resists breaking more than one lying flat, as many times over as it is wider than it is thick. I also saw that bird bones and reeds are hollow: light, yet hard to bend.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Jacob Bernoulli guessed that a bent beam curves in proportion to the turning force on it. In 1744 I followed that idea with calculus and worked out the curves of bent elastic strips.',
    },
    {
      name: 'Claude-Louis Navier',
      note: 'In 1819 I found where the line in a bent beam that is neither squeezed nor stretched really lies, putting Galileo right. In 1826 I separated what a beam’s material gives its stiffness from what its shape gives.',
    },
  ],

  insight: {
    title: 'Why does the edge win?',
    html: `<p>Bend a beam and its top is squeezed while its bottom is stretched. Between them runs a line that is neither, the neutral axis, through the middle of the cross-section (its centroid). Steel far from that line is squeezed or stretched a lot for a small bend, so it pushes back hard, and it pushes with more leverage too. Both effects grow with the distance, so each square counts with the <em>square</em> of its distance from the line. Adding them up gives the second moment of area, I, in cm⁴.</p>
<div class="insight-visual">I = Σ (1/12 + d²) over the squares · sag = F·L³ ⁄ (48·E·I)</div>
<h3>Flat or on its edge</h3>
<p>For a rectangle b wide and h tall, I = b·h³ ⁄ 12, so its height counts three times over. The plank 12 cm wide and 2 cm thick has I = 8 cm⁴ lying flat and 288 cm⁴ on its edge: (12 ÷ 2)² = 36 times stiffer, with the same steel. With 100 kg in the middle of 3 m of steel (E = 200 GPa), it sags 34 mm flat and less than 1 mm on its edge. A plastic ruler 30 mm wide and 1 mm thick is (30 ÷ 1)² = 900 times stiffer on its edge.</p>
<h3>The I-beam</h3>
<p>The best place for steel is as far from the middle as it can go: a flange along the top and another along the bottom. But they must be joined, or they slide past each other like the pages of a book, and each bends on its own: two loose strips of 12 squares have I = 2 cm⁴ between them. A thin web holds them together. With 7 squares in each flange and 10 in the web, I = 508 cm⁴, 63.5 times the flat plank, and the most that any 24 joined squares can give in this grid. Bones, bamboo, bicycle frames and scaffolding poles are hollow for the same reason. In 1638 Galileo pointed to the bones of birds and to reeds, and showed that a ruler on its edge is harder to break, by the ratio of its width to its thickness.</p>
<h3>What this model leaves out</h3>
<p>A tall, thin beam wins on paper, but it can tip over, or twist and buckle sideways under its load (lateral–torsional buckling), and a thin web or flange can crumple. The wobble warning is this room’s own rule of thumb: a shape more than 20 times stiffer up and down than sideways. Engineers check the real thing, which also depends on the span, the load and how well the beam resists twisting, and they brace tall, thin beams such as floor joists. Stiffness (how far a beam sags) isn’t strength (when it breaks, or bends for good): this room is about stiffness. The sag comes from the theory for small sags. It leaves out the beam’s own weight (about 57 kg of steel here, which would add about a third to every sag) and the little extra give from shearing, and it assumes the beam is held straight sideways, so a lopsided shape doesn’t swing aside. Squares joined edge to edge count as welded together; squares that touch only at a corner don’t.</p>
<details><summary>The mathematics, if you want it</summary><p>A square of side 1 whose centre is a distance d from the neutral axis adds ∫ y² dA = 1/12 + d² to I (the parallel axis theorem), so I is a sum over the painted squares. The neutral axis of each piece passes through its centroid: the average height of its squares. Loose pieces are treated as beams bending side by side with the same sag, so their I’s add. The bent beam’s shape is v(x) = F·x·(3L² − 4x²) ⁄ (48·E·I) up to the middle, where the sag is F·L³ ⁄ (48·E·I). The most that 24 joined squares can reach was found by an exact search over how many squares sit in each row: every row between the top and the bottom needs at least one, and the best place for the rest is the top and bottom rows, shared equally. The numbers were checked against an independent program.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Second_moment_of_area" target="_blank" rel="noopener">Second moment of area</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euler%E2%80%93Bernoulli_beam_theory" target="_blank" rel="noopener">Euler–Bernoulli beam theory</a><a class="source-link" href="https://en.wikipedia.org/wiki/I-beam" target="_blank" rel="noopener">I-beam</a><a class="source-link" href="https://en.wikipedia.org/wiki/Claude-Louis_Navier" target="_blank" rel="noopener">Claude-Louis Navier</a><a class="source-link" href="https://archive.org/details/dialoguesconcern00galiuoft" target="_blank" rel="noopener">Galileo (1638), Dialogues Concerning Two New Sciences, Second Day (tr. Crew and de Salvio, 1914)</a></div>`,
  },
});
