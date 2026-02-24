import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  // === PHẦN QUAN TRỌNG: Ngăn server code leak sang client ===
  optimizeDeps: {
    exclude: [
      'better-sqlite3',
      'telegraf',
      'discord.js',
      'node-cron',
      'express',
      'node-fetch',
      'undici',
      'formdata-polyfill',
      'langgraph',
      'langchain'
    ]
  },

  build: {
    rollupOptions: {
      external: [
        'better-sqlite3',
        'telegraf',
        'discord.js',
        'node-cron',
        'express',
        'node-fetch',
        'undici'
      ]
    }
  },

  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },

  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
  },
});