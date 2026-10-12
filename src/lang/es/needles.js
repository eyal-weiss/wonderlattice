/* Agujas que saben π · palabras para el visitante (es). */
Wonderlattice.defineText('needles', 'es', {
  eyebrow: 'PROBABILIDAD GEOMÉTRICA',
  name: 'Agujas que saben π',
  tagline: 'Deja caer agujas sobre un suelo de tablones y cuenta cuántas quedan cruzando una línea. Sale π.',
  title: 'Agujas que saben π.',
  subtitle: 'Llueven agujas sobre un suelo de tablones. Cuenta las que cruzan una línea, y aparece π. Luego dóblalas.',
  field: 'Probabilidad · La aguja de Buffon · El fideo de Barbier',
  sceneLabel: 'Un suelo de tablones · Agujas al azar',
  tip: 'Las agujas caen solas · Elige una forma, o repite un famoso resultado afortunado',
  actionLabel: 'Lanzar de nuevo',
  canvasLabel:
    'Agujas que caen al azar sobre un suelo de tablones; las que quedan cruzando una línea entre tablones brillan. Debajo, un gráfico de la estimación de π a medida que se acumulan las agujas.',
  panelEyebrow: 'Cambia las agujas',
  whyLabel: '¿Por qué aparece π?',
  nudge:
    'Prueba un anillo tan ancho como un tablón: cruza exactamente dos líneas cada vez. Ese único hecho es la clave de todo el enigma.',
  connection: {
    html: '<strong>Un anillo tan ancho como un tablón siempre cruza dos veces.</strong> Igual que toda forma de anchura constante, y por eso el borde de cada una mide π veces su anchura.',
    label: 'Haz rodar las formas de anchura constante',
  },

  presets: [
    { name: 'Agujas sobre tablones', note: 'Cuenta los cruces: aparece π.', badge: 'π' },
    { name: 'Dóblalas', note: 'Misma longitud, igual número de cruces.', badge: '~' },
    { name: 'Un científico con suerte', note: 'Repite un resultado demasiado bueno para ser verdad.', badge: '1901' },
  ],

  shape: 'La forma',
  shapes: ['Aguja', 'Zigzag', 'Fideo', 'Anillo'],
  // Lo que muestra la imagen, según la forma (la última: las tandas de Lazzarini).
  sceneNames: ['Agujas rectas', 'Zigzags', 'Fideos', 'Anillos de un tablón de ancho', 'Las agujas de Lazzarini'],
  length: 'Longitud, como fracción de la anchura de un tablón',
  lucky: 'Repetir el experimento de Lazzarini de 1901, en tandas de 3408 agujas',

  status: {
    raining: (needles) => `${needles} ${needles === '1' ? 'aguja' : 'agujas'} hasta ahora`,
    done: (needles, pi) => `${needles} agujas: π ≈ ${pi}`,
    rings: (rings) => `${rings} anillos, 2 cruces cada uno`,
    reruns: (runs) => `${runs} ${runs === 1 ? 'tanda' : 'tandas'} de 3408 agujas`,
  },

  readout: {
    guess: (pi) => `π ≈ ${pi}`,
    thrown: 'Agujas lanzadas',
    across: 'Cruzando una línea',
    off: 'Error',
    sameRule: 'Dobladas o rectas: la misma longitud cruza, en promedio, el mismo número de líneas.',
    rule: 'π ≈ 2 × longitud × agujas ÷ cruces, con las longitudes en tablones.',
    ring: 'Cada anillo cruza exactamente 2 líneas',
    rings: 'Anillos lanzados',
    ringRule:
      'Un anillo tan ancho como un tablón mide π tablones de contorno, así que cada π tablones de longitud cruzan 2 líneas, doblados o rectos.',
    typical: (miss) => `Error típico: ${miss}`,
    reruns: 'Tandas',
    exact: 'Exactamente 355/113, como Lazzarini',
    his: 'El error de Lazzarini',
    luckyRule:
      'La mitad de las tandas se alejan de π más que el error típico. Sus agujas y su recuento hacen de 355/113 una respuesta posible, y aun así sale solo una vez de cada 70 tandas, más o menos.',
  },

  // Palabras dibujadas en la imagen: cortas.
  labels: {
    tally: (needles, across) => `${needles} agujas · ${across} cruzan una línea`,
    rings: (n) => `${n} anillos`,
    guess: (pi) => `π ≈ ${pi}`,
    ring: '2 cruces, cada vez',
    chart: 'La estimación, aguja a aguja',
    typical: 'error típico',
    pi: 'π',
    count: 'Cuántas líneas cruza cada anillo',
    every: 'cada anillo',
    run: (k) => `Tanda ${k}`,
    hits: (runs, exact) =>
      `${runs} ${runs === '1' ? 'tanda' : 'tandas'} · ${exact} ${exact === '1' ? 'dio' : 'dieron'} 355/113`,
    reruns: 'Cada punto: una tanda de 3408 agujas',
    his: 'Lazzarini, 1901',
  },

  announce: {
    done: (pi) => `Un millón de agujas: π ≈ ${pi}.`,
    ring: 'Cada anillo cruza exactamente dos líneas.',
    lucky: (miss) => `Error típico de una tanda: ${miss}. El de Lazzarini: 0,0000003.`,
  },

  guests: [
    {
      name: 'Georges-Louis Leclerc, conde de Buffon',
      note: 'Me pregunté con qué frecuencia un palito, lanzado sobre un suelo de tablas estrechas, cae cruzando una rendija entre ellas. Planteé la pregunta en 1733 y publiqué la respuesta en 1777.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'En 1860 me di cuenta de que la aguja se puede doblar como quieras: mientras su longitud siga siendo la misma, cruza las líneas igual de a menudo, en promedio.',
    },
  ],

  insight: {
    title: '¿Por qué aparece π?',
    html: `<p>Una aguja tan larga como ancho es un tablón cae cruzando una línea con una probabilidad de 2/π, alrededor del 64%. Así que, tras muchos lanzamientos, cruces ÷ agujas ≈ 2/π, y π ≈ 2 × agujas ÷ cruces. Las agujas más cortas cruzan menos a menudo, en proporción a su longitud. Georges-Louis Leclerc, conde de Buffon, planteó la pregunta en 1733 y publicó la respuesta en 1777.</p>
<div class="insight-visual">probabilidad de cruce = 2 × longitud ÷ (π × anchura del tablón)</div>
<h3>Dobla la aguja</h3>
<p>Corta una aguja en trozos cortos. Cada trozo cruza líneas, en promedio, en proporción a su longitud, esté donde esté en la aguja, y los promedios se suman aunque los trozos se muevan juntos. Así que cualquier forma cruza, en promedio, un número de líneas proporcional a su longitud: doblada, recta o enroscada. Joseph-Émile Barbier lo vio en 1860. Para hallar la constante, toma un anillo exactamente tan ancho como un tablón. Caiga donde caiga, cruza exactamente dos líneas. Su contorno mide π tablones, así que cada π tablones de longitud cruzan 2 líneas en promedio: 2 × longitud ÷ π, la regla de la aguja. El mismo truco muestra que toda forma de anchura constante, como el triángulo de Reuleaux, tiene un borde que mide π veces su anchura.</p>
<h3>El azar mide despacio</h3>
<p>La estimación oscila menos a medida que se acumulan las agujas, pero solo como 1 ÷ √(número de agujas): cada cifra correcta más cuesta unas 100 veces más agujas. Un millón de agujas suele dar π con dos o tres decimales.</p>
<h3>El científico con suerte</h3>
<p>En 1901, Mario Lazzarini informó de 3408 lanzamientos de agujas de 5/6 de tablón de largo. Eso da π ≈ 355/113 = 3,1415929…, que solo falla en el séptimo decimal, cuando un experimento de ese tamaño suele fallar por unas centésimas. Sus elecciones hacen de 355/113 una de las respuestas posibles: necesita exactamente 1808 cruces, algo que un experimento honesto da aproximadamente una vez de cada 70. Y quien lance en grupos de 213 y pare la primera vez que el recuento sea el correcto lo consigue en 3408 lanzamientos o menos más de una vez de cada cuatro. Lee Badger (1994) examinó los resultados que Lazzarini dio por el camino, con menos lanzamientos, y encontró muy improbable que se mantuvieran tan cerca de los valores esperados a lo largo de todo un experimento honesto. El periodista científico neerlandés Hans van Maanen sostiene que el artículo nunca pretendió que se lo tomaran demasiado en serio: sus lectores, maestros de escuela, podían ver que la máquina que describía Lazzarini no podía funcionar. En cualquier caso, un resultado demasiado bueno es prueba de otra cosa.</p>
<h3>Lo que esta sala simplifica</h3>
<p>Los números pseudoaleatorios del ordenador sustituyen a los lanzamientos reales. Eligen la dirección de cada aguja sin usar π: un punto al azar en un cuadrado, que solo se conserva si cae dentro del círculo, da a todas las direcciones la misma probabilidad. Las líneas del suelo siguen para siempre, así que una aguja cerca del borde de la imagen sigue contando. Las agujas reales rebotan, ruedan y caen unas sobre otras, y los tablones reales nunca son perfectamente iguales.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Las líneas están a una distancia t entre sí, y una aguja de longitud l ≤ t cae con su punto medio a una distancia x de la línea más cercana (uniforme entre 0 y t/2) y formando un ángulo θ con las líneas (uniforme entre 0 y π/2). Cruza cuando x ≤ (l/2) sin θ, así que P = (2/t)(2/π) ∫₀^{π/2} (l/2) sin θ dθ = 2l/(πt). Con n agujas y c cruces, π ≈ 2ln/(tc); su error típico es π√((1 − p)/(pn)) con p = 2l/(πt): 0,04 para 3408 agujas de un tablón de largo, 0,05 para las de Lazzarini. La aguja de Lazzarini da la estimación (5/3) × n/c, y 355/113 = (5/3) × 3408/1808. Las pruebas de la sala comprueban, frente a un programa aparte: la frecuencia de cruce 2l/π para agujas rectas, zigzags y fideos; exactamente dos cruces para cada anillo; los errores típicos de arriba; y, para el montaje de Lazzarini, 1808 cruces con una probabilidad del 1,4%, y un error mediano de 0,034. Buffon, «Essai d’arithmétique morale», Histoire naturelle, Supplément 4 (1777). E. Barbier, J. Math. Pures Appl. (2) 5 (1860). L. Badger, «Lazzarini’s lucky approximation of π», Mathematics Magazine 67 (1994).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_needle_problem" target="_blank" rel="noopener">El problema de la aguja de Buffon (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_noodle" target="_blank" rel="noopener">El fideo de Buffon (Wikipedia, en inglés)</a><a class="source-link" href="https://mathworld.wolfram.com/BuffonsNeedleProblem.html" target="_blank" rel="noopener">El problema de la aguja de Buffon (MathWorld, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Buffon/" target="_blank" rel="noopener">Buffon (MacTutor, en inglés)</a></div>`,
  },
});
