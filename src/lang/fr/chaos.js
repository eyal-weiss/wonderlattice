/* Sauts au hasard, triangle parfait · les mots vus par le visiteur (fr). */
Wonderlattice.defineText('chaos', 'fr', {
  eyebrow: 'LE JEU DU CHAOS',
  name: 'Sauts au hasard, triangle parfait',
  tagline:
    'Sautez à mi-chemin vers un coin tiré au hasard, encore et encore, et une fractale impeccable surgit du bruit.',
  title: 'Sauts au hasard, triangle parfait.',
  subtitle:
    'Un point saute à mi-chemin vers un coin tiré au hasard, encore et encore. Touchez pour le faire partir d’ailleurs, ou faites glisser un coin.',
  field: 'Hasard · Fractales · Applications répétées',
  sceneLabel: 'Le jeu du chaos',
  tip: 'Touchez pour faire partir le point de là · Faites glisser un coin pour remodeler le jeu · Entrée fait un saut',
  actionLabel: 'Un saut',
  canvasLabel:
    'Les coins d’une forme, et les points laissés par un point mobile qui parcourt, à chaque saut, une partie du chemin vers un coin tiré au hasard, encore et encore.',
  panelEyebrow: 'Changer le jeu',
  whyLabel: 'Pourquoi le hasard dessine-t-il une forme parfaite ?',
  nudge:
    'Essayez quatre coins : un simple brouillard. Puis cochez « Jamais deux fois de suite le même coin » et regardez une fractale sortir du brouillard.',
  connection: {
    html: '<strong>Deux sortes de chaos.</strong> Ici, « chaos » n’est que le nom du jeu : partez de n’importe où, et la même forme apparaît. Dans « Les jumeaux de la météo », la plus petite différence grandit jusqu’à donner un tout autre avenir.',
    label: 'Les jumeaux de la météo',
  },

  presets: [
    { name: 'Trois coins', note: 'Des trous dans des trous, et pas un seul point n’y tombe.' },
    { name: 'Quatre coins', note: 'Un simple brouillard : les points vont partout.' },
    { name: 'Quatre, et une règle', note: 'Jamais deux fois le même coin : une fractale dans le brouillard.' },
    { name: 'Cinq coins', note: 'Sauter 61,8 % du chemin : cinq copies qui se touchent tout juste.' },
    { name: 'La fougère de Barnsley', note: 'Quatre règles, chacune avec sa propre probabilité.' },
  ],
  yourOwn: 'Votre propre jeu',

  corners: 'Coins',
  jump: 'Longueur de chaque saut',
  jumpHint: 'La part du chemin jusqu’au coin.',
  rule: 'Jamais deux fois de suite le même coin',
  fern: 'Faire pousser la fougère de Barnsley à la place',

  // Drawn on the picture. French uses the singular for 0 and 1.
  jumps: (n, count) => `${n} ${count < 2 ? 'saut' : 'sauts'}`,
  caption: (percent, rule) =>
    rule
      ? `Chaque saut : ${percent} % du chemin vers un coin au hasard, jamais deux fois le même`
      : `Chaque saut : ${percent} % du chemin vers un coin au hasard`,
  fernCaption: 'Chaque saut : l’une de quatre règles, tirée au hasard',

  // Over the picture, and read out once the picture settles.
  holeStatus: (n, none) =>
    none ? 'Points dans le trou du milieu : pas un seul' : `Points dans le trou du milieu : ${n}`,
  jumpStatus: (n) => `Sauts jusqu’ici : ${n}`,
  settled: (n) => `L’image s’est stabilisée après ${n} sauts.`,

  guests: [
    {
      name: 'Wacław Sierpiński',
      note: 'En 1915, il a décrit ce triangle aux trous dans des trous. C’était alors une curiosité ; aujourd’hui, un dé le dessine en quelques secondes.',
    },
    {
      name: 'Michael Barnsley',
      note: 'Il a donné son nom au jeu du chaos dans les années 1980, et a montré qu’une poignée de règles comme celles-ci peut faire pousser une fougère.',
    },
  ],

  insight: {
    title: 'Pourquoi le hasard dessine-t-il une forme parfaite ?',
    html: `<p>Chaque saut suit l’une de trois règles : diviser par deux sa distance au coin A, au coin B ou au coin C. Chaque règle réduit le triangle entier en une copie deux fois plus petite, placée à son coin. Les trois copies couvrent le triangle, sauf un trou au milieu, et chaque copie contient trois copies plus petites avec un trou en leur milieu, et ainsi de suite à l’infini. C’est le <em>triangle de Sierpiński</em>, la seule forme faite d’exactement trois copies d’elle-même deux fois plus petites. Chaque point prend la couleur du dernier coin vers lequel il a sauté, pour que vous voyiez les copies.</p>
<p>Un point sur la forme saute toujours vers un autre point de la forme, dans la copie du coin choisi, si bien qu’il ne peut jamais tomber dans un trou. Un point qui part de n’importe où ailleurs divise par deux sa distance à la forme à chaque saut, et après vingt sauts, il en est plus proche qu’un pixel. C’est pourquoi les vingt premiers sauts ne sont pas gardés. Le dé ne décide que de l’ordre dans lequel le point visite la forme. La forme elle-même est fixée par les règles.</p>
<h3>Le brouillard, et une règle qui le dissipe</h3>
<p>Quatre carrés deux fois plus petits remplissent exactement un carré, sans rien laisser, donc avec quatre coins, le point va partout : c’est le brouillard. Interdisez maintenant le même coin deux fois de suite. Pour tomber dans le carré quatre fois plus petit niché dans un coin, il faut que les deux derniers sauts soient allés tous les deux vers ce coin. Ces carrés restent donc vides, tout comme les coins de chaque copie plus petite : des trous à toutes les tailles. Avec la règle, chaque saut dépend du précédent, ce n’est donc plus le jeu simple, mais le même raisonnement dessine encore sa forme.</p>
<h3>Pas le chaos de la météo</h3>
<p>« Le jeu du chaos » est le nom que lui a donné Michael Barnsley, et rien ici n’est chaotique au sens des scientifiques : faites partir le point de n’importe où, avec d’autres nombres aléatoires, et la même image apparaît. Les nombres aléatoires viennent du générateur de l’ordinateur, qui suit une recette fixe ; ils ne sont pas vraiment aléatoires, mais ils le sont assez pour ceci. L’image est faite d’un nombre fini de points sur une grille de pixels, elle ne peut donc qu’approcher une forme qui a des détails à toutes les tailles.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Chaque règle est une <em>contraction</em> : elle rapproche deux points quelconques. John Hutchinson a prouvé en 1981 que tout ensemble fini de contractions possède exactement un ensemble non vide, fermé et borné qui est la réunion de ses propres images, l’<em>attracteur</em> de ce <em>système de fonctions itérées</em>. Michael Barnsley et Stephen Demko ont montré en 1985 que choisir les règles au hasard le dessine : avec probabilité 1, le point passe près de chacune de ses parties. Pour une forme régulière à n coins, les copies se touchent tout juste quand le point garde (3 − √5)/2 ≈ 38,2 % de sa distance avec cinq coins, et un tiers avec six. La dimension du triangle de Sierpiński est log 3 / log 2 ≈ 1,585 : divisez la taille par deux et il faut trois fois plus de morceaux, pas quatre. Le carré avec la règle a la même dimension, pour la même raison. La fougère est faite de quatre règles affines, choisies 1 %, 85 %, 7 % et 7 % du temps : l’une dessine la tige, une autre le reste de la fougère en plus petit, et deux les folioles les plus basses de chaque côté, chacune une petite copie de la fougère entière.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Chaos_game" target="_blank" rel="noopener">Le jeu du chaos (Wikipédia, en anglais)</a><a class="source-link" href="https://mathworld.wolfram.com/ChaosGame.html" target="_blank" rel="noopener">Le jeu du chaos (MathWorld, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle" target="_blank" rel="noopener">Le triangle de Sierpiński (Wikipédia, en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barnsley_fern" target="_blank" rel="noopener">La fougère de Barnsley (Wikipédia, en anglais)</a><a class="source-link" href="https://doi.org/10.1512/iumj.1981.30.30055" target="_blank" rel="noopener">Hutchinson, Fractals and self similarity (1981, en anglais)</a><a class="source-link" href="https://doi.org/10.1098/rspa.1985.0057" target="_blank" rel="noopener">Barnsley et Demko, Iterated function systems (1985, en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Sierpinski/" target="_blank" rel="noopener">Wacław Sierpiński (MacTutor, en anglais)</a></div>`,
  },
});
