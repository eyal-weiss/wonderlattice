/*
 * Português (Brasil) (pt). Started from English by `npm run i18n:new`; translate the strings in place.
 * - Keep every key; delete any you don't translate, and English will show there instead.
 * - Strings written as functions, like (n) => `${n} rolls`, receive numbers or names: keep the
 *   ${…} parts, and move them wherever your language needs them.
 * - Keys ending in Html may contain markup such as <strong> or <em>; keep the tags balanced.
 * - Check your work with: npm run i18n:check
 */
Wonderlattice.defineLanguage('pt', { name: 'Português', dir: 'ltr', speech: 'pt-BR' });

Wonderlattice.defineText('app', 'pt', {
  themes: {
    shape: {
      name: 'Forma e espaço',
      blurb: 'Curvas, superfícies e os espaços onde elas vivem.',
    },
    chance: {
      name: 'Acaso e evidência',
      blurb: 'Pensar bem quando cada acontecimento, sozinho, é imprevisível.',
    },
    games: {
      name: 'Jogos e quebra-cabeças',
      blurb: 'A estrutura escondida por trás de jogos conhecidos.',
    },
    making: {
      name: 'Fazer com as mãos',
      blurb: 'Matemática que dá para tecer, dobrar e guardar.',
    },
    life: {
      name: 'Padrões vivos',
      blurb: 'Ordem que nasce de muitas pequenas interações.',
    },
    signals: {
      name: 'Sinais e redes',
      blurb: 'Ondas, mensagens e escolhas que viajam.',
    },
  },
  roomBar: {
    previous: (name) => `Experimento anterior: ${name}`,
    next: (name) => `Próximo experimento: ${name}`,
  },
  language: 'Idioma',
  pageTitle: (room) => `${room} · Wonderlattice`,
  stage: {
    makeItYours: 'Faça do seu jeito',
    keep: '✧ Guardar este momento',
    nudge: 'Uma dica',
    guestLabel: 'Uma visita da matemática',
    canvasRole: 'imagem interativa',
    pause: 'Pausar',
    play: 'Continuar',
    saved: 'Sua cena está pronta para salvar.',
    saveFailed: 'Não foi possível salvar esta imagem.',
    shareText: (title) => `Wonderlattice · ${title}`,
    linkCopied: 'Link da exploração copiado.',
    settingsCopied: 'Configurações da exploração copiadas.',
    linkDescription: 'Copie este link para reabrir estas configurações.',
    settingsDescription: 'Copie estas configurações para recriar esta exploração.',
  },
  narration: {
    listen: 'Ouvir esta ideia',
    stop: 'Parar a narração',
    unavailable: 'A narração não está disponível neste navegador. O texto completo está aqui para ler.',
    symbols: {
      '−': ' menos ',
      '×': ' vezes ',
      '→': ' para ',
      '↔': ' e ',
      '≈': ' cerca de ',
      '±': ' mais ou menos ',
      '²': ' ao quadrado ',
      '′': ' linha ',
      '√': ' raiz ',
      φ: ' fi ',
      θ: ' teta ',
      π: ' pi ',
      ᵀ: ' transposta ',
      '∞': ' infinito ',
      '≤': ' no máximo ',
      '≥': ' no mínimo ',
      '|': ' ',
      '·': ' vezes ',
      '↗': ' ',
      '✧': ' ',
      '✕': ' ',
    },
  },
  guests: {
    eyebrowPortrait: 'História da matemática · retrato histórico',
    eyebrowSketch: 'História da matemática · um esboço divertido',
    story: 'História ↗',
    storyLabel: (name) => `História: leia sobre ${name} (abre em uma nova aba)`,
    portrait: 'Retrato ↗',
    portraitLabel: (name) => `Retrato: a fonte do retrato de ${name} (abre em uma nova aba)`,
    photo: (credit) => `Foto: ${credit}`,
    another: 'Conhecer outra pessoa da matemática',
  },
  trail: {
    bridges: {
      'motion-waves': 'Um círculo que gira pode deixar uma onda em seu rastro.',
      'flock-traffic': 'Uma multidão pode surpreender a si mesma, uma escolha local de cada vez.',
      'ribbon-motion': 'Siga um ponto, e uma forma pode revelar outro lado.',
      'loom-flock': 'Uma regrinha, repetida em toda parte, pode dar forma ao todo.',
    },
    unreadable: 'Não foi possível ler a trilha salva neste navegador. Você pode importar uma exportação anterior.',
    storageFull:
      'Não foi possível salvar aqui. Verifique o espaço disponível no navegador ou exporte sua trilha atual.',
    stillAlt: 'Imagem desta exploração',
    full: (max) => `Sua trilha tem ${max} momentos. Exporte-a ou remova um antes de salvar outro.`,
    notSaved: 'Não foi possível salvar esta cena.',
    savedAlt: (room) => `Vista salva de ${room}`,
    onReturning: 'Ao voltar',
    revisit: 'Revisitar',
    remove: 'Remover',
    empty: 'Sua trilha está vazia. Salve algo que chame sua atenção e volte a ele quando quiser.',
    explore: (room) => `Explorar “${room}”`,
    returnTitle: (room) => `Um momento que você guardou · ${room}`,
    thenYouNoticed: (note) => `Na época, você notou: “${note}”`,
    noticeNow: 'O que você nota agora?',
    tooLarge: 'Escolha uma exportação de trilha do Wonderlattice com menos de 2,4 MB.',
    imported: 'Trilha importada. Sua trilha anterior foi substituída.',
    invalid: 'Esse arquivo não é uma exportação de trilha válida do Wonderlattice. Sua trilha não foi alterada.',
    thoughtSaved: 'Seu novo pensamento foi salvo. Volte a ele quando quiser.',
  },
});

Wonderlattice.defineText('motion', 'pt', {
  eyebrow: 'GEOMETRIA',
  name: 'Pintar com movimento',
  tagline: 'Dois braços que giram e uma caneta desenham flores, estrelas e tramas.',
  presets: [
    {
      name: 'Flor do campo',
      note: 'Seis pétalas, uma só linha',
      nudge: 'Troque −5 por −5,1. Uma mudança minúscula dá à flor um futuro bem diferente.',
    },
    {
      name: 'Órbita de seda',
      note: 'Um laço dentro de um laço',
      nudge: 'Ligue os braços em movimento. Veja como cada círculo simples se soma ao outro.',
    },
    {
      name: 'Estrelinha',
      note: 'Uma estrela de pontas suaves',
      nudge: 'Leve o alcance da caneta para perto de 50%. Veja as pontas suaves virarem laços profundos.',
    },
    {
      name: 'Luz tecida',
      note: 'Pelo caminho mais longo',
      nudge: 'Use “Traçar tudo” para revelar a trama inteira. Depois experimente −4, um parente mais simples.',
    },
    {
      name: 'Quase um círculo',
      note: 'Uma mudança minúscula, uma longa história',
      nudge: 'Duas velocidades quase iguais se afastam devagar. Trace tudo para ver o reencontro completo.',
    },
    {
      name: 'Fitas',
      note: 'Encontre o ritmo escondido',
      nudge: 'Experimente outro ângulo inicial. O ritmo continua o mesmo enquanto o desenho gira.',
    },
  ],
  paletteNames: ['Aurora', 'Brasa', 'Geleira', 'Luar'],
  names: {
    own: 'Sua própria órbita',
    surprise: 'Um feliz acaso',
    shared: 'Uma órbita compartilhada',
  },
  nudges: {
    whole: 'Tente afastar a rotação de um número inteiro. Veja o caminho demorar mais para voltar para casa.',
    traceAll: 'Experimente “Traçar tudo” para ver o padrão inteiro. Aqui, toda configuração acaba fechando o laço.',
    surprise: 'Algo novo, só para você. Mude uma coisa e veja aonde isso leva.',
    shared: 'Alguém deixou um padrão para você. Mude uma coisa para torná-lo seu.',
    revisit: 'Um padrão conhecido ainda pode surpreender. Mude uma coisa e olhe de novo.',
  },
  status: {
    complete: 'O laço está completo',
    oneTurn: 'Uma volta. Um mundo inteiro.',
    turns: (n) => `${n} voltas externas até o reencontro`,
  },
  explainStill: 'O braço interno mantém sua direção enquanto o externo gira. A caneta traça um círculo deslocado.',
  explain: (k, outer, inner, opposite) =>
    `Com ${k}×, os dois braços voltam à posição inicial depois de ${outer} ${outer === 1 ? 'volta externa' : 'voltas externas'} e ${inner} ${inner === 1 ? 'volta interna' : 'voltas internas'}. ${opposite ? 'Eles giram em sentidos opostos.' : 'Eles giram no mesmo sentido.'}`,
  play: {
    pause: 'Pausar',
    play: 'Continuar',
    replay: 'Repetir',
  },
  focus: {
    enter: 'Entrar no modo foco',
    leave: 'Sair do modo foco',
    title: 'Modo foco',
  },
  rotationRange: 'Escolha uma rotação entre −10 e 10.',
  saved: 'Seu desenho está pronto para salvar.',
  saveFailed: 'Não foi possível salvar a imagem. Tente de novo.',
  shareText: (k, r, p, ink) =>
    `Wonderlattice · Pintar com movimento\nRotação interna: ${k}×\nAlcance da caneta: ${r}%\nÂngulo inicial: ${p}°\nTinta: ${ink}`,
  linkCopied: 'Link do padrão copiado.',
  settingsCopied: 'Configurações do padrão copiadas.',
  linkDescription: 'Copie este link para reabrir o mesmo padrão.',
  settingsDescription: 'Copie estas configurações para recriar seu padrão.',
  guests: [
    {
      name: 'Emmy Noether',
      note: 'Uma simetria escondida pode revelar algo que nunca muda.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Círculos e exponenciais dançam juntos com bastante elegância.',
    },
  ],
});

