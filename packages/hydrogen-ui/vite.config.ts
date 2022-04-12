import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // We overwrite this later in "rollupOptions.input", but it's required here so we can't remove it / comment it out
      entry: path.resolve(__dirname, 'src/index.client.ts'),
      name: 'hydrogen-ui',
      // put [name] at the end, so that we preserve the ".client.js" and ".server.js" naming conventions required for RSC
      fileName: () => `[name].js`,
      formats: ['es'],
    },
    sourcemap: true,
    // TODO: use browserslist as the source, parse it, and generate these strings
    // See https://vitejs.dev/config/#build-target and https://esbuild.github.io/api/#target and maybe https://github.com/nihalgonsalves/esbuild-plugin-browserslist
    target: ['node16', 'chrome96', 'firefox94', 'safari14', 'edge96'],
    rollupOptions: {
      // don't bundle these packages into our lib
      external: ['react', 'react-dom'],
      // the true entry points to the bundles
      input: ['./src/index.client.ts', './src/index.server.ts'],
    },
  },
  plugins: [react()],
});
