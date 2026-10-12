/* Dobre um dragão · palavras para o visitante (pt). */
Wonderlattice.defineText('dragon', 'pt', {
  eyebrow: 'DOBRADURA DE PAPEL',
  name: 'Dobre um dragão',
  tagline: 'Dobre uma tira de papel ao meio, de novo e de novo, abra cada vinco em ângulo reto, e dali sai um dragão.',
  title: 'Dobre um dragão.',
  subtitle:
    'Uma tira de papel é dobrada ao meio dez vezes, e depois cada vinco se abre em ângulo reto. Veja: ela nunca se cruza.',
  field: 'Dobraduras · Fractais · Ladrilhamento',
  sceneLabel: 'Uma tira de papel, vista de cima',
  sceneName: 'Dobrando',
  tip: 'A tira fica de pé sobre a borda, vista de cima. Dobre-a mais uma vez, ou mude o ângulo dos vincos.',
  actionLabel: 'Mais uma dobra',
  canvasLabel:
    'Uma tira de papel colorida é dobrada ao meio de novo e de novo, e depois se abre, com cada vinco em ângulo reto, numa forma de dragão cheia de curvas que se toca nos cantos mas nunca se cruza.',
  panelEyebrow: 'Dobrar e abrir',
  whyLabel: 'Por que um dragão?',
  nudge:
    'Experimente com papel: dobre uma tira ao meio quatro vezes, sempre para o mesmo lado, depois abra cada vinco em ângulo reto e ponha a tira de pé sobre a borda.',
  connection: {
    html: '<strong>Cópias que enchem o plano.</strong> Quatro dragões se encaixam em volta de um ponto sem deixar vãos. Em “Um ladrilho que enche o mundo”, qualquer ladrilho que você entortar continua cobrindo tudo.',
    label: 'Visitar “Um ladrilho que enche o mundo”',
  },

  presets: [
    { name: 'Dez dobras', note: 'O dragão clássico.' },
    { name: 'Quatro dragões', note: 'Girados em torno de um ponto, eles se encaixam.' },
    { name: 'Papel de verdade', note: 'Quatro dobras, como uma tira de verdade permite.' },
  ],

  folds: 'Dobras',
  angle: 'Ângulo dos vincos',
  four: 'Quatro dragões',

  // Above the picture. `fold` and `folds` are whole numbers; `layers` and `pieces` arrive already written out (1.024).
  folding: 'Dobrando',
  opening: 'Abrindo',
  oneMore: 'Mais uma dobra',
  dragon: 'O dragão',
  fourDragons: 'Quatro dragões',
  foldStatus: (fold, layers) => `Dobra ${fold} · ${layers} camadas`,
  paperLimit: (fold, layers) => `Dobra ${fold} · ${layers} camadas, mais que o papel permite`,
  openStatus: 'Cada vinco se abre em ângulo reto',
  moreStatus: 'Um vinco novo em cada pedaço, ora à esquerda, ora à direita',
  rightStatus: (folds, pieces) => `${folds} ${folds === 1 ? 'dobra' : 'dobras'} · ${pieces} pedaços · nunca se cruza`,
  fourStatus: (folds) => `${folds} ${folds === 1 ? 'dobra' : 'dobras'} cada · sem sobreposições, sem vãos no meio`,
  angleStatus: (angle) => `Vincos a ${angle}° · a 90° nunca se cruza`,
  restarted: 'De volta a uma dobra.',

  guests: [
    {
      name: 'Martin Gardner',
      note: 'Em 1967, ele mostrou aos leitores da sua coluna na Scientific American o dragão que três físicos da NASA tinham encontrado dobrando papel.',
    },
    {
      name: 'Donald Knuth',
      note: 'Com Chandler Davis, ele descobriu em 1970 por que o dragão nunca usa a mesma aresta duas vezes, e por que as cópias dele podem cobrir o plano.',
    },
    {
      name: 'Britney Gallivan',
      note: 'Em 2002, quando ainda estava no ensino médio, ela dobrou uma tira de papel de 1,2 km ao meio doze vezes, sempre no mesmo sentido.',
    },
  ],

  insight: {
    title: 'Por que dobrar faz um dragão?',
    html: `<p>Cada dobra põe um vinco novo no meio de cada pedaço da tira, e, como as dobras vão sempre para o mesmo lado, os vincos novos viram ora para a esquerda, ora para a direita. Abra cada vinco em ângulo reto e a tira desenha um caminho numa grade quadriculada. O caminho depois de dez dobras tem 1.024 pedaços e, mesmo assim, nunca passa duas vezes pela mesma aresta: ele só se toca nos cantos. Os cantos arredondados da imagem deixam ver ali os dois trechos do caminho passando um pelo outro.</p>
<div class="insight-visual">mais uma dobra → um vinco novo entre cada dois → o dragão fica duas vezes mais comprido</div>
<h3>Para que lado vira cada vinco</h3>
<p>Numere os vincos a partir de uma ponta. Divida o número do vinco por 2 enquanto der, e olhe o que sobrou: se a divisão por 4 deixa resto 1, o vinco vira para um lado, e se deixa resto 3, para o outro. Assim as viradas são direita, direita, esquerda, direita, direita, esquerda, esquerda… Esta é a sequência regular de dobradura de papel.</p>
<h3>Dois dragões em um, e quatro que enchem o plano</h3>
<p>A segunda metade da tira é a primeira metade girada de um ângulo reto em torno do vinco do meio, então cada dragão é feito de dois dragões menores, cada um com 1/√2 do tamanho. Chandler Davis e Donald Knuth estudaram essas curvas em 1970 e provaram que o caminho dobrado nunca repete uma aresta, e que cópias giradas dele se encaixam: quatro dragões que começam no mesmo ponto enchem a grade em volta dele sem vãos nem sobreposições, e quanto mais dobras, mais longe eles chegam. Medido com o início e o fim a 1 de distância, o dragão completo cobre uma área de exatamente ½, e a sua borda é um fractal de dimensão de cerca de 1,52.</p>
<h3>Papel de verdade</h3>
<p>Cada dobra duplica a espessura e corta o comprimento pela metade, então uma tira de papel comum logo vira um bloquinho duro: quatro ou cinco dobras bem marcadas são mais ou menos o máximo que ainda dá para abrir direitinho, e sete ou oito é o limite costumeiro. O papel da sala não tem espessura. Em 2002, Britney Gallivan, aluna do ensino médio, calculou o comprimento que uma tira precisa ter para um dado número de dobras, e depois dobrou 1,2 km de papel doze vezes no mesmo sentido. A curva foi encontrada primeiro pelos físicos da NASA John Heighway, Bruce Banks e William Harter, e Martin Gardner escreveu sobre ela em 1967.</p>
<details><summary>O que a sala deixa de fora</summary><p>A animação gira todos os vincos na mesma medida ao mesmo tempo e mantém todos os pedaços do mesmo comprimento, como se a tira estivesse de pé sobre a borda, sem espessura. Vincos de verdade se abrem um pouco sozinhos, então uma tira de verdade faz um dragão mais irregular. Com ângulos de vinco diferentes de 90°, o caminho pode se cruzar; ali a sala não afirma nada.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Dragon_curve" target="_blank" rel="noopener">A curva do dragão (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Regular_paperfolding_sequence" target="_blank" rel="noopener">A sequência regular de dobradura de papel (em inglês)</a><a class="source-link" href="https://mathworld.wolfram.com/DragonCurve.html" target="_blank" rel="noopener">MathWorld: curva do dragão (em inglês)</a><a class="source-link" href="https://www-cs-faculty.stanford.edu/~knuth/fg.html" target="_blank" rel="noopener">C. Davis e D. E. Knuth, “Number representations and dragon curves”, em Selected Papers on Fun and Games, de Knuth (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Britney_Gallivan" target="_blank" rel="noopener">Britney Gallivan (em inglês)</a></div>`,
  },
});
