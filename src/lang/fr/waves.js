Wonderlattice.defineText('waves', 'fr', {
  eyebrow: 'ONDES · SON',
  name: 'Entendre la forme',
  tagline: 'Deux sons se combinent en battements, en silence et en un portrait qui boucle.',
  title: 'Entendre la forme.',
  subtitle:
    'Deux sons, dessinés comme des ondes. Écartez-en un légèrement de l’autre et regardez, ou écoutez, leur somme se mettre à battre.',
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
  hz: ' Hz',
  view: 'Une autre façon de voir',
  viewGroup: 'Vue des ondes',
  viewWaves: 'Additionner les ondes',
  viewPortrait: 'Portrait en cercle',
  beatDetail: (f, g, d) => `Vos sons : ${f} Hz et ${g} Hz. Leur différence de fréquence est de ${d} Hz.`,
  status: (f, g) => `${f} Hz + ${g} Hz`,
  labels: {
    a: (f) => `A · ${f} Hz`,
    b: (f) => `B · ${f} Hz`,
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
