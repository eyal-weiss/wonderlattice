/*
 * A secret shouted across the room · sharing a key in public (Diffie–Hellman), with paint and with clock arithmetic.
 * Pure functions, no DOM.
 *
 * Clock arithmetic: numbers wrap around a clock of p hours (p a prime). Everyone knows p and a start g. Alice keeps a
 * secret a and shouts A = gᵃ; Bob keeps b and shouts B = gᵇ (all "mod p", on the clock). Alice works out Bᵃ and Bob
 * works out Aᵇ: both are gᵃᵇ, the shared key. An eavesdropper who hears p, g, A and B must find a from A (the
 * "discrete logarithm"); here she can only try 1, 2, 3, … until gᵏ lands on A.
 *
 * Paint: a pot of paint is the list of what went into it, and its colour mixes them all equally, so the order of
 * mixing doesn't matter, like real paint. Mixing is easy; unmixing isn't.
 */
(() => {
  'use strict';

  /** (x · y) mod m for clocks up to about 94 million hours (so x · y stays an exact number). */
  const mulMod = (x, y, m) => (x * y) % m;

  /** bᵉ mod m, by repeated squaring. */
  function modPow(base, exp, mod) {
    let result = 1 % mod,
      b = ((base % mod) + mod) % mod,
      e = exp;
    while (e > 0) {
      if (e % 2 === 1) result = mulMod(result, b, mod);
      b = mulMod(b, b, mod);
      e = Math.floor(e / 2);
    }
    return result;
  }

  function isPrime(n) {
    if (n < 2 || n % 1) return false;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  }

  /** The distinct prime factors of n. */
  function primeFactors(n) {
    const out = [];
    for (let d = 2; d * d <= n; d++) {
      if (n % d) continue;
      out.push(d);
      while (n % d === 0) n /= d;
    }
    if (n > 1) out.push(n);
    return out;
  }

  /** The smallest start g whose powers visit every hour 1 … p − 1 of the clock (a primitive root). */
  function primitiveRoot(p) {
    if (!isPrime(p)) throw new Error(`${p} is not prime`);
    if (p === 2) return 1;
    const factors = primeFactors(p - 1);
    for (let g = 2; g < p; g++) if (factors.every((q) => modPow(g, (p - 1) / q, p) !== 1)) return g;
    throw new Error(`no primitive root for ${p}`);
  }

  /** The hours visited when multiplying by g, k times, starting from 1: [1, g, g², …, gᵏ]. */
  function hops(g, k, p) {
    const out = [1 % p];
    for (let i = 0; i < k; i++) out.push(mulMod(out[out.length - 1], g, p));
    return out;
  }

  /** The whole exchange on a clock of p hours with start g and secrets a and b. */
  function exchange({ p, g, a, b }) {
    const A = modPow(g, a, p),
      B = modPow(g, b, p);
    return { A, B, keyAlice: modPow(B, a, p), keyBob: modPow(A, b, p) };
  }

  /** The eavesdropper's search: the first k = 1, 2, 3, … with gᵏ = A, and how many tries that took. */
  function discreteLog(g, A, p) {
    let value = 1;
    for (let k = 1; k < p; k++) {
      value = mulMod(value, g, p);
      if (value === A) return { k, tries: k };
    }
    return { k: null, tries: p - 1 };
  }

  /** A secret number that fits the clock: 1 … p − 2. */
  const fitSecret = (value, p) => Math.min(Math.max(1, Math.round(value)), p - 2);

  // ---------- paint ----------

  /**
   * The colour of a pot, from what went into it: each ingredient an [r, g, b] with channels 0 … 1. Paint absorbs
   * light, so equal parts mix multiplicatively (a geometric mean per channel); order never matters.
   */
  function potColour(ingredients) {
    const floor = 0.03; // no channel is ever perfectly black, or one ingredient would blot out the rest
    return [0, 1, 2].map((c) =>
      Math.exp(ingredients.reduce((sum, colour) => sum + Math.log(Math.max(floor, colour[c])), 0) / ingredients.length),
    );
  }

  /** The paint version of the exchange: what each side sends, what each ends with, and the eavesdropper's best try. */
  function paintExchange(shared, secretAlice, secretBob) {
    const aliceSends = [shared, secretAlice],
      bobSends = [shared, secretBob],
      aliceEnds = [...bobSends, secretAlice],
      bobEnds = [...aliceSends, secretBob],
      // All an eavesdropper can do with what she saw is mix the two mixtures: too much of the shared colour.
      eveTries = [...aliceSends, ...bobSends];
    return {
      aliceSends,
      bobSends,
      aliceEnds,
      bobEnds,
      eveTries,
      colours: {
        aliceSends: potColour(aliceSends),
        bobSends: potColour(bobSends),
        aliceEnds: potColour(aliceEnds),
        bobEnds: potColour(bobEnds),
        eveTries: potColour(eveTries),
      },
    };
  }

  /** How far apart two colours look, roughly (0 = identical, about 1.7 = black to white). */
  const colourDistance = (x, y) => Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);

  Wonderlattice.models.secret = Object.freeze({
    modPow,
    isPrime,
    primeFactors,
    primitiveRoot,
    hops,
    exchange,
    discreteLog,
    fitSecret,
    potColour,
    paintExchange,
    colourDistance,
  });
})();
