/* Círculos sin fin · palabras para el visitante (es). */
Wonderlattice.defineText('gasket', 'es', {
  eyebrow: 'CÍRCULOS QUE SE BESAN',
  name: 'Círculos sin fin',
  tagline: 'Llena cada hueco con el mayor círculo que quepa, para siempre, y cada círculo recibe un número entero.',
  title: 'Círculos sin fin.',
  subtitle:
    'Cada hueco recibe el mayor círculo que quepa, para siempre. El número de un círculo es su curvatura, 1 ÷ su radio: siempre entero. Toca cualquier círculo.',
  field: 'Geometría · Números enteros · Fractales',
  sceneLabel: 'Curvatura = 1 ÷ radio',
  tip: 'Toca un círculo para ver su regla · Arrastra un círculo inicial para cambiar su tamaño · Pellizca, usa la rueda, o + y −, para hacer zoom · Enter elige un círculo',
  actionLabel: 'Sumérgete',
  canvasLabel:
    'Un círculo grande lleno de círculos cada vez más pequeños que se tocan entre sí, cada uno con su curvatura escrita dentro.',
  panelEyebrow: 'Elige los círculos iniciales',
  whyLabel: '¿Por qué son todos números enteros?',
  nudge:
    'Agranda un poco un círculo inicial, arrastrándolo o con su deslizador: los números enteros se vuelven decimales. Luego toca «Mitades» para recuperarlos.',
  connection: {
    html: '<strong>Otra imagen que nunca toca fondo.</strong> Aquí una regla llena huecos con círculos para siempre; en la sala siguiente, una regla, repetida, dibuja costas que nunca terminan.',
    label: 'Un paisaje infinito',
  },

  presets: [
    { name: 'Mitades', note: '−1, 2, 2, 3: dos círculos, cada uno la mitad de ancho que el grande.' },
    { name: 'Tercios', note: '−2, 3, 6, 7: dos tercios y un tercio del ancho.' },
    { name: 'Cuartos', note: '−3, 4, 12, 13: tres cuartos y un cuarto.' },
    { name: 'Retocado', note: 'Un círculo algo mayor: no queda ni un número entero.' },
  ],
  yourOwn: 'Tus propios círculos',

  left: 'Curvatura del círculo izquierdo',
  right: 'Curvatura del círculo derecho',
  bendHint: 'Cuanto mayor la curvatura, menor el círculo.',

  readout: {
    tapped: 'El círculo que tocaste',
    rule: 'De dónde sale su número',
    all: 'Todas las curvaturas dibujadas',
  },
  tapHint: 'Toca cualquier círculo, por pequeño que sea.',
  bend: (b) => `Curvatura ${b}`,
  outer: (b) =>
    `Curvatura ${b}: el círculo grande se curva en sentido contrario, rodeando al resto, así que su curvatura cuenta como negativa.`,
  ruleWords:
    'El doble de las curvaturas de los tres que toca (en azul), menos la curvatura del círculo de enfrente (a trazos).',
  whole: (n, low, high) => `Números enteros, de ${low} a ${high}, en ${n} círculos`,
  notWhole: (n) => `No son números enteros: ${n} círculos`,

  // Sobre la imagen.
  status: (whole) => (whole ? 'Curvaturas: todas enteras' : 'Curvaturas con decimales'),
  zoom: (x) => `×${x}`,
  bigCircle: 'Círculo grande',

  // Leído en voz alta una vez, al tocar un círculo o al terminar una inmersión.
  told: (b, rule) => `Curvatura ${b}. ${rule}`,
  dived: (x, high) => `Imagen ampliada ${x} veces. La mayor curvatura dibujada es ${high}.`,

  guests: [
    {
      name: 'René Descartes',
      note: 'En 1643 escribió a la princesa Isabel sobre círculos que se tocan, y dio la regla de sus curvaturas sin decir cómo la había encontrado.',
    },
    {
      name: 'Isabel del Palatinado',
      note: 'Trabajó en el problema de círculos que Descartes le envió en 1643. Sus respuestas parciales lo llevaron al caso de cuatro círculos que se tocan.',
    },
    {
      name: 'Frederick Soddy',
      note: 'Químico y premio Nobel, volvió a encontrar la regla en 1936 y la publicó en la revista Nature como un poema, «The Kiss Precise».',
    },
  ],

  insight: {
    title: '¿Por qué son todos números enteros?',
    html: `<p>Llama <em>curvatura</em> de un círculo a 1 dividido entre su radio: un círculo pequeño se curva mucho, uno grande apenas. El gran círculo exterior recibe una curvatura negativa, porque se curva en sentido contrario, rodeando a los círculos de dentro. Entonces, cuatro círculos que se tocan todos entre sí obedecen una sola regla, el teorema de los círculos de Descartes:</p>
<div class="insight-visual">(b₁ + b₂ + b₃ + b₄)² = 2 × (b₁² + b₂² + b₃² + b₄²)</div>
<p>Para los cuatro primeros círculos de «Mitades», −1, 2, 2 y 3: 6² = 36, y 2 × (1 + 4 + 4 + 9) = 36.</p>
<h3>Entran enteros, salen enteros</h3>
<p>Toma tres círculos que se tocan entre sí. Exactamente dos círculos tocan a los tres, uno a cada lado, y la regla es una ecuación de segundo grado para sus curvaturas. Las dos soluciones de una ecuación de segundo grado suman un número que se lee en sus coeficientes: aquí, el doble de la suma de las tres curvaturas. Así que, en cuanto se conoce uno de los dos círculos, el otro tiene curvatura 2 × (b₁ + b₂ + b₃) − b₄. Eso es solo duplicar, sumar y restar. Cada círculo nuevo llena un hueco junto a círculos que ya están, así que, cuando las cuatro primeras curvaturas son números enteros, todas las curvaturas de la imagen son también números enteros, por pequeño que sea el círculo. Al tocar cualquier círculo lo ves: los tres círculos azules que toca y, a trazos, el de enfrente.</p>
<p>Solo funciona a partir de números enteros. Retoca un círculo inicial y las curvaturas se vuelven decimales; solo algunos círculos iniciales especiales, como los de los ejemplos propuestos, dan números enteros en todas partes. Los centros siguen la misma regla, escritos como números complejos y multiplicados por sus curvaturas, y así se dibuja la imagen.</p>
<h3>Dibujado de forma aproximada</h3>
<p>El verdadero tamiz de Apolonio nunca termina: cada hueco contiene infinitos círculos. La imagen se detiene en círculos de un píxel de ancho, más o menos, y al ampliarla se dibujan los siguientes. Su dimensión fractal es de alrededor de 1,3057, entre la de una curva (1) y la de una región rellena (2).</p>
<details><summary>¿Qué números enteros? Aún se está descubriendo</summary><p>No todos los números enteros pueden aparecer. En «Mitades», toda curvatura deja un resto de 2, 3, 6, 11, 14, 15, 18 o 23 al dividirla entre 24. En un artículo publicado en 2003, Ronald Graham, Jeffrey Lagarias, Colin Mallows, Allan Wilks y Catherine Yan conjeturaron que, en un tamiz como este, todo número lo bastante grande con un resto permitido acaba apareciendo: la conjetura local–global. En 2023, Summer Haag, estudiante de posgrado, y Clyde Kertzer, estudiante de licenciatura, trabajando con Katherine Stange y James Rickards en la Universidad de Colorado en Boulder, demostraron que es falsa: en muchos tamices, familias completas de números permitidos no aparecen nunca. El tamiz que empieza con −3, 5, 8 y 8, por ejemplo, no tiene ninguna curvatura que sea un cuadrado perfecto, aunque sus restos permiten cuadrados como 36 y 144. Su artículo se publicó en <em>Annals of Mathematics</em> en 2024. Que toda curvatura sea un número entero nunca estuvo en duda; qué números enteros aparecen se sigue estudiando.</p></details>
<details><summary>Quién encontró la regla</summary><p>René Descartes la describió en 1643, en cartas a la princesa Isabel del Palatinado, sin decir cómo la había encontrado. Jakob Steiner volvió a encontrarla en 1826, Philip Beecroft en 1842 y el químico Frederick Soddy en 1936, que la publicó en <em>Nature</em> como un poema, <em>The Kiss Precise</em>. El tamiz lleva el nombre de Apolonio de Perge, que en el siglo III a. C. escribió un libro, hoy perdido, sobre los círculos que tocan a tres círculos dados. La descripción más antigua que se conoce del propio tamiz es de Gottfried Leibniz, en 1706.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Descartes%27_theorem" target="_blank" rel="noopener">Teorema de Descartes (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Apollonian_gasket" target="_blank" rel="noopener">Tamiz de Apolonio (Wikipedia, en inglés)</a><a class="source-link" href="https://arxiv.org/abs/math/0101066" target="_blank" rel="noopener">Lagarias, Mallows y Wilks, Beyond the Descartes circle theorem (2002, en inglés)</a><a class="source-link" href="https://arxiv.org/abs/math/0009113" target="_blank" rel="noopener">Graham, Lagarias, Mallows, Wilks y Yan, Apollonian circle packings: number theory (2003, en inglés)</a><a class="source-link" href="https://arxiv.org/abs/2307.02749" target="_blank" rel="noopener">Haag, Kertzer, Rickards y Stange, The local-global conjecture for Apollonian circle packings is false (2024, en inglés)</a><a class="source-link" href="https://www.quantamagazine.org/two-students-unravel-a-widely-believed-math-conjecture-20230810/" target="_blank" rel="noopener">Two students unravel a widely believed math conjecture (Quanta Magazine, en inglés)</a><a class="source-link" href="https://doi.org/10.1038/1371021a0" target="_blank" rel="noopener">Soddy, The Kiss Precise (Nature, 1936, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/" target="_blank" rel="noopener">René Descartes (MacTutor, en inglés)</a></div>`,
  },
});
