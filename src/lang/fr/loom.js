Wonderlattice.defineText('loom', 'fr', {
  eyebrow: 'TISSAGE',
  name: 'Le métier à tisser mathématique',
  tagline: 'Changez une case d’une minuscule grille de oui et de non, et tout le tissu change.',
  title: 'Le métier à tisser mathématique.',
  subtitle:
    'Touchez des cases pour choisir quels fils se lèvent, et regardez un tissu naître de simples choix entre oui et non.',
  field: 'Tissage · Motifs binaires · Répétition',
  sceneLabel: 'Un métier à quatre cadres',
  sceneName: 'Du schéma au tissu',
  tip: 'À gauche : le schéma · À droite : son tissu · Cliquez sur l’attachage pour le modifier, ou utilisez ses cases dans le panneau',
  tipStacked:
    'En haut : le schéma · En dessous : son tissu · Cliquez sur l’attachage, ou utilisez ses cases dans le panneau',
  actionLabel: 'Surprenez-moi',
  canvasLabel:
    'Un schéma de tissage à côté du tissu qu’il produit. Modifiez l’attachage en cliquant dessus ici, ou avec ses cases dans le panneau.',
  panelEyebrow: 'Préparer le métier',
  whyLabel: 'Comment une grille fait-elle du tissu ?',
  nudge:
    'Commencez par « Sergé », puis changez une case de l’attachage. Chaque rang tissé avec cette pédale change d’un coup.',
  connection: {
    html: '<strong>Une petite règle, répétée partout.</strong> L’attachage décide de chaque croisement dans le tissu. Dans « Un esprit collectif », de petites règles entre voisins façonnent toute une foule.',
    label: 'Visiter « Un esprit collectif »',
  },
  presets: [
    {
      name: 'Toile',
      note: 'Un fil dessus, un fil dessous.',
    },
    {
      name: 'Sergé',
      note: 'Une diagonale, comme le denim.',
    },
    {
      name: 'Pied-de-poule',
      note: 'Du sergé, avec quatre fils foncés et quatre clairs.',
    },
    {
      name: 'Des rayures, pas des carreaux',
      note: 'Alterner les couleurs dans les deux sens.',
    },
    {
      name: 'Œil-de-perdrix',
      note: 'En pointe dans les deux sens : de minuscules losanges.',
    },
    {
      name: 'Chevron',
      note: 'Le sergé revient sur lui-même.',
    },
  ],
  tieup: 'Quels cadres se lèvent pour chaque pédale (l’attachage)',
  tieupHint:
    'Chaque cadre porte une partie des fils de chaîne, ceux qui vont dans la longueur. Une case allumée signifie que cette pédale lève ce cadre.',
  tieupCell: (pedal, shaft) => `La pédale ${pedal} lève le cadre ${shaft}`,
  treadleLabel: (n) => `Pédale ${n}`,
  shaftLabel: (n) => `Cadre ${n}`,
  threading: 'Ordre des fils',
  treadling: 'Ordre des pédales',
  orders: ['Suivi', 'En pointe', 'Brisé', 'Doublé'],
  warpColours: 'Fils de chaîne',
  weftColours: 'Fils de trame',
  colourOrders: ['Tout foncé', '4 et 4', 'En alternance', '2 et 2', 'Tout clair'],
  palette: 'Fil',
  palettes: ['Indigo et crème', 'Garance et or', 'Forêt et lin', 'Nuit et argent'],
  repeat: (across, down) =>
    across === 1 && down === 1 ? 'Une seule couleur partout' : `Motif de ${across} × ${down} fils`,
  float: (n) =>
    n === Infinity
      ? 'Ici, un fil ne s’entrecroise jamais. Ce tissu tomberait en morceaux.'
      : n === 1
        ? 'Chaque fil passe au-dessus d’un fil, puis au-dessous du suivant : un tissu ferme.'
        : n <= 3
          ? `Les fils flottent par-dessus ${n} autres au plus : un tissu plus souple, plus fluide.`
          : `Des flottés de ${n} fils : longs et lâches, ils s’accrochent facilement.`,
  labels: {
    draft: 'SCHÉMA',
    cloth: 'TISSU',
  },
  guests: [
    {
      name: 'Ada Lovelace',
      note: 'Elle a décrit comment la machine de Babbage, pilotée par des cartes perforées comme un métier Jacquard, pourrait tisser des motifs algébriques.',
    },
  ],
  insight: {
    title: 'Une grille qui tisse.',
    html: `<p>Chaque tissu, ici, naît de trois courtes listes. L’<em>enfilage</em> dit dans lequel des quatre cadres passe chaque fil de chaîne (dans la longueur). L’<em>attachage</em> dit quels cadres chaque pédale soulève. Le <em>pédalage</em> dit quelle pédale on enfonce à chaque passage de trame (en travers). Partout où un fil de chaîne levé croise la trame, la chaîne apparaît dessus.</p>
<div class="insight-visual">tissu = pédalage × attachage × enfilage, un produit de grilles de 0 et de 1</div>
<h3>Petit changement, tissu entier</h3>
<p>Changez une case de l’attachage, et chaque passage tissé avec cette pédale change d’un coup. C’est ainsi que les tisserands conçoivent sur papier : la grille à gauche de l’image est un vrai schéma de tissage.</p>
<h3>La couleur est un second motif</h3>
<p>Colorez aussi les fils, et l’armure se combine avec l’ordre des couleurs. Un sergé 2/2 avec quatre fils foncés et quatre clairs dans chaque sens donne du pied-de-poule. Une toile aux couleurs alternées donne des rayures, pas les carreaux auxquels on pourrait s’attendre.</p>
<h3>Les flottés tiennent le tissu</h3>
<p>Un fil qui passe par-dessus plusieurs autres sans s’entrecroiser forme un flotté. Des flottés courts font un tissu ferme ; des flottés longs le rendent souple, mais plus sujet aux accrocs. Un fil qui ne s’entrecroise jamais ne fait pas de tissu du tout.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Écrivez l’enfilage comme une grille H (le fil de chaîne j est sur le cadre s), l’attachage comme U (la pédale t lève le cadre s) et le pédalage comme T (le passage i utilise la pédale t). Le tissu est D = T · U · Hᵀ, en arithmétique booléenne, où 1 + 1 = 1. Comme les trois listes se répètent, le tissu aussi : sa période divise le plus petit commun multiple des longueurs des listes et des ordres de couleurs.</p><p>Ce métier a quatre cadres et quatre pédales, comme beaucoup de métiers de table et de métiers à pédales. Un vrai tissu dépend aussi du fil, de l’espacement et de la tension, que cette image laisse de côté.</p></details>
<div class="sources"><a class="source-link" href="https://www.tandfonline.com/doi/abs/10.1080/0025570X.1980.11976845" target="_blank" rel="noopener">Satins et sergés : la géométrie des tissus (Grünbaum &amp; Shephard, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Houndstooth" target="_blank" rel="noopener">Comment se tisse le pied-de-poule (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/" target="_blank" rel="noopener">Ada Lovelace et le métier Jacquard (en anglais)</a></div>`,
  },
});
