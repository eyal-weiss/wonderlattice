Wonderlattice.defineText('ribbon', 'es', {
  eyebrow: 'TOPOLOGÍA · 3D',
  name: '¿Dónde está el otro lado?',
  tagline: 'Dale media vuelta a una cinta y uno de sus lados desaparece.',
  title: '¿Dónde está el otro lado?',
  subtitle: 'Una tira de papel con media vuelta. Gírala, sigue su borde y descubre si de verdad tiene dos lados.',
  field: 'Topología · Superficies · 3D',
  sceneLabel: 'Una tira corriente, un viaje extraño',
  sceneName: 'La cinta de Möbius',
  tip: 'Arrastra para girar · Las flechas o los botones de giro también mueven la vista',
  actionLabel: 'Seguir el borde',
  canvasLabel: 'Una cinta tridimensional. Arrastra o usa las flechas para girarla.',
  panelEyebrow: 'Gira y sigue',
  whyLabel: '¿Adónde se fue el otro lado?',
  nudge:
    'Observa al viajero dorado. Con media torsión, necesita dar dos vueltas alrededor del hueco para volver a su punto de partida.',
  connection: {
    html: '<strong>Hazla de verdad.</strong> Toma una tira de papel, dale media vuelta a un extremo y pega los dos extremos con cinta adhesiva. Traza una línea por el centro sin levantar el lápiz.',
    label: 'Sigue otro tipo de lazo',
  },
  presets: [
    {
      name: 'Sin torsión',
      note: 'Un anillo de siempre, con dos bordes.',
    },
    {
      name: 'Media torsión',
      note: 'Un solo lado continuo. Un solo borde.',
    },
    {
      name: 'Una torsión completa',
      note: 'Vuelven los dos bordes.',
    },
  ],
  twists: 'Tuerce la cinta',
  twistOptions: ['Sin torsión · un anillo', 'Media torsión · Möbius', 'Torsión completa · un anillo'],
  width: 'Ancho de la cinta',
  zoom: 'Mirar de cerca',
  spin: 'Dejar que gire',
  walk: 'Mostrar al viajero',
  edges: 'Resaltar los bordes',
  turn: 'Girar la vista',
  turnLeft: 'Girar la vista a la izquierda',
  turnRight: 'Girar la vista a la derecha',
  tiltUp: 'Inclinar la vista hacia arriba',
  tiltDown: 'Inclinar la vista hacia abajo',
  nameOneSided: 'La cinta de Möbius',
  nameTwoSided: 'El anillo torcido',
  statusOneSided: 'Un lado · un borde',
  statusTwoSided: 'Dos lados · dos bordes',
  showEdges: 'Seguir el borde',
  hideEdges: 'Ocultar los bordes',
  guests: [
    {
      name: 'August Möbius',
      note: 'Con media vuelta, preguntar por «el otro lado» se vuelve una pregunta con trampa.',
    },
    {
      name: 'Johann Listing',
      note: 'Él también estudió superficies de un solo lado. La historia tiene más de un nombre.',
    },
  ],
  insight: {
    title: 'Una torsión cambia el viaje.',
    html: `<p>Une una tira de papel en un anillo y tendrás dos lados y dos bordes separados. Dale media vuelta a un extremo antes de unirlo y algo cambia: puedes llegar a lo que parecía el otro lado sin cruzar ningún borde.</p>
<div class="insight-visual">La banda de Möbius tiene un solo lado continuo y un solo borde cerrado.</div>
<h3>Sigue al viajero dorado</h3>
<p>El viajero empieza lejos de la línea central. En una cinta de Möbius, una vuelta alrededor del hueco lo lleva a la posición opuesta a lo ancho. Una segunda vuelta lo devuelve al inicio. Nunca salta de un lado a otro de la cinta.</p>
<h3>Cuenta los bordes</h3>
<p>«Seguir el borde» resalta el contorno. Con media torsión, los dos bordes aparentes forman un único lazo continuo. Sin torsión o con una torsión completa, son dos lazos separados, dibujados en colores distintos y uno de ellos con trazo discontinuo.</p>
<h3>Otra manera de ver la forma</h3>
<p>La topología estudia las propiedades que sobreviven cuando se dobla y se estira algo sin romperlo. Girar este objeto en la pantalla cambia tu punto de vista, pero su único lado sigue siendo único.</p>
<details><summary>¿Cómo se dibuja la superficie?</summary><p>Para el ángulo u y la coordenada de ancho v:<br>x = (R + v cos(nu/2)) cos(u)<br>y = (R + v cos(nu/2)) sin(u)<br>z = v sin(nu/2)</p><p>n cuenta las medias torsiones. Si n es impar, sale una banda de Möbius; si es par, una banda de dos lados. Es una superficie paramétrica proyectada en el lienzo, con las caras ordenadas por profundidad. El sombreado translúcido deja ver al viajero a través de la superficie.</p></details>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/MoebiusStrip.html" target="_blank" rel="noopener">Explora la banda de Möbius (en inglés)</a></div>`,
  },
});
