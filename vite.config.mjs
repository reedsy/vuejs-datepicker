import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: path.resolve(__dirname, 'example'),
  plugins: [ vue() ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'components', 'Datepicker.vue'),
      name: 'vuejsDatepicker',
      filename: (format) => `vuejs-datepicker.${format}.js`,
      formats: [ 'umd', 'cjs', 'es' ],
    },
    rolldownOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [ 'vue' ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
        dir: path.resolve(__dirname, 'dist'),
      },
    },
  },
});
