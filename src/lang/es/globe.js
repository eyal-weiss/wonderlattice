/* El triángulo de tres ángulos rectos · palabras para el visitante (es). */
Wonderlattice.defineText('globe', 'es', {
  eyebrow: 'ESPACIO CURVO',
  name: 'El triángulo de tres ángulos rectos',
  tagline:
    'En una pelota, un triángulo puede tener tres ángulos rectos, y una flecha que se lleva a su alrededor vuelve a casa girada.',
  title: 'El triángulo de tres ángulos rectos.',
  subtitle:
    'Un triángulo dibujado en una pelota, con ángulos que suman 270°. Arrastra sus esquinas, o encógelo hasta que la pelota parezca plana.',
  field: 'Geometría en una pelota · Curvatura · Transporte paralelo',
  sceneLabel: 'En una pelota · lados rectos, ángulos gordos',
  tip: 'Arrastra una esquina para cambiar la forma del triángulo, o arrastra la pelota para girarla · Teclas: 1, 2, 3 eligen una esquina, las flechas la mueven (o giran la pelota), Esc la suelta, Enter da otra vuelta',
  actionLabel: 'Dar otra vuelta',
  canvasLabel:
    'Una pelota con una cuadrícula de meridianos y paralelos. Sobre ella, un triángulo cuyos lados son arcos de círculo máximo, con sus tres ángulos marcados. Un caminante lleva una flecha alrededor del triángulo.',
  panelEyebrow: 'Da forma al triángulo',
  whyLabel: '¿Por qué más de 180°?',
  nudge:
    'Baja el tamaño hasta que el triángulo sea una mota. Sus ángulos vuelven poco a poco a 180°, porque para una hormiga una pelota parece plana.',
  connection: {
    html: '<strong>Superficies curvas, reglas rectas.</strong> En una pelota, a los triángulos les engordan los ángulos. En «Deforma el plano», una función deforma una imagen plana y conserva cada ángulo diminuto tal como era.',
    label: 'Deforma el plano',
  },

  presets: [
    { name: 'Tres ángulos rectos', note: 'Del polo al ecuador, un cuarto de vuelta, y de regreso al polo.' },
    { name: 'Un cuarto de la pelota', note: 'Tres ángulos de 120°. Cuatro como este cubren la pelota.' },
    { name: 'El triángulo de una hormiga', note: 'Tan pequeño que es casi plano.' },
  ],
  yourOwn: 'Tu propio triángulo',

  // Los números llegan ya escritos en el idioma de la página.
  degrees: (x) => `${x}°`,
  percent: (x) => `${x}%`,
  sum: (parts, total) => `${parts.join(' + ')} = ${total}`,
  more: (extra) => `${extra} más que en el plano (180°)`,
  walking: 'Llevando la flecha, sin girarla nunca…',
  home: (turned) => `De vuelta en casa: la flecha ha girado ${turned}`,
  zoomed: (n) => `Visto ${n} veces más de cerca`,
  chart: {
    title: 'Cada triángulo que haces cae sobre una misma recta',
    across: 'Parte de la pelota',
    up: 'Exceso sobre 180°',
  },
  corner: (n) => `${n}`,

  size: 'Tamaño del triángulo',
  sizeHint: 'Encógelo hasta una mota, o agrándalo hasta que cubra casi media pelota.',
  shareOf: (share) => `${share} de la pelota`,
  readout: {
    angles: 'Sus tres ángulos',
    extra: 'Pasa de 180° en',
    share: 'Parte de la pelota',
    turned: 'La flecha volvió a casa girada',
  },
  onItsWay: 'en camino…',
  rule: (share, extra) =>
    `${share} de la pelota × 720° = ${extra}. En cualquier pelota, el exceso es la parte de la pelota que ocupa el triángulo, por 720°.`,
  status: (total) => `Los ángulos suman ${total}`,
  picked: (n) => `Esquina ${n}: las flechas del teclado la mueven. Esc la suelta.`,
  letGo: 'Las flechas del teclado giran la pelota.',
  cameHome: (turned, total) => `Los ángulos suman ${total}. La flecha volvió a casa girada ${turned}.`,

  guests: [
    {
      name: 'Albert Girard',
      note: 'En 1629 publicó que los ángulos de un triángulo sobre una pelota suman más de 180°, en una cantidad que crece con su área.',
    },
    {
      name: 'Carl Friedrich Gauss',
      note: 'Demostró en 1827 que la curvatura de una superficie puede medirse desde dentro, solo con ángulos y distancias, sin salir nunca de ella.',
    },
    {
      name: 'Tullio Levi-Civita',
      note: 'En 1917 describió cómo llevar una flecha por una superficie curva sin girarla, la idea que sigue aquí el caminante.',
    },
  ],

  insight: {
    title: '¿Por qué más de 180°?',
    html: `<p>En una pelota, los caminos más rectos son los círculos máximos, como el ecuador y las líneas que van de polo a polo. Un triángulo cuyos lados los siguen se abomba hacia fuera, así que sus ángulos suman más que los 180° de un triángulo plano. Camina desde el Polo Norte hasta el ecuador, gira a la izquierda, recorre un cuarto de la vuelta, vuelve a girar a la izquierda y sube de nuevo hasta el polo: te encuentras con tu propio camino en ángulo recto, y los tres ángulos miden 90°.</p>
<div class="insight-visual">suma de los ángulos − 180° = parte de la pelota × 720°</div>
<h3>El exceso es el área</h3>
<p>El ángulo de más es proporcional al área del triángulo. La pelota entera vale 720°, así que un triángulo que cubre un octavo de ella tiene 90° de sobra, y cada 1% de la pelota añade 7,2°. Encoge un triángulo hasta una mota y su exceso casi desaparece: un trozo pequeño de una pelota es casi plano, y por eso la geometría plana funciona tan bien para un jardín o un pueblo.</p>
<h3>Una flecha que nunca gira vuelve girada</h3>
<p>El caminante lleva una flecha y la mantiene siempre con el mismo ángulo respecto al camino recto que recorre. Solo gira el camino, en las esquinas; la flecha, nunca. Y aun así vuelve a casa girada exactamente lo que vale el exceso. En un papel plano volvería tal como salió. Llevar una flecha así se llama transporte paralelo, y el giro que acumula en una vuelta completa se llama holonomía. Significa que un ser que viviera en la superficie, sin poder salir de ella ni verla desde fuera, podría descubrir igualmente que su mundo es curvo.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>En una pelota de radio R, un triángulo con ángulos A, B y C (en radianes) tiene área (A + B + C − π)R². Albert Girard lo publicó en 1629; Thomas Harriot lo había descubierto en 1603, pero nunca lo publicó. Es un caso particular del teorema de Gauss–Bonnet: en cualquier superficie, la suma de los ángulos de un triángulo supera π en la curvatura total que encierra, y el transporte paralelo alrededor del triángulo gira una flecha en sentido antihorario esa misma cantidad (si la vuelta se recorre en sentido antihorario). Gauss demostró en 1827, en su <em>Theorema Egregium</em> («teorema notable»), que la curvatura puede medirse desde dentro de una superficie. Tullio Levi-Civita describió el transporte paralelo en espacios curvos en 1917, y Élie Cartan introdujo la holonomía en 1926.</p>
<p>La sala calcula cada área solo a partir de las esquinas (con una fórmula de Van Oosterom y Strackee, de 1983), y cada ángulo a partir de las direcciones de los lados. Sus pruebas comprueban que los dos cálculos siempre coinciden, y que una flecha llevada a pasos pequeños gira lo mismo.</p>
<p>La misma geometría está detrás del péndulo de Foucault, mostrado por primera vez en París en 1851. La Tierra, al girar, lleva el péndulo alrededor de su círculo de latitud, y su oscilación gira 360° × sin(latitud) en un día sidéreo (unas 23 horas y 56 minutos). Ahí interviene también la rotación de la Tierra, así que el caminante de aquí solo comparte la geometría: no es un péndulo.</p></details>
<h3>Lo que la sala deja fuera</h3>
<p>Aquí la pelota es perfectamente redonda. La Tierra está un poco achatada: del centro a un polo hay alrededor de un 0,3% menos que del centro al ecuador. Así que, en la Tierra real, los números cambian un poco. Los lados siempre toman el camino más corto alrededor de su círculo máximo, y los ángulos se muestran redondeados, pero siempre de modo que den la suma que se muestra.</p>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/GirardsSphericalExcessFormula.html" target="_blank" rel="noopener">La fórmula del exceso esférico de Girard (MathWorld, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Spherical_trigonometry" target="_blank" rel="noopener">Trigonometría esférica (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parallel_transport" target="_blank" rel="noopener">Transporte paralelo (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Holonomy" target="_blank" rel="noopener">Holonomía (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gauss%E2%80%93Bonnet_theorem" target="_blank" rel="noopener">Teorema de Gauss–Bonnet (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Theorema_Egregium" target="_blank" rel="noopener">Theorema Egregium (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Levi-Civita_connection" target="_blank" rel="noopener">Conexión de Levi-Civita (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Solid_angle" target="_blank" rel="noopener">Ángulo sólido (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Foucault_pendulum" target="_blank" rel="noopener">Péndulo de Foucault (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Figure_of_the_Earth" target="_blank" rel="noopener">La figura de la Tierra (Wikipedia, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Girard_Albert/" target="_blank" rel="noopener">Albert Girard (MacTutor, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/" target="_blank" rel="noopener">Carl Friedrich Gauss (MacTutor, en inglés)</a></div>`,
  },
});
