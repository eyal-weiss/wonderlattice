/* Three wires, no way back · visitor-facing words (English). */
Wonderlattice.defineText('phases', 'en', {
  eyebrow: 'THREE-PHASE POWER',
  name: 'Three wires, no way back',
  tagline: 'Three currents chase each other round a circle, and at every instant they add up to nothing.',
  title: 'Three wires, no way back.',
  subtitle:
    'Three circuits would need six wires. Watch their three return wires merge into one that carries nothing, then load one street and wake it.',
  field: 'Phasors · 120° apart · A turning field',
  sceneLabel: 'Three-phase power, 150 times slower than the mains',
  // By the view: the currents, the power, the field of three coils.
  sceneNames: ['Three currents', 'Flickering lamps', 'A field that turns'],
  tip: 'Drag an arrow’s tip in or out to change its wire’s current • Keys: ← → pick a wire, ↑ ↓ change its current',
  canvasLabel:
    'On the left, three coloured arrows, a third of a turn apart, spin round a circle like clock hands; their heights trace three sine waves to the right, and a white line, their sum, stays flat at zero. Below, a power station sends the three currents down three wires to three streets of houses. At first each street has its own wire back, six wires in all; the three return wires slide together into one shared wire, whose meter reads 0 A, because the currents cancel. Load one street more and the meter wakes up. Other views show each street’s lamps flickering while their total stays steady, and three coils whose field turns a compass needle.',
  panelEyebrow: 'Load the streets',
  whyLabel: 'Why do the three currents cancel?',
  nudge:
    'Switch the kettles on and watch the return wire wake up. Then show the field: three coils that never move turn a compass needle.',
  connection: {
    html: '<strong>Adding waves.</strong> Here, three waves of one pitch, a third of a cycle apart, add up to silence. In Hear the shape, two tones add up: they can cancel, beat or make a chord.',
    label: 'Add two tones',
  },

  presets: [
    { name: 'Balanced', note: 'Equal currents: nothing comes back.', badge: '0 A' },
    { name: 'Kettles on one street', note: 'Twice the current in wire 1.', badge: '100 A' },
    { name: 'A field that turns', note: 'Three still coils turn a compass.', badge: '⟳' },
  ],

  wire: (n) => `Current in wire ${n}`,
  wireHint: 'Each wire feeds its own street. Turn one up, as if its kettles came on.',
  amps: ' A',
  view: 'Show',
  // The views: the currents, the power, the field of three coils.
  views: ['Currents', 'Power', 'Field'],
  swap: 'Swap wires 2 and 3',
  swapHint: 'The field turns the other way: that’s how a three-phase motor is reversed.',
  kettlesOn: 'Switch the kettles on',
  kettlesOff: 'Switch the kettles off',

  // A number (or a word) and one line.
  readout: {
    back: 'In the return wire',
    cancel: 'The three currents cancel at every instant, so three wires do the work of six.',
    differ: 'The currents differ, so they no longer cancel: the difference comes back.',
    total: 'Total power',
    steady: 'Steady',
    swings: (share) => `± ${share}`,
    totalSteady: 'Each street’s lamps flicker twice a cycle, but the three together never do.',
    totalSwings: 'The loads differ, so the total swells and dips too.',
    fieldTitle: 'The field’s strength',
    wobbles: 'Wobbles',
    fieldSteady: 'The field keeps its strength and turns once a cycle, though nothing moves.',
    fieldWobbles: 'The field still turns, but unequal currents make it swell and shrink.',
    nothing: 'No current: the lamps are off.',
  },

  status: (amps) => `Return wire: ${amps}`,
  announce: (amps) => `The return wire carries ${amps}.`,

  // Words drawn on the picture.
  labels: {
    sum: 'sum',
    sumZero: 'sum = 0',
    station: 'power station',
    street: (n) => `street ${n}`,
    back: 'wire back',
    shared: 'shared wire back',
    amps: (n) => `${n} A`,
    // The opening: six wires become three.
    story: [
      'Three circuits: six wires',
      'Share one wire back…',
      '…and it carries nothing',
      'Three wires do the work of six',
    ],
    differ: 'Unequal currents: the difference comes back',
    each: 'each street',
    total: 'total',
    field: 'field',
    swapped: 'wires 2 and 3 swapped',
  },

  guests: [
    {
      name: 'Mikhail Dolivo-Dobrovolsky',
      note: 'He named three-phase current and built three-phase generators and motors from 1888. In 1891 his system carried power 175 km, from a turbine at Lauffen to an exhibition in Frankfurt, and three-quarters of it arrived.',
    },
    {
      name: 'Nikola Tesla',
      note: 'In 1888 he patented motors driven by alternating currents out of step, whose turning field drags the rotor round with no brushes or switches.',
    },
    {
      name: 'Galileo Ferraris',
      note: 'In 1885, independently of Tesla, he built a classroom model in which currents out of step made a magnetic field that turns. He published it in 1888.',
    },
  ],

  insight: {
    title: 'Why do the three currents cancel?',
    html: `<p>Each wire’s current is the shadow of an arrow turning round the circle: its height, traced over time, is a sine wave. The three arrows are a third of a turn apart. Put them head to tail and they close a triangle, so they add up to nothing, and so do their shadows, at every instant:</p>
<div class="insight-visual">sin θ + sin(θ − 120°) + sin(θ + 120°) = 0</div>
<p>So three circuits can share one wire back, and when their loads are equal it carries nothing and can be left out: three wires do the work of six. In the language of complex numbers, the three arrows are the cube roots of 1, which add up to 0. Load one street more and its arrow grows: the triangle no longer closes, and the gap, the arrows’ sum, is the current that comes back.</p>
<h3>Lamps that flicker, a total that doesn’t</h3>
<p>A lamp’s power grows with the square of its current, so it swells and dies twice a cycle: on 50 Hz mains, 100 times a second. Yet sin² θ + sin²(θ − 120°) + sin²(θ + 120°) = 3/2 for every θ, so with equal loads the three phases together deliver a perfectly steady total. That is why large motors and generators use three phases: a steady push, with no shudder.</p>
<h3>A field that turns</h3>
<p>Feed the three currents into three coils placed a third of a turn apart round a circle, and the magnetic field at the centre keeps its strength while its direction turns, once a cycle. Nothing moves, yet a compass needle, or a motor’s rotor, is dragged round. Swap any two wires and it turns the other way, which is how a three-phase motor is reversed. Galileo Ferraris (a model in 1885, published in 1888) and Nikola Tesla (patents in 1888) found the turning field independently. Mikhail Dolivo-Dobrovolsky built three-phase generators, motors and transformers, and in 1891 his line carried three-phase power 175 km from Lauffen to an exhibition in Frankfurt.</p>
<h3>What this leaves out</h3>
<p>Three wires instead of six is exact only when the three loads are equal. Real loads never quite are, so the street outside a house carries a fourth wire, the neutral, to take the difference back, as in this room when you load one street. Long lines feed large, nearly balanced loads, so they carry three wires; the thinner wires often seen at the very top of pylons are earth wires, there for lightning and faults, not to carry current back. Electronics such as phone chargers draw currents with harmonics, and the third harmonic adds up in the neutral instead of cancelling, so a neutral can even carry more than a phase. Compared with a single two-wire circuit at the same voltage between its wires, a three-wire line carries the same power with about three-quarters of the metal. In this room the lamps are plain resistances, the waves are perfect sines, nothing is lost on the way, and everything runs 150 times slower than 50 Hz mains.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Three-phase_electric_power" target="_blank" rel="noopener">Three-phase electric power</a><a class="source-link" href="https://en.wikipedia.org/wiki/Neutral_conductor" target="_blank" rel="noopener">Neutral conductor</a><a class="source-link" href="https://en.wikipedia.org/wiki/Phasor" target="_blank" rel="noopener">Phasor</a><a class="source-link" href="https://en.wikipedia.org/wiki/Rotating_magnetic_field" target="_blank" rel="noopener">Rotating magnetic field</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mikhail_Dolivo-Dobrovolsky" target="_blank" rel="noopener">Mikhail Dolivo-Dobrovolsky</a></div>`,
  },
});
