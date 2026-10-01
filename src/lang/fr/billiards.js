/* La table qui oublie · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('billiards', 'fr', {
  eyebrow: 'CHAOS · GÉOMÉTRIE',
  name: 'La table qui oublie',
  tagline:
    'Le même coup, joué deux fois, sur deux tables de billard. L’une s’en souvient ; l’autre l’oublie en quelques secondes.',
  title: 'La table qui oublie.',
  subtitle:
    'Sur chaque table, une bille et sa jumelle partent ensemble, à un millième de degré d’écart. Regardez quelle table les garde ensemble.',
  field: 'Billards dynamiques · Chaos · Coniques',
  sceneLabel: 'Deux tables · Deux coups par table · Aucun hasard',
  sceneName: 'Une ellipse et un stade',
  tip: 'Faites glisser sur une table pour viser, et relâchez pour tirer · ← → tournent le coup · ↑ ↓ le déplacent · Entrée joue un nouveau coup',
  actionLabel: 'Nouveau coup',
  canvasLabel:
    'Deux tables de billard, une ellipse et un stade. Sur chacune, une bille et sa jumelle, lancées à un millième de degré d’écart, laissent des traces lumineuses. Faites glisser sur une table pour viser un nouveau coup, ou utilisez les flèches du clavier.',
  panelEyebrow: 'Façonnez la table',
  whyLabel: 'Pourquoi une table oublie-t-elle ?',
  nudge:
    'Une fois les jumelles du stade séparées, réduisez ses côtés droits jusqu’à 0 % (un cercle), puis remontez à 5 % seulement. Combien de ligne droite faut-il pour oublier ?',
  connection: {
    html: '<strong>La même leçon, sans équations.</strong> Dans « Les jumeaux de la météo », trois équations écartent des départs presque identiques. Ici, la forme d’une table y suffit à elle seule.',
    label: 'Voir deux météos jumelles se séparer',
  },

  presets: [
    {
      name: 'Coups jumeaux',
      note: 'Le même coup sur les deux tables, chaque bille avec une jumelle décalée de 0,001°.',
    },
    { name: 'Tirer depuis un foyer', note: 'Une poche sur un foyer. Tout coup parti de l’autre foyer y rentre.' },
    {
      name: 'Un soupçon de ligne droite',
      note: 'Des côtés droits de 5 % de la hauteur seulement. Est-ce assez ?',
    },
  ],

  flat: 'Les côtés droits du stade',
  flatHint: 'En part de la hauteur de la table. À 0 %, le stade est un cercle.',
  speed: 'Vitesse',
  pocket: 'Une poche sur un foyer',
  exposure: 'Pose longue',
  caustic: 'Montrer la courbe que le coup de l’ellipse ne traverse jamais',

  ellipse: 'Ellipse',
  stadium: 'Stade',
  // Le nombre de rebonds arrive tel quel, non formaté ; on l’écrit à la française (1 300).
  together: (n) => `Jumelles ensemble · ${n.toLocaleString('fr')} ${n < 2 ? 'rebond' : 'rebonds'}`,
  parted: (n) => `Jumelles séparées au ${n === 1 ? '1er' : `${n.toLocaleString('fr')}e`} rebond`,
  pocketIn: (n) =>
    n === 0 ? 'Rentrée sans rebond' : `Rentrée après ${n.toLocaleString('fr')} ${n < 2 ? 'rebond' : 'rebonds'}`,
  pocketRolling: (n) => `Roule encore · ${n.toLocaleString('fr')} ${n < 2 ? 'rebond' : 'rebonds'} jusqu’ici`,
  legendBall: 'une bille',
  legendTwin: 'sa jumelle, décalée de 0,001°',
  legendPocket: 'les coups partent du point blanc',
  chartLabel: 'L’écart entre les jumelles, sur des tables de 2 mètres (chaque ligne, dix fois plus loin)',
  partedLine: 'séparées',
  seconds: (n) => `${n} s`,
  pocketChart: 'Rebonds de chaque coup avant d’entrer, le plus récent à droite',
  statusTogether: (n) => `Rebond ${n.toLocaleString('fr')} · les deux paires ensemble`,
  statusParted: (n) =>
    `Les jumelles du stade se sont séparées au ${n === 1 ? '1er' : `${n.toLocaleString('fr')}e`} rebond`,
  statusBoth: 'Les deux paires de jumelles se sont séparées',
  statusPocket: (e, s) => `Coups rentrés : ellipse ${e}, stade ${s}`,
  announceParted: (n) =>
    `Les jumelles du stade se sont séparées, après ${n.toLocaleString('fr')} ${n < 2 ? 'rebond' : 'rebonds'}. Celles de l’ellipse sont toujours ensemble.`,

  readout: {
    apart: 'Si les tables mesuraient 2 mètres de long, les jumelles seraient maintenant écartées de :',
    // La salle écrit « : » juste après ces trois libellés ; l’espace insécable finale le précède.
    ellipse: 'Sur l’ellipse ',
    stadium: 'Sur le stade ',
    curve: 'Le coup de l’ellipse ne traverse jamais ',
    curves: {
      ellipse: 'une ellipse plus petite',
      hyperbola: 'une hyperbole',
      foci: 'aucune courbe : il passe par les foyers',
    },
    pocket: 'Rebonds de chaque coup avant d’entrer :',
    none: 'aucun rentré pour l’instant',
  },
  length: {
    tiny: 'moins de 0,01 mm',
    mm: (x) => `${x} mm`,
    cm: (x) => `${x} cm`,
    m: (x) => `${x} m`,
  },
  list: (items) => items.join(', '),

  guests: [
    {
      name: 'George David Birkhoff',
      note: 'Il a fait d’une bille sur une table un modèle du mouvement en général, et a pressenti que, parmi les tables lisses et arrondies, seules les ellipses gardent un tel ordre.',
    },
    {
      name: 'Jean-Victor Poncelet',
      note: 'Prisonnier de guerre en Russie en 1813, il s’est remémoré la géométrie qu’il avait apprise et l’a poussée plus loin. Plus tard, il a montré que si un zigzag entre deux coniques se referme, tous se referment.',
    },
  ],

  insight: {
    title: 'Pourquoi une table oublie-t-elle ?',
    html: `<p>Rien n’est aléatoire, sur aucune des deux tables. Chaque bille roule en ligne droite et quitte la bande sous l’angle avec lequel elle est arrivée, et chaque jumelle part du même point, visée un millième de degré à côté. Sur l’ellipse, les jumelles restent ensemble pendant des centaines de rebonds. Sur le stade, en une douzaine de rebonds environ, elles sont déjà loin l’une de l’autre. La forme de la bande fait à elle seule toute la différence.</p>
<div class="insight-visual">ellipse : l’écart grandit un peu à chaque rebond · stade : il est multiplié par environ 2,5 à chaque rebond</div>
<h3>Le secret de l’ellipse : ses deux foyers</h3>
<p>Une ellipse est l’ensemble des points dont les distances à deux points fixes, ses foyers, ont toujours la même somme. Il s’ensuit qu’en chaque point, la bande fait des angles égaux avec les droites qui la relient aux deux foyers : une bille qui passe par un foyer repart donc toujours, après le rebond, par l’autre. Essayez « Tirer depuis un foyer » : chaque coup parti d’un foyer tombe dans une poche placée sur l’autre. L’écrivain Alex Bellos a fait construire sur cette idée un billard elliptique, appelé Loop.</p>
<h3>La courbe qu’il ne traverse jamais</h3>
<p>Laissez un coup rouler sur l’ellipse : sa trajectoire peint un anneau lumineux autour d’un ovale vide ou, si elle traverse le segment qui joint les foyers, autour de deux lentilles vides. Chaque tronçon droit de la trajectoire touche la même courbe cachée, sa caustique : une ellipse plus petite, ou une hyperbole, avec les mêmes foyers que la table. Un seul nombre, fixé par le premier coup, décide laquelle, si bien que l’ellipse n’oublie jamais comment on a joué. Des jumelles visées un peu différemment touchent des caustiques un peu différentes, et ne s’écartent donc que lentement. George David Birkhoff a montré que la table elliptique est ordonnée de cette façon, ce que les mathématiciens appellent « intégrable ». Le théorème de fermeture de Poncelet apparaît ici aussi : si un coup qui touche une caustique revient à son point de départ après un certain nombre de rebonds, tous les coups qui touchent cette caustique en font autant.</p>
<h3>D’où vient le chaos du stade</h3>
<p>Le stade, ce sont deux demi-cercles reliés par des côtés droits. Une extrémité courbe resserre un mince faisceau de trajectoires voisines, comme un miroir, mais le faisceau dépasse son point de convergence et s’élargit de nouveau le long de la ligne droite, plus large qu’avant. Rebond après rebond, l’élargissement l’emporte. Ici, l’écart entre les jumelles est multiplié en moyenne par environ deux et demi à chaque rebond : c’est une croissance exponentielle. Dans les années 1970, Leonid Bunimovich a démontré que le stade est ergodique : presque toute trajectoire finit par visiter chaque partie de la table, et passe dans chacune un temps proportionnel à son aire. Voilà pourquoi la pose longue grise le stade de façon uniforme. N’importe quel côté droit suffit, aussi court soit-il, même si plus il est court, plus les jumelles mettent de temps à se séparer. Sans côtés droits, le stade est un cercle, aussi ordonné que l’ellipse.</p>
<p>C’est la sensibilité aux conditions initiales, l’effet à l’œuvre dans « Les jumeaux de la météo », obtenue ici par la seule géométrie, sans aucune équation du mouvement.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Ce sont des billes idéales : des points sans taille, sans effet ni frottement, sur une bande à la forme parfaite. Le stade a des coups exceptionnels qui ne divergent jamais, comme celui qui rebondit tout droit de haut en bas entre les deux côtés droits. Ils sont infiniment rares, mais une trajectoire qui passe près de l’un d’eux peut s’y attarder longtemps. Et l’ordinateur arrondit chaque nombre à environ 16 chiffres. Sur l’ellipse, cela ne compte guère. Sur le stade, les erreurs d’arrondi grandissent comme toute autre petite différence, si bien qu’après quelques dizaines de rebonds, la bille à l’écran n’est plus là où l’arithmétique exacte la placerait : l’image montre comment se comportent les trajectoires du stade, pas où se trouverait exactement ce coup-là. Même les jumelles de l’ellipse finissent par se séparer, car leur écart grandit bel et bien, régulièrement plutôt qu’exponentiellement : depuis le coup de départ, il faut environ 1 300 rebonds.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>L’ellipse est x²/a² + y²/b² = 1, de foyers (±c, 0), où c² = a² − b² ; ici a = 2 et b = 1. Pour une bille en (x, y) qui se déplace dans la direction (u, v), ses moments cinétiques par rapport aux deux foyers sont L₁ = (x + c)v − yu et L₂ = (x − c)v − yu, et leur produit k = L₁L₂ reste le même après chaque rebond. Quand k &gt; 0, la caustique est l’ellipse x²/(c² + k) + y²/k = 1 ; quand k &lt; 0, c’est l’hyperbole x²/(c² + k) − y²/(−k) = 1 ; et k = 0 signifie que la trajectoire passe par les foyers. Dans ce stade (des côtés droits aussi longs que la table est haute), des trajectoires voisines s’écartent en moyenne comme e<sup>λn</sup> après n rebonds, avec λ ≈ 0,9 : c’est son exposant de Lyapunov. La salle calcule chaque rebond exactement, en cherchant où la trajectoire droite rencontre l’ellipse, ou les côtés et les demi-cercles du stade, et une jumelle compte comme séparée dès qu’elle est à plus d’un vingtième de la hauteur de la table de sa partenaire.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dynamical_billiards" target="_blank" rel="noopener">Le billard dynamique (en anglais)</a><a class="source-link" href="http://www.scholarpedia.org/article/Dynamical_billiards" target="_blank" rel="noopener">L. A. Bunimovich, « Dynamical billiards », Scholarpedia 2(8):1813 (2007) (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stadium_(geometry)" target="_blank" rel="noopener">Le stade, en géométrie (en anglais)</a><a class="source-link" href="https://projecteuclid.org/journals/communications-in-mathematical-physics/volume-65/issue-3/On-the-ergodic-properties-of-nowhere-dispersing-billiards/cmp/1103904878.full" target="_blank" rel="noopener">L. A. Bunimovich, « On the ergodic properties of nowhere dispersing billiards », Communications in Mathematical Physics 65 (1979) (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Poncelet%27s_closure_theorem" target="_blank" rel="noopener">Le théorème de fermeture de Poncelet (en anglais)</a><a class="source-link" href="https://www.loop-the-game.com/scoop" target="_blank" rel="noopener">Loop, le billard elliptique d’Alex Bellos (en anglais)</a></div>`,
  },
});
