/* A body full of clocks · visitor-facing words (English). */
Wonderlattice.defineText('fireflies', 'en', {
  eyebrow: 'SYNCHRONY',
  name: 'A body full of clocks',
  tagline: 'Fireflies with their own rhythms fall into step once they notice each other.',
  title: 'A body full of clocks.',
  subtitle: 'Each firefly keeps its own time. Let them notice each other, and watch a shared rhythm appear.',
  field: 'Dynamical systems · Coupled oscillators · Biology',
  sceneLabel: 'One meadow · many clocks',
  sceneName: 'The firefly meadow',
  tip: 'Slide “How much they notice each other” past about 1 · The circle shows everyone’s rhythm',
  actionLabel: 'Scatter their rhythms',
  canvasLabel:
    'A meadow of fireflies glowing softly, each on its own rhythm, with a circle showing where each is in its cycle.',
  panelEyebrow: 'Rhythms that pull',
  whyLabel: 'Why do they fall into step?',
  nudge: 'Start at zero, then slide slowly upwards. Where does a shared pulse begin, and does it arrive all at once?',
  connection: {
    html: '<strong>Order without a conductor.</strong> Here, rhythms pull each other into step. In A mind of many, directions do the same thing for a flock.',
    label: 'See a flock agree',
  },

  presets: [
    { name: 'Each on its own', note: 'Nobody notices anybody.', badge: '0' },
    { name: 'Just past the edge', note: 'A shared pulse, slowly.', badge: '1.2' },
    { name: 'Day and night', note: 'A light cycle joins in.', badge: '☾' },
  ],

  coupling: 'How much they notice each other',
  couplingHint: 'Past about 1, a shared rhythm starts to grow.',
  sun: 'Add a day–night cycle',
  circle: 'Show everyone’s rhythm',
  fly: 'Fly eight time zones',
  together: 'In step',
  percent: (r) => `${Math.round(r * 100)}%`,

  // The status line, from how together the fireflies are.
  status: {
    apart: 'Each to its own rhythm',
    stirring: 'Small groups finding a beat',
    together: 'Flashing together',
  },
  flying: (days) => `After the flight · day ${days}`,
  caughtUp: (days) => `Caught up with the new day after ${days} ${days === 1 ? 'day' : 'days'}.`,
  announceTogether: 'Most of the fireflies now flash together.',
  announceApart: 'The fireflies have drifted apart.',

  // Words drawn on the canvas.
  labels: {
    rhythm: 'Everyone’s rhythm',
    history: 'In step, over time',
  },

  guests: [
    {
      name: 'Christiaan Huygens',
      note: 'In 1665, ill in bed, he saw two of his pendulum clocks keep time together, swinging in opposite directions, however he disturbed them.',
    },
    {
      name: 'Arthur Winfree',
      note: 'He asked how a crowd of slightly different clocks could agree on a time, and found a tipping point.',
    },
  ],

  insight: {
    title: 'Why do they fall into step?',
    html: `<p>Each firefly has its own natural rhythm, a little faster or slower than the others. When it sees the flashes around it, it nudges its own timing towards the crowd’s average. Nobody leads. If the nudges are weak, the differences win and the meadow twinkles at random. If they are strong enough, a shared rhythm grows and pulls in more and more fireflies.</p>
<div class="insight-visual">own rhythm + a pull towards the crowd → a shared pulse</div>
<h3>An edge, but not a switch</h3>
<p>Below a critical strength (1 on the slider), almost nothing happens. Just past it, a small core falls into step, and togetherness rises steeply as you slide further, but smoothly, not all at once. With finitely many fireflies the edge is a little blurred, and even “each on its own” shows about 10% togetherness by chance.</p>
<h3>Clocks in your body</h3>
<p>Your cells carry clocks too, running a little over or under 24 hours. Light each morning pulls them into step with the day. Fly across time zones and the light arrives at the “wrong” time: your clocks take days to catch up. That’s jet lag. Here one “day” lasts about two seconds.</p>
<h3>What this model leaves out</h3>
<p>Real fireflies don’t all see each other, their flashes are pulses rather than smooth rhythms, and body clocks involve genes, hormones and a master clock in the brain. This is the classic simplified model that captures the tipping point, not a simulation of real insects or cells.</p>
<details><summary>The mathematics, if you want it</summary><p>This is the Kuramoto model. Each phase θ follows dθ/dt = ω + K·R·sin(ψ − θ), where ω is its natural frequency and R·e<sup>iψ</sup> is the average of all the e<sup>iθ</sup>: R near 1 means in step, R near 0 means spread out. For natural frequencies spread like a bell curve, a shared rhythm appears past K = 2 / (π g(0)), where g(0) is how common the average frequency is. The slider is measured in units of that critical K. The day–night cycle adds a term F·sin(φ − θ), a rhythm that pulls everyone.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Kuramoto_model" target="_blank" rel="noopener">Kuramoto model</a> · <a class="source-link" href="https://www.nigms.nih.gov/image-gallery/2569" target="_blank" rel="noopener">NIGMS: circadian rhythm</a> · S. H. Strogatz, <em>Sync</em> (2003)</div>`,
  },
});
