import { useState } from 'react'

function NavigationBar({ contractAddress }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copiedContract, setCopiedContract] = useState(false)

  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopiedContract(true)
    setTimeout(() => setCopiedContract(false), 2000)
  }

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <a href="#" className="logo">$koHLabs</a>
          <div className="contract-pill navbar-ca" onClick={copyContract} title="Click to copy contract address">
            <span className="contract-label">CA:</span>
            <span className="contract-text">{contractAddress.slice(0, 4)}...{contractAddress.slice(-4)}</span>
            <svg className="copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            {copiedContract && <span className="copied-tooltip">Copied!</span>}
          </div>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <div className="nav-center">
          {/* Social icons */}
          <div className="social-controls">
            <a href="https://t.me/koh_labs" target="_blank" rel="noopener noreferrer" className="social-control telegram" title="Telegram">
              <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </a>
            <a href="https://x.com/crypto_koh" target="_blank" rel="noopener noreferrer" className="social-control twitter" title="X (Twitter)">
              <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" className="social-control pump" title="Pump.fun">
              <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.4 7.4-6.4-4.6-6.4 4.6 2.4-7.4-6-4.6h7.6z"/>
              </svg>
            </a>
            <a href="https://farcaster.xyz/koh" target="_blank" rel="noopener noreferrer" className="social-control farcaster" title="Farcaster">
              <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.24 7.17v-.82c0-2.64 0-3.98-.52-4.98a3.7 3.7 0 0 0-.39-.57l-.11-.1c-.13-.11-.28-.2-.44-.27C15.91 0 14.72 0 12.34 0h-.69c-2.38 0-3.56 0-4.43.43a3.7 3.7 0 0 0-.94.94C5.85 2.24 5.85 3.42 5.85 5.8v11.6c0 1.16 0 2.05.05 2.76.06.8.2 1.48.53 2.07.36.63.9 1.17 1.52 1.52.6.33 1.28.47 2.08.53.71.05 1.6.05 2.76.05s2.05 0 2.76-.05c.8-.06 1.48-.2 2.08-.53a3.84 3.84 0 0 0 1.52-1.52c.33-.6.47-1.28.53-2.08.05-.71.05-1.6.05-2.76V14.84l-2.26-2.26v3.46c0 .48 0 .73-.1.89a.84.84 0 0 1-.32.33c-.16.09-.4.09-.89.09s-.73 0-.89-.1a.84.84 0 0 1-.33-.32c-.09-.16-.09-.4-.09-.89v-6.2c0-.49 0-.73.1-.9.07-.14.18-.25.32-.32.16-.1.4-.1.89-.1h6.2c.48 0 .73 0 .89.1.14.07.25.18.32.32.1.17.1.41.1.9z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="nav-right">
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#mission" onClick={() => setMobileMenuOpen(false)}>Mission</a>
            <a href="/operations" className="operations-link" onClick={() => setMobileMenuOpen(false)}>Operations</a>
            <a href="/live" className="live-link" onClick={() => setMobileMenuOpen(false)}>🔴 Live</a>
            <a href="#terminal" onClick={() => setMobileMenuOpen(false)}>Terminal</a>
            <a href="#socials" onClick={() => setMobileMenuOpen(false)}>Connect</a>
            <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Pump</a>
            <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>MEXC</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar