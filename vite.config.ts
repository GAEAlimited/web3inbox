import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  strategies: 'injectManifest',
  includeAssets: ['favicon.svg'],
  srcDir: 'src',
  filename: 'main-sw.ts',
  manifest: {
    name: 'Web3Inbox',
    short_name: 'Web3Inbox',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/logo.svg',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      ...pwaOptions
    })
  ]
})
