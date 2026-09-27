/* A tile that fills the world · visitor-facing words (English). */
Wonderlattice.defineText('tiles', 'en', {
  eyebrow: 'TILING',
  name: 'A tile that fills the world',
  tagline: 'Bend one edge of a tile, its partner bends to match, and the pattern still covers everything.',
  title: 'A tile that fills the world.',
  subtitle: 'Drag the dots to bend the edges. Whatever shape you make, its copies still fit together with no gaps.',
  field: 'Symmetry · Tessellation · Creatures',
  sceneLabel: 'One tile, repeated forever',
  sceneName: 'Your tile',
  tip: 'Drag the dots on the outlined tile · Arrow keys move the chosen dot, Enter picks the next one',
  actionLabel: 'Invent a creature',
  canvasLabel:
    'A plane covered by copies of one tile. Drag the dots on the outlined tile to bend its edges; the paired edges follow, and every copy changes with it.',
  panelEyebrow: 'Shape the tile',
  whyLabel: 'Why does it always fit?',
  nudge:
    'Pull one dot outwards and watch its twin on the paired edge: the bump you make is exactly the dent the neighbour needs.',
  connection: {
    html: '<strong>A few rules, repeated everywhere.</strong> Here, how edges pair up decides the whole pattern. In the loom, a tiny grid decides the whole cloth.',
    label: 'Visit “The mathematical loom”',
  },

  presets: [
    { name: 'Fish', note: 'Squares that slide.' },
    { name: 'Pinwheel', note: 'Squares that turn.' },
    { name: 'Chicks', note: 'Hexagons that slide.' },
  ],

  rule: 'How the edges pair up',
  rules: ['Squares that slide', 'Squares that turn', 'Hexagons that slide', 'Hexagons that turn'],
  ruleNotes: [
    'Each edge slides onto the opposite one.',
    'Four tiles turn around a corner.',
    'Each edge slides onto the opposite one.',
    'Three tiles turn around a corner.',
  ],
  palette: 'Colours',
  palettes: ['Garden', 'Sea', 'Dusk', 'Sweets'],
  eye: 'Give it an eye',
  size: 'Tile size',
  point: (n, total) => `Dot ${n} of ${total}`,
  changed: 'The tile changed shape, and its copies still fill the plane.',
  invented: 'A new creature, and it still fills the plane.',
  plain: 'A plain tile again, with straight edges. Bend it into something.',
  ruleChanged: (name) => `${name}. The same bends, paired in a new way.`,

  guests: [
    {
      name: 'Marjorie Rice',
      note: 'At her kitchen table in the 1970s, with no mathematics degree, she found new pentagons that tile the plane.',
    },
    {
      name: 'M. C. Escher',
      note: 'An artist rather than a mathematician, he filled whole planes with birds, fish and lizards that fit like puzzle pieces.',
    },
  ],

  insight: {
    title: 'Why does the tile always fit?',
    html: `<p>Every edge of the tile comes in a pair. When you bend one edge, its partner is not bent separately: it is a copy of the same curve, slid across or turned about a corner. So every bump you make on one side is exactly the dent that a neighbouring copy needs on the other. The copies can't overlap and can't leave gaps.</p>
<div class="insight-visual">bend an edge → its partner is the same curve, moved → neighbours fit</div>
<h3>The rules are symmetries</h3>
<p>The moves that pair the edges are the same moves that lay the tiles down across the plane: slides for “Squares that slide” and “Hexagons that slide”, quarter turns about two corners for “Squares that turn”, and third turns about alternate corners for “Hexagons that turn”. Mathematicians sort repeating patterns by their symmetries and have shown there are exactly 17 kinds, the wallpaper groups. This room offers four of them.</p>
<h3>Amateurs who changed the story</h3>
<p>In the 1970s Marjorie Rice, a homemaker in San Diego with no mathematical training, read about the search for pentagons that tile the plane and found four new kinds, working at her kitchen table. In 2023 David Smith, a retired print technician who liked playing with shapes, found the “hat”: a single tile that covers the plane but never repeats (using mirror images of itself; a later cousin, the “spectre”, doesn't even need those). Mathematicians had looked for such an “einstein” tile for decades; with Joseph Myers, Craig Kaplan and Chaim Goodman-Strauss he proved it works. The hat isn't shown in this room.</p>
<details><summary>The mathematics, if you want it</summary><p>A tile that covers the plane with copies of itself, all related by symmetries of the pattern, is called isohedral. Here each free edge is a smooth curve through the corners and three control points; each other edge is its image under a translation or a rotation (by 90° about opposite corners of the square, or by 120° about alternate corners of the hexagon). Because every edge is shared by exactly two copies, the tile's area never changes, whatever you draw: what one edge gains, its partner gives back.</p><p>The colours are chosen so that neighbours always differ: by orientation for the turning rules, and by position in the lattice for the sliding ones.</p></details>
<p>Further reading: J. H. Conway, H. Burgiel and C. Goodman-Strauss, <em>The Symmetries of Things</em> (A K Peters, 2008).</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Wallpaper_group" target="_blank" rel="noopener">The 17 wallpaper groups</a><a class="source-link" href="https://en.wikipedia.org/wiki/Marjorie_Rice" target="_blank" rel="noopener">Marjorie Rice</a><a class="source-link" href="https://en.wikipedia.org/wiki/Einstein_problem" target="_blank" rel="noopener">The einstein problem and the hat</a><a class="source-link" href="https://arxiv.org/abs/2303.10798" target="_blank" rel="noopener">An aperiodic monotile (Smith, Myers, Kaplan &amp; Goodman-Strauss, 2023)</a><a class="source-link" href="https://en.wikipedia.org/wiki/M._C._Escher" target="_blank" rel="noopener">M. C. Escher</a></div>`,
  },
});
