import { useState, useEffect, useRef } from 'react'
import './KoHLabsExact.css'

function KoHLabsExact() {
  const [matrixMode, setMatrixMode] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const canvasRef = useRef(null)
  const matrixRainRef = useRef(null)
  const konamiRef = useRef([])
  const terminalInputRef = useRef(null)
  const [matrixText, setMatrixText] = useState('FOLLOW THE WHITE RABBIT 🐰')
  const [showMatrixText, setShowMatrixText] = useState(false)
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: 'KoHLabs Terminal v1.0.0 - Interactive Mode' },
    { type: 'output', text: 'Type "help" for available commands' },
    { type: 'prompt', text: 'koh@kohlabs:~$', command: '' }
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  // Matrix Rain Effect
  const initMatrixRain = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/こんにちは世界"
    const matrixArray = matrix.split("")
    
    const fontSize = 16
    const columns = canvas.width / fontSize
    
    const drops = []
    for(let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100
    }
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff00'
      ctx.font = fontSize + 'px monospace'
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    return setInterval(draw, 35)
  }

  // Toggle Matrix Mode
  const toggleMatrix = () => {
    setMatrixMode(!matrixMode)
    
    if (!matrixMode) {
      // Entering Matrix mode
      matrixRainRef.current = initMatrixRain()
      
      // Show flash text
      setShowMatrixText(true)
      setTimeout(() => setShowMatrixText(false), 3000)
      
      console.log('%c SYSTEM: ACCESS GRANTED', 'color: #00ff00; font-size: 20px; font-weight: bold;')
      console.log('%c Welcome to the Matrix, koH', 'color: #00ff00; font-size: 16px;')
    } else {
      // Exiting Matrix mode
      if (matrixRainRef.current) {
        clearInterval(matrixRainRef.current)
        matrixRainRef.current = null
      }
      
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
      
      console.log('%c SYSTEM: RETURNING TO REALITY', 'color: #8ae234; font-size: 16px; font-weight: bold;')
    }
  }

  // Terminal Command Execution
  const executeTerminalCommand = (cmd) => {
    const commands = {
      'help': () => [
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  help      - Show this help message' },
        { type: 'output', text: '  status    - Check system status' },
        { type: 'output', text: '  vibe      - Check vibe levels' },
        { type: 'output', text: '  build     - Start building' },
        { type: 'output', text: '  matrix    - Toggle matrix mode' },
        { type: 'output', text: '  about     - About $koHLabs' },
        { type: 'output', text: '  social    - Show social links' },
        { type: 'output', text: '  clear     - Clear terminal' },
        { type: 'output', text: '  exit      - Close terminal' }
      ],
      'status': () => [
        { type: 'success', text: '[✓] Solana Network: Connected' },
        { type: 'success', text: '[✓] Token Contract: Deployed' },
        { type: 'success', text: '[✓] Vibe Check: Hardcore mode' },
        { type: 'success', text: '[✓] koH Status: Building anyway' }
      ],
      'vibe': () => [
        { type: 'output', text: '🎯 Vibe Level: MAXIMUM' },
        { type: 'output', text: '🚀 Degen Energy: Converting to Regen' },
        { type: 'output', text: '💚 Community: Growing' },
        { type: 'output', text: '🔥 Energy: Off the charts' }
      ],
      'build': () => [
        { type: 'system', text: 'Initiating build sequence...' },
        { type: 'output', text: 'npm run dev' },
        { type: 'success', text: 'Server running on port 3000' },
        { type: 'output', text: "koH don't know, but koH builds anyway!" }
      ],
      'matrix': () => {
        toggleMatrix()
        return [{ type: 'success', text: matrixMode ? 'Exiting the Matrix...' : 'Entering the Matrix...' }]
      },
      'about': () => [
        { type: 'output', text: '═══════════════════════════════════════════' },
        { type: 'output', text: '$koHLabs - Degen to Regen' },
        { type: 'output', text: 'Building in public on Solana' },
        { type: 'output', text: 'Vibe coding with real people' },
        { type: 'output', text: '═══════════════════════════════════════════' }
      ],
      'social': () => [
        { type: 'output', text: '📱 Social Links:' },
        { type: 'link', text: '  Telegram: @cryptokoh' },
        { type: 'link', text: '  X: @crypto_koh' },
        { type: 'link', text: '  Pump.fun: Trade $koHLabs' },
        { type: 'link', text: '  MEXC: Trade on DEX' }
      ],
      'clear': () => {
        setTerminalHistory([
          { type: 'output', text: 'Terminal cleared.' },
          { type: 'prompt', text: 'koh@kohlabs:~$', command: '' }
        ])
        return []
      },
      'exit': () => {
        setShowTerminal(false)
        return []
      }
    }

    const result = commands[cmd.toLowerCase()]
    if (result) {
      return result()
    } else if (cmd.trim() === '') {
      return []
    } else {
      return [{ type: 'error', text: `Command not found: ${cmd}. Type "help" for available commands.` }]
    }
  }

  const handleTerminalCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = currentCommand.trim()
      
      // Add to command history
      if (cmd) {
        setCommandHistory(prev => [...prev, cmd])
        setHistoryIndex(-1)
      }
      
      // Execute command
      setTerminalHistory(prev => [
        ...prev.slice(0, -1), // Remove current prompt
        { type: 'prompt', text: 'koh@kohlabs:~$', command: cmd },
        ...executeTerminalCommand(cmd),
        { type: 'prompt', text: 'koh@kohlabs:~$', command: '' }
      ])
      
      setCurrentCommand('')
      
      // Scroll to bottom
      setTimeout(() => {
        const modalBody = document.querySelector('.terminal-modal-body')
        if (modalBody) {
          modalBody.scrollTop = modalBody.scrollHeight
        }
      }, 0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand('')
      }
    }
  }

  // Focus terminal input when modal opens
  useEffect(() => {
    if (showTerminal && terminalInputRef.current) {
      terminalInputRef.current.focus()
    }
  }, [showTerminal])

  // Konami Code Detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger Konami code when typing in terminal
      if (showTerminal) return
      
      konamiRef.current.push(e.key)
      if (konamiRef.current.length > konamiCode.length) {
        konamiRef.current.shift()
      }
      
      if (konamiRef.current.join(',') === konamiCode.join(',')) {
        activateUltraMatrix()
        konamiRef.current = []
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showTerminal])

  const activateUltraMatrix = () => {
    if (!matrixMode) {
      toggleMatrix()
    }
    
    // Super Matrix Mode effects
    document.body.style.animation = 'glitch 0.1s infinite'
    
    const messages = [
      "THERE IS NO SPOON",
      "FREE YOUR MIND",
      "THE MATRIX HAS YOU",
      "FOLLOW THE WHITE RABBIT",
      "WAKE UP, koH...",
      "KNOCK KNOCK",
      "YOU ARE THE ONE"
    ]
    
    let messageIndex = 0
    const showMessage = setInterval(() => {
      setMatrixText(messages[messageIndex])
      setShowMatrixText(true)
      setTimeout(() => setShowMatrixText(false), 2000)
      
      messageIndex++
      if (messageIndex >= messages.length) {
        clearInterval(showMessage)
        setTimeout(() => {
          document.body.style.animation = ''
        }, 2000)
      }
    }, 2500)
  }

  // Terminal animation
  useEffect(() => {
    const commands = [
      'git push origin main',
      'npm run build',
      'cargo build --release',
      'solana program deploy',
      'echo "WAGMI"'
    ]
    
    let commandIndex = 0
    const interval = setInterval(() => {
      const terminalBody = document.querySelector('.terminal-body')
      if (terminalBody && Math.random() > 0.7) {
        const newLine = document.createElement('div')
        newLine.className = 'terminal-line'
        newLine.style.opacity = '0'
        newLine.innerHTML = `
          <span class="prompt">koh@kohlabs:~$</span>
          <span class="command"> ${commands[commandIndex % commands.length]}</span>
        `
        terminalBody.appendChild(newLine)
        
        setTimeout(() => {
          newLine.style.transition = 'opacity 0.5s'
          newLine.style.opacity = '1'
        }, 100)
        
        const lines = terminalBody.querySelectorAll('.terminal-line')
        if (lines.length > 15) {
          lines[0].remove()
        }
        
        terminalBody.scrollTop = terminalBody.scrollHeight
        commandIndex++
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (matrixMode && canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [matrixMode])

  return (
    <div className={matrixMode ? 'matrix-mode' : ''}>
      {/* Matrix Rain Canvas */}
      <canvas ref={canvasRef} className="matrix-canvas" />
      
      {/* Terminal Button */}
      <div 
        className="terminal-toggle" 
        onClick={() => setShowTerminal(true)}
        title="Open Terminal"
      >
        TERMINAL
      </div>
      
      {/* Matrix Mode Toggle */}
      <div 
        className="matrix-toggle" 
        onClick={toggleMatrix}
        title={matrixMode ? "Exit the Matrix" : "Enter the Matrix"}
      >
        {matrixMode ? 'EXIT' : 'MATRIX'}
      </div>
      
      {/* Matrix Flash Text */}
      <div className={`matrix-text ${showMatrixText ? 'show' : ''}`}>
        {matrixText}
      </div>

      {/* Terminal Modal */}
      {showTerminal && (
        <div className="terminal-modal-overlay" onClick={() => setShowTerminal(false)}>
          <div className="terminal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terminal-modal-header">
              <div className="terminal-modal-buttons">
                <span className="terminal-button red" onClick={() => setShowTerminal(false)}></span>
                <span className="terminal-button yellow"></span>
                <span className="terminal-button green"></span>
              </div>
              <div className="terminal-modal-title">KoHLabs Terminal - Interactive Mode</div>
              <div className="terminal-modal-controls">
                <button 
                  className="terminal-close-btn"
                  onClick={() => setShowTerminal(false)}
                  title="Close Terminal"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="terminal-modal-body">
              {terminalHistory.map((line, index) => (
                <div key={index} className="terminal-line">
                  {line.type === 'prompt' ? (
                    <>
                      <span className="prompt">{line.text}</span>
                      <span className="command"> {line.command}</span>
                      {index === terminalHistory.length - 1 && (
                        <>
                          <input
                            ref={terminalInputRef}
                            type="text"
                            value={currentCommand}
                            onChange={(e) => setCurrentCommand(e.target.value)}
                            onKeyDown={handleTerminalCommand}
                            className="terminal-input"
                            autoFocus
                          />
                          <span className="terminal-cursor">_</span>
                        </>
                      )}
                    </>
                  ) : line.type === 'error' ? (
                    <span className="terminal-error">{line.text}</span>
                  ) : line.type === 'success' ? (
                    <span className="terminal-success">{line.text}</span>
                  ) : line.type === 'system' ? (
                    <span className="terminal-system">{line.text}</span>
                  ) : line.type === 'link' ? (
                    <span className="terminal-link">{line.text}</span>
                  ) : (
                    <span className="output">{line.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <a href="#" className="logo">$koHLabs</a>
          <div className="nav-links">
            <a href="#mission">Mission</a>
            <a href="#terminal">Terminal</a>
            <a href="#socials">Connect</a>
            <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer">Pump.fun</a>
            <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer">MEXC</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="meme-container">
            <img src="/kohlabs-meme.png" alt="$koHLabs Meme" className="meme-image" />
          </div>
          <h1>$koHLabs</h1>
          <p className="tagline">Degen to Regen • Vibe Coding • Real Builds • Live Streams</p>
          
          <div className="launch-statement">
            <h2>🚀 Launch Statement</h2>
            <p style={{ fontSize: '18px', color: '#8ae234', marginBottom: '20px' }}>
              "$kohLabs – Degen to Regen. Vibe Coding. Real Builds."
            </p>
            <p>
              Live streaming the journey from meme to mission. We build AI agents, support projects, 
              and write code we barely understand—together. Hardcore vibe coding. Real people. Real ops.
            </p>
            <p style={{ marginTop: '15px' }}>
              Learn with koH—because koH don't know, but koH builds anyway. From degen to regen, 
              we're helping projects go from zero to something. Coin powers the stream. Stream powers the builders.
            </p>
            <p style={{ marginTop: '15px', color: '#729fcf' }}>
              Back $kohLabs and let's build loud. Launched with 1.01 SOL - Let's have some fun!
            </p>
            <p style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(138, 226, 52, 0.3)', color: '#fcaf3e' }}>
              <strong>A Collaborative Exploration:</strong> $kohLabs launched as a collaboration to explore the Solana ecosystem together. 
              We're discovering what's possible when builders, degens, and dreamers unite to navigate Sol's endless possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Terminal Section */}
      <section className="terminal-section" id="terminal">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-button red"></span>
            <span className="terminal-button yellow"></span>
            <span className="terminal-button green"></span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="prompt">koh@kohlabs:~$</span>
              <span className="command"> cat mission.txt</span>
            </div>
            <div className="terminal-line output">
              ╔══════════════════════════════════════════════╗
            </div>
            <div className="terminal-line output">
              ║  $koHLabs Mission Statement                  ║
            </div>
            <div className="terminal-line output">
              ╠══════════════════════════════════════════════╣
            </div>
            <div className="terminal-line output">
              ║  • Degen to Regen transformation             ║
            </div>
            <div className="terminal-line output">
              ║  • Vibe coding with real people              ║
            </div>
            <div className="terminal-line output">
              ║  • Build AI agents & support projects        ║
            </div>
            <div className="terminal-line output">
              ║  • Write code we barely understand—together  ║
            </div>
            <div className="terminal-line output">
              ║  • Explore Solana ecosystem collaboratively  ║
            </div>
            <div className="terminal-line output">
              ╚══════════════════════════════════════════════╝
            </div>
            <br />
            <div className="terminal-line">
              <span className="prompt">koh@kohlabs:~$</span>
              <span className="command"> ./check_status.sh</span>
            </div>
            <div className="terminal-line output">[✓] Solana Network: Connected</div>
            <div className="terminal-line output">[✓] Token Contract: Deployed with 1.01 SOL</div>
            <div className="terminal-line output">[✓] Vibe Check: Hardcore mode enabled</div>
            <div className="terminal-line output">[✓] koH Status: Building anyway</div>
            <div className="terminal-line output">[✓] Mission: Degen → Regen in progress</div>
            <br />
            <div className="terminal-line">
              <span className="prompt">koh@kohlabs:~$</span>
              <span className="command"> echo "koH don't know, but koH builds anyway"</span>
            </div>
            <div className="terminal-line output">
              koH don't know, but koH builds anyway
            </div>
            <br />
            <div className="terminal-line">
              <span className="prompt">koh@kohlabs:~$</span>
              <span className="command typing-effect"> _</span>
            </div>
            <div className="easter-egg terminal-line">
              <span className="prompt" style={{ color: '#00ff00' }}>neo@matrix:~$</span>
              <span className="command"> wake_up_neo</span>
            </div>
            <div className="easter-egg terminal-line output">The Matrix has you...</div>
            <div className="easter-egg terminal-line output">Follow the white rabbit 🐰</div>
            <div className="easter-egg terminal-line output">Knock, knock, Neo.</div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section" id="mission">
        <div className="mission-content">
          <div className="mission-card">
            <h3>🔄 Degen to Regen</h3>
            <p>
              Transforming degen energy into regenerative building. We're taking projects 
              from zero to something, one vibe-coded line at a time.
            </p>
          </div>
          <div className="mission-card">
            <h3>🎬 Live Stream Coding</h3>
            <p>
              Real people, real ops, real builds. Watch us write code we barely understand, 
              debug in public, and celebrate when things actually work.
            </p>
          </div>
          <div className="mission-card">
            <h3>🤖 AI Agent Building</h3>
            <p>
              Creating AI agents that do... things. Sometimes useful things. 
              Always interesting things. Join us in the experimental zone.
            </p>
          </div>
          <div className="mission-card">
            <h3>⚡ Solana Exploration</h3>
            <p>
              Collaborative discovery of the Sol ecosystem. We're learning together, 
              building together, and probably breaking things together.
            </p>
          </div>
          <div className="mission-card">
            <h3>🛠️ Project Support</h3>
            <p>
              Helping other projects go from idea to reality. Because koH believes 
              in lifting while climbing, even when we're not sure where we're going.
            </p>
          </div>
          <div className="mission-card">
            <h3>🎯 Vibe Coding</h3>
            <p>
              Hardcore vibe coding sessions where the energy is high, the code is questionable, 
              and the learning never stops. This is how we roll.
            </p>
          </div>
        </div>
      </section>

      {/* Socials Section */}
      <section className="socials-section" id="socials">
        <h2>Connect With Us</h2>
        <div className="socials-container">
          <a href="https://t.me/cryptokoh" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
            Telegram: @cryptokoh
          </a>
          <a href="https://x.com/crypto_koh" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X: @crypto_koh
          </a>
          <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Trade on Pump.fun
          </a>
          <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 5l-9 9-9-9m18 10l-9 9-9-9"/>
            </svg>
            Trade on MEXC
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Build the Future?</h2>
        <p className="cta-subtitle">
          Join the $koHLabs community and be part of the open development revolution
        </p>
        <div className="cta-buttons">
          <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" className="cta-button">
            Get $koHLabs on Pump.fun
          </a>
          <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer" className="cta-button cta-button-alt">
            Trade on MEXC DEX
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2024 $koHLabs • Building in Public • Powered by Solana</p>
        <p className="footer-disclaimer">Not financial advice. DYOR. Build responsibly.</p>
        <div className="footer-link">
          <a href="/legacy">View Legacy Apps →</a>
        </div>
      </footer>
    </div>
  )
}

export default KoHLabsExact