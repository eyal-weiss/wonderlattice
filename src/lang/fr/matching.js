/* Qui demande gagne · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('matching', 'fr', {
  eyebrow: 'PAIRES ÉQUITABLES',
  name: 'Qui demande gagne',
  tagline:
    'Associez six élèves à six clubs pour que personne ne préfère échanger. Le camp qui demande en premier obtient discrètement la meilleure part.',
  title: 'Qui demande gagne.',
  subtitle:
    'Les élèves postulent aux clubs jusqu’à ce que chaque paire soit fixée. Puis ce sont les clubs qui demandent : les mêmes souhaits, un autre appariement équitable, et le bonheur change de camp.',
  field: 'Théorie des jeux · Appariement stable · Conception de marchés',
  sceneLabel: '6 élèves · 6 clubs',
  sceneNames: ['Souhaits emmêlés', 'Un même classement', 'Souhaits opposés'],
  shuffledName: 'Souhaits au hasard',
  tip: 'Touchez un élève, puis un club, pour les associer vous-même · Les flèches visent, Entrée choisit',
  actionLabel: 'Inverser les rôles',
  canvasLabel:
    'Six élèves à gauche, en cercles colorés numérotés, et six clubs à droite, en formes. À côté de chacun, sa liste de souhaits, le préféré en premier. Des lignes relient les paires. Touchez un élève puis un club pour les associer vous-même : une ligne rouge signale deux partenaires qui se préféreraient l’un l’autre.',
  panelEyebrow: 'Qui demande en premier',
  whyLabel: 'Pourquoi demander en premier fait-il gagner ?',
  nudge:
    'Touchez un élève, puis un club, pour les associer à la main. Une ligne rouge signifie que ces deux-là préféreraient tous deux partir ensemble. Trouverez-vous un appariement sans ligne rouge qu’aucune des deux façons de demander ne donne ?',
  connection: {
    html: '<strong>Bien choisir.</strong> Ici, un élève refusé essaie simplement le club suivant. Dans « S’arrêter à 37 % », il faut prendre ou laisser chaque carte pour de bon.',
    label: 'Visiter « S’arrêter à 37 % »',
  },

  presets: [
    { name: 'Souhaits emmêlés', note: 'Demander en premier décide de presque tout.' },
    { name: 'Un même classement', note: 'Tous les clubs classent les élèves de la même façon.' },
    { name: 'Souhaits opposés', note: 'Le club préféré de chaque élève le classe dernier.' },
  ],

  speed: 'Vitesse',
  swap: 'Inverser les rôles en boucle',
  marks: 'Marquer tous les partenaires stables',
  shuffle: 'Nouveaux souhaits',
  count: (n) =>
    n === 1
      ? 'Ces souhaits ne permettent qu’un seul appariement stable : peu importe qui demande.'
      : `Ces souhaits permettent ${n} appariements stables.`,

  // Drawn on the picture: keep them short. « d’abord » (first) names who asks, to fit a phone.
  labels: {
    students: 'ÉLÈVES',
    clubs: 'CLUBS',
    studentsAsk: 'Élèves d’abord',
    clubsAsk: 'Clubs d’abord',
    yours: 'Vos paires',
  },
  // The scoreboard under the lists: how far down their lists each side got, on average.
  score: {
    title: 'CHOIX MOYEN',
    first: '1er',
    last: '6e',
  },

  status: {
    // r: the round, from 1; k: applications on their way that round. French uses the singular for 0 and 1.
    round: (clubs, r, k) =>
      clubs
        ? `Tour ${r} · ${k < 2 ? `${k} club demande` : `${k} clubs demandent`}`
        : `Tour ${r} · ${k < 2 ? `${k} élève postule` : `${k} élèves postulent`}`,
    // firsts: how many on the asking side got their first choice.
    done: (clubs, firsts) =>
      clubs
        ? `Les clubs ont demandé : ${firsts < 2 ? `${firsts} club sur 6 a eu son premier choix` : `${firsts} clubs sur 6 ont eu leur premier choix`}`
        : `Les élèves ont postulé : ${firsts < 2 ? `${firsts} élève sur 6 a eu son premier choix` : `${firsts} élèves sur 6 ont eu leur premier choix`}`,
    unstable: (k) =>
      k === 1
        ? 'Votre appariement : 1 paire préférerait échanger'
        : `Votre appariement : ${k} paires préféreraient échanger`,
    stable: 'Votre appariement est stable : aucune paire ne préférerait échanger',
    stableNew: 'Stable, et aucune des deux façons de demander ne le donne',
  },

  guests: [
    {
      name: 'David Gale',
      note: 'En 1962, Lloyd Shapley et moi avons montré que candidats et universités peuvent toujours être appariés de sorte qu’aucun candidat et aucune université ne se préfèrent mutuellement à leurs partenaires. Notre méthode : postuler, garder la meilleure offre en attente, et ne laisser personne dire oui avant la fin.',
    },
    {
      name: 'Lloyd Shapley',
      note: 'Notre article se terminait en présentant sa preuve principale comme un exemple de mathématiques en anglais ordinaire, sans symboles et presque sans calcul. Un demi-siècle plus tard, j’ai partagé le prix d’économie en mémoire d’Alfred Nobel avec Al Roth, qui a mis l’idée en pratique.',
    },
    {
      name: 'Alvin Roth',
      note: 'Il a remarqué que les hôpitaux américains appariaient les jeunes médecins avec essentiellement cette méthode depuis le début des années 1950, puis a aidé à repenser cet appariement ainsi que le choix des écoles à New York et à Boston.',
    },
  ],

  insight: {
    title: 'Pourquoi demander en premier fait-il gagner ?',
    html: `<p>Un appariement est <em>stable</em> quand aucun élève et aucun club ne se préféreraient l’un l’autre aux partenaires qu’ils ont. Une telle paire partirait simplement ensemble, si bien qu’un appariement instable ne dure pas. En 1962, David Gale et Lloyd Shapley ont montré qu’un appariement stable existe toujours, si emmêlés que soient les souhaits, et ont donné une façon simple d’en trouver un.</p>
<div class="insight-visual">chaque élève sans partenaire postule au meilleur club qu’il n’a pas encore essayé · chaque club garde sa meilleure offre du moment et renvoie les autres · on recommence jusqu’à ce que personne ne soit renvoyé</div>
<h3>Pourquoi c’est stable</h3>
<p>Prenez un élève et un club qui ne sont pas ensemble à la fin. Si l’élève préfère ce club, c’est qu’il y a postulé avant de descendre plus bas dans sa liste, et que le club l’a refusé pour quelqu’un qu’il aimait davantage. Les offres d’un club ne font que s’améliorer, donc il préfère toujours son partenaire final. Aucune paire ne peut partir ensemble.</p>
<h3>Pourquoi ceux qui demandent gagnent</h3>
<p>Il existe en général plusieurs appariements stables. Gale et Shapley ont prouvé que celui que trouve cette méthode donne à chaque élève, à tous à la fois, le meilleur partenaire qu’il puisse avoir dans un appariement stable. La raison : aucun élève n’est jamais refusé par un club qui pourrait être son partenaire dans un appariement stable. Et ce même appariement donne à chaque club le pire partenaire qu’il puisse avoir dans un appariement stable. Inversez les rôles, et les clubs obtiennent leur meilleur, les élèves leur pire. Cochez « Marquer tous les partenaires stables » pour voir chacun arriver sur le premier ou le dernier de ses points.</p>
<p>Quand tous les clubs classent les élèves de la même façon, par exemple selon un même examen, il n’existe qu’un seul appariement stable, et peu importe qui demande. Demander en premier compte quand les souhaits s’opposent.</p>
<h3>Dire la vérité</h3>
<p>Ceux qui demandent ne peuvent pas faire mieux en cachant leurs vrais souhaits ; le camp sollicité, lui, le peut parfois, en refusant une offre qui lui plaît pourtant, mais il faut pour cela connaître les souhaits de tous les autres, et cela peut se retourner contre lui.</p>
<h3>Où on s’en sert</h3>
<p>Les hôpitaux américains appariaient les jeunes médecins avec essentiellement cette méthode dès le début des années 1950, des années avant l’article, comme Alvin Roth l’a remarqué plus tard. À la fin des années 1990, l’appariement des médecins a été repensé pour que ce soient les candidats qui demandent, et des méthodes semblables affectent aujourd’hui les élèves aux écoles de New York et de Boston. En 2012, Shapley et Roth ont partagé le prix d’économie en mémoire d’Alfred Nobel ; Gale était mort en 2008. Dans les études de grands appariements réels, le choix de qui demande n’a changé le résultat que pour très peu de gens.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Dans les vrais appariements, un club a plusieurs places, les ex aequo sont permis, certains laissent une liste incomplète, et des couples veulent rester dans la même ville. Avec des couples, un appariement stable peut ne pas exister du tout. Sans deux camps, comme quand on répartit des colocataires, il peut ne pas exister non plus ; Robert Irving a trouvé en 1985 une méthode qui en trouve un chaque fois qu’il existe. Et « stable » ne veut pas dire « heureux » : cela signifie seulement que personne ne peut partir avec quelqu’un qui veut de lui en retour.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Ici, à chaque tour, tous ceux qui demandent et n’ont pas de partenaire postulent en même temps. L’ordre des candidatures ne change pas le résultat. Avec n de chaque côté, la méthode de Gale et Shapley s’arrête après au plus n² − 2n + 2 tours, 26 pour six de chaque, et au plus n² − n + 1 candidatures en tout, 31. Avec trois de chaque côté, un ordinateur peut essayer tous les jeux de souhaits possibles : le pire demande exactement 5 tours et 7 candidatures. Les appariements stables s’assemblent en un treillis, avec le meilleur pour les élèves à un bout et le meilleur pour les clubs à l’autre (le livre de Donald Knuth de 1976, <em>Mariages stables</em>, l’explore). Pour marquer tous les partenaires stables, cette salle essaie les 720 façons d’associer six élèves à six clubs.</p></details>
<div class="sources"><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2012/popular-information/" target="_blank" rel="noopener">The Nobel Prize (2012), Stable matching: theory, evidence and practical design (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gale%E2%80%93Shapley_algorithm" target="_blank" rel="noopener">L’algorithme de Gale et Shapley (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Resident_Matching_Program" target="_blank" rel="noopener">Le National Resident Matching Program (Wikipédia, en anglais)</a><a class="source-link" href="https://doi.org/10.1257/000282805774670167" target="_blank" rel="noopener">Abdulkadiroğlu, Pathak et Roth (2005), The New York City high school match (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stable_roommates_problem" target="_blank" rel="noopener">Le problème des colocataires stables (Wikipédia, en anglais)</a><a class="source-link" href="https://doi.org/10.2307/2312726" target="_blank" rel="noopener">Gale et Shapley (1962), College admissions and the stability of marriage (en anglais)</a></div>`,
  },
});
