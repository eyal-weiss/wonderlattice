Wonderlattice.defineText('traffic', 'fr', {
  eyebrow: 'THÉORIE DES JEUX',
  name: 'Le raccourci tentant',
  tagline: 'Une nouvelle route qui ralentit tous les conducteurs.',
  title: 'Le raccourci tentant.',
  subtitle:
    'Chaque conducteur prend le chemin le plus rapide. Ouvrez un nouveau raccourci et voyez si tout le monde rentre plus tôt.',
  field: 'Réseaux · Théorie des jeux · Une petite surprise',
  sceneLabel: 'Une ville · Beaucoup de choix personnels',
  sceneName: 'La traversée de la ville',
  tip: 'Les points en mouvement montrent des proportions du trafic, pas des voitures individuelles',
  actionLabel: 'Ouvrir le raccourci',
  canvasLabel:
    'Un réseau de routes à sens unique. Ouvrez ou fermez le raccourci du milieu, et faites varier le nombre de conducteurs.',
  panelEyebrow: 'Changer une route',
  whyLabel: 'Comment est-ce possible ?',
  nudge:
    'Commencez avec 4 000 conducteurs. Ouvrez le raccourci. Puis essayez un trafic bien plus léger. La route est-elle toujours une mauvaise idée ?',
  connection: {
    html: '<strong>Des règles simples, un résultat inattendu.</strong> Dans « Un esprit collectif », une nuée forme un motif à partir d’interactions locales. Ici, chaque conducteur qui choisit un trajet rapide peut ralentir le trajet de tous.',
    label: 'Suivre une autre foule',
  },
  presets: [
    {
      name: 'Routes calmes',
      note: 'Le raccourci pourrait aider.',
    },
    {
      name: 'Une ville encombrée',
      note: 'Essayez la surprise.',
    },
    {
      name: 'Heure de pointe',
      note: 'Le raccourci peut-il cesser de compter ?',
    },
  ],
  demand: 'Conducteurs qui traversent la ville',
  demandHint: 'À quel point la ville est-elle encombrée ?',
  drivers: (n) => n.toLocaleString(Wonderlattice.lang),
  status: (open, minutes) =>
    `${open ? 'Raccourci ouvert' : 'Raccourci fermé'} · ${minutes.toLocaleString(Wonderlattice.lang)} min en ce moment`,
  open: 'Ouvrir le raccourci',
  close: 'Fermer le raccourci',
  before: 'Avant',
  after: 'Après ouverture',
  minutes: ' min',
  verdict: {
    closed: 'Ouvrez le raccourci pour découvrir le nouveau temps de trajet.',
    same: 'La nouvelle route ne change pas le temps de trajet.',
    slower: (minutes) =>
      `${minutes.toLocaleString(Wonderlattice.lang)} ${minutes < 2 ? 'minute' : 'minutes'} de plus pour tout le monde.`,
    faster: (minutes) =>
      `${minutes.toLocaleString(Wonderlattice.lang)} ${minutes < 2 ? 'minute' : 'minutes'} de moins pour tout le monde.`,
  },
  labels: {
    nodes: {
      start: 'S',
      north: 'A',
      south: 'B',
      end: 'T',
    },
    congestion: 'bouchons',
    fixed: '45 min',
    shortcutOpen: '0 min',
    shortcutClosed: 'fermé',
    caption: 'S → T · chacun prend son trajet le plus rapide',
  },
  guests: [
    {
      name: 'John von Neumann',
      note: 'La circulation est un jeu de choix, et un coup astucieux peut surprendre tout le monde.',
    },
    {
      name: 'John Nash',
      note: 'Ici, aucun conducteur ne peut faire mieux en changeant seul, même si tout le monde est plus lent.',
    },
  ],
  insight: {
    title: 'Pourquoi une nouvelle route peut-elle ralentir tout le monde ?',
    html: `<p>Avec 4 000 conducteurs et sans raccourci, le trafic se répartit à parts égales entre la route du haut et celle du bas. Chaque trajet dure 65 minutes. Ouvrez la liaison de zéro minute entre A et B, et chaque conducteur a une raison de l’emprunter. Tout le monde prend S → A → B → T, et chaque trajet dure 80 minutes.</p>
<div class="insight-visual">Un raccourci peut changer les choix des gens, et leurs choix changent les bouchons.</div>
<h3>Essayez une ville plus calme</h3>
<p>Déplacez le curseur de la demande vers 1 000. Le raccourci aide alors. Quand la demande est très forte, il n’est plus utilisé. Le paradoxe ne se produit que sur une partie de la plage.</p>
<h3>Ce que ce modèle suppose</h3>
<p>Chaque conducteur choisit pour lui-même un trajet le plus rapide. Leurs décisions combinées se stabilisent dans un équilibre où aucun conducteur ne peut gagner du temps en changeant seul de route. C’est un réseau simplifié de routes à sens unique, avec un raccourci gratuit et des temps de trajet qui ne dépendent que du flux de trafic. Les points en mouvement montrent la part du trafic sur chaque trajet, pas des décisions individuelles simulées, ni une prévision pour une vraie ville.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Les tronçons sujets aux bouchons coûtent x/100 minutes, où x est le nombre de conducteurs qui les empruntent. Les deux autres tronçons coûtent chacun 45 minutes ; le raccourci A → B ne coûte rien. Sans lui, le temps de trajet est de 45 + D/200 pour D conducteurs. Pour D = 4 000, cela fait 65 minutes. Avec lui, l’équilibre passe par la route du milieu et coûte 2D/100 = 80 minutes.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explorer le paradoxe de Braess (Easley &amp; Kleinberg, en anglais)</a></div>`,
  },
});
