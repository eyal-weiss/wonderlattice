Wonderlattice.defineText('ribbon', 'pt', {
  eyebrow: 'TOPOLOGIA · 3D',
  name: 'Cadê o outro lado?',
  tagline: 'Dê meia torção numa fita e um dos lados desaparece.',
  title: 'Cadê o outro lado?',
  subtitle: 'Gire uma fita no espaço. Siga a borda. Deixe uma torção surpreender você.',
  field: 'Topologia · Superfícies · 3D',
  sceneLabel: 'Uma tira comum, uma viagem estranha',
  sceneName: 'A faixa de Möbius',
  tip: 'Arraste para girar · As setas ou os botões de giro também giram a vista',
  actionLabel: 'Seguir a borda',
  canvasLabel: 'Uma fita tridimensional. Arraste ou use as setas para girar.',
  panelEyebrow: 'Gire e siga',
  whyLabel: 'Para onde foi o outro lado?',
  nudge:
    'Observe a viajante dourada. Com uma meia torção, ela precisa dar duas voltas em torno do buraco para chegar de novo ao ponto de partida.',
  connection: {
    html: '<strong>Faça de verdade.</strong> Pegue uma tira de papel, dê meia torção numa ponta e cole as pontas com fita adesiva. Trace uma linha pelo meio dela sem tirar a caneta do papel.',
    label: 'Siga outro tipo de laço',
  },
  presets: [
    {
      name: 'Sem torção',
      note: 'Uma faixa conhecida, com duas bordas.',
    },
    {
      name: 'Meia torção',
      note: 'Um só lado contínuo. Uma borda.',
    },
    {
      name: 'Uma torção inteira',
      note: 'As duas bordas voltam.',
    },
  ],
  twists: 'Dê uma torção na fita',
  twistOptions: ['Sem torção · uma faixa', 'Meia torção · Möbius', 'Torção inteira · uma faixa'],
  width: 'Largura da fita',
  zoom: 'Olhar mais de perto',
  spin: 'Deixar girar',
  walk: 'Mostrar a viajante',
  edges: 'Destacar as bordas',
  turn: 'Girar a vista',
  turnLeft: 'Girar a vista para a esquerda',
  turnRight: 'Girar a vista para a direita',
  tiltUp: 'Inclinar a vista para cima',
  tiltDown: 'Inclinar a vista para baixo',
  nameOneSided: 'A faixa de Möbius',
  nameTwoSided: 'A faixa torcida',
  statusOneSided: 'Um lado · uma borda',
  statusTwoSided: 'Dois lados · duas bordas',
  showEdges: 'Seguir a borda',
  hideEdges: 'Esconder as bordas',
  guests: [
    {
      name: 'August Möbius',
      note: 'Uma meia torção transforma “o outro lado” numa pegadinha.',
    },
    {
      name: 'Johann Listing',
      note: 'Ele também estudou superfícies de um lado só. A história tem mais de um nome.',
    },
  ],
  insight: {
    title: 'Uma torção muda a viagem.',
    html: `<p>Junte as pontas de uma tira de papel formando um anel e você terá dois lados e duas bordas separadas. Dê meia torção numa das pontas antes de juntar, e algo muda: você chega ao que parecia ser o outro lado sem atravessar nenhuma borda.</p>
<div class="insight-visual">A faixa de Möbius tem um só lado contínuo e uma única borda, que forma um laço.</div>
<h3>Siga a viajante dourada</h3>
<p>A viajante começa longe da linha central. Numa faixa de Möbius, uma volta em torno do buraco a leva para a posição oposta na largura da fita. Uma segunda volta a traz de volta ao início. Ela nunca pula de um lado para o outro da fita.</p>
<h3>Conte as bordas</h3>
<p>“Seguir a borda” destaca o contorno. Com meia torção, as duas bordas aparentes fazem parte de um mesmo laço contínuo. Sem torção ou com uma torção inteira, são dois laços separados, em cores diferentes, um deles tracejado.</p>
<h3>Outro jeito de enxergar a forma</h3>
<p>A topologia estuda as propriedades que resistem a dobrar e esticar sem rasgar. Girar este objeto na tela muda o seu ponto de vista, mas o fato de ele ter um lado só continua o mesmo.</p>
<details><summary>Como a superfície é desenhada?</summary><p>Para o ângulo u e a coordenada de largura v:<br>x = (R + v cos(nu/2)) cos(u)<br>y = (R + v cos(nu/2)) sin(u)<br>z = v sin(nu/2)</p><p>n conta as meias torções. Com n ímpar, temos uma faixa de Möbius; com n par, uma faixa de dois lados. É uma superfície paramétrica projetada na tela, com as faces ordenadas por profundidade. O sombreado translúcido deixa ver a viajante através da superfície.</p></details>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/MoebiusStrip.html" target="_blank" rel="noopener">Explore a faixa de Möbius (em inglês)</a></div>`,
  },
});
