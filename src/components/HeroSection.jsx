import { useState } from 'react'

function HeroSection({ contractAddress }) {
  const [imageError, setImageError] = useState(false)
  const [copiedContract, setCopiedContract] = useState(false)

  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopiedContract(true)
    setTimeout(() => setCopiedContract(false), 2000)
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="meme-container">
          <div className="coin-flip-card">
            <div className="coin-flip-inner">
              {/* Front side - Meme image */}
              <div className="coin-flip-front">
                {!imageError ? (
                  <img 
                    src="/kohlabs-meme.png" 
                    alt="$koHLabs Meme" 
                    className="meme-image"
                    onError={() => {
                      // Failed to load meme image
                      setImageError(true)
                    }}
                  />
                ) : (
                  <div className="meme-placeholder" style={{
                    width: '288px',
                    height: '288px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8ae234, #729fcf)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '72px',
                    fontWeight: 'bold',
                    color: '#0a0a0a'
                  }}>
                    $koH
                  </div>
                )}
              </div>
              
              {/* Back side - Terminal window */}
              <div className="coin-flip-back">
                <div className="terminal-coin">
                  <div className="terminal-coin-header">
                    <div className="terminal-coin-buttons">
                      <span className="terminal-coin-button red"></span>
                      <span className="terminal-coin-button yellow"></span>
                      <span className="terminal-coin-button green"></span>
                    </div>
                    <div className="terminal-coin-title">koh@kohlabs:~$</div>
                  </div>
                  <div className="terminal-coin-body">
                    <div className="terminal-coin-line">
                      <span className="terminal-coin-prompt">$</span>
                      <span className="terminal-coin-command"> ./launch_kohlabs.sh</span>
                    </div>
                    <div className="terminal-coin-line terminal-coin-output">Initializing $koHLabs protocol...</div>
                    <div className="terminal-coin-line terminal-coin-output">Loading meme energy... ⚡</div>
                    <div className="terminal-coin-line terminal-coin-output">Deploying to Solana... 🚀</div>
                    <div className="terminal-coin-line terminal-coin-success">✅ Launch successful!</div>
                    <div className="terminal-coin-line">
                      <span className="terminal-coin-prompt">$</span>
                      <span className="terminal-coin-cursor">▊</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-title-wrapper">
          <h1 className="hero-title">$koHLabs</h1>
          {/* CA element moved below the title */}
          <div className="hero-ca-container">
            <div className="contract-pill hero-ca" onClick={copyContract} title="Click to copy contract address">
              <span className="contract-label">CA:</span>
              <span className="contract-text">{contractAddress.slice(0, 4)}...{contractAddress.slice(-4)}</span>
              <svg className="copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              {copiedContract && <span className="copied-tooltip">Copied!</span>}
            </div>
          </div>
        </div>
        <p className="hero-tagline">
          <span className="tagline-part">Degen to Regen</span>
          <span className="tagline-divider">•</span>
          <span className="tagline-part">Vibe Coding</span>
          <span className="tagline-divider">•</span>
          <span className="tagline-part">Real Builds</span>
        </p>
        <div className="hero-cta">
          <button 
            className="cta-button cta-primary" 
            onClick={() => window.open('https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN', '_blank')}
          >
            Join the Movement
          </button>
          <button 
            className="cta-button cta-secondary" 
            onClick={() => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Terminal
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection