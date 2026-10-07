/* El hotel que siempre está lleno · palabras para el visitante (es). */
Wonderlattice.defineText('hotel', 'es', {
  eyebrow: 'INFINITO',
  name: 'El hotel que siempre está lleno',
  tagline:
    'Todas las habitaciones están ocupadas, y aun así cabe un huésped más, y luego infinitos. Después llega un autobús que nunca cabrá.',
  title: 'El hotel que siempre está lleno.',
  subtitle:
    'Todas las habitaciones de un hotel sin fin están ocupadas, y aun así mira cómo hace sitio a un huésped más, y luego a un autobús de infinitos pasajeros. Después prueba el autobús de cara o cruz.',
  field: 'Infinito · Emparejar · El argumento diagonal de Cantor',
  sceneLabel: 'Habitaciones 1, 2, 3, … sin fin',
  sceneNames: ['Un huésped más', 'Un autobús sin fin', 'Autobuses sin fin', 'El autobús de cara o cruz'],
  tip: 'Elige una carta de movimiento en el panel · En el autobús de cara o cruz, toca una tirada para cambiarla (las flechas apuntan, Enter le da la vuelta)',
  actionLabel: 'Siguiente llegada',
  canvasLabel:
    'El pasillo de un hotel sin fin, con puertas numeradas que se pierden en la distancia, y todas las habitaciones ocupadas. Llegan huéspedes nuevos, y todos los huéspedes se mueven a la vez para dejarles habitaciones libres. En el autobús de cara o cruz, una lista de pasajeros, uno por habitación, y un pasajero nuevo construido a partir de su diagonal. Toca una tirada para cambiarla, o usa las flechas para apuntar y Enter para darle la vuelta.',
  panelEyebrow: 'Cartas de movimiento',
  whyLabel: '¿Cómo puede un hotel lleno recibir más huéspedes?',
  nudge:
    'Después del autobús sin fin, pulsa «Siguiente llegada»: autobuses sin fin, y luego un autobús cuyos pasajeros no caben en ninguna lista de habitaciones.',
  connection: {
    html: '<strong>Imposible, intentes lo que intentes.</strong> Aquí, ninguna lista de habitaciones da cabida a todos los pasajeros de cara o cruz. En «El suelo imposible», un coloreado demuestra que ningún embaldosado puede cubrir el tablero.',
    label: 'Visita «El suelo imposible»',
  },

  presets: [
    { name: 'Un huésped más', note: 'El hotel está lleno. Llama un huésped.' },
    { name: 'Autobuses sin fin', note: 'Infinitos, y todos llenos.' },
    { name: 'El autobús de cara o cruz', note: 'El autobús que no cabe.' },
  ],

  // Las cartas de movimiento: la cara grande, y lo que le dice al huésped de la habitación n.
  cards: {
    one: { face: '+1', rule: 'hab. n → hab. n + 1' },
    five: { face: '+5', rule: 'hab. n → hab. n + 5' },
    double: { face: '×2', rule: 'hab. n → hab. 2n' },
    zigzag: { face: 'Zigzag', rule: 'recorre los asientos de ida y vuelta' },
    admit: { face: '+1', rule: 'pon al nuevo pasajero en la habitación 1' },
    shuffle: { face: '↻', rule: 'una lista nueva: cada habitación recibe tiradas nuevas' },
  },
  pick: 'Elige una carta. Todos los huéspedes se mueven a la vez.',
  everyone: (face) => `Todos ${face}`,

  // Dibujado en la imagen.
  full: 'COMPLETO',
  vacant: 'LIBRE',
  guest: 'Nuevo huésped',
  coach: 'Bus sin fin',
  queue: 'Pasajeros 1, 2, 3, …',
  hotelRow: 'Hotel',
  coachRow: (n) => `Bus ${n}`,
  seat: 'Asientos 1, 2, 3, …',
  rooms: 'Habitaciones 1, 2, 3, …',
  room: (n) => `Hab. ${n}`,
  heads: 'C',
  tails: 'X',
  flips: 'Tiradas 1, 2, 3, …',
  passenger: 'Nuevo pasajero',
  question: '«¿Y mi habitación?»',
  differs: 'Distinto en la diagonal',

  listHint:
    'Toca cualquier tirada de la imagen para cambiarla. La diagonal también cambia, y su pasajero sigue quedándose fuera.',
  status: {
    waiting: [
      'Llama un huésped nuevo. Todas las habitaciones están ocupadas.',
      'Llega un autobús sin fin.',
      'Llegan autobuses sin fin.',
    ],
    one: [
      'Queda libre la habitación 1. Sigue completo.',
      'El pasajero 1 ya está dentro. Los pasajeros 2, 3, 4, … esperan.',
    ],
    five: [
      'El huésped ya está dentro, y las habitaciones de la 2 a la 5 quedan vacías.',
      'Los pasajeros del 1 al 5 ya están dentro. Los 6, 7, 8, … esperan.',
    ],
    double: [
      'El huésped ya está dentro, y las habitaciones impares quedan vacías.',
      'El pasajero n ocupa la habitación 2n − 1. Sigue completo.',
      'El autobús 1 ya está dentro. Los autobuses 2, 3, 4, … esperan.',
    ],
    zigzag: 'Cada asiento de cada autobús tiene habitación.',
    tracing: (room, row, seat) =>
      row === 0
        ? `Habitación ${room}: el huésped de la habitación ${seat}`
        : `Habitación ${room}: autobús ${row}, asiento ${seat}`,
    building: (k) => `Tirada ${k}: la contraria de la tirada ${k} de la habitación ${k}`,
    built: 'Ninguna habitación lo tiene: difiere de la habitación k en la tirada k.',
    admitted: 'Ya está en la habitación 1, pero la nueva diagonal deja a alguien fuera.',
    edited: 'Una diagonal nueva, y sigue quedando alguien fuera.',
    shuffled: 'Una lista nueva, y sigue quedando alguien fuera.',
  },

  guests: [
    {
      name: 'David Hilbert',
      note: 'En una conferencia de 1924 hablé de un hotel con infinitas habitaciones, todas ocupadas, que aun así puede recibir a un recién llegado. Un infinito completo no se comporta como nada finito.',
    },
    {
      name: 'Georg Cantor',
      note: 'En 1891 demostré que las sucesiones infinitas de dos símbolos no se pueden poner todas en una lista: cambia el primer símbolo de la primera sucesión, el segundo de la segunda, y así sucesivamente, y tendrás una que a la lista se le escapó.',
    },
    {
      name: 'George Gamow',
      note: 'En mi libro de 1947, One Two Three… Infinity, volví a contar el hotel de Hilbert para todos los públicos. Así es como la mayoría de la gente oyó hablar de él por primera vez.',
    },
  ],

  insight: {
    title: '¿Cómo puede un hotel lleno recibir más huéspedes?',
    html: `<p>«Infinitos» no es un número al que se pueda llegar contando, así que el hotel no puede comparar tamaños contando. Lo que sí puede hacer es emparejar. Dos colecciones tienen el <em>mismo tamaño</em> cuando se pueden emparejar exactamente, uno a uno, sin que sobre nadie. Los huéspedes y las habitaciones están emparejados: todas las habitaciones están ocupadas.</p>
<div class="insight-visual">+1: hab. n → hab. n + 1 · ×2: hab. n → hab. 2n · nunca hay dos huéspedes en la misma habitación</div>
<h3>Sitio para un autobús</h3>
<p>«Todos +1» es un emparejamiento nuevo: los huéspedes de antes con las habitaciones 2, 3, 4, …, lo que deja la habitación 1 para el recién llegado. «Todos ×2» manda a los huéspedes de antes a las habitaciones pares y deja libres todas las impares, así que cabe un autobús sin fin entero: el pasajero n ocupa la habitación 2n − 1. Hay tantos números pares como números naturales. Que una parte sea tan grande como el todo es justo lo que hace infinita una colección. Aquí no se calcula ninguna suma como «infinito más uno»; cada paso es un emparejamiento.</p>
<h3>Autobuses sin fin</h3>
<p>Escribe los autobuses como filas y sus asientos como columnas. Un zigzag por las diagonales cortas, de ida y vuelta desde la esquina, llega a cada asiento de cada autobús tras un número finito de pasos, así que cada uno recibe su propia habitación (es el emparejamiento de Cantor). El mismo zigzag pone en una lista todas las fracciones. Cualquier colección que se pueda poner en una lista así se llama <em>numerable</em>.</p>
<h3>El autobús que no cabe</h3>
<p>Cada pasajero del último autobús se identifica con una sucesión infinita de tiradas de moneda. Intenta darles habitación: la habitación 1 recibe una sucesión, la habitación 2 otra, y así sucesivamente. Ahora construye un pasajero cuya primera tirada sea la contraria de la primera tirada de la habitación 1, cuya segunda sea la contraria de la segunda de la habitación 2, y así a lo largo de la diagonal. Este pasajero difiere del huésped de la habitación k en la tirada k, para todo k, así que no tiene habitación. Eso funciona con cualquier lista, por ingeniosa que sea. Así que hay más sucesiones infinitas de tiradas que habitaciones: un infinito más grande. Es el argumento diagonal de Cantor, de 1891. Lee cara como 1 y cruz como 0, y cada sucesión es un número entre 0 y 1 en binario; el mismo argumento (con un poco de cuidado, porque 0,0111… y 0,1000… son el mismo número) muestra que los números reales tampoco se pueden poner en una lista.</p>
<h3>Lo que la imagen deja fuera</h3>
<p>Muestra unas pocas docenas de puertas y una esquina de 8 × 8 de la lista, pero el argumento trata de todas las habitaciones y todas las tiradas a la vez: la tirada 100 del nuevo pasajero es la contraria de la tirada 100 de la habitación 100, muy lejos de la imagen. Ningún hotel de verdad podría mover infinitos huéspedes en un solo paso; las matemáticas sí, porque una regla como «habitación n → habitación 2n» dice adónde va todo el mundo a la vez.</p>
<h3>De dónde viene la historia</h3>
<p>David Hilbert contó la historia del hotel en una conferencia en enero de 1924; sus notas quedaron sin publicar durante décadas. El libro de George Gamow <em>One Two Three… Infinity</em> (1947) la hizo famosa, como reconstruye Helge Kragh. El argumento diagonal de Georg Cantor apareció en 1891, aunque no fue su primera demostración de que los números reales no se pueden poner en una lista: aquella, de 1874, usaba un argumento distinto.</p>
<div class="sources"><a class="source-link" href="https://arxiv.org/abs/1403.0059" target="_blank" rel="noopener">Kragh (2014), The true (?) story of Hilbert’s infinite hotel (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Hilbert%27s_paradox_of_the_Grand_Hotel" target="_blank" rel="noopener">La paradoja del Gran Hotel de Hilbert (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument" target="_blank" rel="noopener">El argumento diagonal de Cantor (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Pairing_function" target="_blank" rel="noopener">Funciones de emparejamiento (Wikipedia, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/" target="_blank" rel="noopener">Georg Cantor (MacTutor, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/One_Two_Three..._Infinity" target="_blank" rel="noopener">Gamow, One Two Three… Infinity, 1947 (Wikipedia, en inglés)</a></div>`,
  },
});
