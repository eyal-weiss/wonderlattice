Wonderlattice.defineText('heart', 'ar', {
  eyebrow: "EXCITABLE MEDIA",
  name: "A heartbeat travels",
  tagline: "Tap a sheet of cells and a wave rolls out. Break it, and it curls into a spiral.",
  title: "A heartbeat travels.",
  subtitle: "Each cell fires and then rests, like the cells of a heart. Start a wave, then break it and watch it curl into a spiral.",
  field: "Excitable media · Spiral waves · Waves in the body",
  sceneLabel: "One sheet · Thousands of cells",
  sceneName: "The travelling beat",
  tip: "Tap to start a wave · Drag across a wave to break it · Arrow keys aim, Enter starts a wave, Delete wipes",
  actionLabel: "Break a wave",
  canvasLabel: "A sheet of cells where waves of activity spread from a pacemaker in the corner and from your taps. Drag across a wave to break it.",
  panelEyebrow: "Fire, then rest",
  whyLabel: "Why does a broken wave spin?",
  nudge: "Press “Break a wave”, then watch the beats at the far corner. Is the pacemaker still setting the rhythm?",
  connection: {
    html: "<strong>Patterns from cells that only talk to their neighbours.</strong> Here, waves of activity travel through a sheet of cells. In Grow a fingerprint, two chemicals spreading at different speeds draw ridges.",
    label: "See ridges grow",
  },
  presets: [
    {
      name: "A steady heartbeat",
      note: "One pacemaker, one beat a second.",
      badge: "♥",
    },
    {
      name: "Break a wave",
      note: "Its loose ends curl into spirals.",
      badge: "@",
    },
    {
      name: "Slow recovery",
      note: "Some beats never arrive.",
      badge: "½",
    },
  ],
  recovery: "Recovery time",
  recoveryHint: "How long a cell rests before it can fire again.",
  pacemaker: "Pacemaker in the corner",
  rateLabel: "Beats reaching the far corner",
  rate: (n) => `${n} a minute`,
  pacemakerRate: "The pacemaker beats 60 times a minute.",
  status: {
    quiet: "Every cell is resting",
    waves: "Waves are travelling",
    steady: "Every beat reaches the far corner",
    blocked: "Some beats never reach the far corner",
    spirals: (n) => (n === 1 ? 'A spiral is turning on its own' : `${n} spirals are turning on their own`),
  },
  guests: [
    {
      name: "Norbert Wiener",
      note: "With Arturo Rosenblueth in 1946, I described how a wave of excitation can keep circling an obstacle in heart muscle.",
    },
    {
      name: "Arthur Winfree",
      note: "I hunted for the still point at the centre of a spiral wave, where the rhythm has no phase at all.",
    },
  ],
  insight: {
    title: "Why does a broken wave spin?",
    html: `<p>Each cell in this sheet is resting, firing or recovering. A resting cell fires when enough of its neighbours fire. A firing cell soon stops, and then it needs time to recover before it can fire again. A sheet like this is called an <em>excitable medium</em>.</p>
<div class="insight-visual">resting → firing → recovering → resting</div>
<h3>Why waves don’t pass through each other</h3>
<p>Behind every wave is a band of recovering cells. When two waves meet, each runs into the other’s recovering band and stops, so they cancel instead of crossing.</p>
<h3>Why a broken wave spins</h3>
<p>A wave with a loose end moves more slowly at the end, where it has fewer firing neighbours, than further along. The end lags behind, the rest of the wave swings round it, and the wave curls into a spiral. A spiral keeps its own rhythm, and here that rhythm is faster than the pacemaker’s, so the spiral takes over the whole sheet.</p>
<h3>Hearts, chemistry and slime moulds</h3>
<p>Heart muscle is an excitable medium too: each heartbeat is a wave of electrical activity started by a natural pacemaker. Spiral waves circling in heart tissue, called re-entry, are linked to some dangerous heart rhythm disorders. The same spirals appear in the Belousov–Zhabotinsky chemical reaction and in colonies of slime moulds.</p>
<h3>What this model leaves out</h3>
<p>This is a toy: a flat, even sheet that follows a simple mathematical rule. Real heart tissue has fibres, three dimensions, many kinds of cells and far richer chemistry. The room shows why spirals form and why they last. It is not a simulation of a heart, and it says nothing about anyone’s health.</p>
<details><summary>The mathematics, if you want it</summary><p>Each cell has an activation u between 0 and 1 and a recovery v, following Barkley’s model: ∂u/∂t = ∇²u + u(1 − u)(u − (v + b)/a)/ε and ∂v/∂t = k(u − v), with a = 0.75, b = 0.02 and ε = 0.02. The ∇²u term spreads activation to neighbours. The cubic term makes a cell fire only above a threshold, and that threshold stays high while the cell recovers. The factor k, added here, is set by the recovery slider: slower recovery gives wider waves, bigger spirals and, when cells are still recovering as the next beat arrives, blocked beats. Earlier models of the same idea were cellular automata with a few discrete states, such as Greenberg and Hastings’s in 1978. Arthur Winfree’s book <em>When Time Breaks Down</em> (1987) tells the story of spirals in hearts and chemistry.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Excitable_medium" target="_blank" rel="noopener">Excitable medium</a><a class="source-link" href="http://www.scholarpedia.org/article/Barkley_model" target="_blank" rel="noopener">Barkley model (Scholarpedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Belousov%E2%80%93Zhabotinsky_reaction" target="_blank" rel="noopener">Belousov–Zhabotinsky reaction</a><a class="source-link" href="https://en.wikipedia.org/wiki/Arthur_Winfree" target="_blank" rel="noopener">Arthur Winfree</a></div>`,
  },
});
