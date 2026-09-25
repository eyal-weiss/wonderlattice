# Security

Wonderlattice is a static website: no server code, no accounts, no database, and nothing sent from your browser to
the site. The main risks are in what the page itself does with data it reads: shared links, imported trail files, and
contributed translations.

## Reporting a problem

Please report security problems privately, not in a public issue:

- through GitHub's **[private vulnerability reporting](https://github.com/eyal-weiss/wonderlattice/security/advisories/new)**,
  or
- by email to [eyal8488@gmail.com](mailto:eyal8488@gmail.com), with "Wonderlattice security" in the subject.

Include what you found, how to reproduce it, and what an attacker could do with it. This is a one-person project with
no bug bounty; you'll get a reply within a week, and a fix as soon as possible after that. You're welcome to be
credited in the fix unless you prefer not to be.

## In scope

- Running script, or injecting markup, through a shared link, an imported trail file, or a translation file.
- A way around the language-file allowlist (`scripts/lang-guard.mjs`) or the runtime cleaning of translated text.
- Weaknesses in the site's security headers ([`_headers`](_headers)).
- Anything that sends a visitor's data somewhere without them asking.

## Out of scope

- The hosting provider's own infrastructure (Cloudflare): report those to Cloudflare.
- The standalone single-file copy opened from disk, which has no security headers by design.
- Missing best-practice headers with no demonstrated impact, and reports from automated scanners without a working
  example.
