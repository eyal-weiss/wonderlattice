/* Six poignées de main · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('handshakes', 'fr', {
  eyebrow: 'PETITS MONDES',
  name: 'Six poignées de main',
  tagline:
    'Deux cents amis en cercle sont séparés par 25 poignées de main. Cinq amitiés nouées au hasard réduisent presque cet écart de moitié.',
  title: 'Six poignées de main.',
  subtitle:
    'Deux cents personnes en cercle, chacune amie avec ses quatre plus proches voisins. Regardez quelques amitiés nouées au hasard rétrécir le monde entier, puis ajoutez-en d’autres.',
  field: 'Réseaux · Théorie des graphes · Sciences sociales',
  sceneLabel: 'Un cercle · quelques inconnus',
  sceneName: 'Un cercle de 200 amis',
  tip: 'Touchez quelqu’un pour compter les poignées de main qui vous en séparent · Clavier : ← → choisissent quelqu’un, + ajoute un raccourci',
  actionLabel: 'Ajouter un raccourci',
  canvasLabel:
    'Deux cents personnes sur un cercle, chacune reliée à ses plus proches voisins, avec quelques longs liens qui le traversent. Au centre, le nombre moyen de poignées de main entre deux personnes.',
  panelEyebrow: 'Les amis de vos amis',
  whyLabel: 'Pourquoi quelques raccourcis rétrécissent-ils le monde ?',
  nudge: 'Repartez d’un simple cercle, puis ajoutez les raccourcis un par un. Lequel change le plus les choses ?',
  connection: {
    html: '<strong>Les petits mondes gardent la cadence.</strong> Watts et Strogatz ont remarqué que des horloges reliées comme un petit monde se synchronisent plus facilement. Regardez-en toute une prairie dans « Des lucioles qui se synchronisent ».',
    label: 'Voir les lucioles',
  },

  presets: [
    { name: 'Rien que des voisins', note: 'Un simple cercle.', badge: '0' },
    { name: 'Cinq rencontres', note: 'Cinq amitiés nouées au hasard.', badge: '5' },
    { name: 'Une rumeur', note: 'Une nouvelle part de vous.', badge: '20' },
  ],

  shortcuts: 'Raccourcis à travers le cercle',
  rumour: 'Lancer une rumeur depuis vous',

  // The status line above the picture. `steps`, `heard`, `round` and `rounds` are whole numbers.
  // French uses the singular for 0 and 1.
  status: {
    path: (steps) => `De vous à cette personne : ${steps} ${steps < 2 ? 'poignée de main' : 'poignées de main'}`,
    spreading: (heard, round) => `Tour ${round} : ${heard} sur 200 ${heard < 2 ? 'est au courant' : 'sont au courant'}`,
    everyone: (rounds) => `Tout le monde est au courant après ${rounds} ${rounds < 2 ? 'tour' : 'tours'}`,
  },
  // Said once the number of shortcuts settles. `count` is a whole number, `distance` a formatted number.
  announce: (count, distance) =>
    `${count === 0 ? 'Sans raccourci' : count === 1 ? 'Avec 1 raccourci' : `Avec ${count} raccourcis`}, deux personnes sont en moyenne à ${distance} poignées de main l’une de l’autre.`,

  // Words drawn on the canvas.
  labels: {
    apart: 'poignées de main d’écart',
    onAverage: 'en moyenne',
    knit: 'Amis qui se connaissent',
    you: 'Vous',
    steps: (steps) => `${steps} ${steps < 2 ? 'poignée de main' : 'poignées de main'}`,
    chart: 'Au fil des raccourcis',
    far: 'Éloignement',
    close: 'Cohésion',
    scale: '100 % = le cercle seul',
    axis: (count) => `${count} raccourcis`,
  },

  guests: [
    {
      name: 'Frigyes Karinthy',
      note: 'Dans sa nouvelle « Chaînes », en 1929, un personnage parie qu’on peut atteindre n’importe qui sur Terre en passant par cinq connaissances au plus.',
    },
    {
      name: 'Stanley Milgram',
      note: 'Dans les années 1960, il a demandé à des gens de faire parvenir une lettre à un inconnu, en passant seulement par des personnes qu’ils connaissaient bien. La plupart des lettres ne sont jamais arrivées ; celles qui sont arrivées l’ont fait en six étapes environ.',
    },
  ],

  insight: {
    title: 'Pourquoi quelques raccourcis rétrécissent-ils le monde ?',
    html: `<p>Sur le cercle, une nouvelle ne peut que ramper de voisin en voisin : atteindre le côté opposé demande 50 poignées de main, et deux personnes sont en moyenne à environ 25 poignées de main l’une de l’autre. Un raccourci est un pont à travers le cercle. Tous ceux qui sont près d’un de ses bouts se retrouvent soudain proches de tous ceux qui sont près de l’autre bout : une seule nouvelle amitié raccourcit donc des milliers de chaînes d’un coup.</p>
<div class="insight-visual">quelques longs liens → presque toutes les chaînes raccourcissent → un petit monde</div>
<h3>Soudé, et proche</h3>
<p>Pendant ce temps, presque rien ne change autour de vous. Sur le cercle, la moitié des paires que forment vos amis sont des amis entre eux, et une poignée de raccourcis n’y touche presque pas. Un monde peut être douillet et local, et pourtant petit. Duncan Watts et Steven Strogatz ont appelé cela un petit monde en 1998, et l’ont trouvé dans le réseau des acteurs de cinéma, dans un réseau électrique et dans les nerfs d’un minuscule ver.</p>
<h3>Six degrés ?</h3>
<p>Dans les expériences de lettres de Stanley Milgram, dans les années 1960, la plupart des lettres ne sont jamais arrivées : dans une étude, 64 sur 296 sont arrivées. Les chaînes arrivées comptaient environ six étapes, et les « six degrés de séparation » sont entrés dans le folklore. En 2016, Facebook a mesuré une moyenne de 4,57 étapes (3,57 personnes entre les deux) parmi ses 1,59 milliard d’utilisateurs : une plateforme, pas le monde entier.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Les vraies amitiés ne forment pas un cercle bien rangé, et les gens ont des nombres d’amis très différents. Ici, les raccourcis s’ajoutent par-dessus le cercle (une variante étudiée par Mark Newman et Duncan Watts) ; dans le modèle d’origine, certains liens existants sont déplacés à la place. Et une chaîne courte, on ne sait pas toujours la trouver : Jon Kleinberg a montré que des gens qui ne connaissent que leurs propres amis ne trouvent des chaînes courtes que si les longs liens suivent un schéma bien particulier.</p>
<details><summary>Les chiffres, si le cœur vous en dit</summary><p>Avec 200 personnes et 4 amis chacune (400 liens), la distance moyenne sur le cercle vaut exactement 5 050 / 199 ≈ 25,4, et son coefficient de clustering (la part des paires d’amis d’une personne qui sont amis entre eux) vaut 3(k − 2) / (4(k − 1)) = ½ pour k = 4. En moyenne sur 40 tirages au hasard, la distance moyenne est d’environ 13,9 avec 5 raccourcis, 10,2 avec 10, 7,5 avec 20 et 5,0 avec 60, tandis que ce coefficient vaut 0,49, 0,48, 0,46 et 0,40. Chaque tirage est différent : avec 5 raccourcis, la distance allait d’environ 12 à 17.</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/30918" target="_blank" rel="noopener">Watts &amp; Strogatz, <em>Nature</em> (1998, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Small-world_experiment" target="_blank" rel="noopener">L’expérience du petit monde (Wikipédia, en anglais)</a><a class="source-link" href="https://research.facebook.com/blog/2016/2/three-and-a-half-degrees-of-separation/" target="_blank" rel="noopener">Facebook Research (2016, en anglais)</a>J. Travers et S. Milgram, <em>Sociometry</em> 32 (1969) · J. Kleinberg, <em>Nature</em> 406 (2000)</div>`,
  },
});
