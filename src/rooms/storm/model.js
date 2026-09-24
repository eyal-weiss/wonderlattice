/*
 * Send a picture through a storm · error-detecting and error-correcting codes
 * on a binary symmetric channel (every bit flips independently with
 * probability p). The codes follow R. W. Hamming, "Error detecting and error
 * correcting codes", Bell System Technical Journal 29 (1950), and chapter 1 of
 * D. J. C. MacKay, "Information Theory, Inference, and Learning Algorithms".
 * Pure functions, no DOM.
 *
 * A picture is SIZE × SIZE pixels (0 or 1), read row by row. It is cut into
 * blocks of four pixels; each code turns a block of 4 data bits into n bits.
 */
(() => {
  'use strict';

  const SIZE = 8;
  const PIXELS = SIZE * SIZE;
  const DATA = 4; // data bits per block
  const BLOCKS = PIXELS / DATA;

  /**
   * Hamming(7,4) in Hamming's own arrangement: positions 1…7, check bits at
   * the powers of two (1, 2, 4), data at 3, 5, 6, 7. Check bit k makes the
   * positions whose number has bit k set add up to an even number, so the
   * positions of the 1s in a codeword always XOR to zero.
   */
  const HAMMING_DATA = [3, 5, 6, 7];

  function hammingEncode(d) {
    const word = [0, 0, 0, 0, 0, 0, 0];
    HAMMING_DATA.forEach((position, i) => (word[position - 1] = d[i]));
    for (const check of [1, 2, 4]) {
      let parity = 0;
      for (let position = 1; position <= 7; position++)
        if (position & check && position !== check) parity ^= word[position - 1];
      word[check - 1] = parity;
    }
    return word;
  }

  /** The syndrome: XOR of the positions holding a 1. Zero means "no error"; otherwise it names the flipped position. */
  function syndrome(word) {
    let s = 0;
    for (let position = 1; position <= 7; position++) if (word[position - 1]) s ^= position;
    return s;
  }

  function hammingDecode(received) {
    const s = syndrome(received);
    const word = received.slice();
    if (s) word[s - 1] ^= 1;
    return { data: HAMMING_DATA.map((position) => word[position - 1]), syndrome: s, bad: false };
  }

  /**
   * The four codes, in the order of the room's select control. `roles[i]` is
   * the data bit (0–3) that bit i of a block carries, or -1 for a check bit.
   */
  const CODES = Object.freeze([
    {
      id: 'none',
      n: 4,
      roles: [0, 1, 2, 3],
      encode: (d) => d.slice(),
      decode: (r) => ({ data: r.slice(), bad: false }),
    },
    {
      id: 'repeat',
      n: 12,
      roles: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3],
      encode: (d) => d.flatMap((bit) => [bit, bit, bit]),
      // Majority vote over each group of three copies.
      decode: (r) => ({
        data: [0, 1, 2, 3].map((i) => (r[3 * i] + r[3 * i + 1] + r[3 * i + 2] >= 2 ? 1 : 0)),
        bad: false,
      }),
    },
    {
      id: 'parity',
      n: 5,
      roles: [0, 1, 2, 3, -1],
      encode: (d) => [...d, d[0] ^ d[1] ^ d[2] ^ d[3]],
      // An odd number of 1s means some bit flipped: the block is known bad, but nothing says which bit.
      decode: (r) => ({ data: r.slice(0, 4), bad: (r[0] ^ r[1] ^ r[2] ^ r[3] ^ r[4]) === 1 }),
    },
    {
      id: 'hamming',
      n: 7,
      roles: [-1, -1, 0, -1, 1, 2, 3],
      encode: hammingEncode,
      decode: hammingDecode,
    },
  ]);

  const codeAt = (index) => {
    const code = CODES[index];
    if (!code) throw new RangeError(`Unknown code ${index}`);
    return code;
  };

  /** Extra bits sent per data bit: 0 for none, 2 for three copies, 0.25 for parity, 0.75 for Hamming. */
  const overhead = (index) => (codeAt(index).n - DATA) / DATA;

  /** Bits on the wire for a whole picture. */
  const bitsSent = (index) => codeAt(index).n * BLOCKS;

  /** Encode a picture (PIXELS bits) block by block. */
  function encode(index, pixels) {
    const code = codeAt(index);
    const out = [];
    for (let b = 0; b < BLOCKS; b++) out.push(...code.encode(pixels.slice(b * DATA, b * DATA + DATA)));
    return out;
  }

  /** Decode a received bit stream: the pixels, plus which blocks the receiver knows are bad. */
  function decode(index, received) {
    const code = codeAt(index);
    const pixels = [],
      bad = [];
    for (let b = 0; b < BLOCKS; b++) {
      const result = code.decode(received.slice(b * code.n, b * code.n + code.n));
      pixels.push(...result.data);
      bad.push(result.bad);
    }
    return { pixels, bad };
  }

  /** A small, fast, seedable random generator (mulberry32). Same seed, same sequence. */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * The storm: each bit flips independently with probability p. Bit i draws
   * the i-th number from the seeded generator and flips when it is below p, so
   * raising p with the same seed only ever adds flips.
   */
  function channel(bits, p, seed) {
    if (!(p >= 0 && p <= 1)) throw new RangeError('Flip probability must be between 0 and 1');
    const random = rng(seed);
    const flipped = bits.map(() => random() < p);
    return { received: bits.map((bit, i) => bit ^ (flipped[i] ? 1 : 0)), flipped };
  }

  /**
   * Send a picture through the storm and describe what happened to every pixel.
   * `repaired[i]`: a bit carrying pixel i was flipped, yet it arrived right.
   * `wrong[i]`: pixel i arrived wrong. `bad[b]`: the receiver knows block b is damaged.
   */
  function transmit(pixels, index, p, seed) {
    if (pixels.length !== PIXELS) throw new RangeError(`A picture has ${PIXELS} pixels`);
    const code = codeAt(index);
    const sent = encode(index, pixels);
    const { received, flipped } = channel(sent, p, seed);
    const decoded = decode(index, received);
    const touched = new Array(PIXELS).fill(false);
    flipped.forEach((flip, i) => {
      const role = code.roles[i % code.n];
      if (flip && role >= 0) touched[Math.floor(i / code.n) * DATA + role] = true;
    });
    const wrong = decoded.pixels.map((bit, i) => bit !== pixels[i]);
    const repaired = touched.map((t, i) => t && !wrong[i]);
    const count = (list) => list.filter(Boolean).length;
    return {
      sent,
      received,
      flipped,
      pixels: decoded.pixels,
      bad: decoded.bad,
      wrong,
      repaired,
      flips: count(flipped),
      wrongCount: count(wrong),
      repairedCount: count(repaired),
      badCount: count(decoded.bad),
    };
  }

  /**
   * The exact expected number of wrong pixels in a picture at flip probability
   * p, by adding up every possible pattern of flips in one block. All four codes
   * are linear and their decoders treat every codeword alike, so sending the
   * all-zero block is enough.
   */
  function expectedWrong(index, p) {
    const code = codeAt(index);
    const zero = code.encode([0, 0, 0, 0]);
    let perBlock = 0;
    for (let pattern = 0; pattern < 1 << code.n; pattern++) {
      let weight = 0;
      const received = zero.map((bit, i) => {
        const flip = (pattern >> i) & 1;
        weight += flip;
        return bit ^ flip;
      });
      const errors = code.decode(received).data.reduce((a, b) => a + b, 0);
      if (errors) perBlock += errors * p ** weight * (1 - p) ** (code.n - weight);
    }
    return perBlock * BLOCKS;
  }

  /** Pictures travel in links as two 32-bit whole numbers: rows 0–3 and rows 4–7. */
  function pack(pixels) {
    const half = PIXELS / 2;
    let top = 0,
      bottom = 0;
    for (let i = 0; i < half; i++) {
      top = top * 2 + pixels[i];
      bottom = bottom * 2 + pixels[half + i];
    }
    return { top, bottom };
  }

  function unpack(top, bottom) {
    const half = PIXELS / 2,
      pixels = new Array(PIXELS);
    for (let i = half - 1; i >= 0; i--) {
      pixels[i] = top % 2;
      pixels[half + i] = bottom % 2;
      top = Math.floor(top / 2);
      bottom = Math.floor(bottom / 2);
    }
    return pixels;
  }

  /** Ready-made pictures, drawn row by row ('#' is ink). */
  const PICTURES = Object.freeze(
    Object.fromEntries(
      Object.entries({
        heart: ['........', '.##..##.', '########', '########', '.######.', '..####..', '...##...', '........'],
        smile: ['..####..', '.#....#.', '#.#..#.#', '#......#', '#.#..#.#', '#..##..#', '.#....#.', '..####..'],
        invader: ['..#..#..', '...##...', '..####..', '.##..##.', '########', '#.####.#', '#.#..#.#', '...##...'],
        blank: ['........', '........', '........', '........', '........', '........', '........', '........'],
      }).map(([id, rows]) => [id, Object.freeze(rows.flatMap((row) => [...row].map((c) => (c === '#' ? 1 : 0))))]),
    ),
  );

  Wonderloom.models.storm = Object.freeze({
    SIZE,
    PIXELS,
    DATA,
    BLOCKS,
    CODES,
    PICTURES,
    overhead,
    bitsSent,
    encode,
    decode,
    syndrome,
    rng,
    channel,
    transmit,
    expectedWrong,
    pack,
    unpack,
  });
})();
