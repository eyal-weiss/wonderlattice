/* Le triangle têtu · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('truss', 'fr', {
  eyebrow: 'STRUCTURES',
  name: 'Le triangle têtu',
  tagline:
    'Un pont fait de carrés se plie sous un camion jouet. Ajoutez les bonnes barres et il se bloque, et chaque barre montre sa charge.',
  title: 'Le triangle têtu.',
  subtitle:
    'Les carrés se plient, les triangles non. Regardez le pont céder, puis touchez des barres pour les retirer ou les remettre : les barres bleues sont comprimées, les rouges étirées.',
  field: 'Rigidité · Le décompte de Maxwell · Le théorème de Geiringer–Laman · Les forces dans un treillis',
  sceneLabel: 'Des barres, des pivots et un camion jouet',
  sceneNames: {
    squares: 'Rien que des carrés',
    pratt: 'Un treillis Pratt',
    howe: 'Un treillis Howe',
    counted: 'Le compte y est, mais il plie',
    own: 'Votre propre pont',
    bracing: 'Renforcer les carrés',
  },
  tip: 'Touchez une barre pour la retirer, ou un pointillé pour en poser une · Faites glisser le camion · Les flèches visent, Entrée retire ou pose',
  actionBrace: 'Renforcer chaque carré',
  actionUnbrace: 'Retirer les diagonales',
  canvasLabel:
    'Un pont de barres et de pivots au-dessus d’un vide, avec un camion jouet sur sa route. Touchez une barre pour la retirer ou un pointillé pour en poser une, ou visez avec les flèches et appuyez sur Entrée pour retirer ou poser. Faites glisser le camion pour le déplacer.',
  panelEyebrow: 'Barres et pivots',
  whyLabel: 'Pourquoi les triangles tiennent-ils ?',
  nudge:
    'Retirez une seule barre d’un pont rigide, et regardez-le se replier. Puis donnez une seconde diagonale à un carré : le pont est-il plus rigide pour autant ?',
  connection: {
    html: '<strong>Comprimer et étirer.</strong> Un treillis fait les deux. Les pierres d’un arc ne peuvent être que comprimées, si bien que l’arc doit prendre la forme d’une chaîne suspendue, à l’envers. Voyez-le dans « Suspendre, retourner, bâtir ».',
    label: 'Visiter « Suspendre, retourner, bâtir »',
  },

  presets: [
    { name: 'Rien que des carrés', note: 'Barres du haut et du bas, montants, aucune diagonale.' },
    { name: 'Un treillis Pratt', note: 'Une diagonale dans chaque carré.' },
    { name: 'Le compte y est, mais il plie', note: 'Assez de barres, aux mauvais endroits.' },
  ],

  panels: 'Carrés au-dessus du vide',
  panelsHint: 'Chaque carré ajoute deux nœuds, et il faut donc au pont quatre barres de plus.',
  forces: 'Montrer ce que porte chaque barre',

  verdict: { rigid: 'RIGIDE', floppy: 'DÉFORMABLE' },
  count: (joints, needed, bars) => `${joints} nœuds × 2 − 3 = ${needed} barres requises · ${bars} ici`,
  reason: {
    short: (k) => (k === 1 ? 'il manque une barre' : `il manque ${k} barres`),
    spread: 'barres mal réparties',
    rigid: (spare) =>
      spare === 0 ? 'pas une barre en trop' : spare === 1 ? 'une barre en trop' : `${spare} barres en trop`,
  },
  times: (x) => `${x}×`,

  key: {
    squeezed: 'Comprimée',
    stretched: 'Étirée',
    nothing: 'Ne porte rien',
    spare: 'En trop',
  },

  primer: {
    title: 'POURQUOI DES TRIANGLES',
    square: 'Un carré se plie',
    squareCount: '4 nœuds × 2 − 3 = 5 barres requises · il en a 4',
    triangle: 'Un triangle tient',
    triangleCount: '3 nœuds × 2 − 3 = 3 barres requises · il en a 3',
  },

  status: {
    rigid: (spare) =>
      spare === 0
        ? 'Rigide · aucune barre en trop'
        : spare === 1
          ? 'Rigide · une barre en trop'
          : `Rigide · ${spare} barres en trop`,
    short: (k) => (k === 1 ? 'Déformable · il manque une barre' : `Déformable · il manque ${k} barres`),
    spread: 'Déformable · barres mal réparties',
  },
  folded: 'Le pont se replie.',
  locked: 'Le pont est rigide.',

  readout: {
    have: (bars, needed) => `${bars} barres, ${needed} requises`,
    count: (joints, ways, needed, bars) =>
      `${joints} nœuds peuvent chacun bouger de deux façons : ${ways} façons en tout. Ôtez-en 3, qui font glisser ou tourner le pont tout entier, et il lui faut ${needed} barres. Il en a ${bars}.`,
    short: (k) =>
      k === 1
        ? 'Il manque une barre, donc le pont peut encore se plier d’une façon.'
        : `Il manque ${k} barres, donc le pont peut encore se plier.`,
    spread:
      'Il y a assez de barres, mais certaines s’entassent là où elles font double emploi (celle en pointillé est en trop), si bien qu’une autre partie en manque et se plie.',
    busiest: (x) => `La barre la plus chargée porte ${x} fois le poids du camion.`,
    busiestSame: 'La barre la plus chargée porte autant que pèse le camion.',
    nothing: (k) =>
      k === 0
        ? 'Chaque barre porte quelque chose.'
        : k === 1
          ? 'Une barre ne porte rien.'
          : `${k} barres ne portent rien.`,
    spare: (k) =>
      k === 1
        ? 'Une barre est en trop (en pointillé) : retirez-la et le pont tient toujours.'
        : `${k} barres sont en trop (en pointillé) : le pont n’en a pas besoin pour tenir.`,
    ashore: 'Le camion est sur la terre ferme, alors aucune barre ne porte de charge.',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'En 1864, j’ai compté. Chaque nœud d’une structure plane peut bouger de deux façons, et trois de ces façons ne font que glisser ou tourner la structure entière. Il faut donc à une structure de j nœuds au moins 2j − 3 barres.',
    },
    {
      name: 'Hilda Geiringer',
      note: 'En 1927, j’ai trouvé exactement quelles structures planes sont rigides : aucune partie ne doit avoir plus de barres qu’il ne lui en faut. Gerard Laman a retrouvé la même règle en 1970, et aujourd’hui elle porte nos deux noms.',
    },
    {
      name: 'Squire Whipple',
      note: 'En 1847, j’ai publié un livre qui calculait la force dans chaque barre d’un treillis, au lieu de la deviner. Mes ponts bowstring en fer franchissaient le canal Érié.',
    },
  ],

  insight: {
    title: 'Pourquoi les triangles tiennent-ils ?',
    html: `<p>Une barre garde sa longueur, et un pivot laisse les barres tourner. Trois longueurs fixent entièrement la forme d’un triangle : un triangle de barres ne peut donc pas changer de forme du tout. Quatre longueurs ne fixent pas un carré : il penche jusqu’à devenir un losange sans qu’une seule barre ne plie ni ne s’étire. Voilà pourquoi les structures des ponts, des grues et des toits sont faites de triangles.</p>
<div class="insight-visual">nœuds × 2 − 3 = barres requises</div>
<h3>Compter les façons de bouger</h3>
<p>Sur un mur plat, chaque nœud peut bouger dans deux directions : j nœuds ont donc 2j façons de bouger. Chaque barre en retire au plus une. Trois façons restent toujours, quel que soit le nombre de barres : même une structure rigide peut glisser de côté, glisser de haut en bas, et tourner tout entière. Ici, le pivot et le rouleau sous le pont retirent ces trois-là. Il faut donc à une structure au moins 2j − 3 barres, un décompte donné par James Clerk Maxwell en 1864. Un pont de quatre carrés a 10 nœuds : il lui faut donc 17 barres. Avec seulement ses barres du haut et du bas et ses montants, il en a 13 : il lui en manque quatre, une diagonale par carré.</p>
<h3>Compter ne suffit pas</h3>
<p>Posez 17 barres, avec deux diagonales dans un carré et aucune dans le suivant, et le pont se plie quand même. La seconde diagonale est en trop : elle ne tient rien que la première ne tienne déjà. Hilda Pollaczek-Geiringer a trouvé la règle exacte en 1927, et Gerard Laman l’a retrouvée en 1970. Une structure de 2j − 3 barres est rigide exactement quand aucune de ses parties n’a trop de barres : tout groupe de k nœuds a au plus 2k − 3 barres entre eux. La règle vaut pour des nœuds en position générale. Dans des positions particulières, comme trois nœuds alignés, une structure qui a les bonnes barres peut encore céder un peu. Sur le panneau perforé de ce pont, chaque choix de barres se comporte exactement comme en position générale.</p>
<h3>Ce que porte chaque barre</h3>
<p>Une fois le pont rigide, chaque nœud doit être en équilibre : les poussées et les tractions de ses barres, et le poids du camion là où la route repose sur lui, s’annulent. Résoudre tous ces équilibres ensemble (la méthode des nœuds) donne la force dans chaque barre. Les barres bleues sont comprimées et les rouges étirées, et une barre plus épaisse porte davantage. Certaines barres ne portent rien du tout quand le camion est à un endroit, et beaucoup quand il se déplace. Et une barre peut porter plus que le poids du camion : dans un treillis Pratt de six carrés, avec le camion au milieu, le milieu du haut est comprimé par une fois et demie le poids du camion.</p>
<p>Dans un treillis Pratt, les diagonales penchent vers le milieu et sont étirées, tandis que les montants sont comprimés. Retournez chaque diagonale comme dans un miroir et vous obtenez un treillis Howe, où les diagonales sont comprimées et les montants étirés. Cette différence comptait pour les bâtisseurs : une longue barre comprimée peut flamber, c’est-à-dire se courber de côté bien avant de s’écraser, si bien que les barres comprimées doivent être plus épaisses. Le modèle de William Howe, en 1840, comprimait des diagonales en bois et étirait des tiges de fer. Celui de Thomas et Caleb Pratt, en 1844, inversait les rôles, et il convenait aux ponts à mesure que le fer et l’acier remplaçaient le bois. Le treillis Warren, de 1848, utilise un zigzag de diagonales, tour à tour comprimées et étirées.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Ici, les barres ne pèsent rien, leurs nœuds sont des pivots parfaits, le poids du camion n’atteint le pont qu’à ses nœuds, par la route, et toutes les barres sont du même acier. Les vrais ponts portent leur propre poids, en général bien plus lourd que n’importe quel camion. Leurs nœuds sont rivetés, boulonnés ou soudés, ce qui les raidit. Leurs barres comprimées flambent avant de rompre. Quand un pont a des barres en trop, la façon dont elles se partagent la charge dépend de l’élasticité de chacune, et ici elles sont toutes pareilles. Le pliage est une caricature : une vraie structure tomberait plus vite, et se briserait. Et les triangles ne sont pas la seule façon d’être rigide : les structures à nœuds rigides, les coques et les structures de tenségrité le sont aussi. Des jeux de construction de ponts comme Poly Bridge simulent des ponts entiers ; cette salle s’en tient au décompte et aux forces.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Déplacer le nœud a de u<sub>a</sub> et le nœud b de u<sub>b</sub> conserve la longueur de la barre ab, au premier ordre, quand (p<sub>a</sub> − p<sub>b</sub>) · (u<sub>a</sub> − u<sub>b</sub>) = 0. Une telle équation par barre forme la matrice de rigidité, avec deux colonnes par nœud. Avec trois lignes de plus pour le pivot et le rouleau, le pont est rigide exactement quand la matrice est de rang plein, 2j. La salle calcule aussi le rang avec les nœuds légèrement décalés au hasard, en position générale, pour distinguer une structure aux barres mal réparties d’une position particulière. Un pont déformable se plie selon un mouvement que la matrice permet : la part de la poussée du camion à laquelle aucune barre ne résiste. Les forces viennent de la méthode des déplacements, avec toutes les barres identiques. Pour un pont sans barre en trop, elle donne exactement les forces de la méthode des nœuds, quel que soit le matériau des barres. Les forces ont été vérifiées par un programme indépendant pour des treillis Pratt et Howe de deux à six carrés, et le rang par la condition de Laman sur 150 petites structures prises au hasard.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Truss" target="_blank" rel="noopener">Treillis (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Laman_graph" target="_blank" rel="noopener">Graphe de Laman (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Structural_rigidity" target="_blank" rel="noopener">Rigidité structurelle (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Truss_bridge" target="_blank" rel="noopener">Pont en treillis (Pratt, Howe et Warren, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Squire_Whipple" target="_blank" rel="noopener">Squire Whipple (en anglais)</a><a class="source-link" href="https://doi.org/10.1080/14786446408643668" target="_blank" rel="noopener">Maxwell (1864), « On the calculation of the equilibrium and stiffness of frames » (en anglais)</a><a class="source-link" href="https://doi.org/10.1002/zamm.19270070107" target="_blank" rel="noopener">Pollaczek-Geiringer (1927), « Über die Gliederung ebener Fachwerke » (en allemand)</a><a class="source-link" href="https://doi.org/10.1007/BF01534980" target="_blank" rel="noopener">Laman (1970), « On graphs and rigidity of plane skeletal structures » (en anglais)</a></div>`,
  },
});
