/* Words · The dice that beat each other (English). Every visitor-facing string for the dice room. */
Wonderloom.defineText('dice', 'en', {
  eyebrow: 'CHANCE · COUNTING',
  name: 'The dice that beat each other',
  tagline: 'Pick any die. There is always one that beats it.',
  title: 'The dice that beat each other.',
  subtitle: 'Pick any die. I’ll choose after you.',
  field: 'Probability · Counting · A little surprise',
  sceneLabel: 'Odd dice · One circle',
  tip: 'Tap a die in the circle to pick it · Arrows point from winner to loser',
  actionLabel: 'Roll 100 times',
  canvasLabel:
    'Two dice rolled against each other, a tally of wins, the running share of wins, and a circle of arrows showing which die usually beats which. Tap a die in the circle, or use the left and right arrow keys, to pick your die.',
  panelEyebrow: 'Choose, then roll',
  whyLabel: 'How can every die lose?',
  nudge: 'Try each die in turn. Every time, I find one that beats yours. Is there a die I can’t beat?',
  connection: {
    html: '<strong>Intuition, gently overturned.</strong> Here, “better” goes round in a circle. In the city, a brand-new road can make every trip slower.',
    label: 'Try the tempting shortcut',
  },

  // The three dice sets, in the model's order.
  sets: ['Three dice · 5/9', 'Efron’s four dice · 2/3', 'Grime’s dice · a twist'],
  sceneNames: ['Pick first', 'Efron’s four', 'Grime’s dice'],
  twoEach: (name) => `${name} · two each`,
  // Short marks for circles and buttons, and full names for sentences.
  marks: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['R', 'B', 'O'],
  ],
  names: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['Red', 'Blue', 'Olive'],
  ],

  // Controls
  setLabel: 'Dice set',
  youLabel: 'Your die',
  rivalLabel: 'My die',
  letMe: 'Let me choose',
  pairs: 'Roll two of each and add them',
  speed: 'Rolls a second',
  speedHint: 'Slow enough to watch, or fast enough to settle.',
  faces: (list) => list.join(' '),
  pickDie: (name, list) => `Die ${name}: ${list.join(', ')}`,

  // The stage
  you: 'You',
  me: 'Me',
  vs: 'vs',
  iTake: (you, me) => `You picked ${you}. I’ll take ${me}.`,
  against: (you, me) => `${you} against ${me}. You chose both.`,
  ready: 'Ready to roll',
  rolls: (n) => (n === 1 ? '1 roll' : `${n.toLocaleString('en')} rolls`),
  circleTitle: 'The circle of victories',
  even: 'even',
  winsTitle: 'Wins',
  latestTitle: 'Latest rolls, newest first',
  ties: (n) => (n === 1 ? '1 tie' : `${n} ties`),
  shareTitle: (name) => `How often ${name} wins`,
  exactLabel: (fraction) => `exact ${fraction}`,
  startHint: 'Press “Roll 100 times”',

  // Readouts in the panel
  rollsSoFar: 'Rolls so far',
  winsLine: (you, me, a, b) => `You (${you}) ${a} · Me (${me}) ${b}`,
  seenLine: (name, seen, fraction, exact) =>
    `${name} wins: ${seen === null ? '–' : seen + '%'} so far · exactly ${fraction} ≈ ${exact}%`,
  verdictStart: (favourite, fraction) => `Exactly, ${favourite} wins ${fraction} of the time. Roll to see it happen.`,
  verdict: (n, favourite, seen, fraction) =>
    `After ${n.toLocaleString('en')} rolls, ${favourite} has won ${seen}% of the time. The exact chance is ${fraction}.`,
  evenVerdict: 'These two are evenly matched.',
  sameDie: 'The same die on both sides: an even match.',

  presets: [
    { name: 'Pick first', note: 'I choose after you.', badge: '5/9' },
    { name: 'Efron’s four', note: 'Four dice, one circle.', badge: '2/3' },
    { name: 'Two of each', note: 'Double the dice, flip the circle.', badge: '↺' },
  ],

  guests: [
    {
      name: 'Blaise Pascal',
      note: 'A gambler’s dice puzzle reached him. His letters with Fermat in 1654 began the mathematics of chance.',
    },
  ],

  gridAxes: (me, you) => `Rows are my die, ${me}; columns are your die, ${you}. Each square is coloured by its winner.`,
  gridNote: (win, lose, tie, total, me, you) =>
    `${me} wins ${win} of the ${total.toLocaleString('en')} equally likely pairings, ${you} wins ${lose}` +
    (tie ? `, and ${tie} are ties.` : '.'),

  insight: {
    title: 'How can every die lose?',
    html: `<p>Count instead of guessing. Each die has six faces, so two dice can land in 6 × 6 = 36 equally likely ways. Take A (2, 2, 4, 4, 9, 9) against B (1, 1, 6, 6, 8, 8). A’s two 9s beat all six of B’s faces: 12 ways. A’s 2s and 4s beat only B’s two 1s: 4 × 2 = 8 more. That makes 20 of 36 for A, or 5/9. The same count gives B over C, and C over A.</p>
<canvas id="dice-grid" class="dice-grid" aria-hidden="true"></canvas>
<p id="dice-grid-note"></p>
<div class="insight-visual">A beats B, B beats C, and C beats A. “Usually beats” doesn’t line up in a row, so whoever chooses second can always find a die that wins.</div>
<h3>Better on average isn’t the same as usually winning</h3>
<p>All three dice in the first set average exactly 5. In Efron’s set, C (6, 6, 2, 2, 2, 2) has the highest average, 3⅓, yet it loses to B, which always shows 3, two times in three. An average cares how big each win is; “usually wins” only counts how often.</p>
<h3>Two of each turns the circle round</h3>
<p>With James Grime’s red, blue and olive dice, one die each gives red over blue, blue over olive, and olive over red. Roll two of each and add them, and every arrow flips: blue beats red, olive beats blue, and red beats olive. Adding two dice changes which totals are likely, and that changes who usually wins.</p>
<h3>What this assumes</h3>
<p>Fair dice: every face equally likely, and every roll independent of the others. The rolls here come from a pseudo-random number generator. A few dozen rolls can stray far from the exact chance. The typical wobble shrinks slowly, like one over the square root of the number of rolls: about 5% after 100 rolls, about 0.5% after 10,000.</p>
<details><summary>Is there a die nobody beats?</summary><p>Not in these sets. Every die has another that beats it more often than not. That is what “nontransitive” means: “beats” doesn’t pass along a chain the way “taller than” does. In Efron’s set, the room’s best reply wins two times in three, whatever you pick.</p></details>
<div class="sources"><a class="source-link" href="https://nrich.maths.org/problems/non-transitive-dice?tab=teacher" target="_blank" rel="noopener">NRICH: non-transitive dice</a><a class="source-link" href="https://www.scientificamerican.com/article/mathematical-games-1970-12/" target="_blank" rel="noopener">Martin Gardner on Efron’s dice (1970)</a><a class="source-link" href="http://singingbanana.com/dice/article.htm" target="_blank" rel="noopener">James Grime’s dice (an earlier numbering, with the same odds)</a></div>`,
  },
});
