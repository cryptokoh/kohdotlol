import { useState, useEffect, useRef } from 'react'

function KoHLabs() {
  const [matrixMode, setMatrixMode] = useState(false)
  const [showMatrixText, setShowMatrixText] = useState(false)
  const canvasRef = useRef(null)
  const matrixRainRef = useRef(null)
  const konamiRef = useRef([])
  
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  // Matrix Rain Effect
  const initMatrixRain = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/こんにちは世界"
    const matrixArray = matrix.split("")
    
    const fontSize = 16
    const columns = canvas.width / fontSize
    
    const drops = []
    for(let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100
    }
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff00'
      ctx.font = fontSize + 'px monospace'
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    return setInterval(draw, 35)
  }

  // Toggle Matrix Mode
  const toggleMatrix = () => {
    setMatrixMode(!matrixMode)
    
    if (!matrixMode) {
      // Entering Matrix mode
      matrixRainRef.current = initMatrixRain()
      
      // Show flash text
      setShowMatrixText(true)
      setTimeout(() => setShowMatrixText(false), 3000)
      
      console.log('%c SYSTEM: ACCESS GRANTED', 'color: #00ff00; font-size: 20px; font-weight: bold;')
      console.log('%c Welcome to the Matrix, koH', 'color: #00ff00; font-size: 16px;')
    } else {
      // Exiting Matrix mode
      if (matrixRainRef.current) {
        clearInterval(matrixRainRef.current)
        matrixRainRef.current = null
      }
      
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
      
      console.log('%c SYSTEM: RETURNING TO REALITY', 'color: #8ae234; font-size: 16px; font-weight: bold;')
    }
  }

  // Konami Code Detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      konamiRef.current.push(e.key)
      if (konamiRef.current.length > konamiCode.length) {
        konamiRef.current.shift()
      }
      
      if (konamiRef.current.join(',') === konamiCode.join(',')) {
        activateUltraMatrix()
        konamiRef.current = []
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const activateUltraMatrix = () => {
    if (!matrixMode) {
      toggleMatrix()
    }
    
    // Super Matrix Mode effects
    document.body.style.animation = 'glitch 0.1s infinite'
    
    const messages = [
      "THERE IS NO SPOON",
      "FREE YOUR MIND",
      "THE MATRIX HAS YOU",
      "FOLLOW THE WHITE RABBIT",
      "WAKE UP, koH...",
      "KNOCK KNOCK",
      "YOU ARE THE ONE"
    ]
    
    let messageIndex = 0
    const showMessage = setInterval(() => {
      setShowMatrixText(true)
      // Update text content here if needed
      messageIndex++
      if (messageIndex >= messages.length) {
        clearInterval(showMessage)
        setTimeout(() => {
          document.body.style.animation = ''
        }, 2000)
      }
    }, 2500)
  }

  // Terminal commands for demo
  const terminalCommands = [
    'git push origin main',
    'npm run build',
    'cargo build --release',
    'solana program deploy',
    'echo "WAGMI"'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      // Terminal animation logic can go here
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (matrixMode && canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [matrixMode])

  return (
    <div className={`min-h-screen relative ${matrixMode ? 'matrix-mode' : ''}`}>
      {/* Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        className={`fixed top-0 left-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500 ${
          matrixMode ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Matrix Mode Toggle */}
      <button
        onClick={toggleMatrix}
        className={`fixed bottom-8 right-8 z-[9999] w-16 h-16 rounded-full cursor-pointer flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 transform hover:scale-110 ${
          matrixMode 
            ? 'bg-gradient-to-br from-red-600 to-red-800 border-red-500 shadow-red-500/50' 
            : 'bg-gradient-to-br from-green-500 to-green-700 border-green-400 shadow-green-500/50 animate-pulse'
        } border-2 shadow-lg`}
        title={matrixMode ? "Exit the Matrix" : "Enter the Matrix"}
      >
        {matrixMode ? 'EXIT' : 'MATRIX'}
      </button>
      
      {/* Matrix Flash Text */}
      {showMatrixText && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-green-500 font-mono text-center z-[10000] animate-matrix-flash">
          FOLLOW THE WHITE RABBIT 🐰
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gradient-to-b from-gray-700 to-gray-800 border-b border-black z-[1000] backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-mono font-bold text-green-400">$koHLabs</a>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#mission" className="text-gray-300 hover:text-green-400 transition-colors">Mission</a>
            <a href="#terminal" className="text-gray-300 hover:text-green-400 transition-colors">Terminal</a>
            <a href="#socials" className="text-gray-300 hover:text-green-400 transition-colors">Connect</a>
            <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer" 
               className="text-gray-300 hover:text-green-400 transition-colors">Pump.fun</a>
            <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer"
               className="text-gray-300 hover:text-green-400 transition-colors">MEXC</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block relative mb-10 animate-float">
            <img 
              src="/kohlabs-meme.png" 
              alt="$koHLabs Meme" 
              className={`w-72 h-72 rounded-full border-4 object-cover ${
                matrixMode 
                  ? 'border-green-500 shadow-green-500/50 filter hue-rotate-120 contrast-125' 
                  : 'border-green-400 shadow-green-400/50'
              } shadow-2xl`}
            />
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            $koHLabs
          </h1>
          
          <p className="text-2xl text-blue-400 font-mono mb-8">
            Degen to Regen • Vibe Coding • Real Builds • Live Streams
          </p>
          
          <div className={`max-w-4xl mx-auto p-8 rounded-lg border ${
            matrixMode 
              ? 'bg-black/80 border-green-500' 
              : 'bg-purple-950/80 border-green-400'
          }`}>
            <h2 className="text-xl font-bold text-green-400 mb-4">🚀 Launch Statement</h2>
            <p className="text-lg text-green-400 mb-5">
              "$kohLabs – Degen to Regen. Vibe Coding. Real Builds."
            </p>
            <p className="text-gray-300 mb-4">
              Live streaming the journey from meme to mission. We build AI agents, support projects, 
              and write code we barely understand—together. Hardcore vibe coding. Real people. Real ops.
            </p>
            <p className="text-gray-300 mb-4">
              Learn with koH—because koH don't know, but koH builds anyway. From degen to regen, 
              we're helping projects go from zero to something. Coin powers the stream. Stream powers the builders.
            </p>
            <p className="text-blue-400 mb-4">
              Back $kohLabs and let's build loud. Launched with 1.01 SOL - Let's have some fun!
            </p>
            <p className="text-orange-400 pt-5 border-t border-green-400/30">
              <strong>A Collaborative Exploration:</strong> $kohLabs launched as a collaboration to explore the Solana ecosystem together. 
              We're discovering what's possible when builders, degens, and dreamers unite to navigate Sol's endless possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Terminal Section */}
      <section id="terminal" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`rounded-t-lg overflow-hidden shadow-2xl ${
            matrixMode ? 'border border-green-500 shadow-green-500/50' : ''
          }`}>
            <div className="bg-gradient-to-b from-gray-600 to-gray-700 h-8 flex items-center gap-2 px-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-b from-red-400 to-red-600"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-b from-green-400 to-green-600"></div>
            </div>
            <div className={`font-mono text-sm p-5 h-96 overflow-y-auto ${
              matrixMode ? 'bg-black/90 text-green-500' : 'bg-purple-950 text-white'
            }`}>
              <div className="mb-2">
                <span className="text-green-400 font-bold">koh@kohlabs:~$</span>
                <span className="ml-2">cat mission.txt</span>
              </div>
              <div className="text-blue-400 ml-5">
                <pre>{`╔══════════════════════════════════════════════╗
║  $koHLabs Mission Statement                  ║
╠══════════════════════════════════════════════╣
║  • Degen to Regen transformation             ║
║  • Vibe coding with real people              ║
║  • Build AI agents & support projects        ║
║  • Write code we barely understand—together  ║
║  • Explore Solana ecosystem collaboratively  ║
╚══════════════════════════════════════════════╝`}</pre>
              </div>
              <div className="mt-4 mb-2">
                <span className="text-green-400 font-bold">koh@kohlabs:~$</span>
                <span className="ml-2">./check_status.sh</span>
              </div>
              <div className="text-blue-400 ml-5">
                <div>[✓] Solana Network: Connected</div>
                <div>[✓] Token Contract: Deployed with 1.01 SOL</div>
                <div>[✓] Vibe Check: Hardcore mode enabled</div>
                <div>[✓] koH Status: Building anyway</div>
                <div>[✓] Mission: Degen → Regen in progress</div>
              </div>
              <div className="mt-4 mb-2">
                <span className="text-green-400 font-bold">koh@kohlabs:~$</span>
                <span className="ml-2">echo "koH don't know, but koH builds anyway"</span>
              </div>
              <div className="text-blue-400 ml-5">
                koH don't know, but koH builds anyway
              </div>
              <div className="mt-4">
                <span className="text-green-400 font-bold">koh@kohlabs:~$</span>
                <span className="ml-2 animate-pulse">_</span>
              </div>
              
              {/* Easter Egg for Matrix Mode */}
              {matrixMode && (
                <>
                  <div className="mt-4 text-green-500">
                    <span className="font-bold">neo@matrix:~$</span>
                    <span className="ml-2">wake_up_neo</span>
                  </div>
                  <div className="text-green-500 ml-5">
                    <div>The Matrix has you...</div>
                    <div>Follow the white rabbit 🐰</div>
                    <div>Knock, knock, Neo.</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🔄', title: 'Degen to Regen', desc: 'Transforming degen energy into regenerative building. We\'re taking projects from zero to something, one vibe-coded line at a time.' },
            { icon: '🎬', title: 'Live Stream Coding', desc: 'Real people, real ops, real builds. Watch us write code we barely understand, debug in public, and celebrate when things actually work.' },
            { icon: '🤖', title: 'AI Agent Building', desc: 'Creating AI agents that do... things. Sometimes useful things. Always interesting things. Join us in the experimental zone.' },
            { icon: '⚡', title: 'Solana Exploration', desc: 'Collaborative discovery of the Sol ecosystem. We\'re learning together, building together, and probably breaking things together.' },
            { icon: '🛠️', title: 'Project Support', desc: 'Helping other projects go from idea to reality. Because koH believes in lifting while climbing, even when we\'re not sure where we\'re going.' },
            { icon: '🎯', title: 'Vibe Coding', desc: 'Hardcore vibe coding sessions where the energy is high, the code is questionable, and the learning never stops. This is how we roll.' }
          ].map((item, i) => (
            <div key={i} className={`p-6 rounded-lg border transition-all duration-300 hover:transform hover:-translate-y-1 ${
              matrixMode 
                ? 'bg-green-950/60 border-green-500/30 hover:border-green-500 hover:shadow-green-500/20' 
                : 'bg-purple-950/60 border-green-400/30 hover:border-green-400 hover:shadow-green-400/20'
            } hover:shadow-2xl`}>
              <h3 className="text-xl font-bold text-green-400 mb-3">{item.icon} {item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Socials Section */}
      <section id="socials" className="py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-green-400 mb-10">Connect With Us</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <a href="https://t.me/cryptokoh" target="_blank" rel="noopener noreferrer" 
             className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all duration-300 hover:scale-105 font-mono ${
               matrixMode 
                 ? 'bg-green-950/80 border-green-500 text-green-500 hover:bg-green-500 hover:text-black' 
                 : 'bg-purple-950/80 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-purple-950'
             }`}>
            Telegram: @cryptokoh
          </a>
          <a href="https://x.com/crypto_koh" target="_blank" rel="noopener noreferrer"
             className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all duration-300 hover:scale-105 font-mono ${
               matrixMode 
                 ? 'bg-green-950/80 border-green-500 text-green-500 hover:bg-green-500 hover:text-black' 
                 : 'bg-purple-950/80 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-purple-950'
             }`}>
            X: @crypto_koh
          </a>
          <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer"
             className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all duration-300 hover:scale-105 font-mono ${
               matrixMode 
                 ? 'bg-green-950/80 border-green-500 text-green-500 hover:bg-green-500 hover:text-black' 
                 : 'bg-purple-950/80 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-purple-950'
             }`}>
            Trade on Pump.fun
          </a>
          <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer"
             className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all duration-300 hover:scale-105 font-mono ${
               matrixMode 
                 ? 'bg-green-950/80 border-green-500 text-green-500 hover:bg-green-500 hover:text-black' 
                 : 'bg-purple-950/80 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-purple-950'
             }`}>
            Trade on MEXC
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Build the Future?</h2>
        <p className="text-lg mb-10 text-gray-300">
          Join the $koHLabs community and be part of the open development revolution
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer"
             className="px-10 py-5 bg-gradient-to-r from-green-400 to-blue-500 text-purple-950 font-bold text-lg rounded-full transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-400/50">
            Get $koHLabs on Pump.fun
          </a>
          <a href="https://www.mexc.com/dex/pumpfun-mexc?ca=koHLabs&currency=SOL" target="_blank" rel="noopener noreferrer"
             className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-400/50">
            Trade on MEXC DEX
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-white/10 text-gray-500 font-mono">
        <p>© 2024 $koHLabs • Building in Public • Powered by Solana</p>
        <p className="mt-2 text-green-400">Not financial advice. DYOR. Build responsibly.</p>
      </footer>

      {/* Add custom styles for matrix mode */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-matrix-flash {
          animation: matrixFlash 3s ease-in-out;
        }
        
        @keyframes matrixFlash {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        }
        
        .matrix-mode * {
          color: #00ff00 !important;
          text-shadow: 0 0 5px #00ff00;
        }
        
        .matrix-mode {
          background: #000 !important;
        }
      `}</style>
    </div>
  )
}

export default KoHLabs