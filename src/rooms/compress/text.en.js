/* How much picture can you throw away? · visitor-facing words (English). */
Wonderlattice.defineText('compress', 'en', {
  eyebrow: 'COMPRESSION',
  name: 'How much picture can you throw away?',
  tagline: 'Throw away 90% of a picture’s numbers and you can barely tell. Throw away the wrong 10% and it’s ruined.',

  title: 'How much picture can you throw away?',
  subtitle: 'A picture is a list of numbers. Keep only some of them, and see what survives.',
  field: 'Signals · Building blocks · A little surprise',
  sceneLabel: '64 blocks · 64 numbers each',
  actionLabel: 'Swap strongest and weakest',
  canvasLabel:
    'On the left, your picture. In the middle, the picture rebuilt from only the numbers kept. On the right, the 64 ' +
    'building blocks, brighter where more of the picture uses them. Drag on your picture to draw on it. With the ' +
    'keyboard, move with the arrow keys and press Enter to paint.',
  tip: 'Drag on your picture to draw · Arrow keys and Enter paint too',
  panelEyebrow: 'Choose what to keep',
  whyLabel: 'How can most of a picture be missing?',
  nudge:
    'Keep only the strongest 10%: can you tell? Now swap to the weakest, and keep 90% of the numbers. What happened?',
  connection: {
    html: '<strong>Bits lost by accident, or on purpose.</strong> Here we throw numbers away and hardly notice. In “Send a picture through a storm”, a few clever extra bits stop a storm from ruining a picture.',
    label: 'Visit “Send a picture through a storm”',
  },

  // Canvas labels.
  yours: 'Your picture',
  survives: 'What survives',
  blocks: 'The building blocks',
  broad: 'broad washes',
  fine: 'fine ripples',

  pictureLabel: 'Pick a picture, or draw on yours',
  pictures: { sunset: 'Sunset', face: 'Face', checks: 'Checks', rings: 'Rings' },
  modeLabel: 'Which numbers to keep',
  modes: ['The strongest', 'The weakest'],
  modeHints: [
    'The biggest numbers, whichever blocks they belong to.',
    'The smallest numbers; the biggest are thrown away.',
  ],
  keepLabel: 'How many numbers to keep',
  keepHint: 'Out of 4,096: 64 blocks of 8 × 8 pixels, each written as 64 numbers.',

  // Readouts.
  kept: 'Numbers kept',
  keptValue: (count, share) => `${count.toLocaleString(Wonderlattice.lang)} of 4,096 (${share}%)`,
  energy: 'Share of the picture’s energy kept',
  energyValue: (share) => `${share}%`,
  difference: 'Difference from your picture',
  differenceValue: (share) => `${share}%`,
  verdicts: ['Hard to tell apart', 'A little soft', 'Blurry', 'Ruined'],
  status: (verdict, share) => `${verdict} · ${share}% of the numbers`,
  announce: (verdict, share, difference) => `${verdict}: ${share}% of the numbers kept, ${difference}% different.`,
  yourPicture: 'Your own picture',

  presets: [
    { name: 'The strongest 10%', note: 'Can you tell?', badge: '10%' },
    { name: 'Throw away the strongest 10%', note: '90% of the numbers, ruined.', badge: '90%' },
    { name: 'Just 2%', note: 'Broad washes only.', badge: '2%' },
  ],

  guests: [
    {
      name: 'Joseph Fourier',
      note: 'Studying how heat spreads, he claimed any curve could be built from waves. Pictures can too.',
    },
    {
      name: 'Nasir Ahmed',
      note: 'He proposed the cosine transform in the early 1970s. Almost every photo on the web is stored with it.',
    },
  ],

  insight: {
    title: 'How can most of a picture be missing?',
    html: `<p>To a computer, this picture is 4,096 numbers: one brightness for each pixel. Cut it into blocks of 8 × 8 pixels, and each block can also be written as a recipe: how much of each of 64 fixed patterns to add together. The patterns run from a flat wash (the block’s average) to finer and finer ripples. The recipe has 64 numbers too, and it rebuilds the block exactly. Nothing is lost yet.</p>
<div class="insight-visual">64 pixels ⇄ 64 amounts of 64 building blocks</div>
<h3>Why most numbers hardly matter</h3>
<p>In most pictures, neighbouring pixels are alike, so a block is mostly its average plus a few gentle waves. Nearly all of the picture’s energy lands in a few big numbers, and the rest are tiny. Keep the big ones, set the rest to zero, and the rebuilt picture looks almost the same. That is the idea behind JPEG.</p>
<h3>Why the wrong 10% ruins it</h3>
<p>Throw away the biggest numbers instead, even if you keep 90% of the rest, and what’s left is dust: the averages and main shapes are gone. How many numbers you keep matters much less than which ones.</p>
<h3>Why edges are expensive</h3>
<p>A sharp edge or fine stripes are made of many ripples at once, so “Checks” and “Rings” need far more numbers than “Sunset” for the same quality. Throwing too many away leaves blocky squares and faint echoes beside edges, the marks of an over-compressed photo.</p>
<h3>What this room leaves out</h3>
<p>Real JPEG also separates brightness from colour and stores colour more coarsely, rounds every number to a step size set by a table (bigger steps for finer ripples, which the eye notices less), and packs the result with clever coding. Here we keep simply the biggest numbers across the whole picture, and don’t round. The building blocks and the surprise are the same.</p>
<details><summary>The mathematics, if you want it</summary><p>Each block uses the two-dimensional discrete cosine transform (DCT-II): the amount of pattern (u, v) is the sum over the block of the pixel values times C(u, y)·C(v, x), where C(k, n) = a(k)·cos((2n + 1)kπ / 16), with a(0) = √(1/8) and a(k) = √(2/8) otherwise. These 64 patterns are orthonormal, so the inverse transform uses the same table, and the sum of the squares of the numbers equals the sum of the squares of the pixels. So “energy kept” is exactly the share of that sum held by the numbers you keep. The difference shown is the root-mean-square difference in brightness, as a share of full white.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_cosine_transform" target="_blank" rel="noopener">Discrete cosine transform (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/JPEG" target="_blank" rel="noopener">JPEG (Wikipedia)</a><a class="source-link" href="https://doi.org/10.1145/103085.103089" target="_blank" rel="noopener">Wallace, “The JPEG still picture compression standard”, Communications of the ACM 34 (1991)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Fourier/" target="_blank" rel="noopener">Joseph Fourier (MacTutor)</a></div>`,
  },
});
