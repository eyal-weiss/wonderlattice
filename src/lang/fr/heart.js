Wonderlattice.defineText('heart', 'fr', {
  eyebrow: 'MILIEUX EXCITABLES',
  name: 'Un battement qui voyage',
  tagline: 'Touchez une nappe de cellules et une onde s’élance. Brisez-la, et elle s’enroule en spirale.',
  title: 'Un battement qui voyage.',
  subtitle: 'Chaque cellule s’active, puis se repose. Lancez une onde, puis voyez ce que fait une onde brisée.',
  field: 'Milieux excitables · Ondes spirales · Ondes dans le corps',
  sceneLabel: 'Une nappe · Des milliers de cellules',
  sceneName: 'Le battement voyageur',
  tip: 'Touchez pour lancer une onde · Glissez à travers une onde pour la briser · Les flèches visent, Entrée lance une onde, Suppr efface',
  actionLabel: 'Briser une onde',
  canvasLabel:
    'Une nappe de cellules où des ondes d’activité partent d’un stimulateur dans le coin et de vos touches. Glissez à travers une onde pour la briser.',
  panelEyebrow: 'S’activer, puis se reposer',
  whyLabel: 'Pourquoi une onde brisée tourne-t-elle ?',
  nudge:
    'Appuyez sur « Briser une onde », puis regardez les battements dans le coin opposé. Le stimulateur donne-t-il encore le rythme ?',
  connection: {
    html: '<strong>Des motifs nés de cellules qui ne parlent qu’à leurs voisines.</strong> Ici, des ondes d’activité parcourent une nappe de cellules. Dans « Faire pousser une empreinte », deux substances chimiques qui se diffusent à des vitesses différentes dessinent des crêtes.',
    label: 'Voir pousser les crêtes',
  },
  presets: [
    { name: 'Un battement régulier', note: 'Un stimulateur, un battement par seconde.', badge: '♥' },
    { name: 'Briser une onde', note: 'Ses bouts libres s’enroulent en spirales.', badge: '@' },
    { name: 'Récupération lente', note: 'Certains battements n’arrivent jamais.', badge: '½' },
  ],
  recovery: 'Temps de récupération',
  recoveryHint: 'Le temps qu’une cellule se repose avant de pouvoir s’activer à nouveau.',
  pacemaker: 'Stimulateur dans le coin',
  rateLabel: 'Battements qui atteignent le coin opposé',
  rate: (n) => `${n} par minute`,
  pacemakerRate: 'Le stimulateur bat 60 fois par minute.',
  status: {
    quiet: 'Toutes les cellules se reposent',
    waves: 'Des ondes voyagent',
    steady: 'Chaque battement atteint le coin opposé',
    blocked: 'Certains battements n’atteignent jamais le coin opposé',
    spirals: (n) => (n === 1 ? 'Une spirale tourne toute seule' : `${n} spirales tournent toutes seules`),
  },
  guests: [
    {
      name: 'Norbert Wiener',
      note: 'Avec Arturo Rosenblueth, j’ai décrit en 1946 comment une onde d’excitation peut continuer à tourner autour d’un obstacle dans le muscle cardiaque.',
    },
    {
      name: 'Arthur Winfree',
      note: 'J’ai cherché le point immobile au centre d’une onde spirale, là où le rythme n’a plus aucune phase.',
    },
  ],
  insight: {
    title: 'Pourquoi une onde brisée tourne-t-elle ?',
    html: `<p>Chaque cellule de cette nappe est au repos, active ou en récupération. Une cellule au repos s’active quand assez de ses voisines s’activent. Une cellule active s’éteint vite, puis il lui faut du temps pour récupérer avant de pouvoir s’activer à nouveau. Une nappe de ce genre s’appelle un <em>milieu excitable</em>.</p>
<div class="insight-visual">repos → activité → récupération → repos</div>
<h3>Pourquoi les ondes ne se traversent pas</h3>
<p>Derrière chaque onde se trouve une bande de cellules en récupération. Quand deux ondes se rencontrent, chacune bute sur la bande en récupération de l’autre et s’arrête : elles s’annulent au lieu de se croiser.</p>
<h3>Pourquoi une onde brisée tourne</h3>
<p>Une onde qui a un bout libre avance plus lentement à ce bout, où elle a moins de voisines actives, que plus loin. Le bout prend du retard, le reste de l’onde pivote autour, et l’onde s’enroule en spirale. Une spirale a son propre rythme, et ici ce rythme est plus rapide que celui du stimulateur : la spirale prend le contrôle de toute la nappe.</p>
<h3>Cœurs, chimie et myxomycètes</h3>
<p>Le muscle cardiaque est lui aussi un milieu excitable : chaque battement est une onde d’activité électrique lancée par un stimulateur naturel. Les ondes spirales qui tournent dans le tissu cardiaque, appelées réentrées, sont liées à certains troubles graves du rythme cardiaque. Les mêmes spirales apparaissent dans la réaction chimique de Belousov–Jabotinski et dans les colonies de myxomycètes.</p>
<h3>Ce que ce modèle laisse de côté</h3>
<p>C’est un jouet : une nappe plate et uniforme qui suit une règle mathématique simple. Un vrai tissu cardiaque a des fibres, trois dimensions, de nombreux types de cellules et une chimie bien plus riche. La salle montre pourquoi les spirales se forment et pourquoi elles durent. Ce n’est pas une simulation de cœur, et elle ne dit rien de la santé de qui que ce soit.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Chaque cellule a une activation u entre 0 et 1 et une récupération v, selon le modèle de Barkley : ∂u/∂t = ∇²u + u(1 − u)(u − (v + b)/a)/ε et ∂v/∂t = k(u − v), avec a = 0,75, b = 0,02 et ε = 0,02. Le terme ∇²u propage l’activation aux voisines. Le terme cubique ne laisse une cellule s’activer qu’au-dessus d’un seuil, et ce seuil reste haut tant que la cellule récupère. Le facteur k, ajouté ici, est réglé par le curseur de récupération : une récupération plus lente donne des ondes plus larges, des spirales plus grandes et, quand des cellules récupèrent encore à l’arrivée du battement suivant, des battements bloqués. Des modèles plus anciens de la même idée étaient des automates cellulaires à quelques états discrets, comme celui de Greenberg et Hastings en 1978. Le livre d’Arthur Winfree <em>When Time Breaks Down</em> (1987) raconte l’histoire des spirales dans les cœurs et en chimie.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Excitable_medium" target="_blank" rel="noopener">Milieu excitable, Wikipédia (en anglais)</a><a class="source-link" href="http://www.scholarpedia.org/article/Barkley_model" target="_blank" rel="noopener">Modèle de Barkley, Scholarpedia (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Belousov%E2%80%93Zhabotinsky_reaction" target="_blank" rel="noopener">Réaction de Belousov–Jabotinski, Wikipédia (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Arthur_Winfree" target="_blank" rel="noopener">Arthur Winfree, Wikipédia (en anglais)</a></div>`,
  },
});
