Wonderlattice.defineText('waves', 'pt', {
  eyebrow: 'ONDAS · SOM',
  name: 'Ouça a forma',
  tagline: 'Dois tons se combinam em batimentos, silêncio e um retrato em laço.',
  title: 'Ouça a forma.',
  subtitle:
    'Dois tons, desenhados como ondas. Afaste um deles só um pouquinho do outro e veja, ou escute, a soma deles começar a pulsar.',
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