Wonderlattice.defineText('waves', 'pt', {
  eyebrow: 'ONDAS · SOM',
  name: 'Ouça a forma',
  tagline: 'Dois tons se combinam em batimentos, silêncio e um retrato em laço.',
  title: 'Ouça a forma.',
  subtitle: 'Dois tons. Um pequeno espaço entre eles. Escute o que muda.',
  field: 'Ondas · Razões · Interferência',
  sceneLabel: 'Uma conversa em ondas',
  sceneName: 'Dois tons, juntos',
  tip: 'Modelo de ondas em câmera lenta · O som toca na altura real',
  actionLabel: 'Ligar o som',
  canvasLabel: 'Duas ondas senoidais e o sinal combinado. Escolha Retrato circular para uma segunda representação.',
  panelEyebrow: 'Escute e olhe',
  whyLabel: 'Por que isso acontece?',
  nudge:
    'Experimente “Quase afinados”. Ouça o volume crescer e sumir enquanto dois tons próximos entram e saem de compasso.',
  connection: {
    html: '<strong>Círculos viram ondas.</strong> A altura de um ponto que dá voltas num círculo segue uma onda senoidal. Combine movimentos circulares e você está de volta a Pintar com movimento.',
    label: 'Pinte com estas ideias',
  },
  presets: [
    {
      name: 'Uma quinta justa',
      note: 'Uma relação simples de 3:2.',
    },
    {
      name: 'Quase afinados',
      note: 'Dois tons próximos fazem um pulso.',
    },
    {
      name: 'O som do silêncio',
      note: 'Ondas iguais, defasadas em meia volta.',
    },
  ],
  soundOff: 'Ligar o som',
  soundOn: 'Som ligado · silenciar',
  noSound: 'O som não está disponível neste navegador. Você ainda pode explorar as ondas.',
  firstTone: 'Primeiro tom',
  secondTone: 'Segundo tom',
  secondToneHint: 'Em relação ao primeiro tom.',
  phase: 'Fase inicial',
  volume: 'Volume',
  hz: ' Hz',
  view: 'Outro jeito de ver',
  viewGroup: 'Visualização das ondas',
  viewWaves: 'Somando ondas',
  viewPortrait: 'Retrato circular',
  beatDetail: (f, g, d) => `Seus tons: ${f} Hz e ${g} Hz. A diferença entre as frequências é de ${d} Hz.`,
  status: (f, g) => `${f} Hz + ${g} Hz`,
  labels: {
    a: (f) => `A · ${f} Hz`,
    b: (f) => `B · ${f} Hz`,
    sum: 'A + B · COMBINADAS',
    firstTone: 'PRIMEIRO TOM →',
    secondTone: 'SEGUNDO TOM ↑',
  },
  guests: [
    {
      name: 'Jules Lissajous',
      note: 'Duas vibrações simples podem desenhar um laço surpreendentemente elaborado.',
    },
    {
      name: 'Joseph Fourier',
      note: 'Muitas ondas simples podem se esconder dentro de um único som complicado.',
    },
  ],
  insight: {
    title: 'Quando as ondas se encontram.',
    html: `<p>Um tom é uma onda suave que se repete. Dois tons se somam: a cada instante, seus deslocamentos se reforçam ou se opõem. A linha clara lá embaixo é a soma deles.</p>
<h3>Um ritmo dentro de dois tons</h3>
<p>Quando duas frequências são próximas, a soma fica mais forte e mais fraca, alternadamente. Essas pulsações se chamam <em>batimentos</em>. O ritmo delas é a diferença entre as frequências.</p>
<div class="insight-visual" id="beat-detail"></div>
<h3>Dois sons podem fazer silêncio</h3>
<p>Escolha “O som do silêncio”. Ondas iguais defasadas em meio ciclo se anulam nesta mixagem eletrônica. No mundo real, o cancelamento depende de onde você escuta e de como as ondas chegam até você.</p>
<h3>Olhe de lado</h3>
<p>Experimente “Retrato circular”. Usamos a primeira onda para a posição horizontal e a segunda para a vertical. A figura de Lissajous resultante transforma uma relação entre ritmos em uma forma.</p>
<details><summary>A matemática, se você quiser</summary><p>A(t) = sin(2πft)<br>B(t) = sin(2πfrt + φ)<br>O sinal combinado é A(t) + B(t).</p><p>O modelo em câmera lenta preserva a razão entre as frequências e a fase inicial. Os tons audíveis tocam nas alturas mostradas. Razões simples se repetem rápido; alturas próximas e diferentes produzem batimentos.</p></details>
<div class="sources"><a class="source-link" href="https://www.physicsclassroom.com/class/sound/Lesson-3/Interference-and-Beats" target="_blank" rel="noopener">Explore interferência e batimentos (em inglês)</a></div>`,
  },
});

Wonderlattice.defineText('flock', 'pt', {
  eyebrow: 'EMERGÊNCIA',
  name: 'Uma mente de muitos',
  tagline: 'Sem líder, só vizinhos: coloque um bando em movimento.',
  title: 'Uma mente de muitos.',
  subtitle: 'Sem líder. Só vizinhos. Coloque um pequeno mundo em movimento.',
  field: 'Sistemas dinâmicos · Emergência',
  sceneLabel: 'Um mundo de decisões locais',
  sceneName: 'O coletivo em movimento',
  tip: 'Toque ou arraste para guiar o bando · As setas movem seu toque, Esc o solta · As bordas se ligam',
  actionLabel: 'Espalhar o bando',
  canvasLabel: 'Um bando de marcas em movimento. Toque, arraste ou use as setas para guiar. Pressione Esc para soltar.',
  panelEyebrow: 'Regras locais',
  whyLabel: 'Quem está no comando?',
  nudge: 'Baixe “Seguir a direção” até zero. Uma multidão consegue ficar junta sem concordar para onde ir?',
  connection: {
    html: '<strong>Um padrão sem planejador.</strong> Aqui, um bando inteiro surge de pequenas interações. Em Ouça a forma, uma nova onda surge da soma de duas mais simples.',
    label: 'Veja ondas se combinarem',
  },
  presets: [
    {
      name: 'Em companhia',
      note: 'Encontrar uma direção comum.',
    },
    {
      name: 'Cada um por si',
      note: 'Deixe os caminhos individuais tomarem conta.',
    },
    {
      name: 'Fiquem perto',
      note: 'Juntos, sem muito acordo.',
    },
  ],
  align: 'Seguir a direção',
  cohesion: 'Ficar juntos',
  separate: 'Manter distância',
  influence: 'Seu toque',
  attract: 'Atrair',
  repel: 'Repelir',
  trails: 'Deixar rastros de luz',
  neighbors: 'Mostrar uma vizinhança',
  agreement: 'Acordo de direção',
  status: (n) => `${n} decisões individuais`,
  guests: [
    {
      name: 'John Conway',
      credit: 'Thane Plambeck (recortada)',
      note: 'O Jogo da Vida dele também cria surpresas a partir de regrinhas locais.',
    },
    {
      name: 'Alan Turing',
      note: 'O modelo de padrões dele mostrou como mudanças locais podem fazer manchas e listras.',
    },
  ],
  insight: {
    title: 'Quem está no comando?',
    html: `<p>Ninguém. Cada marca olha só para os vizinhos próximos e segue três tendências: evitar aglomeração, seguir a direção deles e ficar perto.</p>
<div class="insight-visual">Interações individuais → movimento coletivo</div>
<h3>O padrão mora entre os indivíduos</h3>
<p>Nenhuma marca conhece a forma inteira do bando. Um movimento coerente pode surgir porque cada uma responde a uma pequena parte do grupo. Seu cursor acrescenta uma atração ou repulsão vinda de fora.</p>
<h3>Um modelo, não um animal inteiro</h3>
<p>Esta é uma versão simplificada do modelo Boids, de Craig Reynolds. Ele captura algumas qualidades visuais de bandos e cardumes, mas não explica cada decisão de aves ou peixes de verdade.</p>
<h3>Olhe por um único par de olhos</h3>
<p>Ligue “Mostrar uma vizinhança”. O círculo marca a distância que um indivíduo consegue perceber; as linhas apontam para os vizinhos que o influenciam. Bordas opostas se ligam, então um vizinho pode estar perto do outro lado de uma borda.</p>
<details><summary>O que o “acordo” mede?</summary><p>Tiramos a média de todos os vetores unitários de direção e medimos o comprimento do resultado. Perto de 100% quer dizer que todos apontam mais ou menos para o mesmo lado. Perto de zero quer dizer que as direções quase se anulam. É uma descrição do bando neste momento, não uma pontuação.</p><p>Cada passo combina as forças de separação, alinhamento e coesão e depois limita a velocidade. Todos os indivíduos se atualizam a partir do mesmo estado anterior.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds sobre os Boids (em inglês)</a></div>`,
  },
});

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

Wonderlattice.defineText('traffic', 'pt', {
  eyebrow: 'TEORIA DOS JOGOS',
  name: 'O atalho tentador',
  tagline: 'Uma rua nova que deixa todo motorista mais lento.',
  title: 'O atalho tentador.',
  subtitle: 'Uma rua nova parece um presente. Abra e veja o que acontece.',
  field: 'Redes · Teoria dos jogos · Uma pequena surpresa',
  sceneLabel: 'Uma cidade · Muitas escolhas individuais',
  sceneName: 'A travessia da cidade',
  tip: 'Os marcadores em movimento mostram proporções do tráfego, não carros individuais',
  actionLabel: 'Abrir o atalho',
  canvasLabel: 'Uma rede de ruas de mão única. Abra ou feche o atalho do meio e mude o número de motoristas.',
  panelEyebrow: 'Mude uma rua',
  whyLabel: 'Como isso pode acontecer?',
  nudge:
    'Comece com 4.000 motoristas. Abra o atalho. Depois experimente um trânsito bem mais leve. A rua nova é sempre uma má ideia?',
  connection: {
    html: '<strong>Regras simples, resultado inesperado.</strong> Em Uma mente de muitos, um bando forma um padrão a partir de interações locais. Aqui, cada motorista escolhendo um caminho rápido pode deixar a viagem de todos mais lenta.',
    label: 'Siga outra multidão',
  },
  presets: [
    {
      name: 'Ruas tranquilas',
      note: 'O atalho pode ajudar.',
    },
    {
      name: 'Uma cidade cheia',
      note: 'Veja a surpresa.',
    },
    {
      name: 'Hora do rush',
      note: 'O atalho pode deixar de importar?',
    },
  ],
  demand: 'Motoristas atravessando a cidade',
  demandHint: 'Quão cheia está a cidade?',
  drivers: (n) => n.toLocaleString(Wonderlattice.lang),
  status: (open, minutes) => `${open ? 'Atalho aberto' : 'Atalho fechado'} · ${minutes} min agora`,
  open: 'Abrir o atalho',
  close: 'Fechar o atalho',
  before: 'Antes',
  after: 'Depois de abrir',
  minutes: ' min',
  verdict: {
    closed: 'Abra o atalho para ver o novo tempo de viagem.',
    same: 'A rua nova não muda o tempo de viagem.',
    slower: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} a mais para todo mundo.`,
    faster: (minutes) => `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} a menos para todo mundo.`,
  },
  labels: {
    nodes: {
      start: 'S',
      north: 'A',
      south: 'B',
      end: 'T',
    },
    congestion: 'congestionamento',
    fixed: '45 min',
    shortcutOpen: '0 min',
    shortcutClosed: 'fechado',
    caption: 'S → T · cada um escolhe seu caminho mais rápido',
  },
  guests: [
    {
      name: 'John von Neumann',
      note: 'O trânsito é um jogo de escolhas, e uma jogada esperta pode surpreender todo mundo.',
    },
    {
      name: 'John Nash',
      note: 'Aqui, nenhum motorista consegue melhorar sozinho, mesmo com todos mais lentos.',
    },
  ],
  insight: {
    title: 'Por que uma rua nova pode atrasar todo mundo?',
    html: `<p>Com 4.000 motoristas e sem atalho, o trânsito se divide igualmente entre o caminho de cima e o de baixo. Cada viagem leva 65 minutos. Abra a ligação de zero minuto entre A e B, e cada motorista vê um motivo para usá-la. Todos vão por S → A → B → T, e cada viagem passa a levar 80 minutos.</p>
<div class="insight-visual">Um atalho pode mudar as escolhas das pessoas, e as escolhas delas mudam o congestionamento.</div>
<h3>Experimente uma cidade mais tranquila</h3>
<p>Leve o controle de demanda para perto de 1.000. Agora o atalho ajuda. Com uma demanda muito alta, ninguém o usa. O paradoxo só acontece numa parte da faixa.</p>
<h3>O que este modelo supõe</h3>
<p>Cada motorista escolhe o caminho mais rápido para si. As decisões somadas se acomodam num equilíbrio em que nenhum motorista ganha tempo trocando de caminho sozinho. É uma rede simplificada, de mão única, com um atalho livre e tempos de viagem que dependem só do fluxo de trânsito. Os pontos em movimento mostram as proporções em cada caminho, não decisões individuais simuladas nem uma previsão para uma cidade de verdade.</p>
<details><summary>A matemática, se você quiser</summary><p>As ruas que congestionam custam x/100 minutos, em que x é o número de motoristas que as usam. As outras duas ruas custam 45 minutos cada; o atalho A → B custa zero. Sem ele, o tempo de viagem é 45 + D/200 para D motoristas. Com D = 4.000, isso dá 65 minutos. Com ele, o equilíbrio usa o caminho do meio e custa 2D/100 = 80 minutos.</p></details>
<div class="sources"><a class="source-link" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf" target="_blank" rel="noopener">Explore o paradoxo de Braess (Easley &amp; Kleinberg, em inglês)</a></div>`,
  },
});

