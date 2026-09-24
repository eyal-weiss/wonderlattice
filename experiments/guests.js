/* Historical portraits in playful paper puppets. Captions are original writing. */
(() => {
  'use strict';

  const bio = name => `https://mathshistory.st-andrews.ac.uk/Biographies/${name}/`;
  const commons = name => `https://commons.wikimedia.org/wiki/File:${name}`;
  // Frame: source image width and offset within the 56px circular head.
  const guests = {
    motion: [
      {name:'Emmy Noether',note:'A hidden symmetry can reveal something that never changes.',url:bio('Noether'),image:'noether.jpg',source:commons('Noether.jpg'),color:'#bc9de5',frame:[185,-65,-22]},
      {name:'Leonhard Euler',note:'Circles and exponentials share a rather elegant dance.',url:bio('Euler'),image:'euler.jpg',source:commons('Leonhard_Euler_-_Jakob_Emanuel_Handmann_(Kunstmuseum_Basel).jpg'),color:'#acd5a5',frame:[125,-36,-21]},
    ],
    waves: [
      {name:'Jules Lissajous',note:'Two simple vibrations can draw a surprisingly elaborate loop.',url:bio('Lissajous'),image:'lissajous.jpg',source:commons('Jules_Antoine_Lissajous.jpeg'),color:'#b6b2e8',frame:[200,-69,-30]},
      {name:'Joseph Fourier',note:'Many simple waves can hide inside one complicated sound.',url:bio('Fourier'),image:'fourier.jpg',source:commons('Joseph_Fourier.jpg'),color:'#a4d8dc',frame:[160,-50,-21]},
    ],
    flock: [
      {name:'John Conway',note:'His Game of Life also makes surprises from tiny local rules.',url:bio('Conway'),image:'conway.jpg',source:commons('John_H_Conway_2005_(cropped).jpg'),color:'#a6d4b3',frame:[100,-23,-12],credit:'Thane Plambeck',license:'https://creativecommons.org/licenses/by/2.0/'},
      {name:'Alan Turing',note:'His pattern model showed how local changes can make spots and stripes.',url:bio('Turing'),image:'turing.jpg',source:commons('Alan_Turing_(1951).jpg'),color:'#b6c8eb',frame:[115,-28,-21]},
    ],
    ribbon: [
      {name:'August Möbius',note:'One half twist makes “the other side” a trick question.',url:bio('Mobius'),image:'mobius.png',source:commons('August_Ferdinand_Möbius.png'),color:'#95d5e1',frame:[142,-43,-31]},
      {name:'Johann Listing',note:'He explored one-sided surfaces, too. History has more than one name.',url:bio('Listing'),image:'listing.jpg',source:commons('J-B-Listing.jpg'),color:'#f0c69f',frame:[145,-46,-37]},
    ],
    traffic: [
      {name:'John von Neumann',note:'Traffic is a game of choices, and a clever move can surprise everybody.',url:bio('Von_Neumann'),image:'vonneumann.jpg',source:commons('HD.3F.191_(11239892036).jpg'),color:'#acd9c2',frame:[95,-15,-18]},
      {name:'John Nash',note:'Here, no driver can improve alone, even while everyone is slower.',url:bio('Nash'),image:'nash.jpg',source:commons('John_Forbes_Nash_(1928-2015)_portrait.jpg'),color:'#d5b9ec',frame:[120,-30,-28]},
    ],
  };
  const selected = Object.create(null);

  function pick(room) {
    const pool = guests[room];
    if (!pool) return;
    const previous = selected[room] ?? -1;
    selected[room] = (previous + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
  }

  function puppet(guest) {
    const [size,x,y] = guest.frame;
    return `<div class="math-guest-puppet" style="--guest-accent:${guest.color};--portrait-size:${size}px;--portrait-x:${x}px;--portrait-y:${y}px" aria-hidden="true"><span class="math-guest-spark">✦</span><span class="math-guest-figure"><span class="math-guest-leg math-guest-leg-left"></span><span class="math-guest-leg math-guest-leg-right"></span><span class="math-guest-arm math-guest-arm-left"></span><span class="math-guest-arm math-guest-arm-right"></span><span class="math-guest-outfit"><span class="math-guest-bow">◆</span></span><span class="math-guest-head"><img src="./portraits/${guest.image}" alt="" width="${size}" loading="lazy"></span></span></div>`;
  }

  function render(room,target) {
    if (!target || !guests[room]) return;
    if (selected[room] === undefined) pick(room);
    const guest = guests[room][selected[room]];
    const credit = guest.credit ? `<span class="math-guest-credit">Photo: ${guest.credit} · <a href="${guest.license}" target="_blank" rel="noopener noreferrer">CC BY 2.0</a></span>` : '';
    target.innerHTML = `${puppet(guest)}<div class="math-guest-copy"><span class="math-guest-eyebrow">Math history · historical portrait</span><strong>${guest.name}</strong><p>${guest.note}</p><a href="${guest.url}" target="_blank" rel="noopener noreferrer" aria-label="Read about ${guest.name}">Story ↗</a><a class="math-guest-source" href="${guest.source}" target="_blank" rel="noopener noreferrer" aria-label="Portrait source for ${guest.name}">Portrait ↗</a>${credit}</div><button type="button" class="math-guest-next" aria-label="Meet another mathematician" title="Meet another mathematician">↻</button>`;
    target.querySelector('button').addEventListener('click',()=>{ pick(room); render(room,target); });
  }

  globalThis.WonderloomGuests = Object.freeze({pick,render});
})();
