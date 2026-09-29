// El texto fijo de la página (index.html, elementos marcados con data-t).
Wonderlattice.defineText('shots', 'es', {
  eyebrow: 'ESTADÍSTICA',
  name: 'Dos jugadores, tres clasificaciones',
  tagline: 'Un tirador puede ganar de cerca y ganar de lejos, y aun así perder en total.',
  title: 'Dos jugadores, tres clasificaciones.',
  subtitle:
    'Dos jugadores tiran de cerca y de lejos. Cambia cuántos tiros fáciles y difíciles hace cada uno y mira cómo se da la vuelta la clasificación total.',
  field: 'Estadística · Medias ponderadas · Una pequeña sorpresa',
  sceneLabel: 'Una cancha · Dos jugadores · Tres clasificaciones',
  sceneName: 'La mezcla de tiros',
  tip: 'Arrastra los controles para cambiar cuántos tiros de cerca y de lejos hace cada jugador',
  actionLabel: 'Intercambiar la mezcla',
  canvasLabel:
    'Una cancha de baloncesto con los tiros de cerca y de lejos de cada jugador como puntos, y clasificaciones de cerca, de lejos y en total.',
  panelEyebrow: 'Cambia la mezcla de tiros',
  whyLabel: '¿Cómo puede pasar eso?',
  nudge:
    'Dale al jugador A sobre todo tiros de lejos y al jugador B sobre todo tiros de cerca. Mira cómo se da la vuelta la clasificación total, aunque la puntería de ninguno haya cambiado.',
  connection: {
    html: '<strong>Un número combinado puede ocultar lo que lleva dentro.</strong> Aquí, un porcentaje total es una media ponderada, y los pesos son la mezcla de tiros.',
    label: 'Sigue otra sorpresa',
  },
  presets: [
    { name: 'Mezcla pareja', note: 'El mejor jugador también gana en total.', badge: 'Pareja' },
    { name: 'Mezcla sesgada', note: 'Prueba la sorpresa.', badge: 'Sesgada' },
    { name: 'Mezcla extrema', note: '¿Hasta dónde puede estirarse la diferencia?', badge: 'Extrema' },
  ],
  players: { a: 'Jugador A', b: 'Jugador B' },
  short: { a: 'A', b: 'B' },
  closeLabel: 'De cerca',
  farLabel: 'De lejos',
  overallLabel: 'En total',
  attemptsHint: '¿Cuántos tiros de este tipo?',
  makesOf: (makes, attempts) => `${makes} de ${attempts}`,
  percent: (pct) => `${Math.round(pct * 100)}%`,
  verdict: {
    tied: 'Los dos jugadores están igualados en total.',
    aWins: 'El jugador A va primero en total.',
    bWins: 'El jugador B va primero en total.',
    reversal: (winner) => `${winner} gana de cerca y de lejos, y aun así va por detrás en total.`,
  },
  legend: {
    made: 'acierto',
    missed: 'fallo',
    perDot: (n) => (n === 1 ? 'un punto por tiro' : `un punto ≈ ${n} tiros`),
  },
  labels: {
    caption: 'El porcentaje total de cada jugador es la suma de sus aciertos dividida entre la suma de sus intentos.',
  },
  guests: [
    {
      name: 'Edward H. Simpson',
      note: 'Una tendencia que aparece en cada grupo puede invertirse al juntar los grupos.',
    },
    {
      name: 'George Udny Yule',
      note: 'La misma inversión aparece siempre que una tasa combinada esconde una mezcla desigual.',
    },
  ],
  insight: {
    title: '¿Cómo puede perder en total el mejor jugador?',
    html: `<p>Un porcentaje de tiro total no es la media de dos porcentajes. Es el total de aciertos dividido entre el total de intentos, así que es una media <em>ponderada</em>, según cuántos tiros se hicieron desde cada distancia. Cuando los dos jugadores hacen mezclas muy distintas de tiros de cerca y de lejos, esa ponderación puede favorecer al jugador que va por detrás en las dos categorías.</p>
<div class="insight-visual">La misma puntería en cada distancia, otra mezcla de tiros, otro líder en total.</div>
<h3>Prueba una mezcla pareja</h3>
<p>Dales a los dos jugadores el mismo reparto de tiros de cerca y de lejos. Ahora el mejor jugador en las dos categorías también gana en total. La inversión solo aparece cuando las mezclas son distintas.</p>
<h3>Un caso real: Berkeley, 1973</h3>
<p>En la Universidad de California en Berkeley, la tasa total de admisión al posgrado parecía favorecer a los hombres. Al mirar departamento por departamento, la mayoría no mostraba sesgo contra las mujeres, o mostraba un pequeño sesgo a su favor. Las mujeres se habían presentado en mayor número a departamentos más competitivos, con tasas de admisión bajas para todos, y eso hundía su tasa combinada. En qué número confiar depende de entender por qué la mezcla era distinta, no solo de la aritmética.</p>
<h3>Lo que supone este modelo</h3>
<p>Cada jugador tiene una tasa de acierto fija en cada distancia, que se aplica a cuantos tiros le des. Es un modelo simplificado para ilustrar la aritmética de la paradoja, no una simulación de tiros reales ni de decisiones de admisión reales.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Para un jugador con <code>c</code> aciertos de <code>C</code> intentos de cerca y <code>f</code> aciertos de <code>F</code> intentos de lejos, la tasa total es (c + f) / (C + F), no la media de c/C y f/F. Un jugador puede tener a la vez un c/C y un f/F más altos que el otro, mientras el otro tiene un (c + f) / (C + F) más alto, siempre que los números de intentos C y F sean lo bastante distintos entre ellos.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Simpson%27s_paradox" target="_blank" rel="noopener">La paradoja de Simpson, Wikipedia (en inglés)</a><a class="source-link" href="https://www.science.org/doi/10.1126/science.187.4175.398" target="_blank" rel="noopener">Bickel, Hammel y O’Connell, «Sex bias in graduate admissions: data from Berkeley», Science 187 (1975) (en inglés)</a></div>`,
  },
});
