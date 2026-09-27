Wonderlattice.defineText('storm', 'fr', {
  eyebrow: 'CORRECTION D’ERREURS',
  name: 'Une image dans la tempête',
  tagline: 'Quelques bits en plus, bien choisis, et une image se répare toute seule.',
  title: 'Une image dans la tempête.',
  subtitle: 'Dessinez une petite image. Envoyez-la à travers la tempête. Aidez-la à arriver intacte.',
  field: 'Codes · Information · Un peu de redondance',
  sceneLabel: 'Canal bruité',
  actionLabel: 'Renvoyer',
  canvasLabel:
    'Votre image, à gauche, voyage sous forme de bits à travers une tempête qui en inverse certains, et arrive à droite. Cliquez ou faites glisser sur votre image pour dessiner. Au clavier, déplacez-vous avec les flèches et appuyez sur Entrée pour peindre.',
  panelEyebrow: 'La protéger',
  whyLabel: 'Comment des bits peuvent-ils se réparer ?',
  nudge:
    'Comptez les dégâts sans protection. Puis essayez l’astuce de Hamming dans la même tempête. Quelle violence de tempête supporte-t-elle ?',
  connection: {
    html: '<strong>Des signaux qui voyagent.</strong> Ici, un message survit à un voyage bruité. Dans « Entendre la forme », deux sons voyagent ensemble et dessinent une forme que l’on peut entendre.',
    label: 'Visiter « Entendre la forme »',
  },
  yours: 'Votre image',
  storm: 'La tempête',
  arrived: 'Ce qui est arrivé',
  codes: ['Aucune protection', 'Le dire trois fois', 'Un bit de parité', 'L’astuce de Hamming'],
  codeLabel: 'Comment la protéger',
  codeHints: [
    'Chaque bit voyage seul.',
    'Trois copies de chaque bit, puis un vote.',
    'Un bit de contrôle pour quatre repère une inversion.',
    'Trois bits de contrôle pour quatre corrigent une inversion.',
  ],
  stormLabel: 'Force de la tempête',
  stormHint: 'La probabilité qu’un bit donné soit inversé.',
  pictureLabel: 'Choisissez une image, ou dessinez sur la vôtre',
  pictures: {
    heart: 'Cœur',
    smile: 'Sourire',
    invader: 'Extraterrestre',
    blank: 'Effacer',
  },
  tip: 'Orange : inversé · ○ réparé · ✕ encore faux',
  tipParity: 'Orange : inversé · pointillés : repéré comme abîmé · ✕ faux',
  sent: 'Bits envoyés',
  sentValue: (bits, extra) => `${bits} (+${extra} % en plus)`,
  badge: (extra) => `+${extra} %`,
  badgeNote: 'bits en plus',
  flipped: 'Inversés par la tempête',
  repaired: 'Réparés à l’arrivée',
  knownBad: 'Blocs repérés comme abîmés',
  wrong: 'Pixels encore faux',
  status: (wrong, flips) =>
    !flips
      ? 'Un ciel calme'
      : !wrong
        ? 'Tous les pixels sont arrivés'
        : wrong === 1
          ? '1 pixel faux'
          : `${wrong} pixels faux`,
  curveTitle: 'Pixels faux en moyenne, à mesure que la tempête forcit',
  about: (wrong) => `≈ ${wrong}`,
  curveLabel: (code, wrong) => `${code} : environ ${wrong} pixels faux en moyenne à cette force de tempête.`,
  calm: 'calme',
  wild: '20 %',
  presets: [
    {
      name: 'Aucune protection',
      note: 'Chaque inversion fait mal.',
    },
    {
      name: 'Le dire trois fois',
      note: 'Sûr, mais trois fois plus de bits.',
    },
    {
      name: 'L’astuce de Hamming',
      note: 'Presque aussi sûr, avec bien moins de bits.',
    },
  ],
  guests: [
    {
      name: 'Richard Hamming',
      note: 'Week-end après week-end, des erreurs arrêtaient son ordinateur. S’il sait repérer une erreur, se demanda-t-il, pourquoi ne pas la corriger ?',
    },
  ],
  insight: {
    title: 'Comment un message peut-il se réparer ?',
    html: `<p>Votre image fait 64 pixels, donc 64 bits : encre ou pas d’encre. La tempête inverse chaque bit avec une petite probabilité. Sans protection, chaque bit inversé donne un pixel faux, et le destinataire ne peut même pas savoir lesquels.</p>
<div class="insight-visual">Quelques bits en plus, bien choisis, permettent au destinataire de trouver et de corriger des erreurs qu’il n’a jamais vues se produire.</div>
<h3>Le dire trois fois</h3>
<p>Envoyez chaque bit trois fois et laissez le destinataire voter. Une inversion dans un triplet est mise en minorité, deux voix contre une. Ça marche, mais le message triple : 8 bits de plus pour 4.</p>
<h3>Un bit de parité</h3>
<p>Ajoutez un bit à chaque bloc de quatre pour que le nombre de 1 soit toujours pair. Si un seul bit s’inverse, le compte devient impair et le destinataire sait que le bloc est abîmé. Il ne peut pas savoir quel bit corriger, et deux inversions se compensent et passent inaperçues.</p>
<h3>L’astuce de Hamming</h3>
<p>Numérotez les sept bits d’un bloc de 1 à 7. Les bits aux positions 1, 2 et 4 sont des contrôles. Chaque contrôle maintient un compte pair sur les positions dont le numéro, écrit en binaire, le contient : le contrôle 1 surveille 1, 3, 5, 7 ; le contrôle 2 surveille 2, 3, 6, 7 ; le contrôle 4 surveille 4, 5, 6, 7. Quand un bit s’inverse, les numéros des contrôles qui échouent s’additionnent pour donner sa position. Si les contrôles 1 et 4 échouent, c’est la position 5 ; si aucun n’échoue, le bloc semble intact. Ainsi, tant qu’au plus un bit par bloc s’inverse, 3 bits de plus pour 4 suffisent à le réparer.</p>
<h3>Coût et protection</h3>
<p>Dans une tempête à 4 %, une image non protégée a en moyenne environ 2,6 pixels faux, avec trois copies environ 0,3, et avec l’astuce de Hamming environ 0,8, pour moins de la moitié des bits supplémentaires. La petite courbe du panneau le montre pour chaque force de tempête.</p>
<h3>Là où ça casse</h3>
<p>Ces codes supposent que chaque bit s’inverse indépendamment des autres. Les trois copies et l’astuce de Hamming promettent de corriger une inversion par bloc ; un bit de parité ne fait qu’avertir, et sans protection on n’a ni l’un ni l’autre. Deux inversions dans un même bloc de Hamming envoient le destinataire à la mauvaise position, et sa « réparation » aggrave les choses. Vers une tempête à 20 %, l’astuce de Hamming aide à peine ; un peu au-delà, elle nuit. Les vraies tempêtes arrivent en rafales : les vrais systèmes utilisent donc des codes plus longs et dispersent les bits de chaque bloc.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Pour des bits de données d1 d2 d3 d4 aux positions 3, 5, 6, 7, les contrôles sont c1 = d1 ⊕ d2 ⊕ d4, c2 = d1 ⊕ d3 ⊕ d4, c4 = d2 ⊕ d3 ⊕ d4, où ⊕ additionne des bits sans retenue. Le destinataire combine par XOR les positions qui contiennent un 1 ; le résultat, appelé syndrome, vaut 0 pour un bloc intact et donne la position inversée quand exactement un bit s’est inversé. Trois inversions peuvent se compenser pour donner 0 et passer inaperçues.</p><p>Si chaque bit s’inverse avec une probabilité p, un pixel envoyé seul est faux avec une probabilité p, et un pixel envoyé trois fois avec une probabilité 3p² − 2p³. Les courbes additionnent exactement toutes les combinaisons d’inversions possibles.</p></details>
<div class="sources"><a class="source-link" href="https://archive.org/details/bstj29-2-147" target="_blank" rel="noopener">L’article de Hamming de 1950 (en anglais)</a><a class="source-link" href="https://www.inference.org.uk/mackay/itila/" target="_blank" rel="noopener">MacKay, chapitre 1 : envoyer des images à travers le bruit (en anglais)</a></div>`,
  },
});
