/* Dobla un dragón · palabras para el visitante (es). */
Wonderlattice.defineText('dragon', 'es', {
  eyebrow: 'PLEGADO DE PAPEL',
  name: 'Dobla un dragón',
  tagline: 'Dobla una tira de papel por la mitad una y otra vez, abre cada pliegue en ángulo recto, y sale un dragón.',
  title: 'Dobla un dragón.',
  subtitle:
    'Una tira de papel se dobla por la mitad diez veces, y luego cada pliegue se abre en ángulo recto. Mira: nunca se cruza consigo misma.',
  field: 'Plegado · Fractales · Teselados',
  sceneLabel: 'Una tira de papel, vista desde arriba',
  sceneName: 'Doblando',
  tip: 'La tira está de canto, vista desde arriba. Dóblala una vez más, o cambia el ángulo de los pliegues.',
  actionLabel: 'Doblar una vez más',
  canvasLabel:
    'Una tira de papel de colores se dobla por la mitad una y otra vez, y luego se abre con cada pliegue en ángulo recto, formando un dragón enroscado que se toca a sí mismo en las esquinas pero nunca se cruza.',
  panelEyebrow: 'Dobla y abre',
  whyLabel: '¿Por qué un dragón?',
  nudge:
    'Pruébalo con papel: dobla una tira por la mitad cuatro veces, siempre en el mismo sentido, luego abre cada pliegue en ángulo recto y ponla de canto.',
  connection: {
    html: '<strong>Copias que llenan el plano.</strong> Cuatro dragones encajan alrededor de un punto sin dejar huecos. En la sala de las baldosas, cualquier baldosa que dobles sigue cubriéndolo todo.',
    label: 'Visita «Una baldosa que llena el mundo»',
  },

  presets: [
    { name: 'Diez dobleces', note: 'El dragón clásico.' },
    { name: 'Cuatro dragones', note: 'Girados en torno a un punto, encajan entre sí.' },
    { name: 'Papel de verdad', note: 'Cuatro dobleces, lo que permite una tira real.' },
  ],

  folds: 'Dobleces',
  angle: 'Ángulo de los pliegues',
  four: 'Cuatro dragones',

  // Sobre la imagen. `fold` y `folds` son enteros; `layers` y `pieces` llegan ya escritos (1024).
  folding: 'Doblando',
  opening: 'Abriendo',
  oneMore: 'Un doblez más',
  dragon: 'El dragón',
  fourDragons: 'Cuatro dragones',
  foldStatus: (fold, layers) => `Doblez ${fold} · ${layers} capas`,
  paperLimit: (fold, layers) => `Doblez ${fold} · ${layers} capas, demasiadas para el papel`,
  openStatus: 'Cada pliegue se abre en ángulo recto',
  moreStatus: 'Un pliegue nuevo en cada trozo, a izquierda y a derecha por turnos',
  rightStatus: (folds, pieces) => `${folds} ${folds === 1 ? 'doblez' : 'dobleces'} · ${pieces} trozos · nunca se cruza`,
  fourStatus: (folds) =>
    `${folds} ${folds === 1 ? 'doblez' : 'dobleces'} cada uno · sin solapes ni huecos en el centro`,
  angleStatus: (angle) => `Pliegues a ${angle}° · a 90° nunca se cruza`,
  restarted: 'De vuelta a un solo doblez.',

  guests: [
    {
      name: 'Martin Gardner',
      note: 'En 1967 mostró a los lectores de su columna de Scientific American el dragón que tres físicos de la NASA habían encontrado doblando papel.',
    },
    {
      name: 'Donald Knuth',
      note: 'Con Chandler Davis, averiguó en 1970 por qué el dragón nunca usa dos veces la misma arista, y por qué sus copias pueden cubrir el plano.',
    },
    {
      name: 'Britney Gallivan',
      note: 'En 2002, cuando estudiaba secundaria, dobló por la mitad doce veces una tira de papel de 1,2 km, siempre en el mismo sentido.',
    },
  ],

  insight: {
    title: '¿Por qué al doblar sale un dragón?',
    html: `<p>Cada doblez pone un pliegue nuevo en medio de cada trozo de la tira, y como los dobleces van siempre en el mismo sentido, los pliegues nuevos giran a izquierda y a derecha por turnos. Abre cada pliegue en ángulo recto y la tira dibuja un camino sobre una cuadrícula. El camino tras diez dobleces tiene 1024 trozos, y aun así nunca recorre dos veces la misma arista: solo se toca a sí mismo en las esquinas. Las esquinas redondeadas de la imagen dejan ver cómo los dos tramos pasan ahí uno junto al otro.</p>
<div class="insight-visual">un doblez más → un pliegue nuevo entre cada dos → el dragón se hace el doble de largo</div>
<h3>Hacia dónde gira cada pliegue</h3>
<p>Cuenta los pliegues desde un extremo. Divide el número del pliegue entre 2 todas las veces que puedas, y mira lo que queda: si al dividirlo entre 4 deja resto 1, el pliegue gira hacia un lado, y si deja 3, hacia el otro. Así que los giros van derecha, derecha, izquierda, derecha, derecha, izquierda, izquierda… Es la sucesión regular de plegado de papel.</p>
<h3>Dos dragones en uno, y cuatro que llenan el plano</h3>
<p>La segunda mitad de la tira es la primera mitad girada un ángulo recto alrededor del pliegue central, así que cada dragón está hecho de dos dragones más pequeños, cada uno de 1/√2 veces su tamaño. Chandler Davis y Donald Knuth estudiaron estas curvas en 1970 y demostraron que el camino plegado nunca repite una arista, y que sus copias giradas encajan entre sí: cuatro dragones que salen de un mismo punto llenan la cuadrícula a su alrededor sin huecos ni solapes, y cuantos más dobleces, más lejos llegan a llenarla. Medido con su principio y su final a distancia 1, el dragón terminado cubre un área de exactamente ½, y su borde es un fractal de dimensión aproximadamente 1,52.</p>
<h3>Papel de verdad</h3>
<p>Cada doblez duplica el grosor y reduce la longitud a la mitad, así que una tira de papel corriente pronto se convierte en un bloquecito rígido: cuatro o cinco dobleces bien marcados son más o menos los que aún se pueden abrir con limpieza, y siete u ocho es el límite habitual. El papel de esta sala no tiene grosor. En 2002, Britney Gallivan, una estudiante de secundaria, calculó qué longitud debe tener una tira para un número dado de dobleces, y luego dobló 1,2 km de papel doce veces en el mismo sentido. La curva la encontraron primero los físicos de la NASA John Heighway, Bruce Banks y William Harter, y Martin Gardner escribió sobre ella en 1967.</p>
<details><summary>Lo que la sala deja fuera</summary><p>La animación gira todos los pliegues lo mismo a la vez y mantiene todos los trozos de la misma longitud, como si la tira estuviera de canto y no tuviera grosor. Los pliegues reales se abren un poco solos, así que una tira real forma un dragón más irregular. Con ángulos de pliegue distintos de 90°, el camino puede cruzarse consigo mismo; la sala no afirma nada en ese caso.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dragon_curve" target="_blank" rel="noopener">La curva del dragón (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Regular_paperfolding_sequence" target="_blank" rel="noopener">La sucesión regular de plegado de papel (Wikipedia, en inglés)</a><a class="source-link" href="https://mathworld.wolfram.com/DragonCurve.html" target="_blank" rel="noopener">Curva del dragón (MathWorld, en inglés)</a><a class="source-link" href="https://www-cs-faculty.stanford.edu/~knuth/fg.html" target="_blank" rel="noopener">C. Davis y D. E. Knuth, «Number representations and dragon curves», en Selected Papers on Fun and Games de Knuth (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Britney_Gallivan" target="_blank" rel="noopener">Britney Gallivan (Wikipedia, en inglés)</a></div>`,
  },
});
