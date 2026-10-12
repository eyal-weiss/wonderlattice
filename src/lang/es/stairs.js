/* La escalera del sonido · palabras para el visitante (es). */
Wonderlattice.defineText('stairs', 'es', {
  eyebrow: 'SONIDO · ILUSIÓN',
  name: 'La escalera del sonido',
  tagline: 'Una escala que sube escalón tras escalón, y nunca llega más alto.',
  title: 'La escalera del sonido.',
  subtitle:
    'Una escala sube escalón tras escalón, pero doce escalones después vuelve a estar donde empezó. Activa el sonido para oírla; la imagen muestra el truco.',
  field: 'Sonido · Octavas · Percepción',
  sceneLabel: 'Ocho tonos, separados por octavas',
  sceneNames: ['Una escala que sube sin fin', 'Una rampa que sube sin fin', 'Sin el truco'],
  tip: 'Mejor a bajo volumen, o con auriculares · Cada punto brillante es un tono, y todos suenan a la vez',
  canvasLabel:
    'Una espiral de alturas, una vuelta por cada octava, con un punto brillante en cada vuelta: los tonos que suenan juntos, más brillantes en el centro. Vista desde arriba, la espiral es un círculo de doce notas. Al lado, los mismos tonos como barras bajo una curva de volumen fija.',
  panelEyebrow: 'Escucha y mira',
  whyLabel: '¿Por qué nunca llega más alto?',
  nudge:
    'Activa el sonido y luego estrecha la curva de volumen a una octava: el truco se desmorona, y oyes cómo vuelve a caer.',
  connection: {
    html: '<strong>Una octava es el doble.</strong> Cada tono de aquí tiene el doble de frecuencia que el de debajo. En «Escucha la forma», dos tonos en razones sencillas se suman y forman pulsaciones y bucles.',
    label: 'Escucha dos tonos juntos',
  },

  presets: [
    { name: 'La escalera sin fin', note: 'Doce escalones arriba, y de vuelta al principio.' },
    { name: 'La rampa sin fin', note: 'La versión continua de Risset.' },
    { name: 'Quita el truco', note: 'Un tono cada vez: óyelo caer.' },
  ],

  soundOff: 'Activar el sonido',
  soundOn: 'Sonido activado · silenciar',
  noSound: 'El sonido no está disponible en este navegador. Aun así puedes ver cómo funciona el truco.',

  how: 'Cómo sube',
  modes: ['Escalones', 'Rampa'],
  bell: 'Ancho de la curva de volumen, en octavas',
  bellHint: 'Con una octava, solo suena un tono cada vez.',
  speed: 'Escalones por segundo',
  volume: 'Volumen',

  // Los nombres de las notas alrededor del círculo, empezando por Do.
  notes: ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'],

  pair: {
    title: '¿Sube o baja?',
    text: 'Dos notas separadas exactamente media octava. ¿La segunda sube o baja? No hay respuesta correcta.',
    play: 'Tocar dos notas',
    again: 'Tocar otro par',
    up: 'Sube',
    down: 'Baja',
    answer: (up, a, b) =>
      up
        ? `Oíste que de ${a} a ${b} sube. Otras personas oyen bajar exactamente el mismo par: en el círculo las dos notas están enfrentadas, así que subir y bajar quedan igual de lejos.`
        : `Oíste que de ${a} a ${b} baja. Otras personas oyen subir exactamente el mismo par: en el círculo las dos notas están enfrentadas, así que subir y bajar quedan igual de lejos.`,
  },

  status: {
    steps: (n, same) =>
      n < 12
        ? `${n} ${n === 1 ? 'escalón' : 'escalones'} hacia arriba`
        : `${n} escalones hacia arriba · suena igual que ${same === 0 ? 'al principio' : `el escalón ${same}`}`,
    glide: (laps) =>
      laps === 0
        ? 'Sube sin saltos'
        : `Sube sin saltos · ha vuelto al punto de partida ${laps === 1 ? 'una vez' : `${laps} veces`}`,
    pair: (a, b) => `${a}, luego ${b}: ¿sube o baja?`,
  },

  labels: {
    higher: 'más agudo',
    turn: 'una vuelta = una octava',
    above: 'Desde arriba',
    tones: 'Los tonos que oyes',
    curve: 'volumen',
    pitch: 'altura',
    drop: 'una octava abajo',
    up: '¿sube?',
    down: '¿baja?',
  },

  guests: [
    {
      name: 'Roger Shepard',
      note: 'En los Bell Labs, en la década de 1960, creé una escala que sube sin fin. Doce escalones arriba, y vuelves a estar al principio.',
    },
    {
      name: 'Jean-Claude Risset',
      note: 'Fundí los escalones en una sola rampa: un sonido que sube sin fin, y nunca llega.',
    },
    {
      name: 'Diana Deutsch',
      note: 'La psicóloga descubrió que dos notas separadas media octava suben para algunos oyentes y bajan para otros.',
    },
  ],

  insight: {
    title: '¿Por qué nunca llega más alto?',
    html: `<p>Aquí cada nota no es un tono, sino ocho, separados por octavas: un Do grave, el Do de encima, y así hasta un Do agudo, todos sonando a la vez. Una curva fija decide el volumen de cada uno. Los del medio suenan fuerte; el más grave y el más agudo se desvanecen hasta no oírse.</p>
<p>Cada escalón sube los ocho un semitono. Tras doce escalones, cada tono ha duplicado su frecuencia, así que cada uno queda justo donde empezó el de encima. El tono más agudo se ha desvanecido por arriba, uno nuevo ha aparecido por abajo, y el sonido es exactamente el del principio. Tu oído sigue la subida escalón a escalón y no nota el cambio.</p>
<div class="insight-visual">Escalón 0: Do1 Do2 Do3 Do4 Do5 Do6 Do7 Do8 · Escalón 12: Do2 Do3 Do4 Do5 Do6 Do7 Do8 Do9 · Do1 y Do9 no se oyen, así que los dos suenan igual</div>
<h3>Dos caras de una nota</h3>
<p>Una nota tiene una altura (lo aguda que es) y un croma (cuál de las doce notas es: Do, Re, Mi…). Imagínalos como una espiral: subir es la altura, dar vueltas es el croma, y cada vuelta es una octava. Vista desde arriba, la espiral es un círculo. Este sonido conserva las vueltas y esconde la subida.</p>
<h3>Quita el truco</h3>
<p>Estrecha la curva de volumen a una octava y solo suena un tono cada vez. Sube durante doce escalones, se desvanece, y un tono una octava más grave toma el relevo: la caída que la curva ancha esconde.</p>
<h3>¿Sube o baja?</h3>
<p>Dos notas separadas media octava están enfrentadas en el círculo, así que ningún sentido es más corto. En 1986, Diana Deutsch descubrió que los oyentes no se ponen de acuerdo sobre esos pares, y que cada oyente oye algunos pares subir y otros bajar. La forma de oírlos se ha relacionado con el habla con la que creció cada persona: en sus estudios, los oyentes del sur de Inglaterra y los de California tendían a oírlos de formas opuestas. Nadie se equivoca.</p>
<h3>Dónde puedes haberlo oído</h3>
<p>Jean-Claude Risset hizo una versión que se desliza en vez de subir a escalones. Los tonos de Shepard crean tensión en la música de la película <em>Dunkerque</em> (2017), de Christopher Nolan, y una versión suena en la escalera sin fin del videojuego <em>Super Mario 64</em> (1996). La misma idea en forma de imagen es la escalera imposible que Lionel y Roger Penrose publicaron en 1958 (Oscar Reutersvärd había dibujado una en 1937), y que M. C. Escher usó en <em>Ascending and Descending</em> (1960).</p>
<h3>Lo que esta sala simplifica</h3>
<p>El «sin fin» vive en el oído, no en el sonido, que se repite exactamente cada doce escalones. No todo el mundo percibe la ilusión con la misma fuerza, y los altavoces pequeños no pueden reproducir los tonos más graves, aunque la curva ya los mantiene bajos. Shepard usó una curva de este tipo, un coseno elevado, y señaló que casi cualquier curva suave que se desvanezca por los dos extremos serviría.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>En el escalón n, el tono j (j = 0 … 7) tiene una frecuencia de 32,7 Hz × 2<sup>x</sup> con x = (j + n/12) mod 8, y un volumen L(x) = ½(1 − cos(2πx/8)): 0 en x = 0 y en x = 8, y 1 en x = 4 (Do5, unos 523 Hz). Doce escalones suman 1 a cada x, mod 8, lo que da el mismo conjunto de tonos. Los volúmenes siempre suman 4, así que la intensidad del sonido nunca cambia. R. N. Shepard, «Circularity in judgments of relative pitch», Journal of the Acoustical Society of America 36 (1964) 2346–2353. D. Deutsch, «A musical paradox», Music Perception 3 (1986) 275–280.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Shepard_tone" target="_blank" rel="noopener">Tono de Shepard (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tritone_paradox" target="_blank" rel="noopener">Paradoja del tritono (Wikipedia, en inglés)</a><a class="source-link" href="https://deutsch.ucsd.edu/psychology/pages.php?i=206" target="_blank" rel="noopener">Diana Deutsch sobre la paradoja del tritono (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Penrose_stairs" target="_blank" rel="noopener">Escalera de Penrose (Wikipedia, en inglés)</a></div>`,
  },
});
