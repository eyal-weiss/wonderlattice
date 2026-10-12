/* Des aiguilles qui connaissent π · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('needles', 'fr', {
  eyebrow: 'PROBABILITÉS GÉOMÉTRIQUES',
  name: 'Des aiguilles qui connaissent π',
  tagline: 'Lâchez des aiguilles sur un plancher et comptez celles qui tombent à cheval sur une ligne. Il en sort π.',
  title: 'Des aiguilles qui connaissent π.',
  subtitle:
    'Des aiguilles pleuvent sur un plancher de planches. Comptez celles qui chevauchent une ligne, et π apparaît. Puis tordez-les.',
  field: 'Probabilités · L’aiguille de Buffon · La nouille de Barbier',
  sceneLabel: 'Un plancher · Des aiguilles au hasard',
  tip: 'Les aiguilles tombent toutes seules · Choisissez une forme, ou rejouez un célèbre coup de chance',
  actionLabel: 'Relancer',
  canvasLabel:
    'Des aiguilles tombent au hasard sur un plancher ; celles qui tombent à cheval sur une ligne entre deux planches s’illuminent. En dessous, un graphique de l’estimation de π à mesure que les aiguilles s’accumulent.',
  panelEyebrow: 'Changer les aiguilles',
  whyLabel: 'Pourquoi π apparaît-il ?',
  nudge:
    'Essayez un anneau aussi large qu’une planche : il croise exactement deux lignes à chaque fois. Ce seul fait est la clé de toute l’énigme.',
  connection: {
    html: '<strong>Un anneau aussi large qu’une planche croise toujours deux fois.</strong> Toute forme de largeur constante aussi, et c’est pourquoi le pourtour de chacune vaut π fois sa largeur.',
    label: 'Faire rouler les formes de largeur constante',
  },

  presets: [
    { name: 'Aiguilles sur planches', note: 'Comptez les croisements : π apparaît.', badge: 'π' },
    { name: 'Tordez-les', note: 'Même longueur, autant de croisements.', badge: '~' },
    { name: 'Un savant chanceux', note: 'Rejouez un résultat trop beau pour être vrai.', badge: '1901' },
  ],

  shape: 'La forme',
  shapes: ['Aiguille', 'Zigzag', 'Nouille', 'Anneau'],
  // What the picture shows, by shape (the last: Lazzarini's reruns).
  sceneNames: [
    'Aiguilles droites',
    'Zigzags',
    'Nouilles',
    'Anneaux d’une planche de large',
    'Les aiguilles de Lazzarini',
  ],
  length: 'Longueur, en part de la largeur d’une planche',
  lucky: 'Rejouer l’expérience de Lazzarini de 1901, par 3 408 aiguilles à la fois',

  // A rerun is « un essai ». French uses the singular for 0 and 1.
  status: {
    raining: (needles) => `${needles} ${needles === '0' || needles === '1' ? 'aiguille' : 'aiguilles'} jusqu’ici`,
    done: (needles, pi) => `${needles} aiguilles : π ≈ ${pi}`,
    rings: (rings) => `${rings} anneaux, 2 croisements chacun`,
    reruns: (runs) => `${runs} ${runs < 2 ? 'essai' : 'essais'} de 3 408 aiguilles`,
  },

  readout: {
    guess: (pi) => `π ≈ ${pi}`,
    thrown: 'Aiguilles lancées',
    across: 'À cheval sur une ligne',
    off: 'Écart',
    sameRule: 'Tordue ou droite, une même longueur croise autant de lignes, en moyenne.',
    rule: 'π ≈ 2 × longueur × aiguilles ÷ croisements, avec les longueurs en planches.',
    ring: 'Chaque anneau croise exactement 2 lignes',
    rings: 'Anneaux lancés',
    ringRule:
      'Un anneau aussi large qu’une planche mesure π planches de tour : chaque longueur de π planches croise donc 2 lignes, tordue ou droite.',
    typical: (miss) => `Écart typique : ${miss}`,
    reruns: 'Essais',
    exact: 'Exactement 355/113, comme Lazzarini',
    his: 'L’écart de Lazzarini',
    luckyRule:
      'La moitié des essais manquent π de plus que l’écart typique. Avec ses aiguilles et son nombre de lancers, 355/113 est une réponse possible, mais même ainsi elle ne sort qu’environ une fois sur 70 essais.',
  },

  // Words drawn in the picture: short.
  labels: {
    tally: (needles, across) => `${needles} aiguilles · ${across} sur une ligne`,
    rings: (n) => `${n} anneaux`,
    guess: (pi) => `π ≈ ${pi}`,
    ring: '2 croisements, toujours',
    chart: 'Estimation au fil des lancers',
    typical: 'écart typique',
    pi: 'π',
    count: 'Lignes croisées par chaque anneau',
    every: 'chaque anneau',
    run: (k) => `Essai ${k}`,
    hits: (runs, exact) =>
      `${runs} ${runs === '0' || runs === '1' ? 'essai' : 'essais'} · ${exact} ${exact === '0' || exact === '1' ? 'a' : 'ont'} donné 355/113`,
    reruns: 'Un point par essai de 3 408 aiguilles',
    his: 'Lazzarini, 1901',
  },

  announce: {
    done: (pi) => `Un million d’aiguilles : π ≈ ${pi}.`,
    ring: 'Chaque anneau croise exactement deux lignes.',
    lucky: (miss) => `Écart typique d’un essai : ${miss}. Celui de Lazzarini : 0,0000003.`,
  },

  guests: [
    {
      name: 'Georges-Louis Leclerc, comte de Buffon',
      note: 'Je me suis demandé combien de fois une baguette, jetée sur un plancher de planches étroites, tombe à cheval sur une fente entre elles. J’ai posé la question en 1733 et publié la réponse en 1777.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'En 1860, j’ai remarqué qu’on peut tordre l’aiguille comme on veut : tant que sa longueur reste la même, elle croise les lignes tout aussi souvent en moyenne.',
    },
  ],

  insight: {
    title: 'Pourquoi π apparaît-il ?',
    html: `<p>Une aiguille aussi longue qu’une planche est large tombe à cheval sur une ligne avec une probabilité de 2/π, environ 64 %. Après de nombreux lancers, croisements ÷ aiguilles ≈ 2/π, donc π ≈ 2 × aiguilles ÷ croisements. Les aiguilles plus courtes croisent moins souvent, en proportion de leur longueur. Georges-Louis Leclerc, comte de Buffon, a posé la question en 1733 et publié la réponse en 1777.</p>
<div class="insight-visual">probabilité de croiser = 2 × longueur ÷ (π × largeur d’une planche)</div>
<h3>Tordre l’aiguille</h3>
<p>Coupez une aiguille en petits morceaux. Chaque morceau croise des lignes, en moyenne, en proportion de sa longueur, où qu’il se trouve dans l’aiguille, et les moyennes s’additionnent même quand les morceaux bougent ensemble. Toute forme croise donc, en moyenne, un nombre de lignes proportionnel à sa longueur, qu’elle soit tordue, droite ou enroulée. Joseph-Émile Barbier l’a vu en 1860. Pour trouver la constante, prenez un anneau exactement aussi large qu’une planche. Où qu’il tombe, il croise exactement deux lignes. Son tour mesure π planches, donc chaque longueur de π planches croise 2 lignes en moyenne : 2 × longueur ÷ π, la règle de l’aiguille. La même astuce montre que toute forme de largeur constante, comme le triangle de Reuleaux, a un pourtour égal à π fois sa largeur.</p>
<h3>Le hasard mesure lentement</h3>
<p>L’estimation oscille de moins en moins à mesure que les aiguilles s’accumulent, mais seulement comme 1 ÷ √(nombre d’aiguilles) : chaque chiffre juste de plus coûte environ 100 fois plus d’aiguilles. Un million d’aiguilles donne en général π à deux ou trois décimales près.</p>
<h3>Le savant chanceux</h3>
<p>En 1901, Mario Lazzarini a rapporté 3 408 lancers d’aiguilles longues de 5/6 de planche. Cela donne π ≈ 355/113 = 3,1415929…, faux seulement à la septième décimale, alors qu’une expérience de cette taille se trompe en général de quelques centièmes. Ses choix font de 355/113 l’une des réponses possibles : il faut exactement 1 808 croisements, ce qu’un essai honnête donne environ une fois sur 70. Et quelqu’un qui lance par séries de 213 et s’arrête la première fois que le compte est bon y arrive en 3 408 lancers au plus, plus d’une fois sur quatre. Lee Badger (1994) a examiné les résultats que Lazzarini a rapportés en chemin, pour moins de lancers, et a jugé très improbable qu’ils restent aussi proches des valeurs attendues tout au long d’une expérience honnête. Le journaliste scientifique néerlandais Hans van Maanen soutient que l’article n’a jamais été destiné à être pris trop au sérieux : ses lecteurs, des enseignants, pouvaient voir que la machine décrite par Lazzarini ne pouvait pas fonctionner. Quoi qu’il en soit, un résultat trop beau est l’indice d’autre chose.</p>
<h3>Ce que cette salle simplifie</h3>
<p>Les nombres pseudo-aléatoires de l’ordinateur remplacent de vrais lancers. Ils choisissent la direction de chaque aiguille sans utiliser π : un point au hasard dans un carré, gardé seulement s’il tombe dans le cercle, donne la même chance à chaque direction. Les lignes du plancher se prolongent à l’infini, si bien qu’une aiguille près du bord de l’image compte quand même. Les vraies aiguilles rebondissent, roulent et tombent les unes sur les autres, et les vraies planches ne sont jamais parfaitement régulières.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Les lignes sont espacées de t, et une aiguille de longueur l ≤ t tombe avec son milieu à une distance x de la ligne la plus proche (uniforme entre 0 et t/2) et selon un angle θ avec les lignes (uniforme entre 0 et π/2). Elle croise quand x ≤ (l/2) sin θ, donc P = (2/t)(2/π) ∫₀^{π/2} (l/2) sin θ dθ = 2l/(πt). Avec n aiguilles et c croisements, π ≈ 2ln/(tc) ; son erreur typique vaut π√((1 − p)/(pn)) avec p = 2l/(πt), soit 0,04 pour 3 408 aiguilles longues d’une planche, et 0,05 pour celles de Lazzarini. L’aiguille de Lazzarini donne l’estimation (5/3) × n/c, et 355/113 = (5/3) × 3 408/1 808. Les tests de la salle vérifient, à l’aide d’un programme distinct : le taux de croisement 2l/π pour les aiguilles droites, les zigzags et les nouilles ; exactement deux croisements pour chaque anneau ; les erreurs typiques ci-dessus ; et, pour le dispositif de Lazzarini, 1 808 croisements avec une probabilité de 1,4 %, et un écart médian de 0,034. Buffon, « Essai d’arithmétique morale », Histoire naturelle, Supplément 4 (1777). E. Barbier, J. Math. Pures Appl. (2) 5 (1860). L. Badger, « Lazzarini’s lucky approximation of π », Mathematics Magazine 67 (1994).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_needle_problem" target="_blank" rel="noopener">Le problème de l’aiguille de Buffon (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_noodle" target="_blank" rel="noopener">La nouille de Buffon (Wikipédia, en anglais)</a><a class="source-link" href="https://mathworld.wolfram.com/BuffonsNeedleProblem.html" target="_blank" rel="noopener">Le problème de l’aiguille de Buffon (MathWorld, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Buffon/" target="_blank" rel="noopener">Buffon (MacTutor, en anglais)</a></div>`,
  },
});
