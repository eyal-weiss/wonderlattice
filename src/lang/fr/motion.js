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
      'Essayez une rotation légèrement différente d’un nombre entier. Regardez le tracé prendre un plus long chemin pour revenir.',
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
