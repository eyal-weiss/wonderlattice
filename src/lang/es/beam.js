/* La regla de canto · palabras para el visitante (es). */
Wonderlattice.defineText('beam', 'es', {
  eyebrow: 'VIGAS',
  name: 'La regla de canto',
  tagline:
    'Pon una plancha de acero de canto y será 36 veces más rígida. Pinta tu propia viga y descubre dónde debe ir el acero.',
  title: 'La regla de canto.',
  subtitle:
    'Una viga de acero con un peso en el centro, y su sección debajo. Ponla de canto, o pinta los 24 cuadrados de acero donde quieras, y mira cuánto se comba.',
  field: 'Segundo momento de área · Teoría de vigas de Euler–Bernoulli · Vigas en I',
  sceneLabel: 'Una viga de acero y su sección',
  sceneNames: {
    plank: 'Una plancha plana',
    edge: 'De canto',
    ibeam: 'Una viga en I',
    own: 'Tu propia viga',
    none: 'Aún sin acero',
  },
  tip: 'Toca o arrastra sobre los cuadrados para poner o quitar acero · Las flechas mueven, Enter pinta, Retroceso deshace',
  actionLabel: 'Girar 90°',
  canvasLabel:
    'Una viga de acero apoyada en dos soportes, con un peso de 100 kg colgado en el centro, sobre una cuadrícula de 12 por 12 con su sección. Toca o arrastra sobre la cuadrícula para poner o quitar cuadrados de acero, o usa las flechas y Enter.',
  panelEyebrow: 'Acero y forma',
  whyLabel: '¿Por qué es mejor de canto?',
  nudge:
    '¿Puedes superar a la plancha de canto con los mismos 24 cuadrados? Luego corta el alma delgada que une la parte de arriba de tu mejor viga con la de abajo: ¿cuán rígidas son las dos mitades sueltas?',
  connection: {
    html: '<strong>Acero donde cuenta.</strong> Una celosía es una viga a la que se le ha quitado casi todo el centro: las barras de arriba están comprimidas, las de abajo estiradas, y los triángulos las mantienen unidas. Míralo en «El triángulo testarudo».',
    label: 'Visita «El triángulo testarudo»',
  },

  presets: [
    { name: 'Una plancha plana', note: '12 cm de ancho y 2 cm de grosor, tumbada.' },
    { name: 'De canto', note: 'La misma plancha, girada 90°.' },
    { name: 'Una viga en I', note: 'Acero arriba y abajo, con un alma delgada en medio.' },
  ],

  undo: 'Deshacer',
  clear: 'Borrar',

  // Dibujado en la imagen: textos cortos.
  picture: {
    caption: '3 m de acero, con 100 kg en el centro',
    drawn: (n) => `La comba se dibuja ${n} veces mayor`,
    drawnShort: (n) => `Comba ampliada ${n}×`,
    weight: '100 kg',
    sag: (mm) => `Comba ${mm} mm`,
    beyond: 'Comba > 10 cm',
    none: 'Sin acero',
    section: 'Sección',
    unit: '1 cuadrado = 1 cm',
    squares: (used, total) => `${used} de ${total} cuadrados`,
    stiffness: 'Rigidez',
    times: (x) => `${x}× la plancha plana`,
    timesShort: (x) => `${x}×`,
    chart: 'Mismo acero, otras formas: ¿cuán rígidas?',
    rows: { plank: 'Plancha plana', edge: 'De canto', ibeam: 'Viga en I', yours: 'La tuya' },
    marks: { plank: 'Plancha plana', edge: 'De canto', best: 'Máximo con 24' },
    key: { squeezed: 'Comprimido', stretched: 'Estirado', axis: 'Ninguno' },
    loose: (k) => `${k} piezas sueltas: cada una se dobla por su cuenta`,
    wobbly: 'Inestable: podría volcar de lado',
    full: 'No queda acero: toca un cuadrado para quitarlo',
    best: 'Tan rígida como pueden ser 24 cuadrados',
  },

  // La lectura del panel y la línea de estado.
  status: {
    sag: (mm) => `Comba ${mm} mm`,
    said: (mm, x) => `Comba ${mm} mm, ${x} veces la rigidez de la plancha plana`,
    beyond: 'Comba de más de 10 cm',
    none: 'Sin acero',
  },
  readout: {
    sag: (mm) => `Comba ${mm} mm`,
    times: (x) => `${x}× la plancha plana`,
    plank: 'La plancha plana',
    used: (used, total) =>
      used === total
        ? `Se usan los ${total} cuadrados de acero.`
        : `Se usan ${used} de los ${total} cuadrados de acero.`,
    none: 'Pinta algunos cuadrados de acero en la cuadrícula.',
    beyond: 'Más allá de 10 cm, la teoría sencilla que se usa aquí deja de ser fiable.',
    loose: (k) =>
      `${k} piezas sueltas: los cuadrados que no comparten un lado se deslizan unos sobre otros, así que cada pieza se dobla por su cuenta.`,
    wobbly: 'Alta y delgada: bajo el peso podría volcar, o torcerse de lado (una regla práctica, mira la explicación).',
    best: 'Tan rígida como pueden ser 24 cuadrados en esta cuadrícula.',
  },

  guests: [
    {
      name: 'Galileo Galilei',
      note: 'En 1638 escribí que una regla puesta de canto resiste la rotura más que una tumbada, tantas veces más como su anchura supera a su grosor. También vi que los huesos de las aves y las cañas son huecos: ligeros, pero difíciles de doblar.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Jacob Bernoulli supuso que una viga doblada se curva en proporción a la fuerza de giro que actúa sobre ella. En 1744 seguí esa idea con el cálculo y obtuve las curvas de las láminas elásticas dobladas.',
    },
    {
      name: 'Claude-Louis Navier',
      note: 'En 1819 encontré dónde está de verdad la línea de una viga doblada que ni se comprime ni se estira, y corregí a Galileo. En 1826 separé lo que el material de una viga aporta a su rigidez de lo que aporta su forma.',
    },
  ],

  insight: {
    title: '¿Por qué es mejor de canto?',
    html: `<p>Dobla una viga y su parte de arriba se comprime mientras la de abajo se estira. Entre ellas corre una línea que no hace ni lo uno ni lo otro, el eje neutro, que pasa por el centro de la sección (su centroide). El acero lejos de esa línea se comprime o se estira mucho con una flexión pequeña, así que empuja con fuerza, y además empuja con más palanca. Los dos efectos crecen con la distancia, así que cada cuadrado cuenta con el <em>cuadrado</em> de su distancia a la línea. Sumarlos da el segundo momento de área, I, en cm⁴.</p>
<div class="insight-visual">I = Σ (1/12 + d²) sobre los cuadrados · comba = F·L³ ⁄ (48·E·I)</div>
<h3>Tumbada o de canto</h3>
<p>Para un rectángulo de ancho b y alto h, I = b·h³ ⁄ 12, así que su altura cuenta tres veces. La plancha de 12 cm de ancho y 2 cm de grosor tiene I = 8 cm⁴ tumbada y 288 cm⁴ de canto: (12 ÷ 2)² = 36 veces más rígida, con el mismo acero. Con 100 kg en el centro de 3 m de acero (E = 200 GPa), se comba 34 mm tumbada y menos de 1 mm de canto. Una regla de plástico de 30 mm de ancho y 1 mm de grosor es (30 ÷ 1)² = 900 veces más rígida de canto.</p>
<h3>La viga en I</h3>
<p>El mejor sitio para el acero es lo más lejos posible del centro: un ala a lo largo de la parte de arriba y otra a lo largo de la de abajo. Pero tienen que estar unidas, o se deslizan una sobre otra como las páginas de un libro, y cada una se dobla por su cuenta: dos tiras sueltas de 12 cuadrados tienen entre las dos I = 2 cm⁴. Un alma delgada las mantiene unidas. Con 7 cuadrados en cada ala y 10 en el alma, I = 508 cm⁴, 63,5 veces la plancha plana, y lo máximo que pueden dar 24 cuadrados unidos en esta cuadrícula. Los huesos, el bambú, los cuadros de bicicleta y los tubos de andamio son huecos por la misma razón. En 1638, Galileo señaló los huesos de las aves y las cañas, y mostró que una regla de canto es más difícil de romper, en la proporción entre su anchura y su grosor.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Una viga alta y delgada gana sobre el papel, pero puede volcar, o torcerse y pandearse de lado bajo su carga (pandeo lateral-torsional), y un alma o un ala delgadas pueden arrugarse. El aviso de inestabilidad es una regla práctica propia de esta sala: una forma más de 20 veces más rígida de arriba abajo que de lado. Los ingenieros comprueban el caso real, que también depende de la distancia entre apoyos, de la carga y de lo bien que la viga resiste la torsión, y arriostran las vigas altas y delgadas, como las viguetas de un suelo. La rigidez (cuánto se comba una viga) no es la resistencia (cuándo se rompe, o se dobla para siempre): esta sala trata de la rigidez. La comba sale de la teoría para combas pequeñas. Deja fuera el peso propio de la viga (aquí, unos 57 kg de acero, que añadirían cerca de un tercio a cada comba) y la pequeña flexibilidad extra del cortante, y supone que la viga se mantiene recta de lado, así que una forma asimétrica no se desvía hacia un lado. Los cuadrados unidos lado con lado cuentan como soldados; los que solo se tocan por una esquina, no.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Un cuadrado de lado 1 cuyo centro está a una distancia d del eje neutro añade ∫ y² dA = 1/12 + d² a I (el teorema de los ejes paralelos), así que I es una suma sobre los cuadrados pintados. El eje neutro de cada pieza pasa por su centroide: la altura media de sus cuadrados. Las piezas sueltas se tratan como vigas que se doblan una al lado de otra con la misma comba, así que sus I se suman. La forma de la viga doblada es v(x) = F·x·(3L² − 4x²) ⁄ (48·E·I) hasta el centro, donde la comba es F·L³ ⁄ (48·E·I). El máximo que pueden alcanzar 24 cuadrados unidos se encontró con una búsqueda exacta sobre cuántos cuadrados hay en cada fila: cada fila entre la de arriba y la de abajo necesita al menos uno, y el mejor sitio para el resto son las filas de arriba y de abajo, a partes iguales. Los números se comprobaron frente a un programa independiente.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Second_moment_of_area" target="_blank" rel="noopener">Segundo momento de área (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euler%E2%80%93Bernoulli_beam_theory" target="_blank" rel="noopener">Teoría de vigas de Euler–Bernoulli (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/I-beam" target="_blank" rel="noopener">Viga en I (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Claude-Louis_Navier" target="_blank" rel="noopener">Claude-Louis Navier (Wikipedia, en inglés)</a><a class="source-link" href="https://archive.org/details/dialoguesconcern00galiuoft" target="_blank" rel="noopener">Galileo (1638), Dialogues Concerning Two New Sciences, jornada segunda (trad. Crew y de Salvio, 1914, en inglés)</a></div>`,
  },
});
