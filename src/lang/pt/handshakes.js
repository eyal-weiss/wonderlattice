/* Six handshakes · visitor-facing words (pt). */
Wonderlattice.defineText('handshakes', 'pt', {
  eyebrow: 'SMALL WORLDS',
  name: 'Six handshakes',
  tagline: 'Two hundred friends in a ring are 25 handshakes apart. Five random friendships nearly halve that.',
  title: 'Six handshakes.',
  subtitle:
    'Two hundred people in a ring, each friends with their four nearest neighbours. Watch a few random friendships shrink the whole world, then add more.',
  field: 'Networks · Graph theory · Social science',
  sceneLabel: 'One ring · a few strangers',
  sceneName: 'A ring of 200 friends',
  tip: 'Tap anyone to count the handshakes from you · Keys: ← → choose someone, + adds a shortcut',
  actionLabel: 'Add a shortcut',
  canvasLabel:
    'Two hundred people on a circle, each linked to their nearest neighbours, with a few long links across it. The average number of handshakes between two people is in the middle.',
  panelEyebrow: 'Friends of friends',
  whyLabel: 'Why do a few shortcuts shrink the world?',
  nudge: 'Start again for a plain ring, then add shortcuts one at a time. Which one makes the biggest difference?',
  connection: {
    html: '<strong>Small worlds keep time.</strong> Watts and Strogatz noticed that clocks linked like a small world fall into step more easily. Watch a meadow of them in Fireflies that fall into step.',
    label: 'Watch the fireflies',
  },

  presets: [
    { name: 'Only neighbours', note: 'A plain ring.', badge: '0' },
    { name: 'Five strangers meet', note: 'Five random friendships.', badge: '5' },
    { name: 'A rumour', note: 'News spreads from you.', badge: '20' },
  ],

  shortcuts: 'Shortcuts across the circle',
  rumour: 'Spread a rumour from you',

  // The status line above the picture. `steps`, `heard`, `round` and `rounds` are whole numbers.
  status: {
    path: (steps) => `You to them: ${steps} ${steps === 1 ? 'handshake' : 'handshakes'}`,
    spreading: (heard, round) => `Round ${round}: ${heard} of 200 have heard`,
    everyone: (rounds) => `Everyone has heard after ${rounds} rounds`,
  },
  // Said once the number of shortcuts settles. `count` is a whole number, `distance` a formatted number.
  announce: (count, distance) =>
    `${count === 0 ? 'With no shortcuts' : count === 1 ? 'With 1 shortcut' : `With ${count} shortcuts`}, two people are ${distance} handshakes apart on average.`,

  // Words drawn on the canvas.
  labels: {
    apart: 'handshakes apart',
    onAverage: 'on average',
    knit: 'Friends who know each other',
    you: 'You',
    steps: (steps) => `${steps} ${steps === 1 ? 'handshake' : 'handshakes'}`,
    chart: 'As shortcuts arrive',
    far: 'How far apart',
    close: 'How close-knit',
    scale: '100% = the plain ring',
    axis: (count) => `${count} shortcuts`,
  },

  guests: [
    {
      name: 'Frigyes Karinthy',
      note: 'In his 1929 short story “Chains”, a character bets that anyone on Earth can be reached through at most five acquaintances.',
    },
    {
      name: 'Stanley Milgram',
      note: 'In the 1960s he asked people to pass a letter towards a stranger, only through someone they knew well. Most letters never arrived; those that did took about six steps.',
    },
  ],

  insight: {
    title: 'Why do a few shortcuts shrink the world?',
    html: `<p>On the ring, news can only crawl from neighbour to neighbour: reaching the far side takes 50 handshakes, and two people are about 25 apart on average. A shortcut is a bridge across the circle. Everyone near one end of it is suddenly close to everyone near the other end, so one new friendship shortens thousands of chains at once.</p>
<div class="insight-visual">a few long links → almost every chain gets shorter → a small world</div>
<h3>Close-knit, and close</h3>
<p>Meanwhile almost nothing changes near you. On the ring, half of the pairs of your friends know each other, and a handful of shortcuts barely touch that. A world can be cosy and local and still be small. Duncan Watts and Steven Strogatz called this a small world in 1998, and found it in the network of film actors, a power grid and the nerves of a tiny worm.</p>
<h3>Six degrees?</h3>
<p>In Stanley Milgram’s letter experiments in the 1960s, most letters never arrived: in one study, 64 of 296 did. The chains that arrived took about six steps, and “six degrees of separation” became folklore. In 2016 Facebook measured an average of 4.57 steps (3.57 people in between) among its 1.59 billion users: one platform, not the whole world.</p>
<h3>What this model leaves out</h3>
<p>Real friendships aren’t a tidy ring, and people have very different numbers of friends. Here the shortcuts are added on top of the ring (a variant studied by Mark Newman and Duncan Watts); in the original model some existing links are moved instead. And a short chain isn’t always one you can find: Jon Kleinberg showed that people who know only their own friends find short chains only when the long links follow one special pattern.</p>
<details><summary>The numbers, if you want them</summary><p>With 200 people and 4 friends each (400 links), the ring’s average distance is exactly 5050 / 199 ≈ 25.4, and its clustering (the share of pairs of one’s friends who are friends too) is 3(k − 2) / (4(k − 1)) = ½ for k = 4. Averaged over 40 random draws, the average distance is about 13.9 with 5 shortcuts, 10.2 with 10, 7.5 with 20 and 5.0 with 60, while the clustering goes 0.49, 0.48, 0.46 and 0.40. Each draw differs: with 5 shortcuts it ranged from about 12 to 17.</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/30918" target="_blank" rel="noopener">Watts &amp; Strogatz, <em>Nature</em> (1998)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Small-world_experiment" target="_blank" rel="noopener">Small-world experiment</a><a class="source-link" href="https://research.facebook.com/blog/2016/2/three-and-a-half-degrees-of-separation/" target="_blank" rel="noopener">Facebook Research (2016)</a>J. Travers and S. Milgram, <em>Sociometry</em> 32 (1969) · J. Kleinberg, <em>Nature</em> 406 (2000)</div>`,
  },
});