Wonderlattice.defineText('loom', 'pt', {
  eyebrow: 'TECELAGEM',
  name: 'O tear matemático',
  tagline: 'Troque um quadradinho numa grade de sim e não, e o tecido inteiro muda.',
  title: 'O tear matemático.',
  subtitle: 'Escolha quais fios sobem. Veja o tecido crescer a partir de uma grade de sim e não.',
  field: 'Tecelagem · Padrões binários · Repetição',
  sceneLabel: 'Um tear de quatro quadros',
  sceneName: 'Tecido a partir de um esquema',
  tip: 'À esquerda: o esquema · À direita: o tecido · Clique na amarração para mudá-la, ou use os quadradinhos do painel',
  tipStacked: 'Em cima: o esquema · Embaixo: o tecido · Clique na amarração, ou use os quadradinhos do painel',
  actionLabel: 'Me surpreenda',
  canvasLabel:
    'Um esquema de tecelagem ao lado do tecido que ele produz. Mude a amarração clicando nela aqui, ou nos quadradinhos do painel.',
  panelEyebrow: 'Monte o tear',
  whyLabel: 'Como uma grade vira tecido?',
  nudge:
    'Comece com “Sarja” e troque um quadradinho da amarração. Todas as passadas tecidas com aquele pedal mudam de uma vez.',
  connection: {
    html: '<strong>Uma regrinha, repetida em toda parte.</strong> A amarração decide cada cruzamento do tecido. Em “Uma mente de muitos”, pequenas regras entre vizinhos dão forma a uma multidão inteira.',
    label: 'Visitar “Uma mente de muitos”',
  },
  presets: [
    {
      name: 'Tafetá',
      note: 'Por cima de um, por baixo de um.',
    },
    {
      name: 'Sarja',
      note: 'Uma diagonal, como no jeans.',
    },
    {
      name: 'Pied-de-poule',
      note: 'Sarja com quatro escuros, quatro claros.',
    },
    {
      name: 'Listras, não xadrez',
      note: 'Alterne as cores nos dois sentidos.',
    },
    {
      name: 'Olho de perdiz',
      note: 'Em ponta nos dois sentidos: losanguinhos.',
    },
    {
      name: 'Ziguezague',
      note: 'Faça a sarja voltar sobre si mesma.',
    },
  ],
  tieup: 'Quais fios cada pedal levanta (a amarração)',
  tieupHint:
    'Cada quadro é uma moldura que segura alguns dos fios do comprimento. Um quadradinho aceso quer dizer que aquele pedal levanta aquele quadro.',
  tieupCell: (pedal, shaft) => `O pedal ${pedal} levanta o quadro ${shaft}`,
  treadleLabel: (n) => `Pedal ${n}`,
  shaftLabel: (n) => `Quadro ${n}`,
  threading: 'Ordem dos fios',
  treadling: 'Ordem dos pedais',
  orders: ['Reta', 'Em ponta', 'Quebrada', 'Dobrada'],
  warpColours: 'Fios do comprimento',
  weftColours: 'Fios da largura',
  colourOrders: ['Todos escuros', '4 e 4', 'Alternados', '2 e 2', 'Todos claros'],
  palette: 'Fio',
  palettes: ['Índigo e creme', 'Garança e ouro', 'Floresta e linho', 'Noite e prata'],
  repeat: (across, down) =>
    across === 1 && down === 1 ? 'Uma cor só em tudo' : `Repete a cada ${across} × ${down} fios`,
  float: (n) =>
    n === Infinity
      ? 'Um fio nunca se entrelaça aqui. Este tecido se desmancharia.'
      : n === 1
        ? 'Cada fio passa por cima de um, por baixo de um: um tecido firme.'
        : n <= 3
          ? `Os fios flutuam sobre até ${n} outros: um tecido mais macio e maleável.`
          : `Flutuações de ${n} fios: longas e soltas, fáceis de puxar.`,
  labels: {
    draft: 'ESQUEMA',
    cloth: 'TECIDO',
  },
  guests: [
    {
      name: 'Ada Lovelace',
      note: 'Ela descreveu como a máquina de Babbage, guiada por cartões perfurados como um tear de Jacquard, poderia tecer padrões de álgebra.',
    },
  ],
  insight: {
    title: 'Uma grade que tece.',
    html: `<p>Cada tecido aqui vem de três listas curtas. O <em>remetido</em> diz por qual dos quatro quadros passa cada fio do comprimento (a urdidura). A <em>amarração</em> diz quais quadros cada pedal levanta. A <em>pisada</em> diz qual pedal é pressionado em cada passada da largura (a trama). Onde um fio de urdidura levantado cruza a trama, a urdidura aparece por cima.</p>
<div class="insight-visual">tecido = pisada × amarração × remetido, um produto de grades de 0s e 1s</div>
<h3>Pequena mudança, tecido inteiro</h3>
<p>Troque um quadradinho da amarração e todas as passadas tecidas com aquele pedal mudam de uma vez. Tecelões projetam no papel desse jeito: a grade à esquerda da imagem é um esquema de tecelagem de verdade.</p>
<h3>A cor é um segundo padrão</h3>
<p>Pinte também os fios, e o ponto e a ordem das cores se combinam. Uma sarja 2/2 com quatro fios escuros e quatro claros em cada sentido faz pied-de-poule. Um tafetá com cores alternadas faz listras, e não o xadrez que você talvez esperasse.</p>
<h3>As flutuações seguram o tecido</h3>
<p>Um fio que passa por cima de vários outros sem se entrelaçar forma uma flutuação. Flutuações curtas fazem um tecido firme; longas o deixam macio e fácil de puxar fio. Um fio que nunca se entrelaça não forma tecido nenhum.</p>
<details><summary>A matemática, se você quiser</summary><p>Escreva o remetido como uma grade H (o fio de urdidura j está no quadro s), a amarração como U (o pedal t levanta o quadro s) e a pisada como T (a passada i usa o pedal t). O tecido é D = T · U · Hᵀ, com aritmética booleana, em que 1 + 1 = 1. Como as três listas se repetem, o tecido também se repete: sua repetição divide o mínimo múltiplo comum dos comprimentos das listas e das ordens de cores.</p><p>Este tear tem quatro quadros e quatro pedais, como muitos teares de mesa e de chão. Um tecido de verdade também depende do fio, do espaçamento e da tensão, que esta imagem deixa de fora.</p></details>
<div class="sources"><a class="source-link" href="https://www.tandfonline.com/doi/abs/10.1080/0025570X.1980.11976845" target="_blank" rel="noopener">Satins and twills: a geometria dos tecidos (Grünbaum &amp; Shephard, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Houndstooth" target="_blank" rel="noopener">Como o pied-de-poule é tecido (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Lovelace/" target="_blank" rel="noopener">Ada Lovelace e o tear de Jacquard (em inglês)</a></div>`,
  },
});

Wonderlattice.defineText('storm', 'pt', {
  eyebrow: 'CORREÇÃO DE ERROS',
  name: 'Uma imagem no meio da tempestade',
  tagline: 'Alguns bits extras bem pensados deixam uma imagem se consertar sozinha.',
  title: 'Uma imagem no meio da tempestade.',
  subtitle: 'Desenhe uma imagenzinha. Mande-a pela tempestade. Ajude-a a chegar inteira.',
  field: 'Códigos · Informação · Um pouco de redundância',
  sceneLabel: 'Canal com ruído',
  actionLabel: 'Enviar de novo',
  canvasLabel:
    'Sua imagem, à esquerda, viaja como bits por uma tempestade que inverte alguns deles e chega à direita. Clique ou arraste sobre sua imagem para desenhar. Com o teclado, mova-se com as setas e pressione Enter para pintar.',
  panelEyebrow: 'Proteja-a',
  whyLabel: 'Como bits podem se consertar?',
  nudge:
    'Conte o estrago sem proteção. Depois experimente o truque de Hamming na mesma tempestade. Até que ponto a tempestade pode piorar?',
  connection: {
    html: '<strong>Sinais que viajam.</strong> Aqui uma mensagem sobrevive a uma viagem cheia de ruído. Em “Ouça a forma”, dois tons viajam juntos e desenham uma forma que dá para ouvir.',
    label: 'Visitar “Ouça a forma”',
  },
  yours: 'Sua imagem',
  storm: 'A tempestade',
  arrived: 'O que chegou',
  codes: ['Sem proteção', 'Repetir três vezes', 'Um bit de paridade', 'O truque de Hamming'],
  codeLabel: 'Como proteger',
  codeHints: [
    'Cada bit viaja sozinho.',
    'Três cópias de cada bit, depois uma votação.',
    'Um bit de verificação a cada quatro detecta uma inversão.',
    'Três bits de verificação a cada quatro corrigem uma inversão.',
  ],
  stormLabel: 'Força da tempestade',
  stormHint: 'A chance de cada bit se inverter.',
  pictureLabel: 'Escolha uma imagem ou desenhe na sua',
  pictures: {
    heart: 'Coração',
    smile: 'Sorriso',
    invader: 'Alienígena',
    blank: 'Limpar',
  },
  tip: 'Laranja: invertido · ○ consertado · ✕ ainda errado',
  tipParity: 'Laranja: invertido · tracejado: erro detectado · ✕ errado',
  sent: 'Bits enviados',
  sentValue: (bits, extra) => `${bits} (+${extra}% extras)`,
  badge: (extra) => `+${extra}%`,
  badgeNote: 'de bits extras',
  flipped: 'Invertidos pela tempestade',
  repaired: 'Consertados na chegada',
  knownBad: 'Blocos com erro detectado',
  wrong: 'Pixels ainda errados',
  status: (wrong, flips) =>
    !flips
      ? 'Céu calmo'
      : !wrong
        ? 'Todos os pixels chegaram'
        : wrong === 1
          ? '1 pixel errado'
          : `${wrong} pixels errados`,
  curveTitle: 'Pixels errados em média, conforme a tempestade cresce',
  about: (wrong) => `≈ ${wrong}`,
  curveLabel: (code, wrong) => `${code}: cerca de ${wrong} pixels errados em média nesta força de tempestade.`,
  calm: 'calma',
  wild: '20%',
  presets: [
    {
      name: 'Sem proteção',
      note: 'Cada inversão machuca.',
    },
    {
      name: 'Repetir três vezes',
      note: 'Seguro, mas com o triplo de bits.',
    },
    {
      name: 'O truque de Hamming',
      note: 'Quase tão seguro, com bem menos bits.',
    },
  ],
  guests: [
    {
      name: 'Richard Hamming',
      note: 'Fim de semana após fim de semana, erros travavam o computador dele. Se ele consegue achar um erro, perguntou, por que não corrigi-lo?',
    },
  ],
  insight: {
    title: 'Como uma mensagem pode se consertar sozinha?',
    html: `<p>Sua imagem tem 64 pixels, ou seja, 64 bits de tinta ou sem tinta. A tempestade inverte cada bit com uma pequena chance. Sem proteção, cada bit invertido é um pixel errado, e quem recebe nem consegue saber quais são.</p>
<div class="insight-visual">Alguns bits extras bem escolhidos permitem que quem recebe encontre e corrija erros que nunca viu acontecer.</div>
<h3>Repetir três vezes</h3>
<p>Mande cada bit três vezes e deixe quem recebe fazer uma votação. Uma inversão num trio perde a votação por dois a um. Funciona, mas triplica a mensagem: 8 bits extras a cada 4.</p>
<h3>Um bit de paridade</h3>
<p>Acrescente um bit a cada bloco de quatro de modo que a quantidade de 1s seja sempre par. Se um único bit se inverte, a contagem fica ímpar e quem recebe sabe que o bloco está danificado. Mas não sabe qual bit corrigir, e duas inversões se anulam e passam despercebidas.</p>
<h3>O truque de Hamming</h3>
<p>Numere os sete bits de um bloco de 1 a 7. Os bits nas posições 1, 2 e 4 são de verificação. Cada verificação mantém par a quantidade de 1s nas posições cujo número, escrito como soma de 1, 2 e 4, inclui o número dela: a verificação 1 vigia 1, 3, 5, 7; a 2 vigia 2, 3, 6, 7; a 4 vigia 4, 5, 6, 7. Quando um bit se inverte, as verificações que falham somam exatamente a posição dele. Se falham a 1 e a 4, é a posição 5; se nenhuma falha, o bloco parece limpo. Assim, desde que no máximo um bit por bloco se inverta, 3 bits extras a cada 4 consertam o estrago.</p>
<h3>Custo e proteção</h3>
<p>Numa tempestade de 4%, uma imagem sem proteção tem em média cerca de 2,6 pixels errados; com três cópias, cerca de 0,3; e com o truque de Hamming, cerca de 0,8, usando menos da metade dos bits extras. A curvinha no painel mostra isso para cada força de tempestade.</p>
<h3>Onde isso falha</h3>
<p>Esses códigos supõem que cada bit se inverte de forma independente. Três cópias e o truque de Hamming prometem corrigir uma inversão por bloco; um bit de paridade só avisa, e sem proteção não há nem uma coisa nem outra. Duas inversões num mesmo bloco de Hamming mandam quem recebe para a posição errada, e o “conserto” piora as coisas. Perto de uma tempestade de 20%, o truque de Hamming quase não ajuda; um pouco além disso, atrapalha. Tempestades de verdade vêm em rajadas, por isso os sistemas reais usam códigos mais longos e espalham os bits de cada bloco.</p>
<details><summary>A matemática, se você quiser</summary><p>Para os bits de dados d1 d2 d3 d4 nas posições 3, 5, 6, 7, as verificações são c1 = d1 ⊕ d2 ⊕ d4, c2 = d1 ⊕ d3 ⊕ d4, c4 = d2 ⊕ d3 ⊕ d4, em que ⊕ soma bits sem “vai um”. Quem recebe faz o XOR das posições que contêm 1; o resultado, chamado síndrome, é 0 para um bloco limpo e é a posição invertida quando exatamente um bit se inverteu. Três inversões podem se anular em 0 e passar despercebidas.</p><p>Se cada bit se inverte com probabilidade p, um pixel enviado sozinho fica errado com probabilidade p, e um pixel enviado três vezes, com probabilidade 3p² − 2p³. As curvas somam exatamente todos os padrões possíveis de inversões.</p></details>
<div class="sources"><a class="source-link" href="https://archive.org/details/bstj29-2-147" target="_blank" rel="noopener">O artigo de Hamming de 1950 (em inglês)</a><a class="source-link" href="https://www.inference.org.uk/mackay/itila/" target="_blank" rel="noopener">MacKay, capítulo 1: mandando imagens através do ruído (em inglês)</a></div>`,
  },
});

