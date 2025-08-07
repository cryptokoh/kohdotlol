import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KoHLabsModal from './KoHLabsModal'

const KoHLabsOnboarding = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState('welcome') // welcome, vibe-code, audio-setup, entering
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('neural')
  const [agreedToVibe, setAgreedToVibe] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const vibeCodeText = `
At koH Labs, we believe in the power of radical creativity and unbounded innovation.

Our Vibe Code:
• Build whatever ignites your passion
• Collaborate without limits
• Push boundaries of what's possible  
• Respect the creative process of others
• Share knowledge freely and boldly
• Embrace experimental thinking
• Code with purpose and joy

By entering koH Labs, you agree to contribute to an environment where 
imagination becomes reality and every idea has the potential to change the world.
  `.trim()

  const WelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      {/* koH Labs Logo Animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto w-32 h-32 mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-20 blur-xl"></div>
        <div className="relative w-full h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
          koH
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30"
        />
      </motion.div>

      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400"
        >
          Welcome to koH Labs
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed"
        >
          A quantum research environment where imagination meets innovation. 
          Build, explore, and create without limits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4 text-sm text-gray-400"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Quantum Ready</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>AI Enhanced</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Voice Enabled</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0 }}
        className="space-y-4"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6, 182, 212, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentStep('vibe-code')}
          className="w-full py-4 px-8 rounded-2xl text-white font-semibold text-lg transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.8), rgba(59, 130, 246, 0.8))',
            border: '1px solid rgba(6, 182, 212, 0.5)',
            boxShadow: '0 10px 40px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          Ready to Enter koH Labs? →
        </motion.button>

        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          By continuing, you'll experience an immersive research environment with voice guidance, 
          AI assistance, and unlimited creative potential.
        </p>
      </motion.div>
    </motion.div>
  )

  const VibeCodeStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
          koH Labs Vibe Code
        </h2>
        <p className="text-gray-400 text-sm">Our creative manifesto and community guidelines</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl blur-sm"></div>
        <div className="relative bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <pre className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-mono">
            {vibeCodeText}
          </pre>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAgreedToVibe(!agreedToVibe)}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            agreedToVibe
              ? 'bg-cyan-500 border-cyan-500 text-white'
              : 'border-gray-400 hover:border-cyan-400'
          }`}
        >
          {agreedToVibe && '✓'}
        </motion.button>
        <label className="text-gray-300 cursor-pointer" onClick={() => setAgreedToVibe(!agreedToVibe)}>
          I agree to the koH Labs Vibe Code and commit to building with creativity and respect
        </label>
      </div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentStep('welcome')}
          className="flex-1 py-3 px-6 rounded-xl text-gray-300 font-medium border border-gray-600 hover:border-gray-500 transition-all"
        >
          ← Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: agreedToVibe ? 1.02 : 1, opacity: agreedToVibe ? 1 : 0.7 }}
          whileTap={{ scale: agreedToVibe ? 0.98 : 1 }}
          onClick={() => agreedToVibe && setCurrentStep('audio-setup')}
          disabled={!agreedToVibe}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
            agreedToVibe
              ? 'text-white border-purple-500 hover:shadow-lg hover:shadow-purple-500/30'
              : 'text-gray-500 border-gray-700 cursor-not-allowed'
          }`}
          style={agreedToVibe ? {
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.6), rgba(126, 34, 206, 0.6))',
            border: '1px solid rgba(147, 51, 234, 0.8)'
          } : {}}
        >
          Continue to Audio Setup →
        </motion.button>
      </div>
    </motion.div>
  )

  const AudioSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
          Audio Experience Setup
        </h2>
        <p className="text-gray-400 text-sm">Enhance your koH Labs journey with voice guidance</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
          <div>
            <h3 className="text-white font-medium">Enable Voice Guidance</h3>
            <p className="text-gray-400 text-sm">Immersive audio narration and feedback</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`relative w-12 h-6 rounded-full transition-all ${
              audioEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <motion.div
              animate={{ x: audioEnabled ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
            />
          </motion.button>
        </div>

        {audioEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <label className="block text-gray-300 font-medium">Voice Style</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'neural', name: 'Neural', desc: 'Advanced AI voice' },
                { id: 'classic', name: 'Classic', desc: 'Traditional synthesis' },
                { id: 'ethereal', name: 'Ethereal', desc: 'Atmospheric tone' },
                { id: 'quantum', name: 'Quantum', desc: 'Futuristic sound' }
              ].map((voice) => (
                <motion.button
                  key={voice.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedVoice === voice.id
                      ? 'border-blue-400 bg-blue-500/20 text-blue-200'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="font-medium">{voice.name}</div>
                  <div className="text-xs text-gray-400">{voice.desc}</div>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all"
            >
              🔊 Test Voice Sample
            </motion.button>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentStep('vibe-code')}
          className="flex-1 py-3 px-6 rounded-xl text-gray-300 font-medium border border-gray-600 hover:border-gray-500 transition-all"
        >
          ← Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentStep('entering')}
          className="flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(22, 163, 74, 0.6))',
            border: '1px solid rgba(34, 197, 94, 0.8)',
            boxShadow: '0 5px 20px rgba(34, 197, 94, 0.3)'
          }}
        >
          Enter koH Labs →
        </motion.button>
      </div>
    </motion.div>
  )

  const EnteringStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-8 py-8"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-2xl"
      >
        koH
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400">
          Initializing koH Labs...
        </h2>
        
        <div className="space-y-2 text-gray-300">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            🧬 Loading quantum research environment...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            🤖 Activating AI research assistants...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            🔬 Calibrating creative instruments...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
          >
            ✨ Welcome to the future of innovation!
          </motion.p>
        </div>
      </div>

      {/* Auto-complete after animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.0 }}
        onAnimationComplete={() => {
          setTimeout(() => onComplete({
            audioEnabled,
            selectedVoice,
            agreedToVibe
          }), 1000)
        }}
        className="text-green-400 text-sm"
      >
        Ready! Entering simulation...
      </motion.div>
    </motion.div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome': return <WelcomeStep />
      case 'vibe-code': return <VibeCodeStep />
      case 'audio-setup': return <AudioSetupStep />
      case 'entering': return <EnteringStep />
      default: return <WelcomeStep />
    }
  }

  return (
    <KoHLabsModal
      isOpen={true}
      onClose={currentStep === 'entering' ? undefined : onClose}
      title={currentStep === 'entering' ? undefined : "koH Labs Research Portal"}
      className="max-w-3xl"
    >
      {renderCurrentStep()}
    </KoHLabsModal>
  )
}

export default KoHLabsOnboarding