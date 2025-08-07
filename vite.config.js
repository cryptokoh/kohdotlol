import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Include all polyfills
      protocolImports: true,
    }),
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps to reduce memory usage
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'solana-vendor': ['@solana/web3.js', '@solana/spl-token', '@solana/wallet-adapter-react'],
          'wallet-vendor': ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          'animation-vendor': ['framer-motion'],
          'auth-vendor': ['@auth0/auth0-react', '@farcaster/auth-kit'],
        },
      },
      onwarn(warning, warn) {
        // Suppress "use client" warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
    chunkSizeWarningLimit: 1500,
  },
})
