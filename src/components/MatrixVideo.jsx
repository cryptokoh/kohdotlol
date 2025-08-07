import { useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const MatrixVideo = ({ intensity = 0.3, className = "" }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const { theme } = useTheme()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters - koHLabs themed
    const chars = '$koHLabs⚗️🧪🔬DNA⚛️01⚡💎🚀🌌👾🔮🎯💀⚛️'
    
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    
    // Array to keep track of drops
    const drops = new Array(columns).fill(0).map(() => ({
      y: Math.random() * canvas.height,
      speed: Math.random() * 2 + 1,
      char: chars[Math.floor(Math.random() * chars.length)],
      brightness: Math.random(),
      trail: []
    }))

    const draw = () => {
      // Black background with trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.08})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
      
      // Get theme color
      const primaryColor = theme.css['--theme-primary'] || '#00ff41'
      
      // Convert hex to RGB for manipulation
      const hex = primaryColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // Draw each character
      drops.forEach((drop, i) => {
        // Create trail effect
        drop.trail.unshift({ y: drop.y, brightness: drop.brightness })
        if (drop.trail.length > 15) drop.trail.pop()
        
        // Draw trail
        drop.trail.forEach((trail, trailIndex) => {
          const trailBrightness = trail.brightness * (1 - trailIndex / 15) * intensity
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailBrightness})`
          
          // Brightest at head
          if (trailIndex === 0) {
            ctx.shadowColor = primaryColor
            ctx.shadowBlur = 10
          } else {
            ctx.shadowBlur = 0
          }
          
          ctx.fillText(drop.char, i * fontSize, trail.y)
        })
        
        // Move drop down
        drop.y += drop.speed * fontSize
        
        // Reset drop if it goes off screen
        if (drop.y > canvas.height + 100) {
          drop.y = -100
          drop.char = chars[Math.floor(Math.random() * chars.length)]
          drop.brightness = Math.random()
          drop.speed = Math.random() * 3 + 1
          drop.trail = []
        }
        
        // Occasionally change character (glitch effect)
        if (Math.random() < 0.03) {
          drop.char = chars[Math.floor(Math.random() * chars.length)]
        }
      })
      
      ctx.shadowBlur = 0
    }

    const animate = () => {
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [intensity, theme])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ 
        background: 'black',
        opacity: intensity * 0.8,
        mixBlendMode: 'screen'
      }}
    />
  )
}

export default MatrixVideo