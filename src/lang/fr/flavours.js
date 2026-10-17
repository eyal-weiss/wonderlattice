/* La machine qui a trouvé les saveurs · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('flavours', 'fr', {
  eyebrow: 'RECOMMANDATIONS',
  name: 'La machine qui a trouvé les saveurs',
  tagline: 'Personne ne lui a dit quels aliments sont sucrés. Elle l’a découvert en regardant qui aimait quoi.',
  title: 'La machine qui a trouvé les saveurs.',
  subtitle:
    'Quarante personnes inventées, seize aliments, un tableau plein de cases vides. Regardez un peu d’arithmétique trier les aliments, puis notez-en quelques-uns vous-même.',
  field: 'Données · Recommandations · Une astuce avec l’information',
  sceneLabel: '40 personnes · 16 aliments',
  sceneName: 'La carte cachée',
  tip: 'Touchez un aliment pour le noter · Clavier : ↑↓ choisissent un aliment, → j’aime, ← pas pour moi',
  actionLabel: 'Montrer les traits secrets',
  hideLabel: 'Cacher les traits secrets',
  canvasLabel:
    'À gauche, un tableau qui dit quelles personnes inventées aiment quels aliments, avec beaucoup de cases vides. À droite, la carte que la méthode en tire, où les aliments semblables se regroupent. Touchez un aliment pour dire si vous l’aimez : une étoile montre alors où vous êtes sur la carte, avec des suggestions pour vous.',
  panelEyebrow: 'Vos goûts',
  whyLabel: 'Comment a-t-elle trouvé les saveurs ?',
  nudge:
    'N’aimez que le chocolat. Que vous propose-t-elle ? Dites maintenant non à quelque chose de sucré. Puis videz la plus grande partie du tableau.',
  connection: {
    html: '<strong>Garder les quelques nombres qui comptent.</strong> Ici, deux nombres par aliment suffisent à remplir les cases vides d’un tableau. Dans « Quelle part d’une image peut-on jeter ? », quelques nombres par bloc suffisent à refaire une image.',
    label: 'Jeter une partie d’une image',
  },

  presets: [
    { name: 'Trouver la carte cachée', note: 'Regardez les aliments se trier tout seuls.', badge: '?' },
    { name: 'Un faible pour le sucré', note: 'Deux oui, deux non.', badge: '♥' },
    { name: 'Que des desserts', note: 'Notez un seul genre d’aliment.', badge: '1' },
  ],

  foods: [
    'Chocolat',
    'Glace',
    'Beignets',
    'Crêpes',
    'Fraises',
    'Pastèque',
    'Mangue',
    'Pop-corn',
    'Pizza',
    'Burgers',
    'Frites',
    'Fromage',
    'Salade',
    'Concombre',
    'Sushis',
    'Brocoli',
  ],

  blanks: 'Cases vides',
  blanksHint: 'Les cases que personne n’a remplies. La méthode ne voit que les autres, et devine celles-ci.',
  clear: 'Oublier mes notes',

  labels: {
    people: '40 personnes inventées →',
    you: 'Vous',
    liked: 'aime',
    disliked: 'n’aime pas',
    guessed: 'deviné',
    map: 'La carte trouvée',
    right: (p) => `Vides bien devinés : ${p} %`,
    noBlanks: 'Aucune case vide',
    tapHint: 'Dites ce que vous aimez',
    you2: 'vous',
    sweet: 'sucré',
    savoury: 'salé',
    rich: 'riche',
    light: 'léger',
    planted: (angle, flipped) => `Les traits secrets, tournés de ${angle}°${flipped ? ', en miroir' : ''}`,
  },

  readout: {
    title: 'Suggestions pour vous',
    empty: 'Touchez quelques aliments sur la carte, ou dans votre colonne du tableau : ♥ j’aime, ✕ pas pour moi.',
    none: 'Rien d’autre ne ressemble à un oui pour vous.',
    rated: (likes, nots) => `Vous en aimez ${likes}, et ${nots} ${nots < 2 ? 'n’est' : 'ne sont'} pas pour vous.`,
    stays: 'Vos notes restent sur cette page.',
  },

  status: {
    running: (n) => `Tour ${n}`,
    right: (p) => `${p} % de réussite`,
    full: 'Aucune case vide',
  },
  announce: {
    found: (n, p) =>
      `La carte est trouvée après ${n} ${n < 2 ? 'tour' : 'tours'}. Elle a bien deviné ${p} % des cases vides.`,
    full: (n) =>
      `La carte est trouvée après ${n} ${n < 2 ? 'tour' : 'tours'}. Il n’y avait aucune case vide à deviner.`,
    suggest: (list) => `Suggestions pour vous : ${list}.`,
    nothing: 'Rien d’autre ne ressemble à un oui pour vous.',
    rate: (food, word) => `${food} : ${word}.`,
    like: 'j’aime',
    not: 'pas pour moi',
    unrated: 'pas noté',
    planted: (angle, flipped) =>
      `Les traits secrets correspondent à la carte tournée de ${angle} degrés${flipped ? ' et vue en miroir' : ''}.`,
  },

  guests: [
    {
      name: 'Eugenio Beltrami',
      note: 'En 1873, j’ai montré qu’un tableau carré de nombres peut se décomposer en une rotation, un étirement le long de chaque direction, puis une autre rotation. Aujourd’hui, ces étirements s’appellent ses valeurs singulières.',
    },
    {
      name: 'Camille Jordan',
      note: 'J’ai trouvé la même décomposition un an plus tard, de mon côté. Soixante ans après, Eckart et Young ont montré qu’en ne gardant que les plus grands étirements, on obtient le tableau plus petit le plus proche.',
    },
  ],

  insight: {
    title: 'Comment a-t-elle trouvé les saveurs ?',
    html: `<p>Chaque aliment reçoit deux nombres, et chaque personne aussi : un point sur la carte. Pour estimer l’avis d’une personne sur un aliment, la méthode multiplie leurs premiers nombres, multiplie leurs seconds nombres, et additionne (c’est un produit scalaire) : un aliment obtient donc une note élevée chez quelqu’un quand il se trouve loin dans la direction de cette personne. Elle part de points tirés au hasard et les déplace un peu, tour après tour, pour que ses estimations collent aux cases connues. Les aliments aimés par les mêmes personnes doivent finir dans la même direction, si bien que les aliments semblables se regroupent. Personne ne lui a parlé du goût sucré : « sucré » n’est qu’une direction qui explique d’un coup beaucoup de « j’aime ».</p>
<div class="insight-visual">estimation = 1er nombre de la personne × 1er de l’aliment + 2e de la personne × 2e de l’aliment → coller aux cases connues → les cases vides sont des estimations</div>
<h3>Nous avions caché la réponse</h3>
<p>Les quarante personnes sont inventées, exprès. Chaque aliment a reçu deux traits secrets, à quel point il est sucré et à quel point il est riche, et chaque personne un goût pour chacun, plus un petit caprice ; le tableau dit si elle a aimé. Puis certaines cases ont été masquées. La méthode ne voit jamais les traits. Comme nous savons ce qu’il y a dans les cases vides, nous pouvons vérifier ses estimations : avec 60 % du tableau vide, elle en trouve environ 82 %, alors que quelqu’un qui connaîtrait exactement les traits secrets en trouverait environ 90 %, à cause des caprices. Avec 90 % de cases vides, elle fait à peine mieux qu’un pile ou face.</p>
<h3>Pas d’étiquettes sur la carte</h3>
<p>Tournez toute la carte, ou retournez-la comme dans un miroir, et chaque estimation reste la même : la méthode ne peut donc pas savoir de quel côté se trouve « sucré ». Les directions ont un sens, mais ce sont les gens qui doivent les nommer. C’est pourquoi les traits secrets apparaissent tournés quand vous les montrez, et un peu décalés : la méthode trouve ce qui explique le mieux le tableau, pas ce que nous avions en tête.</p>
<h3>Votre étoile</h3>
<p>Vos notes vous placent sur la carte : au point dont les estimations leur correspondent le mieux. Les suggestions sont les aliments que vous n’avez pas notés qui ont les estimations les plus hautes, ceux qui sont le plus loin dans votre direction. Notez un seul genre d’aliment, et la carte ne vous connaît que dans une direction : elle vous suggère davantage de la même chose. Vos notes restent sur cette page ; rien n’est envoyé nulle part.</p>
<h3>Ce que cette salle simplifie</h3>
<p>Les vrais goûts demandent plus de deux nombres, et les vrais tableaux sont presque entièrement vides : chaque personne n’a noté qu’une infime partie des films ou des chansons. Le prix Netflix (de 2006 à 2009) offrait un million de dollars pour prédire les notes de films 10 % mieux que le système de Netflix, et les combinaisons des meilleures équipes reposaient surtout sur des méthodes comme celle-ci. Les systèmes de recommandation d’aujourd’hui utilisent bien plus : ce que vous avez fait et quand, où vous êtes, de grands réseaux de neurones, et les objectifs de l’entreprise elle-même. Cette salle montre l’idée, pas la façon dont une entreprise recommande quoi que ce soit aujourd’hui.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Écrivez le tableau comme une matrice R, une ligne par personne et une colonne par aliment, avec +1 pour un « j’aime » et −1 pour un non. La méthode cherche une matrice des personnes U et une matrice des aliments V, de deux colonnes chacune, qui rendent petite la somme Σ (r − uᵢ·vⱼ)² sur les cases connues, plus λ(Σ|uᵢ|² + Σ|vⱼ|²), ici avec λ = 1, par descente de gradient à partir d’un petit départ aléatoire. La pénalité l’empêche de se plier à chaque caprice. Votre point est le u qui rend petite la même somme sur vos seules notes. Sans cases vides et sans pénalité, la meilleure réponse est connue exactement : la décomposition en valeurs singulières, tronquée à ses deux plus grandes valeurs singulières (Eckart et Young, 1936) ; avec des cases vides, il n’existe pas de telle formule, et la méthode ne fait que chercher. La décomposition en valeurs singulières a été trouvée par Eugenio Beltrami en 1873 et par Camille Jordan en 1874. Y. Koren, R. Bell et C. Volinsky, « Matrix factorization techniques for recommender systems », IEEE Computer 42(8), août 2009.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Matrix_factorization_(recommender_systems)" target="_blank" rel="noopener">Factorisation de matrices pour la recommandation (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Décomposition en valeurs singulières (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Netflix_Prize" target="_blank" rel="noopener">Prix Netflix (Wikipédia, en anglais)</a><a class="source-link" href="https://datajobs.com/data-science-repo/Recommender-Systems-%5BNetflix%5D.pdf" target="_blank" rel="noopener">Koren, Bell et Volinsky, Matrix factorization techniques for recommender systems (2009, PDF, en anglais)</a></div>`,
  },
});
