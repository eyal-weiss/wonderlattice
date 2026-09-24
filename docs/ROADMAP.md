# Wonderloom: Experiment Roadmap

## Your question

I want to add a lot more experiments to help users learn concepts from probability theory and statistics, complex analysis, combinatorics and more. Interesting and cool stuff. Explanations about the math behind famous games (such soduko and rubrik's cube), Craftsmanship, biological phenomena in the body and more. I want diversity that shows how math help to really describe huge parts of the world, to inspire kids, teenagers and even adults to study how math helps to explain the world around us.

don't implement anything yet, just help me come up with a high plan for concrete experiments.

## My answer

I’d expand Wonderloom into a collection of **small discoveries about the world**, each built around something the visitor can _do_: make a pattern, investigate a mystery, change a system, or challenge an intuition.

The key design rule should be: **every experiment has one memorable surprise and one idea worth taking away.** The mathematical field becomes something visitors discover behind the experience.

Here is a concrete collection of **24 possible experiments**. ★ marks the eight I would prioritize.

For **probability and statistics**, I’d emphasize how mathematics helps us reason when individual events are unpredictable.

| Experiment                             | What the visitor does                                                                                                                             | What they discover                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **★ The dice that beat each other**    | Choose an unusual die, challenge another, and watch hundreds of rolls. Reveal a circle of victories: A usually beats B, B beats C, and C beats A. | Probability does not always produce a simple ranking. “Best” can depend on the opponent.                                                                      |
| **★ A spoonful of a city**             | Estimate the favorite color of an animated city by sampling residents. Compare random sampling with asking only people in one neighborhood.       | A larger sample reduces random uncertainty, but it does not necessarily fix a biased sampling method.                                                         |
| **The imperfect treasure detector**    | Sweep an island with a detector that sometimes makes mistakes. Change how rare the treasure is, then investigate its alerts.                      | An apparently accurate detector can produce many false alarms when the thing it seeks is rare. A visual introduction to Bayes’ rule.                          |
| **The shape hiding inside randomness** | Invent a strange distribution of dice results. Repeatedly draw small groups and plot their averages.                                              | For suitable independent samples, averages develop a surprisingly familiar bell shape. Show the raw outcomes beside the averages so the distinction is clear. |
| **The leaderboard that lies**          | Compare two basketball players across easy and difficult shots. Combine or separate their statistics.                                             | A player can perform better in both categories yet have a worse overall percentage because they took different mixtures of shots: Simpson’s paradox.          |

Nontransitive dice are particularly suitable for Wonderloom: the rules are immediately understandable, but the result challenges an assumption most people never realized they held. [Source: NRICH — Non-Transitive Dice](https://nrich.maths.org/problems/non-transitive-dice?tab=teacher)

For **complex analysis**, I’d make the abstract ideas feel like places visitors can explore.

| Experiment                           | What the visitor does                                                                                                                                                         | What they discover                                                                                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **★ Bend the plane**                 | Draw a fish, a face, or a grid, then send it through transformations such as squaring and inversion. Watch a small compass travel through the transformed world.              | Complex functions reshape an entire plane. Some preserve local angles where their derivatives are nonzero, even while dramatically changing sizes and shapes. |
| **Two trips to get home**            | Guide a point around the origin while a second point follows one continuously chosen square root. After one lap, the follower is on the opposite side; after two, it returns. | Why complex square roots have two branches, and why mathematicians invent Riemann surfaces.                                                                   |
| **A seed for an infinite landscape** | Drag a single “seed” through a parameter map and watch its Julia set change. Follow individual points to see whether their journeys escape or remain bounded.                 | Repeating a tiny rule can create extraordinary complexity. Connect the parameter map to the Mandelbrot set.                                                   |

The square-root experiment is an especially good candidate for a surprising room with real depth. It could connect beautifully to the existing Möbius ribbon, while explaining that the two constructions are different. Complex mappings also offer a later application: transforming idealized flow around a circle into flow around a wing. Sources: [Complex Square Root](https://webapps.math.uci.edu/~vmm/ConformalMaps/sqrt/index.html); [MIT — Complex Variables with Applications: Lecture Notes](https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/).

For **famous games and combinatorics**, the experience should reveal the machinery behind games people already recognize.

| Experiment                         | What the visitor does                                                                                                                                                                  | What they discover                                                                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **★ Sudoku, made transparent**     | Start with a small 4×4 puzzle using colors or symbols. Place one piece and watch possibilities disappear elsewhere. Turn on a network view connecting cells that constrain each other. | Sudoku is about constraints and relationships; the symbols need not be numbers. Introduce graph coloring, logical deduction, and the difference between one solution and several. |
| **★ Inside the Rubik’s Cube**      | Compare “turn right, then top” with the reverse order. Track individual pieces, undo moves, and explore short sequences that disturb only part of the cube.                            | Order matters. Moves have inverses, and carefully composed moves can achieve targeted changes: a tactile introduction to group theory.                                            |
| **The impossible floor**           | Cover a board with dominoes, then remove selected squares. When a layout seems impossible, reveal a checkerboard coloring.                                                             | A simple invariant can prove impossibility without testing every arrangement. Also show that passing the color-count test does not guarantee a solution.                          |
| **A card game in four dimensions** | Find matching triples in a SET-inspired attribute space, then watch the cards become points connected by lines. Begin with two attributes before adding more.                          | Finite geometry and modular arithmetic can hide inside an approachable visual game.                                                                                               |

Sudoku’s graph interpretation and the cube’s algebraic structure are established mathematical connections, giving us a sound foundation for optional deeper explanations. Sources: [Sudoku Squares and Chromatic Polynomials](https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf); [Algorithms for Solving Rubik’s Cubes](https://arxiv.org/abs/1106.5736).

For **craftsmanship and making**, I’d let visitors create something they actually want to keep, with an optional bridge into a physical activity.

| Experiment                       | What the visitor does                                                                                                                                | What they discover                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **★ The mathematical loom**      | Toggle which threads pass over and under, then watch cloth grow. Change a repeating rule to produce stripes, twills, and more intricate patterns.    | Binary patterns, periodicity, and modular arithmetic become a material. Let visitors export a simple weaving draft. |
| **Crochet a different geometry** | Change how often extra stitches are added. Watch a simulated surface become flat, bowl-like, or ruffled.                                             | Local growth rules shape global curvature. Offer a real crochet pattern alongside the visualization.                |
| **Fold a machine**               | Pull the corner of a folded sheet and watch an entire crease pattern open together. Change crease angles and compare compactness.                    | Geometry can coordinate motion. Connect paper folding to deployable structures and spacecraft engineering.          |
| **A tile that fills the world**  | Reshape an edge of a tile while its paired edge updates. Paint one tile and watch the design spread through translations, rotations, or reflections. | Repetition has structure. Symmetry can turn a small artistic choice into a large coherent design.                   |

Hyperbolic crochet and origami-inspired solar arrays provide particularly compelling connections between mathematics, handcraft, and engineering. These are real practices we can point visitors toward after playing. Sources: [Crochet Coral Reef — Hyperbolic Space](https://crochetcoralreef.org/artscience/hyperbolicspace/); [NASA JPL — Solar Power, Origami-Style](https://www.jpl.nasa.gov/news/solar-power-origami-style/).

For **the human body**, I’d favor processes visitors can recognize without requiring biological vocabulary first.

| Experiment                  | What the visitor does                                                                                                                                                    | What they discover                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **★ Grow a fingerprint**    | Place a few starting regions on a virtual fingertip and watch ridges emerge and meet. Change the starting conditions to produce different arrangements.                  | Interacting chemical signals can organize patterns without a central drawing plan. Introduce reaction–diffusion through a simplified, research-informed model. |
| **A heartbeat travels**     | Tap a sheet of animated cells. Watch an excitation wave spread, cells recover, and subsequent waves behave differently. Add an obstacle and explore changing wave paths. | A heartbeat involves coordinated electrical propagation. Recovery time and spatial structure matter.                                                           |
| **A body full of clocks**   | Start with many little clocks drifting at different rates. Add coupling and a day–night signal, then abruptly shift the lighting cycle.                                  | Synchronization and entrainment help explain how biological rhythms coordinate and adjust.                                                                     |
| **Why cells stay small**    | Enlarge a cell and watch particles enter through its surface and travel inward. Compare a single large compartment with many smaller ones.                               | Surface area, volume, and diffusion scale differently. Connect the idea to exchange surfaces in the body without claiming it explains every biological shape.  |
| **See inside with shadows** | Hide a shape inside a virtual body slice. Take measurements from different angles and watch a reconstruction emerge.                                                     | Mathematics can recover internal structure from indirect measurements: an introduction to tomography and inverse problems.                                     |

The fingerprint connection is supported by research identifying a reaction–diffusion mechanism in ridge formation. Circadian coordination and mathematical reconstruction in CT also have clear scientific foundations. These rooms should explain what the model captures and what it leaves out. Sources: [The developmental basis of fingerprint pattern formation and variation](https://www.research.ed.ac.uk/en/publications/the-developmental-basis-of-fingerprint-pattern-formation-and-vari/); [NIGMS — Circadian rhythm](https://www.nigms.nih.gov/image-gallery/2569); [The Nobel Prize in Physiology or Medicine 1979 — Press release](https://www.nobelprize.org/prizes/medicine/1979/press-release/).

Finally, I’d add a few experiments linking mathematics to **weather, communication, and digital media**.

| Experiment                               | What the visitor does                                                                                                                         | What they discover                                                                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Weather twins**                        | Release two almost identical states into a simple chaotic system and watch their paths separate. Repeat with different measurement precision. | Deterministic rules can still produce limited predictability. Present this as a model illustrating a forecasting difficulty, rather than a weather simulator. |
| **★ Send a picture through a storm**     | Draw a small pixel picture, transmit it through randomly corrupted bits, then add different forms of redundancy.                              | Extra information can help detect or correct errors. Show the limits of each code as noise increases.                                                         |
| **How much picture can you throw away?** | Gradually remove components from a photograph or drawing, switching between coarse structure and fine detail.                                 | Images can be represented in different mathematical bases. Compression becomes a visible negotiation between detail and size.                                 |

I would give every room three optional depths, available to everyone rather than separated by age:

- **Play:** something responds immediately to touch, dragging, or a simple choice.
- **Notice:** a short invitation such as “What changes if you reverse those two moves?” or “Try sampling from another neighborhood.”
- **Go deeper:** an animated explanation, optional narration, the mathematical name, and eventually equations or a small proof.

Sound should carry meaning where it helps: rolls accumulating, a loom’s rhythm, a wave passing through cells, or clocks coming into synchrony. The same information should also be available visually. Some rooms could offer a cooperative activity or a printable experiment, so Wonderloom occasionally leads people away from the screen.

**My recommended first expansion is the eight starred experiments.** Together they cover chance, evidence, complex functions, two familiar games, making, biology, and communication. The cube and fingerprint rooms deserve more development time; their appeal depends on faithful behavior and a strong explanation.

I’d prototype them in small groups and judge each by three questions:

1. Can someone enjoy the first minute without reading instructions?
2. Can they describe one thing they noticed afterward?
3. Does the room invite a second visit with a different question?

The existing trail can support that last part. A saved scene might later offer a connection such as **“You explored how local rules weave cloth. What happens when local chemical interactions make a pattern in skin?”** That makes progress feel like an expanding understanding of the world, with plenty of room for personal curiosity.
