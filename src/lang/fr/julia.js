Wonderlattice.defineText('julia', 'fr', {
  eyebrow: 'FRACTALES',
  name: 'Une graine pour un paysage infini',
  tagline: 'Une règle, répétée, dessine des côtes sans fin. Déplacez la graine et regardez-les changer.',
  title: 'Une graine pour un paysage infini.',
  subtitle:
    'Une toute petite règle, répétée : élever un nombre au carré et ajouter une graine. Faites glisser la graine et un paysage sans fin change de forme.',
  field: 'Nombres complexes · Répétition · Fractales',
  sceneLabel: 'Une règle · z → z² + c',
  tip: 'Faites glisser la graine sur la petite carte, ou utilisez les flèches · Touchez la grande image pour suivre le voyage d’un point',
  actionLabel: 'Longer le bord',
  canvasLabel:
    'Un grand ensemble de Julia pour la règle z → z² + c, et une petite carte des graines, l’ensemble de Mandelbrot, où la graine choisie est marquée.',
  panelEyebrow: 'Choisissez une graine',
  whyLabel: 'Comment une seule règle dessine-t-elle tout cela ?',
  nudge:
    'Faites sortir la graine de la forme sombre sur la petite carte. Le paysage vole en poussière. Ramenez-la à l’intérieur, et il redevient d’un seul tenant.',
  connection: {
    html: '<strong>Les nombres complexes peuvent déplacer un plan entier.</strong> Ici, une petite règle se répète encore et encore ; dans la salle suivante, une seule fonction courbe le plan d’un coup.',
    label: 'Courber le plan',
  },
  presets: [
    { name: 'Lapin', note: 'Trois oreilles qui tournent sans fin.' },
    { name: 'Dendrite', note: 'Des branches sans aucune place à l’intérieur.' },
    { name: 'Saint-Marc', note: 'Une basilique et son reflet.' },
    { name: 'Disque de Siegel', note: 'Les points tournent pour toujours autour d’un centre caché.' },
    { name: 'Poussière', note: 'Hors de la carte : un nuage de grains.' },
  ],
  yourOwn: 'Votre propre paysage',
  labels: {
    julia: 'Le paysage de cette graine',
    map: 'La carte des graines',
  },
  seed: (z) => `c = ${z}`,
  onePiece: 'D’un seul tenant',
  dust: 'Poussière',
  status: (inside) => (inside ? 'Graine dans la carte : d’un seul tenant' : 'Graine hors de la carte : poussière'),
  re: 'Graine, à l’horizontale',
  im: 'Graine, à la verticale',
  reHint: 'La partie réelle de c.',
  imHint: 'La partie imaginaire de c.',
  journey: 'Montrer le voyage d’un point',
  readout: {
    seed: 'La graine',
    landscape: 'Le paysage',
    journey: 'Le voyage d’un point',
  },
  landscape: (inside) =>
    inside
      ? 'D’un seul tenant : la graine est à l’intérieur de la forme sombre de la carte.'
      : 'Poussière : la graine est hors de la forme sombre, donc le paysage se défait en grains.',
  orbitHint: 'Touchez la grande image pour suivre un point.',
  escapes: (n) => `Il s’envole après ${n} ${n === 1 ? 'étape' : 'étapes'}.`,
  stays: (n) => `Il reste prisonnier : toujours près du centre après ${n} étapes.`,
  guests: [
    {
      name: 'Gaston Julia',
      note: 'En 1918, sans aucun ordinateur, il a étudié ce que la répétition d’une règle fait à chaque point du plan.',
    },
    {
      name: 'Benoît Mandelbrot',
      note: 'En 1980, ses images par ordinateur ont rendu célèbre la carte des graines. C’est aussi lui qui a inventé le mot « fractale ».',
    },
  ],
  insight: {
    title: 'Comment une seule règle dessine-t-elle tout cela ?',
    html: `<p>Choisissez une graine c. Partez d’un point z, élevez-le au carré et ajoutez c, puis recommencez encore et encore. Certains points de départ filent vers l’infini ; d’autres restent prisonniers près du centre pour toujours. La côte lumineuse de la grande image est la frontière entre les deux : l’<em>ensemble de Julia</em> de c. Les couleurs montrent combien de temps chaque point hésite près de la côte avant de s’envoler.</p>
<div class="insight-visual">z → z² + c → (z² + c)² + c → …</div>
<h3>La carte des graines</h3>
<p>Chaque point de la petite carte est une graine. Il est sombre quand le voyage qui part de 0 reste prisonnier. Cette forme sombre est l’<em>ensemble de Mandelbrot</em>, et elle fonctionne comme un catalogue : pour chaque graine à l’intérieur, le paysage est d’un seul tenant, et pour chaque graine à l’extérieur, il se défait en poussière.</p>
<h3>Infiniment détaillé, dessiné de façon approchée</h3>
<p>Regardez de près n’importe quelle côte et il y a encore de la côte : les oreilles du lapin ont des oreilles. Ces images ne peuvent donc être que des approximations. Ici, chaque point est suivi pendant au plus 200 étapes (moins pendant que la graine bouge) : un point qui s’échapperait plus tard est dessiné comme prisonnier, et les fils les plus fins peuvent manquer ou être flous.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Notons f(z) = z² + c. Dès que |z| &gt; 2 et |z| ≥ |c|, le voyage grandit forcément sans limite, donc l’ordinateur peut s’arrêter là. Les points qui ne s’échappent jamais forment l’ensemble de Julia rempli, et son bord est l’ensemble de Julia. Les couleurs utilisent un compte d’échappement lissé, n + 1 − log₂(ln |z|), qui supprime les bandes. Gaston Julia et Pierre Fatou ont montré en 1918–1919 que l’ensemble de Julia est connexe exactement quand le voyage de 0 reste borné, et qu’il est poussière sinon. L’ensemble de Mandelbrot, dessiné pour la première fois par Robert Brooks et Peter Matelski en 1978 et rendu célèbre par les images de Benoît Mandelbrot en 1980, est donc l’ensemble des graines dont le paysage est connexe. Le livre <em>The Beauty of Fractals</em> (1986) de Heinz-Otto Peitgen et Peter Richter a fait connaître ces images à un large public.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Julia_set" target="_blank" rel="noopener">Ensemble de Julia, Wikipédia (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mandelbrot_set" target="_blank" rel="noopener">Ensemble de Mandelbrot, Wikipédia (en anglais)</a><a class="source-link" href="https://doi.org/10.1007/978-3-642-61717-1" target="_blank" rel="noopener">Peitgen et Richter, The Beauty of Fractals (1986) (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Julia/" target="_blank" rel="noopener">Gaston Julia, MacTutor (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Mandelbrot/" target="_blank" rel="noopener">Benoît Mandelbrot, MacTutor (en anglais)</a></div>`,
  },
});
