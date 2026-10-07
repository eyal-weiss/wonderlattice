/* Seis apertos de mão · palavras para o visitante (pt). */
Wonderlattice.defineText('handshakes', 'pt', {
  eyebrow: 'MUNDOS PEQUENOS',
  name: 'Seis apertos de mão',
  tagline:
    'Duzentos amigos em roda estão a 25 apertos de mão de distância. Cinco amizades ao acaso quase cortam isso pela metade.',
  title: 'Seis apertos de mão.',
  subtitle:
    'Duzentas pessoas em roda, cada uma amiga dos seus quatro vizinhos mais próximos. Veja algumas amizades ao acaso encolherem o mundo inteiro, e depois acrescente mais.',
  field: 'Redes · Teoria dos grafos · Ciências sociais',
  sceneLabel: 'Uma roda · alguns desconhecidos',
  sceneName: 'Uma roda de 200 amigos',
  tip: 'Toque em qualquer pessoa para contar os apertos de mão a partir de você · Teclas: ← → escolhem alguém, + acrescenta um atalho',
  actionLabel: 'Mais um atalho',
  canvasLabel:
    'Duzentas pessoas num círculo, cada uma ligada aos vizinhos mais próximos, com algumas ligações longas que atravessam o círculo. No meio, o número médio de apertos de mão entre duas pessoas.',
  panelEyebrow: 'Amigos de amigos',
  whyLabel: 'Por que alguns atalhos encolhem o mundo?',
  nudge: 'Recomece com uma roda simples e acrescente atalhos um de cada vez. Qual deles faz mais diferença?',
  connection: {
    html: '<strong>Mundos pequenos marcam o compasso.</strong> Watts e Strogatz notaram que relógios ligados como um mundo pequeno entram no ritmo com mais facilidade. Veja um campo deles em “Vaga-lumes que entram no ritmo”.',
    label: 'Ver os vaga-lumes',
  },

  presets: [
    { name: 'Só vizinhos', note: 'Uma roda simples.', badge: '0' },
    { name: 'Cinco encontros', note: 'Cinco amizades ao acaso.', badge: '5' },
    { name: 'Um boato', note: 'A notícia se espalha a partir de você.', badge: '20' },
  ],

  shortcuts: 'Atalhos cruzando o círculo',
  rumour: 'Espalhar um boato a partir de você',

  // The status line above the picture. `steps`, `heard`, `round` and `rounds` are whole numbers.
  status: {
    path: (steps) => `De você até ela: ${steps} ${steps === 1 ? 'aperto de mão' : 'apertos de mão'}`,
    spreading: (heard, round) => `Rodada ${round}: ${heard} de 200 já ${heard === 1 ? 'sabe' : 'sabem'}`,
    everyone: (rounds) => `Todos ficaram sabendo depois de ${rounds} ${rounds === 1 ? 'rodada' : 'rodadas'}`,
  },
  // Said once the number of shortcuts settles. `count` is a whole number, `distance` a formatted number.
  announce: (count, distance) =>
    `${count === 0 ? 'Sem atalhos' : count === 1 ? 'Com 1 atalho' : `Com ${count} atalhos`}, duas pessoas estão, em média, a ${distance} apertos de mão de distância.`,

  // Words drawn on the canvas.
  labels: {
    apart: 'apertos de mão',
    onAverage: 'em média',
    knit: 'Amigos que se conhecem',
    you: 'Você',
    steps: (steps) => `${steps} ${steps === 1 ? 'aperto de mão' : 'apertos de mão'}`,
    chart: 'Com mais atalhos',
    far: 'Quão distantes',
    close: 'Quão unidos',
    scale: '100% = a roda simples',
    axis: (count) => `${count} atalhos`,
  },

  guests: [
    {
      name: 'Frigyes Karinthy',
      note: 'No seu conto “Correntes”, de 1929, um personagem aposta que qualquer pessoa na Terra pode ser alcançada por meio de no máximo cinco conhecidos.',
    },
    {
      name: 'Stanley Milgram',
      note: 'Nos anos 1960, ele pediu a pessoas que fizessem uma carta chegar a um desconhecido, passando-a apenas a alguém que conhecessem bem. A maioria das cartas nunca chegou; as que chegaram levaram cerca de seis passos.',
    },
  ],

  insight: {
    title: 'Por que alguns atalhos encolhem o mundo?',
    html: `<p>Na roda, as notícias só podem se arrastar de vizinho em vizinho: chegar ao lado oposto leva 50 apertos de mão, e duas pessoas estão, em média, a cerca de 25 de distância. Um atalho é uma ponte que atravessa o círculo. Todos que estão perto de uma ponta ficam de repente perto de todos que estão perto da outra, então uma única amizade nova encurta milhares de cadeias de uma vez.</p>
<div class="insight-visual">algumas ligações longas → quase toda cadeia fica mais curta → um mundo pequeno</div>
<h3>Unidos, e próximos</h3>
<p>Enquanto isso, quase nada muda perto de você. Na roda, metade dos pares de amigos seus são amigos entre si, e um punhado de atalhos mal mexe nisso. Um mundo pode ser aconchegante e local e ainda assim ser pequeno. Duncan Watts e Steven Strogatz chamaram isso de mundo pequeno em 1998, e o encontraram na rede de atores de cinema, numa rede elétrica e nos nervos de um verme minúsculo.</p>
<h3>Seis graus?</h3>
<p>Nos experimentos com cartas de Stanley Milgram, nos anos 1960, a maioria das cartas nunca chegou: num dos estudos, chegaram 64 de 296. As cadeias que chegaram levaram cerca de seis passos, e os “seis graus de separação” viraram folclore. Em 2016, o Facebook mediu uma média de 4,57 passos (3,57 pessoas no meio do caminho) entre os seus 1,59 bilhão de usuários: uma plataforma, não o mundo inteiro.</p>
<h3>O que este modelo deixa de fora</h3>
<p>Amizades de verdade não formam uma roda arrumadinha, e as pessoas têm números de amigos muito diferentes. Aqui, os atalhos são acrescentados por cima da roda (uma variante estudada por Mark Newman e Duncan Watts); no modelo original, algumas ligações existentes são deslocadas em vez disso. E nem toda cadeia curta pode ser encontrada: Jon Kleinberg mostrou que pessoas que conhecem só os próprios amigos encontram cadeias curtas apenas quando as ligações longas seguem um padrão especial.</p>
<details><summary>Os números, se você quiser</summary><p>Com 200 pessoas e 4 amigos cada uma (400 ligações), a distância média da roda é exatamente 5.050 / 199 ≈ 25,4, e o seu agrupamento (a fração dos pares de amigos de uma pessoa que também são amigos entre si) é 3(k − 2) / (4(k − 1)) = ½ para k = 4. Na média de 40 sorteios, a distância média é de cerca de 13,9 com 5 atalhos, 10,2 com 10, 7,5 com 20 e 5,0 com 60, enquanto o agrupamento fica em 0,49, 0,48, 0,46 e 0,40. Cada sorteio é diferente: com 5 atalhos, ela variou de cerca de 12 a 17.</p></details>
<div class="sources"><a class="source-link" href="https://www.nature.com/articles/30918" target="_blank" rel="noopener">Watts e Strogatz, <em>Nature</em> (1998, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Small-world_experiment" target="_blank" rel="noopener">Experimento do mundo pequeno (em inglês)</a><a class="source-link" href="https://research.facebook.com/blog/2016/2/three-and-a-half-degrees-of-separation/" target="_blank" rel="noopener">Facebook Research (2016, em inglês)</a>J. Travers e S. Milgram, <em>Sociometry</em> 32 (1969) · J. Kleinberg, <em>Nature</em> 406 (2000)</div>`,
  },
});
