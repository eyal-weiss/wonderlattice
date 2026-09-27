// Loads the core namespace and every room model into this Node process.
// The models are classic browser scripts that attach to globalThis.Wonderlattice.
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import '../../src/core/wonderlattice.js';

// Every room folder with a model, found rather than listed, so a new room needs no edit here.
const rooms = fileURLToPath(new URL('../../src/rooms/', import.meta.url));
for (const id of readdirSync(rooms).sort())
  if (existsSync(`${rooms}${id}/model.js`)) await import(pathToFileURL(`${rooms}${id}/model.js`).href);
