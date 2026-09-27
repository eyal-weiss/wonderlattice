Wonderlattice.defineText('fireflies', 'fr', {
  eyebrow: 'SYNCHRONIE',
  name: 'Des lucioles qui se synchronisent',
  tagline: 'Chacune à son rythme, jusqu’à ce qu’elles commencent à se remarquer.',
  title: 'Des lucioles qui se synchronisent.',
  subtitle: 'Chaque luciole a son propre tempo. Laissez-les se remarquer, et regardez un rythme commun apparaître.',
  field: 'Systèmes dynamiques · Oscillateurs couplés · Biologie',
  sceneLabel: 'Une prairie · beaucoup d’horloges',
  sceneName: 'La prairie aux lucioles',
  tip: 'Poussez « À quel point elles se remarquent » au-delà de 1 environ · Le cercle montre le rythme de toutes',
  actionLabel: 'Brouiller leurs rythmes',
  canvasLabel:
    'Une prairie de lucioles qui brillent doucement, chacune à son rythme, avec un cercle qui montre où chacune en est de son cycle.',
  panelEyebrow: 'Des rythmes qui s’attirent',
  whyLabel: 'Pourquoi finissent-elles par clignoter ensemble ?',
  nudge: 'Partez de zéro, puis montez lentement. Où commence une pulsation commune, et arrive-t-elle d’un coup ?',
  connection: {
    html: '<strong>De l’ordre sans chef d’orchestre.</strong> Ici, les rythmes s’entraînent les uns les autres jusqu’à battre ensemble. Dans « Un esprit collectif », les directions font de même pour une nuée.',
    label: 'Voir une nuée s’accorder',
  },
  presets: [
    { name: 'Chacune pour soi', note: 'Personne ne remarque personne.', badge: '0' },
    { name: 'Juste après le seuil', note: 'Une pulsation commune, lentement.', badge: '1.2' },
    { name: 'Le jour et la nuit', note: 'Un cycle de lumière s’en mêle.', badge: '☾' },
  ],
  coupling: 'À quel point elles se remarquent',
  couplingHint: 'Au-delà de 1 environ, un rythme commun commence à grandir.',
  sun: 'Ajouter un cycle jour–nuit',
  circle: 'Montrer le rythme de toutes',
  fly: 'Traverser huit fuseaux horaires',
  together: 'En phase',
  percent: (r) => `${Math.round(r * 100)} %`,
  status: {
    apart: 'Chacune à son rythme',
    stirring: 'De petits groupes trouvent la cadence',
    together: 'Elles clignotent ensemble',
  },
  flying: (days) => `Après le vol · jour ${days}`,
  caughtUp: (days) => `Les horloges ont rattrapé le nouveau jour en ${days} ${days === 1 ? 'jour' : 'jours'}.`,
  announceTogether: 'La plupart des lucioles clignotent maintenant ensemble.',
  announceApart: 'Les lucioles se sont désynchronisées.',
  labels: {
    rhythm: 'Le rythme de toutes',
    history: 'En phase, au fil du temps',
  },
  guests: [
    {
      name: 'Christiaan Huygens',
      note: 'En 1665, malade et alité, il vit deux de ses horloges à pendule battre ensemble, en sens opposés, quelle que soit la façon dont il les dérangeait.',
    },
    {
      name: 'Arthur Winfree',
      note: 'Il s’est demandé comment une foule d’horloges un peu différentes pouvait s’accorder sur l’heure, et il a trouvé un point de bascule.',
    },
  ],
  insight: {
    title: 'Pourquoi finissent-elles par clignoter ensemble ?',
    html: `<p>Chaque luciole a son rythme naturel, un peu plus rapide ou plus lent que celui des autres. Quand elle voit les éclairs autour d’elle, elle décale légèrement son tempo vers la moyenne du groupe. Personne ne mène. Si ces petits ajustements sont faibles, les différences l’emportent et la prairie scintille au hasard. S’ils sont assez forts, un rythme commun grandit et entraîne de plus en plus de lucioles.</p>
<div class="insight-visual">rythme propre + attraction vers le groupe → une pulsation commune</div>
<h3>Un seuil, pas un interrupteur</h3>
<p>En dessous d’une intensité critique (1 sur le curseur), il ne se passe presque rien. Juste au-dessus, un petit noyau se met en phase, et la synchronie monte fortement à mesure que vous avancez, mais continûment, pas d’un coup. Avec un nombre fini de lucioles, le seuil est un peu flou, et même « Chacune pour soi » affiche environ 10 % de synchronie par hasard.</p>
<h3>Des horloges dans votre corps</h3>
<p>Vos cellules portent aussi des horloges, qui tournent un peu au-dessus ou au-dessous de 24 heures. La lumière de chaque matin les remet en phase avec le jour. Traversez plusieurs fuseaux horaires et la lumière arrive au « mauvais » moment : vos horloges mettent des jours à rattraper le décalage. C’est le décalage horaire. Ici, une « journée » dure environ deux secondes.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Les vraies lucioles ne se voient pas toutes, leurs éclairs sont des impulsions et non des rythmes réguliers, et les horloges du corps font intervenir des gènes, des hormones et une horloge maîtresse dans le cerveau. C’est le modèle classique simplifié qui capture le point de bascule, pas une simulation d’insectes ou de cellules réels.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>C’est le modèle de Kuramoto. Chaque phase θ suit dθ/dt = ω + K·R·sin(ψ − θ), où ω est sa fréquence naturelle et R·e<sup>iψ</sup> la moyenne de tous les e<sup>iθ</sup> : R proche de 1 signifie en phase, R proche de 0 signifie dispersées. Quand les fréquences naturelles se répartissent en cloche, un rythme commun apparaît au-delà de K = 2 / (π g(0)), où g(0) indique à quel point la fréquence moyenne est courante. Le curseur est gradué en unités de ce K critique. Le cycle jour–nuit ajoute un terme F·sin(φ − θ), un rythme qui attire toutes les lucioles.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Kuramoto_model" target="_blank" rel="noopener">Modèle de Kuramoto, Wikipédia (en anglais)</a> · <a class="source-link" href="https://www.nigms.nih.gov/image-gallery/2569" target="_blank" rel="noopener">NIGMS : rythme circadien (en anglais)</a> · S. H. Strogatz, <em>Sync</em> (2003)</div>`,
  },
});
