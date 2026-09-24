/* Visitor-facing English for the storm room. Other languages: text.<lang>.js (docs/TRANSLATING.md). */
Wonderloom.defineText('storm', 'en', {
  eyebrow: 'CODES · NOISE',
  name: 'A picture in a storm',
  tagline: 'A few clever extra bits let a picture repair itself.',

  title: 'Send a picture through a storm.',
  subtitle: 'Draw a little picture. Send it through the storm. Help it arrive in one piece.',
  field: 'Codes · Information · A little redundancy',
  sceneLabel: 'Noisy channel',
  actionLabel: 'Send again',
  canvasLabel:
    'Your picture on the left travels as bits through a storm that flips some of them, and arrives on the right. ' +
    'Click or drag on your picture to draw. With the keyboard, move with the arrow keys and press Enter to paint.',
  panelEyebrow: 'Protect it',
  whyLabel: 'How can bits fix themselves?',
  nudge:
    'Count the damage with no protection. Then try Hamming’s trick in the same storm. How wild a storm can it take?',
  connection: {
    html: '<strong>Signals that travel.</strong> Here a message survives a noisy journey. In the wave room, two tones travel together and draw a shape you can hear.',
    label: 'Listen to two signals',
  },

  // Canvas labels.
  yours: 'Your picture',
  storm: 'The storm',
  arrived: 'What arrived',

  // The four codes, in the order of the select control.
  codes: ['No protection', 'Say it three times', 'One parity bit', 'Hamming’s trick'],
  codeLabel: 'How to protect it',
  codeHints: [
    'Every bit travels alone.',
    'Three copies of each bit, then a vote.',
    'One check bit per four spots a flip.',
    'Three check bits per four fix a flip.',
  ],
  stormLabel: 'Storm strength',
  stormHint: 'The chance that any one bit flips.',
  pictureLabel: 'Pick a picture, or draw on yours',
  pictures: { heart: 'Heart', smile: 'Smile', invader: 'Alien', blank: 'Clear' },

  // Tips under the canvas: a key to the markings.
  tip: 'Orange: flipped · ○ repaired · ✕ still wrong',
  tipParity: 'Orange: flipped · dashed: known bad · ✕ wrong',

  // Readouts.
  sent: 'Bits sent',
  sentValue: (bits, extra) => `${bits} (+${extra}%)`,
  flipped: 'Flipped by the storm',
  repaired: 'Repaired on arrival',
  knownBad: 'Blocks known bad',
  wrong: 'Pixels still wrong',
  status: (wrong, flips) =>
    !flips ? 'A calm sky' : !wrong ? 'Every pixel arrived' : wrong === 1 ? '1 pixel wrong' : `${wrong} pixels wrong`,
  curveTitle: 'Pixels wrong on average, as the storm grows',
  about: (wrong) => `≈ ${wrong}`,
  curveLabel: (code, wrong) => `${code}: about ${wrong} pixels wrong on average at this storm strength.`,
  calm: 'calm',
  wild: '20%',

  presets: [
    { name: 'No protection', note: 'Every flip hurts.' },
    { name: 'Say it three times', note: 'Safe, but three times the bits.' },
    { name: 'Hamming’s trick', note: 'Almost as safe, far fewer bits.' },
  ],

  guests: [
    {
      name: 'Richard Hamming',
      note: 'Weekend after weekend, errors halted his computer. If it can spot a mistake, he asked, why not fix it?',
    },
  ],

  insight: {
    title: 'How can a message fix itself?',
    html: `<p>Your picture is 64 pixels, so 64 bits of ink or no ink. The storm flips each bit with a small chance. With no protection, every flipped bit is a wrong pixel, and the receiver cannot even tell which ones.</p>
<div class="insight-visual">A few well-chosen extra bits let the receiver find and fix errors it never saw happen.</div>
<h3>Say it three times</h3>
<p>Send every bit three times and let the receiver take a vote. One flip in a triple is outvoted two to one. It works, but it triples the message: 8 extra bits for every 4.</p>
<h3>One parity bit</h3>
<p>Add one bit to each block of four so that the number of 1s is always even. If a single bit flips, the count turns odd and the receiver knows the block is damaged. It cannot tell which bit to fix, and two flips cancel out and hide.</p>
<h3>Hamming’s trick</h3>
<p>Number the seven bits of a block 1 to 7. The bits at 1, 2 and 4 are checks. Each check keeps an even count over the positions whose number, written in binary, contains it: check 1 watches 1, 3, 5, 7; check 2 watches 2, 3, 6, 7; check 4 watches 4, 5, 6, 7. When one bit flips, the checks that fail add up to its position. Checks 1 and 4 failing means position 5. No failure means no flip. So 3 extra bits per 4 repair any single flip in a block.</p>
<h3>Cost and protection</h3>
<p>In a 4% storm, an unprotected picture has about 2.6 wrong pixels on average, three copies about 0.3, and Hamming’s trick about 0.8, with fewer than half the extra bits. The little curve in the panel shows this for every storm strength.</p>
<h3>Where it breaks</h3>
<p>These codes assume each bit flips on its own, and they promise to fix one flip per block. Two flips in one Hamming block send the receiver to the wrong position, and its “repair” makes things worse. Near a 20% storm, Hamming’s trick barely helps; a little beyond, it hurts. Real storms come in bursts, so real systems use longer codes and spread each block’s bits apart.</p>
<details><summary>The mathematics, if you want it</summary><p>For data bits d1 d2 d3 d4 at positions 3, 5, 6, 7, the checks are c1 = d1 ⊕ d2 ⊕ d4, c2 = d1 ⊕ d3 ⊕ d4, c4 = d2 ⊕ d3 ⊕ d4, where ⊕ adds bits without carrying. The receiver XORs together the positions that hold a 1; the result, called the syndrome, is 0 for a clean block and the flipped position otherwise.</p><p>If each bit flips with probability p, a pixel sent alone is wrong with probability p, and a pixel sent three times with probability 3p² − 2p³. The curves add up every possible pattern of flips exactly.</p></details>
<div class="sources"><a class="source-link" href="https://archive.org/details/bstj29-2-147" target="_blank" rel="noopener">Hamming’s 1950 paper</a><a class="source-link" href="https://www.inference.org.uk/mackay/itila/" target="_blank" rel="noopener">MacKay, chapter 1: sending pictures through noise</a></div>`,
  },
});
