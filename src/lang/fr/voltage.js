/* Éclairer une ville à 100 km · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('voltage', 'fr', {
  eyebrow: 'LIGNES ÉLECTRIQUES',
  name: 'Éclairer une ville à 100 km',
  tagline: 'Envoyez la même puissance sous une tension dix fois plus haute, et le fil gaspille cent fois moins.',
  title: 'Éclairer une ville à 100 km.',
  subtitle:
    'La même puissance, le même fil. À basse tension, la ligne rougeoie et la ville reste dans le noir ; montez la tension, et les fenêtres s’allument. Puis tournez vous-même le bouton.',
  field: 'L’effet Joule · Les transformateurs · Une loi du carré',
  sceneLabel: '10 MW envoyés · 100 km de fil',
  // Selon le type de courant : alternatif, continu comme dans les années 1880, continu comme aujourd’hui.
  sceneNames: [
    'Courant alternatif, par des transformateurs',
    'Courant continu, comme dans les années 1880',
    'Courant continu aujourd’hui, par des convertisseurs',
  ],
  tip: 'Faites glisser le long de l’échelle des tensions sous l’image, ou appuyez sur ← → sur l’image, pour régler la tension',
  soundOff: 'Activer le son',
  soundOn: 'Son activé · couper',
  noSound: 'Le son n’est pas disponible dans ce navigateur. Vous pouvez tout de même regarder la ligne.',
  canvasLabel:
    'De nuit, une centrale à gauche envoie l’électricité le long d’une ligne de pylônes vers une ville de petites maisons à droite, à 100 km, en passant par un transformateur à chaque bout. Quand la tension est basse, le fil rougeoie et la chaleur fait trembler l’air au-dessus, et la plupart des fenêtres de la ville restent sombres. Quand la tension monte, la lueur s’éteint et les fenêtres s’allument une à une. En dessous, un graphique montre la chaleur perdue dans le fil selon la tension : une droite qui descend en pente raide, où une tension dix fois plus haute signifie cent fois moins de chaleur. Son axe horizontal sert de bouton de réglage.',
  panelEyebrow: 'Tournez le bouton',
  whyLabel: 'Pourquoi la haute tension gaspille-t-elle moins ?',
  nudge:
    'Regardez la ligne pendant que la tension monte de 10 kV à 100 kV : la chaleur est divisée par cent. Puis passez au courant continu, comme dans les années 1880, pour voir ce que faisaient les transformateurs.',
  connection: {
    html: '<strong>De l’énergie à travers un réseau.</strong> Ici, une seule ligne transporte l’électricité d’une ville. Les vrais réseaux électriques sont maillés, et les réseaux peuvent surprendre : dans « Le raccourci tentant », une nouvelle route ralentit tous les conducteurs. Des modèles informatiques suggèrent que la même chose peut arriver quand un réseau électrique gagne une ligne.',
    label: 'Essayer le raccourci',
  },

  presets: [
    { name: 'La moitié perdue', note: 'Le fil change la moitié de la puissance en chaleur.', badge: '10 kV' },
    {
      name: 'Comme une ligne à haute tension',
      note: 'À peine tiède, et toutes les fenêtres allumées.',
      badge: '400 kV',
    },
    { name: 'Juste plus de métal', note: 'Cent fois plus d’aluminium, toujours à 10 kV.', badge: '×100' },
  ],

  voltage: 'Tension sur la ligne',
  voltageHint:
    'Des transformateurs élèvent la tension à la centrale et l’abaissent de nouveau en ville, si bien que les maisons reçoivent toujours 230 V.',
  voltageValue: (kv, lost) => `${kv}, ${lost} perdus en chaleur`,
  modeLabel: 'Courant',
  // Selon le type de courant : alternatif, continu comme dans les années 1880, continu comme aujourd’hui.
  modes: ['CA', 'CC, années 1880', 'CC, actuel'],
  modeHint:
    'Le courant alternatif (CA) va et vient 50 fois par seconde ; le courant continu (CC) circule dans un seul sens.',
  metal: 'Métal dans le fil',
  metalHint:
    'L’autre façon de moins gaspiller : plus d’aluminium, c’est moins de résistance. Deux fois plus de métal, deux fois moins de chaleur.',

  // Les unités, avec un nombre déjà écrit dans la langue de la page.
  kv: (n) => `${n} kV`,
  times: (n) => `×${n}`,
  watts: [(n) => `${n} W`, (n) => `${n} kW`, (n) => `${n} MW`, (n) => `${n} GW`],
  cm: (n) => `${n} cm`,
  tonnes: (n) => `${n} tonnes`,

  // Un nombre et une ligne : le reste (le courant, la tension ×10) est sur le graphique et dans l’explication.
  readout: {
    lost: 'Perdu en chaleur',
    lostOf: (loss, sent) => `${loss} sur les ${sent} envoyés. La ville reçoit le reste.`,
    tooMuch: (loss, sent) => `${loss}, plus que les ${sent} envoyés : rien n’arrive à la ville.`,
    // Seulement quand le visiteur ajoute du métal.
    wire: (cm, tonnes) => `Le fil fait ${cm} d’épaisseur : ${tonnes} d’aluminium.`,
    stopped: 'Un courant continu constant ne traverse pas un transformateur, donc rien n’arrive à la ville.',
    converters:
      'Des convertisseurs élèvent et abaissent la tension du courant continu ; dans ce modèle simple, il perd autant que le courant alternatif.',
  },

  status: (kv, lost) => `${kv} · ${lost} perdus`,
  statusStopped: 'Aucun courant ne passe',

  // Les mots dessinés sur l’image.
  labels: {
    station: 'centrale',
    town: 'ville',
    distance: '100 km',
    house: '230 V',
    lost: (share) => `${share} perdus en chaleur`,
    nothing: 'rien n’arrive à la ville',
    stopped: 'CC : les transformateurs bloquent',
    chartTitle: 'chaleur perdue dans le fil',
    chartX: 'tension sur la ligne',
    sent: '10 MW envoyés',
    over: 'la ville ne reçoit rien',
    // L’échelon entre le point et une tension dix fois plus haute (ou dix fois plus basse).
    up: ['tension × 10', 'chaleur ÷ 100'],
    down: ['tension ÷ 10', 'chaleur × 100'],
    drag: 'faites glisser',
  },

  guests: [
    {
      name: 'James Prescott Joule',
      note: 'En 1840, il a mesuré la chaleur qu’un courant produit dans un fil, et a trouvé qu’elle croît comme le carré du courant : deux fois plus de courant, quatre fois plus de chaleur.',
    },
    {
      name: 'Thomas Edison',
      note: 'Dans les années 1880, sa compagnie distribuait du courant continu à 110 volts. Il n’atteignait que les clients situés à moins d’un mile de chaque centrale, mais il fonctionnait avec les accumulateurs, les moteurs électriques et son compteur d’électricité.',
    },
    {
      name: 'Nikola Tesla',
      note: 'Son moteur fonctionnait au courant alternatif. En 1888, George Westinghouse a acquis une licence de ses brevets, et, avec des transformateurs pour élever la tension, le courant alternatif a fini par l’emporter sur le courant continu d’Edison.',
    },
  ],

  insight: {
    title: 'Pourquoi la haute tension gaspille-t-elle moins ?',
    html: `<p>Une centrale envoie une puissance égale à la tension multipliée par le courant : P = V × I. Le fil en change une partie en chaleur, et cette chaleur croît comme le <em>carré</em> du courant : I² × R, où R est la résistance du fil (la loi de Joule). Pour envoyer la même puissance, on monte donc la tension et on baisse le courant. Une tension dix fois plus haute, c’est un courant dix fois plus faible, et cent fois moins de chaleur.</p>
<div class="insight-visual">chaleur perdue = I² × R = (P ÷ V)² × R = P² × R ÷ V²</div>
<h3>Les chiffres de cette salle</h3>
<p>La centrale envoie 10 MW le long de 100 km de fil d’une résistance de 5 Ω. À 10 kV, le courant vaut 1 000 A, et le fil gaspille 5 MW : la moitié du tout. À 100 kV, le courant vaut 100 A, et il gaspille 50 kW, soit 0,5 %. À 400 kV, il gaspille environ 3 kW. En dessous d’environ 7 kV, le calcul donnerait des pertes supérieures à ce qu’envoie la centrale : la ville ne reçoit alors rien du tout.</p>
<h3>Pourquoi pas un fil plus gros ?</h3>
<p>La résistance d’un fil baisse en proportion de sa section : diviser la chaleur par deux avec le seul métal, c’est doubler le métal. Le fil le plus fin de cette salle est en aluminium plein, d’environ 2,7 cm d’épaisseur, soit quelque 150 tonnes. Pour faire à 10 kV ce que fait une ligne à 100 kV, il en faudrait cent fois plus : un fil de 27 cm d’épaisseur, pesant 15 000 tonnes. Monter la tension coûte bien moins cher.</p>
<h3>Le transformateur, et la guerre des courants</h3>
<p>Les maisons ne peuvent pas utiliser 400 000 volts : il faut donc redescendre la tension à l’arrivée. Un transformateur le fait avec deux bobines sur un noyau de fer : un courant variable dans l’une crée un champ magnétique variable, qui fait naître un courant dans l’autre. Les tensions sont dans le rapport des nombres de spires des bobines, et le courant varie en sens inverse, si bien que la puissance reste presque la même. Mais cela ne marche que tant que le courant ne cesse de changer. À la fin des années 1880 et au début des années 1890, c’est ce qui a fait du courant alternatif le vainqueur de la « guerre des courants ». Le courant continu d’Edison avait de vrais atouts, et fonctionnait avec les accumulateurs, les moteurs et les compteurs, mais on ne pouvait pas en élever la tension : il partait donc à 110 V et n’atteignait que les clients à moins d’un mile. Plus tard, les valves à vapeur de mercure puis, à partir des années 1970, l’électronique ont permis de convertir le courant alternatif en continu, et inversement, à très haute tension, et aujourd’hui beaucoup des plus longues liaisons transportent du courant continu : la ligne chinoise Zhundong–Sud-Anhui fonctionne à ±1 100 kV sur plus de 3 000 km.</p>
<h3>Ce que cela laisse de côté</h3>
<p>Il n’y a ici qu’un seul fil, avec sa seule résistance, qui transporte une puissance fixe. Les vraies lignes transportent trois phases, et les champs magnétique et électrique de la ligne elle-même, ainsi que le courant qui se concentre vers la surface du fil, s’ajoutent à leurs pertes. Les calculs supposent aussi que la centrale peut toujours faire passer sa puissance. Dès que le fil en gaspillerait une grande partie, ce n’est plus vrai : en dessous d’environ 7 kV ici, la tension que le fil consomme en chemin, I × R, dépasserait toute la tension de la centrale, si bien qu’en réalité les lampes faibliraient et le courant ne pourrait pas devenir si grand. Dans les deux cas, la ville reste dans le noir. La lueur est une image de la chaleur perdue, pas d’une température : une vraie ligne s’affaisserait vers le sol, et serait coupée, bien avant de rougeoyer. La tension ne peut pas non plus monter indéfiniment. Les pylônes doivent être plus hauts et les isolateurs plus longs, et vers le haut de l’échelle, l’air autour du fil se met à luire et à crépiter (l’effet couronne) ; au-delà d’environ 2 000 kV, ces pertes pourraient annuler les économies. Les vrais conducteurs sont des brins d’aluminium, souvent autour d’une âme en acier, et les maisons reçoivent 230 V dans la plus grande partie du monde, mais 120 V en Amérique du Nord.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Electric_power_transmission" target="_blank" rel="noopener">Transport d’électricité (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Joule_heating" target="_blank" rel="noopener">Effet Joule (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Transformer" target="_blank" rel="noopener">Transformateur électrique (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/War_of_the_currents" target="_blank" rel="noopener">Guerre des courants (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/High-voltage_direct_current" target="_blank" rel="noopener">Courant continu haute tension (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Corona_discharge" target="_blank" rel="noopener">Effet couronne (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mains_electricity" target="_blank" rel="noopener">Courant du secteur (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity" target="_blank" rel="noopener">Résistivité électrique (aluminium, en anglais)</a></div>`,
  },
});
