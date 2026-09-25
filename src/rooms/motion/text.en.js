/*
 * Paint with motion · visitor-facing words (English) used by room.js. The room's
 * fixed labels and its explanation dialog live in index.html (data-t="motion.*"
 * and "why.*"), so they are translated through the 'page' scope instead.
 */
Wonderloom.defineText('motion', 'en', {
  eyebrow: 'GEOMETRY',
  name: 'Paint with motion',
  tagline: 'Two turning arms and a pen draw flowers, stars, and weaves.',

  presets: [
    {
      name: 'Wildflower',
      note: 'Six petals, one line',
      nudge: 'Try changing −5 to −5.1. A tiny shift gives the flower a very different future.',
    },
    {
      name: 'Silken orbit',
      note: 'A loop inside a loop',
      nudge: 'Turn on the moving arms. Watch how each simple circle adds to the other.',
    },
    {
      name: 'Starling',
      note: 'A soft-edged star',
      nudge: 'Move the pen reach toward 50%. Watch the soft corners turn into deep loops.',
    },
    {
      name: 'Woven light',
      note: 'Take the long way round',
      nudge: 'Use “Trace it all” to reveal the full weave. Then try −4 for a simpler relative.',
    },
    {
      name: 'Almost a circle',
      note: 'A tiny change, a long story',
      nudge: 'Two almost-matching speeds slowly drift apart. Trace it all to see their whole reunion.',
    },
    {
      name: 'Ribbons',
      note: 'Find the hidden rhythm',
      nudge: 'Try a different starting angle. The rhythm stays the same while the drawing turns.',
    },
  ],
  paletteNames: ['Aurora', 'Ember', 'Glacier', 'Moonlight'],

  names: { own: 'Your own orbit', surprise: 'A happy accident', shared: 'A shared orbit' },
  nudges: {
    whole: 'Try nudging the rotation away from a whole number. Watch the path take a longer way home.',
    traceAll: 'Try “Trace it all” to see the entire pattern. Every setting here eventually closes its loop.',
    surprise: 'Something new, just for you. Change one thing and see where it leads.',
    shared: 'Someone left you a pattern. Try changing one thing to make it yours.',
    revisit: 'A familiar pattern can still have a surprise. Change one thing and look again.',
  },

  status: {
    complete: 'The loop is complete',
    oneTurn: 'One turn. A whole world.',
    turns: (n) => `${n} outer turns to reunite`,
  },
  explainStill: 'The inner arm holds its direction while the outer arm turns. The pen traces a shifted circle.',
  explain: (k, outer, inner, opposite) =>
    `At ${k}×, both arms return to their starting positions after ${outer} outer ${outer === 1 ? 'turn' : 'turns'} and ${inner} inner ${inner === 1 ? 'turn' : 'turns'}. ${opposite ? 'They turn in opposite directions.' : 'They turn in the same direction.'}`,

  play: { pause: 'Pause', play: 'Play', replay: 'Replay' },
  focus: { enter: 'Enter focus view', leave: 'Leave focus view', title: 'Focus view' },
  rotationRange: 'Choose a rotation between −10 and 10.',
  saved: 'Your drawing is ready to save.',
  saveFailed: 'The image could not be saved. Please try again.',
  shareText: (k, r, p, ink) =>
    `Wonderloom · Paint with motion\nInner rotation: ${k}×\nPen reach: ${r}%\nStarting angle: ${p}°\nInk: ${ink}`,
  linkCopied: 'Pattern link copied.',
  settingsCopied: 'Pattern settings copied.',
  linkDescription: 'Copy this link to reopen the same pattern.',
  settingsDescription: 'Copy these settings to recreate your pattern.',

  guests: [
    { name: 'Emmy Noether', note: 'A hidden symmetry can reveal something that never changes.' },
    { name: 'Leonhard Euler', note: 'Circles and exponentials share a rather elegant dance.' },
  ],
});
