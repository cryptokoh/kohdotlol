import { useState, useEffect, useRef } from 'react'
import './KoHLabsExact.css'

function KoHLabsExact() {
  // Main landing page component for $koHLabs
  const [matrixMode, setMatrixMode] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showClaude, setShowClaude] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const canvasRef = useRef(null)
  const matrixRainRef = useRef(null)
  const konamiRef = useRef([])
  const terminalInputRef = useRef(null)
  const claudeTypingRef = useRef(null)
  const [matrixText, setMatrixText] = useState('FOLLOW THE WHITE RABBIT 🐰')
  const [showMatrixText, setShowMatrixText] = useState(false)
  const [copiedContract, setCopiedContract] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const [claudeOutput, setClaudeOutput] = useState([])
  const [claudeTypingIndex, setClaudeTypingIndex] = useState(0)
  const [claudeSpeed, setClaudeSpeed] = useState(1) // 0: slow, 1: normal, 2: fast
  const [claudeFiles, setClaudeFiles] = useState([
    { name: 'src/', type: 'folder', open: true },
    { name: 'trading-bot.ts', type: 'file', parent: 'src/', active: true },
    { name: 'config.ts', type: 'file', parent: 'src/' },
    { name: 'utils/', type: 'folder', open: false },
    { name: 'package.json', type: 'file' },
    { name: 'tsconfig.json', type: 'file' }
  ])
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: 'KoHLabs Terminal v1.0.0 - Interactive Mode' },
    { type: 'output', text: 'Type "help" for available commands' },
    { type: 'prompt', text: 'koh@kohlabs:~$', command: '' }
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  // Log mount to help debug
  useEffect(() => {
    console.log('KoHLabsExact component mounted')
  }, [])
  
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  const contractAddress = 'ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN'
  
  const missionCards = [
    { icon: '🔄', title: 'Degen to Regen', desc: 'Transforming degen energy into regenerative building. We\'re taking projects from zero to something, one vibe-coded line at a time.' },
    { icon: '🎬', title: 'Live Stream Coding', desc: 'Real people, real ops, real builds. Watch us write code we barely understand, debug in public, and celebrate when things actually work.' },
    { icon: '🤖', title: 'AI Agent Building', desc: 'Creating AI agents that do... things. Sometimes useful things. Always interesting things. Join us in the experimental zone.' },
    { icon: '⚡', title: 'Solana Exploration', desc: 'Collaborative discovery of the Sol ecosystem. We\'re learning together, building together, and probably breaking things together.' },
    { icon: '🛠️', title: 'Project Support', desc: 'Helping other projects go from idea to reality. Because koH believes in lifting while climbing, even when we\'re not sure where we\'re going.' },
    { icon: '🎯', title: 'Vibe Coding', desc: 'Hardcore vibe coding sessions where the energy is high, the code is questionable, and the learning never stops. This is how we roll.' }
  ]

  // Copy contract address to clipboard
  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopiedContract(true)
    setTimeout(() => setCopiedContract(false), 2000)
  }

  // Claude Code CLI Simulation Script
  const claudeScript = [
    { type: 'command', text: 'claude-code --dangerously-accept-all-prompts', delay: 0 },
    { type: 'system', text: '🤖 Claude Code v3.5 - AI-Powered Development Assistant', delay: 500 },
    { type: 'system', text: '⚠️  Running in dangerous mode - all prompts auto-accepted', delay: 700 },
    { type: 'system', text: '📊 Model: Claude 3.5 Sonnet | Context: 200K tokens | Tools: Enabled', delay: 900 },
    { type: 'output', text: '', delay: 1000 },
    { type: 'claude', text: 'Analyzing $koHLabs project structure...', delay: 1200 },
    { type: 'tree', text: '📁 kohlabs/', delay: 1400 },
    { type: 'tree', text: '  ├── 📁 src/', delay: 1500 },
    { type: 'tree', text: '  │   ├── 📄 index.ts', delay: 1600 },
    { type: 'tree', text: '  │   └── 📁 components/', delay: 1700 },
    { type: 'tree', text: '  ├── 📄 package.json', delay: 1800 },
    { type: 'tree', text: '  └── 📄 tsconfig.json', delay: 1900 },
    { type: 'progress', text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 2000 },
    { type: 'output', text: '', delay: 2200 },
    { type: 'command', text: 'claude "Build a Solana trading bot for pump.fun tokens"', delay: 2500 },
    { type: 'claude', text: 'I\'ll help you build a Solana trading bot for pump.fun tokens. Let me create a comprehensive solution.', delay: 3000 },
    { type: 'output', text: '', delay: 3500 },
    { type: 'file', text: '📄 Creating src/trading-bot.ts...', delay: 3800 },
    { type: 'code', text: 'import { Connection, Keypair, PublicKey } from \'@solana/web3.js\'', delay: 4000 },
    { type: 'code', text: 'import { Jupiter } from \'@jup-ag/core\'', delay: 4200 },
    { type: 'code', text: 'import { TOKEN_PROGRAM_ID } from \'@solana/spl-token\'', delay: 4400 },
    { type: 'code', text: '', delay: 4600 },
    { type: 'code', text: 'class PumpFunTradingBot {', delay: 4800 },
    { type: 'code', text: '  private connection: Connection', delay: 5000 },
    { type: 'code', text: '  private jupiter: Jupiter', delay: 5200 },
    { type: 'code', text: '  private wallet: Keypair', delay: 5400 },
    { type: 'code', text: '', delay: 5600 },
    { type: 'code', text: '  async executeTrade(tokenMint: string, amount: number) {', delay: 5800 },
    { type: 'code', text: '    // AI-optimized trading logic', delay: 6000 },
    { type: 'code', text: '    const routes = await this.jupiter.computeRoutes(...)', delay: 6200 },
    { type: 'code', text: '    return await this.jupiter.exchange(routes[0])', delay: 6400 },
    { type: 'code', text: '  }', delay: 6600 },
    { type: 'code', text: '}', delay: 6800 },
    { type: 'output', text: '', delay: 7000 },
    { type: 'success', text: '✅ Trading bot created successfully!', delay: 7200 },
    { type: 'output', text: '', delay: 7400 },
    { type: 'bash-header', text: '● Bash(git add -A && git commit -m "Add Solana trading bot")', delay: 7600 },
    { type: 'bash-output', text: '  ⎿  [main 1a2b3c4] Add Solana trading bot', delay: 7800 },
    { type: 'bash-output', text: '      2 files changed, 145 insertions(+)', delay: 8000 },
    { type: 'bash-output', text: '      create mode 100644 src/trading-bot.ts', delay: 8200 },
    { type: 'output', text: '', delay: 8400 },
    { type: 'bash-header', text: '● Bash(git push origin main)', delay: 8600 },
    { type: 'bash-output', text: '  ⎿  To github.com:kohlabs/trading-bot.git', delay: 8800 },
    { type: 'bash-output', text: '        9a8b7c6..1a2b3c4  main -> main', delay: 9000 },
    { type: 'output', text: '', delay: 9200 },
    { type: 'todos-header', text: '● Update Todos', delay: 9400 },
    { type: 'todos', text: '  ⎿  ☒ Analyze pump.fun token structure', delay: 9600 },
    { type: 'todos', text: '     ☒ Implement Jupiter aggregation', delay: 9800 },
    { type: 'todos', text: '     ☒ Add slippage protection (3%)', delay: 10000 },
    { type: 'todos', text: '     ☒ Create trading bot class', delay: 10200 },
    { type: 'todos', text: '     ☐ Add monitoring dashboard', delay: 10400 },
    { type: 'output', text: '', delay: 10600 },
    { type: 'command', text: 'npm run test', delay: 10800 },
    { type: 'test', text: 'PASS  src/trading-bot.test.ts', delay: 11200 },
    { type: 'test', text: '  ✓ should execute trades successfully (42ms)', delay: 11400 },
    { type: 'test', text: '  ✓ should handle slippage correctly (23ms)', delay: 11600 },
    { type: 'test', text: '  ✓ should validate token addresses (15ms)', delay: 11800 },
    { type: 'output', text: '', delay: 12000 },
    { type: 'success', text: 'Test Suites: 1 passed, 1 total', delay: 9000 },
    { type: 'success', text: 'Tests: 3 passed, 3 total', delay: 9200 },
    { type: 'output', text: '', delay: 9400 },
    { type: 'command', text: 'git add . && git commit -m "feat: add AI-powered pump.fun trading bot 🚀"', delay: 9600 },
    { type: 'git', text: '[main 8ae234a] feat: add AI-powered pump.fun trading bot 🚀', delay: 10000 },
    { type: 'git', text: ' 3 files changed, 234 insertions(+)', delay: 10200 },
    { type: 'output', text: '', delay: 10400 },
    { type: 'claude', text: '🎉 Project complete! Your Solana trading bot is ready for pump.fun tokens.', delay: 10600 },
    { type: 'claude', text: 'The bot includes Jupiter integration, slippage protection, and AI-optimized routing.', delay: 11000 },
    { type: 'output', text: '', delay: 11400 },
    { type: 'prompt', text: 'Ready for next command...', delay: 11600 }
  ]

  // Start Claude simulation
  const startClaudeSimulation = () => {
    setShowClaude(true)
    setClaudeOutput([])
    setClaudeTypingIndex(0)
    
    // Speed multipliers: slow (2x slower), normal (1x), fast (0.3x)
    const speedMultipliers = [2, 1, 0.3]
    const currentMultiplier = speedMultipliers[claudeSpeed]
    
    // Start the typing animation
    const runScript = () => {
      if (claudeTypingRef.current >= claudeScript.length) {
        return
      }
      
      const currentLine = claudeScript[claudeTypingRef.current]
      
      setTimeout(() => {
        setClaudeOutput(prev => [...prev, currentLine])
        claudeTypingRef.current = (claudeTypingRef.current || 0) + 1
        
        // Auto-scroll to bottom with smooth animation
        setTimeout(() => {
          const claudeBody = document.querySelector('.claude-terminal-body')
          if (claudeBody) {
            claudeBody.scrollTo({
              top: claudeBody.scrollHeight,
              behavior: 'smooth'
            })
          }
        }, 50)
        
        runScript()
      }, currentLine.delay * currentMultiplier)
    }
    
    claudeTypingRef.current = 0
    runScript()
  }

  // Cycle through speed settings
  const cycleSpeed = () => {
    setClaudeSpeed((prev) => (prev + 1) % 3)
  }

  const getSpeedIcon = () => {
    const icons = ['🐢', '🚶', '🚀']
    return icons[claudeSpeed]
  }

  const getSpeedLabel = () => {
    const labels = ['Slow', 'Normal', 'Fast']
    return labels[claudeSpeed]
  }

  // Handle card navigation
  const nextCard = () => {
    setActiveCard((prev) => (prev + 1) % missionCards.length)
  }

  const prevCard = () => {
    setActiveCard((prev) => (prev - 1 + missionCards.length) % missionCards.length)
  }

  // Touch handling for swipe
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const swipeThreshold = 50

    if (swipeDistance > swipeThreshold) {
      nextCard()
    } else if (swipeDistance < -swipeThreshold) {
      prevCard()
    }
  }

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.nav-container')) {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  // Add error boundary
  try {
    return (
      <div className={matrixMode ? 'matrix-mode' : ''}>
        {/* Matrix Rain Canvas */}
        <canvas ref={canvasRef} className="matrix-canvas" />
      
      {/* Claude Button */}
      <div 
        className="claude-toggle" 
        onClick={startClaudeSimulation}
        title="Launch Claude Code CLI"
      >
        CLAUDE
      </div>
      
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

      {/* Claude Code CLI Modal - Terminal Only */}
      {showClaude && (
        <div className="claude-modal-overlay" onClick={() => setShowClaude(false)}>
          <div className="claude-terminal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="claude-terminal-header">
              <div className="claude-modal-buttons">
                <span className="terminal-button red" onClick={() => setShowClaude(false)}></span>
                <span className="terminal-button yellow"></span>
                <span className="terminal-button green"></span>
              </div>
              <div className="claude-terminal-title">Claude Code v3.5 - Terminal</div>
              <div className="claude-modal-controls">
                <button 
                  className="claude-speed-btn"
                  onClick={cycleSpeed}
                  title={`Speed: ${getSpeedLabel()} (click to change)`}
                >
                  {getSpeedIcon()}
                </button>
                <button 
                  className="claude-restart-btn"
                  onClick={() => {
                    setClaudeOutput([])
                    claudeTypingRef.current = 0
                    startClaudeSimulation()
                  }}
                  title="Restart Demo"
                >
                  ↻
                </button>
                <button 
                  className="terminal-close-btn"
                  onClick={() => setShowClaude(false)}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="claude-terminal-body">
              {claudeOutput.map((line, index) => (
                <div key={index} className={`claude-line ${line.type}`}>
                  {line.type === 'command' && (
                    <>
                      <span className="claude-prompt">$</span>
                      <span className="claude-command"> {line.text}</span>
                    </>
                  )}
                  {line.type === 'claude' && (
                    <span className="claude-ai">
                      <span className="claude-icon">🤖</span> {line.text}
                    </span>
                  )}
                  {line.type === 'code' && (
                    <span className="claude-code">{line.text}</span>
                  )}
                  {line.type === 'file' && (
                    <span className="claude-file">{line.text}</span>
                  )}
                  {line.type === 'success' && (
                    <span className="claude-success">{line.text}</span>
                  )}
                  {line.type === 'bash-header' && (
                    <span className="claude-bash-header">{line.text}</span>
                  )}
                  {line.type === 'bash-output' && (
                    <span className="claude-bash-output">{line.text}</span>
                  )}
                  {line.type === 'todos-header' && (
                    <span className="claude-todos-header">{line.text}</span>
                  )}
                  {line.type === 'todos' && (
                    <span className="claude-todos">{line.text}</span>
                  )}
                  {line.type === 'test' && (
                    <span className="claude-test">{line.text}</span>
                  )}
                  {line.type === 'git' && (
                    <span className="claude-git">{line.text}</span>
                  )}
                  {line.type === 'system' && (
                    <span className="claude-system">{line.text}</span>
                  )}
                  {line.type === 'progress' && (
                    <span className="claude-progress">{line.text}</span>
                  )}
                  {line.type === 'prompt' && (
                    <span className="claude-ready">
                      <span className="claude-cursor">▊</span> {line.text}
                    </span>
                  )}
                  {line.type === 'tree' && (
                    <span className="claude-tree">{line.text}</span>
                  )}
                  {line.type === 'output' && <br />}
                </div>
              ))}
              
              {/* Terminal cursor when done */}
              {claudeTypingRef.current >= claudeScript.length && (
                <div className="claude-line">
                  <span className="claude-prompt">$</span>
                  <span className="claude-cursor">▊</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claude IDE Modal - Preserved for future use
      {showClaude && (
        <div className="claude-modal-overlay" onClick={() => setShowClaude(false)}>
          <div className="claude-modal" onClick={(e) => e.stopPropagation()}>
            <div className="claude-header">
              <div className="claude-modal-buttons">
                <span className="terminal-button red" onClick={() => setShowClaude(false)}></span>
                <span className="terminal-button yellow"></span>
                <span className="terminal-button green"></span>
              </div>
              <div className="claude-title">Claude Code v3.5 - AI Development Assistant</div>
              <div className="claude-modal-controls">
                <button 
                  className="claude-speed-btn"
                  onClick={cycleSpeed}
                  title={`Speed: ${getSpeedLabel()} (click to change)`}
                >
                  {getSpeedIcon()}
                </button>
                <button 
                  className="claude-restart-btn"
                  onClick={() => {
                    setClaudeOutput([])
                    claudeTypingRef.current = 0
                    startClaudeSimulation()
                  }}
                  title="Restart Demo"
                >
                  ↻
                </button>
                <button 
                  className="terminal-close-btn"
                  onClick={() => setShowClaude(false)}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="claude-ide-container">
              {/* File Explorer Sidebar 
              <div className="claude-sidebar">
                <div className="claude-explorer-header">
                  <span>EXPLORER</span>
                </div>
                <div className="claude-explorer">
                  <div className="claude-folder expanded">
                    <span className="folder-icon">▼</span> SOLANA-TRADING-BOT
                  </div>
                  <div className="claude-file-tree">
                    <div className="claude-file">📄 package.json</div>
                    <div className="claude-file active">📄 index.js</div>
                    <div className="claude-file">📄 trading-bot.js</div>
                    <div className="claude-file">📄 jupiter-api.js</div>
                    <div className="claude-file">📄 wallet-manager.js</div>
                    <div className="claude-file">📄 .env</div>
                    <div className="claude-folder">
                      <span className="folder-icon">▶</span> src
                    </div>
                    <div className="claude-folder">
                      <span className="folder-icon">▶</span> config
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Editor Area 
              <div className="claude-main">
                {/* Tabs 
                <div className="claude-tabs">
                  <div className="claude-tab active">
                    <span>index.js</span>
                    <span className="tab-close">×</span>
                  </div>
                  <div className="claude-tab">
                    <span>trading-bot.js</span>
                    <span className="tab-close">×</span>
                  </div>
                </div>
                
                {/* Terminal Output 
                <div className="claude-terminal">
                  {claudeOutput.map((line, index) => (
                    <div key={index} className={`claude-line ${line.type}`}>
                      {/* Render different line types 
                      {line.type === 'command' && (
                        <>
                          <span className="claude-prompt">$</span>
                          <span className="claude-command"> {line.text}</span>
                        </>
                      )}
                      {/* ... other line types ... 
                    </div>
                  ))}
                  
                  {/* Terminal cursor when done 
                  {claudeTypingRef.current >= claudeScript.length && (
                    <div className="claude-line">
                      <span className="claude-prompt">$</span>
                      <span className="claude-cursor">▊</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Status Bar 
            <div className="claude-status-bar">
              <div className="claude-status-left">
                <span>🟢 Connected</span>
                <span>UTF-8</span>
                <span>JavaScript</span>
              </div>
              <div className="claude-status-right">
                <span>Ln 42, Col 15</span>
                <span>Spaces: 2</span>
              </div>
            </div>
          </div>
        </div>
      )}
      End of Claude IDE Modal */}

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
            <div className="contract-pill" onClick={copyContract} title="Click to copy contract address">
              <span className="contract-label">CA:</span>
              <span className="contract-text">{contractAddress.slice(0, 4)}...{contractAddress.slice(-4)}</span>
              <svg className="copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              {copiedContract && <span className="copied-tooltip">Copied!</span>}
            </div>
            {/* Social icons - moved here for mobile layout */}
            <div className="social-controls">
              <a href="https://t.me/koh_labs" target="_blank" rel="noopener noreferrer" className="social-control telegram" title="Telegram">
                <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a href="https://x.com/kohlabs_sol" target="_blank" rel="noopener noreferrer" className="social-control twitter" title="X (Twitter)">
                <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" className="social-control pump" title="Pump.fun">
                <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.4 7.4-6.4-4.6-6.4 4.6 2.4-7.4-6-4.6h7.6z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="nav-right">
            <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <a href="#mission" onClick={() => setMobileMenuOpen(false)}>Mission</a>
              <a href="/operations" className="operations-link" onClick={() => setMobileMenuOpen(false)}>Operations</a>
              <a href="#terminal" onClick={() => setMobileMenuOpen(false)}>Terminal</a>
              <a href="#socials" onClick={() => setMobileMenuOpen(false)}>Connect</a>
              <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Live</a>
              <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>MEXC</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
                        console.error('Failed to load meme image')
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
                        <span className="terminal-coin-btn red"></span>
                        <span className="terminal-coin-btn yellow"></span>
                        <span className="terminal-coin-btn green"></span>
                      </div>
                      <span className="terminal-coin-title">koHLabs@terminal</span>
                    </div>
                    <div className="terminal-coin-body">
                      <div className="terminal-coin-line">
                        <span className="terminal-coin-prompt">$</span>
                        <span className="terminal-coin-text">./launch --moon</span>
                      </div>
                      <div className="terminal-coin-line">
                        <span className="terminal-coin-output">🚀 Initializing $koHLabs...</span>
                      </div>
                      <div className="terminal-coin-line">
                        <span className="terminal-coin-output">✅ Vibe: LOADED</span>
                      </div>
                      <div className="terminal-coin-line">
                        <span className="terminal-coin-output">⚡ Degen Mode: ACTIVE</span>
                      </div>
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
          <h1>$koHLabs</h1>
          <p className="tagline">
            <span className="typewriter-text">Degen to Regen • Vibe Coding • Real Builds • Live Streams</span>
          </p>
          
          {/* Contract Address Hero */}
          <div className="contract-hero" onClick={copyContract}>
            <div className="contract-hero-pill">
              <span className="contract-hero-label">Contract Address</span>
              <span className="contract-hero-address">{contractAddress}</span>
              <svg className="contract-hero-copy" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              {copiedContract && <span className="contract-hero-copied">Copied!</span>}
            </div>
          </div>
          
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
        {/* Desktop Grid View */}
        <div className="mission-content desktop-only">
          {missionCards.map((card, index) => (
            <div key={index} className="mission-card">
              <h3>{card.icon} {card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Mobile Carousel View */}
        <div className="mission-carousel mobile-only"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="carousel-prev" onClick={prevCard}>‹</button>
          
          <div className="carousel-container">
            <div className="carousel-track" style={{ transform: `translateX(-${activeCard * 100}%)` }}>
              {missionCards.map((card, index) => (
                <div key={index} className="carousel-card">
                  <div className="carousel-card-inner">
                    <h3>{card.icon} {card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-next" onClick={nextCard}>›</button>
          
          {/* Dots indicator */}
          <div className="carousel-dots">
            {missionCards.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === activeCard ? 'active' : ''}`}
                onClick={() => setActiveCard(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Socials Section */}
      <section className="socials-section" id="socials">
        <h2>Connect With KoHLabs</h2>
        <div className="socials-container">
          <a href="https://t.me/koh_labs" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
            Telegram: @koh_labs
          </a>
          <a href="https://x.com/kohlabs_sol" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X: @kohlabs_sol
          </a>
          <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Live on Pump.fun
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
  } catch (error) {
    console.error('Error rendering KoHLabsExact:', error)
    // Fallback UI
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#8ae234',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>$koHLabs</h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>Degen to Regen • Vibe Coding • Real Builds</p>
        <div style={{ 
          padding: '20px 40px',
          background: 'linear-gradient(135deg, #8ae234, #729fcf)',
          borderRadius: '30px',
          color: '#0a0a0a',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          Contract: ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN
        </div>
        <p style={{ marginTop: '20px' }}>Loading full experience...</p>
      </div>
    )
  }
}

export default KoHLabsExact