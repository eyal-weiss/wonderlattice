# Provenance and verification

Export date: 2026-09-23 (UTC).
Application source: Wonderloom v0.2.0, original source commit 79d85f89e579e30a8cd6e2a68028f5f6743e7c0c.
index.html SHA-256: 0fa0cd5625f001abcabeba818c3275aacc6299e2091c7012dd3818ab2942517b

The app's index.html is byte-for-byte identical to the source snapshot. This handoff adds documentation and an MIT license, and binds the optional Vite development server to the loopback address. It excludes hosting configuration, credentials, git internals, downloaded dependencies, and generated build output. Git history is not included; all current application source is included.

Validation results are recorded below after running the checks. Browser-rendering and audible-playback verification are distinct from automated DOM/model checks.

- Production build passed with Vite 8.0.13 and the installed locked dependencies. A fresh internet dependency install was not tested.
- Existing automated DOM/model harness passed against this exported HTML with both HTTPS and file:// document URLs. Checks cover room navigation, wave cancellation, tone scheduling, audio stop behavior, flock invariants, ribbon connectivity, and parameter validation. Canvas and audio APIs are mocked in this harness.
- No new visual browser review or audible-playback check was performed for this export; application bytes were not changed.
