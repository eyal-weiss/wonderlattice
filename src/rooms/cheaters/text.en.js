/* Kaleidoscope of cheaters · visitor-facing words (English). */
Wonderlattice.defineText('cheaters', 'en', {
  eyebrow: 'COOPERATION',
  name: 'Kaleidoscope of cheaters',
  tagline: 'One cheater among cooperators, one simple rule, and a rug of war and peace that keeps changing.',
  title: 'Kaleidoscope of cheaters.',
  subtitle:
    'Cheating always pays more. Yet when everyone copies their most successful neighbour, one cheater grows into a kaleidoscope, and the cooperators never die out.',
  field: 'Game theory · The prisoner’s dilemma · Cellular automata',
  sceneLabel: '99 × 99 players · Copy the best',
  sceneNames: ['One cheater', 'A mixed crowd', 'Switching one at a time'],
  mixed: 'Your own grid',
  tip: 'Tap a cell to make it cheat, or cooperate again · Arrow keys aim, Enter switches',
  actionLabel: 'Add a stray cheater',
  canvasLabel:
    'A grid of players: blue cooperators, red cheaters, and yellow and green for players who have just switched. Tap a cell to switch it, or use the arrow keys to aim and Enter to switch.',
  panelEyebrow: 'Copy the best',
  whyLabel: 'Why don’t the cheaters win?',
  nudge:
    'Press “Add a stray cheater”, or tap a cell away from the middle: the perfect symmetry breaks. Then untick “Everyone switches at once”.',
  connection: {
    html: '<strong>Copy your neighbours.</strong> Here, players copying the most successful one nearby weave a rug. In “A mind of many”, birds following a few neighbours move as one flock.',
    label: 'Visit “A mind of many”',
  },

  presets: [
    { name: 'One cheater', note: 'A single cheater in the middle.' },
    { name: 'A mixed crowd', note: 'One player in ten starts cheating.' },
    { name: 'One at a time', note: 'Players switch in turn, not together.' },
  ],

  temptation: 'Temptation',
  temptationHint: 'What a cheater earns from each cooperator it meets. Two cooperators earn 1 each.',
  window: 'The kaleidoscope lives between 1.8 and 2.',
  speed: 'Speed',
  perSecond: (n) => (n === 1 ? '1 generation a second' : `${n} generations a second`),
  together: 'Everyone switches at once',
  fresh: 'Colour who has just switched',
  next: 'Next generation',

  key: {
    title: 'WHO IS WHO',
    cooperator: 'Cooperates',
    cheater: 'Cheats',
    newCooperator: 'Just started cooperating',
    newCheater: 'Just started cheating',
  },
  chart: {
    title: 'SHARE COOPERATING',
    estimate: 'Nowak and May’s 31.8%',
    span: (n) => (n === 1 ? 'the last generation' : `the last ${n} generations`),
  },

  inspect: {
    title: 'ONE PLAYER’S NEXT MOVE',
    hint: 'Point at a player, or aim with the arrow keys, to see the scores around it.',
    player: (cheats, score) =>
      cheats ? `This player cheats and scored ${score}.` : `This player cooperates and scored ${score}.`,
    best: (cheats, score) =>
      cheats
        ? `The best score around it, its own included, is a cheater’s: ${score}.`
        : `The best score around it, its own included, is a cooperator’s: ${score}.`,
    tie: (score) => `A cooperator and a cheater share the best score, ${score}, so it keeps its strategy.`,
    next: (cheats) => (cheats ? 'So next it cheats.' : 'So next it cooperates.'),
  },

  status: (gen, percent) => `Generation ${gen} · ${percent}% cooperate`,
  settled: (gen, percent) => `Settled for good at generation ${gen} · ${percent}% cooperate`,
  repeating: (period, percent) => `Repeating every ${period} generations · ${percent}% cooperate`,
  allCheat: (gen) => `Generation ${gen} · every player cheats`,
  allCooperate: (gen) => `Generation ${gen} · every player cooperates`,
  stray: 'A stray cheater appears.',

  guests: [
    {
      name: 'Robert May',
      note: 'With Martin Nowak in 1992, I let players on a grid copy their most successful neighbours. Cooperators survived, in patterns that kept shifting, with no memory and no cleverness at all.',
    },
    {
      name: 'Martin Nowak',
      note: 'With Robert May, he found the kaleidoscope in this room. He studies how cooperation evolves, from cells to societies.',
    },
    {
      name: 'Albert Tucker',
      note: 'In 1950, explaining a game from the RAND Corporation to psychologists at Stanford, I told it as the story of two prisoners. The name stuck.',
    },
  ],

  insight: {
    title: 'Why don’t the cheaters win?',
    html: `<p>Every cell is a player in the <em>prisoner’s dilemma</em>. Two cooperators both do well. A cheater who meets a cooperator does better still, and the cooperator gets nothing. Two cheaters get nothing. Whatever the other player does, cheating pays more, so in a crowd where everyone meets everyone, cheaters should take over.</p>
<div class="insight-visual">cooperator + cooperator: 1 each · cheater + cooperator: the temptation for the cheater, 0 for the cooperator · cheater + cheater: 0 each</div>
<h3>Neighbours, not strangers</h3>
<p>Here each player meets only its eight neighbours, and then copies whoever did best nearby, itself included. Nobody remembers, plans or punishes. A cooperator inside a cluster of cooperators earns a lot, so clusters shelter each other. A cheater at the edge of a cluster earns more than anyone and bites into it, but a cheater surrounded by cheaters earns nothing. Neither side can win everywhere.</p>
<h3>The kaleidoscope</h3>
<p>Martin Nowak and Robert May found this in 1992. With a temptation between 1.8 and 2, one cheater in the middle of 99 × 99 cooperators grows into a pattern that keeps the square’s full symmetry at every step and keeps changing. Every temptation in that window gives exactly the same pictures. From most random starts, the share of cooperators wobbles around a third: Nowak and May estimated 12 ln 2 − 8, about 31.8%. Below 1.8 the cheaters stay in small blocks and thin lines. Above 2 they spread, and from a random start they take almost everything.</p>
<h3>Not quite forever</h3>
<p>A grid of 9,801 players has only finitely many patterns and the rule never changes, so sooner or later a pattern must come back, and from then on everything repeats. In 2022 Te Wu, Feng Fu and Long Wang followed the single cheater until that happened: after about a billion generations it falls into a loop of four steps, with only 96 cooperators, turning in 16 little clusters. At five generations a second, that is about six and a half years away.</p>
<h3>What this model leaves out</h3>
<p>The kaleidoscope needs everyone to switch at the same moment. In 1993 Bernardo Huberman and Natalie Glance pointed out that real players share no clock: when they switch one at a time in random order, at these temptations the cheaters take over within a couple of hundred generations. Untick “Everyone switches at once” to see it. Nowak, Sebastian Bonhoeffer and May replied in 1994 that cooperators and cheaters still live side by side over a wide range of temptations; here, try one at a time at 1.6. These players also play each game only once and remember nothing, whereas people and animals remember, forgive and choose whom to meet. So the room shows one way cooperation can last, by sticking together. It doesn’t show that people are nice, or that cheats never prosper.</p>
<p>Another way is to meet again and again. In Robert Axelrod’s tournaments of the repeated game around 1980, the simplest entry, Anatol Rapoport’s Tit for Tat (cooperate first, then copy the other player’s last move), won both rounds. That doesn’t make it the best strategy: with mistakes and different opponents the ranking changes. Nicky Case’s <em>The Evolution of Trust</em> tells that story beautifully.</p>
<details><summary>The mathematics, if you want it</summary><p>Each player plays once with each neighbour and once with itself (Nowak and May’s convention). So a cooperator scores the number of cooperators in its 3 × 3 block, itself included (0 to 9), and a cheater scores the temptation b times the number of cooperators around it (0 to 8). Only comparisons such as 8b against 9 matter, so the behaviour changes only where b crosses a fraction such as 9/8, 9/5 or 2. A lone cheater scores 8b, its neighbours 8, and the cooperators just beyond them 9, so it takes over its eight neighbours when b is above 9/8. Edges are fixed: a player on the edge simply has fewer neighbours. When the best cooperator and the best cheater nearby score exactly the same, a player here keeps its strategy (this happens only at a few exact temptations, such as 1.5 or 2).</p><p>With “Everyone switches at once” off, each generation picks 9,801 players at random, one after another (some twice, some not at all); each copies the best scorer around it as things are at that moment. The patterns here were checked against an independent program, cell for cell, for the first 300 generations.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1038/359826a0" target="_blank" rel="noopener">Nowak and May (1992), Evolutionary games and spatial chaos</a><a class="source-link" href="https://math.libretexts.org/Bookshelves/Applied_Mathematics/Agent-Based_Evolutionary_Game_Dynamics_(Izquierdo_Izquierdo_and_Sandholm)/03:_Spatial_interactions_on_a_grid/3.01:_Spatial_chaos_in_the_Prisoner's_Dilemma" target="_blank" rel="noopener">Izquierdo, Izquierdo and Sandholm, Spatial chaos in the Prisoner’s Dilemma</a><a class="source-link" href="https://arxiv.org/abs/chao-dyn/9307017" target="_blank" rel="noopener">Huberman and Glance (1993), Evolutionary games and computer simulations</a><a class="source-link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC43892/" target="_blank" rel="noopener">Nowak, Bonhoeffer and May (1994), Spatial games and the maintenance of cooperation</a><a class="source-link" href="https://arxiv.org/abs/2209.08267" target="_blank" rel="noopener">Wu, Fu and Wang (2022), Evolutionary games and spatial periodicity</a><a class="source-link" href="https://en.wikipedia.org/wiki/The_Evolution_of_Cooperation" target="_blank" rel="noopener">The Evolution of Cooperation (Axelrod)</a><a class="source-link" href="https://ncase.me/trust/" target="_blank" rel="noopener">Nicky Case, The Evolution of Trust</a></div>`,
  },
});
