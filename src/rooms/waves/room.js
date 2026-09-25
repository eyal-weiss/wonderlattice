/* Room · Hear the shape: two tones, their sum, beats, and a Lissajous portrait. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU } = W;
  const { wavePoint, beat } = W.models.waves;
  const t = W.text('waves');
  // Pitches to one decimal, without a trailing ".0" (330 Hz, not 330.0 Hz).
  const tenths = (x) => Number(x.toFixed(1));

  // Web Audio state. Sound starts only after a click and stops on leaving.
  let audio = null,
    sounding = false,
    nodes = [];

  function stopSound() {
    sounding = false;
    for (const n of nodes) {
      try {
        n.gain.gain.cancelScheduledValues(audio.currentTime);
        n.gain.gain.setTargetAtTime(0, audio.currentTime, 0.015);
        n.osc.stop(audio.currentTime + 0.09);
      } catch {
        /* already stopped */
      }
    }
    nodes = [];
    if (W.stage.isShowing(room)) $('scene-action').textContent = t.soundOff;
  }

  function startTones() {
    if (!sounding || !audio) return;
    for (const n of nodes) {
      try {
        n.gain.gain.setTargetAtTime(0, audio.currentTime, 0.012);
        n.osc.stop(audio.currentTime + 0.06);
      } catch {
        /* already stopped */
      }
    }
    nodes = [];
    const s = W.stage.settingsFor('waves'),
      start = audio.currentTime + 0.035;
    for (let i = 0; i < 2; i++) {
      const osc = audio.createOscillator(),
        gain = audio.createGain(),
        ph = i ? (s.phase * Math.PI) / 180 : 0;
      // A single harmonic with the requested phase: sin(ωt + φ) = sin φ·cos ωt + cos φ·sin ωt.
      osc.setPeriodicWave(
        audio.createPeriodicWave(new Float32Array([0, Math.sin(ph)]), new Float32Array([0, Math.cos(ph)]), {
          disableNormalization: true,
        }),
      );
      osc.frequency.setValueAtTime(s.f * (i ? s.ratio : 1), start);
      gain.gain.setValueAtTime(0, audio.currentTime);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime((s.volume / 100) * 0.16, start + 0.03);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
      osc.start(start);
      nodes.push({ osc, gain });
    }
  }

  async function toggleSound() {
    if (sounding) return stopSound();
    try {
      W.narration.stop();
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw Error('No Web Audio');
      audio ??= new AudioContext();
      await audio.resume();
      if (!W.stage.isShowing(room)) return;
      sounding = true;
      // Sound plays at once, but with reduced motion the picture stays still until Play.
      if (!W.prefersReducedMotion()) W.stage.setPlaying(true);
      startTones();
      $('scene-action').textContent = t.soundOn;
      W.stage.sync();
    } catch {
      stopSound();
      W.toast(t.noSound);
    }
  }

  function draw(ctx, s, stage) {
    const { width: cw, height: ch, clock } = stage;
    ctx.clearRect(0, 0, cw, ch);
    const colors = ['#a9d9ef', '#d4a5f5', '#dcf6ac'];
    if (s.portrait) {
      const r = Math.min(cw, ch) * 0.38,
        cx = cw / 2,
        cy = ch / 2;
      ctx.strokeStyle = '#263541';
      ctx.beginPath();
      ctx.moveTo(cx - r - 14, cy);
      ctx.lineTo(cx + r + 14, cy);
      ctx.moveTo(cx, cy - r - 14);
      ctx.lineTo(cx, cy + r + 14);
      ctx.stroke();
      const t0 = clock * 0.18,
        ph = (s.phase * Math.PI) / 180;
      ctx.lineWidth = 1.2;
      for (let j = 0; j < 1200; j++) {
        const a = t0 + (j / 1200) * TAU * 8,
          b = t0 + ((j + 1) / 1200) * TAU * 8;
        ctx.strokeStyle = `hsla(${170 + (j / 1200) * 110},80%,77%,${0.15 + (0.65 * j) / 1200})`;
        ctx.beginPath();
        ctx.moveTo(cx + r * Math.sin(a), cy + r * Math.sin(a * s.ratio + ph));
        ctx.lineTo(cx + r * Math.sin(b), cy + r * Math.sin(b * s.ratio + ph));
        ctx.stroke();
      }
      ctx.fillStyle = '#b6c0d4';
      ctx.font = '12px system-ui';
      ctx.fillText(t.labels.firstTone, 12, ch - 10);
      ctx.textAlign = 'right';
      ctx.fillText(t.labels.secondTone, cw - 12, ch - 10);
      ctx.textAlign = 'left';
      return;
    }
    const top = 22,
      bottom = 25,
      rows = (ch - top - bottom) / 3,
      amp = rows * 0.21;
    for (let row = 0; row < 3; row++) {
      const cy = top + rows * (row + 0.5);
      ctx.strokeStyle = '#293445';
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(cw, cy);
      ctx.stroke();
      ctx.fillStyle = colors[row];
      ctx.font = '12px system-ui';
      const label = row === 0 ? t.labels.a(s.f) : row === 1 ? t.labels.b(tenths(s.f * s.ratio)) : t.labels.sum;
      ctx.fillText(label, 5, cy - amp - 9);
      ctx.strokeStyle = colors[row];
      ctx.lineWidth = row === 2 ? 2 : 1.4;
      ctx.beginPath();
      for (let x = 0; x <= cw; x += 2) {
        const y = cy - wavePoint(x / cw, row, s, clock) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (row === 2) {
        ctx.globalAlpha = 0.12;
        ctx.lineTo(cw, cy);
        ctx.lineTo(0, cy);
        ctx.closePath();
        ctx.fillStyle = colors[row];
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  const room = W.defineRoom({
    id: 'waves',
    symbol: '∿',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    tagline: t.tagline,
    accent: { background: '#24233a', border: '#9a96d1', color: '#d0ccff' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneName,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'motion' },

    defaults: { f: 220, ratio: 1.5, phase: 0, volume: 20, portrait: false },
    ranges: { f: [110, 440], ratio: [0.5, 2], phase: [0, 360], volume: [0, 50] },
    defaultPreset: 0,
    presets: [
      { badge: '3:2', settings: { f: 220, ratio: 1.5, phase: 0 } },
      { badge: '≈', settings: { f: 220, ratio: 1.02, phase: 0 } },
      { badge: '0', settings: { f: 220, ratio: 1, phase: 180 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Lissajous',
        color: '#b6b2e8',
        // A 19th-century physicist: dark hair receding from the brow, and a full beard.
        sketch: {
          hairStyle: 'receding',
          hair: '#2e2420',
          skin: '#efc7a5',
          beard: 'full',
          moustache: true,
          brows: 'bold',
          backdrop: '#e2e0ee',
        },
      },
      {
        ...t.guests[1],
        bio: 'Fourier',
        image: 'fourier.jpg',
        source: 'Joseph_Fourier.jpg',
        color: '#a4d8dc',
        frame: [160, -50, -21],
      },
    ],

    insight: {
      ...t.insight,
      onOpen(s) {
        $('beat-detail').textContent = t.beatDetail(s.f, tenths(s.f * s.ratio), tenths(beat(s)));
      },
    },

    controls: (s, stage) =>
      stage.slider('f', t.firstTone, 110, 440, 1, s.f, t.hz) +
      stage.slider('ratio', t.secondTone, 0.5, 2, 0.005, s.ratio, '×', t.secondToneHint) +
      stage.slider('phase', t.phase, 0, 360, 1, s.phase, '°') +
      stage.slider('volume', t.volume, 0, 50, 1, s.volume, '%') +
      `<div class="control wide"><span style="font-size:14px">${t.view}</span><div class="segment" role="group" aria-label="${t.viewGroup}">` +
      `<button id="view-waves" aria-pressed="${!s.portrait}">${t.viewWaves}</button><button id="view-portrait" aria-pressed="${s.portrait}">${t.viewPortrait}</button></div></div>`,

    bindControls(panel, s, stage) {
      for (const [id, portrait] of [
        ['view-waves', false],
        ['view-portrait', true],
      ]) {
        $(id).addEventListener('click', () => {
          s.portrait = portrait;
          $(id).setAttribute('aria-pressed', true);
          $(portrait ? 'view-waves' : 'view-portrait').setAttribute('aria-pressed', false);
          stage.draw();
        });
      }
    },

    readouts(s) {
      $('scene-status').textContent = t.status(Math.round(s.f), tenths(s.f * s.ratio));
      $('scene-action').textContent = sounding ? t.soundOn : t.soundOff;
    },

    draw,
    action: toggleSound,
    onInput: startTones,
    onPreset: startTones,
    reset: startTones,
    silence: stopSound,
    soundOn: () => sounding,
  });
})();
