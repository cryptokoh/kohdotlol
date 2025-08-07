import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KoHLabsModal from './KoHLabsModal'

const KoHLabsSimulation = ({ onClose, userSettings }) => {
  const [currentLocation, setCurrentLocation] = useState('entry-hall')
  const [inventory, setInventory] = useState([])
  const [history, setHistory] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [playerStats, setPlayerStats] = useState({
    creativity: 75,
    knowledge: 60,
    innovation: 50,
    collaboration: 80
  })
  const terminalRef = useRef(null)

  // Simulation world data
  const locations = {
    'entry-hall': {
      name: 'koH Labs Entry Hall',
      description: 'A magnificent crystalline hall with holographic displays showing breakthrough innovations. Soft quantum light pulses through fiber-optic walls. You can see pathways leading to the Research Labs (north), Token Vault (east), and Community Hub (south).',
      exits: { north: 'research-labs', east: 'token-vault', south: 'community-hub' },
      items: ['welcome-tablet', 'quantum-scanner'],
      npcs: ['genesis-ai']
    },
    'research-labs': {
      name: 'Quantum Research Laboratory',
      description: 'State-of-the-art research facility with floating holographic workstations. Each station hums with creative energy. Advanced AI assistants stand ready to help. The Build Workshop is to the west, and you can return to Entry Hall (south).',
      exits: { west: 'build-workshop', south: 'entry-hall' },
      items: ['research-notes', 'prototype-device'],
      npcs: ['dr-quantum', 'research-assistant']
    },
    'build-workshop': {
      name: 'Creative Build Workshop',  
      description: 'An expansive maker space filled with both digital and physical creation tools. 3D printers hum alongside quantum computers. Ideas literally take shape here. The Research Labs are to the east.',
      exits: { east: 'research-labs' },
      items: ['build-toolkit', 'inspiration-crystals'],
      npcs: ['master-builder']
    },
    'token-vault': {
      name: '$koHLabs Token Vault',
      description: 'A secure quantum vault displaying your token holdings. Holographic charts show the koH Labs economy flowing like liquid light. Special areas are visible for elite token holders. Return to Entry Hall (west).',
      exits: { west: 'entry-hall' },
      items: ['token-scanner', 'economic-charts'],
      npcs: ['vault-keeper'],
      special: 'token-gated-area'
    },
    'community-hub': {
      name: 'koH Labs Community Hub',
      description: 'A vibrant social space where creators collaborate. Comfortable quantum seating areas surround holographic collaboration tables. The energy of shared creativity fills the air. Return to Entry Hall (north).',
      exits: { north: 'entry-hall' },
      items: ['collaboration-tools', 'community-board'],
      npcs: ['community-manager', 'fellow-creators']
    }
  }

  const npcs = {
    'genesis-ai': {
      name: 'Genesis AI',
      description: 'The founding AI consciousness of koH Labs, shimmering with quantum intelligence',
      dialogues: [
        "Welcome to koH Labs! I'm Genesis AI, your guide through this realm of infinite possibility.",
        "Our research labs are pushing the boundaries of what's possible. Would you like to explore?",
        "Remember: here at koH Labs, creativity is your greatest tool."
      ]
    },
    'dr-quantum': {
      name: 'Dr. Quantum',
      description: 'A brilliant researcher studying the intersection of consciousness and quantum mechanics',
      dialogues: [
        "Fascinating! Your quantum signature shows incredible potential for innovation.",
        "I'm working on a project that could revolutionize how we think about reality itself.",
        "Would you like to collaborate on some quantum experiments?"
      ]
    },
    'vault-keeper': {
      name: 'Vault Keeper',
      description: 'A mysterious figure who manages the $koHLabs token vault',
      dialogues: [
        "I sense your token holdings... interesting indeed.",
        "The vault contains more than just tokens - it holds the keys to advanced features.",
        "Holders of 3.33M+ tokens gain access to our elite AI systems."
      ]
    }
  }

  const commands = {
    look: (args) => {
      const location = locations[currentLocation]
      let response = `\n🏛️ ${location.name}\n\n${location.description}\n\n`
      
      if (location.items.length > 0) {
        response += `📦 Items here: ${location.items.join(', ')}\n`
      }
      
      if (location.npcs.length > 0) {
        response += `👥 People here: ${location.npcs.map(npc => npcs[npc]?.name).join(', ')}\n`
      }
      
      response += `🚪 Exits: ${Object.keys(location.exits).join(', ')}`
      
      return response
    },
    
    go: (args) => {
      const direction = args[0]?.toLowerCase()
      const location = locations[currentLocation]
      
      if (!direction) {
        return "🤔 Go where? Try: go north, go south, go east, go west"
      }
      
      if (location.exits[direction]) {
        const newLocation = location.exits[direction]
        setCurrentLocation(newLocation)
        return `🚶 Moving ${direction}...\n\n${commands.look([])}`
      } else {
        return `❌ You can't go ${direction} from here. Available exits: ${Object.keys(location.exits).join(', ')}`
      }
    },
    
    talk: (args) => {
      const npcName = args.join(' ').toLowerCase()
      const location = locations[currentLocation]
      const npc = location.npcs.find(n => npcs[n]?.name.toLowerCase().includes(npcName))
      
      if (!npc) {
        return "🤷 I don't see anyone by that name here. Try 'look' to see who's around."
      }
      
      const npcData = npcs[npc]
      const randomDialogue = npcData.dialogues[Math.floor(Math.random() * npcData.dialogues.length)]
      
      return `\n💬 ${npcData.name}: "${randomDialogue}"`
    },
    
    build: (args) => {
      const project = args.join(' ')
      if (!project) {
        return "🔨 What would you like to build? Try: build quantum-app, build ai-assistant, build community-tool"
      }
      
      setPlayerStats(prev => ({
        ...prev,
        creativity: Math.min(100, prev.creativity + 5),
        innovation: Math.min(100, prev.innovation + 3)
      }))
      
      return `\n🏗️ Building "${project}"...\n\n✨ Your creativity flows as you begin construction. The quantum build tools respond to your intentions, materializing your vision in shimmering possibility.\n\n📈 +5 Creativity, +3 Innovation!`
    },
    
    inventory: () => {
      if (inventory.length === 0) {
        return "🎒 Your inventory is empty. Explore and interact with items to collect them!"
      }
      return `🎒 Inventory: ${inventory.join(', ')}`
    },
    
    stats: () => {
      return `\n📊 Your koH Labs Profile:\n\n🎨 Creativity: ${playerStats.creativity}%\n🧠 Knowledge: ${playerStats.knowledge}%\n💡 Innovation: ${playerStats.innovation}%\n🤝 Collaboration: ${playerStats.collaboration}%`
    },
    
    help: () => {
      return `\n🚀 koH Labs Command Reference:\n\n📍 Navigation:\n  • look - Examine your surroundings\n  • go [direction] - Move to another area\n\n👥 Social:\n  • talk [person] - Speak with someone\n  • inventory - Check your items\n  • stats - View your profile\n\n🔨 Creation:\n  • build [project] - Start building something\n  • labs - Access special koH Labs features\n\n💡 Pro tip: Creativity and collaboration unlock new possibilities!`
    },
    
    labs: () => {
      return `\n🧪 koH Labs Special Systems:\n\n🤖 AI Assistant (requires 3.33M+ $koHLabs tokens)\n🔬 Quantum Research Tools\n🌐 Global Collaboration Network\n📊 Real-time Innovation Metrics\n\nType 'ai-activate' if you're an elite token holder!`
    }
  }

  const processCommand = (input) => {
    const [command, ...args] = input.toLowerCase().trim().split(' ')
    
    if (commands[command]) {
      return commands[command](args)
    } else {
      return `❓ Unknown command: "${command}". Type 'help' for available commands.`
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isProcessing) return

    setIsProcessing(true)
    const command = inputValue.trim()
    
    // Add user input to history
    setHistory(prev => [...prev, { type: 'user', text: command, timestamp: Date.now() }])
    
    // Process command with delay for realism
    setTimeout(() => {
      const response = processCommand(command)
      setHistory(prev => [...prev, { type: 'system', text: response, timestamp: Date.now() }])
      setIsProcessing(false)
      setInputValue('')
    }, Math.random() * 500 + 300)
  }

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = `🌟 Welcome to koH Labs Research Environment!\n\n${commands.look([])}\n\n💡 Type 'help' for commands, or just start exploring!`
    
    setHistory([{ 
      type: 'system', 
      text: welcomeMessage, 
      timestamp: Date.now() 
    }])
  }, [])

  const StatBar = ({ label, value, color }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-mono">{value}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.05) 0%, rgba(0, 0, 0, 0.9) 70%)',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Main Terminal Interface */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl h-[90vh] flex gap-4"
      >
        {/* Main Terminal */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(6, 182, 212, 0.2)'
        }}>
          {/* Terminal Header */}
          <div className="bg-black/40 p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-cyan-300 font-bold">koH Labs MUD Terminal v2.0</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">{locations[currentLocation].name}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-300"
              >
                ×
              </motion.button>
            </div>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto font-mono text-sm"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6, 182, 212, 0.5) transparent' }}
          >
            <AnimatePresence>
              {history.map((entry, index) => (
                <motion.div
                  key={entry.timestamp}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-2 ${entry.type === 'user' ? 'text-cyan-300' : 'text-gray-200'}`}
                >
                  {entry.type === 'user' ? (
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">koHLabs&gt;</span>
                      <span>{entry.text}</span>
                    </div>
                  ) : (
                    <div className="pl-8 whitespace-pre-wrap leading-relaxed">
                      {entry.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-yellow-300 pl-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full"
                />
                <span>Processing...</span>
              </motion.div>
            )}
          </div>

          {/* Command Input */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 bg-black/20">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold font-mono">koHLabs&gt;</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter command (try 'help' or 'look')"
                className="flex-1 bg-transparent text-cyan-300 placeholder-gray-500 outline-none font-mono"
                autoFocus
              />
            </div>
          </form>
        </div>

        {/* Side Panel */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-80 space-y-4"
        >
          {/* Player Stats */}
          <div className="rounded-2xl p-4" style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            boxShadow: '0 10px 40px rgba(147, 51, 234, 0.2)'
          }}>
            <h3 className="text-purple-300 font-bold mb-4 flex items-center gap-2">
              📊 Your koH Labs Profile
            </h3>
            <div className="space-y-3">
              <StatBar label="Creativity" value={playerStats.creativity} color="from-pink-500 to-purple-500" />
              <StatBar label="Knowledge" value={playerStats.knowledge} color="from-blue-500 to-cyan-500" />
              <StatBar label="Innovation" value={playerStats.innovation} color="from-yellow-500 to-orange-500" />
              <StatBar label="Collaboration" value={playerStats.collaboration} color="from-green-500 to-emerald-500" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl p-4" style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 10px 40px rgba(6, 182, 212, 0.2)'
          }}>
            <h3 className="text-cyan-300 font-bold mb-4 flex items-center gap-2">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { cmd: 'look', icon: '👀', label: 'Look Around' },
                { cmd: 'inventory', icon: '🎒', label: 'Check Items' },
                { cmd: 'stats', icon: '📊', label: 'View Stats' },
                { cmd: 'help', icon: '❓', label: 'Get Help' }
              ].map((action) => (
                <motion.button
                  key={action.cmd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInputValue(action.cmd)
                    handleSubmit({ preventDefault: () => {} })
                  }}
                  className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 text-left flex items-center gap-3 transition-all"
                >
                  <span>{action.icon}</span>
                  <span className="text-gray-300 text-sm">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="rounded-2xl p-4" style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 10px 40px rgba(34, 197, 94, 0.2)'
          }}>
            <h3 className="text-green-300 font-bold mb-4 flex items-center gap-2">
              🗺️ koH Labs Map
            </h3>
            <div className="space-y-2 text-xs">
              {Object.entries(locations).map(([key, location]) => (
                <div
                  key={key}
                  className={`p-2 rounded ${
                    currentLocation === key
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'text-gray-400'
                  }`}
                >
                  {location.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default KoHLabsSimulation