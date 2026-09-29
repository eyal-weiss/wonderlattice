Wonderlattice.defineText('cube', 'fr', {
  eyebrow: 'MOUVEMENTS · GROUPES',
  name: 'Au cœur du cube casse-tête',
  tagline:
    'Deux rotations dans un autre ordre, un mouvement à répéter 105 fois pour revenir au départ, et des pièces qui bougent à peine.',
  title: 'Au cœur du cube casse-tête.',
  subtitle:
    'Oubliez la résolution. Répétez deux mouvements encore et encore, et comptez combien de temps il faut au cube pour revenir à son point de départ.',
  field: 'Groupes · Ordre · Annulation',
  sceneLabel: 'Un cube de mouvements',
  tip: 'Faites glisser, ou utilisez les flèches, pour tourner la vue',
  actionLabel: 'Le répéter',
  actionCompare: 'Les tourner',
  canvasLabel:
    'Un cube casse-tête. Utilisez les boutons de mouvement pour tourner ses faces ; faites glisser ou utilisez les flèches pour tourner la vue.',
  panelEyebrow: 'Combiner des mouvements',
  whyLabel: 'Pourquoi l’ordre compte-t-il ?',
  nudge:
    'Essayez « Retour au départ », puis « Répéter jusqu’au retour ». À votre avis, combien de répétitions lui faudra-t-il pour revenir au départ ?',
  connection: {
    html: '<strong>Des règles qu’on peut combiner et défaire.</strong> Un mouvement du cube est une règle qui dit où va chaque autocollant. Dans la salle du sudoku, des règles entre voisins décident où chaque couleur peut aller.',
    label: 'Visiter le sudoku',
  },
  sceneName: {
    one: 'Un cube',
    compare: 'Deux ordres',
  },
  modes: ['Un cube', 'Comparer deux ordres'],
  mode: 'Ce que vous explorez',
  faces: {
    U: 'du haut',
    R: 'de droite',
    F: 'avant',
    D: 'du bas',
    L: 'de gauche',
    B: 'arrière',
  },
  turn: (face, prime) => `tourner la face ${face} dans le sens ${prime ? 'antihoraire' : 'horaire'}`,
  moveLabel: (name, turn) => `${name} : ${turn}`,
  movePad: 'Construire une séquence',
  notation:
    'U = haut (up), R = droite (right), F = avant (front), D = bas (down), L = gauche (left), B = arrière (back) ; ′ tourne dans l’autre sens.',
  undo: 'Annuler',
  clear: 'Effacer',
  home: 'Répéter jusqu’au retour',
  highlight: 'Ne montrer que ce qui a bougé',
  first: 'Premier mouvement',
  second: 'Second mouvement',
  sequence: (text) => (text ? text : 'Aucun mouvement pour l’instant : appuyez sur une face'),
  times: (n) => (n === 1 ? 'fait une fois' : n === 0 ? 'pas encore fait' : `fait ${n} fois`),
  order: (n) => (n === 1 ? 'Rien à défaire : le cube ne bouge pas.' : `Revient au départ après ${n} répétitions.`),
  moved: (n) => (n === 0 ? 'Chaque pièce est à sa place.' : n === 1 ? '1 pièce déplacée.' : `${n} pièces déplacées.`),
  status: (n) => (n === 0 ? 'Résolu' : n === 1 ? '1 pièce déplacée' : `${n} pièces déplacées`),
  landed: (moved, done, order) =>
    (moved === 0
      ? 'Résolu. '
      : `Fait ${done === 1 ? 'une fois' : `${done} fois`}. ${moved} ${moved === 1 ? 'pièce déplacée' : 'pièces déplacées'}. `) +
    (order === 1 ? 'Le cube ne bouge pas.' : `Revient au départ après ${order} répétitions.`),
  full: 'Cela fait douze mouvements : répétez, annulez ou effacez.',
  restarted: 'Une nouvelle séquence commence ici.',
  compareLabels: (a, b) => [`${a} puis ${b}`, `${b} puis ${a}`],
  compareSame: 'Ces deux-là commutent : les deux ordres donnent le même cube.',
  compareDiffer: (n) =>
    `Mêmes deux mouvements, ordre différent : ${n} autocollants finissent à des places différentes.`,
  compareReady: 'Appuyez sur « Les tourner » pour faire les deux mouvements sur chaque cube.',
  presets: [
    {
      name: 'L’ordre compte',
      note: 'Droite puis haut, ou haut puis droite ?',
    },
    {
      name: 'Retour au départ',
      note: 'Répétez R U encore et encore.',
    },
    {
      name: 'Seules quelques pièces bougent',
      note: 'R U R′ U′, un commutateur.',
    },
    {
      name: 'Défaire à rebours',
      note: 'Pour défaire, inversez l’ordre.',
    },
  ],
  guests: [
    {
      name: 'Évariste Galois',
      note: 'Mort à vingt ans, il a laissé les débuts de la théorie des groupes : les mathématiques de la combinaison et de l’annulation.',
    },
  ],
  insight: {
    title: 'Des mouvements qu’on peut combiner et défaire.',
    html: `<p>Ce cube fonctionne comme le casse-tête Rubik’s Cube®, mais ici on joue avec ses mouvements au lieu de le résoudre. Voyez un mouvement du cube comme une règle : chaque autocollant va à une nouvelle place. Faire un mouvement puis un autre combine deux règles en une nouvelle. Chaque mouvement peut être défait. Et ne rien faire du tout est aussi un mouvement. Les mathématiciens appellent un ensemble de ce genre un <em>groupe</em>.</p>
<div class="insight-visual">R puis U, ce n’est pas U puis R. L’ordre compte.</div>
<h3>Défaire à rebours</h3>
<p>Pour défaire « R puis U », on défait d’abord le dernier mouvement : U′, puis R′. Comme quand on enlève ses chaussures puis ses chaussettes, on défait dans l’ordre inverse.</p>
<h3>Tout finit par revenir</h3>
<p>Répétez n’importe quelle séquence, et le cube finit par revenir à son point de départ, car il n’y a qu’un nombre fini de positions. R U demande 105 répétitions. R U R′ U′ n’en demande que 6. Aucune séquence n’en demande plus de 1 260.</p>
<h3>Des mouvements qui bougent à peine</h3>
<p>« Faire A, faire B, défaire A, défaire B » est un <em>commutateur</em>. Si A et B n’avaient aucun effet l’un sur l’autre, il ne ferait rien du tout. Comme ils ne se chevauchent qu’un peu, il ne dérange que quelques pièces : R U R′ U′ en déplace sept sur vingt-six. Les adeptes du cube utilisent les commutateurs pour arranger quelques pièces sans gâcher le reste.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Chaque mouvement est une permutation des 54 autocollants. Combiner des mouvements revient à composer des permutations. Une séquence revient au départ après le plus petit commun multiple des longueurs de ses cycles d’autocollants. R U déplace les autocollants le long de cycles de 3, 7 et 15 places, et le plus petit commun multiple de 3, 7 et 15 est 105.</p><p>Le cube a 43 252 003 274 489 856 000 positions, et chacune peut être résolue en 20 mouvements au plus, en comptant chaque rotation d’une face, quart ou demi-tour, comme un mouvement. Cela a été prouvé en 2010, au prix de beaucoup de temps de calcul.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Rubik%27s_Cube_group" target="_blank" rel="noopener">Le groupe des mouvements du cube (en anglais)</a><a class="source-link" href="https://www.cube20.org/" target="_blank" rel="noopener">Le nombre de Dieu est 20 (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Galois/" target="_blank" rel="noopener">Évariste Galois (en anglais)</a></div>`,
  },
});
