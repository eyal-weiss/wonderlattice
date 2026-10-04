Wonderlattice.defineText('treasure', 'pt', {
  eyebrow: 'PROBABILIDADE',
  name: 'O detector de tesouros imperfeito',
  tagline: 'Um detector que acerta 95% das vezes apita. Tem tesouro? Geralmente não.',
  title: 'O detector de tesouros imperfeito.',
  subtitle: 'Varra a ilha e cave onde ele apitar. Quantas vezes o tesouro está mesmo lá?',
  field: 'Probabilidade · Regra de Bayes · Uma pequena surpresa',
  sceneLabel: 'Uma ilha · Um detector honesto',
  sceneName: 'A ilha do tesouro',
  tip: 'Toque num quadrado que apita para cavar · As setas miram, Enter cava',
  actionLabel: 'Varrer a ilha',
  canvasLabel:
    'Uma ilha de quadrados. Um detector apita sobre alguns; cavar revela tesouro ou nada. Ao lado, 1.000 quadrados como pontos, organizados pelo que o detector diz.',
  panelEyebrow: 'Mude as chances',
  whyLabel: 'Por que um apito erra tanto?',
  nudge:
    'Deixe o tesouro mais raro e observe os apitos: cada vez mais são alarmes falsos, embora o detector não tenha mudado nada.',
  connection: {
    html: '<strong>O acaso engana a intuição.</strong> Na sala Os dados que vencem uns aos outros, o “melhor” depende do adversário. Aqui, o que um apito significa depende de quão raro é o tesouro.',
    label: 'Jogue os dados estranhos',
  },

  presets: [
    { name: 'Tesouro por toda parte', note: 'Um apito é boa notícia.', badge: '30%' },
    { name: 'Tesouro raro', note: 'Experimente a surpresa.', badge: '2%' },
    { name: 'Um segundo detector', note: 'Dois apitos pesam muito mais.', badge: '×2' },
  ],

  treasure: 'Quão comum é o tesouro?',
  treasureHint: 'A parte dos quadrados que esconde tesouro.',
  share: (pct) => `${pct}% · 1 em cada ${Math.round(100 / pct)}`,
  accuracy: 'Quantas vezes o detector acerta',
  accuracyHint: 'Com essa frequência ele apita sobre o tesouro e fica quieto sobre a areia.',
  second: 'Use também um segundo detector (só contam os quadrados onde os dois apitam)',

  actions: { sweep: 'Varrer a ilha', digAll: 'Cavar em cada apito', again: 'Outra ilha' },
  status: {
    ready: 'Varra a ilha para começar',
    swept: (beeps) => `${beeps} ${beeps === 1 ? 'apito' : 'apitos'} · toque em um para cavar`,
    digging: (dug, beeps, found) =>
      `${dug} de ${beeps} apitos cavados · ${found} ${found === 1 ? 'tesouro' : 'tesouros'}`,
    done: (beeps, found) =>
      `${beeps} ${beeps === 1 ? 'apito cavado' : 'apitos cavados'}: ${found} ${found === 1 ? 'tesouro' : 'tesouros'}, ${beeps - found} ${beeps - found === 1 ? 'alarme falso' : 'alarmes falsos'}`,
  },
  dug: { treasure: 'Tesouro!', nothing: 'Nada aqui.' },
  quiet: 'O detector ficou quieto aqui.',

  readout: {
    title: 'Um apito significa tesouro',
    story: (total, treasure, found, falseAlarms, both) =>
      `De cada ${total.toLocaleString('pt-BR')} quadrados, ${treasure} escondem tesouro. ${both ? 'Os dois detectores apitam' : 'O detector apita'} sobre ${found} deles, e sobre ${falseAlarms} ${falseAlarms === 1 ? 'vazio' : 'vazios'}. Então ${found} de ${found + falseAlarms} apitos são tesouro.`,
    percent: (p) => `${Math.round(p * 100)}%`,
    unknown: '?',
    hidden: 'Varra a ilha e cave onde ele apitar: quantas vezes o tesouro está mesmo lá? A resposta aparece aqui.',
  },

  labels: {
    island: 'A ilha',
    thousand: 'Cada 1.000 quadrados',
    hidden: 'Cave onde apitar para ver o que um apito significa',
    found: 'tesouro, apita',
    missed: 'tesouro, quieto',
    falseAlarm: 'areia, apita',
    quiet: 'areia, quieto',
  },

  guests: [
    {
      name: 'Thomas Bayes',
      note: 'Uma pista deve mudar o que você pensa, mas quanto depende do que você acreditava antes.',
    },
    {
      name: 'Pierre-Simon Laplace',
      note: 'Encontrei a mesma regra sozinho e a usei para as estrelas, os tribunais e o censo.',
    },
  ],

  insight: {
    title: 'Por que um apito erra tanto?',
    html: `<p>Imagine 1.000 quadrados, com tesouro sob 20 deles. Um detector que acerta 95% das vezes apita sobre 19 dos 20. Mas também apita, por engano, sobre 5% dos 980 quadrados vazios: 49 deles. São 68 apitos, e só 19 são tesouro, cerca de 28%. O detector é bom; o tesouro é raro, então os alarmes falsos superam os achados.</p>
<div class="insight-visual">19 achados + 49 alarmes falsos → um apito é tesouro 19 vezes em 68</div>
<h3>Contar funciona melhor que porcentagens</h3>
<p>Apresentado em porcentagens (“2% dos quadrados, 95% de acerto”), esse enigma engana a maioria das pessoas, médicos inclusive. Apresentado como contagem de quadrados, como os pontos ao lado da ilha, quase todo mundo acerta. Os psicólogos Gerd Gigerenzer e Ulrich Hoffrage mostraram isso em 1995; eles chamam contagens assim de frequências naturais.</p>
<h3>Por que um segundo detector ajuda tanto</h3>
<p>Se um segundo detector, com seus próprios erros independentes, também apita, os alarmes falsos quase somem: dos 49, só uns 2 enganam os dois. Agora a maioria dos apitos duplos é tesouro. É assim que as evidências se somam.</p>
<h3>O que esta sala simplifica</h3>
<p>O detector acerta igualmente sobre o tesouro e sobre a areia, e os erros do segundo detector são independentes dos do primeiro. Testes repetidos na vida real raramente são tão independentes, então um segundo teste costuma ajudar menos do que aqui. Cada ilha é montada para bater com as contagens esperadas, arredondadas para quadrados inteiros; uma busca real variaria em torno delas. A mesma aritmética vale para exames de triagem de doenças raras: um resultado positivo é motivo para investigar mais, não um veredito.</p>
<details><summary>A matemática, se você quiser</summary><p>É a regra de Bayes. Com tesouro numa parte r dos quadrados e um detector que acerta com probabilidade a, P(tesouro | apito) = a·r / (a·r + (1 − a)·(1 − r)). Com dois detectores independentes, P(tesouro | os dois apitam) = a²·r / (a²·r + (1 − a)²·(1 − r)). A regra leva o nome de Thomas Bayes, cujo ensaio foi publicado em 1763, depois da sua morte; Pierre-Simon Laplace a desenvolveu por conta própria e a usou amplamente. G. Gigerenzer e U. Hoffrage, “How to improve Bayesian reasoning without instruction: frequency formats”, Psychological Review 102 (1995).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Base_rate_fallacy" target="_blank" rel="noopener">Falácia da taxa-base (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Bayes%27_theorem" target="_blank" rel="noopener">Teorema de Bayes (em inglês)</a></div>`,
  },
});
