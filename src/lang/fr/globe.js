/* Le triangle aux trois angles droits · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('globe', 'fr', {
  eyebrow: 'ESPACE COURBE',
  name: 'Le triangle aux trois angles droits',
  tagline:
    'Sur une boule, un triangle peut avoir trois angles droits, et une flèche qu’on promène tout autour revient tournée.',
  title: 'Le triangle aux trois angles droits.',
  subtitle:
    'Un triangle tracé sur une boule, dont les angles font 270° au total. Faites glisser ses coins, ou rétrécissez-le jusqu’à ce que la boule paraisse plate.',
  field: 'Géométrie sphérique · Courbure · Transport parallèle',
  sceneLabel: 'Sur une boule · des côtés droits, des angles dodus',
  tip: 'Faites glisser un coin pour remodeler le triangle, ou la boule pour la tourner · Clavier : 1, 2, 3 choisissent un coin, les flèches le déplacent (ou tournent la boule), Échap le relâche, Entrée refait le tour',
  actionLabel: 'Refaire le tour',
  canvasLabel:
    'Une boule quadrillée de méridiens et de parallèles. Dessus, un triangle dont les côtés sont des arcs de grands cercles, avec ses trois angles indiqués. Un marcheur porte une flèche tout autour du triangle.',
  panelEyebrow: 'Façonnez le triangle',
  whyLabel: 'Pourquoi plus de 180° ?',
  nudge:
    'Baissez la taille jusqu’à ce que le triangle ne soit plus qu’un point. Ses angles reviennent peu à peu à 180°, car pour une fourmi, une boule paraît plate.',
  connection: {
    html: '<strong>Surfaces courbes, règles droites.</strong> Sur une boule, les triangles prennent des angles dodus. Dans « Courber le plan », une fonction courbe une image plate et garde chaque minuscule angle tel qu’il était.',
    label: 'Courber le plan',
  },

  presets: [
    { name: 'Trois angles droits', note: 'Du pôle à l’équateur, un quart de tour, et retour.' },
    {
      name: 'Un quart de la boule',
      note: 'Trois angles de 120°. Quatre triangles comme celui-ci recouvrent la boule.',
    },
    { name: 'Le triangle d’une fourmi', note: 'Si petit qu’il est presque plat.' },
  ],
  yourOwn: 'Votre propre triangle',

  // Les nombres arrivent déjà écrits dans la langue de la page.
  degrees: (x) => `${x}°`,
  percent: (x) => `${x} %`,
  sum: (parts, total) => `${parts.join(' + ')} = ${total}`,
  more: (extra) => `${extra} de plus que dans le plan (180°)`,
  walking: 'La flèche avance, sans jamais tourner…',
  home: (turned) => `De retour : la flèche a tourné de ${turned}`,
  zoomed: (n) => `Vu ${n} fois plus près`,
  chart: {
    title: 'Tous vos triangles tombent sur une même droite',
    across: 'Part de la boule',
    up: 'En plus des 180°',
  },
  corner: (n) => `${n}`,

  size: 'Taille du triangle',
  sizeHint: 'Rétrécissez-le jusqu’à un point, ou agrandissez-le jusqu’à couvrir presque la moitié de la boule.',
  shareOf: (share) => `${share} de la boule`,
  readout: {
    angles: 'Ses trois angles',
    extra: 'En plus des 180°',
    share: 'Part de la boule',
    turned: 'La flèche est revenue tournée de',
  },
  onItsWay: 'en route…',
  rule: (share, extra) =>
    `${share} de la boule × 720° = ${extra}. Sur toute boule, l’excès est la part de la boule couverte par le triangle, multipliée par 720°.`,
  status: (total) => `Les angles font ${total} au total`,
  picked: (n) => `Coin ${n} : les flèches le déplacent. Échap le relâche.`,
  letGo: 'Les flèches tournent la boule.',
  cameHome: (turned, total) => `Les angles font ${total} au total. La flèche est revenue tournée de ${turned}.`,

  guests: [
    {
      name: 'Albert Girard',
      note: 'En 1629, il a publié qu’un triangle tracé sur une boule a des angles dont la somme dépasse 180°, d’autant plus que son aire est grande.',
    },
    {
      name: 'Carl Friedrich Gauss',
      note: 'Il a démontré en 1827 que la courbure d’une surface peut se mesurer de l’intérieur, par les seuls angles et distances, sans jamais la quitter.',
    },
    {
      name: 'Tullio Levi-Civita',
      note: 'En 1917, il a décrit comment porter une flèche sur une surface courbe sans la faire tourner, l’idée que suit ici le marcheur.',
    },
  ],

  insight: {
    title: 'Pourquoi plus de 180° ?',
    html: `<p>Sur une boule, les chemins les plus droits sont les grands cercles, comme l’équateur et les lignes qui vont d’un pôle à l’autre. Un triangle dont les côtés les suivent est bombé vers l’extérieur, si bien que ses angles font plus que les 180° d’un triangle plat. Partez du pôle Nord, descendez jusqu’à l’équateur, tournez à gauche, parcourez un quart du tour, tournez de nouveau à gauche et remontez jusqu’au pôle : vous recroisez votre propre chemin à angle droit, et les trois angles valent 90°.</p>
<div class="insight-visual">somme des angles − 180° = part de la boule × 720°</div>
<h3>L’excès, c’est l’aire</h3>
<p>Ce qu’il y a d’angle en trop est proportionnel à l’aire du triangle. La boule entière vaut 720° : un triangle qui en couvre un huitième a donc 90° en trop, et chaque 1 % de la boule ajoute 7,2°. Rétrécissez un triangle jusqu’à un point et son excès disparaît presque : un petit morceau de boule est presque plat, c’est pourquoi la géométrie plane marche si bien pour un jardin ou une ville.</p>
<h3>Une flèche qui ne tourne jamais revient tournée</h3>
<p>Le marcheur porte une flèche et la garde au même angle par rapport au chemin droit qu’il suit. Seul le chemin tourne, aux coins ; la flèche, jamais. Pourtant, elle revient tournée exactement de l’excès. Sur une feuille plate, elle reviendrait telle qu’elle est partie. Porter une flèche de cette façon s’appelle le transport parallèle, et l’angle dont elle a tourné au bout d’une boucle s’appelle l’holonomie. Cela veut dire qu’une créature qui vivrait sur la surface, incapable d’en sortir ou de la voir de l’extérieur, pourrait tout de même découvrir que son monde est courbe.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Sur une sphère (la surface d’une boule) de rayon R, un triangle d’angles A, B et C (en radians) a pour aire (A + B + C − π)R². Albert Girard l’a publié en 1629 ; Thomas Harriot l’avait trouvé en 1603, sans jamais le publier. C’est un cas particulier du théorème de Gauss–Bonnet : sur toute surface, la somme des angles d’un triangle dépasse π de la courbure totale qu’il contient, et le transport parallèle autour du triangle fait tourner une flèche de ce même total, dans le sens inverse des aiguilles d’une montre (pour une boucle parcourue dans ce sens). Gauss a démontré en 1827, dans son <em>Theorema Egregium</em> (« théorème remarquable »), que la courbure peut se mesurer depuis l’intérieur d’une surface. Tullio Levi-Civita a décrit le transport parallèle dans les espaces courbes en 1917, et Élie Cartan a introduit l’holonomie en 1926.</p>
<p>La salle calcule chaque aire à partir des seuls coins (une formule de Van Oosterom et Strackee, 1983), et chaque angle à partir des directions des côtés. Ses tests vérifient que les deux concordent toujours, et qu’une flèche portée à petits pas tourne d’autant.</p>
<p>La même géométrie est à l’œuvre dans le pendule de Foucault, présenté pour la première fois à Paris en 1851. La Terre, en tournant, emporte le pendule le long de son cercle de latitude, et le plan de son oscillation tourne de 360° × sin(latitude) en un jour sidéral (environ 23 heures 56 minutes). La rotation de la Terre y joue aussi un rôle, si bien que le marcheur n’en partage que la géométrie : ce n’est pas un pendule.</p></details>
<h3>Ce que cette salle laisse de côté</h3>
<p>La boule est ici parfaitement ronde. La Terre est légèrement aplatie : du centre à un pôle, il y a environ 0,3 % de moins que du centre à l’équateur. Sur la vraie Terre, les nombres changent donc un peu. Les côtés prennent toujours le plus court chemin sur leur grand cercle, et les angles sont affichés arrondis, mais toujours de façon que leur somme soit celle affichée.</p>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/GirardsSphericalExcessFormula.html" target="_blank" rel="noopener">La formule de Girard pour l’excès sphérique (MathWorld, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Spherical_trigonometry" target="_blank" rel="noopener">Trigonométrie sphérique (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parallel_transport" target="_blank" rel="noopener">Transport parallèle (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Holonomy" target="_blank" rel="noopener">Holonomie (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gauss%E2%80%93Bonnet_theorem" target="_blank" rel="noopener">Théorème de Gauss–Bonnet (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Theorema_Egregium" target="_blank" rel="noopener">Theorema Egregium (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Levi-Civita_connection" target="_blank" rel="noopener">Connexion de Levi-Civita (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Solid_angle" target="_blank" rel="noopener">Angle solide (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Foucault_pendulum" target="_blank" rel="noopener">Pendule de Foucault (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Figure_of_the_Earth" target="_blank" rel="noopener">La figure de la Terre (Wikipédia, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Girard_Albert/" target="_blank" rel="noopener">Albert Girard (MacTutor, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/" target="_blank" rel="noopener">Carl Friedrich Gauss (MacTutor, en anglais)</a></div>`,
  },
});
