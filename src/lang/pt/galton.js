/* A forma escondida no acaso · palavras para o visitante (pt). */
Wonderlattice.defineText('galton', 'pt', {
  eyebrow: 'PROBABILIDADE',
  name: 'A forma escondida no acaso',
  tagline:
    'Cada bolinha quica para a esquerda ou para a direita ao acaso. Juntas, elas constroem o mesmo sino toda vez.',
  title: 'A forma escondida no acaso.',
  subtitle:
    'Cada bolinha quica para a esquerda ou para a direita ao acaso, mas o monte cresce e forma o mesmo sino toda vez. Depois, tire médias de um dado viciado.',
  field: 'Probabilidade · Triângulo de Pascal · O teorema central do limite',
  canvasLabel:
    'Um tabuleiro de pinos. Bolinhas caem do alto, quicam para a esquerda ou para a direita ao acaso em cada pino e se amontoam em compartimentos embaixo, sob uma curva em forma de sino. Abaixo dele, mais quatro levas de bolinhas formaram o mesmo sino.',
  panelEyebrow: 'Entregue ao acaso',
  whyLabel: 'Por que o acaso forma um sino?',
  nudge:
    'Despeje de novo: cada bolinha faz um caminho novo, e o monte ainda forma o mesmo sino. Depois monte um dado viciado e observe as médias dele.',
  connection: {
    html: '<strong>Médias domam o acaso.</strong> Em “Uma colherada de cidade”, uma pequena pesquisa aleatória chega perto da verdade pelo mesmo motivo: médias de muitas respostas aleatórias se apertam num sino estreito.',
    label: 'Provar uma colherada de cidade',
  },

  // The three things that fall: each has its own scene, tip and action.
  viewLabel: 'O que cai',
  views: ['Bolinhas nos pinos', 'Um dado viciado', 'Um farol teimoso'],
  scenes: [
    { label: 'Esquerda ou direita em cada pino', name: 'Bolinhas nos pinos' },
    { label: 'O seu dado, e médias dos lançamentos dele', name: 'Um dado viciado' },
    { label: 'Um farol gira e ilumina uma parede', name: 'Um farol teimoso' },
  ],
  tips: [
    'As setas inclinam os pinos · Despeje de novo para ter novas bolinhas',
    'Arraste as barras do dado para mudar a forma dele · As setas escolhem uma face e a mudam',
    'Cada giro marca onde a luz bate · Gire de novo para ter novos giros',
  ],
  actions: ['Despejar de novo', 'Lançar de novo', 'Girar de novo'],
  canvasLabels: [
    'Um tabuleiro de pinos. Bolinhas caem do alto, quicam para a esquerda ou para a direita ao acaso em cada pino e se amontoam em compartimentos embaixo, sob uma curva em forma de sino. Abaixo dele, mais quatro levas de bolinhas formaram o mesmo sino.',
    'Um dado viciado desenhado como seis barras, e três montes ao lado: lançamentos únicos, médias de 2 lançamentos e médias de mais lançamentos, cada um com uma curva em forma de sino por cima.',
    'Um farol gira e ilumina uma parede; o monte de onde caem os giros únicos e o monte das médias de vários giros têm a mesma forma.',
  ],

  presets: [
    { name: 'Bolinhas nos pinos', note: 'O mesmo sino toda vez.', badge: '½' },
    { name: 'Inclinar os pinos', note: 'O sino se desloca.', badge: '¾' },
    { name: 'Um dado viciado', note: 'As médias dele viram um sino.', badge: '1·6' },
  ],

  rows: 'Fileiras de pinos',
  tilt: 'Chance de quicar para a direita',
  tiltHint: 'Com 50%, cada pino é justo. Incline-os, e o sino se desloca.',
  throws: 'Lançamentos em cada média',
  dieHint: 'Arraste as barras do dado na imagem para mudar a forma dele.',
  shapeLabel: 'Começar de',
  shapes: ['Quase só 1 e 6', 'Um dado honesto', 'Quase só 6'],
  spins: 'Giros em cada média',
  spinHint: 'Tirar a média de mais giros não ajuda: o farol não tem a dispersão finita de que o sino precisa.',

  status: {
    pouring: (n) =>
      `${n.toLocaleString(Wonderlattice.lang)} ${n === 1 ? 'bolinha' : 'bolinhas'} · esquerda ou direita ao acaso em cada pino`,
    poured: (n) => `${n.toLocaleString(Wonderlattice.lang)} bolinhas · o mesmo sino toda vez`,
    throwing: (n) => `${n.toLocaleString(Wonderlattice.lang)} em cada monte`,
    spinning: (n) => `${n.toLocaleString(Wonderlattice.lang)} em cada monte`,
  },
  announce: {
    poured: (n) => `${n.toLocaleString(Wonderlattice.lang)} bolinhas caíram, na forma do sino.`,
    die: (face, weight) => `Face ${face}: ${weight} de 10`,
  },

  labels: {
    bell: 'o sino',
    others: (pours, balls) =>
      `mais ${pours} levas de ${balls.toLocaleString(Wonderlattice.lang)} bolinhas: o mesmo sino`,
    yourDie: 'Seu dado · mova as barras',
    oneThrow: 'Um lançamento',
    average: (n) => `Médias de ${n} lançamentos`,
    oneSpin: 'Um giro',
    averageSpins: (n) => `Médias de ${n} giros`,
    off: (n) => `${n.toLocaleString(Wonderlattice.lang)} fora do gráfico`,
    lamp: 'farol',
    wall: 'parede',
  },

  guests: [
    {
      name: 'Abraham de Moivre',
      note: 'Em 1733, mostrei que o número de caras em milhares de lances de moeda segue uma curva suave, em forma de sino.',
    },
    {
      name: 'Pierre-Simon Laplace',
      note: 'Mostrei que o sino vai muito além das moedas: médias de muitos tipos de medição aleatória se apertam nele.',
    },
  ],

  insight: {
    title: 'Por que o acaso forma um sino?',
    html: `<p>Cada bolinha faz o mesmo tipo de escolha em cada pino: esquerda ou direita. Para cair na ponta, ela precisa ir para o mesmo lado toda vez, e só um caminho faz isso. Para cair no meio, precisa de tantas esquerdas quanto direitas, e centenas de caminhos fazem isso. Contar os caminhos até cada compartimento dá uma linha do triângulo de Pascal (1, 12, 66, 220, 495, 792, 924, … para doze fileiras), e essas contagens formam o sino. Nenhuma bolinha sabe para onde vai; a forma vem da contagem.</p>
<div class="insight-visual">12 fileiras de pinos: 1 caminho até cada ponta, 924 caminhos até o meio, de 4.096</div>
<h3>Médias formam o mesmo sino</h3>
<p>Os lançamentos únicos do dado mantêm a forma torta dele. Tire a média de dois lançamentos e aparece um pico no meio, com a forma estranha ainda visível; tire a média de dez e o monte fica mais parecido com um sino, e mais estreito. Esse é o teorema central do limite: médias de muitos lançamentos independentes, de quase qualquer dado, se apertam num sino em torno da média do dado, e o sino se estreita como 1/√n. Médias de 10 lançamentos se espalham cerca de √10 vezes menos, um pouco mais de 3 vezes, que os lançamentos únicos.</p>
<h3>Quando falha</h3>
<p>O teorema precisa de lançamentos que não afetem uns aos outros e cuja dispersão seja finita. O farol teimoso quebra a segunda regra: uma luz que gira ao acaso às vezes ilumina quase rente à parede, então alguns giros caem extremamente longe. As médias dele são tão descontroladas quanto um único giro, por mais giros que você junte. Esse farol segue a distribuição de Cauchy, que leva o nome de Augustin-Louis Cauchy.</p>
<h3>O que esta sala simplifica</h3>
<p>As bolinhas seguem um modelo aleatório, não a física: cada pino é um cara ou coroa, justo ou inclinado, independente dos outros. Tabuleiros de verdade nunca são perfeitamente justos, e bolinhas de verdade quicam e giram, então os montes delas são mais irregulares. Médias de 2 ou 5 lançamentos ficam mais perto de um sino, sem ser exatamente um.</p>
<details><summary>A matemática, se você quiser</summary><p>Com n fileiras e uma chance p de quicar para a direita, uma bolinha cai no compartimento k (k quiques para a direita) com chance C(n, k)·pᵏ·(1 − p)ⁿ⁻ᵏ, a distribuição binomial, com média np e dispersão √(np(1 − p)). Abraham de Moivre mostrou em 1733, e na segunda edição da sua <em>Doctrine of Chances</em> (1738), que, para muitos lances, ela fica perto da curva normal; Pierre-Simon Laplace publicou um resultado mais geral na sua <em>Théorie analytique des probabilités</em> (1812). Francis Galton projetou o tabuleiro, que chamou de quincunx, para uma palestra na Royal Institution em 1874, e o descreveu em <em>Natural Inheritance</em> (1889). A média de n giros de Cauchy tem exatamente a mesma distribuição que um único giro.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Galton_board" target="_blank" rel="noopener">Tabuleiro de Galton (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/De_Moivre%E2%80%93Laplace_theorem" target="_blank" rel="noopener">Teorema de De Moivre–Laplace (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Central_limit_theorem" target="_blank" rel="noopener">Teorema central do limite (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cauchy_distribution" target="_blank" rel="noopener">Distribuição de Cauchy (Wikipedia, em inglês)</a></div>`,
  },
});
