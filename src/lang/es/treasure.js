Wonderlattice.defineText('treasure', 'es', {
  eyebrow: 'PROBABILIDAD',
  name: 'El detector de tesoros imperfecto',
  tagline: 'Un detector que acierta el 95% de las veces pita. ¿Hay tesoro? Normalmente no.',
  title: 'El detector de tesoros imperfecto.',
  subtitle: 'Recorre la isla y cava donde pite. ¿Cuántas veces está el tesoro de verdad?',
  field: 'Probabilidad · Regla de Bayes · Una pequeña sorpresa',
  sceneLabel: 'Una isla · Un detector honrado',
  sceneName: 'La isla del tesoro',
  tip: 'Toca una casilla que pite para cavar · Las flechas apuntan, Enter cava',
  actionLabel: 'Recorrer la isla',
  canvasLabel:
    'Una isla de casillas. Un detector pita sobre algunas; al cavar aparece tesoro o nada. Al lado, 1000 casillas como puntos, ordenadas según lo que dice el detector.',
  panelEyebrow: 'Cambia las probabilidades',
  whyLabel: '¿Por qué un pitido se equivoca tanto?',
  nudge:
    'Haz el tesoro más escaso y mira los pitidos: cada vez más son falsas alarmas, aunque el detector no ha cambiado en absoluto.',
  connection: {
    html: '<strong>El azar engaña a la intuición.</strong> En la sala Los dados que se ganan entre sí, el «mejor» depende del rival. Aquí, lo que significa un pitido depende de lo escaso que sea el tesoro.',
    label: 'Lanza los dados raros',
  },

  presets: [
    { name: 'Tesoro por todas partes', note: 'Un pitido es buena noticia.', badge: '30%' },
    { name: 'Tesoro escaso', note: 'Prueba la sorpresa.', badge: '2%' },
    { name: 'Un segundo detector', note: 'Dos pitidos pesan mucho más.', badge: '×2' },
  ],

  treasure: '¿Cuánto tesoro hay?',
  treasureHint: 'La parte de las casillas que esconde tesoro.',
  share: (pct) => `${pct}% · 1 de cada ${Math.round(100 / pct)}`,
  accuracy: 'Cuántas veces acierta el detector',
  accuracyHint: 'Con esta frecuencia pita sobre el tesoro y calla sobre la arena.',
  second: 'Usa también un segundo detector (solo cuentan las casillas donde pitan los dos)',

  actions: { sweep: 'Recorrer la isla', digAll: 'Cavar en cada pitido', again: 'Otra isla' },
  status: {
    ready: 'Recorre la isla para empezar',
    swept: (beeps) => `${beeps} ${beeps === 1 ? 'pitido' : 'pitidos'} · toca uno para cavar`,
    digging: (dug, beeps, found) =>
      `${dug} de ${beeps} pitidos cavados · ${found} ${found === 1 ? 'tesoro' : 'tesoros'}`,
    done: (beeps, found) =>
      `${beeps} ${beeps === 1 ? 'pitido cavado' : 'pitidos cavados'}: ${found} ${found === 1 ? 'tesoro' : 'tesoros'}, ${beeps - found} ${beeps - found === 1 ? 'falsa alarma' : 'falsas alarmas'}`,
  },
  dug: { treasure: '¡Tesoro!', nothing: 'Aquí no hay nada.' },
  quiet: 'Aquí el detector no pitó.',

  readout: {
    title: 'Un pitido significa tesoro',
    story: (total, treasure, found, falseAlarms, both) =>
      `De cada ${total.toLocaleString('es')} casillas, ${treasure} esconden tesoro. ${both ? 'Los dos detectores pitan' : 'El detector pita'} sobre ${found} de ellas, y sobre ${falseAlarms} ${falseAlarms === 1 ? 'vacía' : 'vacías'}. Así que ${found} de ${found + falseAlarms} pitidos son tesoro.`,
    percent: (p) => `${Math.round(p * 100)}%`,
    unknown: '?',
    hidden: 'Recorre la isla y cava donde pite: ¿cuántas veces está el tesoro de verdad? La respuesta aparece aquí.',
  },

  labels: {
    island: 'La isla',
    thousand: 'Cada 1000 casillas',
    hidden: 'Cava donde pite para ver qué significa un pitido',
    found: 'tesoro, pita',
    missed: 'tesoro, calla',
    falseAlarm: 'arena, pita',
    quiet: 'arena, calla',
  },

  guests: [
    {
      name: 'Thomas Bayes',
      note: 'Una pista debe cambiar lo que piensas, pero cuánto depende de lo que creías antes.',
    },
    {
      name: 'Pierre-Simon Laplace',
      note: 'Encontré la misma regla por mi cuenta y la usé para las estrellas, los tribunales y el censo.',
    },
  ],

  insight: {
    title: '¿Por qué un pitido se equivoca tanto?',
    html: `<p>Imagina 1000 casillas, con tesoro bajo 20 de ellas. Un detector que acierta el 95% de las veces pita sobre 19 de las 20. Pero también pita, por error, sobre el 5% de las 980 casillas vacías: 49. Son 68 pitidos, y solo 19 son tesoro, alrededor del 28%. El detector es bueno; el tesoro es escaso, así que las falsas alarmas superan a los hallazgos.</p>
<div class="insight-visual">19 hallazgos + 49 falsas alarmas → un pitido es tesoro 19 veces de 68</div>
<h3>Contar funciona mejor que los porcentajes</h3>
<p>Planteado en porcentajes («2% de las casillas, 95% de acierto»), este acertijo engaña a la mayoría de la gente, médicos incluidos. Planteado como recuento de casillas, como los puntos junto a la isla, casi todo el mundo acierta. Los psicólogos Gerd Gigerenzer y Ulrich Hoffrage lo mostraron en 1995; llaman a estos recuentos frecuencias naturales.</p>
<h3>Por qué ayuda tanto un segundo detector</h3>
<p>Si un segundo detector, con sus propios errores independientes, también pita, las falsas alarmas casi desaparecen: de las 49, solo unas 2 engañan a los dos. Ahora la mayoría de los pitidos dobles son tesoro. Así se acumulan las pruebas.</p>
<h3>Lo que simplifica esta sala</h3>
<p>El detector acierta igual sobre el tesoro que sobre la arena, y los errores del segundo detector son independientes de los del primero. Las pruebas repetidas reales casi nunca son tan independientes, así que una segunda prueba suele ayudar menos que aquí. Cada isla se construye para coincidir con los recuentos esperados, redondeados a casillas enteras; una búsqueda real variaría alrededor de ellos. La misma aritmética se aplica a las pruebas de detección de enfermedades raras: un resultado positivo es un motivo para seguir mirando, no un veredicto.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Es la regla de Bayes. Con tesoro en una parte r de las casillas y un detector que acierta con probabilidad a, P(tesoro | pitido) = a·r / (a·r + (1 − a)·(1 − r)). Con dos detectores independientes, P(tesoro | pitan los dos) = a²·r / (a²·r + (1 − a)²·(1 − r)). La regla lleva el nombre de Thomas Bayes, cuyo ensayo se publicó en 1763, después de su muerte; Pierre-Simon Laplace la desarrolló por su cuenta y la usó ampliamente. G. Gigerenzer y U. Hoffrage, «How to improve Bayesian reasoning without instruction: frequency formats», Psychological Review 102 (1995).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Base_rate_fallacy" target="_blank" rel="noopener">Falacia de la tasa base (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Bayes%27_theorem" target="_blank" rel="noopener">Teorema de Bayes (en inglés)</a></div>`,
  },
});
