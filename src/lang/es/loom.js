Wonderlattice.defineText('loom', 'es', {
  eyebrow: 'TEJIDO',
  name: 'El telar matemático',
  tagline: 'Cambia una casilla en una cuadrícula diminuta de síes y noes, y toda la tela cambia.',
  title: 'El telar matemático.',
  subtitle: 'Elige qué hilos se levantan. Mira crecer una tela a partir de una cuadrícula de síes y noes.',
  field: 'Tejido · Patrones binarios · Repetición',
  sceneLabel: 'Un telar de cuatro lizos',
  sceneName: 'Tela a partir de un diseño',
  tip: 'Izquierda: el diseño · Derecha: su tela · Haz clic en el amarre para cambiarlo, o usa sus casillas en el panel',
  tipStacked: 'Arriba: el diseño · Abajo: su tela · Haz clic en el amarre, o usa sus casillas en el panel',
  actionLabel: 'Sorpréndeme',
  canvasLabel:
    'Un diseño de tejido junto a la tela que produce. Cambia el amarre haciendo clic aquí o con sus casillas en el panel.',
  panelEyebrow: 'Prepara el telar',
  whyLabel: '¿Cómo hace tela una cuadrícula?',
  nudge: 'Empieza con «Sarga» y cambia una casilla del amarre. Todas las filas tejidas con ese pedal cambian a la vez.',
  connection: {
    html: '<strong>Una regla pequeña, repetida en todas partes.</strong> El amarre decide cada cruce de la tela. En «Una mente de muchos», reglas pequeñas entre vecinos dan forma a toda una multitud.',
    label: 'Visita «Una mente de muchos»',
  },
  presets: [
    {
      name: 'Tafetán',
      note: 'Uno por encima, uno por debajo.',
    },
    {
      name: 'Sarga',
      note: 'Una diagonal, como la del denim.',
    },
    {
      name: 'Pata de gallo',
      note: 'Sarga con cuatro hilos oscuros y cuatro claros.',
    },
    {
      name: 'Rayas, no cuadros',
      note: 'Alterna los colores en los dos sentidos.',
    },
    {
      name: 'Ojo de perdiz',
      note: 'En punta en los dos sentidos: rombos diminutos.',
    },
    {
      name: 'Espiga',
      note: 'Haz que la sarga vuelva sobre sí misma.',
    },
  ],
  tieup: 'Qué hilos levanta cada pedal (el amarre)',
  tieupHint:
    'Cada lizo es un marco que sostiene algunos de los hilos a lo largo. Una casilla encendida significa que ese pedal levanta ese lizo.',
  tieupCell: (pedal, shaft) => `El pedal ${pedal} levanta el lizo ${shaft}`,
  treadleLabel: (n) => `Pedal ${n}`,
  shaftLabel: (n) => `Lizo ${n}`,
  threading: 'Orden de los hilos',
  treadling: 'Orden de los pedales',
  orders: ['Recto', 'En punta', 'Quebrado', 'Doble'],
  warpColours: 'Hilos largos',
  weftColours: 'Hilos cruzados',
  colourOrders: ['Todo oscuro', '4 y 4', 'Alternados', '2 y 2', 'Todo claro'],
  palette: 'Hilo',
  palettes: ['Índigo y crema', 'Rubia y oro', 'Bosque y lino', 'Noche y plata'],
  repeat: (across, down) =>
    across === 1 && down === 1 ? 'Un solo color en toda la tela' : `Se repite cada ${across} × ${down} hilos`,
  float: (n) =>
    n === Infinity
      ? 'Aquí hay un hilo que nunca se entrelaza. Esta tela se desharía.'
      : n === 1
        ? 'Cada hilo pasa por encima de uno y por debajo de uno: una tela firme.'
        : n <= 3
          ? `Los hilos flotan sobre hasta ${n} más: una tela más suave, con más caída.`
          : `Bastas de ${n} hilos: largas y sueltas, fáciles de enganchar.`,
  labels: {
    draft: 'DISEÑO',
    cloth: 'TELA',
  },
  guests: [
    {
      name: 'Ada Lovelace',
      note: 'Describió cómo la máquina de Babbage, guiada por tarjetas perforadas como un telar de Jacquard, podría tejer patrones algebraicos.',
    },
  ],
  insight: {
    title: 'Una cuadrícula que teje.',
    html: `<p>Cada tela de aquí sale de tres listas cortas. El <em>remetido</em> dice por cuál de los cuatro lizos pasa cada hilo a lo largo (la urdimbre). El <em>amarre</em> dice qué lizos levanta cada pedal. El <em>pisado</em> dice qué pedal se pisa en cada pasada a lo ancho (la trama). Allí donde un hilo de urdimbre levantado cruza la trama, la urdimbre queda por encima.</p>
<div class="insight-visual">tela = pisado × amarre × remetido, un producto de cuadrículas de 0 y 1</div>
<h3>Un cambio pequeño, toda la tela</h3>
<p>Cambia una casilla del amarre y todas las pasadas tejidas con ese pedal cambian a la vez. Así diseñan los tejedores sobre el papel: la cuadrícula de la izquierda de la imagen es un diseño de tejido real.</p>
<h3>El color es un segundo patrón</h3>
<p>Colorea también los hilos, y el ligamento y el orden de los colores se combinan. Una sarga 2/2 con cuatro hilos oscuros y cuatro claros en cada sentido da pata de gallo. Un tafetán con colores alternados da rayas, y no los cuadros que uno esperaría.</p>
<h3>Las bastas sostienen la tela</h3>
<p>Un hilo que pasa por encima de varios sin entrelazarse forma una basta. Las bastas cortas dan una tela firme; las largas la hacen suave y fácil de enganchar. Un hilo que nunca se entrelaza no forma tela en absoluto.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Escribe el remetido como una cuadrícula H (el hilo de urdimbre j está en el lizo s), el amarre como U (el pedal t levanta el lizo s) y el pisado como T (la pasada i usa el pedal t). La tela es D = T · U · Hᵀ, con aritmética booleana, donde 1 + 1 = 1. Como las tres listas se repiten, la tela también: su repetición divide al mínimo común múltiplo de las longitudes de las listas y de los órdenes de colores.</p><p>Este telar tiene cuatro lizos y cuatro pedales, como muchos telares de mesa y de pie. La tela real también depende del hilo, la separación y la tensión, que esta imagen deja fuera.</p></details>
<div class="sources"><a class="source-link" href="https://www.tandfonline.com/doi/abs/10.1080/0025570X.1980.11976845" target="_blank" rel="noopener">Satins and twills: la geometría de las telas (Grünbaum y Shephard, en inglés)</a><a class="source-link" href="https://es.wikipedia.org/wiki/Pata_de_gallo" target="_blank" rel="noopener">La pata de gallo</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/" target="_blank" rel="noopener">Ada Lovelace y el telar de Jacquard (en inglés)</a></div>`,
  },
});
