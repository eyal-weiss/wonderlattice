/* Ilumina un pueblo a 100 km · palabras para el visitante (es). */
Wonderlattice.defineText('voltage', 'es', {
  eyebrow: 'LÍNEAS ELÉCTRICAS',
  name: 'Ilumina un pueblo a 100 km',
  tagline: 'Envía la misma potencia con diez veces más voltaje, y el cable desperdicia cien veces menos.',
  title: 'Ilumina un pueblo a 100 km.',
  subtitle:
    'La misma potencia, el mismo cable. Con poco voltaje, la línea brilla y el pueblo se queda a oscuras; sube el voltaje y las ventanas se encienden. Luego toma tú el dial.',
  field: 'Efecto Joule · Transformadores · Una ley cuadrática',
  sceneLabel: '10 MW enviados · 100 km de cable',
  // Por tipo de corriente: alterna, continua como en la década de 1880, continua como hoy.
  sceneNames: [
    'Corriente alterna, con transformadores',
    'Corriente continua de los años 1880',
    'Corriente continua hoy, con convertidores',
  ],
  tip: 'Arrastra a lo largo de la escala de voltaje bajo la imagen, o pulsa ← → sobre la imagen, para cambiar el voltaje',
  soundOff: 'Activar el sonido',
  soundOn: 'Sonido activado · silenciar',
  noSound: 'El sonido no está disponible en este navegador. Aun así puedes mirar la línea.',
  canvasLabel:
    'De noche, una central eléctrica a la izquierda envía electricidad por una línea de torres hasta un pueblo de casitas a la derecha, a 100 km, a través de un transformador en cada extremo. Cuando el voltaje es bajo, el cable brilla en naranja, el aire tiembla de calor sobre él, y la mayoría de las ventanas del pueblo siguen a oscuras. Al subir el voltaje, el brillo se apaga y las ventanas se encienden una a una. Debajo, un gráfico muestra el calor desperdiciado en el cable frente al voltaje: una recta que cae en picado, donde diez veces más voltaje significa cien veces menos calor. Su eje horizontal es el dial.',
  panelEyebrow: 'Gira el dial',
  whyLabel: '¿Por qué el alto voltaje desperdicia menos?',
  nudge:
    'Mira la línea mientras el voltaje sube de 10 kV a 100 kV: el calor baja cien veces. Luego cambia a corriente continua, como en la década de 1880, para ver qué hacían los transformadores.',
  connection: {
    html: '<strong>Energía a través de una red.</strong> Aquí, una sola línea lleva la energía de un pueblo. Las redes eléctricas de verdad tienen muchos caminos, y las redes pueden sorprender: en «El atajo tentador», una carretera nueva hace más lento a cada conductor. Los modelos por ordenador sugieren que puede pasar lo mismo cuando una red eléctrica gana una línea.',
    label: 'Prueba el atajo',
  },

  presets: [
    { name: 'La mitad, perdida', note: 'El cable convierte la mitad de la potencia en calor.', badge: '10 kV' },
    { name: 'Como una gran línea de la red', note: 'Apenas tibio, y todas las ventanas encendidas.', badge: '400 kV' },
    { name: 'Solo añade metal', note: 'Cien veces más aluminio, todavía a 10 kV.', badge: '×100' },
  ],

  voltage: 'Voltaje en la línea',
  voltageHint:
    'Los transformadores suben el voltaje en la central y lo vuelven a bajar en el pueblo, así que las casas siguen recibiendo 230 V.',
  voltageValue: (kv, lost) => `${kv}, se pierde el ${lost} en calor`,
  modeLabel: 'Corriente',
  // Por tipo de corriente: alterna, continua como en la década de 1880, continua como hoy.
  modes: ['CA', 'CC, años 1880', 'CC, hoy'],
  modeHint:
    'La corriente alterna (CA) va y viene 50 veces por segundo; la corriente continua (CC) fluye en un solo sentido.',
  metal: 'Metal en el cable',
  metalHint:
    'La otra manera de desperdiciar menos: más aluminio significa menos resistencia. El doble de metal, la mitad de calor.',

  // Unidades, con un número ya escrito en el idioma de la página.
  kv: (n) => `${n}\u00a0kV`,
  times: (n) => `×${n}`,
  watts: [(n) => `${n}\u00a0W`, (n) => `${n}\u00a0kW`, (n) => `${n}\u00a0MW`, (n) => `${n}\u00a0GW`],
  cm: (n) => `${n}\u00a0cm`,
  tonnes: (n) => `${n}\u00a0toneladas`,

  // Un número y una frase: el resto (la corriente, diez veces el voltaje) está en el gráfico y en la explicación.
  readout: {
    lost: 'Perdido en calor',
    lostOf: (loss, sent) => `${loss} de los ${sent} enviados. El pueblo recibe el resto.`,
    tooMuch: (loss, sent) => `${loss}, más que los ${sent} enviados: nada llega al pueblo.`,
    // Solo cuando el visitante añade metal.
    wire: (cm, tonnes) => `El cable tiene ${cm} de grosor: ${tonnes} de aluminio.`,
    stopped: 'Una corriente continua constante no puede atravesar un transformador, así que nada llega al pueblo.',
    converters:
      'Los convertidores suben y bajan el voltaje de la corriente continua; en este modelo sencillo, pierde tanto como la CA.',
  },

  status: (kv, lost) => `${kv} · se pierde el ${lost}`,
  statusStopped: 'No pasa corriente',

  // Palabras dibujadas en la imagen.
  labels: {
    station: 'central',
    town: 'pueblo',
    distance: '100 km',
    house: '230 V',
    lost: (share) => `${share} perdido en calor`,
    nothing: 'nada llega al pueblo',
    stopped: 'CC: nada cruza los transformadores',
    chartTitle: 'calor perdido en el cable',
    chartX: 'voltaje en la línea',
    sent: 'los 10 MW enviados',
    over: 'el pueblo no recibe nada',
    // El paso entre el punto y diez veces (o una décima parte de) su voltaje.
    up: ['× 10 voltaje', '÷ 100 calor'],
    down: ['÷ 10 voltaje', '× 100 calor'],
    drag: 'arrástralo',
  },

  guests: [
    {
      name: 'James Prescott Joule',
      note: 'En 1840 midió el calor que produce una corriente en un cable, y descubrió que crece con el cuadrado de la corriente: el doble de corriente, cuatro veces más calor.',
    },
    {
      name: 'Thomas Edison',
      note: 'En la década de 1880, su compañía suministraba corriente continua a 110 voltios. Solo llegaba a clientes a menos de una milla de cada central, pero funcionaba con baterías, motores eléctricos y su contador de electricidad.',
    },
    {
      name: 'Nikola Tesla',
      note: 'Su motor funcionaba con corriente alterna. En 1888, George Westinghouse obtuvo la licencia de sus patentes, y con transformadores para subir el voltaje, la corriente alterna acabó ganando la contienda a la corriente continua de Edison.',
    },
  ],

  insight: {
    title: '¿Por qué el alto voltaje desperdicia menos?',
    html: `<p>Una central envía potencia como voltaje por corriente: P = V × I. El cable convierte parte de ella en calor, y ese calor crece con el <em>cuadrado</em> de la corriente: I² × R, donde R es la resistencia del cable (la ley de Joule). Así que, para enviar la misma potencia, sube el voltaje y baja la corriente. Diez veces más voltaje significa una décima parte de la corriente, y una centésima parte del calor.</p>
<div class="insight-visual">calor desperdiciado = I² × R = (P ÷ V)² × R = P² × R ÷ V²</div>
<h3>Los números de esta sala</h3>
<p>La central envía 10 MW a lo largo de 100 km de cable con una resistencia de 5 Ω. A 10 kV la corriente es de 1\u202f000 A, y el cable desperdicia 5 MW: la mitad de todo. A 100 kV la corriente es de 100 A, y desperdicia 50 kW, o un 0,5%. A 400 kV desperdicia unos 3 kW. Por debajo de unos 7 kV, la cuenta desperdiciaría más de lo que envía la central, así que el pueblo no recibe nada en absoluto.</p>
<h3>¿Por qué no un cable más grueso?</h3>
<p>La resistencia de un cable baja en proporción a su sección, así que reducir el calor a la mitad solo con metal significa duplicar el metal. El cable más fino de aquí es de aluminio macizo, de unos 2,7 cm de grosor: unas 150 toneladas. Para hacer a 10 kV lo que hace 100 kV, harían falta cien veces más: un cable de 27 cm de grosor, con un peso de 15\u202f000 toneladas. Subir el voltaje sale muchísimo más barato.</p>
<h3>El transformador y la guerra de las corrientes</h3>
<p>Las casas no pueden usar 400\u202f000 voltios, así que el voltaje tiene que volver a bajar al final. Un transformador lo hace con dos bobinas sobre un núcleo de hierro: una corriente que cambia en una de ellas crea un campo magnético que cambia, y este impulsa una corriente en la otra. Los voltajes guardan la proporción de las vueltas de las bobinas, y la corriente cambia al revés, así que la potencia se mantiene casi igual. Pero solo funciona mientras la corriente sigue cambiando. A finales de la década de 1880 y principios de la de 1890, eso hizo de la corriente alterna la ganadora de la «guerra de las corrientes». La corriente continua de Edison tenía méritos reales, y funcionaba con baterías, motores y contadores, pero no se podía elevar, así que salía a 110 V y llegaba a clientes a menos de una milla. Más tarde, las válvulas de arco de mercurio y después, desde la década de 1970, la electrónica permitieron convertir entre corriente alterna y continua a muy alto voltaje, y hoy muchos de los enlaces más largos llevan corriente continua: en China, la línea Zhundong–South Anhui funciona a ±1\u202f100 kV a lo largo de más de 3\u202f000 km.</p>
<h3>Lo que esto deja fuera</h3>
<p>Esto es un solo cable que solo tiene resistencia y lleva una potencia fija. Las líneas de verdad llevan tres fases, y los propios campos magnético y eléctrico de la línea, y la corriente que se concentra hacia la superficie del cable, aumentan sus pérdidas. Las cuentas también suponen que la central siempre puede hacer pasar su potencia. Cuando el cable desperdiciaría una gran parte de ella, eso falla: por debajo de unos 7 kV, aquí, el voltaje que el cable consume por el camino, I × R, sería mayor que todo el voltaje de la central, así que en realidad las lámparas perderían brillo y la corriente no podría crecer tanto. En cualquier caso, el pueblo se queda a oscuras. El resplandor es una imagen del calor desperdiciado, no de una temperatura: una línea de verdad se combaría hacia el suelo, y se desconectaría, mucho antes de brillar. El voltaje tampoco puede subir sin fin. Las torres deben ser más altas y los aisladores más largos, y cerca de lo más alto del dial el aire alrededor del cable empieza a brillar y a chisporrotear (el efecto corona); por encima de unos 2\u202f000 kV, esas pérdidas podrían anular el ahorro. Los conductores reales son hilos de aluminio, a menudo alrededor de un alma de acero, y las casas reciben 230 V en la mayor parte del mundo, pero 120 V en Norteamérica.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Electric_power_transmission" target="_blank" rel="noopener">Transmisión de energía eléctrica (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Joule_heating" target="_blank" rel="noopener">Efecto Joule (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Transformer" target="_blank" rel="noopener">Transformador (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/War_of_the_currents" target="_blank" rel="noopener">Guerra de las corrientes (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/High-voltage_direct_current" target="_blank" rel="noopener">Corriente continua de alta tensión (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Corona_discharge" target="_blank" rel="noopener">Efecto corona (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mains_electricity" target="_blank" rel="noopener">Electricidad de red (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity" target="_blank" rel="noopener">Resistividad eléctrica, aluminio (Wikipedia, en inglés)</a></div>`,
  },
});
