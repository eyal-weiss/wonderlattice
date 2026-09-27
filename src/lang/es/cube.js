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
