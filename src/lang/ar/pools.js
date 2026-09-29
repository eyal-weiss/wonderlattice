Wonderlattice.defineText('pools', 'ar', {
  eyebrow: "GROUP TESTING",
  name: "A thousand samples, ten tests",
  tagline: "One tube in a thousand is glowing. Ten tests, all at once, say which.",
  title: "A thousand samples, ten tests.",
  subtitle: "One tube is glowing, and you can’t tell which. Mix drops from clever groups of tubes, run ten tests at once, and read the answer off the lights.",
  field: "Binary numbers · Pooled testing · One bit per test",
  sceneLabels: [
    (tubes, tests) => `${tubes} tubes · ${tests} tests`,
    "A crowd of 100 · pooled tests",
  ],
  tips: [
    "Tap a tube to hide the glow there, or a well to see which tubes feed it · Left and right arrow keys pick a well",
    "Slide how many are infected and how big the pools are · Left and right arrow keys change the pool size",
  ],
  actionLabels: [
    "Hide a new tube",
    "A new crowd",
  ],
  canvasLabel: "On the first floor, a rack of tubes with a row of test wells beneath it. Each well takes a drop from a group of tubes; lit wells read as a binary number, which names the glowing tube. On the second floor, a crowd of 100 people split into pools, each pool tested once, with retests for everyone in a positive pool, and a chart of the expected number of tests for each pool size.",
  panelEyebrow: "Mix the samples",
  whyLabel: "How can ten tests be enough?",
  nudge: "Tap a tube, and ten tests find it again. Then try two glowing tubes. On the second floor, push the prevalence above 31% and watch the savings vanish.",
  connection: {
    html: "<strong>Yes-or-no answers that spell an address.</strong> Here, ten yes/no tests spell the number of the glowing tube. In Send a picture through a storm, a few check bits spell the address of the bit the noise flipped.",
    label: "Send a picture through a storm",
  },
  presets: [
    {
      name: "One glowing tube",
      note: "The lights spell its number.",
      badge: "1",
    },
    {
      name: "Two glowing tubes",
      note: "Now the lights point at the wrong tube.",
      badge: "2",
    },
    {
      name: "1 in 100 infected",
      note: "Pools of ten save four tests in five.",
      badge: "1%",
    },
  ],
  floorLabel: "Which floor?",
  floors: [
    "Ten tests at once",
    "One test for many",
  ],
  hotLabel: "How many tubes are glowing?",
  hot: [
    "One",
    "Two",
  ],
  prevalence: "Infected",
  prevalenceHint: "The share of the crowd carrying the infection, secretly",
  pool: "Pool size",
  poolHint: "People whose samples share one test. 1 means testing everyone separately.",
  sceneNames: {
    hidden: "One tube is glowing. Which?",
    hiddenTwo: "Two tubes are glowing",
    found: (tube) => `The lights say tube ${tube}`,
    crowd: (percent) => `100 people, ${percent} infected`,
  },
  status: {
    mixing: (well, tests) => `Mixing drops · well ${well} of ${tests}`,
    testing: (tests) => `All ${tests} tests at once`,
    read: (tests) => `${tests} tests · done`,
    pooling: (done, pools) => `Pooled tests · ${done} of ${pools}`,
    retesting: (done, retests) => `Retests · ${done} of ${retests}`,
    used: (tests) => `${tests} tests used`,
  },
  labels: {
    yes: "yes",
    no: "no",
    sum: (parts, total) => `${parts} = ${total}`,
    none: "No well lit: no tube is glowing",
    here: (tube) => `tube ${tube}`,
    wrong: (tube) => `tube ${tube}? It isn’t glowing`,
    missing: (tube, tubes) => `tube ${tube}? There are only ${tubes}`,
    well: (value) => `takes every tube with ${value} in its sum`,
    chartTitle: "Expected tests for 100 people",
    axis: "pool size",
    oneByOne: "one by one: 100",
    best: (k) => `best: ${k}`,
    never: "pooling never helps here",
    thisRun: "this crowd",
  },
  readout: {
    tests: (tests, tubes) => `<strong>${tests}</strong> tests, run at the same time. One by one would take ${tubes}.`,
    code: (tube, bits) => `Tube ${tube} in binary: <code>${bits}</code>`,
    lights: (bits, value) => `The lights: <code>${bits}</code> = ${value}`,
    two: "Each well lights up if either glowing tube feeds it, so the lights show the two numbers merged: a 1 wherever either has a 1. Finding two tubes in one round takes more, cleverer tests.",
    well: (value, count) =>
      `This well takes a drop from every tube whose number, written as a sum of 1, 2, 4, 8, …, uses ${value}: ${count} tubes.`,
    used: (tests) => `Tests used on this crowd: <strong>${tests}</strong>`,
    expected: (tests) => `Expected, on average: ${tests}. One by one: 100.`,
    best: (k, tests) => `Best pool size here: ${k}, about ${tests} tests.`,
    never: "At this prevalence no pool size beats testing everyone separately.",
  },
  announce: {
    found: (tube, tests) => `${tests} tests: the lights spell ${tube}, the glowing tube.`,
    wrong: (a, b, pointed) => `The glowing tubes are ${a} and ${b}, but the lights spell ${pointed}.`,
    crowd: (tests, expected) => `${tests} tests for 100 people; ${expected} expected; 100 one by one.`,
  },
  guests: [
    {
      name: "Robert Dorfman",
      note: "In 1943 he suggested pooling blood samples when screening wartime recruits for syphilis: test the pool, and retest one by one only if it is positive.",
    },
    {
      name: "Claude Shannon",
      note: "He founded the mathematics of information, counted in bits. A yes-or-no answer carries at most one, so ten answers can tell apart at most 1,024 possibilities.",
    },
  ],
  insight: {
    title: "How can ten tests be enough?",
    html: `<p>Write each tube’s number as a sum of 1, 2, 4, 8, … 512, using each at most once: tube 673 is 512 + 128 + 32 + 1. That is its number in <strong>binary</strong>. The well marked 512 takes a drop from every tube whose sum uses 512, the well marked 1 from every tube whose sum uses 1 (every other tube), and so on. Only the glowing tube makes a well glow, so the lit wells are exactly the parts of its sum. Ten wells, lit or dark, spell any number up to 1,023.</p>
<div class="insight-visual">Tube 673 = 512 + 128 + 32 + 1 = 1010100001 in binary → wells 512, 128, 32 and 1 light up</div>
<p>Ten is also the fewest possible. Each yes/no answer can at best halve the possibilities, and there are 1,001 of them: any of the 1,000 tubes, or none. Nine answers tell apart only 512. (On a phone the rack has 63 tubes and needs six tests, for the same reason.) It’s the old puzzle of a thousand bottles and ten tasters.</p>
<h3>Two glowing tubes</h3>
<p>A well lights if <em>either</em> glowing tube feeds it, so the lights show both numbers merged, and spell a third tube. To find up to <em>d</em> positives in a single round, the pools must be chosen so that no tube’s wells are covered by the wells of <em>d</em> others. That needs on the order of <em>d</em>² log <em>n</em> / log <em>d</em> tests, where testing in rounds, each chosen after seeing the last, needs only about <em>d</em> log(<em>n</em>/<em>d</em>). Running everything at once has a price.</p>
<h3>One test for many</h3>
<p>In 1943 Robert Dorfman suggested a simpler plan for large screenings: pool the samples of <em>k</em> people, test the pool, and retest each person only if it is positive. If a share <em>p</em> of people are infected, the expected number of tests per person is 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. At 1% the best pool has 11 people and costs 0.196 tests each, a saving of about 80%. At 5% the best pool is 5 (0.43 tests each), at 10% it is 4 (0.59). The best size is roughly 1/√<em>p</em>. In this room’s crowd of exactly 100, pools of 10 do as well as 11 (19.6 tests), because they split the crowd evenly. The tests used by one crowd wobble around the expectation: count on the average, not a lucky run.</p>
<h3>The cliff</h3>
<p>As infections get commoner, more pools come back positive and need retests, and the best pool shrinks. Above 1 − 3<sup>−1/3</sup> ≈ 30.7%, no pool size beats testing everyone separately. Peter Ungar proved in 1960 that above (3 − √5)/2 ≈ 38%, <em>no</em> strategy, however clever, beats it. At the other end, information theory sets a floor: about 100·H(<em>p</em>) tests for 100 people, where H is the binary entropy, around 8 at 1%.</p>
<h3>What this leaves out</h3>
<p>Every test here is perfect. Real tests sometimes miss or raise false alarms, and pooling dilutes each sample: Mutesa and colleagues in Rwanda checked that a positive sample was still detected when diluted 100-fold with negative ones. The single-glowing-tube trick is fragile, and labs don’t use it as it stands. Its practical descendants are Dorfman’s pools and designs like Rwanda’s, which arranges samples on a cube-shaped grid, three points to a side, and pools each slice: the same idea as the binary wells, counted in threes. The model also treats infections as independent, while real ones cluster in households, which can actually help pooling. Dorfman made his proposal for wartime screening; this room doesn’t claim how widely it was used then.</p>
<details><summary>The mathematics, if you want it</summary><p>Binary design: with tubes 1, …, <em>n</em>, test <em>k</em> (from 0) contains every tube whose <em>k</em>-th binary digit is 1; with exactly one positive, the results are its binary digits, and ⌈log₂(<em>n</em> + 1)⌉ tests suffice and are necessary. Dorfman: a pool of <em>k</em> costs one test, plus <em>k</em> more with chance 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. Pooling helps when 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup> &lt; 1, that is (1 − <em>p</em>)<sup><em>k</em></sup> &gt; 1/<em>k</em>; the largest <em>p</em> for which some <em>k</em> works is at <em>k</em> = 3, where (1 − <em>p</em>)³ = 1/3. The room’s crowd counts its leftover pool exactly: with pools of 11, nine pools of 11 and one person tested alone. R. Dorfman, “The detection of defective members of large populations”, Ann. Math. Statist. 14 (1943) 436–440. P. Ungar, “The cutoff point for group testing”, Comm. Pure Appl. Math. 13 (1960). L. Mutesa et al., “A pooled testing strategy for identifying SARS-CoV-2 at low prevalence”, Nature 589 (2021).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Group_testing" target="_blank" rel="noopener">Group testing</a><a class="source-link" href="https://doi.org/10.1214/aoms/1177731363" target="_blank" rel="noopener">Dorfman (1943)</a><a class="source-link" href="https://www.nature.com/articles/s41586-020-2885-5" target="_blank" rel="noopener">Mutesa et al., Nature (2021)</a><a class="source-link" href="https://arxiv.org/abs/1902.06002" target="_blank" rel="noopener">Aldridge, Johnson and Scarlett (2019)</a><a class="source-link" href="https://arxiv.org/abs/2105.08845" target="_blank" rel="noopener">Aldridge and Ellis, pooled testing in the pandemic</a></div>`,
  },
});
