/* Deux jeux perdants qui gagnent · les mots du visiteur (fr). */
Wonderlattice.defineText('parrondo', 'fr', {
  eyebrow: 'HASARD',
  name: 'Deux jeux perdants qui gagnent',
  tagline: 'Chaque jeu de pile ou face vide lentement vos poches. Mélangez-les, et l’argent monte.',
  title: 'Deux jeux perdants qui gagnent.',
  subtitle:
    'Le jeu A perd. Le jeu B perd. Regardez mille joueurs essayer chacun des deux, et mille autres les mélanger.',
  field: 'Probabilités · Chaînes de Markov · Un paradoxe',
  sceneLabel: '1 000 joueurs par jeu · 1 000 tours',
  sceneNames: ['A seul', 'B seul', 'A ou B au hasard'],
  raceName: 'A, B et le mélange, côte à côte',
  patternName: (pattern) => `La séquence ${pattern}`,
  tip: 'Les traits épais suivent le joueur moyen, les pointillés l’espérance exacte · Joué seul, un jeu montre aussi une bande qui contient la moitié centrale de ses joueurs · Choisissez un jeu dans le panneau',
  actionLabel: 'Nouveaux joueurs',
  canvasLabel:
    'Un graphique des gains sur 1 000 tours. D’abord, trois foules de 1 000 joueurs jouent côte à côte à A, à B, et à A ou B au hasard : les traits épais montrent leurs gains moyens, les pointillés les gains attendus exacts. Un jeu joué seul montre aussi une bande ombrée qui contient la moitié centrale de ses joueurs, et les courbes des jeux déjà essayés restent affichées en pâle. Avec les seaux affichés, trois barres donnent la part des joueurs dont le nombre de pièces est un multiple de 3, un de plus, ou deux de plus.',
  panelEyebrow: 'Choisissez un jeu',
  whyLabel: 'Comment deux perdants peuvent-ils gagner ?',
  nudge:
    'Regardez les trois courbes : A et B s’enfoncent tandis que le mélange grimpe. Puis jouez à chaque jeu seul, et composez vos propres séquences : beaucoup gagnent, mais certaines, comme A B, perdent encore.',
  connection: {
    html: '<strong>L’air équitable, et plein de surprises.</strong> Ici, deux jeux perdants gagnent ensemble. Dans la salle Les dés qui se battent entre eux, chaque dé en a un autre qui le bat.',
    label: 'Lancer les drôles de dés',
  },

  presets: [
    { name: 'B seul', note: 'Une mauvaise pièce sur chaque multiple de 3.', badge: 'B' },
    { name: 'A ou B au hasard', note: 'Deux perdants font un gagnant.', badge: 'A|B' },
    { name: 'A A B B', note: 'Un rythme régulier gagne aussi.', badge: 'AABB' },
  ],

  rules: {
    title: 'Les deux jeux',
    aHtml: '<strong>A</strong> · une pièce qui gagne 49,5 % du temps.',
    bHtml:
      '<strong>B</strong> · si votre nombre de pièces est un multiple de 3, une mauvaise pièce qui gagne 9,5 % ; sinon une bonne, qui gagne 74,5 %.',
    stakes: 'Chaque victoire rapporte une pièce, chaque défaite en coûte une. Tout le monde part de 0.',
  },

  // Les noms des jeux, en lettres (le modèle les appelle toujours A et B).
  letters: ['A', 'B'],
  modeLabel: 'À quel jeu jouent-ils ?',
  // Par numéro de mode ; la course (4) s’affiche en premier.
  modes: ['A seul', 'B seul', 'Mélange au hasard', 'Ma séquence', 'Les trois à la fois'],

  patternLabel: 'Composez votre propre séquence',
  patternHint: 'Elle se répète, tour après tour, pour chaque joueur. Jusqu’à 12 lettres.',
  add: (game) => `Ajouter ${game}`,
  undo: 'Annuler',
  undoLabel: 'Retirer la dernière lettre',

  buckets: 'Pourquoi ? Afficher les trois seaux',

  readout: {
    expected: (rounds) => `Attendu après ${rounds} tours`,
    perRound: (value) => `${value} par tour, à la longue`,
    average: (players, value) => `Moyenne de ${players} joueurs pour l’instant : ${value}`,
    games: ['A seul', 'B seul', 'A ou B au hasard'],
    averages: (players, a, b, mix) =>
      `Moyennes de ${players} joueurs chacun pour l’instant : A ${a} · B ${b} · mélange ${mix}`,
    perRounds: (a, b, mix) => `À la longue, par tour : A ${a} · B ${b} · mélange ${mix}`,
    badShareRace: (live, alone, mixed, line) =>
      `Tours de B joués sur un multiple de 3 : ${alone} quand B joue seul, ${mixed} dans le mélange (${live} pour l’instant). B ne rapporte qu’en dessous de ${line}.`,
    badShare: (live, exact, line) =>
      `Tours de B joués sur un multiple de 3 : ${live} pour l’instant, ${exact} à la longue. B ne rapporte qu’en dessous de ${line}.`,
    noB: '« A seul » ne fait jamais jouer B, donc les seaux s’équilibrent simplement à un tiers chacun.',
  },

  status: {
    round: (t, rounds) => `Tour ${t} sur ${rounds}`,
    done: (rounds) => `${rounds} tours joués`,
  },
  announce: {
    done: (game, average, expected) =>
      `${game} : le joueur moyen termine avec ${average} pièces ; attendu ${expected}.`,
    race: (a, b, mix) =>
      `Après 1 000 tours, le joueur moyen a ${a} pièces avec A, ${b} avec B, et ${mix} avec le mélange.`,
  },

  // Les mots dessinés sur l’image.
  labels: {
    rounds: 'tours',
    start: 'départ',
    expected: (value) => `attendu ${value}`,
    // Le nom d’un jeu et sa moyenne, là où finissent les courbes de la course.
    tag: (name, value) => `${name} ${value}`,
    average: (value) => `moyenne ${value}`,
    short: ['A', 'B', 'mélange'],
    buckets: 'Joueurs selon le reste de leurs pièces partagées en trois',
    bucketsMix: 'Joueurs du mélange, selon le reste de leurs pièces partagées en trois',
    bucket: ['multiple de 3', 'un de plus', 'deux de plus'],
    coin: ['mauvaise pièce de B', 'bonne pièce de B', 'bonne pièce de B'],
    breakEven: 'B à l’équilibre',
  },

  guests: [
    {
      name: 'Juan Parrondo',
      note: 'Il a imaginé ces jeux en 1996, comme une version à pile ou face d’un mécanisme à cliquet qui fait dériver des particules agitées dans un seul sens.',
    },
    {
      name: 'Richard Feynman',
      note: 'Dans mes cours, une minuscule roue à rochet plongée dans un gaz chaud ne peut pas tourner dans un seul sens gratuitement : son cliquet s’agite autant que sa roue.',
    },
  ],

  insight: {
    title: 'Comment deux perdants peuvent-ils gagner ?',
    html: `<p>Le jeu A est presque une pièce équilibrée : il perd environ une pièce tous les 100 tours. Le jeu B est plus étrange, car il regarde vos pièces. Quand leur nombre est un multiple de 3 (…, −3, 0, 3, 6, …), il utilise une mauvaise pièce ; sinon, une bonne. Sur un multiple de 3, vous perdez le plus souvent une pièce, et de là, la bonne pièce vous ramène le plus souvent tout droit au multiple de 3. B renvoie donc sans cesse les joueurs vers sa mauvaise pièce : environ 38,4 % de ses tours s’y jouent, juste au-delà des 37,7 % où B serait à l’équilibre. B perd, lentement.</p>
<div class="insight-visual">B seul : 38,4 % de ses tours sur la mauvaise pièce → il perd · Mélangé avec A : 34,5 % → B gagne plus que A ne perd</div>
<h3>Le mélange libère les joueurs</h3>
<p>A se moque de ce que vous avez : un tour de A fait monter ou descendre vos pièces au hasard et casse le rythme de B. Ainsi mélangé, il n’envoie les tours de B sur un multiple de 3 qu’environ 34,5 % du temps. La bonne pièce de B sert alors plus souvent que B seul ne le permet, et B gagne plus que A ne perd. À la longue, par tour : A perd 0,010 pièce, B perd 0,0087, et choisir A ou B au hasard gagne 0,0157. Affichez les seaux pour voir la part des joueurs sur un multiple de 3 passer sous la ligne d’équilibre de B.</p>
<h3>Tous les mélanges ne gagnent pas</h3>
<p>A A B B gagne, et A B B gagne largement, mais A B, joué strictement à tour de rôle, perd encore. Essayez quelques séquences et regardez le nombre à la longue.</p>
<h3>Ce que cela ne veut pas dire</h3>
<p>B n’est pas un jeu perdant ordinaire : ses chances dépendent de votre capital, et toute l’astuce est là. Les jeux de casino ne regardent pas votre cagnotte, donc les mélanger ne peut pas transformer une perte en gain ; ce n’est pas un moyen de battre un casino. On a évoqué des effets à la Parrondo en biologie et en finance, mais ces idées sont débattues, et cette salle les laisse de côté. Les joueurs sont ici simulés, donc leur moyenne fluctue, d’environ une pièce après 1 000 tours ; la ligne en pointillés est l’espérance exacte, calculée et non simulée.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Seul compte votre nombre de pièces modulo 3, donc chaque jeu est une chaîne de Markov à trois états. Le jeu A gagne avec la probabilité ½ − ε, et B avec la probabilité 1/10 − ε dans l’état 0 et ¾ − ε dans les états 1 et 2, avec ε = 0,005. La distribution stationnaire de B vaut environ (0,3836 ; 0,1543 ; 0,4621) ; avec ε = 0, elle vaut exactement (5/13 ; 2/13 ; 6/13), et B est parfaitement équitable. Le gain attendu par tour est Σ πᵢ (2pᵢ − 1). Choisir A ou B au hasard donne une seule chaîne, dont les probabilités sont la moyenne de celles des deux jeux ; une séquence répétée comme A A B B correspond au produit des matrices de ses tours. Juan Parrondo a imaginé ces jeux en 1996, comme une version discrète d’un « cliquet brownien clignotant », cousin de la roue à rochet et du cliquet du chapitre 46 du volume I des Feynman Lectures on Physics. G. P. Harmer et D. Abbott, « Losing strategies can win by Parrondo’s paradox », Nature 402, 864 (1999). P. Amengual, P. Meurs, B. Cleuren et R. Toral, « Reversals of chance in paradoxical games », Physica A (2006).</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/47220" target="_blank" rel="noopener">Harmer et Abbott, Nature (1999, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parrondo%27s_paradox" target="_blank" rel="noopener">Le paradoxe de Parrondo (Wikipédia, en anglais)</a><a class="source-link" href="https://arxiv.org/abs/math/0601404" target="_blank" rel="noopener">Reversals of chance in paradoxical games (en anglais)</a></div>`,
  },
});
