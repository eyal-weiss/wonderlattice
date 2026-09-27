Wonderlattice.defineText('heart', 'pt', {
  eyebrow: 'MEIOS EXCITÁVEIS',
  name: 'Um batimento que viaja',
  tagline: 'Toque numa folha de células e uma onda se espalha. Quebre-a, e ela se enrola numa espiral.',
  title: 'Um batimento que viaja.',
  subtitle: 'Cada célula dispara e depois descansa. Comece uma onda e depois veja o que uma onda quebrada faz.',
  field: 'Meios excitáveis · Ondas espirais · Ondas no corpo',
  sceneLabel: 'Uma folha · Milhares de células',
  sceneName: 'O batimento viajante',
  tip: 'Toque para começar uma onda · Arraste através de uma onda para quebrá-la · As setas miram, Enter começa uma onda, Delete apaga',
  actionLabel: 'Quebrar uma onda',
  canvasLabel:
    'Uma folha de células onde ondas de atividade se espalham a partir de um marca-passo no canto e dos seus toques. Arraste através de uma onda para quebrá-la.',
  panelEyebrow: 'Disparar e descansar',
  whyLabel: 'Por que uma onda quebrada gira?',
  nudge: 'Aperte “Quebrar uma onda” e observe os batimentos no canto oposto. O marca-passo ainda está ditando o ritmo?',
  connection: {
    html: '<strong>Padrões de células que só conversam com as vizinhas.</strong> Aqui, ondas de atividade percorrem uma folha de células. Em “Faça crescer uma impressão digital”, duas substâncias químicas que se espalham em velocidades diferentes desenham cristas.',
    label: 'Veja as cristas crescerem',
  },
  presets: [
    { name: 'Um batimento regular', note: 'Um marca-passo, um batimento por segundo.', badge: '♥' },
    { name: 'Quebrar uma onda', note: 'Suas pontas soltas se enrolam em espirais.', badge: '@' },
    { name: 'Recuperação lenta', note: 'Alguns batimentos nunca chegam.', badge: '½' },
  ],
  recovery: 'Tempo de recuperação',
  recoveryHint: 'Quanto tempo uma célula descansa antes de poder disparar de novo.',
  pacemaker: 'Marca-passo no canto',
  rateLabel: 'Batimentos que chegam ao canto oposto',
  rate: (n) => `${n} por minuto`,
  pacemakerRate: 'O marca-passo bate 60 vezes por minuto.',
  status: {
    quiet: 'Todas as células estão em repouso',
    waves: 'Há ondas viajando',
    steady: 'Todo batimento chega ao canto oposto',
    blocked: 'Alguns batimentos nunca chegam ao canto oposto',
    spirals: (n) => (n === 1 ? 'Uma espiral está girando sozinha' : `${n} espirais estão girando sozinhas`),
  },
  guests: [
    {
      name: 'Norbert Wiener',
      note: 'Com Arturo Rosenblueth, em 1946 descrevi como uma onda de excitação pode continuar circulando em volta de um obstáculo no músculo do coração.',
    },
    {
      name: 'Arthur Winfree',
      note: 'Procurei o ponto parado no centro de uma onda espiral, onde o ritmo não tem fase nenhuma.',
    },
  ],
  insight: {
    title: 'Por que uma onda quebrada gira?',
    html: `<p>Cada célula desta folha está em repouso, disparando ou se recuperando. Uma célula em repouso dispara quando vizinhas suficientes disparam. Uma célula que dispara logo para, e depois precisa de tempo para se recuperar antes de poder disparar de novo. Uma folha assim se chama <em>meio excitável</em>.</p>
<div class="insight-visual">repouso → disparo → recuperação → repouso</div>
<h3>Por que as ondas não se atravessam</h3>
<p>Atrás de cada onda há uma faixa de células se recuperando. Quando duas ondas se encontram, cada uma esbarra na faixa em recuperação da outra e para, então elas se anulam em vez de se cruzar.</p>
<h3>Por que uma onda quebrada gira</h3>
<p>Uma onda com uma ponta solta avança mais devagar nessa ponta, onde tem menos vizinhas disparando, do que mais adiante. A ponta fica para trás, o resto da onda gira em volta dela, e a onda se enrola numa espiral. Uma espiral tem seu próprio ritmo, e aqui esse ritmo é mais rápido que o do marca-passo, então a espiral toma conta da folha inteira.</p>
<h3>Corações, química e mixomicetos</h3>
<p>O músculo do coração também é um meio excitável: cada batimento é uma onda de atividade elétrica que começa num marca-passo natural. Ondas espirais que giram no tecido cardíaco, chamadas de reentrada, estão ligadas a alguns distúrbios perigosos do ritmo cardíaco. As mesmas espirais aparecem na reação química de Belousov–Zhabotinsky e em colônias de mixomicetos, os chamados bolores limosos.</p>
<h3>O que este modelo deixa de fora</h3>
<p>É um brinquedo: uma folha plana e uniforme que segue uma regra matemática simples. O tecido cardíaco de verdade tem fibras, três dimensões, muitos tipos de células e uma química muito mais rica. A sala mostra por que as espirais se formam e por que duram. Não é uma simulação de um coração, e não diz nada sobre a saúde de ninguém.</p>
<details><summary>A matemática, se você quiser</summary><p>Cada célula tem uma ativação u entre 0 e 1 e uma recuperação v, segundo o modelo de Barkley: ∂u/∂t = ∇²u + u(1 − u)(u − (v + b)/a)/ε e ∂v/∂t = k(u − v), com a = 0,75, b = 0,02 e ε = 0,02. O termo ∇²u espalha a ativação para as vizinhas. O termo cúbico faz uma célula disparar só acima de um limiar, e esse limiar continua alto enquanto a célula se recupera. O fator k, acrescentado aqui, é definido pelo controle de recuperação: uma recuperação mais lenta dá ondas mais largas, espirais maiores e, quando as células ainda estão se recuperando quando chega o próximo batimento, batimentos bloqueados. Modelos anteriores da mesma ideia eram autômatos celulares com poucos estados discretos, como o de Greenberg e Hastings, de 1978. O livro de Arthur Winfree <em>When Time Breaks Down</em> (1987) conta a história das espirais em corações e na química.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Excitable_medium" target="_blank" rel="noopener">Meio excitável, Wikipédia (em inglês)</a><a class="source-link" href="http://www.scholarpedia.org/article/Barkley_model" target="_blank" rel="noopener">Modelo de Barkley, Scholarpedia (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Belousov%E2%80%93Zhabotinsky_reaction" target="_blank" rel="noopener">Reação de Belousov–Zhabotinsky, Wikipédia (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Arthur_Winfree" target="_blank" rel="noopener">Arthur Winfree, Wikipédia (em inglês)</a></div>`,
  },
});
