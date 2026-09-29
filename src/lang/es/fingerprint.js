Wonderlattice.defineText('fingerprint', 'es', {
  eyebrow: 'PIEL',
  name: 'Haz crecer una huella dactilar',
  tagline: 'Nadie la dibuja: las crestas crecen solas y forman verticilos, presillas y arcos.',
  title: 'Haz crecer una huella dactilar.',
  subtitle:
    'Nadie dibuja estas líneas. Dos sustancias químicas se extienden y reaccionan, y aparecen solas unas crestas como las de una huella dactilar.',
  field: 'Reacción-difusión · Patrones de Turing · Desarrollo',
  sceneLabel: 'La yema de un dedo, haciendo crecer sus crestas',
  tip: 'Toca la yema del dedo para que empiecen crestas ahí · Las flechas apuntan, Enter planta',
  actionLabel: 'Crecer de nuevo',
  canvasLabel:
    'La yema de un dedo donde las crestas crecen hacia fuera desde unos pocos puntos de partida. Haz clic o toca para que empiecen crestas en un punto, o usa las flechas para apuntar y Enter para plantar.',
  panelEyebrow: 'Da forma al crecimiento',
  whyLabel: '¿Cómo se forman las crestas?',
  nudge:
    'Fíjate en dónde se encuentran las ondas: cuando se juntan tres, dejan una pequeña Y. Luego presiona «Crecer de nuevo»: el mismo plan, detalles nuevos, como gemelos idénticos.',
  connection: {
    html: '<strong>Sin planos.</strong> Aquí, dos señales y unos pocos puntos de partida forman cada cresta. En «Una mente de muchos», unas pocas reglas entre vecinos mueven a toda una multitud.',
    label: 'Visita «Una mente de muchos»',
  },
  presets: [
    {
      name: 'Verticilo',
      note: 'El centro de la yema empieza primero.',
    },
    {
      name: 'Presilla',
      note: 'Un inicio que se sale por un lado.',
    },
    {
      name: 'Arco',
      note: 'Las crestas empiezan en el pliegue, pero nunca en el centro de la yema.',
    },
    {
      name: 'La tuya',
      note: 'Toca para elegir dónde empiezan las crestas.',
    },
  ],
  sceneNames: ['Un verticilo', 'Una presilla', 'Un arco', 'Tu propia huella'],
  mixed: 'Tu propia mezcla',
  lead: 'Ventaja para la primera onda',
  ridges: (n) => (n === 1 ? '1 cresta' : `${n} crestas`),
  spacing: 'Separación de las crestas',
  across: (n) => `unas ${n} a lo ancho`,
  speed: 'Velocidad de crecimiento',
  speeds: ['suave', 'tranquila', 'constante', 'ágil', 'a toda prisa'],
  look: 'Aspecto',
  looks: ['Piel cálida', 'Huella de tinta', 'Brillo nocturno'],
  marks: 'Mostrar dónde empiezan las crestas',
  roles: {
    pad: 'Centro de la yema',
    tip: 'Punta del dedo',
    crease: 'Pliegue',
    yours: 'Tu punto',
  },
  legendTitle: 'DÓNDE EMPIEZAN LAS CRESTAS',
  triradiusKey: 'Delta: una pequeña Y',
  started: 'creciendo',
  done: 'terminado',
  soon: (n) => (n <= 1 ? 'se une en más o menos una cresta' : `se une en unas ${n} crestas`),
  noSites: 'Toca la yema del dedo para empezar.',
  growing: (percent) => `Creciendo · ${percent}% de la yema`,
  quietly: (percent) => `Creciendo despacio · ${percent}%`,
  waiting: 'Toca la yema del dedo para que empiecen las crestas',
  types: {
    whorl: 'un verticilo',
    loop: 'una presilla',
    arch: 'un arco',
  },
  result: (type) => `Terminado: su centro forma ${type}`,
  triradii: (n) =>
    n === 0 ? 'no se encontró ningún delta' : n === 1 ? '1 delta (una pequeña Y)' : `${n} deltas (pequeñas Y)`,
  status: (type, n) => `${type[0].toUpperCase() + type.slice(1)} · ${n === 1 ? '1 delta' : `${n} deltas`}`,
  twin: (n) => `Gemelo ${n + 1} · «Crecer de nuevo» para un hermano`,
  full: 'Cuatro puntos de partida es el máximo. Elige «La tuya» para empezar con una yema nueva.',
  outside: 'Toca dentro de la yema del dedo.',
  guests: [
    {
      name: 'Alan Turing',
      note: 'En 1952 mostró que dos sustancias químicas que reaccionan y se extienden a distintas velocidades pueden hacer aparecer patrones.',
    },
  ],
  insight: {
    title: '¿De dónde salen las huellas dactilares?',
    html: `<p>Nadie dibuja una huella dactilar. Antes de nacer, la piel de cada yema dispone sus crestas por sí sola, y el patrón se mantiene toda la vida.</p>
<div class="insight-visual">activador + inhibidor, que se extienden a distintas velocidades → crestas</div>
<h3>La idea de Turing</h3>
<p>En 1952 Alan Turing mostró que dos sustancias químicas, que reaccionan entre sí y se extienden a distintas velocidades, pueden hacer aparecer un patrón en una mezcla uniforme. Más tarde surgió una manera popular de imaginarlo: un <em>activador</em> que produce más de sí mismo, y un <em>inhibidor</em>, que el activador también produce, que lo frena. Si el inhibidor se extiende más rápido, cada bulto de activador se rodea de un foso donde no puede crecer ningún otro bulto. El resultado son manchas o rayas, con una separación que elige la química.</p>
<h3>Ondas desde unos pocos lugares</h3>
<p>En 2023, un equipo dirigido desde la Universidad de Edimburgo descubrió que las crestas de las huellas siguen un sistema de Turing de este tipo, con las señales WNT y EDAR como activadores y BMP como inhibidor. Las crestas no aparecen en todas partes a la vez. Empiezan en unos pocos lugares: el centro de la yema del dedo, la punta cerca de la uña y junto al pliegue de la última articulación. Desde ahí se extienden como ondas, dejando crestas más o menos paralelas a su frente. Donde las ondas se encuentran, dejan los deltas con forma de Y. Las simulaciones del equipo produjeron arcos, presillas y verticilos cambiando dónde empiezan las crestas, cuándo empiezan y en qué dirección crecen: una yema que empieza tarde, por ejemplo, deja sitio a las crestas del pliegue y forma un arco.</p>
<h3>Por qué las huellas son tan distintas</h3>
<p>El estudio encontró que la ubicación de los puntos de partida, y cómo se encuentran sus ondas, crea la variedad de las huellas; en su discusión, los autores añaden que las diminutas diferencias al azar típicas de los patrones de Turing hacen cada huella todavía más única. Los gemelos idénticos comparten sus genes, y sus huellas a menudo comparten el tipo, pero no los detalles: en un estudio grande, las huellas de gemelos tenían el mismo tipo unas tres de cada cuatro veces, y aun así un sistema de reconocimiento de huellas las distinguía casi con la misma fiabilidad con que distingue a personas sin parentesco. «Crecer de nuevo» mantiene el plan y cambia solo los detalles más diminutos, y puedes ver cómo las crestas terminan y se bifurcan en sitios nuevos.</p>
<h3>Qué deja fuera esta sala</h3>
<p>Este es un modelo simplificado inspirado en esa investigación, no una simulación de piel embrionaria real. La yema es plana, los lugares de partida se colocan a mano y no aparecen genes ni sustancias químicas reales: solo dos señales inventadas con ecuaciones de libro de texto. Deja fuera el crecimiento del dedo, su yema en tres dimensiones y los poros del sudor que más tarde salpican cada cresta.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Las dos señales a (activador) y h (inhibidor) siguen ecuaciones adaptadas del modelo cúbico de Barrio, Varea, Aragón y Maini (aquí el activador se extiende un poco más despacio, 0.45 en lugar de 0.516, y h es su v con el signo cambiado): ∂a/∂t = 0.45 s ∇²a + 0.899 a − h − 3.15 a h², y ∂h/∂t = s ∇²h + 0.899 a − 0.91 h − 3.15 a h². El estado uniforme a = h = 0 es inestable frente a una gama de ondulaciones, que crecen más rápido con una longitud de onda de unas 9.5√s celdas de la cuadrícula, pero se mantiene exactamente uniforme hasta que un lugar de partida lo empuja, así que las crestas solo se extienden como ondas desde esos lugares. Sin términos cuadráticos (el único no lineal, a h², es cúbico), las rayas les ganan a las manchas. El control de separación de las crestas cambia s.</p><p>La sala nombra el resultado rodeando cada punto donde la dirección de las crestas deja de estar definida y sumando cuánto gira esa dirección (su índice de Poincaré): media vuelta en un sentido para el núcleo de una presilla, una vuelta entera para el centro de un verticilo y media vuelta en el otro sentido para un delta. Los peritos en huellas dactilares usan los mismos puntos de referencia. Los puntos justo en el borde de la yema no se detectan.</p></details>
<div class="sources"><a class="source-link" href="https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/" target="_blank" rel="noopener">Glover et al. (2023), The developmental basis of fingerprint pattern formation and variation (en inglés)</a><a class="source-link" href="https://doi.org/10.1098/rstb.1952.0012" target="_blank" rel="noopener">Turing (1952), The chemical basis of morphogenesis (en inglés)</a><a class="source-link" href="https://doi.org/10.1371/journal.pone.0035704" target="_blank" rel="noopener">Tao et al. (2012), reconocimiento de huellas de gemelos idénticos (en inglés)</a><a class="source-link" href="https://doi.org/10.1006/bulm.1998.0093" target="_blank" rel="noopener">Barrio et al. (1999), el modelo del que se adaptan estas ecuaciones (en inglés)</a></div>`,
  },
});
