// The fixed text of the page (index.html, elements marked data-t).
Wonderlattice.defineText('shots', 'pt', {
  eyebrow: 'ESTATÍSTICA',
  name: 'Dois jogadores, três placares',
  tagline: 'Um arremessador pode vencer de perto e vencer de longe, e mesmo assim perder no total.',
  title: 'Dois jogadores, três placares.',
  subtitle:
    'Dois jogadores arremessam de perto e de longe. Mude quantos arremessos fáceis e difíceis cada um faz e veja o placar total virar.',
  field: 'Estatística · Médias ponderadas · Uma pequena surpresa',
  sceneLabel: 'Uma quadra · Dois jogadores · Três placares',
  sceneName: 'A mistura de arremessos',
  tip: 'Arraste os controles para mudar quantos arremessos de perto e de longe cada jogador faz',
  actionLabel: 'Trocar a mistura',
  canvasLabel:
    'Uma quadra de basquete com os arremessos de perto e de longe de cada jogador como pontos, e placares de perto, de longe e no total.',
  panelEyebrow: 'Mude a mistura de arremessos',
  whyLabel: 'Como isso pode acontecer?',
  nudge:
    'Dê ao jogador A principalmente arremessos de longe e ao jogador B principalmente arremessos de perto. Veja o placar total virar, sem que a pontaria de nenhum dos dois tenha mudado.',
  connection: {
    html: '<strong>Um número combinado pode esconder o que tem dentro.</strong> Aqui, uma porcentagem total é uma média ponderada, e os pesos são a mistura de arremessos.',
    label: 'Siga outra surpresa',
  },
  presets: [
    { name: 'Mistura equilibrada', note: 'O melhor jogador também vence no total.', badge: 'Equilibrada' },
    { name: 'Mistura desigual', note: 'Experimente a surpresa.', badge: 'Desigual' },
    { name: 'Mistura extrema', note: 'Até onde a diferença pode chegar?', badge: 'Extrema' },
  ],
  players: { a: 'Jogador A', b: 'Jogador B' },
  short: { a: 'A', b: 'B' },
  closeLabel: 'De perto',
  farLabel: 'De longe',
  overallLabel: 'No total',
  attemptsHint: 'Quantos arremessos deste tipo?',
  makesOf: (makes, attempts) => `${makes} de ${attempts}`,
  percent: (pct) => `${Math.round(pct * 100)}%`,
  verdict: {
    tied: 'Os dois jogadores estão empatados no total.',
    aWins: 'O jogador A lidera no total.',
    bWins: 'O jogador B lidera no total.',
    reversal: (winner) => `${winner} vence de perto e de longe, e mesmo assim fica atrás no total.`,
  },
  legend: {
    made: 'cesta',
    missed: 'erro',
    perDot: (n) => (n === 1 ? 'um ponto por arremesso' : `um ponto ≈ ${n} arremessos`),
  },
  labels: {
    caption: 'A porcentagem total de cada jogador é a soma das cestas dividida pela soma dos arremessos.',
  },
  guests: [
    {
      name: 'Edward H. Simpson',
      note: 'Uma tendência que aparece em cada grupo pode se inverter quando os grupos são juntados.',
    },
    {
      name: 'George Udny Yule',
      note: 'A mesma inversão aparece sempre que uma taxa combinada esconde uma mistura desigual.',
    },
  ],
  insight: {
    title: 'Como o melhor jogador pode perder no total?',
    html: `<p>Uma porcentagem de acerto total não é a média de duas porcentagens. É o total de cestas dividido pelo total de arremessos, então é uma média <em>ponderada</em>, pelo número de arremessos de cada distância. Quando os dois jogadores fazem misturas muito diferentes de arremessos de perto e de longe, essa ponderação pode favorecer o jogador que está atrás nas duas categorias.</p>
<div class="insight-visual">A mesma pontaria em cada distância, outra mistura de arremessos, outro líder no total.</div>
<h3>Experimente uma mistura equilibrada</h3>
<p>Dê aos dois jogadores a mesma divisão entre arremessos de perto e de longe. Agora o melhor jogador nas duas categorias também vence no total. A inversão só aparece quando as misturas são diferentes.</p>
<h3>Um caso real: Berkeley, 1973</h3>
<p>Na Universidade da Califórnia em Berkeley, a taxa total de admissão na pós-graduação parecia favorecer os homens. Olhando departamento por departamento, a maioria não mostrava viés contra as mulheres, ou mostrava um pequeno viés a favor delas. As mulheres tinham se candidatado em maior número a departamentos mais concorridos, com taxas de admissão baixas para todos, e isso puxava para baixo a taxa combinada delas. Em qual número confiar depende de entender por que a mistura era diferente, não só da aritmética.</p>
<h3>O que este modelo supõe</h3>
<p>Cada jogador tem uma taxa de acerto fixa em cada distância, aplicada a quantos arremessos você der a ele. É um modelo simplificado para ilustrar a aritmética do paradoxo, não uma simulação de arremessos reais nem de decisões de admissão reais.</p>
<details><summary>A matemática, se você quiser</summary><p>Para um jogador com <code>c</code> cestas em <code>C</code> arremessos de perto e <code>f</code> cestas em <code>F</code> arremessos de longe, a taxa total é (c + f) / (C + F), não a média de c/C e f/F. Um jogador pode ter ao mesmo tempo c/C e f/F maiores que o outro, enquanto o outro tem (c + f) / (C + F) maior, sempre que os números de arremessos C e F forem diferentes o bastante entre eles.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Simpson%27s_paradox" target="_blank" rel="noopener">Paradoxo de Simpson, Wikipédia (em inglês)</a> · <a class="source-link" href="https://www.science.org/doi/10.1126/science.187.4175.398" target="_blank" rel="noopener">Bickel, Hammel e O’Connell, “Sex bias in graduate admissions: data from Berkeley”, Science 187 (1975) (em inglês)</a></div>`,
  },
});
