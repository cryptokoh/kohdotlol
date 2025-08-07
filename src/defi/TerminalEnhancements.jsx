// Terminal Enhancement Components for koHLabs DeFi Terminal
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ASCII_ART } from './TerminalArt'

// Sound Effects Component (Text-based)
export const SoundEffect = ({ type, trigger, onComplete }) => {
  const soundMap = {
    success: ['*DING!*', '*CHIME!*', '*✨ SPARKLE ✨*', '*🎉 CELEBRATION 🎉*'],
    error: ['*BZZT!*', '*FIZZLE*', '*💥 POP 💥*', '*⚡ ZAP ⚡*'],
    processing: ['*WHIRR*', '*HUM*', '*BUZZ*', '*🔄 PROCESSING 🔄*'],
    explosion: ['*BOOM!*', '*💥 BANG 💥*', '*⚡ KAPOW ⚡*', '*🚀 BLAST OFF 🚀*'],
    beaker: ['*BUBBLE*', '*FIZZ*', '*🧪 REACTION 🧪*', '*⚗️ BREWING ⚗️*']
  }

  if (!trigger) return null

  const sound = soundMap[type] ? soundMap[type][Math.floor(Math.random() * soundMap[type].length)] : '*SOUND*'

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 10 }}
      transition={{ duration: 0.5 }}
      className="text-yellow-400 font-bold text-xs"
      onAnimationComplete={onComplete}
    >
      {sound}
    </motion.span>
  )
}

// Typing Animation Component
export const TypingAnimation = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className="font-mono">
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-green-400"
        >
          ▋
        </motion.span>
      )}
    </span>
  )
}

// Glitch Text Effect
export const GlitchText = ({ children, intensity = 'low' }) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = intensity === 'high' ? 500 : intensity === 'medium' ? 2000 : 5000
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 150)
    }, glitchInterval)

    return () => clearInterval(interval)
  }, [intensity])

  if (!isGlitching) return <span>{children}</span>

  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute top-0 left-0.5 text-cyan-400 opacity-80 animate-glitch-1">
        {children}
      </span>
      <span className="absolute top-0 -left-0.5 text-pink-400 opacity-80 animate-glitch-2">
        {children}
      </span>
    </span>
  )
}

// Floating Lab Equipment
export const FloatingLabEquipment = () => {
  const equipment = ['🧪', '⚗️', '🔬', '💎', '⚡', '🧬']
  const [items, setItems] = useState([])

  useEffect(() => {
    const generateItem = () => {
      const newItem = {
        id: Date.now() + Math.random(),
        emoji: equipment[Math.floor(Math.random() * equipment.length)],
        x: Math.random() * 100,
        y: 100,
        duration: Math.random() * 15 + 10
      }
      setItems(prev => [...prev, newItem])
    }

    const interval = setInterval(generateItem, 8000)
    const cleanup = setInterval(() => {
      setItems(prev => prev.filter(item => Date.now() - item.id < 20000))
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(cleanup)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-5 opacity-30">
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            className="absolute text-2xl"
            style={{ left: `${item.x}%` }}
            initial={{ y: '100vh', opacity: 0, rotate: 0 }}
            animate={{ 
              y: '-20vh', 
              opacity: [0, 1, 1, 0],
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: item.duration,
              ease: 'linear',
              rotate: { duration: item.duration / 2, repeat: Infinity },
              scale: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Command Auto-complete Helper
export const AutoComplete = ({ input, commands, onSuggestion }) => {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (input.length > 0) {
      const matches = commands.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      ).slice(0, 5)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }, [input, commands])

  if (suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-full left-0 mb-1 bg-gray-800 border border-green-500/30 rounded-md p-2 min-w-48 z-20"
    >
      <div className="text-xs text-gray-400 mb-1">📝 Suggested commands:</div>
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion}
          className="text-green-400 hover:text-cyan-400 cursor-pointer text-sm py-1"
          whileHover={{ x: 5, scale: 1.05 }}
          onClick={() => onSuggestion(suggestion)}
        >
          → {suggestion}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Terminal Status Indicator
export const TerminalStatus = ({ 
  connected, 
  network, 
  commandCount, 
  lastActivity, 
  experimentSuccess 
}) => {
  const getStatusColor = () => {
    if (!connected) return 'text-red-400'
    if (Date.now() - lastActivity > 30000) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getActivityLevel = () => {
    const timeDiff = Date.now() - lastActivity
    if (timeDiff < 5000) return 'HIGHLY ACTIVE'
    if (timeDiff < 30000) return 'ACTIVE'
    if (timeDiff < 300000) return 'IDLE'
    return 'DORMANT'
  }

  return (
    <div className="flex items-center gap-4 text-xs font-mono">
      <motion.div
        className={`flex items-center gap-1 ${getStatusColor()}`}
        animate={{ 
          scale: connected ? [1, 1.05, 1] : 1,
          opacity: connected ? 1 : 0.6
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>🔗</span>
        <span>{connected ? 'QUANTUM LINKED' : 'ENTANGLEMENT PENDING'}</span>
      </motion.div>
      
      <div className="text-purple-400">
        🧬 Activity: {getActivityLevel()}
      </div>
      
      <div className="text-cyan-400">
        ⚗️ Experiments: {commandCount}
      </div>
      
      {experimentSuccess > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-yellow-400"
        >
          🏆 Success: {experimentSuccess}%
        </motion.div>
      )}
      
      <div className="text-green-400">
        🌐 Network: {network.toUpperCase()}
      </div>
    </div>
  )
}

// Lab Progress Bar
export const LabProgressBar = ({ progress, label, color = 'green' }) => {
  const colorMap = {
    green: 'from-green-600 to-green-400',
    purple: 'from-purple-600 to-purple-400',
    cyan: 'from-cyan-600 to-cyan-400',
    pink: 'from-pink-600 to-pink-400'
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">🔬 {label}</span>
        <span className="text-gray-300">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default {
  SoundEffect,
  TypingAnimation,
  GlitchText,
  FloatingLabEquipment,
  AutoComplete,
  TerminalStatus,
  LabProgressBar
}