/* A torre inclinada de blocos · palavras para o visitante (pt). */
Wonderlattice.defineText('blocks', 'pt', {
  eyebrow: 'EQUILÍBRIO',
  name: 'A torre inclinada de blocos',
  tagline: 'Até onde uma pilha de blocos consegue avançar além da borda?',
  title: 'A torre inclinada de blocos.',
  subtitle:
    'Empilhe blocos na beira de uma mesa, cada um um pouco mais para fora. Até onde o bloco de cima consegue passar da borda?',
  field: 'Centro de massa · Série harmônica · Uma surpresa lenta',
  sceneLabel: 'A borda de uma mesa · Blocos para empilhar',
  sceneName: (n) => (n === 0 ? 'Mesa vazia' : 'Blocos empilhados'),
  tip: 'Arraste um bloco na pilha ou use as setas para empurrar o bloco de cima. Aperte B para a Pilha ideal.',
  actionLabel: 'Pilha ideal',
  lengthsLabel: (oh) => `${oh.toFixed(2).replace('.', ',')} comprimentos`,
  canvasLabel:
    'Uma mesa com blocos empilhados na borda. Arraste os blocos para mudar a posição deles. A pilha tomba se o centro de massa passar do apoio.',
  panelEyebrow: 'Ajuste a pilha',
  whyLabel: 'Por que ela chega tão longe?',
  nudge:
    'Comece com poucos blocos. Será que 4 blocos levam o de cima inteiro para fora da mesa? Tente 31 blocos para dois comprimentos.',

  connection: {
    html: '<strong>Um argumento simples por trás de uma surpresa.</strong> Aqui, equilibrar cada bloco sobre o de baixo explica até onde uma pilha pode se inclinar. Em O piso impossível, colorir as casas mostra por que alguns pisos nunca podem ser cobertos.',
    label: 'Ver o piso impossível',
  },

  presets: [
    { name: '4 blocos', note: 'O bloco de cima passa inteiro da borda da mesa.' },
    { name: '31 blocos', note: 'Dois comprimentos de bloco para fora.' },
    { name: 'Pilha ideal', note: 'Cada bloco na sua posição ideal.' },
  ],

  blocks: 'Blocos',
  blocksHint: 'Quantos blocos há na pilha',

  status: (n, overhang) =>
    `${n} bloco${n === 1 ? '' : 's'} · ${overhang.toFixed(2).replace('.', ',')} comprimento${overhang === 1 ? '' : 's'} para fora`,
  toppled: 'A pilha tombou.',

  milestones: {
    m1: 'Bloco de cima inteiro para fora',
    m2: 'Dois comprimentos para fora',
    m3: 'Três comprimentos',
  },

  bestLabel: 'Pilha ideal',
  resetLabel: 'Recomeçar',

  guests: [
    {
      name: 'Nicole Oresme',
      note: 'Por volta de 1350, Oresme provou que a série harmônica diverge, ou seja, que a saliência não tem limite.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Euler estudou a fundo a série harmônica, inclusive o quanto ela cresce devagar.',
    },
  ],

  insight: {
    title: 'Por que uma pilha pode chegar tão longe quanto você quiser?',
    html: `<p>Cada bloco fica parado sobre o de baixo desde que o <strong>centro de massa</strong> de todos os blocos acima de cada apoio esteja sobre esse apoio. Monte a pilha de cima para baixo, com cada bloco o mais para fora possível: o de cima pode avançar ½ do seu comprimento, o seguinte ¼, depois ⅙, e assim por diante.</p>
<p>A saliência total depois de <em>n</em> blocos é ½(1 + ½ + ⅓ + … + 1/<em>n</em>), a metade da <em>n</em>-ésima soma parcial da <strong>série harmônica</strong>. A série diverge, então a saliência não tem limite. Mas ela cresce como ½ ln <em>n</em>: devagar, devagar demais.</p>
<div class="insight-visual">4 blocos → 1 comprimento para fora. 31 blocos → 2. 227 blocos → 3.</div>
<h3>A contagem</h3>
<p>São precisos exatamente 4 blocos para que o de cima passe inteiro da borda da mesa (saliência maior que 1), 31 para dois comprimentos e 227 para três. Cada comprimento a mais exige cerca de <em>e</em><sup>2</sup> ≈ 7,4 vezes mais blocos que o anterior.</p>
<h3>O que este modelo supõe</h3>
<p>Blocos idealizados: rígidos, perfeitamente uniformes, com contato sem atrito. Livros de verdade escorregam e se dobram. A pilha de um bloco por camada mostrada aqui não é a mais eficiente quando há muitos blocos: Paterson e Zwick (2009) encontraram arranjos com vários blocos por camada cuja saliência cresce como <em>n</em><sup>1/3</sup>, e não como log <em>n</em>.</p>
<details><summary>A matemática, se você quiser</summary><p>Seja <em>c<sub>k</sub></em> o centro do bloco <em>k</em>, contando de cima (bloco 1 = o de cima). O bloco de cima sozinho pode ser deslocado até que seu centro de massa fique exatamente sobre a borda direita do bloco 2, o que dá uma saliência de ½. Depois, o centro de massa conjunto dos blocos 1 e 2 precisa ficar sobre a borda direita do bloco 3, o que acrescenta ¼. Por indução, o deslocamento ideal do bloco <em>k</em> em relação ao bloco <em>k</em>+1 é 1/(2<em>k</em>), e a saliência total é ½ · H(<em>n</em>), onde H(<em>n</em>) é o <em>n</em>-ésimo número harmônico.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Block-stacking_problem" target="_blank" rel="noopener">O problema de empilhar blocos (Wikipedia, em inglês)</a><a class="source-link" href="https://arxiv.org/abs/0710.2357" target="_blank" rel="noopener">Paterson &amp; Zwick, “Overhang” (2009, em inglês)</a></div>`,
  },
});
