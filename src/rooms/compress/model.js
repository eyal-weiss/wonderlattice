/*
 * How much picture can you throw away? · the 8×8 discrete cosine transform (DCT) behind JPEG.
 * A 64×64 grey picture is cut into 64 blocks of 8×8 pixels. Each block is rewritten as 64 numbers,
 * the amounts of 64 fixed patterns ("building blocks", from a flat wash to fine ripples) that add up
 * to it exactly. Most of a natural picture's energy sits in a few big numbers, so keeping only the
 * strongest ones and rebuilding gives a picture that is hard to tell apart; keeping only the weakest
 * ruins it. Pure functions, no DOM.
 */
(() => {
  'use strict';

  const SIZE = 64; // pixels across and down
  const B = 8; // block size, as in JPEG
  const COUNT = SIZE * SIZE; // numbers describing a picture: 4,096
  const BLOCKS = (SIZE / B) ** 2; // 64 blocks

  // The orthonormal DCT-II basis: C[k][n] = a(k)·cos((2n + 1)kπ / 16). Orthonormal means the inverse is
  // the transpose, so the round trip is exact (up to floating point).
  const C = Array.from({ length: B }, (_, k) =>
    Float64Array.from(
      { length: B },
      (_, n) => (k ? Math.sqrt(2 / B) : Math.sqrt(1 / B)) * Math.cos(((2 * n + 1) * k * Math.PI) / (2 * B)),
    ),
  );

  /**
   * The picture's numbers, block by block: coefficient (u, v) of block b sits at b·64 + u·8 + v, where u
   * counts vertical ripples and v horizontal ones. (0, 0) is the block's average brightness, times 8.
   */
  function transform(image) {
    const out = new Float64Array(COUNT);
    const tmp = new Float64Array(B * B);
    for (let b = 0; b < BLOCKS; b++) {
      const bx = (b % (SIZE / B)) * B,
        by = Math.floor(b / (SIZE / B)) * B;
      // Rows first, then columns (the 2D transform is separable).
      for (let y = 0; y < B; y++)
        for (let v = 0; v < B; v++) {
          let sum = 0;
          for (let x = 0; x < B; x++) sum += C[v][x] * image[(by + y) * SIZE + bx + x];
          tmp[y * B + v] = sum;
        }
      for (let u = 0; u < B; u++)
        for (let v = 0; v < B; v++) {
          let sum = 0;
          for (let y = 0; y < B; y++) sum += C[u][y] * tmp[y * B + v];
          out[b * B * B + u * B + v] = sum;
        }
    }
    return out;
  }

  /** The picture that a set of numbers describes (the inverse transform). */
  function inverse(coeffs) {
    const out = new Float64Array(COUNT);
    const tmp = new Float64Array(B * B);
    for (let b = 0; b < BLOCKS; b++) {
      const bx = (b % (SIZE / B)) * B,
        by = Math.floor(b / (SIZE / B)) * B;
      for (let y = 0; y < B; y++)
        for (let v = 0; v < B; v++) {
          let sum = 0;
          for (let u = 0; u < B; u++) sum += C[u][y] * coeffs[b * B * B + u * B + v];
          tmp[y * B + v] = sum;
        }
      for (let y = 0; y < B; y++)
        for (let x = 0; x < B; x++) {
          let sum = 0;
          for (let v = 0; v < B; v++) sum += C[v][x] * tmp[y * B + v];
          out[(by + y) * SIZE + bx + x] = sum;
        }
    }
    return out;
  }

  /** Positions of the numbers from strongest (largest size, either sign) to weakest. */
  function strength(coeffs) {
    return Int32Array.from({ length: COUNT }, (_, i) => i).sort((a, b) => Math.abs(coeffs[b]) - Math.abs(coeffs[a]));
  }

  /**
   * Keep a share of the numbers and zero the rest: the strongest ones (mode 0) or the weakest (mode 1).
   * `share` is 0–1. Returns the kept numbers and which positions were kept.
   */
  function keep(coeffs, order, share, mode = 0) {
    const n = Math.round(Math.max(0, Math.min(1, share)) * COUNT);
    const kept = new Float64Array(COUNT);
    const mask = new Uint8Array(COUNT);
    for (let r = 0; r < n; r++) {
      const i = mode === 0 ? order[r] : order[COUNT - 1 - r];
      kept[i] = coeffs[i];
      mask[i] = 1;
    }
    return { kept, mask, count: n };
  }

  /** How different two pictures look: the root-mean-square difference, as a share of full brightness (0–1). */
  function difference(a, b) {
    let sum = 0;
    for (let i = 0; i < COUNT; i++) {
      const d = Math.max(0, Math.min(255, a[i])) - Math.max(0, Math.min(255, b[i]));
      sum += d * d;
    }
    return Math.sqrt(sum / COUNT) / 255;
  }

  /** The share of the picture's energy (sum of squares) held by the kept numbers, 0–1. */
  function energyKept(coeffs, mask) {
    let all = 0,
      kept = 0;
    for (let i = 0; i < COUNT; i++) {
      const e = coeffs[i] * coeffs[i];
      all += e;
      if (mask[i]) kept += e;
    }
    return all ? kept / all : 1;
  }

  /** For each of the 64 building blocks (u·8 + v), the share of the 64 blocks that kept it. */
  function patternUse(mask) {
    const use = new Float64Array(B * B);
    for (let i = 0; i < COUNT; i++) if (mask[i]) use[i % (B * B)] += 1 / BLOCKS;
    return use;
  }

  /** Building block (u, v) as an 8×8 pattern of values from −1 to 1, for drawing. */
  function pattern(u, v) {
    const out = new Float64Array(B * B);
    let peak = 0;
    for (let y = 0; y < B; y++) for (let x = 0; x < B; x++) peak = Math.max(peak, Math.abs(C[u][y] * C[v][x]));
    for (let y = 0; y < B; y++) for (let x = 0; x < B; x++) out[y * B + x] = (C[u][y] * C[v][x]) / peak;
    return out;
  }

  // ---------- pictures, drawn in code ----------

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const smooth = (edge0, edge1, x) => {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };
  const fill = (f) => {
    const out = new Float64Array(COUNT);
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) out[y * SIZE + x] = 255 * clamp01(f(x + 0.5, y + 0.5));
    return out;
  };

  const PICTURES = {
    /** A sun setting over hills: smooth gradients and one soft edge. */
    sunset: () =>
      fill((x, y) => {
        const hills = 40 + 5 * Math.sin(x / 7) + 3 * Math.sin(x / 3.3 + 1);
        if (y > hills) return 0.12 + 0.05 * Math.sin(x / 5 + y / 4);
        const sun = Math.hypot(x - 42, y - 30);
        const sky = 0.25 + 0.55 * (y / hills) ** 1.6;
        return Math.max(sky, 1 - smooth(8, 10, sun));
      }),
    /** A friendly face: round shapes and shading. */
    face: () =>
      fill((x, y) => {
        const r = Math.hypot(x - 32, y - 33);
        if (r > 25) return 0.1;
        let v = 0.85 - 0.25 * (r / 25) ** 2;
        if (Math.hypot(x - 23, y - 26) < 3.2 || Math.hypot(x - 41, y - 26) < 3.2) v = 0.08;
        const smile = Math.hypot(x - 32, y - 30);
        if (smile > 12 && smile < 15 && y > 36) v = 0.12;
        return v;
      }),
    /** Hard edges and fine stripes: the costliest kind of picture. */
    checks: () =>
      fill((x, y) => {
        if (y < 32) return (Math.floor(x / 6) + Math.floor(y / 6)) % 2 ? 0.9 : 0.1;
        return Math.floor(x / 2) % 2 ? 0.8 : 0.2;
      }),
    /** Rings that get closer together towards the edge. */
    rings: () => fill((x, y) => 0.5 + 0.45 * Math.cos(((x - 32) ** 2 + (y - 32) ** 2) / 26)),
  };
  const PICTURE_ORDER = ['sunset', 'face', 'checks', 'rings'];

  /** Paint a soft round dot of brightness `value` (0–255) at (cx, cy), in place. */
  function paint(image, cx, cy, value, radius = 2.2) {
    for (let y = Math.floor(cy - radius - 1); y <= cy + radius + 1; y++)
      for (let x = Math.floor(cx - radius - 1); x <= cx + radius + 1; x++) {
        if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        const a = 1 - smooth(radius - 0.6, radius + 0.6, d);
        if (a > 0) image[y * SIZE + x] += (value - image[y * SIZE + x]) * a;
      }
    return image;
  }

  Wonderlattice.models.compress = Object.freeze({
    SIZE,
    B,
    COUNT,
    BLOCKS,
    PICTURES,
    PICTURE_ORDER,
    transform,
    inverse,
    strength,
    keep,
    difference,
    energyKept,
    patternUse,
    pattern,
    paint,
  });
})();
