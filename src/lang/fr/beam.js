/* La règle sur la tranche · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('beam', 'fr', {
  eyebrow: 'POUTRES',
  name: 'La règle sur la tranche',
  tagline:
    'Posez une planche d’acier sur la tranche, et elle devient 36 fois plus rigide. Peignez votre propre poutre et trouvez où mettre l’acier.',
  title: 'La règle sur la tranche.',
  subtitle:
    'Une poutre d’acier avec un poids en son milieu, et sa section en dessous. Posez-la sur la tranche, ou peignez les 24 carrés d’acier où vous voulez, et regardez-la fléchir.',
  field: 'Moment quadratique · Théorie des poutres d’Euler–Bernoulli · Poutres en I',
  sceneLabel: 'Une poutre d’acier et sa section',
  sceneNames: {
    plank: 'Une planche à plat',
    edge: 'Sur la tranche',
    ibeam: 'Une poutre en I',
    own: 'Votre propre poutre',
    none: 'Pas encore d’acier',
  },
  tip: 'Touchez les carrés, ou glissez dessus, pour ajouter ou retirer de l’acier · Clavier : les flèches déplacent, Entrée peint, Retour arrière annule',
  actionLabel: 'Tourner de 90°',
  canvasLabel:
    'Une poutre d’acier posée sur deux appuis, avec un poids de 100 kg suspendu en son milieu, au-dessus d’une grille de 12 sur 12 qui montre sa section. Touchez la grille ou glissez dessus pour ajouter ou retirer des carrés d’acier, ou utilisez les flèches du clavier et Entrée.',
  panelEyebrow: 'Acier et forme',
  whyLabel: 'Pourquoi la tranche gagne-t-elle ?',
  nudge:
    'Pouvez-vous battre la planche sur la tranche avec les mêmes 24 carrés ? Ensuite, coupez la fine âme qui relie le haut de votre meilleure poutre à son bas : quelle rigidité reste-t-il aux deux moitiés détachées ?',
  connection: {
    html: '<strong>De l’acier là où il compte.</strong> Un treillis est une poutre dont on a retiré presque tout le milieu : les barres du haut sont comprimées, celles du bas étirées, et des triangles les tiennent ensemble. Voyez-le dans « Le triangle têtu ».',
    label: 'Visiter « Le triangle têtu »',
  },

  presets: [
    { name: 'Une planche à plat', note: '12 cm de large et 2 cm d’épaisseur, posée à plat.' },
    { name: 'Sur la tranche', note: 'La même planche, tournée de 90°.' },
    { name: 'Une poutre en I', note: 'De l’acier en haut et en bas, une fine âme entre les deux.' },
  ],

  undo: 'Annuler',
  clear: 'Effacer',

  // Drawn in the picture: keep these short.
  picture: {
    caption: '3 m d’acier, 100 kg au milieu',
    drawn: (n) => `La flèche est dessinée ${n} fois plus grande`,
    drawnShort: (n) => `Flèche agrandie ${n}×`,
    weight: '100 kg',
    sag: (mm) => `Flèche ${mm} mm`,
    beyond: 'Flèche > 10 cm',
    none: 'Pas d’acier',
    section: 'Section',
    unit: '1 carré = 1 cm',
    squares: (used, total) => `${used} ${used < 2 ? 'carré' : 'carrés'} sur ${total}`,
    stiffness: 'Rigidité',
    times: (x) => `${x}× la planche à plat`,
    timesShort: (x) => `${x}×`,
    chart: 'Même acier, autres formes : quelle rigidité ?',
    rows: { plank: 'Planche à plat', edge: 'Sur la tranche', ibeam: 'Poutre en I', yours: 'La vôtre' },
    marks: { plank: 'À plat', edge: 'Sur la tranche', best: 'Max. avec 24' },
    key: { squeezed: 'Comprimé', stretched: 'Étiré', axis: 'Neutre' },
    loose: (k) => `${k} morceaux séparés : chacun plie seul`,
    wobbly: 'Instable : elle pourrait basculer sur le côté',
    full: 'Plus d’acier : touchez un carré pour le retirer',
    best: 'Aussi rigide que 24 carrés le permettent',
  },

  // The panel's readout and the status line.
  status: {
    sag: (mm) => `Flèche ${mm} mm`,
    said: (mm, x) => `Flèche ${mm} mm, rigidité ${x} fois celle de la planche à plat`,
    beyond: 'Flèche de plus de 10 cm',
    none: 'Pas d’acier',
  },
  readout: {
    sag: (mm) => `Flèche ${mm} mm`,
    times: (x) => `${x}× la planche à plat`,
    plank: 'La planche à plat',
    used: (used, total) =>
      used === total
        ? `Les ${total} carrés d’acier sont utilisés.`
        : `${used} ${used < 2 ? 'carré d’acier utilisé' : 'carrés d’acier utilisés'} sur ${total}.`,
    none: 'Peignez quelques carrés d’acier dans la grille.',
    beyond: 'Au-delà de 10 cm, la théorie simple utilisée ici n’est plus fiable.',
    loose: (k) =>
      `${k} morceaux séparés : des carrés qui ne partagent pas de côté glissent l’un contre l’autre, si bien que chaque morceau plie seul.`,
    wobbly:
      'Haute et fine : sous le poids, elle pourrait basculer, ou se tordre sur le côté (une règle empirique, voir « Pourquoi »).',
    best: 'Aussi rigide que 24 carrés peuvent l’être dans cette grille.',
  },

  guests: [
    {
      name: 'Galilée',
      note: 'En 1638, j’ai écrit qu’une règle posée sur la tranche résiste mieux à la rupture qu’une règle posée à plat, autant de fois qu’elle est plus large qu’épaisse. J’ai aussi remarqué que les os des oiseaux et les roseaux sont creux : légers, et pourtant difficiles à plier.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Jacques Bernoulli avait supposé qu’une poutre fléchie se courbe en proportion de la force de rotation qu’elle subit. En 1744, j’ai suivi cette idée avec le calcul infinitésimal et trouvé les courbes que prennent des lames élastiques fléchies.',
    },
    {
      name: 'Claude-Louis Navier',
      note: 'En 1819, j’ai trouvé où passe vraiment, dans une poutre fléchie, la ligne qui n’est ni comprimée ni étirée, corrigeant ainsi Galilée. En 1826, j’ai séparé ce que le matériau d’une poutre apporte à sa rigidité de ce qu’y apporte sa forme.',
    },
  ],

  insight: {
    title: 'Pourquoi la tranche gagne-t-elle ?',
    html: `<p>Quand on plie une poutre, son dessus est comprimé et son dessous étiré. Entre les deux court une ligne qui n’est ni l’un ni l’autre, l’axe neutre, qui passe par le milieu de la section (son centre de gravité). L’acier éloigné de cette ligne est très comprimé ou très étiré pour une petite flexion : il résiste donc fort, et avec un plus grand bras de levier en plus. Les deux effets grandissent avec la distance, si bien que chaque carré compte avec le <em>carré</em> de sa distance à la ligne. En les additionnant, on obtient le moment quadratique, I, en cm⁴.</p>
<div class="insight-visual">I = Σ (1/12 + d²) sur les carrés · flèche = F·L³ ⁄ (48·E·I)</div>
<h3>À plat ou sur la tranche</h3>
<p>Pour un rectangle de largeur b et de hauteur h, I = b·h³ ⁄ 12 : sa hauteur y compte trois fois. La planche de 12 cm de large et 2 cm d’épaisseur a I = 8 cm⁴ posée à plat et 288 cm⁴ sur la tranche : (12 ÷ 2)² = 36 fois plus rigide, avec le même acier. Avec 100 kg au milieu de 3 m d’acier (E = 200 GPa), elle fléchit de 34 mm à plat et de moins de 1 mm sur la tranche. Une règle en plastique de 30 mm de large et 1 mm d’épaisseur est (30 ÷ 1)² = 900 fois plus rigide sur la tranche.</p>
<h3>La poutre en I</h3>
<p>Le meilleur endroit pour l’acier est aussi loin du milieu que possible : une semelle en haut, une autre en bas. Mais il faut les relier, sinon elles glissent l’une contre l’autre comme les pages d’un livre, et chacune plie seule : deux bandes séparées de 12 carrés ont ensemble I = 2 cm⁴. Une fine âme les tient ensemble. Avec 7 carrés dans chaque semelle et 10 dans l’âme, I = 508 cm⁴, soit 63,5 fois la planche à plat, et le maximum que 24 carrés reliés puissent donner dans cette grille. Les os, le bambou, les cadres de vélo et les tubes d’échafaudage sont creux pour la même raison. En 1638, Galilée citait les os des oiseaux et les roseaux, et montrait qu’une règle sur la tranche est plus difficile à casser, dans le rapport de sa largeur à son épaisseur.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Une poutre haute et fine gagne sur le papier, mais elle peut basculer, ou se tordre et flamber de côté sous sa charge (le déversement), et une âme ou une semelle trop fine peut se froisser. L’alerte « Instable » est une règle empirique propre à cette salle : une forme plus de 20 fois plus rigide de haut en bas que sur le côté. Les ingénieurs vérifient le comportement réel, qui dépend aussi de la portée, de la charge et de la résistance de la poutre à la torsion, et ils contreventent les poutres hautes et fines comme les solives de plancher. La rigidité (de combien une poutre fléchit) n’est pas la résistance (quand elle casse, ou se plie pour de bon) : cette salle parle de rigidité. La flèche vient de la théorie des petites flèches. Elle ignore le poids propre de la poutre (environ 57 kg d’acier ici, qui ajouterait environ un tiers à chaque flèche) et le petit surcroît de souplesse dû au cisaillement, et elle suppose que la poutre est maintenue droite sur le côté, si bien qu’une forme dissymétrique ne part pas de travers. Des carrés qui partagent un côté comptent comme soudés ; des carrés qui ne se touchent que par un coin, non.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Un carré de côté 1 dont le centre est à une distance d de l’axe neutre ajoute ∫ y² dA = 1/12 + d² à I (le théorème des axes parallèles, ou de Huygens), donc I est une somme sur les carrés peints. L’axe neutre de chaque morceau passe par son centre de gravité : la hauteur moyenne de ses carrés. Les morceaux séparés sont traités comme des poutres qui fléchissent côte à côte avec la même flèche, si bien que leurs I s’additionnent. La forme de la poutre fléchie est v(x) = F·x·(3L² − 4x²) ⁄ (48·E·I) jusqu’au milieu, où la flèche vaut F·L³ ⁄ (48·E·I). Le maximum que 24 carrés reliés peuvent atteindre a été trouvé par une recherche exacte sur le nombre de carrés de chaque rangée : chaque rangée entre le haut et le bas en demande au moins un, et le meilleur endroit pour les autres est la rangée du haut et celle du bas, à parts égales. Les chiffres ont été vérifiés par un programme indépendant.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Second_moment_of_area" target="_blank" rel="noopener">Moment quadratique (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euler%E2%80%93Bernoulli_beam_theory" target="_blank" rel="noopener">Théorie des poutres d’Euler–Bernoulli (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/I-beam" target="_blank" rel="noopener">Poutre en I (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Claude-Louis_Navier" target="_blank" rel="noopener">Claude-Louis Navier (Wikipédia, en anglais)</a><a class="source-link" href="https://archive.org/details/dialoguesconcern00galiuoft" target="_blank" rel="noopener">Galilée (1638), Dialogues Concerning Two New Sciences, deuxième journée (trad. Crew et de Salvio, 1914, en anglais)</a></div>`,
  },
});
