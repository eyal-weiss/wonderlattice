Wonderlattice.defineText('traffic', 'pt', {
  eyebrow: 'TEORIA DOS JOGOS',
  name: 'O atalho tentador',
  tagline: 'Uma rua nova que deixa todo motorista mais lento.',
  title: 'O atalho tentador.',
  subtitle:
    'Todo motorista pega o caminho mais rápido. Abra um atalho novo e veja se todo mundo chega mais cedo em casa.',
  field: 'Redes · Teoria dos jogos · Uma pequena surpresa',
  sceneLabel: 'Uma cidade · Muitas escolhas individuais',
  sceneName: 'A travessia da cidade',
  tip: 'Os marcadores em movimento mostram proporções do tráfego, não carros individuais',
  actionLabel: 'Abrir o atalho',
  canvasLabel: 'Uma rede de ruas de mão única. Abra ou feche o atalho do meio e mude o número de motoristas.',
  panelEyebrow: 'Mude uma rua',
  whyLabel: 'Como isso pode acontecer?',
  nudge:
    'Comece com 4.000 motoristas. Abra o atalho. Depois experimente um trânsito bem mais leve. A rua nova é sempre uma má ideia?',
  connection: {
    html: '<strong>Regras simples, resultado inesperado.</strong> Em Uma mente de muitos, um bando forma um padrão a partir de interações locais. Aqui, cada motorista escolhendo um caminho rápido pode deixar a viagem de todos mais lenta.',
    label: 'Siga outra multidão',
  },
  presets: [
    {
      name: 'Ruas tranquilas',
      note: 'O atalho pode ajudar.',
    },
    {
      name: 'Uma cidade cheia',
      note: 'Veja a surpresa.',
    },
    {
      name: 'Hora do rush',
      note: 'O atalho pode deixar de importar?',
    },
  ],
  demand: 'Motoristas atravessando a cidade',
  demandHint: 'Quão cheia está a cidade?',
  drivers: (n) => n.toLocaleString(Wonderlattice.lang),
  status: (open, minutes) => `${open ? 'Atalho aberto' : 'Atalho fechado'} · ${minutes} min agora`,
  open: 'Abrir o atalho',
  close: 'Fechar o atalho',
  before: 'Antes',
  after: 'Depois de abrir',
  minutes: ' min',
  verdict: {
    closed: 'Abra o atalho para ver o novo tempo de viagem.',
    same: 'A rua nova não muda o tempo de viagem.',
    slower: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} a mais para todo mundo.`,
    faster: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} a menos para todo mundo.`,
  },
  labels: {
    nodes: {
      start: 'S',
      north: 'A',
      south: 'B',
      end: 'T',
    },
    congestion: 'congestionamento',
    fixed: '45 min',
    shortcutOpen: '0 min',
    shortcutClosed: 'fechado',
    caption: 'S → T · cada um escolhe seu caminho mais rápido',
  },
  guests: [
    {
      name: 'John von Neumann',
      note: 'O trânsito é um jogo de escolhas, e uma jogada esperta pode surpreender todo mundo.',
    },
    {
      name: 'John Nash',
      note: 'Aqui, nenhum motorista consegue melhorar sozinho, mesmo com todos mais lentos.',
    },
  ],
  insight: {
    title: 'Por que uma rua nova pode atrasar todo mundo?',
    html: `<p>Com 4.000 motoristas e sem atalho, o trânsito se divide igualmente entre o caminho de cima e o de baixo. Cada viagem leva 65 minutos. Abra a ligação de zero minuto entre A e B, e cada motorista vê um motivo para usá-la. Todos vão por S → A → B → T, e cada viagem passa a levar 80 minutos.</p>
<div class="insight-visual">Um atalho pode mudar as escolhas das pessoas, e as escolhas delas mudam o congestionamento.</div>
<h3>Experimente uma cidade mais tranquila</h3>
<p>Leve o controle de demanda para perto de 1.000. Agora o atalho ajuda. Com uma demanda muito alta, ninguém o usa. O paradoxo só acontece numa parte da faixa.</p>
<h3>O que este modelo supõe</h3>
<p>Cada motorista escolhe o caminho mais rápido para si. As decisões somadas se acomodam num equilíbrio em que nenhum motorista ganha tempo trocando de caminho sozinho. É uma rede simplificada, de mão única, com um atalho livre e tempos de viagem que dependem só do fluxo de trânsito. Os pontos em movimento mostram as proporções em cada caminho, não decisões individuais simuladas nem uma previsão para uma cidade de verdade.</p>
<details><summary>A matemática, se você quiser</summary><p>As ruas que congestionam custam x/100 minutos, em que x é o número de motoristas que as usam. As outras duas ruas custam 45 minutos cada; o atalho A → B custa zero. Sem ele, o tempo de viagem é 45 + D/200 para D motoristas. Com D = 4.000, isso dá 65 minutos. Com ele, o equilíbrio usa o caminho do meio e custa 2D/100 = 80 minutos.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explore o paradoxo de Braess (Easley &amp; Kleinberg, em inglês)</a></div>`,
  },
});
