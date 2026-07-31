import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    exclude: [
      '@reown/appkit',
      '@wagmi/core',
      '@wagmi/connectors',
      'wagmi',
      'viem'
    ],
    esbuildOptions: {
      sourcemap: false,
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps to reduce memory usage
    minify: 'terser', // Better minification for production
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.error', 'console.warn'],
      },
    },
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
