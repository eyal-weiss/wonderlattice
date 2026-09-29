Wonderlattice.defineText('fingerprint', 'pt', {
  eyebrow: 'PELE',
  name: 'Faça crescer uma impressão digital',
  tagline: 'Ninguém a desenha: as cristas crescem sozinhas em verticilos, presilhas e arcos.',
  title: 'Faça crescer uma impressão digital.',
  subtitle:
    'Ninguém desenha estas linhas. Duas substâncias químicas se espalham e reagem, e cristas como as de uma impressão digital aparecem sozinhas.',
  field: 'Reação–difusão · Padrões de Turing · Desenvolvimento',
  sceneLabel: 'A ponta de um dedo, criando suas cristas',
  tip: 'Toque na ponta do dedo para começar cristas ali · As setas miram, Enter planta',
  actionLabel: 'Crescer de novo',
  canvasLabel:
    'A ponta de um dedo onde as cristas crescem para fora a partir de alguns pontos iniciais. Clique ou toque para começar cristas num ponto, ou use as setas para mirar e Enter para plantar.',
  panelEyebrow: 'Molde o crescimento',
  whyLabel: 'Como as cristas se formam?',
  nudge:
    'Observe onde as ondas se encontram: quando três se encontram, deixam um pequeno Y. Depois pressione “Crescer de novo”: o mesmo plano, detalhes novos, como gêmeos idênticos.',
  connection: {
    html: '<strong>Sem planta baixa.</strong> Aqui, dois sinais e alguns pontos iniciais fazem cada crista. Em “Uma mente de muitos”, algumas regras entre vizinhos movem uma multidão inteira.',
    label: 'Visitar “Uma mente de muitos”',
  },
  presets: [
    {
      name: 'Verticilo',
      note: 'O centro da polpa começa primeiro.',
    },
    {
      name: 'Presilha',
      note: 'Um começo que escapa por um lado.',
    },
    {
      name: 'Arco',
      note: 'A dobra lidera; a polpa nunca começa.',
    },
    {
      name: 'Do seu jeito',
      note: 'Toque para escolher onde as cristas começam.',
    },
  ],
  sceneNames: ['Um verticilo', 'Uma presilha', 'Um arco', 'Sua própria impressão digital'],
  mixed: 'Sua própria mistura',
  lead: 'Vantagem para a primeira onda',
  ridges: (n) => (n === 1 ? '1 crista' : `${n} cristas`),
  spacing: 'Espaçamento das cristas',
  across: (n) => `cerca de ${n} na largura`,
  speed: 'Velocidade de crescimento',
  speeds: ['suave', 'tranquila', 'constante', 'animada', 'a toda'],
  look: 'Aparência',
  looks: ['Pele quente', 'Impressão a tinta', 'Brilho noturno'],
  marks: 'Mostrar onde as cristas começam',
  roles: {
    pad: 'Centro da polpa',
    tip: 'Ponta do dedo',
    crease: 'Dobra',
    yours: 'Seu ponto',
  },
  legendTitle: 'ONDE AS CRISTAS COMEÇAM',
  triradiusKey: 'Delta: um pequeno Y',
  started: 'crescendo',
  done: 'pronta',
  soon: (n) => (n <= 1 ? 'entra em cerca de uma crista' : `entra em cerca de ${n} cristas`),
  noSites: 'Toque na ponta do dedo para começar.',
  growing: (percent) => `Crescendo · ${percent}% da ponta do dedo`,
  quietly: (percent) => `Crescendo devagar · ${percent}%`,
  waiting: 'Toque na ponta do dedo para começar as cristas',
  types: {
    whorl: 'um verticilo',
    loop: 'uma presilha',
    arch: 'um arco',
  },
  result: (type) => `Pronta: o centro dela forma ${type}`,
  triradii: (n) =>
    n === 0 ? 'nenhum delta encontrado' : n === 1 ? '1 delta (um pequeno Y)' : `${n} deltas (pequenos Ys)`,
  status: (type, n) => `${type[0].toUpperCase() + type.slice(1)} · ${n === 1 ? '1 delta' : `${n} deltas`}`,
  twin: (n) => `Gêmea ${n + 1} · “Crescer de novo” para uma irmã`,
  full: 'Quatro pontos iniciais é o máximo. Escolha “Do seu jeito” para uma ponta de dedo nova.',
  outside: 'Toque dentro da ponta do dedo.',
  guests: [
    {
      name: 'Alan Turing',
      note: 'Em 1952, ele mostrou que duas substâncias químicas, reagindo e se espalhando em velocidades diferentes, podem fazer padrões aparecerem.',
    },
  ],
  insight: {
    title: 'De onde vêm as impressões digitais?',
    html: `<p>Ninguém desenha uma impressão digital. Antes do nascimento, a pele da ponta de cada dedo organiza suas cristas sozinha, e o padrão fica para a vida toda.</p>
<div class="insight-visual">ativador + inibidor, espalhando-se em velocidades diferentes → cristas</div>
<h3>A ideia de Turing</h3>
<p>Em 1952, Alan Turing mostrou que duas substâncias químicas, reagindo uma com a outra e se espalhando em velocidades diferentes, podem fazer um padrão aparecer numa mistura uniforme. Um jeito popular de imaginar isso veio depois: um <em>ativador</em> que produz mais de si mesmo, e um <em>inibidor</em>, também produzido por ele, que o segura. Se o inibidor se espalha mais rápido, cada saliência de ativador se cerca de um fosso onde nenhuma outra saliência consegue crescer. O resultado são manchas ou listras, com um espaçamento que a química escolhe.</p>
<h3>Ondas a partir de poucos lugares</h3>
<p>Em 2023, uma equipe liderada pela Universidade de Edimburgo descobriu que as cristas das impressões digitais seguem esse tipo de sistema de Turing, com os sinais WNT e EDAR como ativadores e BMP como inibidor. As cristas não aparecem em toda parte ao mesmo tempo. Elas começam em alguns pontos: o centro da polpa da ponta do dedo, a ponta perto da unha e ao lado da dobra da última articulação. Dali, elas se espalham como ondas, deixando cristas mais ou menos paralelas à frente da onda. Onde as ondas se encontram, deixam os deltas, em forma de Y. As simulações da equipe produziram arcos, presilhas e verticilos mudando quando, onde e em que ângulo os pontos começam: uma polpa que começa tarde, por exemplo, deixa espaço para as cristas da dobra e forma um arco.</p>
<h3>Por que as impressões variam tanto</h3>
<p>O estudo concluiu que onde os pontos começam, e como suas ondas se encontram, produz a variedade das impressões digitais; na discussão, os autores acrescentam que as pequenas diferenças aleatórias típicas dos padrões de Turing tornam cada impressão ainda mais única. Gêmeos idênticos compartilham os genes, e suas impressões muitas vezes são do mesmo tipo, mas não têm os mesmos detalhes: num grande estudo, as impressões de gêmeos tinham o mesmo tipo cerca de três vezes em cada quatro, e mesmo assim um comparador de impressões digitais as distinguia quase tão bem quanto distingue as de pessoas sem parentesco. “Crescer de novo” mantém o plano e muda só os detalhes mais minúsculos, e você pode ver as cristas terminarem e se bifurcarem em lugares novos.</p>
<h3>O que esta sala deixa de fora</h3>
<p>Este é um modelo simplificado inspirado nessa pesquisa, não uma simulação de pele embrionária de verdade. A ponta do dedo é plana, os pontos iniciais são colocados à mão, e não aparecem genes nem substâncias reais: só dois sinais inventados, com equações de livro-texto. Ficam de fora o crescimento do dedo, sua polpa tridimensional e os poros de suor que depois pontilham cada crista.</p>
<details><summary>A matemática, se você quiser</summary><p>Os dois sinais a (ativador) e h (inibidor) seguem equações adaptadas do modelo cúbico de Barrio–Varea–Aragón–Maini (aqui o ativador se espalha um pouco mais devagar, 0.45 em vez de 0.516, e h é o v deles com o sinal trocado): ∂a/∂t = 0.45 s ∇²a + 0.899 a − h − 3.15 a h², e ∂h/∂t = s ∇²h + 0.899 a − 0.91 h − 3.15 a h². O estado uniforme a = h = 0 é instável para uma faixa de ondulações, que crescem mais rápido com um comprimento de onda de cerca de 9.5√s células da grade, mas ele continua exatamente uniforme até que um ponto o empurre, por isso as cristas só se espalham como ondas a partir dos pontos. Sem termos quadráticos (o único não linear, a h², é cúbico), as listras vencem as manchas. O controle de espaçamento das cristas muda s.</p><p>A sala dá nome ao resultado caminhando em volta de cada ponto onde a direção das cristas se desfaz e somando quanto essa direção gira (seu índice de Poincaré): meia volta num sentido para o núcleo de uma presilha, uma volta inteira para o centro de um verticilo e meia volta no outro sentido para um delta. Os peritos em impressões digitais usam os mesmos pontos de referência. Pontos bem na borda da ponta do dedo não são detectados.</p></details>
<div class="sources"><a class="source-link" href="https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/" target="_blank" rel="noopener">Glover et al. (2023), The developmental basis of fingerprint pattern formation and variation (em inglês)</a><a class="source-link" href="https://doi.org/10.1098/rstb.1952.0012" target="_blank" rel="noopener">Turing (1952), The chemical basis of morphogenesis (em inglês)</a><a class="source-link" href="https://doi.org/10.1371/journal.pone.0035704" target="_blank" rel="noopener">Tao et al. (2012), reconhecimento de impressões digitais de gêmeos idênticos (em inglês)</a><a class="source-link" href="https://doi.org/10.1006/bulm.1998.0093" target="_blank" rel="noopener">Barrio et al. (1999), o modelo do qual estas equações foram adaptadas (em inglês)</a></div>`,
  },
});
