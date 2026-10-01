/* Pare em 37% · palavras para o visitante (pt). */
Wonderlattice.defineText('stopping', 'pt', {
  eyebrow: 'PARADA ÓTIMA',
  name: 'Pare em 37%',
  tagline: 'Vire 100 cartas, uma de cada vez, e pare na maior. Uma regra simples ganha mais de um terço das vezes.',
  title: 'Quando parar de procurar.',
  subtitle:
    'Vire as cartas uma de cada vez e pare na maior, sem voltar atrás. Embaixo, milhares de rodadas mostram quando saltar.',
  field: 'Probabilidade · Parada ótima · O problema da secretária',
  sceneLabel: '100 cartas · Uma de cada vez · Sem volta',
  sceneName: 'Ache a maior carta',
  tip: 'Toque no monte, ou pressione →, para a próxima carta · Toque na sua carta, ou pressione Enter, para pegá-la · Embaixo, as barras são 10.000 rodadas jogadas com a regra, e a linha é a chance exata',
  actionLabel: 'Novas cartas',
  canvasLabel:
    'Um jogo de 100 cartas viradas para baixo, cada uma escondendo um número diferente. No alto: a carta que acabou de ser virada, a melhor carta antes dela e o monte. Embaixo delas, uma faixa com uma marca para cada carta virada, dourada onde uma carta superou todas as anteriores. Quando um jogo termina, a faixa mostra a posição de cada carta, mais alta para a maior, e marca a sua carta, a da regra e a maior. Mais abaixo, um gráfico: para cada número de cartas só olhadas antes de saltar, a chance de a regra ganhar, em barras de 10.000 rodadas simuladas e numa linha calculada exatamente. Achar a maior de todas é mais provável depois de olhar 37 cartas, com 37%; se qualquer uma das 10 maiores servir, depois de 14 cartas, com 82%.',
  panelEyebrow: 'Olhe, depois salte',
  whyLabel: 'Por que 37%?',
  nudge:
    'Primeiro, jogue algumas rodadas por conta própria. Depois escolha quantas cartas a regra só olha e ache onde a curva fica mais alta. Então marque “Vale qualquer uma das 10 maiores” e veja o pico se mover.',
  connection: {
    html: '<strong>Decidir antes de ver tudo.</strong> Aqui você precisa escolher uma carta antes de ver as outras. Na sala O detector de tesouros imperfeito, você decide o que um apito significa quando a maioria dos apitos está errada.',
    label: 'Caçar o tesouro',
  },

  presets: [
    { name: 'Saltar cedo', note: 'Olhe 10, depois salte: 23%.', badge: '10' },
    { name: 'Olhe 37, depois salte', note: 'A maior de todas, 37% das vezes.', badge: '37' },
    { name: 'As 10 maiores servem', note: 'Olhe só 14: 82%.', badge: '14' },
  ],

  rules: {
    title: 'O jogo',
    text: 'Cada uma das 100 cartas esconde um número diferente, de qualquer tamanho. Elas são viradas uma de cada vez. Pegue uma carta quando achar que ela é a maior de todas as 100. Uma carta que você deixa passar se vai para sempre, e, se você chegar à última carta, ela é sua.',
  },
  next: 'Próxima carta',
  take: 'Pegar esta carta',
  again: 'Nova rodada',

  look: 'Cartas que a regra só olha',
  lookHint: 'Ela não pega nenhuma delas; depois, pega a primeira carta que superar todas.',
  top: 'Vale qualquer uma das 10 maiores',

  // A card's place among all 100: 1 is the biggest, then the 2nd, 3rd, 4th, … 11th, 12th, 13th, … 21st biggest.
  // Cards (cartas) are feminine: a maior, a 2ª maior, a 21ª maior.
  place: (rank) => (rank === 1 ? 'a maior' : `a ${rank}ª maior`),

  readout: {
    best: (look) => `Olhando ${look} antes de saltar, chance de achar a maior carta:`,
    top: (look) => `Olhando ${look} antes de saltar, chance de pegar uma das 10 maiores:`,
    simulated: (deals, chance) => `Em ${deals} rodadas simuladas: ${chance}.`,
    peak: (look, chance) => `O melhor número de cartas para olhar: ${look}, com ${chance}.`,
    random: (chance) => `Pegando uma carta ao acaso: ${chance}.`,
    moreTitle: 'A maior carta, com menos ou mais cartas',
    more: (cards, look, chance) => `${cards} cartas: olhe ${look}, ${chance}`,
  },

  game: {
    playing: (card, cards, best) => `A carta ${card} de ${cards} está virada. A melhor antes dela: ${best}.`,
    first: (cards) => `A carta 1 de ${cards} está virada. Ainda não há nenhuma antes dela.`,
    took: (card, place) => `Você pegou a carta ${card}: ${place}.`,
    last: (place) => `Você chegou à última carta, então ela ficou com você: ${place}.`,
    biggest: (card) => `A maior era a carta ${card}.`,
    found: 'Você achou a maior!',
    rule: (look, card, place) =>
      `Olhando ${look === '1' ? 'só a primeira' : `as primeiras ${look}`}, a regra teria pegado a carta ${card}: ${place}.`,
    ruleNone: (place) => `Sem olhar nenhuma antes, a regra teria pegado a carta 1: ${place}.`,
    ruleLast: (look, place) =>
      `Olhando ${look === '1' ? 'só a primeira' : `as primeiras ${look}`}, a regra teria esperado em vão e terminado na última carta: ${place}.`,
    topWin: 'Essa está entre as 10 maiores.',
    topLose: 'Essa não está entre as 10 maiores.',
  },

  status: {
    card: (card, cards) => `Carta ${card} de ${cards}`,
    done: (place) => `Você pegou ${place}`,
  },

  announce: {
    card: (card, value) => `Carta ${card}: ${value}.`,
    newBest: (card, value) => `Carta ${card}: ${value}, a melhor até agora.`,
    noGoingBack: 'Não dá para voltar: uma carta que você deixa passar se vai.',
    over: 'Esta rodada acabou. Comece uma nova rodada para ter cartas novas.',
    deal: (value) => `Cartas novas. Carta 1: ${value}.`,
  },

  // Words drawn on the picture.
  labels: {
    card: (card) => `carta ${card}`,
    bestBefore: 'melhor anterior',
    noneYet: 'nenhuma ainda',
    newBest: 'nova melhor!',
    // Arrives already written as text, so it is compared with '1'.
    left: (cards) => `${cards === '1' ? 'falta' : 'faltam'} ${cards}`,
    biggest: 'a maior',
    yours: 'a sua',
    rule: 'a regra',
    looks: (look) => `a regra olha ${look}`,
    xAxis: 'cartas só olhadas, antes de saltar',
    yBest: 'acha a maior',
    yTop: 'acha uma das 10 maiores',
    random: (chance) => `uma carta ao acaso: ${chance}`,
    deals: (deals) => `${deals} rodadas`,
    peak: (look, chance) => `olhe ${look}: ${chance}`,
    moreTitle: 'A maior carta, com menos ou mais cartas: calculado, e o pico quase não se mexe',
    more: (cards) => `${cards} cartas`,
    share: (all) => `parte olhada, até ${all}`,
    // Names given to one card at once: "a sua · a maior".
    together: (names) => names.join(' · '),
  },

  guests: [
    {
      name: 'Martin Gardner',
      note: 'A coluna Mathematical Games dele, na Scientific American, levou este enigma a um grande público em fevereiro de 1960, como o jogo do googol: números em tiras de papel, viradas uma de cada vez.',
    },
    {
      name: 'Johannes Kepler',
      note: 'Depois que a primeira esposa dele morreu, em 1611, ele considerou 11 possíveis noivas ao longo de dois anos antes de se casar de novo. A história costuma ser contada junto com este enigma, mas só como anedota.',
    },
  ],

  insight: {
    title: 'Por que 37%?',
    html: `<p>A maior carta está em algum lugar do monte, e você só tem uma chance. A regra tem duas partes. Primeiro, só olhe: vire as primeiras 37 cartas sem pegar nenhuma, só guardando qual foi a maior. Depois, salte: pegue a primeira carta que superar todas elas. Olhe pouco demais, e o padrão fica baixo, então você salta para uma carta que não é a maior. Olhe tempo demais, e a maior provavelmente já passou enquanto você olhava. O equilíbrio fica em cerca de 37% das cartas, uma parte de 1/e, onde e = 2,718….</p>
<div class="insight-visual">Olhe 37 de 100, depois pegue a primeira carta que superar todas: a maior em 37,1% das vezes · uma carta ao acaso: 1%</div>
<h3>Por que 37% duas vezes?</h3>
<p>Só olhando as primeiras r de n cartas, a regra acha a maior quando a maior vem depois, e a melhor carta antes dela estava entre as primeiras r. Somando tudo isso, dá P(r) = (r/n) · (1/r + 1/(r + 1) + … + 1/(n − 1)). Para um monte grande, com x = r/n a parte olhada, isso fica perto de −x ln x, que é máximo em x = 1/e, onde o seu valor também é 1/e ≈ 36,8%. Com 10 cartas: olhe 3 e ganhe em 39,9% das vezes. Com 100: olhe 37, 37,1%. Com um milhão: olhe 367.879, 36,8%. O número quase não se mexe.</p>
<h3>Valendo qualquer uma das 10 maiores</h3>
<p>Se qualquer uma das dez maiores servir, o melhor ponto de corte único escorrega para a esquerda: olhe só 14 cartas, depois salte, e você pega uma das 10 maiores em 81,7% das vezes, contra 66,3% olhando 37. Para esse objetivo, porém, um único ponto de corte não é a melhor regra. A melhor vai ficando menos exigente à medida que as cartas acabam: olha 31 cartas e depois pega uma nova melhor; a partir da carta 44, também pega uma carta que seja a segunda melhor até ali; a partir da carta 53, uma terceira melhor, e assim por diante. Ela pega uma das 10 maiores em 98,1% das vezes. O ponto de corte único daqui é só uma ilustração.</p>
<h3>O que isto deixa de fora</h3>
<p>A regra dos 37% se apoia em hipóteses fortes: você sabe quantas cartas há, elas vêm em ordem aleatória, não dá para voltar, só a maior de todas conta, e você julga cada carta só pela comparação com as anteriores. Aqui você também vê os próprios números, mas eles não vêm de nenhuma faixa fixa, então um número que parece grande diz pouco sozinho. Se você soubesse de onde vêm os números (digamos, espalhados por igual entre 0 e 1), daria para fazer melhor que 37%. As barras da curva são simuladas: 10.000 rodadas, cada uma jogada com todos os pontos de corte. A linha junto delas é calculada exatamente, assim como as curvinhas para 10, 1.000 e um milhão de cartas.</p>
<p>O enigma costuma ser contado como conselho para achar um par: conheça pessoas por um tempo, depois fique com a próxima que superar todas até ali. A vida real quebra todas as hipóteses. Você não sabe quantas pessoas vai conhecer, elas não chegam em ordem aleatória, às vezes dá para voltar, as pessoas não se classificam por um único número, e a outra pessoa também tem voz.</p>
<details><summary>Quem resolveu?</summary><p>Ao que se sabe, o enigma apareceu impresso pela primeira vez na coluna Mathematical Games de Martin Gardner, na Scientific American, em fevereiro de 1960, como o “jogo do googol”, que John Fox e Gerald Marnie tinham inventado em 1958. Merrill Flood já o tinha proposto numa palestra em 1949, como o “problema da noiva”. Várias pessoas o resolveram no começo dos anos 1960, e ele virou um campo inteiro. Na versão clássica (só importa como cada carta se compara com as anteriores, não dá para voltar, só a maior conta), nenhuma regra é melhor do que olhar e depois saltar. O artigo de Thomas Ferguson “Who solved the secretary problem?” conta a história, voltando até um problema parecido de Arthur Cayley, de 1875. Johannes Kepler também costuma ser lembrado: depois que a primeira esposa dele morreu, em 1611, ele considerou 11 possíveis noivas ao longo de dois anos antes de se casar com Susanna Reuttinger, em 1613. É uma anedota, não um uso da regra. T. S. Ferguson, Statistical Science 4(3), 282–289 (1989).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Secretary_problem" target="_blank" rel="noopener">O problema da secretária (em inglês)</a><a class="source-link" href="https://doi.org/10.1214/ss/1177012493" target="_blank" rel="noopener">Ferguson, Who solved the secretary problem? (1989, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Optimal_stopping" target="_blank" rel="noopener">Parada ótima (em inglês)</a></div>`,
  },
});
