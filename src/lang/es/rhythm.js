/* Rhythms from Euclid · visitor-facing words (es). */
Wonderlattice.defineText('rhythm', 'es', {
  eyebrow: 'EUCLIDEAN RHYTHMS',
  name: 'Rhythms from Euclid',
  tagline: 'Spread a few beats round a circle as evenly as you can, and out come rhythms played around the world.',
  title: 'Rhythms from Euclid.',
  subtitle:
    'Three beats spread as evenly as possible over eight steps: the Cuban tresillo. Change the numbers, or turn the sound on.',
  field: 'Number · Euclid’s algorithm · Rhythm',
  sceneLabel: 'Beats round a circle',
  tip: 'The hand goes round once a bar, lighting each beat it passes · Tap a named rhythm to play it · Keys: ← → the next one',
  actionLabel: 'Turn sound on',
  canvasLabel:
    'A clock face of steps with a hand going round. The beats, spread as evenly as possible, are the corners of a polygon and light up as the hand passes. Beside it, the same beats as a row of boxes, under a straight line drawn in pixels that steps up on every beat.',
  panelEyebrow: 'Beats and steps',
  whyLabel: 'Where do these rhythms come from?',
  nudge: 'Turn the sound on, then try 5 beats in 8 steps, and 7 in 12: many of the most even spreads have names.',
  connection: {
    html: '<strong>Beats inside two notes.</strong> Two tones slightly out of tune swell and fade in a rhythm of their own, called beats.',
    label: 'Hear the shape',
  },

  presets: [
    { name: 'Tresillo', note: '3 beats in 8 steps, from Cuba.' },
    { name: 'Bossa nova', note: '5 in 16, over a steady 4.' },
    { name: 'West African bell', note: '7 in 12, over 4 and 3.' },
  ],

  soundOff: 'Turn sound on',
  soundOn: 'Sound on · mute',
  noSound: 'Sound is unavailable in this browser. You can still watch the beats.',

  rings: 'Rings',
  ringCounts: ['One', 'Two', 'Three'],
  change: 'Change',
  ringNames: ['Outer', 'Middle', 'Inner'],
  steps: 'Steps',
  beats: 'Beats',
  start: 'Start on step',
  startHint: 'The same beats, started from another step of the circle.',
  speed: 'One turn takes',
  seconds: ' s',

  // The scene's name: a rhythm Toussaint lists (its name, where it is played), or an even spread with no name here.
  scene: (name, from) => `${name} · ${from}`,
  unnamed: 'An even spread',
  // Whole numbers of beats (0 to 24) and steps (2 to 24).
  status: (k, n) => `${k === 1 ? '1 beat' : `${k} beats`} in ${n} steps`,

  // Words drawn on the canvas, kept short.
  labels: {
    line: (k, n) => `A line rising ${k} in ${n}, in pixels`,
    steps: 'It steps up on the beats',
    ring: (k, n) => `${k} in ${n}`,
    ringNamed: (k, n, name) => `${k} in ${n} · ${name}`,
    gallery: 'More rhythms with names · tap one',
  },

  announce: (k, n, name) =>
    name ? `${k} beats in ${n} steps: ${name}.` : `${k} beats in ${n} steps, spread as evenly as possible.`,

  // Rhythms in Toussaint’s list (2005), by the names and places he gives.
  rhythms: {
    conga: { name: 'Conga pattern', from: 'Cuba' },
    khafif: { name: 'Khafif-e-ramal', from: 'Persia, 13th century' },
    cumbia: { name: 'Cumbia', from: 'Colombia' },
    romanian: { name: 'Folk dance', from: 'Romania' },
    ruchenitza: { name: 'Ruchenitza', from: 'Bulgaria' },
    tresillo: { name: 'Tresillo', from: 'Cuba' },
    ruchenitzaFour: { name: 'Ruchenitza', from: 'Bulgaria' },
    aksak: { name: 'Aksak', from: 'Turkey' },
    yorkSamai: { name: 'York-Samai', from: 'Arab music' },
    nawakhat: { name: 'Nawakhat', from: 'Arab music' },
    cinquillo: { name: 'Cinquillo', from: 'Cuba' },
    agsagSamai: { name: 'Agsag-Samai', from: 'Arab music' },
    venda: { name: 'Venda clapping song', from: 'South Africa' },
    bossa: { name: 'Bossa nova', from: 'Brazil' },
    bendir: { name: 'Bendir drum', from: 'Tuareg, Libya' },
    bell: { name: 'Bell pattern', from: 'West Africa' },
    samba: { name: 'Samba', from: 'Brazil' },
    central: { name: 'Central African rhythm', from: 'Central African Republic' },
    aka: { name: 'Aka rhythm', from: 'Central Africa' },
    sangha: { name: 'Aka rhythm', from: 'Upper Sangha, Central Africa' },
  },

  // The explanation's worked example, for the outer ring's numbers: Bjorklund's rounds (already drawn as groups of
  // x and ·), then Euclid's divisions a = q × b + r.
  roundsIntro: (k, n) => `Spreading ${k} beats over ${n} steps, round by round:`,
  divisionsIntro: (n, k) => `Euclid’s algorithm on ${n} and ${k}:`,
  division: (a, q, b, r) => `${a} = ${q} × ${b} + ${r}`,
  noRounds: 'With no beats, or no rests, there is nothing to spread.',

  guests: [
    {
      name: 'Euclid',
      note: 'In my Elements I found the largest number that measures two others by taking the smaller from the larger, again and again. The same steps spread these beats.',
    },
    {
      name: 'Godfried Toussaint',
      note: 'I noticed that a recipe for timing pulses in a particle accelerator also makes rhythms played around the world, and in 2005 I called them Euclidean rhythms.',
    },
  ],

  insight: {
    title: 'Where do these rhythms come from?',
    html: `<p>Put a few beats on a circle of steps, as far apart as they can go. When the beats divide the steps exactly, every gap is the same. When they don’t, the gaps come in two sizes, one step apart, mixed as evenly as possible: 3 beats in 8 steps leave gaps of 3, 3 and 2. That pattern is the tresillo, a basic rhythm of Cuban music, also played on bells in West Africa and in the bass lines of 1950s rock and roll.</p>
<h3>Euclid’s subtraction</h3>
<p>To spread them, write the beats in a row, then the rests. Tuck a rest behind each beat, then keep tucking the leftover groups behind the others until at most one group is left over. Eric Bjorklund used this in 2003 to space timing pulses in a particle accelerator, the Spallation Neutron Source. It takes the same steps as Euclid’s algorithm for the greatest common divisor, from his Elements of about 300 BC: divide, then divide by the remainder, again and again.</p>
<div class="insight-visual" id="rhythm-rounds"></div>
<h3>Rhythms with names</h3>
<p>In 2005 Godfried Toussaint called these patterns Euclidean rhythms, and listed traditional rhythms among them, from Cuba, Brazil, West and Central Africa, Turkey, Bulgaria and Arab music. A name here means the same pattern started from any step, as in his list: many rhythms are played from another beat. Bossa nova starts its 5 in 16 on the third beat, and samba its 7 in 16 on the last; “Start on step” turns a ring. The West African bell’s 7 in 12 is also the pattern of the white keys among the twelve keys of an octave on a piano.</p>
<h3>A line in pixels</h3>
<p>Draw a straight line rising 3 in 8 on a screen, one pixel in each column. It climbs into a new row 3 times, and the columns where it climbs are the tresillo again. For any numbers, the line steps up in a most even pattern, read from some column.</p>
<h3>As far apart as possible</h3>
<p>Of all the ways to put the beats on the steps, these keep them furthest apart: add up the straight distances between every pair of beats round the circle, and only a Euclidean rhythm, turned or not, has the largest total. Erik Demaine and colleagues proved this in 2009.</p>
<h3>What the room leaves out</h3>
<p>Nobody claims musicians used Euclid’s algorithm: evenness is simply something these rhythms share. Real playing has accents, swing and the sound of each instrument, which beats and rests leave out. Not every rhythm is Euclidean: the son clave has five beats in sixteen, like bossa nova, but gaps of 3, 3, 4, 2 and 4. The names follow Toussaint’s list, and the same pattern often goes by other names elsewhere.</p>
<details><summary>The mathematics, if you want it</summary><p>A pattern of k beats in n steps is a necklace of k ones and n − k zeros. Bjorklund’s algorithm keeps two piles of groups, [1] × k and [0] × (n − k); each round joins one group from the back pile to each group of the front pile, and what is left over becomes the new back pile. The sizes of the piles follow Euclid’s algorithm on n − k and k, and the process ends when at most one group is left over.</p><p>The digital straight line gives the same necklace: step i is a beat when ⌊ik/n⌋ &gt; ⌊(i − 1)k/n⌋, the pattern Bresenham’s line algorithm draws on a screen. In music theory, Clough and Douthett’s maximally even sets are the same idea for scales. Evenness here is the sum of the chord lengths between all pairs of beats on a unit circle.</p><p>The room’s tests check, against a separate program: Toussaint’s table, every E(k, n) up to 32 steps against the line, every pattern of up to 14 steps for the largest spread, and the bossa nova and samba starts.</p></details>
<div class="sources"><a class="source-link" href="https://archive.bridgesmathart.org/2005/bridges2005-47.html" target="_blank" rel="noopener">Toussaint, The Euclidean algorithm generates traditional musical rhythms (Bridges, 2005)</a><a class="source-link" href="https://arxiv.org/abs/0705.4085" target="_blank" rel="noopener">Demaine and others, The distance geometry of music (2009)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euclidean_rhythm" target="_blank" rel="noopener">Euclidean rhythm (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Maximal_evenness" target="_blank" rel="noopener">Maximal evenness (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tresillo_(rhythm)" target="_blank" rel="noopener">Tresillo (Wikipedia)</a></div>`,
  },
});
