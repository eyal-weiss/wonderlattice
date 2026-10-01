/* O triângulo com três ângulos retos · palavras para o visitante (pt). */
Wonderlattice.defineText('globe', 'pt', {
  eyebrow: 'ESPAÇO CURVO',
  name: 'O triângulo com três ângulos retos',
  tagline: 'Numa bola, um triângulo pode ter três ângulos retos, e uma seta levada ao redor dele volta girada.',
  title: 'O triângulo com três ângulos retos.',
  subtitle:
    'Um triângulo desenhado numa bola, com ângulos que somam 270°. Arraste os cantos dele, ou encolha-o até a bola parecer plana.',
  field: 'Geometria numa bola · Curvatura · Transporte paralelo',
  sceneLabel: 'Numa bola · lados retos, ângulos gordos',
  tip: 'Arraste um canto para mudar o triângulo, ou arraste a bola para girá-la · Teclas: 1, 2, 3 escolhem um canto, as setas o movem (ou giram a bola), Esc solta, Enter caminha de novo',
  actionLabel: 'Dar a volta de novo',
  canvasLabel:
    'Uma bola com uma grade de meridianos e paralelos. Nela, um triângulo cujos lados são arcos de círculos máximos, com os três ângulos marcados. Um caminhante leva uma seta em volta do triângulo.',
  panelEyebrow: 'Molde o triângulo',
  whyLabel: 'Por que mais de 180°?',
  nudge:
    'Diminua o tamanho até o triângulo virar um pontinho. Os ângulos voltam devagarinho a 180°, porque, para uma formiga, uma bola parece plana.',
  connection: {
    html: '<strong>Superfícies curvas, regras retas.</strong> Numa bola, os triângulos ganham ângulos gordos. Em “Entorte o plano”, uma função entorta uma imagem plana e mantém cada ângulo minúsculo como era.',
    label: 'Entorte o plano',
  },

  presets: [
    { name: 'Três ângulos retos', note: 'Do polo ao equador, um quarto de volta por ele, e de volta ao polo.' },
    { name: 'Um quarto da bola', note: 'Três ângulos de 120°. Quatro destes cobrem a bola.' },
    { name: 'O triângulo da formiga', note: 'Tão pequeno que é quase plano.' },
  ],
  yourOwn: 'Seu próprio triângulo',

  // Numbers arrive already written in the page's language.
  degrees: (x) => `${x}°`,
  percent: (x) => `${x}%`,
  sum: (parts, total) => `${parts.join(' + ')} = ${total}`,
  more: (extra) => `${extra} a mais que no plano (180°)`,
  walking: 'Levando a seta, sem nunca girá-la…',
  home: (turned) => `De volta ao início: a seta girou ${turned}`,
  zoomed: (n) => `Ampliado ${n} vezes`,
  chart: {
    title: 'Todos os seus triângulos caem numa só reta',
    across: 'Parte da bola',
    up: 'Excesso sobre 180°',
  },
  corner: (n) => `${n}`,

  size: 'Tamanho do triângulo',
  sizeHint: 'Encolha-o até virar um pontinho, ou aumente-o até cobrir quase metade da bola.',
  shareOf: (share) => `${share} da bola`,
  readout: {
    angles: 'Seus três ângulos',
    extra: 'Excesso sobre 180°',
    share: 'Parte da bola',
    turned: 'A seta voltou girada em',
  },
  onItsWay: 'a caminho…',
  rule: (share, extra) =>
    `${share} da bola × 720° = ${extra}. Em qualquer bola, o excesso é a parte da bola que o triângulo cobre, vezes 720°.`,
  status: (total) => `Os ângulos somam ${total}`,
  picked: (n) => `Canto ${n}: as setas o movem. Esc solta.`,
  letGo: 'As setas giram a bola.',
  cameHome: (turned, total) => `Os ângulos somam ${total}. A seta voltou girada em ${turned}.`,

  guests: [
    {
      name: 'Albert Girard',
      note: 'Em 1629, ele publicou que os ângulos de um triângulo numa bola somam mais de 180°, por uma quantidade que cresce com a área dele.',
    },
    {
      name: 'Carl Friedrich Gauss',
      note: 'Em 1827, ele provou que a curvatura de uma superfície pode ser medida de dentro dela, só com ângulos e distâncias, sem nunca sair dela.',
    },
    {
      name: 'Tullio Levi-Civita',
      note: 'Em 1917, ele descreveu como levar uma seta por uma superfície curva sem girá-la, a ideia que o caminhante daqui segue.',
    },
  ],

  insight: {
    title: 'Por que mais de 180°?',
    html: `<p>Numa bola, os caminhos mais retos são os círculos máximos, como o equador e as linhas de polo a polo. Um triângulo com os lados sobre eles fica estufado para fora, então seus ângulos somam mais que os 180° de um triângulo plano. Ande do Polo Norte até o equador, vire à esquerda, ande um quarto da volta, vire à esquerda de novo e suba de volta até o polo: você encontra o próprio caminho em ângulo reto, e os três ângulos são de 90°.</p>
<div class="insight-visual">soma dos ângulos − 180° = parte da bola × 720°</div>
<h3>O excesso é a área</h3>
<p>O ângulo a mais é proporcional à área do triângulo. A bola inteira vale 720°, então um triângulo que cobre um oitavo dela tem 90° de sobra, e cada 1% da bola acrescenta 7,2°. Encolha um triângulo até virar um pontinho e o excesso quase some: um pedacinho de bola é quase plano, e é por isso que a geometria plana funciona tão bem para um jardim ou uma cidade.</p>
<h3>Uma seta que nunca gira volta girada</h3>
<p>O caminhante leva uma seta e a mantém sempre no mesmo ângulo com o caminho reto por onde anda. Só o caminho vira, nos cantos; a seta nunca. Mesmo assim, ela volta girada exatamente pelo excesso. Num papel plano, ela voltaria exatamente como saiu. Levar uma seta assim se chama transporte paralelo, e o giro dela ao fim de uma volta se chama holonomia. Isso quer dizer que uma criatura que vive na superfície, sem poder sair dela nem vê-la de fora, ainda assim poderia descobrir que o seu mundo é curvo.</p>
<details><summary>A matemática, se você quiser</summary><p>Numa bola de raio R, um triângulo com ângulos A, B e C (em radianos) tem área (A + B + C − π)R². Albert Girard publicou isso em 1629; Thomas Harriot já tinha descoberto em 1603, mas nunca publicou. É um caso particular do teorema de Gauss–Bonnet: em qualquer superfície, a soma dos ângulos de um triângulo passa de π pela curvatura total dentro dele, e o transporte paralelo em volta do triângulo gira uma seta no sentido anti-horário por esse mesmo total (para uma volta percorrida no sentido anti-horário). Gauss provou em 1827, no seu <em>Theorema Egregium</em> (“teorema notável”), que a curvatura pode ser medida de dentro de uma superfície. Tullio Levi-Civita descreveu o transporte paralelo em espaços curvos em 1917, e Élie Cartan introduziu a holonomia em 1926.</p>
<p>A sala calcula cada área só a partir dos cantos (uma fórmula de Van Oosterom e Strackee, de 1983), e cada ângulo a partir das direções dos lados. Os testes dela conferem que os dois sempre concordam, e que uma seta levada em passinhos gira a mesma quantidade.</p>
<p>A mesma geometria está por trás do pêndulo de Foucault, mostrado pela primeira vez em Paris em 1851. A Terra, girando, leva o pêndulo em volta do seu círculo de latitude, e o plano de oscilação dele gira 360° × sin(latitude) num dia sideral (cerca de 23 horas e 56 minutos). Isso também envolve a rotação da Terra, então o caminhante daqui só compartilha a geometria: ele não é um pêndulo.</p></details>
<h3>O que a sala deixa de fora</h3>
<p>A bola daqui é perfeitamente redonda. A Terra é levemente achatada: do centro a um polo, a distância é cerca de 0,3% menor do que até o equador. Por isso, na Terra de verdade, os números mudam um pouco. Os lados sempre seguem o caminho mais curto pelo seu círculo máximo, e os ângulos aparecem arredondados, mas sempre de um jeito que bata com a soma mostrada.</p>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/GirardsSphericalExcessFormula.html" target="_blank" rel="noopener">Fórmula do excesso esférico de Girard (MathWorld, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Spherical_trigonometry" target="_blank" rel="noopener">Trigonometria esférica (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Parallel_transport" target="_blank" rel="noopener">Transporte paralelo (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Holonomy" target="_blank" rel="noopener">Holonomia (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gauss%E2%80%93Bonnet_theorem" target="_blank" rel="noopener">Teorema de Gauss–Bonnet (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Theorema_Egregium" target="_blank" rel="noopener">Theorema Egregium (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Levi-Civita_connection" target="_blank" rel="noopener">Conexão de Levi-Civita (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Solid_angle" target="_blank" rel="noopener">Ângulo sólido (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Foucault_pendulum" target="_blank" rel="noopener">Pêndulo de Foucault (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Figure_of_the_Earth" target="_blank" rel="noopener">Figura da Terra (Wikipedia, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Girard_Albert/" target="_blank" rel="noopener">Albert Girard (MacTutor, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/" target="_blank" rel="noopener">Carl Friedrich Gauss (MacTutor, em inglês)</a></div>`,
  },
});
