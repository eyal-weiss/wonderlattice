Wonderlattice.defineText('sudoku', 'fr', {
  eyebrow: 'LOGIQUE · GRAPHES',
  name: 'Le sudoku en transparence',
  tagline: 'Un casse-tête de chiffres où les chiffres n’ont jamais compté.',
  title: 'Le sudoku en transparence.',
  subtitle:
    'Un sudoku avec des couleurs au lieu des chiffres. Placez-en une et regardez les choix qu’elle exclut disparaître de sa ligne, de sa colonne et de son bloc.',
  field: 'Logique · Coloration de graphes · Carrés latins',
  sceneLabel: 'Seize cases',
  tip: 'Tab pour aller à la grille · les flèches déplacent · les touches 1–4 placent · Retour arrière efface · Ctrl+Z annule',
  actionLabel: 'Faire une étape logique',
  canvasLabel:
    'Une grille de sudoku de quatre cases sur quatre. Chaque case vide montre les symboles qui peuvent encore y aller. La grille de cases posée sur cette image se joue au clavier.',
  boardLabel: 'Grille de sudoku, quatre sur quatre',
  panelEyebrow: 'Placer, annuler, regarder à nouveau',
  whyLabel: 'Pourquoi est-ce une histoire de coloriage ?',
  nudge:
    'Placez une couleur et regardez ses petites marques s’estomper le long de sa ligne, de sa colonne et de son bloc. Puis faites une étape logique. L’explication vous convainc-elle ?',
  connection: {
    html: '<strong>Un autre réseau de voisins.</strong> Ici, chaque case limite les cases auxquelles elle est reliée. Dans la traversée de la ville, le choix de chaque conducteur change le trajet de tous.',
    label: 'Visiter « Le raccourci tentant »',
  },
  presets: [
    {
      name: 'Un début en douceur',
      note: 'Huit indices. Chaque étape mène à la suivante.',
    },
    {
      name: 'Une seule solution',
      note: 'Seulement quatre indices, et pourtant une seule réponse.',
    },
    {
      name: 'Deux solutions',
      note: 'Six indices, et de la place pour deux solutions.',
    },
  ],
  styles: ['Couleurs', 'Formes', 'Chiffres'],
  styleHint: 'Même grille, nouvelles étiquettes. Seules les règles comptent.',
  styleLabel: 'Symboles',
  symbolWord: ['couleur', 'forme', 'chiffre'],
  symbolNames: [
    ['le bleu', 'l’orange', 'le rose', 'le vert'],
    ['le cercle', 'le carré', 'le triangle', 'le losange'],
    ['le 1', 'le 2', 'le 3', 'le 4'],
  ],
  unitNames: {
    row: 'cette ligne',
    col: 'cette colonne',
    box: 'ce bloc',
  },
  placeLabel: 'Placer dans la case choisie',
  placeButton: (name) => `Placer ${name}`,
  faded: (word) => `Les ${word}s estompé${word === 'chiffre' ? 's' : 'es'} ne peuvent pas aller ici.`,
  clash: 'en conflit ici',
  undo: 'Annuler',
  clear: 'Vider la case',
  network: 'Montrer le réseau',
  filled: 'Remplies',
  candidatesLeft: 'Candidats',
  waysToFinish: 'Solutions',
  none: 'aucune',
  twoFinishes: 'Le solveur a trouvé les deux solutions. Elles ne diffèrent que par les cases entourées.',
  answerLabel: (n) => `Solution ${n}`,
  status: (filled) => `${filled} sur 16 remplies`,
  networkCaption: '16 cases · 56 liens · deux cases liées ne sont jamais pareilles',
  start: (word) => `Touchez une case vide, puis choisissez ${word === 'chiffre' ? 'un' : 'une'} ${word}.`,
  placed: (name, n) =>
    n === 0
      ? `${name.charAt(0).toUpperCase() + name.slice(1)} est placé. Rien autour n’a eu besoin de changer.`
      : `${name.charAt(0).toUpperCase() + name.slice(1)} est placé. Il ne peut plus aller dans ${n} ${n === 1 ? 'case voisine' : 'cases voisines'}.`,
  clashed: (name) => `Deux voisines contiennent maintenant toutes les deux ${name}. Annulez, ou essayez autre chose.`,
  given: 'Celle-ci était fournie avec la grille. Essayez une case vide.',
  cleared: 'Case vidée. Ses possibilités reviennent.',
  undone: 'Un pas en arrière.',
  naked: (name) => `Seul ${name} convient ici : sa ligne, sa colonne et son bloc contiennent les trois autres.`,
  hidden: (name, unit) => `Dans ${unit}, ${name} n’a plus qu’une place possible.`,
  stuckTwo: 'Rien n’est imposé maintenant. Les cases entourées peuvent s’échanger, et les deux solutions marchent.',
  stuckOne: 'Aucune étape n’est imposée ici. Tentez une supposition, et annulez si elle tourne mal.',
  stuckNone: 'Cette grille ne peut plus être terminée. Annulez une étape ou deux.',
  clashFirst: 'Deux voisines partagent un symbole. Annulez ou videz d’abord l’une des cases qui brillent.',
  solved: (word) => `Terminé. Chaque ligne, chaque colonne et chaque bloc contient chaque ${word} une fois.`,
  fresh: 'Une grille toute neuve.',
  describe: (row, col, content) => `Ligne ${row}, colonne ${col}, ${content}`,
  holds: (name, given) => (given ? `${name}, un indice` : name),
  emptyWith: (names) => `vide, peut recevoir ${names.join(' ou ')}`,
  emptyNone: 'vide, rien ne convient',
  guest: {
    name: 'Leonhard Euler',
    note: 'Un sudoku terminé est un carré latin, plus une règle pour les blocs. Mes 36 officiers demandaient deux carrés latins 6 × 6 superposés, où chaque paire de symboles n’apparaît qu’une fois : c’est impossible.',
  },
  insight: {
    title: 'Pourquoi le sudoku est-il une histoire de coloriage ?',
    html: `<p>Rien, dans le sudoku, n’exige des chiffres. La seule règle est que deux cases d’une même ligne, d’une même colonne ou d’un même bloc doivent être différentes. Couleurs, formes ou chiffres fonctionnent exactement pareil : c’est pourquoi changer de symboles ne change jamais la grille.</p>
<div class="insight-visual">Un sudoku est une carte à colorier. Sur cette grille, chaque case a sept voisines, et elle doit différer de toutes.</div>
<h3>Contraintes</h3>
<p>Chaque case appartient à une ligne, une colonne et un bloc. Ces groupes se chevauchent, si bien qu’un seul placement porte loin : il retire d’un coup une possibilité à jusqu’à sept autres cases. Les marques qui s’estompent montrent exactement lesquelles.</p>
<h3>Candidats et singletons</h3>
<p>Les petites marques d’une case vide sont ses candidats : les symboles qu’aucune de ses voisines ne contient encore. Quand il ne reste qu’une marque, la case est imposée (un « singleton nu »). Quand un symbole n’a plus qu’une case possible dans une ligne, une colonne ou un bloc, il doit y aller (un « singleton caché »). « Faire une étape logique » n’utilise que ces deux idées, et montre toujours pourquoi.</p>
<h3>Un graphe à colorier</h3>
<p>Activez le réseau. Chaque case devient un point, et un trait relie deux points dès que leurs cases partagent une ligne, une colonne ou un bloc : 16 points et 56 traits. Remplir la grille revient à donner à chaque point l’une de quatre couleurs de sorte qu’aucun trait ne relie deux points de même couleur, un peu comme on colorie une carte pour que des pays voisins soient différents. Les mathématiciens appellent cela une coloration propre d’un graphe.</p>
<h3>Pourquoi une bonne grille a exactement une réponse</h3>
<p>Les indices sont une coloration déjà commencée. Une grille bien faite a juste assez d’indices pour qu’il ne reste qu’une seule façon de la terminer : chaque étape peut alors se raisonner au lieu de se deviner. Sur une grille 4×4, il faut au moins quatre indices pour y parvenir. Avec moins, un choix reste toujours ouvert. « Deux solutions » a six indices, mais quatre cases forment un rectangle dont les deux couleurs peuvent s’échanger, et le solveur trouve les deux solutions.</p>
<h3>La grille en taille réelle</h3>
<p>Le sudoku du journal repose sur la même idée à plus grande échelle : 81 cases, chacune avec 20 voisines, 810 traits et neuf couleurs. Il existe 288 grilles 4×4 complètes, mais environ 6,7 × 10<sup>21</sup> grilles 9×9 complètes. Le plus petit nombre d’indices pouvant donner une réponse unique à une grille 9×9 est 17, un fait établi par une vaste recherche informatique.</p>
<h3>Carrés latins</h3>
<p>Une grille où chaque symbole apparaît une fois dans chaque ligne et chaque colonne s’appelle un carré latin. Leonhard Euler les a étudiés, notamment dans son problème des 36 officiers : six grades et six régiments, disposés de sorte que chaque ligne et chaque colonne contienne chaque grade et chaque régiment une fois. Tout sudoku terminé est un carré latin avec une règle de plus pour ses blocs.</p>
<details><summary>Ce que fait cette salle, et ce qu’elle laisse de côté</summary><p>Les candidats n’utilisent ici que l’élimination directe : un symbole est exclu quand une voisine le contient déjà. L’étape logique connaît deux sortes de déductions, les singletons nus et cachés ; les grilles plus difficiles en demandent davantage. Le nombre de façons de terminer vient d’une petite recherche par retour sur trace. Elle essaie chaque possibilité dans la case vide la plus contrainte et s’arrête dès qu’elle a trouvé deux solutions. Herzberg et Murty comptent les façons de prolonger une coloration partielle à l’aide d’un polynôme chromatique : une grille a une solution unique exactement quand ce nombre vaut 1. Cette salle a seulement besoin de distinguer aucune, une et deux.</p></details>
<div class="sources"><a class="source-link" href="https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf" target="_blank" rel="noopener">Sudoku Squares and Chromatic Polynomials (Herzberg &amp; Murty, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku" target="_blank" rel="noopener">Les mathématiques du sudoku (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Thirty-six_officers_problem" target="_blank" rel="noopener">Les 36 officiers d’Euler (en anglais)</a></div>`,
  },
});
