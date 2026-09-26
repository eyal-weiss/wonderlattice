/*
 * Français (fr). Traduit de l’anglais ; les chaînes sont à leur place d’origine.
 * - Keep every key; delete any you don't translate, and English will show there instead.
 * - Strings written as functions, like (n) => `${n} rolls`, receive numbers or names: keep the
 *   ${…} parts, and move them wherever your language needs them.
 * - Keys ending in Html may contain markup such as <strong> or <em>; keep the tags balanced.
 * - Check your work with: npm run i18n:check
 * Typographie : espace fine insécable (U+202F) avant ; ! ? % et à l’intérieur des « guillemets »,
 * espace insécable (U+00A0) avant les deux-points, et espace fine dans les grands nombres (4 000).
 */
Wonderlattice.defineLanguage('fr', { name: 'Français', dir: 'ltr', speech: 'fr-FR' });

Wonderlattice.defineText('app', 'fr', {
  themes: {
    shape: {
      name: 'Formes et espace',
      blurb: 'Des courbes, des surfaces, et les espaces où elles vivent.',
    },
    chance: {
      name: 'Hasard et indices',
      blurb: 'Bien raisonner quand chaque événement est imprévisible.',
    },
    games: {
      name: 'Jeux et énigmes',
      blurb: 'La structure cachée derrière des jeux familiers.',
    },
    making: {
      name: 'Fabriquer',
      blurb: 'Des mathématiques à tisser, à plier et à garder.',
    },
    life: {
      name: 'Motifs vivants',
      blurb: 'Un ordre qui naît de nombreuses petites interactions.',
    },
    signals: {
      name: 'Signaux et réseaux',
      blurb: 'Des ondes, des messages et des choix qui voyagent.',
    },
  },
  roomBar: {
    previous: (name) => `Expérience précédente : ${name}`,
    next: (name) => `Expérience suivante : ${name}`,
  },
  language: 'Langue',
  pageTitle: (room) => `${room} · Wonderlattice`,
  stage: {
    makeItYours: 'À vous de jouer',
    keep: '✧ Garder ce moment',
    nudge: 'Un petit coup de pouce',
    guestLabel: 'Une figure des mathématiques en visite',
    canvasRole: 'image interactive',
    pause: 'Pause',
    play: 'Lecture',
    saved: 'Votre scène est prête à être enregistrée.',
    saveFailed: 'Impossible d’enregistrer cette image.',
    shareText: (title) => `Wonderlattice · ${title}`,
    linkCopied: 'Lien de l’exploration copié.',
    settingsCopied: 'Réglages de l’exploration copiés.',
    linkDescription: 'Copiez ce lien pour retrouver ces réglages.',
    settingsDescription: 'Copiez ces réglages pour recréer cette exploration.',
  },
  narration: {
    listen: 'Écouter cette idée',
    stop: 'Arrêter la narration',
    unavailable: 'La narration n’est pas disponible dans ce navigateur. Le texte complet reste là, à lire.',
    symbols: {
      '−': ' moins ',
      '×': ' fois ',
      '→': ' vers ',
      '↔': ' et ',
      '≈': ' environ ',
      '±': ' plus ou moins ',
      '²': ' au carré ',
      '′': ' prime ',
      '√': ' racine de ',
      φ: ' phi ',
      θ: ' thêta ',
      π: ' pi ',
      ᵀ: ' transposée ',
      '∞': ' infini ',
      '≤': ' au plus ',
      '≥': ' au moins ',
      '|': ' ',
      '·': ' fois ',
      '↗': ' ',
      '✧': ' ',
      '✕': ' ',
    },
  },
  guests: {
    eyebrowPortrait: 'Histoire des maths · portrait historique',
    eyebrowSketch: 'Histoire des maths · un croquis espiègle',
    story: 'Son histoire ↗',
    storyLabel: (name) => `Son histoire : en savoir plus sur ${name} (s’ouvre dans un nouvel onglet)`,
    portrait: 'Portrait ↗',
    portraitLabel: (name) => `Portrait : la source du portrait de ${name} (s’ouvre dans un nouvel onglet)`,
    photo: (credit) => `Photo : ${credit}`,
    another: 'Rencontrer quelqu’un d’autre',
  },
  trail: {
    bridges: {
      'motion-waves': 'Un cercle qui tourne peut laisser une onde dans son sillage.',
      'flock-traffic': 'Une foule peut se surprendre elle-même, un choix local à la fois.',
      'ribbon-motion': 'Suivez un point, et une forme peut révéler une autre face.',
      'loom-flock': 'Une petite règle, répétée partout, peut façonner le tout.',
    },
    unreadable:
      'Le parcours enregistré n’a pas pu être lu dans ce navigateur. Vous pouvez importer un export précédent.',
    storageFull:
      'Impossible d’enregistrer ici. Vérifiez l’espace de stockage du navigateur, ou exportez votre parcours actuel.',
    stillAlt: 'Image fixe de cette exploration',
    full: (max) =>
      `Votre parcours compte ${max} moments. Exportez-le ou retirez-en un avant d’en enregistrer un autre.`,
    notSaved: 'Cette scène n’a pas pu être enregistrée.',
    savedAlt: (room) => `Vue enregistrée de ${room}`,
    onReturning: 'À votre retour',
    revisit: 'Revoir',
    remove: 'Retirer',
    empty: 'Votre parcours est vide. Gardez ce qui attire votre regard, puis revenez-y quand vous voulez.',
    explore: (room) => `Explorer « ${room} »`,
    returnTitle: (room) => `Un moment que vous avez gardé · ${room}`,
    thenYouNoticed: (note) => `Vous aviez remarqué : « ${note} »`,
    noticeNow: 'Que remarquez-vous maintenant ?',
    tooLarge: 'Choisissez un export de parcours Wonderlattice de moins de 2,4 Mo.',
    imported: 'Parcours importé. Votre parcours précédent a été remplacé.',
    invalid: 'Ce fichier n’est pas un export de parcours Wonderlattice valide. Votre parcours n’a pas changé.',
    thoughtSaved: 'Votre nouvelle pensée est enregistrée. Revenez-y quand vous voulez.',
  },
});

Wonderlattice.defineText('motion', 'fr', {
  eyebrow: 'GÉOMÉTRIE',
  name: 'Peindre avec le mouvement',
  tagline: 'Deux bras qui tournent et un stylo dessinent fleurs, étoiles et entrelacs.',
  presets: [
    {
      name: 'Fleur des champs',
      note: 'Six pétales, un seul trait',
      nudge: 'Essayez de passer de −5 à −5.1. Un tout petit écart donne à la fleur un tout autre avenir.',
    },
    {
      name: 'Orbite de soie',
      note: 'Une boucle dans une boucle',
      nudge: 'Affichez les bras en mouvement. Regardez comment chaque cercle simple s’ajoute à l’autre.',
    },
    {
      name: 'Étoilée',
      note: 'Une étoile aux bords adoucis',
      nudge: 'Rapprochez la portée du stylo de 50 %. Regardez les coins arrondis se changer en boucles profondes.',
    },
    {
      name: 'Lumière tissée',
      note: 'Le chemin des écoliers',
      nudge: 'Utilisez « Tout tracer » pour révéler l’entrelacs complet. Puis essayez −4 pour un cousin plus simple.',
    },
    {
      name: 'Presque un cercle',
      note: 'Un petit changement, une longue histoire',
      nudge: 'Deux vitesses presque égales se décalent lentement. Tracez tout pour voir leurs retrouvailles complètes.',
    },
    {
      name: 'Rubans',
      note: 'Trouver le rythme caché',
      nudge: 'Essayez un autre angle de départ. Le rythme reste le même pendant que le dessin tourne.',
    },
  ],
  paletteNames: ['Aurore', 'Braise', 'Glacier', 'Clair de lune'],
  names: {
    own: 'Votre propre orbite',
    surprise: 'Un heureux hasard',
    shared: 'Une orbite partagée',
  },
  nudges: {
    whole:
      'Essayez d’écarter la rotation d’un nombre entier. Regardez le tracé prendre un plus long chemin pour revenir.',
    traceAll: 'Essayez « Tout tracer » pour voir le motif entier. Ici, chaque réglage finit par refermer sa boucle.',
    surprise: 'Quelque chose de nouveau, rien que pour vous. Changez une chose et voyez où cela mène.',
    shared: 'Quelqu’un vous a laissé un motif. Changez une chose pour vous l’approprier.',
    revisit: 'Un motif familier peut encore réserver une surprise. Changez une chose et regardez à nouveau.',
  },
  status: {
    complete: 'La boucle est bouclée',
    oneTurn: 'Un tour. Tout un monde.',
    turns: (n) => `${n} ${n === 1 ? 'tour extérieur' : 'tours extérieurs'} avant les retrouvailles`,
  },
  explainStill:
    'Le bras intérieur garde sa direction pendant que le bras extérieur tourne. Le stylo trace un cercle décalé.',
  explain: (k, outer, inner, opposite) =>
    `À ${k}×, les deux bras reviennent à leur position de départ après ${outer} ${outer === 1 ? 'tour' : 'tours'} du bras extérieur et ${inner} ${inner === 1 ? 'tour' : 'tours'} du bras intérieur. ${opposite ? 'Ils tournent en sens opposés.' : 'Ils tournent dans le même sens.'}`,
  play: {
    pause: 'Pause',
    play: 'Lecture',
    replay: 'Rejouer',
  },
  focus: {
    enter: 'Agrandir le dessin',
    leave: 'Quitter la vue agrandie',
    title: 'Vue agrandie',
  },
  rotationRange: 'Choisissez une rotation entre −10 et 10.',
  saved: 'Votre dessin est prêt à être enregistré.',
  saveFailed: 'L’image n’a pas pu être enregistrée. Veuillez réessayer.',
  shareText: (k, r, p, ink) =>
    `Wonderlattice · Peindre avec le mouvement\nRotation intérieure : ${k}×\nPortée du stylo : ${r} %\nAngle de départ : ${p}°\nEncre : ${ink}`,
  linkCopied: 'Lien du motif copié.',
  settingsCopied: 'Réglages du motif copiés.',
  linkDescription: 'Copiez ce lien pour retrouver le même motif.',
  settingsDescription: 'Copiez ces réglages pour recréer votre motif.',
  guests: [
    {
      name: 'Emmy Noether',
      note: 'Une symétrie cachée peut révéler quelque chose qui ne change jamais.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Les cercles et les exponentielles partagent une danse plutôt élégante.',
    },
  ],
});

