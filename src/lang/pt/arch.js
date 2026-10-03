/* Pendure, vire, construa · palavras para o visitante (pt). */
Wonderlattice.defineText('arch', 'pt', {
  eyebrow: 'CORRENTES E ARCOS',
  name: 'Pendure, vire, construa',
  tagline:
    'Uma corrente pendurada, virada de cabeça para baixo, é um arco de pedras soltas que fica em pé. Um semicírculo com as mesmas pedras desaba.',
  title: 'Pendure, vire, construa.',
  subtitle:
    'Uma corrente pende entre dois pinos. Virada de cabeça para baixo, a mesma forma fica em pé como um arco de pedras soltas; ao lado, um semicírculo com as mesmas pedras desaba. Pendure torres na corrente, ou desenhe o seu próprio arco.',
  field: 'Engenharia · A catenária · Linhas de força',
  sceneLabel: 'Uma corrente e um arco · Pedras soltas, sem argamassa',
  sceneName: 'O seu próprio experimento',
  tip: 'Arraste um pino · Toque na corrente ou numa pedra para pôr uma torre · Arraste os pontos de um arco, ou desenhe um arco novo · Teclas: ← → escolhem, ↑ ↓ mudam, F vira',
  actionLabel: 'Virar',
  canvasLabel:
    'Duas imagens lado a lado, na mesma escala. À esquerda, uma corrente pende entre dois pinos e balança até parar; depois ela vira um arco de pedras sem argamassa, e fica em pé. Uma linha dourada, a linha de força, passa por dentro de cada pedra. Torres penduradas na corrente ficam em pé sobre o arco depois que ele é virado. À direita, um arco das mesmas pedras com outra forma, de início um semicírculo, é construído sobre uma armação de madeira. Quando a armação cai, a linha de força dele sai das pedras, quatro juntas se abrem, e ele se dobra e desaba. O seu próprio arco tem nove pontos para arrastar para dentro ou para fora.',
  panelEyebrow: 'Molde a corrente',
  whyLabel: 'Por que fica em pé?',
  nudge:
    'Toque três vezes numa pedra a meia altura de um lado do arco em pé, para dar a ela uma torre de três andares: ele desaba. Vire de volta, e a corrente se curva para carregar a torre. Vire de novo.',
  connection: {
    html: '<strong>Pedras sem cola.</strong> Aqui, cada pedra fica no lugar pelo empurrão das vizinhas. Em “A torre inclinada de blocos”, cada bloco se equilibra sobre o de baixo.',
    label: 'Ver a torre inclinada',
  },

  presets: [
    { name: 'Pendure, vire', note: 'A forma da corrente fica em pé; um semicírculo desaba.' },
    { name: 'Uma torre na lateral', note: 'A corrente se curva sob ela, e assim o arco consegue carregá-la.' },
    { name: 'Uma estrada para carregar', note: 'Sob uma estrada pesada, a corrente vira uma parábola.' },
  ],

  // Lengths: the pegs start 1 m apart.
  cm: ' cm',
  length: 'Comprimento da corrente',
  lengthHint: 'Uma corrente mais longa pende mais fundo, e vira um arco mais alto.',
  thick: 'Espessura das pedras',
  thickHint: 'Para os dois arcos. Com pedras grossas o bastante, até um semicírculo fica em pé.',
  road: 'Pendurar uma estrada na corrente',
  beside: 'O arco ao lado',
  shapes: { semicircle: 'Semicírculo', pointed: 'Ogival', flat: 'Baixo', own: 'O seu' },
  ownHint: 'Arraste os pontos dele para dentro ou para fora, ou desenhe um arco novo de um pé ao outro.',

  // Numbers arrive already written in the page's language.
  percent: (x) => `${x}%`,
  length_cm: (x) => `${x} cm`,
  readout: {
    hanging: 'Pendurada, a corrente fica esticada de ponta a ponta: pura tração.',
    stands: 'Virada, a mesma forma fica em pé: pura compressão.',
    falls: 'Virada, com estas cargas, ela desaba.',
    inside: (share) => `A linha de força fica dentro das pedras, com uma folga de ${share} da espessura delas.`,
    outside: (share) => `Nenhuma linha de força cabe: a melhor passa ${share} da espessura delas para fora das pedras.`,
    beside: (name, stands) => `${name}, feito com as mesmas pedras, ${stands ? 'fica em pé' : 'desaba'}.`,
    thinnest: (cm) => `Fica em pé com pedras a partir de ${cm} de espessura.`,
    thickest: (cm) => `Ficaria em pé com pedras de pelo menos ${cm} de espessura.`,
    never: (cm) => `Nem pedras de ${cm} de espessura o sustentariam.`,
    any: 'Fica em pé com pedras de qualquer espessura.',
    working: 'Calculando a espessura que as pedras precisam ter…',
  },
  status: {
    hanging: 'A corrente está pendurada',
    stands: 'Virada, fica em pé',
    falls: 'Virada, desaba',
    beside: (name, stands) => `${name}: ${stands ? 'fica em pé' : 'desaba'}`,
  },

  // Words drawn on the canvas.
  labels: {
    chain: 'Corrente pendurada',
    arch: 'A corrente, virada',
    stands: 'Fica em pé',
    falls: 'Desaba',
    building: 'Na armação',
    semicircle: 'Um semicírculo',
    pointed: 'Um arco ogival',
    flat: 'Um arco baixo',
    own: 'O seu arco',
    force: 'Linha de força',
    parabola: 'Parábola',
    catenary: 'Catenária',
    drawing: 'Desenhe de um pé ao outro',
    gallery: 'As mesmas pedras em outras formas · Toque numa para testar',
    thinnest: (cm) => `Pedras mais finas: ${cm}`,
    never: (cm) => `Nem pedras de ${cm}`,
    any: 'Qualquer espessura serve',
    chartTitle: 'Quão finas podem ser as pedras?',
    chainShape: 'A forma da corrente',
    yours: (cm) => `Suas pedras: ${cm}`,
  },

  announce: {
    stands: 'A corrente, virada, fica em pé como um arco.',
    falls: 'Com estas cargas, o arco desaba.',
    hanging: 'A corrente está pendurada nos pinos.',
    beside: (name, stands) => `${name}, feito com as mesmas pedras, ${stands ? 'fica em pé' : 'desaba'}.`,
    towers: (stone, storeys) =>
      storeys === 0
        ? `Pedra ${stone}: sem torre.`
        : `Pedra ${stone}: uma torre de ${storeys} ${storeys === 1 ? 'andar' : 'andares'}.`,
    peg: (side) =>
      side === 0
        ? 'O pino da esquerda: as setas para cima e para baixo o movem, A e D o movem para os lados.'
        : 'O pino da direita: as setas para cima e para baixo o movem, A e D o movem para os lados.',
    dot: (n) => `Ponto ${n} de 9 do arco ao lado: as setas para cima e para baixo o movem para fora e para dentro.`,
  },

  guests: [
    {
      name: 'Robert Hooke',
      note: 'Em 1675, ele escondeu a sua regra para arcos em letras latinas embaralhadas. Desembaralhada depois da morte dele, ela diz que uma corrente pendurada, virada, dá a forma de um arco que fica em pé.',
    },
    {
      name: 'Galileu Galilei',
      note: 'Em 1638, ele escreveu que uma corrente pendurada fica perto de uma parábola, e mais perto quanto menos ela pende. Fica perto mesmo, mas é outra curva.',
    },
    {
      name: 'Antoni Gaudí',
      note: 'Para a cripta de uma igreja na Colònia Güell, ele pendurou cordas com saquinhos de chumbinho, fotografou-as e virou as fotos de cabeça para baixo para desenhar as abóbadas.',
    },
  ],

  insight: {
    title: 'Por que a forma da corrente fica em pé?',
    html: `<p>Uma corrente pendurada só consegue puxar: cada elo puxa o seguinte, ao longo da corrente. A forma dela é aquela em que esses puxões equilibram o peso de cada elo. Vire a imagem de cabeça para baixo e cada força se inverte junto: os puxões viram empurrões, ao longo da mesma linha, e equilibram os mesmos pesos. Isso é um arco cujas pedras só fazem pressão umas nas outras, sem nada tentando dobrá-las e separá-las.</p>
<p>Robert Hooke percebeu isso nos anos 1670 e, em 1675, publicou a ideia como um enigma, em letras latinas embaralhadas. Depois da morte dele, ela foi lida como <em>ut pendet continuum flexile, sic stabit contiguum rigidum inversum</em>: como pende a linha flexível, assim, viradas, ficam em pé as peças de um arco que se tocam.</p>
<div class="insight-visual">corrente pendurada: pura tração · a mesma forma de cabeça para baixo: pura compressão</div>
<h3>A linha de força</h3>
<p>Todo arco precisa passar o próprio peso, pedra a pedra, até os pés. O empurrão de uma pedra na seguinte pode ser desenhado como uma linha, a linha de força (os engenheiros a chamam de linha de pressões). Ela tem a forma em que uma corrente penderia sob os mesmos pesos, virada. Se dá para desenhar uma linha assim dentro das pedras em cada junta, o arco consegue ficar em pé: é o teorema da segurança de Jacques Heyman (1966), para pedras que não conseguem puxar, não podem ser esmagadas e não escorregam. Onde a linha toca a borda de uma junta, a junta pode se abrir como uma dobradiça; com dobradiças suficientes, o arco se mexe e desaba. A linha dourada é a que fica mais longe das bordas.</p>
<p>Na forma da própria corrente, a linha passa pelo meio de cada pedra, e é por isso que esse arco fica em pé por mais finas que sejam as pedras. Um semicírculo se projeta mais para fora, de cada lado, do que a forma pendurada; então a linha de força dele, que segue uma forma pendurada, corre rente ao topo das pedras no alto do arco e atravessa a borda interna delas a meia altura de cada lado. Com pedras finas, não há espaço para ela. Então quatro juntas se abrem como dobradiças, e as três partes entre elas se dobram e caem. Um semicírculo só fica em pé se as pedras tiverem pelo menos cerca de um décimo do raio de espessura; Milutin Milankovitch calculou o número exato em 1907: 10,75% para um arco contínuo. O arco da sala, de 21 pedras, precisa de 10,67%: pedras de 5,3 cm de espessura, para um arco de 1 m de largura.</p>
<h3>Mude as cargas, mude a forma</h3>
<p>Uma torre num dos lados curva a corrente pendurada, e a corrente virada carrega a torre. Mas ponha a mesma torre num arco feito sem ela, e a linha de força se desloca: uma torre alta o bastante derruba esse arco. Vento, multidões e trânsito também mudam as cargas, e esse é um dos motivos de os arcos de verdade serem mais grossos do que o próprio peso, sozinho, exigiria.</p>
<p>Uma estrada pesada pendurada numa corrente leve puxa a corrente para baixo por igual ao longo da horizontal, não ao longo da corrente, e a corrente vira uma parábola: a forma do cabo de uma ponte pênsil. Virada, ela é uma ponte cujo arco sustenta a estrada. Numa corrente que pende pouco, a parábola e a catenária são difíceis de distinguir; marque a estrada para ver as duas. O Gateway Arch, em St. Louis, é uma catenária de peso variável: as pernas dele são mais grossas na base, então a curva é a forma pendurada de uma corrente com elos mais pesados nas pontas.</p>
<details><summary>A matemática, se você quiser</summary><p>Uma corrente com o mesmo peso em todo o comprimento pende como uma catenária, y = a cosh(x / a), onde a é a tração horizontal dividida pelo peso por unidade de comprimento. Jacob Bernoulli propôs o problema como desafio, e em junho de 1691 as respostas de Gottfried Leibniz, Christiaan Huygens e Johann Bernoulli foram impressas juntas na Acta Eruditorum. Antes, em 1638, Galileu tinha escrito que uma corrente pendurada fica perto de uma parábola; Joachim Jungius provou que ela não é uma parábola, em trabalho publicado em 1669. Já uma carga espalhada por igual ao longo da horizontal dá y = kx², uma parábola.</p>
<p>A corrente da sala tem 41 contas em 42 elos. A forma de repouso dela é calculada exatamente, pelo método de Newton aplicado aos puxões num dos pinos, e a corrente em movimento (passos de Verlet, cada elo puxado de volta ao seu comprimento) se acomoda nessa forma. Cada pedra do arco virado tem dois elos de comprimento, com o próprio peso no seu centro de massa. Uma linha de força é definida por três números: o empurrão horizontal, e onde e com que inclinação ela sai da primeira junta; a sala procura a que fica mais longe das bordas das pedras. Quando nenhuma cabe, ela testa cada escolha de quatro juntas e cantos como dobradiças, fica com aquelas em que todas as dobradiças se abrem e os pesos descem, e deixa a queda mais rápida acontecer como um mecanismo articulado de três peças, até uma pedra tocar o chão.</p>
<p>Os testes da sala conferem, contra um cálculo separado, que a corrente em repouso difere de uma catenária em menos de 0,02% do vão, que o arco da corrente fica em pé com pedras de 1 cm de espessura, e que o semicírculo precisa de 5,3 cm e o arco ogival de 3,5 cm. Eles também conferem que as duas maneiras que a sala tem de perguntar, se uma linha de força cabe e se quatro dobradiças podem cair, sempre concordam.</p></details>
<h3>O que a sala deixa de fora</h3>
<p>As pedras são perfeitamente rígidas e nunca escorregam, o chão e os pinos nunca se mexem, e o arco não tem enchimento por cima. Pedras de verdade são seguras pelo atrito, argamassa de verdade consegue puxar um pouco, e pés de verdade podem se abrir, o que derruba arcos que, de outro modo, ficariam em pé. A queda é uma caricatura de um desabamento real: ela segue o primeiro movimento das pedras e para quando uma delas toca o chão.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Catenária (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary_arch" target="_blank" rel="noopener">Arco catenário (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Line_of_thrust" target="_blank" rel="noopener">Linha de pressões (Wikipedia, em inglês)</a><a class="source-link" href="https://www.gf.uns.ac.rs/~zbornik/doc/NS2016.018.pdf" target="_blank" rel="noopener">Nikolić, a teoria da linha de pressões de Milankovitch (2016, em inglês)</a><a class="source-link" href="https://talks.cam.ac.uk/talk/index/47582/" target="_blank" rel="noopener">Makris, a espessura mínima dos arcos semicirculares (2013, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Col%C3%B2nia_G%C3%BCell" target="_blank" rel="noopener">Colònia Güell (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gateway_Arch" target="_blank" rel="noopener">Gateway Arch (Wikipedia, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Hooke/" target="_blank" rel="noopener">Robert Hooke (MacTutor, em inglês)</a></div>`,
  },
});
