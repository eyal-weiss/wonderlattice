/* Two losing games that win · visitor-facing words (pt). */
Wonderlattice.defineText('parrondo', 'pt', {
  eyebrow: 'ACASO',
  name: 'Dois jogos perdedores que ganham',
  tagline: 'Cada jogo de moeda vai secando o seu dinheiro. Misture os dois, e o dinheiro sobe.',
  title: 'Dois jogos perdedores que ganham.',
  subtitle: 'O jogo A perde. O jogo B perde. Veja mil jogadores tentarem cada um, e outros mil misturarem os dois.',
  field: 'Probabilidade · Cadeias de Markov · Um paradoxo',
  sceneLabel: '1.000 jogadores por jogo · 1.000 rodadas',
  sceneNames: ['Só A', 'Só B', 'A ou B ao acaso'],
  raceName: 'A, B e a mistura, lado a lado',
  patternName: (pattern) => `A sequência ${pattern}`,
  tip: 'As linhas grossas são o jogador médio; as tracejadas, o valor esperado exato · Sozinho, um jogo também mostra uma faixa com a metade central dos jogadores · Escolha um jogo no painel',
  actionLabel: 'Novos jogadores',
  canvasLabel:
    'Um gráfico dos ganhos ao longo de 1.000 rodadas. No início, três grupos de 1.000 jogadores jogam A, B e A ou B ao acaso lado a lado: as linhas grossas são os ganhos médios, as tracejadas os ganhos esperados exatos. Um jogo jogado sozinho também mostra uma faixa sombreada com a metade central dos jogadores, e as linhas dos jogos já testados continuam visíveis, bem fracas. Com os baldes à vista, três barras mostram a parte dos jogadores cujas moedas são um múltiplo de 3, um a mais ou dois a mais.',
  panelEyebrow: 'Escolha um jogo',
  whyLabel: 'Como dois perdedores podem ganhar?',
  nudge:
    'Observe as três linhas: A e B afundam enquanto a mistura sobe. Depois jogue cada jogo sozinho e monte as suas próprias sequências: muitas ganham, mas algumas, como A B, ainda perdem.',
  connection: {
    html: '<strong>Parece justo, e é cheio de surpresas.</strong> Aqui, dois jogos perdedores ganham juntos. Em Os dados que vencem uns aos outros, cada dado tem outro que o vence.',
    label: 'Jogue os dados estranhos',
  },

  presets: [
    { name: 'Só B', note: 'Uma moeda ruim em cada múltiplo de 3.', badge: 'B' },
    { name: 'A ou B ao acaso', note: 'Dois perdedores fazem um vencedor.', badge: 'A|B' },
    { name: 'A A B B', note: 'Um ritmo fixo também ganha.', badge: 'AABB' },
  ],

  rules: {
    title: 'Os dois jogos',
    aHtml: '<strong>A</strong> · uma moeda que ganha 49,5% das vezes.',
    bHtml:
      '<strong>B</strong> · se as suas moedas forem um múltiplo de 3, uma moeda ruim que ganha 9,5%; senão, uma boa que ganha 74,5%.',
    stakes: 'Cada vitória vale uma moeda a mais, cada derrota uma a menos. Todo mundo começa com 0.',
  },

  // The games' names, as letters (the model always calls them A and B).
  letters: ['A', 'B'],
  modeLabel: 'Que jogo eles jogam?',
  // By mode number; the race (4) is shown first.
  modes: ['Só A', 'Só B', 'Misturar ao acaso', 'Minha sequência', 'Os três ao mesmo tempo'],

  patternLabel: 'Monte a sua própria sequência',
  patternHint: 'Ela se repete, rodada após rodada, para cada jogador. Até 12 letras.',
  add: (game) => `Adicionar ${game}`,
  undo: 'Desfazer',
  undoLabel: 'Tirar a última letra',

  buckets: 'Por quê? Mostrar os três baldes',

  readout: {
    expected: (rounds) => `Esperado após ${rounds} rodadas`,
    perRound: (value) => `${value} por rodada, a longo prazo`,
    average: (players, value) => `Média de ${players} jogadores até agora: ${value}`,
    games: ['Só A', 'Só B', 'A ou B ao acaso'],
    averages: (players, a, b, mix) =>
      `Médias de ${players} jogadores cada, até agora: A ${a} · B ${b} · mistura ${mix}`,
    perRounds: (a, b, mix) => `A longo prazo, por rodada: A ${a} · B ${b} · mistura ${mix}`,
    badShareRace: (live, alone, mixed, line) =>
      `Rodadas de B jogadas num múltiplo de 3: ${alone} quando B joga sozinho, ${mixed} na mistura (${live} até agora). B só compensa abaixo de ${line}.`,
    badShare: (live, exact, line) =>
      `Rodadas de B jogadas num múltiplo de 3: ${live} até agora, ${exact} a longo prazo. B só compensa abaixo de ${line}.`,
    noB: 'Só A nunca joga B, então os baldes simplesmente se equilibram em um terço cada.',
  },

  status: {
    round: (t, rounds) => `Rodada ${t} de ${rounds}`,
    done: (rounds) => `${rounds} rodadas jogadas`,
  },
  announce: {
    done: (game, average, expected) =>
      `${game}: o jogador médio termina com ${average} moedas; o esperado é ${expected}.`,
    race: (a, b, mix) =>
      `Depois de 1.000 rodadas, o jogador médio tem ${a} moedas com A, ${b} com B e ${mix} com a mistura.`,
  },

  // Words drawn on the picture.
  labels: {
    rounds: 'rodadas',
    start: 'início',
    expected: (value) => `esperado ${value}`,
    // A game's name and its average, where the race's lines end; languages may reorder them.
    tag: (name, value) => `${name} ${value}`,
    average: (value) => `média ${value}`,
    short: ['A', 'B', 'mistura'],
    buckets: 'Jogadores pelo resto das moedas divididas em grupos de três',
    bucketsMix: 'Jogadores da mistura, pelo resto das moedas divididas em grupos de três',
    bucket: ['múltiplo de 3', 'um a mais', 'dois a mais'],
    coin: ['moeda ruim de B', 'moeda boa de B', 'moeda boa de B'],
    breakEven: 'B empata',
  },

  guests: [
    {
      name: 'Juan Parrondo',
      note: 'Ele criou estes jogos em 1996, como uma versão com moedas de uma catraca que faz partículas agitadas andarem num só sentido.',
    },
    {
      name: 'Richard Feynman',
      note: 'Nas minhas aulas, uma catraca minúscula num gás quente não consegue girar num só sentido de graça: a lingueta treme tanto quanto a roda.',
    },
  ],

  insight: {
    title: 'Como dois perdedores podem ganhar?',
    html: `<p>O jogo A é quase uma moeda justa: perde cerca de uma moeda a cada 100 rodadas. O jogo B é mais estranho, porque olha para as suas moedas. Quando elas são um múltiplo de 3 (…, −3, 0, 3, 6, …), ele usa uma moeda ruim; senão, uma boa. Num múltiplo de 3 você costuma perder uma moeda, e dali a moeda boa costuma levar você de volta direto ao múltiplo de 3. Assim, B fica mandando os jogadores de volta para a sua moeda ruim: cerca de 38,4% das suas rodadas são jogadas ali, um pouco acima dos 37,7% em que B empataria. B perde, devagar.</p>
<div class="insight-visual">B sozinho: 38,4% das rodadas na moeda ruim → perde · Misturado com A: 34,5% → B ganha mais do que A perde</div>
<h3>Misturar solta os jogadores</h3>
<p>A não liga para quanto você tem, então uma rodada de A empurra as suas moedas para cima ou para baixo ao acaso e quebra o ritmo de B. Misturado, ele faz as rodadas de B caírem num múltiplo de 3 só cerca de 34,5% das vezes. Agora a moeda boa de B é usada mais do que B sozinho permite, e B ganha mais do que A perde. A longo prazo, por rodada: A perde 0,010 moeda, B perde 0,0087, e escolher A ou B ao acaso ganha 0,0157. Ligue os baldes para ver a parte dos jogadores num múltiplo de 3 descer abaixo da linha de empate de B.</p>
<h3>Nem toda mistura ganha</h3>
<p>A A B B ganha e A B B ganha com folga, mas A B, alternados rigorosamente, ainda perde. Experimente algumas sequências e observe o número a longo prazo.</p>
<h3>O que isto não quer dizer</h3>
<p>B não é um jogo perdedor comum: as suas chances dependem do seu capital, e essa dependência é todo o truque. Os jogos de cassino não olham para o quanto você tem, então misturá-los não transforma perda em ganho; isto não é um jeito de vencer um cassino. Há quem sugira efeitos parecidos com o de Parrondo na biologia e nas finanças, mas essas ideias são discutidas, e esta sala as deixa de fora. Os jogadores aqui são uma simulação, então a média deles oscila, cerca de uma moeda depois de 1.000 rodadas; a linha tracejada é o valor esperado exato, calculado e não simulado.</p>
<details><summary>A matemática, se você quiser</summary><p>Só importam as suas moedas módulo 3, então cada jogo é uma cadeia de Markov com três estados. O jogo A ganha com chance ½ − ε, e B com chance 1/10 − ε no estado 0 e ¾ − ε nos estados 1 e 2, com ε = 0,005. A distribuição estacionária de B é cerca de (0,3836; 0,1543; 0,4621); com ε = 0 ela é exatamente (5/13; 2/13; 6/13), e B é exatamente justo. O ganho esperado por rodada é Σ πᵢ (2pᵢ − 1). Escolher A ou B ao acaso é uma única cadeia com as chances dos dois jogos em média; uma sequência que se repete, como A A B B, é o produto das matrizes das suas rodadas. Juan Parrondo criou os jogos em 1996, como uma versão discreta de uma “catraca browniana intermitente”, parente da catraca com lingueta do capítulo 46 do Volume I de The Feynman Lectures on Physics. G. P. Harmer e D. Abbott, “Losing strategies can win by Parrondo’s paradox”, Nature 402, 864 (1999). P. Amengual, P. Meurs, B. Cleuren e R. Toral, “Reversals of chance in paradoxical games”, Physica A (2006).</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/47220" target="_blank" rel="noopener">Harmer e Abbott, Nature (1999, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parrondo%27s_paradox" target="_blank" rel="noopener">Paradoxo de Parrondo (em inglês)</a><a class="source-link" href="https://arxiv.org/abs/math/0601404" target="_blank" rel="noopener">Reversals of chance in paradoxical games (em inglês)</a></div>`,
  },
});
