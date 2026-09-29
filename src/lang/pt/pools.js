/* Mil amostras, dez testes · palavras para o visitante (pt). */
Wonderlattice.defineText('pools', 'pt', {
  eyebrow: 'TESTAGEM EM GRUPO',
  name: 'Mil amostras, dez testes',
  tagline: 'Um tubo entre mil está brilhando. Dez testes, feitos todos de uma vez, dizem qual.',
  title: 'Mil amostras, dez testes.',
  subtitle:
    'Um tubo está brilhando, e não dá para saber qual. Misture gotas de grupos bem escolhidos de tubos, faça os dez testes de uma vez e leia a resposta nas luzes.',
  field: 'Números binários · Amostras agrupadas · Um bit por teste',
  sceneLabels: [(tubes, tests) => `${tubes} tubos · ${tests} testes`, 'Uma multidão de 100 · testes em grupo'],
  tips: [
    'Toque num tubo para esconder o brilho ali, ou num poço para ver quais tubos pingam nele · As setas para os lados escolhem um poço',
    'Deslize para mudar quantos estão infectados e o tamanho dos grupos · As setas para os lados mudam o tamanho do grupo',
  ],
  actionLabels: ['Esconder em outro tubo', 'Uma nova multidão'],
  canvasLabel:
    'No primeiro andar, uma estante de tubos com uma fileira de poços de teste embaixo. Cada poço recebe uma gota de um grupo de tubos; os poços acesos, lidos como um número binário, dão o número do tubo que brilha. No segundo andar, uma multidão de 100 pessoas dividida em grupos, cada grupo testado uma vez, com um novo teste para cada pessoa de um grupo positivo, e um gráfico do número esperado de testes para cada tamanho de grupo.',
  panelEyebrow: 'Misture as amostras',
  whyLabel: 'Como dez testes bastam?',
  nudge:
    'Toque num tubo, e dez testes o encontram de novo. Depois experimente dois tubos brilhando. No segundo andar, suba os infectados para mais de 31% e veja a economia sumir.',

  connection: {
    html: '<strong>Respostas de sim ou não que escrevem um endereço.</strong> Aqui, dez testes de sim ou não escrevem o número do tubo que brilha. Em “Uma imagem no meio da tempestade”, alguns bits de verificação escrevem o endereço do bit que o ruído inverteu.',
    label: 'Mandar uma imagem pela tempestade',
  },

  presets: [
    { name: 'Um tubo brilhando', note: 'As luzes escrevem o número dele.', badge: '1' },
    { name: 'Dois tubos brilhando', note: 'Agora as luzes apontam para o tubo errado.', badge: '2' },
    { name: '1 infectado em cada 100', note: 'Grupos de dez poupam quatro testes em cada cinco.', badge: '1%' },
  ],

  floorLabel: 'Qual andar?',
  floors: ['Dez testes de uma vez', 'Um teste para muitos'],
  hotLabel: 'Quantos tubos estão brilhando?',
  hot: ['Um', 'Dois'],
  prevalence: 'Infectados',
  prevalenceHint: 'A parte da multidão que carrega a infecção, em segredo',
  pool: 'Tamanho do grupo',
  poolHint: 'Pessoas cujas amostras dividem um mesmo teste. 1 quer dizer testar cada um separadamente.',

  sceneNames: {
    hidden: 'Um tubo está brilhando. Qual?',
    hiddenTwo: 'Dois tubos estão brilhando',
    found: (tube) => `As luzes dizem: tubo ${tube}`,
    crowd: (percent) => `100 pessoas, ${percent} infectadas`,
  },
  status: {
    mixing: (well, tests) => `Misturando gotas · poço ${well} de ${tests}`,
    testing: (tests) => `Os ${tests} testes de uma vez`,
    read: (tests) => `${tests} testes · pronto`,
    pooling: (done, pools) => `Testes em grupo · ${done} de ${pools}`,
    retesting: (done, retests) => `Retestes · ${done} de ${retests}`,
    used: (tests) => `${tests} testes usados`,
  },

  // Words drawn on the picture.
  labels: {
    yes: 'sim',
    no: 'não',
    sum: (parts, total) => `${parts} = ${total}`,
    none: 'Nenhum poço aceso: nenhum tubo brilha',
    here: (tube) => `tubo ${tube}`,
    wrong: (tube) => `tubo ${tube}? Ele não brilha`,
    missing: (tube, tubes) => `tubo ${tube}? Só há ${tubes}`,
    well: (value) => `recebe todo tubo com ${value} na soma`,
    chartTitle: 'Testes esperados para 100 pessoas',
    axis: 'tamanho do grupo',
    oneByOne: 'um a um: 100',
    best: (k) => `melhor: ${k}`,
    never: 'agrupar nunca ajuda aqui',
    thisRun: 'esta multidão',
  },

  readout: {
    tests: (tests, tubes) => `<strong>${tests}</strong> testes, feitos ao mesmo tempo. Um a um, seriam ${tubes}.`,
    code: (tube, bits) => `Tubo ${tube} em binário: <code>${bits}</code>`,
    lights: (bits, value) => `As luzes: <code>${bits}</code> = ${value}`,
    two: 'Cada poço acende se qualquer um dos tubos que brilham pinga nele, então as luzes mostram os dois números fundidos: um 1 onde qualquer um deles tem um 1. Achar dois tubos numa só rodada exige mais testes, e mais engenhosos.',
    well: (value, count) =>
      `Este poço recebe uma gota de cada tubo cujo número, escrito como uma soma de 1, 2, 4, 8, …, usa ${value}: ${count} tubos.`,
    used: (tests) => `Testes usados nesta multidão: <strong>${tests}</strong>`,
    expected: (tests) => `Esperado, em média: ${tests}. Um a um: 100.`,
    best: (k, tests) => `Melhor tamanho de grupo aqui: ${k}, cerca de ${tests} testes.`,
    never: 'Com esta prevalência, nenhum tamanho de grupo supera testar cada um separadamente.',
  },

  announce: {
    found: (tube, tests) => `${tests} testes: as luzes escrevem ${tube}, o tubo que brilha.`,
    wrong: (a, b, pointed) => `Os tubos que brilham são ${a} e ${b}, mas as luzes escrevem ${pointed}.`,
    crowd: (tests, expected) => `${tests} testes para 100 pessoas; ${expected} esperados; 100 um a um.`,
  },

  guests: [
    {
      name: 'Robert Dorfman',
      note: 'Em 1943, ele sugeriu juntar amostras de sangue para procurar sífilis entre os recrutas da guerra: testar o grupo, e retestar um a um só se desse positivo.',
    },
    {
      name: 'Claude Shannon',
      note: 'Ele fundou a matemática da informação, contada em bits. Uma resposta de sim ou não carrega no máximo um, então dez respostas distinguem no máximo 1.024 possibilidades.',
    },
  ],

  insight: {
    title: 'Como dez testes bastam?',
    html: `<p>Escreva o número de cada tubo como uma soma de 1, 2, 4, 8, … 512, usando cada um no máximo uma vez: o tubo 673 é 512 + 128 + 32 + 1. Esse é o número dele em <strong>binário</strong>. O poço marcado 512 recebe uma gota de cada tubo cuja soma usa 512, o poço marcado 1, de cada tubo cuja soma usa 1 (um tubo sim, outro não), e assim por diante. Só o tubo que brilha faz um poço brilhar, então os poços acesos são exatamente as partes da soma dele. Dez poços, acesos ou apagados, escrevem qualquer número até 1.023.</p>
<div class="insight-visual">Tubo 673 = 512 + 128 + 32 + 1 = 1010100001 em binário → acendem os poços 512, 128, 32 e 1</div>
<p>Dez também é o mínimo possível. Cada resposta de sim ou não consegue, no melhor dos casos, cortar as possibilidades pela metade, e elas são 1.001: qualquer um dos 1.000 tubos, ou nenhum. Nove respostas distinguem só 512. (No celular, a estante tem 63 tubos e precisa de seis testes, pelo mesmo motivo.) É o velho enigma das mil garrafas e dos dez provadores.</p>
<h3>Dois tubos brilhando</h3>
<p>Um poço acende se <em>qualquer um</em> dos tubos que brilham pinga nele, então as luzes mostram os dois números fundidos, e escrevem um terceiro tubo. Para achar até <em>d</em> positivos numa única rodada, os grupos precisam ser escolhidos de modo que os poços de nenhum tubo fiquem cobertos pelos poços de <em>d</em> outros. Isso exige da ordem de <em>d</em>² log <em>n</em> / log <em>d</em> testes, enquanto testar em rodadas, cada uma escolhida depois de ver a anterior, exige só cerca de <em>d</em> log(<em>n</em>/<em>d</em>). Fazer tudo de uma vez tem um preço.</p>
<h3>Um teste para muitos</h3>
<p>Em 1943, Robert Dorfman sugeriu um plano mais simples para grandes triagens: juntar as amostras de <em>k</em> pessoas, testar o grupo e retestar cada pessoa só se ele der positivo. Se uma parte <em>p</em> das pessoas está infectada, o número esperado de testes por pessoa é 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. Com 1%, o melhor grupo tem 11 pessoas e custa 0,196 teste por pessoa, uma economia de cerca de 80%. Com 5%, o melhor grupo é de 5 (0,43 teste por pessoa); com 10%, de 4 (0,59). O melhor tamanho é mais ou menos 1/√<em>p</em>. Na multidão desta sala, de exatamente 100 pessoas, grupos de 10 se saem tão bem quanto os de 11 (19,6 testes), porque dividem a multidão por igual. Os testes usados por uma multidão oscilam em torno do esperado: conte com a média, não com uma rodada de sorte.</p>
<h3>O precipício</h3>
<p>À medida que as infecções ficam mais comuns, mais grupos dão positivo e precisam de retestes, e o melhor grupo encolhe. Acima de 1 − 3<sup>−1/3</sup> ≈ 30,7%, nenhum tamanho de grupo supera testar cada um separadamente. Peter Ungar provou em 1960 que, acima de (3 − √5)/2 ≈ 38%, <em>nenhuma</em> estratégia, por mais engenhosa que seja, supera isso. Na outra ponta, a teoria da informação fixa um piso: cerca de 100·H(<em>p</em>) testes para 100 pessoas, onde H é a entropia binária, por volta de 8 com 1%.</p>
<h3>O que isto deixa de fora</h3>
<p>Aqui todo teste é perfeito. Testes de verdade às vezes deixam passar um caso ou dão alarmes falsos, e agrupar dilui cada amostra: Mutesa e colegas, em Ruanda, verificaram que uma amostra positiva ainda era detectada quando diluída 100 vezes em amostras negativas. O truque do único tubo que brilha é frágil, e os laboratórios não o usam do jeito que está. Os descendentes práticos dele são os grupos de Dorfman e esquemas como o de Ruanda, que arruma as amostras numa grade em forma de cubo, com três pontos de cada lado, e agrupa cada fatia: a mesma ideia dos poços binários, contada de três em três. O modelo também trata as infecções como independentes, enquanto as de verdade se concentram nas mesmas casas, o que pode até ajudar o agrupamento. Dorfman fez a proposta dele para a triagem em tempo de guerra; esta sala não afirma o quanto ela foi usada na época.</p>
<details><summary>A matemática, se você quiser</summary><p>Esquema binário: com os tubos 1, …, <em>n</em>, o teste <em>k</em> (contando a partir de 0) contém todo tubo cujo <em>k</em>-ésimo algarismo binário é 1; com exatamente um positivo, os resultados são os algarismos binários dele, e ⌈log₂(<em>n</em> + 1)⌉ testes bastam e são necessários. Dorfman: um grupo de <em>k</em> custa um teste, mais <em>k</em> outros com chance 1 − (1 − <em>p</em>)<sup><em>k</em></sup>. Agrupar ajuda quando 1/<em>k</em> + 1 − (1 − <em>p</em>)<sup><em>k</em></sup> &lt; 1, ou seja, (1 − <em>p</em>)<sup><em>k</em></sup> &gt; 1/<em>k</em>; o maior <em>p</em> para o qual algum <em>k</em> funciona está em <em>k</em> = 3, onde (1 − <em>p</em>)³ = 1/3. A multidão da sala conta exatamente o grupo que sobra: com grupos de 11, são nove grupos de 11 e uma pessoa testada sozinha. R. Dorfman, “The detection of defective members of large populations”, Ann. Math. Statist. 14 (1943) 436–440. P. Ungar, “The cutoff point for group testing”, Comm. Pure Appl. Math. 13 (1960). L. Mutesa et al., “A pooled testing strategy for identifying SARS-CoV-2 at low prevalence”, Nature 589 (2021).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Group_testing" target="_blank" rel="noopener">Testagem em grupo (em inglês)</a><a class="source-link" href="https://doi.org/10.1214/aoms/1177731363" target="_blank" rel="noopener">Dorfman (1943, em inglês)</a><a class="source-link" href="https://www.nature.com/articles/s41586-020-2885-5" target="_blank" rel="noopener">Mutesa et al., Nature (2021, em inglês)</a><a class="source-link" href="https://arxiv.org/abs/1902.06002" target="_blank" rel="noopener">Aldridge, Johnson e Scarlett (2019, em inglês)</a><a class="source-link" href="https://arxiv.org/abs/2105.08845" target="_blank" rel="noopener">Aldridge e Ellis, testes em grupo na pandemia (em inglês)</a></div>`,
  },
});