Wonderlattice.defineText('sudoku', 'pt', {
  eyebrow: 'LÓGICA · GRAFOS',
  name: 'Sudoku às claras',
  tagline: 'Um quebra-cabeça de números em que os números nunca importaram.',
  title: 'Sudoku às claras.',
  subtitle: 'Coloque uma cor e veja as possibilidades ao redor sumirem, discretamente.',
  field: 'Lógica · Coloração de grafos · Quadrados latinos',
  sceneLabel: 'Dezesseis casas',
  tip: 'Tab leva ao tabuleiro · setas movem · teclas 1–4 colocam · Backspace apaga · Ctrl+Z desfaz',
  actionLabel: 'Dar um passo lógico',
  canvasLabel:
    'Um tabuleiro de Sudoku de quatro por quatro. Cada casa vazia mostra os símbolos que ainda podem ir ali. O tabuleiro de casas sobre esta imagem pode ser jogado com o teclado.',
  boardLabel: 'Tabuleiro de Sudoku, quatro por quatro',
  panelEyebrow: 'Coloque, desfaça, olhe de novo',
  whyLabel: 'Por que isso é sobre colorir?',
  nudge:
    'Coloque uma cor e veja as marquinhas dela sumirem na linha, na coluna e na região. Depois dê um passo lógico. Você concorda com o motivo?',
  connection: {
    html: '<strong>Outra rede de vizinhos.</strong> Aqui, cada casa limita as casas ligadas a ela. Na travessia da cidade, a escolha de cada motorista muda a viagem de todos.',
    label: 'Visitar o atalho tentador',
  },
  presets: [
    {
      name: 'Um começo suave',
      note: 'Oito pistas. Um passo leva ao outro.',
    },
    {
      name: 'Um só caminho',
      note: 'Só quatro pistas, e mesmo assim uma única resposta.',
    },
    {
      name: 'Duas respostas',
      note: 'Seis pistas, e espaço para dois finais.',
    },
  ],
  styles: ['Cores', 'Formas', 'Algarismos'],
  styleHint: 'O mesmo quebra-cabeça, com outros rótulos. Só as regras importam.',
  styleLabel: 'Símbolos',
  symbolWord: ['cor', 'forma', 'algarismo'],
  symbolNames: [
    ['o azul', 'o laranja', 'o rosa', 'o verde'],
    ['o círculo', 'o quadrado', 'o triângulo', 'o losango'],
    ['o 1', 'o 2', 'o 3', 'o 4'],
  ],
  unitNames: {
    row: 'linha',
    col: 'coluna',
    box: 'região',
  },
  placeLabel: 'Colocar na casa escolhida',
  placeButton: (name) => `Colocar ${name}`,
  faded: (word) =>
    word === 'algarismo'
      ? 'Algarismos apagados não cabem aqui.'
      : word === 'cor'
        ? 'Cores apagadas não cabem aqui.'
        : 'Formas apagadas não cabem aqui.',
  clash: 'conflito aqui',
  undo: 'Desfazer',
  clear: 'Limpar casa',
  network: 'Mostrar a rede',
  filled: 'Preenchidas',
  candidatesLeft: 'Candidatos',
  waysToFinish: 'Respostas',
  none: 'nenhuma',
  twoFinishes: 'O resolvedor encontrou os dois finais. Eles só diferem nas casas contornadas.',
  answerLabel: (n) => `Final ${n}`,
  status: (filled) => `${filled} de 16 preenchidas`,
  networkCaption: '16 casas · 56 ligações · casas ligadas nunca são iguais',
  start: (word) => `Toque numa casa vazia e escolha ${word === 'algarismo' ? 'um' : 'uma'} ${word}.`,
  placed: (name, n) =>
    n === 0
      ? `${name.charAt(0).toUpperCase() + name.slice(1)} foi colocado. Nada por perto precisou mudar.`
      : `${name.charAt(0).toUpperCase() + name.slice(1)} foi colocado. Ele não pode mais ir em ${n} ${n === 1 ? 'casa próxima' : 'casas próximas'}.`,
  clashed: (name) => `Agora dois vizinhos têm ${name}. Desfaça ou tente outro.`,
  given: 'Esta já veio com o quebra-cabeça. Tente uma casa vazia.',
  cleared: 'Limpa. As possibilidades dela voltam.',
  undone: 'Um passo para trás.',
  naked: (name) => `Só ${name} cabe aqui: a linha, a coluna e a região já têm os outros três.`,
  hidden: (name, unit) => `Nesta ${unit}, ${name} só tem mais um lugar possível.`,
  stuckTwo: 'Nada é obrigatório agora. As casas contornadas podem trocar entre si, e os dois finais funcionam.',
  stuckOne: 'Nenhum passo é obrigatório aqui. Arrisque um palpite e desfaça se der errado.',
  stuckNone: 'Este tabuleiro não pode mais ser terminado. Desfaça um ou dois passos.',
  clashFirst: 'Dois vizinhos têm o mesmo símbolo. Primeiro desfaça ou limpe uma das casas brilhando.',
  solved: (word) => `Completo. Cada linha, coluna e região tem cada ${word} uma única vez.`,
  fresh: 'Um tabuleiro novinho.',
  describe: (row, col, content) => `Linha ${row}, coluna ${col}, ${content}`,
  holds: (name, given) => (given ? `${name}, uma pista` : name),
  emptyWith: (names) => `vazia, pode ser ${names.join(' ou ')}`,
  emptyNone: 'vazia, nada cabe',
  guest: {
    name: 'Leonhard Euler',
    note: 'Um Sudoku terminado é um quadrado latino com uma regra a mais para as regiões. Meus 36 oficiais precisavam de dois quadrados latinos sobrepostos de modo que cada par aparecesse uma única vez, o que se mostrou impossível.',
  },
  insight: {
    title: 'Por que o Sudoku é sobre colorir?',
    html: `<p>Nada no Sudoku precisa de números. A única regra é que duas casas na mesma linha, coluna ou região precisam ser diferentes. Cores, formas ou algarismos funcionam do mesmo jeito, e é por isso que trocar os símbolos nunca muda o quebra-cabeça.</p>
<div class="insight-visual">Um Sudoku é um mapa para colorir. Neste tabuleiro, cada casa tem sete vizinhas, e precisa ser diferente de todas elas.</div>
<h3>Restrições</h3>
<p>Cada casa pertence a uma linha, uma coluna e uma região. Esses grupos se sobrepõem, então uma única jogada vai longe: ela tira uma possibilidade de até sete outras casas de uma vez. As marquinhas que se apagam mostram exatamente quais.</p>
<h3>Candidatos e únicos</h3>
<p>As marquinhas numa casa vazia são seus candidatos: os símbolos que nenhuma vizinha tem ainda. Quando só resta uma marca, aquela casa está decidida (um “único nu”). Quando um símbolo só tem uma casa possível em alguma linha, coluna ou região, ele tem que ir ali (um “único escondido”). “Dar um passo lógico” usa só essas duas ideias, e sempre mostra o porquê.</p>
<h3>Um grafo para colorir</h3>
<p>Ligue a rede. Cada casa vira um ponto, e uma ligação une dois pontos sempre que suas casas estão na mesma linha, coluna ou região: 16 pontos e 56 ligações. Preencher o tabuleiro é o mesmo que dar a cada ponto uma de quatro cores de modo que nenhuma ligação una dois pontos da mesma cor, parecido com colorir um mapa para que países vizinhos fiquem diferentes. Os matemáticos chamam isso de coloração própria de um grafo.</p>
<h3>Por que um bom quebra-cabeça tem exatamente uma resposta</h3>
<p>As pistas são uma coloração já começada. Um quebra-cabeça bem feito tem pistas na medida certa para que reste só um jeito de terminar, e assim cada passo pode ser deduzido em vez de chutado. Num tabuleiro 4×4, quatro pistas são o mínimo capaz disso. Com menos, sempre fica alguma escolha em aberto. “Duas respostas” tem seis pistas, mas quatro casas formam um retângulo cujas duas cores podem trocar de lugar, e o resolvedor encontra os dois finais.</p>
<h3>O quebra-cabeça em tamanho real</h3>
<p>O Sudoku de jornal é a mesma ideia em escala maior: 81 casas, cada uma com 20 vizinhas, 810 ligações e nove cores. Existem 288 grades 4×4 completas, mas cerca de 6,7 × 10<sup>21</sup> grades 9×9 completas. O menor número de pistas capaz de dar a um Sudoku 9×9 uma única resposta é 17, um fato decidido por uma grande busca em computador.</p>
<h3>Quadrados latinos</h3>
<p>Uma grade em que cada símbolo aparece uma vez em cada linha e em cada coluna se chama quadrado latino. Leonhard Euler os estudou, incluindo o seu problema dos 36 oficiais: seis patentes e seis regimentos, dispostos de modo que cada linha e cada coluna tenha cada patente e cada regimento uma vez. Todo Sudoku terminado é um quadrado latino com uma regra a mais para as regiões.</p>
<details><summary>O que esta sala faz, e o que ela deixa de fora</summary><p>Os candidatos aqui usam só a eliminação direta: um símbolo é descartado quando uma vizinha já o tem. O passo lógico conhece dois tipos de dedução, os únicos nus e os únicos escondidos; quebra-cabeças mais difíceis precisam de mais. A contagem de jeitos de terminar vem de uma pequena busca com retrocesso (backtracking). Ela testa cada possibilidade na casa vazia mais restrita e para assim que encontra dois finais. Herzberg e Murty contam os jeitos de estender uma coloração parcial com um polinômio cromático: um quebra-cabeça tem solução única exatamente quando essa contagem é 1. Esta sala só precisa distinguir nenhum, um e dois.</p></details>
<div class="sources"><a class="source-link" href="https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf" target="_blank" rel="noopener">Sudoku Squares and Chromatic Polynomials (Herzberg &amp; Murty, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku" target="_blank" rel="noopener">A matemática do Sudoku (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Thirty-six_officers_problem" target="_blank" rel="noopener">Os 36 oficiais de Euler (em inglês)</a></div>`,
  },
});

