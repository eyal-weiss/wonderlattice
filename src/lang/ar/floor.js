Wonderlattice.defineText('floor', 'ar', {
  eyebrow: "INVARIANTS",
  name: "The impossible floor",
  tagline: "Two missing corners, and no way to tile the floor. One glance at the colours proves it.",
  title: "The impossible floor.",
  subtitle: "Cover the floor with dominoes, two squares each. Then find out why some floors can never be finished.",
  field: "Puzzles · Invariants · Proof by colouring",
  sceneLabel: "Eight by eight · Dominoes · A hidden pattern",
  tip: "Tap two neighbouring squares to lay a domino, or drag across them · Arrow keys move, Enter taps",
  actionLabel: "Look at the colours",
  canvasLabel: "A floor of eight by eight squares with some removed, to be covered with dominoes that each cover two neighbouring squares.",
  panelEyebrow: "Try to finish the floor",
  whyLabel: "Why can’t it be done?",
  nudge: "Try to cover the floor with the two corners gone. When you get stuck, press “Look at the colours” and count.",
  connection: {
    html: "<strong>One simple rule decides everything.</strong> Here every domino covers one light and one dark square; in Sudoku every row holds each symbol once.",
    label: "See Sudoku as a network",
  },
  presets: [
    {
      name: "Two corners gone",
      note: "Opposite corners of a chessboard.",
    },
    {
      name: "One of each colour",
      note: "Always possible. Why?",
    },
    {
      name: "Balanced but stuck",
      note: "The count is fine, yet…",
    },
    {
      name: "A whole floor",
      note: "Remove any squares you like.",
    },
  ],
  modeLabel: "What a tap does",
  modes: [
    "Lay dominoes",
    "Remove squares",
  ],
  colours: "Show the colours",
  solve: "Show a tiling",
  clearDominoes: "Lift every domino",
  yourFloor: "Your own floor",
  byColour: "Left, by colour",
  squaresLeft: "Squares left",
  dominoes: "Dominoes laid",
  light: "light",
  dark: "dark",
  countLine: (light, dark) => `${light} light · ${dark} dark`,
  status: (laid, left) => (left ? `${laid} laid · ${left} squares left` : `Covered with ${laid} dominoes`),
  verdict: {
    start: "Lay dominoes on the floor, or press “Show a tiling”.",
    covered: (n) => `Covered: ${n} dominoes, every square used.`,
    tiled: (n) => `Here is one way: ${n} dominoes cover the whole floor.`,
    fresh: "Your dominoes were in the way, so here is a covering from the start.",
    colours: (light, dark) =>
      `Impossible: ${light} light squares and ${dark} dark ones are left, and every domino covers one of each.`,
    stuck: (n) =>
      n === 1
        ? 'Impossible, though the colours balance: one square has no free neighbour to share a domino with.'
        : n
          ? `Impossible, though the colours balance: a patch of ${n} squares is cut off, and its colours don’t balance.`
          : 'Impossible, though the colours balance: the squares can’t all be paired with a neighbour.',
    oddSquares: "An odd number of squares can never be covered by dominoes.",
  },
  squareLabel: (row, col, what) => `Row ${row}, column ${col}: ${what}`,
  what: {
    free: "empty",
    hole: "removed",
    domino: "covered by a domino",
  },
  guests: [
    {
      name: "Martin Gardner",
      note: "He brought this puzzle to millions of readers, and the colours were the twist nobody saw coming.",
    },
    {
      name: "Ralph Gomory",
      note: "He showed that removing one light and one dark square always leaves a floor that can be tiled.",
    },
  ],
  insight: {
    title: "Why can’t the floor be tiled?",
    html: `<p>Colour the floor like a chessboard. Every domino, wherever you put it, covers two neighbouring squares, and neighbouring squares always have different colours. So each domino covers exactly one light square and one dark one, and a finished floor must have as many light squares as dark ones.</p>
<div class="insight-visual">one domino = one light + one dark</div>
<p>Opposite corners of a chessboard have the same colour. Remove them and 30 light squares are left with 32 dark ones: no arrangement of dominoes can ever work, and we know it without trying a single one. A property that never changes, like “light minus dark” for the squares a set of dominoes covers, is called an <em>invariant</em>. Invariants are one of mathematics’ favourite ways to prove that something is impossible.</p>
<h3>One of each colour: always possible</h3>
<p>Ralph Gomory showed that if you remove one light square and one dark square from a full chessboard, the rest can always be tiled. Draw a closed path that visits every square once, like a snake folded over the board. Removing two squares of different colours cuts the path into pieces of even length, and each piece can be laid with dominoes along the path.</p>
<h3>Balanced isn’t enough</h3>
<p>Equal numbers of light and dark squares are <em>necessary</em>, but not <em>sufficient</em>. Cut off a corner square by removing its two neighbours, and it can never be covered, even if the count still balances. Deciding whether any floor can be tiled means pairing each light square with a dark neighbour, which is a matching problem. “Show a tiling” solves it by trying pairings and repairing them when they clash.</p>
<details><summary>The mathematics, if you want it</summary><p>Think of the free squares as a network where neighbours are linked. Every link joins a light square to a dark one, so the network is <em>bipartite</em>, and a tiling is a <em>perfect matching</em>: a set of links that uses every square exactly once. The room finds one with augmenting paths (Kuhn’s algorithm), and when there is none, it looks for a connected patch whose colours don’t balance. The puzzle was posed by Max Black in 1946 and made famous by Martin Gardner in <em>Scientific American</em>; Gomory’s theorem is the classic answer to the version with one square of each colour removed.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Mutilated_chessboard_problem" target="_blank" rel="noopener">The mutilated chessboard problem (with Gomory’s theorem)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Domino_tiling" target="_blank" rel="noopener">Domino tiling</a></div>`,
  },
});
