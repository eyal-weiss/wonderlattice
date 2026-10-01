/* S’arrêter à 37 % · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('stopping', 'fr', {
  eyebrow: 'ARRÊT OPTIMAL',
  name: 'S’arrêter à 37 %',
  tagline:
    'Retournez 100 cartes une à une et arrêtez-vous sur la plus grande. Une règle simple gagne plus d’une fois sur trois.',
  title: 'Quand arrêter de chercher.',
  subtitle:
    'Retournez les cartes une à une et arrêtez-vous sur la plus grande, sans retour en arrière. En dessous, des milliers de donnes montrent quand se lancer.',
  field: 'Probabilités · Arrêt optimal · Le problème du secrétaire',
  sceneLabel: '100 cartes · Une à la fois · Pas de retour en arrière',
  sceneName: 'Trouver la plus grande carte',
  tip: 'Touchez le paquet, ou appuyez sur →, pour la carte suivante · Touchez votre carte, ou appuyez sur Entrée, pour la prendre · En dessous, les barres sont 10 000 donnes jouées avec la règle, la courbe la chance exacte',
  actionLabel: 'Nouvelles cartes',
  canvasLabel:
    'Une partie avec 100 cartes face cachée, qui portent chacune un nombre différent. En haut : la carte qui vient d’être retournée, la meilleure carte avant elle, et le paquet. En dessous, une bande avec une marque pour chaque carte retournée, dorée là où une carte a battu toutes les précédentes. Quand une partie se termine, la bande montre le rang de chaque carte, la marque la plus haute pour la plus grande, et signale votre carte, celle de la règle et la plus grande. Plus bas, un graphique : pour chaque nombre de cartes seulement observées avant de se lancer, la chance que la règle gagne, en barres tirées de 10 000 donnes simulées et en une courbe calculée exactement. Trouver la meilleure de toutes est le plus probable après avoir observé 37 cartes, à 37 % ; si n’importe laquelle des 10 plus grandes suffit, après 14 cartes, à 82 %.',
  panelEyebrow: 'Observer, puis se lancer',
  whyLabel: 'Pourquoi 37 % ?',
  nudge:
    'Jouez d’abord quelques donnes vous-même. Puis choisissez combien de cartes la règle se contente d’observer, et trouvez où la courbe est la plus haute. Ensuite, cochez « Se contenter d’une carte du top 10 », et regardez le pic se déplacer.',
  connection: {
    html: '<strong>Décider avant d’avoir tout vu.</strong> Ici, vous devez choisir une carte avant d’avoir vu les autres. Dans « Le détecteur de trésor imparfait », vous décidez de ce que veut dire un bip quand la plupart des bips se trompent.',
    label: 'Partir à la chasse au trésor',
  },

  presets: [
    { name: 'Se lancer tôt', note: 'En observer 10, puis se lancer : 23 %.', badge: '10' },
    { name: 'En observer 37, puis se lancer', note: 'La meilleure de toutes, 37 % du temps.', badge: '37' },
    { name: 'Le top 10 suffira', note: 'N’en observer que 14 : 82 %.', badge: '14' },
  ],

  rules: {
    title: 'Le jeu',
    text: 'Chacune des 100 cartes cache un nombre différent, de n’importe quelle taille. On les retourne une à une. Prenez une carte quand vous pensez que c’est la plus grande des 100. Une carte que vous laissez passer est perdue pour de bon, et si vous arrivez à la dernière carte, elle est à vous.',
  },
  next: 'Carte suivante',
  take: 'Prendre celle-ci',
  again: 'Redistribuer',

  look: 'Cartes que la règle se contente d’observer',
  lookHint: 'Elle n’en prend aucune, puis prend la première carte qui les bat toutes.',
  top: 'Se contenter d’une carte du top 10',

  // Le rang d’une carte parmi les 100 (un nombre entier) : 1 est la plus grande, puis la 2e, la 3e, … la 21e plus grande.
  place: (rank) => (rank === 1 ? 'la plus grande' : `la ${rank}e plus grande`),

  readout: {
    best: (look) => `En observer ${look}, puis se lancer : chance de trouver la meilleure de toutes`,
    top: (look) => `En observer ${look}, puis se lancer : chance d’avoir une carte du top 10`,
    simulated: (deals, chance) => `Sur ${deals} ${deals === '1' ? 'donne simulée' : 'donnes simulées'} : ${chance}.`,
    peak: (look, chance) => `Le meilleur nombre de cartes à observer : ${look}, pour ${chance}.`,
    random: (chance) => `En prenant une carte au hasard : ${chance}.`,
    moreTitle: 'La meilleure de toutes, avec moins ou plus de cartes',
    more: (cards, look, chance) => `${cards} cartes : en observer ${look}, ${chance}`,
  },

  game: {
    playing: (card, cards, best) => `La carte ${card} sur ${cards} est retournée. La meilleure avant elle : ${best}.`,
    first: (cards) => `La carte 1 sur ${cards} est retournée. Rien avant elle pour l’instant.`,
    took: (card, place) => `Vous avez pris la carte ${card} : ${place}.`,
    last: (place) => `Vous avez atteint la dernière carte, elle était donc à vous : ${place}.`,
    biggest: (card) => `La plus grande était la carte ${card}.`,
    found: 'Vous avez trouvé la plus grande !',
    rule: (look, card, place) =>
      `En observant ${look === '1' ? 'la première' : `les ${look} premières`}, la règle aurait pris la carte ${card} : ${place}.`,
    ruleNone: (place) => `Sans en observer aucune, la règle aurait pris la carte 1 : ${place}.`,
    ruleLast: (look, place) =>
      `En observant ${look === '1' ? 'la première' : `les ${look} premières`}, la règle aurait attendu en vain, et fini sur la dernière carte : ${place}.`,
    topWin: 'Elle fait partie du top 10.',
    topLose: 'Elle ne fait pas partie du top 10.',
  },

  status: {
    card: (card, cards) => `Carte ${card} sur ${cards}`,
    done: (place) => `Vous avez pris ${place}`,
  },

  announce: {
    card: (card, value) => `Carte ${card} : ${value}.`,
    newBest: (card, value) => `Carte ${card} : ${value}, la meilleure jusqu’ici.`,
    noGoingBack: 'Pas de retour en arrière : une carte laissée passer est perdue.',
    over: 'Cette partie est finie. Redistribuez pour avoir de nouvelles cartes.',
    deal: (value) => `Nouvelles cartes. Carte 1 : ${value}.`,
  },

  // Les mots dessinés sur l’image.
  labels: {
    card: (card) => `carte ${card}`,
    bestBefore: 'meilleure avant',
    noneYet: 'aucune encore',
    newBest: 'record !',
    left: (cards) => `encore ${cards}`,
    biggest: 'la plus grande',
    yours: 'la vôtre',
    rule: 'la règle',
    looks: (look) => `la règle en observe ${look}`,
    xAxis: 'cartes observées avant de se lancer',
    yBest: 'trouve la meilleure de toutes',
    yTop: 'trouve une carte du top 10',
    random: (chance) => `une carte au hasard : ${chance}`,
    deals: (deals) => `${deals} ${deals === '1' ? 'donne' : 'donnes'}`,
    peak: (look, chance) => `en observer ${look} : ${chance}`,
    moreTitle: 'La meilleure de toutes, avec moins ou plus de cartes : calcul exact, et le pic bouge à peine',
    more: (cards) => `${cards} cartes`,
    share: (all) => `part observée, jusqu’à ${all}`,
    // Les noms d’une même carte, ensemble : « la vôtre · la plus grande ».
    together: (names) => names.join(' · '),
  },

  guests: [
    {
      name: 'Martin Gardner',
      note: 'Sa rubrique « Mathematical Games », dans Scientific American, a fait connaître cette énigme à un large public en février 1960, sous la forme du jeu du gogol : des nombres écrits sur des bouts de papier, retournés un à un.',
    },
    {
      name: 'Johannes Kepler',
      note: 'Après la mort de sa première épouse en 1611, il a envisagé 11 partis possibles pendant deux ans avant de se remarier. On raconte souvent son histoire avec cette énigme, mais seulement comme une anecdote.',
    },
  ],

  insight: {
    title: 'Pourquoi 37 % ?',
    html: `<p>La plus grande carte est quelque part dans le paquet, et vous n’avez droit qu’à un essai. La règle a deux temps. D’abord, observer seulement : retourner les 37 premières cartes sans en prendre aucune, en notant juste la plus grande. Puis se lancer : prendre la première carte qui les bat toutes. Observez trop peu, et la barre est basse : vous vous lancez sur une carte qui n’est pas la meilleure. Observez trop longtemps, et la plus grande est sans doute passée pendant que vous regardiez. L’équilibre se trouve vers 37 % des cartes, une part de 1/e, où e = 2,718….</p>
<div class="insight-visual">En observer 37 sur 100, puis prendre la première carte qui les bat : la meilleure de toutes 37,1 % du temps · une carte au hasard : 1 %</div>
<h3>Pourquoi deux fois 37 % ?</h3>
<p>En observant seulement les r premières cartes sur n, la règle trouve la meilleure de toutes quand celle-ci arrive plus tard, et que la meilleure carte avant elle était parmi les r premières. En additionnant, on obtient P(r) = (r/n) · (1/r + 1/(r + 1) + … + 1/(n − 1)). Pour un grand paquet, avec x = r/n la part observée, c’est proche de −x ln x, qui est maximal en x = 1/e, où sa valeur vaut aussi 1/e ≈ 36,8 %. Avec 10 cartes : en observer 3, et gagner 39,9 % du temps. Avec 100 : en observer 37, 37,1 %. Avec un million : en observer 367 879, 36,8 %. Le nombre bouge à peine.</p>
<h3>Se contenter du top 10</h3>
<p>Si n’importe laquelle des dix plus grandes convient, le meilleur seuil unique glisse vers la gauche : n’observez que 14 cartes, puis lancez-vous, et vous obtenez une carte du top 10 81,7 % du temps, contre 66,3 % en en observant 37. Pour ce but, pourtant, un seuil unique n’est pas la meilleure règle. La meilleure devient moins exigeante à mesure que les cartes s’épuisent : elle observe 31 cartes, puis prend un nouveau record ; à partir de la carte 44, elle prend aussi une carte qui est la deuxième meilleure jusque-là, à partir de la carte 53 une troisième, et ainsi de suite. Elle obtient une carte du top 10 98,1 % du temps. Le seuil unique n’est ici qu’une illustration.</p>
<h3>Ce que la règle laisse de côté</h3>
<p>La règle des 37 % repose sur des hypothèses fortes : vous savez combien il y a de cartes, elles arrivent dans un ordre aléatoire, vous ne pouvez pas revenir en arrière, seule la meilleure de toutes compte, et vous jugez chaque carte uniquement en la comparant aux précédentes. Ici, vous voyez aussi les nombres eux-mêmes, mais ils ne viennent d’aucun intervalle fixé, si bien qu’un nombre qui paraît grand ne dit pas grand-chose à lui seul. Si vous saviez d’où viennent les nombres (par exemple, répartis uniformément entre 0 et 1), vous pourriez faire mieux que 37 %. Les barres de la courbe sont simulées : 10 000 donnes, chacune jouée avec tous les seuils. La courbe à côté est calculée exactement, tout comme les petites courbes pour 10, 1 000 et un million de cartes.</p>
<p>On présente souvent l’énigme comme un conseil pour trouver l’âme sœur : rencontrer des gens pendant un temps, puis choisir la première personne qui surpasse toutes les précédentes. La vraie vie enfreint chacune des hypothèses. Vous ne savez pas combien de personnes vous rencontrerez, elles n’arrivent pas dans un ordre aléatoire, on peut parfois revenir en arrière, les gens ne se classent pas selon un seul nombre, et l’autre personne a aussi son mot à dire.</p>
<details><summary>Qui l’a résolue ?</summary><p>Pour autant qu’on sache, l’énigme est parue pour la première fois sous forme imprimée dans la rubrique « Mathematical Games » de Martin Gardner, dans Scientific American, en février 1960, sous le nom de « jeu du gogol » (game of googol), que John Fox et Gerald Marnie avaient imaginé en 1958. Merrill Flood l’avait déjà posée lors d’une conférence en 1949, comme le « problème de la fiancée ». Plusieurs personnes l’ont résolue au début des années 1960, et elle a donné naissance à tout un domaine de recherche. Pour la version classique (on ne sait que comment chaque carte se compare aux précédentes, pas de retour en arrière, seule la meilleure de toutes compte), aucune règle ne fait mieux qu’observer, puis se lancer. L’article de Thomas Ferguson « Who solved the secretary problem? » raconte l’histoire, en remontant jusqu’à un problème voisin posé par Arthur Cayley en 1875. On cite souvent Johannes Kepler aussi : après la mort de sa première épouse en 1611, il a envisagé 11 partis possibles pendant deux ans avant d’épouser Susanna Reuttinger en 1613. C’est une anecdote, pas une application de la règle. T. S. Ferguson, Statistical Science 4(3), 282–289 (1989).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Secretary_problem" target="_blank" rel="noopener">Le problème du secrétaire (en anglais)</a><a class="source-link" href="https://doi.org/10.1214/ss/1177012493" target="_blank" rel="noopener">Ferguson, « Who solved the secretary problem? » (1989, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Optimal_stopping" target="_blank" rel="noopener">L’arrêt optimal (en anglais)</a></div>`,
  },
});
