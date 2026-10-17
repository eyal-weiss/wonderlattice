/* The machine that found flavours · visitor-facing words (English). */
Wonderlattice.defineText('flavours', 'en', {
  eyebrow: 'RECOMMENDATIONS',
  name: 'The machine that found flavours',
  tagline: 'Nobody told it which foods are sweet. It worked that out from who liked what.',
  title: 'The machine that found flavours.',
  subtitle:
    'Forty invented people, sixteen foods, a table full of blanks. Watch a little arithmetic sort the foods, then rate a few yourself.',
  field: 'Data · Recommendations · A trick with information',
  sceneLabel: '40 people · 16 foods',
  sceneName: 'The hidden map',
  tip: 'Tap a food to rate it · Keys: ↑↓ choose a food, → like, ← not for me',
  actionLabel: 'Show the planted traits',
  hideLabel: 'Hide the planted traits',
  canvasLabel:
    'On the left, a table of which invented people like which foods, with many blank cells. On the right, the map the method draws from it, where similar foods gather. Tap a food to say whether you like it, and a star shows where you are on the map, with suggestions for you.',
  panelEyebrow: 'Your tastes',
  whyLabel: 'How did it find the flavours?',
  nudge:
    'Like only chocolate. What does it suggest? Now also say no to something sweet. Then make most of the table blank.',
  connection: {
    html: '<strong>Keep the few numbers that matter.</strong> Here two numbers per food are enough to fill in a table’s blanks. In How much picture can you throw away?, a few numbers per block are enough to rebuild a picture.',
    label: 'Throw away a picture',
  },

  presets: [
    { name: 'Find the hidden map', note: 'Watch the foods sort themselves.', badge: '?' },
    { name: 'A sweet tooth', note: 'Two likes, two dislikes.', badge: '♥' },
    { name: 'Only puddings', note: 'Rate just one kind of food.', badge: '1' },
  ],

  foods: [
    'Chocolate',
    'Ice cream',
    'Doughnuts',
    'Pancakes',
    'Strawberries',
    'Watermelon',
    'Mango',
    'Popcorn',
    'Pizza',
    'Burgers',
    'Chips',
    'Cheese',
    'Salad',
    'Cucumber',
    'Sushi',
    'Broccoli',
  ],

  blanks: 'Blank cells',
  blanksHint: 'The cells nobody filled in. The method sees only the rest, and guesses these.',
  clear: 'Forget my ratings',

  labels: {
    people: '40 invented people →',
    you: 'You',
    liked: 'likes it',
    disliked: 'not for them',
    guessed: 'a guess',
    map: 'The map it found',
    right: (p) => `Blanks guessed right: ${p}%`,
    noBlanks: 'No blanks to guess',
    tapHint: 'Tap foods you like, or don’t',
    you2: 'you',
    sweet: 'sweet',
    savoury: 'savoury',
    rich: 'rich',
    light: 'light',
    planted: (angle, flipped) => `The planted traits, turned ${angle}°${flipped ? ' and mirrored' : ''}`,
  },

  readout: {
    title: 'Suggested for you',
    empty: 'Tap a few foods on the map, or in your column of the table: ♥ like, ✕ not for me.',
    none: 'Nothing else looks like a yes for you.',
    rated: (likes, nots) => `You like ${likes}, and ${nots} ${nots === 1 ? 'is' : 'are'} not for you.`,
    stays: 'Your ratings stay on this page.',
  },

  status: {
    running: (n) => `Round ${n}`,
    right: (p) => `${p}% of blanks right`,
    full: 'No blanks',
  },
  announce: {
    found: (n, p) => `The map is found after ${n} rounds. It guessed ${p}% of the blanks right.`,
    full: (n) => `The map is found after ${n} rounds. There were no blanks to guess.`,
    suggest: (list) => `Suggested for you: ${list}.`,
    nothing: 'Nothing else looks like a yes for you.',
    rate: (food, word) => `${food}: ${word}.`,
    like: 'like',
    not: 'not for me',
    unrated: 'not rated',
    planted: (angle, flipped) =>
      `The planted traits match the map turned by ${angle} degrees${flipped ? ' and mirrored' : ''}.`,
  },

  guests: [
    {
      name: 'Eugenio Beltrami',
      note: 'In 1873 I showed that a square table of numbers can be undone into a turn, a stretch along each direction, and another turn. Today the stretches are called its singular values.',
    },
    {
      name: 'Camille Jordan',
      note: 'I found it too, a year later and on my own. Sixty years on, Eckart and Young showed that keeping only the biggest stretches gives the closest smaller table.',
    },
  ],

  insight: {
    title: 'How did it find the flavours?',
    html: `<p>Every food gets two numbers, and so does every person: a point on the map. The method’s guess for a person and a food multiplies their first numbers, multiplies their second numbers, and adds (a dot product), so a food scores high for someone when it lies far out in that person’s direction. It starts from random points and nudges them, round after round, to make its guesses match the cells it knows. Foods liked by the same people have to end up in the same direction, so similar foods gather. Nobody told it about sweetness: “sweet” is just a direction that explains many likes at once.</p>
<div class="insight-visual">guess = person’s 1st × food’s 1st + person’s 2nd × food’s 2nd → fit the known cells → the blanks are guesses</div>
<h3>We planted the answer</h3>
<p>The forty people are invented, on purpose. Each food got two hidden traits, how sweet and how rich it is, and each person a taste for each, plus a little whim, and the table says whether they liked it. Then some cells were hidden. The method never sees the traits. Because we know what is in the blanks, we can score its guesses: with 60% of the table blank it gets about 82% of them right, where someone who knew the planted traits exactly would get about 90%, because of the whims. With 90% blank it does little better than tossing a coin.</p>
<h3>No labels on the map</h3>
<p>Turn the whole map, or mirror it, and every guess stays the same, so the method can’t know which way is “sweet”. The directions mean something, but people have to name them. That’s why the planted traits appear turned when you show them, and a little off: the method finds whatever explains the table best, not what we had in mind.</p>
<h3>Your star</h3>
<p>Your ratings put you on the map: at the point whose guesses best match them. The suggestions are the foods you haven’t rated with the highest guesses, the ones furthest out in your direction. Rate only one kind of food and the map knows you in only one direction, so it suggests more of the same. Your ratings stay on this page; nothing is sent anywhere.</p>
<h3>What this room keeps simple</h3>
<p>Real tastes need more than two numbers, and real tables are mostly blank: each person has rated a tiny share of the films or songs. The Netflix Prize (2006 to 2009) offered a million dollars for predicting film ratings 10% better than Netflix’s own system, and the leading teams’ blends were made mostly of methods like this one. Today’s recommenders use much more: what you did and when, where you are, large neural networks, and the business’s own goals. This room shows the idea, not how any company recommends things today.</p>
<details><summary>The mathematics, if you want it</summary><p>Write the table as a matrix R, people by foods, with +1 for a like and −1 for a no. The method looks for a person matrix U and a food matrix V, two columns each, that make Σ (r − uᵢ·vⱼ)² over the known cells plus λ(Σ|uᵢ|² + Σ|vⱼ|²) small, here with λ = 1, by gradient descent from a small random start. The penalty keeps it from bending to every whim. Your point is the u that makes the same sum small over your ratings alone. With no blanks and no penalty the best answer is known exactly: the singular value decomposition, cut to its two largest singular values (Eckart and Young, 1936); with blanks there is no such formula, and the method only searches. The singular value decomposition was found by Eugenio Beltrami in 1873 and Camille Jordan in 1874. Y. Koren, R. Bell and C. Volinsky, “Matrix factorization techniques for recommender systems”, IEEE Computer 42(8), August 2009.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Matrix_factorization_(recommender_systems)" target="_blank" rel="noopener">Matrix factorization (recommender systems)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Singular value decomposition</a><a class="source-link" href="https://en.wikipedia.org/wiki/Netflix_Prize" target="_blank" rel="noopener">Netflix Prize</a><a class="source-link" href="https://datajobs.com/data-science-repo/Recommender-Systems-%5BNetflix%5D.pdf" target="_blank" rel="noopener">Koren, Bell and Volinsky 2009 (PDF)</a></div>`,
  },
});
