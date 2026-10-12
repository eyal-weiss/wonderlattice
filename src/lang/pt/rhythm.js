/* Ritmos de Euclides · palavras para o visitante (pt). */
Wonderlattice.defineText('rhythm', 'pt', {
  eyebrow: 'RITMOS EUCLIDIANOS',
  name: 'Ritmos de Euclides',
  tagline:
    'Espalhe algumas batidas num círculo da forma mais uniforme que puder, e surgem ritmos tocados no mundo todo.',
  title: 'Ritmos de Euclides.',
  subtitle:
    'Três batidas distribuídas da forma mais uniforme possível em oito passos: o tresillo cubano. Mude os números, ou ligue o som.',
  field: 'Números · Algoritmo de Euclides · Ritmo',
  sceneLabel: 'Batidas em círculo',
  tip: 'O ponteiro dá uma volta por compasso e acende cada batida por onde passa · Toque num ritmo com nome para ele tocar · Teclas: ← → o próximo',
  actionLabel: 'Ligar o som',
  canvasLabel:
    'Um mostrador de relógio feito de passos, com um ponteiro dando voltas. As batidas, distribuídas da forma mais uniforme possível, são os cantos de um polígono e acendem quando o ponteiro passa. Ao lado, as mesmas batidas numa fileira de quadradinhos, sob uma reta desenhada em pixels que sobe um degrau a cada batida.',
  panelEyebrow: 'Batidas e passos',
  whyLabel: 'De onde vêm esses ritmos?',
  nudge:
    'Ligue o som e experimente 5 batidas em 8 passos, e 7 em 12: muitas das distribuições mais uniformes têm nome.',
  connection: {
    html: '<strong>Batidas dentro de duas notas.</strong> Dois tons um pouco desafinados crescem e somem num ritmo só deles, os chamados batimentos.',
    label: 'Ouça a forma',
  },

  presets: [
    { name: 'Tresillo', note: '3 batidas em 8 passos, de Cuba.' },
    { name: 'Bossa nova', note: '5 em 16, sobre um 4 constante.' },
    { name: 'Sino oeste-africano', note: '7 em 12, sobre 4 e 3.' },
  ],

  soundOff: 'Ligar o som',
  soundOn: 'Som ligado · silenciar',
  noSound: 'O som não está disponível neste navegador. Você ainda pode ver as batidas.',

  rings: 'Anéis',
  ringCounts: ['Um', 'Dois', 'Três'],
  change: 'Mudar',
  ringNames: ['Externo', 'Do meio', 'Interno'],
  steps: 'Passos',
  beats: 'Batidas',
  start: 'Começar no passo',
  startHint: 'As mesmas batidas, começando de outro passo do círculo.',
  speed: 'Uma volta leva',
  seconds: ' s',

  // The scene's name: a rhythm Toussaint lists (its name, where it is played), or an even spread with no name here.
  scene: (name, from) => `${name} · ${from}`,
  unnamed: 'Uma distribuição uniforme',
  // Whole numbers of beats (0 to 24) and steps (2 to 24).
  status: (k, n) => `${k === 1 ? '1 batida' : `${k} batidas`} em ${n} passos`,

  // Words drawn on the canvas, kept short.
  labels: {
    line: (k, n) => `Uma reta que sobe ${k} em ${n}, em pixels`,
    steps: 'Sobe um degrau nas batidas',
    ring: (k, n) => `${k} em ${n}`,
    ringNamed: (k, n, name) => `${k} em ${n} · ${name}`,
    gallery: 'Mais ritmos com nome · toque em um',
  },

  announce: (k, n, name) =>
    name
      ? `${k === 1 ? '1 batida' : `${k} batidas`} em ${n} passos: ${name}.`
      : `${k === 1 ? '1 batida' : `${k} batidas`} em ${n} passos, na distribuição mais uniforme possível.`,

  // Rhythms in Toussaint’s list (2005), by the names and places he gives.
  rhythms: {
    conga: { name: 'Padrão de conga', from: 'Cuba' },
    khafif: { name: 'Khafif-e-ramal', from: 'Pérsia, século XIII' },
    cumbia: { name: 'Cumbia', from: 'Colômbia' },
    romanian: { name: 'Dança popular', from: 'Romênia' },
    ruchenitza: { name: 'Ruchenitza', from: 'Bulgária' },
    tresillo: { name: 'Tresillo', from: 'Cuba' },
    ruchenitzaFour: { name: 'Ruchenitza', from: 'Bulgária' },
    aksak: { name: 'Aksak', from: 'Turquia' },
    yorkSamai: { name: 'York-Samai', from: 'Música árabe' },
    nawakhat: { name: 'Nawakhat', from: 'Música árabe' },
    cinquillo: { name: 'Cinquillo', from: 'Cuba' },
    agsagSamai: { name: 'Agsag-Samai', from: 'Música árabe' },
    venda: { name: 'Canção de palmas venda', from: 'África do Sul' },
    bossa: { name: 'Bossa nova', from: 'Brasil' },
    bendir: { name: 'Tambor bendir', from: 'Tuaregues, Líbia' },
    bell: { name: 'Padrão de sino', from: 'África Ocidental' },
    samba: { name: 'Samba', from: 'Brasil' },
    central: { name: 'Ritmo centro-africano', from: 'República Centro-Africana' },
    aka: { name: 'Ritmo aka', from: 'África Central' },
    sangha: { name: 'Ritmo aka', from: 'Alto Sangha, África Central' },
  },

  // The explanation's worked example, for the outer ring's numbers: Bjorklund's rounds (already drawn as groups of
  // x and ·), then Euclid's divisions a = q × b + r.
  roundsIntro: (k, n) => `Distribuindo ${k === 1 ? '1 batida' : `${k} batidas`} em ${n} passos, rodada por rodada:`,
  divisionsIntro: (n, k) => `O algoritmo de Euclides com ${n} e ${k}:`,
  division: (a, q, b, r) => `${a} = ${q} × ${b} + ${r}`,
  noRounds: 'Sem batidas, ou sem pausas, não há nada para distribuir.',

  guests: [
    {
      name: 'Euclides',
      note: 'Nos meus Elementos, encontrei o maior número que mede dois outros tirando o menor do maior, de novo e de novo. Os mesmos passos distribuem estas batidas.',
    },
    {
      name: 'Godfried Toussaint',
      note: 'Percebi que uma receita para cronometrar pulsos num acelerador de partículas também gera ritmos tocados no mundo todo, e em 2005 os chamei de ritmos euclidianos.',
    },
  ],

  insight: {
    title: 'De onde vêm esses ritmos?',
    html: `<p>Ponha algumas batidas num círculo de passos, o mais afastadas possível umas das outras. Quando as batidas dividem os passos exatamente, todos os intervalos são iguais. Quando não dividem, os intervalos vêm em dois tamanhos, que diferem em um passo, misturados da forma mais uniforme possível: 3 batidas em 8 passos deixam intervalos de 3, 3 e 2. Esse padrão é o tresillo, um ritmo básico da música cubana, também tocado em sinos na África Ocidental e nas linhas de baixo do rock and roll dos anos 1950.</p>
<h3>A subtração de Euclides</h3>
<p>Para distribuí-las, escreva as batidas em fila, depois as pausas. Encaixe uma pausa atrás de cada batida, e continue encaixando os grupos que sobram atrás dos outros até sobrar no máximo um grupo. Eric Bjorklund usou isso em 2003 para espaçar pulsos de sincronização num acelerador de partículas, a Spallation Neutron Source. São os mesmos passos do algoritmo de Euclides para o máximo divisor comum, dos seus Elementos, de cerca de 300 a.C.: divida, depois divida pelo resto, de novo e de novo.</p>
<div class="insight-visual" id="rhythm-rounds"></div>
<h3>Ritmos com nome</h3>
<p>Em 2005, Godfried Toussaint chamou esses padrões de ritmos euclidianos e listou ritmos tradicionais entre eles, de Cuba, do Brasil, da África Ocidental e Central, da Turquia, da Bulgária e da música árabe. Aqui, um nome vale para o mesmo padrão começado de qualquer passo, como na lista dele: muitos ritmos são tocados a partir de outra batida. A bossa nova começa o seu 5 em 16 na terceira batida, e o samba, o seu 7 em 16 na última; “Começar no passo” gira um anel. O 7 em 12 do sino oeste-africano também é o padrão das teclas brancas entre as doze teclas de uma oitava do piano.</p>
<h3>Uma reta em pixels</h3>
<p>Desenhe numa tela uma reta que sobe 3 em 8, um pixel em cada coluna. Ela sobe para uma nova linha 3 vezes, e as colunas onde ela sobe formam de novo o tresillo. Para quaisquer números, a reta sobe os degraus num padrão o mais uniforme possível, lido a partir de alguma coluna.</p>
<h3>O mais afastadas possível</h3>
<p>De todas as maneiras de pôr as batidas nos passos, estas as deixam mais afastadas: some as distâncias em linha reta entre cada par de batidas no círculo, e só um ritmo euclidiano, girado ou não, tem o maior total. Erik Demaine e colegas provaram isso em 2009.</p>
<h3>O que a sala deixa de fora</h3>
<p>Ninguém afirma que os músicos usaram o algoritmo de Euclides: a uniformidade é simplesmente algo que esses ritmos têm em comum. Tocar de verdade tem acentos, swing e o som de cada instrumento, que as batidas e as pausas deixam de fora. Nem todo ritmo é euclidiano: a clave de son tem cinco batidas em dezesseis, como a bossa nova, mas intervalos de 3, 3, 4, 2 e 4. Os nomes seguem a lista de Toussaint, e o mesmo padrão muitas vezes tem outros nomes em outros lugares.</p>
<details><summary>A matemática, se você quiser</summary><p>Um padrão de k batidas em n passos é um colar de k uns e n − k zeros. O algoritmo de Bjorklund mantém duas pilhas de grupos, [1] × k e [0] × (n − k); cada rodada junta um grupo da pilha de trás a cada grupo da pilha da frente, e o que sobra vira a nova pilha de trás. Os tamanhos das pilhas seguem o algoritmo de Euclides com n − k e k, e o processo termina quando sobra no máximo um grupo.</p><p>A reta digital dá o mesmo colar: o passo i é uma batida quando ⌊ik/n⌋ &gt; ⌊(i − 1)k/n⌋, o padrão que o algoritmo de Bresenham para retas desenha numa tela. Na teoria musical, os conjuntos maximamente uniformes de Clough e Douthett são a mesma ideia para escalas. Aqui, a uniformidade é a soma dos comprimentos das cordas entre todos os pares de batidas num círculo unitário.</p><p>Os testes da sala conferem, contra um programa separado: a tabela de Toussaint, cada E(k, n) até 32 passos contra a reta, cada padrão de até 14 passos quanto ao maior afastamento, e os começos da bossa nova e do samba.</p></details>
<div class="sources"><a class="source-link" href="https://archive.bridgesmathart.org/2005/bridges2005-47.html" target="_blank" rel="noopener">Toussaint, The Euclidean algorithm generates traditional musical rhythms (Bridges, 2005, em inglês)</a><a class="source-link" href="https://arxiv.org/abs/0705.4085" target="_blank" rel="noopener">Demaine e outros, The distance geometry of music (2009, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euclidean_rhythm" target="_blank" rel="noopener">Ritmo euclidiano (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Maximal_evenness" target="_blank" rel="noopener">Uniformidade máxima (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tresillo_(rhythm)" target="_blank" rel="noopener">Tresillo (Wikipedia, em inglês)</a></div>`,
  },
});
