import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [nxViteTsPaths(), react()],
  root: __dirname,
  build: {
    outDir: '../../dist/apps/trade-ui'
  },
  server: {
    port: 4201
  }
});
