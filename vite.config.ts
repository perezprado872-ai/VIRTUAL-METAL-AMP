import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Replaced `process.cwd()` with `'./'` to avoid a TypeScript error where `process.cwd` is not recognized.
  // Vite resolves `'./'` to the project's root directory, so this change is functionally equivalent.
  const env = loadEnv(mode, './', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    }
  }
})