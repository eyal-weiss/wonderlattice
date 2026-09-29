Wonderlattice.defineText('flock', 'es', {
  eyebrow: 'EMERGENCIA',
  name: 'Una mente de muchos',
  tagline: 'Sin líder, solo vecinos: guía una bandada y ponla en movimiento.',
  title: 'Una mente de muchos.',
  subtitle:
    'Cada pájaro solo mira a sus vecinos más cercanos, y nadie manda. Cambia cuánto se siguen unos a otros y mira cómo se forma una bandada.',
  field: 'Sistemas dinámicos · Emergencia',
  sceneLabel: 'Un mundo de decisiones locales',
  sceneName: 'El colectivo en movimiento',
  tip: 'Toca o arrastra para guiar la bandada · Las flechas mueven tu toque y Escape lo suelta · Los bordes se conectan',
  actionLabel: 'Dispersar la bandada',
  canvasLabel:
    'Una bandada de marcas en movimiento. Toca, arrastra o usa las flechas para guiarla. Presiona Escape para soltarla.',
  panelEyebrow: 'Reglas locales',
  whyLabel: '¿Quién manda aquí?',
  nudge: 'Baja «Seguir la dirección» a cero. ¿Puede un grupo mantenerse unido sin ponerse de acuerdo sobre adónde ir?',
  connection: {
    html: '<strong>Un patrón sin planificador.</strong> Aquí, una bandada entera surge de pequeñas interacciones. En Escucha la forma, una onda nueva surge al sumar dos más sencillas.',
    label: 'Mira cómo se combinan las ondas',
  },
  presets: [
    {
      name: 'En compañía',
      note: 'Encontrar una dirección común.',
    },
    {
      name: 'Cada uno a lo suyo',
      note: 'Que manden los caminos individuales.',
    },
    {
      name: 'Muy juntos',
      note: 'Unión sin mucho acuerdo.',
    },
  ],
  align: 'Seguir la dirección',
  cohesion: 'Mantenerse juntos',
  separate: 'Guardar distancia',
  influence: 'Tu toque',
  attract: 'Atraer',
  repel: 'Repeler',
  trails: 'Dejar estelas de luz',
  neighbors: 'Mostrar un vecindario',
  agreement: 'Acuerdo de dirección',
  status: (n) => `${n} decisiones individuales`,
  guests: [
    {
      name: 'John Conway',
      credit: 'Thane Plambeck (recortada)',
      note: 'Su Juego de la vida también crea sorpresas a partir de reglas locales diminutas.',
    },
    {
      name: 'Alan Turing',
      note: 'Su modelo de patrones mostró cómo los cambios locales pueden crear manchas y rayas.',
    },
  ],
  insight: {
    title: '¿Quién manda aquí?',
    html: `<p>Nadie. Cada marca en movimiento solo mira a sus vecinos cercanos y sigue tres tendencias: no amontonarse, seguir su dirección y mantenerse cerca.</p>
<div class="insight-visual">Interacciones individuales → movimiento colectivo</div>
<h3>El patrón vive entre los individuos</h3>
<p>Ninguna marca conoce la forma completa de la bandada. Puede surgir un movimiento coherente porque cada una responde a una pequeña parte del grupo. Tu cursor añade una atracción o una repulsión desde fuera.</p>
<h3>Un modelo, no un animal completo</h3>
<p>Esta es una versión simplificada del modelo Boids de Craig Reynolds. Capta algunos rasgos visuales de las bandadas y los bancos de peces, pero no explica cada decisión que toman las aves o los peces reales.</p>
<h3>Mira con los ojos de uno</h3>
<p>Activa «Mostrar un vecindario». El círculo marca hasta dónde percibe un individuo; las líneas apuntan a los vecinos que lo influyen. Los bordes opuestos están conectados, así que un vecino puede estar cerca al otro lado de un borde.</p>
<details><summary>¿Qué mide el «acuerdo»?</summary><p>Promediamos todos los vectores de dirección unitarios y tomamos la longitud del resultado. Cerca del 100% significa que todos apuntan más o menos hacia el mismo lado. Cerca de cero significa que las direcciones casi se anulan. Es una descripción de la bandada en este momento, no una puntuación.</p><p>Cada paso combina las tendencias de separación, alineación y cohesión, y luego limita la velocidad. Todos los individuos se actualizan a partir del mismo estado anterior.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds sobre Boids (en inglés)</a></div>`,
  },
});
