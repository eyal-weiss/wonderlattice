/* La douche qui ne se stabilise jamais · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('shower', 'fr', {
  eyebrow: 'RÉTROACTION',
  name: 'La douche qui ne se stabilise jamais',
  tagline: 'Trop froid, trop chaud, trop froid… et plus vous vous acharnez, pire c’est.',
  title: 'La douche qui ne se stabilise jamais.',
  subtitle:
    'L’eau met un moment à monter dans le tuyau. Le baigneur pressé passe sans cesse du glacé au brûlant ; le patient trouve la bonne température. Changez le tuyau, ou prenez vous-même le robinet en main.',
  field: 'Rétroaction · Retard · Une frontière nette à π/2',
  sceneLabel: 'L’idéal : 38 °C · Le robinet va de 10 °C à 55 °C',
  sceneNames: ['Deux baigneurs, un tuyau', 'Un baigneur', 'Votre main sur le robinet'],
  tip: 'Le tuyau a la couleur de l’eau qu’il contient · ← → sur l’image changent le tuyau · Avec « Votre main », faites glisser sur l’image ou appuyez sur ← → pour tourner le robinet',
  soundOff: 'Activer le son',
  soundOn: 'Son activé · couper',
  noSound: 'Le son n’est pas disponible dans ce navigateur. Vous pouvez tout de même regarder les baigneurs.',
  canvasLabel:
    'Deux baigneurs dessinés se tiennent sous des douches. Chacun tourne un robinet sur le mur, et l’eau monte par un long tuyau jusqu’au pommeau, colorée du bleu pour le froid au rouge pour le chaud : chaque baigneur ne sent donc un tour de robinet qu’un moment plus tard. En dessous, un graphique montre la température que ressent chaque baigneur sur les 30 dernières secondes, avec une bande pour la température idéale. Au début, le baigneur pressé passe sans fin du glacé au brûlant, tandis que le patient se stabilise à 38 °C. À côté, une carte montre quels mélanges d’impatience et de longueur de tuyau se stabilisent.',
  panelEyebrow: 'Qui tient le robinet ?',
  whyLabel: 'Pourquoi vaut-il mieux être patient ?',
  nudge:
    'Regardez le baigneur doré : chaque tour de robinet arrive en retard, alors il en fait toujours trop. Raccourcissez le tuyau, et c’est le pressé qui se stabilise le premier. Puis essayez « Un baigneur », et trouvez l’impatience à partir de laquelle les oscillations commencent.',
  connection: {
    html: '<strong>Réagir à ce que l’on voit.</strong> Ici, un baigneur qui réagit à de vieilles nouvelles oscille sans fin. Dans « Des lucioles qui se synchronisent », chaque luciole avance sa propre horloge quand elle voit un éclair, et tout l’essaim finit par clignoter en rythme.',
    label: 'Voir les lucioles',
  },

  presets: [
    { name: 'Aucune oscillation', note: 'Assez doux pour ne jamais aller trop loin.', badge: '1/e' },
    { name: 'Sur le fil du rasoir', note: 'L’oscillation ne grandit ni ne s’éteint.', badge: 'π/2' },
    { name: 'Un tuyau court', note: 'Cette fois, le pressé gagne.', badge: '½ s' },
  ],

  modeLabel: 'Qui tient le robinet ?',
  // Par numéro de mode : les deux baigneurs côte à côte, un seul baigneur, le visiteur.
  modes: ['Deux baigneurs', 'Un baigneur', 'Votre main'],
  // Écrits sous chaque douche : le baigneur pressé et le patient, le baigneur seul, et le visiteur.
  bathers: ['Pressé', 'Patient', 'Baigneur', 'Vous'],

  pipe: 'Longueur du tuyau',
  pipeHint: 'Le nombre de secondes que met l’eau pour aller du robinet au pommeau.',
  seconds: ' s',
  impatience: 'Impatience',
  impatienceHint:
    'La vitesse à laquelle le baigneur tourne le robinet, pour chaque degré d’écart avec la bonne température.',
  hand: 'Votre robinet',
  handHint: 'Visez 38 °C. L’eau que vous sentez a quitté le robinet il y a un moment.',
  cold: 'froid',
  hot: 'chaud',
  handValue: (percent) => `${percent} % du chemin vers le chaud`,

  readout: {
    product: 'Impatience × tuyau',
    sum: (k, d, kd) => `${k} × ${d} s = ${kd}`,
    verdicts: ['Se stabilise sans dépasser', 'Oscille, puis se stabilise', 'Ne se stabilise jamais'],
    smooth: 'L’eau monte doucement jusqu’à 38 °C et y reste.',
    // La salle écrit la part sous la forme 43% ; on ajoute l’espace fine insécable avant %.
    fades: (share, period) =>
      `Chaque oscillation fait ${share.replace('%', ' %')} de la précédente, une toutes les ${period} s.`,
    edge: (period) =>
      `Pile sur la ligne : l’oscillation garde sa taille, une toutes les ${period} s, soit quatre fois le trajet dans le tuyau.`,
    grows: (ratio, period) =>
      `Chaque oscillation est ${ratio} fois plus grande que la précédente, une toutes les ${period} s, jusqu’à ce que le robinet arrive en butée.`,
    limit: (d, limit) =>
      `Avec un tuyau de ${d} s, toute impatience inférieure à ${limit} se stabilise : c’est π/2 ÷ ${d}.`,
    hands: (d) => `L’eau que vous sentez a quitté le robinet il y a ${d} s. Essayez de la maintenir à 38 °C.`,
  },

  status: (text, seconds) => `${text} s écoulée${seconds < 2 ? '' : 's'}`,
  // Par mode : l’eau reçue en ce moment, à côté de l’image.
  now: [
    (eager, patient) => `En ce moment, le baigneur pressé reçoit de l’eau à ${eager}, le patient à ${patient}.`,
    (water) => `En ce moment, le baigneur reçoit de l’eau à ${water}.`,
    (water) => `En ce moment, vous recevez de l’eau à ${water}.`,
  ],
  // Une espace insécable, pour qu’une température ne soit jamais coupée en fin de ligne.
  degrees: (value) => `${value} °C`,
  announce: {
    race: (eager, patient) =>
      `Après 15 secondes, le baigneur pressé reçoit de l’eau à ${eager} et oscille encore ; le patient la reçoit à ${patient}.`,
    one: (water, verdict) => `Après 15 secondes, l’eau est à ${water}. ${verdict}.`,
  },

  // Les mots dessinés sur l’image.
  labels: {
    seconds: 'secondes',
    justRight: 'idéal',
    tap: 'robinet',
    // Le nom d’un baigneur et la température qu’il ressent.
    tag: (name, value) => `${name} ${value}`,
    mapTitle: 'Quels baigneurs se stabilisent ?',
    mapX: 'tuyau, secondes',
    mapY: 'impatience',
    regions: ['sans rebond', 'oscille, puis stable', 'jamais stable'],
    safe: (limit) => `stable sous ${limit}`,
    drag: 'Faites glisser sur l’image pour tourner le robinet',
    onYou: 'Sur vous',
    inPipe: 'En chemin',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'En 1868, son article « On Governors » s’est servi des mathématiques pour se demander quand une machine qui se corrige elle-même se stabilise, et quand ses corrections oscillent de plus en plus fort.',
    },
    {
      name: 'Nicolas Minorsky',
      note: 'Il a observé les timoniers gouverner d’après l’écart, d’après sa durée et d’après la vitesse à laquelle il change, et en 1922 il en a tiré une règle pour gouverner automatiquement les navires.',
    },
  ],

  insight: {
    title: 'Pourquoi vaut-il mieux être patient ?',
    html: `<p>Le baigneur réagit à l’eau qu’il sent, mais cette eau a quitté le robinet il y a un moment. Il tourne le robinet vers le chaud et rien ne change encore, alors il le tourne davantage. Quand l’eau chaude arrive enfin, le robinet est réglé bien trop chaud, et la même chose se produit dans l’autre sens. Le baigneur pressé corrige sans cesse une erreur qui est déjà en train de se corriger.</p>
<div class="insight-visual">Impatience × tuyau sous 1/e ≈ 0,37 : aucune oscillation · sous π/2 ≈ 1,57 : des oscillations qui s’éteignent · au-delà de π/2 : une oscillation sans fin</div>
<h3>Seul le produit compte</h3>
<p>Disons que le baigneur tourne le robinet de <em>k</em> degrés par seconde pour chaque degré d’écart avec la bonne température, et que l’eau met <em>d</em> secondes à arriver. Que la douche se stabilise ou non ne dépend que de <em>k</em> × <em>d</em>. Un tuyau plus long demande donc une main plus douce : la plus grande impatience qui se stabilise encore vaut π/2 ÷ <em>d</em>. Avec un tuyau de deux secondes, le 0,3 × 2 = 0,6 du baigneur patient se stabilise, et le 0,9 × 2 = 1,8 du baigneur pressé jamais. Raccourcissez le tuyau à une demi-seconde, et c’est le baigneur pressé qui se stabilise le premier, en moins de deux secondes.</p>
<h3>Pile sur la ligne</h3>
<p>Pour exactement <em>k</em> × <em>d</em> = π/2, l’oscillation ne grandit ni ne s’éteint, et une oscillation complète dure quatre fois le temps que met l’eau à arriver. La même limite apparaît partout où l’on agit d’après de vieilles nouvelles, comme un thermostat dont le radiateur met du temps à chauffer, ou un timonier qui gouverne un grand navire. Un remède classique consiste à prédire : le prédicteur de Smith (O. J. M. Smith, 1957) utilise un modèle du retard pour calculer ce qui est déjà en chemin. Vous pouvez l’essayer ici. Avec « Votre main », regardez la couleur dans le tuyau plutôt que l’eau sur le baigneur.</p>
<h3>Ce que cette salle laisse de côté</h3>
<p>Dans la réalité, on ne réagit pas aussi régulièrement, et les vrais mitigeurs ne changent pas la température régulièrement quand on les tourne. Ici, l’eau monte dans le tuyau d’un seul bloc, sans se mélanger ni refroidir. Au-delà de π/2, les oscillations de l’équation grandissent sans limite ; les butées du robinet, à 10 °C et 55 °C, transforment cette croissance en une oscillation régulière entre elles, si bien que la taille de l’oscillation que vous voyez vient des butées, pas de l’équation. Beaucoup de chauffages domestiques se contentent de s’allumer et de s’éteindre, ce que cette salle ne montre pas.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>Notons <em>e</em>(<em>t</em>) l’écart entre la position du robinet et la bonne position. L’eau ressentie à l’instant <em>t</em> a quitté le robinet à l’instant <em>t</em> − <em>d</em>, donc le baigneur tourne le robinet à la vitesse <em>e</em>′(<em>t</em>) = −<em>k</em>·<em>e</em>(<em>t</em> − <em>d</em>) : une équation différentielle à retard, que Chris Budd appelle l’équation de la douche. En essayant <em>e</em> = e<sup><em>λt</em></sup>, on obtient <em>λ</em> = −<em>k</em>·e<sup>−<em>λd</em></sup>, donc <em>λd</em> = W(−<em>kd</em>), où W est la fonction W de Lambert. La racine qui compte le plus vient de la branche principale de W. Elle est réelle pour <em>kd</em> ≤ 1/e, donc il n’y a pas de dépassement. Au-delà, elle est complexe, ce qui signifie des oscillations, et sa partie réelle devient positive en <em>kd</em> = π/2, où W(−π/2) = <em>i</em>π/2 : une oscillation de période 4<em>d</em>. La salle fait avancer l’équation 60 fois par seconde, avec les butées du robinet ; les nombres du panneau viennent de W.</p></details>
<div class="sources"><a class="source-link" href="https://plus.maths.org/content/shower-equation" target="_blank" rel="noopener">C. Budd, « The shower equation », Plus Magazine (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Delay_differential_equation" target="_blank" rel="noopener">Équation différentielle à retard (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lambert_W_function" target="_blank" rel="noopener">Fonction W de Lambert (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Smith_predictor" target="_blank" rel="noopener">Prédicteur de Smith (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/PID_controller#History" target="_blank" rel="noopener">Régulateur PID : histoire (Maxwell, Minorsky) (en anglais)</a></div>`,
  },
});
