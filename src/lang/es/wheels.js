/* Ruedas cuadradas, viaje suave · palabras para el visitante (es). */
Wonderlattice.defineText('wheels', 'es', {
  eyebrow: 'CAMINOS Y RUEDAS',
  name: 'Ruedas cuadradas, viaje suave',
  tagline:
    'Un carrito con ruedas cuadradas avanza perfectamente a nivel por el camino adecuado. Dibuja cualquier rueda, y tendrá su propio camino.',
  title: 'Ruedas cuadradas, viaje suave.',
  subtitle:
    'Ruedas cuadradas sobre un camino de jorobas: el vaso de agua se queda perfectamente quieto. Abajo, el mismo carrito en un camino plano. Cambia las ruedas, o dibuja las tuyas.',
  field: 'Geometría · Caminos y ruedas · La catenaria',
  sceneLabel: 'Las mismas ruedas · dos caminos',
  tip: 'Arrastra los puntos de tu propia rueda hacia dentro o hacia fuera · Teclas: ← → cambian los lados, o eligen un punto de tu propia rueda, y ↑ ↓ lo mueven · Enter: otra rueda',
  actionLabel: 'Otra rueda',
  canvasLabel:
    'Dos carriles. Arriba, un carrito con ruedas cuadradas rueda sobre un camino de jorobas redondeadas, y el vaso de agua que lleva encima avanza siempre a la misma altura. Abajo, el mismo carrito rueda por un camino plano, dando tumbos arriba y abajo y salpicando el agua. En una imagen grande, más abajo: ruedas de 3 a 8 lados, cada una rodando por su propio camino, con la esquina del triángulo clavándose en la siguiente joroba, marcada en rojo; y una cadena colgante junto a la misma curva invertida, una joroba del camino del cuadrado. Una rueda dibujada tiene doce puntos que se pueden arrastrar hacia dentro o hacia fuera.',
  panelEyebrow: 'Elige una rueda',
  whyLabel: '¿Por qué avanza sin altibajos?',
  nudge:
    'Sube los lados hasta 12: las jorobas se aplanan hasta acercarse a un camino plano, el que necesita una rueda redonda. Luego baja hasta 3, y mira cómo la esquina del triángulo se clava en la siguiente joroba.',
  connection: {
    html: '<strong>Curvas hechas girando.</strong> Aquí una rueda que gira decide la forma de su camino. En «Pinta con movimiento», dos brazos que giran dibujan flores.',
    label: 'Pinta con movimiento',
  },

  presets: [
    { name: 'Ruedas cuadradas', note: 'Cada joroba es una cadena colgante, invertida.' },
    { name: 'Un triángulo que choca', note: 'Su esquina se clava en la siguiente joroba.' },
    { name: 'Una rueda en forma de corazón', note: 'Dibuja la tuya: cada rueda tiene su camino.' },
  ],
  // El nombre de la escena para una rueda regular que no es una de las predefinidas, y para una dibujada.
  sidesName: (n) =>
    n === 3
      ? 'Ruedas triangulares'
      : n === 4
        ? 'Ruedas cuadradas'
        : n === 5
          ? 'Ruedas pentagonales'
          : n === 6
            ? 'Ruedas hexagonales'
            : n === 8
              ? 'Ruedas octogonales'
              : `Ruedas de ${n} lados`,
  yourOwn: 'Tu propia rueda',

  kind: 'Tipo de rueda',
  regular: 'Ruedas regulares',
  drawn: 'Tu propia rueda',
  sides: 'Lados de la rueda',
  sidesHint: 'Más lados, jorobas más pequeñas. El triángulo no puede rodar por su camino.',
  startFrom: 'Empieza con',
  shapes: { heart: 'Corazón', flower: 'Flor', egg: 'Huevo', star: 'Estrella', circle: 'Círculo' },
  drawHint:
    'Arrastra los puntos de la rueda hacia dentro o hacia fuera, y su camino cambia con ella. Lleva la hendidura del corazón hacia el eje, y mira qué pasa.',

  // Los números llegan ya escritos en el idioma de la página.
  percent: (x) => `${x}%`,
  readout: {
    level: 'En su propio camino, el eje se mantiene perfectamente a nivel.',
    crash: 'En su propio camino, chocaría.',
    bumps: 'Cada joroba de su camino mide de alto',
    bumpsValue: (share) => `el ${share} del radio`,
    bob: 'En un camino plano, el eje sube y baja',
    bobValue: (share) => `un ${share} del radio`,
    bobDrawn: (share) => `un ${share} del radio más largo`,
    cuts: 'Se clava en su camino',
    cutsValue: (depth) => `un ${depth} del radio`,
    cutsDrawn: (depth) => `un ${depth} del radio más largo`,
    during: 'Va chocando durante',
    duringValue: (share) => `el ${share} del recorrido`,
    clear: 'No se clava en su camino',
    clearValue: 'en ningún punto',
    radius: 'El radio va del eje a una esquina.',
    rule: 'La altura de las jorobas es exactamente la del sube y baja que compensan.',
    drawnRule: 'Su camino es tan largo como su borde, y baja tanto como el borde se aleja del eje.',
  },
  status: { level: 'Sin altibajos', crash: 'Chocaría' },

  // Palabras dibujadas en la imagen.
  labels: {
    own: 'En su camino',
    flat: 'Las mismas ruedas en un camino plano',
    flatOne: 'La misma rueda en un camino plano',
    crash: 'La esquina se clava en la próxima joroba',
    crashDrawn: 'La rueda y su camino chocan',
    closer: (n) => `${n}× más cerca`,
    gallery: 'Cada rueda regular, su camino · Toca una para probarla',
    galleryDrawn: 'Ruedas para empezar · Toca una para probarla',
    chain: 'Una cadena colgada de dos clavos',
    turned: 'Invertida: una joroba para el cuadrado',
    sides: (n) => `${n} lados`,
    crashes: 'choca',
  },

  announce: {
    level: (name, bump) => `${name}: un viaje sin altibajos, sobre jorobas de una altura igual al ${bump} del radio.`,
    levelDrawn: (name) => `${name}: un viaje sin altibajos por su propio camino.`,
    crash: (name) => `${name}: en su propio camino se produciría un choque.`,
    picked: (n) => `Punto ${n} de 12: las flechas arriba y abajo lo mueven hacia fuera y hacia dentro.`,
  },

  guests: [
    {
      name: 'Johann Bernoulli',
      note: 'En 1691 encontró la forma de una cadena colgada de dos clavos, un acertijo planteado por su hermano Jacob: su primer gran resultado por su cuenta.',
    },
    {
      name: 'Christiaan Huygens',
      note: 'Fue el primero en llamar catenaria a la curva de la cadena colgante, de la palabra latina para «cadena», en una carta a Leibniz de 1690.',
    },
    {
      name: 'Gottfried Leibniz',
      note: 'También resolvió el problema de la cadena colgante. Su respuesta, la de Huygens y la de Johann Bernoulli se publicaron una junto a otra en una revista en junio de 1691.',
    },
  ],

  insight: {
    title: '¿Por qué avanza sin altibajos?',
    html: `<p>Para que el eje avance siempre a la misma altura, deben cumplirse dos cosas en todo momento. El punto donde la rueda toca el camino tiene que estar justo debajo del eje, así que ahí el camino debe quedar exactamente tan por debajo del eje como ese punto del borde: a poca distancia bajo el centro de un lado, y a mucha bajo una esquina. Y la rueda no debe resbalar, así que cada trocito de camino tiene que medir lo mismo que el trocito de borde que rueda sobre él.</p>
<div class="insight-visual">profundidad del camino = distancia del eje al borde · longitud del camino = longitud del borde</div>
<h3>Cadenas colgantes del revés</h3>
<p>Para un lado recto, esas dos reglas dan una curva famosa: la forma de una cadena que cuelga entre dos clavos, llamada catenaria, puesta del revés. Cada lado del cuadrado rueda sobre una joroba, y cada esquina cae en el valle entre dos jorobas, donde estas se encuentran en ángulo recto, igual que la esquina. Con más lados, las jorobas se vuelven más bajas y más cortas. A medida que crece el número de lados, la rueda se vuelve redonda y su camino, plano.</p>
<p>La altura de las jorobas es exactamente la del sube y baja que compensan. En un camino plano, el eje sube y baja tanto como la diferencia entre su distancia a una esquina y su distancia al centro de un lado; en su propio camino, los valles quedan justo eso más hondos que las cimas.</p>
<h3>Por qué falla el triángulo</h3>
<p>Las dos reglas también dan un camino para un triángulo, pero no se puede recorrer. Mientras el triángulo rueda sobre una joroba, su esquina delantera baja y se clava en la siguiente joroba antes de llegar al valle. El camino es correcto allí donde la rueda lo toca, y estorba en el resto. Toda rueda regular de cuatro lados o más avanza sin chocar con su camino.</p>
<h3>Cualquier rueda, su propio camino</h3>
<p>Tu propia rueda sigue las mismas dos reglas, así que un corazón o un huevo también tienen su camino. La sala lo construye a partir de la distancia del eje al borde de la rueda en cada dirección, y luego comprueba, en cientos de momentos mientras la rueda gira, si alguna parte del camino se mete dentro de ella. Algunas ruedas fallan, y los lugares se marcan en rojo: una punta afilada se clava en la siguiente joroba, como la esquina del triángulo, o una hendidura profunda crea en el camino un pico alto y afilado, que se mete en el borde antes de que la hendidura llegue, al girar, hasta él.</p>
<p>Los puntos de tu rueda solo se mueven hacia dentro y hacia fuera a lo largo de sus radios, así que cada dirección desde el eje encuentra el borde exactamente una vez. Un borde que se doblara hacia atrás, visto desde el eje, necesitaría un camino que subiera en vertical.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Describe la rueda por su distancia al eje, r(θ), en cada dirección θ. Con el eje sobre la recta y = 0 y el punto de contacto justo debajo de él, el camino bajo el punto θ de la rueda está a la altura y = −r(θ), y rodar sin resbalar impone dx = r dθ. Para el lado de un polígono regular, a una distancia a del eje, r = a / cos θ, así que x = a arsinh(tan θ) e y = −a cosh(x / a): una catenaria invertida, exactamente tan larga como el lado.</p>
<p>Leon Hall y Stan Wagon estudiaron estas parejas de ruedas y caminos en «Roads and Wheels» (1992). El Exploratorium de San Francisco ha expuesto un par de ruedas cuadradas sobre un camino así; Stan Wagon construyó un triciclo de ruedas cuadradas en el Macalester College en 1997, y el National Museum of Mathematics de Nueva York tiene uno que rueda sobre catenarias.</p>
<p>La catenaria en sí es más antigua. Galileo pensaba que una cadena colgante formaba una parábola; Joachim Jungius demostró que no es así (en un trabajo publicado en 1669), y en 1691 Gottfried Leibniz, Christiaan Huygens y Johann Bernoulli encontraron su ecuación, respondiendo a un desafío de Jacob Bernoulli.</p>
<p>Las pruebas automáticas de la sala comprueban, frente a un cálculo independiente, que el camino del cuadrado es y = −a cosh(x / a), que camino y borde mantienen longitudes iguales, que las ruedas de 4 a 12 lados no chocan con sus caminos mientras que la esquina del triángulo se clava hasta un 3% de su radio en la siguiente joroba, y la profundidad de otros choques.</p></details>
<h3>Lo que la sala deja fuera</h3>
<p>El camino tiene que ajustarse exactamente al tamaño de la rueda, y estar alineado con ella: empieza con una rueda cuadrada en la ladera de una joroba en vez de en su cima, y el viaje sale mal. Un carrito de verdad también tiene ruedas a ambos lados, que deben ir acompasadas entre sí y con las jorobas. El carrito de aquí rueda a velocidad constante, sin resortes, sin tambaleos y sin rozamiento, y el chapoteo del agua en el camino plano está dibujado por diversión, no calculado.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Square_wheel" target="_blank" rel="noopener">Rueda cuadrada (Wikipedia, en inglés)</a><a class="source-link" href="https://mathworld.wolfram.com/Roulette.html" target="_blank" rel="noopener">Ruleta (MathWorld, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Catenaria (Wikipedia, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Curves/Catenary/" target="_blank" rel="noopener">Catenaria (MacTutor, en inglés)</a><a class="source-link" href="https://www.sciencenews.org/article/riding-square-wheels" target="_blank" rel="noopener">«Riding on square wheels» (Science News, 2004, en inglés)</a><a class="source-link" href="https://math.hmc.edu/funfacts/?p=172" target="_blank" rel="noopener">Una bicicleta de ruedas cuadradas (Math Fun Facts, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stan_Wagon" target="_blank" rel="noopener">Stan Wagon (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Museum_of_Mathematics" target="_blank" rel="noopener">National Museum of Mathematics (Wikipedia, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Bernoulli_Johann/" target="_blank" rel="noopener">Johann Bernoulli (MacTutor, en inglés)</a></div>`,
  },
});
