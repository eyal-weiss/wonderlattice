/* Círculos até lá embaixo · palavras para o visitante (pt). */
Wonderlattice.defineText('gasket', 'pt', {
  eyebrow: 'CÍRCULOS QUE SE BEIJAM',
  name: 'Círculos até lá embaixo',
  tagline: 'Preencha cada vão com o maior círculo que couber, para sempre, e cada círculo ganha um número inteiro.',
  title: 'Círculos até lá embaixo.',
  subtitle:
    'Cada vão recebe o maior círculo que couber, para sempre. O número num círculo é a sua curvatura, 1 ÷ o raio: sempre inteiro. Toque em qualquer círculo.',
  field: 'Geometria · Números inteiros · Fractais',
  sceneLabel: 'Curvatura = 1 ÷ raio',
  tip: 'Toque num círculo para ver a sua regra · Arraste um círculo inicial para mudar o tamanho dele · Use pinça, rolagem ou + e − para dar zoom · Enter escolhe um círculo',
  actionLabel: 'Mergulhar',
  canvasLabel:
    'Um grande círculo cheio de círculos cada vez menores que se tocam, cada um com a sua curvatura escrita dentro.',
  panelEyebrow: 'Escolha os círculos iniciais',
  whyLabel: 'Por que são todos números inteiros?',
  nudge:
    'Aumente um pouco um círculo inicial, arrastando-o ou com o controle dele: as curvaturas lá dentro viram decimais. Depois toque em Metades para trazê-las de volta.',
  connection: {
    html: '<strong>Outra imagem sem fundo.</strong> Aqui uma regra preenche vãos com círculos para sempre; na sala seguinte, uma regra, repetida, desenha litorais sem fim.',
    label: 'Uma paisagem infinita',
  },

  presets: [
    { name: 'Metades', note: '−1, 2, 2, 3: dois círculos, cada um com metade da largura do grande.' },
    { name: 'Terços', note: '−2, 3, 6, 7: dois terços e um terço da largura.' },
    { name: 'Quartos', note: '−3, 4, 12, 13: três quartos e um quarto.' },
    { name: 'Mexido', note: 'Um círculo um pouco maior: as curvaturas lá dentro viram decimais.' },
  ],
  yourOwn: 'Seus próprios círculos',

  left: 'Curvatura do círculo da esquerda',
  right: 'Curvatura do círculo da direita',
  bendHint: 'Quanto maior a curvatura, menor o círculo.',

  readout: {
    tapped: 'O círculo que você tocou',
    rule: 'De onde vem o número dele',
    all: 'Todas as curvaturas desenhadas',
  },
  tapHint: 'Toque em qualquer círculo, por menor que seja.',
  bend: (b) => `Curvatura ${b}`,
  outer: (b) =>
    `Curvatura ${b}: o círculo grande se curva no sentido contrário em volta dos outros, então a sua curvatura conta como negativa.`,
  ruleWords:
    'O dobro da soma das curvaturas dos três que ele toca (em azul), menos a curvatura do círculo do outro lado (tracejado).',
  whole: (n, low, high) => `Números inteiros, de ${low} a ${high}, em ${n} círculos`,
  notWhole: (n) => `Números não inteiros: ${n} círculos`,

  // Over the picture.
  status: (whole) => (whole ? 'Toda curvatura é inteira' : 'Curvaturas com decimais'),
  zoom: (x) => `×${x}`,
  bigCircle: 'Círculo grande',

  // Read out once, when a circle is tapped or a dive ends.
  told: (b, rule) => `Curvatura ${b}. ${rule}`,
  dived: (x, high) => `Ampliado ${x} vezes. A maior curvatura desenhada é ${high}.`,

  guests: [
    {
      name: 'René Descartes',
      note: 'Em 1643, ele escreveu à princesa Elisabeth sobre círculos que se tocam e deu a regra das curvaturas deles sem dizer como a encontrou.',
    },
    {
      name: 'Elisabeth do Palatinado',
      note: 'Ela trabalhou no problema de círculos que Descartes lhe mandou em 1643. As respostas parciais dela o levaram ao caso de quatro círculos que se tocam.',
    },
    {
      name: 'Frederick Soddy',
      note: 'Químico ganhador de um Prêmio Nobel, ele reencontrou a regra em 1936 e a publicou na revista Nature como um poema, The Kiss Precise.',
    },
  ],

  insight: {
    title: 'Por que são todos números inteiros?',
    html: `<p>Chame de <em>curvatura</em> o número 1 dividido pelo raio de um círculo: um círculo pequeno se curva muito; um grande, pouco. O círculo grande de fora recebe uma curvatura negativa, porque se curva no sentido contrário em volta dos círculos de dentro. Então, quatro círculos que se tocam todos entre si obedecem a uma única regra, o teorema dos círculos de Descartes:</p>
<div class="insight-visual">(b₁ + b₂ + b₃ + b₄)² = 2 × (b₁² + b₂² + b₃² + b₄²)</div>
<p>Para os quatro primeiros círculos de Metades, −1, 2, 2 e 3: 6² = 36, e 2 × (1 + 4 + 4 + 9) = 36.</p>
<h3>Entram inteiros, saem inteiros</h3>
<p>Pegue três círculos que se tocam entre si. Exatamente dois círculos tocam os três, um de cada lado, e a regra é uma equação do segundo grau para as curvaturas deles. As duas soluções de uma equação do segundo grau somam um número que se lê direto nos coeficientes: aqui, o dobro da soma das três curvaturas. Então, conhecido um dos dois círculos, o outro tem curvatura 2 × (b₁ + b₂ + b₃) − b₄. Isso é só dobrar, somar e subtrair. Cada círculo novo preenche um vão ao lado de círculos que já estão lá; então, quando as quatro primeiras curvaturas são números inteiros, toda curvatura da imagem também é um número inteiro, por menor que seja o círculo. Um toque mostra isso para qualquer círculo: os três círculos azuis que ele toca e o tracejado do outro lado.</p>
<p>Isso só funciona a partir de números inteiros. Mexa num círculo inicial e as curvaturas viram decimais; só círculos iniciais especiais, como Metades, Terços e Quartos, dão números inteiros em toda parte. Os centros seguem a mesma regra, escritos como números complexos e multiplicados pelas suas curvaturas, e é assim que a imagem é desenhada.</p>
<h3>Desenhado de forma aproximada</h3>
<p>O empacotamento de verdade nunca termina: cada vão contém infinitos círculos. A imagem só vai até círculos de cerca de um pixel de largura, e ampliar desenha os seguintes. A dimensão fractal dele é cerca de 1,3057, entre a de uma curva (1) e a de uma região preenchida (2).</p>
<details><summary>Quais números inteiros? Uma descoberta em andamento</summary><p>Nem todo número inteiro pode aparecer. Em Metades, toda curvatura dividida por 24 deixa resto 2, 3, 6, 11, 14, 15, 18 ou 23. Num artigo publicado em 2003, Ronald Graham, Jeffrey Lagarias, Colin Mallows, Allan Wilks e Catherine Yan conjecturaram que, num empacotamento como este, todo número grande o bastante com um resto permitido acaba aparecendo: a conjectura local–global. Em 2023, Summer Haag, aluna de pós-graduação, e Clyde Kertzer, aluno de graduação, trabalhando com Katherine Stange e James Rickards na Universidade do Colorado em Boulder, mostraram que ela é falsa: em muitos empacotamentos, famílias completas de números permitidos nunca aparecem. O empacotamento que começa com −3, 5, 8 e 8, por exemplo, não tem nenhuma curvatura que seja um quadrado perfeito, embora os restos dele permitam quadrados como 36 e 144. O artigo deles foi publicado nos <em>Annals of Mathematics</em> em 2024. Que toda curvatura é um número inteiro nunca esteve em dúvida; quais números inteiros aparecem ainda está sendo estudado.</p></details>
<details><summary>Quem encontrou a regra</summary><p>René Descartes a descreveu em 1643, em cartas à princesa Elisabeth do Palatinado, sem dizer como a encontrou. Jakob Steiner a reencontrou em 1826, Philip Beecroft em 1842 e o químico Frederick Soddy em 1936, que a publicou na <em>Nature</em> como um poema, <em>The Kiss Precise</em>. O empacotamento leva o nome de Apolônio de Perga, que no século III a.C. escreveu um livro, hoje perdido, sobre círculos que tocam três círculos dados. A descrição mais antiga que se conhece do empacotamento em si é de Gottfried Leibniz, em 1706.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Descartes%27_theorem" target="_blank" rel="noopener">Teorema de Descartes (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Apollonian_gasket" target="_blank" rel="noopener">Empacotamento de Apolônio (Wikipedia, em inglês)</a><a class="source-link" href="https://arxiv.org/abs/math/0101066" target="_blank" rel="noopener">Lagarias, Mallows e Wilks, Beyond the Descartes circle theorem (2002, em inglês)</a><a class="source-link" href="https://arxiv.org/abs/math/0009113" target="_blank" rel="noopener">Graham, Lagarias, Mallows, Wilks e Yan, Apollonian circle packings: number theory (2003, em inglês)</a><a class="source-link" href="https://arxiv.org/abs/2307.02749" target="_blank" rel="noopener">Haag, Kertzer, Rickards e Stange, The local-global conjecture for Apollonian circle packings is false (2024, em inglês)</a><a class="source-link" href="https://www.quantamagazine.org/two-students-unravel-a-widely-believed-math-conjecture-20230810/" target="_blank" rel="noopener">Two students unravel a widely believed math conjecture (Quanta Magazine, em inglês)</a><a class="source-link" href="https://doi.org/10.1038/1371021a0" target="_blank" rel="noopener">Soddy, The Kiss Precise (Nature, 1936, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/" target="_blank" rel="noopener">René Descartes (MacTutor, em inglês)</a></div>`,
  },
});
