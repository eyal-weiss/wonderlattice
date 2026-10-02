/* Square wheels, smooth ride · visitor-facing words (English). */
Wonderlattice.defineText('wheels', 'en', {
  eyebrow: 'ROADS AND WHEELS',
  name: 'Square wheels, smooth ride',
  tagline:
    'A cart with square wheels rides perfectly level on the right road. Draw any wheel, and it gets its own road.',
  title: 'Square wheels, smooth ride.',
  subtitle:
    'Square wheels on a road of bumps: the cup of water stays perfectly still. Below, the same cart on a flat road. Change the wheels, or draw your own.',
  field: 'Geometry · Roads and wheels · The catenary',
  sceneLabel: 'The same wheels · two roads',
  tip: 'Drag the dots of your own wheel in or out · Keys: ← → change the sides, or pick a dot of your own wheel, and ↑ ↓ move it · Enter: another wheel',
  actionLabel: 'Another wheel',
  canvasLabel:
    'Two lanes. Above, a cart with square wheels rolls over a road of rounded bumps, and the cup of water on it glides along at one height. Below, the same cart rolls on a flat road, thumping up and down and splashing its water. On a large picture, further down: wheels with 3 to 8 sides, each rolling on its own road, the triangle’s corner cutting into the next bump, marked in red; and a hanging chain beside the same curve turned over, one bump of the square’s road. A drawn wheel has twelve dots to drag in or out.',
  panelEyebrow: 'Pick a wheel',
  whyLabel: 'Why does it ride level?',
  nudge:
    'Slide the sides up to 12: the bumps flatten towards a flat road, the road a round wheel needs. Then slide down to 3, and watch the triangle’s corner cut into the next bump.',
  connection: {
    html: '<strong>Curves made by turning.</strong> Here a turning wheel decides the shape of its road. In Paint with motion, two turning arms draw flowers.',
    label: 'Paint with motion',
  },

  presets: [
    { name: 'Square wheels', note: 'Each bump is an upside-down hanging chain.' },
    { name: 'A triangle crashes', note: 'Its corner cuts into the next bump.' },
    { name: 'A heart-shaped wheel', note: 'Draw your own: every wheel gets a road.' },
  ],
  // The scene's name for a regular wheel that isn't one of the presets, and for a drawn one.
  sidesName: (n) =>
    n === 3
      ? 'Triangle wheels'
      : n === 4
        ? 'Square wheels'
        : n === 5
          ? 'Pentagon wheels'
          : n === 6
            ? 'Hexagon wheels'
            : n === 8
              ? 'Octagon wheels'
              : `Wheels with ${n} sides`,
  yourOwn: 'Your own wheel',

  kind: 'Kind of wheel',
  regular: 'Regular wheels',
  drawn: 'Your own wheel',
  sides: 'Sides of the wheel',
  sidesHint: 'More sides, smaller bumps. The triangle can’t ride its road.',
  startFrom: 'Start from',
  shapes: { heart: 'Heart', flower: 'Flower', egg: 'Egg', star: 'Star', circle: 'Circle' },
  drawHint:
    'Drag the dots on the wheel in or out, and its road changes with it. Pull the heart’s dent in towards the axle, and see what happens.',

  // Numbers arrive already written in the page's language.
  percent: (x) => `${x}%`,
  readout: {
    level: 'On its own road, the axle stays perfectly level.',
    crash: 'On its own road, it would crash.',
    bumps: 'Each bump on its road is',
    bumpsValue: (share) => `${share} of the radius high`,
    bob: 'On a flat road, the axle bobs by',
    bobValue: (share) => `${share} of the radius`,
    bobDrawn: (share) => `${share} of the longest radius`,
    cuts: 'It cuts into its road by',
    cutsValue: (depth) => `${depth} of the radius`,
    cutsDrawn: (depth) => `${depth} of the longest radius`,
    during: 'It is crashing for',
    duringValue: (share) => `${share} of the way`,
    clear: 'It cuts into its road',
    clearValue: 'nowhere',
    radius: 'The radius runs from the axle to a corner.',
    rule: 'The bumps are exactly as tall as the bob they cancel.',
    drawnRule: 'Its road is as long as its rim, and as deep as the rim is far from the axle.',
  },
  status: { level: 'Level ride', crash: 'It would crash' },

  // Words drawn on the canvas.
  labels: {
    own: 'On its own road',
    flat: 'The same wheels on a flat road',
    flatOne: 'The same wheel on a flat road',
    crash: 'The corner cuts into the next bump',
    crashDrawn: 'The wheel and its road collide',
    closer: (n) => `${n}× closer`,
    gallery: 'Every regular wheel has its own road · Tap one to ride it',
    galleryDrawn: 'Wheels to start from · Tap one to ride it',
    chain: 'A chain hanging from two nails',
    turned: 'Turned over: a bump that fits the square',
    sides: (n) => `${n} sides`,
    crashes: 'crashes',
  },

  announce: {
    level: (name, bump) => `${name}: a level ride, over bumps ${bump} of the radius high.`,
    levelDrawn: (name) => `${name}: a level ride on its own road.`,
    crash: (name) => `${name}: on its own road it would crash.`,
    picked: (n) => `Dot ${n} of 12: the up and down arrows move it out and in.`,
  },

  guests: [
    {
      name: 'Johann Bernoulli',
      note: 'In 1691 he found the shape of a chain hanging from two nails, a puzzle set by his brother Jacob: his first big result on his own.',
    },
    {
      name: 'Christiaan Huygens',
      note: 'He was the first to call the hanging chain’s curve a catenary, from the Latin for chain, in a letter to Leibniz in 1690.',
    },
    {
      name: 'Gottfried Leibniz',
      note: 'He solved the hanging chain too. His answer, Huygens’s and Johann Bernoulli’s were printed side by side in a journal in June 1691.',
    },
  ],

  insight: {
    title: 'Why does it ride level?',
    html: `<p>For the axle to glide along at one height, two things must hold at every moment. The point where the wheel touches the road must be straight below the axle, so the road there must be exactly as far below the axle as that point of the rim: close below the middle of a side, and far below a corner. And the wheel mustn’t slip, so each bit of road must be as long as the bit of rim that rolls onto it.</p>
<div class="insight-visual">depth of the road = distance from axle to rim · length of road = length of rim</div>
<h3>Upside-down hanging chains</h3>
<p>For a straight side, those two rules give a famous curve: the shape of a chain hanging between two nails, called a catenary, turned upside down. Each side of the square rolls over one bump, and each corner drops into the dip between two bumps, where they meet at a right angle, just like the corner. With more sides the bumps get shallower and shorter. As the sides grow in number, the wheel becomes round and its road flat.</p>
<p>The bumps are exactly as tall as the bob they cancel. On a flat road, the axle rises and falls by the difference between its distance to a corner and to the middle of a side; on its own road, the dips are exactly that much deeper than the tops.</p>
<h3>Why the triangle fails</h3>
<p>The two rules give a road for a triangle too, but it can’t be ridden. As the triangle rolls over one bump, its leading corner swings down into the next bump before it reaches the dip. The road is right wherever the wheel touches it, and in the way elsewhere. Every regular wheel with four sides or more clears its road.</p>
<h3>Any wheel, its own road</h3>
<p>Your own wheel follows the same two rules, so a heart or an egg gets a road too. The room builds it from the wheel’s distance from the axle in every direction, then checks, at hundreds of moments as the wheel rolls, whether any of the road reaches inside it. Some wheels fail, and the places are shown in red: a sharp point digs into the next bump, like the triangle’s corner, or a deep dent makes a tall, sharp peak in the road, which pokes into the rim before the dent comes round to meet it.</p>
<p>The dots on your wheel move only in and out along their spokes, so every direction from the axle meets the rim exactly once. A rim that folded back, seen from the axle, would need a road that rises straight up.</p>
<details><summary>The mathematics, if you want it</summary><p>Describe the wheel by its distance from the axle, r(θ), in each direction θ. With the axle kept on the line y = 0 and the touching point straight below it, the road under the wheel’s point θ is at height y = −r(θ), and rolling without slipping makes dx = r dθ. For the side of a regular polygon, at distance a from the axle, r = a / cos θ, so x = a arsinh(tan θ) and y = −a cosh(x / a): an upside-down catenary, exactly as long as the side.</p>
<p>Leon Hall and Stan Wagon worked out this pairing of wheels and roads in “Roads and Wheels” (1992). The Exploratorium in San Francisco has shown a pair of square wheels on such a road; Stan Wagon built a tricycle with square wheels at Macalester College in 1997, and the National Museum of Mathematics in New York has one that rides on catenaries.</p>
<p>The catenary itself is older. Galileo thought a hanging chain made a parabola; Joachim Jungius showed that it doesn’t (published in 1669), and in 1691 Gottfried Leibniz, Christiaan Huygens and Johann Bernoulli found its equation, answering a challenge from Jacob Bernoulli.</p>
<p>The room’s tests check that the square’s road is y = −a cosh(x / a), that road and rim keep equal lengths, that wheels with 4 to 12 sides clear their roads while the triangle’s corner cuts up to 3% of its radius into the next bump, and the depths of other crashes, against a separate computation.</p></details>
<h3>What the room leaves out</h3>
<p>The road must match the wheel’s size exactly, and be lined up with it: start a square wheel on the slope of a bump instead of its top, and it rides badly. A real cart also has wheels on both sides, which must keep in step with each other and with the bumps. The cart here rolls at a steady speed, with no springs, no wobble and no friction, and the water’s splashing on the flat road is drawn for fun, not computed.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Square_wheel" target="_blank" rel="noopener">Square wheel (Wikipedia)</a><a class="source-link" href="https://mathworld.wolfram.com/Roulette.html" target="_blank" rel="noopener">Roulette (MathWorld)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Catenary (Wikipedia)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Curves/Catenary/" target="_blank" rel="noopener">Catenary (MacTutor)</a><a class="source-link" href="https://www.sciencenews.org/article/riding-square-wheels" target="_blank" rel="noopener">Riding on square wheels (Science News, 2004)</a><a class="source-link" href="https://math.hmc.edu/funfacts/?p=172" target="_blank" rel="noopener">Bike with square wheels (Math Fun Facts)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stan_Wagon" target="_blank" rel="noopener">Stan Wagon (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Museum_of_Mathematics" target="_blank" rel="noopener">National Museum of Mathematics (Wikipedia)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Bernoulli_Johann/" target="_blank" rel="noopener">Johann Bernoulli (MacTutor)</a></div>`,
  },
});
