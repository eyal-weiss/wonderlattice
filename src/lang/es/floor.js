Wonderlattice.defineText('floor', 'es', {
  eyebrow: 'INVARIANTES',
  name: 'El suelo imposible',
  tagline: 'Faltan dos esquinas y no hay manera de embaldosar el suelo. Una mirada a los colores lo demuestra.',
  title: 'El suelo imposible.',
  subtitle:
    'Cubre el suelo con fichas de dominó, dos casillas cada una. Luego descubre por qué algunos suelos no se pueden terminar nunca.',
  field: 'Acertijos · Invariantes · Demostración con colores',
  sceneLabel: 'Ocho por ocho · Dominó · Un patrón oculto',
  tip: 'Toca dos casillas vecinas para colocar una ficha, o arrastra sobre ellas · Las flechas mueven, Enter toca',
  actionLabel: 'Mira los colores',
  canvasLabel:
    'Un suelo de ocho por ocho casillas, con algunas quitadas, que hay que cubrir con fichas de dominó que tapan cada una dos casillas vecinas.',
  panelEyebrow: 'Intenta terminar el suelo',
  whyLabel: '¿Por qué no se puede?',
  nudge: 'Intenta cubrir el suelo sin las dos esquinas. Cuando te atasques, pulsa «Mira los colores» y cuenta.',
  connection: {
    html: '<strong>Una regla sencilla lo decide todo.</strong> Aquí cada ficha cubre una casilla clara y una oscura; en el sudoku cada fila tiene cada símbolo una sola vez.',
    label: 'Ver el sudoku como una red',
  },

  presets: [
    { name: 'Sin dos esquinas', note: 'Esquinas opuestas de un tablero de ajedrez.' },
    { name: 'Una de cada color', note: 'Siempre se puede. ¿Por qué?' },
    { name: 'Equilibrado pero atascado', note: 'La cuenta sale, y sin embargo…' },
    { name: 'Un suelo entero', note: 'Quita las casillas que quieras.' },
  ],

  modeLabel: 'Qué hace un toque',
  modes: ['Colocar fichas', 'Quitar casillas'],
  colours: 'Mostrar los colores',
  solve: 'Mostrar un embaldosado',
  clearDominoes: 'Levantar todas las fichas',
  yourFloor: 'Tu propio suelo',
  byColour: 'Quedan, por color',
  squaresLeft: 'Casillas libres',
  dominoes: 'Fichas colocadas',
  light: 'claras',
  dark: 'oscuras',
  countLine: (light, dark) => `${light} claras · ${dark} oscuras`,
  status: (laid, left) => (left ? `${laid} colocadas · quedan ${left} casillas` : `Cubierto con ${laid} fichas`),

  verdict: {
    start: 'Coloca fichas en el suelo, o pulsa «Mostrar un embaldosado».',
    covered: (n) => `Cubierto: ${n} fichas, todas las casillas usadas.`,
    tiled: (n) => `Aquí tienes una manera: ${n} fichas cubren todo el suelo.`,
    fresh: 'Tus fichas estorbaban, así que aquí tienes un embaldosado desde cero.',
    colours: (light, dark) =>
      `Imposible: quedan ${light} casillas claras y ${dark} oscuras, y cada ficha cubre una de cada color.`,
    stuck: (n) =>
      n === 1
        ? 'Imposible, aunque los colores están equilibrados: una casilla no tiene ninguna vecina libre con la que compartir ficha.'
        : n
          ? `Imposible, aunque los colores están equilibrados: un trozo de ${n} casillas queda aislado, y sus colores no se equilibran.`
          : 'Imposible, aunque los colores están equilibrados: no se pueden emparejar todas las casillas con una vecina.',
    oddSquares: 'Un número impar de casillas nunca se puede cubrir con fichas de dominó.',
  },

  squareLabel: (row, col, what) => `Fila ${row}, columna ${col}: ${what}`,
  what: { free: 'libre', hole: 'quitada', domino: 'cubierta por una ficha' },

  guests: [
    {
      name: 'Martin Gardner',
      note: 'Llevó este acertijo a millones de lectores, y los colores fueron el giro que nadie esperaba.',
    },
    {
      name: 'Ralph Gomory',
      note: 'Demostró que quitar una casilla clara y una oscura siempre deja un suelo que se puede embaldosar.',
    },
  ],

  insight: {
    title: '¿Por qué no se puede embaldosar el suelo?',
    html: `<p>Colorea el suelo como un tablero de ajedrez. Cada ficha, la pongas donde la pongas, cubre dos casillas vecinas, y las casillas vecinas siempre tienen colores distintos. Así que cada ficha cubre exactamente una casilla clara y una oscura, y un suelo terminado tiene que tener tantas casillas claras como oscuras.</p>
<div class="insight-visual">una ficha = una clara + una oscura</div>
<p>Las esquinas opuestas de un tablero de ajedrez son del mismo color. Quítalas y quedan 30 casillas claras frente a 32 oscuras: ninguna colocación de fichas puede funcionar, y lo sabemos sin probar ni una. Una propiedad que nunca cambia, como «claras menos oscuras» en las casillas que cubren unas fichas, se llama <em>invariante</em>. Los invariantes son una de las formas favoritas de las matemáticas para demostrar que algo es imposible.</p>
<h3>Una de cada color: siempre se puede</h3>
<p>Ralph Gomory demostró que, si quitas una casilla clara y una oscura de un tablero completo, el resto siempre se puede embaldosar. Dibuja un camino cerrado que pase una vez por cada casilla, como una serpiente plegada sobre el tablero. Quitar dos casillas de distinto color corta el camino en trozos de longitud par, y cada trozo se puede cubrir con fichas a lo largo del camino.</p>
<h3>Estar equilibrado no basta</h3>
<p>Tener tantas casillas claras como oscuras es <em>necesario</em>, pero no <em>suficiente</em>. Aísla una casilla de la esquina quitando sus dos vecinas y ya no se podrá cubrir nunca, aunque la cuenta siga equilibrada. Decidir si un suelo cualquiera se puede embaldosar consiste en emparejar cada casilla clara con una vecina oscura, y eso es un problema de emparejamiento. «Mostrar un embaldosado» lo resuelve probando parejas y arreglándolas cuando chocan.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Piensa en las casillas libres como una red en la que las vecinas están unidas. Cada unión enlaza una casilla clara con una oscura, así que la red es <em>bipartita</em>, y un embaldosado es un <em>emparejamiento perfecto</em>: un conjunto de uniones que usa cada casilla exactamente una vez. La sala encuentra uno con caminos de aumento (el algoritmo de Kuhn) y, cuando no lo hay, busca un trozo conectado cuyos colores no se equilibran. El acertijo lo planteó Max Black en 1946 y lo hizo famoso Martin Gardner en <em>Scientific American</em>; el teorema de Gomory es la respuesta clásica a la versión en la que se quita una casilla de cada color.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Mutilated_chessboard_problem" target="_blank" rel="noopener">El problema del tablero mutilado, con el teorema de Gomory (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Domino_tiling" target="_blank" rel="noopener">Embaldosados con dominó (en inglés)</a></div>`,
  },
});
