Wonderlattice.defineText('dice', 'pt', {
  eyebrow: 'CONTAGEM',
  name: 'Os dados que vencem uns aos outros',
  tagline: 'Escolha qualquer dado. Sempre existe um que o vence.',
  title: 'Os dados que vencem uns aos outros.',
  subtitle:
    'Escolha qualquer um destes dados estranhos, depois eu escolho o meu e jogamos. Seja qual for sua escolha, outro dado tende a vencê-lo.',
  field: 'Probabilidade · Contagem · Uma pequena surpresa',
  sceneLabel: 'Dados estranhos · Um círculo',
  tip: 'Toque num dado do círculo, ou pressione ← e →, para escolher o seu · Cada seta aponta do vencedor para o perdedor',
  actionLabel: 'Lançar 100 vezes',
  canvasLabel:
    'Dois dados lançados um contra o outro, uma contagem de vitórias, a porcentagem acumulada de vitórias e um círculo de setas mostrando qual dado costuma vencer qual. Toque num dado do círculo, ou use as setas para a esquerda e para a direita, para escolher o seu dado.',
  panelEyebrow: 'Escolha e lance',
  whyLabel: 'Como todo dado pode perder?',
  nudge:
    'Experimente cada dado, um de cada vez. Toda vez, eu acho um que vence o seu. Existe algum dado que eu não consiga vencer?',
  connection: {
    html: '<strong>Intuição, virada do avesso com delicadeza.</strong> Aqui, “melhor” anda em círculo. Na cidade, uma rua novinha pode deixar todas as viagens mais lentas.',
    label: 'Experimente o atalho tentador',
  },
  sets: ['Três dados · 5/9', 'Os quatro dados de Efron · 2/3', 'Os dados de Grime · uma reviravolta'],
  sceneNames: ['Escolha primeiro', 'Os quatro de Efron', 'Os dados de Grime'],
  twoEach: (name) => `${name} · dois de cada`,
  marks: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['V', 'A', 'O'],
  ],
  names: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['Vermelho', 'Azul', 'Oliva'],
  ],
  setLabel: 'Conjunto de dados',
  youLabel: 'Seu dado',
  rivalLabel: 'Meu dado',
  letMe: 'Deixe comigo',
  pairs: 'Lançar dois de cada e somar',
  speed: 'Lançamentos por segundo',
  speedHint: 'Devagar para acompanhar, ou rápido para estabilizar.',
  faces: (list) => list.join(' '),
  pickDie: (name, list) => `Dado ${name}: ${list.join(', ')}`,
  you: 'Você',
  me: 'Eu',
  vs: 'vs.',
  iTake: (you, me) => `Você escolheu ${you}. Eu fico com ${me}.`,
  against: (you, me) => `${you} contra ${me}. Você escolheu os dois.`,
  ready: 'Pronto para lançar',
  rolls: (n) => (n === 1 ? '1 lançamento' : `${n.toLocaleString(Wonderlattice.lang)} lançamentos`),
  circleTitle: 'O círculo das vitórias',
  even: 'meio a meio',
  winsTitle: 'Vitórias',
  latestTitle: 'Últimos lançamentos, do mais recente',
  ties: (n) => (n === 1 ? '1 empate' : `${n} empates`),
  shareTitle: (name) => `Com que frequência ${name} vence`,
  exactLabel: (fraction) => `exato: ${fraction}`,
  startHint: 'Pressione “Lançar 100 vezes”',
  rollsSoFar: 'Lançamentos até agora',
  winsLine: (you, me, a, b) => `Você (${you}) ${a} · Eu (${me}) ${b}`,
  seenLine: (name, seen, fraction, exact) =>
    `${name} vence: ${seen === null ? '–' : seen + '%'} até agora · exatamente ${fraction} ≈ ${exact}%`,
  verdictStart: (favourite, fraction) =>
    `Pela conta exata, ${favourite} vence ${fraction} das vezes. Lance para ver acontecer.`,
  verdict: (n, favourite, seen, fraction) =>
    `Depois de ${n.toLocaleString(Wonderlattice.lang)} lançamentos, ${favourite} venceu ${seen}% das vezes. A chance exata é ${fraction}.`,
  evenVerdict: 'Estes dois têm a mesma chance de vencer.',
  sameDie: 'O mesmo dado dos dois lados: chances iguais.',
  presets: [
    {
      name: 'Escolha primeiro',
      note: 'Eu escolho depois de você.',
      badge: '5/9',
    },
    {
      name: 'Os quatro de Efron',
      note: 'Quatro dados, um círculo.',
      badge: '2/3',
    },
    {
      name: 'Dois de cada',
      note: 'Dobre os dados, inverta o círculo.',
      badge: '↺',
    },
  ],
  guests: [
    {
      name: 'Blaise Pascal',
      note: 'Um enigma de dados de um apostador chegou até ele. As cartas que trocou com Fermat em 1654 deram início à matemática do acaso.',
    },
  ],
  gridAxes: (me, you) =>
    `As linhas são o meu dado, ${me}; as colunas são o seu, ${you}. Cada quadradinho tem a cor de quem vence.`,
  gridNote: (win, lose, tie, total, me, you) =>
    `${me} vence em ${win} das ${total.toLocaleString(Wonderlattice.lang)} combinações igualmente prováveis, ${you} vence em ${lose}` +
    (tie ? `, e ${tie} são empates.` : '.'),
  insight: {
    title: 'Como todo dado pode perder?',
    html: `<p>Conte em vez de chutar. Cada dado tem seis faces, então dois dados podem cair de 6 × 6 = 36 jeitos igualmente prováveis. Pegue A (2, 2, 4, 4, 9, 9) contra B (1, 1, 6, 6, 8, 8). Os dois 9 de A vencem as seis faces de B: 12 jeitos. Os 2 e os 4 de A só vencem os dois 1 de B: mais 4 × 2 = 8. Isso dá 20 de 36 para A, ou 5/9. A mesma conta dá B sobre C, e C sobre A.</p>
<canvas id="dice-grid" class="dice-grid" aria-hidden="true"></canvas>
<p id="dice-grid-note"></p>
<div class="insight-visual">A vence B, B vence C, e C vence A. “Costuma vencer” não forma uma fila, então quem escolhe depois sempre encontra um dado que ganha.</div>
<h3>Ser melhor na média não é o mesmo que ganhar mais vezes</h3>
<p>Os três dados do primeiro conjunto têm média exatamente 5. No conjunto de Efron, C (6, 6, 2, 2, 2, 2) tem a maior média, 3⅓, mas perde duas vezes em cada três para B, que sempre mostra 3. A média se importa com o tamanho de cada vitória; “ganhar mais vezes” só conta com que frequência.</p>
<h3>Dois de cada invertem o círculo</h3>
<p>Com os dados vermelho, azul e oliva de James Grime, um de cada dá vermelho sobre azul, azul sobre oliva e oliva sobre vermelho. Lance dois de cada e some, e todas as setas se invertem: azul vence vermelho, oliva vence azul e vermelho vence oliva. Somar dois dados muda quais totais são prováveis, e isso muda quem costuma ganhar.</p>
<h3>O que isto supõe</h3>
<p>Dados honestos: todas as faces igualmente prováveis, e cada lançamento independente dos outros. Aqui, os lançamentos vêm de um gerador de números pseudoaleatórios. Algumas dezenas de lançamentos podem se afastar bastante da chance exata. A oscilação típica diminui devagar, como um sobre a raiz quadrada do número de lançamentos: cerca de 5% depois de 100 lançamentos, cerca de 0,5% depois de 10.000.</p>
<details><summary>Existe um dado que ninguém vence?</summary><p>Não nestes conjuntos. Para cada dado existe outro que o vence na maioria das vezes. É isso que “não transitivo” quer dizer: “vencer” não passa adiante numa corrente como “ser mais alto que”. No conjunto de Efron, a melhor resposta da sala vence duas vezes em cada três, seja qual for a sua escolha.</p></details>
<div class="sources"><a class="source-link" href="https://nrich.maths.org/problems/non-transitive-dice?tab=teacher" target="_blank" rel="noopener">NRICH: dados não transitivos (em inglês)</a><a class="source-link" href="https://www.scientificamerican.com/article/mathematical-games-1970-12/" target="_blank" rel="noopener">Martin Gardner sobre os dados de Efron (1970, em inglês)</a><a class="source-link" href="http://singingbanana.com/dice/article.htm" target="_blank" rel="noopener">Os dados de James Grime (numeração anterior, com as mesmas chances; em inglês)</a></div>`,
  },
});
