/* The punishment illusion · visitor-facing words (English). */
Wonderlattice.defineText('regress', 'en', {
  eyebrow: 'STATISTICS',
  name: 'The punishment illusion',
  tagline: 'Scold a bad throw and the next one is better, nine times in ten. The scolding did nothing.',
  title: 'The punishment illusion.',
  subtitle: 'A coach praises the best throws and scolds the worst. Watch what follows each word, then show the wiring.',
  field: 'Statistics · Regression to the mean · Intuition fooled',
  sceneLabel: 'One thrower · One coach',
  sceneName: 'The coach’s tally',
  tip: 'Tap a face to coach · Keys: ↑ praise, ↓ scold, → say nothing',
  actionLabel: 'Show the wiring',
  hideLabel: 'Hide the wiring',
  canvasLabel:
    'A dartboard where a thrower’s darts land, a coach who praises or scolds each throw, and a tally of whether the next throw was better or worse after each word.',
  panelEyebrow: 'Coach',
  whyLabel: 'Why does scolding seem to work?',
  nudge: 'Turn the automatic coach off and coach by hand: praise and scold whatever you like. Then show the wiring.',
  connection: {
    html: '<strong>Intuition against arithmetic.</strong> In The imperfect treasure detector, a beep means less than it seems. Here, a coach’s words seem to do more than they do.',
    label: 'Sweep for treasure',
  },

  presets: [
    { name: 'Automatic coach', note: 'Praise the best, scold the worst.', badge: '20%' },
    { name: 'You coach', note: 'Every word is yours.', badge: '↑↓' },
    { name: 'Praise really helps', note: 'Does the tally notice?', badge: '+' },
  ],

  auto: 'Automatic coach: praise the best throws, scold the worst',
  share: 'The coach reacts to the best and worst',
  shareHint: 'The more extreme the throws it reacts to, the stronger the illusion.',
  helps: 'Praise really helps a little (the next throw gets a small lift)',
  words: { praise: 'Praise', scold: 'Scold', nothing: 'Say nothing' },

  labels: {
    board: (n) => `Throw ${n}`,
    points: (p) => `${p} points`,
    praise: 'Well done!',
    scold: 'Sloppy!',
    nothing: '…',
    yourWord: 'Your word?',
    afterPraise: 'After praise',
    afterScold: 'After scolding',
    better: 'next better',
    worse: 'next worse',
    times: (k, n) => `${k} of ${n}`,
    none: 'not yet',
    hidden: 'What are the coach’s words wired to?',
    hiddenHint: 'Show the wiring to see',
    wired: 'Words wired to the next throw:',
    nothing2: 'nothing',
    lift: 'praise: a small lift',
    thisThrow: 'this throw →',
    nextThrow: 'next throw ↑',
    same: 'same again',
    fitted: 'best fit',
  },

  status: {
    waiting: (n) => `Throw ${n}: your word?`,
    count: (n) => `${n} throws`,
    done: (n) => `${n} throws, all done`,
  },
  announce: (pw, pn, sb, sn) =>
    `After praise the next throw was worse ${pw} times in ${pn}; after scolding it was better ${sb} times in ${sn}.`,

  guests: [
    {
      name: 'Francis Galton',
      note: 'I measured parents and their grown children: the children of very tall parents were tall, but on average only two-thirds as far from the middle.',
    },
    {
      name: 'Daniel Kahneman',
      note: 'A flight instructor told me that praise made cadets worse and shouting made them better. He had seen it, and it was regression to the mean.',
    },
  ],

  insight: {
    title: 'Why does scolding seem to work?',
    html: `<p>Every throw is the thrower’s skill plus luck. An unusually good throw is usually a good throw with good luck on top, and luck doesn’t carry over. So the next throw is likely to be nearer the thrower’s average, whatever the coach says. With the coach reacting to the best and worst fifth of throws, the throw after a praised one is worse 9 times in 10 in this room, and the throw after a scolded one is better 9 times in 10. The coach’s words reach nothing at all.</p>
<div class="insight-visual">a great throw = skill + good luck → next throw = skill + ordinary luck → “praise made it worse”</div>
<h3>The flight instructor</h3>
<p>Daniel Kahneman tells how he once taught Israeli air force flight instructors that praise works better than punishment. A seasoned instructor objected: when he praised a cadet for a clean manoeuvre, the next try was usually worse, and when he screamed at one, the next try was usually better. Kahneman saw at once that this was regression to the mean: because we praise people when they have done well and scold them when they have done badly, we are, as he put it, “statistically punished for rewarding others and rewarded for punishing them”. He then had everyone in the room toss two coins at a target behind their backs, with no feedback at all: those who did best the first time mostly did worse the second time, and the other way round.</p>
<h3>Galton’s word for it</h3>
<p>Francis Galton found the same pattern in 1886 in the heights of parents and their grown children. Children of very tall parents were tall, but on average only about two-thirds as far from the middle as their parents; children of very short parents were short, but less so. He called it regression towards mediocrity. People don’t all drift towards average: each generation is as spread out as the last. Only those picked for being extreme regress, because part of what made them extreme was luck that isn’t passed on.</p>
<h3>What this room keeps simple</h3>
<p>Here the thrower’s skill never changes and each throw’s luck is fresh, so the words truly do nothing. Real feedback can matter. Turn on “Praise really helps” and the tally still says praise backfires, about 8 times in 10: comparing a throw with the next one can’t tell. To learn what praise does, compare with throws after which the coach said nothing, or with a group that wasn’t praised. The nine in ten belongs to these settings: it is 1 − p/2 when the coach reacts to the best and worst share p of throws (95% at a tenth, 75% at half). The same illusion appears when an athlete slumps after a magazine cover, or when patients who enrol in a study at their worst seem to improve on any treatment.</p>
<details><summary>The mathematics, if you want it</summary><p>If scores are skill plus independent luck, the expected next score is the average plus r times this score’s distance from the average, where r is the correlation between one score and the next. For one thrower whose skill never changes, r = 0: the best-fit line through “this throw, next throw” is flat, while the dashed line “same again” rises. With normal luck and a cutoff c above which lie the best share p of throws, P(next worse | this in the best p) = 1 − p/2, and the mean change is −φ(c)/p, about −1.40 standard deviations for p = 20%. F. Galton, “Regression towards mediocrity in hereditary stature”, Journal of the Anthropological Institute 15 (1886) 246–263. D. Kahneman, autobiography for the 2002 Nobel Prize, and Thinking, Fast and Slow (2011), chapter 17.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Regression_toward_the_mean" target="_blank" rel="noopener">Regression toward the mean</a><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/" target="_blank" rel="noopener">Kahneman’s Nobel autobiography</a><a class="source-link" href="https://galton.org/essays/1880-1889/galton-1886-jaigi-regression-stature.pdf" target="_blank" rel="noopener">Galton 1886 (PDF)</a></div>`,
  },
});
