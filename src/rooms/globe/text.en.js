/* The triangle with three right angles · visitor-facing words (English). */
Wonderlattice.defineText('globe', 'en', {
  eyebrow: 'CURVED SPACE',
  name: 'The triangle with three right angles',
  tagline: 'On a ball, a triangle can have three right angles, and an arrow carried round it comes home turned.',
  title: 'The triangle with three right angles.',
  subtitle:
    'A triangle drawn on a ball, whose angles add up to 270°. Drag its corners, or shrink it until the ball looks flat.',
  field: 'Geometry on a ball · Curvature · Parallel transport',
  sceneLabel: 'On a ball · straight sides, fat angles',
  tip: 'Drag a corner to reshape the triangle, or drag the ball to turn it · Keys: 1, 2, 3 pick a corner, the arrows move it (or turn the ball), Esc lets go, Enter walks again',
  actionLabel: 'Walk it round again',
  canvasLabel:
    'A ball with a grid of meridians and parallels. On it, a triangle whose sides are great-circle arcs, with its three angles labelled. A walker carries an arrow round the triangle.',
  panelEyebrow: 'Shape the triangle',
  whyLabel: 'Why more than 180°?',
  nudge:
    'Slide the size down until the triangle is a speck. Its angles creep back to 180°, because to an ant a ball looks flat.',
  connection: {
    html: '<strong>Bent surfaces, straight rules.</strong> On a ball, triangles grow fat angles. In “Bend the plane”, a function bends a flat picture and keeps every tiny angle as it was.',
    label: 'Bend the plane',
  },

  presets: [
    { name: 'Three right angles', note: 'Pole to equator, a quarter of the way round, and back.' },
    { name: 'A quarter of the ball', note: 'Three angles of 120°. Four of these cover the ball.' },
    { name: 'An ant’s triangle', note: 'So small that it is almost flat.' },
  ],
  yourOwn: 'Your own triangle',

  // Numbers arrive already written in the page's language.
  degrees: (x) => `${x}°`,
  percent: (x) => `${x}%`,
  sum: (parts, total) => `${parts.join(' + ')} = ${total}`,
  more: (extra) => `${extra} more than a flat triangle’s 180°`,
  walking: 'Carrying the arrow, never turning it…',
  home: (turned) => `Home again: the arrow has turned ${turned}`,
  zoomed: (n) => `Seen ${n} times closer`,
  chart: {
    title: 'Every triangle you make lands on one line',
    across: 'Share of the ball',
    up: 'Extra above 180°',
  },
  corner: (n) => `${n}`,

  size: 'Size of the triangle',
  sizeHint: 'Shrink it to a speck, or grow it until it covers almost half the ball.',
  shareOf: (share) => `${share} of the ball`,
  readout: {
    angles: 'Its three angles',
    extra: 'More than 180° by',
    share: 'Share of the ball',
    turned: 'The arrow came home turned by',
  },
  onItsWay: 'on its way…',
  rule: (share, extra) =>
    `${share} of the ball × 720° = ${extra}. On every ball, the extra is the triangle’s share of the ball, times 720°.`,
  status: (total) => `Angles add up to ${total}`,
  picked: (n) => `Corner ${n}: the arrow keys move it. Esc lets go.`,
  letGo: 'The arrow keys turn the ball.',
  cameHome: (turned, total) => `The angles add up to ${total}. The arrow came home turned by ${turned}.`,

  guests: [
    {
      name: 'Albert Girard',
      note: 'In 1629 he published that a triangle on a ball has angles adding up to more than 180°, by an amount that grows with its area.',
    },
    {
      name: 'Carl Friedrich Gauss',
      note: 'He proved in 1827 that a surface’s curvature can be measured from inside it, by angles and distances alone, without ever leaving it.',
    },
    {
      name: 'Tullio Levi-Civita',
      note: 'In 1917 he described how to carry an arrow across a curved surface without turning it, the idea the walker here follows.',
    },
  ],

  insight: {
    title: 'Why more than 180°?',
    html: `<p>On a ball, the straightest paths are great circles, like the equator and the lines from pole to pole. A triangle whose sides follow them bulges outwards, so its angles add up to more than a flat triangle’s 180°. Walk from the North Pole down to the equator, turn left, walk a quarter of the way round, turn left again and walk back up to the pole: you meet your own path at a right angle, and all three angles are 90°.</p>
<div class="insight-visual">angle sum − 180° = share of the ball × 720°</div>
<h3>The extra is the area</h3>
<p>The extra angle is proportional to the triangle’s area. The whole ball is worth 720°, so a triangle covering an eighth of it has 90° to spare, and every 1% of the ball adds 7.2°. Shrink a triangle to a speck and its extra all but vanishes: a small piece of a ball is almost flat, which is why flat geometry works so well for a garden or a town.</p>
<h3>An arrow that never turns comes home turned</h3>
<p>The walker carries an arrow and keeps it at the same angle to the straight path it is walking along. Only the path turns, at the corners; the arrow never does. Yet it comes home turned by exactly the extra. On flat paper it would come home just as it left. Carrying an arrow like this is called parallel transport, and its turn round a loop is called holonomy. It means that a creature living on the surface, unable to leave it or see it from outside, could still discover that its world is curved.</p>
<details><summary>The mathematics, if you want it</summary><p>On a ball of radius R, a triangle with angles A, B and C (in radians) has area (A + B + C − π)R². Albert Girard published this in 1629; Thomas Harriot had found it in 1603 but never published it. It is a special case of the Gauss–Bonnet theorem: on any surface, a triangle’s angle sum exceeds π by the total curvature inside it, and parallel transport round the triangle turns an arrow anticlockwise by that same total (for a loop walked anticlockwise). Gauss proved in 1827, in his <em>Theorema Egregium</em> (“remarkable theorem”), that curvature can be measured from within a surface. Tullio Levi-Civita described parallel transport on curved spaces in 1917, and Élie Cartan introduced holonomy in 1926.</p>
<p>The room works out each area from the corners alone (a formula of Van Oosterom and Strackee, 1983), and each angle from the directions of the sides. Its tests check that the two always agree, and that an arrow carried in small steps turns by the same amount.</p>
<p>The same geometry lies behind the Foucault pendulum, first shown in Paris in 1851. The turning Earth carries the pendulum round its circle of latitude, and its swing turns by 360° × sin(latitude) in a sidereal day (about 23 hours 56 minutes). That involves the Earth’s rotation as well, so the walker here only shares the geometry: it is not a pendulum.</p></details>
<h3>What the room leaves out</h3>
<p>The ball here is perfectly round. The Earth is slightly flattened: from the centre to a pole is about 0.3% shorter than to the equator. So on the real Earth the numbers shift a little. The sides always take the shorter way round their great circle, and the angles are shown rounded, but always so that they add up to the sum shown.</p>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/GirardsSphericalExcessFormula.html" target="_blank" rel="noopener">Girard’s spherical excess formula (MathWorld)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Spherical_trigonometry" target="_blank" rel="noopener">Spherical trigonometry (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parallel_transport" target="_blank" rel="noopener">Parallel transport (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Holonomy" target="_blank" rel="noopener">Holonomy (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gauss%E2%80%93Bonnet_theorem" target="_blank" rel="noopener">Gauss–Bonnet theorem (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Theorema_Egregium" target="_blank" rel="noopener">Theorema Egregium (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Levi-Civita_connection" target="_blank" rel="noopener">Levi-Civita connection (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Solid_angle" target="_blank" rel="noopener">Solid angle (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Foucault_pendulum" target="_blank" rel="noopener">Foucault pendulum (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Figure_of_the_Earth" target="_blank" rel="noopener">Figure of the Earth (Wikipedia)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Girard_Albert/" target="_blank" rel="noopener">Albert Girard (MacTutor)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/" target="_blank" rel="noopener">Carl Friedrich Gauss (MacTutor)</a></div>`,
  },
});
