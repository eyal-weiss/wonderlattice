/* Ilumine uma cidade a 100 km · palavras para o visitante (pt). */
Wonderlattice.defineText('voltage', 'pt', {
  eyebrow: 'ALTA TENSÃO',
  name: 'Ilumine uma cidade a 100 km',
  tagline: 'Envie a mesma potência com dez vezes a tensão, e o fio desperdiça cem vezes menos.',
  title: 'Ilumine uma cidade a 100 km.',
  subtitle:
    'A mesma potência, o mesmo fio. Com tensão baixa, a linha brilha e a cidade fica no escuro; aumente a tensão e as janelas se acendem. Depois, assuma o controle.',
  field: 'Efeito Joule · Transformadores · Uma lei quadrática',
  sceneLabel: '10 MW enviados · 100 km de fio',
  // By the kind of current: alternating, direct as in the 1880s, direct as today.
  sceneNames: [
    'Corrente alternada, com transformadores',
    'Corrente contínua, como nos anos 1880',
    'Corrente contínua hoje, com conversores',
  ],
  tip: 'Arraste pela escala de tensão embaixo da imagem, ou aperte ← → na imagem, para mudar a tensão',
  soundOff: 'Ligar o som',
  soundOn: 'Som ligado · silenciar',
  noSound: 'O som não está disponível neste navegador. Você ainda pode observar a linha.',
  canvasLabel:
    'À noite, uma usina à esquerda manda eletricidade por uma linha de torres até uma cidade de casinhas à direita, a 100 km, passando por um transformador em cada ponta. Com tensão baixa, o fio brilha em laranja, o calor tremula acima dele, e a maioria das janelas da cidade fica apagada. À medida que a tensão sobe, o brilho some e as janelas se acendem uma a uma. Embaixo, um gráfico mostra o calor desperdiçado no fio em função da tensão: uma reta que cai bruscamente, em que dez vezes a tensão significa cem vezes menos calor. O eixo horizontal dele é o próprio controle.',
  panelEyebrow: 'Gire o botão',
  whyLabel: 'Por que a alta tensão desperdiça menos?',
  nudge:
    'Observe a linha enquanto a tensão sobe de 10 kV para 100 kV: o calor cai cem vezes. Depois mude para corrente contínua, como nos anos 1880, para ver o que os transformadores estavam fazendo.',
  connection: {
    html: '<strong>Energia em rede.</strong> Aqui, uma só linha leva a energia de uma cidade. Na vida real, a energia corre por redes, e redes podem surpreender: em “O atalho tentador”, uma rua nova deixa todos os motoristas mais lentos. Modelos de computador sugerem que o mesmo pode acontecer quando uma rede elétrica ganha uma linha.',
    label: 'Experimente o atalho',
  },

  presets: [
    { name: 'Metade se perde', note: 'O fio transforma metade da potência em calor.', badge: '10 kV' },
    { name: 'Como a rede principal', note: 'Quase não esquenta, e todas as janelas acendem.', badge: '400 kV' },
    { name: 'Só mais metal', note: 'Cem vezes mais alumínio, ainda a 10 kV.', badge: '×100' },
  ],

  voltage: 'Tensão na linha',
  voltageHint:
    'Transformadores elevam a tensão na usina e a baixam de novo na cidade, então as casas continuam recebendo 230 V.',
  voltageValue: (kv, lost) => `${kv}, ${lost} perdidos em calor`,
  modeLabel: 'Corrente',
  // By the kind of current: alternating, direct as in the 1880s, direct as today.
  modes: ['CA', 'CC, anos 1880', 'CC, hoje'],
  modeHint: 'A corrente alternada (CA) vai e volta 50 vezes por segundo; a corrente contínua (CC) flui num só sentido.',
  metal: 'Metal no fio',
  metalHint:
    'O outro jeito de desperdiçar menos: mais alumínio significa menos resistência. O dobro de metal, metade do calor.',

  // Units, with a number already written in the page's language.
  kv: (n) => `${n}\u00a0kV`,
  times: (n) => `×${n}`,
  watts: [(n) => `${n}\u00a0W`, (n) => `${n}\u00a0kW`, (n) => `${n}\u00a0MW`, (n) => `${n}\u00a0GW`],
  cm: (n) => `${n}\u00a0cm`,
  tonnes: (n) => `${n}\u00a0toneladas`,

  // A number and one line: the rest (the current, ten times the voltage) is on the chart and in the explanation.
  readout: {
    lost: 'Perda em calor',
    lostOf: (loss, sent) => `${loss} dos ${sent} enviados. A cidade recebe o resto.`,
    tooMuch: (loss, sent) => `${loss}, mais do que os ${sent} enviados: nada chega à cidade.`,
    // Only once the visitor adds metal.
    wire: (cm, tonnes) => `O fio tem ${cm} de espessura: ${tonnes} de alumínio.`,
    stopped: 'Corrente contínua constante não atravessa um transformador, então nada chega à cidade.',
    converters:
      'Conversores elevam e baixam a tensão da corrente contínua; neste modelo simples, ela perde tanto quanto a CA.',
  },

  status: (kv, lost) => `${kv} · ${lost} perdidos`,
  statusStopped: 'Nenhuma corrente passa',

  // Words drawn on the picture.
  labels: {
    station: 'usina',
    town: 'cidade',
    distance: '100 km',
    house: '230 V',
    lost: (share) => `${share} perdidos em calor`,
    nothing: 'nada chega à cidade',
    stopped: 'CC: nada passa pelos transformadores',
    chartTitle: 'calor desperdiçado no fio',
    chartX: 'tensão na linha',
    sent: 'os 10 MW enviados',
    over: 'a cidade não recebe nada',
    // The step between the dot and ten times (or a tenth of) its voltage.
    up: ['× 10 tensão', '÷ 100 calor'],
    down: ['÷ 10 tensão', '× 100 calor'],
    drag: 'arraste aqui',
  },

  guests: [
    {
      name: 'James Prescott Joule',
      note: 'Em 1840, ele mediu o calor que uma corrente produz num fio e descobriu que ele cresce com o quadrado da corrente: o dobro da corrente, quatro vezes o calor.',
    },
    {
      name: 'Thomas Edison',
      note: 'Nos anos 1880, a empresa dele fornecia corrente contínua a 110 volts. Ela só chegava a clientes a menos de uma milha de cada usina, mas funcionava com baterias, motores elétricos e o medidor de eletricidade dele.',
    },
    {
      name: 'Nikola Tesla',
      note: 'O motor dele funcionava com corrente alternada. Em 1888, George Westinghouse licenciou as patentes dele e, com transformadores para elevar a tensão, a corrente alternada acabou vencendo a disputa com a corrente contínua de Edison.',
    },
  ],

  insight: {
    title: 'Por que a alta tensão desperdiça menos?',
    html: `<p>Uma usina envia potência como tensão vezes corrente: P = V × I. O fio transforma parte dela em calor, e esse calor cresce com o <em>quadrado</em> da corrente: I² × R, onde R é a resistência do fio (a lei de Joule). Então, para enviar a mesma potência, aumente a tensão e diminua a corrente. Dez vezes a tensão significa um décimo da corrente, e um centésimo do calor.</p>
<div class="insight-visual">calor desperdiçado = I² × R = (P ÷ V)² × R = P² × R ÷ V²</div>
<h3>Os números desta sala</h3>
<p>A usina envia 10 MW por 100 km de fio com uma resistência de 5 Ω. Com 10 kV, a corrente é de 1.000 A, e o fio desperdiça 5 MW: metade de tudo. Com 100 kV, a corrente é de 100 A, e ele desperdiça 50 kW, ou 0,5%. Com 400 kV, desperdiça cerca de 3 kW. Abaixo de uns 7 kV, a conta daria um desperdício maior do que tudo o que a usina envia, então a cidade não recebe nada.</p>
<h3>Por que não um fio mais grosso?</h3>
<p>A resistência de um fio cai na proporção da sua seção transversal, então reduzir o calor à metade só com metal significa dobrar o metal. O fio mais fino daqui é de alumínio maciço, com cerca de 2,7 cm de espessura: umas 150 toneladas de alumínio. Para fazer a 10 kV o que 100 kV faz, você precisaria de cem vezes mais: um fio de 27 cm de espessura, pesando 15.000 toneladas. Aumentar a tensão sai muito mais barato.</p>
<h3>O transformador, e a guerra das correntes</h3>
<p>As casas não podem usar 400.000 volts, então a tensão precisa baixar de novo no fim. Um transformador faz isso com duas bobinas num núcleo de ferro: uma corrente que varia numa delas cria um campo magnético que varia, e esse campo produz uma corrente na outra. As tensões ficam na proporção das espiras das bobinas, e a corrente muda no sentido contrário, então a potência fica quase a mesma. Mas isso só funciona enquanto a corrente continua variando. No fim dos anos 1880 e no começo dos anos 1890, isso fez da corrente alternada a vencedora da “guerra das correntes”. A corrente contínua de Edison tinha méritos de verdade, e funcionava com baterias, motores e medidores, mas não dava para elevar a tensão dela, então ela saía a 110 V e só chegava a clientes a menos de uma milha. Mais tarde, as válvulas de arco de mercúrio e depois, a partir dos anos 1970, a eletrônica tornaram possível converter entre corrente alternada e contínua em tensões muito altas, e hoje muitas das ligações mais longas levam corrente contínua: a linha Zhundong–Sul de Anhui, na China, opera a ±1.100 kV por mais de 3.000 km.</p>
<h3>O que fica de fora</h3>
<p>Isto é um único fio, só com resistência, levando uma potência fixa. Linhas de verdade levam três fases, e os próprios campos magnético e elétrico da linha, e a corrente que se concentra perto da superfície do fio, aumentam as perdas. As contas também supõem que a usina sempre consegue empurrar a sua potência pelo fio. Quando o fio desperdiçaria boa parte dela, isso deixa de valer: abaixo de uns 7 kV aqui, a tensão que o fio consome no caminho, I × R, seria maior do que toda a tensão da usina, então, na realidade, as lâmpadas ficariam fracas e a corrente não conseguiria crescer tanto. De um jeito ou de outro, a cidade fica no escuro. O brilho é uma imagem do calor desperdiçado, não de uma temperatura: uma linha de verdade se curvaria em direção ao chão, e seria desligada, muito antes de brilhar. A tensão também não pode subir para sempre. As torres precisam ser mais altas e os isoladores mais longos, e perto do topo da escala o ar em volta do fio começa a brilhar e a crepitar (o efeito corona); acima de uns 2.000 kV, essas perdas poderiam anular a economia. Os condutores de verdade são fios de alumínio trançados, muitas vezes em volta de uma alma de aço, e as casas recebem 230 V na maior parte do mundo, mas 120 V na América do Norte.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Electric_power_transmission" target="_blank" rel="noopener">Transmissão de energia elétrica (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Joule_heating" target="_blank" rel="noopener">Efeito Joule (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Transformer" target="_blank" rel="noopener">Transformador (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/War_of_the_currents" target="_blank" rel="noopener">Guerra das correntes (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/High-voltage_direct_current" target="_blank" rel="noopener">Corrente contínua em alta tensão (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Corona_discharge" target="_blank" rel="noopener">Efeito corona (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mains_electricity" target="_blank" rel="noopener">Eletricidade da rede doméstica (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity" target="_blank" rel="noopener">Resistividade elétrica (alumínio, em inglês)</a></div>`,
  },
});
