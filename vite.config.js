import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: Set this to your GitHub repository name
  // For example, if your repo is github.com/username/ohs-audit-tool
  // then set base to '/ohs-audit-tool/'
  // If deploying to username.github.io, set base to '/'
  base: '/ohs-audit-tool/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate sourcemaps for easier debugging
    sourcemap: false,
    // Optimize build (using esbuild, faster than terser)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'chart': ['chart.js']
        }
      }
    }
  },
  
  server: {
    port: 5173,
    open: true
  },
  
  preview: {
    port: 4173
  }
})
