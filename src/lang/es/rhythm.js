/* Ritmos de Euclides · palabras para el visitante (es). */
Wonderlattice.defineText('rhythm', 'es', {
  eyebrow: 'RITMOS EUCLIDIANOS',
  name: 'Ritmos de Euclides',
  tagline:
    'Reparte unos pocos golpes alrededor de un círculo de la forma más uniforme que puedas, y salen ritmos que se tocan en todo el mundo.',
  title: 'Ritmos de Euclides.',
  subtitle:
    'Tres golpes repartidos lo más uniformemente posible en ocho pasos: el tresillo cubano. Cambia los números, o activa el sonido.',
  field: 'Números · El algoritmo de Euclides · Ritmo',
  sceneLabel: 'Golpes alrededor de un círculo',
  tip: 'La manecilla da una vuelta por compás y enciende cada golpe por el que pasa · Pulsa un ritmo con nombre para oírlo · Teclas: ← → el siguiente',
  actionLabel: 'Activar el sonido',
  canvasLabel:
    'Una esfera de reloj hecha de pasos, con una manecilla que gira. Los golpes, repartidos lo más uniformemente posible, son los vértices de un polígono y se encienden cuando pasa la manecilla. Al lado, los mismos golpes como una fila de casillas, bajo una recta dibujada en píxeles que sube un escalón en cada golpe.',
  panelEyebrow: 'Golpes y pasos',
  whyLabel: '¿De dónde vienen estos ritmos?',
  nudge:
    'Activa el sonido y luego prueba 5 golpes en 8 pasos, y 7 en 12: muchos de los repartos más uniformes tienen nombre.',
  connection: {
    html: '<strong>Un ritmo escondido en dos notas.</strong> Dos tonos un poco desafinados crecen y se apagan con un ritmo propio: las pulsaciones.',
    label: 'Escucha la forma',
  },

  presets: [
    { name: 'Tresillo', note: '3 golpes en 8 pasos, de Cuba.' },
    { name: 'Bossa nova', note: '5 en 16, sobre un 4 constante.' },
    { name: 'Campana de África occidental', note: '7 en 12, sobre 4 y 3.' },
  ],

  soundOff: 'Activar el sonido',
  soundOn: 'Sonido activado · silenciar',
  noSound: 'El sonido no está disponible en este navegador. Aun así puedes ver los golpes.',

  rings: 'Anillos',
  ringCounts: ['Uno', 'Dos', 'Tres'],
  change: 'Cambiar',
  ringNames: ['Exterior', 'Intermedio', 'Interior'],
  steps: 'Pasos',
  beats: 'Golpes',
  start: 'Empezar en el paso',
  startHint: 'Los mismos golpes, empezando desde otro paso del círculo.',
  speed: 'Una vuelta dura',
  seconds: ' s',

  // El nombre de la escena: un ritmo de la lista de Toussaint (su nombre y dónde se toca), o un reparto sin nombre.
  scene: (name, from) => `${name} · ${from}`,
  unnamed: 'Un reparto uniforme',
  // Números enteros de golpes (de 0 a 24) y de pasos (de 2 a 24).
  status: (k, n) => `${k === 1 ? '1 golpe' : `${k} golpes`} en ${n} pasos`,

  // Palabras dibujadas en la imagen, cortas.
  labels: {
    line: (k, n) => `Recta que sube ${k} en ${n}, en píxeles`,
    steps: 'Sube en cada golpe',
    ring: (k, n) => `${k} en ${n}`,
    ringNamed: (k, n, name) => `${k} en ${n} · ${name}`,
    gallery: 'Más ritmos con nombre · toca uno',
  },

  announce: (k, n, name) =>
    name
      ? `${k === 1 ? '1 golpe' : `${k} golpes`} en ${n} pasos: ${name}.`
      : `${k === 1 ? '1 golpe' : `${k} golpes`} en ${n} pasos, repartidos lo más uniformemente posible.`,

  // Ritmos de la lista de Toussaint (2005), con los nombres y lugares que él da.
  rhythms: {
    conga: { name: 'Toque de conga', from: 'Cuba' },
    khafif: { name: 'Khafif-e-ramal', from: 'Persia, siglo XIII' },
    cumbia: { name: 'Cumbia', from: 'Colombia' },
    romanian: { name: 'Danza popular', from: 'Rumanía' },
    ruchenitza: { name: 'Ruchenitza', from: 'Bulgaria' },
    tresillo: { name: 'Tresillo', from: 'Cuba' },
    ruchenitzaFour: { name: 'Ruchenitza', from: 'Bulgaria' },
    aksak: { name: 'Aksak', from: 'Turquía' },
    yorkSamai: { name: 'York-Samai', from: 'Música árabe' },
    nawakhat: { name: 'Nawakhat', from: 'Música árabe' },
    cinquillo: { name: 'Cinquillo', from: 'Cuba' },
    agsagSamai: { name: 'Agsag-Samai', from: 'Música árabe' },
    venda: { name: 'Palmas de los venda', from: 'Sudáfrica' },
    bossa: { name: 'Bossa nova', from: 'Brasil' },
    bendir: { name: 'Tambor bendir', from: 'Tuareg, Libia' },
    bell: { name: 'Toque de campana', from: 'África occidental' },
    samba: { name: 'Samba', from: 'Brasil' },
    central: { name: 'Ritmo centroafricano', from: 'República Centroafricana' },
    aka: { name: 'Ritmo aka', from: 'África central' },
    sangha: { name: 'Ritmo aka', from: 'Alto Sangha, África central' },
  },

  // El ejemplo de la explicación, con los números del anillo exterior: las rondas de Bjorklund (ya dibujadas como
  // grupos de x y ·), y luego las divisiones de Euclides a = q × b + r.
  roundsIntro: (k, n) => `Cómo se reparten ${k === 1 ? '1 golpe' : `${k} golpes`} en ${n} pasos, ronda a ronda:`,
  divisionsIntro: (n, k) => `El algoritmo de Euclides con ${n} y ${k}:`,
  division: (a, q, b, r) => `${a} = ${q} × ${b} + ${r}`,
  noRounds: 'Sin golpes, o sin silencios, no hay nada que repartir.',

  guests: [
    {
      name: 'Euclides',
      note: 'En mis Elementos encontré el mayor número que mide a otros dos restando el menor del mayor, una y otra vez. Los mismos pasos reparten estos golpes.',
    },
    {
      name: 'Godfried Toussaint',
      note: 'Me di cuenta de que una receta para repartir en el tiempo los pulsos de un acelerador de partículas también genera ritmos que se tocan en todo el mundo, y en 2005 los llamé ritmos euclidianos.',
    },
  ],

  insight: {
    title: '¿De dónde vienen estos ritmos?',
    html: `<p>Pon unos pocos golpes en un círculo de pasos, tan separados como puedan estar. Cuando los golpes dividen los pasos exactamente, todos los huecos son iguales. Cuando no, los huecos son de dos tamaños, que se diferencian en un paso, mezclados de la forma más uniforme posible: 3 golpes en 8 pasos dejan huecos de 3, 3 y 2. Ese patrón es el tresillo, un ritmo básico de la música cubana, que también se toca con campanas en África occidental y en las líneas de bajo del rock and roll de la década de 1950.</p>
<h3>La resta de Euclides</h3>
<p>Para repartirlos, escribe en fila los golpes, y luego los silencios. Coloca un silencio detrás de cada golpe, y sigue colocando los grupos que sobran detrás de los demás hasta que sobre como mucho un grupo. Eric Bjorklund usó esto en 2003 para espaciar los pulsos de un acelerador de partículas, la Spallation Neutron Source. Sigue los mismos pasos que el algoritmo de Euclides para el máximo común divisor, de sus Elementos, de hacia el año 300 a. C.: divide, luego divide por el resto, una y otra vez.</p>
<div class="insight-visual" id="rhythm-rounds"></div>
<h3>Ritmos con nombre</h3>
<p>En 2005, Godfried Toussaint llamó a estos patrones ritmos euclidianos, y enumeró entre ellos ritmos tradicionales de Cuba, Brasil, África occidental y central, Turquía, Bulgaria y la música árabe. Aquí, un nombre significa el mismo patrón empezado desde cualquier paso, como en su lista: muchos ritmos se tocan empezando por otro golpe. La bossa nova empieza su 5 en 16 en el tercer golpe, y la samba su 7 en 16 en el último; «Empezar en el paso» gira un anillo. El 7 en 12 de la campana de África occidental es también el patrón de las teclas blancas entre las doce teclas de una octava del piano.</p>
<h3>Una recta en píxeles</h3>
<p>Dibuja en una pantalla una recta que sube 3 en 8, un píxel en cada columna. Sube a una fila nueva 3 veces, y las columnas donde sube vuelven a ser el tresillo. Sean cuales sean los números, la recta sube con un patrón lo más uniforme posible, leído a partir de alguna columna.</p>
<h3>Lo más separados posible</h3>
<p>De todas las maneras de colocar los golpes en los pasos, estas son las que los mantienen más separados: suma las distancias en línea recta entre cada par de golpes alrededor del círculo, y solo un ritmo euclidiano, girado o no, tiene el total más grande. Erik Demaine y sus colegas lo demostraron en 2009.</p>
<h3>Lo que la sala deja fuera</h3>
<p>Nadie afirma que los músicos usaran el algoritmo de Euclides: la uniformidad es sencillamente algo que estos ritmos comparten. Al tocar de verdad hay acentos, swing y el sonido de cada instrumento, que los golpes y los silencios dejan fuera. No todos los ritmos son euclidianos: la clave de son tiene cinco golpes en dieciséis, como la bossa nova, pero huecos de 3, 3, 4, 2 y 4. Los nombres siguen la lista de Toussaint, y el mismo patrón suele tener otros nombres en otros lugares.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Un patrón de k golpes en n pasos es un collar de k unos y n − k ceros. El algoritmo de Bjorklund mantiene dos montones de grupos, [1] × k y [0] × (n − k); en cada ronda une un grupo del montón de atrás a cada grupo del montón de delante, y lo que sobra pasa a ser el nuevo montón de atrás. Los tamaños de los montones siguen el algoritmo de Euclides con n − k y k, y el proceso termina cuando sobra como mucho un grupo.</p><p>La recta digital da el mismo collar: el paso i es un golpe cuando ⌊ik/n⌋ &gt; ⌊(i − 1)k/n⌋, el patrón que el algoritmo de Bresenham dibuja en una pantalla. En teoría musical, los conjuntos máximamente uniformes de Clough y Douthett son la misma idea aplicada a las escalas. Aquí, la uniformidad es la suma de las longitudes de las cuerdas entre todos los pares de golpes en un círculo unidad.</p><p>Las pruebas de la sala comprueban, frente a un programa aparte: la tabla de Toussaint, cada E(k, n) de hasta 32 pasos frente a la recta, todos los patrones de hasta 14 pasos en busca del reparto más separado, y los comienzos de la bossa nova y la samba.</p></details>
<div class="sources"><a class="source-link" href="https://archive.bridgesmathart.org/2005/bridges2005-47.html" target="_blank" rel="noopener">Toussaint, The Euclidean algorithm generates traditional musical rhythms (Bridges, 2005, en inglés)</a><a class="source-link" href="https://arxiv.org/abs/0705.4085" target="_blank" rel="noopener">Demaine y otros, The distance geometry of music (2009, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euclidean_rhythm" target="_blank" rel="noopener">Ritmo euclidiano (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Maximal_evenness" target="_blank" rel="noopener">Máxima uniformidad (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tresillo_(rhythm)" target="_blank" rel="noopener">Tresillo (Wikipedia, en inglés)</a></div>`,
  },
});
