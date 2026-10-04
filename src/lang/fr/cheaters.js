/* Kaléidoscope de tricheurs · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('cheaters', 'fr', {
  eyebrow: 'COOPÉRATION',
  name: 'Kaléidoscope de tricheurs',
  tagline:
    'Un tricheur parmi des coopérateurs, une règle toute simple, et un tapis de guerre et de paix qui ne cesse de changer.',
  title: 'Kaléidoscope de tricheurs.',
  subtitle:
    'Tricher rapporte toujours plus. Pourtant, quand chacun copie celui de ses voisins qui a le mieux réussi, un seul tricheur se déploie en kaléidoscope, et les coopérateurs ne disparaissent jamais.',
  field: 'Théorie des jeux · Le dilemme du prisonnier · Automates cellulaires',
  sceneLabel: '99 × 99 joueurs · Copier le meilleur',
  sceneNames: ['Un tricheur', 'Une foule mélangée', 'Changer un par un'],
  mixed: 'Votre propre grille',
  tip: 'Touchez une case pour la faire tricher, ou coopérer de nouveau · Les flèches visent, Entrée fait changer la case',
  actionLabel: 'Ajouter un tricheur au hasard',
  canvasLabel:
    'Une grille de joueurs : les coopérateurs en bleu, les tricheurs en rouge, et en jaune et en vert les joueurs qui viennent de changer. Touchez une case pour la faire changer, ou visez avec les flèches et appuyez sur Entrée pour la faire changer.',
  panelEyebrow: 'Copier le meilleur',
  whyLabel: 'Pourquoi les tricheurs ne gagnent-ils pas ?',
  nudge:
    'Appuyez sur « Ajouter un tricheur au hasard », ou touchez une case loin du centre : la symétrie parfaite se brise. Puis décochez « Tout le monde change en même temps ».',
  connection: {
    html: '<strong>Copier ses voisins.</strong> Ici, des joueurs qui copient celui qui réussit le mieux autour d’eux tissent un tapis. Dans « Un esprit collectif », des oiseaux qui suivent quelques voisins se déplacent en une seule nuée.',
    label: 'Visiter « Un esprit collectif »',
  },

  presets: [
    { name: 'Un tricheur', note: 'Un seul tricheur, au milieu.' },
    { name: 'Une foule mélangée', note: 'Au départ, un joueur sur dix triche.' },
    { name: 'Un par un', note: 'Les joueurs changent chacun leur tour, pas tous ensemble.' },
  ],

  temptation: 'Tentation',
  temptationHint:
    'Ce que gagne un tricheur pour chaque coopérateur qu’il rencontre. Deux coopérateurs gagnent 1 chacun.',
  window: 'Le kaléidoscope vit entre 1,8 et 2.',
  speed: 'Vitesse',
  perSecond: (n) => (n === 1 ? '1 génération par seconde' : `${n} générations par seconde`),
  together: 'Tout le monde change en même temps',
  fresh: 'Colorer ceux qui viennent de changer',
  next: 'Génération suivante',

  // Les mots dessinés sur l’image.
  key: {
    title: 'QUI EST QUI',
    cooperator: 'Coopère',
    cheater: 'Triche',
    newCooperator: 'Se met à coopérer',
    newCheater: 'Se met à tricher',
  },
  chart: {
    title: 'PART QUI COOPÈRE',
    estimate: 'Nowak et May : 31,8 %',
    span: (n) => (n === 1 ? 'dernière génération' : `${n} dernières générations`),
  },

  // Les nombres arrivent déjà écrits dans la langue de la page.
  inspect: {
    title: 'PROCHAIN COUP D’UN JOUEUR',
    hint: 'Pointez un joueur, ou visez avec les flèches, pour voir les scores autour de lui.',
    player: (cheats, score) =>
      cheats ? `Ce joueur triche et a marqué ${score}.` : `Ce joueur coopère et a marqué ${score}.`,
    best: (cheats, score) =>
      cheats
        ? `Le meilleur score autour de lui, le sien compris, est celui d’un tricheur : ${score}.`
        : `Le meilleur score autour de lui, le sien compris, est celui d’un coopérateur : ${score}.`,
    tie: (score) =>
      `Un coopérateur et un tricheur se partagent le meilleur score, ${score} ; il garde donc sa stratégie.`,
    next: (cheats) => (cheats ? 'Il trichera donc au prochain coup.' : 'Il coopérera donc au prochain coup.'),
  },

  status: (gen, percent) => `Génération ${gen} · ${percent} % coopèrent`,
  settled: (gen, percent) => `Figé pour de bon dès la génération ${gen} · ${percent} % coopèrent`,
  repeating: (period, percent) => `Se répète toutes les ${period} générations · ${percent} % coopèrent`,
  allCheat: (gen) => `Génération ${gen} · tous les joueurs trichent`,
  allCooperate: (gen) => `Génération ${gen} · tous les joueurs coopèrent`,
  stray: 'Un tricheur apparaît au hasard.',

  guests: [
    {
      name: 'Robert May',
      note: 'En 1992, avec Martin Nowak, j’ai laissé des joueurs sur une grille copier ceux de leurs voisins qui réussissaient le mieux. Les coopérateurs ont survécu, en motifs toujours changeants, sans aucune mémoire ni la moindre astuce.',
    },
    {
      name: 'Martin Nowak',
      note: 'Avec Robert May, il a découvert le kaléidoscope de cette salle. Il étudie comment la coopération évolue, des cellules aux sociétés.',
    },
    {
      name: 'Albert Tucker',
      note: 'En 1950, pour expliquer à des psychologues de Stanford un jeu venu de la RAND Corporation, je l’ai raconté comme l’histoire de deux prisonniers. Le nom est resté.',
    },
  ],

  insight: {
    title: 'Pourquoi les tricheurs ne gagnent-ils pas ?',
    html: `<p>Chaque case est un joueur du <em>dilemme du prisonnier</em>. Deux coopérateurs s’en sortent bien tous les deux. Un tricheur qui rencontre un coopérateur s’en sort encore mieux, et le coopérateur n’obtient rien. Deux tricheurs n’obtiennent rien. Quoi que fasse l’autre joueur, tricher rapporte plus ; dans une foule où chacun rencontre tout le monde, les tricheurs devraient donc tout envahir.</p>
<div class="insight-visual">coopérateur + coopérateur : 1 chacun · tricheur + coopérateur : la tentation pour le tricheur, 0 pour le coopérateur · tricheur + tricheur : 0 chacun</div>
<h3>Des voisins, pas des inconnus</h3>
<p>Ici, chaque joueur ne rencontre que ses huit voisins, puis copie celui qui a fait le mieux autour de lui, lui-même compris. Personne ne se souvient, ne prévoit ni ne punit. Un coopérateur au sein d’un groupe de coopérateurs gagne beaucoup, si bien que les coopérateurs groupés s’abritent les uns les autres. Un tricheur au bord d’un groupe gagne plus que quiconque et le grignote, mais un tricheur entouré de tricheurs ne gagne rien. Aucun des deux camps ne peut l’emporter partout.</p>
<h3>Le kaléidoscope</h3>
<p>Martin Nowak et Robert May l’ont découvert en 1992. Avec une tentation entre 1,8 et 2, un seul tricheur au milieu de 99 × 99 coopérateurs se déploie en un motif qui garde à chaque étape toute la symétrie du carré, et ne cesse de changer. Toutes les tentations de cet intervalle donnent exactement les mêmes images. Pour la plupart des départs au hasard, la part des coopérateurs oscille autour d’un tiers : Nowak et May l’ont estimée à 12 ln 2 − 8, soit environ 31,8 %. En dessous de 1,8, les tricheurs restent en petits blocs et en lignes fines. Au-dessus de 2, ils se répandent, et, à partir d’un départ au hasard, ils prennent presque tout.</p>
<h3>Pas tout à fait pour toujours</h3>
<p>Une grille de 9 801 joueurs n’a qu’un nombre fini de motifs, et la règle ne change jamais : tôt ou tard, un motif doit donc revenir, et à partir de là tout se répète. En 2022, Te Wu, Feng Fu et Long Wang ont suivi le tricheur unique jusqu’à ce que cela arrive : après environ un milliard de générations, le motif tombe dans une boucle de quatre étapes, avec seulement 96 coopérateurs, qui tournent en 16 petits groupes. À cinq générations par seconde, il faudrait attendre environ six ans et demi.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Le kaléidoscope exige que tout le monde change au même instant. En 1993, Bernardo Huberman et Natalie Glance ont fait remarquer que de vrais joueurs ne partagent aucune horloge : quand ils changent un par un, dans un ordre aléatoire, les tricheurs l’emportent à ces tentations en deux cents générations environ. Décochez « Tout le monde change en même temps » pour le voir. En 1994, Nowak, Sebastian Bonhoeffer et May ont répondu que coopérateurs et tricheurs vivent tout de même côte à côte sur une large gamme de tentations ; ici, essayez les changements un par un avec une tentation de 1,6. Ces joueurs ne jouent en outre chaque partie qu’une fois et ne se souviennent de rien, alors que les humains et les animaux se souviennent, pardonnent et choisissent qui ils rencontrent. Cette salle montre donc une façon dont la coopération peut durer : en se serrant les coudes. Elle ne montre pas que les gens sont gentils, ni que la triche ne paie jamais.</p>
<p>Une autre façon est de se rencontrer encore et encore. Dans les tournois du jeu répété organisés par Robert Axelrod vers 1980, la plus simple des stratégies inscrites, « donnant-donnant » d’Anatol Rapoport (coopérer d’abord, puis copier le dernier coup de l’autre joueur), a gagné les deux fois. Cela n’en fait pas la meilleure stratégie : avec des erreurs et d’autres adversaires, le classement change. <em>The Evolution of Trust</em>, de Nicky Case, raconte magnifiquement cette histoire.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Chaque joueur joue une fois avec chacun de ses voisins, et une fois avec lui-même (la convention de Nowak et May). Un coopérateur marque donc le nombre de coopérateurs de son bloc 3 × 3, lui-même compris (de 0 à 9), et un tricheur marque la tentation b multipliée par le nombre de coopérateurs autour de lui (de 0 à 8). Seules comptent des comparaisons comme 8b contre 9 ; le comportement ne change donc que là où b franchit une fraction comme 9/8, 9/5 ou 2. Un tricheur isolé marque 8b, ses voisins 8, et les coopérateurs juste au-delà 9 : il s’empare donc de ses huit voisins quand b dépasse 9/8. Les bords sont fixes : un joueur au bord a simplement moins de voisins. Quand le meilleur coopérateur et le meilleur tricheur des environs ont exactement le même score, un joueur garde ici sa stratégie (cela n’arrive que pour quelques tentations exactes, comme 1,5 ou 2).</p><p>Quand « Tout le monde change en même temps » est décoché, chaque génération tire 9 801 joueurs au hasard, l’un après l’autre (certains deux fois, d’autres pas du tout) ; chacun copie celui qui a le meilleur score autour de lui, dans l’état où sont les choses à ce moment-là. Les motifs de cette salle ont été comparés, case par case, à ceux d’un programme indépendant, sur les 300 premières générations.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1038/359826a0" target="_blank" rel="noopener">Nowak et May (1992), « Evolutionary games and spatial chaos » (en anglais)</a><a class="source-link" href="https://math.libretexts.org/Bookshelves/Applied_Mathematics/Agent-Based_Evolutionary_Game_Dynamics_(Izquierdo_Izquierdo_and_Sandholm)/03:_Spatial_interactions_on_a_grid/3.01:_Spatial_chaos_in_the_Prisoner's_Dilemma" target="_blank" rel="noopener">Izquierdo, Izquierdo et Sandholm, « Spatial chaos in the Prisoner’s Dilemma » (en anglais)</a><a class="source-link" href="https://arxiv.org/abs/chao-dyn/9307017" target="_blank" rel="noopener">Huberman et Glance (1993), « Evolutionary games and computer simulations » (en anglais)</a><a class="source-link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC43892/" target="_blank" rel="noopener">Nowak, Bonhoeffer et May (1994), « Spatial games and the maintenance of cooperation » (en anglais)</a><a class="source-link" href="https://arxiv.org/abs/2209.08267" target="_blank" rel="noopener">Wu, Fu et Wang (2022), « Evolutionary games and spatial periodicity » (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/The_Evolution_of_Cooperation" target="_blank" rel="noopener">The Evolution of Cooperation (Axelrod, en anglais)</a><a class="source-link" href="https://ncase.me/trust/" target="_blank" rel="noopener">Nicky Case, The Evolution of Trust (en anglais)</a></div>`,
  },
});
