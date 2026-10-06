/* Rolos que não são redondos · palavras para o visitante (pt). */
Wonderlattice.defineText('rollers', 'pt', {
  eyebrow: 'LARGURA CONSTANTE',
  name: 'Rolos que não são redondos',
  tagline:
    'Uma tábua desliza perfeitamente nivelada sobre rolos em forma de triângulos arredondados, e um deles consegue fazer um furo quase quadrado.',
  title: 'Rolos que não são redondos.',
  subtitle:
    'Uma tábua sobre rolos em forma de triângulos arredondados desliza perfeitamente nivelada, como sobre toras redondas. Embaixo, as mesmas formas como rodas presas a eixos: o carrinho sobe e desce.',
  field: 'Geometria · Curvas de largura constante · O triângulo de Reuleaux',
  sceneLabels: ['Rolos e rodas', 'Uma broca num quadrado', 'Uma volta cada'],
  tip: 'Arraste para os lados para rolar · Teclas: ← → rolam, ↑ ↓ mudam a forma · Enter: uma nova forma irregular',
  actionLabel: 'Nova forma irregular',
  canvasLabel:
    'Em cima, uma tábua com um caixote anda sobre três rolos que não são redondos, e uma caneta no caixote desenha uma linha perfeitamente reta. Embaixo, um carrinho com rodas da mesma forma, presas a eixos, sobe e desce, e a caneta dele desenha uma onda. Na vista da broca, um triângulo curvo gira dentro de um quadrado e pinta quase todo ele. Na corrida, quatro formas da mesma largura rolam uma volta cada uma e chegam juntas.',
  panelEyebrow: 'Escolha uma forma',
  whyLabel: 'Por que a tábua fica nivelada?',
  nudge:
    'Aperte “Nova forma irregular”: qualquer forma com a mesma largura em todas as direções leva a tábua nivelada. Depois experimente “Um furo quadrado”.',
  connection: {
    html: '<strong>Viagens suaves.</strong> Aqui, rolos que não são redondos levam uma tábua nivelada. Em “Rodas quadradas, viagem suave”, rodas quadradas andam niveladas sobre uma estrada de lombadas.',
    label: 'Rodas quadradas, viagem suave',
  },

  presets: [
    { name: 'Rolos triangulares', note: 'Três sob uma tábua, e a mesma forma como rodas.' },
    { name: 'Um furo quadrado', note: 'Um triângulo girando preenche quase todo um quadrado.' },
    { name: 'Uma volta cada', note: 'Mesma largura, mesmo contorno: todas rolam a mesma distância.' },
  ],

  view: 'O que experimentar',
  views: ['Rolos', 'Broca', 'Uma volta'],
  shape: 'Forma',
  shapes: ['Círculo', 'Triângulo', 'Pentágono', 'Irregular'],
  lines: 'Retas que a constroem',
  linesHint: 'Cada pedaço do contorno é um arco com centro onde duas das retas se cruzam.',
  corners: 'Cantos arredondados',
  cornersHint:
    'O raio da curva mais fechada, como fração da largura. Arredondar todos os cantos mantém a largura igual.',

  // The scene's name, for each shape (sharp or rounded) and each view.
  names: {
    rollers: (kind, rounded) =>
      kind === 0
        ? 'Toras redondas'
        : kind === 1
          ? rounded
            ? 'Triângulos arredondados'
            : 'Triângulos de Reuleaux'
          : kind === 2
            ? rounded
              ? 'Pentágonos arredondados'
              : 'Pentágonos de Reuleaux'
            : 'Uma forma irregular',
    drill: (kind, rounded) =>
      kind === 0
        ? 'Furando com um círculo'
        : kind === 1
          ? rounded
            ? 'Furando com um triângulo arredondado'
            : 'Furando com um triângulo de Reuleaux'
          : kind === 2
            ? rounded
              ? 'Furando com um pentágono arredondado'
              : 'Furando com um pentágono de Reuleaux'
            : 'Furando com uma forma irregular',
    race: 'Quatro formas, uma largura',
  },

  // Numbers arrive already written in the page's language.
  percent: (x) => `${x}%`,
  readout: {
    level: 'A tábua fica perfeitamente nivelada.',
    drill: 'Um furo quase quadrado.',
    drillRound: 'Um furo redondo.',
    drillOther: 'Um furo com cantos arredondados.',
    race: 'Todas chegam juntas.',
    plank: 'A tábua sobre rolos',
    plankValue: 'nunca sobe nem desce',
    cart: 'O carrinho em eixos sobe e desce',
    cartValue: (share) => `${share} da largura`,
    rim: 'O contorno mede',
    rimValue: (times) => `${times} × a largura`,
    area: 'A área é',
    areaValue: (share) => `${share} da área de um círculo`,
    drilled: 'Furado até agora',
    drilledValue: (share) => `${share} do quadrado`,
    full: 'Depois de uma volta inteira',
    fullValue: (share) => `${share} do quadrado`,
    rims: 'Todo contorno mede',
    rimsValue: 'π × a largura',
    least: 'A menor área',
    leastValue: (share) => `o triângulo: ${share} da área de um círculo`,
    widthRule: 'Gire como quiser: a largura é exatamente a mesma.',
    drillRule: 'Ela toca os quatro lados enquanto gira, porque tem a largura do quadrado em todas as direções.',
    raceRule:
      'Numa volta completa, uma forma percorre o comprimento do seu contorno: π vezes a largura, seja qual for a forma.',
  },
  status: {
    rollers: 'Nivelada sobre rolos',
    drill: (share) => `${share} furado`,
    race: 'Mesma largura, mesmo contorno',
  },

  // Words drawn on the canvas.
  labels: {
    rollers: 'Como rolos: a tábua fica sempre nivelada',
    axles: (share) => `Em eixos: o carrinho oscila ${share} da largura`,
    axlesRound: 'Em eixos: o círculo segue nivelado',
    close: 'De perto: a largura não muda',
    width: 'largura',
    lines: 'As retas que a constroem',
    corner: (n) => `Um canto, ${n}× mais perto`,
    path: 'Caminho do centro',
    finish: 'Uma volta: π × largura',
    rim: 'Contorno desenrolado',
  },

  announce: {
    rollers: (name, share) =>
      `${name}: a tábua fica nivelada sobre rolos; em eixos, o carrinho sobe e desce ${share} da largura.`,
    round: (name) => `${name}: tudo nivelado como rolos, e em eixos também.`,
    drill: (name, share) => `${name}: depois de uma volta inteira, furou ${share} do quadrado.`,
    race: 'Quatro formas da mesma largura dão uma volta cada uma, e todas chegam juntas.',
  },

  guests: [
    {
      name: 'Franz Reuleaux',
      note: 'Descrevi as máquinas como cadeias de peças móveis simples e mandei construir centenas de modelos de mecanismos para o ensino. O triângulo curvo daqui leva o meu nome, embora outros o tenham desenhado muito antes de mim.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Num artigo que apresentei em 1771, estudei triângulos curvos e as formas que têm a mesma largura em todas as direções. Chamei essas formas de orbiformes.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'Em 1860, mostrei que toda forma de largura constante tem um contorno de exatamente π vezes a sua largura, seja qual for a forma.',
    },
  ],

  insight: {
    title: 'Por que a tábua fica nivelada?',
    html: `<p>O chão fica embaixo de cada rolo e a tábua se apoia em cima, então a altura da tábua é a distância entre duas retas paralelas que tocam o rolo: a largura dele, medida na vertical. Um círculo tem a mesma largura em todas as direções. Todas as formas desta sala também: meça qualquer uma de lado a lado, em qualquer direção, e o resultado é o mesmo. Enquanto o rolo gira, a largura dele na vertical nunca muda, e a altura da tábua também não.</p>
<div class="insight-visual">altura da tábua = largura do rolo na vertical = a mesma em todas as direções</div>
<h3>Rolos, não rodas</h3>
<p>O centro de um triângulo de Reuleaux fica mais perto dos lados do que dos cantos, então, enquanto ele rola, o centro sobe e desce. Para um rolo, tanto faz, já que nada está preso ao centro dele. Uma roda gira num eixo que passa pelo centro, então um carrinho sobre triângulos de Reuleaux sobe e desce 15% da largura, três vezes por volta. Sob a tábua, os rolos também não andam exatamente no mesmo ritmo: cada um avança um pouco mais rápido ou mais devagar enquanto gira, embora, em média, como as toras redondas, ande à metade da velocidade da tábua.</p>
<h3>Como desenhar um</h3>
<p>Desenhe um triângulo equilátero, ponha a ponta de um compasso em cada canto, um de cada vez, e trace o arco entre os outros dois: isso é um triângulo de Reuleaux. Qualquer polígono regular com um número ímpar de lados funciona do mesmo jeito. As formas irregulares usam o método das retas cruzadas: trace algumas retas, todas se cruzando, e ligue cada reta à seguinte, dando a volta, por um arco com centro onde elas se cruzam. Depois de duas voltas, a curva se fecha, com a mesma largura em todas as direções. Arredondar os cantos, na mesma medida em toda a volta, mantém a largura igual.</p>
<h3>Uma volta, a mesma distância</h3>
<p>Toda forma daqui tem um contorno de exatamente π vezes a sua largura, tão longo quanto o de um círculo da mesma largura. Esse é o teorema de Barbier, de 1860. Então, numa volta completa, cada uma percorre a mesma distância. As áreas são diferentes: o círculo tem a maior, e o triângulo de Reuleaux a menor de todas as formas da mesma largura, o teorema de Blaschke–Lebesgue (Henri Lebesgue em 1914, Wilhelm Blaschke em 1915).</p>
<h3>Um furo quadrado</h3>
<p>Qualquer forma de largura constante consegue girar dentro de um quadrado da sua largura, tocando os quatro lados o tempo todo. O triângulo de Reuleaux, com os cantos mais pontudos que uma forma dessas pode ter (120°), varre tudo menos as pontinhas dos cantos: 2√3 + π/6 − 3 do quadrado, cerca de 98,8%. Brocas quadradas baseadas nessa ideia foram patenteadas em 1914 e ainda são fabricadas, embora brocas parecidas tenham sido usadas antes. O centro da broca passeia enquanto ela gira, então ela precisa de um mandril especial que permita isso, e de uma guia com um furo quadrado. Os cantos mais rombudos do pentágono deixam mais coisa para trás, e um círculo faz um furo redondo, π/4 do quadrado.</p>
<h3>O que a sala deixa de fora</h3>
<p>Aqui os rolos são perfeitos, o chão e a tábua são perfeitamente planos, e nada escorrega. Rolos de verdade precisam ter todos exatamente a mesma largura, e alguém tem de levar cada um de trás para a frente, como acontece aqui quando um rolo some e volta. Uma broca de verdade também precisa de arestas de corte, então ela é um triângulo de Reuleaux com sulcos. Também existem sólidos de largura constante, como os corpos de Meissner, mas a sala fica no plano; o sólido feito como um triângulo de Reuleaux a partir de quatro bolas, o tetraedro de Reuleaux, não tem exatamente a mesma largura em todas as direções.</p>
<p>Costuma-se dizer que as tampas de bueiro são redondas para não caírem nos buracos. Uma tampa com qualquer forma daqui também não cairia; as tampas redondas também são muito mais fáceis de fazer, e não precisam ser giradas para encaixar. Algumas moedas são formas de largura constante, como as britânicas de 20p e 50p, que são heptágonos de Reuleaux, para que as máquinas consigam medi-las de lado a lado, seja qual for a posição.</p>
<details><summary>A matemática, se você quiser</summary><p>Descreva uma forma pela sua função suporte h(θ): a que distância de um centro fica a sua reta tangente voltada para a direção θ. A largura dela na direção θ é h(θ) + h(θ + π), então largura constante w significa h(θ) + h(θ + π) = w para todo θ. Rolando no chão sem escorregar, a forma gira em torno do ponto onde toca o chão. Quando ela gira dψ, a tábua, w acima desse ponto, anda w dψ, e o centro, h acima dele, anda h dψ. Numa volta inteira, o centro anda ∫h dθ = πw, metade do que a tábua anda, porque valores opostos de h somam w. O comprimento do contorno é ∫(h + h″) dθ = ∫h dθ, o mesmo πw: o teorema de Barbier.</p><p>As formas da sala são feitas de arcos pelo método das retas cruzadas, e cada uma gira em torno do centro do menor círculo que a contém, que, para uma forma de largura constante, também é o centro do maior círculo dentro dela; esses dois raios somam a largura. No quadrado de −½ a ½, a forma girada de φ tem o centro em (½ − h(−φ), ½ − h(π/2 − φ)), então as retas tangentes dela voltadas para a direita e para cima ficam sobre esses lados, e, pela largura constante, as da esquerda e de baixo também. Para o triângulo de Reuleaux, esse centro percorre quatro arcos de elipse.</p><p>Os testes da sala conferem, contra um programa separado que constrói cada polígono de Reuleaux a partir de discos sobrepostos: a largura em todas as direções, o comprimento do contorno, π, a área do triângulo, (π − √3)/2 ≈ 0,7048, e a do pentágono, o sobe e desce num eixo, de 2/√3 − 1 ≈ 15,5% para o triângulo e 5,1% para o pentágono, e a parte do quadrado furada: 98,8% pelo triângulo, 87,9% pelo pentágono e π/4 pelo círculo.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_triangle" target="_blank" rel="noopener">Triângulo de Reuleaux (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Curve_of_constant_width" target="_blank" rel="noopener">Curva de largura constante (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Reuleaux_polygon" target="_blank" rel="noopener">Polígono de Reuleaux (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Barbier%27s_theorem" target="_blank" rel="noopener">Teorema de Barbier (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Blaschke%E2%80%93Lebesgue_theorem" target="_blank" rel="noopener">Teorema de Blaschke–Lebesgue (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Watts_Brothers_Tool_Works" target="_blank" rel="noopener">Watts Brothers Tool Works (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Manhole_cover" target="_blank" rel="noopener">Tampa de bueiro (Wikipedia, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Barbier/" target="_blank" rel="noopener">Joseph-Émile Barbier (MacTutor, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Franz_Reuleaux" target="_blank" rel="noopener">Franz Reuleaux (Wikipedia, em inglês)</a></div>`,
  },
});
