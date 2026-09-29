Wonderlattice.defineText('plane', 'es', {
  eyebrow: 'NÚMEROS COMPLEJOS',
  name: 'Deforma el plano',
  tagline: 'Deforma una imagen sin romperla; un círculo se convierte en un ala.',
  title: 'Deforma el plano.',
  subtitle:
    'Elige una forma de doblar todo el plano y mira cómo se deforma una imagen. Fíjate bien: las esquinas diminutas conservan sus ángulos rectos.',
  field: 'Números complejos · Transformaciones conformes · Alas',
  sceneLabel: 'El plano, deformado',
  tip: 'Arrastra la brújula de la izquierda, o muévela con las flechas · Su gemela de la derecha muestra el estiramiento y el giro',
  tipStacked:
    'Arrastra la brújula de la imagen de arriba, o usa las flechas · Su gemela de abajo muestra el estiramiento y el giro',
  actionLabel: 'Deformarlo',
  canvasLabel:
    'Dos copias del plano. En la primera, una imagen y una pequeña brújula de dos flechas perpendiculares; en la segunda, sus imágenes bajo la función compleja elegida. Arrastra la brújula o muévela con las flechas.',
  panelEyebrow: 'Elige una deformación',
  whyLabel: '¿Por qué sobreviven los ángulos rectos?',
  nudge: 'Eleva el plano al cuadrado y arrastra la brújula justo al centro. ¿Qué le pasa ahí a su gemela?',
  connection: {
    html: '<strong>Deformar sin romper.</strong> Aquí una función deforma todo el plano y conserva sus ángulos diminutos. En «¿Dónde está el otro lado?», una tira se dobla hasta formar una superficie con un solo lado.',
    label: 'Visita «¿Dónde está el otro lado?»',
  },
  functions: ['Al cuadrado · z²', 'Del revés · 1/z', 'Enrollar · eᶻ', 'Onda · sin z', 'Ala · z + 1/z'],
  formulas: ['w = z²', 'w = 1/z', 'w = eᶻ', 'w = sin z', 'w = z + 1/z'],
  pictures: ['Una cuadrícula', 'Un pez', 'Una cara', 'Círculos y rayos', 'El círculo del ala'],
  functionLabel: 'Función',
  pictureLabel: 'Imagen',
  bendLabel: 'Cuánto se deforma',
  thickLabel: 'Grosor',
  camberLabel: 'Curvatura',
  gridLabel: 'Mostrar una cuadrícula tenue detrás',
  flowLabel: 'Mostrar el aire que pasa',
  at: 'La brújula en',
  stretch: 'Cuánto se estira aquí',
  stretchMath: '(|f′(z)|)',
  turn: 'Cuánto gira',
  turnMath: '(arg f′(z))',
  point: (x, y) => `${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i`.replace(/^-/, '−'),
  times: (x) => `${x}×`,
  degrees: (d) => `${d < 0 ? '−' : ''}${Math.abs(d)}°`,
  none: '–',
  status: (stretch, turn) => `×${stretch} · giro ${turn}`,
  statusCritical: 'Aquí f′ = 0',
  statusPole: 'Un polo: f = ∞',
  announceCritical: 'Aquí f′ = 0: los ángulos se duplican',
  announcePole: 'Un polo: aquí la función es infinita',
  keeps: 'Las flechas de su gemela siguen formando un ángulo recto.',
  critical: 'Aquí f′ = 0. Las flechas de la gemela se encogen hasta desaparecer, y los ángulos se duplican.',
  pole: 'Aquí f es infinita: un polo. La gemela salió volando del mapa.',
  away: 'Su gemela está fuera del borde de la imagen deformada.',
  blending: 'Deformado a medias: una mezcla de z y f(z), para ayudar a la vista.',
  zLabel: 'z',
  wLabel: 'w',
  bent: (formula, percent) => `${formula} · ${percent}% deformado`,
  criticalMark: 'f′ = 0',
  poleMark: 'polo',
  presets: [
    {
      name: 'Elevar el plano al cuadrado',
      note: 'En el centro, los ángulos se duplican.',
    },
    {
      name: 'Darle la vuelta',
      note: 'Las rectas se vuelven círculos.',
    },
    {
      name: 'Enrollarlo',
      note: 'Las rectas se vuelven anillos y rayos.',
    },
    {
      name: 'Un pez al cuadrado',
      note: 'Deformado por todas partes, y sigue siendo un pez.',
    },
    {
      name: 'Hacer un ala',
      note: 'Un círculo, deformado hasta ser un ala.',
    },
  ],
  guests: [
    {
      name: 'Bernhard Riemann',
      note: 'Su tesis de 1851, dirigida por Gauss, estudió las funciones complejas a través de la geometría: transformaciones que conservan los ángulos, y superficies.',
    },
  ],
  insight: {
    title: 'Una deformación que conserva sus ángulos.',
    html: `<p>Un número complejo x + iy es un punto del plano: x a lo ancho, y hacia arriba. Una función compleja f lleva cada punto z a un punto nuevo w = f(z), así que mueve todo el plano a la vez. La primera imagen es el plano antes; la segunda muestra adónde va a parar cada uno de sus puntos.</p>
<div class="insight-visual">multiplicar por un número de tamaño r y ángulo θ estira por r y gira θ</div>
<h3>Multiplicar gira y estira</h3>
<p>Multiplicar por i gira el plano un cuarto de vuelta. Multiplicar por 2 duplica su tamaño. Cada número complejo hace las dos cosas a la vez: estira según su tamaño y gira según su ángulo. Un estiramiento con un giro conserva todos los ángulos, aunque cambien los tamaños.</p>
<h3>De cerca, una deformación es una multiplicación</h3>
<p>Acércate mucho a un punto z y una función compleja derivable parece una multiplicación por un solo número, su derivada f′(z): f(z + h) ≈ f(z) + f′(z)·h para un h diminuto. Así que cada flecha diminuta en z se estira |f′(z)| veces y gira el ángulo de f′(z), igual en todas las direcciones, siempre que f′(z) no sea cero. Las dos flechas de la brújula giran juntas y siguen formando un ángulo recto. Una transformación que conserva los ángulos así se llama <em>conforme</em>. Las líneas de la cuadrícula también se cruzan en ángulo recto después de deformarse, aunque los cuadrados se vuelvan curvos.</p>
<h3>Donde f′ = 0, los ángulos se rompen</h3>
<p>Si f′(z) = 0 no hay nada por lo que multiplicar, y manda el término siguiente. Cerca de 0, z² lleva h a h², lo que duplica todos los ángulos: el ángulo recto entre 1 e i se abre hasta ser una línea recta. Por eso la gemela de la brújula se encoge hasta desaparecer en el centro de «Elevar el plano al cuadrado», y por eso las líneas de la cuadrícula que pasan por 0 se doblan ahí.</p>
<h3>Del revés</h3>
<p>1/z intercambia lo cercano y lo lejano: los puntos cerca de 0 salen volando lejos, y los lejanos se acercan. Los círculos que pasan por 0 se vuelven rectas, y las rectas que no pasan por 0 se vuelven círculos que pasan por 0. Por eso la cuadrícula se convierte en dos familias de círculos, todos pasando por 0 y cruzándose todavía en ángulo recto. (Los dos ejes, que pasan ellos mismos por 0, siguen siendo rectas.)</p>
<h3>De un círculo a un ala</h3>
<p>La transformación de Joukowski, z + 1/z, aplana el círculo unidad hasta el segmento que va de −2 a 2. Desplaza un poco el círculo, haciéndolo pasar todavía por z = 1, y su imagen se convierte en un ala: redondeada por delante y afilada por detrás. El borde afilado está exactamente donde f′ = 0, en z = 1, donde los ángulos se duplican y el círculo suave se pliega en una punta. La transformación lleva el flujo de aire alrededor del círculo a un flujo alrededor del ala. Ese flujo es idealizado (estable, sin rozamiento, plano), con el remolino justo para que el aire salga suavemente por el borde afilado. Las alas reales también dependen de la viscosidad, la turbulencia y su forma en tres dimensiones, que esta imagen deja fuera.</p>
<h3>Sobre el control «Cuánto se deforma»</h3>
<p>A medio camino, la imagen muestra (1 − t)·z + t·f(z), una mezcla en línea recta entre quedarse quieto y la transformación completa. Está ahí para ayudar a la vista a seguir cada punto. Cada mezcla también es una función compleja, pero tiene sus propios puntos conflictivos, y no es un camino que el plano recorra de verdad. Solo la imagen totalmente deformada muestra f.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>f′(z) es el límite de (f(z + h) − f(z)) / h cuando h se acerca a 0. Para una función compleja, el límite tiene que ser el mismo desde todas las direcciones, y eso es justo lo que obliga a que el estiramiento y el giro sean iguales en todas las direcciones: una función analítica con f′(z) ≠ 0 es conforme en z. En un punto donde f′ se anula en primer orden, los ángulos se multiplican por 2. El flujo del ala usa el potencial complejo F = ζ + r²/ζ + ik·log ζ alrededor de un círculo de radio r (con ζ medido desde su centro), con k elegido para que z = 1 sea un punto de estancamiento: la condición de Kutta.</p></details>
<div class="sources"><a class="source-link" href="https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/" target="_blank" rel="noopener">Apuntes del MIT 18.04, tema 10: transformaciones conformes (en inglés)</a><a class="source-link" href="https://webapps.math.uci.edu/~vmm/ConformalMaps/" target="_blank" rel="noopener">Transformaciones conformes para explorar (UC Irvine, 3D-XplorMath, en inglés)</a><a class="source-link" href="https://www.grc.nasa.gov/www/k-12/airplane/map.html" target="_blank" rel="noopener">La transformación de Joukowski, del cilindro al perfil alar (NASA Glenn, en inglés)</a><a class="source-link" href="https://books.google.com/books/about/Visual_Complex_Analysis.html?id=ogz5FjmiqlQC" target="_blank" rel="noopener">Tristan Needham, Visual Complex Analysis (en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/" target="_blank" rel="noopener">Bernhard Riemann (MacTutor, en inglés)</a></div>`,
  },
});
