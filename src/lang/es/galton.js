/* La forma escondida en el azar · palabras para el visitante (es). */
Wonderlattice.defineText('galton', 'es', {
  eyebrow: 'PROBABILIDAD',
  name: 'La forma escondida en el azar',
  tagline: 'Cada bola rebota a izquierda o derecha al azar. Juntas forman la misma campana cada vez.',
  title: 'La forma escondida en el azar.',
  subtitle:
    'Cada bola rebota a izquierda o derecha al azar, y aun así el montón crece hasta formar la misma campana cada vez. Luego promedia un dado cargado.',
  field: 'Probabilidad · El triángulo de Pascal · El teorema central del límite',
  canvasLabel:
    'Un tablero de clavos. Las bolas caen desde arriba, rebotan a izquierda o derecha al azar en cada clavo y se amontonan en casillas al fondo, bajo una curva en forma de campana. Debajo, otras cuatro tandas han formado la misma campana.',
  panelEyebrow: 'A merced del azar',
  whyLabel: '¿Por qué el azar forma una campana?',
  nudge:
    'Suelta otra tanda: cada bola sigue un camino nuevo, y el montón vuelve a formar la misma campana. Luego diseña un dado cargado y mira sus promedios.',
  connection: {
    html: '<strong>Los promedios domestican el azar.</strong> En «Una cucharada de ciudad», una pequeña encuesta al azar queda cerca de la verdad por la misma razón: los promedios de muchas respuestas al azar se agolpan en una campana estrecha.',
    label: 'Toma una cucharada de ciudad',
  },

  // Las tres cosas que caen: cada una tiene su propia escena, consejo y acción.
  viewLabel: 'Qué cae',
  views: ['Bolas y clavos', 'Un dado cargado', 'Un faro testarudo'],
  scenes: [
    { label: 'A izquierda o derecha en cada clavo', name: 'Bolas y clavos' },
    { label: 'Tu dado, y promedios de sus tiradas', name: 'Un dado cargado' },
    { label: 'Un faro gira y alumbra una pared', name: 'Un faro testarudo' },
  ],
  tips: [
    'Las flechas inclinan los clavos · Suelta otra vez para tener bolas nuevas',
    'Arrastra las barras del dado para cambiar su forma · Las flechas eligen una cara y la cambian',
    'Cada giro marca dónde cae la luz · Gira otra vez para tener giros nuevos',
  ],
  actions: ['Soltar otra vez', 'Tirar otra vez', 'Girar otra vez'],
  canvasLabels: [
    'Un tablero de clavos. Las bolas caen desde arriba, rebotan a izquierda o derecha al azar en cada clavo y se amontonan en casillas al fondo, bajo una curva en forma de campana. Debajo, otras cuatro tandas han formado la misma campana.',
    'Un dado cargado dibujado como seis barras, y tres montones a su lado: tiradas sueltas, promedios de 2 tiradas y promedios de más tiradas, cada uno con una curva en forma de campana encima.',
    'Un faro gira y alumbra una pared; el montón de dónde caen los giros sueltos y el montón de los promedios de varios giros tienen la misma forma.',
  ],

  presets: [
    { name: 'Bolas y clavos', note: 'La misma campana cada vez.', badge: '½' },
    { name: 'Inclina los clavos', note: 'La campana se desplaza.', badge: '¾' },
    { name: 'Un dado cargado', note: 'Sus promedios se vuelven una campana.', badge: '1·6' },
  ],

  rows: 'Filas de clavos',
  tilt: 'Probabilidad de rebotar a la derecha',
  tiltHint: 'Con el 50%, todos los clavos están equilibrados. Inclínalos y la campana se desplaza.',
  throws: 'Tiradas en cada promedio',
  dieHint: 'Arrastra las barras del dado en la imagen para cambiar su forma.',
  shapeLabel: 'Partir de',
  shapes: ['Sobre todo 1 y 6', 'Equilibrado', 'Sobre todo 6'],
  spins: 'Giros en cada promedio',
  spinHint: 'Promediar más giros no ayuda: el faro no tiene la dispersión finita que necesita la campana.',

  status: {
    pouring: (n) =>
      `${n.toLocaleString('fr')} ${n === 1 ? 'bola' : 'bolas'} · a izquierda o derecha al azar en cada clavo`,
    poured: (n) => `${n.toLocaleString('fr')} bolas · la misma campana cada vez`,
    throwing: (n) => `${n.toLocaleString('fr')} en cada montón`,
    spinning: (n) => `${n.toLocaleString('fr')} en cada montón`,
  },
  announce: {
    poured: (n) => `Han caído ${n.toLocaleString('fr')} bolas, con la forma de la campana.`,
    die: (face, weight) => `Cara ${face}: ${weight} de 10`,
  },

  labels: {
    bell: 'la campana',
    others: (pours, balls) => `${pours} tandas más de ${balls.toLocaleString('fr')} bolas: la misma campana`,
    yourDie: 'Tu dado · mueve las barras',
    oneThrow: 'Una tirada',
    average: (n) => `Promedios de ${n} tiradas`,
    oneSpin: 'Un giro',
    averageSpins: (n) => `Promedios de ${n} giros`,
    off: (n) => `${n.toLocaleString('fr')} fuera del gráfico`,
    lamp: 'faro',
    wall: 'pared',
  },

  guests: [
    {
      name: 'Abraham de Moivre',
      note: 'En 1733 demostré que el número de caras en miles de lanzamientos de una moneda sigue una curva suave en forma de campana.',
    },
    {
      name: 'Pierre-Simon Laplace',
      note: 'Demostré que la campana llega mucho más allá de las monedas: los promedios de muchos tipos de medidas al azar se agolpan en ella.',
    },
  ],

  insight: {
    title: '¿Por qué el azar forma una campana?',
    html: `<p>Cada bola hace el mismo tipo de elección en cada clavo: izquierda o derecha. Para caer en el extremo, tiene que ir hacia el mismo lado todas las veces, y solo un camino lo hace. Para caer en el centro, necesita tantas izquierdas como derechas, y cientos de caminos lo hacen. Contar los caminos que llevan a cada casilla da una fila del triángulo de Pascal (1, 12, 66, 220, 495, 792, 924, … para doce filas), y esas cuentas forman la campana. Ninguna bola sabe adónde va; la forma sale de contar.</p>
<div class="insight-visual">12 filas de clavos: 1 camino a cada extremo, 924 caminos al centro, de 4\u202f096</div>
<h3>Los promedios forman la misma campana</h3>
<p>Las tiradas sueltas del dado conservan su forma irregular. Promedia dos tiradas y aparece un pico en el centro, aunque todavía se nota la forma rara; promedia diez y el montón se parece más a una campana, y es más estrecho. Es el teorema central del límite: los promedios de muchas tiradas independientes, de casi cualquier dado, se agolpan en una campana alrededor de la media del dado, y la campana se estrecha como 1/√n. Los promedios de 10 tiradas se dispersan unas √10 veces menos que las tiradas sueltas, algo más de 3 veces menos.</p>
<h3>Cuándo falla</h3>
<p>El teorema necesita tiradas que no se influyan entre sí y cuya dispersión sea finita. El faro testarudo incumple la segunda regla: una lámpara que gira al azar a veces alumbra casi en paralelo a la pared, así que unos pocos giros caen enormemente lejos. Sus promedios son tan desbocados como un solo giro, por muchos giros que promedies. Ese faro sigue la distribución de Cauchy, que lleva el nombre de Augustin-Louis Cauchy.</p>
<h3>Lo que esta sala simplifica</h3>
<p>Las bolas siguen un modelo aleatorio, no la física: cada clavo es una moneda al aire, equilibrada o sesgada, independiente de los demás. Los tableros reales nunca están perfectamente equilibrados, y las bolas reales rebotan y giran, así que sus montones son más irregulares. Los promedios de 2 o 5 tiradas se acercan a una campana, pero no lo son exactamente.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Con n filas y una probabilidad p de rebotar a la derecha, una bola cae en la casilla k (k rebotes a la derecha) con probabilidad C(n, k)·pᵏ·(1 − p)ⁿ⁻ᵏ, la distribución binomial, con media np y dispersión √(np(1 − p)). Abraham de Moivre demostró en 1733, y en la segunda edición de su <em>Doctrine of Chances</em> (1738), que para muchos lanzamientos esto se parece mucho a la curva normal; Pierre-Simon Laplace publicó un resultado más general en su <em>Théorie analytique des probabilités</em> (1812). Francis Galton diseñó el tablero, al que llamó quincunx, para una conferencia en la Royal Institution en 1874, y lo describió en <em>Natural Inheritance</em> (1889). El promedio de n giros de Cauchy tiene exactamente la misma distribución que un solo giro.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Galton_board" target="_blank" rel="noopener">Tablero de Galton (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/De_Moivre%E2%80%93Laplace_theorem" target="_blank" rel="noopener">Teorema de De Moivre–Laplace (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Central_limit_theorem" target="_blank" rel="noopener">Teorema central del límite (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cauchy_distribution" target="_blank" rel="noopener">Distribución de Cauchy (Wikipedia, en inglés)</a></div>`,
  },
});
