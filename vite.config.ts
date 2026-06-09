import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const dic = {
  development: '/apps/tribunal-faltas/',
  staging: '/apps/tribunal-faltas/',
  production: 'apps/tribunal-faltas/',
}

export default defineConfig(({ mode }) => ({
  base: dic[mode],
  plugins: [react()],
  define: {
    __DEV__: JSON.stringify(mode !== 'production'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
