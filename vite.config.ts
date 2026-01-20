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
    server: {
      proxy: {
        "/auth": {
          target: "http://prueba-template-backend.test",
          changeOrigin: true,
        },
        "/api": {
          target: "http://prueba-template-backend.test",
          changeOrigin: true,
        },
        "/private": {
          target: "http://prueba-template-backend.test",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
