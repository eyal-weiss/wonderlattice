Wonderlattice.defineText('dice', 'fr', {
  eyebrow: 'DÉNOMBREMENT',
  name: 'Les dés qui se battent entre eux',
  tagline: 'Choisissez n’importe quel dé. Il y en a toujours un qui le bat.',
  title: 'Les dés qui se battent entre eux.',
  subtitle:
    'Choisissez un de ces dés étranges, puis je choisis le mien et on lance. Quel que soit votre choix, un autre a tendance à le battre.',
  field: 'Probabilités · Dénombrement · Une petite surprise',
  sceneLabel: 'Des dés bizarres · Un cercle',
  tip: 'Touchez un dé dans le cercle, ou appuyez sur ← et →, pour choisir le vôtre · Chaque flèche va du gagnant au perdant',
  actionLabel: 'Lancer 100 fois',
  canvasLabel:
    'Deux dés lancés l’un contre l’autre, le décompte des victoires, la part de victoires au fil des lancers, et un cercle de flèches qui montre quel dé bat le plus souvent quel autre. Touchez un dé dans le cercle, ou utilisez les flèches gauche et droite, pour choisir votre dé.',
  panelEyebrow: 'Choisir, puis lancer',
  whyLabel: 'Comment chaque dé peut-il perdre ?',
  nudge:
    'Essayez chaque dé tour à tour. À chaque fois, j’en trouve un qui bat le vôtre. Existe-t-il un dé que je ne peux pas battre ?',
  connection: {
    html: '<strong>L’intuition, doucement renversée.</strong> Ici, « meilleur » tourne en rond. En ville, une toute nouvelle route peut rendre chaque trajet plus lent.',
    label: 'Essayer « Le raccourci tentant »',
  },
  sets: ['Trois dés · 5/9', 'Les quatre dés d’Efron · 2/3', 'Les dés de Grime · un retournement'],
  sceneNames: ['Choisir en premier', 'Les quatre d’Efron', 'Les dés de Grime'],
  twoEach: (name) => `${name} · deux de chaque`,
  marks: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['R', 'B', 'O'],
  ],
  names: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['Rouge', 'Bleu', 'Olive'],
  ],
  setLabel: 'Jeu de dés',
  youLabel: 'Votre dé',
  rivalLabel: 'Mon dé',
  letMe: 'Laissez-moi choisir',
  pairs: 'Lancer deux de chaque et additionner',
  speed: 'Lancers par seconde',
  speedHint: 'Assez lent pour regarder, ou assez rapide pour trancher.',
  faces: (list) => list.join(' '),
  pickDie: (name, list) => `Dé ${name} : ${list.join(', ')}`,
  you: 'Vous',
  me: 'Moi',
  vs: 'contre',
  iTake: (you, me) => `Vous avez choisi ${you}. Je prends ${me}.`,
  against: (you, me) => `${you} contre ${me}. Vous avez choisi les deux.`,
  ready: 'Prêt à lancer',
  rolls: (n) => (n <= 1 ? `${n} lancer` : `${n.toLocaleString(Wonderlattice.lang)} lancers`),
  circleTitle: 'Le cercle des victoires',
  even: 'à égalité',
  winsTitle: 'Victoires',
  latestTitle: 'Derniers lancers, du plus récent au plus ancien',
  ties: (n) => (n <= 1 ? `${n} égalité` : `${n} égalités`),
  shareTitle: (name) => `Taux de victoire · ${name}`,
  exactLabel: (fraction) => `exactement ${fraction}`,
  startHint: 'Appuyez sur « Lancer 100 fois »',
  rollsSoFar: 'Lancers jusqu’ici',
  winsLine: (you, me, a, b) => `Vous (${you}) ${a} · Moi (${me}) ${b}`,
  seenLine: (name, seen, fraction, exact) =>
    `${name} gagne : ${seen === null ? '–' : seen + ' %'} jusqu’ici · exactement ${fraction} ≈ ${exact} %`,
  verdictStart: (favourite, fraction) =>
    `En théorie, ${favourite} gagne exactement ${fraction} des parties. Lancez pour le voir se produire.`,
  verdict: (n, favourite, seen, fraction) =>
    `Après ${n.toLocaleString(Wonderlattice.lang)} ${n <= 1 ? 'lancer' : 'lancers'}, ${favourite} a gagné ${seen} % des parties. La probabilité exacte est ${fraction}.`,
  evenVerdict: 'Ces deux dés ont les mêmes chances de gagner.',
  sameDie: 'Le même dé des deux côtés : mêmes chances de gagner.',
  presets: [
    {
      name: 'Choisir en premier',
      note: 'Je choisis après vous.',
      badge: '5/9',
    },
    {
      name: 'Les quatre d’Efron',
      note: 'Quatre dés, un cercle.',
      badge: '2/3',
    },
    {
      name: 'Deux de chaque',
      note: 'Doublez les dés, le cercle s’inverse.',
      badge: '↺',
    },
  ],
  guests: [
    {
      name: 'Blaise Pascal',
      note: 'Un problème de dés posé par un joueur lui est parvenu. Sa correspondance avec Fermat, en 1654, a marqué le début des mathématiques du hasard.',
    },
  ],
  gridAxes: (me, you) =>
    `Les lignes sont mon dé, ${me} ; les colonnes sont votre dé, ${you}. Chaque case prend la couleur de son gagnant.`,
  gridNote: (win, lose, tie, total, me, you) =>
    `${me} gagne ${win} des ${total.toLocaleString(Wonderlattice.lang)} combinaisons également probables, ${you} en gagne ${lose}` +
    (tie ? `, et ${tie} ${tie === 1 ? 'est une égalité' : 'sont des égalités'}.` : '.'),
  insight: {
    title: 'Comment chaque dé peut-il perdre ?',
    html: `<p>Comptez au lieu de deviner. Chaque dé a six faces, donc deux dés peuvent tomber de 6 × 6 = 36 façons également probables. Prenez A (2, 2, 4, 4, 9, 9) contre B (1, 1, 6, 6, 8, 8). Les deux 9 de A battent les six faces de B : 12 façons. Les 2 et les 4 de A ne battent que les deux 1 de B : 4 × 2 = 8 de plus. Cela fait 20 sur 36 pour A, soit 5/9. Le même calcul montre que B bat C, et que C bat A.</p>
<canvas id="dice-grid" class="dice-grid" aria-hidden="true"></canvas>
<p id="dice-grid-note"></p>
<div class="insight-visual">A bat B, B bat C, et C bat A. « Bat le plus souvent » ne se range pas en file indienne : celui qui choisit en second peut donc toujours trouver un dé gagnant.</div>
<h3>Meilleur en moyenne ne veut pas dire gagner le plus souvent</h3>
<p>Les trois dés du premier jeu ont tous une moyenne d’exactement 5. Dans le jeu d’Efron, C (6, 6, 2, 2, 2, 2) a la plus forte moyenne, 3⅓, et pourtant il perd deux fois sur trois contre B, qui affiche toujours 3. Une moyenne tient compte de l’ampleur de chaque victoire ; « gagner le plus souvent » ne compte que leur fréquence.</p>
<h3>Deux de chaque renverse le cercle</h3>
<p>Avec les dés rouge, bleu et olive de James Grime, un dé chacun, le rouge bat le bleu, le bleu bat l’olive et l’olive bat le rouge. Lancez-en deux de chaque et additionnez : toutes les flèches s’inversent. Le bleu bat le rouge, l’olive bat le bleu, et le rouge bat l’olive. Additionner deux dés change les totaux probables, et cela change qui gagne le plus souvent.</p>
<h3>Ce que cela suppose</h3>
<p>Des dés équilibrés : chaque face est également probable, et chaque lancer est indépendant des autres. Ici, les lancers viennent d’un générateur de nombres pseudo-aléatoires. Quelques dizaines de lancers peuvent s’écarter beaucoup de la probabilité exacte. L’écart typique diminue lentement, comme un sur la racine carrée du nombre de lancers : environ 5 % après 100 lancers, environ 0,5 % après 10 000.</p>
<details><summary>Existe-t-il un dé que personne ne bat ?</summary><p>Pas dans ces jeux. Chaque dé en a un autre qui le bat plus d’une fois sur deux. C’est ce que veut dire « non transitif » : « battre » ne se transmet pas le long d’une chaîne comme « être plus grand que ». Dans le jeu d’Efron, la meilleure réponse de la salle gagne deux fois sur trois, quel que soit votre choix.</p></details>
<div class="sources"><a class="source-link" href="https://nrich.maths.org/problems/non-transitive-dice?tab=teacher" target="_blank" rel="noopener">NRICH : dés non transitifs (en anglais)</a><a class="source-link" href="https://www.scientificamerican.com/article/mathematical-games-1970-12/" target="_blank" rel="noopener">Martin Gardner sur les dés d’Efron (1970, en anglais)</a><a class="source-link" href="http://singingbanana.com/dice/article.htm" target="_blank" rel="noopener">Les dés de James Grime (une numérotation antérieure, avec les mêmes probabilités ; en anglais)</a></div>`,
  },
});
