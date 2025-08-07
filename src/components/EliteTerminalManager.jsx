import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OSTerminal from './OSTerminal'
import { useView } from '../contexts/ViewContext'
import { useTheme } from '../contexts/ThemeContext'

const EliteTerminalManager = ({ automationTrigger = false }) => {
  const { isMobileView } = useView()
  const { theme, listThemes, changeTheme } = useTheme()
  
  // Unified terminal state - persists across view switches
  const [terminals, setTerminals] = useState([
    { 
      id: 1, 
      position: { x: 100, y: 100 }, 
      zIndex: 1, 
      autoStartAI: false, 
      title: 'Terminal',
      content: [], // Persist terminal content
      mobilePane: { row: 0, col: 0, width: 1, height: 1 } // tmux-like pane position
    }
  ])
  const [activeTerminalId, setActiveTerminalId] = useState(1)
  const [nextId, setNextId] = useState(2)
  const [mobilePaneLayout, setMobilePaneLayout] = useState({ rows: 1, cols: 1 })
  const [isResizing, setIsResizing] = useState(false)
  const automationTerminalRef = useRef(null)

  // Handle automation trigger
  useEffect(() => {
    if (automationTrigger && !automationTerminalRef.current) {
      const automationTerminal = {
        id: nextId,
        position: { x: isMobileView ? 0 : 150, y: isMobileView ? 0 : 150 },
        zIndex: nextId,
        autoStartAI: true,
        title: 'AI Assistant',
        content: [],
        mobilePane: { row: 0, col: 1, width: 1, height: 1 }
      }
      
      setTerminals(prev => [...prev, automationTerminal])
      
      // Auto-adjust mobile layout for new terminal
      if (isMobileView && terminals.length === 1) {
        setMobilePaneLayout({ rows: 1, cols: 2 })
      }
      
      setActiveTerminalId(nextId)
      setNextId(prev => prev + 1)
      automationTerminalRef.current = nextId
    }
  }, [automationTrigger, nextId, isMobileView, terminals.length])

  const createNewTerminal = useCallback((startAI = false, title = 'Terminal', splitDirection = null) => {
    const maxTerminals = isMobileView ? 6 : 8
    if (terminals.length >= maxTerminals) return
    
    let mobilePane = { row: 0, col: 0, width: 1, height: 1 }
    
    // Auto-arrange mobile panes
    if (isMobileView && splitDirection) {
      const currentLayout = mobilePaneLayout
      if (splitDirection === 'vertical') {
        mobilePane = { 
          row: currentLayout.rows, 
          col: 0, 
          width: currentLayout.cols, 
          height: 1 
        }
        setMobilePaneLayout(prev => ({ ...prev, rows: prev.rows + 1 }))
      } else if (splitDirection === 'horizontal') {
        mobilePane = { 
          row: 0, 
          col: currentLayout.cols, 
          width: 1, 
          height: currentLayout.rows 
        }
        setMobilePaneLayout(prev => ({ ...prev, cols: prev.cols + 1 }))
      }
    }
    
    const newTerminal = {
      id: nextId,
      position: isMobileView 
        ? { x: 0, y: 0 }
        : { 
            x: 100 + (terminals.length * 60), 
            y: 100 + (terminals.length * 60) 
          },
      zIndex: nextId,
      autoStartAI: startAI,
      title: title,
      content: [],
      mobilePane: mobilePane
    }
    
    setTerminals(prev => [...prev, newTerminal])
    setActiveTerminalId(nextId)
    setNextId(prev => prev + 1)
  }, [terminals.length, nextId, isMobileView, mobilePaneLayout])

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
          ? { ...t, zIndex: 1000 }
          : { ...t, zIndex: t.zIndex < 1000 ? t.zIndex : t.zIndex - 1 }
      )
    )
  }, [])

  // Mobile Pane Grid Component
  const MobilePaneGrid = () => {
    const gridStyle = {
      display: 'grid',
      gridTemplateRows: `repeat(${mobilePaneLayout.rows}, 1fr)`,
      gridTemplateColumns: `repeat(${mobilePaneLayout.cols}, 1fr)`,
      gap: '2px',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)'
    }

    return (
      <div style={gridStyle} className="elite-terminal-grid">
        {terminals.map((terminal) => (
          <motion.div
            key={terminal.id}
            className="elite-terminal-pane relative overflow-hidden"
            style={{
              gridRow: `${terminal.mobilePane.row + 1} / span ${terminal.mobilePane.height}`,
              gridColumn: `${terminal.mobilePane.col + 1} / span ${terminal.mobilePane.width}`,
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            {/* Elite Pane Border */}
            <div className="absolute inset-0 elite-pane-border">
              <div className="absolute inset-0 rounded-lg border-2 border-cyan-400/30 bg-gradient-to-br from-slate-900/95 to-black/95 backdrop-blur-xl shadow-2xl">
                {/* Holographic corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/60 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400/60 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400/60 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400/60 rounded-br-lg"></div>
                
                {/* Active pane indicator */}
                {terminal.id === activeTerminalId && (
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05))',
                      boxShadow: 'inset 0 0 20px rgba(6, 182, 212, 0.2), 0 0 40px rgba(6, 182, 212, 0.1)'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Terminal Header */}
            <div className="relative z-10 flex items-center justify-between p-2 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400/80"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
                </div>
                <span className="text-xs font-medium text-cyan-300">
                  {terminal.autoStartAI ? '🤖' : '💻'} {terminal.title}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => focusTerminal(terminal.id)}
                  className={`w-5 h-5 rounded text-xs flex items-center justify-center transition-all ${
                    terminal.id === activeTerminalId
                      ? 'bg-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                  }`}
                >
                  {terminal.id}
                </button>
                {terminals.length > 1 && (
                  <button
                    onClick={() => closeTerminal(terminal.id)}
                    className="w-5 h-5 rounded text-xs flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Terminal Content */}
            <div className="relative z-10 h-[calc(100%-40px)]">
              <OSTerminal
                id={terminal.id}
                position={{ x: 0, y: 0 }}
                zIndex={1000}
                isFocused={terminal.id === activeTerminalId}
                onFocus={() => focusTerminal(terminal.id)}
                onClose={closeTerminal}
                autoStartAI={terminal.autoStartAI}
                isMobileTabbed={true}
                isEliteMode={true}
              />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col elite-terminal-container">
      {/* Mobile: Elite Multi-pane Layout */}
      {isMobileView ? (
        <>
          {/* Mobile Control Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border-b border-cyan-400/20 p-3"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(6, 182, 212, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                  <span className="text-green-300 text-sm font-semibold">ELITE MODE</span>
                </div>
                <div className="text-cyan-400 text-sm">
                  {terminals.length} panes • {mobilePaneLayout.rows}×{mobilePaneLayout.cols}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Split Controls */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createNewTerminal(false, 'Terminal', 'horizontal')}
                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-300 text-sm font-medium transition-all border border-cyan-500/30"
                >
                  ╫
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createNewTerminal(false, 'Terminal', 'vertical')}
                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-300 text-sm font-medium transition-all border border-cyan-500/30"
                >
                  ═
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createNewTerminal(true, 'AI Assistant')}
                  className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 text-sm font-medium transition-all border border-purple-500/30"
                >
                  🤖
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Elite Pane Grid */}
          <div className="flex-1 relative">
            <MobilePaneGrid />
          </div>
        </>
      ) : (
        /* Desktop: Enhanced Window Management */
        <div className="relative w-full h-full elite-desktop-environment">
          {/* Elite Desktop Background */}
          <div className="absolute inset-0">
            {/* Animated circuit board pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <pattern id="circuit" patternUnits="userSpaceOnUse" width="20" height="20">
                    <path d="M 0,20 L 0,0 L 20,0" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5"/>
                    <circle cx="0" cy="0" r="1" fill="rgba(6, 182, 212, 0.4)"/>
                    <circle cx="20" cy="0" r="1" fill="rgba(6, 182, 212, 0.4)"/>
                    <circle cx="0" cy="20" r="1" fill="rgba(6, 182, 212, 0.4)"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit)"/>
              </svg>
            </div>
            
            {/* Holographic overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"
              style={{
                background: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
              }}
            />
          </div>

          {/* Elite Terminal Windows */}
          <AnimatePresence>
            {terminals.map((terminal) => (
              <motion.div
                key={terminal.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute elite-terminal-window"
                style={{
                  left: terminal.position.x,
                  top: terminal.position.y,
                  zIndex: terminal.id === activeTerminalId ? 1000 : terminal.zIndex,
                }}
              >
                <OSTerminal
                  id={terminal.id}
                  position={terminal.position}
                  zIndex={terminal.zIndex}
                  isFocused={terminal.id === activeTerminalId}
                  onFocus={focusTerminal}
                  onClose={closeTerminal}
                  autoStartAI={terminal.autoStartAI}
                  isEliteMode={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Elite Desktop Taskbar */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-24 backdrop-blur-2xl border-t shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
              borderColor: 'rgba(6, 182, 212, 0.2)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(6, 182, 212, 0.1)'
            }}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="text-cyan-400 font-bold text-lg">koHLabs</div>
                <div className="text-slate-400 text-sm">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createNewTerminal(false, 'Terminal')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-xl text-cyan-300 font-medium transition-all border border-cyan-500/30 shadow-lg"
                >
                  + Terminal
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createNewTerminal(true, 'AI Assistant')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl text-purple-300 font-medium transition-all border border-purple-500/30 shadow-lg"
                >
                  + AI Assistant
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Active:</span>
                {terminals.map((terminal) => (
                  <motion.button
                    key={terminal.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => focusTerminal(terminal.id)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      activeTerminalId === terminal.id
                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/50'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 border border-slate-600/50'
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

      {/* Elite CSS Styles */}
      <style jsx>{`
        .elite-terminal-container {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }

        .elite-terminal-grid {
          animation: subtle-glow 4s ease-in-out infinite alternate;
        }

        .elite-pane-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, 
            transparent, 
            rgba(6, 182, 212, 0.1), 
            transparent, 
            rgba(147, 51, 234, 0.1), 
            transparent
          );
          border-radius: 12px;
          animation: border-flow 8s linear infinite;
          z-index: -1;
        }

        .elite-desktop-environment {
          background: 
            radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.03) 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }

        @keyframes subtle-glow {
          0% { filter: drop-shadow(0 0 5px rgba(6, 182, 212, 0.1)); }
          100% { filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.2)); }
        }

        @keyframes border-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Holographic scan lines */
        .elite-terminal-pane::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent);
          animation: scan-line 3s linear infinite;
        }

        @keyframes scan-line {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Elite scrollbar */
        .elite-terminal-pane ::-webkit-scrollbar {
          width: 6px;
        }

        .elite-terminal-pane ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }

        .elite-terminal-pane ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(6, 182, 212, 0.5), rgba(8, 145, 178, 0.3));
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}

export default EliteTerminalManager