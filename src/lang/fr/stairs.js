/* L’escalier sonore · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('stairs', 'fr', {
  eyebrow: 'SON · ILLUSION',
  name: 'L’escalier sonore',
  tagline: 'Une gamme qui monte marche après marche, sans jamais aller plus haut.',
  title: 'L’escalier sonore.',
  subtitle:
    'Une gamme monte marche après marche, et pourtant, douze marches plus tard, elle est revenue à son point de départ. Activez le son pour l’entendre ; l’image dévoile l’astuce.',
  field: 'Son · Octaves · Perception',
  sceneLabel: 'Huit sons, à une octave d’écart',
  sceneNames: ['Une gamme qui monte sans fin', 'Un glissando qui monte sans fin', 'Sans l’astuce'],
  tip: 'À écouter doucement, ou au casque · Chaque point lumineux est un son, et tous résonnent en même temps',
  canvasLabel:
    'Une spirale des hauteurs, un tour par octave, avec un point lumineux sur chaque tour : les sons qui résonnent ensemble, plus brillants au milieu. Vue d’en haut, la spirale est un cercle de douze notes. À côté, les mêmes sons en barres, sous une courbe d’intensité fixe.',
  panelEyebrow: 'Écouter et regarder',
  whyLabel: 'Pourquoi ne monte-t-elle jamais plus haut ?',
  nudge:
    'Activez le son, puis réduisez la courbe d’intensité à une octave : l’astuce s’effondre, et vous entendez la redescente.',
  connection: {
    html: '<strong>Une octave, c’est un doublement.</strong> Chaque son ici a une fréquence double de celle du son d’en dessous. Dans « Entendre la forme », deux sons aux rapports simples s’additionnent en battements et en boucles.',
    label: 'Entendre deux sons ensemble',
  },

  presets: [
    { name: 'L’escalier sans fin', note: 'Douze marches plus haut, retour au départ.' },
    { name: 'Le glissando sans fin', note: 'La version glissée de Risset.' },
    { name: 'Retirer l’astuce', note: 'Un son à la fois : entendez-le chuter.' },
  ],

  soundOff: 'Activer le son',
  soundOn: 'Son activé · couper',
  noSound:
    'Le son n’est pas disponible dans ce navigateur. Vous pouvez tout de même regarder comment fonctionne l’astuce.',

  how: 'Comment elle monte',
  modes: ['Marches', 'Glissando'],
  bell: 'Largeur de la courbe d’intensité, en octaves',
  bellHint: 'À une octave, un seul son résonne à la fois.',
  speed: 'Marches par seconde',
  volume: 'Volume',

  // Note names round the circle, from C (do). French names notes do, ré, mi…
  notes: ['Do', 'Do♯', 'Ré', 'Ré♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'],

  pair: {
    title: 'Ça monte ou ça descend ?',
    text: 'Deux notes, exactement à une demi-octave d’écart. La seconde monte-t-elle ou descend-elle ? Il n’y a pas de bonne réponse.',
    play: 'Jouer deux notes',
    again: 'Jouer une autre paire',
    up: 'Ça monte',
    down: 'Ça descend',
    answer: (up, a, b) =>
      up
        ? `Pour vous, le passage de ${a} à ${b} monte. D’autres auditeurs entendent exactement la même paire descendre : sur le cercle, les deux notes sont opposées, donc monter et descendre font le même chemin.`
        : `Pour vous, le passage de ${a} à ${b} descend. D’autres auditeurs entendent exactement la même paire monter : sur le cercle, les deux notes sont opposées, donc monter et descendre font le même chemin.`,
  },

  status: {
    steps: (n, same) =>
      n < 12
        ? `${n} ${n < 2 ? 'marche' : 'marches'} plus haut`
        : `${n} marches plus haut · le même son ${same === 0 ? 'qu’au départ' : `qu’à la marche ${same}`}`,
    glide: (laps) =>
      laps === 0
        ? 'Montée continue'
        : `Montée continue · retour au point de départ ${laps === 1 ? 'une fois' : `${laps} fois`}`,
    pair: (a, b) => `${a}, puis ${b} : ça monte ou ça descend ?`,
  },

  labels: {
    higher: 'plus aigu',
    turn: 'un tour = une octave',
    above: 'Vu d’en haut',
    tones: 'Les sons entendus',
    curve: 'intensité',
    pitch: 'hauteur',
    drop: 'une octave plus bas',
    up: 'haut ?',
    down: 'bas ?',
  },

  guests: [
    {
      name: 'Roger Shepard',
      note: 'Aux Bell Labs, dans les années 1960, j’ai créé une gamme qui monte sans fin. Douze marches plus haut, on est revenu au point de départ.',
    },
    {
      name: 'Jean-Claude Risset',
      note: 'J’ai fondu les marches en un seul glissando : un son qui monte sans fin, et n’arrive jamais.',
    },
    {
      name: 'Diana Deutsch',
      note: 'Cette psychologue a découvert que deux notes à une demi-octave d’écart montent pour certains auditeurs et descendent pour d’autres.',
    },
  ],

  insight: {
    title: 'Pourquoi ne monte-t-elle jamais plus haut ?',
    html: `<p>Chaque note ici n’est pas un son mais huit, à une octave d’écart : un do grave, le do au-dessus, et ainsi de suite jusqu’à un do aigu, tous en même temps. Une courbe fixe règle l’intensité de chacun. Ceux du milieu sont forts ; les plus graves et les plus aigus s’estompent jusqu’au silence.</p>
<p>Chaque marche monte les huit d’un demi-ton. Après douze marches, chaque son a doublé sa fréquence, si bien que chacun se trouve exactement là où commençait celui du dessus. Le son du haut s’est éteint dans l’aigu, un nouveau est apparu dans le grave, et le son est exactement celui du départ. Votre oreille suit la montée marche après marche et ne remarque pas l’échange.</p>
<div class="insight-visual">Marche 0 : do0 do1 do2 do3 do4 do5 do6 do7 · Marche 12 : do1 do2 do3 do4 do5 do6 do7 do8 · do0 et do8 sont tous deux muets, donc les deux sonnent pareil</div>
<h3>Deux facettes d’une note</h3>
<p>Une note a une hauteur (à quel point elle est aiguë) et un chroma (laquelle des douze notes elle est : do, ré, mi…). Imaginez-les comme une spirale : monter, c’est la hauteur, tourner, c’est le chroma, et chaque tour est une octave. Vue d’en haut, la spirale est un cercle. Ce son garde le tour et cache la montée.</p>
<h3>Retirer l’astuce</h3>
<p>Réduisez la courbe d’intensité à une octave, et un seul son résonne à la fois. Il monte pendant douze marches, s’éteint, et un son une octave plus bas prend le relais : la chute que la courbe large cache.</p>
<h3>Ça monte ou ça descend ?</h3>
<p>Deux notes à une demi-octave d’écart sont opposées sur le cercle : aucun des deux sens n’est plus court. En 1986, Diana Deutsch a découvert que les auditeurs ne sont pas d’accord sur ces paires, et que chaque auditeur entend certaines paires monter et d’autres descendre. La façon de les entendre a été reliée à la langue parlée dans l’enfance : dans ses études, des auditeurs du sud de l’Angleterre et de Californie avaient tendance à les entendre de façons opposées. Personne n’a tort.</p>
<h3>Où vous l’avez peut-être croisé</h3>
<p>Jean-Claude Risset en a fait une version qui glisse au lieu de monter par marches. Les sons de Shepard font monter la tension dans la musique du film de Christopher Nolan <em>Dunkerque</em> (2017), et une version accompagne l’escalier sans fin du jeu vidéo <em>Super Mario 64</em> (1996). La même idée en image, c’est l’escalier impossible que Lionel et Roger Penrose ont publié en 1958 (Oscar Reutersvärd en avait dessiné un en 1937), et que M. C. Escher a utilisé dans <em>Montée et Descente</em> (1960).</p>
<h3>Ce que cette salle simplifie</h3>
<p>Le « sans fin » vit dans l’oreille, pas dans le son, qui se répète exactement toutes les douze marches. Tout le monde n’entend pas l’illusion aussi fort, et les petits haut-parleurs ne peuvent pas jouer les sons les plus graves, même si la courbe les garde de toute façon discrets. Shepard utilisait une courbe de ce genre, un cosinus surélevé, et notait que presque n’importe quelle courbe douce qui s’éteint aux deux bouts ferait l’affaire.</p>
<details><summary>Les mathématiques, si vous voulez</summary><p>À la marche n, le son j (j = 0 … 7) a pour fréquence 32,7 Hz × 2<sup>x</sup> avec x = (j + n/12) mod 8, et pour intensité L(x) = ½(1 − cos(2πx/8)) : 0 en x = 0 et en x = 8, et 1 en x = 4 (do4, environ 523 Hz). Douze marches ajoutent 1 à chaque x, modulo 8, ce qui donne le même ensemble de sons. Les intensités s’additionnent toujours à 4, si bien que la force du son ne change jamais. R. N. Shepard, « Circularity in judgments of relative pitch », Journal of the Acoustical Society of America 36 (1964) 2346–2353. D. Deutsch, « A musical paradox », Music Perception 3 (1986) 275–280.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Shepard_tone" target="_blank" rel="noopener">Son de Shepard (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tritone_paradox" target="_blank" rel="noopener">Paradoxe du triton (Wikipédia, en anglais)</a><a class="source-link" href="https://deutsch.ucsd.edu/psychology/pages.php?i=206" target="_blank" rel="noopener">Diana Deutsch sur le paradoxe du triton (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Penrose_stairs" target="_blank" rel="noopener">Escalier de Penrose (Wikipédia, en anglais)</a></div>`,
  },
});
