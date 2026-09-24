/* Words · A spoonful of a city (English). Every visitor-facing string for the sampling room. */
Wonderloom.defineText('sample', 'en', {
  eyebrow: 'CHANCE · SAMPLING',
  name: 'A spoonful of a city',
  tagline: 'A huge poll can be sure and wrong. A small random one is roughly right.',
  title: 'A spoonful of a city.',
  subtitle: 'Orange or blue: what does the whole city prefer? You can only ask some of them.',
  field: 'Statistics · Sampling · Random error and bias',
  sceneLabel: 'Polling a toy city',
  tip: 'Tap a neighbourhood to ask only there · Each dot is one survey',
  actionLabel: 'Ask 50 times',
  canvasLabel:
    'A map of a small city whose residents each prefer orange or blue, with the people asked in the latest survey lit up, beside a dot plot with one dot for each survey’s estimate. Tap a neighbourhood, or use the left and right arrow keys, to ask only there. The up and down arrow keys change how many people each survey asks.',
  panelEyebrow: 'Choose how to ask',
  whyLabel: 'Why doesn’t asking more help?',
  nudge:
    'Ask 50 times at random. Then ask the neighbours instead. Two tight clouds of dots: which one is right? Show the whole city to find out.',
  connection: {
    html: '<strong>Chance, from both ends.</strong> Here you guess a whole city from a spoonful of it. With the odd dice, counting tells you exactly what many rolls will do.',
    label: 'Roll the odd dice',
  },

  // Ways of asking, in the model's order (random, one neighbourhood, whoever answers): short for the select.
  methodLabel: 'How to ask',
  methods: ['At random', 'Neighbours', 'Volunteers'],
  sceneNames: ['Ask at random', (hood) => `Only in ${hood}`, 'Whoever answers'],
  hoodLabel: 'Neighbourhood',
  hoods: [
    'Harbour',
    'Old Town',
    'Hilltop',
    'Mill Row',
    'Riverside',
    'Market',
    'Orchard',
    'Station',
    'Gardens',
    'Kilnside',
    'Lantern Hill',
    'Ropewalk',
  ],
  sizeLabel: 'People in each survey',
  reveal: 'Show what the whole city prefers',
  askOnce: 'Ask once',
  newCity: 'A new city',

  // The stage
  cityTitle: (n) => `The city · ${n.toLocaleString('en')} residents`,
  plotTitle: (n) => `Share who prefer orange · one dot per survey of ${n.toLocaleString('en')}`,
  plotTitleShort: 'Orange share · one dot per survey',
  blueWins: 'blue wins',
  orangeWins: 'orange wins',
  wholeCity: (pct) => (pct === null ? 'whole city: ?' : `whole city ${pct}%`),
  before: (name, n) => `○ Before: ${name}, ${n.toLocaleString('en')} each`,
  startHint: 'Press “Ask 50 times”',
  ready: 'Ready to ask',
  surveys: (n) => (n === 1 ? '1 survey' : `${n.toLocaleString('en')} surveys`),

  // Readouts in the panel
  noSurveys: 'No surveys yet.',
  noEstimate: 'Each survey will add one dot.',
  surveyLine: (count, n) =>
    `<strong>${count.toLocaleString('en')}</strong> ${count === 1 ? 'survey' : 'surveys'} of ${n.toLocaleString('en')} ${n === 1 ? 'person' : 'people'}`,
  estimateLine: (mean, spread) =>
    spread === null
      ? `This one says ${mean}% prefer orange.`
      : `They say ${mean}% prefer orange, give or take ${spread} points.`,
  theoryLine: (n, se) => `A random sample of ${n.toLocaleString('en')} wobbles by about ±${se} points.`,
  truthHidden: 'The whole city’s answer is hidden.',
  truthLine: (pct, miss) =>
    miss === null ? `The whole city: ${pct}% orange.` : `The whole city: ${pct}% orange. Typical miss: ${miss} points.`,
  randomNote: 'Anyone in the city might be asked.',
  hoodNote: (size, name) => `${size.toLocaleString('en')} people live in ${name}.`,
  hoodAll: (size, name) =>
    `Only ${size.toLocaleString('en')} people live in ${name}, so each survey asks everyone there.`,
  volunteerNote: (answer, total) =>
    `Only those who reply count: ${answer.toLocaleString('en')} of ${total.toLocaleString('en')}. Orange fans are keener to reply.`,
  volunteerAll: (answer) =>
    `Only ${answer.toLocaleString('en')} people ever reply, so each survey hears from all of them.`,

  presets: [
    { name: 'A quick random poll', note: '50 people, anyone in the city.' },
    { name: 'Ask the neighbours', note: '50 people, all from one neighbourhood.' },
    { name: 'A huge biased poll', note: '1,000 replies from whoever answers.' },
  ],

  guests: [
    {
      name: 'Jerzy Neyman',
      note: 'In 1934 he warned that hand-picking “typical” districts is a gamble. Choose at random, he argued, and you can say how far off you might be.',
    },
  ],

  // The live paragraph in the explanation, for the visitor's own city.
  live: (n, se, hood, hoodOff, answerOff) =>
    `In your city, a random sample of ${n.toLocaleString('en')} wobbles by about ±${se} points. ` +
    `Asking only in ${hood} is off by ${hoodOff} points, and counting whoever answers is off by ${answerOff}, however many people you ask.`,

  insight: {
    title: 'Why doesn’t asking more help?',
    html: `<p>Every survey here picks people by chance. But chance can only pick from the people a method can reach: the whole city, one neighbourhood, or the residents who bother to reply. Statisticians call that list the <em>sampling frame</em>. A random pick from the frame tells you about the frame, not about the city.</p>
<h3>Wobble and bias</h3>
<p><strong>Random error</strong> is the wobble from one survey to the next. It shrinks as the sample grows, like one over the square root of its size: ask four times as many people and the wobble halves. <strong>Bias</strong> is the gap between the frame’s answer and the city’s. Every survey from the same frame shares it, so asking more people doesn’t shrink it. It only makes you surer of the wrong answer.</p>
<div class="insight-visual">typical error² = wobble² + bias²</div>
<p id="sample-live"></p>
<h3>Millions of answers, the wrong winner</h3>
<p>In 1936 the American magazine <em>The Literary Digest</em> mailed more than ten million ballots, mostly to names from telephone books and car registrations. Over 2.3 million came back, fewer than one in four. Its final count gave Alf Landon 55% and Franklin Roosevelt 41%. On election day Roosevelt won with 61%. Much smaller polls by George Gallup and others, who chose their samples more carefully, called Roosevelt the winner.</p>
<p>Half a century later, the political scientist Peverill Squire used a 1937 Gallup survey that asked people whether they had received a Digest ballot and sent it back. He found that both the list and the replies leaned towards Landon, and that together they caused the miss. Had everyone on the list replied, the poll would at least have named the right winner.</p>
<h3>The wobble, exactly</h3>
<p>For a random sample of <em>n</em> people from a city of <em>N</em>, where a share <em>p</em> prefer orange, the typical wobble (the standard error) is √(<em>p</em>(1 − <em>p</em>)/<em>n</em>) × √((<em>N</em> − <em>n</em>)/(<em>N</em> − 1)). The second factor, the finite-population correction, is there because nobody is asked twice. It matters here because the city is small, and it reaches zero when you ask everyone. The room uses this corrected formula.</p>
<details><summary>What this toy city leaves out</summary><p>Two colours, neighbourhoods drawn at random, residents who never change their minds, and a reply rate that depends only on colour. Real polls choose people more cleverly (Jerzy Neyman argued in 1934 for random sampling within groups, called strata), then weight the answers to match what is known about the population and adjust for who didn’t reply. Gallup’s own 1930s polls filled quotas of different kinds of people, a method with flaws of its own. The margin of error printed beside a poll describes the random wobble only; it can’t see bias.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1086/269085" target="_blank" rel="noopener">Squire: why the 1936 Literary Digest poll failed (1988)</a><a class="source-link" href="https://doi.org/10.1111/j.2397-2335.1934.tb04184.x" target="_blank" rel="noopener">Neyman on random versus purposive sampling (1934)</a><a class="source-link" href="https://online.stat.psu.edu/stat506/Lesson02" target="_blank" rel="noopener">The standard error of a sample share (Penn State STAT 506)</a></div>`,
  },
});