Wonderlattice.defineText('waves', 'fr', {
  eyebrow: 'ONDES · SON',
  name: 'Entendre la forme',
  tagline: 'Deux sons se combinent en battements, en silence et en un portrait qui boucle.',
  title: 'Entendre la forme.',
  subtitle: 'Deux sons. Un petit écart entre eux. Écoutez ce qui change.',
  field: 'Ondes · Rapports · Interférences',
  sceneLabel: 'Une conversation en ondes',
  sceneName: 'Deux sons, ensemble',
  tip: 'Modèle d’onde au ralenti · Le son est joué à sa vraie hauteur',
  actionLabel: 'Activer le son',
  canvasLabel:
    'Deux ondes sinusoïdales et leur signal combiné. Choisissez « Portrait en cercle » pour une deuxième représentation.',
  panelEyebrow: 'Écouter et regarder',
  whyLabel: 'Pourquoi cela se produit-il ?',
  nudge:
    'Essayez « Presque juste ». Écoutez le volume enfler puis retomber, à mesure que deux hauteurs voisines se décalent et se rattrapent.',
  connection: {
    html: '<strong>Les cercles deviennent des ondes.</strong> La hauteur d’un point qui tourne sur un cercle suit une onde sinusoïdale. Combinez des mouvements circulaires, et vous voilà de retour dans « Peindre avec le mouvement ».',
    label: 'Peindre avec ces idées',
  },
  presets: [
    {
      name: 'Une quinte juste',
      note: 'Un simple rapport 3:2.',
    },
    {
      name: 'Presque juste',
      note: 'Deux sons voisins créent une pulsation.',
    },
    {
      name: 'Le son du silence',
      note: 'Deux ondes identiques, décalées d’un demi-tour.',
    },
  ],
  soundOff: 'Activer le son',
  soundOn: 'Son activé · couper',
  noSound: 'Le son n’est pas disponible dans ce navigateur. Vous pouvez tout de même explorer les ondes.',
  firstTone: 'Premier son',
  secondTone: 'Second son',
  secondToneHint: 'Par rapport au premier son.',
  phase: 'Phase de départ',
  volume: 'Volume',
  hz: ' Hz',
  view: 'Une autre façon de voir',
  viewGroup: 'Vue des ondes',
  viewWaves: 'Additionner les ondes',
  viewPortrait: 'Portrait en cercle',
  beatDetail: (f, g, d) => `Vos sons : ${f} Hz et ${g} Hz. Leur différence de fréquence est de ${d} Hz.`,
  status: (f, g) => `${f} Hz + ${g} Hz`,
  labels: {
    a: (f) => `A · ${f} Hz`,
    b: (f) => `B · ${f} Hz`,
    sum: 'A + B · ENSEMBLE',
    firstTone: 'PREMIER SON →',
    secondTone: 'SECOND SON ↑',
  },
  guests: [
    {
      name: 'Jules Lissajous',
      note: 'Deux vibrations simples peuvent dessiner une boucle étonnamment élaborée.',
    },
    {
      name: 'Joseph Fourier',
      note: 'De nombreuses ondes simples peuvent se cacher dans un seul son compliqué.',
    },
  ],
  insight: {
    title: 'Quand les ondes se rencontrent.',
    html: `<p>Un son pur est une onde lisse qui se répète. Deux sons s’additionnent : à chaque instant, leurs déplacements se renforcent ou s’opposent. La ligne claire du bas est leur somme.</p>
<h3>Un rythme caché dans deux sons</h3>
<p>Quand deux fréquences sont proches, leur somme se renforce puis s’affaiblit tour à tour. Ces pulsations s’appellent des <em>battements</em>. Leur fréquence est la différence entre les deux fréquences.</p>
<div class="insight-visual" id="beat-detail"></div>
<h3>Deux sons peuvent faire du silence</h3>
<p>Choisissez « Le son du silence ». Deux ondes égales, décalées d’une demi-période, s’annulent dans ce mélange électronique. Dans le monde réel, l’annulation dépend de l’endroit où l’on écoute et de la façon dont les ondes nous parviennent.</p>
<h3>Regarder de côté</h3>
<p>Essayez « Portrait en cercle ». La première onde donne la position horizontale et la seconde la position verticale. La figure de Lissajous obtenue transforme une relation entre deux rythmes en une forme.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>A(t) = sin(2πft)<br>B(t) = sin(2πfrt + φ)<br>Le signal combiné est A(t) + B(t).</p><p>Le modèle au ralenti conserve le rapport des fréquences et la phase de départ. Les sons audibles sont joués aux hauteurs affichées. Les rapports simples se répètent vite ; des hauteurs voisines mais différentes produisent des battements.</p></details>
<div class="sources"><a class="source-link" href="https://www.physicsclassroom.com/class/sound/Lesson-3/Interference-and-Beats" target="_blank" rel="noopener">Explorer les interférences et les battements (en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('flock', 'fr', {
  eyebrow: 'ÉMERGENCE',
  name: 'Un esprit collectif',
  tagline: 'Pas de chef, juste des voisins : mettez une nuée en mouvement.',
  title: 'Un esprit collectif.',
  subtitle: 'Pas de chef. Juste des voisins. Mettez un petit monde en mouvement.',
  field: 'Systèmes dynamiques · Émergence',
  sceneLabel: 'Un monde de décisions locales',
  sceneName: 'Le collectif en mouvement',
  tip: 'Touchez ou faites glisser pour guider la nuée · Les flèches déplacent votre toucher, Échap le relâche · Les bords se rejoignent',
  actionLabel: 'Disperser la nuée',
  canvasLabel:
    'Une nuée de marques en mouvement. Touchez, faites glisser ou utilisez les flèches pour la guider. Appuyez sur Échap pour la relâcher.',
  panelEyebrow: 'Règles locales',
  whyLabel: 'Qui commande ?',
  nudge:
    'Baissez « Suivre la direction » jusqu’à zéro. Une foule peut-elle rester groupée sans s’accorder sur l’endroit où aller ?',
  connection: {
    html: '<strong>Un motif sans chef d’orchestre.</strong> Ici, toute une nuée naît de petites interactions. Dans « Entendre la forme », une nouvelle forme d’onde naît de l’addition de deux ondes plus simples.',
    label: 'Voir des ondes se combiner',
  },
  presets: [
    {
      name: 'En compagnie',
      note: 'Trouver une direction commune.',
    },
    {
      name: 'Chacun pour soi',
      note: 'Laisser les trajectoires individuelles l’emporter.',
    },
    {
      name: 'Rester proches',
      note: 'Ensemble, sans trop se mettre d’accord.',
    },
  ],
  align: 'Suivre la direction',
  cohesion: 'Rester ensemble',
  separate: 'Garder ses distances',
  influence: 'Votre toucher',
  attract: 'Attirer',
  repel: 'Repousser',
  trails: 'Laisser des traînées lumineuses',
  neighbors: 'Montrer un voisinage',
  agreement: 'Accord des directions',
  status: (n) => `${n} décisions individuelles`,
  guests: [
    {
      name: 'John Conway',
      credit: 'Thane Plambeck (recadrée)',
      note: 'Son jeu de la vie crée lui aussi des surprises à partir de minuscules règles locales.',
    },
    {
      name: 'Alan Turing',
      note: 'Son modèle de motifs a montré comment des changements locaux peuvent faire naître taches et rayures.',
    },
  ],
  insight: {
    title: 'Qui commande ?',
    html: `<p>Personne. Chaque marque ne regarde que ses proches voisines et suit trois tendances : éviter la cohue, s’aligner sur leur direction et rester près d’elles.</p>
<div class="insight-visual">Interactions individuelles → mouvement collectif</div>
<h3>Le motif vit entre les individus</h3>
<p>Aucune marque ne connaît la forme d’ensemble de la nuée. Un mouvement cohérent peut émerger parce que chacune réagit à une petite partie du groupe. Votre curseur ajoute une attraction ou une répulsion venue de l’extérieur.</p>
<h3>Un modèle, pas un animal entier</h3>
<p>Ceci est une version simplifiée du modèle Boids de Craig Reynolds. Il rend certaines qualités visuelles des vols d’oiseaux et des bancs de poissons, mais il n’explique pas chaque décision prise par de vrais oiseaux ou de vrais poissons.</p>
<h3>Voir par les yeux d’un seul</h3>
<p>Activez « Montrer un voisinage ». Le cercle indique jusqu’où un individu perçoit les autres ; des traits pointent vers les voisins qui l’influencent. Les bords opposés se rejoignent : un voisin peut donc être proche en passant par un bord.</p>
<details><summary>Que mesure l’« accord » ?</summary><p>On fait la moyenne de tous les vecteurs de direction unitaires, puis on prend la longueur du résultat. Près de 100 %, tout le monde pointe à peu près dans le même sens. Près de zéro, les directions s’annulent pour l’essentiel. C’est une description de la nuée à cet instant, pas un score.</p><p>Chaque étape combine séparation, alignement et cohésion, puis limite la vitesse. Tous les individus se mettent à jour à partir du même état précédent.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds et les Boids (en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('ribbon', 'fr', {
  eyebrow: 'TOPOLOGIE · 3D',
  name: 'Où est l’autre face ?',
  tagline: 'Donnez une demi-torsion à un ruban, et l’une de ses faces disparaît.',
  title: 'Où est l’autre face ?',
  subtitle: 'Faites tourner un ruban dans l’espace. Suivez son bord. Laissez une torsion vous surprendre.',
  field: 'Topologie · Surfaces · 3D',
  sceneLabel: 'Une bande ordinaire, un étrange voyage',
  sceneName: 'Le ruban de Möbius',
  tip: 'Faites glisser pour tourner · Les flèches ou les boutons de rotation tournent aussi la vue',
  actionLabel: 'Suivre le bord',
  canvasLabel: 'Un ruban en trois dimensions. Faites glisser ou utilisez les flèches pour le faire tourner.',
  panelEyebrow: 'Tourner et suivre',
  whyLabel: 'Où est passée l’autre face ?',
  nudge:
    'Suivez le voyageur doré. Avec une demi-torsion, il lui faut deux tours autour du trou pour revenir à son point de départ.',
  connection: {
    html: '<strong>Fabriquez-le.</strong> Prenez une bande de papier, donnez une demi-torsion à une extrémité, puis collez les deux bouts ensemble. Tracez une ligne en son milieu sans lever le stylo.',
    label: 'Suivre un autre genre de boucle',
  },
  presets: [
    {
      name: 'Sans torsion',
      note: 'Un anneau familier, avec deux bords.',
    },
    {
      name: 'Une demi-torsion',
      note: 'Une seule face continue. Un seul bord.',
    },
    {
      name: 'Une torsion complète',
      note: 'Les deux bords reviennent.',
    },
  ],
  twists: 'Tordre le ruban',
  twistOptions: ['Sans torsion · un anneau', 'Une demi-torsion · Möbius', 'Une torsion complète · un anneau'],
  width: 'Largeur du ruban',
  zoom: 'Regarder de plus près',
  spin: 'Le laisser tourner',
  walk: 'Montrer le voyageur',
  edges: 'Surligner les bords',
  turn: 'Tourner la vue',
  turnLeft: 'Tourner la vue vers la gauche',
  turnRight: 'Tourner la vue vers la droite',
  tiltUp: 'Incliner la vue vers le haut',
  tiltDown: 'Incliner la vue vers le bas',
  nameOneSided: 'Le ruban de Möbius',
  nameTwoSided: 'L’anneau tordu',
  statusOneSided: 'Une face · un bord',
  statusTwoSided: 'Deux faces · deux bords',
  showEdges: 'Suivre le bord',
  hideEdges: 'Masquer les bords',
  guests: [
    {
      name: 'August Möbius',
      note: 'Une seule demi-torsion fait de « l’autre face » une question piège.',
    },
    {
      name: 'Johann Listing',
      note: 'Il a lui aussi exploré les surfaces à une seule face. L’histoire retient plus d’un nom.',
    },
  ],
  insight: {
    title: 'Une torsion change le voyage.',
    html: `<p>Refermez une bande de papier en anneau : vous obtenez deux faces et deux bords séparés. Donnez une demi-torsion à une extrémité avant de la recoller, et quelque chose change : vous pouvez atteindre ce qui semblait être l’autre face sans franchir de bord.</p>
<div class="insight-visual">Le ruban de Möbius a une seule face continue et un seul bord, qui forme une boucle.</div>
<h3>Suivez le voyageur doré</h3>
<p>Le voyageur part à l’écart de la ligne médiane. Sur un ruban de Möbius, un tour autour du trou l’amène à la position opposée dans la largeur. Un deuxième tour le ramène au départ. Il ne saute jamais d’un bord à l’autre du ruban.</p>
<h3>Comptez les bords</h3>
<p>« Suivre le bord » met le bord en évidence. Avec une demi-torsion, les deux bords apparents forment une seule boucle continue. Sans torsion ou avec une torsion complète, ce sont deux boucles séparées, de couleurs différentes, l’une en pointillés.</p>
<h3>Une autre façon de voir les formes</h3>
<p>La topologie étudie les propriétés qui résistent quand on plie et qu’on étire sans déchirer. Faire tourner cet objet à l’écran change votre point de vue, mais il garde sa face unique.</p>
<details><summary>Comment la surface est-elle dessinée ?</summary><p>Pour un angle u et une coordonnée de largeur v :<br>x = (R + v cos(nu/2)) cos(u)<br>y = (R + v cos(nu/2)) sin(u)<br>z = v sin(nu/2)</p><p>n compte les demi-torsions. Un n impair donne un ruban de Möbius ; un n pair donne un anneau à deux faces. C’est une surface paramétrée projetée sur l’écran, dont les facettes sont triées par profondeur. Un ombrage translucide laisse voir le voyageur à travers la surface.</p></details>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/MoebiusStrip.html" target="_blank" rel="noopener">Explorer le ruban de Möbius (en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('traffic', 'fr', {
  eyebrow: 'THÉORIE DES JEUX',
  name: 'Le raccourci tentant',
  tagline: 'Une nouvelle route qui ralentit tous les conducteurs.',
  title: 'Le raccourci tentant.',
  subtitle: 'Une nouvelle route ressemble à un cadeau. Ouvrez-la et voyez ce qui se passe.',
  field: 'Réseaux · Théorie des jeux · Une petite surprise',
  sceneLabel: 'Une ville · Beaucoup de choix personnels',
  sceneName: 'La traversée de la ville',
  tip: 'Les points en mouvement montrent des proportions du trafic, pas des voitures individuelles',
  actionLabel: 'Ouvrir le raccourci',
  canvasLabel:
    'Un réseau routier à sens uniques. Ouvrez ou fermez le raccourci du milieu, et faites varier le nombre de conducteurs.',
  panelEyebrow: 'Changer une route',
  whyLabel: 'Comment est-ce possible ?',
  nudge:
    'Commencez avec 4 000 conducteurs. Ouvrez le raccourci. Puis essayez un trafic bien plus léger. La route est-elle toujours une mauvaise idée ?',
  connection: {
    html: '<strong>Des règles simples, un résultat inattendu.</strong> Dans « Un esprit collectif », une nuée forme un motif à partir d’interactions locales. Ici, chaque conducteur qui choisit un trajet rapide peut ralentir le trajet de tous.',
    label: 'Suivre une autre foule',
  },
  presets: [
    {
      name: 'Routes calmes',
      note: 'Le raccourci pourrait aider.',
    },
    {
      name: 'Une ville encombrée',
      note: 'Essayez la surprise.',
    },
    {
      name: 'Heure de pointe',
      note: 'Le raccourci peut-il cesser de compter ?',
    },
  ],
  demand: 'Conducteurs qui traversent la ville',
  demandHint: 'À quel point la ville est-elle encombrée ?',
  drivers: (n) => n.toLocaleString(Wonderlattice.lang),
  status: (open, minutes) => `${open ? 'Raccourci ouvert' : 'Raccourci fermé'} · ${minutes} min en ce moment`,
  open: 'Ouvrir le raccourci',
  close: 'Fermer le raccourci',
  before: 'Avant',
  after: 'Après ouverture',
  minutes: ' min',
  verdict: {
    closed: 'Ouvrez le raccourci pour découvrir le nouveau temps de trajet.',
    same: 'La nouvelle route ne change pas le temps de trajet.',
    slower: (minutes) => `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} de plus pour tout le monde.`,
    faster: (minutes) => `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} de moins pour tout le monde.`,
  },
  labels: {
    nodes: {
      start: 'S',
      north: 'A',
      south: 'B',
      end: 'T',
    },
    congestion: 'bouchons',
    fixed: '45 min',
    shortcutOpen: '0 min',
    shortcutClosed: 'fermé',
    caption: 'S → T · chacun prend son trajet le plus rapide',
  },
  guests: [
    {
      name: 'John von Neumann',
      note: 'La circulation est un jeu de choix, et un coup astucieux peut surprendre tout le monde.',
    },
    {
      name: 'John Nash',
      note: 'Ici, aucun conducteur ne peut faire mieux en changeant seul, même si tout le monde est plus lent.',
    },
  ],
  insight: {
    title: 'Pourquoi une nouvelle route peut-elle ralentir tout le monde ?',
    html: `<p>Avec 4 000 conducteurs et sans raccourci, le trafic se répartit à parts égales entre la route du haut et celle du bas. Chaque trajet dure 65 minutes. Ouvrez la liaison de zéro minute entre A et B, et chaque conducteur a une raison de l’emprunter. Tout le monde prend S → A → B → T, et chaque trajet dure 80 minutes.</p>
<div class="insight-visual">Un raccourci peut changer les choix des gens, et leurs choix changent les bouchons.</div>
<h3>Essayez une ville plus calme</h3>
<p>Déplacez le curseur de la demande vers 1 000. Le raccourci aide alors. Quand la demande est très forte, il n’est plus utilisé. Le paradoxe ne se produit que sur une partie de la plage.</p>
<h3>Ce que ce modèle suppose</h3>
<p>Chaque conducteur choisit pour lui-même un trajet le plus rapide. Leurs décisions combinées se stabilisent dans un équilibre où aucun conducteur ne peut gagner du temps en changeant seul de route. C’est un réseau simplifié à sens uniques, avec un raccourci gratuit et des temps de trajet qui ne dépendent que du flux de trafic. Les points en mouvement montrent la part du trafic sur chaque trajet, pas des décisions individuelles simulées, ni une prévision pour une vraie ville.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Les tronçons sujets aux bouchons coûtent x/100 minutes, où x est le nombre de conducteurs qui les empruntent. Les deux autres tronçons coûtent chacun 45 minutes ; le raccourci A → B ne coûte rien. Sans lui, le temps de trajet est de 45 + D/200 pour D conducteurs. Pour D = 4 000, cela fait 65 minutes. Avec lui, l’équilibre passe par la route du milieu et coûte 2D/100 = 80 minutes.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explorer le paradoxe de Braess (Easley &amp; Kleinberg, en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('loom', 'fr', {
  eyebrow: 'TISSAGE',
  name: 'Le métier à tisser mathématique',
  tagline: 'Changez une case d’une minuscule grille de oui et de non, et tout le tissu change.',
  title: 'Le métier à tisser mathématique.',
  subtitle: 'Choisissez quels fils se lèvent. Regardez le tissu naître d’une grille de oui et de non.',
  field: 'Tissage · Motifs binaires · Répétition',
  sceneLabel: 'Un métier à quatre cadres',
  sceneName: 'Du schéma au tissu',
  tip: 'À gauche : le schéma · À droite : son tissu · Cliquez sur l’attache pour la modifier, ou utilisez ses cases dans le panneau',
  tipStacked:
    'En haut : le schéma · En dessous : son tissu · Cliquez sur l’attache, ou utilisez ses cases dans le panneau',
  actionLabel: 'Surprenez-moi',
  canvasLabel:
    'Un schéma de tissage à côté du tissu qu’il produit. Modifiez l’attache en cliquant dessus ici, ou avec ses cases dans le panneau.',
  panelEyebrow: 'Préparer le métier',
  whyLabel: 'Comment une grille fait-elle du tissu ?',
  nudge:
    'Commencez par « Sergé », puis changez une case de l’attache. Chaque rang tissé avec cette pédale change d’un coup.',
  connection: {
    html: '<strong>Une petite règle, répétée partout.</strong> L’attache décide de chaque croisement dans le tissu. Dans « Un esprit collectif », de petites règles entre voisins façonnent toute une foule.',
    label: 'Visiter « Un esprit collectif »',
  },
  presets: [
    {
      name: 'Toile',
      note: 'Un fil dessus, un fil dessous.',
    },
    {
      name: 'Sergé',
      note: 'Une diagonale, comme le denim.',
    },
    {
      name: 'Pied-de-poule',
      note: 'Du sergé, avec quatre fils foncés et quatre clairs.',
    },
    {
      name: 'Des rayures, pas des carreaux',
      note: 'Alterner les couleurs dans les deux sens.',
    },
    {
      name: 'Œil-de-perdrix',
      note: 'En pointe dans les deux sens : de minuscules losanges.',
    },
    {
      name: 'Chevron',
      note: 'Le sergé revient sur lui-même.',
    },
  ],
  tieup: 'Quels cadres se lèvent pour chaque pédale (l’attache)',
  tieupHint:
    'Chaque cadre porte une partie des fils de chaîne, ceux qui vont dans la longueur. Une case allumée signifie que cette pédale lève ce cadre.',
  tieupCell: (pedal, shaft) => `La pédale ${pedal} lève le cadre ${shaft}`,
  treadleLabel: (n) => `Pédale ${n}`,
  shaftLabel: (n) => `Cadre ${n}`,
  threading: 'Ordre des fils',
  treadling: 'Ordre des pédales',
  orders: ['Suivi', 'En pointe', 'Brisé', 'Doublé'],
  warpColours: 'Fils de chaîne',
  weftColours: 'Fils de trame',
  colourOrders: ['Tout foncé', '4 et 4', 'En alternance', '2 et 2', 'Tout clair'],
  palette: 'Fil',
  palettes: ['Indigo et crème', 'Garance et or', 'Forêt et lin', 'Nuit et argent'],
  repeat: (across, down) =>
    across === 1 && down === 1 ? 'Une seule couleur partout' : `Motif de ${across} × ${down} fils`,
  float: (n) =>
    n === Infinity
      ? 'Ici, un fil ne s’entrecroise jamais. Ce tissu tomberait en morceaux.'
      : n === 1
        ? 'Chaque fil passe un dessus, un dessous : un tissu ferme.'
        : n <= 3
          ? `Les fils flottent par-dessus ${n} autres au plus : un tissu plus souple, plus fluide.`
          : `Des flottés de ${n} fils : longs et lâches, ils s’accrochent facilement.`,
  labels: {
    draft: 'SCHÉMA',
    cloth: 'TISSU',
  },
  guests: [
    {
      name: 'Ada Lovelace',
      note: 'Elle a décrit comment la machine de Babbage, pilotée par des cartes perforées comme un métier Jacquard, pourrait tisser des motifs algébriques.',
    },
  ],
  insight: {
    title: 'Une grille qui tisse.',
    html: `<p>Chaque tissu, ici, naît de trois courtes listes. L’<em>enfilage</em> dit dans lequel des quatre cadres passe chaque fil de chaîne (dans la longueur). L’<em>attache</em> dit quels cadres chaque pédale soulève. Le <em>pédalage</em> dit quelle pédale on enfonce à chaque passage de trame (en travers). Partout où un fil de chaîne levé croise la trame, la chaîne apparaît dessus.</p>
<div class="insight-visual">tissu = pédalage × attache × enfilage, un produit de grilles de 0 et de 1</div>
<h3>Petit changement, tissu entier</h3>
<p>Changez une case de l’attache, et chaque passage tissé avec cette pédale change d’un coup. C’est ainsi que les tisserands conçoivent sur papier : la grille à gauche de l’image est un vrai schéma de tissage.</p>
<h3>La couleur est un second motif</h3>
<p>Colorez aussi les fils, et l’armure se combine avec l’ordre des couleurs. Un sergé 2/2 avec quatre fils foncés et quatre clairs dans chaque sens donne du pied-de-poule. Une toile aux couleurs alternées donne des rayures, pas les carreaux auxquels on pourrait s’attendre.</p>
<h3>Les flottés tiennent le tissu</h3>
<p>Un fil qui passe par-dessus plusieurs autres sans s’entrecroiser forme un flotté. Des flottés courts font un tissu ferme ; des flottés longs le rendent souple et facile à accrocher. Un fil qui ne s’entrecroise jamais ne fait pas de tissu du tout.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Écrivez l’enfilage comme une grille H (le fil de chaîne j est sur le cadre s), l’attache comme U (la pédale t lève le cadre s) et le pédalage comme T (le passage i utilise la pédale t). Le tissu est D = T · U · Hᵀ, en arithmétique booléenne, où 1 + 1 = 1. Comme les trois listes se répètent, le tissu aussi : sa période divise le plus petit commun multiple des longueurs des listes et des ordres de couleurs.</p><p>Ce métier a quatre cadres et quatre pédales, comme beaucoup de métiers de table et de métiers à pédales. Un vrai tissu dépend aussi du fil, de l’espacement et de la tension, que cette image laisse de côté.</p></details>
<div class="sources"><a class="source-link" href="https://www.tandfonline.com/doi/abs/10.1080/0025570X.1980.11976845" target="_blank" rel="noopener">Satins et sergés : la géométrie des tissus (Grünbaum &amp; Shephard, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Houndstooth" target="_blank" rel="noopener">Comment se tisse le pied-de-poule (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/" target="_blank" rel="noopener">Ada Lovelace et le métier Jacquard (en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('storm', 'fr', {
  eyebrow: 'CORRECTION D’ERREURS',
  name: 'Une image dans la tempête',
  tagline: 'Quelques bits en plus, bien choisis, et une image se répare toute seule.',
  title: 'Une image dans la tempête.',
  subtitle: 'Dessinez une petite image. Envoyez-la à travers la tempête. Aidez-la à arriver intacte.',
  field: 'Codes · Information · Un peu de redondance',
  sceneLabel: 'Canal bruité',
  actionLabel: 'Renvoyer',
  canvasLabel:
    'Votre image, à gauche, voyage sous forme de bits à travers une tempête qui en inverse certains, et arrive à droite. Cliquez ou faites glisser sur votre image pour dessiner. Au clavier, déplacez-vous avec les flèches et appuyez sur Entrée pour peindre.',
  panelEyebrow: 'La protéger',
  whyLabel: 'Comment des bits peuvent-ils se réparer ?',
  nudge:
    'Comptez les dégâts sans protection. Puis essayez l’astuce de Hamming dans la même tempête. Quelle violence de tempête supporte-t-elle ?',
  connection: {
    html: '<strong>Des signaux qui voyagent.</strong> Ici, un message survit à un voyage bruité. Dans « Entendre la forme », deux sons voyagent ensemble et dessinent une forme que l’on peut entendre.',
    label: 'Visiter « Entendre la forme »',
  },
  yours: 'Votre image',
  storm: 'La tempête',
  arrived: 'Ce qui est arrivé',
  codes: ['Aucune protection', 'Le dire trois fois', 'Un bit de parité', 'L’astuce de Hamming'],
  codeLabel: 'Comment la protéger',
  codeHints: [
    'Chaque bit voyage seul.',
    'Trois copies de chaque bit, puis un vote.',
    'Un bit de contrôle pour quatre repère une inversion.',
    'Trois bits de contrôle pour quatre corrigent une inversion.',
  ],
  stormLabel: 'Force de la tempête',
  stormHint: 'La probabilité qu’un bit donné soit inversé.',
  pictureLabel: 'Choisissez une image, ou dessinez sur la vôtre',
  pictures: {
    heart: 'Cœur',
    smile: 'Sourire',
    invader: 'Extraterrestre',
    blank: 'Effacer',
  },
  tip: 'Orange : inversé · ○ réparé · ✕ encore faux',
  tipParity: 'Orange : inversé · pointillés : repéré comme abîmé · ✕ faux',
  sent: 'Bits envoyés',
  sentValue: (bits, extra) => `${bits} (+${extra} % en plus)`,
  badge: (extra) => `+${extra} %`,
  badgeNote: 'bits en plus',
  flipped: 'Inversés par la tempête',
  repaired: 'Réparés à l’arrivée',
  knownBad: 'Blocs repérés comme abîmés',
  wrong: 'Pixels encore faux',
  status: (wrong, flips) =>
    !flips
      ? 'Un ciel calme'
      : !wrong
        ? 'Tous les pixels sont arrivés'
        : wrong === 1
          ? '1 pixel faux'
          : `${wrong} pixels faux`,
  curveTitle: 'Pixels faux en moyenne, à mesure que la tempête forcit',
  about: (wrong) => `≈ ${wrong}`,
  curveLabel: (code, wrong) => `${code} : environ ${wrong} pixels faux en moyenne à cette force de tempête.`,
  calm: 'calme',
  wild: '20 %',
  presets: [
    {
      name: 'Aucune protection',
      note: 'Chaque inversion fait mal.',
    },
    {
      name: 'Le dire trois fois',
      note: 'Sûr, mais trois fois plus de bits.',
    },
    {
      name: 'L’astuce de Hamming',
      note: 'Presque aussi sûr, avec bien moins de bits.',
    },
  ],
  guests: [
    {
      name: 'Richard Hamming',
      note: 'Week-end après week-end, des erreurs arrêtaient son ordinateur. S’il sait repérer une erreur, se demanda-t-il, pourquoi ne pas la corriger ?',
    },
  ],
  insight: {
    title: 'Comment un message peut-il se réparer ?',
    html: `<p>Votre image fait 64 pixels, donc 64 bits : encre ou pas d’encre. La tempête inverse chaque bit avec une petite probabilité. Sans protection, chaque bit inversé donne un pixel faux, et le destinataire ne peut même pas savoir lesquels.</p>
<div class="insight-visual">Quelques bits en plus, bien choisis, permettent au destinataire de trouver et de corriger des erreurs qu’il n’a jamais vues se produire.</div>
<h3>Le dire trois fois</h3>
<p>Envoyez chaque bit trois fois et laissez le destinataire voter. Une inversion dans un triplet est mise en minorité, deux voix contre une. Ça marche, mais le message triple : 8 bits de plus pour 4.</p>
<h3>Un bit de parité</h3>
<p>Ajoutez un bit à chaque bloc de quatre pour que le nombre de 1 soit toujours pair. Si un seul bit s’inverse, le compte devient impair et le destinataire sait que le bloc est abîmé. Il ne peut pas savoir quel bit corriger, et deux inversions se compensent et passent inaperçues.</p>
<h3>L’astuce de Hamming</h3>
<p>Numérotez les sept bits d’un bloc de 1 à 7. Les bits aux positions 1, 2 et 4 sont des contrôles. Chaque contrôle maintient un compte pair sur les positions dont le numéro, écrit en binaire, le contient : le contrôle 1 surveille 1, 3, 5, 7 ; le contrôle 2 surveille 2, 3, 6, 7 ; le contrôle 4 surveille 4, 5, 6, 7. Quand un bit s’inverse, les numéros des contrôles qui échouent s’additionnent pour donner sa position. Si les contrôles 1 et 4 échouent, c’est la position 5 ; si aucun n’échoue, le bloc semble intact. Ainsi, tant qu’au plus un bit par bloc s’inverse, 3 bits de plus pour 4 suffisent à le réparer.</p>
<h3>Coût et protection</h3>
<p>Dans une tempête à 4 %, une image non protégée a en moyenne environ 2,6 pixels faux, avec trois copies environ 0,3, et avec l’astuce de Hamming environ 0,8, pour moins de la moitié des bits supplémentaires. La petite courbe du panneau le montre pour chaque force de tempête.</p>
<h3>Là où ça casse</h3>
<p>Ces codes supposent que chaque bit s’inverse indépendamment des autres. Les trois copies et l’astuce de Hamming promettent de corriger une inversion par bloc ; un bit de parité ne fait qu’avertir, et sans protection on n’a ni l’un ni l’autre. Deux inversions dans un même bloc de Hamming envoient le destinataire à la mauvaise position, et sa « réparation » aggrave les choses. Vers une tempête à 20 %, l’astuce de Hamming aide à peine ; un peu au-delà, elle nuit. Les vraies tempêtes arrivent en rafales : les vrais systèmes utilisent donc des codes plus longs et dispersent les bits de chaque bloc.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Pour des bits de données d1 d2 d3 d4 aux positions 3, 5, 6, 7, les contrôles sont c1 = d1 ⊕ d2 ⊕ d4, c2 = d1 ⊕ d3 ⊕ d4, c4 = d2 ⊕ d3 ⊕ d4, où ⊕ additionne des bits sans retenue. Le destinataire combine par XOR les positions qui contiennent un 1 ; le résultat, appelé syndrome, vaut 0 pour un bloc intact et donne la position inversée quand exactement un bit s’est inversé. Trois inversions peuvent se compenser pour donner 0 et passer inaperçues.</p><p>Si chaque bit s’inverse avec une probabilité p, un pixel envoyé seul est faux avec une probabilité p, et un pixel envoyé trois fois avec une probabilité 3p² − 2p³. Les courbes additionnent exactement toutes les combinaisons d’inversions possibles.</p></details>
<div class="sources"><a class="source-link" href="https://archive.org/details/bstj29-2-147" target="_blank" rel="noopener">L’article de Hamming de 1950 (en anglais)</a><a class="source-link" href="https://www.inference.org.uk/mackay/itila/" target="_blank" rel="noopener">MacKay, chapitre 1 : envoyer des images à travers le bruit (en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('sudoku', 'fr', {
  eyebrow: 'LOGIQUE · GRAPHES',
  name: 'Le sudoku en transparence',
  tagline: 'Un casse-tête de chiffres où les chiffres n’ont jamais compté.',
  title: 'Le sudoku en transparence.',
  subtitle: 'Placez une couleur et regardez les possibilités autour d’elle s’effacer en silence.',
  field: 'Logique · Coloration de graphes · Carrés latins',
  sceneLabel: 'Seize cases',
  tip: 'Tab pour aller à la grille · les flèches déplacent · les touches 1–4 placent · Retour arrière efface · Ctrl+Z annule',
  actionLabel: 'Faire une étape logique',
  canvasLabel:
    'Une grille de sudoku de quatre cases sur quatre. Chaque case vide montre les symboles qui peuvent encore y aller. La grille de cases posée sur cette image se joue au clavier.',
  boardLabel: 'Grille de sudoku, quatre sur quatre',
  panelEyebrow: 'Placer, annuler, regarder à nouveau',
  whyLabel: 'Pourquoi est-ce une histoire de coloriage ?',
  nudge:
    'Placez une couleur et regardez ses petites marques s’estomper le long de sa ligne, de sa colonne et de son bloc. Puis faites une étape logique. Êtes-vous d’accord avec sa raison ?',
  connection: {
    html: '<strong>Un autre réseau de voisins.</strong> Ici, chaque case limite les cases auxquelles elle est reliée. Dans la traversée de la ville, le choix de chaque conducteur change le trajet de tous.',
    label: 'Visiter « Le raccourci tentant »',
  },
  presets: [
    {
      name: 'Un début en douceur',
      note: 'Huit indices. Chaque étape mène à la suivante.',
    },
    {
      name: 'Une seule solution',
      note: 'Seulement quatre indices, et pourtant une seule réponse.',
    },
    {
      name: 'Deux réponses',
      note: 'Six indices, et de la place pour deux fins.',
    },
  ],
  styles: ['Couleurs', 'Formes', 'Chiffres'],
  styleHint: 'Même grille, nouvelles étiquettes. Seules les règles comptent.',
  styleLabel: 'Symboles',
  symbolWord: ['couleur', 'forme', 'chiffre'],
  symbolNames: [
    ['le bleu', 'l’orange', 'le rose', 'le vert'],
    ['le cercle', 'le carré', 'le triangle', 'le losange'],
    ['le 1', 'le 2', 'le 3', 'le 4'],
  ],
  unitNames: {
    row: 'cette ligne',
    col: 'cette colonne',
    box: 'ce bloc',
  },
  placeLabel: 'Placer dans la case choisie',
  placeButton: (name) => `Placer ${name}`,
  faded: (word) => `Les ${word}s estompé${word === 'chiffre' ? 's' : 'es'} ne peuvent pas aller ici.`,
  clash: 'en conflit ici',
  undo: 'Annuler',
  clear: 'Vider la case',
  network: 'Montrer le réseau',
  filled: 'Remplies',
  candidatesLeft: 'Candidats',
  waysToFinish: 'Réponses',
  none: 'aucune',
  twoFinishes: 'Le solveur a trouvé les deux fins. Elles ne diffèrent que par les cases entourées.',
  answerLabel: (n) => `Fin ${n}`,
  status: (filled) => `${filled} sur 16 remplies`,
  networkCaption: '16 cases · 56 liens · deux cases liées ne sont jamais pareilles',
  start: (word) => `Touchez une case vide, puis choisissez ${word === 'chiffre' ? 'un' : 'une'} ${word}.`,
  placed: (name, n) =>
    n === 0
      ? `${name.charAt(0).toUpperCase() + name.slice(1)} est placé. Rien autour n’a eu besoin de changer.`
      : `${name.charAt(0).toUpperCase() + name.slice(1)} est placé. Il ne peut plus aller dans ${n} ${n === 1 ? 'case voisine' : 'cases voisines'}.`,
  clashed: (name) => `Deux voisines contiennent maintenant toutes les deux ${name}. Annulez, ou essayez autre chose.`,
  given: 'Celle-ci était fournie avec la grille. Essayez une case vide.',
  cleared: 'Case vidée. Ses possibilités reviennent.',
  undone: 'Un pas en arrière.',
  naked: (name) => `Seul ${name} convient ici : sa ligne, sa colonne et son bloc contiennent les trois autres.`,
  hidden: (name, unit) => `Dans ${unit}, ${name} n’a plus qu’une place possible.`,
  stuckTwo: 'Rien n’est imposé maintenant. Les cases entourées peuvent s’échanger, et les deux fins marchent.',
  stuckOne: 'Aucune étape n’est imposée ici. Tentez une supposition, et annulez si elle tourne mal.',
  stuckNone: 'Cette grille ne peut plus être terminée. Annulez une étape ou deux.',
  clashFirst: 'Deux voisines partagent un symbole. Annulez ou videz d’abord l’une des cases qui brillent.',
  solved: (word) => `Terminé. Chaque ligne, chaque colonne et chaque bloc contient chaque ${word} une fois.`,
  fresh: 'Une grille toute neuve.',
  describe: (row, col, content) => `Ligne ${row}, colonne ${col}, ${content}`,
  holds: (name, given) => (given ? `${name}, un indice` : name),
  emptyWith: (names) => `vide, peut recevoir ${names.join(' ou ')}`,
  emptyNone: 'vide, rien ne convient',
  guest: {
    name: 'Leonhard Euler',
    note: 'Un sudoku terminé est un carré latin, plus une règle pour les blocs. Mes 36 officiers demandaient deux carrés latins à la fois, ce qui s’est révélé impossible.',
  },
  insight: {
    title: 'Pourquoi le sudoku est-il une histoire de coloriage ?',
    html: `<p>Rien, dans le sudoku, n’exige des chiffres. La seule règle est que deux cases d’une même ligne, d’une même colonne ou d’un même bloc doivent être différentes. Couleurs, formes ou chiffres fonctionnent exactement pareil : c’est pourquoi changer de symboles ne change jamais la grille.</p>
<div class="insight-visual">Un sudoku est une carte à colorier. Sur cette grille, chaque case a sept voisines, et elle doit différer de toutes.</div>
<h3>Contraintes</h3>
<p>Chaque case appartient à une ligne, une colonne et un bloc. Ces groupes se chevauchent, si bien qu’un seul placement porte loin : il retire d’un coup une possibilité à jusqu’à sept autres cases. Les marques qui s’estompent montrent exactement lesquelles.</p>
<h3>Candidats et singletons</h3>
<p>Les petites marques d’une case vide sont ses candidats : les symboles qu’aucune de ses voisines ne contient encore. Quand il ne reste qu’une marque, la case est imposée (un « singleton nu »). Quand un symbole n’a plus qu’une case possible dans une ligne, une colonne ou un bloc, il doit y aller (un « singleton caché »). « Faire une étape logique » n’utilise que ces deux idées, et montre toujours pourquoi.</p>
<h3>Un graphe à colorier</h3>
<p>Activez le réseau. Chaque case devient un point, et un trait relie deux points dès que leurs cases partagent une ligne, une colonne ou un bloc : 16 points et 56 traits. Remplir la grille revient à donner à chaque point l’une de quatre couleurs de sorte qu’aucun trait ne relie deux points de même couleur, un peu comme on colorie une carte pour que des pays voisins soient différents. Les mathématiciens appellent cela une coloration propre d’un graphe.</p>
<h3>Pourquoi une bonne grille a exactement une réponse</h3>
<p>Les indices sont une coloration déjà commencée. Une grille bien faite a juste assez d’indices pour qu’il ne reste qu’une seule façon de la terminer : chaque étape peut alors se raisonner au lieu de se deviner. Sur une grille 4×4, il faut au moins quatre indices pour y parvenir. Avec moins, un choix reste toujours ouvert. « Deux réponses » a six indices, mais quatre cases forment un rectangle dont les deux couleurs peuvent s’échanger, et le solveur trouve les deux fins.</p>
<h3>La grille en taille réelle</h3>
<p>Le sudoku du journal repose sur la même idée à plus grande échelle : 81 cases, chacune avec 20 voisines, 810 traits et neuf couleurs. Il existe 288 grilles 4×4 complètes, mais environ 6,7 × 10<sup>21</sup> grilles 9×9 complètes. Le plus petit nombre d’indices pouvant donner une réponse unique à une grille 9×9 est 17, un fait établi par une vaste recherche informatique.</p>
<h3>Carrés latins</h3>
<p>Une grille où chaque symbole apparaît une fois dans chaque ligne et chaque colonne s’appelle un carré latin. Leonhard Euler les a étudiés, notamment dans son problème des 36 officiers : six grades et six régiments, disposés de sorte que chaque ligne et chaque colonne contienne chaque grade et chaque régiment une fois. Tout sudoku terminé est un carré latin avec une règle de plus pour ses blocs.</p>
<details><summary>Ce que fait cette salle, et ce qu’elle laisse de côté</summary><p>Les candidats n’utilisent ici que l’élimination directe : un symbole est exclu quand une voisine le contient déjà. L’étape logique connaît deux sortes de déductions, les singletons nus et cachés ; les grilles plus difficiles en demandent davantage. Le nombre de façons de terminer vient d’une petite recherche par retour sur trace. Elle essaie chaque possibilité dans la case vide la plus contrainte et s’arrête dès qu’elle a trouvé deux fins. Herzberg et Murty comptent les façons de prolonger une coloration partielle à l’aide d’un polynôme chromatique : une grille a une solution unique exactement quand ce nombre vaut 1. Cette salle a seulement besoin de distinguer aucune, une et deux.</p></details>
<div class="sources"><a class="source-link" href="https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf" target="_blank" rel="noopener">Sudoku Squares and Chromatic Polynomials (Herzberg &amp; Murty, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku" target="_blank" rel="noopener">Les mathématiques du sudoku (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Thirty-six_officers_problem" target="_blank" rel="noopener">Les 36 officiers d’Euler (en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('dice', 'fr', {
  eyebrow: 'DÉNOMBREMENT',
  name: 'Les dés qui se battent entre eux',
  tagline: 'Choisissez n’importe quel dé. Il y en a toujours un qui le bat.',
  title: 'Les dés qui se battent entre eux.',
  subtitle: 'Choisissez un dé. Je choisirai après vous.',
  field: 'Probabilités · Dénombrement · Une petite surprise',
  sceneLabel: 'Des dés bizarres · Un cercle',
  tip: 'Touchez un dé dans le cercle, ou appuyez sur ← et →, pour choisir le vôtre · Chaque flèche va du gagnant au perdant',
  actionLabel: 'Lancer 100 fois',
  canvasLabel:
    'Deux dés lancés l’un contre l’autre, le décompte des victoires, la part de victoires au fil des lancers, et un cercle de flèches qui montre quel dé bat le plus souvent quel autre. Touchez un dé dans le cercle, ou utilisez les flèches gauche et droite, pour choisir votre dé.',
  panelEyebrow: 'Choisir, puis lancer',
  whyLabel: 'Comment chaque dé peut-il perdre ?',
  nudge:
    'Essayez chaque dé tour à tour. À chaque fois, j’en trouve un qui bat le vôtre. Existe-t-il un dé que je ne peux pas battre ?',
  connection: {
    html: '<strong>L’intuition, doucement renversée.</strong> Ici, « meilleur » tourne en rond. En ville, une toute nouvelle route peut rendre chaque trajet plus lent.',
    label: 'Essayer « Le raccourci tentant »',
  },
  sets: ['Trois dés · 5/9', 'Les quatre dés d’Efron · 2/3', 'Les dés de Grime · un retournement'],
  sceneNames: ['Choisir en premier', 'Les quatre d’Efron', 'Les dés de Grime'],
  twoEach: (name) => `${name} · deux de chaque`,
  marks: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['R', 'B', 'O'],
  ],
  names: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['Rouge', 'Bleu', 'Olive'],
  ],
  setLabel: 'Jeu de dés',
  youLabel: 'Votre dé',
  rivalLabel: 'Mon dé',
  letMe: 'Laissez-moi choisir',
  pairs: 'Lancer deux de chaque et additionner',
  speed: 'Lancers par seconde',
  speedHint: 'Assez lent pour regarder, ou assez rapide pour trancher.',
  faces: (list) => list.join(' '),
  pickDie: (name, list) => `Dé ${name} : ${list.join(', ')}`,
  you: 'Vous',
  me: 'Moi',
  vs: 'contre',
  iTake: (you, me) => `Vous avez choisi ${you}. Je prends ${me}.`,
  against: (you, me) => `${you} contre ${me}. Vous avez choisi les deux.`,
  ready: 'Prêt à lancer',
  rolls: (n) => (n <= 1 ? `${n} lancer` : `${n.toLocaleString(Wonderlattice.lang)} lancers`),
  circleTitle: 'Le cercle des victoires',
  even: 'à égalité',
  winsTitle: 'Victoires',
  latestTitle: 'Derniers lancers, du plus récent au plus ancien',
  ties: (n) => (n <= 1 ? `${n} égalité` : `${n} égalités`),
  shareTitle: (name) => `Part des victoires de ${name}`,
  exactLabel: (fraction) => `exactement ${fraction}`,
  startHint: 'Appuyez sur « Lancer 100 fois »',
  rollsSoFar: 'Lancers jusqu’ici',
  winsLine: (you, me, a, b) => `Vous (${you}) ${a} · Moi (${me}) ${b}`,
  seenLine: (name, seen, fraction, exact) =>
    `${name} gagne : ${seen === null ? '–' : seen + ' %'} jusqu’ici · exactement ${fraction} ≈ ${exact} %`,
  verdictStart: (favourite, fraction) =>
    `En théorie, ${favourite} gagne exactement ${fraction} des parties. Lancez pour le voir se produire.`,
  verdict: (n, favourite, seen, fraction) =>
    `Après ${n.toLocaleString(Wonderlattice.lang)} lancers, ${favourite} a gagné ${seen} % des parties. La probabilité exacte est ${fraction}.`,
  evenVerdict: 'Ces deux-là sont à égalité.',
  sameDie: 'Le même dé des deux côtés : égalité parfaite.',
  presets: [
    {
      name: 'Choisir en premier',
      note: 'Je choisis après vous.',
      badge: '5/9',
    },
    {
      name: 'Les quatre d’Efron',
      note: 'Quatre dés, un cercle.',
      badge: '2/3',
    },
    {
      name: 'Deux de chaque',
      note: 'Doublez les dés, le cercle s’inverse.',
      badge: '↺',
    },
  ],
  guests: [
    {
      name: 'Blaise Pascal',
      note: 'Un problème de dés posé par un joueur lui est parvenu. Sa correspondance avec Fermat, en 1654, a marqué le début des mathématiques du hasard.',
    },
  ],
  gridAxes: (me, you) =>
    `Les lignes sont mon dé, ${me} ; les colonnes sont votre dé, ${you}. Chaque case prend la couleur de son gagnant.`,
  gridNote: (win, lose, tie, total, me, you) =>
    `${me} gagne ${win} des ${total.toLocaleString(Wonderlattice.lang)} combinaisons également probables, ${you} en gagne ${lose}` +
    (tie ? `, et ${tie} ${tie === 1 ? 'est une égalité' : 'sont des égalités'}.` : '.'),
  insight: {
    title: 'Comment chaque dé peut-il perdre ?',
    html: `<p>Comptez au lieu de deviner. Chaque dé a six faces, donc deux dés peuvent tomber de 6 × 6 = 36 façons également probables. Prenez A (2, 2, 4, 4, 9, 9) contre B (1, 1, 6, 6, 8, 8). Les deux 9 de A battent les six faces de B : 12 façons. Les 2 et les 4 de A ne battent que les deux 1 de B : 4 × 2 = 8 de plus. Cela fait 20 sur 36 pour A, soit 5/9. Le même calcul montre que B bat C, et que C bat A.</p>
<canvas id="dice-grid" class="dice-grid" aria-hidden="true"></canvas>
<p id="dice-grid-note"></p>
<div class="insight-visual">A bat B, B bat C, et C bat A. « Bat le plus souvent » ne se range pas en file indienne : celui qui choisit en second peut donc toujours trouver un dé gagnant.</div>
<h3>Meilleur en moyenne ne veut pas dire gagner le plus souvent</h3>
<p>Les trois dés du premier jeu ont tous une moyenne d’exactement 5. Dans le jeu d’Efron, C (6, 6, 2, 2, 2, 2) a la plus forte moyenne, 3⅓, et pourtant il perd deux fois sur trois contre B, qui affiche toujours 3. Une moyenne tient compte de l’ampleur de chaque victoire ; « gagner le plus souvent » ne compte que leur fréquence.</p>
<h3>Deux de chaque renverse le cercle</h3>
<p>Avec les dés rouge, bleu et olive de James Grime, un dé chacun, le rouge bat le bleu, le bleu bat l’olive et l’olive bat le rouge. Lancez-en deux de chaque et additionnez : toutes les flèches s’inversent. Le bleu bat le rouge, l’olive bat le bleu, et le rouge bat l’olive. Additionner deux dés change les totaux probables, et cela change qui gagne le plus souvent.</p>
<h3>Ce que cela suppose</h3>
<p>Des dés équilibrés : chaque face est également probable, et chaque lancer est indépendant des autres. Ici, les lancers viennent d’un générateur de nombres pseudo-aléatoires. Quelques dizaines de lancers peuvent s’écarter beaucoup de la probabilité exacte. L’écart typique diminue lentement, comme un sur la racine carrée du nombre de lancers : environ 5 % après 100 lancers, environ 0,5 % après 10 000.</p>
<details><summary>Existe-t-il un dé que personne ne bat ?</summary><p>Pas dans ces jeux. Chaque dé en a un autre qui le bat plus d’une fois sur deux. C’est ce que veut dire « non transitif » : « battre » ne se transmet pas le long d’une chaîne comme « être plus grand que ». Dans le jeu d’Efron, la meilleure réponse de la salle gagne deux fois sur trois, quel que soit votre choix.</p></details>
<div class="sources"><a class="source-link" href="https://nrich.maths.org/problems/non-transitive-dice?tab=teacher" target="_blank" rel="noopener">NRICH : dés non transitifs (en anglais)</a><a class="source-link" href="https://www.scientificamerican.com/article/mathematical-games-1970-12/" target="_blank" rel="noopener">Martin Gardner sur les dés d’Efron (1970, en anglais)</a><a class="source-link" href="http://singingbanana.com/dice/article.htm" target="_blank" rel="noopener">Les dés de James Grime (une numérotation antérieure, avec les mêmes probabilités ; en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('cube', 'fr', {
  eyebrow: 'MOUVEMENTS · GROUPES',
  name: 'Au cœur du cube casse-tête',
  tagline:
    'Deux rotations dans un autre ordre, un mouvement à répéter 105 fois pour revenir au départ, et des pièces qui bougent à peine.',
  title: 'Au cœur du cube casse-tête.',
  subtitle: 'Oubliez la résolution. Jouez avec les mouvements eux-mêmes et voyez comment ils se combinent.',
  field: 'Groupes · Ordre · Annulation',
  sceneLabel: 'Un cube de mouvements',
  tip: 'Faites glisser, ou utilisez les flèches, pour tourner la vue',
  actionLabel: 'Le répéter',
  actionCompare: 'Les tourner',
  canvasLabel:
    'Un cube casse-tête. Utilisez les boutons de mouvement pour tourner ses faces ; faites glisser ou utilisez les flèches pour tourner la vue.',
  panelEyebrow: 'Combiner des mouvements',
  whyLabel: 'Pourquoi l’ordre compte-t-il ?',
  nudge:
    'Essayez « Retour au départ », puis « Répéter jusqu’au retour ». Combien de répétitions pariez-vous avant qu’il y arrive ?',
  connection: {
    html: '<strong>Des règles qu’on peut combiner et défaire.</strong> Un mouvement du cube est une règle qui dit où va chaque autocollant. Dans la salle du sudoku, des règles entre voisins décident où chaque couleur peut aller.',
    label: 'Visiter le sudoku',
  },
  sceneName: {
    one: 'Un cube',
    compare: 'Deux ordres',
  },
  modes: ['Un cube', 'Comparer deux ordres'],
  mode: 'Ce que vous explorez',
  faces: {
    U: 'du haut',
    R: 'de droite',
    F: 'avant',
    D: 'du bas',
    L: 'de gauche',
    B: 'arrière',
  },
  turn: (face, prime) => `tourner la face ${face} dans le sens ${prime ? 'antihoraire' : 'horaire'}`,
  moveLabel: (name, turn) => `${name} : ${turn}`,
  movePad: 'Construire une séquence',
  notation:
    'U = haut (up), R = droite (right), F = avant (front), D = bas (down), L = gauche (left), B = arrière (back) ; ′ tourne dans l’autre sens.',
  undo: 'Annuler',
  clear: 'Effacer',
  home: 'Répéter jusqu’au retour',
  highlight: 'Ne montrer que ce qui a bougé',
  first: 'Premier mouvement',
  second: 'Second mouvement',
  sequence: (text) => (text ? text : 'Aucun mouvement pour l’instant : appuyez sur une face'),
  times: (n) => (n === 1 ? 'fait une fois' : n === 0 ? 'pas encore fait' : `fait ${n} fois`),
  order: (n) => (n === 1 ? 'Rien à défaire : le cube ne bouge pas.' : `Revient au départ après ${n} répétitions.`),
  moved: (n) => (n === 0 ? 'Chaque pièce est à sa place.' : n === 1 ? '1 pièce déplacée.' : `${n} pièces déplacées.`),
  status: (n) => (n === 0 ? 'Résolu' : n === 1 ? '1 pièce déplacée' : `${n} pièces déplacées`),
  landed: (moved, done, order) =>
    (moved === 0
      ? 'Résolu. '
      : `Fait ${done === 1 ? 'une fois' : `${done} fois`}. ${moved} ${moved === 1 ? 'pièce déplacée' : 'pièces déplacées'}. `) +
    (order === 1 ? 'Le cube ne bouge pas.' : `Revient au départ après ${order} répétitions.`),
  full: 'Cela fait douze mouvements : répétez, annulez ou effacez.',
  restarted: 'Une nouvelle séquence commence ici.',
  compareLabels: (a, b) => [`${a} puis ${b}`, `${b} puis ${a}`],
  compareSame: 'Ces deux-là commutent : les deux ordres donnent le même cube.',
  compareDiffer: (n) =>
    `Mêmes deux mouvements, ordre différent : ${n} autocollants finissent à des places différentes.`,
  compareReady: 'Appuyez sur « Les tourner » pour faire les deux mouvements sur chaque cube.',
  presets: [
    {
      name: 'L’ordre compte',
      note: 'Droite puis haut, ou haut puis droite ?',
    },
    {
      name: 'Retour au départ',
      note: 'Répétez R U encore et encore.',
    },
    {
      name: 'Seules quelques pièces bougent',
      note: 'R U R′ U′, un commutateur.',
    },
    {
      name: 'Défaire à rebours',
      note: 'Pour défaire, inversez l’ordre.',
    },
  ],
  guests: [
    {
      name: 'Évariste Galois',
      note: 'Mort à vingt ans, il a laissé les débuts de la théorie des groupes : les mathématiques de la combinaison et de l’annulation.',
    },
  ],
  insight: {
    title: 'Des mouvements qu’on peut combiner et défaire.',
    html: `<p>Ce cube fonctionne comme le casse-tête Rubik’s Cube®, mais ici on joue avec ses mouvements au lieu de le résoudre. Voyez un mouvement du cube comme une règle : chaque autocollant va à une nouvelle place. Faire un mouvement puis un autre combine deux règles en une nouvelle. Chaque mouvement peut être défait. Et ne rien faire du tout est aussi un mouvement. Les mathématiciens appellent un ensemble de ce genre un <em>groupe</em>.</p>
<div class="insight-visual">R puis U, ce n’est pas U puis R. L’ordre compte.</div>
<h3>Défaire à rebours</h3>
<p>Pour défaire « R puis U », on défait d’abord le dernier mouvement : U′, puis R′. Comme quand on enlève ses chaussures puis ses chaussettes, on défait dans l’ordre inverse.</p>
<h3>Tout finit par revenir</h3>
<p>Répétez n’importe quelle séquence, et le cube finit par revenir à son point de départ, car il n’y a qu’un nombre fini de positions. R U demande 105 répétitions. R U R′ U′ n’en demande que 6. Aucune séquence n’en demande plus de 1 260.</p>
<h3>Des mouvements qui bougent à peine</h3>
<p>« Faire A, faire B, défaire A, défaire B » est un <em>commutateur</em>. Si A et B n’avaient aucun effet l’un sur l’autre, il ne ferait rien du tout. Comme ils ne se chevauchent qu’un peu, il ne dérange que quelques pièces : R U R′ U′ en déplace sept sur vingt-six. Les adeptes du cube utilisent les commutateurs pour arranger quelques pièces sans gâcher le reste.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Chaque mouvement est une permutation des 54 autocollants. Combiner des mouvements revient à composer des permutations. Une séquence revient au départ après le plus petit commun multiple des longueurs de ses cycles d’autocollants. R U déplace les autocollants le long de cycles de 3, 7 et 15 places, et le plus petit commun multiple de 3, 7 et 15 est 105.</p><p>Le cube a 43 252 003 274 489 856 000 positions, et chacune peut être résolue en 20 mouvements au plus, en comptant chaque rotation d’une face, quart ou demi-tour, comme un mouvement. Cela a été prouvé en 2010, au prix de beaucoup de temps de calcul.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Rubik%27s_Cube_group" target="_blank" rel="noopener">Le groupe des mouvements du cube (en anglais)</a><a class="source-link" href="https://www.cube20.org/" target="_blank" rel="noopener">Le nombre de Dieu est 20 (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Galois/" target="_blank" rel="noopener">Évariste Galois (en anglais)</a></div>`,
  },
});

Wonderlattice.defineText('sample', 'fr', {
  eyebrow: 'ÉCHANTILLONNAGE',
  name: 'Une cuillerée de ville',
  tagline: 'Un énorme sondage peut être sûr de lui et se tromper. Un petit sondage au hasard tombe à peu près juste.',
  title: 'Une cuillerée de ville.',
  subtitle: 'Orange ou bleu : que préfère la ville entière ? Vous ne pouvez interroger qu’une partie des habitants.',
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
      : `Ils disent que ${mean} % préfèrent l’orange, à ${spread} points près.`,
  theoryLine: (n, se) =>
    `Un échantillon aléatoire de ${n.toLocaleString(Wonderlattice.lang)} personnes fluctue d’environ ±${se} points.`,
  truthHidden: 'La réponse de la ville entière est cachée.',
  truthLine: (pct, miss) =>
    miss === null
      ? `La ville entière : ${pct} % d’orange.`
      : `La ville entière : ${pct} % d’orange. Écart typique : ${miss} points.`,
  randomNote: 'N’importe qui dans la ville peut être interrogé.',
  hoodNote: (size, name) => `${size.toLocaleString(Wonderlattice.lang)} personnes habitent à ${name}.`,
  hoodAll: (size, name) =>
    `Seulement ${size.toLocaleString(Wonderlattice.lang)} personnes habitent à ${name} : chaque sondage interroge donc tout le monde là-bas.`,
  volunteerNote: (answer, total) =>
    `Seuls ceux qui répondent comptent : ${answer.toLocaleString(Wonderlattice.lang)} sur ${total.toLocaleString(Wonderlattice.lang)}. Les fans d’orange répondent plus volontiers.`,
  volunteerAll: (answer) =>
    `Seules ${answer.toLocaleString(Wonderlattice.lang)} personnes répondent un jour : chaque sondage les entend donc toutes.`,
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
    `Dans votre ville, un échantillon aléatoire de ${n.toLocaleString(Wonderlattice.lang)} personnes fluctue d’environ ±${se} points. ` +
    `Interroger seulement à ${hood} donne un écart de ${hoodOff} points, et compter ceux qui répondent un écart de ${answerOff}, quel que soit le nombre de personnes interrogées.`,
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

Wonderlattice.defineText('plane', 'fr', {
  eyebrow: 'NOMBRES COMPLEXES',
  name: 'Courber le plan',
  tagline: 'Courbez une image sans la déchirer ; un cercle devient une aile.',
  title: 'Courber le plan.',
  subtitle:
    'Faites passer une image par une fonction complexe. Tout le plan se courbe, mais les minuscules angles droits restent droits.',
  field: 'Nombres complexes · Transformations conformes · Ailes',
  sceneLabel: 'Le plan, courbé',
  tip: 'Faites glisser la boussole de gauche, ou déplacez-la avec les flèches · Sa jumelle, à droite, montre l’étirement et la rotation',
  tipStacked:
    'Faites glisser la boussole dans l’image du haut, ou utilisez les flèches · Sa jumelle, en dessous, montre l’étirement et la rotation',
  actionLabel: 'Courber',
  canvasLabel:
    'Deux copies du plan. Dans la première, une image et une petite boussole faite de deux flèches perpendiculaires ; dans la seconde, leurs images par la fonction complexe choisie. Faites glisser la boussole, ou déplacez-la avec les flèches.',
  panelEyebrow: 'Choisir une courbure',
  whyLabel: 'Pourquoi les angles droits survivent-ils ?',
  nudge:
    'Mettez le plan au carré, puis faites glisser la boussole tout au centre. Qu’arrive-t-il à sa jumelle à cet endroit ?',
  connection: {
    html: '<strong>Courber sans déchirer.</strong> Ici, une fonction courbe tout le plan en gardant ses minuscules angles. Dans « Où est l’autre face ? », une bande se courbe en une surface qui n’a qu’une seule face.',
    label: 'Visiter « Où est l’autre face ? »',
  },
  functions: ['Carré · z²', 'Retournement · 1/z', 'Enroulement · eᶻ', 'Vague · sin z', 'Aile · z + 1/z'],
  formulas: ['w = z²', 'w = 1/z', 'w = eᶻ', 'w = sin z', 'w = z + 1/z'],
  pictures: ['Une grille carrée', 'Un poisson', 'Un visage', 'Cercles et rayons', 'Le cercle de l’aile'],
  functionLabel: 'Fonction',
  pictureLabel: 'Image',
  bendLabel: 'Courbure',
  thickLabel: 'Épaisseur',
  camberLabel: 'Cambrure',
  gridLabel: 'Afficher une grille discrète derrière',
  flowLabel: 'Montrer l’air qui s’écoule autour',
  at: 'La boussole en',
  stretch: 'Étirement à cet endroit',
  stretchMath: '(|f′(z)|)',
  turn: 'Rotation à cet endroit',
  turnMath: '(arg f′(z))',
  point: (x, y) => `${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i`.replace(/^-/, '−'),
  times: (x) => `${x}×`,
  degrees: (d) => `${d < 0 ? '−' : ''}${Math.abs(d)}°`,
  none: '–',
  status: (stretch, turn) => `×${stretch} · rotation ${turn}`,
  statusCritical: 'Ici f′ = 0',
  statusPole: 'Un pôle : f = ∞',
  announceCritical: 'f′ = 0 ici : les angles doublent',
  announcePole: 'Un pôle : la fonction est infinie ici',
  keeps: 'Les flèches de la jumelle se croisent toujours à angle droit.',
  critical: 'Ici f′ = 0. Les flèches de la jumelle rétrécissent jusqu’à disparaître, et les angles doublent.',
  pole: 'Ici f est infinie : c’est un pôle. La jumelle s’est envolée hors de la carte.',
  away: 'Sa jumelle est sortie du cadre de l’image courbée.',
  blending: 'Courbure partielle : un mélange de z et de f(z), pour aider l’œil.',
  zLabel: 'z',
  wLabel: 'w',
  bent: (formula, percent) => `${formula} · courbé à ${percent} %`,
  criticalMark: 'f′ = 0',
  poleMark: 'pôle',
  presets: [
    {
      name: 'Mettre le plan au carré',
      note: 'Les angles doublent au centre.',
    },
    {
      name: 'Retourner le plan',
      note: 'Les droites deviennent des cercles.',
    },
    {
      name: 'L’enrouler',
      note: 'Les droites deviennent des cercles et des rayons.',
    },
    {
      name: 'Un poisson au carré',
      note: 'Déformé de partout, toujours un poisson.',
    },
    {
      name: 'Fabriquer une aile',
      note: 'Un cercle, courbé en aile.',
    },
  ],
  guests: [
    {
      name: 'Bernhard Riemann',
      note: 'Sa thèse de 1851, sous la direction de Gauss, étudiait les fonctions complexes par la géométrie : des transformations qui gardent les angles, et des surfaces.',
    },
  ],
  insight: {
    title: 'Courber sans perdre ses angles.',
    html: `<p>Un nombre complexe x + iy est un point du plan : x vers la droite, y vers le haut. Une fonction complexe f envoie chaque point z sur un nouveau point w = f(z) ; elle déplace donc tout le plan d’un coup. La première image montre le plan avant ; la seconde montre où atterrit chacun de ses points.</p>
<div class="insight-visual">multiplier par un nombre de taille r et d’angle θ, c’est étirer d’un facteur r et tourner de θ</div>
<h3>Multiplier, c’est tourner et étirer</h3>
<p>Multiplier par i fait tourner le plan d’un quart de tour. Multiplier par 2 double sa taille. Chaque nombre complexe fait les deux à la fois : il étire selon sa taille et tourne selon son angle. Un étirement suivi d’une rotation conserve tous les angles, même quand les tailles changent.</p>
<h3>De près, une courbure est une multiplication</h3>
<p>Zoomez près d’un point z : une fonction complexe lisse ressemble alors à la multiplication par un seul nombre, sa dérivée f′(z), car f(z + h) ≈ f(z) + f′(z)·h pour un h minuscule. Ainsi, chaque petite flèche en z est étirée de |f′(z)| et tournée de l’angle de f′(z), de la même façon dans toutes les directions. Les deux flèches de la boussole tournent ensemble et se croisent toujours à angle droit. Une transformation qui garde ainsi les angles est dite <em>conforme</em>. Les lignes de la grille se croisent elles aussi à angle droit après la courbure, même quand les carrés deviennent courbes.</p>
<h3>Là où f′ = 0, les angles se brisent</h3>
<p>Si f′(z) = 0, il n’y a plus rien par quoi multiplier, et le terme suivant prend le relais. Près de 0, z² envoie h sur h², ce qui double chaque angle : l’angle droit entre 1 et i s’ouvre en une ligne droite. Voilà pourquoi la jumelle de la boussole rétrécit jusqu’à disparaître au centre de « Mettre le plan au carré », et pourquoi les lignes de la grille qui passent par 0 s’y plient.</p>
<h3>Retourné comme un gant</h3>
<p>1/z échange le proche et le lointain : les points proches de 0 s’envolent au loin, et les points lointains se rapprochent. Les cercles passant par 0 deviennent des droites, et les droites qui évitent 0 deviennent des cercles passant par 0. Voilà pourquoi la grille carrée se change en deux familles de cercles, qui passent tous par 0 et se croisent toujours à angle droit. (Les deux axes, qui passent eux-mêmes par 0, restent des droites.)</p>
<h3>D’un cercle à une aile</h3>
<p>La transformation de Joukowski, z + 1/z, aplatit le cercle unité en le segment qui va de −2 à 2. Décalez un peu le cercle, en le faisant toujours passer par z = 1, et son image devient une aile : arrondie à l’avant et effilée à l’arrière. Le bord effilé se trouve exactement là où f′ = 0, en z = 1, où les angles doublent et où le cercle lisse se replie en une pointe. La transformation envoie l’écoulement de l’air autour du cercle sur un écoulement autour de l’aile. Cet écoulement est idéalisé (stationnaire, sans frottement, plan), avec juste assez de circulation pour que l’air quitte le bord effilé en douceur. Les vraies ailes dépendent aussi de la viscosité, de la turbulence et de leur forme en trois dimensions, que cette image laisse de côté.</p>
<h3>À propos du curseur « Courbure »</h3>
<p>À mi-chemin, l’image montre (1 − t)·z + t·f(z), un simple mélange entre rester en place et la transformation complète. Il est là pour aider l’œil à suivre chaque point. Chaque mélange est lui aussi une fonction complexe, mais il a ses propres points à problèmes, et ce n’est pas un chemin que le plan parcourt vraiment. Seule l’image entièrement courbée montre f.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>f′(z) est la limite de (f(z + h) − f(z)) / h quand h tend vers 0. Pour une fonction complexe, la limite doit être la même dans toutes les directions, et c’est exactement ce qui force l’étirement et la rotation à être les mêmes dans toutes les directions : une fonction analytique telle que f′(z) ≠ 0 est conforme en z. En un point où f′ s’annule à l’ordre un, les angles sont multipliés par 2. L’écoulement autour de l’aile utilise le potentiel complexe F = ζ + r²/ζ + ik·log ζ autour d’un cercle de rayon r (ζ mesuré depuis son centre), avec k choisi pour que z = 1 soit un point d’arrêt : c’est la condition de Kutta.</p></details>
<div class="sources"><a class="source-link" href="https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/" target="_blank" rel="noopener">Notes du MIT 18.04, thème 10 : transformations conformes (en anglais)</a><a class="source-link" href="https://webapps.math.uci.edu/~vmm/ConformalMaps/" target="_blank" rel="noopener">Des transformations conformes à explorer (UC Irvine, 3D-XplorMath, en anglais)</a><a class="source-link" href="https://www.grc.nasa.gov/www/k-12/airplane/map.html" target="_blank" rel="noopener">La transformation de Joukowski, du cylindre au profil d’aile (NASA Glenn, en anglais)</a><a class="source-link" href="https://books.google.com/books/about/Visual_Complex_Analysis.html?id=ogz5FjmiqlQC" target="_blank" rel="noopener">Tristan Needham, Visual Complex Analysis (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/" target="_blank" rel="noopener">Bernhard Riemann (MacTutor, en anglais)</a></div>`,
  },
});

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
<p>En 1952, Alan Turing a montré que deux substances chimiques, qui réagissent entre elles et se propagent à des vitesses différentes, peuvent faire apparaître un motif dans un mélange uniforme. Une façon populaire de se le représenter est venue plus tard : un <em>activateur</em> qui se fabrique lui-même, et un <em>inhibiteur</em> qu’il fabrique aussi et qui le freine. Si l’inhibiteur se propage plus vite, chaque bosse d’activateur s’entoure d’une douve où aucune autre bosse ne peut pousser. Le résultat, ce sont des taches ou des rayures, à un espacement que choisit la chimie.</p>
<h3>Des vagues parties de quelques endroits</h3>
<p>En 2023, une équipe dirigée depuis l’université d’Édimbourg a découvert que les crêtes des empreintes digitales suivent ce genre de système de Turing, avec les signaux WNT et EDAR comme activateurs et BMP comme inhibiteur. Les crêtes n’apparaissent pas partout à la fois. Elles démarrent en quelques sites : le centre de la pulpe du doigt, le bout près de l’ongle, et à côté du pli de la dernière articulation. De là, elles se propagent en vagues et déposent des crêtes à peu près parallèles à leur front. Là où les vagues se rencontrent, elles laissent des deltas en forme de Y. Les simulations de l’équipe ont produit des arcs, des boucles et des verticilles en changeant quand, où et sous quel angle les sites démarrent : une pulpe qui démarre tard, par exemple, laisse de la place aux crêtes du pli et forme un arc.</p>
<h3>Pourquoi les empreintes diffèrent autant</h3>
<p>L’étude a montré que l’endroit où les sites démarrent, et la façon dont leurs vagues se rencontrent, font la variété des empreintes ; dans leur discussion, les auteurs ajoutent que les minuscules différences aléatoires typiques des motifs de Turing rendent chaque empreinte plus unique encore. Les vrais jumeaux partagent leurs gènes, et leurs empreintes ont souvent le même type, mais pas les mêmes détails : dans une vaste étude, les empreintes de jumeaux avaient le même type environ trois fois sur quatre, et pourtant un logiciel de comparaison d’empreintes les distinguait presque aussi sûrement que celles de personnes sans lien de parenté. « Faire repousser » garde le plan et ne change que les détails les plus infimes : vous pouvez voir les crêtes s’arrêter et bifurquer à de nouveaux endroits.</p>
<h3>Ce que cette salle laisse de côté</h3>
<p>Ceci est un modèle simplifié inspiré de ces recherches, pas une simulation de la vraie peau d’un embryon. Le bout du doigt est plat, les sites de départ sont placés à la main, et aucun gène ni aucune vraie substance chimique n’apparaît : juste deux signaux inventés, avec des équations de manuel. Il laisse de côté la croissance du doigt, sa pulpe en trois dimensions, et les pores sudoripares qui parsèment plus tard chaque crête.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Les deux signaux a (activateur) et h (inhibiteur) suivent des équations adaptées du modèle cubique de Barrio–Varea–Aragón–Maini (ici l’activateur se propage un peu plus lentement, 0,45 au lieu de 0,516, et h est leur v changé de signe) : ∂a/∂t = 0.45 s ∇²a + 0.899 a − h − 3.15 a h², et ∂h/∂t = s ∇²h + 0.899 a − 0.91 h − 3.15 a h². L’état uniforme a = h = 0 est instable pour toute une gamme d’ondulations, dont la plus rapide a une longueur d’onde d’environ 9,5√s cellules de la grille, mais il reste exactement uniforme tant qu’un site ne le pousse pas : les crêtes ne se propagent donc qu’en vagues depuis les sites. Sans termes au carré, les rayures l’emportent sur les taches. Le curseur d’espacement des crêtes change s.</p><p>La salle nomme le résultat en faisant le tour de chaque point où la direction des crêtes n’est plus définie et en additionnant de combien cette direction tourne (son indice de Poincaré) : un demi-tour dans un sens pour le cœur d’une boucle, un tour entier pour le centre d’un verticille, et un demi-tour dans l’autre sens pour un delta. Les experts en empreintes digitales utilisent les mêmes repères. Les points situés tout au bord du bout du doigt ne sont pas détectés.</p></details>
<div class="sources"><a class="source-link" href="https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/" target="_blank" rel="noopener">Glover et al. (2023), The developmental basis of fingerprint pattern formation and variation (en anglais)</a><a class="source-link" href="https://doi.org/10.1098/rstb.1952.0012" target="_blank" rel="noopener">Turing (1952), The chemical basis of morphogenesis (en anglais)</a><a class="source-link" href="https://doi.org/10.1371/journal.pone.0035704" target="_blank" rel="noopener">Tao et al. (2012), reconnaître les empreintes de vrais jumeaux (en anglais)</a><a class="source-link" href="https://doi.org/10.1006/bulm.1998.0093" target="_blank" rel="noopener">Barrio et al. (1999), le modèle dont ces équations sont adaptées (en anglais)</a></div>`,
  },
});

// The fixed text of the page (index.html, elements marked data-t).
Wonderlattice.defineText('page', 'fr', {
  head: {
    title: 'Wonderlattice — Suivez votre curiosité',
    description:
      'De petites salles de mathématiques ludiques : dessinez avec des bras qui tournent, tissez du tissu, opposez des dés entre eux, envoyez une image à travers la tempête, courbez le plan, faites pousser une empreinte digitale, et plus encore.',
  },
  skip: 'Aller au contenu principal',
  header: {
    edition: 'UN PETIT LIEU POUR UNE GRANDE CURIOSITÉ',
    about: 'À propos de ce lieu',
    trail: 'Mon parcours',
    home: 'Accueil de Wonderlattice',
  },
  roomBar: {
    home: '← Toutes les expériences',
    label: 'Expériences',
  },
  trailReturn: {
    noteHtml: 'Que remarquez-vous maintenant ? <span>(facultatif)</span>',
    save: 'Garder cette pensée',
    dismiss: 'Fermer',
    label: 'Découverte revisitée',
    placeholder: 'Une petite pensée suffit.',
  },
  home: {
    title: 'Suivez votre curiosité.',
    intro:
      'Wonderlattice est une collection gratuite de petites expériences à manipuler, autour de grandes idées mathématiques. Choisissez-en une et jouez. Il n’y a rien à réussir, et aucune inscription.',
  },
  motion: {
    title: 'Peindre avec le mouvement.',
    subtitle: 'Deux bras qui tournent. Un stylo. Voyez ce qui se dessine.',
    field: 'Des cercles dans des cercles',
    onCanvas: 'Sur la toile',
    finish: 'Tout tracer',
    surprise: '✧ Surprenez-moi',
    rotation: 'Rotation intérieure',
    opposite: 'Sens opposé',
    same: 'Même sens',
    reach: 'Portée du stylo',
    reachHint: 'Changez l’équilibre entre les deux bras.',
    angle: 'Angle de départ',
    angleHint: 'Tournez la position de départ du bras intérieur.',
    ink: 'Encre',
    arms: 'Montrer les bras en mouvement',
    slow: 'Lent',
    flow: 'Fluide',
    fast: 'Rapide',
    why: 'Pourquoi cela se produit-il ?',
    presetsTitle: 'Par où commencer',
    share: 'Copier ce motif',
    connectionHtml:
      '<strong>Et si un dessin avait une voix ?</strong> Suivez le lien entre mouvement circulaire, ondes et son.',
    connectionGo: 'Entrer dans le son',
    drawingLabel: 'Votre dessin en direct',
    canvasLabel:
      'Une courbe animée tracée par le bout de deux bras en rotation. Utilisez les commandes voisines pour changer sa forme.',
    restart: 'Recommencer le dessin',
    saveLabel: 'Enregistrer le dessin en PNG',
    controlsLabel: 'Commandes du dessin',
    surpriseTitle: 'Essayer une nouvelle combinaison',
    rotationExact: 'Vitesse exacte de rotation intérieure',
    inkLabel: 'Palette d’encre',
    palette0: 'Aurore : de la menthe au violet',
    palette1: 'Braise : de l’or au rose',
    palette2: 'Glacier : du bleu à l’argent',
    palette3: 'Clair de lune : blanc chaud',
    speedLabel: 'Vitesse du dessin',
    presetsLabel: 'Motifs de départ',
  },
  stage: {
    makeItYours: 'À vous de jouer',
    keep: '✧ Garder ce moment',
    nudge: 'Un petit coup de pouce',
    reset: 'Recommencer',
    presetsTitle: 'Suivre une autre possibilité',
    share: 'Copier cette exploration',
    saveTitle: 'Enregistrer l’image',
    guestLabel: 'Une figure des mathématiques en visite',
    sceneLabel: 'Exploration interactive',
    saveLabel: 'Enregistrer cette scène en image',
    controlsLabel: 'Commandes de l’exploration',
  },
  footer: {
    note: 'Suivez une forme. Trouvez un petit émerveillement.',
    promise: 'Pas de score. Pas de bonne réponse.',
    credit: 'Réalisé par Eyal Weiss',
    about: 'À propos',
  },
  why: {
    titleHtml: 'Un peu de mouvement,<br />beaucoup de possibilités.',
    p1: 'Imaginez un stylo au bout d’un bras. Fixez maintenant ce bras au bout d’un autre bras qui tourne. Chaque mouvement est simple. Leur combinaison dessine la courbe que vous voyez.',
    reveal: 'Montrez-moi les bras',
    h2: 'Quand les rythmes se retrouvent',
    p2: 'Si un bras fait un nombre entier de tours pendant que l’autre en fait aussi un nombre entier, les deux peuvent revenir ensemble à leur position de départ. Le stylo referme sa boucle.',
    p3: 'Un tout petit changement de vitesse peut beaucoup retarder ces retrouvailles. De nouvelles boucles apparaissent entre-temps et tissent un dessin bien plus dense. Essayez « Presque un cercle », puis « Tout tracer ».',
    h3: 'Il y a un lien avec la musique',
    p4: 'Les positions horizontale et verticale d’un point qui tourne varient chacune comme une onde régulière. Additionnez les positions de deux points qui tournent, et vous additionnez des ondes. Combiner des ondes est aussi au cœur du son. Ce dessin est un cousin visuel de cette idée, pas la simulation d’un instrument de musique.',
    more: 'Envie de voir les mathématiques ?',
    p5: 'La position du stylo est la somme de deux mouvements circulaires :',
    p6Html:
      'Ici, <em>a</em> et <em>b</em> sont les longueurs des bras, <em>k</em> est la vitesse de rotation du bras intérieur par rapport à celle du bras extérieur, et <em>φ</em> est son angle de départ. Les deux angles sont mesurés par rapport à la toile, pas par rapport à l’autre bras.',
    p7: 'Un rapport de vitesses rationnel donne un tracé fermé. Un rapport irrationnel ne se refermerait jamais exactement. Tous les réglages décimaux finis de ce terrain de jeu sont rationnels, même quand leurs tracés mettent longtemps à se refermer.',
    source1: 'Épitrochoïdes et hypotrochoïdes',
    source2: 'Le Spirographe',
    close: 'Fermer l’explication',
  },
  narration: {
    listen: 'Écouter cette idée',
  },
  about: {
    title: 'Bienvenue sur Wonderlattice.',
    p1: 'Une petite expérience pour savourer les idées mathématiques en jouant. Changez quelque chose. Suivez ce qui attire votre regard. Créez quelque chose qui vous plaît.',
    p2: 'Chaque petit monde relie un morceau de mathématiques à quelque chose avec quoi jouer : des formes, des sons, des foules, des jeux, des motifs à fabriquer. Il n’y a pas de leçon à finir, ni rien à réussir.',
    cardHtml:
      '<strong>À vous de jouer</strong><br />Choisissez un point de départ, bougez un curseur, et suivez ce qui vous surprend. Chaque salle a une explication facultative, et vous pouvez enregistrer une image quand vous voulez.',
    p3: 'Tout ici fonctionne dans votre navigateur, même hors ligne. Pas de compte, pas de pistage, pas de cookies, et pas de discussion avec une IA. Le son reste coupé tant que vous ne l’activez pas.',
    privacyTitle: 'Votre vie privée',
    privacy:
      'Wonderlattice ne collecte rien. Le site est hébergé par Cloudflare, qui conserve des journaux d’accès standard (adresse IP, heure, page) selon sa propre politique de confidentialité. Mon parcours et votre choix de langue ne sont conservés que dans ce navigateur, et seulement si vous les utilisez ; effacer les données du site les supprime. La narration utilise les voix de votre navigateur : certaines voix en ligne envoient le texte lu (ces explications, jamais vos notes) au service vocal de l’éditeur du navigateur.',
    whoTitle: 'Qui fait ce site',
    whoHtml:
      'Wonderlattice est un projet de loisir gratuit et non commercial d’Eyal Weiss. Dites bonjour à <a href="mailto:eyal8488@gmail.com">eyal8488@gmail.com</a> ou sur <a href="https://github.com/eyal-weiss" target="_blank" rel="noopener noreferrer">GitHub</a>.',
    legal:
      'Les modèles présentés ici sont simplifiés pour le jeu et l’explication ; ce ne sont ni des prévisions, ni des mesures, ni des conseils. Fourni tel quel, sans garantie. Les liens mènent vers des sites indépendants ; ils n’impliquent aucune affiliation ni approbation. Rubik’s Cube® est une marque déposée de Spin Master Toys UK Limited ; Wonderlattice n’y est pas affilié.',
    creditsHtml:
      'Le code et les textes sont librement réutilisables sous licence MIT. Les portraits des mathématiciens historiques sont dans le domaine public, sauf la photo de John Conway par Thane Plambeck (recadrée, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</a>). Les visiteurs dessinés sont des croquis espiègles, pas des portraits ressemblants.',
    close: 'Fermer « À propos »',
  },
  copy: {
    title: 'Votre motif, à garder.',
    select: 'Sélectionner le texte',
    close: 'Fermer les détails du motif',
    textLabel: 'Réglages du motif ou lien à partager',
  },
  trailSave: {
    title: 'Un moment à garder.',
    noteHtml: 'Qu’est-ce qui a attiré votre regard ? <span>(facultatif)</span>',
    private: 'Enregistré dans ce navigateur uniquement. Vous pourrez exporter votre parcours plus tard.',
    save: 'Ajouter à mon parcours',
    close: 'Fermer la fenêtre d’enregistrement',
    placeholder: 'Une question, une surprise, une petite observation…',
  },
  trail: {
    title: 'Mon parcours.',
    intro:
      'Quelques moments que vous avez choisi de garder. Revisitez une salle avec ces réglages, et voyez ce que vous remarquez ensuite.',
    threads: 'Fils à suivre',
    export: 'Exporter mon parcours',
    import: 'Importer un parcours',
    private:
      'Tout reste sur cet appareil, sauf si vous l’exportez. Importer remplace le parcours actuel. Effacer les données du navigateur le supprime.',
    close: 'Fermer le parcours',
    importLabel: 'Importer un parcours (un fichier JSON Wonderlattice)',
  },
  insight: {
    close: 'Fermer l’explication',
  },
});
