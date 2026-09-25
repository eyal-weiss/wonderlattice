/* Hear the shape · visitor-facing words (English). */
Wonderloom.defineText('waves', 'en', {
  eyebrow: 'WAVES · SOUND',
  name: 'Hear the shape',
  tagline: 'Two tones combine into beats, silence, and a looping portrait.',
  title: 'Hear the shape.',
  subtitle: 'Two tones. A little space between them. Listen to what changes.',
  field: 'Waves · Ratios · Interference',
  sceneLabel: 'A conversation in waves',
  sceneName: 'Two tones, together',
  tip: 'Slow-motion wave model · Sound plays at real pitch',
  actionLabel: 'Turn sound on',
  canvasLabel: 'Two sine waves and their combined signal. Choose Circle portrait for a second representation.',
  panelEyebrow: 'Listen & look',
  whyLabel: 'Why does this happen?',
  nudge: 'Try “Almost in tune”. Hear the volume swell and fade as two close pitches drift in and out of step.',
  connection: {
    html: '<strong>Circles become waves.</strong> The height of a point going around a circle follows a sine wave. Combine circular motions, and you’re back in Paint with motion.',
    label: 'Paint with these ideas',
  },

  presets: [
    { name: 'A perfect fifth', note: 'A simple 3:2 relationship.' },
    { name: 'Almost in tune', note: 'Two nearby tones make a pulse.' },
    { name: 'The sound of silence', note: 'Matching waves, half a turn apart.' },
  ],

  soundOff: 'Turn sound on',
  soundOn: 'Sound on · mute',
  noSound: 'Sound is unavailable in this browser. You can still explore the waves.',

  firstTone: 'First tone',
  secondTone: 'Second tone',
  secondToneHint: 'Relative to the first tone.',
  phase: 'Starting phase',
  volume: 'Volume',
  hz: ' Hz',
  view: 'Another way to see it',
  viewGroup: 'Wave view',
  viewWaves: 'Adding waves',
  viewPortrait: 'Circle portrait',

  beatDetail: (f, g, d) => `Your tones: ${f} Hz and ${g} Hz. Their frequency difference is ${d} Hz.`,
  status: (f, g) => `${f} Hz + ${g} Hz`,
  labels: {
    a: (f) => `A · ${f} Hz`,
    b: (f) => `B · ${f} Hz`,
    sum: 'A + B · COMBINED',
    firstTone: 'FIRST TONE →',
    secondTone: 'SECOND TONE ↑',
  },

  guests: [
    { name: 'Jules Lissajous', note: 'Two simple vibrations can draw a surprisingly elaborate loop.' },
    { name: 'Joseph Fourier', note: 'Many simple waves can hide inside one complicated sound.' },
  ],

  insight: {
    title: 'When waves meet.',
    html: `<p>One tone is a smooth, repeating wave. Two tones add together: at each moment, their displacements reinforce or oppose each other. The bright bottom line is their sum.</p>
<h3>A rhythm inside two tones</h3>
<p>When two frequencies are close, their sum grows and shrinks in strength. Those pulses are called <em>beats</em>. Their rate is the difference between the frequencies.</p>
<div class="insight-visual" id="beat-detail"></div>
<h3>Two sounds can make silence</h3>
<p>Choose “The sound of silence”. Equal waves half a cycle apart cancel in this electronic mix. Real-world cancellation depends on where you listen and how the waves reach you.</p>
<h3>Look sideways</h3>
<p>Try “Circle portrait”. We use the first wave for the horizontal position and the second for the vertical position. The resulting Lissajous figure turns a relationship between rhythms into a shape.</p>
<details><summary>The mathematics, if you want it</summary><p>A(t) = sin(2πft)<br>B(t) = sin(2πfrt + φ)<br>The combined signal is A(t) + B(t).</p><p>The slow-motion model preserves the frequency ratio and starting phase. Audible tones run at the pitches shown. Simple ratios repeat quickly; nearby unequal pitches produce beats.</p></details>
<div class="sources"><a class="source-link" href="https://www.physicsclassroom.com/class/sound/Lesson-3/Interference-and-Beats" target="_blank" rel="noopener">Explore interference and beats</a></div>`,
  },
});
