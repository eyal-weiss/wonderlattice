/* Little illustrated visitors. The captions are original writing, not quotations. */
(() => {
  'use strict';

  const biography = name => `https://mathshistory.st-andrews.ac.uk/Biographies/${name}/`;
  const guests = {
    motion: [
      { name: 'Hypatia', note: 'She taught geometry and astronomy in Alexandria. No pause button required.', url: biography('Hypatia'), color: '#bc9de5', hair: 'wave', skin: '#d5a779' },
      { name: 'Leonhard Euler', note: 'Circles and exponentials share a rather elegant dance.', url: biography('Euler'), color: '#acd5a5', hair: 'swept', skin: '#e5bb96' },
    ],
    waves: [
      { name: 'Jules Lissajous', note: 'Two simple vibrations can draw a surprisingly elaborate loop.', url: biography('Lissajous'), color: '#b6b2e8', hair: 'swept', skin: '#d4a27d' },
      { name: 'Sophie Germain', note: 'She studied vibrating plates: geometry you could almost hear.', url: biography('Germain'), color: '#f4b9aa', hair: 'wave', skin: '#c9906c' },
      { name: 'Joseph Fourier', note: 'Many simple waves can hide inside one complicated sound.', url: biography('Fourier'), color: '#a4d8dc', hair: 'curl', skin: '#d9ad86' },
    ],
    flock: [
      { name: 'John Conway', note: 'His Game of Life also makes surprises from tiny local rules.', url: biography('Conway'), color: '#a6d4b3', hair: 'curl', skin: '#dfb48e' },
      { name: 'Alan Turing', note: 'His pattern model showed how local changes can make spots and stripes.', url: biography('Turing'), color: '#b6c8eb', hair: 'swept', skin: '#cc9775' },
    ],
    ribbon: [
      { name: 'August Möbius', note: 'One half twist makes “the other side” a trick question.', url: biography('Mobius'), color: '#95d5e1', hair: 'swept', skin: '#e6b895' },
      { name: 'Johann Listing', note: 'He explored one-sided surfaces, too. History has more than one name.', url: biography('Listing'), color: '#f0c69f', hair: 'curl', skin: '#d7a179' },
    ],
    traffic: [
      { name: 'Dietrich Braess', note: 'A new road can make everyone arrive later. What a plot twist.', url: 'https://homepage.rub.de/dietrich.braess/', color: '#acd9c2', hair: 'swept', skin: '#dbac86' },
      { name: 'John Nash', note: 'Here, no driver can improve alone, even while everyone is slower.', url: biography('Nash'), color: '#d5b9ec', hair: 'curl', skin: '#d2a27e' },
    ],
  };
  const selected = Object.create(null);

  function pick(room) {
    const pool = guests[room];
    if (!pool) return;
    const previous = selected[room] ?? -1;
    selected[room] = (previous + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
  }

  function portrait(guest) {
    const hair = guest.hair === 'wave'
      ? '<path d="M17 36Q12 23 19 16Q28 7 42 15Q52 20 47 38L44 37Q46 25 40 20Q31 14 23 21Q18 28 20 37Z" fill="#2d3441"/><path d="M19 29Q13 39 19 48M45 28Q52 39 45 48" fill="none" stroke="#2d3441" stroke-width="7" stroke-linecap="round"/>'
      : guest.hair === 'curl'
        ? '<path d="M17 33Q13 23 20 18Q18 11 26 12Q31 7 37 12Q46 10 46 18Q52 23 47 33L43 31Q46 22 40 20Q30 14 23 21Q18 25 20 33Z" fill="#34303a"/><circle cx="21" cy="18" r="5" fill="#34303a"/><circle cx="42" cy="18" r="5" fill="#34303a"/>'
        : '<path d="M18 34Q14 25 19 19Q22 12 35 13Q46 12 47 27L45 34Q42 22 36 20Q29 25 20 24Z" fill="#3a3441"/>';
    return `<svg viewBox="0 0 64 64" role="img" aria-label="Playful illustration of ${guest.name}; not a historical likeness" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="${guest.color}"/><circle cx="32" cy="32" r="27" fill="#16202b" opacity=".18"/><path d="M10 57Q12 46 25 44L32 50L39 44Q52 46 54 57Z" fill="#273640" stroke="#eaf3e8" stroke-width="1.5"/><path d="M27 44L32 50L37 44" fill="none" stroke="${guest.color}" stroke-width="2"/><ellipse cx="32" cy="31" rx="15" ry="19" fill="${guest.skin}"/>${hair}<circle cx="26" cy="32" r="1.4" fill="#26303c"/><circle cx="38" cy="32" r="1.4" fill="#26303c"/><path d="M28 40Q32 43 36 40" fill="none" stroke="#814f49" stroke-width="1.6" stroke-linecap="round"/><path d="M30 35L32 36L33 35" fill="none" stroke="#ab755b" stroke-width="1"/></svg>`;
  }

  function render(room, target) {
    if (!target || !guests[room]) return;
    if (selected[room] === undefined) pick(room);
    const guest = guests[room][selected[room]];
    target.innerHTML = `<div class="math-guest-portrait">${portrait(guest)}</div><div class="math-guest-copy"><span class="math-guest-eyebrow">Math history</span><strong>${guest.name}</strong><p>${guest.note}</p><a href="${guest.url}" target="_blank" rel="noopener noreferrer" aria-label="Read about ${guest.name}">Their story ↗</a></div><button type="button" class="math-guest-next" aria-label="Meet another mathematician" title="Meet another mathematician">↻</button>`;
    target.querySelector('button').addEventListener('click', () => { pick(room); render(room, target); });
  }

  globalThis.WonderloomGuests = Object.freeze({ pick, render });
})();
