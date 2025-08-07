import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const Terminal = () => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState([])
  const [isDangerous, setIsDangerous] = useState(false)
  const [konamiCode, setKonamiCode] = useState('')
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  // Lab-themed ASCII art
  const asciiArt = {
    kohlabs: `
    ██╗  ██╗ ██████╗ ██╗  ██╗██╗      █████╗ ██████╗ ███████╗
    ██║ ██╔╝██╔═══██╗██║  ██║██║     ██╔══██╗██╔══██╗██╔════╝
    █████╔╝ ██║   ██║███████║██║     ███████║██████╔╝███████╗
    ██╔═██╗ ██║   ██║██╔══██║██║     ██╔══██║██╔══██╗╚════██║
    ██║  ██╗╚██████╔╝██║  ██║███████╗██║  ██║██████╔╝███████║
    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝`,
    
    dna: `
        ⟨◉⟩══⟨◉⟩══⟨◉⟩
       ╱            ╲
      ⟨◉⟩            ⟨◉⟩
       ╲            ╱
        ⟨◉⟩══⟨◉⟩══⟨◉⟩
       ╱            ╲
      ⟨◉⟩  DNA HELIX ⟨◉⟩`,
    
    molecule: `
         ◯
         ║
    ◯═══◯═══◯
         ║
         ◯`,
    
    beaker: `
        🧪
       ╱ ╲
      ╱   ╲
     ╱~~~~~╲
    ╱~~~~~~~╲
   ╱~~~~~~~~~╲
  ╱~~~~~~~~~~~╲
 ╱─────────────╲`,
    
    rocket: `
         🚀
        ╱║╲
       ╱ ║ ╲
      ╱  ║  ╲
     ╱   ║   ╲
    ╱    ║    ╲
   ╱─────║─────╲
  ╱      ║      ╲
 ╱───────║───────╲`,
  }

  const responses = {
    help: `
🧬 koH Labs Terminal v0.0.1 🧬
═════════════════════════════

LABORATORY PROTOCOLS:
  analyze        - Molecular composition analysis
  experiment     - Start new experiment
  synthesize     - Create meme compounds
  dna            - Genetic sequencing display
  beaker         - Check chemical reactions
  periodic       - View periodic table of DeFi
  quantum        - Quantum state analysis
  coffee         - Dispense liquid motivation
  science        - Run hypothesis testing
  konami         - Ultimate lab mode
  dangerous      - Enable dangerous experiments
  matrix         - Reality check
  clear          - Sterilize workspace
  
SPECIMEN COMMANDS:
  token <addr>   - Analyze token structure
  balance        - Check compound levels
  swap           - Molecular exchange
  stake          - Compound stabilization
  
Type any command to begin your research...
⚗️ Remember: All experiments are recorded for science! ⚗️`,

    welcome: `
🔬 WELCOME TO koH LABS RESEARCH FACILITY 🔬
═══════════════════════════════════════════

Initializing quantum laboratory protocols...
Loading molecular database...
Establishing blockchain link...

Status: QUANTUM LINK ACTIVE ⚡
Lab Safety: PROTOCOLS ENGAGED 🛡️
Meme Synthesis: READY FOR EXPERIMENTS 🧪

From memes to molecules, from tokens to transformations.
$koHLabs is where digital evolution accelerates.

Ready to conduct some molecular DeFi experiments?
Type 'help' to view available lab protocols.
`,

    konami: `
🌟 ULTIMATE LAB MODE ACTIVATED! 🌟
═════════════════════════════════

⚡ QUANTUM ENTANGLEMENT ESTABLISHED ⚡
🧬 GENETIC ALGORITHMS UNLOCKED 🧬  
🚀 ROCKET FUEL INJECTED 🚀
💎 DIAMOND HANDS REINFORCED 💎
🔥 MATRIX RAIN INTENSITY: MAXIMUM 🔥

Welcome to the elite research division.
You now have access to all lab protocols.
Proceed with enhanced molecular awareness.
`,

    dangerous: `
⚠️  DANGER: ENTERING EXPERIMENTAL ZONE ⚠️
═══════════════════════════════════════════

🧪 Chemical reactions may be volatile
⚛️  Quantum states will fluctuate wildly  
🔬 Molecular bonds may destabilize
💥 Explosive results are possible
🚨 Safety protocols are DISENGAGED

Type 'I UNDERSTAND THE RISKS' to continue
or 'exit' to return to safe mode...
`,

    matrix: `There is no spoon... only Solana.
Wake up, researcher. The lab needs you.
🔴💊 or 🔵💊 ?`,

    coffee: `
☕ DISPENSING LIQUID MOTIVATION ☕
═══════════════════════════════════

Brewing optimal caffeine concentration...
Adding synthetic creativity compounds...
Stabilizing focus enhancement molecules...

*DING!* ☕

Your coffee contains:
- 200mg Caffeine (C₈H₁₀N₄O₂)
- 50mg L-Theanine for smooth energy
- Trace amounts of hopium (C₁₀H₁₅N)
- Diamond dust for hand strengthening

Ready for another 16-hour research session!
`,

    science: `
🔬 HYPOTHESIS TESTING INITIATED 🔬
═══════════════════════════════════

H₀: Traditional finance is sufficient
H₁: DeFi will revolutionize everything

Running statistical analysis...
Calculating p-values...
Measuring significance levels...

RESULT: H₁ CONFIRMED! 📊
p < 0.001 (highly significant)
Confidence interval: 99.9%

Conclusion: DeFi revolution is statistically inevitable!
Next experiment: Meme-to-molecule transformation...
`,

    dna: `${asciiArt.dna}

🧬 GENETIC SEQUENCING IN PROGRESS 🧬
═══════════════════════════════════════

Analyzing $koHLabs genetic structure...
Reading base pairs... A-T-C-G-HODL-MOON...

Sequence: ATCG-HODL-DIAMOND-HANDS-TO-THE-MOON-ATCG
Length: 1,000,000,000 base pairs
Mutations detected: ONLY POSITIVE ONES 🚀

Genetic traits identified:
✓ Resistance to FUD (99.9% immunity)  
✓ Enhanced diamond hand grip strength
✓ Automatic HODL instinct
✓ Moon-seeking navigation system
✓ Meme synthesis capabilities

Your genome is optimized for DeFi success!
`,

    beaker: `${asciiArt.beaker}

🧪 CHEMICAL REACTION STATUS 🧪
═══════════════════════════════

Current experiments in progress:
- Hopium + Copium = Sustainable Energy ⚡
- Diamond Hands + Paper Hands = Volatility 📈
- Memes + Technology = $koHLabs 🚀
- FOMO + DYOR = Balanced Portfolio ⚖️

Reaction rates:
⚗️ Bullish compounds: 94% yield
🧪 Bearish neutralization: 78% complete  
🔬 Moon fuel synthesis: 156% efficiency

All beakers are bubbling optimally!
No explosions detected today. 💥❌
`,
  }

  // Safety tips that appear randomly
  const safetyTips = [
    "💡 Lab Safety Tip: Always DYOR before handling unknown compounds",
    "🥽 Remember: Diamond hands prevent burns from volatile reactions", 
    "⚠️ Caution: High-yield experiments may cause excessive euphoria",
    "🧪 Note: Paper hands will dissolve in strong bull markets",
    "🔬 Warning: Prolonged exposure to charts may cause addiction",
    "⚡ Reminder: Keep your private keys in a fireproof lab safe",
  ]

  // Initialize with welcome message
  useEffect(() => {
    setHistory([{
      type: 'output',
      content: responses.welcome
    }])
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Random safety tips
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const tip = safetyTips[Math.floor(Math.random() * safetyTips.length)]
        addToHistory('system', tip)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA'
      const newCode = konamiCode + e.code
      
      if (konamiSequence.startsWith(newCode)) {
        setKonamiCode(newCode)
        if (newCode === konamiSequence) {
          addToHistory('output', responses.konami)
          setKonamiCode('')
        }
      } else {
        setKonamiCode('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiCode])

  const addToHistory = (type, content) => {
    setHistory(prev => [...prev, { type, content, timestamp: Date.now() }])
  }

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    
    // Add to command history
    if (trimmed) {
      setCommandHistory(prev => [...prev, cmd])
    }

    // Add command to display history
    addToHistory('input', `🧬scientist@koHLabs~/lab$ ${cmd}`)

    // Process commands
    switch (trimmed) {
      case 'help':
        addToHistory('output', responses.help)
        break
      
      case 'clear':
        setHistory([])
        addToHistory('system', '🧹 Workspace sterilized. Ready for new experiments.')
        break
      
      case 'konami':
        addToHistory('output', responses.konami)
        break
        
      case 'dangerous':
        if (isDangerous) {
          addToHistory('system', '⚠️ Already in dangerous mode. Type "safe" to return to normal operations.')
        } else {
          addToHistory('output', responses.dangerous)
        }
        break
        
      case 'i understand the risks':
        if (!isDangerous) {
          setIsDangerous(true)
          addToHistory('system', '💀 DANGEROUS MODE ACTIVATED 💀\nAll safety protocols disabled. Proceed with extreme caution.')
        }
        break
        
      case 'safe':
      case 'exit':
        setIsDangerous(false)
        addToHistory('system', '🛡️ Returning to safe mode. Safety protocols re-engaged.')
        break
        
      case 'matrix':
        addToHistory('output', responses.matrix)
        break
        
      case 'coffee':
        addToHistory('output', responses.coffee)
        break
        
      case 'science':
        addToHistory('output', responses.science)
        break
        
      case 'dna':
        addToHistory('output', responses.dna)
        break
        
      case 'beaker':
        addToHistory('output', responses.beaker)
        break
        
      case 'experiment':
        addToHistory('output', '🧪 Experiment initialized...\nHypothesis: User engagement increases with terminal interfaces\nRunning A/B test... Results: 347% improvement! 🚀')
        break
        
      case 'analyze':
        addToHistory('output', '🔬 Molecular analysis in progress...\nCompound: $koHLabs Token\nStructure: Highly stable with diamond lattice formation\nVolatility: Optimized for moon trajectory 🌙')
        break
        
      case 'synthesize':
        addToHistory('output', '⚗️ Synthesis process initiated...\nCombining: Memes + Technology + Community\nResult: Pure $koHLabs compound created! ✨\nYield: 1,000,000,000 tokens')
        break
        
      case 'quantum':
        addToHistory('output', '⚛️ Quantum state analysis:\nState: |HODL⟩ + |MOON⟩ (superposition)\nEntanglement: Maximum with community\nProbability of success: 99.99% 🎯')
        break
        
      case 'periodic':
        addToHistory('output', `📊 PERIODIC TABLE OF DeFi ELEMENTS:
H - Hopium (atomic number: ∞)
Li - Liquidity (highly reactive)  
C - Community (carbon backbone)
Au - Gold standard (traditional)
D - Diamond hands (unbreakable bonds)
M - Moon (rare earth element)`)
        break
        
      case '':
        // Empty command, do nothing
        break
        
      default:
        if (trimmed.startsWith('token ')) {
          const addr = trimmed.split(' ')[1]
          addToHistory('output', `🔍 Analyzing token: ${addr}\nStructure: ERC-20/SPL compatible\nMolecular weight: Variable\nRecommendation: HODL for maximum stability ⚗️`)
        } else {
          addToHistory('output', `❓ Unknown protocol: '${trimmed}'\nConsult the lab manual with 'help' command.\nOr try experimenting - science requires trial and error! 🔬`)
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

  const getPrompt = () => {
    if (isDangerous) return '💀root@koHLabs~/lab#'
    return '🧬scientist@koHLabs~/lab$'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-4xl mx-auto"
    >
      {/* Terminal Window */}
      <div className="bg-black/90 backdrop-blur-lg border border-green-500/30 rounded-lg shadow-2xl shadow-green-500/20">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-green-500/20 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-green-400 text-sm font-mono">
            koH Labs Terminal v0.0.1 {isDangerous && '💀 DANGEROUS MODE'}
          </div>
          <div className="text-green-400/60 text-xs">
            ⚡ QUANTUM LINK ACTIVE
          </div>
        </div>

        {/* Terminal Content */}
        <div
          ref={outputRef}
          className="h-96 overflow-y-auto p-4 font-mono text-sm bg-black/50"
        >
          {history.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.01 }}
              className={`mb-2 ${
                entry.type === 'input' ? 'text-green-300' :
                entry.type === 'system' ? 'text-yellow-300' :
                'text-green-100'
              }`}
            >
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {entry.content}
              </pre>
            </motion.div>
          ))}
        </div>

        {/* Terminal Input */}
        <form onSubmit={handleSubmit} className="border-t border-green-500/20 p-4">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm ${isDangerous ? 'text-red-400' : 'text-green-400'}`}>
              {getPrompt()}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-300 font-mono text-sm focus:outline-none"
              placeholder="Enter lab protocol..."
              autoFocus
            />
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-green-400 font-mono"
            >
              █
            </motion.span>
          </div>
        </form>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center text-xs font-mono text-green-400/60">
        <div>
          Status: {isDangerous ? '💀 EXPERIMENTAL MODE' : '🛡️ SAFE MODE'} | 
          Commands: {commandHistory.length} | 
          Uptime: {Math.floor(Date.now() / 1000 / 60)}min
        </div>
        <div>
          🧪 Lab protocols loaded | ⚡ Quantum entangled
        </div>
      </div>
    </motion.div>
  )
}

export default Terminal