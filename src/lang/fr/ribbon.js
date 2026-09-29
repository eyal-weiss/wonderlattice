Wonderlattice.defineText('ribbon', 'fr', {
  eyebrow: 'TOPOLOGIE · 3D',
  name: 'Où est l’autre face ?',
  tagline: 'Donnez une demi-torsion à un ruban, et l’une de ses faces disparaît.',
  title: 'Où est l’autre face ?',
  subtitle:
    'Une bande de papier avec une demi-torsion. Faites-la tourner, suivez son bord, et voyez si elle a vraiment deux faces.',
  field: 'Topologie · Surfaces · 3D',
  sceneLabel: 'Une bande ordinaire, un étrange voyage',
  sceneName: 'Le ruban de Möbius',
  tip: 'Faites glisser pour tourner · Les flèches ou les boutons de rotation tournent aussi la vue',
  actionLabel: 'Suivre le bord',
  canvasLabel: 'Un ruban en trois dimensions. Faites glisser ou utilisez les flèches pour le faire tourner.',
  panelEyebrow: 'Tourner et suivre',
  whyLabel: 'Où est passée l’autre face ?',
  nudge:
    'Suivez le voyageur doré. Avec une demi-torsion, il lui faut deux tours autour du trou pour revenir à son point de départ.',
  connection: {
    html: '<strong>Fabriquez-le.</strong> Prenez une bande de papier, donnez une demi-torsion à une extrémité, puis collez les deux bouts ensemble. Tracez une ligne en son milieu sans lever le stylo.',
    label: 'Suivre un autre genre de boucle',
  },
  presets: [
    {
      name: 'Sans torsion',
      note: 'Un anneau familier, avec deux bords.',
    },
    {
      name: 'Une demi-torsion',
      note: 'Une seule face continue. Un seul bord.',
    },
    {
      name: 'Une torsion complète',
      note: 'Les deux bords reviennent.',
    },
  ],
  twists: 'Tordre le ruban',
  twistOptions: ['Sans torsion · un anneau', 'Une demi-torsion · Möbius', 'Une torsion complète · un anneau'],
  width: 'Largeur du ruban',
  zoom: 'Regarder de plus près',
  spin: 'Le laisser tourner',
  walk: 'Montrer le voyageur',
  edges: 'Surligner les bords',
  turn: 'Tourner la vue',
  turnLeft: 'Tourner la vue vers la gauche',
  turnRight: 'Tourner la vue vers la droite',
  tiltUp: 'Incliner la vue vers le haut',
  tiltDown: 'Incliner la vue vers le bas',
  nameOneSided: 'Le ruban de Möbius',
  nameTwoSided: 'L’anneau tordu',
  statusOneSided: 'Une face · un bord',
  statusTwoSided: 'Deux faces · deux bords',
  showEdges: 'Suivre le bord',
  hideEdges: 'Masquer les bords',
  guests: [
    {
      name: 'August Möbius',
      note: 'Une seule demi-torsion fait de « l’autre face » une question piège.',
    },
    {
      name: 'Johann Listing',
      note: 'Il a lui aussi exploré les surfaces à une seule face. L’histoire retient plus d’un nom.',
    },
  ],
  insight: {
    title: 'Une torsion change le voyage.',
    html: `<p>Refermez une bande de papier en anneau : vous obtenez deux faces et deux bords séparés. Donnez une demi-torsion à une extrémité avant de la recoller, et quelque chose change : vous pouvez atteindre ce qui semblait être l’autre face sans franchir de bord.</p>
<div class="insight-visual">Le ruban de Möbius a une seule face continue et un seul bord, qui forme une boucle.</div>
<h3>Suivez le voyageur doré</h3>
<p>Le voyageur part à l’écart de la ligne médiane. Sur un ruban de Möbius, un tour autour du trou l’amène à la position opposée dans la largeur. Un deuxième tour le ramène au départ. Il ne saute jamais d’un bord à l’autre du ruban.</p>
<h3>Comptez les bords</h3>
<p>« Suivre le bord » met le bord en évidence. Avec une demi-torsion, les deux bords apparents forment une seule boucle continue. Sans torsion ou avec une torsion complète, ce sont deux boucles séparées, de couleurs différentes, l’une en pointillés.</p>
<h3>Une autre façon de voir les formes</h3>
<p>La topologie étudie les propriétés qui résistent quand on plie et qu’on étire sans déchirer. Faire tourner cet objet à l’écran change votre point de vue, mais il garde sa face unique.</p>
<details><summary>Comment la surface est-elle dessinée ?</summary><p>Pour un angle u et une coordonnée de largeur v :<br>x = (R + v cos(nu/2)) cos(u)<br>y = (R + v cos(nu/2)) sin(u)<br>z = v sin(nu/2)</p><p>n compte les demi-torsions. Un n impair donne un ruban de Möbius ; un n pair donne un anneau à deux faces. C’est une surface paramétrée projetée sur l’écran, dont les facettes sont triées par profondeur. Un ombrage translucide laisse voir le voyageur à travers la surface.</p></details>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/MoebiusStrip.html" target="_blank" rel="noopener">Explorer le ruban de Möbius (en anglais)</a></div>`,
  },
});