Wonderlattice.defineText('dice', 'pt', {
  eyebrow: 'CONTAGEM',
  name: 'Os dados que vencem uns aos outros',
  tagline: 'Escolha qualquer dado. Sempre existe um que o vence.',
  title: 'Os dados que vencem uns aos outros.',
  subtitle: 'Escolha qualquer dado. Eu escolho depois de você.',
  field: 'Probabilidade · Contagem · Uma pequena surpresa',
  sceneLabel: 'Dados estranhos · Um círculo',
  tip: 'Toque num dado do círculo, ou pressione ← e →, para escolher o seu · Cada seta aponta do vencedor para o perdedor',
  actionLabel: 'Lançar 100 vezes',
  canvasLabel:
    'Dois dados lançados um contra o outro, uma contagem de vitórias, a porcentagem acumulada de vitórias e um círculo de setas mostrando qual dado costuma vencer qual. Toque num dado do círculo, ou use as setas para a esquerda e para a direita, para escolher o seu dado.',
  panelEyebrow: 'Escolha e lance',
  whyLabel: 'Como todo dado pode perder?',
  nudge:
    'Experimente cada dado, um de cada vez. Toda vez, eu acho um que vence o seu. Existe algum dado que eu não consiga vencer?',
  connection: {
    html: '<strong>Intuição, virada do avesso com delicadeza.</strong> Aqui, “melhor” anda em círculo. Na cidade, uma rua novinha pode deixar todas as viagens mais lentas.',
    label: 'Experimente o atalho tentador',
  },
  sets: ['Três dados · 5/9', 'Os quatro dados de Efron · 2/3', 'Os dados de Grime · uma reviravolta'],
  sceneNames: ['Escolha primeiro', 'Os quatro de Efron', 'Os dados de Grime'],
  twoEach: (name) => `${name} · dois de cada`,
  marks: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['V', 'A', 'O'],
  ],
  names: [
    ['A', 'B', 'C'],
    ['A', 'B', 'C', 'D'],
    ['Vermelho', 'Azul', 'Oliva'],
  ],
  setLabel: 'Conjunto de dados',
  youLabel: 'Seu dado',
  rivalLabel: 'Meu dado',
  letMe: 'Deixe comigo',
  pairs: 'Lançar dois de cada e somar',
  speed: 'Lançamentos por segundo',
  speedHint: 'Devagar para acompanhar, ou rápido para estabilizar.',
  faces: (list) => list.join(' '),
  pickDie: (name, list) => `Dado ${name}: ${list.join(', ')}`,
  you: 'Você',
  me: 'Eu',
  vs: 'vs.',
  iTake: (you, me) => `Você escolheu ${you}. Eu fico com ${me}.`,
  against: (you, me) => `${you} contra ${me}. Você escolheu os dois.`,
  ready: 'Pronto para lançar',
  rolls: (n) => (n === 1 ? '1 lançamento' : `${n.toLocaleString(Wonderlattice.lang)} lançamentos`),
  circleTitle: 'O círculo das vitórias',
  even: 'meio a meio',
  winsTitle: 'Vitórias',
  latestTitle: 'Últimos lançamentos, do mais recente',
  ties: (n) => (n === 1 ? '1 empate' : `${n} empates`),
  shareTitle: (name) => `Com que frequência ${name} vence`,
  exactLabel: (fraction) => `exato: ${fraction}`,
  startHint: 'Pressione “Lançar 100 vezes”',
  rollsSoFar: 'Lançamentos até agora',
  winsLine: (you, me, a, b) => `Você (${you}) ${a} · Eu (${me}) ${b}`,
  seenLine: (name, seen, fraction, exact) =>
    `${name} vence: ${seen === null ? '–' : seen + '%'} até agora · exatamente ${fraction} ≈ ${exact}%`,
  verdictStart: (favourite, fraction) =>
    `Pela conta exata, ${favourite} vence ${fraction} das vezes. Lance para ver acontecer.`,
  verdict: (n, favourite, seen, fraction) =>
    `Depois de ${n.toLocaleString(Wonderlattice.lang)} lançamentos, ${favourite} venceu ${seen}% das vezes. A chance exata é ${fraction}.`,
  evenVerdict: 'Estes dois têm a mesma chance de vencer.',
  sameDie: 'O mesmo dado dos dois lados: chances iguais.',
  presets: [
    {
      name: 'Escolha primeiro',
      note: 'Eu escolho depois de você.',
      badge: '5/9',
    },
    {
      name: 'Os quatro de Efron',
      note: 'Quatro dados, um círculo.',
      badge: '2/3',
    },
    {
      name: 'Dois de cada',
      note: 'Dobre os dados, inverta o círculo.',
      badge: '↺',
    },
  ],
  guests: [
    {
      name: 'Blaise Pascal',
      note: 'Um enigma de dados de um apostador chegou até ele. As cartas que trocou com Fermat em 1654 deram início à matemática do acaso.',
    },
  ],
  gridAxes: (me, you) =>
    `As linhas são o meu dado, ${me}; as colunas são o seu, ${you}. Cada quadradinho tem a cor de quem vence.`,
  gridNote: (win, lose, tie, total, me, you) =>
    `${me} vence em ${win} das ${total.toLocaleString(Wonderlattice.lang)} combinações igualmente prováveis, ${you} vence em ${lose}` +
    (tie ? `, e ${tie} são empates.` : '.'),
  insight: {
    title: 'Como todo dado pode perder?',
    html: `<p>Conte em vez de chutar. Cada dado tem seis faces, então dois dados podem cair de 6 × 6 = 36 jeitos igualmente prováveis. Pegue A (2, 2, 4, 4, 9, 9) contra B (1, 1, 6, 6, 8, 8). Os dois 9 de A vencem as seis faces de B: 12 jeitos. Os 2 e os 4 de A só vencem os dois 1 de B: mais 4 × 2 = 8. Isso dá 20 de 36 para A, ou 5/9. A mesma conta dá B sobre C, e C sobre A.</p>
<canvas id="dice-grid" class="dice-grid" aria-hidden="true"></canvas>
<p id="dice-grid-note"></p>
<div class="insight-visual">A vence B, B vence C, e C vence A. “Costuma vencer” não forma uma fila, então quem escolhe depois sempre encontra um dado que ganha.</div>
<h3>Ser melhor na média não é o mesmo que ganhar mais vezes</h3>
<p>Os três dados do primeiro conjunto têm média exatamente 5. No conjunto de Efron, C (6, 6, 2, 2, 2, 2) tem a maior média, 3⅓, mas perde duas vezes em cada três para B, que sempre mostra 3. A média se importa com o tamanho de cada vitória; “ganhar mais vezes” só conta com que frequência.</p>
<h3>Dois de cada invertem o círculo</h3>
<p>Com os dados vermelho, azul e oliva de James Grime, um de cada dá vermelho sobre azul, azul sobre oliva e oliva sobre vermelho. Lance dois de cada e some, e todas as setas se invertem: azul vence vermelho, oliva vence azul e vermelho vence oliva. Somar dois dados muda quais totais são prováveis, e isso muda quem costuma ganhar.</p>
<h3>O que isto supõe</h3>
<p>Dados honestos: todas as faces igualmente prováveis, e cada lançamento independente dos outros. Aqui, os lançamentos vêm de um gerador de números pseudoaleatórios. Algumas dezenas de lançamentos podem se afastar bastante da chance exata. A oscilação típica diminui devagar, como um sobre a raiz quadrada do número de lançamentos: cerca de 5% depois de 100 lançamentos, cerca de 0,5% depois de 10.000.</p>
<details><summary>Existe um dado que ninguém vence?</summary><p>Não nestes conjuntos. Para cada dado existe outro que o vence na maioria das vezes. É isso que “não transitivo” quer dizer: “vencer” não passa adiante numa corrente como “ser mais alto que”. No conjunto de Efron, a melhor resposta da sala vence duas vezes em cada três, seja qual for a sua escolha.</p></details>
<div class="sources"><a class="source-link" href="https://nrich.maths.org/problems/non-transitive-dice?tab=teacher" target="_blank" rel="noopener">NRICH: dados não transitivos (em inglês)</a><a class="source-link" href="https://www.scientificamerican.com/article/mathematical-games-1970-12/" target="_blank" rel="noopener">Martin Gardner sobre os dados de Efron (1970, em inglês)</a><a class="source-link" href="http://singingbanana.com/dice/article.htm" target="_blank" rel="noopener">Os dados de James Grime (numeração anterior, com as mesmas chances; em inglês)</a></div>`,
  },
});

