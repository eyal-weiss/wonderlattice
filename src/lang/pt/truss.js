/* O triângulo teimoso · palavras para o visitante (pt). */
Wonderlattice.defineText('truss', 'pt', {
  eyebrow: 'ESTRUTURAS',
  name: 'O triângulo teimoso',
  tagline:
    'Uma ponte de quadrados se dobra sob um caminhão de brinquedo. Ponha as barras certas e ela trava, e cada barra mostra a sua carga.',
  title: 'O triângulo teimoso.',
  subtitle:
    'Quadrados se dobram, triângulos não. Veja a ponte ceder, depois toque para tirar e pôr barras: barras azuis são comprimidas, barras vermelhas, esticadas.',
  field: 'Rigidez · A contagem de Maxwell · O teorema de Geiringer–Laman · Forças numa treliça',
  sceneLabel: 'Barras, pinos e um caminhão de brinquedo',
  sceneNames: {
    squares: 'Só quadrados',
    pratt: 'Uma treliça Pratt',
    howe: 'Uma treliça Howe',
    counted: 'Conta certa, mas bamba',
    own: 'Sua própria ponte',
    bracing: 'Travando os quadrados',
  },
  tip: 'Toque numa barra para tirá-la, ou numa linha tracejada para pôr uma · Arraste o caminhão · As setas miram, Enter muda',
  actionBrace: 'Travar cada quadrado',
  actionUnbrace: 'Tirar as diagonais',
  canvasLabel:
    'Uma ponte de barras e pinos sobre um vão, com um caminhão de brinquedo na pista. Toque numa barra para tirá-la ou numa linha tracejada para pôr uma, ou use as setas para mirar e Enter para mudar. Arraste o caminhão para movê-lo.',
  panelEyebrow: 'Barras e pinos',
  whyLabel: 'Por que os triângulos aguentam?',
  nudge:
    'Tire qualquer barra de uma ponte travada e veja-a se dobrar de novo. Depois dê a um quadrado uma segunda diagonal: a ponte fica mais firme?',
  connection: {
    html: '<strong>Comprimir e esticar.</strong> Uma treliça usa as duas coisas. As pedras de um arco só podem ser comprimidas, então o arco precisa ter a forma de uma corrente pendurada, de cabeça para baixo. Veja em “Pendure, vire, construa”.',
    label: 'Visitar “Pendure, vire, construa”',
  },

  presets: [
    { name: 'Só quadrados', note: 'Topo, base e verticais, sem diagonais.' },
    { name: 'Uma treliça Pratt', note: 'Uma diagonal em cada quadrado.' },
    { name: 'Conta certa, mas bamba', note: 'Barras suficientes, nos lugares errados.' },
  ],

  panels: 'Quadrados sobre o vão',
  panelsHint: 'Cada quadrado acrescenta dois nós, então a ponte precisa de mais quatro barras.',
  forces: 'Mostrar o que cada barra carrega',

  verdict: { rigid: 'RÍGIDA', floppy: 'BAMBA' },
  count: (joints, needed, bars) => `${joints} nós × 2 − 3 = ${needed} barras necessárias · ${bars} aqui`,
  reason: {
    short: (k) => (k === 1 ? 'falta uma barra' : `faltam ${k} barras`),
    spread: 'barras suficientes, mal postas',
    rigid: (spare) =>
      spare === 0 ? 'nenhuma barra sobrando' : spare === 1 ? 'uma barra sobrando' : `${spare} barras sobrando`,
  },
  times: (x) => `${x}×`,

  key: {
    squeezed: 'Comprimida',
    stretched: 'Esticada',
    nothing: 'Sem carga',
    spare: 'Sobrando',
  },

  primer: {
    title: 'POR QUE TRIÂNGULOS',
    square: 'O quadrado dobra',
    squareCount: '4 nós × 2 − 3 = 5 barras necessárias · tem 4',
    triangle: 'O triângulo aguenta',
    triangleCount: '3 nós × 2 − 3 = 3 barras necessárias · tem 3',
  },

  status: {
    rigid: (spare) =>
      spare === 0
        ? 'Rígida · nenhuma barra sobrando'
        : spare === 1
          ? 'Rígida · uma barra sobrando'
          : `Rígida · ${spare} barras sobrando`,
    short: (k) => (k === 1 ? 'Bamba · falta uma barra' : `Bamba · faltam ${k} barras`),
    spread: 'Bamba · barras mal distribuídas',
  },
  folded: 'A ponte se dobra.',
  locked: 'A ponte está rígida.',

  readout: {
    have: (bars, needed) => `${bars} barras, ${needed} necessárias`,
    count: (joints, ways, needed, bars) =>
      `${joints} nós podem se mover, cada um, de duas maneiras: ${ways} maneiras ao todo. Descontando 3, que só deslizam ou giram a ponte inteira, ela precisa de ${needed} barras. Ela tem ${bars}.`,
    short: (k) =>
      k === 1
        ? 'Falta uma barra, então a ponte ainda pode se dobrar de um jeito.'
        : `Faltam ${k} barras, então a ponte ainda pode se dobrar.`,
    spread:
      'Há barras suficientes, mas algumas se amontoam onde repetem umas às outras (a tracejada sobra), então outra parte fica com barras de menos e se dobra.',
    busiest: (x) => `A barra mais exigida carrega ${x} vezes o peso do caminhão.`,
    busiestSame: 'A barra mais exigida carrega tanto quanto o caminhão pesa.',
    nothing: (k) =>
      k === 0
        ? 'Toda barra carrega alguma coisa.'
        : k === 1
          ? 'Uma barra não carrega nada.'
          : `${k} barras não carregam nada.`,
    spare: (k) =>
      k === 1
        ? 'Uma barra sobra (tracejada): tire-a e a ponte continua de pé.'
        : `${k} barras sobram (tracejadas): a ponte não precisa delas para ficar de pé.`,
    ashore: 'O caminhão está em terra firme, então nenhuma barra carrega nada.',
  },

  guests: [
    {
      name: 'James Clerk Maxwell',
      note: 'Em 1864, eu contei. Cada nó de uma estrutura plana pode se mover de duas maneiras, e três dessas maneiras só deslizam ou giram a estrutura inteira. Então uma estrutura de j nós precisa de pelo menos 2j − 3 barras.',
    },
    {
      name: 'Hilda Geiringer',
      note: 'Em 1927, descobri exatamente quais estruturas planas são rígidas: nenhuma parte pode ter mais barras do que precisa. Gerard Laman encontrou a mesma regra de novo em 1970, e hoje ela leva os nossos dois nomes.',
    },
    {
      name: 'Squire Whipple',
      note: 'Em 1847, publiquei um livro que calculava a força em cada barra de uma treliça, em vez de adivinhar. As minhas pontes de ferro em arco atirantado atravessavam o Canal Erie.',
    },
  ],

  insight: {
    title: 'Por que os triângulos aguentam?',
    html: `<p>Uma barra mantém o seu comprimento, e um pino deixa as barras girarem. Três comprimentos fixam completamente a forma de um triângulo, então um triângulo de barras não consegue mudar de forma. Quatro comprimentos não fixam um quadrado: ele se inclina e vira um losango sem que nenhuma barra se curve ou estique. É por isso que as estruturas de pontes, guindastes e telhados são feitas de triângulos.</p>
<div class="insight-visual">nós × 2 − 3 = barras necessárias</div>
<h3>Contando as maneiras de se mover</h3>
<p>Numa parede plana, cada nó pode se mover em duas direções, então j nós têm 2j maneiras de se mover. Cada barra tira no máximo uma. Três maneiras sempre sobram, por mais barras que haja: até uma estrutura rígida pode deslizar para o lado, deslizar para cima e para baixo, e girar inteira. Aqui, o pino e o rolo sob a ponte tiram essas três. Então uma estrutura precisa de pelo menos 2j − 3 barras, uma contagem que James Clerk Maxwell deu em 1864. Uma ponte de quatro quadrados tem 10 nós, então precisa de 17 barras. Só com as barras de cima, de baixo e verticais, ela tem 13, então faltam quatro: uma diagonal por quadrado.</p>
<h3>Contar não basta</h3>
<p>Ponha 17 barras, com duas diagonais num quadrado e nenhuma no seguinte, e a ponte ainda se dobra. A segunda diagonal sobra: ela não segura nada que a primeira já não segure. Hilda Pollaczek-Geiringer encontrou a regra exata em 1927, e Gerard Laman a encontrou de novo em 1970. Uma estrutura com 2j − 3 barras é rígida exatamente quando nenhuma parte dela está amontoada: todo grupo de k nós tem no máximo 2k − 3 barras entre eles. A regra vale para nós em posição geral. Em posições especiais, como três nós numa linha reta, uma estrutura com as barras certas ainda pode ceder um pouco. Na grade de pinos desta ponte, toda escolha de barras se comporta exatamente como se comportaria em posição geral.</p>
<h3>O que cada barra carrega</h3>
<p>Quando a ponte está rígida, cada nó precisa se equilibrar: os empurrões e puxões das suas barras, e o peso do caminhão onde a pista se apoia nele, somam zero. Resolver todos esses equilíbrios juntos (o método dos nós) dá a força em cada barra. As barras azuis são comprimidas e as vermelhas são esticadas, e uma barra mais grossa carrega mais. Algumas barras não carregam nada enquanto o caminhão está num lugar, e carregam muito quando ele se move. E uma barra pode carregar mais do que o caminhão pesa: numa treliça Pratt de seis quadrados, com o caminhão no meio, o meio da parte de cima é comprimido com uma vez e meia o peso do caminhão.</p>
<p>Numa treliça Pratt, as diagonais se inclinam em direção ao meio e são esticadas, enquanto as verticais são comprimidas. Espelhe cada diagonal e você tem uma treliça Howe, em que as diagonais são comprimidas e as verticais, esticadas. Essa diferença importava para os construtores: uma barra longa comprimida pode flambar, envergando para o lado muito antes de ser esmagada, então as barras comprimidas precisam ser mais grossas. O projeto de William Howe, de 1840, comprimia diagonais de madeira e esticava tirantes de ferro. O projeto de Thomas e Caleb Pratt, de 1844, inverteu isso, e se adaptou bem às pontes quando o ferro e o aço tomaram o lugar da madeira. A treliça Warren, de 1848, usa um zigue-zague de diagonais, comprimidas e esticadas alternadamente.</p>
<h3>O que este modelo deixa de fora</h3>
<p>As barras daqui não pesam nada, os nós são pinos perfeitos, o peso do caminhão chega à ponte só pelos nós, através da pista, e toda barra é do mesmo aço. Pontes de verdade carregam o próprio peso, que costuma ser muito maior que o de qualquer caminhão. Os nós delas são rebitados, aparafusados ou soldados, o que os enrijece. As barras comprimidas delas flambam antes de quebrar. Onde uma ponte tem barras sobrando, a maneira como elas dividem a carga depende de quanto cada uma estica, e aqui todas são iguais. A dobra é uma caricatura: uma estrutura de verdade cairia mais rápido, e se quebraria. E triângulos não são o único jeito de ficar firme: estruturas com nós rígidos, cascas e estruturas de tensegridade também são firmes. Jogos de construir pontes, como o Poly Bridge, simulam pontes inteiras; esta sala fica na contagem e nas forças.</p>
<details><summary>A matemática, se você quiser</summary><p>Mover o nó a por u<sub>a</sub> e o nó b por u<sub>b</sub> mantém o comprimento da barra ab, em primeira ordem, quando (p<sub>a</sub> − p<sub>b</sub>) · (u<sub>a</sub> − u<sub>b</sub>) = 0. Uma equação dessas por barra forma a matriz de rigidez, com duas colunas por nó. Com mais três linhas para o pino e o rolo, a ponte é rígida exatamente quando a matriz tem posto completo, 2j. A sala também calcula o posto com os nós levemente embaralhados para uma posição geral, para distinguir uma estrutura de barras mal distribuídas de uma posição especial. Uma ponte bamba se dobra ao longo de um movimento que a matriz permite: a parte do empurrão do caminhão a que nenhuma barra resiste. As forças vêm do método da rigidez, com todas as barras iguais. Para uma ponte sem barras sobrando, isso dá exatamente as forças do método dos nós, seja qual for o material das barras. As forças foram conferidas com um programa independente para treliças Pratt e Howe de dois a seis quadrados, e o posto com a condição de Laman em 150 pequenas estruturas aleatórias.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Truss" target="_blank" rel="noopener">Treliça (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Laman_graph" target="_blank" rel="noopener">Grafo de Laman (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Structural_rigidity" target="_blank" rel="noopener">Rigidez estrutural (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Truss_bridge" target="_blank" rel="noopener">Ponte treliçada (Pratt, Howe e Warren, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Squire_Whipple" target="_blank" rel="noopener">Squire Whipple (em inglês)</a><a class="source-link" href="https://doi.org/10.1080/14786446408643668" target="_blank" rel="noopener">Maxwell (1864), On the calculation of the equilibrium and stiffness of frames (em inglês)</a><a class="source-link" href="https://doi.org/10.1002/zamm.19270070107" target="_blank" rel="noopener">Pollaczek-Geiringer (1927), Über die Gliederung ebener Fachwerke (em alemão)</a><a class="source-link" href="https://doi.org/10.1007/BF01534980" target="_blank" rel="noopener">Laman (1970), On graphs and rigidity of plane skeletal structures (em inglês)</a></div>`,
  },
});
