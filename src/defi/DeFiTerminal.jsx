// DeFi Terminal Component - Main Interface
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Connection, PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import StreamflowService from './streamflow/StreamflowService'
import JupiterService from './jupiter/JupiterService'
import StakingService from './staking/StakingService'
import CommandParser from './CommandParser'
import { COMMANDS, ERRORS, SUCCESS, RPC_ENDPOINTS, NETWORK } from './constants'

// Whimsical Terminal Components
const MatrixRain = () => {
  const [drops, setDrops] = useState([])
  const chars = '01アイウエオ$koHLabs⚗️🧪💎⚡🔬'
  const columns = Math.floor(window.innerWidth / 20)

  useEffect(() => {
    setDrops(Array(columns).fill(0).map(() => Math.random() * window.innerHeight))
    
    const interval = setInterval(() => {
      setDrops(prev => prev.map((drop, i) => {
        if (drop > window.innerHeight && Math.random() > 0.975) {
          return -20
        }
        return drop + (Math.random() * 10 + 5)
      }))
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
      {drops.map((drop, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs text-green-400"
          style={{
            left: `${(i / columns) * 100}%`,
            top: drop,
            textShadow: '0 0 8px currentColor'
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
        >
          {chars[Math.floor(Math.random() * chars.length)]}
        </motion.div>
      ))}
    </div>
  )
}

const DNAMolecule = ({ animate: shouldAnimate }) => {
  if (!shouldAnimate) return null
  
  const dnaString = `
    🧬 DNA SEQUENCING COMPLETE
       A-T-G-C-A-T-G-C
       | | | | | | | |
       T-A-C-G-T-A-C-G
    🧬 GENETIC CODE: SUCCESS`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-cyan-400 whitespace-pre font-mono text-xs"
    >
      {dnaString}
    </motion.div>
  )
}

const BeakerBubble = ({ processing }) => {
  if (!processing) return null
  
  return (
    <motion.div
      className="flex items-center gap-2 text-purple-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        className="text-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        🧪
      </motion.span>
      <span>Brewing transaction...</span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        💨
      </motion.span>
    </motion.div>
  )
}

const TerminalCursor = () => {
  const [wink, setWink] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setWink(true)
        setTimeout(() => setWink(false), 150)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <motion.span
      className="text-green-400 ml-1"
      animate={{
        opacity: wink ? 0.3 : [1, 0, 1],
        scale: wink ? [1, 0.8, 1] : 1
      }}
      transition={{
        opacity: wink ? { duration: 0.15 } : { duration: 1, repeat: Infinity },
        scale: wink ? { duration: 0.15 } : {}
      }}
    >
      {wink ? ';' : '▊'}
    </motion.span>
  )
}

const ParticleExplosion = ({ trigger, onComplete }) => {
  if (!trigger) return null
  
  const particles = Array(15).fill(null)
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: ['#10f010', '#f010f0', '#10f0f0', '#f0f010'][i % 4],
            left: '50%',
            top: '50%',
            boxShadow: `0 0 6px currentColor`
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={() => i === 0 && onComplete && onComplete()}
        />
      ))}
    </div>
  )
}

const EasterEggCommands = {
  'konami': () => 'UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A - CHEAT MODE ACTIVATED! 🎮',
  'coffee': () => '☕ Dispensing liquid motivation... Caffeine levels: MAXIMUM',
  'matrix': () => 'There is no spoon. Only Solana. 🥄',
  'science': () => '👨‍🔬 HYPOTHESIS: Moon mission probable. EXPERIMENT: Diamond hands. RESULT: 🚀',
  'dna': () => 'ATGC-KOHLABS-SEQUENCE-DETECTED 🧬 Genetic code for success identified!',
  'lab': () => '🔬 WARNING: Extreme DeFi experiments in progress. Safety goggles recommended.',
  'elements': () => 'K: Potassium for explosive growth\nOh: Oxygen for breathing room\nH: Hydrogen for rocket fuel\nLabs: Where magic happens ⚗️',
  'beaker': () => '🧪 *BUBBLE BUBBLE* Mixing 2 parts HODL + 1 part WAGMI + catalyst = MOON POTION',
  'experiment': () => 'EXPERIMENT #42: What happens when diamond hands meet rocket fuel? 💎🚀',
  'periodic': () => 'Element #KOHL discovered! Properties: Ultra-bullish, highly reactive with moon gravity. 🌙'
}

