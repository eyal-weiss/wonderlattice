/* La ducha que nunca se estabiliza · palabras para el visitante (es). */
Wonderlattice.defineText('shower', 'es', {
  eyebrow: 'RETROALIMENTACIÓN',
  name: 'La ducha que nunca se estabiliza',
  tagline: 'Demasiado fría, demasiado caliente, demasiado fría… y cuanto más lo intentas, peor.',
  title: 'La ducha que nunca se estabiliza.',
  subtitle:
    'El agua tarda un momento en subir por la tubería. El bañista impaciente pasa del agua helada al agua que quema; el bañista paciente da con la temperatura. Cambia la tubería, o toma tú el grifo.',
  field: 'Retroalimentación · Retardo · Un límite nítido en π/2',
  sceneLabel: 'En su punto: 38 °C · El grifo va de 10 °C a 55 °C',
  sceneNames: ['Dos bañistas, una tubería', 'Un bañista', 'Tu mano en el grifo'],
  tip: 'La tubería toma el color del agua que lleva dentro · ← → sobre la imagen cambian la tubería · Con «Tu mano», arrastra sobre la imagen o pulsa ← → para girar el grifo',
  soundOff: 'Activar el sonido',
  soundOn: 'Sonido activado · silenciar',
  noSound: 'El sonido no está disponible en este navegador. Aun así puedes mirar a los bañistas.',
  canvasLabel:
    'Dos bañistas de dibujos animados, cada uno bajo su ducha. Cada uno gira un grifo en la pared, y el agua sube por una tubería larga hasta la ducha, coloreada del azul del frío al rojo del calor, así que cada bañista nota un giro del grifo solo un momento después. Debajo, un gráfico muestra la temperatura que siente cada bañista durante los últimos 30 segundos, con una franja para la temperatura en su punto. Al principio el bañista impaciente oscila sin fin entre el agua helada y el agua que quema, mientras que el bañista paciente se estabiliza en 38 °C. Al lado, un mapa muestra qué combinaciones de impaciencia y longitud de tubería se estabilizan.',
  panelEyebrow: '¿Quién maneja el grifo?',
  whyLabel: '¿Por qué gana la paciencia?',
  nudge:
    'Fíjate en el bañista dorado: cada giro del grifo llega tarde, así que no para de pasarse. Acorta la tubería, y el impaciente se estabiliza antes. Luego prueba «Un bañista» y busca la impaciencia a partir de la cual empieza el vaivén.',
  connection: {
    html: '<strong>Reaccionar a lo que ves.</strong> Aquí, un bañista que reacciona a noticias viejas oscila sin fin. En Luciérnagas que se sincronizan, cada luciérnaga adelanta un poco su propio reloj cuando ve un destello, y todo el enjambre acaba a compás.',
    label: 'Ver las luciérnagas',
  },

  presets: [
    { name: 'Ni una oscilación', note: 'Tan suave que nunca se pasa.', badge: '1/e' },
    { name: 'En el filo de la navaja', note: 'El vaivén ni crece ni se apaga.', badge: 'π/2' },
    { name: 'Una tubería corta', note: 'Ahora gana el bañista impaciente.', badge: '½ s' },
  ],

  modeLabel: '¿Quién maneja el grifo?',
  // Por número de modo: los dos bañistas lado a lado, un bañista, el visitante.
  modes: ['Dos bañistas', 'Un bañista', 'Tu mano'],
  // Escrito bajo cada ducha: el bañista impaciente y el paciente, el bañista solo, y el visitante.
  bathers: ['Impaciente', 'Paciente', 'Bañista', 'Tú'],

  pipe: 'Longitud de la tubería',
  pipeHint: 'Los segundos que tarda el agua en llegar del grifo a la ducha.',
  seconds: ' s',
  impatience: 'Impaciencia',
  impatienceHint: 'Lo deprisa que el bañista gira el grifo por cada grado de error que nota en el agua.',
  hand: 'Tu grifo',
  handHint: 'Apunta a 38 °C. El agua que sientes salió del grifo hace un momento.',
  cold: 'frío',
  hot: 'caliente',
  handValue: (percent) => `${percent}% del recorrido hacia el agua caliente`,

  readout: {
    product: 'Impaciencia × tubería',
    sum: (k, d, kd) => `${k} × ${d} s = ${kd}`,
    verdicts: ['Se estabiliza sin pasarse', 'Oscila y luego se estabiliza', 'Nunca se estabiliza'],
    smooth: 'El agua sube poco a poco hasta 38 °C y se queda ahí.',
    fades: (share, period) => `Cada oscilación mide el ${share} de la anterior, y hay una cada ${period} s.`,
    edge: (period) =>
      `Justo en la línea: el vaivén mantiene su tamaño, uno cada ${period} s, cuatro veces el retraso de la tubería.`,
    grows: (ratio, period) =>
      `Cada vaivén es ${ratio} veces el anterior, uno cada ${period} s, hasta que el grifo llega a sus topes.`,
    limit: (d, limit) =>
      `Con una tubería de ${d} s, cualquier impaciencia por debajo de ${limit} se estabiliza: es π/2 ÷ ${d}.`,
    hands: (d) => `El agua que sientes salió del grifo hace ${d} s. Intenta mantenerla en 38 °C.`,
  },

  status: (text, seconds) => `${seconds === 1 ? 'Va' : 'Van'} ${text} ${seconds === 1 ? 'segundo' : 'segundos'}`,
  // Por modo: el agua que se siente ahora mismo, junto a la imagen.
  now: [
    (eager, patient) =>
      `Ahora mismo el bañista impaciente tiene el agua a ${eager}, y el bañista paciente, a ${patient}.`,
    (water) => `Ahora mismo el bañista tiene el agua a ${water}.`,
    (water) => `Ahora mismo tienes el agua a ${water}.`,
  ],
  // Con un espacio de no separación, para que una temperatura nunca se parta entre dos líneas.
  degrees: (value) => `${value} °C`,
  announce: {
    race: (eager, patient) =>
      `A los 15 segundos, el bañista impaciente tiene el agua a ${eager} y sigue oscilando; el bañista paciente, a ${patient}.`,
    one: (water, verdict) => `A los 15 segundos el agua está a ${water}. ${verdict}.`,
  },

  // Palabras dibujadas en la imagen.
  labels: {
    seconds: 'segundos',
    justRight: 'en su punto',
    tap: 'grifo',
    // El nombre de un bañista y la temperatura que siente; cada idioma puede cambiar el orden.
    tag: (name, value) => `${name} ${value}`,
    mapTitle: '¿Quién se estabiliza?',
    mapX: 'tubería, segundos',
    mapY: 'impaciencia',
    regions: ['sin oscilar', 'oscila y se estabiliza', 'nunca se estabiliza'],
    safe: (limit) => `estable bajo ${limit}`,
    drag: 'Arrastra sobre la imagen para girar el grifo',
    onYou: 'Sobre ti',
    inPipe: 'En camino',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'En 1868, su artículo «On Governors» usó las matemáticas para preguntarse cuándo se estabiliza una máquina que se corrige a sí misma, y cuándo sus correcciones oscilan cada vez más.',
    },
    {
      name: 'Nicolas Minorsky',
      note: 'Observó que los timoneles gobiernan según el error, según cuánto tiempo lleva y según lo rápido que cambia, y en 1922 convirtió eso en una regla para gobernar barcos automáticamente.',
    },
  ],

  insight: {
    title: '¿Por qué gana la paciencia?',
    html: `<p>El bañista reacciona al agua que siente, pero esa agua salió del grifo hace un momento. Gira el grifo hacia el calor y todavía no cambia nada, así que lo gira más. Cuando por fin llega el agua caliente, el grifo está demasiado caliente, y a la vuelta pasa lo mismo. El bañista impaciente siempre está corrigiendo un error que ya está en camino de arreglarse.</p>
<div class="insight-visual">Impaciencia × tubería por debajo de 1/e ≈ 0,37: ni una oscilación · por debajo de π/2 ≈ 1,57: oscilaciones que se apagan · por encima de π/2: un vaivén que nunca acaba</div>
<h3>Solo importa el producto</h3>
<p>Supongamos que el bañista gira el grifo <em>k</em> grados por segundo por cada grado de error que nota en el agua, y que el agua tarda <em>d</em> segundos en llegar. Que la ducha se estabilice depende solo de <em>k</em> × <em>d</em>. Así que una tubería más larga pide una mano más suave: la mayor impaciencia que todavía se estabiliza es π/2 ÷ <em>d</em>. Con una tubería de dos segundos, el 0,3 × 2 = 0,6 del bañista paciente se estabiliza y el 0,9 × 2 = 1,8 del bañista impaciente nunca lo hace. Acorta la tubería a medio segundo, y el bañista impaciente se estabiliza primero, en menos de dos segundos.</p>
<h3>Justo en la línea</h3>
<p>Exactamente en <em>k</em> × <em>d</em> = π/2 el vaivén ni crece ni se apaga, y un vaivén completo tarda cuatro veces lo que tarda el agua en llegar. El mismo límite aparece siempre que alguien actúa según noticias viejas, como un termostato cuyo radiador tarda en calentarse, o un timonel que gobierna un barco grande. Un remedio clásico es predecir: el predictor de Smith (O. J. M. Smith, 1957) usa un modelo del retraso para calcular lo que ya está en camino. Puedes probarlo aquí. Con «Tu mano», mira el color de la tubería en vez del agua que cae sobre el bañista.</p>
<h3>Lo que esto deja fuera</h3>
<p>Las personas reales no reaccionan de forma tan regular, y los grifos mezcladores reales no cambian la temperatura de manera uniforme al girarlos. Aquí el agua sube por la tubería como un tapón, sin mezclarse ni enfriarse. Más allá de π/2 los vaivenes de la ecuación crecen sin límite; los topes del grifo, en 10 °C y 55 °C, convierten ese crecimiento en un vaivén constante entre ellos, así que el tamaño del vaivén que ves viene de los topes, no de la ecuación. Muchas calefacciones domésticas simplemente se encienden y se apagan, algo que esta sala no muestra.</p>
<details><summary>Las matemáticas, si las quieres</summary><p>Sea <em>e</em>(<em>t</em>) lo lejos que está el grifo de su punto. El agua que se siente en el instante <em>t</em> salió del grifo en <em>t</em> − <em>d</em>, así que el bañista gira el grifo al ritmo <em>e</em>′(<em>t</em>) = −<em>k</em>·<em>e</em>(<em>t</em> − <em>d</em>): una ecuación diferencial con retardo, que Chris Budd llama la ecuación de la ducha. Probar con <em>e</em> = e<sup><em>λt</em></sup> da <em>λ</em> = −<em>k</em>·e<sup>−<em>λd</em></sup>, así que <em>λd</em> = W(−<em>kd</em>), donde W es la función W de Lambert. La raíz que más importa sale de la rama principal de W. Es real para <em>kd</em> ≤ 1/e, así que el agua nunca se pasa. Más allá es compleja, lo que significa oscilaciones, y su parte real se vuelve positiva en <em>kd</em> = π/2, donde W(−π/2) = <em>i</em>π/2: un vaivén de periodo 4<em>d</em>. La sala avanza la ecuación paso a paso, 60 veces por segundo, con los topes del grifo; los números del panel salen de W.</p></details>
<div class="sources"><a class="source-link" href="https://plus.maths.org/content/shower-equation" target="_blank" rel="noopener">C. Budd, «The shower equation», Plus Magazine (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Delay_differential_equation" target="_blank" rel="noopener">Ecuación diferencial con retardo (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lambert_W_function" target="_blank" rel="noopener">Función W de Lambert (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Smith_predictor" target="_blank" rel="noopener">Predictor de Smith (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/PID_controller#History" target="_blank" rel="noopener">Controlador PID: historia (Maxwell, Minorsky) (en inglés)</a></div>`,
  },
});
