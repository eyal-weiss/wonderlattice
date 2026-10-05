/* The stubborn triangle · visitor-facing words (pt). */
Wonderlattice.defineText('truss', 'pt', {
  eyebrow: 'STRUCTURES',
  name: 'The stubborn triangle',
  tagline:
    'A bridge of squares folds under a toy truck. Add the right bars and it locks, and every bar shows its load.',
  title: 'The stubborn triangle.',
  subtitle:
    'Squares fold and triangles don’t. Watch the bridge give way, then tap bars in and out: blue bars are squeezed, red bars stretched.',
  field: 'Rigidity · Maxwell’s count · The Geiringer–Laman theorem · Forces in a truss',
  sceneLabel: 'Bars, pins and a toy truck',
  sceneNames: {
    squares: 'Squares only',
    pratt: 'A Pratt truss',
    howe: 'A Howe truss',
    counted: 'Counted, but floppy',
    own: 'Your own bridge',
    bracing: 'Bracing the squares',
  },
  tip: 'Tap a bar to take it out, or a dashed line to put one in · Drag the truck · Arrow keys aim, Enter switches',
  actionBrace: 'Brace every square',
  actionUnbrace: 'Take the diagonals out',
  canvasLabel:
    'A bridge of bars and pins across a gap, with a toy truck on its road. Tap a bar to take it out or a dashed line to put one in, or use the arrow keys to aim and Enter to switch. Drag the truck to move it.',
  panelEyebrow: 'Bars and pins',
  whyLabel: 'Why do triangles hold?',
  nudge:
    'Take any one bar out of a locked bridge and watch it fold again. Then give one square a second diagonal: is the bridge any stiffer?',
  connection: {
    html: '<strong>Squeezed and stretched.</strong> A truss uses both. Stones in an arch can only be squeezed, so the arch must take the shape of a hanging chain, upside down. See it in “Hang it, flip it, build it”.',
    label: 'Visit “Hang it, flip it, build it”',
  },

  presets: [
    { name: 'Squares only', note: 'Top, bottom and uprights, no diagonals.' },
    { name: 'A Pratt truss', note: 'A diagonal in every square.' },
    { name: 'Counted, but floppy', note: 'Enough bars, in the wrong places.' },
  ],

  panels: 'Squares across the gap',
  panelsHint: 'Each square adds two joints, so the bridge needs four more bars.',
  forces: 'Show what each bar carries',

  verdict: { rigid: 'RIGID', floppy: 'FLOPPY' },
  count: (joints, needed, bars) => `${joints} joints × 2 − 3 = ${needed} bars needed · ${bars} here`,
  reason: {
    short: (k) => (k === 1 ? 'one bar short' : `${k} bars short`),
    spread: 'enough bars, badly spread',
    rigid: (spare) => (spare === 0 ? 'not one bar to spare' : spare === 1 ? 'one spare bar' : `${spare} spare bars`),
  },
  times: (x) => `${x}×`,

  key: {
    squeezed: 'Squeezed',
    stretched: 'Stretched',
    nothing: 'Carries nothing',
    spare: 'Spare',
  },

  primer: {
    title: 'WHY TRIANGLES',
    square: 'A square folds',
    squareCount: '4 joints × 2 − 3 = 5 bars needed · it has 4',
    triangle: 'A triangle holds',
    triangleCount: '3 joints × 2 − 3 = 3 bars needed · it has 3',
  },

  status: {
    rigid: (spare) =>
      spare === 0 ? 'Rigid · no spare bars' : spare === 1 ? 'Rigid · one spare bar' : `Rigid · ${spare} spare bars`,
    short: (k) => (k === 1 ? 'Floppy · one bar short' : `Floppy · ${k} bars short`),
    spread: 'Floppy · bars badly spread',
  },
  folded: 'The bridge folds.',
  locked: 'The bridge is rigid.',

  readout: {
    have: (bars, needed) => `${bars} bars, ${needed} needed`,
    count: (joints, ways, needed, bars) =>
      `${joints} joints can each move two ways: ${ways} ways in all. Take away 3 for sliding and turning the whole bridge, and it needs ${needed} bars. It has ${bars}.`,
    short: (k) =>
      k === 1
        ? 'One bar is missing, so the bridge can still fold one way.'
        : `${k} bars are missing, so the bridge can still fold.`,
    spread:
      'There are enough bars, but some are crowded where they repeat each other (the dashed one is spare), so another part has too few and folds.',
    busiest: (x) => `The busiest bar carries ${x} times the truck’s weight.`,
    busiestSame: 'The busiest bar carries as much as the truck weighs.',
    nothing: (k) =>
      k === 0 ? 'Every bar carries something.' : k === 1 ? 'One bar carries nothing.' : `${k} bars carry nothing.`,
    spare: (k) =>
      k === 1
        ? 'One bar is spare (dashed): take it out and the bridge still stands.'
        : `${k} bars are spare (dashed): the bridge doesn’t need them to stand.`,
    ashore: 'The truck is on solid ground, so no bar carries anything.',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'In 1864 I counted. Each joint of a flat frame can move two ways, and three of those ways just slide or turn the whole frame. So a frame of j joints needs at least 2j − 3 bars.',
    },
    {
      name: 'Hilda Geiringer',
      note: 'In 1927 I found exactly which flat frames are rigid: not one part may have more bars than it needs. Gerard Laman found the same rule again in 1970, and today it carries both our names.',
    },
    {
      name: 'Squire Whipple',
      note: 'In 1847 I published a book that worked out the force in every bar of a truss, instead of guessing. My iron bowstring bridges crossed the Erie Canal.',
    },
  ],

  insight: {
    title: 'Why do triangles hold?',
    html: `<p>A bar keeps its length, and a pin lets bars turn. Three lengths fix a triangle’s shape completely, so a triangle of bars can’t change shape at all. Four lengths don’t fix a square: it leans into a rhombus without a single bar bending or stretching. That’s why the frames of bridges, cranes and roofs are made of triangles.</p>
<div class="insight-visual">joints × 2 − 3 = bars needed</div>
<h3>Counting the ways to move</h3>
<p>On a flat wall, each joint can move in two directions, so j joints have 2j ways to move. Each bar takes away at most one. Three ways always remain, however many bars there are: even a rigid frame can slide sideways, slide up and down, and turn as a whole. Here the pin and the roller under the bridge take those three away. So a frame needs at least 2j − 3 bars, a count James Clerk Maxwell gave in 1864. A bridge of four squares has 10 joints, so it needs 17 bars. With only its top, bottom and uprights it has 13, so it’s four short: one diagonal per square.</p>
<h3>Counting isn’t enough</h3>
<p>Put in 17 bars with two diagonals in one square and none in the next, and the bridge still folds. The second diagonal is spare: it holds nothing the first doesn’t already hold. Hilda Pollaczek-Geiringer found the exact rule in 1927, and Gerard Laman found it again in 1970. A frame with 2j − 3 bars is rigid exactly when no part of it is crowded: every group of k joints has at most 2k − 3 bars between them. The rule is for joints in general position. In special positions, such as three joints in a straight line, a frame with the right bars can still give a little. On this bridge’s pegboard, every choice of bars behaves just as it would in general position.</p>
<h3>What each bar carries</h3>
<p>Once the bridge is rigid, every joint must balance: the pushes and pulls of its bars, and the truck’s weight where the road rests on it, add up to nothing. Solving all those balances together (the method of joints) gives the force in every bar. Blue bars are squeezed and red bars are stretched, and a thicker bar carries more. Some bars carry nothing at all while the truck is in one place, and a lot when it moves. And a bar can carry more than the truck weighs: in a Pratt truss of six squares, with the truck in the middle, the middle of the top is squeezed with one and a half times the truck’s weight.</p>
<p>In a Pratt truss the diagonals lean in towards the middle and are stretched, while the uprights are squeezed. Mirror every diagonal and you get a Howe truss, where the diagonals are squeezed and the uprights stretched. That difference mattered to builders: a long squeezed bar can buckle, bowing sideways long before it would crush, so squeezed bars must be fatter. William Howe’s 1840 design squeezed timber diagonals and stretched iron rods. Thomas and Caleb Pratt’s 1844 design turned that round, and it suited bridges as iron and steel took over from wood. The Warren truss of 1848 uses a zigzag of diagonals, squeezed and stretched in turn.</p>
<h3>What this model leaves out</h3>
<p>The bars here weigh nothing, their joints are perfect pins, the truck’s weight reaches the bridge only at its joints through the road, and every bar is the same steel. Real bridges carry their own weight, which is usually far more than any truck’s. Their joints are riveted, bolted or welded, which stiffens them. Their squeezed bars buckle before they break. Where a bridge has spare bars, how they share the load depends on how stretchy each one is, and here they’re all alike. The folding is a cartoon: a real frame would fall faster, and break. And triangles aren’t the only way to be stiff: frames with rigid joints, shells and tensegrity structures are stiff too. Bridge-building games such as Poly Bridge simulate whole bridges; this room sticks to the counting and the forces.</p>
<details><summary>The mathematics, if you want it</summary><p>Moving joint a by u<sub>a</sub> and joint b by u<sub>b</sub> keeps bar ab’s length, to first order, when (p<sub>a</sub> − p<sub>b</sub>) · (u<sub>a</sub> − u<sub>b</sub>) = 0. One such equation per bar makes the rigidity matrix, with two columns per joint. With three more rows for the pin and the roller, the bridge is rigid exactly when the matrix has full rank, 2j. The room also finds the rank with the joints jumbled slightly into general position, to tell a badly spread frame from a special position. A floppy bridge folds along a motion the matrix allows: the part of the truck’s push that no bar resists. The forces come from the stiffness method with every bar alike. For a bridge with no spare bars, that gives exactly the forces of the method of joints, whatever the bars are made of. The forces were checked against an independent program for Pratt and Howe trusses of two to six squares, and the rank against Laman’s condition on 150 random small frames.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Truss" target="_blank" rel="noopener">Truss</a><a class="source-link" href="https://en.wikipedia.org/wiki/Laman_graph" target="_blank" rel="noopener">Laman graph</a><a class="source-link" href="https://en.wikipedia.org/wiki/Structural_rigidity" target="_blank" rel="noopener">Structural rigidity</a><a class="source-link" href="https://en.wikipedia.org/wiki/Truss_bridge" target="_blank" rel="noopener">Truss bridge (Pratt, Howe and Warren)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Squire_Whipple" target="_blank" rel="noopener">Squire Whipple</a><a class="source-link" href="https://doi.org/10.1080/14786446408643668" target="_blank" rel="noopener">Maxwell (1864), On the calculation of the equilibrium and stiffness of frames</a><a class="source-link" href="https://doi.org/10.1002/zamm.19270070107" target="_blank" rel="noopener">Pollaczek-Geiringer (1927), Über die Gliederung ebener Fachwerke</a><a class="source-link" href="https://doi.org/10.1007/BF01534980" target="_blank" rel="noopener">Laman (1970), On graphs and rigidity of plane skeletal structures</a></div>`,
  },
});
