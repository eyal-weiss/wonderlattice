Wonderlattice.defineText('tiles', 'pt', {
  eyebrow: 'LADRILHAMENTO',
  name: 'Um ladrilho que enche o mundo',
  tagline: 'Dobre um lado de um ladrilho, o par dele se dobra igual, e o desenho continua cobrindo tudo.',
  title: 'Um ladrilho que enche o mundo.',
  subtitle:
    'Arraste os pontos para dobrar os lados. Seja qual for a forma, as cópias continuam se encaixando sem buracos.',
  field: 'Simetria · Ladrilhamentos · Criaturas',
  sceneLabel: 'Um ladrilho, repetido para sempre',
  sceneName: 'Seu ladrilho',
  tip: 'Arraste os pontos do ladrilho destacado · As setas movem o ponto escolhido, e Enter passa para o próximo',
  actionLabel: 'Inventar uma criatura',
  canvasLabel:
    'Um plano coberto por cópias de um ladrilho. Arraste os pontos do ladrilho destacado para dobrar os lados; os lados pareados acompanham, e todas as cópias mudam junto.',
  panelEyebrow: 'Dê forma ao ladrilho',
  whyLabel: 'Por que sempre encaixa?',
  nudge:
    'Puxe um ponto para fora e olhe o gêmeo dele no lado pareado: a saliência que você faz é exatamente o recorte de que o vizinho precisa.',
  connection: {
    html: '<strong>Poucas regras, repetidas em toda parte.</strong> Aqui, o jeito como os lados formam pares decide todo o desenho. No tear, uma grade minúscula decide todo o tecido.',
    label: 'Visitar “O tear matemático”',
  },
  presets: [
    { name: 'Peixes', note: 'Quadrados que deslizam.' },
    { name: 'Cata-vento', note: 'Quadrados que giram.' },
    { name: 'Pintinhos', note: 'Hexágonos que deslizam.' },
  ],
  rule: 'Como os lados formam pares',
  rules: ['Quadrados que deslizam', 'Quadrados que giram', 'Hexágonos que deslizam', 'Hexágonos que giram'],
  ruleNotes: [
    'Cada lado desliza até o lado oposto.',
    'Quatro ladrilhos giram em volta de um canto.',
    'Cada lado desliza até o lado oposto.',
    'Três ladrilhos giram em volta de um canto.',
  ],
  palette: 'Cores',
  palettes: ['Jardim', 'Mar', 'Crepúsculo', 'Doces'],
  eye: 'Colocar um olho',
  size: 'Tamanho do ladrilho',
  point: (n, total) => `Ponto ${n} de ${total}`,
  changed: 'O ladrilho mudou de forma, e as cópias continuam enchendo o plano.',
  invented: 'Uma criatura nova, e ela continua enchendo o plano.',
  plain: 'De novo um ladrilho simples, de lados retos. Dobre até virar alguma coisa.',
  ruleChanged: (name) => `${name}. As mesmas curvas, pareadas de outro jeito.`,
  guests: [
    {
      name: 'Marjorie Rice',
      note: 'Na mesa da cozinha, nos anos 1970 e sem formação em matemática, ela encontrou pentágonos novos que ladrilham o plano.',
    },
    {
      name: 'M. C. Escher',
      note: 'Mais artista que matemático, ele encheu planos inteiros de pássaros, peixes e lagartos que se encaixam como peças de quebra-cabeça.',
    },
  ],
  insight: {
    title: 'Por que o ladrilho sempre encaixa?',
    html: `<p>Cada lado do ladrilho vem em par. Quando você dobra um lado, o par dele não se dobra separadamente: é uma cópia da mesma curva, deslizada para o outro lado ou girada em volta de um canto. Assim, cada saliência que você faz de um lado é exatamente o recorte de que uma cópia vizinha precisa do outro. As cópias não podem se sobrepor nem deixar buracos.</p>
<div class="insight-visual">dobre um lado → o par é a mesma curva, movida → os vizinhos encaixam</div>
<h3>As regras são simetrias</h3>
<p>Os movimentos que formam os pares de lados são os mesmos que espalham os ladrilhos pelo plano: deslizamentos em “Quadrados que deslizam” e “Hexágonos que deslizam”, quartos de volta em torno de dois cantos em “Quadrados que giram” e terços de volta em torno de cantos alternados em “Hexágonos que giram”. Os matemáticos classificam os desenhos que se repetem pelas suas simetrias e mostraram que existem exatamente 17 tipos, os grupos de papel de parede. Esta sala oferece quatro.</p>
<h3>Amadores que mudaram a história</h3>
<p>Nos anos 1970, Marjorie Rice, dona de casa de San Diego sem formação matemática, leu sobre a busca por pentágonos que ladrilham o plano e encontrou quatro tipos novos, trabalhando na mesa da cozinha. Em 2023, David Smith, técnico gráfico aposentado que gostava de brincar com formas, encontrou o “chapéu”: um único ladrilho que cobre o plano mas nunca se repete (usando imagens espelhadas de si mesmo; um primo posterior, o “espectro”, nem precisa delas). Os matemáticos procuravam um ladrilho “einstein” assim havia décadas; com Joseph Myers, Craig Kaplan e Chaim Goodman-Strauss, ele provou que funciona. O chapéu não aparece nesta sala.</p>
<details><summary>A matemática, se você quiser</summary><p>Um ladrilho que cobre o plano com cópias de si mesmo, todas relacionadas por simetrias do desenho, é chamado isoédrico. Aqui cada lado livre é uma curva suave que passa pelos cantos e por três pontos de controle; cada um dos outros lados é a imagem dela por uma translação ou uma rotação (de 90° em torno de cantos opostos do quadrado, ou de 120° em torno de cantos alternados do hexágono). Como cada lado é compartilhado por exatamente duas cópias, a área do ladrilho nunca muda, seja qual for o desenho: o que um lado ganha, o par devolve.</p><p>As cores são escolhidas para que vizinhos sejam sempre diferentes: pela orientação nas regras de giro e pela posição na rede nas de deslizamento.</p></details>
<p>Para ler mais: J. H. Conway, H. Burgiel e C. Goodman-Strauss, <em>The Symmetries of Things</em> (A K Peters, 2008).</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Wallpaper_group" target="_blank" rel="noopener">Os 17 grupos de papel de parede (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Marjorie_Rice" target="_blank" rel="noopener">Marjorie Rice (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Einstein_problem" target="_blank" rel="noopener">O problema do einstein e o chapéu (em inglês)</a><a class="source-link" href="https://arxiv.org/abs/2303.10798" target="_blank" rel="noopener">An aperiodic monotile (Smith, Myers, Kaplan e Goodman-Strauss, 2023) (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/M._C._Escher" target="_blank" rel="noopener">M. C. Escher (em inglês)</a></div>`,
  },
});
