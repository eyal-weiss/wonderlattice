Wonderlattice.defineText('motion', 'pt', {
  eyebrow: 'GEOMETRIA',
  name: 'Pintar com movimento',
  tagline: 'Dois braços que giram e uma caneta desenham flores, estrelas e tramas.',
  presets: [
    {
      name: 'Flor do campo',
      note: 'Seis pétalas, uma só linha',
      nudge: 'Troque −5 por −5,1. Uma mudança minúscula dá à flor um futuro bem diferente.',
    },
    {
      name: 'Órbita de seda',
      note: 'Um laço dentro de um laço',
      nudge: 'Ligue os braços em movimento. Veja como cada círculo simples se soma ao outro.',
    },
    {
      name: 'Estrelinha',
      note: 'Uma estrela de pontas suaves',
      nudge: 'Leve o alcance da caneta para perto de 50%. Veja as pontas suaves virarem laços profundos.',
    },
    {
      name: 'Luz tecida',
      note: 'Pelo caminho mais longo',
      nudge: 'Use “Traçar tudo” para revelar a trama inteira. Depois experimente −4, um parente mais simples.',
    },
    {
      name: 'Quase um círculo',
      note: 'Uma mudança minúscula, uma longa história',
      nudge: 'Duas velocidades quase iguais se afastam devagar. Trace tudo para ver o reencontro completo.',
    },
    {
      name: 'Fitas',
      note: 'Encontre o ritmo escondido',
      nudge: 'Experimente outro ângulo inicial. O ritmo continua o mesmo enquanto o desenho gira.',
    },
  ],
  paletteNames: ['Aurora', 'Brasa', 'Geleira', 'Luar'],
  names: {
    own: 'Sua própria órbita',
    surprise: 'Um feliz acaso',
    shared: 'Uma órbita compartilhada',
  },
  nudges: {
    whole: 'Tente afastar a rotação de um número inteiro. Veja o caminho demorar mais para voltar para casa.',
    traceAll: 'Experimente “Traçar tudo” para ver o padrão inteiro. Aqui, toda configuração acaba fechando o laço.',
    surprise: 'Algo novo, só para você. Mude uma coisa e veja aonde isso leva.',
    shared: 'Alguém deixou um padrão para você. Mude uma coisa para torná-lo seu.',
    revisit: 'Um padrão conhecido ainda pode surpreender. Mude uma coisa e olhe de novo.',
  },
  status: {
    complete: 'O laço está completo',
    oneTurn: 'Uma volta. Um mundo inteiro.',
    turns: (n) => `${n} voltas externas até o reencontro`,
  },
  explainStill: 'O braço interno mantém sua direção enquanto o externo gira. A caneta traça um círculo deslocado.',
  explain: (k, outer, inner, opposite) =>
    `Com ${k}×, os dois braços voltam à posição inicial depois de ${outer} ${outer === 1 ? 'volta externa' : 'voltas externas'} e ${inner} ${inner === 1 ? 'volta interna' : 'voltas internas'}. ${opposite ? 'Eles giram em sentidos opostos.' : 'Eles giram no mesmo sentido.'}`,
  play: {
    pause: 'Pausar',
    play: 'Continuar',
    replay: 'Repetir',
  },
  focus: {
    enter: 'Entrar no modo foco',
    leave: 'Sair do modo foco',
    title: 'Modo foco',
  },
  rotationRange: 'Escolha uma rotação entre −10 e 10.',
  saved: 'Seu desenho está pronto para salvar.',
  saveFailed: 'Não foi possível salvar a imagem. Tente de novo.',
  shareText: (k, r, p, ink) =>
    `Wonderlattice · Pintar com movimento\nRotação interna: ${k}×\nAlcance da caneta: ${r}%\nÂngulo inicial: ${p}°\nTinta: ${ink}`,
  linkCopied: 'Link do padrão copiado.',
  settingsCopied: 'Configurações do padrão copiadas.',
  linkDescription: 'Copie este link para reabrir o mesmo padrão.',
  settingsDescription: 'Copie estas configurações para recriar seu padrão.',
  guests: [
    {
      name: 'Emmy Noether',
      note: 'Uma simetria escondida pode revelar algo que nunca muda.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Círculos e exponenciais dançam juntos com bastante elegância.',
    },
  ],
});
