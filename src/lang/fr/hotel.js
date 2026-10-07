/* L’hôtel toujours complet · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('hotel', 'fr', {
  eyebrow: 'INFINI',
  name: 'L’hôtel toujours complet',
  tagline:
    'Toutes les chambres sont prises, et pourtant un client de plus trouve sa place, puis une infinité d’autres. Puis arrive un car qui n’en trouvera jamais.',
  title: 'L’hôtel toujours complet.',
  subtitle:
    'Toutes les chambres d’un hôtel infini sont prises, et pourtant regardez-le accueillir un client de plus, puis un car rempli d’une infinité de passagers. Essayez ensuite le car à pile ou face.',
  field: 'Infini · Correspondance un à un · L’argument de la diagonale de Cantor',
  sceneLabel: 'Chambres 1, 2, 3, … à l’infini',
  sceneNames: ['Un client de plus', 'Un car sans fin', 'Une infinité de cars', 'Le car à pile ou face'],
  tip: 'Choisissez une carte de déplacement dans le panneau · Avec le car à pile ou face, touchez une pièce pour la retourner (les flèches visent, Entrée retourne)',
  actionLabel: 'Arrivée suivante',
  canvasLabel:
    'Un couloir d’hôtel sans fin, aux portes numérotées qui rapetissent au loin, toutes les chambres occupées. De nouveaux clients arrivent, et tous les clients changent de chambre en même temps pour leur faire de la place. Avec le car à pile ou face, une liste de passagers, un par chambre, et un nouveau passager construit à partir de sa diagonale. Touchez une pièce pour la retourner, ou utilisez les flèches pour viser et Entrée pour retourner.',
  panelEyebrow: 'Cartes de déplacement',
  whyLabel: 'Comment un hôtel complet peut-il accueillir d’autres clients ?',
  nudge:
    'Après le car sans fin, appuyez sur « Arrivée suivante » : une infinité de cars, puis un car dont aucune liste de chambres ne peut loger tous les passagers.',
  connection: {
    html: '<strong>Impossible, quoi que vous essayiez.</strong> Ici, aucune liste de chambres ne loge tous les passagers du car à pile ou face. Dans « Le sol impossible », un coloriage prouve qu’aucun pavage ne peut couvrir le sol.',
    label: 'Visiter « Le sol impossible »',
  },

  presets: [
    { name: 'Un client de plus', note: 'L’hôtel est complet. Un client frappe.' },
    { name: 'Une infinité de cars', note: 'Une infinité, et chacun est plein.' },
    { name: 'Le car à pile ou face', note: 'Le car qui ne trouve pas de place.' },
  ],

  // The moving cards: the big face, and what it tells the guest in room n.
  cards: {
    one: { face: '+1', rule: 'chambre n → chambre n + 1' },
    five: { face: '+5', rule: 'chambre n → chambre n + 5' },
    double: { face: '×2', rule: 'chambre n → chambre 2n' },
    zigzag: { face: 'Zigzag', rule: 'parcourir les places en allers-retours' },
    admit: { face: '+1', rule: 'installer le nouveau passager dans la chambre 1' },
    shuffle: { face: '↻', rule: 'une nouvelle liste : chaque chambre reçoit de nouveaux lancers' },
  },
  pick: 'Choisissez une carte. Tous les clients bougent en même temps.',
  everyone: (face) => `Tout le monde ${face}`,

  // Drawn on the picture.
  full: 'COMPLET',
  vacant: 'LIBRE',
  guest: 'Nouveau client',
  coach: 'Car sans fin',
  queue: 'Passagers 1, 2, 3, …',
  hotelRow: 'Hôtel',
  coachRow: (n) => `Car ${n}`,
  seat: 'Places 1, 2, 3, …',
  rooms: 'Chambres 1, 2, 3, …',
  room: (n) => `Chambre ${n}`,
  heads: 'F',
  tails: 'P',
  flips: 'Lancers 1, 2, 3, …',
  passenger: 'Nouveau passager',
  question: '« Et ma chambre ? »',

  listHint:
    'Touchez n’importe quelle pièce de l’image pour la retourner. La diagonale change aussi, et son passager reste toujours sans chambre.',
  status: {
    waiting: [
      'Un nouveau client frappe. Toutes les chambres sont prises.',
      'Un car sans fin arrive.',
      'Une infinité de cars arrivent.',
    ],
    one: [
      'La chambre 1 s’est libérée. Toujours complet.',
      'Le passager 1 est installé. Les passagers 2, 3, 4, … attendent.',
    ],
    five: [
      'Le client est installé, et les chambres 2 à 5 restent vides.',
      'Les passagers 1 à 5 sont installés. 6, 7, 8, … attendent.',
    ],
    double: [
      'Le client est installé, et les chambres impaires restent vides.',
      'Le passager n occupe la chambre 2n − 1. Toujours complet.',
      'Le car 1 est installé. Les cars 2, 3, 4, … attendent.',
    ],
    zigzag: 'Chaque place de chaque car a sa chambre.',
    tracing: (room, row, seat) =>
      row === 0 ? `Chambre ${room} : le client de la chambre ${seat}` : `Chambre ${room} : car ${row}, place ${seat}`,
    building: (k) => `Lancer ${k} : l’inverse du lancer ${k} de la chambre ${k}`,
    built: 'Aucune chambre n’est la sienne : il diffère de la chambre k au lancer k.',
    admitted: 'Installé dans la chambre 1, et pourtant la nouvelle diagonale laisse quelqu’un dehors.',
    edited: 'Une nouvelle diagonale, et toujours quelqu’un dehors.',
    shuffled: 'Une nouvelle liste, et toujours quelqu’un dehors.',
  },

  guests: [
    {
      name: 'David Hilbert',
      note: 'Lors d’une conférence en 1924, j’ai raconté l’histoire d’un hôtel aux chambres infiniment nombreuses, toutes occupées, qui peut pourtant accueillir un nouveau venu. Un infini achevé ne se comporte comme rien de fini.',
    },
    {
      name: 'Georg Cantor',
      note: 'En 1891, j’ai montré qu’on ne peut pas dresser la liste de toutes les suites infinies de deux symboles : changez le premier symbole de la première suite, le deuxième de la deuxième, et ainsi de suite, et vous en obtenez une que la liste a oubliée.',
    },
    {
      name: 'George Gamow',
      note: 'Dans mon livre de 1947, « One Two Three… Infinity », j’ai raconté l’hôtel de Hilbert pour tout le monde. C’est ainsi que la plupart des gens en ont entendu parler pour la première fois.',
    },
  ],

  insight: {
    title: 'Comment un hôtel complet peut-il accueillir d’autres clients ?',
    html: `<p>« Une infinité » n’est pas un nombre jusqu’auquel on peut compter : l’hôtel ne peut donc pas comparer des tailles en comptant. Ce qu’il peut faire, c’est associer les choses une à une. Deux collections ont la <em>même taille</em> quand on peut les associer exactement, un élément avec un élément, sans personne en trop. Les clients et les chambres sont associés ainsi : chaque chambre est prise.</p>
<div class="insight-visual">+1 : chambre n → chambre n + 1 · ×2 : chambre n → chambre 2n · jamais deux clients dans la même chambre</div>
<h3>De la place pour un car</h3>
<p>« Tout le monde +1 » est une nouvelle correspondance : les anciens clients avec les chambres 2, 3, 4, …, ce qui laisse la chambre 1 au nouveau venu. « Tout le monde ×2 » envoie les anciens clients dans les chambres paires et libère toutes les chambres impaires : un car sans fin y entre donc tout entier, le passager n prenant la chambre 2n − 1. Les nombres pairs sont aussi nombreux que tous les nombres entiers. Une partie aussi grande que le tout, c’est exactement ce qui rend une collection infinie. Ici, on ne calcule aucune somme comme « infini plus un » : chaque étape est une correspondance.</p>
<h3>Une infinité de cars</h3>
<p>Écrivez les cars en lignes et leurs places en colonnes. Un zigzag le long des petites diagonales, en allers-retours depuis le coin, atteint chaque place de chaque car au bout d’un nombre fini d’étapes : chacune reçoit donc sa propre chambre (c’est le couplage de Cantor). Le même zigzag dresse la liste de toutes les fractions. Toute collection dont on peut dresser la liste de cette façon est dite <em>dénombrable</em>.</p>
<h3>Le car qui ne trouve pas de place</h3>
<p>Chaque passager du dernier car a pour nom une suite infinie de pile ou face. Essayez de leur donner des chambres : la chambre 1 reçoit une suite, la chambre 2 une autre, et ainsi de suite. Construisez maintenant un passager dont le premier lancer est l’inverse du premier lancer de la chambre 1, le deuxième l’inverse du deuxième de la chambre 2, et ainsi de suite le long de la diagonale. Ce passager diffère du client de la chambre k au lancer k, pour tout k : il n’a donc pas de chambre. Cela marche pour toute liste, aussi astucieuse soit-elle. Il y a donc plus de suites infinies de pile ou face que de chambres : un infini plus grand. C’est l’argument de la diagonale de Cantor, de 1891. Lisez face comme 1 et pile comme 0, et chaque suite devient un nombre entre 0 et 1 écrit en binaire ; le même argument (avec un peu de soin, puisque 0,0111… et 0,1000… sont le même nombre) montre qu’on ne peut pas non plus dresser la liste des nombres réels.</p>
<h3>Ce que l’image laisse de côté</h3>
<p>Elle montre quelques dizaines de portes et un coin de 8 × 8 de la liste, mais l’argument porte sur toutes les chambres et tous les lancers à la fois : le lancer 100 du nouveau passager est l’inverse du lancer 100 de la chambre 100, bien loin hors de l’image. Aucun vrai hôtel ne pourrait déplacer une infinité de clients en une seule étape ; les mathématiques le peuvent, car une règle comme « chambre n → chambre 2n » dit d’un coup où va chacun.</p>
<h3>D’où vient l’histoire</h3>
<p>David Hilbert a raconté l’histoire de l’hôtel lors d’une conférence en janvier 1924 ; ses notes sont restées inédites pendant des décennies. Le livre de George Gamow <em>One Two Three… Infinity</em> (1947) l’a rendue célèbre, comme le retrace Helge Kragh. L’argument de la diagonale de Georg Cantor a paru en 1891, mais ce n’était pas sa première preuve qu’on ne peut pas dresser la liste des nombres réels : celle-là, de 1874, reposait sur un autre argument.</p>
<div class="sources"><a class="source-link" href="https://arxiv.org/abs/1403.0059" target="_blank" rel="noopener">Kragh (2014), The true (?) story of Hilbert’s infinite hotel (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Hilbert%27s_paradox_of_the_Grand_Hotel" target="_blank" rel="noopener">Le paradoxe du Grand Hôtel de Hilbert (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument" target="_blank" rel="noopener">L’argument de la diagonale de Cantor (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Pairing_function" target="_blank" rel="noopener">Les fonctions de couplage (Wikipédia, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/" target="_blank" rel="noopener">Georg Cantor (MacTutor, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/One_Two_Three..._Infinity" target="_blank" rel="noopener">Gamow, One Two Three… Infinity (1947, en anglais)</a></div>`,
  },
});
