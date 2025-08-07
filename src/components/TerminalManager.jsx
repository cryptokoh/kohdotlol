import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OSTerminal from './OSTerminal'
import { useView } from '../contexts/ViewContext'

const TerminalManager = () => {
  const { isMobileView } = useView()
  const [terminals, setTerminals] = useState([
    { id: 1, position: { x: 100, y: 100 }, zIndex: 1 }
  ])
  const [focusedTerminal, setFocusedTerminal] = useState(1)
  const [nextId, setNextId] = useState(2)

  const createNewTerminal = useCallback(() => {
    const maxTerminals = isMobileView ? 1 : 3 // Mobile: 1 terminal, Desktop: 3 terminals
    if (terminals.length >= maxTerminals) return
    
    const newTerminal = {
      id: nextId,
      position: isMobileView 
        ? { x: 0, y: 0 } // Mobile: fixed position
        : { // Desktop: staggered positions
            x: 100 + (terminals.length * 50), 
            y: 100 + (terminals.length * 50) 
          },
      zIndex: nextId
    }
    
    setTerminals(prev => [...prev, newTerminal])
    setFocusedTerminal(nextId)
    setNextId(prev => prev + 1)
  }, [terminals.length, nextId, isMobileView])

  const closeTerminal = useCallback((id) => {
    setTerminals(prev => {
      const updated = prev.filter(t => t.id !== id)
      // If we closed the focused terminal, focus the first remaining one
      if (id === focusedTerminal && updated.length > 0) {
        setFocusedTerminal(updated[0].id)
      }
      return updated
    })
  }, [focusedTerminal])

  const focusTerminal = useCallback((id) => {
    setFocusedTerminal(id)
    setTerminals(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, zIndex: 1000 }
          : { ...t, zIndex: t.zIndex < 1000 ? t.zIndex : t.zIndex - 1 }
      )
    )
  }, [])

  const arrangeTerminals = useCallback(() => {
    const arrangements = {
      1: [{ x: 300, y: 200 }],
      2: [
        { x: 150, y: 150 }, 
        { x: 450, y: 200 }
      ],
      3: [
        { x: 50, y: 100 }, 
        { x: 350, y: 150 }, 
        { x: 650, y: 200 }
      ]
    }
    
    const arrangement = arrangements[terminals.length] || arrangements[3]
    
    setTerminals(prev => 
      prev.map((terminal, index) => ({
        ...terminal,
        position: arrangement[index] || arrangement[arrangement.length - 1]
      }))
    )
  }, [terminals.length])

  return (
    <div className="relative w-full h-full">
      {/* Desktop Environment - Hide animated elements on mobile */}
      {!isMobileView && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Desktop Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Subtle Animated Orbs */}
          <motion.div
            animate={{ 
              x: [0, 100, -50, 0],
              y: [0, -50, 100, 0],
            }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 60, 0],
              y: [0, 80, -60, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          />
        </div>
      )}

      {/* Terminals */}
      <AnimatePresence>
        {terminals.map((terminal) => (
          <OSTerminal
            key={terminal.id}
            id={terminal.id}
            position={terminal.position}
            zIndex={terminal.zIndex}
            isFocused={focusedTerminal === terminal.id}
            onFocus={focusTerminal}
            onClose={closeTerminal}
          />
        ))}
      </AnimatePresence>

      {/* Taskbar - Responsive Design */}
      {!isMobileView && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg border-t border-gray-700"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
          }}
        >
          <div className="flex items-center justify-between p-3">
            {/* Left side - System info */}
            <div className="flex items-center gap-4">
              <div className="text-blue-400 font-semibold text-sm">koHLabs OS</div>
              <div className="text-gray-400 text-xs">
                {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Center - Terminal controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createNewTerminal}
                disabled={terminals.length >= 3}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-md transition-colors font-medium"
              >
                + New Terminal
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={arrangeTerminals}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors font-medium"
              >
                Arrange
              </motion.button>
            </div>

            {/* Right side - Running terminals */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">Active:</span>
              {terminals.map((terminal) => (
                <motion.button
                  key={terminal.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => focusTerminal(terminal.id)}
                  className={`w-8 h-8 rounded-md text-xs font-semibold transition-all ${
                    focusedTerminal === terminal.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {terminal.id}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* System Status HUD */}
      <div className="fixed top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs font-mono text-green-400 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>SYSTEM ONLINE</span>
        </div>
        <div>Terminals: {terminals.length}/3</div>
        <div>Memory: {Math.floor(Math.random() * 30 + 60)}%</div>
        <div>CPU: {Math.floor(Math.random() * 20 + 5)}%</div>
      </div>

      {/* Welcome Message */}
      {terminals.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed top-4 left-4 bg-blue-600/90 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-sm"
        >
          <div className="font-semibold mb-2">🖥️ Welcome to koHLabs Terminal OS</div>
          <div className="text-sm opacity-90">
            • Drag terminals by their title bar to move them
            • Click "New Terminal" to open up to 3 terminals  
            • Use "Arrange" to organize your workspace
            • Click terminal numbers in taskbar to focus
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TerminalManager