/* Who asks wins · visitor-facing words (English). */
Wonderlattice.defineText('matching', 'en', {
  eyebrow: 'FAIR PAIRS',
  name: 'Who asks wins',
  tagline:
    'Pair six students with six clubs so that nobody would rather swap. Whoever asks first quietly gets the best deal.',
  title: 'Who asks wins.',
  subtitle:
    'Students apply to clubs until every pair is settled. Then the clubs ask instead: the same wishes, another fair pairing, and the happiness flips.',
  field: 'Game theory · Stable matching · Market design',
  sceneLabel: '6 students · 6 clubs',
  sceneNames: ['Tangled wishes', 'One shared ranking', 'Opposite wishes'],
  shuffledName: 'Shuffled wishes',
  tip: 'Tap a student, then a club, to pair them yourself · Arrow keys aim, Enter picks',
  actionLabel: 'Swap who asks',
  canvasLabel:
    'Six students on the left, as numbered coloured circles, and six clubs on the right, as shapes. Beside each is its wish list, best first. Lines join the pairs. Tap a student and then a club to pair them yourself: a red line marks two who would both rather have each other.',
  panelEyebrow: 'Who asks first',
  whyLabel: 'Why does asking first win?',
  nudge:
    'Tap a student, then a club, to pair them by hand. A red line means those two would both rather leave for each other. Can you find a pairing with no red lines that neither asking gives?',
  connection: {
    html: '<strong>Choosing well.</strong> Here a student who is turned down simply tries the next club. In “Stop at 37%”, you must take or leave each card for good.',
    label: 'Visit “Stop at 37%”',
  },

  presets: [
    { name: 'Tangled wishes', note: 'Asking first decides almost everything.' },
    { name: 'One shared ranking', note: 'Every club ranks the students alike.' },
    { name: 'Opposite wishes', note: 'Each student’s favourite likes them least.' },
  ],

  speed: 'Speed',
  swap: 'Keep swapping who asks',
  marks: 'Mark every stable partner',
  shuffle: 'New wishes',
  count: (n) =>
    n === 1
      ? 'These wishes allow only 1 stable pairing, so it makes no difference who asks.'
      : `These wishes allow ${n} stable pairings.`,

  // Drawn on the picture: keep them short.
  labels: {
    students: 'STUDENTS',
    clubs: 'CLUBS',
    studentsAsk: 'Students ask',
    clubsAsk: 'Clubs ask',
    yours: 'Your pairing',
  },
  // The scoreboard under the lists: how far down their lists each side got, on average.
  score: {
    title: 'AVERAGE CHOICE',
    first: '1st',
    last: '6th',
  },

  status: {
    // r: the round, from 1; k: applications on their way that round.
    round: (clubs, r, k) =>
      clubs
        ? `Round ${r} · ${k === 1 ? '1 club asks' : `${k} clubs ask`}`
        : `Round ${r} · ${k === 1 ? '1 student applies' : `${k} students apply`}`,
    // firsts: how many on the asking side got their first choice.
    done: (clubs, firsts) =>
      clubs
        ? `Clubs asked: ${firsts} of 6 clubs got their first choice`
        : `Students asked: ${firsts} of 6 students got their first choice`,
    unstable: (k) =>
      k === 1 ? 'Your pairing: 1 pair would rather swap' : `Your pairing: ${k} pairs would rather swap`,
    stable: 'Your pairing is stable: no pair would rather swap',
    stableNew: 'Stable, and neither asking gives this one',
  },

  guests: [
    {
      name: 'David Gale',
      note: 'In 1962 Lloyd Shapley and I showed that applicants and colleges can always be paired so that no applicant and college would both rather have each other. Our method: apply, hold the best offer, and let nobody say yes until the end.',
    },
    {
      name: 'Lloyd Shapley',
      note: 'Our paper ended by offering its main proof as an example of mathematics in ordinary English, with no symbols and hardly any counting. Half a century later I shared a Nobel memorial prize in economics with Al Roth, who put the idea to work.',
    },
    {
      name: 'Alvin Roth',
      note: 'He noticed that American hospitals had been matching young doctors with essentially this method since the early 1950s, and later helped redesign that match and the school choice of New York City and Boston.',
    },
  ],

  insight: {
    title: 'Why does asking first win?',
    html: `<p>A pairing is <em>stable</em> when no student and club would both rather have each other than the partners they’ve got. Such a pair would simply walk off together, so an unstable pairing doesn’t last. In 1962 David Gale and Lloyd Shapley showed that a stable pairing always exists, however tangled the wishes, and gave a simple way to find one.</p>
<div class="insight-visual">every unpaired student applies to the best club they haven’t tried · each club keeps its best offer so far and sends the rest back · repeat until nobody is sent back</div>
<h3>Why it is stable</h3>
<p>Take a student and a club that aren’t paired at the end. If the student prefers that club, the student applied there before ending up further down the list, and the club turned them away for someone it liked more. A club’s offers only ever get better, so it still prefers its final partner. Nobody can walk off together.</p>
<h3>Why the askers win</h3>
<p>There are usually several stable pairings. Gale and Shapley proved that the one this method finds gives every student, at once, the best partner they have in any stable pairing. The reason: no student is ever turned away by a club that could be their partner in a stable pairing. And that very same pairing gives every club the worst partner it has in any stable pairing. Swap who asks and the clubs get their best, the students their worst. Tick “Mark every stable partner” to see each person land on the first or last of their dots.</p>
<p>When every club ranks the students the same way, for example by one exam, there is only one stable pairing, and it doesn’t matter who asks. Asking first matters when wishes clash.</p>
<h3>Telling the truth</h3>
<p>The askers can’t do better by hiding their true wishes; the side being asked sometimes can, by turning down an offer it actually likes, though that takes knowing everyone else’s wishes, and can backfire.</p>
<h3>Where it is used</h3>
<p>American hospitals were matching young doctors with essentially this method from the early 1950s, years before the paper, as Alvin Roth later noticed. In the late 1990s the doctors’ match was redesigned so that the applicants ask, and similar methods now assign pupils to schools in New York City and Boston. In 2012 Shapley and Roth shared the Nobel memorial prize in economics; Gale had died in 2008. In studies of large real matches, the choice of who asks has changed the result for very few people.</p>
<h3>What this model leaves out</h3>
<p>Real matches give a club several places, allow ties, let some people leave a list incomplete, and include couples who want to stay in the same town. With couples a stable pairing may not exist at all. Without two sides, as when pairing roommates, it may not exist either; Robert Irving found a method in 1985 that finds one whenever it does. And “stable” isn’t “happy”: it only means nobody can walk off with somebody who wants them back.</p>
<details><summary>The mathematics, if you want it</summary><p>Each round here, every unpaired asker applies at once. The order of the applications doesn’t change the result. With n on each side, Gale and Shapley’s method ends after at most n² − 2n + 2 rounds, 26 for six of each, and at most n² − n + 1 applications in all, 31. With three on each side, a computer can try every possible set of wishes: the worst takes exactly 5 rounds and 7 applications. The stable pairings fit together in a lattice, with the students’ best at one end and the clubs’ best at the other (Donald Knuth’s 1976 book <em>Mariages stables</em> explores it). To mark every stable partner, this room tries all 720 ways to pair six students with six clubs.</p></details>
<div class="sources"><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2012/popular-information/" target="_blank" rel="noopener">The Nobel Prize (2012), Stable matching: theory, evidence and practical design</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gale%E2%80%93Shapley_algorithm" target="_blank" rel="noopener">The Gale–Shapley algorithm</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Resident_Matching_Program" target="_blank" rel="noopener">The National Resident Matching Program</a><a class="source-link" href="https://doi.org/10.1257/000282805774670167" target="_blank" rel="noopener">Abdulkadiroğlu, Pathak and Roth (2005), The New York City high school match</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stable_roommates_problem" target="_blank" rel="noopener">The stable roommates problem</a><a class="source-link" href="https://doi.org/10.2307/2312726" target="_blank" rel="noopener">Gale and Shapley (1962), College admissions and the stability of marriage</a></div>`,
  },
});
