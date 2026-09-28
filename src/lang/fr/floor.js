Wonderlattice.defineText('floor', 'fr', {
  eyebrow: 'INVARIANTS',
  name: 'Le sol impossible',
  tagline: 'Deux coins en moins, et aucun moyen de carreler le sol. Un coup d’œil aux couleurs le prouve.',
  title: 'Le sol impossible.',
  subtitle:
    'Couvrez le sol de dominos, deux cases chacun. Découvrez ensuite pourquoi certains sols ne peuvent jamais être terminés.',
  field: 'Casse-tête · Invariants · Preuve par les couleurs',
  sceneLabel: 'Huit sur huit · Dominos · Un motif caché',
  tip: 'Touchez deux cases voisines pour poser un domino, ou glissez de l’une à l’autre · Les flèches déplacent, Entrée touche',
  actionLabel: 'Regarder les couleurs',
  canvasLabel:
    'Un sol de huit cases sur huit, dont certaines ont été retirées, à couvrir de dominos qui couvrent chacun deux cases voisines.',
  panelEyebrow: 'Essayez de finir le sol',
  whyLabel: 'Pourquoi est-ce impossible ?',
  nudge:
    'Essayez de couvrir le sol sans les deux coins. Quand vous êtes bloqué, appuyez sur « Regarder les couleurs » et comptez.',
  connection: {
    html: '<strong>Une règle simple décide de tout.</strong> Ici, chaque domino couvre une case claire et une case foncée ; au sudoku, chaque ligne contient chaque symbole une seule fois.',
    label: 'Voir le sudoku comme un réseau',
  },

  presets: [
    { name: 'Deux coins en moins', note: 'Les coins opposés d’un échiquier.' },
    { name: 'Une de chaque couleur', note: 'Toujours possible. Pourquoi ?' },
    { name: 'Équilibré mais bloqué', note: 'Le compte est bon, et pourtant…' },
    { name: 'Un sol entier', note: 'Retirez les cases que vous voulez.' },
  ],

  modeLabel: 'Ce que fait un toucher',
  modes: ['Poser des dominos', 'Retirer des cases'],
  colours: 'Montrer les couleurs',
  solve: 'Montrer un pavage',
  clearDominoes: 'Enlever tous les dominos',
  yourFloor: 'Votre propre sol',
  byColour: 'Restantes, par couleur',
  squaresLeft: 'Cases libres',
  dominoes: 'Dominos posés',
  light: 'claires',
  dark: 'foncées',
  countLine: (light, dark) => `${light} claires · ${dark} foncées`,
  status: (laid, left) => (left ? `${laid} posés · ${left} cases restantes` : `Couvert de ${laid} dominos`),

  verdict: {
    start: 'Posez des dominos sur le sol, ou appuyez sur « Montrer un pavage ».',
    covered: (n) => `Couvert : ${n} dominos, toutes les cases utilisées.`,
    tiled: (n) => `Voici une façon de faire : ${n} dominos couvrent tout le sol.`,
    fresh: 'Vos dominos gênaient, alors voici un pavage depuis le début.',
    colours: (light, dark) =>
      `Impossible : il reste ${light} cases claires et ${dark} foncées, et chaque domino en couvre une de chaque couleur.`,
    stuck: (n) =>
      n === 1
        ? 'Impossible, bien que les couleurs s’équilibrent : une case n’a aucune voisine libre avec qui partager un domino.'
        : n
          ? `Impossible, bien que les couleurs s’équilibrent : un morceau de ${n} cases est isolé, et ses couleurs ne s’équilibrent pas.`
          : 'Impossible, bien que les couleurs s’équilibrent : on ne peut pas associer chaque case à une voisine.',
    oddSquares: 'Un nombre impair de cases ne peut jamais être couvert de dominos.',
  },

  squareLabel: (row, col, what) => `Ligne ${row}, colonne ${col} : ${what}`,
  what: { free: 'libre', hole: 'retirée', domino: 'couverte par un domino' },

  guests: [
    {
      name: 'Martin Gardner',
      note: 'Il a fait connaître ce casse-tête à des millions de lecteurs, et les couleurs ont été le rebondissement que personne n’attendait.',
    },
    {
      name: 'Ralph Gomory',
      note: 'Il a montré qu’en retirant une case claire et une case foncée, on obtient toujours un sol qu’on peut paver.',
    },
  ],

  insight: {
    title: 'Pourquoi le sol ne peut-il pas être pavé ?',
    html: `<p>Coloriez le sol comme un échiquier. Chaque domino, où que vous le posiez, couvre deux cases voisines, et deux cases voisines sont toujours de couleurs différentes. Chaque domino couvre donc exactement une case claire et une case foncée, et un sol terminé doit compter autant de cases claires que de foncées.</p>
<div class="insight-visual">un domino = une claire + une foncée</div>
<p>Les coins opposés d’un échiquier sont de la même couleur. Retirez-les, et il reste 30 cases claires pour 32 foncées : aucune disposition de dominos ne peut marcher, et on le sait sans en essayer une seule. Une propriété qui ne change jamais, comme « claires moins foncées » pour les cases couvertes par des dominos, s’appelle un <em>invariant</em>. Les invariants sont l’une des façons préférées des mathématiques de prouver qu’une chose est impossible.</p>
<h3>Une de chaque couleur : toujours possible</h3>
<p>Ralph Gomory a montré que si l’on retire une case claire et une case foncée d’un échiquier complet, le reste peut toujours être pavé. Tracez un chemin fermé qui passe une fois par chaque case, comme un serpent replié sur l’échiquier. Retirer deux cases de couleurs différentes coupe le chemin en morceaux de longueur paire, et chaque morceau se couvre de dominos le long du chemin.</p>
<h3>L’équilibre ne suffit pas</h3>
<p>Avoir autant de cases claires que de foncées est <em>nécessaire</em>, mais pas <em>suffisant</em>. Isolez une case de coin en retirant ses deux voisines, et elle ne pourra jamais être couverte, même si le compte reste équilibré. Décider si un sol quelconque peut être pavé revient à associer chaque case claire à une voisine foncée : c’est un problème de couplage. « Montrer un pavage » le résout en essayant des paires et en les réparant quand elles se heurtent.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Voyez les cases libres comme un réseau où les voisines sont reliées. Chaque lien joint une case claire à une case foncée : le réseau est <em>biparti</em>, et un pavage est un <em>couplage parfait</em>, un ensemble de liens qui utilise chaque case exactement une fois. La salle en trouve un avec des chemins augmentants (l’algorithme de Kuhn) et, s’il n’y en a pas, elle cherche un morceau connexe dont les couleurs ne s’équilibrent pas. Le casse-tête a été posé par Max Black en 1946 et rendu célèbre par Martin Gardner dans <em>Scientific American</em> ; le théorème de Gomory est la réponse classique à la version où l’on retire une case de chaque couleur.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Mutilated_chessboard_problem" target="_blank" rel="noopener">Le problème de l’échiquier mutilé, avec le théorème de Gomory (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Domino_tiling" target="_blank" rel="noopener">Pavages par dominos (en anglais)</a></div>`,
  },
});
