import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '../hooks/useWallet'
import { useSocialAuth } from '../providers/SocialAuthProvider'
import { useTheme } from '../contexts/ThemeContext'
import { useView } from '../contexts/ViewContext'
import { aiSimulationPrompts, getRandomPrompt } from '../config/aiPrompts'
import { asciiArt, getRandomAscii, getRandomPopupMessage } from '../config/asciiArt'

const OSTerminal = ({ 
  id, 
  position = { x: 0, y: 0 }, 
  zIndex = 1, 
  onFocus, 
  onClose,
  isFocused = false,
  autoStartAI = false,
  isMobileTabbed = false,
  isEliteMode = false,
  isCompactMode = false
}) => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [terminalPosition, setTerminalPosition] = useState(position)
  
  const { address, isConnected, chain, balance, openConnectModal, disconnect, signMessage } = useWallet()
  const { 
    farcasterUser, 
    connectFarcaster, 
    disconnectFarcaster, 
    isFarcasterConnected,
    twitterUser, 
    connectTwitter, 
    disconnectTwitter, 
    isTwitterConnected 
  } = useSocialAuth()
  const { currentTheme, theme, changeTheme, listThemes } = useTheme()
  const { isMobileView } = useView()

  // AI Simulation state
  const [aiRunning, setAiRunning] = useState(false)
  const [aiSimulation, setAiSimulation] = useState(null)
  const [aiInterval, setAiInterval] = useState(null)
  
  const terminalRef = useRef(null)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    if (isFocused && inputRef.current && !isMinimized) {
      inputRef.current.focus()
    }
  }, [isFocused, isMinimized])

  useEffect(() => {
    // Welcome message for new terminals
    if (history.length === 0) {
      const welcomeMsg = autoStartAI 
        ? `Terminal ${id} initialized.\nkoHLabs Research Terminal v2.0\nAuto-starting project building simulation...\nType 'help' for available commands.`
        : `Terminal ${id} initialized.\nkoHLabs Research Terminal v2.0\nType 'help' for available commands.`
      
      setHistory([{
        type: 'system',
        content: welcomeMsg,
        timestamp: Date.now()
      }])

      // Auto-start AI simulation if requested
      if (autoStartAI) {
        setTimeout(() => {
          addToHistory('system', '🤖 Initializing AI Research Assistant...')
          setTimeout(() => {
            startAiSimulation('researcher') // Start with researcher simulation
          }, 2000)
        }, 1500)
      }
    }
  }, [id, autoStartAI])

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  const addToHistory = (type, content) => {
    setHistory(prev => [...prev, { type, content, timestamp: Date.now() }])
  }

  // AI Simulation functions
  const startAiSimulation = (simulationType) => {
    if (aiRunning) {
      addToHistory('output', 'AI simulation already running. Use "ai stop" to stop current simulation.')
      return
    }

    const simulation = aiSimulationPrompts[simulationType]
    if (!simulation) {
      addToHistory('output', 'Invalid simulation type. Use "ai list" to see available simulations.')
      return
    }

    setAiSimulation(simulationType)
    setAiRunning(true)
    
    addToHistory('system', `🤖 Starting ${simulation.name} simulation...`)
    addToHistory('system', `Type "ai stop" to terminate simulation`)
    
    // Run simulation loop
    const interval = setInterval(() => {
      const prompt = getRandomPrompt(simulationType)
      if (prompt) {
        // Add thinking indicator first
        addToHistory('ai-thinking', `${simulation.icon} ${prompt.prompt}`)
        
        // Add response after a delay (like Claude's thinking time)
        setTimeout(() => {
          addToHistory('ai-response', `${simulation.icon} ${prompt.response}`)
        }, 1500 + Math.random() * 2000) // 1.5-3.5 second delay
      }
    }, 4000 + Math.random() * 3000) // 4-7 second intervals
    
    setAiInterval(interval)
  }

  const stopAiSimulation = () => {
    if (aiInterval) {
      clearInterval(aiInterval)
      setAiInterval(null)
    }
    
    if (aiRunning) {
      const simulation = aiSimulationPrompts[aiSimulation]
      addToHistory('system', `🤖 ${simulation?.name || 'AI'} simulation terminated`)
    }
    
    setAiRunning(false)
    setAiSimulation(null)
  }

  // Cleanup AI simulation on unmount
  useEffect(() => {
    return () => {
      if (aiInterval) {
        clearInterval(aiInterval)
      }
    }
  }, [aiInterval])

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    
    if (trimmed) {
      setCommandHistory(prev => [...prev, cmd])
    }

    addToHistory('input', `terminal-${id}:~$ ${cmd}`)

    switch (trimmed) {
      case 'help':
        addToHistory('output', `Available commands:
  help          - Show this help
  clear         - Clear terminal
  status        - System status
  whoami        - Current user
  pwd           - Current directory
  ls            - List directory contents
  ps            - Running processes
  top           - System monitor
  
  Web3 Commands:
  wallet        - Connect/disconnect wallet
  balance       - Check wallet balance
  address       - Show wallet address
  chain         - Show current chain
  sign [msg]    - Sign a message
  networks      - List supported networks
  
  Social Commands:
  farcaster     - Connect/disconnect Farcaster
  twitter       - Connect/disconnect Twitter
  social        - Show all social connections
  
  AI Commands:
  ai list       - List available AI simulations
  ai start <type> - Start AI simulation
  ai stop       - Stop current simulation
  ai status     - Check simulation status
  
  Theme Commands:
  themes        - List available themes
  theme <name>  - Change terminal theme
  
  Fun Commands:
  ascii [name]  - Display ASCII art
  popup         - Show random popup message
  hack          - Activate hacker mode
  
  exit          - Close terminal`)
        break
      
      case 'clear':
        setHistory([])
        break
      
      case 'status':
        addToHistory('output', `System Status:
  OS: koHLabs Terminal OS v2.0
  Uptime: ${Math.floor(Date.now() / 1000 / 60)} minutes
  Memory: 8GB (4.2GB free)
  CPU: koHLabs Quantum Processor (8 cores)
  Network: Connected to Solana mainnet`)
        break
        
      case 'whoami':
        addToHistory('output', 'researcher')
        break
        
      case 'pwd':
        addToHistory('output', '/home/researcher/kohlabs')
        break
        
      case 'ls':
        addToHistory('output', `total 8
drwxr-xr-x  2 researcher researcher 4096 Dec 10 12:34 experiments/
drwxr-xr-x  2 researcher researcher 4096 Dec 10 12:34 data/
-rw-r--r--  1 researcher researcher  156 Dec 10 12:34 README.md
-rw-r--r--  1 researcher researcher  892 Dec 10 12:34 token_analysis.py`)
        break
        
      case 'ps':
        addToHistory('output', `  PID TTY          TIME CMD
 1234 pts/0    00:00:01 bash
 1235 pts/0    00:00:00 node
 1236 pts/0    00:00:00 kohlabs-daemon
 1237 pts/0    00:00:00 matrix-engine`)
        break
        
      case 'top':
        addToHistory('output', `top - ${new Date().toLocaleTimeString()} up ${Math.floor(Date.now() / 1000 / 60)} min
Tasks: 4 total,   1 running,   3 sleeping
%Cpu(s):  2.3 us,  1.2 sy,  0.0 ni, 96.5 id
KiB Mem :  8192000 total,  4321000 free,  2456000 used

  PID USER      %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
 1234 research   1.2  0.8  12345  6789 pts/0    S+   12:34   0:01 kohlabs-term`)
        break
        
      // Web3 Commands
      case 'wallet':
        if (isConnected) {
          addToHistory('output', `Wallet connected: ${address?.slice(0, 6)}...${address?.slice(-4)}
Chain: ${chain?.name} (ID: ${chain?.id})
Status: Connected`)
          addToHistory('output', 'Type "wallet disconnect" to disconnect')
        } else {
          addToHistory('output', 'No wallet connected. Opening connection modal...')
          openConnectModal?.()
        }
        break
        
      case 'wallet disconnect':
        if (isConnected) {
          disconnect()
          addToHistory('output', 'Wallet disconnected')
        } else {
          addToHistory('output', 'No wallet connected')
        }
        break
        
      case 'balance':
        if (isConnected && balance) {
          addToHistory('output', `Balance: ${balance.formatted} ${balance.symbol}
Decimals: ${balance.decimals}
Chain: ${chain?.name}`)
        } else if (isConnected) {
          addToHistory('output', 'Balance: Loading...')
        } else {
          addToHistory('output', 'Error: No wallet connected')
        }
        break
        
      case 'address':
        if (isConnected && address) {
          addToHistory('output', `Wallet Address: ${address}
Short: ${address.slice(0, 6)}...${address.slice(-4)}`)
        } else {
          addToHistory('output', 'Error: No wallet connected')
        }
        break
        
      case 'chain':
        if (isConnected && chain) {
          addToHistory('output', `Current Chain: ${chain.name}
Chain ID: ${chain.id}
Currency: ${chain.nativeCurrency?.symbol}
Block Explorer: ${chain.blockExplorers?.default?.name}`)
        } else {
          addToHistory('output', 'Error: No wallet connected')
        }
        break
        
      case 'networks':
        addToHistory('output', `Supported Networks:
• Ethereum (mainnet) - Chain ID: 1
• Base - Chain ID: 8453
• Optimism - Chain ID: 10
• Arbitrum One - Chain ID: 42161
• Polygon - Chain ID: 137
${import.meta.env.DEV ? '• Sepolia Testnet - Chain ID: 11155111' : ''}`)
        break

      // Social Authentication Commands
      case 'farcaster':
        if (isFarcasterConnected) {
          addToHistory('output', `Farcaster connected: @${farcasterUser.username}
FID: ${farcasterUser.fid}
Display Name: ${farcasterUser.displayName}
Type "farcaster disconnect" to disconnect`)
        } else {
          addToHistory('output', 'Connecting to Farcaster...')
          connectFarcaster().then(success => {
            if (success) {
              addToHistory('output', 'Farcaster connected successfully!')
            } else {
              addToHistory('output', 'Failed to connect to Farcaster')
            }
          })
        }
        break

      case 'farcaster disconnect':
        if (isFarcasterConnected) {
          disconnectFarcaster()
          addToHistory('output', 'Farcaster disconnected')
        } else {
          addToHistory('output', 'No Farcaster account connected')
        }
        break

      case 'twitter':
        if (isTwitterConnected) {
          addToHistory('output', `Twitter connected: @${twitterUser.username}
ID: ${twitterUser.id}
Display Name: ${twitterUser.displayName}
Type "twitter disconnect" to disconnect`)
        } else {
          addToHistory('output', 'Connecting to Twitter...')
          connectTwitter().then(success => {
            if (success) {
              addToHistory('output', 'Twitter connected successfully!')
            } else {
              addToHistory('output', 'Failed to connect to Twitter')
            }
          })
        }
        break

      case 'twitter disconnect':
        if (isTwitterConnected) {
          disconnectTwitter()
          addToHistory('output', 'Twitter disconnected')
        } else {
          addToHistory('output', 'No Twitter account connected')
        }
        break

      case 'social':
        addToHistory('output', `Social Connections:
Farcaster: ${isFarcasterConnected ? `✓ @${farcasterUser.username}` : '✗ Not connected'}
Twitter: ${isTwitterConnected ? `✓ @${twitterUser.username}` : '✗ Not connected'}
Wallet: ${isConnected ? `✓ ${address?.slice(0, 6)}...${address?.slice(-4)}` : '✗ Not connected'}`)
        break

      // Theme Commands
      case 'themes':
        const themeList = listThemes()
        addToHistory('output', `Available Themes:
${themeList.map(t => `${t.active ? '●' : '○'} ${t.icon} ${t.name} - ${t.description}`).join('\n')}

Use: theme <name> to change theme`)
        break

      // AI Commands
      case 'ai list':
        addToHistory('output', `Available AI Simulations:
${Object.entries(aiSimulationPrompts).map(([key, sim]) => 
  `${sim.icon} ${key} - ${sim.name}: ${sim.description}`
).join('\n')}

Use: ai start <type> to begin simulation`)
        break

      case 'ai status':
        if (aiRunning && aiSimulation) {
          const simulation = aiSimulationPrompts[aiSimulation]
          addToHistory('output', `AI Simulation Status: RUNNING
Type: ${simulation.name} ${simulation.icon}
Runtime: ${Math.floor((Date.now() - history.find(h => h.content.includes('Starting'))?.timestamp || Date.now()) / 1000)}s
Use "ai stop" to terminate`)
        } else {
          addToHistory('output', 'AI Simulation Status: IDLE\nUse "ai start <type>" to begin simulation')
        }
        break

      case 'ai stop':
        stopAiSimulation()
        break

      // Fun Commands
      case 'ascii':
        const randomArt = getRandomAscii()
        addToHistory('ascii', randomArt.art)
        break

      case 'popup':
        const popupMsg = getRandomPopupMessage()
        addToHistory('popup', popupMsg)
        break

      case 'hack':
        addToHistory('ascii', asciiArt.hacker)
        addToHistory('system', '💀 HACKER MODE ACTIVATED 💀')
        addToHistory('system', 'All systems are now operating at maximum stealth capacity.')
        break

      case 'exit':
        stopAiSimulation() // Clean up AI simulation
        onClose(id)
        return
        
      case '':
        // Empty command
        break
        
      default:
        // Check for sign command with message
        if (trimmed.startsWith('sign ')) {
          const message = cmd.slice(5).trim()
          if (isConnected && message) {
            addToHistory('output', `Signing message: "${message}"`)
            try {
              signMessage({ message })
              addToHistory('output', 'Message signed successfully!')
            } catch (error) {
              addToHistory('output', `Error signing message: ${error.message}`)
            }
          } else if (!isConnected) {
            addToHistory('output', 'Error: No wallet connected')
          } else {
            addToHistory('output', 'Usage: sign <message>')
          }
        } 
        // Check for theme command
        else if (trimmed.startsWith('theme ')) {
          const themeName = cmd.slice(6).trim().toLowerCase()
          const success = changeTheme(themeName)
          if (success) {
            const newTheme = listThemes().find(t => t.key === themeName)
            addToHistory('output', `Theme changed to: ${newTheme.icon} ${newTheme.name}`)
          } else {
            addToHistory('output', `Unknown theme: ${themeName}\nUse "themes" to list available themes`)
          }
        }
        // Check for AI start command
        else if (trimmed.startsWith('ai start ')) {
          const simulationType = cmd.slice(9).trim().toLowerCase()
          startAiSimulation(simulationType)
        }
        // Check for ASCII with specific name
        else if (trimmed.startsWith('ascii ')) {
          const asciiName = cmd.slice(6).trim().toLowerCase()
          if (asciiArt[asciiName]) {
            addToHistory('ascii', asciiArt[asciiName])
          } else {
            addToHistory('output', `ASCII art '${asciiName}' not found. Available: ${Object.keys(asciiArt).join(', ')}`)
          }
        }
        else {
          addToHistory('output', `bash: ${trimmed}: command not found`)
        }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      processCommand(input)
      setInput('')
      setHistoryIndex(-1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  const handleMouseDown = (e) => {
    if (e.target.closest('.terminal-header')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - terminalPosition.x,
        y: e.clientY - terminalPosition.y
      })
      onFocus(id)
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTerminalPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  if (isMinimized) {
    return null // Terminal is minimized, don't render
  }

  if (isMobileTabbed) {
    // Mobile Tabbed Mode - Full Screen Terminal
    return (
      <div className="w-full h-full flex flex-col bg-black">
        {/* Terminal Content - No Header */}
        <div className="flex-1 flex flex-col">
          {/* Output Area */}
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto font-mono p-3 text-sm"
          >
            {history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                className={`mb-1 ${
                  entry.type === 'input' 
                    ? `${theme.colors.text}` 
                    : entry.type === 'system' 
                    ? `${theme.colors.textSecondary}` 
                    : entry.type === 'ai-thinking'
                    ? `${theme.colors.textMuted} italic animate-pulse`
                    : entry.type === 'ai-response'
                    ? `${theme.colors.accent} font-medium`
                    : entry.type === 'ascii'
                    ? `${theme.colors.primary} font-mono text-xs`
                    : entry.type === 'popup'
                    ? `${theme.colors.accent} font-bold text-center animate-bounce`
                    : 'text-gray-300'
                }`}
              >
                <pre className="whitespace-pre-wrap text-xs leading-relaxed">
                  {entry.content}
                </pre>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-800 p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm" style={{ color: theme.css['--theme-primary'] || '#00ff41' }}>
                t{id}:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent font-mono text-sm focus:outline-none"
                style={{ color: theme.css['--theme-secondary'] || '#008f11' }}
                placeholder="command..."
              />
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="font-mono text-sm"
                style={{ color: theme.css['--theme-primary'] || '#00ff41' }}
              >
                █
              </motion.span>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Desktop Window Mode
  
  // If in compact mode, don't handle positioning/dragging
  if (isCompactMode) {
    return (
      <div className="w-full h-full flex flex-col bg-black rounded-lg overflow-hidden">
        {/* Terminal Content Only - No positioning */}
        <div className="flex-1 flex flex-col">
          {/* Output Area */}
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto font-mono p-3 text-sm"
          >
            {history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                className={`mb-1 ${
                  entry.type === 'input' 
                    ? `${theme.colors.text}` 
                    : entry.type === 'system' 
                    ? `${theme.colors.textSecondary}` 
                    : entry.type === 'ai-thinking'
                    ? `${theme.colors.textMuted} italic animate-pulse`
                    : entry.type === 'ai-response'
                    ? `${theme.colors.accent} font-medium`
                    : entry.type === 'ascii'
                    ? `${theme.colors.primary} font-mono text-xs`
                    : entry.type === 'popup'
                    ? `${theme.colors.accent} font-bold text-center animate-bounce`
                    : 'text-gray-300'
                }`}
              >
                <pre className="whitespace-pre-wrap text-xs leading-relaxed">
                  {entry.content}
                </pre>
              </motion.div>
            ))}

            {/* AI Simulation Display */}
            {aiRunning && aiSimulation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-gray-800/50 rounded"
              >
                <div className="text-green-400 text-xs mb-2 font-semibold">
                  🤖 AI Simulation: {aiSimulation.type}
                </div>
                <div className="text-gray-300 text-xs">
                  {aiSimulation.status}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-900 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className={`${theme.colors.primary} font-mono text-sm`}>
                researcher@kohlabs:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none placeholder-gray-600"
                placeholder="Type 'help' for commands..."
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>
    )
  }
  
  // Original desktop mode with positioning
  return (
    <motion.div
      ref={terminalRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: terminalPosition.x,
        y: terminalPosition.y
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="fixed select-none"
      style={{ 
        zIndex: isFocused ? 1000 : zIndex,
        left: 0,
        top: 0,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onFocus(id)}
    >
      {/* Terminal Window */}
      <div 
        className={`${
          isMobileView 
            ? 'w-full h-full max-h-[80vh] rounded-lg' // Mobile: full width, responsive height
            : 'w-[700px] h-[500px] rounded-lg' // Desktop: larger fixed size
        } bg-gray-900 shadow-2xl border transition-all duration-200 ${
          isFocused 
            ? `border-blue-500 shadow-blue-500/20 shadow-2xl ${theme.colors.glow}` 
            : 'border-gray-600 shadow-gray-900/50'
        }`}
        style={{
          transform: isMobileView 
            ? 'none' // Mobile: no 3D transform
            : 'perspective(1000px) rotateX(1deg) rotateY(-0.5deg)', // Desktop: subtle 3D
          transformStyle: 'preserve-3d',
          boxShadow: isFocused 
            ? `0 25px 50px -12px ${theme.css['--theme-glow'] || 'rgba(59, 130, 246, 0.3)'}, 0 0 0 1px ${theme.css['--theme-primary'] || '#3b82f6'}20`
            : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Terminal Header */}
        <div 
          className="terminal-header flex items-center justify-between p-3 bg-gray-800 rounded-t-lg cursor-move"
          style={{
            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
          }}
        >
          {/* Window Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onClose(id)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            />
            <button 
              onClick={() => setIsMinimized(true)}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
            />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
          </div>

          {/* Terminal Title */}
          <div className={`text-gray-300 font-medium flex items-center gap-2 ${
            isMobileView ? 'text-xs' : 'text-sm'
          }`}>
            <span>{theme.icon}</span>
            {isMobileView ? `T${id}` : `Terminal ${id} - koHLabs`}
            {aiRunning && (
              <span className={`bg-green-500 text-black px-2 py-0.5 rounded-full animate-pulse ${
                isMobileView ? 'text-xs' : 'text-xs'
              }`}>
                AI
              </span>
            )}
          </div>

          {/* Terminal Menu */}
          <div className={`text-gray-500 ${isMobileView ? 'text-xs' : 'text-xs'}`}>
            {isMobileView ? 'kohlabs' : 'researcher@kohlabs'}
          </div>
        </div>

        {/* Terminal Content */}
        <div className={`${
          isMobileView 
            ? 'h-[calc(100%-48px)]' // Mobile: calculate from full height
            : 'h-[calc(500px-48px-40px)]' // Desktop: calculate from 500px height
        } flex flex-col bg-black rounded-none`}>
          {/* Output Area */}
          <div
            ref={outputRef}
            className={`flex-1 overflow-y-auto font-mono ${
              isMobileView ? 'p-2 text-xs' : 'p-3 text-sm'
            }`}
          >
            {history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                className={`mb-1 ${
                  entry.type === 'input' 
                    ? `${theme.colors.text}` 
                    : entry.type === 'system' 
                    ? `${theme.colors.textSecondary}` 
                    : entry.type === 'ai-thinking'
                    ? `${theme.colors.textMuted} italic animate-pulse`
                    : entry.type === 'ai-response'
                    ? `${theme.colors.accent} font-medium`
                    : entry.type === 'ascii'
                    ? `${theme.colors.primary} font-mono text-xs`
                    : entry.type === 'popup'
                    ? `${theme.colors.accent} font-bold text-center animate-bounce`
                    : 'text-gray-300'
                }`}
              >
                <pre className="whitespace-pre-wrap text-xs leading-relaxed">
                  {entry.content}
                </pre>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className={`border-t border-gray-800 ${
            isMobileView ? 'p-2' : 'p-3'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-mono ${
                isMobileView ? 'text-xs' : 'text-sm'
              }`} style={{ color: theme.css['--theme-primary'] || '#00ff41' }}>
                {isMobileView ? `t${id}:~$` : `terminal-${id}:~$`}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 bg-transparent font-mono focus:outline-none ${
                  isMobileView ? 'text-xs' : 'text-sm'
                }`}
                style={{ color: theme.css['--theme-secondary'] || '#008f11' }}
                placeholder={isMobileView ? "command..." : "Enter command..."}
              />
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`font-mono ${isMobileView ? 'text-xs' : 'text-sm'}`}
                style={{ color: theme.css['--theme-primary'] || '#00ff41' }}
              >
                █
              </motion.span>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default OSTerminal