import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OSTerminal from './OSTerminal'
import { useView } from '../contexts/ViewContext'
import { useTheme } from '../contexts/ThemeContext'

const CompactTerminalManager = ({ automationTrigger = false, onKoHLabsOpen }) => {
  const { isMobileView } = useView()
  const { theme } = useTheme()
  
  // Persistent terminal state - survives view switches
  const [terminals, setTerminals] = useState(() => {
    // Initialize with one terminal
    return [{ 
      id: 1, 
      position: { x: 20, y: 20 }, 
      zIndex: 1, 
      autoStartAI: false, 
      title: 'Terminal',
      content: [],
      isMinimized: false
    }]
  })
  
  const [activeTerminalId, setActiveTerminalId] = useState(1)
  const [nextId, setNextId] = useState(2)
  const automationTerminalRef = useRef(null)

  // Handle automation trigger
  useEffect(() => {
    if (automationTrigger && !automationTerminalRef.current) {
      const automationTerminal = {
        id: nextId,
        position: { x: 40, y: 40 },
        zIndex: nextId,
        autoStartAI: true,
        title: 'AI Assistant',
        content: [],
        isMinimized: false
      }
      
      setTerminals(prev => [...prev, automationTerminal])
      setActiveTerminalId(nextId)
      setNextId(prev => prev + 1)
      automationTerminalRef.current = nextId
    }
  }, [automationTrigger, nextId])

  const createNewTerminal = useCallback((startAI = false, title = 'Terminal') => {
    const maxTerminals = 8
    if (terminals.length >= maxTerminals) return
    
    const newTerminal = {
      id: nextId,
      position: { 
        x: 20 + (terminals.length * 30), 
        y: 20 + (terminals.length * 30) 
      },
      zIndex: nextId,
      autoStartAI: startAI,
      title: title,
      content: [],
      isMinimized: false
    }
    
    setTerminals(prev => [...prev, newTerminal])
    setActiveTerminalId(nextId)
    setNextId(prev => prev + 1)
  }, [terminals.length, nextId])

  const closeTerminal = useCallback((id) => {
    if (terminals.length <= 1) return
    
    setTerminals(prev => {
      const updated = prev.filter(t => t.id !== id)
      if (id === activeTerminalId && updated.length > 0) {
        setActiveTerminalId(updated[0].id)
      }
      return updated
    })

    if (automationTerminalRef.current === id) {
      automationTerminalRef.current = null
    }
  }, [activeTerminalId, terminals.length])

  const focusTerminal = useCallback((id) => {
    setActiveTerminalId(id)
    setTerminals(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, zIndex: 1000, isMinimized: false }
          : { ...t, zIndex: t.zIndex < 1000 ? t.zIndex : t.zIndex - 1 }
      )
    )
  }, [])

  const minimizeTerminal = useCallback((id) => {
    setTerminals(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, isMinimized: !t.isMinimized }
          : t
      )
    )
  }, [])

  const updateTerminalPosition = useCallback((id, newPosition) => {
    setTerminals(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, position: newPosition }
          : t
      )
    )
  }, [])

  // Compact Terminal Window Container
  const CompactTerminalWindow = ({ terminal }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [position, setPosition] = useState(terminal.position)

    const handleMouseDown = (e) => {
      if (e.target.closest('.terminal-content')) return
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
      focusTerminal(terminal.id)
    }

    useEffect(() => {
      const handleMouseMove = (e) => {
        if (!isDragging) return
        const newPosition = {
          x: Math.max(0, Math.min(window.innerWidth - 600, e.clientX - dragStart.x)),
          y: Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragStart.y))
        }
        setPosition(newPosition)
      }

      const handleMouseUp = () => {
        if (isDragging) {
          updateTerminalPosition(terminal.id, position)
          setIsDragging(false)
        }
      }

      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }, [isDragging, dragStart, position, terminal.id])

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: terminal.isMinimized ? 0.95 : 1, 
          opacity: 1,
          y: terminal.isMinimized ? 10 : 0
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="absolute select-none"
        style={{
          left: isMobileView ? '10px' : position.x,
          top: isMobileView ? '10px' : position.y,
          zIndex: terminal.id === activeTerminalId ? 1000 : terminal.zIndex,
          width: isMobileView ? 'calc(100vw - 20px)' : '600px',
          height: terminal.isMinimized ? '40px' : (isMobileView ? 'calc(100vh - 120px)' : '400px')
        }}
      >
        {/* Terminal Window Frame */}
        <div 
          className="w-full h-full rounded-lg overflow-hidden shadow-2xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
            borderColor: terminal.id === activeTerminalId ? 'rgba(6, 182, 212, 0.5)' : 'rgba(75, 85, 99, 0.3)',
            boxShadow: terminal.id === activeTerminalId 
              ? '0 20px 80px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.2)'
              : '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Title Bar */}
          <div 
            className="flex items-center justify-between px-4 py-2 cursor-move border-b"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
              borderColor: 'rgba(75, 85, 99, 0.3)'
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-3">
              {/* Traffic Light Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => closeTerminal(terminal.id)}
                  className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-300 transition-colors"
                  title="Close"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => minimizeTerminal(terminal.id)}
                  className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors"
                  title="Minimize"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-300 transition-colors"
                  title="Maximize"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {terminal.autoStartAI ? '🤖' : '💻'}
                </span>
                <span className="text-sm font-medium text-gray-300">
                  {terminal.title} #{terminal.id}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {terminal.id === activeTerminalId && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
              <span className="text-xs text-gray-500">
                {isMobileView ? 'Mobile' : 'Desktop'}
              </span>
            </div>
          </div>

          {/* Terminal Content */}
          {!terminal.isMinimized && (
            <div className="terminal-content h-[calc(100%-40px)]">
              <OSTerminal
                id={terminal.id}
                position={position}
                zIndex={terminal.zIndex}
                isFocused={terminal.id === activeTerminalId}
                onFocus={() => focusTerminal(terminal.id)}
                onClose={closeTerminal}
                autoStartAI={terminal.autoStartAI}
                isCompactMode={true}
              />
            </div>
          )}
        </div>

        {/* Resize Handle */}
        {!terminal.isMinimized && !isMobileView && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
            <div className="absolute bottom-1 right-1 w-0 h-0 border-l-[6px] border-l-transparent border-b-[6px] border-b-gray-500"></div>
          </div>
        )}
      </motion.div>
    )
  }

  // Desktop Taskbar
  const DesktopTaskbar = () => (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-12 backdrop-blur-2xl border-t z-40"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        borderColor: 'rgba(6, 182, 212, 0.3)'
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white text-sm"
          >
            koH
          </motion.div>
          <div className="text-cyan-300 text-sm font-medium">koH Labs Terminal OS</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Terminal Buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => createNewTerminal(false, 'Terminal')}
            className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm transition-all border border-blue-500/30"
          >
            + Terminal
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => createNewTerminal(true, 'AI Assistant')}
            className="px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm transition-all border border-purple-500/30"
          >
            + AI
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onKoHLabsOpen}
            className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-sm transition-all border border-cyan-500/30"
          >
            🏛️ koH Labs
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {/* Running Terminals */}
          {terminals.map((terminal) => (
            <motion.button
              key={terminal.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => focusTerminal(terminal.id)}
              className={`w-8 h-8 rounded transition-all text-xs font-bold flex items-center justify-center ${
                activeTerminalId === terminal.id
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
              }`}
            >
              {terminal.autoStartAI ? '🤖' : terminal.id}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )

  // Mobile Header
  const MobileHeader = () => (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 h-14 backdrop-blur-2xl border-b z-40"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        borderColor: 'rgba(6, 182, 212, 0.3)'
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
            koH
          </div>
          <div className="text-cyan-300 text-sm font-medium">Terminal OS</div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onKoHLabsOpen}
            className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30"
          >
            🏛️
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => createNewTerminal()}
            className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30"
          >
            +
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Mobile Header */}
      {isMobileView && <MobileHeader />}

      {/* Terminal Windows */}
      <div 
        className="absolute inset-0"
        style={{
          top: isMobileView ? '56px' : '0',
          bottom: isMobileView ? '0' : '48px'
        }}
      >
        <AnimatePresence>
          {terminals.map((terminal) => (
            <CompactTerminalWindow
              key={terminal.id}
              terminal={terminal}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Taskbar */}
      {!isMobileView && <DesktopTaskbar />}
    </div>
  )
}

export default CompactTerminalManager