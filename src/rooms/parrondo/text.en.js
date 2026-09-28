/* Two losing games that win · visitor-facing words (English). */
Wonderlattice.defineText('parrondo', 'en', {
  eyebrow: 'CHANCE',
  name: 'Two losing games that win',
  tagline: 'Each coin game slowly drains your money. Mix them, and the money climbs.',
  title: 'Two losing games that win.',
  subtitle: 'Game A loses. Game B loses. Watch a thousand players try each one, then mix them.',
  field: 'Probability · Markov chains · A paradox',
  sceneLabel: '1,000 players · 1,000 rounds each',
  sceneNames: ['Only A', 'Only B', 'A or B at random'],
  patternName: (pattern) => `The pattern ${pattern}`,
  tip: 'Each faint dot is a player · The thick line is their average, the dashed line the exact expectation · Pick a game in the panel',
  actionLabel: 'New players',
  canvasLabel:
    'A chart of winnings over 1,000 rounds. Faint dots are 1,000 players; a thick line is their average winnings, and a dashed line the exact expected winnings. Lines from games already tried stay on faintly. With the buckets shown, three bars give the share of players whose coins are a multiple of 3, one more, or two more.',
  panelEyebrow: 'Pick a game',
  whyLabel: 'How can two losers win?',
  nudge:
    'Try Only A, then Only B: both sink. Then mix them. Then tap out patterns of your own: many win, but some, like A B, still lose.',
  connection: {
    html: '<strong>Fair-looking, and full of surprises.</strong> Here, two losing games win together. In The dice that beat each other, every die has another that beats it.',
    label: 'Roll the odd dice',
  },

  presets: [
    { name: 'Only B', note: 'A bad coin on every multiple of 3.', badge: 'B' },
    { name: 'A or B at random', note: 'Two losers make a winner.', badge: 'A|B' },
    { name: 'A A B B', note: 'A steady rhythm wins too.', badge: 'AABB' },
  ],

  rules: {
    title: 'The two games',
    aHtml: '<strong>A</strong> · a coin that wins 49.5% of the time.',
    bHtml:
      '<strong>B</strong> · if your coins are a multiple of 3, a bad coin that wins 9.5%; otherwise a good one that wins 74.5%.',
    stakes: 'Every win is one coin more, every loss one coin less. Everyone starts at 0.',
  },

  // The games' names, as letters (the model always calls them A and B).
  letters: ['A', 'B'],
  modeLabel: 'Which game do they play?',
  modes: ['Only A', 'Only B', 'Mix at random', 'My pattern'],

  patternLabel: 'Tap out your own pattern',
  patternHint: 'It repeats, round after round, for every player. Up to 12 letters.',
  add: (game) => `Add ${game}`,
  undo: 'Undo',
  undoLabel: 'Remove the last letter',

  buckets: 'Why? Show the three buckets',

  readout: {
    expected: (rounds) => `Expected after ${rounds} rounds`,
    perRound: (value) => `${value} a round, in the long run`,
    average: (players, value) => `Average of ${players} players so far: ${value}`,
    badShare: (live, exact, line) =>
      `B’s rounds played on a multiple of 3: ${live} so far, ${exact} in the long run. B pays only below ${line}.`,
    noB: 'Only A never plays B, so the buckets just even out at a third each.',
  },

  status: {
    round: (t, rounds) => `Round ${t} of ${rounds}`,
    done: (rounds) => `${rounds} rounds played`,
  },
  announce: {
    done: (game, average, expected) => `${game}: the average player ends with ${average} coins; expected ${expected}.`,
  },

  // Words drawn on the picture.
  labels: {
    rounds: 'rounds',
    start: 'start',
    expected: (value) => `expected ${value}`,
    average: (value) => `average ${value}`,
    short: ['A', 'B', 'mix'],
    buckets: 'Players by the coins left over when shared into threes',
    bucket: ['multiple of 3', 'one more', 'two more'],
    coin: ['B’s bad coin', 'B’s good coin', 'B’s good coin'],
    breakEven: 'B breaks even',
  },

  guests: [
    {
      name: 'Juan Parrondo',
      note: 'I dreamt up these games in 1996, as a coin-tossing version of a ratchet that makes jiggling particles drift one way.',
    },
    {
      name: 'Richard Feynman',
      note: 'In my lectures, a tiny ratchet in a warm gas can’t turn one way for free: its pawl jiggles as much as its wheel.',
    },
  ],

  insight: {
    title: 'How can two losers win?',
    html: `<p>Game A is almost a fair coin: it loses about one coin every 100 rounds. Game B is stranger, because it looks at your coins. When they are a multiple of 3 (…, −3, 0, 3, 6, …) it uses a bad coin; otherwise a good one. On a multiple of 3 you usually lose a coin, and from there the good coin usually lifts you straight back to the multiple of 3. So B keeps sending players back to its bad coin: about 38.4% of its rounds are played there, just past the 37.7% at which B would break even. B loses, slowly.</p>
<div class="insight-visual">B alone: 38.4% of its rounds on the bad coin → it loses · Mixed with A: 34.5% → B wins more than A loses</div>
<h3>Mixing shakes players loose</h3>
<p>A doesn’t care what you have, so a round of A jostles your coins up or down at random and breaks B’s rhythm. Mixed in, it sends B’s rounds to a multiple of 3 only about 34.5% of the time. Now B’s good coin gets used more than B on its own allows, and B wins by more than A loses. In the long run, per round: A loses 0.010 of a coin, B loses 0.0087, and picking A or B at random wins 0.0157. Turn on the buckets to watch the share of players on a multiple of 3 sink below B’s break-even line.</p>
<h3>Not every mix wins</h3>
<p>A A B B wins and A B B wins handsomely, but A B, taken strictly in turn, still loses. Try some patterns and watch the number for the long run.</p>
<h3>What this doesn’t mean</h3>
<p>B isn’t an ordinary losing game: its odds depend on your capital, and that dependence is the whole trick. Casino games don’t look at your bankroll, so mixing them can’t turn losing into winning; this is no way to beat a casino. People have suggested Parrondo-like effects in biology and finance, but those ideas are debated, and this room leaves them out. The players here are a simulation, so their average wobbles, by about a coin after 1,000 rounds; the dashed line is the exact expectation, worked out rather than simulated.</p>
<details><summary>The mathematics, if you want it</summary><p>Only your coins modulo 3 matter, so each game is a Markov chain on three states. Game A wins with chance ½ − ε and B with chance 1/10 − ε in state 0 and ¾ − ε in states 1 and 2, with ε = 0.005. B’s stationary distribution is about (0.3836, 0.1543, 0.4621); with ε = 0 it is exactly (5/13, 2/13, 6/13), and B is exactly fair. The expected gain per round is Σ πᵢ (2pᵢ − 1). Picking A or B at random is one chain with the two games’ chances averaged; a repeating pattern such as A A B B is the product of its rounds’ matrices. Juan Parrondo devised the games in 1996, as a discrete version of a “flashing Brownian ratchet”, a relative of the ratchet and pawl in chapter 46 of Volume I of The Feynman Lectures on Physics. G. P. Harmer and D. Abbott, “Losing strategies can win by Parrondo’s paradox”, Nature 402, 864 (1999). P. Amengual, P. Meurs, B. Cleuren and R. Toral, “Reversals of chance in paradoxical games”, Physica A (2006).</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/47220" target="_blank" rel="noopener">Harmer and Abbott, Nature (1999)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parrondo%27s_paradox" target="_blank" rel="noopener">Parrondo’s paradox</a><a class="source-link" href="https://arxiv.org/abs/math/0601404" target="_blank" rel="noopener">Reversals of chance in paradoxical games</a></div>`,
  },
});
