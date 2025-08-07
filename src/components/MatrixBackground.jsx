import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const MatrixBackground = ({ intensity = 0.3, className = "" }) => {
  const videoRef = useRef(null)
  const [useVideo, setUseVideo] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const { theme } = useTheme()

  // Video sources for different themes
  const getVideoSource = () => {
    // You can add actual Matrix rain videos to public/videos/
    const videoSources = {
      matrix: '/videos/matrix-green.mp4',
      cyberpunk: '/videos/matrix-purple.mp4',
      hacker: '/videos/matrix-red.mp4', 
      neon: '/videos/matrix-yellow.mp4',
      ice: '/videos/matrix-blue.mp4'
    }
    
    // For demo purposes, we'll create a data URL for a simple animated background
    // In production, you'd host actual high-quality Matrix rain videos
    return videoSources[theme.key] || null
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setVideoLoaded(true)
      video.play().catch(() => {
        console.log('Video autoplay blocked, using CSS fallback')
        setUseVideo(false)
      })
    }

    const handleError = () => {
      console.log('Video failed to load, using CSS fallback')
      setUseVideo(false)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      if (video) {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }
  }, [theme])

  // Enhanced CSS-based Matrix fallback
  const CSSMatrixRain = () => (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, black 100%)',
        opacity: intensity,
      }}
    >
      {/* Create multiple Matrix columns */}
      {Array.from({ length: 80 }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 font-mono select-none leading-tight"
          style={{
            left: `${(i / 80) * 100}%`,
            fontSize: `${12 + Math.random() * 4}px`,
            color: theme.css['--theme-primary'] || '#00ff41',
            textShadow: `0 0 8px ${theme.css['--theme-primary'] || '#00ff41'}`,
            animation: `matrixDrop${i % 5} ${4 + Math.random() * 6}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: `brightness(${0.4 + Math.random() * 0.6})`,
            transform: 'scaleY(1.2)',
          }}
        >
          {/* Matrix characters */}
          {Array.from({ length: 25 }, (_, j) => {
            const chars = ['$', 'koH', 'Labs', '0', '1', '⚗️', '🧪', '🔬', 'DNA', '⚛️', 'A', 'B', 'C', 'X', 'Y', 'Z', '>', '<', '/', '\\', '|', '+', '-', '*', '=']
            return (
              <div
                key={j}
                style={{
                  opacity: Math.max(0.1, 1 - (j / 25)),
                  display: 'block',
                  height: '16px',
                  animation: `matrixGlow ${0.5 + Math.random()}s ease-in-out infinite alternate`,
                  animationDelay: `${j * 0.05}s`
                }}
              >
                {chars[Math.floor(Math.random() * chars.length)]}
              </div>
            )
          })}
        </div>
      ))}
      
      {/* Add some floating particles */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: theme.css['--theme-primary'] || '#00ff41',
            boxShadow: `0 0 6px ${theme.css['--theme-primary'] || '#00ff41'}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `matrixFloat ${8 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes matrixDrop0 {
          0% { transform: translateY(-100vh) scaleY(1.2); }
          100% { transform: translateY(100vh) scaleY(1.2); }
        }
        @keyframes matrixDrop1 {
          0% { transform: translateY(-120vh) scaleY(1.3); }
          100% { transform: translateY(110vh) scaleY(1.3); }
        }
        @keyframes matrixDrop2 {
          0% { transform: translateY(-110vh) scaleY(1.1); }
          100% { transform: translateY(120vh) scaleY(1.1); }
        }
        @keyframes matrixDrop3 {
          0% { transform: translateY(-90vh) scaleY(1.4); }
          100% { transform: translateY(130vh) scaleY(1.4); }
        }
        @keyframes matrixDrop4 {
          0% { transform: translateY(-130vh) scaleY(1.2); }
          100% { transform: translateY(95vh) scaleY(1.2); }
        }
        
        @keyframes matrixGlow {
          0% { 
            text-shadow: 0 0 2px currentColor;
            opacity: 0.3;
          }
          100% { 
            text-shadow: 0 0 12px currentColor, 0 0 20px currentColor;
            opacity: 1;
          }
        }
        
        @keyframes matrixFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) scale(1.2);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(0px) translateX(-5px) scale(0.8);
            opacity: 0.5;
          }
          75% { 
            transform: translateY(-15px) translateX(-10px) scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )

  // If we want to use video and have a source
  const videoSource = getVideoSource()
  
  if (useVideo && videoSource) {
    return (
      <>
        <video
          ref={videoRef}
          className={`fixed inset-0 w-full h-full object-cover pointer-events-none z-0 ${className}`}
          style={{ 
            opacity: videoLoaded ? intensity : 0,
            filter: `hue-rotate(${theme.key === 'cyberpunk' ? '270deg' : theme.key === 'hacker' ? '0deg' : theme.key === 'neon' ? '60deg' : theme.key === 'ice' ? '180deg' : '120deg'})`,
            transition: 'opacity 1s ease-in-out'
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={videoSource} type="video/mp4" />
        </video>
        
        {/* Fallback while video loads */}
        {!videoLoaded && <CSSMatrixRain />}
      </>
    )
  }

  // CSS-based Matrix rain fallback
  return <CSSMatrixRain />
}

export default MatrixBackground