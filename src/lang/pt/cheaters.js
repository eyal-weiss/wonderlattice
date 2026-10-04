/* Kaleidoscope of cheaters · visitor-facing words (pt). */
Wonderlattice.defineText('cheaters', 'pt', {
  eyebrow: 'COOPERAÇÃO',
  name: 'Caleidoscópio de trapaceiros',
  tagline: 'Um trapaceiro entre cooperadores, uma regra simples e um tapete de guerra e paz que não para de mudar.',
  title: 'Caleidoscópio de trapaceiros.',
  subtitle:
    'Trapacear sempre rende mais. Mesmo assim, quando todo mundo copia o vizinho mais bem-sucedido, um único trapaceiro vira um caleidoscópio, e os cooperadores nunca desaparecem.',
  field: 'Teoria dos jogos · O dilema do prisioneiro · Autômatos celulares',
  sceneLabel: '99 × 99 jogadores · Copiar o melhor',
  sceneNames: ['Um trapaceiro', 'Uma multidão mista', 'Mudando um de cada vez'],
  mixed: 'A sua própria grade',
  tip: 'Toque numa célula para ela trapacear, ou voltar a cooperar · As setas miram, Enter muda',
  actionLabel: 'Soltar um trapaceiro ao acaso',
  canvasLabel:
    'Uma grade de jogadores: cooperadores em azul, trapaceiros em vermelho, e amarelo e verde para quem acabou de mudar. Toque numa célula para mudá-la, ou use as setas para mirar e Enter para mudar.',
  panelEyebrow: 'Copiar o melhor',
  whyLabel: 'Por que os trapaceiros não vencem?',
  nudge:
    'Aperte “Soltar um trapaceiro ao acaso”, ou toque numa célula longe do meio: a simetria perfeita se quebra. Depois desmarque “Todos mudam ao mesmo tempo”.',
  connection: {
    html: '<strong>Copie os vizinhos.</strong> Aqui, jogadores que copiam o mais bem-sucedido por perto tecem um tapete. Em “Uma mente de muitos”, pássaros que seguem alguns vizinhos se movem como um só bando.',
    label: 'Visitar “Uma mente de muitos”',
  },

  presets: [
    { name: 'Um trapaceiro', note: 'Um único trapaceiro no meio.' },
    { name: 'Uma multidão mista', note: 'Um jogador em cada dez começa trapaceando.' },
    { name: 'Um de cada vez', note: 'Os jogadores mudam um após o outro, não juntos.' },
  ],

  temptation: 'Tentação',
  temptationHint: 'O quanto um trapaceiro ganha com cada cooperador que encontra. Dois cooperadores ganham 1 cada.',
  window: 'O caleidoscópio vive entre 1,8 e 2.',
  speed: 'Velocidade',
  perSecond: (n) => (n === 1 ? '1 geração por segundo' : `${n} gerações por segundo`),
  together: 'Todos mudam ao mesmo tempo',
  fresh: 'Colorir quem acabou de mudar',
  next: 'Próxima geração',

  key: {
    title: 'QUEM É QUEM',
    cooperator: 'Coopera',
    cheater: 'Trapaceia',
    newCooperator: 'Começou a cooperar',
    newCheater: 'Começou a trapacear',
  },
  chart: {
    title: 'PARTE QUE COOPERA',
    estimate: 'Nowak e May: 31,8%',
    span: (n) => (n === 1 ? 'a última geração' : `as últimas ${n} gerações`),
  },

  inspect: {
    title: 'O QUE UM JOGADOR FARÁ',
    hint: 'Aponte para um jogador, ou mire com as setas, para ver as pontuações em volta dele.',
    player: (cheats, score) =>
      cheats
        ? `Este jogador trapaceia e fez ${score} ${score === '1' ? 'ponto' : 'pontos'}.`
        : `Este jogador coopera e fez ${score} ${score === '1' ? 'ponto' : 'pontos'}.`,
    best: (cheats, score) =>
      cheats
        ? `A melhor pontuação em volta dele, contando a dele, é de um trapaceiro: ${score}.`
        : `A melhor pontuação em volta dele, contando a dele, é de um cooperador: ${score}.`,
    tie: (score) =>
      `Um cooperador e um trapaceiro dividem a melhor pontuação, ${score}, então ele mantém a sua estratégia.`,
    next: (cheats) =>
      cheats ? 'Então, na próxima geração, ele trapaceia.' : 'Então, na próxima geração, ele coopera.',
  },

  status: (gen, percent) => `Geração ${gen} · ${percent}% cooperam`,
  settled: (gen, percent) => `Estabilizou de vez na geração ${gen} · ${percent}% cooperam`,
  repeating: (period, percent) => `Repete a cada ${period} gerações · ${percent}% cooperam`,
  allCheat: (gen) => `Geração ${gen} · todos os jogadores trapaceiam`,
  allCooperate: (gen) => `Geração ${gen} · todos os jogadores cooperam`,
  stray: 'Um trapaceiro aparece ao acaso.',

  guests: [
    {
      name: 'Robert May',
      note: 'Com Martin Nowak, em 1992, deixei jogadores numa grade copiarem os vizinhos mais bem-sucedidos. Os cooperadores sobreviveram, em padrões que não paravam de mudar, sem nenhuma memória e sem nenhuma esperteza.',
    },
    {
      name: 'Martin Nowak',
      note: 'Com Robert May, ele encontrou o caleidoscópio desta sala. Ele estuda como a cooperação evolui, das células às sociedades.',
    },
    {
      name: 'Albert Tucker',
      note: 'Em 1950, explicando a psicólogos de Stanford um jogo vindo da RAND Corporation, eu o contei como a história de dois prisioneiros. O nome pegou.',
    },
  ],

  insight: {
    title: 'Por que os trapaceiros não vencem?',
    html: `<p>Cada célula é um jogador do <em>dilema do prisioneiro</em>. Quando dois cooperadores se encontram, os dois se dão bem. Um trapaceiro que encontra um cooperador se dá melhor ainda, e o cooperador fica sem nada. Dois trapaceiros ficam sem nada. Faça o outro jogador o que fizer, trapacear rende mais; então, numa multidão em que todo mundo encontra todo mundo, os trapaceiros deveriam tomar conta.</p>
<div class="insight-visual">cooperador + cooperador: 1 cada · trapaceiro + cooperador: a tentação para o trapaceiro, 0 para o cooperador · trapaceiro + trapaceiro: 0 cada</div>
<h3>Vizinhos, não estranhos</h3>
<p>Aqui, cada jogador só encontra os seus oito vizinhos e depois copia quem se saiu melhor por perto, ele mesmo incluído. Ninguém lembra, planeja ou castiga. Um cooperador dentro de um grupo de cooperadores ganha muito, então os grupos se protegem. Um trapaceiro na borda de um grupo ganha mais do que qualquer um e morde um pedaço dele, mas um trapaceiro cercado de trapaceiros não ganha nada. Nenhum dos lados consegue vencer em toda parte.</p>
<h3>O caleidoscópio</h3>
<p>Martin Nowak e Robert May encontraram isto em 1992. Com uma tentação entre 1,8 e 2, um trapaceiro no meio de 99 × 99 cooperadores cresce até formar um padrão que mantém toda a simetria do quadrado a cada passo e não para de mudar. Toda tentação nessa faixa dá exatamente as mesmas imagens. Na maioria dos começos ao acaso, a parcela de cooperadores oscila em torno de um terço: Nowak e May estimaram 12 ln 2 − 8, cerca de 31,8%. Abaixo de 1,8, os trapaceiros ficam em pequenos blocos e linhas finas. Acima de 2, eles se espalham e, a partir de um começo ao acaso, tomam quase tudo.</p>
<h3>Não exatamente para sempre</h3>
<p>Uma grade de 9.801 jogadores só tem uma quantidade finita de padrões, e a regra nunca muda; então, cedo ou tarde, um padrão tem de voltar e, daí em diante, tudo se repete. Em 2022, Te Wu, Feng Fu e Long Wang acompanharam o trapaceiro solitário até isso acontecer: depois de cerca de um bilhão de gerações, o padrão cai num ciclo de quatro passos, com só 96 cooperadores, girando em 16 grupinhos. A cinco gerações por segundo, chegar lá levaria cerca de seis anos e meio.</p>
<h3>O que este modelo deixa de fora</h3>
<p>O caleidoscópio precisa que todos mudem no mesmo instante. Em 1993, Bernardo Huberman e Natalie Glance observaram que jogadores de verdade não têm um relógio comum: quando eles mudam um de cada vez, em ordem aleatória, com essas tentações os trapaceiros tomam conta em umas duzentas gerações. Desmarque “Todos mudam ao mesmo tempo” para ver isso. Nowak, Sebastian Bonhoeffer e May responderam em 1994 que cooperadores e trapaceiros continuam convivendo numa faixa larga de tentações; aqui, experimente um de cada vez com a tentação em 1,6. Estes jogadores também jogam cada partida uma vez só e não lembram de nada, enquanto pessoas e animais lembram, perdoam e escolhem com quem se encontrar. Então a sala mostra um jeito de a cooperação durar: os cooperadores ficarem juntos. Ela não mostra que as pessoas são boazinhas, nem que a trapaça nunca compensa.</p>
<p>Outro jeito é se encontrar de novo, muitas e muitas vezes. Nos torneios de Robert Axelrod com o jogo repetido, por volta de 1980, a estratégia inscrita mais simples, o Tit for Tat (“olho por olho”) de Anatol Rapoport, que coopera primeiro e depois copia a última jogada do outro jogador, venceu as duas rodadas. Isso não faz dela a melhor estratégia: com erros e adversários diferentes, a classificação muda. <em>The Evolution of Trust</em>, de Nicky Case, conta essa história lindamente.</p>
<details><summary>A matemática, se você quiser</summary><p>Cada jogador joga uma vez com cada vizinho e uma vez consigo mesmo (a convenção de Nowak e May). Assim, um cooperador marca o número de cooperadores no seu bloco 3 × 3, ele mesmo incluído (de 0 a 9), e um trapaceiro marca a tentação b vezes o número de cooperadores em volta dele (de 0 a 8). Só importam comparações como 8b contra 9, então o comportamento só muda onde b passa por uma fração como 9/8, 9/5 ou 2. Um trapaceiro sozinho marca 8b, os vizinhos dele 8, e os cooperadores logo depois deles 9; então ele toma os seus oito vizinhos quando b passa de 9/8. As bordas são fixas: um jogador na borda simplesmente tem menos vizinhos. Quando o melhor cooperador e o melhor trapaceiro por perto marcam exatamente o mesmo, um jogador aqui mantém a sua estratégia (isso só acontece em algumas tentações exatas, como 1,5 ou 2).</p><p>Com “Todos mudam ao mesmo tempo” desmarcado, cada geração sorteia 9.801 jogadores, um depois do outro (alguns duas vezes, alguns nenhuma); cada um copia quem tem a melhor pontuação em volta dele, do jeito que as coisas estão naquele momento. Os padrões daqui foram conferidos com um programa independente, célula por célula, nas primeiras 300 gerações.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1038/359826a0" target="_blank" rel="noopener">Nowak e May (1992), Evolutionary games and spatial chaos (em inglês)</a><a class="source-link" href="https://math.libretexts.org/Bookshelves/Applied_Mathematics/Agent-Based_Evolutionary_Game_Dynamics_(Izquierdo_Izquierdo_and_Sandholm)/03:_Spatial_interactions_on_a_grid/3.01:_Spatial_chaos_in_the_Prisoner's_Dilemma" target="_blank" rel="noopener">Izquierdo, Izquierdo e Sandholm, Spatial chaos in the Prisoner’s Dilemma (em inglês)</a><a class="source-link" href="https://arxiv.org/abs/chao-dyn/9307017" target="_blank" rel="noopener">Huberman e Glance (1993), Evolutionary games and computer simulations (em inglês)</a><a class="source-link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC43892/" target="_blank" rel="noopener">Nowak, Bonhoeffer e May (1994), Spatial games and the maintenance of cooperation (em inglês)</a><a class="source-link" href="https://arxiv.org/abs/2209.08267" target="_blank" rel="noopener">Wu, Fu e Wang (2022), Evolutionary games and spatial periodicity (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/The_Evolution_of_Cooperation" target="_blank" rel="noopener">The Evolution of Cooperation (Axelrod, em inglês)</a><a class="source-link" href="https://ncase.me/trust/" target="_blank" rel="noopener">Nicky Case, The Evolution of Trust (em inglês)</a></div>`,
  },
});
