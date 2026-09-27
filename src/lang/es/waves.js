Wonderlattice.defineText('waves', 'es', {
  eyebrow: 'ONDAS · SONIDO',
  name: 'Escucha la forma',
  tagline: 'Dos tonos se combinan en pulsaciones, silencio y un retrato que da vueltas.',
  title: 'Escucha la forma.',
  subtitle: 'Dos tonos. Un poco de distancia entre ellos. Escucha lo que cambia.',
  field: 'Ondas · Razones · Interferencia',
  sceneLabel: 'Una conversación en ondas',
  sceneName: 'Dos tonos, juntos',
  tip: 'Modelo de ondas en cámara lenta · El sonido suena a su altura real',
  actionLabel: 'Activar el sonido',
  canvasLabel: 'Dos ondas senoidales y su señal combinada. Elige «Retrato circular» para verlas de otra manera.',
  panelEyebrow: 'Escucha y mira',
  whyLabel: '¿Por qué pasa esto?',
  nudge:
    'Prueba «Casi afinados». Oye cómo el volumen crece y se apaga cuando dos tonos cercanos entran y salen de sincronía.',
  connection: {
    html: '<strong>Los círculos se vuelven ondas.</strong> La altura de un punto que da vueltas en un círculo sigue una onda senoidal. Combina movimientos circulares y estarás de vuelta en Pinta con movimiento.',
    label: 'Pinta con estas ideas',
  },
  presets: [
    {
      name: 'Una quinta justa',
      note: 'Una relación sencilla de 3:2.',
    },
    {
      name: 'Casi afinados',
      note: 'Dos tonos cercanos crean un pulso.',
    },
    {
      name: 'El sonido del silencio',
      note: 'Ondas iguales, desfasadas media vuelta.',
    },
  ],
  soundOff: 'Activar el sonido',
  soundOn: 'Silenciar',
  noSound: 'El sonido no está disponible en este navegador. Aun así puedes explorar las ondas.',
  firstTone: 'Primer tono',
  secondTone: 'Segundo tono',
  secondToneHint: 'En relación con el primer tono.',
  phase: 'Fase inicial',
  volume: 'Volumen',
  hz: ' Hz',
  view: 'Otra forma de verlo',
  viewGroup: 'Vista de las ondas',
  viewWaves: 'Sumar ondas',
  viewPortrait: 'Retrato circular',
  beatDetail: (f, g, d) => `Tus tonos: ${f} Hz y ${g} Hz. La diferencia entre sus frecuencias es de ${d} Hz.`,
  status: (f, g) => `${f} Hz + ${g} Hz`,
  labels: {
    a: (f) => `A · ${f} Hz`,
    b: (f) => `B · ${f} Hz`,
    sum: 'A + B · COMBINADAS',
    firstTone: 'PRIMER TONO →',
    secondTone: 'SEGUNDO TONO ↑',
  },
  guests: [
    {
      name: 'Jules Lissajous',
      note: 'Dos vibraciones sencillas pueden dibujar un lazo sorprendentemente elaborado.',
    },
    {
      name: 'Joseph Fourier',
      note: 'Muchas ondas sencillas pueden esconderse dentro de un sonido complicado.',
    },
  ],
  insight: {
    title: 'Cuando las ondas se encuentran.',
    html: `<p>Un tono es una onda suave que se repite. Dos tonos se suman: en cada instante, sus desplazamientos se refuerzan o se contrarrestan. La línea brillante de abajo es su suma.</p>
<h3>Un ritmo dentro de dos tonos</h3>
<p>Cuando dos frecuencias están cerca, su suma se hace más fuerte y más débil una y otra vez. Esos pulsos se llaman <em>pulsaciones</em> (o batidos). Su ritmo es la diferencia entre las dos frecuencias.</p>
<div class="insight-visual" id="beat-detail"></div>
<h3>Dos sonidos pueden hacer silencio</h3>
<p>Elige «El sonido del silencio». Dos ondas iguales desfasadas medio ciclo se anulan en esta mezcla electrónica. En el mundo real, la anulación depende de dónde escuches y de cómo te lleguen las ondas.</p>
<h3>Mira de lado</h3>
<p>Prueba «Retrato circular». Usamos la primera onda para la posición horizontal y la segunda para la vertical. La figura de Lissajous que resulta convierte una relación entre ritmos en una forma.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>A(t) = sin(2πft)<br>B(t) = sin(2πfrt + φ)<br>La señal combinada es A(t) + B(t).</p><p>El modelo en cámara lenta conserva la razón entre las frecuencias y la fase inicial. Los tonos audibles suenan a las alturas indicadas. Las razones sencillas se repiten enseguida; dos alturas cercanas pero distintas producen pulsaciones.</p></details>
<div class="sources"><a class="source-link" href="https://www.physicsclassroom.com/class/sound/Lesson-3/Interference-and-Beats" target="_blank" rel="noopener">Explora la interferencia y las pulsaciones (en inglés)</a></div>`,
  },
});
