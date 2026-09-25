/* Grow a fingerprint · visitor-facing words (English). */
Wonderloom.defineText('fingerprint', 'en', {
  eyebrow: 'SKIN',
  name: 'Grow a fingerprint',
  tagline: 'Nobody draws it: ridges grow by themselves into whorls, loops, and arches.',
  title: 'Grow a fingerprint.',
  subtitle: 'Nobody draws a fingerprint. Two signals spread and react, and ridges appear by themselves.',
  field: 'Reaction–diffusion · Turing patterns · Development',
  sceneLabel: 'A fingertip, growing its ridges',
  tip: 'Tap the fingertip to start ridges there · Arrow keys aim, Enter plants',
  actionLabel: 'Grow again',
  canvasLabel:
    'A fingertip where ridges grow outward from a few starting points. Click or tap to start ridges at a point, or use the arrow keys to aim and Enter to plant.',
  panelEyebrow: 'Shape the growth',
  whyLabel: 'How do ridges form?',
  nudge:
    'Watch where waves meet: three meeting leave a little Y. Then press “Grow again”: same plan, new details, like identical twins.',
  connection: {
    html: '<strong>No blueprint.</strong> Here, two signals and a few starting points make every ridge. In “A mind of many”, a few rules between neighbours move a whole crowd.',
    label: 'Visit “A mind of many”',
  },

  presets: [
    { name: 'Whorl', note: 'The pad’s centre starts first.' },
    { name: 'Loop', note: 'A start that runs off one side.' },
    { name: 'Arch', note: 'The crease leads; the pad never starts.' },
    { name: 'Your own', note: 'Tap to choose where ridges begin.' },
  ],
  sceneNames: ['A whorl', 'A loop', 'An arch', 'Your own fingerprint'],
  mixed: 'Your own mix',

  lead: 'Head start for the first wave',
  ridges: (n) => (n === 1 ? '1 ridge' : `${n} ridges`),
  spacing: 'Ridge spacing',
  across: (n) => `about ${n} across`,
  speed: 'Growth speed',
  speeds: ['gentle', 'easy', 'steady', 'brisk', 'racing'],
  look: 'Look',
  looks: ['Warm skin', 'Ink print', 'Night glow'],
  marks: 'Show where ridges start',

  roles: { pad: 'Pad centre', tip: 'Fingertip', crease: 'Crease', yours: 'Your point' },
  legendTitle: 'WHERE RIDGES START',
  triradiusKey: 'Triradius: a little Y',
  started: 'growing',
  done: 'grown',
  soon: (n) => (n <= 1 ? 'joins in about a ridge' : `joins in about ${n} ridges`),
  noSites: 'Tap the fingertip to start.',
  growing: (percent) => `Growing · ${percent}% of the fingertip`,
  quietly: (percent) => `Growing quietly · ${percent}%`,
  waiting: 'Tap the fingertip to start ridges',
  types: { whorl: 'a whorl', loop: 'a loop', arch: 'an arch' },
  result: (type) => `Grown: its centre makes ${type}`,
  triradii: (n) =>
    n === 0 ? 'no triradius found' : n === 1 ? '1 triradius (a little Y)' : `${n} triradii (little Ys)`,
  status: (type, n) => `${type[0].toUpperCase() + type.slice(1)} · ${n === 1 ? '1 triradius' : `${n} triradii`}`,
  twin: (n) => `Twin ${n + 1} · “Grow again” for a sibling`,
  full: 'Four starting points is the most. Choose “Your own” for a fresh fingertip.',
  outside: 'Tap inside the fingertip.',

  guests: [
    {
      name: 'Alan Turing',
      note: 'In 1952 he showed that two chemicals, reacting and spreading at different speeds, can make patterns appear.',
    },
  ],

  insight: {
    title: 'Where do fingerprints come from?',
    html: `<p>Nobody draws a fingerprint. Before birth, the skin of each fingertip sets out its ridges by itself, and the pattern stays for life.</p>
<div class="insight-visual">activator + inhibitor, spreading at different speeds → ridges</div>
<h3>Turing’s idea</h3>
<p>In 1952 Alan Turing showed that two chemicals, reacting with each other and spreading at different speeds, can make a pattern appear in an even mixture. A popular way to picture it came later: an <em>activator</em> that makes more of itself, and an <em>inhibitor</em> that it also makes, which holds it back. If the inhibitor spreads faster, each bump of activator surrounds itself with a moat where no other bump can grow. The result is spots or stripes, at a spacing the chemistry chooses.</p>
<h3>Waves from a few places</h3>
<p>In 2023 a team led from the University of Edinburgh found that fingerprint ridges follow this kind of Turing system, with the signals WNT and EDAR as activators and BMP as the inhibitor. Ridges don’t appear everywhere at once. They start at a few sites: the centre of the fingertip’s pad, the tip near the nail, and next to the crease of the last joint. From there they spread as waves, laying ridges roughly parallel to their front. Where waves meet, they leave the Y-shaped triradii. The team’s simulations produced arches, loops, and whorls by changing when, where, and at what angle the sites start: a pad that starts late, for instance, leaves room for the crease’s ridges and makes an arch.</p>
<h3>Why prints differ so much</h3>
<p>The study found that where the sites start, and how their waves meet, makes the variety of fingerprints; in its discussion, the authors add that the tiny random differences typical of Turing patterns make each print more unique still. Identical twins share their genes, and their fingerprints often share a type, but not the details: in one large study twins’ prints had the same type about three times in four, yet a fingerprint matcher told them apart almost as reliably as it tells unrelated people apart. “Grow again” keeps the plan and changes only the tiniest details, and you can watch the ridges end and fork in new places.</p>
<h3>What this room leaves out</h3>
<p>This is a simplified model inspired by that research, not a simulation of real embryonic skin. The fingertip is flat, the starting sites are placed by hand, and no genes or real chemicals appear: just two made-up signals with textbook equations. It leaves out the finger’s growth, its three-dimensional pad, and the sweat pores that later dot every ridge.</p>
<details><summary>The mathematics, if you want it</summary><p>The two signals a (activator) and h (inhibitor) follow equations adapted from the cubic Barrio–Varea–Aragón–Maini model (here the activator spreads a little more slowly, 0.45 instead of 0.516, and h is their v with its sign flipped): ∂a/∂t = 0.45 s ∇²a + 0.899 a − h − 3.15 a h², and ∂h/∂t = s ∇²h + 0.899 a − 0.91 h − 3.15 a h². The even state a = h = 0 is unstable to a range of ripples, fastest-growing at a wavelength of about 9.5√s grid cells, but it stays exactly even until a site nudges it, so ridges spread only as waves from the sites. With no squared terms, stripes win over spots. The ridge spacing slider changes s.</p><p>The room names the result by walking around each point where the ridge direction breaks down and adding up how far the direction turns (its Poincaré index): half a turn one way for a loop’s core, a whole turn for a whorl’s centre, and half a turn the other way for a triradius. Fingerprint examiners use the same landmarks. Points right at the edge of the fingertip are missed.</p></details>
<div class="sources"><a class="source-link" href="https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/" target="_blank" rel="noopener">Glover et al. (2023), The developmental basis of fingerprint pattern formation and variation</a><a class="source-link" href="https://doi.org/10.1098/rstb.1952.0012" target="_blank" rel="noopener">Turing (1952), The chemical basis of morphogenesis</a><a class="source-link" href="https://doi.org/10.1371/journal.pone.0035704" target="_blank" rel="noopener">Tao et al. (2012), Fingerprint recognition with identical twin fingerprints</a><a class="source-link" href="https://doi.org/10.1006/bulm.1998.0093" target="_blank" rel="noopener">Barrio et al. (1999), the model these equations are adapted from</a></div>`,
  },
});
