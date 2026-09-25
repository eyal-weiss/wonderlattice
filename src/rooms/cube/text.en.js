/* Inside the puzzle cube · visitor-facing words (English). */
Wonderloom.defineText('cube', 'en', {
  eyebrow: 'MOVES · GROUPS',
  name: 'Inside the puzzle cube',
  tagline: 'Two turns in a different order, a move that needs 105 repeats to come home, and pieces that barely budge.',
  title: 'Inside the puzzle cube.',
  subtitle: 'Forget solving it. Play with the moves themselves and see how they combine.',
  field: 'Groups · Order · Undoing',
  sceneLabel: 'A cube of moves',
  tip: 'Drag, or use the arrow keys, to turn the view',
  actionLabel: 'Repeat it',
  actionCompare: 'Turn them',
  canvasLabel: 'A puzzle cube. Use the move buttons to turn its faces; drag or use the arrow keys to turn the view.',
  panelEyebrow: 'Combine moves',
  whyLabel: 'Why does order matter?',
  nudge: 'Try “Back where it started”, then “Repeat until home”. How many repeats do you guess before it gets there?',
  connection: {
    html: '<strong>Rules you can combine and undo.</strong> A cube move is a rule for where every sticker goes. In the Sudoku room, rules about neighbours decide where every colour can go.',
    label: 'Visit Sudoku',
  },

  sceneName: { one: 'One cube', compare: 'Two orders' },
  modes: ['One cube', 'Compare two orders'],
  mode: 'What to explore',
  faces: { U: 'top', R: 'right', F: 'front', D: 'bottom', L: 'left', B: 'back' },
  turn: (face, prime) => `turn the ${face} face ${prime ? 'anticlockwise' : 'clockwise'}`,
  // A move button's name starts with what it shows, so voice control can find it.
  moveLabel: (name, turn) => `${name}: ${turn}`,
  movePad: 'Build a sequence',
  // The spaces around each = (and after ′) are no-break spaces, so each letter stays with its meaning.
  notation: 'U = up, R = right, F = front, D = down, L = left, B = back; ′ turns backwards.',
  undo: 'Undo',
  clear: 'Clear',
  home: 'Repeat until home',
  highlight: 'Show only what moved',
  first: 'First move',
  second: 'Second move',

  sequence: (text) => (text ? text : 'No moves yet: press a face'),
  times: (n) => (n === 1 ? 'done once' : n === 0 ? 'not done yet' : `done ${n} times`),
  order: (n) => (n === 1 ? 'Nothing to undo: it stays home.' : `Comes home after ${n} repeats.`),
  moved: (n) => (n === 0 ? 'Every piece is home.' : n === 1 ? '1 piece out of place.' : `${n} pieces out of place.`),
  status: (n) => (n === 0 ? 'Solved' : `${n} pieces moved`),
  // Said once when a run of repeats has finished.
  landed: (moved, done, order) =>
    (moved === 0 ? 'Solved. ' : `Done ${done === 1 ? 'once' : `${done} times`}. ${moved} pieces moved. `) +
    (order === 1 ? 'It stays home.' : `Comes home after ${order} repeats.`),
  full: 'That’s twelve moves: repeat it, undo, or clear.',
  restarted: 'A new sequence starts from here.',
  compareLabels: (a, b) => [`${a} then ${b}`, `${b} then ${a}`],
  compareSame: 'These two commute: either order makes the same cube.',
  compareDiffer: (n) => `Same two moves, different order: ${n} stickers end up in different places.`,
  compareReady: 'Press “Turn them” to make both moves on each cube.',

  presets: [
    { name: 'Order matters', note: 'Right then top, or top then right?' },
    { name: 'Back where it started', note: 'Keep repeating R U.' },
    { name: 'Only a few pieces move', note: 'R U R′ U′, a commutator.' },
    { name: 'Undo it backwards', note: 'To undo, reverse the order.' },
  ],

  guests: [
    {
      name: 'Évariste Galois',
      note: 'He died at twenty, leaving the beginnings of group theory: the mathematics of combining and undoing.',
    },
  ],

  insight: {
    title: 'Moves you can combine and undo.',
    html: `<p>This cube works like the Rubik’s Cube® puzzle, but here you play with its moves rather than solve it. Think of a cube move as a rule: every sticker goes to a new place. Doing one move after another combines two rules into a new one. Every move can be undone. And doing nothing at all is a move too. Mathematicians call a collection like this a <em>group</em>.</p>
<div class="insight-visual">R then U is not U then R. Order matters.</div>
<h3>Undo in reverse</h3>
<p>To undo “R then U”, you undo the last move first: U′, then R′. Like taking off shoes and socks, the undoing comes in the opposite order.</p>
<h3>Everything comes home</h3>
<p>Repeat any sequence and the cube eventually returns to where it started, because there are only finitely many positions. R U needs 105 repeats. R U R′ U′ needs only 6. No sequence needs more than 1260.</p>
<h3>Moves that barely move</h3>
<p>“Do A, do B, undo A, undo B” is a <em>commutator</em>. If A and B had no effect on each other, it would do nothing at all. Because they overlap only a little, it disturbs just a few pieces: R U R′ U′ moves seven of the twenty-six. Solvers use commutators to fix a few pieces without spoiling the rest.</p>
<details><summary>The mathematics, if you want it</summary><p>Each move is a permutation of the 54 stickers. Combining moves composes permutations. A sequence comes home after the least common multiple of the lengths of its sticker cycles. R U moves stickers around cycles of 3, 7, and 15 places, and the least common multiple of 3, 7, and 15 is 105.</p><p>The cube has 43,252,003,274,489,856,000 positions, and every one of them can be solved in at most 20 moves, a count of face turns proved in 2010 with a great deal of computer time.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Rubik%27s_Cube_group" target="_blank" rel="noopener">The cube’s group of moves</a><a class="source-link" href="https://www.cube20.org/" target="_blank" rel="noopener">God’s number is 20</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Galois/" target="_blank" rel="noopener">Évariste Galois</a></div>`,
  },
});
