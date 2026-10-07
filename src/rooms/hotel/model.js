/*
 * The hotel that is always full · Hilbert's hotel, and Cantor's diagonal argument.
 * Rooms are numbered 1, 2, 3, … and every one is taken. A moving card tells every guest at once where to go: "+k"
 * sends the guest in room n to room n + k, "×2" to room 2n. Both are one-to-one (no two guests share a room), so the
 * rooms they leave empty can take newcomers: +k frees rooms 1 to k, ×2 frees every odd room. Infinitely many coaches
 * fit too, by a zigzag through the grid of (coach, seat): Cantor's pairing, walked back and forth. Then the coach
 * whose passengers are endless strings of coin flips: from any list of them, one per room, flipping the k-th flip of
 * the k-th passenger builds a passenger who differs from every one listed (G. Cantor, "Über eine elementare Frage der
 * Mannigfaltigkeitslehre", Jahresbericht der DMV 1, 1891).
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const SIZE = 8; // the coin-flip list shows 8 rooms of 8 flips each: 64 flips, two 32-bit numbers in a link

  /** The moving cards: where the guest in room n goes. */
  const CARDS = {
    one: { add: 1 },
    five: { add: 5 },
    double: { times: 2 },
  };

  /** Room n's new room under a card. */
  const moveTo = (card, n) => (CARDS[card].times ? n * CARDS[card].times : n + CARDS[card].add);

  /** The rooms up to `upTo` that a card leaves empty: +k frees 1 to k, ×2 frees every odd room. */
  function freed(card, upTo) {
    const taken = new Set();
    for (let n = 1; n <= upTo; n++) taken.add(moveTo(card, n));
    const empty = [];
    for (let n = 1; n <= upTo; n++) if (!taken.has(n)) empty.push(n);
    return empty;
  }

  /**
   * The room for newcomer j (1, 2, 3, …) after a card: the j-th room it frees, or 0 when it frees fewer than j
   * (+k frees only k rooms, so from a coach of endless passengers all but k still wait).
   */
  function newcomerRoom(card, j) {
    const { add } = CARDS[card];
    if (add) return j <= add ? j : 0;
    return 2 * j - 1;
  }

  /** How many rooms a card frees: k for +k, endlessly many (Infinity) for ×2. */
  const freedCount = (card) => CARDS[card].add ?? Infinity;

  /**
   * Infinitely many coaches. Row 0 is the hotel's own guests (seat s = room s), rows 1, 2, 3, … are the coaches, and
   * seats are 1, 2, 3, …. The zigzag walks the anti-diagonals of the grid back and forth from the top left corner,
   * handing out rooms 1, 2, 3, … as it goes: Cantor's pairing (row + seat − 1 = d), turned on every other diagonal.
   */
  function zigzag(row, seat) {
    const a = row,
      b = seat - 1,
      d = a + b;
    const along = d % 2 ? a : b;
    return (d * (d + 1)) / 2 + along + 1;
  }

  /** The person the zigzag sends to room n: { row, seat }. */
  function unzig(n) {
    const z = n - 1;
    let d = Math.floor((Math.sqrt(8 * z + 1) - 1) / 2);
    while ((d * (d + 1)) / 2 > z) d--;
    while (((d + 1) * (d + 2)) / 2 <= z) d++;
    const along = z - (d * (d + 1)) / 2;
    const a = d % 2 ? along : d - along;
    return { row: a, seat: d - a + 1 };
  }

  /**
   * The ×2 card with coaches waiting: the hotel's guests go to the even rooms, coach 1 fills the odd rooms, and every
   * other coach finds nothing (0).
   */
  function doubleRoom(row, seat) {
    if (row === 0) return 2 * seat;
    if (row === 1) return 2 * seat - 1;
    return 0;
  }

  // ------------------------------------------------------- the coin-flip coach

  /** A list of SIZE passengers' first SIZE flips (1 = heads, 0 = tails), from two 32-bit numbers. */
  function listFrom(low, high) {
    const list = [];
    for (let r = 0; r < SIZE; r++) {
      const word = r < 4 ? low : high,
        byte = (word >>> ((r % 4) * 8)) & 255;
      const row = [];
      for (let f = 0; f < SIZE; f++) row.push((byte >>> f) & 1);
      list.push(row);
    }
    return list;
  }

  /** The two 32-bit numbers that make a list (the inverse of listFrom), for a shared link. */
  function numbersOf(list) {
    let low = 0,
      high = 0;
    list.forEach((row, r) => {
      const byte = row.reduce((v, bit, f) => v | (bit << f), 0);
      if (r < 4) low |= byte << ((r % 4) * 8);
      else high |= byte << ((r % 4) * 8);
    });
    return [low >>> 0, high >>> 0];
  }

  /** The left-out passenger: flip k is the opposite of room k's flip k. */
  const diagonal = (list) => list.map((row, k) => 1 - row[k]);

  /** The first flip where two passengers differ, or −1 when every flip shown agrees. */
  const firstDifference = (a, b) => a.findIndex((bit, f) => bit !== b[f]);

  /** Is this passenger anywhere on the list (on every flip shown)? */
  const listed = (list, passenger) => list.some((row) => firstDifference(row, passenger) < 0);

  /** "Everyone +1" on the list: the new passenger takes room 1 and everyone else moves one room on. */
  const admit = (list, passenger) => [passenger.slice(), ...list.slice(0, SIZE - 1).map((row) => row.slice())];

  /** Switch one flip in a list (a new list; the old one is unchanged). */
  const toggle = (list, r, f) => list.map((row, i) => (i === r ? row.map((bit, j) => (j === f ? 1 - bit : bit)) : row));

  /** A small seedable generator (mulberry32), so a random list can be drawn again exactly. */
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** A random list: the two numbers for listFrom. */
  function randomNumbers(seed) {
    const random = rng(seed);
    return [Math.floor(random() * 4294967296) >>> 0, Math.floor(random() * 4294967296) >>> 0];
  }

  Wonderlattice.models.hotel = Object.freeze({
    SIZE,
    CARDS,
    moveTo,
    freed,
    newcomerRoom,
    freedCount,
    zigzag,
    unzig,
    doubleRoom,
    listFrom,
    numbersOf,
    diagonal,
    firstDifference,
    listed,
    admit,
    toggle,
    rng,
    randomNumbers,
  });
})();
