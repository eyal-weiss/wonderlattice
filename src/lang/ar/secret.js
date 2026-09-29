Wonderlattice.defineText('secret', 'ar', {
  eyebrow: "NUMBER THEORY",
  name: "A secret shouted across the room",
  tagline: "Two people agree on a secret while everyone listens, and the listeners still can’t work it out.",
  title: "A secret shouted across the room.",
  subtitle: "Alice and Bob can only talk where everyone can hear. Mix colours with them and see how they still end up sharing a secret.",
  field: "Number theory · Cryptography · A little surprise",
  sceneLabel: "Two friends · One eavesdropper · Everything said out loud",
  sceneName: "Sharing a key in public",
  tip: "Press “Next step” to follow the exchange · Choose paint or clock arithmetic in the panel",
  actionLabel: "Next step",
  canvasLabel: "Alice on the left and Bob on the right, with everything they say out loud in the middle, where Eve is listening.",
  panelEyebrow: "Pick the secrets",
  whyLabel: "Why can’t Eve work it out?",
  nudge: "Follow all three steps with paint, then switch to clock arithmetic and try a bigger clock. Watch how long Eve needs.",
  connection: {
    html: "<strong>Keeping a message safe from noise is one problem; keeping it secret is another.</strong> In Send a picture through a storm, extra bits repair what the noise breaks.",
    label: "Send a picture",
  },
  presets: [
    {
      name: "Mix paint",
      note: "Mixing is easy. Unmixing isn’t.",
      badge: "●",
    },
    {
      name: "A clock of 23",
      note: "The same trick with numbers.",
      badge: "23",
    },
    {
      name: "A bigger clock",
      note: "Eve has to try far more.",
      badge: "9973",
    },
  ],
  people: {
    alice: "Alice",
    bob: "Bob",
    eve: "Eve",
  },
  modes: [
    "Paint",
    "Clock arithmetic",
  ],
  modeLabel: "Show it with",
  paintLabel: (name) => `${name}’s secret colour`,
  colours: [
    "Red",
    "Blue",
    "Green",
    "Orange",
    "Violet",
    "Pink",
  ],
  pickColour: (name, colour) => `${name}’s secret colour: ${colour}`,
  clockLabel: "Size of the clock",
  clockOption: (p) => `${p.toLocaleString(Wonderlattice.lang)} hours`,
  secretLabel: (name) => `${name}’s secret number`,
  secretHint: "Only they know it.",
  labels: {
    public: "Everyone hears",
    secret: "Secret",
    shared: "Shared colour",
    sends: "Sends",
    heard: (name) => `${name}’s mixture`,
    same: "The same!",
    eve: "Eve’s best try",
    clock: (p) => `A clock of ${p.toLocaleString(Wonderlattice.lang)} hours`,
    start: (g) => `Start: ${g}`,
    shouts: "Shouts",
    key: "Key",
    hops: (k) => `${k.toLocaleString(Wonderlattice.lang)} hops`,
    eveTrying: (k, total) =>
      `Eve tries 1, 2, 3, …: ${k.toLocaleString(Wonderlattice.lang)} of up to ${total.toLocaleString(Wonderlattice.lang)}`,
    eveFound: (k) => `Eve found Alice’s secret after ${k.toLocaleString(Wonderlattice.lang)} tries`,
  },
  steps: {
    paint: [
      "Everyone can see the yellow. Alice and Bob each keep a secret colour.",
      "Step 1 of 3: each mixes their secret into the yellow.",
      "Step 2 of 3: they swap the mixtures, in full view.",
      "Step 3 of 3: each adds their own secret again. The same colour on both sides!",
    ],
    clock: [
      (p, g) => `Everyone knows the clock (${p}) and the start (${g}). Alice and Bob each keep a secret number.`,
      "Step 1 of 3: each hops around the clock, multiplying by the start, as many times as their secret.",
      "Step 2 of 3: they shout where they landed.",
      "Step 3 of 3: each hops again from what they heard. The same number on both sides!",
    ],
  },
  readout: {
    hears: "Everyone hears",
    keeps: (name) => `${name} keeps`,
    result: "The result",
    nothingYet: "Nothing has been said yet.",
    paintHeard: "The yellow, and both mixtures.",
    paintResult: "Alice and Bob hold the same colour. Mixing the two mixtures gives Eve too much yellow.",
    clockHeard: (p, g, A, B) => `The clock (${p}), the start (${g}), and the two shouts: ${A} and ${B}.`,
    clockResult: (key) =>
      `Both keys are ${key}. Eve heard everything, but to get the key she must find a secret number by trying.`,
    notYet: "Not yet.",
  },
  announce: {
    same: "Alice and Bob now share the same secret. Eve does not.",
    found: (k) => `Eve found Alice’s secret after ${k} tries.`,
  },
  guests: [
    {
      name: "Pierre de Fermat",
      note: "On a clock with a prime number p of hours, raise any hour to the power p and it comes back to itself.",
    },
    {
      name: "Leonhard Euler",
      note: "I stretched Fermat’s rule to clocks of any size. Two centuries later, arithmetic like it guards secrets.",
    },
  ],
  insight: {
    title: "Why can’t Eve work it out?",
    html: `<p>Everything Alice and Bob say, Eve hears. The trick is a step that is easy to do but very hard to undo. With paint, mixing is easy, and getting a colour back out of a mixture is practically impossible. Each friend adds a secret twice, once before sending and once after receiving, so both end with the same three paints in the pot. Eve only ever sees mixtures that contain one secret each, and mixing those together gives her too much of the shared colour.</p>
<div class="insight-visual">shared + Alice’s secret + Bob’s secret, mixed in any order</div>
<h3>The same trick with numbers</h3>
<p>On a clock of p hours, “multiply by the start g, again and again” is easy: Alice does it a times (her secret) and shouts where she lands, A. Bob does it b times and shouts B. Then Alice hops a times from Bob’s B, and Bob hops b times from Alice’s A. Both land on the same hour, because both did the multiplying a × b times in all.</p>
<p>Eve knows the clock, the start, A and B. To get the key she needs a or b: how many hops lead from the start to A. Nobody knows a fast way to count them for a well-chosen large clock. Here she can only try 1, 2, 3, …, and on a bigger clock that takes far longer.</p>
<h3>What this room leaves out</h3>
<p>The paint is an analogy, and these clocks are tiny. Real systems use numbers hundreds of digits long (or a cousin of this idea on curves), where even the cleverest known methods are hopelessly slow. They also have to check who they are talking to: this trick alone can’t stop someone in the middle from pretending to be Bob. This room shows the idea, not how to secure anything.</p>
<details><summary>The mathematics, if you want it</summary><p>With a prime p and a start g whose powers reach every hour 1 … p − 1 (a primitive root), Alice sends A = g<sup>a</sup> mod p and Bob sends B = g<sup>b</sup> mod p. Then B<sup>a</sup> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> = (g<sup>a</sup>)<sup>b</sup> = A<sup>b</sup> mod p. Finding a from g<sup>a</sup> mod p is the discrete logarithm problem. Whitfield Diffie and Martin Hellman published this exchange in 1976; researchers at the British intelligence agency GCHQ had found it a little earlier, but that stayed secret until 1997. Simon Singh tells the story in <em>The Code Book</em> (1999).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" target="_blank" rel="noopener">Diffie–Hellman key exchange</a><a class="source-link" href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener">Diffie &amp; Hellman, “New directions in cryptography” (1976)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_logarithm" target="_blank" rel="noopener">Discrete logarithm</a></div>`,
  },
});
