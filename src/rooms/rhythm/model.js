/*
 * Rhythms from Euclid · k beats spread as evenly as possible over n steps. Pure functions, no DOM.
 *
 * Bjorklund's algorithm (2003, for timing pulses in the Spallation Neutron Source) starts from k one-beat groups and
 * n − k rests, and keeps tucking the leftover groups behind the others, one each, until at most one is left over:
 * the repeated subtraction of Euclid's algorithm for the greatest common divisor. Toussaint (2005) called the
 * results Euclidean rhythms, E(k, n), and found many of them in traditional music, up to rotation.
 *
 * A pattern is an array of n booleans, true on a beat; step 0 is where the cycle starts.
 */
(() => {
  'use strict';

  /**
   * Bjorklund's algorithm, as Toussaint describes it. The groups after each round (the first entry is the start:
   * k beats, then the rests), so the explanation can show the visitor's own numbers.
   */
  function rounds(k, n) {
    let front = Array.from({ length: k }, () => [true]),
      back = Array.from({ length: n - k }, () => [false]);
    const out = [[...front, ...back]];
    // The process stops once at most one group is left over, or there are no rests (always one round, so that
    // E(2, 3) is x.x and not xx.).
    let first = true;
    while (front.length && back.length && (back.length > 1 || first)) {
      first = false;
      const m = Math.min(front.length, back.length);
      const joined = front.slice(0, m).map((group, i) => [...group, ...back[i]]);
      back = front.length > m ? front.slice(m) : back.slice(m);
      front = joined;
      out.push([...front, ...back]);
    }
    return out;
  }

  /** E(k, n): Bjorklund's pattern, with Toussaint's choice of starting step. */
  const euclid = (k, n) => rounds(k, n).at(-1).flat();

  /** The pattern started from step r: rotate(p, r)[i] = p[(i + r) mod n]. */
  const rotate = (p, r) => p.map((_, i) => p[(((i + r) % p.length) + p.length) % p.length]);

  /**
   * The pixelated straight line of slope k/n, read from column s: column i is a beat where ⌊k(i + s)/n⌋ steps up
   * from the column before (the digital straight line, or Christoffel word). It is always a rotation of E(k, n).
   */
  const line = (k, n, s = 0) =>
    Array.from({ length: n }, (_, i) => Math.floor((k * (i + s)) / n) > Math.floor((k * (i + s - 1)) / n));

  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

  /** The column s from which the line reads exactly as pattern p (a rotation of E(k, n)), or −1. */
  function lineStart(p) {
    const k = p.filter(Boolean).length;
    for (let s = 0; s < p.length; s++) if (same(line(k, p.length, s), p)) return s;
    return -1;
  }

  /** The ring's pattern: E(k, n) started from step r. */
  const pattern = (k, n, r) => rotate(euclid(k, n), r);

  /** The steps that are beats. */
  const beats = (p) => p.flatMap((on, i) => (on ? [i] : []));

  /** The gaps between consecutive beats, round the circle (the inter-onset intervals, e.g. 3 3 2). */
  function gaps(p) {
    const b = beats(p);
    return b.map((x, i) => (i + 1 < b.length ? b[i + 1] : b[0] + p.length) - x);
  }

  /**
   * How spread out the beats are: the sum of the straight-line distances between every pair of beats on a circle of
   * radius 1. E(k, n) has the largest sum of all k-beat patterns on n steps, and only its rotations reach it
   * (Demaine and others, 2009).
   */
  function spread(p) {
    const b = beats(p),
      n = p.length;
    let sum = 0;
    for (let i = 0; i < b.length; i++)
      for (let j = i + 1; j < b.length; j++) sum += 2 * Math.sin((Math.PI * (b[j] - b[i])) / n);
    return sum;
  }

  const isRotationOf = (p, q) => p.length === q.length && p.some((_, r) => same(rotate(q, r), p));

  /**
   * Rhythms Toussaint (2005) lists as Euclidean, each as E(k, n) started from step `start` (where he says the rhythm
   * is usually played from; otherwise his listed form, start 0). The ids name their words in text.en.js. A ring
   * matches whatever step it starts on, as his necklaces do.
   */
  const RHYTHMS = [
    { id: 'conga', k: 2, n: 3, start: 0 },
    { id: 'khafif', k: 2, n: 5, start: 0 },
    { id: 'cumbia', k: 3, n: 4, start: 0 },
    { id: 'romanian', k: 3, n: 5, start: 2 },
    { id: 'ruchenitza', k: 3, n: 7, start: 0 },
    { id: 'tresillo', k: 3, n: 8, start: 0 },
    { id: 'ruchenitzaFour', k: 4, n: 7, start: 0 },
    { id: 'aksak', k: 4, n: 9, start: 0 },
    { id: 'yorkSamai', k: 5, n: 6, start: 2 },
    { id: 'nawakhat', k: 5, n: 7, start: 0 },
    { id: 'cinquillo', k: 5, n: 8, start: 0 },
    { id: 'agsagSamai', k: 5, n: 9, start: 0 },
    { id: 'venda', k: 5, n: 12, start: 0 },
    { id: 'bossa', k: 5, n: 16, start: 6 },
    { id: 'bendir', k: 7, n: 8, start: 0 },
    { id: 'bell', k: 7, n: 12, start: 0 },
    { id: 'samba', k: 7, n: 16, start: 14 },
    { id: 'central', k: 9, n: 16, start: 0 },
    { id: 'aka', k: 11, n: 24, start: 14 },
    { id: 'sangha', k: 13, n: 24, start: 5 },
  ];

  /** The listed rhythm with k beats in n steps, or null. Each (k, n) has one Euclidean pattern, up to rotation. */
  const named = (k, n) => RHYTHMS.find((r) => r.k === k && r.n === n) ?? null;

  const greatest = (a, b) => (b ? greatest(b, a % b) : a);

  /** Euclid's algorithm on n and k: the divisions [a, q, b, r] with a = q·b + r, until the remainder is 0. */
  function divisions(n, k) {
    const out = [];
    let a = n,
      b = k;
    while (b > 0) {
      out.push([a, Math.floor(a / b), b, a % b]);
      [a, b] = [b, a % b];
    }
    return out;
  }

  Wonderlattice.models.rhythm = Object.freeze({
    rounds,
    euclid,
    rotate,
    line,
    lineStart,
    pattern,
    beats,
    gaps,
    spread,
    isRotationOf,
    RHYTHMS,
    named,
    greatest,
    divisions,
  });
})();
