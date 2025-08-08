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
    exclude: [
      '@reown/appkit',
      '@wagmi/core',
      '@wagmi/connectors',
      'wagmi',
      'viem'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      sourcemap: false,
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps to reduce memory usage
    minify: 'esbuild', // Use esbuild for faster builds with less memory
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Simplified chunking to avoid circular dependencies
          if (id.includes('node_modules')) {
            // Keep React separate for better caching
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Group all wallet/crypto libraries together to avoid circular deps
            if (id.includes('ethers') || 
                id.includes('@ethersproject') || 
                id.includes('wagmi') || 
                id.includes('viem') || 
                id.includes('@rainbow-me') ||
                id.includes('@walletconnect') ||
                id.includes('@coinbase') ||
                id.includes('@reown') ||
                id.includes('@base-org')) {
              return 'wallet-vendor';
            }
            // Keep Three.js separate due to size
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            // Keep Solana separate
            if (id.includes('@solana') || id.includes('bs58') || id.includes('bn.js')) {
              return 'solana-vendor';
            }
            // Everything else in vendor chunk
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
