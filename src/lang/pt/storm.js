Wonderlattice.defineText('storm', 'pt', {
  eyebrow: 'CORREÇÃO DE ERROS',
  name: 'Uma imagem no meio da tempestade',
  tagline: 'Alguns bits extras bem pensados deixam uma imagem se consertar sozinha.',
  title: 'Uma imagem no meio da tempestade.',
  subtitle:
    'Desenhe uma imagenzinha e mande-a por uma tempestade que inverte alguns dos pontos dela. Acrescente alguns bits de verificação e veja-a chegar inteira.',
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
