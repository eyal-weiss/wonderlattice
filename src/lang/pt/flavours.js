/* A máquina que descobriu os sabores · palavras para o visitante (pt). */
Wonderlattice.defineText('flavours', 'pt', {
  eyebrow: 'RECOMENDAÇÕES',
  name: 'A máquina que descobriu os sabores',
  tagline: 'Ninguém disse a ela quais comidas são doces. Ela descobriu isso vendo quem gostava do quê.',
  title: 'A máquina que descobriu os sabores.',
  subtitle:
    'Quarenta pessoas inventadas, dezesseis comidas, uma tabela cheia de lacunas. Veja um pouco de aritmética organizar as comidas; depois, avalie algumas.',
  field: 'Dados · Recomendações · Um truque com informação',
  sceneLabel: '40 pessoas · 16 comidas',
  sceneName: 'O mapa oculto',
  tip: 'Toque numa comida para avaliá-la · Teclas: ↑↓ escolhem uma comida, → gosto, ← não é para mim',
  actionLabel: 'Mostrar os traços plantados',
  hideLabel: 'Esconder os traços plantados',
  canvasLabel:
    'À esquerda, uma tabela de quais pessoas inventadas gostam de quais comidas, com muitas células em branco. À direita, o mapa que o método desenha a partir dela, onde comidas parecidas se juntam. Toque numa comida para dizer se você gosta dela, e uma estrela mostra onde você está no mapa, com sugestões para você.',
  panelEyebrow: 'Os seus gostos',
  whyLabel: 'Como a máquina descobriu os sabores?',
  nudge:
    'Diga que gosta só de chocolate. O que ela sugere? Agora diga não também a algo doce. Depois deixe a maior parte da tabela em branco.',
  connection: {
    html: '<strong>Guarde os poucos números que importam.</strong> Aqui, dois números por comida bastam para preencher as lacunas de uma tabela. Em “Quanto de uma imagem dá para jogar fora?”, alguns números por bloco bastam para refazer uma imagem.',
    label: 'Jogar fora parte de uma imagem',
  },

  presets: [
    { name: 'Encontre o mapa oculto', note: 'Veja as comidas se organizarem sozinhas.', badge: '?' },
    { name: 'Paixão por doce', note: 'Gosta de duas, não gosta de duas.', badge: '♥' },
    { name: 'Só sobremesas', note: 'Avalie só um tipo de comida.', badge: '1' },
  ],

  foods: [
    'Chocolate',
    'Sorvete',
    'Donuts',
    'Panquecas',
    'Morangos',
    'Melancia',
    'Manga',
    'Pipoca',
    'Pizza',
    'Hambúrguer',
    'Batata frita',
    'Queijo',
    'Salada',
    'Pepino',
    'Sushi',
    'Brócolis',
  ],

  blanks: 'Células em branco',
  blanksHint: 'As células que ninguém preencheu. O método só vê o resto e tenta adivinhar estas.',
  clear: 'Esquecer minhas avaliações',

  labels: {
    people: '40 pessoas inventadas →',
    you: 'Você',
    liked: 'gosta',
    disliked: 'não gosta',
    guessed: 'um palpite',
    map: 'O mapa encontrado',
    right: (p) => `Lacunas acertadas: ${p}%`,
    noBlanks: 'Nenhuma lacuna',
    tapHint: 'Toque no que gosta, ou não',
    you2: 'você',
    sweet: 'doce',
    savoury: 'salgado',
    rich: 'pesado',
    light: 'leve',
    planted: (angle, flipped) => `Os traços plantados, girados ${angle}°${flipped ? ' e espelhados' : ''}`,
  },

  readout: {
    title: 'Sugestões para você',
    empty: 'Toque em algumas comidas no mapa, ou na sua coluna da tabela: ♥ gosto, ✕ não é para mim.',
    none: 'Nada mais parece um sim para você.',
    rated: (likes, nots) => `Você gosta de ${likes}, e ${nots} não ${nots === 1 ? 'é' : 'são'} para você.`,
    stays: 'As suas avaliações ficam nesta página.',
  },

  status: {
    running: (n) => `Rodada ${n}`,
    right: (p) => `${p}% de acertos`,
    full: 'Sem lacunas',
  },
  announce: {
    found: (n, p) => `O mapa foi encontrado depois de ${n} rodadas. Ele acertou ${p}% das lacunas.`,
    full: (n) => `O mapa foi encontrado depois de ${n} rodadas. Não havia lacunas para adivinhar.`,
    suggest: (list) => `Sugestões para você: ${list}.`,
    nothing: 'Nada mais parece um sim para você.',
    rate: (food, word) => `${food}: ${word}.`,
    like: 'gosto',
    not: 'não é para mim',
    unrated: 'sem avaliação',
    planted: (angle, flipped) =>
      `Os traços plantados batem com o mapa girado ${angle} graus${flipped ? ' e espelhado' : ''}.`,
  },

  guests: [
    {
      name: 'Eugenio Beltrami',
      note: 'Em 1873, mostrei que uma tabela quadrada de números pode ser desmontada em um giro, um estiramento ao longo de cada direção e outro giro. Hoje esses estiramentos são chamados de valores singulares dela.',
    },
    {
      name: 'Camille Jordan',
      note: 'Cheguei ao mesmo resultado um ano depois, por conta própria. Sessenta anos mais tarde, Eckart e Young mostraram que guardar só os maiores estiramentos dá a tabela menor mais próxima.',
    },
  ],

  insight: {
    title: 'Como a máquina descobriu os sabores?',
    html: `<p>Cada comida ganha dois números, e cada pessoa também: um ponto no mapa. O palpite do método para uma pessoa e uma comida multiplica os primeiros números das duas, multiplica os segundos e soma os resultados (um produto escalar); assim, uma comida ganha nota alta para alguém quando fica bem longe na direção dessa pessoa. Ele começa com pontos aleatórios e os empurra um pouquinho, rodada após rodada, para que os palpites batam com as células que ele conhece. Comidas de que as mesmas pessoas gostam precisam acabar na mesma direção, então comidas parecidas se juntam. Ninguém falou de doçura para ele: “doce” é só uma direção que explica muitos gostos de uma vez.</p>
<div class="insight-visual">palpite = 1º da pessoa × 1º da comida + 2º da pessoa × 2º da comida → ajustar às células conhecidas → as lacunas são palpites</div>
<h3>Nós plantamos a resposta</h3>
<p>As quarenta pessoas são inventadas, de propósito. Cada comida recebeu dois traços escondidos, o quanto é doce e o quanto é pesada, e cada pessoa, um gosto por cada um, mais um pouco de capricho, e a tabela diz se ela gostou ou não. Depois, algumas células foram escondidas. O método nunca vê os traços. Como sabemos o que há nas lacunas, dá para dar nota aos palpites dele: com 60% da tabela em branco, ele acerta cerca de 82% delas, enquanto alguém que conhecesse exatamente os traços plantados acertaria cerca de 90%, por causa dos caprichos. Com 90% em branco, ele se sai pouco melhor do que jogar uma moeda.</p>
<h3>Nenhum rótulo no mapa</h3>
<p>Gire o mapa inteiro, ou espelhe-o, e todos os palpites continuam iguais; então o método não tem como saber para que lado fica o “doce”. As direções querem dizer algo, mas são as pessoas que precisam dar nome a elas. É por isso que os traços plantados aparecem girados quando você os mostra, e um pouco fora do lugar: o método encontra o que melhor explica a tabela, não o que nós tínhamos em mente.</p>
<h3>A sua estrela</h3>
<p>As suas avaliações põem você no mapa: no ponto cujos palpites melhor batem com elas. As sugestões são as comidas que você ainda não avaliou com os palpites mais altos, as que ficam mais longe na sua direção. Avalie só um tipo de comida e o mapa conhece você numa direção só, então sugere mais do mesmo. As suas avaliações ficam nesta página; nada é enviado para lugar nenhum.</p>
<h3>O que esta sala simplifica</h3>
<p>Gostos de verdade precisam de mais de dois números, e tabelas de verdade ficam quase todas em branco: cada pessoa avaliou uma parte minúscula dos filmes ou das músicas. O Prêmio Netflix (de 2006 a 2009) ofereceu um milhão de dólares a quem previsse as notas dos filmes 10% melhor do que o próprio sistema da Netflix, e as misturas das equipes que lideravam eram feitas principalmente de métodos como este. Os sistemas de recomendação de hoje usam muito mais: o que você fez e quando, onde você está, grandes redes neurais e os objetivos da própria empresa. Esta sala mostra a ideia, não como alguma empresa recomenda coisas hoje.</p>
<details><summary>A matemática, se você quiser</summary><p>Escreva a tabela como uma matriz R, pessoas por comidas, com +1 para “gosto” e −1 para “não”. O método procura uma matriz de pessoas U e uma matriz de comidas V, com duas colunas cada, que deixem pequena a soma Σ (r − uᵢ·vⱼ)² sobre as células conhecidas mais λ(Σ|uᵢ|² + Σ|vⱼ|²), aqui com λ = 1, por descida de gradiente a partir de um pequeno começo aleatório. A penalidade impede que ele se dobre a cada capricho. O seu ponto é o u que deixa pequena a mesma soma só sobre as suas avaliações. Sem lacunas e sem penalidade, a melhor resposta é conhecida exatamente: a decomposição em valores singulares, cortada nos seus dois maiores valores singulares (Eckart e Young, 1936); com lacunas não existe uma fórmula assim, e o método só procura. A decomposição em valores singulares foi encontrada por Eugenio Beltrami em 1873 e por Camille Jordan em 1874. Y. Koren, R. Bell e C. Volinsky, “Matrix factorization techniques for recommender systems”, IEEE Computer 42(8), agosto de 2009.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Matrix_factorization_(recommender_systems)" target="_blank" rel="noopener">Fatoração de matrizes em sistemas de recomendação (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Decomposição em valores singulares (Wikipedia, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Netflix_Prize" target="_blank" rel="noopener">Prêmio Netflix (Wikipedia, em inglês)</a><a class="source-link" href="https://datajobs.com/data-science-repo/Recommender-Systems-%5BNetflix%5D.pdf" target="_blank" rel="noopener">Koren, Bell e Volinsky, Matrix factorization techniques for recommender systems (2009, PDF, em inglês)</a></div>`,
  },
});
