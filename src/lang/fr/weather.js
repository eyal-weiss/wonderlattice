Wonderlattice.defineText('weather', 'fr', {
  eyebrow: 'CHAOS · PRÉVISION',
  name: 'Les jumeaux de la météo',
  tagline: 'Deux météos partent presque identiques. Quelques semaines plus tard, elles n’ont plus rien en commun.',
  title: 'Les jumeaux de la météo.',
  subtitle:
    'Deux météos démarrent presque à l’identique et suivent exactement les mêmes règles. Regardez combien de temps elles restent semblables.',
  field: 'Chaos · Équations différentielles · Prévision',
  sceneLabel: 'Trois équations · Deux départs · Aucun hasard',
  sceneName: 'Le papillon de Lorenz',
  tip: 'Faites glisser pour tourner le papillon · Les flèches du clavier le tournent aussi · Entrée relâche les jumeaux',
  actionLabel: 'Relâcher les jumeaux',
  canvasLabel:
    'Des trajectoires jumelles qui volent autour du papillon de Lorenz en trois dimensions, avec un graphique de leur écart. Faites glisser ou utilisez les flèches pour le tourner.',
  panelEyebrow: 'Mesurez le départ',
  whyLabel: 'Pourquoi mieux mesurer ne sauve pas la prévision ?',
  nudge:
    'Essayez 3 décimales, puis 6, puis 12. Chaque décimale de plus rend le départ dix fois plus précis. Combien de jours de plus cela vous achète-t-il ?',
  connection: {
    html: '<strong>Des règles simples, des destins très différents.</strong> Ici, des règles exactes écartent des départs voisins. Dans le pré des lucioles, des règles simples rapprochent des rythmes différents.',
    label: 'Voir des rythmes se synchroniser',
  },

  presets: [
    { name: 'La sortie papier de Lorenz', note: 'Trois décimales, comme sur sa sortie papier de 1961.' },
    { name: 'Six décimales', note: 'À un millionième près. Combien de temps tiennent-ils ?' },
    { name: 'Une foule de vingt', note: 'Vingt essais pour un même départ, comme le font les prévisionnistes.' },
  ],

  digits: 'Décimales mesurées',
  digitsHint: 'Chaque décimale de plus rend le départ dix fois plus précis.',
  twins: 'Jumeaux',
  twinsHint: 'Chaque jumeau part à une distance aléatoire minuscule du vrai départ.',
  speed: 'Vitesse',
  ghost: 'Montrer le papillon',
  spin: 'Le laisser tourner',
  turn: 'Tourner la vue',
  turnLeft: 'Tourner la vue vers la gauche',
  turnRight: 'Tourner la vue vers la droite',
  tiltUp: 'Incliner la vue vers le haut',
  tiltDown: 'Incliner la vue vers le bas',

  day: (n) => `Jour ${n}`,
  days: (n) => `${n} ${n < 2 ? 'jour' : 'jours'}`,
  statusTogether: (n) => `Jour ${n} · les jumeaux sont encore ensemble`,
  statusParted: (n) => `La prévision a tenu ${n} ${n < 2 ? 'jour' : 'jours'}`,
  announceLost: (n) => `Les jumeaux se sont séparés : la prévision a tenu ${n} ${n < 2 ? 'jour' : 'jours'}.`,
  chartLabel: 'Leur écart (chaque ligne, dix fois plus loin)',
  lostLine: 'prévision perdue',
  readout: {
    held: 'La prévision a tenu',
    notYet: 'elle tient encore',
    rule: 'Chaque décimale de plus achète environ',
  },

  guests: [
    {
      name: 'Edward Lorenz',
      note: 'Une sortie papier à trois chiffres lui a appris qu’un arrondi minuscule peut devenir un autre ciel.',
    },
    {
      name: 'Henri Poincaré',
      note: 'Des décennies plus tôt, il avait vu que de petites différences au départ peuvent en faire de grandes ensuite.',
    },
  ],

  insight: {
    title: 'Pourquoi mieux mesurer ne sauve pas la prévision ?',
    html: `<p>Rien n’est aléatoire ici. Chaque jumeau suit les mêmes trois équations exactes. La seule différence est leur point de départ : moins d’un millionième d’écart, avec le réglage par défaut. Et pourtant l’écart ne reste pas petit. En moyenne, il double à peu près tous les trois quarts de jour, il croît donc de façon exponentielle, et au bout de deux semaines environ les jumeaux sont aussi différents que deux météos sans rapport.</p>
<div class="insight-visual">un écart minuscule × un doublement, encore et encore → un état complètement différent</div>
<h3>Un peu plus de temps, jamais beaucoup</h3>
<p>Mesurez le départ dix fois plus précisément et l’écart part dix fois plus petit. Mais la croissance exponentielle efface cette avance en un temps fixe : ici, environ deux jours et demi par décimale. Douze décimales au lieu de six achètent environ deux semaines de plus, pas une prévision qui dure toujours. C’est la sensibilité aux conditions initiales, souvent appelée effet papillon.</p>
<h3>La sortie papier de Lorenz</h3>
<p>En 1961, le météorologue Edward Lorenz relança une simulation météo à partir des nombres d’une sortie papier. L’ordinateur gardait six chiffres, le papier seulement trois : 0.506127 fut donc ressaisi comme 0.506. La nouvelle simulation suivit l’ancienne un moment, puis dériva vers une météo complètement différente. Les trois équations de cette salle viennent de son article de 1963.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>Ces trois équations sont une image très simplifiée d’un air chauffé par le bas. Elles montrent pourquoi la prévision a un horizon ; ce n’est pas un simulateur météo. Ici, un « jour » est une unité de temps du modèle. Les vrais prévisionnistes affrontent le même problème avec des modèles bien plus riches : c’est pourquoi ils lancent une foule de départs légèrement différents, comme dans « Une foule de vingt », et indiquent à quel point cette foule est d’accord.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Les équations de Lorenz sont dx/dt = σ(y − x), dy/dt = x(ρ − z) − y et dz/dt = xy − βz, avec σ = 10, ρ = 28 et β = 8/3. Leurs solutions ne se calment jamais et ne se répètent jamais, mais restent sur un ensemble en forme de papillon appelé attracteur étrange. Des solutions voisines s’écartent en moyenne comme e<sup>λt</sup>, où λ ≈ 0,9 est le plus grand exposant de Lyapunov. Un départ mesuré à n décimales, décalé de 10<sup>−n</sup>, reste donc à moins d’une distance D pendant environ ln(D · 10<sup>n</sup>)/λ unités de temps : chaque décimale de plus ajoute ln(10)/λ ≈ 2,5. La salle résout les équations par la méthode classique de Runge–Kutta, par pas de 0,005, et une prévision est perdue quand un jumeau s’éloigne de plus de 5 unités de la vérité, environ un dixième de la taille du papillon.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Lorenz_system" target="_blank" rel="noopener">Le système de Lorenz (en anglais)</a><a class="source-link" href="https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2" target="_blank" rel="noopener">E. N. Lorenz, « Deterministic nonperiodic flow », Journal of the Atmospheric Sciences 20 (1963) (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Butterfly_effect" target="_blank" rel="noopener">L’effet papillon (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lyapunov_exponent" target="_blank" rel="noopener">Exposant de Lyapunov (en anglais)</a></div>`,
  },
});
