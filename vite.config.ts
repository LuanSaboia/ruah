import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Permite testar o PWA no localhost
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'ruah.svg'],
      manifest: {
        name: 'Ruah - Cifras e Liturgia',
        short_name: 'Ruah',
        description: 'Gerenciador de cifras e liturgia para ministérios de música',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'ruah.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'ruah.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'ruah.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})