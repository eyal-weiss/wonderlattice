/* Room · The hotel that is always full: Hilbert's hotel, endless coaches, and Cantor's coin-flip coach. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.hotel;
  const t = W.text('hotel');
  const reduced = W.prefersReducedMotion();

  const MOVE = 1.9; // seconds for every guest to walk to their new room
  const ENTER = 1.5; // seconds for the newcomers to walk in
  const STEP = 0.3; // depth from one door to the next, in units of the corridor's near end
  const DOORS = 160; // doors drawn at most (they shrink to nothing long before)
  const DEMO_START = 1.1; // the opening plays "+1" after this many seconds, then the coach with "×2"
  const DEMO_PAUSE = 3; // the pause between the guest's arrival and the coach's
  const FLIP_TIME = 0.5; // seconds per flip while the diagonal builds the new passenger
  // Cards offered at each level: one more guest, an endless coach, endless coaches, the coin-flip coach.
  const LEVEL_CARDS = [
    ['one', 'five', 'double'],
    ['one', 'five', 'double'],
    ['double', 'zigzag'],
    ['admit', 'shuffle'],
  ];
  const PRESET_LEVELS = [0, 2, 3];
  const NEWCOMER = '#ffd34d'; // newcomers are gold; the guests already here, cool colours
  const ROW_COLOURS = ['#8fb8f0', '#ffd34d', '#f08a5d', '#7fd6a0', '#d29bf0', '#f06d8f', '#5fd0d6'];
  const HEADS = '#f0c43c',
    TAILS = '#4f6f99';

  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const resident = (k) => `hsl(${200 + ((k * 47) % 70)}, 52%, ${58 + ((k * 13) % 14)}%)`;

  let level = 0,
    card = null, // the card being played at this level, or null while the arrival waits
    clockT = 0, // seconds since the card was played (the corridor), or rooms handed out so far (the coaches)
    demo = null, // { at, phase }: the opening's own moves, until the visitor takes over
    list = null, // the coin-flip coach: SIZE rooms × SIZE flips
    passenger = null, // its diagonal, flipped
    reveal = 0, // flips of the new passenger built so far
    note = 'built', // the coin-flip coach's latest event, for the status line
    aim = null, // the keyboard's aim in the list: { r, f }
    hover = null,
    pending = null, // the flip a press started on, switched when the press ends as a tap
    seed = 1,
    layout = null,
    told = '';

  // ------------------------------------------------------------- the story

  const corridorLevel = () => level <= 1;
  const corridorDone = () => card && clockT >= MOVE + ENTER;

  /** Back to the start of a level: the hotel full, the arrival waiting. */
  function begin(s) {
    level = s.level;
    card = null;
    clockT = 0;
    aim = null;
    hover = null;
    if (level === 3) {
      list = M.listFrom(s.lista, s.listb);
      rebuild(s, 'built');
    }
  }

  /** Play a card: every guest moves at once. Without motion (or paused), it happens at once. */
  function play(name, s, stage) {
    if (name === 'admit') {
      list = M.admit(list, passenger);
      return rebuild(s, 'admitted', stage);
    }
    if (name === 'shuffle') {
      [s.lista, s.listb] = M.randomNumbers(++seed * 7919 + s.lista);
      list = M.listFrom(s.lista, s.listb);
      return rebuild(s, 'shuffled', stage);
    }
    card = name;
    clockT = 0;
    if (reduced || !stage.playing) finish();
  }

  /** Jump to the end of what's playing. */
  function finish() {
    if (corridorLevel()) clockT = card ? MOVE + ENTER : 0;
    else if (level === 2) clockT = card ? coachRooms() : 0;
    else reveal = M.SIZE;
  }

  /** The coin-flip coach: a new list (or a changed one) builds its left-out passenger, flip by flip. */
  function rebuild(s, event, stage) {
    passenger = M.diagonal(list);
    [s.lista, s.listb] = M.numbersOf(list);
    note = event;
    reveal = event === 'edited' || reduced || (stage && !stage.playing) ? M.SIZE : 0;
  }

  /** The opening: "+1" for one guest, a pause, then an endless coach and "×2". */
  function runDemo(dt, s, stage) {
    if (!demo) return;
    demo.at += dt;
    if (demo.phase === 0 && demo.at >= DEMO_START) {
      play('one', s, stage);
      Object.assign(demo, { phase: 1, at: 0 });
    } else if (demo.phase === 1 && corridorDone() && demo.at >= MOVE + ENTER + DEMO_PAUSE) {
      s.level = 1;
      begin(s);
      stage.setChosen(-1);
      stage.refresh();
      Object.assign(demo, { phase: 2, at: 0 });
    } else if (demo.phase === 2 && demo.at >= DEMO_START) {
      play('double', s, stage);
      demo = null;
      stage.sync();
    }
  }

  // ---------------------------------------------------------------- words

  function statusText() {
    if (level === 3) {
      if (reveal < M.SIZE) return t.status.building(Math.min(M.SIZE, Math.floor(reveal) + 1));
      return t.status[note] ?? t.status.built;
    }
    if (!card) return t.status.waiting[level];
    if (level === 2) {
      const n = Math.floor(clockT);
      if (card === 'double') return t.status.double[2];
      if (n < coachRooms() && n >= 1) {
        const { row, seat } = M.unzig(n);
        return t.status.tracing(n, row, seat);
      }
      return t.status.zigzag;
    }
    if (!corridorDone()) return t.everyone(t.cards[card].face);
    return t.status[card][level];
  }

  /** The status line and scene name; a result is read out once, when it settles. */
  function report() {
    const words = statusText();
    if ($('scene-status').textContent !== words) $('scene-status').textContent = words;
    const name = t.sceneNames[level];
    if ($('scene-name').textContent !== name) $('scene-name').textContent = name;
    const settled =
      (corridorLevel() && corridorDone()) ||
      (level === 2 && card && clockT >= coachRooms()) ||
      (level === 3 && reveal >= M.SIZE);
    if (settled && words !== told && W.stage.isShowing(room)) {
      told = words;
      W.announce(words);
    } else if (!settled) told = '';
  }

  // ------------------------------------------------------------- corridor

  /** The corridor's shape for a canvas: the lobby on the left, the wall of doors receding to the right. */
  function corridorShape(width, height) {
    const lobby = clamp(width * 0.2, 64, 230);
    // On wide screens the window's fold cuts the picture's lower part, so the corridor sits high.
    const wide = width >= 600;
    return {
      width,
      height,
      lobby,
      x0: lobby,
      vx: width - 6,
      horizon: height * (wide ? 0.31 : 0.42),
      top0: height * (wide ? 0.05 : 0.08),
      foot0: height * (wide ? 0.5 : 0.6),
    };
  }

  /** A point on the wall at depth z (1 at the near end): x, the floor at its foot, and the ceiling. */
  function wallAt(c, z) {
    return {
      x: c.vx - (c.vx - c.x0) / z,
      foot: c.horizon + (c.foot0 - c.horizon) / z,
      top: c.horizon - (c.horizon - c.top0) / z,
    };
  }

  const doorDepth = (k) => 1 + (k - 1) * STEP; // where door k's stretch of wall begins

  /** Where a person stands: in door k's doorway, or in the queue on the floor in front of it. */
  function doorway(c, k, lane = 0) {
    const z = doorDepth(k) + STEP / 2;
    const p = wallAt(c, z);
    const tall = p.foot - p.top;
    return { x: p.x, foot: p.foot + lane * tall * 0.45, size: tall * 0.46 };
  }

  /** The lone newcomer's place, beside the desk in the lobby. */
  function lobbySpot(c) {
    const tall = c.foot0 - c.top0;
    return { x: c.lobby * 0.5, foot: c.foot0 + (c.foot0 - c.top0) * 0.2, size: tall * 0.5 };
  }

  const mix = (a, b, u) => ({
    x: a.x + (b.x - a.x) * u,
    foot: a.foot + (b.foot - a.foot) * u,
    size: a.size + (b.size - a.size) * u,
  });

  function person(ctx, { x, foot, size }, colour, lift = 0) {
    if (size < 1.2) return;
    const y = foot - lift;
    const head = size * 0.17;
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.2, y);
    ctx.lineTo(x - size * 0.15, y - size * 0.62);
    ctx.quadraticCurveTo(x, y - size * 0.72, x + size * 0.15, y - size * 0.62);
    ctx.lineTo(x + size * 0.2, y);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - size * 0.62 - head * 1.15, head, 0, TAU);
    ctx.fill();
  }

  /** The doors, numbered while the numbers can still be read. */
  function doors(ctx, c, lit) {
    for (let k = 1; k <= DOORS; k++) {
      const a = wallAt(c, doorDepth(k) + STEP * 0.16),
        b = wallAt(c, doorDepth(k) + STEP * 0.84);
      const w = b.x - a.x;
      if (w < 0.8) break;
      const topA = a.foot - (a.foot - a.top) * 0.74,
        topB = b.foot - (b.foot - b.top) * 0.74;
      ctx.fillStyle = lit(k) ? '#3a3020' : '#0d121b';
      ctx.beginPath();
      ctx.moveTo(a.x, a.foot);
      ctx.lineTo(a.x, topA);
      ctx.lineTo(b.x, topB);
      ctx.lineTo(b.x, b.foot);
      ctx.closePath();
      ctx.fill();
      if (w > 2.5) {
        ctx.strokeStyle = '#b4925a';
        ctx.lineWidth = Math.max(0.6, w * 0.05);
        ctx.stroke();
      }
      const font = Math.min(18, w * 0.42);
      if (font >= 6) {
        const plaque = (a.foot - a.top) * 0.1;
        ctx.fillStyle = '#e8dcc0';
        ctx.font = `600 ${font}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(String(k), (a.x + b.x) / 2, Math.min(topA, topB) - plaque * 0.45);
      }
    }
  }

  /** Who is where in the corridor at this moment, and drawn far to near so nearer guests overlap farther ones. */
  function corridor(ctx, c, state) {
    const { width, height } = c;
    // Walls, floor and ceiling.
    const far = wallAt(c, 400);
    ctx.fillStyle = '#161d2a';
    ctx.beginPath();
    ctx.moveTo(c.x0, c.top0);
    ctx.lineTo(far.x, far.top);
    ctx.lineTo(far.x, far.foot);
    ctx.lineTo(c.x0, c.foot0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#10151f';
    ctx.beginPath();
    ctx.moveTo(c.x0, c.foot0);
    ctx.lineTo(far.x, far.foot);
    ctx.lineTo(width, height);
    ctx.lineTo(c.x0, height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2b3446';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.x0, c.top0);
    ctx.lineTo(far.x, far.top);
    ctx.moveTo(c.x0, c.foot0);
    ctx.lineTo(far.x, far.foot);
    ctx.stroke();

    const { card: played, u, v, coach } = state;
    const moved = played ? ease(u) : 0;
    const occupied = new Set();
    // Guests already here: guest k walks from door k to door moveTo(k).
    const guests = [];
    for (let k = 1; k <= DOORS; k++) {
      const target = played ? M.moveTo(played, k) : k;
      const from = doorway(c, k),
        to = doorway(c, target);
      if (from.size < 1.2 && to.size < 1.2) break;
      const at = mix(from, to, moved);
      const lift = played && u > 0 && u < 1 ? Math.sin(Math.PI * u) * at.size * 0.12 : 0;
      guests.push({ at, colour: resident(k), lift });
      if (moved >= 1) occupied.add(target);
      else if (!played) occupied.add(k);
    }
    // Newcomers: the lone guest from the lobby, or the coach's passengers from the queue.
    const comers = [];
    const count = coach ? DOORS : 1;
    for (let j = 1; j <= count; j++) {
      const start = coach ? doorway(c, j, 1) : lobbySpot(c);
      if (coach && start.size < 1.2) break;
      const room = played ? M.newcomerRoom(played, j) : 0;
      if (!room) {
        comers.push({ at: start, colour: NEWCOMER, lift: 0 });
        continue;
      }
      const end = doorway(c, room);
      const w = ease(v);
      comers.push({
        at: mix(start, end, w),
        colour: NEWCOMER,
        lift: v > 0 && v < 1 ? Math.sin(Math.PI * v) * start.size * 0.1 : 0,
      });
      if (w >= 1) occupied.add(room);
    }
    doors(ctx, c, (k) => occupied.has(k));
    // Farthest first.
    const all = [...guests, ...comers].sort((a, b) => a.at.size - b.at.size);
    for (const g of all) person(ctx, g.at, g.colour, g.lift);
  }

  /** The lobby: a sign, a desk, the card being played, and a coach at the kerb. */
  function lobby(ctx, c, state, vacant) {
    const { lobby: w } = c;
    ctx.fillStyle = '#121925';
    ctx.fillRect(0, 0, w, c.height);
    ctx.strokeStyle = '#2b3446';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w + 0.5, 0);
    ctx.lineTo(w + 0.5, c.height);
    ctx.stroke();
    // The sign.
    const words = vacant ? t.vacant : t.full;
    const size = clamp(w * 0.12, 9, 20);
    ctx.font = `700 ${size}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const y = Math.max(size + 6, c.top0 * 0.75);
    ctx.shadowColor = vacant ? '#62e08a' : '#ff5a4e';
    ctx.shadowBlur = 10;
    ctx.fillStyle = vacant ? '#9af0b4' : '#ff8a7e';
    ctx.fillText(words, w / 2, y, w - 10);
    ctx.shadowBlur = 0;
    // The desk, where the lone guest waits (the coach parks there instead).
    const desk = c.foot0 + (c.foot0 - c.top0) * 0.06;
    if (!state.coach) {
      ctx.fillStyle = '#5a4128';
      ctx.fillRect(w * 0.1, desk - (c.foot0 - c.top0) * 0.16, w * 0.8, (c.foot0 - c.top0) * 0.16);
      ctx.fillStyle = '#7a5a38';
      ctx.fillRect(w * 0.06, desk - (c.foot0 - c.top0) * 0.17, w * 0.88, 4);
    }
    // The card being played.
    if (state.card) {
      const cw = clamp(w * 0.5, 34, 90),
        ch = cw * 1.35;
      const cx = w / 2 - cw / 2,
        cy = y + size + 10;
      if (cy + ch < desk - (c.foot0 - c.top0) * 0.2) {
        ctx.fillStyle = '#f4ecd8';
        ctx.beginPath();
        ctx.roundRect(cx, cy, cw, ch, 6);
        ctx.fill();
        ctx.fillStyle = '#1b2230';
        ctx.font = `700 ${cw * 0.42}px system-ui, sans-serif`;
        ctx.direction = 'ltr';
        ctx.fillText(t.cards[state.card].face, w / 2, cy + ch / 2, cw - 6);
        ctx.direction = 'inherit';
      }
    }
    // The coach at the kerb, or the lone guest's place, and a label under it.
    const spot = lobbySpot(c);
    if (state.coach) {
      const bw = w * 0.8,
        bh = Math.min(bw * 0.55, spot.size * 0.7);
      const bx = w * 0.1,
        by = spot.foot - bh;
      ctx.fillStyle = '#c8553d';
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 6);
      ctx.fill();
      ctx.fillStyle = '#26303f';
      for (let i = 0; i < 3; i++) ctx.fillRect(bx + 6 + (i * (bw - 12)) / 3, by + 5, (bw - 12) / 3 - 4, bh * 0.35);
    }
    const font = clamp(w * 0.085, 9, 13);
    ctx.font = `600 ${font}px system-ui, sans-serif`;
    ctx.fillStyle = '#ffe9a8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(state.coach ? t.coach : t.guest, w / 2, Math.min(c.height - 6, spot.foot + font + 8), w - 8);
  }

  function drawCorridor(ctx, width, height, state) {
    const c = corridorShape(width, height);
    // Vacancies while freed rooms wait for their newcomers, and for good when a card freed more than were needed.
    const spare = state.card && !state.coach && state.card !== 'one';
    const vacant = state.card && state.u >= 1 && (state.v < 1 || spare);
    lobby(ctx, c, state, vacant);
    corridor(ctx, c, state);
    if (state.coach && !state.quiet) {
      // The queue's label, on the floor in front of the first passengers.
      const p = doorway(c, 1, 1);
      ctx.font = `600 ${clamp(width * 0.016, 10, 14)}px system-ui, sans-serif`;
      ctx.fillStyle = '#ffe9a8';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(t.queue, c.x0 + 6, Math.min(height - 6, p.foot + 16), width - c.x0 - 12);
    }
    return c;
  }

  // ----------------------------------------------------------- the coaches

  /** The grid of coaches and seats, and a strip of rooms below it. */
  function coachShape(width, height) {
    const wide = width >= 600;
    const pad = 12;
    const rows = wide ? 6 : 4,
      seats = wide ? 9 : 6;
    const label = clamp(width * 0.13, 56, 100);
    const stripH = wide ? 96 : 46;
    const top = pad + (wide ? 26 : 18);
    const cell = Math.min((width - label - 2 * pad - 20) / seats, (height - top - stripH - pad - 10) / rows);
    const strip = Math.floor((width - 2 * pad) / (wide ? 22 : 15));
    return { wide, pad, rows, seats, label, cell, top, x: pad + label, stripH, strip };
  }

  /** The most rooms the coaches' picture shows: every seat in view gets one, and so does every room in the strip. */
  function coachRooms(width = W.stage.width, height = W.stage.height) {
    const g = coachShape(width, height);
    let most = g.strip;
    for (let r = 0; r < g.rows; r++) for (let s = 1; s <= g.seats; s++) most = Math.max(most, M.zigzag(r, s));
    return most;
  }

  const roomOf = (played, row, seat) => (played === 'double' ? M.doubleRoom(row, seat) : M.zigzag(row, seat));

  function drawCoaches(ctx, width, height, played, given) {
    const g = coachShape(width, height);
    const centre = (row, seat) => ({ x: g.x + (seat - 0.5) * g.cell, y: g.top + (row + 0.5) * g.cell });
    ctx.textBaseline = 'alphabetic';
    ctx.font = `600 ${g.wide ? 13 : 11}px system-ui, sans-serif`;
    ctx.fillStyle = '#98aab7';
    ctx.textAlign = 'left';
    ctx.fillText(t.seat, g.x, g.top - 8, width - g.x - g.pad);
    for (let r = 0; r < g.rows; r++) {
      const y = g.top + (r + 0.5) * g.cell;
      ctx.fillStyle = ROW_COLOURS[r % ROW_COLOURS.length];
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${g.wide ? 14 : 11}px system-ui, sans-serif`;
      ctx.fillText(r === 0 ? t.hotelRow : t.coachRow(r), g.x - 8, y, g.label - 10);
    }
    // More coaches below and more seats to the right.
    ctx.fillStyle = '#6f8090';
    ctx.textAlign = 'center';
    ctx.font = `600 ${g.wide ? 18 : 14}px system-ui, sans-serif`;
    ctx.fillText('…', g.x + g.seats * g.cell + 10, g.top + g.cell * 0.5);
    ctx.fillText('⋮', g.x - g.label / 2, g.top + g.rows * g.cell + 6);

    // The zigzag, drawn up to the room it has reached, leaving the grid and coming back.
    if (played === 'zigzag' && given > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        g.x - g.cell * 0.4,
        g.top - g.cell * 0.4,
        g.seats * g.cell + g.cell * 0.8,
        g.rows * g.cell + g.cell * 0.8,
      );
      ctx.clip();
      ctx.strokeStyle = 'rgba(255, 233, 168, 0.75)';
      ctx.lineWidth = g.wide ? 2.5 : 1.8;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const last = Math.floor(given);
      for (let n = 1; n <= last; n++) {
        const { row, seat } = M.unzig(n);
        const p = centre(row, seat);
        if (n === 1) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      // The last stretch grows smoothly to the next seat.
      const a = M.unzig(last),
        b = M.unzig(last + 1);
      const pa = centre(a.row, a.seat),
        pb = centre(b.row, b.seat),
        u = given - last;
      ctx.lineTo(pa.x + (pb.x - pa.x) * u, pa.y + (pb.y - pa.y) * u);
      ctx.stroke();
      ctx.restore();
    }

    // Seats: a circle in the row's colour, with the room it got.
    const radius = g.cell * 0.36;
    for (let r = 0; r < g.rows; r++)
      for (let s = 1; s <= g.seats; s++) {
        const { x, y } = centre(r, s);
        const colour = ROW_COLOURS[r % ROW_COLOURS.length];
        const room = played ? roomOf(played, r, s) : 0;
        const has = room && room <= given;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        if (has) {
          ctx.fillStyle = colour;
          ctx.fill();
          ctx.fillStyle = '#10151f';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = `700 ${Math.min(radius * 0.9, room > 99 ? radius * 0.75 : radius)}px system-ui, sans-serif`;
          ctx.fillText(String(room), x, y + 1, radius * 1.8);
        } else {
          ctx.strokeStyle = colour;
          ctx.globalAlpha = played === 'double' && r >= 2 ? 0.3 : 0.6;
          ctx.lineWidth = 1.5;
          ctx.setLineDash(played === 'double' && r >= 2 ? [3, 3] : []);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
      }

    // The rooms, each coloured by the row its new guest came from.
    const top = height - g.stripH - g.pad + (g.wide ? 18 : 14);
    ctx.font = `600 ${g.wide ? 13 : 11}px system-ui, sans-serif`;
    ctx.fillStyle = '#98aab7';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(t.rooms, g.pad, top - 6, width - 2 * g.pad);
    const box = (width - 2 * g.pad) / g.strip;
    const tall = g.stripH - (g.wide ? 18 : 14) - 4;
    for (let n = 1; n <= g.strip; n++) {
      const x = g.pad + (n - 1) * box;
      let colour = null;
      if (played && n <= given) {
        if (played === 'zigzag') colour = ROW_COLOURS[M.unzig(n).row % ROW_COLOURS.length];
        else colour = ROW_COLOURS[n % 2 ? 1 : 0];
      }
      ctx.fillStyle = colour ?? '#1b2433';
      ctx.fillRect(x + 1, top, box - 2, tall);
      if (box >= 17) {
        ctx.fillStyle = colour ? '#10151f' : '#6f8090';
        ctx.textAlign = 'center';
        ctx.font = `600 ${Math.min(11, box * 0.48)}px system-ui, sans-serif`;
        ctx.fillText(String(n), x + box / 2, top + tall - 5, box - 2);
      }
    }
    return g;
  }

  // ------------------------------------------------------- the coin-flip list

  /**
   * The new passenger on top (so the window's fold never hides them), the list of rooms below. Its rows and columns
   * share one cell size, as large as the picture allows.
   */
  function listShape(width, height) {
    const wide = width >= 600;
    const pad = 12;
    const label = clamp(width * 0.14, 50, 110);
    const head = wide ? 24 : 16;
    const gap = wide ? 22 : 10;
    const cell = Math.min(
      (width - label - 2 * pad - 24) / M.SIZE,
      (height - 2 * pad - 2 * head - gap) / (M.SIZE + 1.05),
    );
    const x = Math.max(pad + label, Math.min((width - M.SIZE * cell) / 2, width * 0.3));
    const passengerY = pad + head;
    return { wide, pad, label, head, gap, cell, x, passengerY, y: passengerY + cell + gap + head };
  }

  function coin(ctx, x, y, r, bit, glow) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = bit ? HEADS : TAILS;
    ctx.fill();
    if (glow) {
      ctx.strokeStyle = glow;
      ctx.lineWidth = Math.max(2, r * 0.22);
      ctx.beginPath();
      ctx.arc(x, y, r + ctx.lineWidth, 0, TAU);
      ctx.stroke();
    }
    ctx.fillStyle = bit ? '#2a2108' : '#e8eef5';
    ctx.font = `700 ${r * 1.05}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bit ? t.heads : t.tails, x, y + 1);
  }

  function drawList(ctx, width, height) {
    const g = listShape(width, height);
    const r = g.cell * 0.4;
    const py = g.passengerY + g.cell * 0.5;
    const column = (f) => g.x + (f + 0.5) * g.cell;

    // Faint threads from each diagonal flip up to the passenger's flip made from it, behind the coins.
    ctx.strokeStyle = 'rgba(255, 211, 77, 0.45)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    for (let f = 0; f < M.SIZE; f++) {
      if (reveal < f + 0.5) continue;
      ctx.beginPath();
      ctx.moveTo(column(f), g.y + (f + 0.5) * g.cell);
      ctx.lineTo(column(f), py);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // The new passenger: under the label, each flip the opposite of its column's diagonal flip.
    ctx.font = `600 ${g.wide ? 14 : 11}px system-ui, sans-serif`;
    ctx.fillStyle = NEWCOMER;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(t.passenger, g.x, g.passengerY - 7, g.cell * 4);
    if (reveal >= M.SIZE) {
      ctx.fillStyle = '#ffe9a8';
      ctx.textAlign = 'right';
      ctx.fillText(t.question, g.x + M.SIZE * g.cell + 14, g.passengerY - 7, g.cell * 4.4);
    }
    for (let f = 0; f < M.SIZE; f++) {
      if (reveal >= f + 0.5) coin(ctx, column(f), py, r, passenger[f], NEWCOMER);
      else {
        ctx.strokeStyle = '#3a4656';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(column(f), py, r, 0, TAU);
        ctx.stroke();
      }
    }
    const more = (y) => {
      ctx.fillStyle = '#6f8090';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${g.wide ? 16 : 12}px system-ui, sans-serif`;
      ctx.fillText('…', g.x + M.SIZE * g.cell + 4, y);
    };
    more(py);

    // The list: room k's passenger, flip by flip, with the diagonal ringed as it is read.
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.font = `600 ${g.wide ? 13 : 11}px system-ui, sans-serif`;
    ctx.fillStyle = '#98aab7';
    ctx.fillText(t.flips, g.x, g.y - 7, width - g.x - g.pad);
    for (let row = 0; row < M.SIZE; row++) {
      const y = g.y + (row + 0.5) * g.cell;
      ctx.font = `600 ${g.wide ? 14 : 11}px system-ui, sans-serif`;
      ctx.fillStyle = '#c9d4e0';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.room(row + 1), g.x - 8, y, g.label - 4);
      for (let f = 0; f < M.SIZE; f++)
        coin(ctx, column(f), y, r, list[row][f], f === row && row < reveal ? '#ffffff' : null);
      more(y);
    }
    ctx.fillStyle = '#6f8090';
    ctx.textAlign = 'center';
    ctx.fillText('⋮', g.x - g.label / 2, Math.min(height - 8, g.y + M.SIZE * g.cell + 4));

    // Keyboard aim and the flip under the mouse.
    for (const at of [hover, aim]) {
      if (!at) continue;
      ctx.strokeStyle = '#ffe9a8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(g.x + at.f * g.cell + 1, g.y + at.r * g.cell + 1, g.cell - 2, g.cell - 2);
    }
    return g;
  }

  /** The flip under a canvas point (unit coordinates), or null. */
  function flipAt(p, stage) {
    if (level !== 3 || !layout) return null;
    const g = layout;
    const f = Math.floor((p.x * stage.width - g.x) / g.cell),
      r = Math.floor((p.y * stage.height - g.y) / g.cell);
    return f < 0 || r < 0 || f >= M.SIZE || r >= M.SIZE ? null : { r, f };
  }

  // -------------------------------------------------------------- drawing

  const corridorState = () => ({
    card,
    coach: level === 1,
    u: card ? clamp(clockT / MOVE, 0, 1) : 0,
    v: card ? clamp((clockT - MOVE) / ENTER, 0, 1) : 0,
  });

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    if (level === 3 && list) layout = drawList(ctx, width, height);
    else if (level === 2) layout = drawCoaches(ctx, width, height, card, clockT);
    else layout = drawCorridor(ctx, width, height, corridorState());
    report();
  }

  /** The home card: the corridor mid-way through "×2", a coach's passengers walking in. */
  function preview(ctx, width, height) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    drawCorridor(ctx, width, height, { card: 'double', coach: true, u: 1, v: 0.55, quiet: true });
  }

  // ----------------------------------------------------------------- room

  const defaults = { level: 0, lista: 2774729013, listb: 1496365347 };

  /** The cards for this level, as buttons. */
  function cardButtons(at) {
    return LEVEL_CARDS[at]
      .map((name) => {
        const c = t.cards[name];
        return (
          `<button type="button" class="button hotel-card" data-card="${name}" aria-pressed="false">` +
          `<span class="hotel-face">${c.face}</span><span class="hotel-rule">${c.rule}</span></button>`
        );
      })
      .join('');
  }

  const room = W.defineRoom({
    id: 'hotel',
    symbol: '∞',
    theme: 'games',
    added: '2026-10-07',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2a1d1b', border: '#d9a45b', color: '#f6dcae' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames[0],
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'floor' },

    defaults,
    ranges: {
      level: [0, 3, 'integer'],
      lista: [0, 4294967295, 'integer'],
      listb: [0, 4294967295, 'integer'],
    },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({
      ...p,
      badge: ['+1', '⁘', '◐'][i],
      settings: { level: PRESET_LEVELS[i] },
    })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Hilbert',
        color: '#d9a45b',
        sketch: {
          hairStyle: 'receding',
          hair: '#9a8f80',
          skin: '#efcdb0',
          beard: 'short',
          moustache: true,
          glasses: 'round',
          backdrop: '#2a1d1b',
        },
      },
      {
        ...t.guests[1],
        bio: 'Cantor',
        color: '#f0c43c',
        sketch: { hairStyle: 'receding', hair: '#5a4a3a', skin: '#ecc9a8', beard: 'full', backdrop: '#1d2230' },
      },
      {
        ...t.guests[2],
        bio: 'Gamow',
        color: '#8fb8f0',
        sketch: { hairStyle: 'swept', hair: '#c9b48a', skin: '#f0d0b4', glasses: 'round', backdrop: '#1d2633' },
      },
    ],

    insight: t.insight,

    // Called before enter(), so it reads the level from the settings.
    controls: (s) =>
      `<div class="hotel-pick wide"><p>${s.level === 3 ? t.listHint : t.pick}</p>` +
      `<div class="hotel-cards">${cardButtons(s.level)}</div></div>`,

    bindControls(panel, s, stage) {
      panel.querySelectorAll('[data-card]').forEach((button) =>
        button.addEventListener('click', () => {
          demo = null;
          play(button.dataset.card, s, stage);
          stage.setChosen(-1);
          stage.sync();
          stage.draw();
        }),
      );
    },

    readouts() {
      document.querySelectorAll('#scene-controls [data-card]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.card === card));
      });
    },

    enter(s, stage) {
      begin(s);
      pending = null;
      demo = null;
      if (level === 0) {
        // The opening shows the hotel at work by itself: with reduced motion, one guest already in.
        if (reduced) play('one', s, stage);
        else demo = { at: 0, phase: 0 };
      }
      stage.draw();
    },

    step(dt, s, stage) {
      runDemo(dt, s, stage);
      if (corridorLevel() && card && clockT < MOVE + ENTER) clockT = Math.min(MOVE + ENTER, clockT + dt);
      else if (level === 2 && card) {
        const most = coachRooms();
        if (clockT < most) clockT = Math.min(most, clockT + dt * (2.5 + clockT * 0.2));
      } else if (level === 3 && reveal < M.SIZE) reveal = Math.min(M.SIZE, reveal + dt / FLIP_TIME);
    },

    draw,
    preview,

    /** The next arrival: one guest, a coach, endless coaches, the coin-flip coach, and round again. */
    action(s, stage) {
      demo = null;
      s.level = (level + 1) % 4;
      begin(s);
      if (reduced || !stage.playing) finish();
      stage.setChosen(PRESET_LEVELS.indexOf(s.level));
      stage.refresh();
      stage.draw();
    },
    reset(s, stage) {
      demo = null;
      begin(s);
      if (level === 3 && (reduced || !stage.playing)) finish();
      stage.sync();
      stage.draw();
    },
    onPreset(s, stage) {
      demo = null;
      begin(s);
      if (level === 3 && (reduced || !stage.playing)) finish();
      stage.draw();
    },

    pointer: {
      down(p, s, stage, e) {
        pending = e && e.button > 0 ? null : flipAt(p, stage);
      },
      move(p, { mouse, dragging }, s, stage) {
        const at = flipAt(p, stage);
        if (dragging && pending && (!at || at.r !== pending.r || at.f !== pending.f)) pending = null;
        const before = hover;
        hover = mouse && !dragging ? at : null;
        if ((hover?.r !== before?.r || hover?.f !== before?.f) && !stage.playing) stage.draw();
      },
      up(e) {
        const at = pending;
        pending = null;
        if (e?.type === 'pointerup' && at) flip(at, W.stage.settingsFor('hotel'), W.stage);
      },
      leave() {
        hover = null;
      },
      escape: () => (aim = null),
      arrow(dx, dy) {
        if (level !== 3) return;
        // The first press shows the aim on room 1's first flip.
        aim = aim ? { r: clamp(aim.r + dy, 0, M.SIZE - 1), f: clamp(aim.f + dx, 0, M.SIZE - 1) } : { r: 0, f: 0 };
      },
      key(e, s, stage) {
        if (e.key !== 'Enter' || level !== 3) return false;
        aim ??= { r: 0, f: 0 };
        flip(aim, s, stage);
        return true;
      },
    },
  });

  /** Switch one flip of the list by hand: the diagonal passenger changes with it, and is still left out. */
  function flip(at, s, stage) {
    if (level !== 3 || !list) return;
    list = M.toggle(list, at.r, at.f);
    rebuild(s, 'edited', stage);
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
  }
})();
