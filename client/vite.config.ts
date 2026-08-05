import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// Custom plugin to handle ?import&react syntax (alias to ?react)
const svgImportPlugin = () => ({
  name: 'svg-import-alias',
  resolveId(id: string) {
    // Transform ?import&react to ?react for vite-plugin-svgr
    if (id.includes('?import&react')) {
      return id.replace('?import&react', '?react');
    }
    return null;
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [
      react(),
      tailwindcss(),
      svgImportPlugin(),
      svgr({
        // Support named ReactComponent export (for ?react syntax)
        svgrOptions: {
          exportType: 'named',
          namedExport: 'ReactComponent',
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: '**/*.svg?react',
      }),
    ],
    server: {
      port: 5173,
      host: '0.0.0.0',
      allowedHosts: true,
      hmr: false,
      proxy: {
        '/api/auth': {
          target: 'http://localhost:9001',
          changeOrigin: true,
        },
        '/api/restaurants': {
          target: 'http://localhost:9002',
          changeOrigin: true,
        },
        '/api/cart': {
          target: 'http://localhost:9003',
          changeOrigin: true,
        },
        '/api/delivery': {
          target: 'http://localhost:9004',
          changeOrigin: true,
        },
      },
    },
  };
})