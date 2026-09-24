# Project state — 2026-09-23

## Review fix — 2026-09-24

The traffic room now draws distinct, visible moving markers along the active routes and shows a large before/after travel-time comparison. At 4,000 drivers, opening the shortcut changes the display from 65 to 80 minutes and highlights that everyone takes 15 minutes longer. The earlier markers blended into the road and the result was easy to miss. The markers represent route proportions, not individual vehicle trajectories. Browser checks covered the closed/open result and moving frames; the Node traffic tests and static build also passed. The review site has been updated, while the private repository pull request remains open pending owner feedback.

## Working and included

- Geometry: drawing with combined rotations, presets, parameter controls, PNG export.
- Waves: summed signals, audible tones, phase cancellation, beats, Lissajous portraits.
- Emergence: adjustable flocking model, pointer interaction, neighbor view.
- Topology: interactive projected ribbon, half-twists, highlighted edges, traveler.
- Optional explanatory text, browser narration, URL/settings sharing, responsive layout.
- Networks: traffic shortcut paradox, adjustable demand, route proportions, and optional model explanation (on agent/braess-traffic pending review).
- Independent source export, offline use, MIT license, AI handoff and translation guides.

## Requested but not yet implemented

- Separate experiment code and visitor-facing content into readable modules, retaining an offline export.
- Add an in-app “Make your own version” flow with source download and an AI prompt containing current settings.
- Complete visual, mobile, keyboard, and signed-out release checks.
- The owner created a private `eyal-weiss/wonderloom` GitHub repository. The initial project source and collaboration guides have been imported; GitHub App access to this repository is granted. Making the repository public, if ever desired, is a separate decision.
- Publish for public visitors; the last confirmed ChatGPT-hosted site access was owner-only.
- Prepare a short demo video and social launch material. Nothing has been posted to X.
- Add a permanent link from the personal website only after feedback warrants it.

## Next priority from the owner

Full control: the owner must be able to continue with an editor or another AI even when GPT usage is exhausted. Keep a local copy and use the owner's private repository as the canonical source. This local folder does not itself update GitHub or change hosting.

## Recommended next implementation sequence

1. Use separate branches and pull requests for concurrent work.
2. Refactor without changing existing behavior; preserve standalone offline output.
3. Add and verify the traffic experiment and in-app remixing.
4. Complete release QA, deploy under an owner-controlled account, and review the demo/post before sharing.
