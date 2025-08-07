import { useState, useEffect, useRef } from 'react'

function TerminalWidget() {
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  // Initial loading sequence
  useEffect(() => {
    // Loading phase
    setTimeout(() => {
      setIsLoading(false)
      setShowWelcome(true)
    }, 2000)

    // Welcome phase
    setTimeout(() => {
      setShowWelcome(false)
      setIsMinimized(true)
      // Start adding terminal content
      initializeTerminal()
    }, 4000)
  }, [])

  const initializeTerminal = () => {
    const initialLines = [
      { type: 'system', text: 'KoHLabs Terminal Agent v1.0.0' },
      { type: 'system', text: 'Connecting to Solana Network...' },
      { type: 'success', text: '[✓] Connected to mainnet-beta' },
      { type: 'prompt', text: 'koh@kohlabs:~$', command: '' }
    ]
    
    // Animate lines appearing
    initialLines.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line])
      }, index * 500)
    })
  }

  const executeCommand = (cmd) => {
    const commands = {
      'help': () => [
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  status  - Check system status' },
        { type: 'output', text: '  vibe    - Check vibe levels' },
        { type: 'output', text: '  build   - Start building' },
        { type: 'output', text: '  clear   - Clear terminal' }
      ],
      'status': () => [
        { type: 'success', text: '[✓] Solana Network: Connected' },
        { type: 'success', text: '[✓] Token Contract: Deployed' },
        { type: 'success', text: '[✓] Vibe Check: Hardcore mode' },
        { type: 'success', text: '[✓] koH Status: Building anyway' }
      ],
      'vibe': () => [
        { type: 'output', text: '🎯 Vibe Level: MAXIMUM' },
        { type: 'output', text: '🚀 Degen Energy: Converting to Regen' },
        { type: 'output', text: '💚 Community: Growing' }
      ],
      'build': () => [
        { type: 'system', text: 'Initiating build sequence...' },
        { type: 'output', text: 'npm run dev' },
        { type: 'success', text: 'Server running on port 3000' },
        { type: 'output', text: "koH don't know, but koH builds anyway!" }
      ],
      'clear': () => {
        setTerminalLines([
          { type: 'system', text: 'Terminal cleared.' },
          { type: 'prompt', text: 'koh@kohlabs:~$', command: '' }
        ])
        return []
      }
    }

    const result = commands[cmd.toLowerCase()]
    if (result) {
      return result()
    } else if (cmd.trim() === '') {
      return []
    } else {
      return [{ type: 'error', text: `Command not found: ${cmd}` }]
    }
  }

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = currentCommand.trim()
      
      // Add command to history
      setTerminalLines(prev => [
        ...prev.slice(0, -1), // Remove current prompt
        { type: 'prompt', text: 'koh@kohlabs:~$', command: cmd },
        ...executeCommand(cmd),
        { type: 'prompt', text: 'koh@kohlabs:~$', command: '' }
      ])
      
      setCurrentCommand('')
      
      // Scroll to bottom
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, 0)
    }
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 text-4xl font-mono mb-8 animate-pulse">
            Loading Terminal Agent...
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Welcome Animation
  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center animate-zoom-out">
        <div className="text-center">
          <div className="text-green-400 text-6xl font-mono mb-4 animate-pulse">
            WELCOME
          </div>
          <div className="text-blue-400 text-2xl font-mono">
            koH builds anyway
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Fullscreen Backdrop */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[9998] backdrop-blur-sm animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      {/* Terminal Widget */}
      <div
        className={`fixed z-[9999] transition-all duration-500 ease-in-out ${
          isFullscreen 
            ? 'inset-8 md:inset-16' 
            : isMinimized 
              ? 'bottom-6 right-6 w-96 h-64'
              : 'inset-0'
        }`}
      >
        <div className={`h-full rounded-lg overflow-hidden shadow-2xl border border-green-400/30 bg-black/95 backdrop-blur-md ${
          isMinimized ? 'animate-slide-up' : ''
        }`}>
          {/* Terminal Header */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 h-10 flex items-center justify-between px-3 border-b border-green-400/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer" 
                   onClick={() => setIsMinimized(false)}
                   title="Close"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
                   onClick={() => setIsMinimized(!isMinimized)}
                   title="Minimize"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer"
                   onClick={() => setIsFullscreen(!isFullscreen)}
                   title="Fullscreen"></div>
            </div>
            
            <div className="text-green-400 text-xs font-mono">
              Terminal Agent v1.0
            </div>

            {/* Media Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-green-400 hover:text-green-300 transition-colors"
                title="Fullscreen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 19V15M9 15H5M9 15L4 20M15 5V9M15 9H19M15 9L20 4M5 9H9M9 9V5M9 9L4 4M19 15H15M15 15V19M15 15L20 20" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  )}
                </svg>
              </button>
              
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-green-400 hover:text-green-300 transition-colors"
                title="Minimize"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <button 
                className="text-green-400 hover:text-green-300 transition-colors"
                title="Settings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div 
            ref={terminalRef}
            className="h-[calc(100%-2.5rem)] overflow-y-auto p-3 font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            {terminalLines.map((line, index) => (
              <div key={index} className={`mb-1 ${
                line.type === 'error' ? 'text-red-400' :
                line.type === 'success' ? 'text-green-400' :
                line.type === 'system' ? 'text-blue-400' :
                line.type === 'output' ? 'text-gray-300' :
                'text-green-400'
              }`}>
                {line.type === 'prompt' ? (
                  <div className="flex items-center">
                    <span className="text-green-400 font-bold">{line.text}</span>
                    <span className="ml-2 text-white">{line.command}</span>
                    {index === terminalLines.length - 1 && (
                      <>
                        <input
                          ref={inputRef}
                          type="text"
                          value={currentCommand}
                          onChange={(e) => setCurrentCommand(e.target.value)}
                          onKeyDown={handleCommand}
                          className="flex-1 bg-transparent outline-none text-white ml-2"
                          autoFocus
                        />
                        <span className="animate-pulse">_</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div>{line.text}</div>
                )}
              </div>
            ))}
          </div>

          {/* Status Bar */}
          {isMinimized && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-900/90 border-t border-green-400/20 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
              <span className="text-xs text-gray-500">Type 'help' for commands</span>
            </div>
          )}
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes zoom-out {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.3);
            opacity: 0;
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-zoom-out {
          animation: zoom-out 1s ease-in-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}

export default TerminalWidget