Wonderlattice.defineText('cube', 'pt', {
  eyebrow: 'MOVIMENTOS · GRUPOS',
  name: 'Por dentro do cubo mágico',
  tagline:
    'Dois giros em outra ordem, um movimento que precisa de 105 repetições para voltar para casa e peças que mal saem do lugar.',
  title: 'Por dentro do cubo mágico.',
  subtitle:
    'Esqueça a solução. Repita dois giros sem parar e conte quanto tempo o cubo leva para voltar a ficar como no começo.',
  field: 'Grupos · Ordem · Desfazer',
  sceneLabel: 'Um cubo de movimentos',
  tip: 'Arraste, ou use as setas, para girar a vista',
  actionLabel: 'Repetir',
  actionCompare: 'Girar',
  canvasLabel:
    'Um cubo mágico. Use os botões de movimento para girar as faces; arraste ou use as setas para girar a vista.',
  panelEyebrow: 'Combine movimentos',
  whyLabel: 'Por que a ordem importa?',
  nudge:
    'Experimente “De volta ao começo” e depois “Repetir até voltar”. Quantas repetições você chuta até ele chegar lá?',
  connection: {
    html: '<strong>Regras que dá para combinar e desfazer.</strong> Um movimento do cubo é uma regra que diz para onde vai cada adesivo. Na sala do Sudoku, regras sobre vizinhos decidem onde cada cor pode ir.',
    label: 'Visitar o Sudoku',
  },
  sceneName: {
    one: 'Um cubo',
    compare: 'Duas ordens',
  },
  modes: ['Um cubo', 'Comparar duas ordens'],
  mode: 'O que explorar',
  faces: {
    U: 'de cima',
    R: 'da direita',
    F: 'da frente',
    D: 'de baixo',
    L: 'da esquerda',
    B: 'de trás',
  },
  turn: (face, prime) => `girar a face ${face} no sentido ${prime ? 'anti-horário' : 'horário'}`,
  moveLabel: (name, turn) => `${name}: ${turn}`,
  movePad: 'Monte uma sequência',
  notation:
    'U = cima (up), R = direita (right), F = frente (front), D = baixo (down), L = esquerda (left), B = trás (back); ′ gira ao contrário.',
  undo: 'Desfazer',
  clear: 'Limpar',
  home: 'Repetir até voltar',
  highlight: 'Mostrar só o que mudou',
  first: 'Primeiro movimento',
  second: 'Segundo movimento',
  sequence: (text) => (text ? text : 'Nenhum movimento ainda: toque numa face'),
  times: (n) => (n === 1 ? 'feito uma vez' : n === 0 ? 'ainda não feito' : `feito ${n} vezes`),
  order: (n) => (n === 1 ? 'Nada a desfazer: ele fica em casa.' : `Volta para casa depois de ${n} repetições.`),
  orderUnknown: 'Quantas repetições até voltar para casa? Dê um palpite e pressione “Repetir até voltar”.',
  moved: (n) =>
    n === 0 ? 'Todas as peças estão em casa.' : n === 1 ? '1 peça fora do lugar.' : `${n} peças fora do lugar.`,
  status: (n) => (n === 0 ? 'Resolvido' : `${n} peças mexidas`),
  landed: (moved, done, order) =>
    (moved === 0 ? 'Resolvido. ' : `Feito ${done === 1 ? 'uma vez' : `${done} vezes`}. ${moved} peças mexidas. `) +
    (order === 0 ? '' : order === 1 ? 'Ele fica em casa.' : `Volta para casa depois de ${order} repetições.`),
  full: 'Já são doze movimentos: repita, desfaça ou limpe.',
  restarted: 'Uma nova sequência começa daqui.',
  compareLabels: (a, b) => [`${a} depois ${b}`, `${b} depois ${a}`],
  compareSame: 'Estes dois comutam: em qualquer ordem, o cubo fica igual.',
  compareDiffer: (n) => `Os mesmos dois movimentos, em outra ordem: ${n} adesivos terminam em lugares diferentes.`,
  compareReady: 'Pressione “Girar” para fazer os dois movimentos em cada cubo.',
  presets: [
    {
      name: 'A ordem importa',
      note: 'Direita depois cima, ou cima depois direita?',
    },
    {
      name: 'De volta ao começo',
      note: 'Repita R U sem parar.',
    },
    {
      name: 'Só algumas peças mexem',
      note: 'R U R′ U′, um comutador.',
    },
    {
      name: 'Desfazer de trás para a frente',
      note: 'Para desfazer, inverta a ordem.',
    },
  ],
  guests: [
    {
      name: 'Évariste Galois',
      note: 'Ele morreu aos vinte anos, deixando os começos da teoria dos grupos: a matemática de combinar e desfazer.',
    },
  ],
  insight: {
    title: 'Movimentos que dá para combinar e desfazer.',
    html: `<p>Este cubo funciona como o quebra-cabeça Rubik’s Cube®, mas aqui você brinca com os movimentos em vez de resolvê-lo. Pense num movimento do cubo como uma regra: cada adesivo vai para um lugar novo. Fazer um movimento depois do outro combina duas regras numa nova. Todo movimento pode ser desfeito. E não fazer nada também é um movimento. Os matemáticos chamam uma coleção assim de <em>grupo</em>.</p>
<div class="insight-visual">R depois U não é U depois R. A ordem importa.</div>
<h3>Desfazer ao contrário</h3>
<p>Para desfazer “R depois U”, você desfaz primeiro o último movimento: U′, depois R′. Como tirar o sapato e a meia, desfazer vem na ordem oposta.</p>
<h3>Tudo volta para casa</h3>
<p>Repita qualquer sequência e o cubo acaba voltando ao ponto de partida, porque só existe uma quantidade finita de posições. R U precisa de 105 repetições. R U R′ U′ precisa de só 6. Nenhuma sequência precisa de mais de 1260.</p>
<h3>Movimentos que quase não mexem</h3>
<p>“Faça A, faça B, desfaça A, desfaça B” é um <em>comutador</em>. Se A e B não tivessem nenhum efeito um sobre o outro, ele não faria nada. Como eles se sobrepõem só um pouco, ele mexe em poucas peças: R U R′ U′ move sete das vinte e seis. Quem resolve o cubo usa comutadores para ajeitar algumas peças sem estragar o resto.</p>
<details><summary>A matemática, se você quiser</summary><p>Cada movimento é uma permutação dos 54 adesivos. Combinar movimentos é compor permutações. Uma sequência volta para casa depois do mínimo múltiplo comum dos comprimentos de seus ciclos de adesivos. R U move adesivos em ciclos de 3, 7 e 15 posições, e o mínimo múltiplo comum de 3, 7 e 15 é 105.</p><p>O cubo tem 43.252.003.274.489.856.000 posições, e cada uma delas pode ser resolvida em no máximo 20 movimentos, contando giros de face, algo provado em 2010 com muito tempo de computador.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Rubik%27s_Cube_group" target="_blank" rel="noopener">O grupo de movimentos do cubo (em inglês)</a><a class="source-link" href="https://www.cube20.org/" target="_blank" rel="noopener">O número de Deus é 20 (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Galois/" target="_blank" rel="noopener">Évariste Galois (em inglês)</a></div>`,
  },
});
