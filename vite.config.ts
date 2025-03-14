import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    svelte(),
    nodePolyfills({
      exclude: ['fs'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      process: 'process/browser',
      Buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['@web3auth/modal', 'buffer', 'process'],
  },
});