Wonderlattice.defineText('cube', 'pt', {
  eyebrow: 'MOVIMENTOS · GRUPOS',
  name: 'Por dentro do cubo mágico',
  tagline:
    'Dois giros em outra ordem, um movimento que precisa de 105 repetições para voltar para casa e peças que mal saem do lugar.',
  title: 'Por dentro do cubo mágico.',
  subtitle: 'Esqueça a solução. Brinque com os próprios movimentos e veja como eles se combinam.',
  field: 'Grupos · Ordem · Desfazer',
  sceneLabel: 'Um cubo de movimentos',
  tip: 'Arraste, ou use as setas, para girar a vista',
  actionLabel: 'Repetir',
  actionCompare: 'Girar',
  canvasLabel:
    'Um cubo mágico. Use os botões de movimento para girar as faces; arraste ou use as setas para girar a vista.',
  panelEyebrow: 'Combine movimentos',
  whyLabel: 'Por que a ordem importa?',
  nudge:
    'Experimente “De volta ao começo” e depois “Repetir até voltar”. Quantas repetições você chuta até ele chegar lá?',
  connection: {
    html: '<strong>Regras que dá para combinar e desfazer.</strong> Um movimento do cubo é uma regra que diz para onde vai cada adesivo. Na sala do Sudoku, regras sobre vizinhos decidem onde cada cor pode ir.',
    label: 'Visitar o Sudoku',
  },
  sceneName: {
    one: 'Um cubo',
    compare: 'Duas ordens',
  },
  modes: ['Um cubo', 'Comparar duas ordens'],
  mode: 'O que explorar',
  faces: {
    U: 'de cima',
    R: 'da direita',
    F: 'da frente',
    D: 'de baixo',
    L: 'da esquerda',
    B: 'de trás',
  },
  turn: (face, prime) => `girar a face ${face} no sentido ${prime ? 'anti-horário' : 'horário'}`,
  moveLabel: (name, turn) => `${name}: ${turn}`,
  movePad: 'Monte uma sequência',
  notation:
    'U = cima (up), R = direita (right), F = frente (front), D = baixo (down), L = esquerda (left), B = trás (back); ′ gira ao contrário.',
  undo: 'Desfazer',
  clear: 'Limpar',
  home: 'Repetir até voltar',
  highlight: 'Mostrar só o que mudou',
  first: 'Primeiro movimento',
  second: 'Segundo movimento',
  sequence: (text) => (text ? text : 'Nenhum movimento ainda: toque numa face'),
  times: (n) => (n === 1 ? 'feito uma vez' : n === 0 ? 'ainda não feito' : `feito ${n} vezes`),
  order: (n) => (n === 1 ? 'Nada a desfazer: ele fica em casa.' : `Volta para casa depois de ${n} repetições.`),
  moved: (n) =>
    n === 0 ? 'Todas as peças estão em casa.' : n === 1 ? '1 peça fora do lugar.' : `${n} peças fora do lugar.`,
  status: (n) => (n === 0 ? 'Resolvido' : `${n} peças mexidas`),
  landed: (moved, done, order) =>
    (moved === 0 ? 'Resolvido. ' : `Feito ${done === 1 ? 'uma vez' : `${done} vezes`}. ${moved} peças mexidas. `) +
    (order === 1 ? 'Ele fica em casa.' : `Volta para casa depois de ${order} repetições.`),
  full: 'Já são doze movimentos: repita, desfaça ou limpe.',
  restarted: 'Uma nova sequência começa daqui.',
  compareLabels: (a, b) => [`${a} depois ${b}`, `${b} depois ${a}`],
  compareSame: 'Estes dois comutam: em qualquer ordem, o cubo fica igual.',
  compareDiffer: (n) => `Os mesmos dois movimentos, em outra ordem: ${n} adesivos terminam em lugares diferentes.`,
  compareReady: 'Pressione “Girar” para fazer os dois movimentos em cada cubo.',
  presets: [
    {
      name: 'A ordem importa',
      note: 'Direita depois cima, ou cima depois direita?',
    },
    {
      name: 'De volta ao começo',
      note: 'Repita R U sem parar.',
    },
    {
      name: 'Só algumas peças mexem',
      note: 'R U R′ U′, um comutador.',
    },
    {
      name: 'Desfazer de trás para a frente',
      note: 'Para desfazer, inverta a ordem.',
    },
  ],
  guests: [
    {
      name: 'Évariste Galois',
      note: 'Ele morreu aos vinte anos, deixando os começos da teoria dos grupos: a matemática de combinar e desfazer.',
    },
  ],
  insight: {
    title: 'Movimentos que dá para combinar e desfazer.',
    html: `<p>Este cubo funciona como o quebra-cabeça Rubik’s Cube®, mas aqui você brinca com os movimentos em vez de resolvê-lo. Pense num movimento do cubo como uma regra: cada adesivo vai para um lugar novo. Fazer um movimento depois do outro combina duas regras numa nova. Todo movimento pode ser desfeito. E não fazer nada também é um movimento. Os matemáticos chamam uma coleção assim de <em>grupo</em>.</p>
<div class="insight-visual">R depois U não é U depois R. A ordem importa.</div>
<h3>Desfazer ao contrário</h3>
<p>Para desfazer “R depois U”, você desfaz primeiro o último movimento: U′, depois R′. Como tirar o sapato e a meia, desfazer vem na ordem oposta.</p>
<h3>Tudo volta para casa</h3>
<p>Repita qualquer sequência e o cubo acaba voltando ao ponto de partida, porque só existe uma quantidade finita de posições. R U precisa de 105 repetições. R U R′ U′ precisa de só 6. Nenhuma sequência precisa de mais de 1260.</p>
<h3>Movimentos que quase não mexem</h3>
<p>“Faça A, faça B, desfaça A, desfaça B” é um <em>comutador</em>. Se A e B não tivessem nenhum efeito um sobre o outro, ele não faria nada. Como eles se sobrepõem só um pouco, ele mexe em poucas peças: R U R′ U′ move sete das vinte e seis. Quem resolve o cubo usa comutadores para ajeitar algumas peças sem estragar o resto.</p>
<details><summary>A matemática, se você quiser</summary><p>Cada movimento é uma permutação dos 54 adesivos. Combinar movimentos é compor permutações. Uma sequência volta para casa depois do mínimo múltiplo comum dos comprimentos de seus ciclos de adesivos. R U move adesivos em ciclos de 3, 7 e 15 posições, e o mínimo múltiplo comum de 3, 7 e 15 é 105.</p><p>O cubo tem 43.252.003.274.489.856.000 posições, e cada uma delas pode ser resolvida em no máximo 20 movimentos, contando giros de face, algo provado em 2010 com muito tempo de computador.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Rubik%27s_Cube_group" target="_blank" rel="noopener">O grupo de movimentos do cubo (em inglês)</a><a class="source-link" href="https://www.cube20.org/" target="_blank" rel="noopener">O número de Deus é 20 (em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Galois/" target="_blank" rel="noopener">Évariste Galois (em inglês)</a></div>`,
  },
});

Wonderlattice.defineText('sample', 'pt', {
  eyebrow: 'AMOSTRAGEM',
  name: 'Uma colherada de cidade',
  tagline: 'Uma pesquisa enorme pode ter certeza e estar errada. Uma pequena e aleatória acerta mais ou menos.',
  title: 'Uma colherada de cidade.',
  subtitle: 'Laranja ou azul: o que a cidade inteira prefere? Você só pode perguntar a algumas pessoas.',
  field: 'Estatística · Amostragem · Erro aleatório e viés',
  sceneLabel: 'Pesquisando uma cidade de brinquedo',
  tip: 'Toque num bairro, ou pressione ← →, para perguntar só ali · ↑ ↓ mudam o tamanho da pesquisa',
  actionLabel: 'Perguntar 50 vezes',
  canvasLabel:
    'Um mapa de uma cidadezinha cujos moradores preferem laranja ou azul, com as pessoas consultadas na última pesquisa acesas, ao lado de um gráfico com um ponto para a estimativa de cada pesquisa. Toque num bairro, ou use as setas para a esquerda e para a direita, para perguntar só ali. As setas para cima e para baixo mudam quantas pessoas cada pesquisa consulta.',
  panelEyebrow: 'Escolha como perguntar',
  whyLabel: 'Por que perguntar mais não ajuda?',
  nudge:
    'Pergunte 50 vezes ao acaso. Depois pergunte aos vizinhos. Duas nuvens de pontos bem juntinhas: qual delas está certa? Mostre a cidade inteira para descobrir.',
  connection: {
    html: '<strong>O acaso, pelos dois lados.</strong> Aqui você adivinha uma cidade inteira a partir de uma colherada. Com os dados estranhos, a contagem diz exatamente o que muitos lançamentos vão fazer.',
    label: 'Lançar os dados estranhos',
  },
  methodLabel: 'Como perguntar',
  methods: ['Ao acaso', 'Vizinhos', 'Voluntários'],
  sceneNames: ['Perguntar ao acaso', (hood) => `No bairro ${hood}`, 'Quem quiser responder'],
  hoodLabel: 'Bairro',
  hoods: [
    'Porto',
    'Cidade Velha',
    'Alto do Morro',
    'Moinho',
    'Beira-Rio',
    'Mercado',
    'Pomar',
    'Estação',
    'Jardins',
    'Olaria',
    'Morro da Lanterna',
    'Cordoaria',
  ],
  sizeLabel: 'Pessoas em cada pesquisa',
  reveal: 'Mostrar o que a cidade inteira prefere',
  askOnce: 'Perguntar uma vez',
  newCity: 'Uma nova cidade',
  cityTitle: (n) => `A cidade · ${n.toLocaleString(Wonderlattice.lang)} moradores`,
  plotTitle: (n) => `Parcela que prefere laranja · um ponto por pesquisa de ${n.toLocaleString(Wonderlattice.lang)}`,
  plotTitleShort: 'Parcela laranja · um ponto por pesquisa',
  blueWins: 'azul vence',
  orangeWins: 'laranja vence',
  wholeCity: (pct) => (pct === null ? 'cidade inteira: ?' : `cidade inteira ${pct}%`),
  before: (name, n) => `○ Antes: ${name}, ${n.toLocaleString(Wonderlattice.lang)} por pesquisa`,
  startHint: 'Pressione “Perguntar 50 vezes”',
  ready: 'Pronto para perguntar',
  surveys: (n) => (n === 1 ? '1 pesquisa' : `${n.toLocaleString(Wonderlattice.lang)} pesquisas`),
  noSurveys: 'Nenhuma pesquisa ainda.',
  noEstimate: 'Cada pesquisa vai acrescentar um ponto.',
  surveyLine: (count, n) =>
    `<strong>${count.toLocaleString(Wonderlattice.lang)}</strong> ${count === 1 ? 'pesquisa' : 'pesquisas'} com ${n.toLocaleString(Wonderlattice.lang)} ${n === 1 ? 'pessoa' : 'pessoas'}`,
  estimateLine: (mean, spread) =>
    spread === null
      ? `Esta diz que ${mean}% preferem laranja.`
      : `Em média, elas dizem que ${mean}% preferem laranja, com uma oscilação típica de ${spread} pontos.`,
  theoryLine: (n, se) =>
    `Uma amostra aleatória de ${n.toLocaleString(Wonderlattice.lang)} oscila cerca de ±${se} pontos.`,
  truthHidden: 'A resposta da cidade inteira está escondida.',
  truthLine: (pct, miss) =>
    miss === null
      ? `A cidade inteira: ${pct}% laranja.`
      : `A cidade inteira: ${pct}% laranja. Erro típico: ${miss} pontos.`,
  randomNote: 'Qualquer pessoa da cidade pode ser consultada.',
  hoodNote: (size, name) => `${size.toLocaleString(Wonderlattice.lang)} pessoas moram no bairro ${name}.`,
  hoodAll: (size, name) =>
    `Só ${size.toLocaleString(Wonderlattice.lang)} pessoas moram no bairro ${name}, então cada pesquisa pergunta a todas elas.`,
  volunteerNote: (answer, total) =>
    `Só conta quem responde: ${answer.toLocaleString(Wonderlattice.lang)} de ${total.toLocaleString(Wonderlattice.lang)}. Quem gosta de laranja tem mais vontade de responder.`,
  volunteerAll: (answer) =>
    `Só ${answer.toLocaleString(Wonderlattice.lang)} pessoas chegam a responder, então cada pesquisa ouve todas elas.`,
  presets: [
    {
      name: 'Uma pesquisa rápida ao acaso',
      note: '50 pessoas, qualquer uma da cidade.',
    },
    {
      name: 'Pergunte aos vizinhos',
      note: '50 pessoas, todas do mesmo bairro.',
    },
    {
      name: 'Uma pesquisa enorme e enviesada',
      note: '1.000 respostas de quem quiser responder.',
    },
  ],
  guests: [
    {
      name: 'Jerzy Neyman',
      note: 'Em 1934, ele alertou que escolher a dedo distritos “típicos” é uma aposta. Escolha ao acaso, defendia, e você consegue dizer o quanto pode estar errando.',
    },
  ],
  live: (n, se, hood, hoodOff, answerOff) =>
    `Na sua cidade, uma amostra aleatória de ${n.toLocaleString(Wonderlattice.lang)} oscila cerca de ±${se} pontos. ` +
    `Perguntar só no bairro ${hood} erra por ${hoodOff} pontos, e contar quem quiser responder erra por ${answerOff}, não importa quantas pessoas você consulte.`,
  insight: {
    title: 'Por que perguntar mais não ajuda?',
    html: `<p>Cada pesquisa aqui escolhe as pessoas ao acaso. Mas o acaso só pode escolher entre as pessoas que um método alcança: a cidade inteira, um bairro, ou os moradores que se dão ao trabalho de responder. Os estatísticos chamam essa lista de <em>base de amostragem</em>. Uma escolha aleatória na base conta algo sobre a base, não sobre a cidade.</p>
<h3>Oscilação e viés</h3>
<p><strong>Erro aleatório</strong> é a oscilação de uma pesquisa para a outra. Ele diminui conforme a amostra cresce, como um sobre a raiz quadrada do tamanho dela: pergunte a quatro vezes mais gente e a oscilação cai pela metade. <strong>Viés</strong> é a diferença entre a resposta da base e a da cidade. Todas as pesquisas feitas na mesma base o compartilham, então perguntar a mais gente não o diminui. Só deixa você mais seguro da resposta errada.</p>
<div class="insight-visual">erro típico² = oscilação² + viés²</div>
<p id="sample-live"></p>
<h3>Milhões de respostas, o vencedor errado</h3>
<p>Em 1936, a revista americana <em>The Literary Digest</em> enviou pelo correio mais de dez milhões de cédulas, principalmente para nomes tirados de listas telefônicas e de registros de automóveis. Voltaram mais de 2,3 milhões, menos de uma em cada quatro. A contagem final dava 54% para Alf Landon e 41% para Franklin Roosevelt. No dia da eleição, Roosevelt venceu com 61%. Pesquisas bem menores, de George Gallup e outros, que escolheram suas amostras com mais cuidado, apontaram Roosevelt como vencedor.</p>
<p>Meio século depois, o cientista político Peverill Squire usou uma pesquisa Gallup de 1937 que perguntava às pessoas se tinham recebido uma cédula do Digest e se a tinham devolvido. Ele descobriu que tanto a lista quanto as respostas pendiam para Landon, e que as duas coisas juntas causaram o erro. Se todos na lista tivessem respondido, a pesquisa pelo menos teria apontado o vencedor certo.</p>
<h3>A oscilação, exatamente</h3>
<p>Para uma amostra aleatória de <em>n</em> pessoas de uma cidade de <em>N</em>, em que uma parcela <em>p</em> prefere laranja, a oscilação típica (o erro padrão) é √(<em>p</em>(1 − <em>p</em>)/<em>n</em>) × √((<em>N</em> − <em>n</em>)/(<em>N</em> − 1)). O segundo fator, a correção para população finita, existe porque ninguém é consultado duas vezes. Ele importa aqui porque a cidade é pequena, e chega a zero quando você pergunta a todo mundo. A sala usa essa fórmula corrigida.</p>
<details><summary>O que esta cidade de brinquedo deixa de fora</summary><p>Duas cores, bairros sorteados ao acaso, moradores que nunca mudam de ideia e uma taxa de resposta que depende só da cor. Pesquisas de verdade escolhem as pessoas de um jeito mais esperto (Jerzy Neyman defendeu em 1934 a amostragem aleatória dentro de grupos, chamados estratos), depois ponderam as respostas para bater com o que se sabe da população e corrigem para quem não respondeu. As próprias pesquisas de Gallup nos anos 1930 preenchiam cotas de diferentes tipos de pessoas, um método com falhas próprias. A margem de erro publicada ao lado de uma pesquisa descreve só a oscilação aleatória; ela não enxerga o viés.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1086/269085" target="_blank" rel="noopener">Squire: por que a pesquisa do Literary Digest de 1936 falhou (1988, em inglês)</a><a class="source-link" href="https://doi.org/10.2307/2342192" target="_blank" rel="noopener">Neyman sobre amostragem aleatória versus intencional (1934, em inglês)</a><a class="source-link" href="https://online.stat.psu.edu/stat506/Lesson02" target="_blank" rel="noopener">O erro padrão de uma proporção amostral (Penn State STAT 506, em inglês)</a></div>`,
  },
});

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

