/* Bend the plane · visitor-facing words (English). Other languages: text.<lang>.js (docs/TRANSLATING.md). */
Wonderlattice.defineText('plane', 'en', {
  eyebrow: 'COMPLEX NUMBERS',
  name: 'Bend the plane',
  tagline: 'Bend a picture without tearing it; a circle becomes a wing.',
  title: 'Bend the plane.',
  subtitle: 'Send a picture through a complex function. The whole plane bends, yet tiny right angles stay right.',
  field: 'Complex numbers · Conformal maps · Wings',
  sceneLabel: 'The plane, bent',
  tip: 'Drag the compass on the left, or move it with the arrow keys · Its twin on the right shows the stretch and the turn',
  tipStacked:
    'Drag the compass in the top picture, or use the arrow keys · Its twin below shows the stretch and the turn',
  actionLabel: 'Bend it',
  canvasLabel:
    'Two copies of the plane. In the first, a picture and a small compass of two perpendicular arrows; in the ' +
    'second, their images under the chosen complex function. Drag the compass, or move it with the arrow keys.',
  panelEyebrow: 'Pick a bend',
  whyLabel: 'Why do right angles survive?',
  nudge: 'Square the plane, then drag the compass to the very centre. What happens to its twin there?',
  connection: {
    html: '<strong>Bending without tearing.</strong> Here a function bends the whole plane and keeps its tiny angles. In “The other side”, a strip bends into a surface with only one side.',
    label: 'Visit “The other side”',
  },

  // The maps, in the model's order: names for the menu, and the formula shown on the stage.
  functions: ['Square · z²', 'Inside out · 1/z', 'Wrap · eᶻ', 'Wave · sin z', 'Wing · z + 1/z'],
  formulas: ['w = z²', 'w = 1/z', 'w = eᶻ', 'w = sin z', 'w = z + 1/z'],
  // The pictures, in the model's order.
  pictures: ['A square grid', 'A fish', 'A face', 'Circles and rays', 'The wing’s circle'],

  functionLabel: 'Function',
  pictureLabel: 'Picture',
  bendLabel: 'How far bent',
  thickLabel: 'Thickness',
  camberLabel: 'Arch',
  gridLabel: 'Show a faint grid behind',
  flowLabel: 'Show the air flowing past',

  // Readouts
  at: 'The compass at',
  // Plain words first, then the notation, which is kept on one line.
  stretch: 'How much it stretches here',
  stretchMath: '(|f′(z)|)',
  turn: 'How much it turns',
  turnMath: '(arg f′(z))',
  point: (x, y) => `${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i`.replace(/^-/, '−'),
  times: (x) => `${x}×`,
  degrees: (d) => `${d < 0 ? '−' : ''}${Math.abs(d)}°`,
  none: '–',
  status: (stretch, turn) => `×${stretch} · turn ${turn}`,
  statusCritical: 'Here f′ = 0',
  statusPole: 'A pole: f = ∞',
  // Said once to screen readers when the compass comes to rest on a special point.
  announceCritical: 'f′ = 0 here: angles double',
  announcePole: 'A pole: the function is infinite here',
  keeps: 'Its twin’s arrows still meet at a right angle.',
  critical: 'Here f′ = 0. The twin’s arrows shrink away, and angles double.',
  pole: 'Here f is infinite, a pole. The twin has flown off the map.',
  away: 'Its twin is off the edge of the bent picture.',
  blending: 'Part-way bent: a blend of z and f(z), to help the eye.',

  // Canvas labels
  zLabel: 'z',
  wLabel: 'w',
  bent: (formula, percent) => `${formula} · ${percent}% bent`,
  criticalMark: 'f′ = 0',
  poleMark: 'pole',

  presets: [
    { name: 'Square the plane', note: 'Angles double at the centre.' },
    { name: 'Turn it inside out', note: 'Straight lines become circles.' },
    { name: 'Wrap it around', note: 'Lines become rings and rays.' },
    { name: 'Square a fish', note: 'Bent all over, still a fish.' },
    { name: 'Make a wing', note: 'A circle, bent into a wing.' },
  ],

  guests: [
    {
      name: 'Bernhard Riemann',
      note: 'His 1851 thesis, for Gauss, studied complex functions through geometry: angle-keeping maps and surfaces.',
    },
  ],

  insight: {
    title: 'Bending that keeps its angles.',
    html: `<p>A complex number x + iy is a point in the plane: x across, y up. A complex function f takes every point z to a new point w = f(z), so it moves the whole plane at once. The first picture is the plane before; the second shows where each of its points lands.</p>
<div class="insight-visual">multiplying by a number of size r at angle θ stretches by r and turns by θ</div>
<h3>Multiplying turns and stretches</h3>
<p>Multiplying by i turns the plane a quarter turn. Multiplying by 2 doubles its size. Every complex number does both at once: it stretches by its size and turns by its angle. A stretch and a turn keep every angle, even as sizes change.</p>
<h3>Up close, a bend is a multiplication</h3>
<p>Zoom in near a point z and a complex function that has a derivative there looks like multiplying by one number, its derivative f′(z): f(z + h) ≈ f(z) + f′(z)·h for a tiny h. So every tiny arrow at z is stretched by |f′(z)| and turned by the angle of f′(z), the same for every direction, as long as f′(z) isn’t zero. The compass's two arrows turn together, and still meet at a right angle. A map that keeps angles like this is called <em>conformal</em>. The grid's lines cross at right angles after bending, too, even when the squares become curved.</p>
<h3>Where f′ = 0, angles break</h3>
<p>If f′(z) = 0 there's nothing to multiply by, and the next term takes over. Near 0, z² sends h to h², which doubles every angle: the right angle between 1 and i opens into a straight line. That's why the compass's twin shrinks away at the centre of “Square the plane”, and why the grid lines through 0 fold there.</p>
<h3>Inside out</h3>
<p>1/z swaps near and far: points close to 0 fly far away, and far points come close. Circles through 0 become straight lines, and straight lines that miss 0 become circles through 0. That's why the square grid turns into two families of circles, all passing through 0 and still crossing each other at right angles. (The two axes, which pass through 0 themselves, stay straight lines.)</p>
<h3>From a circle to a wing</h3>
<p>Joukowski's map z + 1/z flattens the unit circle into the line segment from −2 to 2. Shift the circle a little, keeping it through z = 1, and its image becomes a wing: round at the front and sharp at the back. The sharp edge sits exactly where f′ = 0, at z = 1, where angles double and the smooth circle folds into a point. The map carries the flow of air around the circle to flow around the wing. That flow is idealised (steady, frictionless, flat), with just enough swirl that the air leaves the sharp edge smoothly. Real wings also depend on viscosity, turbulence, and their shape in three dimensions, which this picture leaves out.</p>
<h3>About the “How far bent” slider</h3>
<p>Part-way, the picture shows (1 − t)·z + t·f(z), a straight blend between staying put and the full map. It's there to help the eye follow each point. Each blend is a complex function too, but it has its own trouble spots, and it's not a path the plane really travels. Only the fully bent picture shows f.</p>
<details><summary>The mathematics, if you want it</summary><p>f′(z) is the limit of (f(z + h) − f(z)) / h as h shrinks to 0. For a complex function the limit must be the same from every direction, and that's exactly what forces the stretch and the turn to be the same for every direction: an analytic function with f′(z) ≠ 0 is conformal at z. At a point where f′ vanishes to first order, angles are multiplied by 2. The wing's flow uses the complex potential F = ζ + r²/ζ + ik·log ζ around a circle of radius r (ζ measured from its centre), with k chosen to make z = 1 a stagnation point, the Kutta condition.</p></details>
<div class="sources"><a class="source-link" href="https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/" target="_blank" rel="noopener">MIT 18.04 notes, topic 10: conformal transformations</a><a class="source-link" href="https://webapps.math.uci.edu/~vmm/ConformalMaps/" target="_blank" rel="noopener">Conformal maps to explore (UC Irvine, 3D-XplorMath)</a><a class="source-link" href="https://www.grc.nasa.gov/www/k-12/airplane/map.html" target="_blank" rel="noopener">Joukowski's cylinder-to-airfoil map (NASA Glenn)</a><a class="source-link" href="https://books.google.com/books/about/Visual_Complex_Analysis.html?id=ogz5FjmiqlQC" target="_blank" rel="noopener">Tristan Needham, Visual Complex Analysis</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/" target="_blank" rel="noopener">Bernhard Riemann (MacTutor)</a></div>`,
  },
});
