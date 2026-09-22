import { defineConfig } from 'vite';
import fs from 'fs/promises';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.(js|jsx)$/,
    exclude: [],
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
      mangle: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor";
            }
            if (id.includes("react-redux")) {
              return "react-redux-vendor";
            }
            if (id.includes("@aws-amplify")) {
              return "aws-amplify-vendor";
            }
            if (id.includes("redux")) {
              return "redux-vendor";
            }
            if (id.includes("i18next")) {
              return "i18n-vendor";
            }
            if (id.includes("swiper") || id.includes("slick-carousel")) {
              return "carousel-vendor";
            }
            return "vendor";
          }
        }
      },
    },
  },
}));