/* Quem pede ganha · palavras para o visitante (pt). */
Wonderlattice.defineText('matching', 'pt', {
  eyebrow: 'PARES JUSTOS',
  name: 'Quem pede ganha',
  tagline:
    'Forme pares entre seis alunos e seis clubes de modo que ninguém queira trocar. Quem pede primeiro fica, sem alarde, com o melhor acordo.',
  title: 'Quem pede ganha.',
  subtitle:
    'Os alunos se candidatam aos clubes até todos os pares se acertarem. Depois, quem pede são os clubes: os mesmos desejos, outro emparelhamento justo, e a felicidade se inverte.',
  field: 'Teoria dos jogos · Emparelhamento estável · Desenho de mercados',
  sceneLabel: '6 alunos · 6 clubes',
  sceneNames: ['Desejos emaranhados', 'Um ranking comum', 'Desejos opostos'],
  shuffledName: 'Desejos embaralhados',
  tip: 'Toque num aluno e depois num clube para formar o par você mesmo · As setas miram, Enter escolhe',
  actionLabel: 'Trocar quem pede',
  canvasLabel:
    'Seis alunos à esquerda, como círculos coloridos numerados, e seis clubes à direita, como formas. Ao lado de cada um está a sua lista de desejos, do preferido para o menos querido. Linhas ligam os pares. Toque num aluno e depois num clube para formar o par você mesmo: uma linha vermelha marca dois que prefeririam ficar um com o outro.',
  panelEyebrow: 'Quem pede primeiro',
  whyLabel: 'Por que pedir primeiro ganha?',
  nudge:
    'Toque num aluno e depois num clube para formar pares à mão. Uma linha vermelha quer dizer que esses dois prefeririam largar tudo para ficar juntos. Você consegue achar um emparelhamento sem linhas vermelhas que nenhum dos dois jeitos de pedir dá?',
  connection: {
    html: '<strong>Escolher bem.</strong> Aqui, um aluno recusado simplesmente tenta o próximo clube. Em “Pare em 37%”, você precisa pegar ou largar cada carta de uma vez por todas.',
    label: 'Visitar “Pare em 37%”',
  },

  presets: [
    { name: 'Desejos emaranhados', note: 'Pedir primeiro decide quase tudo.' },
    { name: 'Um ranking comum', note: 'Todos os clubes classificam os alunos do mesmo jeito.' },
    { name: 'Desejos opostos', note: 'O favorito de cada aluno é quem menos gosta dele.' },
  ],

  speed: 'Velocidade',
  swap: 'Continuar trocando quem pede',
  marks: 'Marcar todos os parceiros estáveis',
  shuffle: 'Novos desejos',
  count: (n) =>
    n === 1
      ? 'Estes desejos permitem só 1 emparelhamento estável, então não faz diferença quem pede.'
      : `Estes desejos permitem ${n} emparelhamentos estáveis.`,

  // Drawn on the picture: keep them short.
  labels: {
    students: 'ALUNOS',
    clubs: 'CLUBES',
    studentsAsk: 'Alunos pedem',
    clubsAsk: 'Clubes pedem',
    yours: 'Seus pares',
  },
  // The scoreboard under the lists: how far down their lists each side got, on average.
  score: {
    title: 'ESCOLHA MÉDIA',
    first: '1ª',
    last: '6ª',
  },

  status: {
    // r: the round, from 1; k: applications on their way that round.
    round: (clubs, r, k) =>
      clubs
        ? `Rodada ${r} · ${k === 1 ? '1 clube pede' : `${k} clubes pedem`}`
        : `Rodada ${r} · ${k === 1 ? '1 aluno se candidata' : `${k} alunos se candidatam`}`,
    // firsts: how many on the asking side got their first choice.
    done: (clubs, firsts) =>
      clubs
        ? `Os clubes pediram: ${firsts} de 6 clubes ${firsts === 1 ? 'ficou' : 'ficaram'} com a primeira escolha`
        : `Os alunos pediram: ${firsts} de 6 alunos ${firsts === 1 ? 'ficou' : 'ficaram'} com a primeira escolha`,
    unstable: (k) =>
      k === 1 ? 'Seu emparelhamento: 1 par preferiria trocar' : `Seu emparelhamento: ${k} pares prefeririam trocar`,
    stable: 'Seu emparelhamento é estável: nenhum par preferiria trocar',
    stableNew: 'Estável, e nenhum dos dois jeitos de pedir chega a este',
  },

  guests: [
    {
      name: 'David Gale',
      note: 'Em 1962, Lloyd Shapley e eu mostramos que sempre dá para formar pares entre candidatos e faculdades de modo que não haja um candidato e uma faculdade que prefeririam, os dois, ficar juntos. Nosso método: candidate-se, segure a melhor oferta e não deixe ninguém dizer sim antes do fim.',
    },
    {
      name: 'Lloyd Shapley',
      note: 'Nosso artigo terminava apresentando a sua prova principal como um exemplo de matemática em inglês comum, sem símbolos e quase sem contas. Meio século depois, dividi o prêmio de economia em memória de Alfred Nobel com Al Roth, que pôs a ideia para funcionar.',
    },
    {
      name: 'Alvin Roth',
      note: 'Ele notou que os hospitais americanos vinham emparelhando médicos recém-formados com essencialmente este método desde o começo dos anos 1950, e depois ajudou a redesenhar esse emparelhamento e a escolha de escolas de Nova York e de Boston.',
    },
  ],

  insight: {
    title: 'Por que pedir primeiro ganha?',
    html: `<p>Um emparelhamento é <em>estável</em> quando não há um aluno e um clube que prefeririam, os dois, ficar juntos em vez de com os parceiros que têm. Um par assim simplesmente iria embora junto, então um emparelhamento instável não dura. Em 1962, David Gale e Lloyd Shapley mostraram que sempre existe um emparelhamento estável, por mais emaranhados que sejam os desejos, e deram um jeito simples de encontrar um.</p>
<div class="insight-visual">cada aluno sem par se candidata ao melhor clube que ainda não tentou · cada clube fica com a melhor oferta até agora e devolve as outras · repita até ninguém ser devolvido</div>
<h3>Por que ele é estável</h3>
<p>Pegue um aluno e um clube que não estão juntos no fim. Se o aluno prefere aquele clube, ele se candidatou lá antes de acabar mais abaixo na lista, e o clube o recusou por alguém de quem gostava mais. As ofertas de um clube só melhoram, então ele continua preferindo o parceiro final. Ninguém pode ir embora junto.</p>
<h3>Por que quem pede ganha</h3>
<p>Costuma haver vários emparelhamentos estáveis. Gale e Shapley provaram que o que este método encontra dá a cada aluno, ao mesmo tempo, o melhor parceiro que ele tem em qualquer emparelhamento estável. O motivo: nenhum aluno é recusado por um clube que poderia ser parceiro dele num emparelhamento estável. E esse mesmíssimo emparelhamento dá a cada clube o pior parceiro que ele tem em qualquer emparelhamento estável. Troque quem pede e os clubes ficam com o melhor, os alunos com o pior. Ative “Marcar todos os parceiros estáveis” para ver cada um cair no primeiro ou no último dos seus pontos.</p>
<p>Quando todos os clubes classificam os alunos do mesmo jeito, por exemplo por uma única prova, só existe um emparelhamento estável, e não importa quem pede. Pedir primeiro faz diferença quando os desejos entram em conflito.</p>
<h3>Dizer a verdade</h3>
<p>Quem pede não consegue se dar melhor escondendo os seus verdadeiros desejos; o lado que recebe os pedidos às vezes consegue, recusando uma oferta de que na verdade gosta, embora isso exija conhecer os desejos de todos os outros, e possa sair pela culatra.</p>
<h3>Onde é usado</h3>
<p>Os hospitais americanos já emparelhavam médicos recém-formados com essencialmente este método desde o começo dos anos 1950, anos antes do artigo, como Alvin Roth notou depois. No fim dos anos 1990, o emparelhamento dos médicos foi redesenhado para que os candidatos peçam, e métodos parecidos hoje distribuem alunos entre escolas em Nova York e em Boston. Em 2012, Shapley e Roth dividiram o prêmio de economia em memória de Alfred Nobel; Gale tinha morrido em 2008. Em estudos de grandes emparelhamentos reais, a escolha de quem pede mudou o resultado de pouquíssimas pessoas.</p>
<h3>O que este modelo deixa de fora</h3>
<p>Emparelhamentos reais dão várias vagas a um clube, permitem empates, deixam algumas pessoas entregarem uma lista incompleta e incluem casais que querem ficar na mesma cidade. Com casais, pode não existir nenhum emparelhamento estável. Sem dois lados, como ao formar duplas de colegas de quarto, também pode não existir; Robert Irving encontrou em 1985 um método que acha um sempre que ele existe. E “estável” não é “feliz”: só quer dizer que ninguém pode ir embora com alguém que também o queira.</p>
<details><summary>A matemática, se você quiser</summary><p>Aqui, a cada rodada, todos os que pedem e estão sem par se candidatam ao mesmo tempo. A ordem das candidaturas não muda o resultado. Com n de cada lado, o método de Gale e Shapley termina depois de no máximo n² − 2n + 2 rodadas, 26 para seis de cada, e no máximo n² − n + 1 candidaturas no total, 31. Com três de cada lado, um computador consegue experimentar todos os conjuntos de desejos possíveis: o pior leva exatamente 5 rodadas e 7 candidaturas. Os emparelhamentos estáveis se encaixam num reticulado, com o melhor para os alunos numa ponta e o melhor para os clubes na outra (o livro <em>Mariages stables</em>, de Donald Knuth, de 1976, explora isso). Para marcar todos os parceiros estáveis, esta sala experimenta todas as 720 maneiras de formar pares entre seis alunos e seis clubes.</p></details>
<div class="sources"><a class="source-link" href="https://www.nobelprize.org/prizes/economic-sciences/2012/popular-information/" target="_blank" rel="noopener">O Prêmio Nobel (2012), Stable matching: theory, evidence and practical design (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Gale%E2%80%93Shapley_algorithm" target="_blank" rel="noopener">O algoritmo de Gale–Shapley (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/National_Resident_Matching_Program" target="_blank" rel="noopener">O National Resident Matching Program (em inglês)</a><a class="source-link" href="https://doi.org/10.1257/000282805774670167" target="_blank" rel="noopener">Abdulkadiroğlu, Pathak e Roth (2005), The New York City high school match (em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Stable_roommates_problem" target="_blank" rel="noopener">O problema dos colegas de quarto estáveis (em inglês)</a><a class="source-link" href="https://doi.org/10.2307/2312726" target="_blank" rel="noopener">Gale e Shapley (1962), College admissions and the stability of marriage (em inglês)</a></div>`,
  },
});
