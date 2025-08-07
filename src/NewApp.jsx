import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function NewApp() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo/Title */}
          <motion.h1 
            className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            koh.lol
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to the $koHLabs ecosystem
          </motion.p>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-center"
          >
            <Link 
              to="/terminal"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600/20 to-cyan-600/20 border border-green-500/30 rounded-lg hover:border-green-400 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="text-lg font-semibold">🧬 Terminal Lab</span>
              <motion.span 
                className="text-green-400 group-hover:text-cyan-400 transition-colors duration-300 animate-pulse"
                whileHover={{ scale: 1.1 }}
              >
                MATRIX
              </motion.span>
            </Link>

            <Link 
              to="/defi"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg hover:border-blue-400 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="text-lg font-semibold">💻 DeFi Terminal</span>
              <motion.span 
                className="text-blue-400 group-hover:text-purple-400 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                TRADE
              </motion.span>
            </Link>
            
            <Link 
              to="/v0-0-1"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="text-lg font-semibold">🚀 View Epic Launch Build</span>
              <motion.span 
                className="text-purple-400 group-hover:text-pink-400 transition-colors duration-300"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                v0.0.1
              </motion.span>
            </Link>
          </motion.div>

          {/* New site coming soon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/40 border border-gray-700 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-300">New site coming soon</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 30, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p>$koHLabs • Building the future of decentralized finance</p>
      </motion.footer>
    </div>
  )
}

export default NewApp