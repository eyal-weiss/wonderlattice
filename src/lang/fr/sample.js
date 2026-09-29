Wonderlattice.defineText('sample', 'fr', {
  eyebrow: 'ÉCHANTILLONNAGE',
  name: 'Une cuillerée de ville',
  tagline: 'Un énorme sondage peut être sûr de lui et se tromper. Un petit sondage au hasard tombe à peu près juste.',
  title: 'Une cuillerée de ville.',
  subtitle:
    'Orange ou bleu : que préfère la ville entière ? Vous ne pouvez interroger qu’une partie des habitants, alors essayez un grand sondage et un petit.',
  field: 'Statistiques · Échantillonnage · Erreur aléatoire et biais',
  sceneLabel: 'Sonder une ville miniature',
  tip: 'Touchez un quartier, ou appuyez sur ← →, pour n’interroger que là · ↑ ↓ changent la taille du sondage',
  actionLabel: 'Interroger 50 fois',
  canvasLabel:
    'Une carte d’une petite ville dont chaque habitant préfère l’orange ou le bleu, avec les personnes interrogées lors du dernier sondage mises en lumière, à côté d’un graphique avec un point par estimation de sondage. Touchez un quartier, ou utilisez les flèches gauche et droite, pour n’interroger que là. Les flèches haut et bas changent le nombre de personnes interrogées par sondage.',
  panelEyebrow: 'Choisir comment interroger',
  whyLabel: 'Pourquoi interroger plus de monde n’aide-t-il pas ?',
  nudge:
    'Interrogez 50 fois au hasard. Puis interrogez plutôt les voisins. Deux nuages de points bien serrés : lequel est juste ? Montrez la ville entière pour le savoir.',
  connection: {
    html: '<strong>Le hasard, par les deux bouts.</strong> Ici, vous devinez une ville entière à partir d’une cuillerée. Avec les dés bizarres, le calcul vous dit exactement ce que donneront de nombreux lancers.',
    label: 'Lancer les dés bizarres',
  },
  methodLabel: 'Comment interroger',
  methods: ['Au hasard', 'Les voisins', 'Les volontaires'],
  sceneNames: ['Interroger au hasard', (hood) => `À ${hood}`, 'Ceux qui répondent'],
  hoodLabel: 'Quartier',
  hoods: [
    'Port-Joli',
    'Vieux-Bourg',
    'Hautmont',
    'Moulins',
    'Rivebelle',
    'Grand-Marché',
    'Clos-Pommier',
    'Gare-Neuve',
    'Beaujardin',
    'Fourneaux',
    'Mont-Lanterne',
    'Cordeville',
  ],
  sizeLabel: 'Personnes par sondage',
  reveal: 'Montrer ce que préfère toute la ville',
  askOnce: 'Interroger une fois',
  newCity: 'Une nouvelle ville',
  cityTitle: (n) => `La ville · ${n.toLocaleString(Wonderlattice.lang)} habitants`,
  plotTitle: (n) => `Part qui préfère l’orange · un point par sondage de ${n.toLocaleString(Wonderlattice.lang)}`,
  plotTitleShort: 'Part d’orange · un point par sondage',
  blueWins: 'le bleu gagne',
  orangeWins: 'l’orange gagne',
  wholeCity: (pct) => (pct === null ? 'ville entière : ?' : `ville entière ${pct} %`),
  before: (name, n) => `○ Avant : ${name}, ${n.toLocaleString(Wonderlattice.lang)} par sondage`,
  startHint: 'Appuyez sur « Interroger 50 fois »',
  ready: 'Prêt à interroger',
  surveys: (n) => (n <= 1 ? `${n} sondage` : `${n.toLocaleString(Wonderlattice.lang)} sondages`),
  noSurveys: 'Aucun sondage pour l’instant.',
  noEstimate: 'Chaque sondage ajoutera un point.',
  surveyLine: (count, n) =>
    `<strong>${count.toLocaleString(Wonderlattice.lang)}</strong> ${count <= 1 ? 'sondage' : 'sondages'} de ${n.toLocaleString(Wonderlattice.lang)} ${n <= 1 ? 'personne' : 'personnes'}`,
  estimateLine: (mean, spread) =>
    spread === null
      ? `Celui-ci dit que ${mean} % préfèrent l’orange.`
      : `En moyenne, ${mean} % préfèrent l’orange ; d’un sondage à l’autre, l’écart typique est de ${spread.replace('.', ',')} points.`,
  theoryLine: (n, se) =>
    `Un échantillon aléatoire de ${n.toLocaleString(Wonderlattice.lang)} personnes fluctue d’environ ±${se.replace('.', ',')} points.`,
  truthHidden: 'La réponse de la ville entière est cachée.',
  truthLine: (pct, miss) =>
    miss === null
      ? `La ville entière : ${pct} % d’orange.`
      : `La ville entière : ${pct} % d’orange. Écart typique : ${miss.replace('.', ',')} points.`,
  randomNote: 'N’importe qui dans la ville peut être interrogé.',
  hoodNote: (size, name) => `${size.toLocaleString(Wonderlattice.lang)} personnes habitent à ${name}.`,
  hoodAll: (size, name) =>
    `Seulement ${size.toLocaleString(Wonderlattice.lang)} personnes habitent à ${name} : chaque sondage interroge donc tout le monde là-bas.`,
  volunteerNote: (answer, total) =>
    `Seuls ceux qui répondent comptent : ${answer.toLocaleString(Wonderlattice.lang)} sur ${total.toLocaleString(Wonderlattice.lang)}. Les fans d’orange répondent plus volontiers.`,
  volunteerAll: (answer) =>
    `Seules ${answer.toLocaleString(Wonderlattice.lang)} personnes acceptent de répondre : chaque sondage les interroge donc toutes.`,
  presets: [
    {
      name: 'Un petit sondage au hasard',
      note: '50 personnes, n’importe qui dans la ville.',
    },
    {
      name: 'Interroger les voisins',
      note: '50 personnes, toutes du même quartier.',
    },
    {
      name: 'Un énorme sondage biaisé',
      note: '1 000 réponses de ceux qui veulent bien répondre.',
    },
  ],
  guests: [
    {
      name: 'Jerzy Neyman',
      note: 'En 1934, il a prévenu que choisir à la main des districts « typiques » est un pari. Choisissez au hasard, soutenait-il, et vous pourrez dire de combien vous risquez de vous tromper.',
    },
  ],
  live: (n, se, hood, hoodOff, answerOff) =>
    `Dans votre ville, un échantillon aléatoire de ${n.toLocaleString(Wonderlattice.lang)} personnes fluctue d’environ ±${se.replace('.', ',')} points. ` +
    `Interroger seulement à ${hood} donne un écart de ${hoodOff.replace('.', ',')} points, et compter ceux qui répondent un écart de ${answerOff.replace('.', ',')}, quel que soit le nombre de personnes interrogées.`,
  insight: {
    title: 'Pourquoi interroger plus de monde n’aide-t-il pas ?',
    html: `<p>Ici, chaque sondage choisit des gens au hasard. Mais le hasard ne peut choisir que parmi les personnes qu’une méthode peut atteindre : toute la ville, un seul quartier, ou les habitants qui prennent la peine de répondre. Les statisticiens appellent cette liste la <em>base de sondage</em>. Un tirage au hasard dans la base vous renseigne sur la base, pas sur la ville.</p>
<h3>Fluctuation et biais</h3>
<p>L’<strong>erreur aléatoire</strong> est la fluctuation d’un sondage à l’autre. Elle diminue quand l’échantillon grandit, comme un sur la racine carrée de sa taille : interrogez quatre fois plus de monde, et la fluctuation est divisée par deux. Le <strong>biais</strong> est l’écart entre la réponse de la base et celle de la ville. Tous les sondages tirés de la même base le partagent : interroger plus de monde ne le réduit donc pas. Cela vous rend seulement plus sûr de la mauvaise réponse.</p>
<div class="insight-visual">erreur typique² = fluctuation² + biais²</div>
<p id="sample-live"></p>
<h3>Des millions de réponses, le mauvais gagnant</h3>
<p>En 1936, le magazine américain <em>The Literary Digest</em> a envoyé par la poste plus de dix millions de bulletins, surtout à des noms tirés d’annuaires téléphoniques et de fichiers d’immatriculation automobile. Plus de 2,3 millions sont revenus, moins d’un sur quatre. Son décompte final donnait 54 % à Alf Landon et 41 % à Franklin Roosevelt. Le jour de l’élection, Roosevelt l’a emporté avec 61 %. Des sondages bien plus petits, menés par George Gallup et d’autres, qui choisissaient leurs échantillons avec plus de soin, ont donné Roosevelt gagnant.</p>
<p>Un demi-siècle plus tard, le politologue Peverill Squire s’est servi d’une enquête Gallup de 1937 qui demandait aux gens s’ils avaient reçu un bulletin du Digest et s’ils l’avaient renvoyé. Il a montré que la liste comme les réponses penchaient vers Landon, et qu’ensemble elles expliquaient l’erreur. Si tout le monde sur la liste avait répondu, le sondage aurait au moins désigné le bon gagnant.</p>
<h3>La fluctuation, exactement</h3>
<p>Pour un échantillon aléatoire de <em>n</em> personnes dans une ville de <em>N</em> habitants, où une part <em>p</em> préfère l’orange, la fluctuation typique (l’erreur type) vaut √(<em>p</em>(1 − <em>p</em>)/<em>n</em>) × √((<em>N</em> − <em>n</em>)/(<em>N</em> − 1)). Le second facteur, la correction pour population finie, vient de ce que personne n’est interrogé deux fois. Il compte ici parce que la ville est petite, et il tombe à zéro quand on interroge tout le monde. La salle utilise cette formule corrigée.</p>
<details><summary>Ce que cette ville miniature laisse de côté</summary><p>Deux couleurs, des quartiers tirés au hasard, des habitants qui ne changent jamais d’avis, et un taux de réponse qui ne dépend que de la couleur. Les vrais sondages choisissent les gens plus astucieusement (Jerzy Neyman a défendu en 1934 le tirage au hasard à l’intérieur de groupes, appelés strates), puis pondèrent les réponses pour coller à ce que l’on sait de la population et corrigent l’effet des non-réponses. Les sondages de Gallup, dans les années 1930, remplissaient eux-mêmes des quotas de différents types de personnes, une méthode qui a ses propres défauts. La marge d’erreur imprimée à côté d’un sondage ne décrit que la fluctuation aléatoire ; elle ne voit pas le biais.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1086/269085" target="_blank" rel="noopener">Squire : pourquoi le sondage du Literary Digest de 1936 a échoué (1988, en anglais)</a><a class="source-link" href="https://doi.org/10.2307/2342192" target="_blank" rel="noopener">Neyman sur l’échantillonnage aléatoire ou raisonné (1934, en anglais)</a><a class="source-link" href="https://online.stat.psu.edu/stat506/Lesson02" target="_blank" rel="noopener">L’erreur type d’une proportion estimée (Penn State STAT 506, en anglais)</a></div>`,
  },
});
