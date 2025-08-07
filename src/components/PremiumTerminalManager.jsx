import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import OSTerminal from './OSTerminal'
import { useView } from '../contexts/ViewContext'
import { useTheme } from '../contexts/ThemeContext'

const PremiumTerminalManager = ({ automationTrigger = false, onKoHLabsOpen }) => {
  const { isMobileView } = useView()
  const { theme } = useTheme()
  
  // Motion values for parallax and 3D effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Parallax transforms
  const backgroundX = useTransform(mouseX, [-100, 100], [-10, 10])
  const backgroundY = useTransform(mouseY, [-100, 100], [-10, 10])
  
  // Terminal state with enhanced properties
  const [terminals, setTerminals] = useState(() => {
    return [{ 
      id: 1, 
      position: { x: 100, y: 100 }, 
      size: { width: 680, height: 420 },
      zIndex: 1, 
      autoStartAI: false, 
      title: 'Terminal',
      content: [],
      isMinimized: false,
      isMaximized: false,
      depth: 0,
      glow: false
    }]
  })
  
  const [activeTerminalId, setActiveTerminalId] = useState(1)
  const [nextId, setNextId] = useState(2)
  const [showAmbientLight, setShowAmbientLight] = useState(true)
  const [snapZones, setSnapZones] = useState([])
  const containerRef = useRef(null)

  // Track mouse for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        mouseX.set((e.clientX - rect.left - centerX) / 5)
        mouseY.set((e.clientY - rect.top - centerY) / 5)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Calculate snap zones
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setSnapZones([
        { id: 'left', x: 0, y: 0, width: rect.width / 2, height: rect.height },
        { id: 'right', x: rect.width / 2, y: 0, width: rect.width / 2, height: rect.height },
        { id: 'top', x: 0, y: 0, width: rect.width, height: rect.height / 2 },
        { id: 'bottom', x: 0, y: rect.height / 2, width: rect.width, height: rect.height / 2 },
      ])
    }
  }, [isMobileView])

  const createNewTerminal = useCallback((startAI = false, title = 'Terminal') => {
    const maxTerminals = 6
    if (terminals.length >= maxTerminals) return
    
    // Calculate cascade position
    const cascadeOffset = terminals.length * 30
    const newTerminal = {
      id: nextId,
      position: { 
        x: 100 + cascadeOffset, 
        y: 100 + cascadeOffset
      },
      size: { width: 680, height: 420 },
      zIndex: nextId,
      autoStartAI: startAI,
      title: title,
      content: [],
      isMinimized: false,
      isMaximized: false,
      depth: terminals.length,
      glow: startAI
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
  }, [activeTerminalId, terminals.length])

  const focusTerminal = useCallback((id) => {
    setActiveTerminalId(id)
    setTerminals(prev => {
      const maxZ = Math.max(...prev.map(t => t.zIndex))
      return prev.map(t => ({
        ...t,
        zIndex: t.id === id ? maxZ + 1 : t.zIndex,
        glow: t.id === id
      }))
    })
  }, [])

  const toggleMaximize = useCallback((id) => {
    setTerminals(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, isMaximized: !t.isMaximized }
          : t
      )
    )
  }, [])

  const updateTerminalPosition = useCallback((id, newPosition) => {
    // Check for snap zones
    let snappedPosition = { ...newPosition }
    
    snapZones.forEach(zone => {
      const inZone = 
        newPosition.x < zone.x + 50 &&
        newPosition.y < zone.y + 50
      
      if (inZone) {
        if (zone.id === 'left') {
          snappedPosition = { x: 20, y: newPosition.y }
        } else if (zone.id === 'right') {
          snappedPosition = { x: window.innerWidth - 700, y: newPosition.y }
        }
      }
    })
    
    setTerminals(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, position: snappedPosition }
          : t
      )
    )
  }, [snapZones])

  // Premium Terminal Window Component
  const PremiumTerminalWindow = ({ terminal }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [size, setSize] = useState(terminal.size)
    const [position, setPosition] = useState(terminal.position)
    
    const windowRef = useRef(null)

    const handleMouseDown = (e) => {
      if (e.target.closest('.terminal-content') || e.target.closest('.resize-handle')) return
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
      focusTerminal(terminal.id)
    }

    const handleResize = (e, direction) => {
      e.stopPropagation()
      setIsResizing(direction)
      focusTerminal(terminal.id)
    }

    useEffect(() => {
      const handleMouseMove = (e) => {
        if (isDragging) {
          const newPosition = {
            x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x)),
            y: Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y))
          }
          setPosition(newPosition)
        }
        
        if (isResizing) {
          const newSize = { ...size }
          if (isResizing.includes('right')) {
            newSize.width = Math.max(400, Math.min(1200, e.clientX - position.x))
          }
          if (isResizing.includes('bottom')) {
            newSize.height = Math.max(300, Math.min(800, e.clientY - position.y))
          }
          setSize(newSize)
        }
      }

      const handleMouseUp = () => {
        if (isDragging) {
          updateTerminalPosition(terminal.id, position)
          setIsDragging(false)
        }
        if (isResizing) {
          setIsResizing(false)
        }
      }

      if (isDragging || isResizing) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }, [isDragging, isResizing, dragStart, position, size, terminal.id])

    const isActive = terminal.id === activeTerminalId

    return (
      <motion.div
        ref={windowRef}
        initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
        animate={{ 
          scale: terminal.isMinimized ? 0.95 : (terminal.isMaximized ? 1.02 : 1),
          opacity: 1,
          rotateX: 0,
          y: terminal.isMinimized ? 20 : 0,
          x: terminal.isMaximized ? 0 : 0,
        }}
        exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        whileHover={{ scale: terminal.isMaximized ? 1.02 : 1.01 }}
        className="absolute"
        style={{
          left: terminal.isMaximized ? 20 : position.x,
          top: terminal.isMaximized ? 20 : position.y,
          width: terminal.isMaximized ? 'calc(100% - 40px)' : size.width,
          height: terminal.isMaximized ? 'calc(100% - 100px)' : (terminal.isMinimized ? 40 : size.height),
          zIndex: terminal.zIndex,
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
      >
        {/* 3D Shadow Layers */}
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            transform: 'translateZ(-20px)',
            background: 'rgba(0, 0, 0, 0.3)',
            filter: 'blur(20px)',
            opacity: isActive ? 0.6 : 0.3
          }}
        />
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            transform: 'translateZ(-40px)',
            background: 'rgba(0, 0, 0, 0.2)',
            filter: 'blur(40px)',
            opacity: isActive ? 0.4 : 0.2
          }}
        />

        {/* Main Window */}
        <motion.div 
          className="relative w-full h-full rounded-2xl overflow-hidden border backdrop-blur-2xl"
          style={{
            background: `linear-gradient(135deg, 
              rgba(15, 23, 42, ${isActive ? 0.95 : 0.9}), 
              rgba(30, 41, 59, ${isActive ? 0.9 : 0.85})
            )`,
            borderColor: isActive 
              ? 'rgba(6, 182, 212, 0.6)' 
              : 'rgba(75, 85, 99, 0.4)',
            boxShadow: isActive
              ? `
                0 0 0 1px rgba(6, 182, 212, 0.2),
                0 10px 40px rgba(6, 182, 212, 0.3),
                0 30px 90px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
              : `
                0 10px 40px rgba(0, 0, 0, 0.3),
                0 20px 60px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.05)
              `,
            transform: `rotateY(${isActive ? 0 : 1}deg) rotateX(${isActive ? 0 : 0.5}deg)`
          }}
        >
          {/* Glass Refraction Effect */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(
                circle at ${50 + terminal.depth * 5}% ${50 - terminal.depth * 5}%,
                rgba(6, 182, 212, 0.2) 0%,
                transparent 50%
              )`,
              mixBlendMode: 'screen'
            }}
          />

          {/* Premium Title Bar */}
          <div 
            className="relative flex items-center justify-between px-4 py-3 cursor-move border-b backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, 
                rgba(30, 41, 59, ${isActive ? 0.9 : 0.8}), 
                rgba(15, 23, 42, ${isActive ? 0.9 : 0.8})
              )`,
              borderColor: 'rgba(75, 85, 99, 0.3)'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* macOS Style Traffic Lights */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => closeTerminal(terminal.id)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-all shadow-sm"
                style={{
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTerminals(prev => 
                  prev.map(t => t.id === terminal.id ? { ...t, isMinimized: !t.isMinimized } : t)
                )}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-all shadow-sm"
                style={{
                  boxShadow: '0 0 4px rgba(245, 158, 11, 0.5)'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleMaximize(terminal.id)}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-all shadow-sm"
                style={{
                  boxShadow: '0 0 4px rgba(34, 197, 94, 0.5)'
                }}
              />
            </div>

            {/* Window Title */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: terminal.glow ? 360 : 0 }}
                transition={{ duration: 10, repeat: terminal.glow ? Infinity : 0, ease: "linear" }}
                className="text-lg"
              >
                {terminal.autoStartAI ? '🤖' : '💻'}
              </motion.div>
              <span className="text-sm font-medium text-gray-200 tracking-wide">
                {terminal.title} #{terminal.id}
              </span>
              {isActive && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full shadow-sm"
                  style={{
                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)'
                  }}
                />
              )}
            </div>

            {/* Window Actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {size.width}×{size.height}
              </span>
            </div>
          </div>

          {/* Terminal Content */}
          {!terminal.isMinimized && (
            <div className="terminal-content h-[calc(100%-48px)] relative">
              {/* Ambient Glow */}
              {terminal.glow && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(
                      circle at center,
                      rgba(6, 182, 212, 0.05) 0%,
                      transparent 70%
                    )`,
                    animation: 'pulse 4s ease-in-out infinite'
                  }}
                />
              )}
              
              <OSTerminal
                id={terminal.id}
                position={position}
                zIndex={terminal.zIndex}
                isFocused={isActive}
                onFocus={() => focusTerminal(terminal.id)}
                onClose={closeTerminal}
                autoStartAI={terminal.autoStartAI}
                isCompactMode={true}
              />
            </div>
          )}

          {/* Resize Handles */}
          {!terminal.isMinimized && !terminal.isMaximized && (
            <>
              <div 
                className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
                onMouseDown={(e) => handleResize(e, 'bottom-right')}
              >
                <div className="absolute bottom-1 right-1 w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-gray-400 group-hover:border-b-cyan-400 transition-colors" />
              </div>
              <div 
                className="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-s-resize"
                onMouseDown={(e) => handleResize(e, 'bottom')}
              />
              <div 
                className="resize-handle absolute top-0 bottom-0 right-0 w-2 cursor-e-resize"
                onMouseDown={(e) => handleResize(e, 'right')}
              />
            </>
          )}
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)'
      }}
    >
      {/* Animated Background with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{
          x: backgroundX,
          y: backgroundY
        }}
      >
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Orbs */}
        {showAmbientLight && (
          <>
            <motion.div
              animate={{ 
                x: [0, 100, -50, 0],
                y: [0, -50, 100, 0],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                x: [0, -80, 60, 0],
                y: [0, 80, -60, 0],
              }}
              transition={{ duration: 25, repeat: Infinity }}
              className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
            />
          </>
        )}
      </motion.div>

      {/* App Container with Premium Padding */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-8 backdrop-blur-xl border-b z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.7))',
            borderColor: 'rgba(6, 182, 212, 0.2)'
          }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg"
              style={{
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
              }}
            >
              koH
            </motion.div>
            <div className="text-cyan-300 font-medium">Terminal OS</div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => createNewTerminal(false, 'Terminal')}
              className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm font-medium transition-all border border-blue-500/30 backdrop-blur-sm"
            >
              + Terminal
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => createNewTerminal(true, 'AI Assistant')}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm font-medium transition-all border border-purple-500/30 backdrop-blur-sm"
            >
              + AI
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onKoHLabsOpen}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-white text-sm font-medium transition-all border border-cyan-500/30 backdrop-blur-sm"
            >
              🏛️ koH Labs
            </motion.button>
          </div>
        </motion.div>

        {/* Terminal Windows Area */}
        <div className="absolute inset-0 pt-20 pb-16">
          <AnimatePresence>
            {terminals.map((terminal) => (
              <PremiumTerminalWindow
                key={terminal.id}
                terminal={terminal}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Dock */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
          }}
        >
          {terminals.map((terminal) => (
            <motion.button
              key={terminal.id}
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => focusTerminal(terminal.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all ${
                activeTerminalId === terminal.id
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 shadow-lg'
                  : 'bg-gray-700/30 hover:bg-gray-600/30'
              }`}
              style={{
                boxShadow: activeTerminalId === terminal.id 
                  ? '0 4px 20px rgba(6, 182, 212, 0.4)' 
                  : 'none'
              }}
            >
              {terminal.autoStartAI ? '🤖' : '💻'}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

export default PremiumTerminalManager