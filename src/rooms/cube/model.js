/*
 * Inside the puzzle cube · moves as permutations of the 54 stickers. Pure functions, no DOM.
 *
 * Coordinates: x to the right, y up, z towards the viewer. Each sticker sits on
 * a cubie at position p (components in {−1, 0, 1}) and faces outward along a
 * unit normal n. A face turn rotates one layer by a quarter turn, clockwise as
 * seen from outside that face: −90° about the face's outward normal.
 */
(() => {
  'use strict';

  // Faces in a fixed order, with their outward normals.
  const FACES = [
    { name: 'U', normal: [0, 1, 0] },
    { name: 'R', normal: [1, 0, 0] },
    { name: 'F', normal: [0, 0, 1] },
    { name: 'D', normal: [0, -1, 0] },
    { name: 'L', normal: [-1, 0, 0] },
    { name: 'B', normal: [0, 0, -1] },
  ];

  /** Every sticker: its cubie position, its normal, and the face it starts on. */
  const stickers = [];
  FACES.forEach((face, f) => {
    const axis = face.normal.findIndex((c) => c !== 0);
    const others = [0, 1, 2].filter((i) => i !== axis);
    for (const a of [-1, 0, 1])
      for (const b of [-1, 0, 1]) {
        const p = [0, 0, 0];
        p[axis] = face.normal[axis];
        p[others[0]] = a;
        p[others[1]] = b;
        stickers.push({ p, n: face.normal.slice(), face: f });
      }
  });
  const key = (p, n) => p.join(',') + '|' + n.join(',');
  const indexOf = new Map(stickers.map((s, i) => [key(s.p, s.n), i]));

  /** Rotate a vector by a quarter turn about a coordinate axis: sign +1 anticlockwise (right-hand rule). */
  function quarter(v, axis, sign) {
    const [i, j] = [
      [1, 2],
      [2, 0],
      [0, 1],
    ][axis];
    const out = v.slice();
    out[i] = -sign * v[j];
    out[j] = sign * v[i];
    return out;
  }

  /**
   * The 12 quarter turns, as permutations: sticker i moves to position perm[i].
   * Order: U R F D L B, then their inverses U′ R′ F′ D′ L′ B′.
   */
  const MOVES = [];
  for (const prime of [false, true])
    FACES.forEach((face) => {
      const axis = face.normal.findIndex((c) => c !== 0);
      const side = face.normal[axis];
      // Clockwise seen from outside = −90° about the outward normal.
      const sign = (prime ? 1 : -1) * side;
      const perm = stickers.map((s, i) => {
        if (s.p[axis] !== side) return i;
        return indexOf.get(key(quarter(s.p, axis, sign), quarter(s.n, axis, sign)));
      });
      MOVES.push({ name: face.name + (prime ? '′' : ''), axis, side, sign, perm });
    });

  const inverseOf = (m) => (m + 6) % 12;
  const solved = () => stickers.map((s) => s.face);

  /** Apply one move to a state (the colour on each sticker position). */
  function apply(state, move) {
    const next = new Array(state.length);
    const { perm } = MOVES[move];
    for (let i = 0; i < state.length; i++) next[perm[i]] = state[i];
    return next;
  }

  const run = (state, sequence, times = 1) => {
    let s = state;
    for (let k = 0; k < times; k++) for (const m of sequence) s = apply(s, m);
    return s;
  };

  /** The inverse of a sequence: undo each move, in reverse order. */
  const inverse = (sequence) => sequence.slice().reverse().map(inverseOf);

  const isSolved = (state) => state.every((c, i) => c === stickers[i].face);

  /** How many stickers are not on their home face. */
  const misplaced = (state) => state.reduce((n, c, i) => n + (c !== stickers[i].face), 0);

  /** The pieces (cubies) that are not exactly as they started: moved or twisted. */
  function movedPieces(state) {
    const moved = new Set();
    state.forEach((c, i) => {
      if (c !== stickers[i].face) moved.add(stickers[i].p.join(','));
    });
    return moved;
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  /**
   * How many times a sequence must be repeated to come home: the least common
   * multiple of the cycle lengths of its combined sticker permutation.
   */
  function order(sequence) {
    if (!sequence.length) return 1;
    const perm = stickers.map((_, i) => i);
    for (const m of sequence) {
      const p = MOVES[m].perm;
      for (let i = 0; i < perm.length; i++) perm[i] = p[perm[i]];
    }
    const seen = new Array(perm.length).fill(false);
    let result = 1;
    for (let i = 0; i < perm.length; i++) {
      if (seen[i]) continue;
      let length = 0;
      for (let j = i; !seen[j]; j = perm[j]) {
        seen[j] = true;
        length++;
      }
      result = (result / gcd(result, length)) * length;
    }
    return result;
  }

  /**
   * Sequences travel in links and saved moments as one number: base-13 digits,
   * each move + 1, so no digit is ever zero and leading moves aren't lost.
   */
  const MAX_LENGTH = 12;
  const encode = (sequence) => sequence.reduce((n, m) => n * 13 + (m + 1), 0);
  function decode(n) {
    const out = [];
    while (n > 0 && out.length <= MAX_LENGTH) {
      const digit = n % 13;
      if (digit === 0) return null; // not a valid sequence
      out.unshift(digit - 1);
      n = Math.floor(n / 13);
    }
    return out.length <= MAX_LENGTH ? out : null;
  }
  const MAX_CODE = encode(new Array(MAX_LENGTH).fill(11));

  const notation = (sequence) => sequence.map((m) => MOVES[m].name).join(' ');

  Wonderloom.models.cube = Object.freeze({
    FACES,
    MOVES,
    stickers,
    solved,
    apply,
    run,
    inverse,
    inverseOf,
    isSolved,
    misplaced,
    movedPieces,
    order,
    encode,
    decode,
    MAX_LENGTH,
    MAX_CODE,
    notation,
  });
})();
