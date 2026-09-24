import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';

export default defineConfig({
  server: { host: '127.0.0.1', port: 4173, allowedHosts: ['terminal.local'] },
  plugins: [{
    name: 'copy-offline-experiments',
    generateBundle() {
      for (const name of ['traffic', 'guests', 'trail']) {
        this.emitFile({ type: 'asset', fileName: `experiments/${name}.js`, source: readFileSync(`experiments/${name}.js`) });
      }
      for (const name of readdirSync('portraits')) {
        this.emitFile({ type: 'asset', fileName: `portraits/${name}`, source: readFileSync(`portraits/${name}`) });
      }
    },
  }],
});
