/* A escada do som · palavras para o visitante (pt). */
Wonderlattice.defineText('stairs', 'pt', {
  eyebrow: 'SOM · ILUSÃO',
  name: 'A escada do som',
  tagline: 'Uma escala que sobe degrau após degrau, e nunca fica mais aguda.',
  title: 'A escada do som.',
  subtitle:
    'Uma escala sobe degrau após degrau, mas doze degraus depois está de volta onde começou. Ligue o som para ouvi-la; a imagem mostra o truque.',
  field: 'Som · Oitavas · Percepção',
  sceneLabel: 'Oito tons, a uma oitava um do outro',
  sceneNames: ['Uma escala que sobe para sempre', 'Um glissando que sobe para sempre', 'O truque, desfeito'],
  tip: 'Melhor ouvir baixinho, ou com fones de ouvido · Cada ponto brilhante é um tom, e todos soam ao mesmo tempo',
  canvasLabel:
    'Uma espiral de alturas sonoras, uma volta por oitava, com um ponto brilhante em cada volta: os tons que soam juntos, mais brilhantes no meio. Vista de cima, a espiral é um círculo de doze notas. Ao lado, os mesmos tons como barras sob uma curva de volume fixa.',
  panelEyebrow: 'Ouça e veja',
  whyLabel: 'Por que ela nunca fica mais aguda?',
  nudge:
    'Ligue o som e depois estreite a curva de volume para uma oitava: o truque se desfaz, e você ouve a queda de volta para baixo.',
  connection: {
    html: '<strong>Uma oitava é o dobro.</strong> Cada tom aqui tem o dobro da frequência do tom abaixo dele. Em “Ouça a forma”, dois tons em razões simples se somam em batimentos e laços.',
    label: 'Ouvir dois tons juntos',
  },

  presets: [
    { name: 'A escada sem fim', note: 'Doze degraus acima, de volta ao início.' },
    { name: 'O glissando sem fim', note: 'A versão deslizante de Risset.' },
    { name: 'Tirar o truque', note: 'Um tom de cada vez: ouça a queda.' },
  ],

  soundOff: 'Ligar o som',
  soundOn: 'Som ligado · silenciar',
  noSound: 'O som não está disponível neste navegador. Você ainda pode ver como o truque funciona.',

  how: 'Como ela sobe',
  modes: ['Degraus', 'Deslizando'],
  bell: 'Largura da curva de volume, em oitavas',
  bellHint: 'Com uma oitava, só um tom soa de cada vez.',
  speed: 'Degraus por segundo',
  volume: 'Volume',

  // Note names round the circle, from C. Write them the way your language names notes.
  notes: ['Dó', 'Dó♯', 'Ré', 'Ré♯', 'Mi', 'Fá', 'Fá♯', 'Sol', 'Sol♯', 'Lá', 'Lá♯', 'Si'],

  pair: {
    title: 'Sobe ou desce?',
    text: 'Duas notas, a exatamente meia oitava uma da outra. A segunda sobe ou desce? Não há resposta certa.',
    play: 'Tocar duas notas',
    again: 'Tocar outro par',
    up: 'Sobe',
    down: 'Desce',
    answer: (up, a, b) =>
      up
        ? `Para você, de ${a} para ${b} subiu. Outras pessoas ouvem esse mesmíssimo par descer: no círculo, as duas notas ficam em lados opostos, então subir e descer ficam à mesma distância.`
        : `Para você, de ${a} para ${b} desceu. Outras pessoas ouvem esse mesmíssimo par subir: no círculo, as duas notas ficam em lados opostos, então subir e descer ficam à mesma distância.`,
  },

  status: {
    steps: (n, same) =>
      n < 12
        ? `${n} ${n === 1 ? 'degrau' : 'degraus'} acima`
        : `${n} degraus acima · o mesmo som ${same === 0 ? 'do início' : `do degrau ${same}`}`,
    glide: (laps) =>
      laps === 0
        ? 'Subindo suavemente'
        : `Subindo suavemente · de volta ao começo ${laps === 1 ? 'uma vez' : `${laps} vezes`}`,
    pair: (a, b) => `${a}, depois ${b}: sobe ou desce?`,
  },

  labels: {
    higher: 'mais agudo',
    turn: 'uma volta = uma oitava',
    above: 'Visto de cima',
    tones: 'Os tons que você ouve',
    curve: 'volume',
    pitch: 'altura',
    drop: 'uma oitava abaixo',
    up: 'sobe?',
    down: 'desce?',
  },

  guests: [
    {
      name: 'Roger Shepard',
      note: 'Nos Bell Labs, nos anos 1960, criei uma escala que sobe para sempre. Doze degraus acima, e você está de volta ao início.',
    },
    {
      name: 'Jean-Claude Risset',
      note: 'Fundi os degraus num só deslizar: um som que sobe sem fim, e nunca chega.',
    },
    {
      name: 'Diana Deutsch',
      note: 'A psicóloga descobriu que duas notas a meia oitava uma da outra sobem para alguns ouvintes e descem para outros.',
    },
  ],

  insight: {
    title: 'Por que ela nunca fica mais aguda?',
    html: `<p>Cada nota aqui não é um tom, mas oito, a uma oitava um do outro: um Dó grave, o Dó acima dele, e assim por diante até um Dó agudo, todos soando ao mesmo tempo. Uma curva fixa define o volume de cada um. Os do meio soam forte; os mais graves e os mais agudos somem até o silêncio.</p>
<p>Cada degrau sobe os oito em um semitom. Depois de doze degraus, cada tom dobrou de frequência, então cada um está exatamente onde o de cima começou. O tom mais agudo sumiu aos poucos lá em cima, um novo surgiu aos poucos lá embaixo, e o som é exatamente aquele com que você começou. O seu ouvido acompanha a subida degrau por degrau e não percebe a troca.</p>
<div class="insight-visual">Degrau 0: Dó1 Dó2 Dó3 Dó4 Dó5 Dó6 Dó7 Dó8 · Degrau 12: Dó2 Dó3 Dó4 Dó5 Dó6 Dó7 Dó8 Dó9 · Dó1 e Dó9 estão em silêncio, então os dois soam iguais</div>
<h3>Os dois lados de uma nota</h3>
<p>Uma nota tem uma altura (quão aguda ela é) e um croma (qual das doze notas ela é: Dó, Ré, Mi…). Imagine as duas coisas como uma espiral: subir é a altura, dar a volta é o croma, e cada volta é uma oitava. Vista de cima, a espiral é um círculo. Este som mantém o dar a volta e esconde o subir.</p>
<h3>Tire o truque</h3>
<p>Estreite a curva de volume para uma oitava e só um tom soa de cada vez. Ele sobe por doze degraus, some aos poucos, e um tom uma oitava abaixo assume: a queda que a curva larga esconde.</p>
<h3>Sobe ou desce?</h3>
<p>Duas notas a meia oitava uma da outra ficam em lados opostos do círculo, então nenhum dos dois caminhos é mais curto. Em 1986, Diana Deutsch descobriu que os ouvintes discordam sobre esses pares, e que cada ouvinte ouve alguns pares subindo e outros descendo. O jeito como as pessoas os ouvem foi associado à fala com que elas cresceram: nos estudos dela, ouvintes do sul da Inglaterra e da Califórnia tendiam a ouvi-los de maneiras opostas. Ninguém está errado.</p>
<h3>Onde você pode já ter ouvido isso</h3>
<p>Jean-Claude Risset fez uma versão que desliza em vez de subir em degraus. Tons de Shepard criam tensão na música do filme <em>Dunkirk</em> (2017), de Christopher Nolan, e uma versão toca na escada sem fim do videogame <em>Super Mario 64</em> (1996). A mesma ideia em forma de imagem é a escada impossível que Lionel e Roger Penrose publicaram em 1958 (Oscar Reutersvärd tinha desenhado uma em 1937), e que M. C. Escher usou em <em>Ascending and Descending</em> (1960).</p>
<h3>O que esta sala simplifica</h3>
<p>O “para sempre” mora no ouvido, não no som, que se repete exatamente a cada doze degraus. Nem todo mundo ouve a ilusão com a mesma força, e alto-falantes pequenos não conseguem tocar os tons mais graves, embora a curva os deixe baixinhos de qualquer jeito. Shepard usou uma curva desse tipo, um cosseno elevado, e observou que quase qualquer curva suave que some nas duas pontas serviria.</p>
<details><summary>A matemática, se você quiser</summary><p>No degrau n, o tom j (j = 0 … 7) tem frequência 32,7 Hz × 2<sup>x</sup>, com x = (j + n/12) mod 8, e volume L(x) = ½(1 − cos(2πx/8)): 0 em x = 0 e x = 8, e 1 em x = 4 (Dó5, cerca de 523 Hz). Doze degraus somam 1 a cada x, mod 8, o que dá o mesmo conjunto de tons. Os volumes sempre somam 4, então a intensidade do som nunca muda. R. N. Shepard, “Circularity in judgments of relative pitch”, Journal of the Acoustical Society of America 36 (1964) 2346–2353. D. Deutsch, “A musical paradox”, Music Perception 3 (1986) 275–280.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Shepard_tone" target="_blank" rel="noopener">Tom de Shepard (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Tritone_paradox" target="_blank" rel="noopener">Paradoxo do trítono (Wikipedia, em inglês)</a><a class="source-link" href="https://deutsch.ucsd.edu/psychology/pages.php?i=206" target="_blank" rel="noopener">Diana Deutsch sobre o paradoxo do trítono (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Penrose_stairs" target="_blank" rel="noopener">Escada de Penrose (Wikipedia, em inglês)</a></div>`,
  },
});
