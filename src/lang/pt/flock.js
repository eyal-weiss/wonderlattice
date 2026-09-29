Wonderlattice.defineText('flock', 'pt', {
  eyebrow: 'EMERGÊNCIA',
  name: 'Uma mente de muitos',
  tagline: 'Sem líder, só vizinhos: coloque um bando em movimento.',
  title: 'Uma mente de muitos.',
  subtitle:
    'Cada pássaro só observa os vizinhos mais próximos, e ninguém lidera. Mude o quanto eles seguem uns aos outros e veja um bando se formar.',
  field: 'Sistemas dinâmicos · Emergência',
  sceneLabel: 'Um mundo de decisões locais',
  sceneName: 'O coletivo em movimento',
  tip: 'Toque ou arraste para guiar o bando · As setas movem seu toque, Esc o solta · As bordas se ligam',
  actionLabel: 'Espalhar o bando',
  canvasLabel: 'Um bando de marcas em movimento. Toque, arraste ou use as setas para guiar. Pressione Esc para soltar.',
  panelEyebrow: 'Regras locais',
  whyLabel: 'Quem está no comando?',
  nudge: 'Baixe “Seguir a direção” até zero. Uma multidão consegue ficar junta sem concordar para onde ir?',
  connection: {
    html: '<strong>Um padrão sem planejador.</strong> Aqui, um bando inteiro surge de pequenas interações. Em Ouça a forma, uma nova onda surge da soma de duas mais simples.',
    label: 'Veja ondas se combinarem',
  },
  presets: [
    {
      name: 'Em companhia',
      note: 'Encontrar uma direção comum.',
    },
    {
      name: 'Cada um por si',
      note: 'Deixe os caminhos individuais tomarem conta.',
    },
    {
      name: 'Fiquem perto',
      note: 'Juntos, sem muito acordo.',
    },
  ],
  align: 'Seguir a direção',
  cohesion: 'Ficar juntos',
  separate: 'Manter distância',
  influence: 'Seu toque',
  attract: 'Atrair',
  repel: 'Repelir',
  trails: 'Deixar rastros de luz',
  neighbors: 'Mostrar uma vizinhança',
  agreement: 'Acordo de direção',
  status: (n) => `${n} decisões individuais`,
  guests: [
    {
      name: 'John Conway',
      credit: 'Thane Plambeck (recortada)',
      note: 'O Jogo da Vida dele também cria surpresas a partir de regrinhas locais.',
    },
    {
      name: 'Alan Turing',
      note: 'O modelo de padrões dele mostrou como mudanças locais podem fazer manchas e listras.',
    },
  ],
  insight: {
    title: 'Quem está no comando?',
    html: `<p>Ninguém. Cada marca olha só para os vizinhos próximos e segue três tendências: evitar aglomeração, seguir a direção deles e ficar perto.</p>
<div class="insight-visual">Interações individuais → movimento coletivo</div>
<h3>O padrão mora entre os indivíduos</h3>
<p>Nenhuma marca conhece a forma inteira do bando. Um movimento coerente pode surgir porque cada uma responde a uma pequena parte do grupo. Seu cursor acrescenta uma atração ou repulsão vinda de fora.</p>
<h3>Um modelo, não um animal inteiro</h3>
<p>Esta é uma versão simplificada do modelo Boids, de Craig Reynolds. Ele captura algumas qualidades visuais de bandos e cardumes, mas não explica cada decisão de aves ou peixes de verdade.</p>
<h3>Olhe por um único par de olhos</h3>
<p>Ligue “Mostrar uma vizinhança”. O círculo marca a distância que um indivíduo consegue perceber; as linhas apontam para os vizinhos que o influenciam. Bordas opostas se ligam, então um vizinho pode estar perto do outro lado de uma borda.</p>
<details><summary>O que o “acordo” mede?</summary><p>Tiramos a média de todos os vetores unitários de direção e medimos o comprimento do resultado. Perto de 100% quer dizer que todos apontam mais ou menos para o mesmo lado. Perto de zero quer dizer que as direções quase se anulam. É uma descrição do bando neste momento, não uma pontuação.</p><p>Cada passo combina as forças de separação, alinhamento e coesão e depois limita a velocidade. Todos os indivíduos se atualizam a partir do mesmo estado anterior.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds sobre os Boids (em inglês)</a></div>`,
  },
});
