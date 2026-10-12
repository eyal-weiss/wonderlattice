/* Fold a dragon · visitor-facing words (English). */
Wonderlattice.defineText('dragon', 'en', {
  eyebrow: 'PAPER FOLDING',
  name: 'Fold a dragon',
  tagline: 'Fold a strip of paper in half again and again, open every crease to a right angle, and out comes a dragon.',
  title: 'Fold a dragon.',
  subtitle:
    'A strip of paper folds in half ten times, then every crease opens to a right angle. Look: it never crosses itself.',
  field: 'Folding · Fractals · Tiling',
  sceneLabel: 'One strip of paper, seen from above',
  sceneName: 'Folding',
  tip: 'The strip stands on its edge, seen from above. Fold it once more, or change the crease angle.',
  actionLabel: 'Fold once more',
  canvasLabel:
    'A coloured strip of paper folds in half again and again, then opens with every crease at a right angle into a curling dragon shape that touches itself at corners but never crosses itself.',
  panelEyebrow: 'Fold and open',
  whyLabel: 'Why a dragon?',
  nudge:
    'Try it with paper: fold a strip in half four times, always the same way, then open every crease to a right angle and stand it on its edge.',
  connection: {
    html: '<strong>Copies that fill the plane.</strong> Four dragons fit together around a point with no gaps. In the tiles room, any tile you bend still covers everything.',
    label: 'Visit “A tile that fills the world”',
  },

  presets: [
    { name: 'Ten folds', note: 'The classic dragon.' },
    { name: 'Four dragons', note: 'Turned about one point, they interlock.' },
    { name: 'Real paper', note: 'Four folds, as a real strip allows.' },
  ],

  folds: 'Folds',
  angle: 'Crease angle',
  four: 'Four dragons',

  // Above the picture. `fold` and `folds` are whole numbers; `layers` and `pieces` arrive already written out (1,024).
  folding: 'Folding',
  opening: 'Opening',
  oneMore: 'One more fold',
  dragon: 'The dragon',
  fourDragons: 'Four dragons',
  foldStatus: (fold, layers) => `Fold ${fold} · ${layers} layers`,
  paperLimit: (fold, layers) => `Fold ${fold} · ${layers} layers, more than paper allows`,
  openStatus: 'Every crease opens to a right angle',
  moreStatus: 'A new crease in every piece, turning left and right in turn',
  rightStatus: (folds, pieces) =>
    `${folds} ${folds === 1 ? 'fold' : 'folds'} · ${pieces} pieces · never crosses itself`,
  fourStatus: (folds) => `${folds} ${folds === 1 ? 'fold' : 'folds'} each · no overlaps, no gaps in the middle`,
  angleStatus: (angle) => `Creases at ${angle}° · at 90° it never crosses`,
  restarted: 'Back to one fold.',

  guests: [
    {
      name: 'Martin Gardner',
      note: 'In 1967 he showed the readers of his Scientific American column the dragon that three NASA physicists had found by folding paper.',
    },
    {
      name: 'Donald Knuth',
      note: 'With Chandler Davis, he worked out in 1970 why the dragon never uses the same edge twice, and why its copies can cover the plane.',
    },
    {
      name: 'Britney Gallivan',
      note: 'In 2002, as a high-school student, she folded a 1.2 km strip of paper in half twelve times, always in the same direction.',
    },
  ],

  insight: {
    title: 'Why does folding make a dragon?',
    html: `<p>Each fold puts a new crease in the middle of every piece of the strip, and because the folds always go the same way, the new creases turn left and right in turn. Open every crease to a right angle and the strip draws a path on a square grid. The path after ten folds has 1,024 pieces, yet it never runs along the same edge twice: it only touches itself at corners. The rounded corners in the picture let you see the two paths pass each other there.</p>
<div class="insight-visual">fold once more → a new crease between every two → the dragon grows twice as long</div>
<h3>Which way each crease turns</h3>
<p>Count the creases from one end. Divide the crease's number by 2 for as long as you can, and look at what's left: if it leaves 1 when divided by 4, the crease turns one way, and if it leaves 3, the other. So the turns go right, right, left, right, right, left, left… This is the regular paperfolding sequence.</p>
<h3>Two dragons in one, and four that fill the plane</h3>
<p>The second half of the strip is the first half, turned by a right angle about the middle crease, so every dragon is made of two smaller dragons, each 1/√2 times the size. Chandler Davis and Donald Knuth studied these curves in 1970 and proved that the folded path never repeats an edge, and that turned copies of it fit together: four dragons that start at one point fill the grid around it with no gaps and no overlaps, and the more folds, the farther out they fill. Measured with its start and end 1 apart, the finished dragon covers an area of exactly ½, and its edge is a fractal of dimension about 1.52.</p>
<h3>Real paper</h3>
<p>Every fold doubles the thickness and halves the length, so a strip of ordinary paper soon turns into a stiff little block: four or five sharp folds are about as many as you can still open neatly, and seven or eight is the usual limit. The room's paper has no thickness. In 2002 Britney Gallivan, a high-school student, worked out how long a strip must be for a given number of folds, then folded 1.2 km of paper twelve times in the same direction. The curve was first found by the NASA physicists John Heighway, Bruce Banks and William Harter, and Martin Gardner wrote about it in 1967.</p>
<details><summary>What the room leaves out</summary><p>The animation turns every crease by the same amount at once and keeps every piece the same length, as if the strip stood on its edge with no thickness. Real creases spring open a little, so a real strip makes a rougher dragon. At crease angles other than 90° the path can cross itself; the room makes no claim there.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dragon_curve" target="_blank" rel="noopener">The dragon curve</a><a class="source-link" href="https://en.wikipedia.org/wiki/Regular_paperfolding_sequence" target="_blank" rel="noopener">The regular paperfolding sequence</a><a class="source-link" href="https://mathworld.wolfram.com/DragonCurve.html" target="_blank" rel="noopener">MathWorld: dragon curve</a><a class="source-link" href="https://www-cs-faculty.stanford.edu/~knuth/fg.html" target="_blank" rel="noopener">C. Davis and D. E. Knuth, “Number representations and dragon curves”, in Knuth’s Selected Papers on Fun and Games</a><a class="source-link" href="https://en.wikipedia.org/wiki/Britney_Gallivan" target="_blank" rel="noopener">Britney Gallivan</a></div>`,
  },
});
