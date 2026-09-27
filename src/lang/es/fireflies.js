Wonderlattice.defineText('fireflies', 'es', {
  eyebrow: 'SINCRONÍA',
  name: 'Luciérnagas que se sincronizan',
  tagline: 'Cada una lleva su propio ritmo, hasta que empiezan a fijarse unas en otras.',
  title: 'Luciérnagas que se sincronizan.',
  subtitle:
    'Cada luciérnaga lleva su propio tiempo. Deja que se fijen unas en otras y mira cómo aparece un ritmo común.',
  field: 'Sistemas dinámicos · Osciladores acoplados · Biología',
  sceneLabel: 'Un prado · muchos relojes',
  sceneName: 'El prado de luciérnagas',
  tip: 'Lleva «Cuánto se fijan unas en otras» más allá de 1, más o menos · El círculo muestra el ritmo de todas',
  actionLabel: 'Desordenar sus ritmos',
  canvasLabel:
    'Un prado de luciérnagas que brillan suavemente, cada una a su ritmo, con un círculo que muestra en qué punto de su ciclo está cada una.',
  panelEyebrow: 'Ritmos que se atraen',
  whyLabel: '¿Por qué acaban destellando juntas?',
  nudge: 'Empieza en cero y sube despacio. ¿Dónde empieza un pulso común? ¿Llega de golpe?',
  connection: {
    html: '<strong>Orden sin director.</strong> Aquí los ritmos se arrastran unos a otros hasta ir a la par. En «Una mente de muchos», las direcciones hacen lo mismo con una bandada.',
    label: 'Mira cómo se pone de acuerdo una bandada',
  },
  presets: [
    { name: 'Cada una a lo suyo', note: 'Ninguna se fija en nadie.', badge: '0' },
    { name: 'Justo pasado el umbral', note: 'Un pulso común, poco a poco.', badge: '1.2' },
    { name: 'Día y noche', note: 'Se suma un ciclo de luz.', badge: '☾' },
  ],
  coupling: 'Cuánto se fijan unas en otras',
  couplingHint: 'Más allá de 1, más o menos, empieza a crecer un ritmo común.',
  sun: 'Añadir un ciclo de día y noche',
  circle: 'Mostrar el ritmo de todas',
  fly: 'Volar ocho husos horarios',
  together: 'A la par',
  percent: (r) => `${Math.round(r * 100)}%`,
  status: {
    apart: 'Cada una a su ritmo',
    stirring: 'Pequeños grupos encuentran el compás',
    together: 'Destellan juntas',
  },
  flying: (days) => `Después del vuelo · día ${days}`,
  caughtUp: (days) => `Se pusieron al día con el nuevo horario tras ${days} ${days === 1 ? 'día' : 'días'}.`,
  announceTogether: 'La mayoría de las luciérnagas ya destellan juntas.',
  announceApart: 'Las luciérnagas se han desincronizado.',
  labels: {
    rhythm: 'El ritmo de todas',
    history: 'A la par, con el tiempo',
  },
  guests: [
    {
      name: 'Christiaan Huygens',
      note: 'En 1665, enfermo en cama, vio que dos de sus relojes de péndulo marcaban el tiempo a la par, oscilando en sentidos opuestos, por mucho que los perturbara.',
    },
    {
      name: 'Arthur Winfree',
      note: 'Se preguntó cómo una multitud de relojes algo distintos podía ponerse de acuerdo en la hora, y encontró un punto de inflexión.',
    },
  ],
  insight: {
    title: '¿Por qué acaban destellando juntas?',
    html: `<p>Cada luciérnaga tiene su propio ritmo natural, un poco más rápido o más lento que el de las demás. Cuando ve los destellos a su alrededor, ajusta un poco su tiempo hacia la media del grupo. Nadie manda. Si los empujoncitos son débiles, ganan las diferencias y el prado titila al azar. Si son lo bastante fuertes, crece un ritmo común que arrastra a cada vez más luciérnagas.</p>
<div class="insight-visual">ritmo propio + atracción hacia el grupo → un pulso común</div>
<h3>Un umbral, no un interruptor</h3>
<p>Por debajo de una intensidad crítica (1 en el control) casi no pasa nada. Justo por encima, un pequeño núcleo se pone a la par, y la sincronía sube con fuerza a medida que avanzas, pero de forma continua, no de golpe. Con un número finito de luciérnagas el umbral se difumina un poco, y hasta «Cada una a lo suyo» muestra alrededor de un 10% de sincronía por azar.</p>
<h3>Relojes en tu cuerpo</h3>
<p>Tus células también llevan relojes, que van algo por encima o por debajo de 24 horas. La luz de cada mañana los pone a la par con el día. Si vuelas a través de varios husos horarios, la luz llega a la hora «equivocada» y tus relojes tardan días en ponerse al día. Eso es el jet lag. Aquí un «día» dura unos dos segundos.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Las luciérnagas reales no se ven todas entre sí, sus destellos son pulsos y no ritmos suaves, y los relojes del cuerpo implican genes, hormonas y un reloj maestro en el cerebro. Es el modelo clásico simplificado que captura el punto de inflexión, no una simulación de insectos ni de células reales.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Es el modelo de Kuramoto. Cada fase θ sigue dθ/dt = ω + K·R·sin(ψ − θ), donde ω es su frecuencia natural y R·e<sup>iψ</sup> es la media de todos los e<sup>iθ</sup>: R cerca de 1 significa a la par, R cerca de 0 significa dispersas. Si las frecuencias naturales se reparten como una campana, aparece un ritmo común más allá de K = 2 / (π g(0)), donde g(0) indica lo frecuente que es la frecuencia media. El control se mide en unidades de ese K crítico. El ciclo de día y noche añade un término F·sin(φ − θ), un ritmo que atrae a todas.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Kuramoto_model" target="_blank" rel="noopener">Modelo de Kuramoto, Wikipedia (en inglés)</a> · <a class="source-link" href="https://www.nigms.nih.gov/image-gallery/2569" target="_blank" rel="noopener">NIGMS: ritmo circadiano (en inglés)</a> · S. H. Strogatz, <em>Sync</em> (2003)</div>`,
  },
});
