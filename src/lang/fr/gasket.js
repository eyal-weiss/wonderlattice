/* Des cercles à perte de vue · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('gasket', 'fr', {
  eyebrow: 'CERCLES TANGENTS',
  name: 'Des cercles à perte de vue',
  tagline:
    'Remplissez chaque trou avec le plus grand cercle qui y tient, à l’infini, et chaque cercle reçoit un nombre entier.',
  title: 'Des cercles à perte de vue.',
  subtitle:
    'Chaque trou reçoit le plus grand cercle qui y tient, à l’infini. Le nombre dans un cercle est sa courbure, 1 ÷ son rayon : toujours un entier. Touchez n’importe quel cercle.',
  field: 'Géométrie · Nombres entiers · Fractales',
  sceneLabel: 'Courbure = 1 ÷ rayon',
  tip: 'Touchez un cercle pour voir sa règle · Faites glisser un cercle de départ pour changer sa taille · Pincez, faites défiler ou utilisez + et − pour zoomer · Entrée choisit un cercle',
  actionLabel: 'Plonger',
  canvasLabel:
    'Un grand cercle rempli de cercles de plus en plus petits qui se touchent, chacun avec sa courbure écrite à l’intérieur.',
  panelEyebrow: 'Choisissez les cercles de départ',
  whyLabel: 'Pourquoi ces nombres sont-ils tous entiers ?',
  nudge:
    'Agrandissez un peu un cercle de départ, en le faisant glisser ou avec son curseur : les courbures à l’intérieur deviennent décimales. Puis touchez « Moitiés » pour retrouver les entiers.',
  connection: {
    html: '<strong>Encore une image sans fond.</strong> Ici, une règle remplit les trous de cercles à l’infini ; dans la salle suivante, une règle, répétée, dessine des côtes sans fin.',
    label: 'Un paysage infini',
  },

  presets: [
    { name: 'Moitiés', note: '−1, 2, 2, 3 : deux cercles, chacun moitié moins large que le grand.' },
    { name: 'Tiers', note: '−2, 3, 6, 7 : deux tiers et un tiers de la largeur.' },
    { name: 'Quarts', note: '−3, 4, 12, 13 : trois quarts et un quart.' },
    { name: 'Déréglé', note: 'Un cercle un peu plus grand : les courbures à l’intérieur deviennent décimales.' },
  ],
  yourOwn: 'Vos propres cercles',

  left: 'Courbure du cercle de gauche',
  right: 'Courbure du cercle de droite',
  bendHint: 'Courbure plus grande, cercle plus petit.',

  readout: {
    tapped: 'Le cercle choisi',
    rule: 'D’où vient son nombre',
    all: 'Toutes les courbures dessinées',
  },
  tapHint: 'Touchez un cercle, même minuscule.',
  bend: (b) => `Courbure ${b}`,
  outer: (b) =>
    `Courbure ${b} : le grand cercle se courbe dans l’autre sens autour des autres, donc sa courbure est comptée comme négative.`,
  ruleWords:
    'Le double de la somme des courbures des trois cercles qu’il touche (en bleu), moins la courbure du cercle d’en face (en pointillés).',
  whole: (n, low, high) => `Nombres entiers, de ${low} à ${high}, sur ${n} cercles`,
  notWhole: (n) => `Nombres non entiers : ${n} cercles`,

  // Over the picture.
  status: (whole) => (whole ? 'Chaque courbure est entière' : 'Des courbures à virgule'),
  zoom: (x) => `×${x}`,
  bigCircle: 'Grand cercle',

  // Read out once, when a circle is tapped or a dive ends.
  told: (b, rule) => `Courbure ${b}. ${rule}`,
  dived: (x, high) => `Image agrandie ${x} fois. La plus grande courbure dessinée est ${high}.`,

  guests: [
    {
      name: 'René Descartes',
      note: 'En 1643, il a écrit à la princesse Élisabeth au sujet de cercles qui se touchent, et a donné la règle de leurs courbures sans dire comment il l’avait trouvée.',
    },
    {
      name: 'Élisabeth du Palatinat',
      note: 'Elle a travaillé sur le problème de cercles que Descartes lui avait envoyé en 1643. Ses réponses partielles l’ont conduit au cas de quatre cercles qui se touchent.',
    },
    {
      name: 'Frederick Soddy',
      note: 'Chimiste lauréat du prix Nobel, il a retrouvé la règle en 1936 et l’a publiée dans la revue Nature sous forme de poème, The Kiss Precise.',
    },
  ],

  insight: {
    title: 'Pourquoi ces nombres sont-ils tous entiers ?',
    html: `<p>Appelons <em>courbure</em> d’un cercle le nombre 1 divisé par son rayon : un petit cercle se courbe fortement, un grand doucement. Le grand cercle extérieur reçoit une courbure négative, car il se courbe dans l’autre sens autour des cercles qu’il contient. Quatre cercles qui se touchent tous deux à deux obéissent alors à une seule règle, le théorème de Descartes :</p>
<div class="insight-visual">(b₁ + b₂ + b₃ + b₄)² = 2 × (b₁² + b₂² + b₃² + b₄²)</div>
<p>Pour les quatre premiers cercles de « Moitiés », −1, 2, 2 et 3 : 6² = 36, et 2 × (1 + 4 + 4 + 9) = 36.</p>
<h3>Des entiers au départ, des entiers à l’arrivée</h3>
<p>Prenez trois cercles qui se touchent deux à deux. Exactement deux cercles touchent les trois, un de chaque côté, et pour leurs courbures, la règle est une équation du second degré. Les deux solutions d’une équation du second degré ont une somme qui se lit sur ses coefficients : ici, le double de la somme des trois courbures. Dès que l’un des deux cercles est connu, l’autre a donc pour courbure 2 × (b₁ + b₂ + b₃) − b₄. Il suffit de doubler, d’additionner et de soustraire. Chaque nouveau cercle remplit un trou à côté de cercles déjà là, donc quand les quatre premières courbures sont entières, toutes les courbures de l’image le sont aussi, aussi petit que soit le cercle. Touchez n’importe quel cercle pour le voir : les trois cercles bleus qu’il touche, et celui d’en face, en pointillés.</p>
<p>Cela ne marche qu’en partant d’entiers. Modifiez un peu un cercle de départ et les courbures deviennent décimales ; seuls des cercles de départ particuliers, comme ceux de « Moitiés », « Tiers » et « Quarts », donnent des entiers partout. Les centres suivent la même règle, une fois écrits comme nombres complexes et multipliés par leurs courbures : c’est ainsi que l’image est dessinée.</p>
<h3>Dessiné de façon approchée</h3>
<p>La vraie baderne d’Apollonius ne s’arrête jamais : chaque trou contient une infinité de cercles. L’image s’arrête aux cercles d’environ un pixel de large, et zoomer dessine les suivants. Sa dimension fractale vaut environ 1,3057, entre celle d’une courbe (1) et celle d’une surface pleine (2).</p>
<details><summary>Quels entiers ? Une recherche en cours</summary><p>Tous les entiers ne peuvent pas apparaître. Dans « Moitiés », chaque courbure divisée par 24 a pour reste 2, 3, 6, 11, 14, 15, 18 ou 23. Dans un article publié en 2003, Ronald Graham, Jeffrey Lagarias, Colin Mallows, Allan Wilks et Catherine Yan ont conjecturé que, dans une baderne comme celle-ci, tout nombre assez grand ayant un reste permis finit par apparaître : c’est la conjecture local–global. En 2023, Summer Haag, étudiante de troisième cycle, et Clyde Kertzer, étudiant de licence, avec Katherine Stange et James Rickards à l’université du Colorado à Boulder, ont montré qu’elle est fausse : dans beaucoup de badernes, des familles entières de nombres permis n’apparaissent jamais. La baderne qui commence par −3, 5, 8 et 8, par exemple, n’a aucune courbure égale à un carré, alors que ses restes autorisent des carrés comme 36 et 144. Leur article a été publié dans les <em>Annals of Mathematics</em> en 2024. Que chaque courbure soit un entier n’a jamais fait de doute ; quels entiers apparaissent, on l’étudie encore.</p></details>
<details><summary>Qui a trouvé la règle</summary><p>René Descartes l’a décrite en 1643, dans des lettres à la princesse Élisabeth du Palatinat, sans dire comment il l’avait trouvée. Jakob Steiner l’a retrouvée en 1826, Philip Beecroft en 1842, et le chimiste Frederick Soddy en 1936 : il l’a publiée dans <em>Nature</em> sous forme de poème, <em>The Kiss Precise</em>. La baderne doit son nom à Apollonius de Perga, qui, au troisième siècle av. J.-C., a écrit un livre, aujourd’hui perdu, sur les cercles tangents à trois cercles donnés. La plus ancienne description connue de la baderne elle-même est due à Gottfried Leibniz, en 1706.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Descartes%27_theorem" target="_blank" rel="noopener">Théorème de Descartes (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Apollonian_gasket" target="_blank" rel="noopener">Baderne d’Apollonius (Wikipédia, en anglais)</a><a class="source-link" href="https://arxiv.org/abs/math/0101066" target="_blank" rel="noopener">Lagarias, Mallows et Wilks, Beyond the Descartes circle theorem (2002, en anglais)</a><a class="source-link" href="https://arxiv.org/abs/math/0009113" target="_blank" rel="noopener">Graham, Lagarias, Mallows, Wilks et Yan, Apollonian circle packings: number theory (2003, en anglais)</a><a class="source-link" href="https://arxiv.org/abs/2307.02749" target="_blank" rel="noopener">Haag, Kertzer, Rickards et Stange, The local-global conjecture for Apollonian circle packings is false (2024, en anglais)</a><a class="source-link" href="https://www.quantamagazine.org/two-students-unravel-a-widely-believed-math-conjecture-20230810/" target="_blank" rel="noopener">Two students unravel a widely believed math conjecture (Quanta Magazine, en anglais)</a><a class="source-link" href="https://doi.org/10.1038/1371021a0" target="_blank" rel="noopener">Soddy, The Kiss Precise (Nature, 1936, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/" target="_blank" rel="noopener">René Descartes (MacTutor, en anglais)</a></div>`,
  },
});
