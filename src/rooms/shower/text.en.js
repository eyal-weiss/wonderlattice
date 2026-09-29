/* The shower that never settles · visitor-facing words (English). */
Wonderlattice.defineText('shower', 'en', {
  eyebrow: 'FEEDBACK',
  name: 'The shower that never settles',
  tagline: 'Too cold, too hot, too cold… and the harder you try, the worse it gets.',
  title: 'The shower that never settles.',
  subtitle:
    'The water takes a moment to come up the pipe. The eager bather swings between freezing and scalding; the patient one settles. Change the pipe, or take the tap yourself.',
  field: 'Feedback · Delay · A sharp line at π/2',
  sceneLabel: 'Just right is 38 °C · The tap goes from 10 °C to 55 °C',
  sceneNames: ['Two bathers, one pipe', 'One bather', 'Your hand on the tap'],
  tip: 'The pipe is coloured by the water inside it · ← → on the picture change the pipe · With Your hand, drag across the picture or press ← → to turn the tap',
  soundOff: 'Turn sound on',
  soundOn: 'Sound on · mute',
  noSound: 'Sound is unavailable in this browser. You can still watch the bathers.',
  canvasLabel:
    'Two cartoon bathers stand under showers. Each turns a tap on the wall, and the water climbs a long pipe to the shower head, coloured from blue for cold to red for hot, so each bather feels a turn of the tap only a moment later. Below, a chart shows the temperature each bather feels over the last 30 seconds, with a band for just right. At first the eager bather swings between freezing and scalding for ever, while the patient bather settles at 38 °C. Beside them, a map shows which mixes of impatience and pipe length settle.',
  panelEyebrow: 'Who is at the tap?',
  whyLabel: 'Why does patience win?',
  nudge:
    'Watch the gold bather: every turn of the tap arrives late, so they keep overdoing it. Shorten the pipe, and the eager one settles first. Then try One bather, and find the impatience where the swinging starts.',
  connection: {
    html: '<strong>Reacting to what you see.</strong> Here, a bather who reacts to old news swings for ever. In Fireflies that fall into step, each firefly nudges its own clock when it sees a flash, and the whole swarm comes into time.',
    label: 'Watch the fireflies',
  },

  presets: [
    { name: 'No wobble at all', note: 'Gentle enough never to overshoot.', badge: '1/e' },
    { name: 'On the knife-edge', note: 'The swing never grows or fades.', badge: 'π/2' },
    { name: 'A short pipe', note: 'Now the eager bather wins.', badge: '½ s' },
  ],

  modeLabel: 'Who is at the tap?',
  // By mode number: the two bathers side by side, one bather, the visitor.
  modes: ['Two bathers', 'One bather', 'Your hand'],
  // Drawn under each shower: the eager and patient bathers, the one bather, and the visitor.
  bathers: ['Eager', 'Patient', 'Bather', 'You'],

  pipe: 'Pipe length',
  pipeHint: 'The seconds the water takes from the tap to the shower head.',
  seconds: ' s',
  impatience: 'Impatience',
  impatienceHint: 'How fast the bather turns the tap for each degree the water feels wrong.',
  hand: 'Your tap',
  handHint: 'Aim for 38 °C. The water you feel left the tap a moment ago.',
  cold: 'cold',
  hot: 'hot',
  handValue: (percent) => `${percent}% of the way to hot`,

  readout: {
    product: 'Impatience × pipe',
    sum: (k, d, kd) => `${k} × ${d}\u00a0s = ${kd}`,
    verdicts: ['Settles without overshooting', 'Wobbles, then settles', 'Never settles'],
    smooth: 'The water creeps up to 38\u00a0°C and stays there.',
    fades: (share, period) => `Each wobble is ${share} the size of the one before, one every ${period}\u00a0s.`,
    edge: (period) => `Right on the line: the swing keeps its size, one every ${period}\u00a0s, four times the pipe.`,
    grows: (ratio, period) =>
      `Each swing is ${ratio} times the last, one every ${period}\u00a0s, until the tap reaches its stops.`,
    limit: (d, limit) => `With a ${d}\u00a0s pipe, any impatience below ${limit} settles: that’s π/2 ÷ ${d}.`,
    hands: (d) => `The water you feel left the tap ${d}\u00a0s ago. Try to hold it at 38\u00a0°C.`,
  },

  status: (text, seconds) => `${text} second${seconds === 1 ? '' : 's'} in`,
  // By mode: the water felt right now, beside the picture.
  now: [
    (eager, patient) => `Right now the eager bather feels ${eager}, the patient bather ${patient}.`,
    (water) => `Right now the bather feels ${water}.`,
    (water) => `Right now you feel ${water}.`,
  ],
  // A no-break space, so a temperature never splits across two lines.
  degrees: (value) => `${value}\u00a0°C`,
  announce: {
    race: (eager, patient) =>
      `After 15 seconds the eager bather feels ${eager} and is still swinging; the patient bather feels ${patient}.`,
    one: (water, verdict) => `After 15 seconds the water is at ${water}. ${verdict}.`,
  },

  // Words drawn on the picture.
  labels: {
    seconds: 'seconds',
    justRight: 'just right',
    tap: 'tap',
    // A bather's name and the temperature they feel; languages may reorder them.
    tag: (name, value) => `${name} ${value}`,
    mapTitle: 'Which bathers settle?',
    mapX: 'pipe, seconds',
    mapY: 'impatience',
    regions: ['no wobble', 'wobbles, then settles', 'never settles'],
    safe: (limit) => `settles below ${limit}`,
    drag: 'Drag across the picture to turn the tap',
    onYou: 'On you',
    inPipe: 'On its way',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'In 1868 his paper “On Governors” used mathematics to ask when a machine that corrects itself will settle, and when its corrections will swing ever wider.',
    },
    {
      name: 'Nicolas Minorsky',
      note: 'He watched helmsmen steer by the error, by how long it had lasted and by how fast it was changing, and in 1922 turned that into a rule for steering ships automatically.',
    },
  ],

  insight: {
    title: 'Why does patience win?',
    html: `<p>The bather reacts to the water they feel, but that water left the tap a moment ago. Turn the tap hotter and nothing changes yet, so they turn it more. By the time the hot water arrives, the tap is far too hot, and the same happens on the way back down. The eager bather is always correcting a mistake that is already on its way to being fixed.</p>
<div class="insight-visual">Impatience × pipe below 1/e ≈ 0.37: no wobble · below π/2 ≈ 1.57: wobbles that fade · above π/2: a swing that never ends</div>
<h3>Only the product matters</h3>
<p>Say the bather turns the tap <em>k</em> degrees a second for every degree the water feels wrong, and the water takes <em>d</em> seconds to arrive. Whether the shower settles depends only on <em>k</em> × <em>d</em>. So a longer pipe needs a gentler hand: the most impatience that still settles is π/2 ÷ <em>d</em>. With a two-second pipe, the patient bather’s 0.3 × 2 = 0.6 settles and the eager bather’s 0.9 × 2 = 1.8 never does. Shorten the pipe to half a second, and the eager bather settles first, in under two seconds.</p>
<h3>Right on the line</h3>
<p>At exactly <em>k</em> × <em>d</em> = π/2 the swing neither grows nor fades, and one whole swing takes four times as long as the water takes to arrive. The same limit turns up wherever someone acts on old news, such as a thermostat whose radiator is slow to warm, or a helmsman steering a big ship. A classic fix is to predict: the Smith predictor (O. J. M. Smith, 1957) uses a model of the delay to work out what is already on its way. You can try it here. With Your hand, watch the colour in the pipe rather than the water on the bather.</p>
<h3>What this leaves out</h3>
<p>Real people don’t react this evenly, and real mixing valves don’t change the temperature evenly as they turn. Here the water travels up the pipe as a plug, without mixing or cooling. Beyond π/2 the equation’s swings grow without limit; the tap’s stops, at 10 °C and 55 °C, turn that growth into a steady swing between them, so the size of the swing you see comes from the stops, not from the equation. Many home heating systems simply switch on and off, which this room doesn’t show.</p>
<details><summary>The mathematics, if you want it</summary><p>Let <em>e</em>(<em>t</em>) be how far the tap is from just right. The water felt at time <em>t</em> left the tap at <em>t</em> − <em>d</em>, so the bather turns the tap at the rate <em>e</em>′(<em>t</em>) = −<em>k</em>·<em>e</em>(<em>t</em> − <em>d</em>): a delay differential equation, which Chris Budd calls the shower equation. Trying <em>e</em> = e<sup><em>λt</em></sup> gives <em>λ</em> = −<em>k</em>·e<sup>−<em>λd</em></sup>, so <em>λd</em> = W(−<em>kd</em>), where W is the Lambert W function. The root that matters most comes from W’s principal branch. It is real for <em>kd</em> ≤ 1/e, so there is no overshoot. Beyond that it is complex, which means wobbles, and its real part turns positive at <em>kd</em> = π/2, where W(−π/2) = <em>i</em>π/2: a swing with a period of 4<em>d</em>. The room steps the equation 60 times a second, with the tap’s stops; the numbers in the panel come from W.</p></details>
<div class="sources"><a class="source-link" href="https://plus.maths.org/content/shower-equation" target="_blank" rel="noopener">C. Budd, “The shower equation”, Plus Magazine</a><a class="source-link" href="https://en.wikipedia.org/wiki/Delay_differential_equation" target="_blank" rel="noopener">Delay differential equation</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lambert_W_function" target="_blank" rel="noopener">Lambert W function</a><a class="source-link" href="https://en.wikipedia.org/wiki/Smith_predictor" target="_blank" rel="noopener">Smith predictor</a><a class="source-link" href="https://en.wikipedia.org/wiki/PID_controller#History" target="_blank" rel="noopener">PID controller: history (Maxwell, Minorsky)</a></div>`,
  },
});
