Wonderlattice.defineText('treasure', 'fr', {
  eyebrow: 'PROBABILITÉS',
  name: 'Le détecteur de trésor imparfait',
  tagline: 'Un détecteur qui a raison 95 % du temps bipe. Y a-t-il un trésor ? Presque jamais.',
  title: 'Le détecteur de trésor imparfait.',
  subtitle: 'Balayez l’île, puis creusez là où il bipe. Combien de fois le trésor est-il vraiment là ?',
  field: 'Probabilités · Règle de Bayes · Une petite surprise',
  sceneLabel: 'Une île · Un détecteur honnête',
  sceneName: 'L’île au trésor',
  tip: 'Touchez une case qui bipe pour creuser · Les flèches visent, Entrée creuse',
  actionLabel: 'Balayer l’île',
  canvasLabel:
    'Une île de cases. Un détecteur bipe au-dessus de certaines ; creuser révèle un trésor ou rien. À côté, 1 000 cases en points, rangées selon ce que dit le détecteur.',
  panelEyebrow: 'Changez les chances',
  whyLabel: 'Pourquoi un bip se trompe-t-il si souvent ?',
  nudge:
    'Rendez le trésor plus rare et regardez les bips : de plus en plus sont de fausses alertes, alors que le détecteur n’a pas changé du tout.',
  connection: {
    html: '<strong>Le hasard trompe l’intuition.</strong> Dans la salle Les dés qui se battent entre eux, le « meilleur » dépend de l’adversaire. Ici, ce que veut dire un bip dépend de la rareté du trésor.',
    label: 'Lancer les drôles de dés',
  },

  presets: [
    { name: 'Des trésors partout', note: 'Un bip est une bonne nouvelle.', badge: '30 %' },
    { name: 'Un trésor rare', note: 'Essayez la surprise.', badge: '2 %' },
    { name: 'Un second détecteur', note: 'Deux bips pèsent bien plus lourd.', badge: '×2' },
  ],

  treasure: 'Le trésor est-il courant ?',
  treasureHint: 'La part des cases qui cachent un trésor.',
  share: (pct) => `${pct} % · 1 sur ${Math.round(100 / pct)}`,
  accuracy: 'Combien de fois le détecteur a raison',
  accuracyHint: 'Aussi souvent, il bipe au-dessus du trésor et se tait au-dessus du sable.',
  second: 'Ajouter un second détecteur (seules comptent les cases où les deux bipent)',

  actions: { sweep: 'Balayer l’île', digAll: 'Creuser à chaque bip', again: 'Une autre île' },
  status: {
    ready: 'Balayez l’île pour commencer',
    swept: (beeps) => `${beeps} ${beeps === 1 ? 'bip' : 'bips'} · touchez-en un pour creuser`,
    digging: (dug, beeps, found) => `${dug} bips creusés sur ${beeps} · ${found} ${found === 1 ? 'trésor' : 'trésors'}`,
    done: (beeps, found) =>
      `${beeps} ${beeps === 1 ? 'bip creusé' : 'bips creusés'} : ${found} ${found === 1 ? 'trésor' : 'trésors'}, ${beeps - found} ${beeps - found === 1 ? 'fausse alerte' : 'fausses alertes'}`,
  },
  dug: { treasure: 'Un trésor !', nothing: 'Rien ici.' },
  quiet: 'Le détecteur est resté muet ici.',

  readout: {
    title: 'Un bip veut dire trésor',
    story: (total, treasure, found, falseAlarms, both) =>
      `Sur ${total.toLocaleString('fr')} cases, ${treasure} cachent un trésor. ${both ? 'Les deux détecteurs bipent' : 'Le détecteur bipe'} au-dessus de ${found} d’entre elles, et au-dessus de ${falseAlarms} ${falseAlarms === 1 ? 'case vide' : 'cases vides'}. Donc ${found} bips sur ${found + falseAlarms} sont un trésor.`,
    percent: (p) => `${Math.round(p * 100)} %`,
  },

  labels: {
    island: 'L’île',
    thousand: 'Sur 1 000 cases',
    found: 'trésor, bip',
    missed: 'trésor, muet',
    falseAlarm: 'sable, bip',
    quiet: 'sable, muet',
  },

  guests: [
    {
      name: 'Thomas Bayes',
      note: 'Un indice doit faire changer d’avis, mais de combien, cela dépend de ce qu’on croyait avant.',
    },
    {
      name: 'Pierre-Simon Laplace',
      note: 'J’ai trouvé la même règle de mon côté, et je m’en suis servi pour les étoiles, les tribunaux et le recensement.',
    },
  ],

  insight: {
    title: 'Pourquoi un bip se trompe-t-il si souvent ?',
    html: `<p>Imaginez 1 000 cases, avec un trésor sous 20 d’entre elles. Un détecteur qui a raison 95 % du temps bipe au-dessus de 19 des 20. Mais il bipe aussi, par erreur, au-dessus de 5 % des 980 cases vides : 49 d’entre elles. Cela fait 68 bips, dont seulement 19 sont un trésor, environ 28 %. Le détecteur est bon ; le trésor est rare, donc les fausses alertes l’emportent sur les trouvailles.</p>
<div class="insight-visual">19 trouvailles + 49 fausses alertes → un bip est un trésor 19 fois sur 68</div>
<h3>Compter vaut mieux que les pourcentages</h3>
<p>Posée en pourcentages (« 2 % des cases, 95 % de justesse »), cette énigme piège la plupart des gens, médecins compris. Posée en nombres de cases, comme les points à côté de l’île, presque tout le monde s’en sort. Les psychologues Gerd Gigerenzer et Ulrich Hoffrage l’ont montré en 1995 ; ils appellent ces décomptes des fréquences naturelles.</p>
<h3>Pourquoi un second détecteur aide autant</h3>
<p>Si un second détecteur, avec ses propres erreurs indépendantes, bipe aussi, les fausses alertes disparaissent presque : sur les 49, seules 2 environ trompent les deux. La plupart des doubles bips sont alors un trésor. C’est ainsi que les indices s’additionnent.</p>
<h3>Ce que cette salle simplifie</h3>
<p>Le détecteur a raison aussi souvent au-dessus du trésor qu’au-dessus du sable, et les erreurs du second détecteur sont indépendantes de celles du premier. Dans la réalité, des tests répétés sont rarement aussi indépendants, si bien qu’un second test aide en général moins qu’ici. Chaque île est construite pour correspondre aux nombres attendus, arrondis à des cases entières ; une vraie recherche varierait autour. Le même calcul s’applique au dépistage des maladies rares : un résultat positif est une raison d’examiner davantage, pas un verdict.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>C’est la règle de Bayes. Avec un trésor dans une part r des cases et un détecteur qui a raison avec une probabilité a, P(trésor | bip) = a·r / (a·r + (1 − a)·(1 − r)). Avec deux détecteurs indépendants, P(trésor | deux bips) = a²·r / (a²·r + (1 − a)²·(1 − r)). La règle porte le nom de Thomas Bayes, dont l’essai fut publié en 1763, après sa mort ; Pierre-Simon Laplace l’a développée de son côté et l’a beaucoup utilisée. G. Gigerenzer et U. Hoffrage, « How to improve Bayesian reasoning without instruction: frequency formats », Psychological Review 102 (1995).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Base_rate_fallacy" target="_blank" rel="noopener">Oubli de la fréquence de base (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Bayes%27_theorem" target="_blank" rel="noopener">Théorème de Bayes (en anglais)</a></div>`,
  },
});
