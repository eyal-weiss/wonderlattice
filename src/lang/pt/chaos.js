/* Saltos ao acaso, triângulo perfeito · palavras para o visitante (pt). */
Wonderlattice.defineText('chaos', 'pt', {
  eyebrow: 'O JOGO DO CAOS',
  name: 'Saltos ao acaso, triângulo perfeito',
  tagline:
    'Salte metade do caminho até um canto escolhido ao acaso, de novo e de novo, e um fractal impecável surge do ruído.',
  title: 'Saltos ao acaso, triângulo perfeito.',
  subtitle:
    'Um ponto salta metade do caminho até um canto escolhido ao acaso, de novo e de novo. Toque para ele começar em outro lugar, ou arraste um canto.',
  field: 'Acaso · Fractais · Transformações repetidas',
  sceneLabel: 'O jogo do caos',
  tip: 'Toque para o ponto começar ali · Arraste um canto para mudar o jogo · Enter dá um salto',
  actionLabel: 'Um salto',
  canvasLabel:
    'Os cantos de uma forma e os pontinhos deixados por um ponto que salta parte do caminho até um canto escolhido ao acaso, de novo e de novo.',
  panelEyebrow: 'Mude o jogo',
  whyLabel: 'Por que o acaso desenha uma forma perfeita?',
  nudge:
    'Experimente quatro cantos: só neblina. Depois marque “Nunca o mesmo canto duas vezes seguidas” e veja um fractal sair da neblina.',
  connection: {
    html: '<strong>Dois tipos de caos.</strong> Aqui, “caos” é só o nome do jogo: comece onde quiser, e a mesma forma aparece. Em “Gêmeos do tempo”, a menor diferença cresce até virar outro futuro.',
    label: 'Gêmeos do tempo',
  },

  presets: [
    { name: 'Três cantos', note: 'Buracos dentro de buracos, e nenhum ponto cai neles.' },
    { name: 'Quatro cantos', note: 'Só neblina: os pontos vão para todo lado.' },
    { name: 'Quatro, e uma regra', note: 'Nunca o mesmo canto duas vezes: um fractal na neblina.' },
    { name: 'Cinco cantos', note: 'Salte 61,8% do caminho: cinco cópias que mal se tocam.' },
    { name: 'A samambaia de Barnsley', note: 'Quatro regras, cada uma com a sua chance.' },
  ],
  yourOwn: 'O seu próprio jogo',

  corners: 'Cantos',
  jump: 'Até onde vai cada salto',
  jumpHint: 'A fração do caminho até o canto.',
  rule: 'Nunca o mesmo canto duas vezes seguidas',
  fern: 'Fazer crescer a samambaia de Barnsley',

  // Drawn on the picture.
  jumps: (n, count) => `${n} ${count === 1 ? 'salto' : 'saltos'}`,
  caption: (percent, rule) =>
    rule
      ? `Cada salto: ${percent}% do caminho até um canto sorteado, sem repetir canto`
      : `Cada salto: ${percent}% do caminho até um canto sorteado`,
  fernCaption: 'Cada salto: uma de quatro regras, sorteada',

  // Over the picture, and read out once the picture settles.
  holeStatus: (n, none) => (none ? 'Pontos no buraco do meio: nenhum' : `Pontos no buraco do meio: ${n}`),
  jumpStatus: (n) => `Saltos até agora: ${n}`,
  settled: (n) => `A imagem se estabilizou depois de ${n} saltos.`,

  guests: [
    {
      name: 'Wacław Sierpiński',
      note: 'Em 1915, ele descreveu este triângulo com buracos dentro de buracos. Na época, era uma curiosidade; hoje, um dado o desenha em segundos.',
    },
    {
      name: 'Michael Barnsley',
      note: 'Ele deu nome ao jogo do caos nos anos 1980, e mostrou que um punhado de regras como estas consegue fazer crescer uma samambaia.',
    },
  ],

  insight: {
    title: 'Por que o acaso desenha uma forma perfeita?',
    html: `<p>Cada salto segue uma de três regras: reduza à metade a sua distância até o canto A, até o B ou até o C. Cada regra encolhe o triângulo inteiro numa cópia com metade do tamanho, no canto dela. As três cópias cobrem o triângulo, menos um buraco no meio, e cada cópia contém três cópias menores com um buraco no meio delas, e assim por diante, para sempre. Esse é o <em>triângulo de Sierpiński</em>, a única forma feita de exatamente três cópias de si mesma com metade do tamanho. Cada pontinho ganha a cor do canto para o qual o ponto saltou por último, para você poder ver as cópias.</p>
<p>Um ponto que está na forma sempre salta para outro ponto da forma, dentro da cópia do canto escolhido, então nunca pode cair num buraco. Um ponto que começa em qualquer outro lugar reduz à metade a sua distância até a forma a cada salto, e depois de vinte saltos está mais perto do que um pixel. Por isso os primeiros vinte saltos não são guardados. O dado decide só a ordem em que o ponto visita a forma. A forma em si é fixada pelas regras.</p>
<h3>Neblina, e uma regra que a dissipa</h3>
<p>Quatro quadrados com metade do tamanho enchem um quadrado exatamente, sem sobrar nada, então com quatro cantos o ponto vai para todo lado: neblina. Agora proíba o mesmo canto duas vezes seguidas. Para cair no quadrado de um quarto do tamanho num canto, os dois últimos saltos precisam ter ido para esse canto, então esses quadrados ficam vazios, e os cantos de cada cópia menor também: buracos em todos os tamanhos. Com a regra, cada salto depende do anterior, então este já não é o jogo simples, mas o mesmo raciocínio ainda desenha a sua forma.</p>
<h3>Não é o caos da previsão do tempo</h3>
<p>“O jogo do caos” é o nome que Michael Barnsley deu a ele, e nada aqui é caótico no sentido dos cientistas: comece o ponto em qualquer lugar, com outros números aleatórios, e a mesma imagem aparece. Os números aleatórios vêm do gerador do computador, que segue uma receita fixa; eles não são verdadeiramente aleatórios, mas são aleatórios o bastante para isto. A imagem é feita de um número finito de pontinhos numa grade de pixels, então só pode aproximar uma forma com detalhes em todos os tamanhos.</p>
<details><summary>A matemática, se você quiser</summary><p>Cada regra é uma <em>contração</em>: ela aproxima quaisquer dois pontos. John Hutchinson provou em 1981 que qualquer conjunto finito de contrações tem exatamente um conjunto não vazio, fechado e limitado que é a união das suas próprias imagens, o <em>atrator</em> deste <em>sistema de funções iteradas</em>. Michael Barnsley e Stephen Demko mostraram em 1985 que escolher as regras ao acaso o desenha: com probabilidade 1, o ponto chega perto de cada parte dele. Para uma forma regular com n cantos, as cópias mal se tocam quando o ponto mantém (3 − √5)/2 ≈ 38,2% da sua distância, com cinco cantos, e um terço, com seis. A dimensão do triângulo de Sierpiński é log 3 / log 2 ≈ 1,585: reduza o tamanho à metade e você precisa de três vezes mais pedaços, não quatro. O quadrado com a regra tem a mesma dimensão, pelo mesmo motivo. A samambaia é feita de quatro regras afins, escolhidas em 1%, 85%, 7% e 7% das vezes: uma desenha o caule, uma o resto da samambaia num tamanho menor, e duas os folíolos mais baixos de cada lado, cada um uma pequena cópia da samambaia inteira.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Chaos_game" target="_blank" rel="noopener">Jogo do caos (Wikipedia, em inglês)</a><a class="source-link" href="https://mathworld.wolfram.com/ChaosGame.html" target="_blank" rel="noopener">Jogo do caos (MathWorld, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle" target="_blank" rel="noopener">Triângulo de Sierpiński (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barnsley_fern" target="_blank" rel="noopener">Samambaia de Barnsley (Wikipedia, em inglês)</a><a class="source-link" href="https://doi.org/10.1512/iumj.1981.30.30055" target="_blank" rel="noopener">Hutchinson, Fractals and self similarity (1981, em inglês)</a><a class="source-link" href="https://doi.org/10.1098/rspa.1985.0057" target="_blank" rel="noopener">Barnsley e Demko, Iterated function systems (1985, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Sierpinski/" target="_blank" rel="noopener">Wacław Sierpiński (MacTutor, em inglês)</a></div>`,
  },
});
