/*
 * Shared words (English): the app shell, the stage, the trail, visitors, and narration.
 * Each room keeps its own words in src/rooms/<id>/text.en.js; the fixed page text
 * lives in index.html (elements marked data-t). See docs/TRANSLATING.md.
 */
Wonderloom.defineLanguage('en', { name: 'English', dir: 'ltr', speech: 'en-US' });

Wonderloom.defineText('app', 'en', {
  themes: {
    shape: { name: 'Shape & space', blurb: 'Curves, surfaces, and the spaces they live in.' },
    chance: { name: 'Chance & evidence', blurb: 'Reasoning well when single events are unpredictable.' },
    games: { name: 'Games & puzzles', blurb: 'The hidden structure behind familiar games.' },
    making: { name: 'Making', blurb: 'Mathematics you can weave, fold, and keep.' },
    life: { name: 'Living patterns', blurb: 'Order that grows from many small interactions.' },
    signals: { name: 'Signals & networks', blurb: 'Waves, messages, and choices that travel.' },
  },
  roomBar: {
    previous: (name) => `Previous experiment: ${name}`,
    next: (name) => `Next experiment: ${name}`,
  },
  language: 'Language',
  pageTitle: (room) => `${room} · Wonderloom`,

  stage: {
    makeItYours: 'Make it yours',
    keep: '✧ Keep this moment',
    nudge: 'A little nudge',
    guestLabel: 'A visiting mathematician',
    canvasRole: 'interactive picture',
    pause: 'Pause',
    play: 'Play',
    saved: 'Your scene is ready to save.',
    saveFailed: 'Could not save this image.',
    shareText: (title) => `Wonderloom · ${title}`,
    linkCopied: 'Exploration link copied.',
    settingsCopied: 'Exploration settings copied.',
    linkDescription: 'Copy this link to reopen these settings.',
    settingsDescription: 'Copy these settings to recreate this exploration.',
  },

  narration: {
    listen: 'Listen to this idea',
    stop: 'Stop narration',
    unavailable: 'Narration is unavailable in this browser. The full text is here to read.',
    // How symbols are said aloud. Translators: use your language's words (keep the spaces).
    symbols: {
      '−': ' minus ',
      '×': ' times ',
      '→': ' to ',
      '↔': ' and ',
      '≈': ' about ',
      '±': ' plus or minus ',
      '²': ' squared ',
      '′': ' prime ',
      '√': ' root ',
      φ: ' phi ',
      θ: ' theta ',
      π: ' pi ',
      ᵀ: ' transposed ',
      '∞': ' infinity ',
      '≤': ' at most ',
      '≥': ' at least ',
      '|': ' ',
      '·': ' times ',
      '↗': ' ',
      '✧': ' ',
      '✕': ' ',
    },
  },

  guests: {
    eyebrowPortrait: 'Maths history · historical portrait',
    eyebrowSketch: 'Maths history · a playful sketch',
    story: 'Story ↗',
    storyLabel: (name) => `Story: read about ${name} (opens in a new tab)`,
    portrait: 'Portrait ↗',
    portraitLabel: (name) => `Portrait: the source of ${name}’s portrait (opens in a new tab)`,
    photo: (credit) => `Photo: ${credit}`,
    another: 'Meet another mathematician',
  },

  trail: {
    bridges: {
      'motion-waves': 'A turning circle can leave a wave in its wake.',
      'flock-traffic': 'A crowd can surprise itself, one local choice at a time.',
      'ribbon-motion': 'Follow a point and a shape can reveal another side.',
      'loom-flock': 'One small rule, repeated everywhere, can shape the whole.',
    },
    unreadable: 'Saved trail could not be read in this browser. You can import a previous export.',
    storageFull: 'Could not save here. Check available browser storage, or export your existing trail.',
    stillAlt: 'Still from this exploration',
    full: (max) => `Your trail has ${max} moments. Export it or remove one before saving another.`,
    notSaved: 'This scene could not be saved.',
    savedAlt: (room) => `Saved view of ${room}`,
    onReturning: 'On returning',
    revisit: 'Revisit',
    remove: 'Remove',
    empty: 'Your trail is empty. Save something that catches your eye, then return to it whenever you like.',
    explore: (room) => `Explore “${room}”`,
    returnTitle: (room) => `A moment you kept · ${room}`,
    thenYouNoticed: (note) => `Then you noticed: “${note}”`,
    noticeNow: 'What do you notice now?',
    tooLarge: 'Choose a Wonderloom trail export smaller than 2.4 MB.',
    imported: 'Trail imported. Your previous trail was replaced.',
    invalid: 'That file is not a valid Wonderloom trail export. Your trail was not changed.',
    thoughtSaved: 'Your new thought is saved. Come back to it whenever you like.',
  },
});
