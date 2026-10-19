/* Everyone gets the biggest slice · visitor-facing words (English). */
Wonderlattice.defineText('cake', 'en', {
  eyebrow: 'FAIR DIVISION',
  name: 'Everyone gets the biggest slice',
  tagline: 'One cake, three tastes. Cut it right and each person thinks they got more than half.',
  title: 'Everyone gets the biggest slice.',
  subtitle:
    'Three people, three tastes, one cake. Equal pieces leave two of them envious. The right cut gives each one more than half, by their own taste.',
  field: 'Game theory · Fair division · Intuition fooled',
  sceneLabel: '3 people · 1 cake',
  sceneName: 'Cut it fairly',
  tip: 'Drag a knife · Tap a piece to hand it on · Keys: ←→ move a knife, ↑↓ the other knife, Enter swaps the pieces beside it',
  actionLabel: 'Show me a method',
  nextLabel: 'Next step',
  doneLabel: 'Back to my cake',
  canvasLabel:
    'At the top, three people, Ada, Ben and Cleo, each with a ring showing what every piece is worth to them. In the middle, a long cake with chocolate, strawberry and vanilla, and two knives you can drag. At the bottom, a strip for each person that glows where they like the cake most.',
  panelEyebrow: 'Fair shares',
  whyLabel: 'How can everyone get more?',
  nudge:
    'Drag the knives until nobody frowns. Then hand the pieces out another way. Who should get the shortest piece?',
  connection: {
    html: '<strong>Fair without a referee.</strong> Here nobody envies anybody’s piece. In Who asks wins, nobody would rather swap partners, yet who asks first still matters.',
    label: 'Visit “Who asks wins”',
  },

  presets: [
    { name: 'More than half each', note: 'Unequal pieces, three happy people.', badge: '★' },
    { name: 'Equal pieces', note: 'Three equal lengths, handed out in a row.', badge: '=' },
    { name: 'Same tastes', note: 'Then a third each is the best there is.', badge: '⅓' },
  ],

  people: ['Ada', 'Ben', 'Cleo'],
  flavours: ['chocolate', 'strawberry', 'vanilla'],
  fair: 'Find a fair cut',
  taste: 'How different their tastes are',
  tasteHint: 'At 0%, all three like every bit of the cake the same.',

  // Drawn on the picture: keep them short.
  labels: {
    length: 'Length',
    ofCake: (p) => `${p}% of the cake`,
    percent: (p) => `${p}%`,
    tastes: 'Likes',
    trimming: 'Trimming',
  },
  headline: {
    envies: (a, b) => `${a} envies ${b}`,
    half: 'Everyone thinks they got more than half!',
    third: 'Everyone thinks they got more than a third!',
    fair: 'Nobody envies anybody.',
  },

  readout: {
    title: 'Each share, by its owner’s taste',
    share: (name, p) => `${name} ${p}%`,
    none: 'Nobody envies anybody.',
    envies: (a, b) => `${a} envies ${b}.`,
  },

  status: {
    smallest: (p) => `Smallest share ${p}%`,
    step: (k, n) => `Step ${k} of ${n}`,
  },

  // The method, step by step: Ada cuts, Ben trims, Cleo chooses first.
  tour: [
    'Two people first. Ada cuts the cake in two, so that both pieces are worth the same to her.',
    'Ben takes the piece he likes more. Ada gets the other, worth exactly half to her. I cut, you choose: nobody envies anybody.',
    'Now three. Ada cuts three pieces that are equal for her, and Ben takes his favourite.',
    'Cleo takes the better of the two left, and Ada gets the last. But Cleo wanted Ben’s piece: she envies him.',
    'A fix, found by John Selfridge and later by John Conway. Again Ada cuts three pieces that are equal for her.',
    'Ben trims his favourite piece until it ties with his second favourite. The trimming waits to one side.',
    'Cleo chooses first. Then Ben, who has to take the trimmed piece if Cleo leaves it. Ada gets one that nobody trimmed.',
    'Nobody envies anybody yet. Ben, who didn’t take the trimmed piece, cuts the trimming into three bits that are equal for him.',
    'Cleo picks a bit first, then Ada, then Ben. Five cuts in all, and nobody envies anybody.',
  ],

  guests: [
    {
      name: 'Hugo Steinhaus',
      note: 'In 1944, hiding during the war, I asked how to share a cake so that each of n people gets at least 1/n by their own judgement. I found a way for three; Stefan Banach and Bronisław Knaster found one for any number.',
    },
    {
      name: 'John Horton Conway',
      note: 'Around 1960 John Selfridge found a way for three people to share a cake with no envy at all, in five cuts. Later I found the same way on my own. Neither of us published it.',
    },
  ],

  insight: {
    title: 'How can everyone get more?',
    html: `<p>Each person judges the cake by their own taste. On the opening screen, Ada’s piece is worth 56% of the whole cake to Ada, Cleo’s is worth 56% to Cleo, and Ben’s 56% to Ben. Together that’s more than 100%, because each is measured in a different currency: the strawberry Cleo loves is worth little to Ada, so giving it to Cleo costs Ada almost nothing. Fair doesn’t have to mean equal. Cleo’s piece is the shortest of the three.</p>
<div class="insight-visual">Ada: 56% by Ada’s taste · Cleo: 56% by Cleo’s taste · Ben: 56% by Ben’s taste</div>
<h3>Two words for fair</h3>
<p><strong>Proportional</strong>: with three people, everyone gets at least a third, by their own taste. <strong>Envy-free</strong>: nobody would rather have someone else’s share. When the whole cake is shared out, envy-free is the stronger one: if your share is worth at least as much to you as each of the other two, it is worth at least a third. When even two people’s tastes differ slightly, there is a division that gives everyone more than 1/n (Dubins and Spanier, 1961; Woodall gave a way to cut it in 1986), though its pieces may come in several bits. With the same tastes, a third each is the best there is.</p>
<h3>I cut, you choose</h3>
<p>For two people, one cuts the cake into two pieces that are equal to them, and the other chooses. The cutter gets exactly half by their own taste and the chooser at least half, so neither envies the other. For three it breaks: whoever chooses second may want the piece already taken. Hugo Steinhaus asked in 1944 how to share among three or more; his method, and Banach and Knaster’s, give everyone at least 1/n, but not freedom from envy.</p>
<h3>The trimming trick</h3>
<p>John Selfridge found a way for three around 1960, and John Conway found it again on his own later; neither published it. Ben trims his favourite piece so that it ties with his second favourite: whatever Cleo takes, one of Ben’s favourites is left for him. Ada values every untrimmed piece at a third, and one is always left for her, so she envies nobody. Then the trimming is shared out. Ada never envies whoever took the trimmed piece: that piece and the whole trimming together are worth only a third to her. It takes at most five cuts, and two of the shares come in two bits.</p>
<h3>What this room keeps simple</h3>
<p>Each person’s taste is the same all through a flavour, and adds up: a piece is worth the sum of its parts, and no single crumb matters (nobody wants only the cherry). Everyone is honest about their taste, and envy smaller than half a percent isn’t counted. The fair cut tries each way of handing out three single pieces, finds where the knives give all three the same share, and keeps the biggest share with no envy. That isn’t always the best division there is: pieces in several bits can do better. For three or more people, an envy-free division into single pieces always exists, but no method made of finitely many cuts and questions can always find one (Stromquist, 2008); the room can search because it knows everyone’s taste in advance. For any number of people, Haris Aziz and Simon Mackenzie found in 2016 the first envy-free method with a limit on its number of steps, though the limit is a tower of six n’s.</p>
<details><summary>The mathematics, if you want it</summary><p>The cake is the interval [0, 1]. Person i’s taste is a density fᵢ ≥ 0 with ∫₀¹ fᵢ = 1, and a piece X is worth Vᵢ(X) = ∫_X fᵢ. Here fᵢ is constant on each flavour, and the slider mixes it with an even taste: (1 − m) + m·fᵢ. For each way of handing out the left, middle and right pieces to people a, b and c, the fair cut solves V_a([0, x]) = V_b([x, y]) = V_c([y, 1]) = t, with t as large as possible, by bisection. Sources: H. Steinhaus, “The problem of fair division”, Econometrica 16 (1948) 101–104; W. Stromquist, “Envy-free cake divisions cannot be found by finite protocols”, Electron. J. Combin. 15 (2008) R11; H. Aziz and S. Mackenzie, “A discrete and bounded envy-free cake cutting protocol for any number of agents”, FOCS 2016.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Fair_cake-cutting" target="_blank" rel="noopener">Fair cake-cutting</a><a class="source-link" href="https://en.wikipedia.org/wiki/Selfridge%E2%80%93Conway_procedure" target="_blank" rel="noopener">Selfridge–Conway procedure</a><a class="source-link" href="https://en.wikipedia.org/wiki/Super-proportional_division" target="_blank" rel="noopener">Super-proportional division</a><a class="source-link" href="https://www.combinatorics.org/ojs/index.php/eljc/article/view/v15i1r11" target="_blank" rel="noopener">Stromquist 2008</a><a class="source-link" href="https://arxiv.org/abs/1604.03655" target="_blank" rel="noopener">Aziz and Mackenzie 2016</a><a class="source-link" href="https://www.quantamagazine.org/new-algorithm-solves-cake-cutting-problem-20161006/" target="_blank" rel="noopener">Quanta Magazine, 2016</a></div>`,
  },
});
