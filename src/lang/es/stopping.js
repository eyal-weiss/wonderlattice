/* Detente en el 37% · palabras para el visitante (es). */
Wonderlattice.defineText('stopping', 'es', {
  eyebrow: 'PARADA ÓPTIMA',
  name: 'Detente en el 37%',
  tagline:
    'Descubre 100 cartas una a una y detente en la más alta. Una regla sencilla acierta más de una vez de cada tres.',
  title: 'Cuándo dejar de buscar.',
  subtitle:
    'Descubre las cartas una a una y detente en la más alta, sin vuelta atrás. Abajo, miles de repartos muestran cuándo lanzarse.',
  field: 'Probabilidad · Parada óptima · El problema de la secretaria',
  sceneLabel: '100 cartas · Una a una · Sin vuelta atrás',
  sceneName: 'Encuentra la carta más alta',
  tip: 'Toca el mazo, o pulsa →, para la siguiente carta · Toca tu carta, o pulsa Enter, para quedártela · Abajo, las barras son 10\u202f000 repartos jugados con la regla, y la línea, la probabilidad exacta',
  actionLabel: 'Cartas nuevas',
  canvasLabel:
    'Un juego de 100 cartas boca abajo, cada una con un número distinto escondido. Arriba: la carta que se acaba de descubrir, la mejor carta anterior a ella y el mazo. Debajo, una franja con una marca por cada carta descubierta, dorada donde una carta superó a todas las anteriores. Cuando termina una partida, la franja muestra el puesto de cada carta, con la marca más alta para la carta más alta, y señala tu carta, la de la regla y la más alta. Abajo, un gráfico: para cada número de cartas que solo se miran antes de lanzarse, la probabilidad de que la regla gane, en barras a partir de 10\u202f000 repartos simulados y en una línea calculada con exactitud. Encontrar la mejor de todas es más probable tras mirar 37 cartas, con un 37%; si vale cualquiera de las 10 mejores, tras 14 cartas, con un 82%.',
  panelEyebrow: 'Mira, y luego lánzate',
  whyLabel: '¿Por qué el 37%?',
  nudge:
    'Juega primero unas cuantas partidas por tu cuenta. Luego elige cuántas cartas solo mira la regla, y busca dónde está más alta la curva. Después marca «Me vale cualquiera de las 10 mejores» y mira cómo se mueve el pico.',
  connection: {
    html: '<strong>Decidir antes de haberlo visto todo.</strong> Aquí tienes que elegir una carta antes de haber visto el resto. En «El detector de tesoros imperfecto», decides qué significa un pitido cuando la mayoría de los pitidos se equivocan.',
    label: 'Buscar el tesoro',
  },

  presets: [
    { name: 'Lanzarse pronto', note: 'Mira 10 y lánzate: 23%.', badge: '10' },
    { name: 'Mira 37 y lánzate', note: 'La mejor de todas, el 37% de las veces.', badge: '37' },
    { name: 'Valen las 10 mejores', note: 'Mira solo 14: 82%.', badge: '14' },
  ],

  rules: {
    title: 'El juego',
    text: 'Cada una de las 100 cartas esconde un número distinto, de cualquier tamaño. Se descubren una a una. Quédate con una carta cuando creas que es la más alta de las 100. Una carta que dejas pasar se pierde para siempre, y si llegas a la última carta, es tuya.',
  },
  next: 'Siguiente carta',
  take: 'Tomar esta carta',
  again: 'Otra partida',

  look: 'Cartas que la regla solo mira',
  lookHint: 'No se queda con ninguna, y luego toma la primera carta que las supere a todas.',
  top: 'Me vale cualquiera de las 10 mejores',

  // El puesto de una carta entre las 100: 1 es la más alta, luego la 2.ª, la 3.ª, … la 11.ª, … la 21.ª más alta.
  place: (rank) => (rank === 1 ? 'la más alta' : `la ${rank}.ª más alta`),

  readout: {
    best: (look) => `Mira ${look} y lánzate: encuentra la mejor de todas`,
    top: (look) => `Mira ${look} y lánzate: encuentra una de las 10 mejores`,
    simulated: (deals, chance) => `En ${deals} repartos simulados: ${chance}.`,
    peak: (look, chance) => `El mejor número de cartas para mirar: ${look}, con un ${chance}.`,
    random: (chance) => `Tomando una carta al azar: ${chance}.`,
    moreTitle: 'La mejor de todas, con menos o más cartas',
    more: (cards, look, chance) => `${cards} cartas: mira ${look}, ${chance}`,
  },

  game: {
    playing: (card, cards, best) => `Carta ${card} de ${cards} boca arriba. La mejor de antes: ${best}.`,
    first: (cards) => `Carta 1 de ${cards} boca arriba. Todavía no hay ninguna antes.`,
    took: (card, place) => `Tomaste la carta ${card}: ${place}.`,
    last: (place) => `Llegaste a la última carta, así que era tuya: ${place}.`,
    biggest: (card) => `La más alta era la carta ${card}.`,
    found: '¡Encontraste la más alta!',
    rule: (look, card, place) =>
      `Tras mirar ${look === '1' ? 'la primera' : `las ${look} primeras`}, la regla habría tomado la carta ${card}: ${place}.`,
    ruleNone: (place) => `Sin mirar ninguna antes, la regla habría tomado la carta 1: ${place}.`,
    ruleLast: (look, place) =>
      `Tras mirar ${look === '1' ? 'la primera' : `las ${look} primeras`}, la regla habría esperado en vano y habría terminado en la última carta: ${place}.`,
    topWin: 'Está entre las 10 mejores.',
    topLose: 'No está entre las 10 mejores.',
  },

  status: {
    card: (card, cards) => `Carta ${card} de ${cards}`,
    done: (place) => `Te quedaste con ${place}`,
  },

  announce: {
    card: (card, value) => `Carta ${card}: ${value}.`,
    newBest: (card, value) => `Carta ${card}: ${value}, la mejor hasta ahora.`,
    noGoingBack: 'No hay vuelta atrás: una carta que dejas pasar se pierde.',
    over: 'Esta partida ha terminado. Empieza otra para tener cartas nuevas.',
    deal: (value) => `Cartas nuevas. Carta 1: ${value}.`,
  },

  // Palabras dibujadas en la imagen.
  labels: {
    card: (card) => `carta ${card}`,
    bestBefore: 'mejor anterior',
    noneYet: 'ninguna aún',
    newBest: '¡nueva mejor!',
    // Llega ya escrito como texto, así que se compara con '1'.
    left: (cards) => `${cards === '1' ? 'queda' : 'quedan'} ${cards}`,
    biggest: 'la más alta',
    yours: 'la tuya',
    rule: 'la regla',
    looks: (look) => `la regla mira ${look}`,
    xAxis: 'cartas solo miradas, antes de lanzarse',
    yBest: 'encuentra la mejor de todas',
    yTop: 'encuentra una de las 10 mejores',
    random: (chance) => `una carta al azar: ${chance}`,
    deals: (deals) => `${deals} repartos`,
    peak: (look, chance) => `mira ${look}: ${chance}`,
    moreTitle: 'La mejor de todas, con menos o más cartas: calculado, y el pico apenas se mueve',
    more: (cards) => `${cards} cartas`,
    share: (all) => `parte mirada, hasta el ${all}`,
    // Los nombres que recibe una misma carta a la vez: «la tuya · la más alta».
    together: (names) => names.join(' · '),
  },

  guests: [
    {
      name: 'Martin Gardner',
      note: 'Su columna Mathematical Games, en Scientific American, dio a conocer este acertijo a un público amplio en febrero de 1960, como el juego del gúgol: números escritos en papelitos, que se descubren uno a uno.',
    },
    {
      name: 'Johannes Kepler',
      note: 'Tras morir su primera esposa en 1611, consideró a 11 posibles candidatas durante dos años antes de volver a casarse. La historia se cuenta a menudo junto a este acertijo, pero solo como anécdota.',
    },
  ],

  insight: {
    title: '¿Por qué el 37%?',
    html: `<p>La carta más alta está en algún lugar del mazo, y solo tienes un intento. La regla tiene dos partes. Primero, solo mirar: descubre las primeras 37 cartas y no te quedes con ninguna; fíjate solo en cuál es la más alta. Luego, lanzarse: toma la primera carta que las supere a todas. Si miras demasiado poco, el listón queda bajo, y te lanzas a por una carta que no es la mejor. Si miras demasiado, lo más probable es que la más alta haya pasado mientras mirabas. El equilibrio está en alrededor del 37% de las cartas, una proporción de 1/e, donde e = 2,718….</p>
<div class="insight-visual">Mira 37 de 100 y luego toma la primera carta que las supere: la mejor de todas, el 37,1% de las veces · una carta al azar: el 1%</div>
<h3>¿Por qué dos veces 37%?</h3>
<p>Si solo mira las primeras r de n cartas, la regla encuentra la mejor cuando la mejor llega después, y la mejor de las cartas anteriores a ella estaba entre las r primeras. Sumando todos esos casos se obtiene P(r) = (r/n) · (1/r + 1/(r + 1) + … + 1/(n − 1)). Para un mazo grande, con x = r/n la proporción mirada, esto se acerca a −x ln x, que es máximo en x = 1/e, donde su valor también es 1/e ≈ 36,8%. Con 10 cartas: mira 3 y ganas el 39,9% de las veces. Con 100: mira 37, 37,1%. Con un millón: mira 367\u202f879, 36,8%. El número apenas se mueve.</p>
<h3>Si valen las 10 mejores</h3>
<p>Si te vale cualquiera de las diez más altas, el mejor punto de corte único se desplaza a la izquierda: mira solo 14 cartas, lánzate, y consigues una de las 10 mejores el 81,7% de las veces, frente al 66,3% si miras 37. Pero para este objetivo un único punto de corte no es la mejor regla. La mejor se vuelve menos exigente a medida que se acaban las cartas: mira 31 cartas y luego toma una nueva mejor; desde la carta 44 toma también una que sea la segunda mejor hasta ese momento, desde la carta 53 una tercera mejor, y así sucesivamente. Consigue una de las 10 mejores el 98,1% de las veces. El punto de corte único de aquí es solo una ilustración.</p>
<h3>Lo que deja fuera</h3>
<p>La regla del 37% se apoya en supuestos fuertes: sabes cuántas cartas hay, llegan en orden aleatorio, no puedes volver atrás, solo cuenta la mejor de todas, y juzgas cada carta solo por cómo se compara con las anteriores. Aquí además ves los propios números, pero no salen de ningún rango fijo, así que un número que parece grande dice poco por sí solo. Si supieras de dónde salen los números (por ejemplo, repartidos de manera uniforme entre 0 y 1), podrías hacerlo mejor que el 37%. Las barras de la curva son simuladas: 10\u202f000 repartos, cada uno jugado con todos los puntos de corte. La línea que las acompaña está calculada con exactitud, igual que las curvas pequeñas para 10, 1000 y un millón de cartas.</p>
<p>El acertijo se cuenta a menudo como un consejo para encontrar pareja: conoce gente durante un tiempo y luego quédate con la siguiente persona que supere a todas las anteriores. La vida real rompe todos los supuestos. No sabes a cuánta gente vas a conocer, no llega en orden aleatorio, a veces puedes volver atrás, las personas no se ordenan con un solo número, y la otra persona también tiene algo que decir.</p>
<details><summary>¿Quién lo resolvió?</summary><p>Que se sepa, el acertijo apareció impreso por primera vez en la columna Mathematical Games de Martin Gardner en Scientific American, en febrero de 1960, como el «juego del gúgol», que John Fox y Gerald Marnie habían ideado en 1958. Merrill Flood ya lo había planteado en una conferencia en 1949, como el «problema de la prometida». Varias personas lo resolvieron a principios de los años sesenta, y se ha convertido en todo un campo de estudio. Para la versión clásica (solo cuenta cómo se compara cada carta con las anteriores, no hay vuelta atrás y solo vale la mejor de todas), ninguna regla supera a mirar y luego lanzarse. El artículo de Thomas Ferguson «Who solved the secretary problem?» cuenta la historia, que se remonta a un problema relacionado de Arthur Cayley de 1875. También se menciona a menudo a Johannes Kepler: tras morir su primera esposa en 1611, consideró a 11 posibles candidatas durante dos años antes de casarse con Susanna Reuttinger en 1613. Es una anécdota, no un uso de la regla. T. S. Ferguson, Statistical Science 4(3), 282–289 (1989).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Secretary_problem" target="_blank" rel="noopener">El problema de la secretaria (en inglés)</a><a class="source-link" href="https://doi.org/10.1214/ss/1177012493" target="_blank" rel="noopener">Ferguson, «Who solved the secretary problem?» (1989) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Optimal_stopping" target="_blank" rel="noopener">Parada óptima (en inglés)</a></div>`,
  },
});
