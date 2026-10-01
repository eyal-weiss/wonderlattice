/* La mesa que olvida · palabras para el visitante (es). */
Wonderlattice.defineText('billiards', 'es', {
  eyebrow: 'CAOS · GEOMETRÍA',
  name: 'La mesa que olvida',
  tagline: 'El mismo tiro, dos veces, en dos mesas de billar. Una mesa lo recuerda; la otra lo olvida en segundos.',
  title: 'La mesa que olvida.',
  subtitle:
    'En cada mesa, una bola y su gemela salen juntas, separadas por una milésima de grado. Mira qué mesa las mantiene juntas.',
  field: 'Billar dinámico · Caos · Secciones cónicas',
  sceneLabel: 'Dos mesas · Dos tiros en cada una · Nada de azar',
  sceneName: 'Una elipse y un estadio',
  tip: 'Arrastra sobre una mesa para apuntar y suelta para tirar · ← → giran el tiro · ↑ ↓ lo mueven · Enter hace un nuevo tiro',
  actionLabel: 'Nuevo tiro',
  canvasLabel:
    'Dos mesas de billar, una elipse y un estadio. En cada una, una bola y su gemela, lanzadas con una milésima de grado de diferencia, dejan estelas luminosas. Arrastra sobre una mesa para apuntar un nuevo tiro, o usa las flechas.',
  panelEyebrow: 'Da forma a la mesa',
  whyLabel: '¿Por qué olvida una de las mesas?',
  nudge:
    'Cuando las gemelas del estadio se hayan separado, baja sus lados rectos al 0%, un círculo, y luego súbelos a solo un 5%. ¿Cuánto lado recto hace falta para olvidar?',
  connection: {
    html: '<strong>La misma lección, sin ecuaciones.</strong> En «Gemelos del tiempo», tres ecuaciones separan comienzos casi idénticos. Aquí lo hace la forma de una mesa, por sí sola.',
    label: 'Ver cómo se separan los gemelos del tiempo',
  },

  presets: [
    { name: 'Tiros gemelos', note: 'El mismo tiro en las dos mesas y, en cada una, una gemela desviada 0,001°.' },
    { name: 'Tirar desde un foco', note: 'Una tronera en un foco. Todos los tiros que salen del otro entran.' },
    { name: 'Una pizca de recta', note: 'Lados rectos de solo un 5% de la altura. ¿Basta con eso?' },
  ],

  flat: 'Los lados rectos del estadio',
  flatHint: 'Como parte de la altura de la mesa. Con un 0%, el estadio es un círculo.',
  speed: 'Velocidad',
  pocket: 'Una tronera en un foco',
  exposure: 'Larga exposición',
  caustic: 'Mostrar la curva que el tiro de la elipse nunca cruza',

  ellipse: 'Elipse',
  stadium: 'Estadio',
  together: (n) => `Gemelas juntas · ${n} ${n === 1 ? 'rebote' : 'rebotes'}`,
  parted: (n) => `Separadas en el rebote ${n}`,
  pocketIn: (n) => (n === 0 ? 'Entró sin rebotar' : `Entró tras ${n} ${n === 1 ? 'rebote' : 'rebotes'}`),
  pocketRolling: (n) => `Rodando · ${n} ${n === 1 ? 'rebote' : 'rebotes'} hasta ahora`,
  legendBall: 'una bola',
  legendTwin: 'su gemela, desviada 0,001°',
  legendPocket: 'los tiros salen del punto blanco',
  chartLabel: 'Distancia entre las gemelas, en mesas de 2 metros (cada línea, diez veces más)',
  partedLine: 'separadas',
  seconds: (n) => `${n} s`,
  pocketChart: 'Rebotes de cada tiro hasta entrar; el más reciente, a la derecha',
  statusTogether: (n) => `Rebote ${n} · las dos parejas siguen juntas`,
  statusParted: (n) => `Las gemelas del estadio se separaron en el rebote ${n}`,
  statusBoth: 'Las dos parejas de gemelas se han separado',
  statusPocket: (e, s) => `Tiros que entraron: elipse ${e}, estadio ${s}`,
  announceParted: (n) =>
    `Las gemelas del estadio se han separado, tras ${n} ${n === 1 ? 'rebote' : 'rebotes'}. Las gemelas de la elipse siguen juntas.`,

  readout: {
    apart: 'Si las mesas midieran 2 metros de largo, ahora las gemelas estarían a esta distancia:',
    ellipse: 'En la elipse',
    stadium: 'En el estadio',
    curve: 'El tiro de la elipse nunca cruza',
    curves: {
      ellipse: 'una elipse más pequeña',
      hyperbola: 'una hipérbola',
      foci: 'ninguna curva: pasa por los focos',
    },
    pocket: 'Rebotes que necesitó cada tiro para entrar:',
    none: 'todavía no ha entrado ninguno',
  },
  length: {
    tiny: 'menos de 0,01 mm',
    mm: (x) => `${x} mm`,
    cm: (x) => `${x} cm`,
    m: (x) => `${x} m`,
  },
  list: (items) => items.join(', '),

  guests: [
    {
      name: 'George David Birkhoff',
      note: 'Usó una bola sobre una mesa como modelo del movimiento en general, y conjeturó que, entre las mesas de contorno suave y redondeado, solo las elipses mantienen ese orden.',
    },
    {
      name: 'Jean-Victor Poncelet',
      note: 'Prisionero de guerra en Rusia en 1813, recordó la geometría que había aprendido y la llevó más lejos. Más tarde demostró que, si un zigzag entre dos cónicas se cierra, se cierran todos.',
    },
  ],

  insight: {
    title: '¿Por qué olvida una de las mesas?',
    html: `<p>Nada es aleatorio en ninguna de las dos mesas. Cada bola rueda en línea recta y rebota en el borde con el mismo ángulo con el que llegó, y cada gemela sale del mismo punto, apuntada con una milésima de grado de diferencia. En la elipse, las gemelas siguen juntas durante cientos de rebotes. En el estadio, en más o menos una docena de rebotes ya están muy lejos. Solo la forma del borde marca la diferencia.</p>
<div class="insight-visual">elipse: la distancia crece un poco con cada rebote · estadio: crece unas 2½ veces con cada rebote</div>
<h3>El secreto de la elipse: sus dos focos</h3>
<p>Una elipse es el conjunto de puntos cuyas distancias a dos puntos fijos, sus focos, suman siempre lo mismo. Por eso, en cada punto, el borde forma ángulos iguales con las rectas que llegan de los dos focos, así que una bola que pasa por un foco siempre rebota pasando por el otro. Prueba «Tirar desde un foco»: todos los tiros que salen de un foco caen en una tronera situada en el otro. El escritor Alex Bellos mandó construir una mesa de billar elíptica basada en esta idea, llamada Loop.</p>
<h3>La curva que nunca cruza</h3>
<p>Deja que un tiro siga rodando en la elipse y su trayectoria pinta un anillo brillante alrededor de un óvalo vacío o, si cruza la línea que une los focos, alrededor de dos huecos con forma de lente. Cada tramo recto de la trayectoria toca la misma curva oculta, su cáustica: una elipse más pequeña, o una hipérbola, con los mismos focos que la mesa. Un solo número, fijado por el primer tiro, decide cuál, así que la elipse nunca olvida cómo se jugó. Las gemelas apuntadas de forma ligeramente distinta tocan cáusticas ligeramente distintas, así que solo se separan despacio. George David Birkhoff mostró que la mesa elíptica es ordenada en este sentido, lo que los matemáticos llaman integrable. Aquí también aparece el teorema de cierre de Poncelet: si un tiro que toca una cáustica vuelve a su punto de partida tras cierto número de rebotes, todos los tiros que tocan esa cáustica lo hacen.</p>
<h3>De dónde viene el caos del estadio</h3>
<p>El estadio son dos semicírculos unidos por lados rectos. Un extremo curvo concentra un haz estrecho de trayectorias cercanas, como un espejo, pero el haz pasa por su foco y vuelve a abrirse a lo largo del tramo recto, más ancho que antes. Rebote tras rebote, gana la apertura. Aquí la distancia entre las gemelas crece en promedio unas dos veces y media con cada rebote, lo que es un crecimiento exponencial. En los años setenta, Leonid Bunimovich demostró que el estadio es ergódico: casi todas las trayectorias acaban visitando todas las partes de la mesa, y pasan en cada parte un tiempo proporcional a su área. Por eso la larga exposición cubre el estadio de un gris uniforme. Basta cualquier lado recto, por corto que sea, aunque cuanto más corto es, más despacio se separan las gemelas. Sin lados rectos, el estadio es un círculo, tan ordenado como la elipse.</p>
<p>Es la dependencia sensible de las condiciones iniciales, el efecto que hay detrás de «Gemelos del tiempo», alcanzado aquí solo con geometría, sin ninguna ecuación de movimiento.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Estas son bolas ideales: puntos sin tamaño, sin efecto y sin rozamiento, sobre un borde de forma perfecta. El estadio tiene tiros excepcionales que nunca se abren, como uno que rebota de arriba abajo entre los dos lados rectos. Son infinitamente raros, pero una trayectoria que pase cerca de uno puede quedarse a su lado mucho tiempo. Y el ordenador redondea cada número a unas 16 cifras. En la elipse eso apenas importa. En el estadio, los errores de redondeo crecen como cualquier otra pequeña diferencia, así que tras unas pocas docenas de rebotes la bola de la pantalla ya no está donde la pondría la aritmética exacta: la imagen muestra cómo se comportan las trayectorias del estadio, no dónde estaría exactamente este tiro. Incluso las gemelas de la elipse acaban separándose, porque la distancia entre ellas sí crece, de forma constante en vez de exponencial: desde el tiro inicial, tardan unos 1300 rebotes.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>La elipse es x²/a² + y²/b² = 1, con focos en (±c, 0), donde c² = a² − b²; aquí a = 2 y b = 1. Para una bola en (x, y) que se mueve en la dirección (u, v), sus momentos angulares respecto a los dos focos son L₁ = (x + c)v − yu y L₂ = (x − c)v − yu, y su producto k = L₁L₂ es el mismo después de cada rebote. Cuando k &gt; 0, la cáustica es la elipse x²/(c² + k) + y²/k = 1; cuando k &lt; 0, es la hipérbola x²/(c² + k) − y²/(−k) = 1; y k = 0 significa que la trayectoria pasa por los focos. En este estadio (con lados rectos tan largos como alta es la mesa), las trayectorias cercanas se separan en promedio como e<sup>λn</sup> tras n rebotes, con λ ≈ 0,9: es su exponente de Lyapunov. La sala calcula cada rebote de forma exacta, resolviendo dónde se cruza la trayectoria recta con la elipse, o con los lados y los semicírculos del estadio, y una gemela cuenta como separada cuando se aleja de su pareja más de una vigésima parte de la altura de la mesa.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dynamical_billiards" target="_blank" rel="noopener">Billar dinámico (en inglés)</a><a class="source-link" href="http://www.scholarpedia.org/article/Dynamical_billiards" target="_blank" rel="noopener">L. A. Bunimovich, «Dynamical billiards», Scholarpedia 2(8):1813 (2007) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stadium_(geometry)" target="_blank" rel="noopener">Estadio (geometría) (en inglés)</a><a class="source-link" href="https://projecteuclid.org/journals/communications-in-mathematical-physics/volume-65/issue-3/On-the-ergodic-properties-of-nowhere-dispersing-billiards/cmp/1103904878.full" target="_blank" rel="noopener">L. A. Bunimovich, «On the ergodic properties of nowhere dispersing billiards», Communications in Mathematical Physics 65 (1979) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Poncelet%27s_closure_theorem" target="_blank" rel="noopener">Teorema de cierre de Poncelet (en inglés)</a><a class="source-link" href="https://www.loop-the-game.com/scoop" target="_blank" rel="noopener">Loop, la mesa de billar elíptica de Alex Bellos (en inglés)</a></div>`,
  },
});
