Wonderlattice.defineText('floor', 'pt', {
  eyebrow: 'INVARIANTES',
  name: 'O piso impossível',
  tagline: 'Faltam dois cantos e não há como ladrilhar o piso. Uma olhada nas cores prova isso.',
  title: 'O piso impossível.',
  subtitle:
    'Cubra o piso com peças de dominó, duas casas cada uma. Depois descubra por que alguns pisos nunca podem ser terminados.',
  field: 'Quebra-cabeças · Invariantes · Prova com cores',
  sceneLabel: 'Oito por oito · Dominó · Um padrão escondido',
  tip: 'Toque em duas casas vizinhas para colocar uma peça, ou arraste por cima delas · As setas movem, Enter toca',
  actionLabel: 'Olhe as cores',
  canvasLabel:
    'Um piso de oito por oito casas, com algumas removidas, para ser coberto com peças de dominó que cobrem cada uma duas casas vizinhas.',
  panelEyebrow: 'Tente terminar o piso',
  whyLabel: 'Por que não dá?',
  nudge: 'Tente cobrir o piso sem os dois cantos. Quando empacar, toque em “Olhe as cores” e conte.',
  connection: {
    html: '<strong>Uma regra simples decide tudo.</strong> Aqui cada peça cobre uma casa clara e uma escura; no sudoku cada linha tem cada símbolo uma vez só.',
    label: 'Ver o sudoku como uma rede',
  },

  presets: [
    { name: 'Sem dois cantos', note: 'Cantos opostos de um tabuleiro de xadrez.' },
    { name: 'Uma de cada cor', note: 'Sempre dá. Por quê?' },
    { name: 'Equilibrado mas travado', note: 'A conta fecha, e mesmo assim…' },
    { name: 'Um piso inteiro', note: 'Remova as casas que quiser.' },
  ],

  modeLabel: 'O que um toque faz',
  modes: ['Colocar peças', 'Remover casas'],
  colours: 'Mostrar as cores',
  solve: 'Mostrar um ladrilhamento',
  clearDominoes: 'Tirar todas as peças',
  yourFloor: 'O seu próprio piso',
  byColour: 'Restam, por cor',
  squaresLeft: 'Casas livres',
  dominoes: 'Peças colocadas',
  light: 'claras',
  dark: 'escuras',
  countLine: (light, dark) => `${light} claras · ${dark} escuras`,
  status: (laid, left) => (left ? `${laid} colocadas · restam ${left} casas` : `Coberto com ${laid} peças`),

  verdict: {
    start: 'Coloque peças no piso, ou toque em “Mostrar um ladrilhamento”.',
    covered: (n) => `Coberto: ${n} peças, todas as casas usadas.`,
    tiled: (n) => `Aqui está um jeito: ${n} peças cobrem o piso inteiro.`,
    fresh: 'As suas peças estavam atrapalhando, então aqui está um ladrilhamento do começo.',
    colours: (light, dark) =>
      `Impossível: restam ${light} casas claras e ${dark} escuras, e cada peça cobre uma de cada cor.`,
    stuck: (n) =>
      n === 1
        ? 'Impossível, mesmo com as cores equilibradas: uma casa não tem nenhuma vizinha livre para dividir uma peça.'
        : n
          ? `Impossível, mesmo com as cores equilibradas: um pedaço de ${n} casas ficou isolado, e as cores dele não se equilibram.`
          : 'Impossível, mesmo com as cores equilibradas: não dá para formar par entre cada casa e uma vizinha.',
    oddSquares: 'Um número ímpar de casas nunca pode ser coberto por peças de dominó.',
  },

  squareLabel: (row, col, what) => `Linha ${row}, coluna ${col}: ${what}`,
  what: { free: 'livre', hole: 'removida', domino: 'coberta por uma peça' },

  guests: [
    {
      name: 'Martin Gardner',
      note: 'Ele levou este quebra-cabeça a milhões de leitores, e as cores foram a virada que ninguém esperava.',
    },
    {
      name: 'Ralph Gomory',
      note: 'Ele mostrou que remover uma casa clara e uma escura sempre deixa um piso que dá para ladrilhar.',
    },
  ],

  insight: {
    title: 'Por que não dá para ladrilhar o piso?',
    html: `<p>Pinte o piso como um tabuleiro de xadrez. Cada peça, onde quer que você a coloque, cobre duas casas vizinhas, e casas vizinhas sempre têm cores diferentes. Então cada peça cobre exatamente uma casa clara e uma escura, e um piso terminado precisa ter tantas casas claras quanto escuras.</p>
<div class="insight-visual">uma peça = uma clara + uma escura</div>
<p>Os cantos opostos de um tabuleiro de xadrez têm a mesma cor. Tire os dois e sobram 30 casas claras contra 32 escuras: nenhum arranjo de peças pode dar certo, e sabemos disso sem testar nenhum. Uma propriedade que nunca muda, como “claras menos escuras” nas casas que um conjunto de peças cobre, se chama <em>invariante</em>. Os invariantes são um dos jeitos favoritos da matemática de provar que algo é impossível.</p>
<h3>Uma de cada cor: sempre dá</h3>
<p>Ralph Gomory mostrou que, se você tirar uma casa clara e uma escura de um tabuleiro completo, o resto sempre pode ser ladrilhado. Desenhe um caminho fechado que passe uma vez por cada casa, como uma cobra dobrada sobre o tabuleiro. Tirar duas casas de cores diferentes corta o caminho em pedaços de comprimento par, e cada pedaço pode ser coberto com peças ao longo do caminho.</p>
<h3>Estar equilibrado não basta</h3>
<p>Ter tantas casas claras quanto escuras é <em>necessário</em>, mas não <em>suficiente</em>. Isole uma casa do canto tirando as duas vizinhas dela, e ela nunca mais poderá ser coberta, mesmo que a conta continue equilibrada. Decidir se um piso qualquer pode ser ladrilhado é formar pares entre cada casa clara e uma vizinha escura, e isso é um problema de emparelhamento. “Mostrar um ladrilhamento” resolve isso testando pares e consertando quando eles se chocam.</p>
<details><summary>A matemática, se você quiser</summary><p>Pense nas casas livres como uma rede em que as vizinhas estão ligadas. Cada ligação une uma casa clara a uma escura, então a rede é <em>bipartida</em>, e um ladrilhamento é um <em>emparelhamento perfeito</em>: um conjunto de ligações que usa cada casa exatamente uma vez. A sala encontra um com caminhos aumentantes (o algoritmo de Kuhn) e, quando não existe, procura um pedaço conectado cujas cores não se equilibram. O quebra-cabeça foi proposto por Max Black em 1946 e ficou famoso com Martin Gardner na <em>Scientific American</em>; o teorema de Gomory é a resposta clássica para a versão em que se tira uma casa de cada cor.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Mutilated_chessboard_problem" target="_blank" rel="noopener">O problema do tabuleiro mutilado, com o teorema de Gomory (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Domino_tiling" target="_blank" rel="noopener">Ladrilhamentos com dominó (em inglês)</a></div>`,
  },
});
