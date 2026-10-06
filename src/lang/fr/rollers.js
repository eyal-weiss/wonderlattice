/* Des rouleaux pas ronds · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('rollers', 'fr', {
  eyebrow: 'LARGEUR CONSTANTE',
  name: 'Des rouleaux pas ronds',
  tagline:
    'Une planche glisse parfaitement à l’horizontale sur des rouleaux en forme de triangles arrondis, et l’un d’eux peut percer un trou presque carré.',
  title: 'Des rouleaux pas ronds.',
  subtitle:
    'Une planche posée sur des rouleaux en forme de triangles arrondis glisse parfaitement à l’horizontale, comme sur des rondins. En dessous, les mêmes formes en roues sur des essieux : le chariot oscille.',
  field: 'Géométrie · Courbes de largeur constante · Le triangle de Reuleaux',
  sceneLabels: ['Rouleaux et roues', 'Un foret dans un carré', 'Un tour chacune'],
  tip: 'Faites glisser sur le côté pour rouler · Clavier : ← → font rouler, ↑ ↓ changent la forme · Entrée : une nouvelle forme biscornue',
  actionLabel: 'Nouvelle forme biscornue',
  canvasLabel:
    'En haut, une planche portant une caisse roule sur trois rouleaux qui ne sont pas ronds, et un stylo posé sur la caisse trace une ligne parfaitement droite. En bas, un chariot sur des roues de la même forme, fixées à des essieux, monte et descend, et son stylo trace une vague. Dans la vue du foret, un triangle courbe tourne dans un carré et le peint presque entièrement. Dans la course, quatre formes de même largeur font chacune un tour et arrivent ensemble.',
  panelEyebrow: 'Choisissez une forme',
  whyLabel: 'Pourquoi la planche reste-t-elle horizontale ?',
  nudge:
    'Appuyez sur « Nouvelle forme biscornue » : toute forme qui a la même largeur dans tous les sens porte la planche à l’horizontale. Puis essayez « Percer un trou carré ».',
  connection: {
    html: '<strong>Des trajets en douceur.</strong> Ici, des rouleaux pas ronds portent une planche bien horizontale. Dans « Roues carrées, trajet en douceur », des roues carrées roulent sans cahot sur une route de bosses.',
    label: 'Roues carrées, trajet en douceur',
  },

  presets: [
    { name: 'Rouleaux triangulaires', note: 'Trois sous une planche, et la même forme en roues.' },
    { name: 'Percer un trou carré', note: 'Un triangle qui tourne remplit presque tout un carré.' },
    { name: 'Un tour chacune', note: 'Même largeur, même pourtour : elles roulent toutes aussi loin.' },
  ],

  view: 'À essayer',
  views: ['Rouleaux', 'Foret', 'Un tour'],
  shape: 'Forme',
  shapes: ['Cercle', 'Triangle', 'Pentagone', 'Biscornue'],
  lines: 'Droites de construction',
  linesHint: 'Chaque morceau de son pourtour est un arc centré là où deux des droites se croisent.',
  corners: 'Coins arrondis',
  cornersHint:
    'Le rayon de la courbe la plus serrée, en part de la largeur. Arrondir tous les coins garde la même largeur.',

  // Le nom de la scène, pour chaque forme (pointue ou arrondie) et chaque vue.
  names: {
    rollers: (kind, rounded) =>
      kind === 0
        ? 'Rondins'
        : kind === 1
          ? rounded
            ? 'Triangles arrondis'
            : 'Triangles de Reuleaux'
          : kind === 2
            ? rounded
              ? 'Pentagones arrondis'
              : 'Pentagones de Reuleaux'
            : 'Une forme biscornue',
    drill: (kind, rounded) =>
      kind === 0
        ? 'Percer avec un cercle'
        : kind === 1
          ? rounded
            ? 'Percer avec un triangle arrondi'
            : 'Percer avec un triangle de Reuleaux'
          : kind === 2
            ? rounded
              ? 'Percer avec un pentagone arrondi'
              : 'Percer avec un pentagone de Reuleaux'
            : 'Percer avec une forme biscornue',
    race: 'Quatre formes, une seule largeur',
  },

  // Les nombres arrivent déjà écrits dans la langue de la page.
  percent: (x) => `${x} %`,
  readout: {
    level: 'La planche reste parfaitement horizontale.',
    drill: 'Un trou presque carré.',
    drillRound: 'Un trou rond.',
    drillOther: 'Un trou aux coins arrondis.',
    race: 'Elles arrivent toutes ensemble.',
    plank: 'La planche sur rouleaux',
    plankValue: 'ne monte ni ne descend jamais',
    cart: 'Le chariot sur essieux oscille de',
    cartValue: (share) => `${share} de la largeur`,
    rim: 'Son pourtour mesure',
    rimValue: (times) => `${times} × sa largeur`,
    area: 'Son aire vaut',
    areaValue: (share) => `${share} de celle d’un cercle`,
    drilled: 'Déjà percé',
    drilledValue: (share) => `${share} du carré`,
    full: 'Après un tour complet',
    fullValue: (share) => `${share} du carré`,
    rims: 'Chaque pourtour mesure',
    rimsValue: 'π × la largeur',
    least: 'La plus petite aire',
    leastValue: (share) => `le triangle : ${share} de celle d’un cercle`,
    widthRule: 'Dans quelque sens qu’on la tourne, elle garde exactement la même largeur.',
    drillRule:
      'En tournant, elle touche les quatre côtés, car elle est aussi large que le carré dans toutes les directions.',
    raceRule:
      'En faisant un tour complet, une forme parcourt la longueur de son pourtour : π fois sa largeur, quelle que soit sa forme.',
  },
  status: {
    rollers: 'Planche horizontale sur rouleaux',
    drill: (share) => `Percé à ${share}`,
    race: 'Même largeur, même pourtour',
  },

  // Les mots dessinés sur l’image.
  labels: {
    rollers: 'En rouleaux : la planche reste horizontale',
    axles: (share) => `En roues : le chariot oscille de ${share} de la largeur`,
    axlesRound: 'En roues : un cercle roule aussi sans cahot',
    close: 'De près : même largeur partout',
    width: 'largeur',
    lines: 'Ses droites de construction',
    corner: (n) => `Un coin, grossi ×${n}`,
    path: 'Trajet de son centre',
    finish: 'Un tour : π × la largeur',
    rim: 'Pourtour déroulé',
  },

  announce: {
    rollers: (name, share) =>
      `${name} : la planche reste horizontale sur rouleaux ; sur essieux, le chariot oscille de ${share} de la largeur.`,
    round: (name) => `${name} : tout reste horizontal, en rouleaux comme sur essieux.`,
    drill: (name, share) => `${name} : après un tour complet, ${share} du carré est percé.`,
    race: 'Quatre formes de même largeur font chacune un tour, et elles arrivent toutes ensemble.',
  },

  guests: [
    {
      name: 'Franz Reuleaux',
      note: 'J’ai décrit les machines comme des chaînes de pièces mobiles simples, et j’ai fait construire des centaines de modèles de mécanismes pour l’enseignement. Le triangle courbe de cette salle porte mon nom, même si d’autres l’avaient dessiné bien avant moi.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Dans un mémoire présenté en 1771, j’ai étudié les triangles courbes et les formes qui ont la même largeur dans toutes les directions. Je les ai appelées orbiformes.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'En 1860, j’ai montré que toute forme de largeur constante a un pourtour qui mesure exactement π fois sa largeur, quelle que soit sa forme.',
    },
  ],

  insight: {
    title: 'Pourquoi la planche reste-t-elle horizontale ?',
    html: `<p>Le sol est sous chaque rouleau et la planche repose dessus : la hauteur de la planche est donc la distance entre deux droites parallèles qui touchent toutes deux le rouleau, c’est-à-dire sa largeur, mesurée à la verticale. Un cercle a la même largeur dans toutes les directions. Toutes les formes de cette salle aussi : mesurez-les d’un bord à l’autre dans n’importe quelle direction, vous trouverez la même valeur. Quand la forme tourne, sa largeur à la verticale ne change jamais, et la hauteur de la planche non plus.</p>
<div class="insight-visual">hauteur de la planche = largeur du rouleau à la verticale = la même dans toutes les directions</div>
<h3>Des rouleaux, pas des roues</h3>
<p>Le centre d’un triangle de Reuleaux est plus près de ses côtés que de ses coins : quand il roule, son centre monte et descend. Pour un rouleau, peu importe, puisque rien n’est fixé à son centre. Une roue, elle, tourne autour d’un essieu qui passe par son centre : un chariot sur des triangles de Reuleaux oscille donc, trois fois par tour, de 15 % de la largeur. Sous la planche, les rouleaux ne gardent pas non plus exactement le même rythme : chacun avance un peu plus vite ou un peu plus lentement en tournant, mais en moyenne, comme des rondins, à la moitié de la vitesse de la planche.</p>
<h3>Comment en tracer une</h3>
<p>Tracez un triangle équilatéral, piquez la pointe d’un compas sur chaque coin tour à tour, et tracez l’arc entre les deux autres : voilà un triangle de Reuleaux. Tout polygone régulier qui a un nombre impair de côtés fonctionne de la même façon. Les formes biscornues utilisent la méthode des droites croisées : tracez quelques droites qui se croisent toutes, et reliez chaque droite à la suivante, en tournant, par un arc centré là où elles se croisent. Après deux tours, la courbe se referme, aussi large dans toutes les directions. Arrondir les coins, de la même quantité tout autour, garde la même largeur.</p>
<h3>Un tour, la même distance</h3>
<p>Chaque forme ici a un pourtour qui mesure exactement π fois sa largeur, autant que celui d’un cercle de même largeur. C’est le théorème de Barbier, de 1860. Après un tour complet, chacune a donc parcouru la même distance. Leurs aires diffèrent : de toutes les formes de même largeur, le cercle a la plus grande, et le triangle de Reuleaux la plus petite, selon le théorème de Blaschke–Lebesgue (Henri Lebesgue en 1914, Wilhelm Blaschke en 1915).</p>
<h3>Un trou carré</h3>
<p>Toute forme de largeur constante peut tourner dans un carré aussi large qu’elle, en touchant sans cesse ses quatre côtés. Le triangle de Reuleaux, qui a les coins les plus pointus possibles pour une telle forme (120°), balaie tout sauf l’extrême pointe des coins : 2√3 + π/6 − 3 du carré, environ 98,8 %. Des forets à trous carrés fondés sur cette idée ont été brevetés en 1914 et se fabriquent encore, même si des forets semblables avaient servi plus tôt. Le centre du foret se déplace en tournant : il lui faut donc un mandrin spécial qui le lui permet, et un guide percé d’un trou carré. Les coins plus émoussés du pentagone laissent davantage de matière, et un cercle perce un trou rond, π/4 du carré.</p>
<h3>Ce que cette salle laisse de côté</h3>
<p>Ici, les rouleaux sont parfaits, le sol et la planche parfaitement plats, et rien ne glisse. De vrais rouleaux doivent tous avoir exactement la même largeur, et quelqu’un doit porter chacun d’eux de l’arrière vers l’avant, comme ici quand un rouleau s’efface puis revient. Un vrai foret a aussi besoin d’arêtes tranchantes : c’est un triangle de Reuleaux creusé de rainures. Il existe aussi des solides de largeur constante, comme les solides de Meissner, mais la salle reste dans le plan ; le solide construit comme un triangle de Reuleaux à partir de quatre boules, le tétraèdre de Reuleaux, n’a pas tout à fait la même largeur dans toutes les directions.</p>
<p>On dit souvent que les plaques d’égout sont rondes pour ne pas pouvoir tomber dans leur trou. Une plaque qui aurait l’une des formes de cette salle n’y tomberait pas non plus ; les plaques rondes sont aussi bien plus faciles à fabriquer, et n’ont pas besoin d’être tournées pour s’ajuster. Certaines pièces de monnaie sont des formes de largeur constante, comme les pièces britanniques de 20p et de 50p, des heptagones de Reuleaux, pour que les machines puissent les mesurer d’un bord à l’autre quel que soit le sens où elles sont posées.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Décrivez une forme par sa fonction d’appui h(θ) : la distance entre un centre et sa tangente tournée vers la direction θ. Sa largeur dans la direction θ vaut h(θ) + h(θ + π), donc une largeur constante w signifie h(θ) + h(θ + π) = w pour tout θ. En roulant sur le sol sans glisser, la forme tourne autour de son point de contact. Quand elle tourne de dψ, la planche, à w au-dessus de ce point, avance de w dψ, et le centre, à h au-dessus, avance de h dψ. Sur un tour complet, le centre avance de ∫h dθ = πw, moitié moins que la planche, car les valeurs opposées de h ont pour somme w. La longueur du pourtour vaut ∫(h + h″) dθ = ∫h dθ, le même πw : c’est le théorème de Barbier.</p><p>Les formes de la salle sont construites à partir d’arcs par la méthode des droites croisées, et chacune tourne autour du centre du plus petit cercle qui la contient, qui, pour une forme de largeur constante, est aussi le centre du plus grand cercle qu’elle contient ; ces deux rayons ont pour somme la largeur. Dans le carré qui va de −½ à ½, la forme tournée de φ a son centre en (½ − h(−φ), ½ − h(π/2 − φ)), si bien que ses tangentes tournées vers la droite et vers le haut sont sur ces côtés-là, et, par la largeur constante, celles de gauche et du bas aussi. Pour le triangle de Reuleaux, ce centre parcourt quatre arcs d’ellipses.</p><p>Les tests de la salle vérifient, à l’aide d’un programme distinct qui construit chaque polygone de Reuleaux à partir de disques qui se recouvrent : la largeur dans toutes les directions, la longueur π du pourtour, l’aire du triangle, (π − √3)/2 ≈ 0,7048, et celle du pentagone, l’oscillation sur essieu, 2/√3 − 1 ≈ 15,5 % pour le triangle et 5,1 % pour le pentagone, et la part du carré percée : 98,8 % par le triangle, 87,9 % par le pentagone, et π/4 par le cercle.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_triangle" target="_blank" rel="noopener">Triangle de Reuleaux (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Curve_of_constant_width" target="_blank" rel="noopener">Courbe de largeur constante (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_polygon" target="_blank" rel="noopener">Polygone de Reuleaux (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barbier%27s_theorem" target="_blank" rel="noopener">Théorème de Barbier (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Blaschke%E2%80%93Lebesgue_theorem" target="_blank" rel="noopener">Théorème de Blaschke–Lebesgue (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Watts_Brothers_Tool_Works" target="_blank" rel="noopener">Watts Brothers Tool Works (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Manhole_cover" target="_blank" rel="noopener">Plaque d’égout (Wikipédia, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Barbier/" target="_blank" rel="noopener">Joseph-Émile Barbier (MacTutor, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Franz_Reuleaux" target="_blank" rel="noopener">Franz Reuleaux (Wikipédia, en anglais)</a></div>`,
  },
});
