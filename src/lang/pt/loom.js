Wonderlattice.defineText('loom', 'pt', {
  eyebrow: 'TECELAGEM',
  name: 'O tear matemático',
  tagline: 'Troque um quadradinho numa grade de sim e não, e o tecido inteiro muda.',
  title: 'O tear matemático.',
  subtitle: 'Escolha quais fios sobem. Veja o tecido crescer a partir de uma grade de sim e não.',
  field: 'Tecelagem · Padrões binários · Repetição',
  sceneLabel: 'Um tear de quatro quadros',
  sceneName: 'Tecido a partir de um esquema',
  tip: 'À esquerda: o esquema · À direita: o tecido · Clique na amarração para mudá-la, ou use os quadradinhos do painel',
  tipStacked: 'Em cima: o esquema · Embaixo: o tecido · Clique na amarração, ou use os quadradinhos do painel',
  actionLabel: 'Me surpreenda',
  canvasLabel:
    'Um esquema de tecelagem ao lado do tecido que ele produz. Mude a amarração clicando nela aqui, ou nos quadradinhos do painel.',
  panelEyebrow: 'Monte o tear',
  whyLabel: 'Como uma grade vira tecido?',
  nudge:
    'Comece com “Sarja” e troque um quadradinho da amarração. Todas as passadas tecidas com aquele pedal mudam de uma vez.',
  connection: {
    html: '<strong>Uma regrinha, repetida em toda parte.</strong> A amarração decide cada cruzamento do tecido. Em “Uma mente de muitos”, pequenas regras entre vizinhos dão forma a uma multidão inteira.',
    label: 'Visitar “Uma mente de muitos”',
  },
  presets: [
    {
      name: 'Tafetá',
      note: 'Por cima de um, por baixo de um.',
    },
    {
      name: 'Sarja',
      note: 'Uma diagonal, como no jeans.',
    },
    {
      name: 'Pied-de-poule',
      note: 'Sarja com quatro escuros, quatro claros.',
    },
    {
      name: 'Listras, não xadrez',
      note: 'Alterne as cores nos dois sentidos.',
    },
    {
      name: 'Olho de perdiz',
      note: 'Em ponta nos dois sentidos: losanguinhos.',
    },
    {
      name: 'Ziguezague',
      note: 'Faça a sarja voltar sobre si mesma.',
    },
  ],
  tieup: 'Quais fios cada pedal levanta (a amarração)',
  tieupHint:
    'Cada quadro é uma moldura que segura alguns dos fios do comprimento. Um quadradinho aceso quer dizer que aquele pedal levanta aquele quadro.',
  tieupCell: (pedal, shaft) => `O pedal ${pedal} levanta o quadro ${shaft}`,
  treadleLabel: (n) => `Pedal ${n}`,
  shaftLabel: (n) => `Quadro ${n}`,
  threading: 'Ordem dos fios',
  treadling: 'Ordem dos pedais',
  orders: ['Reta', 'Em ponta', 'Quebrada', 'Dobrada'],
  warpColours: 'Fios do comprimento',
  weftColours: 'Fios da largura',
  colourOrders: ['Todos escuros', '4 e 4', 'Alternados', '2 e 2', 'Todos claros'],
  palette: 'Fio',
  palettes: ['Índigo e creme', 'Garança e ouro', 'Floresta e linho', 'Noite e prata'],
  repeat: (across, down) =>
    across === 1 && down === 1 ? 'Uma cor só em tudo' : `Repete a cada ${across} × ${down} fios`,
  float: (n) =>
    n === Infinity
      ? 'Um fio nunca se entrelaça aqui. Este tecido se desmancharia.'
      : n === 1
        ? 'Cada fio passa por cima de um, por baixo de um: um tecido firme.'
        : n <= 3
          ? `Os fios flutuam sobre até ${n} outros: um tecido mais macio e maleável.`
          : `Flutuações de ${n} fios: longas e soltas, fáceis de puxar.`,
  labels: {
    draft: 'ESQUEMA',
    cloth: 'TECIDO',
  },
  guests: [
    {
      name: 'Ada Lovelace',
      note: 'Ela descreveu como a máquina de Babbage, guiada por cartões perfurados como um tear de Jacquard, poderia tecer padrões de álgebra.',
    },
  ],
  insight: {
    title: 'Uma grade que tece.',
    html: `<p>Cada tecido aqui vem de três listas curtas. O <em>remetido</em> diz por qual dos quatro quadros passa cada fio do comprimento (a urdidura). A <em>amarração</em> diz quais quadros cada pedal levanta. A <em>pisada</em> diz qual pedal é pressionado em cada passada da largura (a trama). Onde um fio de urdidura levantado cruza a trama, a urdidura aparece por cima.</p>
<div class="insight-visual">tecido = pisada × amarração × remetido, um produto de grades de 0s e 1s</div>
<h3>Pequena mudança, tecido inteiro</h3>
<p>Troque um quadradinho da amarração e todas as passadas tecidas com aquele pedal mudam de uma vez. Tecelões projetam no papel desse jeito: a grade à esquerda da imagem é um esquema de tecelagem de verdade.</p>
<h3>A cor é um segundo padrão</h3>
<p>Pinte também os fios, e o ponto e a ordem das cores se combinam. Uma sarja 2/2 com quatro fios escuros e quatro claros em cada sentido faz pied-de-poule. Um tafetá com cores alternadas faz listras, e não o xadrez que você talvez esperasse.</p>
<h3>As flutuações seguram o tecido</h3>
<p>Um fio que passa por cima de vários outros sem se entrelaçar forma uma flutuação. Flutuações curtas fazem um tecido firme; longas o deixam macio e fácil de puxar fio. Um fio que nunca se entrelaça não forma tecido nenhum.</p>
<details><summary>A matemática, se você quiser</summary><p>Escreva o remetido como uma grade H (o fio de urdidura j está no quadro s), a amarração como U (o pedal t levanta o quadro s) e a pisada como T (a passada i usa o pedal t). O tecido é D = T · U · Hᵀ, com aritmética booleana, em que 1 + 1 = 1. Como as três listas se repetem, o tecido também se repete: sua repetição divide o mínimo múltiplo comum dos comprimentos das listas e das ordens de cores.</p><p>Este tear tem quatro quadros e quatro pedais, como muitos teares de mesa e de chão. Um tecido de verdade também depende do fio, do espaçamento e da tensão, que esta imagem deixa de fora.</p></details>
<div class="sources"><a class="source-link" href="https://www.tandfonline.com/doi/abs/10.1080/0025570X.1980.11976845" target="_blank" rel="noopener">Satins and twills: a geometria dos tecidos (Grünbaum &amp; Shephard, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Houndstooth" target="_blank" rel="noopener">Como o pied-de-poule é tecido (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/" target="_blank" rel="noopener">Ada Lovelace e o tear de Jacquard (em inglês)</a></div>`,
  },
});
