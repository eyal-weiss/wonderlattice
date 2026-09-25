/* Visitor-facing words for Sudoku, made transparent (English). See docs/TRANSLATING.md. */
(() => {
  'use strict';

  Wonderlattice.defineText('sudoku', 'en', {
    eyebrow: 'LOGIC · GRAPHS',
    name: 'Sudoku, made transparent',
    tagline: 'A number puzzle where the numbers never mattered.',
    title: 'Sudoku, made transparent.',
    subtitle: 'Place a colour and watch the possibilities around it quietly disappear.',
    field: 'Logic · Graph colouring · Latin squares',
    sceneLabel: 'Sixteen squares',
    tip: 'Tab to the board · arrows move · keys 1–4 place · Backspace clears · Ctrl+Z undoes',
    actionLabel: 'Take one logical step',
    canvasLabel:
      'A four by four Sudoku board. Each empty square shows the symbols that can still go there. The board of squares over this picture can be played with the keyboard.',
    boardLabel: 'Sudoku board, four by four',
    panelEyebrow: 'Place, undo, look again',
    whyLabel: 'Why is this about colouring?',
    nudge:
      'Place one colour and watch its little marks fade along its row, column, and box. Then take a logical step. Do you agree with its reason?',
    connection: {
      html: '<strong>Another network of neighbours.</strong> Here each square limits the squares it is linked to. In the city crossing, each driver’s choice changes everyone’s journey.',
      label: 'Visit the tempting shortcut',
    },

    presets: [
      { name: 'A gentle start', note: 'Eight clues. One step leads to the next.' },
      { name: 'Only one way', note: 'Just four clues, yet a single answer.' },
      { name: 'Two answers', note: 'Six clues, and room for two finishes.' },
    ],

    // Symbol styles. Each name is used inside the sentences below.
    styles: ['Colours', 'Shapes', 'Digits'],
    styleHint: 'Same puzzle, new labels. Only the rules matter.',
    styleLabel: 'Symbols',
    symbolWord: ['colour', 'shape', 'digit'],
    symbolNames: [
      ['blue', 'orange', 'pink', 'green'],
      ['the circle', 'the square', 'the triangle', 'the diamond'],
      ['1', '2', '3', '4'],
    ],
    unitNames: { row: 'row', col: 'column', box: 'box' },

    // Controls and readouts.
    placeLabel: 'Place in the chosen square',
    placeButton: (name) => `Place ${name}`,
    faded: (word) => `Faded ${word}s can’t go here.`,
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
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} placed. Nothing nearby needed to change.`
        : `${name.charAt(0).toUpperCase() + name.slice(1)} placed. It can no longer go in ${n} ${n === 1 ? 'square' : 'squares'} nearby.`,
    clashed: (name) => `Two neighbours now both hold ${name}. Undo, or try another.`,
    given: 'This one came with the puzzle. Try an empty square.',
    cleared: 'Cleared. Its possibilities come back.',
    undone: 'Stepped back.',
    naked: (name) => `Only ${name} fits here: its row, column, and box hold the other three.`,
    hidden: (name, unit) => `In this ${unit}, ${name} has only one place left.`,
    stuckTwo: 'Nothing is forced now. The outlined squares can swap, and both finishes work.',
    stuckOne: 'No single step is forced here. Try a guess, and undo if it goes astray.',
    stuckNone: 'This board can’t be finished any more. Undo a step or two.',
    clashFirst: 'Two neighbours share a symbol. Undo or clear one of the glowing squares first.',
    solved: (word) => `Complete. Every row, column, and box holds each ${word} once.`,
    fresh: 'A fresh board.',

    /** What a screen reader hears about the chosen square. */
    describe: (row, col, content) => `Row ${row}, column ${col}, ${content}`,
    holds: (name, given) => (given ? `${name}, a clue` : name),
    emptyWith: (names) => `empty, could be ${names.join(' or ')}`,
    emptyNone: 'empty, nothing fits',

    guest: {
      name: 'Leonhard Euler',
      note: 'A finished Sudoku is a Latin square plus a rule for boxes. My 36 officers needed two Latin squares at once, which proved impossible.',
    },

    insight: {
      title: 'Why is Sudoku about colouring?',
      html: `<p>Nothing in Sudoku needs numbers. The only rule is that two squares in the same row, column, or box must differ. Colours, shapes, or digits all work the same way, which is why switching the symbols never changes the puzzle.</p>
<div class="insight-visual">A Sudoku is a map to colour. Every square has seven neighbours on this board, and it must differ from all of them.</div>
<h3>Constraints</h3>
<p>Each square belongs to one row, one column, and one box. Those groups overlap, so a single placement reaches far: it removes one possibility from up to seven other squares at once. The fading marks show exactly which ones.</p>
<h3>Candidates and singles</h3>
<p>The little marks in an empty square are its candidates: the symbols none of its neighbours hold yet. When only one mark is left, that square is forced (a “naked single”). When a symbol has only one possible square left in some row, column, or box, it must go there (a “hidden single”). “Take one logical step” uses just these two ideas, and it always shows you why.</p>
<h3>A graph to colour</h3>
<p>Turn on the network. Each square becomes a dot, and a line joins two dots whenever their squares share a row, column, or box: 16 dots and 56 lines. Filling the board is the same as giving each dot one of four colours so that no line joins two dots of the same colour, much like colouring a map so that neighbouring countries differ. Mathematicians call that a proper colouring of a graph.</p>
<h3>Why a good puzzle has exactly one answer</h3>
<p>Clues are a colouring that has already begun. A well-made puzzle has just enough clues that only one way to finish remains, so every step can be reasoned rather than guessed. On a 4×4 board, four clues are the fewest that can do it. With fewer, some choice is always left open. “Two answers” has six clues, but four squares form a rectangle whose two colours can swap, and the solver finds both finishes.</p>
<h3>The full-size puzzle</h3>
<p>A newspaper Sudoku is the same idea at a larger scale: 81 squares, each with 20 neighbours, 810 lines, and nine colours. There are 288 finished 4×4 grids, but about 6.7 × 10<sup>21</sup> finished 9×9 grids. The fewest clues that can give a 9×9 puzzle a single answer is 17, a fact settled by a large computer search.</p>
<h3>Latin squares</h3>
<p>A grid where every symbol appears once in each row and each column is called a Latin square. Leonhard Euler studied them, including his puzzle of 36 officers: six ranks and six regiments, arranged so that each row and each column holds every rank and every regiment once. Every finished Sudoku is a Latin square with one extra rule for its boxes.</p>
<details><summary>What this room does, and what it leaves out</summary><p>The candidates here use only direct elimination: a symbol is ruled out when a neighbour already holds it. The logical step knows two kinds of deduction, naked and hidden singles; harder puzzles need more. The count of ways to finish comes from a small backtracking search. It tries each possibility in the most constrained empty square and stops once it has found two finishes. Herzberg and Murty count the ways to extend a partial colouring with a chromatic polynomial: a puzzle has a unique solution exactly when that count is 1. This room only needs to tell none, one, and two apart.</p></details>
<div class="sources"><a class="source-link" href="https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf" target="_blank" rel="noopener">Sudoku Squares and Chromatic Polynomials (Herzberg &amp; Murty)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku" target="_blank" rel="noopener">Mathematics of Sudoku</a><a class="source-link" href="https://en.wikipedia.org/wiki/Thirty-six_officers_problem" target="_blank" rel="noopener">Euler’s 36 officers</a></div>`,
    },
  });
})();
