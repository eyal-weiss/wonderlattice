/* A mind of many · visitor-facing words (English). */
Wonderlattice.defineText('flock', 'en', {
  eyebrow: 'EMERGENCE',
  name: 'A mind of many',
  tagline: 'No leader, just neighbours: guide a flock into motion.',
  title: 'A mind of many.',
  subtitle: 'No leader. Just neighbours. Guide a little world into motion.',
  field: 'Dynamical systems · Emergence',
  sceneLabel: 'A world of local decisions',
  sceneName: 'The moving collective',
  tip: 'Touch or drag to guide the flock · Arrow keys move your touch, Escape releases it · Edges wrap around',
  actionLabel: 'Scatter the flock',
  canvasLabel: 'A flock of moving marks. Touch, drag, or use arrow keys to guide. Press Escape to release.',
  panelEyebrow: 'Local rules',
  whyLabel: 'Who is in charge?',
  nudge: 'Turn “Match direction” down to zero. Can a crowd stay together without agreeing where to go?',
  connection: {
    html: '<strong>A pattern without a planner.</strong> Here, a whole flock emerges from little interactions. In Hear the shape, a new waveform emerges from adding two simpler ones.',
    label: 'See waves combine',
  },

  presets: [
    { name: 'In company', note: 'Find a shared direction.' },
    { name: 'Everyone for themselves', note: 'Let individual paths take over.' },
    { name: 'Stay close', note: 'Togetherness without much agreement.' },
  ],

  align: 'Match direction',
  cohesion: 'Stay together',
  separate: 'Keep some space',
  influence: 'Your touch',
  attract: 'Attract',
  repel: 'Repel',
  trails: 'Leave light trails',
  neighbors: 'Show one neighbourhood',
  agreement: 'Direction agreement',

  status: (n) => `${n} individual decisions`,

  guests: [
    {
      name: 'John Conway',
      credit: 'Thane Plambeck (cropped)',
      note: 'His Game of Life also makes surprises from tiny local rules.',
    },
    { name: 'Alan Turing', note: 'His pattern model showed how local changes can make spots and stripes.' },
  ],

  insight: {
    title: 'Who is in charge?',
    html: `<p>Nobody. Each moving mark looks only at nearby neighbours and follows three tendencies: avoid crowding, match their direction, and stay close.</p>
<div class="insight-visual">Individual interactions → collective motion</div>
<h3>The pattern lives between the individuals</h3>
<p>No mark knows the whole shape of the flock. Coherent movement can emerge because each one responds to a small part of the group. Your cursor adds an outside attraction or repulsion.</p>
<h3>A model, not a whole animal</h3>
<p>This is a simplified version of Craig Reynolds’s Boids model. It captures some visual qualities of flocks and schools, but it does not explain every decision made by real birds or fish.</p>
<h3>Look through one pair of eyes</h3>
<p>Turn on “Show one neighbourhood”. The circle marks one individual’s sensing distance; lines point to the neighbours influencing it. Opposite edges connect, so a neighbour can be close across an edge.</p>
<details><summary>What does “agreement” measure?</summary><p>We average all the unit direction vectors and take the length of the result. Close to 100% means everyone points roughly the same way. Close to zero means directions mostly cancel. It is a description of the current flock, not a score.</p><p>Each step combines separation, alignment, and cohesion steering, then limits speed. All individuals update from the same previous state.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds on Boids</a></div>`,
  },
});
