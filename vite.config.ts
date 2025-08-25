import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const dic = {
  development: '/apps/template-front-tailwind/',
  staging: '/apps/template-front-tailwind/',
  production: '/apps/template-front-tailwind/',
}

export default defineConfig(({ command, mode }) => {
  return {
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
  }
})
