/* Tres cables, sin retorno · palabras para el visitante (es). */
Wonderlattice.defineText('phases', 'es', {
  eyebrow: 'CORRIENTE TRIFÁSICA',
  name: 'Tres cables, sin retorno',
  tagline: 'Tres corrientes se persiguen alrededor de un círculo, y en cada instante suman cero.',
  title: 'Tres cables, sin retorno.',
  subtitle:
    'Tres circuitos necesitarían seis cables. Mira cómo sus tres cables de retorno se funden en uno solo que no lleva nada, y luego carga una calle y despiértalo.',
  field: 'Fasores · A 120° entre sí · Un campo que gira',
  sceneLabel: 'Corriente trifásica, 150 veces más lenta que la de la red',
  // Por vista: las corrientes, la potencia, el campo de tres bobinas.
  sceneNames: ['Tres corrientes', 'Lámparas que parpadean', 'Un campo que gira'],
  tip: 'Arrastra la punta de una flecha hacia dentro o hacia fuera para cambiar la corriente de su cable • Teclas: ← → eligen un cable, ↑ ↓ cambian su corriente',
  canvasLabel:
    'A la izquierda, tres flechas de colores, separadas un tercio de vuelta, giran alrededor de un círculo como las agujas de un reloj; sus alturas trazan tres ondas sinusoidales a la derecha, y una línea blanca, su suma, se queda plana en cero. Debajo, una central eléctrica envía las tres corrientes por tres cables a tres calles de casas. Al principio cada calle tiene su propio cable de retorno, seis cables en total; los tres cables de retorno se deslizan hasta juntarse en un solo cable compartido, cuyo medidor marca 0 A, porque las corrientes se anulan. Carga más una calle y el medidor despierta. Otras vistas muestran cómo parpadean las lámparas de cada calle mientras su total se mantiene constante, y tres bobinas cuyo campo hace girar la aguja de una brújula.',
  panelEyebrow: 'Carga las calles',
  whyLabel: '¿Por qué se anulan las tres corrientes?',
  nudge:
    'Enciende los hervidores y mira cómo despierta el cable de retorno. Luego muestra el campo: tres bobinas que nunca se mueven hacen girar la aguja de una brújula.',
  connection: {
    html: '<strong>Sumar ondas.</strong> Aquí, tres ondas de una misma altura, separadas un tercio de ciclo, suman silencio. En «Escucha la forma», dos tonos se suman: pueden anularse, producir pulsaciones o formar un acorde.',
    label: 'Suma dos tonos',
  },

  presets: [
    { name: 'Equilibrado', note: 'Corrientes iguales: no vuelve nada.', badge: '0 A' },
    { name: 'Hervidores en una calle', note: 'El doble de corriente en el cable 1.', badge: '100 A' },
    { name: 'Un campo que gira', note: 'Tres bobinas quietas hacen girar una brújula.', badge: '⟳' },
  ],

  wire: (n) => `Corriente en el cable ${n}`,
  wireHint: 'Cada cable alimenta su propia calle. Súbelo, como si se encendieran sus hervidores.',
  amps: '\u00a0A',
  view: 'Mostrar',
  // Las vistas: las corrientes, la potencia, el campo de tres bobinas.
  views: ['Corrientes', 'Potencia', 'Campo'],
  swap: 'Intercambiar los cables 2 y 3',
  swapHint: 'El campo gira en sentido contrario: así se invierte el giro de un motor trifásico.',
  kettlesOn: 'Encender los hervidores',
  kettlesOff: 'Apagar los hervidores',

  // Un número (o una palabra) y una frase.
  readout: {
    back: 'En el cable de retorno',
    cancel: 'Las tres corrientes se anulan en cada instante, así que tres cables hacen el trabajo de seis.',
    differ: 'Las corrientes son distintas, así que ya no se anulan: la diferencia vuelve.',
    total: 'Potencia total',
    steady: 'Constante',
    swings: (share) => `± ${share}`,
    totalSteady: 'Las lámparas de cada calle parpadean dos veces por ciclo, pero las tres juntas nunca.',
    totalSwings: 'Las cargas son distintas, así que el total también sube y baja.',
    fieldTitle: 'La intensidad del campo',
    wobbles: 'Oscila',
    fieldSteady: 'El campo mantiene su intensidad y da una vuelta por ciclo, aunque nada se mueve.',
    fieldWobbles: 'El campo sigue girando, pero las corrientes desiguales lo hacen crecer y menguar.',
    nothing: 'Sin corriente: las lámparas están apagadas.',
  },

  status: (amps) => `Cable de retorno: ${amps}`,
  announce: (amps) => `El cable de retorno lleva ${amps}.`,

  // Palabras dibujadas en la imagen.
  labels: {
    sum: 'suma',
    sumZero: 'suma = 0',
    station: 'central',
    street: (n) => `calle ${n}`,
    back: 'cable de retorno',
    shared: 'retorno compartido',
    amps: (n) => `${n}\u00a0A`,
    // La apertura: seis cables se convierten en tres.
    story: ['Tres circuitos: seis cables', 'Comparten un retorno…', '…que no lleva nada', 'Tres cables valen por seis'],
    differ: 'Corrientes desiguales: vuelve la diferencia',
    each: 'cada calle',
    total: 'total',
    field: 'campo',
    swapped: 'cables 2 y 3 cambiados',
  },

  guests: [
    {
      name: 'Mikhail Dolivo-Dobrovolsky',
      note: 'Dio nombre a la corriente trifásica y construyó generadores y motores trifásicos desde 1888. En 1891 su sistema llevó energía a 175 km, desde una turbina en Lauffen hasta una exposición en Fráncfort, y llegaron tres cuartas partes.',
    },
    {
      name: 'Nikola Tesla',
      note: 'En 1888 patentó motores movidos por corrientes alternas desfasadas, cuyo campo giratorio arrastra el rotor sin escobillas ni interruptores.',
    },
    {
      name: 'Galileo Ferraris',
      note: 'En 1885, independientemente de Tesla, construyó un modelo para sus clases en el que corrientes desfasadas creaban un campo magnético que gira. Lo publicó en 1888.',
    },
  ],

  insight: {
    title: '¿Por qué se anulan las tres corrientes?',
    html: `<p>La corriente de cada cable es la sombra de una flecha que gira alrededor del círculo: su altura, trazada a lo largo del tiempo, es una onda sinusoidal. Las tres flechas están separadas un tercio de vuelta. Ponlas una a continuación de otra y cierran un triángulo, así que suman cero, y sus sombras también, en cada instante:</p>
<div class="insight-visual">sin θ + sin(θ − 120°) + sin(θ + 120°) = 0</div>
<p>Así que tres circuitos pueden compartir un cable de retorno, y cuando sus cargas son iguales no lleva nada y se puede quitar: tres cables hacen el trabajo de seis. En el lenguaje de los números complejos, las tres flechas son las raíces cúbicas de 1, que suman 0. Carga más una calle y su flecha crece: el triángulo ya no se cierra, y el hueco, la suma de las flechas, es la corriente que vuelve.</p>
<h3>Lámparas que parpadean, un total que no</h3>
<p>La potencia de una lámpara crece con el cuadrado de su corriente, así que sube y se apaga dos veces por ciclo: con la red de 50 Hz, 100 veces por segundo. Pero sin² θ + sin²(θ − 120°) + sin²(θ + 120°) = 3/2 para todo θ, así que con cargas iguales las tres fases juntas entregan un total perfectamente constante. Por eso los grandes motores y generadores usan tres fases: un empuje constante, sin sacudidas.</p>
<h3>Un campo que gira</h3>
<p>Lleva las tres corrientes a tres bobinas colocadas alrededor de un círculo, a un tercio de vuelta entre sí, y el campo magnético del centro mantiene su intensidad mientras su dirección gira, una vez por ciclo. Nada se mueve, y sin embargo la aguja de una brújula, o el rotor de un motor, es arrastrado en círculo. Intercambia dos cables cualesquiera y gira en sentido contrario, que es como se invierte el giro de un motor trifásico. Galileo Ferraris (un modelo en 1885, publicado en 1888) y Nikola Tesla (patentes en 1888) descubrieron el campo giratorio de forma independiente. Mikhail Dolivo-Dobrovolsky construyó generadores, motores y transformadores trifásicos, y en 1891 su línea llevó corriente trifásica a 175 km, desde Lauffen hasta una exposición en Fráncfort.</p>
<h3>Lo que esto deja fuera</h3>
<p>Tres cables en vez de seis solo es exacto cuando las tres cargas son iguales. Las cargas reales nunca lo son del todo, así que la calle frente a una casa lleva un cuarto cable, el neutro, para devolver la diferencia, como en esta sala cuando cargas una calle. Las líneas largas alimentan cargas grandes y casi equilibradas, así que llevan tres cables; los cables más finos que se suelen ver en lo más alto de las torres son cables de tierra, que están ahí por los rayos y las averías, no para devolver corriente. Los aparatos electrónicos, como los cargadores de teléfono, consumen corrientes con armónicos, y el tercer armónico se suma en el neutro en vez de anularse, así que un neutro puede llevar incluso más corriente que una fase. Comparada con un solo circuito de dos cables con el mismo voltaje entre sus cables, una línea de tres cables lleva la misma potencia con unas tres cuartas partes del metal. En esta sala las lámparas son simples resistencias, las ondas son sinusoides perfectas, nada se pierde por el camino, y todo va 150 veces más despacio que la red de 50 Hz.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Three-phase_electric_power" target="_blank" rel="noopener">Corriente trifásica (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Neutral_conductor" target="_blank" rel="noopener">Conductor neutro (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Phasor" target="_blank" rel="noopener">Fasor (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Rotating_magnetic_field" target="_blank" rel="noopener">Campo magnético giratorio (Wikipedia, en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mikhail_Dolivo-Dobrovolsky" target="_blank" rel="noopener">Mikhail Dolivo-Dobrovolsky (Wikipedia, en inglés)</a></div>`,
  },
});
