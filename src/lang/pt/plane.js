Wonderlattice.defineText('plane', 'pt', {
  eyebrow: 'NÚMEROS COMPLEXOS',
  name: 'Entorte o plano',
  tagline: 'Deforme uma imagem sem rasgar; um círculo vira uma asa.',
  title: 'Entorte o plano.',
  subtitle:
    'Passe uma imagem por uma função complexa. O plano inteiro se deforma, mas os ângulos retos minúsculos continuam retos.',
  field: 'Números complexos · Transformações conformes · Asas',
  sceneLabel: 'O plano, deformado',
  tip: 'Arraste a bússola à esquerda, ou mova-a com as setas · Sua gêmea à direita mostra o quanto estica e gira',
  tipStacked: 'Arraste a bússola na imagem de cima, ou use as setas · Sua gêmea embaixo mostra o quanto estica e gira',
  actionLabel: 'Deformar',
  canvasLabel:
    'Duas cópias do plano. Na primeira, uma imagem e uma pequena bússola de duas setas perpendiculares; na segunda, suas imagens pela função complexa escolhida. Arraste a bússola ou mova-a com as setas.',
  panelEyebrow: 'Escolha uma deformação',
  whyLabel: 'Por que os ângulos retos sobrevivem?',
  nudge:
    'Eleve o plano ao quadrado e depois arraste a bússola até o centro exato. O que acontece com a gêmea dela ali?',
  connection: {
    html: '<strong>Deformar sem rasgar.</strong> Aqui uma função deforma o plano inteiro e mantém seus ângulos minúsculos. Em “Cadê o outro lado?”, uma tira se dobra numa superfície com um lado só.',
    label: 'Visitar “Cadê o outro lado?”',
  },
  functions: ['Quadrado · z²', 'Do avesso · 1/z', 'Enrolar · eᶻ', 'Onda · sin z', 'Asa · z + 1/z'],
  formulas: ['w = z²', 'w = 1/z', 'w = eᶻ', 'w = sin z', 'w = z + 1/z'],
  pictures: ['Quadriculado', 'Um peixe', 'Um rosto', 'Círculos e raios', 'O círculo da asa'],
  functionLabel: 'Função',
  pictureLabel: 'Imagem',
  bendLabel: 'Quanto deformar',
  thickLabel: 'Espessura',
  camberLabel: 'Arqueamento',
  gridLabel: 'Mostrar uma grade suave ao fundo',
  flowLabel: 'Mostrar o ar passando',
  at: 'A bússola em',
  stretch: 'Quanto estica aqui',
  stretchMath: '(|f′(z)|)',
  turn: 'Quanto gira',
  turnMath: '(arg f′(z))',
  point: (x, y) => `${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i`.replace(/^-/, '−'),
  times: (x) => `${x}×`,
  degrees: (d) => `${d < 0 ? '−' : ''}${Math.abs(d)}°`,
  none: '–',
  status: (stretch, turn) => `×${stretch} · giro ${turn}`,
  statusCritical: 'Aqui f′ = 0',
  statusPole: 'Um polo: f = ∞',
  announceCritical: 'f′ = 0 aqui: os ângulos dobram',
  announcePole: 'Um polo: a função é infinita aqui',
  keeps: 'As setas da gêmea ainda se encontram em ângulo reto.',
  critical: 'Aqui f′ = 0. As setas da gêmea encolhem até sumir, e os ângulos dobram.',
  pole: 'Aqui f é infinita, um polo. A gêmea voou para fora do mapa.',
  away: 'A gêmea está fora da borda da imagem deformada.',
  blending: 'Deformação parcial: uma mistura de z e f(z), para ajudar o olho.',
  zLabel: 'z',
  wLabel: 'w',
  bent: (formula, percent) => `${formula} · ${percent}% deformado`,
  criticalMark: 'f′ = 0',
  poleMark: 'polo',
  presets: [
    {
      name: 'O plano ao quadrado',
      note: 'No centro, os ângulos dobram.',
    },
    {
      name: 'Virar do avesso',
      note: 'Retas viram círculos.',
    },
    {
      name: 'Enrolar',
      note: 'Retas viram anéis e raios.',
    },
    {
      name: 'Um peixe ao quadrado',
      note: 'Todo deformado, e ainda um peixe.',
    },
    {
      name: 'Fazer uma asa',
      note: 'Um círculo, deformado até virar asa.',
    },
  ],
  guests: [
    {
      name: 'Bernhard Riemann',
      note: 'Sua tese de 1851, orientada por Gauss, estudou funções complexas por meio da geometria: superfícies e transformações que preservam ângulos.',
    },
  ],
  insight: {
    title: 'Deformar mantendo os ângulos.',
    html: `<p>Um número complexo x + iy é um ponto do plano: x na horizontal, y na vertical. Uma função complexa f leva cada ponto z a um novo ponto w = f(z), então ela move o plano inteiro de uma vez. A primeira imagem é o plano antes; a segunda mostra onde cada um de seus pontos vai parar.</p>
<div class="insight-visual">multiplicar por um número de tamanho r e ângulo θ estica por r e gira por θ</div>
<h3>Multiplicar gira e estica</h3>
<p>Multiplicar por i gira o plano um quarto de volta. Multiplicar por 2 dobra seu tamanho. Todo número complexo faz as duas coisas ao mesmo tempo: estica pelo seu tamanho e gira pelo seu ângulo. Esticar e girar mantêm todos os ângulos, mesmo quando os tamanhos mudam.</p>
<h3>De perto, uma deformação é uma multiplicação</h3>
<p>Dê um zoom perto de um ponto z e uma função complexa derivável parece multiplicar por um único número, sua derivada f′(z): f(z + h) ≈ f(z) + f′(z)·h para um h minúsculo. Então cada setinha em z é esticada por |f′(z)| e girada pelo ângulo de f′(z), igual em todas as direções, desde que f′(z) não seja zero. As duas setas da bússola giram juntas e continuam se encontrando em ângulo reto. Uma transformação que mantém os ângulos assim se chama <em>conforme</em>. As linhas da grade também se cruzam em ângulo reto depois da deformação, mesmo quando os quadrados ficam curvos.</p>
<h3>Onde f′ = 0, os ângulos quebram</h3>
<p>Se f′(z) = 0, o termo f′(z)·h some, e o próximo termo passa a mandar. Perto de 0, z² leva h a h², o que dobra cada ângulo: o ângulo reto entre 1 e i se abre numa linha reta. É por isso que a gêmea da bússola encolhe até sumir no centro de “O plano ao quadrado”, e que as linhas da grade que passam por 0 se dobram ali.</p>
<h3>Do avesso</h3>
<p>1/z troca perto e longe: pontos próximos de 0 voam para longe, e pontos distantes chegam perto. Círculos que passam por 0 viram retas, e retas que não passam por 0 viram círculos que passam por 0. É por isso que a grade quadriculada se transforma em duas famílias de círculos, todos passando por 0 e ainda se cruzando em ângulo reto. (Os dois eixos, que passam eles mesmos por 0, continuam retas.)</p>
<h3>De um círculo a uma asa</h3>
<p>A transformação de Joukowski, z + 1/z, achata o círculo unitário no segmento de −2 a 2. Desloque um pouco o círculo, mantendo-o passando por z = 1, e sua imagem vira uma asa: redonda na frente e afiada atrás. A borda afiada fica exatamente onde f′ = 0, em z = 1, onde os ângulos dobram e o círculo liso se dobra numa ponta. A transformação leva o escoamento do ar em volta do círculo ao escoamento em volta da asa. Esse escoamento é idealizado (estacionário, sem atrito, em duas dimensões), com o giro exato para que o ar deixe a borda afiada suavemente. Asas de verdade também dependem da viscosidade, da turbulência e da sua forma em três dimensões, que esta imagem deixa de fora.</p>
<h3>Sobre o controle “Quanto deformar”</h3>
<p>No meio do caminho, a imagem mostra (1 − t)·z + t·f(z), uma mistura direta entre ficar parado e a transformação completa. Ela está ali para ajudar o olho a seguir cada ponto. Cada mistura também é uma função complexa, mas tem seus próprios pontos problemáticos, e não é um caminho que o plano realmente percorre. Só a imagem totalmente deformada mostra f.</p>
<details><summary>A matemática, se você quiser</summary><p>f′(z) é o limite de (f(z + h) − f(z)) / h quando h tende a 0. Para uma função complexa, o limite precisa ser o mesmo vindo de qualquer direção, e é exatamente isso que obriga o esticar e o girar a serem iguais em todas as direções: uma função analítica com f′(z) ≠ 0 é conforme em z. Num ponto onde f′ se anula em primeira ordem, os ângulos são multiplicados por 2. O escoamento da asa usa o potencial complexo F = ζ + r²/ζ + ik·log ζ em volta de um círculo de raio r (ζ medido a partir do centro), com k escolhido para fazer de z = 1 um ponto de estagnação, a condição de Kutta.</p></details>
<div class="sources"><a class="source-link" href="https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/" target="_blank" rel="noopener">Notas do MIT 18.04, tópico 10: transformações conformes (em inglês)</a><a class="source-link" href="https://webapps.math.uci.edu/~vmm/ConformalMaps/" target="_blank" rel="noopener">Transformações conformes para explorar (UC Irvine, 3D-XplorMath, em inglês)</a><a class="source-link" href="https://www.grc.nasa.gov/www/k-12/airplane/map.html" target="_blank" rel="noopener">A transformação de Joukowski, do cilindro ao aerofólio (NASA Glenn, em inglês)</a><a class="source-link" href="https://books.google.com/books/about/Visual_Complex_Analysis.html?id=ogz5FjmiqlQC" target="_blank" rel="noopener">Tristan Needham, Visual Complex Analysis (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/" target="_blank" rel="noopener">Bernhard Riemann (MacTutor, em inglês)</a></div>`,
  },
});
