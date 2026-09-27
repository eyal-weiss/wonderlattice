Wonderlattice.defineText('plane', 'fr', {
  eyebrow: 'NOMBRES COMPLEXES',
  name: 'Courber le plan',
  tagline: 'Courbez une image sans la déchirer ; un cercle devient une aile.',
  title: 'Courber le plan.',
  subtitle:
    'Faites passer une image par une fonction complexe. Tout le plan se courbe, mais les minuscules angles droits restent droits.',
  field: 'Nombres complexes · Transformations conformes · Ailes',
  sceneLabel: 'Le plan, courbé',
  tip: 'Faites glisser la boussole de gauche, ou déplacez-la avec les flèches · Sa jumelle, à droite, montre l’étirement et la rotation',
  tipStacked:
    'Faites glisser la boussole dans l’image du haut, ou utilisez les flèches · Sa jumelle, en dessous, montre l’étirement et la rotation',
  actionLabel: 'Courber',
  canvasLabel:
    'Deux copies du plan. Dans la première, une image et une petite boussole faite de deux flèches perpendiculaires ; dans la seconde, leurs images par la fonction complexe choisie. Faites glisser la boussole, ou déplacez-la avec les flèches.',
  panelEyebrow: 'Choisir une courbure',
  whyLabel: 'Pourquoi les angles droits survivent-ils ?',
  nudge:
    'Mettez le plan au carré, puis faites glisser la boussole tout au centre. Qu’arrive-t-il à sa jumelle à cet endroit ?',
  connection: {
    html: '<strong>Courber sans déchirer.</strong> Ici, une fonction courbe tout le plan en gardant ses minuscules angles. Dans « Où est l’autre face ? », une bande se courbe en une surface qui n’a qu’une seule face.',
    label: 'Visiter « Où est l’autre face ? »',
  },
  functions: ['Carré · z²', 'Retournement · 1/z', 'Enroulement · eᶻ', 'Vague · sin z', 'Aile · z + 1/z'],
  formulas: ['w = z²', 'w = 1/z', 'w = eᶻ', 'w = sin z', 'w = z + 1/z'],
  pictures: ['Une grille carrée', 'Un poisson', 'Un visage', 'Cercles et rayons', 'Le cercle de l’aile'],
  functionLabel: 'Fonction',
  pictureLabel: 'Image',
  bendLabel: 'Courbure',
  thickLabel: 'Épaisseur',
  camberLabel: 'Cambrure',
  gridLabel: 'Afficher une grille discrète derrière',
  flowLabel: 'Montrer l’air qui s’écoule autour',
  at: 'La boussole en',
  stretch: 'Étirement à cet endroit',
  stretchMath: '(|f′(z)|)',
  turn: 'Rotation à cet endroit',
  turnMath: '(arg f′(z))',
  point: (x, y) => `${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i`.replace(/^-/, '−'),
  times: (x) => `${x}×`,
  degrees: (d) => `${d < 0 ? '−' : ''}${Math.abs(d)}°`,
  none: '–',
  status: (stretch, turn) => `×${stretch} · rotation ${turn}`,
  statusCritical: 'Ici f′ = 0',
  statusPole: 'Un pôle : f = ∞',
  announceCritical: 'f′ = 0 ici : les angles doublent',
  announcePole: 'Un pôle : la fonction est infinie ici',
  keeps: 'Les flèches de la jumelle se croisent toujours à angle droit.',
  critical: 'Ici f′ = 0. Les flèches de la jumelle rétrécissent jusqu’à disparaître, et les angles doublent.',
  pole: 'Ici f est infinie : c’est un pôle. La jumelle s’est envolée hors de la carte.',
  away: 'Sa jumelle est sortie du cadre de l’image courbée.',
  blending: 'Courbure partielle : un mélange de z et de f(z), pour aider l’œil.',
  zLabel: 'z',
  wLabel: 'w',
  bent: (formula, percent) => `${formula} · courbé à ${percent} %`,
  criticalMark: 'f′ = 0',
  poleMark: 'pôle',
  presets: [
    {
      name: 'Mettre le plan au carré',
      note: 'Les angles doublent au centre.',
    },
    {
      name: 'Retourner le plan',
      note: 'Les droites deviennent des cercles.',
    },
    {
      name: 'L’enrouler',
      note: 'Les droites deviennent des cercles et des rayons.',
    },
    {
      name: 'Un poisson au carré',
      note: 'Déformé de partout, toujours un poisson.',
    },
    {
      name: 'Fabriquer une aile',
      note: 'Un cercle, courbé en aile.',
    },
  ],
  guests: [
    {
      name: 'Bernhard Riemann',
      note: 'Sa thèse de 1851, sous la direction de Gauss, étudiait les fonctions complexes par la géométrie : des transformations qui gardent les angles, et des surfaces.',
    },
  ],
  insight: {
    title: 'Courber sans perdre ses angles.',
    html: `<p>Un nombre complexe x + iy est un point du plan : x vers la droite, y vers le haut. Une fonction complexe f envoie chaque point z sur un nouveau point w = f(z) ; elle déplace donc tout le plan d’un coup. La première image montre le plan avant ; la seconde montre où atterrit chacun de ses points.</p>
<div class="insight-visual">multiplier par un nombre de taille r et d’angle θ, c’est étirer d’un facteur r et tourner de θ</div>
<h3>Multiplier, c’est tourner et étirer</h3>
<p>Multiplier par i fait tourner le plan d’un quart de tour. Multiplier par 2 double sa taille. Chaque nombre complexe fait les deux à la fois : il étire selon sa taille et tourne selon son angle. Un étirement suivi d’une rotation conserve tous les angles, même quand les tailles changent.</p>
<h3>De près, une courbure est une multiplication</h3>
<p>Zoomez près d’un point z : une fonction complexe dérivable (au sens complexe) ressemble alors à la multiplication par un seul nombre, sa dérivée f′(z), car f(z + h) ≈ f(z) + f′(z)·h pour un h minuscule. Ainsi, chaque petite flèche en z est étirée de |f′(z)| et tournée de l’angle de f′(z), de la même façon dans toutes les directions. Les deux flèches de la boussole tournent ensemble et se croisent toujours à angle droit. Une transformation qui garde ainsi les angles est dite <em>conforme</em>. Les lignes de la grille se croisent elles aussi à angle droit après la courbure, même quand les carrés deviennent courbes.</p>
<h3>Là où f′ = 0, les angles se brisent</h3>
<p>Si f′(z) = 0, il n’y a plus rien par quoi multiplier, et le terme suivant prend le relais. Près de 0, z² envoie h sur h², ce qui double chaque angle : l’angle droit entre 1 et i s’ouvre en une ligne droite. Voilà pourquoi la jumelle de la boussole rétrécit jusqu’à disparaître au centre de « Mettre le plan au carré », et pourquoi les lignes de la grille qui passent par 0 s’y plient.</p>
<h3>Retourné comme un gant</h3>
<p>1/z échange le proche et le lointain : les points proches de 0 s’envolent au loin, et les points lointains se rapprochent. Les cercles passant par 0 deviennent des droites, et les droites qui évitent 0 deviennent des cercles passant par 0. Voilà pourquoi la grille carrée se change en deux familles de cercles, qui passent tous par 0 et se croisent toujours à angle droit. (Les deux axes, qui passent eux-mêmes par 0, restent des droites.)</p>
<h3>D’un cercle à une aile</h3>
<p>La transformation de Joukowski, z + 1/z, aplatit le cercle unité en le segment qui va de −2 à 2. Décalez un peu le cercle, en le faisant toujours passer par z = 1, et son image devient une aile : arrondie à l’avant et effilée à l’arrière. Le bord effilé se trouve exactement là où f′ = 0, en z = 1, où les angles doublent et où le cercle lisse se replie en une pointe. La transformation envoie l’écoulement de l’air autour du cercle sur un écoulement autour de l’aile. Cet écoulement est idéalisé (stationnaire, sans frottement, plan), avec juste assez de circulation pour que l’air quitte le bord effilé en douceur. Les vraies ailes dépendent aussi de la viscosité, de la turbulence et de leur forme en trois dimensions, que cette image laisse de côté.</p>
<h3>À propos du curseur « Courbure »</h3>
<p>À mi-chemin, l’image montre (1 − t)·z + t·f(z), un simple mélange entre rester en place et la transformation complète. Il est là pour aider l’œil à suivre chaque point. Chaque mélange est lui aussi une fonction complexe, mais il a ses propres points à problèmes, et ce n’est pas un chemin que le plan parcourt vraiment. Seule l’image entièrement courbée montre f.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>f′(z) est la limite de (f(z + h) − f(z)) / h quand h tend vers 0. Pour une fonction complexe, la limite doit être la même dans toutes les directions, et c’est exactement ce qui force l’étirement et la rotation à être les mêmes dans toutes les directions : une fonction analytique telle que f′(z) ≠ 0 est conforme en z. En un point où f′ s’annule à l’ordre un, les angles sont multipliés par 2. L’écoulement autour de l’aile utilise le potentiel complexe F = ζ + r²/ζ + ik·log ζ autour d’un cercle de rayon r (ζ mesuré depuis son centre), avec k choisi pour que z = 1 soit un point d’arrêt : c’est la condition de Kutta.</p></details>
<div class="sources"><a class="source-link" href="https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/" target="_blank" rel="noopener">Notes du MIT 18.04, thème 10 : transformations conformes (en anglais)</a><a class="source-link" href="https://webapps.math.uci.edu/~vmm/ConformalMaps/" target="_blank" rel="noopener">Des transformations conformes à explorer (UC Irvine, 3D-XplorMath, en anglais)</a><a class="source-link" href="https://www.grc.nasa.gov/www/k-12/airplane/map.html" target="_blank" rel="noopener">La transformation de Joukowski, du cylindre au profil d’aile (NASA Glenn, en anglais)</a><a class="source-link" href="https://books.google.com/books/about/Visual_Complex_Analysis.html?id=ogz5FjmiqlQC" target="_blank" rel="noopener">Tristan Needham, Visual Complex Analysis (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/" target="_blank" rel="noopener">Bernhard Riemann (MacTutor, en anglais)</a></div>`,
  },
});
