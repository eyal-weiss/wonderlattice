/* O chuveiro que nunca sossega · palavras para o visitante (pt). */
Wonderlattice.defineText('shower', 'pt', {
  eyebrow: 'REALIMENTAÇÃO',
  name: 'O chuveiro que nunca sossega',
  tagline: 'Frio demais, quente demais, frio demais… e quanto mais você tenta, pior fica.',
  title: 'O chuveiro que nunca sossega.',
  subtitle:
    'A água demora um pouco para subir pelo cano. O banhista afobado vai do gelado ao escaldante e volta; o paciente sossega. Mude o cano, ou pegue você mesmo a torneira.',
  field: 'Realimentação · Atraso · Uma fronteira nítida em π/2',
  sceneLabel: 'O ponto certo é 38\u00a0°C · A torneira vai de 10\u00a0°C a 55\u00a0°C',
  sceneNames: ['Dois banhistas, um cano', 'Um banhista', 'Sua mão na torneira'],
  tip: 'O cano tem a cor da água dentro dele · ← → na imagem mudam o cano · Em “Sua mão”, arraste pela imagem ou aperte ← → para girar a torneira',
  soundOff: 'Ligar o som',
  soundOn: 'Som ligado · silenciar',
  noSound: 'O som não está disponível neste navegador. Você ainda pode observar os banhistas.',
  canvasLabel:
    'Dois banhistas de desenho animado estão debaixo de chuveiros. Cada um gira uma torneira na parede, e a água sobe por um cano comprido até o chuveiro, colorida do azul, para frio, ao vermelho, para quente, então cada banhista só sente um giro da torneira um pouco depois. Embaixo, um gráfico mostra a temperatura que cada banhista sente nos últimos 30 segundos, com uma faixa para o ponto certo. No início, o banhista afobado vai do gelado ao escaldante e volta, para sempre, enquanto o paciente sossega em 38\u00a0°C. Ao lado, um mapa mostra quais combinações de impaciência e comprimento do cano sossegam.',
  panelEyebrow: 'Quem está na torneira?',
  whyLabel: 'Por que a paciência vence?',
  nudge:
    'Observe o banhista dourado: cada giro da torneira chega atrasado, então ele sempre exagera. Encurte o cano, e o afobado sossega primeiro. Depois experimente “Um banhista” e ache a impaciência em que o vaivém começa.',
  connection: {
    html: '<strong>Reagir ao que se vê.</strong> Aqui, um banhista que reage a notícias velhas vai e volta para sempre. Em “Vaga-lumes que entram no ritmo”, cada vaga-lume ajusta o próprio relógio quando vê um clarão, e o enxame inteiro entra no compasso.',
    label: 'Ver os vaga-lumes',
  },

  presets: [
    { name: 'Nenhuma oscilação', note: 'Suave o bastante para nunca passar do ponto.', badge: '1/e' },
    { name: 'No fio da navalha', note: 'O vaivém nunca cresce nem diminui.', badge: 'π/2' },
    { name: 'Um cano curto', note: 'Agora o banhista afobado vence.', badge: '½ s' },
  ],

  modeLabel: 'Quem está na torneira?',
  // By mode number: the two bathers side by side, one bather, the visitor.
  modes: ['Dois banhistas', 'Um banhista', 'Sua mão'],
  // Drawn under each shower: the eager and patient bathers, the one bather, and the visitor.
  bathers: ['Afobado', 'Paciente', 'Banhista', 'Você'],

  pipe: 'Comprimento do cano',
  pipeHint: 'Os segundos que a água leva da torneira até o chuveiro.',
  seconds: ' s',
  impatience: 'Impaciência',
  impatienceHint: 'Com que rapidez o banhista gira a torneira para cada grau que a água está fora do ponto.',
  hand: 'Sua torneira',
  handHint: 'Mire em 38\u00a0°C. A água que você sente saiu da torneira há um instante.',
  cold: 'frio',
  hot: 'quente',
  handValue: (percent) => `${percent}% do caminho até o quente`,

  readout: {
    product: 'Impaciência × cano',
    sum: (k, d, kd) => `${k} × ${d}\u00a0s = ${kd}`,
    verdicts: ['Sossega sem passar do ponto', 'Oscila, depois sossega', 'Nunca sossega'],
    smooth: 'A água sobe devagarinho até 38\u00a0°C e fica ali.',
    fades: (share, period) => `Cada oscilação tem ${share} do tamanho da anterior, uma a cada ${period}\u00a0s.`,
    edge: (period) =>
      `Bem em cima da linha: o vaivém mantém o tamanho, um a cada ${period}\u00a0s, quatro vezes o cano.`,
    grows: (ratio, period) =>
      `Cada vaivém é ${ratio} vezes o anterior, um a cada ${period}\u00a0s, até a torneira chegar ao extremo.`,
    limit: (d, limit) => `Com um cano de ${d}\u00a0s, qualquer impaciência abaixo de ${limit} sossega: é π/2 ÷ ${d}.`,
    hands: (d) => `A água que você sente saiu da torneira há ${d}\u00a0s. Tente mantê-la em 38\u00a0°C.`,
  },

  status: (text, seconds) => `${text} segundo${seconds === 1 ? '' : 's'}`,
  // By mode: the water felt right now, beside the picture.
  now: [
    (eager, patient) => `Agora o banhista afobado sente ${eager}, e o paciente, ${patient}.`,
    (water) => `Agora o banhista sente ${water}.`,
    (water) => `Agora você sente ${water}.`,
  ],
  // A no-break space, so a temperature never splits across two lines.
  degrees: (value) => `${value}\u00a0°C`,
  announce: {
    race: (eager, patient) =>
      `Depois de 15 segundos, o banhista afobado sente ${eager} e continua no vaivém; o paciente sente ${patient}.`,
    one: (water, verdict) => `Depois de 15 segundos, a água está em ${water}. ${verdict}.`,
  },

  // Words drawn on the picture.
  labels: {
    seconds: 'segundos',
    justRight: 'no ponto',
    tap: 'torneira',
    // A bather's name and the temperature they feel; languages may reorder them.
    tag: (name, value) => `${name} ${value}`,
    mapTitle: 'Quem sossega?',
    mapX: 'cano, segundos',
    mapY: 'impaciência',
    regions: ['sem oscilar', 'oscila, depois sossega', 'nunca sossega'],
    safe: (limit) => `sossega abaixo de ${limit}`,
    drag: 'Arraste pela imagem para girar a torneira',
    onYou: 'Na sua pele',
    inPipe: 'A caminho',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'Em 1868, o artigo dele “On Governors” usou a matemática para perguntar quando uma máquina que se corrige sozinha vai sossegar, e quando as correções dela vão num vaivém cada vez maior.',
    },
    {
      name: 'Nicolas Minorsky',
      note: 'Ele observou timoneiros guiando pelo erro, por quanto tempo ele durava e pela rapidez com que mudava, e em 1922 transformou isso numa regra para pilotar navios automaticamente.',
    },
  ],

  insight: {
    title: 'Por que a paciência vence?',
    html: `<p>O banhista reage à água que sente, mas essa água saiu da torneira há um instante. Ele gira a torneira para o quente e nada muda ainda, então gira mais. Quando a água quente chega, a torneira já está quente demais, e o mesmo acontece na volta. O banhista afobado está sempre corrigindo um erro que já está a caminho de ser consertado.</p>
<div class="insight-visual">Impaciência × cano abaixo de 1/e ≈ 0,37: nenhuma oscilação · abaixo de π/2 ≈ 1,57: oscilações que somem · acima de π/2: um vaivém que nunca acaba</div>
<h3>Só o produto importa</h3>
<p>Digamos que o banhista gire a torneira <em>k</em> graus por segundo para cada grau que a água está fora do ponto, e que a água leve <em>d</em> segundos para chegar. Se o chuveiro sossega ou não depende só de <em>k</em> × <em>d</em>. Por isso, um cano mais comprido pede uma mão mais leve: a maior impaciência que ainda sossega é π/2 ÷ <em>d</em>. Com um cano de dois segundos, o 0,3 × 2 = 0,6 do banhista paciente sossega, e o 0,9 × 2 = 1,8 do afobado nunca sossega. Encurte o cano para meio segundo, e o afobado sossega primeiro, em menos de dois segundos.</p>
<h3>Bem em cima da linha</h3>
<p>Com exatamente <em>k</em> × <em>d</em> = π/2, o vaivém nem cresce nem diminui, e um vaivém inteiro leva quatro vezes o tempo que a água leva para chegar. O mesmo limite aparece sempre que alguém age com base em notícias velhas, como um termostato cujo aquecedor demora a esquentar, ou um timoneiro guiando um navio grande. Uma solução clássica é prever: o preditor de Smith (O. J. M. Smith, 1957) usa um modelo do atraso para calcular o que já está a caminho. Você pode tentar isso aqui. Em “Sua mão”, olhe para a cor no cano, e não para a água no banhista.</p>
<h3>O que isto deixa de fora</h3>
<p>Pessoas de verdade não reagem de um jeito tão regular, e misturadores de verdade não mudam a temperatura por igual enquanto giram. Aqui a água sobe pelo cano como um bloco só, sem se misturar nem esfriar. Além de π/2, as oscilações da equação crescem sem parar; os extremos da torneira, 10\u00a0°C e 55\u00a0°C, transformam esse crescimento num vaivém constante entre eles, então o tamanho do vaivém que você vê vem dos extremos, não da equação. Muitos sistemas de aquecimento de casa simplesmente ligam e desligam, o que esta sala não mostra.</p>
<details><summary>A matemática, se você quiser</summary><p>Seja <em>e</em>(<em>t</em>) o quanto a torneira está longe do ponto certo. A água sentida no instante <em>t</em> saiu da torneira em <em>t</em> − <em>d</em>, então o banhista gira a torneira à taxa <em>e</em>′(<em>t</em>) = −<em>k</em>·<em>e</em>(<em>t</em> − <em>d</em>): uma equação diferencial com atraso, que Chris Budd chama de equação do chuveiro. Tentar <em>e</em> = e<sup><em>λt</em></sup> dá <em>λ</em> = −<em>k</em>·e<sup>−<em>λd</em></sup>, então <em>λd</em> = W(−<em>kd</em>), onde W é a função W de Lambert. A raiz que mais importa vem do ramo principal de W. Ela é real para <em>kd</em> ≤ 1/e, então a água nunca passa do ponto. Além disso, ela é complexa, o que significa oscilações, e a parte real dela fica positiva em <em>kd</em> = π/2, onde W(−π/2) = <em>i</em>π/2: um vaivém de período 4<em>d</em>. A sala avança a equação 60 vezes por segundo, com os extremos da torneira; os números do painel vêm de W.</p></details>
<div class="sources"><a class="source-link" href="https://plus.maths.org/content/shower-equation" target="_blank" rel="noopener">C. Budd, “The shower equation”, Plus Magazine (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Delay_differential_equation" target="_blank" rel="noopener">Equação diferencial com atraso (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lambert_W_function" target="_blank" rel="noopener">Função W de Lambert (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Smith_predictor" target="_blank" rel="noopener">Preditor de Smith (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/PID_controller#History" target="_blank" rel="noopener">Controlador PID: história, com Maxwell e Minorsky (em inglês)</a></div>`,
  },
});
