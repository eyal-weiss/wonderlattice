/* L’angle secret du tournesol · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('sunflower', 'fr', {
  eyebrow: 'ANGLE D’OR',
  name: 'L’angle secret du tournesol',
  tagline: 'Tournez un peu, déposez une graine, recommencez. Un seul angle donne un tournesol.',
  title: 'L’angle secret du tournesol.',
  subtitle:
    'Chaque graine est tournée d’un petit angle par rapport à la précédente. Changez cette rotation d’un dixième de degré, et le tournesol se défait.',
  field: 'Théorie des nombres · Phyllotaxie · Plantes',
  sceneLabel: 'Une rotation · mille graines',
  sceneName: 'Le cœur de la fleur',
  tip: 'Touchez la fleur pour compter ses spirales · ← → tournent de 0,01°, ↑ ↓ de 0,1°',
  actionLabel: 'Refaire pousser',
  canvasLabel:
    'Un cœur de tournesol de mille graines. Chaque graine est tournée du même angle par rapport à la précédente, un peu plus loin du centre.',
  panelEyebrow: 'Un angle, bien des fleurs',
  whyLabel: 'Pourquoi un seul angle donne-t-il un tournesol ?',
  nudge:
    'Trouvez un angle qui dessine des rayons droits, puis changez-le de 0,01°. Combien de spirales apparaissent ? Est-ce un nombre de Fibonacci ?',
  connection: {
    html: '<strong>Alan Turing, encore.</strong> Il se demandait comment les êtres vivants, en grandissant, forment leurs motifs. Dans « Faire pousser une empreinte », sa chimie trace les crêtes.',
    label: 'Faire pousser une empreinte',
  },

  presets: [
    { name: 'Un tournesol', note: 'L’angle d’or.', badge: '137,5°' },
    { name: 'Un dixième de degré de plus', note: 'Des trous s’ouvrent entre les spirales.', badge: '137,6°' },
    { name: 'Trois huitièmes de tour', note: 'Huit rayons droits.', badge: '135°' },
  ],

  angle: 'Rotation entre deux graines',
  nudgeGroup: 'Ajuster un peu la rotation',
  // The buttons under the slider, given the step already written as the page writes numbers ("0,01°").
  more: (step) => `${step} de plus`,
  less: (step) => `${step} de moins`,
  arms: 'Montrer les spirales et les compter',

  // The status line: what the eye sees near the rim (or where the visitor tapped). Counts are whole numbers.
  status: {
    growing: (seeds) => `Croissance : ${seeds} ${seeds < 2 ? 'graine' : 'graines'}`,
    spokes: (q) => (q === 1 ? 'Une seule ligne droite' : `${q} rayons droits`),
    gaps: (q) => `Des trous s’ouvrent entre ${q} spirales`,
    packed: (a, b) => `Graines serrées : ${a} spirales dans un sens, ${b} dans l’autre`,
  },

  // Words drawn on the canvas: keep them short.
  labels: {
    degrees: (value) => `${value}°`, // the turn, already written as the page writes numbers
    golden: 'l’angle d’or',
    ofTurn: (p, q) => `${p}/${q} de tour`,
    fibonacci: 'Suite de Fibonacci',
  },

  guests: [
    {
      name: 'Léonard de Pise (Fibonacci)',
      note: 'En 1202, son livre de calcul demandait à quelle vitesse les lapins se reproduisent. La réponse, 1, 1, 2, 3, 5, 8, 13…, porte aujourd’hui son surnom.',
    },
    {
      name: 'Alan Turing',
      note: 'Dans ses dernières années, il a cherché pourquoi les plantes disposent leurs feuilles et leurs graines en spirales de Fibonacci. En 2012, pour son centenaire, le public a fait pousser des tournesols pour le vérifier.',
    },
  ],

  insight: {
    title: 'Pourquoi un seul angle donne-t-il un tournesol ?',
    html: `<p>Chaque nouvelle graine est tournée du même angle par rapport à la précédente et se place un peu plus loin du centre. Si cette rotation est une fraction simple d’un tour complet, disons 3/8, alors de huit en huit, les graines retombent sur la même ligne partant du centre : huit rayons, séparés par des secteurs vides. Une rotation <em>proche</em> de 3/8 courbe ces rayons en huit spirales, séparées par des trous.</p>
<div class="insight-visual">une rotation de p/q → q rayons · proche de p/q → q spirales</div>
<h3>L’angle qui évite toutes les fractions</h3>
<p>Pour remplir le cœur sans trous, la rotation doit rester loin de toute fraction simple. L’angle d’or, 360°/φ² ≈ 137,508° (φ = 1,618…, le nombre d’or), y parvient mieux que tout autre : les fractions approchent φ plus lentement que n’importe quel autre nombre. Ses meilleures approximations sont 1/3, 2/5, 3/8, 5/13, 8/21, 13/34 de tour, des rapports de nombres de Fibonacci. Voilà pourquoi les deux familles de spirales que l’on peut compter sont des nombres de Fibonacci voisins, 13 et 21 près du centre, 55 et 89 près du bord d’un cœur de mille graines.</p>
<h3>Les vrais tournesols</h3>
<p>Les plantes ne sont pas aussi ordonnées. Dans l’étude de science participative <em>Turing’s Sunflowers</em>, portant sur 657 cœurs de tournesol, 565 des 768 comptages de spirales étaient des nombres de Fibonacci, et 67 autres présentaient une structure apparentée. Le reste, non, et des comptages inférieurs d’une unité à un nombre de Fibonacci sont apparus étonnamment souvent. Certains cœurs n’avaient même aucune spirale nette.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>On donne l’angle au modèle ; il n’explique pas pourquoi une plante l’utilise. Dans une vraie fleur, les nouveaux bourgeons se forment là où s’accumule une hormone, l’auxine, et chaque bourgeon la puise dans son entourage, si bien que le suivant se forme ailleurs. Stéphane Douady et Yves Couder ont déposé des gouttelettes aimantées l’une après l’autre sur de l’huile, où elles se repoussent : chaque nouvelle goutte s’installe aussi loin que possible des dernières, et au bon rythme, l’angle d’or apparaît de lui-même.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Une rotation de 0,381966… tour a pour fraction continue 1/(2 + 1/(1 + 1/(1 + …))), rien que des 1 après le 2 : aucune fraction continue ne converge plus lentement. Ses meilleures fractions, les réduites, sont F<sub>k</sub>/F<sub>k+2</sub> : 1/3, 2/5, 3/8, 5/13… Les plus proches voisines d’une graine la précèdent ou la suivent d’un nombre de Fibonacci de graines, et ce nombre grandit à peu près au rythme de la distance au centre. Exactement 137,5°, c’est 55/144 de tour : cet angle donne donc 144 rayons, mais seulement une fois qu’il y a quelques milliers de graines.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1016/0025-5564(79)90080-4" target="_blank" rel="noopener">H. Vogel, A better way to construct the sunflower head (1979, en anglais)</a><a class="source-link" href="https://doi.org/10.1098/rsos.160091" target="_blank" rel="noopener">J. Swinton, E. Ochu et al., Turing’s Sunflowers (2016, en anglais)</a><a class="source-link" href="https://doi.org/10.1103/PhysRevLett.68.2098" target="_blank" rel="noopener">S. Douady, Y. Couder, Phyllotaxis as a self-organised growth process (1992, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Golden_angle" target="_blank" rel="noopener">Angle d’or (Wikipédia, en anglais)</a></div>`,
  },
});
