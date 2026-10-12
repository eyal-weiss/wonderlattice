/* O ângulo secreto do girassol · palavras para o visitante (pt). */
Wonderlattice.defineText('sunflower', 'pt', {
  eyebrow: 'ÂNGULO DE OURO',
  name: 'O ângulo secreto do girassol',
  tagline: 'Gire um pouco, solte uma semente, repita. Só um ângulo faz um girassol.',
  title: 'O ângulo secreto do girassol.',
  subtitle:
    'Cada semente é girada um pouco em relação à anterior. Mude o giro em um décimo de grau e o girassol se desfaz.',
  field: 'Teoria dos números · Filotaxia · Plantas',
  sceneLabel: 'Um giro · mil sementes',
  sceneName: 'O miolo da flor',
  tip: 'Toque na flor para contar os braços · ← → mudam o giro em 0,01°, ↑ ↓ em 0,1°',
  actionLabel: 'Crescer de novo',
  canvasLabel:
    'O miolo de um girassol com mil sementes. Cada semente é girada pelo mesmo ângulo em relação à anterior, um pouco mais para fora.',
  panelEyebrow: 'Um ângulo, muitas flores',
  whyLabel: 'Por que um só ângulo faz um girassol?',
  nudge:
    'Encontre um ângulo que forme raios retos e depois mude-o em 0,01°. Quantos braços aparecem? São números de Fibonacci?',
  connection: {
    html: '<strong>Alan Turing, de novo.</strong> Ele se perguntava como os seres vivos que crescem criam os seus padrões. Em “Faça crescer uma impressão digital”, a química dele desenha as cristas.',
    label: 'Faça crescer uma impressão digital',
  },

  presets: [
    { name: 'Um girassol', note: 'O ângulo de ouro.', badge: '137,5°' },
    { name: 'Um décimo de grau a mais', note: 'Abrem-se vãos entre os braços.', badge: '137,6°' },
    { name: 'Três oitavos de volta', note: 'Oito raios retos.', badge: '135°' },
  ],

  angle: 'Giro entre sementes',
  nudgeGroup: 'Mude o giro um pouco',
  // The buttons under the slider, given the step already written as the page writes numbers ("0,01°").
  more: (step) => `${step} a mais`,
  less: (step) => `${step} a menos`,
  arms: 'Mostrar os braços e contá-los',

  // The status line: what the eye sees near the rim (or where the visitor tapped). Counts are whole numbers.
  status: {
    growing: (seeds) => `Crescendo: ${seeds} sementes`,
    spokes: (q) => (q === 1 ? 'Uma linha reta' : `${q} raios retos`),
    gaps: (q) => `Abrem-se vãos entre ${q} braços curvos`,
    packed: (a, b) => `Bem compacto: ${a} braços num sentido, ${b} no outro`,
  },

  // Words drawn on the canvas: keep them short.
  labels: {
    degrees: (value) => `${value}°`, // the turn, already written as the page writes numbers
    golden: 'o ângulo de ouro',
    ofTurn: (p, q) => `${p}/${q} de volta`,
    fibonacci: 'Números de Fibonacci',
  },

  guests: [
    {
      name: 'Leonardo de Pisa (Fibonacci)',
      note: 'Em 1202, o livro de cálculo dele perguntava com que rapidez os coelhos se reproduzem. A resposta, 1, 1, 2, 3, 5, 8, 13…, hoje leva o apelido dele.',
    },
    {
      name: 'Alan Turing',
      note: 'Nos últimos anos de vida, ele estudou por que as plantas dispõem folhas e sementes em espirais de Fibonacci. Em 2012, no centenário dele, o público plantou girassóis para pôr a ideia à prova.',
    },
  ],

  insight: {
    title: 'Por que um só ângulo faz um girassol?',
    html: `<p>Cada nova semente é girada pelo mesmo ângulo em relação à anterior e fica um pouco mais para fora. Se esse giro é uma fração simples de uma volta inteira, digamos 3/8, então cada semente cai na mesma linha a partir do centro que a semente oito posições antes: oito raios, com fatias vazias entre eles. Um giro <em>próximo</em> de 3/8 curva esses raios em oito braços curvos, com vãos entre eles.</p>
<div class="insight-visual">um giro de p/q → q raios · perto de p/q → q braços curvos</div>
<h3>O ângulo que evita todas as frações</h3>
<p>Para encher o miolo sem vãos, o giro precisa ficar longe de todas as frações simples. O ângulo de ouro, 360°/φ² ≈ 137,508° (φ = 1,618…, a proporção áurea), faz isso melhor do que qualquer outro: as frações se aproximam de φ mais devagar do que de qualquer outro número. As melhores aproximações dele são 1/3, 2/5, 3/8, 5/13, 8/21, 13/34 de volta: razões entre números de Fibonacci. É por isso que as duas famílias de braços que você consegue contar são números de Fibonacci vizinhos, 13 e 21 perto do meio, 55 e 89 perto da borda de mil sementes.</p>
<h3>Girassóis de verdade</h3>
<p>As plantas não são tão arrumadas. No estudo de ciência cidadã <em>Turing’s Sunflowers</em>, com 657 miolos de girassol, 565 das 768 contagens de espirais eram números de Fibonacci, e outras 67 tinham uma estrutura de Fibonacci aparentada. As demais não, e contagens uma unidade menores que um número de Fibonacci apareceram com uma frequência surpreendente. Alguns miolos não tinham nenhuma espiral clara.</p>
<h3>O que este modelo deixa de fora</h3>
<p>O modelo recebe o ângulo pronto; ele não explica por que uma planta o usa. Num miolo de verdade, os novos brotos se formam onde um hormônio, a auxina, se acumula, e cada broto puxa a auxina das redondezas, então o próximo se forma em outro lugar. Stéphane Douady e Yves Couder pingaram gotinhas magnetizadas, uma após a outra, sobre óleo, onde elas se repelem: cada gota nova se acomoda o mais longe possível das últimas, e no ritmo certo o ângulo de ouro aparece sozinho.</p>
<details><summary>A matemática, se você quiser</summary><p>Um giro de 0,381966… de volta tem a fração contínua 1/(2 + 1/(1 + 1/(1 + …))), com todos os termos iguais a 1 depois do 2: nenhuma fração contínua converge mais devagar. As melhores frações dele, as convergentes, são F<sub>k</sub>/F<sub>k+2</sub>: 1/3, 2/5, 3/8, 5/13… Os vizinhos mais próximos de uma semente estão um número de Fibonacci de sementes antes ou depois dela, e esse número cresce mais ou menos junto com a distância ao centro. Exatamente 137,5° são 55/144 de volta, então formam 144 raios, mas só quando já há alguns milhares de sementes.</p></details>
<div class="sources"><a class="source-link" href="https://doi.org/10.1016/0025-5564(79)90080-4" target="_blank" rel="noopener">H. Vogel, A better way to construct the sunflower head (1979, em inglês)</a><a class="source-link" href="https://doi.org/10.1098/rsos.160091" target="_blank" rel="noopener">J. Swinton, E. Ochu et al., Turing’s Sunflowers (2016, em inglês)</a><a class="source-link" href="https://doi.org/10.1103/PhysRevLett.68.2098" target="_blank" rel="noopener">S. Douady, Y. Couder, Phyllotaxis as a self-organised growth process (1992, em inglês)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Golden_angle" target="_blank" rel="noopener">Ângulo de ouro (Wikipedia, em inglês)</a></div>`,
  },
});
