/* Plier un dragon · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('dragon', 'fr', {
  eyebrow: 'PLIAGE DE PAPIER',
  name: 'Plier un dragon',
  tagline:
    'Pliez une bande de papier en deux, encore et encore, ouvrez chaque pli à angle droit, et il en sort un dragon.',
  title: 'Plier un dragon.',
  subtitle:
    'Une bande de papier se plie en deux dix fois, puis chaque pli s’ouvre à angle droit. Regardez : elle ne se croise jamais.',
  field: 'Pliage · Fractales · Pavage',
  sceneLabel: 'Une bande de papier, vue de dessus',
  sceneName: 'Pliage',
  tip: 'La bande tient sur la tranche, vue de dessus. Pliez-la une fois de plus, ou changez l’angle des plis.',
  actionLabel: 'Encore un pliage',
  canvasLabel:
    'Une bande de papier colorée se plie en deux, encore et encore, puis s’ouvre, chaque pli à angle droit, en un dragon enroulé qui se touche aux coins mais ne se croise jamais.',
  panelEyebrow: 'Plier et ouvrir',
  whyLabel: 'Pourquoi un dragon ?',
  nudge:
    'Essayez avec du papier : pliez une bande en deux quatre fois, toujours dans le même sens, puis ouvrez chaque pli à angle droit et posez-la sur la tranche.',
  connection: {
    html: '<strong>Des copies qui remplissent le plan.</strong> Quatre dragons s’emboîtent autour d’un point sans laisser de trou. Dans « Un carreau qui remplit le monde », un carreau que vous déformez couvre encore tout.',
    label: 'Visiter « Un carreau qui remplit le monde »',
  },

  presets: [
    { name: 'Dix pliages', note: 'Le dragon classique.' },
    { name: 'Quatre dragons', note: 'Tournés autour d’un même point, ils s’emboîtent.' },
    { name: 'Du vrai papier', note: 'Quatre pliages, comme le permet une vraie bande.' },
  ],

  folds: 'Pliages',
  angle: 'Angle des plis',
  four: 'Quatre dragons',

  // Above the picture. `fold` and `folds` are whole numbers; `layers` and `pieces` arrive already written out (1 024).
  // French: « pliage » is the act of folding, « pli » the crease. The singular is used for 0 and 1.
  folding: 'Pliage',
  opening: 'Ouverture',
  oneMore: 'Encore un pliage',
  dragon: 'Le dragon',
  fourDragons: 'Quatre dragons',
  foldStatus: (fold, layers) => `Pliage ${fold} · ${layers} couches`,
  paperLimit: (fold, layers) => `Pliage ${fold} · ${layers} couches, trop pour du papier`,
  openStatus: 'Chaque pli s’ouvre à angle droit',
  moreStatus: 'Un nouveau pli par morceau, tour à tour à gauche et à droite',
  rightStatus: (folds, pieces) =>
    `${folds} ${folds < 2 ? 'pliage' : 'pliages'} · ${pieces} morceaux · ne se croise jamais`,
  fourStatus: (folds) => `${folds} ${folds < 2 ? 'pliage' : 'pliages'} chacun · ni chevauchement ni trou au milieu`,
  angleStatus: (angle) => `Plis à ${angle}° · à 90°, aucun croisement`,
  restarted: 'Retour à un seul pliage.',

  guests: [
    {
      name: 'Martin Gardner',
      note: 'En 1967, il a montré aux lecteurs de sa rubrique de Scientific American le dragon que trois physiciens de la NASA avaient trouvé en pliant du papier.',
    },
    {
      name: 'Donald Knuth',
      note: 'Avec Chandler Davis, il a établi en 1970 pourquoi le dragon ne passe jamais deux fois par la même arête, et pourquoi ses copies peuvent couvrir le plan.',
    },
    {
      name: 'Britney Gallivan',
      note: 'En 2002, alors lycéenne, elle a plié douze fois en deux une bande de papier de 1,2 km, toujours dans le même sens.',
    },
  ],

  insight: {
    title: 'Pourquoi le pliage donne-t-il un dragon ?',
    html: `<p>Chaque pliage met un nouveau pli au milieu de chaque morceau de la bande, et comme on plie toujours dans le même sens, les nouveaux plis tournent tour à tour à gauche et à droite. Ouvrez chaque pli à angle droit, et la bande trace un chemin sur un quadrillage. Après dix pliages, ce chemin compte 1 024 morceaux, et pourtant il ne longe jamais deux fois la même arête : il ne se touche qu’aux coins. Les coins arrondis de l’image laissent voir les deux passages du chemin s’y frôler.</p>
<div class="insight-visual">encore un pliage → un nouveau pli entre deux plis voisins → le dragon devient deux fois plus long</div>
<h3>Dans quel sens tourne chaque pli</h3>
<p>Comptez les plis depuis un bout. Divisez le numéro du pli par 2 autant de fois que possible, et regardez ce qu’il en reste : si ce nombre divisé par 4 donne un reste de 1, le pli tourne dans un sens, et si le reste est 3, dans l’autre. Les virages vont donc droite, droite, gauche, droite, droite, gauche, gauche… C’est la suite de pliage de papier régulière.</p>
<h3>Deux dragons en un, et quatre qui remplissent le plan</h3>
<p>La seconde moitié de la bande est la première, tournée d’un angle droit autour du pli du milieu : chaque dragon est donc fait de deux dragons plus petits, chacun à l’échelle 1/√2. Chandler Davis et Donald Knuth ont étudié ces courbes en 1970 et prouvé que le chemin plié ne repasse jamais par une même arête, et que des copies tournées s’emboîtent : quatre dragons partant d’un même point remplissent le quadrillage autour de lui, sans trou ni chevauchement, et plus il y a de pliages, plus loin ils le remplissent. Mesuré avec un début et une fin distants de 1, le dragon achevé couvre une aire d’exactement ½, et son bord est une fractale de dimension 1,52 environ.</p>
<h3>Du vrai papier</h3>
<p>Chaque pliage double l’épaisseur et divise la longueur par deux, si bien qu’une bande de papier ordinaire devient vite un petit bloc raide : quatre ou cinq pliages bien nets, c’est à peu près tout ce qu’on peut encore ouvrir proprement, et sept ou huit est la limite habituelle. Le papier de la salle n’a pas d’épaisseur. En 2002, Britney Gallivan, une lycéenne, a calculé quelle longueur doit avoir une bande pour un nombre donné de pliages, puis a plié 1,2 km de papier douze fois dans le même sens. La courbe a d’abord été trouvée par les physiciens de la NASA John Heighway, Bruce Banks et William Harter, et Martin Gardner en a parlé en 1967.</p>
<details><summary>Ce que la salle laisse de côté</summary><p>L’animation tourne tous les plis du même angle en même temps et garde tous les morceaux de même longueur, comme si la bande tenait sur la tranche sans aucune épaisseur. Les vrais plis se rouvrent un peu, et une vraie bande donne donc un dragon plus grossier. Pour des angles de pli autres que 90°, le chemin peut se croiser ; la salle n’affirme rien dans ce cas.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dragon_curve" target="_blank" rel="noopener">La courbe du dragon (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Regular_paperfolding_sequence" target="_blank" rel="noopener">La suite de pliage de papier régulière (Wikipédia, en anglais)</a><a class="source-link" href="https://mathworld.wolfram.com/DragonCurve.html" target="_blank" rel="noopener">MathWorld : la courbe du dragon (en anglais)</a><a class="source-link" href="https://www-cs-faculty.stanford.edu/~knuth/fg.html" target="_blank" rel="noopener">C. Davis et D. E. Knuth, « Number representations and dragon curves », dans les Selected Papers on Fun and Games de Knuth (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Britney_Gallivan" target="_blank" rel="noopener">Britney Gallivan (Wikipédia, en anglais)</a></div>`,
  },
});
