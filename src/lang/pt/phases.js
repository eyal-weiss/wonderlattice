/* Três fios, nenhum de volta · palavras para o visitante (pt). */
Wonderlattice.defineText('phases', 'pt', {
  eyebrow: 'ENERGIA TRIFÁSICA',
  name: 'Três fios, nenhum de volta',
  tagline: 'Três correntes se perseguem em volta de um círculo, e a cada instante somam zero.',
  title: 'Três fios, nenhum de volta.',
  subtitle:
    'Três circuitos precisariam de seis fios. Veja os três fios de retorno se fundirem num só, que não carrega nada, depois ponha mais carga numa rua e acorde-o.',
  field: 'Fasores · 120° de defasagem · Um campo que gira',
  sceneLabel: 'Energia trifásica, 150 vezes mais lenta que a rede de 50 Hz',
  // By the view: the currents, the power, the field of three coils.
  sceneNames: ['Três correntes', 'Lâmpadas piscando', 'Um campo que gira'],
  tip: 'Arraste a ponta de uma seta para dentro ou para fora para mudar a corrente do fio dela • Teclas: ← → escolhem um fio, ↑ ↓ mudam a corrente',
  canvasLabel:
    'À esquerda, três setas coloridas, separadas por um terço de volta, giram em torno de um círculo como ponteiros de relógio; as alturas delas traçam três senoides à direita, e uma linha branca, a soma delas, fica parada em zero. Embaixo, uma usina manda as três correntes por três fios até três ruas de casas. No começo, cada rua tem o seu próprio fio de volta, seis fios ao todo; os três fios de retorno deslizam e se juntam num só fio compartilhado, cujo medidor marca 0 A, porque as correntes se anulam. Ponha mais carga numa rua e o medidor acorda. Outras vistas mostram as lâmpadas de cada rua piscando enquanto o total delas fica estável, e três bobinas cujo campo gira a agulha de uma bússola.',
  panelEyebrow: 'Ponha carga nas ruas',
  whyLabel: 'Por que as três correntes se anulam?',
  nudge:
    'Ligue as chaleiras e veja o fio de retorno acordar. Depois mostre o campo: três bobinas que nunca se movem giram a agulha de uma bússola.',
  connection: {
    html: '<strong>Somando ondas.</strong> Aqui, três ondas de um mesmo tom, separadas por um terço de ciclo, somam silêncio. Em “Ouça a forma”, dois tons se somam: podem se anular, formar batimentos ou um acorde.',
    label: 'Somar dois tons',
  },

  presets: [
    { name: 'Equilibrado', note: 'Correntes iguais: nada volta.', badge: '0 A' },
    { name: 'Chaleiras numa rua', note: 'O dobro da corrente no fio 1.', badge: '100 A' },
    { name: 'Um campo que gira', note: 'Três bobinas paradas giram uma bússola.', badge: '⟳' },
  ],

  wire: (n) => `Corrente no fio ${n}`,
  wireHint: 'Cada fio alimenta a sua própria rua. Aumente um, como se as chaleiras da rua fossem ligadas.',
  amps: '\u00a0A',
  view: 'Mostrar',
  // The views: the currents, the power, the field of three coils.
  views: ['Correntes', 'Potência', 'Campo'],
  swap: 'Trocar os fios 2 e 3',
  swapHint: 'O campo gira para o outro lado: é assim que se inverte um motor trifásico.',
  kettlesOn: 'Ligar as chaleiras',
  kettlesOff: 'Desligar as chaleiras',

  // A number (or a word) and one line.
  readout: {
    back: 'No fio de retorno',
    cancel: 'As três correntes se anulam a cada instante, então três fios fazem o trabalho de seis.',
    differ: 'As correntes diferem, então não se anulam mais: a diferença volta.',
    total: 'Potência total',
    steady: 'Estável',
    swings: (share) => `± ${share}`,
    totalSteady: 'As lâmpadas de cada rua piscam duas vezes por ciclo, mas as três juntas nunca.',
    totalSwings: 'As cargas diferem, então o total também sobe e desce.',
    fieldTitle: 'A intensidade do campo',
    wobbles: 'Oscila',
    fieldSteady: 'O campo mantém a intensidade e gira uma vez por ciclo, embora nada se mova.',
    fieldWobbles: 'O campo ainda gira, mas correntes desiguais o fazem crescer e encolher.',
    nothing: 'Sem corrente: as lâmpadas estão apagadas.',
  },

  status: (amps) => `Fio de retorno: ${amps}`,
  announce: (amps) => `O fio de retorno carrega ${amps}.`,

  // Words drawn on the picture.
  labels: {
    sum: 'soma',
    sumZero: 'soma = 0',
    station: 'usina',
    street: (n) => `rua ${n}`,
    back: 'retorno',
    shared: 'retorno comum',
    amps: (n) => `${n} A`,
    // The opening: six wires become three.
    story: [
      'Três circuitos: seis fios',
      'Um só fio de volta…',
      '…e ele não carrega nada',
      'Três fios trabalham por seis',
    ],
    differ: 'Correntes desiguais: a diferença volta',
    each: 'cada rua',
    total: 'total',
    field: 'campo',
    swapped: 'fios 2 e 3 trocados',
  },

  guests: [
    {
      name: 'Mikhail Dolivo-Dobrovolsky',
      note: 'Ele deu nome à corrente trifásica e construiu geradores e motores trifásicos a partir de 1888. Em 1891, o sistema dele levou energia por 175 km, de uma turbina em Lauffen até uma exposição em Frankfurt, e três quartos dela chegaram.',
    },
    {
      name: 'Nikola Tesla',
      note: 'Em 1888, ele patenteou motores movidos por correntes alternadas defasadas, cujo campo girante arrasta o rotor sem escovas nem chaves.',
    },
    {
      name: 'Galileo Ferraris',
      note: 'Em 1885, independentemente de Tesla, ele construiu um modelo para a sala de aula em que correntes defasadas criavam um campo magnético que gira. Ele o publicou em 1888.',
    },
  ],

  insight: {
    title: 'Por que as três correntes se anulam?',
    html: `<p>A corrente de cada fio é a sombra de uma seta girando em volta do círculo: a altura dela, traçada ao longo do tempo, é uma senoide. As três setas estão separadas por um terço de volta. Encadeie-as, a ponta de uma no início da outra, e elas fecham um triângulo, então somam zero, e as sombras delas também, a cada instante:</p>
<div class="insight-visual">sin θ + sin(θ − 120°) + sin(θ + 120°) = 0</div>
<p>Então três circuitos podem compartilhar um fio de volta, e quando as cargas são iguais ele não carrega nada e pode ser deixado de fora: três fios fazem o trabalho de seis. Na linguagem dos números complexos, as três setas são as raízes cúbicas de 1, que somam 0. Ponha mais carga numa rua e a seta dela cresce: o triângulo não fecha mais, e o que falta, a soma das setas, é a corrente que volta.</p>
<h3>Lâmpadas que piscam, um total que não pisca</h3>
<p>A potência de uma lâmpada cresce com o quadrado da corrente, então ela aumenta e se apaga duas vezes por ciclo: numa rede de 50 Hz, 100 vezes por segundo. Mesmo assim, sin² θ + sin²(θ − 120°) + sin²(θ + 120°) = 3/2 para todo θ, então, com cargas iguais, as três fases juntas entregam um total perfeitamente estável. É por isso que grandes motores e geradores usam três fases: um empurrão constante, sem trepidação.</p>
<h3>Um campo que gira</h3>
<p>Passe as três correntes por três bobinas dispostas a um terço de volta umas das outras em volta de um círculo, e o campo magnético no centro mantém a intensidade enquanto a direção dele gira, uma vez por ciclo. Nada se move, e mesmo assim a agulha de uma bússola, ou o rotor de um motor, é arrastado e gira. Troque dois fios quaisquer e ele gira para o outro lado, que é como se inverte um motor trifásico. Galileo Ferraris (um modelo em 1885, publicado em 1888) e Nikola Tesla (patentes em 1888) descobriram o campo girante de forma independente. Mikhail Dolivo-Dobrovolsky construiu geradores, motores e transformadores trifásicos, e em 1891 a linha dele levou energia trifásica por 175 km, de Lauffen até uma exposição em Frankfurt.</p>
<h3>O que fica de fora</h3>
<p>Três fios em vez de seis é exato só quando as três cargas são iguais. Cargas de verdade nunca são exatamente iguais, então a rede na rua em frente a uma casa tem um quarto fio, o neutro, para levar a diferença de volta, como nesta sala quando você põe mais carga numa rua. Linhas longas alimentam cargas grandes e quase equilibradas, então têm três fios; os fios mais finos que muitas vezes se veem bem no alto das torres são cabos de aterramento, que estão ali por causa de raios e falhas, não para trazer corrente de volta. Eletrônicos como carregadores de celular puxam correntes com harmônicos, e o terceiro harmônico se soma no neutro em vez de se anular, então um neutro pode até carregar mais que uma fase. Comparada a um único circuito de dois fios com a mesma tensão entre os fios, uma linha de três fios leva a mesma potência com cerca de três quartos do metal. Nesta sala, as lâmpadas são resistências simples, as ondas são senoides perfeitas, nada se perde no caminho, e tudo roda 150 vezes mais devagar que uma rede de 50 Hz.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Three-phase_electric_power" target="_blank" rel="noopener">Energia elétrica trifásica (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Neutral_conductor" target="_blank" rel="noopener">Condutor neutro (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Phasor" target="_blank" rel="noopener">Fasor (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Rotating_magnetic_field" target="_blank" rel="noopener">Campo magnético girante (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mikhail_Dolivo-Dobrovolsky" target="_blank" rel="noopener">Mikhail Dolivo-Dobrovolsky (Wikipedia, em inglês)</a></div>`,
  },
});
