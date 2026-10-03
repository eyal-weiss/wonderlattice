/* Suspendre, retourner, bâtir · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('arch', 'fr', {
  eyebrow: 'CHAÎNES ET ARCS',
  name: 'Suspendre, retourner, bâtir',
  tagline:
    'Une chaîne suspendue, retournée, donne un arc de pierres posées qui tient debout. Un demi-cercle fait des mêmes pierres tombe.',
  title: 'Suspendre, retourner, bâtir.',
  subtitle:
    'Une chaîne pend entre deux crochets. Retournée, la même forme tient debout en arc de pierres posées sans mortier ; à côté, un demi-cercle fait des mêmes pierres tombe. Suspendez des tours à la chaîne, ou dessinez votre propre arc.',
  field: 'Ingénierie · La chaînette · Les lignes de force',
  sceneLabel: 'Une chaîne et un arc · Des pierres posées, sans mortier',
  sceneName: 'Votre propre expérience',
  tip: 'Faites glisser un crochet · Touchez la chaîne ou une pierre pour ajouter une tour · Faites glisser les points d’un arc, ou dessinez un nouvel arc · Clavier : ← → choisissent, ↑ ↓ modifient, F retourne',
  actionLabel: 'Retourner',
  canvasLabel:
    'Deux images côte à côte, à la même échelle. À gauche, une chaîne pend entre deux crochets et se balance jusqu’au repos ; puis elle se retourne en un arc de pierres sans mortier, et tient debout. Une ligne dorée, la ligne de force, passe à l’intérieur de chaque pierre. Les tours suspendues à la chaîne se dressent sur l’arc une fois celui-ci retourné. À droite, un arc fait des mêmes pierres mais d’une autre forme, d’abord un demi-cercle, est bâti sur un support en bois. Quand le support s’abaisse, sa ligne de force sort des pierres, quatre joints s’ouvrent, et l’arc se plie et tombe. Votre propre arc a neuf points à faire glisser vers l’intérieur ou l’extérieur.',
  panelEyebrow: 'Façonnez la chaîne',
  whyLabel: 'Pourquoi ça tient ?',
  nudge:
    'Touchez trois fois une pierre à mi-hauteur d’un côté de l’arc debout, pour y poser une tour de trois étages : il tombe. Retournez-le : la chaîne se plie pour porter la tour. Puis retournez encore.',
  connection: {
    html: '<strong>Des pierres sans colle.</strong> Ici, chaque pierre est tenue en place par la poussée de ses voisines. Dans « La tour penchée de blocs », chaque bloc tient en équilibre sur celui du dessous.',
    label: 'Voir la tour penchée',
  },

  presets: [
    { name: 'Suspendre, retourner', note: 'La forme de la chaîne tient debout ; un demi-cercle tombe.' },
    { name: 'Une tour sur le côté', note: 'La chaîne se plie sous elle : l’arc peut donc la porter.' },
    { name: 'Une route à porter', note: 'Sous une route lourde, la chaîne devient une parabole.' },
  ],

  // Les longueurs : les crochets sont d’abord à 1 m l’un de l’autre.
  cm: ' cm',
  length: 'Longueur de la chaîne',
  lengthHint: 'Une chaîne plus longue pend plus bas, et donne, une fois retournée, un arc plus haut.',
  thick: 'Épaisseur des pierres',
  thickHint: 'Pour les deux arcs. Avec des pierres assez épaisses, même un demi-cercle tient debout.',
  road: 'Suspendre une route à la chaîne',
  beside: 'L’arc d’à côté',
  shapes: { semicircle: 'Demi-cercle', pointed: 'Arc brisé', flat: 'Arc surbaissé', own: 'Le vôtre' },
  ownHint: 'Faites glisser ses points vers l’intérieur ou l’extérieur, ou dessinez un nouvel arc d’un pied à l’autre.',

  // Les nombres arrivent déjà écrits dans la langue de la page.
  percent: (x) => `${x} %`,
  length_cm: (x) => `${x} cm`,
  readout: {
    hanging: 'Suspendue, la chaîne est tirée sur toute sa longueur : rien que de la traction.',
    stands: 'Retournée, la même forme tient debout : rien que de la poussée.',
    falls: 'Retournée, avec ces charges, elle tombe.',
    inside: (share) =>
      `Sa ligne de force reste à l’intérieur des pierres, avec une marge de ${share} de leur épaisseur.`,
    outside: (share) =>
      `Aucune ligne de force ne tient dans les pierres : la meilleure en sort de ${share} de leur épaisseur.`,
    beside: (name, stands) => `${name} fait des mêmes pierres ${stands ? 'tient debout' : 'tombe'}.`,
    thinnest: (cm) => `Il tient debout tant que ses pierres font au moins ${cm} d’épaisseur.`,
    thickest: (cm) => `Il tiendrait debout avec des pierres d’au moins ${cm} d’épaisseur.`,
    never: (cm) => `Même des pierres de ${cm} d’épaisseur ne le feraient pas tenir.`,
    any: 'Il tient debout avec des pierres de n’importe quelle épaisseur.',
    working: 'Calcul de l’épaisseur qu’il faut à ses pierres…',
  },
  status: {
    hanging: 'La chaîne pend',
    stands: 'Retournée, elle tient',
    falls: 'Retournée, elle tombe',
    beside: (name, stands) => `${name} : ${stands ? 'il tient' : 'il tombe'}`,
  },

  // Les mots dessinés sur l’image.
  labels: {
    chain: 'Chaîne suspendue',
    arch: 'La chaîne, retournée',
    stands: 'Ça tient',
    falls: 'Ça tombe',
    building: 'Sur son support',
    semicircle: 'Un demi-cercle',
    pointed: 'Un arc brisé',
    flat: 'Un arc surbaissé',
    own: 'Votre arc',
    force: 'Ligne de force',
    parabola: 'Parabole',
    catenary: 'Chaînette',
    drawing: 'Dessinez d’un pied à l’autre',
    gallery: 'Mêmes pierres, autres formes · Touchez-en une pour la tester',
    thinnest: (cm) => `Pierres d’au moins ${cm}`,
    never: (cm) => `Pas même avec ${cm}`,
    any: 'Pierres de toute épaisseur',
    chartTitle: 'Jusqu’où amincir les pierres ?',
    chainShape: 'Forme de la chaîne',
    yours: (cm) => `Vos pierres : ${cm}`,
  },

  announce: {
    stands: 'La chaîne, retournée, tient debout en arc.',
    falls: 'Avec ces charges, l’arc tombe.',
    hanging: 'La chaîne pend à ses crochets.',
    beside: (name, stands) => `${name} fait des mêmes pierres ${stands ? 'tient debout' : 'tombe'}.`,
    towers: (stone, storeys) =>
      storeys === 0
        ? `Pierre ${stone} : pas de tour.`
        : storeys === 1
          ? `Pierre ${stone} : une tour d’un étage.`
          : `Pierre ${stone} : une tour de ${storeys} étages.`,
    peg: (side) =>
      side === 0
        ? 'Le crochet de gauche : les flèches haut et bas le montent et le descendent, A et D le déplacent sur le côté.'
        : 'Le crochet de droite : les flèches haut et bas le montent et le descendent, A et D le déplacent sur le côté.',
    dot: (n) =>
      `Point ${n} sur 9 de l’arc d’à côté : les flèches haut et bas le poussent vers l’extérieur ou vers l’intérieur.`,
  },

  guests: [
    {
      name: 'Robert Hooke',
      note: 'En 1675, il a caché sa règle des arcs dans un mélange de lettres latines. Remise en ordre après sa mort, elle dit qu’une chaîne suspendue, retournée, donne la forme d’un arc qui tient debout.',
    },
    {
      name: 'Galilée',
      note: 'En 1638, il a écrit qu’une chaîne suspendue est proche d’une parabole, et d’autant plus proche qu’elle pend peu. Elle en est proche, mais c’est une autre courbe.',
    },
    {
      name: 'Antoni Gaudí',
      note: 'Pour la crypte d’une église de la Colònia Güell, il a suspendu des cordes lestées de petits sacs de grenaille de plomb, les a photographiées, puis a retourné les photos pour dessiner les voûtes.',
    },
  ],

  insight: {
    title: 'Pourquoi la forme de la chaîne tient-elle debout ?',
    html: `<p>Une chaîne suspendue ne peut que tirer : chaque maillon tire sur le suivant, le long de la chaîne. Sa forme est celle où ces tractions équilibrent le poids de chaque maillon. Retournez l’image, et chaque force se retourne avec elle : les tractions deviennent des poussées, le long de la même ligne, et elles équilibrent les mêmes poids. On obtient un arc dont les pierres ne font que s’appuyer les unes sur les autres, sans que rien ne cherche à les plier ni à les écarter.</p>
<p>Robert Hooke l’a compris dans les années 1670, et l’a publié en 1675 sous forme d’énigme, un mélange de lettres latines. Après sa mort, on y a lu <em>ut pendet continuum flexile, sic stabit contiguum rigidum inversum</em>, c’est-à-dire : comme pend la ligne souple, ainsi, retournées, tiennent debout les pièces jointives d’un arc.</p>
<div class="insight-visual">chaîne suspendue : pure traction · la même forme à l’envers : pure compression</div>
<h3>La ligne de force</h3>
<p>Tout arc doit transmettre son poids, pierre après pierre, jusqu’à ses pieds. La poussée d’une pierre sur la suivante peut se dessiner comme une ligne, la ligne de force (les ingénieurs parlent de ligne des pressions). Elle a la forme que prendrait une chaîne suspendue sous les mêmes poids, retournée. Si l’on peut tracer une telle ligne à l’intérieur des pierres à chaque joint, l’arc peut tenir debout : c’est le théorème de sécurité de Jacques Heyman (1966), pour des pierres qui ne peuvent pas tirer, ne peuvent pas être écrasées et ne glissent pas. Là où la ligne touche le bord d’un joint, le joint peut s’ouvrir comme une charnière ; avec assez de charnières, l’arc bouge, et tombe. La ligne dorée est celle qui reste le plus loin des bords des pierres.</p>
<p>Pour la forme de la chaîne elle-même, la ligne passe par le milieu de chaque pierre : c’est pourquoi l’arc tient debout, aussi fines que soient les pierres. Un demi-cercle déborde davantage de chaque côté que la forme suspendue ; sa ligne de force, qui suit une forme suspendue, longe donc le haut des pierres au sommet, et traverse leur bord intérieur à mi-pente de chaque côté. Avec des pierres fines, elle n’a pas la place de passer. Alors quatre joints s’ouvrent comme des charnières, et les trois morceaux qui les séparent se plient et tombent. Un demi-cercle ne tient debout que si ses pierres ont une épaisseur d’au moins un dixième environ de son rayon ; Milutin Milankovitch a calculé la valeur exacte en 1907, 10,75 % pour un arc continu. L’arc de 21 pierres de la salle demande 10,67 % : des pierres de 5,3 cm d’épaisseur, pour un arc de 1 m de large.</p>
<h3>Changer les charges, changer la forme</h3>
<p>Une tour d’un côté fait plier la chaîne suspendue, et la chaîne retournée porte la tour. Mais posez la même tour sur un arc construit sans elle, et la ligne de force se déplace : une tour assez haute fait tomber cet arc. Le vent, la foule et la circulation changent aussi les charges, et c’est l’une des raisons pour lesquelles les vrais arcs sont plus épais que ne l’exige leur seul poids.</p>
<p>Une route lourde suspendue à une chaîne légère la tire vers le bas uniformément selon l’horizontale, et non le long de la chaîne, et la chaîne devient une parabole : la forme du câble d’un pont suspendu. Retournée, elle donne un pont dont l’arc soutient la route. Pour une chaîne qui pend peu, la parabole et la chaînette se distinguent mal ; cochez la route pour voir les deux. La Gateway Arch de Saint-Louis est une chaînette pondérée : ses jambes sont plus épaisses à la base, si bien que la courbe est la forme suspendue d’une chaîne dont les maillons sont plus lourds vers les extrémités.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Une chaîne de même poids sur toute sa longueur pend en chaînette, y = a cosh(x / a), où a est la traction horizontale divisée par le poids par unité de longueur. Jacques Bernoulli a posé le problème comme un défi, et en juin 1691 les réponses de Gottfried Leibniz, Christiaan Huygens et Jean Bernoulli ont été imprimées ensemble dans les Acta Eruditorum. Plus tôt, en 1638, Galilée avait écrit qu’une chaîne suspendue est proche d’une parabole ; Joachim Jungius a démontré qu’elle n’en est pas une (résultat publié en 1669). Une charge répartie uniformément selon l’horizontale donne au contraire y = kx², une parabole.</p>
<p>La chaîne de la salle compte 41 perles reliées par 42 maillons. Sa forme au repos est résolue exactement, par la méthode de Newton appliquée aux tractions à un crochet, et la chaîne en mouvement (des pas de Verlet, chaque maillon ramené à sa longueur) vient s’y poser. Chaque pierre de l’arc retourné est longue de deux maillons, avec son propre poids en son centre de gravité. Une ligne de force est fixée par trois nombres : la poussée horizontale, et où et avec quelle pente elle quitte le premier joint ; la salle cherche celle qui reste le plus loin des bords des pierres. Quand aucune ne tient, elle essaie tous les choix de quatre joints et coins comme charnières, garde ceux où chaque charnière s’ouvre et où les poids descendent, et laisse se dérouler la chute la plus rapide, celle d’un mécanisme articulé de trois morceaux, jusqu’à ce qu’une pierre touche le sol.</p>
<p>Les tests de la salle vérifient, par un calcul indépendant, que la chaîne au repos s’écarte d’une chaînette de moins de 0,02 % de la portée, que l’arc de la chaîne tient debout avec des pierres de 1 cm d’épaisseur, et que le demi-cercle demande 5,3 cm et l’arc brisé 3,5 cm. Ils vérifient aussi que les deux façons dont la salle pose la question, savoir si une ligne de force tient dans les pierres et si quatre charnières peuvent céder, donnent toujours la même réponse.</p></details>
<h3>Ce que cette salle laisse de côté</h3>
<p>Les pierres sont parfaitement rigides et ne glissent jamais, le sol et les crochets ne bougent jamais, et l’arc ne porte aucun remplissage au-dessus de lui. De vraies pierres sont tenues par le frottement, un vrai mortier peut tirer un peu, et de vrais pieds peuvent s’écarter, ce qui fait tomber des arcs qui sinon tiendraient debout. La chute est une caricature d’un véritable effondrement : elle suit le premier mouvement des pierres, et s’arrête quand l’une d’elles touche le sol.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Chaînette (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary_arch" target="_blank" rel="noopener">Arc en chaînette (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Line_of_thrust" target="_blank" rel="noopener">Ligne des pressions (Wikipédia, en anglais)</a><a class="source-link" href="https://www.gf.uns.ac.rs/~zbornik/doc/NS2016.018.pdf" target="_blank" rel="noopener">Nikolić, la théorie de la ligne des pressions de Milankovitch (2016, en anglais)</a><a class="source-link" href="https://talks.cam.ac.uk/talk/index/47582/" target="_blank" rel="noopener">Makris, l’épaisseur minimale des arcs en demi-cercle (2013, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Col%C3%B2nia_G%C3%BCell" target="_blank" rel="noopener">Colònia Güell (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gateway_Arch" target="_blank" rel="noopener">Gateway Arch (Wikipédia, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Hooke/" target="_blank" rel="noopener">Robert Hooke (MacTutor, en anglais)</a></div>`,
  },
});
