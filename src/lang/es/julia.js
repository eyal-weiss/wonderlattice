Wonderlattice.defineText('julia', 'es', {
  eyebrow: 'FRACTALES',
  name: 'Una semilla para un paisaje infinito',
  tagline: 'Una regla, repetida, dibuja costas sin fin. Mueve la semilla y mira cómo cambian.',
  title: 'Una semilla para un paisaje infinito.',
  subtitle:
    'Una regla diminuta, repetida: eleva un número al cuadrado y súmale una semilla. Arrastra la semilla y un paisaje sin fin cambia de forma.',
  field: 'Números complejos · Repetición · Fractales',
  sceneLabel: 'Una regla · z → z² + c',
  tip: 'Arrastra la semilla en el mapa pequeño, o usa las flechas · Toca la imagen grande para seguir el viaje de un punto',
  actionLabel: 'Recorrer el borde',
  canvasLabel:
    'Un gran conjunto de Julia de la regla z → z² + c y un pequeño mapa de semillas, el conjunto de Mandelbrot, con la semilla elegida marcada.',
  panelEyebrow: 'Elige una semilla',
  whyLabel: '¿Cómo puede una sola regla dibujar todo esto?',
  nudge:
    'Arrastra la semilla fuera de la forma oscura del mapa pequeño. El paisaje se rompe en polvo. Vuelve a meterla y otra vez es una sola pieza.',
  connection: {
    html: '<strong>Los números complejos pueden mover un plano entero.</strong> Aquí una regla pequeña se repite una y otra vez; en la sala siguiente, una sola función dobla el plano de una vez.',
    label: 'Dobla el plano',
  },
  presets: [
    { name: 'Conejo', note: 'Tres orejas que giran y giran.' },
    { name: 'Dendrita', note: 'Ramas sin ningún hueco dentro.' },
    { name: 'San Marcos', note: 'Una basílica y su reflejo.' },
    { name: 'Disco de Siegel', note: 'Los puntos giran para siempre en torno a un centro oculto.' },
    { name: 'Polvo', note: 'Fuera del mapa: una nube de motas.' },
  ],
  yourOwn: 'Tu propio paisaje',
  labels: {
    julia: 'El paisaje de esta semilla',
    map: 'El mapa de semillas',
  },
  seed: (z) => `c = ${z}`,
  onePiece: 'Una sola pieza',
  dust: 'Polvo',
  status: (inside) => (inside ? 'Semilla dentro del mapa: una sola pieza' : 'Semilla fuera del mapa: polvo'),
  re: 'Semilla, en horizontal',
  im: 'Semilla, en vertical',
  reHint: 'La parte real de c.',
  imHint: 'La parte imaginaria de c.',
  journey: 'Mostrar el viaje de un punto',
  readout: {
    seed: 'La semilla',
    landscape: 'El paisaje',
    journey: 'El viaje de un punto',
  },
  landscape: (inside) =>
    inside
      ? 'Una sola pieza conectada: la semilla está dentro de la forma oscura del mapa.'
      : 'Polvo: la semilla está fuera de la forma oscura, así que el paisaje se deshace en motas.',
  orbitHint: 'Toca la imagen grande para seguir un punto.',
  escapes: (n) => `Sale volando después de ${n} ${n === 1 ? 'paso' : 'pasos'}.`,
  stays: (n) => `Se queda atrapado: sigue cerca del centro después de ${n} pasos.`,
  guests: [
    {
      name: 'Gaston Julia',
      note: 'En 1918, sin ningún ordenador, estudió qué le hace a cada punto del plano repetir una regla.',
    },
    {
      name: 'Benoît Mandelbrot',
      note: 'En 1980 sus imágenes por ordenador hicieron famoso el mapa de semillas. También acuñó la palabra «fractal».',
    },
  ],
  insight: {
    title: '¿Cómo puede una sola regla dibujar todo esto?',
    html: `<p>Elige una semilla c. Empieza en un punto z, elévalo al cuadrado y suma c, y luego haz lo mismo una y otra vez. Algunos puntos de partida se escapan al infinito; otros se quedan atrapados cerca del centro para siempre. La costa brillante de la imagen grande es la frontera entre ambos: el <em>conjunto de Julia</em> de c. Los colores muestran cuánto duda cada punto cerca de la costa antes de salir volando.</p>
<div class="insight-visual">z → z² + c → (z² + c)² + c → …</div>
<h3>El mapa de semillas</h3>
<p>Cada punto del mapa pequeño es una semilla. Es oscuro cuando el viaje que empieza en 0 se queda atrapado. Esa forma oscura es el <em>conjunto de Mandelbrot</em>, y funciona como un catálogo: para cada semilla de dentro, el paisaje es una sola pieza conectada, y para cada semilla de fuera, el paisaje se deshace en polvo.</p>
<h3>Detalle infinito, dibujado de forma aproximada</h3>
<p>Mira de cerca cualquier costa y encontrarás más costa: las orejas del conejo tienen orejas. Por eso estas imágenes solo pueden ser aproximaciones. Aquí cada punto se sigue como mucho 200 pasos (menos mientras la semilla se mueve), así que un punto que escaparía más tarde se dibuja como atrapado, y los hilos más finos pueden faltar o verse borrosos.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Escribe f(z) = z² + c. En cuanto |z| &gt; 2 y |z| ≥ |c|, es seguro que el viaje crecerá sin límite, así que el ordenador puede parar ahí. Los puntos que nunca escapan forman el conjunto de Julia relleno, y su borde es el conjunto de Julia. Los colores usan un recuento de escape suave, n + 1 − log₂(ln |z|), que elimina las franjas. Gaston Julia y Pierre Fatou demostraron en 1918–1919 que el conjunto de Julia es conexo justo cuando el viaje de 0 se mantiene acotado, y que si no, es polvo. Así, el conjunto de Mandelbrot, dibujado por primera vez por Robert Brooks y Peter Matelski en 1978 y hecho famoso por las imágenes de Benoît Mandelbrot en 1980, es el conjunto de semillas con un paisaje conexo. El libro <em>The Beauty of Fractals</em> (1986), de Heinz-Otto Peitgen y Peter Richter, llevó estas imágenes a un público amplio.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Julia_set" target="_blank" rel="noopener">Conjunto de Julia, Wikipedia (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mandelbrot_set" target="_blank" rel="noopener">Conjunto de Mandelbrot, Wikipedia (en inglés)</a><a class="source-link" href="https://doi.org/10.1007/978-3-642-61717-1" target="_blank" rel="noopener">Peitgen y Richter, The Beauty of Fractals (1986) (en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Julia/" target="_blank" rel="noopener">Gaston Julia, MacTutor (en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Mandelbrot/" target="_blank" rel="noopener">Benoît Mandelbrot, MacTutor (en inglés)</a></div>`,
  },
});
