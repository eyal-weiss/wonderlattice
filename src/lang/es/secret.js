Wonderlattice.defineText('secret', 'es', {
  eyebrow: 'TEORÍA DE NÚMEROS',
  name: 'Un secreto gritado de un lado a otro',
  tagline: 'Dos personas acuerdan un secreto mientras todos escuchan, y quienes escuchan siguen sin descubrirlo.',
  title: 'Un secreto gritado de un lado a otro.',
  subtitle: 'Alice y Bob solo pueden hablar en público. ¿Pueden aun así compartir un secreto?',
  field: 'Teoría de números · Criptografía · Una pequeña sorpresa',
  sceneLabel: 'Dos amigos · Una espía · Todo se dice en voz alta',
  sceneName: 'Compartir una clave en público',
  tip: 'Pulsa «Siguiente paso» para seguir el intercambio · Elige pintura o aritmética del reloj en el panel',
  actionLabel: 'Siguiente paso',
  canvasLabel: 'Alice a la izquierda y Bob a la derecha, y en medio todo lo que dicen en voz alta, donde Eve escucha.',
  panelEyebrow: 'Elige los secretos',
  whyLabel: '¿Por qué Eve no lo descubre?',
  nudge:
    'Sigue los tres pasos con pintura, luego cambia a la aritmética del reloj y prueba un reloj más grande. Fíjate en cuánto tarda Eve.',
  connection: {
    html: '<strong>Proteger un mensaje del ruido es un problema; mantenerlo en secreto es otro.</strong> En Envía una imagen a través de una tormenta, unos bits de más reparan lo que el ruido rompe.',
    label: 'Enviar una imagen',
  },

  presets: [
    { name: 'Mezclar pintura', note: 'Mezclar es fácil. Separar, no.', badge: '●' },
    { name: 'Un reloj de 23', note: 'El mismo truco con números.', badge: '23' },
    { name: 'Un reloj más grande', note: 'Eve tiene que probar muchísimo más.', badge: '9973' },
  ],

  people: { alice: 'Alice', bob: 'Bob', eve: 'Eve' },
  modes: ['Pintura', 'Aritmética del reloj'],
  modeLabel: 'Mostrarlo con',
  paintLabel: (name) => `Color secreto de ${name}`,
  colours: ['Rojo', 'Azul', 'Verde', 'Naranja', 'Violeta', 'Rosa'],
  pickColour: (name, colour) => `Color secreto de ${name}: ${colour}`,
  clockLabel: 'Tamaño del reloj',
  clockOption: (p) => `${p.toLocaleString(Wonderlattice.lang)} horas`,
  secretLabel: (name) => `Número secreto de ${name}`,
  secretHint: 'Solo lo sabe quien lo elige.',

  labels: {
    public: 'Todos oyen',
    secret: 'Secreto',
    shared: 'Color común',
    sends: 'Envía',
    heard: (name) => `Mezcla de ${name}`,
    same: '¡Iguales!',
    eve: 'El mejor intento de Eve',
    clock: (p) => `Un reloj de ${p.toLocaleString(Wonderlattice.lang)} horas`,
    start: (g) => `Inicio: ${g}`,
    shouts: 'Grita',
    key: 'Clave',
    hops: (k) => `${k.toLocaleString(Wonderlattice.lang)} saltos`,
    eveTrying: (k, total) =>
      `Eve prueba 1, 2, 3, …: ${k.toLocaleString(Wonderlattice.lang)} de hasta ${total.toLocaleString(Wonderlattice.lang)}`,
    eveFound: (k) => `Eve encontró el secreto de Alice tras ${k.toLocaleString(Wonderlattice.lang)} intentos`,
  },

  steps: {
    paint: [
      'Todos ven el amarillo. Alice y Bob guardan cada uno un color secreto.',
      'Paso 1 de 3: cada uno mezcla su secreto con el amarillo.',
      'Paso 2 de 3: se intercambian las mezclas, a la vista de todos.',
      'Paso 3 de 3: cada uno vuelve a añadir su propio secreto. ¡El mismo color en los dos lados!',
    ],
    clock: [
      (p, g) => `Todos conocen el reloj (${p}) y el inicio (${g}). Alice y Bob guardan cada uno un número secreto.`,
      'Paso 1 de 3: cada uno salta por el reloj, multiplicando por el inicio, tantas veces como su secreto.',
      'Paso 2 de 3: gritan dónde han caído.',
      'Paso 3 de 3: cada uno vuelve a saltar desde lo que oyó. ¡El mismo número en los dos lados!',
    ],
  },

  readout: {
    hears: 'Todos oyen',
    keeps: (name) => `${name} guarda`,
    result: 'El resultado',
    nothingYet: 'Todavía no se ha dicho nada.',
    paintHeard: 'El amarillo y las dos mezclas.',
    paintResult: 'Alice y Bob tienen el mismo color. Si Eve mezcla las dos mezclas, le sale demasiado amarillo.',
    clockHeard: (p, g, A, B) => `El reloj (${p}), el inicio (${g}) y los dos gritos: ${A} y ${B}.`,
    clockResult: (key) =>
      `Las dos claves son ${key}. Eve lo oyó todo, pero para conseguir la clave tiene que encontrar un número secreto probando.`,
    notYet: 'Todavía no.',
  },

  announce: {
    same: 'Alice y Bob ya comparten el mismo secreto. Eve no.',
    found: (k) => `Eve encontró el secreto de Alice tras ${k} intentos.`,
  },

  guests: [
    {
      name: 'Pierre de Fermat',
      note: 'En un reloj con un número primo p de horas, eleva cualquier hora a la potencia p y vuelve a sí misma.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Extendí la regla de Fermat a relojes de cualquier tamaño. Dos siglos después, una aritmética así protege secretos.',
    },
  ],

  insight: {
    title: '¿Por qué Eve no lo descubre?',
    html: `<p>Todo lo que dicen Alice y Bob, Eve lo oye. El truco es un paso fácil de dar y muy difícil de deshacer. Con la pintura, mezclar es fácil, y sacar un color de una mezcla es prácticamente imposible. Cada amigo añade un secreto dos veces, una antes de enviar y otra después de recibir, así que los dos acaban con las mismas tres pinturas en el bote. Eve solo ve mezclas con un secreto cada una, y si las junta obtiene demasiado del color común.</p>
<div class="insight-visual">común + secreto de Alice + secreto de Bob, mezclados en cualquier orden</div>
<h3>El mismo truco con números</h3>
<p>En un reloj de p horas, «multiplicar por el inicio g una y otra vez» es fácil: Alice lo hace a veces (su secreto) y grita dónde cae, A. Bob lo hace b veces y grita B. Luego Alice salta a veces desde la B de Bob, y Bob salta b veces desde la A de Alice. Los dos caen en la misma hora, porque los dos multiplicaron a × b veces en total.</p>
<p>Eve conoce el reloj, el inicio, A y B. Para conseguir la clave necesita a o b: cuántos saltos llevan del inicio hasta A. Nadie conoce una forma rápida de contarlos en un reloj grande bien elegido. Aquí solo puede probar 1, 2, 3, …, y en un reloj más grande eso tarda muchísimo más.</p>
<h3>Lo que esta sala deja fuera</h3>
<p>La pintura es una analogía, y estos relojes son diminutos. Los sistemas reales usan números de cientos de cifras (o un pariente de esta idea sobre curvas), donde incluso los métodos más ingeniosos que se conocen son desesperadamente lentos. Además tienen que comprobar con quién hablan: este truco por sí solo no impide que alguien en medio se haga pasar por Bob. Esta sala muestra la idea, no cómo proteger nada.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Con un primo p y un inicio g cuyas potencias alcanzan todas las horas 1 … p − 1 (una raíz primitiva), Alice envía A = g<sup>a</sup> mod p y Bob envía B = g<sup>b</sup> mod p. Entonces B<sup>a</sup> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> = (g<sup>a</sup>)<sup>b</sup> = A<sup>b</sup> mod p. Encontrar a a partir de g<sup>a</sup> mod p es el problema del logaritmo discreto. Whitfield Diffie y Martin Hellman publicaron este intercambio en 1976; unos investigadores de la agencia de inteligencia británica GCHQ lo habían encontrado un poco antes, pero siguió en secreto hasta 1997. Simon Singh cuenta la historia en <em>Los códigos secretos</em> (1999).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" target="_blank" rel="noopener">Intercambio de claves de Diffie–Hellman (en inglés)</a><a class="source-link" href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener">Diffie y Hellman, «New directions in cryptography» (1976) (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_logarithm" target="_blank" rel="noopener">Logaritmo discreto (en inglés)</a></div>`,
  },
});
