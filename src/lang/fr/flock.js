Wonderlattice.defineText('flock', 'fr', {
  eyebrow: 'ÉMERGENCE',
  name: 'Un esprit collectif',
  tagline: 'Pas de chef, juste des voisins : mettez une nuée en mouvement.',
  title: 'Un esprit collectif.',
  subtitle: 'Pas de chef. Juste des voisins. Mettez un petit monde en mouvement.',
  field: 'Systèmes dynamiques · Émergence',
  sceneLabel: 'Un monde de décisions locales',
  sceneName: 'Le collectif en mouvement',
  tip: 'Touchez ou faites glisser pour guider la nuée · Les flèches déplacent votre point d’influence, Échap le relâche · Les bords se rejoignent',
  actionLabel: 'Disperser la nuée',
  canvasLabel:
    'Une nuée de marques en mouvement. Touchez, faites glisser ou utilisez les flèches pour la guider. Appuyez sur Échap pour la relâcher.',
  panelEyebrow: 'Règles locales',
  whyLabel: 'Qui commande ?',
  nudge:
    'Baissez « Suivre la direction » jusqu’à zéro. Une foule peut-elle rester groupée sans s’accorder sur l’endroit où aller ?',
  connection: {
    html: '<strong>Un motif sans chef d’orchestre.</strong> Ici, toute une nuée naît de petites interactions. Dans « Entendre la forme », une nouvelle forme d’onde naît de l’addition de deux ondes plus simples.',
    label: 'Voir des ondes se combiner',
  },
  presets: [
    {
      name: 'En compagnie',
      note: 'Trouver une direction commune.',
    },
    {
      name: 'Chacun pour soi',
      note: 'Laisser les trajectoires individuelles l’emporter.',
    },
    {
      name: 'Rester proches',
      note: 'Ensemble, sans trop se mettre d’accord.',
    },
  ],
  align: 'Suivre la direction',
  cohesion: 'Rester ensemble',
  separate: 'Garder ses distances',
  influence: 'Votre influence',
  attract: 'Attirer',
  repel: 'Repousser',
  trails: 'Laisser des traînées lumineuses',
  neighbors: 'Montrer un voisinage',
  agreement: 'Accord des directions',
  status: (n) => `${n} décisions individuelles`,
  guests: [
    {
      name: 'John Conway',
      credit: 'Thane Plambeck (recadrée)',
      note: 'Son jeu de la vie crée lui aussi des surprises à partir de minuscules règles locales.',
    },
    {
      name: 'Alan Turing',
      note: 'Son modèle de motifs a montré comment des changements locaux peuvent faire naître taches et rayures.',
    },
  ],
  insight: {
    title: 'Qui commande ?',
    html: `<p>Personne. Chaque marque ne regarde que ses proches voisines et suit trois tendances : éviter la cohue, s’aligner sur leur direction et rester près d’elles.</p>
<div class="insight-visual">Interactions individuelles → mouvement collectif</div>
<h3>Le motif vit entre les individus</h3>
<p>Aucune marque ne connaît la forme d’ensemble de la nuée. Un mouvement cohérent peut émerger parce que chacune réagit à une petite partie du groupe. Votre curseur ajoute une attraction ou une répulsion venue de l’extérieur.</p>
<h3>Un modèle, pas un animal entier</h3>
<p>Ceci est une version simplifiée du modèle Boids de Craig Reynolds. Il rend certaines qualités visuelles des vols d’oiseaux et des bancs de poissons, mais il n’explique pas chaque décision prise par de vrais oiseaux ou de vrais poissons.</p>
<h3>Voir par les yeux d’un seul</h3>
<p>Activez « Montrer un voisinage ». Le cercle indique jusqu’où un individu perçoit les autres ; des traits pointent vers les voisins qui l’influencent. Les bords opposés se rejoignent : un voisin peut donc être proche en passant par un bord.</p>
<details><summary>Que mesure l’« accord » ?</summary><p>On fait la moyenne de tous les vecteurs de direction unitaires, puis on prend la longueur du résultat. Près de 100 %, tout le monde pointe à peu près dans le même sens. Près de zéro, les directions s’annulent pour l’essentiel. C’est une description de la nuée à cet instant, pas un score.</p><p>Chaque étape combine séparation, alignement et cohésion, puis limite la vitesse. Tous les individus se mettent à jour à partir du même état précédent.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds et les Boids (en anglais)</a></div>`,
  },
});
