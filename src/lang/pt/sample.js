Wonderlattice.defineText('sample', 'pt', {
  eyebrow: 'AMOSTRAGEM',
  name: 'Uma colherada de cidade',
  tagline: 'Uma pesquisa enorme pode ter certeza e estar errada. Uma pequena e aleatória acerta mais ou menos.',
  title: 'Uma colherada de cidade.',
  subtitle: 'Laranja ou azul: o que a cidade inteira prefere? Você só pode perguntar a algumas pessoas.',
  field: 'Estatística · Amostragem · Erro aleatório e viés',
  sceneLabel: 'Pesquisando uma cidade de brinquedo',
  tip: 'Toque num bairro, ou pressione ← →, para perguntar só ali · ↑ ↓ mudam o tamanho da pesquisa',
  actionLabel: 'Perguntar 50 vezes',
  canvasLabel:
    'Um mapa de uma cidadezinha cujos moradores preferem laranja ou azul, com as pessoas consultadas na última pesquisa acesas, ao lado de um gráfico com um ponto para a estimativa de cada pesquisa. Toque num bairro, ou use as setas para a esquerda e para a direita, para perguntar só ali. As setas para cima e para baixo mudam quantas pessoas cada pesquisa consulta.',
  panelEyebrow: 'Escolha como perguntar',
  whyLabel: 'Por que perguntar mais não ajuda?',
  nudge:
    'Pergunte 50 vezes ao acaso. Depois pergunte aos vizinhos. Duas nuvens de pontos bem juntinhas: qual delas está certa? Mostre a cidade inteira para descobrir.',
  connection: {
    html: '<strong>O acaso, pelos dois lados.</strong> Aqui você adivinha uma cidade inteira a partir de uma colherada. Com os dados estranhos, a contagem diz exatamente o que muitos lançamentos vão fazer.',
    label: 'Lançar os dados estranhos',
  },
  methodLabel: 'Como perguntar',
  methods: ['Ao acaso', 'Vizinhos', 'Voluntários'],
  sceneNames: ['Perguntar ao acaso', (hood) => `No bairro ${hood}`, 'Quem quiser responder'],
  hoodLabel: 'Bairro',
  hoods: [
    'Porto',
    'Cidade Velha',
    'Alto do Morro',
    'Moinho',
    'Beira-Rio',
    'Mercado',
    'Pomar',
    'Estação',
    'Jardins',
    'Olaria',
    'Morro da Lanterna',
    'Cordoaria',
  ],
  sizeLabel: 'Pessoas em cada pesquisa',
  reveal: 'Mostrar o que a cidade inteira prefere',
  askOnce: 'Perguntar uma vez',
  newCity: 'Uma nova cidade',
  cityTitle: (n) => `A cidade · ${n.toLocaleString(Wonderlattice.lang)} moradores`,
  plotTitle: (n) => `Parcela que prefere laranja · um ponto por pesquisa de ${n.toLocaleString(Wonderlattice.lang)}`,
  plotTitleShort: 'Parcela laranja · um ponto por pesquisa',
  blueWins: 'azul vence',
  orangeWins: 'laranja vence',
  wholeCity: (pct) => (pct === null ? 'cidade inteira: ?' : `cidade inteira ${pct}%`),
  before: (name, n) => `○ Antes: ${name}, ${n.toLocaleString(Wonderlattice.lang)} por pesquisa`,
  startHint: 'Pressione “Perguntar 50 vezes”',
  ready: 'Pronto para perguntar',
  surveys: (n) => (n === 1 ? '1 pesquisa' : `${n.toLocaleString(Wonderlattice.lang)} pesquisas`),
  noSurveys: 'Nenhuma pesquisa ainda.',
  noEstimate: 'Cada pesquisa vai acrescentar um ponto.',
  surveyLine: (count, n) =>
    `<strong>${count.toLocaleString(Wonderlattice.lang)}</strong> ${count === 1 ? 'pesquisa' : 'pesquisas'} com ${n.toLocaleString(Wonderlattice.lang)} ${n === 1 ? 'pessoa' : 'pessoas'}`,
  estimateLine: (mean, spread) =>
    spread === null
      ? `Esta diz que ${mean}% preferem laranja.`
      : `Em média, elas dizem que ${mean}% preferem laranja, com uma oscilação típica de ${spread} pontos.`,
  theoryLine: (n, se) =>
    `Uma amostra aleatória de ${n.toLocaleString(Wonderlattice.lang)} oscila cerca de ±${se} pontos.`,
  truthHidden: 'A resposta da cidade inteira está escondida.',
  truthLine: (pct, miss) =>
    miss === null
      ? `A cidade inteira: ${pct}% laranja.`
      : `A cidade inteira: ${pct}% laranja. Erro típico: ${miss} pontos.`,
  randomNote: 'Qualquer pessoa da cidade pode ser consultada.',
  hoodNote: (size, name) => `${size.toLocaleString(Wonderlattice.lang)} pessoas moram no bairro ${name}.`,
  hoodAll: (size, name) =>
    `Só ${size.toLocaleString(Wonderlattice.lang)} pessoas moram no bairro ${name}, então cada pesquisa pergunta a todas elas.`,
  volunteerNote: (answer, total) =>
    `Só conta quem responde: ${answer.toLocaleString(Wonderlattice.lang)} de ${total.toLocaleString(Wonderlattice.lang)}. Quem gosta de laranja tem mais vontade de responder.`,
  volunteerAll: (answer) =>
    `Só ${answer.toLocaleString(Wonderlattice.lang)} pessoas chegam a responder, então cada pesquisa ouve todas elas.`,
  presets: [
    {
      name: 'Uma pesquisa rápida ao acaso',
      note: '50 pessoas, qualquer uma da cidade.',
    },
    {
      name: 'Pergunte aos vizinhos',
      note: '50 pessoas, todas do mesmo bairro.',
    },
    {
      name: 'Uma pesquisa enorme e enviesada',
      note: '1.000 respostas de quem quiser responder.',
    },
  ],
  guests: [
    {
      name: 'Jerzy Neyman',
      note: 'Em 1934, ele alertou que escolher a dedo distritos “típicos” é uma aposta. Escolha ao acaso, defendia, e você consegue dizer o quanto pode estar errando.',
    },
  ],
  live: (n, se, hood, hoodOff, answerOff) =>
    `Na sua cidade, uma amostra aleatória de ${n.toLocaleString(Wonderlattice.lang)} oscila cerca de ±${se} pontos. ` +
    `Perguntar só no bairro ${hood} erra por ${hoodOff} pontos, e contar quem quiser responder erra por ${answerOff}, não importa quantas pessoas você consulte.`,
  insight: {
    title: 'Por que perguntar mais não ajuda?',
    html: `<p>Cada pesquisa aqui escolhe as pessoas ao acaso. Mas o acaso só pode escolher entre as pessoas que um método alcança: a cidade inteira, um bairro, ou os moradores que se dão ao trabalho de responder. Os estatísticos chamam essa lista de <em>base de amostragem</em>. Uma escolha aleatória na base conta algo sobre a base, não sobre a cidade.</p>
<h3>Oscilação e viés</h3>
<p><strong>Erro aleatório</strong> é a oscilação de uma pesquisa para a outra. Ele diminui conforme a amostra cresce, como um sobre a raiz quadrada do tamanho dela: pergunte a quatro vezes mais gente e a oscilação cai pela metade. <strong>Viés</strong> é a diferença entre a resposta da base e a da cidade. Todas as pesquisas feitas na mesma base o compartilham, então perguntar a mais gente não o diminui. Só deixa você mais seguro da resposta errada.</p>
<div class="insight-visual">erro típico² = oscilação² + viés²</div>
<p id="sample-live"></p>
<h3>Milhões de respostas, o vencedor errado</h3>
<p>Em 1936, a revista americana <em>The Literary Digest</em> enviou pelo correio mais de dez milhões de cédulas, principalmente para nomes tirados de listas telefônicas e de registros de automóveis. Voltaram mais de 2,3 milhões, menos de uma em cada quatro. A contagem final dava 54% para Alf Landon e 41% para Franklin Roosevelt. No dia da eleição, Roosevelt venceu com 61%. Pesquisas bem menores, de George Gallup e outros, que escolheram suas amostras com mais cuidado, apontaram Roosevelt como vencedor.</p>
<p>Meio século depois, o cientista político Peverill Squire usou uma pesquisa Gallup de 1937 que perguntava às pessoas se tinham recebido uma cédula do Digest e se a tinham devolvido. Ele descobriu que tanto a lista quanto as respostas pendiam para Landon, e que as duas coisas juntas causaram o erro. Se todos na lista tivessem respondido, a pesquisa pelo menos teria apontado o vencedor certo.</p>
<h3>A oscilação, exatamente</h3>
<p>Para uma amostra aleatória de <em>n</em> pessoas de uma cidade de <em>N</em>, em que uma parcela <em>p</em> prefere laranja, a oscilação típica (o erro padrão) é √(<em>p</em>(1 − <em>p</em>)/<em>n</em>) × √((<em>N</em> − <em>n</em>)/(<em>N</em> − 1)). O segundo fator, a correção para população finita, existe porque ninguém é consultado duas vezes. Ele importa aqui porque a cidade é pequena, e chega a zero quando você pergunta a todo mundo. A sala usa essa fórmula corrigida.</p>
<details><summary>O que esta cidade de brinquedo deixa de fora</summary><p>Duas cores, bairros sorteados ao acaso, moradores que nunca mudam de ideia e uma taxa de resposta que depende só da cor. Pesquisas de verdade escolhem as pessoas de um jeito mais esperto (Jerzy Neyman defendeu em 1934 a amostragem aleatória dentro de grupos, chamados estratos), depois ponderam as respostas para bater com o que se sabe da população e corrigem para quem não respondeu. As próprias pesquisas de Gallup nos anos 1930 preenchiam cotas de diferentes tipos de pessoas, um método com falhas próprias. A margem de erro publicada ao lado de uma pesquisa descreve só a oscilação aleatória; ela não enxerga o viés.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1086/269085" target="_blank" rel="noopener">Squire: por que a pesquisa do Literary Digest de 1936 falhou (1988, em inglês)</a><a class="source-link" href="https://doi.org/10.2307/2342192" target="_blank" rel="noopener">Neyman sobre amostragem aleatória versus intencional (1934, em inglês)</a><a class="source-link" href="https://online.stat.psu.edu/stat506/Lesson02" target="_blank" rel="noopener">O erro padrão de uma proporção amostral (Penn State STAT 506, em inglês)</a></div>`,
  },
});
