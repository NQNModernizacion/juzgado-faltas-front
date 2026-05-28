import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const dic = {
  development: '/apps/template-front-tailwind/',
  staging: '/apps/template-front-tailwind/',
  production: '/apps/prueba-template-front/',
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
