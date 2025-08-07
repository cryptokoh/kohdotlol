import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SimpleMatrix from './components/SimpleMatrix'
import PremiumTerminalManager from './components/PremiumTerminalManager'
import { UnifiedWalletConnector } from './components/UnifiedWalletConnector'
import KoHLabsOnboarding from './components/KoHLabsOnboarding'
import KoHLabsSimulation from './components/KoHLabsSimulation'
import { useTheme } from './contexts/ThemeContext'
import { useView } from './contexts/ViewContext'

const TerminalApp = () => {
  const [matrixIntensity, setMatrixIntensity] = useState(0.3)
  const [isLoaded, setIsLoaded] = useState(false)
  const [inactivityCountdown, setInactivityCountdown] = useState(5) // 5 second inactivity countdown
  const [showInactivityCountdown, setShowInactivityCountdown] = useState(false)
  const [userEngaged, setUserEngaged] = useState(false)
  const [automationTriggered, setAutomationTriggered] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showKoHLabsOnboarding, setShowKoHLabsOnboarding] = useState(false)
  const [showKoHLabsSimulation, setShowKoHLabsSimulation] = useState(false)
  const [koHLabsSettings, setKoHLabsSettings] = useState(null)
  
  const { theme, listThemes, changeTheme } = useTheme()
  const { isMobileView, toggleView, isActualMobile } = useView()

  useEffect(() => {
    // Simulate loading sequence
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Inactivity detection and countdown
  useEffect(() => {
    if (!isLoaded) return

    const handleUserActivity = () => {
      setLastActivity(Date.now())
      setUserEngaged(true)
      setShowInactivityCountdown(false)
      setInactivityCountdown(5) // Reset countdown
    }

    // Check for inactivity every second
    const inactivityTimer = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity
      
      if (timeSinceActivity >= 3000 && !showInactivityCountdown && !automationTriggered && !showKoHLabsOnboarding) {
        // Start showing countdown after 3 seconds of inactivity
        setShowInactivityCountdown(true)
        setInactivityCountdown(5)
      }
    }, 1000)

    // Countdown timer
    const countdownTimer = setInterval(() => {
      if (showInactivityCountdown) {
        setInactivityCountdown(prev => {
          if (prev <= 1) {
            setShowInactivityCountdown(false)
            setShowKoHLabsOnboarding(true)
            return 5
          }
          return prev - 1
        })
      }
    }, 1000)

    // Activity listeners
    window.addEventListener('mousedown', handleUserActivity)
    window.addEventListener('mousemove', handleUserActivity)
    window.addEventListener('keydown', handleUserActivity)
    window.addEventListener('touchstart', handleUserActivity)
    window.addEventListener('scroll', handleUserActivity)
    
    return () => {
      clearInterval(inactivityTimer)
      clearInterval(countdownTimer)
      window.removeEventListener('mousedown', handleUserActivity)
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      window.removeEventListener('touchstart', handleUserActivity)
      window.removeEventListener('scroll', handleUserActivity)
    }
  }, [isLoaded, lastActivity, showInactivityCountdown, automationTriggered])

  // Handle koH Labs onboarding completion
  const handleOnboardingComplete = (settings) => {
    setKoHLabsSettings(settings)
    setShowKoHLabsOnboarding(false)
    setShowKoHLabsSimulation(true)
  }

  // Handle koH Labs simulation close
  const handleSimulationClose = () => {
    setShowKoHLabsSimulation(false)
    setAutomationTriggered(true) // Show regular terminal automation
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} text-gray-100 relative overflow-hidden`}>
      {/* Simple Matrix Background */}
      <SimpleMatrix intensity={matrixIntensity} />

      {/* Main Desktop Environment */}
      <div className="relative z-10 min-h-screen">

        {/* Compact Terminal Environment */}
        <div className="h-screen relative">
          {isLoaded ? (
            <PremiumTerminalManager 
              automationTrigger={automationTriggered} // Pass automation trigger
              onKoHLabsOpen={() => setShowKoHLabsOnboarding(true)} // Pass koH Labs handler
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  🖥️
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-lg font-medium text-gray-300"
                >
                  Booting koHLabs Terminal OS...
                </motion.div>
                <div className="text-sm text-gray-500 mt-2">
                  Initializing quantum desktop environment
                </div>
              </div>
            </motion.div>
          )}

          {/* Glass Inactivity Countdown */}
          <AnimatePresence>
            {showInactivityCountdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="fixed top-4 right-4 backdrop-blur-2xl rounded-2xl p-6 text-center border shadow-2xl z-50"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.3))',
                  borderColor: 'rgba(251, 191, 36, 0.4)',
                  boxShadow: '0 20px 60px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-center gap-2 text-yellow-100 font-semibold text-sm mb-3">
                  <span className="text-lg">🏛️</span>
                  <span>Entering koH Labs</span>
                </div>
                <motion.div 
                  className="text-4xl font-mono font-bold text-yellow-100 mb-2"
                  animate={{ 
                    scale: inactivityCountdown <= 2 ? [1, 1.2, 1] : 1,
                    textShadow: inactivityCountdown <= 2 ? ['0 0 10px rgba(251, 191, 36, 0.8)', '0 0 20px rgba(251, 191, 36, 1)', '0 0 10px rgba(251, 191, 36, 0.8)'] : '0 0 10px rgba(251, 191, 36, 0.5)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {inactivityCountdown}
                </motion.div>
                <div className="text-xs text-yellow-200/80 font-medium">
                  Move to cancel
                </div>
                
                {/* Progress Ring */}
                <div className="absolute inset-0 rounded-2xl">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(251, 191, 36, 0.2)"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(251, 191, 36, 0.6)"
                      strokeWidth="2"
                      strokeDasharray={283}
                      strokeDashoffset={283 - (283 * (5 - inactivityCountdown)) / 5}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* koH Labs Experience */}
        {showKoHLabsOnboarding && (
          <KoHLabsOnboarding
            onComplete={handleOnboardingComplete}
            onClose={() => setShowKoHLabsOnboarding(false)}
          />
        )}

        {showKoHLabsSimulation && (
          <KoHLabsSimulation
            onClose={handleSimulationClose}
            userSettings={koHLabsSettings}
          />
        )}

      </div>
    </div>
  )
}

export default TerminalApp