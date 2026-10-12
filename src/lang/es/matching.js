/* Gana quien pide · palabras para el visitante (es). */
Wonderlattice.defineText('matching', 'es', {
  eyebrow: 'PAREJAS JUSTAS',
  name: 'Gana quien pide',
  tagline:
    'Empareja a seis alumnos con seis clubes de modo que nadie prefiera cambiar. Quien pide primero se lleva, sin que se note, el mejor trato.',
  title: 'Gana quien pide.',
  subtitle:
    'Los alumnos piden plaza en los clubes hasta que todas las parejas quedan fijadas. Luego piden los clubes: los mismos deseos, otro emparejamiento justo, y la felicidad se invierte.',
  field: 'Teoría de juegos · Emparejamiento estable · Diseño de mercados',
  sceneLabel: '6 alumnos · 6 clubes',
  sceneNames: ['Deseos enredados', 'Una misma clasificación', 'Deseos opuestos'],
  shuffledName: 'Deseos barajados',
  tip: 'Toca a un alumno y luego un club para emparejarlos tú · Las flechas apuntan, Enter elige',
  actionLabel: 'Cambiar quién pide',
  canvasLabel:
    'Seis alumnos a la izquierda, como círculos de colores numerados, y seis clubes a la derecha, como formas. Junto a cada uno, su lista de deseos, del preferido al último. Unas líneas unen las parejas. Toca a un alumno y luego un club para emparejarlos tú: una línea roja marca a dos que preferirían, los dos, estar juntos.',
  panelEyebrow: 'Quién pide primero',
  whyLabel: '¿Por qué gana quien pide primero?',
  nudge:
    'Toca a un alumno y luego un club para emparejarlos a mano. Una línea roja significa que esos dos preferirían, los dos, irse juntos. ¿Encuentras un emparejamiento sin líneas rojas que no salga con ninguna de las dos formas de pedir?',
  connection: {
    html: '<strong>Elegir bien.</strong> Aquí, un alumno rechazado simplemente prueba con el siguiente club. En «Detente en el 37%», tienes que quedarte con cada carta o dejarla para siempre.',
    label: 'Visita «Detente en el 37%»',
  },

  presets: [
    { name: 'Deseos enredados', note: 'Pedir primero lo decide casi todo.' },
    { name: 'Una misma clasificación', note: 'Todos los clubes ordenan igual a los alumnos.' },
    { name: 'Deseos opuestos', note: 'El club favorito de cada alumno lo pone el último.' },
  ],

  speed: 'Velocidad',
  swap: 'Seguir cambiando quién pide',
  marks: 'Marcar cada pareja estable posible',
  shuffle: 'Deseos nuevos',
  count: (n) =>
    n === 1
      ? 'Estos deseos solo permiten 1 emparejamiento estable, así que da igual quién pida.'
      : `Estos deseos permiten ${n} emparejamientos estables.`,

  // Dibujado en la imagen: corto.
  labels: {
    students: 'ALUMNOS',
    clubs: 'CLUBES',
    studentsAsk: 'Alumnos piden',
    clubsAsk: 'Clubes piden',
    yours: 'Tus parejas',
  },
  // El marcador bajo las listas: hasta dónde bajó cada lado en su lista, en promedio.
  score: {
    title: 'OPCIÓN MEDIA',
    first: '1.ª',
    last: '6.ª',
  },

  status: {
    // r: la ronda, desde 1; k: las peticiones en camino en esa ronda.
    round: (clubs, r, k) =>
      clubs
        ? `Ronda ${r} · ${k === 1 ? '1 club pide' : `${k} clubes piden`}`
        : `Ronda ${r} · ${k === 1 ? '1 alumno pide plaza' : `${k} alumnos piden plaza`}`,
    // firsts: cuántos del lado que pide consiguieron su primera opción.
    done: (clubs, firsts) =>
      clubs
        ? `Pidieron los clubes: ${firsts} de 6 clubes ${firsts === 1 ? 'consiguió' : 'consiguieron'} su primera opción`
        : `Pidieron los alumnos: ${firsts} de 6 alumnos ${firsts === 1 ? 'consiguió' : 'consiguieron'} su primera opción`,
    unstable: (k) =>
      k === 1
        ? 'Tu emparejamiento: 1 pareja preferiría cambiar'
        : `Tu emparejamiento: ${k} parejas preferirían cambiar`,
    stable: 'Tu emparejamiento es estable: ninguna pareja preferiría cambiar',
    stableNew: 'Estable, y no sale con ninguna de las dos formas de pedir',
  },

  guests: [
    {
      name: 'David Gale',
      note: 'En 1962, Lloyd Shapley y yo demostramos que siempre se puede emparejar a aspirantes y universidades de modo que no haya un aspirante y una universidad que prefieran, los dos, estar juntos. Nuestro método: solicitar, quedarse con la mejor oferta y que nadie diga que sí hasta el final.',
    },
    {
      name: 'Lloyd Shapley',
      note: 'Nuestro artículo terminaba ofreciendo su demostración principal como ejemplo de matemáticas en inglés corriente, sin símbolos y casi sin cuentas. Medio siglo después compartí el premio de economía en memoria de Alfred Nobel con Al Roth, que puso la idea a trabajar.',
    },
    {
      name: 'Alvin Roth',
      note: 'Se dio cuenta de que los hospitales estadounidenses emparejaban a los médicos jóvenes con esencialmente este método desde principios de la década de 1950, y más tarde ayudó a rediseñar ese emparejamiento y la asignación de escuelas de la ciudad de Nueva York y de Boston.',
    },
  ],

  insight: {
    title: '¿Por qué gana quien pide primero?',
    html: `<p>Un emparejamiento es <em>estable</em> cuando no hay ningún alumno y ningún club que se prefieran mutuamente a las parejas que les han tocado. Una pareja así simplemente se marcharía junta, así que un emparejamiento inestable no dura. En 1962, David Gale y Lloyd Shapley demostraron que siempre existe un emparejamiento estable, por enredados que estén los deseos, y dieron una forma sencilla de encontrar uno.</p>
<div class="insight-visual">cada alumno sin pareja pide plaza en el mejor club que aún no ha probado · cada club se queda con su mejor oferta hasta ahora y rechaza las demás · repetir hasta que no se rechace a nadie</div>
<h3>Por qué es estable</h3>
<p>Toma un alumno y un club que al final no estén emparejados. Si el alumno prefiere ese club, es que pidió plaza allí antes de acabar más abajo en su lista, y el club lo rechazó por alguien que le gustaba más. Las ofertas que recibe un club solo mejoran, así que sigue prefiriendo a su pareja final. Nadie puede irse en pareja.</p>
<h3>Por qué ganan los que piden</h3>
<p>Normalmente hay varios emparejamientos estables. Gale y Shapley demostraron que el que encuentra este método da a cada alumno, a la vez, la mejor pareja que puede tener en cualquier emparejamiento estable. La razón: a ningún alumno lo rechaza nunca un club que podría ser su pareja en un emparejamiento estable. Y ese mismo emparejamiento da a cada club la peor pareja que puede tener en cualquier emparejamiento estable. Cambia quién pide y los clubes obtienen lo mejor, y los alumnos lo peor. Activa «Marcar cada pareja estable posible» y verás que cada uno acaba en el primero o en el último de sus puntos.</p>
<p>Cuando todos los clubes ordenan a los alumnos de la misma manera, por ejemplo según un mismo examen, solo hay un emparejamiento estable, y da igual quién pida. Pedir primero importa cuando los deseos chocan.</p>
<h3>Decir la verdad</h3>
<p>Los que piden no ganan nada ocultando sus verdaderos deseos; el lado al que se le pide a veces sí, rechazando una oferta que en realidad le gusta, aunque para eso hay que conocer los deseos de todos los demás, y puede salir mal.</p>
<h3>Dónde se usa</h3>
<p>Los hospitales estadounidenses emparejaban a los médicos jóvenes con esencialmente este método desde principios de la década de 1950, años antes del artículo, como notó más tarde Alvin Roth. A finales de la década de 1990, el emparejamiento de los médicos se rediseñó para que pidan los aspirantes, y métodos parecidos asignan hoy a los alumnos a las escuelas en la ciudad de Nueva York y en Boston. En 2012, Shapley y Roth compartieron el premio de economía en memoria de Alfred Nobel; Gale había muerto en 2008. En estudios de grandes emparejamientos reales, la elección de quién pide ha cambiado el resultado para muy pocas personas.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Los emparejamientos reales dan a un club varias plazas, permiten empates, dejan que algunas personas no completen su lista e incluyen parejas sentimentales que quieren quedarse en la misma ciudad. Con esas parejas, puede que no exista ningún emparejamiento estable. Sin dos lados, como al emparejar compañeros de habitación, puede que tampoco exista; en 1985, Robert Irving encontró un método que encuentra uno siempre que exista. Y «estable» no es «feliz»: solo significa que nadie puede irse con alguien que también lo quiera a él.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Aquí, en cada ronda, todos los que piden y no tienen pareja piden a la vez. El orden de las peticiones no cambia el resultado. Con n en cada lado, el método de Gale y Shapley termina tras n² − 2n + 2 rondas como mucho, 26 para seis de cada, y con n² − n + 1 peticiones en total como mucho, 31. Con tres en cada lado, un ordenador puede probar todos los conjuntos de deseos posibles: el peor necesita exactamente 5 rondas y 7 peticiones. Los emparejamientos estables encajan en un retículo, con lo mejor para los alumnos en un extremo y lo mejor para los clubes en el otro (el libro de Donald Knuth de 1976 <em>Mariages stables</em> lo explora). Para marcar cada pareja estable posible, esta sala prueba las 720 maneras de emparejar a seis alumnos con seis clubes.</p></details>
<div class="sources"><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2012/popular-information/" target="_blank" rel="noopener">El Premio Nobel (2012), Stable matching: theory, evidence and practical design (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gale%E2%80%93Shapley_algorithm" target="_blank" rel="noopener">El algoritmo de Gale–Shapley (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Resident_Matching_Program" target="_blank" rel="noopener">El National Resident Matching Program (Wikipedia, en inglés)</a><a class="source-link" href="https://doi.org/10.1257/000282805774670167" target="_blank" rel="noopener">Abdulkadiroğlu, Pathak y Roth (2005), The New York City high school match (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stable_roommates_problem" target="_blank" rel="noopener">El problema de los compañeros de habitación estables (Wikipedia, en inglés)</a><a class="source-link" href="https://doi.org/10.2307/2312726" target="_blank" rel="noopener">Gale y Shapley (1962), College admissions and the stability of marriage (en inglés)</a></div>`,
  },
});
