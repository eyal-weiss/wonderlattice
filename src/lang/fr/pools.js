/* Mille échantillons, dix tests · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('pools', 'fr', {
  eyebrow: 'TESTS GROUPÉS',
  name: 'Mille échantillons, dix tests',
  tagline: 'Un tube sur mille brille. Dix tests, lancés en même temps, disent lequel.',
  title: 'Mille échantillons, dix tests.',
  subtitle:
    'Un tube brille, et impossible de savoir lequel. Mélangez des gouttes de groupes de tubes bien choisis, lancez dix tests à la fois, et lisez la réponse dans les lumières.',
  field: 'Nombres binaires · Tests groupés · Un bit par test',
  sceneLabels: [(tubes, tests) => `${tubes} tubes · ${tests} tests`, 'Une foule de 100 · des tests groupés'],
  tips: [
    'Touchez un tube pour y cacher la lueur, ou un puits pour voir quels tubes y versent une goutte · Les flèches gauche et droite choisissent un puits',
    'Réglez la part d’infectés et la taille des groupes · Les flèches gauche et droite changent la taille des groupes',
  ],
  actionLabels: ['Cacher la lueur ailleurs', 'Une nouvelle foule'],
  canvasLabel:
    'Au premier étage, un portoir de tubes avec, en dessous, une rangée de puits de test. Chaque puits reçoit une goutte d’un groupe de tubes ; les puits allumés se lisent comme un nombre binaire, qui désigne le tube lumineux. Au second étage, une foule de 100 personnes répartie en groupes, chaque groupe testé une fois, puis chaque membre d’un groupe positif testé à nouveau, et un graphique du nombre de tests attendu pour chaque taille de groupe.',
  panelEyebrow: 'Mélangez les échantillons',
  whyLabel: 'Comment dix tests peuvent-ils suffire ?',
  nudge:
    'Touchez un tube, et dix tests le retrouvent. Puis essayez deux tubes lumineux. Au second étage, poussez la part d’infectés au-delà de 31 % et regardez les économies disparaître.',

  connection: {
    html: '<strong>Des oui et des non qui écrivent une adresse.</strong> Ici, dix tests à réponse oui ou non écrivent le numéro du tube lumineux. Dans « Une image dans la tempête », quelques bits de contrôle écrivent l’adresse du bit que le bruit a inversé.',
    label: 'Envoyer une image dans la tempête',
  },

  presets: [
    { name: 'Un tube lumineux', note: 'Les lumières écrivent son numéro.', badge: '1' },
    { name: 'Deux tubes lumineux', note: 'Cette fois, les lumières désignent le mauvais tube.', badge: '2' },
    { name: '1 infecté sur 100', note: 'Des groupes de dix économisent quatre tests sur cinq.', badge: '1 %' },
  ],

  floorLabel: 'Quel étage ?',
  floors: ['Dix tests à la fois', 'Un test pour plusieurs'],
  hotLabel: 'Combien de tubes brillent ?',
  hot: ['Un', 'Deux'],
  prevalence: 'Infectés',
  prevalenceHint: 'La part de la foule qui porte l’infection, sans que personne le sache',
  pool: 'Taille des groupes',
  poolHint: 'Le nombre de personnes dont les échantillons partagent un test. 1 veut dire tester chacun séparément.',

  sceneNames: {
    hidden: 'Un tube brille. Lequel ?',
    hiddenTwo: 'Deux tubes brillent',
    found: (tube) => `Les lumières disent : tube ${tube}`,
    // La salle écrit la part sous la forme 1% ; on ajoute l’espace fine insécable avant %.
    crowd: (percent) => `${percent.replace('%', ' %')} d’infectés sur 100`,
  },
  status: {
    mixing: (well, tests) => `Mélange des gouttes · puits ${well} sur ${tests}`,
    testing: (tests) => `Les ${tests} tests à la fois`,
    read: (tests) => `${tests} tests · terminé`,
    pooling: (done, pools) => `Tests groupés · ${done} sur ${pools}`,
    retesting: (done, retests) => `Nouveaux tests · ${done} sur ${retests}`,
    used: (tests) => `${tests} tests utilisés`,
  },

  // Les mots dessinés sur l’image.
  labels: {
    yes: 'oui',
    no: 'non',
    sum: (parts, total) => `${parts} = ${total}`,
    none: 'Aucun puits allumé : aucun tube ne brille',
    here: (tube) => `tube ${tube}`,
    wrong: (tube) => `tube ${tube} ? Il ne brille pas`,
    missing: (tube, tubes) => `tube ${tube} ? Il n’y en a que ${tubes}`,
    well: (value) => `reçoit chaque tube dont la somme contient ${value}`,
    chartTitle: 'Tests attendus pour 100 personnes',
    axis: 'taille des groupes',
    oneByOne: 'un par un : 100',
    best: (k) => `meilleur : ${k}`,
    never: 'grouper n’aide jamais ici',
    thisRun: 'cette foule',
  },

  readout: {
    tests: (tests, tubes) =>
      `<strong>${tests}</strong> tests, lancés en même temps. Un par un, il en faudrait ${tubes}.`,
    code: (tube, bits) => `Le tube ${tube} en binaire : <code>${bits}</code>`,
    lights: (bits, value) => `Les lumières : <code>${bits}</code> = ${value}`,
    two: 'Chaque puits s’allume si l’un ou l’autre des tubes lumineux y verse une goutte : les lumières montrent donc les deux nombres fusionnés, avec un 1 partout où l’un des deux a un 1. Trouver deux tubes en un seul tour demande des tests plus nombreux et plus astucieux.',
    well: (value, count) =>
      `Ce puits reçoit une goutte de chaque tube dont le numéro, écrit comme une somme de 1, 2, 4, 8, …, utilise ${value} : ${count} tubes.`,
    used: (tests) => `Tests utilisés pour cette foule : <strong>${tests}</strong>`,
    expected: (tests) => `Attendu, en moyenne : ${tests}. Un par un : 100.`,
    best: (k, tests) => `Meilleure taille de groupe ici : ${k}, environ ${tests} tests.`,
    never: 'À cette prévalence, aucune taille de groupe ne fait mieux que tester chacun séparément.',
  },

  announce: {
    found: (tube, tests) => `${tests} tests : les lumières écrivent ${tube}, le tube lumineux.`,
    wrong: (a, b, pointed) => `Les tubes lumineux sont le ${a} et le ${b}, mais les lumières écrivent ${pointed}.`,
    crowd: (tests, expected) => `${tests} tests pour 100 personnes ; ${expected} attendus ; 100 un par un.`,
  },

  guests: [
    {
      name: 'Robert Dorfman',
      note: 'En 1943, il a proposé de regrouper les échantillons de sang pour dépister la syphilis chez les recrues de la guerre : tester le groupe, puis tester chacun séparément seulement s’il est positif.',
    },
    {
      name: 'Claude Shannon',
      note: 'Il a fondé la théorie mathématique de l’information, qui se compte en bits. Une réponse par oui ou non en porte au plus un, donc dix réponses distinguent au plus 1 024 possibilités.',
    },
  ],

  insight: {
    title: 'Comment dix tests peuvent-ils suffire ?',
    html: `<p>Écrivez le numéro de chaque tube comme une somme de 1, 2, 4, 8, … 512, en prenant chacun au plus une fois : le tube 673 vaut 512 + 128 + 32 + 1. C’est son écriture en <strong>binaire</strong>. Le puits marqué 512 reçoit une goutte de chaque tube dont la somme utilise 512, le puits marqué 1 de chaque tube dont la somme utilise 1 (un tube sur deux), et ainsi de suite. Seul le tube lumineux fait briller un puits, donc les puits allumés sont exactement les termes de sa somme. Dix puits, allumés ou éteints, écrivent n’importe quel nombre jusqu’à 1 023.</p>
<div class="insight-visual">Tube 673 = 512 + 128 + 32 + 1 = 1010100001 en binaire → les puits 512, 128, 32 et 1 s’allument</div>
<p>Dix, c’est aussi le minimum. Chaque réponse par oui ou non peut au mieux diviser les possibilités par deux, et il y en a 1 001 : l’un des 1 000 tubes, ou aucun. Neuf réponses n’en distinguent que 512. (Sur un téléphone, le portoir a 63 tubes et il faut six tests, pour la même raison.) C’est la vieille énigme des mille bouteilles et des dix goûteurs.</p>
<h3>Deux tubes lumineux</h3>
<p>Un puits s’allume si l’<em>un ou l’autre</em> des tubes lumineux y verse une goutte : les lumières montrent donc les deux numéros fusionnés, et désignent un troisième tube. Pour trouver jusqu’à <em>d</em> positifs en un seul tour, il faut choisir les groupes de sorte que les puits d’aucun tube ne soient tous couverts par les puits de <em>d</em> autres. Il faut alors de l’ordre de <em>d</em>² log <em>n</em> / log <em>d</em> tests, alors que tester en plusieurs tours, chacun choisi après avoir vu le précédent, n’en demande qu’environ <em>d</em> log(<em>n</em>/<em>d</em>). Tout lancer d’un coup a un prix.</p>
<h3>Un test pour plusieurs</h3>
<p>En 1943, Robert Dorfman a proposé un plan plus simple pour les grands dépistages : regrouper les échantillons de <em>k</em> personnes, tester le groupe, et tester à nouveau chaque personne seulement si le groupe est positif. Si une part <em>p</em> des gens est infectée, le nombre attendu de tests par personne vaut 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. À 1 %, le meilleur groupe compte 11 personnes et coûte 0,196 test par personne, soit une économie d’environ 80 %. À 5 %, le meilleur groupe est de 5 (0,43 test par personne), à 10 % de 4 (0,59). La meilleure taille vaut à peu près 1/√<em>p</em>. Dans la foule de cette salle, exactement 100 personnes, des groupes de 10 font aussi bien que des groupes de 11 (19,6 tests), parce qu’ils partagent la foule en parts égales. Les tests utilisés pour une foule fluctuent autour de l’espérance : fiez-vous à la moyenne, pas à un coup de chance.</p>
<h3>La falaise</h3>
<p>Quand les infections deviennent plus fréquentes, davantage de groupes reviennent positifs et demandent de nouveaux tests, et le meilleur groupe rétrécit. Au-delà de 1 − 3<sup>−1/3</sup> ≈ 30,7 %, aucune taille de groupe ne fait mieux que tester chacun séparément. Peter Ungar a démontré en 1960 qu’au-delà de (3 − √5)/2 ≈ 38 %, <em>aucune</em> stratégie, aussi astucieuse soit-elle, ne fait mieux. À l’autre extrême, la théorie de l’information fixe un plancher : environ 100·H(<em>p</em>) tests pour 100 personnes, où H est l’entropie binaire, soit environ 8 à 1 %.</p>
<h3>Ce que cette salle laisse de côté</h3>
<p>Ici, chaque test est parfait. Les vrais tests ratent parfois un cas ou donnent de fausses alertes, et le regroupement dilue chaque échantillon : Mutesa et ses collègues, au Rwanda, ont vérifié qu’un échantillon positif restait détecté une fois dilué 100 fois dans des échantillons négatifs. L’astuce du tube lumineux unique est fragile, et les laboratoires ne l’utilisent pas telle quelle. Ses descendants pratiques sont les groupes de Dorfman et des plans comme celui du Rwanda, qui dispose les échantillons sur une grille en forme de cube, trois points par côté, et regroupe chaque tranche : la même idée que les puits binaires, comptée en base trois. Le modèle suppose aussi que les infections sont indépendantes, alors que les vraies se concentrent dans les foyers, ce qui peut même aider le regroupement. Dorfman a fait sa proposition pour le dépistage en temps de guerre ; cette salle ne prétend pas dire à quel point elle a été utilisée à l’époque.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Plan binaire : avec les tubes 1, …, <em>n</em>, le test <em>k</em> (en comptant à partir de 0) contient chaque tube dont le chiffre binaire de rang <em>k</em> vaut 1 ; avec exactement un positif, les résultats sont ses chiffres binaires, et ⌈log₂(<em>n</em> + 1)⌉ tests suffisent et sont nécessaires. Dorfman : un groupe de <em>k</em> coûte un test, plus <em>k</em> autres avec la probabilité 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. Regrouper aide quand 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup> &lt; 1, c’est-à-dire (1 − <em>p</em>)<sup><em>k</em></sup> &gt; 1/<em>k</em> ; le plus grand <em>p</em> pour lequel un <em>k</em> convient est atteint en <em>k</em> = 3, où (1 − <em>p</em>)³ = 1/3. La foule de la salle compte exactement son groupe restant : avec des groupes de 11, neuf groupes de 11 et une personne testée seule. R. Dorfman, « The detection of defective members of large populations », Ann. Math. Statist. 14 (1943) 436–440. P. Ungar, « The cutoff point for group testing », Comm. Pure Appl. Math. 13 (1960). L. Mutesa et al., « A pooled testing strategy for identifying SARS-CoV-2 at low prevalence », Nature 589 (2021).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Group_testing" target="_blank" rel="noopener">Les tests groupés (Wikipédia, en anglais)</a><a class="source-link" href="https://doi.org/10.1214/aoms/1177731363" target="_blank" rel="noopener">Dorfman (1943, en anglais)</a><a class="source-link" href="https://www.nature.com/articles/s41586-020-2885-5" target="_blank" rel="noopener">Mutesa et al., Nature (2021, en anglais)</a><a class="source-link" href="https://arxiv.org/abs/1902.06002" target="_blank" rel="noopener">Aldridge, Johnson et Scarlett (2019, en anglais)</a><a class="source-link" href="https://arxiv.org/abs/2105.08845" target="_blank" rel="noopener">Aldridge et Ellis, les tests groupés pendant la pandémie (en anglais)</a></div>`,
  },
});
