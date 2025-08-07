import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import V001EpicLaunch from './V001EpicLaunch'
import NewApp from './NewApp'
import TerminalApp from './TerminalApp'
import DeFiTerminal from './defi/DeFiTerminal'
import KoHLabs from './KoHLabs'
import { SolanaWalletProvider } from './defi/WalletProvider'
import { WagmiProvider } from './providers/WagmiProvider'
import { SocialAuthProvider } from './providers/SocialAuthProvider'
import { ThemeProvider } from './contexts/ThemeContext'
import { ViewProvider } from './contexts/ViewContext'

function App() {
  return (
    <ThemeProvider>
      <ViewProvider>
        <WagmiProvider>
          <SolanaWalletProvider>
            <SocialAuthProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<TerminalApp />} />
                  <Route path="/landing" element={<NewApp />} />
                  <Route path="/v0-0-1" element={<V001EpicLaunch />} />
                  <Route path="/terminal" element={<TerminalApp />} />
                  <Route path="/defi" element={<DeFiTerminal />} />
                  <Route path="/kohlabs" element={<KoHLabs />} />
                </Routes>
              </Router>
            </SocialAuthProvider>
          </SolanaWalletProvider>
        </WagmiProvider>
      </ViewProvider>
    </ThemeProvider>
  )
}

export default App