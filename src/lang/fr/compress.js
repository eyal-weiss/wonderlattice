Wonderlattice.defineText('compress', 'fr', {
  eyebrow: 'COMPRESSION',
  name: 'Quelle part d’une image peut-on jeter ?',
  tagline: 'Jetez 90 % des nombres d’une image et on ne voit presque rien. Jetez les mauvais 10 % et elle est ruinée.',
  title: 'Quelle part d’une image peut-on jeter ?',
  subtitle: 'Une image est une liste de nombres. Gardez-en une partie seulement, et regardez ce qui survit.',
  field: 'Signaux · Briques de base · Une petite surprise',
  sceneLabel: '64 blocs · 64 nombres chacun',
  actionLabel: 'Échanger forts et faibles',
  canvasLabel:
    'À gauche, votre image. Au milieu, l’image refaite avec seulement les nombres gardés. À droite, les 64 briques de ' +
    'base, plus claires là où l’image s’en sert le plus. Faites glisser sur votre image pour dessiner dessus. Au clavier, ' +
    'déplacez-vous avec les flèches et appuyez sur Entrée pour peindre.',
  tip: 'Faites glisser sur votre image pour dessiner · Les flèches et Entrée peignent aussi',
  panelEyebrow: 'Choisissez quoi garder',
  whyLabel: 'Comment presque toute l’image peut-elle manquer ?',
  nudge:
    'Gardez seulement les 10 % les plus forts : voyez-vous la différence ? Passez maintenant aux plus faibles, et gardez 90 % des nombres. Que s’est-il passé ?',
  connection: {
    html: '<strong>Des bits perdus par accident, ou exprès.</strong> Ici, on jette des nombres sans presque rien remarquer. Dans « Faire traverser une tempête à une image », quelques bits en plus, bien choisis, empêchent une tempête de ruiner une image.',
    label: 'Visiter « Faire traverser une tempête à une image »',
  },
  yours: 'Votre image',
  survives: 'Ce qui survit',
  blocks: 'Les briques de base',
  broad: 'larges aplats',
  fine: 'fines ondulations',
  pictureLabel: 'Choisissez une image, ou dessinez sur la vôtre',
  pictures: { sunset: 'Coucher de soleil', face: 'Visage', checks: 'Damier', rings: 'Anneaux' },
  modeLabel: 'Quels nombres garder',
  modes: ['Les plus forts', 'Les plus faibles'],
  modeHints: [
    'Les plus grands nombres, quel que soit le bloc auquel ils appartiennent.',
    'Les plus petits nombres ; les plus grands sont jetés.',
  ],
  keepLabel: 'Combien de nombres garder',
  keepHint: 'Sur 4 096 : 64 blocs de 8 × 8 pixels, chacun écrit sous forme de 64 nombres.',
  kept: 'Nombres gardés',
  keptValue: (count, share) => `${count.toLocaleString(Wonderlattice.lang)} sur 4 096 (${share} %)`,
  energy: 'Part de l’énergie de l’image gardée',
  energyValue: (share) => `${share} %`,
  difference: 'Écart avec votre image',
  differenceValue: (share) => `${share} %`,
  verdicts: ['Presque impossible à distinguer', 'Un peu floue', 'Floue', 'Ruinée'],
  status: (verdict, share) => `${verdict} · ${share} % des nombres`,
  announce: (verdict, share, difference) => `${verdict} : ${share} % des nombres gardés, ${difference} % d’écart.`,
  yourPicture: 'Votre propre image',
  presets: [
    { name: 'Les 10 % les plus forts', note: 'Voyez-vous la différence ?', badge: '10 %' },
    { name: 'Jeter les 10 % les plus forts', note: '90 % des nombres, ruinée.', badge: '90 %' },
    { name: 'Seulement 2 %', note: 'Rien que de larges aplats.', badge: '2 %' },
  ],
  guests: [
    {
      name: 'Joseph Fourier',
      note: 'En étudiant comment la chaleur se propage, il affirma que toute courbe se construit avec des ondes. Les images aussi.',
    },
    {
      name: 'Nasir Ahmed',
      note: 'Il a proposé la transformée en cosinus au début des années 1970. Presque toutes les photos du Web sont stockées grâce à elle.',
    },
  ],
  insight: {
    title: 'Comment presque toute l’image peut-elle manquer ?',
    html: `<p>Pour un ordinateur, cette image, ce sont 4 096 nombres : une luminosité par pixel. Découpez-la en blocs de 8 × 8 pixels, et chaque bloc peut aussi s’écrire comme une recette : combien de chacun de 64 motifs fixes il faut additionner. Les motifs vont d’un aplat uniforme (la moyenne du bloc) à des ondulations de plus en plus fines. La recette compte aussi 64 nombres, et elle refait le bloc exactement. Rien n’est encore perdu.</p>
<div class="insight-visual">64 pixels ⇄ 64 quantités de 64 briques de base</div>
<h3>Pourquoi la plupart des nombres comptent à peine</h3>
<p>Dans la plupart des images, des pixels voisins se ressemblent, si bien qu’un bloc, c’est surtout sa moyenne plus quelques ondes douces. Presque toute l’énergie de l’image tombe dans quelques grands nombres, et le reste est minuscule. Gardez les grands, mettez le reste à zéro, et l’image refaite paraît presque identique. C’est l’idée derrière le JPEG.</p>
<h3>Pourquoi les mauvais 10 % la ruinent</h3>
<p>Jetez plutôt les plus grands nombres, même en gardant 90 % du reste, et ce qui reste n’est que poussière : les moyennes et les formes principales ont disparu. Combien de nombres on garde compte bien moins que lesquels.</p>
<h3>Pourquoi les bords coûtent cher</h3>
<p>Un bord net ou de fines rayures sont faits de nombreuses ondulations à la fois, si bien que « Damier » et « Anneaux » demandent bien plus de nombres que « Coucher de soleil » pour la même qualité. En jetant trop de nombres, il reste des carrés grossiers et de faibles échos le long des bords, les marques d’une photo trop compressée.</p>
<h3>Ce que cette salle laisse de côté</h3>
<p>Le vrai JPEG sépare aussi la luminosité de la couleur et stocke la couleur plus grossièrement, arrondit chaque nombre à un pas fixé par une table (des pas plus grands pour les fines ondulations, que l’œil remarque moins), puis compacte le résultat par un codage astucieux. Ici, on garde simplement les plus grands nombres de toute l’image, sans arrondir. Les briques de base et la surprise sont les mêmes.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Chaque bloc utilise la transformée en cosinus discrète à deux dimensions (DCT-II) : la quantité du motif (u, v) est la somme, sur le bloc, des valeurs des pixels multipliées par C(u, y)·C(v, x), où C(k, n) = a(k)·cos((2n + 1)kπ / 16), avec a(0) = √(1/8) et a(k) = √(2/8) sinon. Ces 64 motifs sont orthonormés : la transformée inverse utilise donc la même table, et la somme des carrés des nombres est égale à la somme des carrés des pixels. C’est pourquoi « l’énergie gardée » est exactement la part de cette somme portée par les nombres gardés. L’écart affiché est la racine de la moyenne des carrés des écarts de luminosité, en part du blanc complet.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_cosine_transform" target="_blank" rel="noopener">Transformée en cosinus discrète, Wikipédia (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/JPEG" target="_blank" rel="noopener">JPEG, Wikipédia (en anglais)</a><a class="source-link" href="https://doi.org/10.1145/103085.103089" target="_blank" rel="noopener">Wallace, « The JPEG still picture compression standard », Communications of the ACM 34 (1991) (en anglais)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Fourier/" target="_blank" rel="noopener">Joseph Fourier, MacTutor (en anglais)</a></div>`,
  },
});
