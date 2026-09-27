Wonderlattice.defineText('tiles', 'fr', {
  eyebrow: 'PAVAGE',
  name: 'Un carreau qui remplit le monde',
  tagline: 'Courbez un côté d’un carreau, son partenaire se courbe pareil, et le motif couvre toujours tout.',
  title: 'Un carreau qui remplit le monde.',
  subtitle:
    'Faites glisser les points pour courber les côtés. Quelle que soit la forme, ses copies s’emboîtent toujours sans trous.',
  field: 'Symétrie · Pavages · Créatures',
  sceneLabel: 'Un carreau, répété à l’infini',
  sceneName: 'Votre carreau',
  tip: 'Faites glisser les points du carreau entouré · Les flèches déplacent le point choisi, Entrée passe au suivant',
  actionLabel: 'Inventer une créature',
  canvasLabel:
    'Un plan couvert de copies d’un carreau. Faites glisser les points du carreau entouré pour courber ses côtés ; les côtés associés suivent, et toutes les copies changent avec lui.',
  panelEyebrow: 'Façonnez le carreau',
  whyLabel: 'Pourquoi ça s’emboîte toujours ?',
  nudge:
    'Tirez un point vers l’extérieur et regardez son jumeau sur le côté associé : la bosse que vous faites est exactement le creux dont le voisin a besoin.',
  connection: {
    html: '<strong>Quelques règles, répétées partout.</strong> Ici, la façon dont les côtés vont par paires décide de tout le motif. Dans le métier à tisser, une grille minuscule décide de tout le tissu.',
    label: 'Visiter « Le métier à tisser mathématique »',
  },
  presets: [
    { name: 'Poissons', note: 'Des carrés qui glissent.' },
    { name: 'Moulinet', note: 'Des carrés qui tournent.' },
    { name: 'Poussins', note: 'Des hexagones qui glissent.' },
  ],
  rule: 'Comment les côtés vont par paires',
  rules: [
    'Des carrés qui glissent',
    'Des carrés qui tournent',
    'Des hexagones qui glissent',
    'Des hexagones qui tournent',
  ],
  ruleNotes: [
    'Chaque côté glisse jusqu’au côté opposé.',
    'Quatre carreaux tournent autour d’un coin.',
    'Chaque côté glisse jusqu’au côté opposé.',
    'Trois carreaux tournent autour d’un coin.',
  ],
  palette: 'Couleurs',
  palettes: ['Jardin', 'Mer', 'Crépuscule', 'Bonbons'],
  eye: 'Lui donner un œil',
  size: 'Taille du carreau',
  point: (n, total) => `Point ${n} sur ${total}`,
  changed: 'Le carreau a changé de forme, et ses copies remplissent toujours le plan.',
  invented: 'Une nouvelle créature, et elle remplit toujours le plan.',
  plain: 'De nouveau un carreau simple, aux côtés droits. Courbez-le pour en faire quelque chose.',
  ruleChanged: (name) => `${name}. Les mêmes courbes, associées autrement.`,
  guests: [
    {
      name: 'Marjorie Rice',
      note: 'À la table de sa cuisine, dans les années 1970 et sans diplôme de mathématiques, elle a trouvé de nouveaux pentagones qui pavent le plan.',
    },
    {
      name: 'M. C. Escher',
      note: 'Artiste plutôt que mathématicien, il a rempli des plans entiers d’oiseaux, de poissons et de lézards qui s’emboîtent comme les pièces d’un puzzle.',
    },
  ],
  insight: {
    title: 'Pourquoi le carreau s’emboîte-t-il toujours ?',
    html: `<p>Chaque côté du carreau va par paire. Quand vous courbez un côté, son partenaire n’est pas courbé à part : c’est une copie de la même courbe, glissée de l’autre côté ou tournée autour d’un coin. Ainsi, chaque bosse que vous faites d’un côté est exactement le creux dont une copie voisine a besoin de l’autre. Les copies ne peuvent ni se chevaucher ni laisser de trous.</p>
<div class="insight-visual">courbez un côté → son partenaire est la même courbe, déplacée → les voisins s’emboîtent</div>
<h3>Les règles sont des symétries</h3>
<p>Les mouvements qui associent les côtés sont les mêmes que ceux qui disposent les carreaux sur tout le plan : des glissements pour « Des carrés qui glissent » et « Des hexagones qui glissent », des quarts de tour autour de deux coins pour « Des carrés qui tournent », et des tiers de tour autour de coins alternés pour « Des hexagones qui tournent ». Les mathématiciens classent les motifs répétés selon leurs symétries et ont montré qu’il en existe exactement 17 sortes, les groupes de papier peint. Cette salle en propose quatre.</p>
<h3>Des amateurs qui ont changé l’histoire</h3>
<p>Dans les années 1970, Marjorie Rice, mère au foyer à San Diego sans formation mathématique, a lu des articles sur la recherche des pentagones qui pavent le plan et en a trouvé quatre nouvelles sortes, à la table de sa cuisine. En 2023, David Smith, technicien d’imprimerie à la retraite qui aimait jouer avec les formes, a trouvé le « chapeau » : un seul carreau qui couvre le plan sans jamais se répéter (en utilisant ses images miroir ; un cousin plus récent, le « spectre », n’en a même pas besoin). Les mathématiciens cherchaient un tel carreau « einstein » depuis des décennies ; avec Joseph Myers, Craig Kaplan et Chaim Goodman-Strauss, il a prouvé qu’il fonctionne. Le chapeau n’est pas montré dans cette salle.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Un carreau qui couvre le plan avec des copies de lui-même, toutes reliées par des symétries du motif, est dit isoédral. Ici, chaque côté libre est une courbe lisse qui passe par les coins et par trois points de contrôle ; chacun des autres côtés est son image par une translation ou une rotation (de 90° autour de coins opposés du carré, ou de 120° autour de coins alternés de l’hexagone). Comme chaque côté est partagé par exactement deux copies, l’aire du carreau ne change jamais, quoi que vous dessiniez : ce qu’un côté gagne, son partenaire le rend.</p><p>Les couleurs sont choisies pour que deux voisins diffèrent toujours : selon l’orientation pour les règles qui tournent, et selon la position dans le réseau pour celles qui glissent.</p></details>
<p>Pour aller plus loin : J. H. Conway, H. Burgiel et C. Goodman-Strauss, <em>The Symmetries of Things</em> (A K Peters, 2008).</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Wallpaper_group" target="_blank" rel="noopener">Les 17 groupes de papier peint (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Marjorie_Rice" target="_blank" rel="noopener">Marjorie Rice (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Einstein_problem" target="_blank" rel="noopener">Le problème de l’einstein et le chapeau (en anglais)</a><a class="source-link" href="https://arxiv.org/abs/2303.10798" target="_blank" rel="noopener">An aperiodic monotile (Smith, Myers, Kaplan et Goodman-Strauss, 2023) (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/M._C._Escher" target="_blank" rel="noopener">M. C. Escher (en anglais)</a></div>`,
  },
});
