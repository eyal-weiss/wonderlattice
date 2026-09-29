Wonderlattice.defineText('weather', 'es', {
  eyebrow: 'CAOS · PREDICCIÓN',
  name: 'Gemelos del tiempo',
  tagline: 'Dos tiempos empiezan casi idénticos. Unas semanas después no tienen nada en común.',
  title: 'Gemelos del tiempo.',
  subtitle:
    'Dos cielos empiezan casi exactamente iguales y siguen exactamente las mismas reglas. Mira cuánto tiempo siguen pareciéndose.',
  field: 'Caos · Ecuaciones diferenciales · Predicción',
  sceneLabel: 'Tres ecuaciones · Dos comienzos · Nada de azar',
  sceneName: 'La mariposa de Lorenz',
  tip: 'Arrastra para girar la mariposa · Las flechas del teclado también la giran · Intro suelta de nuevo a los gemelos',
  actionLabel: 'Soltar de nuevo',
  canvasLabel:
    'Trayectorias gemelas que vuelan alrededor de la mariposa de Lorenz en tres dimensiones, con un gráfico de lo lejos que están. Arrastra o usa las flechas para girarla.',
  panelEyebrow: 'Mide el comienzo',
  whyLabel: '¿Por qué medir mejor no salva el pronóstico?',
  nudge:
    'Prueba con 3 decimales, luego 6 y luego 12. Cada decimal más hace el comienzo diez veces más preciso. ¿Cuántos días más te da?',
  connection: {
    html: '<strong>Reglas sencillas, destinos muy distintos.</strong> Aquí, reglas exactas separan comienzos cercanos. En el prado de las luciérnagas, reglas sencillas juntan ritmos distintos.',
    label: 'Ver ritmos que se sincronizan',
  },

  presets: [
    { name: 'La hoja impresa de Lorenz', note: 'Tres decimales, como en su hoja impresa de 1961.' },
    { name: 'Seis decimales', note: 'A una millonésima. ¿Cuánto aguantan?' },
    { name: 'Una multitud de veinte', note: 'Veinte conjeturas sobre un mismo comienzo, como hacen los meteorólogos.' },
  ],

  digits: 'Decimales medidos',
  digitsHint: 'Cada decimal más hace el comienzo diez veces más preciso.',
  twins: 'Gemelos',
  twinsHint: 'Cada gemelo empieza a una distancia aleatoria diminuta del comienzo verdadero.',
  speed: 'Velocidad',
  ghost: 'Mostrar la mariposa',
  spin: 'Dejar que gire',
  turn: 'Girar la vista',
  turnLeft: 'Girar la vista a la izquierda',
  turnRight: 'Girar la vista a la derecha',
  tiltUp: 'Inclinar la vista hacia arriba',
  tiltDown: 'Inclinar la vista hacia abajo',

  day: (n) => `Día ${n}`,
  days: (n) => `${n} ${n === 1 ? 'día' : 'días'}`,
  statusTogether: (n) => `Día ${n} · los gemelos siguen juntos`,
  statusParted: (n) => `El pronóstico aguantó ${n} ${n === 1 ? 'día' : 'días'}`,
  announceLost: (n) => `Los gemelos se han separado: el pronóstico aguantó ${n} ${n === 1 ? 'día' : 'días'}.`,
  chartLabel: 'Lo lejos que están (cada línea, diez veces más lejos)',
  lostLine: 'pronóstico perdido',
  readout: {
    held: 'El pronóstico aguantó',
    notYet: 'todavía aguanta',
    rule: 'Cada decimal más da unos',
  },

  guests: [
    {
      name: 'Edward Lorenz',
      note: 'Una hoja con tres cifras le enseñó que un redondeo diminuto puede crecer hasta otro cielo.',
    },
    {
      name: 'Henri Poincaré',
      note: 'Décadas antes, vio que pequeñas diferencias al principio pueden volverse enormes después.',
    },
  ],

  insight: {
    title: '¿Por qué medir mejor no salva el pronóstico?',
    html: `<p>Aquí nada es aleatorio. Cada gemelo sigue las mismas tres ecuaciones exactas. La única diferencia es dónde empiezan: a menos de una millonésima uno del otro, con el ajuste por defecto. Y aun así la distancia entre ellos no se queda pequeña. En promedio se duplica más o menos cada tres cuartos de día, así que crece de forma exponencial, y al cabo de un par de semanas los gemelos son tan distintos como dos tiempos sin relación.</p>
<div class="insight-visual">una distancia diminuta × duplicarse, una y otra vez → un estado completamente distinto</div>
<h3>Un poco más de tiempo, nunca mucho</h3>
<p>Mide el comienzo con diez veces más precisión y la distancia empieza diez veces más pequeña. Pero el crecimiento exponencial borra esa ventaja en un tiempo fijo: aquí, unos dos días y medio por decimal. Doce decimales en vez de seis dan unas dos semanas más, no un pronóstico que dure para siempre. Es la dependencia sensible de las condiciones iniciales, a menudo llamada efecto mariposa.</p>
<h3>La hoja impresa de Lorenz</h3>
<p>En 1961 el meteorólogo Edward Lorenz reinició una simulación del tiempo a partir de los números de una hoja impresa. El ordenador guardaba seis cifras, la hoja solo tres, así que 0.506127 volvió a entrar como 0.506. La nueva simulación siguió a la antigua durante un rato y luego derivó hacia un tiempo completamente distinto. Las tres ecuaciones de esta sala vienen de su artículo de 1963.</p>
<h3>Lo que este modelo deja fuera</h3>
<p>Estas tres ecuaciones son una imagen muy simplificada de aire que se calienta desde abajo. Muestran por qué la predicción tiene un horizonte; no son un simulador del tiempo. Aquí un «día» es una unidad de tiempo del modelo. Los meteorólogos reales se enfrentan al mismo problema con modelos mucho más ricos, y por eso ejecutan una multitud de comienzos ligeramente distintos, como en «Una multitud de veinte», e informan de cuánto coincide esa multitud.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Las ecuaciones de Lorenz son dx/dt = σ(y − x), dy/dt = x(ρ − z) − y y dz/dt = xy − βz, con σ = 10, ρ = 28 y β = 8/3. Sus soluciones nunca se calman ni se repiten, pero se quedan sobre un conjunto con forma de mariposa llamado atractor extraño. Las soluciones cercanas se separan en promedio como e<sup>λt</sup>, donde λ ≈ 0.9 es el mayor exponente de Lyapunov. Así, un comienzo medido con n decimales, desviado 10<sup>−n</sup>, se mantiene a menos de una distancia D durante unas ln(D · 10<sup>n</sup>)/λ unidades de tiempo: cada decimal más añade ln(10)/λ ≈ 2.5. La sala resuelve las ecuaciones con el método clásico de Runge–Kutta en pasos de 0.005, y un pronóstico se da por perdido cuando un gemelo se aleja más de 5 unidades de la verdad, más o menos una décima parte del tamaño de la mariposa.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Lorenz_system" target="_blank" rel="noopener">El sistema de Lorenz (en inglés)</a><a class="source-link" href="https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2" target="_blank" rel="noopener">E. N. Lorenz, «Deterministic nonperiodic flow», Journal of the Atmospheric Sciences 20 (1963) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Butterfly_effect" target="_blank" rel="noopener">El efecto mariposa (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lyapunov_exponent" target="_blank" rel="noopener">Exponente de Lyapunov (en inglés)</a></div>`,
  },
});
