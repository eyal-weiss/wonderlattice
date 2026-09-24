/* Room · Hear the shape: two tones, their sum, beats, and a Lissajous portrait. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, TAU } = W;
  const { wavePoint, beat } = W.models.waves;

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
    if (W.stage.isShowing(room)) $('scene-action').textContent = 'Turn sound on';
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
      W.stage.setPlaying(true);
      startTones();
      $('scene-action').textContent = 'Sound on · mute';
      W.stage.sync();
    } catch {
      stopSound();
      W.toast('Sound is unavailable in this browser. You can still explore the waves.');
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
      ctx.fillText('FIRST TONE →', 12, ch - 10);
      ctx.textAlign = 'right';
      ctx.fillText('SECOND TONE ↑', cw - 12, ch - 10);
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
      const label =
        row === 0 ? 'A · ' + s.f + ' Hz' : row === 1 ? 'B · ' + (s.f * s.ratio).toFixed(1) + ' Hz' : 'A + B · COMBINED';
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
    eyebrow: 'WAVES & SOUND',
    name: 'Hear the shape',
    theme: 'signals',
    tagline: 'Two tones combine into beats, silence, and a looping portrait.',
    accent: { background: '#24233a', border: '#9a96d1', color: '#d0ccff' },

    title: 'Hear the shape.',
    subtitle: 'Two tones. A little space between them. Listen to what changes.',
    field: 'Waves · Ratios · Interference',
    sceneLabel: 'A conversation in waves',
    sceneName: 'Two tones, together',
    tip: 'Slow-motion wave model · Sound plays at real pitch',
    actionLabel: 'Turn sound on',
    canvasLabel: 'Two sine waves and their combined signal. Choose Circle portrait for a second representation.',
    panelEyebrow: 'Listen & look',
    whyLabel: 'Why does this happen?',
    nudge: 'Try “Almost in tune.” Hear the volume swell and fade as two close pitches drift in and out of step.',
    connection: {
      html: '<strong>Circles become waves.</strong> The height of a point going around a circle follows a sine wave. Combine circular motions, and you’re back in the drawing studio.',
      go: 'motion',
      label: 'Paint with these ideas',
    },

    defaults: { f: 220, ratio: 1.5, phase: 0, volume: 20, portrait: false },
    ranges: { f: [110, 440], ratio: [0.5, 2], phase: [0, 360], volume: [0, 50] },
    defaultPreset: 0,
    presets: [
      {
        name: 'A perfect fifth',
        note: 'A simple 3:2 relationship.',
        badge: '3:2',
        settings: { f: 220, ratio: 1.5, phase: 0 },
      },
      {
        name: 'Almost in tune',
        note: 'Two nearby tones make a pulse.',
        badge: '≈',
        settings: { f: 220, ratio: 1.02, phase: 0 },
      },
      {
        name: 'The sound of silence',
        note: 'Matching waves, half a turn apart.',
        badge: '0',
        settings: { f: 220, ratio: 1, phase: 180 },
      },
    ],

    guests: [
      {
        name: 'Jules Lissajous',
        note: 'Two simple vibrations can draw a surprisingly elaborate loop.',
        bio: 'Lissajous',
        image: 'lissajous.jpg',
        source: 'Jules_Antoine_Lissajous.jpeg',
        color: '#b6b2e8',
        frame: [200, -69, -30],
      },
      {
        name: 'Joseph Fourier',
        note: 'Many simple waves can hide inside one complicated sound.',
        bio: 'Fourier',
        image: 'fourier.jpg',
        source: 'Joseph_Fourier.jpg',
        color: '#a4d8dc',
        frame: [160, -50, -21],
      },
    ],

    insight: {
      title: 'When waves meet.',
      html: `<p>One tone is a smooth, repeating wave. Two tones add together: at each moment, their displacements reinforce or oppose each other. The bright bottom line is their sum.</p>
<h3>A rhythm inside two tones</h3>
<p>When two frequencies are close, their sum grows and shrinks in strength. Those pulses are called <em>beats</em>. Their rate is the difference between the frequencies.</p>
<div class="insight-visual" id="beat-detail"></div>
<h3>Two sounds can make silence</h3>
<p>Choose “The sound of silence.” Equal waves half a cycle apart cancel in this electronic mix. Real-world cancellation depends on where you listen and how the waves reach you.</p>
<h3>Look sideways</h3>
<p>Try “Circle portrait.” We use the first wave for the horizontal position and the second for the vertical position. The resulting Lissajous figure turns a relationship between rhythms into a shape.</p>
<details><summary>The mathematics, if you want it</summary><p>A(t) = sin(2πft)<br>B(t) = sin(2πfrt + φ)<br>The combined signal is A(t) + B(t).</p><p>The slow-motion model preserves the frequency ratio and starting phase. Audible tones run at the pitches shown. Simple ratios repeat quickly; nearby unequal pitches produce beats.</p></details>
<div class="sources"><a class="source-link" href="https://www.physicsclassroom.com/class/sound/Lesson-3/Interference-and-Beats" target="_blank" rel="noopener">Explore interference and beats</a></div>`,
      onOpen(s) {
        $('beat-detail').textContent =
          `Your tones: ${s.f} Hz and ${(s.f * s.ratio).toFixed(1)} Hz. Their frequency difference is ${beat(s).toFixed(1)} Hz.`;
      },
    },

    controls: (s, stage) =>
      stage.slider('f', 'First tone', 110, 440, 1, s.f, ' Hz') +
      stage.slider('ratio', 'Second tone', 0.5, 2, 0.005, s.ratio, '×', 'Relative to the first tone.') +
      stage.slider('phase', 'Starting phase', 0, 360, 1, s.phase, '°') +
      stage.slider('volume', 'Volume', 0, 50, 1, s.volume, '%') +
      '<div class="control wide"><span style="font-size:14px">Another way to see it</span><div class="segment" role="group" aria-label="Wave view">' +
      `<button id="view-waves" aria-pressed="${!s.portrait}">Adding waves</button><button id="view-portrait" aria-pressed="${s.portrait}">Circle portrait</button></div></div>`,

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
      $('scene-status').textContent = Math.round(s.f) + ' Hz + ' + (s.f * s.ratio).toFixed(1) + ' Hz';
      $('scene-action').textContent = sounding ? 'Sound on · mute' : 'Turn sound on';
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
