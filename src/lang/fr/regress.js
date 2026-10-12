/* L’illusion de la punition · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('regress', 'fr', {
  eyebrow: 'STATISTIQUE',
  name: 'L’illusion de la punition',
  tagline: 'Grondez un mauvais lancer, et le suivant est meilleur neuf fois sur dix. Les reproches n’y sont pour rien.',
  title: 'L’illusion de la punition.',
  subtitle:
    'Un coach félicite les meilleurs lancers et gronde les pires. Regardez ce qui suit chaque mot, puis montrez le câblage.',
  field: 'Statistique · Régression vers la moyenne · L’intuition trompée',
  sceneLabel: 'Un lanceur · Un coach',
  sceneName: 'Le décompte du coach',
  tip: 'Touchez un visage pour coacher · Clavier : ↑ féliciter, ↓ gronder, → ne rien dire',
  actionLabel: 'Montrer le câblage',
  hideLabel: 'Cacher le câblage',
  canvasLabel:
    'Une cible où tombent les fléchettes d’un lanceur, un coach qui félicite ou gronde après chaque lancer, et un décompte qui dit si le lancer suivant a été meilleur ou moins bon après chaque mot.',
  panelEyebrow: 'Coach',
  whyLabel: 'Pourquoi les reproches semblent-ils marcher ?',
  nudge:
    'Désactivez le coach automatique et coachez vous-même : félicitez et grondez comme bon vous semble. Puis montrez le câblage.',
  connection: {
    html: '<strong>L’intuition contre l’arithmétique.</strong> Dans « Le détecteur de trésor imparfait », un bip veut dire moins qu’il n’y paraît. Ici, les mots d’un coach semblent faire plus qu’ils ne font.',
    label: 'Partir à la chasse au trésor',
  },

  presets: [
    { name: 'Coach automatique', note: 'Féliciter les meilleurs, gronder les pires.', badge: '20 %' },
    { name: 'Vous coachez', note: 'Chaque mot vient de vous.', badge: '↑↓' },
    { name: 'L’éloge aide vraiment', note: 'Le décompte le voit-il ?', badge: '+' },
  ],

  auto: 'Coach automatique : féliciter les meilleurs lancers, gronder les pires',
  share: 'Le coach réagit aux meilleurs et aux pires',
  shareHint: 'Plus les lancers auxquels il réagit sont extrêmes, plus l’illusion est forte.',
  helps: 'L’éloge aide vraiment un peu (le lancer suivant s’améliore légèrement)',
  words: { praise: 'Féliciter', scold: 'Gronder', nothing: 'Ne rien dire' },

  labels: {
    board: (n) => `Lancer ${n}`,
    points: (p) => `${p} ${p < 2 ? 'point' : 'points'}`,
    praise: 'Bravo !',
    scold: 'Bâclé !',
    nothing: '…',
    yourWord: 'Que dire ?',
    afterPraise: 'Après un éloge',
    afterScold: 'Après un reproche',
    better: 'puis mieux',
    worse: 'puis pire',
    times: (k, n) => `${k} sur ${n}`,
    none: 'pas encore',
    hidden: 'Les mots du coach, reliés à quoi ?',
    hiddenHint: 'Montrez le câblage pour voir',
    wired: 'Mots reliés au lancer suivant :',
    nothing2: 'rien',
    lift: 'éloge : un léger mieux',
    thisThrow: 'ce lancer →',
    nextThrow: 'le suivant ↑',
    same: 'pareil',
    fitted: 'tendance',
  },

  status: {
    waiting: (n) => `Lancer ${n} : que dire ?`,
    count: (n) => `${n} ${n < 2 ? 'lancer' : 'lancers'}`,
    done: (n) => `${n} lancers, c’est terminé`,
  },
  announce: (pw, pn, sb, sn) =>
    `Après un éloge, le lancer suivant a été moins bon ${pw} fois sur ${pn} ; après un reproche, il a été meilleur ${sb} fois sur ${sn}.`,

  guests: [
    {
      name: 'Francis Galton',
      note: 'J’ai mesuré des parents et leurs enfants devenus adultes : les enfants de parents très grands étaient grands, mais en moyenne leur écart au milieu n’était que les deux tiers de celui de leurs parents.',
    },
    {
      name: 'Daniel Kahneman',
      note: 'Un instructeur de vol m’a dit que les éloges rendaient les élèves pilotes moins bons et que les cris les rendaient meilleurs. Il l’avait vu, et c’était la régression vers la moyenne.',
    },
  ],

  insight: {
    title: 'Pourquoi les reproches semblent-ils marcher ?',
    html: `<p>Chaque lancer, c’est l’adresse du lanceur plus la chance. Un lancer exceptionnellement bon est le plus souvent un bon lancer avec un coup de chance en plus, et la chance ne se transmet pas. Le lancer suivant a donc de bonnes chances d’être plus proche de la moyenne du lanceur, quoi que dise le coach. Quand le coach réagit au meilleur et au pire cinquième des lancers, le lancer qui suit un lancer félicité est moins bon 9 fois sur 10 dans cette salle, et celui qui suit un lancer grondé est meilleur 9 fois sur 10. Les mots du coach n’atteignent absolument rien.</p>
<div class="insight-visual">un superbe lancer = adresse + bonne chance → lancer suivant = adresse + chance ordinaire → « les éloges l’ont rendu moins bon »</div>
<h3>L’instructeur de vol</h3>
<p>Daniel Kahneman raconte comment il a un jour expliqué à des instructeurs de vol de l’armée de l’air israélienne que les éloges marchent mieux que les punitions. Un instructeur chevronné a objecté : quand il félicitait un élève pour une manœuvre impeccable, l’essai suivant était généralement moins bon, et quand il hurlait sur un élève, l’essai suivant était généralement meilleur. Kahneman a tout de suite vu qu’il s’agissait de la régression vers la moyenne : parce qu’on félicite les gens quand ils ont bien réussi et qu’on les gronde quand ils ont mal réussi, nous sommes, selon ses mots, « statistiquement punis quand nous récompensons les autres, et récompensés quand nous les punissons ». Il a ensuite fait lancer à chacun, dans la salle, deux pièces vers une cible placée derrière son dos, sans aucun retour : ceux qui avaient le mieux réussi la première fois ont pour la plupart fait moins bien la seconde, et inversement.</p>
<h3>Le mot de Galton</h3>
<p>Francis Galton a trouvé le même phénomène en 1886 dans la taille des parents et de leurs enfants devenus adultes. Les enfants de parents très grands étaient grands, mais en moyenne leur écart au milieu n’était qu’environ les deux tiers de celui de leurs parents ; les enfants de parents très petits étaient petits, mais moins qu’eux. Il a appelé cela la régression vers la médiocrité. Les gens ne dérivent pas tous vers la moyenne : chaque génération est aussi dispersée que la précédente. Seuls ceux qu’on a choisis parce qu’ils étaient extrêmes régressent, car une partie de ce qui les rendait extrêmes était une chance qui ne se transmet pas.</p>
<h3>Ce que cette salle garde simple</h3>
<p>Ici, l’adresse du lanceur ne change jamais et la chance de chaque lancer est neuve, si bien que les mots ne font vraiment rien. Dans la réalité, les retours peuvent compter. Activez « L’éloge aide vraiment » et le décompte dit toujours que les éloges se retournent contre le coach, environ 8 fois sur 10 : comparer un lancer au suivant ne permet pas de le savoir. Pour savoir ce que font les éloges, comparez avec les lancers après lesquels le coach n’a rien dit, ou avec un groupe qui n’a pas été félicité. Le neuf sur dix tient à ces réglages : il vaut 1 − p/2 quand le coach réagit à la part p des meilleurs et des pires lancers (95 % pour un dixième, 75 % pour la moitié). La même illusion apparaît quand un athlète s’effondre après avoir fait la couverture d’un magazine, ou quand des patients qui entrent dans une étude au plus mal semblent aller mieux avec n’importe quel traitement.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Si les scores sont l’adresse plus une chance indépendante, le score suivant attendu est la moyenne plus r fois l’écart de ce score à la moyenne, où r est la corrélation entre un score et le suivant. Pour un lanceur dont l’adresse ne change jamais, r = 0 : la droite de tendance à travers les points « ce lancer, lancer suivant » est plate, tandis que la ligne pointillée « pareil » monte. Avec une chance normale et un seuil c au-dessus duquel se trouve la part p des meilleurs lancers, P(suivant moins bon | celui-ci parmi les p meilleurs) = 1 − p/2, et la variation moyenne vaut −φ(c)/p, soit environ −1,40 écart type pour p = 20 %. F. Galton, « Regression towards mediocrity in hereditary stature », Journal of the Anthropological Institute 15 (1886) 246–263. D. Kahneman, autobiographie pour le prix Nobel 2002, et Thinking, Fast and Slow (2011, en français « Système 1 / Système 2 »), chapitre 17.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Regression_toward_the_mean" target="_blank" rel="noopener">Régression vers la moyenne (Wikipédia, en anglais)</a><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/" target="_blank" rel="noopener">L’autobiographie Nobel de Kahneman (en anglais)</a><a class="source-link" href="https://galton.org/essays/1880-1889/galton-1886-jaigi-regression-stature.pdf" target="_blank" rel="noopener">Galton 1886 (PDF, en anglais)</a></div>`,
  },
});
