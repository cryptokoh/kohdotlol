import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OSTerminal from './OSTerminal'
import { useView } from '../contexts/ViewContext'
import { useTheme } from '../contexts/ThemeContext'

const EnhancedTerminalManager = ({ autoTrigger = false, autoAI = false }) => {
  const { isMobileView } = useView()
  const { theme } = useTheme()
  const [terminals, setTerminals] = useState([])
  const [focusedTerminal, setFocusedTerminal] = useState(null)
  const [nextId, setNextId] = useState(1)
  const autoTriggerRef = useRef(false)

  // Auto-create terminal when triggered
  useEffect(() => {
    if (autoTrigger && !autoTriggerRef.current && terminals.length === 0) {
      autoTriggerRef.current = true
      
      // Delay for dramatic effect
      setTimeout(() => {
        createNewTerminal(true) // Auto-start AI simulation
      }, 2000)
    }
  }, [autoTrigger])

  const createNewTerminal = useCallback((startAI = false) => {
    const maxTerminals = isMobileView ? 1 : 3
    if (terminals.length >= maxTerminals) return
    
    const newTerminal = {
      id: nextId,
      position: isMobileView 
        ? { x: 0, y: 0 }
        : { 
            x: 100 + (terminals.length * 50), 
            y: 100 + (terminals.length * 50) 
          },
      zIndex: nextId,
      autoStartAI: startAI
    }
    
    setTerminals(prev => [...prev, newTerminal])
    setFocusedTerminal(nextId)
    setNextId(prev => prev + 1)
  }, [terminals.length, nextId, isMobileView])

  const closeTerminal = useCallback((id) => {
    setTerminals(prev => {
      const updated = prev.filter(t => t.id !== id)
      if (id === focusedTerminal && updated.length > 0) {
        setFocusedTerminal(updated[0].id)
      } else if (updated.length === 0) {
        setFocusedTerminal(null)
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
            autoStartAI={terminal.autoStartAI}
          />
        ))}
      </AnimatePresence>

      {/* Taskbar - Desktop Only */}
      {!isMobileView && terminals.length > 0 && (
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
                onClick={() => createNewTerminal()}
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

      {/* System Status HUD - Show only if terminals exist */}
      {terminals.length > 0 && (
        <div className={`fixed bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs font-mono space-y-1 ${
          isMobileView 
            ? 'top-2 right-2 text-xs' 
            : 'top-4 right-4'
        }`} style={{ color: theme.css['--theme-primary'] || '#00ff41' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>SYSTEM ONLINE</span>
          </div>
          <div>Terminals: {terminals.length}/{isMobileView ? 1 : 3}</div>
          <div>Memory: {Math.floor(Math.random() * 30 + 60)}%</div>
          <div>CPU: {Math.floor(Math.random() * 20 + 5)}%</div>
        </div>
      )}

      {/* Welcome Message - Only show if no auto-trigger and first terminal */}
      {terminals.length === 1 && !autoTrigger && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`fixed bg-blue-600/90 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-sm ${
            isMobileView ? 'top-2 left-2' : 'top-4 left-4'
          }`}
        >
          <div className="font-semibold mb-2">🖥️ Welcome to koHLabs Terminal OS</div>
          <div className="text-sm opacity-90">
            {isMobileView ? (
              <>• Touch terminal to interact<br />• Type 'help' for commands</>
            ) : (
              <>• Drag terminals to move them<br />• Click "New Terminal" for more<br />• Use "Arrange" to organize</>
            )}
          </div>
        </motion.div>
      )}

      {/* Auto-Terminal Popup Message */}
      {autoTrigger && terminals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg p-8 text-center border border-green-400/30">
            <div className="text-green-400 text-2xl font-bold mb-4 animate-pulse">
              🖥️ ENGAGING TERMINAL MODE
            </div>
            <div className="text-gray-300 mb-4">
              Initializing koHLabs Research Terminal...
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* No terminals state - show engagement prompt */}
      {terminals.length === 0 && !autoTrigger && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 flex items-center justify-center z-10"
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🖥️
            </motion.div>
            <div className={`font-bold mb-4 ${
              isMobileView ? 'text-xl' : 'text-2xl'
            }`} style={{ color: theme.css['--theme-primary'] || '#00ff41' }}>
              koHLabs Research Terminal
            </div>
            <div className="text-gray-400 mb-6 max-w-md">
              {isMobileView 
                ? 'Tap anywhere to begin your research journey'
                : 'Click anywhere or wait for auto-engagement to begin your research journey'
              }
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => createNewTerminal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium"
            >
              Launch Terminal
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default EnhancedTerminalManager