/*
 * The feedback box: a short note to the maker, at the end of each explanation and in About. Nothing is sent until the
 * visitor presses Send; then the words, the page they came from and the page's language go to the site's own
 * /api/feedback (functions/api/feedback.js), which files them in a private repository. Opened from a file there is
 * no server to send to, so the box points to GitHub instead. The page marks where boxes go (data-feedback), and the
 * app says where the visitor is: init((box) => ({ room, place })).
 */
(() => {
  'use strict';

  const W = Wonderlattice;
  const MAX = 2000; // characters, as functions/api/feedback.js accepts
  const ISSUES = 'https://github.com/eyal-weiss/wonderlattice/issues';

  const el = (tag, className, text) => {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.textContent = text;
    return e;
  };

  /** Sends a note; says how it went: 'sent', 'tooMany' or 'failed'. */
  async function post(note) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (response.ok) return 'sent';
      return response.status === 429 ? 'tooMany' : 'failed';
    } catch {
      return 'failed';
    }
  }

  function build(host, where) {
    const t = W.text('app').feedback;
    const details = el('details', 'feedback-box');
    details.append(el('summary', '', t.open));
    host.replaceChildren(details);
    if (location.protocol === 'file:') {
      const note = el('p', 'feedback-note', `${t.offline} `);
      const link = el('a', '', t.offlineLink);
      link.href = ISSUES;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      note.append(link);
      details.append(note);
      return;
    }
    const id = `feedback-${host.dataset.feedback}`;
    const form = el('form', 'feedback-form');
    const label = el('label', '', t.label);
    label.htmlFor = id;
    const words = el('textarea', 'text-area');
    words.id = id;
    words.rows = 3;
    words.maxLength = MAX;
    // People never see this field; a robot that fills in every field fills it too (the inbox then files nothing).
    const trap = el('input', 'feedback-trap');
    trap.name = 'website';
    trap.tabIndex = -1;
    trap.autocomplete = 'off';
    trap.setAttribute('aria-hidden', 'true');
    const row = el('div', 'feedback-row');
    const send = el('button', 'button', t.send);
    send.type = 'submit';
    send.disabled = true;
    const status = el('p', 'feedback-status');
    status.setAttribute('role', 'status');
    row.append(send, status);
    form.append(label, words, trap, row, el('p', 'feedback-note', t.note));
    details.append(form);

    words.addEventListener('input', () => {
      send.disabled = !words.value.trim();
      status.textContent = '';
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!words.value.trim() || send.textContent === t.sending) return;
      send.disabled = true;
      send.textContent = t.sending;
      status.textContent = '';
      const result = await post({ message: words.value, trap: trap.value, lang: W.lang, ...where() });
      send.textContent = t.send;
      status.textContent = t[result];
      status.dataset.result = result;
      if (result === 'sent') words.value = '';
      send.disabled = !words.value.trim();
    });
    // A dialog that closes forgets the last result; unsent words stay, in case the visitor comes back for them.
    host.closest('dialog')?.addEventListener('close', () => {
      status.textContent = '';
      delete status.dataset.result;
    });
  }

  W.feedback = {
    init(where) {
      for (const host of document.querySelectorAll('[data-feedback]')) build(host, () => where(host.dataset.feedback));
    },
  };
})();
