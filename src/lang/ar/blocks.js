Wonderlattice.defineText('blocks', 'ar', {
  eyebrow: "PHYSICS & MATHS",
  name: "The leaning tower of blocks",
  tagline: "How far can a stack of blocks reach past the edge?",
  title: "The leaning tower of blocks.",
  subtitle: "Stack blocks at the edge of a table, each one sticking out a little further. How far past the edge can the top one reach?",
  field: "Centre of mass · Harmonic series · A slow surprise",
  sceneLabel: "A table edge · Blocks to stack",
  sceneName: (n) => (n === 0 ? 'Empty table' : 'Stacked blocks'),
  tip: "Drag a block onto the stack, or use arrow keys to nudge the top block. Press B for Best Stack.",
  actionLabel: "Best Stack",
  lengthsLabel: (oh) => `${oh.toFixed(2)} lengths`,
  canvasLabel: "A table with blocks stacked at its edge. Drag blocks to adjust their positions. The stack tips if the centre of mass goes past the support.",
  panelEyebrow: "Adjust the stack",
  whyLabel: "Why can it reach so far?",
  nudge: "Start with a few blocks. Can 4 blocks send the top one entirely past the edge? Try 31 blocks for two lengths.",
  connection: {
    html: "<strong>A simple argument behind a surprise.</strong> Here, balancing each block on the one below explains how far a stack can lean. In The impossible floor, colouring the squares shows why some floors can never be tiled.",
    label: "See the impossible floor",
  },
  presets: [
    {
      name: "4 blocks",
      note: "The top block can clear the table edge.",
    },
    {
      name: "31 blocks",
      note: "Two block-lengths of overhang.",
    },
    {
      name: "Best Stack",
      note: "Every block at its ideal position.",
    },
  ],
  blocks: "Blocks",
  blocksHint: "How many blocks in the stack",
  status: (n, overhang) => `${n} block${n === 1 ? '' : 's'} · ${overhang.toFixed(2)} block-lengths out`,
  toppled: "The stack has toppled.",
  milestones: {
    m1: "Top block fully past the edge",
    m2: "Two block-lengths of overhang",
    m3: "Three block-lengths",
  },
  bestLabel: "Best Stack",
  resetLabel: "Start again",
  guests: [
    {
      name: "Nicole Oresme",
      note: "Around 1350, Oresme proved the harmonic series diverges — meaning the overhang has no limit.",
    },
    {
      name: "Leonhard Euler",
      note: "Euler studied the harmonic series deeply, including how painfully slowly it grows.",
    },
  ],
  insight: {
    title: "Why can a stack reach as far as you like?",
    html: `<p>Each block rests stably on the one below as long as the combined <strong>centre of mass</strong> of all blocks above any interface sits over its support. Stack them greedily from the top down: the top block can lean out by ½ its length, the next by ¼, then ⅙, and so on.</p>
<p>The total overhang after <em>n</em> blocks is ½(1 + ½ + ⅓ + … + 1/<em>n</em>) — half the <em>n</em>th partial sum of the <strong>harmonic series</strong>. The series diverges, so the overhang is unbounded. But it grows like ½ ln <em>n</em>: agonisingly slowly.</p>
<div class="insight-visual">4 blocks → 1 block-length out. 31 blocks → 2. 227 blocks → 3.</div>
<h3>The counting</h3>
<p>It takes exactly 4 blocks for the top one to clear the table edge (overhang > 1), 31 for two lengths, and 227 for three. Each extra block-length demands roughly <em>e</em><sup>2</sup> ≈ 7.4× more blocks than the last.</p>
<h3>What this model assumes</h3>
<p>Idealised blocks: rigid, perfectly uniform, frictionless contact. Real books slide and bend. The single-file arrangement shown here is not the most efficient for many blocks: Paterson and Zwick (2009) found arrangements using several blocks per layer whose overhang grows like <em>n</em><sup>1/3</sup> rather than log <em>n</em>.</p>
<details><summary>The mathematics, if you want it</summary><p>Let <em>c<sub>k</sub></em> be the centre of block <em>k</em> counting from the top (block 1 = top). The top block alone can be shifted until its centre of mass is directly over the right edge of block 2, giving overhang ½. Then the combined centre of mass of blocks 1 and 2 must be over block 3's right edge, giving an additional ¼. By induction the optimal offset for block <em>k</em> from block <em>k</em>+1 is 1/(2<em>k</em>), and the total overhang is ½ · H(<em>n</em>) where H(<em>n</em>) is the <em>n</em>th harmonic number.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Block-stacking_problem" target="_blank" rel="noopener">Block-stacking problem (Wikipedia)</a> · <a class="source-link" href="https://arxiv.org/abs/0710.2357" target="_blank" rel="noopener">Paterson &amp; Zwick, "Overhang" (2009)</a></div>`,
  },
});
