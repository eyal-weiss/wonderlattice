import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

export default defineConfig({
  server: { host: '127.0.0.1', port: 4173, allowedHosts: ['terminal.local'] },
  plugins: [{
    name: 'copy-offline-experiment',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'experiments/traffic.js', source: readFileSync('experiments/traffic.js') });
    },
  }],
});
