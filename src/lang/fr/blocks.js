/* La tour penchée de blocs · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('blocks', 'fr', {
  eyebrow: 'PHYSIQUE ET MATHS',
  name: 'La tour penchée de blocs',
  tagline: 'Jusqu’où une pile de blocs peut-elle dépasser du bord ?',
  title: 'La tour penchée de blocs.',
  subtitle:
    'Empilez des blocs au bord d’une table, chacun dépassant un peu plus que celui du dessous. Jusqu’où le bloc du haut peut-il dépasser du bord ?',
  field: 'Centre de gravité · Série harmonique · Une surprise très lente',
  sceneLabel: 'Un bord de table · Des blocs à empiler',
  sceneName: (n) => (n === 0 ? 'Table vide' : 'Blocs empilés'),
  tip: 'Faites glisser un bloc sur le côté · Touchez un espace vide pour ajouter un bloc · Les flèches déplacent le bloc du haut, B construit la meilleure pile',
  actionLabel: 'Meilleure pile',
  lengthsLabel: (oh) => `${oh.toFixed(2).replace('.', ',')} longueurs`,
  canvasLabel:
    'Une table avec des blocs empilés au bord. Faites glisser les blocs pour changer leur position. La pile bascule si le centre de gravité dépasse son appui.',
  panelEyebrow: 'Ajuster la pile',
  whyLabel: 'Pourquoi peut-elle aller si loin ?',
  nudge:
    'Commencez avec quelques blocs. Avec 4 blocs, le bloc du haut peut-il dépasser entièrement du bord ? Essayez 31 blocs pour deux longueurs.',

  connection: {
    html: '<strong>Un argument simple derrière une surprise.</strong> Ici, équilibrer chaque bloc sur celui du dessous explique jusqu’où une pile peut pencher. Dans Le sol impossible, colorier les cases montre pourquoi certains sols ne peuvent jamais être pavés.',
    label: 'Voir le sol impossible',
  },

  presets: [
    { name: '4 blocs', note: 'Le bloc du haut peut dépasser entièrement du bord.' },
    { name: '31 blocs', note: 'Deux longueurs de bloc en surplomb.' },
    { name: 'Meilleure pile', note: 'Chaque bloc à sa place idéale.' },
  ],

  blocks: 'Blocs',
  blocksHint: 'Combien de blocs dans la pile',

  status: (n, overhang) =>
    `${n} bloc${n === 1 ? '' : 's'} · ${overhang.toFixed(2).replace('.', ',')} longueur${overhang >= 2 ? 's' : ''} de bloc en surplomb`,
  toppled: 'La pile s’est effondrée.',

  milestones: {
    m1: 'Le bloc du haut entièrement au-delà du bord',
    m2: 'Deux longueurs de bloc en surplomb',
    m3: 'Trois longueurs de bloc',
  },

  bestLabel: 'Meilleure pile',
  resetLabel: 'Recommencer',

  guests: [
    {
      name: 'Nicole Oresme',
      note: 'Vers 1350, Oresme a démontré que la série harmonique diverge : le surplomb n’a donc pas de limite.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Euler a étudié la série harmonique en profondeur, y compris la lenteur extrême de sa croissance.',
    },
  ],

  insight: {
    title: 'Pourquoi une pile peut-elle aller aussi loin qu’on veut ?',
    html: `<p>Chaque bloc tient en équilibre sur celui du dessous tant que le <strong>centre de gravité</strong> commun de tous les blocs au-dessus d’un appui reste au-dessus de cet appui. Empilez-les au mieux en partant du haut : le bloc du haut peut dépasser de la moitié de sa longueur, le suivant d’un quart, puis d’un sixième, et ainsi de suite.</p>
<p>Le surplomb total avec <em>n</em> blocs vaut ½(1 + ½ + ⅓ + … + 1/<em>n</em>), soit la moitié de la <em>n</em>-ième somme partielle de la <strong>série harmonique</strong>. Cette série diverge, donc le surplomb n’a pas de limite. Mais il croît comme ½ ln <em>n</em> : terriblement lentement.</p>
<div class="insight-visual">4 blocs → 1 longueur de bloc. 31 blocs → 2. 227 blocs → 3.</div>
<h3>Le décompte</h3>
<p>Il faut exactement 4 blocs pour que celui du haut dépasse entièrement du bord (surplomb > 1), 31 pour deux longueurs et 227 pour trois. Chaque longueur de plus demande environ <em>e</em><sup>2</sup> ≈ 7,4 fois plus de blocs que la précédente.</p>
<h3>Ce que suppose ce modèle</h3>
<p>Des blocs idéaux : rigides, parfaitement uniformes, sans frottement. De vrais livres glissent et se plient. La pile d’un seul bloc par étage montrée ici n’est pas la plus efficace quand on a beaucoup de blocs : Paterson et Zwick (2009) ont trouvé des assemblages avec plusieurs blocs par étage, dont le surplomb croît comme <em>n</em><sup>1/3</sup> et non comme log <em>n</em>.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Numérotez les blocs à partir du haut (le bloc 1 est en haut) et notez <em>c<sub>k</sub></em> le centre du bloc <em>k</em>. Le bloc du haut, seul, peut avancer jusqu’à ce que son centre de gravité soit exactement au-dessus du bord droit du bloc 2 : cela donne un surplomb de ½. Ensuite, le centre de gravité commun des blocs 1 et 2 doit se trouver au-dessus du bord droit du bloc 3, ce qui ajoute ¼. Par récurrence, le décalage optimal du bloc <em>k</em> par rapport au bloc <em>k</em>+1 est 1/(2<em>k</em>), et le surplomb total vaut ½ · H(<em>n</em>), où H(<em>n</em>) est le <em>n</em>-ième nombre harmonique.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Block-stacking_problem" target="_blank" rel="noopener">Le problème de l’empilement de blocs (en anglais)</a><a class="source-link" href="https://arxiv.org/abs/0710.2357" target="_blank" rel="noopener">Paterson et Zwick, « Overhang » (2009, en anglais)</a></div>`,
  },
});
