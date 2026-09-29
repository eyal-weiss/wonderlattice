/* Room · The leaning tower of blocks: how far can a stack reach past the edge? */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.blocks;
  const t = W.text('blocks');
  const reduced = W.prefersReducedMotion();

  // ── Colours ────────────────────────────────────────────────────────────────
  const COLORS = {
    bg: '#0a0e15',
    table: '#2a3340',
    tableEdge: '#4a6070',
    blockFill: '#b4eed3',
    blockStroke: '#7dc9a8',
    blockUnstable: '#f7816a',
    blockUnstableStroke: '#c95040',
    blockDrag: '#ddf6a3',
    blockDragStroke: '#a8d87a',
    tableLabel: '#6a8a9a',
    overLabel: '#a7c7c5',
    comLine: '#f7c998',
    milestonePass: '#ddf6a3',
    milestoneFail: '#4a5a6a',
    milestoneText: '#c5d6df',
    toppled: '#f7816a',
  };

  // ── Layout constants ────────────────────────────────────────────────────────
  const BLOCK_H = 0.054; // block height as a fraction of canvas height
  const MIN_BLOCK_PX = 16; // absolute minimum block height in px
  const MAX_BLOCK_PX = 40; // cap block height

  // pixel width of one "block-length" — derived per frame from canvas size
  // stored so pointer handlers can use it without passing stage around
  let unitPx = 100;
  let tableEdgePx = 0; // x-pixel of the table's right edge (x=0 in model coords)
  let stackBaseY = 0; // y-pixel of the bottom of the lowest block

  // ── Room state (outside of stage settings for simplicity) ──────────────────
  // centres[] mirrors s.centres (kept in sync); used by pointer handlers.
  // We store the raw centres in settings so they are shareable and trail-able.

  let dragging = false; // true while a drag is active
  let dragIndex = -1; // which block is being dragged (-1 = new block from tray)
  let dragOffsetX = 0; // offset inside the block where the pointer grabbed
  let toppleStart = 0; // clock time when topple started

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Current overhang of the top block's right edge in block-lengths. */
  function overhang(centres) {
    return M.stackOverhang(centres);
  }

  /**
   * Given an array of block centres, return the maximum allowed centre for block i
   * such that the combined CoM of blocks i…n-1 is exactly at the support edge.
   */
  function maxCentreAt(centres, i) {
    const n = centres.length;
    const supportEdge = i > 0 ? centres[i - 1] + 0.5 : 0;
    let sumAboveExcluding = 0;
    for (let k = i + 1; k < n; k++) sumAboveExcluding += centres[k];
    const count = n - i;
    return supportEdge * count - sumAboveExcluding;
  }

  /** Apply the "best stack" positions to the centres array in-place. */
  function applyBestStack(centres) {
    const n = centres.length;
    const opt = M.optimalStack(n);
    for (let i = 0; i < n; i++) centres[i] = opt[i];
  }

  // ── Drawing helpers ────────────────────────────────────────────────────────

  /** Convert model x (block-lengths, 0 = table edge) to canvas x-pixel. */
  const modelToX = (x) => tableEdgePx + x * unitPx;

  /** Convert canvas x-pixel to model x. */
  const xToModel = (px) => (px - tableEdgePx) / unitPx;

  /** Y-pixel for the bottom of block index i (0 = bottom). */
  const blockBottomY = (i, blockH) => stackBaseY - i * blockH;

  /** Draw a single block at model centre x, bottom y. */
  function drawBlock(ctx, cx, bottomY, blockH, blockW, fillStyle, strokeStyle) {
    const px = modelToX(cx) - blockW / 2;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.roundRect(px, bottomY - blockH, blockW, blockH, 3);
    ctx.fill();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  /** Draw the CoM marker (vertical dashed line) for the combined CoM above interface i. */
  function drawComLine(ctx, centres, i, blockH) {
    const n = centres.length;
    let sum = 0;
    for (let k = i; k < n; k++) sum += centres[k];
    const comX = modelToX(sum / (n - i));
    const y1 = blockBottomY(i, blockH);
    const y2 = blockBottomY(n, blockH);
    ctx.save();
    ctx.strokeStyle = COLORS.comLine;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(comX, y1);
    ctx.lineTo(comX, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /** Draw a milestone indicator on the right side of the canvas. */
  function drawMilestone(ctx, label, targetX, blockH, achieved, canvasWidth, canvasHeight) {
    const px = modelToX(targetX);
    if (px < 0 || px > canvasWidth) return;
    const y = blockBottomY(0, blockH) - blockH * 0.4;
    // vertical dashed line
    ctx.save();
    ctx.strokeStyle = achieved ? COLORS.milestonePass : COLORS.milestoneFail;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(px, 8);
    ctx.lineTo(px, y - 2);
    ctx.stroke();
    ctx.setLineDash([]);
    // small label at top
    ctx.fillStyle = achieved ? COLORS.milestonePass : COLORS.milestoneFail;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, px, 18);
    ctx.restore();
  }

  // ── Main draw ──────────────────────────────────────────────────────────────

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    const centres = s.centres;

    // Layout: table occupies left ~40% of the canvas, overhang area the rest.
    // The table's right edge is at ~40% of canvas width, but we also need to
    // leave room for the blocks to lean right; scale so optimal n-block stack fits.
    const n = centres.length;
    // Compute unitPx so the maximum possible overhang (for n blocks + 2 extra)
    // fits in the right portion of the canvas.
    const maxOH = Math.max(M.maxOverhang(n + 4), 1);
    const availRight = width * 0.58;
    unitPx = Math.max(20, Math.min(200, availRight / maxOH));

    // Vertical: blocks sit above the base line; reserve space for table visuals.
    const blockH = Math.max(MIN_BLOCK_PX, Math.min(MAX_BLOCK_PX, height * BLOCK_H));
    const blockW = unitPx; // block width = 1 block-length
    const tableH = height * 0.3; // table height in pixels
    const baseY = height * 0.7; // y of top surface of table / floor
    tableEdgePx = width * 0.35;
    stackBaseY = baseY; // the bottom of block 0 is at baseY

    // Clear
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Draw table
    ctx.fillStyle = COLORS.table;
    ctx.beginPath();
    ctx.roundRect(0, baseY, tableEdgePx, tableH, [0, 0, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = COLORS.tableEdge;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(tableEdgePx, baseY);
    ctx.stroke();
    // Table edge marker
    ctx.strokeStyle = COLORS.tableEdge;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(tableEdgePx, baseY);
    ctx.lineTo(tableEdgePx, baseY - blockH * (n + 1) - 8);
    ctx.stroke();
    ctx.setLineDash([]);

    // Once the stack has fallen, the guides and the overhang arrow go, and the status says so.
    const fallen = M.firstUnstableInterface(centres) >= 0;
    const status = $('scene-status');
    if (status) status.textContent = fallen ? t.toppled : t.status(n, overhang(centres));

    // Milestone lines (1, 2, 3 block-lengths)
    if (!fallen) drawMilestone(ctx, t.milestones.m1, 1, blockH, overhang(centres) >= 1, width, height);
    if (!fallen && n > 5) drawMilestone(ctx, t.milestones.m2, 2, blockH, overhang(centres) >= 2, width, height);
    if (!fallen && n > 20) drawMilestone(ctx, t.milestones.m3, 3, blockH, overhang(centres) >= 3, width, height);

    // Determine first unstable interface for highlighting
    const unstableAt = M.firstUnstableInterface(centres);

    if (unstableAt < 0) {
      toppleStart = 0;
    } else if (!toppleStart) {
      toppleStart = stage.clock || 0.001;
    }
    const toppleElapsed = toppleStart ? Math.max(0, stage.clock - toppleStart) : 0;

    // "Tray": a ghost block below the table edge if n < some max
    if (n < 50 && !dragging && unstableAt < 0) {
      // Draw a ghost block at the optimal next position
      const opt = M.optimalStack(n + 1);
      const nextCentre = opt.length > 0 ? opt[0] : 0;
      ctx.globalAlpha = 0.25;
      drawBlock(ctx, nextCentre, stackBaseY, blockH, blockW, COLORS.blockFill, COLORS.blockStroke);
      ctx.globalAlpha = 1;
    }

    // Draw blocks from bottom to top
    for (let i = 0; i < n; i++) {
      const isUnstable = unstableAt >= 0 && i >= unstableAt;
      const isTop = i === n - 1;
      const bottomY = blockBottomY(i, blockH);

      let fill = COLORS.blockFill;
      let stroke = COLORS.blockStroke;
      if (isUnstable) {
        fill = COLORS.blockUnstable;
        stroke = COLORS.blockUnstableStroke;
      } else if (isTop && !dragging) {
        // top block highlighted slightly
        fill = COLORS.blockDrag;
        stroke = COLORS.blockDragStroke;
      }

      ctx.save();
      if (isUnstable && toppleElapsed > 0) {
        // Find the pivot x
        let sum = 0;
        for (let k = unstableAt; k < n; k++) sum += centres[k];
        const com = sum / (n - unstableAt);
        const supportRight = unstableAt > 0 ? centres[unstableAt - 1] + 0.5 : 0;
        const supportLeft = unstableAt > 0 ? centres[unstableAt - 1] - 0.5 : -Infinity;
        const pivotModelX = com < supportLeft ? supportLeft : supportRight;
        const pivotDir = com < supportLeft ? -1 : 1;

        const pivotPx = modelToX(pivotModelX);
        const pivotPy = blockBottomY(unstableAt, blockH);

        const angle = Math.min(Math.PI / 2, toppleElapsed * toppleElapsed * 4) * pivotDir;
        const dropY = toppleElapsed > 0.5 ? (toppleElapsed - 0.5) * (toppleElapsed - 0.5) * 800 : 0;

        ctx.translate(pivotPx, pivotPy + dropY);
        ctx.rotate(angle);
        ctx.translate(-pivotPx, -pivotPy);
      }

      drawBlock(ctx, centres[i], bottomY, blockH, blockW, fill, stroke);

      // Block number label
      ctx.fillStyle = isUnstable ? '#fff' : '#0a1a14';
      ctx.font = `bold ${Math.max(9, blockH * 0.45)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(n - i), modelToX(centres[i]), bottomY - blockH / 2);
      ctx.restore();
    }

    // Show CoM lines for each interface if reduced motion or explicitly wanted
    if (!fallen && n > 0 && (reduced || n <= 6)) {
      for (let i = 0; i < n; i++) {
        drawComLine(ctx, centres, i, blockH);
      }
    }

    // Overhang readout arrow on the top block
    if (n > 0 && !fallen) {
      const topRight = modelToX(centres[n - 1] + 0.5);
      const edgePx = tableEdgePx;
      const arrowY = blockBottomY(n, blockH) - 15;
      if (topRight > edgePx + 4) {
        ctx.strokeStyle = COLORS.overLabel;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(edgePx, arrowY);
        ctx.lineTo(topRight, arrowY);
        ctx.stroke();
        // arrow heads
        for (const [x, dir] of [
          [edgePx, 1],
          [topRight, -1],
        ]) {
          ctx.beginPath();
          ctx.moveTo(x, arrowY);
          ctx.lineTo(x + dir * 6, arrowY - 4);
          ctx.lineTo(x + dir * 6, arrowY + 4);
          ctx.closePath();
          ctx.fillStyle = COLORS.overLabel;
          ctx.fill();
        }
      }

      // Overhang label below the arrow
      ctx.fillStyle = COLORS.overLabel;
      ctx.font = `11px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const midX = (edgePx + topRight) / 2;
      const oh = overhang(centres);
      ctx.fillText(t.lengthsLabel ? t.lengthsLabel(oh) : `${oh.toFixed(2)} lengths`, midX, arrowY - 4);
    }
  }

  // ── Readouts ───────────────────────────────────────────────────────────────

  function readouts(s) {
    const n = s.centres.length;
    const oh = overhang(s.centres);
    $('scene-status').textContent = t.status(n, oh);
    const sn = $('scene-name');
    if (sn) sn.textContent = t.sceneName(n);
    // Keep the slider (if any) in sync
    const input = $('c-blocks');
    if (input && Number(input.value) !== n) input.value = n;
  }

  // ── Pointer ────────────────────────────────────────────────────────────────

  /**
   * Find which block index is nearest to pointer position p (in canvas pixels),
   * or -1 if not near any block.
   */
  function blockAt(p, s, stage) {
    const n = s.centres.length;
    const blockH = Math.max(MIN_BLOCK_PX, Math.min(MAX_BLOCK_PX, stage.height * BLOCK_H));
    const blockW = unitPx;
    for (let i = n - 1; i >= 0; i--) {
      const cx = modelToX(s.centres[i]);
      const by = blockBottomY(i, blockH);
      if (
        p.x * stage.width >= cx - blockW / 2 - 4 &&
        p.x * stage.width <= cx + blockW / 2 + 4 &&
        p.y * stage.height >= by - blockH - 4 &&
        p.y * stage.height <= by + 4
      ) {
        return i;
      }
    }
    return -1;
  }

  // ── Controls ───────────────────────────────────────────────────────────────

  function controls(s, stage) {
    return (
      stage.slider('blocks', t.blocks, 0, 50, 1, s.centres.length, '', t.blocksHint) +
      '<div class="wide readout blocks-readout" id="blocks-readout"></div>'
    );
  }

  function bindControls(panel, s, stage) {
    // When the slider changes, rebuild the stack with that many blocks.
    const slider = $('c-blocks');
    if (!slider) return;
    slider.addEventListener('input', () => {
      const target = Math.max(0, Math.min(50, Number(slider.value)));
      const current = s.centres.length;
      if (target === current) return;
      if (target > current) {
        // Add blocks at optimal positions
        const opt = M.optimalStack(target);
        s.centres = opt.slice();
      } else {
        s.centres = s.centres.slice(s.centres.length - target);
        // Reposition: keep relative offsets but ensure stability
        if (target > 0) {
          const opt = M.optimalStack(target);
          s.centres = opt.slice();
        }
      }
      stage.refresh();
      stage.draw();
    });
  }

  // ── Room definition ────────────────────────────────────────────────────────

  W.defineRoom({
    id: 'blocks',
    symbol: '☰',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'engineering',
    tagline: t.tagline,
    accent: { background: '#192820', border: '#7dc9a8', color: '#b4eed3' },

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
    connection: { ...t.connection, go: 'floor' },

    defaults: { centres: [], blocks: 0 },
    ranges: { blocks: [0, 50, 'integer'] },
    defaultPreset: 0,

    presets: [
      {
        name: t.presets[0].name,
        note: t.presets[0].note,
        badge: '4',
        settings: { centres: M.optimalStack(4), blocks: 4 },
      },
      {
        name: t.presets[1].name,
        note: t.presets[1].note,
        badge: '31',
        settings: { centres: M.optimalStack(31), blocks: 31 },
      },
      {
        name: t.presets[2].name,
        note: t.presets[2].note,
        badge: '⋆',
        settings: { centres: M.optimalStack(12), blocks: 12 },
      },
    ],

    guests: [
      {
        ...t.guests[0],
        bio: 'Oresme',
        color: '#b4eed3',
        // Nicole Oresme: medieval bishop, dark robes. Drawn sketch — no image rights needed.
        sketch: { hairStyle: 'bald', hair: '#3a2a1a', skin: '#d4a882', backdrop: '#1e2d24' },
      },
      {
        ...t.guests[1],
        bio: 'Euler',
        color: '#f7c998',
        sketch: {
          hairStyle: 'wig',
          hair: '#d0c8b8',
          skin: '#e8c8a4',
          glasses: 'round',
          backdrop: '#2e2415',
        },
      },
    ],

    insight: t.insight,

    still: true, // no continuous animation needed

    controls,
    bindControls,
    readouts,
    draw,

    enter(s, stage) {
      // Start fresh with 4 blocks on first visit
      if (!s.centres || s.centres.length === 0) {
        s.centres = M.optimalStack(4);
        s.blocks = 4;
      }
      // renderControls runs before enter; call refresh so readouts show the updated state.
      stage.refresh();
    },

    /** "Best Stack" button: snap all blocks to their optimal positions. */
    action(s, stage) {
      const n = s.centres.length;
      if (n === 0) return;
      applyBestStack(s.centres);
      s.blocks = n;
      stage.refresh();
      stage.draw();
      W.announce(t.bestLabel);
    },

    reset(s, stage) {
      s.centres = [];
      s.blocks = 0;
      stage.setChosen(-1);
      stage.refresh();
      stage.draw();
      W.announce(t.resetLabel);
    },

    onPreset(s, stage) {
      // Presets carry pre-computed centres arrays; keep in sync.
      if (s.blocks !== undefined && s.blocks !== s.centres.length) {
        s.centres = M.optimalStack(s.blocks);
      }
      stage.refresh();
    },

    restore(saved, s) {
      if (Array.isArray(saved.centres)) {
        s.centres = saved.centres.map(Number);
        s.blocks = s.centres.length;
      }
    },

    pointer: {
      // Drag is only active when the pointer is on a block.
      drag(p, s, stage) {
        const i = blockAt(p, s, stage);
        return i >= 0;
      },

      down(p, s, stage) {
        const i = blockAt(p, s, stage);
        if (i < 0) {
          // Clicking outside blocks while stable: add a block at the optimal next position
          if (M.isStable(s.centres) && s.centres.length < 50) {
            const opt = M.optimalStack(s.centres.length + 1);
            s.centres = opt.slice();
            s.blocks = s.centres.length;
            stage.refresh();
            stage.draw();
          }
          return;
        }
        dragging = true;
        dragIndex = i;
        dragOffsetX = p.x * stage.width - modelToX(s.centres[i]);
        stage.draw();
      },

      move(p, { dragging: isDragging }, s, stage) {
        if (!isDragging || !dragging || dragIndex < 0) return;
        const rawX = xToModel(p.x * stage.width - dragOffsetX);
        // Clamp: block can't go further left than 0.5 past left canvas edge in model coords
        const maxRight = maxCentreAt(s.centres, dragIndex);
        s.centres[dragIndex] = Math.min(rawX, maxRight);
        stage.draw();
      },

      up() {
        dragging = false;
        dragIndex = -1;
      },

      leave() {
        dragging = false;
        dragIndex = -1;
      },

      escape(s, stage) {
        dragging = false;
        dragIndex = -1;
        stage.draw();
      },

      /** Arrow keys: left/right move the top block; up adds a block, down removes one. */
      arrow(dx, dy, s, stage) {
        const n = s.centres.length;
        if (dy < 0 && n < 50) {
          // up arrow (dy = -1): add a block
          const opt = M.optimalStack(n + 1);
          s.centres = opt.slice();
          s.blocks = s.centres.length;
          stage.refresh();
          stage.draw();
          return;
        }
        if (dy > 0 && n > 0) {
          // down arrow (dy = 1): remove top block
          s.centres = M.optimalStack(n - 1);
          s.blocks = s.centres.length;
          stage.refresh();
          stage.draw();
          return;
        }
        if (n === 0) return;
        // Left/right: nudge the top block
        const step = 0.02; // in block-lengths
        const raw = s.centres[n - 1] + dx * step;
        const maxRight = maxCentreAt(s.centres, n - 1);
        s.centres[n - 1] = Math.min(raw, maxRight);
        stage.draw();
      },

      /** B = Best Stack; +/- add/remove blocks. */
      key(e, s, stage) {
        if (e.key === 'b' || e.key === 'B') {
          const n = s.centres.length;
          if (n > 0) {
            applyBestStack(s.centres);
            stage.refresh();
            stage.draw();
            W.announce(t.bestLabel);
          }
          return true;
        }
        if (e.key === '+' || e.key === '=') {
          const n = s.centres.length;
          if (n < 50) {
            s.centres = M.optimalStack(n + 1);
            s.blocks = s.centres.length;
            stage.refresh();
            stage.draw();
          }
          return true;
        }
        if (e.key === '-' && s.centres.length > 0) {
          s.centres = M.optimalStack(s.centres.length - 1);
          s.blocks = s.centres.length;
          stage.refresh();
          stage.draw();
          return true;
        }
        return false;
      },
    },

    /** A preview for the home card: draw a small static 10-block stack. */
    preview(ctx, width, height) {
      const n = 10;
      const centres = M.optimalStack(n);
      const blockH = Math.max(MIN_BLOCK_PX * 0.6, Math.min(MAX_BLOCK_PX * 0.6, height * BLOCK_H));
      const blockW = width * 0.22;
      unitPx = blockW;
      tableEdgePx = width * 0.38;
      stackBaseY = height * 0.72;

      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = COLORS.table;
      ctx.fillRect(0, stackBaseY, tableEdgePx, height - stackBaseY);
      ctx.strokeStyle = COLORS.tableEdge;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, stackBaseY);
      ctx.lineTo(tableEdgePx, stackBaseY);
      ctx.stroke();

      for (let i = 0; i < n; i++) {
        const by = stackBaseY - i * blockH;
        const px = modelToX(centres[i]) - blockW / 2;
        ctx.fillStyle = i === n - 1 ? COLORS.blockDrag : COLORS.blockFill;
        ctx.strokeStyle = i === n - 1 ? COLORS.blockDragStroke : COLORS.blockStroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(px, by - blockH, blockW, blockH, 2);
        ctx.fill();
        ctx.stroke();
      }
    },
  });
})();
