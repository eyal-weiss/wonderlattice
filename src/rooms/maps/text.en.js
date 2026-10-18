/* The straight road that looks bent · visitor-facing words (English). */
Wonderlattice.defineText('maps', 'en', {
  eyebrow: 'MAPS',
  name: 'The straight road that looks bent',
  tagline: 'Why a plane from New York to Tokyo flies over Alaska, and why no flat map can tell the whole truth.',
  title: 'The straight road that looks bent.',
  subtitle:
    'Two planes fly from New York to Tokyo at the same speed. The one on the curve lands first. Drag the pins, or change the map.',
  field: 'Geometry on a ball · Maps · Navigation',
  sceneLabel: 'One Earth, four pictures of it',
  tip: 'Drag a pin to move it, or drag the map to turn the world · Tap the map to drop a sticker, drag one to move it · Keys: 1 and 2 pick a pin, the arrows move it (or turn the world), Esc lets go, Enter races again',
  actionLabel: 'Race again',
  canvasLabel:
    'A map of the world with two pins. A glowing line joins them by the shortest route over the Earth, and a dashed line keeps one compass heading. Two planes race along them at the same speed.',
  panelEyebrow: 'Choose the map',
  whyLabel: 'Why is the curve shorter?',
  nudge: 'Switch to the gnomonic map. The curved route becomes a straight line, and the compass line bends instead.',
  connection: {
    html: '<strong>Keeping angles, losing sizes.</strong> Mercator’s map keeps every small circle round, however much it grows it. So do the functions in “Bend the plane”, which bend a picture and keep its tiny angles.',
    label: 'Bend the plane',
  },

  presets: [
    { name: 'New York to Tokyo', note: 'The shortest way passes over Alaska.' },
    { name: 'Madrid to Beijing', note: 'Both near 40°N, yet the shortest route climbs to 59°N.' },
    { name: 'Greenland goes on a diet', note: 'Identical stickers, and Greenland moved to Africa.' },
  ],
  yourOwn: 'Your own route',
  cities: {
    newYork: 'New York',
    tokyo: 'Tokyo',
    madrid: 'Madrid',
    beijing: 'Beijing',
    london: 'London',
    losAngeles: 'Los Angeles',
  },
  pin: (n) => `${n}`,

  // Numbers arrive already written in the page's language.
  km: (n) => `${n} km`,
  north: (x) => `${x}°N`,
  south: (x) => `${x}°S`,
  percent: (x) => `${x}%`,
  times: (x) => `×${x}`,

  truths: [
    'On Mercator’s map, one compass heading is a straight line.',
    'On the globe, the shortest route is a string pulled tight.',
    'On the gnomonic map, every shortest route is a straight line.',
    'On an equal-area map, every sticker covers the same area.',
  ],
  key: {
    arc: (km) => `Shortest route: ${km}`,
    rhumb: (km) => `One compass heading: ${km}`,
  },
  flying: 'Two planes, the same speed…',
  first: (km) => `The curve lands first, with ${km} less to fly`,
  saves: (km, percent) => `The shortest route saves ${km} (${percent})`,
  same: 'Here both routes are the same line.',
  greenlandName: 'Greenland',
  greenlandLabel: (x) => `Greenland ${x}`,

  viewLabel: 'Map',
  views: ['Mercator', 'Globe', 'Gnomonic', 'Equal area'],
  viewHints: [
    'Mercator’s map of 1569: a compass heading is a straight line.',
    'The Earth as a ball: nothing stretched, but only half of it in sight.',
    'Every shortest route is a straight line, but less than half the world fits.',
    'The Gall–Peters map: every place keeps its true area.',
  ],
  readout: {
    arc: 'Shortest route (great circle)',
    rhumb: 'One compass heading (rhumb line)',
    greenland: 'Greenland’s copy is drawn',
  },
  rule: (percent) => `The shortest route is ${percent} shorter.`,
  reaches: (lat) => `On the way it reaches ${lat}.`,
  trueSize: (x) => `${x} its true size`,
  atTrueSize: 'at its true size',
  stickerRules: [
    'Mercator draws areas 1 ÷ cos²(latitude) times too big: ×4 at 60°, ×33 at 80°.',
    'On the globe nothing is stretched: the stickers only tilt away towards the edge.',
    'The farther from the middle, the bigger the gnomonic map draws things.',
    'Equal areas, but squashed shapes: near the poles, wide and flat.',
  ],
  stickers: 'Identical stickers all over the world',
  stickersHint: 'Each covers the same area of the Earth. Tap the map to drop one; drag one to move it.',
  status: (km) => `${km} by the shortest route`,
  dropped: (lat, x) => `A sticker at ${lat}, drawn ${x} its true size.`,
  droppedGlobe: 'A sticker on the globe, at its true size.',
  picked: (n) => `Pin ${n}: the arrow keys move it. Esc lets go.`,
  letGo: 'The arrow keys turn the world.',

  guests: [
    {
      name: 'Gerardus Mercator',
      note: 'In 1569 he drew a world map on which a sailor’s steady compass heading is a straight line.',
    },
    {
      name: 'Pedro Nunes',
      note: 'He showed that a ship keeping one compass heading doesn’t follow a great circle, but a curve that spirals towards the pole.',
    },
    {
      name: 'Nicolas Auguste Tissot',
      note: 'In 1859 and 1871 he showed how to see a map’s stretching, by drawing on it tiny circles from the globe.',
    },
  ],

  insight: {
    title: 'Why is the curve shorter?',
    html: `<p>On a ball, the shortest path between two places runs along a <strong>great circle</strong>: where the ball meets a plane through its centre, like the equator. Stretch a string tight between New York and Tokyo on a globe and it heads north-west, over Canada and Alaska, before coming down to Japan. That is about 10,850 km. Keeping one compass heading the whole way, as the dashed line does, takes about 12,790 km.</p>
<div class="insight-visual">shortest route: a great circle · straight on Mercator: one compass heading</div>
<h3>Why the short route looks long</h3>
<p>Mercator’s map stretches everything near the poles, so the northern part of the curve is drawn far longer than it is. The dashed line keeps one compass heading, crossing every meridian at the same angle; it is called a rhumb line. Gerardus Mercator built his map in 1569 so that rhumb lines come out straight, and that made it a superb chart for sailors: draw a straight line, read off its angle, and steer by the compass. But a straight line on his map is almost never the shortest way.</p>
<h3>A map on which the shortest routes are straight</h3>
<p>The gnomonic map projects the globe from its centre onto a flat sheet touching it. Every great circle lies in a plane through the centre, and that plane meets the sheet in a straight line, so every shortest route is drawn straight. The price is huge stretching, and less than half the world fits. Navigators used both: they drew the route as a straight line on a gnomonic chart, then copied its points onto a Mercator chart to steer by.</p>
<h3>No flat map tells the whole truth</h3>
<p>In 1827 Carl Friedrich Gauss proved that a ball’s curvature belongs to the surface itself (his <em>Theorema Egregium</em>, the “remarkable theorem”), so no piece of a ball can be laid flat without stretching. Every flat map of the world distorts something. A map can keep every angle, like Mercator’s, or every area, like the Gall–Peters map here (and others, such as Mollweide’s and the Equal Earth map), but never both, and none keeps every distance. In 1859 and 1871 Nicolas Auguste Tissot showed how to see this, by drawing small identical circles from the globe onto the map: on a map that keeps angles they stay round but change size; on one that keeps areas they keep their size but get squashed. The stickers in this room are his circles.</p>
<details><summary>Greenland and Africa</summary><p>Greenland covers about 2.17 million km², and Africa about 30.4 million km², fourteen times as much. On Mercator’s map they look about the same size, because it draws areas 1 ÷ cos²(latitude) times too big: four times at 60°, about twelve times at 73°, near the middle of Greenland. Moved to the equator, its copy shrinks to its true size: about as big as the Democratic Republic of the Congo.</p></details>
<details><summary>The mathematics, if you want it</summary><p>On a ball of radius R, the great-circle distance between latitudes φ₁, φ₂ and longitudes λ₁, λ₂ is R × Δσ, where hav(Δσ) = hav(Δφ) + cos φ₁ cos φ₂ hav(Δλ) and hav(x) = sin²(x/2). A rhumb line has length R × √(Δφ² + q²Δλ²), with q = Δφ ÷ Δψ and Δψ the change in ln tan(45° + φ/2), which is exactly Mercator’s height above the equator: that is why rhumb lines come out straight on his map. The room uses R = 6,371 km. Its tests check its distances against an independent calculation, and that the shortest route lands on the map’s straight line in the gnomonic view.</p>
<p>Mercator didn’t publish how he built his map. Edward Wright published the first accurate tables for drawing it in 1599. Pedro Nunes had described rhumb lines earlier in the sixteenth century. The gnomonic projection is thought to be the oldest of all, perhaps used for maps of the stars in ancient Greece.</p></details>
<h3>What the room leaves out</h3>
<p>The Earth here is a perfect ball. The real one is slightly flattened, and distances over it differ from these by up to about 0.5%. Real flights stay close to the great circle, not on it: they follow the winds, and air-traffic and safety rules. The coastlines are simplified, and islands smaller than 5,000 km² are left out. Mercator’s map runs off to infinity at the poles, so it stops at 85° here. Mercator’s map isn’t a mistake: it was made for navigation, does that job well, and a version of it (“Web Mercator”) is still used by online maps, where zooming in on a small area matters more than comparing continents.</p>
<p>Map data: Natural Earth (public domain).</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Great-circle_distance" target="_blank" rel="noopener">Great-circle distance (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Rhumb_line" target="_blank" rel="noopener">Rhumb line (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mercator_projection" target="_blank" rel="noopener">Mercator projection (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gnomonic_projection" target="_blank" rel="noopener">Gnomonic projection (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gall%E2%80%93Peters_projection" target="_blank" rel="noopener">Gall–Peters projection (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tissot%27s_indicatrix" target="_blank" rel="noopener">Tissot’s indicatrix (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Theorema_Egregium" target="_blank" rel="noopener">Theorema Egregium (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Greenland" target="_blank" rel="noopener">Greenland (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Africa" target="_blank" rel="noopener">Africa (Wikipedia)</a><a class="source-link" href="https://pubs.usgs.gov/pp/1395/report.pdf" target="_blank" rel="noopener">J. P. Snyder, Map Projections: A Working Manual (USGS, 1987)</a><a class="source-link" href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Mercator_Gerardus/" target="_blank" rel="noopener">Gerardus Mercator (MacTutor)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Nunes/" target="_blank" rel="noopener">Pedro Nunes (MacTutor)</a></div>`,
  },
});
