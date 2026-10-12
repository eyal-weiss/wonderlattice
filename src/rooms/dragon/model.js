/*
 * Fold a dragon · the mathematics of the paper-folding curve.
 *
 * Fold a strip of paper in half, always the same way, `folds` times: it gets 2^folds − 1 creases and 2^folds equal
 * pieces. Crease n (counted from one end, 1 ≤ n < 2^folds) turns right or left by a simple rule, the regular
 * paperfolding sequence: write n = 2^a · m with m odd; the turn is right if m leaves 1 when divided by 4, left if it
 * leaves 3. The crease in the middle (m = 1) was made by the first fold, and crease n by fold `folds − a`.
 * https://en.wikipedia.org/wiki/Regular_paperfolding_sequence
 *
 * Open every crease to the same angle and the strip draws a curve. At a right angle it is the Heighway dragon: on the
 * square grid, it never uses the same edge twice (C. Davis and D. E. Knuth, "Number representations and dragon
 * curves", 1970). https://en.wikipedia.org/wiki/Dragon_curve
 *
 * Pure functions, no DOM. A piece of the strip is one unit long. A heading is an angle in radians; each crease turns the
 * heading by its bend (0 = the paper lies straight, π = folded flat), clockwise for a right turn in a plane whose y
 * axis points up.
 */
(() => {
  'use strict';

  const MAX_FOLDS = 14;

  /** Crease n's turn: +1 right, −1 left. */
  function turn(n) {
    while (n % 2 === 0) n /= 2;
    return n % 4 === 1 ? 1 : -1;
  }

  /** The fold (1 = the first) that made crease n of a strip folded `folds` times. */
  function foldOf(n, folds) {
    let a = 0;
    while (n % 2 === 0) {
      n /= 2;
      a++;
    }
    return folds - a;
  }

  // Each strip's turns and folds, worked out once.
  const strips = new Map();
  function strip(folds) {
    if (!strips.has(folds)) {
      const creases = 2 ** folds - 1;
      const turns = new Int8Array(creases + 1),
        made = new Int8Array(creases + 1); // index n = crease n; index 0 is unused
      for (let n = 1; n <= creases; n++) {
        turns[n] = turn(n);
        made[n] = foldOf(n, folds);
      }
      strips.set(folds, { pieces: creases + 1, turns, made });
    }
    return strips.get(folds);
  }

  /**
   * The strip's corners: x and y of its start, of each crease, and of its end, as one flat array. bend[k] is how far
   * the creases made by fold k turn (bend[0] is unused), and the first piece points along `start`.
   */
  function corners(folds, bend, start = 0, out) {
    const { pieces, turns, made } = strip(folds);
    const points = out && out.length >= 2 * (pieces + 1) ? out : new Float64Array(2 * (pieces + 1));
    let x = 0,
      y = 0,
      heading = start;
    points[0] = 0;
    points[1] = 0;
    for (let j = 0; j < pieces; j++) {
      if (j > 0) heading -= turns[j] * bend[made[j]];
      x += Math.cos(heading);
      y += Math.sin(heading);
      points[2 * j + 2] = x;
      points[2 * j + 3] = y;
    }
    return points;
  }

  /** The same bend for every crease. */
  const evenly = (folds, value) => new Array(folds + 1).fill(value);

  /** The dragon on the square grid: whole-number corners, with every crease at a right angle. */
  function lattice(folds, quarter = 0) {
    const { pieces, turns } = strip(folds);
    const steps = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    let x = 0,
      y = 0,
      h = ((quarter % 4) + 4) % 4;
    const points = [[0, 0]];
    for (let j = 0; j < pieces; j++) {
      if (j > 0) h = (((h - turns[j]) % 4) + 4) % 4;
      x += steps[h][0];
      y += steps[h][1];
      points.push([x, y]);
    }
    return points;
  }

  /** The direction from the dragon's start to its end, with every crease at a right angle and the first piece at 0. */
  function chord(folds) {
    const end = lattice(folds).at(-1);
    return Math.atan2(end[1], end[0]);
  }

  /** The smallest box around some flat [x, y, x, y, …] arrays of corners. */
  function bounds(...lists) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const points of lists)
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i],
          y = points[i + 1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    return { minX, minY, maxX, maxY };
  }

  /** Each edge of a grid path as a string, the same whichever way it's walked. */
  const edgeKeys = (points) =>
    points.slice(1).map(([x, y], i) => {
      const [px, py] = points[i];
      return px < x || (px === x && py < y) ? `${px},${py} ${x},${y}` : `${x},${y} ${px},${py}`;
    });

  Wonderlattice.models.dragon = Object.freeze({
    MAX_FOLDS,
    turn,
    foldOf,
    strip,
    corners,
    evenly,
    lattice,
    chord,
    bounds,
    edgeKeys,
  });
})();
