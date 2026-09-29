Wonderlattice.defineText('weather', 'pt', {
  eyebrow: 'CAOS · PREVISÃO',
  name: 'Gêmeos do tempo',
  tagline: 'Dois climas começam quase idênticos. Algumas semanas depois, não têm nada em comum.',
  title: 'Gêmeos do tempo.',
  subtitle:
    'Dois céus começam quase exatamente iguais e seguem exatamente as mesmas regras. Veja por quanto tempo continuam parecidos.',
  field: 'Caos · Equações diferenciais · Previsão',
  sceneLabel: 'Três equações · Dois começos · Nenhum acaso',
  sceneName: 'A borboleta de Lorenz',
  tip: 'Arraste para girar a borboleta · As setas do teclado também giram · Enter solta os gêmeos de novo',
  actionLabel: 'Soltar de novo',
  canvasLabel:
    'Trajetórias gêmeas voando em volta da borboleta de Lorenz em três dimensões, com um gráfico da distância entre elas. Arraste ou use as setas para girar.',
  panelEyebrow: 'Meça o começo',
  whyLabel: 'Por que medir melhor não salva a previsão?',
  nudge:
    'Tente 3 casas decimais, depois 6 e depois 12. Cada casa a mais deixa o começo dez vezes mais preciso. Quantos dias a mais isso compra?',
  connection: {
    html: '<strong>Regras simples, destinos muito diferentes.</strong> Aqui, regras exatas afastam começos próximos. No campo dos vaga-lumes, regras simples aproximam ritmos diferentes.',
    label: 'Ver ritmos que entram no compasso',
  },

  presets: [
    { name: 'A folha impressa de Lorenz', note: 'Três casas decimais, como na folha impressa dele, de 1961.' },
    { name: 'Seis casas decimais', note: 'A um milionésimo de distância. Quanto tempo eles aguentam?' },
    { name: 'Uma multidão de vinte', note: 'Vinte palpites para o mesmo começo, como fazem os meteorologistas.' },
  ],

  digits: 'Casas decimais medidas',
  digitsHint: 'Cada casa a mais deixa o começo dez vezes mais preciso.',
  twins: 'Gêmeos',
  twinsHint: 'Cada gêmeo começa a uma distância aleatória minúscula do começo verdadeiro.',
  speed: 'Velocidade',
  ghost: 'Mostrar a borboleta',
  spin: 'Deixar girar',
  turn: 'Girar a vista',
  turnLeft: 'Girar a vista para a esquerda',
  turnRight: 'Girar a vista para a direita',
  tiltUp: 'Inclinar a vista para cima',
  tiltDown: 'Inclinar a vista para baixo',

  day: (n) => `Dia ${n}`,
  days: (n) => `${n} ${n === 1 ? 'dia' : 'dias'}`,
  statusTogether: (n) => `Dia ${n} · os gêmeos ainda estão juntos`,
  statusParted: (n) => `A previsão durou ${n} ${n === 1 ? 'dia' : 'dias'}`,
  announceLost: (n) => `Os gêmeos se separaram: a previsão durou ${n} ${n === 1 ? 'dia' : 'dias'}.`,
  chartLabel: 'A distância entre eles (cada linha, dez vezes mais longe)',
  lostLine: 'previsão perdida',
  readout: {
    held: 'A previsão durou',
    notYet: 'ainda valendo',
    rule: 'Cada casa a mais compra cerca de',
  },

  guests: [
    {
      name: 'Edward Lorenz',
      note: 'Uma folha com três algarismos lhe ensinou que um arredondamento minúsculo pode virar outro céu.',
    },
    {
      name: 'Henri Poincaré',
      note: 'Décadas antes, ele viu que pequenas diferenças no começo podem virar grandes depois.',
    },
  ],

  insight: {
    title: 'Por que medir melhor não salva a previsão?',
    html: `<p>Nada aqui é aleatório. Cada gêmeo segue as mesmas três equações exatas. A única diferença é onde eles começam: a menos de um milionésimo um do outro, na configuração padrão. Mesmo assim, a distância entre eles não fica pequena. Em média ela dobra mais ou menos a cada três quartos de dia, então cresce exponencialmente, e depois de umas duas semanas os gêmeos estão tão diferentes quanto dois climas sem relação.</p>
<div class="insight-visual">uma distância minúscula × dobrar, de novo e de novo → um estado completamente diferente</div>
<h3>Um pouco mais de tempo, nunca muito</h3>
<p>Meça o começo com dez vezes mais precisão e a distância começa dez vezes menor. Mas o crescimento exponencial apaga essa vantagem num tempo fixo: aqui, uns dois dias e meio por casa decimal. Doze casas em vez de seis compram cerca de duas semanas a mais, não uma previsão que dura para sempre. É a dependência sensível das condições iniciais, muitas vezes chamada de efeito borboleta.</p>
<h3>A folha impressa de Lorenz</h3>
<p>Em 1961, o meteorologista Edward Lorenz reiniciou uma simulação do tempo a partir dos números de uma folha impressa. O computador guardava seis algarismos, a folha só três, então 0.506127 voltou a entrar como 0.506. A nova simulação acompanhou a antiga por um tempo e depois derivou para um clima completamente diferente. As três equações desta sala vêm do artigo dele de 1963.</p>
<h3>O que este modelo deixa de fora</h3>
<p>Estas três equações são um retrato muito simplificado do ar sendo aquecido por baixo. Elas mostram por que a previsão tem um horizonte; não são um simulador do tempo. Aqui, um “dia” é uma unidade de tempo do modelo. Os meteorologistas de verdade enfrentam o mesmo problema com modelos muito mais ricos, e por isso rodam uma multidão de começos ligeiramente diferentes, como em “Uma multidão de vinte”, e contam o quanto essa multidão concorda.</p>
<details><summary>A matemática, se você quiser</summary><p>As equações de Lorenz são dx/dt = σ(y − x), dy/dt = x(ρ − z) − y e dz/dt = xy − βz, com σ = 10, ρ = 28 e β = 8/3. As soluções nunca se acalmam e nunca se repetem, mas ficam sobre um conjunto em forma de borboleta chamado atrator estranho. Soluções próximas se afastam, em média, como e<sup>λt</sup>, onde λ ≈ 0.9 é o maior expoente de Lyapunov. Assim, um começo medido com n casas decimais, errado em 10<sup>−n</sup>, fica a menos de uma distância D por cerca de ln(D · 10<sup>n</sup>)/λ unidades de tempo: cada casa a mais acrescenta ln(10)/λ ≈ 2.5. A sala resolve as equações pelo método clássico de Runge–Kutta em passos de 0.005, e uma previsão conta como perdida quando um gêmeo se afasta mais de 5 unidades da verdade, cerca de um décimo do tamanho da borboleta.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Lorenz_system" target="_blank" rel="noopener">O sistema de Lorenz (em inglês)</a><a class="source-link" href="https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2" target="_blank" rel="noopener">E. N. Lorenz, “Deterministic nonperiodic flow”, Journal of the Atmospheric Sciences 20 (1963) (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Butterfly_effect" target="_blank" rel="noopener">O efeito borboleta (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lyapunov_exponent" target="_blank" rel="noopener">Expoente de Lyapunov (em inglês)</a></div>`,
  },
});
