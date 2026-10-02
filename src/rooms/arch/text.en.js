/* Hang it, flip it, build it · visitor-facing words (English). */
Wonderlattice.defineText('arch', 'en', {
  eyebrow: 'CHAINS AND ARCHES',
  name: 'Hang it, flip it, build it',
  tagline:
    'A hanging chain, turned upside down, is an arch of loose stones that stands. A semicircle of the same stones falls.',
  title: 'Hang it, flip it, build it.',
  subtitle:
    'A chain hangs between two pegs. Turned upside down, the same shape stands as an arch of loose stones; beside it, a semicircle of the same stones falls. Hang towers on the chain, or draw your own arch.',
  field: 'Engineering · The catenary · Lines of force',
  sceneLabel: 'A chain and an arch · Loose stones, no mortar',
  sceneName: 'Your own experiment',
  tip: 'Drag a peg · Tap the chain or a stone to add a tower · Drag an arch’s dots, or draw a new arch · Keys: ← → choose, ↑ ↓ change, F flips',
  actionLabel: 'Flip',
  canvasLabel:
    'Two pictures side by side, on the same scale. On the left, a chain hangs between two pegs and swings to rest; then it turns over into an arch of stones with no mortar, and stands. A gold line, the line of force, runs inside every stone. Towers hung on the chain stand on the arch once it is turned over. On the right, an arch of the same stones in another shape, a semicircle at first, is built on a wooden frame. When the frame drops, its line of force leaves the stones, four joints open, and it folds and falls. An arch of your own has nine dots to drag in or out.',
  panelEyebrow: 'Shape the chain',
  whyLabel: 'Why does it stand?',
  nudge:
    'Tap a stone partway up one side of the standing arch, three times, to give it a tower three storeys tall: it falls. Flip it back, and the chain bends to carry the tower. Flip again.',
  connection: {
    html: '<strong>Stones without glue.</strong> Here every stone is held in place by the push of its neighbours. In The leaning tower of blocks, each block balances on the one below.',
    label: 'See the leaning tower',
  },

  presets: [
    { name: 'Hang it, flip it', note: 'The chain’s shape stands; a semicircle falls.' },
    { name: 'A tower on the side', note: 'The chain bends under it, so the arch can carry it.' },
    { name: 'A road to carry', note: 'Under a heavy road the chain becomes a parabola.' },
  ],

  // Lengths: the pegs start 1 m apart.
  cm: ' cm',
  length: 'Length of the chain',
  lengthHint: 'A longer chain hangs deeper, and turns over into a taller arch.',
  thick: 'Thickness of the stones',
  thickHint: 'For both arches. Thick enough, even a semicircle stands.',
  road: 'Hang a road from the chain',
  beside: 'The arch beside it',
  shapes: { semicircle: 'Semicircle', pointed: 'Pointed', flat: 'Flat', own: 'Your own' },
  ownHint: 'Drag its dots in or out, or draw a new arch from one foot to the other.',

  // Numbers arrive already written in the page's language.
  percent: (x) => `${x}%`,
  length_cm: (x) => `${x} cm`,
  readout: {
    hanging: 'Hanging, the chain is pulled tight all along: pure tension.',
    stands: 'Turned over, the same shape stands: pure push.',
    falls: 'Turned over, with these loads, it falls.',
    inside: (share) => `Its line of force stays ${share} of the stones’ thickness inside.`,
    outside: (share) => `No line of force fits: the best one leaves the stones by ${share} of their thickness.`,
    beside: (name, stands) => `${name} of the same stones ${stands ? 'stands' : 'falls'}.`,
    thinnest: (cm) => `It stands with stones down to ${cm} thick.`,
    thickest: (cm) => `It would stand with stones at least ${cm} thick.`,
    never: (cm) => `Not even stones ${cm} thick would hold it.`,
    any: 'It stands with stones of any thickness.',
    working: 'Working out how thick its stones must be…',
  },
  status: {
    hanging: 'The chain hangs',
    stands: 'Turned over, it stands',
    falls: 'Turned over, it falls',
    beside: (name, stands) => `${name}: ${stands ? 'stands' : 'falls'}`,
  },

  // Words drawn on the canvas.
  labels: {
    chain: 'A hanging chain',
    arch: 'The chain, turned over',
    stands: 'It stands',
    falls: 'It falls',
    building: 'On its wooden frame',
    semicircle: 'A semicircle',
    pointed: 'A pointed arch',
    flat: 'A flat arch',
    own: 'Your own arch',
    force: 'Line of force',
    parabola: 'Parabola',
    catenary: 'Catenary',
    drawing: 'Draw from one foot to the other',
    gallery: 'The same stones in other shapes · Tap one to test it',
    thinnest: (cm) => `Thinnest stones: ${cm}`,
    never: (cm) => `Not even ${cm} stones`,
    any: 'Stones of any thickness',
    chartTitle: 'How thin can the stones be?',
    chainShape: 'The chain’s shape',
    yours: (cm) => `Your stones: ${cm}`,
  },

  announce: {
    stands: 'The chain, turned over, stands as an arch.',
    falls: 'With these loads, the arch falls.',
    hanging: 'The chain hangs from its pegs.',
    beside: (name, stands) => `${name} of the same stones ${stands ? 'stands' : 'falls'}.`,
    towers: (stone, storeys) =>
      storeys === 0
        ? `Stone ${stone}: no tower.`
        : `Stone ${stone}: a tower ${storeys} storey${storeys === 1 ? '' : 's'} tall.`,
    peg: (side) =>
      side === 0
        ? 'The left peg: the up and down arrows move it, A and D move it sideways.'
        : 'The right peg: the up and down arrows move it, A and D move it sideways.',
    dot: (n) => `Dot ${n} of 9 of the arch beside it: the up and down arrows move it out and in.`,
  },

  guests: [
    {
      name: 'Robert Hooke',
      note: 'In 1675 he hid his rule for arches in a scramble of Latin letters. Unscrambled after his death, it says that a hanging chain, turned over, gives the shape of an arch that stands.',
    },
    {
      name: 'Galileo Galilei',
      note: 'In 1638 he wrote that a hanging chain is close to a parabola, and closer the less it sags. It is close, but it is a different curve.',
    },
    {
      name: 'Antoni Gaudí',
      note: 'For the crypt of a church at Colònia Güell, he hung ropes weighted with little sacks of lead shot, photographed them, and turned the photographs upside down to draw the vaults.',
    },
  ],

  insight: {
    title: 'Why does the chain’s shape stand?',
    html: `<p>A hanging chain can only pull: each link tugs on the next, along the chain. Its shape is the one where those pulls balance the weight of every link. Turn the picture upside down and every force turns round with it: the pulls become pushes, along the same line, and they balance the same weights. That is an arch whose stones only press on each other, with nothing trying to bend them apart.</p>
<p>Robert Hooke saw this in the 1670s, and in 1675 published it as a puzzle, a scramble of Latin letters. After his death it was read as <em>ut pendet continuum flexile, sic stabit contiguum rigidum inversum</em>: as hangs the flexible line, so, turned over, stand the touching pieces of an arch.</p>
<div class="insight-visual">hanging chain: pure tension · the same shape upside down: pure compression</div>
<h3>The line of force</h3>
<p>Every arch has to pass its weight, stone by stone, down to its feet. The push from one stone to the next can be drawn as a line, the line of force (engineers call it the line of thrust). It has the shape a chain would hang in under the same weights, turned over. If such a line can be drawn inside the stones at every joint, the arch can stand: this is Jacques Heyman’s safe theorem (1966), for stones that can’t pull, can’t be crushed and don’t slide. Where the line touches the edge of a joint, the joint can open like a hinge; with enough hinges, the arch moves, and falls. The gold line is the one that keeps furthest inside.</p>
<p>For the chain’s own shape, the line runs down the middle of every stone, which is why it stands however thin the stones are. A semicircle bulges out further on each side than the hanging shape, so its line of force, which follows a hanging shape, runs along the top of the stones at the crown and cuts through their inner edge partway down each side. With thin stones there is no room for it. Then four joints open like hinges, and the three pieces between them fold and fall. A semicircle stands only if its stones are at least about a tenth of its radius thick; Milutin Milankovitch worked out the exact figure in 1907, 10.75% for a smooth arch. The room’s arch of 21 stones needs 10.67%: stones 5.3 cm thick, for an arch 1 m wide.</p>
<h3>Change the loads, change the shape</h3>
<p>A tower on one side bends the hanging chain, and the turned-over chain carries the tower. But put the same tower on an arch made without it, and the line of force moves: a tall enough tower brings that arch down. Wind, crowds and traffic change the loads too, which is one reason real arches are thicker than their own weight alone needs.</p>
<p>A heavy road hung from a light chain pulls it down evenly along the level, not along the chain, and the chain becomes a parabola: the shape of a suspension bridge’s cable. Turned over, it is a bridge whose arch holds up its road. For a shallow chain the parabola and the catenary are hard to tell apart; tick the road to see both. The Gateway Arch in St. Louis is a weighted catenary: its legs are thicker at the base, so the curve is the hanging shape of a chain with heavier links at its ends.</p>
<details><summary>The mathematics, if you want it</summary><p>A chain of the same weight all along hangs as a catenary, y = a cosh(x / a), where a is the horizontal pull divided by the weight per unit length. Jacob Bernoulli set the problem as a challenge, and in June 1691 the answers of Gottfried Leibniz, Christiaan Huygens and Johann Bernoulli were printed together in the Acta Eruditorum. Earlier, in 1638, Galileo had written that a hanging chain is close to a parabola; Joachim Jungius proved it isn’t one, published in 1669. A load spread evenly along the level instead gives y = kx², a parabola.</p>
<p>The room’s chain is 41 beads on 42 links. Its resting shape is solved exactly, by Newton’s method on the pulls at one peg, and the moving chain (Verlet steps, each link pulled back to its length) settles onto it. Each stone of the turned-over arch is two links long, with its own weight at its centre of mass. A line of force is set by three numbers, the horizontal push and where and how steeply it leaves the first joint; the room searches for the one that stays furthest inside the stones. When none fits, it tries every choice of four joints and corners as hinges, keeps those where every hinge opens and the weights go down, and lets the fastest fall play out as a linkage of three pieces, until a stone reaches the ground.</p>
<p>The room’s tests check, against a separate computation, that the resting chain is within 0.02% of the span of a catenary, that the chain’s arch stands with stones 1 cm thick, and that the semicircle needs 5.3 cm and the pointed arch 3.5 cm. They also check that the room’s two ways of asking, whether a line of force fits and whether four hinges can fall, always agree.</p></details>
<h3>What the room leaves out</h3>
<p>The stones are perfectly rigid and never slide, the ground and the pegs never move, and the arch has no fill above it. Real stones are held by friction, real mortar can pull a little, and real feet can spread, which brings down arches that would otherwise stand. The fall is a cartoon of a real collapse: it follows the first motion of the stones, and stops when one touches the ground.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Catenary (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary_arch" target="_blank" rel="noopener">Catenary arch (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Line_of_thrust" target="_blank" rel="noopener">Line of thrust (Wikipedia)</a><a class="source-link" href="https://www.gf.uns.ac.rs/~zbornik/doc/NS2016.018.pdf" target="_blank" rel="noopener">Nikolić, Milankovitch’s theory of the thrust line (2016)</a><a class="source-link" href="https://talks.cam.ac.uk/talk/index/47582/" target="_blank" rel="noopener">Makris, the minimum thickness of semicircular arches (2013)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Col%C3%B2nia_G%C3%BCell" target="_blank" rel="noopener">Colònia Güell (Wikipedia)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gateway_Arch" target="_blank" rel="noopener">Gateway Arch (Wikipedia)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Hooke/" target="_blank" rel="noopener">Robert Hooke (MacTutor)</a></div>`,
  },
});
