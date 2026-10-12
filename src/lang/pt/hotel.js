/* O hotel sempre lotado · palavras para o visitante (pt). */
Wonderlattice.defineText('hotel', 'pt', {
  eyebrow: 'INFINITO',
  name: 'O hotel sempre lotado',
  tagline:
    'Todos os quartos estão ocupados, mas ainda cabe mais um hóspede, e depois infinitos. Até que chega um ônibus que nunca vai caber.',
  title: 'O hotel sempre lotado.',
  subtitle:
    'Todos os quartos de um hotel sem fim estão ocupados, e mesmo assim veja como ele acomoda mais um hóspede, e depois um ônibus de infinitos passageiros. Então experimente o ônibus de cara ou coroa.',
  field: 'Infinito · Formar pares · O argumento diagonal de Cantor',
  sceneLabel: 'Quartos 1, 2, 3, … sem fim',
  sceneNames: ['Mais um hóspede', 'Um ônibus sem fim', 'Infinitos ônibus', 'O ônibus de cara ou coroa'],
  tip: 'Escolha um cartão de mudança no painel · No ônibus de cara ou coroa, toque num lance para mudá-lo (as setas miram, Enter vira)',
  actionLabel: 'Próxima chegada',
  canvasLabel:
    'O corredor de um hotel sem fim, com portas numeradas que diminuem ao longe, todos os quartos ocupados. Chegam novos hóspedes, e todos os hóspedes mudam de quarto ao mesmo tempo para liberar quartos para eles. No ônibus de cara ou coroa, uma lista de passageiros, um por quarto, e um novo passageiro construído a partir da diagonal dela. Toque num lance para mudá-lo, ou use as setas para mirar e Enter para virar.',
  panelEyebrow: 'Cartões de mudança',
  whyLabel: 'Como um hotel lotado pode receber mais hóspedes?',
  nudge:
    'Depois do ônibus sem fim, aperte “Próxima chegada”: infinitos ônibus, e depois um ônibus cujos passageiros nenhuma lista de quartos consegue acomodar.',
  connection: {
    html: '<strong>Impossível, faça o que fizer.</strong> Aqui, nenhuma lista de quartos acomoda todos os passageiros de cara ou coroa. Em “O piso impossível”, uma coloração prova que nenhum ladrilhamento consegue cobrir o tabuleiro.',
    label: 'Visitar “O piso impossível”',
  },

  presets: [
    { name: 'Mais um hóspede', note: 'O hotel está lotado. Um hóspede bate à porta.' },
    { name: 'Infinitos ônibus', note: 'Uma infinidade deles, todos lotados.' },
    { name: 'O ônibus de cara ou coroa', note: 'O ônibus que não cabe.' },
  ],

  // The moving cards: the big face, and what it tells the guest in room n.
  cards: {
    one: { face: '+1', rule: 'quarto n → quarto n + 1' },
    five: { face: '+5', rule: 'quarto n → quarto n + 5' },
    double: { face: '×2', rule: 'quarto n → quarto 2n' },
    zigzag: { face: 'Zigue-zague', rule: 'percorra os assentos indo e voltando' },
    admit: { face: '+1', rule: 'acomode o novo passageiro no quarto 1' },
    shuffle: { face: '↻', rule: 'uma nova lista: cada quarto ganha novos lances' },
  },
  pick: 'Escolha um cartão. Todos os hóspedes mudam de quarto ao mesmo tempo.',
  everyone: (face) => `Todos ${face}`,

  // Drawn on the picture.
  full: 'SEM VAGAS',
  vacant: 'HÁ VAGAS',
  guest: 'Novo hóspede',
  coach: 'Ônibus sem fim',
  queue: 'Passageiros 1, 2, 3, …',
  hotelRow: 'Hotel',
  coachRow: (n) => `Ônibus ${n}`,
  seat: 'Assentos 1, 2, 3, …',
  rooms: 'Quartos 1, 2, 3, …',
  room: (n) => `Quarto ${n}`,
  heads: 'C',
  tails: 'K',
  flips: 'Lances 1, 2, 3, …',
  passenger: 'Novo passageiro',
  question: '“Qual quarto é meu?”',

  listHint:
    'Toque em qualquer lance na imagem para mudá-lo. A diagonal também muda, e o passageiro dela continua de fora.',
  status: {
    waiting: [
      'Um novo hóspede bate à porta. Todos os quartos estão ocupados.',
      'Chega um ônibus sem fim.',
      'Chegam infinitos ônibus.',
    ],
    one: ['O quarto 1 ficou livre. Continua sem vagas.', 'O passageiro 1 entrou. Os passageiros 2, 3, 4, … esperam.'],
    five: ['O hóspede entrou, e os quartos 2 a 5 estão vazios.', 'Os passageiros 1 a 5 entraram. 6, 7, 8, … esperam.'],
    double: [
      'O hóspede entrou, e os quartos ímpares estão vazios.',
      'O passageiro n fica com o quarto 2n − 1. Continua sem vagas.',
      'O ônibus 1 entrou. Os ônibus 2, 3, 4, … esperam.',
    ],
    zigzag: 'Cada assento de cada ônibus tem um quarto.',
    tracing: (room, row, seat) =>
      row === 0 ? `Quarto ${room}: o hóspede do quarto ${seat}` : `Quarto ${room}: ônibus ${row}, assento ${seat}`,
    building: (k) => `Lance ${k}: o oposto do lance ${k} do quarto ${k}`,
    built: 'Nenhum quarto é dele: ele difere do quarto k no lance k.',
    admitted: 'Acomodado no quarto 1, mas a nova diagonal deixa alguém de fora.',
    edited: 'Uma nova diagonal, e alguém continua de fora.',
    shuffled: 'Uma nova lista, e alguém continua de fora.',
  },

  guests: [
    {
      name: 'David Hilbert',
      note: 'Numa aula, em 1924, falei de um hotel com infinitos quartos, todos ocupados, que ainda assim pode receber um recém-chegado. Um infinito completo não se comporta como nada que seja finito.',
    },
    {
      name: 'Georg Cantor',
      note: 'Em 1891, mostrei que as sequências sem fim de dois símbolos não podem ser todas listadas: mude o primeiro símbolo da primeira sequência, o segundo da segunda, e assim por diante, e você terá uma que a lista deixou de fora.',
    },
    {
      name: 'George Gamow',
      note: 'No meu livro de 1947, One Two Three… Infinity, recontei o hotel de Hilbert para todo mundo. Foi assim que a maioria das pessoas ouviu falar dele pela primeira vez.',
    },
  ],

  insight: {
    title: 'Como um hotel lotado pode receber mais hóspedes?',
    html: `<p>“Infinitos” não é um número até o qual se possa contar, então o hotel não consegue comparar tamanhos contando. O que ele consegue é formar pares. Duas coleções têm o <em>mesmo tamanho</em> quando dá para formar pares exatos entre elas, um com um, sem sobrar ninguém. Os hóspedes e os quartos formam pares: todos os quartos estão ocupados.</p>
<div class="insight-visual">+1: quarto n → quarto n + 1 · ×2: quarto n → quarto 2n · dois hóspedes nunca dividem um quarto</div>
<h3>Lugar para um ônibus</h3>
<p>“Todos +1” é um novo emparelhamento: os hóspedes antigos com os quartos 2, 3, 4, …, o que deixa o quarto 1 para o recém-chegado. “Todos ×2” manda os hóspedes antigos para os quartos pares e deixa livres todos os quartos ímpares, então cabe um ônibus sem fim inteiro: o passageiro n fica com o quarto 2n − 1. Os números pares são tantos quanto todos os números inteiros. Uma parte tão grande quanto o todo é exatamente o que torna uma coleção infinita. Aqui não se está calculando nenhuma soma como “infinito mais um”; cada passo é um emparelhamento.</p>
<h3>Infinitos ônibus</h3>
<p>Escreva os ônibus como linhas e os assentos deles como colunas. Um zigue-zague pelas diagonais curtas, indo e voltando a partir do canto, chega a cada assento de cada ônibus depois de um número finito de passos, então cada um ganha um quarto só seu (este é o emparelhamento de Cantor). O mesmo zigue-zague lista todas as frações. Qualquer coleção que possa ser listada assim é chamada de <em>enumerável</em>.</p>
<h3>O ônibus que não cabe</h3>
<p>Cada passageiro do último ônibus tem como nome uma sequência sem fim de lances de cara ou coroa. Tente dar quartos a eles: o quarto 1 recebe uma sequência, o quarto 2 outra, e assim por diante. Agora construa um passageiro cujo primeiro lance é o oposto do primeiro lance do quarto 1, cujo segundo é o oposto do segundo do quarto 2, e assim por diante, descendo pela diagonal. Esse passageiro difere do hóspede do quarto k no lance k, para todo k, então não tem quarto. Isso funciona para qualquer lista, por mais esperta que seja. Então há mais sequências sem fim de cara ou coroa do que quartos: um infinito maior. Esse é o argumento diagonal de Cantor, de 1891. Leia cara como 1 e coroa como 0, e cada sequência é um número entre 0 e 1 em binário; o mesmo argumento (com um pouco de cuidado, já que 0,0111… e 0,1000… são o mesmo número) mostra que os números reais também não podem ser listados.</p>
<h3>O que a imagem deixa de fora</h3>
<p>Ela mostra algumas dezenas de portas e um canto 8 × 8 da lista, mas o argumento trata de todos os quartos e de todos os lances de uma vez: o lance 100 do novo passageiro é o oposto do lance 100 do quarto 100, muito além da imagem. Nenhum hotel de verdade conseguiria mudar infinitos hóspedes de quarto num só passo; a matemática consegue, porque uma regra como “quarto n → quarto 2n” diz para onde todos vão ao mesmo tempo.</p>
<h3>De onde vem a história</h3>
<p>David Hilbert contou a história do hotel numa aula em janeiro de 1924; as anotações dele ficaram inéditas por décadas. O livro <em>One Two Three… Infinity</em> (1947), de George Gamow, a tornou famosa, como reconstitui Helge Kragh. O argumento diagonal de Georg Cantor apareceu em 1891, embora não tenha sido a primeira prova dele de que os números reais não podem ser listados: essa, de 1874, usava outro argumento.</p>
<div class="sources"><a class="source-link" href="https://arxiv.org/abs/1403.0059" target="_blank" rel="noopener">Kragh (2014), The true (?) story of Hilbert’s infinite hotel (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Hilbert%27s_paradox_of_the_Grand_Hotel" target="_blank" rel="noopener">Paradoxo do Grande Hotel de Hilbert (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument" target="_blank" rel="noopener">Argumento diagonal de Cantor (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Pairing_function" target="_blank" rel="noopener">Funções de emparelhamento (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/" target="_blank" rel="noopener">MacTutor: Georg Cantor (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/One_Two_Three..._Infinity" target="_blank" rel="noopener">Gamow, One Two Three… Infinity (1947, em inglês)</a></div>`,
  },
});