Wonderlattice.defineText('fingerprint', 'pt', {
  eyebrow: 'PELE',
  name: 'Faça crescer uma impressão digital',
  tagline: 'Ninguém a desenha: as cristas crescem sozinhas em verticilos, presilhas e arcos.',
  title: 'Faça crescer uma impressão digital.',
  subtitle: 'Ninguém desenha uma impressão digital. Dois sinais se espalham e reagem, e as cristas aparecem sozinhas.',
  field: 'Reação–difusão · Padrões de Turing · Desenvolvimento',
  sceneLabel: 'A ponta de um dedo, criando suas cristas',
  tip: 'Toque na ponta do dedo para começar cristas ali · As setas miram, Enter planta',
  actionLabel: 'Crescer de novo',
  canvasLabel:
    'A ponta de um dedo onde as cristas crescem para fora a partir de alguns pontos iniciais. Clique ou toque para começar cristas num ponto, ou use as setas para mirar e Enter para plantar.',
  panelEyebrow: 'Molde o crescimento',
  whyLabel: 'Como as cristas se formam?',
  nudge:
    'Observe onde as ondas se encontram: quando três se encontram, deixam um pequeno Y. Depois pressione “Crescer de novo”: o mesmo plano, detalhes novos, como gêmeos idênticos.',
  connection: {
    html: '<strong>Sem planta baixa.</strong> Aqui, dois sinais e alguns pontos iniciais fazem cada crista. Em “Uma mente de muitos”, algumas regras entre vizinhos movem uma multidão inteira.',
    label: 'Visitar “Uma mente de muitos”',
  },
  presets: [
    {
      name: 'Verticilo',
      note: 'O centro da polpa começa primeiro.',
    },
    {
      name: 'Presilha',
      note: 'Um começo que escapa por um lado.',
    },
    {
      name: 'Arco',
      note: 'A dobra lidera; a polpa nunca começa.',
    },
    {
      name: 'Do seu jeito',
      note: 'Toque para escolher onde as cristas começam.',
    },
  ],
  sceneNames: ['Um verticilo', 'Uma presilha', 'Um arco', 'Sua própria impressão digital'],
  mixed: 'Sua própria mistura',
  lead: 'Vantagem para a primeira onda',
  ridges: (n) => (n === 1 ? '1 crista' : `${n} cristas`),
  spacing: 'Espaçamento das cristas',
  across: (n) => `cerca de ${n} na largura`,
  speed: 'Velocidade de crescimento',
  speeds: ['suave', 'tranquila', 'constante', 'animada', 'a toda'],
  look: 'Aparência',
  looks: ['Pele quente', 'Impressão a tinta', 'Brilho noturno'],
  marks: 'Mostrar onde as cristas começam',
  roles: {
    pad: 'Centro da polpa',
    tip: 'Ponta do dedo',
    crease: 'Dobra',
    yours: 'Seu ponto',
  },
  legendTitle: 'ONDE AS CRISTAS COMEÇAM',
  triradiusKey: 'Delta: um pequeno Y',
  started: 'crescendo',
  done: 'pronta',
  soon: (n) => (n <= 1 ? 'entra em cerca de uma crista' : `entra em cerca de ${n} cristas`),
  noSites: 'Toque na ponta do dedo para começar.',
  growing: (percent) => `Crescendo · ${percent}% da ponta do dedo`,
  quietly: (percent) => `Crescendo devagar · ${percent}%`,
  waiting: 'Toque na ponta do dedo para começar as cristas',
  types: {
    whorl: 'um verticilo',
    loop: 'uma presilha',
    arch: 'um arco',
  },
  result: (type) => `Pronta: o centro dela forma ${type}`,
  triradii: (n) =>
    n === 0 ? 'nenhum delta encontrado' : n === 1 ? '1 delta (um pequeno Y)' : `${n} deltas (pequenos Ys)`,
  status: (type, n) => `${type[0].toUpperCase() + type.slice(1)} · ${n === 1 ? '1 delta' : `${n} deltas`}`,
  twin: (n) => `Gêmea ${n + 1} · “Crescer de novo” para uma irmã`,
  full: 'Quatro pontos iniciais é o máximo. Escolha “Do seu jeito” para uma ponta de dedo nova.',
  outside: 'Toque dentro da ponta do dedo.',
  guests: [
    {
      name: 'Alan Turing',
      note: 'Em 1952, ele mostrou que duas substâncias químicas, reagindo e se espalhando em velocidades diferentes, podem fazer padrões aparecerem.',
    },
  ],
  insight: {
    title: 'De onde vêm as impressões digitais?',
    html: `<p>Ninguém desenha uma impressão digital. Antes do nascimento, a pele da ponta de cada dedo organiza suas cristas sozinha, e o padrão fica para a vida toda.</p>
<div class="insight-visual">ativador + inibidor, espalhando-se em velocidades diferentes → cristas</div>
<h3>A ideia de Turing</h3>
<p>Em 1952, Alan Turing mostrou que duas substâncias químicas, reagindo uma com a outra e se espalhando em velocidades diferentes, podem fazer um padrão aparecer numa mistura uniforme. Um jeito popular de imaginar isso veio depois: um <em>ativador</em> que produz mais de si mesmo, e um <em>inibidor</em>, também produzido por ele, que o segura. Se o inibidor se espalha mais rápido, cada saliência de ativador se cerca de um fosso onde nenhuma outra saliência consegue crescer. O resultado são manchas ou listras, com um espaçamento que a química escolhe.</p>
<h3>Ondas a partir de poucos lugares</h3>
<p>Em 2023, uma equipe liderada pela Universidade de Edimburgo descobriu que as cristas das impressões digitais seguem esse tipo de sistema de Turing, com os sinais WNT e EDAR como ativadores e BMP como inibidor. As cristas não aparecem em toda parte ao mesmo tempo. Elas começam em alguns pontos: o centro da polpa da ponta do dedo, a ponta perto da unha e ao lado da dobra da última articulação. Dali, elas se espalham como ondas, deixando cristas mais ou menos paralelas à frente da onda. Onde as ondas se encontram, deixam os deltas, em forma de Y. As simulações da equipe produziram arcos, presilhas e verticilos mudando quando, onde e em que ângulo os pontos começam: uma polpa que começa tarde, por exemplo, deixa espaço para as cristas da dobra e forma um arco.</p>
<h3>Por que as impressões variam tanto</h3>
<p>O estudo concluiu que onde os pontos começam, e como suas ondas se encontram, produz a variedade das impressões digitais; na discussão, os autores acrescentam que as pequenas diferenças aleatórias típicas dos padrões de Turing tornam cada impressão ainda mais única. Gêmeos idênticos compartilham os genes, e suas impressões muitas vezes são do mesmo tipo, mas não têm os mesmos detalhes: num grande estudo, as impressões de gêmeos tinham o mesmo tipo cerca de três vezes em cada quatro, e mesmo assim um comparador de impressões digitais as distinguia quase tão bem quanto distingue as de pessoas sem parentesco. “Crescer de novo” mantém o plano e muda só os detalhes mais minúsculos, e você pode ver as cristas terminarem e se bifurcarem em lugares novos.</p>
<h3>O que esta sala deixa de fora</h3>
<p>Este é um modelo simplificado inspirado nessa pesquisa, não uma simulação de pele embrionária de verdade. A ponta do dedo é plana, os pontos iniciais são colocados à mão, e não aparecem genes nem substâncias reais: só dois sinais inventados, com equações de livro-texto. Ficam de fora o crescimento do dedo, sua polpa tridimensional e os poros de suor que depois pontilham cada crista.</p>
<details><summary>A matemática, se você quiser</summary><p>Os dois sinais a (ativador) e h (inibidor) seguem equações adaptadas do modelo cúbico de Barrio–Varea–Aragón–Maini (aqui o ativador se espalha um pouco mais devagar, 0.45 em vez de 0.516, e h é o v deles com o sinal trocado): ∂a/∂t = 0.45 s ∇²a + 0.899 a − h − 3.15 a h², e ∂h/∂t = s ∇²h + 0.899 a − 0.91 h − 3.15 a h². O estado uniforme a = h = 0 é instável para uma faixa de ondulações, que crescem mais rápido com um comprimento de onda de cerca de 9.5√s células da grade, mas ele continua exatamente uniforme até que um ponto o empurre, por isso as cristas só se espalham como ondas a partir dos pontos. Sem termos quadráticos (o único não linear, a h², é cúbico), as listras vencem as manchas. O controle de espaçamento das cristas muda s.</p><p>A sala dá nome ao resultado caminhando em volta de cada ponto onde a direção das cristas se desfaz e somando quanto essa direção gira (seu índice de Poincaré): meia volta num sentido para o núcleo de uma presilha, uma volta inteira para o centro de um verticilo e meia volta no outro sentido para um delta. Os peritos em impressões digitais usam os mesmos pontos de referência. Pontos bem na borda da ponta do dedo não são detectados.</p></details>
<div class="sources"><a class="source-link" href="https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/" target="_blank" rel="noopener">Glover et al. (2023), The developmental basis of fingerprint pattern formation and variation (em inglês)</a><a class="source-link" href="https://doi.org/10.1098/rstb.1952.0012" target="_blank" rel="noopener">Turing (1952), The chemical basis of morphogenesis (em inglês)</a><a class="source-link" href="https://doi.org/10.1371/journal.pone.0035704" target="_blank" rel="noopener">Tao et al. (2012), reconhecimento de impressões digitais de gêmeos idênticos (em inglês)</a><a class="source-link" href="https://doi.org/10.1006/bulm.1998.0093" target="_blank" rel="noopener">Barrio et al. (1999), o modelo do qual estas equações foram adaptadas (em inglês)</a></div>`,
  },
});

