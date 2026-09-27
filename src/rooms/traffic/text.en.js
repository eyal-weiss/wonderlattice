/* The tempting shortcut · visitor-facing words (English). */
Wonderlattice.defineText('traffic', 'en', {
  eyebrow: 'GAME THEORY',
  name: 'The tempting shortcut',
  tagline: 'A new road that makes every driver slower.',
  title: 'The tempting shortcut.',
  subtitle: 'A new road looks like a gift. Open it and see what happens.',
  field: 'Networks · Game theory · A little surprise',
  sceneLabel: 'One city · Many private choices',
  sceneName: 'The city crossing',
  tip: 'Moving markers show proportions of traffic, not individual cars',
  actionLabel: 'Open the shortcut',
  canvasLabel: 'A directed road network. Open or close the middle shortcut, and vary the number of drivers.',
  panelEyebrow: 'Change one road',
  whyLabel: 'How could that happen?',
  nudge: 'Start with 4,000 drivers. Open the shortcut. Then try much lighter traffic. Is the road always a bad idea?',
  connection: {
    html: '<strong>Simple rules, unexpected result.</strong> In A mind of many, a flock makes a pattern from local interactions. Here, each driver choosing a fast route can make the whole trip slower.',
    label: 'Follow another crowd',
  },

  presets: [
    { name: 'Quiet roads', note: 'The shortcut might help.' },
    { name: 'A crowded city', note: 'Try the surprise.' },
    { name: 'Rush hour', note: 'Can the shortcut stop mattering?' },
  ],

  demand: 'Drivers crossing the city',
  demandHint: 'How crowded is the city?',
  drivers: (n) => n.toLocaleString('en'),

  status: (open, minutes) => `${open ? 'Shortcut open' : 'Shortcut closed'} · ${minutes} min now`,
  open: 'Open the shortcut',
  close: 'Close the shortcut',
  before: 'Before',
  after: 'After opening',
  minutes: ' min',
  verdict: {
    closed: 'Open the shortcut to reveal the new travel time.',
    same: 'The new road leaves the trip time unchanged.',
    slower: (minutes) => `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} slower for everyone.`,
    faster: (minutes) => `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} faster for everyone.`,
  },

  labels: {
    nodes: { start: 'S', north: 'A', south: 'B', end: 'T' },
    congestion: 'congestion',
    fixed: '45 min',
    shortcutOpen: '0 min',
    shortcutClosed: 'closed',
    caption: 'S → T · everyone chooses their fastest route',
  },

  guests: [
    { name: 'John von Neumann', note: 'Traffic is a game of choices, and a clever move can surprise everybody.' },
    { name: 'John Nash', note: 'Here, no driver can improve alone, even while everyone is slower.' },
  ],

  insight: {
    title: 'Why can a new road slow everyone down?',
    html: `<p>With 4,000 drivers and no shortcut, traffic splits evenly between the upper and lower routes. Each trip takes 65 minutes. Open the zero-minute link between A and B, and each driver sees a reason to use it. Everyone takes S → A → B → T, and each trip takes 80 minutes.</p>
<div class="insight-visual">A shortcut can change people’s choices, and their choices change congestion.</div>
<h3>Try a quieter city</h3>
<p>Move the demand slider toward 1,000. The shortcut now helps. At very high demand it goes unused. The paradox happens only over part of the range.</p>
<h3>What this model assumes</h3>
<p>Drivers choose a fastest route for themselves. Their combined decisions settle into an equilibrium where no driver can save time by switching alone. This is a simplified, directed network with a free shortcut and travel times that depend only on traffic flow. The moving dots show route proportions, not simulated individual decisions or a prediction for an actual city.</p>
<details><summary>The mathematics, if you want it</summary><p>The congestible edges cost x/100 minutes, where x is the number of drivers using that edge. The other two edges each cost 45 minutes; the A → B shortcut costs zero. Without it, travel time is 45 + D/200 for D drivers. At D = 4,000 this is 65 minutes. With it, the equilibrium uses the middle route and costs 2D/100 = 80 minutes.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explore Braess’s paradox (Easley &amp; Kleinberg)</a></div>`,
  },
});
