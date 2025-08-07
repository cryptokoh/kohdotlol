import { SolanaWalletProvider } from './defi/WalletProvider'
import { WagmiProvider } from './providers/WagmiProvider'
import { SocialAuthProvider } from './providers/SocialAuthProvider'
import { ThemeProvider } from './contexts/ThemeContext'
import { ViewProvider } from './contexts/ViewContext'

function LegacyProviders({ children }) {
  return (
    <ThemeProvider>
      <ViewProvider>
        <WagmiProvider>
          <SolanaWalletProvider>
            <SocialAuthProvider>
              {children}
            </SocialAuthProvider>
          </SolanaWalletProvider>
        </WagmiProvider>
      </ViewProvider>
    </ThemeProvider>
  )
}

export default LegacyProviders