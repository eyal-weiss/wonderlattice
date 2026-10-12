/* Saltos al azar, triángulo perfecto · palabras para el visitante (es). */
Wonderlattice.defineText('chaos', 'es', {
  eyebrow: 'EL JUEGO DEL CAOS',
  name: 'Saltos al azar, triángulo perfecto',
  tagline:
    'Salta hasta la mitad del camino hacia una esquina elegida al azar, una y otra vez, y del ruido surge un fractal impecable.',
  title: 'Saltos al azar, triángulo perfecto.',
  subtitle:
    'Un punto salta hasta la mitad del camino hacia una esquina elegida al azar, una y otra vez. Toca para que empiece en otro sitio, o arrastra una esquina.',
  field: 'Azar · Fractales · Funciones iteradas',
  sceneLabel: 'El juego del caos',
  tip: 'Toca para que el punto empiece ahí · Arrastra una esquina para cambiar el juego · Enter hace un salto',
  actionLabel: 'Un salto',
  canvasLabel:
    'Las esquinas de una forma, y los puntos que deja un punto que salta parte del camino hacia una esquina elegida al azar, una y otra vez.',
  panelEyebrow: 'Cambia el juego',
  whyLabel: '¿Por qué el azar dibuja una forma perfecta?',
  nudge:
    'Prueba con cuatro esquinas: pura niebla. Luego marca «Nunca la misma esquina dos veces seguidas» y mira cómo sale un fractal de la niebla.',
  connection: {
    html: '<strong>Dos clases de caos.</strong> Aquí, «caos» es solo el nombre del juego: empieza donde quieras y aparece la misma forma. En «Gemelos del tiempo», la diferencia más pequeña crece hasta convertirse en otro futuro.',
    label: 'Gemelos del tiempo',
  },

  presets: [
    { name: 'Tres esquinas', note: 'Agujeros dentro de agujeros, y ni un solo punto cae en ellos.' },
    { name: 'Cuatro esquinas', note: 'Pura niebla: los puntos van a todas partes.' },
    { name: 'Cuatro, y una regla', note: 'Nunca la misma esquina dos veces: un fractal en la niebla.' },
    { name: 'Cinco esquinas', note: 'Salta el 61,8% del camino: cinco copias que apenas se tocan.' },
    { name: 'Helecho de Barnsley', note: 'Cuatro reglas, cada una con su propia probabilidad.' },
  ],
  yourOwn: 'Tu propio juego',

  corners: 'Esquinas',
  jump: 'Cuánto avanza cada salto',
  jumpHint: 'La fracción del camino hasta la esquina.',
  rule: 'Nunca la misma esquina dos veces seguidas',
  fern: 'Dibujar el helecho de Barnsley en su lugar',

  // Dibujado en la imagen.
  jumps: (n, count) => `${n} ${count === 1 ? 'salto' : 'saltos'}`,
  caption: (percent, rule) =>
    rule
      ? `Cada salto: ${percent}% del camino a una esquina al azar, nunca la misma dos veces`
      : `Cada salto: ${percent}% del camino a una esquina al azar`,
  fernCaption: 'Cada salto: una de cuatro reglas, elegida al azar',

  // Sobre la imagen, y leído en voz alta cuando la imagen se asienta.
  holeStatus: (n, none) => (none ? 'Puntos en el agujero central: ni uno' : `Puntos en el agujero central: ${n}`),
  jumpStatus: (n) => `Saltos hasta ahora: ${n}`,
  settled: (n) => `La imagen se ha asentado tras ${n} saltos.`,

  guests: [
    {
      name: 'Wacław Sierpiński',
      note: 'En 1915 describió este triángulo con agujeros dentro de agujeros. Entonces era una curiosidad; hoy un dado lo dibuja en segundos.',
    },
    {
      name: 'Michael Barnsley',
      note: 'Le puso nombre al juego del caos en la década de 1980, y mostró que un puñado de reglas como estas puede hacer crecer un helecho.',
    },
  ],

  insight: {
    title: '¿Por qué el azar dibuja una forma perfecta?',
    html: `<p>Cada salto sigue una de tres reglas: reduce a la mitad tu distancia a la esquina A, a la B o a la C. Cada regla encoge el triángulo entero hasta una copia de la mitad de tamaño en su esquina. Las tres copias cubren el triángulo salvo un agujero en el centro, y cada copia contiene tres copias más pequeñas con un agujero en su centro, y así para siempre. Es el <em>triángulo de Sierpiński</em>, la única forma hecha exactamente de tres copias de sí misma a la mitad de tamaño. Cada punto toma el color de la esquina hacia la que saltó por última vez, para que puedas ver las copias.</p>
<p>Un punto que está en la forma siempre salta a otro punto de la forma, dentro de la copia de la esquina elegida, así que nunca puede caer en un agujero. Un punto que empieza en cualquier otro sitio reduce a la mitad su distancia a la forma en cada salto, y tras veinte saltos está a menos de un píxel. Por eso no se conservan los veinte primeros saltos. El dado solo decide el orden en que el punto visita la forma. La forma en sí la fijan las reglas.</p>
<h3>Niebla, y una regla que la despeja</h3>
<p>Cuatro cuadrados de la mitad de tamaño llenan un cuadrado exactamente, sin que sobre nada, así que con cuatro esquinas el punto va a todas partes: niebla. Ahora prohíbe la misma esquina dos veces seguidas. Para caer en el cuadrado de un cuarto de tamaño de una esquina, los dos últimos saltos tienen que haber ido los dos hacia esa esquina, así que esos cuadrados se quedan vacíos, y también las esquinas de cada copia más pequeña: agujeros a todas las escalas. Con la regla, cada salto depende del anterior, así que ya no es el juego simple, pero el mismo razonamiento sigue dibujando su forma.</p>
<h3>No es el caos de la meteorología</h3>
<p>«El juego del caos» es el nombre que le dio Michael Barnsley, y aquí nada es caótico en el sentido científico: empieza el punto en cualquier sitio, con otros números aleatorios, y aparece la misma imagen. Los números aleatorios salen del generador del ordenador, que sigue una receta fija; no son realmente aleatorios, pero lo son lo bastante para esto. La imagen está hecha de un número finito de puntos sobre una cuadrícula de píxeles, así que solo puede aproximar una forma con detalle a todas las escalas.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Cada regla es una <em>contracción</em>: acerca entre sí dos puntos cualesquiera. John Hutchinson demostró en 1981 que todo conjunto finito de contracciones tiene exactamente un conjunto no vacío, cerrado y acotado que es la unión de sus propias imágenes: el <em>atractor</em> de este <em>sistema de funciones iteradas</em>. Michael Barnsley y Stephen Demko mostraron en 1985 que elegir las reglas al azar lo dibuja: con probabilidad 1, el punto se acerca a todas sus partes. Para una forma regular de n esquinas, las copias apenas se tocan cuando el punto conserva (3 − √5)/2 ≈ 38,2% de su distancia con cinco esquinas, y un tercio con seis. La dimensión del triángulo de Sierpiński es log 3 / log 2 ≈ 1,585: a la mitad de tamaño necesitas tres veces más piezas, no cuatro. El cuadrado con la regla tiene la misma dimensión, por la misma razón. El helecho son cuatro reglas afines, elegidas el 1%, el 85%, el 7% y el 7% de las veces: una dibuja el tallo, otra el resto del helecho un tamaño más pequeño, y dos los foliolos más bajos de cada lado, cada uno una pequeña copia del helecho entero.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Chaos_game" target="_blank" rel="noopener">Juego del caos (Wikipedia, en inglés)</a><a class="source-link" href="https://mathworld.wolfram.com/ChaosGame.html" target="_blank" rel="noopener">Juego del caos (MathWorld, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle" target="_blank" rel="noopener">Triángulo de Sierpiński (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barnsley_fern" target="_blank" rel="noopener">Helecho de Barnsley (Wikipedia, en inglés)</a><a class="source-link" href="https://doi.org/10.1512/iumj.1981.30.30055" target="_blank" rel="noopener">Hutchinson, Fractals and self similarity (1981, en inglés)</a><a class="source-link" href="https://doi.org/10.1098/rspa.1985.0057" target="_blank" rel="noopener">Barnsley y Demko, Iterated function systems (1985, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Sierpinski/" target="_blank" rel="noopener">Wacław Sierpiński (MacTutor, en inglés)</a></div>`,
  },
});
