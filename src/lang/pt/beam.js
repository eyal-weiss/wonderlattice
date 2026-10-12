/* A régua em pé · palavras para o visitante (pt). */
Wonderlattice.defineText('beam', 'pt', {
  eyebrow: 'VIGAS',
  name: 'A régua em pé',
  tagline:
    'Apoie uma prancha de aço sobre a borda e ela fica 36 vezes mais rígida. Pinte a sua própria viga e descubra onde o aço deve ficar.',
  title: 'A régua em pé.',
  subtitle:
    'Uma viga de aço com um peso no meio e, embaixo, a sua seção transversal. Ponha-a em pé, ou pinte os 24 quadrados de aço onde quiser, e veja quanto ela cede.',
  field: 'Momento de inércia de área · Teoria de vigas de Euler–Bernoulli · Vigas I',
  sceneLabel: 'Uma viga de aço e a sua seção transversal',
  sceneNames: {
    plank: 'Uma prancha deitada',
    edge: 'Em pé',
    ibeam: 'Uma viga I',
    own: 'A sua própria viga',
    none: 'Ainda sem aço',
  },
  tip: 'Toque ou arraste pelos quadrados para pôr ou tirar aço · As setas movem, Enter pinta, Backspace desfaz',
  actionLabel: 'Girar 90°',
  canvasLabel:
    'Uma viga de aço apoiada em dois suportes, com um peso de 100 kg pendurado no meio, acima de uma grade de 12 por 12 da sua seção transversal. Toque ou arraste pela grade para pôr ou tirar quadrados de aço, ou use as setas e Enter.',
  panelEyebrow: 'Aço e forma',
  whyLabel: 'Por que em pé ela ganha?',
  nudge:
    'Dá para superar a prancha em pé com os mesmos 24 quadrados? Depois corte a alma fina que liga o topo da sua melhor viga à base: quão rígidas são as duas metades soltas?',
  connection: {
    html: '<strong>Aço onde importa.</strong> Uma treliça é uma viga da qual se tirou quase todo o meio: as barras de cima são comprimidas, as de baixo, esticadas, e triângulos mantêm tudo junto. Veja em “O triângulo teimoso”.',
    label: 'Visitar “O triângulo teimoso”',
  },

  presets: [
    { name: 'Uma prancha deitada', note: '12 cm de largura e 2 cm de espessura, deitada.' },
    { name: 'Em pé', note: 'A mesma prancha, girada 90°.' },
    { name: 'Uma viga I', note: 'Aço em cima e embaixo, com uma alma fina entre eles.' },
  ],

  undo: 'Desfazer',
  clear: 'Limpar',

  // Drawn in the picture: keep these short.
  picture: {
    caption: '3 m de aço, com 100 kg no meio',
    drawn: (n) => `Flexão desenhada ${n} vezes maior`,
    drawnShort: (n) => `Flexão ${n}× maior`,
    weight: '100 kg',
    sag: (mm) => `Cede ${mm} mm`,
    beyond: 'Cede mais de 10 cm',
    none: 'Sem aço',
    section: 'Seção da viga',
    unit: '1 quadrado = 1 cm',
    squares: (used, total) => `${used} de ${total} quadrados`,
    stiffness: 'Rigidez',
    times: (x) => `${x}× a deitada`,
    timesShort: (x) => `${x}×`,
    chart: 'Mesmo aço, outras formas: quão rígidas?',
    rows: { plank: 'Deitada', edge: 'Em pé', ibeam: 'Uma viga I', yours: 'A sua' },
    marks: { plank: 'Deitada', edge: 'Em pé', best: 'Melhor com 24' },
    key: { squeezed: 'Comprimido', stretched: 'Esticado', axis: 'Neutro' },
    loose: (k) => `${k} peças soltas: cada uma verga sozinha`,
    wobbly: 'Instável: pode tombar para o lado',
    full: 'Acabou o aço: toque num quadrado para tirá-lo',
    best: 'O mais rígido possível com 24 quadrados',
  },

  // The panel's readout and the status line.
  status: {
    sag: (mm) => `Cede ${mm} mm`,
    said: (mm, x) => `Cede ${mm} mm, com ${x} vezes a rigidez da prancha deitada`,
    beyond: 'Cede mais de 10 cm',
    none: 'Sem aço',
  },
  readout: {
    sag: (mm) => `Cede ${mm} mm`,
    times: (x) => `${x}× a prancha deitada`,
    plank: 'A prancha deitada',
    used: (used, total) =>
      used === total ? `Todos os ${total} quadrados de aço usados.` : `${used} de ${total} quadrados de aço usados.`,
    none: 'Pinte alguns quadrados de aço na grade.',
    beyond: 'Além de 10 cm, a teoria simples usada aqui deixa de ser confiável.',
    loose: (k) =>
      `${k} peças soltas: quadrados que não compartilham um lado deslizam um sobre o outro, então cada peça verga sozinha.`,
    wobbly:
      'Alta e fina: sob o peso, ela poderia tombar ou se torcer para o lado (uma regra prática, veja o “Por que”).',
    best: 'Tão rígida quanto 24 quadrados conseguem ser nesta grade.',
  },

  guests: [
    {
      name: 'Galileu Galilei',
      note: 'Em 1638, escrevi que uma régua em pé resiste mais a quebrar do que uma deitada, tantas vezes mais quanto ela é mais larga do que grossa. Também vi que os ossos das aves e os juncos são ocos: leves, mas difíceis de dobrar.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Jacob Bernoulli supôs que uma viga dobrada se curva em proporção à força que tende a girá-la. Em 1744, segui essa ideia com o cálculo e encontrei as curvas de tiras elásticas dobradas.',
    },
    {
      name: 'Claude-Louis Navier',
      note: 'Em 1819, descobri onde fica de verdade a linha de uma viga dobrada que não é nem comprimida nem esticada, corrigindo Galileu. Em 1826, separei o que o material de uma viga dá à sua rigidez do que lhe dá a sua forma.',
    },
  ],

  insight: {
    title: 'Por que em pé ela ganha?',
    html: `<p>Dobre uma viga e o topo dela é comprimido, enquanto a base é esticada. Entre os dois passa uma linha que não é nem uma coisa nem outra, a linha neutra, pelo meio da seção transversal (o seu centroide). O aço longe dessa linha é muito comprimido ou esticado mesmo numa dobra pequena, então resiste com força, e ainda empurra com mais alavanca. Os dois efeitos crescem com a distância, então cada quadrado conta com o <em>quadrado</em> da sua distância até a linha. Somando tudo, obtém-se o momento de inércia de área, I, em cm⁴.</p>
<div class="insight-visual">I = Σ (1/12 + d²) nos quadrados · quanto cede = F·L³ ⁄ (48·E·I)</div>
<h3>Deitada ou em pé</h3>
<p>Para um retângulo de largura b e altura h, I = b·h³ ⁄ 12, então a altura conta três vezes. A prancha de 12 cm de largura e 2 cm de espessura tem I = 8 cm⁴ deitada e 288 cm⁴ em pé: (12 ÷ 2)² = 36 vezes mais rígida, com o mesmo aço. Com 100 kg no meio de 3 m de aço (E = 200 GPa), ela cede 34 mm deitada e menos de 1 mm em pé. Uma régua de plástico de 30 mm de largura e 1 mm de espessura é (30 ÷ 1)² = 900 vezes mais rígida em pé.</p>
<h3>A viga I</h3>
<p>O melhor lugar para o aço é o mais longe possível do meio: uma aba ao longo do topo e outra ao longo da base. Mas elas precisam estar ligadas, senão deslizam uma sobre a outra como as páginas de um livro, e cada uma verga sozinha: duas tiras soltas de 12 quadrados têm, juntas, I = 2 cm⁴. Uma alma fina as mantém unidas. Com 7 quadrados em cada aba e 10 na alma, I = 508 cm⁴, 63,5 vezes a prancha deitada, e o máximo que 24 quadrados ligados conseguem dar nesta grade. Ossos, bambus, quadros de bicicleta e tubos de andaime são ocos pelo mesmo motivo. Em 1638, Galileu apontou para os ossos das aves e para os juncos, e mostrou que uma régua em pé é mais difícil de quebrar, na razão entre a sua largura e a sua espessura.</p>
<h3>O que este modelo deixa de fora</h3>
<p>Uma viga alta e fina ganha no papel, mas pode tombar, ou se torcer e flambar para o lado sob a carga (flambagem lateral com torção), e uma alma ou aba fina pode se amassar. O aviso de instabilidade é uma regra prática desta sala: uma forma mais de 20 vezes mais rígida para cima e para baixo do que para os lados. Engenheiros verificam a coisa de verdade, que também depende do vão, da carga e de quanto a viga resiste à torção, e travam vigas altas e finas, como as vigas de um assoalho. Rigidez (quanto uma viga cede) não é resistência (quando ela quebra, ou fica dobrada de vez): esta sala trata de rigidez. O quanto a viga cede vem da teoria para pequenas deformações. Ela deixa de fora o peso próprio da viga (cerca de 57 kg de aço aqui, que a fariam ceder cerca de um terço a mais em cada caso) e o pouquinho a mais que ela cede por cisalhamento, e supõe que a viga é mantida reta lateralmente, então uma forma torta não se desvia para o lado. Quadrados unidos lado a lado contam como soldados; quadrados que só se tocam num canto, não.</p>
<details><summary>A matemática, se você quiser</summary><p>Um quadrado de lado 1 cujo centro está a uma distância d da linha neutra soma ∫ y² dA = 1/12 + d² a I (o teorema dos eixos paralelos), então I é uma soma sobre os quadrados pintados. A linha neutra de cada peça passa pelo seu centroide: a altura média dos seus quadrados. Peças soltas são tratadas como vigas que vergam lado a lado, cedendo o mesmo tanto, então os seus I se somam. A forma da viga dobrada é v(x) = F·x·(3L² − 4x²) ⁄ (48·E·I) até o meio, onde ela cede F·L³ ⁄ (48·E·I). O máximo que 24 quadrados ligados conseguem alcançar foi encontrado por uma busca exata sobre quantos quadrados ficam em cada linha: cada linha entre o topo e a base precisa de pelo menos um, e o melhor lugar para o resto são as linhas de cima e de baixo, divididos igualmente. Os números foram conferidos com um programa independente.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Second_moment_of_area" target="_blank" rel="noopener">Momento de inércia de área (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Euler%E2%80%93Bernoulli_beam_theory" target="_blank" rel="noopener">Teoria de vigas de Euler–Bernoulli (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/I-beam" target="_blank" rel="noopener">Viga I (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Claude-Louis_Navier" target="_blank" rel="noopener">Claude-Louis Navier (Wikipedia, em inglês)</a><a class="source-link" href="https://archive.org/details/dialoguesconcern00galiuoft" target="_blank" rel="noopener">Galileu (1638), Dialogues Concerning Two New Sciences, Segundo Dia (trad. Crew e de Salvio, 1914, em inglês)</a></div>`,
  },
});
