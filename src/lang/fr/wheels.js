/* Roues carrées, trajet en douceur · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('wheels', 'fr', {
  eyebrow: 'ROUTES ET ROUES',
  name: 'Roues carrées, trajet en douceur',
  tagline:
    'Un chariot aux roues carrées roule sans le moindre cahot sur la bonne route. Dessinez n’importe quelle roue : elle aura sa propre route.',
  title: 'Roues carrées, trajet en douceur.',
  subtitle:
    'Des roues carrées sur une route de bosses : le verre d’eau reste parfaitement immobile. En dessous, le même chariot sur une route plate. Changez les roues, ou dessinez les vôtres.',
  field: 'Géométrie · Routes et roues · La chaînette',
  sceneLabel: 'Les mêmes roues · deux routes',
  tip: 'Faites glisser les points de votre roue vers l’intérieur ou l’extérieur · Clavier : ← → changent le nombre de côtés, ou choisissent un point de votre roue, et ↑ ↓ le déplacent · Entrée : une autre roue',
  actionLabel: 'Une autre roue',
  canvasLabel:
    'Deux voies. En haut, un chariot aux roues carrées roule sur une route de bosses arrondies, et le verre d’eau posé dessus avance à une hauteur constante. En bas, le même chariot roule sur une route plate : il cahote de haut en bas, et son eau gicle. Sur une grande image, plus bas : des roues de 3 à 8 côtés, chacune roulant sur sa propre route, avec le coin du triangle qui mord dans la bosse suivante, marqué en rouge ; et une chaîne suspendue à côté de la même courbe retournée, une bosse de la route du carré. Une roue dessinée a douze points à faire glisser vers l’intérieur ou l’extérieur.',
  panelEyebrow: 'Choisissez une roue',
  whyLabel: 'Pourquoi le chariot roule-t-il sans cahot ?',
  nudge:
    'Montez jusqu’à 12 côtés : les bosses s’aplatissent vers une route plate, celle qu’il faut à une roue ronde. Puis redescendez jusqu’à 3, et regardez le coin du triangle mordre dans la bosse suivante.',
  connection: {
    html: '<strong>Des courbes nées d’une rotation.</strong> Ici, une roue qui tourne décide de la forme de sa route. Dans « Peindre avec le mouvement », deux bras qui tournent dessinent des fleurs.',
    label: 'Peindre avec le mouvement',
  },

  presets: [
    { name: 'Roues carrées', note: 'Chaque bosse est une chaîne suspendue, à l’envers.' },
    { name: 'Le triangle se cogne', note: 'Son coin mord dans la bosse suivante.' },
    { name: 'Une roue en forme de cœur', note: 'Dessinez la vôtre : chaque roue a sa route.' },
  ],
  // Le nom de la scène pour une roue régulière qui n’est pas l’un des préréglages, et pour une roue dessinée.
  sidesName: (n) =>
    n === 3
      ? 'Roues triangulaires'
      : n === 4
        ? 'Roues carrées'
        : n === 5
          ? 'Roues pentagonales'
          : n === 6
            ? 'Roues hexagonales'
            : n === 8
              ? 'Roues octogonales'
              : `Roues à ${n} côtés`,
  yourOwn: 'Votre propre roue',

  kind: 'Type de roue',
  regular: 'Roues régulières',
  drawn: 'Votre propre roue',
  sides: 'Nombre de côtés',
  sidesHint: 'Plus de côtés, des bosses plus petites. Le triangle ne peut pas rouler sur sa route.',
  startFrom: 'Partir de',
  shapes: { heart: 'Cœur', flower: 'Fleur', egg: 'Œuf', star: 'Étoile', circle: 'Cercle' },
  drawHint:
    'Faites glisser les points de la roue vers l’intérieur ou l’extérieur, et sa route change avec elle. Tirez le creux du cœur vers l’essieu, et voyez ce qui se passe.',

  // Les nombres arrivent déjà écrits dans la langue de la page.
  percent: (x) => `${x} %`,
  readout: {
    level: 'Sur sa propre route, l’essieu reste parfaitement à la même hauteur.',
    crash: 'Sur sa propre route, la roue se cognerait.',
    bumps: 'Chaque bosse de sa route est haute de',
    bumpsValue: (share) => `${share} du rayon`,
    bob: 'Sur une route plate, l’essieu monte et descend de',
    bobValue: (share) => `${share} du rayon`,
    bobDrawn: (share) => `${share} du plus grand rayon`,
    cuts: 'La roue s’enfonce dans sa route de',
    cutsValue: (depth) => `${depth} du rayon`,
    cutsDrawn: (depth) => `${depth} du plus grand rayon`,
    during: 'Elle se cogne pendant',
    duringValue: (share) => `${share} du trajet`,
    clear: 'La roue ne s’enfonce dans sa route',
    clearValue: 'nulle part',
    radius: 'Le rayon va de l’essieu à un coin.',
    rule: 'Les bosses sont exactement aussi hautes que les cahots qu’elles annulent.',
    drawnRule: 'Sa route est aussi longue que son bord, et aussi profonde que le bord est éloigné de l’essieu.',
  },
  status: { level: 'Trajet sans cahot', crash: 'La roue se cognerait' },

  // Les mots dessinés sur l’image.
  labels: {
    own: 'Sur sa route',
    flat: 'Les mêmes roues sur une route plate',
    flatOne: 'La même roue sur une route plate',
    crash: 'Le coin mord dans la bosse suivante',
    crashDrawn: 'La roue et sa route se heurtent',
    closer: (n) => `${n}× plus près`,
    gallery: 'À chaque roue régulière sa route · Touchez-en une pour l’essayer',
    galleryDrawn: 'Formes de départ · Touchez-en une pour l’essayer',
    chain: 'Une chaîne suspendue à deux clous',
    turned: 'Retournée : une bosse faite pour le carré',
    sides: (n) => `${n} côtés`,
    crashes: 'se cogne',
  },

  announce: {
    level: (name, bump) => `${name} : un trajet sans cahot, sur des bosses hautes de ${bump} du rayon.`,
    levelDrawn: (name) => `${name} : un trajet sans cahot sur sa propre route.`,
    crash: (name) => `${name} : sur sa propre route, la roue se cognerait.`,
    picked: (n) => `Point ${n} sur 12 : les flèches haut et bas le poussent vers l’extérieur ou vers l’intérieur.`,
  },

  guests: [
    {
      name: 'Jean Bernoulli',
      note: 'En 1691, il a trouvé la forme d’une chaîne suspendue à deux clous, une énigme posée par son frère Jacques : son premier grand résultat obtenu seul.',
    },
    {
      name: 'Christiaan Huygens',
      note: 'Il a été le premier à donner un nom à la courbe de la chaîne suspendue, catenaria, du latin catena, « chaîne » (notre chaînette), dans une lettre à Leibniz en 1690.',
    },
    {
      name: 'Gottfried Leibniz',
      note: 'Il a lui aussi résolu le problème de la chaîne suspendue. Sa réponse, celle de Huygens et celle de Jean Bernoulli ont été imprimées côte à côte dans une revue en juin 1691.',
    },
  ],

  insight: {
    title: 'Pourquoi le chariot roule-t-il sans cahot ?',
    html: `<p>Pour que l’essieu avance à une hauteur constante, deux conditions doivent être remplies à chaque instant. Le point où la roue touche la route doit se trouver juste sous l’essieu, si bien que la route doit y être exactement aussi loin sous l’essieu que ce point du bord : tout près sous le milieu d’un côté, et loin sous un coin. Et la roue ne doit pas déraper, si bien que chaque bout de route doit être aussi long que le bout de bord qui roule dessus.</p>
<div class="insight-visual">profondeur de la route = distance de l’essieu au bord · longueur de route = longueur de bord</div>
<h3>Des chaînes suspendues, à l’envers</h3>
<p>Pour un côté droit, ces deux règles donnent une courbe célèbre : la forme d’une chaîne suspendue entre deux clous, qu’on appelle une chaînette, retournée. Chaque côté du carré roule sur une bosse, et chaque coin tombe dans le creux entre deux bosses, où elles se rejoignent à angle droit, exactement comme le coin. Avec plus de côtés, les bosses deviennent moins hautes et plus courtes. À mesure que le nombre de côtés augmente, la roue devient ronde et sa route plate.</p>
<p>Les bosses sont exactement aussi hautes que les cahots qu’elles annulent. Sur une route plate, l’essieu monte et descend de la différence entre sa distance à un coin et sa distance au milieu d’un côté ; sur sa propre route, les creux sont plus bas que les sommets d’exactement cette hauteur.</p>
<h3>Pourquoi le triangle échoue</h3>
<p>Les deux règles donnent aussi une route pour un triangle, mais on ne peut pas y rouler. Quand le triangle roule sur une bosse, son coin avant plonge dans la bosse suivante avant d’atteindre le creux. La route convient partout où la roue la touche, et barre le passage ailleurs. Toute roue régulière d’au moins quatre côtés passe sans heurter sa route.</p>
<h3>À chaque roue sa route</h3>
<p>Votre propre roue suit les deux mêmes règles, si bien qu’un cœur ou un œuf a lui aussi sa route. La salle la construit à partir de la distance entre l’essieu et le bord de la roue dans chaque direction, puis vérifie, à des centaines d’instants pendant que la roue roule, si un bout de la route entre à l’intérieur. Certaines roues échouent, et les endroits sont marqués en rouge : une pointe s’enfonce dans la bosse suivante, comme le coin du triangle, ou un creux profond crée sur la route un pic haut et pointu, qui rentre dans le bord avant que le creux n’arrive, en tournant, à sa rencontre.</p>
<p>Les points de votre roue ne bougent que vers l’intérieur ou l’extérieur, le long de leur rayon, si bien que chaque direction partant de l’essieu rencontre le bord exactement une fois. Un bord qui se replierait sur lui-même, vu depuis l’essieu, demanderait une route qui monte à la verticale.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Décrivez la roue par sa distance à l’essieu, r(θ), dans chaque direction θ. Avec l’essieu maintenu sur la droite y = 0 et le point de contact juste en dessous, la route sous le point θ de la roue est à la hauteur y = −r(θ), et rouler sans glisser impose dx = r dθ. Pour le côté d’un polygone régulier, à la distance a de l’essieu, r = a / cos θ, donc x = a arsinh(tan θ) et y = −a cosh(x / a) : une chaînette à l’envers, exactement aussi longue que le côté.</p>
<p>Leon Hall et Stan Wagon ont établi cette correspondance entre roues et routes dans « Roads and Wheels » (1992). L’Exploratorium de San Francisco a présenté une paire de roues carrées sur une telle route ; Stan Wagon a construit un tricycle à roues carrées au Macalester College en 1997, et le National Museum of Mathematics de New York en possède un qui roule sur des chaînettes.</p>
<p>La chaînette elle-même est plus ancienne. Galilée pensait qu’une chaîne suspendue formait une parabole ; Joachim Jungius a montré que non (résultat publié en 1669), et en 1691 Gottfried Leibniz, Christiaan Huygens et Jean Bernoulli ont trouvé son équation, en réponse à un défi lancé par Jacques Bernoulli.</p>
<p>Les tests de la salle vérifient, par un calcul indépendant, que la route du carré est y = −a cosh(x / a), que la route et le bord gardent des longueurs égales, que les roues de 4 à 12 côtés passent sans heurter leur route alors que le coin du triangle s’enfonce jusqu’à 3 % de son rayon dans la bosse suivante, ainsi que la profondeur des autres collisions.</p></details>
<h3>Ce que cette salle laisse de côté</h3>
<p>La route doit correspondre exactement à la taille de la roue, et être alignée avec elle : faites partir une roue carrée sur la pente d’une bosse au lieu de son sommet, et elle roule mal. Un vrai chariot a aussi des roues des deux côtés, qui doivent rester en phase entre elles et avec les bosses. Ici, le chariot roule à vitesse constante, sans ressorts, sans vacillement et sans frottement, et les éclaboussures de l’eau sur la route plate sont dessinées pour le plaisir, pas calculées.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Square_wheel" target="_blank" rel="noopener">Roue carrée (Wikipédia, en anglais)</a><a class="source-link" href="https://mathworld.wolfram.com/Roulette.html" target="_blank" rel="noopener">Roulette (MathWorld, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Chaînette (Wikipédia, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Curves/Catenary/" target="_blank" rel="noopener">Chaînette (MacTutor, en anglais)</a><a class="source-link" href="https://www.sciencenews.org/article/riding-square-wheels" target="_blank" rel="noopener">Rouler sur des roues carrées (Science News, 2004, en anglais)</a><a class="source-link" href="https://math.hmc.edu/funfacts/?p=172" target="_blank" rel="noopener">Un vélo à roues carrées (Math Fun Facts, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stan_Wagon" target="_blank" rel="noopener">Stan Wagon (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Museum_of_Mathematics" target="_blank" rel="noopener">National Museum of Mathematics (Wikipédia, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Bernoulli_Johann/" target="_blank" rel="noopener">Jean Bernoulli (MacTutor, en anglais)</a></div>`,
  },
});
