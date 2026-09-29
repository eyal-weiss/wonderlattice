Wonderlattice.defineText('secret', 'fr', {
  eyebrow: 'THÉORIE DES NOMBRES',
  name: 'Un secret crié à travers la pièce',
  tagline:
    'Deux personnes conviennent d’un secret pendant que tout le monde écoute, et ceux qui écoutent ne le trouvent toujours pas.',
  title: 'Un secret crié à travers la pièce.',
  subtitle:
    'Alice et Bob ne peuvent parler que devant tout le monde. Mélangez les couleurs avec eux et voyez comment ils finissent quand même par partager un secret.',
  field: 'Théorie des nombres · Cryptographie · Une petite surprise',
  sceneLabel: 'Deux amis · Une espionne · Tout se dit à voix haute',
  sceneName: 'Partager une clé en public',
  tip: 'Appuyez sur « Étape suivante » pour suivre l’échange · Choisissez la peinture ou l’arithmétique de l’horloge dans le panneau',
  actionLabel: 'Étape suivante',
  canvasLabel: 'Alice à gauche et Bob à droite, et au milieu tout ce qu’ils disent à voix haute, là où Ève écoute.',
  panelEyebrow: 'Choisissez les secrets',
  whyLabel: 'Pourquoi Ève ne trouve-t-elle pas ?',
  nudge:
    'Suivez les trois étapes avec la peinture, puis passez à l’arithmétique de l’horloge et essayez une horloge plus grande. Regardez combien de temps il faut à Ève.',
  connection: {
    html: '<strong>Protéger un message du bruit est un problème ; le garder secret en est un autre.</strong> Dans Envoyer une image à travers la tempête, quelques bits de plus réparent ce que le bruit abîme.',
    label: 'Envoyer une image',
  },

  presets: [
    { name: 'Mélanger la peinture', note: 'Mélanger est facile. Démélanger, non.', badge: '●' },
    { name: 'Une horloge de 23', note: 'Le même tour avec des nombres.', badge: '23' },
    { name: 'Une horloge plus grande', note: 'Ève doit essayer bien plus.', badge: '9973' },
  ],

  people: { alice: 'Alice', bob: 'Bob', eve: 'Ève' },
  modes: ['Peinture', 'Arithmétique de l’horloge'],
  modeLabel: 'Le montrer avec',
  paintLabel: (name) => `Couleur secrète de ${name}`,
  colours: ['Rouge', 'Bleu', 'Vert', 'Orange', 'Violet', 'Rose'],
  pickColour: (name, colour) => `Couleur secrète de ${name} : ${colour}`,
  clockLabel: 'Taille de l’horloge',
  clockOption: (p) => `${p.toLocaleString(Wonderlattice.lang)} heures`,
  secretLabel: (name) => `Nombre secret de ${name}`,
  secretHint: 'Seul qui le choisit le connaît.',

  labels: {
    public: 'Tout le monde entend',
    secret: 'Secret',
    shared: 'Couleur commune',
    sends: 'Envoie',
    heard: (name) => `Mélange de ${name}`,
    same: 'Identiques !',
    eve: 'Le meilleur essai d’Ève',
    clock: (p) => `Une horloge de ${p.toLocaleString(Wonderlattice.lang)} heures`,
    start: (g) => `Départ : ${g}`,
    shouts: 'Crie',
    key: 'Clé',
    hops: (k) => `${k.toLocaleString(Wonderlattice.lang)} sauts`,
    eveTrying: (k, total) =>
      `Ève essaie 1, 2, 3, … : ${k.toLocaleString(Wonderlattice.lang)} sur au plus ${total.toLocaleString(Wonderlattice.lang)}`,
    eveFound: (k) => `Ève a trouvé le secret d’Alice après ${k.toLocaleString(Wonderlattice.lang)} essais`,
  },

  steps: {
    paint: [
      'Tout le monde voit le jaune. Alice et Bob gardent chacun une couleur secrète.',
      'Étape 1 sur 3 : chacun mélange son secret au jaune.',
      'Étape 2 sur 3 : ils échangent les mélanges, sous les yeux de tous.',
      'Étape 3 sur 3 : chacun ajoute à nouveau son propre secret. La même couleur des deux côtés !',
    ],
    clock: [
      (p, g) =>
        `Tout le monde connaît l’horloge (${p}) et le départ (${g}). Alice et Bob gardent chacun un nombre secret.`,
      'Étape 1 sur 3 : chacun saute autour de l’horloge, en multipliant par le départ, autant de fois que son secret.',
      'Étape 2 sur 3 : ils crient où ils sont arrivés.',
      'Étape 3 sur 3 : chacun saute à nouveau à partir de ce qu’il a entendu. Le même nombre des deux côtés !',
    ],
  },

  readout: {
    hears: 'Tout le monde entend',
    keeps: (name) => `${name} garde`,
    result: 'Le résultat',
    nothingYet: 'Rien n’a encore été dit.',
    paintHeard: 'Le jaune, et les deux mélanges.',
    paintResult: 'Alice et Bob ont la même couleur. En mélangeant les deux mélanges, Ève obtient trop de jaune.',
    clockHeard: (p, g, A, B) => `L’horloge (${p}), le départ (${g}), et les deux cris : ${A} et ${B}.`,
    clockResult: (key) =>
      `Les deux clés valent ${key}. Ève a tout entendu, mais pour obtenir la clé elle doit trouver un nombre secret en essayant.`,
    notYet: 'Pas encore.',
  },

  announce: {
    same: 'Alice et Bob partagent maintenant le même secret. Pas Ève.',
    found: (k) => `Ève a trouvé le secret d’Alice après ${k} essais.`,
  },

  guests: [
    {
      name: 'Pierre de Fermat',
      note: 'Sur une horloge à p heures, p premier, élevez n’importe quelle heure à la puissance p : elle revient à elle-même.',
    },
    {
      name: 'Leonhard Euler',
      note: 'J’ai étendu la règle de Fermat aux horloges de toutes tailles. Deux siècles plus tard, une telle arithmétique protège des secrets.',
    },
  ],

  insight: {
    title: 'Pourquoi Ève ne trouve-t-elle pas ?',
    html: `<p>Tout ce que disent Alice et Bob, Ève l’entend. L’astuce est une étape facile à faire mais très difficile à défaire. Avec la peinture, mélanger est facile, et retirer une couleur d’un mélange est pratiquement impossible. Chaque ami ajoute un secret deux fois, une fois avant d’envoyer et une fois après avoir reçu, si bien que tous deux finissent avec les trois mêmes peintures dans le pot. Ève ne voit que des mélanges qui contiennent chacun un seul secret, et en les mélangeant elle obtient trop de couleur commune.</p>
<div class="insight-visual">commune + secret d’Alice + secret de Bob, mélangés dans n’importe quel ordre</div>
<h3>Le même tour avec des nombres</h3>
<p>Sur une horloge de p heures, « multiplier par le départ g encore et encore » est facile : Alice le fait a fois (son secret) et crie où elle arrive, A. Bob le fait b fois et crie B. Ensuite Alice saute a fois à partir du B de Bob, et Bob saute b fois à partir du A d’Alice. Tous deux tombent sur la même heure, car chacun a multiplié a × b fois en tout.</p>
<p>Ève connaît l’horloge, le départ, A et B. Pour obtenir la clé, il lui faut a ou b : combien de sauts mènent du départ à A. Personne ne connaît de moyen rapide de les compter sur une grande horloge bien choisie. Ici, elle ne peut qu’essayer 1, 2, 3, …, et sur une horloge plus grande cela prend bien plus longtemps.</p>
<h3>Ce que cette salle laisse de côté</h3>
<p>La peinture est une analogie, et ces horloges sont minuscules. Les vrais systèmes utilisent des nombres de plusieurs centaines de chiffres (ou un cousin de cette idée sur des courbes), où même les méthodes les plus astucieuses que l’on connaisse sont désespérément lentes. Ils doivent aussi vérifier à qui ils parlent : cette astuce seule n’empêche pas quelqu’un au milieu de se faire passer pour Bob. Cette salle montre l’idée, pas comment protéger quoi que ce soit.</p>
<details><summary>Les mathématiques, si le cœur vous en dit</summary><p>Avec un nombre premier p et un départ g dont les puissances atteignent toutes les heures 1 … p − 1 (une racine primitive), Alice envoie A = g<sup>a</sup> mod p et Bob envoie B = g<sup>b</sup> mod p. Alors B<sup>a</sup> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> = (g<sup>a</sup>)<sup>b</sup> = A<sup>b</sup> mod p. Retrouver a à partir de g<sup>a</sup> mod p est le problème du logarithme discret. Whitfield Diffie et Martin Hellman ont publié cet échange en 1976 ; des chercheurs de l’agence de renseignement britannique GCHQ l’avaient trouvé un peu plus tôt, mais cela est resté secret jusqu’en 1997. Simon Singh raconte l’histoire dans <em>Histoire des codes secrets</em> (1999).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" target="_blank" rel="noopener">Échange de clés Diffie–Hellman (en anglais)</a><a class="source-link" href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener">Diffie et Hellman, « New directions in cryptography » (1976) (en anglais)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_logarithm" target="_blank" rel="noopener">Logarithme discret (en anglais)</a></div>`,
  },
});
