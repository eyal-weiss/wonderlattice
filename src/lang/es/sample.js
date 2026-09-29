Wonderlattice.defineText('sample', 'es', {
  eyebrow: 'MUESTREO',
  name: 'Una cucharada de ciudad',
  tagline: 'Una encuesta enorme puede estar segura y equivocarse. Una pequeña al azar acierta más o menos.',
  title: 'Una cucharada de ciudad.',
  subtitle:
    'Naranja o azul: ¿qué prefiere la ciudad entera? Solo puedes preguntarle a una parte de la gente, así que prueba una encuesta grande y una pequeña.',
  field: 'Estadística · Muestreo · Error aleatorio y sesgo',
  sceneLabel: 'Encuestar a una ciudad de juguete',
  tip: 'Toca un barrio, o usa ← →, para preguntar solo allí · ↑ ↓ cambian el tamaño de la encuesta',
  actionLabel: 'Preguntar 50 veces',
  canvasLabel:
    'Un mapa de una pequeña ciudad cuyos habitantes prefieren el naranja o el azul, con las personas de la última encuesta iluminadas, junto a un gráfico de puntos con un punto por la estimación de cada encuesta. Toca un barrio, o usa las flechas izquierda y derecha, para preguntar solo allí. Las flechas arriba y abajo cambian a cuántas personas pregunta cada encuesta.',
  panelEyebrow: 'Elige cómo preguntar',
  whyLabel: '¿Por qué no ayuda preguntar a más gente?',
  nudge:
    'Pregunta 50 veces al azar. Luego pregunta a los vecinos. Dos nubes de puntos apretadas: ¿cuál acierta? Muestra la ciudad entera para averiguarlo.',
  connection: {
    html: '<strong>El azar, desde los dos extremos.</strong> Aquí adivinas una ciudad entera a partir de una cucharada. Con los dados raros, contar te dice exactamente qué harán muchas tiradas.',
    label: 'Tira los dados raros',
  },
  methodLabel: 'Cómo preguntar',
  methods: ['Al azar', 'Vecinos', 'Voluntarios'],
  sceneNames: ['Preguntar al azar', (hood) => `En ${hood}`, 'Quien conteste'],
  hoodLabel: 'Barrio',
  hoods: [
    'El Puerto',
    'Casco Viejo',
    'La Colina',
    'Los Molinos',
    'La Ribera',
    'El Mercado',
    'La Huerta',
    'La Estación',
    'Los Jardines',
    'Los Hornos',
    'Loma de los Faroles',
    'La Cordelería',
  ],
  sizeLabel: 'Personas en cada encuesta',
  reveal: 'Mostrar qué prefiere la ciudad entera',
  askOnce: 'Preguntar una vez',
  newCity: 'Una ciudad nueva',
  cityTitle: (n) => `La ciudad · ${n.toLocaleString('fr')} habitantes`,
  plotTitle: (n) => `Proporción que prefiere el naranja · un punto por encuesta de ${n.toLocaleString('fr')}`,
  plotTitleShort: 'Proporción naranja · un punto por encuesta',
  blueWins: 'gana el azul',
  orangeWins: 'gana el naranja',
  wholeCity: (pct) => (pct === null ? 'ciudad entera: ?' : `ciudad entera ${pct}%`),
  before: (name, n) => `○ Antes: ${name}, ${n.toLocaleString('fr')} cada una`,
  startHint: 'Presiona «Preguntar 50 veces»',
  ready: 'Listo para preguntar',
  surveys: (n) => (n === 1 ? '1 encuesta' : `${n.toLocaleString('fr')} encuestas`),
  noSurveys: 'Todavía no hay encuestas.',
  noEstimate: 'Cada encuesta añadirá un punto.',
  surveyLine: (count, n) =>
    `<strong>${count.toLocaleString('fr')}</strong> ${count === 1 ? 'encuesta' : 'encuestas'} de ${n.toLocaleString('fr')} ${n === 1 ? 'persona' : 'personas'}`,
  estimateLine: (mean, spread) =>
    spread === null
      ? `Esta dice que el ${mean}% prefiere el naranja.`
      : `En promedio dicen que el ${mean}% prefiere el naranja, y varían unos ${spread} puntos arriba o abajo.`,
  theoryLine: (n, se) => `Una muestra al azar de ${n.toLocaleString('fr')} oscila unos ±${se} puntos.`,
  truthHidden: 'La respuesta de la ciudad entera está oculta.',
  truthLine: (pct, miss) =>
    miss === null
      ? `La ciudad entera: ${pct}% naranja.`
      : `La ciudad entera: ${pct}% naranja. Error habitual: ${miss} puntos.`,
  randomNote: 'La encuesta puede preguntarle a cualquier persona de la ciudad.',
  hoodNote: (size, name) => `En ${name} viven ${size.toLocaleString('fr')} personas.`,
  hoodAll: (size, name) =>
    `En ${name} solo viven ${size.toLocaleString('fr')} personas, así que cada encuesta pregunta a todas.`,
  volunteerNote: (answer, total) =>
    `Solo cuentan quienes responden: ${answer.toLocaleString('fr')} de ${total.toLocaleString('fr')}. Los fans del naranja tienen más ganas de responder.`,
  volunteerAll: (answer) =>
    `Solo responden ${answer.toLocaleString('fr')} personas en total, así que cada encuesta recoge las respuestas de todas.`,
  presets: [
    {
      name: 'Una encuesta rápida al azar',
      note: '50 personas, cualquiera de la ciudad.',
    },
    {
      name: 'Preguntar a los vecinos',
      note: '50 personas, todas de un mismo barrio.',
    },
    {
      name: 'Una encuesta enorme y sesgada',
      note: '1\u202f000 respuestas de quien conteste.',
    },
  ],
  guests: [
    {
      name: 'Jerzy Neyman',
      note: 'En 1934 advirtió que elegir a mano distritos «típicos» es una apuesta. Elige al azar, defendía, y podrás decir cuánto podrías equivocarte.',
    },
  ],
  live: (n, se, hood, hoodOff, answerOff) =>
    `En tu ciudad, una muestra al azar de ${n.toLocaleString('fr')} oscila unos ±${se} puntos. ` +
    `Preguntar solo en ${hood} se desvía ${hoodOff} puntos, y contar a quien conteste se desvía ${answerOff}, por mucha gente a la que preguntes.`,
  insight: {
    title: '¿Por qué no ayuda preguntar a más gente?',
    html: `<p>Aquí cada encuesta elige a las personas al azar. Pero el azar solo puede elegir entre la gente a la que un método llega: toda la ciudad, un barrio o los habitantes que se molestan en contestar. Los estadísticos llaman a esa lista el <em>marco muestral</em>. Una elección al azar dentro del marco te informa sobre el marco, no sobre la ciudad.</p>
<h3>Oscilación y sesgo</h3>
<p>El <strong>error aleatorio</strong> es la oscilación de una encuesta a otra. Se reduce a medida que crece la muestra, como uno entre la raíz cuadrada de su tamaño: pregunta a cuatro veces más personas y la oscilación se reduce a la mitad. El <strong>sesgo</strong> es la distancia entre la respuesta del marco y la de la ciudad. Todas las encuestas del mismo marco lo comparten, así que preguntar a más gente no lo reduce. Solo te hace estar más seguro de la respuesta equivocada.</p>
<div class="insight-visual">error habitual² = oscilación² + sesgo²</div>
<p id="sample-live"></p>
<h3>Millones de respuestas, el ganador equivocado</h3>
<p>En 1936 la revista estadounidense <em>The Literary Digest</em> envió por correo más de diez millones de papeletas, sobre todo a nombres sacados de guías telefónicas y registros de automóviles. Volvieron más de 2.3 millones, menos de una de cada cuatro. Su recuento final daba a Alf Landon el 54% y a Franklin Roosevelt el 41%. El día de las elecciones, Roosevelt ganó con el 61%. Encuestas mucho más pequeñas de George Gallup y otros, que eligieron sus muestras con más cuidado, dieron como ganador a Roosevelt.</p>
<p>Medio siglo después, el politólogo Peverill Squire usó una encuesta de Gallup de 1937 que preguntaba a la gente si había recibido una papeleta del Digest y si la había devuelto. Descubrió que tanto la lista como las respuestas se inclinaban hacia Landon, y que juntas causaron el error. Si todos los de la lista hubieran respondido, la encuesta al menos habría acertado con el ganador.</p>
<h3>La oscilación, exactamente</h3>
<p>Para una muestra al azar de <em>n</em> personas de una ciudad de <em>N</em>, donde una proporción <em>p</em> prefiere el naranja, la oscilación típica (el error estándar) es √(<em>p</em>(1 − <em>p</em>)/<em>n</em>) × √((<em>N</em> − <em>n</em>)/(<em>N</em> − 1)). El segundo factor, la corrección por población finita, está porque a nadie se le pregunta dos veces. Aquí importa porque la ciudad es pequeña, y llega a cero cuando se pregunta a todos. La sala usa esta fórmula corregida.</p>
<details><summary>Qué deja fuera esta ciudad de juguete</summary><p>Dos colores, barrios repartidos al azar, habitantes que nunca cambian de opinión y una tasa de respuesta que solo depende del color. Las encuestas reales eligen a las personas de forma más astuta (Jerzy Neyman defendió en 1934 el muestreo al azar dentro de grupos, llamados estratos), luego ponderan las respuestas para que coincidan con lo que se sabe de la población y corrigen por quienes no respondieron. Las propias encuestas de Gallup de los años treinta llenaban cuotas de distintos tipos de personas, un método con sus propios defectos. El margen de error que se publica junto a una encuesta describe solo la oscilación aleatoria; no puede ver el sesgo.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1086/269085" target="_blank" rel="noopener">Squire: por qué falló la encuesta del Literary Digest de 1936 (1988, en inglés)</a><a class="source-link" href="https://doi.org/10.2307/2342192" target="_blank" rel="noopener">Neyman sobre el muestreo aleatorio frente al intencional (1934, en inglés)</a><a class="source-link" href="https://online.stat.psu.edu/stat506/Lesson02" target="_blank" rel="noopener">El error estándar de una proporción muestral (Penn State STAT 506, en inglés)</a></div>`,
  },
});
