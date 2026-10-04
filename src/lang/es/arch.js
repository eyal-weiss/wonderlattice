/* Cuélgala, inviértela, constrúyela · palabras para el visitante (es). */
Wonderlattice.defineText('arch', 'es', {
  eyebrow: 'CADENAS Y ARCOS',
  name: 'Cuélgala, inviértela, constrúyela',
  tagline:
    'Una cadena colgante, puesta del revés, es un arco de piedras sueltas que se sostiene. Un semicírculo con las mismas piedras se cae.',
  title: 'Cuélgala, inviértela, constrúyela.',
  subtitle:
    'Una cadena cuelga entre dos clavijas. Puesta del revés, la misma forma se sostiene como un arco de piedras sueltas; a su lado, un semicírculo con las mismas piedras se cae. Cuelga torres de la cadena, o dibuja tu propio arco.',
  field: 'Ingeniería · La catenaria · Líneas de fuerza',
  sceneLabel: 'Una cadena y un arco · Piedras sueltas, sin mortero',
  sceneName: 'Tu propio experimento',
  tip: 'Arrastra una clavija · Toca la cadena o una piedra para añadir una torre · Arrastra los puntos de un arco, o dibuja un arco nuevo · Teclas: ← → eligen, ↑ ↓ cambian, F da la vuelta',
  actionLabel: 'Dar la vuelta',
  canvasLabel:
    'Dos imágenes una junto a otra, a la misma escala. A la izquierda, una cadena cuelga entre dos clavijas y se balancea hasta quedarse quieta; luego se da la vuelta y se convierte en un arco de piedras sin mortero, que se sostiene. Una línea dorada, la línea de fuerza, pasa por dentro de cada piedra. Las torres colgadas de la cadena se sostienen sobre el arco una vez invertido. A la derecha, un arco de las mismas piedras con otra forma, al principio un semicírculo, se construye sobre un armazón de madera. Cuando el armazón baja, su línea de fuerza se sale de las piedras, se abren cuatro juntas, y el arco se pliega y se cae. Un arco propio tiene nueve puntos que se pueden arrastrar hacia dentro o hacia fuera.',
  panelEyebrow: 'Da forma a la cadena',
  whyLabel: '¿Por qué se sostiene?',
  nudge:
    'Toca tres veces una piedra a media altura de un lado del arco en pie, para ponerle una torre de tres pisos: se cae. Vuelve a darle la vuelta, y la cadena se dobla para cargar con la torre. Dale la vuelta otra vez.',
  connection: {
    html: '<strong>Piedras sin pegamento.</strong> Aquí cada piedra se mantiene en su sitio gracias al empuje de sus vecinas. En «La torre inclinada de bloques», cada bloque se equilibra sobre el de abajo.',
    label: 'Ver la torre inclinada',
  },

  presets: [
    { name: 'Cuélgala, inviértela', note: 'La forma de la cadena se sostiene; un semicírculo se cae.' },
    { name: 'Una torre en un lado', note: 'La cadena se dobla bajo ella, y así el arco puede cargarla.' },
    { name: 'Una carretera que sostener', note: 'Bajo una carretera pesada, la cadena se vuelve una parábola.' },
  ],

  // Longitudes: las clavijas empiezan a 1 m de distancia.
  cm: ' cm',
  length: 'Longitud de la cadena',
  lengthHint: 'Una cadena más larga cuelga más hondo, y al invertirla da un arco más alto.',
  thick: 'Grosor de las piedras',
  thickHint: 'Para los dos arcos. Con piedras bastante gruesas, hasta un semicírculo se sostiene.',
  road: 'Colgar una carretera de la cadena',
  beside: 'El arco de al lado',
  shapes: { semicircle: 'Semicírculo', pointed: 'Apuntado', flat: 'Rebajado', own: 'El tuyo' },
  ownHint: 'Arrastra sus puntos hacia dentro o hacia fuera, o dibuja un arco nuevo de un pie al otro.',

  // Los números llegan ya escritos en el idioma de la página.
  percent: (x) => `${x}%`,
  length_cm: (x) => `${x} cm`,
  readout: {
    hanging: 'Colgada, la cadena está tirante de punta a punta: pura tracción.',
    stands: 'Invertida, la misma forma se sostiene: puro empuje.',
    falls: 'Invertida, con estas cargas, se cae.',
    inside: (share) => `Su línea de fuerza queda dentro de las piedras, con un margen del ${share} de su grosor.`,
    outside: (share) => `No cabe ninguna línea de fuerza: la mejor se sale de las piedras un ${share} de su grosor.`,
    // name es uno de los cuatro nombres de labels (todos masculinos y en singular), stands es true o false.
    beside: (name, stands) => `${name} con las mismas piedras ${stands ? 'se sostiene' : 'se cae'}.`,
    thinnest: (cm) => `Se sostiene con piedras desde ${cm} de grosor.`,
    thickest: (cm) => `Se sostendría con piedras de al menos ${cm} de grosor.`,
    never: (cm) => `Ni siquiera piedras de ${cm} de grosor lo sostendrían.`,
    any: 'Se sostiene con piedras de cualquier grosor.',
    working: 'Calculando qué grosor necesitan sus piedras…',
  },
  status: {
    hanging: 'La cadena cuelga',
    stands: 'Invertida, se sostiene',
    falls: 'Invertida, se cae',
    beside: (name, stands) => `${name}: ${stands ? 'se sostiene' : 'se cae'}`,
  },

  // Palabras dibujadas en la imagen.
  labels: {
    chain: 'Cadena colgante',
    arch: 'La cadena, invertida',
    stands: 'Se sostiene',
    falls: 'Se cae',
    building: 'Sobre su armazón',
    semicircle: 'Un semicírculo',
    pointed: 'Un arco apuntado',
    flat: 'Un arco rebajado',
    own: 'Tu propio arco',
    force: 'Línea de fuerza',
    parabola: 'Parábola',
    catenary: 'Catenaria',
    drawing: 'Dibuja de un pie al otro',
    gallery: 'Las mismas piedras en otras formas · Toca una para probarla',
    thinnest: (cm) => `Grosor mínimo: ${cm}`,
    never: (cm) => `Ni con piedras de ${cm}`,
    any: 'Con cualquier grosor',
    chartTitle: 'Grosor mínimo de las piedras',
    chainShape: 'La forma de la cadena',
    yours: (cm) => `Tus piedras: ${cm}`,
  },

  announce: {
    stands: 'La cadena, invertida, se sostiene como un arco.',
    falls: 'Con estas cargas, el arco se cae.',
    hanging: 'La cadena cuelga de sus clavijas.',
    beside: (name, stands) => `${name} con las mismas piedras ${stands ? 'se sostiene' : 'se cae'}.`,
    towers: (stone, storeys) =>
      storeys === 0
        ? `Piedra ${stone}: sin torre.`
        : `Piedra ${stone}: una torre de ${storeys} ${storeys === 1 ? 'piso' : 'pisos'}.`,
    peg: (side) =>
      side === 0
        ? 'La clavija izquierda: las flechas arriba y abajo la mueven, y A y D la desplazan a los lados.'
        : 'La clavija derecha: las flechas arriba y abajo la mueven, y A y D la desplazan a los lados.',
    dot: (n) => `Punto ${n} de 9 del arco de al lado: las flechas arriba y abajo lo mueven hacia fuera y hacia dentro.`,
  },

  guests: [
    {
      name: 'Robert Hooke',
      note: 'En 1675 escondió su regla para los arcos en un revoltijo de letras latinas. Descifrado tras su muerte, dice que una cadena colgante, invertida, da la forma de un arco que se sostiene.',
    },
    {
      name: 'Galileo Galilei',
      note: 'En 1638 escribió que una cadena colgante se acerca a una parábola, y tanto más cuanto menos se comba. Se acerca, pero es una curva distinta.',
    },
    {
      name: 'Antoni Gaudí',
      note: 'Para la cripta de una iglesia en la Colonia Güell, colgó cuerdas cargadas con saquitos de perdigones de plomo, las fotografió y puso las fotografías del revés para dibujar las bóvedas.',
    },
  ],

  insight: {
    title: '¿Por qué se sostiene la forma de la cadena?',
    html: `<p>Una cadena colgante solo puede tirar: cada eslabón tira del siguiente, a lo largo de la cadena. Su forma es aquella en la que esas fuerzas equilibran el peso de cada eslabón. Pon la imagen del revés y cada fuerza se da la vuelta con ella: lo que tiraba pasa a empujar, a lo largo de la misma línea, y equilibra los mismos pesos. Eso es un arco cuyas piedras solo se aprietan unas contra otras, sin nada que intente doblarlas y separarlas.</p>
<p>Robert Hooke lo vio en la década de 1670, y en 1675 lo publicó como un acertijo, un revoltijo de letras latinas. Tras su muerte se leyó como <em>ut pendet continuum flexile, sic stabit contiguum rigidum inversum</em>: como cuelga la línea flexible, así, invertidas, se sostienen las piezas en contacto de un arco.</p>
<div class="insight-visual">cadena colgante: pura tracción · la misma forma del revés: pura compresión</div>
<h3>La línea de fuerza</h3>
<p>Todo arco tiene que llevar su peso, piedra a piedra, hasta sus pies. El empuje de una piedra a la siguiente se puede dibujar como una línea, la línea de fuerza (los ingenieros la llaman línea de empujes). Tiene la forma en que colgaría una cadena bajo los mismos pesos, puesta del revés. Si una línea así se puede dibujar dentro de las piedras en cada junta, el arco puede sostenerse: es el teorema de la seguridad de Jacques Heyman (1966), para piedras que no pueden tirar, no se pueden aplastar y no resbalan. Donde la línea toca el borde de una junta, la junta puede abrirse como una bisagra; con suficientes bisagras, el arco se mueve, y se cae. La línea dorada es la que se mantiene más hacia dentro.</p>
<p>En la forma de la propia cadena, la línea pasa por el centro de cada piedra, y por eso se sostiene por finas que sean las piedras. Un semicírculo se abomba hacia fuera en cada lado más que la forma colgante, así que su línea de fuerza, que sigue una forma colgante, pasa por el borde de arriba de las piedras en la clave y, más abajo en cada lado, corta su borde interior. Con piedras finas no hay sitio para ella. Entonces cuatro juntas se abren como bisagras, y las tres piezas que quedan entre ellas se pliegan y caen. Un semicírculo solo se sostiene si el grosor de sus piedras es, como mínimo, de alrededor de una décima parte de su radio; Milutin Milankovitch calculó la cifra exacta en 1907: un 10,75% para un arco continuo. El arco de 21 piedras de la sala necesita un 10,67%: piedras de 5,3 cm de grosor, para un arco de 1 m de ancho.</p>
<h3>Cambia las cargas, cambia la forma</h3>
<p>Una torre en un lado dobla la cadena colgante, y la cadena invertida carga con la torre. Pero pon la misma torre sobre un arco hecho sin ella, y la línea de fuerza se desplaza: una torre bastante alta derriba ese arco. El viento, las multitudes y el tráfico también cambian las cargas, y esa es una de las razones por las que los arcos de verdad son más gruesos de lo que exigiría solo su propio peso.</p>
<p>Una carretera pesada colgada de una cadena ligera tira de ella hacia abajo de manera uniforme en horizontal, no a lo largo de la cadena, y la cadena se convierte en una parábola: la forma del cable de un puente colgante. Invertida, es un puente cuyo arco sostiene su carretera. En una cadena poco combada, la parábola y la catenaria son difíciles de distinguir; marca la casilla de la carretera para ver las dos. El Gateway Arch de San Luis es una catenaria ponderada: sus patas son más gruesas en la base, así que la curva es la forma en que cuelga una cadena con eslabones más pesados en los extremos.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Una cadena con el mismo peso en toda su longitud cuelga formando una catenaria, y = a cosh(x / a), donde a es la tensión horizontal dividida por el peso por unidad de longitud. Jacob Bernoulli planteó el problema como desafío, y en junio de 1691 las respuestas de Gottfried Leibniz, Christiaan Huygens y Johann Bernoulli se publicaron juntas en la revista Acta Eruditorum. Antes, en 1638, Galileo había escrito que una cadena colgante se acerca a una parábola; Joachim Jungius demostró que no lo es, en un trabajo publicado en 1669. Una carga repartida de manera uniforme en horizontal da, en cambio, y = kx², una parábola.</p>
<p>La cadena de la sala son 41 cuentas unidas por 42 eslabones. Su forma en reposo se resuelve de manera exacta, con el método de Newton aplicado a las fuerzas en una de las clavijas, y la cadena en movimiento (pasos de Verlet, con cada eslabón devuelto a su longitud) se asienta sobre ella. Cada piedra del arco invertido mide dos eslabones, con su propio peso en su centro de masas. Una línea de fuerza queda fijada por tres números, el empuje horizontal y dónde y con qué inclinación sale de la primera junta; la sala busca la que se mantiene más hacia dentro de las piedras. Cuando no cabe ninguna, prueba todas las maneras de elegir cuatro juntas y esquinas como bisagras, se queda con aquellas en las que cada bisagra se abre y los pesos bajan, y deja que la caída más rápida se desarrolle como un mecanismo de tres piezas, hasta que una piedra llega al suelo.</p>
<p>Las pruebas automáticas de la sala comprueban, frente a un cálculo independiente, que la cadena en reposo se aparta de una catenaria menos de un 0,02% de la distancia entre las clavijas, que el arco de la cadena se sostiene con piedras de 1 cm de grosor, y que el semicírculo necesita 5,3 cm y el arco apuntado 3,5 cm. También comprueban que las dos maneras que tiene la sala de preguntarlo, si cabe una línea de fuerza y si cuatro bisagras pueden caer, coinciden siempre.</p></details>
<h3>Lo que la sala deja fuera</h3>
<p>Las piedras son perfectamente rígidas y nunca resbalan, el suelo y las clavijas nunca se mueven, y el arco no tiene relleno encima. A las piedras de verdad las sujeta el rozamiento, el mortero de verdad puede tirar un poco, y los pies de verdad pueden separarse, lo que derriba arcos que de otro modo se sostendrían. La caída es una caricatura de un derrumbe real: sigue el primer movimiento de las piedras, y se detiene cuando una toca el suelo.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Catenaria (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary_arch" target="_blank" rel="noopener">Arco catenario (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Line_of_thrust" target="_blank" rel="noopener">Línea de empujes (Wikipedia, en inglés)</a><a class="source-link" href="https://www.gf.uns.ac.rs/~zbornik/doc/NS2016.018.pdf" target="_blank" rel="noopener">Nikolić, la teoría de Milankovitch de la línea de empujes (2016) (en inglés)</a><a class="source-link" href="https://talks.cam.ac.uk/talk/index/47582/" target="_blank" rel="noopener">Makris, el grosor mínimo de los arcos semicirculares (2013) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Col%C3%B2nia_G%C3%BCell" target="_blank" rel="noopener">Colonia Güell (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gateway_Arch" target="_blank" rel="noopener">Gateway Arch (Wikipedia, en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Hooke/" target="_blank" rel="noopener">Robert Hooke (MacTutor, en inglés)</a></div>`,
  },
});
