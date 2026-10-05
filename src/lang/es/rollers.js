/* Rodillos que no son redondos · palabras para el visitante (es). */
Wonderlattice.defineText('rollers', 'es', {
  eyebrow: 'ANCHURA CONSTANTE',
  name: 'Rodillos que no son redondos',
  tagline:
    'Un tablón se desliza perfectamente a nivel sobre rodillos con forma de triángulo redondeado, y uno de ellos puede taladrar un agujero casi cuadrado.',
  title: 'Rodillos que no son redondos.',
  subtitle:
    'Un tablón sobre rodillos con forma de triángulo redondeado avanza perfectamente a nivel, como sobre troncos redondos. Abajo, las mismas formas como ruedas con eje: el carrito sube y baja.',
  field: 'Geometría · Curvas de anchura constante · El triángulo de Reuleaux',
  sceneLabels: ['Rodillos y ruedas', 'Taladrar un cuadrado', 'Una vuelta cada una'],
  tip: 'Arrastra hacia los lados para rodar · Teclas: ← → ruedan, ↑ ↓ cambian la forma · Enter: una nueva forma irregular',
  actionLabel: 'Nueva forma irregular',
  canvasLabel:
    'Arriba, un tablón con una caja encima avanza sobre tres rodillos que no son redondos, y un lápiz sujeto a la caja traza una línea perfectamente recta. Abajo, un carrito con ruedas de la misma forma, fijas a sus ejes, sube y baja, y su lápiz traza una onda. En la vista del taladro, un triángulo curvo gira dentro de un cuadrado y lo pinta casi entero. En la carrera, cuatro formas de la misma anchura ruedan una vuelta cada una y llegan juntas.',
  panelEyebrow: 'Elige una forma',
  whyLabel: '¿Por qué el tablón se mantiene a nivel?',
  nudge:
    'Pulsa «Nueva forma irregular»: cualquier forma igual de ancha en todas direcciones lleva el tablón a nivel. Luego prueba «Taladra un agujero cuadrado».',
  connection: {
    html: '<strong>Viajes suaves.</strong> Aquí, unos rodillos que no son redondos llevan un tablón a nivel. En «Ruedas cuadradas, viaje suave», unas ruedas cuadradas avanzan a nivel sobre un camino de jorobas.',
    label: 'Ruedas cuadradas, viaje suave',
  },

  presets: [
    { name: 'Rodillos triangulares', note: 'Tres bajo un tablón, y la misma forma como ruedas.' },
    { name: 'Taladra un agujero cuadrado', note: 'Un triángulo que gira llena casi todo un cuadrado.' },
    { name: 'Una vuelta cada una', note: 'La misma anchura, el mismo borde: todas ruedan igual de lejos.' },
  ],

  view: 'Qué probar',
  views: ['Rodillos', 'Taladro', 'Una vuelta'],
  shape: 'Forma',
  shapes: ['Círculo', 'Triángulo', 'Pentágono', 'Irregular'],
  lines: 'Rectas de su trazado',
  linesHint: 'Cada trozo de su borde es un arco centrado donde se cruzan dos de las rectas.',
  corners: 'Esquinas redondeadas',
  cornersHint:
    'El radio de la curva más cerrada, como parte de la anchura. Redondear todas las esquinas mantiene la misma anchura.',

  // El nombre de la escena, para cada forma (con esquinas o redondeada) y cada vista.
  names: {
    rollers: (kind, rounded) =>
      kind === 0
        ? 'Troncos redondos'
        : kind === 1
          ? rounded
            ? 'Triángulos redondeados'
            : 'Triángulos de Reuleaux'
          : kind === 2
            ? rounded
              ? 'Pentágonos redondeados'
              : 'Pentágonos de Reuleaux'
            : 'Una forma irregular',
    drill: (kind, rounded) =>
      kind === 0
        ? 'Taladrar con un círculo'
        : kind === 1
          ? rounded
            ? 'Taladrar con un triángulo redondeado'
            : 'Taladrar con un triángulo de Reuleaux'
          : kind === 2
            ? rounded
              ? 'Taladrar con un pentágono redondeado'
              : 'Taladrar con un pentágono de Reuleaux'
            : 'Taladrar con una forma irregular',
    race: 'Cuatro formas, una anchura',
  },

  // Los números llegan ya escritos en el idioma de la página.
  percent: (x) => `${x}%`,
  readout: {
    level: 'El tablón se mantiene perfectamente a nivel.',
    drill: 'Casi un agujero cuadrado.',
    drillRound: 'Un agujero redondo.',
    drillOther: 'Un agujero con esquinas redondeadas.',
    race: 'Todas llegan a la vez.',
    plank: 'El tablón sobre rodillos',
    plankValue: 'nunca sube ni baja',
    cart: 'El carrito con eje sube y baja',
    cartValue: (share) => `un ${share} de la anchura`,
    rim: 'Su borde mide',
    rimValue: (times) => `${times} × su anchura`,
    area: 'Su área es',
    areaValue: (share) => `el ${share} de la de un círculo`,
    drilled: 'Ya taladrado',
    drilledValue: (share) => `el ${share} del cuadrado`,
    full: 'Tras una vuelta entera',
    fullValue: (share) => `el ${share} del cuadrado`,
    rims: 'Todos los bordes miden',
    rimsValue: 'π × la anchura',
    least: 'La menor área',
    leastValue: (share) => `el triángulo: el ${share} de la de un círculo`,
    widthRule: 'La gires como la gires, es exactamente igual de ancha.',
    drillRule: 'Toca los cuatro lados mientras gira, porque es tan ancha como el cuadrado en todas direcciones.',
    raceRule:
      'Al dar una vuelta entera, una forma avanza la longitud de su borde: π veces su anchura, sea cual sea su forma.',
  },
  status: {
    rollers: 'A nivel sobre rodillos',
    drill: (share) => `${share} taladrado`,
    race: 'Misma anchura, mismo borde',
  },

  // Palabras dibujadas en la imagen.
  labels: {
    rollers: 'Como rodillos: el tablón va siempre a nivel',
    axles: (share) => `Con ejes: el carrito oscila un ${share} de la anchura`,
    axlesRound: 'Con ejes: el círculo también va a nivel',
    close: 'De cerca: siempre igual de ancha',
    width: 'anchura',
    lines: 'Las rectas de su trazado',
    corner: (n) => `Esquina ampliada ${n}×`,
    path: 'Camino de su centro',
    finish: 'Una vuelta: π × anchura',
    rim: 'Borde desenrollado',
  },

  announce: {
    rollers: (name, share) =>
      `${name}: el tablón va a nivel sobre los rodillos; con eje, el carrito sube y baja un ${share} de la anchura.`,
    round: (name) => `${name}: a nivel como rodillos, y también a nivel con eje.`,
    drill: (name, share) => `${name}: tras una vuelta entera ha taladrado el ${share} del cuadrado.`,
    race: 'Cuatro formas de la misma anchura ruedan una vuelta cada una, y todas llegan a la vez.',
  },

  guests: [
    {
      name: 'Franz Reuleaux',
      note: 'Describí las máquinas como cadenas de piezas móviles sencillas, e hice construir cientos de modelos de mecanismos para la enseñanza. El triángulo curvo de esta sala lleva mi nombre, aunque otros lo dibujaron mucho antes que yo.',
    },
    {
      name: 'Leonhard Euler',
      note: 'En un trabajo que presenté en 1771, estudié los triángulos curvos y las formas que son igual de anchas en todas direcciones. Las llamé orbiformes.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'En 1860 demostré que toda forma de anchura constante tiene un borde que mide exactamente π veces su anchura, sea cual sea su forma.',
    },
  ],

  insight: {
    title: '¿Por qué el tablón se mantiene a nivel?',
    html: `<p>El suelo está bajo cada rodillo y el tablón descansa encima, así que la altura del tablón es la distancia entre dos rectas paralelas que tocan el rodillo: su anchura, medida en vertical. Un círculo es igual de ancho en todas direcciones. También lo es cada forma de esta sala: mídela de lado a lado en cualquier dirección y obtendrás lo mismo. Mientras gira, su anchura en vertical nunca cambia, y por eso tampoco cambia la altura del tablón.</p>
<div class="insight-visual">altura del tablón = anchura del rodillo en vertical = la misma en todas direcciones</div>
<h3>Rodillos, no ruedas</h3>
<p>El centro de un triángulo de Reuleaux está más cerca de sus lados que de sus esquinas, así que, al rodar, su centro sube y baja. A un rodillo no le importa, porque no hay nada sujeto a su centro. Una rueda gira sobre un eje que pasa por su centro, así que un carrito sobre triángulos de Reuleaux sube y baja, tres veces por vuelta, un 15% de la anchura. Bajo el tablón, los rodillos tampoco van exactamente al mismo paso: mientras giran, cada uno avanza a ratos un poco más rápido y a ratos un poco más despacio, aunque de media, como los troncos redondos, avanzan a la mitad de la velocidad del tablón.</p>
<h3>Cómo dibujar uno</h3>
<p>Dibuja un triángulo equilátero, pon la punta de un compás en cada esquina por turno y traza el arco entre las otras dos: eso es un triángulo de Reuleaux. Cualquier polígono regular con un número impar de lados funciona igual. Las formas irregulares usan el método de las rectas cruzadas: dibuja unas cuantas rectas que se crucen todas entre sí, y une cada recta con la siguiente, dando la vuelta, mediante un arco centrado donde se cruzan. Tras dar dos vueltas, la curva se cierra, igual de ancha en todas direcciones. Redondear las esquinas, en la misma medida en todo el contorno, mantiene la misma anchura.</p>
<h3>Una vuelta, la misma distancia</h3>
<p>Cada forma de aquí tiene un borde que mide exactamente π veces su anchura, tanto como el de un círculo de la misma anchura. Es el teorema de Barbier, de 1860. Así que, al dar una vuelta entera, todas recorren la misma distancia. Sus áreas son distintas: de todas las formas de la misma anchura, el círculo encierra la mayor, y el triángulo de Reuleaux la menor, según el teorema de Blaschke–Lebesgue (Henri Lebesgue en 1914, Wilhelm Blaschke en 1915).</p>
<h3>Un agujero cuadrado</h3>
<p>Cualquier forma de anchura constante puede girar dentro de un cuadrado tan ancho como ella, tocando los cuatro lados todo el tiempo. El triángulo de Reuleaux, con las esquinas más agudas que puede tener una forma así (120°), barre todo salvo las puntas mismas de las esquinas: 2√3 + π/6 − 3 del cuadrado, alrededor del 98,8%. Las brocas cuadradas basadas en esta idea se patentaron en 1914 y aún se fabrican, aunque antes ya se habían usado taladros parecidos. El centro de la broca se desplaza mientras gira, así que necesita un portabrocas especial que se lo permita, y una guía con un agujero cuadrado. Las esquinas más romas del pentágono dejan más sin taladrar, y un círculo taladra un agujero redondo, π/4 del cuadrado.</p>
<h3>Lo que la sala deja fuera</h3>
<p>Aquí los rodillos son perfectos, el suelo y el tablón son perfectamente planos, y nada resbala. Los rodillos de verdad deben tener todos exactamente la misma anchura, y alguien tiene que llevar cada uno de atrás hacia delante, como pasa aquí cuando un rodillo se desvanece y vuelve a aparecer. Una broca de verdad también necesita filos cortantes, así que es un triángulo de Reuleaux con estrías talladas. También hay sólidos de anchura constante, como los cuerpos de Meissner, pero la sala se queda en el plano; el sólido hecho como un triángulo de Reuleaux a partir de cuatro bolas, el tetraedro de Reuleaux, no es del todo igual de ancho en todas direcciones.</p>
<p>A menudo se dice que las tapas de alcantarilla son redondas para que no puedan caer por su agujero. Una tapa con cualquiera de las formas de aquí tampoco podría; además, las tapas redondas son mucho más fáciles de fabricar, y no hace falta girarlas para que encajen. Algunas monedas tienen formas de anchura constante, como las británicas de 20 y 50 peniques, que son heptágonos de Reuleaux, para que las máquinas puedan medirlas de lado a lado estén como estén colocadas.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Describe una forma mediante su función soporte h(θ): a qué distancia de un centro está su recta tangente orientada hacia la dirección θ. Su anchura en la dirección θ es h(θ) + h(θ + π), así que una anchura constante w significa que h(θ) + h(θ + π) = w para todo θ. Al rodar por el suelo sin resbalar, la forma gira en torno al punto donde lo toca. Al girar un ángulo dψ, el tablón, a una altura w sobre ese punto, avanza w dψ, y el centro, a una altura h, avanza h dψ. En una vuelta entera, el centro avanza ∫h dθ = πw, la mitad que el tablón, porque los valores opuestos de h suman w. La longitud del borde es ∫(h + h″) dθ = ∫h dθ, el mismo πw: el teorema de Barbier.</p><p>Las formas de la sala se construyen con arcos por el método de las rectas cruzadas, y cada una gira en torno al centro de su menor círculo circunscrito, que para una forma de anchura constante es también el centro del mayor círculo inscrito; esos dos radios suman la anchura. En el cuadrado de −½ a ½, la forma girada un ángulo φ tiene su centro en (½ − h(−φ), ½ − h(π/2 − φ)), de modo que sus rectas tangentes orientadas hacia la derecha y hacia arriba están sobre esos lados, y, por la anchura constante, las de la izquierda y de abajo también. Para el triángulo de Reuleaux, ese centro recorre cuatro arcos de elipse.</p><p>Las pruebas de la sala comprueban, frente a un programa aparte que construye cada polígono de Reuleaux a partir de discos superpuestos: la anchura en todas direcciones, la longitud del borde, π, el área del triángulo, (π − √3)/2 ≈ 0,7048, y la del pentágono, la oscilación sobre un eje, 2/√3 − 1 ≈ 15,5% para el triángulo y 5,1% para el pentágono, y la parte del cuadrado taladrada: 98,8% por el triángulo, 87,9% por el pentágono y π/4 por el círculo.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_triangle" target="_blank" rel="noopener">Triángulo de Reuleaux (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Curve_of_constant_width" target="_blank" rel="noopener">Curva de anchura constante (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_polygon" target="_blank" rel="noopener">Polígono de Reuleaux (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barbier%27s_theorem" target="_blank" rel="noopener">Teorema de Barbier (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Blaschke%E2%80%93Lebesgue_theorem" target="_blank" rel="noopener">Teorema de Blaschke–Lebesgue (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Watts_Brothers_Tool_Works" target="_blank" rel="noopener">Watts Brothers Tool Works (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Manhole_cover" target="_blank" rel="noopener">Tapa de alcantarilla (Wikipedia, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Barbier/" target="_blank" rel="noopener">Joseph-Émile Barbier (MacTutor, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Franz_Reuleaux" target="_blank" rel="noopener">Franz Reuleaux (Wikipedia, en inglés)</a></div>`,
  },
});
