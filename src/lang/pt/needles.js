/* Agulhas que conhecem π · palavras para o visitante (pt). */
Wonderlattice.defineText('needles', 'pt', {
  eyebrow: 'PROBABILIDADE GEOMÉTRICA',
  name: 'Agulhas que conhecem π',
  tagline: 'Jogue agulhas num assoalho de tábuas e conte quantas caem atravessando uma linha. Dali sai π.',
  title: 'Agulhas que conhecem π.',
  subtitle:
    'Chovem agulhas sobre um assoalho de tábuas. Conte as que atravessam uma linha, e π aparece. Depois, entorte-as.',
  field: 'Probabilidade · A agulha de Buffon · O macarrão de Barbier',
  sceneLabel: 'Um assoalho de tábuas · Agulhas ao acaso',
  tip: 'As agulhas caem sozinhas · Escolha uma forma, ou repita um famoso resultado de sorte',
  actionLabel: 'Jogar de novo',
  canvasLabel:
    'Agulhas caindo ao acaso num assoalho de tábuas; as que caem atravessando uma linha entre tábuas brilham. Embaixo, um gráfico da estimativa de π à medida que as agulhas se acumulam.',
  panelEyebrow: 'Mude as agulhas',
  whyLabel: 'Por que π aparece?',
  nudge:
    'Experimente um anel da largura de uma tábua: ele cruza exatamente duas linhas, todas as vezes. Esse único fato é a chave de todo o enigma.',
  connection: {
    html: '<strong>Um anel da largura de uma tábua sempre cruza duas vezes.</strong> O mesmo vale para toda forma de largura constante, e é por isso que o contorno de cada uma mede π vezes a sua largura.',
    label: 'Rolar as formas de largura constante',
  },

  presets: [
    { name: 'Agulhas nas tábuas', note: 'Conte os cruzamentos: π aparece.', badge: 'π' },
    { name: 'Entorte-as', note: 'O mesmo comprimento, tantos cruzamentos quanto antes.', badge: '~' },
    { name: 'Um cientista sortudo', note: 'Repita um resultado bom demais para ser verdade.', badge: '1901' },
  ],

  shape: 'A forma',
  shapes: ['Agulha', 'Zigue-zague', 'Macarrão', 'Anel'],
  // What the picture shows, by shape (the last: Lazzarini's reruns).
  sceneNames: [
    'Agulhas retas',
    'Zigue-zagues',
    'Fios de macarrão',
    'Anéis da largura de uma tábua',
    'As agulhas de Lazzarini',
  ],
  length: 'Comprimento, como fração da largura de uma tábua',
  lucky: 'Repetir o experimento de Lazzarini, de 1901, com 3.408 agulhas por rodada',

  status: {
    raining: (needles) => `${needles} agulhas até agora`,
    done: (needles, pi) => `${needles} agulhas: π ≈ ${pi}`,
    rings: (rings) => `${rings} anéis, 2 cruzamentos cada`,
    reruns: (runs) => `${runs} ${runs === 1 ? 'rodada' : 'rodadas'} de 3.408 agulhas`,
  },

  readout: {
    guess: (pi) => `π ≈ ${pi}`,
    thrown: 'Agulhas jogadas',
    across: 'Caíram atravessando uma linha',
    off: 'Diferença',
    sameRule: 'Entortada ou reta: o mesmo comprimento cruza, em média, o mesmo número de linhas.',
    rule: 'π ≈ 2 × comprimento × agulhas ÷ cruzamentos, com comprimentos em tábuas.',
    ring: 'Cada anel cruza exatamente 2 linhas',
    rings: 'Anéis jogados',
    ringRule:
      'Um anel da largura de uma tábua tem π tábuas de contorno, então cada π tábuas de comprimento cruzam 2 linhas, entortadas ou retas.',
    typical: (miss) => `Erro típico: ${miss}`,
    reruns: 'Rodadas',
    exact: 'Exatamente 355/113, como Lazzarini',
    his: 'O erro de Lazzarini',
    luckyRule:
      'Metade das rodadas erra π por mais do que o erro típico. As agulhas e a contagem dele fazem de 355/113 uma resposta possível, e mesmo assim ela só aparece cerca de uma vez a cada 70 rodadas.',
  },

  // Words drawn in the picture: short.
  labels: {
    tally: (needles, across) => `${needles} agulhas · ${across} cruzam uma linha`,
    rings: (n) => `${n} anéis`,
    guess: (pi) => `π ≈ ${pi}`,
    ring: '2 cruzamentos, sempre',
    chart: 'O palpite, agulha a agulha',
    typical: 'erro típico',
    pi: 'π',
    count: 'Quantas linhas cada anel cruza',
    every: 'cada anel',
    run: (k) => `Rodada ${k}`,
    hits: (runs, exact) => `${runs} rodadas · ${exact} deram 355/113`,
    reruns: 'Cada ponto: uma rodada de 3.408 agulhas',
    his: 'Lazzarini, 1901',
  },

  announce: {
    done: (pi) => `Um milhão de agulhas: π ≈ ${pi}.`,
    ring: 'Cada anel cruza exatamente duas linhas.',
    lucky: (miss) => `Erro típico de uma rodada: ${miss}. O de Lazzarini: 0,0000003.`,
  },

  guests: [
    {
      name: 'Georges-Louis Leclerc, conde de Buffon',
      note: 'Perguntei com que frequência uma vareta, jogada num chão de tábuas estreitas, cai atravessando uma fresta entre elas. Propus a questão em 1733 e publiquei a resposta em 1777.',
    },
    {
      name: 'Joseph-Émile Barbier',
      note: 'Em 1860, percebi que a agulha pode ser entortada como se quiser: desde que o comprimento continue o mesmo, ela cruza as linhas, em média, com a mesma frequência.',
    },
  ],

  insight: {
    title: 'Por que π aparece?',
    html: `<p>Uma agulha do comprimento da largura de uma tábua cai atravessando uma linha com uma chance de 2/π, cerca de 64%. Então, depois de muitos lançamentos, cruzamentos ÷ agulhas ≈ 2/π, e π ≈ 2 × agulhas ÷ cruzamentos. Agulhas mais curtas cruzam menos vezes, em proporção ao seu comprimento. Georges-Louis Leclerc, conde de Buffon, propôs a questão em 1733 e publicou a resposta em 1777.</p>
<div class="insight-visual">chance de cruzar = 2 × comprimento ÷ (π × largura da tábua)</div>
<h3>Entorte a agulha</h3>
<p>Corte uma agulha em pedacinhos. Cada pedaço cruza linhas, em média, em proporção ao seu comprimento, esteja onde estiver na agulha, e as médias se somam mesmo quando os pedaços se movem juntos. Então qualquer forma cruza, em média, um número de linhas proporcional ao seu comprimento: entortada, reta ou enrolada. Joseph-Émile Barbier percebeu isso em 1860. Para achar a constante, pegue um anel exatamente da largura de uma tábua. Onde quer que caia, ele cruza exatamente duas linhas. O contorno dele mede π tábuas, então cada π tábuas de comprimento cruzam, em média, 2 linhas: 2 × comprimento ÷ π, a regra da agulha. O mesmo truque mostra que toda forma de largura constante, como o triângulo de Reuleaux, tem um contorno de π vezes a sua largura.</p>
<h3>O acaso mede devagar</h3>
<p>O palpite oscila menos à medida que as agulhas se acumulam, mas só como 1 ÷ √(número de agulhas): cada dígito correto a mais custa cerca de 100 vezes mais agulhas. Um milhão de agulhas costuma dar π com duas ou três casas decimais.</p>
<h3>O cientista sortudo</h3>
<p>Em 1901, Mario Lazzarini relatou 3.408 lançamentos de agulhas com 5/6 da largura de uma tábua. Isso dá π ≈ 355/113 = 3,1415929…, errado só na sétima casa decimal, quando um experimento desse tamanho costuma errar por alguns centésimos. As escolhas dele fazem de 355/113 uma das respostas possíveis: ela exige exatamente 1.808 cruzamentos, o que uma rodada honesta dá cerca de uma vez a cada 70. E quem lança em lotes de 213 e para na primeira vez que a contagem dá certo chega lá em até 3.408 lançamentos mais de uma vez em cada quatro. Lee Badger (1994) examinou os resultados que Lazzarini relatou pelo caminho, com menos lançamentos, e achou muito improvável que eles ficassem tão perto dos valores esperados ao longo de todo um experimento honesto. O jornalista de ciência holandês Hans van Maanen defende que o artigo nunca foi feito para ser levado muito a sério: os leitores dele, professores de escola, podiam ver que a máquina descrita por Lazzarini não funcionaria. De todo modo, um resultado bom demais é indício de outra coisa.</p>
<h3>O que esta sala simplifica</h3>
<p>Os números pseudoaleatórios do computador fazem as vezes de lançamentos de verdade. Eles escolhem a direção de cada agulha sem usar π: um ponto aleatório num quadrado, mantido só se cair dentro do círculo, dá a mesma chance a todas as direções. As linhas do assoalho continuam para sempre, então uma agulha perto da borda da imagem também conta. Agulhas de verdade quicam, rolam e caem umas sobre as outras, e tábuas de verdade nunca são perfeitamente regulares.</p>
<details><summary>A matemática, se você quiser</summary><p>As linhas estão a uma distância t umas das outras, e uma agulha de comprimento l ≤ t cai com o meio a uma distância x da linha mais próxima (uniforme entre 0 e t/2) e num ângulo θ com as linhas (uniforme entre 0 e π/2). Ela cruza quando x ≤ (l/2) sin θ, então P = (2/t)(2/π) ∫₀^{π/2} (l/2) sin θ dθ = 2l/(πt). Com n agulhas e c cruzamentos, π ≈ 2ln/(tc); o seu erro típico é π√((1 − p)/(pn)), com p = 2l/(πt): 0,04 para 3.408 agulhas do comprimento da largura de uma tábua, 0,05 para as de Lazzarini. A agulha de Lazzarini dá a estimativa (5/3) × n/c, e 355/113 = (5/3) × 3.408/1.808. Os testes da sala conferem, contra um programa separado: a taxa de cruzamento 2l/π para agulhas retas, zigue-zagues e macarrões; exatamente dois cruzamentos para cada anel; os erros típicos acima; e, para a montagem de Lazzarini, 1.808 cruzamentos com uma chance de 1,4%, e um erro mediano de 0,034. Buffon, “Essai d’arithmétique morale”, Histoire naturelle, Supplément 4 (1777). E. Barbier, J. Math. Pures Appl. (2) 5 (1860). L. Badger, “Lazzarini’s lucky approximation of π”, Mathematics Magazine 67 (1994).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_needle_problem" target="_blank" rel="noopener">O problema da agulha de Buffon (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Buffon%27s_noodle" target="_blank" rel="noopener">O macarrão de Buffon (Wikipedia, em inglês)</a><a class="source-link" href="https://mathworld.wolfram.com/BuffonsNeedleProblem.html" target="_blank" rel="noopener">O problema da agulha de Buffon (MathWorld, em inglês)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Buffon/" target="_blank" rel="noopener">Buffon (MacTutor, em inglês)</a></div>`,
  },
});
