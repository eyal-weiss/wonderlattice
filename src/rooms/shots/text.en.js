/* Two players, three leaderboards · visitor-facing words (English). */
Wonderlattice.defineText('shotMix', 'en', {
  eyebrow: 'STATISTICS',
  name: 'Two players, three leaderboards',
  tagline: 'A shooter can win close range and win far range, yet lose overall.',
  title: 'Two players, three leaderboards.',
  subtitle: 'Drag how many easy and hard shots each player takes. Watch the overall leaderboard flip.',
  field: 'Statistics · Weighted averages · A little surprise',
  sceneLabel: 'One court · Two players · Three leaderboards',
  sceneName: 'The shot mix',
  tip: 'Drag the sliders to change how many close and far shots each player takes',
  actionLabel: 'Split into close and far',
  canvasLabel: 'Two players shooting from close range and far range, with close, far, and overall leaderboards.',
  panelEyebrow: 'Change the shot mix',
  whyLabel: 'How could that happen?',
  nudge:
    'Give player A mostly far shots and player B mostly close shots. Watch the overall leaderboard flip, even though neither player’s skill changed.',
  connection: {
    html: '<strong>A combined number can hide what’s inside it.</strong> Here, an overall percentage is a weighted average, and the weights are the mix of shots.',
    label: 'Follow another surprise',
  },

  presets: [
    { name: 'Even mix', note: 'The better player wins overall too.',badge: 'Even' },
    { name: 'Skewed mix', note: 'Try the surprise.', badge: 'Skewed'  },
    { name: 'Extreme mix', note: 'How far can the gap stretch?', badge: 'Extreme'  },
  ],

  players: { a: 'Player A', b: 'Player B' },
  closeLabel: 'Close range',
  farLabel: 'Far range',
  overallLabel: 'Overall',
  attemptsHint: 'How many shots of this type?',
  makesOf: (makes, attempts) => `${makes} of ${attempts}`,
  percent: (pct) => `${Math.round(pct * 100)}%`,

  verdict: {
    tied: 'Both players are level overall.',
    aWins: 'Player A leads overall.',
    bWins: 'Player B leads overall.',
    reversal: (winner) => `${winner} wins both close and far range, yet trails overall.`,
  },

  labels: {
    court: 'Close range · Far range',
    leaderboard: 'Leaderboard',
    caption: 'Each player’s overall percentage is their combined makes over their combined attempts.',
  },

  guests: [
    { name: 'Edward H. Simpson', note: 'A trend in every group can reverse once the groups are combined.' },
    { name: 'George Udny Yule', note: 'The same reversal turns up wherever a combined rate hides an unequal mix.' },
  ],

  insight: {
    title: 'Why can the better player lose overall?',
    html: `<p>An overall shooting percentage is not the average of two percentages. It is total makes divided by total attempts, so it is a <em>weighted</em> average, weighted by how many shots came from each range. When the two players take very different mixes of close and far shots, that weighting can favour the player who is behind in both individual categories.</p>
<div class="insight-visual">Same skill at each distance, different mix of shots, different overall leader.</div>
<h3>Try an even mix</h3>
<p>Give both players the same split of close and far attempts. The better player in both categories now also wins overall. The reversal only appears once the mix differs.</p>
<h3>A real case: Berkeley, 1973</h3>
<p>The University of California, Berkeley saw an overall graduate admission rate that appeared to favour men. Looking department by department, most departments showed no bias against women, or a small bias favouring them. Women had applied in greater numbers to more competitive departments with lower admission rates for everyone, which pulled down their combined rate. Which number to trust depends on knowing why the mix differed, not only on the arithmetic.</p>
<h3>What this model assumes</h3>
<p>Each player has a fixed make rate at each distance, applied to however many shots you give them. This is a simplified, illustrative model of the arithmetic behind the paradox, not a simulation of real shooting or real admissions decisions.</p>
<details><summary>The mathematics, if you want it</summary><p>For a player with <code>c</code> close makes out of <code>C</code> close attempts and <code>f</code> far makes out of <code>F</code> far attempts, the overall rate is (c + f) / (C + F), not the average of c/C and f/F. Two players can each have a higher c/C and a higher f/F than the other, while the other has a higher (c + f) / (C + F), whenever the attempt counts C and F differ enough between them.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Simpson%27s_paradox" target="_blank" rel="noopener">Simpson's paradox (Wikipedia)</a> · <a class="source-link" href="https://www.science.org/doi/10.1126/science.187.4175.398" target="_blank" rel="noopener">Bickel, Hammel & O'Connell, "Sex bias in graduate admissions: data from Berkeley," Science 187 (1975)</a></div>`,
  },
});
