/* La forme cachée dans le hasard · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('galton', 'fr', {
  eyebrow: 'PROBABILITÉS',
  name: 'La forme cachée dans le hasard',
  tagline:
    'Chaque bille rebondit à gauche ou à droite au hasard. Ensemble, elles dessinent la même cloche à chaque fois.',
  title: 'La forme cachée dans le hasard.',
  subtitle:
    'Chaque bille rebondit à gauche ou à droite au hasard, et pourtant le tas prend la forme de la même cloche à chaque fois. Faites ensuite la moyenne d’un dé pipé.',
  field: 'Probabilités · Le triangle de Pascal · Le théorème central limite',
  canvasLabel:
    'Une planche à clous. Des billes tombent du haut, rebondissent à gauche ou à droite au hasard sur chaque clou, et s’entassent dans des cases en bas, sous une courbe en cloche. En dessous, quatre autres essais ont donné la même cloche.',
  panelEyebrow: 'Laissé au hasard',
  whyLabel: 'Pourquoi le hasard fait-il une cloche ?',
  nudge:
    'Versez encore : chaque bille prend un nouveau chemin, et le tas forme toujours la même cloche. Puis créez un dé pipé et regardez ses moyennes.',
  connection: {
    html: '<strong>Les moyennes apprivoisent le hasard.</strong> Dans « Une cuillerée de ville », un petit sondage au hasard tombe près de la vérité pour la même raison : les moyennes de nombreuses réponses prises au hasard se resserrent en une cloche étroite.',
    label: 'Prendre une cuillerée de ville',
  },

  // The three things that fall: each has its own scene, tip and action.
  viewLabel: 'Ce qui tombe',
  views: ['Billes et clous', 'Un dé pipé', 'Un phare têtu'],
  scenes: [
    { label: 'À gauche ou à droite à chaque clou', name: 'Des billes sur des clous' },
    { label: 'Votre dé, et les moyennes de ses lancers', name: 'Un dé pipé' },
    { label: 'Une lampe tourne et éclaire un mur', name: 'Un phare têtu' },
  ],
  tips: [
    'Les flèches inclinent les clous · « Verser encore » pour de nouvelles billes',
    'Tirez les barres du dé pour changer sa forme · Les flèches choisissent une face et la modifient',
    'Chaque tour marque où tombe la lumière · « Tourner encore » pour de nouveaux tours',
  ],
  actions: ['Verser encore', 'Relancer', 'Tourner encore'],
  canvasLabels: [
    'Une planche à clous. Des billes tombent du haut, rebondissent à gauche ou à droite au hasard sur chaque clou, et s’entassent dans des cases en bas, sous une courbe en cloche. En dessous, quatre autres essais ont donné la même cloche.',
    'Un dé pipé dessiné en six barres, et trois tas à côté : des lancers simples, des moyennes de 2 lancers et des moyennes de plus de lancers, chacun surmonté d’une courbe en cloche.',
    'Une lampe tourne et éclaire un mur ; le tas des points où tombent les tours simples et le tas des moyennes de plusieurs tours ont la même forme.',
  ],

  presets: [
    { name: 'Des billes sur des clous', note: 'La même cloche à chaque fois.', badge: '½' },
    { name: 'Incliner les clous', note: 'La cloche se déplace.', badge: '¾' },
    { name: 'Un dé pipé', note: 'Ses moyennes deviennent une cloche.', badge: '1·6' },
  ],

  rows: 'Rangées de clous',
  tilt: 'Chance de rebondir à droite',
  tiltHint: 'À 50 %, chaque clou est équitable. Inclinez-les, et la cloche se déplace.',
  throws: 'Lancers par moyenne',
  dieHint: 'Tirez les barres du dé dans l’image pour changer sa forme.',
  shapeLabel: 'Partir de',
  shapes: ['Surtout 1 et 6', 'Un dé honnête', 'Surtout des 6'],
  spins: 'Tours par moyenne',
  spinHint:
    'Faire la moyenne de plus de tours n’aide pas : la dispersion de la lampe n’est pas finie, alors que la cloche en a besoin.',

  status: {
    pouring: (n) =>
      `${n.toLocaleString('fr')} ${n < 2 ? 'bille' : 'billes'} · à gauche ou à droite au hasard à chaque clou`,
    poured: (n) => `${n.toLocaleString('fr')} billes · la même cloche à chaque fois`,
    throwing: (n) => `${n.toLocaleString('fr')} dans chaque tas`,
    spinning: (n) => `${n.toLocaleString('fr')} dans chaque tas`,
  },
  announce: {
    poured: (n) => `${n.toLocaleString('fr')} billes sont tombées, en forme de cloche.`,
    die: (face, weight) => `Face ${face} : ${weight} sur 10`,
  },

  labels: {
    bell: 'la cloche',
    others: (pours, balls) =>
      `${pours} ${pours < 2 ? 'autre essai' : 'autres essais'} de ${balls.toLocaleString('fr')} billes : la même cloche`,
    yourDie: 'Votre dé · tirez les barres',
    oneThrow: 'Un lancer',
    average: (n) => `Moyennes de ${n} lancers`,
    oneSpin: 'Un tour',
    averageSpins: (n) => `Moyennes de ${n} tours`,
    off: (n) => `${n.toLocaleString('fr')} hors graphique`,
    lamp: 'lampe',
    wall: 'mur',
  },

  guests: [
    {
      name: 'Abraham de Moivre',
      note: 'En 1733, j’ai montré que le nombre de fois où une pièce tombe sur face, en des milliers de lancers, suit une courbe lisse en forme de cloche.',
    },
    {
      name: 'Pierre-Simon Laplace',
      note: 'J’ai montré que la cloche va bien au-delà des pièces : les moyennes de nombreuses sortes de mesures aléatoires s’y resserrent.',
    },
  ],

  insight: {
    title: 'Pourquoi le hasard fait-il une cloche ?',
    html: `<p>Chaque bille fait le même genre de choix à chaque clou : à gauche ou à droite. Pour arriver tout au bord, elle doit aller du même côté à chaque fois, et un seul chemin fait cela. Pour arriver au milieu, il lui faut autant de gauches que de droites, et des centaines de chemins le font. Compter les chemins qui mènent à chaque case donne une ligne du triangle de Pascal (1, 12, 66, 220, 495, 792, 924, … pour douze rangées), et ces nombres dessinent la cloche. Aucune bille ne sait où elle va ; la forme vient du dénombrement.</p>
<div class="insight-visual">12 rangées de clous : 1 chemin vers chaque bord, 924 chemins vers le milieu, sur 4 096</div>
<h3>Les moyennes font la même cloche</h3>
<p>Les lancers simples du dé gardent sa forme bancale. Faites la moyenne de deux lancers et un pic apparaît au milieu, la forme bizarre restant visible ; faites la moyenne de dix et le tas ressemble davantage à une cloche, plus étroite. C’est le théorème central limite : les moyennes de nombreux lancers indépendants, de presque n’importe quel dé, se resserrent en une cloche autour de la moyenne du dé, et la cloche rétrécit comme 1/√n. Les moyennes de 10 lancers sont environ √10 fois, soit un peu plus de 3 fois, moins dispersées que les lancers simples.</p>
<h3>Quand ça ne marche pas</h3>
<p>Le théorème demande des lancers qui ne s’influencent pas les uns les autres, et dont la dispersion est finie. Le phare têtu enfreint la seconde règle : une lampe qui tourne au hasard éclaire parfois presque le long du mur, si bien que quelques tours atterrissent extrêmement loin. Ses moyennes sont aussi folles qu’un tour unique, quel que soit le nombre de tours. Cette lampe suit la loi de Cauchy, du nom d’Augustin-Louis Cauchy.</p>
<h3>Ce que cette salle simplifie</h3>
<p>Les billes suivent un modèle aléatoire, pas la physique : chaque clou est un pile ou face, équitable ou biaisé, indépendant des autres. Les vraies planches ne sont jamais parfaitement équitables, et les vraies billes rebondissent et tournent sur elles-mêmes, si bien que leurs tas sont plus irréguliers. Les moyennes de 2 ou 5 lancers sont plus proches d’une cloche, sans en être exactement une.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Avec n rangées et une chance p de rebondir à droite, une bille tombe dans la case k (k rebonds à droite) avec la probabilité C(n, k)·pᵏ·(1 − p)ⁿ⁻ᵏ, la loi binomiale, de moyenne np et d’écart type √(np(1 − p)). Abraham de Moivre a montré en 1733, puis dans la deuxième édition de sa <em>Doctrine of Chances</em> (1738), que pour de nombreux lancers elle est proche de la courbe normale ; Pierre-Simon Laplace a publié un résultat plus général dans sa <em>Théorie analytique des probabilités</em> (1812). Francis Galton a conçu la planche, qu’il appelait le quincunx, pour une conférence à la Royal Institution en 1874, et l’a décrite dans <em>Natural Inheritance</em> (1889). La moyenne de n tours de Cauchy a exactement la même loi qu’un tour unique.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Galton_board" target="_blank" rel="noopener">Planche de Galton (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/De_Moivre%E2%80%93Laplace_theorem" target="_blank" rel="noopener">Théorème de Moivre-Laplace (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Central_limit_theorem" target="_blank" rel="noopener">Théorème central limite (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cauchy_distribution" target="_blank" rel="noopener">Loi de Cauchy (Wikipédia, en anglais)</a></div>`,
  },
});
