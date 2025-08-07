import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism, arbitrum, polygon, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = getDefaultConfig({
  appName: 'KoH Labs Terminal',
  projectId,
  chains: [mainnet, base, optimism, arbitrum, polygon, ...(import.meta.env.DEV ? [sepolia] : [])],
  ssr: false, // If your dApp uses server side rendering (SSR)
})

// Alternative manual config if needed
export const manualConfig = createConfig({
  chains: [mainnet, base, optimism, arbitrum, polygon, ...(import.meta.env.DEV ? [sepolia] : [])],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'KoH Labs Terminal',
        description: 'Ultra-leet terminal interface for Web3',
        url: 'https://koh.lol',
        icons: ['https://koh.lol/favicon.ico']
      }
    }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    ...(import.meta.env.DEV ? {
      [sepolia.id]: http(),
    } : {}),
  },
})