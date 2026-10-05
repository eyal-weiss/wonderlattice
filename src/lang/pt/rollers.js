/* Rollers that aren't round · visitor-facing words (pt). */
Wonderlattice.defineText('rollers', 'pt', {
  eyebrow: 'CONSTANT WIDTH',
  name: 'Rollers that aren’t round',
  tagline:
    'A plank glides perfectly level on rollers shaped like rounded triangles, and one of them can drill an almost square hole.',
  title: 'Rollers that aren’t round.',
  subtitle:
    'A plank on rollers shaped like rounded triangles glides perfectly level, as on round logs. Below, the same shapes as wheels on axles: the cart bobs.',
  field: 'Geometry · Curves of constant width · The Reuleaux triangle',
  sceneLabels: ['Rollers and wheels', 'A drill in a square', 'One turn each'],
  tip: 'Drag sideways to roll · Keys: ← → roll, ↑ ↓ change the shape · Enter: a new lopsided shape',
  actionLabel: 'New lopsided shape',
  canvasLabel:
    'Above, a plank with a crate rides on three rollers that aren’t round, and a pen on the crate draws a perfectly straight line. Below, a cart on wheels of the same shape, fixed to axles, bobs up and down, and its pen draws a wave. In the drill view, a curved triangle turns inside a square, painting nearly all of it. In the race, four shapes of the same width each roll one turn and finish together.',
  panelEyebrow: 'Pick a shape',
  whyLabel: 'Why does the plank stay level?',
  nudge:
    'Press “New lopsided shape”: any shape that is equally wide every way carries the plank level. Then try “Drill a square hole”.',
  connection: {
    html: '<strong>Smooth rides.</strong> Here, rollers that aren’t round carry a plank level. In “Square wheels, smooth ride”, square wheels ride level over a road of bumps.',
    label: 'Square wheels, smooth ride',
  },

  presets: [
    { name: 'Triangle rollers', note: 'Three under a plank, and the same shape as wheels.' },
    { name: 'Drill a square hole', note: 'A turning triangle fills almost all of a square.' },
    { name: 'One turn each', note: 'The same width, the same rim: they all roll as far.' },
  ],

  view: 'What to try',
  views: ['Rollers', 'Drill', 'One turn'],
  shape: 'Shape',
  shapes: ['Circle', 'Triangle', 'Pentagon', 'Lopsided'],
  lines: 'Lines it’s drawn from',
  linesHint: 'Each piece of its rim is an arc centred where two of the lines cross.',
  corners: 'Rounded corners',
  cornersHint: 'The tightest curve’s radius, as a share of the width. Rounding every corner keeps the width the same.',

  // The scene's name, for each shape (sharp or rounded) and each view.
  names: {
    rollers: (kind, rounded) =>
      kind === 0
        ? 'Round logs'
        : kind === 1
          ? rounded
            ? 'Rounded triangles'
            : 'Reuleaux triangles'
          : kind === 2
            ? rounded
              ? 'Rounded pentagons'
              : 'Reuleaux pentagons'
            : 'A lopsided shape',
    drill: (kind, rounded) =>
      kind === 0
        ? 'Drilling with a circle'
        : kind === 1
          ? rounded
            ? 'Drilling with a rounded triangle'
            : 'Drilling with a Reuleaux triangle'
          : kind === 2
            ? rounded
              ? 'Drilling with a rounded pentagon'
              : 'Drilling with a Reuleaux pentagon'
            : 'Drilling with a lopsided shape',
    race: 'Four shapes, one width',
  },

  // Numbers arrive already written in the page's language.
  percent: (x) => `${x}%`,
  readout: {
    level: 'The plank stays perfectly level.',
    drill: 'Almost a square hole.',
    drillRound: 'A round hole.',
    drillOther: 'A hole with rounded corners.',
    race: 'They all finish together.',
    plank: 'The plank on rollers',
    plankValue: 'never rises or falls',
    cart: 'The cart on axles bobs by',
    cartValue: (share) => `${share} of the width`,
    rim: 'Its rim is',
    rimValue: (times) => `${times} × its width`,
    area: 'Its area is',
    areaValue: (share) => `${share} of a circle’s`,
    drilled: 'Drilled so far',
    drilledValue: (share) => `${share} of the square`,
    full: 'After a whole turn',
    fullValue: (share) => `${share} of the square`,
    rims: 'Every rim is',
    rimsValue: 'π × the width',
    least: 'The least area',
    leastValue: (share) => `the triangle: ${share} of a circle’s`,
    widthRule: 'However you turn it, it is exactly as wide.',
    drillRule: 'It touches all four sides as it turns, because it is as wide as the square every way.',
    raceRule: 'Rolled once round, a shape travels the length of its rim: π times its width, whatever its shape.',
  },
  status: {
    rollers: 'Level on rollers',
    drill: (share) => `${share} drilled`,
    race: 'Same width, same rim',
  },

  // Words drawn on the canvas.
  labels: {
    rollers: 'As rollers: the plank stays perfectly level',
    axles: (share) => `As wheels on axles: the cart bobs by ${share} of the width`,
    axlesRound: 'As wheels on axles: a circle rolls level too',
    close: 'Up close: as wide every way',
    width: 'width',
    lines: 'The lines it’s drawn from',
    corner: (n) => `A corner, ${n}× closer`,
    path: 'Path of its middle',
    finish: 'One turn: π × the width',
    rim: 'Rim rolled out',
  },

  announce: {
    rollers: (name, share) =>
      `${name}: the plank stays level on rollers; on axles the cart bobs by ${share} of the width.`,
    round: (name) => `${name}: level as rollers, and level on axles too.`,
    drill: (name, share) => `${name}: after a whole turn it has drilled ${share} of the square.`,
    race: 'Four shapes of the same width each roll one turn, and they all finish together.',
  },

  guests: [
    {
      name: 'Franz Reuleaux',
      note: 'I described machines as chains of simple moving parts, and had hundreds of models of mechanisms built for teaching. The curved triangle here carries my name, though others drew it long before me.',
    },
    {
      name: 'Leonhard Euler',
      note: 'In a paper I presented in 1771, I studied curved triangles and the shapes that are equally wide in every direction. I called them orbiforms.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'In 1860 I showed that every shape of constant width has a rim exactly π times its width, whatever its shape.',
    },
  ],

  insight: {
    title: 'Why does the plank stay level?',
    html: `<p>The ground is under each roller and the plank rests on top, so the plank’s height is the distance between two parallel lines that both touch the roller: its width, measured straight up. A circle is equally wide every way. So is every shape in this room: measure it across in any direction, and you get the same. As it turns, its width straight up never changes, so neither does the plank.</p>
<div class="insight-visual">height of the plank = the roller’s width straight up = the same in every direction</div>
<h3>Rollers, not wheels</h3>
<p>The middle of a Reuleaux triangle is closer to its sides than to its corners, so as it rolls, its middle rises and falls. A roller doesn’t mind, since nothing is fixed to its middle. A wheel turns on an axle through its middle, so a cart on Reuleaux triangles bobs, three times a turn, by 15% of the width. Under the plank, the rollers don’t keep exactly in step either: each moves ahead a little faster or slower as it turns, though on average, like round logs, at half the plank’s speed.</p>
<h3>How to draw one</h3>
<p>Draw an equilateral triangle, put the point of a compass on each corner in turn, and draw the arc between the other two: that is a Reuleaux triangle. Any regular polygon with an odd number of sides works the same way. The lopsided shapes use the crossed-lines method: draw a few lines, all crossing one another, and join each line to the next one round by an arc centred where they cross. Going round twice, the curve closes up, as wide in every direction. Rounding off the corners, by the same amount all the way round, keeps the width the same.</p>
<h3>One turn, the same distance</h3>
<p>Every shape here has a rim exactly π times its width, as long as a circle’s of the same width. This is Barbier’s theorem, from 1860. So rolled once round, each one travels the same distance. Their areas differ: the circle holds the most, and the Reuleaux triangle the least of all shapes of the same width, the Blaschke–Lebesgue theorem (Henri Lebesgue in 1914, Wilhelm Blaschke in 1915).</p>
<h3>A square hole</h3>
<p>Any shape of constant width can turn inside a square as wide as itself, touching all four sides all the time. The Reuleaux triangle, with the sharpest corners such a shape can have (120°), sweeps all but the very corners: 2√3 + π/6 − 3 of the square, about 98.8%. Square drill bits built on this idea were patented in 1914 and are still made, though similar drills were used earlier. The bit’s middle wanders as it turns, so it needs a special chuck that lets it, and a guide with a square hole. The pentagon’s blunter corners leave more behind, and a circle drills a round hole, π/4 of the square.</p>
<h3>What the room leaves out</h3>
<p>Here the rollers are perfect, the ground and the plank perfectly flat, and nothing slips. Real rollers must all be exactly the same width, and someone has to carry each one from the back to the front, as happens here when a roller fades away and comes back. A real drill bit also needs cutting edges, so it is a Reuleaux triangle with grooves cut into it. There are solids of constant width too, such as the Meissner bodies, but the room stays flat; the solid made like a Reuleaux triangle from four balls, the Reuleaux tetrahedron, is not quite as wide every way.</p>
<p>Manhole covers are often said to be round so that they can’t fall into their holes. A cover shaped like any shape here couldn’t either; round covers are also much easier to make, and needn’t be turned to fit. Some coins are shapes of constant width, such as the British 20p and 50p, which are Reuleaux heptagons, so that machines can measure them across whichever way they lie.</p>
<details><summary>The mathematics, if you want it</summary><p>Describe a shape by its support function h(θ): how far from a centre its tangent line facing direction θ lies. Its width facing θ is h(θ) + h(θ + π), so constant width w means h(θ) + h(θ + π) = w for every θ. Rolling on the ground without slipping, the shape turns about the point where it touches. As it turns by dψ, the plank, w above that point, moves w dψ, and the centre, h above it, moves h dψ. Over a whole turn the centre moves ∫h dθ = πw, half as far as the plank, because opposite values of h add up to w. The rim’s length is ∫(h + h″) dθ = ∫h dθ, the same πw: Barbier’s theorem.</p><p>The room’s shapes are built from arcs by the crossed-lines method, and each turns about the centre of its smallest enclosing circle, which for a shape of constant width is also the centre of the largest circle inside it; those two radii add up to the width. In the square from −½ to ½, the shape turned by φ has its centre at (½ − h(−φ), ½ − h(π/2 − φ)), so its tangent lines facing right and up lie on those sides, and by constant width the left and bottom ones do too. For the Reuleaux triangle that centre runs round four arcs of ellipses.</p><p>The room’s tests check, against a separate program that builds each Reuleaux polygon from overlapping discs: the width in every direction, the rim’s length π, the triangle’s area (π − √3)/2 ≈ 0.7048 and the pentagon’s, the bob on an axle of 2/√3 − 1 ≈ 15.5% for the triangle and 5.1% for the pentagon, and the share of the square drilled: 98.8% by the triangle, 87.9% by the pentagon, and π/4 by the circle.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_triangle" target="_blank" rel="noopener">Reuleaux triangle (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Curve_of_constant_width" target="_blank" rel="noopener">Curve of constant width (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_polygon" target="_blank" rel="noopener">Reuleaux polygon (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barbier%27s_theorem" target="_blank" rel="noopener">Barbier’s theorem (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Blaschke%E2%80%93Lebesgue_theorem" target="_blank" rel="noopener">Blaschke–Lebesgue theorem (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Watts_Brothers_Tool_Works" target="_blank" rel="noopener">Watts Brothers Tool Works (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Manhole_cover" target="_blank" rel="noopener">Manhole cover (Wikipedia)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Barbier/" target="_blank" rel="noopener">Joseph-Émile Barbier (MacTutor)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Franz_Reuleaux" target="_blank" rel="noopener">Franz Reuleaux (Wikipedia)</a></div>`,
  },
});
