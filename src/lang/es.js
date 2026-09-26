/*
 * Español (es). Traducción al español neutro (tú, ustedes), pensada para leerse igual de bien en América Latina y en
 * España. Revisa con: npm run i18n:check
 * - Las cadenas escritas como funciones, como (n) => `${n} tiradas`, reciben números o nombres: conserva las partes
 *   ${…} y muévelas donde las necesite la frase.
 * - Las claves que terminan en Html pueden llevar marcas como <strong> o <em>; mantén las etiquetas equilibradas.
 */
Wonderlattice.defineLanguage('es', { name: 'Español', dir: 'ltr', speech: 'es' });

Wonderlattice.defineText('app', 'es', {
  themes: {
    shape: {
      name: 'Forma y espacio',
      blurb: 'Curvas, superficies y los espacios donde viven.',
    },
    chance: {
      name: 'Azar y evidencia',
      blurb: 'Razonar bien cuando cada suceso, por separado, es impredecible.',
    },
    games: {
      name: 'Juegos y acertijos',
      blurb: 'La estructura oculta detrás de juegos conocidos.',
    },
    making: {
      name: 'Hecho a mano',
      blurb: 'Matemáticas que puedes tejer, doblar y guardar.',
    },
    life: {
      name: 'Patrones vivos',
      blurb: 'Orden que surge de muchas interacciones pequeñas.',
    },
    signals: {
      name: 'Señales y redes',
      blurb: 'Ondas, mensajes y decisiones que viajan.',
    },
  },
  roomBar: {
    previous: (name) => `Experimento anterior: ${name}`,
    next: (name) => `Experimento siguiente: ${name}`,
  },
  language: 'Idioma',
  pageTitle: (room) => `${room} · Wonderlattice`,
  stage: {
    makeItYours: 'Hazlo tuyo',
    keep: '✧ Guardar este momento',
    nudge: 'Una pequeña pista',
    guestLabel: 'Un matemático de visita',
    canvasRole: 'imagen interactiva',
    pause: 'Pausa',
    play: 'Reproducir',
    saved: 'Tu escena está lista para guardar.',
    saveFailed: 'No se pudo guardar esta imagen.',
    shareText: (title) => `Wonderlattice · ${title}`,
    linkCopied: 'Enlace de la exploración copiado.',
    settingsCopied: 'Ajustes de la exploración copiados.',
    linkDescription: 'Copia este enlace para volver a abrir estos ajustes.',
    settingsDescription: 'Copia estos ajustes para recrear esta exploración.',
  },
  narration: {
    listen: 'Escuchar esta idea',
    stop: 'Detener la narración',
    unavailable: 'La narración no está disponible en este navegador. Aquí tienes el texto completo para leer.',
    symbols: {
      '−': ' menos ',
      '×': ' por ',
      '→': ' a ',
      '↔': ' y ',
      '≈': ' aproximadamente ',
      '±': ' más o menos ',
      '²': ' al cuadrado ',
      '′': ' prima ',
      '√': ' raíz ',
      φ: ' fi ',
      θ: ' zeta ',
      π: ' pi ',
      ᵀ: ' transpuesta ',
      '∞': ' infinito ',
      '≤': ' como máximo ',
      '≥': ' como mínimo ',
      '|': ' ',
      '·': ' por ',
      '↗': ' ',
      '✧': ' ',
      '✕': ' ',
    },
  },
  guests: {
    eyebrowPortrait: 'Historia de las matemáticas · retrato histórico',
    eyebrowSketch: 'Historia de las matemáticas · un boceto divertido',
    story: 'Su historia ↗',
    storyLabel: (name) => `Su historia: leer sobre ${name} (se abre en una pestaña nueva)`,
    portrait: 'Retrato ↗',
    portraitLabel: (name) => `Retrato: la fuente del retrato de ${name} (se abre en una pestaña nueva)`,
    photo: (credit) => `Foto: ${credit}`,
    another: 'Conocer a otro matemático',
  },
  trail: {
    bridges: {
      'motion-waves': 'Un círculo que gira puede dejar una onda a su paso.',
      'flock-traffic': 'Una multitud puede sorprenderse a sí misma, una decisión local a la vez.',
      'ribbon-motion': 'Sigue un punto y una forma puede mostrarte otro lado.',
      'loom-flock': 'Una regla pequeña, repetida en todas partes, puede dar forma al conjunto.',
    },
    unreadable: 'No se pudo leer el recorrido guardado en este navegador. Puedes importar una exportación anterior.',
    storageFull: 'No se pudo guardar aquí. Revisa el espacio disponible en el navegador o exporta tu recorrido actual.',
    stillAlt: 'Imagen fija de esta exploración',
    full: (max) => `Tu recorrido tiene ${max} momentos. Expórtalo o quita uno antes de guardar otro.`,
    notSaved: 'No se pudo guardar esta escena.',
    savedAlt: (room) => `Vista guardada de ${room}`,
    onReturning: 'Al volver',
    revisit: 'Volver a visitar',
    remove: 'Quitar',
    empty: 'Tu recorrido está vacío. Guarda algo que te llame la atención y vuelve a ello cuando quieras.',
    explore: (room) => `Explorar «${room}»`,
    returnTitle: (room) => `Un momento que guardaste · ${room}`,
    thenYouNoticed: (note) => `Entonces notaste: «${note}»`,
    noticeNow: '¿Qué notas ahora?',
    tooLarge: 'Elige una exportación de recorrido de Wonderlattice de menos de 2.4 MB.',
    imported: 'Recorrido importado. Tu recorrido anterior se reemplazó.',
    invalid: 'Ese archivo no es una exportación válida de un recorrido de Wonderlattice. Tu recorrido no cambió.',
    thoughtSaved: 'Tu nueva idea está guardada. Vuelve a ella cuando quieras.',
  },
});

Wonderlattice.defineText('motion', 'es', {
  eyebrow: 'GEOMETRÍA',
  name: 'Pinta con movimiento',
  tagline: 'Dos brazos que giran y un lápiz dibujan flores, estrellas y tramas.',
  presets: [
    {
      name: 'Flor silvestre',
      note: 'Seis pétalos, una sola línea',
      nudge: 'Prueba a cambiar −5 por −5.1. Un cambio diminuto le da a la flor un futuro muy distinto.',
    },
    {
      name: 'Órbita de seda',
      note: 'Un lazo dentro de otro',
      nudge: 'Activa los brazos en movimiento. Observa cómo cada círculo sencillo se suma al otro.',
    },
    {
      name: 'Estornino',
      note: 'Una estrella de bordes suaves',
      nudge: 'Lleva el alcance del lápiz hacia el 50%. Mira cómo las esquinas suaves se vuelven lazos profundos.',
    },
    {
      name: 'Luz tejida',
      note: 'Toma el camino largo',
      nudge: 'Usa «Dibujarlo todo» para ver la trama completa. Después prueba −4 para ver a un pariente más sencillo.',
    },
    {
      name: 'Casi un círculo',
      note: 'Un cambio diminuto, una historia larga',
      nudge: 'Dos velocidades casi iguales se separan poco a poco. Dibújalo todo para ver su reencuentro completo.',
    },
    {
      name: 'Cintas',
      note: 'Encuentra el ritmo escondido',
      nudge: 'Prueba otro ángulo inicial. El ritmo sigue igual mientras el dibujo gira.',
    },
  ],
  paletteNames: ['Aurora', 'Brasa', 'Glaciar', 'Luz de luna'],
  names: {
    own: 'Tu propia órbita',
    surprise: 'Un accidente feliz',
    shared: 'Una órbita compartida',
  },
  nudges: {
    whole:
      'Prueba a alejar la rotación de un número entero. Mira cómo el trazo toma un camino más largo de vuelta a casa.',
    traceAll: 'Prueba «Dibujarlo todo» para ver el patrón entero. Aquí todos los ajustes terminan cerrando su lazo.',
    surprise: 'Algo nuevo, solo para ti. Cambia una cosa y mira adónde te lleva.',
    shared: 'Alguien te dejó un patrón. Cambia una cosa para hacerlo tuyo.',
    revisit: 'Un patrón conocido todavía puede sorprenderte. Cambia una cosa y vuelve a mirar.',
  },
  status: {
    complete: 'El lazo se cerró',
    oneTurn: 'Una vuelta. Un mundo entero.',
    turns: (n) => `${n} vueltas exteriores para reencontrarse`,
  },
  explainStill:
    'El brazo interior mantiene su dirección mientras gira el exterior. El lápiz traza un círculo desplazado.',
  explain: (k, outer, inner, opposite) =>
    `A ${k}×, los dos brazos vuelven a su posición inicial después de ${outer} ${outer === 1 ? 'vuelta exterior' : 'vueltas exteriores'} y ${inner} ${inner === 1 ? 'vuelta interior' : 'vueltas interiores'}. ${opposite ? 'Giran en sentidos opuestos.' : 'Giran en el mismo sentido.'}`,
  play: {
    pause: 'Pausa',
    play: 'Reproducir',
    replay: 'Repetir',
  },
  focus: {
    enter: 'Entrar en la vista sin distracciones',
    leave: 'Salir de la vista sin distracciones',
    title: 'Vista sin distracciones',
  },
  rotationRange: 'Elige una rotación entre −10 y 10.',
  saved: 'Tu dibujo está listo para guardar.',
  saveFailed: 'No se pudo guardar la imagen. Inténtalo de nuevo.',
  shareText: (k, r, p, ink) =>
    `Wonderlattice · Pinta con movimiento\nRotación interior: ${k}×\nAlcance del lápiz: ${r}%\nÁngulo inicial: ${p}°\nTinta: ${ink}`,
  linkCopied: 'Enlace del patrón copiado.',
  settingsCopied: 'Ajustes del patrón copiados.',
  linkDescription: 'Copia este enlace para volver a abrir el mismo patrón.',
  settingsDescription: 'Copia estos ajustes para recrear tu patrón.',
  guests: [
    {
      name: 'Emmy Noether',
      note: 'Una simetría escondida puede revelar algo que nunca cambia.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Los círculos y las exponenciales comparten un baile de lo más elegante.',
    },
  ],
});

