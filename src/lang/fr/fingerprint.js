Wonderlattice.defineText('fingerprint', 'fr', {
  eyebrow: 'PEAU',
  name: 'Faire pousser une empreinte',
  tagline: 'Personne ne la dessine : les crêtes poussent d’elles-mêmes en verticilles, boucles et arcs.',
  title: 'Faire pousser une empreinte.',
  subtitle:
    'Personne ne dessine une empreinte digitale. Deux signaux se propagent et réagissent, et les crêtes apparaissent d’elles-mêmes.',
  field: 'Réaction-diffusion · Motifs de Turing · Développement',
  sceneLabel: 'Un bout de doigt qui fait pousser ses crêtes',
  tip: 'Touchez le bout du doigt pour y lancer des crêtes · Les flèches visent, Entrée plante',
  actionLabel: 'Faire repousser',
  canvasLabel:
    'Un bout de doigt où des crêtes poussent à partir de quelques points de départ. Cliquez ou touchez pour lancer des crêtes en un point, ou utilisez les flèches pour viser et Entrée pour planter.',
  panelEyebrow: 'Façonner la croissance',
  whyLabel: 'Comment les crêtes se forment-elles ?',
  nudge:
    'Regardez où les vagues se rencontrent : trois qui se rejoignent laissent un petit Y. Puis appuyez sur « Faire repousser » : même plan, nouveaux détails, comme de vrais jumeaux.',
  connection: {
    html: '<strong>Aucun plan tracé d’avance.</strong> Ici, deux signaux et quelques points de départ font chaque crête. Dans « Un esprit collectif », quelques règles entre voisins font bouger toute une foule.',
    label: 'Visiter « Un esprit collectif »',
  },
  presets: [
    {
      name: 'Verticille',
      note: 'Le centre de la pulpe démarre en premier.',
    },
    {
      name: 'Boucle',
      note: 'Un départ qui file vers un côté.',
    },
    {
      name: 'Arc',
      note: 'Le pli mène ; la pulpe ne démarre jamais.',
    },
    {
      name: 'À vous',
      note: 'Touchez pour choisir où les crêtes commencent.',
    },
  ],
  sceneNames: ['Un verticille', 'Une boucle', 'Un arc', 'Votre propre empreinte'],
  mixed: 'Votre propre mélange',
  lead: 'Avance de la première vague',
  ridges: (n) => (n <= 1 ? `${n} crête` : `${n} crêtes`),
  spacing: 'Espacement des crêtes',
  across: (n) => `environ ${n} en largeur`,
  speed: 'Vitesse de croissance',
  speeds: ['douce', 'tranquille', 'régulière', 'vive', 'effrénée'],
  look: 'Aspect',
  looks: ['Peau chaude', 'Empreinte à l’encre', 'Lueur nocturne'],
  marks: 'Montrer où les crêtes commencent',
  roles: {
    pad: 'Centre de la pulpe',
    tip: 'Bout du doigt',
    crease: 'Pli',
    yours: 'Votre point',
  },
  legendTitle: 'OÙ LES CRÊTES COMMENCENT',
  triradiusKey: 'Delta : un petit Y',
  started: 'en croissance',
  done: 'terminé',
  soon: (n) => (n <= 1 ? 'démarre d’ici environ une crête' : `démarre d’ici environ ${n} crêtes`),
  noSites: 'Touchez le bout du doigt pour commencer.',
  growing: (percent) => `Croissance · ${percent} % du bout du doigt`,
  quietly: (percent) => `Croissance tranquille · ${percent} %`,
  waiting: 'Touchez le bout du doigt pour lancer des crêtes',
  types: {
    whorl: 'un verticille',
    loop: 'une boucle',
    arch: 'un arc',
  },
  result: (type) => `Terminé : son centre forme ${type}`,
  triradii: (n) => (n === 0 ? 'aucun delta trouvé' : n === 1 ? '1 delta (un petit Y)' : `${n} deltas (des petits Y)`),
  status: (type, n) => `${type[0].toUpperCase() + type.slice(1)} · ${n <= 1 ? `${n} delta` : `${n} deltas`}`,
  twin: (n) => `Jumeau ${n + 1} · « Faire repousser » pour un autre`,
  full: 'Quatre points de départ au maximum. Choisissez « À vous » pour un bout de doigt tout neuf.',
  outside: 'Touchez l’intérieur du bout du doigt.',
  guests: [
    {
      name: 'Alan Turing',
      note: 'En 1952, il a montré que deux substances chimiques, qui réagissent et se propagent à des vitesses différentes, peuvent faire apparaître des motifs.',
    },
  ],
  insight: {
    title: 'D’où viennent les empreintes digitales ?',
    html: `<p>Personne ne dessine une empreinte digitale. Avant la naissance, la peau de chaque bout de doigt dispose ses crêtes d’elle-même, et le motif reste pour la vie.</p>
<div class="insight-visual">activateur + inhibiteur, qui se propagent à des vitesses différentes → crêtes</div>
<h3>L’idée de Turing</h3>
<p>En 1952, Alan Turing a montré que deux substances chimiques, qui réagissent entre elles et se propagent à des vitesses différentes, peuvent faire apparaître un motif dans un mélange uniforme. Une façon courante de se le représenter est apparue plus tard : un <em>activateur</em> qui se fabrique lui-même, et un <em>inhibiteur</em> qu’il fabrique aussi et qui le freine. Si l’inhibiteur se propage plus vite, chaque bosse d’activateur s’entoure d’une douve où aucune autre bosse ne peut pousser. Le résultat, ce sont des taches ou des rayures, à un espacement que choisit la chimie.</p>
<h3>Des vagues parties de quelques endroits</h3>
<p>En 2023, une équipe dirigée depuis l’université d’Édimbourg a découvert que les crêtes des empreintes digitales suivent ce genre de système de Turing, avec les signaux WNT et EDAR comme activateurs et BMP comme inhibiteur. Les crêtes n’apparaissent pas partout à la fois. Elles démarrent en quelques sites : le centre de la pulpe du doigt, le bout près de l’ongle, et à côté du pli de la dernière articulation. De là, elles se propagent en vagues et déposent des crêtes à peu près parallèles à leur front. Là où les vagues se rencontrent, elles laissent des deltas en forme de Y. Les simulations de l’équipe ont produit des arcs, des boucles et des verticilles en changeant quand, où et sous quel angle les sites démarrent : une pulpe qui démarre tard, par exemple, laisse de la place aux crêtes du pli et forme un arc.</p>
<h3>Pourquoi les empreintes diffèrent autant</h3>
<p>L’étude a montré que l’endroit où les sites démarrent, et la façon dont leurs vagues se rencontrent, font la variété des empreintes ; dans leur discussion, les auteurs ajoutent que les minuscules différences aléatoires typiques des motifs de Turing rendent chaque empreinte plus unique encore. Les vrais jumeaux partagent leurs gènes, et leurs empreintes ont souvent le même type, mais pas les mêmes détails : dans une vaste étude, les empreintes de jumeaux avaient le même type environ trois fois sur quatre, et pourtant un logiciel de comparaison d’empreintes les distinguait presque aussi sûrement que celles de personnes sans lien de parenté. « Faire repousser » garde le plan et ne change que les détails les plus infimes : vous pouvez voir les crêtes s’arrêter et bifurquer à de nouveaux endroits.</p>
<h3>Ce que cette salle laisse de côté</h3>
<p>Ceci est un modèle simplifié inspiré de ces recherches, pas une simulation de la vraie peau d’un embryon. Le bout du doigt est plat, les sites de départ sont placés à la main, et aucun gène ni aucune vraie substance chimique n’apparaît : juste deux signaux inventés, avec des équations de manuel. Il laisse de côté la croissance du doigt, sa pulpe en trois dimensions, et les pores sudoripares qui parsèment plus tard chaque crête.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Les deux signaux a (activateur) et h (inhibiteur) suivent des équations adaptées du modèle cubique de Barrio–Varea–Aragón–Maini (ici l’activateur se propage un peu plus lentement, 0,45 au lieu de 0,516, et h est leur v changé de signe) : ∂a/∂t = 0.45 s ∇²a + 0.899 a − h − 3.15 a h², et ∂h/∂t = s ∇²h + 0.899 a − 0.91 h − 3.15 a h². L’état uniforme a = h = 0 est instable pour toute une gamme d’ondulations, dont la plus rapide a une longueur d’onde d’environ 9,5√s cellules de la grille, mais il reste exactement uniforme tant qu’un site ne le pousse pas : les crêtes ne se propagent donc qu’en vagues depuis les sites. Sans termes de degré deux, les rayures l’emportent sur les taches. Le curseur d’espacement des crêtes change s.</p><p>La salle nomme le résultat en faisant le tour de chaque point où la direction des crêtes n’est plus définie et en additionnant de combien cette direction tourne (son indice de Poincaré) : un demi-tour dans un sens pour le cœur d’une boucle, un tour entier pour le centre d’un verticille, et un demi-tour dans l’autre sens pour un delta. Les experts en empreintes digitales utilisent les mêmes repères. Les points situés tout au bord du bout du doigt ne sont pas détectés.</p></details>
<div class="sources"><a class="source-link" href="https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/" target="_blank" rel="noopener">Glover et al. (2023), The developmental basis of fingerprint pattern formation and variation (en anglais)</a><a class="source-link" href="https://doi.org/10.1098/rstb.1952.0012" target="_blank" rel="noopener">Turing (1952), The chemical basis of morphogenesis (en anglais)</a><a class="source-link" href="https://doi.org/10.1371/journal.pone.0035704" target="_blank" rel="noopener">Tao et al. (2012), reconnaître les empreintes de vrais jumeaux (en anglais)</a><a class="source-link" href="https://doi.org/10.1006/bulm.1998.0093" target="_blank" rel="noopener">Barrio et al. (1999), le modèle dont ces équations sont adaptées (en anglais)</a></div>`,
  },
});
