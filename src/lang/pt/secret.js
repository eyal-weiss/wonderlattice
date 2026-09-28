Wonderlattice.defineText('secret', 'pt', {
  eyebrow: 'TEORIA DOS NÚMEROS',
  name: 'Um segredo gritado pela sala',
  tagline: 'Duas pessoas combinam um segredo enquanto todos escutam, e quem escuta continua sem descobrir.',
  title: 'Um segredo gritado pela sala.',
  subtitle: 'Alice e Bob só podem conversar em público. Mesmo assim, conseguem ficar com um segredo em comum?',
  field: 'Teoria dos números · Criptografia · Uma pequena surpresa',
  sceneLabel: 'Dois amigos · Uma bisbilhoteira · Tudo dito em voz alta',
  sceneName: 'Combinar uma chave em público',
  tip: 'Toque em “Próximo passo” para acompanhar a troca · Escolha tinta ou aritmética do relógio no painel',
  actionLabel: 'Próximo passo',
  canvasLabel: 'Alice à esquerda e Bob à direita, e no meio tudo o que eles dizem em voz alta, onde Eve escuta.',
  panelEyebrow: 'Escolha os segredos',
  whyLabel: 'Por que Eve não consegue descobrir?',
  nudge:
    'Acompanhe os três passos com tinta, depois mude para a aritmética do relógio e experimente um relógio maior. Veja quanto tempo Eve precisa.',
  connection: {
    html: '<strong>Proteger uma mensagem do ruído é um problema; mantê-la em segredo é outro.</strong> Em Mande uma imagem através de uma tempestade, bits a mais consertam o que o ruído estraga.',
    label: 'Mandar uma imagem',
  },

  presets: [
    { name: 'Misturar tinta', note: 'Misturar é fácil. Separar, não.', badge: '●' },
    { name: 'Um relógio de 23', note: 'O mesmo truque com números.', badge: '23' },
    { name: 'Um relógio maior', note: 'Eve precisa tentar muito mais.', badge: '9973' },
  ],

  people: { alice: 'Alice', bob: 'Bob', eve: 'Eve' },
  modes: ['Tinta', 'Aritmética do relógio'],
  modeLabel: 'Mostrar com',
  paintLabel: (name) => `Cor secreta de ${name}`,
  colours: ['Vermelho', 'Azul', 'Verde', 'Laranja', 'Violeta', 'Rosa'],
  pickColour: (name, colour) => `Cor secreta de ${name}: ${colour}`,
  clockLabel: 'Tamanho do relógio',
  clockOption: (p) => `${p.toLocaleString(Wonderlattice.lang)} horas`,
  secretLabel: (name) => `Número secreto de ${name}`,
  secretHint: 'Só quem escolhe sabe.',

  labels: {
    public: 'Todos ouvem',
    secret: 'Segredo',
    shared: 'Cor comum',
    sends: 'Envia',
    heard: (name) => `Mistura de ${name}`,
    same: 'Iguais!',
    eve: 'A melhor tentativa de Eve',
    clock: (p) => `Um relógio de ${p.toLocaleString(Wonderlattice.lang)} horas`,
    start: (g) => `Início: ${g}`,
    shouts: 'Grita',
    key: 'Chave',
    hops: (k) => `${k.toLocaleString(Wonderlattice.lang)} saltos`,
    eveTrying: (k, total) =>
      `Eve tenta 1, 2, 3, …: ${k.toLocaleString(Wonderlattice.lang)} de até ${total.toLocaleString(Wonderlattice.lang)}`,
    eveFound: (k) => `Eve achou o segredo de Alice depois de ${k.toLocaleString(Wonderlattice.lang)} tentativas`,
  },

  steps: {
    paint: [
      'Todos veem o amarelo. Alice e Bob guardam, cada um, uma cor secreta.',
      'Passo 1 de 3: cada um mistura o seu segredo ao amarelo.',
      'Passo 2 de 3: eles trocam as misturas, à vista de todos.',
      'Passo 3 de 3: cada um acrescenta de novo o próprio segredo. A mesma cor dos dois lados!',
    ],
    clock: [
      (p, g) => `Todos conhecem o relógio (${p}) e o início (${g}). Alice e Bob guardam, cada um, um número secreto.`,
      'Passo 1 de 3: cada um salta pelo relógio, multiplicando pelo início, tantas vezes quanto o seu segredo.',
      'Passo 2 de 3: eles gritam onde pararam.',
      'Passo 3 de 3: cada um salta de novo a partir do que ouviu. O mesmo número dos dois lados!',
    ],
  },

  readout: {
    hears: 'Todos ouvem',
    keeps: (name) => `${name} guarda`,
    result: 'O resultado',
    nothingYet: 'Ninguém disse nada ainda.',
    paintHeard: 'O amarelo e as duas misturas.',
    paintResult: 'Alice e Bob têm a mesma cor. Se Eve misturar as duas misturas, fica amarelo demais.',
    clockHeard: (p, g, A, B) => `O relógio (${p}), o início (${g}) e os dois gritos: ${A} e ${B}.`,
    clockResult: (key) =>
      `As duas chaves são ${key}. Eve ouviu tudo, mas para chegar à chave precisa achar um número secreto na tentativa.`,
    notYet: 'Ainda não.',
  },

  announce: {
    same: 'Agora Alice e Bob têm o mesmo segredo. Eve, não.',
    found: (k) => `Eve achou o segredo de Alice depois de ${k} tentativas.`,
  },

  guests: [
    {
      name: 'Pierre de Fermat',
      note: 'Num relógio com um número primo p de horas, eleve qualquer hora à potência p e ela volta a si mesma.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Estendi a regra de Fermat a relógios de qualquer tamanho. Dois séculos depois, uma aritmética assim protege segredos.',
    },
  ],

  insight: {
    title: 'Por que Eve não consegue descobrir?',
    html: `<p>Tudo o que Alice e Bob dizem, Eve ouve. O truque é um passo fácil de dar e muito difícil de desfazer. Com tinta, misturar é fácil, e tirar uma cor de dentro de uma mistura é praticamente impossível. Cada amigo acrescenta um segredo duas vezes, uma antes de enviar e outra depois de receber, então os dois terminam com as mesmas três tintas no pote. Eve só vê misturas com um segredo cada, e se juntar as duas fica com cor comum demais.</p>
<div class="insight-visual">comum + segredo de Alice + segredo de Bob, misturados em qualquer ordem</div>
<h3>O mesmo truque com números</h3>
<p>Num relógio de p horas, “multiplicar pelo início g de novo e de novo” é fácil: Alice faz isso a vezes (o segredo dela) e grita onde parou, A. Bob faz isso b vezes e grita B. Depois Alice salta a vezes a partir do B de Bob, e Bob salta b vezes a partir do A de Alice. Os dois param na mesma hora, porque os dois multiplicaram a × b vezes no total.</p>
<p>Eve conhece o relógio, o início, A e B. Para chegar à chave, ela precisa de a ou de b: quantos saltos levam do início até A. Ninguém conhece um jeito rápido de contá-los num relógio grande bem escolhido. Aqui ela só pode tentar 1, 2, 3, …, e num relógio maior isso demora muito mais.</p>
<h3>O que esta sala deixa de fora</h3>
<p>A tinta é uma analogia, e estes relógios são minúsculos. Sistemas reais usam números com centenas de algarismos (ou um parente desta ideia em curvas), onde até os métodos mais engenhosos conhecidos são lentos demais. Eles também precisam verificar com quem estão falando: este truque sozinho não impede que alguém no meio se passe por Bob. Esta sala mostra a ideia, não como proteger alguma coisa.</p>
<details><summary>A matemática, se você quiser</summary><p>Com um primo p e um início g cujas potências alcançam todas as horas 1 … p − 1 (uma raiz primitiva), Alice envia A = g<sup>a</sup> mod p e Bob envia B = g<sup>b</sup> mod p. Então B<sup>a</sup> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> = (g<sup>a</sup>)<sup>b</sup> = A<sup>b</sup> mod p. Achar a a partir de g<sup>a</sup> mod p é o problema do logaritmo discreto. Whitfield Diffie e Martin Hellman publicaram essa troca em 1976; pesquisadores da agência de inteligência britânica GCHQ tinham chegado a ela um pouco antes, mas isso ficou em segredo até 1997. Simon Singh conta a história em <em>O livro dos códigos</em> (1999).</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" target="_blank" rel="noopener">Troca de chaves de Diffie–Hellman (em inglês)</a><a class="source-link" href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener">Diffie e Hellman, “New directions in cryptography” (1976) (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_logarithm" target="_blank" rel="noopener">Logaritmo discreto (em inglês)</a></div>`,
  },
});
