// The fixed text of the page (index.html, elements marked data-t).
Wonderlattice.defineText('shots', 'fr', {
  eyebrow: 'STATISTIQUE',
  name: 'Deux joueurs, trois classements',
  tagline: 'Un tireur peut gagner de près et gagner de loin, et pourtant perdre au total.',
  title: 'Deux joueurs, trois classements.',
  subtitle:
    'Deux joueurs tirent de près et de loin. Changez le nombre de tirs faciles et difficiles de chacun, et regardez le classement général s’inverser.',
  field: 'Statistique · Moyennes pondérées · Une petite surprise',
  sceneLabel: 'Un terrain · Deux joueurs · Trois classements',
  sceneName: 'Le mélange de tirs',
  tip: 'Faites glisser les curseurs pour changer le nombre de tirs de près et de loin de chaque joueur',
  actionLabel: 'Échanger les mélanges',
  canvasLabel:
    'Un terrain de basket où chaque tir de près ou de loin de chaque joueur est un point, avec des classements de près, de loin et au total.',
  panelEyebrow: 'Changez le mélange de tirs',
  whyLabel: 'Comment est-ce possible\u202f?',
  nudge:
    'Donnez au joueur A surtout des tirs de loin et au joueur B surtout des tirs de près. Regardez le classement général basculer, alors que l’adresse d’aucun des deux n’a changé.',
  connection: {
    html: '<strong>Un nombre global peut cacher ce qu’il contient.</strong> Ici, un pourcentage global est une moyenne pondérée, et les poids sont le mélange de tirs.',
    label: 'Suivre une autre surprise',
  },
  presets: [
    { name: 'Mélange égal', note: 'Le meilleur joueur gagne aussi au total.', badge: 'Égal' },
    { name: 'Mélange déséquilibré', note: 'Essayez la surprise.', badge: 'Déséquilibré' },
    { name: 'Mélange extrême', note: 'Jusqu’où l’écart peut-il aller\u202f?', badge: 'Extrême' },
  ],
  players: { a: 'Joueur A', b: 'Joueur B' },
  short: { a: 'A', b: 'B' },
  closeLabel: 'De près',
  farLabel: 'De loin',
  overallLabel: 'Au total',
  attemptsHint: 'Combien de tirs de ce type\u202f?',
  makesOf: (makes, attempts) => `${makes} sur ${attempts}`,
  percent: (pct) => `${Math.round(pct * 100)}\u202f%`,
  verdict: {
    tied: 'Les deux joueurs sont à égalité au total.',
    aWins: 'Le joueur A mène au total.',
    bWins: 'Le joueur B mène au total.',
    reversal: (winner) => `${winner} gagne de près et de loin, et pourtant reste derrière au total.`,
  },
  legend: {
    made: 'réussi',
    missed: 'manqué',
    perDot: (n) => (n === 1 ? 'un point par tir' : `un point ≈ ${n}\u202ftirs`),
  },
  labels: {
    caption: 'Le pourcentage global de chaque joueur est le total de ses paniers divisé par le total de ses tirs.',
  },
  guests: [
    {
      name: 'Edward H. Simpson',
      note: 'Une tendance présente dans chaque groupe peut s’inverser quand on réunit les groupes.',
    },
    {
      name: 'George Udny Yule',
      note: 'La même inversion apparaît chaque fois qu’un taux global cache un mélange inégal.',
    },
  ],
  insight: {
    title: 'Comment le meilleur joueur peut-il perdre au total\u202f?',
    html: `<p>Un pourcentage de réussite global n’est pas la moyenne de deux pourcentages. C’est le total des paniers divisé par le total des tirs, donc une moyenne <em>pondérée</em>, selon le nombre de tirs pris à chaque distance. Quand les deux joueurs prennent des mélanges très différents de tirs de près et de loin, cette pondération peut avantager le joueur qui est derrière dans les deux catégories.</p>
<div class="insight-visual">La même adresse à chaque distance, un autre mélange de tirs, un autre leader au total.</div>
<h3>Essayez un mélange égal</h3>
<p>Donnez aux deux joueurs la même répartition entre tirs de près et tirs de loin. Le meilleur joueur dans les deux catégories gagne alors aussi au total. L’inversion n’apparaît que lorsque les mélanges diffèrent.</p>
<h3>Un cas réel\u00a0: Berkeley, 1973</h3>
<p>À l’université de Californie à Berkeley, le taux global d’admission en troisième cycle semblait favoriser les hommes. Département par département, la plupart ne montraient aucun biais contre les femmes, ou un léger biais en leur faveur. Les femmes s’étaient portées candidates en plus grand nombre dans des départements plus sélectifs, aux taux d’admission faibles pour tout le monde, ce qui faisait baisser leur taux global. Le chiffre auquel se fier dépend de la raison pour laquelle les mélanges différaient, pas seulement de l’arithmétique.</p>
<h3>Ce que suppose ce modèle</h3>
<p>Chaque joueur a un taux de réussite fixe à chaque distance, appliqué à autant de tirs que vous lui en donnez. C’est un modèle simplifié pour illustrer l’arithmétique du paradoxe, pas une simulation de vrais tirs ni de vraies décisions d’admission.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Pour un joueur qui réussit <code>c</code> tirs sur <code>C</code> de près et <code>f</code> sur <code>F</code> de loin, le taux global est (c + f) / (C + F), et non la moyenne de c/C et f/F. Un joueur peut avoir à la fois un c/C et un f/F plus élevés que l’autre, pendant que l’autre a un (c + f) / (C + F) plus élevé, dès que les nombres de tirs C et F diffèrent assez entre eux.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Simpson%27s_paradox" target="_blank" rel="noopener">Paradoxe de Simpson, Wikipédia (en anglais)</a> · <a class="source-link" href="https://www.science.org/doi/10.1126/science.187.4175.398" target="_blank" rel="noopener">Bickel, Hammel et O’Connell, «\u202fSex bias in graduate admissions: data from Berkeley\u202f», Science 187 (1975) (en anglais)</a></div>`,
  },
});
