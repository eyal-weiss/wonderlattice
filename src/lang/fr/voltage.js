/* Light a town 100 km away · visitor-facing words (fr). */
Wonderlattice.defineText('voltage', 'fr', {
  eyebrow: 'POWER LINES',
  name: 'Light a town 100 km away',
  tagline: 'Send the same power at ten times the voltage, and the wire wastes a hundred times less.',
  title: 'Light a town 100 km away.',
  subtitle:
    'The same power, the same wire. At low voltage the line glows and the town stays dark; turn the voltage up and the windows light. Then take the dial yourself.',
  field: 'Joule heating · Transformers · A square law',
  sceneLabel: '10 MW sent · 100 km of wire',
  // By the kind of current: alternating, direct as in the 1880s, direct as today.
  sceneNames: [
    'Alternating current, through transformers',
    'Direct current, as in the 1880s',
    'Direct current today, through converters',
  ],
  tip: 'Drag along the voltage scale under the picture, or press ← → on the picture, to turn the voltage',
  soundOff: 'Turn sound on',
  soundOn: 'Sound on · mute',
  noSound: 'Sound is unavailable in this browser. You can still watch the line.',
  canvasLabel:
    'At night, a power station on the left sends electricity along a line of pylons to a town of little houses on the right, 100 km away, through a transformer at each end. When the voltage is low, the wire glows orange and heat shimmers above it, and most windows in the town stay dark. As the voltage rises, the glow fades and the windows light up one by one. Below, a chart shows the heat wasted in the wire against the voltage: a straight line falling steeply, where ten times the voltage means a hundred times less heat. Its horizontal axis is the dial.',
  panelEyebrow: 'Turn the dial',
  whyLabel: 'Why does high voltage waste less?',
  nudge:
    'Watch the line as the voltage climbs from 10 kV to 100 kV: the heat falls a hundred times. Then switch to direct current, as in the 1880s, to see what the transformers were doing.',
  connection: {
    html: '<strong>Power through a network.</strong> Here, one line carries a town’s power. Real grids are networks, and networks can surprise you: in The tempting shortcut, a new road slows every driver down. Computer models suggest the same can happen when a power grid gains a line.',
    label: 'Try the shortcut',
  },

  presets: [
    { name: 'Half of it lost', note: 'The wire turns half the power into heat.', badge: '10 kV' },
    { name: 'Like a main grid line', note: 'Barely warm, and every window lit.', badge: '400 kV' },
    { name: 'Just add metal', note: 'A hundred times the aluminium, still at 10 kV.', badge: '×100' },
  ],

  voltage: 'Voltage on the line',
  voltageHint:
    'Transformers step the voltage up at the station and down again in the town, so the houses still get 230 V.',
  voltageValue: (kv, lost) => `${kv}, ${lost} lost as heat`,
  modeLabel: 'Current',
  // By the kind of current: alternating, direct as in the 1880s, direct as today.
  modes: ['AC', 'DC, 1880s', 'DC, today'],
  modeHint: 'Alternating current (AC) swings back and forth 50 times a second; direct current (DC) flows one way.',
  metal: 'Metal in the wire',
  metalHint: 'The other way to waste less: more aluminium means less resistance. Twice the metal, half the heat.',

  // Units, with a number already written in the page's language.
  kv: (n) => `${n}\u00a0kV`,
  times: (n) => `×${n}`,
  watts: [(n) => `${n}\u00a0W`, (n) => `${n}\u00a0kW`, (n) => `${n}\u00a0MW`, (n) => `${n}\u00a0GW`],
  cm: (n) => `${n}\u00a0cm`,
  tonnes: (n) => `${n}\u00a0tonnes`,

  // A number and one line: the rest (the current, ten times the voltage) is on the chart and in the explanation.
  readout: {
    lost: 'Lost as heat',
    lostOf: (loss, sent) => `${loss} of the ${sent} sent. The town gets the rest.`,
    tooMuch: (loss, sent) => `${loss}, more than the ${sent} sent: nothing reaches the town.`,
    // Only once the visitor adds metal.
    wire: (cm, tonnes) => `The wire is ${cm} thick: ${tonnes} of aluminium.`,
    stopped: 'Steady direct current can’t pass a transformer, so nothing reaches the town.',
    converters: 'Converters step direct current up and down; in this simple model it loses as much as AC.',
  },

  status: (kv, lost) => `${kv} · ${lost} lost`,
  statusStopped: 'No current gets through',

  // Words drawn on the picture.
  labels: {
    station: 'power station',
    town: 'town',
    distance: '100 km',
    house: '230 V',
    lost: (share) => `${share} lost as heat`,
    nothing: 'nothing reaches the town',
    stopped: 'steady current: the transformers pass nothing',
    chartTitle: 'heat wasted in the wire',
    chartX: 'voltage on the line',
    sent: 'all 10 MW sent',
    over: 'the town gets nothing',
    // The step between the dot and ten times (or a tenth of) its voltage.
    up: ['× 10 voltage', '÷ 100 heat'],
    down: ['÷ 10 voltage', '× 100 heat'],
    drag: 'drag to turn',
  },

  guests: [
    {
      name: 'James Prescott Joule',
      note: 'In 1840 he measured the heat a current makes in a wire, and found it grows with the square of the current: twice the current, four times the heat.',
    },
    {
      name: 'Thomas Edison',
      note: 'In the 1880s his company sent out direct current at 110 volts. It reached only customers less than a mile from each power station, but it worked with storage batteries, electric motors and his electricity meter.',
    },
    {
      name: 'Nikola Tesla',
      note: 'His motor ran on alternating current. In 1888 George Westinghouse licensed his patents, and with transformers to raise the voltage, alternating current went on to win the contest with Edison’s direct current.',
    },
  ],

  insight: {
    title: 'Why does high voltage waste less?',
    html: `<p>A power station sends power as voltage times current: P = V × I. The wire turns some of it into heat, and that heat grows with the <em>square</em> of the current: I² × R, where R is the wire’s resistance (Joule’s law). So to send the same power, raise the voltage and lower the current. Ten times the voltage means a tenth of the current, and a hundredth of the heat.</p>
<div class="insight-visual">heat wasted = I² × R = (P ÷ V)² × R = P² × R ÷ V²</div>
<h3>The numbers in this room</h3>
<p>The station sends 10 MW along 100 km of wire with a resistance of 5 Ω. At 10 kV the current is 1,000 A, and the wire wastes 5 MW: half of everything. At 100 kV the current is 100 A, and it wastes 50 kW, or 0.5%. At 400 kV it wastes about 3 kW. Below about 7 kV the sum would waste more than the station sends, so the town gets nothing at all.</p>
<h3>Why not a thicker wire?</h3>
<p>A wire’s resistance falls in proportion to its cross-section, so halving the heat by metal alone means doubling the metal. The thinnest wire here is solid aluminium about 2.7 cm thick, some 150 tonnes of it. To do at 10 kV what 100 kV does, you would need a hundred times as much: a wire 27 cm thick, weighing 15,000 tonnes. Raising the voltage is far cheaper.</p>
<h3>The transformer, and the war of the currents</h3>
<p>Houses can’t use 400,000 volts, so the voltage has to come down again at the end. A transformer does this with two coils on an iron core: a changing current in one makes a changing magnetic field, which drives a current in the other. The voltages are in the ratio of the coils’ turns, and the current changes the other way, so the power stays nearly the same. But it only works while the current keeps changing. In the late 1880s and early 1890s, that made alternating current the winner of the “war of the currents”. Edison’s direct current had real merits, and worked with storage batteries, motors and meters, but it couldn’t be stepped up, so it went out at 110 V and reached customers less than a mile away. Later, mercury-arc valves and then, from the 1970s, electronics made it possible to convert between alternating and direct current at very high voltage, and today many of the longest links carry direct current: China’s Zhundong–South Anhui line runs at ±1,100 kV for more than 3,000 km.</p>
<h3>What this leaves out</h3>
<p>This is one wire with resistance alone, carrying a fixed power. Real lines carry three phases, and the line’s own magnetic and electric fields, and the current crowding towards the wire’s surface, add to their losses. The sums also assume the station can always push its power through. Once the wire would waste a large part of it, that fails: below about 7 kV here, the voltage the wire uses up on the way, I × R, would be more than the station’s whole voltage, so in reality the lamps would dim and the current couldn’t grow so large. Either way, the town stays dark. The glow is a picture of the heat wasted, not of a temperature: a real line would sag towards the ground, and be switched off, long before it glowed. Voltage can’t rise for ever, either. Towers must be taller and insulators longer, and near the top of the dial the air around the wire begins to glow and crackle (corona discharge); above about 2,000 kV, those losses could cancel out the savings. Real conductors are aluminium strands, often round a steel core, and the houses get 230 V in most of the world, but 120 V in North America.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Electric_power_transmission" target="_blank" rel="noopener">Electric power transmission</a><a class="source-link" href="https://en.wikipedia.org/wiki/Joule_heating" target="_blank" rel="noopener">Joule heating</a><a class="source-link" href="https://en.wikipedia.org/wiki/Transformer" target="_blank" rel="noopener">Transformer</a><a class="source-link" href="https://en.wikipedia.org/wiki/War_of_the_currents" target="_blank" rel="noopener">War of the currents</a><a class="source-link" href="https://en.wikipedia.org/wiki/High-voltage_direct_current" target="_blank" rel="noopener">High-voltage direct current</a><a class="source-link" href="https://en.wikipedia.org/wiki/Corona_discharge" target="_blank" rel="noopener">Corona discharge</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mains_electricity" target="_blank" rel="noopener">Mains electricity</a><a class="source-link" href="https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity" target="_blank" rel="noopener">Electrical resistivity (aluminium)</a></div>`,
  },
});
