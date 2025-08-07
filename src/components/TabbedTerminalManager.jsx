import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OSTerminal from './OSTerminal'
import { useView } from '../contexts/ViewContext'
import { useTheme } from '../contexts/ThemeContext'

const TabbedTerminalManager = ({ automationTrigger = false, onKoHLabsOpen }) => {
  const { isMobileView } = useView()
  const { theme, listThemes, changeTheme } = useTheme()
  const [terminals, setTerminals] = useState([
    // Start with one terminal always open
    { id: 1, position: { x: 0, y: 0 }, zIndex: 1, autoStartAI: false, title: 'Terminal' }
  ])
  const [activeTerminalId, setActiveTerminalId] = useState(1)
  const [nextId, setNextId] = useState(2)
  const automationTerminalRef = useRef(null)

  // Handle automation trigger - create separate automation terminal
  useEffect(() => {
    if (automationTrigger && !automationTerminalRef.current) {
      const automationTerminal = {
        id: nextId,
        position: { x: isMobileView ? 0 : 50, y: isMobileView ? 0 : 50 },
        zIndex: nextId,
        autoStartAI: true,
        title: 'AI Assistant'
      }
      
      setTerminals(prev => [...prev, automationTerminal])
      setActiveTerminalId(nextId)
      setNextId(prev => prev + 1)
      automationTerminalRef.current = nextId
    }
  }, [automationTrigger, nextId, isMobileView])

  const createNewTerminal = useCallback((startAI = false, title = 'Terminal') => {
    const maxTerminals = isMobileView ? 3 : 5 // Mobile: 3 tabs, Desktop: 5 tabs
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
      autoStartAI: startAI,
      title: title
    }
    
    setTerminals(prev => [...prev, newTerminal])
    setActiveTerminalId(nextId)
    setNextId(prev => prev + 1)
  }, [terminals.length, nextId, isMobileView])

  const closeTerminal = useCallback((id) => {
    // Don't close if it's the last terminal
    if (terminals.length <= 1) return
    
    setTerminals(prev => {
      const updated = prev.filter(t => t.id !== id)
      if (id === activeTerminalId && updated.length > 0) {
        setActiveTerminalId(updated[0].id)
      }
      return updated
    })

    // Clear automation ref if closing automation terminal
    if (automationTerminalRef.current === id) {
      automationTerminalRef.current = null
    }
  }, [activeTerminalId, terminals.length])

  const activeTerminal = terminals.find(t => t.id === activeTerminalId)

  return (
    <div className="h-full flex flex-col">
      {/* Mobile: App-Worthy Bottom Tab Layout */}
      {isMobileView ? (
        <>
          {/* Mobile Terminal Content - Full Screen */}
          <div className="flex-1 relative bg-black">
            <AnimatePresence mode="wait">
              {activeTerminal && (
                <motion.div
                  key={activeTerminal.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0"
                >
                  <OSTerminal
                    id={activeTerminal.id}
                    position={{ x: 0, y: 0 }}
                    zIndex={1000}
                    isFocused={true}
                    onFocus={() => {}}
                    onClose={closeTerminal}
                    autoStartAI={activeTerminal.autoStartAI}
                    isMobileTabbed={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile Glass Status Bar - Top */}
            <div className="absolute top-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between z-10 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-green-500/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                  <span className="text-green-300 text-xs font-medium">ONLINE</span>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-white/80 text-xs font-medium">
                    {activeTerminal?.autoStartAI ? '🤖 AI' : '💻 Terminal'} {activeTerminal?.id}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-white/70 text-xs font-medium">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                {terminals.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => closeTerminal(activeTerminal.id)}
                    className="w-7 h-7 bg-red-500/20 hover:bg-red-500/30 rounded-full backdrop-blur-sm flex items-center justify-center text-red-300 hover:text-red-200 transition-all duration-200 shadow-lg"
                  >
                    ×
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Glass Bottom Tab Bar */}
          <div className="bg-black/20 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
            {/* Terminal Tabs Row */}
            <div className="flex items-center px-3 py-2 border-b border-white/5">
              <div className="flex-1 flex items-center gap-2 overflow-x-auto">
                {terminals.map((terminal) => (
                  <motion.button
                    key={terminal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTerminalId(terminal.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                      activeTerminalId === terminal.id
                        ? 'bg-blue-500/30 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30 backdrop-blur-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90 backdrop-blur-sm border border-white/10'
                    }`}
                    style={{
                      background: activeTerminalId === terminal.id 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2))'
                        : 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <span className="text-sm drop-shadow-sm">
                      {terminal.autoStartAI ? '🤖' : '💻'}
                    </span>
                    <span className="text-xs font-medium">
                      {terminal.id}
                    </span>
                  </motion.button>
                ))}
                
                {/* Add Terminal Button */}
                {terminals.length < 4 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => createNewTerminal()}
                    className="flex-shrink-0 w-10 h-10 bg-white/10 hover:bg-white/15 rounded-2xl flex items-center justify-center text-white/60 hover:text-white/80 text-lg transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg"
                  >
                    +
                  </motion.button>
                )}
              </div>
            </div>

            {/* Glass 3D Action Bar */}
            <div className="flex items-center justify-around py-4 px-6">
              {/* Terminal Action */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                onClick={() => createNewTerminal(false, 'Terminal')}
                className="flex flex-col items-center gap-2 min-w-0 group"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 shadow-xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.3), rgba(55, 65, 81, 0.4))',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="drop-shadow-lg filter">💻</span>
                </div>
                <span className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">Terminal</span>
              </motion.button>

              {/* AI Assistant Action */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                onClick={() => createNewTerminal(true, 'AI Assistant')}
                className="flex flex-col items-center gap-2 min-w-0 group"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 shadow-xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(126, 34, 206, 0.4))',
                    borderColor: 'rgba(167, 77, 255, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(147, 51, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="drop-shadow-lg filter">🤖</span>
                </div>
                <span className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">AI</span>
              </motion.button>

              {/* koH Labs Portal */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                onClick={() => onKoHLabsOpen && onKoHLabsOpen()}
                className="flex flex-col items-center gap-2 min-w-0 group"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 shadow-xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.4))',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="drop-shadow-lg filter">🏛️</span>
                </div>
                <span className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">koH Labs</span>
              </motion.button>

              {/* Wallet Action */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="flex flex-col items-center gap-2 min-w-0 group"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 shadow-xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.4))',
                    borderColor: 'rgba(74, 222, 128, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="drop-shadow-lg filter">🔗</span>
                </div>
                <span className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">Wallet</span>
              </motion.button>

              {/* Theme Switcher (Mobile) */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                onClick={() => {
                  const themes = listThemes()
                  const currentIndex = themes.findIndex(t => t.active)
                  const nextTheme = themes[(currentIndex + 1) % themes.length]
                  if (nextTheme) {
                    changeTheme(nextTheme.key)
                  }
                }}
                className="flex flex-col items-center gap-2 min-w-0 group"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 shadow-xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(147, 51, 234, 0.4))',
                    borderColor: 'rgba(196, 113, 255, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="drop-shadow-lg filter">{theme.icon || '🎨'}</span>
                </div>
                <span className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">Theme</span>
              </motion.button>
            </div>

            {/* Safe Area for iPhone */}
            <div className="bg-gray-900" style={{ height: 'env(safe-area-inset-bottom)' }}></div>
          </div>
        </>
      ) : (
        /* Desktop: Traditional Window Layout */
        <div className="relative w-full h-full">
          {/* Desktop Environment Background */}
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

          {/* Desktop Terminals */}
          <AnimatePresence>
            {terminals.map((terminal) => (
              <OSTerminal
                key={terminal.id}
                id={terminal.id}
                position={terminal.position}
                zIndex={terminal.id === activeTerminalId ? 1000 : terminal.zIndex}
                isFocused={terminal.id === activeTerminalId}
                onFocus={setActiveTerminalId}
                onClose={closeTerminal}
                autoStartAI={terminal.autoStartAI}
              />
            ))}
          </AnimatePresence>

          {/* Desktop Taskbar */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-20 bg-gray-900/90 backdrop-blur-lg border-t border-gray-700"
          >
            <div className="flex items-center justify-between p-3">
              {/* Left - System Info */}
              <div className="flex items-center gap-4">
                <div className="text-blue-400 font-semibold text-sm">koHLabs OS</div>
                <div className="text-gray-400 text-xs">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Center - Terminal Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createNewTerminal(false, 'Terminal')}
                  disabled={terminals.length >= 5}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-md transition-colors font-medium"
                >
                  + Terminal
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createNewTerminal(true, 'AI Assistant')}
                  disabled={terminals.length >= 5}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-md transition-colors font-medium"
                >
                  + AI Assistant
                </motion.button>
              </div>

              {/* Right - Active Terminals */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Active:</span>
                {terminals.map((terminal) => (
                  <motion.button
                    key={terminal.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveTerminalId(terminal.id)}
                    className={`w-8 h-8 rounded-md text-xs font-semibold transition-all ${
                      activeTerminalId === terminal.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {terminal.autoStartAI ? '🤖' : terminal.id}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Glass System Status HUD */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className={`fixed backdrop-blur-2xl rounded-2xl p-4 text-xs font-medium space-y-2 border shadow-2xl ${
          isMobileView 
            ? 'top-2 left-2' 
            : 'top-4 right-28'
        }`} 
        style={{ 
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.2))',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          color: theme.css['--theme-primary'] || '#10b981',
          boxShadow: '0 20px 60px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
          <span className="text-green-300 font-semibold tracking-wide">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">Terminals:</span>
          <span className="text-white font-semibold">{terminals.length}/{isMobileView ? 4 : 5}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">Memory:</span>
          <span className="text-white font-semibold">{Math.floor(Math.random() * 30 + 60)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">CPU:</span>
          <span className="text-white font-semibold">{Math.floor(Math.random() * 20 + 5)}%</span>
        </div>
      </motion.div>
    </div>
  )
}

export default TabbedTerminalManager