/* The staircase of sound · visitor-facing words (English). */
Wonderlattice.defineText('stairs', 'en', {
  eyebrow: 'SOUND · ILLUSION',
  name: 'The staircase of sound',
  tagline: 'A scale that climbs step after step, and never gets any higher.',
  title: 'The staircase of sound.',
  subtitle:
    'A scale climbs step after step, yet twelve steps later it is back where it began. Turn the sound on to hear it; the picture shows the trick.',
  field: 'Sound · Octaves · Perception',
  sceneLabel: 'Eight tones, an octave apart',
  sceneNames: ['A scale that climbs forever', 'A slide that rises forever', 'The trick, taken away'],
  tip: 'Best heard quietly, or with headphones · Each glowing dot is a tone, and they all sound at once',
  canvasLabel:
    'A spiral of pitch, one turn for each octave, with a glowing dot on every turn: the tones that sound together, brightest in the middle. Seen from above, the spiral is a circle of twelve notes. Beside it, the same tones as bars under a fixed loudness curve.',
  panelEyebrow: 'Listen & look',
  whyLabel: 'Why does it never get higher?',
  nudge:
    'Turn the sound on, then narrow the loudness curve to one octave: the trick falls apart, and you hear the drop back down.',
  connection: {
    html: '<strong>An octave is a doubling.</strong> Every tone here is twice the frequency of the one below it. In Hear the shape, two tones in simple ratios add up to beats and loops.',
    label: 'Hear two tones together',
  },

  presets: [
    { name: 'The endless staircase', note: 'Twelve steps up, back at the start.' },
    { name: 'The endless slide', note: 'Risset’s gliding version.' },
    { name: 'Take the trick away', note: 'One tone at a time: hear it drop.' },
  ],

  soundOff: 'Turn sound on',
  soundOn: 'Sound on · mute',
  noSound: 'Sound is unavailable in this browser. You can still watch how the trick works.',

  how: 'How it climbs',
  modes: ['Steps', 'Glide'],
  bell: 'Width of the loudness curve, in octaves',
  bellHint: 'At one octave, only one tone sounds at a time.',
  speed: 'Steps per second',
  volume: 'Volume',

  // Note names round the circle, from C. Write them the way your language names notes.
  notes: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],

  pair: {
    title: 'Up or down?',
    text: 'Two notes, exactly half an octave apart. Does the second go up or down? There is no right answer.',
    play: 'Play two notes',
    again: 'Play another pair',
    up: 'Up',
    down: 'Down',
    answer: (up, a, b) =>
      up
        ? `You heard ${a} to ${b} go up. Other listeners hear the very same pair go down: on the circle the two notes are opposite, so up and down are equally far.`
        : `You heard ${a} to ${b} go down. Other listeners hear the very same pair go up: on the circle the two notes are opposite, so up and down are equally far.`,
  },

  status: {
    steps: (n, same) =>
      n < 12
        ? `${n} ${n === 1 ? 'step' : 'steps'} up`
        : `${n} steps up · the same sound as ${same === 0 ? 'the start' : `step ${same}`}`,
    glide: (laps) =>
      laps === 0 ? 'Rising smoothly' : `Rising smoothly · back where it began ${laps === 1 ? 'once' : `${laps} times`}`,
    pair: (a, b) => `${a}, then ${b}: up or down?`,
  },

  labels: {
    higher: 'higher',
    turn: 'one turn = one octave',
    above: 'Seen from above',
    tones: 'The tones you hear',
    curve: 'loudness',
    pitch: 'pitch',
    drop: 'an octave down',
    up: 'up?',
    down: 'down?',
  },

  guests: [
    {
      name: 'Roger Shepard',
      note: 'At Bell Labs in the 1960s I made a scale that climbs forever. Twelve steps up, and you are back at the start.',
    },
    {
      name: 'Jean-Claude Risset',
      note: 'I made the steps melt into one slide: a sound that rises without end, and never arrives.',
    },
    {
      name: 'Diana Deutsch',
      note: 'The psychologist found that two notes half an octave apart rise for some listeners and fall for others.',
    },
  ],

  insight: {
    title: 'Why does it never get higher?',
    html: `<p>Each note here is not one tone but eight, an octave apart: a low C, the C above it, and so on up to a high C, all sounding at once. A fixed curve sets how loud each one is. The middle ones are loud; the lowest and the highest fade to nothing.</p>
<p>Each step raises all eight by a semitone. After twelve steps every tone has doubled its frequency, so each one sits exactly where the one above it began. The top tone has faded out at the high end, a new one has faded in at the low end, and the sound is exactly the one you started with. Your ear follows the step-by-step rise and misses the swap.</p>
<div class="insight-visual">Step 0: C1 C2 C3 C4 C5 C6 C7 C8 · Step 12: C2 C3 C4 C5 C6 C7 C8 C9 · C1 and C9 are both silent, so the two sound the same</div>
<h3>Two sides of pitch</h3>
<p>A note has a height (how high it is) and a chroma (which of the twelve notes it is: C, D, E…). Picture them as a spiral: going up is height, going round is chroma, and each turn is an octave. Seen from above, the spiral is a circle. This sound keeps the going round and hides the going up.</p>
<h3>Take the trick away</h3>
<p>Narrow the loudness curve to one octave and only one tone sounds at a time. It climbs for twelve steps, fades out, and a tone an octave lower takes over: the drop that the wide curve hides.</p>
<h3>Up or down?</h3>
<p>Two notes half an octave apart sit opposite each other on the circle, so neither way round is shorter. In 1986 Diana Deutsch found that listeners disagree about such pairs, and that each listener hears some pairs rising and others falling. How people hear them has been linked to the speech they grew up with: in her studies, listeners from the south of England and from California tended to hear them in opposite ways. Nobody is wrong.</p>
<h3>Where you may have met it</h3>
<p>Jean-Claude Risset made a version that glides instead of stepping. Shepard tones build tension in the music of Christopher Nolan’s film <em>Dunkirk</em> (2017), and a version plays on the endless staircase of the video game <em>Super Mario 64</em> (1996). The same idea as a picture is the impossible staircase that Lionel and Roger Penrose published in 1958 (Oscar Reutersvärd had drawn one in 1937), and that M. C. Escher used in <em>Ascending and Descending</em> (1960).</p>
<h3>What this room simplifies</h3>
<p>The “forever” lives in the ear, not in the sound, which repeats exactly every twelve steps. Not everyone hears the illusion as strongly, and small speakers can’t play the lowest tones, though the curve keeps those quiet anyway. Shepard used a curve of this kind, a raised cosine, and noted that almost any smooth curve that fades out at both ends would do.</p>
<details><summary>The mathematics, if you want it</summary><p>At step n, tone j (j = 0 … 7) has frequency 32.7 Hz × 2<sup>x</sup> with x = (j + n/12) mod 8, and loudness L(x) = ½(1 − cos(2πx/8)): 0 at x = 0 and x = 8, and 1 at x = 4 (C5, about 523 Hz). Twelve steps add 1 to every x, mod 8, which gives the same set of tones. The loudnesses always add up to 4, so the sound’s strength never changes. R. N. Shepard, “Circularity in judgments of relative pitch”, Journal of the Acoustical Society of America 36 (1964) 2346–2353. D. Deutsch, “A musical paradox”, Music Perception 3 (1986) 275–280.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Shepard_tone" target="_blank" rel="noopener">Shepard tone</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tritone_paradox" target="_blank" rel="noopener">Tritone paradox</a><a class="source-link" href="https://deutsch.ucsd.edu/psychology/pages.php?i=206" target="_blank" rel="noopener">Diana Deutsch on the tritone paradox</a><a class="source-link" href="https://en.wikipedia.org/wiki/Penrose_stairs" target="_blank" rel="noopener">Penrose stairs</a></div>`,
  },
});
