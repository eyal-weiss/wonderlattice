/* A mesa que esquece · palavras para o visitante (pt). */
Wonderlattice.defineText('billiards', 'pt', {
  eyebrow: 'CAOS · GEOMETRIA',
  name: 'A mesa que esquece',
  tagline: 'A mesma tacada, duas vezes, em duas mesas de bilhar. Uma mesa se lembra dela; a outra esquece em segundos.',
  title: 'A mesa que esquece.',
  subtitle:
    'Em cada mesa, uma bola e sua gêmea partem juntas, com um milésimo de grau de diferença. Veja qual mesa as mantém juntas.',
  field: 'Bilhar dinâmico · Caos · Seções cônicas',
  sceneLabel: 'Duas mesas · Duas tacadas em cada · Nenhum acaso',
  sceneName: 'Uma elipse e um estádio',
  tip: 'Arraste numa mesa para mirar e solte para dar a tacada · ← → giram a mira · ↑ ↓ movem a bola · Enter dá uma nova tacada',
  actionLabel: 'Nova tacada',
  canvasLabel:
    'Duas mesas de bilhar, uma elipse e um estádio. Em cada uma, uma bola e sua gêmea, lançadas com um milésimo de grau de diferença, deixam rastros brilhantes. Arraste numa mesa para mirar uma nova tacada, ou use as setas.',
  panelEyebrow: 'Molde a mesa',
  whyLabel: 'Por que uma das mesas esquece?',
  nudge:
    'Quando as gêmeas do estádio se separarem, desça os lados retos dele até 0%, um círculo, e depois suba só até 5%. Quanto de reta é preciso para esquecer?',
  connection: {
    html: '<strong>A mesma lição, sem equações.</strong> Na sala Gêmeos do tempo, três equações afastam começos quase idênticos. Aqui, só a forma de uma mesa faz isso.',
    label: 'Ver climas gêmeos se separarem',
  },

  presets: [
    { name: 'Tacadas gêmeas', note: 'A mesma tacada nas duas mesas, cada uma com uma gêmea desviada 0,001°.' },
    { name: 'Tacada de um foco', note: 'Uma caçapa num dos focos. Toda tacada que sai do outro entra.' },
    { name: 'Um tiquinho de reta', note: 'Lados retos com só 5% da altura. Isso basta?' },
  ],

  flat: 'Os lados retos do estádio',
  flatHint: 'Como parte da altura da mesa. Com 0%, o estádio é um círculo.',
  speed: 'Velocidade',
  pocket: 'Uma caçapa num dos focos',
  exposure: 'Longa exposição',
  caustic: 'Mostrar a curva que a tacada da elipse nunca cruza',

  ellipse: 'Elipse',
  stadium: 'Estádio',
  together: (n) => `Gêmeas juntas · ${n} ${n === 1 ? 'batida' : 'batidas'}`,
  parted: (n) => `Gêmeas separadas na batida ${n}`,
  pocketIn: (n) => (n === 0 ? 'Direto na caçapa' : `Entrou após ${n} ${n === 1 ? 'batida' : 'batidas'}`),
  pocketRolling: (n) => `Rolando · ${n} ${n === 1 ? 'batida' : 'batidas'} até agora`,
  legendBall: 'uma tacada',
  legendTwin: 'sua gêmea, desviada 0,001°',
  legendPocket: 'as tacadas saem do ponto branco',
  chartLabel: 'A distância entre as gêmeas em mesas de 2 m (cada linha, dez vezes mais longe)',
  partedLine: 'separadas',
  seconds: (n) => `${n} s`,
  pocketChart: 'Batidas de cada tacada até entrar, a mais recente à direita',
  statusTogether: (n) => `Batida ${n} · os dois pares juntos`,
  statusParted: (n) => `As gêmeas do estádio se separaram na batida ${n}`,
  statusBoth: 'Os dois pares de gêmeas se separaram',
  statusPocket: (e, s) => `Tacadas na caçapa: elipse ${e}, estádio ${s}`,
  announceParted: (n) =>
    `As gêmeas do estádio se separaram, depois de ${n} batidas. As gêmeas da elipse continuam juntas.`,

  readout: {
    apart: 'Se as mesas tivessem 2 metros de comprimento, as gêmeas agora estariam a esta distância:',
    ellipse: 'Na elipse',
    stadium: 'No estádio',
    curve: 'A tacada da elipse nunca cruza',
    curves: { ellipse: 'uma elipse menor', hyperbola: 'uma hipérbole', foci: 'nenhuma curva: ela passa pelos focos' },
    pocket: 'Batidas que cada tacada levou para entrar:',
    none: 'nenhuma entrou ainda',
  },
  length: {
    tiny: 'menos de 0,01 mm',
    mm: (x) => `${x} mm`,
    cm: (x) => `${x} cm`,
    m: (x) => `${x} m`,
  },
  list: (items) => items.join(', '),

  guests: [
    {
      name: 'George David Birkhoff',
      note: 'Ele usou uma bola numa mesa como modelo do movimento em geral, e suspeitou que, entre as mesas lisas e arredondadas, só as elipses mantêm essa ordem.',
    },
    {
      name: 'Jean-Victor Poncelet',
      note: 'Prisioneiro de guerra na Rússia em 1813, ele relembrou a geometria que tinha aprendido e foi além. Mais tarde, mostrou que, se um zigue-zague entre duas cônicas se fecha, todos se fecham.',
    },
  ],

  insight: {
    title: 'Por que uma das mesas esquece?',
    html: `<p>Nada é aleatório em nenhuma das mesas. Cada bola rola em linha reta e sai da borda no mesmo ângulo em que chegou, e as duas gêmeas partem do mesmo ponto, com a mira diferindo em um milésimo de grau. Na elipse, as gêmeas ficam juntas por centenas de batidas. No estádio, em cerca de uma dúzia de batidas elas já estão longe uma da outra. Só a forma da borda faz a diferença.</p>
<div class="insight-visual">elipse: a distância cresce um pouco a cada batida · estádio: ela cresce umas 2½ vezes a cada batida</div>
<h3>O segredo da elipse: seus dois focos</h3>
<p>Uma elipse é o conjunto dos pontos cujas distâncias a dois pontos fixos, os focos, somam sempre o mesmo total. Por isso, em cada ponto, a borda faz ângulos iguais com as retas que vêm dos dois focos, e uma bola que passa por um foco sempre rebate passando pelo outro. Experimente “Tacada de um foco”: toda tacada que sai de um foco cai numa caçapa no outro. O escritor Alex Bellos mandou construir uma mesa de sinuca elíptica com base nessa ideia, chamada Loop.</p>
<h3>A curva que ela nunca cruza</h3>
<p>Deixe uma tacada correndo na elipse e o caminho dela pinta um anel brilhante em volta de um oval vazio ou, se ela cruzar o segmento entre os focos, em volta de duas lentes vazias. Cada trecho reto do caminho toca a mesma curva escondida, a sua cáustica: uma elipse menor, ou uma hipérbole, com os mesmos focos da mesa. Um único número, fixado pela primeira tacada, decide qual delas, então a elipse nunca esquece como a tacada foi dada. Gêmeas miradas de um jeito um pouco diferente tocam cáusticas um pouco diferentes, e por isso se afastam só devagar. George David Birkhoff mostrou que a mesa elíptica é ordenada desse jeito, o que os matemáticos chamam de integrável. O teorema do fechamento de Poncelet também aparece aqui: se uma tacada que toca uma cáustica volta ao ponto de partida depois de certo número de batidas, toda tacada que toca essa cáustica também volta.</p>
<h3>De onde vem o caos do estádio</h3>
<p>O estádio são dois semicírculos unidos por lados retos. Uma ponta curva concentra um feixe estreito de caminhos próximos, como um espelho, mas o feixe passa do ponto de foco e volta a se abrir ao longo do trecho reto, mais largo do que antes. Batida após batida, o espalhamento vence. Aqui, a distância entre as gêmeas cresce em média umas duas vezes e meia a cada batida: um crescimento exponencial. Nos anos 1970, Leonid Bunimovich provou que o estádio é ergódico: quase todo caminho acaba visitando todas as partes da mesa, passando em cada parte um tempo proporcional à sua área. É por isso que a longa exposição deixa o estádio cinza por igual. Qualquer lado reto basta, por mais curto que seja, embora, quanto mais curto, mais devagar as gêmeas se separem. Sem lados retos, o estádio é um círculo, tão ordenado quanto a elipse.</p>
<p>É a dependência sensível das condições iniciais, o efeito por trás de Gêmeos do tempo, aqui alcançado só pela geometria, sem nenhuma equação de movimento.</p>
<h3>O que este modelo deixa de fora</h3>
<p>Estas são bolas ideais: pontos sem tamanho, giro nem atrito, numa borda de forma perfeita. O estádio tem tacadas excepcionais que nunca se espalham, como uma que vai e volta reto, para cima e para baixo, entre os dois lados retos. Elas são infinitamente raras, mas um caminho que chega perto de uma delas pode ficar rondando por ali por muito tempo. E o computador arredonda cada número para uns 16 algarismos. Na elipse, isso quase não importa. No estádio, os erros de arredondamento crescem como qualquer outra pequena diferença, então, depois de algumas dezenas de batidas, a bola na tela já não está onde a aritmética exata a colocaria: a imagem mostra como os caminhos no estádio se comportam, não onde estaria exatamente esta tacada. Até as gêmeas da elipse acabam se separando, porque a distância entre elas cresce de verdade, só que de forma regular, não exponencial: a partir da tacada inicial, isso leva umas 1.300 batidas.</p>
<details><summary>A matemática, se você quiser</summary><p>A elipse é x²/a² + y²/b² = 1, com focos em (±c, 0), onde c² = a² − b²; aqui a = 2 e b = 1. Para uma bola em (x, y) andando na direção (u, v), os momentos angulares dela em relação aos dois focos são L₁ = (x + c)v − yu e L₂ = (x − c)v − yu, e o produto k = L₁L₂ é o mesmo depois de cada batida. Quando k &gt; 0, a cáustica é a elipse x²/(c² + k) + y²/k = 1; quando k &lt; 0, é a hipérbole x²/(c² + k) − y²/(−k) = 1; e k = 0 quer dizer que o caminho passa pelos focos. Neste estádio (lados retos tão compridos quanto a mesa é alta), caminhos próximos se afastam em média como e<sup>λn</sup> depois de n batidas, com λ ≈ 0,9: é o seu expoente de Lyapunov. A sala calcula cada batida exatamente, resolvendo onde o caminho reto encontra a elipse, ou os lados e semicírculos do estádio, e uma gêmea conta como separada quando fica a mais de um vigésimo da altura da mesa da sua parceira.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dynamical_billiards" target="_blank" rel="noopener">Bilhar dinâmico (em inglês)</a><a class="source-link" href="http://www.scholarpedia.org/article/Dynamical_billiards" target="_blank" rel="noopener">L. A. Bunimovich, “Dynamical billiards”, Scholarpedia 2(8):1813 (2007, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stadium_(geometry)" target="_blank" rel="noopener">Estádio (geometria, em inglês)</a><a class="source-link" href="https://projecteuclid.org/journals/communications-in-mathematical-physics/volume-65/issue-3/On-the-ergodic-properties-of-nowhere-dispersing-billiards/cmp/1103904878.full" target="_blank" rel="noopener">L. A. Bunimovich, “On the ergodic properties of nowhere dispersing billiards”, Communications in Mathematical Physics 65 (1979, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Poncelet%27s_closure_theorem" target="_blank" rel="noopener">Teorema do fechamento de Poncelet (em inglês)</a><a class="source-link" href="https://www.loop-the-game.com/scoop" target="_blank" rel="noopener">Loop, a mesa de sinuca elíptica de Alex Bellos (em inglês)</a></div>`,
  },
});
