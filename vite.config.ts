import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/the-select/', // GitHub Pages용 base path
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      publicDir: 'public',
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html')
          }
        }
      },
+     server: {
+       historyApiFallback: true
+     }
    };
});
