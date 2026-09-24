/* The other side · visitor-facing words (English). */
Wonderloom.defineText('ribbon', 'en', {
  eyebrow: 'TOPOLOGY · 3D',
  name: 'The other side',
  tagline: 'Give a ribbon half a twist and one of its sides disappears.',
  title: 'Where is the other side?',
  subtitle: 'Turn a ribbon in space. Follow its edge. Let one twist surprise you.',
  field: 'Topology · Surfaces · 3D',
  sceneLabel: 'An ordinary strip, a strange journey',
  sceneName: 'The Möbius ribbon',
  tip: 'Drag to rotate · Arrow keys also turn the view',
  actionLabel: 'Follow the edge',
  canvasLabel: 'A three-dimensional ribbon. Drag or use arrow keys to rotate.',
  panelEyebrow: 'Turn & follow',
  whyLabel: 'Where did the other side go?',
  nudge:
    'Watch the golden traveler. With one half-twist, it takes two circuits around the hole to get back to its starting point.',
  connection: {
    html: '<strong>Make it real.</strong> Take a strip of paper, give one end a half-twist, and tape the ends together. Trace a line down its middle without lifting your pen.',
    label: 'Follow another kind of loop',
  },

  presets: [
    { name: 'No twist', note: 'A familiar band with two edges.' },
    { name: 'One half-twist', note: 'One continuous side. One edge.' },
    { name: 'A full twist', note: 'Two edges return.' },
  ],

  twists: 'Give the ribbon a twist',
  twistOptions: ['No twist · a band', 'Half a twist · Möbius', 'A full twist · a band'],
  width: 'Ribbon width',
  zoom: 'Look closer',
  spin: 'Let it turn',
  walk: 'Show the traveler',
  edges: 'Highlight the edges',

  nameOneSided: 'The Möbius ribbon',
  nameTwoSided: 'The twisted band',
  statusOneSided: 'One side · one edge',
  statusTwoSided: 'Two sides · two edges',
  showEdges: 'Follow the edge',
  hideEdges: 'Hide the edges',

  guests: [
    { name: 'August Möbius', note: 'One half twist makes “the other side” a trick question.' },
    { name: 'Johann Listing', note: 'He explored one-sided surfaces, too. History has more than one name.' },
  ],

  insight: {
    title: 'One twist changes the journey.',
    html: `<p>Join a strip of paper into a ring and you get two sides and two separate edges. Give one end a half-twist before joining it, and something changes: you can reach what looked like the other side without crossing an edge.</p>
<div class="insight-visual">The Möbius strip has one continuous side and one boundary loop.</div>
<h3>Follow the golden traveler</h3>
<p>The traveler starts away from the centerline. On a Möbius ribbon, one circuit around the hole brings it to the opposite width position. A second circuit returns it to the start. It never jumps across the ribbon.</p>
<h3>Count the edges</h3>
<p>“Follow the edge” highlights the boundary. With a half-twist, both apparent edges belong to one continuous loop. With no twist or a full twist, they are two separate loops, shown in different colors.</p>
<h3>A different way of seeing shape</h3>
<p>Topology studies properties that survive continuous bending and stretching. Turning this object on screen changes your viewpoint, while its one-sidedness stays the same.</p>
<details><summary>How is the surface drawn?</summary><p>For angle u and width coordinate v:<br>x = (R + v cos(nu/2)) cos(u)<br>y = (R + v cos(nu/2)) sin(u)<br>z = v sin(nu/2)</p><p>n counts half-twists. Odd n gives a Möbius band; even n gives a two-sided band. This is a parametric surface projected into the canvas, with depth-sorted faces. Translucent shading lets you see the traveler through the surface.</p></details>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/MoebiusStrip.html" target="_blank" rel="noopener">Explore the Möbius strip</a></div>`,
  },
});
