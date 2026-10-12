/* La ilusión del castigo · palabras para el visitante (es). */
Wonderlattice.defineText('regress', 'es', {
  eyebrow: 'ESTADÍSTICA',
  name: 'La ilusión del castigo',
  tagline: 'Regaña un mal tiro y el siguiente sale mejor, nueve veces de cada diez. El regaño no hizo nada.',
  title: 'La ilusión del castigo.',
  subtitle:
    'Un entrenador elogia los mejores tiros y regaña los peores. Mira qué sigue a cada palabra, y luego muestra el cableado.',
  field: 'Estadística · Regresión a la media · La intuición engañada',
  sceneLabel: 'Un lanzador · Un entrenador',
  sceneName: 'El recuento del entrenador',
  tip: 'Toca una cara para entrenar · Teclas: ↑ elogiar, ↓ regañar, → no decir nada',
  actionLabel: 'Mostrar el cableado',
  hideLabel: 'Ocultar el cableado',
  canvasLabel:
    'Una diana donde caen los dardos de un lanzador, un entrenador que elogia o regaña cada tiro, y un recuento de si el siguiente tiro fue mejor o peor tras cada palabra.',
  panelEyebrow: 'Entrenador',
  whyLabel: '¿Por qué parece que regañar funciona?',
  nudge: 'Apaga el entrenador automático y entrena a mano: elogia y regaña lo que quieras. Luego muestra el cableado.',
  connection: {
    html: '<strong>Intuición contra aritmética.</strong> En «El detector de tesoros imperfecto», un pitido significa menos de lo que parece. Aquí, las palabras de un entrenador parecen hacer más de lo que hacen.',
    label: 'Busca el tesoro',
  },

  presets: [
    { name: 'Entrenador automático', note: 'Elogia a los mejores, regaña a los peores.', badge: '20%' },
    { name: 'Entrenas tú', note: 'Cada palabra es tuya.', badge: '↑↓' },
    { name: 'El elogio sí ayuda', note: '¿Lo nota el recuento?', badge: '+' },
  ],

  auto: 'Entrenador automático: elogia los mejores tiros, regaña los peores',
  share: 'El entrenador reacciona a los mejores y a los peores',
  shareHint: 'Cuanto más extremos sean los tiros a los que reacciona, más fuerte es la ilusión.',
  helps: 'El elogio sí ayuda un poco (el siguiente tiro recibe un pequeño empujón)',
  words: { praise: 'Elogiar', scold: 'Regañar', nothing: 'No decir nada' },

  labels: {
    board: (n) => `Tiro ${n}`,
    points: (p) => `${p} ${p === 1 ? 'punto' : 'puntos'}`,
    praise: '¡Muy bien!',
    scold: '¡Muy mal!',
    nothing: '…',
    yourWord: '¿Qué dices?',
    afterPraise: 'Tras elogiar',
    afterScold: 'Tras regañar',
    better: 'luego mejor',
    worse: 'luego peor',
    times: (k, n) => `${k} de ${n}`,
    none: 'aún no',
    hidden: '¿A qué conectan elogios y regaños?',
    hiddenHint: 'Muestra el cableado',
    wired: 'Palabras unidas al siguiente tiro:',
    nothing2: 'nada',
    lift: 'elogio: un leve empujón',
    thisThrow: 'este tiro →',
    nextThrow: 'próximo tiro ↑',
    same: 'se repite',
    fitted: 'mejor ajuste',
  },

  status: {
    waiting: (n) => `Tiro ${n}: ¿qué dices?`,
    count: (n) => `${n} ${n === 1 ? 'tiro' : 'tiros'}`,
    done: (n) => `${n} tiros, terminado`,
  },
  announce: (pw, pn, sb, sn) =>
    `Tras elogiar, el siguiente tiro fue peor ${pw} veces de ${pn}; tras regañar, fue mejor ${sb} veces de ${sn}.`,

  guests: [
    {
      name: 'Francis Galton',
      note: 'Medí a padres y a sus hijos ya adultos: los hijos de padres muy altos eran altos, pero, en promedio, se alejaban del término medio solo dos tercios de lo que se alejaban sus padres.',
    },
    {
      name: 'Daniel Kahneman',
      note: 'Un instructor de vuelo me dijo que los elogios empeoraban a los cadetes y los gritos los mejoraban. Lo había visto, y era regresión a la media.',
    },
  ],

  insight: {
    title: '¿Por qué parece que regañar funciona?',
    html: `<p>Cada tiro es la habilidad del lanzador más la suerte. Un tiro excepcionalmente bueno suele ser un buen tiro con buena suerte encima, y la suerte no pasa al tiro siguiente. Así que lo más probable es que el siguiente tiro quede más cerca del promedio del lanzador, diga lo que diga el entrenador. Con el entrenador reaccionando a la mejor y a la peor quinta parte de los tiros, el tiro que sigue a uno elogiado es peor 9 veces de cada 10 en esta sala, y el que sigue a uno regañado es mejor 9 veces de cada 10. Las palabras del entrenador no llegan a nada en absoluto.</p>
<div class="insight-visual">un tiro magnífico = habilidad + buena suerte → siguiente tiro = habilidad + suerte corriente → «el elogio lo empeoró»</div>
<h3>El instructor de vuelo</h3>
<p>Daniel Kahneman cuenta que una vez enseñó a instructores de vuelo de la fuerza aérea israelí que el elogio funciona mejor que el castigo. Un instructor veterano objetó: cuando elogiaba a un cadete por una maniobra limpia, el siguiente intento solía ser peor, y cuando le gritaba a uno, el siguiente intento solía ser mejor. Kahneman vio enseguida que era regresión a la media: como elogiamos a la gente cuando lo ha hecho bien y la regañamos cuando lo ha hecho mal, estamos, en sus palabras, «estadísticamente castigados por recompensar a los demás y recompensados por castigarlos». Luego pidió a todos los presentes que lanzaran dos monedas hacia un blanco a sus espaldas, sin recibir ningún comentario: la mayoría de quienes mejor lo hicieron la primera vez lo hicieron peor la segunda, y al revés.</p>
<h3>La palabra de Galton</h3>
<p>Francis Galton encontró el mismo patrón en 1886 en las estaturas de padres e hijos adultos. Los hijos de padres muy altos eran altos, pero, en promedio, se alejaban del término medio solo unos dos tercios de lo que se alejaban sus padres; los hijos de padres muy bajos eran bajos, pero menos. Él lo llamó «regresión hacia la mediocridad». La gente no se va acercando toda al promedio: cada generación está tan dispersa como la anterior. Solo regresan quienes se eligen por ser extremos, porque parte de lo que los hacía extremos era suerte que no se hereda.</p>
<h3>Lo que esta sala simplifica</h3>
<p>Aquí la habilidad del lanzador nunca cambia y la suerte de cada tiro es nueva, así que las palabras de verdad no hacen nada. Los comentarios reales pueden importar. Activa «El elogio sí ayuda» y el recuento sigue diciendo que el elogio sale mal, unas 8 veces de cada 10: comparar un tiro con el siguiente no permite saberlo. Para saber qué hace el elogio, compara con los tiros tras los que el entrenador no dijo nada, o con un grupo al que no se elogió. El nueve de cada diez depende de estos ajustes: es 1 − p/2 cuando el entrenador reacciona a la proporción p de los mejores y de los peores tiros (95% con una décima parte, 75% con la mitad). La misma ilusión aparece cuando un deportista se hunde después de salir en la portada de una revista, o cuando los pacientes que entran en un estudio en su peor momento parecen mejorar con cualquier tratamiento.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Si las puntuaciones son habilidad más una suerte independiente, la puntuación siguiente esperada es el promedio más r veces la distancia de esta puntuación al promedio, donde r es la correlación entre una puntuación y la siguiente. Para un lanzador cuya habilidad nunca cambia, r = 0: la recta de mejor ajuste de «este tiro, próximo tiro» es plana, mientras que la línea discontinua «se repite» sube. Con una suerte de distribución normal y un umbral c por encima del cual está la proporción p de los mejores tiros, P(siguiente peor | este entre los mejores p) = 1 − p/2, y el cambio medio es −φ(c)/p, unas −1,40 desviaciones típicas para p = 20%. F. Galton, «Regression towards mediocrity in hereditary stature», Journal of the Anthropological Institute 15 (1886) 246–263. D. Kahneman, autobiografía para el Premio Nobel de 2002, y Pensar rápido, pensar despacio (2011), capítulo 17.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Regression_toward_the_mean" target="_blank" rel="noopener">Regresión a la media (Wikipedia, en inglés)</a><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/" target="_blank" rel="noopener">La autobiografía de Kahneman para el Nobel (en inglés)</a><a class="source-link" href="https://galton.org/essays/1880-1889/galton-1886-jaigi-regression-stature.pdf" target="_blank" rel="noopener">Galton, 1886 (PDF, en inglés)</a></div>`,
  },
});
