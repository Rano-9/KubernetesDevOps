import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'process.env': env,
    },
    server: {
      allowedHosts: ['localhost', 'todo-backend'],
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
      proxy: {
        '/todos': env.VITE_API_URL || 'http://localhost:5000',
        '/share': env.VITE_API_URL || 'http://localhost:5000',
      },
    },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
  }
})
