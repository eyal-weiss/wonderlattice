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
