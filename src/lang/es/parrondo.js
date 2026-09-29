Wonderlattice.defineText('parrondo', 'es', {
  eyebrow: 'AZAR',
  name: 'Dos juegos perdedores que ganan',
  tagline: 'Cada juego de monedas te va quitando dinero poco a poco. Mézclalos, y el dinero sube.',
  title: 'Dos juegos perdedores que ganan.',
  subtitle: 'El juego A pierde. El juego B pierde. Mira a mil jugadores probar cada uno, y a otros mil mezclarlos.',
  field: 'Probabilidad · Cadenas de Markov · Una paradoja',
  sceneLabel: '1000 jugadores por juego · 1000 rondas',
  sceneNames: ['Solo A', 'Solo B', 'A o B al azar'],
  raceName: 'A, B y la mezcla, lado a lado',
  patternName: (pattern) => `El patrón ${pattern}`,
  tip: 'Las líneas gruesas son el jugador promedio; las discontinuas, el valor esperado exacto · Un juego solo muestra además una franja con la mitad central de sus jugadores · Elige un juego en el panel',
  actionLabel: 'Jugadores nuevos',
  canvasLabel:
    'Un gráfico de ganancias a lo largo de 1000 rondas. Al principio, tres grupos de 1000 jugadores juegan A, B, y A o B al azar, lado a lado: las líneas gruesas son sus ganancias promedio y las discontinuas, las ganancias esperadas exactas. Un juego jugado solo muestra además una franja sombreada con la mitad central de sus jugadores, y las líneas de los juegos ya probados quedan tenues. Con los cubos visibles, tres barras dan la parte de jugadores cuyas monedas son un múltiplo de 3, uno más o dos más.',
  panelEyebrow: 'Elige un juego',
  whyLabel: '¿Cómo pueden ganar dos perdedores?',
  nudge:
    'Mira las tres líneas: A y B se hunden mientras la mezcla sube. Luego juega cada juego por separado e inventa tus propios patrones: muchos ganan, pero algunos, como A B, siguen perdiendo.',
  connection: {
    html: '<strong>Parece justo, y está lleno de sorpresas.</strong> Aquí, dos juegos perdedores ganan juntos. En Los dados que se ganan entre sí, cada dado tiene otro que le gana.',
    label: 'Lanza los dados raros',
  },

  presets: [
    { name: 'Solo B', note: 'Una moneda mala en cada múltiplo de 3.', badge: 'B' },
    { name: 'A o B al azar', note: 'Dos perdedores hacen un ganador.', badge: 'A|B' },
    { name: 'A A B B', note: 'Un ritmo fijo también gana.', badge: 'AABB' },
  ],

  rules: {
    title: 'Los dos juegos',
    aHtml: '<strong>A</strong> · una moneda que gana el 49,5% de las veces.',
    bHtml:
      '<strong>B</strong> · si tus monedas son un múltiplo de 3, una moneda mala que gana el 9,5%; si no, una buena que gana el 74,5%.',
    stakes: 'Cada victoria es una moneda más; cada derrota, una menos. Todos empiezan en 0.',
  },

  // Los nombres de los juegos, como letras (el modelo siempre los llama A y B).
  letters: ['A', 'B'],
  modeLabel: '¿A qué juego juegan?',
  // Por número de modo; la carrera (4) se muestra primero.
  modes: ['Solo A', 'Solo B', 'Mezcla al azar', 'Mi patrón', 'Los tres a la vez'],

  patternLabel: 'Inventa tu propio patrón',
  patternHint: 'Se repite, ronda tras ronda, para cada jugador. Hasta 12 letras.',
  add: (game) => `Añadir ${game}`,
  undo: 'Deshacer',
  undoLabel: 'Quitar la última letra',

  buckets: '¿Por qué? Mostrar los tres cubos',

  readout: {
    expected: (rounds) => `Esperado tras ${rounds} rondas`,
    perRound: (value) => `${value} por ronda, a la larga`,
    average: (players, value) => `Promedio de ${players} jugadores hasta ahora: ${value}`,
    games: ['Solo A', 'Solo B', 'A o B al azar'],
    averages: (players, a, b, mix) =>
      `Promedios de ${players} jugadores cada uno hasta ahora: A ${a} · B ${b} · mezcla ${mix}`,
    perRounds: (a, b, mix) => `A la larga, por ronda: A ${a} · B ${b} · mezcla ${mix}`,
    badShareRace: (live, alone, mixed, line) =>
      `Rondas de B jugadas en un múltiplo de 3: ${alone} cuando B juega solo, ${mixed} en la mezcla (${live} hasta ahora). B solo gana por debajo del ${line}.`,
    badShare: (live, exact, line) =>
      `Rondas de B jugadas en un múltiplo de 3: ${live} hasta ahora, ${exact} a la larga. B solo gana por debajo del ${line}.`,
    noB: 'Solo A nunca juega a B, así que los cubos se reparten en un tercio cada uno.',
  },

  status: {
    round: (t, rounds) => `Ronda ${t} de ${rounds}`,
    done: (rounds) => `${rounds} rondas jugadas`,
  },
  announce: {
    done: (game, average, expected) =>
      `${game}: el jugador promedio termina con ${average} monedas; lo esperado era ${expected}.`,
    race: (a, b, mix) =>
      `Tras 1000 rondas, el jugador promedio tiene ${a} monedas con A, ${b} con B y ${mix} con la mezcla.`,
  },

  // Palabras dibujadas en el gráfico.
  labels: {
    rounds: 'rondas',
    start: 'inicio',
    expected: (value) => `esperado ${value}`,
    // El nombre de un juego y su promedio, donde terminan las líneas de la carrera; cada idioma puede cambiar el orden.
    tag: (name, value) => `${name} ${value}`,
    average: (value) => `promedio ${value}`,
    short: ['A', 'B', 'mezcla'],
    buckets: 'Jugadores según las monedas que sobran al repartirlas de tres en tres',
    bucketsMix: 'Jugadores de la mezcla, según las monedas que sobran al repartirlas de tres en tres',
    bucket: ['múltiplo de 3', 'uno más', 'dos más'],
    coin: ['moneda mala de B', 'moneda buena de B', 'moneda buena de B'],
    breakEven: 'B queda a cero',
  },

  guests: [
    {
      name: 'Juan Parrondo',
      note: 'Ideó estos juegos en 1996, como versión con monedas de un trinquete que hace que unas partículas agitadas se desplacen en un solo sentido.',
    },
    {
      name: 'Richard Feynman',
      note: 'En mis clases, un trinquete diminuto en un gas tibio no puede girar hacia un lado gratis: su uñeta se agita tanto como su rueda.',
    },
  ],

  insight: {
    title: '¿Cómo pueden ganar dos perdedores?',
    html: `<p>El juego A es casi una moneda justa: pierde alrededor de una moneda cada 100 rondas. El juego B es más raro, porque mira tus monedas. Cuando son un múltiplo de 3 (…, −3, 0, 3, 6, …) usa una moneda mala; si no, una buena. En un múltiplo de 3 sueles perder una moneda, y desde ahí la moneda buena suele devolverte directamente al múltiplo de 3. Así, B no deja de mandar a los jugadores de vuelta a su moneda mala: allí se juega alrededor del 38,4% de sus rondas, justo por encima del 37,7% con el que B quedaría a cero. B pierde, despacio.</p>
<div class="insight-visual">B solo: 38,4% de sus rondas con la moneda mala → pierde · Mezclado con A: 34,5% → B gana más de lo que pierde A</div>
<h3>Mezclar suelta a los jugadores</h3>
<p>A no se fija en lo que tienes, así que una ronda de A sube o baja tus monedas al azar y rompe el ritmo de B. Al mezclarlo, las rondas de B caen en un múltiplo de 3 solo alrededor del 34,5% de las veces. Ahora la moneda buena de B se usa más de lo que B permite por sí solo, y B gana más de lo que pierde A. A la larga, por ronda: A pierde 0,010 de moneda, B pierde 0,0087, y elegir A o B al azar gana 0,0157. Activa los cubos para ver cómo la parte de jugadores en un múltiplo de 3 baja por debajo de la línea en la que B queda a cero.</p>
<h3>No toda mezcla gana</h3>
<p>A A B B gana, y A B B gana con holgura, pero A B, alternando estrictamente, sigue perdiendo. Prueba algunos patrones y mira el número a la larga.</p>
<h3>Lo que esto no significa</h3>
<p>B no es un juego perdedor corriente: sus probabilidades dependen de tu capital, y esa dependencia es todo el truco. Los juegos de un casino no miran cuánto dinero tienes, así que mezclarlos no convierte perder en ganar: esto no sirve para ganarle a un casino. Hay quien ha propuesto efectos parecidos a los de Parrondo en biología y en finanzas, pero esas ideas se discuten, y esta sala las deja fuera. Los jugadores de aquí son una simulación, así que su promedio oscila, alrededor de una moneda tras 1000 rondas; la línea discontinua es el valor esperado exacto, calculado en lugar de simulado.</p>
<details><summary>Las matemáticas, si las quieres</summary><p>Solo importan tus monedas módulo 3, así que cada juego es una cadena de Markov con tres estados. El juego A gana con probabilidad ½ − ε, y B con probabilidad 1/10 − ε en el estado 0 y ¾ − ε en los estados 1 y 2, con ε = 0,005. La distribución estacionaria de B es aproximadamente (0,3836; 0,1543; 0,4621); con ε = 0 es exactamente (5/13, 2/13, 6/13), y B es exactamente justo. La ganancia esperada por ronda es Σ πᵢ (2pᵢ − 1). Elegir A o B al azar es una sola cadena con las probabilidades de los dos juegos promediadas; un patrón que se repite, como A A B B, es el producto de las matrices de sus rondas. Juan Parrondo ideó los juegos en 1996, como una versión discreta de un «trinquete browniano intermitente», pariente del trinquete y la uñeta del capítulo 46 del volumen I de The Feynman Lectures on Physics. G. P. Harmer y D. Abbott, “Losing strategies can win by Parrondo’s paradox”, Nature 402, 864 (1999). P. Amengual, P. Meurs, B. Cleuren y R. Toral, “Reversals of chance in paradoxical games”, Physica A (2006).</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/47220" target="_blank" rel="noopener">Harmer y Abbott, Nature (1999) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parrondo%27s_paradox" target="_blank" rel="noopener">La paradoja de Parrondo (en inglés)</a><a class="source-link" href="https://arxiv.org/abs/math/0601404" target="_blank" rel="noopener">Reversals of chance in paradoxical games (en inglés)</a></div>`,
  },
});
