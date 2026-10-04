/* Caleidoscopio de tramposos · palabras para el visitante (es). */
Wonderlattice.defineText('cheaters', 'es', {
  eyebrow: 'COOPERACIÓN',
  name: 'Caleidoscopio de tramposos',
  tagline: 'Un tramposo entre cooperadores, una regla sencilla y un tapiz de guerra y paz que no deja de cambiar.',
  title: 'Caleidoscopio de tramposos.',
  subtitle:
    'Haciendo trampa siempre se gana más. Pero cuando cada uno copia a su vecino con más éxito, un solo tramposo crece hasta formar un caleidoscopio, y los cooperadores nunca desaparecen.',
  field: 'Teoría de juegos · El dilema del prisionero · Autómatas celulares',
  sceneLabel: '99 × 99 jugadores · Copia al mejor',
  sceneNames: ['Un tramposo', 'Una multitud mezclada', 'Cambiando uno a uno'],
  mixed: 'Tu propia cuadrícula',
  tip: 'Toca una casilla para que haga trampa, o para que vuelva a cooperar · Las flechas apuntan y Enter la cambia',
  actionLabel: 'Añadir un tramposo al azar',
  canvasLabel:
    'Una cuadrícula de jugadores: cooperadores en azul, tramposos en rojo, y amarillo y verde para los jugadores que acaban de cambiar. Toca una casilla para cambiarla, o usa las flechas para apuntar y Enter para cambiarla.',
  panelEyebrow: 'Copia al mejor',
  whyLabel: '¿Por qué no ganan los tramposos?',
  nudge:
    'Pulsa «Añadir un tramposo al azar», o toca una casilla lejos del centro: la simetría perfecta se rompe. Luego desactiva «Todos cambian a la vez».',
  connection: {
    html: '<strong>Copia a tus vecinos.</strong> Aquí, los jugadores que copian al que mejor le va a su alrededor tejen un tapiz. En «Una mente de muchos», los pájaros que siguen a unos pocos vecinos se mueven como una sola bandada.',
    label: 'Visita «Una mente de muchos»',
  },

  presets: [
    { name: 'Un tramposo', note: 'Un solo tramposo en el centro.' },
    { name: 'Una multitud mezclada', note: 'Uno de cada diez jugadores empieza haciendo trampa.' },
    { name: 'Uno a uno', note: 'Los jugadores cambian por turnos, no a la vez.' },
  ],

  temptation: 'Tentación',
  temptationHint: 'Lo que gana un tramposo con cada cooperador que se encuentra. Dos cooperadores ganan 1 cada uno.',
  window: 'El caleidoscopio vive entre 1,8 y 2.',
  speed: 'Velocidad',
  perSecond: (n) => (n === 1 ? '1 generación por segundo' : `${n} generaciones por segundo`),
  together: 'Todos cambian a la vez',
  fresh: 'Colorear a quien acaba de cambiar',
  next: 'Siguiente generación',

  // Palabras dibujadas en la imagen.
  key: {
    title: 'QUIÉN ES QUIÉN',
    cooperator: 'Coopera',
    cheater: 'Hace trampa',
    newCooperator: 'Empieza a cooperar',
    newCheater: 'Empieza a hacer trampa',
  },
  chart: {
    title: 'PARTE QUE COOPERA',
    estimate: 'Nowak y May: 31,8%',
    span: (n) => (n === 1 ? 'última generación' : `últimas ${n} generaciones`),
  },

  // Los números llegan ya escritos en el idioma de la página.
  inspect: {
    title: 'QUÉ HARÁ ESTE JUGADOR',
    hint: 'Señala a un jugador, o apunta con las flechas, para ver las puntuaciones a su alrededor.',
    player: (cheats, score) =>
      cheats
        ? `Este jugador hace trampa y su puntuación es ${score}.`
        : `Este jugador coopera y su puntuación es ${score}.`,
    best: (cheats, score) =>
      cheats
        ? `La mejor puntuación a su alrededor, contando la suya, es de un tramposo: ${score}.`
        : `La mejor puntuación a su alrededor, contando la suya, es de un cooperador: ${score}.`,
    tie: (score) =>
      `Un cooperador y un tramposo comparten la mejor puntuación, ${score}, así que este jugador sigue con su estrategia.`,
    next: (cheats) => (cheats ? 'Así que después hará trampa.' : 'Así que después cooperará.'),
  },

  status: (gen, percent) => `Generación ${gen} · el ${percent}% coopera`,
  settled: (gen, percent) => `Ya no cambia desde la generación ${gen} · el ${percent}% coopera`,
  repeating: (period, percent) => `Se repite cada ${period} generaciones · el ${percent}% coopera`,
  allCheat: (gen) => `Generación ${gen} · todos hacen trampa`,
  allCooperate: (gen) => `Generación ${gen} · todos cooperan`,
  stray: 'Aparece un tramposo en un lugar al azar.',

  guests: [
    {
      name: 'Robert May',
      note: 'En 1992, con Martin Nowak, dejé que unos jugadores en una cuadrícula copiaran a sus vecinos con más éxito. Los cooperadores sobrevivieron, en patrones que no dejaban de cambiar, sin memoria y sin la menor astucia.',
    },
    {
      name: 'Martin Nowak',
      note: 'Con Robert May, encontró el caleidoscopio de esta sala. Estudia cómo evoluciona la cooperación, de las células a las sociedades.',
    },
    {
      name: 'Albert Tucker',
      note: 'En 1950, al explicar a unos psicólogos de Stanford un juego de la RAND Corporation, lo conté como la historia de dos prisioneros. Y el nombre se quedó.',
    },
  ],

  insight: {
    title: '¿Por qué no ganan los tramposos?',
    html: `<p>Cada casilla es un jugador del <em>dilema del prisionero</em>. A dos cooperadores les va bien a los dos. A un tramposo que se encuentra con un cooperador le va aún mejor, y el cooperador no se lleva nada. Dos tramposos no se llevan nada. Haga lo que haga el otro jugador, hacer trampa da más, así que en una multitud donde todos se encuentran con todos, los tramposos deberían imponerse.</p>
<div class="insight-visual">cooperador + cooperador: 1 cada uno · tramposo + cooperador: la tentación para el tramposo, 0 para el cooperador · tramposo + tramposo: 0 cada uno</div>
<h3>Vecinos, no desconocidos</h3>
<p>Aquí cada jugador solo se encuentra con sus ocho vecinos, y luego copia a quien mejor le fue a su alrededor, incluido él mismo. Nadie recuerda, planea ni castiga. Un cooperador dentro de un grupo de cooperadores gana mucho, así que, agrupados, los cooperadores se protegen unos a otros. Un tramposo en el borde de un grupo gana más que nadie y le va dando mordiscos, pero un tramposo rodeado de tramposos no gana nada. Ningún bando puede ganar en todas partes.</p>
<h3>El caleidoscopio</h3>
<p>Martin Nowak y Robert May lo encontraron en 1992. Con una tentación entre 1,8 y 2, un tramposo en medio de 99 × 99 cooperadores crece hasta formar un patrón que conserva en cada paso toda la simetría del cuadrado y no deja de cambiar. Cualquier tentación dentro de esa franja da exactamente las mismas imágenes. Desde la mayoría de los comienzos al azar, la parte de cooperadores oscila alrededor de un tercio: Nowak y May la estimaron en 12 ln 2 − 8, alrededor del 31,8%. Por debajo de 1,8, los tramposos se quedan en bloques pequeños y líneas finas. Por encima de 2 se extienden, y desde un comienzo al azar se quedan con casi todo.</p>
<h3>No del todo para siempre</h3>
<p>Una cuadrícula de 9801 jugadores solo tiene un número finito de patrones, y la regla nunca cambia, así que tarde o temprano un patrón tiene que volver, y a partir de ahí todo se repite. En 2022, Te Wu, Feng Fu y Long Wang siguieron al tramposo solitario hasta que eso ocurrió: tras unos mil millones de generaciones, el patrón cae en un ciclo de cuatro pasos, con solo 96 cooperadores que giran en 16 grupitos. A cinco generaciones por segundo, habría que esperar unos seis años y medio.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>El caleidoscopio necesita que todos cambien en el mismo instante. En 1993, Bernardo Huberman y Natalie Glance señalaron que los jugadores reales no comparten ningún reloj: cuando cambian de uno en uno y en orden aleatorio, con estas tentaciones los tramposos se imponen en unas doscientas generaciones. Desactiva «Todos cambian a la vez» para verlo. Nowak, Sebastian Bonhoeffer y May respondieron en 1994 que, aun así, cooperadores y tramposos conviven en un amplio rango de tentaciones; aquí, prueba el cambio uno a uno con 1,6. Además, estos jugadores juegan cada partida una sola vez y no recuerdan nada, mientras que las personas y los animales recuerdan, perdonan y eligen con quién encontrarse. Así que la sala muestra una manera en que la cooperación puede durar: mantenerse unidos. No muestra que la gente sea buena, ni que los tramposos nunca salgan ganando.</p>
<p>Otra manera es encontrarse una y otra vez. En los torneos del juego repetido que organizó Robert Axelrod hacia 1980, la más sencilla de las estrategias presentadas, el Toma y daca de Anatol Rapoport (cooperar primero y después copiar la última jugada del otro), ganó las dos rondas. Eso no la convierte en la mejor estrategia: con errores y con otros rivales, la clasificación cambia. <em>The Evolution of Trust</em>, de Nicky Case, cuenta esa historia de maravilla.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Cada jugador juega una vez con cada vecino y una vez consigo mismo (la convención de Nowak y May). Así, la puntuación de un cooperador es el número de cooperadores de su bloque de 3 × 3, incluido él mismo (de 0 a 9), y la de un tramposo es la tentación b multiplicada por el número de cooperadores a su alrededor (de 0 a 8). Solo importan comparaciones como 8b frente a 9, así que el comportamiento solo cambia donde b cruza una fracción como 9/8, 9/5 o 2. Un tramposo solitario obtiene 8b, sus vecinos 8 y los cooperadores justo detrás de ellos 9, así que se queda con sus ocho vecinos cuando b es mayor que 9/8. Los bordes son fijos: un jugador en el borde simplemente tiene menos vecinos. Cuando el mejor cooperador y el mejor tramposo cercanos tienen exactamente la misma puntuación, aquí el jugador sigue con su estrategia (esto solo pasa con unas pocas tentaciones exactas, como 1,5 o 2).</p><p>Con «Todos cambian a la vez» desactivado, cada generación elige 9801 jugadores al azar, uno tras otro (algunos dos veces, otros ninguna); cada uno copia a quien tiene la mejor puntuación a su alrededor, tal como están las cosas en ese momento. Los patrones de esta sala se comprobaron casilla por casilla frente a un programa independiente, durante las primeras 300 generaciones.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1038/359826a0" target="_blank" rel="noopener">Nowak y May (1992), Evolutionary games and spatial chaos (en inglés)</a><a class="source-link" href="https://math.libretexts.org/Bookshelves/Applied_Mathematics/Agent-Based_Evolutionary_Game_Dynamics_(Izquierdo_Izquierdo_and_Sandholm)/03:_Spatial_interactions_on_a_grid/3.01:_Spatial_chaos_in_the_Prisoner's_Dilemma" target="_blank" rel="noopener">Izquierdo, Izquierdo y Sandholm, Spatial chaos in the Prisoner’s Dilemma (en inglés)</a><a class="source-link" href="https://arxiv.org/abs/chao-dyn/9307017" target="_blank" rel="noopener">Huberman y Glance (1993), Evolutionary games and computer simulations (en inglés)</a><a class="source-link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC43892/" target="_blank" rel="noopener">Nowak, Bonhoeffer y May (1994), Spatial games and the maintenance of cooperation (en inglés)</a><a class="source-link" href="https://arxiv.org/abs/2209.08267" target="_blank" rel="noopener">Wu, Fu y Wang (2022), Evolutionary games and spatial periodicity (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/The_Evolution_of_Cooperation" target="_blank" rel="noopener">The Evolution of Cooperation (Axelrod, en inglés)</a><a class="source-link" href="https://ncase.me/trust/" target="_blank" rel="noopener">Nicky Case, The Evolution of Trust (en inglés)</a></div>`,
  },
});
