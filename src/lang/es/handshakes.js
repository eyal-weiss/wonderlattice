/* Seis apretones de manos · palabras para el visitante (es). */
Wonderlattice.defineText('handshakes', 'es', {
  eyebrow: 'MUNDOS PEQUEÑOS',
  name: 'Seis apretones de manos',
  tagline:
    'Doscientos amigos en un anillo están a 25 apretones de manos unos de otros. Cinco amistades al azar casi lo reducen a la mitad.',
  title: 'Seis apretones de manos.',
  subtitle:
    'Doscientas personas en un anillo, cada una amiga de sus cuatro vecinos más cercanos. Mira cómo unas pocas amistades al azar encogen el mundo entero, y luego añade más.',
  field: 'Redes · Teoría de grafos · Ciencias sociales',
  sceneLabel: 'Un anillo · unos pocos desconocidos',
  sceneName: 'Un anillo de 200 amigos',
  tip: 'Toca a cualquiera para contar los apretones de manos desde ti · Teclas: ← → eligen a alguien, + añade un atajo',
  actionLabel: 'Añadir un atajo',
  canvasLabel:
    'Doscientas personas en un círculo, cada una unida a sus vecinos más cercanos, con unos pocos enlaces largos que lo cruzan. En el centro, el número medio de apretones de manos entre dos personas.',
  panelEyebrow: 'Amigos de amigos',
  whyLabel: '¿Por qué unos pocos atajos encogen el mundo?',
  nudge:
    'Empieza de nuevo para tener un anillo simple, y luego añade atajos de uno en uno. ¿Cuál cambia más las cosas?',
  connection: {
    html: '<strong>Los mundos pequeños marcan el compás.</strong> Watts y Strogatz notaron que los relojes unidos como un mundo pequeño se sincronizan con más facilidad. Mira un prado lleno de ellos en «Luciérnagas que se sincronizan».',
    label: 'Ver las luciérnagas',
  },

  presets: [
    { name: 'Solo vecinos', note: 'Un anillo simple.', badge: '0' },
    { name: 'Cinco desconocidos se conocen', note: 'Cinco amistades al azar.', badge: '5' },
    { name: 'Un rumor', note: 'La noticia se extiende desde ti.', badge: '20' },
  ],

  shortcuts: 'Atajos a través del círculo',
  rumour: 'Difundir un rumor desde ti',

  // La línea de estado sobre la imagen. `steps`, `heard`, `round` y `rounds` son números enteros.
  status: {
    path: (steps) => `De ti a esa persona: ${steps} ${steps === 1 ? 'apretón de manos' : 'apretones de manos'}`,
    spreading: (heard, round) => `Ronda ${round}: ${heard} de 200 ya lo saben`,
    everyone: (rounds) => `Todos lo saben tras ${rounds} rondas`,
  },
  // Se lee en voz alta cuando el número de atajos se asienta. `count` es un entero, `distance` un número ya escrito.
  announce: (count, distance) =>
    `${count === 0 ? 'Sin atajos' : count === 1 ? 'Con 1 atajo' : `Con ${count} atajos`}, dos personas están, en promedio, a ${distance} apretones de manos de distancia.`,

  // Palabras dibujadas en la imagen.
  labels: {
    apart: 'apretones de manos',
    onAverage: 'en promedio',
    knit: 'Amigos que se conocen',
    you: 'Tú',
    steps: (steps) => `${steps} ${steps === 1 ? 'apretón de manos' : 'apretones de manos'}`,
    chart: 'Al añadir atajos',
    far: 'Cuán lejos',
    close: 'Cuán unidos',
    scale: '100% = el anillo simple',
    axis: (count) => `${count} atajos`,
  },

  guests: [
    {
      name: 'Frigyes Karinthy',
      note: 'En su cuento «Cadenas», de 1929, un personaje apuesta a que se puede llegar a cualquier persona de la Tierra a través de cinco conocidos como mucho.',
    },
    {
      name: 'Stanley Milgram',
      note: 'En la década de 1960 pidió a varias personas que hicieran avanzar una carta hacia un desconocido, pasándola solo a alguien a quien conocieran bien. La mayoría de las cartas nunca llegaron; las que sí llegaron necesitaron unos seis pasos.',
    },
  ],

  insight: {
    title: '¿Por qué unos pocos atajos encogen el mundo?',
    html: `<p>En el anillo, una noticia solo puede arrastrarse de vecino en vecino: llegar al lado opuesto cuesta 50 apretones de manos, y dos personas están, en promedio, a unos 25. Un atajo es un puente que cruza el círculo. Todos los que están cerca de uno de sus extremos quedan de pronto cerca de todos los que están cerca del otro, así que una sola amistad nueva acorta miles de cadenas a la vez.</p>
<div class="insight-visual">unos pocos enlaces largos → casi todas las cadenas se acortan → un mundo pequeño</div>
<h3>Muy unidos, y muy cerca</h3>
<p>Mientras tanto, casi nada cambia a tu alrededor. En el anillo, la mitad de los pares de tus amigos se conocen entre sí, y un puñado de atajos apenas lo altera. Un mundo puede ser acogedor y local, y aun así pequeño. Duncan Watts y Steven Strogatz lo llamaron un mundo pequeño en 1998, y lo encontraron en la red de actores de cine, en una red eléctrica y en los nervios de un gusano diminuto.</p>
<h3>¿Seis grados?</h3>
<p>En los experimentos de las cartas de Stanley Milgram, en la década de 1960, la mayoría de las cartas nunca llegaron: en uno de los estudios, llegaron 64 de 296. Las cadenas que llegaron necesitaron unos seis pasos, y los «seis grados de separación» pasaron al folclore. En 2016, Facebook midió un promedio de 4,57 pasos (3,57 personas intermedias) entre sus 1590 millones de usuarios: una plataforma, no el mundo entero.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Las amistades reales no forman un anillo ordenado, y cada persona tiene un número de amigos muy distinto. Aquí los atajos se añaden encima del anillo (una variante que estudiaron Mark Newman y Duncan Watts); en el modelo original, en cambio, se mueven algunos de los enlaces que ya existen. Y una cadena corta no siempre es una que se pueda encontrar: Jon Kleinberg demostró que las personas que solo conocen a sus propios amigos encuentran cadenas cortas solo cuando los enlaces largos siguen un patrón especial.</p>
<details><summary>Los números, si te apetecen</summary><p>Con 200 personas y 4 amigos cada una (400 enlaces), la distancia media del anillo es exactamente 5050 / 199 ≈ 25,4, y su coeficiente de agrupamiento (la proporción de pares de amigos de alguien que también son amigos entre sí) es 3(k − 2) / (4(k − 1)) = ½ para k = 4. Promediando 40 sorteos al azar, la distancia media es de unos 13,9 con 5 atajos, 10,2 con 10, 7,5 con 20 y 5,0 con 60, mientras que el agrupamiento pasa por 0,49, 0,48, 0,46 y 0,40. Cada sorteo es distinto: con 5 atajos, fue de unos 12 a 17.</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/30918" target="_blank" rel="noopener">Watts y Strogatz, <em>Nature</em> (1998, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Small-world_experiment" target="_blank" rel="noopener">El experimento del mundo pequeño (Wikipedia, en inglés)</a><a class="source-link" href="https://research.facebook.com/blog/2016/2/three-and-a-half-degrees-of-separation/" target="_blank" rel="noopener">Facebook Research (2016, en inglés)</a>J. Travers y S. Milgram, <em>Sociometry</em> 32 (1969) · J. Kleinberg, <em>Nature</em> 406 (2000)</div>`,
  },
});
