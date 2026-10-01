/* The table that forgets · visitor-facing words (English). */
Wonderlattice.defineText('billiards', 'en', {
  eyebrow: 'CHAOS · GEOMETRY',
  name: 'The table that forgets',
  tagline: 'The same shot, twice, on two billiard tables. One table remembers it; the other forgets in seconds.',
  title: 'The table that forgets.',
  subtitle:
    'On each table a ball and its twin set off together, a thousandth of a degree apart. Watch which table keeps them together.',
  field: 'Dynamical billiards · Chaos · Conic sections',
  sceneLabel: 'Two tables · Two shots each · No randomness',
  sceneName: 'An ellipse and a stadium',
  tip: 'Drag on a table to aim, and let go to shoot · ← → turn the shot · ↑ ↓ move it · Enter takes a new shot',
  actionLabel: 'New shot',
  canvasLabel:
    'Two billiard tables, an ellipse and a stadium. On each, a ball and its twin, launched a thousandth of a degree apart, leave glowing paths. Drag on a table to aim a new shot, or use the arrow keys.',
  panelEyebrow: 'Shape the table',
  whyLabel: 'Why does one table forget?',
  nudge:
    'Once the stadium’s twins have parted, slide its straight sides down to 0%, a circle, then up to just 5%. How much straight side does it take to forget?',
  connection: {
    html: '<strong>The same lesson, with no equations.</strong> In Weather twins, three equations pull nearly identical starts apart. Here the shape of a table does it alone.',
    label: 'See twin weathers part',
  },

  presets: [
    { name: 'Twin shots', note: 'The same shot on both tables, each with a twin 0.001° off.' },
    { name: 'Shoot from a focus', note: 'A pocket at one focus. Every shot from the other one goes in.' },
    { name: 'A sliver of straight', note: 'Straight sides only 5% of the height. Is that enough?' },
  ],

  flat: 'The stadium’s straight sides',
  flatHint: 'As a share of the table’s height. At 0% the stadium is a circle.',
  speed: 'Speed',
  pocket: 'A pocket at one focus',
  exposure: 'Long exposure',
  caustic: 'Show the curve the ellipse’s shot never crosses',

  ellipse: 'Ellipse',
  stadium: 'Stadium',
  together: (n) => `Twins together · ${n} ${n === 1 ? 'bounce' : 'bounces'}`,
  parted: (n) => `Twins parted at bounce ${n}`,
  pocketIn: (n) => (n === 0 ? 'Straight in' : `In after ${n} ${n === 1 ? 'bounce' : 'bounces'}`),
  pocketRolling: (n) => `Rolling · ${n} ${n === 1 ? 'bounce' : 'bounces'} so far`,
  legendBall: 'a shot',
  legendTwin: 'its twin, 0.001° off',
  legendPocket: 'shots start from the white spot',
  chartLabel: 'How far apart the twins are, on 2-metre tables (each line is ten times farther)',
  partedLine: 'parted',
  seconds: (n) => `${n} s`,
  pocketChart: 'Bounces each shot took to go in, the latest on the right',
  statusTogether: (n) => `Bounce ${n} · both pairs together`,
  statusParted: (n) => `The stadium’s twins parted at bounce ${n}`,
  statusBoth: 'Both pairs of twins have parted',
  statusPocket: (e, s) => `Shots in: ellipse ${e}, stadium ${s}`,
  announceParted: (n) => `The stadium’s twins have parted, after ${n} bounces. The ellipse’s twins are still together.`,

  readout: {
    apart: 'If the tables were 2 metres long, the twins would now be apart by:',
    ellipse: 'On the ellipse',
    stadium: 'On the stadium',
    curve: 'The ellipse’s shot never crosses',
    curves: { ellipse: 'a smaller ellipse', hyperbola: 'a hyperbola', foci: 'no curve: it runs through the foci' },
    pocket: 'Bounces each shot took to go in:',
    none: 'none in yet',
  },
  length: {
    tiny: 'less than 0.01 mm',
    mm: (x) => `${x} mm`,
    cm: (x) => `${x} cm`,
    m: (x) => `${x} m`,
  },
  list: (items) => items.join(', '),

  guests: [
    {
      name: 'George David Birkhoff',
      note: 'He used a ball on a table as a model of motion in general, and guessed that among smooth, rounded tables only ellipses keep such order.',
    },
    {
      name: 'Jean-Victor Poncelet',
      note: 'As a prisoner of war in Russia in 1813, he recalled the geometry he had learnt and pushed it further. Later he showed that if one zigzag between two conics closes up, they all do.',
    },
  ],

  insight: {
    title: 'Why does one table forget?',
    html: `<p>Nothing on either table is random. Each ball rolls in a straight line and leaves the rail at the angle it arrived, and each twin starts from the same spot, aimed a thousandth of a degree off. On the ellipse the twins stay together for hundreds of bounces. On the stadium, within about a dozen bounces they are far apart. The shape of the rail alone makes the difference.</p>
<div class="insight-visual">ellipse: the gap grows a little with each bounce · stadium: it grows about 2½ times with each bounce</div>
<h3>The ellipse’s secret: its two foci</h3>
<p>An ellipse is the set of points whose distances to two fixed points, its foci, add up to the same total. That makes the rail at every point meet the lines from the two foci at equal angles, so a ball rolling through one focus always bounces through the other. Try “Shoot from a focus”: every shot from one focus drops into a pocket at the other. The writer Alex Bellos had an elliptical pool table built on this idea, called Loop.</p>
<h3>The curve it never crosses</h3>
<p>Leave a shot running on the ellipse and its path paints a bright ring around an empty oval or, if it crosses the line between the foci, around two empty lens shapes. Every straight run of the path touches the same hidden curve, its caustic: a smaller ellipse, or a hyperbola, with the same foci as the table. One number, fixed by the first shot, decides which, so the ellipse never forgets how it was played. Twins aimed slightly differently touch slightly different caustics, so they drift apart only slowly. George David Birkhoff showed that the elliptical table is orderly in this way, which mathematicians call integrable. Poncelet’s closure theorem shows up here too: if one shot touching a caustic comes back to its start after some number of bounces, every shot touching that caustic does.</p>
<h3>Where the stadium’s chaos comes from</h3>
<p>The stadium is two semicircles joined by straight sides. A curved end focuses a narrow bundle of nearby paths, like a mirror, but the bundle passes its focus and spreads out again along the straight run, wider than before. Bounce after bounce, the spreading wins. Here the gap between twins grows on average about two and a half times with each bounce, which is exponential growth. In the 1970s Leonid Bunimovich proved that the stadium is ergodic: almost every path eventually visits every part of the table, spending time in each part in proportion to its area. That is why the long exposure greys the stadium evenly. Any straight side at all is enough, however short, though the shorter it is, the more slowly the twins part. With no straight sides the stadium is a circle, as orderly as the ellipse.</p>
<p>This is sensitive dependence on initial conditions, the effect behind Weather twins, reached here from geometry alone, without any equations of motion.</p>
<h3>What this model leaves out</h3>
<p>These are ideal balls: points with no size, spin or friction, on a perfectly shaped rail. The stadium has exceptional shots that never spread out, such as one bouncing straight up and down between the two straight sides. They are infinitely rare, but a path that comes close to one can linger near it for a long time. And the computer rounds every number to about 16 digits. On the ellipse that hardly matters. On the stadium, rounding errors grow like any other small difference, so after a few dozen bounces the ball on the screen is no longer where exact arithmetic would put it: the picture shows how stadium paths behave, not where this exact shot would be. Even the ellipse’s twins part in the end, because their gap does grow, steadily rather than exponentially: from the opening shot, it takes about 1,300 bounces.</p>
<details><summary>The mathematics, if you want it</summary><p>The ellipse is x²/a² + y²/b² = 1 with foci at (±c, 0), where c² = a² − b²; here a = 2 and b = 1. For a ball at (x, y) moving in the direction (u, v), its angular momenta about the two foci are L₁ = (x + c)v − yu and L₂ = (x − c)v − yu, and their product k = L₁L₂ is the same after every bounce. When k &gt; 0 the caustic is the ellipse x²/(c² + k) + y²/k = 1; when k &lt; 0 it is the hyperbola x²/(c² + k) − y²/(−k) = 1; and k = 0 means the path runs through the foci. In this stadium (straight sides as long as the table is high), nearby paths separate on average like e<sup>λn</sup> after n bounces, with λ ≈ 0.9: that is its Lyapunov exponent. The room finds each bounce exactly, by solving for where the straight path meets the ellipse, or the stadium’s sides and semicircles, and a twin counts as parted once it is more than a twentieth of the table’s height from its partner.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dynamical_billiards" target="_blank" rel="noopener">Dynamical billiards</a><a class="source-link" href="http://www.scholarpedia.org/article/Dynamical_billiards" target="_blank" rel="noopener">L. A. Bunimovich, “Dynamical billiards”, Scholarpedia 2(8):1813 (2007)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stadium_(geometry)" target="_blank" rel="noopener">Stadium (geometry)</a><a class="source-link" href="https://projecteuclid.org/journals/communications-in-mathematical-physics/volume-65/issue-3/On-the-ergodic-properties-of-nowhere-dispersing-billiards/cmp/1103904878.full" target="_blank" rel="noopener">L. A. Bunimovich, “On the ergodic properties of nowhere dispersing billiards”, Communications in Mathematical Physics 65 (1979)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Poncelet%27s_closure_theorem" target="_blank" rel="noopener">Poncelet’s closure theorem</a><a class="source-link" href="https://www.loop-the-game.com/scoop" target="_blank" rel="noopener">Loop, Alex Bellos’s elliptical pool table</a></div>`,
  },
});
