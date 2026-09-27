// Keeps index.html in step with the room folders, so adding a room needs no hand-edited script list.
//   npm run rooms              link every room folder that index.html doesn't yet load
//   npm run rooms -- --check   fail if a folder isn't linked, or a linked room has no folder (CI runs this)
// A new room's tags go just before src/core/app.js (its stylesheet after the other rooms'); move them to
// place the room elsewhere in the navigation order.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const file = join(root, 'index.html');
let html = readFileSync(file, 'utf8');
const check = process.argv.includes('--check');

const folders = readdirSync(join(root, 'src/rooms')).filter((id) => existsSync(join(root, 'src/rooms', id, 'room.js')));
const linked = [...html.matchAll(/src="\.\/src\/rooms\/([a-z]+)\/room\.js"/g)].map((m) => m[1]);
const problems = [];
for (const id of linked)
  if (!folders.includes(id)) problems.push(`index.html loads src/rooms/${id}/room.js, which doesn't exist`);

const tags = (id) =>
  ['model.js', 'text.en.js', 'room.js']
    .filter((f) => existsSync(join(root, 'src/rooms', id, f)))
    .map((f) => `    <script src="./src/rooms/${id}/${f}"></script>\n`)
    .join('');

const added = [];
for (const id of folders) {
  for (const f of ['model.js', 'text.en.js']) {
    if (linked.includes(id) && existsSync(join(root, 'src/rooms', id, f)) && !html.includes(`./src/rooms/${id}/${f}"`))
      problems.push(`index.html loads the ${id} room but not its ${f}`);
  }
  const css = existsSync(join(root, 'src/rooms', id, 'room.css'));
  const cssLinked = html.includes(`./src/rooms/${id}/room.css"`);
  if (linked.includes(id) && (!css || cssLinked)) continue;
  if (check) {
    problems.push(
      linked.includes(id)
        ? `index.html doesn't link src/rooms/${id}/room.css`
        : `the ${id} room isn't linked from index.html`,
    );
    continue;
  }
  if (!linked.includes(id)) {
    const app = '    <script src="./src/core/app.js"></script>';
    if (!html.includes(app)) throw new Error('index.html has no src/core/app.js script tag');
    html = html.replace(app, tags(id) + app);
  }
  if (css && !cssLinked) {
    const sheets = [...html.matchAll(/ *<link rel="stylesheet" href="\.\/src\/rooms\/[a-z]+\/room\.css" \/>\n/g)];
    const after = sheets.at(-1) ?? html.match(/ *<link rel="stylesheet" href="\.\/styles\/trail\.css" \/>\n/);
    if (!after) throw new Error('index.html has no stylesheet to put a room stylesheet after');
    const at = after.index + after[0].length;
    html = html.slice(0, at) + `    <link rel="stylesheet" href="./src/rooms/${id}/room.css" />\n` + html.slice(at);
  }
  added.push(id);
}

if (problems.length) {
  problems.forEach((p) => console.error('  ✗ ' + p));
  console.error(check ? 'Run npm run rooms to link new rooms.' : '');
  process.exit(1);
}
if (added.length) {
  writeFileSync(file, html);
  console.log(`Linked from index.html: ${added.join(', ')}. Move the tags to change the room's place.`);
} else console.log(`All ${folders.length} rooms are linked from index.html.`);
