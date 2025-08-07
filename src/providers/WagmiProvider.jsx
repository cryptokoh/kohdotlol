import { WagmiProvider as WagmiProviderCore } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { config } from '../config/wagmi.js'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export function WagmiProvider({ children }) {
  return (
    <WagmiProviderCore config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={{
            lightMode: darkTheme({
              accentColor: '#00ff41',
              accentColorForeground: '#000000',
              borderRadius: 'small',
              fontStack: 'system',
            }),
            darkMode: darkTheme({
              accentColor: '#00ff41',
              accentColorForeground: '#000000',
              borderRadius: 'small',
              fontStack: 'system',
            })
          }}
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProviderCore>
  )
}