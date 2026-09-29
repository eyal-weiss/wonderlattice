Wonderlattice.defineText('traffic', 'es', {
  eyebrow: 'TEORÍA DE JUEGOS',
  name: 'El atajo tentador',
  tagline: 'Una carretera nueva que hace más lento a cada conductor.',
  title: 'El atajo tentador.',
  subtitle: 'Cada conductor toma la ruta más rápida. Abre un atajo nuevo y mira si todos llegan antes a casa.',
  field: 'Redes · Teoría de juegos · Una pequeña sorpresa',
  sceneLabel: 'Una ciudad · Muchas decisiones privadas',
  sceneName: 'El cruce de la ciudad',
  tip: 'Los marcadores en movimiento muestran proporciones del tráfico, no vehículos individuales',
  actionLabel: 'Abrir el atajo',
  canvasLabel: 'Una red de carreteras con sentido. Abre o cierra el atajo del medio y cambia el número de conductores.',
  panelEyebrow: 'Cambia una carretera',
  whyLabel: '¿Cómo puede pasar eso?',
  nudge:
    'Empieza con 4\u202f000 conductores. Abre el atajo. Luego prueba con mucho menos tráfico. ¿La carretera es siempre una mala idea?',
  connection: {
    html: '<strong>Reglas sencillas, resultado inesperado.</strong> En Una mente de muchos, una bandada crea un patrón a partir de interacciones locales. Aquí, cada conductor que elige una ruta rápida puede hacer más lento el viaje de todos.',
    label: 'Sigue a otra multitud',
  },
  presets: [
    {
      name: 'Calles tranquilas',
      note: 'Puede que el atajo ayude.',
    },
    {
      name: 'Una ciudad llena',
      note: 'Prueba la sorpresa.',
    },
    {
      name: 'Máximo tráfico',
      note: '¿Puede el atajo dejar de importar?',
    },
  ],
  demand: 'Conductores que cruzan la ciudad',
  demandHint: '¿Cuánta gente hay en la ciudad?',
  drivers: (n) => n.toLocaleString('fr').replace(',', '.'),
  status: (open, minutes) => `${open ? 'Atajo abierto' : 'Atajo cerrado'} · ${minutes} min ahora`,
  open: 'Abrir el atajo',
  close: 'Cerrar el atajo',
  before: 'Antes',
  after: 'Con el atajo',
  minutes: ' min',
  verdict: {
    closed: 'Abre el atajo para ver el nuevo tiempo de viaje.',
    same: 'La carretera nueva no cambia el tiempo de viaje.',
    slower: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} más de viaje para todos.`,
    faster: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} menos de viaje para todos.`,
  },
  labels: {
    nodes: {
      start: 'S',
      north: 'A',
      south: 'B',
      end: 'T',
    },
    congestion: 'congestión',
    fixed: '45 min',
    shortcutOpen: '0 min',
    shortcutClosed: 'cerrado',
    caption: 'S → T · cada uno elige su ruta más rápida',
  },
  guests: [
    {
      name: 'John von Neumann',
      note: 'El tráfico es un juego de decisiones, y una jugada astuta puede sorprender a todos.',
    },
    {
      name: 'John Nash',
      note: 'Aquí ningún conductor puede mejorar por su cuenta, aunque todos vayan más lentos.',
    },
  ],
  insight: {
    title: '¿Por qué una carretera nueva puede frenar a todos?',
    html: `<p>Con 4\u202f000 conductores y sin atajo, el tráfico se reparte a partes iguales entre la ruta de arriba y la de abajo. Cada viaje dura 65 minutos. Abre el enlace de cero minutos entre A y B y cada conductor ve un motivo para usarlo. Todos toman S → A → B → T, y cada viaje dura 80 minutos.</p>
<div class="insight-visual">Un atajo puede cambiar las decisiones de la gente, y sus decisiones cambian la congestión.</div>
<h3>Prueba con una ciudad más tranquila</h3>
<p>Mueve el control de demanda hacia 1\u202f000. Ahora el atajo ayuda. Con una demanda muy alta, nadie lo usa. La paradoja solo ocurre en una parte del rango.</p>
<h3>Qué supone este modelo</h3>
<p>Cada conductor elige la ruta más rápida para sí mismo. Sus decisiones juntas llegan a un equilibrio en el que ningún conductor puede ahorrar tiempo cambiando de ruta él solo. Es una red simplificada, con sentido único, un atajo gratuito y tiempos de viaje que dependen solo del flujo de tráfico. Los puntos en movimiento muestran las proporciones en cada ruta, no decisiones individuales simuladas ni una predicción para una ciudad real.</p>
<details><summary>Las matemáticas, si quieres verlas</summary><p>Los tramos que se congestionan cuestan x/100 minutos, donde x es el número de conductores que usan ese tramo. Los otros dos tramos cuestan 45 minutos cada uno; el atajo A → B cuesta cero. Sin él, el tiempo de viaje es 45 + D/200 para D conductores. Con D = 4\u202f000, son 65 minutos. Con él, el equilibrio usa la ruta del medio y cuesta 2D/100 = 80 minutos.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explora la paradoja de Braess (Easley y Kleinberg, en inglés)</a></div>`,
  },
});
