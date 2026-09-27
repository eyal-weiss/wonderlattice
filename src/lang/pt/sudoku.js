Wonderlattice.defineText('sudoku', 'pt', {
  eyebrow: 'LÓGICA · GRAFOS',
  name: 'Sudoku às claras',
  tagline: 'Um quebra-cabeça de números em que os números nunca importaram.',
  title: 'Sudoku às claras.',
  subtitle: 'Coloque uma cor e veja as possibilidades ao redor sumirem, discretamente.',
  field: 'Lógica · Coloração de grafos · Quadrados latinos',
  sceneLabel: 'Dezesseis casas',
  tip: 'Tab leva ao tabuleiro · setas movem · teclas 1–4 colocam · Backspace apaga · Ctrl+Z desfaz',
  actionLabel: 'Dar um passo lógico',
  canvasLabel:
    'Um tabuleiro de Sudoku de quatro por quatro. Cada casa vazia mostra os símbolos que ainda podem ir ali. O tabuleiro de casas sobre esta imagem pode ser jogado com o teclado.',
  boardLabel: 'Tabuleiro de Sudoku, quatro por quatro',
  panelEyebrow: 'Coloque, desfaça, olhe de novo',
  whyLabel: 'Por que isso é sobre colorir?',
  nudge:
    'Coloque uma cor e veja as marquinhas dela sumirem na linha, na coluna e na região. Depois dê um passo lógico. Você concorda com o motivo?',
  connection: {
    html: '<strong>Outra rede de vizinhos.</strong> Aqui, cada casa limita as casas ligadas a ela. Na travessia da cidade, a escolha de cada motorista muda a viagem de todos.',
    label: 'Visitar o atalho tentador',
  },
  presets: [
    {
      name: 'Um começo suave',
      note: 'Oito pistas. Um passo leva ao outro.',
    },
    {
      name: 'Um só caminho',
      note: 'Só quatro pistas, e mesmo assim uma única resposta.',
    },
    {
      name: 'Duas respostas',
      note: 'Seis pistas, e espaço para dois finais.',
    },
  ],
  styles: ['Cores', 'Formas', 'Algarismos'],
  styleHint: 'O mesmo quebra-cabeça, com outros rótulos. Só as regras importam.',
  styleLabel: 'Símbolos',
  symbolWord: ['cor', 'forma', 'algarismo'],
  symbolNames: [
    ['o azul', 'o laranja', 'o rosa', 'o verde'],
    ['o círculo', 'o quadrado', 'o triângulo', 'o losango'],
    ['o 1', 'o 2', 'o 3', 'o 4'],
  ],
  unitNames: {
    row: 'linha',
    col: 'coluna',
    box: 'região',
  },
  placeLabel: 'Colocar na casa escolhida',
  placeButton: (name) => `Colocar ${name}`,
  faded: (word) =>
    word === 'algarismo'
      ? 'Algarismos apagados não cabem aqui.'
      : word === 'cor'
        ? 'Cores apagadas não cabem aqui.'
        : 'Formas apagadas não cabem aqui.',
  clash: 'conflito aqui',
  undo: 'Desfazer',
  clear: 'Limpar casa',
  network: 'Mostrar a rede',
  filled: 'Preenchidas',
  candidatesLeft: 'Candidatos',
  waysToFinish: 'Respostas',
  none: 'nenhuma',
  twoFinishes: 'O resolvedor encontrou os dois finais. Eles só diferem nas casas contornadas.',
  answerLabel: (n) => `Final ${n}`,
  status: (filled) => `${filled} de 16 preenchidas`,
  networkCaption: '16 casas · 56 ligações · casas ligadas nunca são iguais',
  start: (word) => `Toque numa casa vazia e escolha ${word === 'algarismo' ? 'um' : 'uma'} ${word}.`,
  placed: (name, n) =>
    n === 0
      ? `${name.charAt(0).toUpperCase() + name.slice(1)} foi colocado. Nada por perto precisou mudar.`
      : `${name.charAt(0).toUpperCase() + name.slice(1)} foi colocado. Ele não pode mais ir em ${n} ${n === 1 ? 'casa próxima' : 'casas próximas'}.`,
  clashed: (name) => `Agora dois vizinhos têm ${name}. Desfaça ou tente outro.`,
  given: 'Esta já veio com o quebra-cabeça. Tente uma casa vazia.',
  cleared: 'Limpa. As possibilidades dela voltam.',
  undone: 'Um passo para trás.',
  naked: (name) => `Só ${name} cabe aqui: a linha, a coluna e a região já têm os outros três.`,
  hidden: (name, unit) => `Nesta ${unit}, ${name} só tem mais um lugar possível.`,
  stuckTwo: 'Nada é obrigatório agora. As casas contornadas podem trocar entre si, e os dois finais funcionam.',
  stuckOne: 'Nenhum passo é obrigatório aqui. Arrisque um palpite e desfaça se der errado.',
  stuckNone: 'Este tabuleiro não pode mais ser terminado. Desfaça um ou dois passos.',
  clashFirst: 'Dois vizinhos têm o mesmo símbolo. Primeiro desfaça ou limpe uma das casas brilhando.',
  solved: (word) => `Completo. Cada linha, coluna e região tem cada ${word} uma única vez.`,
  fresh: 'Um tabuleiro novinho.',
  describe: (row, col, content) => `Linha ${row}, coluna ${col}, ${content}`,
  holds: (name, given) => (given ? `${name}, uma pista` : name),
  emptyWith: (names) => `vazia, pode ser ${names.join(' ou ')}`,
  emptyNone: 'vazia, nada cabe',
  guest: {
    name: 'Leonhard Euler',
    note: 'Um Sudoku terminado é um quadrado latino com uma regra a mais para as regiões. Meus 36 oficiais precisavam de dois quadrados latinos sobrepostos de modo que cada par aparecesse uma única vez, o que se mostrou impossível.',
  },
  insight: {
    title: 'Por que o Sudoku é sobre colorir?',
    html: `<p>Nada no Sudoku precisa de números. A única regra é que duas casas na mesma linha, coluna ou região precisam ser diferentes. Cores, formas ou algarismos funcionam do mesmo jeito, e é por isso que trocar os símbolos nunca muda o quebra-cabeça.</p>
<div class="insight-visual">Um Sudoku é um mapa para colorir. Neste tabuleiro, cada casa tem sete vizinhas, e precisa ser diferente de todas elas.</div>
<h3>Restrições</h3>
<p>Cada casa pertence a uma linha, uma coluna e uma região. Esses grupos se sobrepõem, então uma única jogada vai longe: ela tira uma possibilidade de até sete outras casas de uma vez. As marquinhas que se apagam mostram exatamente quais.</p>
<h3>Candidatos e únicos</h3>
<p>As marquinhas numa casa vazia são seus candidatos: os símbolos que nenhuma vizinha tem ainda. Quando só resta uma marca, aquela casa está decidida (um “único nu”). Quando um símbolo só tem uma casa possível em alguma linha, coluna ou região, ele tem que ir ali (um “único escondido”). “Dar um passo lógico” usa só essas duas ideias, e sempre mostra o porquê.</p>
<h3>Um grafo para colorir</h3>
<p>Ligue a rede. Cada casa vira um ponto, e uma ligação une dois pontos sempre que suas casas estão na mesma linha, coluna ou região: 16 pontos e 56 ligações. Preencher o tabuleiro é o mesmo que dar a cada ponto uma de quatro cores de modo que nenhuma ligação una dois pontos da mesma cor, parecido com colorir um mapa para que países vizinhos fiquem diferentes. Os matemáticos chamam isso de coloração própria de um grafo.</p>
<h3>Por que um bom quebra-cabeça tem exatamente uma resposta</h3>
<p>As pistas são uma coloração já começada. Um quebra-cabeça bem feito tem pistas na medida certa para que reste só um jeito de terminar, e assim cada passo pode ser deduzido em vez de chutado. Num tabuleiro 4×4, quatro pistas são o mínimo capaz disso. Com menos, sempre fica alguma escolha em aberto. “Duas respostas” tem seis pistas, mas quatro casas formam um retângulo cujas duas cores podem trocar de lugar, e o resolvedor encontra os dois finais.</p>
<h3>O quebra-cabeça em tamanho real</h3>
<p>O Sudoku de jornal é a mesma ideia em escala maior: 81 casas, cada uma com 20 vizinhas, 810 ligações e nove cores. Existem 288 grades 4×4 completas, mas cerca de 6,7 × 10<sup>21</sup> grades 9×9 completas. O menor número de pistas capaz de dar a um Sudoku 9×9 uma única resposta é 17, um fato decidido por uma grande busca em computador.</p>
<h3>Quadrados latinos</h3>
<p>Uma grade em que cada símbolo aparece uma vez em cada linha e em cada coluna se chama quadrado latino. Leonhard Euler os estudou, incluindo o seu problema dos 36 oficiais: seis patentes e seis regimentos, dispostos de modo que cada linha e cada coluna tenha cada patente e cada regimento uma vez. Todo Sudoku terminado é um quadrado latino com uma regra a mais para as regiões.</p>
<details><summary>O que esta sala faz, e o que ela deixa de fora</summary><p>Os candidatos aqui usam só a eliminação direta: um símbolo é descartado quando uma vizinha já o tem. O passo lógico conhece dois tipos de dedução, os únicos nus e os únicos escondidos; quebra-cabeças mais difíceis precisam de mais. A contagem de jeitos de terminar vem de uma pequena busca com retrocesso (backtracking). Ela testa cada possibilidade na casa vazia mais restrita e para assim que encontra dois finais. Herzberg e Murty contam os jeitos de estender uma coloração parcial com um polinômio cromático: um quebra-cabeça tem solução única exatamente quando essa contagem é 1. Esta sala só precisa distinguir nenhum, um e dois.</p></details>
<div class="sources"><a class="source-link" href="https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf" target="_blank" rel="noopener">Sudoku Squares and Chromatic Polynomials (Herzberg &amp; Murty, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku" target="_blank" rel="noopener">A matemática do Sudoku (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Thirty-six_officers_problem" target="_blank" rel="noopener">Os 36 oficiais de Euler (em inglês)</a></div>`,
  },
});
