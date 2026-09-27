Wonderlattice.defineText('heart', 'es', {
  eyebrow: 'MEDIOS EXCITABLES',
  name: 'Un latido que viaja',
  tagline: 'Toca una lámina de células y sale una onda. Rómpela y se enrosca en una espiral.',
  title: 'Un latido que viaja.',
  subtitle: 'Cada célula se activa y luego descansa. Inicia una onda y luego mira qué hace una onda rota.',
  field: 'Medios excitables · Ondas en espiral · Ondas en el cuerpo',
  sceneLabel: 'Una lámina · Miles de células',
  sceneName: 'El latido viajero',
  tip: 'Toca para iniciar una onda · Arrastra a través de una onda para romperla · Las flechas apuntan, Enter inicia una onda, Supr borra',
  actionLabel: 'Romper una onda',
  canvasLabel:
    'Una lámina de células donde las ondas de actividad se extienden desde un marcapasos en la esquina y desde tus toques. Arrastra a través de una onda para romperla.',
  panelEyebrow: 'Activarse y descansar',
  whyLabel: '¿Por qué gira una onda rota?',
  nudge: 'Pulsa «Romper una onda» y mira los latidos en la esquina lejana. ¿Sigue marcando el ritmo el marcapasos?',
  connection: {
    html: '<strong>Patrones de células que solo hablan con sus vecinas.</strong> Aquí, ondas de actividad recorren una lámina de células. En «Haz crecer una huella dactilar», dos sustancias químicas que se extienden a distinta velocidad dibujan crestas.',
    label: 'Mira crecer las crestas',
  },
  presets: [
    { name: 'Un latido regular', note: 'Un marcapasos, un latido por segundo.', badge: '♥' },
    { name: 'Romper una onda', note: 'Sus extremos sueltos se enroscan en espirales.', badge: '@' },
    { name: 'Recuperación lenta', note: 'Algunos latidos nunca llegan.', badge: '½' },
  ],
  recovery: 'Tiempo de recuperación',
  recoveryHint: 'Cuánto descansa una célula antes de poder activarse otra vez.',
  pacemaker: 'Marcapasos en la esquina',
  rateLabel: 'Latidos que llegan a la esquina lejana',
  rate: (n) => `${n} por minuto`,
  pacemakerRate: 'El marcapasos late 60 veces por minuto.',
  status: {
    quiet: 'Todas las células descansan',
    waves: 'Hay ondas en camino',
    steady: 'Todos los latidos llegan a la esquina lejana',
    blocked: 'Algunos latidos nunca llegan a la esquina lejana',
    spirals: (n) => (n === 1 ? 'Una espiral gira por sí sola' : `${n} espirales giran por sí solas`),
  },
  guests: [
    {
      name: 'Norbert Wiener',
      note: 'Con Arturo Rosenblueth, en 1946 describí cómo una onda de excitación puede seguir girando alrededor de un obstáculo en el músculo del corazón.',
    },
    {
      name: 'Arthur Winfree',
      note: 'Busqué el punto quieto en el centro de una onda en espiral, donde el ritmo no tiene fase alguna.',
    },
  ],
  insight: {
    title: '¿Por qué gira una onda rota?',
    html: `<p>Cada célula de esta lámina está en reposo, activa o recuperándose. Una célula en reposo se activa cuando se activan suficientes vecinas. Una célula activa se apaga pronto, y luego necesita tiempo para recuperarse antes de poder activarse otra vez. Una lámina así se llama <em>medio excitable</em>.</p>
<div class="insight-visual">reposo → activa → recuperándose → reposo</div>
<h3>Por qué las ondas no se atraviesan</h3>
<p>Detrás de cada onda hay una franja de células que se están recuperando. Cuando dos ondas se encuentran, cada una choca con la franja en recuperación de la otra y se detiene, así que se anulan en lugar de cruzarse.</p>
<h3>Por qué gira una onda rota</h3>
<p>Una onda con un extremo suelto avanza más despacio en ese extremo, donde tiene menos vecinas activas, que más adentro. El extremo se retrasa, el resto de la onda gira a su alrededor y la onda se enrosca en una espiral. Una espiral lleva su propio ritmo, y aquí ese ritmo es más rápido que el del marcapasos, así que la espiral se adueña de toda la lámina.</p>
<h3>Corazones, química y mohos mucilaginosos</h3>
<p>El músculo del corazón también es un medio excitable: cada latido es una onda de actividad eléctrica que empieza en un marcapasos natural. Las ondas en espiral que giran en el tejido cardíaco, llamadas reentrada, están relacionadas con algunos trastornos del ritmo cardíaco peligrosos. Las mismas espirales aparecen en la reacción química de Belousov–Zhabotinsky y en colonias de mohos mucilaginosos.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Es un juguete: una lámina plana y uniforme que sigue una regla matemática sencilla. El tejido cardíaco real tiene fibras, tres dimensiones, muchos tipos de células y una química mucho más rica. La sala muestra por qué se forman las espirales y por qué duran. No es una simulación de un corazón, y no dice nada sobre la salud de nadie.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Cada célula tiene una activación u entre 0 y 1 y una recuperación v, según el modelo de Barkley: ∂u/∂t = ∇²u + u(1 − u)(u − (v + b)/a)/ε y ∂v/∂t = k(u − v), con a = 0,75, b = 0,02 y ε = 0,02. El término ∇²u reparte la activación entre vecinas. El término cúbico hace que una célula solo se active por encima de un umbral, y ese umbral sigue alto mientras la célula se recupera. El factor k, añadido aquí, lo fija el control de recuperación: una recuperación más lenta da ondas más anchas, espirales más grandes y, cuando las células siguen recuperándose al llegar el siguiente latido, latidos bloqueados. Modelos anteriores de la misma idea eran autómatas celulares con unos pocos estados discretos, como el de Greenberg y Hastings de 1978. El libro de Arthur Winfree <em>When Time Breaks Down</em> (1987) cuenta la historia de las espirales en corazones y en química.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Excitable_medium" target="_blank" rel="noopener">Medio excitable, Wikipedia (en inglés)</a><a class="source-link" href="http://www.scholarpedia.org/article/Barkley_model" target="_blank" rel="noopener">Modelo de Barkley, Scholarpedia (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Belousov%E2%80%93Zhabotinsky_reaction" target="_blank" rel="noopener">Reacción de Belousov–Zhabotinsky, Wikipedia (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Arthur_Winfree" target="_blank" rel="noopener">Arthur Winfree, Wikipedia (en inglés)</a></div>`,
  },
});
