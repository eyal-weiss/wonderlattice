Wonderlattice.defineText('compress', 'pt', {
  eyebrow: 'COMPRESSÃO',
  name: 'Quanto de uma imagem dá para jogar fora?',
  tagline:
    'Jogue fora 90% dos números de uma imagem e quase não dá para notar. Jogue fora os 10% errados e ela fica arruinada.',
  title: 'Quanto de uma imagem dá para jogar fora?',
  subtitle: 'Uma imagem é uma lista de números. Guarde só alguns deles e veja o que sobra.',
  field: 'Sinais · Peças básicas · Uma pequena surpresa',
  sceneLabel: '64 blocos · 64 números cada',
  actionLabel: 'Trocar fortes e fracos',
  canvasLabel:
    'À esquerda, a sua imagem. No meio, a imagem refeita só com os números guardados. À direita, as 64 peças básicas, ' +
    'mais claras onde a imagem mais as usa. Arraste sobre a sua imagem para desenhar nela. Com o teclado, mova-se com as ' +
    'setas e aperte Enter para pintar.',
  tip: 'Arraste sobre a sua imagem para desenhar · As setas e o Enter também pintam',
  panelEyebrow: 'Escolha o que guardar',
  whyLabel: 'Como quase toda a imagem pode sumir?',
  nudge:
    'Guarde só os 10% mais fortes: dá para notar? Agora troque para os mais fracos e guarde 90% dos números. O que aconteceu?',
  connection: {
    html: '<strong>Bits perdidos por acidente, ou de propósito.</strong> Aqui jogamos números fora e quase não notamos. Em “Mande uma imagem através da tempestade”, alguns bits extras bem pensados impedem que uma tempestade arruíne uma imagem.',
    label: 'Visite “Mande uma imagem através da tempestade”',
  },
  yours: 'A sua imagem',
  survives: 'O que sobra',
  blocks: 'As peças básicas',
  broad: 'manchas largas',
  fine: 'ondas finas',
  pictureLabel: 'Escolha uma imagem, ou desenhe na sua',
  pictures: { sunset: 'Pôr do sol', face: 'Rosto', checks: 'Xadrez', rings: 'Anéis' },
  modeLabel: 'Quais números guardar',
  modes: ['Os mais fortes', 'Os mais fracos'],
  modeHints: ['Os maiores números, seja qual for o bloco a que pertencem.', 'Os menores números; os maiores vão fora.'],
  keepLabel: 'Quantos números guardar',
  keepHint: 'De 4.096: 64 blocos de 8 × 8 pixels, cada um escrito como 64 números.',
  kept: 'Números guardados',
  keptValue: (count, share) => `${count.toLocaleString(Wonderlattice.lang)} de 4.096 (${share}%)`,
  energy: 'Parte da energia da imagem guardada',
  energyValue: (share) => `${share}%`,
  difference: 'Diferença para a sua imagem',
  differenceValue: (share) => `${share}%`,
  verdicts: ['Quase impossível de distinguir', 'Um pouco suave', 'Borrada', 'Arruinada'],
  status: (verdict, share) => `${verdict} · ${share}% dos números`,
  announce: (verdict, share, difference) => `${verdict}: ${share}% dos números guardados, ${difference}% de diferença.`,
  yourPicture: 'A sua própria imagem',
  presets: [
    { name: 'Os 10% mais fortes', note: 'Dá para notar?', badge: '10%' },
    { name: 'Jogar fora os 10% mais fortes', note: '90% dos números, arruinada.', badge: '90%' },
    { name: 'Só 2%', note: 'Só manchas largas.', badge: '2%' },
  ],
  guests: [
    {
      name: 'Joseph Fourier',
      note: 'Estudando como o calor se espalha, afirmou que qualquer curva pode ser feita de ondas. Imagens também.',
    },
    {
      name: 'Nasir Ahmed',
      note: 'Propôs a transformada do cosseno no começo dos anos 1970. Quase toda foto da internet é guardada com ela.',
    },
  ],
  insight: {
    title: 'Como quase toda a imagem pode sumir?',
    html: `<p>Para um computador, esta imagem é 4.096 números: um brilho para cada pixel. Corte-a em blocos de 8 × 8 pixels, e cada bloco também pode ser escrito como uma receita: quanto de cada um de 64 padrões fixos somar. Os padrões vão de uma mancha uniforme (a média do bloco) até ondas cada vez mais finas. A receita também tem 64 números e refaz o bloco exatamente. Nada se perdeu ainda.</p>
<div class="insight-visual">64 pixels ⇄ 64 quantidades de 64 peças básicas</div>
<h3>Por que a maioria dos números quase não importa</h3>
<p>Na maioria das imagens, pixels vizinhos são parecidos, então um bloco é quase só a sua média mais algumas ondas suaves. Quase toda a energia da imagem cai em poucos números grandes, e o resto é minúsculo. Guarde os grandes, zere o resto, e a imagem refeita parece quase igual. Essa é a ideia por trás do JPEG.</p>
<h3>Por que os 10% errados arruínam a imagem</h3>
<p>Se, em vez disso, você jogar fora os maiores números, mesmo guardando 90% do resto, o que sobra é poeira: as médias e as formas principais sumiram. Quantos números você guarda importa bem menos do que quais.</p>
<h3>Por que bordas custam caro</h3>
<p>Uma borda nítida ou listras finas são feitas de muitas ondas ao mesmo tempo, então “Xadrez” e “Anéis” precisam de muito mais números do que “Pôr do sol” para a mesma qualidade. Jogando fora números demais, sobram quadradinhos grosseiros e ecos fracos ao lado das bordas, as marcas de uma foto comprimida demais.</p>
<h3>O que esta sala deixa de fora</h3>
<p>O JPEG de verdade também separa o brilho da cor e guarda a cor com menos detalhe, arredonda cada número para um passo definido por uma tabela (passos maiores para as ondas finas, que o olho nota menos) e empacota o resultado com uma codificação esperta. Aqui simplesmente guardamos os maiores números da imagem toda, sem arredondar. As peças básicas e a surpresa são as mesmas.</p>
<details><summary>A matemática, se você quiser</summary><p>Cada bloco usa a transformada discreta do cosseno bidimensional (DCT-II): a quantidade do padrão (u, v) é a soma, sobre o bloco, dos valores dos pixels vezes C(u, y)·C(v, x), onde C(k, n) = a(k)·cos((2n + 1)kπ / 16), com a(0) = √(1/8) e a(k) = √(2/8) nos outros casos. Esses 64 padrões são ortonormais, então a transformada inversa usa a mesma tabela, e a soma dos quadrados dos números é igual à soma dos quadrados dos pixels. Por isso a “energia guardada” é exatamente a parte dessa soma que os números guardados carregam. A diferença mostrada é a raiz da média dos quadrados das diferenças de brilho, como parte do branco total.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_cosine_transform" target="_blank" rel="noopener">Transformada discreta de cosseno, Wikipédia (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/JPEG" target="_blank" rel="noopener">JPEG, Wikipédia (em inglês)</a><a class="source-link" href="https://doi.org/10.1145/103085.103089" target="_blank" rel="noopener">Wallace, “The JPEG still picture compression standard”, Communications of the ACM 34 (1991) (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Fourier/" target="_blank" rel="noopener">Joseph Fourier, MacTutor (em inglês)</a></div>`,
  },
});
