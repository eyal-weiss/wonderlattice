Wonderlattice.defineText('julia', 'pt', {
  eyebrow: 'FRACTAIS',
  name: 'Uma semente para uma paisagem infinita',
  tagline: 'Uma regra, repetida, desenha litorais sem fim. Mova a semente e veja como eles mudam.',
  title: 'Uma semente para uma paisagem infinita.',
  subtitle:
    'Eleve um número ao quadrado, some uma semente e repita. Arraste a semente e veja uma paisagem inteira mudar.',
  field: 'Números complexos · Repetição · Fractais',
  sceneLabel: 'Uma regra · z → z² + c',
  tip: 'Arraste a semente no mapa pequeno, ou use as setas · Toque na imagem grande para seguir a viagem de um ponto',
  actionLabel: 'Percorrer a borda',
  canvasLabel:
    'Um grande conjunto de Julia da regra z → z² + c e um pequeno mapa de sementes, o conjunto de Mandelbrot, com a semente escolhida marcada.',
  panelEyebrow: 'Escolha uma semente',
  whyLabel: 'Como uma única regra desenha tudo isso?',
  nudge:
    'Arraste a semente para fora da forma escura do mapa pequeno. A paisagem se desfaz em poeira. Traga-a de volta para dentro, e ela volta a ser uma peça só.',
  connection: {
    html: '<strong>Números complexos podem mover um plano inteiro.</strong> Aqui uma regrinha se repete sem parar; na sala seguinte, uma única função entorta o plano de uma vez.',
    label: 'Entorte o plano',
  },
  presets: [
    { name: 'Coelho', note: 'Três orelhas girando sem parar.' },
    { name: 'Dendrito', note: 'Galhos sem nenhum espaço por dentro.' },
    { name: 'São Marcos', note: 'Uma basílica e seu reflexo.' },
    { name: 'Disco de Siegel', note: 'Os pontos giram para sempre em volta de um centro escondido.' },
    { name: 'Poeira', note: 'Fora do mapa: uma nuvem de grãozinhos.' },
  ],
  yourOwn: 'Sua própria paisagem',
  labels: {
    julia: 'A paisagem desta semente',
    map: 'O mapa das sementes',
  },
  seed: (z) => `c = ${z}`,
  onePiece: 'Uma peça só',
  dust: 'Poeira',
  status: (inside) => (inside ? 'Semente dentro do mapa: uma peça só' : 'Semente fora do mapa: poeira'),
  re: 'Semente, na horizontal',
  im: 'Semente, na vertical',
  reHint: 'A parte real de c.',
  imHint: 'A parte imaginária de c.',
  journey: 'Mostrar a viagem de um ponto',
  readout: {
    seed: 'A semente',
    landscape: 'A paisagem',
    journey: 'A viagem de um ponto',
  },
  landscape: (inside) =>
    inside
      ? 'Uma peça só, conectada: a semente está dentro da forma escura do mapa.'
      : 'Poeira: a semente está fora da forma escura, então a paisagem se desfaz em grãozinhos.',
  orbitHint: 'Toque na imagem grande para seguir um ponto.',
  escapes: (n) => `Ele escapa depois de ${n} ${n === 1 ? 'passo' : 'passos'}.`,
  stays: (n) => `Ele fica preso: ainda perto do centro depois de ${n} passos.`,
  guests: [
    {
      name: 'Gaston Julia',
      note: 'Em 1918, sem computador nenhum, ele estudou o que repetir uma regra faz com cada ponto do plano.',
    },
    {
      name: 'Benoît Mandelbrot',
      note: 'Em 1980, suas imagens de computador tornaram famoso o mapa das sementes. Ele também criou a palavra “fractal”.',
    },
  ],
  insight: {
    title: 'Como uma única regra desenha tudo isso?',
    html: `<p>Escolha uma semente c. Comece num ponto z, eleve-o ao quadrado e some c, e depois faça o mesmo de novo e de novo. Alguns pontos de partida fogem para o infinito; outros ficam presos perto do centro para sempre. O litoral brilhante na imagem grande é a fronteira entre os dois: o <em>conjunto de Julia</em> de c. As cores mostram quanto tempo cada ponto hesita perto do litoral antes de escapar.</p>
<div class="insight-visual">z → z² + c → (z² + c)² + c → …</div>
<h3>O mapa das sementes</h3>
<p>Cada ponto do mapa pequeno é uma semente. Ele fica escuro quando a viagem que começa em 0 fica presa. Essa forma escura é o <em>conjunto de Mandelbrot</em>, e funciona como um catálogo: para toda semente dentro dele, a paisagem é uma peça só, conectada, e para toda semente fora dele, a paisagem se desfaz em poeira.</p>
<h3>Detalhe infinito, desenhado de forma aproximada</h3>
<p>Olhe de perto qualquer litoral e aparece mais litoral: as orelhas do coelho têm orelhas. Por isso estas imagens só podem ser aproximações. Aqui cada ponto é seguido por no máximo 200 passos (menos enquanto a semente se move), então um ponto que escaparia mais tarde é desenhado como preso, e os fios mais finos podem sumir ou ficar borrados.</p>
<details><summary>A matemática, se você quiser</summary><p>Escreva f(z) = z² + c. Assim que |z| &gt; 2 e |z| ≥ |c|, é certo que a viagem vai crescer sem limite, então o computador pode parar ali. Os pontos que nunca escapam formam o conjunto de Julia preenchido, e a borda dele é o conjunto de Julia. As cores usam uma contagem de fuga suave, n + 1 − log₂(ln |z|), que elimina as listras. Gaston Julia e Pierre Fatou mostraram em 1918–1919 que o conjunto de Julia é conexo exatamente quando a viagem de 0 fica limitada, e que, caso contrário, é poeira. Assim, o conjunto de Mandelbrot, desenhado pela primeira vez por Robert Brooks e Peter Matelski em 1978 e tornado famoso pelas imagens de Benoît Mandelbrot em 1980, é o conjunto das sementes com uma paisagem conexa. O livro <em>The Beauty of Fractals</em> (1986), de Heinz-Otto Peitgen e Peter Richter, levou essas imagens a um público amplo.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Julia_set" target="_blank" rel="noopener">Conjunto de Julia, Wikipédia (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mandelbrot_set" target="_blank" rel="noopener">Conjunto de Mandelbrot, Wikipédia (em inglês)</a><a class="source-link" href="https://doi.org/10.1007/978-3-642-61717-1" target="_blank" rel="noopener">Peitgen e Richter, The Beauty of Fractals (1986) (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Julia/" target="_blank" rel="noopener">Gaston Julia, MacTutor (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Mandelbrot/" target="_blank" rel="noopener">Benoît Mandelbrot, MacTutor (em inglês)</a></div>`,
  },
});
