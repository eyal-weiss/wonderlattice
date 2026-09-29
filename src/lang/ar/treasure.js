Wonderlattice.defineText('treasure', 'ar', {
  eyebrow: "PROBABILITY",
  name: "The imperfect treasure detector",
  tagline: "A detector that is right 95% of the time beeps. Is there treasure? Usually not.",
  title: "The imperfect treasure detector.",
  subtitle: "Sweep the island, then dig where it beeps. How often is the treasure really there?",
  field: "Probability · Bayes’ rule · A little surprise",
  sceneLabel: "One island · One honest detector",
  sceneName: "Treasure island",
  tip: "Tap a beeping square to dig · Arrow keys aim, Enter digs",
  actionLabel: "Sweep the island",
  canvasLabel: "An island of squares. A detector beeps over some of them; digging shows treasure or nothing. Beside it, 1,000 squares as dots, sorted by what the detector says.",
  panelEyebrow: "Change the odds",
  whyLabel: "Why is a beep so often wrong?",
  nudge: "Make treasure rarer and watch the beeps: more and more of them are false alarms, although the detector hasn’t changed at all.",
  connection: {
    html: "<strong>Chance plays tricks on intuition.</strong> In The dice that beat each other, “best” depends on the opponent. Here, what a beep means depends on how rare the treasure is.",
    label: "Roll the odd dice",
  },
  presets: [
    {
      name: "Treasure everywhere",
      note: "A beep is good news.",
      badge: "30%",
    },
    {
      name: "Rare treasure",
      note: "Try the surprise.",
      badge: "2%",
    },
    {
      name: "Ask a second detector",
      note: "Two beeps are much stronger.",
      badge: "×2",
    },
  ],
  treasure: "How common is treasure?",
  treasureHint: "The share of squares that hold treasure.",
  share: (pct) => `${pct}% · 1 in ${Math.round(100 / pct)}`,
  accuracy: "How often the detector is right",
  accuracyHint: "It beeps over treasure, and stays quiet over sand, this often.",
  second: "Ask a second detector too (only squares where both beep count)",
  actions: {
    sweep: "Sweep the island",
    digAll: "Dig every beep",
    again: "A new island",
  },
  status: {
    ready: "Sweep the island to start",
    swept: (beeps) => `${beeps} ${beeps === 1 ? 'beep' : 'beeps'} · tap one to dig`,
    digging: (dug, beeps, found) => `${dug} of ${beeps} beeps dug · ${found} ${found === 1 ? 'treasure' : 'treasures'}`,
    done: (beeps, found) =>
      `${beeps} ${beeps === 1 ? 'beep' : 'beeps'} dug: ${found} ${found === 1 ? 'treasure' : 'treasures'}, ${beeps - found} false ${beeps - found === 1 ? 'alarm' : 'alarms'}`,
  },
  dug: {
    treasure: "Treasure!",
    nothing: "Nothing here.",
  },
  quiet: "The detector stayed quiet here.",
  readout: {
    title: "A beep means treasure",
    story: (total, treasure, found, falseAlarms, both) =>
      `Of every ${total.toLocaleString('en')} squares, ${treasure} hold treasure. ${both ? 'Both detectors beep' : 'The detector beeps'} over ${found} of them, and over ${falseAlarms} empty ${falseAlarms === 1 ? 'one' : 'ones'}. So ${found} of ${found + falseAlarms} beeps are treasure.`,
    percent: (p) => `${Math.round(p * 100)}%`,
  },
  labels: {
    island: "The island",
    thousand: "Every 1,000 squares",
    found: "treasure, beep",
    missed: "treasure, quiet",
    falseAlarm: "sand, beep",
    quiet: "sand, quiet",
  },
  guests: [
    {
      name: "Thomas Bayes",
      note: "A clue should change your mind, but how much depends on what you believed before it.",
    },
    {
      name: "Pierre-Simon Laplace",
      note: "I found the same rule on my own, and used it for the stars, the courts and the census.",
    },
  ],
  insight: {
    title: "Why is a beep so often wrong?",
    html: `<p>Imagine 1,000 squares, and treasure under 20 of them. A detector that is right 95% of the time beeps over 19 of the 20. But it also beeps, wrongly, over 5% of the 980 empty squares: 49 of them. That makes 68 beeps, and only 19 of them are treasure, about 28%. The detector is good; the treasure is rare, so false alarms outnumber finds.</p>
<div class="insight-visual">19 finds + 49 false alarms → a beep means treasure 19 times in 68</div>
<h3>Counting beats percentages</h3>
<p>Put as percentages (“2% of squares, 95% accurate”), this puzzle fools most people, doctors included. Put as counts of squares, as in the dots beside the island, most people get it right. Psychologists Gerd Gigerenzer and Ulrich Hoffrage showed this in 1995; they call counts like these natural frequencies.</p>
<h3>Why a second detector helps so much</h3>
<p>If a second detector, with its own independent mistakes, also beeps, the false alarms almost vanish: of the 49, only about 2 fool both. Now most double beeps are treasure. That is how evidence adds up.</p>
<h3>What this room simplifies</h3>
<p>The detector is equally right over treasure and over sand, and the second detector's mistakes are independent of the first's. Real repeated tests are rarely that independent, so a second test usually helps less than here. Each island is laid out to match the expected counts, rounded to whole squares; a real search would vary around them. The same arithmetic applies to screening for rare conditions: a positive result there is a reason to look further, not a verdict.</p>
<details><summary>The mathematics, if you want it</summary><p>This is Bayes’ rule. With treasure in a share r of squares and a detector that is right with chance a, P(treasure | beep) = a·r / (a·r + (1 − a)·(1 − r)). With two independent detectors, P(treasure | both beep) = a²·r / (a²·r + (1 − a)²·(1 − r)). The rule is named after Thomas Bayes, whose essay was published in 1763, after his death; Pierre-Simon Laplace developed it independently and used it widely. G. Gigerenzer and U. Hoffrage, “How to improve Bayesian reasoning without instruction: frequency formats”, Psychological Review 102 (1995).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Base_rate_fallacy" target="_blank" rel="noopener">Base rate fallacy</a><a class="source-link" href="https://en.wikipedia.org/wiki/Bayes%27_theorem" target="_blank" rel="noopener">Bayes’ theorem</a></div>`,
  },
});
