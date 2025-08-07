import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KoHLabsModal = ({ isOpen, onClose, children, title, className = "", style = {} }) => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                      <circle cx="10" cy="10" r="1" fill="rgba(6, 182, 212, 0.4)"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"/>
                  <rect width="100%" height="100%" fill="url(#dots)"/>
                </svg>
              </div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-50 max-w-2xl w-full max-h-[90vh] overflow-hidden ${className}`}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
              backdropFilter: 'blur(40px)',
              borderRadius: '24px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: `
                0 25px 80px rgba(0, 0, 0, 0.5),
                0 0 120px rgba(6, 182, 212, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(6, 182, 212, 0.2)
              `,
              ...style
            }}
          >
            {/* Holographic Border Animation */}
            <div className="absolute inset-0 rounded-[24px] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent)',
                  width: '200%',
                  height: '2px',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(0deg, transparent, rgba(147, 51, 234, 0.4), transparent)',
                  width: '2px',
                  height: '200%',
                  right: 0
                }}
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-400/60 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-purple-400/60 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-400/60 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-purple-400/60 rounded-br-lg"></div>

            {/* Title Bar */}
            {title && (
              <div className="relative p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center"
                    >
                      <div className="w-4 h-4 rounded-full bg-white/20"></div>
                    </motion.div>
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400">
                      {title}
                    </h2>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-300 hover:text-red-200 transition-all border border-red-500/30"
                  >
                    ×
                  </motion.button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="relative p-6">
              {children}
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default KoHLabsModal