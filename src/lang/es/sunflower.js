/* El ángulo secreto del girasol · palabras para el visitante (es). */
Wonderlattice.defineText('sunflower', 'es', {
  eyebrow: 'ÁNGULO ÁUREO',
  name: 'El ángulo secreto del girasol',
  tagline: 'Gira un poco, suelta una semilla, repite. Solo un ángulo hace un girasol.',
  title: 'El ángulo secreto del girasol.',
  subtitle:
    'Cada semilla está girada un poco respecto a la anterior. Cambia el giro una décima de grado y el girasol se deshace.',
  field: 'Teoría de números · Filotaxis · Plantas',
  sceneLabel: 'Un giro · mil semillas',
  sceneName: 'La cabeza de la flor',
  tip: 'Toca la flor para contar sus brazos · ← → giran 0,01°, ↑ ↓ giran 0,1°',
  actionLabel: 'Volver a crecer',
  canvasLabel:
    'La cabeza de un girasol con mil semillas. Cada semilla está girada el mismo ángulo respecto a la anterior, un poco más hacia fuera.',
  panelEyebrow: 'Un ángulo, muchas flores',
  whyLabel: '¿Por qué un solo ángulo hace un girasol?',
  nudge:
    'Encuentra un ángulo que forme radios rectos y luego cámbialo 0,01°. ¿Cuántos brazos aparecen? ¿Son números de Fibonacci?',
  connection: {
    html: '<strong>Alan Turing, otra vez.</strong> Se preguntaba cómo crean sus patrones los seres que crecen. En «Haz crecer una huella dactilar», su química traza las crestas.',
    label: 'Haz crecer una huella dactilar',
  },

  presets: [
    { name: 'Un girasol', note: 'El ángulo áureo.', badge: '137,5°' },
    { name: 'Una décima de grado más', note: 'Se abren huecos entre los brazos.', badge: '137,6°' },
    { name: 'Tres octavos de vuelta', note: 'Ocho radios rectos.', badge: '135°' },
  ],

  angle: 'Giro entre semillas',
  nudgeGroup: 'Cambia un poco el giro',
  // Los botones bajo el deslizador; reciben el paso ya escrito como la página escribe los números («0,01°»).
  more: (step) => `${step} más`,
  less: (step) => `${step} menos`,
  arms: 'Mostrar los brazos y contarlos',

  // La línea de estado: lo que se ve cerca del borde (o donde tocó el visitante). Los recuentos son enteros.
  status: {
    growing: (seeds) => `Creciendo: ${seeds} semillas`,
    spokes: (q) => (q === 1 ? 'Una sola línea recta' : `${q} radios rectos`),
    gaps: (q) => `Se abren huecos entre ${q} brazos curvos`,
    packed: (a, b) => `Bien apretadas: ${a} brazos en un sentido, ${b} en el otro`,
  },

  // Palabras dibujadas en la imagen: cortas.
  labels: {
    degrees: (value) => `${value}°`, // el giro, ya escrito como la página escribe los números
    golden: 'el ángulo áureo',
    ofTurn: (p, q) => `${p}/${q} de vuelta`,
    fibonacci: 'Números de Fibonacci',
  },

  guests: [
    {
      name: 'Leonardo de Pisa (Fibonacci)',
      note: 'En 1202, su libro de cálculo preguntaba a qué ritmo se reproducen los conejos. La respuesta, 1, 1, 2, 3, 5, 8, 13…, lleva hoy su apodo.',
    },
    {
      name: 'Alan Turing',
      note: 'En sus últimos años estudió por qué las plantas colocan sus hojas y sus semillas en espirales de Fibonacci. En 2012, año de su centenario, el público cultivó girasoles para ponerlo a prueba.',
    },
  ],

  insight: {
    title: '¿Por qué un solo ángulo hace un girasol?',
    html: `<p>Cada semilla nueva está girada el mismo ángulo respecto a la anterior y queda un poco más hacia fuera. Si ese giro es una fracción sencilla de una vuelta completa, por ejemplo 3/8, cada octava semilla cae en la misma recta desde el centro: ocho radios, con cuñas vacías entre ellos. Un giro <em>cercano</em> a 3/8 curva esos radios en ocho brazos curvos, con huecos entre ellos.</p>
<div class="insight-visual">un giro de p/q → q radios · cerca de p/q → q brazos curvos</div>
<h3>El ángulo que esquiva todas las fracciones</h3>
<p>Para llenar la cabeza sin huecos, el giro tiene que mantenerse lejos de toda fracción sencilla. El ángulo áureo, 360°/φ² ≈ 137,508° (φ = 1,618…, el número áureo), lo consigue mejor que ningún otro: las fracciones se acercan a φ más despacio que a cualquier otro número. Sus mejores aproximaciones son 1/3, 2/5, 3/8, 5/13, 8/21 y 13/34 de vuelta: cocientes de números de Fibonacci. Por eso las dos familias de brazos que puedes contar son números de Fibonacci vecinos, 13 y 21 cerca del centro, 55 y 89 cerca del borde de mil semillas.</p>
<h3>Girasoles de verdad</h3>
<p>Las plantas no son tan ordenadas. En el estudio de ciencia ciudadana <em>Turing’s Sunflowers</em>, con 657 cabezas de girasol, 565 de los 768 recuentos de espirales eran números de Fibonacci, y otros 67 tenían una estructura emparentada con Fibonacci. El resto no, y los recuentos de uno menos que un número de Fibonacci aparecieron con una frecuencia sorprendente. Algunas cabezas no tenían ninguna espiral clara.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Al modelo se le da el ángulo; no explica por qué una planta lo usa. En la cabeza de una flor real, los brotes nuevos se forman donde se acumula una hormona, la auxina, y cada brote la retira de su entorno, así que el siguiente se forma en otro sitio. Stéphane Douady e Yves Couder dejaron caer gotitas magnetizadas una tras otra sobre aceite, donde se repelen: cada gota nueva se asienta lo más lejos que puede de las últimas, y al ritmo adecuado el ángulo áureo aparece por sí solo.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Un giro de 0,381966… tiene la fracción continua 1/(2 + 1/(1 + 1/(1 + …))), con todos los términos iguales a 1 después del 2: ninguna fracción continua se acerca más despacio. Sus mejores fracciones, las convergentes, son F<sub>k</sub>/F<sub>k+2</sub>: 1/3, 2/5, 3/8, 5/13… Los vecinos más cercanos de una semilla están un número de Fibonacci de semillas antes o después de ella, y ese número crece más o menos al mismo paso que la distancia al centro. Exactamente 137,5° son 55/144 de vuelta, así que da 144 radios, aunque solo cuando hay unos pocos miles de semillas.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1016/0025-5564(79)90080-4" target="_blank" rel="noopener">H. Vogel, A better way to construct the sunflower head (1979, en inglés)</a><a class="source-link" href="https://doi.org/10.1098/rsos.160091" target="_blank" rel="noopener">J. Swinton, E. Ochu y otros, Turing’s Sunflowers (2016, en inglés)</a><a class="source-link" href="https://doi.org/10.1103/PhysRevLett.68.2098" target="_blank" rel="noopener">S. Douady, Y. Couder, Phyllotaxis as a self-organised growth process (1992, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Golden_angle" target="_blank" rel="noopener">Ángulo áureo (Wikipedia, en inglés)</a></div>`,
  },
});
