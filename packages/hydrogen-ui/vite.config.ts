import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'hydrogen-ui',
      fileName: (format) => `hydrogen-ui.${format}.min.js`,
    },
    sourcemap: true,
    // TODO: use browserslist as the source, parse it, and generate these strings
    // See https://vitejs.dev/config/#build-target and https://esbuild.github.io/api/#target and maybe https://github.com/nihalgonsalves/esbuild-plugin-browserslist
    target: ['node16', 'chrome96', 'firefox94', 'safari14', 'edge96'],
    rollupOptions: {
      // don't bundle these packages into our lib
      external: ['react', 'react-dom'],
    },
  },
  plugins: [react()],
});
