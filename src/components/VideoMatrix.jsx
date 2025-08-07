import { useEffect, useRef, useState } from 'react'

const VideoMatrix = ({ 
  intensity = 0.8, 
  className = "",
  theme = 'matrix' // matrix, cyberpunk, hacker, neon, ice
}) => {
  const videoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(null)
  
  // Map themes to video sources (we'll use placeholder URLs for now)
  const videoSources = {
    matrix: '/videos/matrix-green.mp4',
    cyberpunk: '/videos/matrix-purple.mp4', 
    hacker: '/videos/matrix-red.mp4',
    neon: '/videos/matrix-yellow.mp4',
    ice: '/videos/matrix-blue.mp4'
  }

  // Fallback: Generate Matrix video data URL if no video file exists
  const generateMatrixVideo = (color = '#00ff41') => {
    // For now, we'll return null and fallback to CSS animation
    // In production, you'd generate or host actual Matrix rain videos
    return null
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Try to load themed video
    const src = videoSources[theme] || videoSources.matrix
    
    // Check if video exists, otherwise use CSS fallback
    const testVideo = document.createElement('video')
    testVideo.onload = () => setVideoSrc(src)
    testVideo.onerror = () => setVideoSrc(null)
    testVideo.src = src

    video.play().catch(() => {
      // Auto-play failed, that's okay for background videos
    })

    return () => {
      if (video) {
        video.pause()
      }
    }
  }, [theme])

  // CSS-based Matrix fallback animation
  const CSSMatrixFallback = () => (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className} matrix-rain`}>
      <div className="matrix-column" style={{ '--delay': '0s', '--duration': '3s' }}>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="matrix-char" style={{ '--char-delay': `${i * 0.1}s` }}>
            {String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .matrix-rain {
          background: black;
          overflow: hidden;
          position: relative;
        }
        
        .matrix-column {
          position: absolute;
          top: -100%;
          width: 20px;
          height: 200%;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: var(--theme-primary, #00ff41);
          animation: matrix-fall var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
        
        .matrix-char {
          display: block;
          opacity: 0;
          animation: matrix-glow 0.5s ease-in-out infinite alternate;
          animation-delay: var(--char-delay);
        }
        
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes matrix-glow {
          0% { opacity: 0.3; }
          100% { opacity: 1; text-shadow: 0 0 10px currentColor; }
        }
        
        /* Generate multiple columns */
        ${Array.from({ length: 100 }, (_, i) => `
          .matrix-rain::after:nth-child(${i + 1}) {
            left: ${i * 2}%;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${3 + Math.random() * 4}s;
          }
        `).join('')}
      `}</style>
    </div>
  )

  // If we have a video source, use video background
  if (videoSrc) {
    return (
      <video
        ref={videoRef}
        className={`fixed inset-0 w-full h-full object-cover pointer-events-none z-0 ${className}`}
        style={{ 
          opacity: intensity,
          filter: `brightness(${intensity})`,
          mixBlendMode: 'screen'
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Fallback to CSS animation if video fails */}
        <CSSMatrixFallback />
      </video>
    )
  }

  // Enhanced CSS-based Matrix effect as fallback
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ 
        opacity: intensity,
        background: 'black',
        overflow: 'hidden'
      }}
    >
      {/* Multiple Matrix columns */}
      {Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 font-mono text-sm select-none"
          style={{
            left: `${i * 2}%`,
            color: 'var(--theme-primary, #00ff41)',
            animation: `matrix-fall-${i % 5} ${3 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            textShadow: '0 0 5px currentColor',
            filter: `brightness(${0.5 + Math.random() * 0.5})`,
          }}
        >
          {/* Characters in column */}
          {Array.from({ length: 30 }, (_, j) => (
            <div
              key={j}
              className="block leading-4"
              style={{
                opacity: Math.random(),
                animation: `matrix-char-${j % 3} ${0.5 + Math.random()}s ease-in-out infinite alternate`,
                animationDelay: `${j * 0.1}s`
              }}
            >
              {/* Mix of Matrix-style characters */}
              {Math.random() > 0.7 
                ? ['$', 'koH', 'Labs', '⚗️', '🧪', '🔬', 'DNA', '⚛️'][Math.floor(Math.random() * 8)]
                : String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
              }
            </div>
          ))}
        </div>
      ))}

      <style jsx>{`
        @keyframes matrix-fall-0 {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes matrix-fall-1 {
          0% { transform: translateY(-120vh); }
          100% { transform: translateY(110vh); }
        }
        @keyframes matrix-fall-2 {
          0% { transform: translateY(-110vh); }
          100% { transform: translateY(120vh); }
        }
        @keyframes matrix-fall-3 {
          0% { transform: translateY(-90vh); }
          100% { transform: translateY(130vh); }
        }
        @keyframes matrix-fall-4 {
          0% { transform: translateY(-130vh); }
          100% { transform: translateY(90vh); }
        }
        
        @keyframes matrix-char-0 {
          0% { opacity: 0.2; }
          100% { opacity: 1; text-shadow: 0 0 10px currentColor; }
        }
        @keyframes matrix-char-1 {
          0% { opacity: 0.3; }
          100% { opacity: 0.9; text-shadow: 0 0 8px currentColor; }
        }
        @keyframes matrix-char-2 {
          0% { opacity: 0.1; }
          100% { opacity: 0.8; text-shadow: 0 0 12px currentColor; }
        }
      `}</style>
    </div>
  )
}

export default VideoMatrix