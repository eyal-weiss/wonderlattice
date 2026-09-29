Wonderlattice.defineText('weather', 'ar', {
  eyebrow: "CHAOS · PREDICTION",
  name: "Weather twins",
  tagline: "Two weathers start almost identical. A few weeks later they have nothing in common.",
  title: "Weather twins.",
  subtitle: "Two weathers start almost exactly alike and follow exactly the same rules. Watch how long they stay alike.",
  field: "Chaos · Differential equations · Prediction",
  sceneLabel: "Three equations · Two starts · No randomness",
  sceneName: "Lorenz’s butterfly",
  tip: "Drag to turn the butterfly · Arrow keys turn it too · Enter releases the twins again",
  actionLabel: "Release again",
  canvasLabel: "Twin paths flying around Lorenz’s butterfly in three dimensions, with a chart of how far apart they are. Drag or use the arrow keys to turn it.",
  panelEyebrow: "Measure the start",
  whyLabel: "Why can’t better measurements save the forecast?",
  nudge: "Try 3 decimal places, then 6, then 12. Each extra place makes the start ten times more precise. How many more days does it buy?",
  connection: {
    html: "<strong>Simple rules, very different fates.</strong> Here, exact rules drive nearby starts apart. In the fireflies’ meadow, simple rules pull different rhythms together.",
    label: "See rhythms fall into step",
  },
  presets: [
    {
      name: "Lorenz’s printout",
      note: "Three decimal places, as on his 1961 printout.",
    },
    {
      name: "Six decimal places",
      note: "A millionth apart. How long do they last?",
    },
    {
      name: "A crowd of twenty",
      note: "Twenty guesses at one start, as forecasters do.",
    },
  ],
  digits: "Decimal places measured",
  digitsHint: "Each extra place makes the start ten times more precise.",
  twins: "Twins",
  twinsHint: "Each twin starts a tiny random distance from the true start.",
  speed: "Speed",
  ghost: "Show the butterfly",
  spin: "Let it turn",
  turn: "Turn the view",
  turnLeft: "Turn the view left",
  turnRight: "Turn the view right",
  tiltUp: "Tilt the view up",
  tiltDown: "Tilt the view down",
  day: (n) => `Day ${n}`,
  days: (n) => `${n} ${n === 1 ? 'day' : 'days'}`,
  statusTogether: (n) => `Day ${n} · the twins are still together`,
  statusParted: (n) => `The forecast held for ${n} ${n === 1 ? 'day' : 'days'}`,
  announceLost: (n) => `The twins have parted: the forecast held for ${n} ${n === 1 ? 'day' : 'days'}.`,
  chartLabel: "How far apart (each line is ten times farther)",
  lostLine: "forecast lost",
  readout: {
    held: "The forecast held for",
    notYet: "still holding",
    rule: "Each extra decimal place buys about",
  },
  guests: [
    {
      name: "Edward Lorenz",
      note: "A three-digit printout taught him that a tiny rounding can grow into a different sky.",
    },
    {
      name: "Henri Poincaré",
      note: "Decades earlier, he saw that small differences at the start can make great ones later.",
    },
  ],
  insight: {
    title: "Why can’t better measurements save the forecast?",
    html: `<p>Nothing here is random. Every twin follows the same three exact equations. The only difference is where they start: less than a millionth apart, on the default setting. Yet the gap between them doesn’t stay small. On average it doubles about every three quarters of a day, so it grows exponentially, and after a couple of weeks the twins are as different as two unrelated weathers.</p>
<div class="insight-visual">a tiny gap × doubling, again and again → a completely different state</div>
<h3>A little more time, never a lot</h3>
<p>Measure the start ten times more precisely and the gap starts ten times smaller. But exponential growth erases that head start in a fixed amount of time: here about two and a half days per decimal place. Twelve decimal places instead of six buys roughly two more weeks, not a forecast that lasts forever. This is sensitive dependence on initial conditions, often called the butterfly effect.</p>
<h3>Lorenz’s printout</h3>
<p>In 1961 the meteorologist Edward Lorenz restarted a weather simulation from numbers on a printout. The computer kept six digits, the printout only three, so 0.506127 went back in as 0.506. The new run tracked the old one for a while, then drifted into completely different weather. The three equations in this room come from his 1963 paper.</p>
<h3>What this model leaves out</h3>
<p>These three equations are a drastically simplified picture of air being heated from below. They show why forecasting has a horizon; they are not a weather simulator. Here one “day” is one unit of the model’s time. Real forecasters face the same problem with far richer models, which is why they run a crowd of slightly different starts, as in “A crowd of twenty”, and report how much the crowd agrees.</p>
<details><summary>The mathematics, if you want it</summary><p>Lorenz’s equations are dx/dt = σ(y − x), dy/dt = x(ρ − z) − y and dz/dt = xy − βz, with σ = 10, ρ = 28 and β = 8/3. Their solutions never settle down and never repeat, yet stay on a butterfly-shaped set called a strange attractor. Nearby solutions separate on average like e<sup>λt</sup>, where λ ≈ 0.9 is the largest Lyapunov exponent. So a start measured to n decimal places, 10<sup>−n</sup> off, stays within a distance D for about ln(D · 10<sup>n</sup>)/λ units of time: each extra place adds ln(10)/λ ≈ 2.5. The room solves the equations with the classical Runge–Kutta method in steps of 0.005, and a forecast counts as lost when a twin is more than 5 units from the truth, about a tenth of the butterfly’s size.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Lorenz_system" target="_blank" rel="noopener">Lorenz system</a><a class="source-link" href="https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2" target="_blank" rel="noopener">E. N. Lorenz, “Deterministic nonperiodic flow”, Journal of the Atmospheric Sciences 20 (1963)</a><a class="source-link" href="https://en.wikipedia.org/wiki/Butterfly_effect" target="_blank" rel="noopener">The butterfly effect</a><a class="source-link" href="https://en.wikipedia.org/wiki/Lyapunov_exponent" target="_blank" rel="noopener">Lyapunov exponent</a></div>`,
  },
});
