/* La torre inclinada de bloques · palabras para el visitante (es). */
Wonderlattice.defineText('blocks', 'es', {
  eyebrow: 'FÍSICA Y MATEMÁTICAS',
  name: 'La torre inclinada de bloques',
  tagline: '¿Hasta dónde puede asomar una pila de bloques más allá del borde?',
  title: 'La torre inclinada de bloques.',
  subtitle:
    'Apila bloques al borde de una mesa, cada uno sobresaliendo un poco más que el de abajo. ¿Hasta dónde puede llegar el de arriba más allá del borde?',
  field: 'Centro de masas · Serie armónica · Una sorpresa lenta',
  sceneLabel: 'El borde de una mesa · Bloques para apilar',
  sceneName: (n) => (n === 0 ? 'Mesa vacía' : 'Bloques apilados'),
  tip: 'Arrastra un bloque hacia un lado · Toca un espacio vacío para añadir un bloque · Las flechas empujan el de arriba; B arma «La mejor pila»',
  actionLabel: 'La mejor pila',
  lengthsLabel: (oh) => `${oh.toFixed(2).replace('.', ',')} largos`,
  canvasLabel:
    'Una mesa con bloques apilados en su borde. Arrastra los bloques para cambiar su posición. La pila se cae si el centro de masas pasa más allá de su apoyo.',
  panelEyebrow: 'Ajusta la pila',
  whyLabel: '¿Por qué llega tan lejos?',
  nudge:
    'Empieza con pocos bloques. ¿Pueden 4 bloques dejar el de arriba entero fuera de la mesa? Prueba con 31 bloques para llegar a dos largos.',

  connection: {
    html: '<strong>Un argumento sencillo detrás de una sorpresa.</strong> Aquí, equilibrar cada bloque sobre el de abajo explica hasta dónde puede inclinarse una pila. En El suelo imposible, colorear las casillas muestra por qué algunos suelos nunca se pueden cubrir con fichas de dominó.',
    label: 'Ver el suelo imposible',
  },

  presets: [
    { name: '4 bloques', note: 'El de arriba ya sale entero de la mesa.' },
    { name: '31 bloques', note: 'Dos largos de bloque de vuelo.' },
    { name: 'La mejor pila', note: 'Cada bloque en su posición ideal.' },
  ],

  blocks: 'Bloques',
  blocksHint: 'Cuántos bloques hay en la pila',

  status: (n, overhang) =>
    `${n} ${n === 1 ? 'bloque' : 'bloques'} · ${overhang.toFixed(2).replace('.', ',')} largos fuera de la mesa`,
  toppled: 'La pila se ha caído.',

  milestones: {
    m1: 'El bloque de arriba, entero fuera',
    m2: 'Dos largos de vuelo',
    m3: 'Tres largos',
  },

  bestLabel: 'La mejor pila',
  resetLabel: 'Empezar de nuevo',

  guests: [
    {
      name: 'Nicole Oresme',
      note: 'Hacia 1350, Oresme demostró que la serie armónica diverge; eso significa que el vuelo de la pila no tiene límite.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Euler estudió a fondo la serie armónica, incluida la desesperante lentitud con la que crece.',
    },
  ],

  insight: {
    title: '¿Por qué una pila puede llegar tan lejos como quieras?',
    html: `<p>Cada bloque se sostiene sobre el de abajo mientras el <strong>centro de masas</strong> de todos los bloques que tiene encima quede sobre su apoyo. Apílalos pensando desde arriba: el bloque de arriba puede sobresalir la mitad de su largo, el siguiente un cuarto, luego un sexto, y así sucesivamente.</p>
<p>El vuelo total con <em>n</em> bloques es ½(1 + ½ + ⅓ + … + 1/<em>n</em>): la mitad de la suma de los <em>n</em> primeros términos de la <strong>serie armónica</strong>. La serie diverge, así que el vuelo no tiene límite. Pero crece como ½ ln <em>n</em>: con una lentitud desesperante.</p>
<div class="insight-visual">4 bloques → 1 largo fuera. 31 bloques → 2. 227 bloques → 3.</div>
<h3>La cuenta</h3>
<p>Hacen falta exactamente 4 bloques para que el de arriba salga entero de la mesa (vuelo mayor que 1), 31 para dos largos y 227 para tres. Cada largo más exige unas <em>e</em><sup>2</sup> ≈ 7,4 veces más bloques que el anterior.</p>
<h3>Qué supone este modelo</h3>
<p>Bloques ideales: rígidos, perfectamente uniformes y sin rozamiento. Los libros de verdad resbalan y se doblan. La pila de un solo bloque por piso que ves aquí no es la más eficiente cuando hay muchos bloques: Paterson y Zwick (2009) encontraron pilas con varios bloques por piso cuyo vuelo crece como <em>n</em><sup>1/3</sup> en lugar de log <em>n</em>.</p>
<details><summary>Las matemáticas, si te interesan</summary><p>Sea <em>c<sub>k</sub></em> el centro del bloque <em>k</em> contando desde arriba (el bloque 1 es el de arriba). El bloque de arriba puede desplazarse hasta que su centro de masas quede justo sobre el borde derecho del bloque 2, lo que da un vuelo de ½. Después, el centro de masas conjunto de los bloques 1 y 2 debe quedar sobre el borde derecho del bloque 3, lo que añade ¼. Por inducción, el desplazamiento óptimo del bloque <em>k</em> respecto al bloque <em>k</em>+1 es 1/(2<em>k</em>), y el vuelo total es ½ · H(<em>n</em>), donde H(<em>n</em>) es el <em>n</em>-ésimo número armónico.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Block-stacking_problem" target="_blank" rel="noopener">Block-stacking problem, Wikipedia (en inglés)</a><a class="source-link" href="https://arxiv.org/abs/0710.2357" target="_blank" rel="noopener">Paterson y Zwick, «Overhang» (2009) (en inglés)</a></div>`,
  },
});
