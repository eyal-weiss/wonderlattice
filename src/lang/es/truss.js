/* El triángulo testarudo · palabras para el visitante (es). */
Wonderlattice.defineText('truss', 'es', {
  eyebrow: 'ESTRUCTURAS',
  name: 'El triángulo testarudo',
  tagline:
    'Un puente de cuadrados se pliega bajo un camión de juguete. Añade las barras adecuadas y se vuelve rígido, y cada barra muestra su carga.',
  title: 'El triángulo testarudo.',
  subtitle:
    'Los cuadrados se pliegan y los triángulos no. Mira cómo cede el puente, y luego toca barras para ponerlas y quitarlas: las barras azules están comprimidas, las rojas estiradas.',
  field: 'Rigidez · La cuenta de Maxwell · El teorema de Geiringer–Laman · Fuerzas en una celosía',
  sceneLabel: 'Barras, pasadores y un camión de juguete',
  sceneNames: {
    squares: 'Solo cuadrados',
    pratt: 'Una celosía Pratt',
    howe: 'Una celosía Howe',
    counted: 'Bien contado, pero flojo',
    own: 'Tu propio puente',
    bracing: 'Reforzando los cuadrados',
  },
  tip: 'Toca una barra para quitarla, o una línea discontinua para poner una · Arrastra el camión · Las flechas apuntan y Enter cambia',
  actionBrace: 'Reforzar cada cuadrado',
  actionUnbrace: 'Quitar las diagonales',
  canvasLabel:
    'Un puente de barras y pasadores sobre un hueco, con un camión de juguete en su calzada. Toca una barra para quitarla o una línea discontinua para poner una, o usa las flechas para apuntar y Enter para cambiarla. Arrastra el camión para moverlo.',
  panelEyebrow: 'Barras y pasadores',
  whyLabel: '¿Por qué aguantan los triángulos?',
  nudge:
    'Quita una barra cualquiera de un puente rígido y mira cómo vuelve a plegarse. Luego dale a un cuadrado una segunda diagonal: ¿se vuelve más rígido el puente?',
  connection: {
    html: '<strong>Comprimidas y estiradas.</strong> Una celosía usa las dos cosas. Las piedras de un arco solo pueden comprimirse, así que el arco debe tener la forma de una cadena colgante, del revés. Míralo en «Cuélgala, inviértela, constrúyela».',
    label: 'Visita «Cuélgala, inviértela, constrúyela»',
  },

  presets: [
    { name: 'Solo cuadrados', note: 'Arriba, abajo y verticales, sin diagonales.' },
    { name: 'Una celosía Pratt', note: 'Una diagonal en cada cuadrado.' },
    { name: 'Bien contado, pero flojo', note: 'Barras suficientes, en los sitios equivocados.' },
  ],

  panels: 'Cuadrados sobre el hueco',
  panelsHint: 'Cada cuadrado añade dos nudos, así que el puente necesita cuatro barras más.',
  forces: 'Mostrar lo que soporta cada barra',

  verdict: { rigid: 'RÍGIDO', floppy: 'FLOJO' },
  count: (joints, needed, bars) => `${joints} nudos × 2 − 3 = ${needed} barras necesarias · ${bars} aquí`,
  reason: {
    short: (k) => (k === 1 ? 'falta una barra' : `faltan ${k} barras`),
    spread: 'barras suficientes, mal repartidas',
    rigid: (spare) =>
      spare === 0 ? 'ni una barra de sobra' : spare === 1 ? 'una barra de sobra' : `${spare} barras de sobra`,
  },
  times: (x) => `${x}×`,

  key: {
    squeezed: 'Comprimida',
    stretched: 'Estirada',
    nothing: 'Sin carga',
    spare: 'Sobra',
  },

  primer: {
    title: 'POR QUÉ TRIÁNGULOS',
    square: 'Un cuadrado cede',
    squareCount: '4 nudos × 2 − 3 = 5 barras necesarias · tiene 4',
    triangle: 'Un triángulo aguanta',
    triangleCount: '3 nudos × 2 − 3 = 3 barras necesarias · tiene 3',
  },

  status: {
    rigid: (spare) =>
      spare === 0
        ? 'Rígido · sin barras de sobra'
        : spare === 1
          ? 'Rígido · una barra de sobra'
          : `Rígido · ${spare} barras de sobra`,
    short: (k) => (k === 1 ? 'Flojo · falta una barra' : `Flojo · faltan ${k} barras`),
    spread: 'Flojo · barras mal repartidas',
  },
  folded: 'El puente se pliega.',
  locked: 'El puente es rígido.',

  readout: {
    have: (bars, needed) => `${bars} ${bars === 1 ? 'barra' : 'barras'}, ${needed} necesarias`,
    count: (joints, ways, needed, bars) =>
      `Cada uno de los ${joints} nudos puede moverse de dos maneras: ${ways} maneras en total. Quita 3, las que deslizan y giran el puente entero, y necesita ${needed} barras. Tiene ${bars}.`,
    short: (k) =>
      k === 1
        ? 'Falta una barra, así que el puente todavía puede plegarse de una manera.'
        : `Faltan ${k} barras, así que el puente todavía puede plegarse.`,
    spread:
      'Hay barras suficientes, pero algunas se amontonan donde repiten lo que hacen otras (la discontinua sobra), así que otra parte tiene demasiado pocas y se pliega.',
    busiest: (x) => `La barra más cargada soporta ${x} veces el peso del camión.`,
    busiestSame: 'La barra más cargada soporta tanto como pesa el camión.',
    nothing: (k) =>
      k === 0
        ? 'Todas las barras soportan algo.'
        : k === 1
          ? 'Una barra no soporta nada.'
          : `${k} barras no soportan nada.`,
    spare: (k) =>
      k === 1
        ? 'Una barra sobra (la discontinua): quítala y el puente sigue en pie.'
        : `Sobran ${k} barras (las discontinuas): el puente no las necesita para sostenerse.`,
    ashore: 'El camión está en tierra firme, así que ninguna barra soporta nada.',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'En 1864 hice la cuenta. Cada nudo de una estructura plana puede moverse de dos maneras, y tres de esas maneras solo deslizan o giran la estructura entera. Así que una estructura de j nudos necesita al menos 2j − 3 barras.',
    },
    {
      name: 'Hilda Geiringer',
      note: 'En 1927 encontré exactamente qué estructuras planas son rígidas: ninguna parte puede tener más barras de las que necesita. Gerard Laman volvió a dar con la misma regla en 1970, y hoy lleva el nombre de los dos.',
    },
    {
      name: 'Squire Whipple',
      note: 'En 1847 publiqué un libro que calculaba la fuerza en cada barra de una celosía, en vez de adivinarla. Mis puentes de hierro de arco atirantado cruzaban el canal de Erie.',
    },
  ],

  insight: {
    title: '¿Por qué aguantan los triángulos?',
    html: `<p>Una barra conserva su longitud, y un pasador deja girar las barras. Tres longitudes fijan por completo la forma de un triángulo, así que un triángulo de barras no puede cambiar de forma en absoluto. Cuatro longitudes no fijan un cuadrado: se inclina hasta volverse un rombo sin que ninguna barra se doble ni se estire. Por eso las estructuras de puentes, grúas y tejados están hechas de triángulos.</p>
<div class="insight-visual">nudos × 2 − 3 = barras necesarias</div>
<h3>Contar las maneras de moverse</h3>
<p>En una pared plana, cada nudo puede moverse en dos direcciones, así que j nudos tienen 2j maneras de moverse. Cada barra quita como mucho una. Siempre quedan tres, haya las barras que haya: incluso una estructura rígida puede deslizarse de lado, deslizarse arriba y abajo, y girar entera. Aquí el pasador y el rodillo bajo el puente quitan esas tres. Así que una estructura necesita al menos 2j − 3 barras, una cuenta que dio James Clerk Maxwell en 1864. Un puente de cuatro cuadrados tiene 10 nudos, así que necesita 17 barras. Con solo sus barras de arriba, las de abajo y las verticales tiene 13, así que le faltan cuatro: una diagonal por cuadrado.</p>
<h3>Contar no basta</h3>
<p>Pon 17 barras, con dos diagonales en un cuadrado y ninguna en el siguiente, y el puente sigue plegándose. La segunda diagonal sobra: no sujeta nada que la primera no sujete ya. Hilda Pollaczek-Geiringer encontró la regla exacta en 1927, y Gerard Laman volvió a encontrarla en 1970. Una estructura con 2j − 3 barras es rígida exactamente cuando ninguna parte de ella está abarrotada: cada grupo de k nudos tiene como mucho 2k − 3 barras entre ellos. La regla vale para nudos en posición general. En posiciones especiales, como tres nudos en línea recta, una estructura con las barras adecuadas todavía puede ceder un poco. En la cuadrícula fija de este puente, cada elección de barras se comporta igual que en posición general.</p>
<h3>Lo que soporta cada barra</h3>
<p>Una vez que el puente es rígido, cada nudo debe estar en equilibrio: los empujes y tirones de sus barras, y el peso del camión donde la calzada se apoya en él, suman cero. Resolver todos esos equilibrios a la vez (el método de los nudos) da la fuerza en cada barra. Las barras azules están comprimidas y las rojas estiradas, y una barra más gruesa soporta más. Algunas barras no soportan nada mientras el camión está en un sitio, y mucho cuando se mueve. Y una barra puede soportar más de lo que pesa el camión: en una celosía Pratt de seis cuadrados, con el camión en el centro, el centro de la parte de arriba está comprimido con una vez y media el peso del camión.</p>
<p>En una celosía Pratt, las diagonales se inclinan hacia el centro y están estiradas, mientras que las verticales están comprimidas. Refleja cada diagonal y obtienes una celosía Howe, donde las diagonales están comprimidas y las verticales estiradas. Esa diferencia importaba a los constructores: una barra larga comprimida puede sufrir pandeo, curvándose de lado mucho antes de aplastarse, así que las barras comprimidas deben ser más gruesas. El diseño de William Howe de 1840 comprimía diagonales de madera y estiraba varillas de hierro. El de Thomas y Caleb Pratt, de 1844, le dio la vuelta, y se adaptó bien a los puentes a medida que el hierro y el acero sustituían a la madera. La celosía Warren de 1848 usa un zigzag de diagonales, comprimidas y estiradas por turnos.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Aquí las barras no pesan nada, sus uniones son pasadores perfectos, el peso del camión llega al puente solo en sus nudos, a través de la calzada, y todas las barras son del mismo acero. Los puentes de verdad soportan su propio peso, que suele ser mucho mayor que el de cualquier camión. Sus uniones están remachadas, atornilladas o soldadas, lo que las hace más rígidas. Sus barras comprimidas sufren pandeo antes de romperse. Cuando un puente tiene barras de sobra, cómo se reparten la carga depende de lo elástica que sea cada una, y aquí todas son iguales. El plegado es una caricatura: una estructura de verdad caería más deprisa, y se rompería. Y los triángulos no son la única manera de ser rígido: las estructuras de uniones rígidas, las cáscaras y las estructuras de tensegridad también lo son. Juegos de construir puentes como Poly Bridge simulan puentes enteros; esta sala se limita a la cuenta y a las fuerzas.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Desplazar el nudo a en u<sub>a</sub> y el nudo b en u<sub>b</sub> conserva la longitud de la barra ab, en primer orden, cuando (p<sub>a</sub> − p<sub>b</sub>) · (u<sub>a</sub> − u<sub>b</sub>) = 0. Una ecuación así por cada barra forma la matriz de rigidez, con dos columnas por nudo. Con tres filas más para el pasador y el rodillo, el puente es rígido exactamente cuando la matriz tiene rango completo, 2j. La sala también calcula el rango con los nudos ligeramente desordenados, en posición general, para distinguir una estructura mal repartida de una posición especial. Un puente flojo se pliega siguiendo un movimiento que la matriz permite: la parte del empuje del camión a la que no se opone ninguna barra. Las fuerzas salen del método de la rigidez, con todas las barras iguales. Para un puente sin barras de sobra, eso da exactamente las fuerzas del método de los nudos, sea cual sea el material de las barras. Las fuerzas se comprobaron frente a un programa independiente para celosías Pratt y Howe de dos a seis cuadrados, y el rango frente a la condición de Laman en 150 estructuras pequeñas al azar.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Truss" target="_blank" rel="noopener">Celosía (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Laman_graph" target="_blank" rel="noopener">Grafo de Laman (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Structural_rigidity" target="_blank" rel="noopener">Rigidez estructural (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Truss_bridge" target="_blank" rel="noopener">Puente de celosía: Pratt, Howe y Warren (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Squire_Whipple" target="_blank" rel="noopener">Squire Whipple (Wikipedia, en inglés)</a><a class="source-link" href="https://doi.org/10.1080/14786446408643668" target="_blank" rel="noopener">Maxwell (1864), On the calculation of the equilibrium and stiffness of frames (en inglés)</a><a class="source-link" href="https://doi.org/10.1002/zamm.19270070107" target="_blank" rel="noopener">Pollaczek-Geiringer (1927), Über die Gliederung ebener Fachwerke (en alemán)</a><a class="source-link" href="https://doi.org/10.1007/BF01534980" target="_blank" rel="noopener">Laman (1970), On graphs and rigidity of plane skeletal structures (en inglés)</a></div>`,
  },
});
