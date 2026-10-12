/* Trois fils, aucun retour · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('phases', 'fr', {
  eyebrow: 'COURANT TRIPHASÉ',
  name: 'Trois fils, aucun retour',
  tagline: 'Trois courants se poursuivent autour d’un cercle, et à chaque instant leur somme est nulle.',
  title: 'Trois fils, aucun retour.',
  subtitle:
    'Trois circuits demanderaient six fils. Regardez leurs trois fils de retour se fondre en un seul, où ne passe aucun courant, puis chargez une rue pour le réveiller.',
  field: 'Phaseurs · À 120° d’écart · Un champ tournant',
  sceneLabel: 'Du courant triphasé, 150 fois plus lent que le secteur',
  // By the view: the currents, the power, the field of three coils.
  sceneNames: ['Trois courants', 'Des lampes qui scintillent', 'Un champ qui tourne'],
  tip: 'Tirez la pointe d’une flèche vers l’intérieur ou l’extérieur pour changer le courant de son fil • Clavier : ← → choisissent un fil, ↑ ↓ changent son courant',
  canvasLabel:
    'À gauche, trois flèches de couleur, à un tiers de tour l’une de l’autre, tournent autour d’un cercle comme les aiguilles d’une horloge ; leurs hauteurs tracent trois sinusoïdes vers la droite, et une ligne blanche, leur somme, reste plate à zéro. En dessous, une centrale envoie les trois courants par trois fils vers trois rues de maisons. Au début, chaque rue a son propre fil de retour, six fils en tout ; les trois fils de retour glissent l’un vers l’autre et se fondent en un seul fil commun, dont le compteur indique 0 A, car les courants s’annulent. Chargez davantage une rue et le compteur se réveille. D’autres vues montrent les lampes de chaque rue qui scintillent tandis que leur total reste stable, et trois bobines dont le champ fait tourner l’aiguille d’une boussole.',
  panelEyebrow: 'Chargez les rues',
  whyLabel: 'Pourquoi les trois courants s’annulent-ils ?',
  nudge:
    'Allumez les bouilloires et regardez le fil de retour se réveiller. Puis affichez le champ : trois bobines immobiles font tourner l’aiguille d’une boussole.',
  connection: {
    html: '<strong>Additionner des ondes.</strong> Ici, trois ondes de même hauteur, décalées d’un tiers de cycle, s’additionnent en silence. Dans « Entendre la forme », deux sons s’additionnent : ils peuvent s’annuler, battre ou former un accord.',
    label: 'Additionner deux sons',
  },

  presets: [
    { name: 'Équilibré', note: 'Courants égaux : rien ne revient.', badge: '0 A' },
    { name: 'Bouilloires dans une rue', note: 'Deux fois plus de courant dans le fil 1.', badge: '100 A' },
    { name: 'Un champ qui tourne', note: 'Trois bobines immobiles font tourner une boussole.', badge: '⟳' },
  ],

  wire: (n) => `Courant dans le fil ${n}`,
  wireHint: 'Chaque fil alimente sa propre rue. Augmentez-en un, comme si ses bouilloires s’allumaient.',
  amps: '\u00a0A',
  view: 'Afficher',
  // The views: the currents, the power, the field of three coils.
  views: ['Courants', 'Puissance', 'Champ'],
  swap: 'Inverser les fils 2 et 3',
  swapHint: 'Le champ tourne dans l’autre sens : c’est ainsi qu’on inverse un moteur triphasé.',
  kettlesOn: 'Allumer les bouilloires',
  kettlesOff: 'Éteindre les bouilloires',

  // A number (or a word) and one line.
  readout: {
    back: 'Dans le fil de retour',
    cancel: 'Les trois courants s’annulent à chaque instant, si bien que trois fils font le travail de six.',
    differ: 'Les courants diffèrent, donc ils ne s’annulent plus : la différence revient.',
    total: 'Puissance totale',
    steady: 'Stable',
    swings: (share) => `± ${share}`,
    totalSteady: 'Les lampes de chaque rue scintillent deux fois par cycle, mais les trois ensemble, jamais.',
    totalSwings: 'Les charges diffèrent, donc le total monte et descend lui aussi.',
    fieldTitle: 'La force du champ',
    wobbles: 'Oscillante',
    fieldSteady: 'Le champ garde sa force et fait un tour par cycle, alors que rien ne bouge.',
    fieldWobbles: 'Le champ tourne toujours, mais des courants inégaux le font enfler et rétrécir.',
    nothing: 'Pas de courant : les lampes sont éteintes.',
  },

  status: (amps) => `Fil de retour : ${amps}`,
  announce: (amps) => `Le fil de retour transporte ${amps}.`,

  // Words drawn on the picture.
  labels: {
    sum: 'somme',
    sumZero: 'somme = 0',
    station: 'centrale',
    street: (n) => `rue ${n}`,
    back: 'fil de retour',
    shared: 'retour commun',
    amps: (n) => `${n} A`,
    // The opening: six wires become three.
    story: [
      'Trois circuits : six fils',
      'Un seul fil de retour…',
      '…et rien n’y passe',
      'Trois fils font le travail de six',
    ],
    differ: 'Courants inégaux : la différence revient',
    each: 'chaque rue',
    total: 'total',
    field: 'champ',
    swapped: 'fils 2 et 3 inversés',
  },

  guests: [
    {
      name: 'Mikhaïl Dolivo-Dobrovolski',
      note: 'Il a baptisé le courant triphasé, et construit des générateurs et des moteurs triphasés à partir de 1888. En 1891, son système a transporté du courant sur 175 km, d’une turbine à Lauffen jusqu’à une exposition à Francfort, et les trois quarts en sont arrivés.',
    },
    {
      name: 'Nikola Tesla',
      note: 'En 1888, il a breveté des moteurs entraînés par des courants alternatifs décalés, dont le champ tournant entraîne le rotor sans balais ni interrupteurs.',
    },
    {
      name: 'Galileo Ferraris',
      note: 'En 1885, indépendamment de Tesla, il a construit une maquette de démonstration dans laquelle des courants décalés créaient un champ magnétique qui tourne. Il l’a publiée en 1888.',
    },
  ],

  insight: {
    title: 'Pourquoi les trois courants s’annulent-ils ?',
    html: `<p>Le courant de chaque fil est l’ombre d’une flèche qui tourne autour du cercle : sa hauteur, suivie au fil du temps, est une sinusoïde. Les trois flèches sont à un tiers de tour l’une de l’autre. Mettez-les bout à bout et elles ferment un triangle : leur somme est donc nulle, et celle de leurs ombres aussi, à chaque instant :</p>
<div class="insight-visual">sin θ + sin(θ − 120°) + sin(θ + 120°) = 0</div>
<p>Trois circuits peuvent donc partager un seul fil de retour, et quand leurs charges sont égales, il ne transporte rien et on peut s’en passer : trois fils font le travail de six. Dans le langage des nombres complexes, les trois flèches sont les racines cubiques de 1, dont la somme vaut 0. Chargez davantage une rue et sa flèche s’allonge : le triangle ne se ferme plus, et l’écart, la somme des flèches, est le courant qui revient.</p>
<h3>Des lampes qui scintillent, un total qui ne scintille pas</h3>
<p>La puissance d’une lampe croît avec le carré de son courant : elle enfle et retombe donc deux fois par cycle, soit, sur le secteur à 50 Hz, 100 fois par seconde. Pourtant sin² θ + sin²(θ − 120°) + sin²(θ + 120°) = 3/2 pour tout θ, si bien qu’avec des charges égales, les trois phases ensemble fournissent un total parfaitement stable. C’est pourquoi les gros moteurs et les générateurs utilisent trois phases : une poussée régulière, sans à-coups.</p>
<h3>Un champ qui tourne</h3>
<p>Envoyez les trois courants dans trois bobines placées à un tiers de tour l’une de l’autre autour d’un cercle, et le champ magnétique au centre garde sa force tandis que sa direction tourne, d’un tour par cycle. Rien ne bouge, et pourtant l’aiguille d’une boussole, ou le rotor d’un moteur, est entraînée. Inversez deux fils, n’importe lesquels, et il tourne dans l’autre sens : c’est ainsi qu’on inverse un moteur triphasé. Galileo Ferraris (une maquette en 1885, publiée en 1888) et Nikola Tesla (des brevets en 1888) ont trouvé le champ tournant indépendamment l’un de l’autre. Mikhaïl Dolivo-Dobrovolski a construit des générateurs, des moteurs et des transformateurs triphasés, et en 1891 sa ligne a transporté du courant triphasé sur 175 km, de Lauffen jusqu’à une exposition à Francfort.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Trois fils au lieu de six, ce n’est exact que lorsque les trois charges sont égales. Les vraies charges ne le sont jamais tout à fait : la rue devant une maison porte donc un quatrième fil, le neutre, pour ramener la différence, comme dans cette salle quand vous chargez une rue. Les longues lignes alimentent de grosses charges presque équilibrées, et n’ont donc que trois fils ; les câbles plus fins qu’on voit souvent tout en haut des pylônes sont des câbles de garde, là pour la foudre et les défauts, pas pour ramener du courant. L’électronique, comme les chargeurs de téléphone, absorbe des courants riches en harmoniques, et la troisième harmonique s’additionne dans le neutre au lieu de s’annuler, si bien qu’un neutre peut même transporter plus qu’une phase. Comparée à un simple circuit à deux fils sous la même tension entre ses fils, une ligne à trois fils transporte la même puissance avec environ les trois quarts du métal. Dans cette salle, les lampes sont de simples résistances, les ondes sont des sinusoïdes parfaites, rien ne se perd en chemin, et tout tourne 150 fois plus lentement que le secteur à 50 Hz.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Three-phase_electric_power" target="_blank" rel="noopener">Courant triphasé (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Neutral_conductor" target="_blank" rel="noopener">Conducteur neutre (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Phasor" target="_blank" rel="noopener">Phaseur (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Rotating_magnetic_field" target="_blank" rel="noopener">Champ magnétique tournant (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mikhail_Dolivo-Dobrovolsky" target="_blank" rel="noopener">Mikhaïl Dolivo-Dobrovolski (Wikipédia, en anglais)</a></div>`,
  },
});
