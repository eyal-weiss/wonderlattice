Wonderlattice.defineText('storm', 'es', {
  eyebrow: 'CORRECCIÓN DE ERRORES',
  name: 'Un dibujo en medio de la tormenta',
  tagline: 'Unos pocos bits extra, bien pensados, permiten que un dibujo se repare solo.',
  title: 'Un dibujo en medio de la tormenta.',
  subtitle: 'Haz un dibujito. Envíalo a través de la tormenta. Ayúdalo a llegar entero.',
  field: 'Códigos · Información · Un poco de redundancia',
  sceneLabel: 'Canal con ruido',
  actionLabel: 'Enviar de nuevo',
  canvasLabel:
    'Tu dibujo, a la izquierda, viaja en bits a través de una tormenta que cambia algunos de ellos, y llega a la derecha. Haz clic o arrastra sobre tu dibujo para pintar. Con el teclado, muévete con las flechas y presiona Enter para pintar.',
  panelEyebrow: 'Protégelo',
  whyLabel: '¿Cómo pueden los bits arreglarse solos?',
  nudge:
    'Cuenta los daños sin protección. Luego prueba el truco de Hamming en la misma tormenta. ¿Hasta qué fuerza de tormenta aguanta?',
  connection: {
    html: '<strong>Señales que viajan.</strong> Aquí un mensaje sobrevive a un viaje con ruido. En «Escucha la forma», dos tonos viajan juntos y dibujan una forma que se puede oír.',
    label: 'Visita «Escucha la forma»',
  },
  yours: 'Tu dibujo',
  storm: 'La tormenta',
  arrived: 'Lo que llegó',
  codes: ['Sin protección', 'Repetirlo tres veces', 'Un bit de paridad', 'El truco de Hamming'],
  codeLabel: 'Cómo protegerlo',
  codeHints: [
    'Cada bit viaja solo.',
    'Tres copias de cada bit y luego una votación.',
    'Un bit de control por cada cuatro detecta un cambio.',
    'Tres bits de control por cada cuatro corrigen un cambio.',
  ],
  stormLabel: 'Fuerza de la tormenta',
  stormHint: 'La probabilidad de que cualquier bit cambie.',
  pictureLabel: 'Elige un dibujo o pinta sobre el tuyo',
  pictures: {
    heart: 'Corazón',
    smile: 'Sonrisa',
    invader: 'Marciano',
    blank: 'Borrar',
  },
  tip: 'Naranja: cambiado · ○ reparado · ✕ sigue incorrecto',
  tipParity: 'Naranja: cambiado · discontinuo: se sabe dañado · ✕ incorrecto',
  sent: 'Bits enviados',
  sentValue: (bits, extra) => `${bits} (+${extra}% extra)`,
  badge: (extra) => `+${extra}%`,
  badgeNote: 'bits extra',
  flipped: 'Cambiados por la tormenta',
  repaired: 'Reparados al llegar',
  knownBad: 'Bloques con daño detectado',
  wrong: 'Píxeles aún incorrectos',
  status: (wrong, flips) =>
    !flips
      ? 'Cielo en calma'
      : !wrong
        ? 'Llegaron todos los píxeles'
        : wrong === 1
          ? '1 píxel incorrecto'
          : `${wrong} píxeles incorrectos`,
  curveTitle: 'Píxeles incorrectos en promedio, a medida que crece la tormenta',
  about: (wrong) => `≈ ${wrong}`,
  curveLabel: (code, wrong) =>
    `${code}: aproximadamente ${wrong} ${wrong === 1 ? 'píxel incorrecto' : 'píxeles incorrectos'} en promedio con esta fuerza de tormenta.`,
  calm: 'calma',
  wild: '20%',
  presets: [
    {
      name: 'Sin protección',
      note: 'Cada cambio hace daño.',
    },
    {
      name: 'Repetirlo tres veces',
      note: 'Seguro, pero con el triple de bits.',
    },
    {
      name: 'El truco de Hamming',
      note: 'Casi igual de seguro, con muchos menos bits.',
    },
  ],
  guests: [
    {
      name: 'Richard Hamming',
      note: 'Un fin de semana tras otro, los errores detenían su máquina. Si puede detectar un error, se preguntó, ¿por qué no corregirlo?',
    },
  ],
  insight: {
    title: '¿Cómo puede un mensaje arreglarse solo?',
    html: `<p>Tu dibujo tiene 64 píxeles, es decir, 64 bits de tinta o sin tinta. La tormenta cambia cada bit con una probabilidad pequeña. Sin protección, cada bit cambiado es un píxel incorrecto, y quien lo recibe ni siquiera sabe cuáles son.</p>
<div class="insight-visual">Unos pocos bits extra, bien elegidos, permiten al receptor encontrar y corregir errores que nunca vio ocurrir.</div>
<h3>Repetirlo tres veces</h3>
<p>Envía cada bit tres veces y deja que el receptor haga una votación. Un cambio en un trío pierde dos votos contra uno. Funciona, pero triplica el mensaje: 8 bits extra por cada 4.</p>
<h3>Un bit de paridad</h3>
<p>Añade un bit a cada bloque de cuatro para que la cantidad de unos sea siempre par. Si cambia un solo bit, la cuenta se vuelve impar y el receptor sabe que el bloque está dañado. No puede saber qué bit corregir, y dos cambios se anulan entre sí y se esconden.</p>
<h3>El truco de Hamming</h3>
<p>Numera del 1 al 7 los siete bits de un bloque. Los bits en las posiciones 1, 2 y 4 son de control. Cada control mantiene par la cuenta en las posiciones cuyo número, escrito en binario, lo contiene: el control 1 vigila 1, 3, 5, 7; el control 2 vigila 2, 3, 6, 7; el control 4 vigila 4, 5, 6, 7. Cuando cambia un bit, los controles que fallan suman su posición. Si fallan los controles 1 y 4, es la posición 5, y si no falla ninguno, el bloque parece limpio. Así, mientras cambie como mucho un bit por bloque, 3 bits extra por cada 4 lo reparan.</p>
<h3>Costo y protección</h3>
<p>En una tormenta del 4%, un dibujo sin protección tiene en promedio unos 2.6 píxeles incorrectos; con tres copias, unos 0.3; y con el truco de Hamming, unos 0.8, con menos de la mitad de bits extra. La pequeña curva del panel lo muestra para cada fuerza de tormenta.</p>
<h3>Dónde falla</h3>
<p>Estos códigos suponen que cada bit cambia por su cuenta. Las tres copias y el truco de Hamming prometen corregir un cambio por bloque; un bit de paridad solo avisa, y sin protección no hay ni lo uno ni lo otro. Dos cambios en un mismo bloque de Hamming mandan al receptor a la posición equivocada, y su «reparación» empeora las cosas. Cerca de una tormenta del 20%, el truco de Hamming apenas ayuda; un poco más allá, perjudica. Las tormentas reales llegan en ráfagas, así que los sistemas reales usan códigos más largos y separan los bits de cada bloque.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Para los bits de datos d1 d2 d3 d4 en las posiciones 3, 5, 6, 7, los controles son c1 = d1 ⊕ d2 ⊕ d4, c2 = d1 ⊕ d3 ⊕ d4, c4 = d2 ⊕ d3 ⊕ d4, donde ⊕ suma bits sin llevar. El receptor combina con XOR las posiciones que tienen un 1; el resultado, llamado síndrome, es 0 para un bloque limpio y la posición cambiada cuando cambió exactamente un bit. Tres cambios pueden anularse hasta dar 0 y pasar inadvertidos.</p><p>Si cada bit cambia con probabilidad p, un píxel enviado solo sale incorrecto con probabilidad p, y uno enviado tres veces, con probabilidad 3p² − 2p³. Las curvas suman exactamente todos los patrones de cambios posibles.</p></details>
<div class="sources"><a class="source-link" href="https://archive.org/details/bstj29-2-147" target="_blank" rel="noopener">El artículo de Hamming de 1950 (en inglés)</a><a class="source-link" href="https://www.inference.org.uk/mackay/itila/" target="_blank" rel="noopener">MacKay, capítulo 1: enviar imágenes a través del ruido (en inglés)</a></div>`,
  },
});
