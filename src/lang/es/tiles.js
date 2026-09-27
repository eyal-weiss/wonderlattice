Wonderlattice.defineText('tiles', 'es', {
  eyebrow: 'TESELADO',
  name: 'Una baldosa que llena el mundo',
  tagline: 'Dobla un lado de una baldosa, su pareja se dobla igual, y el dibujo sigue cubriéndolo todo.',
  title: 'Una baldosa que llena el mundo.',
  subtitle:
    'Arrastra los puntos para doblar los lados. Hagas la forma que hagas, sus copias siguen encajando sin huecos.',
  field: 'Simetría · Teselados · Criaturas',
  sceneLabel: 'Una baldosa, repetida para siempre',
  sceneName: 'Tu baldosa',
  tip: 'Arrastra los puntos de la baldosa marcada · Las flechas mueven el punto elegido y Enter pasa al siguiente',
  actionLabel: 'Inventar una criatura',
  canvasLabel:
    'Un plano cubierto por copias de una baldosa. Arrastra los puntos de la baldosa marcada para doblar sus lados; los lados emparejados la siguen y todas las copias cambian con ella.',
  panelEyebrow: 'Da forma a la baldosa',
  whyLabel: '¿Por qué siempre encaja?',
  nudge:
    'Tira de un punto hacia fuera y mira a su gemelo en el lado emparejado: el bulto que haces es justo el hueco que necesita la vecina.',
  connection: {
    html: '<strong>Unas pocas reglas, repetidas en todas partes.</strong> Aquí, cómo se emparejan los lados decide todo el dibujo. En el telar, una cuadrícula diminuta decide toda la tela.',
    label: 'Visita «El telar matemático»',
  },
  presets: [
    { name: 'Peces', note: 'Cuadrados que se deslizan.' },
    { name: 'Molinillo', note: 'Cuadrados que giran.' },
    { name: 'Pollitos', note: 'Hexágonos que se deslizan.' },
  ],
  rule: 'Cómo se emparejan los lados',
  rules: ['Cuadrados que se deslizan', 'Cuadrados que giran', 'Hexágonos que se deslizan', 'Hexágonos que giran'],
  ruleNotes: [
    'Cada lado se desliza hasta el lado opuesto.',
    'Cuatro baldosas giran alrededor de una esquina.',
    'Cada lado se desliza hasta el lado opuesto.',
    'Tres baldosas giran alrededor de una esquina.',
  ],
  palette: 'Colores',
  palettes: ['Jardín', 'Mar', 'Atardecer', 'Golosinas'],
  eye: 'Ponerle un ojo',
  size: 'Tamaño de la baldosa',
  point: (n, total) => `Punto ${n} de ${total}`,
  changed: 'La baldosa cambió de forma y sus copias siguen llenando el plano.',
  invented: 'Una criatura nueva, y sigue llenando el plano.',
  plain: 'Otra vez una baldosa sencilla, de lados rectos. Dóblala hasta que sea algo.',
  ruleChanged: (name) => `${name}. Las mismas curvas, emparejadas de otra manera.`,
  guests: [
    {
      name: 'Marjorie Rice',
      note: 'En la mesa de su cocina, en los años setenta y sin título de matemáticas, encontró pentágonos nuevos que teselan el plano.',
    },
    {
      name: 'M. C. Escher',
      note: 'Artista más que matemático, llenó planos enteros de pájaros, peces y lagartos que encajan como piezas de un rompecabezas.',
    },
  ],
  insight: {
    title: '¿Por qué la baldosa siempre encaja?',
    html: `<p>Cada lado de la baldosa viene en pareja. Cuando doblas un lado, su pareja no se dobla por separado: es una copia de la misma curva, deslizada al otro lado o girada alrededor de una esquina. Así, cada bulto que haces en un lado es justo el hueco que una copia vecina necesita en el otro. Las copias no pueden solaparse ni dejar huecos.</p>
<div class="insight-visual">doblas un lado → su pareja es la misma curva, movida → las vecinas encajan</div>
<h3>Las reglas son simetrías</h3>
<p>Los movimientos que emparejan los lados son los mismos que reparten las baldosas por el plano: deslizamientos en «Cuadrados que se deslizan» y «Hexágonos que se deslizan», cuartos de vuelta alrededor de dos esquinas en «Cuadrados que giran» y tercios de vuelta alrededor de esquinas alternas en «Hexágonos que giran». Los matemáticos clasifican los dibujos que se repiten según sus simetrías y han demostrado que hay exactamente 17 tipos, los grupos cristalográficos planos. Esta sala ofrece cuatro.</p>
<h3>Aficionados que cambiaron la historia</h3>
<p>En los años setenta, Marjorie Rice, ama de casa de San Diego sin formación matemática, leyó sobre la búsqueda de pentágonos que teselan el plano y encontró cuatro tipos nuevos, trabajando en la mesa de su cocina. En 2023, David Smith, técnico de imprenta jubilado al que le gustaba jugar con formas, encontró el «sombrero»: una sola baldosa que cubre el plano pero nunca se repite (usando imágenes especulares de sí misma; una prima posterior, el «espectro», ni siquiera las necesita). Los matemáticos llevaban décadas buscando una baldosa «einstein» así; con Joseph Myers, Craig Kaplan y Chaim Goodman-Strauss demostró que funciona. El sombrero no aparece en esta sala.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Una baldosa que cubre el plano con copias de sí misma, todas relacionadas por simetrías del dibujo, se llama isoédrica. Aquí cada lado libre es una curva suave que pasa por las esquinas y por tres puntos de control; cada uno de los demás lados es su imagen por una traslación o un giro (de 90° alrededor de esquinas opuestas del cuadrado, o de 120° alrededor de esquinas alternas del hexágono). Como cada lado lo comparten exactamente dos copias, el área de la baldosa nunca cambia, dibujes lo que dibujes: lo que gana un lado, su pareja lo devuelve.</p><p>Los colores se eligen para que las vecinas siempre sean distintas: por orientación en las reglas de giro y por posición en la red en las de deslizamiento.</p></details>
<p>Para leer más: J. H. Conway, H. Burgiel y C. Goodman-Strauss, <em>The Symmetries of Things</em> (A K Peters, 2008).</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Wallpaper_group" target="_blank" rel="noopener">Los 17 grupos cristalográficos planos (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Marjorie_Rice" target="_blank" rel="noopener">Marjorie Rice (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Einstein_problem" target="_blank" rel="noopener">El problema del einstein y el sombrero (en inglés)</a><a class="source-link" href="https://arxiv.org/abs/2303.10798" target="_blank" rel="noopener">An aperiodic monotile (Smith, Myers, Kaplan y Goodman-Strauss, 2023) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/M._C._Escher" target="_blank" rel="noopener">M. C. Escher (en inglés)</a></div>`,
  },
});
