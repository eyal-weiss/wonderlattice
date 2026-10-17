/* La máquina que descubrió los sabores · palabras para el visitante (es). */
Wonderlattice.defineText('flavours', 'es', {
  eyebrow: 'RECOMENDACIONES',
  name: 'La máquina que descubrió los sabores',
  tagline: 'Nadie le dijo qué comidas son dulces. Lo averiguó viendo a quién le gustaba cada cosa.',
  title: 'La máquina que descubrió los sabores.',
  subtitle:
    'Cuarenta personas inventadas, dieciséis comidas, una tabla llena de huecos. Mira cómo un poco de aritmética ordena las comidas, y luego valora tú algunas.',
  field: 'Datos · Recomendaciones · Un truco con la información',
  sceneLabel: '40 personas · 16 comidas',
  sceneName: 'El mapa oculto',
  tip: 'Toca una comida para valorarla · Teclas: ↑↓ eligen una comida, → me gusta, ← no es para mí',
  actionLabel: 'Mostrar los rasgos que pusimos',
  hideLabel: 'Ocultar los rasgos que pusimos',
  canvasLabel:
    'A la izquierda, una tabla de qué comidas les gustan a qué personas inventadas, con muchas casillas en blanco. A la derecha, el mapa que el método dibuja a partir de ella, donde las comidas parecidas se juntan. Toca una comida para decir si te gusta, y una estrella muestra dónde estás en el mapa, con sugerencias para ti.',
  panelEyebrow: 'Tus gustos',
  whyLabel: '¿Cómo encontró los sabores?',
  nudge:
    'Marca que te gusta solo el chocolate. ¿Qué te sugiere? Ahora di también que no a algo dulce. Luego deja en blanco casi toda la tabla.',
  connection: {
    html: '<strong>Quédate con los pocos números que importan.</strong> Aquí bastan dos números por comida para rellenar los huecos de una tabla. En «¿Cuánta imagen puedes tirar?», unos pocos números por bloque bastan para rehacer una imagen.',
    label: 'Tira números de una imagen',
  },

  presets: [
    { name: 'Encuentra el mapa oculto', note: 'Mira cómo las comidas se ordenan solas.', badge: '?' },
    { name: 'Amante del dulce', note: 'Dos me gusta, dos no.', badge: '♥' },
    { name: 'Solo postres', note: 'Valora un solo tipo de comida.', badge: '1' },
  ],

  foods: [
    'Chocolate',
    'Helado',
    'Donas',
    'Panqueques',
    'Fresas',
    'Sandía',
    'Mango',
    'Palomitas',
    'Pizza',
    'Hamburguesas',
    'Papas fritas',
    'Queso',
    'Ensalada',
    'Pepino',
    'Sushi',
    'Brócoli',
  ],

  blanks: 'Casillas en blanco',
  blanksHint: 'Las casillas que nadie rellenó. El método solo ve el resto, y predice estas.',
  clear: 'Olvidar mis valoraciones',

  labels: {
    people: '40 personas inventadas →',
    you: 'Tú',
    liked: 'le gusta',
    disliked: 'no le gusta',
    guessed: 'predicción',
    map: 'El mapa que encontró',
    right: (p) => `Huecos acertados: ${p}%`,
    noBlanks: 'No hay huecos',
    tapHint: 'Di qué comidas te gustan',
    you2: 'tú',
    sweet: 'dulce',
    savoury: 'salado',
    rich: 'pesado',
    light: 'ligero',
    planted: (angle, flipped) => `Los rasgos que pusimos, girados ${angle}°${flipped ? ' y reflejados' : ''}`,
  },

  readout: {
    title: 'Sugerencias para ti',
    empty: 'Toca algunas comidas en el mapa, o en tu columna de la tabla: ♥ me gusta, ✕ no es para mí.',
    none: 'Nada más parece un sí para ti.',
    rated: (likes, nots) =>
      `${likes === 1 ? 'Te gusta' : 'Te gustan'} ${likes}, y ${nots} no ${nots === 1 ? 'es' : 'son'} para ti.`,
    stays: 'Tus valoraciones se quedan en esta página.',
  },

  status: {
    running: (n) => `Ronda ${n}`,
    right: (p) => `${p}% de aciertos`,
    full: 'Sin huecos',
  },
  announce: {
    found: (n, p) => `Encontró el mapa tras ${n} ${n === 1 ? 'ronda' : 'rondas'}. Acertó el ${p}% de los huecos.`,
    full: (n) => `Encontró el mapa tras ${n} ${n === 1 ? 'ronda' : 'rondas'}. No había huecos que predecir.`,
    suggest: (list) => `Sugerencias para ti: ${list}.`,
    nothing: 'Nada más parece un sí para ti.',
    rate: (food, word) => `${food}: ${word}.`,
    like: 'me gusta',
    not: 'no es para mí',
    unrated: 'sin valorar',
    planted: (angle, flipped) =>
      `Los rasgos que pusimos coinciden con el mapa girado ${angle} grados${flipped ? ' y reflejado' : ''}.`,
  },

  guests: [
    {
      name: 'Eugenio Beltrami',
      note: 'En 1873 mostré que una tabla cuadrada de números se puede descomponer en un giro, un estiramiento a lo largo de cada dirección y otro giro. Hoy esos estiramientos se llaman sus valores singulares.',
    },
    {
      name: 'Camille Jordan',
      note: 'Yo también lo encontré, un año después y por mi cuenta. Sesenta años más tarde, Eckart y Young mostraron que quedarse solo con los estiramientos más grandes da la tabla más pequeña que más se le parece.',
    },
  ],

  insight: {
    title: '¿Cómo encontró los sabores?',
    html: `<p>Cada comida recibe dos números, y cada persona también: un punto en el mapa. La predicción del método para una persona y una comida multiplica sus primeros números, multiplica sus segundos números y los suma (un producto escalar), así que una comida puntúa alto para alguien cuando queda lejos en la dirección de esa persona. Empieza con puntos al azar y los empuja un poco, ronda tras ronda, para que sus predicciones coincidan con las casillas que conoce. Las comidas que les gustan a las mismas personas tienen que acabar en la misma dirección, así que las comidas parecidas se juntan. Nadie le habló del dulzor: «dulce» es solo una dirección que explica muchos «me gusta» a la vez.</p>
<div class="insight-visual">predicción = 1.º de la persona × 1.º de la comida + 2.º de la persona × 2.º de la comida → ajustar las casillas conocidas → los huecos son predicciones</div>
<h3>La respuesta la pusimos nosotros</h3>
<p>Las cuarenta personas son inventadas, a propósito. Cada comida recibió dos rasgos ocultos, lo dulce y lo pesada que es, y cada persona un gusto por cada uno, más un pequeño capricho, y la tabla dice si le gustó. Luego se ocultaron algunas casillas. El método nunca ve los rasgos. Como sabemos qué hay en los huecos, podemos puntuar sus predicciones: con el 60% de la tabla en blanco acierta alrededor del 82%, mientras que alguien que conociera exactamente los rasgos que pusimos acertaría alrededor del 90%, por los caprichos. Con el 90% en blanco, apenas lo hace mejor que lanzar una moneda.</p>
<h3>Un mapa sin rótulos</h3>
<p>Gira todo el mapa, o refléjalo, y cada predicción sigue igual, así que el método no puede saber hacia dónde queda «dulce». Las direcciones significan algo, pero son las personas quienes tienen que nombrarlas. Por eso los rasgos que pusimos aparecen girados cuando los muestras, y un poco desviados: el método encuentra lo que mejor explica la tabla, no lo que nosotros teníamos en mente.</p>
<h3>Tu estrella</h3>
<p>Tus valoraciones te sitúan en el mapa: en el punto cuyas predicciones mejor coinciden con ellas. Las sugerencias son las comidas que no has valorado con las predicciones más altas, las que quedan más lejos en tu dirección. Valora un solo tipo de comida y el mapa te conoce en una sola dirección, así que te sugiere más de lo mismo. Tus valoraciones se quedan en esta página; no se envía nada a ningún sitio.</p>
<h3>Lo que esta sala simplifica</h3>
<p>Los gustos reales necesitan más de dos números, y las tablas reales están casi vacías: cada persona ha valorado una parte diminuta de las películas o canciones. El Premio Netflix (de 2006 a 2009) ofrecía un millón de dólares por predecir las valoraciones de películas un 10% mejor que el propio sistema de Netflix, y las mezclas de los equipos punteros estaban hechas sobre todo de métodos como este. Los sistemas de recomendación de hoy usan mucho más: qué hiciste y cuándo, dónde estás, grandes redes neuronales y los propios objetivos del negocio. Esta sala muestra la idea, no cómo recomienda cosas hoy ninguna empresa.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Escribe la tabla como una matriz R, personas por comidas, con +1 para un «me gusta» y −1 para un no. El método busca una matriz de personas U y una matriz de comidas V, de dos columnas cada una, que hagan pequeña la suma Σ (r − uᵢ·vⱼ)² sobre las casillas conocidas más λ(Σ|uᵢ|² + Σ|vⱼ|²), aquí con λ = 1, por descenso de gradiente desde un pequeño comienzo al azar. La penalización evita que se pliegue a cada capricho. Tu punto es la u que hace pequeña esa misma suma solo sobre tus valoraciones. Sin huecos y sin penalización, la mejor respuesta se conoce exactamente: la descomposición en valores singulares, recortada a sus dos valores singulares más grandes (Eckart y Young, 1936); con huecos no hay una fórmula así, y el método solo busca. La descomposición en valores singulares la encontraron Eugenio Beltrami en 1873 y Camille Jordan en 1874. Y. Koren, R. Bell y C. Volinsky, «Matrix factorization techniques for recommender systems», IEEE Computer 42(8), agosto de 2009.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Matrix_factorization_(recommender_systems)" target="_blank" rel="noopener">Factorización de matrices en sistemas de recomendación (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Descomposición en valores singulares (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Netflix_Prize" target="_blank" rel="noopener">Premio Netflix (Wikipedia, en inglés)</a><a class="source-link" href="https://datajobs.com/data-science-repo/Recommender-Systems-%5BNetflix%5D.pdf" target="_blank" rel="noopener">Koren, Bell y Volinsky 2009 (PDF, en inglés)</a></div>`,
  },
});
