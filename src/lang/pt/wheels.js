/* Rodas quadradas, viagem suave · palavras para o visitante (pt). */
Wonderlattice.defineText('wheels', 'pt', {
  eyebrow: 'ESTRADAS E RODAS',
  name: 'Rodas quadradas, viagem suave',
  tagline:
    'Um carrinho com rodas quadradas anda perfeitamente nivelado na estrada certa. Desenhe qualquer roda, e ela ganha uma estrada sob medida.',
  title: 'Rodas quadradas, viagem suave.',
  subtitle:
    'Rodas quadradas numa estrada de lombadas: o copo de água fica perfeitamente parado. Embaixo, o mesmo carrinho numa estrada plana. Troque as rodas, ou desenhe as suas.',
  field: 'Geometria · Estradas e rodas · A catenária',
  sceneLabel: 'As mesmas rodas · duas estradas',
  tip: 'Arraste os pontos da sua roda para dentro ou para fora · Teclas: ← → mudam o número de lados, ou escolhem um ponto da sua roda, e ↑ ↓ o movem · Enter: outra roda',
  actionLabel: 'Outra roda',
  canvasLabel:
    'Duas faixas. Em cima, um carrinho com rodas quadradas rola sobre uma estrada de lombadas arredondadas, e o copo de água em cima dele desliza sempre na mesma altura. Embaixo, o mesmo carrinho rola numa estrada plana, sacolejando para cima e para baixo e fazendo a água espirrar. Numa imagem grande, mais abaixo: rodas com 3 a 8 lados, cada uma rolando na sua estrada sob medida, com o canto do triângulo invadindo a lombada seguinte, marcado em vermelho; e uma corrente pendurada ao lado da mesma curva virada, uma lombada da estrada do quadrado. Uma roda desenhada tem doze pontos para arrastar para dentro ou para fora.',
  panelEyebrow: 'Escolha uma roda',
  whyLabel: 'Por que não há solavancos?',
  nudge:
    'Aumente os lados até 12: as lombadas se achatam, chegando perto de uma estrada plana, a estrada de que uma roda redonda precisa. Depois desça até 3 e veja o canto do triângulo invadir a lombada seguinte.',
  connection: {
    html: '<strong>Curvas feitas girando.</strong> Aqui, uma roda que gira decide a forma da estrada dela. Em “Pintar com movimento”, dois braços que giram desenham flores.',
    label: 'Pintar com movimento',
  },

  presets: [
    { name: 'Rodas quadradas', note: 'Cada lombada é uma corrente pendurada, de cabeça para baixo.' },
    { name: 'Um triângulo colide', note: 'O canto dele invade a lombada seguinte.' },
    { name: 'Uma roda em forma de coração', note: 'Desenhe a sua: toda roda ganha uma estrada.' },
  ],
  // The scene's name for a regular wheel that isn't one of the presets, and for a drawn one.
  sidesName: (n) =>
    n === 3
      ? 'Rodas triangulares'
      : n === 4
        ? 'Rodas quadradas'
        : n === 5
          ? 'Rodas pentagonais'
          : n === 6
            ? 'Rodas hexagonais'
            : n === 8
              ? 'Rodas octogonais'
              : `Rodas com ${n} lados`,
  yourOwn: 'Sua própria roda',

  kind: 'Tipo de roda',
  regular: 'Rodas regulares',
  drawn: 'Sua própria roda',
  sides: 'Lados da roda',
  sidesHint: 'Mais lados, lombadas menores. O triângulo não consegue rodar na estrada dele.',
  startFrom: 'Começar com',
  shapes: { heart: 'Coração', flower: 'Flor', egg: 'Ovo', star: 'Estrela', circle: 'Círculo' },
  drawHint:
    'Arraste os pontos da roda para dentro ou para fora, e a estrada muda junto. Puxe a reentrância do coração em direção ao eixo e veja o que acontece.',

  // Numbers arrive already written in the page's language.
  percent: (x) => `${x}%`,
  readout: {
    level: 'Na estrada sob medida, o eixo fica perfeitamente nivelado.',
    crash: 'Na estrada sob medida, a roda colidiria.',
    bumps: 'A altura de cada lombada da estrada é',
    bumpsValue: (share) => `${share} do raio`,
    bob: 'Numa estrada plana, o eixo sobe e desce',
    bobValue: (share) => `${share} do raio`,
    bobDrawn: (share) => `${share} do maior raio`,
    cuts: 'A roda invade a estrada até',
    cutsValue: (depth) => `${depth} do raio`,
    cutsDrawn: (depth) => `${depth} do maior raio`,
    during: 'A colisão dura',
    duringValue: (share) => `${share} do percurso`,
    clear: 'Pontos em que a roda invade a estrada',
    clearValue: 'nenhum',
    radius: 'O raio vai do eixo até um canto.',
    rule: 'As lombadas têm exatamente a altura do sobe e desce que elas anulam.',
    drawnRule: 'A estrada é tão longa quanto o aro, e fica tão abaixo do eixo quanto o aro fica longe dele.',
  },
  status: { level: 'Sem solavancos', crash: 'Haveria colisão' },

  // Words drawn on the canvas.
  labels: {
    own: 'Estrada sob medida',
    flat: 'As mesmas rodas numa estrada plana',
    flatOne: 'A mesma roda numa estrada plana',
    crash: 'O canto invade a lombada seguinte',
    crashDrawn: 'A roda e a estrada colidem',
    closer: (n) => `${n}× maior`,
    gallery: 'Cada roda regular tem a sua estrada · Toque numa para rodar',
    galleryDrawn: 'Rodas para começar · Toque numa para rodar',
    chain: 'Corrente pendurada em dois pregos',
    turned: 'Virada: a lombada certa para o quadrado',
    sides: (n) => `${n} lados`,
    crashes: 'colide',
  },

  announce: {
    level: (name, bump) => `${name}: viagem sem solavancos, sobre lombadas de altura igual a ${bump} do raio.`,
    levelDrawn: (name) => `${name}: viagem sem solavancos na estrada sob medida.`,
    crash: (name) => `${name}: na estrada sob medida, haveria colisão.`,
    picked: (n) => `Ponto ${n} de 12: as setas para cima e para baixo o movem para fora e para dentro.`,
  },

  guests: [
    {
      name: 'Johann Bernoulli',
      note: 'Em 1691, ele achou a forma de uma corrente pendurada em dois pregos, um enigma proposto pelo irmão dele, Jacob: o primeiro grande resultado que ele obteve sozinho.',
    },
    {
      name: 'Christiaan Huygens',
      note: 'Ele foi o primeiro a chamar a curva da corrente pendurada de catenária, da palavra latina para “corrente”, numa carta a Leibniz em 1690.',
    },
    {
      name: 'Gottfried Leibniz',
      note: 'Ele também resolveu o problema da corrente pendurada. A resposta dele, a de Huygens e a de Johann Bernoulli saíram lado a lado numa revista científica em junho de 1691.',
    },
  ],

  insight: {
    title: 'Por que não há solavancos?',
    html: `<p>Para o eixo deslizar sempre na mesma altura, duas coisas precisam valer a cada instante. O ponto onde a roda toca a estrada tem de estar bem embaixo do eixo, então ali a estrada precisa ficar exatamente tão abaixo do eixo quanto esse ponto do aro: pouco abaixo, sob o meio de um lado, e bem mais abaixo, sob um canto. E a roda não pode escorregar, então cada pedacinho de estrada precisa ter o mesmo comprimento do pedacinho de aro que rola sobre ele.</p>
<div class="insight-visual">profundidade da estrada = distância do eixo ao aro · comprimento da estrada = comprimento do aro</div>
<h3>Correntes penduradas, de cabeça para baixo</h3>
<p>Para um lado reto, essas duas regras dão uma curva famosa: a forma de uma corrente pendurada entre dois pregos, chamada catenária, virada de cabeça para baixo. Cada lado do quadrado rola sobre uma lombada, e cada canto cai no vale entre duas lombadas, onde elas se encontram em ângulo reto, igualzinho ao canto. Com mais lados, as lombadas ficam mais baixas e mais curtas. À medida que o número de lados cresce, a roda fica redonda e a estrada, plana.</p>
<p>As lombadas têm exatamente a altura do sobe e desce que elas anulam. Numa estrada plana, o eixo sobe e desce a diferença entre a distância dele até um canto e até o meio de um lado; na estrada sob medida, os vales ficam exatamente essa diferença abaixo dos topos.</p>
<h3>Por que o triângulo falha</h3>
<p>As duas regras também dão uma estrada para um triângulo, mas não dá para rodar nela. Enquanto o triângulo rola sobre uma lombada, o canto da frente desce e invade a lombada seguinte antes de chegar ao vale. A estrada está certa em cada ponto onde a roda a toca, e fica no caminho em todo o resto. Toda roda regular com quatro lados ou mais passa sem esbarrar na própria estrada.</p>
<h3>Qualquer roda, uma estrada sob medida</h3>
<p>A sua roda segue as mesmas duas regras, então um coração ou um ovo também ganha uma estrada. A sala a constrói a partir da distância do aro ao eixo em cada direção e depois confere, em centenas de instantes enquanto a roda rola, se algum pedaço da estrada entra na roda. Algumas rodas falham, e os lugares aparecem em vermelho: uma ponta afiada se crava na lombada seguinte, como o canto do triângulo, ou uma reentrância funda cria um pico alto e pontudo na estrada, que espeta o aro antes que a reentrância dê a volta e chegue até ele.</p>
<p>Os pontos da sua roda só se movem para dentro e para fora ao longo dos raios, então cada direção a partir do eixo encontra o aro exatamente uma vez. Um aro que se dobrasse para trás, visto do eixo, precisaria de uma estrada que subisse na vertical.</p>
<details><summary>A matemática, se você quiser</summary><p>Descreva a roda pela distância do aro ao eixo, r(θ), em cada direção θ. Com o eixo mantido na reta y = 0 e o ponto de contato bem embaixo dele, a estrada sob o ponto θ da roda fica na altura y = −r(θ), e rolar sem escorregar dá dx = r dθ. Para o lado de um polígono regular, a uma distância a do eixo, r = a / cos θ, então x = a arsinh(tan θ) e y = −a cosh(x / a): uma catenária de cabeça para baixo, exatamente tão longa quanto o lado.</p>
<p>Leon Hall e Stan Wagon descreveram esses pares de rodas e estradas em “Roads and Wheels” (1992). O Exploratorium, em San Francisco, já expôs um par de rodas quadradas numa estrada assim; Stan Wagon construiu um triciclo com rodas quadradas no Macalester College em 1997, e o National Museum of Mathematics, em Nova York, tem um que anda sobre catenárias.</p>
<p>A catenária em si é mais antiga. Galileu achava que uma corrente pendurada formava uma parábola; Joachim Jungius mostrou que não (em trabalho publicado em 1669), e em 1691 Gottfried Leibniz, Christiaan Huygens e Johann Bernoulli encontraram a equação dela, respondendo a um desafio de Jacob Bernoulli.</p>
<p>Os testes da sala conferem, contra um cálculo separado, que a estrada do quadrado é y = −a cosh(x / a), que estrada e aro mantêm comprimentos iguais, que rodas com 4 a 12 lados passam sem esbarrar nas suas estradas enquanto o canto do triângulo invade a lombada seguinte em até 3% do raio dele, e as profundidades de outras colisões.</p></details>
<h3>O que a sala deixa de fora</h3>
<p>A estrada precisa combinar exatamente com o tamanho da roda, e estar alinhada com ela: comece uma roda quadrada na encosta de uma lombada em vez de no topo, e ela anda mal. Um carrinho de verdade também tem rodas dos dois lados, que precisam andar em sincronia umas com as outras e com as lombadas. O carrinho daqui rola a uma velocidade constante, sem molas, sem balanço e sem atrito, e os respingos da água na estrada plana são desenhados por diversão, não calculados.</p>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Square_wheel" target="_blank" rel="noopener">Roda quadrada (Wikipedia, em inglês)</a><a class="source-link" href="https://mathworld.wolfram.com/Roulette.html" target="_blank" rel="noopener">A curva roleta (MathWorld, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Catenary" target="_blank" rel="noopener">Catenária (Wikipedia, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Curves/Catenary/" target="_blank" rel="noopener">Catenária (MacTutor, em inglês)</a><a class="source-link" href="https://www.sciencenews.org/article/riding-square-wheels" target="_blank" rel="noopener">Andando sobre rodas quadradas (Science News, 2004, em inglês)</a><a class="source-link" href="https://math.hmc.edu/funfacts/?p=172" target="_blank" rel="noopener">Bicicleta com rodas quadradas (Math Fun Facts, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stan_Wagon" target="_blank" rel="noopener">Stan Wagon (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Museum_of_Mathematics" target="_blank" rel="noopener">National Museum of Mathematics (Wikipedia, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Bernoulli_Johann/" target="_blank" rel="noopener">Johann Bernoulli (MacTutor, em inglês)</a></div>`,
  },
});
