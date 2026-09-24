/* Visitor-facing words for Sudoku, made transparent (English). See docs/TRANSLATING.md. */
(() => {
  'use strict';

  /** Capitalize the first letter of a sentence that starts with a symbol name. */
  const cap = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  Wonderloom.defineText('sudoku', 'en', {
    eyebrow: 'LOGIC · GRAPHS',
    name: 'Sudoku, made transparent',
    tagline: 'A number puzzle where the numbers never mattered.',
    title: 'Sudoku, made transparent.',
    subtitle: 'Place a color and watch the possibilities around it quietly disappear.',
    field: 'Logic · Graph coloring · Latin squares',
    sceneLabel: 'Sixteen squares',
    tip: 'Keys 1–4 place · arrows move · Backspace clears',
    actionLabel: 'Take one logical step',
    canvasLabel: 'A four by four Sudoku board. Arrow keys move, keys 1 to 4 place a symbol, Backspace clears.',
    panelEyebrow: 'Place, undo, look again',
    whyLabel: 'Why is this about coloring?',
    nudge:
      'Place one color and watch its dots fade along its row, column, and box. Then take a logical step. Do you agree with its reason?',
    connection: {
      html: '<strong>Another network of neighbors.</strong> Here each square limits the squares it is linked to. In the city crossing, each driver’s choice changes everyone’s journey.',
      label: 'Visit the tempting shortcut',
    },

    presets: [
      { name: 'A gentle start', note: 'Eight clues. One step leads to the next.' },
      { name: 'Only one way', note: 'Just four clues, yet a single answer.' },
      { name: 'Two answers', note: 'Six clues, and room for two finishes.' },
    ],

    // Symbol styles. Each name is used inside the sentences below.
    styles: ['Colors', 'Shapes', 'Digits'],
    styleHint: 'Same puzzle, new labels. Only the rules matter.',
    styleLabel: 'Symbols',
    symbolWord: ['color', 'shape', 'digit'],
    symbolNames: [
      ['blue', 'orange', 'pink', 'green'],
      ['the circle', 'the square', 'the triangle', 'the diamond'],
      ['1', '2', '3', '4'],
    ],
    unitNames: { row: 'row', col: 'column', box: 'box' },

    // Controls and readouts.
    placeLabel: 'Place in the chosen square',
    placeButton: (name) => `Place ${name}`,
    clash: 'clashes here',
    undo: 'Undo',
    clear: 'Clear square',
    network: 'Show the network',
    filled: 'Filled',
    candidatesLeft: 'Candidates',
    waysToFinish: 'Answers',
    none: 'none',
    twoFinishes: 'The solver found both finishes. They differ only in the outlined squares.',
    answerLabel: (n) => `Finish ${n}`,
    status: (filled) => `${filled} of 16 filled`,
    networkCaption: '16 squares · 56 links · linked squares never match',

    // One short line under the board after each move.
    start: (word) => `Tap an empty square, then pick a ${word}.`,
    placed: (name, n) =>
      n === 0
        ? `${cap(name)} placed. Nothing nearby needed to change.`
        : `${cap(name)} placed. It can no longer go in ${n} ${n === 1 ? 'square' : 'squares'} nearby.`,
    clashed: (name) => `Two neighbors now both hold ${name}. Undo, or try another.`,
    given: 'This one came with the puzzle. Try an empty square.',
    cleared: 'Cleared. Its possibilities come back.',
    undone: 'Stepped back.',
    naked: (name) => `Only ${name} fits here: its row, column, and box hold the other three.`,
    hidden: (name, unit) => `In this ${unit}, ${name} has only one place left.`,
    stuckTwo: 'Nothing is forced now. The outlined squares can swap, and both finishes work.',
    stuckOne: 'No single step is forced here. Try a guess, and undo if it goes astray.',
    stuckNone: 'This board can’t be finished any more. Undo a step or two.',
    clashFirst: 'Two neighbors share a symbol. Undo or clear one of the glowing squares first.',
    solved: (word) => `Complete. Every row, column, and box holds each ${word} once.`,
    fresh: 'A fresh board.',

    /** What a screen reader hears about the chosen square. */
    describe: (row, col, content) => `Row ${row}, column ${col}: ${content}.`,
    holds: (name, given) => (given ? `${name}, a clue` : name),
    emptyWith: (names) => `empty, could be ${names.join(' or ')}`,
    emptyNone: 'empty, nothing fits',

    guest: {
      name: 'Leonhard Euler',
      note: 'A finished Sudoku is a Latin square plus a rule for boxes. My 36 officers needed two Latin squares at once, which proved impossible.',
    },

    insight: {
      title: 'Why is Sudoku about coloring?',
      html: `<p>Nothing in Sudoku needs numbers. The only rule is that two squares in the same row, column, or box must differ. Colors, shapes, or digits all work the same way, which is why switching the symbols never changes the puzzle.</p>
<div class="insight-visual">A Sudoku is a map to color. Every square has seven neighbors on this board, and it must differ from all of them.</div>
<h3>Constraints</h3>
<p>Each square belongs to one row, one column, and one box. Those groups overlap, so a single placement reaches far: it removes one possibility from up to seven other squares at once. The fading dots show exactly which ones.</p>
<h3>Candidates and singles</h3>
<p>The little dots in an empty square are its candidates: the symbols none of its neighbors hold yet. When only one dot is left, that square is forced (a “naked single”). When a symbol has only one possible square left in some row, column, or box, it must go there (a “hidden single”). “Take one logical step” uses just these two ideas, and it always shows you why.</p>
<h3>A graph to color</h3>
<p>Turn on the network. Each square becomes a dot, and a line joins two dots whenever their squares share a row, column, or box: 16 dots and 56 lines. Filling the board is the same as giving each dot one of four colors so that no line joins two dots of the same color, much like coloring a map so that neighboring countries differ. Mathematicians call that a proper coloring of a graph.</p>
<h3>Why a good puzzle has exactly one answer</h3>
<p>Clues are a coloring that has already begun. A well-made puzzle has just enough clues that only one way to finish remains, so every step can be reasoned rather than guessed. On a 4×4 board, four clues are the fewest that can do it. With fewer, some choice is always left open. “Two answers” has six clues, but four squares form a rectangle whose two colors can swap, and the solver finds both finishes.</p>
<h3>The full-size puzzle</h3>
<p>A newspaper Sudoku is the same idea at a larger scale: 81 squares, each with 20 neighbors, 810 lines, and nine colors. There are 288 finished 4×4 grids, but about 6.7 × 10<sup>21</sup> finished 9×9 grids. The fewest clues that can give a 9×9 puzzle a single answer is 17, a fact settled by a large computer search.</p>
<h3>Latin squares</h3>
<p>A grid where every symbol appears once in each row and each column is called a Latin square. Leonhard Euler studied them, including his puzzle of 36 officers: six ranks and six regiments, arranged so that each row and each column holds every rank and every regiment once. Every finished Sudoku is a Latin square with one extra rule for its boxes.</p>
<details><summary>What this room does, and what it leaves out</summary><p>The candidates here use only direct elimination: a symbol is ruled out when a neighbor already holds it. The logical step knows two kinds of deduction, naked and hidden singles; harder puzzles need more. The count of ways to finish comes from a small backtracking search. It tries each possibility in the most constrained empty square and stops once it has found two finishes. Herzberg and Murty count the ways to extend a partial coloring with a chromatic polynomial: a puzzle has a unique solution exactly when that count is 1. This room only needs to tell none, one, and two apart.</p></details>
<div class="sources"><a class="source-link" href="https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf" target="_blank" rel="noopener">Sudoku Squares and Chromatic Polynomials (Herzberg &amp; Murty)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku" target="_blank" rel="noopener">Mathematics of Sudoku</a><a class="source-link" href="https://en.wikipedia.org/wiki/Thirty-six_officers_problem" target="_blank" rel="noopener">Euler’s 36 officers</a></div>`,
    },
  });
})();
