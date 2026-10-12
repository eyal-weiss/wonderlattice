/* Les rythmes d’Euclide · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('rhythm', 'fr', {
  eyebrow: 'RYTHMES EUCLIDIENS',
  name: 'Les rythmes d’Euclide',
  tagline:
    'Répartissez quelques coups autour d’un cercle, aussi régulièrement que possible, et il en sort des rythmes joués dans le monde entier.',
  title: 'Les rythmes d’Euclide.',
  subtitle:
    'Trois coups répartis aussi régulièrement que possible sur huit pas : le tresillo cubain. Changez les nombres, ou activez le son.',
  field: 'Nombres · L’algorithme d’Euclide · Rythme',
  sceneLabel: 'Des coups autour d’un cercle',
  tip: 'L’aiguille fait un tour par mesure et allume chaque coup qu’elle passe · Touchez un rythme nommé pour le jouer · Clavier : ← → le suivant',
  actionLabel: 'Activer le son',
  canvasLabel:
    'Un cadran de pas, parcouru par une aiguille. Les coups, répartis aussi régulièrement que possible, sont les sommets d’un polygone et s’allument au passage de l’aiguille. À côté, les mêmes coups en une rangée de cases, sous une droite tracée en pixels qui monte d’une marche à chaque coup.',
  panelEyebrow: 'Coups et pas',
  whyLabel: 'D’où viennent ces rythmes ?',
  nudge:
    'Activez le son, puis essayez 5 coups sur 8 pas, et 7 sur 12 : beaucoup des répartitions les plus régulières ont un nom.',
  connection: {
    html: '<strong>Des battements dans deux notes.</strong> Deux sons légèrement désaccordés enflent et s’estompent selon un rythme bien à eux, qu’on appelle des battements.',
    label: 'Entendre la forme',
  },

  presets: [
    { name: 'Tresillo', note: '3 coups sur 8 pas, de Cuba.' },
    { name: 'Bossa nova', note: '5 sur 16, sur 4 temps réguliers.' },
    { name: 'Cloche ouest-africaine', note: '7 sur 12, sur 4 et sur 3 temps.' },
  ],

  soundOff: 'Activer le son',
  soundOn: 'Son activé · couper',
  noSound: 'Le son n’est pas disponible dans ce navigateur. Vous pouvez tout de même regarder les coups.',

  rings: 'Anneaux',
  ringCounts: ['Un', 'Deux', 'Trois'],
  change: 'Modifier',
  ringNames: ['Extérieur', 'Médian', 'Intérieur'],
  steps: 'Pas',
  beats: 'Coups',
  start: 'Départ au pas',
  startHint: 'Les mêmes coups, en partant d’un autre pas du cercle.',
  speed: 'Un tour dure',
  seconds: ' s',

  // The scene's name: a rhythm Toussaint lists (its name, where it is played), or an even spread with no name here.
  scene: (name, from) => `${name} · ${from}`,
  unnamed: 'Une répartition régulière',
  // Whole numbers of beats (0 to 24) and steps (2 to 24). French uses the singular for 0 and 1.
  status: (k, n) => `${k} ${k < 2 ? 'coup' : 'coups'} sur ${n} pas`,

  // Words drawn on the canvas, kept short.
  labels: {
    line: (k, n) => `Droite de pente ${k} sur ${n}, en pixels`,
    steps: 'Elle monte à chaque coup',
    ring: (k, n) => `${k} sur ${n}`,
    ringNamed: (k, n, name) => `${k} sur ${n} · ${name}`,
    gallery: 'Autres rythmes nommés · touchez-en un',
  },

  announce: (k, n, name) =>
    name
      ? `${k} ${k < 2 ? 'coup' : 'coups'} sur ${n} pas : ${name}.`
      : `${k} ${k < 2 ? 'coup réparti' : 'coups répartis'} sur ${n} pas, aussi régulièrement que possible.`,

  // Rhythms in Toussaint’s list (2005), by the names and places he gives.
  rhythms: {
    conga: { name: 'Motif de conga', from: 'Cuba' },
    khafif: { name: 'Khafif-e-ramal', from: 'Perse, XIIIe siècle' },
    cumbia: { name: 'Cumbia', from: 'Colombie' },
    romanian: { name: 'Danse populaire', from: 'Roumanie' },
    ruchenitza: { name: 'Ruchenitza', from: 'Bulgarie' },
    tresillo: { name: 'Tresillo', from: 'Cuba' },
    ruchenitzaFour: { name: 'Ruchenitza', from: 'Bulgarie' },
    aksak: { name: 'Aksak', from: 'Turquie' },
    yorkSamai: { name: 'York-Samai', from: 'Musique arabe' },
    nawakhat: { name: 'Nawakhat', from: 'Musique arabe' },
    cinquillo: { name: 'Cinquillo', from: 'Cuba' },
    agsagSamai: { name: 'Agsag-Samai', from: 'Musique arabe' },
    venda: { name: 'Claquements de mains venda', from: 'Afrique du Sud' },
    bossa: { name: 'Bossa nova', from: 'Brésil' },
    bendir: { name: 'Tambour bendir', from: 'Touareg, Libye' },
    bell: { name: 'Motif de cloche', from: 'Afrique de l’Ouest' },
    samba: { name: 'Samba', from: 'Brésil' },
    central: { name: 'Rythme centrafricain', from: 'République centrafricaine' },
    aka: { name: 'Rythme aka', from: 'Afrique centrale' },
    sangha: { name: 'Rythme aka', from: 'Haute-Sangha, Afrique centrale' },
  },

  // The explanation's worked example, for the outer ring's numbers: Bjorklund's rounds (already drawn as groups of
  // x and ·), then Euclid's divisions a = q × b + r.
  roundsIntro: (k, n) => `Répartir ${k} ${k < 2 ? 'coup' : 'coups'} sur ${n} pas, tour par tour :`,
  divisionsIntro: (n, k) => `L’algorithme d’Euclide appliqué à ${n} et ${k} :`,
  division: (a, q, b, r) => `${a} = ${q} × ${b} + ${r}`,
  noRounds: 'Sans aucun coup, ou sans aucun silence, il n’y a rien à répartir.',

  guests: [
    {
      name: 'Euclide',
      note: 'Dans mes Éléments, j’ai trouvé le plus grand nombre qui mesure deux autres nombres en retranchant le plus petit du plus grand, encore et encore. Les mêmes étapes répartissent ces coups.',
    },
    {
      name: 'Godfried Toussaint',
      note: 'J’ai remarqué qu’une recette pour cadencer des impulsions dans un accélérateur de particules produit aussi des rythmes joués dans le monde entier, et en 2005 je les ai appelés rythmes euclidiens.',
    },
  ],

  insight: {
    title: 'D’où viennent ces rythmes ?',
    html: `<p>Placez quelques coups sur un cercle de pas, aussi loin les uns des autres que possible. Quand les coups divisent exactement les pas, tous les écarts sont égaux. Sinon, les écarts sont de deux tailles, à un pas près, mélangés aussi régulièrement que possible : 3 coups sur 8 pas laissent des écarts de 3, 3 et 2. Ce motif, c’est le tresillo, un rythme de base de la musique cubaine, joué aussi sur des cloches en Afrique de l’Ouest et dans les lignes de basse du rock’n’roll des années 1950.</p>
<h3>La soustraction d’Euclide</h3>
<p>Pour les répartir, écrivez les coups à la suite, puis les silences. Glissez un silence derrière chaque coup, puis continuez à glisser les groupes restants derrière les autres, jusqu’à ce qu’il reste au plus un groupe. Eric Bjorklund s’en est servi en 2003 pour espacer les impulsions de cadencement d’un accélérateur de particules, la Spallation Neutron Source. Cela suit les mêmes étapes que l’algorithme d’Euclide pour le plus grand commun diviseur, tiré de ses Éléments, vers 300 av. J.-C. : diviser, puis diviser par le reste, encore et encore.</p>
<div class="insight-visual" id="rhythm-rounds"></div>
<h3>Des rythmes qui ont un nom</h3>
<p>En 2005, Godfried Toussaint a appelé ces motifs des rythmes euclidiens, et il a recensé parmi eux des rythmes traditionnels de Cuba, du Brésil, d’Afrique de l’Ouest et d’Afrique centrale, de Turquie, de Bulgarie et de la musique arabe. Ici, un nom désigne le même motif, quel que soit le pas où il commence, comme dans sa liste : beaucoup de rythmes se jouent à partir d’un autre coup. La bossa nova commence son 5 sur 16 sur le troisième coup, et la samba son 7 sur 16 sur le dernier ; « Départ au pas » fait tourner un anneau. Le 7 sur 12 de la cloche ouest-africaine est aussi le motif des touches blanches parmi les douze touches d’une octave de piano.</p>
<h3>Une droite en pixels</h3>
<p>Tracez à l’écran une droite qui monte de 3 sur 8, un pixel par colonne. Elle passe 3 fois à une nouvelle rangée, et les colonnes où elle monte redonnent le tresillo. Quels que soient les nombres, la droite monte selon un motif des plus réguliers, lu à partir d’une certaine colonne.</p>
<h3>Aussi espacés que possible</h3>
<p>De toutes les façons de placer les coups sur les pas, celles-ci les gardent le plus éloignés : additionnez les distances en ligne droite entre toutes les paires de coups autour du cercle, et seul un rythme euclidien, tourné ou non, atteint le plus grand total. Erik Demaine et ses collègues l’ont démontré en 2009.</p>
<h3>Ce que la salle laisse de côté</h3>
<p>Personne ne prétend que les musiciens se servaient de l’algorithme d’Euclide : la régularité est simplement un point commun de ces rythmes. Le vrai jeu a des accents, du swing et le son propre de chaque instrument, que les coups et les silences laissent de côté. Tous les rythmes ne sont pas euclidiens : la clave son a cinq coups sur seize, comme la bossa nova, mais des écarts de 3, 3, 4, 2 et 4. Les noms suivent la liste de Toussaint, et le même motif porte souvent d’autres noms ailleurs.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Un motif de k coups sur n pas est un collier de k chiffres 1 et n − k chiffres 0. L’algorithme de Bjorklund garde deux piles de groupes, [1] × k et [0] × (n − k) ; à chaque tour, il accole un groupe de la pile arrière à chaque groupe de la pile avant, et ce qui reste devient la nouvelle pile arrière. Les tailles des piles suivent l’algorithme d’Euclide appliqué à n − k et k, et le processus s’arrête quand il reste au plus un groupe.</p><p>La droite discrète donne le même collier : le pas i est un coup quand ⌊ik/n⌋ &gt; ⌊(i − 1)k/n⌋, le motif que l’algorithme de tracé de segment de Bresenham dessine à l’écran. En théorie musicale, les ensembles maximalement réguliers de Clough et Douthett sont la même idée appliquée aux gammes. La régularité est ici la somme des longueurs des cordes entre toutes les paires de coups sur un cercle de rayon 1.</p><p>Les tests de la salle vérifient, à l’aide d’un programme distinct : la table de Toussaint, chaque E(k, n) jusqu’à 32 pas comparé à la droite, chaque motif d’au plus 14 pas pour le plus grand écartement, et les départs de la bossa nova et de la samba.</p></details>
<div class="sources"><a class="source-link" href="https://archive.bridgesmathart.org/2005/bridges2005-47.html" target="_blank" rel="noopener">Toussaint, The Euclidean algorithm generates traditional musical rhythms (Bridges, 2005, en anglais)</a><a class="source-link" href="https://arxiv.org/abs/0705.4085" target="_blank" rel="noopener">Demaine et ses coauteurs, The distance geometry of music (2009, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euclidean_rhythm" target="_blank" rel="noopener">Rythme euclidien (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Maximal_evenness" target="_blank" rel="noopener">Régularité maximale (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tresillo_(rhythm)" target="_blank" rel="noopener">Tresillo (Wikipédia, en anglais)</a></div>`,
  },
});