const LabSafetyTips = [
  '⚠️  Remember to wear safety goggles when handling volatile tokens',
  '🧤 Always use protective gloves when touching smart contracts',
  '🔥 Keep flammable assets away from market heat',
  '💎 Diamond hands prevent chemical burns from paper hands',
  '⚗️  Never mix FUD with your experimental portfolio',
  '🌡️  Monitor temperature: market too hot? Add ice (stablecoin)',
  '🥽 Safety first: Always DYOR before entering the lab'
]

const DeFiTerminal = () => {
  // State management
  const [history, setHistory] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [network, setNetwork] = useState(NETWORK.MAINNET)
  
  // Whimsical state
  const [showParticles, setShowParticles] = useState(false)
  const [showDNA, setShowDNA] = useState(false)
  const [konamiSequence, setKonamiSequence] = useState([])
  const [showLabTip, setShowLabTip] = useState(false)
  const [matrixIntensity, setMatrixIntensity] = useState(0.2)
  const [lastSuccessTime, setLastSuccessTime] = useState(0)
  
  // Wallet and connection
  const wallet = useWallet()
  const [connection, setConnection] = useState(null)
  
  // Services
  const [streamflowService, setStreamflowService] = useState(null)
  const [jupiterService, setJupiterService] = useState(null)
  const [stakingService, setStakingService] = useState(null)
  const [commandParser, setCommandParser] = useState(null)
  
  // Refs
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  // Initialize connection and services
  useEffect(() => {
    const conn = new Connection(RPC_ENDPOINTS[network], 'confirmed')
    setConnection(conn)

    if (wallet.connected && wallet.publicKey) {
      const streamflow = new StreamflowService(conn, wallet)
      const jupiter = new JupiterService(conn, wallet)
      const staking = new StakingService(conn, wallet)
      const parser = new CommandParser({
        streamflowService: streamflow,
        jupiterService: jupiter,
        stakingService: staking,
        wallet,
        connection: conn,
      })

      setStreamflowService(streamflow)
      setJupiterService(jupiter)
      setStakingService(staking)
      setCommandParser(parser)
      
      // Initialize services
      streamflow.initialize()
      staking.initializePools()
    }
  }, [wallet.connected, wallet.publicKey, network])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Add output to terminal
  const addOutput = useCallback((output, type = 'info') => {
    setHistory(prev => [...prev, { 
      type, 
      content: output, 
      timestamp: new Date().toISOString() 
    }])
  }, [])

  // Process command
  const processCommand = async (command) => {
    if (!command.trim()) return

    // Add command to history
    setCommandHistory(prev => [...prev, command])
    setHistoryIndex(-1)
    
    // Display command in terminal
    addOutput(`> ${command}`, 'command')
    
    // Clear input
    setCurrentCommand('')
    setIsProcessing(true)

    try {
      // Check if wallet is needed
      const needsWallet = !['help', 'clear', 'exit', 'connect'].includes(command.split(' ')[0])
      
      if (needsWallet && !wallet.connected) {
        addOutput(ERRORS.WALLET_NOT_CONNECTED, 'error')
        setIsProcessing(false)
        return
      }

      // Parse and execute command
      if (commandParser) {
        const result = await commandParser.parse(command)
        
        if (result.success) {
          if (result.output) {
            addOutput(result.output, 'success')
            // Celebrate successful operations
            setShowParticles(true)
            setTimeout(() => setShowParticles(false), 1000)
            setLastSuccessTime(Date.now())
          }
          if (result.data) {
            addOutput(formatOutput(result.data), 'data')
          }
        } else {
          addOutput(result.error || 'Command failed', 'error')
        }
      } else {
        // Handle basic commands without services
        handleBasicCommand(command)
      }
    } catch (error) {
      console.error('Command processing error:', error)
      addOutput(`Error: ${error.message}`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle basic commands
  const handleBasicCommand = (command) => {
    const cmd = command.toLowerCase().trim()
    
    // Check for easter eggs first
    if (EasterEggCommands[cmd]) {
      const response = EasterEggCommands[cmd]()
      addOutput(response, 'success')
      
      // Trigger special effects
      if (cmd === 'dna') {
        setShowDNA(true)
        setTimeout(() => setShowDNA(false), 3000)
      } else if (cmd === 'matrix') {
        setMatrixIntensity(0.8)
        setTimeout(() => setMatrixIntensity(0.2), 5000)
      } else if (['science', 'experiment', 'lab'].includes(cmd)) {
        setShowParticles(true)
        setTimeout(() => setShowParticles(false), 1000)
      }
      return
    }
    
    switch (cmd) {
      case 'help':
        displayHelp()
        break
      case 'clear':
        setHistory([])
        setShowParticles(true)
        setTimeout(() => setShowParticles(false), 800)
        break
      case 'exit':
        addOutput('👋 Thank you for using koHLabs DeFi Terminal! Keep experimenting! ⚗️', 'success')
        setShowDNA(true)
        setTimeout(() => setShowDNA(false), 2000)
        break
      case 'connect':
        addOutput('🔌 Please use the wallet button above to establish quantum entanglement', 'info')
        break
      case 'about':
        addOutput('🧬 koHLabs Terminal v2.0 - Where DeFi meets Laboratory Science\n🔬 Built with molecular precision and quantum computing', 'info')
        break
      default:
        // Mad scientist responses for unknown commands
        const madScientistResponses = [
          `🧪 EXPERIMENT FAILED: "${command}" not found in our periodic table.`,
          `⚗️ ERROR 404: Command "${command}" evaporated. Try "help" for stable compounds.`,
          `🔬 HYPOTHESIS REJECTED: "${command}" shows no reaction. Consult the manual with "help".`,
          `💥 CHEMICAL REACTION FAILED: "${command}" is an unknown element. Type "help" for the formula.`,
          `🧬 DNA SEQUENCE CORRUPTED: "${command}" mutation detected. Use "help" for genetic repair.`
        ]
        const response = madScientistResponses[Math.floor(Math.random() * madScientistResponses.length)]
        addOutput(response, 'error')
    }
  }

  // Display help information
  const displayHelp = () => {
    const helpText = `
╔══════════════════════════════════════════════════════════════╗
║             🧬 koHLabs DeFi Terminal v2.0 ⚗️                ║
║               "Where DeFi Meets Laboratory Science"          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  💧 STREAMING COMMANDS (Molecular Flow)                     ║
║  ├─ stream create <recipient> <amount> <duration>           ║
║  ├─ stream cancel <stream-id>                               ║
║  ├─ stream list [active|all]                                ║
║  ├─ stream info <stream-id>                                 ║
║  ├─ vesting create <recipient> <total> <cliff> <duration>   ║
║  └─ vesting info <vesting-id>                               ║
║                                                              ║
║  ⚛️  TRADING COMMANDS (Atomic Exchange)                     ║
║  ├─ swap <from> <to> <amount> [--slippage=3]               ║
║  ├─ price <token>                                           ║
║  ├─ price-impact <from> <to> <amount>                       ║
║  └─ liquidity add <token1> <token2> <amount1> <amount2>     ║
║                                                              ║
║  🔬 STAKING COMMANDS (Compound Interest Lab)               ║
║  ├─ stake <amount> [--lock-period=30d]                      ║
║  ├─ unstake <stake-id> [--force]                            ║
║  ├─ rewards claim [stake-id]                                ║
║  └─ staking-info                                            ║
║                                                              ║
║  🔗 WALLET COMMANDS (Quantum Entanglement)                 ║
║  ├─ connect                                                 ║
║  ├─ disconnect                                              ║
║  ├─ balance [token]                                         ║
║  └─ history [limit]                                         ║
║                                                              ║
║  🛠️  UTILITY COMMANDS                                       ║
║  ├─ help - Laboratory manual                                ║
║  ├─ clear - Sterilize workspace                             ║
║  ├─ exit - Leave laboratory                                 ║
║  └─ about - Terminal specifications                         ║
║                                                              ║
║  🎮 SECRET LAB EXPERIMENTS                                  ║
║  ├─ Try: konami, coffee, matrix, science, dna              ║
║  ├─ lab, beaker, experiment, elements, periodic            ║
║  ├─ Special: Use ↑↑↓↓←→←→BA for ultimate power!      ║
║  └─ Discovery awaits the curious scientist! 🔍             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`
    addOutput(helpText, 'info')
    
    // Show random lab safety tip
    setTimeout(() => {
      const tip = LabSafetyTips[Math.floor(Math.random() * LabSafetyTips.length)]
      addOutput(`\n💡 Lab Safety Tip: ${tip}`, 'warning')
    }, 500)
  }

  // Format output data
  const formatOutput = (data) => {
    if (typeof data === 'string') return data
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2)
    }
    return String(data)
  }

  // Handle keyboard shortcuts and konami code
  const handleKeyDown = (e) => {
    // Track konami code sequence
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
    const newSequence = [...konamiSequence, e.code].slice(-10)
    setKonamiSequence(newSequence)
    
    if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
      addOutput('🎮 KONAMI CODE ACTIVATED! Cheat mode enabled. Matrix intensity boosted!', 'success')
      setMatrixIntensity(1.0)
      setShowParticles(true)
      setTimeout(() => {
        setShowParticles(false)
        setMatrixIntensity(0.3)
      }, 5000)
      setKonamiSequence([])
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      processCommand(currentCommand)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
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
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Auto-complete with particle effect
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 300)
    }
  }

  // Show random lab tips
  useEffect(() => {
    const showTip = () => {
      if (history.length > 5 && Math.random() > 0.7) {
        const tip = LabSafetyTips[Math.floor(Math.random() * LabSafetyTips.length)]
        addOutput(`\n💡 ${tip}`, 'warning')
      }
    }
    
    const interval = setInterval(showTip, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [history])
  
  // Component mount effect
  useEffect(() => {
    // Display welcome message
    const welcome = `
╔══════════════════════════════════════════════════════════════╗
║          🧬 Welcome to koHLabs DeFi Terminal v2.0 ⚗️        ║
║                                                              ║
║        "Where Decentralized Finance Meets Science"          ║
║                                                              ║
║   🔬 Molecular DeFi Engineering Laboratory                   ║
║   • Token Streaming: Controlled molecular flow              ║
║   • Atomic Swaps: Via Jupiter's gravitational pull          ║
║   • Compound Interest: Advanced staking experiments         ║
║   • Quantum Entanglement: Solana blockchain integration     ║
║                                                              ║
║   Type 'help' for laboratory manual                         ║
║   🎮 Try some secret commands for easter eggs!              ║
╚══════════════════════════════════════════════════════════════╝`
    
    addOutput(welcome, 'info')
    
    // Show initial lab safety tip
    setTimeout(() => {
      const tip = LabSafetyTips[0]
      addOutput(`\n💡 Welcome Tip: ${tip}`, 'warning')
    }, 2000)
    
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 relative overflow-hidden">
      {/* Matrix Rain Background */}
      <div style={{ opacity: matrixIntensity }}>
        <MatrixRain />
      </div>
      
      {/* Particle explosions */}
      <AnimatePresence>
        {showParticles && (
          <ParticleExplosion 
            trigger={showParticles} 
            onComplete={() => setShowParticles(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Terminal Container */}
      <motion.div 
        className="max-w-6xl mx-auto h-[calc(100vh-2rem)] bg-gray-900/95 backdrop-blur-sm rounded-lg border border-green-500/30 shadow-2xl overflow-hidden flex flex-col relative"
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          boxShadow: [
            '0 0 30px rgba(16,240,16,0.3)',
            '0 0 60px rgba(16,240,16,0.2)',
            '0 0 30px rgba(16,240,16,0.3)'
          ]
        }}
        transition={{ duration: 0.8, boxShadow: { duration: 4, repeat: Infinity } }}
        style={{ perspective: '1000px' }}
      >
        {/* Terminal Header */}
        <div className="bg-gray-800/90 backdrop-blur px-4 py-2 flex items-center justify-between border-b border-green-500/30">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-3 h-3 rounded-full bg-red-500" 
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-yellow-500"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
            <motion.span 
              className="ml-4 text-green-400 text-sm font-bold"
              animate={{ 
                textShadow: [
                  '0 0 5px currentColor',
                  '0 0 10px currentColor', 
                  '0 0 5px currentColor'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🧬 koHLabs DeFi Laboratory 🔬
            </motion.span>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={network} 
              onChange={(e) => setNetwork(e.target.value)}
              className="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm border border-green-500/30"
            >
              <option value={NETWORK.MAINNET}>Mainnet</option>
              <option value={NETWORK.DEVNET}>Devnet</option>
              <option value={NETWORK.TESTNET}>Testnet</option>
            </select>
            <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !text-black !font-bold !py-1 !px-3 !text-sm" />
          </div>
        </div>

        {/* Terminal Output */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 space-y-2"
        >
          <AnimatePresence>
            {history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`
                  ${entry.type === 'command' ? 'text-cyan-400' : ''}
                  ${entry.type === 'error' ? 'text-red-400' : ''}
                  ${entry.type === 'success' ? 'text-green-400' : ''}
                  ${entry.type === 'warning' ? 'text-yellow-400' : ''}
                  ${entry.type === 'info' ? 'text-gray-300' : ''}
                  ${entry.type === 'data' ? 'text-purple-400' : ''}
                  whitespace-pre-wrap break-words
                `}
              >
                {entry.content}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Processing indicator */}
          {isProcessing && <BeakerBubble processing={isProcessing} />}
          
          {/* DNA Animation */}
          <AnimatePresence>
            {showDNA && <DNAMolecule animate={showDNA} />}
          </AnimatePresence>
        </div>

        {/* Terminal Input */}
        <div className="border-t border-green-500/30 p-4 bg-gray-800">
          <div className="flex items-center gap-2">
            <motion.span 
              className="text-green-400 font-bold"
              animate={{ 
                textShadow: [
                  '0 0 5px currentColor',
                  '0 0 8px currentColor',
                  '0 0 5px currentColor'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {wallet.connected ? `🧬${wallet.publicKey?.toString().slice(0, 4)}...${wallet.publicKey?.toString().slice(-4)}` : '🔬scientist'}@koHLabs
            </motion.span>
            <span className="text-cyan-400 font-bold">~/lab</span>
            <motion.span 
              className="text-green-400 font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              $
            </motion.span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-700"
              placeholder="Enter command..."
              autoComplete="off"
              spellCheck="false"
            />
            {currentCommand && <TerminalCursor />}
          </div>
        </div>
      </motion.div>

      {/* Status Bar */}
      <motion.div 
        className="max-w-6xl mx-auto mt-2 flex items-center justify-between text-xs text-gray-500 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.span
            animate={{ color: network === NETWORK.MAINNET ? '#10f010' : '#f0f010' }}
            className="font-bold"
          >
            🌐 Network: {network === NETWORK.MAINNET ? 'MAINNET' : network.toUpperCase()}
          </motion.span>
          <span className="animate-pulse">•</span>
          <motion.span
            animate={{ color: wallet.connected ? '#10f010' : '#f01010' }}
            className="font-bold"
          >
            🔗 {wallet.connected ? 'QUANTUM LINKED' : 'ENTANGLEMENT PENDING'}
          </motion.span>
          <span className="animate-pulse">•</span>
          <span className="text-purple-400">⚗️ Experiments: {commandHistory.length}</span>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-cyan-400 font-bold"
        >
          🧬 Powered by Molecular DeFi Engineering
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DeFiTerminal