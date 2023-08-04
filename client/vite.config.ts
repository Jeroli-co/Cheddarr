import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import { checker } from 'vite-plugin-checker'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr(),
    checker({
      typescript: true,
    }),
    VitePWA({
      injectRegister: 'auto',
    }),
  ],
  server: {
    open: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:9090',
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
})
