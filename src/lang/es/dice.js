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
