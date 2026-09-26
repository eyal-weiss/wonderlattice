import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const { playerStats, compare } = globalThis.Wonderlattice.models.shotMix;

test('a player better at both close and far range can still lose overall', () => {
  const settings = {
    aCloseRate: 0.9,
    aFarRate: 0.4,
    aCloseAttempts: 10,
    aFarAttempts: 900,
    bCloseRate: 0.8,
    bFarRate: 0.3,
    bCloseAttempts: 900,
    bFarAttempts: 10,
  };
  const { a, b } = compare(settings);

  assert.ok(a.closePct > b.closePct, 'A should beat B at close range');
  assert.ok(a.farPct > b.farPct, 'A should beat B at far range');
  assert.ok(b.overallPct > a.overallPct, 'B should beat A overall, despite losing both categories');
});

test('playerStats computes makes and percentages from attempts and a fixed rate', () => {
  const stats = playerStats(0.5, 0.5, 100, 100);
  assert.equal(stats.closeMakes, 50);
  assert.equal(stats.farMakes, 50);
  assert.equal(stats.closePct, 0.5);
  assert.equal(stats.farPct, 0.5);
  assert.equal(stats.overallPct, 0.5);
});

test('a player with zero attempts in a category has 0% there, not an error', () => {
  const stats = playerStats(0.9, 0.4, 0, 100);
  assert.equal(stats.closePct, 0);
  assert.equal(stats.farPct, 0.4);
});
