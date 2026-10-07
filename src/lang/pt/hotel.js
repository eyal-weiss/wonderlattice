/* The hotel that is always full · visitor-facing words (pt). */
Wonderlattice.defineText('hotel', 'pt', {
  eyebrow: 'INFINITY',
  name: 'The hotel that is always full',
  tagline: 'Every room is taken, yet one more guest fits, then endlessly many. Then comes a coach that never can.',
  title: 'The hotel that is always full.',
  subtitle:
    'Every room of an endless hotel is taken, yet watch it fit one more guest, then a coach of endless passengers. Then try the coach of coin flips.',
  field: 'Infinity · Pairing off · Cantor’s diagonal argument',
  sceneLabel: 'Rooms 1, 2, 3, … without end',
  sceneNames: ['One more guest', 'An endless coach', 'Endless coaches', 'The coin-flip coach'],
  tip: 'Pick a moving card in the panel · With the coin-flip coach, tap a flip to change it (arrow keys aim, Enter flips)',
  actionLabel: 'Next arrival',
  canvasLabel:
    'An endless hotel corridor with numbered doors shrinking into the distance, every room taken. New guests arrive, and every guest moves at once to free rooms for them. With the coin-flip coach, a list of passengers, one per room, and a new passenger built from its diagonal. Tap a flip to change it, or use the arrow keys to aim and Enter to flip.',
  panelEyebrow: 'Moving cards',
  whyLabel: 'How can a full hotel take more guests?',
  nudge:
    'After the endless coach, press “Next arrival”: endless coaches, then a coach whose passengers no list of rooms can hold.',
  connection: {
    html: '<strong>Impossible, whatever you try.</strong> Here, no list of rooms holds every coin-flip passenger. In “The impossible floor”, a colouring proves that no tiling can cover the board.',
    label: 'Visit “The impossible floor”',
  },

  presets: [
    { name: 'One more guest', note: 'The hotel is full. A guest knocks.' },
    { name: 'Endless coaches', note: 'Endlessly many, each one full.' },
    { name: 'The coin-flip coach', note: 'The coach that cannot fit.' },
  ],

  // The moving cards: the big face, and what it tells the guest in room n.
  cards: {
    one: { face: '+1', rule: 'room n → room n + 1' },
    five: { face: '+5', rule: 'room n → room n + 5' },
    double: { face: '×2', rule: 'room n → room 2n' },
    zigzag: { face: 'Zigzag', rule: 'walk the seats back and forth' },
    admit: { face: '+1', rule: 'seat the new passenger in room 1' },
    shuffle: { face: '↻', rule: 'a new list: every room gets new flips' },
  },
  pick: 'Pick a card. Every guest moves at once.',
  everyone: (face) => `Everyone ${face}`,

  // Drawn on the picture.
  full: 'NO VACANCIES',
  vacant: 'VACANCIES',
  guest: 'New guest',
  coach: 'Endless coach',
  queue: 'Passengers 1, 2, 3, …',
  hotelRow: 'Hotel',
  coachRow: (n) => `Coach ${n}`,
  seat: 'Seats 1, 2, 3, …',
  rooms: 'Rooms 1, 2, 3, …',
  room: (n) => `Room ${n}`,
  heads: 'H',
  tails: 'T',
  flips: 'Flips 1, 2, 3, …',
  passenger: 'New passenger',
  question: '“Which room is mine?”',
  differs: 'Different at the diagonal',

  listHint: 'Tap any flip in the picture to change it. The diagonal changes too, and its passenger is still left out.',
  status: {
    waiting: ['A new guest knocks. Every room is taken.', 'An endless coach arrives.', 'Endless coaches arrive.'],
    one: ['Room 1 came free. Still no vacancies.', 'Passenger 1 is in. Passengers 2, 3, 4, … wait.'],
    five: ['The guest is in, and rooms 2 to 5 stand empty.', 'Passengers 1 to 5 are in. 6, 7, 8, … wait.'],
    double: [
      'The guest is in, and the odd rooms stand empty.',
      'Passenger n has room 2n − 1. Still no vacancies.',
      'Coach 1 is in. Coaches 2, 3, 4, … wait.',
    ],
    zigzag: 'Every seat of every coach has a room.',
    tracing: (room, row, seat) =>
      row === 0 ? `Room ${room}: the guest from room ${seat}` : `Room ${room}: coach ${row}, seat ${seat}`,
    building: (k) => `Flip ${k}: the opposite of room ${k}’s flip ${k}`,
    built: 'No room has them: they differ from room k at flip k.',
    admitted: 'Seated in room 1, yet the new diagonal leaves someone out.',
    edited: 'A new diagonal, and still someone left out.',
    shuffled: 'A new list, and still someone left out.',
  },

  guests: [
    {
      name: 'David Hilbert',
      note: 'In a lecture in 1924 I told of a hotel with endlessly many rooms, all taken, that can still take a newcomer. A completed infinity behaves like nothing finite.',
    },
    {
      name: 'Georg Cantor',
      note: 'In 1891 I showed that endless strings of two symbols can’t all be listed: change the first symbol of the first string, the second of the second, and so on, and you have one the list missed.',
    },
    {
      name: 'George Gamow',
      note: 'In my 1947 book, One Two Three… Infinity, I retold Hilbert’s hotel for everyone. That is how most people first heard of it.',
    },
  ],

  insight: {
    title: 'How can a full hotel take more guests?',
    html: `<p>“Infinitely many” isn’t a number you can count up to, so the hotel can’t compare sizes by counting. What it can do is pair things off. Two collections have the <em>same size</em> when they can be paired off exactly, one with one, nobody left over. The guests and the rooms are paired off: every room is taken.</p>
<div class="insight-visual">+1: room n → room n + 1 · ×2: room n → room 2n · no two guests ever share a room</div>
<h3>Room for a coach</h3>
<p>“Everyone +1” is a new pairing: the old guests with rooms 2, 3, 4, …, which leaves room 1 for the newcomer. “Everyone ×2” sends the old guests to the even rooms and leaves every odd room free, so a whole endless coach fits: passenger n takes room 2n − 1. The even numbers are as many as all the whole numbers. A part as big as the whole is exactly what makes a collection infinite. Here no sum like “infinity plus one” is being worked out; every step is a pairing.</p>
<h3>Endless coaches</h3>
<p>Write the coaches as rows and their seats as columns. A zigzag along the short diagonals, back and forth from the corner, reaches every seat of every coach after finitely many steps, so each gets a room of its own (this is Cantor’s pairing). The same zigzag lists every fraction. Any collection that can be listed like this is called <em>countable</em>.</p>
<h3>The coach that cannot fit</h3>
<p>Each passenger of the last coach is named by an endless string of coin flips. Try to give them rooms: room 1 gets one string, room 2 another, and so on. Now build a passenger whose first flip is the opposite of room 1’s first flip, whose second is the opposite of room 2’s second, and so on down the diagonal. This passenger differs from room k’s guest at flip k, for every k, so they have no room. That works for every list, however clever. So there are more endless coin-flip strings than rooms: a bigger infinity. This is Cantor’s diagonal argument of 1891. Read heads as 1 and tails as 0, and each string is a number between 0 and 1 in binary; the same argument (with a little care, since 0.0111… and 0.1000… are the same number) shows that the real numbers can’t be listed either.</p>
<h3>What the picture leaves out</h3>
<p>It shows a few dozen doors and an 8 × 8 corner of the list, but the argument is about every room and every flip at once: flip 100 of the new passenger is the opposite of room 100’s flip 100, far off the picture. No real hotel could move infinitely many guests in one step; mathematics can, because a rule like “room n → room 2n” says where everyone goes at once.</p>
<h3>Where the story comes from</h3>
<p>David Hilbert told the hotel story in a lecture in January 1924; his notes stayed unpublished for decades. George Gamow’s book <em>One Two Three… Infinity</em> (1947) made it famous, as Helge Kragh traces. Georg Cantor’s diagonal argument appeared in 1891, though it was not his first proof that the real numbers can’t be listed: that one, from 1874, used a different argument.</p>
<div class="sources"><a class="source-link" href="https://arxiv.org/abs/1403.0059" target="_blank" rel="noopener">Kragh (2014), The true (?) story of Hilbert’s infinite hotel</a><a class="source-link" href="https://en.wikipedia.org/wiki/Hilbert%27s_paradox_of_the_Grand_Hotel" target="_blank" rel="noopener">Hilbert’s paradox of the Grand Hotel</a><a class="source-link" href="https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument" target="_blank" rel="noopener">Cantor’s diagonal argument</a><a class="source-link" href="https://en.wikipedia.org/wiki/Pairing_function" target="_blank" rel="noopener">Pairing functions</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/" target="_blank" rel="noopener">MacTutor: Georg Cantor</a><a class="source-link" href="https://en.wikipedia.org/wiki/One_Two_Three..._Infinity" target="_blank" rel="noopener">Gamow, One Two Three… Infinity (1947)</a></div>`,
  },
});
