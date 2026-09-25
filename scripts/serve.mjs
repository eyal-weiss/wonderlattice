// Tiny zero-dependency static server for local preview and browser tests.
// Usage: node scripts/serve.mjs [dir] [port]
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.md': 'text/plain; charset=utf-8',
};

// Headers from a Cloudflare-style _headers file in the served folder (dist/ has one): "/path" or "/*" lines,
// each followed by indented "Name: value" lines.
const rules = [];
try {
  for (const line of readFileSync(join(root, '_headers'), 'utf8').split('\n')) {
    if (/^\s*(#|$)/.test(line)) continue;
    if (!/^\s/.test(line)) rules.push({ path: line.trim(), headers: {} });
    else if (rules.length) {
      const at = line.indexOf(':');
      rules.at(-1).headers[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
  }
} catch {
  /* no _headers here */
}
const headersFor = (path) =>
  Object.assign(
    {},
    ...rules
      .filter((r) => r.path === path || (r.path.endsWith('*') && path.startsWith(r.path.slice(0, -1))))
      .map((r) => r.headers),
  );

createServer(async (req, res) => {
  try {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let file = join(root, path);
    if (file !== root && !file.startsWith(root + sep)) throw Object.assign(new Error('forbidden'), { code: 'ENOENT' });
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { ...headersFor(path), 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Wonderlattice at http://localhost:${port}/ (serving ${root}). Stop with Ctrl+C.`);
});