Wonderlattice.defineText('waves', 'es', {
  eyebrow: 'ONDAS · SONIDO',
  name: 'Escucha la forma',
  tagline: 'Dos tonos se combinan en pulsaciones, silencio y un retrato que da vueltas.',
  title: 'Escucha la forma.',
  subtitle: 'Dos tonos. Un poco de distancia entre ellos. Escucha lo que cambia.',
  field: 'Ondas · Razones · Interferencia',
  sceneLabel: 'Una conversación en ondas',
  sceneName: 'Dos tonos, juntos',
  tip: 'Modelo de ondas en cámara lenta · El sonido suena a su altura real',
  actionLabel: 'Activar el sonido',
  canvasLabel: 'Dos ondas senoidales y su señal combinada. Elige «Retrato circular» para verlas de otra manera.',
  panelEyebrow: 'Escucha y mira',
  whyLabel: '¿Por qué pasa esto?',
  nudge:
    'Prueba «Casi afinados». Oye cómo el volumen crece y se apaga cuando dos tonos cercanos entran y salen de sincronía.',
  connection: {
    html: '<strong>Los círculos se vuelven ondas.</strong> La altura de un punto que da vueltas en un círculo sigue una onda senoidal. Combina movimientos circulares y estarás de vuelta en Pinta con movimiento.',
    label: 'Pinta con estas ideas',
  },
  presets: [
    {
      name: 'Una quinta justa',
      note: 'Una relación sencilla de 3:2.',
    },
    {
      name: 'Casi afinados',
      note: 'Dos tonos cercanos crean un pulso.',
    },
    {
      name: 'El sonido del silencio',
      note: 'Ondas iguales, desfasadas media vuelta.',
    },
  ],
  soundOff: 'Activar el sonido',
  soundOn: 'Silenciar',
  noSound: 'El sonido no está disponible en este navegador. Aun así puedes explorar las ondas.',
  firstTone: 'Primer tono',
  secondTone: 'Segundo tono',
  secondToneHint: 'En relación con el primer tono.',
  phase: 'Fase inicial',
  volume: 'Volumen',
  hz: ' Hz',
  view: 'Otra forma de verlo',
  viewGroup: 'Vista de las ondas',
  viewWaves: 'Sumar ondas',
  viewPortrait: 'Retrato circular',
  beatDetail: (f, g, d) => `Tus tonos: ${f} Hz y ${g} Hz. La diferencia entre sus frecuencias es de ${d} Hz.`,
  status: (f, g) => `${f} Hz + ${g} Hz`,
  labels: {
    a: (f) => `A · ${f} Hz`,
    b: (f) => `B · ${f} Hz`,
    sum: 'A + B · COMBINADAS',
    firstTone: 'PRIMER TONO →',
    secondTone: 'SEGUNDO TONO ↑',
  },
  guests: [
    {
      name: 'Jules Lissajous',
      note: 'Dos vibraciones sencillas pueden dibujar un lazo sorprendentemente elaborado.',
    },
    {
      name: 'Joseph Fourier',
      note: 'Muchas ondas sencillas pueden esconderse dentro de un sonido complicado.',
    },
  ],
  insight: {
    title: 'Cuando las ondas se encuentran.',
    html: `<p>Un tono es una onda suave que se repite. Dos tonos se suman: en cada instante, sus desplazamientos se refuerzan o se contrarrestan. La línea brillante de abajo es su suma.</p>
<h3>Un ritmo dentro de dos tonos</h3>
<p>Cuando dos frecuencias están cerca, su suma se hace más fuerte y más débil una y otra vez. Esos pulsos se llaman <em>pulsaciones</em> (o batidos). Su ritmo es la diferencia entre las dos frecuencias.</p>
<div class="insight-visual" id="beat-detail"></div>
<h3>Dos sonidos pueden hacer silencio</h3>
<p>Elige «El sonido del silencio». Dos ondas iguales desfasadas medio ciclo se anulan en esta mezcla electrónica. En el mundo real, la anulación depende de dónde escuches y de cómo te lleguen las ondas.</p>
<h3>Mira de lado</h3>
<p>Prueba «Retrato circular». Usamos la primera onda para la posición horizontal y la segunda para la vertical. La figura de Lissajous que resulta convierte una relación entre ritmos en una forma.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>A(t) = sin(2πft)<br>B(t) = sin(2πfrt + φ)<br>La señal combinada es A(t) + B(t).</p><p>El modelo en cámara lenta conserva la razón entre las frecuencias y la fase inicial. Los tonos audibles suenan a las alturas indicadas. Las razones sencillas se repiten enseguida; dos alturas cercanas pero distintas producen pulsaciones.</p></details>
<div class="sources"><a class="source-link" href="https://www.physicsclassroom.com/class/sound/Lesson-3/Interference-and-Beats" target="_blank" rel="noopener">Explora la interferencia y las pulsaciones (en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('flock', 'es', {
  eyebrow: 'EMERGENCIA',
  name: 'Una mente de muchos',
  tagline: 'Sin líder, solo vecinos: guía una bandada y ponla en movimiento.',
  title: 'Una mente de muchos.',
  subtitle: 'Sin líder. Solo vecinos. Pon en movimiento un pequeño mundo.',
  field: 'Sistemas dinámicos · Emergencia',
  sceneLabel: 'Un mundo de decisiones locales',
  sceneName: 'El colectivo en movimiento',
  tip: 'Toca o arrastra para guiar la bandada · Las flechas mueven tu toque y Escape lo suelta · Los bordes se conectan',
  actionLabel: 'Dispersar la bandada',
  canvasLabel:
    'Una bandada de marcas en movimiento. Toca, arrastra o usa las flechas para guiarla. Presiona Escape para soltarla.',
  panelEyebrow: 'Reglas locales',
  whyLabel: '¿Quién manda aquí?',
  nudge: 'Baja «Seguir la dirección» a cero. ¿Puede un grupo mantenerse unido sin ponerse de acuerdo sobre adónde ir?',
  connection: {
    html: '<strong>Un patrón sin planificador.</strong> Aquí, una bandada entera surge de pequeñas interacciones. En Escucha la forma, una onda nueva surge al sumar dos más sencillas.',
    label: 'Mira cómo se combinan las ondas',
  },
  presets: [
    {
      name: 'En compañía',
      note: 'Encontrar una dirección común.',
    },
    {
      name: 'Cada uno a lo suyo',
      note: 'Que manden los caminos individuales.',
    },
    {
      name: 'Muy juntos',
      note: 'Unión sin mucho acuerdo.',
    },
  ],
  align: 'Seguir la dirección',
  cohesion: 'Mantenerse juntos',
  separate: 'Guardar distancia',
  influence: 'Tu toque',
  attract: 'Atraer',
  repel: 'Repeler',
  trails: 'Dejar estelas de luz',
  neighbors: 'Mostrar un vecindario',
  agreement: 'Acuerdo de dirección',
  status: (n) => `${n} decisiones individuales`,
  guests: [
    {
      name: 'John Conway',
      credit: 'Thane Plambeck (recortada)',
      note: 'Su Juego de la vida también crea sorpresas a partir de reglas locales diminutas.',
    },
    {
      name: 'Alan Turing',
      note: 'Su modelo de patrones mostró cómo los cambios locales pueden crear manchas y rayas.',
    },
  ],
  insight: {
    title: '¿Quién manda aquí?',
    html: `<p>Nadie. Cada marca en movimiento solo mira a sus vecinos cercanos y sigue tres tendencias: no amontonarse, seguir su dirección y mantenerse cerca.</p>
<div class="insight-visual">Interacciones individuales → movimiento colectivo</div>
<h3>El patrón vive entre los individuos</h3>
<p>Ninguna marca conoce la forma completa de la bandada. Puede surgir un movimiento coherente porque cada una responde a una pequeña parte del grupo. Tu cursor añade una atracción o una repulsión desde fuera.</p>
<h3>Un modelo, no un animal completo</h3>
<p>Esta es una versión simplificada del modelo Boids de Craig Reynolds. Capta algunos rasgos visuales de las bandadas y los bancos de peces, pero no explica cada decisión que toman las aves o los peces reales.</p>
<h3>Mira con los ojos de uno</h3>
<p>Activa «Mostrar un vecindario». El círculo marca hasta dónde percibe un individuo; las líneas apuntan a los vecinos que lo influyen. Los bordes opuestos están conectados, así que un vecino puede estar cerca al otro lado de un borde.</p>
<details><summary>¿Qué mide el «acuerdo»?</summary><p>Promediamos todos los vectores de dirección unitarios y tomamos la longitud del resultado. Cerca del 100% significa que todos apuntan más o menos hacia el mismo lado. Cerca de cero significa que las direcciones casi se anulan. Es una descripción de la bandada en este momento, no una puntuación.</p><p>Cada paso combina las tendencias de separación, alineación y cohesión, y luego limita la velocidad. Todos los individuos se actualizan a partir del mismo estado anterior.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds sobre Boids (en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('ribbon', 'es', {
  eyebrow: 'TOPOLOGÍA · 3D',
  name: '¿Dónde está el otro lado?',
  tagline: 'Dale media vuelta a una cinta y uno de sus lados desaparece.',
  title: '¿Dónde está el otro lado?',
  subtitle: 'Gira una cinta en el espacio. Sigue su borde. Deja que una torsión te sorprenda.',
  field: 'Topología · Superficies · 3D',
  sceneLabel: 'Una tira corriente, un viaje extraño',
  sceneName: 'La cinta de Möbius',
  tip: 'Arrastra para girar · Las flechas o los botones de giro también mueven la vista',
  actionLabel: 'Seguir el borde',
  canvasLabel: 'Una cinta tridimensional. Arrastra o usa las flechas para girarla.',
  panelEyebrow: 'Gira y sigue',
  whyLabel: '¿Adónde se fue el otro lado?',
  nudge:
    'Observa al viajero dorado. Con media torsión, necesita dar dos vueltas alrededor del hueco para volver a su punto de partida.',
  connection: {
    html: '<strong>Hazla de verdad.</strong> Toma una tira de papel, dale media vuelta a un extremo y pega los dos extremos con cinta adhesiva. Traza una línea por el centro sin levantar el lápiz.',
    label: 'Sigue otro tipo de lazo',
  },
  presets: [
    {
      name: 'Sin torsión',
      note: 'Un anillo de siempre, con dos bordes.',
    },
    {
      name: 'Media torsión',
      note: 'Un solo lado continuo. Un solo borde.',
    },
    {
      name: 'Una torsión completa',
      note: 'Vuelven los dos bordes.',
    },
  ],
  twists: 'Tuerce la cinta',
  twistOptions: ['Sin torsión · un anillo', 'Media torsión · Möbius', 'Torsión completa · un anillo'],
  width: 'Ancho de la cinta',
  zoom: 'Mirar de cerca',
  spin: 'Dejar que gire',
  walk: 'Mostrar al viajero',
  edges: 'Resaltar los bordes',
  turn: 'Girar la vista',
  turnLeft: 'Girar la vista a la izquierda',
  turnRight: 'Girar la vista a la derecha',
  tiltUp: 'Inclinar la vista hacia arriba',
  tiltDown: 'Inclinar la vista hacia abajo',
  nameOneSided: 'La cinta de Möbius',
  nameTwoSided: 'El anillo torcido',
  statusOneSided: 'Un lado · un borde',
  statusTwoSided: 'Dos lados · dos bordes',
  showEdges: 'Seguir el borde',
  hideEdges: 'Ocultar los bordes',
  guests: [
    {
      name: 'August Möbius',
      note: 'Con media vuelta, preguntar por «el otro lado» se vuelve una pregunta con trampa.',
    },
    {
      name: 'Johann Listing',
      note: 'Él también estudió superficies de un solo lado. La historia tiene más de un nombre.',
    },
  ],
  insight: {
    title: 'Una torsión cambia el viaje.',
    html: `<p>Une una tira de papel en un anillo y tendrás dos lados y dos bordes separados. Dale media vuelta a un extremo antes de unirlo y algo cambia: puedes llegar a lo que parecía el otro lado sin cruzar ningún borde.</p>
<div class="insight-visual">La banda de Möbius tiene un solo lado continuo y un solo borde cerrado.</div>
<h3>Sigue al viajero dorado</h3>
<p>El viajero empieza lejos de la línea central. En una cinta de Möbius, una vuelta alrededor del hueco lo lleva a la posición opuesta a lo ancho. Una segunda vuelta lo devuelve al inicio. Nunca salta de un lado a otro de la cinta.</p>
<h3>Cuenta los bordes</h3>
<p>«Seguir el borde» resalta el contorno. Con media torsión, los dos bordes aparentes forman un único lazo continuo. Sin torsión o con una torsión completa, son dos lazos separados, dibujados en colores distintos y uno de ellos con trazo discontinuo.</p>
<h3>Otra manera de ver la forma</h3>
<p>La topología estudia las propiedades que sobreviven cuando se dobla y se estira algo sin romperlo. Girar este objeto en la pantalla cambia tu punto de vista, pero su único lado sigue siendo único.</p>
<details><summary>¿Cómo se dibuja la superficie?</summary><p>Para el ángulo u y la coordenada de ancho v:<br>x = (R + v cos(nu/2)) cos(u)<br>y = (R + v cos(nu/2)) sin(u)<br>z = v sin(nu/2)</p><p>n cuenta las medias torsiones. Si n es impar, sale una banda de Möbius; si es par, una banda de dos lados. Es una superficie paramétrica proyectada en el lienzo, con las caras ordenadas por profundidad. El sombreado translúcido deja ver al viajero a través de la superficie.</p></details>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/MoebiusStrip.html" target="_blank" rel="noopener">Explora la banda de Möbius (en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('traffic', 'es', {
  eyebrow: 'TEORÍA DE JUEGOS',
  name: 'El atajo tentador',
  tagline: 'Una carretera nueva que hace más lento a cada conductor.',
  title: 'El atajo tentador.',
  subtitle: 'Una carretera nueva parece un regalo. Ábrela y mira qué pasa.',
  field: 'Redes · Teoría de juegos · Una pequeña sorpresa',
  sceneLabel: 'Una ciudad · Muchas decisiones privadas',
  sceneName: 'El cruce de la ciudad',
  tip: 'Los marcadores en movimiento muestran proporciones del tráfico, no vehículos individuales',
  actionLabel: 'Abrir el atajo',
  canvasLabel: 'Una red de carreteras con sentido. Abre o cierra el atajo del medio y cambia el número de conductores.',
  panelEyebrow: 'Cambia una carretera',
  whyLabel: '¿Cómo puede pasar eso?',
  nudge:
    'Empieza con 4\u202f000 conductores. Abre el atajo. Luego prueba con mucho menos tráfico. ¿La carretera es siempre una mala idea?',
  connection: {
    html: '<strong>Reglas sencillas, resultado inesperado.</strong> En Una mente de muchos, una bandada crea un patrón a partir de interacciones locales. Aquí, cada conductor que elige una ruta rápida puede hacer más lento el viaje de todos.',
    label: 'Sigue a otra multitud',
  },
  presets: [
    {
      name: 'Calles tranquilas',
      note: 'Puede que el atajo ayude.',
    },
    {
      name: 'Una ciudad llena',
      note: 'Prueba la sorpresa.',
    },
    {
      name: 'Máximo tráfico',
      note: '¿Puede el atajo dejar de importar?',
    },
  ],
  demand: 'Conductores que cruzan la ciudad',
  demandHint: '¿Cuánta gente hay en la ciudad?',
  drivers: (n) => n.toLocaleString('fr').replace(',', '.'),
  status: (open, minutes) => `${open ? 'Atajo abierto' : 'Atajo cerrado'} · ${minutes} min ahora`,
  open: 'Abrir el atajo',
  close: 'Cerrar el atajo',
  before: 'Antes',
  after: 'Con el atajo',
  minutes: ' min',
  verdict: {
    closed: 'Abre el atajo para ver el nuevo tiempo de viaje.',
    same: 'La carretera nueva no cambia el tiempo de viaje.',
    slower: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} más de viaje para todos.`,
    faster: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} menos de viaje para todos.`,
  },
  labels: {
    nodes: {
      start: 'S',
      north: 'A',
      south: 'B',
      end: 'T',
    },
    congestion: 'congestión',
    fixed: '45 min',
    shortcutOpen: '0 min',
    shortcutClosed: 'cerrado',
    caption: 'S → T · cada uno elige su ruta más rápida',
  },
  guests: [
    {
      name: 'John von Neumann',
      note: 'El tráfico es un juego de decisiones, y una jugada astuta puede sorprender a todos.',
    },
    {
      name: 'John Nash',
      note: 'Aquí ningún conductor puede mejorar por su cuenta, aunque todos vayan más lentos.',
    },
  ],
  insight: {
    title: '¿Por qué una carretera nueva puede frenar a todos?',
    html: `<p>Con 4\u202f000 conductores y sin atajo, el tráfico se reparte a partes iguales entre la ruta de arriba y la de abajo. Cada viaje dura 65 minutos. Abre el enlace de cero minutos entre A y B y cada conductor ve un motivo para usarlo. Todos toman S → A → B → T, y cada viaje dura 80 minutos.</p>
<div class="insight-visual">Un atajo puede cambiar las decisiones de la gente, y sus decisiones cambian la congestión.</div>
<h3>Prueba con una ciudad más tranquila</h3>
<p>Mueve el control de demanda hacia 1\u202f000. Ahora el atajo ayuda. Con una demanda muy alta, nadie lo usa. La paradoja solo ocurre en una parte del rango.</p>
<h3>Qué supone este modelo</h3>
<p>Cada conductor elige la ruta más rápida para sí mismo. Sus decisiones juntas llegan a un equilibrio en el que ningún conductor puede ahorrar tiempo cambiando de ruta él solo. Es una red simplificada, con sentido único, un atajo gratuito y tiempos de viaje que dependen solo del flujo de tráfico. Los puntos en movimiento muestran las proporciones en cada ruta, no decisiones individuales simuladas ni una predicción para una ciudad real.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Los tramos que se congestionan cuestan x/100 minutos, donde x es el número de conductores que usan ese tramo. Los otros dos tramos cuestan 45 minutos cada uno; el atajo A → B cuesta cero. Sin él, el tiempo de viaje es 45 + D/200 para D conductores. Con D = 4\u202f000, son 65 minutos. Con él, el equilibrio usa la ruta del medio y cuesta 2D/100 = 80 minutos.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explora la paradoja de Braess (Easley y Kleinberg, en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('loom', 'es', {
  eyebrow: 'TEJIDO',
  name: 'El telar matemático',
  tagline: 'Cambia una casilla en una cuadrícula diminuta de síes y noes, y toda la tela cambia.',
  title: 'El telar matemático.',
  subtitle: 'Elige qué hilos se levantan. Mira crecer una tela a partir de una cuadrícula de síes y noes.',
  field: 'Tejido · Patrones binarios · Repetición',
  sceneLabel: 'Un telar de cuatro lizos',
  sceneName: 'Tela a partir de un diseño',
  tip: 'Izquierda: el diseño · Derecha: su tela · Haz clic en el amarre para cambiarlo, o usa sus casillas en el panel',
  tipStacked: 'Arriba: el diseño · Abajo: su tela · Haz clic en el amarre, o usa sus casillas en el panel',
  actionLabel: 'Sorpréndeme',
  canvasLabel:
    'Un diseño de tejido junto a la tela que produce. Cambia el amarre haciendo clic aquí o con sus casillas en el panel.',
  panelEyebrow: 'Prepara el telar',
  whyLabel: '¿Cómo hace tela una cuadrícula?',
  nudge: 'Empieza con «Sarga» y cambia una casilla del amarre. Todas las filas tejidas con ese pedal cambian a la vez.',
  connection: {
    html: '<strong>Una regla pequeña, repetida en todas partes.</strong> El amarre decide cada cruce de la tela. En «Una mente de muchos», reglas pequeñas entre vecinos dan forma a toda una multitud.',
    label: 'Visita «Una mente de muchos»',
  },
  presets: [
    {
      name: 'Tafetán',
      note: 'Uno por encima, uno por debajo.',
    },
    {
      name: 'Sarga',
      note: 'Una diagonal, como la del denim.',
    },
    {
      name: 'Pata de gallo',
      note: 'Sarga con cuatro hilos oscuros y cuatro claros.',
    },
    {
      name: 'Rayas, no cuadros',
      note: 'Alterna los colores en los dos sentidos.',
    },
    {
      name: 'Ojo de perdiz',
      note: 'En punta en los dos sentidos: rombos diminutos.',
    },
    {
      name: 'Espiga',
      note: 'Haz que la sarga vuelva sobre sí misma.',
    },
  ],
  tieup: 'Qué hilos levanta cada pedal (el amarre)',
  tieupHint:
    'Cada lizo es un marco que sostiene algunos de los hilos a lo largo. Una casilla encendida significa que ese pedal levanta ese lizo.',
  tieupCell: (pedal, shaft) => `El pedal ${pedal} levanta el lizo ${shaft}`,
  treadleLabel: (n) => `Pedal ${n}`,
  shaftLabel: (n) => `Lizo ${n}`,
  threading: 'Orden de los hilos',
  treadling: 'Orden de los pedales',
  orders: ['Recto', 'En punta', 'Quebrado', 'Doble'],
  warpColours: 'Hilos largos',
  weftColours: 'Hilos cruzados',
  colourOrders: ['Todo oscuro', '4 y 4', 'Alternados', '2 y 2', 'Todo claro'],
  palette: 'Hilo',
  palettes: ['Índigo y crema', 'Rubia y oro', 'Bosque y lino', 'Noche y plata'],
  repeat: (across, down) =>
    across === 1 && down === 1 ? 'Un solo color en toda la tela' : `Se repite cada ${across} × ${down} hilos`,
  float: (n) =>
    n === Infinity
      ? 'Aquí hay un hilo que nunca se entrelaza. Esta tela se desharía.'
      : n === 1
        ? 'Cada hilo pasa por encima de uno y por debajo de uno: una tela firme.'
        : n <= 3
          ? `Los hilos flotan sobre hasta ${n} más: una tela más suave, con más caída.`
          : `Bastas de ${n} hilos: largas y sueltas, fáciles de enganchar.`,
  labels: {
    draft: 'DISEÑO',
    cloth: 'TELA',
  },
  guests: [
    {
      name: 'Ada Lovelace',
      note: 'Describió cómo la máquina de Babbage, guiada por tarjetas perforadas como un telar de Jacquard, podría tejer patrones algebraicos.',
    },
  ],
  insight: {
    title: 'Una cuadrícula que teje.',
    html: `<p>Cada tela de aquí sale de tres listas cortas. El <em>remetido</em> dice por cuál de los cuatro lizos pasa cada hilo a lo largo (la urdimbre). El <em>amarre</em> dice qué lizos levanta cada pedal. El <em>pisado</em> dice qué pedal se pisa en cada pasada a lo ancho (la trama). Allí donde un hilo de urdimbre levantado cruza la trama, la urdimbre queda por encima.</p>
<div class="insight-visual">tela = pisado × amarre × remetido, un producto de cuadrículas de 0 y 1</div>
<h3>Un cambio pequeño, toda la tela</h3>
<p>Cambia una casilla del amarre y todas las pasadas tejidas con ese pedal cambian a la vez. Así diseñan los tejedores sobre el papel: la cuadrícula de la izquierda de la imagen es un diseño de tejido real.</p>
<h3>El color es un segundo patrón</h3>
<p>Colorea también los hilos, y el ligamento y el orden de los colores se combinan. Una sarga 2/2 con cuatro hilos oscuros y cuatro claros en cada sentido da pata de gallo. Un tafetán con colores alternados da rayas, y no los cuadros que uno esperaría.</p>
<h3>Las bastas sostienen la tela</h3>
<p>Un hilo que pasa por encima de varios sin entrelazarse forma una basta. Las bastas cortas dan una tela firme; las largas la hacen suave y fácil de enganchar. Un hilo que nunca se entrelaza no forma tela en absoluto.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Escribe el remetido como una cuadrícula H (el hilo de urdimbre j está en el lizo s), el amarre como U (el pedal t levanta el lizo s) y el pisado como T (la pasada i usa el pedal t). La tela es D = T · U · Hᵀ, con aritmética booleana, donde 1 + 1 = 1. Como las tres listas se repiten, la tela también: su repetición divide al mínimo común múltiplo de las longitudes de las listas y de los órdenes de colores.</p><p>Este telar tiene cuatro lizos y cuatro pedales, como muchos telares de mesa y de pie. La tela real también depende del hilo, la separación y la tensión, que esta imagen deja fuera.</p></details>
<div class="sources"><a class="source-link" href="https://www.tandfonline.com/doi/abs/10.1080/0025570X.1980.11976845" target="_blank" rel="noopener">Satins and twills: la geometría de las telas (Grünbaum y Shephard, en inglés)</a><a class="source-link" href="https://es.wikipedia.org/wiki/Pata_de_gallo" target="_blank" rel="noopener">La pata de gallo</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/" target="_blank" rel="noopener">Ada Lovelace y el telar de Jacquard (en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('storm', 'es', {
  eyebrow: 'CORRECCIÓN DE ERRORES',
  name: 'Un dibujo en medio de la tormenta',
  tagline: 'Unos pocos bits extra, bien pensados, permiten que un dibujo se repare solo.',
  title: 'Un dibujo en medio de la tormenta.',
  subtitle: 'Haz un dibujito. Envíalo a través de la tormenta. Ayúdalo a llegar entero.',
  field: 'Códigos · Información · Un poco de redundancia',
  sceneLabel: 'Canal con ruido',
  actionLabel: 'Enviar de nuevo',
  canvasLabel:
    'Tu dibujo, a la izquierda, viaja en bits a través de una tormenta que cambia algunos de ellos, y llega a la derecha. Haz clic o arrastra sobre tu dibujo para pintar. Con el teclado, muévete con las flechas y presiona Enter para pintar.',
  panelEyebrow: 'Protégelo',
  whyLabel: '¿Cómo pueden los bits arreglarse solos?',
  nudge:
    'Cuenta los daños sin protección. Luego prueba el truco de Hamming en la misma tormenta. ¿Hasta qué fuerza de tormenta aguanta?',
  connection: {
    html: '<strong>Señales que viajan.</strong> Aquí un mensaje sobrevive a un viaje con ruido. En «Escucha la forma», dos tonos viajan juntos y dibujan una forma que se puede oír.',
    label: 'Visita «Escucha la forma»',
  },
  yours: 'Tu dibujo',
  storm: 'La tormenta',
  arrived: 'Lo que llegó',
  codes: ['Sin protección', 'Repetirlo tres veces', 'Un bit de paridad', 'El truco de Hamming'],
  codeLabel: 'Cómo protegerlo',
  codeHints: [
    'Cada bit viaja solo.',
    'Tres copias de cada bit y luego una votación.',
    'Un bit de control por cada cuatro detecta un cambio.',
    'Tres bits de control por cada cuatro corrigen un cambio.',
  ],
  stormLabel: 'Fuerza de la tormenta',
  stormHint: 'La probabilidad de que cualquier bit cambie.',
  pictureLabel: 'Elige un dibujo o pinta sobre el tuyo',
  pictures: {
    heart: 'Corazón',
    smile: 'Sonrisa',
    invader: 'Marciano',
    blank: 'Borrar',
  },
  tip: 'Naranja: cambiado · ○ reparado · ✕ sigue incorrecto',
  tipParity: 'Naranja: cambiado · discontinuo: se sabe dañado · ✕ incorrecto',
  sent: 'Bits enviados',
  sentValue: (bits, extra) => `${bits} (+${extra}% extra)`,
  badge: (extra) => `+${extra}%`,
  badgeNote: 'bits extra',
  flipped: 'Cambiados por la tormenta',
  repaired: 'Reparados al llegar',
  knownBad: 'Bloques con daño detectado',
  wrong: 'Píxeles aún incorrectos',
  status: (wrong, flips) =>
    !flips
      ? 'Cielo en calma'
      : !wrong
        ? 'Llegaron todos los píxeles'
        : wrong === 1
          ? '1 píxel incorrecto'
          : `${wrong} píxeles incorrectos`,
  curveTitle: 'Píxeles incorrectos en promedio, a medida que crece la tormenta',
  about: (wrong) => `≈ ${wrong}`,
  curveLabel: (code, wrong) =>
    `${code}: aproximadamente ${wrong} ${wrong === 1 ? 'píxel incorrecto' : 'píxeles incorrectos'} en promedio con esta fuerza de tormenta.`,
  calm: 'calma',
  wild: '20%',
  presets: [
    {
      name: 'Sin protección',
      note: 'Cada cambio hace daño.',
    },
    {
      name: 'Repetirlo tres veces',
      note: 'Seguro, pero con el triple de bits.',
    },
    {
      name: 'El truco de Hamming',
      note: 'Casi igual de seguro, con muchos menos bits.',
    },
  ],
  guests: [
    {
      name: 'Richard Hamming',
      note: 'Un fin de semana tras otro, los errores detenían su máquina. Si puede detectar un error, se preguntó, ¿por qué no corregirlo?',
    },
  ],
  insight: {
    title: '¿Cómo puede un mensaje arreglarse solo?',
    html: `<p>Tu dibujo tiene 64 píxeles, es decir, 64 bits de tinta o sin tinta. La tormenta cambia cada bit con una probabilidad pequeña. Sin protección, cada bit cambiado es un píxel incorrecto, y quien lo recibe ni siquiera sabe cuáles son.</p>
<div class="insight-visual">Unos pocos bits extra, bien elegidos, permiten al receptor encontrar y corregir errores que nunca vio ocurrir.</div>
<h3>Repetirlo tres veces</h3>
<p>Envía cada bit tres veces y deja que el receptor haga una votación. Un cambio en un trío pierde dos votos contra uno. Funciona, pero triplica el mensaje: 8 bits extra por cada 4.</p>
<h3>Un bit de paridad</h3>
<p>Añade un bit a cada bloque de cuatro para que la cantidad de unos sea siempre par. Si cambia un solo bit, la cuenta se vuelve impar y el receptor sabe que el bloque está dañado. No puede saber qué bit corregir, y dos cambios se anulan entre sí y se esconden.</p>
<h3>El truco de Hamming</h3>
<p>Numera del 1 al 7 los siete bits de un bloque. Los bits en las posiciones 1, 2 y 4 son de control. Cada control mantiene par la cuenta en las posiciones cuyo número, escrito en binario, lo contiene: el control 1 vigila 1, 3, 5, 7; el control 2 vigila 2, 3, 6, 7; el control 4 vigila 4, 5, 6, 7. Cuando cambia un bit, los controles que fallan suman su posición. Si fallan los controles 1 y 4, es la posición 5, y si no falla ninguno, el bloque parece limpio. Así, mientras cambie como mucho un bit por bloque, 3 bits extra por cada 4 lo reparan.</p>
<h3>Costo y protección</h3>
<p>En una tormenta del 4%, un dibujo sin protección tiene en promedio unos 2.6 píxeles incorrectos; con tres copias, unos 0.3; y con el truco de Hamming, unos 0.8, con menos de la mitad de bits extra. La pequeña curva del panel lo muestra para cada fuerza de tormenta.</p>
<h3>Dónde falla</h3>
<p>Estos códigos suponen que cada bit cambia por su cuenta. Las tres copias y el truco de Hamming prometen corregir un cambio por bloque; un bit de paridad solo avisa, y sin protección no hay ni lo uno ni lo otro. Dos cambios en un mismo bloque de Hamming mandan al receptor a la posición equivocada, y su «reparación» empeora las cosas. Cerca de una tormenta del 20%, el truco de Hamming apenas ayuda; un poco más allá, perjudica. Las tormentas reales llegan en ráfagas, así que los sistemas reales usan códigos más largos y separan los bits de cada bloque.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Para los bits de datos d1 d2 d3 d4 en las posiciones 3, 5, 6, 7, los controles son c1 = d1 ⊕ d2 ⊕ d4, c2 = d1 ⊕ d3 ⊕ d4, c4 = d2 ⊕ d3 ⊕ d4, donde ⊕ suma bits sin llevar. El receptor combina con XOR las posiciones que tienen un 1; el resultado, llamado síndrome, es 0 para un bloque limpio y la posición cambiada cuando cambió exactamente un bit. Tres cambios pueden anularse hasta dar 0 y pasar inadvertidos.</p><p>Si cada bit cambia con probabilidad p, un píxel enviado solo sale incorrecto con probabilidad p, y uno enviado tres veces, con probabilidad 3p² − 2p³. Las curvas suman exactamente todos los patrones de cambios posibles.</p></details>
<div class="sources"><a class="source-link" href="https://archive.org/details/bstj29-2-147" target="_blank" rel="noopener">El artículo de Hamming de 1950 (en inglés)</a><a class="source-link" href="https://www.inference.org.uk/mackay/itila/" target="_blank" rel="noopener">MacKay, capítulo 1: enviar imágenes a través del ruido (en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('sudoku', 'es', {
  eyebrow: 'LÓGICA · GRAFOS',
  name: 'El sudoku, sin secretos',
  tagline: 'Un rompecabezas de números donde los números nunca importaron.',
  title: 'El sudoku, sin secretos.',
  subtitle: 'Coloca un color y mira cómo desaparecen en silencio las posibilidades a su alrededor.',
  field: 'Lógica · Coloración de grafos · Cuadrados latinos',
  sceneLabel: 'Dieciséis casillas',
  tip: 'Tab para ir al tablero · las flechas mueven · las teclas 1–4 colocan · Retroceso borra · Ctrl+Z deshace',
  actionLabel: 'Dar un paso lógico',
  canvasLabel:
    'Un tablero de sudoku de cuatro por cuatro. Cada casilla vacía muestra los símbolos que todavía pueden ir allí. El tablero de casillas que hay sobre esta imagen se puede usar con el teclado.',
  boardLabel: 'Tablero de sudoku, cuatro por cuatro',
  panelEyebrow: 'Coloca, deshaz, vuelve a mirar',
  whyLabel: '¿Qué tiene que ver con colorear?',
  nudge:
    'Coloca un color y mira cómo sus marquitas se apagan a lo largo de su fila, su columna y su bloque. Luego da un paso lógico. ¿Estás de acuerdo con su razón?',
  connection: {
    html: '<strong>Otra red de vecinos.</strong> Aquí cada casilla limita a las casillas con las que está unida. En el cruce de la ciudad, la decisión de cada conductor cambia el viaje de todos.',
    label: 'Visita «El atajo tentador»',
  },
  presets: [
    {
      name: 'Un comienzo suave',
      note: 'Ocho pistas. Un paso lleva al siguiente.',
    },
    {
      name: 'Solo un camino',
      note: 'Solo cuatro pistas, y aun así una única respuesta.',
    },
    {
      name: 'Dos respuestas',
      note: 'Seis pistas, y sitio para dos finales.',
    },
  ],
  styles: ['Colores', 'Formas', 'Dígitos'],
  styleHint: 'El mismo sudoku, con otras etiquetas. Solo importan las reglas.',
  styleLabel: 'Símbolos',
  symbolWord: ['color', 'forma', 'dígito'],
  symbolNames: [
    ['el azul', 'el naranja', 'el rosa', 'el verde'],
    ['el círculo', 'el cuadrado', 'el triángulo', 'el rombo'],
    ['el 1', 'el 2', 'el 3', 'el 4'],
  ],
  unitNames: {
    row: 'fila',
    col: 'columna',
    box: 'bloque',
  },
  placeLabel: 'Colocar en la casilla elegida',
  placeButton: (name) => `Colocar ${name}`,
  faded: (word) =>
    word === 'forma'
      ? 'Las formas apagadas no pueden ir aquí.'
      : word === 'color'
        ? 'Los colores apagados no pueden ir aquí.'
        : 'Los dígitos apagados no pueden ir aquí.',
  clash: 'choca aquí',
  undo: 'Deshacer',
  clear: 'Vaciar casilla',
  network: 'Mostrar la red',
  filled: 'Llenas',
  candidatesLeft: 'Candidatos',
  waysToFinish: 'Respuestas',
  none: 'ninguna',
  twoFinishes: 'El buscador encontró los dos finales. Solo se diferencian en las casillas remarcadas.',
  answerLabel: (n) => `Final ${n}`,
  status: (filled) => `${filled} de 16 llenas`,
  networkCaption: '16 casillas · 56 uniones · las casillas unidas nunca coinciden',
  start: (word) => `Toca una casilla vacía y luego elige ${word === 'forma' ? 'una forma' : `un ${word}`}.`,
  placed: (name, n) =>
    n === 0
      ? `${name.charAt(0).toUpperCase() + name.slice(1)}, colocado. No hizo falta cambiar nada cerca.`
      : `${name.charAt(0).toUpperCase() + name.slice(1)}, colocado. Ya no puede ir en ${n} ${n === 1 ? 'casilla cercana' : 'casillas cercanas'}.`,
  clashed: (name) => `Ahora dos vecinas tienen ${name}. Deshaz o prueba con otro.`,
  given: 'Esta venía con el sudoku. Prueba con una casilla vacía.',
  cleared: 'Vaciada. Vuelven sus posibilidades.',
  undone: 'Un paso atrás.',
  naked: (name) => `Aquí solo cabe ${name}: su fila, su columna y su bloque ya tienen los otros tres.`,
  hidden: (name, unit) =>
    `${unit === 'bloque' ? 'En este bloque' : `En esta ${unit}`}, ${name} solo tiene un lugar posible.`,
  stuckTwo: 'Ya no hay nada obligado. Las casillas remarcadas pueden intercambiarse, y los dos finales funcionan.',
  stuckOne: 'Aquí ningún paso es obligado. Prueba a adivinar y deshaz si se tuerce.',
  stuckNone: 'Este tablero ya no se puede terminar. Deshaz un paso o dos.',
  clashFirst: 'Dos vecinas comparten un símbolo. Primero deshaz o vacía una de las casillas que brillan.',
  solved: (word) =>
    `¡Completo! Cada fila, cada columna y cada bloque tiene ${word === 'forma' ? 'cada forma' : `cada ${word}`} una sola vez.`,
  fresh: 'Un tablero nuevo.',
  describe: (row, col, content) => `Fila ${row}, columna ${col}, ${content}`,
  holds: (name, given) => (given ? `${name}, una pista` : name),
  emptyWith: (names) => `vacía, podría ser ${names.join(' o ')}`,
  emptyNone: 'vacía, no cabe nada',
  guest: {
    name: 'Leonhard Euler',
    note: 'Un sudoku terminado es un cuadrado latino más una regla para los bloques. Mis 36 oficiales necesitaban dos cuadrados latinos superpuestos de modo que cada pareja apareciera una sola vez, y resultó imposible.',
  },
  insight: {
    title: '¿Qué tiene que ver el sudoku con colorear?',
    html: `<p>Nada en el sudoku necesita números. La única regla es que dos casillas de la misma fila, columna o bloque deben ser distintas. Colores, formas o dígitos funcionan exactamente igual, y por eso cambiar los símbolos nunca cambia el sudoku.</p>
<div class="insight-visual">Un sudoku es un mapa para colorear. En este tablero cada casilla tiene siete vecinas, y debe ser distinta de todas.</div>
<h3>Restricciones</h3>
<p>Cada casilla pertenece a una fila, una columna y un bloque. Esos grupos se solapan, así que una sola jugada llega lejos: quita una posibilidad a hasta siete casillas a la vez. Las marcas que se apagan muestran exactamente cuáles.</p>
<h3>Candidatos y únicos</h3>
<p>Las marquitas de una casilla vacía son sus candidatos: los símbolos que todavía no tiene ninguna de sus vecinas. Cuando solo queda una marca, esa casilla está obligada (un «candidato único»). Cuando un símbolo solo tiene una casilla posible en alguna fila, columna o bloque, tiene que ir allí (un «lugar único»). «Dar un paso lógico» usa solo estas dos ideas, y siempre te muestra por qué.</p>
<h3>Un grafo para colorear</h3>
<p>Activa la red. Cada casilla se vuelve un punto, y una línea une dos puntos siempre que sus casillas comparten fila, columna o bloque: 16 puntos y 56 líneas. Llenar el tablero es lo mismo que darle a cada punto uno de cuatro colores de modo que ninguna línea una dos puntos del mismo color, igual que colorear un mapa para que los países vecinos sean distintos. Los matemáticos lo llaman una coloración propia de un grafo.</p>
<h3>Por qué un buen sudoku tiene exactamente una respuesta</h3>
<p>Las pistas son una coloración ya empezada. Un sudoku bien hecho tiene las pistas justas para que solo quede una manera de terminarlo, así que cada paso se puede razonar en vez de adivinar. En un tablero de 4×4, cuatro pistas son las mínimas que lo logran. Con menos, siempre queda alguna elección abierta. «Dos respuestas» tiene seis pistas, pero cuatro casillas forman un rectángulo cuyos dos colores pueden intercambiarse, y el buscador encuentra los dos finales.</p>
<h3>El sudoku de tamaño completo</h3>
<p>El sudoku del periódico es la misma idea a mayor escala: 81 casillas, cada una con 20 vecinas, 810 líneas y nueve colores. Hay 288 tableros de 4×4 terminados, pero unos 6.7 × 10<sup>21</sup> tableros de 9×9 terminados. El mínimo de pistas con el que un sudoku de 9×9 puede tener una única respuesta es 17, algo que se demostró con una enorme búsqueda informática.</p>
<h3>Cuadrados latinos</h3>
<p>Una cuadrícula en la que cada símbolo aparece una vez en cada fila y en cada columna se llama cuadrado latino. Leonhard Euler los estudió, incluido su problema de los 36 oficiales: seis grados y seis regimientos, colocados de modo que cada fila y cada columna tenga cada grado y cada regimiento una sola vez. Todo sudoku terminado es un cuadrado latino con una regla extra para sus bloques.</p>
<details><summary>Qué hace esta sala, y qué deja fuera</summary><p>Los candidatos aquí solo usan la eliminación directa: un símbolo se descarta cuando una vecina ya lo tiene. El paso lógico conoce dos tipos de deducción, los candidatos únicos y los lugares únicos; los sudokus más difíciles necesitan más. La cuenta de maneras de terminar sale de una pequeña búsqueda con vuelta atrás. Prueba cada posibilidad en la casilla vacía más restringida y se detiene en cuanto encuentra dos finales. Herzberg y Murty cuentan las maneras de completar una coloración parcial con un polinomio cromático: un sudoku tiene solución única exactamente cuando esa cuenta es 1. A esta sala solo le hace falta distinguir entre ninguno, uno y dos.</p></details>
<div class="sources"><a class="source-link" href="https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf" target="_blank" rel="noopener">Sudoku Squares and Chromatic Polynomials (Herzberg y Murty, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku" target="_blank" rel="noopener">Matemáticas del sudoku (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Thirty-six_officers_problem" target="_blank" rel="noopener">Los 36 oficiales de Euler (en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('dice', 'es', {
  eyebrow: 'CONTAR',
  name: 'Los dados que se ganan entre sí',
  tagline: 'Elige cualquier dado. Siempre hay uno que le gana.',
  title: 'Los dados que se ganan entre sí.',
  subtitle: 'Elige cualquier dado. Yo elegiré después de ti.',
  field: 'Probabilidad · Contar · Una pequeña sorpresa',
  sceneLabel: 'Dados raros · Un círculo',
  tip: 'Toca un dado del círculo, o usa ← y →, para elegir el tuyo · Cada flecha va del ganador al perdedor',
  actionLabel: 'Tirar 100 veces',
  canvasLabel:
    'Dos dados que se tiran uno contra otro, un recuento de victorias, el porcentaje de victorias acumulado y un círculo de flechas que muestra qué dado suele ganarle a cuál. Toca un dado del círculo, o usa las flechas izquierda y derecha, para elegir tu dado.',
  panelEyebrow: 'Elige y tira',
  whyLabel: '¿Cómo puede perder cualquier dado?',
  nudge:
    'Prueba cada dado por turno. Cada vez, encuentro uno que le gana al tuyo. ¿Existe algún dado al que yo no pueda ganarle?',
  connection: {
    html: '<strong>Una pequeña sorpresa para tu intuición.</strong> Aquí, «mejor» da vueltas en círculo. En la ciudad, una carretera recién estrenada puede hacer más lento cada viaje.',
    label: 'Prueba «El atajo tentador»',
  },
  sets: ['Tres dados · 5/9', 'Los cuatro dados de Efron · 2/3', 'Los dados de Grime · un giro'],
  sceneNames: ['Elige tú primero', 'Los cuatro de Efron', 'Los dados de Grime'],
  twoEach: (name) => `${name} · dos de cada uno`,
  marks: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['R', 'A', 'O'],
  ],
  names: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['Rojo', 'Azul', 'Oliva'],
  ],
  setLabel: 'Juego de dados',
  youLabel: 'Tu dado',
  rivalLabel: 'Mi dado',
  letMe: 'Déjame elegir',
  pairs: 'Tirar dos de cada uno y sumarlos',
  speed: 'Tiradas por segundo',
  speedHint: 'Despacio para seguir cada tirada, o rápido para ver cómo se estabiliza el porcentaje.',
  faces: (list) => list.join(' '),
  pickDie: (name, list) => `Dado ${name}: ${list.join(', ')}`,
  you: 'Tú',
  me: 'Yo',
  vs: 'contra',
  iTake: (you, me) => `Elegiste ${you}. Yo me quedo con ${me}.`,
  against: (you, me) => `${you} contra ${me}. Elegiste los dos.`,
  ready: 'Listo para tirar',
  rolls: (n) => (n === 1 ? '1 tirada' : `${n.toLocaleString('fr')} tiradas`),
  circleTitle: 'El círculo de victorias',
  even: 'empate',
  winsTitle: 'Victorias',
  latestTitle: 'Tiradas: la última primero',
  ties: (n) => (n === 1 ? '1 empate' : `${n} empates`),
  shareTitle: (name) => `Cuántas veces gana ${name}`,
  exactLabel: (fraction) => `exacto ${fraction}`,
  startHint: 'Presiona «Tirar 100 veces»',
  rollsSoFar: 'Tiradas hasta ahora',
  winsLine: (you, me, a, b) => `Tú (${you}) ${a} · Yo (${me}) ${b}`,
  seenLine: (name, seen, fraction, exact) =>
    `${name} gana: ${seen === null ? '–' : seen + '%'} hasta ahora · exactamente ${fraction} ≈ ${exact}%`,
  verdictStart: (favourite, fraction) =>
    `Exactamente, ${favourite} gana ${fraction} de las veces. Tira para verlo ocurrir.`,
  verdict: (n, favourite, seen, fraction) =>
    `Después de ${n.toLocaleString('fr')} tiradas, ${favourite} ha ganado el ${seen}% de las veces. La probabilidad exacta es ${fraction}.`,
  evenVerdict: 'Estos dos están igualados.',
  sameDie: 'El mismo dado en los dos lados: un duelo igualado.',
  presets: [
    {
      name: 'Elige tú primero',
      note: 'Yo elijo después de ti.',
      badge: '5/9',
    },
    {
      name: 'Los cuatro de Efron',
      note: 'Cuatro dados, un círculo.',
      badge: '2/3',
    },
    {
      name: 'Dos de cada uno',
      note: 'Dobla los dados, invierte el círculo.',
      badge: '↺',
    },
  ],
  guests: [
    {
      name: 'Blaise Pascal',
      note: 'Le llegó un problema de dados de un jugador. Sus cartas con Fermat en 1654 dieron comienzo a las matemáticas del azar.',
    },
  ],
  gridAxes: (me, you) =>
    `Las filas son mi dado, ${me}; las columnas son tu dado, ${you}. Cada casilla está coloreada según quién gana.`,
  gridNote: (win, lose, tie, total, me, you) =>
    `${me} gana ${win} de los ${total.toLocaleString('fr')} emparejamientos igual de probables, ${you} gana ${lose}` +
    (tie ? `, y ${tie} son empates.` : '.'),
  insight: {
    title: '¿Cómo puede perder cualquier dado?',
    html: `<p>Cuenta en vez de adivinar. Cada dado tiene seis caras, así que dos dados pueden caer de 6 × 6 = 36 maneras igual de probables. Toma A (2, 2, 4, 4, 9, 9) contra B (1, 1, 6, 6, 8, 8). Los dos 9 de A les ganan a las seis caras de B: 12 maneras. Los 2 y los 4 de A solo les ganan a los dos 1 de B: 4 × 2 = 8 más. Eso da 20 de 36 para A, o sea, 5/9. La misma cuenta da B sobre C, y C sobre A.</p>
<canvas id="dice-grid" class="dice-grid" aria-hidden="true"></canvas>
<p id="dice-grid-note"></p>
<div class="insight-visual">A le gana a B, B le gana a C y C le gana a A. «Suele ganar» no se ordena en fila, así que quien elige segundo siempre puede encontrar un dado que gane.</div>
<h3>Mejor en promedio no es lo mismo que ganar más a menudo</h3>
<p>Los tres dados del primer juego tienen un promedio de exactamente 5. En el juego de Efron, C (6, 6, 2, 2, 2, 2) tiene el promedio más alto, 3⅓, y aun así pierde contra B, que siempre saca 3, dos de cada tres veces. Al promedio le importa por cuánto se gana; «suele ganar» solo cuenta cuántas veces.</p>
<h3>Dos de cada uno invierten el círculo</h3>
<p>Con los dados rojo, azul y oliva de James Grime, un dado de cada color da rojo sobre azul, azul sobre oliva y oliva sobre rojo. Tira dos de cada uno y súmalos, y todas las flechas se invierten: azul gana a rojo, oliva gana a azul y rojo gana a oliva. Sumar dos dados cambia qué totales son probables, y eso cambia quién suele ganar.</p>
<h3>Qué se supone aquí</h3>
<p>Dados equilibrados: todas las caras con la misma probabilidad de salir, y cada tirada independiente de las demás. Las tiradas de aquí salen de un generador de números pseudoaleatorios. Unas pocas docenas de tiradas pueden alejarse mucho de la probabilidad exacta. La oscilación típica se reduce despacio, como uno entre la raíz cuadrada del número de tiradas: alrededor del 5% después de 100 tiradas, alrededor del 0.5% después de 10\u202f000.</p>
<details><summary>¿Hay un dado al que nadie le gane?</summary><p>No en estos juegos. Para cada dado hay otro que le gana más veces de las que pierde. Eso es lo que significa «no transitivo»: «ganar a» no se transmite a lo largo de una cadena, como sí lo hace «ser más alto que». En el juego de Efron, la mejor respuesta de la sala gana dos de cada tres veces, elijas el que elijas.</p></details>
<div class="sources"><a class="source-link" href="https://nrich.maths.org/problems/non-transitive-dice?tab=teacher" target="_blank" rel="noopener">NRICH: dados no transitivos (en inglés)</a><a class="source-link" href="https://www.scientificamerican.com/article/mathematical-games-1970-12/" target="_blank" rel="noopener">Martin Gardner sobre los dados de Efron (1970, en inglés)</a><a class="source-link" href="http://singingbanana.com/dice/article.htm" target="_blank" rel="noopener">Los dados de James Grime (con una numeración anterior y las mismas probabilidades, en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('cube', 'es', {
  eyebrow: 'MOVIMIENTOS · GRUPOS',
  name: 'Dentro del cubo mágico',
  tagline:
    'Dos giros en otro orden, un movimiento que necesita 105 repeticiones para volver a casa, y piezas que apenas se mueven.',
  title: 'Dentro del cubo mágico.',
  subtitle: 'Olvídate de resolverlo. Juega con los propios movimientos y mira cómo se combinan.',
  field: 'Grupos · Orden · Deshacer',
  sceneLabel: 'Un cubo de movimientos',
  tip: 'Arrastra, o usa las flechas, para girar la vista',
  actionLabel: 'Repetirlo',
  actionCompare: 'Girarlos',
  canvasLabel:
    'Un cubo mágico. Usa los botones de movimiento para girar sus caras; arrastra o usa las flechas para girar la vista.',
  panelEyebrow: 'Combina movimientos',
  whyLabel: '¿Por qué importa el orden?',
  nudge:
    'Prueba «De vuelta al inicio» y luego «Repetir hasta volver». ¿Cuántas repeticiones crees que necesita para llegar?',
  connection: {
    html: '<strong>Reglas que se pueden combinar y deshacer.</strong> Un movimiento del cubo es una regla que dice adónde va cada adhesivo. En «El sudoku, sin secretos», las reglas entre vecinas deciden dónde puede ir cada color.',
    label: 'Visita «El sudoku, sin secretos»',
  },
  sceneName: {
    one: 'Un cubo',
    compare: 'Dos órdenes',
  },
  modes: ['Un cubo', 'Comparar dos órdenes'],
  mode: 'Qué explorar',
  faces: {
    U: 'superior',
    R: 'derecha',
    F: 'frontal',
    D: 'inferior',
    L: 'izquierda',
    B: 'trasera',
  },
  turn: (face, prime) => `girar la cara ${face} en sentido ${prime ? 'antihorario' : 'horario'}`,
  moveLabel: (name, turn) => `${name}: ${turn}`,
  movePad: 'Crea una secuencia',
  notation:
    'Las letras vienen del inglés: U = arriba, R = derecha, F = frente, D = abajo, L = izquierda, B = atrás; ′ gira al revés.',
  undo: 'Deshacer',
  clear: 'Borrar',
  home: 'Repetir hasta volver',
  highlight: 'Mostrar solo lo que se movió',
  first: 'Primer movimiento',
  second: 'Segundo movimiento',
  sequence: (text) => (text ? text : 'Todavía no hay movimientos: presiona una cara'),
  times: (n) => (n === 1 ? 'hecho una vez' : n === 0 ? 'todavía sin hacer' : `hecho ${n} veces`),
  order: (n) => (n === 1 ? 'Nada que deshacer: se queda en casa.' : `Vuelve a casa después de ${n} repeticiones.`),
  moved: (n) =>
    n === 0
      ? 'Todas las piezas están en casa.'
      : n === 1
        ? '1 pieza fuera de su sitio.'
        : `${n} piezas fuera de su sitio.`,
  status: (n) => (n === 0 ? 'Resuelto' : `${n} piezas movidas`),
  landed: (moved, done, order) =>
    (moved === 0 ? 'Resuelto. ' : `Hecho ${done === 1 ? 'una vez' : `${done} veces`}. ${moved} piezas movidas. `) +
    (order === 1 ? 'Se queda en casa.' : `Vuelve a casa después de ${order} repeticiones.`),
  full: 'Ya son doce movimientos: repítelo, deshaz o borra.',
  restarted: 'Aquí empieza una secuencia nueva.',
  compareLabels: (a, b) => [`${a} y luego ${b}`, `${b} y luego ${a}`],
  compareSame: 'Estos dos conmutan: en cualquier orden, el cubo queda igual.',
  compareDiffer: (n) => `Los mismos dos movimientos, en otro orden: ${n} adhesivos terminan en lugares distintos.`,
  compareReady: 'Presiona «Girarlos» para hacer los dos movimientos en cada cubo.',
  presets: [
    {
      name: 'El orden importa',
      note: '¿Derecha y luego arriba, o arriba y luego derecha?',
    },
    {
      name: 'De vuelta al inicio',
      note: 'Repite R U una y otra vez.',
    },
    {
      name: 'Solo se mueven unas pocas piezas',
      note: 'R U R′ U′, un conmutador.',
    },
    {
      name: 'Deshazlo al revés',
      note: 'Para deshacer, invierte el orden.',
    },
  ],
  guests: [
    {
      name: 'Évariste Galois',
      note: 'Murió a los veinte años y dejó los comienzos de la teoría de grupos: las matemáticas de combinar y deshacer.',
    },
  ],
  insight: {
    title: 'Movimientos que se pueden combinar y deshacer.',
    html: `<p>Este cubo funciona como el rompecabezas Rubik’s Cube®, pero aquí juegas con sus movimientos en lugar de resolverlo. Piensa en un movimiento del cubo como una regla: cada adhesivo va a un lugar nuevo. Hacer un movimiento después de otro combina dos reglas en una nueva. Todo movimiento se puede deshacer. Y no hacer nada también es un movimiento. Los matemáticos llaman <em>grupo</em> a una colección así.</p>
<div class="insight-visual">R y luego U no es lo mismo que U y luego R. El orden importa.</div>
<h3>Deshacer al revés</h3>
<p>Para deshacer «R y luego U», primero deshaces el último movimiento: U′ y luego R′. Como al quitarte los zapatos y los calcetines, se deshace en el orden contrario.</p>
<h3>Todo vuelve a casa</h3>
<p>Repite cualquier secuencia y el cubo acaba volviendo a como empezó, porque solo hay una cantidad finita de posiciones. R U necesita 105 repeticiones. R U R′ U′ solo necesita 6. Ninguna secuencia necesita más de 1260.</p>
<h3>Movimientos que apenas mueven</h3>
<p>«Haz A, haz B, deshaz A, deshaz B» es un <em>conmutador</em>. Si A y B no se afectaran entre sí, no haría nada en absoluto. Como se solapan solo un poco, altera apenas unas pocas piezas: R U R′ U′ mueve siete de las veintiséis. Quienes resuelven el cubo usan conmutadores para arreglar unas pocas piezas sin estropear el resto.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Cada movimiento es una permutación de los 54 adhesivos. Combinar movimientos es componer permutaciones. Una secuencia vuelve a casa después del mínimo común múltiplo de las longitudes de sus ciclos de adhesivos. R U mueve los adhesivos en ciclos de 3, 7 y 15 lugares, y el mínimo común múltiplo de 3, 7 y 15 es 105.</p><p>El cubo tiene 43\u202f252\u202f003\u202f274\u202f489\u202f856\u202f000 posiciones, y cada una se puede resolver en 20 movimientos como máximo, contando giros de cara, algo demostrado en 2010 con muchísimo tiempo de computación.</p></details>
<div class="sources"><a class="source-link" href="https://es.wikipedia.org/wiki/Grupo_del_cubo_de_Rubik" target="_blank" rel="noopener">El grupo de movimientos del cubo</a><a class="source-link" href="https://www.cube20.org/" target="_blank" rel="noopener">El número de Dios es 20 (en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Galois/" target="_blank" rel="noopener">Évariste Galois (en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('sample', 'es', {
  eyebrow: 'MUESTREO',
  name: 'Una cucharada de ciudad',
  tagline: 'Una encuesta enorme puede estar segura y equivocarse. Una pequeña al azar acierta más o menos.',
  title: 'Una cucharada de ciudad.',
  subtitle: 'Naranja o azul: ¿qué prefiere la ciudad entera? Solo puedes preguntarles a algunos.',
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

Wonderlattice.defineText('plane', 'es', {
  eyebrow: 'NÚMEROS COMPLEJOS',
  name: 'Deforma el plano',
  tagline: 'Deforma una imagen sin romperla; un círculo se convierte en un ala.',
  title: 'Deforma el plano.',
  subtitle:
    'Pasa una imagen por una función compleja. Todo el plano se deforma, pero los ángulos rectos diminutos siguen siendo rectos.',
  field: 'Números complejos · Transformaciones conformes · Alas',
  sceneLabel: 'El plano, deformado',
  tip: 'Arrastra la brújula de la izquierda, o muévela con las flechas · Su gemela de la derecha muestra el estiramiento y el giro',
  tipStacked:
    'Arrastra la brújula de la imagen de arriba, o usa las flechas · Su gemela de abajo muestra el estiramiento y el giro',
  actionLabel: 'Deformarlo',
  canvasLabel:
    'Dos copias del plano. En la primera, una imagen y una pequeña brújula de dos flechas perpendiculares; en la segunda, sus imágenes bajo la función compleja elegida. Arrastra la brújula o muévela con las flechas.',
  panelEyebrow: 'Elige una deformación',
  whyLabel: '¿Por qué sobreviven los ángulos rectos?',
  nudge: 'Eleva el plano al cuadrado y arrastra la brújula justo al centro. ¿Qué le pasa ahí a su gemela?',
  connection: {
    html: '<strong>Deformar sin romper.</strong> Aquí una función deforma todo el plano y conserva sus ángulos diminutos. En «¿Dónde está el otro lado?», una tira se dobla hasta formar una superficie con un solo lado.',
    label: 'Visita «¿Dónde está el otro lado?»',
  },
  functions: ['Al cuadrado · z²', 'Del revés · 1/z', 'Enrollar · eᶻ', 'Onda · sin z', 'Ala · z + 1/z'],
  formulas: ['w = z²', 'w = 1/z', 'w = eᶻ', 'w = sin z', 'w = z + 1/z'],
  pictures: ['Una cuadrícula', 'Un pez', 'Una cara', 'Círculos y rayos', 'El círculo del ala'],
  functionLabel: 'Función',
  pictureLabel: 'Imagen',
  bendLabel: 'Cuánto se deforma',
  thickLabel: 'Grosor',
  camberLabel: 'Curvatura',
  gridLabel: 'Mostrar una cuadrícula tenue detrás',
  flowLabel: 'Mostrar el aire que pasa',
  at: 'La brújula en',
  stretch: 'Cuánto se estira aquí',
  stretchMath: '(|f′(z)|)',
  turn: 'Cuánto gira',
  turnMath: '(arg f′(z))',
  point: (x, y) => `${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i`.replace(/^-/, '−'),
  times: (x) => `${x}×`,
  degrees: (d) => `${d < 0 ? '−' : ''}${Math.abs(d)}°`,
  none: '–',
  status: (stretch, turn) => `×${stretch} · giro ${turn}`,
  statusCritical: 'Aquí f′ = 0',
  statusPole: 'Un polo: f = ∞',
  announceCritical: 'Aquí f′ = 0: los ángulos se duplican',
  announcePole: 'Un polo: aquí la función es infinita',
  keeps: 'Las flechas de su gemela siguen formando un ángulo recto.',
  critical: 'Aquí f′ = 0. Las flechas de la gemela se encogen hasta desaparecer, y los ángulos se duplican.',
  pole: 'Aquí f es infinita: un polo. La gemela salió volando del mapa.',
  away: 'Su gemela está fuera del borde de la imagen deformada.',
  blending: 'Deformado a medias: una mezcla de z y f(z), para ayudar a la vista.',
  zLabel: 'z',
  wLabel: 'w',
  bent: (formula, percent) => `${formula} · ${percent}% deformado`,
  criticalMark: 'f′ = 0',
  poleMark: 'polo',
  presets: [
    {
      name: 'Elevar el plano al cuadrado',
      note: 'En el centro, los ángulos se duplican.',
    },
    {
      name: 'Darle la vuelta',
      note: 'Las rectas se vuelven círculos.',
    },
    {
      name: 'Enrollarlo',
      note: 'Las rectas se vuelven anillos y rayos.',
    },
    {
      name: 'Un pez al cuadrado',
      note: 'Deformado por todas partes, y sigue siendo un pez.',
    },
    {
      name: 'Hacer un ala',
      note: 'Un círculo, deformado hasta ser un ala.',
    },
  ],
  guests: [
    {
      name: 'Bernhard Riemann',
      note: 'Su tesis de 1851, dirigida por Gauss, estudió las funciones complejas a través de la geometría: transformaciones que conservan los ángulos, y superficies.',
    },
  ],
  insight: {
    title: 'Una deformación que conserva sus ángulos.',
    html: `<p>Un número complejo x + iy es un punto del plano: x a lo ancho, y hacia arriba. Una función compleja f lleva cada punto z a un punto nuevo w = f(z), así que mueve todo el plano a la vez. La primera imagen es el plano antes; la segunda muestra adónde va a parar cada uno de sus puntos.</p>
<div class="insight-visual">multiplicar por un número de tamaño r y ángulo θ estira por r y gira θ</div>
<h3>Multiplicar gira y estira</h3>
<p>Multiplicar por i gira el plano un cuarto de vuelta. Multiplicar por 2 duplica su tamaño. Cada número complejo hace las dos cosas a la vez: estira según su tamaño y gira según su ángulo. Un estiramiento con un giro conserva todos los ángulos, aunque cambien los tamaños.</p>
<h3>De cerca, una deformación es una multiplicación</h3>
<p>Acércate mucho a un punto z y una función compleja derivable parece una multiplicación por un solo número, su derivada f′(z): f(z + h) ≈ f(z) + f′(z)·h para un h diminuto. Así que cada flecha diminuta en z se estira |f′(z)| veces y gira el ángulo de f′(z), igual en todas las direcciones, siempre que f′(z) no sea cero. Las dos flechas de la brújula giran juntas y siguen formando un ángulo recto. Una transformación que conserva los ángulos así se llama <em>conforme</em>. Las líneas de la cuadrícula también se cruzan en ángulo recto después de deformarse, aunque los cuadrados se vuelvan curvos.</p>
<h3>Donde f′ = 0, los ángulos se rompen</h3>
<p>Si f′(z) = 0 no hay nada por lo que multiplicar, y manda el término siguiente. Cerca de 0, z² lleva h a h², lo que duplica todos los ángulos: el ángulo recto entre 1 e i se abre hasta ser una línea recta. Por eso la gemela de la brújula se encoge hasta desaparecer en el centro de «Elevar el plano al cuadrado», y por eso las líneas de la cuadrícula que pasan por 0 se doblan ahí.</p>
<h3>Del revés</h3>
<p>1/z intercambia lo cercano y lo lejano: los puntos cerca de 0 salen volando lejos, y los lejanos se acercan. Los círculos que pasan por 0 se vuelven rectas, y las rectas que no pasan por 0 se vuelven círculos que pasan por 0. Por eso la cuadrícula se convierte en dos familias de círculos, todos pasando por 0 y cruzándose todavía en ángulo recto. (Los dos ejes, que pasan ellos mismos por 0, siguen siendo rectas.)</p>
<h3>De un círculo a un ala</h3>
<p>La transformación de Joukowski, z + 1/z, aplana el círculo unidad hasta el segmento que va de −2 a 2. Desplaza un poco el círculo, haciéndolo pasar todavía por z = 1, y su imagen se convierte en un ala: redondeada por delante y afilada por detrás. El borde afilado está exactamente donde f′ = 0, en z = 1, donde los ángulos se duplican y el círculo suave se pliega en una punta. La transformación lleva el flujo de aire alrededor del círculo a un flujo alrededor del ala. Ese flujo es idealizado (estable, sin rozamiento, plano), con el remolino justo para que el aire salga suavemente por el borde afilado. Las alas reales también dependen de la viscosidad, la turbulencia y su forma en tres dimensiones, que esta imagen deja fuera.</p>
<h3>Sobre el control «Cuánto se deforma»</h3>
<p>A medio camino, la imagen muestra (1 − t)·z + t·f(z), una mezcla en línea recta entre quedarse quieto y la transformación completa. Está ahí para ayudar a la vista a seguir cada punto. Cada mezcla también es una función compleja, pero tiene sus propios puntos conflictivos, y no es un camino que el plano recorra de verdad. Solo la imagen totalmente deformada muestra f.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>f′(z) es el límite de (f(z + h) − f(z)) / h cuando h se acerca a 0. Para una función compleja, el límite tiene que ser el mismo desde todas las direcciones, y eso es justo lo que obliga a que el estiramiento y el giro sean iguales en todas las direcciones: una función analítica con f′(z) ≠ 0 es conforme en z. En un punto donde f′ se anula en primer orden, los ángulos se multiplican por 2. El flujo del ala usa el potencial complejo F = ζ + r²/ζ + ik·log ζ alrededor de un círculo de radio r (con ζ medido desde su centro), con k elegido para que z = 1 sea un punto de estancamiento: la condición de Kutta.</p></details>
<div class="sources"><a class="source-link" href="https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/" target="_blank" rel="noopener">Apuntes del MIT 18.04, tema 10: transformaciones conformes (en inglés)</a><a class="source-link" href="https://webapps.math.uci.edu/~vmm/ConformalMaps/" target="_blank" rel="noopener">Transformaciones conformes para explorar (UC Irvine, 3D-XplorMath, en inglés)</a><a class="source-link" href="https://www.grc.nasa.gov/www/k-12/airplane/map.html" target="_blank" rel="noopener">La transformación de Joukowski, del cilindro al perfil alar (NASA Glenn, en inglés)</a><a class="source-link" href="https://books.google.com/books/about/Visual_Complex_Analysis.html?id=ogz5FjmiqlQC" target="_blank" rel="noopener">Tristan Needham, Visual Complex Analysis (en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/" target="_blank" rel="noopener">Bernhard Riemann (MacTutor, en inglés)</a></div>`,
  },
});

Wonderlattice.defineText('fingerprint', 'es', {
  eyebrow: 'PIEL',
  name: 'Haz crecer una huella dactilar',
  tagline: 'Nadie la dibuja: las crestas crecen solas y forman verticilos, presillas y arcos.',
  title: 'Haz crecer una huella dactilar.',
  subtitle: 'Nadie dibuja una huella dactilar. Dos señales se extienden y reaccionan, y las crestas aparecen solas.',
  field: 'Reacción-difusión · Patrones de Turing · Desarrollo',
  sceneLabel: 'La yema de un dedo, haciendo crecer sus crestas',
  tip: 'Toca la yema del dedo para que empiecen crestas ahí · Las flechas apuntan, Enter planta',
  actionLabel: 'Crecer de nuevo',
  canvasLabel:
    'La yema de un dedo donde las crestas crecen hacia fuera desde unos pocos puntos de partida. Haz clic o toca para que empiecen crestas en un punto, o usa las flechas para apuntar y Enter para plantar.',
  panelEyebrow: 'Da forma al crecimiento',
  whyLabel: '¿Cómo se forman las crestas?',
  nudge:
    'Fíjate en dónde se encuentran las ondas: cuando se juntan tres, dejan una pequeña Y. Luego presiona «Crecer de nuevo»: el mismo plan, detalles nuevos, como gemelos idénticos.',
  connection: {
    html: '<strong>Sin planos.</strong> Aquí, dos señales y unos pocos puntos de partida forman cada cresta. En «Una mente de muchos», unas pocas reglas entre vecinos mueven a toda una multitud.',
    label: 'Visita «Una mente de muchos»',
  },
  presets: [
    {
      name: 'Verticilo',
      note: 'El centro de la yema empieza primero.',
    },
    {
      name: 'Presilla',
      note: 'Un inicio que se sale por un lado.',
    },
    {
      name: 'Arco',
      note: 'Las crestas empiezan en el pliegue, pero nunca en el centro de la yema.',
    },
    {
      name: 'La tuya',
      note: 'Toca para elegir dónde empiezan las crestas.',
    },
  ],
  sceneNames: ['Un verticilo', 'Una presilla', 'Un arco', 'Tu propia huella'],
  mixed: 'Tu propia mezcla',
  lead: 'Ventaja para la primera onda',
  ridges: (n) => (n === 1 ? '1 cresta' : `${n} crestas`),
  spacing: 'Separación de las crestas',
  across: (n) => `unas ${n} a lo ancho`,
  speed: 'Velocidad de crecimiento',
  speeds: ['suave', 'tranquila', 'constante', 'ágil', 'a toda prisa'],
  look: 'Aspecto',
  looks: ['Piel cálida', 'Huella de tinta', 'Brillo nocturno'],
  marks: 'Mostrar dónde empiezan las crestas',
  roles: {
    pad: 'Centro de la yema',
    tip: 'Punta del dedo',
    crease: 'Pliegue',
    yours: 'Tu punto',
  },
  legendTitle: 'DÓNDE EMPIEZAN LAS CRESTAS',
  triradiusKey: 'Delta: una pequeña Y',
  started: 'creciendo',
  done: 'terminado',
  soon: (n) => (n <= 1 ? 'se une en más o menos una cresta' : `se une en unas ${n} crestas`),
  noSites: 'Toca la yema del dedo para empezar.',
  growing: (percent) => `Creciendo · ${percent}% de la yema`,
  quietly: (percent) => `Creciendo despacio · ${percent}%`,
  waiting: 'Toca la yema del dedo para que empiecen las crestas',
  types: {
    whorl: 'un verticilo',
    loop: 'una presilla',
    arch: 'un arco',
  },
  result: (type) => `Terminado: su centro forma ${type}`,
  triradii: (n) =>
    n === 0 ? 'no se encontró ningún delta' : n === 1 ? '1 delta (una pequeña Y)' : `${n} deltas (pequeñas Y)`,
  status: (type, n) => `${type[0].toUpperCase() + type.slice(1)} · ${n === 1 ? '1 delta' : `${n} deltas`}`,
  twin: (n) => `Gemelo ${n + 1} · «Crecer de nuevo» para un hermano`,
  full: 'Cuatro puntos de partida es el máximo. Elige «La tuya» para empezar con una yema nueva.',
  outside: 'Toca dentro de la yema del dedo.',
  guests: [
    {
      name: 'Alan Turing',
      note: 'En 1952 mostró que dos sustancias químicas que reaccionan y se extienden a distintas velocidades pueden hacer aparecer patrones.',
    },
  ],
  insight: {
    title: '¿De dónde salen las huellas dactilares?',
    html: `<p>Nadie dibuja una huella dactilar. Antes de nacer, la piel de cada yema dispone sus crestas por sí sola, y el patrón se mantiene toda la vida.</p>
<div class="insight-visual">activador + inhibidor, que se extienden a distintas velocidades → crestas</div>
<h3>La idea de Turing</h3>
<p>En 1952 Alan Turing mostró que dos sustancias químicas, que reaccionan entre sí y se extienden a distintas velocidades, pueden hacer aparecer un patrón en una mezcla uniforme. Más tarde surgió una manera popular de imaginarlo: un <em>activador</em> que produce más de sí mismo, y un <em>inhibidor</em>, que el activador también produce, que lo frena. Si el inhibidor se extiende más rápido, cada bulto de activador se rodea de un foso donde no puede crecer ningún otro bulto. El resultado son manchas o rayas, con una separación que elige la química.</p>
<h3>Ondas desde unos pocos lugares</h3>
<p>En 2023, un equipo dirigido desde la Universidad de Edimburgo descubrió que las crestas de las huellas siguen un sistema de Turing de este tipo, con las señales WNT y EDAR como activadores y BMP como inhibidor. Las crestas no aparecen en todas partes a la vez. Empiezan en unos pocos lugares: el centro de la yema del dedo, la punta cerca de la uña y junto al pliegue de la última articulación. Desde ahí se extienden como ondas, dejando crestas más o menos paralelas a su frente. Donde las ondas se encuentran, dejan los deltas con forma de Y. Las simulaciones del equipo produjeron arcos, presillas y verticilos cambiando dónde empiezan las crestas, cuándo empiezan y en qué dirección crecen: una yema que empieza tarde, por ejemplo, deja sitio a las crestas del pliegue y forma un arco.</p>
<h3>Por qué las huellas son tan distintas</h3>
<p>El estudio encontró que la ubicación de los puntos de partida, y cómo se encuentran sus ondas, crea la variedad de las huellas; en su discusión, los autores añaden que las diminutas diferencias al azar típicas de los patrones de Turing hacen cada huella todavía más única. Los gemelos idénticos comparten sus genes, y sus huellas a menudo comparten el tipo, pero no los detalles: en un estudio grande, las huellas de gemelos tenían el mismo tipo unas tres de cada cuatro veces, y aun así un sistema de reconocimiento de huellas las distinguía casi con la misma fiabilidad con que distingue a personas sin parentesco. «Crecer de nuevo» mantiene el plan y cambia solo los detalles más diminutos, y puedes ver cómo las crestas terminan y se bifurcan en sitios nuevos.</p>
<h3>Qué deja fuera esta sala</h3>
<p>Este es un modelo simplificado inspirado en esa investigación, no una simulación de piel embrionaria real. La yema es plana, los lugares de partida se colocan a mano y no aparecen genes ni sustancias químicas reales: solo dos señales inventadas con ecuaciones de libro de texto. Deja fuera el crecimiento del dedo, su yema en tres dimensiones y los poros del sudor que más tarde salpican cada cresta.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Las dos señales a (activador) y h (inhibidor) siguen ecuaciones adaptadas del modelo cúbico de Barrio, Varea, Aragón y Maini (aquí el activador se extiende un poco más despacio, 0.45 en lugar de 0.516, y h es su v con el signo cambiado): ∂a/∂t = 0.45 s ∇²a + 0.899 a − h − 3.15 a h², y ∂h/∂t = s ∇²h + 0.899 a − 0.91 h − 3.15 a h². El estado uniforme a = h = 0 es inestable frente a una gama de ondulaciones, que crecen más rápido con una longitud de onda de unas 9.5√s celdas de la cuadrícula, pero se mantiene exactamente uniforme hasta que un lugar de partida lo empuja, así que las crestas solo se extienden como ondas desde esos lugares. Sin términos cuadráticos (el único no lineal, a h², es cúbico), las rayas les ganan a las manchas. El control de separación de las crestas cambia s.</p><p>La sala nombra el resultado rodeando cada punto donde la dirección de las crestas deja de estar definida y sumando cuánto gira esa dirección (su índice de Poincaré): media vuelta en un sentido para el núcleo de una presilla, una vuelta entera para el centro de un verticilo y media vuelta en el otro sentido para un delta. Los peritos en huellas dactilares usan los mismos puntos de referencia. Los puntos justo en el borde de la yema no se detectan.</p></details>
<div class="sources"><a class="source-link" href="https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/" target="_blank" rel="noopener">Glover et al. (2023), The developmental basis of fingerprint pattern formation and variation (en inglés)</a><a class="source-link" href="https://doi.org/10.1098/rstb.1952.0012" target="_blank" rel="noopener">Turing (1952), The chemical basis of morphogenesis (en inglés)</a><a class="source-link" href="https://doi.org/10.1371/journal.pone.0035704" target="_blank" rel="noopener">Tao et al. (2012), reconocimiento de huellas de gemelos idénticos (en inglés)</a><a class="source-link" href="https://doi.org/10.1006/bulm.1998.0093" target="_blank" rel="noopener">Barrio et al. (1999), el modelo del que se adaptan estas ecuaciones (en inglés)</a></div>`,
  },
});

// El texto fijo de la página (index.html, elementos marcados con data-t).
Wonderlattice.defineText('page', 'es', {
  head: {
    title: 'Wonderlattice — Sigue tu curiosidad',
    description:
      'Pequeñas salas de matemáticas para jugar: dibuja con brazos que giran, teje telas, enfrenta dados entre sí, envía un dibujo a través de una tormenta, deforma el plano, haz crecer una huella dactilar y mucho más.',
  },
  skip: 'Saltar al contenido principal',
  header: {
    edition: 'UN LUGAR PEQUEÑO PARA UNA GRAN CURIOSIDAD',
    about: 'Sobre este lugar',
    trail: 'Mi recorrido',
    home: 'Inicio de Wonderlattice',
  },
  roomBar: {
    home: '← Todos los experimentos',
    label: 'Experimentos',
  },
  trailReturn: {
    noteHtml: '¿Qué notas ahora? <span>(opcional)</span>',
    save: 'Guardar esta idea',
    dismiss: 'Descartar',
    label: 'Descubrimiento revisitado',
    placeholder: 'Basta con una idea pequeña.',
  },
  home: {
    title: 'Sigue tu curiosidad.',
    intro:
      'Wonderlattice es una colección gratuita de pequeños experimentos prácticos con grandes ideas matemáticas. Elige uno y juega. No hay nada que acertar ni nada en lo que registrarse.',
  },
  motion: {
    title: 'Pinta con movimiento.',
    subtitle: 'Dos brazos que giran. Un lápiz. Mira lo que aparece.',
    field: 'Círculos dentro de círculos',
    onCanvas: 'En el lienzo',
    finish: 'Dibujarlo todo',
    surprise: '✧ Sorpréndeme',
    rotation: 'Rotación interior',
    opposite: 'Sentido opuesto',
    same: 'Mismo sentido',
    reach: 'Alcance del lápiz',
    reachHint: 'Cambia el equilibrio entre los dos brazos.',
    angle: 'Ángulo inicial',
    angleHint: 'Gira la posición inicial del brazo interior.',
    ink: 'Tinta',
    arms: 'Mostrar los brazos en movimiento',
    slow: 'Lento',
    flow: 'Fluido',
    fast: 'Rápido',
    why: '¿Por qué pasa esto?',
    presetsTitle: 'Por dónde empezar',
    share: 'Copiar este patrón',
    connectionHtml:
      '<strong>¿Y si un dibujo tuviera voz?</strong> Sigue la conexión entre el movimiento circular, las ondas y el sonido.',
    connectionGo: 'Entrar en el sonido',
    drawingLabel: 'Tu dibujo en vivo',
    canvasLabel:
      'Una curva animada trazada por la punta de dos brazos que giran. Usa los controles de al lado para cambiar su forma.',
    restart: 'Empezar el dibujo de nuevo',
    saveLabel: 'Guardar el dibujo como PNG',
    controlsLabel: 'Controles del dibujo',
    surpriseTitle: 'Probar una combinación nueva',
    rotationExact: 'Velocidad exacta de la rotación interior',
    inkLabel: 'Paleta de tinta',
    palette0: 'Aurora: de menta a violeta',
    palette1: 'Brasa: de oro a rosa',
    palette2: 'Glaciar: de azul a plata',
    palette3: 'Luz de luna: blanco cálido',
    speedLabel: 'Velocidad del dibujo',
    presetsLabel: 'Patrones de inicio',
  },
  stage: {
    makeItYours: 'Hazlo tuyo',
    keep: '✧ Guardar este momento',
    nudge: 'Una pequeña pista',
    reset: 'Empezar de nuevo',
    presetsTitle: 'Prueba otra posibilidad',
    share: 'Copiar esta exploración',
    saveTitle: 'Guardar imagen',
    guestLabel: 'Un matemático de visita',
    sceneLabel: 'Exploración interactiva',
    saveLabel: 'Guardar esta escena como imagen',
    controlsLabel: 'Controles de la exploración',
  },
  footer: {
    note: 'Sigue una forma. Encuentra una pequeña maravilla.',
    promise: 'Sin puntuaciones. Sin respuestas correctas.',
    credit: 'Hecho por Eyal Weiss',
    about: 'Acerca de',
  },
  why: {
    titleHtml: 'Un poco de movimiento,<br />muchas posibilidades.',
    p1: 'Imagina un lápiz en el extremo de un brazo. Ahora une ese brazo al extremo de otro brazo que gira. Cada movimiento es sencillo. Su combinación dibuja la curva que ves.',
    reveal: 'Muéstrame los brazos',
    h2: 'Cuando los ritmos vuelven a encontrarse',
    p2: 'Si un brazo da un número entero de vueltas mientras el otro también da un número entero, los dos pueden volver juntos a su posición inicial. El lápiz cierra su lazo.',
    p3: 'Un cambio diminuto de velocidad puede hacer que ese reencuentro tarde mucho más. Aparecen lazos nuevos entre medias, que tejen un dibujo mucho más denso. Prueba «Casi un círculo» y luego «Dibujarlo todo».',
    h3: 'Hay una conexión musical',
    p4: 'Las posiciones horizontal y vertical de un punto que gira se mueven cada una como una onda suave. Suma las posiciones de dos puntos que giran y estarás sumando ondas. Combinar ondas también es fundamental en el sonido. Este dibujo es un pariente visual de esa idea, no una simulación de un instrumento musical.',
    more: '¿Te pica la curiosidad por las matemáticas?',
    p5: 'La posición del lápiz es la suma de dos movimientos circulares:',
    p6Html:
      'Aquí, <em>a</em> y <em>b</em> son las longitudes de los brazos, <em>k</em> es la velocidad de rotación del brazo interior en relación con la del exterior, y <em>φ</em> es su ángulo inicial. Los dos ángulos se miden respecto al lienzo, no respecto al otro brazo.',
    p7: 'Una razón de velocidades racional da un camino cerrado. Una razón irracional nunca se cerraría del todo. Todos los ajustes decimales finitos de este lugar son racionales, aunque sus caminos tarden mucho en cerrarse.',
    source1: 'Epitrocoides e hipotrocoides',
    source2: 'El espirógrafo',
    close: 'Cerrar la explicación',
  },
  narration: {
    listen: 'Escuchar esta idea',
  },
  about: {
    title: 'Te damos la bienvenida a Wonderlattice.',
    p1: 'Un pequeño experimento para disfrutar de ideas matemáticas jugando. Cambia algo. Sigue lo que te llame la atención. Haz algo que te guste.',
    p2: 'Cada pequeño mundo conecta un trozo de matemáticas con algo con lo que puedes jugar: formas, sonidos, multitudes, juegos, patrones que puedes crear. No hay ninguna lección que terminar ni nada que acertar.',
    cardHtml:
      '<strong>Hazlo tuyo</strong><br />Elige un punto de partida, mueve un control y sigue lo que te sorprenda. Cada sala tiene una explicación opcional, y puedes guardar una imagen cuando quieras.',
    p3: 'Todo aquí funciona en tu navegador, incluso sin conexión. No hay cuentas, ni rastreo, ni cookies, ni chat con IA. El sonido está apagado hasta que lo actives.',
    privacyTitle: 'Tu privacidad',
    privacy:
      'Wonderlattice no recopila nada. El sitio está alojado en Cloudflare, que guarda los registros de acceso habituales (dirección IP, hora, página) según su propia política de privacidad. Mi recorrido y tu elección de idioma se guardan solo en este navegador, y solo cuando los usas; al borrar los datos del sitio desaparecen. La narración usa las voces de tu navegador: algunas voces en línea envían el texto que se lee (estas explicaciones, nunca tus notas) al servicio de voz del fabricante del navegador.',
    whoTitle: 'Quién hace esto',
    whoHtml:
      'Wonderlattice es un proyecto personal, gratuito y sin fines comerciales de Eyal Weiss. Escribe para saludar a <a href="mailto:eyal8488@gmail.com">eyal8488@gmail.com</a> o en <a href="https://github.com/eyal-weiss" target="_blank" rel="noopener noreferrer">GitHub</a>.',
    legal:
      'Los modelos de aquí están simplificados para jugar y explicar; no son predicciones, mediciones ni consejos. Se ofrece tal cual, sin garantía. Los enlaces llevan a sitios independientes; no implican afiliación ni respaldo. Rubik’s Cube® es una marca registrada de Spin Master Toys UK Limited; Wonderlattice no está afiliado a ella.',
    creditsHtml:
      'El código y los textos se pueden reutilizar libremente bajo la licencia MIT. Los retratos de matemáticos históricos son de dominio público, excepto la foto de John Conway de Thane Plambeck (recortada, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</a>). Los visitantes dibujados son bocetos divertidos, no retratos fieles.',
    close: 'Cerrar «Acerca de»',
  },
  copy: {
    title: 'Tu patrón, para guardarlo.',
    select: 'Seleccionar el texto',
    close: 'Cerrar los detalles del patrón',
    textLabel: 'Ajustes del patrón o enlace para compartir',
  },
  trailSave: {
    title: 'Un momento que vale la pena guardar.',
    noteHtml: '¿Qué te llamó la atención? <span>(opcional)</span>',
    private: 'Se guarda solo en este navegador. Puedes exportar tu recorrido más tarde.',
    save: 'Guardar en mi recorrido',
    close: 'Cerrar el cuadro de guardado',
    placeholder: 'Una pregunta, una sorpresa, una observación diminuta…',
  },
  trail: {
    title: 'Mi recorrido.',
    intro: 'Unos pocos momentos que elegiste guardar. Vuelve a una sala con esos ajustes y mira qué notas esta vez.',
    threads: 'Hilos para seguir',
    export: 'Exportar mi recorrido',
    import: 'Importar un recorrido',
    private:
      'Esto se queda en este dispositivo a menos que lo exportes. Importar reemplaza el recorrido actual. Borrar los datos del navegador lo elimina.',
    close: 'Cerrar el recorrido',
    importLabel: 'Importar un recorrido (un archivo JSON de Wonderlattice)',
  },
  insight: {
    close: 'Cerrar la explicación',
  },
});
