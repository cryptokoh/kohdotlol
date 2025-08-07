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
    minify: 'esbuild', // Use esbuild for faster builds with less memory
    rollupOptions: {
      output: {
        manualChunks(id) {
          // More granular chunking to reduce memory pressure
          if (id.includes('node_modules')) {
            // Don't chunk ethers separately to avoid circular dependency issues
            if (id.includes('ethers') || id.includes('@ethersproject')) {
              return 'wallet-vendor'; // Group with other wallet libraries
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('@solana') || id.includes('bs58') || id.includes('bn.js')) {
              return 'solana-vendor';
            }
            if (id.includes('wagmi') || id.includes('viem') || id.includes('@rainbow-me')) {
              return 'wallet-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('@auth0') || id.includes('@farcaster')) {
              return 'auth-vendor';
            }
            // Generic vendor chunk for other dependencies
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      onwarn(warning, warn) {
        // Suppress "use client" warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
      // Optimize Rollup's memory usage
      maxParallelFileOps: 2,
    },
    chunkSizeWarningLimit: 1500,
    // Reduce memory pressure during build
    reportCompressedSize: false,
  },
})
