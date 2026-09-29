/* Mil muestras, diez pruebas · palabras para el visitante (es). */
Wonderlattice.defineText('pools', 'es', {
  eyebrow: 'PRUEBAS AGRUPADAS',
  name: 'Mil muestras, diez pruebas',
  tagline: 'Entre mil tubos, uno brilla. Diez pruebas, todas a la vez, dicen cuál.',
  title: 'Mil muestras, diez pruebas.',
  subtitle:
    'Un tubo brilla, y no sabes cuál. Mezcla gotas de grupos de tubos bien pensados, haz diez pruebas a la vez y lee la respuesta en las luces.',
  field: 'Números binarios · Muestras agrupadas · Un bit por prueba',
  sceneLabels: [(tubes, tests) => `${tubes} tubos · ${tests} pruebas`, 'Una multitud de 100 · pruebas agrupadas'],
  tips: [
    'Toca un tubo para esconder ahí el brillo, o un pocillo para ver qué tubos vierten en él · Las flechas izquierda y derecha eligen un pocillo',
    'Ajusta cuántos están infectados y el tamaño de los grupos · Las flechas izquierda y derecha cambian el tamaño del grupo',
  ],
  actionLabels: ['Esconder otro tubo', 'Una multitud nueva'],
  canvasLabel:
    'En el primer piso, una gradilla de tubos con una fila de pocillos de prueba debajo. Cada pocillo recibe una gota de un grupo de tubos; los pocillos encendidos se leen como un número binario, que nombra el tubo que brilla. En el segundo piso, una multitud de 100 personas repartida en grupos, con una prueba por grupo y una prueba más para cada persona de un grupo positivo, y un gráfico del número esperado de pruebas para cada tamaño de grupo.',
  panelEyebrow: 'Mezcla las muestras',
  whyLabel: '¿Cómo pueden bastar diez pruebas?',
  nudge:
    'Toca un tubo, y diez pruebas vuelven a encontrarlo. Después, elige dos tubos que brillan. En el segundo piso, sube la prevalencia por encima del 31% y mira cómo desaparece el ahorro.',

  connection: {
    html: '<strong>Respuestas de sí o no que escriben una dirección.</strong> Aquí, diez pruebas de sí o no escriben el número del tubo que brilla. En Un dibujo en medio de la tormenta, unos pocos bits de control escriben la dirección del bit que el ruido cambió.',
    label: 'Un dibujo en medio de la tormenta',
  },

  presets: [
    { name: 'Un tubo que brilla', note: 'Las luces escriben su número.', badge: '1' },
    { name: 'Dos tubos que brillan', note: 'Ahora las luces señalan el tubo equivocado.', badge: '2' },
    {
      name: '1 infectado de cada 100',
      note: 'Con grupos de diez se ahorran cuatro de cada cinco pruebas.',
      badge: '1%',
    },
  ],

  floorLabel: '¿Qué piso?',
  floors: ['Diez pruebas a la vez', 'Una prueba para muchos'],
  hotLabel: '¿Cuántos tubos brillan?',
  hot: ['Uno', 'Dos'],
  prevalence: 'Infectados',
  prevalenceHint: 'La parte de la multitud que lleva la infección, en secreto',
  pool: 'Tamaño del grupo',
  poolHint: 'Personas cuyas muestras comparten una prueba. 1 significa analizar a cada una por separado.',

  sceneNames: {
    hidden: 'Un tubo brilla. ¿Cuál?',
    hiddenTwo: 'Dos tubos brillan',
    found: (tube) => `Las luces dicen: tubo ${tube}`,
    crowd: (percent) => `100 personas, ${percent} infectadas`,
  },
  status: {
    mixing: (well, tests) => `Mezclando gotas · pocillo ${well} de ${tests}`,
    testing: (tests) => `Las ${tests} pruebas a la vez`,
    read: (tests) => `${tests} pruebas · listo`,
    pooling: (done, pools) => `Pruebas agrupadas · ${done} de ${pools}`,
    retesting: (done, retests) => `Repeticiones · ${done} de ${retests}`,
    used: (tests) => `${tests} pruebas usadas`,
  },

  // Palabras dibujadas en la imagen.
  labels: {
    yes: 'sí',
    no: 'no',
    sum: (parts, total) => `${parts} = ${total}`,
    none: 'Ningún pocillo encendido: ningún tubo brilla',
    here: (tube) => `tubo ${tube}`,
    wrong: (tube) => `¿Tubo ${tube}? No brilla`,
    missing: (tube, tubes) => `¿Tubo ${tube}? Solo hay ${tubes}`,
    well: (value) => `recoge todos los tubos con ${value} en su suma`,
    chartTitle: 'Pruebas esperadas para 100',
    axis: 'tamaño del grupo',
    oneByOne: 'una a una: 100',
    best: (k) => `mejor: ${k}`,
    never: 'aquí agrupar nunca ayuda',
    thisRun: 'esta multitud',
  },

  readout: {
    tests: (tests, tubes) =>
      `<strong>${tests}</strong> pruebas, hechas al mismo tiempo. Una a una harían falta ${tubes}.`,
    code: (tube, bits) => `El tubo ${tube} en binario: <code>${bits}</code>`,
    lights: (bits, value) => `Las luces: <code>${bits}</code> = ${value}`,
    two: 'Cada pocillo se enciende si recibe una gota de cualquiera de los dos tubos que brillan, así que las luces muestran los dos números fundidos: un 1 allí donde cualquiera de los dos tenga un 1. Encontrar dos tubos en una sola ronda exige más pruebas, y más ingeniosas.',
    well: (value, count) =>
      `Este pocillo recibe una gota de cada tubo cuyo número, escrito como suma de 1, 2, 4, 8, …, usa el ${value}: ${count} tubos.`,
    used: (tests) => `Pruebas usadas con esta multitud: <strong>${tests}</strong>`,
    expected: (tests) => `Lo esperado, en promedio: ${tests}. Una a una: 100.`,
    best: (k, tests) => `Mejor tamaño de grupo aquí: ${k}, unas ${tests} pruebas.`,
    never: 'Con esta prevalencia, ningún tamaño de grupo es mejor que analizar a cada persona por separado.',
  },

  announce: {
    found: (tube, tests) => `${tests} pruebas: las luces escriben ${tube}, el tubo que brilla.`,
    wrong: (a, b, pointed) => `Los tubos que brillan son el ${a} y el ${b}, pero las luces escriben ${pointed}.`,
    crowd: (tests, expected) => `${tests} pruebas para 100 personas; se esperaban ${expected}; una a una, 100.`,
  },

  guests: [
    {
      name: 'Robert Dorfman',
      note: 'En 1943 propuso agrupar muestras de sangre para buscar la sífilis entre los reclutas de la guerra: analizar el grupo y, solo si da positivo, volver a analizar a cada uno por separado.',
    },
    {
      name: 'Claude Shannon',
      note: 'Fundó las matemáticas de la información, que se cuenta en bits. Una respuesta de sí o no lleva como mucho uno, así que diez respuestas pueden distinguir como mucho 1024 posibilidades.',
    },
  ],

  insight: {
    title: '¿Cómo pueden bastar diez pruebas?',
    html: `<p>Escribe el número de cada tubo como una suma de 1, 2, 4, 8, … 512, usando cada uno como mucho una vez: el tubo 673 es 512 + 128 + 32 + 1. Ese es su número en <strong>binario</strong>. El pocillo marcado 512 recibe una gota de cada tubo cuya suma usa el 512; el pocillo marcado 1, de cada tubo cuya suma usa el 1 (uno de cada dos tubos), y así sucesivamente. Solo el tubo que brilla hace brillar un pocillo, así que los pocillos encendidos son exactamente las partes de su suma. Diez pocillos, encendidos o apagados, escriben cualquier número hasta 1023.</p>
<div class="insight-visual">Tubo 673 = 512 + 128 + 32 + 1 = 1010100001 en binario → se encienden los pocillos 512, 128, 32 y 1</div>
<p>Diez es también el mínimo posible. Cada respuesta de sí o no puede, como mucho, partir las posibilidades por la mitad, y hay 1001: cualquiera de los 1000 tubos, o ninguno. Nueve respuestas solo distinguen 512. (En un teléfono la gradilla tiene 63 tubos y necesita seis pruebas, por la misma razón.) Es el viejo acertijo de las mil botellas y los diez catadores.</p>
<h3>Dos tubos que brillan</h3>
<p>Un pocillo se enciende si recibe una gota de <em>cualquiera</em> de los dos tubos que brillan, así que las luces muestran los dos números fundidos, y escriben un tercer tubo. Para encontrar hasta <em>d</em> positivos en una sola ronda, hay que elegir los grupos de modo que los pocillos de ningún tubo queden cubiertos por los pocillos de otros <em>d</em>. Eso exige del orden de <em>d</em>² log <em>n</em> / log <em>d</em> pruebas, mientras que hacer las pruebas por rondas, eligiendo cada una después de ver la anterior, exige solo unas <em>d</em> log(<em>n</em>/<em>d</em>). Hacerlo todo a la vez tiene un precio.</p>
<h3>Una prueba para muchos</h3>
<p>En 1943 Robert Dorfman propuso un plan más sencillo para los análisis masivos: juntar las muestras de <em>k</em> personas, analizar el grupo y volver a analizar a cada persona solo si da positivo. Si una parte <em>p</em> de las personas está infectada, el número esperado de pruebas por persona es 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. Con un 1%, el mejor grupo tiene 11 personas y cuesta 0,196 pruebas por persona, un ahorro de alrededor del 80%. Con un 5%, el mejor grupo es de 5 (0,43 pruebas por persona); con un 10%, de 4 (0,59). El mejor tamaño es aproximadamente 1/√<em>p</em>. En la multitud de esta sala, de exactamente 100 personas, los grupos de 10 salen igual que los de 11 (19,6 pruebas), porque reparten la multitud a partes iguales. Las pruebas que usa una multitud concreta oscilan alrededor del valor esperado: cuenta con el promedio, no con una racha de suerte.</p>
<h3>El precipicio</h3>
<p>A medida que las infecciones se vuelven más comunes, más grupos dan positivo y necesitan repeticiones, y el mejor grupo se encoge. Por encima de 1 − 3<sup>−1/3</sup> ≈ 30,7%, ningún tamaño de grupo es mejor que analizar a cada persona por separado. Peter Ungar demostró en 1960 que por encima de (3 − √5)/2 ≈ 38%, <em>ninguna</em> estrategia, por ingeniosa que sea, es mejor. En el otro extremo, la teoría de la información pone un suelo: unas 100·H(<em>p</em>) pruebas para 100 personas, donde H es la entropía binaria, alrededor de 8 con un 1%.</p>
<h3>Lo que esto deja fuera</h3>
<p>Aquí cada prueba es perfecta. Las pruebas reales a veces fallan o dan falsas alarmas, y agrupar diluye cada muestra: Mutesa y sus colaboradores, en Ruanda, comprobaron que una muestra positiva se seguía detectando diluida 100 veces con muestras negativas. El truco de un solo tubo que brilla es frágil, y los laboratorios no lo usan tal cual. Sus descendientes prácticos son los grupos de Dorfman y diseños como el de Ruanda, que coloca las muestras en una rejilla en forma de cubo, de tres puntos por lado, y agrupa cada capa: la misma idea que los pocillos binarios, contada de tres en tres. El modelo también trata las infecciones como independientes, mientras que las reales se concentran por hogares, lo que de hecho puede favorecer a los grupos. Dorfman hizo su propuesta para los exámenes en tiempos de guerra; esta sala no afirma hasta qué punto se usó entonces.</p>
<details><summary>Las matemáticas, si las quieres</summary><p>Diseño binario: con los tubos 1, …, <em>n</em>, la prueba <em>k</em> (contando desde 0) contiene cada tubo cuya <em>k</em>-ésima cifra binaria es 1; con exactamente un positivo, los resultados son sus cifras binarias, y ⌈log₂(<em>n</em> + 1)⌉ pruebas bastan y son necesarias. Dorfman: un grupo de <em>k</em> cuesta una prueba, más otras <em>k</em> con probabilidad 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. Agrupar ayuda cuando 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup> &lt; 1, es decir, (1 − <em>p</em>)<sup><em>k</em></sup> &gt; 1/<em>k</em>; el mayor <em>p</em> para el que algún <em>k</em> funciona se da en <em>k</em> = 3, donde (1 − <em>p</em>)³ = 1/3. La multitud de la sala cuenta exactamente su grupo sobrante: con grupos de 11, nueve grupos de 11 y una persona analizada sola. R. Dorfman, «The detection of defective members of large populations», Ann. Math. Statist. 14 (1943) 436–440. P. Ungar, «The cutoff point for group testing», Comm. Pure Appl. Math. 13 (1960). L. Mutesa et al., «A pooled testing strategy for identifying SARS-CoV-2 at low prevalence», Nature 589 (2021).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Group_testing" target="_blank" rel="noopener">Las pruebas agrupadas (en inglés)</a><a class="source-link" href="https://doi.org/10.1214/aoms/1177731363" target="_blank" rel="noopener">Dorfman (1943) (en inglés)</a><a class="source-link" href="https://www.nature.com/articles/s41586-020-2885-5" target="_blank" rel="noopener">Mutesa et al., Nature (2021) (en inglés)</a><a class="source-link" href="https://arxiv.org/abs/1902.06002" target="_blank" rel="noopener">Aldridge, Johnson y Scarlett (2019) (en inglés)</a><a class="source-link" href="https://arxiv.org/abs/2105.08845" target="_blank" rel="noopener">Aldridge y Ellis, las pruebas agrupadas en la pandemia (en inglés)</a></div>`,
  },
});