// The fixed text of the page (index.html, elements marked data-t).
Wonderlattice.defineText('page', 'pt', {
  head: {
    title: 'Wonderlattice — Siga sua curiosidade',
    description:
      'Pequenas salas de matemática para brincar: desenhe com braços que giram, teça tecidos, ponha dados para competir, mande uma imagem por uma tempestade, deforme o plano, faça crescer uma impressão digital e muito mais.',
  },
  skip: 'Pular para o conteúdo principal',
  header: {
    edition: 'UM PEQUENO LUGAR PARA UMA GRANDE CURIOSIDADE',
    about: 'Sobre este lugar',
    trail: 'Minha trilha',
    home: 'Início do Wonderlattice',
  },
  roomBar: {
    home: '← Todos os experimentos',
    label: 'Experimentos',
  },
  trailReturn: {
    noteHtml: 'O que você nota agora? <span>(opcional)</span>',
    save: 'Guardar este pensamento',
    dismiss: 'Dispensar',
    label: 'Descoberta revisitada',
    placeholder: 'Um pensamento pequeno já basta.',
  },
  home: {
    title: 'Siga sua curiosidade.',
    intro:
      'O Wonderlattice é uma coleção gratuita de pequenos experimentos práticos com grandes ideias matemáticas. Escolha um e brinque. Não há nada para acertar e nenhum cadastro.',
  },
  motion: {
    title: 'Pintar com movimento.',
    subtitle: 'Dois braços que giram. Uma caneta. Veja o que surge.',
    field: 'Círculos dentro de círculos',
    onCanvas: 'Na tela',
    finish: 'Traçar tudo',
    surprise: '✧ Me surpreenda',
    rotation: 'Rotação interna',
    opposite: 'Sentido oposto',
    same: 'Mesmo sentido',
    reach: 'Alcance da caneta',
    reachHint: 'Mude o equilíbrio entre os dois braços.',
    angle: 'Ângulo inicial',
    angleHint: 'Gire a posição inicial do braço interno.',
    ink: 'Tinta',
    arms: 'Mostrar os braços em movimento',
    slow: 'Devagar',
    flow: 'Fluindo',
    fast: 'Rápido',
    why: 'Por que isso acontece?',
    presetsTitle: 'Um lugar para começar',
    share: 'Copiar este padrão',
    connectionHtml:
      '<strong>E se um desenho tivesse voz?</strong> Siga a ligação entre movimento circular, ondas e som.',
    connectionGo: 'Entrar no som',
    drawingLabel: 'Seu desenho ao vivo',
    canvasLabel:
      'Uma curva animada traçada pela ponta de dois braços que giram. Use os controles ao lado para mudar sua forma.',
    restart: 'Recomeçar o desenho',
    saveLabel: 'Salvar o desenho como PNG',
    controlsLabel: 'Controles do desenho',
    surpriseTitle: 'Experimentar uma combinação nova',
    rotationExact: 'Velocidade exata da rotação interna',
    inkLabel: 'Paleta de tinta',
    palette0: 'Aurora: de menta a violeta',
    palette1: 'Brasa: de dourado a rosa',
    palette2: 'Geleira: de azul a prata',
    palette3: 'Luar: branco quente',
    speedLabel: 'Velocidade do desenho',
    presetsLabel: 'Padrões iniciais',
  },
  stage: {
    makeItYours: 'Faça do seu jeito',
    keep: '✧ Guardar este momento',
    nudge: 'Uma dica',
    reset: 'Recomeçar',
    presetsTitle: 'Siga outra possibilidade',
    share: 'Copiar esta exploração',
    saveTitle: 'Salvar imagem',
    guestLabel: 'Uma visita da matemática',
    sceneLabel: 'Exploração interativa',
    saveLabel: 'Salvar esta cena como imagem',
    controlsLabel: 'Controles da exploração',
  },
  footer: {
    note: 'Siga uma forma. Encontre um pouco de encanto.',
    promise: 'Sem pontuação. Sem respostas certas.',
    credit: 'Feito por Eyal Weiss',
    about: 'Sobre',
  },
  why: {
    titleHtml: 'Um pouco de movimento,<br />muitas possibilidades.',
    p1: 'Imagine uma caneta na ponta de um braço. Agora prenda esse braço na ponta de outro braço que gira. Cada movimento é simples. A combinação deles desenha a curva que você vê.',
    reveal: 'Mostre os braços',
    h2: 'Quando os ritmos se reencontram',
    p2: 'Se um braço dá um número inteiro de voltas enquanto o outro também dá um número inteiro, os dois podem voltar juntos à posição inicial. A caneta fecha o laço.',
    p3: 'Uma mudança minúscula de velocidade pode fazer esse reencontro demorar muito mais. Surgem novos laços no meio do caminho, tecendo um desenho bem mais denso. Experimente “Quase um círculo” e depois “Traçar tudo”.',
    h3: 'Existe uma ligação com a música',
    p4: 'As posições horizontal e vertical de um ponto que gira se movem, cada uma, como uma onda suave. Some as posições de dois pontos que giram, e você está somando ondas. Combinar ondas também é essencial para o som. Este desenho é um parente visual dessa ideia, não uma simulação de um instrumento musical.',
    more: 'Quer saber mais sobre a matemática?',
    p5: 'A posição da caneta é a soma de dois movimentos circulares:',
    p6Html:
      'Aqui, <em>a</em> e <em>b</em> são os comprimentos dos braços, <em>k</em> é a velocidade de rotação do braço interno em relação à do externo, e <em>φ</em> é o seu ângulo inicial. Os dois ângulos são medidos em relação à tela, não em relação ao outro braço.',
    p7: 'Uma razão de velocidades racional dá um caminho fechado. Uma razão irracional nunca fecharia exatamente. Todas as configurações decimais finitas deste playground são racionais, mesmo quando seus caminhos demoram muito para fechar.',
    source1: 'Epitrocoides e hipotrocoides',
    source2: 'O Espirógrafo',
    close: 'Fechar a explicação',
  },
  narration: {
    listen: 'Ouvir esta ideia',
  },
  about: {
    title: 'Boas-vindas ao Wonderlattice.',
    p1: 'Um pequeno experimento para curtir ideias matemáticas brincando. Mude alguma coisa. Siga o que chamar sua atenção. Faça algo de que você goste.',
    p2: 'Cada pequeno mundo liga um pedaço da matemática a algo com que você pode brincar: formas, sons, multidões, jogos, padrões que você mesmo faz. Não há lição para terminar nem nada para acertar.',
    cardHtml:
      '<strong>Faça do seu jeito</strong><br />Escolha um ponto de partida, mexa num controle e siga o que surpreender você. Cada sala tem uma explicação opcional, e você pode salvar uma imagem quando quiser.',
    p3: 'Tudo aqui roda no seu navegador, até offline. Não há contas, nem rastreamento, nem cookies, nem chat com IA. O som fica desligado até você ligá-lo.',
    privacyTitle: 'Sua privacidade',
    privacy:
      'O Wonderlattice não coleta nada. O site é hospedado pela Cloudflare, que mantém registros de acesso padrão (endereço IP, horário, página) sob sua própria política de privacidade. Minha trilha e sua escolha de idioma ficam guardadas só neste navegador, e só quando você as usa; apagar os dados do site as remove. A narração usa as vozes do seu navegador: algumas vozes online enviam o texto lido (estas explicações, nunca suas anotações) para o serviço de voz de quem fez o navegador.',
    whoTitle: 'Quem faz isto',
    whoHtml:
      'O Wonderlattice é um projeto pessoal, gratuito e sem fins comerciais, de Eyal Weiss. Diga oi em <a href="mailto:eyal8488@gmail.com">eyal8488@gmail.com</a> ou no <a href="https://github.com/eyal-weiss" target="_blank" rel="noopener noreferrer">GitHub</a>.',
    legal:
      'Os modelos aqui são simplificados para brincar e explicar; não são previsões, medições nem conselhos. Oferecido como está, sem garantia. Os links levam a sites independentes; nenhuma afiliação ou endosso está implícito. Rubik’s Cube® é uma marca registrada da Spin Master Toys UK Limited; o Wonderlattice não tem afiliação com ela.',
    creditsHtml:
      'O código e os textos podem ser reutilizados livremente sob a licença MIT. Os retratos de matemáticos históricos estão em domínio público, exceto a foto de John Conway por Thane Plambeck (recortada, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</a>). Os visitantes desenhados são esboços divertidos, não retratos fiéis.',
    close: 'Fechar “Sobre”',
  },
  copy: {
    title: 'Seu padrão, para guardar.',
    select: 'Selecionar o texto',
    close: 'Fechar os detalhes do padrão',
    textLabel: 'Configurações do padrão ou link para compartilhar',
  },
  trailSave: {
    title: 'Um momento que vale guardar.',
    noteHtml: 'O que chamou sua atenção? <span>(opcional)</span>',
    private: 'Salvo só neste navegador. Você pode exportar sua trilha depois.',
    save: 'Salvar na minha trilha',
    close: 'Fechar a janela de salvar',
    placeholder: 'Uma pergunta, uma surpresa, uma pequena observação…',
  },
  trail: {
    title: 'Minha trilha.',
    intro:
      'Alguns momentos que você escolheu guardar. Revisite uma sala com aquelas configurações e veja o que você nota agora.',
    threads: 'Fios para seguir',
    export: 'Exportar minha trilha',
    import: 'Importar uma trilha',
    private:
      'Isto fica neste aparelho, a menos que você exporte. Importar substitui a trilha atual. Apagar os dados do navegador a remove.',
    close: 'Fechar a trilha',
    importLabel: 'Importar uma trilha (um arquivo JSON do Wonderlattice)',
  },
  insight: {
    close: 'Fechar a explicação',
  },
});
