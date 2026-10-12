/* A ilusão do castigo · palavras para o visitante (pt). */
Wonderlattice.defineText('regress', 'pt', {
  eyebrow: 'ESTATÍSTICA',
  name: 'A ilusão do castigo',
  tagline: 'Dê bronca num arremesso ruim e o próximo sai melhor, nove em cada dez vezes. A bronca não fez nada.',
  title: 'A ilusão do castigo.',
  subtitle:
    'Um treinador elogia os melhores arremessos e dá bronca nos piores. Veja o que vem depois de cada palavra, e então mostre a fiação.',
  field: 'Estatística · Regressão à média · Intuição enganada',
  sceneLabel: 'Um arremessador · Um treinador',
  sceneName: 'A contagem do treinador',
  tip: 'Toque num rosto para treinar · Teclas: ↑ elogiar, ↓ dar bronca, → não dizer nada',
  actionLabel: 'Mostrar a fiação',
  hideLabel: 'Esconder a fiação',
  canvasLabel:
    'Um alvo onde caem os dardos de um arremessador, um treinador que elogia ou dá bronca em cada arremesso, e uma contagem de quando o arremesso seguinte foi melhor ou pior depois de cada palavra.',
  panelEyebrow: 'Treinador',
  whyLabel: 'Por que a bronca parece funcionar?',
  nudge:
    'Desligue o treinador automático e treine você mesmo: elogie e dê bronca no que quiser. Depois mostre a fiação.',
  connection: {
    html: '<strong>Intuição contra aritmética.</strong> Em “O detector de tesouros imperfeito”, um bipe significa menos do que parece. Aqui, as palavras de um treinador parecem fazer mais do que fazem.',
    label: 'Caçar o tesouro',
  },

  presets: [
    { name: 'Treinador automático', note: 'Elogie os melhores, dê bronca nos piores.', badge: '20%' },
    { name: 'Você treina', note: 'Cada palavra é sua.', badge: '↑↓' },
    { name: 'O elogio ajuda mesmo', note: 'A contagem percebe?', badge: '+' },
  ],

  auto: 'Treinador automático: elogia os melhores arremessos, dá bronca nos piores',
  share: 'O treinador reage aos melhores e aos piores',
  shareHint: 'Quanto mais extremos os arremessos a que ele reage, mais forte a ilusão.',
  helps: 'O elogio ajuda mesmo, um pouco (o arremesso seguinte melhora um pouquinho)',
  words: { praise: 'Elogiar', scold: 'Dar bronca', nothing: 'Não dizer nada' },

  labels: {
    board: (n) => `Arremesso ${n}`,
    points: (p) => `${p} ${p === 1 ? 'ponto' : 'pontos'}`,
    praise: 'Muito bem!',
    scold: 'Malfeito!',
    nothing: '…',
    yourWord: 'O que dizer?',
    afterPraise: 'Após elogio',
    afterScold: 'Após bronca',
    better: 'próximo melhor',
    worse: 'próximo pior',
    times: (k, n) => `${k} de ${n}`,
    none: 'ainda não',
    hidden: 'A que se ligam as palavras do treinador?',
    hiddenHint: 'Mostre a fiação para ver',
    wired: 'Palavras ligadas ao próximo arremesso:',
    nothing2: 'nada',
    lift: 'elogio: leve melhora',
    thisThrow: 'este arremesso →',
    nextThrow: 'o seguinte ↑',
    same: 'sem mudança',
    fitted: 'melhor ajuste',
  },

  status: {
    waiting: (n) => `Arremesso ${n}: o que dizer?`,
    count: (n) => `${n} ${n === 1 ? 'arremesso' : 'arremessos'}`,
    done: (n) => `${n} arremessos, todos feitos`,
  },
  announce: (pw, pn, sb, sn) =>
    `Depois de um elogio, o arremesso seguinte foi pior em ${pw} de ${pn} vezes; depois de uma bronca, foi melhor em ${sb} de ${sn} vezes.`,

  guests: [
    {
      name: 'Francis Galton',
      note: 'Medi pais e os seus filhos já adultos: os filhos de pais muito altos eram altos, mas, em média, só dois terços tão afastados do meio quanto eles.',
    },
    {
      name: 'Daniel Kahneman',
      note: 'Um instrutor de voo me disse que elogios pioravam os cadetes e gritos os melhoravam. Ele tinha visto isso acontecer, e era regressão à média.',
    },
  ],

  insight: {
    title: 'Por que a bronca parece funcionar?',
    html: `<p>Todo arremesso é a habilidade do arremessador mais sorte. Um arremesso excepcionalmente bom costuma ser um arremesso bom com boa sorte por cima, e a sorte não passa adiante. Então o próximo arremesso tende a ficar mais perto da média do arremessador, diga o treinador o que disser. Com o treinador reagindo ao melhor quinto e ao pior quinto dos arremessos, o arremesso depois de um elogio é pior 9 vezes em 10 nesta sala, e o arremesso depois de uma bronca é melhor 9 vezes em 10. As palavras do treinador não alcançam nada.</p>
<div class="insight-visual">um ótimo arremesso = habilidade + boa sorte → próximo arremesso = habilidade + sorte comum → “o elogio piorou”</div>
<h3>O instrutor de voo</h3>
<p>Daniel Kahneman conta como certa vez ensinou a instrutores de voo da força aérea israelense que o elogio funciona melhor que o castigo. Um instrutor experiente discordou: quando ele elogiava um cadete por uma manobra limpa, a tentativa seguinte costumava ser pior, e quando gritava com um, a seguinte costumava ser melhor. Kahneman viu na hora que aquilo era regressão à média: como elogiamos as pessoas quando elas foram bem e lhes damos bronca quando foram mal, somos, como ele disse, “estatisticamente punidos por recompensar os outros e recompensados por puni-los”. Depois, ele fez todos na sala jogarem duas moedas num alvo às suas costas, sem nenhum retorno: os que foram melhor na primeira vez em geral foram pior na segunda, e vice-versa.</p>
<h3>A palavra de Galton</h3>
<p>Francis Galton encontrou o mesmo padrão em 1886, nas alturas de pais e dos seus filhos adultos. Filhos de pais muito altos eram altos, mas, em média, só cerca de dois terços tão afastados do meio quanto os pais; filhos de pais muito baixos eram baixos, mas menos. Ele chamou isso de regressão à mediocridade. As pessoas não vão todas se aproximando da média: cada geração é tão espalhada quanto a anterior. Só os escolhidos por serem extremos regridem, porque parte do que os tornou extremos foi sorte, que não se herda.</p>
<h3>O que esta sala simplifica</h3>
<p>Aqui a habilidade do arremessador nunca muda e a sorte de cada arremesso é nova, então as palavras realmente não fazem nada. Um retorno de verdade pode fazer diferença. Ligue “O elogio ajuda mesmo” e a contagem ainda diz que o elogio sai pela culatra, cerca de 8 vezes em 10: comparar um arremesso com o seguinte não permite saber. Para descobrir o que o elogio faz, compare com arremessos depois dos quais o treinador não disse nada, ou com um grupo que não foi elogiado. O nove em dez vale para estas configurações: é 1 − p/2 quando o treinador reage à fração p dos melhores e à fração p dos piores arremessos (95% com um décimo, 75% com metade). A mesma ilusão aparece quando um atleta entra em má fase depois de sair na capa de uma revista, ou quando pacientes que entram num estudo no seu pior momento parecem melhorar com qualquer tratamento.</p>
<details><summary>A matemática, se você quiser</summary><p>Se as pontuações são habilidade mais uma sorte independente, a pontuação seguinte esperada é a média mais r vezes a distância desta pontuação até a média, onde r é a correlação entre uma pontuação e a seguinte. Para um arremessador cuja habilidade nunca muda, r = 0: a reta de melhor ajuste por “este arremesso, o seguinte” é plana, enquanto a linha tracejada “sem mudança” sobe. Com sorte normal e um corte c acima do qual fica a fração p dos melhores arremessos, P(seguinte pior | este entre os p melhores) = 1 − p/2, e a mudança média é −φ(c)/p, cerca de −1,40 desvio padrão para p = 20%. F. Galton, “Regression towards mediocrity in hereditary stature”, Journal of the Anthropological Institute 15 (1886) 246–263. D. Kahneman, autobiografia para o Nobel de 2002, e Rápido e devagar: duas formas de pensar (Thinking, Fast and Slow, 2011), capítulo 17.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Regression_toward_the_mean" target="_blank" rel="noopener">Regressão à média (Wikipedia, em inglês)</a><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/" target="_blank" rel="noopener">Autobiografia de Kahneman para o Nobel (em inglês)</a><a class="source-link" href="https://galton.org/essays/1880-1889/galton-1886-jaigi-regression-stature.pdf" target="_blank" rel="noopener">Galton 1886 (PDF, em inglês)</a></div>`,
  },
});
