/* Stop at 37% · visitor-facing words (English). */
Wonderlattice.defineText('stopping', 'en', {
  eyebrow: 'OPTIMAL STOPPING',
  name: 'Stop at 37%',
  tagline: 'Turn 100 cards one at a time and stop at the biggest. A simple rule wins more than a third of the time.',
  title: 'When to stop looking.',
  subtitle:
    'Turn the cards one at a time and stop at the biggest, with no going back. Below, thousands of deals show when to leap.',
  field: 'Probability · Optimal stopping · The secretary problem',
  sceneLabel: '100 cards · One at a time · No going back',
  sceneName: 'Find the biggest card',
  tip: 'Tap the deck, or press →, for the next card · Tap your card, or press Enter, to take it · Below, the bars are 10,000 deals played with the rule, the line the exact chance',
  actionLabel: 'New cards',
  canvasLabel:
    'A game of 100 face-down cards, each hiding a different number. At the top: the card just turned, the best card before it, and the deck. Under them, a strip with a mark for every card turned, gold where a card beat all before it. When a game ends, the strip shows every card’s place, tallest for the biggest, and marks your card, the rule’s and the biggest. Below, a chart: for each number of cards just looked at before leaping, the chance that the rule wins, as bars from 10,000 simulated deals and a line worked out exactly. Finding the very best is likeliest after looking at 37 cards, at 37%; with any of the top 10 good enough, after 14 cards, at 82%.',
  panelEyebrow: 'Look, then leap',
  whyLabel: 'Why 37%?',
  nudge:
    'Play a few deals on your own first. Then pick how many cards the rule just looks at, and find where the curve is highest. Then tick “Happy with any of the top 10”, and watch the peak move.',
  connection: {
    html: '<strong>Deciding before you’ve seen it all.</strong> Here you must choose a card before you’ve seen the rest. In The imperfect treasure detector, you decide what a beep means when most beeps are wrong.',
    label: 'Sweep for treasure',
  },

  presets: [
    { name: 'Leap early', note: 'Look at 10, then leap: 23%.', badge: '10' },
    { name: 'Look at 37, then leap', note: 'The very best, 37% of the time.', badge: '37' },
    { name: 'The top 10 will do', note: 'Look at just 14: 82%.', badge: '14' },
  ],

  rules: {
    title: 'The game',
    text: 'Each of the 100 cards hides a different number, of any size. They’re turned one at a time. Take a card when you think it’s the biggest of all 100. A card you pass is gone for good, and if you reach the last card, it’s yours.',
  },
  next: 'Next card',
  take: 'Take this card',
  again: 'Deal again',

  look: 'Cards the rule just looks at',
  lookHint: 'It takes none of them, then takes the first card that beats them all.',
  top: 'Happy with any of the top 10',

  // A card's place among all 100: 1 is the biggest, then the 2nd, 3rd, 4th, … 11th, 12th, 13th, … 21st biggest.
  place: (rank) =>
    rank === 1
      ? 'the biggest'
      : `the ${rank}${rank % 100 >= 11 && rank % 100 <= 13 ? 'th' : rank % 10 === 1 ? 'st' : rank % 10 === 2 ? 'nd' : rank % 10 === 3 ? 'rd' : 'th'} biggest`,

  readout: {
    best: (look) => `Look at ${look}, then leap: it finds the very best`,
    top: (look) => `Look at ${look}, then leap: it finds a top-10 card`,
    simulated: (deals, chance) => `In ${deals} simulated deals: ${chance}.`,
    peak: (look, chance) => `The best number to look at: ${look}, for ${chance}.`,
    random: (chance) => `Taking a card at random: ${chance}.`,
    moreTitle: 'The very best, with fewer or more cards',
    more: (cards, look, chance) => `${cards} cards: look at ${look}, ${chance}`,
  },

  game: {
    playing: (card, cards, best) => `Card ${card} of ${cards} is up. The best before it: ${best}.`,
    first: (cards) => `Card 1 of ${cards} is up. Nothing before it yet.`,
    took: (card, place) => `You took card ${card}: ${place}.`,
    last: (place) => `You reached the last card, so it was yours: ${place}.`,
    biggest: (card) => `The biggest was card ${card}.`,
    found: 'You found the biggest!',
    rule: (look, card, place) => `Looking at the first ${look}, the rule would have taken card ${card}: ${place}.`,
    ruleNone: (place) => `Looking at none first, the rule would have taken card 1: ${place}.`,
    ruleLast: (look, place) =>
      `Looking at the first ${look}, the rule would have waited in vain, and ended on the last card: ${place}.`,
    topWin: 'That’s in the top 10.',
    topLose: 'That’s not in the top 10.',
  },

  status: {
    card: (card, cards) => `Card ${card} of ${cards}`,
    done: (place) => `You took ${place}`,
  },

  announce: {
    card: (card, value) => `Card ${card}: ${value}.`,
    newBest: (card, value) => `Card ${card}: ${value}, the best so far.`,
    noGoingBack: 'No going back: a card you pass is gone.',
    over: 'This game is over. Deal again for new cards.',
    deal: (value) => `New cards. Card 1: ${value}.`,
  },

  // Words drawn on the picture.
  labels: {
    card: (card) => `card ${card}`,
    bestBefore: 'best before it',
    noneYet: 'none yet',
    newBest: 'new best!',
    left: (cards) => `${cards} left`,
    biggest: 'the biggest',
    yours: 'yours',
    rule: 'the rule',
    looks: (look) => `the rule looks at ${look}`,
    xAxis: 'cards just looked at, before leaping',
    yBest: 'finds the very best',
    yTop: 'finds a top-10 card',
    random: (chance) => `a card at random: ${chance}`,
    deals: (deals) => `${deals} deals`,
    peak: (look, chance) => `look at ${look}: ${chance}`,
    moreTitle: 'The very best, with fewer or more cards: worked out, and the peak barely moves',
    more: (cards) => `${cards} cards`,
    share: (all) => `share looked at, up to ${all}`,
    // Names given to one card at once: "yours · the biggest".
    together: (names) => names.join(' · '),
  },

  guests: [
    {
      name: 'Martin Gardner',
      note: 'His Mathematical Games column in Scientific American brought this puzzle to a wide audience in February 1960, as the game of googol: numbers on slips of paper, turned over one at a time.',
    },
    {
      name: 'Johannes Kepler',
      note: 'After his first wife died in 1611, he considered 11 possible matches over two years before marrying again. The story is often told with this puzzle, but only as an anecdote.',
    },
  ],

  insight: {
    title: 'Why 37%?',
    html: `<p>The biggest card is somewhere in the deck, and you get one go. The rule has two parts. First just look: turn over the first 37 cards and take none of them, only noting the biggest. Then leap: take the first card that beats them all. Look too briefly, and the bar is low, so you leap at a card that isn’t the best. Look too long, and the biggest has probably gone by while you were looking. The balance is at about 37% of the cards, a share of 1/e, where e = 2.718….</p>
<div class="insight-visual">Look at 37 of 100, then take the first card that beats them: the very best 37.1% of the time · a card at random: 1%</div>
<h3>Why 37% twice?</h3>
<p>Just looking at the first r of n cards, the rule finds the very best when the best comes later, and the best card before it was among the first r. Adding that up gives P(r) = (r/n) · (1/r + 1/(r + 1) + … + 1/(n − 1)). For a big deck, with x = r/n the share looked at, this is close to −x ln x, which is largest at x = 1/e, where its value is also 1/e ≈ 36.8%. With 10 cards: look at 3 and win 39.9% of the time. With 100: look at 37, 37.1%. With a million: look at 367,879, 36.8%. The number barely moves.</p>
<h3>Happy with the top 10</h3>
<p>If any of the ten biggest will do, the best single cutoff slides left: look at just 14 cards, then leap, and you get a top-10 card 81.7% of the time, against 66.3% when looking at 37. For this goal a single cutoff isn’t the best rule, though. The best one grows less fussy as the cards run out: it looks at 31 cards, then takes a new best; from card 44 it also takes a card that is second best so far, from card 53 a third best, and so on. It gets a top-10 card 98.1% of the time. The single cutoff here is only an illustration.</p>
<h3>What it leaves out</h3>
<p>The 37% rule rests on strong assumptions: you know how many cards there are, they come in random order, you can’t go back, only the very best counts, and you judge each card only by how it compares with the ones before it. Here you also see the numbers themselves, but they come from no fixed range, so a big-looking number says little on its own. If you knew where the numbers came from (say, spread evenly between 0 and 1), you could do better than 37%. The bars of the curve are simulated: 10,000 deals, each played with every cutoff. The line beside them is worked out exactly, and so are the small curves for 10, 1,000 and a million cards.</p>
<p>The puzzle is often told as advice on finding a partner: meet people for a while, then settle on the next one who beats everyone so far. Real life breaks every assumption. You don’t know how many people you’ll meet, they don’t arrive in random order, you can sometimes go back, people aren’t ranked by one number, and the other person has a say too.</p>
<details><summary>Who solved it?</summary><p>The puzzle first appeared in print, as far as anyone knows, in Martin Gardner’s Mathematical Games column in Scientific American in February 1960, as the “game of googol”, which John Fox and Gerald Marnie had devised in 1958. Merrill Flood had already posed it in a lecture in 1949, as the “fiancée problem”. Several people solved it in the early 1960s, and it has grown into a whole field. For the classic version (only how each card compares with those before it, no going back, only the very best counts) no rule does better than looking, then leaping. Thomas Ferguson’s article “Who solved the secretary problem?” tells the story, back to a related problem of Arthur Cayley’s in 1875. Johannes Kepler is often mentioned too: after his first wife died in 1611, he considered 11 possible matches over two years before marrying Susanna Reuttinger in 1613. That is an anecdote, not a use of the rule. T. S. Ferguson, Statistical Science 4(3), 282–289 (1989).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Secretary_problem" target="_blank" rel="noopener">The secretary problem</a><a class="source-link" href="https://doi.org/10.1214/ss/1177012493" target="_blank" rel="noopener">Ferguson, Who solved the secretary problem? (1989)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Optimal_stopping" target="_blank" rel="noopener">Optimal stopping</a></div>`,
  },
});
