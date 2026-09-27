Wonderlattice.defineText('fireflies', 'pt', {
  eyebrow: 'SINCRONIA',
  name: 'Vaga-lumes que entram no ritmo',
  tagline: 'Cada um no seu ritmo, até que começam a prestar atenção uns nos outros.',
  title: 'Vaga-lumes que entram no ritmo.',
  subtitle:
    'Cada vaga-lume marca o seu próprio tempo. Deixe que prestem atenção uns nos outros e veja surgir um ritmo comum.',
  field: 'Sistemas dinâmicos · Osciladores acoplados · Biologia',
  sceneLabel: 'Um campo · muitos relógios',
  sceneName: 'O campo de vaga-lumes',
  tip: 'Leve “Quanto eles prestam atenção uns nos outros” para além de 1, mais ou menos · O círculo mostra o ritmo de todos',
  actionLabel: 'Bagunçar os ritmos',
  canvasLabel:
    'Um campo de vaga-lumes brilhando suavemente, cada um no seu ritmo, com um círculo que mostra em que ponto do ciclo cada um está.',
  panelEyebrow: 'Ritmos que se puxam',
  whyLabel: 'Por que eles começam a piscar juntos?',
  nudge: 'Comece do zero e suba devagar. Onde começa um pulso comum? Ele chega de uma vez?',
  connection: {
    html: '<strong>Ordem sem maestro.</strong> Aqui, os ritmos puxam uns aos outros até entrarem no compasso. Em “Uma mente de muitos”, as direções fazem o mesmo com um bando.',
    label: 'Veja um bando entrar em acordo',
  },
  presets: [
    { name: 'Cada um por si', note: 'Ninguém presta atenção em ninguém.', badge: '0' },
    { name: 'Logo depois do limiar', note: 'Um pulso comum, devagar.', badge: '1.2' },
    { name: 'Dia e noite', note: 'Um ciclo de luz entra em cena.', badge: '☾' },
  ],
  coupling: 'Quanto eles prestam atenção uns nos outros',
  couplingHint: 'A partir de 1, mais ou menos, um ritmo comum começa a crescer.',
  sun: 'Acrescentar um ciclo de dia e noite',
  circle: 'Mostrar o ritmo de todos',
  fly: 'Voar oito fusos horários',
  together: 'No compasso',
  percent: (r) => `${Math.round(r * 100)}%`,
  status: {
    apart: 'Cada um no seu ritmo',
    stirring: 'Pequenos grupos acham o compasso',
    together: 'Piscando juntos',
  },
  flying: (days) => `Depois do voo · dia ${days}`,
  caughtUp: (days) => `Os relógios se acertaram com o novo dia depois de ${days} ${days === 1 ? 'dia' : 'dias'}.`,
  announceTogether: 'A maioria dos vaga-lumes agora pisca junto.',
  announceApart: 'Os vaga-lumes saíram do compasso.',
  labels: {
    rhythm: 'O ritmo de todos',
    history: 'No compasso, ao longo do tempo',
  },
  guests: [
    {
      name: 'Christiaan Huygens',
      note: 'Em 1665, doente na cama, ele viu dois de seus relógios de pêndulo marcarem o tempo juntos, balançando em sentidos opostos, por mais que ele os perturbasse.',
    },
    {
      name: 'Arthur Winfree',
      note: 'Ele se perguntou como uma multidão de relógios um pouco diferentes poderia concordar sobre a hora, e encontrou um ponto de virada.',
    },
  ],
  insight: {
    title: 'Por que eles começam a piscar juntos?',
    html: `<p>Cada vaga-lume tem o seu ritmo natural, um pouco mais rápido ou mais lento que o dos outros. Quando vê os lampejos ao redor, ele ajusta um pouco o seu tempo na direção da média do grupo. Ninguém lidera. Se os empurrõezinhos são fracos, as diferenças vencem e o campo cintila ao acaso. Se são fortes o bastante, cresce um ritmo comum que puxa cada vez mais vaga-lumes.</p>
<div class="insight-visual">ritmo próprio + atração pelo grupo → um pulso comum</div>
<h3>Um limiar, não um interruptor</h3>
<p>Abaixo de uma intensidade crítica (1 no controle), quase nada acontece. Logo acima, um pequeno núcleo entra no compasso, e a sincronia sobe rápido conforme você avança, mas de forma contínua, não de uma vez. Com um número finito de vaga-lumes o limiar fica um pouco borrado, e até “Cada um por si” mostra cerca de 10% de sincronia por acaso.</p>
<h3>Relógios no seu corpo</h3>
<p>As suas células também têm relógios, que correm um pouco acima ou abaixo de 24 horas. A luz de cada manhã os acerta com o dia. Voe por vários fusos horários e a luz chega na hora “errada”: os seus relógios levam dias para se acertar. Isso é o jet lag. Aqui, um “dia” dura cerca de dois segundos.</p>
<h3>O que este modelo deixa de fora</h3>
<p>Vaga-lumes de verdade não enxergam todos os outros, os seus lampejos são pulsos e não ritmos suaves, e os relógios do corpo envolvem genes, hormônios e um relógio mestre no cérebro. Este é o modelo clássico simplificado que capta o ponto de virada, não uma simulação de insetos ou células reais.</p>
<details><summary>A matemática, se você quiser</summary><p>Este é o modelo de Kuramoto. Cada fase θ segue dθ/dt = ω + K·R·sin(ψ − θ), onde ω é a sua frequência natural e R·e<sup>iψ</sup> é a média de todos os e<sup>iθ</sup>: R perto de 1 quer dizer no compasso, R perto de 0 quer dizer espalhados. Quando as frequências naturais se distribuem como um sino, um ritmo comum aparece a partir de K = 2 / (π g(0)), onde g(0) indica quão comum é a frequência média. O controle é medido em unidades desse K crítico. O ciclo de dia e noite acrescenta um termo F·sin(φ − θ), um ritmo que puxa todos.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Kuramoto_model" target="_blank" rel="noopener">Modelo de Kuramoto, Wikipédia (em inglês)</a> · <a class="source-link" href="https://www.nigms.nih.gov/image-gallery/2569" target="_blank" rel="noopener">NIGMS: ritmo circadiano (em inglês)</a> · S. H. Strogatz, <em>Sync</em> (2003)</div>`,
  },
});
