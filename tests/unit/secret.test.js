import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const S = globalThis.Wonderlattice.models.secret;
const CLOCKS = [11, 23, 47, 101, 1019, 9973];

test('modPow agrees with exact BigInt arithmetic', () => {
  for (const p of CLOCKS)
    for (let i = 0; i < 40; i++) {
      const base = 1 + ((i * 7919) % (p - 1)),
        exp = (i * 104729) % (3 * p);
      assert.equal(S.modPow(base, exp, p), Number(BigInt(base) ** BigInt(exp) % BigInt(p)), `${base}^${exp} mod ${p}`);
    }
  assert.equal(S.modPow(5, 4, 23), 4); // the classic example: p = 23, g = 5
  assert.equal(S.modPow(5, 3, 23), 10);
});

test('the start g of every clock visits every hour (a primitive root)', () => {
  for (const p of CLOCKS) {
    assert.ok(S.isPrime(p), `${p} is prime`);
    const g = S.primitiveRoot(p);
    assert.equal(new Set(S.hops(g, p - 2, p)).size, p - 1, `powers of ${g} cover 1 … ${p - 1}`);
  }
  assert.equal(S.primitiveRoot(23), 5);
});

test('Alice and Bob always reach the same key, and it matches g^(ab)', () => {
  for (const p of [11, 23, 47, 101]) {
    const g = S.primitiveRoot(p);
    for (let a = 1; a <= p - 2; a += 3)
      for (let b = 1; b <= p - 2; b += 5) {
        const x = S.exchange({ p, g, a, b });
        assert.equal(x.keyAlice, x.keyBob);
        assert.equal(x.keyAlice, S.modPow(g, a * b, p));
      }
  }
  assert.deepEqual(S.exchange({ p: 23, g: 5, a: 4, b: 3 }), { A: 4, B: 10, keyAlice: 18, keyBob: 18 });
});

test('the eavesdropper finds a secret that works, and bigger clocks cost her more tries', () => {
  const averageTries = (p) => {
    const g = S.primitiveRoot(p);
    let total = 0;
    for (let a = 1; a <= p - 2; a += Math.max(1, Math.floor(p / 60))) {
      const { k, tries } = S.discreteLog(g, S.modPow(g, a, p), p);
      assert.equal(S.modPow(g, k, p), S.modPow(g, a, p));
      total += tries;
    }
    return total / Math.ceil((p - 2) / Math.max(1, Math.floor(p / 60)));
  };
  const small = averageTries(101),
    big = averageTries(9973);
  assert.ok(big > 50 * small, `average tries: ${small} on a clock of 101, ${big} on 9973`);
});

test('secrets are kept on the clock', () => {
  assert.equal(S.fitSecret(5000, 23), 21);
  assert.equal(S.fitSecret(0, 23), 1);
  assert.equal(S.fitSecret(7.4, 23), 7);
});

test('paint: the order of mixing never matters, both sides match, and the eavesdropper does not', () => {
  const yellow = [0.95, 0.82, 0.29],
    red = [0.78, 0.2, 0.29],
    blue = [0.18, 0.37, 0.82];
  assert.ok(S.colourDistance(S.potColour([yellow, red, blue]), S.potColour([blue, yellow, red])) < 1e-12);
  const x = S.paintExchange(yellow, red, blue);
  assert.ok(S.colourDistance(x.colours.aliceEnds, x.colours.bobEnds) < 1e-12);
  assert.ok(S.colourDistance(x.colours.eveTries, x.colours.aliceEnds) > 0.05, 'the eavesdropper mix looks different');
  assert.equal(x.aliceEnds.length, 3);
  assert.equal(x.eveTries.length, 4);
});
